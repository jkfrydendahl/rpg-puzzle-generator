import type { PuzzleArchetype } from "../types/archetype.js";
import type { ClueType } from "../types/components.js";
import type { PuzzleClue, PuzzleSolution } from "../types/puzzle.js";
import type { Rng } from "./random.js";
import { pick } from "./random.js";

/**
 * Build a set of clues that cover the puzzle's solution steps.
 *
 * Enforces Rule 3: every solution step must be supported by at least one
 * direct clue or two partial clues.
 */
export function buildClueSet(
  archetype: PuzzleArchetype,
  solution: PuzzleSolution,
  selectedClueTypes: ClueType[],
  rng: Rng,
): PuzzleClue[] {
  const clues: PuzzleClue[] = [];

  // Ensure every step has at least one clue pointing to it
  for (let i = 0; i < solution.steps.length; i++) {
    const step = solution.steps[i];
    const clueType = selectedClueTypes[i % selectedClueTypes.length];
    clues.push(buildClue(clueType, step, i, archetype, rng));
  }

  // Add supplementary clues for steps only covered by partial/indirect clues
  for (let i = 0; i < solution.steps.length; i++) {
    const stepRef = `step-${i + 1}`;
    const stepClues = clues.filter((c) => c.pointsTo.includes(stepRef));
    const hasDirectCoverage = stepClues.some((c) => c.directness === "direct");
    const partialCount = stepClues.filter((c) => c.directness === "partial").length;

    // Need 1 direct or 2+ partial to satisfy coverage
    const partialsNeeded = hasDirectCoverage ? 0 : Math.max(0, 2 - partialCount);
    for (let p = 0; p < partialsNeeded; p++) {
      const supplementType = pick(selectedClueTypes, rng);
      clues.push(
        buildClue(supplementType, solution.steps[i], i, archetype, rng, true),
      );
    }
  }

  return clues;
}

function buildClue(
  clueType: ClueType,
  step: string,
  stepIndex: number,
  archetype: PuzzleArchetype,
  rng: Rng,
  isSupplement = false,
): PuzzleClue {
  const stepRef = `step-${stepIndex + 1}`;

  const content = generateClueContent(clueType, step, archetype, rng, isSupplement);

  return {
    source: clueType.label,
    content,
    directness: isSupplement ? "partial" : clueType.directness,
    pointsTo: [stepRef],
  };
}

