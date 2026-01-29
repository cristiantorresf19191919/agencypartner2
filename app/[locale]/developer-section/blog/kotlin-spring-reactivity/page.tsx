"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Module 1: Reactive Mindset ---
const module1MonoCode = [
  "import reactor.core.publisher.Mono",
  "import reactor.kotlin.core.publisher.toMono",
  "",
  "fun main() {",
  "    val simpleMono: Mono<String> = Mono.just(\"Hello World\")",
  "    val name = \"Christian\"",
  "    val kotlinMono: Mono<String> = name.toMono()",
  "    val safeMono = Mono.justOrEmpty(null as String?)",
  "    simpleMono.subscribe { println(it) }",
  "}",
].join("\n");

const module1BadCode = [
  "// BAD (Imperative): This just defines a recipe — it doesn't run!",
  "fun updateData() {",
  "    Mono.just(\"New Data\")",
  "        .map { it.uppercase() }",
  "        .doOnNext { println(it) }  // Nothing is printed — no subscribe!",
  "}",
].join("\n");

const module1GoodCode = [
  "// GOOD (Reactive): Subscribe executes the pipeline",
  "fun updateData() {",
  "    Mono.just(\"New Data\")",
  "        .map { it.uppercase() }",
  "        .subscribe { println(it) }  // Now the pipeline runs",
  "}",
].join("\n");

const module2FluxCode = [
  "import reactor.core.publisher.Flux",
  "",
  "val numbersFlux: Flux<Int> = Flux.just(1, 2, 3, 4, 5)",
  "val productFlux = Flux.fromIterable(listOf(\"TV\", \"Phone\", \"Laptop\"))",
  "productFlux.map { it.uppercase() }.filter { it.length > 2 }.subscribe { println(it) }",
].join("\n");

const module2MapVsFlatMapCode = [
  "// map = synchronous transformation (value in, value out)",
  "val parsedIds: Flux<Int> = Flux.just(\"1\", \"2\", \"3\").map { it.toInt() }",
  "",
  "// flatMap = async transformation (e.g. DB call returns Mono/Flux)",
  "val users: Flux<User> = Flux.just(\"1\", \"2\", \"3\")",
  "    .flatMap { id -> userRepository.findById(id) }",
].join("\n");

const module2ZipCode = [
  "// zip: run all sources in parallel, combine when all complete",
  "fun getDashboard(userId: String): Mono<UserDashboard> {",
  "    return Mono.zip(",
  "        userService.findById(userId),",
  "        orderService.getRecentOrder(userId),",
  "        creditService.getBalance(userId)",
  "    ).map { tuple ->",
  "        UserDashboard(tuple.t1, tuple.t2, tuple.t3)",
  "    }",
  "}",
].join("\n");

const module2SchedulersCode = [
  "// Event-loop thread must never block. Offload blocking work:",
  "fun callLegacySystem(): Mono<String> {",
  "    return Mono.fromCallable { legacyBlockingCall() }",
  "        .subscribeOn(Schedulers.boundedElastic())",
  "}",
  "",
  "// subscribeOn = where the SOURCE runs",
  "// publishOn = where operators AFTER it run",
].join("\n");

// --- Module 3: WebFlux Functional Routing ---
const module3RouterCode = [
  "@Configuration",
  "class OrderRouter {",
  "    @Bean",
  "    fun route(handler: OrderHandler): RouterFunction<ServerResponse> =",
  "        RouterFunctions",
  "            .route(GET(\"/orders/{id}\"), handler::getOrder)",
  "            .andRoute(GET(\"/orders\").and(accept(APPLICATION_JSON)), handler::listOrders)",
  "}",
].join("\n");

const module3HandlerCode = [
  "@Component",
  "class OrderHandler(private val orderService: OrderService) {",
  "    fun getOrder(request: ServerRequest): Mono<ServerResponse> {",
  "        val id = request.pathVariable(\"id\")",
  "        return ServerResponse.ok()",
  "            .body(orderService.findById(id), Order::class.java)",
  "    }",
  "}",
].join("\n");

// --- Module 4: Reactive Data Layer ---
const module4R2dbcRepoCode = [
  "@Repository",
  "interface ProductRepository : ReactiveSortingRepository<Product, Long> {",
  "    fun findByCategory(category: String): Flux<Product>",
  "}",
].join("\n");

