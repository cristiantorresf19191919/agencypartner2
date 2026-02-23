"use client";

import { useParams } from "next/navigation";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { getAndroidLessonById } from "@/lib/androidKotlinData";
import { CodeEditor } from "@/components/ui/CodeEditor";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";

export default function AndroidKotlinLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getAndroidLessonById(slug);
  const { createLocalizedPath } = useLocale();

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <a href={createLocalizedPath("/developer-section/android-kotlin")}>Back to levels</a>
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

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          {/* Left: description */}
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                Level {lesson.level}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{lesson.title}</h1>
            <div className={playStyles.descBody}>
              <p style={{ marginBottom: "12px", color: "#7cf4ff", fontWeight: 600 }}>
                {lesson.concept}
              </p>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>{lesson.description}</p>

              <h4 className={playStyles.descSub} style={{ marginTop: "24px" }}>
                📚 Explanation
              </h4>
              <p style={{ fontSize: "14px", color: "#c6d5ff", lineHeight: "1.6" }}>
                {lesson.explanation}
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "16px" }}>
                Note: Code execution is not available for Android/Kotlin in the browser. Use Android Studio to run and test the app.
              </p>
            </div>
          </div>

          {/* Right: shared CodeEditor (same design as other courses, with fullscreen) */}
          <div className={playStyles.editorColumn}>
            <div className={playStyles.editorColumnWrap}>
              <CodeEditor
                key={lesson.id}
                code={lesson.code}
                language="kotlin"
                collapsePanelsByDefault={false}
                compactToolbar
              />
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/android-kotlin")}>
            Back to Android Levels
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
