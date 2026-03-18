/**
 * Blog post creation dates derived from git commit history.
 * Maps post slug → ISO date string of the first commit that added the page.
 * Used by the blog hub to show posts sorted by date.
 */
export const blogPostDates: Record<string, string> = {
  "accessibility": "2026-01-07T14:19:26-05:00",
  "advanced-patterns": "2026-01-07T00:01:14-05:00",
  "advanced-react-concepts": "2026-01-07T00:01:14-05:00",
  "advanced-react-hooks": "2026-01-07T00:01:14-05:00",
  "animations": "2026-01-07T14:19:26-05:00",
  "api-layer": "2026-01-07T00:01:14-05:00",
  "authentication-authorization": "2026-01-07T15:25:23-05:00",
  "aws-cloud": "2026-01-07T15:25:23-05:00",
  "code-review": "2026-01-07T15:25:23-05:00",
  "code-splitting": "2026-01-07T14:19:26-05:00",
  "composition-pattern": "2026-01-07T00:01:14-05:00",
  "concurrent-features": "2026-01-07T14:19:26-05:00",
  "container-presentational-pattern": "2026-01-07T00:01:14-05:00",
  "design-patterns": "2026-01-07T00:01:14-05:00",
  "design-systems-component-libraries": "2026-01-07T15:25:23-05:00",
  "docker-zero-to-hero": "2026-01-29T01:52:23-05:00",
  "dsa-complete-guide": "2026-02-06T16:18:12-05:00",
  "edge-computing": "2026-01-07T15:25:23-05:00",
  "error-handling": "2026-01-07T14:19:26-05:00",
  "flutter-react-native-kotlin-multiplatform": "2026-01-07T15:25:23-05:00",
  "form-management": "2026-01-07T14:19:26-05:00",
  "frontend-design-patterns-2026": "2026-02-18T00:04:30-05:00",
  "git-worktrees-claude-code": "2026-03-18T00:35:35-05:00",
  "gradle-zero-to-hero": "2026-01-29T01:52:23-05:00",
  "how-llms-work": "2026-01-22T00:32:22-05:00",
  "internationalization": "2026-01-07T14:19:26-05:00",
  "interview-preparation": "2026-01-07T15:25:23-05:00",
  "kotlin-coroutines": "2026-01-29T01:52:23-05:00",
  "kotlin-multiplatform": "2026-01-07T13:30:06-05:00",
  "kotlin-spring-core": "2026-01-29T01:52:23-05:00",
  "kotlin-spring-mongodb-reactive": "2026-01-29T01:52:23-05:00",
  "kotlin-spring-reactivity": "2026-01-29T01:52:23-05:00",
  "kubernetes-zero-to-hero": "2026-01-29T01:52:23-05:00",
  "micro-frontends": "2026-01-07T14:19:26-05:00",
  "migration-patterns": "2026-01-07T14:19:26-05:00",
  "nextjs-best-practices": "2026-01-09T16:57:49-05:00",
  "performance-monitoring": "2026-01-07T14:19:26-05:00",
  "react-best-practices": "2026-01-19T13:34:34-05:00",
  "react-design-patterns": "2026-01-07T00:01:14-05:00",
  "react-internals": "2026-01-07T14:19:26-05:00",
  "react-patterns": "2026-01-07T00:01:14-05:00",
  "react-query": "2026-01-07T00:01:14-05:00",
  "refactoring-guru": "2026-01-22T00:32:22-05:00",
  "security": "2026-01-07T14:19:26-05:00",
  "server-components": "2026-01-07T14:19:26-05:00",
  "serverless-applications": "2026-03-18T00:35:38-05:00",
  "soft-skills": "2026-01-07T15:25:23-05:00",
  "solid-principles": "2026-01-07T00:01:14-05:00",
  "spring-reactive-programming": "2026-02-15T12:08:38-05:00",
  "state-management": "2026-01-07T00:01:14-05:00",
  "terraform": "2026-01-07T17:44:18-05:00",
  "testing-strategies": "2026-01-07T14:19:26-05:00",
  "typescript-advanced": "2026-01-07T14:19:26-05:00",
  "web-performance-core-web-vitals": "2026-01-07T15:25:23-05:00",
};

/** Get all posts flattened with their dates, sorted newest first */
export function getAllPostsByDate() {
  return Object.entries(blogPostDates)
    .map(([slug, dateStr]) => ({ slug, date: new Date(dateStr) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Format a date as "Jan 7, 2026" */
export function formatPostDate(date: Date, locale: string = "en"): string {
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Group posts by month-year, e.g. "March 2026" */
export function groupPostsByMonth(posts: { slug: string; date: Date }[], locale: string = "en") {
  const groups: { label: string; posts: { slug: string; date: Date }[] }[] = [];
  let currentLabel = "";

  for (const post of posts) {
    const label = post.date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
    });
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, posts: [] });
    }
    groups[groups.length - 1].posts.push(post);
  }

  return groups;
}
