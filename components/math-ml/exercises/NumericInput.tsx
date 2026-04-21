"use client";

import React, { useState } from "react";
import type { MMLNumericInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface NumericInputProps {
  exercise: MMLNumericInput;
  onCorrect: () => void;
}

export function NumericInput({ exercise, onCorrect }: NumericInputProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;
  const parsed = parseFloat(value);
  const isCorrect = !isNaN(parsed) && Math.abs(parsed - exercise.answer) <= tolerance;
  const isClose = !isNaN(parsed) && !isCorrect && Math.abs(parsed - exercise.answer) <= tolerance * 5;

  const handleSubmit = () => {
    if (value === "") return;
    setSubmitted(true);
    if (isCorrect) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          className={styles.numberInput}
          value={value}
          onChange={(e) => { if (!submitted) setValue(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          step="any"
        />
        {exercise.unit && <span style={{ fontSize: 14, opacity: 0.6 }}>{exercise.unit}</span>}
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={value === ""}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          {isCorrect ? (
            <MathContent text={exercise.explanation} as="span" />
          ) : (
            <MathContent
              text={isClose ? `Close! The answer is ${exercise.answer}. ${exercise.explanation}` : `The answer is ${exercise.answer}. ${exercise.explanation}`}
              as="span"
            />
          )}
        </div>
      )}
    </div>
  );
}
