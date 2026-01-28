"use client";

import { Accordion } from "@/components/patterns";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

export default function CompoundComponentsPatternPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/patterns" className="mb-4 inline-block">
              ← Back to Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Compound Components Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Compound components are multiple related components that work together and share implicit state through Context.
              They provide a flexible API where you can arrange components in any order and they automatically work together.
            </Text>
          </div>
        </Stack>

        {/* Example: Accordion Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Accordion Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Accordion uses compound components that share state through Context. You can arrange them in any order,
                  customize each item independently, and the state is automatically synchronized.
                </Text>
              </div>

              <div className="max-w-2xl mb-6">
                <Accordion defaultOpen={0}>
                  <Accordion.Item index={0}>
                    <Accordion.Header>What is React Composition?</Accordion.Header>
                    <Accordion.Content>
                      <Text>
                        React Composition is the practice of building complex UIs from smaller, reusable components.
                        Instead of inheritance, React uses composition - combining components together.
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item index={1}>
                    <Accordion.Header>Why use Composition over Inheritance?</Accordion.Header>
                    <Accordion.Content>
                      <Text>
                        Composition is more flexible. You can easily rearrange, reuse, and combine components
                        without the rigid hierarchy that comes with inheritance.
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item index={2}>
                    <Accordion.Header>What are the benefits?</Accordion.Header>
                    <Accordion.Content>
                      <Text>
                        Benefits include better code reuse, easier testing, more flexible APIs, and clearer component
                        responsibilities. Each component has a single, well-defined purpose.
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Single component with all props - not flexible
function Accordion({ 
  items, 
  titleKey, 
  contentKey, 
  defaultOpen 
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button onClick={() => setOpenIndex(index)}>
            {item[titleKey]}
          </button>
          {openIndex === index && (
            <div>{item[contentKey]}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// Usage - rigid structure
<Accordion
  items={faqItems}
  titleKey="question"
  contentKey="answer"
  defaultOpen={0}
/>

// Can't customize individual items easily!
// Can't rearrange header/content order
// Hard to add custom styling per item`}
                good={`// ✅ GOOD: Compound components - flexible and composable
function Accordion({ children, defaultOpen }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, children }) {
  const { openIndex, setOpenIndex } = useAccordion();
  const isOpen = openIndex === index;
  // ... render logic
}

function AccordionHeader({ children }) {
  // ... render logic
}

function AccordionContent({ children }) {
  // ... render logic
}

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

// Usage - fully flexible!
<Accordion defaultOpen={0}>
  <Accordion.Item index={0}>
    <Accordion.Header>
      <Icon /> Custom Question
    </Accordion.Header>
    <Accordion.Content>
      <p>Answer with any content</p>
      <button>Learn More</button>
    </Accordion.Content>
  </Accordion.Item>
  
  <Accordion.Item index={1}>
    <Accordion.Header>Another Question</Accordion.Header>
    <Accordion.Content>
      <CustomComponent />
    </Accordion.Content>
  </Accordion.Item>
</Accordion>

// Benefits:
// - Full control over structure
// - Easy to customize each item
// - Can rearrange components
// - State shared automatically via Context`}
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

