/**
 * Puzzle archetypes define the fundamental logic structure
 * used to construct puzzles.
 *
 * Examples include:
 *
 * - sequence puzzles
 * - alignment puzzles
 * - deduction puzzles
 * - routing puzzles
 *
 * Archetypes determine which components and clue types
 * can legally combine.
 */

export type PuzzleArchetype = {
  id: string;

  label: string;

  description: string;

  tags: string[];

  compatibleInterfaceIds: string[];

  compatibleClueTypeIds: string[];

  validTwistIds: string[];

  preferredConsequenceIds: string[];

  minClueCount: number;

  defaultStepRange: [number, number];
};