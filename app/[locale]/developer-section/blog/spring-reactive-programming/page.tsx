"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor, CodeComparison } from "@/components/ui";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { useBlogPostContent } from "@/lib/blogTranslations";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

// --- Section 1: Introducing Reactive Programming - Code Examples ---

const observablePatternCode = [
  "// The Observable/Subscriber pattern — foundation of reactive programming",
  "",
  "// Observable: a data source that emits values over time",
  "// Subscribers register interest and receive updates automatically",
  "",
  "val priceStream: Flux<Double> = stockService.watchPrice(\"AAPL\")",
  "",
  "// Subscriber 1: Dashboard UI",
  "priceStream.subscribe { price ->",
  "    println(\"Dashboard updated: $$price\")",
  "}",
  "",
  "// Subscriber 2: Alert system",
  "priceStream",
  "    .filter { it > 200.0 }",
  "    .subscribe { price ->",
  "        alertService.notify(\"AAPL crossed $$200: $$price\")",
  "    }",
  "",
  "// Both subscribers react to the SAME stream independently",
  "// The Observable keeps track of its observers and pushes updates",
].join("\n");

const threePrinciplesCode = [
  "// The three principles in action",
  "",
  "// 1. ASYNCHRONOUS — non-blocking, immediate return",
  "fun fetchUserData(id: String): Mono<UserData> {",
  "    // Returns immediately — does NOT block the thread",
  "    return userRepository.findById(id)  // async DB call",
  "}",
  "",
  "// 2. STREAMS — data flows through a pipeline of transformations",
  "fun processOrders(): Flux<OrderSummary> {",
  "    return orderRepository.findAll()         // source stream",
  "        .filter { it.status == \"ACTIVE\" }     // filter stage",
  "        .map { it.toSummary() }               // transform stage",
  "        .sort(compareByDescending { it.total }) // sort stage",
  "}",
  "",
  "// 3. PROPAGATION OF CHANGE — downstream reacts to upstream changes",
  "fun liveDashboard(): Flux<DashboardState> {",
  "    return Flux.combineLatest(",
  "        userService.activeUserCount(),    // changes propagate",
  "        orderService.revenueStream(),     // changes propagate",
  "        metricService.healthCheck()       // changes propagate",
  "    ) { users, revenue, health ->",
  "        DashboardState(users, revenue, health)  // auto-updated!",
  "    }",
  "}",
].join("\n");

const imperativeBlockingCode = [
  "// Imperative (blocking) approach",
  "fun getUser(id: String): User {",
  "    val user = userRepository.findById(id)   // blocks thread",
  "    val orders = orderRepository.findByUserId(id)  // blocks again",
  "    return user.copy(orders = orders)",
  "    // Thread is IDLE during both calls",
  "    // Total time = sum of both latencies",
  "}",
].join("\n");

const reactiveNonBlockingCode = [
  "// Reactive (non-blocking) approach",
  "fun getUser(id: String): Mono<User> {",
  "    return userRepository.findById(id)        // non-blocking",
  "        .zipWith(orderRepository.findByUserId(id).collectList())",
  "        .map { (user, orders) -> user.copy(orders = orders) }",
  "    // Thread is FREE to handle other requests",
  "    // Both queries execute in parallel with zipWith",
  "}",
].join("\n");

const reactiveStreamsInterfacesCode = [
  "// The four core interfaces of Reactive Streams specification",
  "",
  "interface Publisher<T> {",
  "    fun subscribe(subscriber: Subscriber<in T>)",
  "}",
  "",
  "interface Subscriber<T> {",
  "    fun onSubscribe(subscription: Subscription)",
  "    fun onNext(item: T)",
  "    fun onError(throwable: Throwable)",
  "    fun onComplete()",
  "}",
  "",
  "interface Subscription {",
  "    fun request(n: Long)   // backpressure: request N items",
  "    fun cancel()",
  "}",
  "",
  "interface Processor<T, R> : Subscriber<T>, Publisher<R>",
].join("\n");

const monoBasicsCode = [
  "import reactor.core.publisher.Mono",
  "",
  "// Mono<T> = 0 or 1 element (like Optional but async)",
  "",
  "// Create a Mono with a value",
  "val greeting: Mono<String> = Mono.just(\"Hello Reactive World\")",
  "",
  "// Create an empty Mono",
  "val empty: Mono<String> = Mono.empty()",
  "",
  "// Create from nullable (safe)",
  "val safe: Mono<String> = Mono.justOrEmpty(null as String?)",
  "",
  "// Create from a Callable (deferred execution)",
  "val deferred: Mono<String> = Mono.fromCallable {",
  "    expensiveComputation()",
  "}",
  "",
  "// Subscribe to consume the value",
  "greeting.subscribe { value -> println(value) }",
  "// Output: Hello Reactive World",
].join("\n");

const fluxBasicsCode = [
  "import reactor.core.publisher.Flux",
  "",
  "// Flux<T> = 0 to N elements (like a reactive List/Stream)",
  "",
  "// Create from values",
  "val numbers: Flux<Int> = Flux.just(1, 2, 3, 4, 5)",
  "",
  "// Create from a collection",
  "val fromList: Flux<String> = Flux.fromIterable(listOf(\"Spring\", \"Reactor\", \"WebFlux\"))",
  "",
  "// Create a range",
  "val range: Flux<Int> = Flux.range(1, 10)",
  "",
  "// Create an infinite stream (emits every 500ms)",
  "val interval: Flux<Long> = Flux.interval(Duration.ofMillis(500))",
  "",
  "// Operators: filter, map, take",
  "numbers",
  "    .filter { it % 2 == 0 }",
  "    .map { it * 10 }",
  "    .subscribe { println(it) }",
  "// Output: 20, 40",
].join("\n");

const backpressureCode = [
  "import reactor.core.publisher.Flux",
  "import org.reactivestreams.Subscription",
  "",
  "// Backpressure: the consumer controls the flow rate",
  "",
  "Flux.range(1, 1000)",
  "    .doOnNext { println(\"Produced: $it\") }",
  "    .subscribe(object : BaseSubscriber<Int>() {",
  "        override fun hookOnSubscribe(subscription: Subscription) {",
  "            // Request only 5 items at a time",
  "            request(5)",
  "        }",
  "",
  "        override fun hookOnNext(value: Int) {",
  "            println(\"Consumed: $value\")",
  "            if (value % 5 == 0) {",
  "                request(5)  // Request next batch of 5",
  "            }",
  "        }",
  "    })",
  "",
  "// Backpressure strategies:",
  "// .onBackpressureBuffer()  — buffer excess items",
  "// .onBackpressureDrop()   — drop items consumer can't keep up with",
  "// .onBackpressureLatest() — keep only the latest item",
].join("\n");

const reactiveOperatorsCode = [
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "// ─── Transformation Operators ───",
  "",
  "// map: synchronous 1-to-1 transformation",
  "Flux.just(\"spring\", \"reactor\", \"webflux\")",
  "    .map { it.uppercase() }",
  "    .subscribe { println(it) }",
  "// SPRING, REACTOR, WEBFLUX",
  "",
  "// flatMap: async transformation (returns Publisher)",
  "fun findUserByName(name: String): Mono<User> = userRepo.findByName(name)",
  "",
  "Flux.just(\"Alice\", \"Bob\")",
  "    .flatMap { name -> findUserByName(name) }",
  "    .subscribe { println(it) }",
  "",
  "// ─── Filtering Operators ───",
  "",
  "Flux.range(1, 20)",
  "    .filter { it % 3 == 0 }     // 3, 6, 9, 12, 15, 18",
  "    .take(3)                      // 3, 6, 9",
  "    .subscribe { println(it) }",
  "",
  "// ─── Combining Operators ───",
  "",
  "// zip: combine element-by-element",
  "val names = Flux.just(\"Alice\", \"Bob\")",
  "val ages = Flux.just(30, 25)",
  "Flux.zip(names, ages) { name, age -> \"$name is $age\" }",
  "    .subscribe { println(it) }",
  "// Alice is 30, Bob is 25",
  "",
  "// merge: interleave multiple sources (no ordering guarantee)",
  "Flux.merge(fastSource, slowSource)",
  "    .subscribe { println(it) }",
].join("\n");

