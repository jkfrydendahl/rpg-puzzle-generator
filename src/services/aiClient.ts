import type { AIDecorateResponse } from "../types/ai.js";

export async function decoratePuzzle(prompt: string): Promise<AIDecorateResponse> {
  const res = await fetch("/api/decorate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((body as { error?: string }).error ?? "AI decoration failed");
  }

  return res.json() as Promise<AIDecorateResponse>;
}
