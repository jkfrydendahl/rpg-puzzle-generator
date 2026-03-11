import type { GeneratedPuzzle } from "../types/puzzle.js";
import { seedNotes } from "../data/seedNotes.js";

/**
 * Export a structured AI prompt from a generated puzzle.
 *
 * The prompt asks AI to decorate — not redesign — the puzzle.
 * It preserves all solution logic and asks the AI to generate:
 * - room description
 * - diegetic clue presentations
 * - inscriptions and riddles
 * - solution walkthrough
 * - progressive hint ladder
 * - twist narrative (when present)
 * - success/failure descriptions
 * - GM explanation
 */
export function exportPrompt(puzzle: GeneratedPuzzle): string {
  const lines: string[] = [
    "# RPG Puzzle — AI Decoration Prompt",
    "",
    "You are a creative writing assistant for a tabletop RPG Game Master.",
    "Below is a structured puzzle. Your job is to DECORATE it with flavor text,",
    "room descriptions, inscriptions, and riddles. Do NOT change the puzzle logic.",
    "",
    "## Puzzle Overview",
    "",
    `- **Archetype:** ${puzzle.archetype}`,
    `- **Difficulty:** ${puzzle.difficulty}`,
    `- **Environment:** ${puzzle.environment ?? "unspecified"}`,
    `- **Tags:** ${puzzle.tags.join(", ")}`,
    "",
    "## Interface",
    "",
    `- **Primary:** ${puzzle.interface.primary.join(", ")}`,
  ];

  if (puzzle.interface.secondary?.length) {
    lines.push(`- **Secondary:** ${puzzle.interface.secondary.join(", ")}`);
  }

  lines.push(
    "",
    "## Solution (DO NOT CHANGE)",
    "",
    `**Objective:** ${puzzle.solution.objective}`,
    "",
    "**Steps:**",
  );

  puzzle.solution.steps.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });

  lines.push(
    "",
    `**Final State:** ${puzzle.solution.finalState}`,
    `**Internal Logic:** ${puzzle.solution.internalLogic}`,
    "",
    "## Clues (present these diegetically)",
    "",
  );

  puzzle.clues.forEach((clue, i) => {
    lines.push(`${i + 1}. **${clue.source}** (${clue.directness}): ${clue.content}`);
  });

  if (puzzle.twist) {
    lines.push(
      "",
      "## Twist",
      "",
      `- **Type:** ${puzzle.twist.type}`,
      `- **Effect:** ${puzzle.twist.effect}`,
    );
  }

  lines.push(
    "",
    "## Consequence on Failure",
    "",
    `- **Type:** ${puzzle.consequence.type}`,
    `- **Severity:** ${puzzle.consequence.severity}`,
    `- **Behavior:** ${puzzle.consequence.behavior}`,
    "",
    "## Hint Ladder (progressive hints for stuck players)",
    "",
  );

  puzzle.hints.forEach((hint, i) => {
    lines.push(`${i + 1}. ${hint}`);
  });

  lines.push(
    "",
    "## GM Notes",
    "",
    `**Pacing Advice:** ${puzzle.gmNotes.pacingAdvice}`,
  );

  if (puzzle.gmNotes.likelyMisreads.length > 0) {
    lines.push("", "**Likely Misreads:**");
    puzzle.gmNotes.likelyMisreads.forEach((m) => lines.push(`- ${m}`));
  }

  if (puzzle.gmNotes.bypassIdeas.length > 0) {
    lines.push("", "**Bypass Ideas:**");
    puzzle.gmNotes.bypassIdeas.forEach((b) => lines.push(`- ${b}`));
  }

  lines.push(
    "",
    "## GM Design Notes",
    "",
  );

  const relevant = selectRelevantNotes(puzzle);
  if (relevant.length > 0) {
    for (const note of relevant) {
      lines.push(`### ${note.title}`, "", note.body, "");
    }
  } else {
    lines.push("_No additional design notes for this puzzle configuration._", "");
  }

  lines.push(
    "## Your Tasks",
    "",
    "1. Describe the room or area where this puzzle is found.",
    "2. Present each clue as part of the environment (inscriptions, murals, objects).",
    "3. Write any riddles or inscriptions referenced by the clues.",
    "4. Write a **Solution Walkthrough** section explaining how the puzzle is solved step by step, written for the GM.",
    "5. Include a **Hints** section with the progressive hints from the hint ladder, worded as things the GM can reveal to stuck players.",
    puzzle.twist
      ? `6. Write a **Twist** section describing the ${puzzle.twist.type} twist. This is a complication that changes the puzzle mid-solve — it is NOT the failure consequence. Describe when/how the twist activates and how it affects the players' approach.`
      : "6. _(No twist for this puzzle.)_",
    `7. Write separate **Success** and **Failure** sections. Success describes what happens when the puzzle is solved. Failure describes the consequence: ${puzzle.consequence.type} (${puzzle.consequence.severity} severity). Keep failure outcomes distinct from any twist — they are different mechanics.`,
    "8. Write a brief GM explanation summarizing how to run this puzzle at the table, including pacing advice.",
    "",
    "**Important:** The twist (a mid-puzzle complication) and the failure consequence (what happens when players fail) are SEPARATE mechanics. Do not merge or conflate them.",
    "Do not alter the solution steps, internal logic, or puzzle mechanics.",
    "Your role is to add flavor and narrative — the puzzle structure must remain intact.",
  );

  return lines.join("\n");
}

function selectRelevantNotes(puzzle: GeneratedPuzzle) {
  return seedNotes.filter((note) => {
    if (note.category === "general") return true;
    if (note.category === "archetype" && note.id.includes(puzzle.archetype)) return true;
    if (note.category === "environment" && puzzle.environment) return true;
    if (note.category === "twist" && puzzle.twist) return true;
    // Include interface notes when primary interface labels overlap with note keywords
    if (note.category === "interface") {
      const lowerBody = note.body.toLowerCase();
      return puzzle.interface.primary.some((p) => lowerBody.includes(p.toLowerCase()));
    }
    return false;
  });
}
