"use client";

import React, { useEffect, useRef } from "react";
import { PlayArrow, Pause, Replay } from "@mui/icons-material";
import styles from "../MathML.module.css";

export interface ScrubPhase {
  t: number;
  label: string;
  labelEs?: string;
}

interface ScrubBarProps {
  value: number;
  onChange: (t: number) => void;
  phases?: ScrubPhase[];
  lang?: string;
  durationMs?: number;
  loop?: boolean;
  accent?: string;
}

export function ScrubBar({
  value,
  onChange,
  phases = [],
  lang = "en",
  durationMs = 4200,
  loop = true,
  accent = "#10B981",
}: ScrubBarProps) {
  const [playing, setPlaying] = React.useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<{ wall: number; t0: number } | null>(null);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
      return;
    }
    startRef.current = { wall: performance.now(), t0: value >= 1 ? 0 : value };
    if (value >= 1) onChange(0);

    const tick = (now: number) => {
      const s = startRef.current;
      if (!s) return;
      const dt = (now - s.wall) / durationMs;
      const next = Math.min(1, s.t0 + dt);
      onChange(next);
      if (next >= 1) {
        if (loop) {
          startRef.current = { wall: now, t0: 0 };
          onChange(0);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setPlaying(false);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const currentPhase = (() => {
    if (phases.length === 0) return null;
    let idx = 0;
    for (let i = 0; i < phases.length; i++) {
      if (value >= phases[i].t - 1e-6) idx = i;
    }
    return phases[idx];
  })();

  const phaseLabel = currentPhase
    ? lang === "es" && currentPhase.labelEs
      ? currentPhase.labelEs
      : currentPhase.label
    : null;

  return (
    <div className={styles.scrubBar} style={{ ["--scrub-accent" as string]: accent }}>
      <button
        type="button"
        className={styles.scrubPlay}
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause fontSize="small" />
        ) : value >= 1 ? (
          <Replay fontSize="small" />
        ) : (
          <PlayArrow fontSize="small" />
        )}
      </button>

      <div className={styles.scrubTrackWrap}>
        <div className={styles.scrubTrack} aria-hidden="true">
          <div
            className={styles.scrubFill}
            style={{ width: `${value * 100}%` }}
          />
          {phases.map((p, i) => (
            <button
              key={`phase-${i}`}
              type="button"
              className={styles.scrubPhaseTick}
              style={{ left: `${p.t * 100}%` }}
              onClick={() => {
                setPlaying(false);
                onChange(p.t);
              }}
              aria-label={`Jump to ${p.label}`}
              title={lang === "es" && p.labelEs ? p.labelEs : p.label}
            />
          ))}
        </div>
        <input
          className={styles.scrubRange}
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={value}
          onChange={(e) => {
            setPlaying(false);
            onChange(Number(e.target.value));
          }}
          aria-label="Scrub timeline"
        />
      </div>

      {phaseLabel && (
        <div className={styles.scrubPhaseLabel}>
          <span className={styles.scrubPhaseDot} />
          {phaseLabel}
        </div>
      )}
    </div>
  );
}

export default ScrubBar;
