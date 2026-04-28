/**
 * Splits a LaTeX expression at top-level `=` signs and produces a chain of
 * progressive equations whose LHS stays fixed while the RHS evolves. This is
 * what powers the automatic animation of worked-example computations like
 * `\hat{y} = w \cdot x + b = 6 - 4 + 0.5 = 2.5`.
 *
 * Equalities inside `{}` brace groups and `\begin{...}\end{...}` environments
 * are protected so matrix entries, fractions, etc. are not mis-split.
 *
 * Returns `null` when the input has fewer than two top-level equalities — the
 * caller should fall back to static KaTeX in that case.
 */
// Implication / separator commands signal multiple distinct equations packed
// into one inline math block (e.g. `a = b \Rightarrow c = d`). The naïve
// equality splitter would mis-merge them into a fake chain — bail out instead
// so the math renders statically.
const BAILOUT_COMMAND_RE =
  /\\(?:Rightarrow|Leftarrow|Leftrightarrow|implies|impliedby|therefore|iff)\b/;

export function extractEquationChain(latex: string): string[] | null {
  if (BAILOUT_COMMAND_RE.test(latex)) return null;

  const parts = splitTopLevelEquals(latex);
  if (!parts || parts.length < 3) return null;

  const lhs = parts[0].trim();
  if (!lhs) return null;

  const steps: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    const rhs = parts[i].trim();
    if (!rhs) continue;
    steps.push(`${lhs} = ${rhs}`);
  }
  return steps.length >= 2 ? steps : null;
}

/**
 * Splits at top-level `=`. Returns `null` if a top-level `,` or `;` is seen,
 * which signals "multiple distinct equations on one line" — not a chain.
 */
function splitTopLevelEquals(s: string): string[] | null {
  const out: string[] = [];
  let braceDepth = 0;
  let envDepth = 0;
  let parenDepth = 0;
  let last = 0;
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (ch === "\\") {
      if (s.startsWith("\\begin{", i)) {
        envDepth++;
        const close = s.indexOf("}", i + 7);
        i = close === -1 ? s.length : close + 1;
        continue;
      }
      if (s.startsWith("\\end{", i)) {
        envDepth = Math.max(0, envDepth - 1);
        const close = s.indexOf("}", i + 5);
        i = close === -1 ? s.length : close + 1;
        continue;
      }
      // Skip the backslash escape so commands like \neq, \leq, \approx, etc.
      // never let a stray `=` slip through.
      i += 2;
      continue;
    }

    if (ch === "{") { braceDepth++; i++; continue; }
    if (ch === "}") { braceDepth = Math.max(0, braceDepth - 1); i++; continue; }
    if (ch === "(" || ch === "[") { parenDepth++; i++; continue; }
    if (ch === ")" || ch === "]") {
      parenDepth = Math.max(0, parenDepth - 1);
      i++;
      continue;
    }

    const atTopLevel =
      braceDepth === 0 && envDepth === 0 && parenDepth === 0;

    if (atTopLevel && (ch === "," || ch === ";")) {
      return null;
    }
    if (ch === "=" && braceDepth === 0 && envDepth === 0) {
      out.push(s.slice(last, i));
      last = i + 1;
      i++;
      continue;
    }

    i++;
  }

  out.push(s.slice(last));
  return out;
}
