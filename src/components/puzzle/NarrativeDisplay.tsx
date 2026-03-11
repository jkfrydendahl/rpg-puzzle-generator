import { useState } from "react";

type Props = {
  narrative: string | null;
  loading: boolean;
  error: string | null;
};

export function NarrativeDisplay({ narrative, loading, error }: Props) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="narrative-display loading">
        <p>Decorating with AI…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="narrative-display error">
        <p className="narrative-error">{error}</p>
      </div>
    );
  }

  if (!narrative) return null;

  function handleCopy() {
    navigator.clipboard.writeText(narrative!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="narrative-display">
      <div className="narrative-text">{narrative}</div>
      <button className="copy-button" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy Narrative"}
      </button>
    </div>
  );
}
