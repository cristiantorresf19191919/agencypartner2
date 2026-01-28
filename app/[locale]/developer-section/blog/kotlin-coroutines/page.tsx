"use client";

import {
  Stack,
  Heading,
  Text,
  ButtonLink,
  Card,
  CodeEditor,
  FullscreenSection,
} from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import Image from "next/image";
import styles from "../BlogPostPage.module.css";

// ——— Module 1: Foundations ———
const foundationsCode = `import kotlinx.coroutines.*

fun main() = runBlocking { // 1. Bridges normal code to coroutine world
    println("Main program starts: \${Thread.currentThread().name}")

    val job = launch { // 2. Fire and forget
        println("Fake network call starting...")
        delay(1000L) // 3. Suspends (pauses) without blocking the thread
        println("Fake network call finished!")
    }

    println("Main program waiting...")
    job.join() // 4. Wait for the coroutine to finish
    println("Main program ends.")
}`;

// ——— Module 2: Async & Parallelism ———
const asyncCode = `import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun main() = runBlocking {
    val time = measureTimeMillis {
        val stock1 = async(Dispatchers.IO) { fetchStockPrice("Tesla") }
        val stock2 = async(Dispatchers.IO) { fetchStockPrice("Apple") }

        // They are running at the same time now!
        println("Tesla is \${stock1.await()} and Apple is \${stock2.await()}")
    }
    println("Total time: $time ms") // Should be ~1000ms, not 2000ms!
}

suspend fun fetchStockPrice(name: String): Double {
    delay(1000) // Simulate network
    return (100..500).random().toDouble()
}`;

// ——— Module 3: Context & Cancellation ———
const cancellationCode = `fun main() = runBlocking {
    val heavyJob = launch(Dispatchers.Default) {
        repeat(1000) { i ->
            if (!isActive) return@launch // Cooperative cancellation
            println("Processing batch $i...")
            Thread.sleep(100) // Simulating heavy CPU work
        }
    }

    delay(1500)
    println("User cancelled the operation!")
    heavyJob.cancelAndJoin()
    println("Job is officially dead.")
}`;

// ——— Module 4: Channels ———
const channelsCode = `fun main() = runBlocking {
    val channel = Channel<String>()

    // Producer Coroutine
    launch {
        val menu = listOf("Burger", "Fries", "Coke")
        for (item in menu) {
            println("Chef is cooking $item...")
            delay(500)
            channel.send(item) // Suspends here if receiver is busy!
        }
        channel.close() // Important: Say we are done!
    }

    // Consumer Coroutine
    launch {
        for (food in channel) { // Loops until closed
            println("Waiter served: $food")
        }
        println("All orders served!")
    }
}`;

// ——— Module 5: Fan-Out ———
const fanOutCode = `fun main() = runBlocking {
    val orders = Channel<String>()

    // 1. Launch 3 Workers (Waiters)
    repeat(3) { id ->
        launch {
            for (order in orders) {
                println("Waiter #$id is handling order: $order")
                delay(1000) // Working hard
            }
        }
    }

    // 2. Send work
    launch {
        for (i in 1..10) {
            orders.send("Table $i")
        }
        orders.close() // Close channel to stop workers
    }
}`;

// ——— Module 6: Select ———
const selectCode = `import kotlinx.coroutines.selects.select

fun main() = runBlocking {
    val fastServer = Channel<String>()
    val slowServer = Channel<String>()

    launch { delay(100); fastServer.send("Fast Response") }
    launch { delay(2000); slowServer.send("Slow Response") }

    val result = select<String> {
        fastServer.onReceive { response -> "Winner: $response" }
        slowServer.onReceive { response -> "Winner: $response" }
    }

    println(result)
}`;

// ——— Supplemental: Non-Blocking Magic ———
const nonBlockingCode = `import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun main() = runBlocking {
    val time = measureTimeMillis {
        val jobs = List(100) { i ->
            launch {
                delay(1000L)         // Option A: Suspend (thread free!)
                // Thread.sleep(1000L) // Option B: Block (thread frozen!)
                print(".")
            }
        }
        jobs.joinAll()
    }
    println("\\nCompleted in $time ms")
}`;

