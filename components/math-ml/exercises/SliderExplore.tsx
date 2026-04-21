"use client";

import React, { useState } from "react";
import type { MMLSliderExplore } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface SliderExploreProps {
  exercise: MMLSliderExplore;
  onCorrect: () => void;
}

export function SliderExplore({ exercise, onCorrect }: SliderExploreProps) {
  const [sliderValue, setSliderValue] = useState(
    (exercise.sliderRange[0] + exercise.sliderRange[1]) / 2
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === exercise.correctFollowUpIndex;
  const step = exercise.sliderStep ?? 0.1;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, opacity: 0.6 }}>{exercise.sliderLabel}</span>
          <span className={styles.sliderValue}>{sliderValue.toFixed(2)}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={exercise.sliderRange[0]}
          max={exercise.sliderRange[1]}
          step={step}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          <MathContent text={exercise.followUpQuestion} as="span" />
        </div>
        {exercise.followUpOptions.map((option, i) => (
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
