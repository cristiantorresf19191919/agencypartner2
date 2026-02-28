"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBack,
  PlayArrow as PlayIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./React19Game.module.css";

/* ============ Types ============ */
type Screen = "menu" | "playing" | "gameover";

interface TowerDef {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
  color: string;
  description: string;
  reactCode: string;
  special: string | null;
}

interface Tower {
  id: number;
  type: string;
  row: number;
  col: number;
  lastFire: number;
}

interface EnemyDef {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  speed: number;
  reward: number;
  color: string;
  special: string | null;
}

interface Enemy {
  id: number;
  type: string;
  row: number;
  x: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  frozen: number; // slow timer
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  targetId: number;
  damage: number;
  color: string;
  speed: number;
  special: string | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface WaveDef {
  enemies: Array<{ type: string; count: number; interval: number }>;
}

/* ============ Tower Definitions ============ */
const TOWERS: Record<string, TowerDef> = {
  useState: {
    id: "useState",
    name: "useState",
    emoji: "📦",
    cost: 50,
    damage: 12,
    range: 3,
    fireRate: 1000,
    color: "#818cf8",
    description: "Basic state hook. Reliable damage dealer.",
    reactCode: "const [state, setState] = useState(0)",
    special: null,
  },
  useEffect: {
    id: "useEffect",
    name: "useEffect",
    emoji: "⚡",
    cost: 75,
    damage: 8,
    range: 2.5,
    fireRate: 1500,
    color: "#34d399",
    description: "Side effects. Damages all enemies in range.",
    reactCode: "useEffect(() => { ... }, [deps])",
    special: "aoe",
  },
  useMemo: {
    id: "useMemo",
    name: "useMemo",
    emoji: "🧠",
    cost: 100,
    damage: 35,
    range: 4,
    fireRate: 2500,
    color: "#f472b6",
    description: "Memoized computation. Slow but powerful.",
    reactCode: "const val = useMemo(() => heavy(), [a])",
    special: "pierce",
  },
  suspense: {
    id: "suspense",
    name: "Suspense",
    emoji: "⏳",
    cost: 80,
    damage: 0,
    range: 2.5,
    fireRate: 0,
    color: "#fbbf24",
    description: "Loading boundary. Slows all enemies in range.",
    reactCode: "<Suspense fallback={<Spinner />}>",
    special: "slow",
  },
  serverComponent: {
    id: "serverComponent",
    name: "RSC",
    emoji: "🖥️",
    cost: 150,
    damage: 50,
    range: 5,
    fireRate: 3500,
    color: "#fb923c",
    description: "Server Component. Massive pre-rendered damage.",
    reactCode: "async function Page() { await db() }",
    special: "splash",
  },
  useHook: {
    id: "useHook",
    name: "use()",
    emoji: "🪝",
    cost: 60,
    damage: 10,
    range: 3,
    fireRate: 1200,
    color: "#22d3ee",
    description: "Resource reader. +50% gold from kills.",
    reactCode: "const data = use(promise)",
    special: "gold",
  },
};

/* ============ Enemy Definitions ============ */
const ENEMIES: Record<string, EnemyDef> = {
  renderBug: {
    id: "renderBug",
    name: "Re-render Bug",
    emoji: "🐛",
    hp: 40,
    speed: 1.2,
    reward: 10,
    color: "#4ade80",
    special: null,
  },
  propDrill: {
    id: "propDrill",
    name: "Prop Drill",
    emoji: "🪱",
    hp: 75,
    speed: 0.8,
    reward: 20,
    color: "#fbbf24",
    special: null,
  },
  memoryLeak: {
    id: "memoryLeak",
    name: "Memory Leak",
    emoji: "💧",
    hp: 140,
    speed: 0.5,
    reward: 35,
    color: "#f87171",
    special: "regen",
  },
  hydrationError: {
    id: "hydrationError",
    name: "Hydration Error",
    emoji: "💥",
    hp: 55,
    speed: 1.5,
    reward: 25,
    color: "#c084fc",
    special: "teleport",
  },
  boss: {
    id: "boss",
    name: "Class Component",
    emoji: "👾",
    hp: 600,
    speed: 0.35,
    reward: 200,
    color: "#ef4444",
    special: null,
  },
};

/* ============ Wave Definitions ============ */
const WAVES: WaveDef[] = [
  { enemies: [{ type: "renderBug", count: 5, interval: 1800 }] },
  { enemies: [{ type: "renderBug", count: 8, interval: 1500 }] },
  { enemies: [{ type: "renderBug", count: 5, interval: 1200 }, { type: "propDrill", count: 3, interval: 2500 }] },
  { enemies: [{ type: "propDrill", count: 6, interval: 1800 }] },
  { enemies: [{ type: "renderBug", count: 8, interval: 1000 }, { type: "propDrill", count: 4, interval: 2000 }, { type: "boss", count: 1, interval: 6000 }] },
  { enemies: [{ type: "memoryLeak", count: 4, interval: 2500 }, { type: "renderBug", count: 6, interval: 1200 }] },
  { enemies: [{ type: "hydrationError", count: 6, interval: 1600 }, { type: "propDrill", count: 3, interval: 2000 }] },
  { enemies: [{ type: "memoryLeak", count: 5, interval: 2200 }, { type: "hydrationError", count: 4, interval: 1800 }] },
  { enemies: [{ type: "renderBug", count: 10, interval: 800 }, { type: "propDrill", count: 6, interval: 1500 }, { type: "memoryLeak", count: 3, interval: 2500 }] },
  { enemies: [{ type: "hydrationError", count: 8, interval: 1200 }, { type: "memoryLeak", count: 4, interval: 2000 }, { type: "boss", count: 2, interval: 5000 }] },
  { enemies: [{ type: "renderBug", count: 15, interval: 600 }, { type: "propDrill", count: 8, interval: 1200 }] },
  { enemies: [{ type: "memoryLeak", count: 6, interval: 1800 }, { type: "hydrationError", count: 6, interval: 1500 }, { type: "boss", count: 1, interval: 8000 }] },
];

/* ============ Grid Constants ============ */
const ROWS = 5;
const COLS = 9;
const CELL_SIZE = 72;

/* ============ Helpers ============ */
const HIGH_SCORE_KEY = "react19-game-highscore";

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0"); } catch { return 0; }
}

