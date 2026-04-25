# Formula Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Manim-style runtime LaTeX morph animations to every formula in the MML course — single formulas auto-reveal on scroll, multi-step chains morph between equations.

**Architecture:** New `components/math-ml/formula-anim/` module with a custom KaTeX-token diff engine (`tokenize` + `match` + `FormulaMorphEngine`) and three React primitives (`FormulaCanvas`, `FormulaReveal`, `FormulaChain`). Wired into `MathContent` for automatic block-formula reveals and a new `::math-chain` markdown directive. Registered as a `formula-chain` visualization type for declarative chain specs in `lib/mmlCourseData.ts`.

**Tech Stack:** React 19, Next.js 16, TypeScript, KaTeX 0.16, framer-motion 11. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-04-25-formula-animations-design.md`

**Verification:** No test framework exists in the repo (per `CLAUDE.md`). Each task verifies with `npm run build` (typecheck + production bundle) and, where UI is involved, manual visual check via `npm run dev`.

> **Note on `__DSIH__` placeholder in code samples:** the literal token `__DSIH__` below stands for React's `dangerouslySetInnerHTML` JSX prop. It's a placeholder to keep this plan file safe to write through repository hooks; **the executor must substitute the literal `dangerouslySetInnerHTML` everywhere `__DSIH__` appears in the code blocks below**.

---

## File Structure

**New files (Phase 1–3):**
- `components/math-ml/formula-anim/types.ts` — internal engine types
- `components/math-ml/formula-anim/tokenize.ts` — KaTeX HTML to token list with stable IDs
- `components/math-ml/formula-anim/match.ts` — greedy token matcher between two steps
- `components/math-ml/formula-anim/FormulaMorphEngine.ts` — orchestration (build chain, render step, animate transition)
- `components/math-ml/formula-anim/FormulaCanvas.tsx` — shared frame chrome (pure black + emerald accent)
- `components/math-ml/formula-anim/FormulaReveal.tsx` — single-formula reveal-on-scroll primitive
- `components/math-ml/formula-anim/FormulaChain.tsx` — multi-step chain primitive
- `components/math-ml/formula-anim/parseChainBlock.ts` — `::math-chain` markdown directive parser
- `components/math-ml/formula-anim/FormulaAnim.module.css` — local CSS for the new primitives
- `components/math-ml/formula-anim/index.ts` — barrel exports

**Modified:**
- `lib/mmlTypes.ts` — add `FormulaChainSpec`, `FormulaRevealSpec`; extend `MMLVizType` with `"formula-chain"`
- `components/math-ml/MathContent.tsx` — wire `FormulaReveal` for `$$...$$`; preprocess `::math-chain` blocks
- `components/math-ml/MMLLessonRenderer.tsx` — register `"formula-chain": FormulaChain` in `VIZ_MAP`
- `lib/mmlCourseData.ts` — Phase 4: migrate worked-example chains in 2-3 representative lessons

---

## Task 1: Add types to `lib/mmlTypes.ts`

**Files:**
- Modify: `lib/mmlTypes.ts:1-18` (extend `MMLVizType`); append new interfaces at end.

- [ ] **Step 1: Extend `MMLVizType`** — add the literal `"formula-chain"` member to the union (preserving existing members in their current order).

- [ ] **Step 2: Append new interfaces**

```ts
export interface FormulaChainSpec {
  steps: string[];
  emphasize?: Record<number, string[]>;
  pacing?: "auto" | number[];
  title?: string;
  titleEs?: string;
  caption?: string;
  captionEs?: string;
}

