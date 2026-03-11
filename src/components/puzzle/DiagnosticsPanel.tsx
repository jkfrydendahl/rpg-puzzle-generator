import type { PuzzleScore } from "../../lib/scorePuzzle.js";
import type { GeneratedPuzzle } from "../../types/puzzle.js";
import type { AIUsage } from "../../types/ai.js";
import type { UsageSummary } from "../../hooks/useAIUsageHistory.js";

type Props = {
  puzzle: GeneratedPuzzle | null;
  score: PuzzleScore | null;
  currentAIUsage?: AIUsage | null;
  usageSummary?: UsageSummary | null;
};

const dimensionLabels: Record<string, string> = {
  solvability: "Solvability",
  clueCoverage: "Clue Coverage",
  difficultyFit: "Difficulty Fit",
  tensionBalance: "Tension",
  gmUsability: "GM Usability",
};

export function DiagnosticsPanel({ puzzle, score, currentAIUsage, usageSummary }: Props) {
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
            {puzzle.validation.softWarnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        </>
      )}

      {/* Puzzle metadata */}
      <h3>Metadata</h3>
      <h4 className="meta-subheader">Interface(s)</h4>
      <ul className="meta-list">
        {[...new Set([...puzzle.interface.primary, ...(puzzle.interface.secondary ?? [])])].map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
      <h4 className="meta-subheader">Solution</h4>
      <ul className="meta-list">
        <li>{puzzle.solution.steps.length} steps</li>
        <li>{puzzle.clues.length} clues</li>
        <li>{puzzle.hints.length} hints</li>
      </ul>
      {puzzle.twist && (
        <>
          <h4 className="meta-subheader">Twist</h4>
          <ul className="meta-list">
            <li>{puzzle.twist.type}</li>
          </ul>
        </>
      )}

      {/* AI Usage */}
      {currentAIUsage && (
        <>
          <h3>AI Token Usage</h3>
          <div className="validation-item">
            <span className="field-label">Prompt:</span> {currentAIUsage.promptTokens}
          </div>
          <div className="validation-item">
            <span className="field-label">Completion:</span> {currentAIUsage.completionTokens}
          </div>
          <div className="validation-item">
            <span className="field-label">Total:</span> {currentAIUsage.totalTokens}
          </div>
        </>
      )}

      {usageSummary && usageSummary.generationCount > 0 && (
        <>
          <h3>Session Cost</h3>
          <div className="validation-item">
            {usageSummary.generationCount} generations — ${usageSummary.estimatedCost.toFixed(4)}
          </div>
        </>
      )}
    </aside>
  );
}
