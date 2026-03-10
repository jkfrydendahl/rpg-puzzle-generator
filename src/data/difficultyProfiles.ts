/**
 * SAMPLE SEED DATA ONLY
 *
 * These entries are examples used to establish schema, compatibility rules,
 * and generator behavior. They are not intended to represent a complete
 * production dataset.
 *
 * Add more entries freely as long as they follow the same contracts.
 */

import type { DifficultyProfile } from "../types/puzzle";

export const difficultyProfiles: DifficultyProfile[] = [
  {
    id: "easy",
    minSteps: 2,
    maxSteps: 3,
    minClues: 2,
    maxClues: 3,
    allowTwist: false,
    allowMisleadingClues: false,
    maxConsequenceSeverity: "low",
  },
  {
    id: "medium",
    minSteps: 3,
    maxSteps: 4,
    minClues: 2,
    maxClues: 4,
    allowTwist: true,
    allowMisleadingClues: false,
    maxConsequenceSeverity: "medium",
  },
  {
    id: "hard",
    minSteps: 4,
    maxSteps: 5,
    minClues: 3,
    maxClues: 5,
    allowTwist: true,
    allowMisleadingClues: true,
    maxConsequenceSeverity: "high",
  },
];