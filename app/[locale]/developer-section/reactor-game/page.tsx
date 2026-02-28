"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowForward as ArrowRight,
  ArrowBack as ArrowBack,
  PlayArrow as PlayIcon,
  Refresh as ResetIcon,
  Lightbulb as HintIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lock as LockIcon,
  EmojiEvents as TrophyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./ReactorGame.module.css";

/* ============ Types ============ */
type Screen = "menu" | "levels" | "game" | "complete";

interface Operator {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  reactorCode: string;
  apply: (input: number[]) => number[];
}

interface Level {
  id: number;
  name: string;
  description: string;
  input: number[];
  target: number[];
  availableOps: string[];
  slots: number;
  par: number;
  hint: string;
  teaches: string;
}

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

/* ============ Operator Definitions ============ */
const OPERATORS: Record<string, Operator> = {
  map_x2: {
    id: "map_x2",
    label: "map(×2)",
    emoji: "🔄",
    color: "#818cf8",
    description: "Transforms each element by multiplying by 2",
    reactorCode: ".map(x -> x * 2)",
    apply: (input) => input.map((x) => x * 2),
  },
  map_x3: {
    id: "map_x3",
    label: "map(×3)",
    emoji: "🔄",
    color: "#818cf8",
    description: "Transforms each element by multiplying by 3",
    reactorCode: ".map(x -> x * 3)",
    apply: (input) => input.map((x) => x * 3),
  },
  map_add3: {
    id: "map_add3",
    label: "map(+3)",
    emoji: "🔄",
    color: "#818cf8",
    description: "Adds 3 to each element in the stream",
    reactorCode: ".map(x -> x + 3)",
    apply: (input) => input.map((x) => x + 3),
  },
  filter_even: {
    id: "filter_even",
    label: "filter(even)",
    emoji: "🔍",
    color: "#34d399",
    description: "Keeps only even numbers from the stream",
    reactorCode: ".filter(x -> x % 2 == 0)",
    apply: (input) => input.filter((x) => x % 2 === 0),
  },
  filter_odd: {
    id: "filter_odd",
    label: "filter(odd)",
    emoji: "🔍",
    color: "#34d399",
    description: "Keeps only odd numbers from the stream",
    reactorCode: ".filter(x -> x % 2 != 0)",
    apply: (input) => input.filter((x) => x % 2 !== 0),
  },
  filter_gt5: {
    id: "filter_gt5",
    label: "filter(>5)",
    emoji: "🔍",
    color: "#34d399",
    description: "Keeps only elements greater than 5",
    reactorCode: ".filter(x -> x > 5)",
    apply: (input) => input.filter((x) => x > 5),
  },
  take_3: {
    id: "take_3",
    label: "take(3)",
    emoji: "✂️",
    color: "#f472b6",
    description: "Takes only the first 3 elements from the stream",
    reactorCode: ".take(3)",
    apply: (input) => input.slice(0, 3),
  },
  skip_2: {
    id: "skip_2",
    label: "skip(2)",
    emoji: "⏭️",
    color: "#fb923c",
    description: "Skips the first 2 elements of the stream",
    reactorCode: ".skip(2)",
    apply: (input) => input.slice(2),
  },
  distinct: {
    id: "distinct",
    label: "distinct()",
    emoji: "💎",
    color: "#22d3ee",
    description: "Removes duplicate elements, keeping first occurrence",
    reactorCode: ".distinct()",
    apply: (input) => [...new Set(input)],
  },
  sort: {
    id: "sort",
    label: "sort()",
    emoji: "📊",
    color: "#a78bfa",
    description: "Sorts elements in ascending order using a Comparator",
    reactorCode: ".sort()",
    apply: (input) => [...input].sort((a, b) => a - b),
  },
  reduce_sum: {
    id: "reduce_sum",
    label: "reduce(+)",
    emoji: "🧮",
    color: "#fbbf24",
    description: "Reduces all elements to a single sum using Mono",
    reactorCode: ".reduce(Integer::sum)",
    apply: (input) => (input.length > 0 ? [input.reduce((a, b) => a + b, 0)] : []),
  },
};

