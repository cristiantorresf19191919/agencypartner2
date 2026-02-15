"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../blog/BlogPostPage.module.css";
import localStyles from "./BackendInterviewPage.module.css";
import Image from "next/image";

// ─── Code Snippets ────────────────────────────────────────────────

const nullSafetyJava = `// Java — defensive checks and Optional
Optional<User> user = userRepo.findById(id);
if (user.isEmpty()) throw new NotFoundException();
return user.get();`;

const nullSafetyKotlin = `// Kotlin — type system enforces at compile time
val user = repository.findByName("Alice") ?: throw CustomerNotFoundException()
// String and String? are distinct types — no wrapper overhead`;

const platformTypesCode = `// Java library without nullability annotations
public class LegacyUserService {
    public String getUserEmail(Long id) { // returns T! (platform type)
        return userDao.findEmail(id); // might return null!
    }
}

// Kotlin caller — the compiler WON'T warn you
val email: String = legacyService.getUserEmail(42) // NPE at runtime!

// Safe approach — always treat Java returns as nullable
val email: String? = legacyService.getUserEmail(42)
val safeEmail = email ?: "no-email@default.com"

// Best approach — add JSpecify annotations to Java code
@NullMarked
public class UserService {
    public @Nullable String getUserEmail(Long id) { ... }
}`;

const immutabilityCode = `// Anti-pattern: mutable state shared across threads
class OrderService {
    private var cachedOrders = mutableListOf<Order>() // race condition!

    fun addOrder(order: Order) {
        cachedOrders.add(order) // NOT thread-safe
    }
}

// Correct: immutable data, copy-on-write semantics
data class Order(val id: Long, val items: List<OrderItem>, val status: Status)

class OrderService(private val repository: OrderRepository) {
    fun updateStatus(order: Order, newStatus: Status): Order {
        val updated = order.copy(status = newStatus) // new object, old is untouched
        repository.save(updated)
        return updated
    }
}`;

const k2CompilerCode = `// K2 Compiler — smarter smart casts (Kotlin 2.0+)
fun processInput(input: Any) {
    if (input is String && input.length > 5) {
        // K1: requires explicit cast in some complex cases
        // K2: smart cast works across when, if-else chains, and lambdas
        println(input.uppercase()) // smart cast to String
    }
}

// K2 also enables: contracts, better type inference in builders
buildList {
    add("hello") // K2 infers MutableList<String> correctly in more cases
    add("world")
}`;

const expressionExample = `// Java style (anti-pattern in Kotlin)
var status: String = ""
if (response.code == 200) { status = "Success" } else { status = "Error" }

// Idiomatic Kotlin — expressions
val status = when (response.code) {
    200 -> "Success"
    404 -> "Not Found"
    in 500..599 -> "Server Error"
    else -> "Unknown"
}`;

const extensionFunctionCode = `// Add domain-specific behavior without inheritance
fun String.toSlug(): String =
    this.lowercase()
        .replace(Regex("[^a-z0-9\\s-]"), "")
        .replace(Regex("\\s+"), "-")
        .trim('-')

// Usage
val slug = "My Blog Post Title!".toSlug() // "my-blog-post-title"

// Extension on a Spring class — cleaner DSL
fun ResponseEntity.BodyBuilder.jsonError(message: String): ResponseEntity<Map<String, String>> =
    this.body(mapOf("error" to message))

// IMPORTANT: extensions are resolved STATICALLY
open class Shape
class Circle : Shape()
fun Shape.name() = "Shape"
fun Circle.name() = "Circle"

val shape: Shape = Circle()
println(shape.name()) // prints "Shape" — NOT "Circle"!`;

const scopeFunctionExamples = `// apply — configure an object, returns the object
val user = User().apply {
    name = "Alice"
    email = "alice@example.com"
    role = Role.ADMIN
}

// let — transform + null safety, returns lambda result
val length = name?.let {
    println("Processing: $it")
    it.length
} ?: 0

// also — side effects (logging, validation), returns the object
fun createUser(request: CreateUserRequest): User =
    userRepository.save(request.toEntity())
        .also { logger.info("Created user: \${it.id}") }
        .also { eventPublisher.publish(UserCreatedEvent(it)) }

// run — configure + compute, returns lambda result
val dbConfig = config.run {
    DatabaseConfig(
        url = databaseUrl,
        poolSize = maxConnections,
        timeout = Duration.ofSeconds(connectionTimeout)
    )
}`;

const functionalBeansCode = `// Beans.kt — Functional Bean Definition DSL
val applicationBeans = beans {
    bean<UserService>()
    bean {
        val repo = ref<UserRepository>()
        val config = ref<AppConfig>()
        AuthenticationService(repo, config.tokenSecret)
    }
    profile("dev") { bean<EmailSender> { MockEmailSender() } }
    profile("prod") { bean<EmailSender> { SmtpEmailSender(env.getProperty("smtp.host")!!) } }
}

// Application.kt
fun main(args: Array<String>) {
    runApplication<MyServiceApplication>(*args) {
        addInitializers(BeansInitializer(applicationBeans))
    }
}`;

const constructorInjectionCode = `// Anti-pattern: field injection
@Service
class OrderService {
    @Autowired lateinit var repository: OrderRepository  // mutable!
    @Autowired lateinit var paymentClient: PaymentClient  // hidden deps!
}

// Correct: constructor injection (Kotlin makes this elegant)
@Service
class OrderService(
    private val repository: OrderRepository,
    private val paymentClient: PaymentClient
) {
    // val = immutable, thread-safe, easy to test with mocks
    // Dependencies are explicit in the constructor signature
    // No need for @Autowired — Spring infers single constructor
}`;

const configPropertiesCode = `// Immutable configuration with data classes
@ConfigurationProperties(prefix = "app.payment")
data class PaymentConfig(
    val apiKey: String,
    val baseUrl: String,
    val timeout: Duration = Duration.ofSeconds(30),
    val retryAttempts: Int = 3,
    val webhookSecret: String
)

// Usage — injected as a bean, immutable after startup
@Service
class PaymentService(private val config: PaymentConfig) {
    private val client = HttpClient.newBuilder()
        .connectTimeout(config.timeout)
        .build()
}

// application.yml
// app:
//   payment:
//     api-key: \${PAYMENT_API_KEY}
//     base-url: https://api.stripe.com/v1
//     webhook-secret: \${STRIPE_WEBHOOK_SECRET}`;

const customAutoConfigCode = `// Create your own Spring Boot starter
@AutoConfiguration
@ConditionalOnClass(MetricsRegistry::class)
@EnableConfigurationProperties(MetricsProperties::class)
class MetricsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    fun metricsRegistry(props: MetricsProperties): MetricsRegistry =
        MetricsRegistry(props.prefix, props.tags)

    @Bean
    @ConditionalOnProperty("app.metrics.http.enabled", havingValue = "true")
    fun httpMetricsFilter(registry: MetricsRegistry): HttpMetricsFilter =
        HttpMetricsFilter(registry)
}

// META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
// com.myapp.metrics.MetricsAutoConfiguration`;

const jpaEntityCode = `@Entity
class Customer(
    @Column(nullable = false)
    var name: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    // CRITICAL: equals/hashCode on business key or ID only
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Customer) return false
        return id != null && id == other.id
    }
    override fun hashCode(): Int = 14592834 // constant — safe for sets
}`;

const exposedDslCode = `// Exposed — type-safe SQL DSL (no ORM magic)
object Users : LongIdTable("users") {
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
}

// Type-safe queries — compile-time errors for wrong column types
suspend fun findActiveUsers(minAge: Int): List<UserDto> = newSuspendedTransaction {
    Users.selectAll()
        .where { Users.name.isNotNull() }
        .orderBy(Users.createdAt, SortOrder.DESC)
        .limit(100)
        .map { row ->
            UserDto(
                id = row[Users.id].value,
                name = row[Users.name],
                email = row[Users.email]
            )
        }
}`;

const r2dbcCode = `// Reactive persistence with R2DBC + Coroutines
@Repository
class UserRepository(private val client: DatabaseClient) {

    suspend fun findById(id: Long): User? =
        client.sql("SELECT * FROM users WHERE id = :id")
            .bind("id", id)
            .map { row, _ -> row.toUser() }
            .awaitOneOrNull()

    fun findAll(): Flow<User> =
        client.sql("SELECT * FROM users ORDER BY created_at DESC")
            .map { row, _ -> row.toUser() }
            .flow()

    suspend fun save(user: User): User =
        client.sql("""
            INSERT INTO users (name, email) VALUES (:name, :email)
            RETURNING *
        """.trimIndent())
            .bind("name", user.name)
            .bind("email", user.email)
            .map { row, _ -> row.toUser() }
            .awaitOne()
}`;

const suspendControllerCode = `@RestController
class UserController(private val service: UserService) {

    @GetMapping("/users/{id}")
    suspend fun getUser(@PathVariable id: Long): UserDto {
        return service.getUserById(id)
    }

    @GetMapping("/users")
    fun getAllUsers(): Flow<UserDto> {
        return service.getAllUsers() // returns Flow, not List — backpressure-ready
    }
}`;

const coroutineVsVirtualCode = `// Coroutines — structured concurrency, rich operators
suspend fun fetchUserDashboard(userId: Long): Dashboard = coroutineScope {
    val profile = async { userService.getProfile(userId) }
    val orders = async { orderService.getRecentOrders(userId) }
    val recommendations = async { mlService.getRecommendations(userId) }

    Dashboard(
        profile = profile.await(),
        orders = orders.await(),
        recommendations = recommendations.await()
    )
    // If any async fails, ALL are cancelled (structured concurrency)
}

// Flow — reactive streams with backpressure
fun streamPrices(symbol: String): Flow<Price> = flow {
    while (currentCoroutineContext().isActive) {
        emit(priceService.getLatestPrice(symbol))
        delay(100) // non-blocking, releases thread
    }
}
    .conflate()           // drop intermediate if consumer is slow
    .distinctUntilChanged() // skip duplicates
    .catch { e -> logger.error("Price stream error", e) }`;

const channelCode = `// Channels — producer/consumer pattern
val orderChannel = Channel<Order>(capacity = 100)

// Producer coroutine
launch {
    orderStream.collect { order ->
        orderChannel.send(order) // suspends if buffer full (backpressure)
    }
}

// Multiple consumers (fan-out)
repeat(4) { workerId ->
    launch {
        for (order in orderChannel) {
            processOrder(order) // each order processed by exactly one worker
            logger.info("Worker $workerId processed order \${order.id}")
        }
    }
}`;

const hexagonalPortCode = `// domain/port/in — Use cases (what the app CAN do)
interface CreateOrderUseCase {
    suspend fun execute(command: CreateOrderCommand): Order
}

// domain/port/out — Infrastructure contracts (what the app NEEDS)
interface OrderRepository {
    suspend fun save(order: Order): Order
    suspend fun findById(id: OrderId): Order?
}

interface PaymentGateway {
    suspend fun charge(amount: Money, method: PaymentMethod): PaymentResult
}

interface EventPublisher {
    suspend fun publish(event: DomainEvent)
}`;

const hexagonalDomainCode = `// domain/model — Pure Kotlin, NO framework annotations
data class Order private constructor(
    val id: OrderId,
    val customerId: CustomerId,
    val items: List<OrderItem>,
    val status: OrderStatus,
    val total: Money,
    val createdAt: Instant
) {
    // Business rules live HERE, not in the service
    fun cancel(): Order {
        require(status == OrderStatus.PENDING) {
            "Can only cancel pending orders, current: $status"
        }
        return copy(status = OrderStatus.CANCELLED)
    }

    fun addItem(item: OrderItem): Order {
        require(status == OrderStatus.DRAFT) { "Cannot modify non-draft order" }
        return copy(
            items = items + item,
            total = total + item.price * item.quantity
        )
    }

    companion object {
        fun create(customerId: CustomerId, items: List<OrderItem>): Order {
            require(items.isNotEmpty()) { "Order must have at least one item" }
            return Order(
                id = OrderId.generate(),
                customerId = customerId,
                items = items,
                status = OrderStatus.DRAFT,
                total = items.sumOf { it.price * it.quantity },
                createdAt = Instant.now()
            )
        }
    }
}`;

const hexagonalServiceCode = `// domain/service — Orchestrates ports, NO infrastructure awareness
@Service
class CreateOrderService(
    private val orderRepo: OrderRepository,
    private val paymentGateway: PaymentGateway,
    private val eventPublisher: EventPublisher
) : CreateOrderUseCase {

    override suspend fun execute(command: CreateOrderCommand): Order {
        val order = Order.create(command.customerId, command.items)
        val savedOrder = orderRepo.save(order)

        val paymentResult = paymentGateway.charge(order.total, command.paymentMethod)

        val confirmedOrder = when (paymentResult) {
            is PaymentResult.Success -> savedOrder.copy(status = OrderStatus.CONFIRMED)
            is PaymentResult.Declined -> savedOrder.copy(status = OrderStatus.PAYMENT_FAILED)
        }

        orderRepo.save(confirmedOrder)
        eventPublisher.publish(OrderCreatedEvent(confirmedOrder))
        return confirmedOrder
    }
}`;

const hexagonalAdapterCode = `// infrastructure/adapter/in — REST adapter (plugs into the port)
@RestController
@RequestMapping("/api/orders")
class OrderController(private val createOrder: CreateOrderUseCase) {

    @PostMapping
    suspend fun create(@RequestBody request: CreateOrderRequest): ResponseEntity<OrderResponse> {
        val command = request.toCommand() // map DTO to domain command
        val order = createOrder.execute(command)
        return ResponseEntity.status(201).body(order.toResponse())
    }
}

// infrastructure/adapter/out — JPA adapter (implements the port)
@Repository
class JpaOrderRepository(
    private val jpa: SpringDataOrderRepository
) : OrderRepository {

    override suspend fun save(order: Order): Order {
        val entity = order.toEntity()
        val saved = jpa.save(entity)
        return saved.toDomain()
    }

    override suspend fun findById(id: OrderId): Order? =
        jpa.findById(id.value)?.toDomain()
}`;

const idempotencyCode = `suspend fun processPayment(key: String, request: PaymentRequest): PaymentResponse {
    val lock = redisTemplate.opsForValue()
        .setIfAbsent(key, "PROCESSING", Duration.ofMinutes(5))
    if (lock == false) throw DuplicateRequestException()

    return try {
        val result = paymentGateway.charge(request)
        redisTemplate.opsForValue().set(key, result, Duration.ofHours(24))
        result
    } catch (e: Exception) {
        redisTemplate.delete(key)
        throw e
    }
}`;

const circuitBreakerCode = `// Resilience4j with Kotlin coroutines
@Service
class ProductClient(
    private val webClient: WebClient,
    private val circuitBreakerRegistry: CircuitBreakerRegistry
) {
    private val cb = circuitBreakerRegistry.circuitBreaker("productService") {
        failureRateThreshold(50f)
        waitDurationInOpenState(Duration.ofSeconds(30))
        slidingWindowSize(10)
        minimumNumberOfCalls(5)
    }

    suspend fun getProduct(id: Long): Product =
        cb.executeSuspendFunction {
            webClient.get()
                .uri("/products/{id}", id)
                .retrieve()
                .awaitBody<Product>()
        }
}

// States: CLOSED (normal) -> OPEN (failing, reject calls) -> HALF_OPEN (test)`;

const sagaPatternCode = `// Saga — distributed transaction via compensating actions
class OrderSaga(
    private val orderService: OrderService,
    private val paymentService: PaymentService,
    private val inventoryService: InventoryService,
    private val shippingService: ShippingService
) {
    suspend fun execute(command: CreateOrderCommand): OrderResult {
        val order = orderService.create(command)

        val payment = try {
            paymentService.charge(order)
        } catch (e: Exception) {
            orderService.cancel(order.id) // compensate
            throw e
        }

        val reservation = try {
            inventoryService.reserve(order.items)
        } catch (e: Exception) {
            paymentService.refund(payment.id) // compensate
            orderService.cancel(order.id)     // compensate
            throw e
        }

        return OrderResult(order, payment, reservation)
    }
}`;

const contextPropagationCode = `// Coroutine context propagation for tracing
val mdcContext = MDCContext() // carries MDC (trace IDs) across suspensions

suspend fun processRequest(traceId: String) {
    withContext(mdcContext + Dispatchers.IO) {
        MDC.put("traceId", traceId)
        logger.info("Processing...") // traceId is available in logs

        val result = async { externalService.call() } // traceId propagated!
        result.await()
    }
}

// application.yml — automatic propagation with Micrometer
// spring:
//   reactor:
//     context-propagation: auto
// management:
//   tracing:
//     sampling:
//       probability: 1.0`;

const mockKTestCode = `// MockK — Kotlin-first mocking (handles final classes, suspend, extensions)
class OrderServiceTest {

    private val repository = mockk<OrderRepository>()
    private val paymentGateway = mockk<PaymentGateway>()
    private val eventPublisher = mockk<EventPublisher>(relaxUnitFun = true)
    private val service = CreateOrderService(repository, paymentGateway, eventPublisher)

    @Test
    fun \`should create order and charge payment\`() = runTest {
        // Given
        val command = createOrderCommand()
        coEvery { repository.save(any()) } returnsArgument 0
        coEvery { paymentGateway.charge(any(), any()) } returns PaymentResult.Success("tx-123")

        // When
        val order = service.execute(command)

        // Then
        assertThat(order.status).isEqualTo(OrderStatus.CONFIRMED)
        coVerify(exactly = 2) { repository.save(any()) } // draft + confirmed
        coVerify { eventPublisher.publish(any<OrderCreatedEvent>()) }
    }

    @Test
    fun \`should fail order when payment is declined\`() = runTest {
        coEvery { repository.save(any()) } returnsArgument 0
        coEvery { paymentGateway.charge(any(), any()) } returns PaymentResult.Declined("insufficient funds")

        val order = service.execute(createOrderCommand())

        assertThat(order.status).isEqualTo(OrderStatus.PAYMENT_FAILED)
    }
}`;

const testcontainersCode = `// Testcontainers — real database in integration tests
@Testcontainers
@SpringBootTest
class UserRepositoryIntegrationTest {

    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:16-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { postgres.jdbcUrl }
            registry.add("spring.datasource.username") { postgres.username }
            registry.add("spring.datasource.password") { postgres.password }
        }
    }

    @Autowired
    lateinit var repository: UserRepository

    @Test
    fun \`should enforce unique email constraint\`() {
        repository.save(User(name = "Alice", email = "alice@test.com"))

        assertThrows<DataIntegrityViolationException> {
            repository.save(User(name = "Bob", email = "alice@test.com"))
        }
    }

    @Test
    fun \`should cascade delete orders when user is deleted\`() {
        val user = repository.save(User(name = "Charlie", email = "charlie@test.com"))
        orderRepository.save(Order(userId = user.id!!, total = 99.99))

        repository.deleteById(user.id!!)

        assertThat(orderRepository.findByUserId(user.id!!)).isEmpty()
    }
}`;

