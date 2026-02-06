"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PlayArrow as PlayIcon, Fullscreen as FullscreenIcon } from "@mui/icons-material";
import type { DocTocItem, DocBlock } from "@/lib/coroutinesBasicsDoc";
import playStyles from "@/app/[locale]/developer-section/challenges/[slug]/ChallengePlay.module.css";

const KOTLIN_KEYWORDS = new Set([
  "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
  "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
  "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
  "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
  "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
  "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
  "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while",
]);
const KOTLIN_TYPES = new Set([
  "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing",
]);

type KotlinToken = { type: "keyword" | "type" | "string" | "comment" | "number" | "ident"; value: string };

function tokenizeKotlinCode(code: string): KotlinToken[] {
  const tokens: KotlinToken[] = [];
  let i = 0;
  const n = code.length;
  while (i < n) {
    if (code[i] === '"') {
      let j = i + 1;
      while (j < n && code[j] !== '"') {
        if (code[j] === "\\") j += 2;
        else j++;
      }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (code[i] === "'") {
      let j = i + 1;
      while (j < n && code[j] !== "'") {
        if (code[j] === "\\") j += 2;
        else j++;
      }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n - 1 && (code[j] !== "*" || code[j + 1] !== "/")) j++;
      if (j < n - 1) j += 2;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j;
      continue;
    }
    const numMatch = code.slice(i).match(/^(0[xX][0-9a-fA-F]+[Ll]?|\d+\.\d+([eE][-+]?\d+)?[fFdD]?|\d+[lL]?|\d+)/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }
    const idMatch = code.slice(i).match(/^([a-zA-Z_$][\w$]*)/);
    if (idMatch) {
      const word = idMatch[1];
      const type = KOTLIN_KEYWORDS.has(word) ? "keyword" : KOTLIN_TYPES.has(word) ? "type" : "ident";
      tokens.push({ type, value: word });
      i += word.length;
      continue;
    }
    tokens.push({ type: "ident", value: code[i] });
    i++;
  }
  return tokens;
}

function highlightKotlinCode(
  code: string,
  classes: { kw: string; str: string; com: string; num: string; type: string; ident: string }
): React.ReactNode[] {
  const tokens = tokenizeKotlinCode(code);
  const keyByType: Record<KotlinToken["type"], string> = {
    keyword: classes.kw,
    type: classes.type,
    string: classes.str,
    comment: classes.com,
    number: classes.num,
    ident: classes.ident,
  };
  return tokens.map((t, i) => (
    <span key={i} className={keyByType[t.type]}>
      {t.value}
    </span>
  ));
}

/** Highlight inline code/terms in doc paragraphs (suspend, main(), CoroutineScope.launch(), etc.) */
function highlightDocText(text: string, codeClass: string): React.ReactNode[] {
  const terms = [
    "CoroutineScope.launch()",
    "CoroutineScope.async()",
    "this.launch",
    "runBlocking()",
    "withContext()",
    "coroutineScope()",
    "Dispatchers.Default",
    "Dispatchers.IO",
    "Dispatchers.Main",
    "main()",
    "suspend",
    "kotlinx.coroutines",
    "this",
    "CoroutineScope",
    "launch",
    "Extract coroutine builders from the coroutine scope",
    "Function literals with receiver",
    "delay()",
    "-Dkotlinx.coroutines.debug",
    "Debugging coroutines",
    "loadContributorsBlocking()",
    "loadContributorsBackground()",
    "updateResults()",
    "SwingUtilities.invokeLater",
    "Call.enqueue()",
    "getOrgReposCall()",
    "getRepoContributorsCall()",
    "bodyList()",
    "aggregate()",
    "User.contributions",
    "BLOCKING",
    "BACKGROUND",
    "SUSPEND",
    "setDefaultFontSize(18f)",
    "src/contributors/main.kt",
    "src/tasks/Request1Blocking.kt",
    "src/tasks/Aggregation.kt",
    "src/contributors/Contributors.kt",
    "src/tasks/Request2Background.kt",
    "src/tasks/Request3Callbacks.kt",
    "List<User>.aggregate()",
    "test/tasks/AggregationKtTest.kt",
    "loadContributorsCallbacks()",
    "Call<List<Repo>>",
    "Retrofit",
  ];
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(<code key={key++} className={codeClass}>{m[0]}</code>);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : [text];
}

