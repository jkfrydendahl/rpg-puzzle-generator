
# Event-Driven RPG Puzzle Generator — Implementation Plan

## Goal

Build a reusable **event-driven puzzle generator** for tabletop RPGs that produces **logically coherent, GM-usable puzzle seeds**.

The system should not rely on AI to invent puzzle logic from scratch. Instead, it generates a structured puzzle framework using defined archetypes, interfaces, clue types, twists, and consequences. AI can optionally expand the generated puzzle into thematic descriptions, riddles, inscriptions, and GM-facing flavor.

Priorities:
- solvability
- internal logic
- modular design
- extensibility
- table usability
- compatibility with future AI prompt expansion

---

# Core Design Principle

Every generated puzzle must include:

1. **Archetype** – underlying logic type
2. **Interface** – what players manipulate
3. **Solution Structure** – logical path to solve it
4. **Clues** – how players discover the solution
5. **Twist / Modifier** – complication that alters behavior
6. **Consequence** – failure or tension mechanic
7. **Hint Ladder** – escalating GM hints
8. **Output Packet** – structured GM-ready puzzle data

---

# Non-Goals (Initial Version)

Do NOT attempt to:

- generate long narrative descriptions
- generate full riddle prose automatically
- simulate player behavior
- implement VTT puzzle mechanics
- solve arbitrary freeform puzzle logic
- model every spell or ability interaction

Focus first on **strong structured puzzle seeds**.

---

# Recommended Project Structure

```txt
/puzzle-generator
  /data
    archetypes.ts
    interfaces.ts
    clueTypes.ts
    twists.ts
    consequences.ts
    environments.ts
    difficultyProfiles.ts
    designRules.ts
    tagCompatibility.ts
    seedNotes.ts

  /lib
    generatePuzzle.ts
    selectArchetype.ts
    selectComponents.ts
    buildSolutionPath.ts
    buildClueSet.ts
    buildFailureState.ts
    buildHintLadder.ts
    validatePuzzle.ts
    scorePuzzle.ts
    exportPrompt.ts
    rerollInvalidParts.ts

  /types
    puzzle.ts
    archetype.ts
    components.ts

  /tests
    generatePuzzle.test.ts
    validatePuzzle.test.ts
    buildHintLadder.test.ts
    compatibility.test.ts
    seedData.test.ts
```

---

# Generator Workflow

## Phase A — Seed Selection

The generator selects or receives:

- difficulty
- environment/theme
- required tags
- excluded tags

Example:

```txt
Difficulty: Medium
Environment: Forgotten shrine
Required tags: sigils, mechanical
Excluded tags: musical
```

---

## Phase B — Skeleton Construction

Select:

- archetype
- compatible interfaces
- clue types
- twist
- consequence

This defines the mechanical framework.

---

## Phase C — Solution Construction

Generate:

- solution steps
- correct order or configuration
- internal rule
- alternate paths if applicable
- broken or disabled elements

This is the **most critical stage**.

---

## Phase D — Support Construction

Create:

- clue distribution
- feedback states
- hint ladder
- failure behavior
- GM notes

---

## Phase E — Validation

Verify:

- puzzle solvable
- clues sufficient
- no contradictions
- difficulty appropriate
- components compatible

If validation fails, reroll or repair components.

---

# Core Types

## PuzzleArchetype

Defines puzzle logic family.

Suggested starting archetypes:

- sequence
- alignment
- deduction
- routing
- symbolTranslation

Each archetype defines:

- compatible interfaces
- allowed clues
- minimum clue requirements
- valid twists
- solution generation rules

---

## InterfaceComponent

Examples:

- rotating rings
- pressure plates
- mirrors
- statues
- sigil stones
- levers
- sliding tiles
- water channels

Properties:

- tags
- compatible archetypes
- interaction verbs
- state capacity
- supports sequence or positioning

---

## ClueType

Examples:

- inscription
- mural
- journal fragment
- statue pose
- color coding
- environmental pattern
- ghost replay

Properties:

- compatible archetypes
- directness level
- abstraction level
- misleading capability

---

## TwistModifier

Examples:

- broken component
- misleading clue
- reversed sequence
- simultaneous actions required
- delayed feedback
- missing puzzle piece

Properties:

