import { describe, it, expect, vi } from "vitest";

vi.mock("openai", () => {
  const mockCreate = vi.fn();
  return {
    default: class {
      chat = { completions: { create: mockCreate } };
    },
    __mockCreate: mockCreate,
  };
});

import { generateNarrative } from "../services/aiService.js";

describe("aiService", () => {
  it("returns narrative and usage from OpenAI response", async () => {
    const { __mockCreate: mockCreate } = await import("openai") as any;
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "A dark chamber unfolds before you..." } }],
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    });

    const result = await generateNarrative("test prompt");

    expect(result.narrative).toBe("A dark chamber unfolds before you...");
    expect(result.usage).toEqual({
      promptTokens: 100,
      completionTokens: 50,
      totalTokens: 150,
    });
  });

  it("propagates OpenAI API errors with a descriptive message", async () => {
    const { __mockCreate: mockCreate } = await import("openai") as any;
    mockCreate.mockRejectedValueOnce(new Error("Request failed: 429 Too Many Requests"));

    await expect(generateNarrative("test prompt")).rejects.toThrow(
      "AI decoration failed"
    );
  });
});