const archTestCode = `// ArchUnit — enforce architecture rules at compile-time
@AnalyzeClasses(packages = ["com.myapp"])
class ArchitectureTest {

    @ArchTest
    val domainShouldNotDependOnInfrastructure: ArchRule =
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .because("Domain must not know about infrastructure")

    @ArchTest
    val controllersShouldNotAccessRepositoriesDirectly: ArchRule =
        noClasses()
            .that().resideInAPackage("..adapter.in..")
            .should().dependOnClassesThat().resideInAPackage("..adapter.out..")
            .because("Input adapters should use domain ports, not output adapters")

    @ArchTest
    val servicesShouldBeSuffixed: ArchRule =
        classes()
            .that().implement(UseCase::class.java)
            .should().haveSimpleNameEndingWith("Service")
}`;

const systemDesignCode = `// Notification Service — High-Throughput Design
@Service
class NotificationService(
    private val kafka: KafkaTemplate<String, NotificationEvent>,
    private val rateLimiter: RateLimiter,
    private val templateEngine: TemplateEngine
) {
    suspend fun sendBulkNotification(
        userIds: List<Long>,
        template: NotificationTemplate
    ) {
        // Keyset pagination — no OFFSET, scales to millions
        var lastId = 0L
        do {
            val batch = userRepository.findNextBatch(afterId = lastId, limit = 1000)
            batch.forEach { user ->
                val event = NotificationEvent(
                    userId = user.id,
                    channel = user.preferredChannel,
                    content = templateEngine.render(template, user),
                    idempotencyKey = "\${template.id}-\${user.id}"
                )
                kafka.send("notifications", user.id.toString(), event)
            }
            lastId = batch.lastOrNull()?.id ?: break
        } while (batch.size == 1000)
    }
}`;

const rateLimiterCode = `// Token Bucket Rate Limiter with Coroutines
class RateLimiter(val capacity: Int, val refillRate: Int) {
    private val mutex = Mutex()
    private var tokens = capacity.toDouble()
    private var lastRefill = System.currentTimeMillis()

    suspend fun tryAcquire(): Boolean {
        mutex.withLock {
            refill()
            if (tokens >= 1) { tokens -= 1; return true }
            return false
        }
    }

    private fun refill() {
        val now = System.currentTimeMillis()
        val delta = (now - lastRefill) / 1000.0
        tokens = min(capacity.toDouble(), tokens + delta * refillRate)
        lastRefill = now
    }
}

// Usage in a filter
class RateLimitFilter(private val limiter: RateLimiter) : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> =
        mono {
            if (!limiter.tryAcquire()) {
                exchange.response.statusCode = HttpStatus.TOO_MANY_REQUESTS
                exchange.response.setComplete().awaitFirstOrNull()
            } else {
                chain.filter(exchange).awaitFirstOrNull()
            }
        }
}`;

const cqrsCode = `// CQRS — separate read and write models
// Write side: rich domain model
@Service
class OrderCommandService(
    private val repository: OrderRepository,
    private val eventStore: EventStore
) {
    suspend fun handle(cmd: PlaceOrderCommand): OrderId {
        val order = Order.create(cmd.customerId, cmd.items)
        repository.save(order)
        eventStore.append(OrderPlacedEvent(order))
        return order.id
    }
}

// Read side: optimized projection for queries
@Service
class OrderQueryService(private val readDb: OrderReadRepository) {
    suspend fun getOrderSummary(orderId: OrderId): OrderSummaryDto =
        readDb.findSummaryById(orderId) // denormalized, fast read
            ?: throw OrderNotFoundException(orderId)

    fun getOrdersByCustomer(customerId: CustomerId): Flow<OrderListItemDto> =
        readDb.streamByCustomerId(customerId) // pre-joined, no N+1
}`;

// ─── Chapter 10: API Design ────────────────────────────────────────

const restControllerCode = `// RESTful API with proper HTTP semantics
@RestController
@RequestMapping("/api/v1/products")
class ProductController(
    private val productService: ProductService,
    private val assembler: ProductModelAssembler
) {
    @GetMapping
    suspend fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(required = false) category: String?
    ): ResponseEntity<PagedModel<ProductResponse>> {
        val products = productService.findAll(
            PageRequest.of(page, size, Sort.by("createdAt").descending()),
            category
        )
        return ResponseEntity.ok(assembler.toPagedModel(products))
    }

    @PostMapping
    suspend fun create(
        @Valid @RequestBody request: CreateProductRequest
    ): ResponseEntity<ProductResponse> {
        val product = productService.create(request.toCommand())
        val uri = URI.create("/api/v1/products/\${product.id}")
        return ResponseEntity.created(uri).body(product.toResponse())
    }

    @PatchMapping("/{id}")
    suspend fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateProductRequest
    ): ResponseEntity<ProductResponse> {
        val product = productService.update(id, request.toCommand())
        return ResponseEntity.ok(product.toResponse())
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    suspend fun delete(@PathVariable id: Long) {
        productService.delete(id)
    }
}`;

const problemDetailCode = `// RFC 9457 Problem Detail — structured error responses
@RestControllerAdvice
class GlobalExceptionHandler : ResponseEntityExceptionHandler() {

    @ExceptionHandler(OrderNotFoundException::class)
    fun handleNotFound(ex: OrderNotFoundException): ProblemDetail =
        ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND,
            ex.message ?: "Resource not found"
        ).apply {
            title = "Order Not Found"
            type = URI.create("https://api.myapp.com/errors/order-not-found")
            setProperty("orderId", ex.orderId)
        }

    @ExceptionHandler(BusinessRuleViolation::class)
    fun handleBusinessRule(ex: BusinessRuleViolation): ProblemDetail =
        ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY,
            ex.message
        ).apply {
            title = "Business Rule Violation"
            type = URI.create("https://api.myapp.com/errors/business-rule")
            setProperty("rule", ex.ruleName)
        }

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleValidation(ex: ConstraintViolationException): ProblemDetail =
        ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Validation failed"
        ).apply {
            title = "Validation Error"
            setProperty("violations", ex.constraintViolations.map {
                mapOf("field" to it.propertyPath.toString(), "message" to it.message)
            })
        }
}

// Response format:
// {
//   "type": "https://api.myapp.com/errors/order-not-found",
//   "title": "Order Not Found",
//   "status": 404,
//   "detail": "Order with ID 42 does not exist",
//   "orderId": 42
// }`;

const apiVersioningCode = `// API Versioning — URI path (most explicit, widely adopted)
@RestController
@RequestMapping("/api/v1/users")
class UserControllerV1(private val service: UserService) {
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: Long): UserResponseV1 =
        service.findById(id).toResponseV1()
}

@RestController
@RequestMapping("/api/v2/users")
class UserControllerV2(private val service: UserService) {
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: Long): UserResponseV2 =
        service.findById(id).toResponseV2() // includes new fields
}

// API Versioning — Header-based (cleaner URLs)
@RestController
@RequestMapping("/api/users")
class UserController(private val service: UserService) {
    @GetMapping("/{id}", headers = ["X-API-Version=1"])
    suspend fun getUserV1(@PathVariable id: Long): UserResponseV1 =
        service.findById(id).toResponseV1()

    @GetMapping("/{id}", headers = ["X-API-Version=2"])
    suspend fun getUserV2(@PathVariable id: Long): UserResponseV2 =
        service.findById(id).toResponseV2()
}`;

const keysetPaginationCode = `// Keyset (cursor) pagination — O(1) vs OFFSET O(n)
@Repository
class ProductRepository(private val dsl: DSLContext) {

    // WRONG: offset pagination — scans and discards rows
    fun findAllOffset(page: Int, size: Int): List<Product> =
        dsl.selectFrom(PRODUCTS)
            .orderBy(PRODUCTS.CREATED_AT.desc())
            .offset(page * size)  // scans ALL previous rows!
            .limit(size)
            .fetchInto(Product::class.java)

    // CORRECT: keyset pagination — seeks directly to the cursor
    fun findAllKeyset(cursor: Instant?, size: Int): List<Product> =
        dsl.selectFrom(PRODUCTS)
            .apply { cursor?.let { where(PRODUCTS.CREATED_AT.lt(it)) } }
            .orderBy(PRODUCTS.CREATED_AT.desc())
            .limit(size + 1) // fetch one extra to know if there's a next page
            .fetchInto(Product::class.java)
}

// Usage: GET /api/v1/products?cursor=2026-01-15T10:30:00Z&size=20
// Response includes: { data: [...], nextCursor: "2026-01-15T09:00:00Z" }`;

// ─── Chapter 11: Security ────────────────────────────────────────

const springSecurityCode = `// Spring Security — Kotlin DSL configuration
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http {
            csrf { disable() }  // stateless API, use CORS instead
            cors { configurationSource = corsConfig() }

            authorizeHttpRequests {
                authorize("/api/v1/auth/**", permitAll)
                authorize("/api/v1/public/**", permitAll)
                authorize("/actuator/health", permitAll)
                authorize("/api/v1/admin/**", hasRole("ADMIN"))
                authorize(anyRequest, authenticated)
            }

            oauth2ResourceServer {
                jwt {
                    jwtDecoder = jwtDecoder()
                }
            }

            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }

            exceptionHandling {
                authenticationEntryPoint = HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
            }
        }.build()

    @Bean
    fun corsConfig() = CorsConfigurationSource {
        CorsConfiguration().apply {
            allowedOrigins = listOf("https://app.mycompany.com")
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }
    }
}`;

const jwtAuthCode = `// JWT token generation and validation
@Service
class JwtService(private val props: JwtProperties) {

    private val secretKey = Keys.hmacShaKeyFor(props.secret.toByteArray())

    fun generateToken(user: UserPrincipal): String =
        Jwts.builder()
            .subject(user.id.toString())
            .claim("email", user.email)
            .claim("roles", user.roles)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + props.expiration.toMillis()))
            .signWith(secretKey)
            .compact()

    fun validateToken(token: String): Claims =
        Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload

    fun extractUserId(token: String): Long =
        validateToken(token).subject.toLong()
}

// Authentication filter
@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val userService: UserService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain
    ) {
        val token = request.getHeader("Authorization")
            ?.removePrefix("Bearer ")
            ?.takeIf { it.isNotBlank() }

        if (token != null) {
            try {
                val userId = jwtService.extractUserId(token)
                val user = userService.loadById(userId)
                val auth = UsernamePasswordAuthenticationToken(user, null, user.authorities)
                SecurityContextHolder.getContext().authentication = auth
            } catch (e: JwtException) {
                // Invalid token — continue without authentication
            }
        }
        chain.doFilter(request, response)
    }
}`;

const methodSecurityCode = `// Method-level security with custom annotations
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
class MethodSecurityConfig

// Built-in annotations
@Service
class OrderService(private val repo: OrderRepository) {

    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    suspend fun getOrdersForUser(userId: Long): List<Order> =
        repo.findByUserId(userId)

    @PreAuthorize("hasRole('ADMIN')")
    suspend fun deleteOrder(orderId: Long) =
        repo.deleteById(orderId)

    @PostAuthorize("returnObject.userId == authentication.principal.id")
    suspend fun getOrder(orderId: Long): Order =
        repo.findById(orderId) ?: throw OrderNotFoundException(orderId)
}

// Custom security expression
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("hasRole('ADMIN') or @ownershipChecker.isOwner(#id, authentication)")
annotation class OwnerOrAdmin

@Service
class OwnershipChecker(private val repo: OrderRepository) {
    fun isOwner(id: Long, auth: Authentication): Boolean {
        val principal = auth.principal as UserPrincipal
        return repo.findById(id)?.userId == principal.id
    }
}`;

// ─── Chapter 12: Performance & Observability ─────────────────────

const cachingCode = `// Multi-level caching — in-memory (Caffeine) + distributed (Redis)
@Configuration
@EnableCaching
class CacheConfig {

    @Bean
    fun cacheManager(redisConnectionFactory: RedisConnectionFactory): CacheManager =
        CompositeCacheManager(
            caffeineCacheManager(),      // L1: in-process, fast
            redisCacheManager(redisConnectionFactory)  // L2: shared, consistent
        ).apply { setFallbackToNoOpCache(false) }

    private fun caffeineCacheManager() = CaffeineCacheManager().apply {
        setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(5))
            .recordStats())
    }

    private fun redisCacheManager(factory: RedisConnectionFactory) =
        RedisCacheManager.builder(factory)
            .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair
                        .fromSerializer(GenericJackson2JsonRedisSerializer())
                ))
            .build()
}

// Usage with cache annotations
@Service
class ProductService(private val repo: ProductRepository) {

    @Cacheable("products", key = "#id")
    suspend fun findById(id: Long): Product =
        repo.findById(id) ?: throw ProductNotFoundException(id)

    @CacheEvict("products", key = "#id")
    suspend fun update(id: Long, cmd: UpdateProductCommand): Product {
        val product = findById(id)
        return repo.save(product.update(cmd))
    }

    @CacheEvict("products", allEntries = true)
    suspend fun bulkImport(products: List<CreateProductCommand>) =
        repo.saveAll(products.map { it.toEntity() })
}`;

const metricsCode = `// Custom business metrics with Micrometer
@Component
class OrderMetrics(private val registry: MeterRegistry) {

    private val orderCounter = registry.counter("orders.created", "type", "all")
    private val orderTimer = registry.timer("orders.processing.time")
    private val activeOrders = registry.gauge("orders.active.count",
        AtomicInteger(0))!!

    fun recordOrderCreated(order: Order) {
        orderCounter.increment()
        registry.counter("orders.created", "channel", order.channel.name).increment()
        registry.counter("orders.revenue",
            "currency", order.currency
        ).increment(order.total.toDouble())
    }

    suspend fun <T> timeOrderProcessing(block: suspend () -> T): T {
        val sample = Timer.start(registry)
        return try {
            block()
        } finally {
            sample.stop(orderTimer)
        }
    }
}

// Structured logging with correlation IDs
@Component
class RequestLoggingFilter : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val requestId = exchange.request.headers.getFirst("X-Request-ID")
            ?: UUID.randomUUID().toString()

        return chain.filter(exchange)
            .contextWrite { ctx ->
                ctx.put("requestId", requestId)
            }
            .doOnEach { signal ->
                if (!signal.isOnComplete) {
                    MDC.put("requestId", requestId)
                    MDC.put("method", exchange.request.method.name())
                    MDC.put("path", exchange.request.path.value())
                }
            }
    }
}`;

const healthCheckCode = `// Custom health indicators for Kubernetes probes
@Component
class DatabaseHealthIndicator(
    private val dataSource: DataSource
) : HealthIndicator {

    override fun health(): Health {
        return try {
            dataSource.connection.use { conn ->
                conn.createStatement().use { stmt ->
                    stmt.executeQuery("SELECT 1").use { rs ->
                        if (rs.next()) Health.up()
                            .withDetail("database", "PostgreSQL")
                            .withDetail("latency", measureTimeMillis { })
                            .build()
                        else Health.down().build()
                    }
                }
            }
        } catch (e: Exception) {
            Health.down(e).build()
        }
    }
}

@Component
class KafkaHealthIndicator(
    private val adminClient: AdminClient
) : HealthIndicator {

    override fun health(): Health {
        return try {
            val nodes = adminClient.describeCluster().nodes().get(5, TimeUnit.SECONDS)
            Health.up()
                .withDetail("brokers", nodes.size)
                .withDetail("clusterId", adminClient.describeCluster().clusterId().get())
                .build()
        } catch (e: Exception) {
            Health.down(e).withDetail("error", e.message).build()
        }
    }
}

// application.yml
// management:
//   endpoints:
//     web:
//       exposure:
//         include: health, metrics, prometheus
//   endpoint:
//     health:
//       show-details: when_authorized
//       probes:
//         enabled: true  # /actuator/health/liveness, /readiness`;

// ─── Chapter 13: Kotlin Advanced Type System ─────────────────────

const sealedClassCode = `// Sealed classes — exhaustive when, type-safe hierarchies
sealed class PaymentResult {
    data class Success(val transactionId: String, val amount: Money) : PaymentResult()
    data class Declined(val reason: String, val code: Int) : PaymentResult()
    data class RequiresAction(val actionUrl: String) : PaymentResult()
    data object NetworkError : PaymentResult()
}

// Compiler enforces exhaustive when — no "else" needed
fun handlePayment(result: PaymentResult): String = when (result) {
    is PaymentResult.Success -> "Paid: \${result.transactionId}"
    is PaymentResult.Declined -> "Declined: \${result.reason} (code \${result.code})"
    is PaymentResult.RequiresAction -> "Redirect to: \${result.actionUrl}"
    is PaymentResult.NetworkError -> "Network error, retry later"
    // Adding a new subclass forces updating ALL when expressions
}

// Sealed interfaces — multiple inheritance for domain events
sealed interface DomainEvent {
    val occurredAt: Instant
}

sealed interface OrderEvent : DomainEvent {
    val orderId: OrderId
}

data class OrderPlaced(
    override val orderId: OrderId,
    override val occurredAt: Instant,
    val items: List<OrderItem>
) : OrderEvent

data class OrderShipped(
    override val orderId: OrderId,
    override val occurredAt: Instant,
    val trackingNumber: String
) : OrderEvent`;

const valueClassCode = `// Value classes — type safety without runtime overhead
@JvmInline
value class UserId(val value: Long)

@JvmInline
value class OrderId(val value: Long)

@JvmInline
value class Email(val value: String) {
    init {
        require(value.contains("@")) { "Invalid email: $value" }
    }
}

@JvmInline
value class Money(val cents: Long) {
    operator fun plus(other: Money) = Money(cents + other.cents)
    operator fun times(quantity: Int) = Money(cents * quantity)

    fun toFormattedString(): String =
        "${'$'}\${cents / 100}.\${(cents % 100).toString().padStart(2, '0')}"

    companion object {
        fun fromDollars(dollars: Double) = Money((dollars * 100).toLong())
    }
}

// Compile-time safety — can't accidentally swap IDs
fun transferMoney(
    from: UserId,      // can't pass an OrderId here!
    to: UserId,
    amount: Money
) { /* ... */ }

// At runtime, these are just Long/String — zero overhead
val userId = UserId(42)
val email = Email("alice@example.com")
val price = Money.fromDollars(29.99)`;

