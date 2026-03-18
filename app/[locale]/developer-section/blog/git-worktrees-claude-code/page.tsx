"use client";

import React, { useState } from "react";
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
    <svg viewBox="0 0 800 300" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="wtg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="wtg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
        </linearGradient>
        <filter id="wtglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="800" height="300" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Traditional Git vs Worktrees</text>

      {/* Traditional side */}
      <text x="200" y="60" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="13" fontWeight="600">Traditional: Sequential Switching</text>
      {["checkout feature-a", "git stash", "checkout bugfix", "checkout feature-a", "git stash pop"].map((cmd, i) => (
        <React.Fragment key={cmd + i}>
          <rect x={60} y={75 + i * 42} width={280} height={32} rx="6" fill="url(#wtg1)" opacity={0.15 + i * 0.05} stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          <text x={200} y={96 + i * 42} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontFamily="monospace">{cmd}</text>
          {i < 4 && (
            <polygon points={`200,${107 + i * 42} 195,${115 + i * 42} 205,${115 + i * 42}`} fill="rgba(239,68,68,0.4)" />
          )}
        </React.Fragment>
      ))}

      {/* Worktrees side */}
      <text x="600" y="60" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="600">Worktrees: Parallel Directories</text>
      {[
        { path: "~/project/", branch: "main", y: 80 },
        { path: "~/project-feature-a/", branch: "feature-a", y: 135 },
        { path: "~/project-bugfix/", branch: "bugfix-123", y: 190 },
      ].map((wt) => (
        <React.Fragment key={wt.branch}>
          <rect x={460} y={wt.y} width={280} height={42} rx="8" fill="url(#wtg2)" opacity="0.15" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5" />
          <text x={480} y={wt.y + 18} fill="rgba(16,185,129,0.95)" fontSize="11" fontFamily="monospace" fontWeight="600">{wt.path}</text>
          <text x={480} y={wt.y + 33} fill="rgba(255,255,255,0.6)" fontSize="10">{wt.branch}</text>
          <circle cx={725} cy={wt.y + 21} r="8" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
          <text x={725} y={wt.y + 25} textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10">&#10003;</text>
        </React.Fragment>
      ))}

      {/* Bottom labels */}
      <rect x={60} y={288 - 20} width={280} height={22} rx="4" fill="rgba(239,68,68,0.08)" />
      <text x={200} y={288 - 4} textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="10">Context switching, stashing, slow</text>
      <rect x={460} y={245} width={280} height={22} rx="4" fill="rgba(16,185,129,0.08)" />
      <text x={600} y={261} textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="10">All branches available simultaneously</text>
    </svg>
  );
}

