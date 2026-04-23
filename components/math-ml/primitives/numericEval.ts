/**
 * Minimal, safe evaluator for a tiny subset of LaTeX used inside inline $...$.
 *
 * Supports: digits, decimal points, unary minus, + - * / ^, parentheses,
 *   \sqrt{...},  \frac{...}{...},  \pi, e, \cdot, spaces.
 *
 * Returns null when the expression contains variables or anything unsupported.
 * This is intentionally conservative — we only evaluate expressions that are
 * guaranteed to be numeric constants.
 */

type Token =
  | { kind: "num"; value: number }
  | { kind: "op"; op: "+" | "-" | "*" | "/" | "^" }
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "sqrt" }
  | { kind: "frac" }
  | { kind: "lbrace" }
  | { kind: "rbrace" };

export function tryEvalLatex(latex: string): number | null {
  const normalized = normalize(latex);
  if (!normalized) return null;

  const tokens = tokenize(normalized);
  if (!tokens) return null;

  const parser = new Parser(tokens);
  try {
    const value = parser.parseExpression();
    if (parser.hasMore()) return null;
    return value;
  } catch {
    return null;
  }
}

function normalize(src: string): string | null {
  // Reject anything that's clearly not pure arithmetic: letters other than
  // \sqrt / \frac / \pi / e / \cdot.
  const stripped = src
    .replace(/\\left|\\right/g, "")
    .replace(/\\,|\\;|\\!|\\\s/g, " ")
    .replace(/\\pi/g, String(Math.PI))
    .replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .trim();

  if (!stripped) return null;
  if (/[A-DF-Zf-z]/.test(stripped.replace(/\\sqrt|\\frac|e(?![a-zA-Z])/g, ""))) {
    return null;
  }
  return stripped;
}

function tokenize(src: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === " " || ch === "\t" || ch === "\n") {
      i++;
      continue;
    }
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let j = i;
      while (
        j < src.length &&
        ((src[j] >= "0" && src[j] <= "9") || src[j] === ".")
      ) {
        j++;
      }
      const v = parseFloat(src.slice(i, j));
      if (!Number.isFinite(v)) return null;
      tokens.push({ kind: "num", value: v });
      i = j;
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^") {
      tokens.push({ kind: "op", op: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "rparen" });
      i++;
      continue;
    }
    if (ch === "{") {
      tokens.push({ kind: "lbrace" });
      i++;
      continue;
    }
    if (ch === "}") {
      tokens.push({ kind: "rbrace" });
      i++;
      continue;
    }
    if (ch === "e" && !/[0-9A-Za-z]/.test(src[i + 1] ?? "")) {
      tokens.push({ kind: "num", value: Math.E });
      i++;
      continue;
    }
    if (src.startsWith("\\sqrt", i)) {
      tokens.push({ kind: "sqrt" });
      i += 5;
      continue;
    }
    if (src.startsWith("\\frac", i)) {
      tokens.push({ kind: "frac" });
      i += 5;
      continue;
    }
    return null;
  }
  return tokens;
}

class Parser {
  private pos = 0;

  constructor(private readonly tokens: Token[]) {}

  hasMore() {
    return this.pos < this.tokens.length;
  }

  private peek() {
    return this.tokens[this.pos];
  }

  private consume() {
    return this.tokens[this.pos++];
  }

  parseExpression(): number {
    // addition / subtraction
    let left = this.parseTerm();
    while (this.peek()?.kind === "op") {
      const op = (this.peek() as { kind: "op"; op: string }).op;
      if (op !== "+" && op !== "-") break;
      this.consume();
      const right = this.parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseTerm(): number {
    // * and /
    let left = this.parseFactor();
    while (this.peek()?.kind === "op") {
      const op = (this.peek() as { kind: "op"; op: string }).op;
      if (op !== "*" && op !== "/") break;
      this.consume();
      const right = this.parseFactor();
      left = op === "*" ? left * right : left / right;
    }
    return left;
  }

  private parseFactor(): number {
    // exponent (right-associative)
    const base = this.parseUnary();
    if (this.peek()?.kind === "op" && (this.peek() as { op: string }).op === "^") {
      this.consume();
      const exp = this.parseFactor();
      return Math.pow(base, exp);
    }
    return base;
  }

  private parseUnary(): number {
    if (this.peek()?.kind === "op" && (this.peek() as { op: string }).op === "-") {
      this.consume();
      return -this.parseUnary();
    }
    if (this.peek()?.kind === "op" && (this.peek() as { op: string }).op === "+") {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const tok = this.consume();
    if (!tok) throw new Error("unexpected end");
    if (tok.kind === "num") return tok.value;
    if (tok.kind === "lparen") {
      const v = this.parseExpression();
      const next = this.consume();
      if (!next || next.kind !== "rparen") throw new Error("missing )");
      return v;
    }
    if (tok.kind === "lbrace") {
      const v = this.parseExpression();
      const next = this.consume();
      if (!next || next.kind !== "rbrace") throw new Error("missing }");
      return v;
    }
    if (tok.kind === "sqrt") {
      const open = this.consume();
      if (!open || open.kind !== "lbrace") throw new Error("sqrt missing {");
      const arg = this.parseExpression();
      const close = this.consume();
      if (!close || close.kind !== "rbrace") throw new Error("sqrt missing }");
      return Math.sqrt(arg);
    }
    if (tok.kind === "frac") {
      const open1 = this.consume();
      if (!open1 || open1.kind !== "lbrace") throw new Error("frac missing {");
      const num = this.parseExpression();
      const close1 = this.consume();
      if (!close1 || close1.kind !== "rbrace") throw new Error("frac missing }");
      const open2 = this.consume();
      if (!open2 || open2.kind !== "lbrace") throw new Error("frac missing {");
      const den = this.parseExpression();
      const close2 = this.consume();
      if (!close2 || close2.kind !== "rbrace") throw new Error("frac missing }");
      if (den === 0) throw new Error("div by zero");
      return num / den;
    }
    throw new Error("unexpected token");
  }
}
