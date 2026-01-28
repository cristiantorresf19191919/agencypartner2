"use client";

import { Toggle } from "@/components/patterns";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

export default function RenderPropsPatternPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/patterns" className="mb-4 inline-block">
              ← Back to Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Render Props Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              The Render Props pattern passes a function as children (or as a prop) that receives state and controls
              how the component renders. This gives you complete control over the UI while the component manages the logic.
            </Text>
          </div>
        </Stack>

        {/* Example: Toggle Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Toggle Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Toggle component manages its own state but lets you decide HOW to render the UI.
                  You get the state and toggle function, then render whatever you want - a switch, button, checkbox, or custom UI.
                </Text>
              </div>

              <div className="space-y-6 mb-6">
                <Toggle>
                  {({ on, toggle }) => (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          on ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            on ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <Text>Toggle is {on ? "ON" : "OFF"}</Text>
                    </div>
                  )}
                </Toggle>

                <Toggle>
                  {({ on, toggle }) => (
                    <button
                      onClick={toggle}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        on
                          ? "bg-green-500 text-white shadow-lg scale-105"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {on ? "✓ Activated" : "Click to Activate"}
                    </button>
                  )}
                </Toggle>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Component decides the UI - not flexible
function ToggleSwitch() {
  const [on, setOn] = useState(false);
  
  return (
    <div>
      <button onClick={() => setOn(!on)}>
        {on ? "ON" : "OFF"}
      </button>
    </div>
  );
}

// What if you want a different UI? 
// You'd need ToggleButton, ToggleCheckbox, etc.
// Lots of duplicate state management code!`}
                good={`// ✅ GOOD: Render props - you control the UI
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  
  return children({ on, toggle });
}

// Now you can render it however you want!
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>
      {on ? "ON" : "OFF"}
    </button>
  )}
</Toggle>

<Toggle>
  {({ on, toggle }) => (
    <label>
      <input 
        type="checkbox" 
        checked={on} 
        onChange={toggle} 
      />
      Enable feature
    </label>
  )}
</Toggle>

<Toggle>
  {({ on, toggle }) => (
    <div>
      <h3>Status: {on ? 'Active' : 'Inactive'}</h3>
      <button onClick={toggle}>Toggle</button>
    </div>
  )}
</Toggle>`}
              />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/patterns">
            ← Back to Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