/* ============ Level Definitions ============ */
const LEVELS: Level[] = [
  {
    id: 1,
    name: "Transform",
    description: "Use map to double each value in the stream",
    input: [1, 2, 3, 4, 5],
    target: [2, 4, 6, 8, 10],
    availableOps: ["map_x2", "map_add3", "filter_even"],
    slots: 1,
    par: 1,
    hint: "map() transforms every element passing through the Flux",
    teaches: "Flux.map()",
  },
  {
    id: 2,
    name: "Filter",
    description: "Keep only the even numbers from the stream",
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    target: [2, 4, 6, 8],
    availableOps: ["map_x2", "filter_even", "filter_odd"],
    slots: 1,
    par: 1,
    hint: "filter() only lets elements matching a predicate pass through",
    teaches: "Flux.filter()",
  },
  {
    id: 3,
    name: "First Three",
    description: "Take only the first 3 elements from the stream",
    input: [10, 20, 30, 40, 50],
    target: [10, 20, 30],
    availableOps: ["take_3", "skip_2", "filter_even"],
    slots: 1,
    par: 1,
    hint: "take(n) completes the Flux after emitting n elements",
    teaches: "Flux.take()",
  },
  {
    id: 4,
    name: "Skip Ahead",
    description: "Skip the first 2 elements of the stream",
    input: [5, 10, 15, 20, 25],
    target: [15, 20, 25],
    availableOps: ["take_3", "skip_2", "map_x2"],
    slots: 1,
    par: 1,
    hint: "skip(n) ignores the first n elements then emits the rest",
    teaches: "Flux.skip()",
  },
  {
    id: 5,
    name: "Unique Only",
    description: "Remove all duplicate values from the stream",
    input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [3, 1, 4, 5, 9, 2, 6],
    availableOps: ["distinct", "sort", "filter_odd"],
    slots: 1,
    par: 1,
    hint: "distinct() tracks seen elements and drops repeats",
    teaches: "Flux.distinct()",
  },
  {
    id: 6,
    name: "Sort It",
    description: "Sort the elements in ascending order",
    input: [5, 2, 8, 1, 9, 3],
    target: [1, 2, 3, 5, 8, 9],
    availableOps: ["sort", "distinct", "map_x2"],
    slots: 1,
    par: 1,
    hint: "sort() collects all elements, sorts them, then re-emits",
    teaches: "Flux.sort()",
  },
  {
    id: 7,
    name: "Sum It Up",
    description: "Reduce all elements to a single sum",
    input: [10, 20, 30],
    target: [60],
    availableOps: ["reduce_sum", "map_x2", "filter_even"],
    slots: 1,
    par: 1,
    hint: "reduce() accumulates elements into a single Mono value",
    teaches: "Flux.reduce()",
  },
  {
    id: 8,
    name: "Double & Filter",
    description: "Double all values, then keep only those greater than 5",
    input: [1, 2, 3, 4, 5],
    target: [6, 8, 10],
    availableOps: ["map_x2", "filter_gt5", "filter_even", "take_3"],
    slots: 2,
    par: 2,
    hint: "Chain operators: first map, then filter the results",
    teaches: "Operator chaining",
  },
  {
    id: 9,
    name: "Triple & Take",
    description: "Triple all values, then take only the first 3",
    input: [1, 2, 3, 4, 5],
    target: [3, 6, 9],
    availableOps: ["map_x3", "take_3", "filter_odd", "skip_2"],
    slots: 2,
    par: 2,
    hint: "Apply map first to transform, then take to limit",
    teaches: "map() + take()",
  },
  {
    id: 10,
    name: "Filter & Sort",
    description: "Keep only odd numbers, then sort them",
    input: [8, 3, 6, 1, 4, 7, 2, 9],
    target: [1, 3, 7, 9],
    availableOps: ["filter_odd", "filter_even", "sort", "distinct"],
    slots: 2,
    par: 2,
    hint: "First filter to reduce the set, then sort what remains",
    teaches: "filter() + sort()",
  },
  {
    id: 11,
    name: "Three-Step Chain",
    description: "Sort, filter odds, then take the first 3",
    input: [5, 3, 8, 1, 7, 2, 4, 6],
    target: [1, 3, 5],
    availableOps: ["sort", "filter_odd", "filter_even", "take_3", "skip_2", "map_x2"],
    slots: 3,
    par: 3,
    hint: "Think about the order: sort first, then filter, then limit",
    teaches: "Multi-operator pipelines",
  },
  {
    id: 12,
    name: "Master Pipeline",
    description: "Remove duplicates, sort, and take the first 3",
    input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [1, 2, 3],
    availableOps: ["distinct", "sort", "take_3", "filter_even", "map_x2", "reduce_sum", "skip_2"],
    slots: 3,
    par: 3,
    hint: "Clean duplicates first, then sort, then take what you need",
    teaches: "Complete reactive pipeline",
  },
];

