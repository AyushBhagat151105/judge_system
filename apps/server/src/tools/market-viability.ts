import { marketViabilityAdapter } from "@/client/adapters";
import { chat, toolDefinition } from "@tanstack/ai";
import { analystInputSchema, analystOutputSchema } from "@/chat/schema";
import { MARKET_VIABILITY_PROMPT } from "@/chat/prompts";
import { searchInternet } from "./web-search";
import logger from "@/lib/logger";

export const analyzeMarketViability = toolDefinition({
    name: "analyzeMarketViability",
    description: "Evaluates the business idea from a Market and Financial Viability perspective.",
    inputSchema: analystInputSchema,
    outputSchema: analystOutputSchema,
}).server(async ({ prompt }) => {
    logger.info(`[Tool: analyzeMarketViability] Initiating analysis for prompt: "${prompt}"`);
    
    const output = await chat({
        adapter: marketViabilityAdapter,
        messages: [
            { role: "user", content: prompt },
        ],
        tools: [searchInternet],
        systemPrompts: [MARKET_VIABILITY_PROMPT],
        stream: false
    });

    console.log(output);
    logger.info(`[Tool: analyzeMarketViability] Completed analysis.`);
    return {
        response: output
    };
});
