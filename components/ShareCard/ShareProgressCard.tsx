"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close as CloseIcon, Download as DownloadIcon, ContentCopy as CopyIcon, Check as CheckIcon } from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";
import { getUsername, setUsername as saveUsername } from "@/lib/devHubStore";
import styles from "./ShareProgressCard.module.css";

interface ShareProgressCardProps {
  open: boolean;
  onClose: () => void;
  streak: number;
  bookmarkCount: number;
  recentTopics: string[];
}

export default function ShareProgressCard({ open, onClose, streak, bookmarkCount, recentTopics }: ShareProgressCardProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsernameState] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setUsernameState(getUsername() || "Developer");
      setCopied(false);
    }
  }, [open]);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 600, H = 340;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0f0f1a");
    bg.addColorStop(1, "#1a1030");
    ctx.fillStyle = bg;
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    // Accent line
    const accent = ctx.createLinearGradient(0, 0, W, 0);
    accent.addColorStop(0, "#a06af9");
    accent.addColorStop(1, "#f43f5e");
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, W, 4);

    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(username, 32, 52);

    // Stats
    ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(t("share-card-branding"), 32, 78);

    // Stat boxes
    const statsY = 110;
    const boxW = 160, boxH = 80, gap = 20;

    // Streak
    ctx.fillStyle = "rgba(251, 191, 36, 0.1)";
    ctx.roundRect(32, statsY, boxW, boxH, 10);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px -apple-system, sans-serif";
    ctx.fillText(`🔥 ${streak}`, 52, statsY + 38);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText("Day streak", 52, statsY + 60);

    // Bookmarks
    ctx.fillStyle = "rgba(244, 63, 94, 0.1)";
    ctx.roundRect(32 + boxW + gap, statsY, boxW, boxH, 10);
    ctx.fill();
    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 28px -apple-system, sans-serif";
    ctx.fillText(`❤️ ${bookmarkCount}`, 52 + boxW + gap, statsY + 38);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText("Saved items", 52 + boxW + gap, statsY + 60);

    // Topics
    ctx.fillStyle = "rgba(160, 106, 249, 0.1)";
    ctx.roundRect(32 + 2 * (boxW + gap), statsY, boxW, boxH, 10);
    ctx.fill();
    ctx.fillStyle = "#a06af9";
    ctx.font = "bold 14px -apple-system, sans-serif";
    const topicText = recentTopics.length > 0 ? recentTopics.slice(0, 3).join(", ") : "—";
    ctx.fillText(topicText, 52 + 2 * (boxW + gap), statsY + 38);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillText("Recent topics", 52 + 2 * (boxW + gap), statsY + 60);

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px -apple-system, sans-serif";
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    ctx.fillText(`${t("share-card-branding")} · ${date}`, 32, H - 20);

    // Logo mark
    ctx.fillStyle = "rgba(160, 106, 249, 0.4)";
    ctx.font = "bold 14px monospace";
    ctx.fillText("</> ", W - 70, H - 18);
  }, [username, streak, bookmarkCount, recentTopics, t]);

  useEffect(() => {
    if (open) drawCard();
  }, [open, drawCard]);

  const handleUsernameChange = (val: string) => {
    setUsernameState(val);
    saveUsername(val);
  };

  // Redraw when username changes
  useEffect(() => {
    if (open) drawCard();
  }, [username, open, drawCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dev-hub-progress.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* clipboard not available */ }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{t("share-card-title")}</h3>
              <button className={styles.modalClose} onClick={onClose}>
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>

            <div className={styles.usernameRow}>
              <label className={styles.usernameLabel}>{t("share-card-username")}</label>
              <input
                className={styles.usernameInput}
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className={styles.canvasWrap}>
              <canvas ref={canvasRef} className={styles.canvas} />
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={handleDownload}>
                <DownloadIcon style={{ fontSize: 16 }} />
                {t("share-card-download")}
              </button>
              <button className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ""}`} onClick={handleCopy}>
                {copied ? <CheckIcon style={{ fontSize: 16 }} /> : <CopyIcon style={{ fontSize: 16 }} />}
                {copied ? t("share-card-copied") : t("share-card-copy")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
