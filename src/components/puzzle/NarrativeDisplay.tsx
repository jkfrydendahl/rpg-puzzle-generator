import { useState, useMemo } from "react";

type Props = {
  narrative: string | null;
  loading: boolean;
  error: string | null;
};

/** Parse AI markdown into simple block elements for safe rendering. */
function parseNarrativeBlocks(text: string): { type: "heading" | "paragraph"; content: string }[] {
  const blocks: { type: "heading" | "paragraph"; content: string }[] = [];
  for (const raw of text.split(/\n{2,}/)) {
    const line = raw.trim();
    if (!line) continue;
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/m);
    if (headingMatch) {
      blocks.push({ type: "heading", content: headingMatch[1] });
    } else {
      // Collapse single newlines within a paragraph and strip bold markers
      const cleaned = line.replace(/\n/g, " ").replace(/\*\*(.+?)\*\*/g, "$1");
      blocks.push({ type: "paragraph", content: cleaned });
    }
  }
  return blocks;
}

export function NarrativeDisplay({ narrative, loading, error }: Props) {
  const [copied, setCopied] = useState(false);
  const blocks = useMemo(() => narrative ? parseNarrativeBlocks(narrative) : [], [narrative]);

  if (loading) {
    return (
      <div className="narrative-display loading">
        <div className="narrative-spinner" />
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

  // SAFETY: narrative is AI-generated external content.
  // Always render as text content (React auto-escapes).
  // Never use dangerouslySetInnerHTML or a Markdown/HTML renderer here.
  function handleCopy() {
    navigator.clipboard.writeText(narrative!).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => { /* clipboard denied — ignore gracefully */ },
    );
  }

  return (
    <div className="narrative-display">
      <div className="narrative-header">
        <h3>AI Narrative</h3>
        <button className="copy-button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="narrative-text">
        {blocks.map((block, i) =>
          block.type === "heading" ? (
            <h4 key={i} className="narrative-heading">{block.content}</h4>
          ) : (
            <p key={i}>{block.content}</p>
          ),
        )}
      </div>
    </div>
  );
}
