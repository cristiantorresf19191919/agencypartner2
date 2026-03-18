"use client";

import { useState, useEffect } from "react";

/* ─── Dev tips & tricks shown like a videogame loading screen ─── */
const TIPS = [
  { icon: "\u26A1", text: "git stash -u stashes untracked files too \u2014 not just modified ones." },
  { icon: "\uD83D\uDD11", text: "Ctrl+Shift+P in VS Code opens the Command Palette \u2014 the fastest way to do anything." },
  { icon: "\uD83C\uDF33", text: "git worktree lets you work on multiple branches at the same time without switching." },
  { icon: "\uD83D\uDCA1", text: "console.table() prints arrays and objects as a formatted table in DevTools." },
  { icon: "\uD83D\uDE80", text: "npx can run any npm package without installing it globally." },
  { icon: "\uD83D\uDD0D", text: "git log --oneline --graph shows your branch history as an ASCII art tree." },
  { icon: "\uD83C\uDFAF", text: "TypeScript's satisfies operator validates types without widening \u2014 added in TS 4.9." },
  { icon: "\uD83E\uDDE0", text: "React.memo only prevents re-renders when props actually change \u2014 not state." },
  { icon: "\u2328\uFE0F", text: "Ctrl+K in GitHub lets you search repos, issues, and PRs from anywhere." },
  { icon: "\uD83D\uDCE6", text: "npm ls --depth=0 shows only your direct dependencies, not the full tree." },
  { icon: "\uD83D\uDD12", text: "git commit --amend lets you fix the last commit message without creating a new one." },
  { icon: "\uD83C\uDFA8", text: "CSS :has() is the parent selector we waited 20 years for \u2014 supported in all browsers since 2023." },
  { icon: "\uD83D\uDEE0\uFE0F", text: "git bisect automates binary search to find exactly which commit introduced a bug." },
  { icon: "\uD83C\uDF10", text: "fetch() in Next.js automatically deduplicates identical requests during a render pass." },
  { icon: "\uD83E\uDDE9", text: "Destructuring with defaults: const { port = 3000 } = config; \u2014 no more || fallbacks." },
  { icon: "\uD83D\uDCC8", text: "Chrome DevTools \u2192 Performance tab \u2192 Record \u2192 find exactly what\u2019s causing jank." },
  { icon: "\uD83D\uDD04", text: "git reflog shows every HEAD movement \u2014 even after reset --hard. Your safety net." },
  { icon: "\u2615", text: "Kotlin\u2019s scope functions (let, run, apply, also, with) each have different receiver/return semantics." },
  { icon: "\uD83C\uDFD7\uFE0F", text: "Docker multi-stage builds can reduce image size by 90% \u2014 only copy what you need." },
  { icon: "\uD83D\uDCA0", text: "Tailwind\u2019s @apply lets you extract repeated utility patterns into reusable classes." },
];

export default function BlogLoading() {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [fade, setFade] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev + 0.2;
        if (prev >= 60) return prev + 0.5;
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const tip = TIPS[tipIndex];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0c29 0%, #1a1a3e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Loading content"
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated SVG icon */}
      <svg viewBox="0 0 120 120" width="80" height="80" style={{ marginBottom: 24 }}>
        <defs>
          <linearGradient id="ld-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="ld-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Orbiting ring */}
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="2" strokeDasharray="8 6">
          <animateTransform attributeName="transform" type="rotate" values="0 60 60;360 60 60" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1.5" strokeDasharray="4 8">
          <animateTransform attributeName="transform" type="rotate" values="360 60 60;0 60 60" dur="12s" repeatCount="indefinite" />
        </circle>
        {/* Center code brackets */}
        <g filter="url(#ld-glow)">
          <text x="60" y="68" textAnchor="middle" fill="url(#ld-g1)" fontSize="32" fontWeight="700" fontFamily="monospace">
            &lt;/&gt;
          </text>
        </g>
        {/* Orbiting dot */}
        <circle r="4" fill="#8b5cf6" opacity="0.8">
          <animateMotion dur="3s" repeatCount="indefinite" path="M60,60 m-42,0 a42,42 0 1,0 84,0 a42,42 0 1,0 -84,0" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#06b6d4" opacity="0.7">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M60,60 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* "Loading" text */}
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        Loading
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "min(100%, 280px)",
          height: 3,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: `${Math.min(progress, 95)}%`,
            height: "100%",
            background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
            borderRadius: 2,
            transition: "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Tip card */}
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          padding: "16px 20px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          minHeight: 72,
        }}
      >
        {/* Tip icon */}
        <span
          style={{
            fontSize: "1.25rem",
            flexShrink: 0,
            marginTop: 2,
            filter: "drop-shadow(0 0 6px rgba(139,92,246,0.3))",
          }}
        >
          {tip.icon}
        </span>
        {/* Tip content */}
        <div>
          <div
            style={{
              fontSize: "0.625rem",
              fontWeight: 700,
              color: "rgba(139,92,246,0.6)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Did you know?
          </div>
          <div
            style={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {tip.text}
          </div>
        </div>
      </div>

      {/* Tip counter */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: tipIndex % 5 === i ? 16 : 4,
              height: 4,
              borderRadius: 2,
              background: tipIndex % 5 === i ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Skeleton content preview behind (faint) */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(100%, 800px)",
          opacity: 0.03,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0 2rem",
        }}
      >
        {[320, 480, "100%", "100%", 360, "100%"].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: typeof w === "number" ? w : w,
              maxWidth: "100%",
              height: i === 0 ? 36 : i === 2 || i === 3 || i === 5 ? 80 : 22,
              borderRadius: 8,
              background: "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