const module4MongoRepoCode = [
  "interface OrderRepository : ReactiveMongoRepository<Order, String> {",
  "    @Tailable",
  "    fun findByStatus(status: String): Flux<Order>",
  "}",
].join("\n");

const module4TransactionCode = [
  "@Service",
  "class InventoryService(private val repository: ProductRepository) {",
  "    @Transactional",
  "    fun updateStock(id: Long, quantity: Int): Mono<Void> {",
  "        return repository.findById(id)",
  "            .flatMap { p ->",
  "                p.stock = p.stock - quantity",
  "                repository.save(p)",
  "            }",
  "            .then()",
  "    }",
  "}",
].join("\n");

const module4N1BadCode = [
  "// BAD: .block() kills the event loop — sequential, blocking",
  "fun getOrdersBad(): Flux<OrderDTO> {",
  "    return orderRepository.findAll()",
  "        .map { order ->",
  "            val user = userRepository.findById(order.userId).block()!!",
  "            OrderDTO(order, user)",
  "        }",
  "}",
].join("\n");

const module4N1GoodCode = [
  "// GOOD: flatMap keeps everything non-blocking and concurrent",
  "fun getOrdersGood(): Flux<OrderDTO> {",
  "    return orderRepository.findAll()",
  "        .flatMap { order ->",
  "            userRepository.findById(order.userId)",
  "                .map { user -> OrderDTO(order, user) }",
  "        }",
  "}",
].join("\n");

// --- Challenge starters (editable) ---
const challenge1GhostStarter = [
  "// Challenge 1: The Ghost Subscriber",
  "// Fix so \"Saving user...\" actually appears. (Hint: subscribe!)",
  "",
  "fun processUser(id: String) {",
  "    val userMono = Mono.just(\"Engineer_User\")",
  "        .doOnNext { name -> println(\"Processing: $name\") }",
  "    userMono.map { name -> \"Saved: $name\" }",
  "    // TODO: Make the pipeline execute and log \"Saving user...\"",
  "}",
].join("\n");

const challenge2ConcurrencyStarter = [
  "// Challenge 2: Concurrency Bottleneck",
  "// 1. Flux of IDs: \"p1\", \"p2\", \"p3\"",
  "// 2. Call productService.getDetails(id) for each (returns Mono<Product>)",
  "// 3. Collect into a list and print",
  "",
  "val ids = Flux.just(\"p1\", \"p2\", \"p3\")",
  "// Your code: flatMap -> getDetails -> collectList -> subscribe(println)",
].join("\n");

const challenge3SequentialParallelStarter = [
  "// Challenge 3: Sequential vs Parallel",
  "// 10 OrderIDs — fetch Order for each.",
  "// (1) Sequential: concatMap — one by one",
  "// (2) Concurrent: flatMap — in parallel",
  "// If each DB call takes 100ms, total time?",
  "",
  "val orderIds = Flux.range(1, 10).map { \"order-$it\" }",
  "// Sequential: orderIds.concatMap { id -> orderRepo.findById(id) }",
  "// Parallel:   orderIds.flatMap { id -> orderRepo.findById(id) }",
].join("\n");

const challenge4ZipRefactorStarter = [
  "// Challenge 4: Zip Refactor",
  "// Run product + reviews in PARALLEL (zip), not sequential (flatMap).",
  "",
  "fun getDetails(id: String): Mono<ProductDetails> {",
  "    return productRepo.findById(id)",
  "        .flatMap { product ->",
  "            reviewRepo.findAllByProductId(id).collectList()",
  "                .map { reviews -> ProductDetails(product, reviews) }",
  "        }",
  "}",
  "// Refactor to: Mono.zip(productRepo.findById(id), reviewRepo.findAllByProductId(id).collectList())",
  "//             .map { (product, reviews) -> ProductDetails(product, reviews) }",
].join("\n");

const challenge5RateLimiterStarter = [
  "// Challenge 5: Smart Rate Limiter",
  "// 100 request IDs; call dependencyService.call(id); max 5 concurrent.",
  "// Bonus: retry 3 times with exponential backoff (1s) on failure.",
  "",
  "Flux.range(1, 100)",
  "    .flatMap({ id -> dependencyService.call(id) }, 5)  // concurrency = 5",
  "    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))",
].join("\n");

