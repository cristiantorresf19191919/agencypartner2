/**
 * Coroutines basics – documentation-style structure for the Kotlin docs page.
 * Used when rendering /developer-section/kotlin-course/coroutines-basics.
 */

export interface DocTocItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

export type DocBlock =
  | { type: "heading"; level: 1 | 2 | 3; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "stepTitle"; number: number; text: string }
  | { type: "infoBox"; variant: "green" | "gray"; content: string }
  | { type: "code"; code: string; showPlay?: boolean; comment?: string }
  | { type: "image"; src: string; alt: string }
  | { type: "list"; items: string[] }
  | { type: "solution"; taskNumber: number; id?: string; paragraphs?: string[]; steps?: string[]; code?: string; codeShowPlay?: boolean; paragraphAfterCode?: string };

export const COROUTINES_BASICS_TOC: DocTocItem[] = [
  { id: "coroutines-basics", label: "Coroutines basics" },
  { id: "suspending-functions", label: "Suspending functions" },
  { id: "add-kotlinx-coroutines", label: "Add the kotlinx.coroutines library to your project" },
  { id: "create-first-coroutines", label: "Create your first coroutines" },
  {
    id: "coroutine-scope",
    label: "Coroutine scope and structured concurrency",
    children: [
      { id: "coroutine-scope-function", label: "Create a coroutine scope with the coroutineScope() function" },
      { id: "extract-coroutine-builders", label: "Extract coroutine builders from the coroutine scope" },
    ],
  },
  {
    id: "coroutine-builder-functions",
    label: "Coroutine builder functions",
    children: [
      { id: "launch", label: "CoroutineScope.launch()" },
      { id: "async", label: "CoroutineScope.async()" },
      { id: "runblocking", label: "runBlocking()" },
    ],
  },
  { id: "coroutine-dispatchers", label: "Coroutine dispatchers" },
  { id: "comparing-coroutines-threads", label: "Comparing coroutines and JVM threads" },
  { id: "whats-next", label: "What's next" },
];

