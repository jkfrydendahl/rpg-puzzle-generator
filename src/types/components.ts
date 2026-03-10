/**
 * Interface components represent the physical puzzle elements
 * players interact with.
 */

export type InterfaceComponent = {
  id: string;

  label: string;

  tags: string[];

  compatibleArchetypeIds: string[];

  interactionVerbs: string[];

  stateCapacity: number;

  supportsOrder: boolean;

  supportsSimultaneousInput: boolean;
};

/**
 * Clue types define how puzzle information is presented
 * to the players.
 */

export type ClueType = {
  id: string;

  label: string;

  compatibleArchetypeIds: string[];

  directness: "direct" | "partial" | "indirect";

  abstractionLevel: "low" | "medium" | "high";

  canMislead: boolean;
};

/**
 * Twist modifiers alter puzzle behavior.
 */

export type TwistModifier = {
  id: string;

  label: string;

  compatibleArchetypeIds: string[];

  complexityImpact: number;

  frustrationRisk: "low" | "medium" | "high";

  extraClueRequired: boolean;
};

/**
 * Consequences define failure outcomes.
 */

export type ConsequenceType = {
  id: string;

  label: string;

  severity: "low" | "medium" | "high";

  repeatable: boolean;

  tensionType: string;

  allowedDifficulties: string[];
};

/**
 * Environments describe dungeon locations where puzzles occur.
 * They influence which archetypes, interfaces, and flavour fit.
 */

export type Environment = {
  id: string;

  label: string;

  description: string;

  /** Tags that influence component selection. */
  tags: string[];

  /** Interface ids that feel natural in this environment. */
  suggestedInterfaceIds: string[];

  /** Archetype ids that work well in this setting. */
  suggestedArchetypeIds: string[];
};

/**
 * Design rules encode hard constraints the generator must obey.
 */

export type DesignRule = {
  id: string;

  label: string;

  description: string;

  /** 'hard' rules cause validation failures; 'soft' rules produce warnings. */
  severity: "hard" | "soft";
};