/** Server configuration — reads and validates environment variables. */

export function getConfig() {
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const port = parseInt(process.env.PORT ?? "3001", 10);

  return { apiKey, model, port };
}
