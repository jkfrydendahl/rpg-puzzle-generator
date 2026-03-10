import type { PuzzleArchetype } from "../types/archetype.js";
import type { InterfaceComponent, ClueType, TwistModifier, ConsequenceType } from "../types/components.js";
import type { DifficultyProfile, PuzzleDifficulty } from "../types/puzzle.js";
import { interfaces } from "../data/interfaces.js";
import { clueTypes } from "../data/clueTypes.js";
import { twists } from "../data/twists.js";
import { consequences } from "../data/consequences.js";
import { difficultyProfiles } from "../data/difficultyProfiles.js";
import type { Rng } from "./random.js";
import { pick, pickN, randomInt } from "./random.js";

export type SelectedComponents = {
  primaryInterfaces: InterfaceComponent[];
  clueTypes: ClueType[];
  twist: TwistModifier | undefined;
  consequence: ConsequenceType;
  stepCount: number;
  profile: DifficultyProfile;
};

const severityOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };

/**
 * Select compatible components for a given archetype and difficulty.
 */
export function selectComponents(
  archetype: PuzzleArchetype,
  difficulty: PuzzleDifficulty,
  rng: Rng,
): SelectedComponents {
  const profile = difficultyProfiles.find((p) => p.id === difficulty);
  if (!profile) throw new Error(`Unknown difficulty: ${difficulty}`);

  const primaryInterfaces = selectInterfaces(archetype, profile, rng);
  const selectedClues = selectClues(archetype, profile, rng);
  const twist = selectTwist(archetype, profile, rng);
  const consequence = selectConsequence(archetype, profile, rng);
  const stepCount = randomInt(profile.minSteps, profile.maxSteps, rng);

  return {
    primaryInterfaces,
    clueTypes: selectedClues,
    twist,
    consequence,
    stepCount,
    profile,
  };
}

function selectInterfaces(
  archetype: PuzzleArchetype,
  profile: DifficultyProfile,
  rng: Rng,
): InterfaceComponent[] {
  const compatible = interfaces.filter((i) =>
    archetype.compatibleInterfaceIds.includes(i.id),
  );
  if (compatible.length === 0) {
    throw new Error(`No compatible interfaces for archetype "${archetype.id}".`);
  }
  // Pick 1-2 primary interfaces depending on difficulty
  const count = profile.maxSteps >= 4 ? randomInt(1, 2, rng) : 1;
  return pickN(compatible, count, rng);
}

function selectClues(
  archetype: PuzzleArchetype,
  profile: DifficultyProfile,
  rng: Rng,
): ClueType[] {
  let compatible = clueTypes.filter((c) =>
    archetype.compatibleClueTypeIds.includes(c.id),
  );
  if (!profile.allowMisleadingClues) {
    compatible = compatible.filter((c) => !c.canMislead || c.directness !== "indirect");
  }
  if (compatible.length === 0) {
    throw new Error(`No compatible clue types for archetype "${archetype.id}".`);
  }
  const count = randomInt(
    Math.max(profile.minClues, archetype.minClueCount),
    profile.maxClues,
    rng,
  );
  return pickN(compatible, count, rng);
}

function selectTwist(
  archetype: PuzzleArchetype,
  profile: DifficultyProfile,
  rng: Rng,
): TwistModifier | undefined {
  if (!profile.allowTwist) return undefined;

  let compatible = twists.filter((t) =>
    archetype.validTwistIds.includes(t.id),
  );

  // Filter out misleading-clue twist when not allowed by difficulty
  if (!profile.allowMisleadingClues) {
    compatible = compatible.filter((t) => t.id !== "misleading-clue");
  }

  if (compatible.length === 0) return undefined;

  return pick(compatible, rng);
}

function selectConsequence(
  archetype: PuzzleArchetype,
  profile: DifficultyProfile,
  rng: Rng,
): ConsequenceType {
  const maxSev = severityOrder[profile.maxConsequenceSeverity];
  const compatible = consequences.filter(
    (c) =>
      archetype.preferredConsequenceIds.includes(c.id) &&
      c.allowedDifficulties.includes(profile.id) &&
      severityOrder[c.severity] <= maxSev,
  );
  if (compatible.length === 0) {
    // Fall back to any consequence within severity
    const fallback = consequences.filter(
      (c) =>
        c.allowedDifficulties.includes(profile.id) &&
        severityOrder[c.severity] <= maxSev,
    );
    if (fallback.length === 0) {
      throw new Error(`No consequence available for difficulty "${profile.id}".`);
    }
    return pick(fallback, rng);
  }
  return pick(compatible, rng);
}
