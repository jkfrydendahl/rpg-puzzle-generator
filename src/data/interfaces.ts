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

import { InterfaceComponent } from "../types/components";

export const interfaces: InterfaceComponent[] = [

{
  id: "rotating-rings",

  label: "Rotating Rings",

  tags: ["mechanical","sigils"],

  compatibleArchetypeIds: [
    "sequence",
    "alignment",
    "symbol-translation"
  ],

  interactionVerbs: [
    "rotate",
    "align"
  ],

  stateCapacity: 8,

  supportsOrder: true,

  supportsSimultaneousInput: false
},

{
  id: "levers",

  label: "Lever Array",

  tags: ["mechanical"],

  compatibleArchetypeIds: [
    "sequence",
    "routing"
  ],

  interactionVerbs: [
    "pull",
    "reset"
  ],

  stateCapacity: 6,

  supportsOrder: true,

  supportsSimultaneousInput: true
}

];