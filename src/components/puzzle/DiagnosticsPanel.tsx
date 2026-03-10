import type { PuzzleScore } from "../../lib/scorePuzzle.js";
import type { GeneratedPuzzle } from "../../types/puzzle.js";

type Props = {
  puzzle: GeneratedPuzzle | null;
  score: PuzzleScore | null;
};

const dimensionLabels: Record<string, string> = {
  solvability: "Solvability",
  clueCoverage: "Clue Coverage",
  difficultyFit: "Difficulty Fit",
  tensionBalance: "Tension",
  gmUsability: "GM Usability",
};

export function DiagnosticsPanel({ puzzle, score }: Props) {
  if (!puzzle || !score) {
    return (
      <aside className="diagnostics-panel empty">
        <p>Generate a puzzle to see diagnostics.</p>
      </aside>
    );
  }

  const overallClass = score.overall >= 70 ? "valid" : "invalid";

  return (
    <aside className="diagnostics-panel">
      <h2>Diagnostics</h2>

      {/* Overall score */}
      <div className="overall-score">
        <span className={`score-number ${overallClass}`}>{score.overall}</span>
        <span className="validity">
          / 100 — {puzzle.validation.isSolvable ? "Solvable ✓" : "Not solvable ✗"}
        </span>
      </div>

      {/* Score breakdown */}
      <h3>Score Breakdown</h3>
      {Object.entries(score.breakdown).map(([key, value]) => (
        <div key={key} className="score-bar">
          <span className="score-label">{dimensionLabels[key] ?? key}</span>
          <div className="score-track">
            <div className="score-fill" style={{ width: `${value}%` }} />
          </div>
          <span className="score-value">{value}</span>
        </div>
      ))}

      {/* Validation */}
      <h3>Validation</h3>
      <div className="validation-item">
        <span className={puzzle.validation.isSolvable ? "check" : "cross"}>
          {puzzle.validation.isSolvable ? "✓" : "✗"}
        </span>
        Solvable
      </div>
      <div className="validation-item">
        <span className={puzzle.validation.clueCoverage >= 1 ? "check" : "cross"}>
          {puzzle.validation.clueCoverage >= 1 ? "✓" : "✗"}
        </span>
        Clue coverage: {Math.round(puzzle.validation.clueCoverage * 100)}%
      </div>

      {/* Warnings */}
      {puzzle.validation.contradictionWarnings.length > 0 && (
        <>
          <h3>Contradiction Warnings</h3>
          <div className="warnings-list">
            <ul>
              {puzzle.validation.contradictionWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {puzzle.validation.softWarnings.length > 0 && (
        <>
          <h3>Soft Warnings</h3>
          <div className="warnings-list">
            <ul>
              {puzzle.validation.softWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Puzzle metadata */}
      <h3>Metadata</h3>
      <div className="validation-item">
        <span className="field-label">Steps:</span> {puzzle.solution.steps.length}
      </div>
      <div className="validation-item">
        <span className="field-label">Clues:</span> {puzzle.clues.length}
      </div>
      <div className="validation-item">
        <span className="field-label">Hints:</span> {puzzle.hints.length}
      </div>
      {puzzle.twist && (
        <div className="validation-item">
          <span className="field-label">Twist:</span> {puzzle.twist.type}
        </div>
      )}
    </aside>
  );
}
