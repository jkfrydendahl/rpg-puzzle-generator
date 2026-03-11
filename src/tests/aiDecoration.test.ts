import { describe, it, expect, vi } from "vitest";
import {
  createAIDecoration,
  type AIDecorationState,
} from "../hooks/useAIDecoration.js";
import type { AIDecorateResponse } from "../types/ai.js";

function makeResponse(narrative = "A decorated tale"): AIDecorateResponse {
  return {
    narrative,
    usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    model: "gpt-4o-mini",
  };
}

describe("createAIDecoration", () => {
  it("transitions loading → narrative → done (S10)", async () => {
    const states: AIDecorationState[] = [];
    const fetchFn = vi.fn().mockResolvedValue(makeResponse());

    const { decorate } = createAIDecoration(fetchFn, (s) => states.push({ ...s }));

    await decorate("test prompt");

    // First state change: loading = true
    expect(states[0]).toEqual({
      narrative: null,
      loading: true,
      error: null,
    });

    // Final state: loading = false, narrative populated
    const last = states[states.length - 1];
    expect(last.loading).toBe(false);
    expect(last.narrative).toBe("A decorated tale");
    expect(last.error).toBeNull();
  });

  it("sets error state on failure (S11)", async () => {
    const states: AIDecorationState[] = [];
    const fetchFn = vi.fn().mockRejectedValue(new Error("Network down"));

    const { decorate } = createAIDecoration(fetchFn, (s) => states.push({ ...s }));

    await decorate("test prompt");

    const last = states[states.length - 1];
    expect(last.loading).toBe(false);
    expect(last.narrative).toBeNull();
    expect(last.error).toBe("Network down");
  });

  it("clears previous narrative on re-decorate (S12)", async () => {
    const states: AIDecorationState[] = [];
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(makeResponse("First"))
      .mockResolvedValueOnce(makeResponse("Second"));

    const { decorate } = createAIDecoration(fetchFn, (s) => states.push({ ...s }));

    await decorate("prompt 1");
    expect(states[states.length - 1].narrative).toBe("First");

    // Re-decorate clears previous narrative before loading
    await decorate("prompt 2");
    // The first state after the second call should have narrative cleared
    const reDecorateStart = states.find(
      (s, i) => i > 1 && s.loading && s.narrative === null,
    );
    expect(reDecorateStart).toBeDefined();

    // Final state has new narrative
    expect(states[states.length - 1].narrative).toBe("Second");
  });

  it("concurrent requests — only latest wins (S33)", async () => {
    const states: AIDecorationState[] = [];
    let resolveFirst!: (v: AIDecorateResponse) => void;
    let resolveSecond!: (v: AIDecorateResponse) => void;

    const fetchFn = vi
      .fn()
      .mockImplementationOnce(
        () => new Promise<AIDecorateResponse>((r) => (resolveFirst = r)),
      )
      .mockImplementationOnce(
        () => new Promise<AIDecorateResponse>((r) => (resolveSecond = r)),
      );

    const { decorate } = createAIDecoration(fetchFn, (s) => states.push({ ...s }));

    // Fire two concurrent requests
    const p1 = decorate("first");
    const p2 = decorate("second");

    // Resolve second first, then first
    resolveSecond(makeResponse("Second wins"));
    await p2;

    resolveFirst(makeResponse("First stale"));
    await p1;

    // Only the latest (second) should be in final state
    const last = states[states.length - 1];
    expect(last.narrative).toBe("Second wins");
  });

  it("clearNarrative resets state", () => {
    const states: AIDecorationState[] = [];
    const fetchFn = vi.fn().mockResolvedValue(makeResponse());

    const { clearNarrative } = createAIDecoration(fetchFn, (s) =>
      states.push({ ...s }),
    );

    clearNarrative();
    const last = states[states.length - 1];
    expect(last).toEqual({ narrative: null, loading: false, error: null });
  });

  it("calls onUsage callback with usage data on success", async () => {
    const onUsage = vi.fn();
    const fetchFn = vi.fn().mockResolvedValue(makeResponse());

    const { decorate } = createAIDecoration(fetchFn, () => {}, onUsage);

    await decorate("test prompt");

    expect(onUsage).toHaveBeenCalledOnce();
    expect(onUsage).toHaveBeenCalledWith(
      { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      "gpt-4o-mini",
    );
  });

  it("does not call onUsage on failure", async () => {
    const onUsage = vi.fn();
    const fetchFn = vi.fn().mockRejectedValue(new Error("fail"));

    const { decorate } = createAIDecoration(fetchFn, () => {}, onUsage);

    await decorate("test prompt");

    expect(onUsage).not.toHaveBeenCalled();
  });
});
