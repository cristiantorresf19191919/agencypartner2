"use client";

import { useState } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";
import { ExpensiveCalculation } from "@/components/hooks/ExpensiveCalculation";

export default function UseMemoPage() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [otherState, setOtherState] = useState(0);

  const addNumber = () => {
    setNumbers(prev => [...prev, prev.length + 1]);
  };

  const removeNumber = () => {
    setNumbers(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/hooks" className="mb-4 inline-block">
              ← Back to Hooks
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              useMemo
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              useMemo memoizes the result of an expensive calculation, only recomputing it when dependencies change.
              This prevents expensive calculations from running on every render.
            </Text>
          </div>
        </Stack>

        {/* Interactive Demo */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Interactive Demo
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Watch the console (F12). Click "Update Other State" and see how the component WITHOUT useMemo
                  runs the expensive calculation every time, while the component WITH useMemo only recalculates
                  when the numbers array changes.
                </Text>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ExpensiveCalculation numbers={numbers} variant="no-memo" />
                <ExpensiveCalculation numbers={numbers} variant="with-memo" />
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={addNumber}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Number
                </button>
                <button 
                  onClick={removeNumber}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Remove Number
                </button>
                <button 
                  onClick={() => setOtherState(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Other State ({otherState})
                </button>
              </div>

              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  💡 Observation:
                </Text>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  When you click "Update Other State" in either component, the one WITHOUT useMemo runs the expensive
                  calculation again (check console logs). The one WITH useMemo doesn't recalculate because the numbers
                  array didn't change. However, when you add/remove numbers, both recalculate because the dependency changed.
                </Text>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Code Comparison */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Code Comparison
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  See how useMemo prevents expensive calculations from running unnecessarily.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Expensive calculation runs on every render
function Component({ numbers }) {
  const [otherState, setOtherState] = useState(0);
  
  // Expensive calculation runs EVERY time component renders!
  const result = expensiveCalculation(numbers);
  
  return (
    <div>
      <p>Result: {result}</p>
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Update State ({otherState})
      </button>
    </div>
  );
}

// Problem: Every time otherState changes, the expensive
// calculation runs again even though numbers didn't change!
// This causes performance issues.`}
                good={`// ✅ GOOD: Expensive calculation memoized
function Component({ numbers }) {
  const [otherState, setOtherState] = useState(0);
  
  // Expensive calculation only runs when numbers change!
  const result = useMemo(
    () => expensiveCalculation(numbers),
    [numbers] // Only recompute when numbers changes
  );
  
  return (
    <div>
      <p>Result: {result}</p>
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Update State ({otherState})
      </button>
    </div>
  );
}

// Benefit: When otherState changes, the expensive calculation
// does NOT run again because numbers didn't change!
// Only recalculates when numbers array changes.
// This dramatically improves performance.`}
              />
            </Stack>
          </Card>
        </section>

        {/* Additional Examples */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Common Use Cases
                </Heading>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <Heading level={3} className="text-lg font-bold mb-2">Filtering/Sorting Arrays</Heading>
                  <pre className="text-sm bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto">
{`const filteredItems = useMemo(
  () => items.filter(item => item.category === category),
  [items, category]
);`}
                  </pre>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <Heading level={3} className="text-lg font-bold mb-2">Complex Calculations</Heading>
                  <pre className="text-sm bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto">
{`const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [items]
);`}
                  </pre>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <Heading level={3} className="text-lg font-bold mb-2">Derived Data</Heading>
                  <pre className="text-sm bg-zinc-900 text-zinc-100 p-4 rounded overflow-x-auto">
{`const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);`}
                  </pre>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/hooks">
            ← Back to Hooks
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

