import type { FormulaChainSpec } from "@/lib/mmlTypes";
import { extractEquationChain } from "./extractEquationChain";

/**
 * Splits a content string into ordered text and chain segments. Recognizes:
 *
 *   ::math-chain title="..." titleEs="..." emphasize="2:5y;4:y" pacing="auto"
 *   step1 latex
 *   step2 latex
 *   ...
 *   ::
 */
export type ContentSegment =
  | { kind: "text"; value: string }
  | { kind: "chain"; value: FormulaChainSpec }
  | { kind: "verify"; value: FormulaChainSpec };

const OPEN_RE = /^::math-(chain|verify)\s*([^\n]*)$/m;
const CLOSE_RE = /^::\s*$/m;
const ATTR_RE = /(\w+)="([^"]*)"/g;

function parseAttrs(line: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of line.matchAll(ATTR_RE)) {
    out[m[1]] = m[2];
  }
  return out;
}

function parseEmphasize(
  s: string | undefined,
): Record<number, string[]> | undefined {
  if (!s) return undefined;
  const out: Record<number, string[]> = {};
  s.split(";").forEach((entry) => {
    const [k, v] = entry.split(":");
    const idx = Number(k);
    if (Number.isFinite(idx) && v) {
      out[idx] = v.split(",").map((x) => x.trim()).filter(Boolean);
    }
  });
  return Object.keys(out).length ? out : undefined;
}

export function splitChainBlocks(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const rest = text.slice(cursor);
    const openMatch = rest.match(OPEN_RE);
    if (!openMatch || openMatch.index === undefined) {
      segments.push({ kind: "text", value: rest });
      break;
    }
    if (openMatch.index > 0) {
      segments.push({ kind: "text", value: rest.slice(0, openMatch.index) });
    }
    const directive = openMatch[1] as "chain" | "verify";
    const afterOpen = openMatch.index + openMatch[0].length + 1; // skip newline
    const tail = rest.slice(afterOpen);
    const closeMatch = tail.match(CLOSE_RE);
    if (!closeMatch || closeMatch.index === undefined) {
      // Unclosed block — emit the rest as plain text and stop.
      segments.push({ kind: "text", value: rest });
      break;
    }
    const body = tail.slice(0, closeMatch.index).replace(/\n+$/, "");
    const attrs = parseAttrs(openMatch[2] ?? "");
    const steps = body
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (steps.length >= 1) {
      const value: FormulaChainSpec = {
        steps,
        emphasize: parseEmphasize(attrs.emphasize),
        pacing: attrs.pacing === "auto" ? "auto" : undefined,
        title: attrs.title,
        titleEs: attrs.titleEs,
        caption: attrs.caption,
        captionEs: attrs.captionEs,
      };
      segments.push(
        directive === "verify"
          ? { kind: "verify", value }
          : { kind: "chain", value },
      );
    }
    cursor += afterOpen + closeMatch.index + closeMatch[0].length + 1;
  }

  return segments.filter(
    (s) => s.kind === "chain" || s.kind === "verify" || s.value.length > 0,
  );
}

/**
 * Post-processes text segments so that any inline `$…$` or display `$$…$$`
 * containing two or more top-level equalities is promoted to an animated chain
 * segment. Authors get cinematic, Manim-style morphing on every worked-example
 * computation without having to hand-author `::math-chain` blocks.
 *
 * Non-extractable math (single equality or no equality) stays inline so the
 * surrounding sentence flow is preserved.
 */
export function autoChainifyTextSegments(
  segments: ContentSegment[],
): ContentSegment[] {
  const out: ContentSegment[] = [];
  for (const seg of segments) {
    if (seg.kind !== "text") {
      out.push(seg);
      continue;
    }
    out.push(...extractInlineChains(seg.value));
  }
  return out;
}

const INLINE_MATH_RE = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;

function extractInlineChains(text: string): ContentSegment[] {
  const result: ContentSegment[] = [];
  let lastIndex = 0;
  for (const m of text.matchAll(INLINE_MATH_RE)) {
    const start = m.index ?? 0;
    const inner = m[1] ?? m[2] ?? "";
    const steps = extractEquationChain(inner);
    if (!steps) continue;
    if (start > lastIndex) {
      result.push({ kind: "text", value: text.slice(lastIndex, start) });
    }
    result.push({
      kind: "chain",
      value: { steps, pacing: "auto" },
    });
    lastIndex = start + m[0].length;
  }
  if (lastIndex < text.length) {
    result.push({ kind: "text", value: text.slice(lastIndex) });
  }
  return result.length ? result : [{ kind: "text", value: text }];
}