// ——— Supplemental: Async Trap (Sequential vs Parallel) ———
const asyncTrapCode = `import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun main() = runBlocking {
    // --- THE WRONG WAY (Sequential) ---
    val timeBad = measureTimeMillis {
        val user = getUser()
        val pic = getPic()
        println("Bad Way: Got \${user.name} and \${pic.url}")
    }
    println("Bad Way took: $timeBad ms\\n")

    // --- THE RIGHT WAY (Concurrent) ---
    val timeGood = measureTimeMillis {
        val userDeferred = async { getUser() }
        val picDeferred = async { getPic() }
        println("Good Way: Got \${userDeferred.await().name} and \${picDeferred.await().url}")
    }
    println("Good Way took: \$timeGood ms")
}

data class User(val name: String)
data class Pic(val url: String)

suspend fun getUser(): User { delay(1000); return User("Christian") }
suspend fun getPic(): Pic { delay(1000); return Pic("avatar.png") }`;

// ——— Supplemental: Scope & Hierarchy ———
const scopeHierarchyCode = `fun main() = runBlocking {
    val parentJob = launch {
        println("Parent: I am starting specific child tasks...")

        launch {
            repeat(10) { i ->
                println("   Child 1: working on chunk $i")
                delay(500)
            }
        }

        launch {
            println("   Child 2: I'm doing a long calculation...")
            delay(10000)
            println("   Child 2: I am done! (You won't see this)")
        }
    }

    delay(1500)
    println("Main: Cancelling the parent job!")
    parentJob.cancel()
    parentJob.join()
    println("Main: Everything is stopped.")
}`;

// ——— Challenge 1: Breakfast Chef starter ———
const challenge1Starter = `fun main() = runBlocking {
    // TODO: makeCoffee() - 1s, toastBread() - 2s, run sequentially
    // Bonus: print "Breakfast is ready!" when both done
}`;

