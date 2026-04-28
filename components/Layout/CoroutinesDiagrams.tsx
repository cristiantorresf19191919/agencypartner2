"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DiagramKind } from "@/lib/coroutinesBasicsDoc";
import styles from "./CoroutinesDiagrams.module.css";

interface DiagramProps {
  kind: DiagramKind;
  caption?: string;
}

export function CoroutinesDiagram({ kind, caption }: DiagramProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.surface}>
        <div className={styles.surfaceGlow} aria-hidden="true" />
        <div className={styles.surfaceInner}>{renderDiagram(kind)}</div>
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

function renderDiagram(kind: DiagramKind): React.ReactNode {
  switch (kind) {
    case "structured-concurrency":
      return <StructuredConcurrencyDiagram />;
    case "suspend-resume":
      return <SuspendResumeDiagram />;
    case "dispatchers":
      return <DispatchersDiagram />;
    case "launch-vs-async":
      return <LaunchVsAsyncDiagram />;
    case "channel-pipe":
      return <ChannelPipeDiagram />;
    case "fan-out-fan-in":
      return <FanOutFanInDiagram />;
    default:
      return null;
  }
}

const EMERALD = "#34D399";
const BLUE = "#60A5FA";
const VIOLET = "#C4B5FD";
const AMBER = "#FBBF24";
const RED = "#F87171";

/* ─────────────────────────────────────────────────────────────────────
 *  Structured concurrency: parent scope with children.
 *  When the user clicks "Cancel parent", the cancellation animates down
 *  the tree, dimming each child in turn.
 *  ───────────────────────────────────────────────────────────────────── */