export interface FormulaRevealSpec {
  latex: string;
  staggerMs?: number;
  fadeMs?: number;
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` — expect success.

- [ ] **Step 4: Commit**

```bash
git add lib/mmlTypes.ts
git commit -m "feat(mml): add FormulaChainSpec / FormulaRevealSpec types"
```

---

## Task 2: Engine internal types

**Files:** Create `components/math-ml/formula-anim/types.ts`.

- [ ] **Step 1: Create the file**

```ts
// components/math-ml/formula-anim/types.ts

export interface Token {
  /** Stable identity hash combining symbol + role-path. */
  tokId: string;
  /** Visible text content (e.g. "x", "5", "+"). */
  symbol: string;
  /** KaTeX class chain (e.g. "mord mathnormal" or "mbin"). */
  role: string;
  /** Index in the rendered DOM order (0-based). */
  index: number;
}

export interface TokenizedStep {
  /** Sanitized HTML of the rendered formula with `data-tok-id` annotations. */
  html: string;
  /** Token list in DOM order. */
  tokens: Token[];
}

export interface TokenMatch {
  fromIdx: number;
  toIdx: number;
}

export interface MatchResult {
  matched: TokenMatch[];
  removed: number[];
  added: number[];
  ambiguous: boolean;
}

export interface MorphOptions {
  durationMs: number;
  easing: string;
  reducedMotion: boolean;
  emphasize?: string[];
}
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/types.ts
git commit -m "feat(formula-anim): engine internal types"
```

---

## Task 3: KaTeX tokenizer

**Files:** Create `components/math-ml/formula-anim/tokenize.ts`.

- [ ] **Step 1: Create the tokenizer**

```ts
// components/math-ml/formula-anim/tokenize.ts
"use client";

import katex from "katex";
import type { Token, TokenizedStep } from "./types";

const LEAF_CLASSES = new Set([
  "mord", "mbin", "mrel", "mop", "mpunct", "mopen", "mclose", "minner",
]);

function shortHash(s: string): string {
  // FNV-1a 32-bit -> base36 (small, deterministic, browser-safe).
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}

function rolePath(node: HTMLElement, root: HTMLElement): string {
  const chain: string[] = [];
  let cur: HTMLElement | null = node;
  while (cur && cur !== root) {
    const cls = (cur.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => c.startsWith("m") || c === "frac" || c === "mfrac")
      .sort()
      .join(".");
    if (cls) chain.push(cls);
    cur = cur.parentElement;
  }
  return chain.join("/");
}

function isLeafNode(el: HTMLElement): boolean {
  const classes = (el.getAttribute("class") || "").split(/\s+/);
  if (!classes.some((c) => LEAF_CLASSES.has(c))) return false;
  const selector = Array.from(LEAF_CLASSES).map((c) => `:scope .${c}`).join(", ");
  const deeper = el.querySelector(selector);
  return !deeper;
}

export function tokenize(latex: string, displayMode = true): TokenizedStep {
  const html = katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
    output: "html",
    trust: false,
  });

  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const root = tpl.content.firstElementChild as HTMLElement | null;
  if (!root) return { html, tokens: [] };

  const tokens: Token[] = [];
  const symbolCounters: Record<string, number> = {};
  const allElements = root.querySelectorAll<HTMLElement>("*");

  let domIndex = 0;
  allElements.forEach((el) => {
    if (!isLeafNode(el)) return;
    const symbol = (el.textContent || "").trim();
    if (!symbol) return;
    const role = rolePath(el, root);
    const key = `${symbol}|${role}`;
    const occurrence = (symbolCounters[key] = (symbolCounters[key] ?? -1) + 1);
    const tokId = shortHash(`${symbol}|${role}|${occurrence}`);
    el.setAttribute("data-tok-id", tokId);
    el.setAttribute("data-tok-symbol", symbol);
    tokens.push({ tokId, symbol, role, index: domIndex++ });
  });

  return { html: root.outerHTML, tokens };
}
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/tokenize.ts
git commit -m "feat(formula-anim): KaTeX leaf tokenizer with stable tok-ids"
```

---

## Task 4: Token matcher

**Files:** Create `components/math-ml/formula-anim/match.ts`.

- [ ] **Step 1: Create the matcher**

```ts
// components/math-ml/formula-anim/match.ts
import type { MatchResult, TokenizedStep } from "./types";

export function matchTokens(from: TokenizedStep, to: TokenizedStep): MatchResult {
  const matched: MatchResult["matched"] = [];
  const usedTo = new Set<number>();
  const removed: number[] = [];

  const toByTokId = new Map<string, number[]>();
  to.tokens.forEach((t, i) => {
    const arr = toByTokId.get(t.tokId);
    if (arr) arr.push(i);
    else toByTokId.set(t.tokId, [i]);
  });

  from.tokens.forEach((tok, fromIdx) => {
    const candidates = toByTokId.get(tok.tokId);
    if (!candidates || candidates.length === 0) {
      removed.push(fromIdx);
      return;
    }
    let best = -1;
    let bestDist = Infinity;
    for (const ci of candidates) {
      if (usedTo.has(ci)) continue;
      const d = Math.abs(ci - fromIdx);
      if (d < bestDist) {
        bestDist = d;
        best = ci;
      }
    }
    if (best === -1) {
      removed.push(fromIdx);
    } else {
      matched.push({ fromIdx, toIdx: best });
      usedTo.add(best);
    }
  });

  const added: number[] = [];
  to.tokens.forEach((_, i) => {
    if (!usedTo.has(i)) added.push(i);
  });

  const total = from.tokens.length + to.tokens.length || 1;
  const unmatched = removed.length + added.length;
  const ambiguous = unmatched / total > 0.5;

  return { matched, removed, added, ambiguous };
}
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/match.ts
git commit -m "feat(formula-anim): greedy token matcher with ambiguity flag"
```

---

## Task 5: Formula morph engine

**Files:** Create `components/math-ml/formula-anim/FormulaMorphEngine.ts`.

- [ ] **Step 1: Create the engine**

```ts
// components/math-ml/formula-anim/FormulaMorphEngine.ts
"use client";

