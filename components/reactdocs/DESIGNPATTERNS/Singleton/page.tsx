"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Singleton Pattern - Anti-pattern in React
// Singleton can cause issues in React due to module system and testing difficulties

class DatabaseConnectionBad {
  private static instance: DatabaseConnectionBad | null = null;
  private connectionCount: number = 0;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): DatabaseConnectionBad {
    if (!DatabaseConnectionBad.instance) {
      DatabaseConnectionBad.instance = new DatabaseConnectionBad();
    }
    return DatabaseConnectionBad.instance;
  }

  connect(): void {
    this.connectionCount++;
    console.log(\`Connected (\${this.connectionCount} connections)\`);
  }
}

export function SingletonExampleBad() {
  const db1 = DatabaseConnectionBad.getInstance();
  const db2 = DatabaseConnectionBad.getInstance();

  return (
    <div>
      <p>Same instance: {db1 === db2 ? 'Yes' : 'No'}</p>
      <button onClick={() => db1.connect()}>Connect DB 1</button>
      <button onClick={() => db2.connect()}>Connect DB 2</button>
      {/* Problems:
          - Hard to test (can't easily create new instances)
          - Global state can cause issues in React
          - Violates dependency injection principles
          - Can cause issues with SSR (Server-Side Rendering)
      */}
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Singleton-like Pattern in React
// Use React Context or dependency injection instead of true Singleton

import { createContext, useContext, useMemo, ReactNode } from 'react';

interface DatabaseConnection {
  connect(): void;
  getConnectionCount(): number;
}

class DatabaseConnectionGood implements DatabaseConnection {
  private connectionCount: number = 0;

  connect(): void {
    this.connectionCount++;
    console.log(\`Connected (\${this.connectionCount} connections)\`);
  }

  getConnectionCount(): number {
    return this.connectionCount;
  }
}

// Use React Context to provide a single instance per context
const DatabaseContext = createContext<DatabaseConnection | null>(null);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  // Create instance once and share via context
  const database = useMemo(() => new DatabaseConnectionGood(), []);

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseConnection {
  const database = useContext(DatabaseContext);
  if (!database) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return database;
}

export function SingletonExampleGood() {
  const db1 = useDatabase();
  const db2 = useDatabase();

  return (
    <div>
      <p>Same instance: {db1 === db2 ? 'Yes' : 'No'}</p>
      <p>Connection Count: {db1.getConnectionCount()}</p>
      <button onClick={() => db1.connect()}>Connect DB 1</button>
      <button onClick={() => db2.connect()}>Connect DB 2</button>
      {/* Benefits:
          - Easy to test (can provide mock instances)
          - Works with SSR
          - Follows React patterns
          - Can have multiple instances if needed (different contexts)
      */}
    </div>
  );
}`;

export default function SingletonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS" className="mb-4 inline-block">
              ← Back to Design Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Singleton Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Ensures a class has only one instance and provides global access to it. In React, it's better to use
              Context API or dependency injection instead of traditional singleton pattern.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Pattern Explanation
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Singleton pattern ensures only one instance of a class exists. While useful in some cases,
                  traditional singletons can cause problems in React applications due to testing difficulties and
                  server-side rendering. React Context provides a better alternative for sharing instances.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS">
            ← Back to Design Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

