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
import styles from "./SpringBootGame.module.css";

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
  springCode: string;
  special: string | null;
}

interface Tower {
  id: number;
  type: string;
  row: number;
  col: number;
  lastFire: number;
  cacheLastType: string | null;
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
  frozen: number;
  stealthTimer: number;
  stealthVisible: boolean;
  splitDone: boolean;
  cloneDone: boolean;
  teleportTimer: number;
  disguised: boolean;
  isBoss: boolean;
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
  towerId: number;
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
  restController: {
    id: "restController",
    name: "@RestController",
    emoji: "\uD83C\uDFAF",
    cost: 50,
    damage: 12,
    range: 3,
    fireRate: 1000,
    color: "#818cf8",
    description: "Routes HTTP requests to handler methods",
    springCode: "@RestController class UserApi",
    special: null,
  },
  service: {
    id: "service",
    name: "@Service",
    emoji: "\u2699\uFE0F",
    cost: 75,
    damage: 18,
    range: 2.5,
    fireRate: 1500,
    color: "#34d399",
    description: "Business logic layer. AOE damage",
    springCode: "@Service class UserService",
    special: "aoe",
  },
  repository: {
    id: "repository",
    name: "@Repository",
    emoji: "\uD83D\uDDC4\uFE0F",
    cost: 60,
    damage: 15,
    range: 3,
    fireRate: 1200,
    color: "#f472b6",
    description: "Data access layer. Pierce through enemies",
    springCode: "@Repository interface UserRepo",
    special: "pierce",
  },
  transactional: {
    id: "transactional",
    name: "@Transactional",
    emoji: "\uD83D\uDD12",
    cost: 100,
    damage: 25,
    range: 2,
    fireRate: 2500,
    color: "#fb923c",
    description: "Transaction management. Rollback kills debuffed enemies",
    springCode: "@Transactional fun save()",
    special: "execute",
  },
  autowired: {
    id: "autowired",
    name: "@Autowired",
    emoji: "\uD83D\uDD0C",
    cost: 40,
    damage: 8,
    range: 4,
    fireRate: 1200,
    color: "#22d3ee",
    description: "Dependency injection. Boosts adjacent towers +30%",
    springCode: "@Autowired lateinit var svc",
    special: "boost",
  },
  valid: {
    id: "valid",
    name: "@Valid",
    emoji: "\u2705",
    cost: 80,
    damage: 20,
    range: 3,
    fireRate: 1800,
    color: "#fbbf24",
    description: "Bean validation. Slows enemies in range",
    springCode: "fun create(@Valid dto: User)",
    special: "slow",
  },
  cacheable: {
    id: "cacheable",
    name: "@Cacheable",
    emoji: "\uD83D\uDCBE",
    cost: 90,
    damage: 30,
    range: 2.5,
    fireRate: 2000,
    color: "#a78bfa",
    description: "Caching. Double damage on same enemy type",
    springCode: '@Cacheable("users") fun find()',
    special: "cache",
  },
  exceptionHandler: {
    id: "exceptionHandler",
    name: "@ExceptionHandler",
    emoji: "\uD83D\uDEE1\uFE0F",
    cost: 120,
    damage: 45,
    range: 3.5,
    fireRate: 3000,
    color: "#ef4444",
    description: "Global error handling. 3x damage to bosses",
    springCode: "@ExceptionHandler fun handle()",
    special: "boss_killer",
  },
  async: {
    id: "async",
    name: "@Async",
    emoji: "\u26A1",
    cost: 110,
    damage: 20,
    range: 3,
    fireRate: 800,
    color: "#10b981",
    description: "Async execution. Fires twice per cycle",
    springCode: "@Async fun process()",
    special: "double_shot",
  },
};

