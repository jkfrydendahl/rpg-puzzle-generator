import { describe, it, expect } from "vitest";
import { selectArchetype } from "../lib/selectArchetype.js";
import { selectComponents } from "../lib/selectComponents.js";
import { createRng } from "../lib/random.js";
import type { PuzzleSeed } from "../types/puzzle.js";

describe("compatibility", () => {
  it("selected archetype has compatible interfaces in the dataset", () => {
    const rng = createRng(42);
    const seed: PuzzleSeed = { difficulty: "medium" };
    const archetype = selectArchetype(seed, rng);
    const components = selectComponents(archetype, seed.difficulty, rng);

    expect(components.primaryInterfaces.length).toBeGreaterThan(0);
    for (const iface of components.primaryInterfaces) {
      expect(archetype.compatibleInterfaceIds).toContain(iface.id);
    }
  });

  it("selected clue types are compatible with archetype", () => {
    const rng = createRng(42);
    const seed: PuzzleSeed = { difficulty: "medium" };
    const archetype = selectArchetype(seed, rng);
    const components = selectComponents(archetype, seed.difficulty, rng);

    for (const clue of components.clueTypes) {
      expect(archetype.compatibleClueTypeIds).toContain(clue.id);
    }
  });

  it("twist (if present) is compatible with archetype", () => {
    const rng = createRng(42);
    const seed: PuzzleSeed = { difficulty: "hard" };
    const archetype = selectArchetype(seed, rng);
    const components = selectComponents(archetype, seed.difficulty, rng);

    if (components.twist) {
      expect(archetype.validTwistIds).toContain(components.twist.id);
    }
  });

  it("consequence is within allowed severity for difficulty", () => {
    const severityOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };

    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const rng = createRng(100);
      const seed: PuzzleSeed = { difficulty };
      const archetype = selectArchetype(seed, rng);
      const components = selectComponents(archetype, difficulty, rng);

      const maxSev = severityOrder[components.profile.maxConsequenceSeverity];
      const actualSev = severityOrder[components.consequence.severity];
      expect(actualSev).toBeLessThanOrEqual(maxSev);
    }
  });

  it("step count is within difficulty range", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const rng = createRng(42);
      const seed: PuzzleSeed = { difficulty };
      const archetype = selectArchetype(seed, rng);
      const components = selectComponents(archetype, difficulty, rng);

      expect(components.stepCount).toBeGreaterThanOrEqual(components.profile.minSteps);
      expect(components.stepCount).toBeLessThanOrEqual(components.profile.maxSteps);
    }
  });

  it("excluded tags filter out archetypes with matching tags", () => {
    const rng = createRng(42);
    const seed: PuzzleSeed = {
      difficulty: "medium",
      excludedTags: ["ordered", "procedural", "ritual"],
    };
    const archetype = selectArchetype(seed, rng);

    // sequence has tags ["ordered", "procedural", "ritual"], so it should be excluded
    expect(archetype.id).not.toBe("sequence");
  });

  it("required tags limit archetype selection", () => {
    // "flow" appears on the routing archetype directly and on
    // interfaces referenced by environment-manipulation, so both are valid.
    const rng = createRng(42);
    const seed: PuzzleSeed = {
      difficulty: "medium",
      requiredTags: ["flow"],
    };
    const archetype = selectArchetype(seed, rng);
    expect(["routing", "environment-manipulation"]).toContain(archetype.id);
  });
});
