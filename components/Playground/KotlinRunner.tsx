"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./KotlinRunner.module.css";

declare global {
  interface Window {
    KotlinPlayground?: (element: HTMLElement, options?: Record<string, unknown>) => void;
  }
}

type KotlinRunnerProps = {
  code: string;
  title?: string;
  height?: number;
};

/**
 * Lightweight Kotlin playground wrapper that loads the official Kotlin Playground script
 * and renders an editable, runnable snippet with a Run button. Sandboxes execution inside
 * the embed while keeping our styling consistent with the developer playground.
 */
export function KotlinRunner({ code, title = "Kotlin", height = 320 }: KotlinRunnerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Kotlin Playground script once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.KotlinPlayground) {
      setReady(true);
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@jetbrains/kotlin-playground@1";
    script.async = true;
    script.onload = () => {
      setReady(true);
      setLoading(false);
    };
    script.onerror = () => {
      setError("Failed to load Kotlin Playground");
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize playground when script is ready
  useEffect(() => {
    if (!ready || !containerRef.current || !window.KotlinPlayground) return;
    try {
      window.KotlinPlayground(containerRef.current, {
        theme: "darcula",
        autoIndent: true,
        indent: 2,
        runButton: true,
        server: "https://play.kotlinlang.org",
        onError: (err: unknown) => {
          setError(typeof err === "string" ? err : "Runtime error");
        },
        onChange: () => {
          setError(null);
        },
      });
    } catch (e) {
      setError("Failed to initialize Kotlin runner");
    }
  }, [ready]);

  return (
    <div className={styles.shell} style={{ minHeight: height + 80 }}>
      <div className={styles.toolbar}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>Run Kotlin inline • Kotlin Playground</div>
      </div>
      <div className={styles.editorArea} style={{ minHeight: height }}>
        {loading && <div className={styles.loading}>Loading Kotlin playground…</div>}
        {error && !loading && <div className={styles.error}>{error}</div>}
        <div
          ref={containerRef}
          className={styles.kotlinContainer}
          style={{ display: loading ? "none" : "block" }}
          data-target-platform="js"
          data-theme="darcula"
          data-highlight-only="false"
          data-show-transpile-button="false"
        >
          <textarea defaultValue={code} />
        </div>
      </div>
    </div>
  );
}

export default KotlinRunner;