function saveHighScore(score: number) {
  try { localStorage.setItem(HIGH_SCORE_KEY, String(score)); } catch { /* noop */ }
}

/* ============ Main Component ============ */
export default function React19GamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [gold, setGold] = useState(200);
  const [lives, setLives] = useState(20);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(0);
  const [waveActive, setWaveActive] = useState(false);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [showTowerInfo, setShowTowerInfo] = useState<string | null>(null);
  const [waveCountdown, setWaveCountdown] = useState(-1);

  const nextIdRef = useRef(1);
  const spawnTimersRef = useRef<NodeJS.Timeout[]>([]);
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const towersRef = useRef(towers);
  const enemiesRef = useRef(enemies);
  const projectilesRef = useRef(projectiles);
  const particlesRef = useRef(particles);
  const goldRef = useRef(gold);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);

  // Keep refs in sync
  useEffect(() => { towersRef.current = towers; }, [towers]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { projectilesRef.current = projectiles; }, [projectiles]);
  useEffect(() => { particlesRef.current = particles; }, [particles]);
  useEffect(() => { goldRef.current = gold; }, [gold]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    setHighScore(loadHighScore());
  }, []);

  const getId = useCallback(() => nextIdRef.current++, []);

  const startGame = useCallback(() => {
    setScreen("playing");
    setGold(200);
    setLives(20);
    setScore(0);
    setWave(0);
    setWaveActive(false);
    setTowers([]);
    setEnemies([]);
    setProjectiles([]);
    setParticles([]);
    setSelectedTower(null);
    setWaveCountdown(-1);
    nextIdRef.current = 1;
  }, []);

  const placeTower = useCallback(
    (row: number, col: number) => {
      if (!selectedTower) return;
      const def = TOWERS[selectedTower];
      if (!def || gold < def.cost) return;
      // Check if cell is occupied
      if (towers.some((t) => t.row === row && t.col === col)) return;
      // Can't place in last column (enemy spawn)
      if (col >= COLS - 1) return;

      setTowers((prev) => [...prev, { id: getId(), type: selectedTower, row, col, lastFire: 0 }]);
      setGold((prev) => prev - def.cost);
    },
    [selectedTower, gold, towers, getId]
  );

  const spawnEnemy = useCallback(
    (type: string) => {
      const def = ENEMIES[type];
      if (!def) return;
      const row = Math.floor(Math.random() * ROWS);
      const hp = def.hp + Math.floor(wave * def.hp * 0.1); // Scale with wave
      setEnemies((prev) => [
        ...prev,
        {
          id: getId(),
          type,
          row,
          x: COLS * CELL_SIZE + 20,
          hp,
          maxHp: hp,
          speed: def.speed,
          reward: def.reward,
          frozen: 0,
        },
      ]);
    },
    [wave, getId]
  );

  const startWave = useCallback(() => {
    if (wave >= WAVES.length) return;
    const waveDef = WAVES[wave];
    setWaveActive(true);
    setWaveCountdown(-1);

    const timers: NodeJS.Timeout[] = [];
    let totalDelay = 0;

    for (const group of waveDef.enemies) {
      for (let i = 0; i < group.count; i++) {
        const delay = totalDelay + i * group.interval;
        const timer = setTimeout(() => spawnEnemy(group.type), delay);
        timers.push(timer);
      }
      totalDelay += group.count * group.interval;
    }

    spawnTimersRef.current = timers;
  }, [wave, spawnEnemy]);

  // Game loop
  useEffect(() => {
    if (screen !== "playing") return;

    const tick = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;
      const dt = Math.min(delta, 50) / 1000; // seconds, capped

      let currentEnemies = [...enemiesRef.current];
      let currentProjectiles = [...projectilesRef.current];
      let currentParticles = [...particlesRef.current];
      let goldDelta = 0;
      let scoreDelta = 0;
      let livesDelta = 0;

      // Move enemies
      currentEnemies = currentEnemies.map((e) => {
        const speedMod = e.frozen > 0 ? 0.4 : 1;
        const newX = e.x - e.speed * speedMod * 60 * dt;
        let newFrozen = Math.max(0, e.frozen - dt);

        // Regen for memory leaks
        const def = ENEMIES[e.type];
        let newHp = e.hp;
        if (def?.special === "regen") {
          newHp = Math.min(e.maxHp, e.hp + 2 * dt);
        }

        // Teleport for hydration errors
        if (def?.special === "teleport" && Math.random() < 0.002) {
          return { ...e, x: newX - 40, hp: newHp, frozen: newFrozen };
        }

        return { ...e, x: newX, hp: newHp, frozen: newFrozen };
      });

      // Check enemies reaching left edge
      const surviving: Enemy[] = [];
      for (const e of currentEnemies) {
        if (e.x < -10) {
          livesDelta -= 1;
        } else {
          surviving.push(e);
        }
      }
      currentEnemies = surviving;

      // Tower attacks
      const now = timestamp;
      for (const tower of towersRef.current) {
        const def = TOWERS[tower.type];
        if (!def || def.damage === 0) continue;
        if (now - tower.lastFire < def.fireRate) continue;

        // Find target in range
        const towerX = (tower.col + 0.5) * CELL_SIZE;
        const towerY = (tower.row + 0.5) * CELL_SIZE;
        const rangePixels = def.range * CELL_SIZE;

        if (def.special === "slow") {
          // Slow all enemies in range
          currentEnemies = currentEnemies.map((e) => {
            const eY = (e.row + 0.5) * CELL_SIZE;
            const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
            if (dist <= rangePixels) {
              return { ...e, frozen: 2 };
            }
            return e;
          });
          // Update tower fire time
          setTowers((prev) =>
            prev.map((t) => (t.id === tower.id ? { ...t, lastFire: now } : t))
          );
          continue;
        }

        let target: Enemy | undefined;
        let minDist = Infinity;
        for (const e of currentEnemies) {
          const eY = (e.row + 0.5) * CELL_SIZE;
          const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
          if (dist <= rangePixels && dist < minDist) {
            minDist = dist;
            target = e;
          }
        }

        if (target) {
          // AOE: damage all in range
          if (def.special === "aoe") {
            currentEnemies = currentEnemies.map((e) => {
              const eY = (e.row + 0.5) * CELL_SIZE;
              const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
              if (dist <= rangePixels) {
                return { ...e, hp: e.hp - def.damage };
              }
              return e;
            });
            // AOE visual
            currentParticles.push(
              ...Array.from({ length: 6 }, () => ({
                x: towerX,
                y: towerY,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 0.5,
                color: def.color,
                size: 4,
              }))
            );
          } else {
            // Single target projectile
            currentProjectiles.push({
              id: getId(),
              x: towerX,
              y: towerY,
              targetId: target.id,
              damage: def.damage,
              color: def.color,
              speed: 400,
              special: def.special,
            });
          }
          setTowers((prev) =>
            prev.map((t) => (t.id === tower.id ? { ...t, lastFire: now } : t))
          );
        }
      }

      // Move projectiles and check hits
      const activeProjectiles: Projectile[] = [];
      for (const p of currentProjectiles) {
        const target = currentEnemies.find((e) => e.id === p.targetId);
        if (!target) continue;

        const tY = (target.row + 0.5) * CELL_SIZE;
        const dx = target.x - p.x;
        const dy = tY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15) {
          // Hit!
          target.hp -= p.damage;

          // Splash damage
          if (p.special === "splash") {
            currentEnemies = currentEnemies.map((e) => {
              if (e.id === target.id) return e;
              const eY = (e.row + 0.5) * CELL_SIZE;
              const sDist = Math.sqrt((e.x - target.x) ** 2 + (eY - tY) ** 2);
              if (sDist < CELL_SIZE * 1.5) {
                return { ...e, hp: e.hp - p.damage * 0.5 };
              }
              return e;
            });
          }

          // Hit particles
          currentParticles.push(
            ...Array.from({ length: 3 }, () => ({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 150,
              vy: (Math.random() - 0.5) * 150,
              life: 0.4,
              color: p.color,
              size: 3,
            }))
          );
        } else {
          const speed = p.speed * dt;
          const moveX = (dx / dist) * speed;
          const moveY = (dy / dist) * speed;
          activeProjectiles.push({ ...p, x: p.x + moveX, y: p.y + moveY });
        }
      }
      currentProjectiles = activeProjectiles;

      // Remove dead enemies
      const aliveEnemies: Enemy[] = [];
      for (const e of currentEnemies) {
        if (e.hp <= 0) {
          // Check if towers with gold bonus are nearby
          const hasGoldTower = towersRef.current.some((t) => {
            if (TOWERS[t.type]?.special !== "gold") return false;
            const tX = (t.col + 0.5) * CELL_SIZE;
            const tY = (t.row + 0.5) * CELL_SIZE;
            const eY = (e.row + 0.5) * CELL_SIZE;
            const dist = Math.sqrt((e.x - tX) ** 2 + (eY - tY) ** 2);
            return dist <= TOWERS[t.type].range * CELL_SIZE;
          });
          const rewardMult = hasGoldTower ? 1.5 : 1;
          goldDelta += Math.floor(e.reward * rewardMult);
          scoreDelta += e.reward;

          // Death particles
          const eY = (e.row + 0.5) * CELL_SIZE;
          currentParticles.push(
            ...Array.from({ length: 8 }, () => ({
              x: e.x,
              y: eY,
              vx: (Math.random() - 0.5) * 250,
              vy: (Math.random() - 0.5) * 250,
              life: 0.6,
              color: ENEMIES[e.type]?.color || "#fff",
              size: 5,
            }))
          );
        } else {
          aliveEnemies.push(e);
        }
      }
      currentEnemies = aliveEnemies;

      // Update particles
      currentParticles = currentParticles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt,
          size: p.size * 0.97,
        }))
        .filter((p) => p.life > 0);

      // Apply state updates
      setEnemies(currentEnemies);
      setProjectiles(currentProjectiles);
      setParticles(currentParticles);
      if (goldDelta) setGold((g) => g + goldDelta);
      if (scoreDelta) setScore((s) => s + scoreDelta);
      if (livesDelta) setLives((l) => Math.max(0, l + livesDelta));

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [screen, getId]);

  // Check wave complete
  useEffect(() => {
    if (!waveActive) return;
    if (enemies.length === 0 && spawnTimersRef.current.length === 0) return;

    // Check if all spawn timers have fired and no enemies remain
    const checkComplete = setTimeout(() => {
      if (enemiesRef.current.length === 0) {
        setWaveActive(false);
        setWave((w) => w + 1);
      }
    }, 500);

    return () => clearTimeout(checkComplete);
  }, [enemies.length, waveActive]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && screen === "playing") {
      cancelAnimationFrame(gameLoopRef.current);
      spawnTimersRef.current.forEach(clearTimeout);
      spawnTimersRef.current = [];
      if (score > highScore) {
        setHighScore(score);
        saveHighScore(score);
      }
      setScreen("gameover");
    }
  }, [lives, screen, score, highScore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      spawnTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const isBossWave = wave < WAVES.length && WAVES[wave]?.enemies.some((e) => e.type === "boss");

  /* ============ Canvas Rendering ============ */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (screen !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const w = COLS * CELL_SIZE;
      const h = ROWS * CELL_SIZE;
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL_SIZE);
        ctx.lineTo(w, r * CELL_SIZE);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL_SIZE, 0);
        ctx.lineTo(c * CELL_SIZE, h);
        ctx.stroke();
      }

      // Draw lane indicators
      for (let r = 0; r < ROWS; r++) {
        ctx.fillStyle = r % 2 === 0 ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)";
        ctx.fillRect(0, r * CELL_SIZE, w, CELL_SIZE);
      }

      // Draw towers
      for (const tower of towersRef.current) {
        const def = TOWERS[tower.type];
        if (!def) continue;
        const x = (tower.col + 0.5) * CELL_SIZE;
        const y = (tower.row + 0.5) * CELL_SIZE;

        // Tower base
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = def.color + "33";
        ctx.fill();
        ctx.strokeStyle = def.color + "88";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tower emoji
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(def.emoji, x, y + 1);

        // Slow tower range indicator
        if (def.special === "slow") {
          ctx.beginPath();
          ctx.arc(x, y, def.range * CELL_SIZE, 0, Math.PI * 2);
          ctx.fillStyle = "#fbbf2408";
          ctx.fill();
          ctx.strokeStyle = "#fbbf2420";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw enemies
      for (const enemy of enemiesRef.current) {
        const def = ENEMIES[enemy.type];
        if (!def) continue;
        const y = (enemy.row + 0.5) * CELL_SIZE;
        const size = def.id === "boss" ? 20 : 14;

        // Enemy body
        ctx.beginPath();
        ctx.arc(enemy.x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = def.color + "cc";
        ctx.fill();
        if (enemy.frozen > 0) {
          ctx.strokeStyle = "#22d3ee88";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Emoji
        ctx.font = `${size + 4}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(def.emoji, enemy.x, y + 1);

        // HP bar
        const hpWidth = size * 2;
        const hpHeight = 3;
        const hpX = enemy.x - hpWidth / 2;
        const hpY = y - size - 6;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(hpX, hpY, hpWidth, hpHeight);
        const hpRatio = enemy.hp / enemy.maxHp;
        const hpColor = hpRatio > 0.5 ? "#4ade80" : hpRatio > 0.25 ? "#fbbf24" : "#ef4444";
        ctx.fillStyle = hpColor;
        ctx.fillRect(hpX, hpY, hpWidth * hpRatio, hpHeight);
      }

      // Draw projectiles
      for (const p of projectilesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw particles
      for (const p of particlesRef.current) {
        ctx.globalAlpha = Math.max(0, p.life / 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(render);
    };

    const renderLoop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderLoop);
  }, [screen]);

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
            <div className={styles.menuIcon}>⚛️</div>
            <h1 className={styles.menuTitle}>React vs Bugs</h1>
            <p className={styles.menuSubtitle}>{t("react19-game-subtitle")}</p>
            {highScore > 0 && (
              <div className={styles.menuHighScore}>
                🏆 {t("react19-game-highscore")}: {highScore}
              </div>
            )}
            <div className={styles.menuTowers}>
              {Object.values(TOWERS).map((tower) => (
                <div key={tower.id} className={styles.menuTowerPreview}>
                  <span>{tower.emoji}</span>
                  <span className={styles.menuTowerName}>{tower.name}</span>
                </div>
              ))}
            </div>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
            >
              <PlayIcon /> {t("react19-game-start")}
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

  /* ============ Game Over Screen ============ */
  if (screen === "gameover") {
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
            className={styles.gameOverScreen}
          >
            <div className={styles.gameOverIcon}>💔</div>
            <h1 className={styles.gameOverTitle}>{t("react19-game-over")}</h1>
            <div className={styles.gameOverStats}>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{wave}</span>
                <span className={styles.gameOverStatLabel}>{t("react19-game-waves")}</span>
              </div>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{score}</span>
                <span className={styles.gameOverStatLabel}>{t("react19-game-score")}</span>
              </div>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{towers.length}</span>
                <span className={styles.gameOverStatLabel}>{t("react19-game-towers-placed")}</span>
              </div>
            </div>
            {score >= highScore && score > 0 && (
              <div className={styles.newHighScore}>🏆 {t("react19-game-new-highscore")}!</div>
            )}
            <div className={styles.gameOverBtns}>
              <motion.button
                className={styles.playBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
              >
                {t("react19-game-retry")}
              </motion.button>
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

  /* ============ Playing Screen ============ */
  return (
    <main>
      <DeveloperHeader />
      <div className={styles.container}>
        <div className={styles.bgEffects}>
          <div className={styles.bgGradient1} />
          <div className={styles.bgGradient2} />
        </div>

        <div className={styles.gameArea}>
          {/* Top HUD */}
          <div className={styles.hud}>
            <button className={styles.hudBack} onClick={() => setScreen("menu")}>
              <ArrowBack />
            </button>
            <div className={styles.hudStat}>
              <span>💰</span> <span className={styles.hudGold}>{gold}</span>
            </div>
            <div className={styles.hudStat}>
              <span>❤️</span> <span className={styles.hudLives}>{lives}</span>
            </div>
            <div className={styles.hudStat}>
              <span>🏆</span> <span>{score}</span>
            </div>
            <div className={`${styles.hudWave} ${isBossWave ? styles.hudWaveBoss : ""}`}>
              {isBossWave && <span className={styles.bossLabel}>BOSS</span>}
              {t("react19-game-wave")} {wave + 1}/{WAVES.length}
            </div>
          </div>

          {/* Game Canvas */}
          <div className={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={COLS * CELL_SIZE}
              height={ROWS * CELL_SIZE}
              className={styles.canvas}
            />
            {/* Clickable grid overlay */}
            <div
              className={styles.gridOverlay}
              style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}
            >
              {Array.from({ length: ROWS * COLS }, (_, i) => {
                const row = Math.floor(i / COLS);
                const col = i % COLS;
                const hasTower = towers.some((t) => t.row === row && t.col === col);
                const canPlace = selectedTower && !hasTower && col < COLS - 1 && gold >= (TOWERS[selectedTower]?.cost || Infinity);
                return (
                  <div
                    key={i}
                    className={`${styles.gridCell} ${canPlace ? styles.gridCellActive : ""} ${hasTower ? styles.gridCellOccupied : ""}`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    onClick={() => canPlace && placeTower(row, col)}
                  />
                );
              })}
            </div>
          </div>

          {/* Wave Controls */}
          {!waveActive && wave < WAVES.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.waveStart}
            >
              <motion.button
                className={styles.waveStartBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startWave}
              >
                <PlayIcon /> {t("react19-game-start-wave")} {wave + 1}
                {isBossWave && " 👾"}
              </motion.button>
            </motion.div>
          )}

          {wave >= WAVES.length && !waveActive && enemies.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.victoryBanner}
            >
              🎉 {t("react19-game-victory")}! Score: {score}
            </motion.div>
          )}

          {/* Tower Selection */}
          <div className={styles.towerBar}>
            <div className={styles.towerBarLabel}>{t("react19-game-towers")}</div>
            <div className={styles.towerGrid}>
              {Object.values(TOWERS).map((tower) => {
                const selected = selectedTower === tower.id;
                const canAfford = gold >= tower.cost;
                return (
                  <motion.button
                    key={tower.id}
                    className={`${styles.towerCard} ${selected ? styles.towerCardSelected : ""} ${!canAfford ? styles.towerCardDisabled : ""}`}
                    style={{ borderColor: selected ? tower.color : `${tower.color}44` }}
                    whileHover={canAfford ? { scale: 1.03 } : {}}
                    whileTap={canAfford ? { scale: 0.97 } : {}}
                    onClick={() => {
                      if (canAfford) {
                        setSelectedTower(selected ? null : tower.id);
                        setShowTowerInfo(selected ? null : tower.id);
                      }
                    }}
                  >
                    <span className={styles.towerEmoji}>{tower.emoji}</span>
                    <span className={styles.towerName} style={{ color: tower.color }}>{tower.name}</span>
                    <span className={styles.towerCost}>💰 {tower.cost}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Tower Info */}
          <AnimatePresence>
            {showTowerInfo && TOWERS[showTowerInfo] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={styles.towerInfo}
              >
                <span className={styles.towerInfoEmoji}>{TOWERS[showTowerInfo].emoji}</span>
                <div className={styles.towerInfoContent}>
                  <span className={styles.towerInfoName} style={{ color: TOWERS[showTowerInfo].color }}>
                    {TOWERS[showTowerInfo].name}
                  </span>
                  <span className={styles.towerInfoDesc}>{TOWERS[showTowerInfo].description}</span>
                  <code className={styles.towerInfoCode}>{TOWERS[showTowerInfo].reactCode}</code>
                  <div className={styles.towerInfoStats}>
                    {TOWERS[showTowerInfo].damage > 0 && <span>⚔️ {TOWERS[showTowerInfo].damage}</span>}
                    <span>📏 {TOWERS[showTowerInfo].range}</span>
                    {TOWERS[showTowerInfo].fireRate > 0 && <span>⏱️ {(TOWERS[showTowerInfo].fireRate / 1000).toFixed(1)}s</span>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
}
