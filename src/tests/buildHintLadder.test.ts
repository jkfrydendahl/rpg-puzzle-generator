import { describe, it, expect } from "vitest";
import { buildHintLadder } from "../lib/buildHintLadder.js";
import type { PuzzleSolution, PuzzleClue } from "../types/puzzle.js";

describe("buildHintLadder", () => {
  const solution: PuzzleSolution = {
    objective: "Activate the Lever Array in the correct sequence.",
    steps: ["Pull lever 1", "Pull lever 3", "Pull lever 2"],
    finalState: "All levers activated.",
    internalLogic: "Order: 1, 3, 2.",
  };

  const clues: PuzzleClue[] = [
    {
      source: "Inscription",
      content: 'An ancient inscription reads: "Begin with the first, end with the second"',
      directness: "partial",
      pointsTo: ["step-1"],
    },
  ];

  it("produces exactly 3 hints", () => {
    const hints = buildHintLadder(solution, clues, "Lever Array");
    expect(hints).toHaveLength(3);
  });

  it("hint 1 reframes attention toward the interface", () => {
    const hints = buildHintLadder(solution, clues, "Lever Array");
    expect(hints[0]).toContain("Lever Array");
  });

  it("hint 2 connects clues to the mechanism", () => {
    const hints = buildHintLadder(solution, clues, "Lever Array");
    expect(hints[1]).toContain("Inscription");
    expect(hints[1]).toContain("Lever Array");
  });

  it("hint 3 reveals the next step", () => {
    const hints = buildHintLadder(solution, clues, "Lever Array");
    expect(hints[2]).toContain("Pull lever 1");
  });

  it("handles empty clues gracefully", () => {
    const hints = buildHintLadder(solution, [], "Lever Array");
    expect(hints).toHaveLength(3);
    expect(hints[1]).toContain("Lever Array");
  });
});