function StructuredConcurrencyDiagram() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"running" | "cancelling" | "cancelled">("running");

  const cancel = () => {
    if (reduced) {
      setPhase("cancelled");
      return;
    }
    setPhase("cancelling");
    setTimeout(() => setPhase("cancelled"), 1400);
  };
  const reset = () => setPhase("running");

  const isCancelled = phase !== "running";
  const childOpacity = (delay: number) => {
    if (phase === "running") return 1;
    if (phase === "cancelled") return 0.25;
    return 1 - Math.min(1, Math.max(0, (Date.now() % 1400) / 1400));
  };

  return (
    <div className={styles.diagramRoot}>
      <svg viewBox="0 0 600 280" className={styles.diagramSvg} role="img" aria-label="Structured concurrency tree">
        <defs>
          <linearGradient id="parent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="100%" stopColor={VIOLET} />
          </linearGradient>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="3" />
            <feComponentTransfer><feFuncA type="linear" slope="1.4" /></feComponentTransfer>
          </filter>
        </defs>

        {/* connectors */}
        {[120, 300, 480].map((cx) => (
          <motion.line
            key={`conn-${cx}`}
            x1={300}
            y1={84}
            x2={cx}
            y2={170}
            stroke={isCancelled ? RED : EMERALD}
            strokeWidth={1.6}
            strokeOpacity={isCancelled ? 0.55 : 0.7}
            strokeDasharray={isCancelled ? "4 4" : "0"}
            initial={false}
            animate={{ stroke: isCancelled ? RED : EMERALD }}
            transition={{ duration: 0.6 }}
          />
        ))}

        {/* parent scope */}
        <g>
          <rect x={220} y={32} width={160} height={56} rx={14} fill="url(#parent-grad)" opacity={0.18} stroke={BLUE} strokeWidth={1.5} />
          <text x={300} y={56} textAnchor="middle" fill="#F1F6FF" fontSize={13} fontWeight={700}>coroutineScope { }</text>
          <text x={300} y={74} textAnchor="middle" fill="#9FB3D8" fontSize={11}>parent</text>
        </g>

        {/* children */}
        {[
          { cx: 120, label: "launch { fetchUser() }", color: EMERALD, delay: 0 },
          { cx: 300, label: "launch { fetchPosts() }", color: AMBER, delay: 0.3 },
          { cx: 480, label: "launch { fetchAds() }", color: VIOLET, delay: 0.6 },
        ].map((c) => (
          <motion.g
            key={c.cx}
            initial={false}
            animate={{
              opacity: phase === "cancelled" ? 0.25 : 1,
              y: phase === "cancelling" ? 6 : 0,
            }}
            transition={{ duration: 0.7, delay: phase === "cancelling" ? c.delay : 0 }}
          >
            <rect x={c.cx - 78} y={170} width={156} height={56} rx={12} fill={c.color} fillOpacity={0.14} stroke={c.color} strokeWidth={1.4} />
            <text x={c.cx} y={194} textAnchor="middle" fill="#F1F6FF" fontSize={12} fontWeight={600}>{c.label}</text>
            <motion.text
              x={c.cx}
              y={212}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              animate={{ fill: phase === "cancelled" ? RED : c.color }}
              transition={{ duration: 0.5, delay: phase === "cancelling" ? c.delay : 0 }}
            >
              {phase === "cancelled" ? "✕ cancelled" : "● running"}
            </motion.text>
          </motion.g>
        ))}
      </svg>

      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={cancel} disabled={phase !== "running"}>
          Cancel parent
        </button>
        <button type="button" className={styles.btnGhost} onClick={reset} disabled={phase === "running"}>
          Reset
        </button>
        <p className={styles.helper}>Cancelling the parent cancels all children — that's the contract of structured concurrency.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  Suspend / resume timeline. Coroutine A suspends; thread runs B; A resumes.
 *  ───────────────────────────────────────────────────────────────────── */
function SuspendResumeDiagram() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className={styles.diagramRoot}>
      <svg viewBox="0 0 600 230" className={styles.diagramSvg} role="img" aria-label="Suspension and resumption timeline">
        {/* thread lane */}
        <rect x={28} y={106} width={544} height={36} rx={8} fill="rgba(96, 165, 250, 0.06)" stroke={BLUE} strokeOpacity={0.35} strokeWidth={1} />
        <text x={28} y={100} fill={BLUE} fontSize={11} fontWeight={700} letterSpacing={1}>THREAD-1</text>

        {/* coroutine A — runs, then suspends, then resumes */}
        <motion.rect
          x={40} y={114} width={120} height={20} rx={6}
          fill={EMERALD}
          fillOpacity={0.85}
          initial={{ x: 40, opacity: 0.85 }}
          animate={reduced ? { opacity: 0.85 } : { opacity: [0.85, 0.85, 0.25, 0.25, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.25, 0.3, 0.7, 0.75] }}
        />
        <text x={100} y={128} textAnchor="middle" fill="#04101e" fontSize={11} fontWeight={700}>coroutine A</text>

        {/* coroutine B — runs while A is suspended */}
        <motion.rect
          x={180} y={114} width={240} height={20} rx={6}
          fill={AMBER}
          fillOpacity={0.85}
          initial={{ opacity: 0 }}
          animate={reduced ? { opacity: 0.6 } : { opacity: [0, 0, 0.85, 0.85, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.32, 0.68, 0.72] }}
        />
        <text x={300} y={128} textAnchor="middle" fill="#04101e" fontSize={11} fontWeight={700}>coroutine B (delay() / I/O)</text>

        {/* coroutine A resumed */}
        <motion.rect
          x={440} y={114} width={120} height={20} rx={6}
          fill={EMERALD}
          fillOpacity={0.85}
          initial={{ opacity: 0 }}
          animate={reduced ? { opacity: 0.6 } : { opacity: [0, 0, 0, 0, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.7, 0.74, 0.78] }}
        />
        <text x={500} y={128} textAnchor="middle" fill="#04101e" fontSize={11} fontWeight={700}>A resumes</text>

        {/* labels */}
        <g fontSize={10} fill="#9FB3D8">
          <text x={100} y={170} textAnchor="middle">running</text>
          <text x={300} y={170} textAnchor="middle">A is suspended (no thread held)</text>
          <text x={500} y={170} textAnchor="middle">running</text>
        </g>

        {/* arrows */}
        <g stroke={BLUE} strokeWidth={1.2} fill="none" markerEnd="url(#arrowB)" opacity={0.6}>
          <line x1={160} y1={94} x2={180} y2={104} />
          <line x1={420} y1={104} x2={440} y2={94} />
        </g>
        <text x={170} y={86} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={700}>suspend</text>
        <text x={430} y={86} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={700}>resume</text>

        <defs>
          <marker id="arrowB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={BLUE} />
          </marker>
        </defs>
      </svg>
      <p className={styles.helper}>While A is suspended, the thread is free — Kotlin schedules B without blocking. That's the magic of <code>suspend</code>.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  Dispatchers: 3 lanes (Main / IO / Default), each with cards showing
 *  what kind of work is appropriate for it.
 *  ───────────────────────────────────────────────────────────────────── */
function DispatchersDiagram() {
  const lanes = [
    { name: "Main", color: EMERALD, items: ["UI updates", "navigation", "fast logic"] },
    { name: "IO", color: BLUE, items: ["network calls", "disk reads", "DB queries"] },
    { name: "Default", color: VIOLET, items: ["JSON parsing", "image work", "CPU loops"] },
  ];
  return (
    <div className={styles.diagramRoot}>
      <div className={styles.dispGrid}>
        {lanes.map((lane) => (
          <div key={lane.name} className={styles.dispLane} style={{ borderColor: `${lane.color}55` }}>
            <div className={styles.dispLaneHead} style={{ color: lane.color }}>
              <span className={styles.dispDot} style={{ background: lane.color }} />
              Dispatchers.{lane.name}
            </div>
            <ul className={styles.dispList}>
              {lane.items.map((it) => (
                <li key={it} className={styles.dispItem}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={styles.helper}>Pick the right pool for the work — UI on <code>Main</code>, blocking I/O on <code>IO</code>, CPU work on <code>Default</code>.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  launch vs async — return types and use cases
 *  ───────────────────────────────────────────────────────────────────── */
function LaunchVsAsyncDiagram() {
  return (
    <div className={styles.diagramRoot}>
      <div className={styles.lvaGrid}>
        <div className={styles.lvaCard} style={{ borderColor: `${EMERALD}55` }}>
          <div className={styles.lvaHead} style={{ color: EMERALD }}>launch { } → Job</div>
          <p className={styles.lvaText}>Fire-and-forget. Use when the result isn't needed — start a side effect.</p>
          <pre className={styles.lvaCode}>{`val job = scope.launch {
    repository.save(user)
}
job.join()`}</pre>
        </div>
        <div className={styles.lvaCard} style={{ borderColor: `${AMBER}55` }}>
          <div className={styles.lvaHead} style={{ color: AMBER }}>async { } → Deferred&lt;T&gt;</div>
          <p className={styles.lvaText}>Returns a future. <code>.await()</code> resumes the caller with the value.</p>
          <pre className={styles.lvaCode}>{`val a = async { fetchA() }
val b = async { fetchB() }
val sum = a.await() + b.await()`}</pre>
        </div>
      </div>
      <p className={styles.helper}>Same scope, different shape: <code>launch</code> for actions, <code>async</code> for values.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  Channel pipe — animated boxes flow from producer through channel to
 *  consumer. Click "Send" to push another item through.
 *  ───────────────────────────────────────────────────────────────────── */
function ChannelPipeDiagram() {
  const reduced = useReducedMotion() ?? false;
  const [items, setItems] = useState<{ id: number; value: number }[]>([{ id: 0, value: 1 }]);
  const nextRef = useRef(2);

  const send = () => {
    setItems((prev) => [...prev, { id: nextRef.current, value: nextRef.current }]);
    nextRef.current += 1;
  };

  // Drop items after the animation completes so memory doesn't grow.
  useEffect(() => {
    if (!items.length) return;
    const t = setTimeout(() => setItems((prev) => prev.slice(1)), 2200);
    return () => clearTimeout(t);
  }, [items]);

  return (
    <div className={styles.diagramRoot}>
      <svg viewBox="0 0 600 200" className={styles.diagramSvg} role="img" aria-label="Channel pipe between producer and consumer">
        <defs>
          <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={EMERALD} stopOpacity={0.25} />
            <stop offset="100%" stopColor={BLUE} stopOpacity={0.25} />
          </linearGradient>
        </defs>

        {/* producer */}
        <rect x={26} y={68} width={120} height={64} rx={12} fill={EMERALD} fillOpacity={0.16} stroke={EMERALD} strokeWidth={1.4} />
        <text x={86} y={92} textAnchor="middle" fill="#F1F6FF" fontSize={12} fontWeight={700}>Producer</text>
        <text x={86} y={112} textAnchor="middle" fill={EMERALD} fontSize={11} fontFamily="ui-monospace">channel.send(x)</text>

        {/* pipe */}
        <rect x={150} y={84} width={300} height={32} rx={16} fill="url(#pipe-grad)" stroke="#94A3B8" strokeOpacity={0.35} strokeWidth={1} />
        <line x1={150} y1={100} x2={450} y2={100} stroke="#475569" strokeOpacity={0.35} strokeDasharray="3 5" />

        {/* consumer */}
        <rect x={454} y={68} width={120} height={64} rx={12} fill={BLUE} fillOpacity={0.16} stroke={BLUE} strokeWidth={1.4} />
        <text x={514} y={92} textAnchor="middle" fill="#F1F6FF" fontSize={12} fontWeight={700}>Consumer</text>
        <text x={514} y={112} textAnchor="middle" fill={BLUE} fontSize={11} fontFamily="ui-monospace">channel.receive()</text>

        {/* in-flight items */}
        {items.map((it) => (
          <motion.g
            key={it.id}
            initial={{ x: 0 }}
            animate={reduced ? { x: 290 } : { x: 290 }}
            transition={{ duration: reduced ? 0 : 1.8, ease: "easeInOut" }}
          >
            <rect x={154} y={88} width={26} height={24} rx={6} fill={AMBER} stroke="#fff" strokeOpacity={0.5} />
            <text x={167} y={104} textAnchor="middle" fill="#04101e" fontSize={11} fontWeight={800}>{it.value}</text>
          </motion.g>
        ))}
      </svg>
      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={send}>Send {nextRef.current}</button>
        <p className={styles.helper}>Channel is a non-blocking queue between coroutines — back-pressure built in.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  Fan-out (one producer → many consumers) and Fan-in (many producers →
 *  one consumer), shown as two side-by-side topology diagrams.
 *  ───────────────────────────────────────────────────────────────────── */
function FanOutFanInDiagram() {
  return (
    <div className={styles.diagramRoot}>
      <div className={styles.fanGrid}>
        <div className={styles.fanCard}>
          <div className={styles.fanHead} style={{ color: EMERALD }}>Fan-out</div>
          <svg viewBox="0 0 220 180" className={styles.diagramSvg}>
            <rect x={6} y={70} width={70} height={40} rx={8} fill={EMERALD} fillOpacity={0.16} stroke={EMERALD} strokeWidth={1.3} />
            <text x={41} y={94} textAnchor="middle" fill="#F1F6FF" fontSize={11} fontWeight={700}>producer</text>
            {[28, 90, 152].map((y, i) => (
              <g key={y}>
                <line x1={76} y1={90} x2={140} y2={y + 20} stroke={EMERALD} strokeOpacity={0.55} strokeWidth={1.4} />
                <rect x={140} y={y} width={70} height={40} rx={8} fill={BLUE} fillOpacity={0.16} stroke={BLUE} strokeWidth={1.3} />
                <text x={175} y={y + 24} textAnchor="middle" fill="#F1F6FF" fontSize={11} fontWeight={700}>worker {i + 1}</text>
              </g>
            ))}
          </svg>
          <p className={styles.fanText}>Multiple workers consume from one channel — Kotlin distributes items round-robin.</p>
        </div>
        <div className={styles.fanCard}>
          <div className={styles.fanHead} style={{ color: AMBER }}>Fan-in</div>
          <svg viewBox="0 0 220 180" className={styles.diagramSvg}>
            {[28, 90, 152].map((y, i) => (
              <g key={y}>
                <rect x={10} y={y} width={70} height={40} rx={8} fill={AMBER} fillOpacity={0.16} stroke={AMBER} strokeWidth={1.3} />
                <text x={45} y={y + 24} textAnchor="middle" fill="#F1F6FF" fontSize={11} fontWeight={700}>source {i + 1}</text>
                <line x1={80} y1={y + 20} x2={144} y2={90} stroke={AMBER} strokeOpacity={0.55} strokeWidth={1.4} />
              </g>
            ))}
            <rect x={144} y={70} width={70} height={40} rx={8} fill={VIOLET} fillOpacity={0.18} stroke={VIOLET} strokeWidth={1.3} />
            <text x={179} y={94} textAnchor="middle" fill="#F1F6FF" fontSize={11} fontWeight={700}>collector</text>
          </svg>
          <p className={styles.fanText}>Many producers send into one channel — the collector merges the streams.</p>
        </div>
      </div>
    </div>
  );
}

export default CoroutinesDiagram;
