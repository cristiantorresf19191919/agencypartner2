"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowForward as ArrowRight } from "@mui/icons-material";
import { useCourseProgress } from "@/lib/useCourseProgress";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./ContinueLearning.module.css";

interface CourseMeta {
  id: string;
  title: { en: string; es: string };
  /** Path the lesson hrefs sit under, used to render the course-level CTA. */
  basePath: string;
  totalLessons?: number;
  accent?: string;
}

const COURSES: CourseMeta[] = [
  {
    id: "kotlin-course",
    title: { en: "Kotlin", es: "Kotlin" },
    basePath: "/developer-section/kotlin-course",
    accent: "#7cf4ff",
  },
  {
    id: "react-course",
    title: { en: "React", es: "React" },
    basePath: "/developer-section/react-course",
    accent: "#61dafb",
  },
  {
    id: "typescript-course",
    title: { en: "TypeScript", es: "TypeScript" },
    basePath: "/developer-section/typescript-course",
    accent: "#3178c6",
  },
  {
    id: "css-course",
    title: { en: "CSS", es: "CSS" },
    basePath: "/developer-section/css-course",
    accent: "#f59e0b",
  },
  {
    id: "java-course",
    title: { en: "Java", es: "Java" },
    basePath: "/developer-section/java-course",
    accent: "#fb7185",
  },
  {
    id: "azure-course",
    title: { en: "Azure", es: "Azure" },
    basePath: "/developer-section/azure-course",
    accent: "#5b8def",
  },
  {
    id: "mobx-course",
    title: { en: "MobX", es: "MobX" },
    basePath: "/developer-section/mobx-course",
    accent: "#ec4899",
  },
  {
    id: "apollo-graphql",
    title: { en: "Apollo GraphQL", es: "Apollo GraphQL" },
    basePath: "/developer-section/apollo-graphql",
    accent: "#a855f7",
  },
  {
    id: "kotlin-java-interop",
    title: { en: "Kotlin ↔ Java", es: "Kotlin ↔ Java" },
    basePath: "/developer-section/kotlin-java-interop",
    accent: "#86efac",
  },
  {
    id: "android-kotlin",
    title: { en: "Android (Kotlin)", es: "Android (Kotlin)" },
    basePath: "/developer-section/android-kotlin",
    accent: "#34d399",
  },
  {
    id: "mathematics-ml",
    title: { en: "Math for ML", es: "Matemáticas para ML" },
    basePath: "/developer-section/mathematics-ml",
    accent: "#c4b5fd",
  },
];

function timeAgo(ts: number, lang: "en" | "es"): string {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return lang === "es" ? "ahora mismo" : "just now";
  if (min < 60) return lang === "es" ? `hace ${min} min` : `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return lang === "es" ? `hace ${hr} h` : `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return lang === "es" ? `hace ${d} d` : `${d}d ago`;
  return new Date(ts).toLocaleDateString(lang === "es" ? "es-ES" : "en-US");
}

export function ContinueLearning() {
  const { progress } = useCourseProgress();
  const { createLocalizedPath } = useLocale();
  const { language } = useLanguage();
  const lang: "en" | "es" = language === "es" ? "es" : "en";

  const items = useMemo(() => {
    const recent = Object.entries(progress)
      .filter(([, p]) => p.lastVisitedAt && p.lastLessonHref)
      .sort(([, a], [, b]) => (b.lastVisitedAt ?? 0) - (a.lastVisitedAt ?? 0))
      .slice(0, 6);
    return recent.map(([courseId, p]) => {
      const meta = COURSES.find((c) => c.id === courseId);
      return { courseId, meta, p };
    });
  }, [progress]);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-label={lang === "es" ? "Continuar aprendiendo" : "Continue learning"}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          {lang === "es" ? "Continúa donde lo dejaste" : "Pick up where you left off"}
        </span>
        <h2 className={styles.title}>
          {lang === "es" ? "Continuar aprendiendo" : "Continue learning"}
        </h2>
      </header>

      <div className={styles.rail} role="list">
        {items.map(({ courseId, meta, p }) => {
          const accent = meta?.accent ?? "#7cf4ff";
          const courseLabel = meta?.title[lang] ?? courseId;
          const lessonHref = p.lastLessonHref ?? meta?.basePath ?? "/developer-section";
          const localized = createLocalizedPath(lessonHref);
          return (
            <Link
              key={courseId}
              href={localized}
              className={styles.card}
              role="listitem"
              style={{ borderColor: `${accent}55`, boxShadow: `0 18px 36px -22px ${accent}55` }}
            >
              <span className={styles.courseTag} style={{ color: accent, borderColor: `${accent}66` }}>
                {courseLabel}
              </span>
              <h3 className={styles.cardTitle}>{p.lastLessonTitle ?? "Lesson"}</h3>
              <div className={styles.cardFooter}>
                <span className={styles.timeAgo}>
                  {p.lastVisitedAt ? timeAgo(p.lastVisitedAt, lang) : ""}
                </span>
                <span className={styles.cta} style={{ color: accent }}>
                  {lang === "es" ? "Continuar" : "Resume"} <ArrowRight fontSize="inherit" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default ContinueLearning;
