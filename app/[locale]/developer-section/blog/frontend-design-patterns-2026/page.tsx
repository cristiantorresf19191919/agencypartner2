"use client";

import React from "react";
import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
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

function AtomicDesignDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="adg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="adg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="800" height="320" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      {/* Atoms */}
      <circle cx="80" cy="160" r="28" fill="url(#adg1)" filter="url(#glow)" opacity="0.9" />
      <text x="80" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Atoms</text>
      <text x="80" y="215" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Buttons</text>
      <text x="80" y="228" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Inputs</text>
      {/* Arrow 1 */}
      <line x1="115" y1="160" x2="175" y2="160" stroke="rgba(139,92,246,0.5)" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <polygon points="175,155 185,160 175,165" fill="rgba(139,92,246,0.7)" />
      {/* Molecules */}
      <rect x="190" y="132" width="100" height="56" rx="12" fill="url(#adg1)" filter="url(#glow)" opacity="0.85" />
      <text x="240" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Molecules</text>
      <text x="240" y="215" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Search Form</text>
      <text x="240" y="228" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Nav Item</text>
      {/* Arrow 2 */}
      <line x1="295" y1="160" x2="345" y2="160" stroke="rgba(139,92,246,0.5)" strokeWidth="2" />
      <polygon points="345,155 355,160 345,165" fill="rgba(139,92,246,0.7)" />
      {/* Organisms */}
      <rect x="360" y="125" width="110" height="70" rx="14" fill="url(#adg2)" filter="url(#glow)" opacity="0.85" />
      <text x="415" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Organisms</text>
      <text x="415" y="215" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Header</text>
      <text x="415" y="228" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Product Card</text>
      {/* Arrow 3 */}
      <line x1="475" y1="160" x2="525" y2="160" stroke="rgba(139,92,246,0.5)" strokeWidth="2" />
      <polygon points="525,155 535,160 525,165" fill="rgba(139,92,246,0.7)" />
      {/* Templates */}
      <rect x="540" y="120" width="110" height="80" rx="14" fill="url(#adg2)" filter="url(#glow)" opacity="0.8" />
      <text x="595" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Templates</text>
      <text x="595" y="172" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Layout</text>
      <text x="595" y="215" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Page Skeleton</text>
      {/* Arrow 4 */}
      <line x1="655" y1="160" x2="695" y2="160" stroke="rgba(139,92,246,0.5)" strokeWidth="2" />
      <polygon points="695,155 705,160 695,165" fill="rgba(139,92,246,0.7)" />
      {/* Pages */}
      <rect x="710" y="115" width="70" height="90" rx="14" fill="url(#adg1)" filter="url(#glow)" opacity="0.9" />
      <text x="745" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Pages</text>
      <text x="745" y="172" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Real</text>
      <text x="745" y="185" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Content</text>
      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">Atomic Design Hierarchy</text>
      <text x="400" y="60" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Small → Large: composing interfaces from fundamental building blocks</text>
      {/* Bottom labels */}
      <text x="400" y="300" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Abstract ←────────────────────────────────────────→ Concrete</text>
    </svg>
  );
}

function VirtualDomDiagram() {
  return (
    <svg viewBox="0 0 800 280" className="w-full my-6" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="vd1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="vd2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="vd3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
      <text x="400" y="35" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Virtual DOM Reconciliation Process</text>
      {/* Old VDOM */}
      <text x="130" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="600">Previous VDOM</text>
      <rect x="80" y="85" width="100" height="36" rx="8" fill="url(#vd1)" />
      <text x="130" y="108" textAnchor="middle" fill="white" fontSize="11">&lt;div&gt;</text>
      <rect x="55" y="135" width="70" height="30" rx="6" fill="url(#vd1)" opacity="0.7" />
      <text x="90" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;h1&gt;</text>
      <rect x="140" y="135" width="70" height="30" rx="6" fill="url(#vd1)" opacity="0.7" />
      <text x="175" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;p&gt;</text>
      <line x1="110" y1="121" x2="90" y2="135" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
      <line x1="150" y1="121" x2="175" y2="135" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
      {/* New VDOM */}
      <text x="400" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="600">New VDOM</text>
      <rect x="350" y="85" width="100" height="36" rx="8" fill="url(#vd2)" />
      <text x="400" y="108" textAnchor="middle" fill="white" fontSize="11">&lt;div&gt;</text>
      <rect x="325" y="135" width="70" height="30" rx="6" fill="url(#vd2)" opacity="0.7" />
      <text x="360" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;h1&gt;</text>
      <rect x="410" y="135" width="70" height="30" rx="6" fill="url(#vd3)" opacity="0.9" />
      <text x="445" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;span&gt;</text>
      <text x="445" y="175" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="600">CHANGED</text>
      <line x1="380" y1="121" x2="360" y2="135" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <line x1="420" y1="121" x2="445" y2="135" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      {/* Diff Arrow */}
      <text x="265" y="115" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">DIFF</text>
      <line x1="190" y1="108" x2="340" y2="108" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <polygon points="340,104 348,108 340,112" fill="rgba(255,255,255,0.4)" />
      {/* Real DOM */}
      <text x="670" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="600">Real DOM</text>
      <rect x="620" y="85" width="100" height="36" rx="8" fill="url(#vd1)" opacity="0.5" />
      <text x="670" y="108" textAnchor="middle" fill="white" fontSize="11">&lt;div&gt;</text>
      <rect x="595" y="135" width="70" height="30" rx="6" fill="url(#vd1)" opacity="0.3" />
      <text x="630" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;h1&gt;</text>
      <rect x="680" y="135" width="70" height="30" rx="6" fill="url(#vd3)" opacity="0.9" />
      <text x="715" y="155" textAnchor="middle" fill="white" fontSize="10">&lt;span&gt;</text>
      <text x="715" y="175" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="700">PATCHED</text>
      <line x1="650" y1="121" x2="630" y2="135" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
      <line x1="690" y1="121" x2="715" y2="135" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
      {/* Patch Arrow */}
      <text x="535" y="115" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">PATCH</text>
      <line x1="460" y1="108" x2="610" y2="108" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="6 4" />
      <polygon points="610,104 618,108 610,112" fill="rgba(245,158,11,0.6)" />
      {/* Bottom explanation */}
      <rect x="50" y="210" width="700" height="50" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="400" y="233" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Only the changed &lt;p&gt; → &lt;span&gt; node is updated in the real DOM. Unchanged nodes are skipped.</text>
      <text x="400" y="250" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">This minimizes expensive DOM operations and keeps your UI fast.</text>
    </svg>
  );
}

