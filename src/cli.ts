#!/usr/bin/env node

import { generatePuzzle } from "./lib/generatePuzzle.js";
import { exportPrompt } from "./lib/exportPrompt.js";
import { scorePuzzle } from "./lib/scorePuzzle.js";
import type { PuzzleDifficulty, PuzzleSeed } from "./types/puzzle.js";
import OpenAI from "openai";

// ── Parse CLI arguments ──────────────────────────────────────
const args = process.argv.slice(2);

function printUsage(): void {
  console.log(`
RPG Puzzle Generator

Usage:
  npx rpg-puzzle-generator [options]

Options:
  --difficulty <easy|medium|hard>   Set difficulty (default: medium)
  --environment <name>              Set environment theme (e.g. "dungeon", "forest")
  --tags <tag1,tag2,...>            Required tags (comma-separated)
  --exclude <tag1,tag2,...>         Excluded tags (comma-separated)
  --seed <number>                   RNG seed for reproducible output
  --prompt                          Output AI decoration prompt instead of JSON
  --ai                              Decorate puzzle with AI narrative (requires OPENAI_API_KEY)
  --help                            Show this help message
`);
}

function parseArgs(argv: string[]): {
  difficulty: PuzzleDifficulty;
  environment?: string;
  requiredTags?: string[];
  excludedTags?: string[];
  rngSeed?: number;
  promptMode: boolean;
  aiMode: boolean;
} {
  const result: ReturnType<typeof parseArgs> = {
    difficulty: "medium",
    promptMode: false,
    aiMode: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      case "--difficulty":
        {
          const val = argv[++i];
          if (val !== "easy" && val !== "medium" && val !== "hard") {
            console.error(`Invalid difficulty: "${val}". Must be easy, medium, or hard.`);
            process.exit(1);
          }
          result.difficulty = val as PuzzleDifficulty;
        }
        break;
      case "--environment":
        result.environment = argv[++i];
        break;
      case "--tags":
        result.requiredTags = argv[++i]?.split(",").map((t) => t.trim());
        break;
      case "--exclude":
        result.excludedTags = argv[++i]?.split(",").map((t) => t.trim());
        break;
      case "--seed":
        {
          const num = Number(argv[++i]);
          if (Number.isNaN(num)) {
            console.error("--seed must be a number.");
            process.exit(1);
          }
          result.rngSeed = num;
        }
        break;
      case "--prompt":
        result.promptMode = true;
        break;
      case "--ai":
        result.aiMode = true;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        printUsage();
        process.exit(1);
    }
  }
  return result;
}

// ── Main ─────────────────────────────────────────────────────
const config = parseArgs(args);

const seed: PuzzleSeed = {
  difficulty: config.difficulty,
  environment: config.environment,
  requiredTags: config.requiredTags,
  excludedTags: config.excludedTags,
};

const puzzle = generatePuzzle({
  seed,
  rngSeed: config.rngSeed,
});

