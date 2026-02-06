"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks ---
// --- Coroutines basics (official guide) ---
const basicsSuspendCode = [
  "suspend fun greet() {",
  "    println(\"Hello world from a suspending function\")",
  "}",
  "",
  "suspend fun main() {",
  "    showUserInfo()",
  "}",
  "",
  "suspend fun showUserInfo() {",
  "    println(\"Loading user...\")",
  "    greet()",
  "    println(\"User: John Smith\")",
  "}",
].join("\n");

const basicsWithContextLaunchCode = [
  "import kotlinx.coroutines.*",
  "import kotlin.time.Duration.Companion.seconds",
  "",
  "suspend fun greet() {",
  "    println(\"The greet() on the thread: ${Thread.currentThread().name}\")",
  "    delay(1.seconds)",
  "}",
  "",
  "suspend fun main() {",
  "    withContext(Dispatchers.Default) { // this: CoroutineScope",
  "        this.launch { greet() }",
  "        this.launch {",
  "            println(\"The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}\")",
  "            delay(1.seconds)",
  "        }",
  "        println(\"The withContext() on the thread: ${Thread.currentThread().name}\")",
  "    }",
  "}",
].join("\n");

const basicsCoroutineScopeCode = [
  "import kotlinx.coroutines.*",
  "import kotlin.time.Duration.Companion.seconds",
  "",
  "suspend fun main() {",
  "    coroutineScope { // this: CoroutineScope",
  "        this.launch {",
  "            this.launch {",
  "                delay(2.seconds)",
  "                println(\"Child of the enclosing coroutine completed\")",
  "            }",
  "            println(\"Child coroutine 1 completed\")",
  "        }",
  "        this.launch {",
  "            delay(1.seconds)",
  "            println(\"Child coroutine 2 completed\")",
  "        }",
  "    }",
  "    println(\"Coroutine scope completed\")",
  "}",
].join("\n");

const basicsRunBlockingCode = [
  "// Use runBlocking() only when bridging from non-suspending code",
  "object MyRepository : Repository {",
  "    override fun readItem(): Int = runBlocking { myReadItem() }",
  "}",
  "suspend fun myReadItem(): Int { delay(100); return 4 }",
].join("\n");

const basics50kCoroutinesCode = [
  "import kotlinx.coroutines.*",
  "import kotlin.time.Duration.Companion.seconds",
  "",
  "suspend fun printPeriods() = coroutineScope {",
  "    repeat(50_000) {",
  "        this.launch {",
  "            delay(5.seconds)",
  "            print(\".\")",
  "        }",
  "    }",
  "}",
].join("\n");

const basics50kThreadsCode = [
  "import kotlin.concurrent.thread",
  "",
  "fun main() {",
  "    repeat(50_000) {",
  "        thread {",
  "            Thread.sleep(5000L)",
  "            print(\".\")",
  "        }",
  "    }",
  "}",
].join("\n");

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

// --- Solution code for each challenge ---
const solution1Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    launch {",
  "        makeCoffee()",
  "        toastBread()",
  "        println(\"Breakfast is ready!\")",
  "    }.join()",
  "}",
  "",
  "suspend fun makeCoffee() {",
  "    println(\"Making coffee...\")",
  "    delay(1000L)",
  "    println(\"Coffee done!\")",
  "}",
  "",
  "suspend fun toastBread() {",
  "    println(\"Toasting bread...\")",
  "    delay(2000L)",
  "    println(\"Toast done!\")",
  "}",
].join("\n");

const solution2Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    val time = kotlin.system.measureTimeMillis {",
  "        val likes = async { getFacebookLikes() }",
  "        val followers = async { getTwitterFollowers() }",
  "        val total = likes.await() + followers.await()",
  "        println(\"Total: $total (Facebook + Twitter)\")",
  "    }",
  "    println(\"Completed in $time ms\") // ~3000ms",
  "}",
  "",
  "suspend fun getFacebookLikes(): Int { delay(3000); return 1000 }",
  "suspend fun getTwitterFollowers(): Int { delay(1000); return 500 }",
].join("\n");