- compatible archetypes
- complexity impact
- frustration risk

---

## ConsequenceType

Examples:

- reset
- magical backlash
- alarm
- flooding room
- summoned guardians

Properties:

- severity
- repeatability
- tension level

---

# Difficulty Profiles

## Easy

- 2–3 components
- 1 direct clue
- 1 partial clue
- low consequence
- short solution chain

## Medium

- 3–4 components
- multiple clues
- optional twist
- moderate consequence

## Hard

- 4–5 components
- layered clues
- one ambiguous clue
- stronger consequence

Avoid hybrid archetypes initially.

---

# Puzzle Output Shape

Example TypeScript structure:

```ts
type GeneratedPuzzle = {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  environment: string;
  archetype: string;
  tags: string[];

  interface: {
    primary: string[];
    secondary?: string[];
  };

  solution: {
    objective: string;
    steps: string[];
    finalState: string;
    internalLogic: string;
  };

  clues: {
    source: string;
    content: string;
    directness: "direct" | "partial" | "indirect";
    pointsTo: string[];
  }[];

  twist?: {
    type: string;
    effect: string;
  };

  consequence: {
    type: string;
    severity: "low" | "medium" | "high";
    behavior: string;
  };

  feedback: {
    successSignals: string[];
    failureSignals: string[];
    partialProgressSignals: string[];
  };

  hints: string[];

  validation: {
    isSolvable: boolean;
    clueCoverage: number;
    contradictionWarnings: string[];
  };

  gmNotes: {
    likelyMisreads: string[];
    bypassIdeas: string[];
    pacingAdvice: string;
  };
};
```

---

# Validation Rules

Minimum checks:

### Solvability
Each step must be inferable.

### Clue Coverage
Every logical leap supported by clues.

### No Contradictions
Unless explicitly enabled by twist.

### Difficulty Fit
Complexity must match difficulty profile.

### Interface Compatibility
Components must support the archetype.

### GM Usability
Puzzle must be explainable concisely.

### No External Knowledge
Puzzle should rely only on in-world logic.

---

# Hint Ladder

Each puzzle generates 3 hints.

**Hint 1 — Reframe attention**  
Direct players toward relevant interface.

**Hint 2 — Narrow interpretation**  
Suggest relationship between clues.

**Hint 3 — Reveal next step**  
Nearly explicit instruction.

---

# AI Integration Layer

Add helper:

```ts
exportPrompt(puzzle: GeneratedPuzzle): string
```

The prompt should ask the AI to:

- describe the room
- present puzzle diegetically
- generate inscriptions
- generate riddles if applicable
- keep puzzle logic unchanged
- include GM explanation

AI should **decorate**, not redesign the puzzle.

---

# Seed Data Template Guidance

All seed data files should begin with a short comment block explaining:

- this file contains **sample entries only**
- entries define schema and logic expectations
- the generator must not assume the dataset is exhaustive
- more entries can be added later without changing the architecture

Example header:

```ts
/**
 * SAMPLE SEED DATA ONLY
 *
 * These entries are examples used to establish schema, compatibility rules,
 * and generator behavior. They are not intended to represent a complete
 * production dataset.
 *
 * Add more entries freely as long as they follow the same contracts.
 */
```

This matters because Copilot and other AI coding tools tend to over-assume that seed data is complete if that is not stated clearly.

---

# Seed Data Templates

These are not final datasets. They are **starter templates** to give Copilot concrete examples and keep the implementation grounded.

## `data/archetypes.ts`

