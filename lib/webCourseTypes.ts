/**
 * Shared types for React, TypeScript, and CSS courses (adapted from militalearning).
 * Lessons use Monaco editor with run/preview and validation.
 */

export interface WebCourseLesson {
  id: string;
  step: number;
  title: string;
  nextStep?: string;
  prevStep?: string;
  content: string[];
  codeExamples?: { code: string; comment?: string }[];
  defaultCode: string;
  /** CSS only: HTML structure for the preview (user edits CSS in defaultCode). */
  initialHTML?: string;
  /** CSS only: base CSS for .item etc.; combined with user's CSS in preview. */
  initialCSS?: string;
  validationLogic: (code: string, logs: string[], renderedHTML?: string) => { success: boolean; message?: string };
}

export type WebCourseKind = "react" | "typescript" | "css";
