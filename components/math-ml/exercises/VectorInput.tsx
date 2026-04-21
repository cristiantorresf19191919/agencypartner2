"use client";

import React, { useState } from "react";
import type { MMLVectorInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface VectorInputProps {
  exercise: MMLVectorInput;
  onCorrect: () => void;
}

export function VectorInput({ exercise, onCorrect }: VectorInputProps) {
  const [values, setValues] = useState<string[]>(
    Array.from({ length: exercise.dimensions }, () => "")
  );
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;

  const checkCorrect = (): boolean => {
    for (let i = 0; i < exercise.dimensions; i++) {
      const parsed = parseFloat(values[i]);
      if (isNaN(parsed) || Math.abs(parsed - exercise.answer[i]) > tolerance) {
        return false;
      }
    }
    return true;
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
        <span className={styles.matrixBracket}>(</span>
        <div style={{ display: "flex", gap: 6 }}>
          {values.map((val, i) => (
            <input
              key={i}
              type="number"
              className={styles.numberInput}
              value={val}
              onChange={(e) => {
                if (submitted) return;
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              }}
              step="any"
            />
          ))}
        </div>
        <span className={styles.matrixBracket}>)</span>
      </div>

      {!submitted && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${checkCorrect() ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent
            text={checkCorrect() ? exercise.explanation : `Expected: (${exercise.answer.join(", ")}). ${exercise.explanation}`}
            as="span"
          />
        </div>
      )}
    </div>
  );
}
