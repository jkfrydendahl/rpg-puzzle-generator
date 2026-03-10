/**
 * SAMPLE SEED DATA
 *
 * This file contains example entries used to establish schema,
 * compatibility rules, and generator behavior.
 *
 * These entries are NOT intended to represent a complete dataset.
 *
 * The generator must treat this data as extensible. Additional
 * entries may be added later without changing generator logic.
 *
 * When generating puzzles, the system should not assume these
 * are the only possible components.
 */

import { PuzzleArchetype } from "../types/archetype";

export const archetypes: PuzzleArchetype[] = [
  {
    id: "sequence",

    label: "Sequence",

    description: "Players must activate elements in a specific order.",

    tags: ["ordered", "ritual"],

    compatibleInterfaceIds: [
      "rotating-rings",
      "levers",
      "sigil-stones"
    ],

    compatibleClueTypeIds: [
      "inscription",
      "mural",
      "journal-fragment"
    ],

    validTwistIds: [
      "reversed-order",
      "broken-component"
    ],

    preferredConsequenceIds: [
      "reset",
      "arcane-pulse"
    ],

    minClueCount: 2,

    defaultStepRange: [3, 4]
  }
];