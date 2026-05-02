"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipPrevious as PrevIcon,
  SkipNext as NextIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";
import { MafsStage } from "../primitives/MafsStage";
import { buildChain } from "../formula-anim/FormulaMorphEngine";
import { useScenePlayer, type ScenePlayerState } from "./useScenePlayer";
import styles from "./MathScene.module.css";

export interface MathSceneCaption {
  text: string;
  textEs?: string;
}

/** A single phase of a curated math scene. */
export interface MathScenePhase {
  /** Phase length in milliseconds. Defaults to 2200ms when omitted. */
  duration?: number;
  /** Optional human-readable label, e.g. "Set up", "Apply A". */
  label?: string;
  labelEs?: string;
  /** Caption that fades in for this phase (locale-aware). */
  caption?: MathSceneCaption;
  /** Index into `formulaSteps` to display while this phase is active. */
  formulaStep?: number;
}

interface FigureRenderArgs {
  phaseIdx: number;
  phaseProgress: number;
  globalProgress: number;
  hasReducedMotion: boolean;
}

interface MathSceneProps {
  /** Phases that drive both the figure render and the formula chain. */
  phases: MathScenePhase[];
  /** LaTeX expressions; the engine morphs between them as phases advance. */
  formulaSteps: string[];
  /** Stepwise emphasis — same shape as FormulaChainSpec.emphasize. */
  formulaEmphasize?: Record<number, string[]>;
  /** Mafs/R3F figure renderer — receives the player state. */
  renderFigure: (args: FigureRenderArgs) => React.ReactNode;
  /** Background palette for the MafsStage. */
  accent?: "emerald" | "blue" | "violet" | "amber";
  /** Optional title shown in the scene header (when wrapped by VizFrame upstream this is usually omitted). */
  title?: string;
  titleEs?: string;
  /** Optional accessible label override. */
  ariaLabel?: string;
  /**
   * Optional stable identifier for URL-hash bookmarking. If present, transcript
   * clicks update `#scene-{id}-{phase+1}` and on mount the hash is parsed to
   * deep-link into a specific phase.
   */
  id?: string;
}

/**
 * MathScene — a Manim-style cinematic shell that synchronises a Mafs/R3F
 * figure with a morphing formula chain and a caption track.
 *
 * The scene autoplays when scrolled into view, snaps to the final phase under
 * `prefers-reduced-motion`, and provides keyboard / pointer scrub controls.
 */
