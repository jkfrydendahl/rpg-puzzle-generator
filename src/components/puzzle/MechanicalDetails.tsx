import { useState, type ReactNode } from "react";
import type { GeneratedPuzzle } from "../../types/puzzle.js";

type Props = {
  puzzle: GeneratedPuzzle;
  hasNarrative: boolean;
  narrativeSlot?: ReactNode;
};

export function MechanicalDetails({ puzzle, hasNarrative, narrativeSlot }: Props) {
  const [open, setOpen] = useState(false);

  if (!hasNarrative && !narrativeSlot) {
    return <div className="mechanical-details">{renderContent(puzzle)}</div>;
  }

  return (
    <div className="mechanical-details has-narrative" role="group" {...(open ? { open: "" } : {})}>
      {narrativeSlot && <div className="mechanical-narrative">{narrativeSlot}</div>}
      <button
        className="mechanical-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="mechanical-toggle-icon">{open ? "▾" : "▸"}</span>
        Mechanical Details
      </button>
      {open && <div className="mechanical-content">{renderContent(puzzle)}</div>}
    </div>
  );
}

function renderContent(puzzle: GeneratedPuzzle) {
  return (
    <>
      {/* Header */}
      <div className="puzzle-header">
        <h2>{puzzle.archetype}</h2>
        <span className={`badge difficulty-${puzzle.difficulty}`}>{puzzle.difficulty}</span>
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
          <span
            className={`badge difficulty-${puzzle.consequence.severity === "high" ? "hard" : puzzle.consequence.severity === "low" ? "easy" : ""}`}
            style={{ marginLeft: "0.5rem" }}
          >
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
        <ol>
          {puzzle.hints.map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ol>
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
    </>
  );
}
