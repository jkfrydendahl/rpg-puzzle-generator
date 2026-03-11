import { Router } from "express";
import { generateNarrative } from "../services/aiService.js";

export const decorateRoute = Router();

decorateRoute.post("/", async (req, res) => {
  const { prompt } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  try {
    const result = await generateNarrative(prompt);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