```ts
import type { PuzzleArchetype } from "../types/archetype";

export const archetypes: PuzzleArchetype[] = [
  {
    id: "sequence",
    label: "Sequence",
    description: "Players must activate or arrange elements in the correct order.",
    tags: ["ordered", "procedural", "ritual"],
    compatibleInterfaceIds: ["rotating-rings", "levers", "sigil-stones", "chimes"],
    compatibleClueTypeIds: ["inscription", "mural", "journal-fragment", "color-coding"],
    validTwistIds: ["reversed-order", "broken-component", "delayed-feedback"],
    preferredConsequenceIds: ["reset", "arcane-pulse", "alarm"],
    minClueCount: 2,
    defaultStepRange: [3, 4],
  },
  {
    id: "alignment",
    label: "Alignment",
    description: "Players must orient or position objects into the correct arrangement.",
    tags: ["spatial", "orientation", "positioning"],
    compatibleInterfaceIds: ["rotating-rings", "mirrors", "statues", "sliding-tiles"],
    compatibleClueTypeIds: ["mural", "constellation-map", "environmental-pattern", "statue-pose"],
    validTwistIds: ["locked-state", "broken-component", "missing-piece"],
    preferredConsequenceIds: ["reset", "room-shift", "arcane-pulse"],
    minClueCount: 2,
    defaultStepRange: [2, 4],
  },
  {
    id: "deduction",
    label: "Deduction",
    description: "Players infer the correct arrangement by combining multiple clues.",
    tags: ["logic", "inference", "cross-reference"],
    compatibleInterfaceIds: ["statues", "sigil-stones", "pressure-plates", "sliding-tiles"],
    compatibleClueTypeIds: ["journal-fragment", "mural", "inscription", "ghost-replay"],
    validTwistIds: ["misleading-clue", "missing-piece"],
    preferredConsequenceIds: ["alarm", "reset"],
    minClueCount: 3,
    defaultStepRange: [3, 5],
  },
  {
    id: "routing",
    label: "Routing",
    description: "Players direct energy, water, light, or force through a connected system.",
    tags: ["flow", "network", "redirection"],
    compatibleInterfaceIds: ["mirrors", "water-channels", "levers", "sigil-nodes"],
    compatibleClueTypeIds: ["environmental-pattern", "mural", "inscription"],
    validTwistIds: ["blocked-path", "broken-component", "timed-window"],
    preferredConsequenceIds: ["flooding", "arcane-pulse", "summon-guardian"],
    minClueCount: 2,
    defaultStepRange: [3, 4],
  },
  {
    id: "symbol-translation",
    label: "Symbol Translation",
    description: "Players decode symbolic meaning and apply it to a mechanism.",
    tags: ["language", "symbolic", "interpretive"],
    compatibleInterfaceIds: ["sigil-stones", "rotating-rings", "statues"],
    compatibleClueTypeIds: ["inscription", "mural", "journal-fragment", "color-coding"],
    validTwistIds: ["misleading-clue", "reversed-order"],
    preferredConsequenceIds: ["reset", "arcane-pulse"],
    minClueCount: 3,
    defaultStepRange: [3, 4],
  },
];
```

## `data/interfaces.ts`

```ts
import type { InterfaceComponent } from "../types/components";

export const interfaces: InterfaceComponent[] = [
  {
    id: "rotating-rings",
    label: "Rotating Rings",
    tags: ["sigils", "mechanical", "circular"],
    compatibleArchetypeIds: ["sequence", "alignment", "symbol-translation"],
    interactionVerbs: ["rotate", "align", "lock"],
    stateCapacity: 8,
    supportsOrder: true,
    supportsSimultaneousInput: false,
  },
  {
    id: "levers",
    label: "Lever Array",
    tags: ["mechanical", "binary", "visible-state"],
    compatibleArchetypeIds: ["sequence", "routing"],
    interactionVerbs: ["pull", "reset", "lock"],
    stateCapacity: 6,
    supportsOrder: true,
    supportsSimultaneousInput: true,
  },
  {
    id: "mirrors",
    label: "Mirror Assemblies",
    tags: ["light", "reflection", "spatial"],
    compatibleArchetypeIds: ["alignment", "routing"],
    interactionVerbs: ["turn", "tilt", "focus"],
    stateCapacity: 12,
    supportsOrder: false,
    supportsSimultaneousInput: false,
  },
  {
    id: "statues",
    label: "Carved Statues",
    tags: ["visual", "positional", "thematic"],
    compatibleArchetypeIds: ["alignment", "deduction", "symbol-translation"],
    interactionVerbs: ["turn", "face", "place"],
    stateCapacity: 8,
    supportsOrder: false,
    supportsSimultaneousInput: true,
  },
  {
    id: "sigil-stones",
    label: "Sigil Stones",
    tags: ["arcane", "symbolic", "modular"],
    compatibleArchetypeIds: ["sequence", "deduction", "symbol-translation"],
    interactionVerbs: ["place", "swap", "press"],
    stateCapacity: 10,
    supportsOrder: true,
    supportsSimultaneousInput: false,
  },
];
```

