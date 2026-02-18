/**
 * Spring Reactor / Reactive Programming challenges.
 * Kotlin-only (runs via Piston API). Each topic from the Reactor course has 4 challenges.
 * Validation uses regex patterns on the source code + output checks.
 */

export type ReactorDifficulty = "Easy" | "Medium" | "Hard";

export interface ReactorChallenge {
  id: string;
  title: string;
  topic: string;
  topicSlug: string;
  difficulty: ReactorDifficulty;
  description: string;
  starterCode: string;
  solution: string;
  explanation: string;
  hints: string[];
  expectedOutput: string;
  testCases: {
    description: string;
    validate: (code: string) => boolean;
  }[];
}

export const REACTOR_TOPICS = [
  { slug: "mono-flux", label: "Mono & Flux" },
  { slug: "operators", label: "Operators" },
  { slug: "error-handling", label: "Error Handling" },
  { slug: "backpressure", label: "Backpressure" },
  { slug: "hot-cold", label: "Hot vs Cold Publishers" },
  { slug: "webclient", label: "WebClient & WebFlux" },
  { slug: "testing", label: "Testing Reactive Code" },
  { slug: "kafka-messaging", label: "Kafka & Messaging Patterns" },
  { slug: "resilience", label: "Resilience Patterns" },
  { slug: "advanced-patterns", label: "Advanced Reactive Patterns" },
] as const;