/* ============ Enemy Definitions ============ */
const ENEMIES: Record<string, EnemyDef> = {
  nullPointer: {
    id: "nullPointer",
    name: "NullPointerException",
    emoji: "\uD83D\uDC1B",
    hp: 40,
    speed: 1.2,
    reward: 10,
    color: "#4ade80",
    special: null,
  },
  notFound: {
    id: "notFound",
    name: "404 Not Found",
    emoji: "\uD83D\uDC7B",
    hp: 60,
    speed: 1.5,
    reward: 20,
    color: "#94a3b8",
    special: "stealth",
  },
  internalError: {
    id: "internalError",
    name: "500 Internal Error",
    emoji: "\uD83D\uDCA5",
    hp: 100,
    speed: 0.8,
    reward: 30,
    color: "#f87171",
    special: "split",
  },
  circularDep: {
    id: "circularDep",
    name: "CircularDependency",
    emoji: "\uD83D\uDD04",
    hp: 120,
    speed: 0.6,
    reward: 35,
    color: "#c084fc",
    special: "regen",
  },
  stackOverflow: {
    id: "stackOverflow",
    name: "StackOverflow",
    emoji: "\uD83D\uDCDA",
    hp: 80,
    speed: 1.0,
    reward: 25,
    color: "#fbbf24",
    special: "clone",
  },
  classCast: {
    id: "classCast",
    name: "ClassCastException",
    emoji: "\uD83C\uDFAD",
    hp: 90,
    speed: 1.1,
    reward: 28,
    color: "#f472b6",
    special: "disguise",
  },
  outOfMemory: {
    id: "outOfMemory",
    name: "OutOfMemoryError",
    emoji: "\uD83E\uDDE0",
    hp: 600,
    speed: 0.35,
    reward: 200,
    color: "#ef4444",
    special: "teleport",
  },
};

/* ============ Wave Definitions (25+) ============ */
const WAVES: WaveDef[] = [
  // Waves 1-5: basic enemies only
  { enemies: [{ type: "nullPointer", count: 5, interval: 1800 }] },
  { enemies: [{ type: "nullPointer", count: 8, interval: 1500 }] },
  { enemies: [{ type: "nullPointer", count: 6, interval: 1200 }, { type: "notFound", count: 3, interval: 2200 }] },
  { enemies: [{ type: "notFound", count: 5, interval: 1800 }, { type: "nullPointer", count: 4, interval: 1400 }] },
  { enemies: [{ type: "nullPointer", count: 10, interval: 1000 }, { type: "notFound", count: 5, interval: 1600 }] },
  // Waves 6-10: introduce CircularDependency and split enemies
  { enemies: [{ type: "internalError", count: 4, interval: 2500 }, { type: "nullPointer", count: 6, interval: 1200 }] },
  { enemies: [{ type: "circularDep", count: 3, interval: 2800 }, { type: "notFound", count: 5, interval: 1600 }, { type: "nullPointer", count: 4, interval: 1200 }] },
  { enemies: [{ type: "internalError", count: 5, interval: 2200 }, { type: "circularDep", count: 3, interval: 2500 }, { type: "outOfMemory", count: 1, interval: 6000 }] },
  { enemies: [{ type: "stackOverflow", count: 5, interval: 1800 }, { type: "internalError", count: 4, interval: 2000 }, { type: "circularDep", count: 3, interval: 2500 }] },
  { enemies: [{ type: "nullPointer", count: 12, interval: 800 }, { type: "circularDep", count: 4, interval: 2200 }, { type: "internalError", count: 3, interval: 2500 }] },
  // Waves 11-15: all enemy types, faster spawns
  { enemies: [{ type: "classCast", count: 5, interval: 1600 }, { type: "stackOverflow", count: 4, interval: 1800 }, { type: "notFound", count: 6, interval: 1200 }] },
  { enemies: [{ type: "circularDep", count: 5, interval: 2000 }, { type: "classCast", count: 4, interval: 1600 }, { type: "internalError", count: 3, interval: 2200 }] },
  { enemies: [{ type: "nullPointer", count: 15, interval: 600 }, { type: "stackOverflow", count: 5, interval: 1500 }, { type: "outOfMemory", count: 1, interval: 8000 }] },
  { enemies: [{ type: "notFound", count: 8, interval: 1200 }, { type: "classCast", count: 6, interval: 1400 }, { type: "circularDep", count: 4, interval: 2000 }] },
  { enemies: [{ type: "internalError", count: 6, interval: 1800 }, { type: "stackOverflow", count: 5, interval: 1600 }, { type: "classCast", count: 4, interval: 1800 }, { type: "circularDep", count: 3, interval: 2200 }] },
  // Waves 16-20: heavy mixed waves with bosses every 3 waves
  { enemies: [{ type: "nullPointer", count: 20, interval: 500 }, { type: "circularDep", count: 5, interval: 2000 }, { type: "outOfMemory", count: 1, interval: 6000 }] },
  { enemies: [{ type: "classCast", count: 8, interval: 1200 }, { type: "internalError", count: 6, interval: 1500 }, { type: "stackOverflow", count: 5, interval: 1800 }] },
  { enemies: [{ type: "notFound", count: 10, interval: 1000 }, { type: "circularDep", count: 6, interval: 1800 }, { type: "classCast", count: 5, interval: 1600 }] },
  { enemies: [{ type: "internalError", count: 8, interval: 1400 }, { type: "stackOverflow", count: 6, interval: 1500 }, { type: "outOfMemory", count: 2, interval: 5000 }] },
  { enemies: [{ type: "nullPointer", count: 25, interval: 400 }, { type: "circularDep", count: 6, interval: 1600 }, { type: "classCast", count: 5, interval: 1800 }, { type: "internalError", count: 4, interval: 2000 }] },
  // Waves 21-25: extreme mode
  { enemies: [{ type: "circularDep", count: 8, interval: 1400 }, { type: "classCast", count: 7, interval: 1200 }, { type: "stackOverflow", count: 6, interval: 1500 }, { type: "outOfMemory", count: 1, interval: 7000 }] },
  { enemies: [{ type: "internalError", count: 10, interval: 1000 }, { type: "notFound", count: 12, interval: 800 }, { type: "circularDep", count: 5, interval: 1800 }] },
  { enemies: [{ type: "classCast", count: 10, interval: 1000 }, { type: "stackOverflow", count: 8, interval: 1200 }, { type: "outOfMemory", count: 2, interval: 5000 }] },
  { enemies: [{ type: "nullPointer", count: 30, interval: 300 }, { type: "circularDep", count: 8, interval: 1400 }, { type: "internalError", count: 6, interval: 1600 }, { type: "outOfMemory", count: 1, interval: 8000 }] },
  { enemies: [{ type: "circularDep", count: 10, interval: 1200 }, { type: "classCast", count: 8, interval: 1000 }, { type: "stackOverflow", count: 8, interval: 1200 }, { type: "internalError", count: 6, interval: 1400 }, { type: "outOfMemory", count: 3, interval: 4000 }] },
];