function DirectoryStructureDiagram() {
  const folders = [
    { name: "your-project/", x: 320, y: 45, w: 160, color: "#8b5cf6", level: 0 },
    { name: ".claude/", x: 120, y: 110, w: 120, color: "#06b6d4", level: 1 },
    { name: "src/", x: 340, y: 110, w: 80, color: "#64748b", level: 1 },
    { name: "package.json", x: 470, y: 110, w: 130, color: "#64748b", level: 1 },
    { name: "worktrees/", x: 60, y: 175, w: 120, color: "#10b981", level: 2 },
    { name: "sessions/", x: 220, y: 175, w: 110, color: "#64748b", level: 2 },
    { name: "feature-auth/", x: 30, y: 245, w: 140, color: "#f59e0b", level: 3 },
    { name: "bugfix-crash/", x: 210, y: 245, w: 140, color: "#f59e0b", level: 3 },
    { name: "refactor-db/", x: 390, y: 245, w: 130, color: "#f59e0b", level: 3 },
    { name: "src/ package.json ...", x: 30, y: 310, w: 170, color: "#94a3b8", level: 4 },
    { name: "src/ ...", x: 210, y: 310, w: 100, color: "#94a3b8", level: 4 },
    { name: "src/ ...", x: 390, y: 310, w: 100, color: "#94a3b8", level: 4 },
  ];

  const connections = [
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
    { from: 1, to: 4 }, { from: 1, to: 5 },
    { from: 4, to: 6 }, { from: 4, to: 7 }, { from: 4, to: 8 },
    { from: 6, to: 9 }, { from: 7, to: 10 }, { from: 8, to: 11 },
  ];

  return (
    <svg viewBox="0 0 650 365" className="w-full my-6" style={{ maxWidth: 650 }}>
      <defs>
        <filter id="dsglow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="650" height="365" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="325" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Directory Structure</text>

      {/* Connection lines */}
      {connections.map((c, i) => {
        const f = folders[c.from];
        const t = folders[c.to];
        const fx = f.x + f.w / 2;
        const fy = f.y + 28;
        const tx = t.x + t.w / 2;
        const ty = t.y;
        return (
          <path
            key={i}
            d={`M${fx},${fy} C${fx},${(fy + ty) / 2} ${tx},${(fy + ty) / 2} ${tx},${ty}`}
            fill="none"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth="1.5"
            strokeDasharray={folders[c.to].level >= 3 ? "4 3" : "none"}
          />
        );
      })}

      {/* Folder nodes */}
      {folders.map((f, i) => (
        <g key={i}>
          <rect
            x={f.x} y={f.y} width={f.w} height={28} rx="6"
            fill={`${f.color}15`}
            stroke={`${f.color}50`}
            strokeWidth="1.5"
            filter={f.level <= 1 ? "url(#dsglow)" : undefined}
          />
          <text x={f.x + 10} y={f.y + 18} fill={f.level <= 2 ? f.color : "rgba(255,255,255,0.5)"} fontSize={f.level >= 3 ? "10" : "11"} fontFamily="monospace" fontWeight={f.level <= 1 ? "600" : "400"}>
            {f.level <= 2 ? "\uD83D\uDCC1 " : ""}{f.name}
          </text>
        </g>
      ))}

      {/* Worktree badges */}
      {[
        { x: 48, y: 335, label: "Worktree 1", color: "#f59e0b" },
        { x: 228, y: 335, label: "Worktree 2", color: "#f59e0b" },
        { x: 408, y: 335, label: "Worktree 3", color: "#f59e0b" },
      ].map((b) => (
        <React.Fragment key={b.label}>
          <rect x={b.x} y={b.y} width={80} height={18} rx="9" fill={`${b.color}20`} stroke={`${b.color}40`} strokeWidth="1" />
          <text x={b.x + 40} y={b.y + 13} textAnchor="middle" fill={b.color} fontSize="9" fontWeight="600">{b.label}</text>
        </React.Fragment>
      ))}
    </svg>
  );
}

function WorkflowDiagram() {
  return (
    <svg viewBox="0 0 800 450" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="wfg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="wfg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="wfg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
        </linearGradient>
        <filter id="wfglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="800" height="450" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="32" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">Workflow Diagram</text>

      {/* Main Repository */}
      <rect x="200" y="50" width="400" height="60" rx="12" fill="url(#wfg1)" opacity="0.2" stroke="rgba(139,92,246,0.5)" strokeWidth="2" filter="url(#wfglow)" />
      <text x="400" y="77" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Main Repository</text>
      <text x="400" y="97" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">(main branch)</text>

      {/* Connecting lines from main to worktrees */}
      {[200, 400, 600].map((x) => (
        <React.Fragment key={x}>
          <line x1="400" y1="110" x2={x} y2="170" stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
          </line>
          <polygon points={`${x - 5},165 ${x + 5},165 ${x},175`} fill="rgba(139,92,246,0.5)" />
        </React.Fragment>
      ))}

      {/* Worktrees */}
      {[
        { x: 100, name: "Worktree A", branch: "(feature-auth)", color: "#06b6d4" },
        { x: 300, name: "Worktree B", branch: "(bugfix-crash)", color: "#10b981" },
        { x: 500, name: "Worktree C", branch: "(refactor-db)", color: "#f59e0b" },
      ].map((wt) => (
        <React.Fragment key={wt.name}>
          <rect x={wt.x} y="180" width="200" height="130" rx="12" fill={`${wt.color}10`} stroke={`${wt.color}40`} strokeWidth="1.5" />
          <text x={wt.x + 100} y="205" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{wt.name}</text>
          <text x={wt.x + 100} y="222" textAnchor="middle" fill={`${wt.color}`} fontSize="11">{wt.branch}</text>
          <line x1={wt.x + 20} y1="232" x2={wt.x + 180} y2="232" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x={wt.x + 100} y="252" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Claude Session</text>
          <text x={wt.x + 100} y="270" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">editing files</text>
          <text x={wt.x + 100} y="286" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">making commits</text>
          {/* Status dot */}
          <circle cx={wt.x + 180} cy={195} r="5" fill={wt.color} opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </React.Fragment>
      ))}

      {/* Connecting lines from worktrees to PRs */}
      {[200, 400, 600].map((x) => (
        <React.Fragment key={`pr-${x}`}>
          <line x1={x} y1="310" x2={x} y2="360" stroke="rgba(249,115,22,0.3)" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
          </line>
          <polygon points={`${x - 5},358 ${x + 5},358 ${x},368`} fill="rgba(249,115,22,0.5)" />
        </React.Fragment>
      ))}

      {/* PRs */}
      {[
        { x: 120, label: "PR #101" },
        { x: 320, label: "PR #102" },
        { x: 520, label: "PR #103" },
      ].map((pr) => (
        <React.Fragment key={pr.label}>
          <rect x={pr.x} y="375" width="160" height="45" rx="10" fill="url(#wfg3)" opacity="0.15" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" />
          <text x={pr.x + 80} y="403" textAnchor="middle" fill="rgba(249,115,22,0.95)" fontSize="14" fontWeight="700">{pr.label}</text>
        </React.Fragment>
      ))}
    </svg>
  );
}

function SequentialVsParallelDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="svp1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="svp2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="800" height="320" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Sequential vs Parallel Time</text>

      {/* Sequential */}
      <text x="60" y="70" fill="rgba(239,68,68,0.9)" fontSize="13" fontWeight="600">Sequential (without worktrees)</text>
      {/* Task bars */}
      <rect x="60" y="85" width="260" height="36" rx="6" fill="url(#svp1)" opacity="0.25" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="190" y="108" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task A (2 hours)</text>

      <rect x="320" y="85" width="130" height="36" rx="6" fill="url(#svp1)" opacity="0.25" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="385" y="108" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task B (1h)</text>

      <rect x="450" y="85" width="195" height="36" rx="6" fill="url(#svp1)" opacity="0.25" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="548" y="108" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task C (1.5h)</text>

      {/* Arrow markers */}
      <line x1="60" y1="130" x2="645" y2="130" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="660" y="134" fill="rgba(239,68,68,0.8)" fontSize="12" fontWeight="700">4.5h</text>

      {/* Parallel */}
      <text x="60" y="175" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="600">Parallel (with worktrees)</text>

      <rect x="60" y="190" width="260" height="30" rx="6" fill="url(#svp2)" opacity="0.25" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="190" y="210" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task A (2 hours)</text>

      <rect x="60" y="225" width="130" height="30" rx="6" fill="url(#svp2)" opacity="0.25" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="125" y="245" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task B (1h)</text>

      <rect x="60" y="260" width="195" height="30" rx="6" fill="url(#svp2)" opacity="0.25" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="158" y="280" textAnchor="middle" fill="white" fontSize="11" fontWeight="500">Task C (1.5h)</text>

      {/* Parallel time marker */}
      <line x1="320" y1="188" x2="320" y2="295" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="335" y="250" fill="rgba(16,185,129,0.8)" fontSize="12" fontWeight="700">2h total</text>

      {/* Savings badge */}
      <rect x="550" y="220" width="190" height="55" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <text x="645" y="244" textAnchor="middle" fill="rgba(16,185,129,0.95)" fontSize="16" fontWeight="700">56% faster</text>
      <text x="645" y="264" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Longest task determines total time</text>
    </svg>
  );
}

function SubagentIsolationDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="sag1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
        </linearGradient>
        <filter id="saglow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="800" height="320" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Subagent Isolation: Batch Processing</text>

      {/* Main Session */}
      <rect x="290" y="50" width="220" height="50" rx="10" fill="url(#sag1)" opacity="0.2" stroke="rgba(139,92,246,0.5)" strokeWidth="2" filter="url(#saglow)" />
      <text x="400" y="72" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Main Session</text>
      <text x="400" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Orchestrator</text>

      {/* Connecting lines */}
      {[100, 300, 500, 700].map((x, i) => (
        <React.Fragment key={x}>
          <path d={`M400,100 C400,130 ${x},130 ${x},155`} fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" strokeDasharray="5 3">
            <animate attributeName="strokeDashoffset" from="8" to="0" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </path>
          <polygon points={`${x - 4},152 ${x + 4},152 ${x},160`} fill="rgba(139,92,246,0.5)" />
        </React.Fragment>
      ))}

      {/* Agent worktrees */}
      {[
        { x: 20, name: "Agent 1", path: "worktree-batch-1", files: "Files 1-10", color: "#06b6d4" },
        { x: 220, name: "Agent 2", path: "worktree-batch-2", files: "Files 11-20", color: "#10b981" },
        { x: 420, name: "Agent 3", path: "worktree-batch-3", files: "Files 21-30", color: "#f59e0b" },
        { x: 620, name: "Agent 4", path: "worktree-batch-4", files: "Files 31-40", color: "#ec4899" },
      ].map((agent) => (
        <React.Fragment key={agent.name}>
          <rect x={agent.x} y="165" width="160" height="100" rx="10" fill={`${agent.color}08`} stroke={`${agent.color}30`} strokeWidth="1.5" />
          {/* Agent header */}
          <rect x={agent.x} y="165" width="160" height="28" rx="10" fill={`${agent.color}15`} />
          <rect x={agent.x} y="183" width="160" height="10" fill={`${agent.color}15`} />
          <text x={agent.x + 80} y="184" textAnchor="middle" fill={agent.color} fontSize="12" fontWeight="700">{agent.name}</text>
          <text x={agent.x + 80} y="215" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">{agent.path}</text>
          {/* File range */}
          <rect x={agent.x + 25} y="230" width="110" height="22" rx="11" fill={`${agent.color}12`} stroke={`${agent.color}25`} strokeWidth="1" />
          <text x={agent.x + 80} y="245" textAnchor="middle" fill={agent.color} fontSize="10" fontWeight="600">{agent.files}</text>
          {/* Activity indicator */}
          <circle cx={agent.x + 145} cy={177} r="4" fill={agent.color} opacity="0.6">
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </React.Fragment>
      ))}

      {/* Bottom label */}
      <rect x="200" y="280" width="400" height="28" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x="400" y="299" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Each agent works in its own isolated worktree — no conflicts</text>
    </svg>
  );
}

