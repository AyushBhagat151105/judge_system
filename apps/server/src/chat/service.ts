import { judgeModelAdapter } from "@/client/adapters";
import { chat, EventType } from "@tanstack/ai";
import { analyzeTechnicalFeasibility, analyzeMarketViability, analyzeRiskAndCompetitors } from "@/tools";
import logger from "@/lib/logger";
import { EvaluationReportSchema } from "./schema";
import { LEAD_JUDGE_SYNTHESIS_PROMPT, getSynthesisPrompt } from "./prompts";
import prisma from "@judge_system/db";

process.on("uncaughtException", (error) => {
    logger.error(`[Process] Uncaught Exception: ${error.message}`, { stack: error.stack });
});

process.on("unhandledRejection", (reason: any) => {
    logger.error(`[Process] Unhandled Rejection: ${reason?.message || reason}`, { stack: reason?.stack });
});

export async function* createChatService(messages: any[], userId?: string | null, clientIp?: string) {
    logger.info(`[Lead Judge] Initializing coordinator with ${messages.length} messages`);
    
    // Normalize messages to be robust against strings and legacy/simplified formats
    const normalizedMessages = messages.map((msg) => {
        if (typeof msg === "string") {
            return {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                role: "user" as const,
                parts: [{ type: "text" as const, content: msg }]
            };
        }
        if (msg && typeof msg === "object" && !("parts" in msg)) {
            return {
                id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                role: (msg.role || "user") as "user" | "assistant" | "system",
                parts: [{ type: "text" as const, content: msg.content || "" }]
            };
        }
        return msg;
    });

    const lastUserMessage = normalizedMessages.filter(m => m.role === "user").pop();
    const prompt = lastUserMessage?.parts?.[0]?.content || "";

    logger.info("[Lead Judge] Starting concurrent execution of analyst tools...");
    
    const [techResult, marketResult, riskResult] = await Promise.all([
        analyzeTechnicalFeasibility.execute!({ prompt }),
        analyzeMarketViability.execute!({ prompt }),
        analyzeRiskAndCompetitors.execute!({ prompt })
    ]);

    logger.info("[Lead Judge] Analyst reports successfully retrieved. Compiling prompt...");
    const synthesisPrompt = getSynthesisPrompt(techResult.response, marketResult.response, riskResult.response);

    logger.info("[Lead Judge] Executing coordinator synthesis with outputSchema...");

    const stream = chat({
        adapter: judgeModelAdapter,
        messages: [
            ...normalizedMessages.slice(0, -1),
            { 
                role: "user" as const, 
                parts: [{ type: "text" as const, content: prompt + "\n\n" + synthesisPrompt }] 
            }
        ],
        systemPrompts: [LEAD_JUDGE_SYNTHESIS_PROMPT],
        outputSchema: EvaluationReportSchema,
        stream: true
    });

    let completedObject: any = null;
    for await (const chunk of stream) {
        if (chunk.type === EventType.CUSTOM && chunk.name === 'structured-output.complete') {
            completedObject = chunk.value.object;
        }
        if (chunk.type === EventType.TEXT_MESSAGE_CONTENT) {
            const { content, ...rest } = chunk as any;
            yield rest;
        } else {
            yield chunk;
        }
    }

    if (completedObject) {
        try {
            logger.info(`[Lead Judge] Saving completed evaluation report to database...`);
            await prisma.evaluation.create({
                data: {
                    userId: userId || null,
                    ipAddress: clientIp || null,
                    prompt,
                    report: completedObject
                }
            });
            logger.info(`[Lead Judge] Report saved successfully.`);
        } catch (dbError: any) {
            logger.error(`[Lead Judge] Failed to save report to database: ${dbError.message}`, { stack: dbError.stack });
        }
    }

    logger.info("[Lead Judge] Stream completed successfully.");
}