type KotlinDocLessonLayoutProps = {
  toc: DocTocItem[];
  blocks: DocBlock[];
  runSnippet: (index: number, code: string) => void;
  snippetOutputs: Record<number, { output?: string; error?: string; running?: boolean }>;
  createLocalizedPath: (path: string) => string;
  contentFontSize?: number;
};

export default function KotlinDocLessonLayout({
  toc,
  blocks,
  runSnippet,
  snippetOutputs,
  createLocalizedPath,
  contentFontSize = 16,
}: KotlinDocLessonLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(toc[0]?.id ?? "");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<{ index: number; code: string } | null>(null);
  const [expandedCodeFontSize, setExpandedCodeFontSize] = useState(16);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-section-id");
          if (id) setActiveSectionId(id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    const timer = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((el) => {
        if (el) observer.observe(el);
      });
    }, 0);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const setSectionRef = useCallback((id: string, el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  let codeBlockIndex = 0;

  return (
    <div className={playStyles.docLayoutWrap} style={{ fontSize: contentFontSize }}>
      <div className={playStyles.docLayoutGrid}>
        <div ref={contentRef} className={playStyles.docContent}>
          {blocks.map((block, i) => {
            if (block.type === "heading") {
              const Tag = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
              const headingClass =
                block.level === 1 ? playStyles.docH1 : block.level === 2 ? playStyles.docH2 : playStyles.docH3;
              return (
                <Tag
                  key={i}
                  id={block.id}
                  className={headingClass}
                  ref={block.level !== 1 ? (el) => setSectionRef(block.id, el) : undefined}
                  data-section-id={block.level !== 1 ? block.id : undefined}
                >
                  {block.text}
                </Tag>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p key={i} className={playStyles.docParagraph}>
                  {highlightDocText(block.text, playStyles.inlineCode)}
                </p>
              );
            }
            if (block.type === "stepTitle") {
              return (
                <p key={i} className={playStyles.docStepTitle}>
                  {block.number}. {highlightDocText(block.text, playStyles.inlineCode)}
                </p>
              );
            }
            if (block.type === "infoBox") {
              if (block.variant === "gray") {
                return (
                  <div key={i} className={playStyles.docNoteBox}>
                    <span className={playStyles.docNoteBoxIcon} aria-hidden>📖</span>
                    <p className={playStyles.docNoteBoxText}>
                      {highlightDocText(block.content, playStyles.docNoteBoxCode)}
                    </p>
                  </div>
                );
              }
              return (
                <div key={i} className={playStyles.docInfoBox}>
                  <span className={playStyles.docInfoBoxIcon} aria-hidden>i</span>
                  <p className={playStyles.docInfoBoxText}>
                    {highlightDocText(block.content, playStyles.docInfoBoxCode)}
                  </p>
                </div>
              );
            }
            if (block.type === "code") {
              const idx = codeBlockIndex++;
              const out = snippetOutputs[idx];
              return (
                <div key={i} className={playStyles.runnableSnippet}>
                  <div className={playStyles.runnableSnippetHead}>
                    <span className={playStyles.runnableSnippetTitle}>Example</span>
                    <div className={playStyles.docCodeActions}>
                      <button
                        type="button"
                        className={playStyles.snippetRunBtn}
                        disabled={out?.running}
                        onClick={() => runSnippet(idx, block.code)}
                      >
                        <PlayIcon fontSize="small" /> {out?.running ? "Running…" : "Run"}
                      </button>
                      <button
                        type="button"
                        className={playStyles.docSnippetMaximize}
                        onClick={() => setExpandedCode({ index: idx, code: block.code })}
                        aria-label="Maximize code"
                        title="View full screen"
                      >
                        <FullscreenIcon fontSize="small" /> Maximize
                      </button>
                      <Link
                        href={createLocalizedPath("/developer-section/kotlin-playground")}
                        className={playStyles.openInPlayground}
                        style={{ marginTop: 0, marginLeft: 8 }}
                      >
                        Open in Playground →
                      </Link>
                    </div>
                  </div>
                  <pre className={playStyles.sample} style={{ margin: 0, borderRadius: 0, border: "none" }}>
                    <code className={playStyles.codeBlock}>
                      {highlightKotlinCode(block.code, {
                        kw: playStyles.ktKw,
                        str: playStyles.ktStr,
                        com: playStyles.ktCom,
                        num: playStyles.ktNum,
                        type: playStyles.ktType,
                        ident: playStyles.ktIdent,
                      })}
                    </code>
                  </pre>
                  {block.comment && (
                    <div className={playStyles.docCodeMeta}>{block.comment}</div>
                  )}
                  {(out?.output != null || out?.error != null) && (
                    <div className={`${playStyles.snippetOutput} ${out?.error ? playStyles.snippetOutputError : ""}`}>
                      {out?.error ?? out?.output ?? ""}
                    </div>
                  )}
                </div>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={i} className={playStyles.docImageFigure}>
                  <div className={playStyles.docImageWrap}>
                    <img
                      src={block.src}
                      alt={block.alt}
                      className={playStyles.docImage}
                    />
                    <button
                      type="button"
                      className={playStyles.docImageMaximize}
                      onClick={() => setLightboxImage(block.src)}
                      aria-label="Maximize image"
                      title="View full size"
                    >
                      <FullscreenIcon fontSize="small" />
                    </button>
                  </div>
                  {block.alt && (
                    <figcaption className={playStyles.docImageCaption}>{block.alt}</figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className={playStyles.docList}>
                  {block.items.map((item, j) => (
                    <li key={j}>{highlightDocText(item, playStyles.inlineCode)}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "solution") {
              const idx = codeBlockIndex++;
              const out = snippetOutputs[idx];
              const solutionId = block.id ?? `solution-task-${block.taskNumber}`;
              return (
                <details
                  key={i}
                  id={solutionId}
                  className={playStyles.docSolutionDetails}
                  ref={(el) => setSectionRef(solutionId, el)}
                  data-section-id={solutionId}
                  open={false}
                >
                  <summary className={playStyles.docSolutionSummary}>
                    Solution for task {block.taskNumber}
                  </summary>
                  <div className={playStyles.docSolutionContent}>
                    {block.paragraphs?.map((p, j) => (
                      <p key={j} className={playStyles.docParagraph}>
                        {highlightDocText(p, playStyles.inlineCode)}
                      </p>
                    ))}
                    {block.steps && block.steps.length > 0 && (
                      <ol className={playStyles.docList} style={{ listStyleType: "decimal", paddingLeft: "1.5rem" }}>
                        {block.steps.map((step, j) => (
                          <li key={j}>{highlightDocText(step, playStyles.inlineCode)}</li>
                        ))}
                      </ol>
                    )}
                    {block.code && (
                      <div className={playStyles.runnableSnippet}>
                        <pre className={playStyles.sample} style={{ margin: 0, borderRadius: 0, border: "none" }}>
                          <code className={playStyles.codeBlock}>
                            {highlightKotlinCode(block.code, {
                              kw: playStyles.ktKw,
                              str: playStyles.ktStr,
                              com: playStyles.ktCom,
                              num: playStyles.ktNum,
                              type: playStyles.ktType,
                              ident: playStyles.ktIdent,
                            })}
                          </code>
                        </pre>
                        {block.codeShowPlay && (
                          <>
                            <button
                              type="button"
                              className={playStyles.snippetRunBtn}
                              disabled={out?.running}
                              onClick={() => runSnippet(idx, block.code!)}
                            >
                              <PlayIcon fontSize="small" /> {out?.running ? "Running…" : "Run"}
                            </button>
                            {(out?.output != null || out?.error != null) && (
                              <div className={`${playStyles.snippetOutput} ${out?.error ? playStyles.snippetOutputError : ""}`}>
                                {out?.error ?? out?.output ?? ""}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {block.paragraphAfterCode && (
                      <p className={playStyles.docParagraph}>
                        {highlightDocText(block.paragraphAfterCode, playStyles.inlineCode)}
                      </p>
                    )}
                  </div>
                </details>
              );
            }
            return null;
          })}
        </div>

        <aside className={playStyles.docToc} aria-label="On this page">
          <nav className={playStyles.docTocNav}>
            {toc.map((item) => (
              <div key={item.id} className={playStyles.docTocGroup}>
                <a
                  href={`#${item.id}`}
                  className={`${playStyles.docTocLink} ${activeSectionId === item.id ? playStyles.docTocLinkActive : ""}`}
                >
                  {item.label}
                </a>
                {item.children && item.children.length > 0 && (
                  <ul className={playStyles.docTocChildren}>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          className={`${playStyles.docTocLink} ${playStyles.docTocLinkChild} ${activeSectionId === child.id ? playStyles.docTocLinkActive : ""}`}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </div>

      {lightboxImage && (
        <div
          className={playStyles.docLightboxBackdrop}
          onClick={() => setLightboxImage(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightboxImage(null)}
          role="button"
          tabIndex={0}
          aria-label="Close"
        >
          <div className={playStyles.docLightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt="Full size" className={playStyles.docLightboxImage} />
            <button
              type="button"
              className={playStyles.docLightboxClose}
              onClick={() => setLightboxImage(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {expandedCode && (
        <div
          className={playStyles.docCodeLightboxBackdrop}
          onClick={() => setExpandedCode(null)}
          onKeyDown={(e) => e.key === "Escape" && setExpandedCode(null)}
          role="button"
          tabIndex={0}
          aria-label="Close"
        >
          <div className={playStyles.docCodeLightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={playStyles.docCodeLightboxHeader}>
              <span className={playStyles.docCodeLightboxTitle}>Example</span>
              <div className={playStyles.docCodeLightboxToolbar}>
                <span className={playStyles.contentFontSizeLabel}>Code</span>
                <button
                  type="button"
                  className={playStyles.fontSizeBtn}
                  onClick={() => setExpandedCodeFontSize((s) => Math.max(12, s - 2))}
                  aria-label="Decrease font size"
                >
                  A−
                </button>
                <button
                  type="button"
                  className={playStyles.fontSizeBtn}
                  onClick={() => setExpandedCodeFontSize((s) => Math.min(24, s + 2))}
                  aria-label="Increase font size"
                >
                  A+
                </button>
                <button
                  type="button"
                  className={playStyles.snippetRunBtn}
                  disabled={snippetOutputs[expandedCode.index]?.running}
                  onClick={() => runSnippet(expandedCode.index, expandedCode.code)}
                >
                  <PlayIcon fontSize="small" /> {snippetOutputs[expandedCode.index]?.running ? "Running…" : "Run"}
                </button>
                <button
                  type="button"
                  className={playStyles.docCodeLightboxClose}
                  onClick={() => setExpandedCode(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <pre className={playStyles.docCodeLightboxPre} style={{ fontSize: expandedCodeFontSize }}>
              <code className={playStyles.codeBlock}>
                {highlightKotlinCode(expandedCode.code, {
                  kw: playStyles.ktKw,
                  str: playStyles.ktStr,
                  com: playStyles.ktCom,
                  num: playStyles.ktNum,
                  type: playStyles.ktType,
                  ident: playStyles.ktIdent,
                })}
              </code>
            </pre>
            {(snippetOutputs[expandedCode.index]?.output != null || snippetOutputs[expandedCode.index]?.error != null) && (
              <div className={`${playStyles.snippetOutput} ${snippetOutputs[expandedCode.index]?.error ? playStyles.snippetOutputError : ""} ${playStyles.docCodeLightboxOutput}`}>
                {snippetOutputs[expandedCode.index]?.error ?? snippetOutputs[expandedCode.index]?.output ?? ""}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