function LifecycleDiagram() {
  const stages = [
    { x: 40, label: "Create", sub: "git worktree add", color: "#10b981", icon: "+" },
    { x: 200, label: "Branch", sub: "worktree-<name>", color: "#06b6d4", icon: "\u2387" },
    { x: 360, label: "Work", sub: "Claude session", color: "#8b5cf6", icon: "\u270E" },
    { x: 520, label: "Commit", sub: "git push + PR", color: "#f59e0b", icon: "\u2713" },
    { x: 680, label: "Cleanup", sub: "remove or keep", color: "#ef4444", icon: "\u2715" },
  ];

  return (
    <svg viewBox="0 0 800 180" className="w-full my-6" style={{ maxWidth: 800 }}>
      <rect width="800" height="180" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Worktree Lifecycle</text>

      {/* Connection arrows */}
      {stages.slice(0, -1).map((s, i) => {
        const next = stages[i + 1];
        return (
          <React.Fragment key={`arrow-${i}`}>
            <line x1={s.x + 90} y1={85} x2={next.x + 10} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth="2">
              <animate attributeName="strokeDashoffset" from="6" to="0" dur="1.5s" repeatCount="indefinite" />
            </line>
            <polygon points={`${next.x + 6},80 ${next.x + 14},85 ${next.x + 6},90`} fill="rgba(255,255,255,0.2)" />
          </React.Fragment>
        );
      })}

      {/* Stage nodes */}
      {stages.map((s) => (
        <React.Fragment key={s.label}>
          {/* Circle */}
          <circle cx={s.x + 50} cy={85} r="28" fill={`${s.color}15`} stroke={`${s.color}50`} strokeWidth="2" />
          <text x={s.x + 50} y={90} textAnchor="middle" fill={s.color} fontSize="18" fontWeight="700">{s.icon}</text>
          {/* Label */}
          <text x={s.x + 50} y={132} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">{s.label}</text>
          <text x={s.x + 50} y={148} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">{s.sub}</text>
        </React.Fragment>
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
  return (
    <svg viewBox="0 0 800 280" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="ctg1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="ctg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ctg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="ct-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="ct-sparkle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="280" rx="20" fill="url(#ctg-bg)" />

      {/* Radial glow behind trophy */}
      <circle cx="400" cy="140" r="100" fill="url(#ctg2)" />

      {/* Trophy cup body */}
      <g filter="url(#ct-glow)">
        <path d="M360,90 L360,160 C360,185 380,200 400,200 C420,200 440,185 440,160 L440,90 Z" fill="url(#ctg1)" opacity="0.9">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Cup rim */}
      <ellipse cx="400" cy="90" rx="42" ry="8" fill="#fcd34d" opacity="0.8" />
      {/* Cup handles */}
      <path d="M360,105 C340,105 325,120 325,140 C325,155 340,165 355,160" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <path d="M440,105 C460,105 475,120 475,140 C475,155 460,165 445,160" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      {/* Cup base */}
      <rect x="385" y="200" width="30" height="20" rx="3" fill="#d97706" />
      <ellipse cx="400" cy="225" rx="35" ry="7" fill="#b45309" />
      {/* Star on cup */}
      <polygon points="400,115 406,130 422,132 410,143 413,158 400,150 387,158 390,143 378,132 394,130" fill="#fef3c7" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </polygon>

      {/* Sparkle particles around trophy */}
      {[
        { x: 300, y: 80, d: "5s", del: "0s" },
        { x: 500, y: 90, d: "6s", del: "1s" },
        { x: 280, y: 150, d: "4s", del: "0.5s" },
        { x: 520, y: 160, d: "5.5s", del: "1.5s" },
        { x: 340, y: 60, d: "7s", del: "2s" },
        { x: 460, y: 70, d: "6s", del: "2.5s" },
        { x: 310, y: 200, d: "5s", del: "3s" },
        { x: 490, y: 210, d: "6s", del: "0.8s" },
      ].map((s, i) => (
        <g key={`sp${i}`}>
          {/* 4-point star sparkle */}
          <path d={`M${s.x},${s.y - 6} L${s.x + 2},${s.y - 2} L${s.x + 6},${s.y} L${s.x + 2},${s.y + 2} L${s.x},${s.y + 6} L${s.x - 2},${s.y + 2} L${s.x - 6},${s.y} L${s.x - 2},${s.y - 2} Z`}
            fill="#fbbf24" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur={s.d} begin={s.del} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="scale" values="0.5;1.2;0.5" dur={s.d} begin={s.del} repeatCount="indefinite" additive="sum" />
          </path>
        </g>
      ))}

      {/* Text */}
      <text x="400" y="258" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" letterSpacing="2" opacity="0">
        CHALLENGE TIME
        <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.5s" fill="freeze" />
      </text>
      <text x="400" y="275" textAnchor="middle" fill="rgba(251,191,36,0.7)" fontSize="10" letterSpacing="4" opacity="0">
        TEST YOUR WORKTREE KNOWLEDGE
        <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze" />
      </text>

      {/* Difficulty badges */}
      {[
        { x: 160, label: "BEGINNER", color: "#10b981", num: "1" },
        { x: 400, label: "INTERMEDIATE", color: "#3b82f6", num: "2" },
        { x: 640, label: "ADVANCED", color: "#ef4444", num: "3" },
      ].map((badge) => (
        <g key={badge.label}>
          <rect x={badge.x - 55} y="40" width="110" height="30" rx="15" fill={`${badge.color}15`} stroke={`${badge.color}40`} strokeWidth="1.5">
            <animate attributeName="strokeOpacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          </rect>
          <circle cx={badge.x - 35} cy="55" r="9" fill={`${badge.color}30`} stroke={badge.color} strokeWidth="1.5" />
          <text x={badge.x - 35} y="59" textAnchor="middle" fill={badge.color} fontSize="10" fontWeight="700">{badge.num}</text>
          <text x={badge.x + 5} y="59" textAnchor="middle" fill={badge.color} fontSize="9" fontWeight="600" letterSpacing="1">{badge.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ChallengeProgressSVG({ completed }: { completed: number }) {
  const total = 3;
  const challenges = [
    { label: "Basic Ops", color: "#10b981", icon: "1" },
    { label: "Parallel Dev", color: "#3b82f6", icon: "2" },
    { label: "Batch Agent", color: "#ef4444", icon: "3" },
  ];

  return (
    <svg viewBox="0 0 700 70" className="w-full my-4" style={{ maxWidth: 700 }}>
      <defs>
        <linearGradient id="cpg-track" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cpg-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Track */}
      <rect x="80" y="30" width="540" height="8" rx="4" fill="rgba(255,255,255,0.06)" />
      {/* Fill */}
      <rect x="80" y="30" width={540 * (completed / total)} height="8" rx="4" fill="url(#cpg-fill)" opacity="0.8">
        <animate attributeName="width" from="0" to={540 * (completed / total)} dur="0.6s" fill="freeze" />
      </rect>

      {/* Nodes */}
      {challenges.map((ch, i) => {
        const x = 80 + i * 270;
        const done = i < completed;
        return (
          <g key={ch.label}>
            <circle cx={x} cy="34" r="18" fill={done ? `${ch.color}30` : "rgba(255,255,255,0.04)"} stroke={done ? ch.color : "rgba(255,255,255,0.15)"} strokeWidth={done ? "2.5" : "1.5"}>
              {done && <animate attributeName="r" values="18;20;18" dur="2s" repeatCount="indefinite" />}
            </circle>
            {done ? (
              <text x={x} y="39" textAnchor="middle" fill={ch.color} fontSize="14" fontWeight="700">&#10003;</text>
            ) : (
              <text x={x} y="38" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600">{ch.icon}</text>
            )}
            <text x={x} y="64" textAnchor="middle" fill={done ? ch.color : "rgba(255,255,255,0.35)"} fontSize="9" fontWeight="500">{ch.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ChallengeLevelBadge({ level, difficulty, color }: { level: number; difficulty: string; color: string }) {
  return (
    <svg viewBox="0 0 220 50" className="inline-block" style={{ width: 220, height: 50, verticalAlign: "middle" }}>
      <defs>
        <linearGradient id={`clb-${level}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
        <filter id={`clb-glow-${level}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="216" height="46" rx="23" fill={`url(#clb-${level})`} stroke={`${color}60`} strokeWidth="1.5">
        <animate attributeName="strokeOpacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Orbiting dot */}
      <circle r="3" fill={color} opacity="0.6" filter={`url(#clb-glow-${level})`}>
        <animateMotion dur={`${4 + level}s`} repeatCount="indefinite" path="M110,25 m-90,0 a90,20 0 1,0 180,0 a90,20 0 1,0 -180,0" />
      </circle>
      {/* Shield icon */}
      <g transform="translate(20,10)">
        <path d={`M15,0 L25,5 L25,18 C25,25 15,30 15,30 C15,30 5,25 5,18 L5,5 Z`} fill={`${color}30`} stroke={color} strokeWidth="1.5" />
        <text x="15" y="20" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">{level}</text>
      </g>
      {/* Text */}
      <text x="55" y="22" fill="white" fontSize="13" fontWeight="700">Challenge {level}</text>
      <text x="55" y="38" fill={color} fontSize="9" fontWeight="600" letterSpacing="1.5">{difficulty}</text>
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
              <ChallengeLevelBadge level={1} difficulty="BEGINNER" color="#10b981" />
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
              <ChallengeLevelBadge level={2} difficulty="INTERMEDIATE" color="#3b82f6" />
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
              <ChallengeLevelBadge level={3} difficulty="ADVANCED" color="#ef4444" />
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
