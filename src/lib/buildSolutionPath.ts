import type { PuzzleArchetype } from "../types/archetype.js";
import type { InterfaceComponent } from "../types/components.js";
import type { PuzzleSolution } from "../types/puzzle.js";
import type { Rng } from "./random.js";
import { pick, shuffle } from "./random.js";

/**
 * Build the solution path for a puzzle given its archetype, interfaces, and step count.
 *
 * Generates an objective, ordered steps, final state, and internal logic description
 * based on the archetype's logic family.
 */
export function buildSolutionPath(
  archetype: PuzzleArchetype,
  primaryInterfaces: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const iface = primaryInterfaces[0];
  const builder = solutionBuilders[archetype.id] ?? buildGenericSolution;
  return builder(archetype, iface, primaryInterfaces, stepCount, rng);
}

type SolutionBuilder = (
  archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  allInterfaces: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
) => PuzzleSolution;

const solutionBuilders: Record<string, SolutionBuilder> = {
  sequence: buildSequenceSolution,
  alignment: buildAlignmentSolution,
  deduction: buildDeductionSolution,
  routing: buildRoutingSolution,
  "symbol-translation": buildSymbolTranslationSolution,
  "pattern-matching": buildPatternMatchingSolution,
  "weight-balance": buildWeightBalanceSolution,
  elimination: buildEliminationSolution,
  "cause-and-effect": buildCauseAndEffectSolution,
  "riddle-lock": buildRiddleLockSolution,
  assembly: buildAssemblySolution,
  "environment-manipulation": buildEnvironmentManipulationSolution,
  "cipher-decode": buildCipherDecodeSolution,
  "spatial-navigation": buildSpatialNavigationSolution,
  "trial-and-error": buildTrialAndErrorSolution,
  "cooperative-lock": buildCooperativeLockSolution,
};

function buildSequenceSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const verbs = iface.interactionVerbs;
  const positions = generatePositionLabels(stepCount, rng);
  const steps = positions.map(
    (pos, i) => `${pick(verbs, rng)} the ${iface.label} to position "${pos}" (step ${i + 1})`,
  );

  return {
    objective: `Activate the ${iface.label} in the correct sequence to unlock the mechanism.`,
    steps,
    finalState: `All ${stepCount} elements activated in order — mechanism unlocked.`,
    internalLogic: `The correct order is: ${positions.join(" → ")}. Each element must be activated sequentially.`,
  };
}

function buildAlignmentSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const verbs = iface.interactionVerbs;
  const targets = generateDirectionLabels(stepCount, rng);
  const steps = targets.map(
    (dir, i) => `${pick(verbs, rng)} element ${i + 1} to face ${dir}`,
  );

  return {
    objective: `Align the ${iface.label} so each element faces the correct direction.`,
    steps,
    finalState: `All elements aligned — the pattern is complete.`,
    internalLogic: `Correct orientations: ${targets.join(", ")}. All must be set simultaneously.`,
  };
}

function buildDeductionSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const symbols = generateSymbolLabels(stepCount, rng);
  const steps = symbols.map(
    (sym, i) => `Determine that position ${i + 1} requires the "${sym}" symbol by cross-referencing clues`,
  );

  return {
    objective: `Deduce the correct configuration of the ${iface.label} using available clues.`,
    steps,
    finalState: `Correct configuration set — lock mechanism releases.`,
    internalLogic: `Each position maps to exactly one symbol: ${symbols.join(", ")}. Clues eliminate wrong choices.`,
  };
}

function buildRoutingSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const nodes = generateNodeLabels(stepCount + 1);
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    steps.push(`Connect ${nodes[i]} to ${nodes[i + 1]} using the ${iface.label}`);
  }

  return {
    objective: `Route the flow from source (${nodes[0]}) to destination (${nodes[nodes.length - 1]}).`,
    steps,
    finalState: `Flow reaches destination — mechanism powered.`,
    internalLogic: `Path: ${nodes.join(" → ")}. Each connection must be made in sequence.`,
  };
}

function buildSymbolTranslationSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const symbols = generateSymbolLabels(stepCount, rng);
  const meanings = generateMeaningLabels(stepCount, rng);
  const steps = symbols.map(
    (sym, i) => `Translate "${sym}" to mean "${meanings[i]}" and apply to ${iface.label} slot ${i + 1}`,
  );

  return {
    objective: `Decode the symbols and apply the correct meaning to each ${iface.label} position.`,
    steps,
    finalState: `All symbols correctly translated — seal opens.`,
    internalLogic: `Translation key: ${symbols.map((s, i) => `${s}=${meanings[i]}`).join(", ")}.`,
  };
}

function buildPatternMatchingSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const symbols = generateSymbolLabels(stepCount, rng);
  const pattern = symbols.slice(0, -1);
  const missing = symbols[symbols.length - 1];
  const steps = pattern.map(
    (sym, i) => `Observe the "${sym}" element on ${iface.label} position ${i + 1} and note the pattern`,
  );
  steps.push(`Deduce the missing element ("${missing}") and apply it to the final position`);
  if (steps.length > stepCount) steps.splice(stepCount);

  return {
    objective: `Identify the repeating pattern on the ${iface.label} and supply the missing element.`,
    steps,
    finalState: `Pattern completed — mechanism recognises the sequence and unlocks.`,
    internalLogic: `The pattern is: ${pattern.join(", ")} → ${missing}. Players must observe existing elements and extrapolate.`,
  };
}

function buildWeightBalanceSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const weights = Array.from({ length: stepCount }, () => Math.floor(rng() * 5) + 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const verbs = iface.interactionVerbs;
  const steps = weights.map(
    (w, i) => `${pick(verbs, rng)} a weight of ${w} onto ${iface.label} position ${i + 1}`,
  );

  return {
    objective: `Balance the ${iface.label} by placing the correct weights to reach a total of ${total}.`,
    steps,
    finalState: `All weights balanced — the mechanism settles and the lock releases.`,
    internalLogic: `Required weights per position: ${weights.join(", ")} (total ${total}). Imbalance triggers the consequence.`,
  };
}

function buildEliminationSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const candidates = generateSymbolLabels(stepCount + 2, rng);
  const correct = candidates.slice(0, stepCount);
  const decoys = candidates.slice(stepCount);
  const steps = correct.map(
    (sym, i) => `Eliminate decoys and confirm "${sym}" belongs in position ${i + 1} on the ${iface.label}`,
  );

  return {
    objective: `Determine which ${stepCount} of ${candidates.length} symbols are correct by eliminating the rest.`,
    steps,
    finalState: `All decoys eliminated — the correct symbols remain and the lock opens.`,
    internalLogic: `Correct: ${correct.join(", ")}. Decoys: ${decoys.join(", ")}. Clues eliminate wrong answers.`,
  };
}

function buildCauseAndEffectSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const verbs = iface.interactionVerbs;
  const effects = ["a click echoes", "a section glows", "a panel slides", "a tone sounds", "steam vents"];
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    const effect = effects[i % effects.length];
    steps.push(`${pick(verbs, rng)} the ${iface.label} and observe that ${effect} (step ${i + 1})`);
  }

  return {
    objective: `Experiment with the ${iface.label} to discover which actions produce the desired chain of effects.`,
    steps,
    finalState: `Correct chain of cause-and-effect triggered — mechanism fully activated.`,
    internalLogic: `Each action produces a distinct observable effect. The correct combination is the one that chains all effects in order.`,
  };
}

function buildRiddleLockSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const meanings = generateMeaningLabels(stepCount, rng);
  const steps = meanings.map(
    (m, i) => `Interpret the riddle's ${ordinal(i + 1)} line as "${m}" and apply it to the ${iface.label}`,
  );

  return {
    objective: `Solve the riddle and physically enact its answer using the ${iface.label}.`,
    steps,
    finalState: `Riddle answered correctly — the lock mechanism accepts the solution.`,
    internalLogic: `Riddle answer maps to: ${meanings.join(" → ")}. Each line of the riddle corresponds to one physical action.`,
  };
}

function buildAssemblySolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  allInterfaces: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const pieces = generatePositionLabels(stepCount, rng);
  const steps = pieces.map(
    (piece, i) => `Locate the "${piece}" fragment and attach it to ${iface.label} slot ${i + 1}`,
  );

  return {
    objective: `Gather the ${stepCount} scattered fragments and assemble them on the ${iface.label}.`,
    steps,
    finalState: `All fragments assembled — the completed device activates.`,
    internalLogic: `Fragment order: ${pieces.join(", ")}. Each must be found in the environment and placed in the correct slot.`,
  };
}

function buildEnvironmentManipulationSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const changes = ["flood the lower chamber", "redirect light into the corridor", "raise the stone platform",
    "open the wind channel", "lower the barrier wall", "shift the floor tiles"];
  const verbs = iface.interactionVerbs;
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    const change = changes[i % changes.length];
    steps.push(`${pick(verbs, rng)} the ${iface.label} to ${change} (step ${i + 1})`);
  }

  return {
    objective: `Alter the room's environment using the ${iface.label} to create a passable path.`,
    steps,
    finalState: `Environment transformed — the path is clear.`,
    internalLogic: `Each manipulation changes the room state. The correct sequence opens the way without triggering hazards.`,
  };
}

function buildCipherDecodeSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const symbols = generateSymbolLabels(stepCount, rng);
  const meanings = generateMeaningLabels(stepCount, rng);
  const steps = symbols.map(
    (sym, i) => `Decode cipher element "${sym}" to reveal the value "${meanings[i]}" and set ${iface.label} position ${i + 1}`,
  );

  return {
    objective: `Crack the encoded message and input the decoded values into the ${iface.label}.`,
    steps,
    finalState: `Cipher fully decoded — the ${iface.label} accepts the solution and the seal opens.`,
    internalLogic: `Cipher key: ${symbols.map((s, i) => `${s}→${meanings[i]}`).join(", ")}. Each coded element maps to exactly one decoded value.`,
  };
}

function buildSpatialNavigationSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const directions = generateDirectionLabels(stepCount, rng);
  const verbs = iface.interactionVerbs;
  const steps = directions.map(
    (dir, i) => `${pick(verbs, rng)} the ${iface.label} to move ${dir} (step ${i + 1})`,
  );

  return {
    objective: `Navigate the ${iface.label} through the correct path to reach the exit.`,
    steps,
    finalState: `Correct path navigated — the passage opens.`,
    internalLogic: `Path sequence: ${directions.join(" → ")}. Wrong turns lead to dead ends or loop back.`,
  };
}

function buildTrialAndErrorSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const positions = generatePositionLabels(stepCount, rng);
  const verbs = iface.interactionVerbs;
  const steps = positions.map(
    (pos, i) => `Test ${iface.label} setting "${pos}" — observe feedback and confirm it is correct (step ${i + 1})`,
  );

  return {
    objective: `Systematically test the ${iface.label} settings, using feedback from each attempt to narrow the solution.`,
    steps,
    finalState: `All ${stepCount} correct settings discovered through experimentation — mechanism unlocked.`,
    internalLogic: `Correct settings: ${positions.join(", ")}. Each wrong attempt provides a clue (e.g. "too high", "wrong position") to guide the next try.`,
  };
}

function buildCooperativeLockSolution(
  _archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  allInterfaces: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const verbs = iface.interactionVerbs;
  const labels = allInterfaces.map((i) => i.label);
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    const target = labels[i % labels.length];
    steps.push(`Player ${i + 1} must ${pick(verbs, rng)} the ${target} simultaneously with the others (step ${i + 1})`);
  }

  return {
    objective: `Coordinate ${stepCount} party members to operate the ${iface.label} at the same time.`,
    steps,
    finalState: `All inputs applied simultaneously — the cooperative lock releases.`,
    internalLogic: `Requires ${stepCount} simultaneous actions. Any desynchronisation resets the attempt.`,
  };
}

function buildGenericSolution(
  archetype: PuzzleArchetype,
  iface: InterfaceComponent,
  _all: InterfaceComponent[],
  stepCount: number,
  rng: Rng,
): PuzzleSolution {
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    steps.push(`${pick(iface.interactionVerbs, rng)} the ${iface.label} (step ${i + 1})`);
  }
  return {
    objective: `Solve the ${archetype.label} puzzle using the ${iface.label}.`,
    steps,
    finalState: `Puzzle solved — mechanism activated.`,
    internalLogic: `Complete all ${stepCount} steps correctly.`,
  };
}

// --- Label generators ---

const POSITION_NAMES = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"];
const DIRECTIONS = ["north", "south", "east", "west", "up", "down", "inward", "outward"];
const SYMBOLS = ["Sun", "Moon", "Star", "Eye", "Serpent", "Crown", "Flame", "Wave", "Tree", "Skull"];
const MEANINGS = ["life", "death", "time", "power", "truth", "shadow", "light", "earth", "sky", "water"];
const NODE_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function generatePositionLabels(count: number, rng: Rng): string[] {
  const copy = [...POSITION_NAMES];
  return shuffle(copy, rng).slice(0, count);
}

function generateDirectionLabels(count: number, rng: Rng): string[] {
  const copy = [...DIRECTIONS];
  return shuffle(copy, rng).slice(0, count);
}

function generateSymbolLabels(count: number, rng: Rng): string[] {
  const copy = [...SYMBOLS];
  return shuffle(copy, rng).slice(0, count);
}

function generateMeaningLabels(count: number, rng: Rng): string[] {
  const copy = [...MEANINGS];
  return shuffle(copy, rng).slice(0, count);
}

function generateNodeLabels(count: number): string[] {
  return NODE_LABELS.slice(0, count);
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
