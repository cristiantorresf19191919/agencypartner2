"use client";

import { Card, Stack, Heading, Text, ButtonLink } from "@/components/ui";

export default function PatternsIndexPage() {
  const patterns = [
    {
      id: "containment",
      title: "Containment Pattern",
      description: "Use the children prop to create flexible, reusable wrapper components that accept any content.",
      examples: ["Card", "Modal", "Sidebar"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "slot",
      title: "Slot Pattern",
      description: "Use named slots to avoid prop drilling and create flexible layouts without tight coupling.",
      examples: ["Layout", "Dashboard", "Complex UIs"],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "render-props",
      title: "Render Props Pattern",
      description: "Pass functions as children to give components full control over rendering while managing state.",
      examples: ["Toggle", "Data Fetcher", "Mouse Tracker"],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "compound-components",
      title: "Compound Components",
      description: "Create multiple related components that share state through Context for maximum flexibility.",
      examples: ["Accordion", "Tabs", "Select"],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" align="center" className="mb-12">
          <Heading className="text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            React Composition Patterns
          </Heading>
          <Text size="lg" className="text-center max-w-2xl text-zinc-600 dark:text-zinc-400">
            Learn how to build flexible, reusable React components using composition patterns.
            Each pattern solves real-world problems and makes your code more maintainable.
          </Text>
        </Stack>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {patterns.map((pattern) => (
            <a href={`/patterns/${pattern.id}`} className="block">
              <Card
                key={pattern.id}
                variant="elevated"
                className="p-6 hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <Stack direction="col" gap="md">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pattern.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                    {pattern.id[0].toUpperCase()}
                  </div>
                  <div>
                    <Heading level={2} className="text-2xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pattern.title}
                    </Heading>
                    <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                      {pattern.description}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Examples:</Text>
                    <div className="flex flex-wrap gap-2">
                      {pattern.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm mt-2">
                    Learn more →
                  </div>
                </Stack>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/">
            ← Back to Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