const delegationCode = `// Delegation — composition over inheritance
interface Logger {
    fun info(message: String)
    fun error(message: String, throwable: Throwable? = null)
}

class Slf4jLogger(name: String) : Logger {
    private val delegate = LoggerFactory.getLogger(name)
    override fun info(message: String) = delegate.info(message)
    override fun error(message: String, throwable: Throwable?) =
        delegate.error(message, throwable)
}

// Class delegation with "by" keyword
class AuditedOrderService(
    private val delegate: OrderService,
    private val logger: Logger
) : OrderService by delegate {
    // Only override what you need — rest delegates automatically
    override suspend fun create(command: CreateOrderCommand): Order {
        logger.info("Creating order for customer: \${command.customerId}")
        return delegate.create(command).also {
            logger.info("Order created: \${it.id}")
        }
    }
}

// Property delegation — lazy, observable, map-backed
class AppConfig(properties: Map<String, String>) {
    val dbUrl: String by properties           // backed by map
    val maxRetries: Int by lazy { loadFromVault("max-retries").toInt() }
    var debugMode: Boolean by Delegates.observable(false) { _, old, new ->
        logger.info("Debug mode changed: $old -> $new")
    }
}`;

const dslBuilderCode = `// Type-safe DSL builders — Kotlin's killer feature
// HTML DSL example
fun html(init: HtmlBuilder.() -> Unit): String =
    HtmlBuilder().apply(init).build()

class HtmlBuilder {
    private val elements = mutableListOf<String>()

    fun head(init: HeadBuilder.() -> Unit) {
        elements += HeadBuilder().apply(init).build()
    }

    fun body(init: BodyBuilder.() -> Unit) {
        elements += BodyBuilder().apply(init).build()
    }

    fun build() = "<html>\${elements.joinToString("\\n")}</html>"
}

// Query DSL for your domain
class QueryBuilder<T> {
    private val conditions = mutableListOf<String>()
    private var orderField: String? = null
    private var limitValue: Int = 100

    fun where(field: String, op: String, value: Any) {
        conditions += "$field $op '$value'"
    }

    fun orderBy(field: String) { orderField = field }
    fun limit(n: Int) { limitValue = n }

    infix fun String.eq(value: Any) = where(this, "=", value)
    infix fun String.gt(value: Any) = where(this, ">", value)
}

// Usage — reads like English
val query = buildQuery<User> {
    "status" eq "active"
    "age" gt 18
    orderBy("created_at")
    limit(50)
}`;

// ─── Chapter 14: DevOps & Deployment ─────────────────────────────

const dockerfileCode = `# Multi-stage Dockerfile for Kotlin Spring Boot
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cache Gradle dependencies
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle
RUN ./gradlew dependencies --no-daemon

# Build the app
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage — minimal image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/build/libs/*.jar app.jar

# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseG1GC \\
  -XX:MaxGCPauseMillis=200 \\
  -XX:+UseContainerSupport \\
  -XX:MaxRAMPercentage=75.0 \\
  -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`;

const graalvmCode = `// GraalVM Native Image — millisecond startup
// build.gradle.kts
plugins {
    id("org.graalvm.buildtools.native") version "0.10.4"
}

graalvmNative {
    binaries {
        named("main") {
            imageName.set("my-service")
            mainClass.set("com.myapp.ApplicationKt")
            buildArgs.add("--enable-preview")
            buildArgs.add("-H:+ReportExceptionStackTraces")
            // Spring AOT processes beans at build time
            jvmArgs.add("-Dspring.aot.enabled=true")
        }
    }
}

// Reflection hints for GraalVM (if needed)
@RegisterReflectionForBinding(
    UserDto::class,
    OrderDto::class,
    PaymentResult::class
)
@SpringBootApplication
class Application

// Build: ./gradlew nativeCompile
// Result: 25MB binary, starts in ~50ms vs ~3s JVM
// Tradeoff: longer build time (~5min), no JIT optimization at runtime`;

const k8sDeploymentCode = `# Kubernetes Deployment with proper health checks
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  labels:
    app: order-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0    # zero-downtime deployments
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
        - name: order-service
          image: registry.mycompany.com/order-service:1.2.3
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "1000m"
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: password
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          startupProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            failureThreshold: 30
            periodSeconds: 2`;

const helmChartCode = `# Helm values.yaml — parameterized deployment
replicaCount: 3

image:
  repository: registry.mycompany.com/order-service
  tag: "1.2.3"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
  hosts:
    - host: api.mycompany.com
      paths:
        - path: /api/v1/orders
          pathType: Prefix
  tls:
    - secretName: api-tls
      hosts:
        - api.mycompany.com

resources:
  requests:
    memory: 256Mi
    cpu: 250m
  limits:
    memory: 512Mi
    cpu: 1000m

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

# Environment-specific overrides
# helm install order-service ./chart -f values-prod.yaml`;

// ─── Chapter 15: Microservices Architecture ──────────────────────

const apiGatewayCode = `// Spring Cloud Gateway — Kotlin DSL routes
@Configuration
class GatewayConfig {

    @Bean
    fun routeLocator(builder: RouteLocatorBuilder): RouteLocator =
        builder.routes {
            route("order-service") {
                path("/api/v1/orders/**")
                filters {
                    circuitBreaker {
                        setName("orderServiceCB")
                        setFallbackUri("forward:/fallback/orders")
                    }
                    retry { setRetries(3) }
                    requestRateLimiter {
                        setRateLimiter(redisRateLimiter())
                        setKeyResolver(userKeyResolver())
                    }
                    removeRequestHeader("Cookie") // no cookies to microservices
                }
                uri("lb://order-service") // load-balanced via service discovery
            }

            route("user-service") {
                path("/api/v1/users/**")
                filters {
                    circuitBreaker { setName("userServiceCB") }
                    addRequestHeader("X-Internal-Call", "true")
                }
                uri("lb://user-service")
            }
        }
}`;

const serviceDiscoveryCode = `// Service registration with Spring Cloud + Kubernetes
// application.yml — each microservice registers itself
// spring:
//   application:
//     name: order-service
//   cloud:
//     kubernetes:
//       discovery:
//         enabled: true
//         all-namespaces: false

// Using WebClient with load balancing (no hardcoded URLs)
@Service
class UserClient(
    @LoadBalanced private val webClientBuilder: WebClient.Builder
) {
    private val client = webClientBuilder
        .baseUrl("http://user-service") // resolved via service discovery
        .build()

    suspend fun getUser(userId: Long): UserDto =
        client.get()
            .uri("/api/v1/users/{id}", userId)
            .retrieve()
            .awaitBody<UserDto>()
}

// gRPC for internal high-performance communication
@GrpcService
class OrderGrpcService(
    private val orderService: OrderService
) : OrderServiceGrpcKt.OrderServiceCoroutineImplBase() {

    override suspend fun getOrder(request: GetOrderRequest): OrderResponse {
        val order = orderService.findById(OrderId(request.orderId))
        return order.toGrpcResponse()
    }
}`;

const eventDrivenMicroCode = `// Event-driven communication between microservices
// Order Service publishes events to Kafka
@Service
class OrderEventPublisher(
    private val kafka: KafkaTemplate<String, DomainEvent>
) {
    suspend fun publishOrderCreated(order: Order) {
        val event = OrderCreatedEvent(
            orderId = order.id.value,
            customerId = order.customerId.value,
            totalAmount = order.total.cents,
            items = order.items.map { it.toEventItem() },
            timestamp = Instant.now()
        )
        kafka.send("order-events", order.id.toString(), event).await()
    }
}

// Inventory Service consumes events — eventually consistent
@Component
class InventoryEventConsumer(
    private val inventoryService: InventoryService
) {
    @KafkaListener(
        topics = ["order-events"],
        groupId = "inventory-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    suspend fun handleOrderEvent(event: OrderCreatedEvent) {
        event.items.forEach { item ->
            inventoryService.reserveStock(
                productId = ProductId(item.productId),
                quantity = item.quantity,
                orderId = OrderId(event.orderId)
            )
        }
    }
}`;

// ─── Chapter 16: Database Design & Optimization ──────────────────

const indexStrategyCode = `// Strategic indexing — the single biggest performance lever
-- Composite index for common query patterns
CREATE INDEX idx_orders_customer_status_created
    ON orders (customer_id, status, created_at DESC);
-- Covers: WHERE customer_id = ? AND status = ? ORDER BY created_at DESC

-- Partial index — only index what you actually query
CREATE INDEX idx_orders_pending
    ON orders (created_at DESC)
    WHERE status = 'PENDING';
-- 90% smaller than a full index, 10x faster for pending order queries

-- Covering index — eliminates table lookups entirely
CREATE INDEX idx_products_category_covering
    ON products (category_id)
    INCLUDE (name, price, stock_count);
-- SELECT name, price, stock_count WHERE category_id = ? → index-only scan

-- Expression index for case-insensitive search
CREATE INDEX idx_users_email_lower
    ON users (LOWER(email));
-- WHERE LOWER(email) = 'alice@example.com' → uses the index`;

const queryOptimizationCode = `// Query optimization patterns in Kotlin
@Repository
class OrderAnalyticsRepository(private val jdbcTemplate: NamedParameterJdbcTemplate) {

    // BAD: N+1 — loads orders, then each customer separately
    suspend fun getOrdersWithCustomersBad(): List<OrderWithCustomer> {
        val orders = orderRepo.findAll() // query 1
        return orders.map { order ->
            val customer = customerRepo.findById(order.customerId) // query N
            OrderWithCustomer(order, customer!!)
        }
    }

    // GOOD: Single query with JOIN + projection
    fun getOrdersWithCustomersGood(
        status: OrderStatus,
        limit: Int
    ): List<OrderWithCustomer> =
        jdbcTemplate.query("""
            SELECT o.id, o.total, o.created_at,
                   c.id AS customer_id, c.name, c.email
            FROM orders o
            JOIN customers c ON c.id = o.customer_id
            WHERE o.status = :status
            ORDER BY o.created_at DESC
            LIMIT :limit
        """, mapOf("status" to status.name, "limit" to limit)) { rs, _ ->
            OrderWithCustomer(
                orderId = rs.getLong("id"),
                total = rs.getBigDecimal("total"),
                customerName = rs.getString("name"),
                customerEmail = rs.getString("email")
            )
        }
}`;

const connectionPoolCode = `// HikariCP tuning for production workloads
@Configuration
class DataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    fun dataSource(): HikariDataSource = HikariDataSource().apply {
        // Pool size = (2 * CPU cores) + number of spinning disks
        // For SSD with 4 cores: pool size = 10
        maximumPoolSize = 10
        minimumIdle = 5

        // Connection lifetime — rotate before DB timeout (usually 30 min)
        maxLifetime = Duration.ofMinutes(25).toMillis()

        // Fail fast if no connection available
        connectionTimeout = Duration.ofSeconds(5).toMillis()

        // Detect leaked connections in development
        leakDetectionThreshold = Duration.ofSeconds(30).toMillis()

        // Validation query (lightweight, no table scan)
        connectionTestQuery = "SELECT 1"
    }
}

// application.yml for read replicas
// spring:
//   datasource:
//     primary:
//       url: jdbc:postgresql://primary-db:5432/myapp
//     replica:
//       url: jdbc:postgresql://replica-db:5432/myapp
//       hikari:
//         read-only: true`;

// ─── Chapter 17: Event-Driven Architecture ───────────────────────

const kafkaProducerCode = `// Kafka producer with guaranteed delivery
@Configuration
class KafkaProducerConfig {

    @Bean
    fun producerFactory(): ProducerFactory<String, DomainEvent> =
        DefaultKafkaProducerFactory(mapOf(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka:9092",
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java,
            // Exactly-once semantics
            ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG to true,
            ProducerConfig.ACKS_CONFIG to "all",
            ProducerConfig.RETRIES_CONFIG to 3,
            ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1
        ))
}

// Transactional outbox pattern — atomic DB + event publishing
@Service
class OrderService(
    private val orderRepo: OrderRepository,
    private val outboxRepo: OutboxRepository,
    @Transactional private val txManager: PlatformTransactionManager
) {
    @Transactional
    suspend fun createOrder(command: CreateOrderCommand): Order {
        val order = Order.create(command.customerId, command.items)
        val saved = orderRepo.save(order)

        // Write event to outbox table in SAME transaction
        outboxRepo.save(OutboxEvent(
            aggregateType = "Order",
            aggregateId = saved.id.toString(),
            eventType = "OrderCreated",
            payload = Json.encodeToString(OrderCreatedEvent(saved))
        ))

        return saved
        // A separate poller reads outbox and publishes to Kafka
    }
}`;

const kafkaConsumerCode = `// Kafka consumer with error handling and DLQ
@Configuration
@EnableKafka
class KafkaConsumerConfig {

    @Bean
    fun consumerFactory(): ConsumerFactory<String, String> =
        DefaultKafkaConsumerFactory(mapOf(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka:9092",
            ConsumerConfig.GROUP_ID_CONFIG to "payment-service",
            ConsumerConfig.AUTO_OFFSET_RESET_CONFIG to "earliest",
            ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to false, // manual commit
            ConsumerConfig.MAX_POLL_RECORDS_CONFIG to 100
        ))

    @Bean
    fun kafkaListenerContainerFactory(
        consumerFactory: ConsumerFactory<String, String>
    ): ConcurrentKafkaListenerContainerFactory<String, String> =
        ConcurrentKafkaListenerContainerFactory<String, String>().apply {
            this.consumerFactory = consumerFactory
            setConcurrency(3) // 3 consumer threads
            containerProperties.ackMode = ContainerProperties.AckMode.MANUAL_IMMEDIATE

            // Retry 3 times, then send to DLQ
            setCommonErrorHandler(DefaultErrorHandler(
                DeadLetterPublishingRecoverer(kafkaTemplate),
                FixedBackOff(1000L, 3)
            ))
        }
}

// Consumer with manual acknowledgment
@Component
class PaymentEventConsumer(private val paymentService: PaymentService) {

    @KafkaListener(topics = ["order-events"], groupId = "payment-service")
    suspend fun handleOrderCreated(
        record: ConsumerRecord<String, String>,
        ack: Acknowledgment
    ) {
        val event = Json.decodeFromString<OrderCreatedEvent>(record.value())

        try {
            paymentService.processPayment(event)
            ack.acknowledge() // commit offset only on success
        } catch (e: RetryableException) {
            throw e // will be retried by error handler
        } catch (e: Exception) {
            logger.error("Non-retryable error for order \${event.orderId}", e)
            ack.acknowledge() // skip to DLQ
        }
    }
}`;

const eventSourcingCode = `// Event Sourcing — reconstruct state from event history
// Events are immutable facts that happened
sealed class OrderEvent {
    abstract val orderId: String
    abstract val timestamp: Instant

    data class OrderPlaced(
        override val orderId: String,
        override val timestamp: Instant,
        val customerId: String,
        val items: List<OrderItem>
    ) : OrderEvent()

    data class PaymentReceived(
        override val orderId: String,
        override val timestamp: Instant,
        val transactionId: String,
        val amount: Money
    ) : OrderEvent()

    data class OrderShipped(
        override val orderId: String,
        override val timestamp: Instant,
        val trackingNumber: String,
        val carrier: String
    ) : OrderEvent()
}

// Rebuild current state by replaying events
class OrderAggregate {
    var status: OrderStatus = OrderStatus.UNKNOWN
        private set
    var items: List<OrderItem> = emptyList()
        private set
    var trackingNumber: String? = null
        private set

    fun apply(event: OrderEvent) {
        when (event) {
            is OrderEvent.OrderPlaced -> {
                status = OrderStatus.PLACED
                items = event.items
            }
            is OrderEvent.PaymentReceived -> {
                status = OrderStatus.PAID
            }
            is OrderEvent.OrderShipped -> {
                status = OrderStatus.SHIPPED
                trackingNumber = event.trackingNumber
            }
        }
    }

    companion object {
        fun fromHistory(events: List<OrderEvent>): OrderAggregate =
            OrderAggregate().apply { events.forEach { apply(it) } }
    }
}`;

// ─── Chapter 18: Kotlin Coroutines Deep Dive ─────────────────────

const dispatchersCode = `// Understanding Dispatchers — where coroutines execute
suspend fun processOrder(orderId: Long) = coroutineScope {
    // Dispatchers.Default — CPU-bound work (computation, JSON parsing)
    val analytics = async(Dispatchers.Default) {
        calculateOrderAnalytics(orderId) // heavy computation
    }

    // Dispatchers.IO — blocking I/O (JDBC, file reads, legacy APIs)
    val orderData = async(Dispatchers.IO) {
        legacyOrderDao.findById(orderId) // blocking JDBC call
    }

    // Dispatchers.Unconfined — starts in caller's thread, resumes in
    // whatever thread the suspend function resumes on (rarely used)

    // No dispatcher = inherits from parent scope
    val enrichedOrder = async {
        enrichOrder(orderData.await()) // inherits parent dispatcher
    }

    OrderResult(
        analytics = analytics.await(),
        order = enrichedOrder.await()
    )
}

// Custom limited dispatcher for resource protection
val dbDispatcher = Dispatchers.IO.limitedParallelism(10)
// Max 10 concurrent DB operations — prevents connection pool exhaustion

suspend fun queryWithLimit() = withContext(dbDispatcher) {
    repository.findExpensiveQuery() // at most 10 concurrent calls
}`;

const exceptionHandlingCode = `// Structured exception handling in coroutines
// SupervisorJob — child failures don't cancel siblings
val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

// CoroutineExceptionHandler — last resort for uncaught exceptions
val handler = CoroutineExceptionHandler { _, exception ->
    logger.error("Uncaught coroutine exception", exception)
    metrics.incrementCounter("coroutine.unhandled.errors")
}

// Pattern: supervised fan-out with individual error handling
suspend fun fetchDashboardData(userId: Long): Dashboard = supervisorScope {
    // Each async can fail independently
    val profile = async {
        runCatching { userService.getProfile(userId) }
            .getOrElse { UserProfile.DEFAULT }
    }

    val orders = async {
        runCatching { orderService.getRecent(userId) }
            .getOrElse { emptyList() }
    }

    val recommendations = async {
        runCatching { mlService.recommend(userId) }
            .getOrDefault(emptyList())
    }

    Dashboard(
        profile = profile.await(),
        orders = orders.await(),
        recommendations = recommendations.await()
    )
    // Even if ML service is down, dashboard renders with partial data
}`;

