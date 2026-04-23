"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AutoStoriesRounded as BookIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  RestartAltRounded as RestartIcon,
} from "@mui/icons-material";
import type { VisualProofSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

interface Props {
  spec: VisualProofSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

const SVG_W = 520;
const SVG_H = 300;
const CX = SVG_W / 2;
const CY = SVG_H / 2;

export function VisualProof({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const DURATION_MS = 5000;

  const tick = (ts: number) => {
    if (lastTsRef.current === null) lastTsRef.current = ts;
    const dt = ts - lastTsRef.current;
    lastTsRef.current = ts;
    setT((prev) => {
      const next = prev + dt / DURATION_MS;
      if (next >= 1) {
        setPlaying(false);
        return 1;
      }
      rafRef.current = requestAnimationFrame(tick);
      return next;
    });
  };

  useEffect(() => {
    if (playing) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const togglePlay = () => {
    if (t >= 1) setT(0);
    setPlaying((p) => !p);
  };

  const restart = () => {
    setT(0);
    setPlaying(false);
  };

  // Find the currently-active caption step
  const activeStep =
    [...spec.steps].reverse().find((s) => t >= s.at) ?? spec.steps[0];
  const activeCaption = pick(lang, activeStep.captionEs, activeStep.caption);

  const title = pick(lang, spec.titleEs, spec.title);
  const theorem = pick(lang, spec.theoremEs, spec.theorem);

  return (
    <section className={styles.visualProof}>
      <div className={styles.visualProofHead}>
        <div className={styles.visualProofIcon}>
          <BookIcon fontSize="small" />
        </div>
        <div className={styles.visualProofHeadText}>
          <span className={styles.visualProofTag}>
            {lang === "es" ? "Demostración visual" : "Visual proof"}
          </span>
          <div className={styles.visualProofTitle}>{title}</div>
          <MathContent
            text={theorem}
            as="div"
            className={styles.visualProofTheorem}
          />
        </div>
      </div>

      <div className={styles.visualProofStage}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className={styles.visualProofSvg}
          aria-hidden="true"
        >
          {spec.kind === "orthogonal-preserves-length" && (
            <OrthogonalPreservesLengthProof t={t} />
          )}
          {spec.kind === "pythagorean" && <PythagoreanProof t={t} />}
          {spec.kind === "dot-product-projection" && (
            <DotProductProjectionProof t={t} />
          )}
          {spec.kind === "eigenvectors-stay-on-line" && (
            <EigenvectorsStayOnLineProof t={t} />
          )}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.at}
          className={styles.visualProofCaption}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <MathContent text={activeCaption} as="span" />
        </motion.div>
      </AnimatePresence>

      <div className={styles.visualProofControls}>
        <button
          type="button"
          className={styles.visualProofPlayBtn}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <PauseIcon fontSize="small" />
          ) : (
            <PlayIcon fontSize="small" />
          )}
        </button>
        <div className={styles.visualProofTrackWrap}>
          <div className={styles.visualProofTrack}>
            <div
              className={styles.visualProofFill}
              style={{ width: `${(t * 100).toFixed(1)}%` }}
            />
            {spec.steps.map((s, i) => (
              <button
                key={`tick-${i}`}
                type="button"
                aria-label={`Step ${i + 1}`}
                className={styles.visualProofTick}
                style={{ left: `${s.at * 100}%` }}
                onClick={() => setT(s.at)}
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={t}
            onChange={(e) => setT(parseFloat(e.target.value))}
            className={styles.visualProofRange}
            aria-label="Scrub proof"
          />
        </div>
        <button
          type="button"
          className={styles.visualProofRestart}
          onClick={restart}
          aria-label="Restart"
        >
          <RestartIcon fontSize="small" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Proof templates                                                     */
/* ------------------------------------------------------------------ */

function OrthogonalPreservesLengthProof({ t }: { t: number }) {
  // Rotate a ruler around origin; its length stays constant.
  const angle = t * Math.PI * 1.5;
  const len = 140;
  const x1 = CX - len / 2;
  const y1 = CY;
  const x2 = CX + len / 2;
  const y2 = CY;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rx1 = CX + (x1 - CX) * cos - (y1 - CY) * sin;
  const ry1 = CY + (x1 - CX) * sin + (y1 - CY) * cos;
  const rx2 = CX + (x2 - CX) * cos - (y2 - CY) * sin;
  const ry2 = CY + (x2 - CX) * sin + (y2 - CY) * cos;
  return (
    <>
      <GridBack />
      <circle
        cx={CX}
        cy={CY}
        r={len / 2 + 6}
        fill="none"
        stroke="rgba(148,163,184,0.22)"
        strokeDasharray="3 4"
      />
      <motion.line
        x1={rx1}
        y1={ry1}
        x2={rx2}
        y2={ry2}
        stroke="#34D399"
        strokeWidth={6}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(52,211,153,0.6))" }}
      />
      <circle cx={rx1} cy={ry1} r={5} fill="#60A5FA" />
      <circle cx={rx2} cy={ry2} r={5} fill="#FBBF24" />
      <text
        x={CX}
        y={CY + len / 2 + 30}
        fill="#6EE7B7"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={14}
        textAnchor="middle"
      >
        |v| = {(len / 2 - 70 + 140) / 140 * 5} (constant as Q rotates)
      </text>
    </>
  );
}

function PythagoreanProof({ t }: { t: number }) {
  // Classic a²+b²=c². Animate 3 smaller squares assembling into the hypotenuse square.
  const a = 60;
  const b = 80;
  const c = Math.sqrt(a * a + b * b);
  const triX = CX - 90;
  const triY = CY + 60;
  const ease = (x: number) => 1 - Math.pow(1 - x, 2);
  const p = ease(t);
  // Square on a (drops in)
  const aSquareY = triY - a - (1 - p) * 80;
  // Square on b (drops in later)
  const bP = ease(Math.max(0, (t - 0.2) / 0.8));
  const bSquareX = triX + a + (1 - bP) * 100;
  // Hypotenuse square (fades in)
  const cP = ease(Math.max(0, (t - 0.6) / 0.4));
  return (
    <>
      <GridBack />
      {/* Triangle */}
      <polygon
        points={`${triX},${triY} ${triX + a},${triY} ${triX + a},${triY - b}`}
        fill="rgba(52,211,153,0.1)"
        stroke="#34D399"
        strokeWidth={2}
      />
      {/* a² */}
      <rect
        x={triX}
        y={aSquareY}
        width={a}
        height={a}
        fill="rgba(96,165,250,0.18)"
        stroke="#60A5FA"
        strokeWidth={2}
        opacity={p * 0.9 + 0.1}
      />
      <text
        x={triX + a / 2}
        y={aSquareY + a / 2}
        fill="#BFDBFE"
        fontFamily="KaTeX_Math, serif"
        fontSize={18}
        fontStyle="italic"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        a²
      </text>
      {/* b² */}
      <rect
        x={bSquareX}
        y={triY - b}
        width={b}
        height={b}
        fill="rgba(251,191,36,0.18)"
        stroke="#FBBF24"
        strokeWidth={2}
        opacity={bP * 0.9 + 0.1}
      />
      <text
        x={bSquareX + b / 2}
        y={triY - b / 2}
        fill="#FDE68A"
        fontFamily="KaTeX_Math, serif"
        fontSize={18}
        fontStyle="italic"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        b²
      </text>
      {/* c² along hypotenuse */}
      {cP > 0.05 && (
        <g opacity={cP}>
          {(() => {
            const theta = Math.atan2(-b, a); // hypotenuse angle
            const hx = triX;
            const hy = triY;
            const dx = Math.cos(theta) * c;
            const dy = Math.sin(theta) * c;
            // The square sits on the hypotenuse, on the opposite side of the triangle.
            const px = Math.sin(theta);
            const py = -Math.cos(theta);
            const pts = [
              [hx, hy],
              [hx + dx, hy + dy],
              [hx + dx + px * c, hy + dy + py * c],
              [hx + px * c, hy + py * c],
            ];
            return (
              <>
                <polygon
                  points={pts.map((p) => p.join(",")).join(" ")}
                  fill="rgba(196,181,253,0.2)"
                  stroke="#C4B5FD"
                  strokeWidth={2}
                />
                <text
                  x={(pts[0][0] + pts[2][0]) / 2}
                  y={(pts[0][1] + pts[2][1]) / 2}
                  fill="#DDD6FE"
                  fontFamily="KaTeX_Math, serif"
                  fontSize={18}
                  fontStyle="italic"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  c²
                </text>
              </>
            );
          })()}
        </g>
      )}
    </>
  );
}

function DotProductProjectionProof({ t }: { t: number }) {
  // Two vectors u, v. Project v onto u with a sliding angle that reveals cos.
  const theta = (1 - t) * (Math.PI / 3) + 0.02;
  const u = { x: 130, y: 0 };
  const v = {
    x: 110 * Math.cos(theta),
    y: -110 * Math.sin(theta),
  };
  const origin = { x: CX - 60, y: CY + 40 };
  const projLen = (v.x * u.x + v.y * u.y) / Math.hypot(u.x, u.y);
  const projEnd = {
    x: origin.x + (u.x / Math.hypot(u.x, u.y)) * projLen,
    y: origin.y + (u.y / Math.hypot(u.x, u.y)) * projLen,
  };
  return (
    <>
      <GridBack />
      {/* u */}
      <line
        x1={origin.x}
        y1={origin.y}
        x2={origin.x + u.x}
        y2={origin.y + u.y}
        stroke="#34D399"
        strokeWidth={5}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.5))" }}
      />
      <text
        x={origin.x + u.x + 10}
        y={origin.y + u.y + 4}
        fill="#6EE7B7"
        fontFamily="KaTeX_Math, serif"
        fontSize={18}
        fontStyle="italic"
      >
        u
      </text>
      {/* v */}
      <line
        x1={origin.x}
        y1={origin.y}
        x2={origin.x + v.x}
        y2={origin.y + v.y}
        stroke="#60A5FA"
        strokeWidth={5}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(96,165,250,0.5))" }}
      />
      <text
        x={origin.x + v.x - 12}
        y={origin.y + v.y - 6}
        fill="#BFDBFE"
        fontFamily="KaTeX_Math, serif"
        fontSize={18}
        fontStyle="italic"
      >
        v
      </text>
      {/* projection drop line */}
      <line
        x1={origin.x + v.x}
        y1={origin.y + v.y}
        x2={projEnd.x}
        y2={projEnd.y}
        stroke="#FBBF24"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
      {/* projected length (highlight on u) */}
      <line
        x1={origin.x}
        y1={origin.y}
        x2={projEnd.x}
        y2={projEnd.y}
        stroke="#FBBF24"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.9}
        style={{ filter: "drop-shadow(0 0 6px rgba(251,191,36,0.5))" }}
      />
      {/* angle arc */}
      <path
        d={`M ${origin.x + 22} ${origin.y} A 22 22 0 0 0 ${
          origin.x + 22 * Math.cos(theta)
        } ${origin.y - 22 * Math.sin(theta)}`}
        stroke="#C4B5FD"
        strokeWidth={1.5}
        fill="none"
      />
      <text
        x={origin.x + 32}
        y={origin.y - 12}
        fill="#DDD6FE"
        fontFamily="KaTeX_Math, serif"
        fontSize={13}
      >
        θ = {(theta * (180 / Math.PI)).toFixed(0)}°
      </text>
      <text
        x={origin.x + u.x / 2}
        y={origin.y + 40}
        fill="#FDE68A"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={12}
        textAnchor="middle"
      >
        u · v = |u||v|cos θ = {(u.x * v.x + u.y * v.y).toFixed(0)}
      </text>
    </>
  );
}

function EigenvectorsStayOnLineProof({ t }: { t: number }) {
  // A symmetric 2x2 applied to unit circle: two eigendirections remain on their lines.
  // A = [[3,0],[0,2]]
  const a = 3;
  const d = 2;
  const r = 60;
  const scale = 1 + t * 1.2;
  const sa = 1 + t * (a - 1);
  const sd = 1 + t * (d - 1);
  // Circle → ellipse
  const pts = Array.from({ length: 60 }, (_, i) => {
    const ang = (i / 60) * Math.PI * 2;
    return [CX + sa * r * Math.cos(ang), CY + sd * r * Math.sin(ang)];
  });
  const circlePts = Array.from({ length: 60 }, (_, i) => {
    const ang = (i / 60) * Math.PI * 2;
    return [CX + r * Math.cos(ang), CY + r * Math.sin(ang)];
  });
  return (
    <>
      <GridBack />
      {/* Axes */}
      <line
        x1={CX - r * 2.2}
        y1={CY}
        x2={CX + r * 2.2}
        y2={CY}
        stroke="rgba(148,163,184,0.25)"
      />
      <line
        x1={CX}
        y1={CY - r * 2.2}
        x2={CX}
        y2={CY + r * 2.2}
        stroke="rgba(148,163,184,0.25)"
      />
      {/* Original circle */}
      <polyline
        points={circlePts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="rgba(148,163,184,0.35)"
        strokeDasharray="3 4"
      />
      {/* Morphed ellipse */}
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#34D399"
        strokeWidth={3}
        style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.45))" }}
      />
      {/* Eigenvector e1 = (1,0) */}
      <line
        x1={CX}
        y1={CY}
        x2={CX + sa * r * 1.1}
        y2={CY}
        stroke="#FBBF24"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <text
        x={CX + sa * r * 1.15}
        y={CY + 6}
        fill="#FDE68A"
        fontFamily="KaTeX_Math, serif"
        fontSize={16}
        fontStyle="italic"
      >
        λ₁ = {a}
      </text>
      {/* Eigenvector e2 = (0,1) */}
      <line
        x1={CX}
        y1={CY}
        x2={CX}
        y2={CY - sd * r * 1.1}
        stroke="#60A5FA"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <text
        x={CX + 10}
        y={CY - sd * r * 1.1}
        fill="#BFDBFE"
        fontFamily="KaTeX_Math, serif"
        fontSize={16}
        fontStyle="italic"
      >
        λ₂ = {d}
      </text>
    </>
  );
}

function GridBack() {
  return (
    <>
      <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="transparent" />
      {Array.from({ length: 21 }).map((_, i) => (
        <line
          key={`gx-${i}`}
          x1={(SVG_W * i) / 20}
          y1={0}
          x2={(SVG_W * i) / 20}
          y2={SVG_H}
          stroke="rgba(148,163,184,0.06)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line
          key={`gy-${i}`}
          x1={0}
          y1={(SVG_H * i) / 12}
          x2={SVG_W}
          y2={(SVG_H * i) / 12}
          stroke="rgba(148,163,184,0.06)"
          strokeWidth={1}
        />
      ))}
    </>
  );
}

export default VisualProof;
