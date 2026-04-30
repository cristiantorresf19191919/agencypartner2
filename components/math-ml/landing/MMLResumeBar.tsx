"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowForward as ArrowRight, PlayArrow as PlayIcon } from "@mui/icons-material";
import { MML_COURSE_LESSONS } from "@/lib/mmlCourseData";
import { getAllProgress } from "@/lib/courseProgress";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getChapterAccent } from "@/lib/mmlChapterAccents";
import styles from "./MMLResumeBar.module.css";

const COURSE_ID = "mathematics-ml";

/**
 * Slim sticky bar shown at the bottom of the MML landing once the user has
 * scrolled past the hero. Provides one-tap resume of the most-recent lesson.
 */
export function MMLResumeBar() {
  const { createLocalizedPath } = useLocale();
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  const [resume, setResume] = useState<{
    title: string;
    href: string;
    chapterNumber: number;
    step: number;
  } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const map = getAllProgress();
      const p = map[COURSE_ID];
      if (!p?.lastLessonId || !p.lastLessonHref) {
        setResume(null);
        return;
      }
      const lesson = MML_COURSE_LESSONS.find((l) => l.id === p.lastLessonId);
      if (!lesson) {
        setResume(null);
        return;
      }
      setResume({
        title: (lang === "es" && lesson.titleEs) || lesson.title,
        href: p.lastLessonHref,
        chapterNumber: lesson.chapterNumber,
        step: lesson.step,
      });
    };
    refresh();
    window.addEventListener("course-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("course-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [lang]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled((window.scrollY || 0) > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = !!resume && scrolled;
  const accent = resume ? getChapterAccent(resume.chapterNumber) : null;

  return (
    <AnimatePresence initial={false}>
      {visible && resume ? (
        <motion.div
          key="bar"
          className={styles.bar}
          style={
            accent
              ? ({
                  ["--bar-accent" as string]: accent.hex,
                  ["--bar-accent-soft" as string]: accent.soft,
                  ["--bar-accent-glow" as string]: accent.glow,
                } as React.CSSProperties)
              : undefined
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="region"
          aria-label="Resume lesson"
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.body}>
            <span className={styles.eyebrow}>
              {lang === "es" ? "Continúa" : "Pick up"}
            </span>
            <span className={styles.title}>
              {lang === "es" ? "Lección" : "Lesson"} {resume.step} ·{" "}
              {resume.title}
            </span>
          </span>
          <Link
            href={createLocalizedPath(resume.href)}
            className={styles.cta}
            aria-label={`${lang === "es" ? "Continuar" : "Resume"}: ${resume.title}`}
          >
            <PlayIcon fontSize="small" />
            <span>{lang === "es" ? "Continuar" : "Resume"}</span>
            <ArrowRight fontSize="small" />
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MMLResumeBar;
