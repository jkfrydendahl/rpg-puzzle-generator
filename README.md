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

### Web UI

```bash
# Start the dev server (Vite + Express backend)
npm run dev
# In a separate terminal:
npx tsx server/index.ts
```

The web UI provides a 3-column layout with controls, puzzle display, and diagnostics. When AI is enabled, puzzles are automatically decorated with narrative text after generation.

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
npm test          # Run all tests (Vitest)
npm run test:watch # Watch mode
npm run build     # TypeScript compile
npm run dev       # Vite dev server
npm run build:web # Production web build
```

### Project Structure

```
src/
  cli.ts                 # CLI entry point
  lib/                   # Core generator logic
  types/                 # TypeScript type definitions
  data/                  # Seed data (archetypes, clues, twists, etc.)
  components/            # React UI components
  hooks/                 # React hooks (AI decoration, usage tracking, settings)
  services/              # Client-side API abstraction
  pages/                 # Page components
  tests/                 # Test files
server/
  index.ts               # Express server
  config.ts              # Environment configuration
  routes/decorate.ts     # POST /api/decorate endpoint
  services/aiService.ts  # OpenAI wrapper
  tests/                 # Server-side tests
```

## License

[MIT](LICENSE)