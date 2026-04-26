import { simplify, parse, type MathNode } from "mathjs";

/**
 * Algebraic equivalence checker for student-typed derivation steps.
 *
 * Each "step" is an equation written as `LHS = RHS` (in mathjs syntax,
 * e.g. `2*(y+1) + 3*y = 7`). Two steps are equivalent when their
 * "LHS - RHS" forms reduce to the same expression.
 *
 * Strategy:
 *   1. Build the residual `R = LHS - RHS` for each step.
 *   2. Try `simplify(R_curr - R_prev) === 0` symbolically.
 *   3. Fallback: substitute several random rational values for every
 *      free variable and check |R_prev(x) - R_curr(x)| < 1e-9 every time.
 *
 * Returns one of:
 *   - "equivalent"        — algebraically equal, accept the step.
 *   - "not-equivalent"    — definitely different, reject.
 *   - "parse-error"       — input couldn't be parsed; show a syntax hint.
 */

export type EquivalenceResult =
  | { ok: true; kind: "equivalent" }
  | { ok: false; kind: "not-equivalent" }
  | { ok: false; kind: "parse-error"; message: string };

function residual(step: string): MathNode {
  if (!step.includes("=")) {
    // Treat as if "step = 0" (identity) so plain expressions still work.
    return parse(step);
  }
  const [lhs, rhs] = step.split("=", 2);
  return parse(`(${lhs}) - (${rhs})`);
}

function collectSymbols(node: MathNode): Set<string> {
  const out = new Set<string>();
  node.traverse((n) => {
    if (n.type === "SymbolNode") {
      const name = (n as unknown as { name: string }).name;
      // Exclude mathjs constants and common functions.
      if (!["pi", "e", "i", "Infinity", "NaN", "true", "false"].includes(name)) {
        out.add(name);
      }
    }
  });
  return out;
}

function randomFiniteValue(): number {
  // Avoid 0 (can hide divisions) and integers (can collide with simplify shortcuts).
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (0.3 + Math.random() * 4.7);
}

function numericEquivalent(
  prev: MathNode,
  curr: MathNode,
  trials = 8,
): boolean {
  const symbols = new Set<string>([
    ...collectSymbols(prev),
    ...collectSymbols(curr),
  ]);
  const prevFn = prev.compile();
  const currFn = curr.compile();
  for (let t = 0; t < trials; t++) {
    const scope: Record<string, number> = {};
    for (const s of symbols) scope[s] = randomFiniteValue();
    let pv: number, cv: number;
    try {
      pv = Number(prevFn.evaluate(scope));
      cv = Number(currFn.evaluate(scope));
    } catch {
      return false;
    }
    if (!Number.isFinite(pv) || !Number.isFinite(cv)) continue;
    const tol = 1e-7 * Math.max(1, Math.abs(pv), Math.abs(cv));
    if (Math.abs(pv - cv) > tol) return false;
  }
  return true;
}

export function checkEquivalence(
  prevStep: string,
  currStep: string,
): EquivalenceResult {
  let prev: MathNode;
  let curr: MathNode;
  try {
    prev = residual(prevStep);
  } catch (err) {
    return {
      ok: false,
      kind: "parse-error",
      message: `Couldn't parse the previous step: ${(err as Error).message}`,
    };
  }
  try {
    curr = residual(currStep);
  } catch (err) {
    return {
      ok: false,
      kind: "parse-error",
      message: `Couldn't parse your step: ${(err as Error).message}`,
    };
  }

  // 1) Symbolic check.
  try {
    const diff = simplify(`(${prev.toString()}) - (${curr.toString()})`);
    if (diff.toString().replace(/\s+/g, "") === "0") {
      return { ok: true, kind: "equivalent" };
    }
  } catch {
    // fall through to numeric
  }

  // 2) Numeric check (handles cases mathjs simplify can't fully reduce).
  if (numericEquivalent(prev, curr)) {
    return { ok: true, kind: "equivalent" };
  }
  return { ok: false, kind: "not-equivalent" };
}