const solution3Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    val result = withTimeoutOrNull(2000) {",
  "        downloadLargeFile()",
  "        \"done\"",
  "    }",
  "    if (result == null) println(\"Download timed out, retrying...\")",
  "}",
  "",
  "suspend fun downloadLargeFile() {",
  "    repeat(20) { i ->",
  "        println(\"Downloading ${i * 5}%\")",
  "        delay(500)",
  "    }",
  "}",
].join("\n");

const solution4Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    val channel = Channel<Int>(capacity = 2)",
  "    launch {",
  "        repeat(10) { i ->",
  "            if (channel.isClosedForSend) return@repeat",
  "            delay(100)",
  "            println(\"Barista made coffee #${i + 1}\")",
  "            channel.send(i + 1)",
  "        }",
  "        channel.close()",
  "    }",
  "    launch {",
  "        for (coffee in channel) {",
  "            println(\"Serving coffee #$coffee... (counter can fill up)\")",
  "            delay(1000)",
  "        }",
  "    }",
  "}",
].join("\n");

const solution5Code = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    val results = Channel<String>()",
  "    launch {",
  "        coroutineScope {",
  "            launch { searchGoogle(results) }",
  "            launch { searchBing(results) }",
  "            launch { searchYahoo(results) }",
  "        }",
  "        results.close()",
  "    }",
  "    for (msg in results) println(msg)",
  "}",
  "",
  "suspend fun searchGoogle(ch: Channel<String>) {",
  "    delay(500); ch.send(\"Found in Google\")",
  "}",
  "suspend fun searchBing(ch: Channel<String>) {",
  "    delay(800); ch.send(\"Found in Bing\")",
  "}",
  "suspend fun searchYahoo(ch: Channel<String>) {",
  "    delay(300); ch.send(\"Found in Yahoo\")",
  "}",
].join("\n");

const solution6Code = [
  "import kotlinx.coroutines.*",
  "import kotlinx.coroutines.selects.select",
  "",
  "fun main() = runBlocking {",
  "    val us = async { getUSServer() }",
  "    val eu = async { getEUServer() }",
  "    val first = select<String> {",
  "        us.onAwait { it }",
  "        eu.onAwait { it }",
  "    }",
  "    println(\"Fastest: $first\")",
  "}",
  "",
  "suspend fun getUSServer(): String {",
  "    delay((1000..3000).random().toLong())",
  "    return \"US: 42ms\"",
  "}",
  "suspend fun getEUServer(): String {",
  "    delay((1000..3000).random().toLong())",
  "    return \"EU: 38ms\"",
  "}",
].join("\n");

const solutionRetryCode = [
  "import kotlinx.coroutines.*",
  "",
  "fun main() = runBlocking {",
  "    val result = retryWithBackoff(maxRetries = 3) {",
  "        unstableNetworkCall()",
  "    }",
  "    println(result)",
  "}",
  "",
  "suspend fun unstableNetworkCall(): String {",
  "    delay(500)",
  "    if (kotlin.random.Random.nextDouble() < 0.8) throw RuntimeException(\"Network error\")",
  "    return \"Success!\"",
  "}",
  "",
  "suspend fun <T> retryWithBackoff(maxRetries: Int, block: suspend () -> T): T {",
  "    var delayMs = 1000L",
  "    repeat(maxRetries) { attempt ->",
  "        try { return block() }",
  "        catch (e: Exception) {",
  "            if (attempt == maxRetries - 1) throw e",
  "            delay(delayMs)",
  "            delayMs *= 2",
  "        }",
  "    }",
  "    return block()",
  "}",
].join("\n");