const errorHandlingCode = [
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "import reactor.util.retry.Retry",
  "import java.time.Duration",
  "",
  "// ─── Error Recovery Operators ───",
  "",
  "// onErrorReturn: provide a fallback value",
  "Mono.error<String>(RuntimeException(\"DB down\"))",
  "    .onErrorReturn(\"Default Value\")",
  "    .subscribe { println(it) }  // Default Value",
  "",
  "// onErrorResume: switch to a fallback Publisher",
  "fun fetchFromPrimary(): Mono<Data> = primaryDb.find()",
  "fun fetchFromCache(): Mono<Data> = cache.find()",
  "",
  "fetchFromPrimary()",
  "    .onErrorResume { ex ->",
  "        println(\"Primary failed: ${ex.message}\")",
  "        fetchFromCache()  // fallback to cache",
  "    }",
  "    .subscribe { println(it) }",
  "",
  "// ─── Retry with Backoff ───",
  "",
  "externalApi.call()",
  "    .retryWhen(",
  "        Retry.backoff(3, Duration.ofSeconds(1))",
  "            .maxBackoff(Duration.ofSeconds(10))",
  "            .filter { it is ServiceUnavailableException }",
  "    )",
  "    .onErrorReturn(\"Service temporarily unavailable\")",
  "    .subscribe { println(it) }",
].join("\n");

const springWebFluxControllerCode = [
  "import org.springframework.web.bind.annotation.*",
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "@RestController",
  "@RequestMapping(\"/api/products\")",
  "class ProductController(private val service: ProductService) {",
  "",
  "    @GetMapping",
  "    fun getAllProducts(): Flux<Product> =",
  "        service.findAll()",
  "",
  "    @GetMapping(\"/{id}\")",
  "    fun getProduct(@PathVariable id: String): Mono<Product> =",
  "        service.findById(id)",
  "",
  "    @PostMapping",
  "    fun createProduct(@RequestBody product: Product): Mono<Product> =",
  "        service.create(product)",
  "",
  "    @PutMapping(\"/{id}\")",
  "    fun updateProduct(",
  "        @PathVariable id: String,",
  "        @RequestBody product: Product",
  "    ): Mono<Product> =",
  "        service.update(id, product)",
  "",
  "    @DeleteMapping(\"/{id}\")",
  "    fun deleteProduct(@PathVariable id: String): Mono<Void> =",
  "        service.delete(id)",
  "}",
].join("\n");

const springWebFluxFunctionalCode = [
  "import org.springframework.context.annotation.Bean",
  "import org.springframework.context.annotation.Configuration",
  "import org.springframework.web.reactive.function.server.*",
  "",
  "// Functional Routing — alternative to @RestController",
  "",
  "@Configuration",
  "class ProductRouter {",
  "    @Bean",
  "    fun routes(handler: ProductHandler): RouterFunction<ServerResponse> =",
  "        router {",
  "            \"/api/products\".nest {",
  "                GET(\"\", handler::findAll)",
  "                GET(\"/{id}\", handler::findById)",
  "                POST(\"\", handler::create)",
  "                PUT(\"/{id}\", handler::update)",
  "                DELETE(\"/{id}\", handler::delete)",
  "            }",
  "        }",
  "}",
  "",
  "@Component",
  "class ProductHandler(private val service: ProductService) {",
  "",
  "    fun findAll(request: ServerRequest): Mono<ServerResponse> =",
  "        ServerResponse.ok()",
  "            .body(service.findAll(), Product::class.java)",
  "",
  "    fun findById(request: ServerRequest): Mono<ServerResponse> {",
  "        val id = request.pathVariable(\"id\")",
  "        return service.findById(id)",
  "            .flatMap { ServerResponse.ok().bodyValue(it) }",
  "            .switchIfEmpty(ServerResponse.notFound().build())",
  "    }",
  "",
  "    fun create(request: ServerRequest): Mono<ServerResponse> =",
  "        request.bodyToMono(Product::class.java)",
  "            .flatMap { service.create(it) }",
  "            .flatMap { ServerResponse.created(URI(\"/api/products/${it.id}\")).bodyValue(it) }",
  "}",
].join("\n");

const webClientCode = [
  "import org.springframework.web.reactive.function.client.WebClient",
  "import reactor.core.publisher.Mono",
  "",
  "// WebClient: non-blocking HTTP client (replaces RestTemplate)",
  "",
  "@Service",
  "class ExternalApiService(private val webClient: WebClient) {",
  "",
  "    fun fetchUser(userId: String): Mono<UserDto> =",
  "        webClient.get()",
  "            .uri(\"/users/{id}\", userId)",
  "            .retrieve()",
  "            .onStatus(HttpStatusCode::is4xxClientError) { response ->",
  "                Mono.error(UserNotFoundException(userId))",
  "            }",
  "            .bodyToMono(UserDto::class.java)",
  "            .timeout(Duration.ofSeconds(5))",
  "            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))",
  "",
  "    fun fetchAllOrders(): Flux<OrderDto> =",
  "        webClient.get()",
  "            .uri(\"/orders\")",
  "            .retrieve()",
  "            .bodyToFlux(OrderDto::class.java)",
  "}",
  "",
  "// WebClient Bean configuration",
  "@Configuration",
  "class WebClientConfig {",
  "    @Bean",
  "    fun webClient(): WebClient =",
  "        WebClient.builder()",
  "            .baseUrl(\"https://api.example.com\")",
  "            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)",
  "            .build()",
  "}",
].join("\n");

const sseCode = [
  "import org.springframework.http.MediaType",
  "import org.springframework.web.bind.annotation.*",
  "import reactor.core.publisher.Flux",
  "import java.time.Duration",
  "",
  "// Server-Sent Events (SSE) — real-time data streaming",
  "",
  "@RestController",
  "class EventController(private val eventService: EventService) {",
  "",
  "    @GetMapping(",
  "        path = [\"/events/stream\"],",
  "        produces = [MediaType.TEXT_EVENT_STREAM_VALUE]",
  "    )",
  "    fun streamEvents(): Flux<ServerSentEvent<Event>> =",
  "        eventService.getEventStream()",
  "            .map { event ->",
  "                ServerSentEvent.builder(event)",
  "                    .id(event.id)",
  "                    .event(event.type)",
  "                    .build()",
  "            }",
  "",
  "    // Heartbeat to keep the connection alive",
  "    @GetMapping(",
  "        path = [\"/events/heartbeat\"],",
  "        produces = [MediaType.TEXT_EVENT_STREAM_VALUE]",
  "    )",
  "    fun heartbeat(): Flux<String> =",
  "        Flux.interval(Duration.ofSeconds(2))",
  "            .map { \"ping\" }",
  "}",
].join("\n");

const testingReactiveCode = [
  "import reactor.test.StepVerifier",
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "// StepVerifier: the standard tool for testing reactive streams",
  "",
  "// Test a Mono",
  "@Test",
  "fun `should find product by id`() {",
  "    val product = Product(id = \"1\", name = \"Laptop\", price = 999.99)",
  "    `when`(repository.findById(\"1\")).thenReturn(Mono.just(product))",
  "",
  "    StepVerifier.create(service.findById(\"1\"))",
  "        .expectNext(product)",
  "        .verifyComplete()",
  "}",
  "",
  "// Test a Flux",
  "@Test",
  "fun `should return all products`() {",
  "    val products = listOf(",
  "        Product(\"1\", \"Laptop\", 999.99),",
  "        Product(\"2\", \"Phone\", 699.99)",
  "    )",
  "    `when`(repository.findAll()).thenReturn(Flux.fromIterable(products))",
  "",
  "    StepVerifier.create(service.findAll())",
  "        .expectNextCount(2)",
  "        .verifyComplete()",
  "}",
  "",
  "// Test error handling",
  "@Test",
  "fun `should handle not found`() {",
  "    `when`(repository.findById(\"999\")).thenReturn(Mono.empty())",
  "",
  "    StepVerifier.create(service.findById(\"999\"))",
  "        .expectError(ProductNotFoundException::class.java)",
  "        .verify()",
  "}",
].join("\n");

// --- Chapter 1: Spring Framework Foundations ---

const iocDiCode = [
  "// Inversion of Control (IoC) & Dependency Injection (DI)",
  "// Spring manages object creation and wiring — you declare, Spring delivers",
  "",
  "@Configuration",
  "class AppConfig {",
  "    @Bean",
  "    fun userRepository(): UserRepository = InMemoryUserRepository()",
  "",
  "    @Bean",
  "    fun userService(repo: UserRepository): UserService = UserService(repo)",
  "}",
  "",
  "// Constructor injection (preferred) — Spring resolves dependencies automatically",
  "@Service",
  "class OrderService(",
  "    private val userRepo: UserRepository,",
  "    private val productRepo: ProductRepository,",
  "    private val notificationService: NotificationService",
  ") {",
  "    fun placeOrder(userId: String, productId: String): Mono<Order> {",
  "        return userRepo.findById(userId)",
  "            .zipWith(productRepo.findById(productId))",
  "            .flatMap { (user, product) ->",
  "                val order = Order(user = user, product = product)",
  "                notificationService.notify(user, order)",
  "                    .thenReturn(order)",
  "            }",
  "    }",
  "}",
].join("\n");

