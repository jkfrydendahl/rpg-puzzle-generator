import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { generateNarrative } from "../services/aiService.js";

const MAX_PROMPT_LENGTH = 8_000;

// Simple in-memory rate limiter: max requests per IP within a time window.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const hits = new Map<string, number[]>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    res.status(429).json({ error: "Too many requests. Please wait before trying again." });
    return;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  next();
}

export const decorateRoute = Router();

decorateRoute.post("/", rateLimit, async (req, res) => {
  const { prompt } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).json({ error: `prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` });
    return;
  }

  try {
    const result = await generateNarrative(prompt);
    res.json(result);
  } catch (err) {
    console.error("AI decoration error:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "AI decoration failed. Please try again later." });
  }
});
