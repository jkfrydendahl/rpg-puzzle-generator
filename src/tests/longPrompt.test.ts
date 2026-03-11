import { describe, it, expect, vi } from "vitest";
import { createAIDecoration } from "../hooks/useAIDecoration.js";
import type { AIDecorateResponse } from "../types/ai.js";

describe("Boundary: very long prompt", () => {
  it("accepts a very long puzzle prompt without error (S32)", async () => {
    const longPrompt = "A ".repeat(10_000); // ~20k chars
    const states: { narrative: string | null; loading: boolean; error: string | null }[] = [];
    const fetchFn = vi.fn().mockResolvedValue({
      narrative: "Long narrative response",
      usage: { promptTokens: 5000, completionTokens: 500, totalTokens: 5500 },
    } satisfies AIDecorateResponse);

    const { decorate } = createAIDecoration(fetchFn, (s) => states.push({ ...s }));

    await decorate(longPrompt);

    expect(fetchFn).toHaveBeenCalledWith(longPrompt);
    expect(states[states.length - 1].narrative).toBe("Long narrative response");
    expect(states[states.length - 1].error).toBeNull();
  });
});
