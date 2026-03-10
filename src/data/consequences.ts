/**
 * SAMPLE SEED DATA ONLY
 *
 * These entries are examples used to establish schema, compatibility rules,
 * and generator behavior. They are not intended to represent a complete
 * production dataset.
 *
 * Add more entries freely as long as they follow the same contracts.
 */

import type { ConsequenceType } from "../types/components";

export const consequences: ConsequenceType[] = [
  {
    id: "reset",
    label: "Puzzle Reset",
    severity: "low",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["easy", "medium", "hard"],
  },
  {
    id: "arcane-pulse",
    label: "Arcane Pulse",
    severity: "medium",
    repeatable: true,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "alarm",
    label: "Alarm",
    severity: "medium",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "flooding",
    label: "Flooding Room",
    severity: "high",
    repeatable: false,
    tensionType: "timer",
    allowedDifficulties: ["hard"],
  },
  {
    id: "summon-guardian",
    label: "Summoned Guardian",
    severity: "high",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["hard"],
  },
  {
    id: "room-shift",
    label: "Room Shift",
    severity: "medium",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["medium", "hard"],
  },

  // ── New consequences ───────────────────────────────────────
  {
    id: "poison-gas",
    label: "Poison Gas Release",
    severity: "high",
    repeatable: false,
    tensionType: "timer",
    allowedDifficulties: ["hard"],
  },
  {
    id: "darkness-descends",
    label: "Darkness Descends",
    severity: "low",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["easy", "medium", "hard"],
  },
  {
    id: "animated-weapon",
    label: "Animated Weapon",
    severity: "medium",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "gravity-shift",
    label: "Gravity Shift",
    severity: "medium",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "collapsing-ceiling",
    label: "Collapsing Ceiling",
    severity: "high",
    repeatable: false,
    tensionType: "timer",
    allowedDifficulties: ["hard"],
  },
  {
    id: "illusory-wall",
    label: "Illusory Wall Seal",
    severity: "low",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["easy", "medium"],
  },
  {
    id: "energy-drain",
    label: "Energy Drain",
    severity: "medium",
    repeatable: true,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "teleportation-scatter",
    label: "Teleportation Scatter",
    severity: "medium",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["medium", "hard"],
  },

  // ── Resource-inspired consequences ─────────────────────────
  {
    id: "pit-trap",
    label: "Pit Trap",
    severity: "medium",
    repeatable: true,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "crushing-walls",
    label: "Crushing Walls",
    severity: "high",
    repeatable: false,
    tensionType: "timer",
    allowedDifficulties: ["hard"],
  },
  {
    id: "sleep-gas",
    label: "Sleep Gas",
    severity: "medium",
    repeatable: false,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "fire-burst",
    label: "Fire Burst",
    severity: "medium",
    repeatable: true,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "magic-jar",
    label: "Magic Jar",
    severity: "high",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["hard"],
  },
  {
    id: "party-split",
    label: "Party Split",
    severity: "medium",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["medium", "hard"],
  },
];