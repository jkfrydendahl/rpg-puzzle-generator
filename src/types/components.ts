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