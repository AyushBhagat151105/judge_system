import { techFeasibilityAdapter } from "@/client/adapters";
import { chat, toolDefinition } from "@tanstack/ai";
import { analystInputSchema, analystOutputSchema } from "@/chat/schema";
import { PRODUCT_FEASIBILITY_PROMPT } from "@/chat/prompts";
import { searchInternet } from "./web-search";
import logger from "@/lib/logger";

export const analyzeTechnicalFeasibility = toolDefinition({
    name: "analyzeTechnicalFeasibility",
    description: "Evaluates the business idea from a Product and Technical Feasibility perspective.",
    inputSchema: analystInputSchema,
    outputSchema: analystOutputSchema,
}).server(async ({ prompt }) => {
    logger.info(`[Tool: analyzeTechnicalFeasibility] Initiating analysis for prompt: "${prompt}"`);
    
    const output = await chat({
        adapter: techFeasibilityAdapter,
        messages: [
            { role: "user", content: prompt },
        ],
        tools: [searchInternet],
        systemPrompts: [PRODUCT_FEASIBILITY_PROMPT],
        stream: false
    });

    console.log(output);
    logger.info(`[Tool: analyzeTechnicalFeasibility] Completed analysis.`);
    return {
        response: output
    };
});
