import type { ConsequenceType, TwistModifier } from "../types/components.js";
import type { PuzzleConsequence, PuzzleFeedback, PuzzleTwist, PuzzleSolution } from "../types/puzzle.js";
import type { InterfaceComponent } from "../types/components.js";

/**
 * Build the failure state: consequence, twist decoration, and feedback signals.
 */
export function buildFailureState(
  consequence: ConsequenceType,
  twist: TwistModifier | undefined,
  solution: PuzzleSolution,
  primaryInterface: InterfaceComponent,
): {
  consequence: PuzzleConsequence;
  twist: PuzzleTwist | undefined;
  feedback: PuzzleFeedback;
} {
  return {
    consequence: buildConsequence(consequence),
    twist: twist ? buildTwist(twist, primaryInterface) : undefined,
    feedback: buildFeedback(solution, primaryInterface, consequence),
  };
}

function buildConsequence(c: ConsequenceType): PuzzleConsequence {
  const behaviors: Record<string, string> = {
    reset: "The puzzle resets to its initial state. Players must start the sequence again.",
    "arcane-pulse": "A pulse of arcane energy deals minor damage to nearby creatures.",
    alarm: "An alarm sounds, alerting nearby creatures or triggering a timed event.",
    flooding: "Water begins filling the room. Players have limited rounds to solve the puzzle or escape.",
    "summon-guardian": "A guardian creature is summoned and attacks the party.",
    "room-shift": "The room reconfigures — some elements move to new positions.",
    "poison-gas": "Toxic gas seeps from vents. Players take damage each round until they solve the puzzle or flee.",
    "darkness-descends": "All light sources are extinguished. Players must solve the remaining puzzle in total darkness.",
    "animated-weapon": "A weapon mounted on the wall animates and attacks the nearest creature.",
    "gravity-shift": "Gravity reverses or shifts direction, scattering objects and disorienting the party.",
    "collapsing-ceiling": "Part of the ceiling collapses, blocking a passage and dealing damage to those beneath.",
    "illusory-wall": "An illusory wall appears or disappears, changing the room's layout and hiding the true exit.",
    "energy-drain": "Arcane energy drains from the players, imposing exhaustion or reducing spell slots.",
    "teleportation-scatter": "Players are teleported to random positions in or near the room, separating the party.",
    "pit-trap": "The floor gives way beneath the party. Characters fall into a pit, taking damage and requiring a climb or rescue to return.",
    "crushing-walls": "The walls begin closing in. Players have a limited number of rounds to solve the puzzle before being crushed.",
    "sleep-gas": "Sweet-smelling gas floods the room. Characters who fail a saving throw fall unconscious until rescued.",
    "fire-burst": "Jets of flame erupt from hidden nozzles, dealing fire damage to everyone in the area.",
    "magic-jar": "Arcane energy attempts to trap a character's soul in a nearby vessel. The victim is incapacitated until the jar is destroyed.",
    "party-split": "Stone barriers slam down, splitting the party into separate chambers. Each group must solve their side independently.",
  };

  return {
    type: c.label,
    severity: c.severity,
    behavior: behaviors[c.id] ?? `${c.label} is triggered — ${c.tensionType} tension increases.`,
  };
}

function buildTwist(t: TwistModifier, iface: InterfaceComponent): PuzzleTwist {
  const effects: Record<string, string> = {
    "broken-component": `One of the ${iface.label} is broken and cannot be used. Players must find an alternate approach or repair it.`,
    "misleading-clue": "One clue intentionally points to the wrong solution. Players must identify the false lead.",
    "reversed-order": "The expected sequence is reversed from what the clues initially suggest.",
    "missing-piece": `A critical piece of the ${iface.label} is missing and must be found nearby.`,
    "blocked-path": "One route in the system is blocked, forcing players to find a detour.",
    "delayed-feedback": `The ${iface.label} does not respond immediately — feedback is delayed by one action.`,
    "timed-window": "A time-limited window of opportunity opens. Players must act within the window.",
    "locked-state": `One element of the ${iface.label} is locked in place and cannot be changed.`,
    "hidden-constraint": `An invisible rule governs the ${iface.label} — one combination is secretly forbidden.`,
    "phantom-input": `A ghost element on the ${iface.label} mimics player actions with a slight delay, adding noise.`,
    "mirror-inversion": `The ${iface.label} behaves as a mirror image — left is right, up is down.`,
    "decoy-mechanism": `A secondary ${iface.label} is a decoy that wastes actions. Players must identify the real one.`,
    "shifting-solution": `The correct configuration of the ${iface.label} changes after every failed attempt.`,
    "cooperative-input": `Two parts of the ${iface.label} must be operated simultaneously by different players.`,
    "illusion-layer": `The ${iface.label} is partially hidden behind an illusion. What players see is not the true state — they must disbelieve or use magical sight.`,
    "one-way-passage": `Once a section of the ${iface.label} is activated, it locks and cannot be reversed. Players must commit to each choice.`,
    "environmental-hazard": `The area around the ${iface.label} is subject to a hazard (rising water, spreading fire, crumbling floor) that worsens each round.`,
    "false-solution": `The ${iface.label} has a plausible but incorrect configuration that triggers the consequence. The real answer is subtly different.`,
    "living-mechanism": `The ${iface.label} is alive — a mimic, a sentient construct, or a bound spirit. It reacts to player actions unpredictably.`,
    "cascading-failure": `Each wrong attempt on the ${iface.label} makes the puzzle harder: elements lock, options narrow, or the consequence escalates.`,
  };

  return {
    type: t.label,
    effect: effects[t.id] ?? `${t.label} modifies puzzle behavior.`,
  };
}

function buildFeedback(
  solution: PuzzleSolution,
  iface: InterfaceComponent,
  consequence: ConsequenceType,
): PuzzleFeedback {
  return {
    successSignals: [
      `The ${iface.label} clicks into place with a satisfying resonance.`,
      `A soft glow emanates from the mechanism, indicating progress.`,
    ],
    failureSignals: [
      `The ${iface.label} resists and snaps back — something is wrong.`,
      `${consequence.label}: ${consequence.tensionType} tension builds.`,
    ],
    partialProgressSignals: [
      `Part of the mechanism responds — you're on the right track.`,
      `A faint hum suggests some elements are correctly positioned.`,
    ],
  };
}