const coroutineTestingCode = `// Testing coroutines with runTest and turbine
class OrderServiceTest {

    @Test
    fun \`should process orders concurrently\`() = runTest {
        val service = OrderService(
            repo = FakeOrderRepository(),
            dispatcher = StandardTestDispatcher(testScheduler)
        )

        val result = service.processOrder(OrderId(1))

        assertThat(result.status).isEqualTo(OrderStatus.CONFIRMED)
        // Virtual time — no real delays, tests run instantly
    }

    @Test
    fun \`should emit price updates via Flow\`() = runTest {
        val priceFlow = priceService.streamPrices("AAPL")

        priceFlow.test { // turbine extension
            val first = awaitItem()
            assertThat(first.symbol).isEqualTo("AAPL")

            val second = awaitItem()
            assertThat(second.price).isGreaterThan(0)

            cancelAndConsumeRemainingEvents()
        }
    }

    @Test
    fun \`should cancel children on timeout\`() = runTest {
        val result = withTimeoutOrNull(Duration.ofSeconds(5)) {
            slowExternalService.call() // takes 10s
        }

        assertThat(result).isNull() // timed out gracefully
    }
}`;

// ─── Chapter 19: GraphQL with Kotlin ─────────────────────────────

const graphqlSchemaCode = `// GraphQL schema definition (schema.graphqls)
type Query {
    user(id: ID!): User
    users(filter: UserFilter, page: PageInput): UserConnection!
    order(id: ID!): Order
}

type Mutation {
    createOrder(input: CreateOrderInput!): OrderPayload!
    updateUserProfile(input: UpdateProfileInput!): User!
}

type Subscription {
    orderStatusChanged(orderId: ID!): OrderStatusUpdate!
}

type User {
    id: ID!
    name: String!
    email: String!
    orders(first: Int = 10): [Order!]!
    totalSpent: Money!
}

type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    status: OrderStatus!
    total: Money!
    createdAt: DateTime!
}

input CreateOrderInput {
    userId: ID!
    items: [OrderItemInput!]!
    paymentMethod: PaymentMethod!
}

type OrderPayload {
    order: Order
    errors: [UserError!]
}`;

const dgsResolverCode = `// Netflix DGS Framework — type-safe resolvers in Kotlin
@DgsComponent
class UserDataFetcher(
    private val userService: UserService,
    private val orderService: OrderService
) {
    @DgsQuery
    suspend fun user(@InputArgument id: Long): User? =
        userService.findById(UserId(id))

    @DgsQuery
    suspend fun users(
        @InputArgument filter: UserFilter?,
        @InputArgument page: PageInput?
    ): UserConnection =
        userService.findAll(filter, page?.toPageable())
            .toConnection()

    // Nested resolver — called only when "orders" field is requested
    @DgsData(parentType = "User", field = "orders")
    suspend fun ordersForUser(
        dfe: DgsDataFetchingEnvironment,
        @InputArgument first: Int?
    ): List<Order> {
        val user = dfe.getSource<User>()
        return orderService.findByUserId(user.id, limit = first ?: 10)
    }

    // Computed field — resolved on demand
    @DgsData(parentType = "User", field = "totalSpent")
    suspend fun totalSpent(dfe: DgsDataFetchingEnvironment): Money {
        val user = dfe.getSource<User>()
        return orderService.calculateTotalSpent(user.id)
    }
}`;

const dataLoaderCode = `// DataLoader — solves N+1 in GraphQL
@DgsComponent
class UserDataLoaderRegistrar {

    @DgsDataLoader(name = "users")
    val userLoader = MappedBatchLoaderWithContext<Long, User> { userIds, env ->
        // Called ONCE with all user IDs collected from the query
        // Instead of N individual queries, we make 1 batch query
        val users = userService.findByIds(userIds.toList())
        users.associateBy { it.id.value }
    }
}

// Using DataLoader in a resolver
@DgsComponent
class OrderDataFetcher {

    @DgsData(parentType = "Order", field = "user")
    suspend fun userForOrder(dfe: DgsDataFetchingEnvironment): CompletableFuture<User> {
        val order = dfe.getSource<Order>()
        val loader = dfe.getDataLoader<Long, User>("users")
        return loader.load(order.userId.value)
        // All user loads are batched into a single query
    }
}

// Query: { orders { id, user { name } } }
// Without DataLoader: 1 query for orders + N queries for users
// With DataLoader:    1 query for orders + 1 batch query for users`;

// ─── Chapter 20: Behavioral & System Design Framework ────────────

const systemDesignFrameworkCode = `// System Design Interview — structured approach
// Use this framework for any system design question

// Step 1: Requirements clarification (2-3 minutes)
// - Functional: What does the system DO?
// - Non-functional: Scale, latency, availability targets
// - Constraints: Budget, team size, timeline

// Step 2: Capacity estimation (2 minutes)
// Example: Design a URL shortener
val dailyUsers = 100_000_000L // 100M DAU
val writesPerDay = dailyUsers * 0.1 // 10M new URLs/day
val readsPerDay = dailyUsers * 10   // 1B reads/day (100:1 read:write)
val writeQps = writesPerDay / 86400 // ~115 writes/sec
val readQps = readsPerDay / 86400   // ~11,500 reads/sec
val storagePerYear = writesPerDay * 365 * 500 // ~1.8TB/year (500 bytes/URL)

// Step 3: High-level design (5 minutes)
// Draw the architecture: Client → LB → API → Cache → DB
// Identify core components and data flow

// Step 4: Deep dive into components (15 minutes)
// - Database choice and schema
// - Caching strategy (write-through, write-behind)
// - Sharding / partitioning strategy
// - Consistency model (strong vs eventual)

// Step 5: Address bottlenecks and trade-offs (5 minutes)
// - Single points of failure
// - Hot spots / hot keys
// - What happens at 10x scale?`;

const tableOfContents = [
  { id: "intro", label: "Course Introduction", level: 1 },
  { id: "ch1-jvm", label: "Chapter 1: JVM & Kotlin Philosophy", level: 1 },
  { id: "ch2-idioms", label: "Chapter 2: Idiomatic Kotlin", level: 1 },
  { id: "ch3-spring", label: "Chapter 3: Spring Boot Architecture", level: 1 },
  { id: "ch4-persistence", label: "Chapter 4: Persistence (JPA vs Exposed)", level: 1 },
  { id: "ch5-async", label: "Chapter 5: Coroutines vs Virtual Threads", level: 1 },
  { id: "ch6-architecture", label: "Chapter 6: Hexagonal Architecture", level: 1 },
  { id: "ch7-distributed", label: "Chapter 7: Distributed Systems", level: 1 },
  { id: "ch8-testing", label: "Chapter 8: Testing Strategies", level: 1 },
  { id: "ch9-interview", label: "Chapter 9: Senior Interview Gauntlet", level: 1 },
  { id: "ch10-api", label: "Chapter 10: API Design & REST", level: 1 },
  { id: "ch11-security", label: "Chapter 11: Security & Authentication", level: 1 },
  { id: "ch12-observability", label: "Chapter 12: Performance & Observability", level: 1 },
  { id: "ch13-types", label: "Chapter 13: Kotlin Advanced Type System", level: 1 },
  { id: "ch14-devops", label: "Chapter 14: DevOps & Deployment", level: 1 },
  { id: "ch15-microservices", label: "Chapter 15: Microservices Architecture", level: 1 },
  { id: "ch16-database", label: "Chapter 16: Database Design & Optimization", level: 1 },
  { id: "ch17-events", label: "Chapter 17: Event-Driven Architecture", level: 1 },
  { id: "ch18-coroutines-deep", label: "Chapter 18: Kotlin Coroutines Deep Dive", level: 1 },
  { id: "ch19-graphql", label: "Chapter 19: GraphQL with Kotlin", level: 1 },
  { id: "ch20-system-design", label: "Chapter 20: System Design Framework", level: 1 },
  { id: "appendix", label: "Appendix: Recommended Stack 2026", level: 1 },
];