function GridFlexboxDiagram() {
  return (
    <svg viewBox="0 0 800 240" className="w-full my-6" style={{ maxWidth: 800 }}>
      <rect width="800" height="240" rx="16" fill="rgba(15,23,42,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
      <text x="400" y="30" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">Grid (2D) vs Flexbox (1D)</text>
      {/* Grid side */}
      <text x="200" y="60" textAnchor="middle" fill="rgba(139,92,246,0.9)" fontSize="13" fontWeight="600">CSS Grid — Rows + Columns</text>
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`g${r}${c}`} x={75+c*85} y={75+r*50} width="78" height="42" rx="6" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
      )))}
      {/* Flexbox side */}
      <text x="600" y="60" textAnchor="middle" fill="rgba(6,182,212,0.9)" fontSize="13" fontWeight="600">Flexbox — Row OR Column</text>
      {[0,1,2,3].map(i => (
        <rect key={`f${i}`} x={480+i*70} y={80} width="62" height="36" rx="6" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
      ))}
      <text x="600" y="140" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">↑ flex-direction: row</text>
      {[0,1,2].map(i => (
        <rect key={`fc${i}`} x={560} y={155+i*28} width="80" height="22" rx="5" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.35)" strokeWidth="1.5" />
      ))}
      <text x="560" y="224" fill="rgba(255,255,255,0.5)" fontSize="10">↑ flex-direction: column</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   EXECUTABLE CODE EXAMPLES
   ═══════════════════════════════════════════════════════ */

const atomicDesignCode = `// Atomic Design in React — Atoms → Molecules → Organisms
// Click Run to see the composed UI!

// ATOM: A simple Button
function Button({ children, variant = "primary", onClick }) {
  const base = "padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s;";
  const variants = {
    primary: "background: #8b5cf6; color: white;",
    secondary: "background: transparent; color: #8b5cf6; border: 2px solid #8b5cf6;",
  };
  return <button style={Object.assign({}, ...(\`\${base} \${variants[variant]}\`).split(';').filter(Boolean).map(s => {const [k,v] = s.split(':'); return k&&v ? {[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]: v.trim()} : {}}))} onClick={onClick}>{children}</button>;
}

// ATOM: An Input
function Input({ placeholder, value, onChange }) {
  return <input placeholder={placeholder} value={value} onChange={onChange} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #6b7280", background: "#1e1b4b", color: "white", fontSize: 14, outline: "none", width: "100%" }} />;
}

// MOLECULE: SearchBar = Input + Button
function SearchBar({ onSearch }) {
  const [query, setQuery] = React.useState("");
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
      <Button onClick={() => onSearch(query)}>Search</Button>
    </div>
  );
}

// MOLECULE: UserBadge = avatar + text
function UserBadge({ name, role }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>
        {name[0]}
      </div>
      <div>
        <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{name}</div>
        <div style={{ color: "#9ca3af", fontSize: 12 }}>{role}</div>
      </div>
    </div>
  );
}

// ORGANISM: Header = UserBadge + SearchBar + Button
function Header() {
  const [result, setResult] = React.useState("");
  return (
    <div style={{ background: "linear-gradient(135deg, #1e1b4b, #0f172a)", padding: 16, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <UserBadge name="Alex" role="Senior Developer" />
        <div style={{ flex: 1, maxWidth: 280 }}>
          <SearchBar onSearch={q => setResult(q ? \`Searching: "\${q}"\` : "")} />
        </div>
        <Button variant="secondary">Settings</Button>
      </div>
      {result && <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(139,92,246,0.15)", borderRadius: 8, color: "#c4b5fd", fontSize: 13 }}>{result}</div>}
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20, background: "#0a0a1a", minHeight: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ color: "white", margin: 0, fontSize: 18 }}>Atomic Design Demo</h2>
      <div>
        <h3 style={{ color: "#8b5cf6", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Atoms</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <div style={{ width: 180 }}><Input placeholder="Text input..." /></div>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#06b6d4", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Molecules</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <UserBadge name="Sarah" role="Designer" />
          <div style={{ width: 260 }}><SearchBar onSearch={() => {}} /></div>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#ec4899", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Organism: Complete Header</h3>
        <Header />
      </div>
    </div>
  );
}

export default App;`;

const contextApiCode = `// ❌ Context API: Re-renders ALL consumers on any change
const ThemeContext = React.createContext({ theme: "dark", toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("dark");
  // Every state change re-renders ALL consumers
  const value = { theme, toggleTheme: () => setTheme(t => t === "dark" ? "light" : "dark") };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function StatusBar() {
  const { theme } = React.useContext(ThemeContext);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div style={{ padding: 8, background: "rgba(239,68,68,0.1)", borderRadius: 6, fontSize: 13, color: "#fca5a5" }}>
      StatusBar renders: {renders.current} (re-renders even if only toggleTheme is used!)
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div>
      <button onClick={toggleTheme} style={{ padding: "8px 16px", background: theme === "dark" ? "#4c1d95" : "#fbbf24", color: theme === "dark" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"} (renders: {renders.current})
      </button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div style={{ padding: 20, background: "#1a1a2e", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ color: "white", margin: 0 }}>Context API (all consumers re-render)</h3>
        <ThemeToggle />
        <StatusBar />
        <p style={{ color: "#9ca3af", fontSize: 12 }}>Click toggle — notice StatusBar re-renders too!</p>
      </div>
    </ThemeProvider>
  );
}
export default App;`;

const signalsCode = `// ✅ Signals Pattern: Fine-grained reactivity (simulated)
// Only the specific subscriber re-renders

function createSignal(initial) {
  let value = initial;
  const subscribers = new Set();
  return {
    get: () => value,
    set: (newVal) => { value = typeof newVal === "function" ? newVal(value) : newVal; subscribers.forEach(fn => fn()); },
    subscribe: (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); },
  };
}

function useSignal(signal) {
  const [, forceRender] = React.useState(0);
  React.useEffect(() => signal.subscribe(() => forceRender(n => n + 1)), [signal]);
  return [signal.get(), signal.set];
}

const themeSignal = createSignal("dark");
const counterSignal = createSignal(0);

function ThemeToggle() {
  const [theme, setTheme] = useSignal(themeSignal);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{ padding: "8px 16px", background: theme === "dark" ? "#4c1d95" : "#fbbf24", color: theme === "dark" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"} (renders: {renders.current})
    </button>
  );
}

function Counter() {
  const [count, setCount] = useSignal(counterSignal);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: "8px 16px", background: "#059669", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        Count: {count} (renders: {renders.current})
      </button>
    </div>
  );
}

function StatusBar() {
  const renders = React.useRef(0);
  renders.current++;
  return (
    <div style={{ padding: 8, background: "rgba(16,185,129,0.1)", borderRadius: 6, fontSize: 13, color: "#6ee7b7" }}>
      StatusBar renders: {renders.current} (does NOT re-render on theme/counter changes!)
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 20, background: "#1a1a2e", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ color: "white", margin: 0 }}>Signals (fine-grained reactivity)</h3>
      <ThemeToggle />
      <Counter />
      <StatusBar />
      <p style={{ color: "#9ca3af", fontSize: 12 }}>Click both — StatusBar never re-renders!</p>
    </div>
  );
}
export default App;`;