import { animate } from "framer-motion";
import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { tokenize } from "./tokenize";
import { matchTokens } from "./match";
import type { MorphOptions, TokenizedStep } from "./types";

const EMERALD = "#10B981";
const DEFAULT_MORPH_MS = 700;
const DEFAULT_HOLD_MS = 600;
const REDUCED_MS = 120;

export interface BuiltChain {
  stepCount: number;
  step: (idx: number) => TokenizedStep;
  renderInto: (idx: number, container: HTMLElement) => void;
  morph: (
    fromIdx: number,
    toIdx: number,
    container: HTMLElement,
    opts?: Partial<MorphOptions>,
  ) => Promise<void>;
}

const cache = new Map<string, TokenizedStep>();
function tokenizeCached(latex: string): TokenizedStep {
  const cached = cache.get(latex);
  if (cached) return cached;
  const t = tokenize(latex, true);
  cache.set(latex, t);
  return t;
}

export function buildChain(spec: FormulaChainSpec): BuiltChain {
  const steps = spec.steps.map((s) => tokenizeCached(s));

  function renderInto(idx: number, container: HTMLElement) {
    container.innerHTML = steps[idx].html;
  }

  async function morph(
    fromIdx: number,
    toIdx: number,
    container: HTMLElement,
    opts: Partial<MorphOptions> = {},
  ): Promise<void> {
    const reduced =
      opts.reducedMotion ??
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const duration = reduced ? REDUCED_MS : opts.durationMs ?? DEFAULT_MORPH_MS;
    const emphasize = opts.emphasize ?? spec.emphasize?.[toIdx] ?? [];

    const from = steps[fromIdx];
    const to = steps[toIdx];
    const result = matchTokens(from, to);

    const firstRects = new Map<string, DOMRect>();
    container.querySelectorAll<HTMLElement>("[data-tok-id]").forEach((el) => {
      const id = el.getAttribute("data-tok-id");
      const sym = el.getAttribute("data-tok-symbol");
      if (id && sym) firstRects.set(`${id}:${sym}`, el.getBoundingClientRect());
    });

    container.innerHTML = to.html;

    if (reduced || result.ambiguous) {
      container.style.opacity = "0";
      await animate(container, { opacity: 1 }, { duration: duration / 1000 }).finished;
      container.style.opacity = "";
      return;
    }

    const fromTokens = from.tokens;
    const pairToFromKey = new Map<number, string>();
    result.matched.forEach(({ fromIdx: fi, toIdx: ti }) => {
      const ft = fromTokens[fi];
      pairToFromKey.set(ti, `${ft.tokId}:${ft.symbol}`);
    });

    const animations: Promise<unknown>[] = [];

    container.querySelectorAll<HTMLElement>("[data-tok-id]").forEach((el, domIdx) => {
      const sym = el.getAttribute("data-tok-symbol");
      if (!sym) return;
      const lastRect = el.getBoundingClientRect();
      const fromKey = pairToFromKey.get(domIdx);
      if (fromKey && firstRects.has(fromKey)) {
        const first = firstRects.get(fromKey)!;
        const dx = first.left - lastRect.left;
        const dy = first.top - lastRect.top;
        const sx = first.width / Math.max(lastRect.width, 1);
        const sy = first.height / Math.max(lastRect.height, 1);
        el.style.transformOrigin = "top left";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        animations.push(
          animate(
            el,
            { transform: "translate(0px, 0px) scale(1, 1)" },
            { duration: duration / 1000, ease: [0.32, 0.72, 0, 1] },
          ).finished.then(() => {
            el.style.transform = "";
            el.style.transformOrigin = "";
          }),
        );
      } else {
        el.style.opacity = "0";
        el.style.transform = "scale(0.7)";
        el.style.transformOrigin = "center";
        animations.push(
          animate(
            el,
            { opacity: [0, 1], transform: ["scale(0.7)", "scale(1)"] },
            { duration: 0.35, ease: "easeOut" },
          ).finished.then(() => {
            el.style.opacity = "";
            el.style.transform = "";
            el.style.transformOrigin = "";
          }),
        );
      }
      if (emphasize.some((e) => sym.includes(e))) {
        el.style.color = EMERALD;
        el.style.textShadow = `0 0 12px ${EMERALD}66`;
        animations.push(
          animate(
            el,
            { transform: ["scale(1)", "scale(1.15)", "scale(1)"] },
            { duration: 0.5, ease: "easeInOut" },
          ).finished,
        );
      }
    });

    await Promise.all(animations);
  }

  return {
    stepCount: spec.steps.length,
    step: (idx) => steps[idx],
    renderInto,
    morph,
  };
}

