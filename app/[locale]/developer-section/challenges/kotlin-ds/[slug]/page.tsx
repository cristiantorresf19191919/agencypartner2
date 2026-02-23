"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  Terminal as TerminalIcon,
  CheckCircle as CheckIcon,
  Lightbulb as HintIcon,
  School as LearnIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  EmojiEvents as TrophyIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDSChallengeById, getDSChallengesByTopic, getDSTopicById } from "@/lib/kotlinDSChallengesData";
import type { KotlinDSChallenge } from "@/lib/kotlinDSChallengesData";
import confetti from "canvas-confetti";
import landingStyles from "../../ChallengesLanding.module.css";
import styles from "./KotlinDSPlay.module.css";
import type { OnMount } from "@monaco-editor/react";

const PISTON_EXECUTE_URL = "/api/execute-code";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <div className={styles.loadingSpinner} />
      <p>Loading editor...</p>
    </div>
  ),
});

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

// ===== SVG DATA STRUCTURE DIAGRAMS =====
// These render educational SVG diagrams for each topic

function ArrayDiagram() {
  return (
    <svg viewBox="0 0 400 120" className={styles.dsDiagram}>
      <defs>
        <linearGradient id="arrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#61dafb" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#61dafb" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {[0,1,2,3,4,5,6].map((i) => (
        <g key={i}>
          <rect x={20 + i * 52} y={20} width={48} height={48} rx={8} fill="url(#arrGrad)" stroke="#61dafb" strokeWidth={1.5}>
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin={`${i * 0.08}s`} fill="freeze" />
          </rect>
          <text x={44 + i * 52} y={50} textAnchor="middle" fill="#e6f0ff" fontSize="16" fontWeight="700" fontFamily="monospace">
            {[42, 17, 93, 8, 56, 31, 74][i]}
          </text>
          <text x={44 + i * 52} y={84} textAnchor="middle" fill="#9fc4ff" fontSize="11" fontFamily="monospace">[{i}]</text>
        </g>
      ))}
      <text x={200} y={110} textAnchor="middle" fill="#7b9ad0" fontSize="11">Contiguous memory • O(1) access by index</text>
    </svg>
  );
}

function LinkedListDiagram() {
  return (
    <svg viewBox="0 0 420 100" className={styles.dsDiagram}>
      <defs>
        <marker id="llArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#a78bfa" />
        </marker>
      </defs>
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={10 + i * 105} y={20} width={80} height={40} rx={10} fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth={1.5} />
          <text x={50 + i * 105} y={44} textAnchor="middle" fill="#e6f0ff" fontSize="14" fontWeight="600">{["Head", "12", "99", "7"][i]}</text>
          {i < 3 && <line x1={90 + i * 105} y1={40} x2={115 + i * 105} y2={40} stroke="#a78bfa" strokeWidth={1.5} markerEnd="url(#llArrow)" />}
        </g>
      ))}
      <text x={395} y={44} fill="#a78bfa" fontSize="18" fontWeight="700">∅</text>
      <text x={210} y={85} textAnchor="middle" fill="#7b9ad0" fontSize="11">Dynamic size • O(1) insert/delete at known position</text>
    </svg>
  );
}

function StackDiagram() {
  return (
    <svg viewBox="0 0 200 160" className={styles.dsDiagram}>
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={40} y={20 + i * 32} width={120} height={28} rx={6} fill={`rgba(245,158,11,${0.3 - i * 0.05})`} stroke="#f59e0b" strokeWidth={1.2}>
            <animate attributeName="opacity" values="0;1" dur="0.25s" begin={`${(3-i) * 0.1}s`} fill="freeze" />
          </rect>
          <text x={100} y={38 + i * 32} textAnchor="middle" fill="#e6f0ff" fontSize="13" fontWeight="600">{["← TOP", "B", "A", "Bottom"][i]}</text>
        </g>
      ))}
      <text x={100} y={150} textAnchor="middle" fill="#7b9ad0" fontSize="11">LIFO • push/pop O(1)</text>
    </svg>
  );
}

