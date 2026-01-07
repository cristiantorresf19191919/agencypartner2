"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Strategy Pattern Violation
// Using if/else or switch for different algorithms
// This creates complex conditionals and hard to extend

type ShippingMethod = 'standard' | 'express' | 'overnight';

export class OrderBad {
  private total: number;
  private shippingMethod: ShippingMethod;

  constructor(total: number, shippingMethod: ShippingMethod) {
    this.total = total;
    this.shippingMethod = shippingMethod;
  }

  // ❌ BAD: Complex conditional logic
  calculateShipping(): number {
    if (this.shippingMethod === 'standard') {
      return this.total * 0.1;
    } else if (this.shippingMethod === 'express') {
      return this.total * 0.2;
    } else if (this.shippingMethod === 'overnight') {
      return this.total * 0.5;
    }
    return 0;
  }

  getTotal(): number {
    return this.total + this.calculateShipping();
  }
}

export function ShippingExampleBad() {
  const order1 = new OrderBad(100, 'standard');
  const order2 = new OrderBad(100, 'express');

  return (
    <div>
      <p>Standard Shipping: \${order1.getTotal()}</p>
      <p>Express Shipping: \${order2.getTotal()}</p>
      {/* Problems:
          - Complex conditionals
          - Hard to add new shipping methods
          - Violates Open/Closed Principle
          - Algorithm logic mixed with class */}
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Strategy Pattern Applied
// Defines a family of algorithms, encapsulates each one, and makes them interchangeable

// Step 1: Strategy Interface
export interface ShippingStrategy {
  calculate(amount: number): number;
  getName(): string;
}

// Step 2: Concrete Strategies
export class StandardShipping implements ShippingStrategy {
  calculate(amount: number): number {
    return amount * 0.1; // 10% of order total
  }
  getName(): string {
    return 'Standard Shipping';
  }
}

export class ExpressShipping implements ShippingStrategy {
  calculate(amount: number): number {
    return amount * 0.2; // 20% of order total
  }
  getName(): string {
    return 'Express Shipping';
  }
}

export class OvernightShipping implements ShippingStrategy {
  calculate(amount: number): number {
    return amount * 0.5; // 50% of order total
  }
  getName(): string {
    return 'Overnight Shipping';
  }
}

// Step 3: Context Class (Uses Strategy)
export class Order {
  private total: number;
  private shippingStrategy: ShippingStrategy;

  constructor(total: number, shippingStrategy: ShippingStrategy) {
    this.total = total;
    this.shippingStrategy = shippingStrategy;
  }

  // ✅ GOOD: Can change strategy at runtime
  setShippingStrategy(strategy: ShippingStrategy): void {
    this.shippingStrategy = strategy;
  }

  calculateShipping(): number {
    return this.shippingStrategy.calculate(this.total);
  }

  getTotal(): number {
    return this.total + this.calculateShipping();
  }

  getShippingMethod(): string {
    return this.shippingStrategy.getName();
  }
}

// Step 4: Usage
export function ShippingExampleGood() {
  const order1 = new Order(100, new StandardShipping());
  const order2 = new Order(100, new ExpressShipping());

  return (
    <div>
      <p>{order1.getShippingMethod()}: \${order1.getTotal()}</p>
      <p>{order2.getShippingMethod()}: \${order2.getTotal()}</p>
      {/* Benefits:
          - No conditionals - strategy handles algorithm
          - Easy to add new strategies
          - Strategies are reusable
          - Follows Open/Closed Principle */}
    </div>
  );
}`;

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS" className="mb-4 inline-block">
              ← Back to Design Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Strategy Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
              The Strategy Pattern lets the algorithm vary independently from clients that use it,
              eliminating complex conditionals and making code more maintainable.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Pattern Explanation
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Strategy Pattern encapsulates algorithms in separate classes, making them
                  interchangeable. Instead of using conditional statements to select algorithms,
                  the pattern uses polymorphism to select the appropriate strategy at runtime.
                  This makes code cleaner, more maintainable, and follows the Open/Closed Principle.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS">
            ← Back to Design Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

