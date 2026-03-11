/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MechanicalDetails } from "../components/puzzle/MechanicalDetails.js";

const minimalPuzzle = {
  archetype: "Lock Puzzle",
  difficulty: "medium" as const,
  tags: ["ordered"],
  interface: { primary: ["levers"], secondary: [] },
  solution: {
    objective: "Pull levers in order",
    steps: ["Pull A", "Pull B"],
    finalState: "Door opens",
    internalLogic: "Sequence lock",
  },
  clues: [],
  consequence: { type: "timer", severity: "medium" as const, behavior: "Room floods" },
  feedback: { successSignals: ["click"], failureSignals: ["buzz"], partialProgressSignals: ["half-click"] },
  hints: ["Try A first"],
  gmNotes: { pacingAdvice: "Let them think", likelyMisreads: [], bypassIdeas: [] },
  validation: { isSolvable: true, clueCoverage: 1, contradictionWarnings: [], softWarnings: [] },
  id: "test-1",
};

describe("MechanicalDetails", () => {
  afterEach(cleanup);

  it("collapsed by default when narrative present (S22)", () => {
    render(
      <MechanicalDetails puzzle={minimalPuzzle as any} hasNarrative={true} />,
    );

    const details = screen.getByRole("group");
    // When collapsed, the solution details should not be visible
    expect(details.getAttribute("open")).toBeNull();
  });

  it("expanded when no narrative (S23)", () => {
    render(
      <MechanicalDetails puzzle={minimalPuzzle as any} hasNarrative={false} />,
    );

    // Should show puzzle content directly
    expect(screen.getByText(/Pull levers in order/)).toBeDefined();
  });
});