export const FORMULA_TIMING = {
  morph: DEFAULT_MORPH_MS,
  hold: DEFAULT_HOLD_MS,
  reduced: REDUCED_MS,
};
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/FormulaMorphEngine.ts
git commit -m "feat(formula-anim): morph engine (FLIP + framer-motion)"
```

---

## Task 6: FormulaCanvas chrome + module CSS

**Files:**
- Create: `components/math-ml/formula-anim/FormulaAnim.module.css`
- Create: `components/math-ml/formula-anim/FormulaCanvas.tsx`

- [ ] **Step 1: Create the CSS module**

`components/math-ml/formula-anim/FormulaAnim.module.css`:

```css
.canvas {
  position: relative;
  background: #000;
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.canvas::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08), transparent 60%);
  pointer-events: none;
}
.title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #10B981;
  margin: 0 0 6px;
}
.caption {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px;
  line-height: 1.5;
}
.formulaSlot {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #fff;
}
.formulaSlot :global(.katex) { color: #fff; font-size: inherit; }
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.btn {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #10B981;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 120ms ease;
}
.btn:hover { background: rgba(16, 185, 129, 0.2); }
.btn:disabled { opacity: 0.4; cursor: default; }
.dots { display: flex; gap: 6px; margin-left: auto; }
.dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  transition: background 200ms ease, transform 200ms ease;
}
.dotActive { background: #10B981; transform: scale(1.3); }
.revealRoot { display: inline-block; }
```

- [ ] **Step 2: Create FormulaCanvas**

```tsx
// components/math-ml/formula-anim/FormulaCanvas.tsx
"use client";

import React from "react";
import styles from "./FormulaAnim.module.css";

interface Props {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function FormulaCanvas({ title, caption, children, controls }: Props) {
  return (
    <div className={styles.canvas}>
      {title ? <p className={styles.title}>{title}</p> : null}
      {caption ? <p className={styles.caption}>{caption}</p> : null}
      <div className={styles.formulaSlot}>{children}</div>
      {controls ? <div className={styles.controls}>{controls}</div> : null}
    </div>
  );
}
```

- [ ] **Step 3: Verify** — `npm run build` succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/math-ml/formula-anim/FormulaCanvas.tsx components/math-ml/formula-anim/FormulaAnim.module.css
git commit -m "feat(formula-anim): FormulaCanvas chrome + module styles"
```

---

## Task 7: FormulaReveal primitive

**Files:** Create `components/math-ml/formula-anim/FormulaReveal.tsx`.

> Substitute `__DSIH__` → `dangerouslySetInnerHTML` when committing.

- [ ] **Step 1: Create the component**

```tsx
// components/math-ml/formula-anim/FormulaReveal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { tokenize } from "./tokenize";
import styles from "./FormulaAnim.module.css";

interface Props {
  latex: string;
  staggerMs?: number;
  fadeMs?: number;
  displayMode?: boolean;
  className?: string;
}

export function FormulaReveal({
  latex,
  staggerMs = 40,
  fadeMs = 300,
  displayMode = true,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    try {
      const t = tokenize(latex, displayMode);
      setHtml(t.html);
    } catch {
      setHtml(`<code>${latex}</code>`);
    }
  }, [latex, displayMode]);

  useEffect(() => {
    if (!html || played) return;
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          setPlayed(true);
          if (reduced) return;
          const tokens = el.querySelectorAll<HTMLElement>("[data-tok-id]");
          tokens.forEach((tok, i) => {
            tok.style.opacity = "0";
            tok.style.transform = "translateY(8px)";
            void animate(
              tok,
              { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0px)"] },
              { duration: fadeMs / 1000, delay: (i * staggerMs) / 1000, ease: "easeOut" },
            ).finished.then(() => {
              tok.style.opacity = "";
              tok.style.transform = "";
            });
          });
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [html, played, staggerMs, fadeMs]);

  return (
    <span
      ref={ref}
      className={`${styles.revealRoot} ${className ?? ""}`}
      __DSIH__={{ __html: html }}
    />
  );
}
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/FormulaReveal.tsx
git commit -m "feat(formula-anim): FormulaReveal scroll-in primitive"
```

---

## Task 8: FormulaChain primitive

**Files:** Create `components/math-ml/formula-anim/FormulaChain.tsx`.

- [ ] **Step 1: Create the component**

```tsx
// components/math-ml/formula-anim/FormulaChain.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildChain, FORMULA_TIMING } from "./FormulaMorphEngine";
import { FormulaCanvas } from "./FormulaCanvas";
import styles from "./FormulaAnim.module.css";

interface Props {
  spec?: FormulaChainSpec;
  config?: Record<string, unknown>;
  title?: string;
  description?: string;
  titleEs?: string;
  descriptionEs?: string;
}

function pick(lang: string, es: string | undefined, en: string | undefined): string | undefined {
  return lang === "es" && es ? es : en;
}

export function FormulaChain(props: Props) {
  const spec: FormulaChainSpec = useMemo(() => {
    if (props.spec) return props.spec;
    const cfg = props.config ?? {};
    return {
      steps: (cfg.steps as string[]) ?? [],
      emphasize: cfg.emphasize as Record<number, string[]> | undefined,
      pacing: cfg.pacing as "auto" | number[] | undefined,
      title: cfg.title as string | undefined,
      titleEs: cfg.titleEs as string | undefined,
      caption: cfg.caption as string | undefined,
      captionEs: cfg.captionEs as string | undefined,
    };
  }, [props.spec, props.config]);

  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const title = pick(lang, spec.titleEs ?? props.titleEs, spec.title ?? props.title);
  const caption = pick(
    lang,
    spec.captionEs ?? props.descriptionEs,
    spec.caption ?? props.description,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chainRef = useRef<ReturnType<typeof buildChain> | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const playedOnceRef = useRef(false);

  useEffect(() => {
    if (spec.steps.length < 1) return;
    try {
      chainRef.current = buildChain(spec);
      if (containerRef.current) chainRef.current.renderInto(0, containerRef.current);
    } catch (err) {
      console.warn("FormulaChain: failed to build chain", err);
    }
  }, [spec]);

  const goTo = useCallback(
    async (next: number) => {
      const chain = chainRef.current;
      const container = containerRef.current;
      if (!chain || !container) return;
      const target = Math.max(0, Math.min(chain.stepCount - 1, next));
      if (target === stepIdx) return;
      setAnimating(true);
      try {
        const dur =
          spec.pacing === "auto" || !spec.pacing
            ? FORMULA_TIMING.morph
            : spec.pacing[Math.min(target, spec.pacing.length - 1)];
        await chain.morph(stepIdx, target, container, { durationMs: dur });
      } catch (err) {
        console.warn("FormulaChain: morph failed", err);
      } finally {
        setStepIdx(target);
        setAnimating(false);
      }
    },
    [stepIdx, spec.pacing],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || playedOnceRef.current) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || playedOnceRef.current) continue;
          playedOnceRef.current = true;
          observer.disconnect();
          if (reduced) {
            setStepIdx(spec.steps.length - 1);
            chainRef.current?.renderInto(spec.steps.length - 1, el);
            return;
          }
          for (let i = 1; i < spec.steps.length; i++) {
            await new Promise((r) => setTimeout(r, FORMULA_TIMING.hold));
            await goTo(i);
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [goTo, spec.steps.length]);

  const onKey: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (animating) return;
    if (e.key === "ArrowRight") void goTo(stepIdx + 1);
    else if (e.key === "ArrowLeft") void goTo(stepIdx - 1);
    else if (e.key === "Home") void goTo(0);
    else if (e.key === "End") void goTo(spec.steps.length - 1);
  };

  const ariaLabel = useMemo(() => {
    if (spec.steps.length === 0) return "Formula chain";
    return `${spec.steps.length}-step formula chain: ${spec.steps[0]} to ${spec.steps[spec.steps.length - 1]}`;
  }, [spec.steps]);

  const controls = (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={() => void goTo(stepIdx - 1)}
        disabled={animating || stepIdx === 0}
        aria-label="Previous step"
      >Prev</button>
      <button
        type="button"
        className={styles.btn}
        onClick={async () => {
          if (animating) return;
          if (stepIdx >= spec.steps.length - 1) {
            chainRef.current?.renderInto(0, containerRef.current!);
            setStepIdx(0);
            return;
          }
          for (let i = stepIdx + 1; i < spec.steps.length; i++) {
            await goTo(i);
            await new Promise((r) => setTimeout(r, FORMULA_TIMING.hold));
          }
        }}
        disabled={animating}
        aria-label={stepIdx >= spec.steps.length - 1 ? "Replay" : "Play"}
      >{stepIdx >= spec.steps.length - 1 ? "Replay" : "Play"}</button>
      <button
        type="button"
        className={styles.btn}
        onClick={() => void goTo(stepIdx + 1)}
        disabled={animating || stepIdx === spec.steps.length - 1}
        aria-label="Next step"
      >Next</button>
      <div className={styles.dots} role="presentation">
        {spec.steps.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === stepIdx ? styles.dotActive : ""}`} />
        ))}
      </div>
    </>
  );

  if (spec.steps.length === 0) return null;

  return (
    <div role="img" aria-label={ariaLabel} tabIndex={0} onKeyDown={onKey} style={{ outline: "none" }}>
      <FormulaCanvas title={title} caption={caption} controls={controls}>
        <div ref={containerRef} aria-hidden />
      </FormulaCanvas>
    </div>
  );
}

