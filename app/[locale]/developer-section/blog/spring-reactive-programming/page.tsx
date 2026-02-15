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
        <Heading className={styles.title}>{postContent?.title || "Mastering Spring Reactive Programming"}</Heading>
        <Text className={styles.subtitle}>
          A comprehensive guide to reactive programming with Spring. From the <strong>Reactive Manifesto</strong> and <strong>Reactive Streams</strong> specification to <strong>Project Reactor</strong>, <strong>Spring WebFlux</strong>, and production-ready reactive patterns — all with Kotlin code examples.
        </Text>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Contents:</strong> Introducing Reactive Programming — Reactive Manifesto — Reactive Streams — Spring Framework Foundations — RxJava &amp; Reactor — Mono &amp; Flux — Hot vs Cold Publishers — Lazy vs Eager — Backpressure — Operators — Advanced Operators — Error Handling — Async Patterns — Spring WebFlux — WebClient — Reactive Repositories — CAP Theorem — Kafka Messaging — Saga Pattern — Resilience — Spring Cloud Gateway — SSE — Testing.
          </Text>
        </div>
        <nav className={styles.sectionDescription} style={{ marginTop: "1.5rem" }} aria-label="Course contents">
          <strong style={{ color: "rgba(255,255,255,0.95)" }}>Jump to:</strong>{" "}
          <a href="#introducing-reactive" className="text-cyan-300 hover:underline">Intro</a>
          {" · "}
          <a href="#reactive-manifesto" className="text-cyan-300 hover:underline">Manifesto</a>
          {" · "}
          <a href="#reactive-streams" className="text-cyan-300 hover:underline">Streams</a>
          {" · "}
          <a href="#spring-foundations" className="text-cyan-300 hover:underline">Spring</a>
          {" · "}
          <a href="#rxjava-reactor" className="text-cyan-300 hover:underline">RxJava</a>
          {" · "}
          <a href="#mono-and-flux" className="text-cyan-300 hover:underline">Mono &amp; Flux</a>
          {" · "}
          <a href="#hot-vs-cold" className="text-cyan-300 hover:underline">Hot/Cold</a>
          {" · "}
          <a href="#lazy-vs-eager" className="text-cyan-300 hover:underline">Lazy/Eager</a>
          {" · "}
          <a href="#backpressure" className="text-cyan-300 hover:underline">Backpressure</a>
          {" · "}
          <a href="#operators" className="text-cyan-300 hover:underline">Operators</a>
          {" · "}
          <a href="#advanced-operators" className="text-cyan-300 hover:underline">Advanced Ops</a>
          {" · "}
          <a href="#error-handling" className="text-cyan-300 hover:underline">Errors</a>
          {" · "}
          <a href="#async-patterns" className="text-cyan-300 hover:underline">Async</a>
          {" · "}
          <a href="#spring-webflux" className="text-cyan-300 hover:underline">WebFlux</a>
          {" · "}
          <a href="#webclient" className="text-cyan-300 hover:underline">WebClient</a>
          {" · "}
          <a href="#reactive-repos" className="text-cyan-300 hover:underline">Repos</a>
          {" · "}
          <a href="#cap-theorem" className="text-cyan-300 hover:underline">CAP</a>
          {" · "}
          <a href="#kafka-messaging" className="text-cyan-300 hover:underline">Kafka</a>
          {" · "}
          <a href="#saga-pattern" className="text-cyan-300 hover:underline">Saga</a>
          {" · "}
          <a href="#resilience" className="text-cyan-300 hover:underline">Resilience</a>
          {" · "}
          <a href="#cloud-gateway" className="text-cyan-300 hover:underline">Gateway</a>
          {" · "}
          <a href="#sse" className="text-cyan-300 hover:underline">SSE</a>
          {" · "}
          <a href="#testing" className="text-cyan-300 hover:underline">Testing</a>
        </nav>
      </div>

      {/* Section 1: Introducing Reactive Programming */}
      <section id="introducing-reactive" className={styles.section}>
        <AnimatedSection>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>Introducing Reactive Programming</Heading>
            <Text className={styles.sectionDescription}>
              Reactive programming is defined in several ways:
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>DEFINITION 1</div>
              <Text className={styles.infoText}>
                Declarative programming with an emphasis on <strong>asynchronous data streams</strong> and <strong>change propagation</strong> is known as reactive programming.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>DEFINITION 2</div>
              <Text className={styles.infoText}>
                Programming with <strong>asynchronous data streams</strong> is known as reactive programming.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>DEFINITION 3</div>
              <Text className={styles.infoText}>
                Reactive programming&apos;s fundamental tenet is that some data types express values that change over time. The values of computations involving these time-varying variables will also vary over time.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>DEFINITION 4</div>
              <Text className={styles.infoText}>
                Reactive programming is a <strong>micro-architecture technique</strong> that uses event consumption and intelligent routing to modify behavior.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <div className={styles.infoBoxLabel}>DEFINITION 5</div>
              <Text className={styles.infoText}>
                A programming paradigm called reactive programming addresses <strong>asynchronous data streams</strong> and the particular spread of change.
              </Text>
            </div>
            <Text className={styles.sectionDescription}>
              At its core, reactive programming is about building systems that react to <strong>data as it flows</strong>, rather than waiting for results. Instead of blocking a thread while waiting for a database query or an HTTP response, reactive programs describe a pipeline of transformations that execute when data becomes available.
            </Text>
            <Text className={styles.sectionDescription}>
              Observable interfaces and functional programming are always brought up while discussing reactive programming. An <strong>Observable</strong> is one sort of data source where observers can be registered. A class of objects known as <strong>Subscribers</strong> is able to subscribe to a topic and receive updates anytime there is any change made to the subject. The subject keeps track of its observers and automatically updates the list if something changes.
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

            <Heading level={3} className={styles.categoryTitle}>The Three Principles of Reactive Programming</Heading>
            <Text className={styles.sectionDescription}>
              Let&apos;s understand Reactive programming with the following three principles: <strong>Asynchronous</strong>, <strong>Streams</strong>, and <strong>Propagation of change</strong>.
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>1. ASYNCHRONOUS</div>
              <Text className={styles.infoText}>
                When you run an application asynchronously, you can start working on another activity before the previous one is finished, saving you time. When using the reactive method, a database call returns right away rather than blocking the calling thread. The sequence of events in the software is asynchronous — you start working on the previous assignment in the background and then immediately move on to the next. As a result, the system can handle more jobs with reduced resource consumption.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>2. STREAMS</div>
              <Text className={styles.infoText}>
                Also known as <strong>data streams</strong>, these are the foundation of reactive programming. The data stream can be thought of as a pipeline of procedures that are applied to the data as it flows through them to alter or change it. Every value stream or sequence of values is referred to as an <strong>observable</strong> in reactive programming.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>3. PROPAGATION OF CHANGE</div>
              <Text className={styles.infoText}>
                When a value changes upstream, all downstream computations that depend on it are automatically re-evaluated. This is the &quot;spreadsheet model&quot; — change one cell and every formula that references it updates instantly. In reactive systems, this propagation happens asynchronously through the stream pipeline.
              </Text>
            </div>
            <CodeEditor code={threePrinciplesCode} language="kotlin" readOnly height={500} />

            <Text className={styles.sectionDescription}>
              <strong>Imperative vs Reactive:</strong> The fundamental shift is from &quot;pull&quot; (blocking, thread-per-request) to &quot;push&quot; (non-blocking, event-driven). Here&apos;s what that looks like in code:
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
              The <strong>Reactive Manifesto</strong> defines four key principles that reactive systems must embody. These are the architectural pillars upon which Spring WebFlux and Project Reactor are built.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/reactive-manifesto.png"
                alt="Reactive Manifesto — Responsive, Resilient, Elastic, Message Driven"
                style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>RESPONSIVE</div>
              <Text className={styles.infoText}>
                A responsive system responds in a timely manner. Responsiveness is the cornerstone of usability and utility. Reactive systems must respond to requests on time — it means the system establishes reliable upper bounds for response times, delivering a consistent quality of service.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>RESILIENT</div>
              <Text className={styles.infoText}>
                A reactive system needs to be built for failures and know how to handle them to remain responsive in the face of errors (crash, timeout, 500 errors, and so on). Resilience is achieved by replication, containment, isolation, and delegation. Failures are contained within each component, isolating components from each other.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>ELASTIC</div>
              <Text className={styles.infoText}>
                A system that responds to stimuli must continue to do so when loads change. It needs to be able to handle the load with the least amount of resources and scale up and down. Reactive Systems can react to changes in the input rate by increasing or decreasing the resources allocated to service these inputs. This implies designs that have no contention points or central bottlenecks.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>MESSAGE DRIVEN</div>
              <Text className={styles.infoText}>
                Asynchronous message passing is used by reactive system components to communicate with one another. This ensures loose coupling, isolation, and location transparency. Non-blocking communication allows recipients to only consume resources while active, leading to less system overhead.
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
              Reactive Streams is a specification (now part of <code>java.util.concurrent.Flow</code> in Java 9+) that defines the contract for asynchronous stream processing with <strong>non-blocking backpressure</strong>. It has four core interfaces:
            </Text>
            <CodeEditor code={reactiveStreamsInterfacesCode} language="kotlin" readOnly height={440} />
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>KEY INSIGHT</div>
              <Text className={styles.infoText}>
                <strong>Publisher</strong> produces data. <strong>Subscriber</strong> consumes data. <strong>Subscription</strong> is the link between them and enables <strong>backpressure</strong> — the subscriber controls how much data it can handle via <code>request(n)</code>. <strong>Processor</strong> is both a subscriber and a publisher (acts as a transformation stage).
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
              Before diving deeper into reactive programming, it&apos;s essential to understand the <strong>Spring Framework</strong> foundations that reactive Spring builds upon: <strong>Inversion of Control (IoC)</strong> and <strong>Dependency Injection (DI)</strong>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>IoC &amp; Dependency Injection</Heading>
            <Text className={styles.sectionDescription}>
              Inversion of Control transfers control of program elements from developers to a container/framework. Dependency Injection is a pattern for implementing IoC — an assembler joins objects together rather than individual objects managing their own dependencies. This decouples implementation from execution, enables modularity, and simplifies testing through component isolation.
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
              <strong>RxJava</strong> is the JVM implementation of ReactiveX — the library that popularized reactive programming. <strong>Project Reactor</strong> is the 4th-generation reactive library based on the Reactive Streams specification, and it&apos;s what Spring WebFlux uses under the hood. While RxJava paved the way, Reactor is Spring&apos;s native choice.
            </Text>
            <CodeEditor code={rxJavaBasicsCode} language="kotlin" readOnly height={440} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>RXJAVA VS REACTOR: DETAILED COMPARISON</div>
              <Text className={styles.infoText}>
                <strong>RxJava 3:</strong> <code>Observable</code>, <code>Single</code>, <code>Maybe</code>, <code>Completable</code>, <code>Flowable</code>. Does NOT fully implement Reactive Streams (only Flowable does). Netflix origin.<br/>
                <strong>Project Reactor:</strong> <code>Flux</code> (0..N), <code>Mono</code> (0..1). Fully implements Reactive Streams spec. Spring-native. Better Java 8+ integration.<br/>
                <strong>Key difference:</strong> Reactor was designed from the ground up for Reactive Streams compliance and is the default choice for Spring WebFlux. RxJava remains popular for Android development.
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
              <strong>Project Reactor</strong> is the reactive library used by Spring WebFlux. It provides two core types that implement the <code>Publisher</code> interface:
            </Text>
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <Text className={styles.infoText}>
                <strong>In this section:</strong> Mono&lt;T&gt; creation and subscription — Flux&lt;T&gt; streams and operators — When to use Mono vs Flux — Marble diagram reading
              </Text>
            </div>
            <Heading level={3} className={styles.categoryTitle}>Mono&lt;T&gt; — 0 or 1 Element</Heading>
            <Text className={styles.sectionDescription}>
              Think of <code>Mono</code> as a reactive <code>Optional</code> — it will emit at most one item, then complete. Perfect for single-value operations like finding a record by ID or saving an entity.
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
              <code>Flux</code> represents a stream of 0 to N elements. Use it for collections, event streams, or any scenario where multiple values are emitted over time.
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
              Understanding the difference between <strong>hot</strong> and <strong>cold</strong> publishers is crucial. A <strong>cold publisher</strong> generates data anew for each subscription — nothing happens before <code>subscribe()</code>. A <strong>hot publisher</strong> emits data regardless of subscribers; late subscribers miss earlier events.
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
              A subtle but important distinction in Reactor: <code>Mono.just()</code> evaluates its argument <strong>eagerly</strong> (immediately), while <code>Mono.defer()</code> and <code>Mono.fromCallable()</code> evaluate <strong>lazily</strong> (only when subscribed). This matters when the value is expensive to compute.
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
              Backpressure is one of the most important concepts in reactive programming. It&apos;s the mechanism by which a <strong>consumer signals to the producer</strong> how much data it can handle. Without backpressure, a fast producer could overwhelm a slow consumer, leading to out-of-memory errors or dropped data.
            </Text>
            <CodeEditor code={backpressureCode} language="kotlin" readOnly height={520} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>WHY IT MATTERS</div>
              <Text className={styles.infoText}>
                In production, backpressure prevents your application from crashing when a database query returns millions of rows, when an external API sends data faster than you can process it, or when thousands of WebSocket clients flood your server with messages.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>BACKPRESSURE OVERFLOW STRATEGIES</div>
              <Text className={styles.infoText}>
                <code>onBackpressureBuffer()</code> — Buffer excess items in memory (risk: OOM if unbounded).<br/>
                <code>onBackpressureBuffer(maxSize, DROP_OLDEST)</code> — Buffer with max size, drop oldest when full.<br/>
                <code>onBackpressureBuffer(maxSize, DROP_LATEST)</code> — Buffer with max size, drop newest when full.<br/>
                <code>onBackpressureDrop()</code> — Drop items the consumer cannot keep up with.<br/>
                <code>onBackpressureLatest()</code> — Keep only the most recent item, drop the rest.<br/>
                <code>onBackpressureError()</code> — Signal <code>MissingBackpressureException</code> when overwhelmed.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <Text className={styles.infoText}>
                <strong>CRITICAL:</strong> Never use unbounded <code>onBackpressureBuffer()</code> in production without a max size. An unbounded buffer under sustained load WILL cause OutOfMemoryError.
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
              Operators are the vocabulary of reactive programming. They let you <strong>transform</strong>, <strong>filter</strong>, <strong>combine</strong>, and <strong>control</strong> data streams declaratively. Master these and you can express complex async logic in clean, readable pipelines.
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
              Beyond the basics, Reactor provides powerful operators for <strong>reusable transformations</strong>, <strong>batching</strong>, <strong>caching</strong>, <strong>grouping</strong>, and <strong>recursive expansion</strong>. These are essential for production-grade reactive pipelines.
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
            <Heading level={2} className={styles.sectionTitle}>Error Handling in Reactive Streams</Heading>
            <Text className={styles.sectionDescription}>
              In reactive programming, errors are <strong>first-class signals</strong>. When an error occurs in a pipeline, it propagates downstream and terminates the stream — unless you handle it. Reactor provides powerful operators for error recovery, fallbacks, and retries.
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
              Asynchronous programming means executing tasks concurrently with non-blocking operations. It relies on callbacks, promises, and reactive streams. The benefits: improved performance, scalability, better resource efficiency, and the ability to handle thousands of concurrent connections with a small thread pool.
            </Text>
            <CodeEditor code={parallelProcessingCode} language="kotlin" readOnly height={620} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <div className={styles.infoBoxLabel}>SCHEDULERS IN DEPTH</div>
              <Text className={styles.infoText}>
                <strong>Schedulers.parallel()</strong> — Fixed pool, thread count = CPU cores. Use for CPU-bound computation (data transformation, encryption, compression). Never block on this scheduler.<br/>
                <strong>Schedulers.boundedElastic()</strong> — Bounded, elastic thread pool (default max 10x CPU cores, 100K queued tasks). Use for I/O-bound work: wrapping blocking calls (JDBC, file I/O) via <code>subscribeOn(Schedulers.boundedElastic())</code>.<br/>
                <strong>Schedulers.single()</strong> — Single reusable thread. Use for sequential tasks that must not run concurrently (e.g., writing to a shared log file).<br/>
                <strong>Schedulers.immediate()</strong> — Execute on the current thread. Zero scheduling overhead. Use for testing or when you explicitly want no thread switching.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <Text className={styles.infoText}>
                <strong>CRITICAL:</strong> Never call <code>.block()</code> on the Netty event loop thread. This will throw <code>IllegalStateException</code> and can deadlock your application. Wrap blocking calls with <code>Mono.fromCallable(...).subscribeOn(Schedulers.boundedElastic())</code>.
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
              Spring WebFlux is the reactive web framework in Spring. It runs on a <strong>non-blocking event loop</strong> (Netty by default) instead of a thread-per-request model (Tomcat). It supports two programming models: <strong>annotated controllers</strong> (familiar <code>@RestController</code>) and <strong>functional routing</strong>.
            </Text>
            <div className={styles.conceptImage}>
              <img
                src="/images/spring-reactive/mvc-vs-webflux-venn.png"
                alt="Spring MVC vs Spring WebFlux Venn diagram — shared and unique features"
                style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", margin: "0 auto", display: "block", background: "white", padding: "1rem" }}
              />
              <Text className={styles.infoText} style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", opacity: 0.6 }}>
                Spring MVC vs Spring WebFlux — shared: @Controller, Reactive clients, Tomcat/Jetty/Undertow
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <div className={styles.infoBoxLabel}>SPRING MVC VS SPRING WEBFLUX</div>
              <Text className={styles.infoText}>
                <strong>Shared:</strong> @Controller, @RequestMapping, reactive HTTP clients, Tomcat/Jetty/Undertow support.<br/>
                <strong>MVC only:</strong> Imperative programming, JDBC/JPA, synchronous filters, thread-per-request model.<br/>
                <strong>WebFlux only:</strong> Functional endpoints (RouterFunction), event loop model, Netty server, Reactor types (Mono/Flux), backpressure support.<br/>
                <strong>When to choose WebFlux:</strong> High-concurrency APIs, streaming/real-time data, microservices with many outbound HTTP calls, applications where thread efficiency matters.
              </Text>
            </div>
            <Heading level={3} className={styles.categoryTitle}>Annotated Controllers</Heading>
            <Text className={styles.sectionDescription}>
              The annotated style looks exactly like Spring MVC — but the return types are <code>Mono</code> and <code>Flux</code> instead of plain objects. The framework handles subscription and backpressure for you.
            </Text>
            <CodeEditor code={springWebFluxControllerCode} language="kotlin" readOnly height={580} />
            <Heading level={3} className={styles.categoryTitle}>Functional Routing</Heading>
            <Text className={styles.sectionDescription}>
              Functional routing separates route definitions from handler logic. It&apos;s more explicit, composable, and testable — preferred in many reactive projects.
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
            <Heading level={2} className={styles.sectionTitle}>WebClient: Non-Blocking HTTP Client</Heading>
            <Text className={styles.sectionDescription}>
              <code>WebClient</code> is the reactive replacement for <code>RestTemplate</code>. It&apos;s fully non-blocking and supports streaming, timeouts, retries, and error handling out of the box.
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
            <Text className={styles.sectionDescription}>
              <code>RestTemplate</code> is synchronous and blocking — the thread waits idle during the entire HTTP call. <code>WebClient</code> is non-blocking — the thread is free to handle other requests. As of Spring 5, RestTemplate is in maintenance mode and WebClient is the recommended replacement.
            </Text>
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
            <Text className={styles.sectionDescription}>
              One of the most powerful patterns in reactive programming: firing multiple HTTP calls in <strong>parallel</strong> with <code>Mono.zip()</code> instead of chaining them <strong>sequentially</strong> with <code>flatMap</code>. The total time drops from the sum of all calls to just the slowest one.
            </Text>
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
            <Text className={styles.sectionDescription}>
              Production-grade WebClient configurations include connection pooling, DNS caching, timeouts, retries, and response caching:
            </Text>
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
              SSE allows the server to <strong>push data to the client</strong> over a long-lived HTTP connection. In reactive Spring, a <code>Flux</code> naturally maps to an SSE stream — each emitted item becomes an event sent to the client.
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
              <code>StepVerifier</code> from <code>reactor-test</code> is the standard tool for testing reactive streams. It lets you assert on each element emitted, verify completion, and test error scenarios — all without blocking.
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
              Reactive data access means the database driver itself is non-blocking. Spring provides reactive repository support for <strong>R2DBC</strong> (PostgreSQL, MySQL, H2), <strong>MongoDB</strong>, and <strong>Couchbase</strong>. Each extends a reactive base interface that returns <code>Mono</code> and <code>Flux</code> instead of blocking types.
            </Text>
            <CodeEditor code={reactiveReposCode} language="kotlin" readOnly height={780} />
            <Heading level={3} className={styles.categoryTitle}>Concurrency Control</Heading>
            <Text className={styles.sectionDescription}>
              In reactive systems, <strong>optimistic locking</strong> is preferred over pessimistic locking because it doesn&apos;t hold locks across async boundaries. Use a <code>@Version</code> field — if two transactions try to update the same document, the second one gets an <code>OptimisticLockingFailureException</code> and retries.
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
            <Heading level={2} className={styles.sectionTitle}>CAP Theorem &amp; Distributed Data</Heading>
            <Text className={styles.sectionDescription}>
              The <strong>CAP Theorem</strong> states that a distributed data store can guarantee at most two of three properties: <strong>Consistency</strong>, <strong>Availability</strong>, and <strong>Partition Tolerance</strong>. In reactive microservices, we typically choose <strong>AP</strong> (Availability + Partition Tolerance) and rely on eventual consistency with the Saga pattern for distributed transactions.
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
              Reactive messaging combines <strong>Kafka</strong> with <strong>Reactor</strong> to create fully non-blocking event-driven pipelines. Kafka messages are consumed and exposed as a <code>Flux</code> stream, which can be streamed to clients via SSE (Server-Sent Events) or processed through reactive pipelines.
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
              <div className={styles.infoBoxLabel}>PUB-SUB MODEL</div>
              <Text className={styles.infoText}>
                Three components: <strong>Publisher</strong> (produces messages), <strong>Subscriber</strong> (consumes messages), <strong>Message Broker</strong> (Kafka, RabbitMQ). Two types: <strong>Topic-Based</strong> (subscribers choose topics) and <strong>Content-Based</strong> (routing based on message content). Channel types: Point-to-Point, Publish-Subscribe, Request-Reply, and Dead Letter Channels.
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
            <Heading level={2} className={styles.sectionTitle}>Saga Pattern: Distributed Transactions</Heading>
            <Text className={styles.sectionDescription}>
              In microservices, you can&apos;t use a single database transaction across services. The <strong>Saga Pattern</strong> solves this with a sequence of local transactions, each with a <strong>compensating action</strong> that undoes the work if a downstream step fails. This is the reactive alternative to Two-Phase Commit (2PC).
            </Text>
            <CodeEditor code={sagaPatternCode} language="kotlin" readOnly height={560} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <div className={styles.infoBoxLabel}>KEY CHALLENGES</div>
              <Text className={styles.infoText}>
                Lack of atomicity across services. Ensuring data consistency (eventual consistency). Handling compensating transactions correctly. Message delivery guarantees (idempotent services). Debugging distributed flows (use Spring Cloud Sleuth + Zipkin for distributed tracing).
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>SAGA ORCHESTRATION FLOW</div>
              <Text className={styles.infoText}>
                <strong>Step 1:</strong> Create Order (compensate: Cancel Order)<br/>
                <strong>Step 2:</strong> Charge Payment (compensate: Refund Payment)<br/>
                <strong>Step 3:</strong> Reserve Inventory (compensate: Release Inventory)<br/>
                <strong>Step 4:</strong> Send Confirmation (no compensation needed)<br/><br/>
                If Step 3 fails: execute Refund Payment (Step 2 compensation), then Cancel Order (Step 1 compensation). Each compensation runs in reverse order. Services must be <strong>idempotent</strong> — retrying a compensation must produce the same result.
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
              Production reactive systems must be resilient to failures. <strong>Resilience4j</strong> provides Circuit Breaker, Bulkhead, and Retry patterns that integrate seamlessly with Project Reactor. These prevent cascading failures and ensure graceful degradation.
            </Text>
            <CodeEditor code={resilienceCode} language="kotlin" readOnly height={600} />
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <div className={styles.infoBoxLabel}>CIRCUIT BREAKER STATE MACHINE</div>
              <Text className={styles.infoText}>
                <strong>CLOSED</strong> (normal operation) — All requests pass through. Failures are counted in a sliding window. When failure rate exceeds threshold (e.g. 50% of last 10 calls), transition to OPEN.<br/>
                <strong>OPEN</strong> (circuit tripped) — All requests immediately go to fallback. No calls reach the downstream service. After <code>waitDurationInOpenState</code> (e.g. 10s), transition to HALF-OPEN.<br/>
                <strong>HALF-OPEN</strong> (recovery test) — A limited number of test requests pass through. If they succeed, transition back to CLOSED. If they fail, transition back to OPEN.<br/>
                <strong>Flow:</strong> CLOSED → (failure threshold exceeded) → OPEN → (wait duration elapsed) → HALF-OPEN → (success) → CLOSED / (failure) → OPEN
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
              Spring Cloud Gateway is a reactive API gateway built on <strong>Spring WebFlux</strong>. It provides dynamic routing, predicates, filters, path rewriting, rate limiting, circuit breaking, and metrics — all fully non-blocking. It&apos;s the entry point for your reactive microservices architecture.
            </Text>
            <CodeEditor code={cloudGatewayCode} language="kotlin" readOnly height={780} />
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <div className={styles.infoBoxLabel}>GATEWAY FEATURES</div>
              <Text className={styles.infoText}>
                <strong>Predicates</strong>: Match routes by path, header, method, query params. <strong>Filters</strong>: Modify requests/responses (add headers, strip prefix, rate limit). <strong>Load Balancing</strong>: <code>lb://SERVICE-NAME</code> integrates with Eureka/Consul. <strong>Rate Limiting</strong>: Token bucket algorithm with Redis. <strong>Circuit Breaking</strong>: Per-route Resilience4j integration.
              </Text>
            </div>
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
            <Heading level={2} className={styles.sectionTitle}>Recap: Key Takeaways</Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Reactive programming = <strong>Observable + Change + Propagation to Observers</strong>. Three principles: Asynchronous, Streams, Propagation of change.</li>
              <li>The <strong>Reactive Manifesto</strong> defines four pillars: Responsive, Resilient, Elastic, and Message Driven.</li>
              <li><strong>Reactive Streams</strong> specification: Publisher, Subscriber, Subscription, Processor — Project Reactor implements it.</li>
              <li>Spring Framework 6: Java 17 baseline, Jakarta EE namespace, AOT processing, GraalVM native images.</li>
              <li><strong>Mono</strong> = 0 or 1 element. <strong>Flux</strong> = 0 to N elements. <strong>Cold</strong> publishers generate data per subscriber; <strong>hot</strong> publishers emit regardless.</li>
              <li><strong>Lazy</strong> (<code>Mono.defer</code>) vs <strong>Eager</strong> (<code>Mono.just</code>) — defer computation until subscribe.</li>
              <li><strong>Backpressure</strong> prevents fast producers from overwhelming slow consumers — <code>request(n)</code> controls flow.</li>
              <li>Advanced operators: <code>transform</code> (reusable chains), <code>buffer</code> (batching), <code>cache</code> (replay), <code>groupBy</code>, <code>expand</code> (recursive).</li>
              <li>Parallel processing with <code>ParallelFlux</code> and <code>Schedulers.parallel()</code>. Event-driven with <code>Sinks</code>.</li>
              <li><strong>Spring WebFlux</strong> runs on a non-blocking event loop (Netty). Annotated controllers or functional routing.</li>
              <li><strong>WebClient</strong> replaces RestTemplate. Use <code>Mono.zip()</code> for parallel calls (total time = slowest call).</li>
              <li>Reactive repositories: <strong>R2DBC</strong> (PostgreSQL), <strong>Reactive MongoDB</strong>, <strong>Reactive Couchbase</strong>. Optimistic locking with <code>@Version</code>.</li>
              <li><strong>CAP Theorem</strong>: choose 2 of 3 (Consistency, Availability, Partition Tolerance). Reactive microservices typically choose AP.</li>
              <li><strong>Kafka + Reactor</strong>: consume messages as Flux streams, stream to clients via SSE.</li>
              <li><strong>Saga Pattern</strong>: distributed transactions via compensating actions. <strong>Circuit Breaker</strong> + <strong>Bulkhead</strong> for resilience.</li>
              <li><strong>Spring Cloud Gateway</strong>: reactive API gateway with routing, filters, rate limiting, and circuit breaking.</li>
              <li>Never <code>.block()</code> on the event loop thread — use <code>flatMap</code> for async operations.</li>
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
