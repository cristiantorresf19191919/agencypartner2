"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";

export interface ScenePlayerOptions {
  /** Per-phase durations; the hook uses `defaultDuration` for any missing entry. */
  durations?: number[];
  /** Default phase duration in ms; used when `durations[i]` is missing. */
  defaultDuration?: number;
  /** When true, the player auto-advances on first scroll-in. */
  autoPlayOnIntersect?: boolean;
  /** Threshold for the IntersectionObserver. */
  intersectionThreshold?: number;
}

export interface ScenePlayerState {
  /** Element to attach to the scene root — drives autoplay-on-scroll. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Index of the phase currently rendered. */
  phaseIdx: number;
  /** 0..1 progress *within* the current phase. */
  phaseProgress: number;
  /** 0..1 progress across the whole scene. */
  globalProgress: number;
  isPlaying: boolean;
  hasReducedMotion: boolean;
  isAtEnd: boolean;
  /** Playback speed multiplier (1 = real time). */
  speed: number;
  /** Set the playback speed; if currently playing, the in-flight animation restarts at the new speed. */
  setSpeed: (s: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  goTo: (idx: number) => void;
  /** Direct scrub: 0..1 across the whole scene. */
  scrubGlobal: (g: number) => void;
}

const DEFAULT_PHASE_MS = 2200;

/**
 * Phase-driven scene player.
 *
 * Each phase animates a single number 0 → 1 with framer-motion's `animate()`.
 * That keeps the loop off React's reconciler — only `phaseProgress` updates
 * via setState, and only at the cadence we ask for. When a phase finishes the
 * hook bumps `phaseIdx` and kicks off the next animation. Pause / scrub /
 * goTo all stop the in-flight animation cleanly.
 *
 * Autoplays once when the container scrolls into view; reduced motion snaps
 * straight to the final phase.
 */
export function useScenePlayer(
  phaseCount: number,
  opts: ScenePlayerOptions = {},
): ScenePlayerState {
  const {
    durations,
    defaultDuration = DEFAULT_PHASE_MS,
    autoPlayOnIntersect = true,
    intersectionThreshold = 0.25,
  } = opts;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const [speed, setSpeedState] = useState(1);

  const playedOnceRef = useRef(false);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const phaseIdxRef = useRef(0);
  const phaseProgressRef = useRef(0);
  const speedRef = useRef(1);

  const phaseDurations = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < phaseCount; i++) {
      out.push(durations?.[i] ?? defaultDuration);
    }
    return out;
  }, [phaseCount, durations, defaultDuration]);

  // Reduced motion detection — mount-only is fine for a one-shot scene.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const stopAnim = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  }, []);

  // Animate a single phase from `start` (within that phase) to 1, then chain.
  // Pulled out so play(), goTo(), and scrub() can all use the same path.
  const runPhase = useCallback(
    (idx: number, startProgress: number) => {
      if (idx >= phaseCount) {
        setIsPlaying(false);
        return;
      }
      const baseDuration = phaseDurations[idx] ?? defaultDuration;
      const duration = baseDuration / Math.max(0.1, speedRef.current);
      const remaining = Math.max(
        0,
        (1 - startProgress) * duration,
      );

      // Sync state to phase start.
      phaseIdxRef.current = idx;
      phaseProgressRef.current = startProgress;
      setPhaseIdx(idx);
      setPhaseProgress(startProgress);

      stopAnim();

      if (remaining <= 0) {
        // Already complete — advance immediately if not the last phase.
        if (idx < phaseCount - 1) {
          runPhase(idx + 1, 0);
        } else {
          setIsPlaying(false);
        }
        return;
      }

      animationRef.current = animate(startProgress, 1, {
        duration: remaining / 1000,
        ease: "linear",
        onUpdate: (v) => {
          phaseProgressRef.current = v;
          setPhaseProgress(v);
        },
        onComplete: () => {
          phaseProgressRef.current = 1;
          setPhaseProgress(1);
          if (idx < phaseCount - 1) {
            runPhase(idx + 1, 0);
          } else {
            setIsPlaying(false);
          }
        },
      });
    },
    [phaseCount, phaseDurations, defaultDuration, stopAnim],
  );

  const play = useCallback(() => {
    if (phaseCount === 0) return;
    setIsPlaying(true);
    const startIdx =
      phaseIdxRef.current >= phaseCount - 1 && phaseProgressRef.current >= 1
        ? 0
        : phaseIdxRef.current;
    const startProgress =
      phaseIdxRef.current >= phaseCount - 1 && phaseProgressRef.current >= 1
        ? 0
        : phaseProgressRef.current;
    runPhase(startIdx, startProgress);
  }, [phaseCount, runPhase]);

  const pause = useCallback(() => {
    stopAnim();
    setIsPlaying(false);
  }, [stopAnim]);

  const reset = useCallback(() => {
    stopAnim();
    setIsPlaying(false);
    phaseIdxRef.current = 0;
    phaseProgressRef.current = 0;
    setPhaseIdx(0);
    setPhaseProgress(0);
  }, [stopAnim]);

  const goTo = useCallback(
    (idx: number) => {
      stopAnim();
      setIsPlaying(false);
      const clamped = Math.max(0, Math.min(phaseCount - 1, idx));
      phaseIdxRef.current = clamped;
      phaseProgressRef.current = 0;
      setPhaseIdx(clamped);
      setPhaseProgress(0);
    },
    [phaseCount, stopAnim],
  );

  const next = useCallback(() => {
    if (phaseIdxRef.current >= phaseCount - 1) return;
    goTo(phaseIdxRef.current + 1);
  }, [phaseCount, goTo]);

  const prev = useCallback(() => {
    if (phaseIdxRef.current === 0 && phaseProgressRef.current === 0) return;
    goTo(Math.max(0, phaseIdxRef.current - 1));
  }, [phaseCount, goTo]);

  const setSpeed = useCallback(
    (s: number) => {
      const next = Math.max(0.25, Math.min(4, s));
      speedRef.current = next;
      setSpeedState(next);
      // If currently playing, restart the current phase at the new rate so it
      // doesn't finish at stale timing.
      if (animationRef.current) {
        runPhase(phaseIdxRef.current, phaseProgressRef.current);
      }
    },
    [runPhase],
  );

  const scrubGlobal = useCallback(
    (g: number) => {
      stopAnim();
      setIsPlaying(false);
      const clamped = Math.max(0, Math.min(1, g));
      const total =
        phaseDurations.reduce((s, d) => s + d, 0) || 1;
      const targetMs = clamped * total;
      let acc = 0;
      for (let i = 0; i < phaseCount; i++) {
        const dur = phaseDurations[i];
        if (targetMs <= acc + dur || i === phaseCount - 1) {
          const localProgress = Math.max(0, Math.min(1, (targetMs - acc) / dur));
          phaseIdxRef.current = i;
          phaseProgressRef.current = localProgress;
          setPhaseIdx(i);
          setPhaseProgress(localProgress);
          return;
        }
        acc += dur;
      }
    },
    [phaseDurations, phaseCount, stopAnim],
  );

  // Autoplay-on-scroll. Stable deps (no `play` in deps) so the observer is
  // created exactly once per scene mount — using refs to read latest state.
  useEffect(() => {
    if (!autoPlayOnIntersect) return;
    const el = containerRef.current;
    if (!el || phaseCount === 0) return;
    if (playedOnceRef.current) return;

    if (hasReducedMotion) {
      playedOnceRef.current = true;
      phaseIdxRef.current = phaseCount - 1;
      phaseProgressRef.current = 1;
      setPhaseIdx(phaseCount - 1);
      setPhaseProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || playedOnceRef.current) continue;
          playedOnceRef.current = true;
          observer.disconnect();
          play();
          return;
        }
      },
      { threshold: intersectionThreshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play is intentionally
    // omitted; capturing it would re-create the observer on every progress tick.
  }, [
    autoPlayOnIntersect,
    intersectionThreshold,
    phaseCount,
    hasReducedMotion,
  ]);

  // Cancel any in-flight animation on unmount.
  useEffect(() => {
    return () => {
      stopAnim();
    };
  }, [stopAnim]);

  const totalMs = useMemo(
    () => phaseDurations.reduce((s, d) => s + d, 0) || 1,
    [phaseDurations],
  );
  const elapsedMs = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < phaseIdx; i++) acc += phaseDurations[i];
    acc += phaseProgress * (phaseDurations[phaseIdx] ?? 0);
    return acc;
  }, [phaseDurations, phaseIdx, phaseProgress]);

  const globalProgress = totalMs > 0 ? elapsedMs / totalMs : 0;
  const isAtEnd = phaseIdx >= phaseCount - 1 && phaseProgress >= 1;

  return {
    containerRef,
    phaseIdx,
    phaseProgress,
    globalProgress,
    isPlaying,
    hasReducedMotion,
    isAtEnd,
    speed,
    setSpeed,
    play,
    pause,
    next,
    prev,
    reset,
    goTo,
    scrubGlobal,
  };
}
