"use client";

import { Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Single Responsibility Principle Violation
// This component handles multiple responsibilities:
// 1. User data fetching
// 2. User data formatting
// 3. UI rendering
// 4. Email sending

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export function UserProfileBad() {
  // Responsibility 1: Data fetching (should be in a service/hook)
  const fetchUser = async (id: number): Promise<User> => {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  };

  // Responsibility 2: Data formatting (should be in a utility)
  const formatUserData = (user: User): string => {
    return \`\${user.name} (\${user.email}) - Age: \${user.age}\`;
  };

  // Responsibility 3: Business logic (should be in a service)
  const sendWelcomeEmail = async (email: string) => {
    await fetch('/api/emails/send', {
      method: 'POST',
      body: JSON.stringify({ to: email, subject: 'Welcome!' }),
    });
  };

  const user = { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 };

  return (
    <div>
      <h2>{formatUserData(user)}</h2>
      <button onClick={() => sendWelcomeEmail(user.email)}>
        Send Welcome Email
      </button>
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Single Responsibility Principle Applied
// Each component/service has ONE responsibility

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Responsibility 1: Data fetching only
class UserService {
  async fetchUser(id: number): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }
}

// Responsibility 2: Email sending only
class EmailService {
  async sendWelcomeEmail(email: string): Promise<void> {
    await fetch('/api/emails/send', {
      method: 'POST',
      body: JSON.stringify({ to: email, subject: 'Welcome!' }),
    });
  }
}

// Responsibility 3: Data formatting only
function formatUserData(user: User): string {
  return \`\${user.name} (\${user.email}) - Age: \${user.age}\`;
}

// Responsibility 4: UI rendering only
export function UserProfileGood() {
  const userService = new UserService();
  const emailService = new EmailService();
  const user = { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 };

  const handleSendEmail = async () => {
    await emailService.sendWelcomeEmail(user.email);
  };

  return (
    <div>
      <h2>{formatUserData(user)}</h2>
      <button onClick={handleSendEmail}>
        Send Welcome Email
      </button>
    </div>
  );
}`;

export default function SingleResponsibilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES" className="mb-4 inline-block">
              ← Back to SOLID Principles
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Single Responsibility Principle (SRP)
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              A class or component should have only one reason to change. It should have only one responsibility
              or job. This principle helps create more maintainable, testable, and understandable code.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Principle Explanation
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Single Responsibility Principle states that every class, module, or function should have
                  responsibility over a single part of the functionality. If a class has more than one reason to
                  change, it has more than one responsibility and violates SRP.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES">
            ← Back to SOLID Principles
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

