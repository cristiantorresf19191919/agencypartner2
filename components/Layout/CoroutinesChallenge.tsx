"use client";

import React, { useCallback, useState } from "react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import styles from "./CoroutinesChallenge.module.css";

interface CoroutinesChallengeProps {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hint?: string;
  solution?: string;
}

const PISTON_EXECUTE_URL = "/api/execute-code";

function normalize(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

export function CoroutinesChallenge({
  id,
  title,
  description,
  starterCode,
  expectedOutput,
  hint,
  solution,
}: CoroutinesChallengeProps) {
  const [code, setCode] = useState(starterCode);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; logs: string[]; error?: string } | null>(null);

  const runAndVerify = useCallback(async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "kotlin",
          version: "*",
          files: [{ name: "Main.kt", content: code }],
          stdin: "",
        }),
      });
      const data: { run?: { stdout?: string; stderr?: string }; message?: string } = await res.json();
      const stdout = data?.run?.stdout ?? "";
      const stderr = data?.run?.stderr ?? "";
      const logs = stdout ? stdout.split("\n") : [];
      const matched = normalize(stdout) === normalize(expectedOutput);
      setResult({
        ok: matched && !stderr,
        logs,
        error: stderr || (!matched ? `Expected:\n${expectedOutput}` : undefined),
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setResult({ ok: false, logs: [], error: message });
    } finally {
      setBusy(false);
    }
  }, [code, expectedOutput]);

  const reset = useCallback(() => {
    setCode(starterCode);
    setResult(null);
    setSolutionOpen(false);
  }, [starterCode]);

  return (
    <section className={styles.card} id={`challenge-${id}`}>
      <header className={styles.head}>
        <span className={styles.badge}>Challenge</span>
        <h4 className={styles.title}>{title}</h4>
      </header>
      <p className={styles.desc}>{description}</p>
      <div className={styles.editorWrap}>
        <CodeEditor
          code={code}
          onChange={setCode}
          language="kotlin"
          height="auto"
          maxCodeHeight={420}
          compactToolbar
          collapsePanelsByDefault
        />
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.runBtn}
          onClick={runAndVerify}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Running…" : "Run & verify"}
        </button>
        <button type="button" className={styles.ghostBtn} onClick={reset} disabled={busy}>
          Reset
        </button>
        {hint ? (
          <button type="button" className={styles.ghostBtn} onClick={() => setHintOpen((v) => !v)}>
            {hintOpen ? "Hide hint" : "Hint"}
          </button>
        ) : null}
        {solution ? (
          <button type="button" className={styles.ghostBtn} onClick={() => setSolutionOpen((v) => !v)}>
            {solutionOpen ? "Hide solution" : "Solution"}
          </button>
        ) : null}
        <span className={styles.expected}>
          Expected: <code>{expectedOutput.split("\n").join(" ⏎ ")}</code>
        </span>
      </div>
      {hintOpen && hint ? <p className={styles.hint}>💡 {hint}</p> : null}
      {solutionOpen && solution ? (
        <pre className={styles.solution}>{solution}</pre>
      ) : null}
      {result ? (
        <div className={result.ok ? styles.resultOk : styles.resultFail}>
          {result.ok ? (
            <>
              <strong>✓ Passed</strong>
              <pre className={styles.resultLog}>{result.logs.join("\n")}</pre>
            </>
          ) : (
            <>
              <strong>✗ Not yet</strong>
              {result.logs.length ? <pre className={styles.resultLog}>{result.logs.join("\n")}</pre> : null}
              {result.error ? <pre className={styles.resultErr}>{result.error}</pre> : null}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default CoroutinesChallenge;
