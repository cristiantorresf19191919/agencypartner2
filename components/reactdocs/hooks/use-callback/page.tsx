"use client";

import { useState, useCallback } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison, Button } from "@/components/ui";
import { ButtonWithCallback } from "@/components/hooks/ButtonWithCallback";

export default function UseCallbackPage() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // ❌ WRONG: Function is recreated on every render
  const handleClickWithoutCallback = () => {
    console.log("Button clicked! Count:", count);
  };

  // ✅ GOOD: Function is memoized, only recreated when count changes
  const handleClickWithCallback = useCallback(() => {
    console.log("Button clicked! Count:", count);
  }, [count]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/hooks" className="mb-4 inline-block">
              ← Back to Hooks
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              useCallback
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              useCallback memoizes a callback function, returning the same function reference unless dependencies change.
              This prevents unnecessary re-renders of child components that receive the callback as a prop.
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
                  Watch the console (F12). When you update "Other State", the button WITHOUT useCallback
                  re-renders because it receives a new function reference. The button WITH useCallback
                  doesn't re-render because the function reference stays the same.
                </Text>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <Heading level={3} className="text-lg font-bold mb-4 text-red-700 dark:text-red-400">
                      ❌ Without useCallback
                    </Heading>
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Button re-renders when parent re-renders (new function reference)
                    </Text>
                    <ButtonWithCallback
                      label="Click Me"
                      onClick={handleClickWithoutCallback}
                      variant="no-memo"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <Heading level={3} className="text-lg font-bold mb-4 text-green-700 dark:text-green-400">
                      ✅ With useCallback
                    </Heading>
                    <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Button doesn't re-render (same function reference)
                    </Text>
                    <ButtonWithCallback
                      label="Click Me"
                      onClick={handleClickWithCallback}
                      variant="with-callback"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => setCount(prev => prev + 1)}>
                  Update Count ({count})
                </Button>
                <Button onClick={() => setOtherState(prev => prev + 1)}>
                  Update Other State ({otherState})
                </Button>
              </div>

              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  💡 Observation:
                </Text>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  When you click "Update Other State", the button WITHOUT useCallback re-renders (check console).
                  The button WITH useCallback doesn't re-render because the function reference stayed the same.
                  However, when you click "Update Count", both buttons re-render because count is a dependency
                  of the useCallback, so a new function is created.
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
                  See how useCallback prevents function recreation and unnecessary re-renders.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Function recreated on every render
function Parent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // New function created on EVERY render!
  const handleClick = () => {
    console.log('Clicked!', count);
  };
  
  return (
    <div>
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Update Other State
      </button>
      
      {/* Child re-renders because handleClick is a new function! */}
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click Me</button>;
});

// Problem: Even though MemoizedChild is memoized, it re-renders
// because handleClick is a new function reference on every render!`}
                good={`// ✅ GOOD: Function memoized with useCallback
function Parent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  // Function only recreated when count changes!
  const handleClick = useCallback(() => {
    console.log('Clicked!', count);
  }, [count]); // Only recreate when count changes
  
  return (
    <div>
      <button onClick={() => setOtherState(prev => prev + 1)}>
        Update Other State
      </button>
      
      {/* Child doesn't re-render! Same function reference. */}
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click Me</button>;
});

// Benefit: MemoizedChild doesn't re-render when otherState changes
// because handleClick has the same reference. Only re-renders when
// count changes (which updates the callback).`}
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

