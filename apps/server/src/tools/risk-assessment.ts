import { riskAssessmentAdapter } from "@/client/adapters";
import { chat, toolDefinition } from "@tanstack/ai";
import { analystInputSchema, analystOutputSchema } from "@/chat/schema";
import { RISK_ASSESSMENT_PROMPT } from "@/chat/prompts";
import { searchInternet } from "./web-search";
import logger from "@/lib/logger";

export const analyzeRiskAndCompetitors = toolDefinition({
    name: "analyzeRiskAndCompetitors",
    description: "Evaluates the business idea from a Risk and Competitive Intelligence perspective.",
    inputSchema: analystInputSchema,
    outputSchema: analystOutputSchema,
}).server(async ({ prompt }) => {
    logger.info(`[Tool: analyzeRiskAndCompetitors] Initiating analysis for prompt: "${prompt}"`);
    
    const output = await chat({
        adapter: riskAssessmentAdapter,
        messages: [
            { role: "user", content: prompt },
        ],
        tools: [searchInternet],
        systemPrompts: [RISK_ASSESSMENT_PROMPT],
        stream: false
    });

    console.log(output);
    logger.info(`[Tool: analyzeRiskAndCompetitors] Completed analysis.`);
    return {
        response: output
    };
});
