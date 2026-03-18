"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

/* ═══════════════════════════════════════════════════════
   SVG DIAGRAM COMPONENTS
   ═══════════════════════════════════════════════════════ */

function TraditionalVsWorktreesDiagram() {
  return (
    <svg viewBox="0 0 800 340" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="wtbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wtg-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="wtg-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
        </linearGradient>
        <filter id="wt-glow-g"><feGaussianBlur stdDeviation="4" result="b" /><feFlood floodColor="#10b981" floodOpacity="0.2" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="800" height="340" rx="16" fill="url(#wtbg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {/* Grid dots */}
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 9 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.06)" />
      )))}
      <text x="400" y="32" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="0.5">Traditional Git vs Worktrees</text>
      {/* Divider */}
      <line x1="400" y1="48" x2="400" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Traditional side */}
      <text x="200" y="62" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="600" letterSpacing="0.3">Sequential Switching</text>
      {["checkout feature-a", "git stash", "checkout bugfix", "checkout feature-a", "git stash pop"].map((cmd, i) => (
        <React.Fragment key={cmd + i}>
          <rect x={55} y={78 + i * 42} width={290} height={32} rx="8" fill="url(#wtg-red)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
          <text x={70} y={78 + i * 42 + 20} fill="rgba(255,255,255,0.8)" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace" dominantBaseline="central">
            <tspan fill="rgba(239,68,68,0.5)">$</tspan>{" "}{cmd}
          </text>
          {i < 4 && (
            <g>
              <line x1="200" y1={110 + i * 42} x2="200" y2={118 + i * 42} stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" />
              <polygon points={`197,${117 + i * 42} 203,${117 + i * 42} 200,${121 + i * 42}`} fill="rgba(239,68,68,0.3)" />
            </g>
          )}
        </React.Fragment>
      ))}
      <rect x={55} y={295} width={290} height={26} rx="8" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.12)" strokeWidth="1" />
      <text x={200} y={312} textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="10" dominantBaseline="central">Context switching, stashing, slow</text>

      {/* Worktrees side */}
      <text x="600" y="62" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600" letterSpacing="0.3">Parallel Directories</text>
      {[
        { path: "~/project/", branch: "main", y: 78, color: "#34d399" },
        { path: "~/project-feature-a/", branch: "feature-a", y: 148, color: "#22d3ee" },
        { path: "~/project-bugfix/", branch: "bugfix-123", y: 218, color: "#a78bfa" },
      ].map((wt) => (
        <React.Fragment key={wt.branch}>
          <rect x={435} y={wt.y} width={310} height={52} rx="10" fill="url(#wtg-green)" stroke={`${wt.color}30`} strokeWidth="1.5" filter="url(#wt-glow-g)" />
          <line x1={435 + 10} y1={wt.y + 1} x2={435 + 300} y2={wt.y + 1} stroke={`${wt.color}18`} strokeWidth="1" strokeLinecap="round" />
          <text x={455} y={wt.y + 21} fill={wt.color} fontSize="12" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="600">{wt.path}</text>
          <text x={455} y={wt.y + 39} fill="rgba(255,255,255,0.5)" fontSize="10">{wt.branch}</text>
          <circle cx={725} cy={wt.y + 26} r="10" fill={`${wt.color}15`} stroke={`${wt.color}40`} strokeWidth="1.5" />
          <text x={725} y={wt.y + 27} textAnchor="middle" fill={wt.color} fontSize="12" dominantBaseline="central" fontWeight="700">&#10003;</text>
        </React.Fragment>
      ))}
      <rect x={435} y={295} width={310} height={26} rx="8" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.12)" strokeWidth="1" />
      <text x={590} y={312} textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="10" dominantBaseline="central">All branches available simultaneously</text>
    </svg>
  );
}

function DirectoryStructureSVG({ fullscreen = false }: { fullscreen?: boolean }) {
  const W = 720;
  const H = 480;
  // Centered layout with better spacing
  const folders = [
    { name: "your-project/", x: 280, y: 52, w: 170, h: 38, color: "#a78bfa", level: 0 },
    { name: ".claude/", x: 100, y: 140, w: 140, h: 36, color: "#22d3ee", level: 1 },
    { name: "src/", x: 310, y: 140, w: 100, h: 36, color: "#94a3b8", level: 1 },
    { name: "package.json", x: 480, y: 140, w: 150, h: 36, color: "#94a3b8", level: 1 },
    { name: "worktrees/", x: 48, y: 228, w: 140, h: 34, color: "#34d399", level: 2 },
    { name: "sessions/", x: 230, y: 228, w: 120, h: 34, color: "#94a3b8", level: 2 },
    { name: "feature-auth/", x: 28, y: 318, w: 155, h: 34, color: "#fbbf24", level: 3 },
    { name: "bugfix-crash/", x: 225, y: 318, w: 155, h: 34, color: "#fbbf24", level: 3 },
    { name: "refactor-db/", x: 422, y: 318, w: 148, h: 34, color: "#fbbf24", level: 3 },
    { name: "src/  package.json  ...", x: 28, y: 393, w: 185, h: 30, color: "#64748b", level: 4 },
    { name: "src/  ...", x: 255, y: 393, w: 95, h: 30, color: "#64748b", level: 4 },
    { name: "src/  ...", x: 442, y: 393, w: 95, h: 30, color: "#64748b", level: 4 },
  ];

  const connections = [
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
    { from: 1, to: 4 }, { from: 1, to: 5 },
    { from: 4, to: 6 }, { from: 4, to: 7 }, { from: 4, to: 8 },
    { from: 6, to: 9 }, { from: 7, to: 10 }, { from: 8, to: 11 },
  ];

  const badges = [
    { x: 63, y: 430, label: "Worktree 1", color: "#fbbf24" },
    { x: 260, y: 430, label: "Worktree 2", color: "#fbbf24" },
    { x: 450, y: 430, label: "Worktree 3", color: "#fbbf24" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: fullscreen ? "none" : 720 }}>
      <defs>
        <filter id="ds-glow-purple">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feFlood floodColor="#8b5cf6" floodOpacity="0.35" result="c" />
          <feComposite in="c" in2="b" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ds-glow-cyan">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feFlood floodColor="#06b6d4" floodOpacity="0.3" result="c" />
          <feComposite in="c" in2="b" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ds-glow-green">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feFlood floodColor="#10b981" floodOpacity="0.25" result="c" />
          <feComposite in="c" in2="b" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="ds-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="ds-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={W} height={H} rx="16" fill="url(#ds-bg)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
      {/* Subtle grid dots */}
      {Array.from({ length: 18 }).map((_, xi) =>
        Array.from({ length: 12 }).map((_, yi) => (
          <circle key={`${xi}-${yi}`} cx={xi * 42 + 20} cy={yi * 42 + 20} r="0.6" fill="rgba(139,92,246,0.08)" />
        ))
      )}

      {/* Title */}
      <text x={W / 2} y="32" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="0.5">Directory Structure</text>

      {/* Connection lines — smooth bezier with gradient */}
      {connections.map((c, i) => {
        const f = folders[c.from];
        const t = folders[c.to];
        const fx = f.x + f.w / 2;
        const fy = f.y + f.h;
        const tx = t.x + t.w / 2;
        const ty = t.y;
        const my = (fy + ty) / 2;
        const isDashed = folders[c.to].level >= 3;
        return (
          <path
            key={i}
            d={`M${fx},${fy} C${fx},${my} ${tx},${my} ${tx},${ty}`}
            fill="none"
            stroke={isDashed ? "rgba(251,191,36,0.2)" : "url(#ds-line-grad)"}
            strokeWidth={isDashed ? "1.2" : "1.5"}
            strokeDasharray={isDashed ? "5 4" : "none"}
          />
        );
      })}

      {/* Folder nodes */}
      {folders.map((f, i) => {
        const glowFilter = f.level === 0 ? "url(#ds-glow-purple)"
          : f.level === 1 && f.color === "#22d3ee" ? "url(#ds-glow-cyan)"
          : f.level === 2 && f.color === "#34d399" ? "url(#ds-glow-green)"
          : undefined;
        const isLeaf = f.level >= 4;
        const isWorktreeDir = f.level === 3;
        const fillOpacity = f.level === 0 ? "25" : f.level <= 2 ? "18" : isWorktreeDir ? "12" : "08";
        const strokeOpacity = f.level === 0 ? "60" : f.level <= 2 ? "45" : isWorktreeDir ? "40" : "20";
        const textColor = isLeaf ? "rgba(255,255,255,0.4)" : f.color;
        const fontWeight = f.level <= 1 ? 700 : f.level === 2 ? 600 : 400;
        const fontSize = f.level >= 4 ? 10.5 : f.level === 3 ? 11.5 : 12.5;
        const showIcon = f.level <= 2;
        const rx = f.level === 0 ? 10 : f.level <= 2 ? 8 : 6;

        return (
          <g key={i} filter={glowFilter}>
            <rect
              x={f.x} y={f.y} width={f.w} height={f.h} rx={rx}
              fill={`${f.color}${fillOpacity}`}
              stroke={`${f.color}${strokeOpacity}`}
              strokeWidth={f.level === 0 ? 2 : 1.5}
            />
            {/* Inner highlight line at top of card */}
            {f.level <= 2 && (
              <line
                x1={f.x + rx} y1={f.y + 1} x2={f.x + f.w - rx} y2={f.y + 1}
                stroke={`${f.color}30`} strokeWidth="1" strokeLinecap="round"
              />
            )}
            <text
              x={f.x + (showIcon ? 28 : 12)}
              y={f.y + f.h / 2 + 1}
              fill={textColor}
              fontSize={fontSize}
              fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
              fontWeight={fontWeight}
              dominantBaseline="central"
            >
              {f.name}
            </text>
            {showIcon && (
              <text x={f.x + 10} y={f.y + f.h / 2 + 1} fontSize="14" dominantBaseline="central">{"\uD83D\uDCC1"}</text>
            )}
          </g>
        );
      })}

      {/* Worktree badges with pulsing dot */}
      {badges.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={90} height={22} rx="11" fill={`${b.color}15`} stroke={`${b.color}35`} strokeWidth="1" />
          <circle cx={b.x + 14} cy={b.y + 11} r="3" fill={b.color} opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={b.x + 50} y={b.y + 12} textAnchor="middle" fill={b.color} fontSize="10" fontWeight="600" dominantBaseline="central">{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

function DirectoryStructureText() {
  const lines: { text: string; color: string; indent: number; comment?: string }[] = [
    { text: "your-project/", color: "#8b5cf6", indent: 0 },
    { text: ".claude/", color: "#06b6d4", indent: 1 },
    { text: "worktrees/", color: "#10b981", indent: 2 },
    { text: "feature-auth/", color: "#f59e0b", indent: 3, comment: "Worktree 1" },
    { text: "src/", color: "#94a3b8", indent: 4 },
    { text: "package.json", color: "#94a3b8", indent: 4 },
    { text: "...", color: "#64748b", indent: 4 },
    { text: "bugfix-crash/", color: "#f59e0b", indent: 3, comment: "Worktree 2" },
    { text: "src/", color: "#94a3b8", indent: 4 },
    { text: "...", color: "#64748b", indent: 4 },
    { text: "refactor-db/", color: "#f59e0b", indent: 3, comment: "Worktree 3" },
    { text: "src/", color: "#94a3b8", indent: 4 },
    { text: "...", color: "#64748b", indent: 4 },
    { text: "sessions/", color: "#64748b", indent: 2 },
    { text: "src/", color: "#64748b", indent: 1, comment: "Main working directory" },
    { text: "package.json", color: "#64748b", indent: 1 },
    { text: "...", color: "#64748b", indent: 1 },
  ];

  // Build tree lines with proper box-drawing characters
  const rendered: { prefix: string; name: string; color: string; comment?: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.indent === 0) {
      rendered.push({ prefix: "", name: line.text, color: line.color, comment: line.comment });
      continue;
    }
    // Determine if this is the last sibling at its indent level
    let isLast = true;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].indent < line.indent) break;
      if (lines[j].indent === line.indent) { isLast = false; break; }
    }
    // Build prefix from parent levels
    let prefix = "";
    for (let lvl = 1; lvl < line.indent; lvl++) {
      // Check if there's a continuing sibling at this level after current line
      let hasMore = false;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].indent < lvl) break;
        if (lines[j].indent === lvl) { hasMore = true; break; }
      }
      prefix += hasMore ? "\u2502   " : "    ";
    }
    prefix += isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
    rendered.push({ prefix, name: line.text, color: line.color, comment: line.comment });
  }

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(139,92,246,0.2)",
      borderRadius: 16,
      padding: "20px 24px",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.8,
      overflowX: "auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: 12, fontWeight: 700, fontSize: 14, color: "white" }}>Directory Structure</div>
      {rendered.map((r, i) => (
        <div key={i} style={{ whiteSpace: "pre", display: "flex", gap: 16 }}>
          <span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{r.prefix}</span>
            <span style={{ color: r.color, fontWeight: r.color !== "#64748b" && r.color !== "#94a3b8" ? 600 : 400 }}>{r.name}</span>
          </span>
          {r.comment && <span style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic", fontSize: 11, alignSelf: "center" }}>{"# "}{r.comment}</span>}
        </div>
      ))}
    </div>
  );
}