function QueueDiagram() {
  return (
    <svg viewBox="0 0 400 100" className={styles.dsDiagram}>
      <defs>
        <marker id="qArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
        </marker>
      </defs>
      <text x={10} y={35} fill="#10b981" fontSize="12" fontWeight="700">IN →</text>
      {[0,1,2,3,4].map((i) => (
        <rect key={i} x={50 + i * 65} y={15} width={55} height={35} rx={8} fill={`rgba(16,185,129,${0.25 - i * 0.03})`} stroke="#10b981" strokeWidth={1.2} />
      ))}
      {[0,1,2,3,4].map((i) => (
        <text key={`t${i}`} x={77 + i * 65} y={37} textAnchor="middle" fill="#e6f0ff" fontSize="13" fontWeight="600">{["E","D","C","B","A"][i]}</text>
      ))}
      <text x={385} y={35} fill="#10b981" fontSize="12" fontWeight="700">→ OUT</text>
      <text x={200} y={75} textAnchor="middle" fill="#7b9ad0" fontSize="11">FIFO • enqueue/dequeue O(1)</text>
    </svg>
  );
}

function HashMapDiagram() {
  return (
    <svg viewBox="0 0 360 140" className={styles.dsDiagram}>
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x={10} y={10 + i * 32} width={80} height={26} rx={6} fill="rgba(236,72,153,0.2)" stroke="#ec4899" strokeWidth={1} />
          <text x={50} y={27 + i * 32} textAnchor="middle" fill="#ec4899" fontSize="11" fontWeight="600">{["h(0)", "h(1)", "h(2)", "h(3)"][i]}</text>
          <line x1={90} y1={23 + i * 32} x2={120} y2={23 + i * 32} stroke="#ec4899" strokeWidth={1} strokeDasharray="4" />
          <rect x={120} y={10 + i * 32} width={100} height={26} rx={6} fill="rgba(236,72,153,0.1)" stroke="rgba(236,72,153,0.3)" strokeWidth={1} />
          <text x={170} y={27 + i * 32} textAnchor="middle" fill="#e6f0ff" fontSize="11">{["\"age\" → 25", "\"name\" → K", "null", "\"id\" → 42"][i]}</text>
        </g>
      ))}
      <text x={180} y={135} textAnchor="middle" fill="#7b9ad0" fontSize="11">O(1) avg lookup • key → hash → bucket</text>
    </svg>
  );
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 300 160" className={styles.dsDiagram}>
      <line x1={150} y1={30} x2={80} y2={70} stroke="#22c55e" strokeWidth={1.5} />
      <line x1={150} y1={30} x2={220} y2={70} stroke="#22c55e" strokeWidth={1.5} />
      <line x1={80} y1={70} x2={45} y2={110} stroke="#22c55e" strokeWidth={1.5} />
      <line x1={80} y1={70} x2={115} y2={110} stroke="#22c55e" strokeWidth={1.5} />
      <line x1={220} y1={70} x2={185} y2={110} stroke="#22c55e" strokeWidth={1.5} />
      <line x1={220} y1={70} x2={255} y2={110} stroke="#22c55e" strokeWidth={1.5} />
      {[[150,25,"8"],[80,65,"4"],[220,65,"12"],[45,105,"2"],[115,105,"6"],[185,105,"10"],[255,105,"14"]].map(([cx,cy,v], i) => (
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r={18} fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth={1.5} />
          <text x={cx as number} y={(cy as number)+5} textAnchor="middle" fill="#e6f0ff" fontSize="13" fontWeight="700">{v}</text>
        </g>
      ))}
      <text x={150} y={150} textAnchor="middle" fill="#7b9ad0" fontSize="11">BST • O(log n) search/insert/delete</text>
    </svg>
  );
}

function HeapDiagram() {
  return (
    <svg viewBox="0 0 300 150" className={styles.dsDiagram}>
      <line x1={150} y1={25} x2={85} y2={60} stroke="#f97316" strokeWidth={1.5} />
      <line x1={150} y1={25} x2={215} y2={60} stroke="#f97316" strokeWidth={1.5} />
      <line x1={85} y1={60} x2={55} y2={95} stroke="#f97316" strokeWidth={1.5} />
      <line x1={85} y1={60} x2={115} y2={95} stroke="#f97316" strokeWidth={1.5} />
      <line x1={215} y1={60} x2={185} y2={95} stroke="#f97316" strokeWidth={1.5} />
      {[[150,20,"1"],[85,55,"3"],[215,55,"2"],[55,90,"7"],[115,90,"5"],[185,90,"4"]].map(([cx,cy,v], i) => (
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r={16} fill={i===0 ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.15)"} stroke="#f97316" strokeWidth={1.5} />
          <text x={cx as number} y={(cy as number)+5} textAnchor="middle" fill="#e6f0ff" fontSize="12" fontWeight="700">{v}</text>
        </g>
      ))}
      <text x={150} y={130} textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">Min Heap: parent ≤ children</text>
      <text x={150} y={145} textAnchor="middle" fill="#7b9ad0" fontSize="11">O(1) min • O(log n) insert/extract</text>
    </svg>
  );
}

