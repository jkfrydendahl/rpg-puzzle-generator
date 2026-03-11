/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagnosticsPanel } from "../components/puzzle/DiagnosticsPanel.js";
import type { PuzzleScore } from "../lib/scorePuzzle.js";
import type { AIUsage } from "../types/ai.js";
import type { UsageSummary } from "../hooks/useAIUsageHistory.js";

const stubScore: PuzzleScore = {
  overall: 80,
  breakdown: {
    solvability: 85,
    clueCoverage: 90,
    difficultyFit: 75,
    tensionBalance: 70,
    gmUsability: 80,
  },
};

const stubPuzzle = {
  id: "test",
  archetype: "Test",
  difficulty: "medium",
  tags: [],
  interface: { primary: ["x"] },
  solution: { objective: "x", steps: ["a"], finalState: "x", internalLogic: "x" },
  clues: [],
  consequence: { type: "t", severity: "medium", behavior: "b" },
  feedback: { successSignals: [], failureSignals: [], partialProgressSignals: [] },
  hints: [],
  gmNotes: { pacingAdvice: "x", likelyMisreads: [], bypassIdeas: [] },
  validation: { isSolvable: true, clueCoverage: 1, contradictionWarnings: [], softWarnings: [] },
};

describe("DiagnosticsPanel AI usage", () => {
  it("shows token usage for current generation (S24)", () => {
    const currentUsage: AIUsage = {
      promptTokens: 150,
      completionTokens: 300,
      totalTokens: 450,
    };

    render(
      <DiagnosticsPanel
        puzzle={stubPuzzle as any}
        score={stubScore}
        currentAIUsage={currentUsage}
      />,
    );

    expect(screen.getByText(/150/)).toBeDefined();
    expect(screen.getByText(/300/)).toBeDefined();
  });

  it("shows cumulative session cost (S25)", () => {
    const summary: UsageSummary = {
      totalPromptTokens: 500,
      totalCompletionTokens: 1000,
      totalTokens: 1500,
      estimatedCost: 0.00068,
      generationCount: 3,
    };

    render(
      <DiagnosticsPanel
        puzzle={stubPuzzle as any}
        score={stubScore}
        usageSummary={summary}
      />,
    );

    expect(screen.getByText(/3 generations/i)).toBeDefined();
    expect(screen.getByText(/\$0\.00/)).toBeDefined();
  });
});
