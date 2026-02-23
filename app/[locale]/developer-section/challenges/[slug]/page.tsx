"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as ts from "typescript";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  Terminal as TerminalIcon,
  CheckCircle as CheckIcon,
  IntegrationInstructions as KotlinIcon,
  Code as TsIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getChallengeById } from "@/lib/challengesData";
import confetti from "canvas-confetti";
import styles from "../ChallengesPage.module.css";
import playStyles from "./ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";

const PISTON_EXECUTE_URL = "/api/execute-code";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => {
    // We can't use t() here since it's outside the component, so we'll use a default message
    // The actual translation will be handled in the component if needed
    return (
      <div className={playStyles.editorLoading}>
        <div className={playStyles.loadingSpinner} />
        <p>Loading editor…</p>
      </div>
    );
  },
});

const formatValue = (v: unknown): string => {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v); } catch { return String(v); }
};

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

export default function ChallengePlayPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const challenge = getChallengeById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [lang, setLang] = useState<"typescript" | "kotlin">("typescript");
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [kotlinPhase, setKotlinPhase] = useState<"idle" | "sending" | "compiling" | "running">("idle");
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const starter = challenge?.starterCode[lang] ?? "";
  const ext = lang === "typescript" ? "ts" : "kt";
  const uri = `file:///challenge.${ext}`;

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode[lang]);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
    }
  }, [challenge?.id, lang]);

  const resetToStarter = useCallback(() => {
    if (challenge) {
      setCode(challenge.starterCode[lang]);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(challenge.starterCode[lang]);
      }
    }
  }, [challenge, lang, uri]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) return model.getValue();
    }
    return code;
  }, [code, uri]);

  // --- TypeScript runner (readline + console.log capture) ---
  const runTS = useCallback(async (source: string, input: string): Promise<{ logs: string[]; err?: string }> => {
    const logs: string[] = [];
    const append = (x: string) => { logs.push(x); };
    let js: string;
    try {
      const r = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES2020 },
        fileName: "main.ts",
      });
      const errs = (r.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
      if (errs.length > 0) {
        return { logs, err: ts.flattenDiagnosticMessageText(errs[0].messageText, "\n") };
      }
      js = r.outputText;
    } catch (e) {
      return { logs, err: (e instanceof Error ? e.message : String(e)) };
    }
    const pre = `var __input=(__inputStr||"").split("\\n"); var __line=0; function readline(){ return __input[__line++]||""; }`;
    const body = `"use strict";\n${pre}\n${js}`;
    const AsyncFn = Object.getPrototypeOf(async function () { }).constructor as typeof Function;
    const fn = new AsyncFn("__inputStr", "console", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "Date", "Math", "JSON", body);
    const con = { log: (...a: unknown[]) => append(a.length === 1 ? formatValue(a[0]) : a.map(formatValue).join(" ")), warn: (...a: unknown[]) => append("⚠️ " + a.map(formatValue).join(" ")), error: (...a: unknown[]) => append("❌ " + a.map(formatValue).join(" ")) };
    try {
      await fn(input, con, setTimeout, setInterval, clearTimeout, clearInterval, Date, Math, JSON);
    } catch (e) {
      return { logs, err: (e instanceof Error ? e.message : String(e)) };
    }
    return { logs };
  }, []);

  // --- Kotlin runner (Piston) - auto-wraps code in fun main() if needed ---
  const runKotlin = useCallback(async (source: string, input: string, showPhases = true): Promise<{ stdout: string; err?: string }> => {
    // Check if code already has a main function
    const hasMainFn = /fun\s+main\s*\(/.test(source);
    // Wrap code in main function if it doesn't have one
    const wrappedSource = hasMainFn ? source : `fun main() {\n${source}\n}`;

    if (showPhases) setKotlinPhase("sending");

    const res = await fetch(PISTON_EXECUTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "kotlin", version: "*", files: [{ name: "Main.kt", content: wrappedSource }], stdin: input, args: [] }),
    });

    if (!res.ok) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: `HTTP ${res.status}` };
    }

    if (showPhases) setKotlinPhase("compiling");
    // Small delay to show compiling phase
    await new Promise(r => setTimeout(r, 300));

    const d = (await res.json()) as { compile?: { stderr?: string; code?: number }; run?: { stdout?: string; stderr?: string; code?: number }; message?: string };

    if (d.message) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: d.message };
    }
    if (d.compile && d.compile.code !== 0) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: (d.compile.stderr || "Compilation failed").trim() };
    }

    if (showPhases) setKotlinPhase("running");
    // Small delay to show running phase
    await new Promise(r => setTimeout(r, 200));

    const run = d.run ?? {};
    if (showPhases) setKotlinPhase("idle");

    if (run.code !== 0 && run.stderr) return { stdout: (run.stdout || "").trim(), err: run.stderr.trim() };
    return { stdout: (run.stdout || "").trim() };
  }, []);

  const runCode = useCallback(async () => {
    if (!challenge) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const src = getEditorCode();
    const input = challenge.sampleInput;

    if (lang === "typescript") {
      const { logs: L, err } = await runTS(src, input);
      setLogs(L);
      if (err) setError(err);
    } else {
      const { stdout, err } = await runKotlin(src, input, true);
      setLogs(stdout ? stdout.split("\n") : []);
      if (err) setError(err);
    }
    setIsRunning(false);
  }, [challenge, lang, getEditorCode, runTS, runKotlin]);

  const submitCode = useCallback(async () => {
    if (!challenge || !challenge.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    const src = getEditorCode();
    let passed = 0;
    const total = challenge.testCases.length;

    for (const tc of challenge.testCases) {
      let actual = "";
      if (lang === "typescript") {
        const { logs: L, err } = await runTS(src, tc.input);
        if (err) { setError(`${t('challenge-test-failed')} ${err}`); break; }
        actual = L.join("\n");
      } else {
        const { stdout, err } = await runKotlin(src, tc.input, false);
        if (err) { setError(`${t('challenge-test-failed')} ${err}`); break; }
        actual = stdout;
      }
      if (normalizeOutput(actual) === normalizeOutput(tc.output)) passed++;
    }

    setSubmitResult({ passed, total, success: passed === total });
    if (passed === total) {
      setShowSuccess(true);
      try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch (_) { }
    }
    setIsSubmitting(false);
  }, [challenge, lang, getEditorCode, runTS, runKotlin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode]);

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    fontLigatures: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: lang === "kotlin" ? 4 : 2,
    formatOnPaste: true,
    formatOnType: true,
  }), [lang]);

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    if (lang === "typescript") {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        module: monaco.languages.typescript.ModuleKind.None,
        noEmit: true,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: false, noSyntaxValidation: false });
    }
  };

  if (!challenge) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t('challenge-not-found')}</p>
          <a href={createLocalizedPath("/developer-section/challenges/typescript-kotlin")}>{t('challenge-back')}</a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          {/* Left: description */}
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                {challenge.difficulty === 'Easy' ? t('challenge-difficulty-easy') : t('challenge-difficulty-medium')}
              </span>
              <span className={playStyles.pts}>{challenge.maxScore} {t('challenge-pts')}</span>
            </div>
            <h1 className={playStyles.descTitle}>{challenge.title}</h1>
            <p className={playStyles.descBody}>{challenge.description}</p>
            <h4 className={playStyles.descSub}>{t('challenge-input')}</h4>
            <p className={playStyles.descBody}>{challenge.inputFormat}</p>
            <h4 className={playStyles.descSub}>{t('challenge-output')}</h4>
            <p className={playStyles.descBody}>{challenge.outputFormat}</p>
            <h4 className={playStyles.descSub}>{t('challenge-sample')}</h4>
            <pre className={playStyles.sample}>{challenge.sampleInput}</pre>
            <h4 className={playStyles.descSub}>{t('challenge-expected')}</h4>
            <pre className={playStyles.sample}>{challenge.sampleOutput}</pre>
          </div>

          {/* Right: lang + editor + output */}
          <div className={playStyles.editorColumn}>
            <div className={playStyles.langTabs}>
              <button className={`${playStyles.tab} ${lang === "typescript" ? playStyles.activeTab : ""}`} onClick={() => setLang("typescript")}>
                <TsIcon fontSize="small" /> TypeScript
              </button>
              <button className={`${playStyles.tab} ${lang === "kotlin" ? playStyles.activeTab : ""}`} onClick={() => setLang("kotlin")}>
                <KotlinIcon fontSize="small" /> Kotlin
              </button>
            </div>

            <div className={`${playStyles.editorWrap} code-editor-contained`}>
              <MonacoEditor
                key={lang}
                height="100%"
                language={lang}
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.toolbar}>
              <button className={playStyles.iconBtn} onClick={resetToStarter} aria-label={t('challenge-reset')}> <ResetIcon fontSize="small" /> {t('challenge-reset')} </button>
              <button className={`${playStyles.runBtn} ${isRunning ? playStyles.disabled : ""}`} onClick={runCode} disabled={isRunning}> <PlayIcon fontSize="small" /> {t('challenge-run')} </button>
              <button className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`} onClick={submitCode} disabled={isSubmitting}> <CheckIcon fontSize="small" /> {t('challenge-submit')} </button>
            </div>

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                <TerminalIcon fontSize="small" /> {t('challenge-output-label')}
                {submitResult != null && (
                  <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                    {submitResult.passed}/{submitResult.total} {t('challenge-passed')}
                  </span>
                )}
              </div>
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div key="success" className={playStyles.successBanner} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <CheckIcon className={playStyles.successIcon} /> {t('challenge-completed')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Kotlin Loading Animation */}
              {lang === "kotlin" && kotlinPhase !== "idle" && (
                <motion.div
                  className={playStyles.kotlinLoading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={playStyles.kotlinLoadingIcon}>
                    <KotlinIcon className={playStyles.kotlinSpinIcon} />
                  </div>
                  <div className={playStyles.kotlinLoadingSteps}>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "sending" ? playStyles.active : playStyles.done}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t('kotlin-sending') || 'Sending to server'}</span>
                    </div>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "compiling" ? playStyles.active : kotlinPhase === "running" ? playStyles.done : ""}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t('kotlin-compiling') || 'Compiling Kotlin'}</span>
                    </div>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "running" ? playStyles.active : ""}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t('kotlin-running') || 'Running program'}</span>
                    </div>
                  </div>
                  <p className={playStyles.kotlinLoadingHint}>{t('kotlin-loading-hint') || 'Kotlin runs on a remote server, this may take a moment...'}</p>
                </motion.div>
              )}

              {error && <div className={playStyles.errorLine}>❌ {error}</div>}
              <div className={playStyles.logList}>
                {logs.length === 0 && !error && !submitResult && kotlinPhase === "idle" && <p className={playStyles.emptyLog}>{t('challenge-empty-output')}</p>}
                {logs.map((l, i) => <div key={i} className={playStyles.logLine}>{l}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges/typescript-kotlin")}>
            {t('challenge-back')}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t('challenges-back-hub')}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
