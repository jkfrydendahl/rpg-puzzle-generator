import { useState, useMemo } from "react";

type Props = {
  narrative: string | null;
  loading: boolean;
  error: string | null;
};

/** Parse AI markdown into simple block elements for safe rendering. */
function parseNarrativeBlocks(text: string): { type: "heading" | "paragraph" | "ordered-list"; content: string; items?: string[] }[] {
  const blocks: { type: "heading" | "paragraph" | "ordered-list"; content: string; items?: string[] }[] = [];
  for (const raw of text.split(/\n{2,}/)) {
    const line = raw.trim();
    if (!line) continue;
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/m);
    if (headingMatch) {
      blocks.push({ type: "heading", content: headingMatch[1] });
    } else if (/^\d+\.\s/.test(line)) {
      // Ordered list: split on line-initial numbers
      const items = line.split(/\n/).map((l) => l.replace(/^\d+\.\s*/, "").replace(/\*\*(.+?)\*\*/g, "$1").trim()).filter(Boolean);
      blocks.push({ type: "ordered-list", content: "", items });
    } else {
      // Collapse single newlines within a paragraph and strip bold markers
      const cleaned = line.replace(/\n/g, " ").replace(/\*\*(.+?)\*\*/g, "$1");
      blocks.push({ type: "paragraph", content: cleaned });
    }
  }
  return blocks;
}

export function NarrativeDisplay({ narrative, loading, error }: Props) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const blocks = useMemo(() => narrative ? parseNarrativeBlocks(narrative) : [], [narrative]);

  const statusLabel = loading ? " — generating…" : error ? " — error" : "";

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
    <div className="section-collapsible">
      <div className="section-toggle-row">
        <button
          className="mechanical-toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="mechanical-toggle-icon">{open ? "▾" : "▸"}</span>
          AI Narrative{statusLabel}
        </button>
        {narrative && (
          <button className="copy-button section-copy" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      {open && (
        <div className="section-collapsible-content">
          {loading && (
            <div className="narrative-display loading">
              <div className="narrative-spinner" />
              <p>Decorating with AI…</p>
            </div>
          )}
          {error && (
            <div className="narrative-display error">
              <p className="narrative-error">{error}</p>
            </div>
          )}
          {narrative && (
            <div className="narrative-text">
              {blocks.map((block, i) =>
                block.type === "heading" ? (
                  <h4 key={i} className="narrative-heading">{block.content}</h4>
                ) : block.type === "ordered-list" ? (
                  <ol key={i}>
                    {block.items!.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p key={i}>{block.content}</p>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