export const REACTOR_CHALLENGES: ReactorChallenge[] = [
  // ============================================================
  // TOPIC 1: Mono & Flux (4 challenges)
  // ============================================================
  {
    id: "mono-just-hello",
    title: "Create Your First Mono",
    topic: "Mono & Flux",
    topicSlug: "mono-flux",
    difficulty: "Easy",
    description:
      "Create a Mono that emits the string \"Hello Reactor\" and subscribe to it, printing the value.\n\nA Mono<T> is a Publisher that emits 0 or 1 element. Use Mono.just() to wrap a value and .subscribe() to consume it.",
    starterCode: `import reactor.core.publisher.Mono

fun main() {
    // TODO: Create a Mono that emits "Hello Reactor"
    // and subscribe to print the value
}
`,
    solution: `import reactor.core.publisher.Mono

fun main() {
    Mono.just("Hello Reactor")
        .subscribe { println(it) }
}
`,
    explanation:
      "Mono.just() creates a Mono that emits a single value. The subscribe() method triggers the reactive pipeline and the consumer lambda receives each emitted item.",
    hints: [
      "Use Mono.just() to wrap a value into a Mono",
      "Call .subscribe { } to consume the emitted value",
      "Inside subscribe's lambda, use println() to print",
    ],
    expectedOutput: "Hello Reactor",
    testCases: [
      {
        description: "Uses Mono.just()",
        validate: (code: string) => /Mono\s*\.\s*just\s*\(/.test(code),
      },
      {
        description: 'Emits "Hello Reactor"',
        validate: (code: string) =>
          /["']Hello Reactor["']/.test(code),
      },
      {
        description: "Subscribes to the Mono",
        validate: (code: string) => /\.subscribe/.test(code),
      },
      {
        description: "Prints the value",
        validate: (code: string) => /println/.test(code),
      },
    ],
  },
  {
    id: "flux-range-sum",
    title: "Sum a Flux Range",
    topic: "Mono & Flux",
    topicSlug: "mono-flux",
    difficulty: "Easy",
    description:
      "Create a Flux that emits integers from 1 to 10, then reduce them to compute their sum and print it.\n\nFlux<T> is a Publisher that emits 0..N elements. Use Flux.range() and .reduce() to aggregate.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux of 1..10 and reduce to sum
    // Print the final sum
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 10)
        .reduce(0) { acc, next -> acc + next }
        .subscribe { println(it) }
}
`,
    explanation:
      "Flux.range(start, count) emits count integers starting at start. The reduce() operator accumulates values into a single result (a Mono), which you then subscribe to.",
    hints: [
      "Flux.range(1, 10) emits 1, 2, 3, ..., 10",
      "Use .reduce(initial) { acc, next -> ... } to accumulate",
      "reduce() returns a Mono<T>, subscribe to get the result",
    ],
    expectedOutput: "55",
    testCases: [
      {
        description: "Uses Flux.range()",
        validate: (code: string) => /Flux\s*\.\s*range\s*\(/.test(code),
      },
      {
        description: "Uses reduce to accumulate",
        validate: (code: string) => /\.reduce/.test(code),
      },
      {
        description: "Subscribes to get the result",
        validate: (code: string) => /\.subscribe/.test(code),
      },
      {
        description: "Prints the result",
        validate: (code: string) => /println/.test(code),
      },
    ],
  },
  {
    id: "mono-empty-default",
    title: "Handle Empty Mono",
    topic: "Mono & Flux",
    topicSlug: "mono-flux",
    difficulty: "Medium",
    description:
      'Create an empty Mono and provide a default value of "Default Value" using the appropriate operator, then subscribe and print.\n\nWhen a Mono is empty, you can provide a fallback value with defaultIfEmpty().',
    starterCode: `import reactor.core.publisher.Mono

fun main() {
    // TODO: Create an empty Mono<String>
    // Provide "Default Value" as fallback
    // Subscribe and print
}
`,
    solution: `import reactor.core.publisher.Mono

fun main() {
    Mono.empty<String>()
        .defaultIfEmpty("Default Value")
        .subscribe { println(it) }
}
`,
    explanation:
      "Mono.empty() creates a Mono that completes without emitting any value. defaultIfEmpty() provides a fallback value when the upstream is empty.",
    hints: [
      "Mono.empty<String>() creates an empty typed Mono",
      "Use .defaultIfEmpty() to provide a fallback",
      "Subscribe and print the result",
    ],
    expectedOutput: "Default Value",
    testCases: [
      {
        description: "Uses Mono.empty()",
        validate: (code: string) => /Mono\s*\.\s*empty/.test(code),
      },
      {
        description: "Uses defaultIfEmpty()",
        validate: (code: string) => /\.defaultIfEmpty/.test(code),
      },
      {
        description: "Provides the correct fallback",
        validate: (code: string) => /["']Default Value["']/.test(code),
      },
      {
        description: "Subscribes to get the value",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "flux-collect-list",
    title: "Collect Flux to List",
    topic: "Mono & Flux",
    topicSlug: "mono-flux",
    difficulty: "Medium",
    description:
      'Create a Flux emitting "Kotlin", "Spring", "Reactor" and collect all elements into a single List. Print the list.\n\nUse Flux.just() with multiple values and collectList() to gather them into a Mono<List<T>>.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux with "Kotlin", "Spring", "Reactor"
    // Collect into a List and print it
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("Kotlin", "Spring", "Reactor")
        .collectList()
        .subscribe { println(it) }
}
`,
    explanation:
      "Flux.just() can accept multiple values. collectList() gathers all emitted items into a single List, returning a Mono<List<T>>.",
    hints: [
      "Flux.just() can take multiple arguments",
      "collectList() returns a Mono<List<T>>",
      "Subscribe to the resulting Mono to get the list",
    ],
    expectedOutput: "[Kotlin, Spring, Reactor]",
    testCases: [
      {
        description: "Uses Flux.just() with multiple values",
        validate: (code: string) => /Flux\s*\.\s*just\s*\(/.test(code),
      },
      {
        description: "Uses collectList()",
        validate: (code: string) => /\.collectList/.test(code),
      },
      {
        description: "Contains all three strings",
        validate: (code: string) =>
          /Kotlin/.test(code) && /Spring/.test(code) && /Reactor/.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) =>
          /\.subscribe/.test(code) && /println/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 2: Operators (4 challenges)
  // ============================================================
  {
    id: "map-transform",
    title: "Transform with Map",
    topic: "Operators",
    topicSlug: "operators",
    difficulty: "Easy",
    description:
      "Create a Flux emitting 1, 2, 3, 4, 5. Use the map operator to square each number, then subscribe and print each result on a new line.\n\nThe map() operator applies a synchronous transformation to each element.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create Flux of 1..5
    // Map each to its square
    // Subscribe and print each value
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 5)
        .map { it * it }
        .subscribe { println(it) }
}
`,
    explanation:
      "The map() operator transforms each element synchronously. Here we square each number. The lambda receives each element and returns the transformed value.",
    hints: [
      "Use Flux.range(1, 5) to generate 1 through 5",
      "Use .map { it * it } to square each value",
      "Subscribe and println each emitted value",
    ],
    expectedOutput: "1\n4\n9\n16\n25",
    testCases: [
      {
        description: "Uses map operator",
        validate: (code: string) => /\.map\s*\{/.test(code) || /\.map\s*\(/.test(code),
      },
      {
        description: "Applies squaring operation",
        validate: (code: string) => /it\s*\*\s*it/.test(code) || /\*\s*it/.test(code),
      },
      {
        description: "Creates a Flux source",
        validate: (code: string) => /Flux\s*\./.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "filter-even-numbers",
    title: "Filter Even Numbers",
    topic: "Operators",
    topicSlug: "operators",
    difficulty: "Easy",
    description:
      "Create a Flux emitting integers 1 through 10. Use the filter operator to keep only even numbers. Subscribe and print each on a new line.\n\nfilter() tests each element against a predicate, only passing through those that match.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 1..10, filter to even only
    // Print each even number
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 10)
        .filter { it % 2 == 0 }
        .subscribe { println(it) }
}
`,
    explanation:
      "filter() evaluates a predicate for each element. Only elements where the predicate returns true are emitted downstream. Here, `it % 2 == 0` keeps even numbers.",
    hints: [
      "Use Flux.range(1, 10) for the source",
      "Use .filter { it % 2 == 0 } to keep evens",
      "Subscribe and print each value",
    ],
    expectedOutput: "2\n4\n6\n8\n10",
    testCases: [
      {
        description: "Uses filter operator",
        validate: (code: string) => /\.filter\s*\{/.test(code) || /\.filter\s*\(/.test(code),
      },
      {
        description: "Checks for even numbers",
        validate: (code: string) => /%\s*2/.test(code),
      },
      {
        description: "Uses Flux.range()",
        validate: (code: string) => /Flux\s*\.\s*range/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "flatmap-expand",
    title: "Expand with FlatMap",
    topic: "Operators",
    topicSlug: "operators",
    difficulty: "Medium",
    description:
      'Create a Flux emitting "Hello", "World". Use flatMap to split each word into individual characters (as separate emissions). Subscribe and print each character.\n\nflatMap() transforms each element into a Publisher, then merges the inner publishers into a single Flux.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of "Hello", "World"
    // flatMap each word into its characters
    // Print each character
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("Hello", "World")
        .flatMap { word -> Flux.fromIterable(word.toList()) }
        .subscribe { println(it) }
}
`,
    explanation:
      "flatMap() transforms each element into a Publisher and then merges them. Here each string becomes a Flux of its characters via Flux.fromIterable().",
    hints: [
      'Use Flux.just("Hello", "World") as the source',
      "Use .flatMap { Flux.fromIterable(it.toList()) }",
      "flatMap merges the inner publishers into one stream",
    ],
    expectedOutput: "H\ne\nl\nl\no\nW\no\nr\nl\nd",
    testCases: [
      {
        description: "Uses flatMap operator",
        validate: (code: string) => /\.flatMap\s*\{/.test(code) || /\.flatMap\s*\(/.test(code),
      },
      {
        description: "Converts to characters/iterable",
        validate: (code: string) => /toList|toCharArray|fromIterable|fromArray/.test(code),
      },
      {
        description: "Creates inner publisher",
        validate: (code: string) => /Flux\s*\.\s*(fromIterable|fromArray|just)/.test(code),
      },
      {
        description: "Subscribes to the result",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "zip-combine",
    title: "Combine with Zip",
    topic: "Operators",
    topicSlug: "operators",
    difficulty: "Medium",
    description:
      'Zip two Flux sources together:\n- Flux 1: "Kotlin", "Spring", "Reactor"\n- Flux 2: 1, 2, 3\n\nCombine them so each pair prints as "1. Kotlin", "2. Spring", "3. Reactor". Use Flux.zip().',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    val names = Flux.just("Kotlin", "Spring", "Reactor")
    val numbers = Flux.just(1, 2, 3)

    // TODO: Zip names and numbers together
    // Print each as "{number}. {name}"
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val names = Flux.just("Kotlin", "Spring", "Reactor")
    val numbers = Flux.just(1, 2, 3)

    Flux.zip(names, numbers) { name, num -> "$num. $name" }
        .subscribe { println(it) }
}
`,
    explanation:
      "Flux.zip() combines elements pairwise from multiple sources. The combinator function receives one element from each source and produces the combined output.",
    hints: [
      "Use Flux.zip(flux1, flux2) { a, b -> ... }",
      'Combine as "$num. $name" using string templates',
      "Subscribe and print each combined result",
    ],
    expectedOutput: "1. Kotlin\n2. Spring\n3. Reactor",
    testCases: [
      {
        description: "Uses Flux.zip()",
        validate: (code: string) => /Flux\s*\.\s*zip/.test(code) || /\.zipWith/.test(code),
      },
      {
        description: "Combines both sources",
        validate: (code: string) => /names/.test(code) && /numbers/.test(code),
      },
      {
        description: "Formats the output correctly",
        validate: (code: string) => /\$num|\$\{num\}|\$it/.test(code) || /num\s*\+/.test(code) || /\.\s*toString/.test(code) || /\$/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 3: Error Handling (4 challenges)
  // ============================================================
  {
    id: "on-error-return",
    title: "Fallback on Error",
    topic: "Error Handling",
    topicSlug: "error-handling",
    difficulty: "Easy",
    description:
      'Create a Flux that emits 1, 2, 3 then throws a RuntimeException("Boom!"). Use onErrorReturn() to provide -1 as a fallback value. Subscribe and print all values.\n\nExpected output: 1, 2, 3, -1 (each on a new line).',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux that emits 1, 2, 3 then errors
    // Use onErrorReturn(-1) as fallback
    // Subscribe and print
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 3)
        .concatWith(Flux.error(RuntimeException("Boom!")))
        .onErrorReturn(-1)
        .subscribe { println(it) }
}
`,
    explanation:
      "onErrorReturn() catches any error signal and replaces it with a static fallback value. The stream completes normally after the fallback is emitted.",
    hints: [
      "Use concatWith(Flux.error(...)) to add an error after normal emissions",
      "onErrorReturn() provides a static fallback value on any error",
      "The stream completes after the fallback value is emitted",
    ],
    expectedOutput: "1\n2\n3\n-1",
    testCases: [
      {
        description: "Uses onErrorReturn()",
        validate: (code: string) => /\.onErrorReturn/.test(code),
      },
      {
        description: "Creates an error signal",
        validate: (code: string) => /Flux\s*\.\s*error|RuntimeException|throw/.test(code),
      },
      {
        description: "Provides -1 as fallback",
        validate: (code: string) => /-1/.test(code),
      },
      {
        description: "Subscribes to the result",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "on-error-resume",
    title: "Resume with Fallback Stream",
    topic: "Error Handling",
    topicSlug: "error-handling",
    difficulty: "Medium",
    description:
      'Create a Flux that emits "A", "B" then throws an error. Use onErrorResume() to switch to a fallback Flux emitting "X", "Y", "Z". Subscribe and print all values.\n\nExpected: A, B, X, Y, Z (each on a new line).',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of "A", "B" followed by error
    // onErrorResume to fallback Flux of "X", "Y", "Z"
    // Subscribe and print
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("A", "B")
        .concatWith(Flux.error(RuntimeException("Oops")))
        .onErrorResume { Flux.just("X", "Y", "Z") }
        .subscribe { println(it) }
}
`,
    explanation:
      "onErrorResume() catches an error and replaces the failed stream with a new Publisher. Unlike onErrorReturn() which provides a single value, onErrorResume() can provide an entire new stream.",
    hints: [
      "onErrorResume {} takes a lambda returning a Publisher",
      "The fallback Publisher replaces the errored stream",
      "Use Flux.just() for the fallback values",
    ],
    expectedOutput: "A\nB\nX\nY\nZ",
    testCases: [
      {
        description: "Uses onErrorResume()",
        validate: (code: string) => /\.onErrorResume/.test(code),
      },
      {
        description: "Provides a fallback Flux",
        validate: (code: string) =>
          /Flux\s*\.\s*just\s*\(\s*["']X["']/.test(code),
      },
      {
        description: "Creates an error in the original stream",
        validate: (code: string) => /error|Exception/.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) => /\.subscribe/.test(code) && /println/.test(code),
      },
    ],
  },
  {
    id: "retry-on-error",
    title: "Retry on Failure",
    topic: "Error Handling",
    topicSlug: "error-handling",
    difficulty: "Medium",
    description:
      'Create a Flux using Flux.defer() with a counter. On the first 2 calls, emit an error. On the 3rd call, emit "Success!". Use retry(2) to automatically retry. Print the output.\n\nretry(n) re-subscribes to the upstream up to n times on error.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

fun main() {
    val attempt = AtomicInteger(0)

    // TODO: Use Flux.defer to check attempt count
    // First 2 attempts: emit error
    // 3rd attempt: emit "Success!"
    // Use .retry(2) and subscribe/print
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

fun main() {
    val attempt = AtomicInteger(0)

    Mono.defer {
        if (attempt.incrementAndGet() < 3) {
            Mono.error(RuntimeException("Attempt \${attempt.get()} failed"))
        } else {
            Mono.just("Success!")
        }
    }
    .retry(2)
    .subscribe { println(it) }
}
`,
    explanation:
      "retry(n) re-subscribes to the upstream Publisher up to n times when an error occurs. Flux.defer/Mono.defer creates the publisher lazily so each retry gets a fresh evaluation.",
    hints: [
      "Use Mono.defer {} to lazily evaluate which Mono to return",
      "Use AtomicInteger to track which attempt you're on",
      "retry(2) allows 2 retries (3 total attempts)",
    ],
    expectedOutput: "Success!",
    testCases: [
      {
        description: "Uses retry()",
        validate: (code: string) => /\.retry\s*\(/.test(code),
      },
      {
        description: "Uses defer for lazy evaluation",
        validate: (code: string) => /\.defer/.test(code),
      },
      {
        description: "Tracks attempts with AtomicInteger",
        validate: (code: string) => /AtomicInteger/.test(code),
      },
      {
        description: "Subscribes to get the result",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "do-on-error-log",
    title: "Log Errors with doOnError",
    topic: "Error Handling",
    topicSlug: "error-handling",
    difficulty: "Hard",
    description:
      'Create a Flux that emits 10, 20, 0, 30. Map each to 100/element. Use doOnError to print "Error: <message>" before recovering with onErrorReturn(-1). Subscribe and print.\n\nExpected: 10, 5, Error: / by zero, -1',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 10, 20, 0, 30
    // Map each to 100 / element (will throw on 0)
    // doOnError to log "Error: <message>"
    // onErrorReturn(-1) as fallback
    // Subscribe and print each value
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(10, 20, 0, 30)
        .map { 100 / it }
        .doOnError { println("Error: \${it.message}") }
        .onErrorReturn(-1)
        .subscribe { println(it) }
}
`,
    explanation:
      "doOnError() is a side-effect operator — it lets you perform an action (like logging) when an error occurs without consuming the error. The error continues downstream to be handled by onErrorReturn() or similar operators.",
    hints: [
      "doOnError {} receives the Throwable as the parameter",
      "It's a side-effect: it doesn't consume the error",
      "Chain doOnError before onErrorReturn",
      "Division by zero gives message '/ by zero'",
    ],
    expectedOutput: "10\n5\nError: / by zero\n-1",
    testCases: [
      {
        description: "Uses doOnError()",
        validate: (code: string) => /\.doOnError/.test(code),
      },
      {
        description: "Uses onErrorReturn()",
        validate: (code: string) => /\.onErrorReturn/.test(code),
      },
      {
        description: "Maps division operation",
        validate: (code: string) => /100\s*\//.test(code),
      },
      {
        description: "Logs the error message",
        validate: (code: string) => /Error:/.test(code) && /message/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 4: Backpressure (4 challenges)
  // ============================================================
  {
    id: "backpressure-limit-rate",
    title: "Limit Consumption Rate",
    topic: "Backpressure",
    topicSlug: "backpressure",
    difficulty: "Easy",
    description:
      "Create a Flux emitting 1 through 20 and use limitRate(5) to request items in batches of 5. Use doOnRequest to print how many items are requested at each batch. Subscribe and print each value.\n\nlimitRate(n) prefetches n items at a time, implementing backpressure.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux.range(1, 20)
    // limitRate(5) to batch requests
    // doOnRequest to log requested count
    // Subscribe and print values
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 20)
        .doOnRequest { println("Requested: $it") }
        .limitRate(5)
        .subscribe { println(it) }
}
`,
    explanation:
      "limitRate(n) implements backpressure by limiting the prefetch amount. The downstream requests n items at a time rather than unbounded. doOnRequest is a side-effect operator that logs how many items are being requested.",
    hints: [
      "Use .limitRate(5) on the Flux",
      "doOnRequest { } logs the demand from downstream",
      "Place doOnRequest before limitRate to see upstream requests",
    ],
    expectedOutput: "Requested: 5",
    testCases: [
      {
        description: "Uses limitRate()",
        validate: (code: string) => /\.limitRate\s*\(\s*5\s*\)/.test(code),
      },
      {
        description: "Uses doOnRequest()",
        validate: (code: string) => /\.doOnRequest/.test(code),
      },
      {
        description: "Uses Flux.range()",
        validate: (code: string) => /Flux\s*\.\s*range/.test(code),
      },
      {
        description: "Subscribes to consume",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "backpressure-buffer",
    title: "Buffer Elements",
    topic: "Backpressure",
    topicSlug: "backpressure",
    difficulty: "Medium",
    description:
      "Create a Flux emitting 1 through 12 and use buffer(4) to collect elements in batches of 4. Subscribe and print each batch.\n\nbuffer(n) collects n elements into a List before emitting the batch downstream.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 1..12
    // Buffer in groups of 4
    // Subscribe and print each batch
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 12)
        .buffer(4)
        .subscribe { println(it) }
}
`,
    explanation:
      "buffer(n) collects n elements into a List<T> before emitting the list downstream. This is a common backpressure strategy where you process elements in fixed-size batches.",
    hints: [
      "Use .buffer(4) on the Flux",
      "Each emission will be a List of 4 elements",
      "Subscribe and print each batch list",
    ],
    expectedOutput: "[1, 2, 3, 4]\n[5, 6, 7, 8]\n[9, 10, 11, 12]",
    testCases: [
      {
        description: "Uses buffer()",
        validate: (code: string) => /\.buffer\s*\(\s*4\s*\)/.test(code),
      },
      {
        description: "Creates Flux of 1..12",
        validate: (code: string) => /Flux\s*\.\s*range\s*\(\s*1\s*,\s*12\s*\)/.test(code),
      },
      {
        description: "Subscribes to consume batches",
        validate: (code: string) => /\.subscribe/.test(code),
      },
      {
        description: "Prints the output",
        validate: (code: string) => /println/.test(code),
      },
    ],
  },
  {
    id: "backpressure-sample",
    title: "Sample Latest Values",
    topic: "Backpressure",
    topicSlug: "backpressure",
    difficulty: "Medium",
    description:
      "Create a Flux emitting 1 through 10, then use take(3) to only consume the first 3 elements (simulating a slow consumer). Subscribe and print.\n\ntake(n) cancels the subscription after receiving n elements — a simple form of backpressure.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 1..10
    // Take only first 3 elements
    // doOnCancel to print "Cancelled!"
    // Subscribe and print
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 10)
        .doOnCancel { println("Cancelled!") }
        .take(3)
        .subscribe { println(it) }
}
`,
    explanation:
      "take(n) requests only n elements from upstream and then cancels the subscription. doOnCancel() lets you observe when a cancellation happens, which is useful for debugging backpressure behavior.",
    hints: [
      "Use .take(3) to limit elements consumed",
      "doOnCancel {} fires when the subscription is cancelled",
      "Place doOnCancel before take to observe the cancellation",
    ],
    expectedOutput: "1\n2\n3\nCancelled!",
    testCases: [
      {
        description: "Uses take()",
        validate: (code: string) => /\.take\s*\(\s*3\s*\)/.test(code),
      },
      {
        description: "Uses doOnCancel()",
        validate: (code: string) => /\.doOnCancel/.test(code),
      },
      {
        description: "Prints 'Cancelled!'",
        validate: (code: string) => /Cancelled/.test(code),
      },
      {
        description: "Subscribes",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "backpressure-window",
    title: "Window Processing",
    topic: "Backpressure",
    topicSlug: "backpressure",
    difficulty: "Hard",
    description:
      "Create a Flux of 1 through 9 and use window(3) to split it into windows of 3. For each window, collect to a list and print it.\n\nwindow(n) splits the Flux into sub-Flux publishers of size n (unlike buffer which creates Lists).",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 1..9
    // window(3) to split into sub-Flux of 3
    // flatMap each window, collectList and print
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 9)
        .window(3)
        .flatMap { it.collectList() }
        .subscribe { println(it) }
}
`,
    explanation:
      "window(n) groups elements into sub-Flux publishers of size n. Unlike buffer() which produces Lists, window() produces Flux<Flux<T>>. You typically flatMap each window to process it.",
    hints: [
      "window(3) returns a Flux<Flux<Int>>",
      "Use flatMap to process each inner Flux",
      "collectList() turns each window into a List",
    ],
    expectedOutput: "[1, 2, 3]\n[4, 5, 6]\n[7, 8, 9]",
    testCases: [
      {
        description: "Uses window()",
        validate: (code: string) => /\.window\s*\(\s*3\s*\)/.test(code),
      },
      {
        description: "Uses flatMap to process windows",
        validate: (code: string) => /\.flatMap/.test(code),
      },
      {
        description: "Collects each window to list",
        validate: (code: string) => /\.collectList/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 5: Hot vs Cold Publishers (4 challenges)
  // ============================================================
  {
    id: "cold-publisher-demo",
    title: "Cold Publisher Behavior",
    topic: "Hot vs Cold Publishers",
    topicSlug: "hot-cold",
    difficulty: "Easy",
    description:
      'Create a cold Flux that emits "A", "B", "C". Subscribe to it twice, and for each subscriber print with a prefix: "Sub1: A" and "Sub2: A". This demonstrates that cold publishers replay for each subscriber.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux of "A", "B", "C"
    // Subscribe twice with different prefixes
    // Sub1 prints: "Sub1: A", "Sub1: B", etc.
    // Sub2 prints: "Sub2: A", "Sub2: B", etc.
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val flux = Flux.just("A", "B", "C")
    flux.subscribe { println("Sub1: $it") }
    flux.subscribe { println("Sub2: $it") }
}
`,
    explanation:
      "A cold publisher replays its data from the beginning for each subscriber. Each subscription gets its own independent stream of events.",
    hints: [
      'Store the Flux in a variable: val flux = Flux.just("A","B","C")',
      "Subscribe twice to the same Flux",
      'Use string templates: "Sub1: $it"',
    ],
    expectedOutput: "Sub1: A\nSub1: B\nSub1: C\nSub2: A\nSub2: B\nSub2: C",
    testCases: [
      {
        description: "Creates a Flux",
        validate: (code: string) => /Flux\s*\.\s*just/.test(code),
      },
      {
        description: "Subscribes twice",
        validate: (code: string) => (code.match(/\.subscribe/g) || []).length >= 2,
      },
      {
        description: "Uses Sub1 prefix",
        validate: (code: string) => /Sub1/.test(code),
      },
      {
        description: "Uses Sub2 prefix",
        validate: (code: string) => /Sub2/.test(code),
      },
    ],
  },
  {
    id: "hot-publisher-share",
    title: "Share a Hot Publisher",
    topic: "Hot vs Cold Publishers",
    topicSlug: "hot-cold",
    difficulty: "Medium",
    description:
      'Create a Flux emitting "A", "B", "C" and use .share() to make it hot. Subscribe twice. Hot publishers share the execution: the second subscriber may miss items already emitted.\n\nNote: In synchronous mode, share() typically gives both subscribers all items.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux of "A", "B", "C"
    // Use .share() to make it a hot publisher
    // Subscribe with Sub1 and Sub2 prefixes
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val hot = Flux.just("A", "B", "C").share()
    hot.subscribe { println("Sub1: $it") }
    hot.subscribe { println("Sub2: $it") }
}
`,
    explanation:
      "share() converts a cold publisher to a hot multicast publisher. With a synchronous source, the first subscriber triggers the full emission, and the second subscriber joins after. In async scenarios, late subscribers miss earlier events.",
    hints: [
      "Call .share() on the Flux",
      "share() multicasts the source to multiple subscribers",
      "Store the shared Flux and subscribe to it twice",
    ],
    expectedOutput: "Sub1: A\nSub1: B\nSub1: C",
    testCases: [
      {
        description: "Uses share()",
        validate: (code: string) => /\.share\s*\(/.test(code),
      },
      {
        description: "Creates a Flux source",
        validate: (code: string) => /Flux\s*\.\s*just/.test(code),
      },
      {
        description: "Subscribes multiple times",
        validate: (code: string) => (code.match(/\.subscribe/g) || []).length >= 2,
      },
      {
        description: "Uses subscriber prefixes",
        validate: (code: string) => /Sub1/.test(code) && /Sub2/.test(code),
      },
    ],
  },
  {
    id: "replay-cache",
    title: "Replay with Cache",
    topic: "Hot vs Cold Publishers",
    topicSlug: "hot-cold",
    difficulty: "Medium",
    description:
      'Create a Flux emitting "A", "B", "C" and use .cache() to replay all elements to late subscribers. Subscribe twice and verify both get all values.\n\ncache() replays previously emitted elements to new subscribers.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Create a Flux of "A", "B", "C"
    // Use .cache() to enable replay
    // Subscribe with Sub1 and Sub2
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val cached = Flux.just("A", "B", "C").cache()
    cached.subscribe { println("Sub1: $it") }
    cached.subscribe { println("Sub2: $it") }
}
`,
    explanation:
      "cache() turns a Flux into a hot publisher that replays all cached elements to new subscribers. Unlike share(), which may cause late subscribers to miss items, cache() ensures everyone gets the full history.",
    hints: [
      "Use .cache() instead of .share()",
      "cache() replays all emitted items to new subscribers",
      "Both subscribers should receive A, B, C",
    ],
    expectedOutput: "Sub1: A\nSub1: B\nSub1: C\nSub2: A\nSub2: B\nSub2: C",
    testCases: [
      {
        description: "Uses cache()",
        validate: (code: string) => /\.cache\s*\(/.test(code),
      },
      {
        description: "Creates a Flux source",
        validate: (code: string) => /Flux\s*\.\s*just/.test(code),
      },
      {
        description: "Subscribes twice",
        validate: (code: string) => (code.match(/\.subscribe/g) || []).length >= 2,
      },
      {
        description: "Both subscribers print values",
        validate: (code: string) => /Sub1/.test(code) && /Sub2/.test(code),
      },
    ],
  },
  {
    id: "connect-auto-connect",
    title: "ConnectableFlux with AutoConnect",
    topic: "Hot vs Cold Publishers",
    topicSlug: "hot-cold",
    difficulty: "Hard",
    description:
      'Create a Flux of "X", "Y", "Z". Use .publish() to make it connectable, then .autoConnect(2) to auto-start when 2 subscribers are connected. Subscribe twice and print with prefixes.\n\nautoConnect(n) waits for n subscribers before starting emission.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of "X", "Y", "Z"
    // .publish() to get ConnectableFlux
    // .autoConnect(2) to wait for 2 subs
    // Subscribe with Sub1 and Sub2 prefixes
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val hot = Flux.just("X", "Y", "Z")
        .publish()
        .autoConnect(2)

    hot.subscribe { println("Sub1: $it") }
    hot.subscribe { println("Sub2: $it") }
}
`,
    explanation:
      "publish() converts a Flux into a ConnectableFlux. autoConnect(n) automatically connects (starts emitting) when n subscribers have subscribed. This ensures all subscribers are ready before data flows.",
    hints: [
      ".publish() returns a ConnectableFlux",
      ".autoConnect(2) starts emission after 2 subscribers",
      "Subscribe twice to trigger the auto-connect",
    ],
    expectedOutput: "Sub1: X\nSub2: X\nSub1: Y\nSub2: Y\nSub1: Z\nSub2: Z",
    testCases: [
      {
        description: "Uses publish()",
        validate: (code: string) => /\.publish\s*\(/.test(code),
      },
      {
        description: "Uses autoConnect(2)",
        validate: (code: string) => /\.autoConnect\s*\(\s*2\s*\)/.test(code),
      },
      {
        description: "Subscribes twice",
        validate: (code: string) => (code.match(/\.subscribe/g) || []).length >= 2,
      },
      {
        description: "Uses subscriber prefixes",
        validate: (code: string) => /Sub1/.test(code) && /Sub2/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 6: WebClient & WebFlux (4 challenges)
  // ============================================================
  {
    id: "webclient-get-concept",
    title: "WebClient GET Pattern",
    topic: "WebClient & WebFlux",
    topicSlug: "webclient",
    difficulty: "Easy",
    description:
      'Write the Kotlin code that demonstrates a WebClient GET request pattern. Create a mock function that simulates fetching a user by ID. Return a Mono with "User: John (id=1)". Print the result.\n\nThis exercises the pattern without needing actual HTTP.',
    starterCode: `import reactor.core.publisher.Mono

// Simulate a WebClient-style call
fun fetchUser(id: Int): Mono<String> {
    // TODO: Return a Mono with "User: John (id={id})"
    return Mono.empty()
}

fun main() {
    // TODO: Call fetchUser(1) and print the result
}
`,
    solution: `import reactor.core.publisher.Mono

fun fetchUser(id: Int): Mono<String> {
    return Mono.just("User: John (id=$id)")
}

fun main() {
    fetchUser(1)
        .subscribe { println(it) }
}
`,
    explanation:
      "In real Spring WebFlux, WebClient.get().uri(...).retrieve().bodyToMono() returns a Mono. Here we simulate the pattern with a direct Mono.just(), which represents the async result of an HTTP call.",
    hints: [
      "Return Mono.just() with the formatted string",
      'Use Kotlin string templates: "User: John (id=$id)"',
      "Subscribe to the returned Mono to print",
    ],
    expectedOutput: "User: John (id=1)",
    testCases: [
      {
        description: "Returns a Mono",
        validate: (code: string) => /Mono\s*\.\s*just/.test(code),
      },
      {
        description: "Uses string template with id",
        validate: (code: string) => /\$id|\$\{id\}/.test(code),
      },
      {
        description: "Calls fetchUser()",
        validate: (code: string) => /fetchUser\s*\(\s*1\s*\)/.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) => /\.subscribe/.test(code) && /println/.test(code),
      },
    ],
  },
  {
    id: "webclient-chain-calls",
    title: "Chain Reactive Calls",
    topic: "WebClient & WebFlux",
    topicSlug: "webclient",
    difficulty: "Medium",
    description:
      'Simulate two chained WebClient calls. First, fetch a user ID from getActiveUserId() which returns Mono<Int> with value 42. Then, use flatMap to fetch user details from getUserDetails(id) which returns Mono<String> with "User #42 - Active". Print the final result.\n\nThis pattern is fundamental for composing multiple async HTTP calls.',
    starterCode: `import reactor.core.publisher.Mono

fun getActiveUserId(): Mono<Int> {
    return Mono.just(42)
}

fun getUserDetails(id: Int): Mono<String> {
    // TODO: return Mono with "User #<id> - Active"
    return Mono.empty()
}

fun main() {
    // TODO: Chain getActiveUserId -> getUserDetails
    // Print the result
}
`,
    solution: `import reactor.core.publisher.Mono

fun getActiveUserId(): Mono<Int> {
    return Mono.just(42)
}

fun getUserDetails(id: Int): Mono<String> {
    return Mono.just("User #$id - Active")
}

fun main() {
    getActiveUserId()
        .flatMap { getUserDetails(it) }
        .subscribe { println(it) }
}
`,
    explanation:
      "flatMap() is the key operator for chaining async calls. It takes each emitted value, passes it to a function that returns a Publisher, and subscribes to the inner Publisher. This is how you sequence dependent HTTP calls in WebFlux.",
    hints: [
      "Use flatMap to chain Mono calls",
      "getActiveUserId().flatMap { getUserDetails(it) }",
      "flatMap unwraps the inner Mono automatically",
    ],
    expectedOutput: "User #42 - Active",
    testCases: [
      {
        description: "Uses flatMap to chain calls",
        validate: (code: string) => /\.flatMap/.test(code),
      },
      {
        description: "Calls getActiveUserId()",
        validate: (code: string) => /getActiveUserId\s*\(/.test(code),
      },
      {
        description: "Calls getUserDetails()",
        validate: (code: string) => /getUserDetails\s*\(/.test(code),
      },
      {
        description: "Subscribes to get the result",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "webclient-parallel-zip",
    title: "Parallel Calls with Zip",
    topic: "WebClient & WebFlux",
    topicSlug: "webclient",
    difficulty: "Medium",
    description:
      'Simulate two parallel WebClient calls using Mono.zip(). Call getUser() which returns Mono.just("Alice") and getRole() which returns Mono.just("Admin"). Zip them together and print "Alice is Admin".\n\nMono.zip() executes both calls concurrently and combines their results.',
    starterCode: `import reactor.core.publisher.Mono

fun getUser(): Mono<String> {
    return Mono.just("Alice")
}

fun getRole(): Mono<String> {
    return Mono.just("Admin")
}

fun main() {
    // TODO: Zip getUser() and getRole()
    // Print "{user} is {role}"
}
`,
    solution: `import reactor.core.publisher.Mono

fun getUser(): Mono<String> {
    return Mono.just("Alice")
}

fun getRole(): Mono<String> {
    return Mono.just("Admin")
}

fun main() {
    Mono.zip(getUser(), getRole()) { user, role -> "$user is $role" }
        .subscribe { println(it) }
}
`,
    explanation:
      "Mono.zip() subscribes to multiple Monos concurrently and combines their results when all complete. This is ideal for making independent API calls in parallel, significantly reducing response time.",
    hints: [
      "Use Mono.zip(mono1, mono2) { a, b -> ... }",
      'Combine with string template: "$user is $role"',
      "Subscribe to print the combined result",
    ],
    expectedOutput: "Alice is Admin",
    testCases: [
      {
        description: "Uses Mono.zip()",
        validate: (code: string) => /Mono\s*\.\s*zip/.test(code),
      },
      {
        description: "Calls getUser()",
        validate: (code: string) => /getUser\s*\(/.test(code),
      },
      {
        description: "Calls getRole()",
        validate: (code: string) => /getRole\s*\(/.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "webclient-error-fallback",
    title: "HTTP Error Fallback Pattern",
    topic: "WebClient & WebFlux",
    topicSlug: "webclient",
    difficulty: "Hard",
    description:
      'Simulate a WebClient call that fails. Create fetchFromPrimary() that returns Mono.error(RuntimeException("Service unavailable")). Create fetchFromFallback() that returns Mono.just("Fallback data"). Chain them with onErrorResume and print the result.\n\nThis pattern is critical for resilient microservices.',
    starterCode: `import reactor.core.publisher.Mono

fun fetchFromPrimary(): Mono<String> {
    // TODO: Return an error Mono
    return Mono.empty()
}

fun fetchFromFallback(): Mono<String> {
    // TODO: Return "Fallback data"
    return Mono.empty()
}

fun main() {
    // TODO: Try primary, fall back to secondary
    // Print the result
}
`,
    solution: `import reactor.core.publisher.Mono

fun fetchFromPrimary(): Mono<String> {
    return Mono.error(RuntimeException("Service unavailable"))
}

fun fetchFromFallback(): Mono<String> {
    return Mono.just("Fallback data")
}

fun main() {
    fetchFromPrimary()
        .onErrorResume { fetchFromFallback() }
        .subscribe { println(it) }
}
`,
    explanation:
      "This pattern simulates a circuit-breaker-like fallback. When the primary service fails, onErrorResume() switches to a fallback Publisher. In production, this could be a cache, a secondary service, or a default response.",
    hints: [
      "fetchFromPrimary() should return Mono.error()",
      "fetchFromFallback() should return Mono.just()",
      "Use .onErrorResume { fetchFromFallback() } to chain",
    ],
    expectedOutput: "Fallback data",
    testCases: [
      {
        description: "Primary returns an error",
        validate: (code: string) => /Mono\s*\.\s*error/.test(code),
      },
      {
        description: "Fallback returns data",
        validate: (code: string) => /Fallback data/.test(code),
      },
      {
        description: "Uses onErrorResume()",
        validate: (code: string) => /\.onErrorResume/.test(code),
      },
      {
        description: "Chains primary to fallback",
        validate: (code: string) => /fetchFromPrimary/.test(code) && /fetchFromFallback/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 7: Testing Reactive Code (4 challenges)
  // ============================================================
  {
    id: "stepverifier-basic",
    title: "StepVerifier Basics",
    topic: "Testing Reactive Code",
    topicSlug: "testing",
    difficulty: "Easy",
    description:
      'Write a StepVerifier test for a Flux emitting "A", "B", "C". Verify each element in order, then verify completion. Print "Test passed!" at the end.\n\nStepVerifier is the standard way to test reactive streams in Project Reactor.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just("A", "B", "C")

    // TODO: Use StepVerifier.create(flux)
    // expectNext "A", "B", "C"
    // verifyComplete()
    // Print "Test passed!"
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just("A", "B", "C")

    StepVerifier.create(flux)
        .expectNext("A")
        .expectNext("B")
        .expectNext("C")
        .verifyComplete()

    println("Test passed!")
}
`,
    explanation:
      "StepVerifier subscribes to a Publisher and lets you assert expectations step by step. expectNext() verifies the next emitted element. verifyComplete() asserts the stream completed without error.",
    hints: [
      "StepVerifier.create(publisher) starts the verification",
      "Chain .expectNext() for each expected element",
      ".verifyComplete() asserts completion",
    ],
    expectedOutput: "Test passed!",
    testCases: [
      {
        description: "Uses StepVerifier.create()",
        validate: (code: string) => /StepVerifier\s*\.\s*create/.test(code),
      },
      {
        description: "Uses expectNext()",
        validate: (code: string) => /\.expectNext/.test(code),
      },
      {
        description: "Calls verifyComplete()",
        validate: (code: string) => /\.verifyComplete/.test(code),
      },
      {
        description: "Prints success message",
        validate: (code: string) => /Test passed/.test(code),
      },
    ],
  },
  {
    id: "stepverifier-error",
    title: "Verify Error Signals",
    topic: "Testing Reactive Code",
    topicSlug: "testing",
    difficulty: "Medium",
    description:
      'Write a StepVerifier test for a Flux that emits "OK" then throws an IllegalStateException("Boom"). Verify the element, then verify the error. Print "Error test passed!".\n\nexpectError() verifies that the stream terminates with an error.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just("OK")
        .concatWith(Flux.error(IllegalStateException("Boom")))

    // TODO: StepVerifier - expectNext "OK", then expectError
    // Print "Error test passed!"
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just("OK")
        .concatWith(Flux.error(IllegalStateException("Boom")))

    StepVerifier.create(flux)
        .expectNext("OK")
        .expectError(IllegalStateException::class.java)
        .verify()

    println("Error test passed!")
}
`,
    explanation:
      "expectError(Class) verifies the stream terminated with a specific error type. Unlike verifyComplete(), .verify() is used after expectError() to trigger the verification.",
    hints: [
      "expectError(ExceptionClass::class.java) verifies error type",
      "Use .verify() instead of .verifyComplete() after expectError",
      "You can also use .expectErrorMessage() for message checks",
    ],
    expectedOutput: "Error test passed!",
    testCases: [
      {
        description: "Uses StepVerifier.create()",
        validate: (code: string) => /StepVerifier\s*\.\s*create/.test(code),
      },
      {
        description: "Uses expectError()",
        validate: (code: string) => /\.expectError/.test(code),
      },
      {
        description: "Verifies IllegalStateException",
        validate: (code: string) => /IllegalStateException/.test(code),
      },
      {
        description: "Calls verify()",
        validate: (code: string) => /\.verify\s*\(/.test(code),
      },
    ],
  },
  {
    id: "stepverifier-count",
    title: "Verify Element Count",
    topic: "Testing Reactive Code",
    topicSlug: "testing",
    difficulty: "Medium",
    description:
      'Create a Flux emitting 1 through 100 and verify it emits exactly 100 elements using StepVerifier. Use expectNextCount(). Print "Count test passed!".\n\nexpectNextCount(n) skips n elements without asserting their values.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.range(1, 100)

    // TODO: StepVerifier - verify 100 elements emitted
    // Print "Count test passed!"
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.range(1, 100)

    StepVerifier.create(flux)
        .expectNextCount(100)
        .verifyComplete()

    println("Count test passed!")
}
`,
    explanation:
      "expectNextCount(n) expects exactly n elements to be emitted without verifying their values. This is useful when you care about the quantity but not the specific content of each element.",
    hints: [
      "expectNextCount(100) expects 100 elements",
      "It doesn't check values, only count",
      "Follow with verifyComplete()",
    ],
    expectedOutput: "Count test passed!",
    testCases: [
      {
        description: "Uses StepVerifier",
        validate: (code: string) => /StepVerifier\s*\.\s*create/.test(code),
      },
      {
        description: "Uses expectNextCount()",
        validate: (code: string) => /\.expectNextCount\s*\(\s*100\s*\)/.test(code),
      },
      {
        description: "Verifies completion",
        validate: (code: string) => /\.verifyComplete/.test(code),
      },
      {
        description: "Prints success message",
        validate: (code: string) => /Count test passed/.test(code),
      },
    ],
  },
  {
    id: "stepverifier-assert",
    title: "Custom Assertions",
    topic: "Testing Reactive Code",
    topicSlug: "testing",
    difficulty: "Hard",
    description:
      'Create a Flux of 2, 4, 6, 8 and use StepVerifier with assertNext() to verify each element is even. Print "Assert test passed!" after verification.\n\nassertNext() lets you run custom assertions on each element.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just(2, 4, 6, 8)

    // TODO: StepVerifier with assertNext on each element
    // Verify each is even (x % 2 == 0)
    // Print "Assert test passed!"
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.test.StepVerifier

fun main() {
    val flux = Flux.just(2, 4, 6, 8)

    StepVerifier.create(flux)
        .assertNext { assert(it % 2 == 0) { "$it is not even" } }
        .assertNext { assert(it % 2 == 0) { "$it is not even" } }
        .assertNext { assert(it % 2 == 0) { "$it is not even" } }
        .assertNext { assert(it % 2 == 0) { "$it is not even" } }
        .verifyComplete()

    println("Assert test passed!")
}
`,
    explanation:
      "assertNext() accepts a Consumer that can run arbitrary assertions on the next emitted element. If the assertion fails, the StepVerifier will report the failure.",
    hints: [
      "assertNext { } lets you run custom assertions",
      "Use assert(condition) { message } inside",
      "You need one assertNext for each emitted element",
    ],
    expectedOutput: "Assert test passed!",
    testCases: [
      {
        description: "Uses StepVerifier",
        validate: (code: string) => /StepVerifier\s*\.\s*create/.test(code),
      },
      {
        description: "Uses assertNext()",
        validate: (code: string) => /\.assertNext/.test(code),
      },
      {
        description: "Checks for even numbers",
        validate: (code: string) => /%\s*2/.test(code),
      },
      {
        description: "Verifies completion",
        validate: (code: string) => /\.verifyComplete/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 8: Kafka & Messaging Patterns (4 challenges)
  // ============================================================
  {
    id: "kafka-pub-sub-pattern",
    title: "Publish-Subscribe Pattern",
    topic: "Kafka & Messaging Patterns",
    topicSlug: "kafka-messaging",
    difficulty: "Easy",
    description:
      'Simulate a Kafka pub-sub pattern. Create a "topic" as a Flux emitting "order-1", "order-2", "order-3". Subscribe two consumers: "Consumer A" and "Consumer B". Each should print their name and the message.\n\nThis simulates multiple consumers in a pub-sub pattern.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // Simulate a Kafka topic
    val topic = Flux.just("order-1", "order-2", "order-3")

    // TODO: Subscribe Consumer A and Consumer B
    // Print "Consumer A: order-1", etc.
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val topic = Flux.just("order-1", "order-2", "order-3")

    topic.subscribe { println("Consumer A: $it") }
    topic.subscribe { println("Consumer B: $it") }
}
`,
    explanation:
      "In a pub-sub pattern, multiple consumers independently receive copies of all messages. With a cold Flux, each subscriber gets all events independently — modeling how Kafka consumer groups with different group IDs work.",
    hints: [
      "Subscribe to the topic Flux twice",
      "Each subscriber prints with its own prefix",
      "Cold publishers replay for each subscriber",
    ],
    expectedOutput: "Consumer A: order-1\nConsumer A: order-2\nConsumer A: order-3\nConsumer B: order-1\nConsumer B: order-2\nConsumer B: order-3",
    testCases: [
      {
        description: "Subscribes twice to the topic",
        validate: (code: string) => (code.match(/\.subscribe/g) || []).length >= 2,
      },
      {
        description: "Uses Consumer A prefix",
        validate: (code: string) => /Consumer A/.test(code),
      },
      {
        description: "Uses Consumer B prefix",
        validate: (code: string) => /Consumer B/.test(code),
      },
      {
        description: "Prints messages",
        validate: (code: string) => /println/.test(code),
      },
    ],
  },
  {
    id: "kafka-dlq-pattern",
    title: "Dead Letter Queue Pattern",
    topic: "Kafka & Messaging Patterns",
    topicSlug: "kafka-messaging",
    difficulty: "Medium",
    description:
      'Simulate a DLQ pattern. Process messages "msg-1", "msg-2", "POISON", "msg-3". If a message equals "POISON", route it to a DLQ (print "DLQ: POISON"), otherwise process normally (print "Processed: msg-1"). Use Flux operators to implement this.\n\nDLQ (Dead Letter Queue) handles messages that cannot be processed normally.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    val messages = Flux.just("msg-1", "msg-2", "POISON", "msg-3")

    // TODO: Process each message
    // If "POISON" -> print "DLQ: POISON"
    // Otherwise -> print "Processed: <msg>"
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val messages = Flux.just("msg-1", "msg-2", "POISON", "msg-3")

    messages.doOnNext { msg ->
        if (msg == "POISON") {
            println("DLQ: $msg")
        } else {
            println("Processed: $msg")
        }
    }.subscribe()
}
`,
    explanation:
      "The DLQ pattern routes unprocessable messages to a separate queue. Here we simulate it by checking each message and routing 'POISON' messages to a DLQ log while processing others normally.",
    hints: [
      "Use doOnNext {} or map {} to inspect each message",
      'Check if message equals "POISON"',
      "Subscribe to trigger the processing",
    ],
    expectedOutput: "Processed: msg-1\nProcessed: msg-2\nDLQ: POISON\nProcessed: msg-3",
    testCases: [
      {
        description: "Processes all messages",
        validate: (code: string) => /messages/.test(code) && /\.subscribe/.test(code),
      },
      {
        description: "Routes POISON to DLQ",
        validate: (code: string) => /DLQ/.test(code) && /POISON/.test(code),
      },
      {
        description: "Processes normal messages",
        validate: (code: string) => /Processed/.test(code),
      },
      {
        description: "Uses conditional logic",
        validate: (code: string) => /if\s*\(/.test(code) || /when\s*\(/.test(code) || /when\s*\{/.test(code),
      },
    ],
  },
  {
    id: "kafka-request-reply",
    title: "Request-Reply Pattern",
    topic: "Kafka & Messaging Patterns",
    topicSlug: "kafka-messaging",
    difficulty: "Medium",
    description:
      'Simulate a request-reply pattern. Create a processRequest() function that takes a String request and returns Mono<String> with "Reply to: <request>". Send requests "ping", "hello", "status" and print each reply.\n\nRequest-Reply over messaging simulates synchronous-like communication.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun processRequest(request: String): Mono<String> {
    // TODO: Return "Reply to: <request>"
    return Mono.empty()
}

fun main() {
    val requests = Flux.just("ping", "hello", "status")

    // TODO: flatMap each request to processRequest
    // Print each reply
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun processRequest(request: String): Mono<String> {
    return Mono.just("Reply to: $request")
}

fun main() {
    val requests = Flux.just("ping", "hello", "status")

    requests.flatMap { processRequest(it) }
        .subscribe { println(it) }
}
`,
    explanation:
      "The request-reply pattern maps each request to a response using flatMap. Each request is processed asynchronously, returning a Mono with the reply. This models how Kafka can be used for synchronous-like request/response flows.",
    hints: [
      'Return Mono.just("Reply to: $request")',
      "Use flatMap to chain each request to processRequest",
      "Subscribe to print each reply",
    ],
    expectedOutput: "Reply to: ping\nReply to: hello\nReply to: status",
    testCases: [
      {
        description: "processRequest returns a Mono",
        validate: (code: string) => /Mono\s*\.\s*just/.test(code) && /Reply to/.test(code),
      },
      {
        description: "Uses flatMap for request processing",
        validate: (code: string) => /\.flatMap/.test(code),
      },
      {
        description: "Calls processRequest",
        validate: (code: string) => /processRequest/.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "kafka-content-routing",
    title: "Content-Based Routing",
    topic: "Kafka & Messaging Patterns",
    topicSlug: "kafka-messaging",
    difficulty: "Hard",
    description:
      'Implement content-based routing. Given messages with types: "ORDER:laptop", "LOG:debug info", "ORDER:phone", "LOG:error info". Route ORDER messages to an orders stream and LOG messages to a logs stream. Use groupBy() operator and print with appropriate labels.\n\nExpected: "Orders: laptop", "Logs: debug info", etc.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    val messages = Flux.just(
        "ORDER:laptop",
        "LOG:debug info",
        "ORDER:phone",
        "LOG:error info"
    )

    // TODO: Group by message type (ORDER vs LOG)
    // Route and print with appropriate labels
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val messages = Flux.just(
        "ORDER:laptop",
        "LOG:debug info",
        "ORDER:phone",
        "LOG:error info"
    )

    messages.groupBy { it.substringBefore(":") }
        .flatMap { group ->
            group.map { msg ->
                val content = msg.substringAfter(":")
                when (group.key()) {
                    "ORDER" -> "Orders: $content"
                    "LOG" -> "Logs: $content"
                    else -> "Unknown: $content"
                }
            }
        }
        .subscribe { println(it) }
}
`,
    explanation:
      "groupBy() splits a Flux into multiple GroupedFlux based on a key. Each group can be processed independently, enabling content-based routing. This is how Kafka consumers might route messages to different processing pipelines.",
    hints: [
      "Use groupBy { it.substringBefore(\":\") } to split by type",
      "flatMap each group and use group.key() to determine routing",
      "substringAfter(\":\") extracts the message content",
    ],
    expectedOutput: "Orders: laptop\nOrders: phone\nLogs: debug info\nLogs: error info",
    testCases: [
      {
        description: "Uses groupBy()",
        validate: (code: string) => /\.groupBy/.test(code),
      },
      {
        description: "Routes ORDER messages",
        validate: (code: string) => /Orders?:/.test(code) || /ORDER/.test(code),
      },
      {
        description: "Routes LOG messages",
        validate: (code: string) => /Logs?:/.test(code) || /LOG/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 9: Resilience Patterns (4 challenges)
  // ============================================================
  {
    id: "timeout-pattern",
    title: "Timeout with Fallback",
    topic: "Resilience Patterns",
    topicSlug: "resilience",
    difficulty: "Easy",
    description:
      'Create a Mono that simulates a slow service by delaying 5 seconds. Apply a timeout of 1 second and provide a fallback value "Timeout fallback" using onErrorReturn. Subscribe and print.\n\nNote: For Piston execution, simulate with Mono.delay and .timeout().',
    starterCode: `import reactor.core.publisher.Mono
import java.time.Duration

fun main() {
    // TODO: Simulate a slow service (delay > timeout)
    // Apply timeout of 1 second
    // Provide fallback on timeout
    // Print the result
}
`,
    solution: `import reactor.core.publisher.Mono
import java.time.Duration

fun main() {
    Mono.delay(Duration.ofSeconds(5))
        .map { "Slow response" }
        .timeout(Duration.ofSeconds(1))
        .onErrorReturn("Timeout fallback")
        .subscribe { println(it) }

    Thread.sleep(2000)
}
`,
    explanation:
      "timeout() sets a maximum time to wait for the next signal. If the timeout expires, it emits a TimeoutException. Combined with onErrorReturn(), this creates a resilient pattern that provides a fallback for slow services.",
    hints: [
      "Mono.delay() creates a delayed emission",
      ".timeout(Duration.ofSeconds(1)) sets the timeout",
      "onErrorReturn catches the TimeoutException",
      "Thread.sleep() keeps the JVM alive for async operations",
    ],
    expectedOutput: "Timeout fallback",
    testCases: [
      {
        description: "Uses timeout()",
        validate: (code: string) => /\.timeout/.test(code),
      },
      {
        description: "Uses a Duration",
        validate: (code: string) => /Duration\s*\.\s*of/.test(code),
      },
      {
        description: "Provides a fallback value",
        validate: (code: string) => /onErrorReturn|onErrorResume/.test(code),
      },
      {
        description: "Subscribes",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "retry-with-backoff",
    title: "Retry with Backoff",
    topic: "Resilience Patterns",
    topicSlug: "resilience",
    difficulty: "Medium",
    description:
      'Create a service that fails the first 2 times and succeeds on the 3rd. Use retryWhen with Retry.fixedDelay(2, Duration.ofMillis(100)) to retry with delay. Print the result.\n\nretryWhen with Retry.fixedDelay adds a delay between retries.',
    starterCode: `import reactor.core.publisher.Mono
import reactor.util.retry.Retry
import java.time.Duration
import java.util.concurrent.atomic.AtomicInteger

fun main() {
    val attempts = AtomicInteger(0)

    // TODO: Mono.defer that fails first 2 times
    // retryWhen with Retry.fixedDelay
    // Print the result
}
`,
    solution: `import reactor.core.publisher.Mono
import reactor.util.retry.Retry
import java.time.Duration
import java.util.concurrent.atomic.AtomicInteger

fun main() {
    val attempts = AtomicInteger(0)

    Mono.defer {
        if (attempts.incrementAndGet() < 3) {
            Mono.error(RuntimeException("Attempt \${attempts.get()} failed"))
        } else {
            Mono.just("Success on attempt \${attempts.get()}")
        }
    }
    .retryWhen(Retry.fixedDelay(2, Duration.ofMillis(100)))
    .subscribe { println(it) }

    Thread.sleep(1000)
}
`,
    explanation:
      "retryWhen() with Retry.fixedDelay(maxRetries, delay) implements exponential backoff retries. It re-subscribes to the upstream after waiting the specified duration, up to the maximum number of retries.",
    hints: [
      "Use Mono.defer {} for lazy evaluation on each retry",
      "Retry.fixedDelay(2, Duration.ofMillis(100))",
      "Thread.sleep() keeps the program alive for async retries",
    ],
    expectedOutput: "Success on attempt 3",
    testCases: [
      {
        description: "Uses retryWhen()",
        validate: (code: string) => /\.retryWhen/.test(code),
      },
      {
        description: "Uses Retry.fixedDelay",
        validate: (code: string) => /Retry\s*\.\s*fixedDelay/.test(code),
      },
      {
        description: "Uses defer for lazy evaluation",
        validate: (code: string) => /\.defer/.test(code),
      },
      {
        description: "Tracks attempts",
        validate: (code: string) => /AtomicInteger/.test(code),
      },
    ],
  },
  {
    id: "circuit-breaker-sim",
    title: "Circuit Breaker Simulation",
    topic: "Resilience Patterns",
    topicSlug: "resilience",
    difficulty: "Hard",
    description:
      'Simulate a circuit breaker. Create a call counter and a function callService() that:\n- Calls 1-3: return error "Service down"\n- Calls 4+: return "Service recovered"\n\nUse retry(3) and doOnError to log each failure. Print the final result.',
    starterCode: `import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

val callCount = AtomicInteger(0)

fun callService(): Mono<String> {
    // TODO: Fail for first 3 calls, succeed after
    return Mono.empty()
}

fun main() {
    // TODO: Call service with retry(3)
    // doOnError to log failures
    // Print the result
}
`,
    solution: `import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

val callCount = AtomicInteger(0)

fun callService(): Mono<String> {
    return Mono.defer {
        val count = callCount.incrementAndGet()
        if (count <= 3) {
            Mono.error(RuntimeException("Service down (call $count)"))
        } else {
            Mono.just("Service recovered")
        }
    }
}

fun main() {
    callService()
        .doOnError { println("Failed: \${it.message}") }
        .retry(3)
        .subscribe { println(it) }
}
`,
    explanation:
      "This simulates a circuit breaker pattern. The service fails for the first 3 calls, then recovers. retry(3) allows 3 retries (4 total attempts). doOnError logs each failure, providing visibility into the retry behavior.",
    hints: [
      "Use Mono.defer {} so each retry re-evaluates",
      "Track calls with AtomicInteger",
      "retry(3) gives 4 total attempts (1 initial + 3 retries)",
      "doOnError is called on each failure before retry",
    ],
    expectedOutput: "Failed: Service down (call 1)\nFailed: Service down (call 2)\nFailed: Service down (call 3)\nService recovered",
    testCases: [
      {
        description: "Uses Mono.defer()",
        validate: (code: string) => /Mono\s*\.\s*defer/.test(code),
      },
      {
        description: "Uses retry()",
        validate: (code: string) => /\.retry\s*\(/.test(code),
      },
      {
        description: "Logs failures with doOnError",
        validate: (code: string) => /\.doOnError/.test(code),
      },
      {
        description: "Uses AtomicInteger for call counting",
        validate: (code: string) => /AtomicInteger/.test(code),
      },
    ],
  },
  {
    id: "bulkhead-pattern",
    title: "Bulkhead with FlatMap Concurrency",
    topic: "Resilience Patterns",
    topicSlug: "resilience",
    difficulty: "Hard",
    description:
      'Simulate the bulkhead pattern using flatMap concurrency. Create a Flux of task IDs 1 through 6 and process them with flatMap limited to 2 concurrent tasks. Each task should print "Processing task <id>" and return "Done <id>". Print results.\n\nflatMap(mapper, concurrency) limits how many inner publishers run simultaneously.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun processTask(id: Int): Mono<String> {
    // TODO: Print "Processing task <id>" and return "Done <id>"
    return Mono.empty()
}

fun main() {
    // TODO: Flux of 1..6
    // flatMap with concurrency 2
    // Subscribe and print results
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun processTask(id: Int): Mono<String> {
    println("Processing task $id")
    return Mono.just("Done $id")
}

fun main() {
    Flux.range(1, 6)
        .flatMap({ processTask(it) }, 2)
        .subscribe { println(it) }
}
`,
    explanation:
      "The bulkhead pattern limits concurrency to prevent resource exhaustion. flatMap(mapper, concurrency) controls how many inner publishers subscribe concurrently. With concurrency=2, only 2 tasks are processed at a time.",
    hints: [
      "flatMap takes a second parameter for concurrency",
      "flatMap({ mapper }, 2) limits to 2 concurrent operations",
      "processTask should print and return a Mono",
    ],
    expectedOutput: "Processing task 1\nDone 1\nProcessing task 2\nDone 2\nProcessing task 3\nDone 3\nProcessing task 4\nDone 4\nProcessing task 5\nDone 5\nProcessing task 6\nDone 6",
    testCases: [
      {
        description: "Uses flatMap with concurrency",
        validate: (code: string) => /\.flatMap\s*\(.*,\s*2\s*\)/.test(code),
      },
      {
        description: "Processes tasks",
        validate: (code: string) => /processTask/.test(code),
      },
      {
        description: "Prints processing status",
        validate: (code: string) => /Processing task/.test(code),
      },
      {
        description: "Subscribes to results",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },

  // ============================================================
  // TOPIC 10: Advanced Reactive Patterns (4 challenges)
  // ============================================================
  {
    id: "merge-streams",
    title: "Merge Multiple Streams",
    topic: "Advanced Reactive Patterns",
    topicSlug: "advanced-patterns",
    difficulty: "Easy",
    description:
      'Merge three Flux sources into one:\n- Source 1: "A1", "A2"\n- Source 2: "B1", "B2"\n- Source 3: "C1", "C2"\n\nUse Flux.merge() and subscribe to print all values.',
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    val source1 = Flux.just("A1", "A2")
    val source2 = Flux.just("B1", "B2")
    val source3 = Flux.just("C1", "C2")

    // TODO: Merge all three sources and print
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    val source1 = Flux.just("A1", "A2")
    val source2 = Flux.just("B1", "B2")
    val source3 = Flux.just("C1", "C2")

    Flux.merge(source1, source2, source3)
        .subscribe { println(it) }
}
`,
    explanation:
      "Flux.merge() subscribes to multiple sources eagerly and interleaves their emissions. Unlike concat() which waits for each source to complete, merge() processes all sources concurrently.",
    hints: [
      "Flux.merge(source1, source2, source3) combines them",
      "Merge interleaves emissions (concurrent subscription)",
      "Subscribe and print each value",
    ],
    expectedOutput: "A1\nA2\nB1\nB2\nC1\nC2",
    testCases: [
      {
        description: "Uses Flux.merge()",
        validate: (code: string) => /Flux\s*\.\s*merge/.test(code),
      },
      {
        description: "Includes all three sources",
        validate: (code: string) => /source1/.test(code) && /source2/.test(code) && /source3/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
      {
        description: "Prints values",
        validate: (code: string) => /println/.test(code),
      },
    ],
  },
  {
    id: "scan-running-total",
    title: "Running Total with Scan",
    topic: "Advanced Reactive Patterns",
    topicSlug: "advanced-patterns",
    difficulty: "Medium",
    description:
      "Create a Flux of 1, 2, 3, 4, 5 and use scan() to compute a running total. Print each intermediate sum.\n\nscan() is like reduce() but emits each intermediate accumulation.",
    starterCode: `import reactor.core.publisher.Flux

fun main() {
    // TODO: Flux of 1..5
    // Use scan to compute running total
    // Print each intermediate value
}
`,
    solution: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 5)
        .scan(0) { acc, next -> acc + next }
        .skip(1)
        .subscribe { println(it) }
}
`,
    explanation:
      "scan() works like reduce() but emits each intermediate accumulation as it processes elements. This is useful for running totals, state machines, and progressive computations. skip(1) omits the initial seed value.",
    hints: [
      "scan(initial) { acc, next -> ... } accumulates values",
      "Unlike reduce, scan emits every intermediate result",
      "Use skip(1) to skip the initial seed if you want",
    ],
    expectedOutput: "1\n3\n6\n10\n15",
    testCases: [
      {
        description: "Uses scan()",
        validate: (code: string) => /\.scan/.test(code),
      },
      {
        description: "Accumulates values",
        validate: (code: string) => /acc|sum/.test(code) || /\+/.test(code),
      },
      {
        description: "Uses Flux as source",
        validate: (code: string) => /Flux\s*\./.test(code),
      },
      {
        description: "Subscribes and prints",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "switch-map-latest",
    title: "Switch to Latest with SwitchMap",
    topic: "Advanced Reactive Patterns",
    topicSlug: "advanced-patterns",
    difficulty: "Medium",
    description:
      'Create a Flux of "search-1", "search-2", "search-3" (simulating user typing). Use switchMap to process only the latest emission. Each should transform to "Results for: <query>". Print results.\n\nswitchMap cancels previous inner publishers when a new element arrives.',
    starterCode: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun search(query: String): Mono<String> {
    // TODO: Return "Results for: <query>"
    return Mono.empty()
}

fun main() {
    val queries = Flux.just("search-1", "search-2", "search-3")

    // TODO: switchMap to search, print results
}
`,
    solution: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun search(query: String): Mono<String> {
    return Mono.just("Results for: $query")
}

fun main() {
    val queries = Flux.just("search-1", "search-2", "search-3")

    queries.switchMap { search(it) }
        .subscribe { println(it) }
}
`,
    explanation:
      "switchMap() cancels the previous inner publisher whenever a new element arrives from the outer publisher. This is the ideal pattern for search-as-you-type where you only care about the latest query's results.",
    hints: [
      "switchMap cancels previous inner publishers",
      "Return Mono.just() from the search function",
      "With synchronous sources, all results still appear",
    ],
    expectedOutput: "Results for: search-1\nResults for: search-2\nResults for: search-3",
    testCases: [
      {
        description: "Uses switchMap()",
        validate: (code: string) => /\.switchMap/.test(code),
      },
      {
        description: "Returns Mono from search",
        validate: (code: string) => /Mono\s*\.\s*just/.test(code) && /Results for/.test(code),
      },
      {
        description: "Calls search function",
        validate: (code: string) => /search\s*\(/.test(code),
      },
      {
        description: "Subscribes to output",
        validate: (code: string) => /\.subscribe/.test(code),
      },
    ],
  },
  {
    id: "transform-reusable",
    title: "Reusable Transform Pipeline",
    topic: "Advanced Reactive Patterns",
    topicSlug: "advanced-patterns",
    difficulty: "Hard",
    description:
      "Create a reusable transform function called `addLogging` that takes a Flux<String> and returns a Flux<String> that:\n1. Adds a doOnNext printing \"Processing: <item>\"\n2. Maps each item to uppercase\n\nApply it to a Flux of \"hello\", \"world\", \"reactor\" using .transform(). Print results.\n\ntransform() applies a reusable pipeline of operators.",
    starterCode: `import reactor.core.publisher.Flux
import java.util.function.Function

// TODO: Create addLogging function
// that adds doOnNext logging and maps to uppercase

fun main() {
    val source = Flux.just("hello", "world", "reactor")

    // TODO: Apply transform and print
}
`,
    solution: `import reactor.core.publisher.Flux
import java.util.function.Function

val addLogging = Function<Flux<String>, Flux<String>> { flux ->
    flux.doOnNext { println("Processing: $it") }
        .map { it.uppercase() }
}

fun main() {
    val source = Flux.just("hello", "world", "reactor")

    source.transform(addLogging)
        .subscribe { println(it) }
}
`,
    explanation:
      "transform() applies a Function<Flux<T>, Flux<R>> to a Flux, enabling reusable operator pipelines. This promotes DRY code by encapsulating common operator chains that can be applied to different sources.",
    hints: [
      "Create a Function<Flux<String>, Flux<String>>",
      "Inside, chain doOnNext and map operators",
      "Apply with .transform(functionRef)",
    ],
    expectedOutput: "Processing: hello\nHELLO\nProcessing: world\nWORLD\nProcessing: reactor\nREACTOR",
    testCases: [
      {
        description: "Uses transform()",
        validate: (code: string) => /\.transform/.test(code),
      },
      {
        description: "Uses doOnNext for logging",
        validate: (code: string) => /doOnNext/.test(code) && /Processing/.test(code),
      },
      {
        description: "Maps to uppercase",
        validate: (code: string) => /uppercase|toUpperCase/.test(code),
      },
      {
        description: "Creates a reusable function",
        validate: (code: string) => /Function/.test(code) || /val\s+\w+.*=.*\{/.test(code),
      },
    ],
  },
];

export function getReactorChallengeById(id: string): ReactorChallenge | undefined {
  return REACTOR_CHALLENGES.find((c) => c.id === id);
}

export function getReactorChallengesByTopic(topicSlug: string): ReactorChallenge[] {
  return REACTOR_CHALLENGES.filter((c) => c.topicSlug === topicSlug);
}
