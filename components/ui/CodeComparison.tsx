"use client";

import React from "react";
import { CodeEditor } from "./CodeEditor";
import { useLanguage } from "@/contexts/LanguageContext";

interface CodeComparisonProps {
  wrong: string;
  good: string;
  language?: string;
  kotlinExample?: string;
  showKotlin?: boolean;
}

export function CodeComparison({
  wrong,
  good,
  language = "tsx",
  kotlinExample,
  showKotlin = false,
}: CodeComparisonProps) {
  const { t } = useLanguage();
  
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
      
      <div className="flex flex-col gap-6 w-full block">
        <div className="w-full block">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
              {t("code-bad-example")}
            </span>
          </div>
          <div className="w-full block">
            <CodeEditor
              code={wrong}
              language={language}
              readOnly={false}
              height="auto"
            />
          </div>
        </div>
        
        <div className="w-full block">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
              {t("code-good-example")}
            </span>
          </div>
          <div className="w-full block">
            <CodeEditor
              code={good}
              language={language}
              readOnly={false}
              height="auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

