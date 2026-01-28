"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Adapter Pattern Violation
// Components directly depend on incompatible service interfaces
// This creates tight coupling and makes components hard to maintain and test

import { useState, useEffect } from "react";

// ❌ BAD: Old API service with different structure
export class OldUserAPIBad {
  fetchUserData(userId: string): Promise<{ name: string; email: string }> {
    return Promise.resolve({
      name: \`User \${userId}\`,
      email: \`user\${userId}@oldapi.com\`,
    });
  }
}

// ❌ BAD: New API service with incompatible interface
export class NewUserAPIBad {
  getUser(userId: string): Promise<{ fullName: string; emailAddress: string }> {
    return Promise.resolve({
      fullName: \`User \${userId}\`,
      emailAddress: \`user\${userId}@newapi.com\`,
    });
  }
}

// ❌ BAD: Component directly depends on OldUserAPIBad
export function UserProfileBad({ userId }: { userId: string }) {
  const oldAPI = new OldUserAPIBad();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    oldAPI.fetchUserData(userId).then((data) => {
      setUser(data);
    });
  }, [userId]);

  return (
    <div>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      {/* Problems:
          - To switch to NewUserAPIBad, must rewrite this component!
          - Tightly coupled to concrete implementation
          - Cannot easily test with mock APIs
      */}
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Adapter Pattern Applied
// Adapters allow incompatible interfaces to work together

// Step 1: Define Target Interface (Abstraction)
export interface UserService {
  getUser(userId: string): Promise<{ name: string; email: string }>;
}

// Step 2: Existing APIs (Adaptees) - Incompatible Interfaces
export class OldUserAPI {
  fetchUserData(userId: string): Promise<{ name: string; email: string }> {
    return Promise.resolve({
      name: \`User \${userId}\`,
      email: \`user\${userId}@oldapi.com\`,
    });
  }
}

export class NewUserAPI {
  getUser(userId: string): Promise<{ fullName: string; emailAddress: string }> {
    return Promise.resolve({
      fullName: \`User \${userId}\`,
      emailAddress: \`user\${userId}@newapi.com\`,
    });
  }
}

// Step 3: Adapters (Bridge incompatible interfaces)
export class OldUserAPIAdapter implements UserService {
  private oldAPI: OldUserAPI;

  constructor(oldAPI: OldUserAPI) {
    this.oldAPI = oldAPI;
  }

  async getUser(userId: string): Promise<{ name: string; email: string }> {
    const data = await this.oldAPI.fetchUserData(userId);
    return { name: data.name, email: data.email };
  }
}

export class NewUserAPIAdapter implements UserService {
  private newAPI: NewUserAPI;

  constructor(newAPI: NewUserAPI) {
    this.newAPI = newAPI;
  }

  async getUser(userId: string): Promise<{ name: string; email: string }> {
    const data = await this.newAPI.getUser(userId);
    return {
      name: data.fullName,
      email: data.emailAddress,
    };
  }
}

// Step 4: Component (Works with abstraction)
export function UserProfile({ userId }: { userId: string }) {
  const userService: UserService = new OldUserAPIAdapter(new OldUserAPI());
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    userService.getUser(userId).then((data) => {
      setUser(data);
    });
  }, [userId, userService]);

  return (
    <div>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      {/* Benefits:
          - Easy to switch APIs - just change adapter
          - Consistent interface across all components
          - Easy to test - inject mock adapter
          - Loose coupling - component doesn't know about API details
      */}
    </div>
  );
}`;

export default function AdapterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS" className="mb-4 inline-block">
              ← Back to Design Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Adapter Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Allows incompatible interfaces to work together by creating a wrapper (adapter) that
              translates between them. The Adapter Pattern enables loose coupling and makes it easy
              to integrate legacy systems or third-party APIs with incompatible interfaces.
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
                  The Adapter Pattern acts as a bridge between two incompatible interfaces. It wraps
                  an object with an incompatible interface and adapts it to work with code that expects
                  a different interface. This pattern is particularly useful when integrating legacy
                  systems, third-party libraries, or when you need to switch between different service
                  providers without modifying your application code.
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

