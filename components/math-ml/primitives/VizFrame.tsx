"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { MathContent } from "../MathContent";
import { VizFullscreenContext } from "./VizFullscreenContext";
import styles from "../MathML.module.css";

interface VizFrameProps {
  title?: string;
  description?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  fullscreenLabel?: string;
}

export function VizFrame({
  title,
  description,
  bodyClassName,
  children,
  fullscreenLabel = "Maximize",
}: VizFrameProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  return (
    <VizFullscreenContext.Provider value={fullscreen}>
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="viz-backdrop"
            className={styles.vizFullscreenBackdrop}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setFullscreen(false)}
          />
        )}
      </AnimatePresence>
      <div
        className={`${styles.vizContainer} ${fullscreen ? styles.vizContainerFullscreen : ""}`}
      >
        <div className={styles.vizHeader}>
          <div className={styles.vizHeaderText}>
            {title && <div className={styles.vizTitle}>{title}</div>}
            {description && (
              <div className={styles.vizDescription}>
                <MathContent text={description} as="span" />
              </div>
            )}
          </div>
          <button
            type="button"
            className={styles.vizFullscreenBtn}
            onClick={() => setFullscreen((v) => !v)}
            aria-label={fullscreen ? "Exit fullscreen" : fullscreenLabel}
            title={fullscreen ? "Exit fullscreen (Esc)" : fullscreenLabel}
          >
            {fullscreen ? (
              <FullscreenExitIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </button>
        </div>

        <div className={`${bodyClassName ?? ""} ${fullscreen ? styles.vizBodyFullscreen : ""}`}>
          {children}
        </div>

        <AnimatePresence>
          {fullscreen && (
            <motion.button
              key="viz-close"
              type="button"
              className={styles.vizFullscreenCloseFloating}
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              <CloseIcon fontSize="small" />
              <span className={styles.vizCloseHint}>ESC</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </VizFullscreenContext.Provider>
  );
}

export default VizFrame;
