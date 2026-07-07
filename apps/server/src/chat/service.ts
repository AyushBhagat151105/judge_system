import { judgeModelAdapter } from "@/client/adapters";
import { chat } from "@tanstack/ai";
import { analyzeTechnicalFeasibility, analyzeMarketViability, analyzeRiskAndCompetitors } from "@/tools";
import logger from "@/lib/logger";
import { EvaluationReportSchema } from "./schema";
import { LEAD_JUDGE_SYNTHESIS_PROMPT } from "./prompts";

process.on("uncaughtException", (error) => {
    logger.error(`[Process] Uncaught Exception: ${error.message}`, { stack: error.stack });
});

process.on("unhandledRejection", (reason: any) => {
    logger.error(`[Process] Unhandled Rejection: ${reason?.message || reason}`, { stack: reason?.stack });
});

export async function* createChatService(messages: any[]) {
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

    const synthesisPrompt = `
Here are the reports from your specialized analysts:

=== PRODUCT & TECHNICAL FEASIBILITY REPORT ===
${techResult.response}

=== MARKET & FINANCIAL VIABILITY REPORT ===
${marketResult.response}

=== RISK & COMPETITIVE INTELLIGENCE REPORT ===
${riskResult.response}

You MUST synthesize these findings and compile your final investment evaluation report. 
Your final response MUST be a complete JSON object conforming to the required schema. Ensure you generate all of the following keys:
1. "businessName" - Name of the business/concept.
2. "tagline" - Catchy description.
3. "executiveSummary" - Detailed VC synthesis in markdown format.
4. "innovationRating" - Object with "score" and "rationale".
5. "technicalFeasibility" - Object with "score", "summary", "challenges", "recommendedStack", "timeToMVP", "searchQueriesPerformed", and "packageRecommendations" (each recommendation must have "name" and "purpose").
6. "marketViability" - Object with "score", "summary", "opportunities", "targetAudience", "monetizationModels", "financialProjections" (with "fundingNeeds" and "breakEvenTime"), "searchQueriesPerformed", and "marketTrends".
7. "riskAssessment" - Object with "score", "summary", "mitigationStrategies", "competitorAnalysis", "regulatoryConcerns", "searchQueriesPerformed", and "competitorList" (each competitor must have "name", "url", and "moat").
8. "swotAnalysis" - Object with "strengths", "weaknesses", "opportunities", and "threats" arrays.
9. "prosAndCons" - Object with "pros" and "cons" arrays.
10. "finalVerdict" - Must be one of: "APPROVED", "NEEDS_REVISION", "REJECTED".
11. "confidenceScore" - Confidence score out of 10.
12. "actionableRecommendations" - Array of actionable roadmap steps.

Do NOT omit any of these keys. The JSON object must be fully completed and closed properly.
`;

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

    for await (const chunk of stream) {
        if (chunk.type === "TEXT_MESSAGE_CONTENT") {
            const { content, ...rest } = chunk as any;
            yield rest;
        } else {
            yield chunk;
        }
    }

    logger.info("[Lead Judge] Stream completed successfully.");
}
