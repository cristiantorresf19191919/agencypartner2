"use client";

import React, { useState, useEffect } from "react";
import { CodeEditor } from "./CodeEditor";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./CodeComparison.module.css";

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

interface CodeComparisonProps {
  wrong: string;
  good: string;
  language?: string;
  kotlinExample?: string;
  showKotlin?: boolean;
  /** 2–3 bullets above the "bad" example (e.g. "Why it's wrong", "What breaks"). */
  whatToNoticeBad?: string[];
  /** 2–3 bullets above the "good" example (e.g. "What we improve"). */
  whatToNoticeGood?: string[];
  /** Use blog-friendly defaults: collapsed panels, compact toolbar, max code height. */
  blogMode?: boolean;
  /** Unique id for this comparison so React keeps wrong/good panels distinct (avoids both showing same code). */
  comparisonId?: string;
}

export function CodeComparison({
  wrong,
  good,
  language = "tsx",
  kotlinExample,
  showKotlin = false,
  whatToNoticeBad,
  whatToNoticeGood,
  blogMode = true,
  comparisonId,
}: CodeComparisonProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isReact = ["tsx", "jsx", "react"].includes((language ?? "tsx").toLowerCase());
  const baseKey = comparisonId ?? "cmp";

  const sharedEditorProps = blogMode
    ? {
      collapsePanelsByDefault: true,
      compactToolbar: true,
      maxCodeHeight: 800,
      height: "auto" as const,
      enableMultiFile: true,
    }
    : { height: "auto" as const, enableMultiFile: true };

  return (
    <div className="space-y-6 w-full block">
      {showKotlin && kotlinExample && (
        <div className="w-full block">
          <div className="mb-2">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              {t("code-origin-oop")}
            </span>
          </div>
          <div className="w-full block">
            <CodeEditor
              code={kotlinExample}
              language="kotlin"
              readOnly={false}
              height="auto"
            />
          </div>
        </div>
      )}

      <div className={styles.wrapper}>
        <div className="w-full block" key={`${baseKey}-bad`}>
          {whatToNoticeBad && whatToNoticeBad.length > 0 && (
            <div className={`${styles.noticeCard} ${styles.noticeCardBad}`}>
              <p className={`${styles.noticeLabel} ${styles.noticeLabelBad}`}>
                {t("code-what-to-notice")}
              </p>
              <ul className={styles.noticeList}>
                {whatToNoticeBad.map((item, i) => (
                  <li key={i} className={styles.noticeItem}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="w-full block">
            <CodeEditor
              key={`${baseKey}-bad-editor`}
              code={wrong}
              language={language}
              readOnly={false}
              exampleVariant="bad"
              exampleBadgeLabel={t("code-bad-example")}
              {...sharedEditorProps}
            />
          </div>
        </div>

        <div className="w-full block" key={`${baseKey}-good`}>
          {whatToNoticeGood && whatToNoticeGood.length > 0 && (
            <div className={`${styles.noticeCard} ${styles.noticeCardGood}`}>
              <p className={`${styles.noticeLabel} ${styles.noticeLabelGood}`}>
                {t("code-what-to-notice")}
              </p>
              <ul className={styles.noticeList}>
                {whatToNoticeGood.map((item, i) => (
                  <li key={i} className={styles.noticeItem}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="w-full block">
            <CodeEditor
              key={`${baseKey}-good-editor`}
              code={good}
              language={language}
              readOnly={false}
              exampleVariant="good"
              exampleBadgeLabel={t("code-good-example")}
              {...sharedEditorProps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