function generateClueContent(
  clueType: ClueType,
  step: string,
  archetype: PuzzleArchetype,
  rng: Rng,
  isSupplement: boolean,
): string {
  const contentTemplates: Record<string, (step: string) => string[]> = {
    inscription: (s) => [
      `An ancient inscription reads: "${hintFromStep(s)}"`,
      `Carved text hints: "${hintFromStep(s)}"`,
    ],
    mural: (s) => [
      `A faded mural depicts: ${describeFromStep(s)}`,
      `The wall painting shows: ${describeFromStep(s)}`,
    ],
    "journal-fragment": (s) => [
      `A torn journal page reads: "…${hintFromStep(s)}…"`,
      `Written notes mention: "${hintFromStep(s)}"`,
    ],
    "statue-pose": (s) => [
      `A statue's pose suggests: ${describeFromStep(s)}`,
    ],
    "environmental-pattern": (s) => [
      `The surroundings reveal a pattern: ${describeFromStep(s)}`,
    ],
    "ghost-replay": (s) => [
      `A spectral figure performs: ${describeFromStep(s)}`,
    ],
    "color-coding": (s) => [
      `Colors on the mechanism indicate: ${describeFromStep(s)}`,
    ],
    "constellation-map": (s) => [
      `Star positions on the ceiling map to: ${describeFromStep(s)}`,
    ],
    "mosaic-fragment": (s) => [
      `A broken mosaic on the floor depicts: ${describeFromStep(s)}`,
      `Tile fragments arranged together reveal: ${hintFromStep(s)}`,
    ],
    "sound-echo": (s) => [
      `A lingering echo repeats the phrase: "${hintFromStep(s)}"`,
      `Rhythmic sounds from the walls suggest: ${describeFromStep(s)}`,
    ],
    "carved-relief": (s) => [
      `A stone relief carving shows figures performing: ${describeFromStep(s)}`,
      `Detailed stonework illustrates: ${hintFromStep(s)}`,
    ],
    "witness-account": (s) => [
      `A ghostly voice whispers: "I saw them ${hintFromStep(s)}"`,
      `Scratched into a cell wall: "The way is to ${hintFromStep(s)}"`,
    ],
    "riddle-verse": (s) => [
      `Etched verse reads: "When ${hintFromStep(s)}, the way shall open."`,
      `A rhyming couplet hints: "${hintFromStep(s)}"`,
    ],
    "floor-markings": (s) => [
      `Worn grooves in the floor trace a path suggesting: ${describeFromStep(s)}`,
      `Chalk marks on the flagstones indicate: ${hintFromStep(s)}`,
    ],
    "scent-trail": (s) => [
      `A distinct scent grows stronger near the area associated with: ${describeFromStep(s)}`,
      `The smell of old incense guides attention toward: ${hintFromStep(s)}`,
    ],
    "shadow-projection": (s) => [
      `Shadows on the wall form shapes depicting: ${describeFromStep(s)}`,
      `When torchlight hits the right angle, shadows reveal: ${hintFromStep(s)}`,
    ],
    "mechanical-diagram": (s) => [
      `An engraved schematic shows the mechanism configured to: ${describeFromStep(s)}`,
      `Blueprint etchings on a brass plate illustrate: ${hintFromStep(s)}`,
    ],
    "temperature-gradient": (s) => [
      `The air grows warmer near the section associated with: ${describeFromStep(s)}`,
      `A chill emanates from everywhere except where: ${hintFromStep(s)}`,
    ],
    "coded-message": (s) => [
      `A ciphered parchment, once decoded, reads: "${hintFromStep(s)}"`,
      `Numbers scratched into the wall translate to: "${hintFromStep(s)}"`,
    ],
    "npc-dialogue": (s) => [
      `A sentient door rasps: "I shall open when you ${hintFromStep(s)}."`,
      `A trapped spirit whispers the secret: "${hintFromStep(s)}"`,
    ],
    "physical-residue": (s) => [
      `Scratch marks and worn stone show heavy use near: ${describeFromStep(s)}`,
      `Dried blood and scorch marks trace a path suggesting: ${hintFromStep(s)}`,
    ],
    "musical-phrase": (s) => [
      `A music box plays a tune whose notes correspond to: ${describeFromStep(s)}`,
      `Chime tones echo in a rhythm that maps to: ${hintFromStep(s)}`,
    ],
    "illusory-image": (s) => [
      `A shimmering illusion briefly reveals: ${describeFromStep(s)}`,
      `When disbelieved, the illusion fades to show: ${hintFromStep(s)}`,
    ],
    "tactile-difference": (s) => [
      `Running a hand across the surface reveals a textural difference indicating: ${describeFromStep(s)}`,
      `One section feels distinctly warmer/smoother, pointing to: ${hintFromStep(s)}`,
    ],
  };

  const templates = contentTemplates[clueType.id] ?? ((s: string) => [
    `A clue suggests: ${describeFromStep(s)}`,
  ]);

  const options = templates(step);
  return isSupplement
    ? options[options.length - 1] ?? options[0]
    : pick(options, rng);
}

function hintFromStep(step: string): string {
  // Extract the key action phrase from a step description
  const parts = step.split(/(?:to |that |requires )/);
  return parts.length > 1 ? parts[1].trim() : step;
}

function describeFromStep(step: string): string {
  return step.charAt(0).toLowerCase() + step.slice(1);
}