const darkModeCode = `// Dark Mode with CSS Variables & React
// Toggle the theme and watch variables change!

function App() {
  const [dark, setDark] = React.useState(true);
  const theme = {
    "--bg": dark ? "#0f172a" : "#f8fafc",
    "--bg-card": dark ? "#1e293b" : "#ffffff",
    "--text": dark ? "#f1f5f9" : "#0f172a",
    "--text-muted": dark ? "#94a3b8" : "#64748b",
    "--primary": "#8b5cf6",
    "--border": dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    "--shadow": dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)",
  };

  return (
    <div style={{ ...theme, background: "var(--bg)", minHeight: "100%", padding: 24, fontFamily: "system-ui", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "var(--text)", margin: 0, fontSize: 20 }}>
          {dark ? "🌙" : "☀️"} Theme Demo
        </h2>
        <button
          onClick={() => setDark(d => !d)}
          style={{ padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
        >
          Toggle {dark ? "Light" : "Dark"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {["Dashboard", "Analytics", "Settings", "Profile"].map(title => (
          <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, boxShadow: "var(--shadow)", transition: "all 0.3s ease" }}>
            <h3 style={{ color: "var(--text)", margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>Using CSS custom properties for seamless theme switching.</p>
          </div>
        ))}
      </div>
      <pre style={{ marginTop: 20, padding: 16, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--primary)", fontSize: 12, overflow: "auto" }}>
{":root {"}
{"\\n  --bg: " + (dark ? "#0f172a" : "#f8fafc") + ";"}
{"\\n  --text: " + (dark ? "#f1f5f9" : "#0f172a") + ";"}
{"\\n  --primary: #8b5cf6;"}
{"\\n}"}
      </pre>
    </div>
  );
}
export default App;`;

const progressiveDisclosureCode = `// Progressive Disclosure Pattern
// Show essential info first, reveal details on demand

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, overflow: "hidden", transition: "all 0.2s" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: openIndex === i ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 600, textAlign: "left" }}
          >
            <span>{item.title}</span>
            <span style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", fontSize: 12 }}>▼</span>
          </button>
          <div style={{ maxHeight: openIndex === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.3s ease", background: "rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "14px 18px", color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabGroup({ tabs }) {
  const [active, setActive] = React.useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ padding: "10px 18px", background: active === i ? "rgba(139,92,246,0.2)" : "transparent", border: "none", borderBottom: active === i ? "2px solid #8b5cf6" : "2px solid transparent", color: active === i ? "white" : "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: active === i ? 600 : 400, transition: "all 0.2s" }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7 }}>{tabs[active].content}</div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h3 style={{ color: "white", margin: "0 0 12px", fontSize: 16 }}>Accordion: Click to reveal</h3>
        <Accordion items={[
          { title: "🚀 Getting Started", content: "Start with the basics: install dependencies, set up your project structure, and run the development server." },
          { title: "⚙️ Advanced Configuration", content: "Customize your build pipeline, configure environment variables, set up CI/CD, and optimize for production." },
          { title: "🔒 Security Settings", content: "Enable two-factor authentication, configure CORS policies, manage API keys, and set up rate limiting." },
        ]} />
      </div>
      <div>
        <h3 style={{ color: "white", margin: "0 0 12px", fontSize: 16 }}>Tabs: Organize by category</h3>
        <TabGroup tabs={[
          { label: "Overview", content: "Progressive disclosure shows essential information first. Users see a clean, simple interface and can drill deeper as needed. This reduces cognitive load by up to 40%." },
          { label: "Benefits", content: "• Reduces cognitive overload for new users\\n• Keeps the UI clean and focused\\n• Power users can still access advanced features\\n• Fewer style-related bugs reported" },
          { label: "Patterns", content: "Common patterns include: Accordions, Tabs, Modals, Tooltips, Expandable sections, and Step-by-step wizards. Choose based on content hierarchy and user flow." },
        ]} />
      </div>
    </div>
  );
}
export default App;`;

const lazyLoadingCode = `// React.lazy() + Suspense Demo
// Simulates lazy-loaded components with loading states

// Simulate a lazy-loaded component (1.5s delay)
function createLazyComponent(name, color, delay) {
  return React.lazy(() => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function LazyModule() {
          return (
            <div style={{ padding: 20, background: color, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ color: "white", margin: "0 0 8px", fontSize: 16 }}>{name}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 13 }}>
                This component was loaded on demand! Bundle size reduced.
              </p>
            </div>
          );
        }
      });
    }, delay);
  }));
}

const Dashboard = createLazyComponent("📊 Dashboard", "rgba(139,92,246,0.15)", 1500);
const Analytics = createLazyComponent("📈 Analytics", "rgba(6,182,212,0.15)", 2000);
const Settings = createLazyComponent("⚙️ Settings", "rgba(236,72,153,0.15)", 2500);

function LoadingFallback({ label }) {
  return (
    <div style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 20, height: 20, border: "2px solid rgba(139,92,246,0.3)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#94a3b8", fontSize: 14 }}>Loading {label}...</span>
    </div>
  );
}

function App() {
  const [route, setRoute] = React.useState("dashboard");
  const routes = { dashboard: Dashboard, analytics: Analytics, settings: Settings };
  const Component = routes[route];

  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      <h3 style={{ color: "white", margin: "0 0 16px", fontSize: 18 }}>Route-Based Code Splitting</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.keys(routes).map(r => (
          <button key={r} onClick={() => setRoute(r)} style={{ padding: "8px 16px", background: route === r ? "#8b5cf6" : "rgba(255,255,255,0.05)", color: "white", border: route === r ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: route === r ? 600 : 400, textTransform: "capitalize" }}>
            {r}
          </button>
        ))}
      </div>
      <React.Suspense fallback={<LoadingFallback label={route} />}>
        <Component />
      </React.Suspense>
      <div style={{ marginTop: 16, padding: 12, background: "rgba(16,185,129,0.08)", borderRadius: 8, color: "#6ee7b7", fontSize: 12 }}>
        Each route loads its own bundle chunk. Click different tabs to see lazy loading in action!
      </div>
    </div>
  );
}
export default App;`;