if (config.aiMode) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY environment variable is required for --ai mode.");
    process.exit(1);
  }
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const prompt = exportPrompt(puzzle);
  const client = new OpenAI({ apiKey });
  client.chat.completions
    .create({
      model,
      messages: [{ role: "user", content: prompt }],
    })
    .then((response) => {
      const narrative = response.choices[0]?.message?.content ?? "";
      console.log(narrative);
      const usage = response.usage;
      if (usage) {
        console.log();
        console.log(
          `[tokens: ${usage.prompt_tokens} in / ${usage.completion_tokens} out / ${usage.total_tokens} total | model: ${model}]`,
        );
      }
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`AI decoration failed: ${msg}`);
      process.exit(1);
    });
} else if (config.promptMode) {
  console.log(exportPrompt(puzzle));
} else {
  const score = scorePuzzle(puzzle);

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  RPG PUZZLE GENERATOR — Output");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log();
  console.log(`  ID:          ${puzzle.id}`);
  console.log(`  Difficulty:  ${puzzle.difficulty}`);
  console.log(`  Archetype:   ${puzzle.archetype}`);
  console.log(`  Environment: ${puzzle.environment ?? "(none)"}`);
  console.log(`  Tags:        ${puzzle.tags.join(", ")}`);
  console.log();
  console.log("─── Interface ──────────────────────────────────────────────");
  console.log(`  Primary:   ${puzzle.interface.primary.join(", ")}`);
  if (puzzle.interface.secondary?.length) {
    console.log(`  Secondary: ${puzzle.interface.secondary.join(", ")}`);
  }
  console.log();
  console.log("─── Solution ───────────────────────────────────────────────");
  console.log(`  Objective: ${puzzle.solution.objective}`);
  puzzle.solution.steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log(`  Final State: ${puzzle.solution.finalState}`);
  console.log(`  Logic:       ${puzzle.solution.internalLogic}`);
  console.log();
  console.log("─── Clues ──────────────────────────────────────────────────");
  puzzle.clues.forEach((clue, i) => {
    console.log(`  ${i + 1}. [${clue.directness}] ${clue.source}: ${clue.content}`);
  });
  console.log();
  if (puzzle.twist) {
    console.log("─── Twist ──────────────────────────────────────────────────");
    console.log(`  Type:   ${puzzle.twist.type}`);
    console.log(`  Effect: ${puzzle.twist.effect}`);
    console.log();
  }
  console.log("─── Consequence ────────────────────────────────────────────");
  console.log(`  Type:     ${puzzle.consequence.type}`);
  console.log(`  Severity: ${puzzle.consequence.severity}`);
  console.log(`  Behavior: ${puzzle.consequence.behavior}`);
  console.log();
  console.log("─── Hints ──────────────────────────────────────────────────");
  puzzle.hints.forEach((hint, i) => {
    console.log(`  Hint ${i + 1}: ${hint}`);
  });
  console.log();
  console.log("─── GM Notes ───────────────────────────────────────────────");
  console.log(`  Pacing: ${puzzle.gmNotes.pacingAdvice}`);
  if (puzzle.gmNotes.likelyMisreads.length) {
    console.log("  Likely Misreads:");
    puzzle.gmNotes.likelyMisreads.forEach((m) => console.log(`    • ${m}`));
  }
  if (puzzle.gmNotes.bypassIdeas.length) {
    console.log("  Bypass Ideas:");
    puzzle.gmNotes.bypassIdeas.forEach((b) => console.log(`    • ${b}`));
  }
  console.log();
  console.log("─── Validation ─────────────────────────────────────────────");
  console.log(`  Solvable:       ${puzzle.validation.isSolvable ? "✓" : "✗"}`);
  console.log(`  Clue Coverage:  ${Math.round(puzzle.validation.clueCoverage * 100)}%`);
  if (puzzle.validation.contradictionWarnings.length) {
    console.log("  Warnings:");
    puzzle.validation.contradictionWarnings.forEach((w) => console.log(`    ⚠ ${w}`));
  }
  if (puzzle.validation.softWarnings.length) {
    console.log("  Soft Warnings:");
    puzzle.validation.softWarnings.forEach((w) => console.log(`    ℹ ${w}`));
  }
  console.log();
  console.log("─── Score ──────────────────────────────────────────────────");
  console.log(`  Overall:        ${score.overall}/100`);
  console.log(`  Solvability:    ${score.breakdown.solvability}/100`);
  console.log(`  Clue Coverage:  ${score.breakdown.clueCoverage}/100`);
  console.log(`  Difficulty Fit: ${score.breakdown.difficultyFit}/100`);
  console.log(`  Tension:        ${score.breakdown.tensionBalance}/100`);
  console.log(`  GM Usability:   ${score.breakdown.gmUsability}/100`);
  console.log();
  console.log("═══════════════════════════════════════════════════════════════");
}
