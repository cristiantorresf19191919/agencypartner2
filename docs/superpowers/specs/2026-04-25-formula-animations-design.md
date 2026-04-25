# Formula Animations — Manim-quality LaTeX Morphs (MML Course)

**Status:** Approved 2026-04-25
**Owner:** cristianscript
**Scope:** `components/math-ml/` — lesson rendering for the Mathematics for ML course

## Goal

Give every formula in the MML course a cinematic feel: static formulas get a token-by-token reveal-on-scroll, and multi-step solving / derivation chains get **Manim-style morphs** where individual symbols glide between successive equations. Output is anti-aliased, frame-perfect, and respects reduced-motion preferences. Runs entirely in the browser at runtime — no build pipeline, no video assets.

## Non-Goals

- No third-party Manim integration (no Python, no server-side render).
- No video / Lottie pre-render pipeline.
- No interactive parameter sliders inside formulas (future work; the engine should not preclude it).
- No new test framework — repository has none (per `CLAUDE.md`); verification is visual.

## Architecture

A new module `components/math-ml/formula-anim/` with three layers:

### Layer 1 — Engine (`FormulaMorphEngine.ts`)

- **Input:** `string[]` of LaTeX (the steps).
- **Render:** for each step, call `katex.renderToString(latex, { output: "html", trust: false })`, parse the result into a DOM tree, walk leaf nodes (`.mord`, `.mbin`, `.mrel`, `.mop`, `.mpunct`, `.mopen`, `.mclose`), wrap each in `<span data-tok-id="<hash>" data-tok-symbol="<symbol>">`.
- **Token identity (`tok-id`):** stable hash of `(symbol, semantic-role-path)` where the role path comes from the parent chain of MathML / KaTeX class names (e.g. an exponent-position `2` gets a different `tok-id` than a coefficient-position `2`).
- **Matching algorithm:** between consecutive steps, greedy match by `tok-id`; ties broken by left-to-right reading order. Matched tokens → FLIP morph. Unmatched-old → fade+scale-out. Unmatched-new → fade+scale-in. If >50% of tokens are unmatched, fall back to a cross-fade between the two whole-formula HTML strings.
- **API:**
  ```ts
  function buildChain(spec: FormulaChainSpec): {
    stepCount: number;
    renderStep: (idx: number) => HTMLElement;
    morph: (fromIdx: number, toIdx: number, container: HTMLElement, opts: MorphOpts) => Promise<void>;
  }
  ```
  Animations are driven by framer-motion's imperative `animate()` API. ~300–500 LOC.

### Layer 2 — React primitives

- **`<FormulaChain spec={...} />`** — driven by the engine; UI chrome includes prev/play/pause/next, the existing `ScrubBar.tsx`, and step-indicator dots. Autoplays once on first scroll-in (respecting `prefers-reduced-motion`); after that, user-controlled.
- **`<FormulaReveal latex="..." />`** — single formula; KaTeX renders normally; on first scroll-in, tokens fade-and-rise (40ms stagger, 300ms each, 8px y-offset).
- **`<FormulaCanvas>`** — internal frame matching the existing `VizFrame.tsx` aesthetic (pure black, emerald accent, optional fullscreen toggle). Consumers use the two above; this is shared chrome.

### Layer 3 — Integration

- **`MathContent.tsx`:** every block-display `$$...$$` becomes `<FormulaReveal>`. Inline `$...$` stays static.
- **Markdown shorthand:** new `::math-chain` directive parsed in `MathContent`:
  ```
  ::math-chain title="Solving for y" emphasize="2:5y;4:y"
  2(y+1)+3y=7
  2y+2+3y=7
  5y+2=7
  5y=5
  y=1
  ::
  ```
  Compiles to a `FormulaChainSpec` and renders `<FormulaChain>`.
- **`MMLLessonRenderer.tsx`:** add `"formula-chain": FormulaChain` to the visualization-type map so chains can also live in a lesson's `visualizations` array.

## Data Model

Added to `lib/mmlTypes.ts`:

```ts
export interface FormulaChainSpec {
  steps: string[];                          // LaTeX, one per step
  emphasize?: Record<number, string[]>;     // step-index → token symbol strings ("y", "5y"); engine matches by data-tok-symbol substring on that step's tokens
  pacing?: "auto" | number[];               // ms per transition; auto = 700ms morph + 600ms hold, scaled by delta size
  title?: string;
  titleEs?: string;
  caption?: string;
  captionEs?: string;
}

export interface FormulaRevealSpec {
  latex: string;
  staggerMs?: number;                       // default 40
  fadeMs?: number;                          // default 300
}
```