/* ============ Helpers ============ */
const PROGRESS_KEY = "reactor-game-progress";
const MARBLE_COLORS = ["#818cf8", "#22d3ee", "#34d399", "#fb923c", "#f472b6", "#fbbf24", "#60a5fa", "#ef4444", "#a78bfa", "#2dd4bf"];

function getMarbleColor(value: number): string {
  return MARBLE_COLORS[Math.abs(value) % MARBLE_COLORS.length];
}

function loadProgress(): Record<number, LevelProgress> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<number, LevelProgress>) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* noop */
  }
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/* ============ Marble Component ============ */
function Marble({ value, size = "md", delay = 0 }: { value: number; size?: "sm" | "md"; delay?: number }) {
  const color = getMarbleColor(value);
  const sz = size === "sm" ? "1.5rem" : "2.25rem";
  const fsz = size === "sm" ? "0.65rem" : "0.85rem";
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, type: "spring", stiffness: 300 }}
      className={styles.marble}
      style={{
        width: sz,
        height: sz,
        background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88)`,
        boxShadow: `0 0 10px ${color}66, inset 0 -2px 4px ${color}44`,
        fontSize: fsz,
      }}
    >
      {value}
    </motion.div>
  );
}

/* ============ Main Component ============ */
export default function ReactorGamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedOps, setPlacedOps] = useState<(string | null)[]>([]);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [intermediateResults, setIntermediateResults] = useState<number[][]>([]);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState<Record<number, LevelProgress>>({});
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animTimers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const level = LEVELS[currentLevel] || LEVELS[0];

  const startLevel = useCallback((levelIndex: number) => {
    setCurrentLevel(levelIndex);
    setPlacedOps(new Array(LEVELS[levelIndex].slots).fill(null));
    setSelectedOp(null);
    setIsRunning(false);
    setAnimStep(-1);
    setIntermediateResults([]);
    setShowHint(false);
    setResult(null);
    setEarnedStars(0);
    setShowConfetti(false);
    setScreen("game");
  }, []);

  const resetLevel = useCallback(() => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    setPlacedOps(new Array(level.slots).fill(null));
    setSelectedOp(null);
    setIsRunning(false);
    setAnimStep(-1);
    setIntermediateResults([]);
    setResult(null);
    setEarnedStars(0);
    setShowConfetti(false);
  }, [level]);

  const placeOperator = useCallback(
    (slotIndex: number) => {
      if (isRunning) return;
      if (placedOps[slotIndex]) {
        // Remove existing operator
        setPlacedOps((prev) => {
          const next = [...prev];
          next[slotIndex] = null;
          return next;
        });
        return;
      }
      if (!selectedOp) return;
      setPlacedOps((prev) => {
        const next = [...prev];
        next[slotIndex] = selectedOp;
        return next;
      });
      setSelectedOp(null);
    },
    [isRunning, selectedOp, placedOps]
  );

  const runPipeline = useCallback(() => {
    const filledOps = placedOps.filter(Boolean) as string[];
    if (filledOps.length === 0) return;

    setIsRunning(true);
    setResult(null);
    setAnimStep(-1);

    // Calculate intermediate results
    const results: number[][] = [];
    let current = [...level.input];
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        current = OPERATORS[opId].apply(current);
        results.push([...current]);
      }
    }
    setIntermediateResults(results);

    // Animate step by step
    const timers: NodeJS.Timeout[] = [];
    results.forEach((_, i) => {
      const timer = setTimeout(() => setAnimStep(i), (i + 1) * 700);
      timers.push(timer);
    });

    // Check result after animations
    const finalTimer = setTimeout(() => {
      const finalOutput = results.length > 0 ? results[results.length - 1] : level.input;
      const success = arraysEqual(finalOutput, level.target);

      if (success) {
        const opsUsed = filledOps.length;
        const stars = opsUsed <= level.par ? 3 : opsUsed <= level.par + 1 ? 2 : 1;
        setEarnedStars(stars);
        setResult("success");
        setShowConfetti(true);

        // Save progress
        const score = stars * 100 + Math.max(0, (level.par - opsUsed + 1) * 50);
        const newProgress = { ...progress };
        const existing = newProgress[level.id];
        if (!existing || stars > existing.stars || score > existing.bestScore) {
          newProgress[level.id] = {
            completed: true,
            stars: Math.max(stars, existing?.stars || 0),
            bestScore: Math.max(score, existing?.bestScore || 0),
          };
          setProgress(newProgress);
          saveProgress(newProgress);
        }
      } else {
        setResult("fail");
      }
      setIsRunning(false);
    }, (results.length + 1) * 700 + 300);
    timers.push(finalTimer);
    animTimers.current = timers;
  }, [placedOps, level, progress]);

  // Build the Reactor code string from the placed operators
  const buildReactorCode = useCallback(() => {
    const inputStr = level.input.join(", ");
    let code = `Flux.just(${inputStr})`;
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        code += `\n    ${OPERATORS[opId].reactorCode}`;
      }
    }
    code += "\n    .subscribe()";
    return code;
  }, [placedOps, level]);

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId === 1) return true;
      return progress[levelId - 1]?.completed || false;
    },
    [progress]
  );

  const totalStars = Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = LEVELS.length * 3;

  const canRun = placedOps.some(Boolean) && !isRunning;

  // Cleanup timers
  useEffect(() => {
    return () => {
      animTimers.current.forEach(clearTimeout);
    };
  }, []);

  /* ============ Menu Screen ============ */
  if (screen === "menu") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.menuScreen}
          >
            <div className={styles.menuIcon}>🔬</div>
            <h1 className={styles.menuTitle}>Reactor Pipes</h1>
            <p className={styles.menuSubtitle}>
              {t("reactor-game-subtitle")}
            </p>
            <div className={styles.menuStats}>
              <span>⭐ {totalStars}/{maxStars}</span>
              <span>📊 {Object.values(progress).filter((p) => p.completed).length}/{LEVELS.length}</span>
            </div>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("levels")}
            >
              <PlayIcon /> {t("reactor-game-play")}
            </motion.button>
            <motion.a
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
              whileHover={{ x: -3 }}
            >
              <ArrowBack /> {t("reactor-game-back-hub")}
            </motion.a>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ Level Select Screen ============ */
  if (screen === "levels") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <div className={styles.levelsScreen}>
            <div className={styles.levelsHeader}>
              <button className={styles.iconBtn} onClick={() => setScreen("menu")}>
                <ArrowBack />
              </button>
              <h2 className={styles.levelsTitle}>{t("reactor-game-select-level")}</h2>
              <span className={styles.levelsStars}>⭐ {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.levelsGrid}>
              {LEVELS.map((lvl, i) => {
                const unlocked = isLevelUnlocked(lvl.id);
                const prog = progress[lvl.id];
                return (
                  <motion.button
                    key={lvl.id}
                    className={`${styles.levelCard} ${!unlocked ? styles.levelLocked : ""} ${prog?.completed ? styles.levelCompleted : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={unlocked ? { scale: 1.04, y: -4 } : {}}
                    whileTap={unlocked ? { scale: 0.96 } : {}}
                    onClick={() => unlocked && startLevel(i)}
                    disabled={!unlocked}
                  >
                    {!unlocked && <LockIcon className={styles.lockIcon} />}
                    <span className={styles.levelNum}>{lvl.id}</span>
                    <span className={styles.levelName}>{lvl.name}</span>
                    <div className={styles.levelStars}>
                      {[1, 2, 3].map((s) =>
                        prog && prog.stars >= s ? (
                          <StarIcon key={s} className={styles.starFilled} />
                        ) : (
                          <StarBorderIcon key={s} className={styles.starEmpty} />
                        )
                      )}
                    </div>
                    {prog?.completed && <span className={styles.levelTeaches}>{lvl.teaches}</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ All Levels Complete Screen ============ */
  if (screen === "complete") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.completeScreen}
          >
            <TrophyIcon className={styles.completeTrophy} />
            <h1 className={styles.completeTitle}>{t("reactor-game-complete-title")}</h1>
            <p className={styles.completeSubtitle}>{t("reactor-game-complete-subtitle")}</p>
            <div className={styles.completeStats}>
              <span>⭐ {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.completeCode}>
              <p className={styles.completeCodeLabel}>{t("reactor-game-learned")}</p>
              <pre className={styles.codeBlock}>
                {`Flux.just(1, 2, 3, 4, 5)
    .map(x -> x * 2)
    .filter(x -> x > 5)
    .distinct()
    .sort()
    .take(3)
    .reduce(Integer::sum)
    .subscribe(System.out::println)`}
              </pre>
            </div>
            <div className={styles.completeBtns}>
              <button className={styles.playBtn} onClick={() => setScreen("levels")}>
                {t("reactor-game-replay")}
              </button>
              <a href={createLocalizedPath("/developer-section")} className={styles.backLink}>
                <HomeIcon /> {t("reactor-game-back-hub")}
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ Game Screen ============ */
  return (
    <main>
      <DeveloperHeader />
      <div className={styles.container}>
        <div className={styles.bgEffects}>
          <div className={styles.bgGradient1} />
          <div className={styles.bgGradient2} />
        </div>

        <div className={styles.gameScreen}>
          {/* Header */}
          <div className={styles.gameHeader}>
            <button className={styles.iconBtn} onClick={() => setScreen("levels")}>
              <ArrowBack />
            </button>
            <div className={styles.gameHeaderInfo}>
              <span className={styles.gameLevelBadge}>Level {level.id}</span>
              <h2 className={styles.gameLevelName}>{level.name}</h2>
            </div>
            <div className={styles.gameLevelStars}>
              {[1, 2, 3].map((s) =>
                earnedStars >= s ? (
                  <StarIcon key={s} className={styles.starFilled} />
                ) : (
                  <StarBorderIcon key={s} className={styles.starEmpty} />
                )
              )}
            </div>
          </div>

          {/* Description */}
          <p className={styles.gameDesc}>{level.description}</p>

          {/* Pipeline */}
          <div className={styles.pipeline}>
            {/* Input */}
            <div className={styles.pipelineNode}>
              <div className={styles.pipelineLabel}>INPUT</div>
              <div className={styles.pipelineBox}>
                <div className={styles.marbleRow}>
                  {level.input.map((v, i) => (
                    <Marble key={`in-${i}`} value={v} size="sm" delay={i * 0.05} />
                  ))}
                </div>
              </div>
            </div>

            {/* Operator Slots */}
            {placedOps.map((opId, slotIndex) => {
              const op = opId ? OPERATORS[opId] : null;
              const hasResult = animStep >= slotIndex && intermediateResults[slotIndex];
              return (
                <div key={slotIndex} className={styles.pipelineStep}>
                  <ArrowRight className={styles.pipelineArrow} />
                  <div className={styles.pipelineNode}>
                    <div className={styles.pipelineLabel}>
                      {op ? op.emoji : `SLOT ${slotIndex + 1}`}
                    </div>
                    <motion.button
                      className={`${styles.pipelineSlot} ${op ? styles.pipelineSlotFilled : ""} ${
                        animStep === slotIndex ? styles.pipelineSlotActive : ""
                      }`}
                      style={op ? { borderColor: `${op.color}66`, background: `${op.color}15` } : {}}
                      whileHover={!isRunning ? { scale: 1.03 } : {}}
                      whileTap={!isRunning ? { scale: 0.97 } : {}}
                      onClick={() => placeOperator(slotIndex)}
                    >
                      {op ? (
                        <span style={{ color: op.color, fontWeight: 600 }}>{op.label}</span>
                      ) : (
                        <span className={styles.slotPlaceholder}>
                          {selectedOp ? t("reactor-game-click-place") : t("reactor-game-select-op")}
                        </span>
                      )}
                    </motion.button>
                    {/* Intermediate result */}
                    <AnimatePresence>
                      {hasResult && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={styles.intermediateResult}
                        >
                          <div className={styles.marbleRow}>
                            {intermediateResults[slotIndex].map((v, i) => (
                              <Marble key={`r-${slotIndex}-${i}`} value={v} size="sm" delay={i * 0.04} />
                            ))}
                            {intermediateResults[slotIndex].length === 0 && (
                              <span className={styles.emptyStream}>∅</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}

            {/* Target Output */}
            <div className={styles.pipelineStep}>
              <ArrowRight className={styles.pipelineArrow} />
              <div className={styles.pipelineNode}>
                <div className={styles.pipelineLabel}>TARGET</div>
                <div className={`${styles.pipelineBox} ${styles.targetBox} ${
                  result === "success" ? styles.targetSuccess : result === "fail" ? styles.targetFail : ""
                }`}>
                  <div className={styles.marbleRow}>
                    {level.target.map((v, i) => (
                      <Marble key={`t-${i}`} value={v} size="sm" delay={i * 0.05} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Message */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${styles.resultMessage} ${result === "success" ? styles.resultSuccess : styles.resultFail}`}
              >
                {result === "success" ? (
                  <>
                    <span>🎉 {t("reactor-game-success")}</span>
                    <span className={styles.resultStars}>
                      {"⭐".repeat(earnedStars)}
                    </span>
                  </>
                ) : (
                  <span>❌ {t("reactor-game-try-again")}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reactor Code Preview */}
          {result === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.codePreview}
            >
              <span className={styles.codePreviewLabel}>{t("reactor-game-your-pipeline")}</span>
              <pre className={styles.codeBlock}>{buildReactorCode()}</pre>
            </motion.div>
          )}

          {/* Operator Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxLabel}>{t("reactor-game-operators")}</div>
            <div className={styles.toolboxGrid}>
              {level.availableOps.map((opId) => {
                const op = OPERATORS[opId];
                if (!op) return null;
                const isPlaced = placedOps.includes(opId);
                const isSelected = selectedOp === opId;
                return (
                  <motion.button
                    key={opId}
                    className={`${styles.opCard} ${isSelected ? styles.opCardSelected : ""} ${isPlaced ? styles.opCardUsed : ""}`}
                    style={{
                      borderColor: isSelected ? op.color : `${op.color}44`,
                      background: isSelected ? `${op.color}20` : `${op.color}08`,
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => !isRunning && setSelectedOp(isSelected ? null : opId)}
                    disabled={isRunning}
                  >
                    <span className={styles.opEmoji}>{op.emoji}</span>
                    <span className={styles.opLabel} style={{ color: op.color }}>
                      {op.label}
                    </span>
                    <span className={styles.opDesc}>{op.description}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionBar}>
            <button
              className={styles.hintBtn}
              onClick={() => setShowHint(!showHint)}
            >
              <HintIcon /> {t("reactor-game-hint")}
            </button>
            <button className={styles.resetBtn} onClick={resetLevel}>
              <ResetIcon /> {t("reactor-game-reset")}
            </button>
            <motion.button
              className={styles.runBtn}
              whileHover={canRun ? { scale: 1.04 } : {}}
              whileTap={canRun ? { scale: 0.96 } : {}}
              onClick={runPipeline}
              disabled={!canRun}
            >
              <PlayIcon /> {isRunning ? t("reactor-game-running") : t("reactor-game-run")}
            </motion.button>
            {result === "success" && currentLevel < LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => startLevel(currentLevel + 1)}
              >
                {t("reactor-game-next")} <ArrowRight />
              </motion.button>
            )}
            {result === "success" && currentLevel === LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => setScreen("complete")}
              >
                {t("reactor-game-finish")} <TrophyIcon />
              </motion.button>
            )}
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.hintBox}
              >
                <HintIcon className={styles.hintIcon} />
                <div>
                  <p className={styles.hintText}>{level.hint}</p>
                  <p className={styles.hintTeaches}>
                    <strong>{t("reactor-game-teaches")}:</strong> {level.teaches}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confetti */}
        {showConfetti && (
          <div className={styles.confettiContainer}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={styles.confetti}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: MARBLE_COLORS[i % MARBLE_COLORS.length],
                  width: `${6 + Math.random() * 6}px`,
                  height: `${6 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
