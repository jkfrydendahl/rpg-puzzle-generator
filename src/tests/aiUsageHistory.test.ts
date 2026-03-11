import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AIUsage } from "../types/ai.js";

// Minimal mock for sessionStorage
const store: Record<string, string> = {};
const mockSessionStorage = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { for (const k in store) delete store[k]; }),
  length: 0,
  key: vi.fn(() => null),
};

describe("AIUsageHistory", () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    vi.stubGlobal("sessionStorage", mockSessionStorage);
  });

  it("records a usage entry (S13)", async () => {
    const { createUsageTracker } = await import("../hooks/useAIUsageHistory.js");
    const tracker = createUsageTracker();

    const usage: AIUsage = { promptTokens: 100, completionTokens: 50, totalTokens: 150 };
    tracker.record(usage);

    expect(tracker.getEntries()).toHaveLength(1);
    expect(tracker.getEntries()[0]).toEqual(usage);
  });

  it("computes cumulative tokens and estimated cost (S14)", async () => {
    const { createUsageTracker } = await import("../hooks/useAIUsageHistory.js");
    const tracker = createUsageTracker();

    tracker.record({ promptTokens: 100, completionTokens: 50, totalTokens: 150 });
    tracker.record({ promptTokens: 200, completionTokens: 100, totalTokens: 300 });

    const summary = tracker.getSummary();
    expect(summary.totalTokens).toBe(450);
    expect(summary.totalPromptTokens).toBe(300);
    expect(summary.totalCompletionTokens).toBe(150);
    expect(summary.estimatedCost).toBeGreaterThan(0);
    expect(summary.generationCount).toBe(2);
  });

  it("persists entries to sessionStorage (S15)", async () => {
    const { createUsageTracker } = await import("../hooks/useAIUsageHistory.js");
    const tracker = createUsageTracker();

    tracker.record({ promptTokens: 50, completionTokens: 25, totalTokens: 75 });

    expect(mockSessionStorage.setItem).toHaveBeenCalled();
    // Verify a new tracker reads from storage
    const tracker2 = createUsageTracker();
    expect(tracker2.getEntries()).toHaveLength(1);
  });

  it("handles zero token usage entries (S31)", async () => {
    const { createUsageTracker } = await import("../hooks/useAIUsageHistory.js");
    const tracker = createUsageTracker();

    tracker.record({ promptTokens: 0, completionTokens: 0, totalTokens: 0 });

    const summary = tracker.getSummary();
    expect(summary.totalTokens).toBe(0);
    expect(summary.estimatedCost).toBe(0);
    expect(summary.generationCount).toBe(1);
  });
});