// ——— Challenge 4: Barista starter ———
const challenge4Starter = `val channel = Channel<Int>(2) // capacity = 2
// Producer: 10 coffees, every 100ms
// Consumer: serve slowly, every 1000ms
// Print "Counter full, Barista waiting..." when buffer fills`;

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
          <li className={styles.breadcrumbCurrent}>Kotlin Coroutines</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className={styles.headerSection}>
        <div className="relative overflow-hidden rounded-2xl mb-8 border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/10 p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,240,0.25),transparent)]" />
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-300/90 bg-cyan-500/20 border border-cyan-400/30 mb-4">
                Zero to Hero
              </span>
              <Heading className={styles.title}>
                Kotlin Coroutines & Channels
              </Heading>
              <Text className={styles.subtitle}>
                From zero knowledge to expert. Master lightweight concurrency, <code className="text-white/90 bg-white/10 px-1 rounded">suspend</code>, <code className="text-white/90 bg-white/10 px-1 rounded">async</code>/<code className="text-white/90 bg-white/10 px-1 rounded">launch</code>, Dispatchers, cancellation, Channels, Fan-Out/Fan-In, and <code className="text-white/90 bg-white/10 px-1 rounded">select</code>—with real code and challenges.
              </Text>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">runBlocking & launch</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">async & await</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">Channels</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">select</span>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-xl aspect-[4/3] relative">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
                alt="Developer coding – Kotlin coroutines enable lightweight concurrency"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </div>
          </div>
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Core idea:</strong> A coroutine is like a <strong>lightweight thread</strong>. You can run 100,000+ coroutines on a single thread. Use <code className="text-white/90 bg-white/10 px-1 rounded">delay</code> to <strong>suspend</strong> (pause without blocking the thread); use <code className="text-white/90 bg-white/10 px-1 rounded">async</code> when you need a result back, <code className="text-white/90 bg-white/10 px-1 rounded">launch</code> for fire-and-forget.
          </Text>
        </div>
      </div>

      {/* Module 1: Foundations */}
      <FullscreenSection id="foundations" title="Module 1: The Foundations (Breaking Free from Threads)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                runBlocking, launch, and suspend
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>runBlocking</strong> bridges normal code into the coroutine world. <strong>launch</strong> starts a coroutine (fire-and-forget). <strong>delay</strong> suspends without blocking the thread—the thread can run other coroutines. That&apos;s the magic of &quot;suspend&quot;.
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80"
                alt="Code and concurrency – suspend vs block"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={foundationsCode} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 2: Async & Parallelism */}
      <FullscreenSection id="async-parallelism" title="Module 2: Async & Parallelism (Doing Things at Once)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                async, await, and Dispatchers
              </Heading>
              <Text className={styles.sectionDescription}>
                Use <strong>launch</strong> when you don&apos;t care about the result (fire & forget). Use <strong>async</strong> when you need a result (like a Promise/Future). <strong>await()</strong> gets the value. <strong>Dispatchers.IO</strong>, <strong>Default</strong>, and <strong>Main</strong> choose which thread pool runs the work.
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Parallel execution – async and await"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={asyncCode} language="kotlin" readOnly height={380} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 3: Context & Cancellation */}
      <FullscreenSection id="context-cancellation" title="Module 3: Context & Cancellation (Structured Concurrency)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Job lifecycle, cancel, and withContext
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>cancel()</strong> and <strong>cancelAndJoin()</strong> stop coroutines when they&apos;re no longer needed (e.g. user leaves the screen). Use <strong>isActive</strong> for cooperative cancellation. <strong>withContext</strong> switches threads safely (e.g. IO → Main for UI updates).
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80"
                alt="Control flow – cancellation and context switching"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={cancellationCode} language="kotlin" readOnly height={300} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 4: Channels */}
      <FullscreenSection id="channels" title="Module 4: Channels (Hot Pipes)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Channel&lt;T&gt;, send(), receive(), Producer/Consumer
              </Heading>
              <Text className={styles.sectionDescription}>
                A <strong>Channel</strong> is like a pipe: one coroutine <strong>send</strong>s items, another <strong>receive</strong>s. Producer/Consumer pattern. Buffered channels allow sending without immediately suspending until the buffer is full.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>Analogy:</strong> One coroutine puts a ball in one end; another takes it out the other end. <code className="text-white/90 bg-white/10 px-1 rounded">channel.close()</code> signals &quot;no more items.&quot;
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
                alt="Data flow and channels – producer consumer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={channelsCode} language="kotlin" readOnly height={360} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 5: Fan-Out & Fan-In */}
      <FullscreenSection id="fan-out-fan-in" title="Module 5: Advanced Channels (Fan-Out & Fan-In)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Fan-Out: one producer, many workers. Fan-In: many producers, one receiver.
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Fan-Out:</strong> One producer, many workers (load balancer). <strong>Fan-In:</strong> Many producers, one receiver (aggregator). Example: multiple workers consume from a single orders channel.
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                alt="Fan-out – multiple workers consuming from one channel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={fanOutCode} language="kotlin" readOnly height={360} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 6: Select */}
      <FullscreenSection id="select" title="Module 6: Select Expression (The Race)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                select, onReceive, racing channels
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>select</strong> waits for multiple options and picks <em>only the first</em> that is ready. Perfect for &quot;whichever API responds first wins&quot;—e.g. <code className="bg-white/10 px-1 rounded">fastServer.onReceive</code> vs <code className="bg-white/10 px-1 rounded">slowServer.onReceive</code>.
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48 mb-6">
              <Image
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                alt="Race condition – select picks the first ready channel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={selectCode} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Supplemental: Non-Blocking Magic */}
      <FullscreenSection id="non-blocking-magic" title="Supplemental: The Non-Blocking Magic (delay vs Thread.sleep)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Why delay is better than Thread.sleep
              </Heading>
              <Text className={styles.sectionDescription}>
                Run 100 coroutines: with <strong>delay(1000)</strong>, total time ≈ 1s (they suspend and share the thread). With <strong>Thread.sleep(1000)</strong>, each holds the thread—on a single-thread dispatcher you&apos;d wait ~100s. Always use <code className="bg-white/10 px-1 rounded">delay</code> in coroutines.
              </Text>
            </div>
            <CodeEditor code={nonBlockingCode} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Supplemental: Async Trap */}
      <FullscreenSection id="async-trap" title="Supplemental: The Async Trap (Sequential vs Parallel)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Don&apos;t await too early
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Bad:</strong> <code className="bg-white/10 px-1 rounded">getUser()</code> then <code className="bg-white/10 px-1 rounded">getPic()</code> — 2s total. <strong>Good:</strong> <code className="bg-white/10 px-1 rounded">async { getUser() }</code> and <code className="bg-white/10 px-1 rounded">async { getPic() }</code>, then <code className="bg-white/10 px-1 rounded">.await()</code> both — ~1s. Assign <code className="bg-white/10 px-1 rounded">async</code> to a variable first, then <code className="bg-white/10 px-1 rounded">.await()</code> when you need the data.
              </Text>
            </div>
            <CodeEditor code={asyncTrapCode} language="kotlin" readOnly height={400} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Supplemental: Scope & Hierarchy */}
      <FullscreenSection id="scope-hierarchy" title="Supplemental: Scope & Hierarchy (Parent-Child Rule)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Structured concurrency: cancel parent → children stop
              </Heading>
              <Text className={styles.sectionDescription}>
                If a parent job is cancelled, all child coroutines are cancelled. You don&apos;t track children manually—this avoids leaks and ensures clean shutdown.
              </Text>
            </div>
            <CodeEditor code={scopeHierarchyCode} language="kotlin" readOnly height={360} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Challenges */}
      <FullscreenSection id="challenges" title="Challenges: Prove You Dominated the Concepts" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <Text className={styles.sectionDescription}>
              Try these in IntelliJ or Android Studio. Use <code className="bg-white/10 px-1 rounded">runBlocking</code>, <code className="bg-white/10 px-1 rounded">launch</code>, <code className="bg-white/10 px-1 rounded">async</code>/<code className="bg-white/10 px-1 rounded">await</code>, <code className="bg-white/10 px-1 rounded">Channel</code>, and <code className="bg-white/10 px-1 rounded">select</code> as needed. Optional: run snippets in the Kotlin Playground.
            </Text>

            <div className="space-y-6">
              <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 1: The Breakfast Chef</Heading>
                <Text className={styles.infoText}>
                  1. <code>makeCoffee()</code> — 1s. 2. <code>toastBread()</code> — 2s. 3. Run them <strong>sequentially</strong> inside <code>runBlocking</code>. Bonus: print &quot;Breakfast is ready!&quot; when both are done.
                </Text>
                <CodeEditor code={challenge1Starter} language="kotlin" readOnly height={100} />
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 2: The Racer</Heading>
                <Text className={styles.infoText}>
                  <code>getFacebookLikes()</code> (3s) and <code>getTwitterFollowers()</code> (1s). Run in <strong>parallel</strong>, print total count. Constraint: total time ≈ 3s, not 4s.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 3: The Timeout</Heading>
                <Text className={styles.infoText}>
                  <code>downloadLargeFile()</code> prints &quot;Downloading %&quot; every 500ms for 10s. Wrap with <code>withTimeoutOrNull(2000)</code>. Stop cleanly after 2s and print &quot;Download timed out, retrying...&quot;
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 4: The Barista</Heading>
                <Text className={styles.infoText}>
                  <code>Channel&lt;Int&gt;</code> capacity 2. Producer: 10 coffees every 100ms. Consumer: serve every 1000ms. When buffer fills, producer suspends—print &quot;Counter full, Barista waiting...&quot;
                </Text>
                <CodeEditor code={challenge4Starter} language="kotlin" readOnly height={80} />
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 5: The Search Engine (Fan-In)</Heading>
                <Text className={styles.infoText}>
                  Launch <code>searchGoogle()</code>, <code>searchBing()</code>, <code>searchYahoo()</code>. Each sends results into a <strong>single</strong> channel. Main prints &quot;Found in Google&quot;, &quot;Found in Bing&quot;, etc. as they arrive.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 6: The Fastest Server</Heading>
                <Text className={styles.infoText}>
                  <code>getUSServer()</code> and <code>getEUServer()</code> (random delay 1–3s each). Use <code>select</code> to return whichever responds first. Optionally cancel the other.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🔥 Challenge 1.5: The Retry Mechanism</Heading>
                <Text className={styles.infoText}>
                  <code>unstableNetworkCall()</code>: fails 80%, succeeds 20%, 500ms. Implement <code>retryWithBackoff</code>: try block, on failure wait 1s then retry; then 2s; max 3 retries. Get &quot;Success!&quot;
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
                <Heading level={3} className="mb-2 text-white font-semibold">🏆 Final Capstone: Real-Time Stock Monitor</Heading>
                <Text className={styles.infoText}>
                  <code>StockPrice(symbol, price)</code>. Producer: emit &quot;TSLA&quot; every 500ms, &quot;AAPL&quot; every 200ms (random prices). Processor: filter out price changes &lt; $1. Consumer: print alerts. Timeout: shutdown after 10s.
                </Text>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <ButtonLink
                href={createLocalizedPath("/developer-section/kotlin-playground")}
                variant="secondary"
                className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
              >
                Open Kotlin Playground
              </ButtonLink>
              <ButtonLink
                href={createLocalizedPath("/developer-section/challenges/typescript-kotlin")}
                variant="secondary"
                className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
              >
                TypeScript & Kotlin Challenges
              </ButtonLink>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-12`}>
        <Text className={styles.infoText}>
          You now have the foundations, async parallelism, cancellation, channels, fan-out/fan-in, and <strong>select</strong>. Practice with the challenges, then build something reactive—e.g. a real-time dashboard or a resilient API client with retries.
        </Text>
      </div>

      <div className={styles.navigation}>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-70 font-normal">{t("nav-blog")}</span>
              <span className="font-semibold">{t("blog-back-blog")}</span>
            </span>
          </span>
        </ButtonLink>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/spring-reactive-kotlin")}>
          <span className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
              <span className="font-semibold">Spring Reactive (Project Reactor)</span>
            </span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}
