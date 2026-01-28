"use client";

import React, { useState, useMemo } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Imperative Programming with Side Effects
// Functions with mutations, side effects, and unpredictable behavior

import { useState, useEffect } from "react";

// ❌ BAD: Impure function with side effects
let globalCounter = 0;

export function impureIncrement(value: number): number {
  globalCounter++; // ❌ Side effect - modifies global state
  return value + globalCounter; // ❌ Non-deterministic output
}

// ❌ BAD: Function that mutates input
export function addItemToCartBad(cart: Array<{ id: number; name: string }>, item: { id: number; name: string }) {
  cart.push(item); // ❌ Mutating input parameter
  return cart;
}

export function updateUserBad(user: { id: number; name: string; email: string }, updates: Partial<{ name: string; email: string }>) {
  user.name = updates.name || user.name; // ❌ Mutating input object
  user.email = updates.email || user.email;
  return user;
}

// ❌ BAD: Side effects in render functions
export function ImpureComponent({ users }: { users: Array<{ id: number; name: string }> }) {
  const [rendered, setRendered] = useState(0);

  // ❌ BAD: Side effect in render (should be in useEffect)
  setRendered(rendered + 1);
  
  // ❌ BAD: Side effect - modifying DOM directly
  document.title = \`Rendered \${rendered} times\`;

  // ❌ BAD: Side effect - API call in render
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ page: 'users' }),
  });

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// ❌ BAD: Mutating state directly
export function MutatingStateComponent() {
  const [items, setItems] = useState([{ id: 1, name: "Item 1" }]);

  const addItem = () => {
    items.push({ id: 2, name: "Item 2" }); // ❌ Mutating state directly
    setItems(items); // ❌ React won't detect the change
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

// Problems:
// 1. Mutations break React's reactivity - components won't re-render
// 2. Side effects in render cause bugs and performance issues
// 3. Impure functions are hard to test - unpredictable output
// 4. Shared mutable state causes race conditions
// 5. Non-deterministic functions break memoization`;

const goodExample = `// ✅ GOOD EXAMPLE: Functional Programming Principles
// Pure functions, immutability, and higher-order functions

import { useMemo } from "react";

// ============================================
// 1. Pure Functions
// ============================================
// ✅ GOOD: Pure function - no side effects, predictable output
// Same input always produces same output
export function formatUserName(user: { firstName: string; lastName: string }): string {
  return \`\${user.firstName} \${user.lastName}\`;
}

// ✅ GOOD: Pure function - no mutations, no side effects
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ============================================
// 2. Immutability
// ============================================
// ✅ GOOD: Creating new objects instead of mutating
export function addItemToCart(cart: Array<{ id: number; name: string }>, item: { id: number; name: string }) {
  // ✅ Return new array instead of mutating
  return [...cart, item];
}

export function updateUser(user: { id: number; name: string; email: string }, updates: Partial<{ name: string; email: string }>) {
  // ✅ Return new object with spread operator
  return { ...user, ...updates };
}

// ✅ GOOD: Deep immutability for nested objects
export function updateNestedUser(
  user: { id: number; profile: { name: string; settings: { theme: string } } },
  theme: string
) {
  return {
    ...user,
    profile: {
      ...user.profile,
      settings: {
        ...user.profile.settings,
        theme, // ✅ Only update what changed
      },
    },
  };
}

// ============================================
// 3. Higher-Order Functions
// ============================================
// ✅ GOOD: Functions that take or return functions
export function filterBy<T>(predicate: (item: T) => boolean) {
  return (items: T[]) => items.filter(predicate);
}

export function mapTo<T, R>(mapper: (item: T) => R) {
  return (items: T[]) => items.map(mapper);
}

// ✅ GOOD: Reusable higher-order function
export function createValidator(rule: (value: string) => boolean) {
  return (message: string) => {
    return (value: string) => {
      if (!rule(value)) {
        throw new Error(message);
      }
      return true;
    };
  };
}

// Usage:
// const isEmail = createValidator(v => v.includes('@'))('Must be a valid email');
// const isRequired = createValidator(v => v.length > 0)('Field is required');

// ============================================
// 4. Using Functional Programming in React
// ============================================
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

interface UserListProps {
  users: User[];
  minAge?: number;
}

export function UserList({ users, minAge = 0 }: UserListProps) {
  // ✅ GOOD: Using useMemo with pure functions
  // Pure functions can be safely memoized
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => user.age >= minAge) // ✅ Pure function
      .filter(user => user.active)        // ✅ Pure function
      .sort((a, b) => a.name.localeCompare(b.name)); // ✅ Pure function
  }, [users, minAge]);

  // ✅ GOOD: Using map (pure function) for rendering
  return (
    <div>
      {filteredUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// ============================================
// 5. Functional State Updates
// ============================================
export function CartComponent() {
  const [cart, setCart] = useState<Array<{ id: number; name: string }>>([]);

  // ✅ GOOD: Functional update - pure function
  const addItem = (item: { id: number; name: string }) => {
    setCart(prevCart => [...prevCart, item]); // ✅ Immutable update
  };

  // ✅ GOOD: Functional update with transformation
  const removeItem = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id)); // ✅ Pure filter
  };

  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// ✅ Benefits of Functional Programming:
// 1. Predictable: Same input = same output
// 2. Testable: Easy to test pure functions
// 3. Memoizable: Can safely memoize pure functions
// 4. Composable: Functions can be combined easily
// 5. Debuggable: No hidden side effects
// 6. React-friendly: Works perfectly with React's rendering model`;

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming" className="mb-4 inline-block">
              ← Back to Functional Programming
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Introduction to Functional Programming
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Functional programming is a paradigm that treats computation as the evaluation of mathematical
              functions. In React, functional programming principles help you write more predictable, testable,
              and maintainable code by emphasizing pure functions, immutability, and higher-order functions.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Core Principles
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  <strong>Pure Functions:</strong> Functions that always return the same output for the same input
                  and have no side effects. They make code predictable and testable.
                  <br /><br />
                  <strong>Immutability:</strong> Instead of modifying data, create new data structures. This prevents
                  bugs and makes React's change detection work correctly.
                  <br /><br />
                  <strong>Higher-Order Functions:</strong> Functions that take other functions as arguments or return
                  functions. They enable powerful composition patterns and code reuse.
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

