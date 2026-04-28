"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./CoroutinesInteractive.module.css";

const EMERALD = "#34D399";
const BLUE = "#60A5FA";
const VIOLET = "#C4B5FD";
const AMBER = "#FBBF24";
const RED = "#F87171";

/* ─────────────────────────────────────────────────────────────────────
 *  HERO STATS PANEL — three glow tiles introducing the lesson
 *  ───────────────────────────────────────────────────────────────────── */
export function HeroStatsPanel({
  eyebrow = "Coroutines · Deep Dive",
  title,
  subtitle,
  stats,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  stats: { value: string; label: string; accent?: "emerald" | "blue" | "violet" | "amber" }[];
}) {
  const accentMap = {
    emerald: EMERALD,
    blue: BLUE,
    violet: VIOLET,
    amber: AMBER,
  };
  return (
    <section className={styles.hero}>
      <div className={styles.heroAurora} aria-hidden="true" />
      <div className={styles.heroInner}>
        <span className={styles.heroEyebrow}>{eyebrow}</span>
        <h2 className={styles.heroTitle}>{title}</h2>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        <div className={styles.heroStats}>
          {stats.map((s, i) => {
            const c = accentMap[s.accent ?? "blue"];
            return (
              <div
                key={i}
                className={styles.heroStat}
                style={{ borderColor: `${c}55`, boxShadow: `0 16px 32px -16px ${c}55` }}
              >
                <span className={styles.heroStatValue} style={{ color: c }}>
                  {s.value}
                </span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  CONCURRENCY RACE — synchronous vs coroutines, animated bars
 *  Two lanes of three tasks each. Click "Race" to start. The blocking
 *  side runs them serially; the coroutine side runs them concurrently.
 *  ───────────────────────────────────────────────────────────────────── */
export function ConcurrencyRace() {
  const reduced = useReducedMotion() ?? false;
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<"sync" | "coro" | null>(null);
  // taskDurations in seconds (in animation time). Keep small for snappy demo.
  const tasks = useMemo(() => [1.0, 1.2, 0.8], []);
  const totalSync = tasks.reduce((a, b) => a + b, 0);
  const totalCoro = Math.max(...tasks);

  const start = () => {
    if (running) return;
    setWinner(null);
    setRunning(true);
    const ms = (reduced ? 0.001 : 1) * Math.max(totalSync, totalCoro) * 1000;
    setTimeout(() => {
      setRunning(false);
      setWinner("coro");
    }, ms + 250);
  };
  const reset = () => {
    setRunning(false);
    setWinner(null);
  };

  const renderLane = (mode: "sync" | "coro", color: string) => {
    let acc = 0;
    return tasks.map((d, i) => {
      const delay = mode === "sync" ? acc : 0;
      acc += d;
      return (
        <div key={i} className={styles.raceTrack}>
          <span className={styles.raceTrackLabel}>task {i + 1}</span>
          <div className={styles.raceBarBg}>
            <motion.div
              className={styles.raceBar}
              style={{ background: color }}
              initial={{ width: "0%" }}
              animate={running ? { width: "100%" } : { width: "0%" }}
              transition={{
                duration: reduced ? 0.001 : d,
                delay: running ? (reduced ? 0 : delay) : 0,
                ease: "linear",
              }}
            />
          </div>
          <span className={styles.raceDur}>{d.toFixed(1)}s</span>
        </div>
      );
    });
  };

  return (
    <div className={styles.raceCard}>
      <div className={styles.raceHead}>
        <h4 className={styles.widgetTitle}>Sequential vs Concurrent · live race</h4>
        <div className={styles.raceControls}>
          <button type="button" className={styles.runBtn} onClick={start} disabled={running}>
            {running ? "Racing…" : "Race"}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={reset}
            disabled={running}
          >
            Reset
          </button>
        </div>
      </div>
      <div className={styles.raceGrid}>
        <div className={styles.raceLane} style={{ borderColor: `${RED}55` }}>
          <div className={styles.raceLaneHead}>
            <span className={styles.raceLaneTag} style={{ background: `${RED}33`, color: RED }}>
              Blocking
            </span>
            <code>thread.sleep / sequential</code>
          </div>
          {renderLane("sync", RED)}
          <div className={styles.raceTotal}>
            total: <strong>{totalSync.toFixed(1)}s</strong>
          </div>
        </div>
        <div className={styles.raceLane} style={{ borderColor: `${EMERALD}55` }}>
          <div className={styles.raceLaneHead}>
            <span
              className={styles.raceLaneTag}
              style={{ background: `${EMERALD}33`, color: EMERALD }}
            >
              Coroutines
            </span>
            <code>async {"{ ... }"} + await</code>
          </div>
          {renderLane("coro", EMERALD)}
          <div className={styles.raceTotal}>
            total: <strong>{totalCoro.toFixed(1)}s</strong>{" "}
            <span className={styles.raceSpeedup}>
              {(totalSync / totalCoro).toFixed(1)}× faster
            </span>
          </div>
        </div>
      </div>
      {winner === "coro" && (
        <p className={styles.raceVerdict}>
          ✓ Coroutines finished in <code>{totalCoro.toFixed(1)}s</code>; the blocking lane took{" "}
          <code>{totalSync.toFixed(1)}s</code>. Same workload, ~
          {(totalSync / totalCoro).toFixed(1)}× speedup — for free.
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  BUILDER PICKER — interactive decision tree to pick the right builder
 *  ───────────────────────────────────────────────────────────────────── */
type BuilderAnswer = "launch" | "async" | "runBlocking" | "coroutineScope" | "withContext";

interface PickerNode {
  q: string;
  yes?: PickerNode | { result: BuilderAnswer };
  no?: PickerNode | { result: BuilderAnswer };
}

const PICKER_TREE: PickerNode = {
  q: "Are you in a suspending function or scope already?",
  yes: {
    q: "Do you need a return value from the new coroutine?",
    yes: { result: "async" },
    no: {
      q: "Do you need to switch dispatcher (e.g. for I/O) for this block?",
      yes: { result: "withContext" },
      no: {
        q: "Do you need to start multiple children and wait for all of them?",
        yes: { result: "coroutineScope" },
        no: { result: "launch" },
      },
    },
  },
  no: { result: "runBlocking" },
};

const BUILDER_INFO: Record<
  BuilderAnswer,
  { name: string; signature: string; reason: string; color: string }
> = {
  launch: {
    name: "launch",
    signature: "scope.launch { … } → Job",
    reason:
      "Fire-and-forget: a side effect that doesn't return a value to the caller.",
    color: EMERALD,
  },
  async: {
    name: "async",
    signature: "scope.async { … } → Deferred<T>",
    reason: "You want a value back. Call .await() to suspend until the result arrives.",
    color: AMBER,
  },
  runBlocking: {
    name: "runBlocking",
    signature: "runBlocking { … } (blocks the current thread)",
    reason:
      "Bridge from non-suspending code (main, tests). Don't use it inside coroutines.",
    color: BLUE,
  },
  coroutineScope: {
    name: "coroutineScope",
    signature: "coroutineScope { … } (suspends until all children complete)",
    reason:
      "Group several launch/async children and propagate cancellation/exceptions to all of them.",
    color: VIOLET,
  },
  withContext: {
    name: "withContext",
    signature: "withContext(Dispatchers.IO) { … }",
    reason:
      "Switch dispatcher temporarily — e.g. run blocking I/O on Dispatchers.IO and resume back.",
    color: BLUE,
  },
};

export function BuilderPicker() {
  const [path, setPath] = useState<{ q: string; ans: "yes" | "no" }[]>([]);
  const [node, setNode] = useState<PickerNode>(PICKER_TREE);
  const [result, setResult] = useState<BuilderAnswer | null>(null);

  const choose = (ans: "yes" | "no") => {
    const next = ans === "yes" ? node.yes : node.no;
    if (!next) return;
    setPath((p) => [...p, { q: node.q, ans }]);
    if ("result" in next) {
      setResult(next.result);
    } else {
      setNode(next);
    }
  };

  const reset = () => {
    setPath([]);
    setNode(PICKER_TREE);
    setResult(null);
  };

  const info = result ? BUILDER_INFO[result] : null;

  return (
    <div className={styles.pickerCard}>
      <h4 className={styles.widgetTitle}>Pick the right coroutine builder</h4>
      <p className={styles.widgetSubtitle}>
        Answer two or three questions and we'll suggest the builder that fits the situation.
      </p>
      <ol className={styles.pickerPath}>
        {path.map((step, i) => (
          <li key={i} className={styles.pickerPathItem}>
            <span className={styles.pickerPathQ}>{step.q}</span>
            <span
              className={styles.pickerPathA}
              style={{ color: step.ans === "yes" ? EMERALD : RED }}
            >
              {step.ans === "yes" ? "✓ Yes" : "✗ No"}
            </span>
          </li>
        ))}
      </ol>
      {!result ? (
        <div className={styles.pickerCurrent}>
          <p className={styles.pickerQ}>{node.q}</p>
          <div className={styles.pickerActions}>
            <button
              type="button"
              className={styles.pickerYes}
              onClick={() => choose("yes")}
            >
              Yes
            </button>
            <button
              type="button"
              className={styles.pickerNo}
              onClick={() => choose("no")}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div
          className={styles.pickerResult}
          style={{ borderColor: `${info!.color}88`, boxShadow: `0 18px 36px -20px ${info!.color}55` }}
        >
          <div className={styles.pickerResultHead}>
            <span className={styles.pickerResultBadge} style={{ background: `${info!.color}22`, color: info!.color }}>
              Use
            </span>
            <h5 className={styles.pickerResultName} style={{ color: info!.color }}>
              {info!.name}
            </h5>
          </div>
          <code className={styles.pickerResultSig}>{info!.signature}</code>
          <p className={styles.pickerResultReason}>{info!.reason}</p>
          <button type="button" className={styles.ghostBtn} onClick={reset}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  BACKPRESSURE SIMULATOR — slider for buffer size + producer/consumer
 *  speeds. Visualizes how the channel handles the rate mismatch.
 *  ───────────────────────────────────────────────────────────────────── */
export function BackpressureSimulator() {
  const [bufferSize, setBufferSize] = useState(3);
  const [producerMs, setProducerMs] = useState(280);
  const [consumerMs, setConsumerMs] = useState(620);
  const [running, setRunning] = useState(false);
  const [queue, setQueue] = useState<{ id: number; t: number }[]>([]);
  const [stats, setStats] = useState({ produced: 0, consumed: 0, suspended: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const prodT = window.setInterval(() => {
      setQueue((q) => {
        if (q.length >= bufferSize) {
          setStats((s) => ({ ...s, suspended: s.suspended + 1 }));
          return q;
        }
        idRef.current += 1;
        setStats((s) => ({ ...s, produced: s.produced + 1 }));
        return [...q, { id: idRef.current, t: Date.now() }];
      });
    }, producerMs);
    const consT = window.setInterval(() => {
      setQueue((q) => {
        if (q.length === 0) return q;
        setStats((s) => ({ ...s, consumed: s.consumed + 1 }));
        return q.slice(1);
      });
    }, consumerMs);
    return () => {
      window.clearInterval(prodT);
      window.clearInterval(consT);
    };
  }, [running, bufferSize, producerMs, consumerMs]);

  const reset = () => {
    setRunning(false);
    setQueue([]);
    setStats({ produced: 0, consumed: 0, suspended: 0 });
    idRef.current = 0;
  };

  const slots = Array.from({ length: bufferSize }, (_, i) => queue[i] ?? null);

  return (
    <div className={styles.bpCard}>
      <h4 className={styles.widgetTitle}>Backpressure simulator</h4>
      <p className={styles.widgetSubtitle}>
        When the producer is faster than the consumer, the channel buffer fills up and the
        producer suspends. Tweak the rates and watch what happens.
      </p>

      <div className={styles.bpControls}>
        <label className={styles.bpLabel}>
          buffer size <strong>{bufferSize}</strong>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={bufferSize}
            onChange={(e) => setBufferSize(Number(e.target.value))}
          />
        </label>
        <label className={styles.bpLabel}>
          producer interval <strong>{producerMs}ms</strong>
          <input
            type="range"
            min={120}
            max={1200}
            step={20}
            value={producerMs}
            onChange={(e) => setProducerMs(Number(e.target.value))}
          />
        </label>
        <label className={styles.bpLabel}>
          consumer interval <strong>{consumerMs}ms</strong>
          <input
            type="range"
            min={120}
            max={1500}
            step={20}
            value={consumerMs}
            onChange={(e) => setConsumerMs(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.bpVis}>
        <div className={styles.bpEnd}>
          <div className={styles.bpEndLabel} style={{ color: EMERALD }}>
            Producer
          </div>
          <div
            className={styles.bpEndDot}
            style={{
              borderColor: EMERALD,
              animation: running ? `bp-pulse ${producerMs}ms infinite` : "none",
            }}
          />
        </div>
        <div className={styles.bpBuffer}>
          {slots.map((slot, i) => (
            <div key={i} className={styles.bpSlot}>
              {slot ? <motion.span layout className={styles.bpItem}>#{slot.id}</motion.span> : null}
            </div>
          ))}
        </div>
        <div className={styles.bpEnd}>
          <div className={styles.bpEndLabel} style={{ color: BLUE }}>
            Consumer
          </div>
          <div
            className={styles.bpEndDot}
            style={{
              borderColor: BLUE,
              animation: running ? `bp-pulse ${consumerMs}ms infinite` : "none",
            }}
          />
        </div>
      </div>

      <div className={styles.bpStats}>
        <div className={styles.bpStat}>
          <span style={{ color: EMERALD }}>{stats.produced}</span>
          <small>produced</small>
        </div>
        <div className={styles.bpStat}>
          <span style={{ color: BLUE }}>{stats.consumed}</span>
          <small>consumed</small>
        </div>
        <div className={styles.bpStat}>
          <span style={{ color: AMBER }}>{stats.suspended}</span>
          <small>send() suspensions</small>
        </div>
        <div className={styles.bpActions}>
          <button
            type="button"
            className={styles.runBtn}
            onClick={() => setRunning((v) => !v)}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button type="button" className={styles.ghostBtn} onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <p className={styles.bpHint}>
        Tip: speed the producer up and slow the consumer down. As soon as the buffer fills, every
        new <code>send()</code> suspends until a slot frees up — that's how channels apply
        back-pressure for free.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 *  MINI QUIZ — 3 to 5 multiple-choice questions for end-of-lesson recap
 *  ───────────────────────────────────────────────────────────────────── */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function MiniQuiz({ title = "Quick check", questions }: { title?: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const score = useMemo(
    () => questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0),
    [answers, questions],
  );
  const total = questions.length;
  const allAnswered = Object.keys(answers).length === total;

  return (
    <section className={styles.quizCard}>
      <header className={styles.quizHead}>
        <span className={styles.quizBadge}>Quiz</span>
        <h4 className={styles.widgetTitle}>{title}</h4>
        {revealed ? (
          <span
            className={styles.quizScore}
            style={{ color: score === total ? EMERALD : score >= total / 2 ? AMBER : RED }}
          >
            {score} / {total}
          </span>
        ) : null}
      </header>
      <ol className={styles.quizList}>
        {questions.map((q, qi) => {
          const picked = answers[q.id];
          return (
            <li key={q.id} className={styles.quizItem}>
              <p className={styles.quizQ}>
                <span className={styles.quizQNum}>{qi + 1}.</span> {q.question}
              </p>
              <div className={styles.quizOpts}>
                {q.options.map((opt, oi) => {
                  const isPicked = picked === oi;
                  const isCorrect = revealed && oi === q.correct;
                  const isWrongPick = revealed && isPicked && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`${styles.quizOpt} ${
                        isCorrect
                          ? styles.quizOptCorrect
                          : isWrongPick
                            ? styles.quizOptWrong
                            : isPicked
                              ? styles.quizOptPicked
                              : ""
                      }`}
                      onClick={() => {
                        if (revealed) return;
                        setAnswers((a) => ({ ...a, [q.id]: oi }));
                      }}
                      disabled={revealed}
                    >
                      <span className={styles.quizOptLetter}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed ? (
                <p className={styles.quizExplain}>
                  <strong style={{ color: EMERALD }}>Why:</strong> {q.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className={styles.quizActions}>
        {!revealed ? (
          <button
            type="button"
            className={styles.runBtn}
            disabled={!allAnswered}
            onClick={() => setRevealed(true)}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => {
              setAnswers({});
              setRevealed(false);
            }}
          >
            Try again
          </button>
        )}
      </div>
    </section>
  );
}

export default {
  HeroStatsPanel,
  ConcurrencyRace,
  BuilderPicker,
  BackpressureSimulator,
  MiniQuiz,
};