const accessibilityCode = `// Accessibility-First Components with ARIA
// Run this to see properly accessible UI components

function ProgressBar({ value, max = 100, label }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{label}</span>
        <span style={{ color: "#8b5cf6", fontSize: 14, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}
        style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, #8b5cf6, #06b6d4)", borderRadius: 5, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function AccessibleButton({ children, onClick, ariaLabel, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel || undefined}
      style={{ padding: "10px 20px", background: disabled ? "#374151" : "#8b5cf6", color: disabled ? "#6b7280" : "white", border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, outline: "none", transition: "all 0.2s" }}
      onFocus={e => { e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.5)"; }}
      onBlur={e => { e.target.style.boxShadow = "none"; }}
    >
      {children}
    </button>
  );
}

function AlertBanner({ type = "info", children }) {
  const config = { info: { bg: "rgba(59,130,246,0.1)", border: "#3b82f6", icon: "ℹ️" }, success: { bg: "rgba(16,185,129,0.1)", border: "#10b981", icon: "✅" }, warning: { bg: "rgba(245,158,11,0.1)", border: "#f59e0b", icon: "⚠️" }, error: { bg: "rgba(239,68,68,0.1)", border: "#ef4444", icon: "🚨" } };
  const c = config[type];
  return (
    <div role="alert" aria-live="polite" style={{ padding: "12px 16px", background: c.bg, borderLeft: "3px solid " + c.border, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 14 }}>
      <span aria-hidden="true">{c.icon}</span>
      <span>{children}</span>
    </div>
  );
}

function App() {
  const [progress, setProgress] = React.useState(35);
  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 style={{ color: "white", margin: 0, fontSize: 18 }}>Accessibility-First Components</h3>
      <div>
        <h4 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Progress Bar (role="progressbar")</h4>
        <ProgressBar value={progress} label="Upload Progress" />
        <ProgressBar value={72} label="Profile Complete" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <AccessibleButton onClick={() => setProgress(p => Math.min(100, p + 10))}>+10%</AccessibleButton>
          <AccessibleButton onClick={() => setProgress(0)}>Reset</AccessibleButton>
        </div>
      </div>
      <div>
        <h4 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Focus-Visible Buttons (Tab to test)</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <AccessibleButton ariaLabel="Save document">💾 Save</AccessibleButton>
          <AccessibleButton ariaLabel="Delete item" disabled>🗑️ Delete</AccessibleButton>
          <AccessibleButton ariaLabel="Share content">📤 Share</AccessibleButton>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h4 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Alert Banners (role="alert")</h4>
        <AlertBanner type="info">Semantic HTML is the first rule of ARIA.</AlertBanner>
        <AlertBanner type="success">All accessibility tests passing!</AlertBanner>
        <AlertBanner type="warning">Missing alt text on 2 images.</AlertBanner>
        <AlertBanner type="error">Color contrast ratio below 4.5:1.</AlertBanner>
      </div>
    </div>
  );
}
export default App;`;

const containerQueryCode = `// Container Queries vs Media Queries
// Resize the containers to see components adapt!

function ProductCard({ name, price, image }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ height: 60, background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{image}</div>
      <div>
        <h4 style={{ color: "white", margin: 0, fontSize: 15 }}>{name}</h4>
        <p style={{ color: "#8b5cf6", margin: "4px 0 0", fontWeight: 700 }}>{price}</p>
      </div>
    </div>
  );
}

function App() {
  const [sidebarWidth, setSidebarWidth] = React.useState(300);
  const products = [
    { name: "Wireless Headphones", price: "$129", image: "🎧" },
    { name: "Mechanical Keyboard", price: "$89", image: "⌨️" },
    { name: "USB-C Hub", price: "$49", image: "🔌" },
    { name: "LED Monitor", price: "$349", image: "🖥️" },
  ];

  // Simulate container query behavior
  const cols = sidebarWidth > 400 ? 2 : 1;

  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui" }}>
      <h3 style={{ color: "white", margin: "0 0 8px", fontSize: 18 }}>Container Queries Concept</h3>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 16px" }}>
        Drag the slider to resize the container — cards adapt to their parent, not the viewport!
      </p>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#cbd5e1", fontSize: 13, display: "flex", alignItems: "center", gap: 12 }}>
          Container width: {sidebarWidth}px
          <input type="range" min={200} max={600} value={sidebarWidth} onChange={e => setSidebarWidth(+e.target.value)} style={{ flex: 1 }} />
        </label>
      </div>
      <div style={{ width: sidebarWidth, maxWidth: "100%", border: "2px dashed rgba(139,92,246,0.3)", borderRadius: 12, padding: 16, transition: "width 0.2s" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", marginBottom: 12, fontFamily: "monospace" }}>
          @container (min-width: 400px) → {cols} columns
        </div>
        <div style={{ display: "grid", gridTemplateColumns: \`repeat(\${cols}, 1fr)\`, gap: 12, transition: "all 0.3s" }}>
          {products.map(p => <ProductCard key={p.name} {...p} />)}
        </div>
      </div>
      <pre style={{ marginTop: 16, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "#94a3b8", fontSize: 12, overflow: "auto" }}>
{".card-container { container-type: inline-size; }\\n\\n@container (min-width: 400px) {\\n  .card-grid {\\n    grid-template-columns: 1fr 1fr;\\n  }\\n}"}
      </pre>
    </div>
  );
}
export default App;`;

const treeShakingCode = `// Tree Shaking Demo: Only import what you use!
// Compare bundle sizes between approaches

function ModuleBox({ name, size, used, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: used ? color + "15" : "rgba(255,255,255,0.02)", border: "1px solid " + (used ? color + "40" : "rgba(255,255,255,0.06)"), borderRadius: 8, opacity: used ? 1 : 0.4, transition: "all 0.3s" }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: used ? color : "#374151" }} />
      <span style={{ color: used ? "white" : "#6b7280", fontSize: 14, flex: 1 }}>{name}</span>
      <span style={{ color: used ? color : "#4b5563", fontSize: 12, fontFamily: "monospace" }}>{size}</span>
      {!used && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>REMOVED</span>}
    </div>
  );
}

function App() {
  const [treeShake, setTreeShake] = React.useState(false);
  const modules = [
    { name: "formatDate()", size: "2.1 KB", used: true, color: "#8b5cf6" },
    { name: "formatCurrency()", size: "1.8 KB", used: true, color: "#06b6d4" },
    { name: "parseCSV()", size: "15.2 KB", used: false, color: "#ef4444" },
    { name: "generatePDF()", size: "45.6 KB", used: false, color: "#ef4444" },
    { name: "validateEmail()", size: "0.9 KB", used: true, color: "#10b981" },
    { name: "compressImage()", size: "32.4 KB", used: false, color: "#ef4444" },
  ];

  const totalSize = modules.reduce((sum, m) => sum + parseFloat(m.size), 0).toFixed(1);
  const usedSize = modules.filter(m => m.used).reduce((sum, m) => sum + parseFloat(m.size), 0).toFixed(1);
  const savedPct = Math.round((1 - parseFloat(usedSize) / parseFloat(totalSize)) * 100);

  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui" }}>
      <h3 style={{ color: "white", margin: "0 0 16px", fontSize: 18 }}>Tree Shaking Visualization</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTreeShake(false)} style={{ padding: "8px 16px", background: !treeShake ? "#ef4444" : "rgba(255,255,255,0.05)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Without Tree Shaking ({totalSize} KB)
        </button>
        <button onClick={() => setTreeShake(true)} style={{ padding: "8px 16px", background: treeShake ? "#10b981" : "rgba(255,255,255,0.05)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          With Tree Shaking ({usedSize} KB)
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {modules.map(m => (
          <ModuleBox key={m.name} {...m} used={treeShake ? m.used : true} />
        ))}
      </div>
      {treeShake && (
        <div style={{ marginTop: 16, padding: 14, background: "rgba(16,185,129,0.08)", borderRadius: 10, color: "#6ee7b7", fontSize: 14 }}>
          🌳 Saved {savedPct}% bundle size by removing unused exports! ({(parseFloat(totalSize) - parseFloat(usedSize)).toFixed(1)} KB eliminated)
        </div>
      )}
      <pre style={{ marginTop: 16, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "#94a3b8", fontSize: 12 }}>
{treeShake
  ? '// ✅ Named imports — bundler removes unused code\nimport { formatDate, formatCurrency, validateEmail } from "./utils";\n\n// package.json\n{ "sideEffects": false }'
  : '// ❌ Importing everything — entire module included\nimport * as utils from "./utils";\n// All 98 KB shipped to the browser!'}
      </pre>
    </div>
  );
}
export default App;`;