const solutionCapstoneCode = [
  "import kotlinx.coroutines.*",
  "import kotlinx.coroutines.channels.Channel",
  "",
  "data class StockPrice(val symbol: String, val price: Double)",
  "",
  "fun main() = runBlocking {",
  "    val alerts = Channel<StockPrice>(Channel.UNLIMITED)",
  "    val scope = CoroutineScope(Dispatchers.Default)",
  "    scope.launch {",
  "        withTimeout(10000) {",
  "            launch { emitPrices(\"TSLA\", 500, alerts) }",
  "            launch { emitPrices(\"AAPL\", 200, alerts) }",
  "            launch {",
  "                var last = 0.0",
  "                for (sp in alerts) {",
  "                    if (kotlin.math.abs(sp.price - last) >= 1.0) {",
  "                        println(\"Alert: ${sp.symbol} = ${sp.price}\")",
  "                        last = sp.price",
  "                    }",
  "                }",
  "            }",
  "        }",
  "    }.join()",
  "    println(\"System shut down after 10s\")",
  "}",
  "",
  "suspend fun emitPrices(symbol: String, intervalMs: Long, ch: Channel<StockPrice>) {",
  "    while (true) {",
  "        val price = (100..500).random().toDouble()",
  "        ch.send(StockPrice(symbol, price))",
  "        delay(intervalMs)",
  "    }",
  "}",
].join("\n");

