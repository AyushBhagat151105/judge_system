import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { tavily } from "@tavily/core";
import { env } from "@judge_system/env/server";
import logger from "@/lib/logger";

export const searchInternet = toolDefinition({
    name: "searchInternet",
    description: "Queries the live internet using Tavily to search for real-world competitor data, market trends, compliance details, and technology package names.",
    inputSchema: z.object({
        query: z.string().describe("The search query to lookup on the web.")
    }),
    outputSchema: z.object({
        results: z.string().describe("A summary of the web search results, snippets, and references.")
    })
}).server(async ({ query }) => {
    logger.info(`[Tool: searchInternet] Querying Tavily: "${query}"`);
    try {
        const tvly = tavily({ apiKey: env.TAVILY_API_KEY });
        const response = await tvly.search(query, {
            searchDepth: "basic",
            maxResults: 5
        });

        const formattedResults = response.results.map((result: any, i: number) => {
            return `Result ${i + 1}:\nTitle: ${result.title}\nURL: ${result.url}\nContent: ${result.content}\n`;
        }).join("\n---\n\n");

        logger.info(`[Tool: searchInternet] Successfully retrieved ${response.results.length} results.`);
        return {
            results: formattedResults || "No relevant search results found."
        };
    } catch (error: any) {
        logger.error(`[Tool: searchInternet] Failed to perform search: ${error.message || error}`, { stack: error.stack });
        return {
            results: `Error querying the web search API: ${error.message || error}`
        };
    }
});
