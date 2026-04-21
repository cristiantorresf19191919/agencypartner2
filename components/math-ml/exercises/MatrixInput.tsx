"use client";

import React, { useState } from "react";
import type { MMLMatrixInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface MatrixInputProps {
  exercise: MMLMatrixInput;
  onCorrect: () => void;
}

export function MatrixInput({ exercise, onCorrect }: MatrixInputProps) {
  const [values, setValues] = useState<string[][]>(
    Array.from({ length: exercise.rows }, () =>
      Array.from({ length: exercise.cols }, () => "")
    )
  );
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;

  const checkCorrect = (): boolean => {
    for (let r = 0; r < exercise.rows; r++) {
      for (let c = 0; c < exercise.cols; c++) {
        const parsed = parseFloat(values[r][c]);
        if (isNaN(parsed) || Math.abs(parsed - exercise.answer[r][c]) > tolerance) {
          return false;
        }
      }
    }
    return true;
  };

  const isCorrect = submitted && checkCorrect();

  const handleChange = (r: number, c: number, v: string) => {
    if (submitted) return;
    const next = values.map((row) => [...row]);
    next[r][c] = v;
    setValues(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (checkCorrect()) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span className={styles.matrixBracket}>[</span>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: `repeat(${exercise.cols}, 80px)` }}
        >
          {values.map((row, r) =>
            row.map((val, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                className={styles.numberInput}
                value={val}
                onChange={(e) => handleChange(r, c, e.target.value)}
                step="any"
              />
            ))
          )}
        </div>
        <span className={styles.matrixBracket}>]</span>
      </div>

      {!submitted && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Expected: [${exercise.answer.map(r => r.join(", ")).join("; ")}]. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}
