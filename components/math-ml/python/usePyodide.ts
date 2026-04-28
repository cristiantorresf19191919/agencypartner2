"use client";

import { useEffect, useState } from "react";

const PYODIDE_VERSION = "0.27.4";
const CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (names: string | string[]) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: { set: (k: string, v: unknown) => void; get: (k: string) => unknown };
};

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<PyodideInterface>;
    __pyodide_singleton__?: Promise<PyodideInterface>;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = src;
    tag.async = true;
    tag.onload = () => resolve();
    tag.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(tag);
  });
}

/**
 * Lazy-load Pyodide from the JSDelivr CDN. Returns the *same* instance for
 * every caller (idempotent across the page) — the runtime is ~6 MB so we
 * only ever pay that cost once per session.
 *
 * Caller decides which packages to preload via the `packages` arg.
 */
export async function getPyodide(packages: string[] = []): Promise<PyodideInterface> {
  if (typeof window === "undefined") {
    throw new Error("Pyodide can only run in the browser");
  }
  if (!window.__pyodide_singleton__) {
    window.__pyodide_singleton__ = (async () => {
      await loadScript(CDN_URL);
      if (!window.loadPyodide) {
        throw new Error("loadPyodide not present on window after script load");
      }
      const py = await window.loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
      });
      return py;
    })();
  }
  const py = await window.__pyodide_singleton__;
  if (packages.length > 0) {
    await py.loadPackage(packages);
  }
  return py;
}

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export function usePyodideStatus(): { status: LoadStatus; error?: string } {
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__pyodide_singleton__) {
      setStatus("loading");
      window.__pyodide_singleton__
        .then(() => setStatus("ready"))
        .catch((err: Error) => {
          setStatus("error");
          setError(err.message);
        });
    }
  }, []);
  return { status, error };
}
