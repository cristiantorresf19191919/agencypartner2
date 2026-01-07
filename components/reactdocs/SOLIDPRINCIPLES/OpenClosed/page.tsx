"use client";

import { Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Open/Closed Principle Violation
// To add new payment methods, we must MODIFY the existing class
// This violates the Open/Closed Principle (open for extension, closed for modification)

enum PaymentType {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

class PaymentProcessorBad {
  processPayment(amount: number, type: PaymentType): void {
    // Adding a new payment method requires modifying this method
    if (type === PaymentType.CREDIT_CARD) {
      console.log(\`Processing \${amount} via Credit Card\`);
      // Credit card logic
    } else if (type === PaymentType.PAYPAL) {
      console.log(\`Processing \${amount} via PayPal\`);
      // PayPal logic
    } else if (type === PaymentType.STRIPE) {
      console.log(\`Processing \${amount} via Stripe\`);
      // Stripe logic
    }
    // To add Apple Pay, we'd need to modify this class
  }
}

export function PaymentExampleBad() {
  const processor = new PaymentProcessorBad();
  
  return (
    <div>
      <button onClick={() => processor.processPayment(100, PaymentType.CREDIT_CARD)}>
        Pay with Credit Card
      </button>
      <button onClick={() => processor.processPayment(100, PaymentType.PAYPAL)}>
        Pay with PayPal
      </button>
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Open/Closed Principle Applied
// We can add new payment methods by EXTENDING (creating new classes)
// without MODIFYING existing code

interface PaymentStrategy {
  processPayment(amount: number): void;
}

// Credit Card payment implementation
class CreditCardPayment implements PaymentStrategy {
  processPayment(amount: number): void {
    console.log(\`Processing \${amount} via Credit Card\`);
    // Credit card logic
  }
}

// PayPal payment implementation
class PayPalPayment implements PaymentStrategy {
  processPayment(amount: number): void {
    console.log(\`Processing \${amount} via PayPal\`);
    // PayPal logic
  }
}

// Stripe payment implementation
class StripePayment implements PaymentStrategy {
  processPayment(amount: number): void {
    console.log(\`Processing \${amount} via Stripe\`);
    // Stripe logic
  }
}

// To add Apple Pay, just create a new class - NO MODIFICATION needed!
class ApplePayPayment implements PaymentStrategy {
  processPayment(amount: number): void {
    console.log(\`Processing \${amount} via Apple Pay\`);
    // Apple Pay logic
  }
}

// Payment processor is closed for modification but open for extension
class PaymentProcessorGood {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  processPayment(amount: number): void {
    this.strategy.processPayment(amount);
  }
}

export function PaymentExampleGood() {
  const creditCardProcessor = new PaymentProcessorGood(new CreditCardPayment());
  const paypalProcessor = new PaymentProcessorGood(new PayPalPayment());
  
  return (
    <div>
      <button onClick={() => creditCardProcessor.processPayment(100)}>
        Pay with Credit Card
      </button>
      <button onClick={() => paypalProcessor.processPayment(100)}>
        Pay with PayPal
      </button>
    </div>
  );
}`;

export default function OpenClosedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES" className="mb-4 inline-block">
              ← Back to SOLID Principles
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Open/Closed Principle (OCP)
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Software entities (classes, modules, functions) should be open for extension but closed for modification.
              This means you should be able to add new functionality through extension, not by modifying existing code.
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
                  The Open/Closed Principle promotes code that can be extended with new features without modifying
                  existing classes. This reduces the risk of breaking existing functionality and makes the codebase
                  more maintainable and stable.
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

