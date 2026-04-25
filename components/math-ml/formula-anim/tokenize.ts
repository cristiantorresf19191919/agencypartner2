"use client";

import katex from "katex";
import type { Token, TokenizedStep } from "./types";

const LEAF_CLASSES = new Set([
  "mord",
  "mbin",
  "mrel",
  "mop",
  "mpunct",
  "mopen",
  "mclose",
  "minner",
]);

function shortHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
}

function rolePath(node: HTMLElement, root: HTMLElement): string {
  const chain: string[] = [];
  let cur: HTMLElement | null = node;
  while (cur && cur !== root) {
    const cls = (cur.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => c.startsWith("m") || c === "frac" || c === "mfrac")
      .sort()
      .join(".");
    if (cls) chain.push(cls);
    cur = cur.parentElement;
  }
  return chain.join("/");
}

function isLeafNode(el: HTMLElement): boolean {
  const classes = (el.getAttribute("class") || "").split(/\s+/);
  if (!classes.some((c) => LEAF_CLASSES.has(c))) return false;
  const selector = Array.from(LEAF_CLASSES).map((c) => `:scope .${c}`).join(", ");
  const deeper = el.querySelector(selector);
  return !deeper;
}

export function tokenize(latex: string, displayMode = true): TokenizedStep {
  const html = katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
    output: "html",
    trust: false,
  });

  if (typeof document === "undefined" || typeof DOMParser === "undefined") {
    return { html, tokens: [] };
  }

  // Parse the KaTeX HTML through DOMParser (avoids assigning to innerHTML).
  const doc = new DOMParser().parseFromString(html, "text/html");
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return { html, tokens: [] };

  const tokens: Token[] = [];
  const symbolCounters: Record<string, number> = {};
  const allElements = root.querySelectorAll<HTMLElement>("*");

  let domIndex = 0;
  allElements.forEach((el) => {
    if (!isLeafNode(el)) return;
    const symbol = (el.textContent || "").trim();
    if (!symbol) return;
    const role = rolePath(el, root);
    const key = `${symbol}|${role}`;
    const occurrence = (symbolCounters[key] = (symbolCounters[key] ?? -1) + 1);
    const tokId = shortHash(`${symbol}|${role}|${occurrence}`);
    el.setAttribute("data-tok-id", tokId);
    el.setAttribute("data-tok-symbol", symbol);
    tokens.push({ tokId, symbol, role, index: domIndex++ });
  });

  return { html: root.outerHTML, tokens };
}
