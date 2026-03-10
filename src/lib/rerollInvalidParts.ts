import type { GeneratedPuzzle, PuzzleSeed } from "../types/puzzle.js";
import type { Rng } from "./random.js";
import { selectArchetype } from "./selectArchetype.js";
import { selectComponents } from "./selectComponents.js";
import { buildSolutionPath } from "./buildSolutionPath.js";
import { buildClueSet } from "./buildClueSet.js";
import { buildFailureState } from "./buildFailureState.js";
import { buildHintLadder } from "./buildHintLadder.js";
import { validatePuzzle } from "./validatePuzzle.js";

/**
 * Attempt to repair a puzzle that failed validation.
 *
 * Rule 6: prefer repair over full reroll — only replace the invalid part.
 *
 * Returns the repaired puzzle, or null if repair is not possible within
 * the allowed number of attempts.
 */
export function rerollInvalidParts(
  puzzle: GeneratedPuzzle,
  seed: PuzzleSeed,
  rng: Rng,
  maxAttempts = 3,
): GeneratedPuzzle | null {
  let current = puzzle;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = validatePuzzle(current);
    if (result.isSolvable) return current;

    // Try targeted repairs based on error types
    current = attemptRepair(current, result.errors, seed, rng);
  }

  // Final check
  const final = validatePuzzle(current);
  return final.isSolvable ? current : null;
}

function attemptRepair(
  puzzle: GeneratedPuzzle,
  errors: string[],
  seed: PuzzleSeed,
  rng: Rng,
): GeneratedPuzzle {
  let repaired = { ...puzzle };

  for (const error of errors) {
    if (error.includes("no clues pointing to it") || error.includes("needs either 1 direct")) {
      repaired = repairClueCoverage(repaired, seed, rng);
    } else if (error.includes("Too few steps") || error.includes("Too many steps")) {
      repaired = repairStepCount(repaired, seed, rng);
    } else if (error.includes("Twist not allowed")) {
      repaired = { ...repaired, twist: undefined };
    } else if (error.includes("Consequence severity")) {
      repaired = repairConsequence(repaired, seed, rng);
    }
  }

  return repaired;
}

function repairClueCoverage(
  puzzle: GeneratedPuzzle,
  seed: PuzzleSeed,
  rng: Rng,
): GeneratedPuzzle {
  // Re-select archetype and rebuild clues
  const archetype = selectArchetype(seed, rng);
  const components = selectComponents(archetype, seed.difficulty, rng);
  const clues = buildClueSet(archetype, puzzle.solution, components.clueTypes, rng);
  const hints = buildHintLadder(puzzle.solution, clues, components.primaryInterfaces[0].label);

  return { ...puzzle, clues, hints };
}

function repairStepCount(
  puzzle: GeneratedPuzzle,
  seed: PuzzleSeed,
  rng: Rng,
): GeneratedPuzzle {
  const archetype = selectArchetype(seed, rng);
  const components = selectComponents(archetype, seed.difficulty, rng);
  const solution = buildSolutionPath(
    archetype,
    components.primaryInterfaces,
    components.stepCount,
    rng,
  );
  const clues = buildClueSet(archetype, solution, components.clueTypes, rng);
  const hints = buildHintLadder(solution, clues, components.primaryInterfaces[0].label);

  return { ...puzzle, solution, clues, hints, archetype: archetype.id };
}

function repairConsequence(
  puzzle: GeneratedPuzzle,
  seed: PuzzleSeed,
  rng: Rng,
): GeneratedPuzzle {
  const archetype = selectArchetype(seed, rng);
  const components = selectComponents(archetype, seed.difficulty, rng);
  const failureState = buildFailureState(
    components.consequence,
    components.twist,
    puzzle.solution,
    components.primaryInterfaces[0],
  );

  return {
    ...puzzle,
    consequence: failureState.consequence,
    twist: failureState.twist,
    feedback: failureState.feedback,
  };
}