## `data/clueTypes.ts`

```ts
import type { ClueType } from "../types/components";

export const clueTypes: ClueType[] = [
  {
    id: "inscription",
    label: "Inscription",
    compatibleArchetypeIds: ["sequence", "deduction", "routing", "symbol-translation"],
    directness: "partial",
    abstractionLevel: "medium",
    canMislead: true,
  },
  {
    id: "mural",
    label: "Mural",
    compatibleArchetypeIds: ["sequence", "alignment", "deduction", "routing", "symbol-translation"],
    directness: "partial",
    abstractionLevel: "medium",
    canMislead: false,
  },
  {
    id: "journal-fragment",
    label: "Journal Fragment",
    compatibleArchetypeIds: ["sequence", "deduction", "symbol-translation"],
    directness: "direct",
    abstractionLevel: "low",
    canMislead: true,
  },
  {
    id: "statue-pose",
    label: "Statue Pose",
    compatibleArchetypeIds: ["alignment"],
    directness: "partial",
    abstractionLevel: "low",
    canMislead: false,
  },
  {
    id: "environmental-pattern",
    label: "Environmental Pattern",
    compatibleArchetypeIds: ["alignment", "routing"],
    directness: "indirect",
    abstractionLevel: "high",
    canMislead: false,
  },
  {
    id: "ghost-replay",
    label: "Ghost Replay",
    compatibleArchetypeIds: ["deduction"],
    directness: "partial",
    abstractionLevel: "medium",
    canMislead: false,
  },
];
```

## `data/twists.ts`

```ts
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
];
```

## `data/consequences.ts`

```ts
import type { ConsequenceType } from "../types/components";

export const consequences: ConsequenceType[] = [
  {
    id: "reset",
    label: "Puzzle Reset",
    severity: "low",
    repeatable: true,
    tensionType: "friction",
    allowedDifficulties: ["easy", "medium", "hard"],
  },
  {
    id: "arcane-pulse",
    label: "Arcane Pulse",
    severity: "medium",
    repeatable: true,
    tensionType: "attrition",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "alarm",
    label: "Alarm",
    severity: "medium",
    repeatable: false,
    tensionType: "escalation",
    allowedDifficulties: ["medium", "hard"],
  },
  {
    id: "flooding",
    label: "Flooding Room",
    severity: "high",
    repeatable: false,
    tensionType: "timer",
    allowedDifficulties: ["hard"],
  },
];
```

## `data/difficultyProfiles.ts`

```ts
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
```

## `data/tagCompatibility.ts`

```ts
export const requiredTagGroups = {
  sigils: ["rotating-rings", "sigil-stones", "symbol-translation"],
  mechanical: ["levers", "pressure-plates", "routing"],
  visual: ["mirrors", "statues", "mural"],
};

export const incompatibleTagPairs = [
  ["musical", "water-channels"],
  ["full-darkness", "color-coding"],
];
```

---

# Generator Rules for Copilot

These rules should be included in a planning document, comments file, or as the top section of the Copilot prompt.

## Rule 1 — Logic First
Do not generate prose first. Generate structured puzzle logic first, then optional flavor.

## Rule 2 — Archetype Before Tags
Theme tags influence presentation, but archetype compatibility determines legal combinations.

## Rule 3 — No Unclued Steps
Every required solution step must be supported by at least one direct clue or two partial clues.

## Rule 4 — No Contradictions by Default
Clues must not contradict each other unless a twist explicitly allows it.

## Rule 5 — Validate Before Return
Never return a puzzle before validation passes.

## Rule 6 — Prefer Repair Over Full Reroll
If a puzzle fails because of one incompatible or under-supported component, reroll or replace only the invalid part when possible.

## Rule 7 — Difficulty Must Be Enforced
Difficulty is not descriptive only. It must constrain:
- number of steps
- clue count
- twist allowance
- consequence severity

## Rule 8 — First Version Avoids Hybrid Archetypes
Do not combine two full archetypes in the MVP unless specifically requested.

## Rule 9 — Misleading Clues Are Rare
Misleading clues should only appear in hard puzzles or when explicitly enabled.

