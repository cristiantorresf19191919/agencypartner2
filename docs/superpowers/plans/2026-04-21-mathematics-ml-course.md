# Mathematics for Machine Learning — Interactive Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 53-lesson interactive course covering all chapters of *Mathematics for Machine Learning*, using Mafs for 2D and React Three Fiber for 3D visualizations, with 6 exercise types for concept reinforcement.

**Architecture:** Data-driven lessons defined in `lib/mmlCourseData.ts` feed into reusable visualization and exercise components rendered by `MMLLessonRenderer`. Pages follow the existing course pattern (landing page + `[slug]` lesson page) with `CourseSidebar` navigation. No code editor — single-column layout with inline visualizations and exercises.

**Tech Stack:** Next.js 16 (App Router), React 19, Mafs, React Three Fiber + Drei, KaTeX, Framer Motion, Tailwind CSS 4 + CSS Modules

**Spec:** `docs/superpowers/specs/2026-04-21-mathematics-ml-interactive-course-design.md`

---

## File Structure

```
# New files (create)
lib/mmlTypes.ts                                         # Type definitions for lessons, vizs, exercises
lib/mmlCourseData.ts                                    # All 53 lessons data

components/math-ml/MathContent.tsx                      # KaTeX inline/block math renderer
components/math-ml/MMLLessonRenderer.tsx                # Orchestrator: content + vizs + exercises
components/math-ml/MathML.module.css                    # Course-specific styles (emerald accent)

components/math-ml/exercises/MultipleChoice.tsx          # Radio quiz with feedback
components/math-ml/exercises/NumericInput.tsx             # Number input with tolerance
components/math-ml/exercises/MatrixInput.tsx              # NxM grid input
components/math-ml/exercises/VectorInput.tsx              # Vector components + optional Mafs preview
components/math-ml/exercises/SliderExplore.tsx            # Slider + viz + follow-up question
components/math-ml/exercises/DragToMatch.tsx              # Drag left-right pairing

components/math-ml/visualizations/VectorPlot2D.tsx       # Mafs: vectors, arrows, span, addition
components/math-ml/visualizations/MatrixTransform2D.tsx  # Mafs: 2x2 matrix on unit square
components/math-ml/visualizations/NormBalls.tsx           # Mafs: L1/L2/Linf toggle
components/math-ml/visualizations/FunctionPlot.tsx        # Mafs: f(x), tangent, Taylor
components/math-ml/visualizations/GradientField.tsx       # Mafs: 2D gradient arrows + contours
components/math-ml/visualizations/ProbabilityPlot.tsx     # Mafs: PMF/PDF curves + sliders
components/math-ml/visualizations/BayesUpdater.tsx        # Mafs: prior-posterior stepper
components/math-ml/visualizations/LinearRegressionPlot.tsx # Mafs: draggable points + fit line
components/math-ml/visualizations/SVMPlot.tsx             # Mafs: margin + support vectors
components/math-ml/visualizations/GMMPlot.tsx             # Mafs: clusters + EM stepping
components/math-ml/visualizations/Scene3D.tsx             # R3F Canvas wrapper
components/math-ml/visualizations/VectorPlot3D.tsx        # R3F: 3D arrows
components/math-ml/visualizations/MatrixTransform3D.tsx   # R3F: 3D cube transform
components/math-ml/visualizations/PCAScene.tsx            # R3F: point cloud + PC axes
components/math-ml/visualizations/KernelProjection3D.tsx  # R3F: 2D-3D kernel lift

app/[locale]/developer-section/mathematics-ml/page.tsx           # Landing page
app/[locale]/developer-section/mathematics-ml/[slug]/page.tsx    # Lesson player

# Modified files
lib/translations.ts                                      # Add MML translation keys (~line 1001 in es, ~end of en)
app/[locale]/developer-section/page.tsx                  # Add hub card to contentGroups course array (~line 150)
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Mafs, React Three Fiber, Drei, Three, and KaTeX**

```bash
npm install mafs three @react-three/fiber @react-three/drei katex
```

- [ ] **Step 2: Install KaTeX type definitions**

```bash
npm install --save-dev @types/three @types/katex
```

- [ ] **Step 3: Verify installation**

```bash
node -e "require('mafs'); require('three'); require('katex'); console.log('All deps OK')"
```

Expected: `All deps OK`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add mafs, react-three-fiber, drei, three, katex dependencies"
```

---

## Task 2: Define MML Types

**Files:**
- Create: `lib/mmlTypes.ts`

- [ ] **Step 1: Create the type definitions file**