const CODE = {
  suspendGreet: `suspend fun greet() {
    println("Hello world from a suspending function")
}`,
  suspendMainShowUserInfo: `suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}`,
  buildGradle: `// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
}`,
  step1Import: `import kotlinx.coroutines.*`,
  step2Suspend: `suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
}

suspend fun main() {}`,
  step3Delay: `suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1000L)
}`,
  step4WithContext: `suspend fun main() {
    withContext(Dispatchers.Default) {
        // Add the coroutine builders here
    }
}`,
  step5Launch: `suspend fun main() {
    withContext(Dispatchers.Default) { // this: CoroutineScope
        // Starts a coroutine inside the scope with CoroutineScope.launch()
        this.launch { greet() }
        println("The withContext() on the thread: \${Thread.currentThread().name}")
    }
}`,
  withContextLaunch: `import kotlinx.coroutines.*

suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1000L)
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        this.launch { greet() }
        println("The withContext() on the thread: \${Thread.currentThread().name}")
    }
}`,
  multipleCoroutines: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1.seconds)
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        this.launch() { greet() }
        this.launch() {
            println("The CoroutineScope.launch() on the thread: \${Thread.currentThread().name}")
            delay(1.seconds)
        }
        println("The withContext() on the thread: \${Thread.currentThread().name}")
    }
}`,
  coroutineScopeExample: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun main() {
    coroutineScope {
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    println("Coroutine scope completed")
}`,
  extractBuilders: `suspend fun main() {
    coroutineScope {
        this.launch { println("1") }
        this.launch { println("2") }
    }
}

fun CoroutineScope.launchAll() {
    this.launch { println("1") }
    this.launch { println("2") }
}`,
  launchExample: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun performBackgroundWork() = coroutineScope {
    this.launch {
        delay(100.milliseconds)
        println("Sending notification in background")
    }
    println("Scope continues")
}`,
  asyncExample: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() = withContext(Dispatchers.Default) {
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: \$pagesAreEqual")
}`,
  runBlockingExample: `import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

interface Repository { fun readItem(): Int }

object MyRepository : Repository {
    override fun readItem(): Int {
        return runBlocking { myReadItem() }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}`,
  dispatcherExample: `suspend fun runWithDispatcher() = coroutineScope {
    this.launch(Dispatchers.Default) {
        println("Running on \${Thread.currentThread().name}")
    }
}`,
  withContextDispatcherExample: `import kotlinx.coroutines.*

suspend fun main() = withContext(Dispatchers.Default) {
    println("Running withContext block on \${Thread.currentThread().name}")
    val one = this.async {
        println("First calculation starting on \${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on \${Thread.currentThread().name}")
        sum
    }
    val two = this.async {
        println("Second calculation starting on \${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on \${Thread.currentThread().name}")
        sum
    }
    println("Combined total: \${one.await() + two.await()}")
}`,
  printPeriodsCoroutines: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun printPeriods() = coroutineScope {
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}`,
  printPeriodsThreads: `import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}`,
};

export const COROUTINES_BASICS_BLOCKS: DocBlock[] = [
  { type: "heading", level: 2, id: "coroutines-basics", text: "Coroutines basics" },
  {
    type: "paragraph",
    text: "To create applications that perform multiple tasks at once, a concept known as concurrency, Kotlin uses coroutines. A coroutine is a suspendable computation that lets you write concurrent code in a clear, sequential style. Coroutines can run concurrently with other coroutines and potentially in parallel.",
  },
  {
    type: "paragraph",
    text: "On the JVM and in Kotlin/Native, all concurrent code, such as coroutines, runs on threads, managed by the operating system. Coroutines can suspend their execution instead of blocking a thread. This allows one coroutine to suspend while waiting for some data to arrive and another coroutine to run on the same thread, ensuring effective resource utilization.",
  },
  {
    type: "paragraph",
    text: "Comparing parallel and concurrent threads — For more information about the differences between coroutines and threads, see Comparing coroutines and JVM threads.",
  },
  {
    type: "image",
    src: "/images/portfolio/couroutinesBasic/parallelism-and-concurrency.svg",
    alt: "Diagram: Parallel (multiple threads, one task each), Concurrent (one thread, multiple tasks interleaved), Parallel and Concurrent (multiple threads with interleaved tasks).",
  },
  { type: "heading", level: 2, id: "suspending-functions", text: "Suspending functions" },
  {
    type: "paragraph",
    text: "The most basic building block of coroutines is the suspending function. It allows a running operation to pause and resume later without affecting the structure of your code.",
  },
  {
    type: "paragraph",
    text: "To declare a suspending function, use the suspend keyword:",
  },
  { type: "code", code: CODE.suspendGreet, showPlay: false },
  {
    type: "paragraph",
    text: "You can only call a suspending function from another suspending function. To call suspending functions at the entry point of a Kotlin application, mark the main() function with the suspend keyword:",
  },
  { type: "code", code: CODE.suspendMainShowUserInfo, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "This example doesn't use concurrency yet, but by marking the functions with the suspend keyword, you allow them to call other suspending functions and run concurrent code inside.",
  },
  {
    type: "paragraph",
    text: "While the suspend keyword is part of the core Kotlin language, most coroutine features are available through the kotlinx.coroutines library.",
  },
  { type: "heading", level: 2, id: "add-kotlinx-coroutines", text: "Add the kotlinx.coroutines library to your project" },
  {
    type: "paragraph",
    text: "To include the kotlinx.coroutines library in your project, add the corresponding dependency configuration based on your build tool:",
  },
  { type: "code", code: CODE.buildGradle, showPlay: false },
  { type: "heading", level: 2, id: "create-first-coroutines", text: "Create your first coroutines" },
  {
    type: "infoBox",
    variant: "green",
    content: "The examples on this page use the explicit this expression with the coroutine builder functions CoroutineScope.launch() and CoroutineScope.async(). These coroutine builders are extension functions on CoroutineScope, and the this expression refers to the current CoroutineScope as the receiver. For a practical example, see Extract coroutine builders from the coroutine scope.",
  },
  {
    type: "paragraph",
    text: "To create a coroutine in Kotlin, you need the following:",
  },
  {
    type: "list",
    items: [
      "A suspending function.",
      "A coroutine scope in which it can run, for example inside the withContext() function.",
      "A coroutine builder like CoroutineScope.launch() to start it.",
      "A dispatcher to control which threads it uses.",
    ],
  },
  {
    type: "paragraph",
    text: "Let's look at an example that uses multiple coroutines in a multithreaded environment:",
  },
  { type: "stepTitle", number: 1, text: "Import the kotlinx.coroutines library:" },
  { type: "code", code: CODE.step1Import, showPlay: false },
  { type: "stepTitle", number: 2, text: "Mark functions that can pause and resume with the suspend keyword:" },
  { type: "code", code: CODE.step2Suspend, showPlay: false },
  {
    type: "infoBox",
    variant: "green",
    content: "While you can mark the main() function as suspend in some projects, it may not be possible when integrating with existing code or using a framework. In that case, check the framework's documentation to see if it supports calling suspending functions. If not, use runBlocking() to call them by blocking the current thread.",
  },
  {
    type: "stepTitle",
    number: 3,
    text: "Add the delay() function to simulate a suspending task, such as fetching data or writing to a database:",
  },
  { type: "code", code: CODE.step3Delay, showPlay: false },
  {
    type: "stepTitle",
    number: 4,
    text: "Use withContext(Dispatchers.Default) to define an entry point for multithreaded concurrent code that runs on a shared thread pool:",
  },
  { type: "code", code: CODE.step4WithContext, showPlay: false },
  {
    type: "infoBox",
    variant: "green",
    content: "The suspending withContext() function is typically used for context switching, but in this example, it also defines a non-blocking entry point for concurrent code. It uses the Dispatchers.Default dispatcher to run code on a shared thread pool for multithreaded execution. By default, this pool uses up to as many threads as there are CPU cores available at runtime, with a minimum of two threads. The coroutines launched inside the withContext() block share the same coroutine scope, which ensures structured concurrency.",
  },
  {
    type: "stepTitle",
    number: 5,
    text: "Use a coroutine builder function like CoroutineScope.launch() to start the coroutine:",
  },
  { type: "code", code: CODE.step5Launch, showPlay: false },
  {
    type: "stepTitle",
    number: 6,
    text: "Combine these pieces to run multiple coroutines at the same time on a shared pool of threads:",
  },
  { type: "code", code: CODE.multipleCoroutines, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "Try running the example multiple times. You may notice that the output order and thread names may change each time you run the program, because the OS decides when threads run.",
  },
  {
    type: "infoBox",
    variant: "gray",
    content: "You can display coroutine names next to thread names in the output of your code for additional information. To do so, pass the -Dkotlinx.coroutines.debug VM option in your build tool or IDE run configuration. See Debugging coroutines for more information.",
  },
  { type: "heading", level: 2, id: "coroutine-scope", text: "Coroutine scope and structured concurrency" },
  {
    type: "paragraph",
    text: "When you run many coroutines in an application, you need a way to manage them as groups. Kotlin coroutines rely on a principle called structured concurrency to provide this structure.",
  },
  {
    type: "paragraph",
    text: "According to this principle, coroutines form a tree hierarchy of parent and child tasks with linked lifecycles. A coroutine's lifecycle is the sequence of states from its creation until completion, failure, or cancellation.",
  },
  {
    type: "paragraph",
    text: "A parent coroutine waits for its children to complete before it finishes. If the parent coroutine fails or gets canceled, all its child coroutines are recursively canceled too. Keeping coroutines connected this way makes cancellation and error handling predictable and safe.",
  },
  {
    type: "paragraph",
    text: "To maintain structured concurrency, new coroutines can only be launched in a CoroutineScope that defines and manages their lifecycle. The CoroutineScope includes the coroutine context, which defines the dispatcher and other execution properties. When you start a coroutine inside another coroutine, it automatically becomes a child of its parent scope.",
  },
  {
    type: "paragraph",
    text: "Calling a coroutine builder function, such as CoroutineScope.launch() on a CoroutineScope, starts a child coroutine of the coroutine associated with that scope. Inside the builder's block, the receiver is a nested CoroutineScope, so any coroutines you launch there become its children.",
  },
  { type: "heading", level: 3, id: "coroutine-scope-function", text: "Create a coroutine scope with the coroutineScope() function" },
  {
    type: "paragraph",
    text: "To create a new coroutine scope with the current coroutine context, use the coroutineScope() function. This function creates a root coroutine of the coroutine subtree. It's the direct parent of coroutines launched inside the block and the indirect parent of any coroutines they launch. coroutineScope() executes the suspending block and waits until the block and any coroutines launched in it complete.",
  },
  {
    type: "paragraph",
    text: "Here's an example:",
  },
  { type: "code", code: CODE.coroutineScopeExample, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "Since no dispatcher is specified in this example, the CoroutineScope.launch() builder functions in the coroutineScope() block inherit the current context. If that context doesn't have a specified dispatcher, CoroutineScope.launch() uses Dispatchers.Default, which runs on a shared pool of threads.",
  },
  { type: "heading", level: 3, id: "extract-coroutine-builders", text: "Extract coroutine builders from the coroutine scope" },
  {
    type: "paragraph",
    text: "In some cases, you may want to extract coroutine builder calls, such as CoroutineScope.launch(), into separate functions.",
  },
  {
    type: "paragraph",
    text: "Consider the following example:",
  },
  { type: "code", code: CODE.extractBuilders, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "infoBox",
    variant: "gray",
    content: "You can also write this.launch without the explicit this expression, as launch. These examples use explicit this expressions to highlight that it's an extension function on CoroutineScope. For more information on how lambdas with receivers work in Kotlin, see Function literals with receiver.",
  },
  {
    type: "paragraph",
    text: "The coroutineScope() function takes a lambda with a CoroutineScope receiver. Inside this lambda, the implicit receiver is a CoroutineScope, so builder functions like CoroutineScope.launch() and CoroutineScope.async() resolve as extension functions on that receiver.",
  },
  {
    type: "paragraph",
    text: "To extract the coroutine builders into another function, that function must declare a CoroutineScope receiver, otherwise a compilation error occurs:",
  },
  { type: "heading", level: 2, id: "coroutine-builder-functions", text: "Coroutine builder functions" },
  {
    type: "paragraph",
    text: "A coroutine builder function is a function that accepts a suspend lambda that defines a coroutine to run. Here are some examples:",
  },
  {
    type: "list",
    items: [
      "CoroutineScope.launch()",
      "CoroutineScope.async()",
      "runBlocking()",
      "withContext()",
      "coroutineScope()",
    ],
  },
  {
    type: "paragraph",
    text: "Coroutine builder functions require a CoroutineScope to run in. This can be an existing scope or one you create with helper functions such as coroutineScope(), runBlocking(), or withContext(). Each builder defines how the coroutine starts and how you interact with its result.",
  },
  { type: "heading", level: 3, id: "launch", text: "CoroutineScope.launch()" },
  {
    type: "paragraph",
    text: "The CoroutineScope.launch() coroutine builder function is an extension function on CoroutineScope. It starts a new coroutine without blocking the rest of the scope, inside an existing coroutine scope.",
  },
  {
    type: "paragraph",
    text: "Use CoroutineScope.launch() to run a task alongside other work when the result isn't needed or you don't want to wait for it:",
  },
  { type: "code", code: CODE.launchExample, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "After running this example, you can see that the main() function isn't blocked by CoroutineScope.launch() and keeps running other code while the coroutine works in the background.",
  },
  {
    type: "infoBox",
    variant: "green",
    content: "The CoroutineScope.launch() function returns a Job handle. Use this handle to wait for the launched coroutine to complete. For more information, see Cancellation and timeouts.",
  },
  { type: "heading", level: 3, id: "async", text: "CoroutineScope.async()" },
  {
    type: "paragraph",
    text: "The CoroutineScope.async() coroutine builder function is an extension function on CoroutineScope. It starts a concurrent computation inside an existing coroutine scope and returns a Deferred handle that represents an eventual result. Use the .await() function to suspend the code until the result is ready:",
  },
  { type: "code", code: CODE.asyncExample, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  { type: "heading", level: 3, id: "runblocking", text: "runBlocking()" },
  {
    type: "paragraph",
    text: "The runBlocking() coroutine builder function creates a coroutine scope and blocks the current thread until the coroutines launched in that scope finish.",
  },
  {
    type: "paragraph",
    text: "Use runBlocking() only when there is no other option to call suspending code from non-suspending code:",
  },
  { type: "code", code: CODE.runBlockingExample, showPlay: false },
  { type: "heading", level: 2, id: "coroutine-dispatchers", text: "Coroutine dispatchers" },
  {
    type: "paragraph",
    text: "A coroutine dispatcher controls which thread or thread pool coroutines use for their execution. Coroutines aren't always tied to a single thread. They can pause on one thread and resume on another, depending on the dispatcher. This lets you run many coroutines at the same time without allocating a separate thread for every coroutine.",
  },
  {
    type: "infoBox",
    variant: "green",
    content: "Even though coroutines can suspend and resume on different threads, values written before the coroutine suspends are still guaranteed to be available within the same coroutine when it resumes.",
  },
  {
    type: "paragraph",
    text: "A dispatcher works together with the coroutine scope to define when coroutines run and where they run. While the coroutine scope controls the coroutine's lifecycle, the dispatcher controls which threads are used for execution.",
  },
  {
    type: "infoBox",
    variant: "green",
    content: "You don't have to specify a dispatcher for every coroutine. By default, coroutines inherit the dispatcher from their parent scope. You can specify a dispatcher to run a coroutine in a different context.",
  },
  {
    type: "paragraph",
    text: "If the coroutine context doesn't include a dispatcher, coroutine builders use Dispatchers.Default.",
  },
  {
    type: "paragraph",
    text: "The kotlinx.coroutines library includes different dispatchers for different use cases. For example, Dispatchers.Default runs coroutines on a shared pool of threads, performing work in the background, separate from the main thread. This makes it an ideal choice for CPU-intensive operations like data processing.",
  },
  {
    type: "paragraph",
    text: "To specify a dispatcher for a coroutine builder like CoroutineScope.launch(), pass it as an argument:",
  },
  { type: "code", code: CODE.dispatcherExample, showPlay: false },
  {
    type: "paragraph",
    text: "Alternatively, you can use a withContext() block to run all code in it on a specified dispatcher:",
  },
  { type: "code", code: CODE.withContextDispatcherExample, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "To learn more about coroutine dispatchers and their uses, including other dispatchers like Dispatchers.IO and Dispatchers.Main, see Coroutine context and dispatchers.",
  },
  { type: "heading", level: 2, id: "comparing-coroutines-threads", text: "Comparing coroutines and JVM threads" },
  {
    type: "paragraph",
    text: "While coroutines are suspendable computations that run code concurrently like threads on the JVM, they work differently under the hood.",
  },
  {
    type: "paragraph",
    text: "A thread is managed by the operating system. Threads can run tasks in parallel on multiple CPU cores and represent a standard approach to concurrency on the JVM. When you create a thread, the operating system allocates memory for its stack and uses the kernel to switch between threads. This makes threads powerful but also resource-intensive. Each thread usually needs a few megabytes of memory, and typically the JVM can only handle a few thousand threads at once.",
  },
  {
    type: "paragraph",
    text: "On the other hand, a coroutine isn't bound to a specific thread. It can suspend on one thread and resume on another, so many coroutines can share the same thread pool. When a coroutine suspends, the thread isn't blocked and remains free to run other tasks. This makes coroutines much lighter than threads and allows running millions of them in one process without exhausting system resources.",
  },
  {
    type: "paragraph",
    text: "Comparing coroutines and threads",
  },
  {
    type: "image",
    src: "/images/portfolio/couroutinesBasic/coroutines-and-threads.svg",
    alt: "Diagram: multiple coroutines (~10 KB heap memory each) run on fewer threads (~2 MB allocated memory each). Runs on the thread.",
  },
  {
    type: "paragraph",
    text: "Let's look at an example where 50,000 coroutines each wait five seconds and then print a period (.):",
  },
  { type: "code", code: CODE.printPeriodsCoroutines, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "Now let's look at the same example using JVM threads:",
  },
  { type: "code", code: CODE.printPeriodsThreads, showPlay: true, comment: "Target: JVM · Running on v.2.3.0" },
  {
    type: "paragraph",
    text: "Running this version uses much more memory because each thread needs its own memory stack. For 50,000 threads, that can be up to 100 GB, compared to roughly 500 MB for the same number of coroutines.",
  },
  {
    type: "paragraph",
    text: "Depending on your operating system, JDK version, and settings, the JVM thread version may throw an out-of-memory error or slow down thread creation to avoid running too many threads at once.",
  },
  { type: "heading", level: 2, id: "whats-next", text: "What's next" },
  {
    type: "paragraph",
    text: "Discover more about combining suspending functions in Composing suspending functions.",
  },
  {
    type: "paragraph",
    text: "Learn how to cancel coroutines and handle timeouts in Cancellation and timeouts.",
  },
  {
    type: "paragraph",
    text: "Dive deeper into coroutine execution and thread management in Coroutine context and dispatchers.",
  },
  {
    type: "paragraph",
    text: "Learn how to return multiple asynchronously computed values in Asynchronous flows.",
  },
];
