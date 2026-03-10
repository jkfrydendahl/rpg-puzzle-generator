/**
 * Heuristic invariant tests.
 *
 * These verify structural guarantees that must hold for EVERY
 * generated puzzle regardless of seed, difficulty, or randomness.
 *
 * From the implementation plan:
 *  - puzzle always has clues
 *  - puzzle always has solution steps
 *  - every solution step is clued
 *  - difficulty scaling consistent
 *  - consequences within allowed severity
 *  - easy puzzles do not contain misleading clues
 */

import { describe, it, expect } from "vitest";
import { generatePuzzle } from "../lib/generatePuzzle.js";
import { difficultyProfiles } from "../data/difficultyProfiles.js";
import type { PuzzleDifficulty } from "../types/puzzle.js";

const SEEDS = [1, 7, 42, 99, 123, 256, 500, 777, 888, 1024];
const DIFFICULTIES: PuzzleDifficulty[] = ["easy", "medium", "hard"];

describe("heuristic invariants", () => {
  // Generate a matrix of puzzles across seeds × difficulties
  for (const difficulty of DIFFICULTIES) {
    for (const seed of SEEDS) {
      const label = `[${difficulty} seed=${seed}]`;

      it(`${label} always has solution steps`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(puzzle.solution.steps.length).toBeGreaterThan(0);
      });

      it(`${label} always has clues`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(puzzle.clues.length).toBeGreaterThan(0);
      });

      it(`${label} every solution step is clued`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        for (let i = 0; i < puzzle.solution.steps.length; i++) {
          const stepRef = `step-${i + 1}`;
          const covering = puzzle.clues.filter((c) => c.pointsTo.includes(stepRef));
          expect(
            covering.length,
            `Step ${i + 1} has no clues pointing to it`,
          ).toBeGreaterThan(0);
        }
      });

      it(`${label} step count fits difficulty profile`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        const profile = difficultyProfiles.find((p) => p.id === difficulty)!;
        expect(puzzle.solution.steps.length).toBeGreaterThanOrEqual(profile.minSteps);
        expect(puzzle.solution.steps.length).toBeLessThanOrEqual(profile.maxSteps);
      });

      it(`${label} consequence severity within difficulty bounds`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        const profile = difficultyProfiles.find((p) => p.id === difficulty)!;
        const order: Record<string, number> = { low: 0, medium: 1, high: 2 };
        expect(order[puzzle.consequence.severity]).toBeLessThanOrEqual(
          order[profile.maxConsequenceSeverity],
        );
      });

      it(`${label} validation reports solvable`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(puzzle.validation.isSolvable).toBe(true);
      });

      it(`${label} clue coverage is 100%`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(puzzle.validation.clueCoverage).toBe(1);
      });

      it(`${label} has exactly 3 hints`, () => {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(puzzle.hints).toHaveLength(3);
      });
    }
  }

  // Easy-specific constraints
  for (const seed of SEEDS) {
    it(`[easy seed=${seed}] no twist on easy difficulty`, () => {
      const puzzle = generatePuzzle({ seed: { difficulty: "easy" }, rngSeed: seed });
      expect(puzzle.twist).toBeUndefined();
    });

    it(`[easy seed=${seed}] no misleading clues on easy difficulty`, () => {
      const puzzle = generatePuzzle({ seed: { difficulty: "easy" }, rngSeed: seed });
      const misleading = puzzle.clues.filter(
        (c) => c.directness === "indirect" && c.source.toLowerCase().includes("mislead"),
      );
      expect(misleading).toHaveLength(0);
    });
  }

  // Structural shape checks (any difficulty)
  for (const seed of SEEDS) {
    it(`[seed=${seed}] has non-empty objective, finalState, and internalLogic`, () => {
      const puzzle = generatePuzzle({ rngSeed: seed });
      expect(puzzle.solution.objective).toBeTruthy();
      expect(puzzle.solution.finalState).toBeTruthy();
      expect(puzzle.solution.internalLogic).toBeTruthy();
    });

    it(`[seed=${seed}] has feedback signals`, () => {
      const puzzle = generatePuzzle({ rngSeed: seed });
      expect(puzzle.feedback.successSignals.length).toBeGreaterThan(0);
      expect(puzzle.feedback.failureSignals.length).toBeGreaterThan(0);
    });

    it(`[seed=${seed}] gmNotes are populated`, () => {
      const puzzle = generatePuzzle({ rngSeed: seed });
      expect(puzzle.gmNotes.pacingAdvice).toBeTruthy();
      expect(puzzle.gmNotes.likelyMisreads.length).toBeGreaterThan(0);
      expect(puzzle.gmNotes.bypassIdeas.length).toBeGreaterThan(0);
    });

    it(`[seed=${seed}] interface has at least one primary entry`, () => {
      const puzzle = generatePuzzle({ rngSeed: seed });
      expect(puzzle.interface.primary.length).toBeGreaterThan(0);
    });

    it(`[seed=${seed}] no contradiction warnings on non-hard`, () => {
      const puzzle = generatePuzzle({ seed: { difficulty: "medium" }, rngSeed: seed });
      expect(puzzle.validation.contradictionWarnings).toHaveLength(0);
    });
  }
});
