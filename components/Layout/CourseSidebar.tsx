"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import playStyles from "@/app/[locale]/developer-section/challenges/[slug]/ChallengePlay.module.css";

interface CourseSidebarLesson {
  id: string;
  step: number;
  title: string;
}

interface CourseSidebarProps {
  lessons: CourseSidebarLesson[];
  coursePath: string;
  courseTitle: string;
  courseIcon: React.ReactNode;
  accentClassName?: string;
  currentSlug: string;
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  /** Optional: translate lesson titles based on locale */
  getLessonTitle?: (lesson: CourseSidebarLesson) => string;
}

/* ─── Animation variants ───────────────────────────── */

const navListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
  exit: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -24, scaleX: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scaleX: 1,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
  exit: { opacity: 0, x: -16, scaleX: 0.95, transition: { duration: 0.15 } },
};

export default function CourseSidebar({
  lessons,
  coursePath,
  courseTitle,
  courseIcon,
  accentClassName,
  currentSlug,
  collapsed,
  onToggle,
  getLessonTitle,
}: CourseSidebarProps) {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  /* Hide global FABs when drawer is open */
  useEffect(() => {
    if (!collapsed) {
      document.body.setAttribute("data-course-drawer-open", "true");
    } else {
      document.body.removeAttribute("data-course-drawer-open");
    }
    return () => document.body.removeAttribute("data-course-drawer-open");
  }, [collapsed]);

  return (
    <>
      <aside
        className={`${playStyles.courseSidebar} ${accentClassName ?? ""} ${collapsed ? playStyles.courseSidebarCollapsed : ""}`}
        aria-label={`${courseTitle} navigation`}
      >
        <div className={playStyles.courseSidebarHeader}>
          <button
            type="button"
            className={playStyles.courseSidebarToggle}
            onClick={() => onToggle(!collapsed)}
            aria-label={collapsed ? t("sidebar-expand") : t("sidebar-collapse")}
            title={collapsed ? t("sidebar-expand") : t("sidebar-collapse")}
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </button>
          {!collapsed && (
            <div className={playStyles.courseSidebarTitle}>
              {courseIcon}
              <span>{courseTitle}</span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.nav
              className={playStyles.courseNav}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="course-nav"
            >
              <motion.ul
                className={playStyles.courseNavList}
                variants={navListVariants}
              >
                {lessons.map((l) => {
                  const isActive = currentSlug === l.id;
                  const title = getLessonTitle ? getLessonTitle(l) : l.title;
                  return (
                    <motion.li
                      key={l.id}
                      className={playStyles.courseNavItemWrap}
                      variants={navItemVariants}
                      style={{ originX: 0 }}
                    >
                      <Link
                        href={createLocalizedPath(`${coursePath}/${l.id}`)}
                        className={`${playStyles.courseNavItem} ${isActive ? playStyles.courseNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={playStyles.courseNavStep}>
                          {t("course-step")} {l.step}
                        </span>
                        <span className={playStyles.courseNavLabel}>{title}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </aside>

      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className={playStyles.courseMainBackdrop}
          aria-hidden
          onClick={() => onToggle(true)}
          onKeyDown={(e) => e.key === "Escape" && onToggle(true)}
        />
      )}

      {/* Mobile sticky "Chapters" bar */}
      <div className={playStyles.courseChaptersBar} aria-hidden>
        <button
          type="button"
          className={playStyles.courseChaptersBarBtn}
          onClick={() => onToggle(false)}
          aria-label={t("course-chapters") ?? "Chapters"}
        >
          {courseIcon}
          {t("course-chapters") ?? "Chapters"}
        </button>
      </div>
    </>
  );
}
