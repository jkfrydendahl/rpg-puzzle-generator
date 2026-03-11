/** Shared types for the AI decoration API contract. */

export type AIDecorateRequest = {
  prompt: string;
};

export type AIUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type AIDecorateResponse = {
  narrative: string;
  usage: AIUsage;
};
