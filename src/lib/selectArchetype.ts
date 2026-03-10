import type { PuzzleArchetype } from "../types/archetype.js";
import type { PuzzleSeed } from "../types/puzzle.js";
import { archetypes } from "../data/archetypes.js";
import { interfaces } from "../data/interfaces.js";
import { incompatibleTagPairs } from "../data/tagCompatibility.js";
import type { Rng } from "./random.js";
import { pick } from "./random.js";

/**
 * Select a compatible archetype for the given seed constraints.
 *
 * Filters by required/excluded tags and verifies at least one compatible
 * interface exists in the dataset before returning.
 */
export function selectArchetype(
  seed: PuzzleSeed,
  rng: Rng,
  pool: PuzzleArchetype[] = archetypes,
): PuzzleArchetype {
  let candidates = pool;

  if (seed.archetypeId) {
    candidates = candidates.filter((a) => a.id === seed.archetypeId);
  }

  if (seed.requiredTags?.length) {
    candidates = candidates.filter((a) =>
      seed.requiredTags!.some(
        (tag) =>
          a.tags.includes(tag) ||
          a.compatibleInterfaceIds.some((iid) => {
            const iface = interfaces.find((i) => i.id === iid);
            return iface?.tags.includes(tag);
          }),
      ),
    );
  }

  if (seed.excludedTags?.length) {
    candidates = candidates.filter(
      (a) =>
        !seed.excludedTags!.some(
          (tag) =>
            a.tags.includes(tag) ||
            hasIncompatibleTag(a, tag),
        ),
    );
  }

  if (candidates.length === 0) {
    throw new Error("No compatible archetype found for the given seed constraints.");
  }

  return pick(candidates, rng);
}

function hasIncompatibleTag(archetype: PuzzleArchetype, tag: string): boolean {
  return incompatibleTagPairs.some(
    ([a, b]) =>
      (a === tag && archetype.tags.includes(b)) ||
      (b === tag && archetype.tags.includes(a)),
  );
}