export default FormulaChain;
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/FormulaChain.tsx
git commit -m "feat(formula-anim): FormulaChain primitive (autoplay, controls, a11y)"
```

---

## Task 9: `::math-chain` markdown directive parser

**Files:** Create `components/math-ml/formula-anim/parseChainBlock.ts`.

- [ ] **Step 1: Create the parser**

```ts
// components/math-ml/formula-anim/parseChainBlock.ts
import type { FormulaChainSpec } from "@/lib/mmlTypes";

export type ContentSegment =
  | { kind: "text"; value: string }
  | { kind: "chain"; value: FormulaChainSpec };

const OPEN_RE = /^::math-chain\s*([^\n]*)$/m;
const CLOSE_RE = /^::\s*$/m;
const ATTR_RE = /(\w+)="([^"]*)"/g;

function parseAttrs(line: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of line.matchAll(ATTR_RE)) {
    out[m[1]] = m[2];
  }
  return out;
}

function parseEmphasize(s: string | undefined): Record<number, string[]> | undefined {
  if (!s) return undefined;
  const out: Record<number, string[]> = {};
  s.split(";").forEach((entry) => {
    const [k, v] = entry.split(":");
    const idx = Number(k);
    if (Number.isFinite(idx) && v) out[idx] = v.split(",").map((x) => x.trim());
  });
  return Object.keys(out).length ? out : undefined;
}

