import type { MatchResult, TokenizedStep } from "./types";

/**
 * Greedy match by `tokId`. When a `from` token has multiple unused candidates
 * with the same id, pick the one whose index is closest. Marks `ambiguous`
 * when more than half of all tokens go unmatched — caller should cross-fade.
 */
export function matchTokens(
  from: TokenizedStep,
  to: TokenizedStep,
): MatchResult {
  const matched: MatchResult["matched"] = [];
  const usedTo = new Set<number>();
  const removed: number[] = [];

  const toByTokId = new Map<string, number[]>();
  to.tokens.forEach((t, i) => {
    const arr = toByTokId.get(t.tokId);
    if (arr) arr.push(i);
    else toByTokId.set(t.tokId, [i]);
  });

  from.tokens.forEach((tok, fromIdx) => {
    const candidates = toByTokId.get(tok.tokId);
    if (!candidates || candidates.length === 0) {
      removed.push(fromIdx);
      return;
    }
    let best = -1;
    let bestDist = Infinity;
    for (const ci of candidates) {
      if (usedTo.has(ci)) continue;
      const d = Math.abs(ci - fromIdx);
      if (d < bestDist) {
        bestDist = d;
        best = ci;
      }
    }
    if (best === -1) {
      removed.push(fromIdx);
    } else {
      matched.push({ fromIdx, toIdx: best });
      usedTo.add(best);
    }
  });

  const added: number[] = [];
  to.tokens.forEach((_, i) => {
    if (!usedTo.has(i)) added.push(i);
  });

  const total = from.tokens.length + to.tokens.length || 1;
  const unmatched = removed.length + added.length;
  const ambiguous = unmatched / total > 0.5;

  return { matched, removed, added, ambiguous };
}
