"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathContentProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div" | "li";
}

export function MathContent({ text, className, as: Tag = "p" }: MathContentProps) {
  const rendered = useMemo(() => parseContent(text), [text]);
  return <Tag className={className}>{rendered}</Tag>;
}

function renderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return latex;
  }
}

function parseContent(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
  const matches = Array.from(text.matchAll(pattern));
  let lastIndex = 0;
  let key = 0;

  for (const match of matches) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, index)}</span>);
    }
    const raw = match[1];
    if (raw.startsWith("$$") && raw.endsWith("$$")) {
      const html = renderKaTeX(raw.slice(2, -2), true);
      nodes.push(
        <span
          key={key++}
          className="mml-block-math"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (raw.startsWith("$") && raw.endsWith("$")) {
      const html = renderKaTeX(raw.slice(1, -1), false);
      nodes.push(
        <span
          key={key++}
          className="mml-inline-math"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (raw.startsWith("**") && raw.endsWith("**")) {
      nodes.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      nodes.push(
        <code key={key++} className="mml-inline-code">
          {raw.slice(1, -1)}
        </code>
      );
    }
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
}
