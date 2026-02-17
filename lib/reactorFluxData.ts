/**
 * Project Reactor Flux – comprehensive documentation data.
 * Covers all major Flux operators organized by category with Kotlin code examples
 * and marble diagram image references.
 */

export interface ReactorTocItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

export type ReactorBlock =
  | { type: "heading"; level: 1 | 2 | 3; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "infoBox"; variant: "green" | "gray"; content: string }
  | { type: "code"; code: string; showPlay?: boolean; comment?: string }
  | { type: "image"; src: string; alt: string }
  | { type: "list"; items: string[] };

const IMG = "/images/reactor";

// ─── TABLE OF CONTENTS ─────────────────────────────────────────────────────────

export const REACTOR_FLUX_TOC: ReactorTocItem[] = [
  { id: "introduction", label: "Introduction to Flux" },
  {
    id: "creating-flux",
    label: "Creating a Flux",
    children: [
      { id: "just", label: "just" },
      { id: "from-iterable", label: "fromIterable / fromArray" },
      { id: "range", label: "range" },
      { id: "interval", label: "interval" },
      { id: "empty-error-never", label: "empty / error / never" },
      { id: "create-push", label: "create / push" },
      { id: "generate", label: "generate" },
      { id: "defer", label: "defer" },
    ],
  },
  {
    id: "transforming",
    label: "Transforming",
    children: [
      { id: "map", label: "map / mapNotNull" },
      { id: "flat-map", label: "flatMap" },
      { id: "flat-map-sequential", label: "flatMapSequential" },
      { id: "concat-map", label: "concatMap" },
      { id: "flat-map-iterable", label: "flatMapIterable" },
      { id: "switch-map", label: "switchMap" },
      { id: "handle", label: "handle" },
      { id: "cast-oftype", label: "cast / ofType" },
      { id: "scan", label: "scan" },
      { id: "expand", label: "expand / expandDeep" },
      { id: "index", label: "index" },
    ],
  },
  {
    id: "filtering",
    label: "Filtering",
    children: [
      { id: "filter", label: "filter / filterWhen" },
      { id: "distinct", label: "distinct / distinctUntilChanged" },
      { id: "take", label: "take / takeLast / takeUntil / takeWhile" },
      { id: "skip", label: "skip / skipLast / skipUntil / skipWhile" },
      { id: "element-at", label: "elementAt" },
      { id: "single", label: "single / singleOrEmpty" },
      { id: "next-last", label: "next / last" },
      { id: "sample", label: "sample / sampleFirst / sampleTimeout" },
    ],
  },
  {
    id: "combining",
    label: "Combining",
    children: [
      { id: "concat", label: "concat / concatWith" },
      { id: "merge", label: "merge / mergeWith" },
      { id: "merge-sequential", label: "mergeSequential" },
      { id: "merge-comparing", label: "mergeComparing / mergePriority" },
      { id: "zip", label: "zip / zipWith" },
      { id: "combine-latest", label: "combineLatest" },
      { id: "first-with", label: "firstWithSignal / firstWithValue" },
      { id: "start-with", label: "startWith" },
      { id: "switch-if-empty", label: "switchIfEmpty" },
      { id: "with-latest-from", label: "withLatestFrom" },
    ],
  },
  {
    id: "error-handling",
    label: "Error Handling",
    children: [
      { id: "on-error-resume", label: "onErrorResume" },
      { id: "on-error-return", label: "onErrorReturn" },
      { id: "on-error-map", label: "onErrorMap" },
      { id: "on-error-continue", label: "onErrorContinue" },
      { id: "on-error-complete", label: "onErrorComplete" },
      { id: "retry", label: "retry / retryWhen" },
    ],
  },
  {
    id: "peeking",
    label: "Peeking / Side Effects",
    children: [
      { id: "do-on-next", label: "doOnNext" },
      { id: "do-on-error", label: "doOnError" },
      { id: "do-on-complete", label: "doOnComplete / doOnTerminate" },
      { id: "do-on-subscribe", label: "doOnSubscribe / doFirst" },
      { id: "do-on-each", label: "doOnEach" },
      { id: "do-finally", label: "doFinally" },
      { id: "log", label: "log" },
      { id: "materialize", label: "materialize / dematerialize" },
    ],
  },
  {
    id: "buffering-windowing",
    label: "Buffering & Windowing",
    children: [
      { id: "buffer", label: "buffer" },
      { id: "buffer-timeout", label: "bufferTimeout" },
      { id: "buffer-until-while", label: "bufferUntil / bufferWhile" },
      { id: "buffer-when", label: "bufferWhen" },
      { id: "window", label: "window" },
      { id: "window-timeout", label: "windowTimeout" },
      { id: "group-by", label: "groupBy" },
    ],
  },
  {
    id: "reducing",
    label: "Reducing / Aggregating",
    children: [
      { id: "reduce", label: "reduce" },
      { id: "collect-list", label: "collectList / collectMap" },
      { id: "collect-sorted-list", label: "collectSortedList" },
      { id: "count", label: "count" },
      { id: "all-any-has", label: "all / any / hasElements" },
    ],
  },
  {
    id: "timing",
    label: "Timing & Delay",
    children: [
      { id: "delay-elements", label: "delayElements / delaySequence" },
      { id: "delay-subscription", label: "delaySubscription" },
      { id: "timeout", label: "timeout" },
      { id: "elapsed-timestamp", label: "elapsed / timestamp / timed" },
    ],
  },
  {
    id: "backpressure",
    label: "Backpressure",
    children: [
      { id: "on-backpressure-buffer", label: "onBackpressureBuffer" },
      { id: "on-backpressure-drop", label: "onBackpressureDrop" },
      { id: "on-backpressure-latest", label: "onBackpressureLatest" },
      { id: "on-backpressure-error", label: "onBackpressureError" },
      { id: "limit-rate", label: "limitRate" },
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    children: [
      { id: "publish-on", label: "publishOn" },
      { id: "subscribe-on", label: "subscribeOn" },
      { id: "parallel-flux", label: "parallel" },
    ],
  },
  {
    id: "multicasting",
    label: "Multicasting & Caching",
    children: [
      { id: "share", label: "share" },
      { id: "publish", label: "publish / ConnectableFlux" },
      { id: "replay-cache", label: "replay / cache" },
    ],
  },
  {
    id: "blocking",
    label: "Blocking Operations",
    children: [
      { id: "block-first-last", label: "blockFirst / blockLast" },
      { id: "to-iterable-stream", label: "toIterable / toStream" },
    ],
  },
  {
    id: "utility",
    label: "Utility Operators",
    children: [
      { id: "default-if-empty", label: "defaultIfEmpty" },
      { id: "sort", label: "sort" },
      { id: "repeat", label: "repeat / repeatWhen" },
      { id: "then-mono", label: "then / thenMany / thenEmpty" },
      { id: "transform", label: "transform / transformDeferred" },
      { id: "using", label: "using / usingWhen" },
    ],
  },
];

// ─── CONTENT BLOCKS ─────────────────────────────────────────────────────────────

export const REACTOR_FLUX_BLOCKS: ReactorBlock[] = [
  // ━━━━━━━━━ INTRODUCTION ━━━━━━━━━
  { type: "heading", level: 1, id: "introduction", text: "Project Reactor – Flux<T>" },
  { type: "paragraph", text: "A Flux is a Reactive Streams Publisher that emits 0 to N elements, and then completes (successfully or with an error). It is the multi-element reactive type in Project Reactor, analogous to Observable in RxJava or Flow in Kotlin Coroutines." },
  { type: "image", src: `${IMG}/flux.svg`, alt: "Flux marble diagram – emits 0 to N elements then completes or errors" },
  { type: "paragraph", text: "Flux is intended to be used in implementations and return types. Input parameters should keep using raw Publisher as much as possible. If you know the upstream will emit 0 or 1 element, use Mono instead." },
  { type: "infoBox", variant: "green", content: "In Kotlin with Spring WebFlux, Flux is typically used as the return type for endpoints that stream multiple items, while Mono is used for single-value responses." },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

// Simulate a reactive microservice pipeline
data class Order(val id: String, val product: String, val quantity: Int)

fun fetchOrders(): Flux<Order> = Flux.just(
    Order("ORD-1", "Laptop", 1),
    Order("ORD-2", "Mouse", 5),
    Order("ORD-3", "Monitor", 2)
)

fun main() {
    // Build a reactive pipeline: fetch → filter → transform → subscribe
    fetchOrders()
        .filter { it.quantity > 1 }                    // keep bulk orders
        .map { "\${it.id}: \${it.quantity}x \${it.product}" } // format
        .doOnNext { println("Processing: $it") }       // side-effect logging
        .subscribe(
            { value -> println("Fulfilled: $value") },
            { error -> println("Pipeline error: \${error.message}") },
            { println("All orders processed!") }
        )
}`, comment: "A reactive pipeline: fetch orders, filter, transform, and subscribe with full signal handling" },

  // ━━━━━━━━━ CREATING A FLUX ━━━━━━━━━
  { type: "heading", level: 2, id: "creating-flux", text: "Creating a Flux" },
  { type: "paragraph", text: "Reactor provides many factory methods to create Flux instances from various sources: static values, collections, ranges, time intervals, and programmatic generators." },

  // just
  { type: "heading", level: 3, id: "just", text: "just" },
  { type: "paragraph", text: "Create a Flux that emits the provided elements and then completes. The simplest way to create a Flux from known values." },
  { type: "image", src: `${IMG}/just.svg`, alt: "Flux.just marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Single element
    Flux.just("Hello")
        .subscribe { println(it) }

    // Multiple elements
    Flux.just(1, 2, 3, 4, 5)
        .subscribe { println("Item: $it") }

    // With explicit type
    val flux: Flux<String> = Flux.just("Kotlin", "Java", "Scala")
    flux.collectList()
        .subscribe { println("All: $it") }
}`, comment: "Flux.just() creates a Flux from one or more known values" },

  // fromIterable / fromArray
  { type: "heading", level: 3, id: "from-iterable", text: "fromIterable / fromArray" },
  { type: "paragraph", text: "Create a Flux from an existing Iterable (like a List, Set) or an array. Useful when you already have a collection of data." },
  { type: "image", src: `${IMG}/fromIterable.svg`, alt: "Flux.fromIterable marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // From a List
    val names = listOf("Alice", "Bob", "Charlie")
    Flux.fromIterable(names)
        .subscribe { println("Name: $it") }

    // From an Array
    val numbers = arrayOf(10, 20, 30, 40)
    Flux.fromArray(numbers)
        .map { it * 2 }
        .subscribe { println("Doubled: $it") }

    // From a Stream (Java Stream)
    val stream = (1..5).asSequence().asIterable()
    Flux.fromIterable(stream)
        .filter { it % 2 == 0 }
        .subscribe { println("Even: $it") }
}`, comment: "Creating Flux from collections and arrays" },

  // range
  { type: "heading", level: 3, id: "range", text: "range" },
  { type: "paragraph", text: "Build a Flux that emits a sequence of incrementing integers. The range starts from the given start value and emits count elements." },
  { type: "image", src: `${IMG}/range.svg`, alt: "Flux.range marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Emit integers from 1 to 5
    Flux.range(1, 5)
        .subscribe { println("Number: $it") }

    // Useful for generating sequences
    Flux.range(0, 10)
        .map { "Item-$it" }
        .subscribe { println(it) }
}`, comment: "Flux.range(start, count) emits incrementing integers" },

  // interval
  { type: "heading", level: 3, id: "interval", text: "interval" },
  { type: "paragraph", text: "Create a Flux that emits long values starting with 0 and incrementing at specified time intervals. Runs on the parallel Scheduler. The Flux will never complete naturally — use take() to limit it." },
  { type: "image", src: `${IMG}/interval.svg`, alt: "Flux.interval marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // Emit every 500ms, take first 5
    Flux.interval(Duration.ofMillis(500))
        .take(5)
        .subscribe { println("Tick: $it") }

    // With initial delay of 1 second, then every 200ms
    Flux.interval(Duration.ofSeconds(1), Duration.ofMillis(200))
        .take(5)
        .map { "Event-$it" }
        .subscribe { println(it) }

    // Block to wait for completion
    Thread.sleep(4000)
}`, comment: "Flux.interval() emits incrementing longs at fixed time intervals" },

  // empty / error / never
  { type: "heading", level: 3, id: "empty-error-never", text: "empty / error / never" },
  { type: "paragraph", text: "Special factory methods for edge cases: empty() completes immediately with no data, error() terminates immediately with an error, and never() never emits anything (no data, no error, no completion)." },
  { type: "image", src: `${IMG}/empty.svg`, alt: "Flux.empty marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Empty: completes immediately
    Flux.empty<String>()
        .defaultIfEmpty("No data")
        .subscribe { println("Empty result: $it") }

    // Error: terminates with an error
    Flux.error<String>(RuntimeException("Something went wrong"))
        .onErrorReturn("Fallback value")
        .subscribe { println("Error result: $it") }

    // Never: does not emit any signal
    // Flux.never<String>()  // Use with caution – subscribers wait forever
}`, comment: "Special Flux factories for testing and edge cases" },

  // create / push
  { type: "heading", level: 3, id: "create-push", text: "create / push" },
  { type: "paragraph", text: "Programmatically create a Flux using the FluxSink API. create() supports multi-threaded emission while push() is optimized for single-threaded producers. Both handle backpressure automatically by buffering." },
  { type: "image", src: `${IMG}/create.svg`, alt: "Flux.create marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.FluxSink

fun main() {
    // create: supports multi-threaded emission
    val flux = Flux.create<String> { sink: FluxSink<String> ->
        sink.next("First")
        sink.next("Second")
        sink.next("Third")
        sink.complete()
    }
    flux.subscribe { println("Created: $it") }

    // push: single-threaded producer, more efficient
    val pushFlux = Flux.push<Int> { sink ->
        for (i in 1..5) {
            sink.next(i * 10)
        }
        sink.complete()
    }
    pushFlux.subscribe { println("Pushed: $it") }

    // With backpressure strategy
    val buffered = Flux.create<String>(
        { sink ->
            repeat(100) { sink.next("Event-$it") }
            sink.complete()
        },
        FluxSink.OverflowStrategy.BUFFER
    )
    buffered.take(5).subscribe { println("Buffered: $it") }
}`, comment: "Programmatic Flux creation with FluxSink API" },

  // generate
  { type: "heading", level: 3, id: "generate", text: "generate" },
  { type: "paragraph", text: "Programmatically create a Flux by generating signals one-by-one via a SynchronousSink. Unlike create(), generate is synchronous and emits at most one element per invocation. It supports maintaining state between emissions." },
  { type: "image", src: `${IMG}/generate.svg`, alt: "Flux.generate marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Simple generate: Fibonacci sequence
    Flux.generate<Int, Pair<Int, Int>>(
        { Pair(0, 1) },                              // initial state
        { state, sink ->
            sink.next(state.first)                    // emit current
            val next = Pair(state.second, state.first + state.second)
            if (next.first > 100) sink.complete()     // stop condition
            next                                      // return new state
        }
    ).subscribe { println("Fibonacci: $it") }

    // Stateless generate: simple counter
    Flux.generate<String> { sink ->
        sink.next("Hello from generate!")
        sink.complete()
    }.subscribe { println(it) }

    // Generate with cleanup
    Flux.generate<Int, Int>(
        { 0 },
        { state, sink ->
            if (state < 5) {
                sink.next(state)
                state + 1
            } else {
                sink.complete()
                state
            }
        },
        { finalState -> println("Final state was: $finalState") }
    ).subscribe { println("Generated: $it") }
}`, comment: "Flux.generate() produces signals one-by-one with optional state" },

  // defer
  { type: "heading", level: 3, id: "defer", text: "defer" },
  { type: "paragraph", text: "Lazily supply a Publisher for each subscription. The actual source is created fresh per subscriber, enabling subscriber-specific instances and lazy evaluation." },
  { type: "image", src: `${IMG}/defer.svg`, alt: "Flux.defer marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.LocalDateTime

fun main() {
    // Without defer: timestamp captured at assembly time
    val eager = Flux.just(LocalDateTime.now().toString())

    // With defer: timestamp captured at subscription time
    val lazy = Flux.defer { Flux.just(LocalDateTime.now().toString()) }

    // Both subscriptions get the same value from eager
    eager.subscribe { println("Eager 1: $it") }
    Thread.sleep(1000)
    eager.subscribe { println("Eager 2: $it") } // Same time!

    // Each subscription gets a fresh value from lazy
    lazy.subscribe { println("Lazy 1: $it") }
    Thread.sleep(1000)
    lazy.subscribe { println("Lazy 2: $it") } // Different time!
}`, comment: "Flux.defer() creates a new publisher per subscription" },

  // ━━━━━━━━━ TRANSFORMING ━━━━━━━━━
  { type: "heading", level: 2, id: "transforming", text: "Transforming" },
  { type: "paragraph", text: "Transformation operators modify, reshape, or project the elements emitted by a Flux. These are the bread-and-butter of reactive programming." },

  // map
  { type: "heading", level: 3, id: "map", text: "map / mapNotNull" },
  { type: "paragraph", text: "Transform each item synchronously using a function. map() applies a 1-to-1 transformation. mapNotNull() is similar but filters out null results." },
  { type: "image", src: `${IMG}/map.svg`, alt: "Flux.map marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

data class User(val name: String, val age: Int)

fun main() {
    // Simple map
    Flux.just(1, 2, 3, 4, 5)
        .map { it * it }
        .subscribe { println("Squared: $it") }

    // Map to different type
    Flux.just("Alice:30", "Bob:25", "Charlie:35")
        .map { line ->
            val (name, age) = line.split(":")
            User(name, age.toInt())
        }
        .subscribe { println("User: \${it.name}, Age: \${it.age}") }

    // mapNotNull: filters out nulls
    Flux.just("1", "two", "3", "four", "5")
        .mapNotNull { it.toIntOrNull() }
        .subscribe { println("Parsed: $it") }
}`, comment: "map() transforms each element, mapNotNull() skips nulls" },

  // flatMap
  { type: "heading", level: 3, id: "flat-map", text: "flatMap" },
  { type: "paragraph", text: "Transform each element asynchronously into a Publisher, then flatten (merge) the inner publishers into a single Flux. Inner publishers are subscribed to eagerly and their values may interleave." },
  { type: "image", src: `${IMG}/flatMap.svg`, alt: "Flux.flatMap marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun fetchUserOrders(userId: String): Flux<String> =
    Flux.just("Order-A", "Order-B")
        .map { "\${userId}-$it" }
        .delayElements(Duration.ofMillis(100))

fun main() {
    // flatMap: elements may interleave
    Flux.just("user1", "user2", "user3")
        .flatMap { userId -> fetchUserOrders(userId) }
        .subscribe { println("Order: $it") }

    // With concurrency limit
    Flux.range(1, 10)
        .flatMap(
            { i -> Mono.just(i * 10).delayElement(Duration.ofMillis(50)) },
            4  // max 4 concurrent inner subscriptions
        )
        .subscribe { println("Concurrent: $it") }

    Thread.sleep(2000)
}`, comment: "flatMap() eagerly subscribes to inner publishers, results may interleave" },

  // flatMapSequential
  { type: "heading", level: 3, id: "flat-map-sequential", text: "flatMapSequential" },
  { type: "paragraph", text: "Like flatMap(), subscribes to inner publishers eagerly, but queues values from late inners to maintain source order. Best of both worlds: eager subscription + ordered output." },
  { type: "image", src: `${IMG}/flatMapSequential.svg`, alt: "Flux.flatMapSequential marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun main() {
    // flatMapSequential: eager subscription, ordered output
    Flux.just("slow", "fast", "medium")
        .flatMapSequential { item ->
            val delay = when (item) {
                "slow" -> 300L
                "fast" -> 50L
                else -> 150L
            }
            Mono.just(item.uppercase())
                .delayElement(Duration.ofMillis(delay))
        }
        .subscribe { println("Ordered: $it") }
    // Output is always: SLOW, FAST, MEDIUM (source order preserved)

    Thread.sleep(1000)
}`, comment: "flatMapSequential preserves source order while subscribing eagerly" },

  // concatMap
  { type: "heading", level: 3, id: "concat-map", text: "concatMap" },
  { type: "paragraph", text: "Transform elements into Publishers sequentially — waits for each inner to complete before subscribing to the next. Guarantees order and no interleaving, but is the slowest option since it processes one at a time." },
  { type: "image", src: `${IMG}/concatMap.svg`, alt: "Flux.concatMap marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun enrichWithDetails(item: String): Mono<String> =
    Mono.just("$item [enriched]")
        .delayElement(Duration.ofMillis(100))

fun main() {
    // concatMap: sequential, one at a time
    Flux.just("A", "B", "C")
        .concatMap { item -> enrichWithDetails(item) }
        .subscribe { println(it) }
    // Always outputs: A [enriched], B [enriched], C [enriched]

    // concatMap with prefetch
    Flux.range(1, 5)
        .concatMap({ i ->
            Flux.just(i, i * 10)
                .delayElements(Duration.ofMillis(50))
        }, 2)  // prefetch 2 from source
        .subscribe { println("Concat: $it") }

    Thread.sleep(2000)
}`, comment: "concatMap() processes inner publishers one at a time, preserving order" },

  // flatMapIterable
  { type: "heading", level: 3, id: "flat-map-iterable", text: "flatMapIterable" },
  { type: "paragraph", text: "Transform each element into an Iterable, then flatten all elements from those iterables into a single Flux. Synchronous and sequential — there is no notion of eager vs lazy subscription." },
  { type: "image", src: `${IMG}/flatMapIterable.svg`, alt: "Flux.flatMapIterable marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Flatten lists into individual elements
    Flux.just(listOf(1, 2, 3), listOf(4, 5), listOf(6))
        .flatMapIterable { it }
        .subscribe { println("Flattened: $it") }

    // Split strings into characters
    Flux.just("Hello", "World")
        .flatMapIterable { it.toList() }
        .subscribe { print("$it ") }
    println()

    // Expand with transformation
    Flux.just("spring,reactor", "kotlin,java")
        .flatMapIterable { it.split(",") }
        .map { it.uppercase() }
        .subscribe { println("Tag: $it") }
}`, comment: "flatMapIterable() flattens Iterables synchronously" },

  // switchMap
  { type: "heading", level: 3, id: "switch-map", text: "switchMap" },
  { type: "paragraph", text: "Switch to a new Publisher generated from each source element. When a new element arrives, the previous inner publisher is cancelled and a new one is subscribed. Ideal for 'latest wins' scenarios like search-as-you-type." },
  { type: "image", src: `${IMG}/switchMap.svg`, alt: "Flux.switchMap marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun searchApi(query: String): Mono<String> =
    Mono.just("Results for '$query'")
        .delayElement(Duration.ofMillis(200))

fun main() {
    // switchMap: latest emission wins, previous is cancelled
    Flux.just("k", "ko", "kot", "kotl", "kotlin")
        .delayElements(Duration.ofMillis(100))
        .switchMap { query -> searchApi(query) }
        .subscribe { println(it) }
    // Only "Results for 'kotlin'" is likely emitted (others cancelled)

    Thread.sleep(2000)
}`, comment: "switchMap() cancels the previous inner publisher when a new source element arrives" },

  // handle
  { type: "heading", level: 3, id: "handle", text: "handle" },
  { type: "paragraph", text: "A versatile operator that can be used to map, filter, and complete in one step. It receives each element with a SynchronousSink: call next() to emit, skip to filter, or complete()/error() to terminate." },
  { type: "image", src: `${IMG}/handle.svg`, alt: "Flux.handle marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // handle: combined map + filter + early completion
    Flux.range(1, 10)
        .handle<String> { value, sink ->
            when {
                value > 7 -> sink.complete()         // stop the stream
                value % 2 == 0 -> sink.next("Even: $value") // emit transformed
                // odd values < 7: skip (filter out)
            }
        }
        .subscribe { println(it) }
    // Output: Even: 2, Even: 4, Even: 6
}`, comment: "handle() combines map, filter, and early termination in one operator" },

  // cast / ofType
  { type: "heading", level: 3, id: "cast-oftype", text: "cast / ofType" },
  { type: "paragraph", text: "cast() casts each element to a given type (throws ClassCastException on mismatch). ofType() filters and casts, only emitting elements that match the given type." },
  { type: "code", code: `import reactor.core.publisher.Flux

open class Animal(val name: String)
class Dog(name: String, val breed: String) : Animal(name)
class Cat(name: String, val indoor: Boolean) : Animal(name)

fun main() {
    val animals: Flux<Animal> = Flux.just(
        Dog("Rex", "Shepherd"),
        Cat("Whiskers", true),
        Dog("Buddy", "Labrador"),
        Cat("Luna", false)
    )

    // ofType: filter and cast
    animals.ofType(Dog::class.java)
        .subscribe { println("Dog: \${it.name}, Breed: \${it.breed}") }

    animals.ofType(Cat::class.java)
        .subscribe { println("Cat: \${it.name}, Indoor: \${it.indoor}") }
}`, comment: "ofType() filters elements by type and casts them" },

  // scan
  { type: "heading", level: 3, id: "scan", text: "scan" },
  { type: "paragraph", text: "Reduce values with an accumulator BiFunction and also emit the intermediate results. Unlike reduce(), scan() emits each intermediate value as it computes, making it useful for running totals and state tracking." },
  { type: "image", src: `${IMG}/scan.svg`, alt: "Flux.scan marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Running sum
    Flux.just(1, 2, 3, 4, 5)
        .scan(0) { acc, next -> acc + next }
        .subscribe { println("Running sum: $it") }
    // Output: 0, 1, 3, 6, 10, 15

    // Running max
    Flux.just(3, 1, 4, 1, 5, 9, 2, 6)
        .scan { a, b -> maxOf(a, b) }
        .subscribe { println("Running max: $it") }
    // Output: 3, 3, 4, 4, 5, 9, 9, 9

    // Building a string progressively
    Flux.just("H", "e", "l", "l", "o")
        .scan("") { acc, c -> acc + c }
        .skip(1)  // skip initial empty seed
        .subscribe { println("Building: $it") }
}`, comment: "scan() emits intermediate accumulation results" },

  // expand / expandDeep
  { type: "heading", level: 3, id: "expand", text: "expand / expandDeep" },
  { type: "paragraph", text: "Recursively expand elements into a graph. expand() uses breadth-first traversal, while expandDeep() uses depth-first. Useful for tree structures and pagination." },
  { type: "image", src: `${IMG}/expand.svg`, alt: "Flux.expand marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

data class TreeNode(val name: String, val children: List<TreeNode> = emptyList())

fun main() {
    val tree = TreeNode("root", listOf(
        TreeNode("A", listOf(TreeNode("A1"), TreeNode("A2"))),
        TreeNode("B", listOf(TreeNode("B1")))
    ))

    // expand: breadth-first
    println("Breadth-first:")
    Flux.just(tree)
        .expand { Flux.fromIterable(it.children) }
        .map { it.name }
        .subscribe { println("  $it") }
    // root, A, B, A1, A2, B1

    // expandDeep: depth-first
    println("Depth-first:")
    Flux.just(tree)
        .expandDeep { Flux.fromIterable(it.children) }
        .map { it.name }
        .subscribe { println("  $it") }
    // root, A, A1, A2, B, B1
}`, comment: "expand() for breadth-first, expandDeep() for depth-first tree traversal" },

  // index
  { type: "heading", level: 3, id: "index", text: "index" },
  { type: "paragraph", text: "Keep information about the order of source values by indexing them with a 0-based incrementing long, returning Tuple2<Long, T>." },
  { type: "image", src: `${IMG}/index.svg`, alt: "Flux.index marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("alpha", "beta", "gamma", "delta")
        .index()
        .subscribe { (index, value) ->
            println("#$index: $value")
        }
    // #0: alpha, #1: beta, #2: gamma, #3: delta

    // Custom index mapper (1-based)
    Flux.just("first", "second", "third")
        .index { i, v -> "\${i + 1}. $v" }
        .subscribe { println(it) }
}`, comment: "index() pairs each element with its 0-based position" },

  // ━━━━━━━━━ FILTERING ━━━━━━━━━
  { type: "heading", level: 2, id: "filtering", text: "Filtering" },
  { type: "paragraph", text: "Filtering operators selectively emit elements from a source Flux based on various criteria: predicates, position, timing, or uniqueness." },

  // filter / filterWhen
  { type: "heading", level: 3, id: "filter", text: "filter / filterWhen" },
  { type: "paragraph", text: "filter() evaluates each element against a synchronous predicate. filterWhen() uses an asynchronous predicate returning Publisher<Boolean>." },
  { type: "image", src: `${IMG}/filter.svg`, alt: "Flux.filter marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun isAvailableInInventory(item: String): Mono<Boolean> =
    Mono.just(item.length > 3)  // simulate async check

fun main() {
    // Synchronous filter
    Flux.range(1, 20)
        .filter { it % 3 == 0 }
        .subscribe { println("Divisible by 3: $it") }

    // Async filter with filterWhen
    Flux.just("TV", "Laptop", "USB", "Monitor", "SSD")
        .filterWhen { item -> isAvailableInInventory(item) }
        .subscribe { println("Available: $it") }
}`, comment: "filter() for sync predicates, filterWhen() for async predicates" },

  // distinct / distinctUntilChanged
  { type: "heading", level: 3, id: "distinct", text: "distinct / distinctUntilChanged" },
  { type: "paragraph", text: "distinct() tracks all elements seen so far and filters out duplicates globally. distinctUntilChanged() only filters out consecutive duplicates." },
  { type: "image", src: `${IMG}/distinct.svg`, alt: "Flux.distinct marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // distinct: removes all duplicates
    Flux.just(1, 2, 3, 2, 1, 4, 3, 5)
        .distinct()
        .subscribe { print("$it ") }
    println()  // 1 2 3 4 5

    // distinct by key
    Flux.just("Alice", "Bob", "ALICE", "Charlie", "BOB")
        .distinct { it.lowercase() }
        .subscribe { print("$it ") }
    println()  // Alice Bob Charlie

    // distinctUntilChanged: only consecutive duplicates
    Flux.just(1, 1, 2, 2, 3, 2, 2, 1)
        .distinctUntilChanged()
        .subscribe { print("$it ") }
    println()  // 1 2 3 2 1
}`, comment: "distinct() removes all duplicates; distinctUntilChanged() removes consecutive ones" },

  // take
  { type: "heading", level: 3, id: "take", text: "take / takeLast / takeUntil / takeWhile" },
  { type: "paragraph", text: "Limit the number of elements emitted. take(n) emits only the first N elements. takeLast(n) emits only the last N. takeUntil() emits until a predicate matches (inclusive). takeWhile() emits while a predicate is true (exclusive)." },
  { type: "image", src: `${IMG}/take.svg`, alt: "Flux.take marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    val source = Flux.range(1, 10)

    // take: first N
    source.take(3).subscribe { print("$it ") }
    println()  // 1 2 3

    // takeLast: last N
    source.takeLast(3).subscribe { print("$it ") }
    println()  // 8 9 10

    // takeWhile: while predicate is true (exclusive)
    source.takeWhile { it < 5 }.subscribe { print("$it ") }
    println()  // 1 2 3 4

    // takeUntil: until predicate matches (inclusive)
    source.takeUntil { it == 5 }.subscribe { print("$it ") }
    println()  // 1 2 3 4 5
}`, comment: "Various take operators to limit emitted elements" },

  // skip
  { type: "heading", level: 3, id: "skip", text: "skip / skipLast / skipUntil / skipWhile" },
  { type: "paragraph", text: "Skip operators are the counterpart of take: they discard elements from the beginning, end, or based on predicates." },
  { type: "image", src: `${IMG}/skip.svg`, alt: "Flux.skip marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    val source = Flux.range(1, 10)

    // skip: drop first N
    source.skip(7).subscribe { print("$it ") }
    println()  // 8 9 10

    // skipLast: drop last N
    source.skipLast(7).subscribe { print("$it ") }
    println()  // 1 2 3

    // skipWhile: skip while predicate is true
    source.skipWhile { it < 5 }.subscribe { print("$it ") }
    println()  // 5 6 7 8 9 10

    // skipUntil: skip until predicate matches
    source.skipUntil { it == 8 }.subscribe { print("$it ") }
    println()  // 8 9 10
}`, comment: "Skip operators discard elements from various positions" },

  // elementAt
  { type: "heading", level: 3, id: "element-at", text: "elementAt" },
  { type: "paragraph", text: "Emit only the element at the given index position (0-based). Throws IndexOutOfBoundsException if the sequence is shorter. A variant with a default value is available." },
  { type: "image", src: `${IMG}/elementAt.svg`, alt: "Flux.elementAt marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("A", "B", "C", "D")
        .elementAt(2)
        .subscribe { println("Element at 2: $it") }  // C

    // With default value for out-of-bounds
    Flux.just("A", "B")
        .elementAt(5, "DEFAULT")
        .subscribe { println("Element at 5: $it") }  // DEFAULT
}`, comment: "elementAt() emits a single element at a specific index" },

  // single
  { type: "heading", level: 3, id: "single", text: "single / singleOrEmpty" },
  { type: "paragraph", text: "Expect exactly one element from the source. single() errors on empty or more-than-one sources. singleOrEmpty() accepts empty sources." },
  { type: "image", src: `${IMG}/single.svg`, alt: "Flux.single marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // single: exactly one element expected
    Flux.just("only-one")
        .single()
        .subscribe(
            { println("Single: $it") },
            { println("Error: \${it.message}") }
        )

    // singleOrEmpty: zero or one element
    Flux.empty<String>()
        .singleOrEmpty()
        .subscribe(
            { println("Got: $it") },
            { println("Error: \${it.message}") },
            { println("Empty is OK!") }
        )

    // Errors on more than one element
    Flux.just(1, 2, 3)
        .single()
        .subscribe(
            { println("Value: $it") },
            { println("Error: \${it.message}") }
        )  // Error: Source emitted more than one item
}`, comment: "single() enforces exactly one element in the source" },

  // next / last
  { type: "heading", level: 3, id: "next-last", text: "next / last" },
  { type: "paragraph", text: "next() returns a Mono of the first element. last() returns a Mono of the last element observed before completion." },
  { type: "image", src: `${IMG}/next.svg`, alt: "Flux.next marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // next: first element as Mono
    Flux.just("first", "second", "third")
        .next()
        .subscribe { println("Next: $it") }  // first

    // last: last element as Mono
    Flux.just("first", "second", "third")
        .last()
        .subscribe { println("Last: $it") }  // third

    // last with default
    Flux.empty<String>()
        .last("default")
        .subscribe { println("Last or default: $it") }  // default
}`, comment: "next() gets the first element, last() gets the final element" },

  // sample
  { type: "heading", level: 3, id: "sample", text: "sample / sampleFirst / sampleTimeout" },
  { type: "paragraph", text: "Sampling operators emit elements at intervals. sample() emits the latest value during each period. sampleFirst() takes the first value then skips for a duration. sampleTimeout() emits if no new value arrives within a timeout window." },
  { type: "image", src: `${IMG}/sample.svg`, alt: "Flux.sample marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // sample: emit the latest value every 300ms
    Flux.interval(Duration.ofMillis(100))
        .sample(Duration.ofMillis(300))
        .take(5)
        .subscribe { println("Sampled: $it") }

    // sampleFirst: take first, then skip for 500ms
    Flux.interval(Duration.ofMillis(100))
        .sampleFirst(Duration.ofMillis(500))
        .take(3)
        .subscribe { println("SampleFirst: $it") }

    Thread.sleep(3000)
}`, comment: "Sampling operators throttle emissions based on time windows" },

  // ━━━━━━━━━ COMBINING ━━━━━━━━━
  { type: "heading", level: 2, id: "combining", text: "Combining" },
  { type: "paragraph", text: "Combining operators merge, concatenate, or zip multiple Publishers together into a single output Flux." },

  // concat
  { type: "heading", level: 3, id: "concat", text: "concat / concatWith" },
  { type: "paragraph", text: "Concatenate sources sequentially: subscribe to the first, wait for it to complete, then subscribe to the next. Order is guaranteed. Errors interrupt immediately." },
  { type: "image", src: `${IMG}/concatVarSources.svg`, alt: "Flux.concat marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Static concat
    val first = Flux.just(1, 2, 3)
    val second = Flux.just(4, 5, 6)
    val third = Flux.just(7, 8, 9)

    Flux.concat(first, second, third)
        .subscribe { print("$it ") }
    println()  // 1 2 3 4 5 6 7 8 9

    // Instance method
    Flux.just("A", "B")
        .concatWith(Flux.just("C", "D"))
        .subscribe { print("$it ") }
    println()  // A B C D

    // concatWithValues: append literal values
    Flux.just(1, 2, 3)
        .concatWithValues(4, 5)
        .subscribe { print("$it ") }
    println()  // 1 2 3 4 5
}`, comment: "concat subscribes to sources sequentially, preserving order" },

  // merge
  { type: "heading", level: 3, id: "merge", text: "merge / mergeWith" },
  { type: "paragraph", text: "Merge data from multiple Publishers into an interleaved sequence. Unlike concat, sources are subscribed to eagerly. Values are emitted as they arrive from any source." },
  { type: "image", src: `${IMG}/mergeFixedSources.svg`, alt: "Flux.merge marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    val fast = Flux.interval(Duration.ofMillis(100))
        .map { "fast-$it" }
        .take(5)

    val slow = Flux.interval(Duration.ofMillis(250))
        .map { "slow-$it" }
        .take(3)

    // merge: interleaved output
    Flux.merge(fast, slow)
        .subscribe { println(it) }

    // mergeWith: instance method
    Flux.just("A", "B")
        .mergeWith(Flux.just("1", "2"))
        .subscribe { print("$it ") }

    Thread.sleep(2000)
}`, comment: "merge() subscribes eagerly and interleaves values as they arrive" },

  // mergeSequential
  { type: "heading", level: 3, id: "merge-sequential", text: "mergeSequential" },
  { type: "paragraph", text: "Subscribes to sources eagerly (like merge), but emits values in subscription order (like concat). Gets the concurrency benefits of merge with the ordering of concat." },
  { type: "image", src: `${IMG}/mergeSequential.svg`, alt: "Flux.mergeSequential marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun main() {
    // mergeSequential: eager subscribe, ordered output
    val sources = listOf(
        Mono.just("first").delayElement(Duration.ofMillis(300)),
        Mono.just("second").delayElement(Duration.ofMillis(100)),
        Mono.just("third").delayElement(Duration.ofMillis(200))
    )

    Flux.mergeSequential(sources)
        .subscribe { println(it) }
    // Always outputs: first, second, third (source order)

    Thread.sleep(1000)
}`, comment: "mergeSequential() combines eager subscription with ordered output" },

  // mergeComparing / mergePriority
  { type: "heading", level: 3, id: "merge-comparing", text: "mergeComparing / mergePriority" },
  { type: "paragraph", text: "Merge sorted sources into a single sorted output. mergeComparing() waits for one value from each source before picking the smallest. mergePriority() picks as values arrive without waiting." },
  { type: "image", src: `${IMG}/mergeComparing.svg`, alt: "Flux.mergeComparing marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    val sorted1 = Flux.just(1, 4, 7, 10)
    val sorted2 = Flux.just(2, 5, 8, 11)
    val sorted3 = Flux.just(3, 6, 9, 12)

    // mergeComparing: merge pre-sorted sources
    Flux.mergeComparing(sorted1, sorted2, sorted3)
        .subscribe { print("$it ") }
    println()  // 1 2 3 4 5 6 7 8 9 10 11 12
}`, comment: "mergeComparing() merges pre-sorted sources into a sorted output" },

  // zip
  { type: "heading", level: 3, id: "zip", text: "zip / zipWith" },
  { type: "paragraph", text: "Wait for all sources to emit one element, then combine these elements into a Tuple or using a combinator function. The sequence completes when any source completes." },
  { type: "image", src: `${IMG}/zipFixedSourcesForFlux.svg`, alt: "Flux.zip marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    val names = Flux.just("Alice", "Bob", "Charlie")
    val ages = Flux.just(30, 25, 35)
    val cities = Flux.just("NYC", "London", "Tokyo")

    // zip into tuples
    Flux.zip(names, ages)
        .subscribe { (name, age) ->
            println("$name is $age years old")
        }

    // zip with combinator function
    Flux.zip(names, ages, cities)
        .map { tuple -> "\${tuple.t1} (\${tuple.t2}) from \${tuple.t3}" }
        .subscribe { println(it) }

    // zipWith: instance method with BiFunction
    names.zipWith(ages) { name, age -> "$name: $age" }
        .subscribe { println(it) }
}`, comment: "zip() pairs elements from multiple sources by index" },

  // combineLatest
  { type: "heading", level: 3, id: "combine-latest", text: "combineLatest" },
  { type: "paragraph", text: "Combine the most recently emitted value from each source whenever any source emits. Unlike zip, doesn't wait for all sources to emit — uses the latest available value from each." },
  { type: "image", src: `${IMG}/combineLatest.svg`, alt: "Flux.combineLatest marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    val source1 = Flux.interval(Duration.ofMillis(300))
        .map { "A$it" }
        .take(4)

    val source2 = Flux.interval(Duration.ofMillis(500))
        .map { "B$it" }
        .take(3)

    Flux.combineLatest(source1, source2) { a, b -> "$a + $b" }
        .subscribe { println("Combined: $it") }

    Thread.sleep(3000)
}`, comment: "combineLatest() re-emits whenever any source produces a new value" },

  // firstWithSignal / firstWithValue
  { type: "heading", level: 3, id: "first-with", text: "firstWithSignal / firstWithValue" },
  { type: "paragraph", text: "Pick the first Publisher to emit any signal (firstWithSignal) or the first to emit an actual value (firstWithValue) and replay all its signals. Effectively selects the fastest source." },
  { type: "image", src: `${IMG}/firstWithSignal.svg`, alt: "Flux.firstWithSignal marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Duration

fun main() {
    val slow = Flux.just("slow-1", "slow-2")
        .delayElements(Duration.ofMillis(500))
    val fast = Flux.just("fast-1", "fast-2")
        .delayElements(Duration.ofMillis(100))

    // firstWithSignal: first to emit any signal wins
    Flux.firstWithSignal(slow, fast)
        .subscribe { println("Winner: $it") }
    // Output: fast-1, fast-2

    Thread.sleep(2000)
}`, comment: "firstWithSignal() races publishers and replays the fastest one" },

  // startWith
  { type: "heading", level: 3, id: "start-with", text: "startWith" },
  { type: "paragraph", text: "Prepend values or a Publisher before the current Flux sequence. Useful for providing initial state or default values." },
  { type: "image", src: `${IMG}/startWith.svg`, alt: "Flux.startWith marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(4, 5, 6)
        .startWith(1, 2, 3)
        .subscribe { print("$it ") }
    println()  // 1 2 3 4 5 6

    // startWith a Publisher
    val cached = Flux.just("cached-1", "cached-2")
    val live = Flux.just("live-3", "live-4")

    live.startWith(cached)
        .subscribe { println(it) }
}`, comment: "startWith() prepends values or another Publisher to the sequence" },

  // switchIfEmpty
  { type: "heading", level: 3, id: "switch-if-empty", text: "switchIfEmpty" },
  { type: "paragraph", text: "Switch to a fallback Publisher if the source completes without emitting any element." },
  { type: "image", src: `${IMG}/switchIfEmpty.svg`, alt: "Flux.switchIfEmpty marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Non-empty source: fallback not used
    Flux.just(1, 2, 3)
        .switchIfEmpty(Flux.just(10, 20, 30))
        .subscribe { print("$it ") }
    println()  // 1 2 3

    // Empty source: fallback kicks in
    Flux.empty<Int>()
        .switchIfEmpty(Flux.just(10, 20, 30))
        .subscribe { print("$it ") }
    println()  // 10 20 30
}`, comment: "switchIfEmpty() provides a fallback for empty sequences" },

  // withLatestFrom
  { type: "heading", level: 3, id: "with-latest-from", text: "withLatestFrom" },
  { type: "paragraph", text: "Combine each value from the source with the most recently emitted value from another Publisher. The other Publisher's values are not consumed in pairs — only the latest is used." },
  { type: "image", src: `${IMG}/withLatestFrom.svg`, alt: "Flux.withLatestFrom marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    val ticks = Flux.interval(Duration.ofMillis(300)).take(5)
    val config = Flux.just("mode-A", "mode-B")
        .delayElements(Duration.ofMillis(500))
        .concatWith(Flux.never())  // keep latest alive

    ticks.withLatestFrom(config) { tick, mode -> "Tick $tick in $mode" }
        .subscribe { println(it) }

    Thread.sleep(3000)
}`, comment: "withLatestFrom() pairs each source value with the latest from another publisher" },

  // ━━━━━━━━━ ERROR HANDLING ━━━━━━━━━
  { type: "heading", level: 2, id: "error-handling", text: "Error Handling" },
  { type: "paragraph", text: "Reactor provides comprehensive error handling operators that let you recover from errors, transform them, or define fallback behavior." },

  // onErrorResume
  { type: "heading", level: 3, id: "on-error-resume", text: "onErrorResume" },
  { type: "paragraph", text: "Subscribe to a fallback Publisher when an error occurs. The fallback can be chosen based on the error type. The original error is swallowed and replaced by the fallback sequence." },
  { type: "image", src: `${IMG}/onErrorResumeForFlux.svg`, alt: "Flux.onErrorResume marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Resume with fallback values
    Flux.just(1, 2, 0, 4)
        .map { 10 / it }
        .onErrorResume { error ->
            println("Caught: \${error.message}")
            Flux.just(-1)  // fallback value
        }
        .subscribe { println("Result: $it") }

    // Resume based on error type
    Flux.just("valid", "BOOM", "also-valid")
        .map {
            if (it == "BOOM") throw IllegalArgumentException("Bad input!")
            it
        }
        .onErrorResume(IllegalArgumentException::class.java) {
            Flux.just("recovered-from-bad-input")
        }
        .subscribe { println(it) }
}`, comment: "onErrorResume() switches to a fallback publisher on error" },

  // onErrorReturn
  { type: "heading", level: 3, id: "on-error-return", text: "onErrorReturn" },
  { type: "paragraph", text: "Emit a single fallback value when any error occurs, then complete. Simpler than onErrorResume when you just need a default value." },
  { type: "image", src: `${IMG}/onErrorReturnForFlux.svg`, alt: "Flux.onErrorReturn marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 0, 4)
        .map { 10 / it }
        .onErrorReturn(-1)
        .subscribe { println("Result: $it") }
    // Output: 10, 5, -1 (sequence completes after fallback)

    // Conditional: only for specific error types
    Flux.just("ok", "fail")
        .map {
            if (it == "fail") throw RuntimeException("boom")
            it
        }
        .onErrorReturn(RuntimeException::class.java, "fallback")
        .subscribe { println(it) }
}`, comment: "onErrorReturn() emits a single fallback value and completes" },

  // onErrorMap
  { type: "heading", level: 3, id: "on-error-map", text: "onErrorMap" },
  { type: "paragraph", text: "Transform an error into a different error. The sequence still terminates with an error, but the error type/message can be changed for better downstream handling." },
  { type: "image", src: `${IMG}/onErrorMapForFlux.svg`, alt: "Flux.onErrorMap marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

class BusinessException(message: String, cause: Throwable) : RuntimeException(message, cause)

fun main() {
    Flux.just("data1", "INVALID", "data3")
        .map {
            if (it == "INVALID") throw IllegalArgumentException("Bad data")
            it
        }
        .onErrorMap { error ->
            BusinessException("Processing failed: \${error.message}", error)
        }
        .subscribe(
            { println("Value: $it") },
            { println("Business error: \${it.message}") }
        )
}`, comment: "onErrorMap() transforms the error type while keeping the error signal" },

  // onErrorContinue
  { type: "heading", level: 3, id: "on-error-continue", text: "onErrorContinue" },
  { type: "paragraph", text: "Let compatible operators upstream recover from errors by dropping the incriminating element and continuing with subsequent elements. Use with caution — it operates on upstream operators and can be unclear." },
  { type: "image", src: `${IMG}/onErrorContinue.svg`, alt: "Flux.onErrorContinue marble diagram" },
  { type: "infoBox", variant: "gray", content: "Warning: onErrorContinue() is a specialist operator. In most cases, prefer handling errors inside flatMap/concatMap with doOnError + onErrorResume(Mono.empty()) for clarity." },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // onErrorContinue: drop failing element, continue with rest
    Flux.just(1, 2, 0, 4, 5)
        .map { 10 / it }
        .onErrorContinue { error, value ->
            println("Skipping $value due to: \${error.message}")
        }
        .subscribe { println("Result: $it") }
    // Output: 10, 5, Skipping 0..., 2, 2

    // Preferred pattern: handle errors inside flatMap
    Flux.just(1, 2, 0, 4, 5)
        .flatMap { value ->
            Flux.just(value)
                .map { 10 / it }
                .doOnError { println("Error for $value: \${it.message}") }
                .onErrorResume { Flux.empty() }  // skip on error
        }
        .subscribe { println("Safe result: $it") }
}`, comment: "onErrorContinue() drops failing elements; prefer flatMap+onErrorResume for clarity" },

  // onErrorComplete
  { type: "heading", level: 3, id: "on-error-complete", text: "onErrorComplete" },
  { type: "paragraph", text: "Replace an error signal with a completion signal. The sequence completes normally instead of propagating the error." },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 3)
        .concatWith(Flux.error(RuntimeException("oops")))
        .concatWith(Flux.just(4, 5))  // never reached without error handling
        .onErrorComplete()
        .subscribe(
            { println("Value: $it") },
            { println("Error: $it") },
            { println("Completed!") }
        )
    // Output: 1, 2, 3, Completed!
}`, comment: "onErrorComplete() swallows the error and completes normally" },

  // retry / retryWhen
  { type: "heading", level: 3, id: "retry", text: "retry / retryWhen" },
  { type: "paragraph", text: "Re-subscribe to the source on error. retry(n) retries up to N times. retryWhen() provides fine-grained control with backoff strategies via the Retry utility class." },
  { type: "image", src: `${IMG}/retry.svg`, alt: "Flux.retry marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.util.retry.Retry
import java.time.Duration

var attempt = 0

fun unstableService(): Flux<String> = Flux.defer {
    attempt++
    if (attempt < 3) {
        Flux.error(RuntimeException("Service unavailable (attempt $attempt)"))
    } else {
        Flux.just("Success on attempt $attempt")
    }
}

fun main() {
    // Simple retry: up to 5 times
    attempt = 0
    unstableService()
        .retry(5)
        .subscribe(
            { println(it) },
            { println("Failed after retries: \${it.message}") }
        )

    // retryWhen with exponential backoff
    attempt = 0
    unstableService()
        .retryWhen(
            Retry.backoff(5, Duration.ofMillis(100))
                .maxBackoff(Duration.ofSeconds(2))
                .filter { it is RuntimeException }
        )
        .subscribe(
            { println(it) },
            { println("Failed: \${it.message}") }
        )

    Thread.sleep(3000)
}`, comment: "retry() re-subscribes on error; retryWhen() enables exponential backoff" },

  // ━━━━━━━━━ PEEKING / SIDE EFFECTS ━━━━━━━━━
  { type: "heading", level: 2, id: "peeking", text: "Peeking / Side Effects" },
  { type: "paragraph", text: "Side-effect operators let you observe signals without modifying the sequence. They are essential for logging, monitoring, and debugging reactive pipelines." },

  // doOnNext
  { type: "heading", level: 3, id: "do-on-next", text: "doOnNext" },
  { type: "paragraph", text: "Add a side-effect triggered when the Flux emits each item. The Consumer is executed first, then the signal is propagated downstream." },
  { type: "image", src: `${IMG}/doOnNext.svg`, alt: "Flux.doOnNext marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just("order-1", "order-2", "order-3")
        .doOnNext { println("Processing: $it") }
        .map { it.uppercase() }
        .doOnNext { println("Transformed: $it") }
        .subscribe { println("Final: $it") }
}`, comment: "doOnNext() observes each emitted element for side effects like logging" },

  // doOnError
  { type: "heading", level: 3, id: "do-on-error", text: "doOnError" },
  { type: "paragraph", text: "Add a side-effect triggered when the Flux completes with an error. The error is still propagated downstream after the handler runs." },
  { type: "image", src: `${IMG}/doOnError.svg`, alt: "Flux.doOnError marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 0, 4)
        .map { 10 / it }
        .doOnError { println("Error detected: \${it.message}") }
        .onErrorReturn(-1)
        .subscribe { println("Result: $it") }

    // Filter by error type
    Flux.error<String>(IllegalStateException("bad state"))
        .doOnError(IllegalStateException::class.java) {
            println("IllegalState caught: \${it.message}")
        }
        .onErrorReturn("recovered")
        .subscribe { println(it) }
}`, comment: "doOnError() observes errors for logging before they propagate" },

  // doOnComplete / doOnTerminate
  { type: "heading", level: 3, id: "do-on-complete", text: "doOnComplete / doOnTerminate" },
  { type: "paragraph", text: "doOnComplete() triggers on successful completion. doOnTerminate() triggers on any termination (complete or error). doAfterTerminate() runs after the signal is propagated." },
  { type: "image", src: `${IMG}/doOnComplete.svg`, alt: "Flux.doOnComplete marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 3)
        .doOnComplete { println("Stream completed!") }
        .doOnTerminate { println("Terminated (success or error)") }
        .doAfterTerminate { println("After termination cleanup") }
        .subscribe { println("Value: $it") }
}`, comment: "Termination hooks for cleanup and logging" },

  // doOnSubscribe / doFirst
  { type: "heading", level: 3, id: "do-on-subscribe", text: "doOnSubscribe / doFirst" },
  { type: "paragraph", text: "doOnSubscribe() triggers when a Subscription is established. doFirst() triggers before the subscription even happens — the very first event after assembly. Multiple doFirst() calls execute in reverse order." },
  { type: "image", src: `${IMG}/doOnSubscribe.svg`, alt: "Flux.doOnSubscribe marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 3)
        .doFirst { println("3. doFirst (closest to subscribe)") }
        .doFirst { println("2. doFirst (middle)") }
        .doFirst { println("1. doFirst (furthest)") }
        .doOnSubscribe { println("4. Subscribed!") }
        .subscribe { println("Value: $it") }
    // Order: 1, 2, 3, 4, then values
}`, comment: "doFirst() runs before subscription; doOnSubscribe() runs when subscribed" },

  // doOnEach
  { type: "heading", level: 3, id: "do-on-each", text: "doOnEach" },
  { type: "paragraph", text: "Observe all signals (onNext, onError, onComplete) as Signal instances. Useful for unified monitoring of all events in a single callback." },
  { type: "image", src: `${IMG}/doOnEach.svg`, alt: "Flux.doOnEach marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.just(1, 2, 3)
        .doOnEach { signal ->
            when {
                signal.isOnNext -> println("Signal: onNext(\${signal.get()})")
                signal.isOnComplete -> println("Signal: onComplete")
                signal.isOnError -> println("Signal: onError(\${signal.throwable?.message})")
            }
        }
        .subscribe()
}`, comment: "doOnEach() provides a unified callback for all signal types" },

  // doFinally
  { type: "heading", level: 3, id: "do-finally", text: "doFinally" },
  { type: "paragraph", text: "Add a side-effect triggered after the Flux terminates for any reason, including cancellation. Receives a SignalType indicating how the sequence ended." },
  { type: "image", src: `${IMG}/doFinally.svg`, alt: "Flux.doFinally marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.SignalType

fun main() {
    Flux.just(1, 2, 3, 4, 5)
        .take(3)  // causes cancellation after 3 elements
        .doFinally { signalType: SignalType ->
            when (signalType) {
                SignalType.ON_COMPLETE -> println("Completed normally")
                SignalType.ON_ERROR -> println("Terminated with error")
                SignalType.CANCEL -> println("Was cancelled")
                else -> println("Other: $signalType")
            }
        }
        .subscribe { println("Value: $it") }
}`, comment: "doFinally() runs on any termination including cancellation" },

  // log
  { type: "heading", level: 3, id: "log", text: "log" },
  { type: "paragraph", text: "Observe all Reactive Streams signals and trace them using a logger. Invaluable for debugging reactive chains." },
  { type: "image", src: `${IMG}/log.svg`, alt: "Flux.log marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 3)
        .log("my.flux")  // logs with category "my.flux"
        .map { it * 2 }
        .log("after.map")
        .subscribe()
    // Logs: onSubscribe, request, onNext, onComplete for each stage
}`, comment: "log() traces all reactive signals through the logging framework" },

  // materialize / dematerialize
  { type: "heading", level: 3, id: "materialize", text: "materialize / dematerialize" },
  { type: "paragraph", text: "materialize() transforms onNext, onError, and onComplete signals into Signal objects, making them regular emissions. dematerialize() does the reverse." },
  { type: "image", src: `${IMG}/materialize.svg`, alt: "Flux.materialize marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // materialize: signals become data
    Flux.just(1, 2, 3)
        .materialize()
        .subscribe { signal ->
            println("Signal: $signal (type=\${signal.type})")
        }
    // Signal: doOnEach_onNext(1), Signal: doOnEach_onNext(2), ...
    // Signal: onComplete()

    // dematerialize: turn signals back into real signals
    Flux.just(1, 2, 3)
        .materialize()
        .dematerialize<Int>()
        .subscribe(
            { println("Value: $it") },
            { println("Error: $it") },
            { println("Complete") }
        )
}`, comment: "materialize() converts signals to data; dematerialize() reverses it" },

  // ━━━━━━━━━ BUFFERING & WINDOWING ━━━━━━━━━
  { type: "heading", level: 2, id: "buffering-windowing", text: "Buffering & Windowing" },
  { type: "paragraph", text: "Buffering collects elements into Lists. Windowing splits the sequence into sub-Fluxes. Both support size-based, time-based, and predicate-based boundaries." },

  // buffer
  { type: "heading", level: 3, id: "buffer", text: "buffer" },
  { type: "paragraph", text: "Collect incoming values into List buffers. Can be sized-based (buffer every N elements) or Publisher-based (buffer until a companion signals)." },
  { type: "image", src: `${IMG}/bufferWithMaxSize.svg`, alt: "Flux.buffer marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Buffer by size
    Flux.range(1, 10)
        .buffer(3)
        .subscribe { println("Batch: $it") }
    // [1,2,3], [4,5,6], [7,8,9], [10]

    // Buffer with skip (overlapping)
    Flux.range(1, 6)
        .buffer(3, 2)  // size=3, skip=2 -> overlapping
        .subscribe { println("Overlap: $it") }
    // [1,2,3], [3,4,5], [5,6]

    // Buffer with skip (dropping)
    Flux.range(1, 10)
        .buffer(2, 4)  // size=2, skip=4 -> dropping
        .subscribe { println("Drop: $it") }
    // [1,2], [5,6], [9,10]
}`, comment: "buffer() collects elements into Lists by size or boundary signal" },

  // bufferTimeout
  { type: "heading", level: 3, id: "buffer-timeout", text: "bufferTimeout" },
  { type: "paragraph", text: "Collect into buffers that emit when either the max size is reached OR the timeout duration elapses, whichever comes first. Perfect for micro-batching." },
  { type: "image", src: `${IMG}/bufferTimeout.svg`, alt: "Flux.bufferTimeout marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // bufferTimeout: max 5 items OR 1 second, whichever first
    Flux.interval(Duration.ofMillis(200))
        .bufferTimeout(5, Duration.ofSeconds(1))
        .take(3)
        .subscribe { println("Batch (\${it.size} items): $it") }

    Thread.sleep(4000)
}`, comment: "bufferTimeout() flushes on size or time, whichever comes first" },

  // bufferUntil / bufferWhile
  { type: "heading", level: 3, id: "buffer-until-while", text: "bufferUntil / bufferWhile" },
  { type: "paragraph", text: "bufferUntil() closes the buffer (inclusive) when the predicate returns true. bufferWhile() keeps the buffer open while the predicate is true, closing on false (the triggering element is NOT included)." },
  { type: "image", src: `${IMG}/bufferUntil.svg`, alt: "Flux.bufferUntil marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // bufferUntil: close buffer when predicate matches (inclusive)
    Flux.just(1, 2, 3, 1, 4, 5, 1, 6)
        .bufferUntil { it == 1 }
        .subscribe { println("Until: $it") }
    // [1], [2, 3, 1], [4, 5, 1], [6]

    // bufferWhile: keep buffer while predicate is true
    Flux.just(1, 2, 3, 0, 4, 5, 0, 6)
        .bufferWhile { it != 0 }
        .subscribe { println("While: $it") }
    // [1, 2, 3], [4, 5], [6]
}`, comment: "Predicate-based buffering: bufferUntil (inclusive) vs bufferWhile (exclusive)" },

  // bufferWhen
  { type: "heading", level: 3, id: "buffer-when", text: "bufferWhen" },
  { type: "paragraph", text: "Start buffers when an opening Publisher emits, and close each buffer when a corresponding closing Publisher (derived from the opening value) emits." },
  { type: "image", src: `${IMG}/bufferWhen.svg`, alt: "Flux.bufferWhen marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // bufferWhen: open every 1s, close after 400ms
    val source = Flux.interval(Duration.ofMillis(100)).take(20)

    source.bufferWhen(
        Flux.interval(Duration.ofSeconds(1)),        // opening
        { Flux.interval(Duration.ofMillis(400)).next() }  // closing
    )
    .take(3)
    .subscribe { println("BufferWhen: $it") }

    Thread.sleep(5000)
}`, comment: "bufferWhen() uses opening/closing publishers for dynamic buffer boundaries" },

  // window
  { type: "heading", level: 3, id: "window", text: "window" },
  { type: "paragraph", text: "Split the Flux into sub-Flux windows (unlike buffer which collects into Lists). Windows are live views of the source — they are unicast and cannot be re-subscribed." },
  { type: "image", src: `${IMG}/windowWithMaxSize.svg`, alt: "Flux.window marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    Flux.range(1, 10)
        .window(3)
        .flatMap { window ->
            window.collectList().map { "Window: $it" }
        }
        .subscribe { println(it) }
    // Window: [1, 2, 3], Window: [4, 5, 6], Window: [7, 8, 9], Window: [10]

    // Process each window differently
    Flux.range(1, 9)
        .window(3)
        .index()
        .flatMap { (idx, window) ->
            window.map { "Group $idx: $it" }
        }
        .subscribe { println(it) }
}`, comment: "window() splits into sub-Flux streams instead of Lists" },

  // windowTimeout
  { type: "heading", level: 3, id: "window-timeout", text: "windowTimeout" },
  { type: "paragraph", text: "Split into windows based on element count OR time duration, whichever boundary is hit first." },
  { type: "image", src: `${IMG}/windowTimeout.svg`, alt: "Flux.windowTimeout marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    Flux.interval(Duration.ofMillis(200))
        .windowTimeout(5, Duration.ofSeconds(1))
        .take(3)
        .flatMap { window ->
            window.collectList()
        }
        .subscribe { println("Window: $it") }

    Thread.sleep(4000)
}`, comment: "windowTimeout() closes windows on size or time" },

  // groupBy
  { type: "heading", level: 3, id: "group-by", text: "groupBy" },
  { type: "paragraph", text: "Divide the sequence into dynamically created GroupedFlux for each unique key. Each group is a separate Flux that must be consumed. Works best with a low cardinality of groups." },
  { type: "image", src: `${IMG}/groupByKeyed.svg`, alt: "Flux.groupBy marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

data class Event(val type: String, val data: String)

fun main() {
    val events = Flux.just(
        Event("INFO", "App started"),
        Event("ERROR", "Connection failed"),
        Event("INFO", "Processing..."),
        Event("WARN", "Low memory"),
        Event("ERROR", "Timeout"),
        Event("INFO", "Done")
    )

    events.groupBy { it.type }
        .flatMap { group ->
            group.collectList().map { "\${group.key()}: \${it.map { e -> e.data }}" }
        }
        .subscribe { println(it) }
    // INFO: [App started, Processing..., Done]
    // ERROR: [Connection failed, Timeout]
    // WARN: [Low memory]
}`, comment: "groupBy() partitions the stream into keyed sub-streams" },

  // ━━━━━━━━━ REDUCING / AGGREGATING ━━━━━━━━━
  { type: "heading", level: 2, id: "reducing", text: "Reducing / Aggregating" },
  { type: "paragraph", text: "Reducing operators aggregate all elements into a single value or collection, emitting the result as a Mono when the source completes." },

  // reduce
  { type: "heading", level: 3, id: "reduce", text: "reduce" },
  { type: "paragraph", text: "Reduce all values into a single result using an accumulator function. The result is emitted as a Mono upon source completion." },
  { type: "image", src: `${IMG}/reduce.svg`, alt: "Flux.reduce marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Sum
    Flux.range(1, 5)
        .reduce { a, b -> a + b }
        .subscribe { println("Sum: $it") }  // 15

    // With seed value
    Flux.just("a", "b", "c")
        .reduce("Start") { acc, next -> "$acc -> $next" }
        .subscribe { println("Chain: $it") }
    // Start -> a -> b -> c

    // Find max
    Flux.just(3, 7, 2, 9, 4)
        .reduce { a, b -> maxOf(a, b) }
        .subscribe { println("Max: $it") }  // 9
}`, comment: "reduce() aggregates all elements into a single Mono result" },

  // collectList / collectMap
  { type: "heading", level: 3, id: "collect-list", text: "collectList / collectMap" },
  { type: "paragraph", text: "collectList() gathers all elements into a List. collectMap() gathers into a Map using key/value extractors." },
  { type: "image", src: `${IMG}/collectList.svg`, alt: "Flux.collectList marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

data class Product(val id: String, val name: String, val price: Double)

fun main() {
    val products = Flux.just(
        Product("1", "Laptop", 999.99),
        Product("2", "Mouse", 29.99),
        Product("3", "Keyboard", 79.99)
    )

    // collectList: Mono<List<Product>>
    products.collectList()
        .subscribe { println("All: $it") }

    // collectMap: Mono<Map<String, Product>>
    products.collectMap { it.id }
        .subscribe { map ->
            println("By ID: \${map.keys}")
        }

    // collectMap with value extractor
    products.collectMap({ it.id }, { it.name })
        .subscribe { println("Names: $it") }

    // collectMultimap for grouping
    Flux.just("apple", "avocado", "banana", "blueberry", "cherry")
        .collectMultimap { it.first().toString() }
        .subscribe { println("By letter: $it") }
}`, comment: "Collect elements into Lists, Maps, or Multimaps" },

  // collectSortedList
  { type: "heading", level: 3, id: "collect-sorted-list", text: "collectSortedList" },
  { type: "paragraph", text: "Collect all elements, sort them, and emit the sorted List as a Mono." },
  { type: "image", src: `${IMG}/collectSortedList.svg`, alt: "Flux.collectSortedList marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Natural order
    Flux.just(5, 3, 8, 1, 9, 2)
        .collectSortedList()
        .subscribe { println("Sorted: $it") }  // [1, 2, 3, 5, 8, 9]

    // Custom comparator (descending)
    Flux.just("banana", "apple", "cherry")
        .collectSortedList(Comparator.reverseOrder())
        .subscribe { println("Desc: $it") }  // [cherry, banana, apple]
}`, comment: "collectSortedList() gathers and sorts all elements" },

  // count
  { type: "heading", level: 3, id: "count", text: "count" },
  { type: "paragraph", text: "Count the number of elements in the Flux, emitting the count as a Mono<Long> on completion." },
  { type: "image", src: `${IMG}/count.svg`, alt: "Flux.count marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

data class LogEntry(val level: String, val message: String)

fun main() {
    val logs = Flux.just(
        LogEntry("INFO", "App started"),
        LogEntry("ERROR", "Connection refused"),
        LogEntry("WARN", "Slow query: 2.3s"),
        LogEntry("ERROR", "Timeout on /api/users"),
        LogEntry("INFO", "Request completed"),
        LogEntry("ERROR", "NullPointerException in OrderService"),
        LogEntry("WARN", "Memory usage > 80%")
    )

    // Count errors for alerting
    logs.filter { it.level == "ERROR" }
        .count()
        .subscribe { errorCount ->
            println("Errors: $errorCount")
            if (errorCount > 2) println("ALERT: Error threshold exceeded!")
        }

    // Count by level using groupBy + count
    logs.groupBy { it.level }
        .flatMap { group ->
            group.count().map { "\${group.key()}: $it" }
        }
        .subscribe { println(it) }
}`, comment: "count() aggregates element totals — useful for monitoring and alerting" },

  // all / any / hasElements
  { type: "heading", level: 3, id: "all-any-has", text: "all / any / hasElements" },
  { type: "paragraph", text: "Boolean aggregation operators: all() checks if every element matches. any() checks if at least one matches. hasElements() checks if the source emitted at least one element." },
  { type: "image", src: `${IMG}/all.svg`, alt: "Flux.all marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    val numbers = Flux.just(2, 4, 6, 8, 10)

    // all: every element matches?
    numbers.all { it % 2 == 0 }
        .subscribe { println("All even: $it") }  // true

    // any: at least one matches?
    numbers.any { it > 8 }
        .subscribe { println("Any > 8: $it") }  // true

    // hasElements: non-empty?
    Flux.empty<Int>().hasElements()
        .subscribe { println("Has elements: $it") }  // false

    // hasElement: contains value?
    numbers.hasElement(6)
        .subscribe { println("Contains 6: $it") }  // true
}`, comment: "Boolean operators for testing sequences" },

  // ━━━━━━━━━ TIMING & DELAY ━━━━━━━━━
  { type: "heading", level: 2, id: "timing", text: "Timing & Delay" },
  { type: "paragraph", text: "Timing operators introduce delays, enforce timeouts, and measure elapsed time between signals." },

  // delayElements / delaySequence
  { type: "heading", level: 3, id: "delay-elements", text: "delayElements / delaySequence" },
  { type: "paragraph", text: "delayElements() delays each individual element by a fixed duration. delaySequence() shifts the entire sequence forward in time while preserving the original inter-element timing." },
  { type: "image", src: `${IMG}/delayElements.svg`, alt: "Flux.delayElements marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // delayElements: each element delayed individually
    println("delayElements:")
    Flux.just("A", "B", "C")
        .delayElements(Duration.ofMillis(500))
        .doOnNext { println("  \${System.currentTimeMillis() % 10000}: $it") }
        .blockLast()

    // delaySequence: entire sequence shifted, inter-element time preserved
    println("delaySequence:")
    Flux.interval(Duration.ofMillis(200))
        .take(3)
        .delaySequence(Duration.ofSeconds(1))
        .doOnNext { println("  \${System.currentTimeMillis() % 10000}: $it") }
        .blockLast()
}`, comment: "delayElements() delays each item; delaySequence() shifts the whole sequence" },

  // delaySubscription
  { type: "heading", level: 3, id: "delay-subscription", text: "delaySubscription" },
  { type: "paragraph", text: "Delay the subscription to the source Flux. The source will not start producing until the delay has elapsed." },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    println("Subscribing...")
    Flux.just(1, 2, 3)
        .delaySubscription(Duration.ofSeconds(1))
        .doOnSubscribe { println("Actually subscribed at \${System.currentTimeMillis() % 10000}") }
        .subscribe { println("Value: $it") }

    Thread.sleep(2000)
}`, comment: "delaySubscription() postpones the subscription to the source" },

  // timeout
  { type: "heading", level: 3, id: "timeout", text: "timeout" },
  { type: "paragraph", text: "Propagate a TimeoutException if no item is emitted within a given duration from the previous emission. A fallback Publisher can be provided." },
  { type: "image", src: `${IMG}/timeout.svg`, alt: "Flux.timeout marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // Timeout with error
    Flux.interval(Duration.ofMillis(100))
        .take(3)
        .concatWith(Flux.never())  // hangs after 3 elements
        .timeout(Duration.ofMillis(500))
        .subscribe(
            { println("Value: $it") },
            { println("Timeout! \${it.message}") }
        )

    // Timeout with fallback
    Flux.interval(Duration.ofMillis(100))
        .take(3)
        .concatWith(Flux.never())
        .timeout(Duration.ofMillis(500), Flux.just(99L, 100L))
        .subscribe { println("With fallback: $it") }

    Thread.sleep(2000)
}`, comment: "timeout() triggers TimeoutException or switches to a fallback" },

  // elapsed / timestamp / timed
  { type: "heading", level: 3, id: "elapsed-timestamp", text: "elapsed / timestamp / timed" },
  { type: "paragraph", text: "elapsed() measures time between emissions. timestamp() attaches the current time. timed() wraps elements in a Timed object with both elapsed and timestamp information at nanosecond resolution." },
  { type: "image", src: `${IMG}/elapsed.svg`, alt: "Flux.elapsed marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // elapsed: time since last emission
    Flux.interval(Duration.ofMillis(200))
        .take(4)
        .elapsed()
        .subscribe { (millis, value) ->
            println("Elapsed \${millis}ms: value=$value")
        }

    Thread.sleep(1500)

    // timestamp: wall-clock time
    Flux.just("A", "B", "C")
        .delayElements(Duration.ofMillis(100))
        .timestamp()
        .subscribe { (time, value) ->
            println("At $time: $value")
        }

    Thread.sleep(1000)
}`, comment: "Time-measurement operators for monitoring inter-emission intervals" },

  // ━━━━━━━━━ BACKPRESSURE ━━━━━━━━━
  { type: "heading", level: 2, id: "backpressure", text: "Backpressure" },
  { type: "paragraph", text: "Backpressure operators handle the case where a producer emits faster than consumers can process. They define strategies for dealing with overflow." },

  // onBackpressureBuffer
  { type: "heading", level: 3, id: "on-backpressure-buffer", text: "onBackpressureBuffer" },
  { type: "paragraph", text: "Buffer elements when downstream cannot keep up. Can be unbounded or bounded with various overflow strategies." },
  { type: "image", src: `${IMG}/onBackpressureBuffer.svg`, alt: "Flux.onBackpressureBuffer marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.BufferOverflowStrategy
import java.time.Duration

// Simulate a fast sensor emitting readings faster than DB can persist
fun sensorReadings(): Flux<String> = Flux.interval(Duration.ofMillis(10))
    .map { "reading-$it" }
    .take(50)

fun main() {
    // Unbounded buffer: safe default, but watch memory in production
    sensorReadings()
        .onBackpressureBuffer()
        .publishOn(reactor.core.scheduler.Schedulers.single())
        .doOnNext { Thread.sleep(50) } // slow consumer
        .subscribe { println("Persisted: $it") }

    Thread.sleep(500)

    // Bounded buffer with DROP_OLDEST: keep the latest N readings
    println("\\n--- Bounded buffer (DROP_OLDEST) ---")
    Flux.range(1, 100)
        .onBackpressureBuffer(
            10,
            { dropped -> println("  Evicted old reading: $dropped") },
            BufferOverflowStrategy.DROP_OLDEST
        )
        .subscribe { println("  Stored: $it") }

    // Bounded buffer with DROP_LATEST: keep the earliest N readings
    println("\\n--- Bounded buffer (DROP_LATEST) ---")
    Flux.range(1, 100)
        .onBackpressureBuffer(
            10,
            { dropped -> println("  Rejected new: $dropped") },
            BufferOverflowStrategy.DROP_LATEST
        )
        .subscribe { println("  Stored: $it") }
}`, comment: "onBackpressureBuffer() with different overflow strategies for fast-producer/slow-consumer scenarios" },

  // onBackpressureDrop
  { type: "heading", level: 3, id: "on-backpressure-drop", text: "onBackpressureDrop" },
  { type: "paragraph", text: "Drop elements when downstream cannot keep up. Optionally notify a consumer about each dropped element." },
  { type: "image", src: `${IMG}/onBackpressureDrop.svg`, alt: "Flux.onBackpressureDrop marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers
import java.time.Duration
import java.util.concurrent.atomic.AtomicLong

// Simulate a live stock ticker: prices arrive faster than the UI can render
fun stockTicker(): Flux<String> = Flux.interval(Duration.ofMillis(5))
    .map { tick -> "AAPL: \${150.0 + (tick % 20) * 0.1}" }
    .take(100)

fun main() {
    val dropCount = AtomicLong(0)

    stockTicker()
        .onBackpressureDrop { price ->
            dropCount.incrementAndGet()
            // In production: log to metrics, not stdout
        }
        .publishOn(Schedulers.single())
        .doOnNext { Thread.sleep(20) } // slow UI rendering
        .doOnComplete {
            println("Dropped \${dropCount.get()} stale prices (expected for live data)")
        }
        .subscribe { println("Rendered: $it") }

    Thread.sleep(3000)
}`, comment: "onBackpressureDrop() silently discards stale values — ideal for live UI feeds" },

  // onBackpressureLatest
  { type: "heading", level: 3, id: "on-backpressure-latest", text: "onBackpressureLatest" },
  { type: "paragraph", text: "Keep only the most recent element when downstream cannot keep up. Previous undelivered elements are discarded." },
  { type: "image", src: `${IMG}/onBackpressureLatest.svg`, alt: "Flux.onBackpressureLatest marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers
import java.time.Duration

// Simulate GPS location updates: only the latest position matters
data class GpsPosition(val lat: Double, val lng: Double, val seq: Long)

fun gpsUpdates(): Flux<GpsPosition> = Flux.interval(Duration.ofMillis(10))
    .map { GpsPosition(40.7128 + it * 0.0001, -74.006 + it * 0.0001, it) }
    .take(50)

fun main() {
    gpsUpdates()
        .onBackpressureLatest()  // only keep the freshest position
        .publishOn(Schedulers.single())
        .doOnNext { Thread.sleep(100) } // slow map render
        .subscribe { pos ->
            println("Map updated → seq=\${pos.seq} lat=\${"%.4f".format(pos.lat)}")
        }
    // Notice: only the latest GPS reading is rendered, intermediate ones are dropped

    Thread.sleep(3000)
}`, comment: "onBackpressureLatest() keeps only the most recent value — perfect for GPS/sensor UIs" },

  // onBackpressureError
  { type: "heading", level: 3, id: "on-backpressure-error", text: "onBackpressureError" },
  { type: "paragraph", text: "Signal an error when downstream cannot keep up. This is the strictest backpressure strategy." },
  { type: "image", src: `${IMG}/onBackpressureError.svg`, alt: "Flux.onBackpressureError marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers
import java.time.Duration

// Strict mode: in financial systems, losing data silently is unacceptable
// Use onBackpressureError to fail fast and alert operators
fun transactionStream(): Flux<String> = Flux.interval(Duration.ofMillis(5))
    .map { "TXN-\${1000 + it}" }
    .take(50)

fun main() {
    transactionStream()
        .onBackpressureError()  // fail-fast: no silent data loss
        .publishOn(Schedulers.single())
        .doOnNext { Thread.sleep(20) } // slow processing
        .subscribe(
            { println("Committed: $it") },
            { err ->
                println("ALERT: Overflow detected — \${err.message}")
                println("Action: Scale consumers or throttle producers")
            }
        )

    Thread.sleep(2000)
}`, comment: "onBackpressureError() signals overflow immediately — use when silent data loss is unacceptable" },

  // limitRate
  { type: "heading", level: 3, id: "limit-rate", text: "limitRate" },
  { type: "paragraph", text: "Split downstream backpressure requests into smaller batches, effectively rate-limiting the upstream. Useful when the source works better with smaller request sizes." },
  { type: "image", src: `${IMG}/limitRate.svg`, alt: "Flux.limitRate marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

// Simulate paginated API where requesting too many pages at once
// overloads the backend. limitRate() splits the request into batches.
fun paginatedApi(): Flux<String> = Flux.range(1, 50)
    .doOnRequest { n -> println("  API received request for $n items") }
    .map { "page-$it" }

fun main() {
    println("Without limitRate (requests all 50 at once):")
    paginatedApi().take(5).subscribe { println("  Got: $it") }

    println("\\nWith limitRate(10) — upstream only sees batches of 10:")
    paginatedApi()
        .limitRate(10)
        .take(15)
        .subscribe { println("  Got: $it") }

    // High/low watermark: request 10 initially, replenish when 5 consumed
    println("\\nWith limitRate(10, 5) — replenish at low watermark:")
    Flux.range(1, 30)
        .doOnRequest { println("  Upstream request: $it") }
        .limitRate(10, 5)
        .subscribe { println("  Consumed: $it") }
}`, comment: "limitRate() prevents overwhelming upstream APIs by splitting demand into batches" },

  // ━━━━━━━━━ SCHEDULING ━━━━━━━━━
  { type: "heading", level: 2, id: "scheduling", text: "Scheduling" },
  { type: "paragraph", text: "Scheduling operators control which threads execute different parts of the reactive chain. This is critical for non-blocking I/O and CPU-intensive processing." },

  // publishOn
  { type: "heading", level: 3, id: "publish-on", text: "publishOn" },
  { type: "paragraph", text: "Run onNext, onComplete, and onError on a supplied Scheduler. Affects all downstream operators until the next publishOn. Typically used for fast publisher, slow consumer scenarios." },
  { type: "image", src: `${IMG}/publishOn.svg`, alt: "Flux.publishOn marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers

// Real-world pattern: HTTP request arrives on Netty's event-loop thread.
// Heavy computation must NOT block the event loop — use publishOn to offload.
fun main() {
    Flux.just("user-request-1", "user-request-2", "user-request-3")
        .doOnNext {
            // This runs on the calling thread (e.g., Netty event-loop)
            println("[$it] Received on: \${Thread.currentThread().name}")
        }
        .publishOn(Schedulers.boundedElastic()) // offload to elastic pool
        .map { request ->
            // Simulate heavy DB query — now on boundedElastic, not event-loop!
            Thread.sleep(50)
            println("[$request] DB query on: \${Thread.currentThread().name}")
            "\$request → result"
        }
        .publishOn(Schedulers.parallel()) // switch to parallel for CPU work
        .map { result ->
            println("[$result] Serialization on: \${Thread.currentThread().name}")
            "{ \\"data\\": \\"$result\\" }"
        }
        .blockLast()
}`, comment: "publishOn() offloads work: event-loop → boundedElastic (I/O) → parallel (CPU)" },

  // subscribeOn
  { type: "heading", level: 3, id: "subscribe-on", text: "subscribeOn" },
  { type: "paragraph", text: "Run the subscription, onSubscribe, and request on a specified Scheduler. Unlike publishOn, placement doesn't matter — it affects the whole chain upstream. Used for slow publishers (blocking I/O)." },
  { type: "image", src: `${IMG}/subscribeOn.svg`, alt: "Flux.subscribeOn marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers

// subscribeOn moves the SOURCE to a different thread pool.
// Unlike publishOn, placement doesn't matter — it always affects upstream.
// Use for blocking I/O sources that shouldn't run on the event loop.

fun blockingFileReader(): Flux<String> = Flux.create { sink ->
    println("Reading file on: \${Thread.currentThread().name}")
    // Simulate blocking file read
    listOf("line-1: config=production", "line-2: port=8080", "line-3: debug=false")
        .forEach { sink.next(it) }
    sink.complete()
}

fun main() {
    blockingFileReader()
        .subscribeOn(Schedulers.boundedElastic())  // blocking I/O → elastic
        .publishOn(Schedulers.parallel())           // processing → parallel
        .filter { !it.contains("debug") }
        .map { line ->
            println("Parsing on: \${Thread.currentThread().name}")
            val (key, value) = line.substringAfter(": ").split("=")
            key to value
        }
        .doOnNext { (k, v) -> println("Config: $k = $v") }
        .blockLast()

    // Key insight: subscribeOn(elastic) ensures the file read doesn't
    // block the caller's thread, while publishOn(parallel) offloads parsing.
}`, comment: "subscribeOn() wraps blocking I/O sources; publishOn() offloads downstream processing" },

  // parallel
  { type: "heading", level: 3, id: "parallel-flux", text: "parallel" },
  { type: "paragraph", text: "Divide the Flux into 'rails' for parallel processing. Must call runOn() to actually execute on parallel threads. Results can be re-merged with sequential()." },
  { type: "image", src: `${IMG}/parallel.svg`, alt: "Flux.parallel marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.scheduler.Schedulers

fun main() {
    Flux.range(1, 10)
        .parallel(4)                        // 4 rails
        .runOn(Schedulers.parallel())       // run on parallel scheduler
        .map { value ->
            println("Processing $value on \${Thread.currentThread().name}")
            value * value
        }
        .sequential()                       // merge back to single Flux
        .collectSortedList()
        .subscribe { println("Results: $it") }

    Thread.sleep(1000)
}`, comment: "parallel() + runOn() enables true parallel processing across CPU cores" },

  // ━━━━━━━━━ MULTICASTING & CACHING ━━━━━━━━━
  { type: "heading", level: 2, id: "multicasting", text: "Multicasting & Caching" },
  { type: "paragraph", text: "These operators turn a cold Flux into a hot source that can share a single subscription with multiple subscribers." },

  // share
  { type: "heading", level: 3, id: "share", text: "share" },
  { type: "paragraph", text: "Multicast the original Flux. As long as there is at least one subscriber, the source stays subscribed. Late subscribers may miss early items." },
  { type: "image", src: `${IMG}/share.svg`, alt: "Flux.share marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    val shared = Flux.interval(Duration.ofMillis(200))
        .take(10)
        .doOnSubscribe { println("Source subscribed!") }
        .share()

    // First subscriber
    shared.subscribe { println("Sub1: $it") }

    Thread.sleep(600) // wait for a few items

    // Late subscriber: misses early items
    shared.subscribe { println("Sub2: $it") }

    Thread.sleep(3000)
}`, comment: "share() multicasts the source; late subscribers miss earlier items" },

  // publish / ConnectableFlux
  { type: "heading", level: 3, id: "publish", text: "publish / ConnectableFlux" },
  { type: "paragraph", text: "Create a ConnectableFlux that only starts emitting when connect() is called. Useful when you need to set up all subscribers before data starts flowing." },
  { type: "image", src: `${IMG}/publish.svg`, alt: "Flux.publish marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    val connectable = Flux.interval(Duration.ofMillis(200))
        .take(5)
        .publish()

    // Set up subscribers before connecting
    connectable.subscribe { println("Sub1: $it") }
    connectable.subscribe { println("Sub2: $it") }

    println("Connecting...")
    connectable.connect()  // now data flows to both

    // autoConnect: automatically connect after N subscribers
    val auto = Flux.interval(Duration.ofMillis(200))
        .take(5)
        .publish()
        .autoConnect(2)

    auto.subscribe { println("Auto1: $it") }
    // Nothing happens yet...
    auto.subscribe { println("Auto2: $it") }
    // Now it starts! (2 subscribers reached)

    Thread.sleep(2000)
}`, comment: "publish() creates a ConnectableFlux for coordinated multicasting" },

  // replay / cache
  { type: "heading", level: 3, id: "replay-cache", text: "replay / cache" },
  { type: "paragraph", text: "cache() turns the Flux into a hot source and caches emitted signals. replay() is similar but returns a ConnectableFlux. Late subscribers receive cached values." },
  { type: "image", src: `${IMG}/cache.svg`, alt: "Flux.cache marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // cache: all values cached
    val cached = Flux.just("A", "B", "C")
        .doOnSubscribe { println("Source subscribed!") }
        .cache()

    cached.subscribe { println("Sub1: $it") }  // triggers source
    cached.subscribe { println("Sub2: $it") }  // uses cache, no new subscription

    // cache with history limit
    val limited = Flux.range(1, 10)
        .cache(3)  // keep last 3
    limited.blockLast()
    limited.subscribe { println("Cached: $it") }
    // Only gets 8, 9, 10

    // cache with TTL
    val timed = Flux.just("fresh-data")
        .cache(Duration.ofSeconds(5))
    timed.subscribe { println("First: $it") }
    // After 5 seconds, next subscriber gets a fresh subscription
}`, comment: "cache() replays cached signals to late subscribers" },

  // ━━━━━━━━━ BLOCKING ━━━━━━━━━
  { type: "heading", level: 2, id: "blocking", text: "Blocking Operations" },
  { type: "paragraph", text: "Blocking operators bridge the reactive world with imperative code. Use sparingly — only at the edges of your application." },
  { type: "infoBox", variant: "gray", content: "Warning: Blocking operators should never be called from within a reactive pipeline. They are meant for testing or bridging with non-reactive code at the application boundary." },

  // blockFirst / blockLast
  { type: "heading", level: 3, id: "block-first-last", text: "blockFirst / blockLast" },
  { type: "paragraph", text: "Subscribe and block until the first or last element is emitted. Returns the value or null for empty sequences." },
  { type: "image", src: `${IMG}/blockFirst.svg`, alt: "Flux.blockFirst marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // blockFirst: get the first element
    val first = Flux.just("A", "B", "C").blockFirst()
    println("First: $first")  // A

    // blockLast: get the last element
    val last = Flux.just("A", "B", "C").blockLast()
    println("Last: $last")  // C

    // With timeout
    val timedFirst = Flux.interval(Duration.ofMillis(100))
        .blockFirst(Duration.ofSeconds(1))
    println("Timed first: $timedFirst")  // 0
}`, comment: "blockFirst()/blockLast() block the calling thread to get a value" },

  // toIterable / toStream
  { type: "heading", level: 3, id: "to-iterable-stream", text: "toIterable / toStream" },
  { type: "paragraph", text: "Transform the Flux into a lazy Iterable or Stream that blocks on each call. Useful for bridging with Java collections APIs." },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // toIterable: lazy blocking Iterable
    val iterable = Flux.range(1, 5).toIterable()
    for (item in iterable) {
        println("Iterable: $item")
    }

    // toStream: lazy blocking Java Stream
    val sum = Flux.range(1, 10)
        .toStream()
        .mapToInt { it }
        .sum()
    println("Stream sum: $sum")  // 55
}`, comment: "toIterable()/toStream() create lazy blocking bridges to collections" },

  // ━━━━━━━━━ UTILITY ━━━━━━━━━
  { type: "heading", level: 2, id: "utility", text: "Utility Operators" },
  { type: "paragraph", text: "Additional operators for common reactive patterns: defaults, sorting, repetition, transformation, and resource management." },

  // defaultIfEmpty
  { type: "heading", level: 3, id: "default-if-empty", text: "defaultIfEmpty" },
  { type: "paragraph", text: "Provide a default value if the source Flux completes without emitting any data." },
  { type: "image", src: `${IMG}/defaultIfEmpty.svg`, alt: "Flux.defaultIfEmpty marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

// Common REST API pattern: return default response when query yields nothing
data class Product(val id: String, val name: String, val price: Double)

fun searchProducts(query: String): Flux<Product> =
    if (query.length < 3) Flux.empty()
    else Flux.just(
        Product("P1", "Kotlin in Action", 39.99),
        Product("P2", "Reactive Spring", 44.99)
    ).filter { it.name.lowercase().contains(query.lowercase()) }

fun main() {
    // Search with results
    println("Search 'kotlin':")
    searchProducts("kotlin")
        .defaultIfEmpty(Product("N/A", "No products found", 0.0))
        .subscribe { println("  \${it.name} - \$\${it.price}") }

    // Search with no results → default kicks in
    println("\\nSearch 'python':")
    searchProducts("python")
        .defaultIfEmpty(Product("N/A", "No products found", 0.0))
        .subscribe { println("  \${it.name} - \$\${it.price}") }

    // Too-short query → empty → default
    println("\\nSearch 'ab':")
    searchProducts("ab")
        .defaultIfEmpty(Product("N/A", "Query too short", 0.0))
        .subscribe { println("  \${it.name}") }
}`, comment: "defaultIfEmpty() returns a fallback value for empty query results" },

  // sort
  { type: "heading", level: 3, id: "sort", text: "sort" },
  { type: "paragraph", text: "Collect all elements, sort them, then emit the sorted sequence. Must buffer the entire sequence, so avoid with infinite sources." },
  { type: "image", src: `${IMG}/sort.svg`, alt: "Flux.sort marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

fun main() {
    // Natural order
    Flux.just(5, 3, 8, 1, 9, 2)
        .sort()
        .subscribe { print("$it ") }
    println()  // 1 2 3 5 8 9

    // Custom comparator
    Flux.just("banana", "apple", "cherry", "date")
        .sort(Comparator.comparingInt { it.length })
        .subscribe { println(it) }
}`, comment: "sort() collects and sorts the entire sequence" },

  // repeat / repeatWhen
  { type: "heading", level: 3, id: "repeat", text: "repeat / repeatWhen" },
  { type: "paragraph", text: "Re-subscribe to the source upon completion. repeat(n) repeats N times. repeatWhen() uses a companion Publisher to control re-subscription timing." },
  { type: "image", src: `${IMG}/repeat.svg`, alt: "Flux.repeat marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import java.time.Duration

fun main() {
    // repeat: re-subscribe N times
    Flux.just("ping")
        .repeat(2)  // original + 2 repeats = 3 total
        .subscribe { println(it) }

    // repeat with predicate
    var count = 0
    Flux.just("tick")
        .doOnNext { count++ }
        .repeat { count < 5 }
        .subscribe { println("$it #$count") }

    // repeatWhen: delayed repeat
    Flux.just("poll")
        .repeatWhen { it.delayElements(Duration.ofSeconds(1)) }
        .take(3)
        .subscribe { println(it) }

    Thread.sleep(4000)
}`, comment: "repeat() re-subscribes on completion for polling patterns" },

  // then / thenMany / thenEmpty
  { type: "heading", level: 3, id: "then-mono", text: "then / thenMany / thenEmpty" },
  { type: "paragraph", text: "Ignore source elements and replay only the completion/error signal. then() returns Mono<Void>, then(Mono) plays a Mono after completion, thenMany() plays a Publisher." },
  { type: "image", src: `${IMG}/then.svg`, alt: "Flux.then marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

fun main() {
    // then: wait for completion, return Mono<Void>
    Flux.just(1, 2, 3)
        .doOnNext { println("Processing: $it") }
        .then()
        .doOnSuccess { println("All done!") }
        .subscribe()

    // then(Mono): play a Mono after completion
    Flux.just("save1", "save2", "save3")
        .doOnNext { println("Saving: $it") }
        .then(Mono.just("All saved successfully"))
        .subscribe { println(it) }

    // thenMany: play another Publisher after completion
    Flux.just("init1", "init2")
        .doOnNext { println("Init: $it") }
        .thenMany(Flux.just("ready1", "ready2"))
        .subscribe { println("After init: $it") }
}`, comment: "then() ignores elements, replaying only the terminal signal" },

  // transform / transformDeferred
  { type: "heading", level: 3, id: "transform", text: "transform / transformDeferred" },
  { type: "paragraph", text: "transform() applies a function at assembly time. transformDeferred() (formerly compose) applies per subscriber, enabling subscriber-specific behavior." },
  { type: "code", code: `import reactor.core.publisher.Flux
import org.reactivestreams.Publisher

// Reusable operator composition
fun <T> addLogging(): (Flux<T>) -> Publisher<T> = { flux ->
    flux.doOnNext { println("  [LOG] $it") }
        .doOnError { println("  [ERROR] \${it.message}") }
        .doOnComplete { println("  [COMPLETE]") }
}

fun main() {
    // transform: applies once at assembly
    Flux.just(1, 2, 3)
        .transform(addLogging())
        .subscribe()

    // transformDeferred: applies per subscriber
    Flux.just("A", "B", "C")
        .transformDeferred(addLogging())
        .subscribe()
}`, comment: "transform() and transformDeferred() enable reusable operator composition" },

  // using / usingWhen
  { type: "heading", level: 3, id: "using", text: "using / usingWhen" },
  { type: "paragraph", text: "Resource management operators similar to try-with-resources. using() manages a synchronous resource. usingWhen() manages an asynchronous resource lifecycle." },
  { type: "image", src: `${IMG}/using.svg`, alt: "Flux.using marble diagram" },
  { type: "code", code: `import reactor.core.publisher.Flux

class DatabaseConnection(val name: String) : AutoCloseable {
    init { println("Opening connection: $name") }
    fun query(sql: String): List<String> = listOf("row1", "row2", "row3")
    override fun close() { println("Closing connection: $name") }
}

fun main() {
    // using: manages resource lifecycle
    Flux.using(
        { DatabaseConnection("mydb") },          // resource supplier
        { conn -> Flux.fromIterable(conn.query("SELECT *")) },  // source
        { conn -> conn.close() }                   // cleanup
    ).subscribe { println("Row: $it") }
    // Output: Opening..., row1, row2, row3, Closing...

    // AutoCloseable version (cleanup is automatic)
    Flux.using(
        { DatabaseConnection("auto-db") },
        { conn -> Flux.fromIterable(conn.query("SELECT 1")) }
    ).subscribe { println("Auto: $it") }
}`, comment: "using() provides try-with-resources semantics for reactive streams" },
];
