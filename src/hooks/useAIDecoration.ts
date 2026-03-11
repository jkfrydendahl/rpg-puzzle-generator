import type { AIDecorateResponse, AIUsage } from "../types/ai.js";

export type AIDecorationState = {
  narrative: string | null;
  loading: boolean;
  error: string | null;
};

type FetchFn = (prompt: string, signal?: AbortSignal) => Promise<AIDecorateResponse>;

export function createAIDecoration(
  fetchFn: FetchFn,
  onStateChange: (state: AIDecorationState) => void,
  onUsage?: (usage: AIUsage, model: string) => void,
) {
  let currentRequestId = 0;
  let abortController: AbortController | null = null;

  function setState(patch: Partial<AIDecorationState>) {
    state = { ...state, ...patch };
    onStateChange(state);
  }

  let state: AIDecorationState = {
    narrative: null,
    loading: false,
    error: null,
  };

  async function decorate(prompt: string): Promise<void> {
    abortController?.abort();
    abortController = new AbortController();
    const signal = abortController.signal;
    const requestId = ++currentRequestId;
    setState({ narrative: null, loading: true, error: null });

    try {
      const response = await fetchFn(prompt, signal);
      // Only apply if this is still the latest request
      if (requestId === currentRequestId) {
        setState({ narrative: response.narrative, loading: false });
        onUsage?.(response.usage, response.model);
      }
    } catch (err: unknown) {
      if (requestId === currentRequestId) {
        // Silently ignore aborted requests
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        setState({ loading: false, error: msg });
      }
    }
  }

  function clearNarrative(): void {
    abortController?.abort();
    setState({ narrative: null, loading: false, error: null });
  }

  return { decorate, clearNarrative };
}
