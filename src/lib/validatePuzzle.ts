import type { GeneratedPuzzle, DifficultyProfile, PuzzleClue } from "../types/puzzle.js";
import { difficultyProfiles } from "../data/difficultyProfiles.js";
import { designRules } from "../data/designRules.js";
import { incompatibleTagPairs } from "../data/tagCompatibility.js";

export type ValidationResult = {
  isSolvable: boolean;
  clueCoverage: number;
  contradictionWarnings: string[];
  softWarnings: string[];
  errors: string[];
};

/**
 * Validate a generated puzzle for solvability, clue coverage,
 * contradictions, and difficulty fit.
 */
export function validatePuzzle(puzzle: GeneratedPuzzle): ValidationResult {
  const errors: string[] = [];
  const contradictionWarnings: string[] = [];
  const softWarnings: string[] = [];

  const profile = difficultyProfiles.find((p) => p.id === puzzle.difficulty);
  if (!profile) {
    errors.push(`Unknown difficulty profile: ${puzzle.difficulty}`);
    return { isSolvable: false, clueCoverage: 0, contradictionWarnings, softWarnings, errors };
  }

  // Solvability: every step must have clues
  const stepCount = puzzle.solution.steps.length;
  const clueCoverage = computeClueCoverage(puzzle.clues, stepCount);

  if (clueCoverage < 1) {
    errors.push(`Clue coverage is ${(clueCoverage * 100).toFixed(0)}% — not all steps are clued.`);
  }

  // Check each step coverage (Rule 3: no unclued steps)
  for (let i = 0; i < stepCount; i++) {
    const stepRef = `step-${i + 1}`;
    const stepClues = puzzle.clues.filter((c) => c.pointsTo.includes(stepRef));
    if (stepClues.length === 0) {
      errors.push(`Step ${i + 1} has no clues pointing to it.`);
    } else {
      const hasDirect = stepClues.some((c) => c.directness === "direct");
      const partialCount = stepClues.filter((c) => c.directness === "partial").length;
      if (!hasDirect && partialCount < 2) {
        errors.push(`Step ${i + 1} needs either 1 direct clue or 2+ partial clues.`);
      }
    }
  }

  // Difficulty fit
  validateDifficultyFit(puzzle, profile, errors);

  // Contradiction check (Rule 4): misleading clues only if twist allows
  if (!profile.allowMisleadingClues) {
    const misleading = puzzle.clues.filter(
      (c) => c.directness === "indirect" && c.source.toLowerCase().includes("mislead"),
    );
    if (misleading.length > 0) {
      contradictionWarnings.push("Misleading clues present in a non-hard difficulty puzzle.");
    }
  }

  // Twist contradiction check
  if (puzzle.twist?.type === "Misleading Clue" && !profile.allowMisleadingClues) {
    contradictionWarnings.push("Misleading Clue twist applied to a difficulty that does not allow misleading clues.");
  }

  const isSolvable = errors.length === 0;

  // Run soft-rule checks (design rules with severity "soft")
  runSoftRuleChecks(puzzle, profile, softWarnings);

  return { isSolvable, clueCoverage, contradictionWarnings, softWarnings, errors };
}

function computeClueCoverage(clues: PuzzleClue[], stepCount: number): number {
  if (stepCount === 0) return 1;
  const coveredSteps = new Set<string>();
  for (const clue of clues) {
    for (const ref of clue.pointsTo) {
      coveredSteps.add(ref);
    }
  }
  let covered = 0;
  for (let i = 0; i < stepCount; i++) {
    if (coveredSteps.has(`step-${i + 1}`)) covered++;
  }
  return covered / stepCount;
}

function validateDifficultyFit(
  puzzle: GeneratedPuzzle,
  profile: DifficultyProfile,
  errors: string[],
): void {
  const stepCount = puzzle.solution.steps.length;

  if (stepCount < profile.minSteps) {
    errors.push(`Too few steps (${stepCount}) for ${profile.id} difficulty (min: ${profile.minSteps}).`);
  }
  if (stepCount > profile.maxSteps) {
    errors.push(`Too many steps (${stepCount}) for ${profile.id} difficulty (max: ${profile.maxSteps}).`);
  }

  if (puzzle.clues.length < profile.minClues) {
    errors.push(`Too few clues (${puzzle.clues.length}) for ${profile.id} difficulty (min: ${profile.minClues}).`);
  }

  if (!profile.allowTwist && puzzle.twist) {
    errors.push(`Twist not allowed for ${profile.id} difficulty.`);
  }

  const severityOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };
  const maxSev = severityOrder[profile.maxConsequenceSeverity];
  const puzzleSev = severityOrder[puzzle.consequence.severity];
  if (puzzleSev > maxSev) {
    errors.push(
      `Consequence severity "${puzzle.consequence.severity}" exceeds max "${profile.maxConsequenceSeverity}" for ${profile.id}.`,
    );
  }
}

function runSoftRuleChecks(
  puzzle: GeneratedPuzzle,
  profile: DifficultyProfile,
  warnings: string[],
): void {
  const softRules = designRules.filter((r) => r.severity === "soft");
  const ruleIds = new Set(softRules.map((r) => r.id));

  // rule-clue-variety: at least 2 distinct clue sources
  if (ruleIds.has("rule-clue-variety")) {
    const sources = new Set(puzzle.clues.map((c) => c.source));
    if (sources.size < 2) {
      warnings.push("Clue Variety: all clues come from the same source type.");
    }
  }

  // rule-consequence-proportionality: high severity on easy is disproportionate
  if (ruleIds.has("rule-consequence-proportionality")) {
    if (puzzle.difficulty === "easy" && puzzle.consequence.severity !== "low") {
      warnings.push("Consequence Proportionality: non-low consequence on easy difficulty.");
    }
  }

  // rule-twist-clue-coverage: twist present but no clue hints at it
  if (ruleIds.has("rule-twist-clue-coverage") && puzzle.twist) {
    const twistWord = puzzle.twist.type.toLowerCase();
    const hintsTwist = puzzle.clues.some(
      (c) => c.content.toLowerCase().includes(twistWord),
    );
    if (!hintsTwist) {
      warnings.push(`Twist Clue Coverage: no clue explicitly references the "${puzzle.twist.type}" twist.`);
    }
  }

  // rule-hint-ladder-progression: hints should exist and have 3 tiers
  if (ruleIds.has("rule-hint-ladder-progression")) {
    if (puzzle.hints.length < 3) {
      warnings.push("Hint Ladder Progression: fewer than 3 hint tiers.");
    }
  }

  // rule-tag-compatibility: check incompatible tag pairs in puzzle tags
  if (ruleIds.has("rule-tag-compatibility")) {
    for (const [a, b] of incompatibleTagPairs) {
      if (puzzle.tags.includes(a) && puzzle.tags.includes(b)) {
        warnings.push(`Tag Compatibility: incompatible tags "${a}" and "${b}" co-occur.`);
      }
    }
  }

  // rule-frustration-budget: twist + consequence frustration on easy/medium
  if (ruleIds.has("rule-frustration-budget") && puzzle.twist) {
    const sevOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };
    const consRisk = sevOrder[puzzle.consequence.severity] ?? 0;
    if (consRisk >= 2 && (puzzle.difficulty === "easy" || puzzle.difficulty === "medium")) {
      warnings.push("Frustration Budget: high-severity consequence combined with a twist on easy/medium difficulty.");
    }
  }
}
