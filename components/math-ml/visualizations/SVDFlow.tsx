"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Grid, Html } from "@react-three/drei";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrubBar, type ScrubPhase } from "../primitives/ScrubBar";
import { CinematicEffects } from "../primitives/CinematicEffects";
import { useVizFullscreen } from "../primitives/VizFullscreenContext";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

const EMERALD = "#10B981";
const EMERALD_BRIGHT = "#34D399";
const AMBER = "#FBBF24";
const BLUE = "#60A5FA";
const VIOLET = "#C4B5FD";
const FAINT = "#475569";
const PINK = "#F472B6";

type Vec2 = [number, number];

interface SVDFlowConfig {
  matrix?: number[][];
  autoPlay?: boolean;
}

interface Props {
  config: Record<string, unknown>;
}

interface SVDResult {
  U: number[][];
  sigma: [number, number];
  V: number[][];
  thetaV: number;
  thetaU: number;
}

function svd2x2(A: number[][]): SVDResult {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];

  // AᵀA
  const p = a * a + c * c;
  const q = a * b + c * d;
  const r = b * b + d * d;

  const tr = p + r;
  const det = p * r - q * q;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + disc;
  const l2 = Math.max(0, tr / 2 - disc);

  const s1 = Math.sqrt(l1);
  const s2 = Math.sqrt(l2);

  let v1x: number;
  let v1y: number;
  if (Math.abs(q) > 1e-10) {
    v1x = q;
    v1y = l1 - p;
  } else if (p >= r) {
    v1x = 1;
    v1y = 0;
  } else {
    v1x = 0;
    v1y = 1;
  }
  const vn = Math.hypot(v1x, v1y) || 1;
  v1x /= vn;
  v1y /= vn;
  const v2x = -v1y;
  const v2y = v1x;

  const V = [
    [v1x, v2x],
    [v1y, v2y],
  ];

  const safeS1 = s1 || 1;
  const safeS2 = s2 || 1;
  let u1x = (a * v1x + b * v1y) / safeS1;
  let u1y = (c * v1x + d * v1y) / safeS1;
  let u2x = (a * v2x + b * v2y) / safeS2;
  let u2y = (c * v2x + d * v2y) / safeS2;
  const u1n = Math.hypot(u1x, u1y) || 1;
  const u2n = Math.hypot(u2x, u2y) || 1;
  u1x /= u1n;
  u1y /= u1n;
  u2x /= u2n;
  u2y /= u2n;

  const U = [
    [u1x, u2x],
    [u1y, u2y],
  ];

  return {
    U,
    sigma: [s1, s2],
    V,
    thetaV: Math.atan2(v1y, v1x),
    thetaU: Math.atan2(u1y, u1x),
  };
}

function rot2(theta: number): number[][] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s],
    [s, c],
  ];
}

function mul2(A: number[][], B: number[][]): number[][] {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

function apply2(M: number[][], v: Vec2): Vec2 {
  return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
}

function effectiveMatrix(
  t: number,
  thetaV: number,
  s1: number,
  s2: number,
  thetaU: number,
): number[][] {
  const p1 = Math.min(1, Math.max(0, t * 3));
  const p2 = Math.min(1, Math.max(0, (t - 1 / 3) * 3));
  const p3 = Math.min(1, Math.max(0, (t - 2 / 3) * 3));

  const rVt = rot2(-thetaV * p1);
  const sX = 1 + p2 * (s1 - 1);
  const sY = 1 + p2 * (s2 - 1);
  const S = [
    [sX, 0],
    [0, sY],
  ];
  const rU = rot2(thetaU * p3);

  return mul2(rU, mul2(S, rVt));
}

function makeCircle(n: number, radius = 1): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
  }
  return pts;
}

function to3d(pts: Vec2[], z = 0): [number, number, number][] {
  return pts.map((p) => [p[0], p[1], z]);
}

