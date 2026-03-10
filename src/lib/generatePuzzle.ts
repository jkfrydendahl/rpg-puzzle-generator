import type { GeneratedPuzzle, PuzzleSeed, PuzzleGMNotes } from "../types/puzzle.js";
import { selectArchetype } from "./selectArchetype.js";
import { selectComponents } from "./selectComponents.js";
import { buildSolutionPath } from "./buildSolutionPath.js";
import { buildClueSet } from "./buildClueSet.js";
import { buildFailureState } from "./buildFailureState.js";
import { buildHintLadder } from "./buildHintLadder.js";
import { validatePuzzle } from "./validatePuzzle.js";
import { rerollInvalidParts } from "./rerollInvalidParts.js";
import { createRng, type Rng } from "./random.js";

export type GenerateOptions = {
  seed?: PuzzleSeed;
  rngSeed?: number;
};

/**
 * Generate a complete, validated RPG puzzle.
 *
 * Workflow:
 *   Phase A — Seed selection (from input or defaults)
 *   Phase B — Skeleton construction (archetype + components)
 *   Phase C — Solution construction
 *   Phase D — Support construction (clues, hints, feedback)
 *   Phase E — Validation & repair
 */
export function generatePuzzle(options: GenerateOptions = {}): GeneratedPuzzle {
  const puzzleSeed: PuzzleSeed = options.seed ?? { difficulty: "medium" };
  const rng: Rng = createRng(options.rngSeed ?? Date.now());

  // Phase A+B — Select archetype and compatible components
  const archetype = selectArchetype(puzzleSeed, rng);
  const components = selectComponents(archetype, puzzleSeed.difficulty, rng);

  // Phase C — Build solution
  const solution = buildSolutionPath(
    archetype,
    components.primaryInterfaces,
    components.stepCount,
    rng,
  );

  // Phase D — Build clues, failure state, hints
  const clues = buildClueSet(archetype, solution, components.clueTypes, rng);
  const failureState = buildFailureState(
    components.consequence,
    components.twist,
    solution,
    components.primaryInterfaces[0],
  );
  const interfaceLabel = components.primaryInterfaces[0].label;
  const hints = buildHintLadder(solution, clues, interfaceLabel);
  const gmNotes = buildGmNotes(archetype.id, solution, interfaceLabel);

  // Collect all tags
  const tags = collectTags(archetype.tags, components.primaryInterfaces.flatMap((i) => i.tags));

  // Assemble puzzle
  let puzzle: GeneratedPuzzle = {
    id: generateId(rng),
    difficulty: puzzleSeed.difficulty,
    environment: puzzleSeed.environment,
    archetype: archetype.id,
    tags,
    interface: {
      primary: components.primaryInterfaces.map((i) => i.label),
      secondary: components.primaryInterfaces.length > 1
        ? components.primaryInterfaces.slice(1).map((i) => i.label)
        : undefined,
    },
    solution,
    clues,
    twist: failureState.twist,
    consequence: failureState.consequence,
    feedback: failureState.feedback,
    hints,
    validation: { isSolvable: false, clueCoverage: 0, contradictionWarnings: [], softWarnings: [] },
    gmNotes,
  };

  // Phase E — Validate
  const validation = validatePuzzle(puzzle);
  puzzle = { ...puzzle, validation };

  // If invalid, attempt targeted repair (Rule 6)
  if (!validation.isSolvable) {
    const repaired = rerollInvalidParts(puzzle, puzzleSeed, rng);
    if (repaired) {
      const revalidation = validatePuzzle(repaired);
      puzzle = { ...repaired, validation: revalidation };
    }
  }

  return puzzle;
}

function generateId(rng: Rng): string {
  const hex = () => Math.floor(rng() * 0xffff).toString(16).padStart(4, "0");
  return `pzl-${hex()}-${hex()}`;
}

function collectTags(archetypeTags: string[], interfaceTags: string[]): string[] {
  return [...new Set([...archetypeTags, ...interfaceTags])];
}

function buildGmNotes(
  archetypeId: string,
  solution: PuzzleSolution,
  interfaceLabel: string,
): PuzzleGMNotes {
  return {
    likelyMisreads: [
      `Players may try to brute-force the ${interfaceLabel} without reading clues.`,
      `The ${archetypeId} logic may be mistaken for a simpler trial-and-error puzzle.`,
    ],
    bypassIdeas: [
      `A high DC Arcana/Investigation check could reveal one solution step.`,
      `Allow creative spell use (e.g., Detect Magic, Augury) to shortcut one step.`,
    ],
    pacingAdvice: `If players stall after 10–15 minutes, offer Hint 1. Escalate through the hint ladder as needed. Don't let the puzzle block the session for more than 20 minutes.`,
  };
}

// Re-export types for consumer convenience
import type { PuzzleSolution } from "../types/puzzle.js";
export type { GeneratedPuzzle, PuzzleSeed } from "../types/puzzle.js";
export { validatePuzzle } from "./validatePuzzle.js";
export { scorePuzzle } from "./scorePuzzle.js";
export { exportPrompt } from "./exportPrompt.js";
