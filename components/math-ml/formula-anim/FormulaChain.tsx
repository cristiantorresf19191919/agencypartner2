"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildChain, FORMULA_TIMING } from "./FormulaMorphEngine";
import { FormulaCanvas } from "./FormulaCanvas";
import styles from "./FormulaAnim.module.css";

interface Props {
  spec?: FormulaChainSpec;
  /** When invoked through MMLLessonRenderer the spec arrives in `config`. */
  config?: Record<string, unknown>;
  title?: string;
  description?: string;
  titleEs?: string;
  descriptionEs?: string;
}

function pick(
  lang: string,
  es: string | undefined,
  en: string | undefined,
): string | undefined {
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
  const stepIdxRef = useRef(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const playedOnceRef = useRef(false);

  // Build chain + render step 0 on mount / when spec changes.
  useEffect(() => {
    if (spec.steps.length < 1) return;
    try {
      chainRef.current = buildChain(spec);
      stepIdxRef.current = 0;
      setStepIdx(0);
      if (containerRef.current) {
        chainRef.current.renderInto(0, containerRef.current);
      }
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
      const fromIdx = stepIdxRef.current;
      if (target === fromIdx) return;
      // Optimistically advance the indicator so the dots reflect the destination
      // for the duration of the morph (the DOM swaps to `target` immediately).
      stepIdxRef.current = target;
      setStepIdx(target);
      setAnimating(true);
      try {
        const dur =
          spec.pacing === "auto" || !spec.pacing
            ? FORMULA_TIMING.morph
            : spec.pacing[
                Math.min(target - 1, spec.pacing.length - 1)
              ] ?? FORMULA_TIMING.morph;
        await chain.morph(fromIdx, target, container, { durationMs: dur });
      } catch (err) {
        console.warn("FormulaChain: morph failed", err);
      } finally {
        setAnimating(false);
      }
    },
    [spec.pacing],
  );

  // Autoplay through all steps once on first scroll-in.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || playedOnceRef.current || spec.steps.length < 2) return;
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
            const lastIdx = spec.steps.length - 1;
            chainRef.current?.renderInto(lastIdx, el);
            stepIdxRef.current = lastIdx;
            setStepIdx(lastIdx);
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
    if (e.key === "ArrowRight") {
      e.preventDefault();
      void goTo(stepIdxRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      void goTo(stepIdxRef.current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      const c = chainRef.current;
      const cont = containerRef.current;
      if (c && cont) {
        c.renderInto(0, cont);
        stepIdxRef.current = 0;
        setStepIdx(0);
      }
    } else if (e.key === "End") {
      e.preventDefault();
      void goTo(spec.steps.length - 1);
    }
  };

  const ariaLabel = useMemo(() => {
    if (spec.steps.length === 0) return "Formula chain";
    return `${spec.steps.length}-step formula chain: ${spec.steps[0]} to ${
      spec.steps[spec.steps.length - 1]
    }`;
  }, [spec.steps]);

  const playFromStart = useCallback(async () => {
    const c = chainRef.current;
    const cont = containerRef.current;
    if (!c || !cont) return;
    c.renderInto(0, cont);
    stepIdxRef.current = 0;
    setStepIdx(0);
    for (let i = 1; i < spec.steps.length; i++) {
      await new Promise((r) => setTimeout(r, FORMULA_TIMING.hold));
      await goTo(i);
    }
  }, [goTo, spec.steps.length]);

  const playToEnd = useCallback(async () => {
    for (let i = stepIdxRef.current + 1; i < spec.steps.length; i++) {
      await goTo(i);
      await new Promise((r) => setTimeout(r, FORMULA_TIMING.hold));
    }
  }, [goTo, spec.steps.length]);

  const isAtEnd = stepIdx >= spec.steps.length - 1;

  const totalSteps = spec.steps.length;
  const progressFraction = totalSteps > 1 ? stepIdx / (totalSteps - 1) : 0;
  const controls = (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={() => void goTo(stepIdx - 1)}
        disabled={animating || stepIdx === 0}
        aria-label="Previous step"
      >
        Prev
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={() => {
          if (animating) return;
          if (isAtEnd) {
            void playFromStart();
          } else {
            void playToEnd();
          }
        }}
        disabled={animating}
        aria-label={isAtEnd ? "Replay" : "Play"}
      >
        {isAtEnd ? "Replay" : "Play"}
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={() => void goTo(stepIdx + 1)}
        disabled={animating || isAtEnd}
        aria-label="Next step"
      >
        Next
      </button>
      <div
        className={styles.stepIndicator}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={stepIdx + 1}
      >
        <span className={styles.stepBadge}>
          <span className={styles.stepCurrent}>{stepIdx + 1}</span>
          <span className={styles.stepSep}>/</span>
          <span className={styles.stepTotal}>{totalSteps}</span>
        </span>
        <span className={styles.stepRail}>
          <span
            className={styles.stepFill}
            style={{ transform: `scaleX(${progressFraction})` }}
          />
        </span>
      </div>
    </>
  );

  if (spec.steps.length === 0) return null;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      style={{ outline: "none" }}
    >
      <FormulaCanvas title={title} caption={caption} controls={controls}>
        <div ref={containerRef} aria-hidden="true" />
      </FormulaCanvas>
    </div>
  );
}

export default FormulaChain;
