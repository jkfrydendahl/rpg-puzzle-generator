/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NarrativeDisplay } from "../components/puzzle/NarrativeDisplay.js";

describe("NarrativeDisplay", () => {
  it("renders narrative text with copy button (S19)", () => {
    render(
      <NarrativeDisplay
        narrative="The dungeon trembles as you approach."
        loading={false}
        error={null}
      />,
    );

    expect(screen.getByText(/The dungeon trembles/)).toBeDefined();
    expect(screen.getByRole("button", { name: /copy/i })).toBeDefined();
  });

  it("shows loading spinner while decorating (S20)", () => {
    render(
      <NarrativeDisplay narrative={null} loading={true} error={null} />,
    );

    expect(screen.getByText(/Decorating with AI/)).toBeDefined();
  });

  it("shows error message on failure (S21)", () => {
    render(
      <NarrativeDisplay
        narrative={null}
        loading={false}
        error="API rate limit exceeded"
      />,
    );

    expect(screen.getByText(/API rate limit exceeded/)).toBeDefined();
  });
});
