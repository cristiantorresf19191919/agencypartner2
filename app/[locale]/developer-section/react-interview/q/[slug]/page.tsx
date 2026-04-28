"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { getStore, updateStore } from "@/lib/devHubStore";
import { SR_RATINGS, reviewCard, newCard } from "@/lib/spacedRepetition";
import type { SRQuality } from "@/lib/spacedRepetition";
import {
  REACT_INTERVIEW_CATEGORIES,
  REACT_INTERVIEW_QUESTIONS,
  getQuestionBySlug,
} from "@/lib/reactInterviewQuestionsData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { MarkdownAnswer } from "@/components/ui/MarkdownAnswer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLang } from "@/lib/i18n";
import { TranslationPendingBadge } from "@/components/ui/TranslationPendingBadge";
import styles from "../../../challenges/ChallengesPage.module.css";
import playStyles from "../../../challenges/[slug]/ChallengePlay.module.css";

export default function ReactInterviewQuestionPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const [srRated, setSrRated] = useState(false);

  const question = useMemo(() => getQuestionBySlug(slug), [slug]);
  const category = question
    ? REACT_INTERVIEW_CATEGORIES.find((c) => c.id === question.category)
    : undefined;

  const neighbors = useMemo(() => {
    if (!question) return { prev: undefined, next: undefined };
    const inCat = REACT_INTERVIEW_QUESTIONS.filter(
      (q) => q.category === question.category,
    );
    const idx = inCat.findIndex((q) => q.slug === slug);
    return {
      prev: idx > 0 ? inCat[idx - 1] : undefined,
      next: idx >= 0 && idx < inCat.length - 1 ? inCat[idx + 1] : undefined,
    };
  }, [question, slug]);

  const handleSRRate = useCallback(
    (quality: SRQuality) => {
      const store = getStore();
      const questionId = `react-interview-q-${slug}`;
      const current = store.interviewSR[questionId] ?? newCard();
      const updated = reviewCard(current, quality);
      updateStore({
        interviewSR: { ...store.interviewSR, [questionId]: updated },
      });
      setSrRated(true);
    },
    [slug],
  );

  if (!question) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("react-interview-not-found")}</p>
          <a href={createLocalizedPath("/developer-section/react-interview")}>
            {t("react-interview-back-to-lessons")}
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 24px" }}>
        <Link
          href={createLocalizedPath("/developer-section/react-interview")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#7cf4ff",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <ArrowBackIcon fontSize="small" /> {t("react-interview-back")}
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
          <span
            className={styles.difficulty}
            style={{ background: "rgba(167, 107, 249, 0.18)", color: "#c4a1ff" }}
          >
            {category ? pickLang(language, category.labelEs, category.label) : question.category}
          </span>
          <span style={{ fontSize: 13, color: "#9fc4ff" }}>
            #{question.num} · {t("react-interview-q-source")}
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
            margin: "0 0 20px",
            color: "white",
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {pickLang(language, question.titleEs, question.title)}
        </motion.h1>
        <TranslationPendingBadge show={language === "es" && !question.titleEs} />

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          style={{
            background: "rgba(11, 16, 32, 0.6)",
            border: "1px solid rgba(124, 244, 255, 0.15)",
            borderRadius: 14,
            padding: "20px 24px",
            boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)",
          }}
        >
          <MarkdownAnswer>{question.answer}</MarkdownAnswer>
        </motion.article>

        {/* Spaced Repetition */}
        <div style={{ marginTop: 28 }}>
          {!srRated ? (
            <div
              style={{
                padding: 18,
                background: "rgba(167, 107, 249, 0.08)",
                border: "1px solid rgba(167, 107, 249, 0.2)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.75)", marginBottom: 12 }}>
                {t("sr-how-well")}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {SR_RATINGS.map((r) => (
                  <button
                    type="button"
                    key={r.quality}
                    onClick={() => handleSRRate(r.quality)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      background: "rgba(255, 255, 255, 0.06)",
                      color: "white",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    {t(r.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#34d399", fontSize: "0.9rem" }}>
              {t("sr-rated-thanks")}
            </div>
          )}
        </div>

        {/* Prev / Next */}
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {neighbors.prev ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/react-interview/q/${neighbors.prev.slug}`,
              )}
              style={navLinkStyle}
            >
              <span style={{ fontSize: 11, color: "#7cf4ff", textTransform: "uppercase", letterSpacing: 0.6 }}>
                {t("react-interview-prev")}
              </span>
              <span style={{ color: "white", fontSize: 14, lineHeight: 1.35 }}>{neighbors.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {neighbors.next ? (
            <Link
              href={createLocalizedPath(
                `/developer-section/react-interview/q/${neighbors.next.slug}`,
              )}
              style={{ ...navLinkStyle, textAlign: "right" }}
            >
              <span style={{ fontSize: 11, color: "#7cf4ff", textTransform: "uppercase", letterSpacing: 0.6 }}>
                {t("react-interview-next")}
              </span>
              <span style={{ color: "white", fontSize: 14, lineHeight: 1.35 }}>{neighbors.next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

const navLinkStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "14px 16px",
  borderRadius: 10,
  border: "1px solid rgba(124, 244, 255, 0.18)",
  background: "rgba(124, 244, 255, 0.04)",
  textDecoration: "none",
  minHeight: 60,
  transition: "background 0.15s",
};
