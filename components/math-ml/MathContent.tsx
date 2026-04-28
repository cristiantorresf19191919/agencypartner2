"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ConceptChip } from "./primitives/ConceptChip";
import { tryEvalLatex } from "./primitives/numericEval";
import { FormulaReveal } from "./formula-anim/FormulaReveal";
import { FormulaChain } from "./formula-anim/FormulaChain";
import { FormulaVerify } from "./formula-anim/FormulaVerify";
import {
  autoChainifyTextSegments,
  splitChainBlocks,
} from "./formula-anim/parseChainBlock";

interface MathContentProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div" | "li";
  /**
   * When `"worked"`, inline `$…=…=…$` chains are auto-promoted to animated
   * FormulaChain blocks. Used for worked-example paragraphs.
   */
  mode?: "default" | "worked";
}

export function MathContent({
  text,
  className,
  as: Tag = "p",
  mode = "default",
}: MathContentProps) {
  const segments = useMemo(() => {
    const base = splitChainBlocks(text);
    return mode === "worked" ? autoChainifyTextSegments(base) : base;
  }, [text, mode]);
  const hasBlock = segments.some(
    (s) => s.kind === "chain" || s.kind === "verify",
  );
  const Wrapper = hasBlock ? "div" : Tag;
  const nodes: React.ReactNode[] = [];
  segments.forEach((seg, i) => {
    if (seg.kind === "chain") {
      nodes.push(<FormulaChain key={`c-${i}`} spec={seg.value} />);
    } else if (seg.kind === "verify") {
      nodes.push(<FormulaVerify key={`v-${i}`} spec={seg.value} />);
    } else {
      parseContent(seg.value).forEach((n, j) =>
        nodes.push(<React.Fragment key={`t-${i}-${j}`}>{n}</React.Fragment>),
      );
    }
  });
  return <Wrapper className={className}>{nodes}</Wrapper>;
}

function formatNumeric(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const abs = Math.abs(v);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return v.toExponential(3);
  return v.toFixed(Math.min(4, Math.max(2, 4 - Math.floor(Math.log10(abs + 1e-9)))));
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
  const pattern =
    /(\[\[[^\]|]+(?:\|[^\]]+)?\]\]|\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
  const matches = Array.from(text.matchAll(pattern));
  let lastIndex = 0;
  let key = 0;

  for (const match of matches) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, index)}</span>);
    }
    const raw = match[1];
    if (raw.startsWith("[[") && raw.endsWith("]]")) {
      const inner = raw.slice(2, -2);
      const pipe = inner.indexOf("|");
      const id = pipe === -1 ? inner.trim() : inner.slice(0, pipe).trim();
      const display = pipe === -1 ? undefined : inner.slice(pipe + 1).trim();
      nodes.push(
        <ConceptChip key={key++} conceptId={id} displayText={display} />,
      );
    } else if (raw.startsWith("$$") && raw.endsWith("$$")) {
      nodes.push(
        <FormulaReveal
          key={key++}
          latex={raw.slice(2, -2)}
          displayMode
          className="mml-block-math"
        />
      );
    } else if (raw.startsWith("$") && raw.endsWith("$")) {
      const src = raw.slice(1, -1);
      const html = renderKaTeX(src, false);
      const numericValue = tryEvalLatex(src);
      const isEvaluable =
        numericValue !== null &&
        Number.isFinite(numericValue) &&
        /[+\-*/^]|\\sqrt|\\frac/.test(src);
      if (isEvaluable) {
        const formatted = formatNumeric(numericValue);
        nodes.push(
          <span
            key={key++}
            className="mml-inline-math mml-inline-math-numeric"
            title={`≈ ${formatted}`}
            data-numeric-value={formatted}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        nodes.push(
          <span
            key={key++}
            className="mml-inline-math"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
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
