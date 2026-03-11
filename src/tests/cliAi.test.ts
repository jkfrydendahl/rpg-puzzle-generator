import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

function cli(args: string[], env?: Record<string, string>) {
  return exec("npx", ["tsx", "src/cli.ts", ...args], {
    shell: true,
    timeout: 15000,
    env: { ...process.env, ...env },
  });
}

describe("CLI --ai flag", () => {
  it("recognises --ai flag and attempts AI decoration (S26)", { timeout: 15000 }, async () => {
    // Without a real API key the CLI should fail, but it must NOT fail with
    // "Unknown option: --ai" — that proves the flag is wired in.
    try {
      await cli(["--ai", "--seed", "42"], { OPENAI_API_KEY: "" });
      expect.unreachable("Expected CLI to exit with error (no API key)");
    } catch (err: any) {
      expect(err.stderr).not.toMatch(/Unknown option/i);
      expect(err.stderr).toMatch(/OPENAI_API_KEY|API key/i);
    }
  });

  it("fails gracefully when OPENAI_API_KEY missing (S27)", { timeout: 15000 }, async () => {
    try {
      await cli(["--ai"], { OPENAI_API_KEY: "" });
      expect.unreachable("Expected CLI to exit with error");
    } catch (err: any) {
      expect(err.code).not.toBe(0);
      expect(err.stderr).toMatch(/OPENAI_API_KEY|API key/i);
    }
  });

  it("works unchanged without --ai flag (S28)", { timeout: 15000 }, async () => {
    const { stdout } = await cli(["--seed", "42"]);
    expect(stdout).toMatch(/RPG PUZZLE GENERATOR/);
    expect(stdout).toMatch(/Archetype:/);
  });
});
