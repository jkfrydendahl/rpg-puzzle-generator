import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock aiService before importing the route
vi.mock("../services/aiService.js", () => ({
  generateNarrative: vi.fn(),
}));

import express from "express";
import { decorateRoute } from "../routes/decorate.js";
import { generateNarrative } from "../services/aiService.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/decorate", decorateRoute);
  return app;
}

describe("POST /api/decorate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns narrative + usage for a valid prompt (S1)", async () => {
    const mock = vi.mocked(generateNarrative);
    mock.mockResolvedValueOnce({
      narrative: "The chamber glows with ancient runes...",
      usage: { promptTokens: 80, completionTokens: 40, totalTokens: 120 },
    });

    const app = buildApp();
    const res = await makeRequest(app, { prompt: "Decorate this puzzle" });

    expect(res.status).toBe(200);
    expect(res.body.narrative).toBe("The chamber glows with ancient runes...");
    expect(res.body.usage).toEqual({
      promptTokens: 80,
      completionTokens: 40,
      totalTokens: 120,
    });
    expect(mock).toHaveBeenCalledWith("Decorate this puzzle");
  });

  it("rejects empty prompt with 400 (S2)", async () => {
    const app = buildApp();

    const res1 = await makeRequest(app, {});
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBeTruthy();

    const res2 = await makeRequest(app, { prompt: "" });
    expect(res2.status).toBe(400);
    expect(res2.body.error).toBeTruthy();
  });

  it("returns 500 when aiService throws (S3)", async () => {
    const mock = vi.mocked(generateNarrative);
    mock.mockRejectedValueOnce(new Error("AI decoration failed: key not set"));

    const app = buildApp();
    const res = await makeRequest(app, { prompt: "valid prompt" });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/AI decoration failed/);
  });
});

/** Lightweight test helper — uses Node's built-in fetch against a temp server. */
async function makeRequest(
  app: express.Express,
  body: Record<string, unknown>,
): Promise<{ status: number; body: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      try {
        const addr = server.address();
        if (!addr || typeof addr === "string") throw new Error("bad address");
        const url = `http://127.0.0.1:${addr.port}/api/decorate`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        resolve({ status: res.status, body: json as Record<string, unknown> });
      } catch (err) {
        reject(err);
      } finally {
        server.close();
      }
    });
  });
}