```typescript
// lib/mmlTypes.ts

// --- Visualization configs ---

export type MMLVizType =
  | "vector-2d"
  | "matrix-transform-2d"
  | "norm-balls"
  | "function-plot"
  | "gradient-field"
  | "probability-plot"
  | "bayes-updater"
  | "linear-regression-plot"
  | "svm-plot"
  | "gmm-plot"
  | "vector-3d"
  | "matrix-transform-3d"
  | "eigenspace-3d"
  | "pca-3d"
  | "svd-3d"
  | "kernel-projection-3d";

export interface MMLVisualization {
  type: MMLVizType;
  title?: string;
  description?: string;
  config: Record<string, unknown>;
}

// --- Exercise configs ---

export type MMLExerciseType =
  | "multiple-choice"
  | "numeric-input"
  | "matrix-input"
  | "vector-input"
  | "slider-explore"
  | "drag-to-match";

interface MMLExerciseBase {
  type: MMLExerciseType;
  question: string;
  hint?: string;
  explanation: string;
}

export interface MMLMultipleChoice extends MMLExerciseBase {
  type: "multiple-choice";
  options: string[];
  correctIndex: number;
}

export interface MMLNumericInput extends MMLExerciseBase {
  type: "numeric-input";
  answer: number;
  tolerance?: number;
  unit?: string;
}

export interface MMLMatrixInput extends MMLExerciseBase {
  type: "matrix-input";
  rows: number;
  cols: number;
  answer: number[][];
  tolerance?: number;
}

export interface MMLVectorInput extends MMLExerciseBase {
  type: "vector-input";
  dimensions: number;
  answer: number[];
  tolerance?: number;
  showPreview?: boolean;
}

export interface MMLSliderExplore extends MMLExerciseBase {
  type: "slider-explore";
  vizType: MMLVizType;
  vizConfig: Record<string, unknown>;
  sliderParam: string;
  sliderLabel: string;
  sliderRange: [number, number];
  sliderStep?: number;
  followUpQuestion: string;
  followUpOptions: string[];
  correctFollowUpIndex: number;
}

export interface MMLDragToMatch extends MMLExerciseBase {
  type: "drag-to-match";
  leftItems: string[];
  rightItems: string[];
  correctPairs: [number, number][];
}

export type MMLExercise =
  | MMLMultipleChoice
  | MMLNumericInput
  | MMLMatrixInput
  | MMLVectorInput
  | MMLSliderExplore
  | MMLDragToMatch;

// --- Lesson ---

export interface MMLLesson {
  id: string;
  step: number;
  title: string;
  chapter: string;
  chapterNumber: number;
  nextStep?: string;
  prevStep?: string;
  content: string[];
  visualizations: MMLVisualization[];
  exercises: MMLExercise[];
  keyTakeaways?: string[];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit lib/mmlTypes.ts 2>&1 | head -5
```

Expected: No errors (or only unrelated errors from other files).

- [ ] **Step 3: Commit**

```bash
git add lib/mmlTypes.ts
git commit -m "feat(mml): add type definitions for MML course lessons, visualizations, and exercises"
```

---

## Task 3: Create MathContent Component (KaTeX Renderer)

**Files:**
- Create: `components/math-ml/MathContent.tsx`

- [ ] **Step 1: Create the KaTeX math renderer component**

This component parses `$...$` for inline math and `$$...$$` for block math within content strings, and also handles `**bold**` and backtick-code formatting (matching the existing `parseSectionBody` pattern from `app/[locale]/developer-section/react-course/[slug]/page.tsx:23-48`).

```typescript
// components/math-ml/MathContent.tsx
"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathContentProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div" | "li";
}

export function MathContent({ text, className, as: Tag = "p" }: MathContentProps) {
  const rendered = useMemo(() => parseContent(text), [text]);
  return <Tag className={className}>{rendered}</Tag>;
}

function renderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return latex;
  }
}

function parseContent(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const raw = match[1];
    if (raw.startsWith("$$") && raw.endsWith("$$")) {
      const html = renderKaTeX(raw.slice(2, -2), true);
      nodes.push(
        <span
          key={key++}
          className="mml-block-math"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (raw.startsWith("$") && raw.endsWith("$")) {
      const html = renderKaTeX(raw.slice(1, -1), false);
      nodes.push(
        <span
          key={key++}
          className="mml-inline-math"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (raw.startsWith("**") && raw.endsWith("**")) {
      nodes.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      nodes.push(
        <code key={key++} className="mml-inline-code">
          {raw.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/math-ml/MathContent.tsx
git commit -m "feat(mml): add MathContent component for KaTeX rendering in lesson text"
```

---

## Task 4: Create Course-Specific Styles

**Files:**
- Create: `components/math-ml/MathML.module.css`

- [ ] **Step 1: Create the CSS module with emerald accent theming**

This file provides styles specific to the MML course lesson pages: visualization containers, exercise cards, key takeaways, and chapter badges. It complements the shared `ChallengesPage.module.css` and `ChallengePlay.module.css` already used by other courses.

