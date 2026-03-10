import { useState, useCallback } from "react";
import type { PuzzleDifficulty } from "../types/puzzle.js";

export type GeneratorSettings = {
  difficulty: PuzzleDifficulty;
  environment: string;
  archetypeFilter: string;
  requiredTags: string;
  excludedTags: string;
  rngSeed: string;
};

const STORAGE_KEY = "rpg-puzzle-settings";

const defaultSettings: GeneratorSettings = {
  difficulty: "medium",
  environment: "",
  archetypeFilter: "",
  requiredTags: "",
  excludedTags: "",
  rngSeed: "",
};

function loadSettings(): GeneratorSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch { /* ignore corrupt data */ }
  return { ...defaultSettings };
}

function saveSettings(settings: GeneratorSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useGeneratorSettings() {
  const [settings, setSettings] = useState<GeneratorSettings>(loadSettings);

  const updateSetting = useCallback(
    <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        saveSettings(next);
        return next;
      });
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings });
    saveSettings(defaultSettings);
  }, []);

  return { settings, updateSetting, resetSettings };
}
