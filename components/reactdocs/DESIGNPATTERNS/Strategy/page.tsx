"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Strategy Pattern Violation
// Navigation app with bloated Navigator class
// Using if/else for different routing algorithms

type RouteType = 'driving' | 'walking' | 'transit' | 'cycling';

interface Point {
  lat: number;
  lng: number;
}

export class NavigatorBad {
  private origin: Point;
  private destination: Point;
  private routeType: RouteType;

  constructor(origin: Point, destination: Point, routeType: RouteType) {
    this.origin = origin;
    this.destination = destination;
    this.routeType = routeType;
  }

  // ❌ BAD: Massive conditional logic - bloated class
  buildRoute(): Point[] {
    if (this.routeType === 'driving') {
      // Complex driving route calculation
      console.log('Calculating driving route...');
      return this.calculateDrivingRoute();
    } else if (this.routeType === 'walking') {
      // Complex walking route calculation
      console.log('Calculating walking route...');
      return this.calculateWalkingRoute();
    } else if (this.routeType === 'transit') {
      // Complex transit route calculation
      console.log('Calculating transit route...');
      return this.calculateTransitRoute();
    } else if (this.routeType === 'cycling') {
      // Complex cycling route calculation
      console.log('Calculating cycling route...');
      return this.calculateCyclingRoute();
    }
    return [];
  }

  // ❌ Problem: Each new routing algorithm doubles the class size
  private calculateDrivingRoute(): Point[] {
    // Complex algorithm for roads
    return [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }];
  }

  private calculateWalkingRoute(): Point[] {
    // Complex algorithm for sidewalks
    return [{ lat: 0, lng: 0 }, { lat: 0.5, lng: 0.5 }];
  }

  private calculateTransitRoute(): Point[] {
    // Complex algorithm for public transport
    return [{ lat: 0, lng: 0 }, { lat: 2, lng: 2 }];
  }

  private calculateCyclingRoute(): Point[] {
    // Complex algorithm for bike paths
    return [{ lat: 0, lng: 0 }, { lat: 1.5, lng: 1.5 }];
  }

  // ❌ Problems:
  // - Any change risks breaking existing code
  // - Merge conflicts for teammates
  // - Hard to add new routing algorithms
  // - Violates Open/Closed Principle
}`;

const goodExample = `// ✅ GOOD EXAMPLE: Strategy Pattern Applied
// Navigation app with interchangeable routing strategies
// Defines a family of algorithms, encapsulates each one, and makes them interchangeable

interface Point {
  lat: number;
  lng: number;
}

// Step 1: Strategy Interface
// Common interface for all routing algorithms
export interface RouteStrategy {
  buildRoute(origin: Point, destination: Point): Point[];
  getName(): string;
}

// Step 2: Concrete Strategies
// Each algorithm encapsulated in its own class

export class DrivingStrategy implements RouteStrategy {
  buildRoute(origin: Point, destination: Point): Point[] {
    console.log('Calculating driving route over roads...');
    // Complex algorithm for roads
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 },
      { lat: destination.lat, lng: destination.lng }
    ];
  }
  getName(): string {
    return 'Driving Route';
  }
}

export class WalkingStrategy implements RouteStrategy {
  buildRoute(origin: Point, destination: Point): Point[] {
    console.log('Calculating walking route via sidewalks...');
    // Complex algorithm for sidewalks and pedestrian paths
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: destination.lat, lng: destination.lng }
    ];
  }
  getName(): string {
    return 'Walking Route';
  }
}

export class TransitStrategy implements RouteStrategy {
  buildRoute(origin: Point, destination: Point): Point[] {
    console.log('Calculating public transport route...');
    // Complex algorithm for buses, trains, etc.
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0, lng: 0 }, // Bus stop
      { lat: 1, lng: 1 }, // Train station
      { lat: destination.lat, lng: destination.lng }
    ];
  }
  getName(): string {
    return 'Public Transport Route';
  }
}

export class CyclingStrategy implements RouteStrategy {
  buildRoute(origin: Point, destination: Point): Point[] {
    console.log('Calculating cycling route via bike paths...');
    // Complex algorithm for bike paths
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0.5, lng: 0.5 }, // Bike path entry
      { lat: destination.lat, lng: destination.lng }
    ];
  }
  getName(): string {
    return 'Cycling Route';
  }
}

// Step 3: Context Class (Navigator)
// Holds reference to strategy and delegates work to it
export class Navigator {
  private routeStrategy: RouteStrategy;

  constructor(routeStrategy: RouteStrategy) {
    this.routeStrategy = routeStrategy;
  }

