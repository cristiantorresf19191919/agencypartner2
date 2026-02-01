/**
 * CSS Course - Lessons from militalearning adapted for agencypartner2.
 * Uses Monaco editor with CSS language; preview combines initialHTML + user CSS.
 */

import type { WebCourseLesson } from "./webCourseTypes";

function buildCssLessons(): WebCourseLesson[] {
  const raw: (Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
    content: [string, string];
    initialHTML: string;
    initialCSS: string;
  })[] = [
    {
      title: "CSS Flexbox 1: Introduction",
      content: [
        "Flexbox is a powerful way to lay out elements. Use `display: flex;` on the container to activate it.",
        "Add `display: flex;` to the container to activate flexbox.",
      ],
      defaultCode: `.container {\n  /* Add display: flex here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      initialCSS: `.item { background: #8A54F8; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("display: flex") || code.includes("display:flex"),
        message: "🎯 Flexbox activated!",
      }),
    },
    {
      title: "CSS Flexbox 2: flex-direction row",
      content: [
        "`flex-direction: row;` (default) places items in a horizontal row, left to right.",
        "Add `flex-direction: row;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add flex-direction: row here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>`,
      initialCSS: `.item { background: #F8549B; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("flex-direction: row") || code.includes("flex-direction:row"),
        message: "➡️ Row created!",
      }),
    },
    {
      title: "CSS Flexbox 3: flex-direction column",
      content: [
        "`flex-direction: column;` places items in a vertical column, top to bottom.",
        "Add `flex-direction: column;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add flex-direction: column here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      initialCSS: `.item { background: #8A54F8; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("flex-direction: column") || code.includes("flex-direction:column"),
        message: "⬇️ Column created!",
      }),
    },
    {
      title: "CSS Flexbox 4: justify-content center",
      content: [
        "`justify-content: center;` centers the items along the main axis.",
        "Add `justify-content: center;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add justify-content: center here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      initialCSS: `.item { background: #F8549B; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("justify-content: center") || code.includes("justify-content:center"),
        message: "🎯 Centered!",
      }),
    },
    {
      title: "CSS Flexbox 5: justify-content space-between",
      content: [
        "`justify-content: space-between;` distributes space between items.",
        "Add `justify-content: space-between;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add justify-content: space-between here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      initialCSS: `.item { background: #2EDC9B; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("justify-content: space-between") || code.includes("justify-content:space-between"),
        message: "↔️ Space between!",
      }),
    },
    {
      title: "CSS Flexbox 6: align-items center",
      content: [
        "`align-items: center;` centers items on the cross axis. Perfect for vertical centering.",
        "Add `align-items: center;` to the container. Give the container a height (e.g. 200px) so you can see the effect.",
      ],
      defaultCode: `.container {\n  display: flex;\n  height: 200px;\n  /* Add align-items: center here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      initialCSS: `.item { background: #F8549B; color: white; padding: 20px; margin: 5px; }`,
      validationLogic: (code) => ({
        success: code.includes("align-items: center") || code.includes("align-items:center"),
        message: "↕️ Vertically centered!",
      }),
    },
    {
      title: "CSS Flexbox 7: flex-wrap",
      content: [
        "`flex-wrap: wrap;` allows items to wrap to the next line when there's not enough space.",
        "Add `flex-wrap: wrap;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add flex-wrap: wrap here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n</div>`,
      initialCSS: `.item { background: #8A54F8; color: white; padding: 20px; margin: 5px; min-width: 80px; }`,
      validationLogic: (code) => ({
        success: code.includes("flex-wrap: wrap") || code.includes("flex-wrap:wrap"),
        message: "🌐 Wrap learned!",
      }),
    },
    {
      title: "CSS Flexbox 8: gap",
      content: [
        "`gap` adds space between flex items without using margin on each item.",
        "Add `gap: 16px;` to the container.",
      ],
      defaultCode: `.container {\n  display: flex;\n  /* Add gap: 16px here */\n}`,
      initialHTML: `<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>`,
      initialCSS: `.item { background: #2EDC9B; color: white; padding: 20px; }`,
      validationLogic: (code) => ({
        success: code.includes("gap:") && (code.includes("16px") || code.includes("1rem") || code.includes("gap")),
        message: "⚖️ Gap mastered!",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `css-${i + 1}`;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: i < raw.length - 1 ? `css-${i + 2}` : undefined,
      prevStep: i > 0 ? `css-${i}` : undefined,
      content: lesson.content,
    };
  });
}

export const CSS_COURSE_LESSONS = buildCssLessons();

export function getCssLessonById(slug: string): WebCourseLesson | undefined {
  return CSS_COURSE_LESSONS.find((l) => l.id === slug);
}
