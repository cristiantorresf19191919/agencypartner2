"use client";

import React, { useState } from "react";
import type { MMLMultipleChoice } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface MultipleChoiceProps {
  exercise: MMLMultipleChoice;
  onCorrect: () => void;
}

export function MultipleChoice({ exercise, onCorrect }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === exercise.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === exercise.correctIndex) {
      onCorrect();
    }
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      {exercise.hint && !submitted && (
        <HintToggle hint={exercise.hint} />
      )}

      <div>
        {exercise.options.map((option, i) => (
          <div
            key={i}
            className={`${styles.mcOption} ${selected === i ? styles.mcOptionSelected : ""}`}
            onClick={() => { if (!submitted) setSelected(i); }}
          >
            <div className={`${styles.mcRadio} ${selected === i ? styles.mcRadioSelected : ""}`}>
              {selected === i && <div className={styles.mcRadioDot} />}
            </div>
            <MathContent text={option} as="span" />
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Check Answer
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

function HintToggle({ hint }: { hint: string }) {
  const [showHint, setShowHint] = useState(false);
  return (
    <>
      <div className={styles.exerciseHint} onClick={() => setShowHint(!showHint)}>
        {showHint ? "Hide hint" : "Show hint"}
      </div>
      {showHint && (
        <div className={styles.exerciseHintContent}>
          <MathContent text={hint} as="span" />
        </div>
      )}
    </>
  );
}
