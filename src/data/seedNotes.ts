/**
 * SEED NOTES — GM-facing inspiration & design commentary
 *
 * These notes are NOT consumed by the generator algorithmically.
 * They are exported so that AI prompt templates or documentation
 * can include them as flavour / guidance for the GM reading
 * the generated puzzle output.
 *
 * Inspired by community puzzle compilations and classic trap design.
 */

export type SeedNote = {
  id: string;
  category: "archetype" | "interface" | "twist" | "environment" | "general";
  title: string;
  body: string;
};

export const seedNotes: SeedNote[] = [
  // ── General philosophy ───────────────────────────────────────
  {
    id: "note-fair-puzzles",
    category: "general",
    title: "Puzzles Must Be Fair",
    body: "The best puzzles reward observation and logic, not guessing. Every step of the solution should be inferable from clues available before the attempt. If the players cannot succeed without trial-and-error, the puzzle needs more clues — not fewer options.",
  },
  {
    id: "note-multiple-solutions",
    category: "general",
    title: "Embrace Side Doors",
    body: "Players will always try things the designer didn't expect. Destroying a wall, polymorphing past a grate, or intimidating a mechanism's maker are all valid puzzle-solving strategies. Build puzzles with an intended solution, but leave room for creative alternatives.",
  },
  {
    id: "note-pacing",
    category: "general",
    title: "Puzzles Should Not Stall Sessions",
    body: "A puzzle that stumps the table for 45+ minutes will drain energy. Build in a hint ladder that gracefully reveals more information as time passes. If the party is truly stuck, the final hint should practically give the answer at some cost.",
  },
  {
    id: "note-player-vs-character",
    category: "general",
    title: "Player Knowledge vs. Character Knowledge",
    body: "Puzzles challenge the players, not the characters. Skill checks can unlock additional clues or bypass components, but the core logic should engage the humans at the table.",
  },
  // ── Archetype notes ──────────────────────────────────────────
  {
    id: "note-sequence-rituals",
    category: "archetype",
    title: "Sequence Puzzles as Rituals",
    body: "Framing a sequence puzzle as a religious or arcane ritual (light the candles in the order the saints fell) gives it narrative weight. Players feel they are participating in world lore, not just pressing buttons.",
  },
  {
    id: "note-alignment-spatial",
    category: "archetype",
    title: "Alignment Puzzles Love Physical Props",
    body: "Mirrors, rotating statues, and sliding tiles translate beautifully to physical handouts or VTT overlays. Consider giving the players a tangible diagram to manipulate.",
  },
  {
    id: "note-deduction-clue-scatter",
    category: "archetype",
    title: "Scatter Deduction Clues Across Rooms",
    body: "Deduction puzzles shine when clues are found earlier in the dungeon. A mural in room 2 and a journal in room 5 that together solve the lock in room 8 reward attentive exploration.",
  },
  {
    id: "note-routing-visual-feedback",
    category: "archetype",
    title: "Make Flow Visible",
    body: "Routing puzzles (water, light, energy) benefit enormously from visible feedback. Describe glowing channels, audible rushing water, or sparking conduits so the players can see partial success.",
  },
  {
    id: "note-pattern-matching",
    category: "archetype",
    title: "Pattern-Matching Can Span Rooms",
    body: "A mosaic repeated with variations across three rooms may hold the key. Noticing which elements differ reveals the 'odd one out' or the missing piece.",
  },
  // ── Interface notes ──────────────────────────────────────────
  {
    id: "note-mirrors-classic",
    category: "interface",
    title: "Mirrors Are Endlessly Flexible",
    body: "Mirrors can redirect light beams, reveal hidden writing, show reflections that differ from reality, or act as portals. They are a GM's best friend for visual puzzles.",
  },
  {
    id: "note-pressure-plates-minesweeper",
    category: "interface",
    title: "Pressure Plates as Minesweeper",
    body: "A grid of pressure plates where each safe tile shows the count of adjacent traps turns a dungeon floor into a logic game the whole party can collaborate on.",
  },
  {
    id: "note-chimes-melody",
    category: "interface",
    title: "Chimes Tell Stories",
    body: "A set of resonating chimes that must be struck in the order of an old lullaby or a war hymn ties the puzzle to the world's culture.",
  },
  // ── Twist notes ──────────────────────────────────────────────
  {
    id: "note-twist-fairness",
    category: "twist",
    title: "Twists Need Their Own Clue",
    body: "A reversed-order twist is unfair unless at least one clue hints that 'the last shall be first'. Twists exist to add complexity, not to make the puzzle unsolvable.",
  },
  {
    id: "note-twist-timing",
    category: "twist",
    title: "Reveal Twists Gradually",
    body: "The best twists are discovered mid-solve. The broken component becomes apparent when step 3 fails; the misleading clue is recognised when two clues contradict.",
  },
  // ── Environment notes ────────────────────────────────────────
  {
    id: "note-env-coherence",
    category: "environment",
    title: "Environment Sets Expectations",
    body: "Players in a flooded cistern expect water-based mechanics. Players in a clockwork vault expect gears and levers. Use environment to telegraph the type of puzzle they will face.",
  },
  {
    id: "note-env-hazards",
    category: "environment",
    title: "Environmental Hazards Add Urgency",
    body: "Rising water, spreading fire, or encroaching darkness are natural timers that raise tension without requiring an arbitrary round counter.",
  },
  {
    id: "note-env-seasons",
    category: "environment",
    title: "Seasonal Dungeons",
    body: "A dungeon where rooms shift through seasons (iced corridors in winter, overgrown passages in summer) can gate progress behind environmental puzzles. Sun dials or magical controls change the season, opening and closing paths.",
  },

  // ── Resource-inspired notes ───────────────────────────────
  {
    id: "note-ciphers-codes",
    category: "archetype",
    title: "Ciphers and Coded Messages",
    body: "A coded parchment using letter substitution or a number sequence like Fibonacci creates a puzzle solvable through real-world logic. Give players the cipher text as a physical handout. Every-fourth-word messages hidden in proclamations or look-and-say number sequences add variety without needing custom props.",
  },
  {
    id: "note-lever-gear-design",
    category: "interface",
    title: "Lever & Gear Design Tips",
    body: "A single inaccessible lever is a puzzle in reach, not in mechanics. Multiple simultaneous levers split the party. Combination levers require scattered clues. Gear-and-belt chains demand directional reasoning. Start with a basic building block and combine them for late-dungeon complexity.",
  },
  {
    id: "note-teamwork-puzzles",
    category: "archetype",
    title: "Teamwork Puzzles Shine in RPGs",
    body: "D&D is inherently cooperative, so puzzles requiring simultaneous input — holding levers, standing on plates, or forming a conductive chain — play to the medium's strengths. Assign one slot per player and force traded key pieces for maximum engagement.",
  },
  {
    id: "note-time-pressure",
    category: "twist",
    title: "Natural Timers Beat Round Counters",
    body: "Rising water, spreading fire, or crushing walls create visceral urgency without arbitrary ‘you have 5 rounds’ announcements. Let the fiction drive the clock: describe water at ankles, then waist, then chin. The threat is felt, not counted.",
  },
  {
    id: "note-illusion-puzzles",
    category: "twist",
    title: "Illusion-Based Deception",
    body: "Whole walls, pits, or treasures may be illusions. A fake pit trap that players agonise over is hilarious when they realise they could have just walked across. Mimics, illusions, and sentient doors all break assumptions and reward Perception / Investigation checks.",
  },
  {
    id: "note-combining-basics",
    category: "general",
    title: "Combine Simple Puzzles Into Grand Setups",
    body: "The most satisfying dungeons combine many simple puzzle steps into a coherent whole — like Portal combining portal placement with cubes, lasers, and turrets. Start with a linear flow chart of basic puzzles, then layer in non-linear choices and rule-twisting late-game rooms.",
  },
];
