# RPG Puzzle Generator

A **logic-first puzzle generator** for tabletop RPGs. Creates structured puzzle packets that GMs can use at the table, with optional AI narrative decoration via OpenAI.

Puzzle logic is always generated before flavor text. The core generator produces solvable puzzle structures; the AI layer adds atmospheric descriptions on top.

## Quick Start

```bash
npm install
npm run build
```

### CLI

```bash
# Generate a puzzle (JSON output)
node dist/cli.js

# With options
node dist/cli.js --difficulty hard --environment dungeon --tags ordered,pressure

# Output an AI decoration prompt
node dist/cli.js --prompt

# Generate + decorate with AI narrative (requires OPENAI_API_KEY)
OPENAI_API_KEY=sk-... node dist/cli.js --ai
```

**CLI Options:**

| Flag | Description |
|------|-------------|
| `--difficulty <easy\|medium\|hard>` | Set difficulty (default: `medium`) |
| `--environment <name>` | Environment theme (e.g. `dungeon`, `forest`) |
| `--tags <t1,t2,...>` | Required tags (comma-separated) |
| `--exclude <t1,t2,...>` | Excluded tags (comma-separated) |
| `--seed <number>` | RNG seed for reproducible output |
| `--prompt` | Output AI decoration prompt instead of JSON |
| `--ai` | Decorate puzzle with AI narrative (requires `OPENAI_API_KEY`) |
| `--help`, `-h` | Show help message |

### Web UI

```bash
# Start the dev server (Vite + Express backend)
npm run dev
# In a separate terminal:
npx tsx server/index.ts
```

The web UI provides a 3-column layout:

- **Controls sidebar** — difficulty, environment, archetype filter, tags, seed, AI toggle, generate/reset buttons. Settings persist in localStorage.
- **Puzzle display** — shows the generated puzzle with copy-to-clipboard. When AI is enabled, the AI narrative appears in a collapsible section with safe markdown rendering, and the raw mechanical details collapse behind a toggle below it.
- **Diagnostics sidebar** — puzzle quality score (0–100 across 5 dimensions), validation status, and AI usage tracking (tokens and estimated cost per session).

When AI is enabled, puzzles are automatically decorated with narrative text after generation.

### AI Narrative Decoration

The AI layer sends the generated puzzle structure to OpenAI and returns atmospheric narrative text. 
It requires an API key:

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `OPENAI_API_KEY` | N/A | Required for AI decoration |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `PORT` | `3001` | Express server port |

**Server hardening:** The API endpoint includes a 16 KB body limit, 8,000 character prompt cap, rate limiting (20 requests/minute per IP), and a system prompt that constrains output to narrative flavor text only.

## Puzzle Quality Scoring

Every generated puzzle is scored 0–100 across five weighted dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| Solvability | 30% | Is the puzzle solvable (binary 0 or 100) |
| Clue Coverage | 25% | Fraction of solution steps supported by clues |
| Difficulty Fit | 20% | How well step/clue/twist counts match the difficulty profile |
| Tension Balance | 15% | Presence of consequences, failure signals, and partial progress |
| GM Usability | 10% | Objective, internal logic, 3+ hints, and pacing advice |

The generator uses **targeted repair** instead of full rerolls — if a puzzle fails validation, only the broken part is replaced (up to N retries) before falling back to regeneration.

## Docker Support

Run tests in a container:

```bash
docker compose -f docker/docker-compose.test.yml run --rm test
```

See `docker/examples/` for CI/CD pipeline templates (Node, .NET, Go, Python, AL/BC).

## Core Design Principles

1. Puzzle logic must always be **solvable**
2. Every required step must be **supported by clues**
3. Archetype compatibility determines valid puzzle structures
4. Difficulty constrains complexity
5. Generated output should be **GM-usable without modification**
6. **Logic before flavor** -- AI decoration is always optional

## Puzzle Structure

Every generated puzzle contains:

- Archetype + difficulty + tags
- Interface components (primary / secondary)
- Solution (objective, steps, final state, internal logic)
- Clue sources
- Optional twist
- Consequence (type, severity, behavior)
- Hint ladder (progressive hints)
- Feedback signals (success, failure, partial progress)
- GM notes (pacing, likely misreads, bypass ideas)
- Validation metadata (solvability, clue coverage, warnings)

## Development

```bash
npm test          # Run all tests (Vitest, ~400 tests)
npm run test:watch # Watch mode
npm run build     # TypeScript compile
npm run dev       # Vite dev server
npm run build:web # Production web build
npm run preview   # Preview production build
npm start         # Run CLI (node dist/cli.js)
```

### Project Structure

```
src/
  cli.ts                 # CLI entry point
  App.tsx / App.css      # React app shell and styles
  main.tsx / index.css   # Vite entry point
  lib/
    generatePuzzle.ts    # Main puzzle generation orchestrator
    scorePuzzle.ts       # 5-dimension quality scoring (0–100)
    validatePuzzle.ts    # Solvability and clue-coverage validation
    rerollInvalidParts.ts # Targeted repair of invalid puzzle parts
    buildSolutionPath.ts # Step-by-step solution generation
    buildClueSet.ts      # Clue assembly
    buildHintLadder.ts   # Progressive hint ladder
    buildFailureState.ts # Failure/consequence state construction
    selectArchetype.ts   # Archetype selection with filter matching
    selectComponents.ts  # Component selection (interface, twist, etc.)
    exportPrompt.ts      # AI decoration prompt export
    random.ts            # Seeded RNG utility
  types/                 # TypeScript type definitions
  data/                  # Seed data (archetypes, clues, twists, etc.)
  components/
    controls/
      ControlsPanel.tsx  # Settings sidebar
    puzzle/
      PuzzleDisplay.tsx  # Main puzzle output with copy buttons
      NarrativeDisplay.tsx # AI narrative with collapsible toggle + copy
      MechanicalDetails.tsx # Raw puzzle data (collapses when narrative active)
      DiagnosticsPanel.tsx  # Score breakdown, validation, AI usage stats
  hooks/
    useAIDecoration.ts      # AI decoration state machine (loading/error/result)
    useAIUsageHistory.ts    # Cumulative token/cost tracking in localStorage
    useGeneratorSettings.ts # Settings persistence in localStorage
  services/
    aiClient.ts          # Client-side fetch wrapper for /api/decorate
  pages/
    HomePage.tsx         # Main page orchestrating all components
  tests/                 # 18 test files (~400 tests)
server/
  index.ts               # Express server (body limit, rate limiting)
  config.ts              # Environment configuration
  routes/decorate.ts     # POST /api/decorate endpoint
  services/aiService.ts  # OpenAI wrapper
  tests/                 # 3 server-side test files
docker/
  docker-compose.test.yml # Containerized test runner (node:20-alpine)
  examples/              # CI/CD examples (Node, .NET, Go, Python, AL/BC)
public/
  d20.svg                # App icon
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, Vite 5 |
| Server | Express 5, Node.js |
| AI | OpenAI SDK 6 (`gpt-4o-mini` default) |
| Tests | Vitest, Testing Library, jsdom |
| Language | TypeScript 5.4+ |

## License

[MIT](LICENSE)