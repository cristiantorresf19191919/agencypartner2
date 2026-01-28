"use client";

import { Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Dependency Inversion Principle Violation
// High-level modules depend on low-level modules directly

// Low-level module: Concrete implementation
class MySQLDatabaseBad {
  save(data: string): void {
    console.log(\`Saving \${data} to MySQL database\`);
  }
}

class MongoDBBad {
  save(data: string): void {
    console.log(\`Saving \${data} to MongoDB\`);
  }
}

// High-level module: Directly depends on concrete classes
class UserServiceBad {
  // ❌ Tightly coupled to MySQLDatabaseBad
  private database: MySQLDatabaseBad;

  constructor() {
    this.database = new MySQLDatabaseBad(); // Hard dependency
  }

  createUser(name: string): void {
    this.database.save(name);
  }
}

export function UserServiceExampleBad() {
  const userService = new UserServiceBad();
  
  // To switch to MongoDB, we'd need to modify UserServiceBad class
  return (
    <div>
      <button onClick={() => userService.createUser('John Doe')}>
        Create User (MySQL only)
      </button>
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Dependency Inversion Principle Applied
// High-level modules depend on abstractions, not concrete implementations

// Abstraction (interface) - high level
interface Database {
  save(data: string): void;
}

// Low-level module: Concrete implementation
class MySQLDatabaseGood implements Database {
  save(data: string): void {
    console.log(\`Saving \${data} to MySQL database\`);
  }
}

class MongoDBGood implements Database {
  save(data: string): void {
    console.log(\`Saving \${data} to MongoDB\`);
  }
}

// Another implementation can be added easily
class PostgreSQLDatabaseGood implements Database {
  save(data: string): void {
    console.log(\`Saving \${data} to PostgreSQL database\`);
  }
}

// High-level module: Depends on abstraction, not concrete class
class UserServiceGood {
  // ✅ Depends on abstraction
  private database: Database;

  constructor(database: Database) {
    // Dependency injection: receives abstraction, not concrete class
    this.database = database;
  }

  createUser(name: string): void {
    this.database.save(name);
  }
}

export function UserServiceExampleGood() {
  // Can easily switch between different database implementations
  const mysqlService = new UserServiceGood(new MySQLDatabaseGood());
  const mongoService = new UserServiceGood(new MongoDBGood());
  const postgresService = new UserServiceGood(new PostgreSQLDatabaseGood());
  
  return (
    <div>
      <button onClick={() => mysqlService.createUser('John Doe')}>
        Create User (MySQL)
      </button>
      <button onClick={() => mongoService.createUser('Jane Doe')}>
        Create User (MongoDB)
      </button>
      <button onClick={() => postgresService.createUser('Bob Smith')}>
        Create User (PostgreSQL)
      </button>
    </div>
  );
}`;

export default function DependencyInversionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES" className="mb-4 inline-block">
              ← Back to SOLID Principles
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Dependency Inversion Principle (DIP)
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).
              Abstractions should not depend on details. Details should depend on abstractions.
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
                  The Dependency Inversion Principle promotes loose coupling by ensuring that high-level business logic
                  doesn't depend on low-level implementation details. Instead, both depend on abstractions, making the
                  system more flexible and easier to test and maintain.
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

