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

export const difficultyProfiles = [

{
  id: "easy",

  minSteps: 2,

  maxSteps: 3,

  minClues: 2,

  maxClues: 3,

  allowTwist: false
},

{
  id: "medium",

  minSteps: 3,

  maxSteps: 4,

  minClues: 2,

  maxClues: 4,

  allowTwist: true
},

{
  id: "hard",

  minSteps: 4,

  maxSteps: 5,

  minClues: 3,

  maxClues: 5,

  allowTwist: true
}

];