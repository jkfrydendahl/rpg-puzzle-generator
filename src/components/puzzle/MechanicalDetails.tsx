import type { GeneratedPuzzle } from "../../types/puzzle.js";

type Props = {
  puzzle: GeneratedPuzzle;
  hasNarrative: boolean;
};

export function MechanicalDetails({ puzzle, hasNarrative }: Props) {
  if (!hasNarrative) {
    return <div className="mechanical-details">{renderContent(puzzle)}</div>;
  }

  return (
    <fieldset className="mechanical-details" role="group">
      <legend>
        <button
          className="collapse-toggle"
          type="button"
          aria-expanded="false"
          onClick={(e) => {
            const fieldset = e.currentTarget.closest("fieldset")!;
            const isOpen = fieldset.hasAttribute("open");
            if (isOpen) {
              fieldset.removeAttribute("open");
              e.currentTarget.setAttribute("aria-expanded", "false");
            } else {
              fieldset.setAttribute("open", "");
              e.currentTarget.setAttribute("aria-expanded", "true");
            }
          }}
        >
          Mechanical Details
        </button>
      </legend>
      <div className="mechanical-content">{renderContent(puzzle)}</div>
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
