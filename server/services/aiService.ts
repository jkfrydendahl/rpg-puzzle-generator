import OpenAI from "openai";
import { getConfig } from "../config.js";
import type { AIDecorateResponse } from "../../src/types/ai.js";

const config = getConfig();

const client = new OpenAI({ apiKey: config.apiKey });

export async function generateNarrative(prompt: string): Promise<AIDecorateResponse> {
  try {
    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const narrative = response.choices[0]?.message?.content ?? "";
    const usage = response.usage;

    return {
      narrative,
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`AI decoration failed: ${message}`);
  }
}