function GraphDiagram() {
  return (
    <svg viewBox="0 0 300 150" className={styles.dsDiagram}>
      {[[50,30,70,90],[70,90,180,110],[180,110,250,40],[250,40,150,30],[150,30,70,90],[150,30,180,110]].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(139,92,246,0.4)" strokeWidth={1.5} />
      ))}
      {[[50,30,"A"],[70,90,"B"],[180,110,"C"],[250,40,"D"],[150,30,"E"]].map(([cx,cy,v], i) => (
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r={18} fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth={1.5} />
          <text x={cx as number} y={(cy as number)+5} textAnchor="middle" fill="#e6f0ff" fontSize="13" fontWeight="700">{v}</text>
        </g>
      ))}
      <text x={150} y={145} textAnchor="middle" fill="#7b9ad0" fontSize="11">Vertices + Edges • BFS/DFS traversal</text>
    </svg>
  );
}

function TrieDiagram() {
  return (
    <svg viewBox="0 0 300 150" className={styles.dsDiagram}>
      <line x1={150} y1={20} x2={80} y2={55} stroke="#06b6d4" strokeWidth={1.5} />
      <line x1={150} y1={20} x2={220} y2={55} stroke="#06b6d4" strokeWidth={1.5} />
      <line x1={80} y1={55} x2={50} y2={90} stroke="#06b6d4" strokeWidth={1.5} />
      <line x1={80} y1={55} x2={110} y2={90} stroke="#06b6d4" strokeWidth={1.5} />
      <line x1={220} y1={55} x2={220} y2={90} stroke="#06b6d4" strokeWidth={1.5} />
      <line x1={50} y1={90} x2={50} y2={120} stroke="#06b6d4" strokeWidth={1.5} />
      {[[150,15,"root"],[80,50,"c"],[220,50,"d"],[50,85,"a"],[110,85,"o"],[220,85,"o"],[50,115,"t"]].map(([cx,cy,v], i) => (
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r={i===0?14:13} fill={i===0?"rgba(6,182,212,0.25)":"rgba(6,182,212,0.15)"} stroke="#06b6d4" strokeWidth={1.2} />
          <text x={cx as number} y={(cy as number)+4} textAnchor="middle" fill="#e6f0ff" fontSize={i===0?"10":"12"} fontWeight="600">{v}</text>
        </g>
      ))}
      <text x={150} y={145} textAnchor="middle" fill="#7b9ad0" fontSize="11">Prefix tree • O(m) search where m = word length</text>
    </svg>
  );
}

function AdvancedDiagram() {
  return (
    <svg viewBox="0 0 350 130" className={styles.dsDiagram}>
      {/* Union-Find visualization */}
      {[0,1,2].map(i => (
        <g key={i}>
          <circle cx={60 + i * 120} cy={30} r={18} fill="rgba(225,29,72,0.2)" stroke="#e11d48" strokeWidth={1.5} />
          <text x={60 + i * 120} y={35} textAnchor="middle" fill="#e6f0ff" fontSize="12" fontWeight="700">{i}</text>
          {[0,1].map(j => (
            <g key={j}>
              <line x1={60 + i * 120} y1={48} x2={35 + i * 120 + j * 50} y2={78} stroke="rgba(225,29,72,0.4)" strokeWidth={1} />
              <circle cx={35 + i * 120 + j * 50} cy={90} r={14} fill="rgba(225,29,72,0.1)" stroke="rgba(225,29,72,0.4)" strokeWidth={1} />
              <text x={35 + i * 120 + j * 50} y={94} textAnchor="middle" fill="#c6d5ff" fontSize="10">{i * 2 + j + 3}</text>
            </g>
          ))}
        </g>
      ))}
      <text x={175} y={125} textAnchor="middle" fill="#7b9ad0" fontSize="11">Union-Find • near O(1) union/find with optimizations</text>
    </svg>
  );
}

