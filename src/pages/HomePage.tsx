import { useState, useCallback, useRef } from "react";
import type { GeneratedPuzzle } from "../types/puzzle.js";
import type { PuzzleScore } from "../lib/scorePuzzle.js";
import type { AIUsage } from "../types/ai.js";
import { generatePuzzle } from "../lib/generatePuzzle.js";
import { scorePuzzle } from "../lib/scorePuzzle.js";
import { exportPrompt } from "../lib/exportPrompt.js";
import { useGeneratorSettings } from "../hooks/useGeneratorSettings.js";
import { createAIDecoration } from "../hooks/useAIDecoration.js";
import { decoratePuzzle } from "../services/aiClient.js";
import { createUsageTracker } from "../hooks/useAIUsageHistory.js";
import { ControlsPanel } from "../components/controls/ControlsPanel.js";
import { PuzzleDisplay } from "../components/puzzle/PuzzleDisplay.js";
import { DiagnosticsPanel } from "../components/puzzle/DiagnosticsPanel.js";
import { NarrativeDisplay } from "../components/puzzle/NarrativeDisplay.js";
import { MechanicalDetails } from "../components/puzzle/MechanicalDetails.js";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function HomePage() {
  const { settings, updateSetting, resetSettings } = useGeneratorSettings();
  const [puzzle, setPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [score, setScore] = useState<PuzzleScore | null>(null);
  const [promptText, setPromptText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI decoration state
  const [narrative, setNarrative] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [currentAIUsage, setCurrentAIUsage] = useState<AIUsage | null>(null);

  const usageTracker = useRef(createUsageTracker());
  const aiDecorationRef = useRef(
    createAIDecoration(
      decoratePuzzle,
      (state) => {
        setNarrative(state.narrative);
        setAiLoading(state.loading);
        setAiError(state.error);
      },
      (usage) => {
        setCurrentAIUsage(usage);
        usageTracker.current.record(usage);
      },
    ),
  );

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setError(null);
    setCurrentAIUsage(null);

    try {
      const rngSeed = settings.rngSeed ? Number(settings.rngSeed) : undefined;

      const result = generatePuzzle({
        seed: {
          difficulty: settings.difficulty,
          environment: settings.environment || undefined,
          archetypeId: settings.archetypeFilter || undefined,
          requiredTags: parseTags(settings.requiredTags) || undefined,
          excludedTags: parseTags(settings.excludedTags) || undefined,
        },
        rngSeed: rngSeed,
      });

      setPuzzle(result);
      setScore(scorePuzzle(result));
      const prompt = exportPrompt(result);
      setPromptText(prompt);

      // Auto-decorate when AI is enabled (S17)
      if (settings.aiEnabled) {
        aiDecorationRef.current.decorate(prompt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setPuzzle(null);
      setScore(null);
      setPromptText("");
    } finally {
      setGenerating(false);
    }
  }, [settings]);

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>RPG Puzzle Generator</h1>
      </header>

      {error && (
        <div style={{
          padding: "0.75rem 2rem",
          background: "rgba(248, 113, 113, 0.12)",
          color: "var(--error)",
          fontSize: "0.85rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}>
          {error}
        </div>
      )}

      <div className="app-layout">
        <ControlsPanel
          settings={settings}
          onUpdate={updateSetting}
          onGenerate={handleGenerate}
          onReset={resetSettings}
          generating={generating}
        />
        <main className="puzzle-column">
          {settings.aiEnabled && (narrative || aiLoading || aiError) && (
            <NarrativeDisplay
              narrative={narrative}
              loading={aiLoading}
              error={aiError}
            />
          )}
          {puzzle && (narrative || aiLoading) ? (
            <MechanicalDetails
              puzzle={puzzle}
              hasNarrative={narrative !== null}
            />
          ) : (
            <PuzzleDisplay puzzle={puzzle} promptText={promptText} />
          )}
        </main>
        <DiagnosticsPanel
          puzzle={puzzle}
          score={score}
          currentAIUsage={currentAIUsage}
          usageSummary={usageTracker.current.getSummary()}
        />
      </div>
    </div>
  );
}
