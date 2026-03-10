/**
 * SAMPLE SEED DATA ONLY
 *
 * These entries are examples used to establish schema, compatibility rules,
 * and generator behavior. They are not intended to represent a complete
 * production dataset.
 *
 * Add more entries freely as long as they follow the same contracts.
 */

import type { TwistModifier } from "../types/components";

export const twists: TwistModifier[] = [
  {
    id: "broken-component",
    label: "Broken Component",
    compatibleArchetypeIds: ["sequence", "alignment", "routing"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "misleading-clue",
    label: "Misleading Clue",
    compatibleArchetypeIds: ["deduction", "symbol-translation"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: true,
  },
  {
    id: "reversed-order",
    label: "Reversed Order",
    compatibleArchetypeIds: ["sequence", "symbol-translation"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "missing-piece",
    label: "Missing Piece",
    compatibleArchetypeIds: ["alignment", "deduction"],
    complexityImpact: 2,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "blocked-path",
    label: "Blocked Path",
    compatibleArchetypeIds: ["routing"],
    complexityImpact: 1,
    frustrationRisk: "low",
    extraClueRequired: true,
  },
  {
    id: "delayed-feedback",
    label: "Delayed Feedback",
    compatibleArchetypeIds: ["sequence"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: false,
  },
  {
    id: "timed-window",
    label: "Timed Window",
    compatibleArchetypeIds: ["routing"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: false,
  },
  {
    id: "locked-state",
    label: "Locked State",
    compatibleArchetypeIds: ["alignment", "assembly"],
    complexityImpact: 1,
    frustrationRisk: "low",
    extraClueRequired: true,
  },

  // ── New twists ─────────────────────────────────────────────
  {
    id: "hidden-constraint",
    label: "Hidden Constraint",
    compatibleArchetypeIds: ["weight-balance", "elimination", "riddle-lock"],
    complexityImpact: 2,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "phantom-input",
    label: "Phantom Input",
    compatibleArchetypeIds: ["cause-and-effect", "sequence", "pattern-matching"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: true,
  },
  {
    id: "mirror-inversion",
    label: "Mirror Inversion",
    compatibleArchetypeIds: ["alignment", "pattern-matching", "symbol-translation"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "decoy-mechanism",
    label: "Decoy Mechanism",
    compatibleArchetypeIds: ["elimination", "riddle-lock", "cause-and-effect"],
    complexityImpact: 1,
    frustrationRisk: "low",
    extraClueRequired: false,
  },
  {
    id: "shifting-solution",
    label: "Shifting Solution",
    compatibleArchetypeIds: ["routing", "cause-and-effect", "environment-manipulation"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: true,
  },
  {
    id: "cooperative-input",
    label: "Cooperative Input",
    compatibleArchetypeIds: ["sequence", "weight-balance", "assembly"],
    complexityImpact: 1,
    frustrationRisk: "low",
    extraClueRequired: false,
  },

  // ── Resource-inspired twists ───────────────────────────────
  {
    id: "illusion-layer",
    label: "Illusion Layer",
    compatibleArchetypeIds: ["alignment", "deduction", "spatial-navigation", "elimination"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: true,
  },
  {
    id: "one-way-passage",
    label: "One-Way Passage",
    compatibleArchetypeIds: ["routing", "spatial-navigation", "environment-manipulation"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: false,
  },
  {
    id: "environmental-hazard",
    label: "Environmental Hazard",
    compatibleArchetypeIds: ["sequence", "routing", "environment-manipulation", "cooperative-lock"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: false,
  },
  {
    id: "false-solution",
    label: "False Solution",
    compatibleArchetypeIds: ["trial-and-error", "deduction", "elimination", "riddle-lock"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: true,
  },
  {
    id: "living-mechanism",
    label: "Living Mechanism",
    compatibleArchetypeIds: ["cause-and-effect", "riddle-lock", "trial-and-error", "cooperative-lock"],
    complexityImpact: 1,
    frustrationRisk: "medium",
    extraClueRequired: true,
  },
  {
    id: "cascading-failure",
    label: "Cascading Failure",
    compatibleArchetypeIds: ["trial-and-error", "sequence", "cause-and-effect"],
    complexityImpact: 2,
    frustrationRisk: "high",
    extraClueRequired: false,
  },
];