function ArrowInstance({
  tip,
  color,
  label,
  labelOffset = 0.25,
}: {
  tip: [number, number, number];
  color: string;
  label?: string;
  labelOffset?: number;
}) {
  const [x, y, z] = tip;
  const len = Math.hypot(x, y, z);
  if (len < 1e-4) return null;
  const points: [number, number, number][] = [
    [0, 0, 0],
    [x, y, z],
  ];
  const nx = x / len;
  const ny = y / len;
  const labelPos: [number, number, number] = [
    x + nx * labelOffset,
    y + ny * labelOffset,
    z,
  ];
  return (
    <group>
      <Line points={points} color={color} lineWidth={5} transparent opacity={0.25} />
      <Line points={points} color={color} lineWidth={3} />
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {label && (
        <Html position={labelPos} center style={{ pointerEvents: "none" }}>
          <span
            style={{
              color,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              fontWeight: 700,
              textShadow: "0 0 8px rgba(2,6,23,0.9), 0 0 2px rgba(2,6,23,1)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

function PhaseCaption({
  t,
  lang,
  sigma,
}: {
  t: number;
  lang: string;
  sigma: [number, number];
}) {
  let latex: string;
  let headingEn: string;
  let headingEs: string;

  if (t < 1e-3) {
    latex = "I\\,\\mathbf{x}";
    headingEn = "Input — unit circle";
    headingEs = "Entrada — círculo unitario";
  } else if (t < 1 / 3 + 1e-3) {
    latex = "V^\\top\\mathbf{x}";
    headingEn = "Rotate into principal axes";
    headingEs = "Rotación hacia los ejes principales";
  } else if (t < 2 / 3 + 1e-3) {
    latex = `\\Sigma V^\\top\\mathbf{x}\\;\\; (\\sigma_1=${sigma[0].toFixed(
      2,
    )},\\;\\sigma_2=${sigma[1].toFixed(2)})`;
    headingEn = "Stretch along singular axes";
    headingEs = "Estiramiento a lo largo de los ejes singulares";
  } else {
    latex = "U\\Sigma V^\\top\\mathbf{x} = A\\mathbf{x}";
    headingEn = "Rotate into output space";
    headingEs = "Rotación hacia el espacio de salida";
  }

  return (
    <div className={styles.vizCaption}>
      <div className={styles.vizCaptionHead}>
        {lang === "es" ? headingEs : headingEn}
      </div>
      <MathContent text={`$${latex}$`} as="div" />
    </div>
  );
}

export default function SVDFlow({ config }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const isFullscreen = useVizFullscreen();
  const cfg = (config ?? {}) as SVDFlowConfig;
  const A = cfg.matrix ?? [
    [2, 1],
    [1, 2],
  ];

  const svd = useMemo(() => svd2x2(A), [A]);
  const [t, setT] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const circle = useMemo(() => makeCircle(96), []);
  const M = useMemo(
    () => effectiveMatrix(t, svd.thetaV, svd.sigma[0], svd.sigma[1], svd.thetaU),
    [t, svd],
  );

  const transformedCircle = useMemo(
    () => to3d(circle.map((p) => apply2(M, p)), 0.001),
    [circle, M],
  );

  // Ghost trails — three earlier t-samples, fading in opacity
  const trails = useMemo(() => {
    if (t < 0.02) return [] as { points: [number, number, number][]; opacity: number }[];
    const samples = [0.18, 0.36, 0.6].map((r) => Math.max(0, t - r * 0.4));
    return samples.map((tt, idx) => {
      const Mt = effectiveMatrix(
        tt,
        svd.thetaV,
        svd.sigma[0],
        svd.sigma[1],
        svd.thetaU,
      );
      const pts = to3d(circle.map((p) => apply2(Mt, p)), -0.002 - idx * 0.001);
      return { points: pts, opacity: 0.08 + idx * 0.04 };
    });
  }, [t, circle, svd]);

  // Background particle positions (static, seeded deterministic)
  const particles = useMemo(() => {
    const pts: [number, number, number][] = [];
    let seed = 1;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 80; i++) {
      const r = 3 + rnd() * 3;
      const a = rnd() * Math.PI * 2;
      pts.push([Math.cos(a) * r, Math.sin(a) * r, -0.5 - rnd() * 2]);
    }
    return pts;
  }, []);

  const originalCircle = useMemo(() => to3d(circle, 0), [circle]);

  const e1Tip = apply2(M, [1, 0]);
  const e2Tip = apply2(M, [0, 1]);

  const sigmaAxisA = useMemo(() => apply2(M, [1, 0]), [M]);
  const sigmaAxisB = useMemo(() => apply2(M, [0, 1]), [M]);
  const showSigmaLabels = t > 0.35;

  const phases: ScrubPhase[] = [
    { t: 0, label: "Input", labelEs: "Entrada" },
    { t: 1 / 3, label: "Vᵀ rotate", labelEs: "Rotación Vᵀ" },
    { t: 2 / 3, label: "Σ stretch", labelEs: "Estiramiento Σ" },
    { t: 1, label: "U rotate → A", labelEs: "Rotación U → A" },
  ];

  return (
    <div className={`${styles.svdFlowWrap} ${isFullscreen ? styles.svdFlowWrapFullscreen : ""}`}>
      <div className={`${styles.svdCanvasWrap} ${isFullscreen ? styles.svdCanvasWrapFullscreen : ""}`}>
        {mounted && (
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 42, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: 0, preserveDrawingBuffer: false, alpha: false }}
          flat
        >
          <color attach="background" args={["#060b1a"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 6]} intensity={0.8} />

          <Grid
            args={[12, 12]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#1E293B"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#334155"
            fadeDistance={14}
            fadeStrength={1.2}
            infiniteGrid={false}
            position={[0, 0, -0.01]}
            rotation={[-Math.PI / 2, 0, 0]}
          />

          <Line
            points={[
              [-5, 0, 0],
              [5, 0, 0],
            ]}
            color="#334155"
            lineWidth={1}
            transparent
            opacity={0.7}
          />
          <Line
            points={[
              [0, -5, 0],
              [0, 5, 0],
            ]}
            color="#334155"
            lineWidth={1}
            transparent
            opacity={0.7}
          />

          {/* Ambient particle field */}
          {particles.map((p, i) => (
            <mesh key={`particle-${i}`} position={p}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial
                color="#1E3A8A"
                toneMapped={false}
                transparent
                opacity={0.55}
              />
            </mesh>
          ))}

          <Line
            points={originalCircle}
            color={FAINT}
            lineWidth={1}
            transparent
            opacity={0.45}
            dashed
            dashSize={0.15}
            gapSize={0.1}
          />

          {/* Motion trails */}
          {trails.map((tr, i) => (
            <Line
              key={`trail-${i}`}
              points={tr.points}
              color={EMERALD_BRIGHT}
              lineWidth={2}
              transparent
              opacity={tr.opacity}
            />
          ))}

          {/* Outer halo + main stroke */}
          <Line
            points={transformedCircle}
            color={EMERALD_BRIGHT}
            lineWidth={10}
            transparent
            opacity={0.12}
          />
          <Line
            points={transformedCircle}
            color={EMERALD_BRIGHT}
            lineWidth={6}
            transparent
            opacity={0.28}
          />
          <Line points={transformedCircle} color={EMERALD_BRIGHT} lineWidth={3.2} />

          <ArrowInstance tip={[e1Tip[0], e1Tip[1], 0]} color={AMBER} label="e₁" />
          <ArrowInstance tip={[e2Tip[0], e2Tip[1], 0]} color={BLUE} label="e₂" />

          {showSigmaLabels && (
            <>
              <Html
                position={[sigmaAxisA[0] * 0.55, sigmaAxisA[1] * 0.55, 0]}
                center
                style={{ pointerEvents: "none" }}
              >
                <div className={styles.svdSigmaChip} style={{ color: AMBER }}>
                  σ₁ = {svd.sigma[0].toFixed(2)}
                </div>
              </Html>
              <Html
                position={[sigmaAxisB[0] * 0.55, sigmaAxisB[1] * 0.55, 0]}
                center
                style={{ pointerEvents: "none" }}
              >
                <div className={styles.svdSigmaChip} style={{ color: BLUE }}>
                  σ₂ = {svd.sigma[1].toFixed(2)}
                </div>
              </Html>
            </>
          )}

          <Html position={[3.6, 0, 0]} center style={{ pointerEvents: "none" }}>
            <span
              style={{
                color: VIOLET,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13,
                fontStyle: "italic",
                fontWeight: 700,
                textShadow: "0 0 8px rgba(2,6,23,0.9)",
              }}
            >
              x
            </span>
          </Html>
          <Html position={[0, 3.6, 0]} center style={{ pointerEvents: "none" }}>
            <span
              style={{
                color: VIOLET,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13,
                fontStyle: "italic",
                fontWeight: 700,
                textShadow: "0 0 8px rgba(2,6,23,0.9)",
              }}
            >
              y
            </span>
          </Html>

          <OrbitControls
            enableRotate={false}
            enablePan={false}
            enableZoom={false}
            makeDefault
          />

          <CinematicEffects preset={isFullscreen ? "flagship" : "flagship"} />
        </Canvas>
        )}

        <div className={styles.svdVignette} aria-hidden="true" />
        <div className={styles.svdGlow} aria-hidden="true" />

        <div className={styles.svdOverlayTopLeft}>
          <div className={styles.svdMatrixChip}>
            <span className={styles.svdMatrixChipLabel}>A =</span>
            <span className={styles.svdMatrixChipGrid}>
              {A.map((row, i) => (
                <span key={`row-${i}`} className={styles.svdMatrixRow}>
                  {row.map((val, j) => (
                    <span key={`cell-${i}-${j}`} className={styles.svdMatrixCell}>
                      {val.toFixed(val % 1 === 0 ? 0 : 2)}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <ScrubBar
        value={t}
        onChange={setT}
        phases={phases}
        lang={lang}
        durationMs={5200}
        accent={EMERALD}
      />

      <PhaseCaption t={t} lang={lang} sigma={svd.sigma} />
    </div>
  );
}
