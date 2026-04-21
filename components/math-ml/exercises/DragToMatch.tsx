"use client";

import React, { useState } from "react";
import type { MMLDragToMatch } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface DragToMatchProps {
  exercise: MMLDragToMatch;
  onCorrect: () => void;
}

export function DragToMatch({ exercise, onCorrect }: DragToMatchProps) {
  const [pairs, setPairs] = useState<(number | null)[]>(
    Array.from({ length: exercise.leftItems.length }, () => null)
  );
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const checkCorrect = (): boolean => {
    for (const [left, right] of exercise.correctPairs) {
      if (pairs[left] !== right) return false;
    }
    return true;
  };

  const isCorrect = submitted && checkCorrect();
  const usedRight = new Set(pairs.filter((p): p is number => p !== null));

  const handleLeftClick = (leftIdx: number) => {
    if (submitted) return;
    setActiveDrag(leftIdx);
  };

  const handleRightClick = (rightIdx: number) => {
    if (submitted || activeDrag === null) return;
    const next = [...pairs];
    const prevLeft = next.indexOf(rightIdx);
    if (prevLeft !== -1) next[prevLeft] = null;
    next[activeDrag] = rightIdx;
    setPairs(next);
    setActiveDrag(null);
  };

  const handleSubmit = () => {
    if (pairs.some((p) => p === null)) return;
    setSubmitted(true);
    if (checkCorrect()) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 12 }}>
        Click a left item, then click its match on the right.
      </p>

      <div className={styles.dragColumns}>
        <div>
          {exercise.leftItems.map((item, i) => (
            <div
              key={i}
              className={`${styles.dragItem} ${activeDrag === i ? styles.dragItemActive : ""}`}
              onClick={() => handleLeftClick(i)}
            >
              <MathContent text={item} as="span" />
              {pairs[i] !== null && (
                <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.5 }}>
                  matched
                </span>
              )}
            </div>
          ))}
        </div>
        <div>
          {exercise.rightItems.map((item, i) => (
            <div
              key={i}
              className={`${styles.dragTarget} ${activeDrag !== null && !usedRight.has(i) ? styles.dragTargetHover : ""}`}
              onClick={() => handleRightClick(i)}
            >
              <MathContent text={item} as="span" />
            </div>
          ))}
        </div>
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={pairs.some((p) => p === null)}
        >
          Check Matches
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Not quite. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}
