import type { PuzzleSolution, PuzzleClue } from "../types/puzzle.js";

/**
 * Build a 3-tier hint ladder for the puzzle.
 *
 * Hint 1: Reframe attention toward the relevant interface.
 * Hint 2: Narrow interpretation by connecting clues.
 * Hint 3: Reveal the next step nearly explicitly.
 */
export function buildHintLadder(
  solution: PuzzleSolution,
  clues: PuzzleClue[],
  interfaceLabel: string,
): string[] {
  const firstStep = solution.steps[0] ?? "the first element";
  const firstClue = clues[0];

  const hint1 = `Look more closely at the ${interfaceLabel}. Something about its current state seems important.`;

  const hint2 = firstClue
    ? `The ${firstClue.source} and the ${interfaceLabel} are connected. Consider how "${firstClue.content.slice(0, 60)}…" relates to the mechanism.`
    : `Consider the relationship between the clues you've found and the ${interfaceLabel}.`;

  const hint3 = `Try this: ${firstStep}.`;

  return [hint1, hint2, hint3];
}
