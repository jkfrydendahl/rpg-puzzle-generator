import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("server config", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // getConfig reads process.env on each call — no cache clearing needed
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses model from OPENAI_MODEL env var (S4)", async () => {
    process.env.OPENAI_MODEL = "gpt-4o";

    // Dynamic import to pick up fresh env
    const { getConfig } = await import("../config.js");
    const config = getConfig();

    expect(config.model).toBe("gpt-4o");
  });

  it("defaults model to gpt-4o-mini when env not set (S5)", async () => {
    delete process.env.OPENAI_MODEL;

    const { getConfig } = await import("../config.js");
    const config = getConfig();

    expect(config.model).toBe("gpt-4o-mini");
  });

  it("reads OPENAI_API_KEY from env", async () => {
    process.env.OPENAI_API_KEY = "test-key-123";

    const { getConfig } = await import("../config.js");
    const config = getConfig();

    expect(config.apiKey).toBe("test-key-123");
  });

  it("defaults port to 3001", async () => {
    delete process.env.PORT;

    const { getConfig } = await import("../config.js");
    const config = getConfig();

    expect(config.port).toBe(3001);
  });
});