export function MathScene({
  phases,
  formulaSteps,
  formulaEmphasize,
  renderFigure,
  accent = "emerald",
  ariaLabel,
  id,
}: MathSceneProps) {
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  const durations = useMemo(
    () => phases.map((p) => p.duration ?? 2200),
    [phases],
  );
  const player = useScenePlayer(phases.length, { durations });

  // ── URL-hash bookmarking ──────────────────────────────────────────────
  // On mount, if the URL hash matches `scene-{id}-{phase}`, scroll into
  // view and jump straight to that phase. We disable autoplay here by
  // calling goTo (which pauses) — the user already chose where to land.
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    const prefix = `scene-${id}-`;
    if (!hash.startsWith(prefix)) return;
    const phaseNum = parseInt(hash.slice(prefix.length), 10);
    if (!Number.isFinite(phaseNum)) return;
    const idx = Math.max(0, Math.min(phases.length - 1, phaseNum - 1));
    // Defer to the next frame so the figure container is mounted.
    const raf = requestAnimationFrame(() => {
      const el = player.containerRef.current;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      player.goTo(idx);
    });
    return () => cancelAnimationFrame(raf);
    // We intentionally only run this once on mount — deep-linking is a
    // one-shot navigation, not a sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formulaContainerRef = useRef<HTMLDivElement | null>(null);
  const chainRef = useRef<ReturnType<typeof buildChain> | null>(null);
  const lastFormulaIdxRef = useRef<number>(-1);
  const lastEmphasizeKeyRef = useRef<string>("");

  // Build the formula chain once per spec.
  useEffect(() => {
    if (formulaSteps.length === 0) return;
    chainRef.current = buildChain({
      steps: formulaSteps,
      emphasize: formulaEmphasize,
      pacing: "auto",
    });
    lastFormulaIdxRef.current = -1;
    if (formulaContainerRef.current) {
      const initialStep = phases[0]?.formulaStep ?? 0;
      chainRef.current.renderInto(initialStep, formulaContainerRef.current);
      lastFormulaIdxRef.current = initialStep;
    }
  }, [formulaSteps, formulaEmphasize, phases]);

  // Drive the formula chain from the current phase. We morph only when the
  // formula step actually changes (otherwise we'd re-render every RAF tick).
  useEffect(() => {
    const chain = chainRef.current;
    const container = formulaContainerRef.current;
    if (!chain || !container) return;
    const phase = phases[player.phaseIdx];
    if (!phase) return;
    const targetStep =
      typeof phase.formulaStep === "number"
        ? phase.formulaStep
        : Math.min(player.phaseIdx, formulaSteps.length - 1);
    const emphasizeKey =
      formulaEmphasize?.[targetStep]?.join("|") ?? "";

    if (
      targetStep === lastFormulaIdxRef.current &&
      emphasizeKey === lastEmphasizeKeyRef.current
    ) {
      return;
    }

    const fromIdx =
      lastFormulaIdxRef.current >= 0
        ? lastFormulaIdxRef.current
        : targetStep;
    lastFormulaIdxRef.current = targetStep;
    lastEmphasizeKeyRef.current = emphasizeKey;

    if (player.hasReducedMotion || fromIdx === targetStep) {
      chain.renderInto(targetStep, container);
      return;
    }
    void chain.morph(fromIdx, targetStep, container).catch(() => {
      // Fallback: hard-render if the morph blows up for any reason.
      chain.renderInto(targetStep, container);
    });
  }, [
    player.phaseIdx,
    player.hasReducedMotion,
    phases,
    formulaSteps.length,
    formulaEmphasize,
  ]);

  const phase = phases[player.phaseIdx];
  const captionText = phase?.caption
    ? lang === "es" && phase.caption.textEs
      ? phase.caption.textEs
      : phase.caption.text
    : "";
  const phaseLabel = phase
    ? lang === "es" && phase.labelEs
      ? phase.labelEs
      : phase.label
    : undefined;

  const sceneAriaLabel =
    ariaLabel ??
    `Animated mathematical scene with ${phases.length} phases and ${formulaSteps.length} formula steps`;

  const onKey: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      player.next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      player.prev();
    } else if (e.key === " " || e.key === "k" || e.key === "K") {
      e.preventDefault();
      if (player.isPlaying) player.pause();
      else player.play();
    } else if (e.key === "Home") {
      e.preventDefault();
      player.reset();
    } else if (e.key === "End") {
      e.preventDefault();
      player.goTo(phases.length - 1);
    }
  };

  return (
    <div
      ref={player.containerRef}
      className={styles.scene}
      role="img"
      aria-label={sceneAriaLabel}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <MafsStage accent={accent}>
        {renderFigure({
          phaseIdx: player.phaseIdx,
          phaseProgress: player.phaseProgress,
          globalProgress: player.globalProgress,
          hasReducedMotion: player.hasReducedMotion,
        })}
      </MafsStage>

      <div className={styles.captionBar} aria-live="polite">
        <span className={styles.captionDot} aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`cap-${player.phaseIdx}`}
            className={styles.captionText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {captionText || (phaseLabel ?? "")}
          </motion.span>
        </AnimatePresence>
        <span className={styles.captionPhase} aria-hidden="true">
          {String(player.phaseIdx + 1).padStart(2, "0")}/
          {String(phases.length).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.formulaWrap}>
        <div className={styles.formulaShell} data-formula-slot="true">
          <div className={styles.formulaSlot}>
            <div ref={formulaContainerRef} aria-hidden="true" />
          </div>

          <SceneControls
            player={player}
            phases={phases}
            lang={lang}
            sceneId={id}
          />
        </div>
      </div>
    </div>
  );
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

interface SceneControlsProps {
  player: ScenePlayerState;
  phases: MathScenePhase[];
  lang: "en" | "es";
  sceneId?: string;
}