const spring6FeaturesCode = [
  "// Spring Framework 6 — Key Changes",
  "",
  "// 1. Baseline Java 17 (minimum JDK version)",
  "// 2. Jakarta EE namespace migration: javax.* → jakarta.*",
  "import jakarta.servlet.http.HttpServletRequest   // was javax.servlet",
  "import jakarta.persistence.Entity               // was javax.persistence",
  "",
  "// 3. AOT (Ahead-Of-Time) Processing — faster startup",
  "// Build-time pre-processing of bean definitions",
  "// Enabled via: ./gradlew nativeCompile",
  "",
  "// 4. GraalVM Native Executables",
  "// plugins { id(\"org.graalvm.buildtools.native\") }",
  "// Produces standalone binary: ~50ms startup vs ~2s JVM",
  "",
  "// 5. HttpMethod changed from Enum to Class",
  "val method = HttpMethod.valueOf(\"PATCH\")",
  "",
  "// 6. Servers: Tomcat 10, Jetty 11, Netty (default for WebFlux)",
  "",
  "// 7. @Controller required (type-level @RequestMapping alone not enough)",
  "@Controller            // NOW required",
  "@RequestMapping(\"/api\")",
  "class ApiController { }",
].join("\n");

// --- Chapter 2: RxJava & Reactor ---

const rxJavaBasicsCode = [
  "// RxJava — the foundation that inspired Project Reactor",
  "import io.reactivex.rxjava3.core.Observable",
  "",
  "// Observable.just() — emit a single item",
  "val signal: Observable<String> = Observable.just(\"Red Signal!\")",
  "signal.subscribe { println(it) }  // Red Signal!",
  "",
  "// Observable.fromIterable() — emit items one by one",
  "val colors = Observable.fromIterable(listOf(\"Red\", \"Green\", \"Blue\"))",
  "colors.subscribe(",
  "    { item -> println(\"onNext: $item\") },",
  "    { error -> println(\"onError: $error\") },",
  "    { println(\"onComplete!\") }",
  ")",
  "// onNext: Red",
  "// onNext: Green",
  "// onNext: Blue",
  "// onComplete!",
  "",
  "// Reactor (Project Reactor) is the 4th-gen reactive library",
  "// used by Spring WebFlux. It implements Reactive Streams spec.",
  "// Two core types: Mono<T> (0..1) and Flux<T> (0..N)",
].join("\n");

const hotVsColdCode = [
  "import reactor.core.publisher.Flux",
  "import java.time.Duration",
  "",
  "// ─── COLD Publisher ───",
  "// Generates data anew for EACH subscriber",
  "// Nothing happens until subscribe()",
  "val coldFlux = Flux.just(\"A\", \"B\", \"C\")",
  "",
  "coldFlux.subscribe { println(\"Subscriber 1: $it\") }  // A, B, C",
  "coldFlux.subscribe { println(\"Subscriber 2: $it\") }  // A, B, C (fresh)",
  "",
  "// ─── HOT Publisher ───",
  "// Emits regardless of subscribers",
  "// Late subscribers miss earlier events",
  "val hotFlux = Flux.interval(Duration.ofSeconds(1))",
  "    .share()  // convert cold → hot (share among subscribers)",
  "",
  "hotFlux.subscribe { println(\"Sub 1: $it\") }  // 0, 1, 2, 3...",
  "Thread.sleep(3000)",
  "hotFlux.subscribe { println(\"Sub 2: $it\") }  // 3, 4, 5... (missed 0,1,2)",
  "",
  "// ConnectableFlux — hot publisher with manual connect",
  "val connectable = Flux.range(1, 5).publish()",
  "connectable.subscribe { println(\"Sub A: $it\") }",
  "connectable.subscribe { println(\"Sub B: $it\") }",
  "connectable.connect()  // NOW both subscribers start receiving",
].join("\n");

const lazyVsEagerCode = [
  "import reactor.core.publisher.Mono",
  "",
  "// ─── EAGER Loading (Mono.just) ───",
  "// The value is computed IMMEDIATELY, even before subscribe",
  "fun eagerExample() {",
  "    val eagerMono = Mono.just(expensiveQuery())  // query runs NOW!",
  "    // Even if we never subscribe, the query already executed",
  "}",
  "",
  "// ─── LAZY Loading (Mono.defer) ───",
  "// The value is computed ONLY when someone subscribes",
  "fun lazyExample() {",
  "    val lazyMono = Mono.defer {",
  "        println(\"Query triggered!\")",
  "        Mono.just(expensiveQuery())  // runs only on subscribe()",
  "    }",
  "",
  "    // Nothing happens yet...",
  "    lazyMono.subscribe { println(\"Got: $it\") }  // NOW the query runs",
  "}",
  "",
  "// ─── Mono.fromCallable (also lazy) ───",
  "val callable = Mono.fromCallable { computeValue() }",
  "// Equivalent to defer but for simple Callable functions",
].join("\n");

// --- Chapter 3: Advanced Operators ---

const advancedOperatorsCode = [
  "import reactor.core.publisher.Flux",
  "import java.time.Duration",
  "",
  "// ─── transform: reusable operator chains ───",
  "val filterAndUppercase: (Flux<String>) -> Flux<String> = { flux ->",
  "    flux.filter { it != \"spam\" }.map { it.uppercase() }",
  "}",
  "Flux.just(\"hello\", \"spam\", \"world\")",
  "    .transform(filterAndUppercase)",
  "    .subscribe { println(it) }  // HELLO, WORLD",
  "",
  "// ─── buffer: collect into batches ───",
  "Flux.range(1, 10)",
  "    .buffer(3)",
  "    .subscribe { println(it) }  // [1,2,3], [4,5,6], [7,8,9], [10]",
  "",
  "// ─── cache: replay for late subscribers ───",
  "val cached = Flux.just(1, 2, 3)",
  "    .doOnNext { println(\"Producing: $it\") }",
  "    .cache()  // only produces once, replays for all subscribers",
  "",
  "cached.subscribe { println(\"Sub1: $it\") }",
  "cached.subscribe { println(\"Sub2: $it\") }  // replayed from cache",
  "",
  "// ─── groupBy: partition by key ───",
  "Flux.range(1, 10)",
  "    .groupBy { if (it % 2 == 0) \"Even\" else \"Odd\" }",
  "    .flatMap { group ->",
  "        group.collectList().map { \"${group.key()}: $it\" }",
  "    }",
  "    .subscribe { println(it) }",
  "// Even: [2, 4, 6, 8, 10]",
  "// Odd: [1, 3, 5, 7, 9]",
].join("\n");

const moreOperatorsCode = [
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "import java.time.Duration",
  "",
  "// ─── concat: sequential (preserves order) ───",
  "val first = Flux.just(1, 2, 3).delayElements(Duration.ofMillis(100))",
  "val second = Flux.just(4, 5, 6)",
  "Flux.concat(first, second)",
  "    .subscribe { print(\"$it \") }  // 1 2 3 4 5 6 (always in order)",
  "",
  "// ─── combineLatest: react to ANY source change ───",
  "val temp = Flux.interval(Duration.ofSeconds(2)).map { \"${20 + it}°C\" }",
  "val humidity = Flux.interval(Duration.ofSeconds(3)).map { \"${60 + it}%\" }",
  "Flux.combineLatest(temp, humidity) { t, h -> \"Temp=$t Humidity=$h\" }",
  "    .subscribe { println(it) }",
  "",
  "// ─── expand: recursive (tree/graph traversal) ───",
  "data class TreeNode(val id: Int, val children: List<Int>)",
  "",
  "fun fetchChildren(id: Int): Flux<TreeNode> = repository.findChildren(id)",
  "",
  "Mono.just(TreeNode(1, listOf(2, 3)))",
  "    .expand { node -> fetchChildren(node.id) }",
  "    .subscribe { println(\"Visited: ${it.id}\") }",
  "",
  "// ─── delayElements + limitRate: throttle processing ───",
  "Flux.range(1, 100)",
  "    .delayElements(Duration.ofMillis(50))",
  "    .limitRate(10)  // request 10 at a time (backpressure)",
  "    .subscribe { println(it) }",
  "",
  "// ─── flatMapIterable: flatten collections ───",
  "Flux.just(listOf(1, 2), listOf(3, 4), listOf(5))",
  "    .flatMapIterable { it }  // flattens to: 1, 2, 3, 4, 5",
  "    .subscribe { print(\"$it \") }",
].join("\n");

