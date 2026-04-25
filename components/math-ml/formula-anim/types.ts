export interface Token {
  /** Stable identity hash combining symbol + role-path. */
  tokId: string;
  /** Visible text content (e.g. "x", "5", "+"). */
  symbol: string;
  /** KaTeX class chain (e.g. "mord mathnormal" or "mbin"). */
  role: string;
  /** Index in the rendered DOM order (0-based). */
  index: number;
}

export interface TokenizedStep {
  /** HTML of the rendered formula with `data-tok-id` annotations on every leaf. */
  html: string;
  tokens: Token[];
}

export interface TokenMatch {
  fromIdx: number;
  toIdx: number;
}

export interface MatchResult {
  matched: TokenMatch[];
  removed: number[];
  added: number[];
  /** True when more than half of all tokens are unmatched — caller should cross-fade. */
  ambiguous: boolean;
}

export interface MorphOptions {
  durationMs: number;
  easing: string;
  reducedMotion: boolean;
  emphasize?: string[];
}