## Animation Behavior

- **Easing:** `cubic-bezier(0.32, 0.72, 0, 1)` for morphs; ease-out for fades.
- **Per-step timing (`pacing: "auto"`):** 700ms morph + 600ms hold, stretched by token-delta size.
- **Emphasis:** highlighted tokens glow `#10B981`, scale 1.15× for 500ms then settle; `text-shadow: 0 0 12px rgba(16,185,129,0.4)`.
- **Reduced motion:** snap with 120ms cross-fade only; emphasis becomes a static color change with no scale.
- **Failure mode:** KaTeX parse error → `<code>{latex}</code>` fallback + `console.warn`. Match ambiguity (>50% unmatched) → cross-fade hold.

## Rollout Phases

1. **Engine + primitives + auto-reveal wiring** — build the engine, the three primitives, register `FormulaReveal` inside `MathContent` for all block-display `$$...$$`. **Result: every static formula in every lesson animates on scroll, zero data migration.**
2. **Markdown shorthand parser** — extend `MathContent` to recognize `::math-chain ... ::` blocks.
3. **Visualization-type registration** — add `"formula-chain"` to `MMLLessonRenderer`'s type map for `visualizations` array entries.
4. **Lesson migration** — convert the worked-example chains in `lib/mmlCourseData.ts` (estimated 30–60 chains across 53 lessons). Done incrementally; phases 1–3 ship first.

## Performance

- Lazy render via `IntersectionObserver` — no engine work off-screen.
- Pre-warm the first chain in the viewport on mount.
- Bundle delta ~0: no new dependencies (uses installed `katex` and `framer-motion`).
- Estimated added JS: ~12–18 KB gzipped for the engine + primitives.

## Accessibility

- `<FormulaChain>` exposes `role="img"` + `aria-label` summarizing the chain (e.g. "5-step derivation: 2(y+1)+3y=7 to y=1").
- Keyboard: ←/→ steps, Space toggles play/pause, Home/End jump to first/last.
- Token spans are `aria-hidden`; the `aria-label` carries the semantic content.
- `prefers-reduced-motion: reduce` respected by both primitives.

## Error Handling

- KaTeX parse failures never crash the lesson — fall back to plain `<code>`.
- Spec validation runs in development only (`if (process.env.NODE_ENV === "development") validate(spec)`); warns on missing `steps`, fewer than 2 steps in a chain, or unparseable LaTeX.

## Files (new and modified)

**New:**
- `components/math-ml/formula-anim/FormulaMorphEngine.ts`
- `components/math-ml/formula-anim/FormulaChain.tsx`
- `components/math-ml/formula-anim/FormulaReveal.tsx`
- `components/math-ml/formula-anim/FormulaCanvas.tsx`
- `components/math-ml/formula-anim/tokenize.ts` — KaTeX HTML → token spans + `tok-id` derivation
- `components/math-ml/formula-anim/match.ts` — greedy token matcher
- `components/math-ml/formula-anim/parseChainBlock.ts` — `::math-chain` parser

**Modified:**
- `lib/mmlTypes.ts` — add `FormulaChainSpec`, `FormulaRevealSpec`
- `components/math-ml/MathContent.tsx` — wire `FormulaReveal` for `$$...$$`, parse `::math-chain` blocks
- `components/math-ml/MMLLessonRenderer.tsx` — register `"formula-chain"` visualization type
- `lib/mmlCourseData.ts` — phase 4: migrate worked-example chains

## Verification

- `npm run build` — type-check + production bundle.
- `npm run dev` — visual verification at `/[locale]/developer-section/mathematics-ml/lesson/<slug>` for:
  - At least one lesson with `$$...$$` (reveal-on-scroll fires).
  - At least one lesson with a `::math-chain` block (morph plays).
  - Reduced-motion: enable `prefers-reduced-motion` in browser; confirm cross-fade only, no scale.
  - KaTeX parse error: deliberately malformed LaTeX renders as `<code>` fallback without crashing.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Token matching misfires on complex expressions (matrices, fractions, multi-line equations) | Cross-fade fallback when >50% unmatched; ship Phase 1 (single-formula reveal) first to de-risk the engine. |
| Bundle bloat from KaTeX HTML re-renders | Cache rendered HTML per `(latex, fontSize)` in a module-level `Map`. |
| Animation jank on low-end devices | Lazy mount via IntersectionObserver; reduced-motion always available; framer-motion uses GPU-accelerated transforms. |
| Markdown directive collides with future `::*` blocks | Namespace the directive (`::math-chain`, `::math-reveal`) and document the convention in `MathContent.tsx`. |