// --- Chapter 4: Async Programming Patterns ---

const parallelProcessingCode = [
  "import reactor.core.publisher.Flux",
  "import reactor.core.scheduler.Schedulers",
  "",
  "// ─── Parallel processing with ParallelFlux ───",
  "Flux.range(1, 100)",
  "    .parallel(4)                       // split into 4 rails",
  "    .runOn(Schedulers.parallel())       // run on parallel scheduler",
  "    .map { processItem(it) }            // each rail processes independently",
  "    .sequential()                       // merge back to single Flux",
  "    .subscribe { println(it) }",
  "",
  "// ─── Schedulers explained ───",
  "// Schedulers.parallel()       — CPU-bound work (cores count threads)",
  "// Schedulers.boundedElastic() — I/O-bound / blocking work (capped pool)",
  "// Schedulers.single()         — single-threaded (sequential tasks)",
  "// Schedulers.immediate()      — current thread (no scheduling)",
  "",
  "// ─── Real-time event generation ───",
  "fun generateEvents(): Flux<String> =",
  "    Flux.interval(Duration.ofSeconds(1))",
  "        .map { index -> \"Event $index\" }",
  "        .take(10)  // emit 10 events then complete",
  "",
  "// ─── Event-driven with Sinks ───",
  "val sink = Sinks.many().multicast().onBackpressureBuffer<String>()",
  "",
  "// Publish events programmatically",
  "sink.tryEmitNext(\"user.created\")",
  "sink.tryEmitNext(\"order.placed\")",
  "",
  "// Multiple subscribers receive events",
  "sink.asFlux().subscribe { println(\"Listener 1: $it\") }",
  "sink.asFlux().subscribe { println(\"Listener 2: $it\") }",
].join("\n");

// --- Chapter 5: WebClient Deep Dive ---

const restTemplateBlockingCode = [
  "// RestTemplate (blocking, DEPRECATED)",
  "val restTemplate = RestTemplate()",
  "",
  "// Thread is BLOCKED during the entire HTTP call",
  "val user: User = restTemplate.getForObject(",
  "    \"/users/1\", User::class.java",
  ")!!",
  "// Thread waits here... doing nothing...",
  "",
  "val orders: List<Order> = restTemplate.getForObject(",
  "    \"/orders?userId=1\", typeRef<List<Order>>()",
  ")!!",
  "// Blocked again... wasting resources",
  "",
  "// One thread per request model",
  "// 200 concurrent users = 200 threads blocked",
].join("\n");

const webClientReactiveCode = [
  "// WebClient (non-blocking, RECOMMENDED)",
  "val webClient = WebClient.create(\"http://api.example.com\")",
  "",
  "// Thread is FREE during the HTTP call",
  "val user: Mono<User> = webClient.get()",
  "    .uri(\"/users/1\")",
  "    .retrieve()",
  "    .bodyToMono(User::class.java)",
  "",
  "val orders: Flux<Order> = webClient.get()",
  "    .uri(\"/orders?userId=1\")",
  "    .retrieve()",
  "    .bodyToFlux(Order::class.java)",
  "",
  "// Shared thread pool handles thousands of requests",
  "// 200 concurrent users = same small thread pool",
].join("\n");

const sequentialCallsCode = [
  "// Sequential: each call waits for the previous one",
  "fun sequential(): Mono<String> {",
  "    return webClient.get().uri(\"/user/1\").retrieve()",
  "        .bodyToMono(User::class.java)",
  "        .flatMap { user ->",
  "            webClient.get().uri(\"/orders/${user.id}\").retrieve()",
  "                .bodyToMono(OrderList::class.java)",
  "                .map { orders ->",
  "                    \"${user.name}: ${orders.size} orders\"",
  "                }",
  "        }",
  "}",
  "// /user=200ms + /orders=300ms => total ~500ms",
].join("\n");

const parallelCallsCode = [
  "// Parallel: all calls fire simultaneously",
  "fun parallel(): Mono<Dashboard> {",
  "    val user = webClient.get().uri(\"/user/1\")",
  "        .retrieve().bodyToMono(User::class.java)",
  "    val orders = webClient.get().uri(\"/orders\")",
  "        .retrieve().bodyToFlux(Order::class.java).collectList()",
  "    val notifications = webClient.get().uri(\"/notifications\")",
  "        .retrieve().bodyToFlux(Notification::class.java).collectList()",
  "",
  "    return Mono.zip(user, orders, notifications)",
  "        .map { (u, o, n) -> Dashboard(u, o, n) }",
  "}",
  "// 200ms, 300ms, 150ms => total ~300ms (parallel!)",
].join("\n");

const latencyOptimizationCode = [
  "import io.netty.resolver.DefaultAddressResolverGroup",
  "import reactor.netty.http.client.HttpClient",
  "import java.time.Duration",
  "",
  "// ─── Connection Pooling (reuse connections) ───",
  "val httpClient = HttpClient.create()",
  "    .resolver(DefaultAddressResolverGroup.INSTANCE)  // DNS caching",
  "",
  "val webClient = WebClient.builder()",
  "    .clientConnector(ReactorClientHttpConnector(httpClient))",
  "    .baseUrl(\"https://api.example.com\")",
  "    .build()",
  "",
  "// ─── Timeout + Retry + Fallback ───",
  "webClient.get().uri(\"/data\")",
  "    .retrieve()",
  "    .bodyToMono(Data::class.java)",
  "    .timeout(Duration.ofSeconds(3))             // fail after 3s",
  "    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))  // retry 3x",
  "    .onErrorReturn(Data.default())              // fallback value",
  "",
  "// ─── Response Caching (Caffeine) ───",
  "val cache = Caffeine.newBuilder()",
  "    .maximumSize(1000)",
  "    .expireAfterWrite(Duration.ofMinutes(5))",
  "    .build<String, Data>()",
  "",
  "fun getData(key: String): Mono<Data> {",
  "    val cached = cache.getIfPresent(key)",
  "    if (cached != null) return Mono.just(cached)",
  "    return webClient.get().uri(\"/data/$key\")",
  "        .retrieve().bodyToMono(Data::class.java)",
  "        .doOnNext { cache.put(key, it) }",
  "}",
].join("\n");

// --- Chapter 6: Reactive Repositories ---

const reactiveReposCode = [
  "// ─── R2DBC (PostgreSQL / MySQL) ───",
  "// Non-blocking alternative to JPA/JDBC",
  "",
  "@Table(\"users\")",
  "data class User(",
  "    @Id val id: Long? = null,",
  "    val name: String,",
  "    val email: String,",
  "    val role: String",
  ")",
  "",
  "@Repository",
  "interface UserRepository : ReactiveCrudRepository<User, Long> {",
  "    fun findByEmail(email: String): Mono<User>",
  "    fun findByRole(role: String): Flux<User>",
  "}",
  "",
  "// ─── Reactive MongoDB ───",
  "@Document(collection = \"products\")",
  "data class Product(",
  "    @Id val id: String? = null,",
  "    val name: String,",
  "    val price: Double,",
  "    val category: String",
  ")",
  "",
  "@Repository",
  "interface ProductRepository : ReactiveMongoRepository<Product, String> {",
  "    fun findByCategory(category: String): Flux<Product>",
  "    fun findByPriceLessThan(maxPrice: Double): Flux<Product>",
  "}",
  "",
  "// ─── Reactive Couchbase ───",
  "@Document",
  "data class Session(",
  "    @Id val id: String,",
  "    val userId: String,",
  "    @Expiry(expiry = 3600) val expiresIn: Int = 3600",
  ")",
  "",
  "@Repository",
  "interface SessionRepository : ReactiveCouchbaseRepository<Session, String> {",
  "    fun findByUserId(userId: String): Flux<Session>",
  "}",
].join("\n");

const concurrencyControlCode = [
  "// ─── Optimistic Locking (version-based) ───",
  "// Multiple transactions proceed; check version before commit",
  "// If version mismatch → retry (no locks held)",
  "",
  "@Document(collection = \"inventory\")",
  "data class Inventory(",
  "    @Id val id: String? = null,",
  "    val productId: String,",
  "    val quantity: Int,",
  "    @Version val version: Long = 0  // Optimistic lock field",
  ")",
  "",
  "@Service",
  "class InventoryService(private val repo: InventoryRepository) {",
  "    fun decrementStock(productId: String, amount: Int): Mono<Inventory> {",
  "        return repo.findByProductId(productId)",
  "            .flatMap { inv ->",
  "                if (inv.quantity < amount) {",
  "                    Mono.error(InsufficientStockException())",
  "                } else {",
  "                    repo.save(inv.copy(quantity = inv.quantity - amount))",
  "                    // If another transaction modified this document,",
  "                    // @Version mismatch throws OptimisticLockingFailureException",
  "                }",
  "            }",
  "            .retryWhen(Retry.backoff(3, Duration.ofMillis(100))",
  "                .filter { it is OptimisticLockingFailureException })",
  "    }",
  "}",
].join("\n");

