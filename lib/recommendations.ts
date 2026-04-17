// lib/recommendations.ts
import { getStore } from "./devHubStore";

interface Recommendation {
  cardId: string;
  reasonKey: string;
}

const COURSE_TO_CHALLENGE: Record<string, string> = {
  "react-course": "react-challenges",
  "kotlin-course": "challenges",
  "typescript-course": "challenges",
};

const CHALLENGE_TO_INTERVIEW: Record<string, string> = {
  "react-challenges": "react-interview",
  "challenges": "backend-interview",
};

export function getRecommendations(): Recommendation[] {
  const store = getStore();
  const recent = store.recentVisits;
  if (recent.length < 3) return [];

  const visited = new Set(recent);
  const results: Recommendation[] = [];

  // Rule 1: Visited a course but not its challenges
  for (const [course, challenge] of Object.entries(COURSE_TO_CHALLENGE)) {
    if (visited.has(course) && !visited.has(challenge)) {
      results.push({ cardId: challenge, reasonKey: "rec-try-challenges" });
      break;
    }
  }

  // Rule 2: Did challenges but not interview prep
  if (results.length === 0) {
    for (const [challenge, interview] of Object.entries(CHALLENGE_TO_INTERVIEW)) {
      if (visited.has(challenge) && !visited.has(interview)) {
        results.push({ cardId: interview, reasonKey: "rec-try-interview" });
        break;
      }
    }
  }

  // Rule 3: React visitor but no TypeScript
  if (results.length === 0 && visited.has("react-course") && !visited.has("typescript-course")) {
    results.push({ cardId: "typescript-course", reasonKey: "rec-try-typescript" });
  }

  // Rule 4: Kotlin visitor but no Android/Spring
  if (results.length === 0 && visited.has("kotlin-course")) {
    if (!visited.has("android-kotlin")) {
      results.push({ cardId: "android-kotlin", reasonKey: "rec-try-android" });
    } else if (!visited.has("spring-reactive")) {
      results.push({ cardId: "spring-reactive", reasonKey: "rec-try-spring" });
    }
  }

  // Rule 5: Only blog, suggest a course
  if (results.length === 0 && visited.has("blog") && !recent.some((id) => id.endsWith("-course"))) {
    results.push({ cardId: "react-course", reasonKey: "rec-try-course" });
  }

  return results.slice(0, 2);
}
