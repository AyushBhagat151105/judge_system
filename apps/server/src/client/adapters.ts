import { env } from "@judge_system/env/server";
import { OpenAIChatCompletionsTextAdapter } from "@tanstack/ai-openai";

export class NvidiaChatCompletionsTextAdapter extends OpenAIChatCompletionsTextAdapter<any> {
    constructor(apiKey: string, model: string = "z-ai/glm-5.2") {
        super({
            apiKey,
            baseURL: "https://integrate.api.nvidia.com/v1"
        }, model as any);

        const originalCreate = this.client.chat.completions.create.bind(this.client.chat.completions);
        this.client.chat.completions.create = function (body: any, options: any) {
            if (body && typeof body === "object") {
                const { stream_options, ...rest } = body;
                return originalCreate(rest, options);
            }
            return originalCreate(body, options);
        } as any;
    }
}

export const adapter_glm = new NvidiaChatCompletionsTextAdapter(env.JUDGE_SYSTEM_API_KEY);
export const judgeModelAdapter = new NvidiaChatCompletionsTextAdapter(env.JUDGE_SYSTEM_API_KEY, "meta/llama-3.1-70b-instruct");
export const techFeasibilityAdapter = new NvidiaChatCompletionsTextAdapter(env.JUDGE_SYSTEM_API_KEY, "mistralai/codestral-22b-instruct-v0.1");
export const marketViabilityAdapter = new NvidiaChatCompletionsTextAdapter(env.JUDGE_SYSTEM_API_KEY, "writer/palmyra-fin-70b-32k");
export const riskAssessmentAdapter = new NvidiaChatCompletionsTextAdapter(env.JUDGE_SYSTEM_API_KEY, "nvidia/llama-3.1-nemotron-51b-instruct");