/* ============ Endless Wave Generator ============ */
function generateEndlessWave(waveNum: number): WaveDef {
  const hpScale = 1 + (waveNum - 25) * 0.15;
  const types = ["nullPointer", "notFound", "internalError", "circularDep", "stackOverflow", "classCast"];
  const enemies: WaveDef["enemies"] = [];

  // Mix of all types with increasing counts
  for (const t of types) {
    enemies.push({
      type: t,
      count: Math.floor(5 + (waveNum - 25) * 1.5),
      interval: Math.max(300, 1400 - (waveNum - 25) * 40),
    });
  }

  // Boss every 2 waves in endless
  if (waveNum % 2 === 0) {
    enemies.push({
      type: "outOfMemory",
      count: Math.floor(1 + (waveNum - 25) * 0.5),
      interval: 4000,
    });
  }

  // Scale HP via the count multiplier (actual HP scaling happens in spawnEnemy)
  return { enemies };
}

/* ============ Grid Constants ============ */
const ROWS = 5;
const COLS = 9;
const CELL_SIZE = 72;

/* ============ Helpers ============ */
const HIGH_SCORE_KEY = "springboot-game-highscore";

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0"); } catch { return 0; }
}

function saveHighScore(score: number) {
  try { localStorage.setItem(HIGH_SCORE_KEY, String(score)); } catch { /* noop */ }
}