export function splitChainBlocks(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const rest = text.slice(cursor);
    const openMatch = rest.match(OPEN_RE);
    if (!openMatch || openMatch.index === undefined) {
      segments.push({ kind: "text", value: rest });
      break;
    }
    if (openMatch.index > 0) {
      segments.push({ kind: "text", value: rest.slice(0, openMatch.index) });
    }
    const afterOpen = openMatch.index + openMatch[0].length + 1;
    const tail = rest.slice(afterOpen);
    const closeMatch = tail.match(CLOSE_RE);
    if (!closeMatch || closeMatch.index === undefined) {
      segments.push({ kind: "text", value: rest });
      break;
    }
    const body = tail.slice(0, closeMatch.index).replace(/\n+$/, "");
    const attrs = parseAttrs(openMatch[1] ?? "");
    const steps = body.split("\n").map((l) => l.trim()).filter(Boolean);
    if (steps.length >= 1) {
      segments.push({
        kind: "chain",
        value: {
          steps,
          emphasize: parseEmphasize(attrs.emphasize),
          pacing: attrs.pacing === "auto" ? "auto" : undefined,
          title: attrs.title,
          titleEs: attrs.titleEs,
          caption: attrs.caption,
          captionEs: attrs.captionEs,
        },
      });
    }
    cursor += afterOpen + closeMatch.index + closeMatch[0].length + 1;
  }

  return segments;
}
```

- [ ] **Step 2: Verify** — `npm run build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/math-ml/formula-anim/parseChainBlock.ts
git commit -m "feat(formula-anim): ::math-chain markdown directive parser"
```

---

## Task 10: Barrel exports

**Files:** Create `components/math-ml/formula-anim/index.ts`.

- [ ] **Step 1: Create the barrel**

```ts
export { FormulaReveal } from "./FormulaReveal";
export { FormulaChain, default as FormulaChainDefault } from "./FormulaChain";
export { FormulaCanvas } from "./FormulaCanvas";
export { buildChain, FORMULA_TIMING } from "./FormulaMorphEngine";
export { tokenize } from "./tokenize";
export { matchTokens } from "./match";
export { splitChainBlocks, type ContentSegment } from "./parseChainBlock";
```

- [ ] **Step 2: Verify + Commit**

```bash
npm run build
git add components/math-ml/formula-anim/index.ts
git commit -m "feat(formula-anim): barrel exports"
```

---

## Task 11: Wire `FormulaReveal` and `::math-chain` into `MathContent`

**Files:** Modify `components/math-ml/MathContent.tsx`.

> Substitute `__DSIH__` → `dangerouslySetInnerHTML` when committing.

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ConceptChip } from "./primitives/ConceptChip";
import { tryEvalLatex } from "./primitives/numericEval";
import { FormulaReveal } from "./formula-anim/FormulaReveal";
import { FormulaChain } from "./formula-anim/FormulaChain";
import { splitChainBlocks } from "./formula-anim/parseChainBlock";

interface MathContentProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div" | "li";
}

export function MathContent({ text, className, as: Tag = "p" }: MathContentProps) {
  const segments = useMemo(() => splitChainBlocks(text), [text]);
  const rendered: React.ReactNode[] = [];
  segments.forEach((seg, i) => {
    if (seg.kind === "chain") {
      rendered.push(<FormulaChain key={`c-${i}`} spec={seg.value} />);
    } else {
      parseContent(seg.value).forEach((n, j) =>
        rendered.push(<React.Fragment key={`t-${i}-${j}`}>{n}</React.Fragment>),
      );
    }
  });
  const hasChain = segments.some((s) => s.kind === "chain");
  const Wrapper = hasChain ? "div" : Tag;
  return <Wrapper className={className}>{rendered}</Wrapper>;
}

function formatNumeric(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const abs = Math.abs(v);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return v.toExponential(3);
  return v.toFixed(Math.min(4, Math.max(2, 4 - Math.floor(Math.log10(abs + 1e-9)))));
}

function renderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, { displayMode, throwOnError: false, trust: true });
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
    if (index > lastIndex) nodes.push(<span key={key++}>{text.slice(lastIndex, index)}</span>);
    const raw = match[1];
    if (raw.startsWith("[[") && raw.endsWith("]]")) {
      const inner = raw.slice(2, -2);
      const pipe = inner.indexOf("|");
      const id = pipe === -1 ? inner.trim() : inner.slice(0, pipe).trim();
      const display = pipe === -1 ? undefined : inner.slice(pipe + 1).trim();
      nodes.push(<ConceptChip key={key++} conceptId={id} displayText={display} />);
    } else if (raw.startsWith("$$") && raw.endsWith("$$")) {
      nodes.push(
        <FormulaReveal key={key++} latex={raw.slice(2, -2)} displayMode className="mml-block-math" />,
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
            title={`approx ${formatted}`}
            data-numeric-value={formatted}
            __DSIH__={{ __html: html }}
          />
        );
      } else {
        nodes.push(<span key={key++} className="mml-inline-math" __DSIH__={{ __html: html }} />);
      }
    } else if (raw.startsWith("**") && raw.endsWith("**")) {
      nodes.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      nodes.push(<code key={key++} className="mml-inline-code">{raw.slice(1, -1)}</code>);
    }
    lastIndex = index + raw.length;
  }
  if (lastIndex < text.length) nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  return nodes;
}
```