// --- Chapter 7: Messaging with Kafka ---

const kafkaReactiveCode = [
  "// ─── Reactive Kafka Consumer ───",
  "// Kafka messages consumed and exposed as a Flux stream",
  "",
  "@Service",
  "class KafkaConsumerService {",
  "    private val sink = Sinks.many().multicast().onBackpressureBuffer<String>()",
  "",
  "    @KafkaListener(topics = [\"orders-topic\"], groupId = \"webflux-group\")",
  "    fun consume(message: String) {",
  "        sink.tryEmitNext(message)",
  "    }",
  "",
  "    fun getStream(): Flux<String> = sink.asFlux()",
  "}",
  "",
  "// ─── SSE Controller streaming Kafka messages ───",
  "@RestController",
  "class StreamController(private val kafka: KafkaConsumerService) {",
  "",
  "    @GetMapping(\"/stream/orders\", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])",
  "    fun streamOrders(): Flux<String> =",
  "        kafka.getStream()",
  "            .map { message -> \"Order received: $message\" }",
  "}",
  "",
  "// ─── Kafka Producer (reactive) ───",
  "@Service",
  "class KafkaProducerService(private val template: KafkaTemplate<String, String>) {",
  "    fun publish(topic: String, message: String): Mono<Void> =",
  "        Mono.fromFuture(template.send(topic, message).toCompletableFuture())",
  "            .then()",
  "}",
].join("\n");

const sagaPatternCode = [
  "// ─── Saga Pattern: distributed transactions via compensating actions ───",
  "// Instead of one big transaction, each service has a local transaction",
  "// + a compensating action if a downstream step fails",
  "",
  "@Service",
  "class OrderSagaOrchestrator(",
  "    private val orderService: OrderService,",
  "    private val paymentService: PaymentService,",
  "    private val inventoryService: InventoryService",
  ") {",
  "    fun placeOrder(request: OrderRequest): Mono<OrderResult> {",
  "        return orderService.create(request)                    // Step 1",
  "            .flatMap { order ->",
  "                paymentService.charge(order)                   // Step 2",
  "                    .flatMap { payment ->",
  "                        inventoryService.reserve(order)        // Step 3",
  "                            .map { OrderResult.success(order, payment) }",
  "                            .onErrorResume { e ->",
  "                                // Step 3 failed → compensate Step 2",
  "                                paymentService.refund(payment)",
  "                                    .then(orderService.cancel(order))",
  "                                    .then(Mono.error(e))",
  "                            }",
  "                    }",
  "                    .onErrorResume { e ->",
  "                        // Step 2 failed → compensate Step 1",
  "                        orderService.cancel(order)",
  "                            .then(Mono.error(e))",
  "                    }",
  "            }",
  "    }",
  "}",
].join("\n");

const resilienceCode = [
  "// ─── Circuit Breaker (Resilience4j) ───",
  "// Prevents cascading failures by \"tripping\" after too many errors",
  "",
  "val circuitBreaker = CircuitBreaker.of(\"paymentService\",",
  "    CircuitBreakerConfig.custom()",
  "        .failureRateThreshold(50f)          // trip at 50% failure rate",
  "        .waitDurationInOpenState(Duration.ofSeconds(10)) // stay open 10s",
  "        .slidingWindowSize(10)               // evaluate last 10 calls",
  "        .build()",
  ")",
  "",
  "fun chargePayment(order: Order): Mono<Payment> {",
  "    return circuitBreaker.run(",
  "        paymentClient.charge(order),         // primary call",
  "        { fallback -> Mono.just(Payment.pending()) }  // fallback",
  "    )",
  "}",
  "",
  "// ─── Bulkhead (limit concurrent calls) ───",
  "val bulkhead = Bulkhead.of(\"externalApi\",",
  "    BulkheadConfig.custom()",
  "        .maxConcurrentCalls(5)               // max 5 simultaneous calls",
  "        .maxWaitDuration(Duration.ofMillis(500)) // wait max 500ms for slot",
  "        .build()",
  ")",
  "",
  "// ─── Retry with jitter ───",
  "val retry = Retry.of(\"dbRetry\",",
  "    RetryConfig.custom<Any>()",
  "        .maxAttempts(3)",
  "        .waitDuration(Duration.ofMillis(500))",
  "        .retryExceptions(TransientDataAccessException::class.java)",
  "        .build()",
  ")",
].join("\n");

// --- Chapter 8: Spring Cloud Gateway ---

const cloudGatewayCode = [
  "// ─── Spring Cloud Gateway: reactive API gateway ───",
  "// Built on WebFlux — fully non-blocking",
  "",
  "// application.yml configuration",
  "// spring:",
  "//   cloud:",
  "//     gateway:",
  "//       routes:",
  "//         - id: user-service",
  "//           uri: lb://USER-SERVICE",
  "//           predicates:",
  "//             - Path=/users/**",
  "//           filters:",
  "//             - StripPrefix=1",
  "",
  "// Programmatic route definition (Kotlin DSL)",
  "@Configuration",
  "class GatewayConfig {",
  "    @Bean",
  "    fun routes(builder: RouteLocatorBuilder): RouteLocator =",
  "        builder.routes()",
  "            .route(\"user-service\") { r ->",
  "                r.path(\"/api/users/**\")",
  "                    .filters { f ->",
  "                        f.stripPrefix(1)",
  "                            .addResponseHeader(\"X-Gateway\", \"Spring Cloud\")",
  "                    }",
  "                    .uri(\"lb://USER-SERVICE\")",
  "            }",
  "            .route(\"order-service\") { r ->",
  "                r.path(\"/api/orders/**\")",
  "                    .filters { f -> f.stripPrefix(1) }",
  "                    .uri(\"lb://ORDER-SERVICE\")",
  "            }",
  "            .build()",
  "}",
  "",
  "// Custom Global Filter (logging, auth, metrics)",
  "@Component",
  "class AuthFilter : GlobalFilter, Ordered {",
  "    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {",
  "        val token = exchange.request.headers.getFirst(\"Authorization\")",
  "        if (token == null || !token.startsWith(\"Bearer \")) {",
  "            exchange.response.statusCode = HttpStatus.UNAUTHORIZED",
  "            return exchange.response.setComplete()",
  "        }",
  "        return chain.filter(exchange)",
  "    }",
  "    override fun getOrder(): Int = -1  // run first",
  "}",
].join("\n");

const capTheoremCode = [
  "// ─── CAP Theorem: choose 2 of 3 ───",
  "// Every distributed data store can guarantee at most TWO of:",
  "//",
  "//   ┌─────────────────────────────┐",
  "//   │       Consistency (C)       │",
  "//   │  All nodes see same data    │",
  "//   │  at the same time           │",
  "//   └──────────┬──────────────────┘",
  "//              │",
  "//   ┌──────────┴──────────────────┐",
  "//   │    Availability (A)         │     Partition",
  "//   │  Every request gets a       │   Tolerance (P)",
  "//   │  response (success/fail)    │   System works despite",
  "//   └─────────────────────────────┘   network partitions",
  "//",
  "// CP: MongoDB, HBase, Redis Cluster — consistent reads, may reject writes",
  "// AP: Cassandra, CouchDB, DynamoDB — always available, eventually consistent",
  "// CA: Traditional RDBMS (single node) — not partition tolerant",
  "",
  "// In reactive microservices, we usually choose AP (eventual consistency)",
  "// and use the Saga pattern for distributed transactions",
  "",
  "// Example: eventually consistent order status",
  "@Service",
  "class OrderQueryService(private val repo: OrderRepository) {",
  "    fun getStatus(orderId: String): Mono<OrderStatus> =",
  "        repo.findById(orderId)",
  "            .map { it.status }",
  "            .defaultIfEmpty(OrderStatus.UNKNOWN)  // AP: always respond",
  "}",
].join("\n");