/* ============ Main Component ============ */
export default function SpringBootGamePage() {
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
  const [isEndless, setIsEndless] = useState(false);

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
  const waveRef = useRef(wave);
  const spawnDoneRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { towersRef.current = towers; }, [towers]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { projectilesRef.current = projectiles; }, [projectiles]);
  useEffect(() => { particlesRef.current = particles; }, [particles]);
  useEffect(() => { goldRef.current = gold; }, [gold]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { waveRef.current = wave; }, [wave]);

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
    setIsEndless(false);
    nextIdRef.current = 1;
    spawnDoneRef.current = false;
  }, []);

  const placeTower = useCallback(
    (row: number, col: number) => {
      if (!selectedTower) return;
      const def = TOWERS[selectedTower];
      if (!def || gold < def.cost) return;
      if (towers.some((t) => t.row === row && t.col === col)) return;
      if (col >= COLS - 1) return;

      setTowers((prev) => [
        ...prev,
        { id: getId(), type: selectedTower, row, col, lastFire: 0, cacheLastType: null },
      ]);
      setGold((prev) => prev - def.cost);
    },
    [selectedTower, gold, towers, getId]
  );

  const spawnEnemy = useCallback(
    (type: string, hpMultiplier: number = 1) => {
      const def = ENEMIES[type];
      if (!def) return;
      const row = Math.floor(Math.random() * ROWS);
      const baseHp = def.hp + Math.floor(waveRef.current * def.hp * 0.1);
      const hp = Math.floor(baseHp * hpMultiplier);
      const isBoss = type === "outOfMemory";
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
          stealthTimer: 0,
          stealthVisible: true,
          splitDone: false,
          cloneDone: false,
          teleportTimer: 0,
          disguised: def.special === "disguise",
          isBoss,
        },
      ]);
    },
    [getId]
  );

  const startWave = useCallback(() => {
    let waveDef: WaveDef;
    if (wave < WAVES.length) {
      waveDef = WAVES[wave];
    } else {
      waveDef = generateEndlessWave(wave);
      setIsEndless(true);
    }

    setWaveActive(true);
    setWaveCountdown(-1);
    spawnDoneRef.current = false;

    const hpMultiplier = wave >= 20 ? 1 + (wave - 20) * 0.2 : 1;

    const timers: NodeJS.Timeout[] = [];
    let totalDelay = 0;
    let totalSpawns = 0;

    for (const group of waveDef.enemies) {
      for (let i = 0; i < group.count; i++) {
        totalSpawns++;
        const delay = totalDelay + i * group.interval;
        const timer = setTimeout(() => spawnEnemy(group.type, hpMultiplier), delay);
        timers.push(timer);
      }
      totalDelay += group.count * group.interval;
    }

    // Mark spawning done after all timers fire
    const doneTimer = setTimeout(() => {
      spawnDoneRef.current = true;
    }, totalDelay + 200);
    timers.push(doneTimer);

    spawnTimersRef.current = timers;
  }, [wave, spawnEnemy]);

  /* ============ Autowired boost helper ============ */
  const getBoostMultiplier = useCallback((towerRow: number, towerCol: number): number => {
    let boost = 1.0;
    for (const t of towersRef.current) {
      if (TOWERS[t.type]?.special !== "boost") continue;
      const dr = Math.abs(t.row - towerRow);
      const dc = Math.abs(t.col - towerCol);
      if (dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0)) {
        boost += 0.3;
      }
    }
    return boost;
  }, []);

  /* ============ Game Loop ============ */
  useEffect(() => {
    if (screen !== "playing") return;

    const tick = (timestamp: number) => {
      const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;
      const dt = Math.min(delta, 50) / 1000;

      let currentEnemies = [...enemiesRef.current];
      let currentProjectiles = [...projectilesRef.current];
      let currentParticles = [...particlesRef.current];
      let goldDelta = 0;
      let scoreDelta = 0;
      let livesDelta = 0;
      const newEnemies: Enemy[] = [];

      // Move enemies and apply specials
      currentEnemies = currentEnemies.map((e) => {
        const def = ENEMIES[e.type];
        if (!def) return e;

        const speedMod = e.frozen > 0 ? 0.4 : 1;
        let newX = e.x - e.speed * speedMod * 60 * dt;
        let newFrozen = Math.max(0, e.frozen - dt);
        let newHp = e.hp;
        let newStealthTimer = e.stealthTimer + dt;
        let newStealthVisible = e.stealthVisible;
        let newTeleportTimer = e.teleportTimer + dt;
        let newRow = e.row;
        let newDisguised = e.disguised;

        // Regen for CircularDependency
        if (def.special === "regen") {
          newHp = Math.min(e.maxHp, e.hp + 2 * dt);
        }

        // Stealth for 404 Not Found (invisible 1s every 3s)
        if (def.special === "stealth") {
          const cycle = newStealthTimer % 4;
          newStealthVisible = cycle < 3;
        }

        // Teleport for OutOfMemoryError boss (random row every 4s)
        if (def.special === "teleport" && newTeleportTimer >= 4) {
          const otherRows = [0, 1, 2, 3, 4].filter((r) => r !== e.row);
          newRow = otherRows[Math.floor(Math.random() * otherRows.length)];
          newTeleportTimer = 0;
        }

        // Disguise for ClassCastException - reveal when near towers
        if (def.special === "disguise" && e.disguised) {
          for (const t of towersRef.current) {
            const tX = (t.col + 0.5) * CELL_SIZE;
            const tY = (t.row + 0.5) * CELL_SIZE;
            const eY = (e.row + 0.5) * CELL_SIZE;
            const dist = Math.sqrt((e.x - tX) ** 2 + (eY - tY) ** 2);
            const towerDef = TOWERS[t.type];
            if (towerDef && dist <= towerDef.range * CELL_SIZE) {
              newDisguised = false;
              break;
            }
          }
        }

        return {
          ...e,
          x: newX,
          hp: newHp,
          frozen: newFrozen,
          row: newRow,
          stealthTimer: newStealthTimer,
          stealthVisible: newStealthVisible,
          teleportTimer: newTeleportTimer,
          disguised: newDisguised,
        };
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
        if (!def) continue;

        // @Autowired towers don't attack directly - they boost others
        if (def.special === "boost") {
          // Still fires projectiles for its base damage
          if (def.damage === 0) continue;
        }

        if (now - tower.lastFire < def.fireRate) continue;

        const towerX = (tower.col + 0.5) * CELL_SIZE;
        const towerY = (tower.row + 0.5) * CELL_SIZE;
        const rangePixels = def.range * CELL_SIZE;
        const boostMult = getBoostMultiplier(tower.row, tower.col);

        // @Valid slows all enemies in range
        if (def.special === "slow") {
          let slowed = false;
          currentEnemies = currentEnemies.map((e) => {
            if (!e.stealthVisible && ENEMIES[e.type]?.special === "stealth") return e;
            const eY = (e.row + 0.5) * CELL_SIZE;
            const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
            if (dist <= rangePixels) {
              slowed = true;
              // Also deal damage with boost
              const dmg = Math.floor(def.damage * boostMult);
              return { ...e, frozen: 2, hp: e.hp - dmg };
            }
            return e;
          });
          if (slowed) {
            setTowers((prev) =>
              prev.map((t) => (t.id === tower.id ? { ...t, lastFire: now } : t))
            );
            // Slow visual particles
            currentParticles.push(
              ...Array.from({ length: 4 }, () => ({
                x: towerX,
                y: towerY,
                vx: (Math.random() - 0.5) * 120,
                vy: (Math.random() - 0.5) * 120,
                life: 0.5,
                color: def.color,
                size: 3,
              }))
            );
          }
          continue;
        }

        // @Service AOE: damage all enemies in range
        if (def.special === "aoe") {
          let hit = false;
          currentEnemies = currentEnemies.map((e) => {
            if (!e.stealthVisible && ENEMIES[e.type]?.special === "stealth") return e;
            const eY = (e.row + 0.5) * CELL_SIZE;
            const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
            if (dist <= rangePixels) {
              hit = true;
              const dmg = Math.floor(def.damage * boostMult);
              return { ...e, hp: e.hp - dmg };
            }
            return e;
          });
          if (hit) {
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
            setTowers((prev) =>
              prev.map((t) => (t.id === tower.id ? { ...t, lastFire: now } : t))
            );
          }
          continue;
        }

        // Find target in range
        let target: Enemy | undefined;
        let minDist = Infinity;
        for (const e of currentEnemies) {
          if (!e.stealthVisible && ENEMIES[e.type]?.special === "stealth") continue;
          const eY = (e.row + 0.5) * CELL_SIZE;
          const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
          if (dist <= rangePixels && dist < minDist) {
            minDist = dist;
            target = e;
          }
        }

        if (target) {
          let dmg = Math.floor(def.damage * boostMult);

          // @Transactional: instant kill on frozen/slowed enemies
          if (def.special === "execute" && target.frozen > 0) {
            dmg = target.hp + 1;
          }

          // @ExceptionHandler: 3x damage to bosses
          if (def.special === "boss_killer" && target.isBoss) {
            dmg = Math.floor(dmg * 3);
          }

          // @Cacheable: double damage on same enemy type
          if (def.special === "cache") {
            if (tower.cacheLastType === target.type) {
              dmg = Math.floor(dmg * 2);
            }
            setTowers((prev) =>
              prev.map((t) =>
                t.id === tower.id
                  ? { ...t, lastFire: now, cacheLastType: target!.type }
                  : t
              )
            );
          } else {
            setTowers((prev) =>
              prev.map((t) => (t.id === tower.id ? { ...t, lastFire: now } : t))
            );
          }

          // @Async: fire 2 projectiles
          if (def.special === "double_shot") {
            currentProjectiles.push({
              id: getId(),
              x: towerX,
              y: towerY,
              targetId: target.id,
              damage: dmg,
              color: def.color,
              speed: 400,
              special: def.special,
              towerId: tower.id,
            });
            currentProjectiles.push({
              id: getId(),
              x: towerX + 5,
              y: towerY - 5,
              targetId: target.id,
              damage: dmg,
              color: def.color,
              speed: 380,
              special: def.special,
              towerId: tower.id,
            });
          } else {
            currentProjectiles.push({
              id: getId(),
              x: towerX,
              y: towerY,
              targetId: target.id,
              damage: dmg,
              color: def.color,
              speed: 400,
              special: def.special,
              towerId: tower.id,
            });
          }

          // @Repository pierce: if pierce, add second projectile targeting next enemy
          if (def.special === "pierce") {
            let secondTarget: Enemy | undefined;
            let secondDist = Infinity;
            for (const e of currentEnemies) {
              if (e.id === target.id) continue;
              if (!e.stealthVisible && ENEMIES[e.type]?.special === "stealth") continue;
              const eY = (e.row + 0.5) * CELL_SIZE;
              const dist = Math.sqrt((e.x - towerX) ** 2 + (eY - towerY) ** 2);
              if (dist <= rangePixels * 1.2 && dist < secondDist) {
                secondDist = dist;
                secondTarget = e;
              }
            }
            if (secondTarget) {
              currentProjectiles.push({
                id: getId(),
                x: towerX,
                y: towerY,
                targetId: secondTarget.id,
                damage: Math.floor(dmg * 0.7),
                color: def.color,
                speed: 350,
                special: null,
                towerId: tower.id,
              });
            }
          }
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
          // Hit
          target.hp -= p.damage;

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

      // Remove dead enemies and handle death specials
      const aliveEnemies: Enemy[] = [];
      for (const e of currentEnemies) {
        if (e.hp <= 0) {
          const def = ENEMIES[e.type];
          goldDelta += e.reward;
          scoreDelta += e.reward;

          const eY = (e.row + 0.5) * CELL_SIZE;

          // 500 Internal Error: split into 2 smaller copies
          if (def?.special === "split" && !e.splitDone) {
            for (let s = 0; s < 2; s++) {
              newEnemies.push({
                id: getId(),
                type: e.type,
                row: Math.min(ROWS - 1, Math.max(0, e.row + (s === 0 ? -1 : 1))),
                x: e.x + 10,
                hp: 30,
                maxHp: 30,
                speed: e.speed * 1.2,
                reward: Math.floor(e.reward * 0.3),
                frozen: 0,
                stealthTimer: 0,
                stealthVisible: true,
                splitDone: true,
                cloneDone: true,
                teleportTimer: 0,
                disguised: false,
                isBoss: false,
              });
            }
          }

          // StackOverflow: clone at 50% HP
          if (def?.special === "clone" && !e.cloneDone) {
            newEnemies.push({
              id: getId(),
              type: e.type,
              row: Math.min(ROWS - 1, Math.max(0, e.row + (Math.random() > 0.5 ? 1 : -1))),
              x: e.x + 15,
              hp: Math.floor(e.maxHp * 0.5),
              maxHp: Math.floor(e.maxHp * 0.5),
              speed: e.speed,
              reward: Math.floor(e.reward * 0.4),
              frozen: 0,
              stealthTimer: 0,
              stealthVisible: true,
              splitDone: true,
              cloneDone: true,
              teleportTimer: 0,
              disguised: false,
              isBoss: false,
            });
          }

          // Death particles
          currentParticles.push(
            ...Array.from({ length: 8 }, () => ({
              x: e.x,
              y: eY,
              vx: (Math.random() - 0.5) * 250,
              vy: (Math.random() - 0.5) * 250,
              life: 0.6,
              color: def?.color || "#fff",
              size: 5,
            }))
          );
        } else {
          // StackOverflow clone check at 50% HP
          const def = ENEMIES[e.type];
          if (def?.special === "clone" && !e.cloneDone && e.hp <= e.maxHp * 0.5) {
            e.cloneDone = true;
            newEnemies.push({
              id: getId(),
              type: e.type,
              row: Math.min(ROWS - 1, Math.max(0, e.row + (Math.random() > 0.5 ? 1 : -1))),
              x: e.x + 15,
              hp: Math.floor(e.maxHp * 0.4),
              maxHp: Math.floor(e.maxHp * 0.4),
              speed: e.speed * 1.1,
              reward: Math.floor(e.reward * 0.3),
              frozen: 0,
              stealthTimer: 0,
              stealthVisible: true,
              splitDone: true,
              cloneDone: true,
              teleportTimer: 0,
              disguised: false,
              isBoss: false,
            });
          }
          aliveEnemies.push(e);
        }
      }
      currentEnemies = [...aliveEnemies, ...newEnemies];

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
  }, [screen, getId, getBoostMultiplier]);

  // Check wave complete
  useEffect(() => {
    if (!waveActive) return;
    if (enemies.length === 0 && !spawnDoneRef.current) return;

    const checkComplete = setTimeout(() => {
      if (enemiesRef.current.length === 0 && spawnDoneRef.current) {
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

  const currentWaveDef = wave < WAVES.length ? WAVES[wave] : (wave >= 25 ? generateEndlessWave(wave) : null);
  const isBossWave = currentWaveDef?.enemies.some((e) => e.type === "outOfMemory") || false;

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

        // @Valid/@Service range indicator
        if (def.special === "slow" || def.special === "aoe") {
          ctx.beginPath();
          ctx.arc(x, y, def.range * CELL_SIZE, 0, Math.PI * 2);
          ctx.fillStyle = def.color + "08";
          ctx.fill();
          ctx.strokeStyle = def.color + "20";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // @Autowired boost indicator
        if (def.special === "boost") {
          ctx.beginPath();
          ctx.arc(x, y, CELL_SIZE * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#22d3ee06";
          ctx.fill();
          ctx.strokeStyle = "#22d3ee18";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw enemies
      for (const enemy of enemiesRef.current) {
        const def = ENEMIES[enemy.type];
        if (!def) continue;
        const y = (enemy.row + 0.5) * CELL_SIZE;
        const size = enemy.isBoss ? 20 : 14;

        // Stealth handling
        if (def.special === "stealth" && !enemy.stealthVisible) {
          ctx.globalAlpha = 0.15;
        }

        // Disguise handling
        let displayColor = def.color;
        let displayEmoji = def.emoji;
        if (enemy.disguised) {
          // Show as a random tower color
          const towerColors = ["#818cf8", "#34d399", "#f472b6", "#10b981"];
          displayColor = towerColors[enemy.id % towerColors.length];
          displayEmoji = "\uD83C\uDFAF"; // disguised as tower
        }

        // Enemy body
        ctx.beginPath();
        ctx.arc(enemy.x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = displayColor + "cc";
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
        ctx.fillText(displayEmoji, enemy.x, y + 1);

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
        ctx.fillRect(hpX, hpY, hpWidth * Math.max(0, hpRatio), hpHeight);

        // Regen indicator
        if (def.special === "regen") {
          ctx.fillStyle = "#c084fc88";
          ctx.font = "10px serif";
          ctx.fillText("+", enemy.x + size + 4, y - 4);
        }

        ctx.globalAlpha = 1;
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
            <div className={styles.menuIcon}>{"\uD83C\uDF31"}</div>
            <h1 className={styles.menuTitle}>{t("springboot-game-title")}</h1>
            <p className={styles.menuSubtitle}>{t("springboot-game-subtitle")}</p>
            {highScore > 0 && (
              <div className={styles.menuHighScore}>
                {"\uD83C\uDFC6"} {t("springboot-game-highscore")}: {highScore}
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
              <PlayIcon /> {t("springboot-game-start")}
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
            <div className={styles.gameOverIcon}>{"\uD83D\uDC94"}</div>
            <h1 className={styles.gameOverTitle}>{t("springboot-game-over")}</h1>
            <div className={styles.gameOverStats}>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{wave}</span>
                <span className={styles.gameOverStatLabel}>{t("springboot-game-waves")}</span>
              </div>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{score}</span>
                <span className={styles.gameOverStatLabel}>{t("springboot-game-score")}</span>
              </div>
              <div className={styles.gameOverStat}>
                <span className={styles.gameOverStatValue}>{towers.length}</span>
                <span className={styles.gameOverStatLabel}>{t("springboot-game-towers-placed")}</span>
              </div>
            </div>
            {score >= highScore && score > 0 && (
              <div className={styles.newHighScore}>{"\uD83C\uDFC6"} {t("springboot-game-new-highscore")}!</div>
            )}
            <div className={styles.gameOverBtns}>
              <motion.button
                className={styles.playBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
              >
                {t("springboot-game-retry")}
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
  const waveDisplay = wave < WAVES.length
    ? `${t("springboot-game-wave")} ${wave + 1}/${WAVES.length}`
    : `${t("springboot-game-wave")} ${wave + 1} (${t("springboot-game-endless")})`;

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
              <span>{"\uD83D\uDCB0"}</span> <span className={styles.hudGold}>{gold}</span>
            </div>
            <div className={styles.hudStat}>
              <span>{"\u2764\uFE0F"}</span> <span className={styles.hudLives}>{lives}</span>
            </div>
            <div className={styles.hudStat}>
              <span>{"\uD83C\uDFC6"}</span> <span>{score}</span>
            </div>
            <div className={`${styles.hudWave} ${isBossWave ? styles.hudWaveBoss : ""}`}>
              {isBossWave && <span className={styles.bossLabel}>BOSS</span>}
              {isEndless && <span className={styles.endlessLabel}>ENDLESS</span>}
              {waveDisplay}
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
          {!waveActive && (
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
                <PlayIcon /> {t("springboot-game-start-wave")} {wave + 1}
                {isBossWave && " \uD83E\uDDE0"}
                {wave >= WAVES.length && " \u267E\uFE0F"}
              </motion.button>
            </motion.div>
          )}

          {/* Tower Selection */}
          <div className={styles.towerBar}>
            <div className={styles.towerBarLabel}>{t("springboot-game-towers")}</div>
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
                    <span className={styles.towerCost}>{"\uD83D\uDCB0"} {tower.cost}</span>
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
                  <code className={styles.towerInfoCode}>{TOWERS[showTowerInfo].springCode}</code>
                  <div className={styles.towerInfoStats}>
                    {TOWERS[showTowerInfo].damage > 0 && <span>{"\u2694\uFE0F"} {TOWERS[showTowerInfo].damage}</span>}
                    <span>{"\uD83D\uDCCF"} {TOWERS[showTowerInfo].range}</span>
                    {TOWERS[showTowerInfo].fireRate > 0 && <span>{"\u23F1\uFE0F"} {(TOWERS[showTowerInfo].fireRate / 1000).toFixed(1)}s</span>}
                    {TOWERS[showTowerInfo].special && (
                      <span style={{ color: TOWERS[showTowerInfo].color }}>
                        {"\u2728"} {TOWERS[showTowerInfo].special === "aoe" && "AOE"}
                        {TOWERS[showTowerInfo].special === "pierce" && "Pierce"}
                        {TOWERS[showTowerInfo].special === "execute" && "Execute"}
                        {TOWERS[showTowerInfo].special === "boost" && "+30% Adj."}
                        {TOWERS[showTowerInfo].special === "slow" && "Slow"}
                        {TOWERS[showTowerInfo].special === "cache" && "2x Cache"}
                        {TOWERS[showTowerInfo].special === "boss_killer" && "3x Boss"}
                        {TOWERS[showTowerInfo].special === "double_shot" && "2x Shot"}
                      </span>
                    )}
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
