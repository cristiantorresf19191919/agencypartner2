"use client";

import React from "react";
import { Highlight, themes } from "prism-react-renderer";

/**
 * Lightweight syntax-highlighted <pre> block powered by prism-react-renderer.
 * Drop-in replacement for `<pre className={playStyles.sample}><code>{code}</code></pre>`.
 *
 * Usage:
 *   <HighlightedCode code={someCode} language="tsx" className={playStyles.sample} />
 */

interface HighlightedCodeProps {
  code: string;
  language?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Map common language aliases to Prism grammar names. */
function normalizeLang(lang: string): string {
  const l = lang.toLowerCase();
  if (l === "react") return "tsx";
  if (l === "kt") return "kotlin";
  if (l === "js") return "javascript";
  if (l === "ts") return "typescript";
  return l;
}

export function HighlightedCode({
  code,
  language = "tsx",
  className = "",
  style,
}: HighlightedCodeProps) {
  const lang = normalizeLang(language);

  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={lang}>
      {({ className: prismClass, style: prismStyle, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} ${prismClass}`.trim()}
          style={{ ...prismStyle, margin: 0, ...style }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