const gridFlexboxCode = `// Grid vs Flexbox: Interactive Layout Playground
// Toggle between Grid and Flexbox to see the difference!

function App() {
  const [mode, setMode] = React.useState("grid");
  const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
  const items = ["Header", "Sidebar", "Main Content", "Widget A", "Widget B", "Footer"];

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "200px 1fr 1fr",
    gridTemplateRows: "60px 1fr 1fr 50px",
    gridTemplateAreas: '"header header header" "sidebar main main" "sidebar widgetA widgetB" "footer footer footer"',
    gap: 8,
    height: 340,
  };

  const areas = ["header", "sidebar", "main", "widgetA", "widgetB", "footer"];

  const flexStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    height: 340,
  };

  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui" }}>
      <h3 style={{ color: "white", margin: "0 0 16px", fontSize: 18 }}>Layout Patterns Playground</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("grid")} style={{ padding: "8px 18px", background: mode === "grid" ? "#8b5cf6" : "rgba(255,255,255,0.05)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>CSS Grid (2D)</button>
        <button onClick={() => setMode("flex")} style={{ padding: "8px 18px", background: mode === "flex" ? "#06b6d4" : "rgba(255,255,255,0.05)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Flexbox (1D)</button>
      </div>
      <div style={mode === "grid" ? gridStyle : flexStyle}>
        {items.map((item, i) => (
          <div key={item} style={{
            background: colors[i] + "20",
            border: "1px solid " + colors[i] + "50",
            borderRadius: 10,
            padding: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
            fontSize: 14,
            ...(mode === "grid" ? { gridArea: areas[i] } : { flex: i === 2 ? "1 1 100%" : "1 1 calc(33% - 6px)", minHeight: i === 0 ? 60 : "auto" }),
          }}>
            {item}
          </div>
        ))}
      </div>
      <pre style={{ marginTop: 16, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "#94a3b8", fontSize: 12, overflow: "auto" }}>
{mode === "grid"
  ? 'display: grid;\\ngrid-template-columns: 200px 1fr 1fr;\\ngrid-template-areas:\\n  "header  header  header"\\n  "sidebar main    main"\\n  "sidebar widgetA widgetB"\\n  "footer  footer  footer";'
  : 'display: flex;\\nflex-wrap: wrap;\\n/* Flexbox is great for 1D layouts */\\n/* Use flex-basis for sizing */'}
      </pre>
    </div>
  );
}
export default App;`;

const bemCssModulesCode = `// BEM vs CSS Modules: Naming & Scoping
// See how each approach prevents style conflicts

function BEMExample() {
  return (
    <div>
      <h4 style={{ color: "#f59e0b", fontSize: 13, marginBottom: 10 }}>BEM Naming Convention</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { cls: ".card", desc: "Block", color: "#8b5cf6" },
          { cls: ".card__title", desc: "Element", color: "#06b6d4" },
          { cls: ".card__title--highlighted", desc: "Modifier", color: "#ec4899" },
          { cls: ".card__image", desc: "Element", color: "#06b6d4" },
          { cls: ".card--featured", desc: "Modifier", color: "#ec4899" },
        ].map(({ cls, desc, color }) => (
          <div key={cls} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: color + "10", borderRadius: 6, border: "1px solid " + color + "30" }}>
            <code style={{ color, fontFamily: "monospace", fontSize: 13, flex: 1 }}>{cls}</code>
            <span style={{ color: "#94a3b8", fontSize: 12, background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 4 }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CSSModulesExample() {
  // Simulate CSS Modules hash
  const hash = () => "_" + Math.random().toString(36).slice(2, 8);
  const classes = React.useMemo(() => ({
    card: "card" + hash(),
    title: "card_title" + hash(),
    image: "card_image" + hash(),
  }), []);

  return (
    <div>
      <h4 style={{ color: "#10b981", fontSize: 13, marginBottom: 10 }}>CSS Modules (Auto-scoped)</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {Object.entries(classes).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: "rgba(16,185,129,0.08)", borderRadius: 6, border: "1px solid rgba(16,185,129,0.2)" }}>
            <code style={{ color: "#6ee7b7", fontFamily: "monospace", fontSize: 13 }}>styles.{key}</code>
            <span style={{ color: "#6b7280" }}>→</span>
            <code style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 12 }}>.{val}</code>
            <span style={{ fontSize: 11, color: "#10b981", marginLeft: "auto" }}>unique!</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: 24, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: 24 }}>
      <h3 style={{ color: "white", margin: 0, fontSize: 18 }}>CSS Scoping Strategies</h3>
      <BEMExample />
      <CSSModulesExample />
      <div style={{ padding: 14, background: "rgba(139,92,246,0.08)", borderRadius: 10, color: "#c4b5fd", fontSize: 13, lineHeight: 1.7 }}>
        <strong>Best Practice:</strong> Use BEM for organizational clarity + CSS Modules for automatic scoping. Together they provide naming conventions AND guaranteed uniqueness.
      </div>
    </div>
  );
}
export default App;`;

