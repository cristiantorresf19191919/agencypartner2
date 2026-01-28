"use client";

import React from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Imperative Function Composition
// Nested function calls, hard to read, difficult to maintain

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

export function UserListBad({ users }: { users: User[] }) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [formattedUsers, setFormattedUsers] = useState<string[]>([]);

  // ❌ BAD: Multiple state updates, imperative style
  useEffect(() => {
    // Step 1: Filter
    const filtered = users.filter(user => {
      if (user.active) {
        return true;
      }
      return false;
    });
    setFilteredUsers(filtered);

    // Step 2: Sort
    const sorted = filtered.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    setSortedUsers(sorted);

    // Step 3: Format
    const formatted = sorted.map(user => {
      return \`\${user.name} (\${user.email})\`;
    });
    setFormattedUsers(formatted);
  }, [users]);

  return (
    <div>
      {formattedUsers.map((formatted, index) => (
        <div key={index}>{formatted}</div>
      ))}
    </div>
  );
}

// ❌ BAD: Nested function calls - hard to read
export function processUserDataBad(users: User[]) {
  return users
    .filter(user => user.active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(user => \`\${user.name} (\${user.email})\`)
    .filter(name => name.length > 10)
    .map(name => name.toUpperCase())
    .slice(0, 5);
}

// ❌ BAD: Repeating transformation logic
export function getActiveUserNames(users: User[]): string[] {
  const active = users.filter(u => u.active);
  const sorted = active.sort((a, b) => a.name.localeCompare(b.name));
  return sorted.map(u => u.name);
}

export function getActiveUserEmails(users: User[]): string[] {
  const active = users.filter(u => u.active);
  const sorted = active.sort((a, b) => a.name.localeCompare(b.name));
  return sorted.map(u => u.email); // ❌ Duplicated logic
}

// Problems:
// 1. Nested calls are hard to read and debug
// 2. Duplicated transformation logic
// 3. Multiple state updates cause unnecessary re-renders
// 4. Hard to reuse individual transformations
// 5. Difficult to test individual steps`;

const goodExample = `// ✅ GOOD EXAMPLE: Function Composition
// Small, reusable functions composed together for complex behavior

import { useMemo } from "react";

// ============================================
// Step 1: Small, Pure Functions
// ============================================
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

// ✅ GOOD: Single responsibility - filter active users
export const filterActive = (users: User[]) => 
  users.filter(user => user.active);

// ✅ GOOD: Single responsibility - sort by name
export const sortByName = (users: User[]) => 
  [...users].sort((a, b) => a.name.localeCompare(b.name));

// ✅ GOOD: Single responsibility - format user display
export const formatUserDisplay = (users: User[]) =>
  users.map(user => \`\${user.name} (\${user.email})\`);

// ✅ GOOD: Single responsibility - get user names
export const getUserNames = (users: User[]) =>
  users.map(user => user.name);

// ✅ GOOD: Single responsibility - get user emails
export const getUserEmails = (users: User[]) =>
  users.map(user => user.email);

// ✅ GOOD: Reusable filter function
export const filterByAge = (minAge: number) => (users: User[]) =>
  users.filter(user => user.age >= minAge);

// ✅ GOOD: Reusable sort function
export const sortBy = <T>(getValue: (item: T) => string) => (items: T[]) =>
  [...items].sort((a, b) => getValue(a).localeCompare(getValue(b)));

// ============================================
// Step 2: Function Composition Utilities
// ============================================
// ✅ GOOD: Compose functions (right to left)
export function compose<T>(...fns: Array<(arg: T) => T>) {
  return (initialValue: T): T => {
    return fns.reduceRight((value, fn) => fn(value), initialValue);
  };
}

// ✅ GOOD: Pipe functions (left to right) - more readable
export function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (initialValue: T): T => {
    return fns.reduce((value, fn) => fn(value), initialValue);
  };
}

// ============================================
// Step 3: Composed Functions
// ============================================
// ✅ GOOD: Compose small functions into complex behavior
export const getActiveUserNames = pipe(
  filterActive,
  sortByName,
  getUserNames
);

export const getActiveUserEmails = pipe(
  filterActive,
  sortByName,
  getUserEmails
);

// ✅ GOOD: Reusable composition with parameters
export const getUsersByAge = (minAge: number) => pipe(
  filterByAge(minAge),
  sortByName,
  formatUserDisplay
);

// ✅ GOOD: Complex composition - easy to read and modify
export const processUserData = pipe(
  filterActive,
  filterByAge(18),
  sortBy(user => user.name),
  formatUserDisplay,
  (names: string[]) => names.filter(name => name.length > 10),
  (names: string[]) => names.map(name => name.toUpperCase()),
  (names: string[]) => names.slice(0, 5)
);

// ============================================
// Step 4: Using Composition in React
// ============================================
export function UserList({ users }: { users: User[] }) {
  // ✅ GOOD: Single memoized computation using composition
  const processedUsers = useMemo(() => {
    return pipe(
      filterActive,
      sortByName,
      formatUserDisplay
    )(users);
  }, [users]);

  return (
    <div>
      {processedUsers.map((formatted, index) => (
        <div key={index}>{formatted}</div>
      ))}
    </div>
  );
}

// ============================================
// Step 5: Advanced Composition Patterns
// ============================================
// ✅ GOOD: Compose with conditional logic
export const getUsersWithCondition = (
  isActive: boolean,
  minAge: number
) => pipe(
  (users: User[]) => isActive ? filterActive(users) : users,
  filterByAge(minAge),
  sortByName
);

// ✅ GOOD: Compose with transformation
export const transformAndFilter = pipe(
  (users: User[]) => users.map(u => ({ ...u, displayName: \`\${u.name} (\${u.email})\` })),
  (users: Array<User & { displayName: string }>) => 
    users.filter(u => u.displayName.length > 20),
  (users: Array<User & { displayName: string }>) => 
    users.map(u => u.displayName)
);

// ✅ GOOD: Compose async operations (with Promise chaining)
export const fetchAndProcess = async (fetchUsers: () => Promise<User[]>) => {
  const users = await fetchUsers();
  return pipe(
    filterActive,
    sortByName,
    formatUserDisplay
  )(users);
};

// ✅ Benefits:
// 1. Readable: Each step is clear and explicit
// 2. Reusable: Small functions can be reused in different compositions
// 3. Testable: Each function can be tested independently
// 4. Maintainable: Easy to add, remove, or modify steps
// 5. Composable: Functions can be combined in any order
// 6. Declarative: Describes WHAT, not HOW`;

export default function CompositionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming" className="mb-4 inline-block">
              ← Back to Functional Programming
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Function Compositions
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Function composition is the process of combining small, reusable functions to build
              complex behavior. By breaking down transformations into pure, single-purpose functions
              and composing them together, you create code that is more readable, testable, and maintainable.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Composing Functions
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Start with small, pure functions that do one thing well. Then use composition utilities
                  like <code>pipe</code> or <code>compose</code> to combine them. The <code>pipe</code> function
                  applies functions left-to-right (more intuitive), while <code>compose</code> applies them
                  right-to-left (mathematical style). Both create powerful, reusable transformation pipelines.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming">
            ← Back to Functional Programming
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

