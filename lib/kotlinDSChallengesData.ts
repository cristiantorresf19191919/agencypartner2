/**
 * Kotlin Data Structures challenges — stub data file.
 * TODO: populate with full challenge content.
 */

export interface DSTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  whyLearn: string;
  realWorldUse: string;
  bigO: string;
}

export interface KotlinDSChallenge {
  id: string;
  title: string;
  topicId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  conceptOverview: string;
  maxScore: number;
  starterCode: string;
  solution: string;
  explanation: string;
  hints: string[];
  expectedOutput: string;
  testCases: { description: string; validate: (code: string) => boolean }[];
}

export const DS_TOPICS: DSTopic[] = [
  {
    id: "arrays",
    name: "Arrays & Lists",
    description: "Master array manipulation and list operations in Kotlin.",
    icon: "📊",
    color: "#4caf50",
    whyLearn: "Arrays are the most fundamental data structure — nearly every algorithm starts with one.",
    realWorldUse: "Database rows, API response lists, image pixel buffers, batch processing.",
    bigO: "Access O(1), Search O(n), Insert O(n), Delete O(n)",
  },
];

export const DS_CHALLENGES: KotlinDSChallenge[] = [];

export function getDSChallengesByTopic(topicId: string): KotlinDSChallenge[] {
  return DS_CHALLENGES.filter((c) => c.topicId === topicId);
}

export function getDSChallengeById(id: string): KotlinDSChallenge | undefined {
  return DS_CHALLENGES.find((c) => c.id === id);
}
