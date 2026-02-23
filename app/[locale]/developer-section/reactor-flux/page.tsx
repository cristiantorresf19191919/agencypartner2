"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  Fullscreen as FullscreenIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { CodeEditor } from "@/components/ui";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperSectionFont } from "@/contexts/DeveloperSectionFontContext";
import {
  REACTOR_FLUX_TOC,
  REACTOR_FLUX_BLOCKS,
  type ReactorTocItem,
  type ReactorBlock,
} from "@/lib/reactorFluxData";
import { MarbleDiagram } from "@/components/ReactorFlux/MarbleDiagram";
import styles from "./ReactorFlux.module.css";

const PISTON_EXECUTE_URL = "/api/execute-code";

// ─── Kotlin syntax highlighting ─────────────────────────────────────────────────

const KOTLIN_KEYWORDS = new Set([
  "abstract","actual","annotation","as","break","by","catch","class","companion",
  "const","constructor","continue","crossinline","data","do","dynamic","else","enum",
  "expect","external","final","finally","for","fun","get","if","import","in",
  "infix","init","inline","inner","interface","internal","is","lateinit","noinline",
  "null","object","open","operator","out","override","package","private","protected",
  "public","reified","return","sealed","set","super","suspend","tailrec","this",
  "throw","try","typealias","typeof","val","var","vararg","when","where","while",
]);

const KOTLIN_TYPES = new Set([
  "Boolean","Byte","Char","Double","Float","Int","Long","Short","String","Unit","Any","Nothing",
  "Flux","Mono","Publisher","Scheduler","Schedulers","Duration","Retry","Signal","SignalType",
  "Tuple2","Tuple3","Tuple4","ConnectableFlux","ParallelFlux","GroupedFlux","FluxSink",
  "SynchronousSink","BufferOverflowStrategy","Timed","Disposable","CoreSubscriber","Subscription",
]);

type KotlinToken = { type: "keyword" | "type" | "string" | "comment" | "number" | "ident"; value: string };

function tokenizeKotlinCode(code: string): KotlinToken[] {
  const tokens: KotlinToken[] = [];
  let i = 0;
  const n = code.length;
  while (i < n) {
    if (code[i] === '"') {
      let j = i + 1;
      while (j < n && code[j] !== '"') { if (code[j] === "\\") j += 2; else j++; }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j; continue;
    }
    if (code[i] === "'" ) {
      let j = i + 1;
      while (j < n && code[j] !== "'") { if (code[j] === "\\") j += 2; else j++; }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j; continue;
    }
    if (code[i] === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j; continue;
    }
    if (code[i] === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n - 1 && (code[j] !== "*" || code[j + 1] !== "/")) j++;
      if (j < n - 1) j += 2;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j; continue;
    }
    const numMatch = code.slice(i).match(/^(0[xX][0-9a-fA-F]+[Ll]?|\d+\.\d+([eE][-+]?\d+)?[fFdD]?|\d+[lL]?)/);
    if (numMatch) { tokens.push({ type: "number", value: numMatch[0] }); i += numMatch[0].length; continue; }
    const idMatch = code.slice(i).match(/^([a-zA-Z_$][\w$]*)/);
    if (idMatch) {
      const word = idMatch[1];
      const type = KOTLIN_KEYWORDS.has(word) ? "keyword" : KOTLIN_TYPES.has(word) ? "type" : "ident";
      tokens.push({ type, value: word }); i += word.length; continue;
    }
    tokens.push({ type: "ident", value: code[i] }); i++;
  }
  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const tokens = tokenizeKotlinCode(code);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={styles[`kt${t.type.charAt(0).toUpperCase() + t.type.slice(1)}`]}>
          {t.value}
        </span>
      ))}
    </>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────

