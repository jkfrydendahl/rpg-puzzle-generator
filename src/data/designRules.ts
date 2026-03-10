/**
 * SEED DATA — Design Rules
 *
 * Hard and soft constraints the puzzle generator must respect.
 * These encode the core fairness / quality principles from
 * the implementation plan.
 *
 * 'hard' rules cause validation failures.
 * 'soft' rules produce warnings but do not block generation.
 */

import type { DesignRule } from "../types/components.js";

export const designRules: DesignRule[] = [
  // ── Hard rules (violations make a puzzle invalid) ────────────
  {
    id: "rule-solvable",
    label: "Always Solvable",
    description: "Every generated puzzle must have at least one valid path from start to solution using only the provided clues and interface.",
    severity: "hard",
  },
  {
    id: "rule-no-unclued-steps",
    label: "No Unclued Steps",
    description: "Every step in the solution path must be reachable from at least one clue rated 'direct' or 'partial'.",
    severity: "hard",
  },
  {
    id: "rule-min-clues",
    label: "Minimum Clue Count",
    description: "The puzzle must contain at least as many clues as the difficulty profile's minClues value.",
    severity: "hard",
  },
  {
    id: "rule-difficulty-fit",
    label: "Difficulty Fit",
    description: "Step count, clue count, twist presence, and consequence severity must all fall within the difficulty profile's bounds.",
    severity: "hard",
  },
  {
    id: "rule-no-contradictions",
    label: "No Contradictions",
    description: "No two clues in the set may point to mutually exclusive solution steps.",
    severity: "hard",
  },
  {
    id: "rule-interface-archetype-match",
    label: "Interface-Archetype Match",
    description: "Every selected interface must appear in the archetype's compatibleInterfaceIds list.",
    severity: "hard",
  },
  // ── Soft rules (quality warnings) ────────────────────────────
  {
    id: "rule-clue-variety",
    label: "Clue Variety",
    description: "Prefer selecting clues from at least two different clue types to avoid monotonous presentation.",
    severity: "soft",
  },
  {
    id: "rule-consequence-proportionality",
    label: "Consequence Proportionality",
    description: "Consequences should feel proportional to the mistake — a wrong lever should not summon a dragon on easy difficulty.",
    severity: "soft",
  },
  {
    id: "rule-twist-clue-coverage",
    label: "Twist Clue Coverage",
    description: "When a twist with extraClueRequired is present, the clue set should contain at least one clue hinting at the twist.",
    severity: "soft",
  },
  {
    id: "rule-avoid-dead-state",
    label: "Avoid Dead State",
    description: "Puzzles should not allow players to reach an unrecoverable state without resetting. Prefer repeatable consequences.",
    severity: "soft",
  },
  {
    id: "rule-hint-ladder-progression",
    label: "Hint Ladder Progression",
    description: "Hints should progress from vague nudge to moderate guidance to near-reveal, never starting at the answer.",
    severity: "soft",
  },
  {
    id: "rule-environment-coherence",
    label: "Environment Coherence",
    description: "When an environment is specified, selected interfaces and flavour text should feel natural in that setting.",
    severity: "soft",
  },
  {
    id: "rule-tag-compatibility",
    label: "Tag Compatibility",
    description: "Incompatible tag pairs (e.g. 'musical' + 'water-channels') should not co-occur in the same puzzle.",
    severity: "soft",
  },
  {
    id: "rule-frustration-budget",
    label: "Frustration Budget",
    description: "The combined frustration risk of twist + consequence should not exceed 'high' for easy and medium difficulties.",
    severity: "soft",
  },
  {
    id: "rule-multiple-paths",
    label: "Multiple Solution Paths",
    description: "Prefer puzzles that can be approached from more than one angle — including creative workarounds like destroying a wall or intimidating a construct.",
    severity: "soft",
  },
  {
    id: "rule-graduated-complexity",
    label: "Graduated Complexity",
    description: "Expand puzzle complexity through the core mechanic rather than adding entirely new mechanics. Many small solvable steps beat one monolithic challenge.",
    severity: "soft",
  },
  {
    id: "rule-teamwork-inclusion",
    label: "Teamwork Inclusion",
    description: "Where possible, puzzles should offer meaningful roles for multiple party members rather than being solvable by a single player.",
    severity: "soft",
  },
  {
    id: "rule-feedback-clarity",
    label: "Feedback Clarity",
    description: "Players should receive clear feedback when they make partial progress. Silent failure or ambiguous results lead to frustration.",
    severity: "soft",
  },
];
