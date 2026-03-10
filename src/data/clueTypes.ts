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

import { ClueType } from "../types/components";

export const clueTypes: ClueType[] = [

{
  id: "inscription",

  label: "Inscription",

  compatibleArchetypeIds: [
    "sequence",
    "deduction",
    "symbol-translation"
  ],

  directness: "partial",

  abstractionLevel: "medium",

  canMislead: true
},

{
  id: "mural",

  label: "Mural",

  compatibleArchetypeIds: [
    "sequence",
    "alignment",
    "deduction"
  ],

  directness: "partial",

  abstractionLevel: "medium",

  canMislead: false
}

];