export default function ReactorFluxPage() {
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const { contentFontSize } = useDeveloperSectionFont();

  const [activeSectionId, setActiveSectionId] = useState(REACTOR_FLUX_TOC[0]?.id ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileFabVisible, setMobileFabVisible] = useState(true);
  const [expandedTocIds, setExpandedTocIds] = useState<Set<string>>(() =>
    new Set(REACTOR_FLUX_TOC.filter((item) => item.children?.length).map((item) => item.id))
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<{ index: number; code: string } | null>(null);
  const [snippetOutputs, setSnippetOutputs] = useState<Record<number, { output?: string; error?: string; running?: boolean }>>({});
  const [failedImageIndices, setFailedImageIndices] = useState<Set<number>>(new Set());

  const contentRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedSet = useRef<Set<HTMLElement>>(new Set());
  const lastScrollY = useRef(0);

  // Scroll spy – observe headings as they mount via ref callback
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading to make scroll-spy robust
        let topId: string | null = null;
        let topY = Infinity;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-section-id");
          if (id && entry.boundingClientRect.top < topY) {
            topY = entry.boundingClientRect.top;
            topId = id;
          }
        }
        if (topId) setActiveSectionId(topId);
      },
      { rootMargin: "-60px 0px -65% 0px", threshold: 0 }
    );
    observerRef.current = observer;
    return () => { observer.disconnect(); };
  }, []);

  const setSectionRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el && observerRef.current && !observedSet.current.has(el)) {
      observedSet.current.add(el);
      observerRef.current.observe(el);
    }
  }, []);

  // Run Kotlin code via Piston API
  const runSnippet = useCallback(async (index: number, code: string) => {
    setSnippetOutputs((p) => ({ ...p, [index]: { running: true } }));
    try {
      const resp = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "kotlin", version: "*", files: [{ content: code }] }),
      });
      const data = await resp.json();
      const output = data.run?.output?.trim() ?? "";
      const stderr = data.run?.stderr?.trim() ?? "";
      setSnippetOutputs((p) => ({
        ...p,
        [index]: { output: output || undefined, error: stderr || undefined },
      }));
    } catch (err: unknown) {
      setSnippetOutputs((p) => ({
        ...p,
        [index]: { error: err instanceof Error ? err.message : "Failed to run" },
      }));
    }
  }, []);

  // Close mobile sidebar on navigation
  const handleTocClick = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const toggleTocCategory = useCallback((id: string) => {
    setExpandedTocIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Hide global FABs when reactor-flux drawer is open so focus is on navigation
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.setAttribute("data-reactor-drawer-open", "true");
    } else {
      document.body.removeAttribute("data-reactor-drawer-open");
    }
    return () => document.body.removeAttribute("data-reactor-drawer-open");
  }, [mobileSidebarOpen]);

  // Hide mobile sidebar FAB on scroll down, show on scroll up (reading-mode pattern)
  useEffect(() => {
    const threshold = 60;
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y < 80) {
        setMobileFabVisible(true);
      } else if (y > lastScrollY.current + threshold) {
        setMobileFabVisible(false);
      } else if (y < lastScrollY.current - threshold) {
        setMobileFabVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let codeBlockIndex = 0;

  return (
    <>
      <DeveloperHeader
        pageTitle="Reactor Flux"
        onOpenDrawer={() => setMobileSidebarOpen(true)}
        drawerOpen={mobileSidebarOpen}
      />

      <div className={styles.pageWrap}>
        {/* Mobile sidebar toggle (hides on scroll down, reappears on scroll up) */}
        <button
          className={`${styles.mobileSidebarToggle} ${!mobileFabVisible ? styles.mobileSidebarToggleHidden : ""}`}
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {mobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Sidebar backdrop for mobile */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              className={styles.sidebarBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarMobileOpen : ""} ${!sidebarOpen ? styles.sidebarCollapsed : ""}`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>
              <span className={styles.sidebarIcon}>⚛</span>
              <span>Reactor Flux</span>
            </div>
            <button
              className={styles.sidebarCollapseBtn}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronRightIcon
                className={`${styles.collapseChevron} ${sidebarOpen ? styles.collapseChevronOpen : ""}`}
              />
            </button>
          </div>

          <nav className={styles.sidebarNav}>
            {REACTOR_FLUX_TOC.map((item) => (
              <div key={item.id} className={styles.tocGroup}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      className={styles.tocCategoryBtn}
                      onClick={() => toggleTocCategory(item.id)}
                      aria-expanded={expandedTocIds.has(item.id)}
                      aria-controls={`toc-${item.id}`}
                    >
                      <span>{item.label}</span>
                      <ExpandMoreIcon
                        className={`${styles.tocCategoryChevron} ${expandedTocIds.has(item.id) ? styles.tocCategoryChevronOpen : ""}`}
                        fontSize="small"
                      />
                    </button>
                    <ul
                      id={`toc-${item.id}`}
                      className={`${styles.tocChildren} ${!expandedTocIds.has(item.id) ? styles.tocChildrenCollapsed : ""}`}
                      role="region"
                      aria-label={`${item.label} sections`}
                    >
                      {item.children.map((child) => (
                        <li key={child.id} className={styles.tocChildItem}>
                          <a
                            href={`#${child.id}`}
                            className={`${styles.tocLinkChild} ${activeSectionId === child.id ? styles.tocLinkActive : ""}`}
                            onClick={handleTocClick}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a
                    href={`#${item.id}`}
                    className={`${styles.tocLink} ${activeSectionId === item.id ? styles.tocLinkActive : ""}`}
                    onClick={handleTocClick}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <Link
              href={createLocalizedPath("/developer-section/kotlin-playground")}
              className={styles.playgroundLink}
            >
              Open Kotlin Playground →
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main
          ref={contentRef}
          className={`${styles.mainContent} ${!sidebarOpen ? styles.mainContentExpanded : ""}`}
          style={{ fontSize: contentFontSize }}
        >
          <div className={styles.breadcrumb}>
            <Link href={createLocalizedPath("/developer-section")} className={styles.breadcrumbLink}>
              Developer Hub
            </Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Reactor Flux</span>
          </div>

          {REACTOR_FLUX_BLOCKS.map((block, i) => {
            if (block.type === "heading") {
              const Tag = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
              return (
                <Tag
                  key={i}
                  id={block.id}
                  className={styles[`h${block.level}`]}
                  ref={(el) => setSectionRef(block.id, el)}
                  data-section-id={block.id}
                >
                  {block.text}
                </Tag>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p key={i} className={styles.paragraph}>
                  {block.text}
                </p>
              );
            }

            if (block.type === "infoBox") {
              const isGray = block.variant === "gray";
              return (
                <div key={i} className={isGray ? styles.noteBox : styles.infoBox}>
                  <span className={isGray ? styles.noteBoxIcon : styles.infoBoxIcon} aria-hidden>
                    {isGray ? "📖" : "💡"}
                  </span>
                  <p className={isGray ? styles.noteBoxText : styles.infoBoxText}>
                    {block.content}
                  </p>
                </div>
              );
            }

            if (block.type === "image") {
              const imageFailed = failedImageIndices.has(i);
              const diagramName = block.src.replace(/^.*\/([^/]+)\.(svg|png|jpg)$/i, "$1");
              if (imageFailed) {
                return (
                  <MarbleDiagram
                    key={i}
                    name={diagramName}
                    caption={block.alt}
                    className={styles.marbleDiagramFigure}
                  />
                );
              }
              return (
                <figure key={i} className={styles.imageFigure}>
                  <div className={styles.imageWrap}>
                    <img
                      src={block.src}
                      alt={block.alt}
                      className={styles.image}
                      onError={() => setFailedImageIndices((prev) => new Set(prev).add(i))}
                    />
                    <button
                      type="button"
                      className={styles.imageMaximize}
                      onClick={() => setLightboxImage(block.src)}
                      aria-label="View full size"
                      title="View full size"
                    >
                      <FullscreenIcon fontSize="small" />
                    </button>
                  </div>
                  {block.alt && (
                    <figcaption className={styles.imageCaption}>{block.alt}</figcaption>
                  )}
                </figure>
              );
            }

            if (block.type === "code") {
              const idx = codeBlockIndex++;
              const out = snippetOutputs[idx];
              return (
                <div key={i} className={styles.codeSnippet}>
                  <div className={styles.codeSnippetHead}>
                    <span className={styles.codeSnippetTitle}>Kotlin</span>
                    <div className={styles.codeActions}>
                      <button
                        type="button"
                        className={styles.runBtn}
                        disabled={out?.running}
                        onClick={() => runSnippet(idx, block.code)}
                      >
                        <PlayIcon fontSize="small" /> {out?.running ? "Running…" : "Run"}
                      </button>
                      <button
                        type="button"
                        className={styles.maximizeBtn}
                        onClick={() => setExpandedCode({ index: idx, code: block.code })}
                        aria-label="Maximize"
                        title="View full screen"
                      >
                        <FullscreenIcon fontSize="small" />
                      </button>
                      <Link
                        href={createLocalizedPath("/developer-section/kotlin-playground")}
                        className={styles.playgroundLinkInline}
                      >
                        Playground →
                      </Link>
                    </div>
                  </div>
                  <pre className={styles.codeBlock}>
                    <code><HighlightedCode code={block.code} /></code>
                  </pre>
                  {block.comment && (
                    <div className={styles.codeMeta}>{block.comment}</div>
                  )}
                  {(out?.output != null || out?.error != null) && (
                    <div className={`${styles.snippetOutput} ${out?.error ? styles.snippetOutputError : ""}`}>
                      {out?.error ?? out?.output ?? ""}
                    </div>
                  )}
                </div>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={i} className={styles.list}>
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }

            return null;
          })}

          <div className={styles.pageFooter}>
            <Link
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
            >
              ← Back to Developer Hub
            </Link>
          </div>
        </main>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImage} alt="Full size" className={styles.lightboxImage} />
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={() => setLightboxImage(null)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Expanded: same CodeEditor as rest of site (Copy all, Paste, Select all, Reset, Run, fullscreen) */}
      {expandedCode && (
        <CodeEditor
          key={expandedCode.index}
          code={expandedCode.code}
          language="kotlin"
          defaultFullscreen={true}
          onFullscreenChange={(v) => {
            if (!v) setExpandedCode(null);
          }}
          onRunKotlin={async (code) => {
            await runSnippet(expandedCode.index, code);
          }}
          kotlinRunOutput={snippetOutputs[expandedCode.index]?.output}
          kotlinRunError={snippetOutputs[expandedCode.index]?.error}
        />
      )}

      <Footer />
    </>
  );
}