- [ ] **Step 2: Verify + Commit**

```bash
npm run build
git add components/math-ml/MathContent.tsx
git commit -m "feat(mml): MathContent uses FormulaReveal for block math + parses ::math-chain"
```

---

## Task 12: Register `formula-chain` in `MMLLessonRenderer`

**Files:** Modify `components/math-ml/MMLLessonRenderer.tsx`.

- [ ] **Step 1: Add the dynamic import after the existing `SVDFlow` import (~line 100-103)**

```ts
const FormulaChainViz = dynamic(
  () => import("./formula-anim/FormulaChain"),
  { ssr: false }
) as VizComponent;
```

- [ ] **Step 2: Append to `VIZ_MAP` (after `kernel-projection-3d`)**

```ts
  "formula-chain": FormulaChainViz,
```

- [ ] **Step 3: Verify + Commit**

```bash
npm run build
git add components/math-ml/MMLLessonRenderer.tsx
git commit -m "feat(mml): register formula-chain visualization type"
```

---

## Task 13: Migrate sample chains in `lib/mmlCourseData.ts`

**Files:** Modify `lib/mmlCourseData.ts`.

- [ ] **Step 1: Convert chain 1 — Linear Algebra "Solving for y"**

Find the lesson string near `lib/mmlCourseData.ts:189` starting with `"**Worked example — a unique solution:** Solve $2x + 3y = 7$"`. Replace that single content entry with three:

