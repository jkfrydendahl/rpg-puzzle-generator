import type { GeneratedPuzzle } from "../types/puzzle.js";
import { difficultyProfiles } from "../data/difficultyProfiles.js";

export type PuzzleScore = {
  overall: number;
  breakdown: {
    solvability: number;
    clueCoverage: number;
    difficultyFit: number;
    tensionBalance: number;
    gmUsability: number;
  };
};

/**
 * Score a generated puzzle on a 0–100 scale across multiple dimensions.
 */
export function scorePuzzle(puzzle: GeneratedPuzzle): PuzzleScore {
  const solvability = puzzle.validation.isSolvable ? 100 : 0;
  const clueCoverage = Math.round(puzzle.validation.clueCoverage * 100);
  const difficultyFit = scoreDifficultyFit(puzzle);
  const tensionBalance = scoreTension(puzzle);
  const gmUsability = scoreGmUsability(puzzle);

  const overall = Math.round(
    solvability * 0.3 +
    clueCoverage * 0.25 +
    difficultyFit * 0.2 +
    tensionBalance * 0.15 +
    gmUsability * 0.1,
  );

  return {
    overall,
    breakdown: { solvability, clueCoverage, difficultyFit, tensionBalance, gmUsability },
  };
}

function scoreDifficultyFit(puzzle: GeneratedPuzzle): number {
  const profile = difficultyProfiles.find((p) => p.id === puzzle.difficulty);
  if (!profile) return 0;

  let score = 100;
  const stepCount = puzzle.solution.steps.length;

  if (stepCount < profile.minSteps || stepCount > profile.maxSteps) score -= 40;
  if (puzzle.clues.length < profile.minClues) score -= 30;
  if (!profile.allowTwist && puzzle.twist) score -= 20;

  return Math.max(0, score);
}

function scoreTension(puzzle: GeneratedPuzzle): number {
  let score = 70;
  if (puzzle.consequence) score += 10;
  if (puzzle.feedback.failureSignals.length > 0) score += 10;
  if (puzzle.feedback.partialProgressSignals.length > 0) score += 10;
  return Math.min(100, score);
}

function scoreGmUsability(puzzle: GeneratedPuzzle): number {
  let score = 50;
  if (puzzle.solution.objective) score += 15;
  if (puzzle.solution.internalLogic) score += 15;
  if (puzzle.hints.length >= 3) score += 10;
  if (puzzle.gmNotes.pacingAdvice) score += 10;
  return Math.min(100, score);
}
