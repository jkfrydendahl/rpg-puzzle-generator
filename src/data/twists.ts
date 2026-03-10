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

import { TwistModifier } from "../types/components";

export const twists: TwistModifier[] = [

{
  id: "broken-component",

  label: "Broken Component",

  compatibleArchetypeIds: [
    "sequence",
    "alignment",
    "routing"
  ],

  complexityImpact: 1,

  frustrationRisk: "medium",

  extraClueRequired: true
},

{
  id: "misleading-clue",

  label: "Misleading Clue",

  compatibleArchetypeIds: [
    "deduction",
    "symbol-translation"
  ],

  complexityImpact: 2,

  frustrationRisk: "high",

  extraClueRequired: true
}

];