import type { AIDecorateResponse } from "../types/ai.js";
import type { AIUsage } from "../types/ai.js";

export type AIDecorationState = {
  narrative: string | null;
  loading: boolean;
  error: string | null;
};

type FetchFn = (prompt: string) => Promise<AIDecorateResponse>;

export function createAIDecoration(
  fetchFn: FetchFn,
  onStateChange: (state: AIDecorationState) => void,
  onUsage?: (usage: AIUsage) => void,
) {
  let currentRequestId = 0;

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
    const requestId = ++currentRequestId;
    setState({ narrative: null, loading: true, error: null });

    try {
      const response = await fetchFn(prompt);
      // Only apply if this is still the latest request
      if (requestId === currentRequestId) {
        setState({ narrative: response.narrative, loading: false });
        onUsage?.(response.usage);
      }
    } catch (err: unknown) {
      if (requestId === currentRequestId) {
        const msg = err instanceof Error ? err.message : String(err);
        setState({ loading: false, error: msg });
      }
    }
  }

  function clearNarrative(): void {
    setState({ narrative: null, loading: false, error: null });
  }

  return { decorate, clearNarrative };
}
