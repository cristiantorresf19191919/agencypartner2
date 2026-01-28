"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";

interface FullscreenSectionProps {
  children: React.ReactNode;
  /** Optional title shown in the section header and in fullscreen bar */
  title?: string;
  /** Optional id for the section element */
  id?: string;
  /** Extra class names for the inner content wrapper */
  className?: string;
  /** Optional class for the outer section (e.g. styles.section for margin/scroll) */
  sectionClassName?: string;
}

export function FullscreenSection({
  children,
  title,
  id,
  className = "",
  sectionClassName = "",
}: FullscreenSectionProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  const headerBar = (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2 rounded-t-xl border-b border-white/10 bg-white/5 shrink-0"
      style={{
        padding: "0.75rem 1rem",
        background: "rgba(255, 255, 255, 0.05)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      {title && (
        <span className="text-sm font-medium text-white/90 truncate">
          {title}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsFullscreen((v) => !v)}
        aria-label={isFullscreen ? "Exit fullscreen" : "Maximize"}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-white/20 hover:bg-white/10 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1628] shrink-0"
      >
        {isFullscreen ? (
          <Minimize2 className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} />
        )}
        {isFullscreen ? "Close" : "Maximize"}
      </button>
    </div>
  );

  const sectionContent = (
    <section
      id={id}
      className="fullscreen-section-wrapper rounded-xl overflow-hidden border border-white/10 bg-[#0b0f1a]/50 shadow-xl"
      style={{ maxWidth: "100%" }}
    >
      {headerBar}
      <div className={`overflow-auto ${className}`.trim()} style={{ maxWidth: "100%" }}>
        {children}
      </div>
    </section>
  );

  const fullscreenOverlay =
    mounted && typeof document !== "undefined" && document.body
      ? createPortal(
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                className="fixed inset-0 z-[9998] flex flex-col bg-[#0b0f1a]"
                style={{
                  width: "100vw",
                  height: "100vh",
                  left: 0,
                  top: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden p-3 sm:p-4">
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f1a]/95 shadow-2xl">
                    {headerBar}
                    <div className={`flex-1 min-h-0 overflow-auto ${className}`}>
                      {children}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <div className={`w-full ${sectionClassName}`.trim()} style={{ maxWidth: "100%" }}>
        {sectionContent}
      </div>
      {fullscreenOverlay}
    </>
  );
}
