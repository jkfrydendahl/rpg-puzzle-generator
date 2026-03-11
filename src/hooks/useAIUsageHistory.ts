import type { AIUsage } from "../types/ai.js";

const STORAGE_KEY = "rpg-puzzle-ai-usage";

/** Per-token pricing for cost estimation (USD). */
const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15 / 1_000_000, output: 0.60 / 1_000_000 },
  "gpt-4o": { input: 2.50 / 1_000_000, output: 10.00 / 1_000_000 },
};

const DEFAULT_PRICING = PRICING["gpt-4o-mini"];

type UsageEntry = AIUsage & { model?: string };

function isValidEntry(e: unknown): e is UsageEntry {
  return (
    typeof e === "object" &&
    e !== null &&
    typeof (e as UsageEntry).promptTokens === "number" &&
    typeof (e as UsageEntry).completionTokens === "number" &&
    typeof (e as UsageEntry).totalTokens === "number"
  );
}

export type UsageSummary = {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  generationCount: number;
};

export function createUsageTracker() {
  function loadEntries(): UsageEntry[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidEntry);
    } catch {
      return [];
    }
  }

  function saveEntries(entries: UsageEntry[]): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function record(usage: AIUsage, model?: string): void {
    const entries = loadEntries();
    entries.push({ ...usage, model });
    saveEntries(entries);
  }

  function getEntries(): UsageEntry[] {
    return loadEntries();
  }

  function getSummary(): UsageSummary {
    const entries = loadEntries();
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;
    let estimatedCost = 0;

    for (const e of entries) {
      totalPromptTokens += e.promptTokens;
      totalCompletionTokens += e.completionTokens;
      totalTokens += e.totalTokens;
      const pricing = (e.model ? PRICING[e.model] : undefined) ?? DEFAULT_PRICING;
      estimatedCost +=
        e.promptTokens * pricing.input +
        e.completionTokens * pricing.output;
    }

    return {
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      estimatedCost,
      generationCount: entries.length,
    };
  }

  return { record, getEntries, getSummary };
}
