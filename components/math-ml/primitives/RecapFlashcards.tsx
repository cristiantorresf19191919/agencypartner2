"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface Props {
  takeaways: string[];
  lang: string;
  title?: string;
}

function splitIntoCard(takeaway: string): { front: string; back: string } {
  // Try splitting at " — " or " - " or ": " for front/back
  const emDash = takeaway.indexOf(" — ");
  if (emDash > 0 && emDash < takeaway.length - 3) {
    return {
      front: takeaway.slice(0, emDash).trim(),
      back: takeaway.slice(emDash + 3).trim(),
    };
  }
  const hyph = takeaway.indexOf(" - ");
  if (hyph > 0 && hyph < takeaway.length - 3) {
    return {
      front: takeaway.slice(0, hyph).trim(),
      back: takeaway.slice(hyph + 3).trim(),
    };
  }
  const colon = takeaway.indexOf(": ");
  if (colon > 0 && colon < takeaway.length - 2) {
    return {
      front: takeaway.slice(0, colon).trim(),
      back: takeaway.slice(colon + 2).trim(),
    };
  }
  // fallback: show first 60 chars on front, rest on back
  const midpoint = Math.min(60, Math.floor(takeaway.length / 2));
  const cut = takeaway.indexOf(" ", midpoint);
  if (cut === -1) {
    return { front: takeaway, back: takeaway };
  }
  return {
    front: takeaway.slice(0, cut).trim() + "…",
    back: takeaway.trim(),
  };
}

export function RecapFlashcards({ takeaways, lang, title }: Props) {
  const cards = useMemo(() => takeaways.map(splitIntoCard), [takeaways]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[idx];
  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % cards.length);
  };
  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  const heading =
    title ?? (lang === "es" ? "Repasa con flashcards" : "Recap flashcards");
  const hint =
    lang === "es"
      ? "Toca la tarjeta para revelarla"
      : "Tap the card to reveal";
  const nextLabel = lang === "es" ? "Siguiente" : "Next";
  const prevLabel = lang === "es" ? "Anterior" : "Prev";

  return (
    <section className={styles.flashcardsSection}>
      <div className={styles.flashcardsHead}>
        <span className={styles.flashcardsTag}>
          {lang === "es" ? "Memoria activa" : "Active recall"}
        </span>
        <div className={styles.flashcardsTitle}>{heading}</div>
        <div className={styles.flashcardsCount}>
          {idx + 1} / {cards.length}
        </div>
      </div>

      <div
        className={styles.flashcardStage}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${idx}-${flipped ? "back" : "front"}`}
            className={`${styles.flashcard} ${flipped ? styles.flashcardBack : styles.flashcardFront}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1.05] }}
          >
            <div className={styles.flashcardSide}>
              {!flipped && (
                <div className={styles.flashcardSideTag}>
                  {lang === "es" ? "Concepto" : "Concept"}
                </div>
              )}
              {flipped && (
                <div className={styles.flashcardSideTag}>
                  {lang === "es" ? "Explicación" : "Explanation"}
                </div>
              )}
              <div className={styles.flashcardBody}>
                <MathContent
                  text={flipped ? card.back : card.front}
                  as="span"
                />
              </div>
              <div className={styles.flashcardHint}>{hint}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.flashcardsControls}>
        <button
          type="button"
          onClick={prev}
          className={styles.flashcardsBtn}
          aria-label={prevLabel}
        >
          ←
        </button>
        <div className={styles.flashcardsDots}>
          {cards.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              className={`${styles.flashcardsDot} ${i === idx ? styles.flashcardsDotActive : ""}`}
              onClick={() => {
                setFlipped(false);
                setIdx(i);
              }}
              aria-label={`Card ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className={styles.flashcardsBtn}
          aria-label={nextLabel}
        >
          →
        </button>
      </div>
    </section>
  );
}

export default RecapFlashcards;