const challenge6MultiSourceStarter = [
  "// Challenge 6: Multi-Source Aggregator (Postgres + Mongo)",
  "// User in Postgres, Preferences in Mongo. Fetch BOTH in parallel.",
  "// If user not in Postgres -> UserNotFoundException",
  "// If prefs not in Mongo -> default preferences",
  "",
  "fun getProfile(userId: String): Mono<FullProfile> {",
  "    val user = postgresRepo.findUserById(userId)",
  "        .switchIfEmpty(Mono.error(UserNotFoundException(userId)))",
  "    val prefs = mongoRepo.findPreferences(userId).defaultIfEmpty(DefaultPreferences())",
  "    return Mono.zip(user, prefs).map { (u, p) -> FullProfile(u, p) }",
  "}",
].join("\n");

const challenge7AntiPatternStarter = [
  "// Challenge 7: Anti-Pattern Hunt — fix the 3 reactive sins",
  "// A: .block() — kills event loop",
  "// B: Thread.sleep — blocks thread",
  "// C: subscribeOn(immediate()) — wrong scheduler",
  "",
  "fun processOrders(): Flux<OrderResponse> {",
  "    return orderRepository.findAll()",
  "        .flatMap { order ->",
  "            userRepository.findById(order.userId)",
  "                .map { user -> OrderResponse(order, user) }",
  "        }",
  "    // Remove .block(), Thread.sleep, use boundedElastic if you had blocking",
  "}",
].join("\n");

const challengeSseCode = [
  "// GET /logs/stream — SSE from MongoDB @Tailable cursor + heartbeat every 2s",
  "@Bean",
  "fun logStreamRoute(handler: LogStreamHandler): RouterFunction<ServerResponse> =",
  "    RouterFunctions.route(GET(\"/logs/stream\"), handler::stream)",
  "",
  "// Handler: logRepo.findByStatus(\"ACTIVE\") is @Tailable Flux",
  "// Merge with Flux.interval(Duration.ofSeconds(2)).map { \"\" } for heartbeat",
  "// MediaType.TEXT_EVENT_STREAM",
].join("\n");

// --- Hybrid migration example ---
const hybridMigrationCode = [
  "// Postgres: users. Mongo: activity logs. Unified Flux.",
  "fun getFullAuditLog(): Flux<UserActivity> {",
  "    return postgresRepo.findAllUsers()",
  "        .flatMap { user ->",
  "            mongoRepo.findByUserId(user.id)",
  "                .collectList()",
  "                .map { logs -> UserActivity(user, logs) }",
  "        }",
  "}",
].join("\n");

// --- Capstone ---
const capstoneStarter = [
  "// Capstone: E-Commerce Checkout",
  "// userId + cartIds -> balance >= total ? \"Approved\" : \"Rejected\"",
  "fun checkout(userId: String, cartIds: List<String>): Mono<String> {",
  "    return Mono.justOrEmpty(userId).filter { it.isNotBlank() }",
  "        .switchIfEmpty(Mono.error(IllegalArgumentException(\"Invalid User\")))",
  "        .flatMap { id -> getUserBalance(id) }",
  "        .zipWith(Flux.fromIterable(cartIds).flatMap { getItemPrice(it) }.reduce(0.0, Double::plus))",
  "        .map { (balance, total) -> if (balance >= total) \"Approved\" else \"Rejected\" }",
  "}",
].join("\n");

