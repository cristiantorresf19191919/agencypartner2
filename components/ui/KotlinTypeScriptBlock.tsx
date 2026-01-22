"use client";

import React from "react";
import { CodeEditor } from "./CodeEditor";

interface KotlinTypeScriptBlockProps {
  kotlinCode: string;
  typescriptCode: string;
}

export function KotlinTypeScriptBlock({
  kotlinCode,
  typescriptCode,
}: KotlinTypeScriptBlockProps) {
  return (
    <div className="space-y-6 w-full block">
      <div className="w-full block">
        <div className="mb-2">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
            Kotlin
          </span>
        </div>
        <div className="w-full block">
          <CodeEditor
            code={kotlinCode}
            language="kotlin"
            readOnly={false}
            height="auto"
          />
        </div>
      </div>
      <div className="w-full block">
        <div className="mb-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            TypeScript
          </span>
        </div>
        <div className="w-full block">
          <CodeEditor
            code={typescriptCode}
            language="typescript"
            readOnly={false}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}
