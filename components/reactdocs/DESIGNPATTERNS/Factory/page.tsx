"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Factory Pattern - Direct instantiation scattered everywhere

class Car {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
}

class Truck {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
}

class Motorcycle {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
}

export function VehicleExampleBad() {
  // ❌ Client code directly instantiates concrete classes
  // This creates tight coupling and violates Open/Closed Principle
  const createVehicle = (type: string) => {
    if (type === 'car') {
      return new Car('sedan');
    } else if (type === 'truck') {
      return new Truck('pickup');
    } else if (type === 'motorcycle') {
      return new Motorcycle('sport');
    }
    throw new Error('Unknown vehicle type');
  };

  return (
    <div>
      <button onClick={() => createVehicle('car').drive()}>Create Car</button>
      <button onClick={() => createVehicle('truck').drive()}>Create Truck</button>
      <button onClick={() => createVehicle('motorcycle').drive()}>Create Motorcycle</button>
      {/* Problems:
          - To add a new vehicle type, must modify client code
          - Complex creation logic scattered across the codebase
          - Hard to test and maintain
      */}
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Factory Pattern - Centralized object creation

interface Vehicle {
  drive(): void;
  getType(): string;
}

class Car implements Vehicle {
  private type: string;
  constructor(type: string = 'sedan') {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
  getType(): string {
    return this.type;
  }
}

class Truck implements Vehicle {
  private type: string;
  constructor(type: string = 'pickup') {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
  getType(): string {
    return this.type;
  }
}

class Motorcycle implements Vehicle {
  private type: string;
  constructor(type: string = 'sport') {
    this.type = type;
  }
  drive(): void {
    console.log(\`Driving a \${this.type}\`);
  }
  getType(): string {
    return this.type;
  }
}

// Factory: Centralizes object creation logic
class VehicleFactory {
  static createVehicle(type: string, variant?: string): Vehicle {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car(variant);
      case 'truck':
        return new Truck(variant);
      case 'motorcycle':
        return new Motorcycle(variant);
      default:
        throw new Error(\`Unknown vehicle type: \${type}\`);
    }
  }

  // Can easily add new vehicle types without modifying client code
  static getAvailableTypes(): string[] {
    return ['car', 'truck', 'motorcycle'];
  }
}

export function VehicleExampleGood() {
  // ✅ Client code uses factory - doesn't know about concrete classes
  const vehicle1 = VehicleFactory.createVehicle('car', 'suv');
  const vehicle2 = VehicleFactory.createVehicle('truck', 'flatbed');
  const vehicle3 = VehicleFactory.createVehicle('motorcycle', 'cruiser');

  return (
    <div>
      <p>Available types: {VehicleFactory.getAvailableTypes().join(', ')}</p>
      <button onClick={() => vehicle1.drive()}>
        Drive {vehicle1.getType()}
      </button>
      <button onClick={() => vehicle2.drive()}>
        Drive {vehicle2.getType()}
      </button>
      <button onClick={() => vehicle3.drive()}>
        Drive {vehicle3.getType()}
      </button>
      {/* Benefits:
          - Centralized creation logic
          - Easy to add new vehicle types
          - Client code decoupled from concrete classes
          - Easy to test (can mock factory)
      */}
    </div>
  );
}`;

export default function FactoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS" className="mb-4 inline-block">
              ← Back to Design Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Factory Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Provides an interface for creating objects without specifying their exact classes. The Factory Pattern
              centralizes object creation logic, making it easier to add new types without modifying client code.
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
                  The Factory Pattern encapsulates object creation logic in a separate factory class or method.
                  This allows you to create objects without exposing the instantiation logic and provides a way
                  to delegate the creation of instances to subclasses.
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

