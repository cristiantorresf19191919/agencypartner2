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
   HERO SVG — Animated Cloud / Lightning Serverless
   ═══════════════════════════════════════════════════════ */

function HeroServerlessSVG() {
  return (
    <svg viewBox="0 0 800 480" className="w-full my-8" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="sl-sky" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="sl-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="sl-bolt" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="sl-func" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="sl-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="sl-bloom">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sl-soft">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="sl-particle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="480" rx="20" fill="url(#sl-sky)" />
      <ellipse cx="400" cy="200" rx="280" ry="180" fill="url(#sl-glow)" />

      {/* Floating particles */}
      {[
        { cx: 120, cy: 100, r: 1.5, dur: "7s", del: "0s" },
        { cx: 680, cy: 80, r: 2, dur: "6s", del: "1s" },
        { cx: 250, cy: 350, r: 1, dur: "8s", del: "2s" },
        { cx: 550, cy: 380, r: 1.5, dur: "9s", del: "0.5s" },
        { cx: 350, cy: 50, r: 2, dur: "7s", del: "3s" },
        { cx: 700, cy: 300, r: 1, dur: "6s", del: "1.5s" },
      ].map((p, i) => (
        <circle key={`sp${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="url(#sl-particle)">
          <animate attributeName="cy" values={`${p.cy};${p.cy - 25};${p.cy}`} dur={p.dur} begin={p.del} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur={p.dur} begin={p.del} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Cloud shape */}
      <g filter="url(#sl-bloom)">
        <ellipse cx="400" cy="150" rx="160" ry="70" fill="url(#sl-cloud)" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5">
          <animate attributeName="ry" values="70;74;70" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="310" cy="155" rx="80" ry="55" fill="url(#sl-cloud)" />
        <ellipse cx="490" cy="155" rx="80" ry="55" fill="url(#sl-cloud)" />
        <ellipse cx="350" cy="130" rx="60" ry="50" fill="url(#sl-cloud)" />
        <ellipse cx="450" cy="130" rx="60" ry="50" fill="url(#sl-cloud)" />
      </g>

      {/* Cloud label */}
      <text x="400" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" opacity="0.9">CLOUD PROVIDER</text>
      <text x="400" y="165" textAnchor="middle" fill="rgba(196,181,253,0.7)" fontSize="10">manages servers for you</text>

      {/* Lightning bolts — event triggers */}
      {[
        { x: 300, delay: "0s" },
        { x: 400, delay: "0.3s" },
        { x: 500, delay: "0.6s" },
      ].map((bolt) => (
        <g key={`bolt-${bolt.x}`}>
          <path d={`M${bolt.x},195 L${bolt.x - 8},225 L${bolt.x + 3},225 L${bolt.x - 5},255`}
            fill="none" stroke="url(#sl-bolt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            opacity="0" filter="url(#sl-soft)">
            <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin={bolt.delay} repeatCount="indefinite" keyTimes="0;0.1;0.7;1" />
          </path>
          {/* Spark */}
          <circle cx={bolt.x - 3} cy={258} r="0" fill="#fbbf24">
            <animate attributeName="r" values="0;6;0" dur="3s" begin={bolt.delay} repeatCount="indefinite" keyTimes="0;0.15;1" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin={bolt.delay} repeatCount="indefinite" keyTimes="0;0.15;1" />
          </circle>
        </g>
      ))}

      {/* Function boxes — compute layer */}
      {[
        { x: 200, label: "fn()", sub: "API Handler", color: "#06b6d4", delay: "1s" },
        { x: 350, label: "fn()", sub: "Event Proc", color: "#8b5cf6", delay: "1.3s" },
        { x: 500, label: "fn()", sub: "Queue Worker", color: "#10b981", delay: "1.6s" },
      ].map((fn) => (
        <g key={fn.label + fn.sub}>
          <rect x={fn.x} y="275" width="110" height="60" rx="12" fill={`${fn.color}12`} stroke={`${fn.color}40`} strokeWidth="1.5" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin={fn.delay} fill="freeze" />
          </rect>
          <text x={fn.x + 55} y="300" textAnchor="middle" fill={fn.color} fontSize="16" fontWeight="700" fontFamily="monospace" opacity="0">
            {fn.label}
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin={fn.delay} fill="freeze" />
          </text>
          <text x={fn.x + 55} y="320" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" opacity="0">
            {fn.sub}
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin={fn.delay} fill="freeze" />
          </text>
          {/* Pulsing activity ring */}
          <rect x={fn.x - 3} y="272" width="116" height="66" rx="14" fill="none" stroke={fn.color} strokeWidth="1" opacity="0">
            <animate attributeName="opacity" values="0;0.4;0" dur="3s" begin={`${parseFloat(fn.delay) + 1}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}

      {/* Arrows from functions to managed services */}
      {[250, 400, 550].map((x, i) => (
        <g key={`svc-line-${x}`}>
          <line x1={x + 5} y1="335" x2={x + 5} y2="375" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 3">
            <animate attributeName="strokeDashoffset" from="7" to="0" dur="2s" repeatCount="indefinite" />
          </line>
          <polygon points={`${x},373 ${x + 10},373 ${x + 5},380`} fill="rgba(255,255,255,0.15)" />
        </g>
      ))}

      {/* Managed services row */}
      {[
        { x: 120, label: "DB", icon: "\uD83D\uDDC4", color: "#f59e0b" },
        { x: 250, label: "Storage", icon: "\uD83D\uDCC1", color: "#3b82f6" },
        { x: 380, label: "Queue", icon: "\uD83D\uDCE8", color: "#ec4899" },
        { x: 510, label: "Auth", icon: "\uD83D\uDD12", color: "#10b981" },
        { x: 640, label: "Logs", icon: "\uD83D\uDCCA", color: "#8b5cf6" },
      ].map((svc) => (
        <g key={svc.label}>
          <rect x={svc.x} y="390" width="80" height="44" rx="10" fill={`${svc.color}10`} stroke={`${svc.color}30`} strokeWidth="1.5">
            <animate attributeName="strokeOpacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
          </rect>
          <text x={svc.x + 40} y="412" textAnchor="middle" fill={svc.color} fontSize="11" fontWeight="600">{svc.icon} {svc.label}</text>
          <text x={svc.x + 40} y="428" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">managed</text>
        </g>
      ))}

      {/* Flow label */}
      <text x="400" y="460" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" letterSpacing="3">EVENTS &#8594; COMPUTE &#8594; MANAGED SERVICES</text>

      {/* Title badge */}
      <rect x="280" y="60" width="240" height="36" rx="18" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
      <text x="400" y="83" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" letterSpacing="2">SERVERLESS</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PATTERN DIAGRAMS
   ═══════════════════════════════════════════════════════ */

function BuildingBlocksDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="bb-trig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="bb-comp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="bb-svc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
        </linearGradient>
        <filter id="bb-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="800" height="320" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Three Building Blocks</text>

      {/* Column 1: Triggers */}
      <rect x="30" y="50" width="230" height="250" rx="14" fill="rgba(245,158,11,0.04)" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
      <text x="145" y="75" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="700">1) Triggers (Events)</text>
      {["HTTP Request", "Cron / Schedule", "File Upload", "Queue Message", "DB Change Stream"].map((t, i) => (
        <g key={t}>
          <rect x={50} y={90 + i * 38} width={190} height={30} rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" strokeWidth="1">
            <animate attributeName="strokeOpacity" values="0.15;0.4;0.15" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </rect>
          <text x={145} y={110 + i * 38} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11">{t}</text>
        </g>
      ))}

      {/* Arrow 1 */}
      <line x1="265" y1="175" x2="285" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <polygon points="283,170 293,175 283,180" fill="rgba(255,255,255,0.25)" />

      {/* Column 2: Compute */}
      <rect x="290" y="50" width="220" height="250" rx="14" fill="rgba(139,92,246,0.04)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
      <text x="400" y="75" textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="700">2) Compute</text>
      <rect x="310" y="95" width="180" height="70" rx="12" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" filter="url(#bb-glow)" />
      <text x="400" y="122" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Functions (FaaS)</text>
      <text x="400" y="140" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">short-lived event handlers</text>

      <rect x="310" y="180" width="180" height="70" rx="12" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" filter="url(#bb-glow)" />
      <text x="400" y="207" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Containers</text>
      <text x="400" y="225" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">managed scaling, no servers</text>

      {/* Arrow 2 */}
      <line x1="515" y1="175" x2="535" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <polygon points="533,170 543,175 533,180" fill="rgba(255,255,255,0.25)" />

      {/* Column 3: Managed Services */}
      <rect x="540" y="50" width="240" height="250" rx="14" fill="rgba(6,182,212,0.04)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
      <text x="660" y="75" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="700">3) Managed Services</text>
      {["Databases (SQL/NoSQL)", "Object Storage", "Queues / Event Buses", "Auth / Identity", "Secrets / Config", "Observability"].map((s, i) => (
        <g key={s}>
          <rect x={560} y={88 + i * 34} width={200} height={26} rx="7" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.18)" strokeWidth="1">
            <animate attributeName="strokeOpacity" values="0.12;0.35;0.12" dur={`${3.5 + i * 0.4}s`} repeatCount="indefinite" />
          </rect>
          <text x={660} y={106 + i * 34} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">{s}</text>
        </g>
      ))}
    </svg>
  );
}

function PatternsDiagram() {
  const patterns = [
    { label: "Pattern A", sub: "Request/Response API", trigger: "HTTP", compute: "fn()", service: "DB + Auth", color: "#06b6d4" },
    { label: "Pattern B", sub: "Event-Driven Pipeline", trigger: "File Upload", compute: "fn()", service: "Storage + DB", color: "#8b5cf6" },
    { label: "Pattern C", sub: "Async Queue Worker", trigger: "Queue Msg", compute: "Worker fn()", service: "Queue + DLQ", color: "#f59e0b" },
    { label: "Pattern D", sub: "Scheduled Task", trigger: "Cron", compute: "fn()", service: "DB / Storage", color: "#10b981" },
  ];

  return (
    <svg viewBox="0 0 800 320" className="w-full my-6" style={{ maxWidth: 800 }}>
      <rect width="800" height="320" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Serverless Patterns</text>

      {patterns.map((p, i) => {
        const y = 50 + i * 68;
        return (
          <g key={p.label}>
            {/* Label */}
            <rect x="20" y={y} width="130" height="52" rx="10" fill={`${p.color}12`} stroke={`${p.color}35`} strokeWidth="1.5">
              <animate attributeName="strokeOpacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
            </rect>
            <text x="85" y={y + 22} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="700">{p.label}</text>
            <text x="85" y={y + 38} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">{p.sub}</text>

            {/* Arrow */}
            <line x1="155" y1={y + 26} x2="180" y2={y + 26} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <polygon points={`178,${y + 22} 186,${y + 26} 178,${y + 30}`} fill="rgba(255,255,255,0.2)" />

            {/* Trigger */}
            <rect x="190" y={y + 6} width="110" height="40" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
            <text x="245" y={y + 31} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">{p.trigger}</text>

            {/* Arrow */}
            <line x1="305" y1={y + 26} x2="340" y2={y + 26} stroke={`${p.color}30`} strokeWidth="1.5" strokeDasharray="4 3">
              <animate attributeName="strokeDashoffset" from="7" to="0" dur="1.5s" repeatCount="indefinite" />
            </line>
            <polygon points={`338,${y + 22} 346,${y + 26} 338,${y + 30}`} fill={`${p.color}40`} />

            {/* Compute */}
            <rect x="350" y={y + 4} width="130" height="44" rx="10" fill={`${p.color}10`} stroke={`${p.color}30`} strokeWidth="1.5" />
            <text x="415" y={y + 24} textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="monospace">{p.compute}</text>
            <text x="415" y={y + 40} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">compute</text>

            {/* Arrow */}
            <line x1="485" y1={y + 26} x2="520" y2={y + 26} stroke={`${p.color}30`} strokeWidth="1.5" strokeDasharray="4 3">
              <animate attributeName="strokeDashoffset" from="7" to="0" dur="1.5s" repeatCount="indefinite" />
            </line>
            <polygon points={`518,${y + 22} 526,${y + 26} 518,${y + 30}`} fill={`${p.color}40`} />

            {/* Service */}
            <rect x="530" y={y + 6} width="245" height="40" rx="8" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.18)" strokeWidth="1" />
            <text x="652" y={y + 31} textAnchor="middle" fill="rgba(6,182,212,0.9)" fontSize="10" fontWeight="600">{p.service}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ColdStartDiagram() {
  return (
    <svg viewBox="0 0 800 200" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="cs-warm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cs-cold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="800" height="200" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      <text x="400" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Cold Start vs Warm Invocation</text>

      {/* Cold start timeline */}
      <text x="50" y="65" fill="rgba(239,68,68,0.9)" fontSize="12" fontWeight="600">Cold Start</text>
      <rect x="150" y="52" width="120" height="26" rx="6" fill="url(#cs-cold)" opacity="0.2" stroke="rgba(239,68,68,0.3)" strokeWidth="1">
        <animate attributeName="width" from="0" to="120" dur="1s" fill="freeze" />
      </rect>
      <text x="210" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Init runtime</text>
      <rect x="275" y="52" width="80" height="26" rx="6" fill="url(#cs-cold)" opacity="0.15" stroke="rgba(239,68,68,0.2)" strokeWidth="1">
        <animate attributeName="width" from="0" to="80" dur="0.7s" begin="0.5s" fill="freeze" />
      </rect>
      <text x="315" y="70" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Load code</text>
      <rect x="360" y="52" width="200" height="26" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1">
        <animate attributeName="width" from="0" to="200" dur="0.8s" begin="0.8s" fill="freeze" />
      </rect>
      <text x="460" y="70" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9">Execute handler</text>
      <text x="580" y="70" fill="rgba(239,68,68,0.7)" fontSize="11" fontWeight="600">~500-3000ms</text>

      {/* Warm timeline */}
      <text x="50" y="125" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="600">Warm</text>
      <rect x="150" y="112" width="200" height="26" rx="6" fill="url(#cs-warm)" opacity="0.2" stroke="rgba(16,185,129,0.3)" strokeWidth="1">
        <animate attributeName="width" from="0" to="200" dur="0.6s" begin="1.2s" fill="freeze" />
      </rect>
      <text x="250" y="130" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9">Execute handler (reused runtime)</text>
      <text x="370" y="130" fill="rgba(16,185,129,0.8)" fontSize="11" fontWeight="600">~5-50ms</text>

      {/* Speed comparison */}
      <rect x="580" y="100" width="190" height="50" rx="12" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      <text x="675" y="122" textAnchor="middle" fill="rgba(16,185,129,0.95)" fontSize="14" fontWeight="700">10-100x faster</text>
      <text x="675" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">when runtime is warm</text>

      {/* Bottom note */}
      <text x="400" y="180" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">Cold starts depend on runtime, memory config, package size, and VPC setup</text>
    </svg>
  );
}

function ServerlessChecklistSVG() {
  const checks = [
    { q: "No provisioning/patching servers?", c: "#10b981" },
    { q: "Code runs on-demand from events?", c: "#06b6d4" },
    { q: "Platform auto-scales for me?", c: "#8b5cf6" },
    { q: "Paying based on usage, not idle?", c: "#f59e0b" },
  ];
  return (
    <svg viewBox="0 0 600 200" className="w-full my-6" style={{ maxWidth: 600 }}>
      <rect width="600" height="200" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      <text x="300" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Is it Serverless? Quick Check</text>
      {checks.map((ch, i) => (
        <g key={ch.q}>
          <rect x="30" y={45 + i * 37} width="540" height="30" rx="8" fill={`${ch.c}06`} stroke={`${ch.c}20`} strokeWidth="1" />
          <circle cx="55" cy={60 + i * 37} r="10" fill={`${ch.c}20`} stroke={ch.c} strokeWidth="1.5">
            <animate attributeName="r" values="10;11;10" dur="3s" repeatCount="indefinite" />
          </circle>
          <text x="55" y={64 + i * 37} textAnchor="middle" fill={ch.c} fontSize="12" fontWeight="700">&#10003;</text>
          <text x="80" y={64 + i * 37} fill="rgba(255,255,255,0.8)" fontSize="11">{ch.q}</text>
        </g>
      ))}
      <text x="300" y="190" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="10" fontWeight="600">If most answers are &quot;yes&quot; &#8594; it&apos;s serverless</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CHALLENGE ANIMATED SVGs
   ═══════════════════════════════════════════════════════ */

function ChallengeRocketSVG() {
  return (
    <svg viewBox="0 0 800 280" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="cr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="cr-rocket" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="cr-flame" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
        <filter id="cr-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="800" height="280" rx="20" fill="url(#cr-bg)" />

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={`star${i}`} cx={30 + (i * 127) % 740} cy={20 + (i * 53) % 240} r={0.5 + (i % 3) * 0.5} fill="white" opacity={0.2 + (i % 4) * 0.15}>
          <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.1};${0.5 + (i % 3) * 0.15};${0.1 + (i % 3) * 0.1}`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Rocket body */}
      <g transform="translate(360,50)" filter="url(#cr-glow)">
        {/* Nose cone */}
        <path d="M40,0 C40,0 25,25 20,50 L60,50 C55,25 40,0 40,0 Z" fill="url(#cr-rocket)" />
        {/* Body */}
        <rect x="20" y="50" width="40" height="80" rx="4" fill="url(#cr-rocket)" opacity="0.9" />
        {/* Window */}
        <circle cx="40" cy="75" r="10" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="2" />
        <circle cx="40" cy="75" r="5" fill="rgba(196,181,253,0.3)" />
        {/* Fins */}
        <path d="M20,110 L5,140 L20,130 Z" fill="#4f46e5" />
        <path d="M60,110 L75,140 L60,130 Z" fill="#4f46e5" />
        {/* Flame */}
        <ellipse cx="40" cy="145" rx="12" ry="25" fill="url(#cr-flame)" opacity="0.9">
          <animate attributeName="ry" values="20;30;20" dur="0.3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="10;14;10" dur="0.4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="40" cy="145" rx="6" ry="15" fill="#fbbf24" opacity="0.8">
          <animate attributeName="ry" values="12;18;12" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Exhaust particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`ex${i}`} cx={400} cy={210} r={2 + i} fill={i % 2 === 0 ? "#f59e0b" : "#ef4444"} opacity="0">
          <animate attributeName="cy" values="210;270" dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${397 + i * 2};${390 + i * 5}`} dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Text */}
      <text x="400" y="258" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" letterSpacing="2" opacity="0">
        LAUNCH CHALLENGES
        <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.5s" fill="freeze" />
      </text>
      <text x="400" y="275" textAnchor="middle" fill="rgba(167,139,250,0.7)" fontSize="10" letterSpacing="4" opacity="0">
        TEST YOUR SERVERLESS KNOWLEDGE
        <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1s" fill="freeze" />
      </text>

      {/* Difficulty pills */}
      {[
        { x: 120, label: "BEGINNER", color: "#10b981", num: "1" },
        { x: 400, label: "INTERMEDIATE", color: "#3b82f6", num: "2" },
        { x: 680, label: "ADVANCED", color: "#ef4444", num: "3" },
      ].map((b) => (
        <g key={b.label}>
          <rect x={b.x - 55} y="8" width="110" height="28" rx="14" fill={`${b.color}12`} stroke={`${b.color}35`} strokeWidth="1.5">
            <animate attributeName="strokeOpacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
          </rect>
          <circle cx={b.x - 35} cy="22" r="8" fill={`${b.color}25`} stroke={b.color} strokeWidth="1.5" />
          <text x={b.x - 35} y="26" textAnchor="middle" fill={b.color} fontSize="9" fontWeight="700">{b.num}</text>
          <text x={b.x + 5} y="26" textAnchor="middle" fill={b.color} fontSize="8" fontWeight="600" letterSpacing="1">{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

function SLProgressSVG({ completed }: { completed: number }) {
  const items = [
    { label: "Basics", color: "#10b981" },
    { label: "Patterns", color: "#3b82f6" },
    { label: "Design", color: "#ef4444" },
  ];
  return (
    <svg viewBox="0 0 700 70" className="w-full my-4" style={{ maxWidth: 700 }}>
      <defs>
        <linearGradient id="slp-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="80" y="30" width="540" height="8" rx="4" fill="rgba(255,255,255,0.06)" />
      <rect x="80" y="30" width={540 * (completed / 3)} height="8" rx="4" fill="url(#slp-fill)" opacity="0.8">
        <animate attributeName="width" from="0" to={540 * (completed / 3)} dur="0.6s" fill="freeze" />
      </rect>
      {items.map((ch, i) => {
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
              <text x={x} y="38" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600">{i + 1}</text>
            )}
            <text x={x} y="64" textAnchor="middle" fill={done ? ch.color : "rgba(255,255,255,0.35)"} fontSize="9" fontWeight="500">{ch.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SLBadge({ level, difficulty, color }: { level: number; difficulty: string; color: string }) {
  return (
    <svg viewBox="0 0 220 50" className="inline-block" style={{ width: 220, height: 50, verticalAlign: "middle" }}>
      <defs>
        <linearGradient id={`slb-${level}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
        <filter id={`slb-g-${level}`}><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="2" y="2" width="216" height="46" rx="23" fill={`url(#slb-${level})`} stroke={`${color}60`} strokeWidth="1.5">
        <animate attributeName="strokeOpacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle r="3" fill={color} opacity="0.6" filter={`url(#slb-g-${level})`}>
        <animateMotion dur={`${4 + level}s`} repeatCount="indefinite" path="M110,25 m-90,0 a90,20 0 1,0 180,0 a90,20 0 1,0 -180,0" />
      </circle>
      <g transform="translate(20,10)">
        <path d="M15,0 L25,5 L25,18 C25,25 15,30 15,30 C15,30 5,25 5,18 L5,5 Z" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
        <text x="15" y="20" textAnchor="middle" fill={color} fontSize="12" fontWeight="800">{level}</text>
      </g>
      <text x="55" y="22" fill="white" fontSize="13" fontWeight="700">Challenge {level}</text>
      <text x="55" y="38" fill={color} fontSize="9" fontWeight="600" letterSpacing="1.5">{difficulty}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CODE EXAMPLES
   ═══════════════════════════════════════════════════════ */

const serverlessDefinitionCode = `# A workload is "serverless" when it has these traits:

# 1. No server management by you
#    No VM/OS provisioning, patching, cluster capacity planning,
#    or always-on instances to maintain.

# 2. On-demand execution
#    Code runs when triggered by an event:
#    HTTP request, file upload, queue message, scheduled job, etc.

# 3. Automatic scaling
#    The platform scales concurrency/instances automatically
#    based on load (often including scale-to-zero).

# 4. Usage-based pricing
#    You pay for actual execution/requests
#    rather than idle capacity.

# Important: "Serverless" is an architecture style,
# not a single service.`;

const patternACode = `# Pattern A: Request/Response API
# ─────────────────────────────────
# Trigger:  HTTP request (GET /users, POST /orders)
# Compute:  Function/container handles request
# Services: Database + Auth + Caching (optional)

# Example: REST API handler (pseudo-code)
async function handleRequest(event) {
  const userId = event.pathParameters.id;

  // Auth check (managed auth service)
  const user = await authService.verify(event.headers.token);

  // Business logic
  const data = await database.query(
    'SELECT * FROM orders WHERE user_id = ?', [userId]
  );

  // Return response
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}

# Use when:
# - Building REST/GraphQL APIs
# - Mobile/web backends
# - Microservices`;

const patternBCode = `# Pattern B: Event-Driven Pipeline
# ─────────────────────────────────
# Trigger:  File upload / event bus event
# Compute:  Function processes event
# Services: Storage + DB + Notifications

# Example: Image processing pipeline (pseudo-code)
async function processImage(event) {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // Download original
  const image = await storage.get(bucket, key);

  // Generate thumbnail
  const thumbnail = await sharp(image)
    .resize(200, 200)
    .toBuffer();

  // Save thumbnail
  await storage.put(bucket, 'thumbnails/' + key, thumbnail);

  // Update database
  await database.update('images', {
    key, thumbnailReady: true
  });

  // Notify
  await eventBus.publish('image.processed', { key });
}

# Use when:
# - Media processing (thumbnails, transcoding)
# - ETL-like flows
# - Webhook handlers`;

const patternCCode = `# Pattern C: Async Queue Worker
# ─────────────────────────────────
# Trigger:  Queue message (SQS, RabbitMQ, etc.)
# Compute:  Worker function/container
# Services: Queue + Retries + Dead-letter handling

# Example: Email sender with retry (pseudo-code)
async function sendEmailWorker(event) {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    try {
      await emailService.send({
        to: message.recipient,
        subject: message.subject,
        body: message.template
      });
      console.log('Email sent to', message.recipient);
    } catch (error) {
      // Message returns to queue for retry
      // After max retries -> dead-letter queue
      throw error;
    }
  }
}

# Use when:
# - Sending emails/notifications
# - Long-ish or retry-prone tasks
# - Smoothing traffic spikes`;

const designPrinciplesCode = `# Serverless Design Principles (Practical)

# 1. Make handlers STATELESS and IDEMPOTENT
#    - Stateless: don't rely on local memory between requests
#    - Idempotent: safe to retry without duplicate side effects
#    - Common with queues and at-least-once delivery

# 2. Treat events as the CONTRACT
#    - Version event schemas
#    - Validate inputs defensively
#    - Include correlation IDs for tracing

# 3. Prefer ASYNC for slow work
#    - Keep request/response paths fast
#    - Move heavy steps to queues/events
#    - Example: return 202 Accepted, process in background

# 4. Use LEAST-PRIVILEGE permissions
#    - Each function gets only what it needs
#    - Function A: read from DB table X
#    - Function B: write to bucket Y

# 5. Build strong OBSERVABILITY from day 1
#    - Structured logs (JSON, not plaintext)
#    - Metrics for errors/latency/retries
#    - Distributed traces across services`;

const tradeoffsCode = `# Serverless Tradeoffs / Gotchas

# COLD STARTS (latency spikes)
# If a function scales from zero, first request is slower.
# Severity depends on: runtime, config, package size, VPC.
# Mitigations: provisioned concurrency, smaller packages,
#              choose faster runtimes (Go/Rust vs Java).

# DISTRIBUTED COMPLEXITY
# More managed components and event flows means:
# - Stronger need for tracing/log correlation
# - Careful error handling and retries
# - Clear boundaries and contracts between services

# LIMITS AND CONSTRAINTS
# - Max execution time (e.g., 15 min for Lambda)
# - Payload size limits (e.g., 6 MB sync, 256 KB async)
# - Concurrency limits (default 1000, can be raised)
# - VPC access can add cold start latency

# VENDOR LOCK-IN
# Serverless often uses provider-specific services.
# Good abstraction helps, but full portability is hard.

# COST SURPRISES
# Pay-per-use is great for spiky workloads.
# But constant high-volume traffic can get expensive
# vs reserved capacity. Monitor usage early!`;

/* ─── Challenge Code ─── */

const challenge1Starter = `# Challenge 1: Serverless Fundamentals
#
# Answer these questions by writing your responses:
#
# Q1: Name the 4 traits that define a serverless workload.
#
# Q2: What is the difference between FaaS and
#     serverless containers?
#
# Q3: Where should you keep state in a serverless app?
#     (Hint: NOT in the compute runtime)
#
# Q4: Name 3 types of triggers/events that can start
#     serverless compute.
#
# Write your answers below:

`;

const challenge1Solution = `# Solution: Serverless Fundamentals

# Q1: The 4 traits that define a serverless workload:
# 1. No server management by you
# 2. On-demand execution (triggered by events)
# 3. Automatic scaling (including scale-to-zero)
# 4. Usage-based pricing (pay for execution, not idle)

# Q2: FaaS vs Serverless Containers:
# - FaaS (Functions as a Service): Short-lived handlers
#   executed per event/request. Usually stateless,
#   auto-scaled per invocation.
# - Serverless Containers: Run full containers without
#   managing servers. Platform manages scaling/infra.
#   Better for longer-running or stateful workloads.

# Q3: Keep state in MANAGED SERVICES:
# - Databases (DynamoDB, RDS, Firestore)
# - Object storage (S3, GCS)
# - Caches (ElastiCache, Redis)
# - NOT in local memory or filesystem of the function

# Q4: Three types of triggers:
# 1. HTTP requests (API Gateway)
# 2. Queue messages (SQS, Pub/Sub)
# 3. File uploads (S3 events)
# Others: cron/schedule, DB change streams, IoT events`;

const challenge2Starter = `# Challenge 2: Match the Pattern
#
# For each scenario, identify which serverless pattern
# (A, B, C, or D) is the best fit:
#
# Pattern A: Request/Response API
# Pattern B: Event-Driven Pipeline
# Pattern C: Async Queue Worker
# Pattern D: Scheduled Task
#
# Scenarios:
# 1. User uploads a profile photo that needs to be
#    resized into 3 different sizes.
#
# 2. A mobile app needs a /login endpoint that returns
#    a JWT token.
#
# 3. Every night at 2 AM, aggregate daily sales data
#    into a summary report.
#
# 4. After a user places an order, send a confirmation
#    email (which can fail and needs retries).
#
# 5. A webhook from Stripe notifies you of a successful
#    payment and you need to update the order status.
#
# Write your answers (letter + short explanation):

`;

const challenge2Solution = `# Solution: Match the Pattern

# 1. Photo upload -> resize into 3 sizes
#    PATTERN B (Event-Driven Pipeline)
#    Trigger: S3/storage file upload event
#    Function processes image into multiple sizes
#    Stores results back in storage, updates DB

# 2. Mobile /login endpoint -> returns JWT
#    PATTERN A (Request/Response API)
#    Trigger: HTTP POST request
#    Function validates credentials, returns token
#    Uses auth service + user database

# 3. Nightly sales aggregation at 2 AM
#    PATTERN D (Scheduled Task)
#    Trigger: Cron schedule (0 2 * * *)
#    Function queries day's sales, writes summary
#    Uses database for read + write

# 4. Send order confirmation email with retries
#    PATTERN C (Async Queue Worker)
#    Trigger: Queue message (order.placed event)
#    Worker sends email via email service
#    Failed sends retry; dead-letter queue for failures

# 5. Stripe webhook -> update order status
#    PATTERN A (Request/Response API)
#    Trigger: HTTP POST from Stripe
#    Function validates webhook signature
#    Updates order status in database
#    (Could also be B if you publish to event bus first)`;

const challenge3Starter = `# Challenge 3: Design a Serverless System
#
# Design a serverless image sharing platform.
# Users can:
# - Upload images (max 10 MB)
# - View a feed of recent images
# - Get notifications when someone likes their image
#
# For each requirement, specify:
# 1. Which serverless pattern you'd use
# 2. What triggers the compute
# 3. What managed services you need
# 4. How you handle failures/retries
# 5. What design principles apply
#
# Also address:
# - How would you handle cold starts for the API?
# - Where would you store image metadata?
# - How would you handle a spike of 10,000 uploads?
#
# Write your architecture design below:

`;

const challenge3Solution = `# Solution: Serverless Image Sharing Platform

# === IMAGE UPLOAD ===
# Pattern B: Event-Driven Pipeline
# Trigger: HTTP POST /images (presigned URL upload to S3)
# Services: Object Storage (S3) + DB + Queue
# Flow:
#   1. API function generates presigned upload URL
#   2. Client uploads directly to S3
#   3. S3 event triggers processing function
#   4. Processing function: resize, generate thumbnail
#   5. Save metadata to DB (DynamoDB/Postgres)
# Failures: S3 event retries automatically. DLQ for
#           processing failures. Idempotent handler
#           (check if thumbnail already exists).

# === VIEW FEED ===
# Pattern A: Request/Response API
# Trigger: HTTP GET /feed?page=1
# Services: DB + CDN + Cache
# Flow:
#   1. Function queries recent images from DB
#   2. Returns paginated results with CDN URLs
# Cold starts: Use provisioned concurrency for API
#              functions. Keep package small.
# Metadata: Stored in DynamoDB (fast reads) or
#           Postgres with read replicas.

# === LIKE NOTIFICATIONS ===
# Pattern C: Async Queue Worker
# Trigger: Queue message from "like" event
# Services: Queue (SQS) + Push notification service
# Flow:
#   1. API function handles POST /images/:id/like
#   2. Updates like count in DB (atomic increment)
#   3. Publishes event to queue
#   4. Worker function sends push notification
# Failures: Queue retries. DLQ after 3 attempts.
#           Idempotent: check if notification already sent.

# === HANDLING 10,000 UPLOAD SPIKE ===
# - S3 handles uploads directly (no function bottleneck)
# - Processing functions auto-scale with S3 events
# - Set reserved concurrency to protect downstream DB
# - Use queue between upload and processing if needed

# === DESIGN PRINCIPLES APPLIED ===
# 1. Stateless: all state in managed services
# 2. Idempotent: safe to retry image processing
# 3. Async: heavy work (resize) in background
# 4. Least-privilege: upload fn only writes S3
# 5. Observability: correlation ID per upload flow`;

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function ServerlessApplicationsPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("serverless-applications", language);
  const category = getCategoryForPost("serverless-applications");
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
            {postContent?.breadcrumbLabel || "Serverless"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || "Serverless Applications: Complete Guide"}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || "Understand serverless architecture from core concepts to production patterns."}
        </Text>
        {postContent?.categoriesDescription && (
          <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
            <Text className={styles.infoText}>{postContent.categoriesDescription}</Text>
          </div>
        )}
        <AnimatedSection>
          <HeroServerlessSVG />
        </AnimatedSection>
      </div>

      {/* ══════════════ SECTION 1: CORE DEFINITION ══════════════ */}
      <section id="serverless-fundamentals" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"⚡"} 1. What is a Serverless Application?
            </Heading>
            <Text className={styles.sectionDescription}>
              A serverless application is one where your code still runs on servers, but you don&apos;t manage the servers. The cloud provider handles provisioning, scaling, patching, and availability. You focus on code + configuration.
            </Text>

            <CodeEditor
              code={serverlessDefinitionCode}
              language="bash"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              height="auto"
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Serverless IS:</strong>
                <br />&#8226; A way to build backend systems using managed compute + managed services
                <br />&#8226; Often event-driven (things happen &#8594; code runs)
                <br />&#8226; Modular: you assemble capabilities (auth, storage, DB, messaging) from managed services
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Serverless is NOT:</strong>
                <br />&#8226; &quot;No servers exist&quot; (servers exist; you just don&apos;t manage them)
                <br />&#8226; &quot;Only for small apps&quot; (it can scale significantly; design matters)
                <br />&#8226; A frontend framework (React/Angular run on the client; not &quot;serverless&quot; by themselves)
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 2: BUILDING BLOCKS ══════════════ */}
      <section id="building-blocks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🧱"} 2. Building Blocks
            </Heading>
            <Text className={styles.sectionDescription}>
              Think in three categories: Triggers (how work starts), Compute (where your code runs), and Managed Services (state + integration). In serverless, you keep state in managed services, not inside the compute runtime.
            </Text>

            <AnimatedSection>
              <BuildingBlocksDiagram />
            </AnimatedSection>

            <div className={styles.tipLine}>
              <span className={styles.tipLineIcon}>{"💡"}</span>
              <span className={styles.tipLineText}>
                <strong>Rule of thumb:</strong> In serverless, you usually keep state in managed services, not inside the compute runtime. Functions are stateless and ephemeral.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 3: PATTERNS ══════════════ */}
      <section id="serverless-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔄"} 3. Serverless Patterns
            </Heading>
            <Text className={styles.sectionDescription}>
              Four fundamental patterns cover most serverless use cases. Each pattern defines a trigger type, compute approach, and service dependencies.
            </Text>

            <AnimatedSection>
              <PatternsDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Pattern A: Request/Response API</Heading>
            <CodeEditor code={patternACode} language="javascript" readOnly disableLinting collapsePanelsByDefault compactToolbar height="auto" />

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Pattern B: Event-Driven Pipeline</Heading>
            <CodeEditor code={patternBCode} language="javascript" readOnly disableLinting collapsePanelsByDefault compactToolbar height="auto" />

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Pattern C: Async Queue Worker</Heading>
            <CodeEditor code={patternCCode} language="javascript" readOnly disableLinting collapsePanelsByDefault compactToolbar height="auto" />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 4: ADVANTAGES & TRADEOFFS ══════════════ */}
      <section id="tradeoffs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"⚖️"} 4. Advantages &amp; Tradeoffs
            </Heading>
            <Text className={styles.sectionDescription}>
              Serverless reduces ops overhead and scales automatically, but introduces cold starts, distributed complexity, and potential vendor lock-in. Understanding these tradeoffs is critical for making the right architectural choice.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Advantages:</strong>
                <br />&#8226; Less ops overhead (no server lifecycle management)
                <br />&#8226; Automatic scaling (handles bursts well)
                <br />&#8226; Faster to ship (assemble from managed components)
                <br />&#8226; Often cost-efficient for spiky workloads (pay mostly when used)
              </Text>
            </div>

            <AnimatedSection>
              <ColdStartDiagram />
            </AnimatedSection>

            <CodeEditor code={tradeoffsCode} language="bash" readOnly disableLinting collapsePanelsByDefault={false} compactToolbar height="auto" />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 5: DESIGN PRINCIPLES ══════════════ */}
      <section id="design-principles" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🏗️"} 5. Design Principles
            </Heading>
            <Text className={styles.sectionDescription}>
              These practical principles help you build reliable serverless systems. From stateless handlers to observability, following these guidelines prevents the most common pitfalls.
            </Text>

            <CodeEditor code={designPrinciplesCode} language="bash" readOnly disableLinting collapsePanelsByDefault={false} compactToolbar height="auto" />

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Mental Model:</strong> &quot;Events &#8594; Compute &#8594; Managed Services&quot; — Something happens (event), code runs (compute), state/side effects go to managed services. You deploy code, not servers.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 6: WHEN TO USE ══════════════ */}
      <section id="when-to-use" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎯"} 6. When to Use Serverless
            </Heading>
            <Text className={styles.sectionDescription}>
              Serverless is a strong fit for event-driven, spiky workloads. But it&apos;s not the answer to everything. Here&apos;s when to lean in and when to be cautious.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Strong Fit:</strong>
                <br />&#8226; Unpredictable or spiky traffic
                <br />&#8226; Event-driven workflows
                <br />&#8226; Teams that want to move fast with less infra management
                <br />&#8226; APIs + background processing + pipelines
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Be Cautious:</strong>
                <br />&#8226; Ultra-low-latency requirements where cold starts are unacceptable
                <br />&#8226; Extremely high constant throughput (cost/perf tradeoff)
                <br />&#8226; Workloads requiring long-running compute without interruption
                <br />&#8226; Heavy reliance on very provider-specific services (if portability is a must)
              </Text>
            </div>

            <AnimatedSection>
              <ServerlessChecklistSVG />
            </AnimatedSection>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 7: CHALLENGES ══════════════ */}
      <section id="challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🏆"} 7. Hands-On Challenges
            </Heading>
            <Text className={styles.sectionDescription}>
              Test your understanding of serverless architecture. Write your answers in the editor, then reveal the solution to compare!
            </Text>

            <AnimatedSection>
              <ChallengeRocketSVG />
            </AnimatedSection>

            <SLProgressSVG completed={completedChallenges} />

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <div className={styles.infoBoxLabel}>HOW TO USE CHALLENGES</div>
              <Text className={styles.infoText}>
                Write your answers in the editor. The progress bar tracks your completion as you reveal solutions. Challenges progress from fundamentals to system design.
              </Text>
            </div>

            {/* Challenge 1 */}
            <div className="mt-4 mb-2">
              <SLBadge level={1} difficulty="BEGINNER" color="#10b981" />
            </div>
            <CodeEditor code={challenge1Starter} language="bash" readOnly={false} disableLinting collapsePanelsByDefault={false} compactToolbar height="auto" maxCodeHeight={350} />
            <button type="button" onClick={() => toggleSolution("ch1")} className={styles.answerKeyToggle} aria-expanded={visibleSolutions.has("ch1")}>
              {visibleSolutions.has("ch1") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch1") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge1Solution} language="bash" readOnly height="auto" disableLinting collapsePanelsByDefault compactToolbar />
              </div>
            )}

            {/* Challenge 2 */}
            <div className="mt-8 mb-2">
              <SLBadge level={2} difficulty="INTERMEDIATE" color="#3b82f6" />
            </div>
            <CodeEditor code={challenge2Starter} language="bash" readOnly={false} disableLinting collapsePanelsByDefault={false} compactToolbar height="auto" maxCodeHeight={400} />
            <button type="button" onClick={() => toggleSolution("ch2")} className={styles.answerKeyToggle} aria-expanded={visibleSolutions.has("ch2")}>
              {visibleSolutions.has("ch2") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch2") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge2Solution} language="bash" readOnly height="auto" disableLinting collapsePanelsByDefault compactToolbar />
              </div>
            )}

            {/* Challenge 3 */}
            <div className="mt-8 mb-2">
              <SLBadge level={3} difficulty="ADVANCED" color="#ef4444" />
            </div>
            <CodeEditor code={challenge3Starter} language="bash" readOnly={false} disableLinting collapsePanelsByDefault={false} compactToolbar height="auto" maxCodeHeight={450} />
            <button type="button" onClick={() => toggleSolution("ch3")} className={styles.answerKeyToggle} aria-expanded={visibleSolutions.has("ch3")}>
              {visibleSolutions.has("ch3") ? (language === "es" ? "Ocultar solución" : "Hide Solution") : (language === "es" ? "Ver solución" : "See Solution")}
            </button>
            {visibleSolutions.has("ch3") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={challenge3Solution} language="bash" readOnly height="auto" disableLinting collapsePanelsByDefault compactToolbar />
              </div>
            )}

            {/* Completion celebration */}
            {completedChallenges === 3 && (
              <AnimatedSection>
                <svg viewBox="0 0 700 100" className="w-full mt-6" style={{ maxWidth: 700 }}>
                  <defs>
                    <linearGradient id="slcomp-bg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <rect width="700" height="100" rx="16" fill="url(#slcomp-bg)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
                  {Array.from({ length: 20 }).map((_, i) => {
                    const cx = 50 + Math.random() * 600;
                    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
                    const c = colors[i % colors.length];
                    return (
                      <rect key={`slconf${i}`} x={cx} y={10 + Math.random() * 20} width={4 + Math.random() * 4} height={4 + Math.random() * 4} rx="1"
                        fill={c} opacity="0" transform={`rotate(${Math.random() * 360} ${cx} ${20})`}>
                        <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + Math.random() * 2}s`} begin={`${Math.random() * 2}s`} repeatCount="indefinite" />
                        <animate attributeName="y" values={`${10 + Math.random() * 20};${70 + Math.random() * 20}`} dur={`${2 + Math.random() * 2}s`} begin={`${Math.random() * 2}s`} repeatCount="indefinite" />
                      </rect>
                    );
                  })}
                  <text x="350" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="700">All Challenges Complete!</text>
                  <text x="350" y="75" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="12" fontWeight="500">You&apos;ve mastered serverless architecture</text>
                </svg>
              </AnimatedSection>
            )}

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <div className={styles.infoBoxLabel}>CONGRATULATIONS!</div>
              <Text className={styles.infoText}>
                If you&apos;ve completed all 3 challenges, you have a solid understanding of serverless architecture! You can now identify serverless patterns, design event-driven systems, and reason about tradeoffs like cold starts, distributed complexity, and cost. Apply these patterns in your next project.
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
              Serverless is an architecture style where you deploy code, not servers. The mental model is simple: Events trigger Compute which interacts with Managed Services. Four patterns (API, event pipeline, queue worker, scheduled task) cover most use cases.
            </Text>
            <Text className={styles.sectionDescription}>
              The tradeoffs are real — cold starts, distributed complexity, vendor lock-in, and potential cost surprises — but the benefits of reduced ops overhead, automatic scaling, and faster shipping make serverless a compelling choice for event-driven, spiky workloads and teams that want to focus on business logic.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Key Takeaways:</strong>
                <br />&#8226; Serverless = no server management + on-demand execution + auto-scaling + usage-based pricing
                <br />&#8226; Three building blocks: Triggers, Compute, Managed Services
                <br />&#8226; Four patterns cover most use cases: API, Pipeline, Queue Worker, Cron
                <br />&#8226; Make handlers stateless and idempotent
                <br />&#8226; Build observability from day 1
                <br />&#8226; Understand cold starts and design around them
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
