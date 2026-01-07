"use client";

import { Card, Stack, Heading, Text, ButtonLink } from "@/components/ui";
import {
  WithoutUseCallback,
  WithUseCallback,
  WithoutUseMemo,
  WithUseMemo,
  WithoutReactMemo,
  WithReactMemo,
} from "@/components/hooks/examples";

export default function HooksComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/hooks" className="mb-4 inline-block">
              ← Back to Hooks
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Side-by-Side Comparison
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Compare the behavior of components with and without optimization hooks.
              Open your browser console (F12) to see the difference in rendering behavior.
            </Text>
          </div>
        </Stack>

        {/* useCallback Comparison */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  useCallback Comparison
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Notice how the component WITHOUT useCallback re-renders unnecessarily when parent state changes.
                  The component WITH useCallback only re-renders when its dependencies change.
                </Text>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <WithoutUseCallback />
                <WithUseCallback />
              </div>
            </Stack>
          </Card>
        </section>

        {/* useMemo Comparison */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  useMemo Comparison
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Watch the console logs. The component WITHOUT useMemo runs the expensive calculation on every render.
                  The component WITH useMemo only recalculates when dependencies change.
                </Text>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <WithoutUseMemo />
                <WithUseMemo />
              </div>
            </Stack>
          </Card>
        </section>

        {/* React.memo Comparison */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  React.memo Comparison
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Components WITHOUT React.memo re-render whenever the parent re-renders.
                  Components WITH React.memo only re-render when their props actually change.
                </Text>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <WithoutReactMemo />
                <WithReactMemo />
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