function DirectoryStructureDiagram() {
  const [view, setView] = useState<"graph" | "tree">("graph");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }
  }, [isFullscreen, handleEsc]);

  const toolbar = (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 6,
      marginBottom: isFullscreen ? 16 : 8,
    }}>
      {/* View toggle */}
      <div style={{
        display: "flex",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: 2,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <button
          onClick={() => setView("graph")}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            color: view === "graph" ? "white" : "rgba(255,255,255,0.5)",
            background: view === "graph" ? "rgba(139,92,246,0.4)" : "transparent",
            transition: "all 0.2s",
          }}
          title="Graphical view"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 4 }}>
            <circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" />
            <line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" />
          </svg>
          Graph
        </button>
        <button
          onClick={() => setView("tree")}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            color: view === "tree" ? "white" : "rgba(255,255,255,0.5)",
            background: view === "tree" ? "rgba(139,92,246,0.4)" : "transparent",
            transition: "all 0.2s",
          }}
          title="Text tree view"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 4 }}>
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="7" y1="12" x2="21" y2="12" /><line x1="11" y1="18" x2="21" y2="18" />
          </svg>
          Tree
        </button>
      </div>
      {/* Maximize button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        style={{
          padding: "5px 8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s",
        }}
        title={isFullscreen ? "Exit fullscreen (Esc)" : "Maximize"}
      >
        {isFullscreen ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>
    </div>
  );

  const content = (
    <>
      {toolbar}
      {view === "graph" ? <DirectoryStructureSVG fullscreen={isFullscreen} /> : <DirectoryStructureText />}
    </>
  );

  const fullscreenOverlay = isFullscreen && typeof document !== "undefined" && createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0b0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 48px",
        overflow: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setIsFullscreen(false); }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        {toolbar}
        {view === "graph" ? <DirectoryStructureSVG fullscreen /> : <DirectoryStructureText />}
      </div>
    </div>,
    document.body,
  );

  return (
    <div className="my-6">
      {content}
      {fullscreenOverlay}
    </div>
  );
}

function WorkflowDiagram() {
  const worktrees = [
    { cx: 140, name: "Worktree A", branch: "feature-auth", color: "#22d3ee", prNum: "101" },
    { cx: 400, name: "Worktree B", branch: "bugfix-crash", color: "#34d399", prNum: "102" },
    { cx: 660, name: "Worktree C", branch: "refactor-db", color: "#fbbf24", prNum: "103" },
  ];
  const W = 800, H = 500;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="wf-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" /><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" /></linearGradient>
        <filter id="wf-glow-p"><feGaussianBlur stdDeviation="6" result="b" /><feFlood floodColor="#8b5cf6" floodOpacity="0.3" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        {worktrees.map((wt) => (
          <filter key={`f-${wt.prNum}`} id={`wf-glow-${wt.prNum}`}><feGaussianBlur stdDeviation="4" result="b" /><feFlood floodColor={wt.color} floodOpacity="0.2" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        ))}
      </defs>
      <rect width={W} height={H} rx="16" fill="url(#wf-bg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 13 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.06)" />
      )))}
      <text x={W / 2} y="34" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="0.5">Workflow Diagram</text>

      {/* Main Repository */}
      <g filter="url(#wf-glow-p)">
        <rect x="220" y="54" width="360" height="68" rx="12" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
        <line x1="232" y1="55" x2="568" y2="55" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeLinecap="round" />
      </g>
      <text x={W / 2} y="84" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Main Repository</text>
      <text x={W / 2} y="106" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace">(main branch)</text>

      {/* Connecting lines main → worktrees */}
      {worktrees.map((wt) => (
        <g key={`line-${wt.prNum}`}>
          <path d={`M400,122 C400,155 ${wt.cx},155 ${wt.cx},190`} fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" strokeDasharray="6 4">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <polygon points={`${wt.cx - 4},186 ${wt.cx + 4},186 ${wt.cx},194`} fill="rgba(139,92,246,0.4)" />
        </g>
      ))}

      {/* Worktree cards */}
      {worktrees.map((wt) => {
        const x = wt.cx - 110, y = 198, w = 220, h = 148;
        return (
          <g key={wt.name} filter={`url(#wf-glow-${wt.prNum})`}>
            <rect x={x} y={y} width={w} height={h} rx="12" fill={`${wt.color}08`} stroke={`${wt.color}30`} strokeWidth="1.5" />
            {/* Header band */}
            <rect x={x} y={y} width={w} height={40} rx="12" fill={`${wt.color}12`} />
            <rect x={x} y={y + 28} width={w} height={12} fill={`${wt.color}12`} />
            <line x1={x + 12} y1={y + 1} x2={x + w - 12} y2={y + 1} stroke={`${wt.color}20`} strokeWidth="1" strokeLinecap="round" />
            <text x={wt.cx} y={y + 22} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{wt.name}</text>
            <text x={wt.cx} y={y + 50} textAnchor="middle" fill={wt.color} fontSize="11" fontFamily="ui-monospace, SFMono-Regular, monospace">({wt.branch})</text>
            <line x1={x + 16} y1={y + 62} x2={x + w - 16} y2={y + 62} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={wt.cx} y={y + 82} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="500">Claude Session</text>
            <text x={wt.cx} y={y + 102} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">editing files</text>
            <text x={wt.cx} y={y + 118} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">making commits</text>
            {/* Status dot */}
            <circle cx={x + w - 16} cy={y + 16} r="5" fill={wt.color} opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Connecting lines worktrees → PRs */}
      {worktrees.map((wt) => (
        <g key={`pr-line-${wt.prNum}`}>
          <line x1={wt.cx} y1="346" x2={wt.cx} y2="400" stroke={`${wt.color}25`} strokeWidth="1.5" strokeDasharray="5 4">
            <animate attributeName="strokeDashoffset" from="9" to="0" dur="1.8s" repeatCount="indefinite" />
          </line>
          <polygon points={`${wt.cx - 4},396 ${wt.cx + 4},396 ${wt.cx},404`} fill={`${wt.color}50`} />
        </g>
      ))}

      {/* PR badges */}
      {worktrees.map((wt) => {
        const px = wt.cx - 80;
        return (
          <g key={`pr-${wt.prNum}`}>
            <rect x={px} y="410" width="160" height="48" rx="10" fill={`${wt.color}08`} stroke={`${wt.color}25`} strokeWidth="1.5" />
            <line x1={px + 10} y1="411" x2={px + 150} y2="411" stroke={`${wt.color}15`} strokeWidth="1" strokeLinecap="round" />
            {/* Git merge icon */}
            <circle cx={wt.cx - 40} cy="434" r="8" fill={`${wt.color}15`} stroke={`${wt.color}30`} strokeWidth="1" />
            <text x={wt.cx - 40} y="435" textAnchor="middle" fill={wt.color} fontSize="9" dominantBaseline="central" fontFamily="ui-monospace, SFMono-Regular, monospace">PR</text>
            <text x={wt.cx + 10} y="438" textAnchor="middle" fill={wt.color} fontSize="15" fontWeight="700" dominantBaseline="central">#{wt.prNum}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SequentialVsParallelDiagram() {
  const W = 800, H = 360;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="svp-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" /><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" /></linearGradient>
        <linearGradient id="svp-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" /><stop offset="100%" stopColor="#f97316" stopOpacity="0.12" /></linearGradient>
        <linearGradient id="svp-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#10b981" stopOpacity="0.3" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.12" /></linearGradient>
        <filter id="svp-glow-g"><feGaussianBlur stdDeviation="4" result="b" /><feFlood floodColor="#10b981" floodOpacity="0.2" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width={W} height={H} rx="16" fill="url(#svp-bg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 9 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.06)" />
      )))}
      <text x={W / 2} y="34" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="0.5">Sequential vs Parallel Time</text>

      {/* ── Sequential ── */}
      <text x="60" y="68" fill="#f87171" fontSize="12" fontWeight="600" letterSpacing="0.3">Sequential (without worktrees)</text>
      {/* Timeline axis */}
      <line x1="60" y1="136" x2="660" y2="136" stroke="rgba(239,68,68,0.15)" strokeWidth="1" />
      {[
        { label: "Task A (2 hours)", w: 268, x: 60 },
        { label: "Task B (1h)", w: 134, x: 328 },
        { label: "Task C (1.5h)", w: 198, x: 462 },
      ].map((t, i) => (
        <g key={t.label}>
          <rect x={t.x} y="84" width={t.w} height="42" rx="8" fill="url(#svp-r)" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
          <line x1={t.x + 8} y1="85" x2={t.x + t.w - 8} y2="85" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeLinecap="round" />
          <text x={t.x + t.w / 2} y="109" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="500" dominantBaseline="central">{t.label}</text>
          {/* Separator tick */}
          {i < 2 && <line x1={t.x + t.w} y1="88" x2={t.x + t.w} y2="132" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="2 2" />}
        </g>
      ))}
      {/* Total time badge */}
      <rect x="668" y="96" width="60" height="28" rx="14" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      <text x="698" y="114" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="700" dominantBaseline="central">4.5h</text>

      {/* ── Parallel ── */}
      <text x="60" y="182" fill="#34d399" fontSize="12" fontWeight="600" letterSpacing="0.3">Parallel (with worktrees)</text>
      {[
        { label: "Task A (2 hours)", w: 268, y: 196 },
        { label: "Task B (1h)", w: 134, y: 244 },
        { label: "Task C (1.5h)", w: 198, y: 292 },
      ].map((t) => (
        <g key={t.label}>
          <rect x="60" y={t.y} width={t.w} height="38" rx="8" fill="url(#svp-g)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
          <line x1="68" y1={t.y + 1} x2={60 + t.w - 8} y2={t.y + 1} stroke="rgba(16,185,129,0.12)" strokeWidth="1" strokeLinecap="round" />
          <text x={60 + t.w / 2} y={t.y + 22} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="500" dominantBaseline="central">{t.label}</text>
        </g>
      ))}
      {/* Time marker line */}
      <line x1="328" y1="194" x2="328" y2="334" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="344" y="268" fill="#34d399" fontSize="12" fontWeight="600">2h total</text>

      {/* Savings badge */}
      <g filter="url(#svp-glow-g)">
        <rect x="520" y="245" width="210" height="68" rx="14" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
      </g>
      <text x="625" y="274" textAnchor="middle" fill="#34d399" fontSize="20" fontWeight="700">56% faster</text>
      <text x="625" y="298" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Longest task determines total time</text>
    </svg>
  );
}

function SubagentIsolationDiagram() {
  const agents = [
    { cx: 100, name: "Agent 1", path: "worktree-batch-1", files: "Files 1-10", color: "#22d3ee" },
    { cx: 300, name: "Agent 2", path: "worktree-batch-2", files: "Files 11-20", color: "#34d399" },
    { cx: 500, name: "Agent 3", path: "worktree-batch-3", files: "Files 21-30", color: "#fbbf24" },
    { cx: 700, name: "Agent 4", path: "worktree-batch-4", files: "Files 31-40", color: "#f472b6" },
  ];
  const W = 800, H = 360;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="sa-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" /><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" /></linearGradient>
        <filter id="sa-glow-p"><feGaussianBlur stdDeviation="6" result="b" /><feFlood floodColor="#8b5cf6" floodOpacity="0.3" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        {agents.map((a, i) => (
          <filter key={i} id={`sa-glow-${i}`}><feGaussianBlur stdDeviation="4" result="b" /><feFlood floodColor={a.color} floodOpacity="0.15" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        ))}
      </defs>
      <rect width={W} height={H} rx="16" fill="url(#sa-bg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 9 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.06)" />
      )))}
      <text x={W / 2} y="34" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" letterSpacing="0.5">Subagent Isolation: Batch Processing</text>

      {/* Main Session */}
      <g filter="url(#sa-glow-p)">
        <rect x="280" y="52" width="240" height="58" rx="12" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
        <line x1="292" y1="53" x2="508" y2="53" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeLinecap="round" />
      </g>
      <text x={W / 2} y="78" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Main Session</text>
      <text x={W / 2} y="98" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="ui-monospace, SFMono-Regular, monospace">Orchestrator</text>

      {/* Connecting lines */}
      {agents.map((a, i) => (
        <g key={`line-${i}`}>
          <path d={`M400,110 C400,140 ${a.cx},140 ${a.cx},168`} fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" strokeDasharray="5 4">
            <animate attributeName="strokeDashoffset" from="9" to="0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </path>
          <polygon points={`${a.cx - 4},164 ${a.cx + 4},164 ${a.cx},172`} fill="rgba(139,92,246,0.4)" />
        </g>
      ))}

      {/* Agent cards */}
      {agents.map((a, i) => {
        const x = a.cx - 80, y = 176, w = 160, h = 118;
        return (
          <g key={a.name} filter={`url(#sa-glow-${i})`}>
            <rect x={x} y={y} width={w} height={h} rx="10" fill={`${a.color}06`} stroke={`${a.color}28`} strokeWidth="1.5" />
            {/* Header */}
            <rect x={x} y={y} width={w} height={34} rx="10" fill={`${a.color}10`} />
            <rect x={x} y={y + 22} width={w} height={12} fill={`${a.color}10`} />
            <line x1={x + 10} y1={y + 1} x2={x + w - 10} y2={y + 1} stroke={`${a.color}18`} strokeWidth="1" strokeLinecap="round" />
            <text x={a.cx} y={y + 20} textAnchor="middle" fill={a.color} fontSize="12" fontWeight="700">{a.name}</text>
            <text x={a.cx} y={y + 52} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, monospace">{a.path}</text>
            {/* File range badge */}
            <rect x={x + 20} y={y + 68} width={w - 40} height={24} rx="12" fill={`${a.color}0c`} stroke={`${a.color}22`} strokeWidth="1" />
            <text x={a.cx} y={y + 83} textAnchor="middle" fill={a.color} fontSize="10" fontWeight="600" dominantBaseline="central">{a.files}</text>
            {/* Activity dot */}
            <circle cx={x + w - 14} cy={y + 14} r="4" fill={a.color} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Bottom label */}
      <rect x="180" y="310" width="440" height="32" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x={W / 2} y="330" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" dominantBaseline="central">Each agent works in its own isolated worktree — no conflicts</text>
    </svg>
  );
}

function LifecycleDiagram() {
  const stages = [
    { x: 40, label: "Create", sub: "git worktree add", color: "#34d399", icon: "+" },
    { x: 200, label: "Branch", sub: "worktree-<name>", color: "#22d3ee", icon: "\u2387" },
    { x: 360, label: "Work", sub: "Claude session", color: "#a78bfa", icon: "\u270E" },
    { x: 520, label: "Commit", sub: "git push + PR", color: "#fbbf24", icon: "\u2713" },
    { x: 680, label: "Cleanup", sub: "remove or keep", color: "#f87171", icon: "\u2715" },
  ];
  const W = 800, H = 200;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="lc-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" /><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.7" /></linearGradient>
        {stages.map((s, i) => (
          <filter key={i} id={`lc-glow-${i}`}><feGaussianBlur stdDeviation="5" result="b" /><feFlood floodColor={s.color} floodOpacity="0.2" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        ))}
      </defs>
      <rect width={W} height={H} rx="16" fill="url(#lc-bg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 5 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.06)" />
      )))}
      <text x={W / 2} y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" letterSpacing="0.5">Worktree Lifecycle</text>

      {/* Connection arrows */}
      {stages.slice(0, -1).map((s, i) => {
        const next = stages[i + 1];
        return (
          <g key={`arrow-${i}`}>
            <line x1={s.x + 86} y1={90} x2={next.x + 16} y2={90} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            {/* Animated flowing dots */}
            <circle r="2" fill="rgba(255,255,255,0.3)">
              <animateMotion dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} path={`M${s.x + 86},90 L${next.x + 16},90`} />
            </circle>
            <polygon points={`${next.x + 12},86 ${next.x + 18},90 ${next.x + 12},94`} fill="rgba(255,255,255,0.15)" />
          </g>
        );
      })}

      {/* Stage nodes */}
      {stages.map((s, i) => (
        <g key={s.label} filter={`url(#lc-glow-${i})`}>
          {/* Outer ring */}
          <circle cx={s.x + 50} cy={90} r="30" fill="none" stroke={`${s.color}20`} strokeWidth="1.5" />
          {/* Inner filled circle */}
          <circle cx={s.x + 50} cy={90} r="24" fill={`${s.color}10`} stroke={`${s.color}40`} strokeWidth="2" />
          {/* Icon */}
          <text x={s.x + 50} y={91} textAnchor="middle" fill={s.color} fontSize="18" fontWeight="700" dominantBaseline="central">{s.icon}</text>
          {/* Label */}
          <text x={s.x + 50} y={140} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">{s.label}</text>
          <text x={s.x + 50} y={158} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, monospace">{s.sub}</text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO ANIMATED SVG — Git Branch Tree Crystal
   A stylized tree/crystal growing branches, inspired by
   the diamond + organic SVGator examples.
   ═══════════════════════════════════════════════════════ */

function HeroBranchTree() {
  return (
    <svg viewBox="0 0 800 500" className="w-full my-8" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="hbt-trunk" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="hbt-branch1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="hbt-branch2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="hbt-branch3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="hbt-sky" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <radialGradient id="hbt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="hbt-bloom">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="hbt-softglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Particle */}
        <radialGradient id="hbt-particle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="500" rx="20" fill="url(#hbt-sky)" />

      {/* Ambient glow behind tree */}
      <ellipse cx="400" cy="320" rx="200" ry="180" fill="url(#hbt-glow)" />

      {/* Floating particles */}
      {[
        { cx: 150, cy: 120, r: 2, dur: "6s", delay: "0s" },
        { cx: 650, cy: 80, r: 1.5, dur: "8s", delay: "1s" },
        { cx: 300, cy: 60, r: 1, dur: "7s", delay: "2s" },
        { cx: 520, cy: 150, r: 2.5, dur: "9s", delay: "0.5s" },
        { cx: 100, cy: 300, r: 1.5, dur: "7s", delay: "3s" },
        { cx: 700, cy: 250, r: 2, dur: "6s", delay: "1.5s" },
        { cx: 250, cy: 180, r: 1, dur: "8s", delay: "4s" },
        { cx: 550, cy: 350, r: 1.5, dur: "7s", delay: "2.5s" },
      ].map((p, i) => (
        <circle key={`p${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="url(#hbt-particle)">
          <animate attributeName="cy" values={`${p.cy};${p.cy - 30};${p.cy}`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Ground / base */}
      <ellipse cx="400" cy="430" rx="140" ry="20" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />

      {/* Main trunk — grows upward */}
      <path d="M400,430 C400,380 398,340 400,280" stroke="url(#hbt-trunk)" strokeWidth="6" fill="none" strokeLinecap="round">
        <animate attributeName="strokeDasharray" values="0 200;200 0" dur="1.5s" fill="freeze" />
      </path>

      {/* Branch 1 — right curve to cyan terminal */}
      <path d="M400,320 C420,300 480,270 560,240" stroke="url(#hbt-branch1)" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <animate attributeName="strokeDasharray" values="0 250;250 0" dur="1.2s" begin="0.8s" fill="freeze" />
      </path>
      {/* Sub-branch */}
      <path d="M500,260 C510,240 530,220 560,200" stroke="url(#hbt-branch1)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="strokeDasharray" values="0 120;120 0" dur="0.8s" begin="1.5s" fill="freeze" />
      </path>

      {/* Branch 2 — left curve to purple terminal */}
      <path d="M400,310 C380,290 320,260 240,240" stroke="url(#hbt-branch2)" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <animate attributeName="strokeDasharray" values="0 250;250 0" dur="1.2s" begin="1s" fill="freeze" />
      </path>
      {/* Sub-branch */}
      <path d="M300,260 C280,240 260,220 230,200" stroke="url(#hbt-branch2)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="strokeDasharray" values="0 120;120 0" dur="0.8s" begin="1.7s" fill="freeze" />
      </path>

      {/* Branch 3 — top center to amber terminal */}
      <path d="M400,280 C400,250 400,220 400,180" stroke="url(#hbt-branch3)" strokeWidth="3" fill="none" strokeLinecap="round">
        <animate attributeName="strokeDasharray" values="0 120;120 0" dur="1s" begin="1.2s" fill="freeze" />
      </path>
      {/* Sub-branches from top */}
      <path d="M400,210 C420,190 440,175 470,160" stroke="url(#hbt-branch3)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="strokeDasharray" values="0 100;100 0" dur="0.8s" begin="1.9s" fill="freeze" />
      </path>
      <path d="M400,210 C380,190 360,175 330,160" stroke="url(#hbt-branch3)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="strokeDasharray" values="0 100;100 0" dur="0.8s" begin="2s" fill="freeze" />
      </path>

      {/* Terminal nodes — glowing orbs at branch ends */}
      {/* Right — Cyan */}
      <g filter="url(#hbt-bloom)">
        <circle cx="560" cy="240" r="0" fill="#06b6d4" opacity="0.9">
          <animate attributeName="r" values="0;16" dur="0.5s" begin="2s" fill="freeze" />
        </circle>
      </g>
      <circle cx="560" cy="240" r="0" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5">
        <animate attributeName="r" values="0;26" dur="0.6s" begin="2s" fill="freeze" />
        <animate attributeName="r" values="26;28;26" dur="3s" begin="2.6s" repeatCount="indefinite" />
      </circle>
      <text x="560" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" opacity="0">
        feature
        <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.3s" fill="freeze" />
      </text>
      {/* Right sub-branch orb */}
      <circle cx="560" cy="200" r="0" fill="#06b6d4" opacity="0.6" filter="url(#hbt-softglow)">
        <animate attributeName="r" values="0;8" dur="0.4s" begin="2.3s" fill="freeze" />
      </circle>

      {/* Left — Purple */}
      <g filter="url(#hbt-bloom)">
        <circle cx="240" cy="240" r="0" fill="#8b5cf6" opacity="0.9">
          <animate attributeName="r" values="0;16" dur="0.5s" begin="2.2s" fill="freeze" />
        </circle>
      </g>
      <circle cx="240" cy="240" r="0" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5">
        <animate attributeName="r" values="0;26" dur="0.6s" begin="2.2s" fill="freeze" />
        <animate attributeName="r" values="26;28;26" dur="3.5s" begin="2.8s" repeatCount="indefinite" />
      </circle>
      <text x="240" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" opacity="0">
        bugfix
        <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.5s" fill="freeze" />
      </text>
      {/* Left sub-branch orb */}
      <circle cx="230" cy="200" r="0" fill="#8b5cf6" opacity="0.6" filter="url(#hbt-softglow)">
        <animate attributeName="r" values="0;8" dur="0.4s" begin="2.5s" fill="freeze" />
      </circle>

      {/* Top — Amber */}
      <g filter="url(#hbt-bloom)">
        <circle cx="400" cy="180" r="0" fill="#f59e0b" opacity="0.9">
          <animate attributeName="r" values="0;16" dur="0.5s" begin="2.4s" fill="freeze" />
        </circle>
      </g>
      <circle cx="400" cy="180" r="0" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5">
        <animate attributeName="r" values="0;26" dur="0.6s" begin="2.4s" fill="freeze" />
        <animate attributeName="r" values="26;28;26" dur="4s" begin="3s" repeatCount="indefinite" />
      </circle>
      <text x="400" y="185" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" opacity="0">
        refactor
        <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.7s" fill="freeze" />
      </text>
      {/* Top sub-branch orbs */}
      <circle cx="470" cy="160" r="0" fill="#f59e0b" opacity="0.6" filter="url(#hbt-softglow)">
        <animate attributeName="r" values="0;7" dur="0.4s" begin="2.7s" fill="freeze" />
      </circle>
      <circle cx="330" cy="160" r="0" fill="#f59e0b" opacity="0.6" filter="url(#hbt-softglow)">
        <animate attributeName="r" values="0;7" dur="0.4s" begin="2.8s" fill="freeze" />
      </circle>

      {/* Root node — main */}
      <g filter="url(#hbt-bloom)">
        <circle cx="400" cy="430" r="14" fill="#10b981" opacity="0.9" />
      </g>
      <circle cx="400" cy="430" r="22" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="2">
        <animate attributeName="r" values="22;24;22" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="400" y="435" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">main</text>

      {/* Labels */}
      <text x="400" y="480" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" letterSpacing="3">GIT WORKTREE BRANCHES</text>

      {/* Orbiting rings around root */}
      <ellipse cx="400" cy="430" rx="50" ry="12" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="1" strokeDasharray="4 6">
        <animateTransform attributeName="transform" type="rotate" values="0 400 430;360 400 430" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="430" rx="70" ry="16" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1" strokeDasharray="4 8">
        <animateTransform attributeName="transform" type="rotate" values="360 400 430;0 400 430" dur="25s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CHALLENGE SECTION SVGs
   ═══════════════════════════════════════════════════════ */

function ChallengeTrophySVG() {
  const W = 800, H = 260;
  const badges = [
    { x: 130, label: "BEGINNER", color: "#34d399", num: "1" },
    { x: 400, label: "INTERMEDIATE", color: "#60a5fa", num: "2" },
    { x: 670, label: "ADVANCED", color: "#f87171", num: "3" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="ct-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" /><stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" /></linearGradient>
        <linearGradient id="ct-cup" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#fcd34d" /><stop offset="60%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
        <radialGradient id="ct-aura" cx="50%" cy="45%" r="40%"><stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0" /></radialGradient>
        <filter id="ct-bloom"><feGaussianBlur stdDeviation="8" result="b" /><feFlood floodColor="#fbbf24" floodOpacity="0.35" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="ct-soft"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <rect width={W} height={H} rx="16" fill="url(#ct-bg)" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
      {/* Grid dots */}
      {Array.from({ length: 20 }).map((_, xi) => Array.from({ length: 7 }).map((_, yi) => (
        <circle key={`${xi}-${yi}`} cx={xi * 42 + 10} cy={yi * 42 + 10} r="0.5" fill="rgba(139,92,246,0.05)" />
      )))}

      {/* Aura glow */}
      <ellipse cx={W / 2} cy="115" rx="160" ry="100" fill="url(#ct-aura)" />

      {/* Trophy — centered, compact */}
      <g transform="translate(400,108)" filter="url(#ct-bloom)">
        {/* Cup body */}
        <path d="M-32,-45 L-28,15 C-28,35 -8,48 0,48 C8,48 28,35 28,15 L32,-45 Z" fill="url(#ct-cup)" opacity="0.95">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Rim highlight */}
        <ellipse cx="0" cy="-45" rx="34" ry="7" fill="#fef3c7" opacity="0.5" />
        {/* Handles */}
        <path d="M-32,-30 C-50,-30 -58,-12 -58,5 C-58,18 -48,25 -35,22" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
        <path d="M32,-30 C50,-30 58,-12 58,5 C58,18 48,25 35,22" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
        {/* Stem + base */}
        <rect x="-6" y="48" width="12" height="14" rx="2" fill="#b45309" />
        <ellipse cx="0" cy="66" rx="22" ry="5" fill="#92400e" opacity="0.7" />
        {/* Star */}
        <polygon points="0,-25 5,-12 18,-10 8,0 11,14 0,8 -11,14 -8,0 -18,-10 -5,-12" fill="#fef3c7" opacity="0.85">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </polygon>
      </g>

      {/* Sparkles */}
      {[
        { x: 280, y: 60 }, { x: 520, y: 70 }, { x: 260, y: 130 }, { x: 540, y: 140 },
        { x: 310, y: 45 }, { x: 490, y: 50 }, { x: 330, y: 170 }, { x: 470, y: 175 },
      ].map((s, i) => (
        <path key={`sp${i}`}
          d={`M${s.x},${s.y - 5} L${s.x + 1.5},${s.y - 1.5} L${s.x + 5},${s.y} L${s.x + 1.5},${s.y + 1.5} L${s.x},${s.y + 5} L${s.x - 1.5},${s.y + 1.5} L${s.x - 5},${s.y} L${s.x - 1.5},${s.y - 1.5} Z`}
          fill="#fbbf24" opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur={`${4 + i * 0.7}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* Text */}
      <text x={W / 2} y="208" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" letterSpacing="3">CHALLENGE TIME</text>
      <text x={W / 2} y="226" textAnchor="middle" fill="rgba(251,191,36,0.6)" fontSize="9" letterSpacing="4">TEST YOUR WORKTREE KNOWLEDGE</text>

      {/* Difficulty badges — bottom row */}
      {badges.map((b) => (
        <g key={b.label}>
          <rect x={b.x - 58} y="238" width="116" height="16" rx="8" fill={`${b.color}0c`} stroke={`${b.color}25`} strokeWidth="1" />
          <circle cx={b.x - 40} cy="246" r="5" fill={`${b.color}20`} stroke={`${b.color}50`} strokeWidth="1" />
          <text x={b.x - 40} y="247" textAnchor="middle" fill={b.color} fontSize="7" fontWeight="700" dominantBaseline="central">{b.num}</text>
          <text x={b.x + 5} y="247" textAnchor="middle" fill={b.color} fontSize="8" fontWeight="600" letterSpacing="1" dominantBaseline="central">{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ChallengeProgressSVG({ completed }: { completed: number }) {
  const total = 3;
  const challenges = [
    { label: "Basic Ops", color: "#34d399", icon: "1" },
    { label: "Parallel Dev", color: "#60a5fa", icon: "2" },
    { label: "Batch Agent", color: "#f87171", icon: "3" },
  ];

  return (
    <svg viewBox="0 0 700 80" className="w-full my-4" style={{ maxWidth: 700 }}>
      <defs>
        <linearGradient id="cpg-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" /><stop offset="50%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#f87171" />
        </linearGradient>
        <filter id="cpg-glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Track background */}
      <rect x="80" y="32" width="540" height="6" rx="3" fill="rgba(255,255,255,0.05)" />
      {/* Track segments (subtle tick marks) */}
      {[1, 2].map((i) => <line key={i} x1={80 + i * 180} y1="28" x2={80 + i * 180} y2="42" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
      {/* Fill bar */}
      {completed > 0 && (
        <rect x="80" y="32" width={540 * (completed / total)} height="6" rx="3" fill="url(#cpg-fill)" opacity="0.75" filter="url(#cpg-glow)">
          <animate attributeName="width" from="0" to={540 * (completed / total)} dur="0.8s" fill="freeze" />
        </rect>
      )}

      {/* Nodes */}
      {challenges.map((ch, i) => {
        const x = 80 + i * 270;
        const done = i < completed;
        return (
          <g key={ch.label}>
            {/* Outer ring */}
            <circle cx={x} cy="35" r="20" fill="none" stroke={done ? `${ch.color}30` : "rgba(255,255,255,0.06)"} strokeWidth="1.5" />
            {/* Inner circle */}
            <circle cx={x} cy="35" r="15" fill={done ? `${ch.color}18` : "rgba(255,255,255,0.03)"} stroke={done ? `${ch.color}60` : "rgba(255,255,255,0.12)"} strokeWidth={done ? 2 : 1.5} />
            {done ? (
              <text x={x} y="36" textAnchor="middle" fill={ch.color} fontSize="14" fontWeight="700" dominantBaseline="central">&#10003;</text>
            ) : (
              <text x={x} y="36" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontWeight="600" dominantBaseline="central">{ch.icon}</text>
            )}
            <text x={x} y="68" textAnchor="middle" fill={done ? ch.color : "rgba(255,255,255,0.3)"} fontSize="9" fontWeight="500">{ch.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ChallengeLevelBadge({ level, difficulty, color }: { level: number; difficulty: string; color: string }) {
  return (
    <svg viewBox="0 0 240 48" className="inline-block" style={{ width: 240, height: 48, verticalAlign: "middle" }}>
      <defs>
        <linearGradient id={`clb-${level}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
        <filter id={`clb-glow-${level}`}><feGaussianBlur stdDeviation="3" result="b" /><feFlood floodColor={color} floodOpacity="0.2" result="c" /><feComposite in="c" in2="b" operator="in" result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="1" y="1" width="238" height="46" rx="23" fill={`url(#clb-${level})`} stroke={`${color}40`} strokeWidth="1.5" />
      <line x1="24" y1="2" x2="216" y2="2" stroke={`${color}15`} strokeWidth="1" strokeLinecap="round" />
      {/* Shield icon with glow */}
      <g transform="translate(16,8)" filter={`url(#clb-glow-${level})`}>
        <path d="M16,0 L28,6 L28,20 C28,28 16,34 16,34 C16,34 4,28 4,20 L4,6 Z" fill={`${color}20`} stroke={`${color}60`} strokeWidth="1.5" />
        <text x="16" y="21" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" dominantBaseline="central">{level}</text>
      </g>
      {/* Text */}
      <text x="58" y="20" fill="white" fontSize="13" fontWeight="700">Challenge {level}</text>
      <text x="58" y="36" fill={color} fontSize="8" fontWeight="600" letterSpacing="1.5">{difficulty}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CODE EXAMPLE CONSTANTS
   ═══════════════════════════════════════════════════════ */

const nativeWorktreeCommands = `# Native Git Worktree Commands

# Create a new worktree with existing branch
git worktree add ../feature-branch feature-branch

# Create a new worktree with NEW branch from current HEAD
git worktree add -b feature-branch ../feature-branch

# List all worktrees
git worktree list
# /home/user/project         abc1234 [main]
# /home/user/feature-branch  def5678 [feature-branch]

# Remove a worktree (directory must be clean)
git worktree remove ../feature-branch

# Prune stale worktree references
git worktree prune`;

const claudeWorktreeCode = `# Claude Code Worktree Integration

# Create and enter a named worktree
claude --worktree feature-auth

# Create with auto-generated name
claude --worktree

# Short form
claude -w feature-auth

# What happens on creation:
# 1. Directory created: .claude/worktrees/feature-auth/
# 2. Branch created: worktree-feature-auth (from main)
# 3. Working directory set to the worktree
# 4. Claude session starts in isolated environment`;

const parallelTerminalCode = `# Terminal 1: Authentication feature
claude --worktree feature-auth
> "Implement OAuth2 login flow"

# Terminal 2: Bug fix (separate terminal window)
claude --worktree bugfix-memory-leak
> "Find and fix the memory leak in the cache module"

# Terminal 3: Documentation
claude --worktree docs-api
> "Generate API documentation for all endpoints"

# Each session:
# - Works on isolated files
# - Makes commits to its own branch
# - Can create its own PR
# - Doesn't interfere with other sessions`;

const agentDefinitionCode = `---
name: parallel-refactor
description: Refactor code in isolated worktree
isolation: worktree
---

Refactor the specified module following the project's coding standards.
Apply consistent naming conventions and extract reusable utilities.`;

const sessionManagementCode = `# Resuming Worktree Sessions

# List available sessions
claude --resume

# Resume specific session by ID or description
claude --resume feature-auth

# Resume with interactive picker
claude --resume

# Switching Between Worktrees
# Option 1: Open new terminal
cd .claude/worktrees/feature-b && claude --resume

# Option 2: Exit current, enter another
# (In Claude session)
> "Exit this worktree, keep it"
# Then start new session
claude --worktree feature-b`;

const hookConfigCode = `{
  "hooks": {
    "WorktreeCreate": [
      {
        "command": "scripts/create-workspace.sh $WORKTREE_NAME",
        "timeout": 30000
      }
    ],
    "WorktreeRemove": [
      {
        "command": "scripts/remove-workspace.sh $WORKTREE_PATH",
        "timeout": 30000
      }
    ]
  }
}`;

const hookScriptCode = `#!/bin/bash
# create-workspace.sh — Custom VCS worktree hook
WORKTREE_NAME=$1
WORKTREE_PATH="/path/to/workspaces/$WORKTREE_NAME"

# Create isolated workspace (your VCS-specific logic)
# Example for Perforce:
p4 client -o | sed "s/Root:.*/Root: $WORKTREE_PATH/" | p4 client -i
p4 sync //depot/...@head

# Output JSON (required by Claude Code)
echo "{\\"path\\": \\"$WORKTREE_PATH\\"}"`;

const mergeWorkflowCode = `# Merging Worktree Changes

# Option 1: Create PR from worktree branch
cd .claude/worktrees/my-feature
gh pr create --base main --head worktree-my-feature

# Option 2: Merge locally
cd ~/your-project   # Main directory
git merge worktree-my-feature

# Option 3: Cherry-pick specific commits
git cherry-pick <commit-hash>

# Cleanup after merge
git worktree remove .claude/worktrees/my-feature
git branch -d worktree-my-feature`;

const diagnosticCode = `# Diagnostic Commands for Troubleshooting

# List all worktrees with details
git worktree list --porcelain

# Check worktree status
cd .claude/worktrees/my-feature && git status

# View worktree branch commits
git log worktree-my-feature --oneline -10

# Compare worktree to main
git diff main...worktree-my-feature

# Clean up all stale references
git worktree prune --verbose

# Fix: "fatal: '<path>' is already checked out"
git worktree list           # Find where branch is checked out
git worktree remove <path>  # Remove stale worktree

# Fix: Worktree path already exists
git worktree prune
rm -rf .claude/worktrees/my-feature   # Manual cleanup
claude --worktree my-feature          # Try again`;

const bestPracticesCode = `# ✅ Good: Descriptive, lowercase names with hyphens
claude --worktree feature-user-auth
claude --worktree bugfix-memory-leak
claude --worktree refactor-api-layer

# ❌ Avoid: Vague or non-standard names
claude --worktree temp
claude --worktree test123
claude --worktree FEATURE_AUTH

# ✅ One worktree = one task/PR
claude --worktree add-login-button
claude --worktree fix-password-validation

# ❌ Avoid: Kitchen sink worktree
claude --worktree various-improvements

# Dependency management per worktree
cd .claude/worktrees/my-feature
npm install  # Each worktree needs its own node_modules

# Git aliases for convenience
# In ~/.gitconfig:
# [alias]
#     wt = worktree
#     wtl = worktree list
#     wta = worktree add
#     wtr = worktree remove`;

/* ─── Challenge Code Constants ─── */

const challenge1Starter = `# Challenge 1: Basic Worktree Operations
#
# You're working on the main branch and get three tasks:
# - Feature: add search functionality
# - Bugfix: fix login timeout
# - Docs: update API documentation
#
# Write git commands to:
# 1. Create a worktree for each task (from main)
# 2. List all active worktrees
# 3. Check branches in each worktree
# 4. Remove the docs worktree after it's done
# 5. Prune stale references
#
# Write your commands below:

`;

const challenge1Solution = `# Solution: Basic Worktree Operations

# 1. Create worktrees for each task
git worktree add -b feature/search ../wt-search main
git worktree add -b bugfix/login-timeout ../wt-login main
git worktree add -b docs/api-update ../wt-docs main

# 2. List all active worktrees
git worktree list
# Output:
# /home/user/project      abc1234 [main]
# /home/user/wt-search    def5678 [feature/search]
# /home/user/wt-login     ghi9012 [bugfix/login-timeout]
# /home/user/wt-docs      jkl3456 [docs/api-update]

# 3. Check branches in each worktree
cd ../wt-search && git branch --show-current  # feature/search
cd ../wt-login && git branch --show-current   # bugfix/login-timeout
cd ../wt-docs && git branch --show-current    # docs/api-update

# 4. Remove the docs worktree after completion
cd /home/user/project   # Return to main
git worktree remove ../wt-docs
git branch -d docs/api-update

# 5. Prune stale references
git worktree prune --verbose`;

const challenge2Starter = `# Challenge 2: Claude Code Parallel Development
#
# You need to use Claude Code worktrees to:
# 1. Start 3 parallel Claude sessions for:
#    - Implementing a REST API endpoint
#    - Writing integration tests
#    - Creating a database migration
# 2. Each should use short-form flag
# 3. After work is done, create PRs from each
# 4. Clean up worktrees that had no changes
#
# Write your commands below:

`;

const challenge2Solution = `# Solution: Claude Code Parallel Development

# Terminal 1: REST API endpoint
claude -w api-endpoint
> "Implement GET/POST /users endpoint with validation"
# ... Claude works, commits to worktree-api-endpoint branch
# Create PR:
# gh pr create --title "feat: users API endpoint" --base main

# Terminal 2: Integration tests
claude -w integration-tests
> "Write integration tests for the users API"
# ... Claude works, commits to worktree-integration-tests branch
# Create PR:
# gh pr create --title "test: users API integration tests" --base main

# Terminal 3: Database migration
claude -w db-migration
> "Create migration for users table with proper indexes"
# ... Claude works, commits to worktree-db-migration branch
# Create PR:
# gh pr create --title "feat: users table migration" --base main

# Clean up worktrees
# Unchanged worktrees are auto-deleted on exit
# For manual cleanup:
git worktree list
git worktree remove .claude/worktrees/api-endpoint
git worktree remove .claude/worktrees/integration-tests
git worktree remove .claude/worktrees/db-migration`;

const challenge3Starter = `# Challenge 3: Subagent Isolation & Batch Processing
#
# You have a large codebase migration:
# - 40 files need updating from API v1 to v2
# - You want to split across 4 agents
# - Each agent works in isolation
#
# Create an agent definition file (.claude/agents/batch-migrate.md)
# that uses worktree isolation, then write the commands to:
# 1. Define the agent with proper frontmatter
# 2. Spawn 4 agents, each handling 10 files
# 3. Describe how results are merged
#
# Write your agent definition and commands below:

`;

const challenge3Solution = `# Solution: Agent Definition (.claude/agents/batch-migrate.md)
# ---
# name: batch-migrate
# description: Migrate files from API v1 to v2
# isolation: worktree
# ---
# Migrate the assigned files from API v1 to v2.
# Update all import paths, function signatures,
# and response types to match the v2 schema.

# In your Claude session, spawn agents:
# > "Run batch-migrate on files 1-10 in src/api/"
# > "Run batch-migrate on files 11-20 in src/api/"
# > "Run batch-migrate on files 21-30 in src/api/"
# > "Run batch-migrate on files 31-40 in src/api/"

# Each agent:
# 1. Gets its own worktree (worktree-batch-migrate-<id>)
# 2. Works in complete isolation
# 3. On completion:
#    - No changes → worktree auto-deleted
#    - Changes made → worktree path + branch returned

# Merging results:
# For each completed agent worktree:
git merge worktree-batch-migrate-1
git merge worktree-batch-migrate-2
git merge worktree-batch-migrate-3
git merge worktree-batch-migrate-4
# Resolve any conflicts, then clean up
git worktree prune`;

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function GitWorktreesClaudeCodePage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("git-worktrees-claude-code", language);
  const category = getCategoryForPost("git-worktrees-claude-code");
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());
  const completedChallenges = visibleSolutions.size;

  const toggleSolution = (id: string) => {
    setVisibleSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          {category && (
            <>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li>
                <ButtonLink href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  {category.title}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>
            {postContent?.breadcrumbLabel || "Git Worktrees & Claude Code"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || "Git Worktrees & Claude Code: Complete Guide"}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || "A comprehensive reference for using git worktrees to accelerate development workflows with Claude Code."}
        </Text>
        {postContent?.categoriesDescription && (
          <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
            <Text className={styles.infoText}>{postContent.categoriesDescription}</Text>
          </div>
        )}

        <AnimatedSection>
          <HeroBranchTree />
        </AnimatedSection>
      </div>

      {/* ══════════════ SECTION 1: WHAT ARE GIT WORKTREES? ══════════════ */}
      <section id="worktree-fundamentals" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🌳"} 1. What Are Git Worktrees?
            </Heading>
            <Text className={styles.sectionDescription}>
              Git worktrees are a native Git feature that allows you to have multiple working directories attached to a single repository. Each worktree has its own working directory with a separate set of files, is checked out to its own branch, shares the same Git history, objects, and remote connections, and operates independently of other worktrees.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> No more <code>git stash</code> and context switching. Work on a feature, hotfix, and docs update simultaneously in separate directories.
              </Text>
            </div>

            <AnimatedSection>
              <TraditionalVsWorktreesDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Native Git Worktree Commands</Heading>
            <Text className="text-white/80 text-sm mb-3">These are the core git commands for managing worktrees:</Text>
            <CodeEditor
              code={nativeWorktreeCommands}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 2: HOW CLAUDE CODE USES WORKTREES ══════════════ */}
      <section id="claude-code-integration" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🤖"} 2. How Claude Code Uses Worktrees
            </Heading>
            <Text className={styles.sectionDescription}>
              Claude Code provides a managed worktree experience that abstracts away the complexity of manual worktree management. Worktrees are automatically created in <code>.claude/worktrees/&lt;name&gt;/</code>, branches are named <code>worktree-&lt;name&gt;</code>, and unchanged worktrees are automatically cleaned up on session exit.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Integration Points:</strong>
                <br />&#8226; <strong>Automatic Creation:</strong> Creates worktrees in .claude/worktrees/&lt;name&gt;/
                <br />&#8226; <strong>Branch Naming:</strong> Branches automatically named worktree-&lt;name&gt;
                <br />&#8226; <strong>Base Branch:</strong> Worktrees branch from your default remote branch (usually main)
                <br />&#8226; <strong>Cleanup:</strong> Automatic cleanup of unchanged worktrees on session exit
                <br />&#8226; <strong>Session Isolation:</strong> Each worktree maintains its own Claude session state
              </Text>
            </div>

            <AnimatedSection>
              <DirectoryStructureDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Getting Started</Heading>
            <Text className="text-white/80 text-sm mb-3">Start Claude Code in a worktree with a single command:</Text>
            <CodeEditor
              code={claudeWorktreeCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <div className={styles.tipLine}>
              <span className={styles.tipLineIcon}>{"💡"}</span>
              <span className={styles.tipLineText}>
                <strong>First-time setup:</strong> Add <code>.claude/worktrees/</code> to your <code>.gitignore</code> to prevent worktree contents from appearing as untracked files.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 3: PARALLEL DEVELOPMENT WORKFLOWS ══════════════ */}
      <section id="parallel-workflows" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"⚡"} 3. Parallel Development Workflows
            </Heading>
            <Text className={styles.sectionDescription}>
              The primary use case for worktrees is running multiple Claude sessions simultaneously. Each session works on isolated files, makes commits to its own branch, can create its own PR, and doesn&apos;t interfere with other sessions.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Multiple Terminal Sessions</Heading>
            <CodeEditor
              code={parallelTerminalCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
            />

            <AnimatedSection>
              <WorkflowDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Sequential vs Parallel Time Savings</Heading>
            <Text className="text-white/80 text-sm mb-3">Worktrees let you run tasks in parallel, dramatically reducing total development time:</Text>
            <AnimatedSection>
              <SequentialVsParallelDiagram />
            </AnimatedSection>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 4: SUBAGENT ISOLATION ══════════════ */}
      <section id="subagent-isolation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔒"} 4. Subagent Isolation
            </Heading>
            <Text className={styles.sectionDescription}>
              Claude Code subagents can use worktree isolation for parallel operations. When an agent spawns in a fresh worktree, all changes are isolated from the main session. On completion, unchanged worktrees are auto-deleted while worktrees with changes return their path and branch in the result.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Agent Definition with Isolation</Heading>
            <Text className="text-white/80 text-sm mb-3">Create an agent file with <code>isolation: worktree</code> in the frontmatter:</Text>
            <CodeEditor
              code={agentDefinitionCode}
              language="yaml"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <AnimatedSection>
              <SubagentIsolationDiagram />
            </AnimatedSection>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Batch Processing Pattern:</strong> For processing many files or modules, spawn multiple agents — each in its own worktree — handling a subset of files. This scales linearly with the number of available worktrees.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 5: SESSION MANAGEMENT ══════════════ */}
      <section id="session-management" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"📋"} 5. Session Management
            </Heading>
            <Text className={styles.sectionDescription}>
              Sessions in worktrees can be resumed like any other session. The session picker is worktree-aware and groups sessions by their context. Each worktree maintains its own conversation history, file edit history, tool permission states, and working directory context.
            </Text>

            <CodeEditor
              code={sessionManagementCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>In-Session Tools:</strong>
                <br />&#8226; <strong>EnterWorktree:</strong> Creates a worktree and switches the session into it. Optional <code>name</code> parameter.
                <br />&#8226; <strong>ExitWorktree:</strong> Exits a worktree session. Requires <code>action</code>: &quot;keep&quot; or &quot;remove&quot;. Use <code>discard_changes: true</code> when removing with uncommitted changes.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 6: WORKTREE LIFECYCLE ══════════════ */}
      <section id="lifecycle" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔄"} 6. Worktree Lifecycle
            </Heading>
            <Text className={styles.sectionDescription}>
              Understanding the full worktree lifecycle helps you manage them effectively. From creation to cleanup, each stage has specific behaviors and options.
            </Text>

            <AnimatedSection>
              <LifecycleDiagram />
            </AnimatedSection>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Exit Behavior:</strong>
                <br />&#8226; <strong>No changes:</strong> Worktree and branch are automatically deleted
                <br />&#8226; <strong>Has changes:</strong> You&apos;re prompted to keep or remove the worktree
                <br />&#8226; <strong>Keep:</strong> Preserves the directory and branch for later resumption
                <br />&#8226; <strong>Remove:</strong> Deletes everything (requires confirmation if uncommitted changes exist)
              </Text>
            </div>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Merging Worktree Changes</Heading>
            <Text className="text-white/80 text-sm mb-3">After completing work in a worktree, merge changes back into the main branch:</Text>
            <CodeEditor
              code={mergeWorkflowCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 7: HOOKS FOR CUSTOM VCS ══════════════ */}
      <section id="hooks-custom-vcs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🪝"} 7. Hooks for Custom VCS
            </Heading>
            <Text className={styles.sectionDescription}>
              If you use a non-Git version control system (SVN, Perforce, Mercurial), configure custom hooks in settings.json. The <code>WorktreeCreate</code> hook fires when creating a worktree and must output JSON with the worktree path. The <code>WorktreeRemove</code> hook handles cleanup.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Hook Configuration (settings.json)</Heading>
            <CodeEditor
              code={hookConfigCode}
              language="json"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Custom Hook Script Example</Heading>
            <CodeEditor
              code={hookScriptCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Environment Variables Available:</strong> <code>$WORKTREE_NAME</code>, <code>$WORKTREE_PATH</code>, <code>$WORKTREE_BRANCH</code>, and <code>$PROJECT_ROOT</code> are available in hook commands.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 8: BEST PRACTICES ══════════════ */}
      <section id="best-practices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"✅"} 8. Best Practices
            </Heading>
            <Text className={styles.sectionDescription}>
              Follow these guidelines to get the most out of git worktrees with Claude Code. From naming conventions to dependency management, these patterns keep your workflow clean and efficient.
            </Text>

            <CodeEditor
              code={bestPracticesCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Quick Checklist:</strong>
                <br />&#8226; Add <code>.claude/worktrees/</code> to .gitignore
                <br />&#8226; Run <code>npm install</code> in each worktree
                <br />&#8226; One worktree = one focused task
                <br />&#8226; Clean up unused worktrees regularly with <code>git worktree prune</code>
                <br />&#8226; Use different ports for dev servers across worktrees
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Limitations &amp; Watch Outs:</strong>
                <br />&#8226; Running multiple dev servers requires different ports per worktree
                <br />&#8226; Local databases may conflict — use separate DBs or schemas
                <br />&#8226; Lock files may need cleanup between worktrees
                <br />&#8226; Each worktree needs its own dependency installation
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 9: TROUBLESHOOTING ══════════════ */}
      <section id="troubleshooting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔧"} 9. Troubleshooting
            </Heading>
            <Text className={styles.sectionDescription}>
              Common issues and their solutions when working with git worktrees. From branch conflicts to cleanup problems, here are the diagnostic commands and fixes you need.
            </Text>

            <CodeEditor
              code={diagnosticCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 10: USE CASES ══════════════ */}
      <section id="use-cases" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎯"} 10. Use Cases
            </Heading>
            <Text className={styles.sectionDescription}>
              Worktrees shine in many real-world scenarios. Here are the most impactful use cases with Claude Code.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>1. Parallel Feature Development:</strong> Build multiple independent features simultaneously. Start three feature branches, each Claude session works independently, create PRs from each when ready.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-4`}>
              <Text className={styles.infoText}>
                <strong>2. Urgent Bug Fix During Feature Work:</strong> Production bug discovered while deep in feature development? Create an isolated worktree for the hotfix — no stashing, no lost context. Fix the bug, create PR, merge, and return to your feature work.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>3. Exploratory Refactoring:</strong> Try multiple approaches to a refactor in separate worktrees. Compare results with <code>git diff worktree-approach-a worktree-approach-b</code>, keep the better approach. No risk, easy cleanup.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>4. Large-Scale Code Migrations:</strong> Divide work across multiple worktrees or use subagents with isolation. Each processes a subset in parallel, dramatically reducing migration time.
              </Text>
            </div>

            <div className={`${styles.infoBox} mb-4`}>
              <Text className={styles.infoText}>
                <strong>5. Learning &amp; Experimentation:</strong> Try new libraries or patterns without risk. If it works, merge or create a PR. If it fails, delete the worktree — no cleanup needed.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 11: HANDS-ON CHALLENGES ══════════════ */}
      <section id="challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🏆"} 11. Hands-On Challenges
            </Heading>
            <Text className={styles.sectionDescription}>
              Test your understanding of git worktrees and Claude Code integration. Complete these challenges in the editor below — try writing the commands yourself before revealing the solution!
            </Text>

            {/* Animated Trophy Hero */}
            <AnimatedSection>
              <ChallengeTrophySVG />
            </AnimatedSection>

            {/* Live Progress Tracker */}
            <ChallengeProgressSVG completed={completedChallenges} />

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <div className={styles.infoBoxLabel}>HOW TO USE CHALLENGES</div>
              <Text className={styles.infoText}>
                Write your commands in the editor below. When you&apos;re ready, click the solution toggle to compare your answer. The progress bar above tracks your completion. Challenges progress from beginner to advanced.
              </Text>
            </div>

            {/* ─── Challenge 1 ─── */}
            <div className="mt-4 mb-2">
              <ChallengeLevelBadge level={1} difficulty="BEGINNER" color="#34d399" />
            </div>
            <CodeEditor
              code={challenge1Starter}
              language="bash"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
              maxCodeHeight={350}
            />
            <button
              type="button"
              onClick={() => toggleSolution("ch1")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch1")}
            >
              {visibleSolutions.has("ch1") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch1") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge1Solution} language="bash" readOnly height="auto" disableLinting={true} collapsePanelsByDefault={true} compactToolbar={true} />
              </div>
            )}

            {/* ─── Challenge 2 ─── */}
            <div className="mt-8 mb-2">
              <ChallengeLevelBadge level={2} difficulty="INTERMEDIATE" color="#60a5fa" />
            </div>
            <CodeEditor
              code={challenge2Starter}
              language="bash"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
              maxCodeHeight={350}
            />
            <button
              type="button"
              onClick={() => toggleSolution("ch2")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch2")}
            >
              {visibleSolutions.has("ch2") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch2") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge2Solution} language="bash" readOnly height="auto" disableLinting={true} collapsePanelsByDefault={true} compactToolbar={true} />
              </div>
            )}

            {/* ─── Challenge 3 ─── */}
            <div className="mt-8 mb-2">
              <ChallengeLevelBadge level={3} difficulty="ADVANCED" color="#f87171" />
            </div>
            <CodeEditor
              code={challenge3Starter}
              language="bash"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              height="auto"
              maxCodeHeight={400}
            />
            <button
              type="button"
              onClick={() => toggleSolution("ch3")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch3")}
            >
              {visibleSolutions.has("ch3") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch3") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge3Solution} language="bash" readOnly height="auto" disableLinting={true} collapsePanelsByDefault={true} compactToolbar={true} />
              </div>
            )}

            {/* Completion celebration */}
            {completedChallenges === 3 && (
              <AnimatedSection>
                <svg viewBox="0 0 700 100" className="w-full mt-6" style={{ maxWidth: 700 }}>
                  <defs>
                    <linearGradient id="comp-bg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <rect width="700" height="100" rx="16" fill="url(#comp-bg)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                  {/* Confetti particles */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const cx = 50 + Math.random() * 600;
                    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
                    const c = colors[i % colors.length];
                    return (
                      <rect key={`conf${i}`} x={cx} y={10 + Math.random() * 20} width={4 + Math.random() * 4} height={4 + Math.random() * 4} rx="1"
                        fill={c} opacity="0" transform={`rotate(${Math.random() * 360} ${cx} ${20})`}>
                        <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + Math.random() * 2}s`} begin={`${Math.random() * 2}s`} repeatCount="indefinite" />
                        <animate attributeName="y" values={`${10 + Math.random() * 20};${70 + Math.random() * 20}`} dur={`${2 + Math.random() * 2}s`} begin={`${Math.random() * 2}s`} repeatCount="indefinite" />
                      </rect>
                    );
                  })}
                  <text x="350" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="700">
                    All Challenges Complete!
                  </text>
                  <text x="350" y="75" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="12" fontWeight="500">
                    You&apos;ve mastered git worktrees with Claude Code
                  </text>
                </svg>
              </AnimatedSection>
            )}

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <div className={styles.infoBoxLabel}>CONGRATULATIONS!</div>
              <Text className={styles.infoText}>
                If you&apos;ve completed all 3 challenges, you have a solid understanding of git worktrees with Claude Code! You can now manage parallel development workflows, use subagent isolation for batch processing, and troubleshoot common worktree issues. Keep practicing with real projects to master the workflow.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ CONCLUSION ══════════════ */}
      <section id="conclusion" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎯"} Conclusion
            </Heading>
            <Text className={styles.sectionDescription}>
              Git worktrees combined with Claude Code create a powerful parallel development workflow. Instead of context-switching between branches, you maintain multiple isolated working directories — each with its own Claude session — working simultaneously on different tasks.
            </Text>
            <Text className={styles.sectionDescription}>
              The key insights are: worktrees eliminate stashing and branch switching overhead, Claude Code&apos;s managed worktree experience handles the complexity for you, subagent isolation enables batch processing at scale, and the worktree lifecycle ensures clean resource management with automatic cleanup.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Key Takeaways:</strong>
                <br />&#8226; Worktrees enable truly parallel development — no more sequential context switching
                <br />&#8226; Claude Code manages worktree lifecycle automatically
                <br />&#8226; Subagent isolation scales batch processing across multiple worktrees
                <br />&#8226; Custom hooks support non-Git VCS workflows
                <br />&#8226; One worktree per task keeps work focused and PRs clean
                <br />&#8226; Automatic cleanup prevents worktree sprawl
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Footer Navigation */}
      <nav className={styles.navigation}>
        <ButtonLink
          href={createLocalizedPath("/developer-section/blog")}
          variant="secondary"
          className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
        >
          &#8592; Back to Blog
        </ButtonLink>
        {category && (
          <ButtonLink
            href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)}
            variant="primary"
          >
            {category.title} &#8594;
          </ButtonLink>
        )}
      </nav>
    </BlogContentLayout>
  );
}