const gradleDepsCode = [
  "// build.gradle.kts — Spring Reactive dependencies",
  "dependencies {",
  "    implementation(\"org.springframework.boot:spring-boot-starter-webflux\")",
  "    implementation(\"io.projectreactor.kotlin:reactor-kotlin-extensions\")",
  "    implementation(\"org.jetbrains.kotlinx:kotlinx-coroutines-reactor\")",
  "",
  "    // Reactive data access (choose one or both)",
  "    implementation(\"org.springframework.boot:spring-boot-starter-data-mongodb-reactive\")",
  "    implementation(\"org.springframework.boot:spring-boot-starter-data-r2dbc\")",
  "    runtimeOnly(\"io.r2dbc:r2dbc-postgresql\")",
  "",
  "    // Testing",
  "    testImplementation(\"io.projectreactor:reactor-test\")",
  "}",
].join("\n");

export default function SpringReactiveProgrammingPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("spring-reactive-programming", language as "es" | "en");

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
          <li className={styles.breadcrumbCurrent}>{postContent?.breadcrumbLabel || "Spring Reactive"}</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>{postContent?.title || "Dominando Spring Reactive Programming"}</Heading>
        <Text className={styles.subtitle}>
          From the <strong>Reactive Manifesto</strong> to <strong>Project Reactor</strong>, <strong>Spring WebFlux</strong>, and production-ready patterns — all with Kotlin code examples.
        </Text>
        <nav className={styles.navChipsSection} aria-label="Course contents">
          <div className={styles.navChipsLabel}>Jump to section</div>
          <div className={styles.navChipsGrid}>
            {[
              { href: "#introducing-reactive", label: "Intro" },
              { href: "#reactive-manifesto", label: "Manifesto" },
              { href: "#reactive-streams", label: "Streams" },
              { href: "#spring-foundations", label: "Spring" },
              { href: "#rxjava-reactor", label: "RxJava" },
              { href: "#mono-and-flux", label: "Mono & Flux" },
              { href: "#hot-vs-cold", label: "Hot/Cold" },
              { href: "#lazy-vs-eager", label: "Lazy/Eager" },
              { href: "#backpressure", label: "Backpressure" },
              { href: "#operators", label: "Operators" },
              { href: "#advanced-operators", label: "Advanced Ops" },
              { href: "#error-handling", label: "Errors" },
              { href: "#async-patterns", label: "Async" },
              { href: "#spring-webflux", label: "WebFlux" },
              { href: "#webclient", label: "WebClient" },
              { href: "#reactive-repos", label: "Repos" },
              { href: "#cap-theorem", label: "CAP" },
              { href: "#kafka-messaging", label: "Kafka" },
              { href: "#saga-pattern", label: "Saga" },
              { href: "#resilience", label: "Resilience" },
              { href: "#cloud-gateway", label: "Gateway" },
              { href: "#sse", label: "SSE" },
              { href: "#testing", label: "Testing" },
            ].map((item, i) => (
              <a key={item.href} href={item.href} className={styles.navChip}>
                <span className={styles.navChipNumber}>{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Section 1: Introducing Reactive Programming */}
      <section id="introducing-reactive" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Introducing Reactive Programming</Heading>
            <Text className={styles.sectionDescription}>
              Reactive programming builds systems that react to <strong>data as it flows</strong> rather than waiting for results. Instead of blocking threads, reactive programs describe transformation pipelines that execute when data becomes available.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>IN A NUTSHELL</div>
              <Text className={styles.infoText}>
                Declarative programming with an emphasis on <strong>asynchronous data streams</strong> and <strong>change propagation</strong> — data types express values that change over time, and downstream computations update automatically.
              </Text>
            </div>
            <Text className={styles.sectionDescription}>
              The core abstraction is the <strong>Observable/Subscriber</strong> pattern. An Observable is a data source where observers register interest. <strong>Subscribers</strong> receive updates whenever the subject changes — the source keeps track of its observers and pushes notifications automatically.
            </Text>
            <CodeEditor code={observablePatternCode} language="kotlin" readOnly height={420} />

            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/observer-pattern.png"
                alt="Observer Pattern — Subject registers observers and notifies them on changes"
                style={{ width: "100%", maxWidth: "650px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Observer Pattern — Source: Wikipedia
              </Text>
            </div>

            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/observable-train-signal.png"
                alt="Train/Signal analogy — Control Room as Observable, Train as Subscriber"
                style={{ width: "100%", maxWidth: "550px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Train/Signal analogy — Control Room (Observable) sends signals; Train (Subscriber) reacts
              </Text>
            </div>

            <Heading level={3} className={styles.categoryTitle}>The Three Principles</Heading>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>1. ASYNCHRONOUS</div>
              <Text className={styles.infoText}>
                A database call returns immediately rather than blocking the calling thread. The system handles more work with fewer resources.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>2. STREAMS</div>
              <Text className={styles.infoText}>
                Data flows through a pipeline of transformations. Every value sequence is an <strong>observable</strong> that operators can filter, map, and combine.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>3. PROPAGATION OF CHANGE</div>
              <Text className={styles.infoText}>
                When a value changes upstream, all dependent downstream computations re-evaluate automatically — the &quot;spreadsheet model&quot; applied to async streams.
              </Text>
            </div>
            <CodeEditor code={threePrinciplesCode} language="kotlin" readOnly height={500} />

            <Text className={styles.sectionDescription}>
              <strong>Imperative vs Reactive:</strong> From &quot;pull&quot; (blocking) to &quot;push&quot; (non-blocking, event-driven):
            </Text>
            <CodeComparison
              comparisonId="imperative-vs-reactive"
              language="kotlin"
              wrong={imperativeBlockingCode}
              good={reactiveNonBlockingCode}
              whatToNoticeBad={[
                "Each findById() call blocks the thread until the DB responds",
                "Total time = sum of all latencies (e.g. 200ms + 300ms = 500ms)",
                "Thread is wasted waiting — cannot serve other requests",
              ]}
              whatToNoticeGood={[
                "Returns Mono immediately — thread is free to handle other work",
                "zipWith() fires both queries in parallel",
                "Total time = slowest query (e.g. max(200ms, 300ms) = 300ms)",
              ]}
              blogMode
            />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 2: The Reactive Manifesto */}
      <section id="reactive-manifesto" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>The Reactive Manifesto</Heading>
            <Text className={styles.sectionDescription}>
              Four architectural pillars that Spring WebFlux and Project Reactor are built upon:
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/reactive-manifesto.png"
                alt="Reactive Manifesto — Responsive, Resilient, Elastic, Message Driven"
                style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>RESPONSIVE</div>
              <Text className={styles.infoText}>
                Reliable upper bounds for response times. Consistent quality of service under all conditions.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>RESILIENT</div>
              <Text className={styles.infoText}>
                Built for failures — replication, containment, isolation. Each component fails independently without cascading.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>ELASTIC</div>
              <Text className={styles.infoText}>
                Scale up and down in response to load changes. No contention points or central bottlenecks.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>MESSAGE DRIVEN</div>
              <Text className={styles.infoText}>
                Asynchronous message passing for loose coupling and location transparency. Recipients consume resources only while active.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 3: Reactive Streams Specification */}
      <section id="reactive-streams" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Reactive Streams Specification</Heading>
            <Text className={styles.sectionDescription}>
              A specification (part of <code>java.util.concurrent.Flow</code> in Java 9+) defining the contract for async stream processing with <strong>non-blocking backpressure</strong>. Four core interfaces:
            </Text>
            <CodeEditor code={reactiveStreamsInterfacesCode} language="kotlin" readOnly height={440} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>KEY INSIGHT</div>
              <Text className={styles.infoText}>
                <strong>Publisher</strong> produces &rarr; <strong>Subscriber</strong> consumes &rarr; <strong>Subscription</strong> enables backpressure via <code>request(n)</code> &rarr; <strong>Processor</strong> is both.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Spring Framework Foundations */}
      <section id="spring-foundations" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Spring Framework Foundations</Heading>
            <Text className={styles.sectionDescription}>
              The foundations that reactive Spring builds upon: <strong>IoC</strong> and <strong>Dependency Injection</strong>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>IoC &amp; Dependency Injection</Heading>
            <Text className={styles.sectionDescription}>
              IoC transfers control from developers to a container. DI wires objects together — decoupling implementation from execution and simplifying testing.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/spring-framework-modules.png"
                alt="Spring Framework Runtime — Module architecture: Data Access, Web, AOP, Core Container, Test"
                style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Spring Framework Runtime — Data Access/Integration, Web, AOP, Core Container, Test
              </Text>
            </div>
            <CodeEditor code={iocDiCode} language="kotlin" readOnly height={560} />
            <Heading level={3} className={styles.categoryTitle}>Spring Framework 6 Key Changes</Heading>
            <Text className={styles.sectionDescription}>
              Spring Framework 6 introduced significant changes that affect how we build reactive applications:
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/spring-boot-architecture.png"
                alt="Spring Boot component architecture — Application, Spring MVC, Data, ORM, DI, Embedded Server"
                style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Spring Boot architecture — Application layer built on Spring MVC, Data, ORM with Dependency Injection
              </Text>
            </div>
            <CodeEditor code={spring6FeaturesCode} language="kotlin" readOnly height={480} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* RxJava & Reactor */}
      <section id="rxjava-reactor" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>RxJava &amp; Project Reactor</Heading>
            <Text className={styles.sectionDescription}>
              <strong>RxJava</strong> popularized reactive on the JVM. <strong>Project Reactor</strong> is the 4th-gen library based on Reactive Streams — Spring&apos;s native choice.
            </Text>
            <CodeEditor code={rxJavaBasicsCode} language="kotlin" readOnly height={440} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>COMPARISON</div>
              <Text className={styles.infoText}>
                <strong>RxJava 3:</strong> <code>Observable</code>, <code>Single</code>, <code>Maybe</code>, <code>Flowable</code>. Only Flowable implements Reactive Streams.<br/>
                <strong>Reactor:</strong> <code>Flux</code> (0..N), <code>Mono</code> (0..1). Full Reactive Streams compliance. Spring-native.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 4: Mono & Flux */}
      <section id="mono-and-flux" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Mono &amp; Flux: The Building Blocks</Heading>
            <Text className={styles.sectionDescription}>
              Two core types that implement the <code>Publisher</code> interface in Project Reactor:
            </Text>
            <Heading level={3} className={styles.categoryTitle}>Mono&lt;T&gt; — 0 or 1 Element</Heading>
            <Text className={styles.sectionDescription}>
              A reactive <code>Optional</code> — emits at most one item. Perfect for single-value operations like <code>findById</code>.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/mono-marble-diagram.png"
                alt="Mono marble diagram — Single item emission, operator transformation, success or error signal"
                style={{ width: "100%", maxWidth: "550px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Mono marble diagram — Single item emission through operator, success (|) or error (X)
              </Text>
            </div>
            <CodeEditor code={monoBasicsCode} language="kotlin" readOnly height={440} />
            <Heading level={3} className={styles.categoryTitle}>Flux&lt;T&gt; — 0 to N Elements</Heading>
            <Text className={styles.sectionDescription}>
              A stream of 0 to N elements. Use for collections, event streams, or multiple values over time.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/flux-marble-diagram.png"
                alt="Flux marble diagram — Multiple items emitted through operator transformations"
                style={{ width: "100%", maxWidth: "550px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Flux marble diagram — Multiple items emitted through operator transformations
              </Text>
            </div>
            <CodeEditor code={fluxBasicsCode} language="kotlin" readOnly height={440} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Hot vs Cold Publishers */}
      <section id="hot-vs-cold" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Hot vs Cold Publishers</Heading>
            <Text className={styles.sectionDescription}>
              <strong>Cold</strong>: generates data anew per subscription. <strong>Hot</strong>: emits regardless of subscribers — late joiners miss earlier events.
            </Text>
            <CodeEditor code={hotVsColdCode} language="kotlin" readOnly height={520} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>WHEN TO USE WHICH</div>
              <Text className={styles.infoText}>
                <strong>Cold</strong>: Database queries, HTTP requests, file reads — each subscriber gets its own fresh data. <strong>Hot</strong>: WebSocket streams, Kafka topics, sensor data, stock tickers — data flows regardless of who is listening. Use <code>.share()</code> or <code>.publish().autoConnect()</code> to convert cold to hot.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Lazy vs Eager Loading */}
      <section id="lazy-vs-eager" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Lazy vs Eager Loading</Heading>
            <Text className={styles.sectionDescription}>
              <code>Mono.just()</code> evaluates <strong>eagerly</strong>. <code>Mono.defer()</code> and <code>fromCallable()</code> evaluate <strong>lazily</strong> — only when subscribed.
            </Text>
            <CodeEditor code={lazyVsEagerCode} language="kotlin" readOnly height={480} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>RULE OF THUMB</div>
              <Text className={styles.infoText}>
                Use <code>Mono.just()</code> for values already available. Use <code>Mono.defer()</code> or <code>Mono.fromCallable()</code> for values that require computation, I/O, or side effects — you want those to execute only when the pipeline is actually subscribed.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 5: Backpressure */}
      <section id="backpressure" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Backpressure</Heading>
            <Text className={styles.sectionDescription}>
              The mechanism by which a <strong>consumer signals to the producer</strong> how much data it can handle. Without it, fast producers overwhelm slow consumers.
            </Text>
            <CodeEditor code={backpressureCode} language="kotlin" readOnly height={520} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>WHY IT MATTERS</div>
              <Text className={styles.infoText}>
                In production, backpressure prevents your application from crashing when a database query returns millions of rows, when an external API sends data faster than you can process it, or when thousands of WebSocket clients flood your server with messages.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>OVERFLOW STRATEGIES</div>
              <Text className={styles.infoText}>
                <code>onBackpressureBuffer()</code> — Buffer in memory &middot; <code>onBackpressureDrop()</code> — Drop excess &middot; <code>onBackpressureLatest()</code> — Keep only latest &middot; <code>onBackpressureError()</code> — Signal error. <strong>Always set a max buffer size in production.</strong>
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 6: Reactive Operators */}
      <section id="operators" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Reactive Operators</Heading>
            <Text className={styles.sectionDescription}>
              The vocabulary of reactive programming — <strong>transform</strong>, <strong>filter</strong>, <strong>combine</strong>, and <strong>control</strong> data streams declaratively.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/reactor-operator-pipeline.png"
                alt="Reactor operator pipeline — fromIterable through doOnNext, transform (filter, map) to subscriber chain"
                style={{ width: "100%", maxWidth: "650px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "0.5rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Reactor operator pipeline — fromIterable → doOnNext → transform (filter, map) → subscriber chain
              </Text>
            </div>
            <CodeEditor code={reactiveOperatorsCode} language="kotlin" readOnly height={680} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Advanced Operators */}
      <section id="advanced-operators" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Advanced Operators</Heading>
            <Text className={styles.sectionDescription}>
              Production operators: <strong>reusable transformations</strong>, <strong>batching</strong>, <strong>caching</strong>, <strong>grouping</strong>, and <strong>recursive expansion</strong>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>transform, buffer, cache, groupBy</Heading>
            <CodeEditor code={advancedOperatorsCode} language="kotlin" readOnly height={620} />
            <Heading level={3} className={styles.categoryTitle}>concat, combineLatest, expand, limitRate</Heading>
            <CodeEditor code={moreOperatorsCode} language="kotlin" readOnly height={640} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 7: Error Handling */}
      <section id="error-handling" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Error Handling</Heading>
            <Text className={styles.sectionDescription}>
              Errors are <strong>first-class signals</strong> that propagate downstream and terminate the stream unless handled with recovery operators.
            </Text>
            <CodeEditor code={errorHandlingCode} language="kotlin" readOnly height={620} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Async Programming Patterns */}
      <section id="async-patterns" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Async Programming Patterns</Heading>
            <Text className={styles.sectionDescription}>
              Parallel processing, schedulers, and event-driven patterns with Reactor Sinks.
            </Text>
            <CodeEditor code={parallelProcessingCode} language="kotlin" readOnly height={620} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>SCHEDULERS</div>
              <Text className={styles.infoText}>
                <code>parallel()</code> — CPU-bound (cores count) &middot; <code>boundedElastic()</code> — I/O-bound (wrapping blocking calls) &middot; <code>single()</code> — sequential tasks &middot; <code>immediate()</code> — current thread.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 8: Spring WebFlux */}
      <section id="spring-webflux" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Spring WebFlux</Heading>
            <Text className={styles.sectionDescription}>
              The reactive web framework — runs on a <strong>non-blocking event loop</strong> (Netty) with two programming models: annotated controllers and functional routing.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/mvc-vs-webflux-venn.png"
                alt="Spring MVC vs Spring WebFlux Venn diagram"
                style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>MVC VS WEBFLUX</div>
              <Text className={styles.infoText}>
                <strong>Shared:</strong> @Controller, reactive clients &middot; <strong>MVC:</strong> JDBC/JPA, thread-per-request &middot; <strong>WebFlux:</strong> RouterFunction, Netty, Mono/Flux, backpressure.
              </Text>
            </div>
            <Heading level={3} className={styles.categoryTitle}>Annotated Controllers</Heading>
            <Text className={styles.sectionDescription}>
              Same as Spring MVC but with <code>Mono</code>/<code>Flux</code> return types. The framework handles subscription and backpressure.
            </Text>
            <CodeEditor code={springWebFluxControllerCode} language="kotlin" readOnly height={580} />
            <Heading level={3} className={styles.categoryTitle}>Functional Routing</Heading>
            <Text className={styles.sectionDescription}>
              Separates route definitions from handler logic. More composable and testable.
            </Text>
            <CodeEditor code={springWebFluxFunctionalCode} language="kotlin" readOnly height={740} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 9: WebClient */}
      <section id="webclient" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>WebClient</Heading>
            <Text className={styles.sectionDescription}>
              The non-blocking replacement for <code>RestTemplate</code> — streaming, timeouts, retries built-in.
            </Text>
            <CodeEditor code={webClientCode} language="kotlin" readOnly height={680} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* WebClient vs RestTemplate */}
      <section className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={3} className={styles.categoryTitle}>WebClient vs RestTemplate</Heading>
            <CodeComparison
              comparisonId="resttemplate-vs-webclient"
              language="kotlin"
              wrong={restTemplateBlockingCode}
              good={webClientReactiveCode}
              whatToNoticeBad={[
                "RestTemplate blocks the thread for the entire HTTP roundtrip",
                "One thread per request: 200 concurrent users = 200 blocked threads",
                "RestTemplate is in maintenance mode since Spring 5 (deprecated)",
              ]}
              whatToNoticeGood={[
                "WebClient returns Mono/Flux immediately — thread goes back to the pool",
                "Small thread pool handles thousands of concurrent connections",
                "Built-in support for streaming (Flux), timeouts, retries, and backpressure",
              ]}
              blogMode
            />
            <Heading level={3} className={styles.categoryTitle}>Sequential vs Parallel Calls</Heading>
            <CodeComparison
              comparisonId="sequential-vs-parallel"
              language="kotlin"
              wrong={sequentialCallsCode}
              good={parallelCallsCode}
              whatToNoticeBad={[
                "flatMap chains create sequential dependency — each call waits",
                "Total time = sum of ALL call latencies",
              ]}
              whatToNoticeGood={[
                "Mono.zip() fires all calls simultaneously and combines results",
                "Total time = slowest single call (massive speedup)",
              ]}
              blogMode
            />
            <Heading level={3} className={styles.categoryTitle}>Latency Optimization</Heading>
            <CodeEditor code={latencyOptimizationCode} language="kotlin" readOnly height={580} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 10: Server-Sent Events */}
      <section id="sse" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Server-Sent Events (SSE)</Heading>
            <Text className={styles.sectionDescription}>
              Server pushes data to clients over a long-lived connection. A <code>Flux</code> naturally maps to an SSE stream.
            </Text>
            <CodeEditor code={sseCode} language="kotlin" readOnly height={560} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>USE CASES</div>
              <Text className={styles.infoText}>
                Real-time dashboards, live notifications, stock price tickers, chat applications, log streaming, CI/CD build status updates — anywhere you need the server to push updates without the client polling.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 11: Testing */}
      <section id="testing" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Testing Reactive Code</Heading>
            <Text className={styles.sectionDescription}>
              <code>StepVerifier</code> from <code>reactor-test</code> — assert elements, verify completion, test errors without blocking.
            </Text>
            <CodeEditor code={testingReactiveCode} language="kotlin" readOnly height={680} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Reactive Repositories */}
      <section id="reactive-repos" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Reactive Repositories</Heading>
            <Text className={styles.sectionDescription}>
              Non-blocking data access with <strong>R2DBC</strong>, <strong>MongoDB</strong>, and <strong>Couchbase</strong> — returning <code>Mono</code> and <code>Flux</code>.
            </Text>
            <CodeEditor code={reactiveReposCode} language="kotlin" readOnly height={780} />
            <Heading level={3} className={styles.categoryTitle}>Concurrency Control</Heading>
            <Text className={styles.sectionDescription}>
              <strong>Optimistic locking</strong> with <code>@Version</code> — no locks held across async boundaries.
            </Text>
            <CodeEditor code={concurrencyControlCode} language="kotlin" readOnly height={520} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* CAP Theorem */}
      <section id="cap-theorem" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>CAP Theorem</Heading>
            <Text className={styles.sectionDescription}>
              Distributed stores guarantee at most two of: <strong>Consistency</strong>, <strong>Availability</strong>, <strong>Partition Tolerance</strong>. Reactive microservices typically choose AP with eventual consistency.
            </Text>
            <CodeEditor code={capTheoremCode} language="kotlin" readOnly height={580} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Kafka Messaging */}
      <section id="kafka-messaging" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Messaging with Kafka</Heading>
            <Text className={styles.sectionDescription}>
              Kafka + Reactor for fully non-blocking event-driven pipelines. Messages consumed as <code>Flux</code> streams.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/kafka-pub-sub-architecture.png"
                alt="Kafka Pub-Sub architecture — Producers, Topics, Kafka Broker, Consumer Groups, Kafka Streams"
                style={{ width: "100%", maxWidth: "500px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Kafka Pub-Sub architecture — Producers → Topics → Kafka Broker → Consumer Groups
              </Text>
            </div>
            <CodeEditor code={kafkaReactiveCode} language="kotlin" readOnly height={600} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>PUB-SUB</div>
              <Text className={styles.infoText}>
                Publisher &rarr; Broker (Kafka) &rarr; Subscriber. Topic-based or content-based routing.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Saga Pattern */}
      <section id="saga-pattern" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Saga Pattern</Heading>
            <Text className={styles.sectionDescription}>
              A sequence of local transactions with <strong>compensating actions</strong> — the reactive alternative to 2PC for distributed transactions.
            </Text>
            <CodeEditor code={sagaPatternCode} language="kotlin" readOnly height={560} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>ORCHESTRATION</div>
              <Text className={styles.infoText}>
                Create Order &rarr; Charge Payment &rarr; Reserve Inventory &rarr; Confirm. If Step 3 fails, compensations run in reverse. Services must be <strong>idempotent</strong>.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Resilience Patterns */}
      <section id="resilience" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Resilience Patterns</Heading>
            <Text className={styles.sectionDescription}>
              <strong>Resilience4j</strong> Circuit Breaker, Bulkhead, and Retry — preventing cascading failures in reactive systems.
            </Text>
            <CodeEditor code={resilienceCode} language="kotlin" readOnly height={600} />
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <div className={styles.infoBoxLabel}>CIRCUIT BREAKER</div>
              <Text className={styles.infoText}>
                CLOSED (normal) &rarr; OPEN (failures exceed threshold) &rarr; HALF-OPEN (test recovery) &rarr; CLOSED or back to OPEN.
              </Text>
            </div>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Spring Cloud Gateway */}
      <section id="cloud-gateway" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Spring Cloud Gateway</Heading>
            <Text className={styles.sectionDescription}>
              Reactive API gateway built on WebFlux — routing, rate limiting, circuit breaking, all non-blocking.
            </Text>
            <CodeEditor code={cloudGatewayCode} language="kotlin" readOnly height={780} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Section 12: Dependencies */}
      <section id="dependencies" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Gradle Dependencies</Heading>
            <Text className={styles.sectionDescription}>
              Here are the essential dependencies to get started with Spring Reactive in a Kotlin project:
            </Text>
            <CodeEditor code={gradleDepsCode} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      {/* Recap */}
      <section className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Key Takeaways</Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>Mono</strong> (0..1) and <strong>Flux</strong> (0..N) are the reactive building blocks</li>
              <li><strong>Backpressure</strong> via <code>request(n)</code> prevents producers from overwhelming consumers</li>
              <li><strong>WebFlux</strong> runs on Netty event loop — never <code>.block()</code> on it</li>
              <li><strong>WebClient</strong> replaces RestTemplate — use <code>Mono.zip()</code> for parallel calls</li>
              <li><strong>Saga Pattern</strong> for distributed transactions, <strong>Resilience4j</strong> for fault tolerance</li>
              <li><strong>Spring Cloud Gateway</strong> ties it all together as the reactive API entry point</li>
            </ul>
          </Stack>
        </Card>
        </AnimatedSection>
      </section>

      <nav className={styles.navigation}>
        <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
          ← Back to Blog
        </ButtonLink>
        <ButtonLink href={createLocalizedPath("/developer-section/blog/kotlin-spring-reactivity")} variant="primary">
          Spring Reactive with Kotlin →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