const designSystemCode = `// Design System: Token-Based Component Library
// A mini design system with tokens and composed components

const tokens = {
  colors: {
    primary: { 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
    success: "#10b981", warning: "#f59e0b", error: "#ef4444",
    gray: { 50: "#f9fafb", 100: "#f3f4f6", 500: "#6b7280", 800: "#1f2937", 900: "#111827" },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, full: 9999 },
  fontSize: { xs: 11, sm: 13, md: 15, lg: 18, xl: 24 },
};

function Badge({ children, variant = "default" }) {
  const variants = {
    default: { bg: "rgba(139,92,246,0.15)", color: "#c4b5fd", border: "rgba(139,92,246,0.3)" },
    success: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
    warning: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "rgba(245,158,11,0.3)" },
    error: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
  };
  const v = variants[variant];
  return (
    <span style={{ display: "inline-flex", padding: "3px 10px", fontSize: tokens.fontSize.xs, fontWeight: 600, background: v.bg, color: v.color, border: "1px solid " + v.border, borderRadius: tokens.radius.full }}>
      {children}
    </span>
  );
}

function DSButton({ children, size = "md", variant = "primary", onClick }) {
  const sizes = { sm: { px: 12, py: 6, fs: 13 }, md: { px: 18, py: 10, fs: 14 }, lg: { px: 24, py: 14, fs: 16 } };
  const s = sizes[size];
  const isPrimary = variant === "primary";
  return (
    <button onClick={onClick} style={{ padding: s.py + "px " + s.px + "px", fontSize: s.fs, fontWeight: 600, background: isPrimary ? tokens.colors.primary[500] : "transparent", color: "white", border: isPrimary ? "none" : "2px solid " + tokens.colors.primary[500], borderRadius: tokens.radius.md, cursor: "pointer", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function CardDS({ title, description, badges = [], children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: tokens.radius.lg, padding: tokens.spacing.lg, display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {badges.map(b => <Badge key={b.text} variant={b.variant}>{b.text}</Badge>)}
      </div>
      <h3 style={{ color: "white", margin: 0, fontSize: tokens.fontSize.lg }}>{title}</h3>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: tokens.fontSize.sm, lineHeight: 1.6 }}>{description}</p>
      {children}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: tokens.spacing.lg, background: "#0f172a", minHeight: "100%", fontFamily: "system-ui", display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
      <h2 style={{ color: "white", margin: 0, fontSize: tokens.fontSize.xl }}>Design System Tokens</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <DSButton size="sm">Small</DSButton>
        <DSButton size="md">Medium</DSButton>
        <DSButton size="lg">Large</DSButton>
        <DSButton variant="outline">Outline</DSButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <CardDS title="Component Library" description="Reusable components built on design tokens. Consistent spacing, colors, and typography." badges={[{ text: "Production", variant: "success" }, { text: "v2.0", variant: "default" }]}>
          <DSButton size="sm">Learn More</DSButton>
        </CardDS>
        <CardDS title="Storybook Docs" description="Document every component variant and state. Interactive playground for designers and developers." badges={[{ text: "Essential", variant: "warning" }]}>
          <DSButton size="sm" variant="outline">Open Storybook</DSButton>
        </CardDS>
      </div>
    </div>
  );
}
export default App;`;

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function FrontendDesignPatterns2026Page() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("frontend-design-patterns-2026", language);
  const category = getCategoryForPost("frontend-design-patterns-2026");

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
            {postContent?.breadcrumbLabel || "Frontend Patterns 2026"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || "Frontend Design Patterns That Actually Work in 2026"}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || "Master the most effective frontend design patterns for 2026. From component-driven development to AI-powered workflows, these patterns define the future of frontend web design. Every pattern includes executable code examples you can run and modify."}
        </Text>
        {postContent?.categoriesDescription && (
          <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
            <Text className={styles.infoText}>{postContent.categoriesDescription}</Text>
          </div>
        )}
      </div>

      {/* ══════════════ SECTION 1: ATOMIC DESIGN ══════════════ */}
      <section id="atomic-design" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🧬"} 1. Component-Driven Development with Atomic Design
            </Heading>
            <Text className={styles.sectionDescription}>
              The Atomic Design methodology by Brad Frost breaks interfaces into five levels: atoms, molecules, organisms, templates, and pages. Airbnb&apos;s adoption of this approach cut design-to-development handoff time by 35% and improved design consistency by 20%.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Atomic Design Levels:</strong>
                <br />• <strong>Atoms:</strong> Buttons, inputs, labels — cannot be broken down further
                <br />• <strong>Molecules:</strong> Search forms, nav items — functional groups of atoms
                <br />• <strong>Organisms:</strong> Headers, product cards — complex distinct sections
                <br />• <strong>Templates:</strong> Page layouts — arrange organisms into structure
                <br />• <strong>Pages:</strong> Templates with real content
              </Text>
            </div>

            <AnimatedSection>
              <AtomicDesignDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Build Atoms → Molecules → Organisms</Heading>
            <Text className="text-white/80 text-sm mb-3">Run this example to see how small atoms compose into molecules and then full organisms:</Text>
            <CodeEditor
              code={atomicDesignCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={600}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 2: STATE MANAGEMENT ══════════════ */}
      <section id="state-management-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"⚡"} 2. State Management: Signals vs Context API
            </Heading>
            <Text className={styles.sectionDescription}>
              State management has evolved beyond traditional approaches. The Context API shares values through component trees but re-renders all consumers on any change. Signals introduce fine-grained reactivity where only specific subscribers update. Run both examples and compare the render counts!
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Key Insight:</strong> Context API re-renders ALL consumers when any value changes. Signals only re-render the specific subscriber that reads the changed value. Choose based on your app&apos;s complexity.
              </Text>
            </div>

            <CodeComparison
              comparisonId="signals-vs-context"
              language="tsx"
              whatToNoticeBad={[
                "Every context value change re-renders ALL consumers, even StatusBar.",
                "No way to subscribe to just one part of the context value.",
              ]}
              whatToNoticeGood={[
                "Each signal has independent subscribers — StatusBar never re-renders.",
                "Fine-grained: only the component that reads the signal updates.",
              ]}
              wrong={contextApiCode}
              good={signalsCode}
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 3: LAYOUT PATTERNS ══════════════ */}
      <section id="layout-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"📐"} 3. Layout Patterns: Grid Systems and Flexbox
            </Heading>
            <Text className={styles.sectionDescription}>
              Flexbox excels in one-dimensional layouts (row or column). Grid handles two-dimensional layouts (rows and columns simultaneously). Modern implementations mix both — Grid for page structure, Flexbox for component-level layouts.
            </Text>

            <AnimatedSection>
              <GridFlexboxDiagram />
            </AnimatedSection>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Switch Between Grid and Flexbox</Heading>
            <CodeEditor
              code={gridFlexboxCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 4: DARK MODE ══════════════ */}
      <section id="dark-mode-theming" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🌗"} 4. Dark Mode and Theming with CSS Variables
            </Heading>
            <Text className={styles.sectionDescription}>
              Dark mode is standard practice in 2026. CSS custom properties (variables) make theme switching straightforward. Define color tokens in :root, override them with a data attribute, and toggle with JavaScript. The approach also supports prefers-color-scheme for system preferences.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Toggle Dark/Light Theme</Heading>
            <Text className="text-white/80 text-sm mb-3">Click the toggle button to see CSS variables update in real time:</Text>
            <CodeEditor
              code={darkModeCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 5: PROGRESSIVE DISCLOSURE ══════════════ */}
      <section id="progressive-disclosure" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"📂"} 5. Progressive Disclosure for Complex Interfaces
            </Heading>
            <Text className={styles.sectionDescription}>
              Progressive disclosure shows essential information first and reveals advanced features on demand. This reduces cognitive load for novice users while keeping power features accessible. Accordions, tabs, and modals are the primary implementation patterns.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                {"📊"} <strong>Impact:</strong> Companies using progressive disclosure report fewer style-related bugs and faster feature updates. Cognitive load reduction of up to 40%.
              </Text>
            </div>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Accordion & Tabs</Heading>
            <CodeEditor
              code={progressiveDisclosureCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 6: CONTAINER QUERIES ══════════════ */}
      <section id="container-queries" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"📦"} 6. Fluid Layouts with Container Queries
            </Heading>
            <Text className={styles.sectionDescription}>
              Container queries respond to individual component sizes instead of the viewport. This is a major advancement over media queries for building truly reusable components. A card in a sidebar adapts differently than the same card in a main content area.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Container Queries vs Media Queries:</strong>
                <br />• <strong>Media Queries:</strong> Respond to viewport/screen width
                <br />• <strong>Container Queries:</strong> Respond to parent container dimensions
                <br />• <strong>Container Query Units:</strong> cqi, cqw, cqb for container-relative sizing
              </Text>
            </div>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Resize the Container</Heading>
            <Text className="text-white/80 text-sm mb-3">Drag the slider to resize the container and watch cards adapt to their parent — not the viewport:</Text>
            <CodeEditor
              code={containerQueryCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 7: RESPONSIVE TYPOGRAPHY ══════════════ */}
      <section id="responsive-typography" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔤"} 7. Viewport-Based Typography Scaling
            </Heading>
            <Text className={styles.sectionDescription}>
              The clamp() function lets you set minimum, preferred, and maximum font sizes for smooth scaling across screen sizes. Combining viewport units with rem units preserves zoom functionality while keeping text responsive.
            </Text>

            <CodeEditor
              code={`/* Fluid Typography with clamp() */

/* Heading: min 1.5rem, scales with viewport, max 3rem */
h1 {
  font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem);
  line-height: 1.2;
}

/* Body: min 1rem, scales gently, max 1.25rem */
p {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  line-height: 1.7;
}

/* Container Query units: scale based on container, not viewport */
.card-title {
  font-size: clamp(0.875rem, 3cqi, 1.5rem);
}

/* Complete fluid type scale */
:root {
  --step--2: clamp(0.69rem, 0.66rem + 0.18vw, 0.80rem);
  --step--1: clamp(0.83rem, 0.78rem + 0.29vw, 1.00rem);
  --step-0:  clamp(1.00rem, 0.91rem + 0.43vw, 1.25rem);
  --step-1:  clamp(1.20rem, 1.07rem + 0.63vw, 1.56rem);
  --step-2:  clamp(1.44rem, 1.26rem + 0.89vw, 1.95rem);
  --step-3:  clamp(1.73rem, 1.48rem + 1.24vw, 2.44rem);
  --step-4:  clamp(2.07rem, 1.73rem + 1.70vw, 3.05rem);
}

/* Usage */
.text-sm  { font-size: var(--step--1); }
.text-base { font-size: var(--step-0); }
.text-lg  { font-size: var(--step-1); }
.text-xl  { font-size: var(--step-2); }
.text-2xl { font-size: var(--step-3); }
.text-3xl { font-size: var(--step-4); }`}
              language="css"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              enableMultiFile
              height="auto"
            />

            <div className={styles.tipLine}>
              <span className={styles.tipLineIcon}>{"💡"}</span>
              <span className={styles.tipLineText}>
                <strong>Accessibility tip:</strong> Pure viewport units (vw) can override user zoom preferences. Always combine them with rem units: <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>clamp(1rem, 0.95rem + 0.25vw, 1.25rem)</code> ensures zoom still works.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 8: TOUCH UX ══════════════ */}
      <section id="touch-optimized-ux" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"👆"} 8. Touch-Optimized Interactions for Mobile UX
            </Heading>
            <Text className={styles.sectionDescription}>
              75% of users navigate with their thumbs. Touch targets need to be at least 44-48dp (about 9mm). Placing primary actions in natural thumb zones cuts interaction errors by 37%.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Touch Target Guidelines:</strong>
                <br />• Minimum size: 44-48dp (about 9mm regardless of screen size)
                <br />• Corners: 12mm targets; Center: 7mm targets
                <br />• Spacing: Enough gap between interactive elements to prevent mis-taps
                <br />• Feedback: Visual, sound, or haptic feedback on touch interactions
              </Text>
            </div>

            <CodeEditor
              code={`/* Touch-Optimized CSS */

/* Minimum touch target size */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Expand small icons to meet minimum target size */
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}
.icon-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}

/* Safe thumb zone placement */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px env(safe-area-inset-bottom);
  display: flex;
  justify-content: space-around;
}

/* Prevent accidental taps with spacing */
.button-group {
  display: flex;
  gap: 12px; /* minimum 8px between touch targets */
}

/* Touch feedback */
.interactive {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: transform 0.1s ease;
}
.interactive:active {
  transform: scale(0.97);
}`}
              language="css"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              enableMultiFile
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 9: DESIGN SYSTEMS ══════════════ */}
      <section id="design-systems" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎨"} 9. Reusable Design Systems and Component Libraries
            </Heading>
            <Text className={styles.sectionDescription}>
              Design systems create a shared language between designers and developers. Design tokens (colors, spacing, typography) form the foundation. Components are built on these tokens, ensuring consistency. Storybook documents each component variant.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>Design System Layers:</strong> Tokens (foundation) → Components (built on tokens) → Patterns (compositions) → Documentation (Storybook)
              </Text>
            </div>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Token-Based Component Library</Heading>
            <CodeEditor
              code={designSystemCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 10: ACCESSIBILITY ══════════════ */}
      <section id="accessibility-first" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"♿"} 10. Accessibility-First Components with ARIA
            </Heading>
            <Text className={styles.sectionDescription}>
              The first rule of ARIA: if you can use native HTML elements with built-in semantics, do so. Custom components need proper ARIA roles, states, and properties. Test against four principles: perceivable, operable, understandable, and robust.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>WCAG Principles (POUR):</strong> Perceivable • Operable • Understandable • Robust — every component must pass all four.
              </Text>
            </div>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: ARIA Progress Bar, Focus-Visible Buttons, Alert Banners</Heading>
            <Text className="text-white/80 text-sm mb-3">Tab through the buttons to see focus rings. Click +10% to update the progress bar with proper ARIA attributes:</Text>
            <CodeEditor
              code={accessibilityCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 11: AI WORKFLOWS ══════════════ */}
      <section id="ai-enhanced-workflows" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🤖"} 11. AI-Enhanced Frontend Design Workflows
            </Heading>
            <Text className={styles.sectionDescription}>
              AI reshapes every stage of frontend development — from design-to-code generation reducing implementation time by up to 80%, to automated accessibility testing catching 60-80% more compliance issues.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-4`}>
              <Text className={styles.infoText}>
                <strong>AI in Frontend Development:</strong>
                <br />• <strong>Layout Suggestions:</strong> Figma Make and UX Pilot generate layouts from prompts
                <br />• <strong>Code Generation:</strong> GPT plugins transform Figma designs into HTML/CSS/JS
                <br />• <strong>Accessibility Testing:</strong> Context-aware detection, image recognition for alt text, NLP for heading structure
                <br />• <strong>Key Insight:</strong> AI augments human creativity, not replaces it — designers set the rules, AI accelerates execution
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-4`}>
              <Text className={styles.infoText}>
                {"📊"} <strong>Results:</strong> Teams using AI accessibility tools see 60-80% drop in missed compliance issues. Concept-to-implementation time reduced by up to 80%.
              </Text>
            </div>

            <CodeEditor
              code={`// AI-Assisted Component Generation Pattern
// This shows the workflow of AI-to-code in modern frontend

// Step 1: Designer creates component in Figma
// Step 2: AI plugin analyzes visual elements
// Step 3: Generated code (like this):

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  rating: number;
  onAddToCart: () => void;
}

// AI-generated component with proper:
// ✅ TypeScript types
// ✅ Semantic HTML
// ✅ ARIA attributes
// ✅ Responsive design
// ✅ Design token usage
function ProductCard({ title, price, image, rating, onAddToCart }: ProductCardProps) {
  return (
    <article
      className="product-card"
      role="listitem"
      aria-label={\`\${title} - \$\${price}\`}
    >
      <img
        src={image}
        alt={\`Product photo of \${title}\`}
        loading="lazy"
        className="product-card__image"
      />
      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        <div
          role="img"
          aria-label={\`Rating: \${rating} out of 5 stars\`}
          className="product-card__rating"
        >
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
        <p className="product-card__price">
          {\`$\${price.toFixed(2)}\`}
        </p>
        <button
          onClick={onAddToCart}
          className="product-card__cta"
          aria-label={\`Add \${title} to cart\`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

// Step 4: Developer reviews, connects to backend
// Step 5: AI runs accessibility audit
// Step 6: Ship to production!`}
              language="typescript"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              enableMultiFile
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 12: LAZY LOADING ══════════════ */}
      <section id="lazy-loading" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"⚡"} 12. Lazy Loading and Code Splitting
            </Heading>
            <Text className={styles.sectionDescription}>
              React.lazy() delays component loading until needed, dramatically improving initial page load times. Combined with Suspense for fallback UI, this enables route-based code splitting that breaks apps into smaller chunks loaded on demand.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Route-Based Code Splitting</Heading>
            <Text className="text-white/80 text-sm mb-3">Click different routes to see lazy-loaded components with loading states:</Text>
            <CodeEditor
              code={lazyLoadingCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 13: BEM & CSS MODULES ══════════════ */}
      <section id="css-scoping" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎯"} 13. CSS Scoping with BEM and CSS Modules
            </Heading>
            <Text className={styles.sectionDescription}>
              BEM (Block, Element, Modifier) creates clear naming conventions for UI elements. CSS Modules automatically generate unique class names to prevent conflicts. Together they provide organizational clarity and guaranteed style isolation.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: BEM vs CSS Modules</Heading>
            <CodeEditor
              code={bemCssModulesCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 14: VIRTUAL DOM ══════════════ */}
      <section id="virtual-dom" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🔄"} 14. Optimizing Render Paths with Virtual DOM Diffing
            </Heading>
            <Text className={styles.sectionDescription}>
              The Virtual DOM acts as a lightweight copy of the real DOM. React compares previous and new virtual trees through &quot;reconciliation,&quot; computing the minimal set of changes needed. Only the changed nodes get patched in the real DOM, minimizing expensive browser operations.
            </Text>

            <AnimatedSection>
              <VirtualDomDiagram />
            </AnimatedSection>

            <CodeEditor
              code={`// Virtual DOM Reconciliation — How React optimizes updates

// 1. State changes trigger a new Virtual DOM tree
function Counter() {
  const [count, setCount] = React.useState(0);

  // When setCount is called:
  // React creates a NEW virtual DOM tree
  // Diffs it against the PREVIOUS virtual DOM tree
  // Only patches the text node "Count: 0" → "Count: 1"

  return (
    <div>              {/* ← Same type, reuse DOM node */}
      <h1>Counter</h1> {/* ← Same type + props, skip */}
      <p>Count: {count}</p> {/* ← Text changed, patch this node */}
      <button onClick={() => setCount(c => c + 1)}>
        Increment         {/* ← Same, skip */}
      </button>
    </div>
  );
}

// 2. Keys help React identify list items efficiently
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        // ✅ Stable key = React reorders DOM nodes, doesn't recreate
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

// 3. React Compiler (React 19+) adds optimization hints
// Patch flags tell React exactly what changed:
// - TEXT_CHILDREN: only text content changed
// - CLASS: only className changed
// - STYLE: only style changed
// This skips unnecessary comparisons during diffing`}
              language="tsx"
              readOnly={true}
              disableLinting={true}
              collapsePanelsByDefault={true}
              compactToolbar={true}
              enableMultiFile
              height="auto"
            />
          </Stack>
        </Card>
      </section>

      {/* ══════════════ SECTION 15: TREE SHAKING ══════════════ */}
      <section id="tree-shaking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🌳"} 15. Reducing Bundle Size with Tree Shaking
            </Heading>
            <Text className={styles.sectionDescription}>
              Tree shaking removes unused code during bundling by analyzing ES module imports. Mark files as side-effect-free in package.json so bundlers can safely eliminate dead code. Named imports enable the bundler to trace exactly what&apos;s used.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Interactive: Tree Shaking Visualization</Heading>
            <Text className="text-white/80 text-sm mb-3">Toggle tree shaking to see how unused exports are eliminated from the bundle:</Text>
            <CodeEditor
              code={treeShakingCode}
              language="tsx"
              readOnly={false}
              disableLinting={true}
              collapsePanelsByDefault={false}
              compactToolbar={true}
              enableMultiFile
              maxCodeHeight={500}
              height="auto"
            />
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
              Frontend design patterns have evolved significantly for 2026. Component-driven development with Atomic Design provides the architectural foundation. State management now offers fine-grained options with Signals alongside Context API. Container queries enable truly context-aware responsive components. AI augments every stage of the workflow without replacing human creativity.
            </Text>
            <Text className={styles.sectionDescription}>
              Performance optimization through lazy loading, code splitting, and tree shaking ensures fast user experiences. Accessibility-first development with proper ARIA roles creates inclusive digital products. These patterns balance innovation with fundamentals — user-centered design, accessibility, and performance remain the guiding principles.
            </Text>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-4`}>
              <Text className={styles.infoText}>
                <strong>Key Takeaways:</strong>
                <br />• Atomic Design reduces development time by up to 35%
                <br />• Container queries create truly reusable components
                <br />• AI reduces concept-to-implementation time by up to 80%
                <br />• Lazy loading + code splitting dramatically improve initial load times
                <br />• Accessibility-first ensures inclusive experiences for all users
                <br />• Tree shaking can eliminate 50%+ of unused bundle code
              </Text>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}
