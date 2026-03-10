import { describe, it, expect } from "vitest";
import { generatePuzzle } from "../lib/generatePuzzle.js";

describe("generatePuzzle", () => {
  it("produces a structurally complete puzzle with default options", () => {
    const puzzle = generatePuzzle({ rngSeed: 42 });

    expect(puzzle.id).toMatch(/^pzl-[0-9a-f]{4}-[0-9a-f]{4}$/);
    expect(puzzle.difficulty).toBe("medium");
    expect(puzzle.archetype).toBeTruthy();
    expect(puzzle.tags.length).toBeGreaterThan(0);
    expect(puzzle.interface.primary.length).toBeGreaterThan(0);
    expect(puzzle.solution.steps.length).toBeGreaterThan(0);
    expect(puzzle.solution.objective).toBeTruthy();
    expect(puzzle.solution.finalState).toBeTruthy();
    expect(puzzle.solution.internalLogic).toBeTruthy();
    expect(puzzle.clues.length).toBeGreaterThan(0);
    expect(puzzle.consequence).toBeTruthy();
    expect(puzzle.feedback.successSignals.length).toBeGreaterThan(0);
    expect(puzzle.feedback.failureSignals.length).toBeGreaterThan(0);
    expect(puzzle.hints).toHaveLength(3);
    expect(puzzle.gmNotes.pacingAdvice).toBeTruthy();
  });

  it("respects easy difficulty constraints", () => {
    const puzzle = generatePuzzle({
      seed: { difficulty: "easy" },
      rngSeed: 123,
    });

    expect(puzzle.difficulty).toBe("easy");
    expect(puzzle.solution.steps.length).toBeGreaterThanOrEqual(2);
    expect(puzzle.solution.steps.length).toBeLessThanOrEqual(3);
    expect(puzzle.twist).toBeUndefined();
    expect(puzzle.consequence.severity).toBe("low");
  });

  it("respects hard difficulty constraints", () => {
    const puzzle = generatePuzzle({
      seed: { difficulty: "hard" },
      rngSeed: 456,
    });

    expect(puzzle.difficulty).toBe("hard");
    expect(puzzle.solution.steps.length).toBeGreaterThanOrEqual(4);
    expect(puzzle.solution.steps.length).toBeLessThanOrEqual(5);
  });

  it("is deterministic with the same rngSeed", () => {
    const a = generatePuzzle({ rngSeed: 999, seed: { difficulty: "medium" } });
    const b = generatePuzzle({ rngSeed: 999, seed: { difficulty: "medium" } });

    expect(a.id).toBe(b.id);
    expect(a.archetype).toBe(b.archetype);
    expect(a.solution.steps).toEqual(b.solution.steps);
    expect(a.clues.length).toBe(b.clues.length);
  });

  it("accepts environment and tag constraints", () => {
    const puzzle = generatePuzzle({
      seed: {
        difficulty: "medium",
        environment: "Forgotten shrine",
        requiredTags: ["sigils"],
      },
      rngSeed: 77,
    });

    expect(puzzle.environment).toBe("Forgotten shrine");
  });

  it("generates different puzzles with different seeds", () => {
    const a = generatePuzzle({ rngSeed: 1 });
    const b = generatePuzzle({ rngSeed: 2 });
    // Very unlikely to be the same
    expect(a.id).not.toBe(b.id);
  });
});