const DIAGRAM_MAP: Record<string, () => React.JSX.Element> = {
  arrays: ArrayDiagram,
  "linked-lists": LinkedListDiagram,
  stacks: StackDiagram,
  queues: QueueDiagram,
  "hash-maps": HashMapDiagram,
  trees: TreeDiagram,
  heaps: HeapDiagram,
  graphs: GraphDiagram,
  tries: TrieDiagram,
  advanced: AdvancedDiagram,
};

// ===== CELEBRATION COMPONENT =====
function CelebrationOverlay() {
  return (
    <motion.div
      className={styles.celebrationOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.celebrationContent}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <TrophyIcon className={styles.celebrationTrophy} />
        </motion.div>
        <h2 className={styles.celebrationTitle}>Challenge Complete!</h2>
        <p className={styles.celebrationText}>All test cases passed. Great work!</p>
        <div className={styles.celebrationStars}>
          {[0,1,2].map(i => (
            <motion.span
              key={i}
              className={styles.celebrationStar}
              initial={{ opacity: 0, y: 20, rotate: -30 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
            >
              ★
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== MAIN PAGE =====
export default function KotlinDSPlayPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const challenge = getDSChallengeById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; details: { input: string; expected: string; actual: string; passed: boolean }[] } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [kotlinPhase, setKotlinPhase] = useState<"idle" | "sending" | "compiling" | "running">("idle");
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  // Get topic and navigation
  const topic = challenge ? getDSTopicById(challenge.topicId) : null;
  const topicChallenges = challenge ? getDSChallengesByTopic(challenge.topicId) : [];
  const currentIdx = topicChallenges.findIndex(c => c.id === challenge?.id);
  const prevChallenge = currentIdx > 0 ? topicChallenges[currentIdx - 1] : null;
  const nextChallenge = currentIdx < topicChallenges.length - 1 ? topicChallenges[currentIdx + 1] : null;

  const DiagramComponent = topic ? DIAGRAM_MAP[topic.id] : null;

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setShowCelebration(false);
      setShowHints(false);
      setRevealedHints(0);
      setShowSolution(false);
    }
  }, [challenge?.id]);

  const resetCode = useCallback(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setShowCelebration(false);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse("file:///challenge.kt"));
        if (model) model.setValue(challenge.starterCode);
      }
    }
  }, [challenge]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse("file:///challenge.kt"));
      if (model) return model.getValue();
    }
    return code;
  }, [code]);

  // Kotlin runner via Piston API
  const runKotlin = useCallback(async (source: string, input: string, showPhases = true): Promise<{ stdout: string; err?: string }> => {
    const hasMainFn = /fun\s+main\s*\(/.test(source);
    const wrappedSource = hasMainFn ? source : `fun main() {\n${source}\n}`;

    if (showPhases) setKotlinPhase("sending");

    try {
      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "kotlin", version: "*", files: [{ name: "Main.kt", content: wrappedSource }], stdin: input, args: [] }),
      });

      if (!res.ok) {
        if (showPhases) setKotlinPhase("idle");
        return { stdout: "", err: `HTTP ${res.status}` };
      }

      if (showPhases) setKotlinPhase("compiling");
      await new Promise(r => setTimeout(r, 300));

      const d = await res.json();
      if (d.message) { if (showPhases) setKotlinPhase("idle"); return { stdout: "", err: d.message }; }
      if (d.compile && d.compile.code !== 0) { if (showPhases) setKotlinPhase("idle"); return { stdout: "", err: (d.compile.stderr || "Compilation failed").trim() }; }

      if (showPhases) setKotlinPhase("running");
      await new Promise(r => setTimeout(r, 200));

      const run = d.run ?? {};
      if (showPhases) setKotlinPhase("idle");
      if (run.code !== 0 && run.stderr) return { stdout: (run.stdout || "").trim(), err: run.stderr.trim() };
      return { stdout: (run.stdout || "").trim() };
    } catch (e) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: e instanceof Error ? e.message : String(e) };
    }
  }, []);

  const runCode = useCallback(async () => {
    if (!challenge) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const src = getEditorCode();
    const { stdout, err } = await runKotlin(src, challenge.sampleInput, true);
    setLogs(stdout ? stdout.split("\n") : []);
    if (err) setError(err);
    setIsRunning(false);
  }, [challenge, getEditorCode, runKotlin]);

  const submitCode = useCallback(async () => {
    if (!challenge || !challenge.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    setShowCelebration(false);

    const src = getEditorCode();
    let passed = 0;
    const total = challenge.testCases.length;
    const details: { input: string; expected: string; actual: string; passed: boolean }[] = [];

    for (const tc of challenge.testCases) {
      const { stdout, err } = await runKotlin(src, tc.input, false);
      if (err) {
        setError(`Test failed: ${err}`);
        details.push({ input: tc.input, expected: tc.output, actual: `Error: ${err}`, passed: false });
        continue;
      }
      const ok = normalizeOutput(stdout) === normalizeOutput(tc.output);
      if (ok) passed++;
      details.push({ input: tc.input, expected: tc.output, actual: stdout, passed: ok });
    }

    setSubmitResult({ passed, total, details });
    if (passed === total) {
      setShowSuccess(true);
      setShowCelebration(true);
      // Mark completed in localStorage
      try {
        const saved = localStorage.getItem("kotlin-ds-completed");
        const set = saved ? new Set(JSON.parse(saved)) : new Set();
        set.add(challenge.id);
        localStorage.setItem("kotlin-ds-completed", JSON.stringify([...set]));
      } catch {}
      // Fire confetti
      try {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.3 } }), 300);
        setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.7 } }), 500);
      } catch {}
      // Auto-dismiss celebration
      setTimeout(() => setShowCelebration(false), 4000);
    }
    setIsSubmitting(false);
  }, [challenge, getEditorCode, runKotlin]);

  // Keyboard shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode]);

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    fontLigatures: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    formatOnPaste: true,
    formatOnType: true,
  }), []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
  };

  if (!challenge) {
    return (
      <main className={landingStyles.page}>
        <DeveloperHeader />
        <div className={styles.notFound}>
          <p>Challenge not found</p>
          <a href={createLocalizedPath("/developer-section/challenges/kotlin-ds")}>Back to challenges</a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={landingStyles.page}>
      <DeveloperHeader />
      <div className={landingStyles.backgroundGlow} />
      <div className={landingStyles.backgroundGrid} />

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && <CelebrationOverlay />}
      </AnimatePresence>

      <section className={styles.playSection}>
        {/* Navigation */}
        <div className={styles.navRow}>
          {prevChallenge ? (
            <a href={createLocalizedPath(`/developer-section/challenges/kotlin-ds/${prevChallenge.id}`)} className={styles.navBtn}>
              <PrevIcon fontSize="small" /> Prev
            </a>
          ) : <div />}
          <div className={styles.navCenter}>
            <span className={styles.topicBadge} style={{ borderColor: topic?.color, color: topic?.color }}>
              {topic?.icon} {topic?.name}
            </span>
            <span className={styles.challengeNum}>{currentIdx + 1} / {topicChallenges.length}</span>
          </div>
          {nextChallenge ? (
            <a href={createLocalizedPath(`/developer-section/challenges/kotlin-ds/${nextChallenge.id}`)} className={styles.navBtn}>
              Next <NextIcon fontSize="small" />
            </a>
          ) : <div />}
        </div>

        <div className={styles.layout}>
          {/* LEFT: Description + Teaching */}
          <div className={styles.description}>
            <div className={styles.descHeader}>
              <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                {challenge.difficulty}
              </span>
              <span className={styles.pts}>{challenge.maxScore} pts</span>
            </div>

            <h1 className={styles.descTitle}>{challenge.title}</h1>

            {/* SVG Diagram */}
            {DiagramComponent && (
              <div className={styles.diagramWrap}>
                <DiagramComponent />
              </div>
            )}

            {/* Concept Teaching */}
            <div className={styles.conceptCard}>
              <LearnIcon className={styles.conceptIcon} />
              <div>
                <h4 className={styles.conceptTitle}>What you'll learn</h4>
                <p className={styles.conceptText}>{challenge.conceptOverview}</p>
              </div>
            </div>

            <p className={styles.descBody}>{challenge.description}</p>

            <h4 className={styles.descSub}>Input Format</h4>
            <p className={styles.descBody}>{challenge.inputFormat}</p>

            <h4 className={styles.descSub}>Output Format</h4>
            <p className={styles.descBody}>{challenge.outputFormat}</p>

            {challenge.constraints && (
              <>
                <h4 className={styles.descSub}>Constraints</h4>
                <p className={styles.descBody}>{challenge.constraints}</p>
              </>
            )}

            <h4 className={styles.descSub}>Sample Input</h4>
            <pre className={styles.sample}>{challenge.sampleInput}</pre>

            <h4 className={styles.descSub}>Expected Output</h4>
            <pre className={styles.sample}>{challenge.sampleOutput}</pre>

            {/* Hints */}
            <div className={styles.hintsSection}>
              <button className={styles.hintToggle} onClick={() => setShowHints(!showHints)}>
                <HintIcon fontSize="small" />
                {showHints ? "Hide Hints" : `Show Hints (${challenge.hints.length})`}
              </button>
              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={styles.hintsList}
                  >
                    {challenge.hints.map((hint, i) => (
                      <div key={i} className={styles.hintItem}>
                        {i < revealedHints ? (
                          <p className={styles.hintText}>{hint}</p>
                        ) : (
                          <button className={styles.revealHintBtn} onClick={() => setRevealedHints(i + 1)}>
                            Reveal Hint {i + 1}
                          </button>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Solution (collapsible) */}
            <div className={styles.solutionSection}>
              <button className={styles.solutionToggle} onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>
              <AnimatePresence>
                {showSolution && (
                  <motion.pre
                    className={styles.solutionCode}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {challenge.solution}
                  </motion.pre>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Editor + Output */}
          <div className={styles.editorColumn}>
            <div className={styles.langLabel}>
              <span>Kotlin</span>
              <span className={styles.shortcut}>Ctrl+Enter to run</span>
            </div>

            <div className={`${styles.editorWrap} code-editor-contained`}>
              <MonacoEditor
                height="100%"
                language="kotlin"
                path="file:///challenge.kt"
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={styles.toolbar}>
              <button className={styles.iconBtn} onClick={resetCode}>
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button className={`${styles.runBtn} ${isRunning ? styles.disabled : ""}`} onClick={runCode} disabled={isRunning}>
                <PlayIcon fontSize="small" /> {isRunning ? "Running..." : "Run"}
              </button>
              <button className={`${styles.submitBtn} ${isSubmitting ? styles.disabled : ""}`} onClick={submitCode} disabled={isSubmitting}>
                <CheckIcon fontSize="small" /> {isSubmitting ? "Testing..." : "Submit"}
              </button>
            </div>

            {/* Output Panel */}
            <div className={styles.outputPanel}>
              <div className={styles.outputHead}>
                <TerminalIcon fontSize="small" /> Output
                {submitResult != null && (
                  <span className={submitResult.passed === submitResult.total ? styles.passLabel : styles.failLabel}>
                    {submitResult.passed}/{submitResult.total} passed
                  </span>
                )}
              </div>

              {/* Kotlin Loading Animation */}
              {kotlinPhase !== "idle" && (
                <motion.div className={styles.kotlinLoading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={styles.kotlinLoadingSteps}>
                    {["sending", "compiling", "running"].map((phase, i) => (
                      <div key={phase} className={`${styles.kotlinStep} ${kotlinPhase === phase ? styles.active : (["sending","compiling","running"].indexOf(kotlinPhase) > i ? styles.done : "")}`}>
                        <span className={styles.stepDot} />
                        <span className={styles.stepLabel}>{phase === "sending" ? "Sending to server" : phase === "compiling" ? "Compiling Kotlin" : "Running program"}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Success Banner */}
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div key="success" className={styles.successBanner} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <CheckIcon className={styles.successIcon} /> All test cases passed!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Test Case Results */}
              {submitResult && submitResult.details.length > 0 && (
                <div className={styles.testResults}>
                  {submitResult.details.map((d, i) => (
                    <div key={i} className={`${styles.testCase} ${d.passed ? styles.testPassed : styles.testFailed}`}>
                      <span className={styles.testLabel}>{d.passed ? "✓" : "✗"} Test {i + 1}</span>
                      {!d.passed && (
                        <div className={styles.testDiff}>
                          <div><span className={styles.testKey}>Expected:</span> <code>{d.expected}</code></div>
                          <div><span className={styles.testKey}>Got:</span> <code>{d.actual}</code></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && <div className={styles.errorLine}>{error}</div>}

              <div className={styles.logList}>
                {logs.length === 0 && !error && !submitResult && kotlinPhase === "idle" && (
                  <p className={styles.emptyLog}>Run your code to see output here...</p>
                )}
                {logs.map((l, i) => <div key={i} className={styles.logLine}>{l}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className={landingStyles.footerActions}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <a className={landingStyles.secondaryLink} href={createLocalizedPath("/developer-section/challenges/kotlin-ds")}>
            Back to Kotlin DS
          </a>
          <a className={landingStyles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            All Challenges
          </a>
          <a className={landingStyles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
