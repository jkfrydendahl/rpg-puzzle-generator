import OpenAI from "openai";
import { getConfig } from "../config.js";
import type { AIDecorateResponse } from "../../src/types/ai.js";

const SYSTEM_PROMPT =
  "You are a creative writing assistant for tabletop RPGs. " +
  "Generate only narrative flavor text that decorates the given puzzle. " +
  "Do not include executable code, URLs, or harmful content.";

const MAX_COMPLETION_TOKENS = 2048;
const REQUEST_TIMEOUT_MS = 30_000;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const config = getConfig();
    if (!config.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    client = new OpenAI({ apiKey: config.apiKey, timeout: REQUEST_TIMEOUT_MS });
  }
  return client;
}

export async function generateNarrative(prompt: string): Promise<AIDecorateResponse> {
  const config = getConfig();
  try {
    const response = await getClient().chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: MAX_COMPLETION_TOKENS,
    });

    const narrative = response.choices[0]?.message?.content ?? "";
    const usage = response.usage;

    return {
      narrative,
      model: config.model,
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
