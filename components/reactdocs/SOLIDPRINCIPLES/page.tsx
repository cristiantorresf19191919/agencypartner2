"use client";

import { Card, Stack, Heading, Text, ButtonLink } from "@/components/ui";

export default function SOLIDPrinciplesIndexPage() {
  const principles = [
    {
      id: "SingleResponsibility",
      title: "Single Responsibility Principle",
      acronym: "SRP",
      description: "A class should have only one reason to change. Each class should have a single, well-defined responsibility.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "OpenClosed",
      title: "Open/Closed Principle",
      acronym: "OCP",
      description: "Software entities should be open for extension but closed for modification. Add new functionality through extension, not modification.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "LiskovSubstitution",
      title: "Liskov Substitution Principle",
      acronym: "LSP",
      description: "Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "InterfaceSegregation",
      title: "Interface Segregation Principle",
      acronym: "ISP",
      description: "Clients should not be forced to depend on interfaces they do not use. Create specific interfaces instead of general-purpose ones.",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "DependencyInversion",
      title: "Dependency Inversion Principle",
      acronym: "DIP",
      description: "High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" align="center" className="mb-12">
          <Heading className="text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            SOLID Principles
          </Heading>
          <Text size="lg" className="text-center max-w-2xl text-zinc-600 dark:text-zinc-400">
            Learn the five fundamental principles of object-oriented design that help create maintainable,
            flexible, and scalable software. Each principle includes bad and good examples.
          </Text>
        </Stack>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {principles.map((principle) => (
            <a key={principle.id} href={`/SOLIDPRINCIPLES/${principle.id}`} className="block">
              <Card
                variant="elevated"
                className="p-6 hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <Stack direction="col" gap="md">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${principle.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                    {principle.acronym[0]}
                  </div>
                  <div>
                    <Heading level={2} className="text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {principle.acronym}
                    </Heading>
                    <Heading level={3} className="text-lg mb-2 text-zinc-900 dark:text-zinc-100">
                      {principle.title}
                    </Heading>
                    <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                      {principle.description}
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
          <ButtonLink variant="secondary" href="/">
            ← Back to Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

