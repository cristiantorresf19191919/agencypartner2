"use strict";
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "..", "app", "[locale]", "developer-section", "blog");

function idToTitle(id) {
  return id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Skip if no section pattern
  const sectionRe = /<section\s+id="([^"]+)"\s+className=\{styles\.section\}>/g;
  const matches = [...content.matchAll(sectionRe)];
  if (matches.length === 0) return false;

  // Skip blog listing and category slug
  const rel = path.relative(BLOG_DIR, filePath);
  if (rel === "page.tsx" || rel.startsWith("category")) return false;

  // Add FullscreenSection to @/components/ui import if missing
  if (!content.includes("FullscreenSection")) {
    content = content.replace(
      /\}\s+from\s+["']@\/components\/ui["']/,
      ", FullscreenSection } from \"@/components/ui\""
    );
  }

  // Replace each section with FullscreenSection (capture id from either order)
  content = content.replace(
    sectionRe,
    (_, id1, id2) => {
      const id = id1 || id2;
      return `<FullscreenSection id="${id}" title="${idToTitle(id)}" sectionClassName={styles.section}>`;
    }
  );

  // Replace </section> with </FullscreenSection> (only in files we changed; count to be safe)
  const closeCount = (content.match(/<\/section>/g) || []).length;
  const openCount = (content.match(/<FullscreenSection\s+/g) || []).length;
  if (closeCount >= openCount) {
    content = content.replace(/<\/section>/g, "</FullscreenSection>");
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name === "page.tsx") {
      if (migrateFile(full)) console.log("Migrated:", full);
    }
  }
}

walk(BLOG_DIR);
console.log("Done.");