```css
/* components/math-ml/MathML.module.css */

/* --- Emerald accent tokens --- */
.accentBadge {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.accentStep {
  background: rgba(16, 185, 129, 0.2);
  color: #10B981;
}

/* --- Chapter badge on lesson page --- */
.chapterBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  margin-bottom: 8px;
}

/* --- Visualization container --- */
.vizContainer {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.04);
}

.vizTitle {
  padding: 12px 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #10B981;
}

.vizDescription {
  padding: 0 16px 8px;
  font-size: 13px;
  opacity: 0.7;
}

.vizBody {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vizBody3D {
  min-height: 400px;
}

/* --- Exercise section --- */
.exerciseSection {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.exerciseSectionTitle {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exerciseCard {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.exerciseQuestion {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.5;
}

.exerciseHint {
  font-size: 13px;
  color: #10B981;
  cursor: pointer;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.exerciseHintContent {
  font-size: 13px;
  padding: 8px 12px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 8px;
  margin-bottom: 12px;
}

.exerciseFeedback {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.feedbackCorrect {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
}

.feedbackIncorrect {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
}

/* --- Multiple choice --- */
.mcOption {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  margin-bottom: 8px;
  font-size: 14px;
}

.mcOption:hover {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.05);
}

.mcOptionSelected {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.mcRadio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mcRadioSelected {
  border-color: #10B981;
  background: #10B981;
}

.mcRadioDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

/* --- Numeric / Vector / Matrix inputs --- */
.numberInput {
  width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  font-size: 16px;
  font-family: monospace;
  text-align: center;
  outline: none;
  transition: border-color 0.15s ease;
}

.numberInput:focus {
  border-color: #10B981;
}

.matrixGrid {
  display: inline-grid;
  gap: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.matrixBracket {
  font-size: 48px;
  font-weight: 100;
  line-height: 1;
  color: rgba(255, 255, 255, 0.3);
}

/* --- Submit button --- */
.submitButton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: #10B981;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  margin-top: 12px;
}

.submitButton:hover {
  background: #059669;
}

.submitButton:active {
  transform: scale(0.98);
}

.submitButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* --- Drag to match --- */
.dragColumns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.dragItem {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  cursor: grab;
  font-size: 14px;
  transition: border-color 0.15s ease;
  margin-bottom: 8px;
}

.dragItemActive {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.dragTarget {
  min-height: 42px;
  border: 2px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 8px;
  transition: border-color 0.15s ease;
}

.dragTargetHover {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.05);
}

/* --- Key takeaways --- */
.takeaways {
  margin-top: 32px;
  padding: 20px 24px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
}

.takeawaysTitle {
  font-size: 16px;
  font-weight: 700;
  color: #10B981;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.takeawaysList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.takeawayItem {
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  gap: 8px;
}

.takeawayBullet {
  color: #10B981;
  flex-shrink: 0;
}

/* --- Slider --- */
.slider {
  width: 100%;
  accent-color: #10B981;
  margin: 8px 0;
}

.sliderValue {
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: #10B981;
}

/* --- Lesson content area (single column, no code editor) --- */
.lessonContent {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.lessonParagraph {
  font-size: 16px;
  line-height: 1.75;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.85);
}

/* --- Chapter accordion on landing page --- */
.chapterAccordion {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.chapterHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.15s ease;
}

.chapterHeader:hover {
  background: rgba(16, 185, 129, 0.05);
}

.chapterName {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chapterNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  font-size: 13px;
  font-weight: 700;
}

.chapterLessonCount {
  font-size: 13px;
  opacity: 0.5;
}

.chapterChevron {
  transition: transform 0.2s ease;
  opacity: 0.5;
}

.chapterChevronOpen {
  transform: rotate(90deg);
}

.chapterLessons {
  padding: 0 20px 16px;
}

/* --- Inline math / code overrides --- */
:global(.mml-inline-math) {
  display: inline;
}

:global(.mml-block-math) {
  display: block;
  text-align: center;
  margin: 16px 0;
  overflow-x: auto;
}

:global(.mml-inline-code) {
  font-family: monospace;
  font-size: 0.9em;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .lessonContent {
    padding: 0 16px;
  }

  .vizBody {
    min-height: 250px;
  }

  .vizBody3D {
    min-height: 300px;
  }

  .dragColumns {
    grid-template-columns: 1fr;
  }

  .numberInput {
    width: 64px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/math-ml/MathML.module.css
git commit -m "feat(mml): add emerald-themed CSS module for MML course"
```

---

## Task 5: Create Exercise Components

**Files:**
- Create: `components/math-ml/exercises/MultipleChoice.tsx`
- Create: `components/math-ml/exercises/NumericInput.tsx`
- Create: `components/math-ml/exercises/MatrixInput.tsx`
- Create: `components/math-ml/exercises/VectorInput.tsx`
- Create: `components/math-ml/exercises/SliderExplore.tsx`
- Create: `components/math-ml/exercises/DragToMatch.tsx`

- [ ] **Step 1: Create MultipleChoice exercise component**

```typescript
// components/math-ml/exercises/MultipleChoice.tsx
"use client";

import React, { useState } from "react";
import type { MMLMultipleChoice } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface MultipleChoiceProps {
  exercise: MMLMultipleChoice;
  onCorrect: () => void;
}

export function MultipleChoice({ exercise, onCorrect }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === exercise.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === exercise.correctIndex) {
      onCorrect();
    }
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      {exercise.hint && !submitted && (
        <HintToggle hint={exercise.hint} />
      )}

      <div>
        {exercise.options.map((option, i) => (
          <div
            key={i}
            className={`${styles.mcOption} ${selected === i ? styles.mcOptionSelected : ""}`}
            onClick={() => { if (!submitted) setSelected(i); }}
          >
            <div className={`${styles.mcRadio} ${selected === i ? styles.mcRadioSelected : ""}`}>
              {selected === i && <div className={styles.mcRadioDot} />}
            </div>
            <MathContent text={option} as="span" />
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Not quite. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}

function HintToggle({ hint }: { hint: string }) {
  const [showHint, setShowHint] = useState(false);
  return (
    <>
      <div className={styles.exerciseHint} onClick={() => setShowHint(!showHint)}>
        {showHint ? "Hide hint" : "Show hint"}
      </div>
      {showHint && (
        <div className={styles.exerciseHintContent}>
          <MathContent text={hint} as="span" />
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Create NumericInput exercise component**

```typescript
// components/math-ml/exercises/NumericInput.tsx
"use client";

