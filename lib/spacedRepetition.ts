// lib/spacedRepetition.ts
import type { SRCardData } from "./devHubStore";

export type SRQuality = 0 | 1 | 2 | 3 | 4 | 5;

export const SR_RATINGS = [
  { quality: 0 as SRQuality, labelKey: "sr-again" },
  { quality: 2 as SRQuality, labelKey: "sr-hard" },
  { quality: 4 as SRQuality, labelKey: "sr-good" },
  { quality: 5 as SRQuality, labelKey: "sr-easy" },
] as const;

export function newCard(): SRCardData {
  return {
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().slice(0, 10),
    repetitions: 0,
  };
}

export function reviewCard(card: SRCardData, quality: SRQuality): SRCardData {
  let { interval, easeFactor, repetitions } = card;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    nextReview: nextDate.toISOString().slice(0, 10),
    repetitions,
  };
}

export function isDue(card: SRCardData): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return card.nextReview <= today;
}

export function getDueCount(srData: Record<string, SRCardData>): number {
  return Object.values(srData).filter(isDue).length;
}

export function getDueIds(srData: Record<string, SRCardData>): string[] {
  return Object.entries(srData)
    .filter(([, card]) => isDue(card))
    .map(([id]) => id);
}
