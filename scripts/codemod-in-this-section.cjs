#!/usr/bin/env node
/**
 * Codemod: Replace inline "In this section:" infoBox with InThisSectionCallout.
 * Run from repo root: node scripts/codemod-in-this-section.cjs
 */
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "../app/[locale]/developer-section/blog");

function extractTopicLine(content) {
  const match = content.match(/In this section:<\/strong>\s*([^<]+)</);
  return match ? match[1].trim() : null;
}

function parseItems(line) {
  // Split by " • " or " {\"•\"} " or {"•"}
  const normalized = line
    .replace(/\s*\{\s*["']\\?["']\s*\}\s*/g, " • ")
    .replace(/\s*["']\\?["']\s*/g, " • ");
  return normalized
    .split(/\s*[•]\s*/)
    .map((s) => s.replace(/^\s*\{\s*["']([^"']*)["']\s*\}\s*$/, "$1").trim())
    .filter(Boolean);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("In this section:")) return false;

  const blockRe = /<div className=\{\`\$\{styles\.infoBox\} \$\{styles\.infoBoxPurple\} mt-2 mb-4\`\}>\s*<Text className=\{styles\.infoText\}>\s*\{["']📋["']\} <strong>In this section:<\/strong> ([^<]+)<\/Text>\s*<\/div>/g;

  let match;
  const replacements = [];
  while ((match = blockRe.exec(content)) !== null) {
    let topicLine = match[1].trim();
    topicLine = topicLine.replace(/\s*\{\s*["'][^"']*["']\s*\}\s*/g, (m) => {
      const inner = m.match(/\{\s*["']([^"']*)["']\s*\}/);
      return inner ? " " + inner[1] + " " : " • ";
    });
    const items = topicLine.split(/\s*•\s*/).map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) continue;
    const itemsStr = items.map((i) => `"${i.replace(/"/g, '\\"')}"`).join(", ");
    const replacement = `<InThisSectionCallout
              items={[${itemsStr}]}
              className={\`\${styles.infoBox} \${styles.infoBoxPurple} mt-2 mb-4\`}
              labelClassName={styles.infoText}
              listClassName={styles.inThisSectionList}
            />`;
    replacements.push({ from: match[0], to: replacement });
  }

  if (replacements.length === 0) return false;

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

  if (content.includes("InThisSectionCallout")) {
    const uiImport = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*["']@\/components\/ui["']/);
    if (uiImport && !uiImport[1].includes("InThisSectionCallout")) {
      content = content.replace(
        /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']@\/components\/ui["']/,
        (m) => m.replace("}", ", InThisSectionCallout }")
      );
    }
  }

  fs.writeFileSync(filePath, content);
  return true;
}

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of files) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "category") {
      walk(full);
    } else if (e.name === "page.tsx") {
      if (processFile(full)) {
        console.log("Updated:", path.relative(BLOG_DIR, full));
      }
    }
  }
}

walk(BLOG_DIR);
console.log("Done.");
