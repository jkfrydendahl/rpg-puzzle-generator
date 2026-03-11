import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("aiClient", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts prompt and returns typed response (S8)", async () => {
    const mockResponse = {
      narrative: "Ancient glyphs shimmer...",
      usage: { promptTokens: 50, completionTokens: 30, totalTokens: 80 },
      model: "gpt-4o-mini",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { decoratePuzzle } = await import("../services/aiClient.js");
    const result = await decoratePuzzle("test prompt");

    expect(mockFetch).toHaveBeenCalledWith("/api/decorate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "test prompt" }),
      signal: undefined,
    });
    expect(result).toEqual(mockResponse);
  });

  it("surfaces server error as rejected promise (S9)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "AI decoration failed: key not set" }),
    });

    const { decoratePuzzle } = await import("../services/aiClient.js");

    await expect(decoratePuzzle("test")).rejects.toThrow("AI decoration failed");
  });
});