export default function KotlinCoroutinesPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());

  const toggleSolution = (id: string) => {
    setVisibleSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          Kotlin provides only minimal low-level APIs in its standard library; <strong>async</strong> and <strong>await</strong> are not keywords and are not part of the standard library. <strong>kotlinx.coroutines</strong> is the rich library (launch, async, and more). Kotlin&apos;s <strong>suspending functions</strong> give you a safer, less error-prone abstraction than futures and promises. This guide covers the core features with examples—from basics to channels and select.
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
            <strong>Dependency:</strong> Add <code>kotlinx-coroutines-core</code> (see the project README). On Android, add <code>kotlinx-coroutines-android</code>. <strong>Course structure:</strong> 6 modules + bridge examples + capstone. Each module has a Concept, a Code Example, and a Challenge. Start with Module 1, copy the code into IntelliJ or Android Studio, and try the challenges.
          </Text>
        </div>
      </div>

      {/* Zero to hero: What & Why + Table of contents */}
      <section id="what-why" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              What are Kotlin Coroutines?
            </Heading>
            <Text className={styles.sectionDescription}>
              To create applications that perform <strong>multiple tasks at once</strong> (concurrency), Kotlin uses <strong>coroutines</strong>. A coroutine is a <strong>suspendable computation</strong> that lets you write concurrent code in a clear, sequential style. Coroutines can run concurrently with other coroutines and potentially in parallel.
            </Text>
            <Text className={styles.sectionDescription}>
              On the JVM and in Kotlin/Native, all concurrent code runs on <strong>threads</strong>, managed by the OS. Coroutines can <strong>suspend</strong> their execution instead of blocking a thread. One coroutine can suspend while waiting for data while another runs on the same thread—effective resource utilization.
            </Text>
            <div className={styles.conceptImage} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.5rem" }}>
              <Image src="/images/portfolio/parallelism-and-concurrency.svg" alt="Parallelism and concurrency" width={350} height={220} style={{ maxWidth: "100%", width: "auto", height: "auto" }} />
              <Image src="/images/portfolio/coroutines-and-threads.svg" alt="Coroutines and threads" width={350} height={188} style={{ maxWidth: "100%", width: "auto", height: "auto" }} />
            </div>
            <Text className={styles.sectionDescription}>
              Unlike many other languages, <strong>async</strong> and <strong>await</strong> are not keywords in Kotlin; the <strong>suspend</strong> abstraction is safer and less error-prone than futures and promises. Think of coroutines as lightweight threads: you can run many of them without the overhead of real threads—they suspend instead of block.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              Why use them?
            </Heading>
            <Text className={styles.sectionDescription}>
              On Android and in backend services, blocking the main or worker thread is a sin. Network calls, file I/O, and database access must not block. Coroutines let you write clear, linear code that runs efficiently: start a network request, suspend until the result arrives, then continue—all without callbacks or complex threading.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              Suspending functions
            </Heading>
            <Text className={styles.sectionDescription}>
              The most basic building block of coroutines is the <strong>suspending function</strong>. It allows a running operation to pause and resume later without affecting the structure of your code. Declare it with the <code>suspend</code> keyword. You can only call a suspending function from another suspending function. To call suspending functions at the entry point, mark <code>main()</code> with <code>suspend</code> (or use <code>runBlocking()</code> when integrating with non-suspending code).
            </Text>
            <CodeEditor code={basicsSuspendCode} language="kotlin" readOnly height={220} />
            <Text className={styles.sectionDescription}>
              While <code>suspend</code> is part of the core Kotlin language, most coroutine features come from the <strong>kotlinx.coroutines</strong> library. Add the dependency: <code>implementation(&quot;org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2&quot;)</code> (Gradle Kotlin DSL). On Android, add <code>kotlinx-coroutines-android</code>.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              Table of contents (aligned with the official guide)
            </Heading>
            <Text className={styles.sectionDescription}>
              This course maps to the core topics of the Kotlin Coroutines guide so you cover the best:
            </Text>
            <ul className={styles.sectionDescription} style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li><strong>Coroutines basics</strong> → Module 1 (runBlocking, launch, suspend)</li>
              <li><strong>Tutorial: Intro to coroutines and channels</strong> → Modules 1–4</li>
              <li><strong>Cancellation and timeouts</strong> → Module 3 (cancel, withTimeoutOrNull)</li>
              <li><strong>Composing suspending functions</strong> → Module 2, Example B (async/await)</li>
              <li><strong>Coroutine context and dispatchers</strong> → Modules 2 & 3 (Dispatchers.IO, Default)</li>
              <li><strong>Asynchronous Flow</strong> → Capstone uses channels; Flow is the next step (see references)</li>
              <li><strong>Channels</strong> → Modules 4 & 5 (producer/consumer, fan-out, fan-in)</li>
              <li><strong>Coroutine exceptions handling</strong> → Challenge 1.5 (retry with backoff)</li>
              <li><strong>Shared mutable state and concurrency</strong> → See official guide &amp; Android best practices</li>
              <li><strong>Select expression (experimental)</strong> → Module 6</li>
              <li><strong>Debug coroutines / Debug Flow</strong> → IntelliJ IDEA tutorials (see references)</li>
            </ul>
            <Heading level={3} className={styles.sectionTitle}>
              Prerequisites
            </Heading>
            <Text className={styles.sectionDescription}>
              Basic Kotlin (functions, lambdas, <code>suspend</code> keyword). You need a Kotlin project with <code>kotlinx-coroutines-core</code> (and on Android, <code>kotlinx-coroutines-android</code>). Use IntelliJ IDEA or Android Studio to run the examples.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              How to use this guide
            </Heading>
            <Text className={styles.sectionDescription}>
              Work through the modules in order. For each challenge, try to solve it yourself first; when you&apos;re stuck or want to compare, use the <strong>See solution</strong> button to reveal a reference solution. Copy and run code in your IDE to build muscle memory.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Module 1 */}
      <section id="module-1-foundations" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 1: Coroutines basics (Foundations)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Understand what a coroutine is, how to start one, and the magic of <code>suspend</code>. To create a coroutine you need: a <strong>suspending function</strong>, a <strong>coroutine scope</strong> (e.g. <code>withContext()</code>), a <strong>builder</strong> like <code>CoroutineScope.launch()</code>, and a <strong>dispatcher</strong> to control which threads are used.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              First coroutines: withContext + launch
            </Heading>
            <Text className={styles.sectionDescription}>
              <code>withContext(Dispatchers.Default)</code> defines a non-blocking entry point on a shared thread pool. Coroutines launched inside share the same scope (structured concurrency). <code>this.launch { }</code> starts a child coroutine; the explicit <code>this</code> highlights that <code>launch</code> is an extension on <code>CoroutineScope</code>.
            </Text>
            <CodeEditor code={basicsWithContextLaunchCode} language="kotlin" readOnly height={320} />
            <Heading level={3} className={styles.sectionTitle}>
              Coroutine scope and structured concurrency
            </Heading>
            <Text className={styles.sectionDescription}>
              Coroutines form a <strong>tree hierarchy</strong> of parent and child tasks. A parent waits for its children to complete; if the parent is cancelled, all children are recursively cancelled. Use <code>coroutineScope { }</code> to create a new scope—it runs the block and waits until the block and any coroutines launched in it complete. No dispatcher specified? Builders inherit the current context or use <code>Dispatchers.Default</code>.
            </Text>
            <CodeEditor code={basicsCoroutineScopeCode} language="kotlin" readOnly height={340} />
            <Heading level={3} className={styles.sectionTitle}>
              Coroutine builders
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>CoroutineScope.launch()</strong> — starts a coroutine without blocking; use when you don&apos;t need a result (fire and forget). Returns a <code>Job</code>. <strong>CoroutineScope.async()</strong> — starts a concurrent computation and returns a <code>Deferred</code>; use <code>.await()</code> to get the result. <strong>runBlocking()</strong> — blocks the current thread until the scope finishes; use only when bridging from non-suspending code (e.g. a third-party interface you can&apos;t change).
            </Text>
            <CodeEditor code={basicsRunBlockingCode} language="kotlin" readOnly height={140} />
            <Heading level={3} className={styles.sectionTitle}>
              runBlocking + launch (bridge from main)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Concepts:</strong> <code>runBlocking</code> vs <code>launch</code>, suspend functions (the &quot;pause&quot; button), and the difference between blocking and suspending. The thread is not blocked when you suspend—it can do other work.
            </Text>
            <div className={styles.conceptImage}>
              <Image src="https://kotlinlang.org/docs/images/get-started-coroutines.svg" alt="Kotlin coroutines: get started" width={400} height={200} style={{ maxWidth: "100%", width: "auto", height: "auto" }} />
            </div>
            <CodeEditor code={module1Code} language="kotlin" readOnly height={320} />
            <Heading level={3} className={styles.sectionTitle}>
              Coroutine dispatchers
            </Heading>
            <Text className={styles.sectionDescription}>
              A <strong>dispatcher</strong> controls which thread or thread pool a coroutine uses. Coroutines can pause on one thread and resume on another. By default, coroutines inherit the dispatcher from their parent scope; if none is set, builders use <code>Dispatchers.Default</code> (shared pool, ideal for CPU-intensive work). Pass a dispatcher to the builder: <code>launch(Dispatchers.Default) { }</code> or run a block with <code>withContext(Dispatchers.Default) { }</code>. See Module 2 &amp; 3 for <code>Dispatchers.IO</code> and <code>Dispatchers.Main</code>.
            </Text>
            <Heading level={3} className={styles.sectionTitle}>
              Comparing coroutines and JVM threads
            </Heading>
            <Text className={styles.sectionDescription}>
              A <strong>thread</strong> is managed by the OS; threads can run in parallel on multiple cores but are resource-intensive (each needs memory for its stack; the JVM typically handles only a few thousand). A <strong>coroutine</strong> is not bound to a specific thread—it can suspend on one and resume on another, so many coroutines share the same thread pool. When a coroutine suspends, the thread is free for other work. That makes coroutines much lighter: you can run millions in one process. Example: 50,000 coroutines each waiting 5 seconds then printing a period:
            </Text>
            <CodeEditor code={basics50kCoroutinesCode} language="kotlin" readOnly height={200} />
            <Text className={styles.sectionDescription}>
              The same with JVM threads uses far more memory (up to ~100 GB for 50k threads vs ~500 MB for 50k coroutines). The thread version may throw out-of-memory or slow down; the coroutine version runs fine.
            </Text>
            <CodeEditor code={basics50kThreadsCode} language="kotlin" readOnly height={160} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>What&apos;s next:</strong> Composing suspending functions (Module 2), Cancellation and timeouts (Module 3), Coroutine context and dispatchers (Modules 2 &amp; 3), Asynchronous Flow (see Additional references).
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 1: The Breakfast Chef</strong> — Write a program that simulates making breakfast. Create <code>makeCoffee()</code> (1 second) and <code>toastBread()</code> (2 seconds). Launch them sequentially inside <code>runBlocking</code>. Bonus: print &quot;Breakfast is ready!&quot; only after both are done.
              </Text>
            </div>
            <button
              type="button"
              onClick={() => toggleSolution("ch1")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch1")}
            >
              {visibleSolutions.has("ch1") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch1") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution1Code} language="kotlin" readOnly height={280} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch2")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch2")}
            >
              {visibleSolutions.has("ch2") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch2") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution2Code} language="kotlin" readOnly height={260} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch3")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch3")}
            >
              {visibleSolutions.has("ch3") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch3") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution3Code} language="kotlin" readOnly height={280} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch4")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch4")}
            >
              {visibleSolutions.has("ch4") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch4") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution4Code} language="kotlin" readOnly height={320} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch5")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch5")}
            >
              {visibleSolutions.has("ch5") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch5") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution5Code} language="kotlin" readOnly height={320} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch6")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch6")}
            >
              {visibleSolutions.has("ch6") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch6") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solution6Code} language="kotlin" readOnly height={320} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("ch-retry")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("ch-retry")}
            >
              {visibleSolutions.has("ch-retry") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("ch-retry") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solutionRetryCode} language="kotlin" readOnly height={340} />
              </div>
            )}
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
            <button
              type="button"
              onClick={() => toggleSolution("capstone")}
              className={styles.answerKeyToggle}
              aria-expanded={visibleSolutions.has("capstone")}
            >
              {visibleSolutions.has("capstone") ? t("hide-solution") : t("see-solution")}
            </button>
            {visibleSolutions.has("capstone") && (
              <div className={styles.solutionBlock}>
                <Text className={styles.sectionDescription}><strong>Solution:</strong></Text>
                <CodeEditor code={solutionCapstoneCode} language="kotlin" readOnly height={380} />
              </div>
            )}
          </Stack>
        </Card>
      </section>

      {/* Additional references (official guide) */}
      <section id="additional-references" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Additional references
            </Heading>
            <Text className={styles.sectionDescription}>
              Official Kotlin Coroutines guide and related resources (edit date: 22 April 2025):
            </Text>
            <ul className={styles.sectionDescription} style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li><a href="https://kotlinlang.org/docs/jvm/coroutines-guide.html" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Guide to UI programming with coroutines</a></li>
              <li><a href="https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Coroutines design document (KEEP)</a></li>
              <li><a href="https://kotlinlang.org/api/kotlinx.coroutines/" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Full kotlinx.coroutines API reference</a></li>
              <li><a href="https://developer.android.com/kotlin/coroutines/coroutines-best-practices" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Best practices for coroutines in Android</a></li>
              <li><a href="https://developer.android.com/kotlin/coroutines" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Additional Android resources for Kotlin coroutines and Flow</a></li>
              <li><a href="https://kotlinlang.org/docs/coroutines-guide.html" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Official Coroutines guide (kotlinlang.org)</a></li>
            </ul>
            <Text className={styles.sectionDescription}>
              Tutorials: <a href="https://kotlinlang.org/docs/jvm/debug-coroutines-with-ide.html" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Debug coroutines using IntelliJ IDEA</a>, <a href="https://kotlinlang.org/docs/jvm/debug-flow-with-ide.html" target="_blank" rel="noopener noreferrer" className="underline text-purple-300 hover:text-purple-200">Debug Kotlin Flow using IntelliJ IDEA</a>.
            </Text>
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
