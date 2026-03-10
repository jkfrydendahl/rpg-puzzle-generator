/**
 * Bulk / snapshot-style generation tests.
 *
 * Generate many puzzles across different parameter combinations
 * and verify aggregate patterns hold: variety, determinism, and
 * that all archetypes/environments can produce valid puzzles.
 */

import { describe, it, expect } from "vitest";
import { generatePuzzle } from "../lib/generatePuzzle.js";
import { scorePuzzle } from "../lib/scorePuzzle.js";
import { archetypes } from "../data/archetypes.js";
import { environments } from "../data/environments.js";
import type { PuzzleDifficulty } from "../types/puzzle.js";

describe("bulk generation", () => {
  it("generates 50 valid puzzles with random seeds", () => {
    const failures: string[] = [];

    for (let seed = 1; seed <= 50; seed++) {
      const puzzle = generatePuzzle({ rngSeed: seed });
      if (!puzzle.validation.isSolvable) {
        failures.push(`seed=${seed}: not solvable`);
      }
      if (puzzle.validation.clueCoverage < 1) {
        failures.push(`seed=${seed}: clue coverage ${puzzle.validation.clueCoverage}`);
      }
    }

    expect(failures, failures.join("\n")).toHaveLength(0);
  });

  it("produces variety across 30 seeds — not all identical archetypes", () => {
    const archetypesSeen = new Set<string>();

    for (let seed = 1; seed <= 30; seed++) {
      const puzzle = generatePuzzle({ rngSeed: seed });
      archetypesSeen.add(puzzle.archetype);
    }

    // With 16 archetypes and 30 seeds, we expect at least 3 different ones
    expect(archetypesSeen.size).toBeGreaterThanOrEqual(3);
  });

  it("produces variety across difficulties", () => {
    const difficulties: PuzzleDifficulty[] = ["easy", "medium", "hard"];
    const stepCounts: Record<PuzzleDifficulty, number[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    for (const difficulty of difficulties) {
      for (let seed = 1; seed <= 20; seed++) {
        const puzzle = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        stepCounts[difficulty].push(puzzle.solution.steps.length);
      }
    }

    // Easy puzzles should generally have fewer steps than hard
    const avgEasy = stepCounts.easy.reduce((a, b) => a + b, 0) / stepCounts.easy.length;
    const avgHard = stepCounts.hard.reduce((a, b) => a + b, 0) / stepCounts.hard.length;
    expect(avgHard).toBeGreaterThan(avgEasy);
  });

  it("every archetype can produce a valid puzzle", () => {
    const failures: string[] = [];

    for (const arch of archetypes) {
      // Try several seeds; at least one should produce a valid puzzle
      let found = false;
      for (let seed = 1; seed <= 20; seed++) {
        try {
          const puzzle = generatePuzzle({
            seed: { difficulty: "medium", archetypeId: arch.id },
            rngSeed: seed,
          });
          if (puzzle.validation.isSolvable && puzzle.archetype === arch.id) {
            found = true;
            break;
          }
        } catch {
          // Some seeds may fail due to constraint conflicts; that's acceptable
        }
      }
      if (!found) {
        failures.push(`Archetype "${arch.id}" could not produce a valid puzzle in 20 attempts`);
      }
    }

    expect(failures, failures.join("\n")).toHaveLength(0);
  });

  it("every environment can be passed without error", () => {
    const failures: string[] = [];

    for (const env of environments) {
      try {
        const puzzle = generatePuzzle({
          seed: { difficulty: "medium", environment: env.id },
          rngSeed: 42,
        });
        if (!puzzle.validation.isSolvable) {
          failures.push(`env="${env.id}": not solvable`);
        }
      } catch (err) {
        failures.push(`env="${env.id}": threw ${err}`);
      }
    }

    expect(failures, failures.join("\n")).toHaveLength(0);
  });

  it("all scored puzzles have overall score ≥ 50", () => {
    const lowScores: string[] = [];

    for (let seed = 1; seed <= 30; seed++) {
      const puzzle = generatePuzzle({ rngSeed: seed });
      const score = scorePuzzle(puzzle);
      if (score.overall < 50) {
        lowScores.push(`seed=${seed}: score=${score.overall} (${puzzle.archetype})`);
      }
    }

    expect(lowScores, lowScores.join("\n")).toHaveLength(0);
  });

  it("determinism — same seed always yields same puzzle", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      for (let seed = 1; seed <= 10; seed++) {
        const a = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        const b = generatePuzzle({ seed: { difficulty }, rngSeed: seed });
        expect(a.id).toBe(b.id);
        expect(a.archetype).toBe(b.archetype);
        expect(a.solution.steps).toEqual(b.solution.steps);
        expect(a.clues.length).toBe(b.clues.length);
      }
    }
  });
});