export default function BackendInterviewPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout tableOfContents={tableOfContents}>
      <div className={localStyles.contentWrapper}>
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
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              Interview Prep
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Backend Kotlin & Spring</li>
        </ol>
      </nav>

      {/* ─── Hero ─── */}
      <div className={localStyles.heroWrapper}>
        <span className={localStyles.heroBadge}>Staff / Principal Engineer Guide</span>
        <Heading className={localStyles.heroTitle}>
          Advanced Backend Engineering: Kotlin & Spring Boot
        </Heading>
        <Text className={localStyles.heroSubtitle}>
          A comprehensive Master Course for aspiring Staff or Principal Engineers. This guide synthesizes theoretical computer science with production-hardened patterns — from the JVM and K2 compiler to Spring Boot 4, Coroutines, Hexagonal Architecture, and distributed systems. Deep-dive preparation for high-stakes technical interviews and architectural decisions.
        </Text>

        <div className={localStyles.heroStats}>
          <div className={localStyles.heroStatItem}>
            <span className={localStyles.heroStatIcon}>20</span>
            <span className={localStyles.heroStatText}><span className={localStyles.heroStatValue}>Chapters</span></span>
          </div>
          <div className={localStyles.heroStatItem}>
            <span className={localStyles.heroStatIcon}>60+</span>
            <span className={localStyles.heroStatText}><span className={localStyles.heroStatValue}>Code Examples</span></span>
          </div>
          <div className={localStyles.heroStatItem}>
            <span className={localStyles.heroStatIcon}>30+</span>
            <span className={localStyles.heroStatText}><span className={localStyles.heroStatValue}>Interview Q&As</span></span>
          </div>
          <div className={localStyles.heroStatItem}>
            <span className={localStyles.heroStatIcon}>L5-L7</span>
            <span className={localStyles.heroStatText}><span className={localStyles.heroStatValue}>Target Level</span></span>
          </div>
        </div>

        <div className={localStyles.chapterNav}>
          <a href="#ch1-jvm" className={localStyles.chapterNavLink}>Ch.1 JVM & Kotlin</a>
          <a href="#ch2-idioms" className={localStyles.chapterNavLink}>Ch.2 Idioms</a>
          <a href="#ch3-spring" className={localStyles.chapterNavLink}>Ch.3 Spring Boot</a>
          <a href="#ch4-persistence" className={localStyles.chapterNavLink}>Ch.4 Persistence</a>
          <a href="#ch5-async" className={localStyles.chapterNavLink}>Ch.5 Async</a>
          <a href="#ch6-architecture" className={localStyles.chapterNavLink}>Ch.6 Hexagonal</a>
          <a href="#ch7-distributed" className={localStyles.chapterNavLink}>Ch.7 Distributed</a>
          <a href="#ch8-testing" className={localStyles.chapterNavLink}>Ch.8 Testing</a>
          <a href="#ch9-interview" className={localStyles.chapterNavLink}>Ch.9 Interview</a>
          <a href="#ch10-api" className={localStyles.chapterNavLink}>Ch.10 API Design</a>
          <a href="#ch11-security" className={localStyles.chapterNavLink}>Ch.11 Security</a>
          <a href="#ch12-observability" className={localStyles.chapterNavLink}>Ch.12 Observability</a>
          <a href="#ch13-types" className={localStyles.chapterNavLink}>Ch.13 Type System</a>
          <a href="#ch14-devops" className={localStyles.chapterNavLink}>Ch.14 DevOps</a>
          <a href="#ch15-microservices" className={localStyles.chapterNavLink}>Ch.15 Microservices</a>
          <a href="#ch16-database" className={localStyles.chapterNavLink}>Ch.16 Database</a>
          <a href="#ch17-events" className={localStyles.chapterNavLink}>Ch.17 Events</a>
          <a href="#ch18-coroutines-deep" className={localStyles.chapterNavLink}>Ch.18 Coroutines</a>
          <a href="#ch19-graphql" className={localStyles.chapterNavLink}>Ch.19 GraphQL</a>
          <a href="#ch20-system-design" className={localStyles.chapterNavLink}>Ch.20 System Design</a>
          <a href="#appendix" className={localStyles.chapterNavLink}>Appendix</a>
        </div>
      </div>

      {/* ─── Chapter 1: JVM & Kotlin ─── */}
      <section id="ch1-jvm" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 1: The Modern JVM Ecosystem & Kotlin Philosophy
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyIntermediate}`}>Intermediate</span>
            </div>
            <Text className={styles.sectionDescription}>
              Kotlin is not simply &quot;Java with less typing&quot; — it is a pragmatic language designed to fix specific shortcomings while maintaining 100% interoperability. Understanding the JVM foundation and Kotlin&apos;s design philosophy is crucial for any senior backend interview.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>1.1 The &quot;Billion Dollar Mistake&quot; and Null Safety</Heading>
            <Text className={styles.sectionDescription}>
              <code>NullPointerException</code> is the most common runtime error in traditional Java. Kotlin integrates nullability into the type system: <code>String</code> and <code>String?</code> are distinct types. At runtime there is no wrapper overhead (unlike <code>Optional</code>), making Kotlin&apos;s null safety performance-neutral.
            </Text>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
                alt="Code and type safety"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem", objectFit: "cover" }}
              />
            </div>
            <CodeEditor code={nullSafetyJava} language="kotlin" readOnly height={140} />
            <CodeEditor code={nullSafetyKotlin} language="kotlin" readOnly height={120} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How does Kotlin enforce null safety when interoperating with unannotated Java code?<br />
                <strong>A:</strong> Unannotated Java types become &quot;Platform Types&quot; (<code>T!</code>). The compiler relaxes null-checks, which is a known risk. Modern Spring Boot 4 apps use JSpecify annotations to enforce strict boundaries and eliminate platform types.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>1.2 Platform Types — The Hidden Danger</Heading>
            <Text className={styles.sectionDescription}>
              When calling Java libraries without nullability annotations, Kotlin infers &quot;platform types&quot; (<code>T!</code>). These bypass null safety entirely — the compiler won&apos;t warn you, and NPEs can occur at runtime. This is the #1 source of Kotlin NPEs in real-world projects.
            </Text>
            <CodeEditor code={platformTypesCode} language="kotlin" readOnly height={420} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Gotcha</div>
              <div className={localStyles.warningCalloutContent}>
                Never trust a <code>T!</code> platform type. Always assign Java return values to <code>T?</code> (nullable) unless the Java code has <code>@NonNull</code> / <code>@NullMarked</code> annotations. Spring Framework 6+ is fully annotated with JSpecify.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>1.3 Immutability and State Management</Heading>
            <Text className={styles.sectionDescription}>
              Concurrency bugs stem from shared mutable state. Use <code>val</code>, immutable collections (<code>List</code> vs <code>MutableList</code>), and &quot;copy-on-write&quot; with <code>.copy()</code> on data classes. Service layers should be stateless; DTOs should be immutable.
            </Text>
            <CodeEditor code={immutabilityCode} language="kotlin" readOnly height={420} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Rule of thumb:</strong> If a property is injected via constructor, use <code>val</code>. If it changes during the object&apos;s lifetime, ask yourself: &quot;Should I create a new object instead?&quot; The answer is usually yes.
              </span>
            </div>

            <Heading level={3} className={styles.categoryTitle}>1.4 The K2 Compiler and Spring Boot 4</Heading>
            <Text className={styles.sectionDescription}>
              Kotlin 2.0 introduced the K2 Compiler: a complete rewrite of the frontend compiler. It brings 2x faster compilation, smarter smart casts that work across <code>when</code> branches and lambda boundaries, and better type inference for builder DSLs. Spring Boot 4 leverages K2 metadata for faster startup and more efficient reflection.
            </Text>
            <CodeEditor code={k2CompilerCode} language="kotlin" readOnly height={280} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> What are the practical benefits of the K2 compiler for Spring Boot developers?<br />
                <strong>A:</strong> Three main benefits: (1) <strong>Build speed</strong> — K2 compiles 1.5-2x faster, significant in large monorepos. (2) <strong>Smarter smart casts</strong> — fewer explicit casts needed in complex control flow. (3) <strong>Spring Boot 4 integration</strong> — K2 metadata enables AOT (Ahead of Time) compilation for GraalVM native images, reducing startup time from seconds to milliseconds.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 2: Idiomatic Kotlin ─── */}
      <section id="ch2-idioms" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 2: Idiomatic Kotlin for the Spring Developer
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyIntermediate}`}>Intermediate</span>
            </div>
            <Text className={styles.sectionDescription}>
              Avoid the &quot;Java developer writing Kotlin&quot; anti-pattern. Idiomatic Kotlin code is more concise, safer, and easier to maintain. Interviewers specifically look for candidates who write <em>Kotlin</em>, not &quot;Java without semicolons&quot;.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>2.1 Expressions vs Statements</Heading>
            <Text className={styles.sectionDescription}>
              In Kotlin, <code>if</code>, <code>when</code>, and <code>try</code> are expressions — they return values. Use them to assign directly and enforce immutability. This eliminates temporary <code>var</code> declarations entirely.
            </Text>
            <CodeEditor code={expressionExample} language="kotlin" readOnly height={260} />

            <Heading level={3} className={styles.categoryTitle}>2.2 Extension Functions</Heading>
            <Text className={styles.sectionDescription}>
              Extend classes without inheriting. This is Kotlin&apos;s killer feature for building clean DSLs and utility APIs. But there&apos;s a critical interview gotcha: extension functions are <strong>statically resolved</strong>.
            </Text>
            <CodeEditor code={extensionFunctionCode} language="kotlin" readOnly height={420} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Interview Trap</div>
              <div className={localStyles.warningCalloutContent}>
                &quot;What does <code>shape.name()</code> print when <code>shape</code> is actually a <code>Circle</code>?&quot; — It prints &quot;Shape&quot; because extensions are resolved by the <strong>declared type</strong>, not runtime type. This is a classic interview question to test whether you truly understand Kotlin.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>2.3 Scope Functions (let, run, with, apply, also)</Heading>
            <Text className={styles.sectionDescription}>
              The five scope functions are often confused. The key differentiator: <strong>what is the context object</strong> (<code>this</code> vs <code>it</code>) and <strong>what is the return value</strong> (the object vs the lambda result).
            </Text>
            <div className={localStyles.scopeFunctionsGrid}>
              <div className={localStyles.scopeCard}>
                <div className={localStyles.scopeCardTitle}>apply</div>
                <div className={localStyles.scopeCardSub}>this / Object</div>
                <div className={localStyles.scopeCardDesc}>Configure this object. Returns the object itself. Perfect for bean initialization.</div>
              </div>
              <div className={localStyles.scopeCard}>
                <div className={localStyles.scopeCardTitle}>also</div>
                <div className={localStyles.scopeCardSub}>it / Object</div>
                <div className={localStyles.scopeCardDesc}>Do this additional thing. Returns the object. Logging, validation.</div>
              </div>
              <div className={localStyles.scopeCard}>
                <div className={localStyles.scopeCardTitle}>let</div>
                <div className={localStyles.scopeCardSub}>it / Lambda result</div>
                <div className={localStyles.scopeCardDesc}>Transform. Use with <code>?.let</code> for null-safety.</div>
              </div>
              <div className={localStyles.scopeCard}>
                <div className={localStyles.scopeCardTitle}>run</div>
                <div className={localStyles.scopeCardSub}>this / Lambda result</div>
                <div className={localStyles.scopeCardDesc}>Configure + compute. Returns the lambda result.</div>
              </div>
              <div className={localStyles.scopeCard}>
                <div className={localStyles.scopeCardTitle}>with</div>
                <div className={localStyles.scopeCardSub}>this / Lambda result</div>
                <div className={localStyles.scopeCardDesc}>Group function calls on an object. Non-extension function.</div>
              </div>
            </div>
            <CodeEditor code={scopeFunctionExamples} language="kotlin" readOnly height={520} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you use <code>also</code> vs <code>apply</code>?<br />
                <strong>A:</strong> Use <code>apply</code> when configuring properties on the object (receiver is <code>this</code>, so you can access properties directly). Use <code>also</code> for side effects like logging, where having the object as <code>it</code> makes the code clearer — <code>also &#123; logger.info(&quot;Created: $it&quot;) &#125;</code>.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 3: Spring Boot ─── */}
      <section id="ch3-spring" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 3: Advanced Spring Boot Architecture & Configuration
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Spring Boot 4 moves from reflection-heavy annotation scanning toward functional bean definition and AOT compilation. Understanding these internals separates senior from mid-level engineers.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>3.1 The Functional Bean Definition DSL</Heading>
            <Text className={styles.sectionDescription}>
              Kotlin&apos;s <code>beans &#123; &#125;</code> DSL allows programmatic registration. Benefits: no reflection scanning at startup, compilation errors for missing dependencies, profile-aware definitions, and centralized bean configuration.
            </Text>
            <CodeEditor code={functionalBeansCode} language="kotlin" readOnly height={380} />

            <Heading level={3} className={styles.categoryTitle}>3.2 Constructor Injection vs Field Injection</Heading>
            <Text className={styles.sectionDescription}>
              <code>@Autowired lateinit var</code> is an anti-pattern: it forces mutability, makes testing harder, hides dependencies, and prevents immutability guarantees. Always use Constructor Injection — Kotlin makes this elegant with primary constructor parameters.
            </Text>
            <CodeEditor code={constructorInjectionCode} language="kotlin" readOnly height={340} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Why is constructor injection preferred over field injection in Spring?<br />
                <strong>A:</strong> Four reasons: (1) <strong>Immutability</strong> — <code>val</code> guarantees thread safety. (2) <strong>Testability</strong> — pass mocks directly, no reflection needed. (3) <strong>Visibility</strong> — all dependencies are explicit in the constructor. (4) <strong>Fail-fast</strong> — missing dependencies cause startup failures, not runtime NPEs.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>3.3 Configuration Properties with Immutable Data Classes</Heading>
            <Text className={styles.sectionDescription}>
              Use <code>@ConfigurationProperties</code> with data classes for immutable config. Once the app starts, configuration cannot change — preventing drift bugs. Spring Boot 4 uses constructor binding by default for data classes.
            </Text>
            <CodeEditor code={configPropertiesCode} language="kotlin" readOnly height={440} />

            <Heading level={3} className={styles.categoryTitle}>3.4 Custom Auto-Configuration</Heading>
            <Text className={styles.sectionDescription}>
              Creating custom starters is a senior-level skill. It involves <code>@AutoConfiguration</code>, <code>@ConditionalOn*</code> annotations, and the new <code>AutoConfiguration.imports</code> file (replacing <code>spring.factories</code> in Spring Boot 3+).
            </Text>
            <CodeEditor code={customAutoConfigCode} language="kotlin" readOnly height={400} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Design principle:</strong> Good auto-configurations are <em>opinionated but overridable</em>. Always use <code>@ConditionalOnMissingBean</code> so users can provide their own implementation, and <code>@ConditionalOnProperty</code> to let them disable features entirely.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 4: Persistence ─── */}
      <section id="ch4-persistence" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 4: Persistence Engineering (JPA vs Exposed vs R2DBC)
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              &quot;Can I use a Kotlin data class for a JPA Entity?&quot; <strong>No.</strong> Data classes generate <code>equals</code>/<code>hashCode</code> based on all properties — lazy-loaded <code>@OneToMany</code> will trigger unexpected queries. Use a standard class, mark it <code>open</code>, and implement <code>equals</code>/<code>hashCode</code> on the primary key only.
            </Text>
            <CodeEditor code={jpaEntityCode} language="kotlin" readOnly height={340} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Common Mistake</div>
              <div className={localStyles.warningCalloutContent}>
                Using <code>data class</code> for JPA entities causes: (1) lazy loading triggers in <code>toString()</code>, (2) <code>equals</code>/<code>hashCode</code> on all fields including lazy collections, (3) <code>copy()</code> creates detached entities that confuse Hibernate session. Always use regular <code>class</code> for JPA entities.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>4.1 Exposed — Type-Safe SQL DSL</Heading>
            <Text className={styles.sectionDescription}>
              JetBrains&apos; Exposed library takes a different approach: instead of mapping objects to tables (ORM), it provides a type-safe DSL to write SQL. Queries are validated at compile time — no more JPQL string typos discovered in production.
            </Text>
            <CodeEditor code={exposedDslCode} language="kotlin" readOnly height={420} />

            <Heading level={3} className={styles.categoryTitle}>4.2 R2DBC — Reactive Persistence</Heading>
            <Text className={styles.sectionDescription}>
              For fully non-blocking applications, R2DBC provides reactive database access. Combined with Kotlin coroutines, you get suspend functions and <code>Flow</code> for streaming query results with backpressure.
            </Text>
            <CodeEditor code={r2dbcCode} language="kotlin" readOnly height={440} />

            <Heading level={3} className={styles.categoryTitle}>JPA vs Exposed vs R2DBC</Heading>
            <table className={localStyles.comparisonTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Spring Data JPA</th>
                  <th>Exposed</th>
                  <th>R2DBC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Philosophy</td>
                  <td>ORM (object-centric)</td>
                  <td>SQL DSL (data-centric)</td>
                  <td>Reactive (stream-centric)</td>
                </tr>
                <tr>
                  <td>Performance</td>
                  <td>Proxies, cache overhead</td>
                  <td>Lightweight, direct SQL</td>
                  <td>Non-blocking, high throughput</td>
                </tr>
                <tr>
                  <td>Async Support</td>
                  <td>Blocking JDBC</td>
                  <td>Coroutines (native)</td>
                  <td>Reactive / Coroutines</td>
                </tr>
                <tr>
                  <td>Type Safety</td>
                  <td>JPQL strings</td>
                  <td>Kotlin DSL (compile-time)</td>
                  <td>Raw SQL strings</td>
                </tr>
                <tr>
                  <td>Learning Curve</td>
                  <td>High (Hibernate quirks)</td>
                  <td>Medium (SQL knowledge)</td>
                  <td>High (reactive paradigm)</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>CRUD-heavy, existing teams</td>
                  <td>Complex queries, Kotlin-first</td>
                  <td>High-concurrency services</td>
                </tr>
              </tbody>
            </table>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you choose Exposed over JPA for a new Kotlin project?<br />
                <strong>A:</strong> Choose Exposed when: (1) your team has strong SQL skills, (2) you need complex queries with joins, CTEs, or window functions, (3) you want compile-time query validation, (4) you&apos;re building a Kotlin-first codebase (no Java team to support). Stick with JPA when migrating existing Java projects or when the team is already proficient with Hibernate.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 5: Async ─── */}
      <section id="ch5-async" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 5: Asynchronous Systems (Coroutines vs Virtual Threads)
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Coroutines: lightweight threads where suspend functions become state machines, releasing the thread while waiting. Virtual Threads (Java 21+): better for migrating legacy blocking apps without code changes. For new Kotlin projects, Coroutines remain superior thanks to Flow, select, structured concurrency, and cancellation.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>5.1 Suspend Functions & Spring WebFlux</Heading>
            <Text className={styles.sectionDescription}>
              Spring Boot natively supports <code>suspend</code> functions in controllers. When a function suspends, the underlying thread is released back to the pool. The <code>Flow</code> return type enables streaming responses with backpressure.
            </Text>
            <CodeEditor code={suspendControllerCode} language="kotlin" readOnly height={260} />

            <Heading level={3} className={styles.categoryTitle}>5.2 Structured Concurrency & Parallel Calls</Heading>
            <Text className={styles.sectionDescription}>
              The killer feature of coroutines is <strong>structured concurrency</strong>: if one <code>async</code> call fails, all siblings are automatically cancelled. No orphan threads, no resource leaks. Compare this to <code>CompletableFuture</code> where you must manually track and cancel.
            </Text>
            <CodeEditor code={coroutineVsVirtualCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> If Java 21+ has Virtual Threads, do we still need Coroutines?<br />
                <strong>A:</strong> Yes. Coroutines offer: (1) <strong>Rich operators</strong> — Flow (map, filter, conflate), select, channels. (2) <strong>Structured cancellation</strong> — parent-child scope hierarchy. (3) <strong>Explicit suspension points</strong> — <code>suspend</code> keyword makes it clear where thread-release happens. Virtual Threads are ideal for migrating legacy blocking code (JDBC, file I/O) without rewriting.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>5.3 Channels — Producer/Consumer Pattern</Heading>
            <Text className={styles.sectionDescription}>
              Channels provide a CSP-style (Communicating Sequential Processes) mechanism for coroutines. They support fan-out (multiple consumers), fan-in (multiple producers), and backpressure via bounded buffers.
            </Text>
            <CodeEditor code={channelCode} language="kotlin" readOnly height={380} />

            <table className={localStyles.comparisonTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Coroutines</th>
                  <th>Virtual Threads</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paradigm</td>
                  <td>Cooperative (suspend/resume)</td>
                  <td>Preemptive (OS-like)</td>
                </tr>
                <tr>
                  <td>Cancellation</td>
                  <td>Structured, hierarchical</td>
                  <td>Thread.interrupt() (legacy)</td>
                </tr>
                <tr>
                  <td>Streaming</td>
                  <td>Flow (backpressure built-in)</td>
                  <td>No native equivalent</td>
                </tr>
                <tr>
                  <td>Blocking I/O</td>
                  <td>Requires Dispatchers.IO</td>
                  <td>Works natively (pin-free)</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>New Kotlin projects, reactive</td>
                  <td>Legacy Java migration</td>
                </tr>
              </tbody>
            </table>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 6: Hexagonal Architecture ─── */}
      <section id="ch6-architecture" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 6: Hexagonal Architecture (Ports & Adapters)
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Dependencies point inwards. The Domain knows nothing about the Web or Database. This is the most asked architecture pattern in Staff+ interviews. The core insight: your business logic should be testable <em>without</em> Spring, without a database, without HTTP.
            </Text>

            <div className={localStyles.archDiagram}>
              <div className={`${localStyles.archLayer} ${localStyles.archLayerPresentation}`}>
                Presentation Layer (REST Controllers, GraphQL)
                <div className={localStyles.archLayerSub}>Adapters IN — receive external requests</div>
              </div>
              <div className={localStyles.archArrow}>depends on</div>
              <div className={`${localStyles.archLayer} ${localStyles.archLayerApplication}`}>
                Application Layer (Use Cases, Command Handlers)
                <div className={localStyles.archLayerSub}>Orchestration — coordinates domain + ports</div>
              </div>
              <div className={localStyles.archArrow}>depends on</div>
              <div className={`${localStyles.archLayer} ${localStyles.archLayerDomain}`}>
                Domain Layer (Entities, Value Objects, Domain Services)
                <div className={localStyles.archLayerSub}>Pure business logic — NO framework dependencies</div>
              </div>
              <div className={localStyles.archArrow}>implemented by</div>
              <div className={`${localStyles.archLayer} ${localStyles.archLayerInfra}`}>
                Infrastructure Layer (JPA Repos, HTTP Clients, Kafka)
                <div className={localStyles.archLayerSub}>Adapters OUT — implement domain ports</div>
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>6.1 Defining Ports (Interfaces)</Heading>
            <Text className={styles.sectionDescription}>
              Ports are interfaces defined in the domain layer. <strong>Input ports</strong> (use cases) define what the application can do. <strong>Output ports</strong> define what the application needs from infrastructure.
            </Text>
            <CodeEditor code={hexagonalPortCode} language="kotlin" readOnly height={340} />

            <Heading level={3} className={styles.categoryTitle}>6.2 Rich Domain Model</Heading>
            <Text className={styles.sectionDescription}>
              Domain entities contain business rules — not just data. Use <code>private constructor</code> with factory methods to enforce invariants. Business validations live in the entity, not in the service layer.
            </Text>
            <CodeEditor code={hexagonalDomainCode} language="kotlin" readOnly height={600} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Why use <code>private constructor</code> with a <code>companion object</code> factory?<br />
                <strong>A:</strong> It enforces invariants at construction time. Every <code>Order</code> that exists in your system is <em>guaranteed</em> to have at least one item because the <code>create()</code> factory validates this. You can never accidentally create an invalid <code>Order</code> — the compiler prevents it.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>6.3 Application Services (Use Case Orchestration)</Heading>
            <Text className={styles.sectionDescription}>
              Services orchestrate the domain model and ports. They do NOT contain business logic — that belongs in the domain. Services handle: transaction boundaries, port coordination, and event publishing.
            </Text>
            <CodeEditor code={hexagonalServiceCode} language="kotlin" readOnly height={440} />

            <Heading level={3} className={styles.categoryTitle}>6.4 Adapters (Pluggable Infrastructure)</Heading>
            <Text className={styles.sectionDescription}>
              Adapters implement ports. Input adapters (controllers) call use cases. Output adapters (repositories, HTTP clients) implement domain port interfaces. You can swap PostgreSQL for MongoDB by changing only the adapter — zero domain changes.
            </Text>
            <CodeEditor code={hexagonalAdapterCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.keyConceptCard}>
              <div className={localStyles.keyConceptTitle}>Directory Structure</div>
              <div className={localStyles.keyConceptText}>
                <code>domain/</code> — model (entities, value objects), port (in/out interfaces), service (domain services)<br />
                <code>application/</code> — use case implementations, command/query handlers<br />
                <code>infrastructure/</code> — adapter/in (REST, gRPC), adapter/out (JPA, HTTP clients, Kafka), config
              </div>
            </div>

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>The litmus test:</strong> Can you run your domain&apos;s unit tests without starting Spring, without a database, without any external service? If yes, your architecture is properly hexagonal. If not, you have infrastructure leaking into your domain.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 7: Distributed Systems ─── */}
      <section id="ch7-distributed" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 7: Distributed Systems Patterns
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Distributed systems are where theory meets reality. You need to understand: idempotency, circuit breakers, saga patterns, CQRS, and context propagation. These are the topics that separate Staff from Senior engineers.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>7.1 Idempotency</Heading>
            <Text className={styles.sectionDescription}>
              <strong>Idempotency:</strong> Client sends <code>Idempotency-Key</code> header. Server checks Redis: key exists & completed returns cached result; key exists & processing returns 409 Conflict; key missing means process and cache. This prevents duplicate charges, duplicate emails, duplicate orders.
            </Text>
            <CodeEditor code={idempotencyCode} language="kotlin" readOnly height={320} />

            <Heading level={3} className={styles.categoryTitle}>7.2 Circuit Breaker Pattern</Heading>
            <Text className={styles.sectionDescription}>
              When a downstream service is failing, continuing to send requests makes things worse (cascading failures). A circuit breaker &quot;opens&quot; after a threshold of failures, rejecting calls immediately. After a cooldown period, it enters &quot;half-open&quot; state to test recovery.
            </Text>
            <CodeEditor code={circuitBreakerCode} language="kotlin" readOnly height={440} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How do you decide the circuit breaker threshold and window?<br />
                <strong>A:</strong> Start with production metrics: (1) <strong>Failure rate threshold</strong> — typically 50% over a sliding window of 10-20 calls. (2) <strong>Wait duration</strong> — match the downstream service&apos;s typical recovery time (30s-60s). (3) <strong>Minimum calls</strong> — at least 5-10 to avoid opening on a single failure. Always combine with retries (with exponential backoff) and fallback responses.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>7.3 Saga Pattern</Heading>
            <Text className={styles.sectionDescription}>
              Distributed transactions (2PC) are fragile and slow. The Saga pattern breaks a transaction into a sequence of local transactions, each with a compensating action for rollback. Two flavors: orchestration (central coordinator) and choreography (event-driven).
            </Text>
            <CodeEditor code={sagaPatternCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Design Consideration</div>
              <div className={localStyles.warningCalloutContent}>
                Sagas introduce <strong>eventual consistency</strong>. Between steps, the system is in an intermediate state. Your UI must handle this: show &quot;Processing...&quot; states, use polling or WebSockets for status updates, and design for the possibility that compensating actions may also fail.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>7.4 CQRS (Command Query Responsibility Segregation)</Heading>
            <Text className={styles.sectionDescription}>
              Separate the write model (rich domain, normalized) from the read model (denormalized projections, optimized for queries). This is essential at scale: writes go to a transactional DB, reads come from materialized views or search indices (Elasticsearch).
            </Text>
            <CodeEditor code={cqrsCode} language="kotlin" readOnly height={420} />

            <Heading level={3} className={styles.categoryTitle}>7.5 Context Propagation</Heading>
            <Text className={styles.sectionDescription}>
              In async/coroutine systems, <code>ThreadLocal</code> (e.g. MDC for logging) breaks because coroutines hop between threads. Use Micrometer Context Propagation to ensure Trace IDs and Span IDs flow correctly through suspend functions and reactive chains.
            </Text>
            <CodeEditor code={contextPropagationCode} language="kotlin" readOnly height={340} />

            <div className={localStyles.patternCardsGrid}>
              <div className={localStyles.patternCard}>
                <div className={localStyles.patternCardTitle}>Retry with Backoff</div>
                <div className={localStyles.patternCardDesc}>Exponential backoff + jitter. Never retry non-idempotent operations. Use circuit breaker to stop retries when service is down.</div>
              </div>
              <div className={localStyles.patternCard}>
                <div className={localStyles.patternCardTitle}>Outbox Pattern</div>
                <div className={localStyles.patternCardDesc}>Write events to a DB &quot;outbox&quot; table in the same transaction as the business data. A separate poller publishes to Kafka — guarantees at-least-once delivery.</div>
              </div>
              <div className={localStyles.patternCard}>
                <div className={localStyles.patternCardTitle}>Bulkhead</div>
                <div className={localStyles.patternCardDesc}>Isolate resources per service/consumer. One slow downstream can&apos;t exhaust all threads. Use separate thread pools or Semaphore-based limits.</div>
              </div>
              <div className={localStyles.patternCard}>
                <div className={localStyles.patternCardTitle}>Dead Letter Queue</div>
                <div className={localStyles.patternCardDesc}>Messages that fail processing N times go to a DLQ for manual inspection. Critical for debugging production issues without losing data.</div>
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 8: Testing ─── */}
      <section id="ch8-testing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 8: Testing Strategies for Production Systems
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Testing is not optional for Staff-level engineers — it&apos;s a core competency. You need to know when to use unit tests vs integration tests vs contract tests, how to mock Kotlin-specific constructs, and how to test without a database vs with a real one.
            </Text>

            <div className={localStyles.testingPyramid}>
              <div className={`${localStyles.pyramidLayer} ${localStyles.pyramidE2E}`}>
                E2E Tests
                <div className={localStyles.pyramidLabel}>Slow, brittle, few</div>
              </div>
              <div className={`${localStyles.pyramidLayer} ${localStyles.pyramidIntegration}`}>
                Integration Tests (Testcontainers)
                <div className={localStyles.pyramidLabel}>Real DB, real queues, moderate count</div>
              </div>
              <div className={`${localStyles.pyramidLayer} ${localStyles.pyramidUnit}`}>
                Unit Tests (MockK, JUnit 5)
                <div className={localStyles.pyramidLabel}>Fast, focused, many — test business logic here</div>
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>8.1 MockK — Kotlin-First Mocking</Heading>
            <Text className={styles.sectionDescription}>
              <strong>MockK</strong> is the de facto mocking library for Kotlin. Unlike Mockito, it handles final classes (all Kotlin classes are final by default), extension functions, <code>suspend</code> functions, and object declarations natively. Use <code>coEvery</code> / <code>coVerify</code> for coroutine functions.
            </Text>
            <CodeEditor code={mockKTestCode} language="kotlin" readOnly height={520} />

            <Heading level={3} className={styles.categoryTitle}>8.2 Testcontainers — Real Infrastructure</Heading>
            <Text className={styles.sectionDescription}>
              Never mock the database. <strong>Testcontainers</strong> spins up real PostgreSQL, Redis, Kafka containers for integration tests. This catches real issues: FK constraints, unique index violations, SQL dialect differences, and N+1 queries.
            </Text>
            <CodeEditor code={testcontainersCode} language="kotlin" readOnly height={540} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you mock the database vs use Testcontainers?<br />
                <strong>A:</strong> Mock (unit test) when testing <strong>business logic</strong> — the domain service&apos;s behavior given certain repository responses. Use Testcontainers (integration test) when testing <strong>data access logic</strong> — that queries return correct results, constraints are enforced, and migrations work. Never mock in integration tests; never use real DBs in unit tests.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>8.3 Architecture Tests with ArchUnit</Heading>
            <Text className={styles.sectionDescription}>
              Enforce architectural rules as automated tests. Prevent domain-from-depending-on-infrastructure drift, ensure naming conventions, and validate layer boundaries — all checked in CI.
            </Text>
            <CodeEditor code={archTestCode} language="kotlin" readOnly height={400} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Testing strategy for hexagonal architecture:</strong> Domain layer = unit tests with MockK (fast, no Spring). Application layer = integration tests with <code>@SpringBootTest</code> + Testcontainers. Infrastructure adapters = contract tests verifying port implementations. Architecture = ArchUnit tests in CI.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 9: Interview Gauntlet ─── */}
      <section id="ch9-interview" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 9: The Senior Interview Gauntlet
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              This chapter combines everything: system design, live coding, and behavioral questions. These are the exact scenarios you&apos;ll face in L5-L7 backend interviews at top tech companies.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>9.1 System Design: High-Throughput Notification Service</Heading>
            <Text className={styles.sectionDescription}>
              Design a notification service that sends millions of notifications (email, push, SMS) with guarantees: at-least-once delivery, idempotency, rate limiting per user, and multi-channel support.
            </Text>

            <div className={localStyles.keyConceptCard}>
              <div className={localStyles.keyConceptTitle}>Key Design Decisions</div>
              <div className={localStyles.keyConceptText}>
                <strong>Message Queue:</strong> Kafka for high throughput + ordering by partition key (user ID).<br />
                <strong>Idempotency:</strong> Redis-based dedup with TTL (as shown in Ch.7).<br />
                <strong>Rate Limiting:</strong> Per-user token bucket to prevent notification fatigue.<br />
                <strong>Pagination:</strong> Keyset pagination (not OFFSET) for querying millions of users.<br />
                <strong>Retry:</strong> DLQ for failed sends, exponential backoff per channel.
              </div>
            </div>

            <CodeEditor code={systemDesignCode} language="kotlin" readOnly height={480} />

            <Heading level={3} className={styles.categoryTitle}>9.2 Live Coding: Token Bucket Rate Limiter</Heading>
            <Text className={styles.sectionDescription}>
              Implement the Token Bucket algorithm with Kotlin Coroutines <code>Mutex</code>. This is a classic interview problem — interviewers want to see thread-safe code, mathematical correctness, and clean API design.
            </Text>
            <CodeEditor code={rateLimiterCode} language="kotlin" readOnly height={520} />

            <Heading level={3} className={styles.categoryTitle}>9.3 Rapid-Fire Interview Questions</Heading>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 1</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> What is the difference between <code>coroutineScope</code> and <code>supervisorScope</code>?<br />
                <strong>A:</strong> <code>coroutineScope</code>: if any child fails, <em>all</em> siblings are cancelled (fail-fast). <code>supervisorScope</code>: child failures don&apos;t affect siblings — each is independent. Use <code>supervisorScope</code> for fan-out operations where partial results are acceptable (e.g., fetching data from multiple optional sources).
              </div>
            </div>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 2</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Explain the N+1 query problem and how to solve it in JPA.<br />
                <strong>A:</strong> Loading a parent entity and then lazily loading each child individually. Solutions: (1) <code>@EntityGraph</code> for declarative fetch joins, (2) <code>JOIN FETCH</code> in JPQL, (3) <code>@BatchSize</code> to batch lazy loads. In Exposed: just write the JOIN explicitly in the DSL.
              </div>
            </div>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 3</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How do you handle database migrations in a zero-downtime deployment?<br />
                <strong>A:</strong> <strong>Expand-and-contract pattern:</strong> (1) Add new column (nullable, with default). (2) Deploy code that writes to both old and new columns. (3) Backfill existing data. (4) Deploy code that reads from new column only. (5) Drop old column. Never rename or drop columns in a single deployment.
              </div>
            </div>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 4</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> What is backpressure and how do Kotlin Flows handle it?<br />
                <strong>A:</strong> Backpressure occurs when a producer emits data faster than a consumer can process it. Flows handle it natively because <code>emit()</code> suspends until the collector is ready. Additional strategies: <code>conflate()</code> drops intermediate values, <code>buffer()</code> adds a buffer, and <code>collectLatest</code> cancels slow processing when new values arrive.
              </div>
            </div>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 5</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you use event sourcing vs traditional CRUD?<br />
                <strong>A:</strong> Event sourcing when: (1) you need a complete audit trail (finance, healthcare), (2) you need to replay events to rebuild state or create new projections, (3) domain events drive other systems (CQRS). Traditional CRUD when: (1) simple CRUD operations, (2) team isn&apos;t familiar with event-driven patterns, (3) eventual consistency is unacceptable for the business.
              </div>
            </div>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Question 6</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How does Kotlin&apos;s <code>inline</code> modifier work and when should you use it?<br />
                <strong>A:</strong> <code>inline</code> replaces the function call with the function body at the call site — no lambda object allocation, no virtual dispatch. Use it for: (1) higher-order functions called in tight loops (performance), (2) reified type parameters (<code>inline fun &lt;reified T&gt;</code> — type info available at runtime). Don&apos;t inline large functions — it increases bytecode size.
              </div>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                <strong>&quot;Why Kotlin?&quot;</strong> Focus on correctness (null safety), maintainability (expressiveness), and performance (Coroutines). Avoid subjective answers like &quot;it&apos;s nicer&quot; — cite specific technical advantages with production impact.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 10: API Design & REST ─── */}
      <section id="ch10-api" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 10: API Design & REST Best Practices
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              A well-designed API is the most important interface in your system. It outlasts any implementation. Senior engineers are expected to design APIs that are consistent, evolvable, and self-documenting. This chapter covers RESTful design, error handling with <code>ProblemDetail</code>, versioning strategies, and cursor-based pagination.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>10.1 RESTful Controller Design</Heading>
            <Text className={styles.sectionDescription}>
              Use proper HTTP methods: <code>GET</code> for reads, <code>POST</code> for creation (returns <code>201 Created</code> with <code>Location</code> header), <code>PATCH</code> for partial updates, <code>DELETE</code> returns <code>204 No Content</code>. Always return the created/updated resource in the response body.
            </Text>
            <CodeEditor code={restControllerCode} language="kotlin" readOnly height={520} />

            <Heading level={3} className={styles.categoryTitle}>10.2 Error Handling with RFC 9457 Problem Detail</Heading>
            <Text className={styles.sectionDescription}>
              Spring Boot 3+ natively supports <code>ProblemDetail</code> (RFC 9457) — a standardized JSON error format. Stop returning ad-hoc error objects. Use <code>@RestControllerAdvice</code> with typed exception handlers. Include a <code>type</code> URI for documentation, and <code>setProperty()</code> for domain-specific fields.
            </Text>
            <CodeEditor code={problemDetailCode} language="kotlin" readOnly height={560} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How do you design error responses for a public API?<br />
                <strong>A:</strong> Use RFC 9457 <code>ProblemDetail</code>: consistent structure with <code>type</code> (URI to error docs), <code>title</code> (human-readable), <code>status</code> (HTTP code), <code>detail</code> (instance-specific message), and custom extension fields. Never expose stack traces or internal details. Map internal exceptions to business-friendly error codes.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>10.3 API Versioning</Heading>
            <Text className={styles.sectionDescription}>
              Three strategies: <strong>URI path</strong> (<code>/api/v1/</code>) — most explicit, easy to route. <strong>Header-based</strong> (<code>X-API-Version</code>) — cleaner URLs, harder to test. <strong>Content negotiation</strong> (<code>Accept: application/vnd.myapi.v2+json</code>) — RESTful purist approach. For most teams, URI path versioning wins on simplicity.
            </Text>
            <CodeEditor code={apiVersioningCode} language="kotlin" readOnly height={440} />

            <Heading level={3} className={styles.categoryTitle}>10.4 Cursor-Based Pagination</Heading>
            <Text className={styles.sectionDescription}>
              <code>OFFSET</code> pagination is O(n) — the database scans and discards all previous rows. <strong>Keyset pagination</strong> uses a cursor (typically a timestamp or ID) and seeks directly to the position. This is O(1) and stable under concurrent writes. Always use keyset for large datasets.
            </Text>
            <CodeEditor code={keysetPaginationCode} language="kotlin" readOnly height={400} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Performance Trap</div>
              <div className={localStyles.warningCalloutContent}>
                <code>OFFSET 100000</code> on a table with millions of rows will scan and discard 100,000 rows before returning results. With keyset pagination, the query jumps directly to the cursor position using an index seek. The difference can be 100x at scale.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 11: Security & Authentication ─── */}
      <section id="ch11-security" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 11: Security & Authentication
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Security is not a feature — it&apos;s a constraint that affects every layer. Senior engineers must understand <code>Spring Security</code> configuration, JWT token lifecycle, OAuth2 resource servers, CORS policies, and method-level authorization. A single misconfiguration can expose your entire system.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>11.1 Spring Security Kotlin DSL</Heading>
            <Text className={styles.sectionDescription}>
              Spring Security 6+ provides a Kotlin DSL that replaces the verbose Java <code>HttpSecurity</code> builder chain. Configure CSRF (disable for stateless APIs), CORS origins, authorization rules, OAuth2 resource server, and session management in a single readable block.
            </Text>
            <CodeEditor code={springSecurityCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Why disable CSRF for REST APIs?<br />
                <strong>A:</strong> CSRF protects against cross-site form submissions that use <strong>cookies</strong> for authentication. Stateless APIs that use <code>Authorization: Bearer</code> headers are not vulnerable to CSRF because browsers don&apos;t automatically attach custom headers. Disabling CSRF for cookie-based auth would be a critical vulnerability.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>11.2 JWT Authentication</Heading>
            <Text className={styles.sectionDescription}>
              JWTs enable stateless authentication: the token contains the user&apos;s identity and roles, signed with a secret key. No session storage needed. Use <code>HMAC-SHA256</code> for symmetric signing or <code>RS256</code> for asymmetric (when multiple services need to validate tokens).
            </Text>
            <CodeEditor code={jwtAuthCode} language="kotlin" readOnly height={560} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Security Gotcha</div>
              <div className={localStyles.warningCalloutContent}>
                Never store JWTs in <code>localStorage</code> — vulnerable to XSS. Use <code>HttpOnly</code> cookies for web apps, or keep tokens in memory and use refresh tokens. Always set short expiration times (15-30 min) and implement token rotation. Never put sensitive data in the JWT payload — it&apos;s base64-encoded, not encrypted.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>11.3 Method-Level Security</Heading>
            <Text className={styles.sectionDescription}>
              Use <code>@PreAuthorize</code> and <code>@PostAuthorize</code> for fine-grained access control at the service layer. Spring Expression Language (SpEL) enables dynamic rules: &quot;only the owner can access this resource&quot; or &quot;admins can access everything&quot;. Create custom annotations for reusable security patterns.
            </Text>
            <CodeEditor code={methodSecurityCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Defense in depth:</strong> Don&apos;t rely on a single layer. Combine: (1) <code>SecurityFilterChain</code> for URL-level rules, (2) <code>@PreAuthorize</code> for method-level, (3) domain-level checks in your business logic. If the security annotation is removed by accident, the domain validation still prevents unauthorized access.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 12: Performance & Observability ─── */}
      <section id="ch12-observability" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 12: Performance & Observability
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              You can&apos;t improve what you can&apos;t measure. Staff engineers are expected to design systems with observability built in: multi-level caching, custom business metrics, structured logging with correlation IDs, and Kubernetes-native health checks. This chapter covers the full observability stack.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>12.1 Multi-Level Caching</Heading>
            <Text className={styles.sectionDescription}>
              Use a two-tier cache: <strong>L1</strong> (Caffeine, in-process, microsecond reads) for hot data, <strong>L2</strong> (Redis, shared, millisecond reads) for consistency across instances. Spring&apos;s <code>@Cacheable</code> / <code>@CacheEvict</code> annotations make it declarative. Use <code>CompositeCacheManager</code> to chain both.
            </Text>
            <CodeEditor code={cachingCode} language="kotlin" readOnly height={560} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How do you handle cache invalidation in a multi-instance deployment?<br />
                <strong>A:</strong> L1 (in-memory) caches are instance-local — updates on one instance won&apos;t invalidate others. Solutions: (1) Short TTL for L1 (5 min max). (2) Use Redis Pub/Sub to broadcast invalidation events. (3) <code>@CacheEvict</code> only evicts L2 (Redis); L1 expires naturally. (4) For critical data, skip L1 entirely and use only L2.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>12.2 Custom Business Metrics</Heading>
            <Text className={styles.sectionDescription}>
              Technical metrics (<code>http_requests_total</code>) are not enough. Track <strong>business metrics</strong>: orders per minute, revenue by channel, conversion rates. Use Micrometer&apos;s <code>Counter</code>, <code>Timer</code>, and <code>Gauge</code> to expose these to Prometheus/Grafana. Add structured logging with correlation IDs for distributed tracing.
            </Text>
            <CodeEditor code={metricsCode} language="kotlin" readOnly height={480} />

            <Heading level={3} className={styles.categoryTitle}>12.3 Health Checks & Kubernetes Probes</Heading>
            <Text className={styles.sectionDescription}>
              Kubernetes needs three probes: <code>liveness</code> (is the app alive?), <code>readiness</code> (can it serve traffic?), and <code>startup</code> (has it finished initializing?). Spring Boot Actuator provides these out of the box. Add custom <code>HealthIndicator</code> implementations for each dependency (database, Kafka, external APIs).
            </Text>
            <CodeEditor code={healthCheckCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Probe design principle:</strong> Liveness should only check if the JVM is healthy — never include external dependency checks (they&apos;d cause unnecessary restarts). Readiness should check database, cache, and message queue connectivity. If readiness fails, Kubernetes removes the pod from the load balancer but doesn&apos;t restart it.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 13: Kotlin Advanced Type System ─── */}
      <section id="ch13-types" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 13: Kotlin Advanced Type System
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Kotlin&apos;s type system goes far beyond null safety. <code>sealed classes</code> enable exhaustive pattern matching, <code>value classes</code> provide type-safe wrappers with zero overhead, <code>delegation</code> replaces inheritance, and <code>DSL builders</code> create domain-specific languages. Mastering these puts you in the top tier of Kotlin developers.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>13.1 Sealed Classes & Interfaces</Heading>
            <Text className={styles.sectionDescription}>
              <code>sealed class</code> restricts hierarchy — all subtypes must be defined in the same package. The compiler knows every possible subtype, enabling exhaustive <code>when</code> expressions without <code>else</code>. Adding a new subtype forces you to update every <code>when</code> — the compiler catches missing cases.
            </Text>
            <CodeEditor code={sealedClassCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you use <code>sealed class</code> vs <code>enum class</code>?<br />
                <strong>A:</strong> Use <code>enum</code> when all variants are singletons with the same data (e.g., <code>Status.ACTIVE</code>, <code>Status.INACTIVE</code>). Use <code>sealed class</code> when variants carry different data (e.g., <code>Success(data)</code> vs <code>Error(message, code)</code>). Sealed classes are Kotlin&apos;s equivalent of Rust&apos;s <code>enum</code> or Haskell&apos;s algebraic data types.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>13.2 Value Classes (Inline Classes)</Heading>
            <Text className={styles.sectionDescription}>
              <code>@JvmInline value class</code> wraps a single property with zero runtime overhead — the wrapper is erased at compile time. Use them to prevent &quot;primitive obsession&quot;: instead of passing <code>Long</code> for every ID, use <code>UserId</code>, <code>OrderId</code>, <code>ProductId</code>. The compiler prevents mixing them up.
            </Text>
            <CodeEditor code={valueClassCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Common Mistake</div>
              <div className={localStyles.warningCalloutContent}>
                Without value classes, this compiles: <code>transferMoney(orderId, userId, amount)</code> — silently swapping user and order IDs. With value classes, it&apos;s a compile-time error. This is especially critical in financial systems where ID confusion can cause real money to go to the wrong account.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>13.3 Delegation Pattern</Heading>
            <Text className={styles.sectionDescription}>
              Kotlin&apos;s <code>by</code> keyword enables class delegation: implement an interface by delegating to another object. Override only the methods you need — the rest forward automatically. This replaces inheritance-heavy designs with clean composition. Property delegation (<code>lazy</code>, <code>observable</code>, <code>map</code>) is equally powerful.
            </Text>
            <CodeEditor code={delegationCode} language="kotlin" readOnly height={480} />

            <Heading level={3} className={styles.categoryTitle}>13.4 Type-Safe DSL Builders</Heading>
            <Text className={styles.sectionDescription}>
              Kotlin&apos;s lambda-with-receiver (<code>T.() -&gt; Unit</code>) enables building fluent DSLs. This is the same mechanism behind <code>buildList</code>, <code>apply</code>, Ktor routes, Gradle build scripts, and Spring&apos;s Kotlin DSL. Understanding this pattern lets you create domain-specific APIs that read like English.
            </Text>
            <CodeEditor code={dslBuilderCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>When to create a DSL:</strong> When you find yourself building complex configuration objects with many optional parameters. If the builder pattern would require 10+ <code>.withX()</code> calls, a DSL with lambda-with-receiver will be more readable and discoverable via IDE autocomplete.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 14: DevOps & Deployment ─── */}
      <section id="ch14-devops" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 14: DevOps & Deployment
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Staff engineers own the full lifecycle — from code to production. This chapter covers multi-stage Docker builds, GraalVM native compilation for instant startup, Kubernetes deployments with proper health probes, and Helm charts for parameterized deployments. These are the skills that turn a backend developer into a platform engineer.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>14.1 Multi-Stage Docker Builds</Heading>
            <Text className={styles.sectionDescription}>
              Always use multi-stage builds: the builder stage has the JDK and Gradle for compilation, the runtime stage has only the JRE. This reduces image size from ~800MB to ~200MB. Run as a non-root user, tune JVM flags for containers (<code>-XX:+UseContainerSupport</code>), and add a <code>HEALTHCHECK</code> instruction.
            </Text>
            <CodeEditor code={dockerfileCode} language="dockerfile" readOnly height={480} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Why is <code>-XX:MaxRAMPercentage=75.0</code> important in containers?<br />
                <strong>A:</strong> Without it, the JVM may try to use more memory than the container limit, causing OOMKill. <code>UseContainerSupport</code> makes the JVM aware of cgroup limits, and <code>MaxRAMPercentage</code> caps heap usage at 75% of the container memory, leaving room for off-heap memory (metaspace, thread stacks, NIO buffers).
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>14.2 GraalVM Native Images</Heading>
            <Text className={styles.sectionDescription}>
              GraalVM compiles your Kotlin/Spring Boot app to a native binary at build time. Result: ~50ms startup (vs ~3s JVM), ~50MB memory (vs ~256MB), 25MB binary. The tradeoff: longer build times (~5 min), no JIT optimization at runtime, and reflection must be declared ahead of time.
            </Text>
            <CodeEditor code={graalvmCode} language="kotlin" readOnly height={400} />

            <table className={localStyles.comparisonTable}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>JVM (JIT)</th>
                  <th>GraalVM Native</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Startup time</td>
                  <td>2-5 seconds</td>
                  <td>~50 milliseconds</td>
                </tr>
                <tr>
                  <td>Memory usage</td>
                  <td>256-512 MB</td>
                  <td>50-100 MB</td>
                </tr>
                <tr>
                  <td>Peak throughput</td>
                  <td>Higher (JIT optimized)</td>
                  <td>Lower (AOT only)</td>
                </tr>
                <tr>
                  <td>Build time</td>
                  <td>~30 seconds</td>
                  <td>~5 minutes</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>Long-running services</td>
                  <td>Serverless, CLI, scale-to-zero</td>
                </tr>
              </tbody>
            </table>

            <Heading level={3} className={styles.categoryTitle}>14.3 Kubernetes Deployment</Heading>
            <Text className={styles.sectionDescription}>
              A production Kubernetes deployment needs: <code>RollingUpdate</code> strategy with <code>maxUnavailable: 0</code> for zero-downtime, proper resource requests/limits, liveness/readiness/startup probes, Prometheus annotations for metrics scraping, and secrets mounted from <code>SecretKeyRef</code>.
            </Text>
            <CodeEditor code={k8sDeploymentCode} language="yaml" readOnly height={560} />

            <Heading level={3} className={styles.categoryTitle}>14.4 Helm Charts for Parameterized Deployments</Heading>
            <Text className={styles.sectionDescription}>
              Helm packages Kubernetes manifests as reusable charts with environment-specific values. Use <code>values.yaml</code> for defaults, override with <code>values-prod.yaml</code>. Enable <code>HorizontalPodAutoscaler</code> for auto-scaling, configure <code>Ingress</code> with TLS via cert-manager, and set rate limits at the ingress level.
            </Text>
            <CodeEditor code={helmChartCode} language="yaml" readOnly height={480} />

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Production checklist:</strong> (1) Non-root container user. (2) Resource limits set. (3) All three probes configured. (4) Secrets never in environment variables — use mounted secrets or external secret managers (Vault, AWS Secrets Manager). (5) HPA enabled with CPU and memory targets. (6) PodDisruptionBudget for maintenance windows.
              </span>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 15: Microservices Architecture ─── */}
      <section id="ch15-microservices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 15: Microservices Architecture
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Microservices decompose a monolith into independently deployable services, each owning its own data store and business capability. While the pattern enables team autonomy and independent scaling, it introduces significant distributed systems complexity — network partitions, data consistency challenges, and operational overhead. This chapter covers the gateway pattern, service discovery, and inter-service communication strategies that production systems at scale actually use.
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>API Gateway pattern with Spring Cloud Gateway — routing, rate limiting, and circuit breakers</li>
                <li className={localStyles.chapterOverviewItem}>Service discovery with Kubernetes-native approaches and load-balanced WebClient</li>
                <li className={localStyles.chapterOverviewItem}>Event-driven inter-service communication with Kafka for eventual consistency</li>
                <li className={localStyles.chapterOverviewItem}>When to choose REST, gRPC, or async messaging between services</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>15.1 API Gateway Pattern</Heading>
            <Text className={styles.sectionDescription}>
              The API Gateway is the single entry point for all client traffic. It handles cross-cutting concerns like authentication, rate limiting, circuit breaking, and request routing — keeping these concerns out of individual microservices. <code>Spring Cloud Gateway</code> provides a reactive, non-blocking gateway built on Project Reactor and Netty. Each route can have its own <code>CircuitBreaker</code>, retry policy, and <code>RequestRateLimiter</code>. Always remove sensitive headers (like <code>Cookie</code>) before forwarding to internal services, and use <code>lb://</code> URIs for load-balanced routing via service discovery.
            </Text>
            <CodeEditor code={apiGatewayCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.flowDiagram}>
              <span className={`${localStyles.flowNode} ${localStyles.flowNodeBlue}`}>Client</span>
              <span className={localStyles.flowArrow}>→</span>
              <span className={`${localStyles.flowNode} ${localStyles.flowNodePurple}`}>API Gateway</span>
              <span className={localStyles.flowArrow}>→</span>
              <span className={`${localStyles.flowNode} ${localStyles.flowNodeGreen}`}>Order Service</span>
              <span className={localStyles.flowArrow}>→</span>
              <span className={`${localStyles.flowNode} ${localStyles.flowNodeOrange}`}>Kafka Events</span>
            </div>

            <Heading level={3} className={styles.categoryTitle}>15.2 Service Discovery & Internal Communication</Heading>
            <Text className={styles.sectionDescription}>
              In a microservices world, services must find each other without hardcoded URLs. Kubernetes-native discovery uses DNS (<code>http://order-service</code> resolves via kube-dns), while Spring Cloud Discovery adds features like health-aware routing and zone affinity. For internal high-throughput communication, <code>gRPC</code> offers binary serialization (Protocol Buffers) with ~10x lower latency than JSON REST. Use <code>@LoadBalanced WebClient</code> for HTTP-based calls and gRPC for performance-critical service-to-service paths.
            </Text>
            <CodeEditor code={serviceDiscoveryCode} language="kotlin" readOnly height={560} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> When would you choose gRPC over REST for inter-service communication?<br />
                <strong>A:</strong> gRPC excels for high-throughput, low-latency internal communication: binary serialization is ~5-10x faster than JSON, HTTP/2 multiplexing avoids head-of-line blocking, and <code>.proto</code> files provide strong contracts. REST is better for external APIs (browser-friendly, widely tooled) and services with simple request/response patterns. A common production setup uses REST at the gateway for external clients and gRPC internally between services.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>15.3 Event-Driven Microservice Communication</Heading>
            <Text className={styles.sectionDescription}>
              Synchronous inter-service calls create tight coupling and cascade failures. Event-driven architecture decouples services: the Order Service publishes an <code>OrderCreatedEvent</code> to Kafka, and the Inventory Service consumes it asynchronously. This achieves eventual consistency — the inventory won&apos;t update in the same millisecond, but the system is resilient to individual service outages. The key pattern is &quot;publish events for state changes, consume events for reactions.&quot;
            </Text>
            <CodeEditor code={eventDrivenMicroCode} language="kotlin" readOnly height={600} />

            <div className={localStyles.scenarioCallout}>
              <div className={localStyles.scenarioCalloutLabel}>Real-World Scenario</div>
              <div className={localStyles.scenarioCalloutContent}>
                <strong>E-commerce order flow:</strong> When a customer places an order, the Order Service saves it and publishes <code>OrderCreatedEvent</code>. The Inventory Service reserves stock, the Payment Service charges the card, and the Notification Service sends a confirmation email — all reacting independently to the same event. If the Payment Service is temporarily down, messages queue in Kafka and are processed when it recovers. No data is lost, and other services continue unaffected.
              </div>
            </div>

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                Start with a modular monolith and extract microservices only when you have a clear organizational or scaling reason. Premature decomposition is the #1 microservices anti-pattern — you&apos;ll spend more time on infrastructure than on business logic.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 16: Database Design & Optimization ─── */}
      <section id="ch16-database" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 16: Database Design & Optimization
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              Database performance is the bottleneck of most backend systems. A well-indexed PostgreSQL database can serve 50,000 queries per second on modest hardware, while a poorly indexed one struggles at 500. This chapter covers strategic indexing (the single highest-impact optimization), query patterns to avoid (N+1 is the classic trap), and connection pool tuning that prevents your application from starving under load.
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>Composite, partial, covering, and expression indexes — when to use each type</li>
                <li className={localStyles.chapterOverviewItem}>Detecting and eliminating N+1 queries with JOINs and batch fetching</li>
                <li className={localStyles.chapterOverviewItem}>HikariCP connection pool sizing and tuning for production workloads</li>
                <li className={localStyles.chapterOverviewItem}>Read replica routing for scaling read-heavy workloads</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>16.1 Strategic Indexing</Heading>
            <Text className={styles.sectionDescription}>
              Indexes are the single biggest performance lever in any relational database. A <strong>composite index</strong> on <code>(customer_id, status, created_at DESC)</code> covers your most common query pattern in a single B-tree lookup. <strong>Partial indexes</strong> (with a <code>WHERE</code> clause) index only the rows you actually query — a partial index on <code>status = &apos;PENDING&apos;</code> is 90% smaller than a full index. <strong>Covering indexes</strong> use <code>INCLUDE</code> to add non-key columns, enabling index-only scans that skip the table heap entirely. <strong>Expression indexes</strong> like <code>LOWER(email)</code> support case-insensitive lookups efficiently.
            </Text>
            <CodeEditor code={indexStrategyCode} language="sql" readOnly height={380} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Common Pitfall</div>
              <div className={localStyles.warningCalloutContent}>
                Don&apos;t blindly add indexes. Each index slows down writes (INSERT/UPDATE must update the index B-tree), consumes disk space, and adds vacuum overhead. For a write-heavy table with 50M rows, a poorly chosen index can make writes 2-3x slower. Always check <code>EXPLAIN ANALYZE</code> to verify the optimizer uses your index before leaving it in production.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>16.2 Query Optimization Patterns</Heading>
            <Text className={styles.sectionDescription}>
              The N+1 problem is the most common performance bug in ORM-based applications. It happens when you load a list of entities, then lazily load a related entity for each one — resulting in 1 query for the list plus N queries for the relations. The fix is straightforward: use an explicit <code>JOIN</code> query with projection, or use <code>@EntityGraph</code> in JPA to eager-fetch relations in a single query. This turns N+1 queries into 1 query, often reducing response time from seconds to milliseconds.
            </Text>
            <CodeEditor code={queryOptimizationCode} language="kotlin" readOnly height={440} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> You have a query that takes 3 seconds. Walk me through your debugging process.<br />
                <strong>A:</strong> (1) Run <code>EXPLAIN ANALYZE</code> to get the execution plan — look for sequential scans on large tables, nested loop joins, and sort operations. (2) Check if the right indexes exist for the WHERE/ORDER BY columns. (3) Verify the query planner is using the indexes (sometimes a stale statistics leads to bad plans — run <code>ANALYZE</code>). (4) Consider if the query can be restructured to use a covering index. (5) If it&apos;s a reporting query, consider materializing it or using a read replica.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>16.3 Connection Pool Tuning</Heading>
            <Text className={styles.sectionDescription}>
              Connection pools prevent your application from opening/closing database connections on every request (each connection costs ~3MB of PostgreSQL memory and ~150ms to establish). <code>HikariCP</code> is the default in Spring Boot and the fastest JVM connection pool. The optimal pool size follows the formula: <code>(2 * CPU cores) + number of spinning disks</code>. For a 4-core server with SSDs, that&apos;s about 10 connections. More connections means more contention and context switching — bigger is not better. Set <code>maxLifetime</code> slightly below the database&apos;s connection timeout to prevent stale connections, and enable <code>leakDetectionThreshold</code> in development to catch leaked connections early.
            </Text>
            <CodeEditor code={connectionPoolCode} language="kotlin" readOnly height={380} />

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                Most database performance problems are solved by three things: proper indexes, eliminating N+1 queries, and right-sizing the connection pool. Master these before reaching for caching, sharding, or read replicas. A well-indexed single PostgreSQL instance can handle remarkably high throughput.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 17: Event-Driven Architecture ─── */}
      <section id="ch17-events" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 17: Event-Driven Architecture
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Event-driven architecture (EDA) is the backbone of modern distributed systems. Instead of synchronous request-response chains, services communicate through events — immutable facts that describe something that happened. This decouples producers from consumers, enables temporal decoupling (consumers can be offline), and creates a natural audit trail. This chapter covers Apache Kafka configuration for exactly-once delivery, the Transactional Outbox pattern for atomic database + event publishing, consumer error handling with Dead Letter Queues, and Event Sourcing for reconstructing state from event history.
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>Kafka producer configuration with idempotence and exactly-once semantics</li>
                <li className={localStyles.chapterOverviewItem}>Transactional Outbox pattern — solving the dual-write problem</li>
                <li className={localStyles.chapterOverviewItem}>Consumer error handling with manual acknowledgment and Dead Letter Queues</li>
                <li className={localStyles.chapterOverviewItem}>Event Sourcing — storing events as the source of truth and rebuilding state</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>17.1 Kafka Producer & Transactional Outbox</Heading>
            <Text className={styles.sectionDescription}>
              The dual-write problem is a classic distributed systems trap: you need to save data to your database AND publish an event to Kafka, but these are two separate systems that can&apos;t participate in the same transaction. If the DB write succeeds but Kafka publish fails, you have inconsistency. The <strong>Transactional Outbox</strong> pattern solves this elegantly: write the event to an <code>outbox</code> table in the same database transaction as your business data. A separate poller (or CDC connector like Debezium) reads the outbox and publishes to Kafka. This guarantees at-least-once delivery with no data loss.
            </Text>
            <CodeEditor code={kafkaProducerCode} language="kotlin" readOnly height={600} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> Explain the difference between at-most-once, at-least-once, and exactly-once delivery in Kafka.<br />
                <strong>A:</strong> <strong>At-most-once:</strong> consumer commits offset before processing — if it crashes mid-processing, the message is skipped (data loss). <strong>At-least-once:</strong> consumer processes first, then commits — if it crashes after processing but before committing, the message is reprocessed (duplicates). <strong>Exactly-once:</strong> Kafka&apos;s idempotent producer (<code>enable.idempotence=true</code>) prevents duplicate writes, and transactional consumers use read-committed isolation to see only completed transactions. In practice, most systems use at-least-once with idempotent consumers (processing the same event twice produces the same result).
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>17.2 Kafka Consumer & Error Handling</Heading>
            <Text className={styles.sectionDescription}>
              Consumer reliability is just as important as producer reliability. Disable <code>auto.commit</code> and use manual acknowledgment — this ensures you only commit offsets after successful processing. When a message fails, the <code>DefaultErrorHandler</code> retries with configurable backoff (e.g., 3 retries with 1-second intervals). After exhausting retries, the message is sent to a <strong>Dead Letter Queue</strong> (DLQ) topic for manual investigation. Always set <code>concurrency</code> on the listener container to match your partition count for maximum parallelism.
            </Text>
            <CodeEditor code={kafkaConsumerCode} language="kotlin" readOnly height={680} />

            <div className={localStyles.warningCallout}>
              <div className={localStyles.warningCalloutLabel}>Common Pitfall</div>
              <div className={localStyles.warningCalloutContent}>
                Never use <code>auto.commit=true</code> in production. If your consumer crashes after polling but before processing, those messages are lost (committed but not processed). Manual acknowledgment with <code>AckMode.MANUAL_IMMEDIATE</code> ensures you only commit offsets for messages you&apos;ve actually handled. This is the difference between &quot;works in dev&quot; and &quot;works in production.&quot;
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>17.3 Event Sourcing</Heading>
            <Text className={styles.sectionDescription}>
              Event Sourcing flips the traditional persistence model: instead of storing the current state, you store every state change as an immutable event. The current state is reconstructed by replaying events from the beginning (or from a snapshot). This provides a complete audit trail, enables temporal queries (&quot;what was the order status at 3pm yesterday?&quot;), and allows projecting the same events into different read models. The tradeoff is complexity — you need event versioning, snapshot optimization, and CQRS (Command Query Responsibility Segregation) to keep read performance acceptable as event history grows.
            </Text>
            <CodeEditor code={eventSourcingCode} language="kotlin" readOnly height={640} />

            <div className={localStyles.scenarioCallout}>
              <div className={localStyles.scenarioCalloutLabel}>Real-World Scenario</div>
              <div className={localStyles.scenarioCalloutContent}>
                <strong>Financial systems:</strong> Banks and payment processors use Event Sourcing because regulators require a complete, immutable audit trail of every state change. If a dispute arises, you can replay events to reconstruct exactly what happened and when. Traditional CRUD systems lose this history — once you UPDATE a row, the previous state is gone forever.
              </div>
            </div>

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                Event-driven architecture and Event Sourcing are powerful but complex patterns. Use event-driven communication between microservices for loose coupling. Reserve full Event Sourcing for domains where audit trails and temporal queries are genuine requirements (financial, healthcare, compliance). For most CRUD services, traditional persistence with an outbox pattern is simpler and sufficient.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 18: Kotlin Coroutines Deep Dive ─── */}
      <section id="ch18-coroutines-deep" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 18: Kotlin Coroutines Deep Dive
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              Chapter 5 introduced coroutines vs virtual threads. This chapter goes deeper into the mechanics: dispatchers (where coroutines execute), structured concurrency (how failures propagate), exception handling patterns for production reliability, and testing strategies with virtual time. Mastering these concepts separates engineers who &quot;use coroutines&quot; from engineers who &quot;understand coroutines.&quot; At the staff level, you&apos;re expected to design coroutine architectures, debug subtle concurrency bugs, and teach your team the right patterns.
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>Dispatcher selection — <code>Default</code> for CPU, <code>IO</code> for blocking, <code>limitedParallelism</code> for resource protection</li>
                <li className={localStyles.chapterOverviewItem}>Structured concurrency with <code>supervisorScope</code> for graceful partial failures</li>
                <li className={localStyles.chapterOverviewItem}><code>CoroutineExceptionHandler</code> and the <code>runCatching</code> pattern for production error handling</li>
                <li className={localStyles.chapterOverviewItem}>Testing coroutines with <code>runTest</code>, <code>StandardTestDispatcher</code>, and Turbine for Flows</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>18.1 Dispatchers — Where Coroutines Execute</Heading>
            <Text className={styles.sectionDescription}>
              Every coroutine runs on a dispatcher, which determines which thread (or thread pool) executes it. <code>Dispatchers.Default</code> uses a shared pool sized to the number of CPU cores — use it for CPU-bound computation like JSON parsing or analytics. <code>Dispatchers.IO</code> uses a larger elastic pool (up to 64 threads) designed for blocking I/O like JDBC calls or file reads. <code>limitedParallelism(n)</code> creates a view of a dispatcher with at most <code>n</code> concurrent coroutines — perfect for protecting limited resources like database connection pools. The critical rule: <strong>never do blocking I/O on <code>Dispatchers.Default</code></strong> — it will starve the shared pool and freeze all CPU-bound work in the application.
            </Text>
            <CodeEditor code={dispatchersCode} language="kotlin" readOnly height={520} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> What happens if you call a blocking JDBC query on <code>Dispatchers.Default</code>?<br />
                <strong>A:</strong> <code>Dispatchers.Default</code> has only <code>N</code> threads (where N = CPU cores). If all threads are blocked on JDBC calls, no CPU-bound coroutines can execute — the entire application hangs. This is called &quot;thread starvation.&quot; The fix: always wrap blocking calls in <code>withContext(Dispatchers.IO)</code>, or better, use <code>Dispatchers.IO.limitedParallelism(poolSize)</code> to cap concurrent blocking operations at your connection pool size.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>18.2 Structured Concurrency & Exception Handling</Heading>
            <Text className={styles.sectionDescription}>
              Structured concurrency ensures that when a parent coroutine is cancelled, all its children are cancelled too — no orphan coroutines leaking resources. <code>supervisorScope</code> is the key pattern for production code: unlike regular <code>coroutineScope</code>, a child failure in <code>supervisorScope</code> doesn&apos;t cancel siblings. This is critical for dashboard-style APIs where you fetch data from multiple sources and want partial results even if one source fails. Combine <code>supervisorScope</code> with <code>runCatching</code> and <code>getOrElse</code> to provide graceful fallbacks for each parallel operation.
            </Text>
            <CodeEditor code={exceptionHandlingCode} language="kotlin" readOnly height={500} />

            <div className={localStyles.scenarioCallout}>
              <div className={localStyles.scenarioCalloutLabel}>Real-World Scenario</div>
              <div className={localStyles.scenarioCalloutContent}>
                <strong>Dashboard API:</strong> Your endpoint fetches user profile, recent orders, and ML recommendations in parallel. The ML service has 99.5% uptime — it fails once every 200 requests. With regular <code>coroutineScope</code>, one ML failure cancels everything and returns a 500. With <code>supervisorScope</code> + <code>runCatching</code>, the dashboard renders with the profile and orders, and shows &quot;recommendations unavailable&quot; — a much better user experience.
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>18.3 Testing Coroutines</Heading>
            <Text className={styles.sectionDescription}>
              Coroutine tests use <code>runTest</code> which provides virtual time — delays complete instantly without actual waiting. Use <code>StandardTestDispatcher</code> to control exactly when coroutines execute (unlike <code>UnconfinedTestDispatcher</code> which runs eagerly). For testing <code>Flow</code> emissions, the Turbine library provides an elegant API: <code>flow.test &#123; awaitItem() &#125;</code> lets you assert on each emission sequentially. Always inject dispatchers rather than hardcoding them, so tests can substitute test dispatchers for predictable, deterministic execution.
            </Text>
            <CodeEditor code={coroutineTestingCode} language="kotlin" readOnly height={480} />

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                Coroutines are Kotlin&apos;s most powerful concurrency primitive, but power demands discipline. Use the right dispatcher for each workload, prefer <code>supervisorScope</code> for parallel operations that can partially fail, and always inject dispatchers for testability. A well-designed coroutine architecture handles partial failures gracefully and never starves shared thread pools.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 19: GraphQL with Kotlin ─── */}
      <section id="ch19-graphql" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 19: GraphQL with Kotlin
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyAdvanced}`}>Advanced</span>
            </div>
            <Text className={styles.sectionDescription}>
              GraphQL gives clients the power to request exactly the data they need — no more over-fetching (getting 30 fields when you need 3) and no more under-fetching (making 5 REST calls to assemble one view). The Netflix DGS Framework brings GraphQL to Kotlin/Spring Boot with type-safe resolvers, DataLoaders for batch optimization, and native coroutine support. This chapter covers schema design, resolver implementation, and the critical N+1 problem in GraphQL (which is even more dangerous than in REST because clients control the query shape).
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>GraphQL schema design with proper types, mutations, and subscriptions</li>
                <li className={localStyles.chapterOverviewItem}>Netflix DGS type-safe resolvers with nested field resolution and computed fields</li>
                <li className={localStyles.chapterOverviewItem}>DataLoaders for batching — solving the N+1 problem in GraphQL</li>
                <li className={localStyles.chapterOverviewItem}>When to choose GraphQL vs REST for your API</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>19.1 Schema Design</Heading>
            <Text className={styles.sectionDescription}>
              A well-designed GraphQL schema is your API contract. Define <code>Query</code> for reads, <code>Mutation</code> for writes, and <code>Subscription</code> for real-time updates. Use the <strong>payload pattern</strong> for mutations: return a <code>OrderPayload</code> with both the result and potential errors, rather than throwing exceptions. This gives clients structured error handling. Design types to reflect your domain model — <code>User</code> has <code>orders</code> as a nested field, not a separate endpoint. This is the fundamental shift from REST: the client navigates relationships in a single query.
            </Text>
            <CodeEditor code={graphqlSchemaCode} language="graphql" readOnly height={480} />

            <Heading level={3} className={styles.categoryTitle}>19.2 DGS Resolvers — Type-Safe Data Fetching</Heading>
            <Text className={styles.sectionDescription}>
              The Netflix DGS Framework maps your schema to Kotlin functions with annotations. <code>@DgsQuery</code> resolves top-level queries, while <code>@DgsData</code> resolves nested fields. The key insight: nested resolvers are only called when the client actually requests that field. If a client queries <code>&#123; user(id: 1) &#123; name &#125; &#125;</code>, the <code>orders</code> resolver is never called — this is GraphQL&apos;s efficiency advantage. Computed fields like <code>totalSpent</code> are resolved on-demand, keeping your <code>User</code> entity lean while providing rich derived data when clients need it.
            </Text>
            <CodeEditor code={dgsResolverCode} language="kotlin" readOnly height={440} />

            <Heading level={3} className={styles.categoryTitle}>19.3 DataLoaders — Solving N+1 in GraphQL</Heading>
            <Text className={styles.sectionDescription}>
              The N+1 problem in GraphQL is especially insidious because the server doesn&apos;t control which fields are requested. A query like <code>&#123; orders &#123; user &#123; name &#125; &#125; &#125;</code> would trigger one query for orders, then one query per order to fetch the user — classic N+1. <code>DataLoader</code> solves this by collecting all user IDs requested in a single GraphQL execution and batching them into one query. Instead of N individual <code>findById</code> calls, you make a single <code>findByIds(batch)</code> call. This is mandatory for any production GraphQL API.
            </Text>
            <CodeEditor code={dataLoaderCode} language="kotlin" readOnly height={440} />

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> What are the main trade-offs between GraphQL and REST?<br />
                <strong>A:</strong> <strong>GraphQL advantages:</strong> no over/under-fetching, strong typing, single endpoint, great for mobile (bandwidth-sensitive). <strong>GraphQL disadvantages:</strong> harder to cache (HTTP caching works on URLs, not POST bodies), complex authorization (field-level access control), potential for expensive queries (depth/complexity limits needed). <strong>Rule of thumb:</strong> use GraphQL for client-facing APIs with diverse consumers (web, mobile, partners), REST for simple CRUD APIs and machine-to-machine communication where the query shape is fixed.
              </div>
            </div>

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                GraphQL is not a replacement for REST — it&apos;s an alternative with different trade-offs. Always implement DataLoaders for batch resolution, enforce query depth and complexity limits to prevent abuse, and use the DGS framework for type-safe Kotlin integration. The combination of GraphQL for external APIs and gRPC for internal services gives you the best of both worlds.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Chapter 20: System Design Framework ─── */}
      <section id="ch20-system-design" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div className={localStyles.chapterHeader}>
              <Heading level={2} className={styles.sectionTitle}>
                Chapter 20: Behavioral & System Design Framework
              </Heading>
              <span className={`${localStyles.difficultyBadge} ${localStyles.difficultyExpert}`}>Expert</span>
            </div>
            <Text className={styles.sectionDescription}>
              At the Staff/Principal level, system design interviews are the most heavily weighted portion of the loop. You&apos;re not just evaluated on technical knowledge — interviewers assess your ability to structure ambiguity, make reasoned trade-offs, and communicate complex architectures clearly. This chapter provides a repeatable 5-step framework that works for any system design question, from URL shorteners to real-time chat systems. The framework forces you to start with requirements (not solutions), estimate scale, design high-level components, deep-dive into critical paths, and explicitly address bottlenecks and failure modes.
            </Text>

            <div className={localStyles.chapterOverview}>
              <div className={localStyles.chapterOverviewLabel}>What you will learn</div>
              <ul className={localStyles.chapterOverviewList}>
                <li className={localStyles.chapterOverviewItem}>The 5-step system design framework: Requirements → Estimation → High-Level → Deep Dive → Trade-offs</li>
                <li className={localStyles.chapterOverviewItem}>Back-of-the-envelope capacity estimation with real numbers</li>
                <li className={localStyles.chapterOverviewItem}>How to identify and address bottlenecks, single points of failure, and hot spots</li>
                <li className={localStyles.chapterOverviewItem}>Behavioral framing: how to communicate technical decisions to non-technical stakeholders</li>
              </ul>
            </div>

            <Heading level={3} className={styles.categoryTitle}>20.1 The 5-Step Framework</Heading>
            <Text className={styles.sectionDescription}>
              Every system design interview should follow this structure: (1) <strong>Requirements clarification</strong> — ask what the system does, what scale it operates at, and what constraints exist. Never jump straight to &quot;I&apos;d use Kafka and Redis.&quot; (2) <strong>Capacity estimation</strong> — calculate QPS, storage needs, and bandwidth. This shows you think about scale concretely, not abstractly. (3) <strong>High-level design</strong> — draw the architecture: client → load balancer → API servers → cache → database. Identify the 3-5 core components. (4) <strong>Deep dive</strong> — pick the most interesting/challenging component and design it in detail: database schema, sharding strategy, caching policy, consistency model. (5) <strong>Trade-offs and bottlenecks</strong> — proactively identify single points of failure, hot keys, and what breaks at 10x scale.
            </Text>
            <CodeEditor code={systemDesignFrameworkCode} language="kotlin" readOnly height={440} />

            <div className={localStyles.scenarioCallout}>
              <div className={localStyles.scenarioCalloutLabel}>Real-World Scenario</div>
              <div className={localStyles.scenarioCalloutContent}>
                <strong>Design a URL shortener:</strong> With 100M DAU, you&apos;d calculate ~115 writes/sec and ~11,500 reads/sec (100:1 read:write ratio). The high-level design is: Client → LB → API (generates short code) → Redis cache (hot URLs) → PostgreSQL (persistent storage). For the deep dive, discuss: Base62 encoding for short codes, cache-aside pattern for reads, database sharding by hash of the short code, and CDN for geographic distribution. Trade-offs: strong consistency (reads-after-write) vs eventual consistency (faster but stale).
              </div>
            </div>

            <Heading level={3} className={styles.categoryTitle}>20.2 Capacity Estimation Cheat Sheet</Heading>
            <Text className={styles.sectionDescription}>
              Memorize these numbers for quick estimation in interviews. <strong>Latency:</strong> L1 cache: 1ns, RAM: 100ns, SSD random read: 150μs, HDD seek: 10ms, round-trip same datacenter: 0.5ms, round-trip cross-country: 70ms. <strong>Throughput:</strong> a single PostgreSQL instance can handle ~10,000-50,000 simple queries/sec, Redis handles ~100,000 ops/sec, a single Kafka broker handles ~100,000 messages/sec. <strong>Storage:</strong> 1 tweet = ~250 bytes, 1 URL = ~500 bytes, 1 user profile = ~1KB, 1 image thumbnail = ~50KB, 1 high-res photo = ~2MB.
            </Text>

            <table className={localStyles.comparisonTable}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Throughput</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PostgreSQL (indexed)</td>
                  <td>10-50K qps</td>
                  <td>1-5ms</td>
                </tr>
                <tr>
                  <td>Redis</td>
                  <td>100K ops/sec</td>
                  <td>sub-ms</td>
                </tr>
                <tr>
                  <td>Kafka (per broker)</td>
                  <td>100K msg/sec</td>
                  <td>2-5ms</td>
                </tr>
                <tr>
                  <td>Nginx (HTTP)</td>
                  <td>50K req/sec</td>
                  <td>sub-ms</td>
                </tr>
                <tr>
                  <td>gRPC (unary)</td>
                  <td>30K req/sec</td>
                  <td>1-2ms</td>
                </tr>
              </tbody>
            </table>

            <div className={localStyles.interviewCallout}>
              <div className={localStyles.interviewCalloutLabel}>Interview Deep Dive</div>
              <div className={localStyles.interviewCalloutContent}>
                <strong>Q:</strong> How do you handle a behavioral question about a project that failed?<br />
                <strong>A:</strong> Use the STAR framework (Situation, Task, Action, Result) but add a <strong>Lessons Learned</strong> section. Staff-level interviewers want to see self-awareness and growth. Example: &quot;We chose microservices too early (Situation/Task). I advocated for service decomposition without considering our team&apos;s operational maturity (Action). Deployments became fragile, and we spent 60% of sprint time on infrastructure (Result). I led the migration back to a modular monolith, which cut deployment failures by 80% (Lesson: organization and maturity dictate architecture, not technical elegance).&quot;
              </div>
            </div>

            <div className={localStyles.proTip}>
              <span className={localStyles.proTipIcon}>*</span>
              <span className={localStyles.proTipContent}>
                <strong>Signal vs noise in system design:</strong> Interviewers care about your decision-making process, not your ability to name-drop technologies. Saying &quot;I&apos;d use Redis for caching because the read:write ratio is 100:1 and we need sub-millisecond reads for the hot path&quot; is 10x stronger than &quot;I&apos;d use Redis because it&apos;s fast.&quot; Always explain <em>why</em> you chose something, not just <em>what</em> you chose.
              </span>
            </div>

            <div className={localStyles.keyTakeaway}>
              <div className={localStyles.keyTakeawayLabel}>Key Takeaway</div>
              <div className={localStyles.keyTakeawayContent}>
                System design is about structured thinking under ambiguity. Follow the 5-step framework, lead with requirements not solutions, and always discuss trade-offs explicitly. The best candidates don&apos;t present a &quot;perfect&quot; design — they present a reasoned design with clearly articulated trade-offs and alternatives they considered.
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* ─── Appendix ─── */}
      <section id="appendix" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Appendix A: Recommended Stack (2026)
            </Heading>
            <Text className={styles.sectionDescription}>
              A production-ready stack for building high-performance, maintainable backend services in Kotlin. Each choice reflects the state of the art in 2026.
            </Text>
            <div className={localStyles.stackAppendix}>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Language</div>
                <div className={localStyles.stackItemValue}>Kotlin 2.2</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Framework</div>
                <div className={localStyles.stackItemValue}>Spring Boot 4.x</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Build</div>
                <div className={localStyles.stackItemValue}>Gradle (Kotlin DSL)</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Persistence</div>
                <div className={localStyles.stackItemValue}>Spring Data JPA + Exposed</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Concurrency</div>
                <div className={localStyles.stackItemValue}>Kotlin Coroutines</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Testing</div>
                <div className={localStyles.stackItemValue}>JUnit 5, MockK, Testcontainers</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Observability</div>
                <div className={localStyles.stackItemValue}>OpenTelemetry, Micrometer</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Messaging</div>
                <div className={localStyles.stackItemValue}>Apache Kafka</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Cache</div>
                <div className={localStyles.stackItemValue}>Redis / Valkey</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>API</div>
                <div className={localStyles.stackItemValue}>REST + gRPC (internal)</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>CI/CD</div>
                <div className={localStyles.stackItemValue}>GitHub Actions + ArgoCD</div>
              </div>
              <div className={localStyles.stackItem}>
                <div className={localStyles.stackItemLabel}>Container</div>
                <div className={localStyles.stackItemValue}>GraalVM Native + Docker</div>
              </div>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Footer nav */}
      <nav className={styles.navigation}>
        <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
          Back to Developer Hub
        </ButtonLink>
        <ButtonLink href={createLocalizedPath("/developer-section/react-interview")} variant="primary">
          React Interview Prep
        </ButtonLink>
      </nav>
      </div>
    </BlogContentLayout>
  );
}
