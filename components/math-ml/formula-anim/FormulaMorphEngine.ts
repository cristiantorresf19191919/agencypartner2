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

/**
 * Replace `container` children with the parsed children of `htmlString`,
 * without ever assigning to `.innerHTML` on a live element.
 */
function swapContainer(container: HTMLElement, htmlString: string): void {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  const root = doc.body.firstElementChild;
  container.replaceChildren();
  if (root) container.appendChild(root);
}

export function buildChain(spec: FormulaChainSpec): BuiltChain {
  const steps = spec.steps.map((s) => tokenizeCached(s));

  function renderInto(idx: number, container: HTMLElement) {
    swapContainer(container, steps[idx].html);
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
    const duration = reduced
      ? REDUCED_MS
      : opts.durationMs ?? DEFAULT_MORPH_MS;
    const emphasize = opts.emphasize ?? spec.emphasize?.[toIdx] ?? [];

    const from = steps[fromIdx];
    const to = steps[toIdx];
    const result = matchTokens(from, to);

    // FIRST: capture rects of the currently-rendered (`from`) tokens.
    const firstRects = new Map<string, DOMRect>();
    container
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el) => {
        const id = el.getAttribute("data-tok-id");
        const sym = el.getAttribute("data-tok-symbol");
        if (id && sym) {
          firstRects.set(`${id}:${sym}`, el.getBoundingClientRect());
        }
      });

    // Swap to the destination layout.
    swapContainer(container, to.html);

    if (reduced || result.ambiguous) {
      container.style.opacity = "0";
      await animate(
        container,
        { opacity: 1 },
        { duration: duration / 1000 },
      );
      container.style.opacity = "";
      return;
    }

    // Build pairing: destination DOM index -> source key for FLIP lookup.
    const fromTokens = from.tokens;
    const pairToFromKey = new Map<number, string>();
    result.matched.forEach(({ fromIdx: fi, toIdx: ti }) => {
      const ft = fromTokens[fi];
      pairToFromKey.set(ti, `${ft.tokId}:${ft.symbol}`);
    });

    const animations: Promise<unknown>[] = [];

    container
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el, domIdx) => {
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
            ).then(() => {
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
            ).then(() => {
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
            ).then(() => undefined),
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
