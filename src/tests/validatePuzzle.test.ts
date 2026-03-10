import { describe, it, expect } from "vitest";
import { validatePuzzle, type ValidationResult } from "../lib/validatePuzzle.js";
import { generatePuzzle } from "../lib/generatePuzzle.js";
import type { GeneratedPuzzle } from "../types/puzzle.js";

describe("validatePuzzle", () => {
  it("validates a well-formed generated puzzle", () => {
    const puzzle = generatePuzzle({ rngSeed: 42 });
    const result = validatePuzzle(puzzle);

    expect(result.isSolvable).toBe(true);
    expect(result.clueCoverage).toBe(1);
    expect(result.errors).toHaveLength(0);
  });

  it("detects missing clues for a step", () => {
    const puzzle = generatePuzzle({ rngSeed: 42 });
    // Remove all clue coverage for step-1
    const broken: GeneratedPuzzle = {
      ...puzzle,
      clues: puzzle.clues.filter((c) => !c.pointsTo.includes("step-1")),
    };

    const result = validatePuzzle(broken);
    expect(result.isSolvable).toBe(false);
    expect(result.errors.some((e) => e.includes("Step 1"))).toBe(true);
  });

  it("detects too many steps for easy difficulty", () => {
    const puzzle = generatePuzzle({ rngSeed: 42, seed: { difficulty: "easy" } });
    const broken: GeneratedPuzzle = {
      ...puzzle,
      solution: {
        ...puzzle.solution,
        steps: ["s1", "s2", "s3", "s4", "s5"],
      },
    };

    const result = validatePuzzle(broken);
    expect(result.errors.some((e) => e.includes("Too many steps"))).toBe(true);
  });

  it("detects twist not allowed on easy", () => {
    const puzzle = generatePuzzle({ rngSeed: 42, seed: { difficulty: "easy" } });
    const broken: GeneratedPuzzle = {
      ...puzzle,
      twist: { type: "Test Twist", effect: "test" },
    };

    const result = validatePuzzle(broken);
    expect(result.errors.some((e) => e.includes("Twist not allowed"))).toBe(true);
  });

  it("detects consequence severity too high for difficulty", () => {
    const puzzle = generatePuzzle({ rngSeed: 42, seed: { difficulty: "easy" } });
    const broken: GeneratedPuzzle = {
      ...puzzle,
      consequence: { type: "Flooding", severity: "high", behavior: "test" },
    };

    const result = validatePuzzle(broken);
    expect(result.errors.some((e) => e.includes("Consequence severity"))).toBe(true);
  });

  it("reports full clue coverage for all difficulties", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const puzzle = generatePuzzle({ rngSeed: 500, seed: { difficulty } });
      const result = validatePuzzle(puzzle);
      expect(result.clueCoverage).toBe(1);
    }
  });
});
