import { useState } from "react";
import type { GeneratedPuzzle } from "../../types/puzzle.js";

type Props = {
  puzzle: GeneratedPuzzle;
  hasNarrative: boolean;
};

export function MechanicalDetails({ puzzle, hasNarrative }: Props) {
  const [open, setOpen] = useState(false);

  if (!hasNarrative) {
    return <div className="mechanical-details">{renderContent(puzzle)}</div>;
  }

  return (
    <fieldset className="mechanical-details" role="group" {...(open ? { open: "" } : {})}>
      <legend>
        <button
          className="collapse-toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          Mechanical Details
        </button>
      </legend>
      {open && <div className="mechanical-content">{renderContent(puzzle)}</div>}
    </fieldset>
  );
}

function renderContent(puzzle: GeneratedPuzzle) {
  return (
    <>
      <p>
        <strong>Objective:</strong> {puzzle.solution.objective}
      </p>
      <ol>
        {puzzle.solution.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p>
        <strong>Final State:</strong> {puzzle.solution.finalState}
      </p>
    </>
  );
}
