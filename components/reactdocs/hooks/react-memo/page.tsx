"use client";

import { useState } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison, Button } from "@/components/ui";
import { ExpensiveComponentNoMemo, ExpensiveComponentWithMemo } from "@/components/hooks/ExpensiveComponent";

export default function ReactMemoPage() {
  const [parentCounter, setParentCounter] = useState(0);
  const [childACount, setChildACount] = useState(0);
  const [childBCount, setChildBCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/hooks" className="mb-4 inline-block">
              ← Back to Hooks
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              React.memo
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              React.memo is a higher-order component that memoizes the result of a component.
              It only re-renders when props change. This prevents unnecessary re-renders of expensive components.
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
                  Click the buttons below and watch the console (F12). Notice how components WITHOUT memo
                  re-render unnecessarily, while components WITH memo only re-render when their props change.
                </Text>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <Heading level={3} className="text-lg font-bold mb-2 text-red-700 dark:text-red-400">
                      ❌ Without React.memo
                    </Heading>
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      All components re-render when parent state changes
                    </Text>
                    <ExpensiveComponentNoMemo name="Component A" count={childACount} />
                    <ExpensiveComponentNoMemo name="Component B" count={childBCount} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <Heading level={3} className="text-lg font-bold mb-2 text-green-700 dark:text-green-400">
                      ✅ With React.memo
                    </Heading>
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Only components with changed props re-render
                    </Text>
                    <ExpensiveComponentWithMemo name="Component A" count={childACount} />
                    <ExpensiveComponentWithMemo name="Component B" count={childBCount} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => setParentCounter(prev => prev + 1)}>
                  Update Parent Counter ({parentCounter})
                </Button>
                <Button onClick={() => setChildACount(prev => prev + 1)}>
                  Update Component A ({childACount})
                </Button>
                <Button onClick={() => setChildBCount(prev => prev + 1)}>
                  Update Component B ({childBCount})
                </Button>
              </div>

              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  💡 Observation:
                </Text>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  When you click "Update Parent Counter", only the components WITHOUT memo re-render.
                  When you click "Update Component A/B", both memoized and non-memoized components re-render
                  (because their props changed). Open the console to see the render logs!
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
                  See how React.memo prevents unnecessary re-renders.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Component re-renders even when props don't change
function ExpensiveComponent({ name, count }) {
  // Expensive computation runs on EVERY render
  const value = expensiveCalculation();
  
  console.log('Component rendered:', name);
  
  return (
    <div>
      <p>{name}: {count}</p>
      <p>Value: {value}</p>
    </div>
  );
}

function Parent() {
  const [parentState, setParentState] = useState(0);
  const [childCount, setChildCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setParentState(prev => prev + 1)}>
        Update Parent
      </button>
      <button onClick={() => setChildCount(prev => prev + 1)}>
        Update Child
      </button>
      
      {/* This re-renders even when parentState changes! */}
      <ExpensiveComponent name="Child" count={childCount} />
    </div>
  );
}

// Problem: When parentState changes, ExpensiveComponent
// re-renders even though its props (name, count) didn't change!`}
                good={`// ✅ GOOD: Component only re-renders when props change
const ExpensiveComponent = React.memo(({ name, count }) => {
  // Expensive computation only runs when props change
  const value = expensiveCalculation();
  
  console.log('Component rendered:', name);
  
  return (
    <div>
      <p>{name}: {count}</p>
      <p>Value: {value}</p>
    </div>
  );
});

function Parent() {
  const [parentState, setParentState] = useState(0);
  const [childCount, setChildCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setParentState(prev => prev + 1)}>
        Update Parent
      </button>
      <button onClick={() => setChildCount(prev => prev + 1)}>
        Update Child
      </button>
      
      {/* This only re-renders when name or count changes! */}
      <ExpensiveComponent name="Child" count={childCount} />
    </div>
  );
}

// Benefit: When parentState changes, ExpensiveComponent
// does NOT re-render because its props didn't change!
// Only re-renders when count changes.`}
              />
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

