import type { GeneratorSettings } from "../../hooks/useGeneratorSettings.js";
import { archetypes } from "../../data/archetypes.js";
import { environments } from "../../data/environments.js";

type Props = {
  settings: GeneratorSettings;
  onUpdate: <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => void;
  onGenerate: () => void;
  onReset: () => void;
  generating: boolean;
};

export function ControlsPanel({ settings, onUpdate, onGenerate, onReset, generating }: Props) {
  return (
    <aside className="controls-panel">
      <h2>Settings</h2>

      <label>
        Difficulty
        <select
          value={settings.difficulty}
          onChange={(e) => onUpdate("difficulty", e.target.value as GeneratorSettings["difficulty"])}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <label>
        Environment
        <select
          value={settings.environment}
          onChange={(e) => onUpdate("environment", e.target.value)}
        >
          <option value="">Any</option>
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Archetype
        <select
          value={settings.archetypeFilter}
          onChange={(e) => onUpdate("archetypeFilter", e.target.value)}
        >
          <option value="">Any</option>
          {archetypes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Required tags
        <input
          type="text"
          placeholder="e.g. ordered, arcane"
          value={settings.requiredTags}
          onChange={(e) => onUpdate("requiredTags", e.target.value)}
        />
      </label>

      <label>
        Excluded tags
        <input
          type="text"
          placeholder="e.g. dark, timed"
          value={settings.excludedTags}
          onChange={(e) => onUpdate("excludedTags", e.target.value)}
        />
      </label>

      <label>
        RNG Seed
        <input
          type="number"
          placeholder="Random"
          value={settings.rngSeed}
          onChange={(e) => onUpdate("rngSeed", e.target.value)}
        />
      </label>

      <label className="toggle-label">
        <input
          type="checkbox"
          checked={settings.aiEnabled}
          onChange={(e) => onUpdate("aiEnabled", e.target.checked)}
        />
        AI Narrative Decoration
      </label>

      <button className="generate-button" onClick={onGenerate} disabled={generating}>
        {generating ? "Generating…" : "Generate Puzzle"}
      </button>

      <button
        className="copy-button"
        onClick={onReset}
        style={{ marginTop: "0.25rem" }}
      >
        Reset Settings
      </button>
    </aside>
  );
}