import React, { useState } from "react";
import type { MMLNumericInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface NumericInputProps {
  exercise: MMLNumericInput;
  onCorrect: () => void;
}

export function NumericInput({ exercise, onCorrect }: NumericInputProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;
  const parsed = parseFloat(value);
  const isCorrect = !isNaN(parsed) && Math.abs(parsed - exercise.answer) <= tolerance;
  const isClose = !isNaN(parsed) && !isCorrect && Math.abs(parsed - exercise.answer) <= tolerance * 5;

  const handleSubmit = () => {
    if (value === "") return;
    setSubmitted(true);
    if (isCorrect) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          className={styles.numberInput}
          value={value}
          onChange={(e) => { if (!submitted) setValue(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          step="any"
        />
        {exercise.unit && <span style={{ fontSize: 14, opacity: 0.6 }}>{exercise.unit}</span>}
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={value === ""}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          {isCorrect ? (
            <MathContent text={exercise.explanation} as="span" />
          ) : (
            <MathContent
              text={isClose ? `Close! The answer is ${exercise.answer}. ${exercise.explanation}` : `The answer is ${exercise.answer}. ${exercise.explanation}`}
              as="span"
            />
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create MatrixInput exercise component**

```typescript
// components/math-ml/exercises/MatrixInput.tsx
"use client";

import React, { useState } from "react";
import type { MMLMatrixInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface MatrixInputProps {
  exercise: MMLMatrixInput;
  onCorrect: () => void;
}

export function MatrixInput({ exercise, onCorrect }: MatrixInputProps) {
  const [values, setValues] = useState<string[][]>(
    Array.from({ length: exercise.rows }, () =>
      Array.from({ length: exercise.cols }, () => "")
    )
  );
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;

  const checkCorrect = (): boolean => {
    for (let r = 0; r < exercise.rows; r++) {
      for (let c = 0; c < exercise.cols; c++) {
        const parsed = parseFloat(values[r][c]);
        if (isNaN(parsed) || Math.abs(parsed - exercise.answer[r][c]) > tolerance) {
          return false;
        }
      }
    }
    return true;
  };

  const isCorrect = submitted && checkCorrect();

  const handleChange = (r: number, c: number, v: string) => {
    if (submitted) return;
    const next = values.map((row) => [...row]);
    next[r][c] = v;
    setValues(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (checkCorrect()) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span className={styles.matrixBracket}>[</span>
        <div
          className={styles.matrixGrid}
          style={{ gridTemplateColumns: `repeat(${exercise.cols}, 80px)` }}
        >
          {values.map((row, r) =>
            row.map((val, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                className={styles.numberInput}
                value={val}
                onChange={(e) => handleChange(r, c, e.target.value)}
                step="any"
              />
            ))
          )}
        </div>
        <span className={styles.matrixBracket}>]</span>
      </div>

      {!submitted && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Expected: [${exercise.answer.map(r => r.join(", ")).join("; ")}]. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create VectorInput exercise component**

```typescript
// components/math-ml/exercises/VectorInput.tsx
"use client";

import React, { useState } from "react";
import type { MMLVectorInput } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface VectorInputProps {
  exercise: MMLVectorInput;
  onCorrect: () => void;
}

export function VectorInput({ exercise, onCorrect }: VectorInputProps) {
  const [values, setValues] = useState<string[]>(
    Array.from({ length: exercise.dimensions }, () => "")
  );
  const [submitted, setSubmitted] = useState(false);

  const tolerance = exercise.tolerance ?? 0.01;

  const checkCorrect = (): boolean => {
    for (let i = 0; i < exercise.dimensions; i++) {
      const parsed = parseFloat(values[i]);
      if (isNaN(parsed) || Math.abs(parsed - exercise.answer[i]) > tolerance) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (checkCorrect()) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span className={styles.matrixBracket}>(</span>
        <div style={{ display: "flex", gap: 6 }}>
          {values.map((val, i) => (
            <input
              key={i}
              type="number"
              className={styles.numberInput}
              value={val}
              onChange={(e) => {
                if (submitted) return;
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              }}
              step="any"
            />
          ))}
        </div>
        <span className={styles.matrixBracket}>)</span>
      </div>

      {!submitted && (
        <button className={styles.submitButton} onClick={handleSubmit}>
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${checkCorrect() ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent
            text={checkCorrect() ? exercise.explanation : `Expected: (${exercise.answer.join(", ")}). ${exercise.explanation}`}
            as="span"
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create SliderExplore exercise component**

```typescript
// components/math-ml/exercises/SliderExplore.tsx
"use client";

import React, { useState } from "react";
import type { MMLSliderExplore } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface SliderExploreProps {
  exercise: MMLSliderExplore;
  onCorrect: () => void;
}

export function SliderExplore({ exercise, onCorrect }: SliderExploreProps) {
  const [sliderValue, setSliderValue] = useState(
    (exercise.sliderRange[0] + exercise.sliderRange[1]) / 2
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === exercise.correctFollowUpIndex;
  const step = exercise.sliderStep ?? 0.1;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, opacity: 0.6 }}>{exercise.sliderLabel}</span>
          <span className={styles.sliderValue}>{sliderValue.toFixed(2)}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={exercise.sliderRange[0]}
          max={exercise.sliderRange[1]}
          step={step}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
          <MathContent text={exercise.followUpQuestion} as="span" />
        </div>
        {exercise.followUpOptions.map((option, i) => (
          <div
            key={i}
            className={`${styles.mcOption} ${selected === i ? styles.mcOptionSelected : ""}`}
            onClick={() => { if (!submitted) setSelected(i); }}
          >
            <div className={`${styles.mcRadio} ${selected === i ? styles.mcRadioSelected : ""}`}>
              {selected === i && <div className={styles.mcRadioDot} />}
            </div>
            <MathContent text={option} as="span" />
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Not quite. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create DragToMatch exercise component**

```typescript
// components/math-ml/exercises/DragToMatch.tsx
"use client";

import React, { useState } from "react";
import type { MMLDragToMatch } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import styles from "../MathML.module.css";

interface DragToMatchProps {
  exercise: MMLDragToMatch;
  onCorrect: () => void;
}

export function DragToMatch({ exercise, onCorrect }: DragToMatchProps) {
  const [pairs, setPairs] = useState<(number | null)[]>(
    Array.from({ length: exercise.leftItems.length }, () => null)
  );
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const checkCorrect = (): boolean => {
    for (const [left, right] of exercise.correctPairs) {
      if (pairs[left] !== right) return false;
    }
    return true;
  };

  const isCorrect = submitted && checkCorrect();
  const usedRight = new Set(pairs.filter((p): p is number => p !== null));

  const handleLeftClick = (leftIdx: number) => {
    if (submitted) return;
    setActiveDrag(leftIdx);
  };

  const handleRightClick = (rightIdx: number) => {
    if (submitted || activeDrag === null) return;
    const next = [...pairs];
    const prevLeft = next.indexOf(rightIdx);
    if (prevLeft !== -1) next[prevLeft] = null;
    next[activeDrag] = rightIdx;
    setPairs(next);
    setActiveDrag(null);
  };

  const handleSubmit = () => {
    if (pairs.some((p) => p === null)) return;
    setSubmitted(true);
    if (checkCorrect()) onCorrect();
  };

  return (
    <div className={styles.exerciseCard}>
      <div className={styles.exerciseQuestion}>
        <MathContent text={exercise.question} as="span" />
      </div>

      <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 12 }}>
        Click a left item, then click its match on the right.
      </p>

      <div className={styles.dragColumns}>
        <div>
          {exercise.leftItems.map((item, i) => (
            <div
              key={i}
              className={`${styles.dragItem} ${activeDrag === i ? styles.dragItemActive : ""}`}
              onClick={() => handleLeftClick(i)}
            >
              <MathContent text={item} as="span" />
              {pairs[i] !== null && (
                <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.5 }}>
                  matched
                </span>
              )}
            </div>
          ))}
        </div>
        <div>
          {exercise.rightItems.map((item, i) => (
            <div
              key={i}
              className={`${styles.dragTarget} ${activeDrag !== null && !usedRight.has(i) ? styles.dragTargetHover : ""}`}
              onClick={() => handleRightClick(i)}
            >
              <MathContent text={item} as="span" />
            </div>
          ))}
        </div>
      </div>

      {!submitted && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={pairs.some((p) => p === null)}
        >
          Check Matches
        </button>
      )}

      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <MathContent text={isCorrect ? exercise.explanation : `Not quite. ${exercise.explanation}`} as="span" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Commit all exercise components**

```bash
git add components/math-ml/exercises/
git commit -m "feat(mml): add 6 exercise components (multiple-choice, numeric, matrix, vector, slider, drag-to-match)"
```

---

## Task 6: Create 2D Visualization Components (Mafs)

**Files:**
- Create: `components/math-ml/visualizations/VectorPlot2D.tsx`
- Create: `components/math-ml/visualizations/MatrixTransform2D.tsx`
- Create: `components/math-ml/visualizations/NormBalls.tsx`
- Create: `components/math-ml/visualizations/FunctionPlot.tsx`
- Create: `components/math-ml/visualizations/GradientField.tsx`
- Create: `components/math-ml/visualizations/ProbabilityPlot.tsx`
- Create: `components/math-ml/visualizations/BayesUpdater.tsx`
- Create: `components/math-ml/visualizations/LinearRegressionPlot.tsx`
- Create: `components/math-ml/visualizations/SVMPlot.tsx`
- Create: `components/math-ml/visualizations/GMMPlot.tsx`

Each component receives its config via `config: Record<string, unknown>` and renders inside a `<Mafs>` container. All are `"use client"` components. Reference the Mafs docs (https://mafs.dev) for API — use `context7` MCP to fetch current Mafs documentation before implementing. Components should use the emerald accent `#10B981` for primary elements.

- [ ] **Step 1: Fetch current Mafs API docs using context7 MCP**

Before writing any Mafs component, resolve the Mafs library ID and fetch its current documentation to verify the exact API (component names, props, exports).

- [ ] **Step 2: Create VectorPlot2D** — Renders 2D vectors as arrows with optional draggable endpoints, vector addition, and span visualization. Uses `Mafs`, `Coordinates.Cartesian`, `Vector`, `useMovablePoint`.

- [ ] **Step 3: Create MatrixTransform2D** — Shows a 2x2 matrix transforming the unit square and basis vectors with slider interpolation from identity. Uses `Mafs`, `Coordinates.Cartesian`, `Polygon`, `Vector`.

- [ ] **Step 4: Create NormBalls** — Toggle L1/L2/Linf unit balls. Uses `Plot.Parametric` for each norm shape.

- [ ] **Step 5: Create FunctionPlot** — Plot arbitrary math functions with optional tangent line at a draggable point and Taylor approximation. Uses `Plot.OfX`, `useMovablePoint`.

- [ ] **Step 6: Create GradientField** — 2D vector field with gradient arrows, optional contours, and gradient descent trajectory. Uses `Vector` for arrows, `useMovablePoint` for start point.

- [ ] **Step 7: Create ProbabilityPlot** — Render probability distributions (Gaussian, Uniform, Beta, Exponential) with interactive parameter sliders. Uses `Plot.OfX`.

- [ ] **Step 8: Create BayesUpdater** — Interactive prior-to-posterior visualization that steps through observations using conjugate Gaussian updates.

- [ ] **Step 9: Create LinearRegressionPlot** — Draggable scatter points with least-squares fit line and optional residual lines.

- [ ] **Step 10: Create SVMPlot** — 2D classified points with separating hyperplane and margin visualization.

- [ ] **Step 11: Create GMMPlot** — 2D Gaussian mixture model with EM step-through visualization showing cluster assignments and centroids.

- [ ] **Step 12: Commit all 2D visualization components**

```bash
git add components/math-ml/visualizations/VectorPlot2D.tsx components/math-ml/visualizations/MatrixTransform2D.tsx components/math-ml/visualizations/NormBalls.tsx components/math-ml/visualizations/FunctionPlot.tsx components/math-ml/visualizations/GradientField.tsx components/math-ml/visualizations/ProbabilityPlot.tsx components/math-ml/visualizations/BayesUpdater.tsx components/math-ml/visualizations/LinearRegressionPlot.tsx components/math-ml/visualizations/SVMPlot.tsx components/math-ml/visualizations/GMMPlot.tsx
git commit -m "feat(mml): add 10 Mafs-based 2D visualization components"
```

---

## Task 7: Create 3D Visualization Components (React Three Fiber)

**Files:**
- Create: `components/math-ml/visualizations/Scene3D.tsx`
- Create: `components/math-ml/visualizations/VectorPlot3D.tsx`
- Create: `components/math-ml/visualizations/MatrixTransform3D.tsx`
- Create: `components/math-ml/visualizations/PCAScene.tsx`
- Create: `components/math-ml/visualizations/KernelProjection3D.tsx`

- [ ] **Step 1: Fetch current React Three Fiber and Drei docs using context7 MCP**

Before writing any R3F component, resolve the library IDs and fetch docs to verify the exact API.

- [ ] **Step 2: Create Scene3D wrapper** — Shared R3F Canvas wrapper with OrbitControls, lighting, grid, and responsive sizing. Uses `Canvas` from `@react-three/fiber`, `OrbitControls` and `Grid` from `@react-three/drei`.

- [ ] **Step 3: Create VectorPlot3D** — 3D arrows with labels for cross product and eigenvector visualization. Uses `Line` and `Text` from Drei.

- [ ] **Step 4: Create MatrixTransform3D** — Animate a 3x3 matrix transforming the unit cube with slider interpolation.

- [ ] **Step 5: Create PCAScene** — 3D point cloud with principal component axes and projection dimension selector.

- [ ] **Step 6: Create KernelProjection3D** — Lift 2D data into 3D using polynomial or RBF kernel, show separating hyperplane.

- [ ] **Step 7: Commit all 3D visualization components**

```bash
git add components/math-ml/visualizations/Scene3D.tsx components/math-ml/visualizations/VectorPlot3D.tsx components/math-ml/visualizations/MatrixTransform3D.tsx components/math-ml/visualizations/PCAScene.tsx components/math-ml/visualizations/KernelProjection3D.tsx
git commit -m "feat(mml): add 5 React Three Fiber 3D visualization components"
```

---

## Task 8: Create MMLLessonRenderer Orchestrator

**Files:**
- Create: `components/math-ml/MMLLessonRenderer.tsx`

- [ ] **Step 1: Create the lesson renderer**

This component takes an `MMLLesson` and renders content paragraphs via `MathContent`, visualization components via a lookup map (`vizType` to dynamically imported component), exercise components via a lookup map (`exerciseType` to dynamically imported component), key takeaways, and celebration overlay.

All viz and exercise imports must use `dynamic()` from `next/dynamic` with `{ ssr: false }` since Mafs and R3F require browser APIs.

The `VIZ_MAP` maps each `MMLVizType` string to its dynamically imported component. `eigenspace-3d` reuses `VectorPlot3D` with eigenvector configs. `svd-3d` reuses `MatrixTransform3D`.

The `ExerciseBlock` function uses a switch on `exercise.type` to render the appropriate component.

Uses `useCelebration()` from `@/components/Celebration/useCelebration` and `CelebrationOverlay` from `@/components/Celebration/CelebrationOverlay`.

- [ ] **Step 2: Commit**

```bash
git add components/math-ml/MMLLessonRenderer.tsx
git commit -m "feat(mml): add MMLLessonRenderer orchestrator with dynamic viz/exercise loading"
```

---

## Task 9: Create Initial Course Data (Chapters 1-2, Lessons 1-10)

**Files:**
- Create: `lib/mmlCourseData.ts`

- [ ] **Step 1: Create the course data file with builder function and first 10 lessons**

Create `lib/mmlCourseData.ts` with the `buildMMLLessons()` pattern matching `lib/reactCourseData.ts:14-80`. Include all 10 lessons for Chapters 1 and 2 (Introduction + Linear Algebra). Each lesson needs `title`, `chapter`, `chapterNumber`, `content` (paragraphs with $LaTeX$), `visualizations` (typed configs), `exercises` (typed configs), and `keyTakeaways`.

The file should export:
```typescript
export const MML_COURSE_LESSONS: MMLLesson[] = buildMMLLessons();
export function getMMLLessonById(slug: string): MMLLesson | undefined {
  return MML_COURSE_LESSONS.find(l => l.id === slug);
}
```

Content should be original educational text covering the mathematical concepts with LaTeX notation. Each lesson needs 3-6 content paragraphs, 1-3 visualization configs, 2-4 exercise configs, and 2-3 key takeaways.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit lib/mmlCourseData.ts 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add lib/mmlCourseData.ts
git commit -m "feat(mml): add course data for chapters 1-2 (lessons 1-10, Introduction + Linear Algebra)"
```

---

## Task 10: Extend Course Data (Chapters 3-7, Lessons 11-41)

**Files:**
- Modify: `lib/mmlCourseData.ts`

- [ ] **Step 1: Add lessons 11-41 to the raw array in `buildMMLLessons()`**

Add lessons for:
- Chapter 3: Analytic Geometry (lessons 10-17)
- Chapter 4: Matrix Decompositions (lessons 18-24)
- Chapter 5: Vector Calculus (lessons 25-31)
- Chapter 6: Probability and Distributions (lessons 32-38)
- Chapter 7: Continuous Optimization (lessons 39-41)

Each lesson follows the same structure with appropriate math content, viz configs, and exercises.

- [ ] **Step 2: Commit**

```bash
git add lib/mmlCourseData.ts
git commit -m "feat(mml): add course data for chapters 3-7 (lessons 11-41, Geometry through Optimization)"
```

---

## Task 11: Extend Course Data (Chapters 8-12, Lessons 42-53)

**Files:**
- Modify: `lib/mmlCourseData.ts`

- [ ] **Step 1: Add lessons 42-53 to complete the course**

Add lessons for:
- Chapter 8: When Models Meet Data (lessons 42-44)
- Chapter 9: Linear Regression (lessons 45-47)
- Chapter 10: PCA (lessons 48-49)
- Chapter 11: Gaussian Mixture Models (lessons 50-51)
- Chapter 12: SVMs (lessons 52-53)

- [ ] **Step 2: Commit**

```bash
git add lib/mmlCourseData.ts
git commit -m "feat(mml): complete course data with chapters 8-12 (lessons 42-53, ML Applications)"
```

---

## Task 12: Create Landing Page

**Files:**
- Create: `app/[locale]/developer-section/mathematics-ml/page.tsx`

- [ ] **Step 1: Create the landing page with chapter accordion layout**

Follow the pattern from `app/[locale]/developer-section/react-course/page.tsx` but with chapter-based accordion grouping instead of a flat grid. Uses `MML_COURSE_LESSONS` from `lib/mmlCourseData.ts`, emerald accent `#10B981`, and shared CSS from `../challenges/ChallengesPage.module.css` + `@/components/math-ml/MathML.module.css`.

Key patterns to match:
- `useLocale()` for `locale` and `createLocalizedPath()`
- `useLanguage()` for `t()` translation function
- `DeveloperHeader` + `Footer`
- `motion.h1` / `motion.p` for hero animations
- `styles.page`, `styles.heroSection`, `styles.pill`, `styles.title`, `styles.subtitle`, `styles.heroBadges`, `styles.badge`, `styles.listSection`, `styles.grid`, `styles.card` from ChallengesPage.module.css

Group lessons by `chapterNumber` into collapsible accordion sections using `AnimatePresence` for open/close animation. Each chapter header shows chapter number badge, name, and lesson count.

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/developer-section/mathematics-ml/page.tsx"
git commit -m "feat(mml): add landing page with chapter accordion layout"
```

---

## Task 13: Create Lesson Player Page

**Files:**
- Create: `app/[locale]/developer-section/mathematics-ml/[slug]/page.tsx`

- [ ] **Step 1: Create the lesson player page**

Follow the pattern from `app/[locale]/developer-section/react-course/[slug]/page.tsx` but replace the CodeEditor split with the single-column `MMLLessonRenderer`.

Key structure:
- `useParams()` to get `slug`
- `getMMLLessonById(slug)` to find the lesson
- `CourseSidebar` with props: `lessons={MML_COURSE_LESSONS}`, `coursePath="/developer-section/mathematics-ml"`, `courseTitle="Mathematics for ML"`, `courseIcon={<FunctionsIcon />}`, `currentSlug={slug}`, `collapsed/onToggle` state
- `MMLLessonRenderer` with `lesson={lesson}`
- Not-found fallback matching `playStyles.notFound` pattern
- Next/prev lesson navigation at the bottom using `lesson.prevStep`/`lesson.nextStep`
- Import `FunctionsIcon` from `@mui/icons-material`

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/developer-section/mathematics-ml/[slug]/page.tsx"
git commit -m "feat(mml): add lesson player page with MMLLessonRenderer and sidebar navigation"
```

---

## Task 14: Add Translation Keys

**Files:**
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add MML translation keys to the `es` locale**

Add before the closing `},` of the `es` object (around line 1001):

```typescript
    'mml-card-title': 'Matematicas para Machine Learning',
    'mml-card-desc': 'Visualizaciones interactivas de algebra lineal, calculo, probabilidad y aplicaciones de ML',
    'mml-course-pill': 'Matematicas Interactivas',
    'mml-course-title': 'Matematicas para Machine Learning',
    'mml-course-subtitle': 'Domina las matematicas detras del ML con visualizaciones interactivas 2D y 3D',
```

- [ ] **Step 2: Add MML translation keys to the `en` locale**

Add before the closing `},` of the `en` object (at the end of the file):

```typescript
    'mml-card-title': 'Mathematics for Machine Learning',
    'mml-card-desc': 'Interactive visualizations covering linear algebra, calculus, probability, and ML applications',
    'mml-course-pill': 'Interactive Math',
    'mml-course-title': 'Mathematics for Machine Learning',
    'mml-course-subtitle': 'Master the math behind ML with interactive 2D and 3D visualizations',
```

- [ ] **Step 3: Commit**

```bash
git add lib/translations.ts
git commit -m "feat(mml): add translation keys for MML course (en + es)"
```

---

## Task 15: Add Hub Card

**Files:**
- Modify: `app/[locale]/developer-section/page.tsx`

- [ ] **Step 1: Add the `Functions` icon import**

In the `@mui/icons-material` import block (around line 15-45 of `app/[locale]/developer-section/page.tsx`), add `Functions as FunctionsIcon` to the import list.

- [ ] **Step 2: Add the MML course card to the `course` contentGroups section**

In the `contentGroups` array, inside the `{ id: "course", ... }` group's `cards` array (around line 150-263), add this card object:

```typescript
      {
        id: "mathematics-ml",
        category: "course",
        href: "/developer-section/mathematics-ml",
        icon: FunctionsIcon,
        titleKey: "mml-card-title",
        descKey: "mml-card-desc",
        ctaKey: "start-course",
        difficulty: "intermediate",
        tags: ["general"],
      },
```

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/developer-section/page.tsx"
git commit -m "feat(mml): add Mathematics for ML card to developer hub"
```

---

## Task 16: Build Verification and Fix

**Files:**
- None (verification only, may require fixes)

- [ ] **Step 1: Run the build**

```bash
npm run build 2>&1 | tail -30
```

- [ ] **Step 2: Fix any TypeScript or build errors**

Address each error by reading the error message, finding the file and line, and making targeted fixes. Common issues to watch for:
- Mafs API differences (check `mafs` exports match component usage)
- R3F type mismatches
- Missing CSS module class names
- Import path typos

- [ ] **Step 3: Run dev server and verify pages load**

```bash
npm run dev
```

Then verify in browser:
- `http://localhost:3000/es/developer-section/mathematics-ml` loads landing page
- `http://localhost:3000/es/developer-section/mathematics-ml/mml-1` loads first lesson

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(mml): resolve build errors in MML course"
```

---

## Task 17: Final Integration Test

**Files:**
- None (manual verification)

- [ ] **Step 1: Verify landing page renders** — Open `/es/developer-section/mathematics-ml`, check hero section, chapter accordions, lesson cards, navigation links.

- [ ] **Step 2: Verify a lesson page renders** — Open `/es/developer-section/mathematics-ml/mml-1`, check sidebar, content with KaTeX, visualizations, exercises, celebration on correct answers, next/prev navigation.

- [ ] **Step 3: Verify hub card appears** — Open `/es/developer-section`, check the MML card in the courses section.

- [ ] **Step 4: Test a 3D lesson** — Navigate to a lesson with R3F (e.g., rotations `mml-17`), verify 3D scene loads with OrbitControls and sliders.

- [ ] **Step 5: Final commit if needed**

```bash
git add -A
git commit -m "feat(mml): Mathematics for Machine Learning interactive course complete"
```