  // ✅ GOOD: Can change strategy at runtime
  setRouteStrategy(strategy: RouteStrategy): void {
    this.routeStrategy = strategy;
  }

  // ✅ GOOD: Delegates to strategy - no conditionals
  buildRoute(origin: Point, destination: Point): Point[] {
    return this.routeStrategy.buildRoute(origin, destination);
  }

  renderRoute(origin: Point, destination: Point): void {
    const checkpoints = this.buildRoute(origin, destination);
    console.log(\`Rendering \${this.routeStrategy.getName()}:\`, checkpoints);
    // Render checkpoints on map
  }
}

// Step 4: Usage
export function NavigationExample() {
  const origin = { lat: 40.7128, lng: -74.0060 }; // NYC
  const destination = { lat: 40.7589, lng: -73.9851 }; // Times Square

  // ✅ Create navigator with different strategies
  const drivingNav = new Navigator(new DrivingStrategy());
  const walkingNav = new Navigator(new WalkingStrategy());
  const transitNav = new Navigator(new TransitStrategy());

  // ✅ Can switch strategies at runtime
  const nav = new Navigator(new DrivingStrategy());
  nav.renderRoute(origin, destination);

  nav.setRouteStrategy(new WalkingStrategy());
  nav.renderRoute(origin, destination);

  // ✅ Benefits:
  // - No conditionals - strategy handles algorithm
  // - Easy to add new strategies (e.g., TouristRouteStrategy)
  // - Strategies are reusable across different navigators
  // - Follows Open/Closed Principle
  // - Each algorithm isolated and testable independently
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
              <strong>Strategy</strong> is a behavioral design pattern that lets you define a family of algorithms, 
              put each of them into a separate class, and make their objects interchangeable.
            </Text>
          </div>
        </Stack>

        {/* Intent Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Intent
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
                The Strategy pattern suggests extracting each algorithm into its own class called a <em>strategy</em>. 
                The original class, called the <em>context</em>, holds a reference to one of these strategies and 
                delegates work to it. The context doesn't choose which algorithm to use — that choice is left to the client. 
                Since the context interacts with strategies via a common interface exposing a single method, you can add 
                new algorithms or modify existing ones without changing the context or other strategies.
              </Text>
              <div className="my-6 flex justify-center">
                <img
                  src="https://refactoring.guru/images/patterns/content/strategy/strategy.png?id=379bfba335380500375881a3da6507e0"
                  alt="Strategy design pattern"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Problem Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Problem
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                Imagine you are building a navigation app for casual travellers. The app features a beautiful map to help 
                users orient themselves quickly in any city. One of the most requested features is automatic route planning: 
                a user enters an address and sees the fastest route to that destination displayed on the map. The first version 
                of the app could only build routes over roads, which delighted drivers. However, not everyone likes to drive 
                on vacation. Updates soon added walking routes, then public‑transport routes. Plans included routes for cyclists 
                and even tours through a city's tourist attractions.
              </Text>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
                With each new routing algorithm, the navigator's main class doubled in size. Any change — even a simple bug fix — 
                risked breaking existing code. Working on the same monolithic class caused merge conflicts for your teammates. 
                Implementing a new feature meant editing the same huge file, causing headaches for everyone.
              </Text>
              <div className="my-6 flex justify-center">
                <img
                  src="https://refactoring.guru/images/patterns/diagrams/strategy/problem.png?id=e5ca943e559a979bd31d20e232dc22b6"
                  alt="The code of the navigator became very bloated"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Solution
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                In the navigation app, each routing algorithm can be extracted to its own class with a <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">buildRoute</code> method 
                that accepts an origin and destination and returns a series of checkpoints. The main navigator class doesn't care 
                which algorithm is used; its job is simply to render checkpoints on the map. A method for switching the active strategy 
                lets UI elements replace the current routing behaviour at runtime.
              </Text>
              <div className="my-6 flex justify-center">
                <img
                  src="https://refactoring.guru/images/patterns/diagrams/strategy/solution.png?id=0813a174b29a2ed5902d321aba28e5fc"
                  alt="Route planning strategies"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxWidth: '600px' }}
                />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Real-World Analogy */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Real‑World Analogy
              </Heading>
              <div className="my-6 flex justify-center">
                <img
                  src="https://refactoring.guru/images/patterns/content/strategy/strategy-comic-1-en.png?id=f64d7d8e6f83a7792a769039a66007c1"
                  alt="Various transportation strategies"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxWidth: '600px' }}
                />
              </div>
              <Text className="text-zinc-600 dark:text-zinc-400">
                Consider travelling to the airport. You might take a bus, order a taxi, or hop on your bicycle. Each is a 
                transportation strategy. Depending on your budget or time constraints, you can pick one at runtime.
              </Text>
            </Stack>
          </Card>
        </section>

        {/* Structure Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Structure
              </Heading>
              <div className="my-6 flex justify-center">
                <img
                  src="https://refactoring.guru/images/patterns/diagrams/strategy/structure.png?id=c6aa910c94960f35d100bfca02810ea1"
                  alt="Structure of the Strategy design pattern"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxWidth: '600px' }}
                />
              </div>
              <ol className="list-decimal list-inside space-y-3 text-zinc-600 dark:text-zinc-400 ml-4">
                <li>The <strong>Context</strong> maintains a reference to one of the concrete strategies and communicates with this object only via the strategy interface.</li>
                <li>The <strong>Strategy</strong> interface is common to all concrete strategies. It declares a method the context uses to execute a strategy.</li>
                <li><strong>Concrete Strategies</strong> implement different variations of an algorithm the context uses.</li>
                <li>The context calls the execution method on the linked strategy object each time it needs to run the algorithm. The context doesn't know what type of strategy it works with or how the algorithm is executed.</li>
                <li>The <strong>Client</strong> creates a specific strategy object and passes it to the context. The context exposes a setter that lets clients replace the strategy associated with the context at runtime.</li>
              </ol>
            </Stack>
          </Card>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Code Example
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                In this example, the navigation app uses multiple strategies to execute route planning algorithms. 
                Each routing strategy (driving, walking, transit, cycling) is encapsulated in its own class, making 
                them interchangeable at runtime.
              </Text>
              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        {/* Applicability Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Applicability
              </Heading>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <div>
                  <Text className="font-semibold mb-2">Use the Strategy pattern when:</Text>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You want to use different variants of an algorithm within an object and be able to switch from one algorithm to another during runtime.</li>
                    <li>You have many similar classes that only differ in the way they execute some behaviour.</li>
                    <li>You want to isolate the business logic of a class from the implementation details of algorithms that may not be as important in the context of that logic.</li>
                    <li>Your class has a massive conditional statement that switches between different variants of the same algorithm.</li>
                  </ul>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Pros and Cons */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Pros and Cons
              </Heading>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Heading level={3} className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
                    Pros
                  </Heading>
                  <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
                    <li>You can swap algorithms used inside an object at runtime.</li>
                    <li>You can isolate the implementation details of an algorithm from the code that uses it.</li>
                    <li>You can replace inheritance with composition.</li>
                    <li>Open/Closed Principle: you can introduce new strategies without changing the context.</li>
                  </ul>
                </div>
                <div>
                  <Heading level={3} className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">
                    Cons
                  </Heading>
                  <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
                    <li>If you only have a couple of algorithms that rarely change, the extra classes and interfaces add unnecessary complexity.</li>
                    <li>Clients must be aware of the differences between strategies to choose the proper one.</li>
                    <li>In languages with functional type support you can achieve similar behaviour by passing functions, avoiding extra classes and interfaces.</li>
                  </ul>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Relations with Other Patterns */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Relations with Other Patterns
              </Heading>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 dark:text-zinc-400 ml-4">
                <li><strong>Bridge</strong>, <strong>State</strong> and <strong>Strategy</strong> (and to some degree <strong>Adapter</strong>) have very similar structures because they are based on composition — delegating work to other objects. They solve different problems, though.</li>
                <li><strong>Command</strong> and <strong>Strategy</strong> may look similar because both can parameterize an object with some action. However, their intents differ: you use Command to convert any operation into an object so you can defer execution, queue it, store history, send commands to remote services, etc. Strategy usually describes different ways of doing the same thing and lets you swap these algorithms within a single context.</li>
                <li><strong>Decorator</strong> lets you change the skin of an object, while <strong>Strategy</strong> lets you change the guts.</li>
                <li><strong>Template Method</strong> is based on inheritance and lets you alter parts of an algorithm by extending those parts in subclasses. <strong>Strategy</strong> is based on composition: you can alter parts of an object's behaviour by supplying it with different strategies. Template Method works at the class level, so it's static. Strategy works at the object level, letting you switch behaviours at runtime.</li>
                <li><strong>State</strong> can be considered an extension of <strong>Strategy</strong>. Both patterns are based on composition and change the behaviour of the context by delegating work to helper objects. Strategy makes these objects completely independent and unaware of each other. State doesn't restrict dependencies between concrete states, allowing them to alter the context's state at will.</li>
              </ul>
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