## Rule 10 — Consequences Should Add Tension, Not Arbitrary Punishment
Failure states should create pressure, friction, or escalation without invalidating the session.

## Rule 11 — Keep Output GM-Usable
The result should be explainable to a GM in a compact structured packet.

## Rule 12 — Preserve Future Extensibility
Use stable types and avoid hardcoding logic that prevents adding new archetypes, clues, or settings later.

---

# Suggested Copilot Instruction Block

This is a compact prompt you can paste into Copilot when starting the repo.

```md
Build a TypeScript puzzle generator for tabletop RPGs.

The generator is logic-first, not prose-first. It should create structured, GM-usable puzzle packets using:

- archetypes
- interface components
- clue types
- twists
- consequences
- difficulty profiles
- validation rules
- hint ladders

Important constraints:
- Archetype compatibility matters more than randomness.
- Every major solution step must be clued.
- Do not allow contradictions unless a twist explicitly enables them.
- Validate every generated puzzle before returning it.
- Difficulty must constrain steps, clues, twists, and consequence severity.
- The MVP should avoid hybrid archetypes.
- The system should support future AI prompt export, but AI decoration is not part of the core logic.

Start by implementing:
1. types
2. seed data
3. archetype selection
4. component selection
5. solution generation
6. clue generation
7. hint ladder generation
8. validation
9. prompt export

Treat seed data as examples, not exhaustive content.
```

---

# Updated Implementation Stages

## Stage 1 — Foundation

Tasks:

- define types
- create seed data
- add seed data comments clarifying they are examples only
- add archetypes
- add interfaces
- add clues
- add twists
- add consequences
- add difficulty profiles
- add compatibility rules

Deliverable: working scaffolding with concrete template data.

---

## Stage 2 — Archetype Rules

Tasks:

- implement archetype selection
- build solution generation
- define compatible components
- ensure archetypes expose defaults for step counts and clue requirements

Deliverable: generator produces structured puzzle skeletons.

---

## Stage 3 — Clue System

Tasks:

- build clue generation
- map clues to solution steps
- generate hint ladders
- enforce no-unclued-step rule

Deliverable: puzzles are playable and interpretable.

---

## Stage 4 — Consequences & Feedback

Tasks:

- implement failure states
- add feedback signals
- scale consequences by difficulty
- keep failure recoverable by default

Deliverable: puzzles include tension mechanics without becoming punitive.

---

## Stage 5 — Validation & Repair

Tasks:

- solvability validation
- clue coverage validation
- contradiction checks
- difficulty scoring
- interface compatibility checks
- targeted reroll/repair for invalid sub-parts

Deliverable: invalid puzzles are repaired or rejected automatically.

---

## Stage 6 — Prompt Export

Tasks:

- implement exportPrompt()
- format AI-ready prompts
- preserve solution structure
- ensure AI is only asked to decorate, not redesign

Deliverable: puzzles expandable by AI.

---

# Testing Strategy

### Unit Tests

Test:

- archetype selection
- compatibility filters
- solution generation
- clue assignment
- validation rules
- targeted repair logic

### Snapshot Tests

Generate many puzzles and inspect patterns.

### Heuristic Tests

Verify:

- puzzle always has clues
- puzzle always has solution steps
- every solution step is clued
- difficulty scaling consistent
- consequences within allowed severity
- easy puzzles do not contain misleading clues

### Seed Data Tests

Verify:

- all referenced ids exist
- no archetype references missing interface ids
- no clue type references invalid archetypes
- no consequence exceeds declared difficulty bands

---

# Future Expansion

Possible additions:

- hybrid puzzles
- setting packs
- ability bypass rules
- multi-room puzzle chains
- persistent puzzle states
- AI tone presets

Examples:

- arcane ruins pack
- dwarven vault pack
- fey shrine pack
- necromantic laboratory pack

---

# Recommended MVP Scope

First version should include:

- 5 archetypes
- ~10 interfaces
- ~10 clue types
- 6 twists
- 6 consequences
- 3 difficulty levels
- validation system
- hint ladder
- targeted repair step
- AI prompt exporter

---

# Final Principle

Build the generator **logic-first**.

Structure must be correct before prose is added.

Once puzzles are structurally sound, AI can generate flavor easily.
