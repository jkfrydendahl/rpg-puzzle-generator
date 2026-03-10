import { useState } from "react";
import type { GeneratedPuzzle } from "../../types/puzzle.js";

type Props = {
  puzzle: GeneratedPuzzle | null;
  promptText: string;
};

export function PuzzleDisplay({ puzzle, promptText }: Props) {
  const [hintsRevealed, setHintsRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!puzzle) {
    return (
      <section className="puzzle-panel empty">
        <p>Configure settings and click <strong>Generate Puzzle</strong> to begin.</p>
      </section>
    );
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  function puzzleToText(): string {
    const lines: string[] = [
      `# ${puzzle!.archetype} — ${puzzle!.difficulty}`,
      puzzle!.environment ? `Environment: ${puzzle!.environment}` : "",
      `Tags: ${puzzle!.tags.join(", ")}`,
      "",
      `## Interface`,
      `Primary: ${puzzle!.interface.primary.join(", ")}`,
      puzzle!.interface.secondary?.length
        ? `Secondary: ${puzzle!.interface.secondary.join(", ")}`
        : "",
      "",
      `## Solution`,
      `Objective: ${puzzle!.solution.objective}`,
      ...puzzle!.solution.steps.map((s, i) => `  ${i + 1}. ${s}`),
      `Final state: ${puzzle!.solution.finalState}`,
      `Logic: ${puzzle!.solution.internalLogic}`,
      "",
      `## Clues`,
      ...puzzle!.clues.map(
        (c) => `- [${c.directness}] ${c.source}: ${c.content} → ${c.pointsTo.join(", ")}`,
      ),
      "",
    ];
    if (puzzle!.twist) {
      lines.push(`## Twist`, `${puzzle!.twist.type}: ${puzzle!.twist.effect}`, "");
    }
    lines.push(
      `## Consequence`,
      `${puzzle!.consequence.type} (${puzzle!.consequence.severity}): ${puzzle!.consequence.behavior}`,
      "",
      `## Hints`,
      ...puzzle!.hints.map((h, i) => `  ${i + 1}. ${h}`),
      "",
      `## GM Notes`,
      `Pacing: ${puzzle!.gmNotes.pacingAdvice}`,
      ...puzzle!.gmNotes.likelyMisreads.map((m) => `Misread: ${m}`),
      ...puzzle!.gmNotes.bypassIdeas.map((b) => `Bypass: ${b}`),
    );
    return lines.filter((l) => l !== undefined).join("\n");
  }

  const difficultyClass = `badge difficulty-${puzzle.difficulty}`;

  return (
    <section className="puzzle-panel">
      <div className="puzzle-header">
        <h2>{puzzle.archetype}</h2>
        <span className={difficultyClass}>{puzzle.difficulty}</span>
        {puzzle.environment && <span className="badge">{puzzle.environment}</span>}
      </div>

      {puzzle.tags.length > 0 && (
        <div className="tag-list">
          {puzzle.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      {/* Interface */}
      <div className="puzzle-section" style={{ marginTop: "1rem" }}>
        <h3>Interface</h3>
        <p>
          <span className="field-label">Primary:</span>
          <span className="field-value">{puzzle.interface.primary.join(", ")}</span>
        </p>
        {puzzle.interface.secondary && puzzle.interface.secondary.length > 0 && (
          <p>
            <span className="field-label">Secondary:</span>
            <span className="field-value">{puzzle.interface.secondary.join(", ")}</span>
          </p>
        )}
      </div>

      {/* Solution */}
      <div className="puzzle-section">
        <h3>Solution</h3>
        <p>
          <span className="field-label">Objective:</span>
          <span className="field-value">{puzzle.solution.objective}</span>
        </p>
        <ol>
          {puzzle.solution.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p>
          <span className="field-label">Final State:</span>
          <span className="field-value">{puzzle.solution.finalState}</span>
        </p>
        <p>
          <span className="field-label">Internal Logic:</span>
          <span className="field-value">{puzzle.solution.internalLogic}</span>
        </p>
      </div>

      {/* Clues */}
      <div className="puzzle-section">
        <h3>Clues</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {puzzle.clues.map((clue, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              <span className={`clue-directness ${clue.directness}`}>{clue.directness}</span>
              <strong>{clue.source}:</strong> {clue.content}
              <br />
              <span className="field-label">Points to:</span> {clue.pointsTo.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* Twist */}
      {puzzle.twist && (
        <div className="puzzle-section">
          <h3>Twist</h3>
          <p>
            <span className="field-label">Type:</span>
            <span className="field-value">{puzzle.twist.type}</span>
          </p>
          <p>{puzzle.twist.effect}</p>
        </div>
      )}

      {/* Consequence */}
      <div className="puzzle-section">
        <h3>Consequence</h3>
        <p>
          <span className="field-label">Type:</span>
          <span className="field-value">{puzzle.consequence.type}</span>
          <span className={`badge difficulty-${puzzle.consequence.severity === "high" ? "hard" : puzzle.consequence.severity === "low" ? "easy" : ""}`} style={{ marginLeft: "0.5rem" }}>
            {puzzle.consequence.severity}
          </span>
        </p>
        <p>{puzzle.consequence.behavior}</p>
      </div>

      {/* Feedback */}
      <div className="puzzle-section">
        <h3>Feedback Signals</h3>
        <p><span className="field-label">Success:</span> {puzzle.feedback.successSignals.join("; ")}</p>
        <p><span className="field-label">Failure:</span> {puzzle.feedback.failureSignals.join("; ")}</p>
        <p><span className="field-label">Progress:</span> {puzzle.feedback.partialProgressSignals.join("; ")}</p>
      </div>

      {/* Hints */}
      <div className="puzzle-section">
        <h3>Hints</h3>
        <button
          className="hint-toggle"
          onClick={() => setHintsRevealed(!hintsRevealed)}
        >
          {hintsRevealed ? "Hide hints" : `Reveal ${puzzle.hints.length} hints`}
        </button>
        {hintsRevealed && (
          <ol>
            {puzzle.hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ol>
        )}
      </div>

      {/* GM Notes */}
      <div className="puzzle-section gm-notes-section">
        <h3>GM Notes</h3>
        <p>{puzzle.gmNotes.pacingAdvice}</p>
        {puzzle.gmNotes.likelyMisreads.map((m, i) => (
          <p key={`m-${i}`} className="misread">⚠ Likely misread: {m}</p>
        ))}
        {puzzle.gmNotes.bypassIdeas.map((b, i) => (
          <p key={`b-${i}`} className="bypass">💡 Bypass: {b}</p>
        ))}
      </div>

      {/* Actions */}
      <div className="puzzle-actions">
        <button className="copy-button" onClick={() => copyText(puzzleToText(), "puzzle")}>
          {copied === "puzzle" ? "Copied!" : "Copy Puzzle"}
        </button>
        <button className="copy-prompt-button" onClick={() => copyText(promptText, "prompt")}>
          {copied === "prompt" ? "Copied!" : "Copy AI Prompt"}
        </button>
      </div>
    </section>
  );
}
