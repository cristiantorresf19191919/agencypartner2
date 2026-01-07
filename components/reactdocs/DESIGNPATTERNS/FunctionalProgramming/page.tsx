"use client";

import { Card, Stack, Heading, Text, ButtonLink } from "@/components/ui";

export default function FunctionalProgrammingIndexPage() {
  const concepts = [
    {
      id: "introduction",
      title: "Introduction to Functional Programming",
      description: "Learn the core principles: pure functions, immutability, and higher-order functions. Understand how functional programming makes React code more predictable and testable.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "recursive-components",
      title: "Recursive Components",
      description: "Build recursive UI structures using functional programming principles. Create tree-like components that render themselves recursively with pure functions.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "compositions",
      title: "Function Compositions",
      description: "Combine small, reusable functions to build complex behaviors. Learn to compose functions using pipe and compose patterns for cleaner, more maintainable code.",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "partial-components",
      title: "Partial Components",
      description: "Use currying and partial application to create reusable, configurable components. Build flexible APIs that can be partially applied for different use cases.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" align="center" className="mb-12">
          <Heading className="text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            Functional Programming in React
          </Heading>
          <Text size="lg" className="text-center max-w-2xl text-zinc-600 dark:text-zinc-400">
            Master functional programming techniques in React. Learn how to write pure, composable,
            and maintainable code using functional programming principles.
          </Text>
        </Stack>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {concepts.map((concept) => (
            <a key={concept.id} href={`/DESIGNPATTERNS/FunctionalProgramming/${concept.id}`} className="block">
              <Card
                variant="elevated"
                className="p-6 hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <Stack direction="col" gap="md">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${concept.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                    {concept.id[0].toUpperCase()}
                  </div>
                  <div>
                    <Heading level={2} className="text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {concept.title}
                    </Heading>
                    <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                      {concept.description}
                    </Text>
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
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS">
            ← Back to Design Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

