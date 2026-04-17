"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Send as SendIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { CHALLENGES } from "@/lib/challengesData";
import {
  generateRoomId,
  createRoom,
  joinRoom,
  subscribeToRoom,
  updatePlayerCode,
  submitSolution,
  startGame,
} from "@/lib/multiplayerRoom";
import type { RoomData } from "@/lib/multiplayerRoom";
import { getStore, updateStore } from "@/lib/devHubStore";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./MultiplayerChallenge.module.css";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div style={{ height: 380, background: "#0d0f1a" }} />,
});

const PISTON_EXECUTE_URL = "/api/execute-code";
const GAME_DURATION = 10 * 60 * 1000; // 10 minutes

type Phase = "lobby" | "waiting" | "playing" | "finished";

function genPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("mp-player-id");
  if (!id) {
    id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem("mp-player-id", id);
  }
  return id;
}

function MultiplayerContent() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("lobby");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const unsubRef = useRef<(() => void) | null>(null);
  const codeRef = useRef(code);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init player
  useEffect(() => {
    const id = genPlayerId();
    setPlayerId(id);
    const store = getStore();
    setPlayerName(store.username || `Player-${id.slice(-5)}`);
    setSelectedChallengeIdx(Math.floor(Math.random() * CHALLENGES.length));

    // Auto-join from URL
    const urlRoom = searchParams.get("room");
    if (urlRoom) setJoinRoomId(urlRoom);
  }, [searchParams]);

  // Keep codeRef in sync
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Subscribe to room updates
  const subscribe = useCallback(
    (rid: string) => {
      if (unsubRef.current) unsubRef.current();
      unsubRef.current = subscribeToRoom(rid, (data) => {
        setRoom(data);
        const playerIds = Object.keys(data.players);

        // Auto-start when 2 players join
        if (data.state === "waiting" && playerIds.length >= 2) {
          startGame(rid);
          return;
        }

        if (data.state === "playing" && phase !== "playing") {
          const ch = CHALLENGES.find((c) => c.id === data.challengeId);
          if (ch) setCode(ch.starterCode.typescript);
          setPhase("playing");
        }

        // Check if finished
        if (data.state === "playing") {
          const allSubmitted = playerIds.every(
            (pid) => data.players[pid].status === "submitted",
          );
          if (allSubmitted) {
            setPhase("finished");
          }
        }

        if (data.state === "finished") {
          setPhase("finished");
        }
      });
    },
    [phase],
  );

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || !room?.startedAt) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - room.startedAt!;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setPhase("finished");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, room?.startedAt]);

  // Debounced code sync
  const syncCode = useCallback(
    (newCode: string) => {
      setCode(newCode);
      if (!roomId || !playerId) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updatePlayerCode(roomId, playerId, newCode);
      }, 1500);
    },
    [roomId, playerId],
  );

  // Create room
  const handleCreate = useCallback(async () => {
    if (!playerName.trim()) return;
    updateStore({ username: playerName.trim() });
    const rid = generateRoomId();
    const challengeId = CHALLENGES[selectedChallengeIdx].id;
    await createRoom(rid, challengeId, playerId, playerName.trim());
    setRoomId(rid);
    setPhase("waiting");
    subscribe(rid);
  }, [playerName, selectedChallengeIdx, playerId, subscribe]);

  // Join room
  const handleJoin = useCallback(async () => {
    if (!playerName.trim() || !joinRoomId.trim()) return;
    updateStore({ username: playerName.trim() });
    const success = await joinRoom(
      joinRoomId.trim(),
      playerId,
      playerName.trim(),
    );
    if (!success) return;
    setRoomId(joinRoomId.trim());
    setPhase("waiting");
    subscribe(joinRoomId.trim());
  }, [playerName, joinRoomId, playerId, subscribe]);

  // Copy room ID
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomId]);

  // Run code against test cases via Piston
  const handleSubmit = useCallback(async () => {
    if (!room || submitting) return;
    setSubmitting(true);

    const challenge = CHALLENGES.find((c) => c.id === room.challengeId);
    if (!challenge) {
      setSubmitting(false);
      return;
    }

    let allPassed = true;
    for (const tc of challenge.testCases) {
      try {
        const res = await fetch(PISTON_EXECUTE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: "typescript",
            version: "*",
            files: [{ name: "solution.ts", content: codeRef.current }],
            stdin: tc.input,
            args: [],
          }),
        });
        if (!res.ok) {
          allPassed = false;
          break;
        }
        const d = (await res.json()) as {
          run?: { stdout?: string; stderr?: string; code?: number };
        };
        const stdout = (d.run?.stdout || "").trim();
        if (stdout !== tc.output.trim()) {
          allPassed = false;
          break;
        }
      } catch {
        allPassed = false;
        break;
      }
    }

    await submitSolution(roomId, playerId, allPassed);
    setSubmitting(false);
  }, [room, roomId, playerId, submitting]);

  // Play again
  const handlePlayAgain = useCallback(() => {
    if (unsubRef.current) unsubRef.current();
    setRoom(null);
    setRoomId("");
    setJoinRoomId("");
    setCode("");
    setTimeLeft(GAME_DURATION);
    setPhase("lobby");
    setSelectedChallengeIdx(Math.floor(Math.random() * CHALLENGES.length));
  }, []);

  // Derive opponent data
  const opponentId = room
    ? Object.keys(room.players).find((pid) => pid !== playerId)
    : null;
  const opponent = opponentId ? room?.players[opponentId] : null;
  const self = room?.players[playerId];
  const challenge = room
    ? CHALLENGES.find((c) => c.id === room.challengeId)
    : null;

  // Format time
  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Determine winner for finished state
  const getResult = () => {
    if (!room) return null;
    const players = Object.entries(room.players);
    const submitted = players.filter(([, p]) => p.status === "submitted" && p.passed);
    if (submitted.length === 0) return { type: "draw" as const, winner: null };
    if (submitted.length === 1) return { type: "winner" as const, winner: submitted[0] };
    // Both passed -- earliest submittedAt wins
    submitted.sort((a, b) => (a[1].submittedAt ?? Infinity) - (b[1].submittedAt ?? Infinity));
    if (submitted[0][1].submittedAt === submitted[1][1].submittedAt)
      return { type: "draw" as const, winner: null };
    return { type: "winner" as const, winner: submitted[0] };
  };

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      {/* ── LOBBY ───────────────────────────────────────── */}
      {phase === "lobby" && (
        <section className={styles.lobby}>
          <motion.div
            className={styles.lobbyCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className={styles.lobbyTitle}>{t("mp-lobby-title")}</h1>

            <div className={styles.formGroup}>
              <label>{t("mp-your-name")}</label>
              <input
                className={styles.input}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t("mp-your-name")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("mp-challenge")}</label>
              <select
                className={styles.select}
                value={selectedChallengeIdx}
                onChange={(e) => setSelectedChallengeIdx(Number(e.target.value))}
              >
                {CHALLENGES.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.title} ({c.difficulty})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.lobbyActions}>
              <button className={styles.btnPrimary} onClick={handleCreate}>
                {t("mp-create")}
              </button>
            </div>

            <div className={styles.divider}>-- {t("mp-join")} --</div>

            <div className={styles.joinRow}>
              <input
                className={styles.input}
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder={t("mp-room-id")}
              />
              <button className={styles.btnSecondary} onClick={handleJoin}>
                {t("mp-join")}
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── WAITING ─────────────────────────────────────── */}
      {phase === "waiting" && (
        <section className={styles.waitingWrap}>
          <motion.div
            className={styles.waitingCard}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.waitingTitle}>{t("mp-waiting")}</h2>

            <div className={styles.roomIdDisplay} onClick={handleCopy}>
              <span>{roomId}</span>
              <button className={styles.copyBtn} aria-label="Copy">
                {copied ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <CopyIcon fontSize="small" />
                )}
              </button>
            </div>

            <div className={styles.playerList}>
              {room &&
                Object.entries(room.players).map(([pid, p]) => (
                  <div key={pid} className={styles.playerRow}>
                    <span>{p.name}</span>
                    {pid === playerId && (
                      <span className={styles.youBadge}>{t("mp-you")}</span>
                    )}
                  </div>
                ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ── PLAYING ─────────────────────────────────────── */}
      {phase === "playing" && challenge && (
        <section className={styles.playArea}>
          <div className={styles.timerBar}>
            <span className={styles.timerLabel}>
              <TimerIcon fontSize="small" style={{ verticalAlign: "middle", marginRight: 6 }} />
              {t("mp-time-left")}
            </span>
            <span
              className={`${styles.timerValue}${timeLeft < 60000 ? ` ${styles.warning}` : ""}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className={styles.challengeInfo}>
            <h2 className={styles.challengeTitle}>
              {t("mp-challenge")}: {challenge.title}
            </h2>
            <p className={styles.challengeDesc}>{challenge.description}</p>
          </div>

          <div className={styles.editorsGrid}>
            {/* Your editor */}
            <div className={styles.editorCol}>
              <div className={styles.editorHeader}>
                <span>{t("mp-you")} — {playerName}</span>
                <span
                  className={`${styles.statusBadge}${self?.status === "submitted" ? ` ${styles.submitted}` : ""}`}
                >
                  {self?.status ?? "coding"}
                </span>
              </div>
              <div className={styles.editorWrap}>
                <MonacoEditor
                  height={380}
                  language="typescript"
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => syncCode(v ?? "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>

            {/* Opponent editor */}
            <div className={styles.editorCol}>
              <div className={styles.editorHeader}>
                <span>
                  {t("mp-opponent")} — {opponent?.name ?? "..."}
                </span>
                <span
                  className={`${styles.statusBadge}${opponent?.status === "submitted" ? ` ${styles.submitted}` : ""}`}
                >
                  {opponent?.status ?? "waiting"}
                </span>
              </div>
              <div className={styles.editorWrap}>
                <MonacoEditor
                  height={380}
                  language="typescript"
                  theme="vs-dark"
                  value={opponent?.code ?? ""}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.submitRow}>
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting || self?.status === "submitted"}
            >
              <SendIcon fontSize="small" />
              {t("mp-submit")}
            </button>
          </div>
        </section>
      )}

      {/* ── FINISHED ────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "finished" && (
          <motion.div
            className={styles.resultsOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.resultsCard}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {(() => {
                const result = getResult();
                if (!result || result.type === "draw") {
                  return (
                    <>
                      <div className={styles.resultsEmoji}>
                        &#129309;
                      </div>
                      <h2 className={styles.resultsTitle}>{t("mp-draw")}</h2>
                      <p className={styles.resultsSubtitle}>
                        {challenge?.title ?? ""}
                      </p>
                    </>
                  );
                }
                const isMe = result.winner?.[0] === playerId;
                return (
                  <>
                    <div className={styles.resultsEmoji}>
                      {isMe ? "\uD83C\uDFC6" : "\uD83D\uDCAA"}
                    </div>
                    <h2 className={styles.resultsTitle}>{t("mp-winner")}</h2>
                    <p className={styles.resultsSubtitle}>
                      {result.winner?.[1].name} &mdash; {challenge?.title ?? ""}
                    </p>
                  </>
                );
              })()}
              <button className={styles.playAgainBtn} onClick={handlePlayAgain}>
                {t("mp-play-again")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copied toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            className={styles.copiedToast}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {t("mp-room-copied")}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

export default function MultiplayerPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className={styles.loading}>
            <Skeleton width={200} height={24} />
            <Skeleton width={300} height={16} />
          </div>
        </main>
      }
    >
      <MultiplayerContent />
    </Suspense>
  );
}