function SceneControls({
  player,
  phases,
  lang,
  sceneId,
}: SceneControlsProps) {
  const phaseCount = phases.length;
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const playLabel = player.isAtEnd
    ? "Replay"
    : player.isPlaying
      ? "Pause"
      : "Play";

  const transcriptLabel = lang === "es" ? "Guion" : "Transcript";
  const copyLabel = lang === "es" ? "Copiar enlace" : "Copy link";
  const copiedLabel = lang === "es" ? "¡Copiado!" : "Copied!";

  const writeHash = (phase: number) => {
    if (!sceneId || typeof window === "undefined") return;
    const newHash = `#scene-${sceneId}-${phase + 1}`;
    if (window.location.hash !== newHash) {
      // Use replaceState so deep-linking does not pollute the back stack with
      // every transcript click.
      window.history.replaceState(null, "", newHash);
    }
  };

  const handleTranscriptClick = (phase: number) => {
    player.goTo(phase);
    writeHash(phase);
  };

  const handleCopyLink = async () => {
    if (!sceneId || typeof window === "undefined") return;
    const url =
      window.location.origin +
      window.location.pathname +
      `#scene-${sceneId}-${player.phaseIdx + 1}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — fall back silently; user can copy from the URL bar.
    }
  };

  return (
    <>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={player.prev}
          disabled={player.phaseIdx === 0 && player.phaseProgress === 0}
          aria-label="Previous phase"
          title="Previous (←)"
        >
          <PrevIcon fontSize="small" />
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => {
            if (player.isAtEnd) {
              player.reset();
              requestAnimationFrame(() => player.play());
              return;
            }
            if (player.isPlaying) player.pause();
            else player.play();
          }}
          aria-label={playLabel}
          title={`${playLabel} (Space)`}
        >
          {player.isAtEnd ? (
            <ReplayIcon fontSize="small" />
          ) : player.isPlaying ? (
            <PauseIcon fontSize="small" />
          ) : (
            <PlayIcon fontSize="small" />
          )}
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={player.next}
          disabled={player.phaseIdx >= phaseCount - 1}
          aria-label="Next phase"
          title="Next (→)"
        >
          <NextIcon fontSize="small" />
        </button>

        <div className={styles.scrubWrap}>
          <span className={styles.stepBadge}>
            <span className={styles.stepCurrent}>{player.phaseIdx + 1}</span>
            <span className={styles.stepSep}>/</span>
            <span className={styles.stepTotal}>{phaseCount}</span>
          </span>
          <div className={styles.scrubRail}>
            <div
              className={styles.scrubFill}
              style={{ width: `${player.globalProgress * 100}%` }}
            />
            <div className={styles.scrubMarkers} aria-hidden="true">
              {Array.from({ length: phaseCount }).map((_, i) => (
                <span
                  key={i}
                  className={`${styles.scrubMarker} ${i <= player.phaseIdx ? styles.scrubMarkerActive : ""}`}
                  style={{ left: `${(i / Math.max(phaseCount - 1, 1)) * 100}%` }}
                />
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={player.globalProgress * 100}
              onChange={(e) =>
                player.scrubGlobal(parseFloat(e.target.value) / 100)
              }
              className={styles.scrubInput}
              aria-label="Scrub through the scene"
            />
          </div>
        </div>

        <div
          className={styles.speedGroup}
          role="group"
          aria-label="Playback speed"
        >
          {SPEED_OPTIONS.map((s) => {
            const active = Math.abs(player.speed - s) < 0.01;
            return (
              <button
                key={s}
                type="button"
                className={`${styles.speedBtn} ${active ? styles.speedBtnActive : ""}`}
                onClick={() => player.setSpeed(s)}
                aria-pressed={active}
                aria-label={`${s}× playback speed`}
                title={`${s}× speed`}
              >
                {s}×
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.transcriptToggle}
          onClick={() => setTranscriptOpen((v) => !v)}
          aria-expanded={transcriptOpen}
          aria-controls="math-scene-transcript"
        >
          {transcriptLabel}
          <span
            className={`${styles.transcriptChevron} ${
              transcriptOpen ? styles.transcriptChevronOpen : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {sceneId && (
          <button
            type="button"
            className={`${styles.transcriptToggle} ${copied ? styles.copyBtnCopied : ""}`}
            onClick={handleCopyLink}
            aria-label={
              copied
                ? copiedLabel
                : `${copyLabel} — phase ${player.phaseIdx + 1}`
            }
            title={`${copyLabel} (#scene-${sceneId}-${player.phaseIdx + 1})`}
          >
            <span aria-hidden="true">{copied ? "✓" : "🔗"}</span>
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {transcriptOpen && (
          <motion.div
            id="math-scene-transcript"
            className={styles.transcript}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {phases.map((p, i) => {
              const captionText = p.caption
                ? lang === "es" && p.caption.textEs
                  ? p.caption.textEs
                  : p.caption.text
                : "";
              const labelText =
                lang === "es" && p.labelEs ? p.labelEs : p.label;
              const active = i === player.phaseIdx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTranscriptClick(i)}
                  className={`${styles.transcriptItem} ${active ? styles.transcriptItemActive : ""}`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className={styles.transcriptIdx}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.transcriptText}>
                    {labelText && (
                      <span className={styles.transcriptLabel}>
                        {labelText}
                      </span>
                    )}
                    {captionText}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MathScene;
