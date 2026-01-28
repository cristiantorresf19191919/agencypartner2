"use client";

import { Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Interface Segregation Principle Violation
// Clients are forced to implement methods they don't need

interface WorkerBad {
  work(): void;
  eat(): void;
  sleep(): void;
}

class HumanWorkerBad implements WorkerBad {
  work(): void {
    console.log('Human working...');
  }

  eat(): void {
    console.log('Human eating...');
  }

  sleep(): void {
    console.log('Human sleeping...');
  }
}

class RobotWorkerBad implements WorkerBad {
  work(): void {
    console.log('Robot working...');
  }

  // ❌ Robot is forced to implement methods it doesn't need
  eat(): void {
    throw new Error('Robots cannot eat!');
  }

  sleep(): void {
    throw new Error('Robots cannot sleep!');
  }
}

export function WorkerExampleBad() {
  const human = new HumanWorkerBad();
  const robot = new RobotWorkerBad();

  return (
    <div>
      <button onClick={() => human.work()}>Human Work</button>
      <button onClick={() => human.eat()}>Human Eat</button>
      <button onClick={() => robot.work()}>Robot Work</button>
      <button onClick={() => {
        try {
          robot.eat(); // This will throw an error!
        } catch (e) {
          console.error(e);
        }
      }}>
        Robot Eat (Error)
      </button>
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Interface Segregation Principle Applied
// Clients only implement interfaces they actually need

interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class HumanWorkerGood implements Workable, Eatable, Sleepable {
  work(): void {
    console.log('Human working...');
  }

  eat(): void {
    console.log('Human eating...');
  }

  sleep(): void {
    console.log('Human sleeping...');
  }
}

class RobotWorkerGood implements Workable {
  // ✅ Robot only implements what it needs
  work(): void {
    console.log('Robot working...');
  }
  // No need to implement eat() or sleep()
}

export function WorkerExampleGood() {
  const human = new HumanWorkerGood();
  const robot = new RobotWorkerGood();

  return (
    <div>
      <button onClick={() => human.work()}>Human Work</button>
      <button onClick={() => human.eat()}>Human Eat</button>
      <button onClick={() => human.sleep()}>Human Sleep</button>
      <button onClick={() => robot.work()}>Robot Work</button>
      {/* Robot doesn't have eat() or sleep() - and that's fine! */}
    </div>
  );
}`;

export default function InterfaceSegregationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES" className="mb-4 inline-block">
              ← Back to SOLID Principles
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Interface Segregation Principle (ISP)
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Clients should not be forced to depend on interfaces they do not use. Create specific, focused interfaces
              instead of general-purpose ones. This prevents classes from implementing methods they don't need.
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
                  The Interface Segregation Principle promotes creating small, specific interfaces rather than large,
                  monolithic ones. This ensures that classes only implement what they actually need, reducing coupling
                  and making the code more maintainable.
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

