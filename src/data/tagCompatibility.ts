/**
 * SAMPLE SEED DATA ONLY
 *
 * These entries are examples used to establish schema, compatibility rules,
 * and generator behavior. They are not intended to represent a complete
 * production dataset.
 *
 * Add more entries freely as long as they follow the same contracts.
 */

export const requiredTagGroups: Record<string, string[]> = {
  sigils: ["rotating-rings", "sigil-stones", "symbol-translation"],
  mechanical: ["levers", "pressure-plates", "routing", "gear-wheels", "chain-pulleys", "lock-tumblers", "pipes-valves"],
  visual: ["mirrors", "statues", "mural", "mosaic-floor", "crystal-lenses", "painting-frames"],
  arcane: ["sigil-nodes", "rune-pillars", "sigil-stones", "colored-gems"],
  elemental: ["water-channels", "braziers", "crystal-lenses", "pipes-valves"],
  auditory: ["chimes", "bell-tower"],
  weighted: ["pressure-plates", "scales", "chain-pulleys"],
  navigation: ["floor-tiles", "trap-doors", "sliding-tiles", "mosaic-floor"],
};

export const incompatibleTagPairs: [string, string][] = [
  ["musical", "water-channels"],
  ["darkness", "color-coding"],
  ["fire", "ice"],
  ["stealth", "musical"],
  ["darkness", "shadow-projection"],
  ["underwater", "fire"],
  ["illusion", "direct"],
];