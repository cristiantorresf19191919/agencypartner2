"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks ---
const module1Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking { // 1. Bridges normal code to coroutine world",
  "    println(\"Main program starts: ${Thread.currentThread().name}\")",
  "",
  "    val job = launch { // 2. Fire and forget",
  "        println(\"Fake network call starting...\")",
  "        delay(1000L) // 3. Suspends (pauses) without blocking the thread",
  "        println(\"Fake network call finished!\")",
  "    }",
  "",
  "    println(\"Main program waiting...\")",
  "    job.join() // 4. Wait for the coroutine to finish",
  "    println(\"Main program ends.\")",
  "}",
].join("\n");

const module2Code = [
  "import kotlinx.coroutines.*",
  "import kotlin.system.measureTimeMillis",
  "",
  "fun main() = runBlocking {",
  "    val time = measureTimeMillis {",
  "        val stock1 = async(Dispatchers.IO) { fetchStockPrice(\"Tesla\") }",
  "        val stock2 = async(Dispatchers.IO) { fetchStockPrice(\"Apple\") }",
  "        // They are running at the same time now!",
  "        println(\"Tesla is ${stock1.await()} and Apple is ${stock2.await()}\")",
  "    }",
  "    println(\"Total time: $time ms\") // Should be ~1000ms, not 2000ms!",
  "}",
  "",
  "suspend fun fetchStockPrice(name: String): Double {",
  "    delay(1000) // Simulate network",
  "    return (100..500).random().toDouble()",
  "}",
].join("\n");

const module3Code = [
  "fun main() = runBlocking {",
  "    val heavyJob = launch(Dispatchers.Default) {",
  "        repeat(1000) { i ->",
  "            if (!isActive) return@launch // Cooperative cancellation",
  "            println(\"Processing batch $i...\")",
  "            Thread.sleep(100) // Simulating heavy CPU work",
  "        }",
  "    }",
  "",
  "    delay(1500)",
  "    println(\"User cancelled the operation!\")",
  "    heavyJob.cancelAndJoin()",
  "    println(\"Job is officially dead.\")",
  "}",
].join("\n");

const module4Code = [
  "fun main() = runBlocking {",
  "    val channel = Channel<String>()",
  "",
  "    // Producer Coroutine",
  "    launch {",
  "        val menu = listOf(\"Burger\", \"Fries\", \"Coke\")",
  "        for (item in menu) {",
  "            println(\"Chef is cooking $item...\")",
  "            delay(500)",
  "            channel.send(item) // Suspends here if receiver is busy!",
  "        }",
  "        channel.close() // Important: Say we are done!",
  "    }",
  "",
  "    // Consumer Coroutine",
  "    launch {",
  "        for (food in channel) { // Loops until closed",
  "            println(\"Waiter served: $food\")",
  "        }",
  "        println(\"All orders served!\")",
  "    }",
  "}",
].join("\n");

const module5Code = [
  "fun main() = runBlocking {",
  "    val orders = Channel<String>()",
  "",
  "    // 1. Launch 3 Workers (Waiters)",
  "    repeat(3) { id ->",
  "        launch {",
  "            for (order in orders) {",
  "                println(\"Waiter #$id is handling order: $order\")",
  "                delay(1000) // Working hard",
  "            }",
  "        }",
  "    }",
  "",
  "    // 2. Send work",
  "    launch {",
  "        for (i in 1..10) {",
  "            orders.send(\"Table $i\")",
  "        }",
  "        orders.close() // Close channel to stop workers",
  "    }",
  "}",
].join("\n");

const module6Code = [
  "import kotlinx.coroutines.selects.select",
  "",
  "fun main() = runBlocking {",
  "    val fastServer = Channel<String>()",
  "    val slowServer = Channel<String>()",
  "",
  "    launch { delay(100); fastServer.send(\"Fast Response\") }",
  "    launch { delay(2000); slowServer.send(\"Slow Response\") }",
  "",
  "    val result = select<String> {",
  "        fastServer.onReceive { response -> \"Winner: $response\" }",
  "        slowServer.onReceive { response -> \"Winner: $response\" }",
  "    }",
  "    println(result)",
  "}",
].join("\n");

const exampleACode = [
  "import kotlinx.coroutines.*",
  "import kotlin.system.measureTimeMillis",
  "",
  "fun main() = runBlocking {",
  "    println(\"--- Starting the Heavy Load Test ---\")",
  "    val time = measureTimeMillis {",
  "        val jobs = List(100) { i ->",
  "            launch {",
  "                delay(1000L)         // Option A: Coroutine suspends",
  "                // Thread.sleep(1000L) // Option B: Thread is blocked!",
  "                print(\".\")",
  "            }",
  "        }",
  "        jobs.joinAll()",
  "    }",
  "    println(\"\\nCompleted in $time ms\")",
  "}",
].join("\n");