export default function KotlinSpringReactivityPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Kotlin Spring Reactivity</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>Kotlin Spring Reactivity: Practical Course</Heading>
        <Text className={styles.subtitle}>
          Senior-level focus: the shift from <strong>Thread-per-Request</strong> (Spring MVC) to the <strong>Event Loop</strong> (WebFlux). Master <code>Mono</code>, <code>Flux</code>, <code>map</code> vs <code>flatMap</code>, functional routing, R2DBC, and Reactive MongoDB — with Kotlin and hands-on challenges.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
            alt="Backend and reactive systems"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Course contents:</strong> Module 1 — Reactive Mindset. Module 2 — Reactor (map, flatMap, zip, Schedulers). Module 3 — WebFlux functional routing. Module 4 — Reactive data (R2DBC + Mongo). Code challenges with editable snippets. Senior challenges: Rate Limiter, Multi-Source, SSE, Anti-Pattern Hunt.
          </Text>
        </div>
        <nav className={styles.sectionDescription} style={{ marginTop: "1.5rem" }} aria-label="Course contents">
          <strong style={{ color: "rgba(255,255,255,0.95)" }}>Jump to:</strong>{" "}
          <a href="#module-1-reactive-mindset" className="text-cyan-300 hover:underline">Module 1</a>
          {" · "}
          <a href="#module-2-reactor-basics" className="text-cyan-300 hover:underline">Module 2</a>
          {" · "}
          <a href="#module-3-webflux" className="text-cyan-300 hover:underline">Module 3</a>
          {" · "}
          <a href="#module-4-data-layer" className="text-cyan-300 hover:underline">Module 4</a>
          {" · "}
          <a href="#challenges-modules-1-2" className="text-cyan-300 hover:underline">Challenges 1–2</a>
          {" · "}
          <a href="#challenges-reactor" className="text-cyan-300 hover:underline">Challenges 3–4</a>
          {" · "}
          <a href="#senior-challenges" className="text-cyan-300 hover:underline">Senior Challenges</a>
          {" · "}
          <a href="#capstone-checkout" className="text-cyan-300 hover:underline">Capstone</a>
        </nav>
      </div>

      {/* Module 1: The Reactive Mindset */}
      <section id="module-1-reactive-mindset" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Module 1: The Reactive Mindset</Heading>
            <Heading level={3} className={styles.categoryTitle}>1.1 Why Blocking Kills WebFlux</Heading>
            <Text className={styles.sectionDescription}>
              In a standard Servlet container (Tomcat), 200 threads all waiting on a slow DB means the server is effectively dead. In WebFlux you use a small number of threads (often equal to CPU cores). If you <strong>block</strong> one, you freeze a huge chunk of your app. Non-blocking I/O is mandatory.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>1.2 The “Nothing Happens Until You Subscribe” Rule</Heading>
            <Text className={styles.sectionDescription}>
              The #1 mistake: writing a pipeline and wondering why nothing runs. Reactive streams are lazy — they only execute when there is a <strong>subscribe</strong>.
            </Text>
            <Text className={styles.sectionDescription}><strong>Bad (imperative mindset):</strong></Text>
            <CodeEditor code={module1BadCode} language="kotlin" readOnly height={160} />
            <Text className={styles.sectionDescription}><strong>Good (reactive mindset):</strong></Text>
            <CodeEditor code={module1GoodCode} language="kotlin" readOnly height={140} />
            <div className={styles.conceptImage}>
              <Image src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80" alt="Reactive pipeline" width={800} height={400} style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }} />
            </div>
            <CodeEditor code={module1MonoCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* Module 2: Reactor Basics */}
      <section id="module-2-reactor-basics" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Module 2: Reactor Basics (Operators)</Heading>
            <Heading level={3} className={styles.categoryTitle}>2.1 Map vs FlatMap</Heading>
            <Text className={styles.sectionDescription}>
              <strong><code>map</code></strong>: synchronous transformation (value → value). <strong><code>flatMap</code></strong>: asynchronous transformation when the step returns <code>Mono</code> or <code>Flux</code> (e.g. a DB call). Use <code>flatMap</code> for I/O.
            </Text>
            <CodeEditor code={module2MapVsFlatMapCode} language="kotlin" readOnly height={200} />
            <Heading level={3} className={styles.categoryTitle}>2.2 Zip vs FlatMap</Heading>
            <Text className={styles.sectionDescription}>
              <strong><code>zip</code></strong>: use when you need <strong>all</strong> sources to finish to build one object (e.g. User + Account + Profile). <strong><code>flatMap</code></strong>: when one call <strong>depends</strong> on the previous (e.g. get User then get Orders by userId).
            </Text>
            <CodeEditor code={module2ZipCode} language="kotlin" readOnly height={240} />
            <Heading level={3} className={styles.categoryTitle}>2.3 Schedulers</Heading>
            <Text className={styles.sectionDescription}>
              The event-loop thread must never block. For legacy blocking calls, move work to <code>Schedulers.boundedElastic()</code>. <code>subscribeOn</code> affects the source; <code>publishOn</code> affects operators after it.
            </Text>
            <CodeEditor code={module2SchedulersCode} language="kotlin" readOnly height={220} />
            <CodeEditor code={module2FluxCode} language="kotlin" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Module 3: Spring WebFlux */}
      <section id="module-3-webflux" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Module 3: Spring WebFlux Fundamentals</Heading>
            <Text className={styles.sectionDescription}>
              Functional routing is often preferred over <code>@RestController</code> for testability and explicitness. You define a <strong>Router</strong> (routes) and a <strong>Handler</strong> (logic returning <code>Mono&lt;ServerResponse&gt;</code>).
            </Text>
            <Text className={styles.sectionDescription}><strong>Router:</strong></Text>
            <CodeEditor code={module3RouterCode} language="kotlin" readOnly height={220} />
            <Text className={styles.sectionDescription}><strong>Handler:</strong></Text>
            <CodeEditor code={module3HandlerCode} language="kotlin" readOnly height={200} />
          </Stack>
        </Card>
      </section>

      {/* Module 4: Reactive Data Layer */}
      <section id="module-4-data-layer" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Module 4: The Reactive Data Layer</Heading>
            <Text className={styles.sectionDescription}>
              Reactive drivers don’t hold a thread while waiting for the DB; they register a callback on the I/O socket and free the thread. <strong>R2DBC</strong> for Postgres (relational); <strong>MongoDB Reactive</strong> for document stores and tailable cursors (e.g. SSE).
            </Text>
            <Heading level={3} className={styles.categoryTitle}>R2DBC (PostgreSQL)</Heading>
            <CodeEditor code={module4R2dbcRepoCode} language="kotlin" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>MongoDB Reactive</Heading>
            <CodeEditor code={module4MongoRepoCode} language="kotlin" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>Transactions</Heading>
            <Text className={styles.sectionDescription}>
              In WebFlux, <code>@Transactional</code> still works; context is handled via Reactor Context instead of ThreadLocal.
            </Text>
            <CodeEditor code={module4TransactionCode} language="kotlin" readOnly height={220} />
            <Heading level={3} className={styles.categoryTitle}>N+1 in Reactive: Wrong vs Right</Heading>
            <Text className={styles.sectionDescription}>
              Using <code>.block()</code> inside a <code>map</code> forces sequential, blocking behavior and kills the event loop. Use <code>flatMap</code> to keep non-blocking and concurrent.
            </Text>
            <Text className={styles.sectionDescription}><strong>Wrong:</strong></Text>
            <CodeEditor code={module4N1BadCode} language="kotlin" readOnly height={180} />
            <Text className={styles.sectionDescription}><strong>Right:</strong></Text>
            <CodeEditor code={module4N1GoodCode} language="kotlin" readOnly height={160} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>Hybrid (Postgres + Mongo):</strong> Fetch users from Postgres and activity logs from Mongo, then combine with <code>flatMap</code> + <code>collectList</code>.
              </Text>
            </div>
            <CodeEditor code={hybridMigrationCode} language="kotlin" readOnly height={220} />
          </Stack>
        </Card>
      </section>

      {/* Challenges: Modules 1 & 2 */}
      <section id="challenges-modules-1-2" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Code Challenges: Modules 1 & 2</Heading>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 1: The Ghost Subscriber.</strong> The method should fetch a user, log their name, and save. Fix it so that the “Saving user…” message actually appears (subscribe and/or doOnNext).
              </Text>
            </div>
            <CodeEditor code={challenge1GhostStarter} language="kotlin" readOnly={false} height={240} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 2: Concurrency Bottleneck.</strong> List of 5 product IDs. Call <code>productService.getDetails(id)</code> for each (returns <code>Mono</code>). Use <code>flatMap</code>, <code>collectList</code>, then print the result.
              </Text>
            </div>
            <CodeEditor code={challenge2ConcurrencyStarter} language="kotlin" readOnly={false} height={220} />
          </Stack>
        </Card>
      </section>

      {/* Challenges: Reactor (Sequential vs Parallel, Zip Refactor) */}
      <section id="challenges-reactor" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Challenges: Sequential vs Parallel, Zip Refactor</Heading>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 3:</strong> 10 OrderIDs. (1) Fetch orders one-by-one with <code>concatMap</code>. (2) Fetch concurrently with <code>flatMap</code>. If each call takes 100ms, what’s the total time for each?
              </Text>
            </div>
            <CodeEditor code={challenge3SequentialParallelStarter} language="kotlin" readOnly={false} height={240} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 4: Zip Refactor.</strong> Run <code>productRepo.findById(id)</code> and <code>reviewRepo.findAllByProductId(id).collectList()</code> in parallel with <code>Mono.zip</code>, then map to <code>ProductDetails</code>.
              </Text>
            </div>
            <CodeEditor code={challenge4ZipRefactorStarter} language="kotlin" readOnly={false} height={280} />
          </Stack>
        </Card>
      </section>

      {/* Senior Challenges */}
      <section id="senior-challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Senior Challenges</Heading>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 5: Smart Rate Limiter.</strong> Flux of 100 IDs; call a legacy API (max 5 concurrent). Use <code>flatMap(..., 5)</code>. Bonus: retry 3 times with exponential backoff (1s).
              </Text>
            </div>
            <CodeEditor code={challenge5RateLimiterStarter} language="kotlin" readOnly={false} height={220} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 6: Multi-Source Aggregator.</strong> User from Postgres, Preferences from Mongo. Fetch both in parallel with <code>Mono.zip</code>. User not found → error; Preferences not found → default.
              </Text>
            </div>
            <CodeEditor code={challenge6MultiSourceStarter} language="kotlin" readOnly={false} height={260} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>Challenge: Infinite Activity Stream (SSE).</strong> Create <code>GET /logs/stream</code> with a functional router. Use a <strong>@Tailable</strong> cursor on a MongoDB capped collection; merge with a 2-second heartbeat (e.g. <code>Flux.interval</code>) so the connection stays alive. Respond with <code>MediaType.TEXT_EVENT_STREAM</code>. Test with StepVerifier for the first 3 signals.
              </Text>
            </div>
            <CodeEditor code={challengeSseCode} language="kotlin" readOnly height={200} />
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <Text className={styles.infoText}>
                <strong>Challenge 7: Anti-Pattern Hunt.</strong> Identify and fix: (A) <code>.block()</code> inside a stream, (B) <code>Thread.sleep</code>, (C) wrong scheduler. Refactor to a fully non-blocking pipeline.
              </Text>
            </div>
            <CodeEditor code={challenge7AntiPatternStarter} language="kotlin" readOnly={false} height={280} />
          </Stack>
        </Card>
      </section>

      {/* Capstone */}
      <section id="capstone-checkout" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Capstone: E-Commerce Checkout</Heading>
            <Text className={styles.sectionDescription}>
              <strong>Inputs:</strong> <code>userId: String</code>, <code>cartIds: List&lt;String&gt;</code>. Validate user, get balance, compute cart total (e.g. <code>Flux.fromIterable(cartIds).flatMap(getItemPrice).reduce(0.0, Double::plus)</code>), then return <code>Mono&lt;String&gt;</code> “Approved” or “Rejected”.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                Use <code>Mono.justOrEmpty</code> / <code>switchIfEmpty</code> for validation, <code>flatMap</code> and <code>zipWith</code> to combine balance and total, then <code>map</code> to the result string.
              </Text>
            </div>
            <CodeEditor code={capstoneStarter} language="kotlin" readOnly={false} height={280} />
          </Stack>
        </Card>
      </section>

      {/* Recap */}
      <section className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Recap: Key Takeaways</Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Blocking one thread in WebFlux freezes a large part of your capacity; never block the event loop.</li>
              <li>Nothing runs until you <strong>subscribe</strong>. Describe the pipeline, then subscribe.</li>
              <li><strong>map</strong> = synchronous (value → value). <strong>flatMap</strong> = async (value → Mono/Flux).</li>
              <li><strong>zip</strong> = parallel independent calls; <strong>flatMap</strong> = dependent async steps.</li>
              <li>Use <strong>Schedulers.boundedElastic()</strong> for legacy blocking code; never block on the default scheduler.</li>
              <li>Functional Router + Handler: testable, explicit WebFlux endpoints.</li>
              <li>R2DBC (Postgres) and Reactive Mongo; avoid N+1 by using <code>flatMap</code> instead of <code>map</code> + <code>.block()</code>.</li>
            </ul>
          </Stack>
        </Card>
      </section>

      <nav className={styles.navigation}>
        <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
          ← Back to Blog
        </ButtonLink>
        <ButtonLink href={createLocalizedPath("/developer-section/blog/kotlin-coroutines")} variant="primary">
          Kotlin Coroutines Course →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