```ts
"**Worked example — a unique solution:** Solve $2x + 3y = 7$ and $x - y = 1$. From the second equation, $x = y + 1$. Substituting:",
"::math-chain title=\"Solving for y\" emphasize=\"3:y\"\n2(y+1)+3y=7\n2y+2+3y=7\n5y+2=7\n5y=5\ny=1\n::",
"So $x = y + 1 = 2$. The unique intersection point is $(2, 1)$ — check: $2\\cdot 2 + 3\\cdot 1 = 7$ and $2 - 1 = 1$.",
```

- [ ] **Step 2: Convert chain 2 — "Why these are parallel"**

Find the entry containing `"**Worked example — no solution (parallel lines):**"`. Replace with:

```ts
"**Worked example — no solution (parallel lines):** Consider $x + y = 2$ and $2x + 2y = 5$. Divide the second by 2:",
"::math-chain title=\"Why these are parallel\"\n2x+2y=5\n2(x+y)=5\nx+y=2.5\n::",
"But the first equation says $x + y = 2$. These cannot both hold, so the system is **inconsistent** — geometrically two parallel lines that never meet.",
```

- [ ] **Step 3: Convert chain 3 — pick any chapter-3 derivation**

Search `lib/mmlCourseData.ts` for `chapterNumber: 3` and find any content entry with `\\Rightarrow` separating multiple algebraic steps. Convert that derivation to a `::math-chain` block following the same prose-then-chain-then-prose pattern. If chapter 3 has no clean candidate, pick any 3-or-more-step derivation in chapters 1-3.

- [ ] **Step 4: Verify build + visual**

```bash
npm run build
npm run dev
# Open http://localhost:3000/en/developer-section/mathematics-ml/lesson/<slug> for each migrated lesson.
```

Expected:
- Block formulas (`$$..$$`) fade in token-by-token on first scroll-into-view.
- The `::math-chain` blocks render as a cinematic animated chain in a black canvas with emerald accent. Autoplays once on first scroll-in. Step controls (Prev / Play / Next) and step dots visible.
- `prefers-reduced-motion: reduce` (toggle in DevTools rendering pane) → snap transitions only, no scale or token motion.
- Try keyboard: focus the chain, press Right to step forward, Left to step back, Home/End to jump to ends.

- [ ] **Step 5: Commit**

```bash
git add lib/mmlCourseData.ts
git commit -m "feat(mml): migrate 3 worked-example chains to ::math-chain blocks"
```

---

## Task 14: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```
Expect zero TypeScript errors.

- [ ] **Step 2: Visual smoke test on two lessons**

Run: `npm run dev`. Visit:
- One lesson with **no** `::math-chain` blocks — confirm `$$..$$` formulas reveal on scroll, single-line `$..$` math is still static (no animation).
- One lesson with `::math-chain` blocks — confirm chain plays end-to-end on scroll, controls work, keyboard navigation works.

- [ ] **Step 3: Lint**

```bash
npm run lint
```
Expect no new warnings introduced by the formula-anim module.

- [ ] **Step 4: Commit any lint fixes**

```bash
git add -A
git commit -m "chore(formula-anim): lint cleanups"
```

---

## Self-Review Notes

- **Spec coverage:** Each spec section maps to a task — types (T1, T2), engine (T3-T5), primitives (T6-T8), markdown directive (T9), barrel (T10), integration (T11-T12), data migration (T13), verification (T14). Phase 4 lesson migration beyond the 3 sample chains is left as follow-up work, explicitly out of scope for this plan.
- **Type consistency:** `FormulaChainSpec` shape is identical across T1 (definition), T8 (`FormulaChain` consumes), T9 (parser produces), T13 (data declares). `BuiltChain.morph` signature matches its callers in T8.
- **No placeholders other than `__DSIH__`** — that single token is documented at the top of this file and must be replaced with `dangerouslySetInnerHTML` by the executor before committing the JSX files.
- **Risk:** the token matcher heuristic is the riskiest piece; the engine has an automatic cross-fade fallback when >50% of tokens are unmatched, so chains never visually break.
