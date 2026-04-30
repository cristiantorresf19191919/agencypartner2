"use client";

import { animate } from "framer-motion";
import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { tokenize } from "./tokenize";
import { matchTokens } from "./match";
import type { MorphOptions, TokenizedStep } from "./types";

const EMERALD = "#10B981";
const DEFAULT_MORPH_MS = 850;
const DEFAULT_HOLD_MS = 800;
const REDUCED_MS = 140;
/** Standard Material easing — feels deliberate without being heavy. */
const SMOOTH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 0.6];

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

    // FIRST: capture rects + cloned exit nodes for the leaving tokens.
    const firstRects = new Map<string, DOMRect>();
    /** Cloned DOM nodes for tokens that are about to disappear. */
    const exitClones: { node: HTMLElement; rect: DOMRect }[] = [];

    // Identify which `from` tokens are matched. Anything unmatched is a
    // "leaver" that we'll animate out as a ghost.
    const matchedFromKeys = new Set<string>();
    result.matched.forEach(({ fromIdx: fi }) => {
      const ft = from.tokens[fi];
      matchedFromKeys.add(`${ft.tokId}:${ft.symbol}`);
    });

    container
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el) => {
        const id = el.getAttribute("data-tok-id");
        const sym = el.getAttribute("data-tok-symbol");
        if (!id || !sym) return;
        const key = `${id}:${sym}`;
        firstRects.set(key, el.getBoundingClientRect());
        if (!matchedFromKeys.has(key)) {
          // Clone the live node BEFORE we swap; safe DOM clone, no innerHTML.
          const clone = el.cloneNode(true) as HTMLElement;
          exitClones.push({ node: clone, rect: el.getBoundingClientRect() });
        }
      });

    const containerRect = container.getBoundingClientRect();

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

    // Layer for exit ghosts so they don't disturb the new layout.
    const ghostLayer = document.createElement("div");
    ghostLayer.setAttribute("data-formula-ghosts", "true");
    ghostLayer.style.cssText =
      "position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2;";
    const prevPosition = container.style.position;
    if (!prevPosition || prevPosition === "static") {
      container.style.position = "relative";
    }
    for (const ec of exitClones) {
      const node = ec.node;
      node.style.position = "absolute";
      node.style.left = `${ec.rect.left - containerRect.left}px`;
      node.style.top = `${ec.rect.top - containerRect.top}px`;
      node.style.width = `${ec.rect.width}px`;
      node.style.height = `${ec.rect.height}px`;
      node.style.transformOrigin = "center";
      node.style.willChange = "transform, opacity";
      node.style.pointerEvents = "none";
      ghostLayer.appendChild(node);
    }
    if (ghostLayer.children.length > 0) {
      container.appendChild(ghostLayer);
    }

    // Tag the formula slot so the canvas can dim its surroundings during
    // the transition (a soft visual cue that the morph is in flight).
    const slot = container.closest<HTMLElement>("[data-formula-slot]");
    slot?.setAttribute("data-morphing", "true");

    // Build pairing: destination DOM index -> source key for FLIP lookup.
    const fromTokens = from.tokens;
    const pairToFromKey = new Map<number, string>();
    result.matched.forEach(({ fromIdx: fi, toIdx: ti }) => {
      const ft = fromTokens[fi];
      pairToFromKey.set(ti, `${ft.tokId}:${ft.symbol}`);
    });

    const animations: Promise<unknown>[] = [];
    const morphSec = duration / 1000;

    /* ───────────────────────────────────────────────────────────────
     * Three sequential phases — exits clear before entries land:
     *
     *   Phase A  exits      0.00 → 0.45 of morph  (fade + slide up)
     *   Phase B  matched    0.05 → 1.00           (FLIP smooth)
     *   Phase C  entries    0.55 → 1.00           (fade + slide up)
     *
     * The 10ms overlap between B start and A start gives matched tokens
     * a head start so the eye has something to track while the leavers
     * dissolve, but the entries are gated until exits are essentially gone.
     * ─────────────────────────────────────────────────────────────── */

    // Pre-hide every new-only token so they don't flash before phase C.
    container
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el, domIdx) => {
        const fromKey = pairToFromKey.get(domIdx);
        if (!fromKey || !firstRects.has(fromKey)) {
          el.style.opacity = "0";
          el.style.transform = "translateY(8px) scale(0.88)";
          el.style.transformOrigin = "center";
        }
      });

    // PHASE A — exit ghosts.
    ghostLayer
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el) => {
        animations.push(
          animate(
            el,
            {
              opacity: [1, 0],
              transform: [
                "translateY(0px) scale(1)",
                "translateY(-12px) scale(0.78)",
              ],
            },
            { duration: morphSec * 0.45, ease: EXIT_EASE },
          ).then(() => undefined),
        );
      });

    container
      .querySelectorAll<HTMLElement>("[data-tok-id]")
      .forEach((el, domIdx) => {
        const sym = el.getAttribute("data-tok-symbol");
        if (!sym) return;
        const lastRect = el.getBoundingClientRect();
        const fromKey = pairToFromKey.get(domIdx);
        if (fromKey && firstRects.has(fromKey)) {
          // PHASE B — matched FLIP
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
              {
                duration: morphSec * 0.95,
                delay: morphSec * 0.05,
                ease: SMOOTH_EASE,
              },
            ).then(() => {
              el.style.transform = "";
              el.style.transformOrigin = "";
            }),
          );
        } else {
          // PHASE C — entry slide-in (waits for exits to clear)
          animations.push(
            animate(
              el,
              {
                opacity: [0, 1],
                transform: [
                  "translateY(8px) scale(0.88)",
                  "translateY(0px) scale(1)",
                ],
              },
              {
                duration: morphSec * 0.45,
                delay: morphSec * 0.55,
                ease: ENTER_EASE,
              },
            ).then(() => {
              el.style.opacity = "";
              el.style.transform = "";
              el.style.transformOrigin = "";
            }),
          );
        }
        if (emphasize.some((e) => sym.includes(e))) {
          el.style.color = EMERALD;
          el.style.textShadow = `0 0 14px ${EMERALD}aa`;
          animations.push(
            animate(
              el,
              { transform: ["scale(1)", "scale(1.18)", "scale(1)"] },
              {
                duration: 0.55,
                delay: morphSec * 0.95,
                ease: "easeInOut",
              },
            ).then(() => undefined),
          );
        }
      });

    try {
      await Promise.all(animations);
    } finally {
      ghostLayer.remove();
      slot?.removeAttribute("data-morphing");
      if (!prevPosition || prevPosition === "static") {
        container.style.position = prevPosition;
      }
    }
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