const exampleBCode = [
  "// --- THE WRONG WAY (Sequential) ---",
  "val timeBad = measureTimeMillis {",
  "    val user = getUser() // Suspends here!",
  "    val pic = getPic()   // Suspends here!",
  "    println(\"Bad Way: Got ${user.name} and ${pic.url}\")",
  "}",
  "",
  "// --- THE RIGHT WAY (Concurrent) ---",
  "val timeGood = measureTimeMillis {",
  "    val userDeferred = async { getUser() }",
  "    val picDeferred = async { getPic() }",
  "    println(\"Good Way: Got ${userDeferred.await().name} and ${picDeferred.await().url}\")",
  "}",
].join("\n");

const exampleCCode = [
  "fun main() = runBlocking {",
  "    val parentJob = launch {",
  "        launch { repeat(10) { i -> println(\"Child 1: chunk $i\"); delay(500) } }",
  "        launch { delay(10000); println(\"Child 2: done (You won't see this)\") }",
  "    }",
  "    delay(1500)",
  "    parentJob.cancelAndJoin() // KILL EVERYTHING",
  "}",
].join("\n");

export default function KotlinCoroutinesPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink
              href={createLocalizedPath("/")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink
              href={createLocalizedPath("/developer-section")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink
              href={createLocalizedPath("/developer-section/blog")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Kotlin Coroutines & Channels</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Kotlin Coroutines & Channels: Zero to Hero
        </Heading>
        <Text className={styles.subtitle}>
          A comprehensive course that takes you from beginner to expert in Kotlin Coroutines and Channels. Each module includes concepts, real-world code examples, and a challenge to solve. A coroutine is like a lightweight thread—you can run 100,000 coroutines on a single thread without crashing your app.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
            alt="Code and concurrency concept"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Course structure:</strong> 6 modules + bridge examples + capstone. Each module has a Concept, a Code Example, and a Challenge. Start with Module 1, copy the code into IntelliJ or Android Studio, and try the challenges.
          </Text>
        </div>
      </div>

      {/* Module 1 */}
      <section id="module-1-foundations" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 1: The Foundations (Breaking Free from Threads)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Understand what a coroutine is, how to start one, and the magic of <code>suspend</code>.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> <code>runBlocking</code> vs <code>launch</code>, suspend functions (the &quot;pause&quot; button), and the difference between blocking and suspending. The thread is not blocked when you suspend—it can do other work.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="https://kotlinlang.org/docs/images/get-started-coroutines.svg"
                alt="Kotlin coroutines: get started"
                width={400}
                height={200}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
            <CodeEditor code={module1Code} language="kotlin" readOnly height={320} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 1: The Breakfast Chef</strong> — Write a program that simulates making breakfast. Create <code>makeCoffee()</code> (1 second) and <code>toastBread()</code> (2 seconds). Launch them sequentially inside <code>runBlocking</code>. Bonus: print &quot;Breakfast is ready!&quot; only after both are done.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Module 2 */}
      <section id="module-2-async" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 2: Async & Parallelism (Doing Things at Once)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Stop doing things one by one. Learn to return values from coroutines concurrently.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> <code>async</code> vs <code>launch</code>, <code>await()</code>, and Dispatchers (IO, Default, Main). Use <code>launch</code> when you don&apos;t care about the result (fire & forget). Use <code>async</code> when you need a result back (like a Promise or Future).
            </Text>
            <CodeEditor code={module2Code} language="kotlin" readOnly height={340} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 2: The Racer</strong> — Create <code>getFacebookLikes()</code> (3s) and <code>getTwitterFollowers()</code> (1s). Run them in parallel and print the total count. Constraint: total execution time must be around 3 seconds, not 4.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Module 3 */}
      <section id="module-3-context-cancellation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 3: Context & Cancellation (Structured Concurrency)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Learn how to stop coroutines when they are no longer needed (e.g., user closes the screen).
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> Job lifecycle, <code>cancel()</code> and <code>cancelAndJoin()</code>, <code>isActive</code> check, and <code>withContext</code> (switching threads safely).
            </Text>
            <CodeEditor code={module3Code} language="kotlin" readOnly height={320} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 3: The Timeout</strong> — Create <code>downloadLargeFile()</code> that prints &quot;Downloading %&quot; every 500ms for 10 seconds. Wrap it in <code>withTimeoutOrNull(2000)</code>. Ensure the download stops cleanly after 2 seconds and prints &quot;Download timed out, retrying...&quot;
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Module 4 */}
      <section id="module-4-channels" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 4: Channels (Hot Pipes)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Communication between coroutines. Passing data like a relay race.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> <code>Channel&lt;T&gt;</code>, <code>send()</code> and <code>receive()</code>, Producer/Consumer pattern, and Buffered Channels. A Channel is like a pipe: one coroutine puts a value in one end, another takes it out the other end.
            </Text>
            <CodeEditor code={module4Code} language="kotlin" readOnly height={360} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 4: The Barista</strong> — Create a <code>Channel&lt;Int&gt;</code> with capacity 2 (coffee counter). Producer makes 10 coffees fast (every 100ms). Consumer serves coffee slowly (every 1000ms). When the buffer fills, print &quot;Counter full, Barista waiting...&quot;
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Module 5 */}
      <section id="module-5-fan-out-in" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 5: Advanced Channels (Fan-Out & Fan-In)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> High-performance processing. Distributing work to multiple workers.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> Fan-Out: one producer, many workers (load balancer). Fan-In: many producers, one receiver (aggregator).
            </Text>
            <CodeEditor code={module5Code} language="kotlin" readOnly height={340} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 5: The Search Engine</strong> — Create a Fan-In system. Launch <code>searchGoogle()</code>, <code>searchBing()</code>, and <code>searchYahoo()</code>. All send results into a single channel. Main should print results as they arrive: &quot;Found in Google&quot;, &quot;Found in Bing&quot;, etc.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Module 6 */}
      <section id="module-6-select" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 6: Select Expression (The &quot;Race&quot;)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Waiting for multiple options and picking only the first one that is ready.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> <code>select</code>, <code>onReceive</code>, and racing two (or more) channels.
            </Text>
            <CodeEditor code={module6Code} language="kotlin" readOnly height={300} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 6: The Fastest Server</strong> — Create <code>getUSServer()</code> (random delay 1–3s) and <code>getEUServer()</code> (random delay 1–3s). Use <code>select</code> to return data from whichever responds first. Optionally cancel the other request.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Bridge: Example Set A */}
      <section id="example-a-non-blocking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Example Set A: The &quot;Non-Blocking&quot; Magic
            </Heading>
            <Text className={styles.sectionDescription}>
              Many developers confuse <code>Thread.sleep()</code> (Java style) with <code>delay()</code> (Kotlin style). This example shows why <code>delay</code> is better: 100 tasks with <code>delay(1000)</code> finish in ~1 second; with <code>Thread.sleep(1000)</code> on a single thread they would take 100 seconds.
            </Text>
            <CodeEditor code={exampleACode} language="kotlin" readOnly height={320} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                Run with <code>delay(1000L)</code>: completes in ~1000ms. Swap to <code>Thread.sleep(1000L)</code>: the thread is blocked and 100 tasks take 100 seconds. Suspending frees the thread for other coroutines.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Bridge: Example Set B */}
      <section id="example-b-async-trap" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Example Set B: The &quot;Async&quot; Trap (Sequential vs Parallel)
            </Heading>
            <Text className={styles.sectionDescription}>
              A common mistake: calling <code>await()</code> too early makes code sequential again. Bad: fetch User → wait → fetch Pic → wait (2s). Good: start both with <code>async</code>, then <code>await()</code> both (1s).
            </Text>
            <CodeEditor code={exampleBCode} language="kotlin" readOnly height={280} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                If you write <code>{`async { ... }.await()`}</code> immediately, you defeat the purpose. Always assign the <code>Deferred</code> to a variable first, then call <code>.await()</code> when you need the result.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Bridge: Example Set C */}
      <section id="example-c-scope-hierarchy" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Example Set C: Scope & Hierarchy (The Parent-Child Rule)
            </Heading>
            <Text className={styles.sectionDescription}>
              Coroutines are structured: if a parent is cancelled, its children are cancelled too. You don&apos;t need to track and cancel each child manually—cancelling the parent cleans up everything and prevents leaks.
            </Text>
            <CodeEditor code={exampleCCode} language="kotlin" readOnly height={220} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                When <code>parentJob.cancelAndJoin()</code> is called, both child coroutines stop. Child 2 never reaches its &quot;done&quot; message. This is structured concurrency in action.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Challenge 1.5 */}
      <section id="challenge-retry" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Challenge 1.5: The Retry Mechanism
            </Heading>
            <Text className={styles.sectionDescription}>
              In real life, networks fail. Write a retry wrapper. Create <code>unstableNetworkCall()</code> that fails (throws) 80% of the time and succeeds (returns &quot;Success!&quot;) 20%, taking 500ms. Write <code>retryWithBackoff</code> that runs the block, and on failure waits 1s then retries, then 2s (double), max 3 retries. Launch it and see if you get &quot;Success!&quot;
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                Try solving this before moving to Channels. Paste your solution for a code review and then get Module 2&apos;s deep dive.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Capstone */}
      <section id="capstone-stock-monitor" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Final Capstone: The Real-Time Stock Monitor
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Scenario:</strong> You are building a trading dashboard.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Requirements:</strong> Create a <code>StockPrice(symbol, price)</code> data class. Producer: a Flow or Channel that emits updates for &quot;TSLA&quot; every 500ms and &quot;AAPL&quot; every 200ms with random prices. Processor: a coroutine that filters out price changes smaller than $1.00 (noise reduction). UI (Consumer): print the final &quot;alert&quot; prices to the console. Timeout: the whole system shuts down after 10 seconds.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <Text className={styles.infoText}>
                This capstone ties together coroutines, channels/flow, cancellation, and timeouts. Once you finish Challenge 1, paste your solution for review and get the Module 2 deep dive.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      <nav className={styles.navigation}>
        <ButtonLink
          href={createLocalizedPath("/developer-section/blog")}
          variant="secondary"
          className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
        >
          ← Back to Blog
        </ButtonLink>
        <ButtonLink
          href={createLocalizedPath("/developer-section/kotlin-playground")}
          variant="primary"
        >
          Kotlin Playground →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
