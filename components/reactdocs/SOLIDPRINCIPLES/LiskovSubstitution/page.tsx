"use client";

import { Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Liskov Substitution Principle Violation
// Square cannot be substituted for Rectangle without breaking the program

class RectangleBad {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class SquareBad extends RectangleBad {
  // Violates LSP: Square changes the behavior of parent methods
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Side effect: also changes height
  }

  setHeight(height: number): void {
    this.height = height;
    this.width = height; // Side effect: also changes width
  }
}

export function GeometryExampleBad() {
  // This function expects a Rectangle but breaks with Square
  function makeRectangleBigger(rectangle: RectangleBad): void {
    rectangle.setWidth(rectangle.width + 10);
    // With Square, this also changes height unexpectedly!
    rectangle.setHeight(rectangle.height + 10);
    // Now the square might not be square anymore
  }

  const rectangle = new RectangleBad(5, 10);
  const square = new SquareBad(5, 5);

  return (
    <div>
      <p>Rectangle Area: {rectangle.getArea()}</p>
      <p>Square Area: {square.getArea()}</p>
      <button onClick={() => {
        makeRectangleBigger(rectangle);
        makeRectangleBigger(square); // This breaks the square!
      }}>
        Make Bigger (Breaks Square)
      </button>
    </div>
  );
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Liskov Substitution Principle Applied
// Square can be substituted for Rectangle without breaking the program

interface Shape {
  getArea(): number;
}

class RectangleGood implements Shape {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class SquareGood implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  setSide(side: number): void {
    this.side = side;
  }

  getArea(): number {
    return this.side * this.side;
  }
}

export function GeometryExampleGood() {
  // This function works with any Shape (Rectangle or Square)
  function calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.getArea(), 0);
  }

  const rectangle = new RectangleGood(5, 10);
  const square = new SquareGood(5);
  const shapes: Shape[] = [rectangle, square];

  return (
    <div>
      <p>Rectangle Area: {rectangle.getArea()}</p>
      <p>Square Area: {square.getArea()}</p>
      <p>Total Area: {calculateTotalArea(shapes)}</p>
      <button onClick={() => {
        rectangle.setWidth(rectangle.width + 10);
        square.setSide(square.getArea() ** 0.5 + 5); // Maintains square property
      }}>
        Resize Shapes
      </button>
    </div>
  );
}`;

export default function LiskovSubstitutionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/SOLIDPRINCIPLES" className="mb-4 inline-block">
              ← Back to SOLID Principles
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Liskov Substitution Principle (LSP)
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
              Subtypes must be substitutable for their base types without altering the correctness of the program.
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
                  The Liskov Substitution Principle ensures that derived classes are truly substitutable for their
                  base classes. Any code that works with the base class should also work with any of its derived
                  classes without modification or unexpected behavior.
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

