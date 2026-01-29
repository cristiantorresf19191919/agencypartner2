"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks ---
const diFieldInjection = [
  "@Service",
  "class UserService {",
  "    @Autowired // \"Magic\" injection",
  "    lateinit var repo: UserRepository // Mutable, nullable, hard to test",
  "}",
].join("\n");

const diConstructor = [
  "@Service",
  "class UserService(",
  "    private val repo: UserRepository // Immutable, non-null, pure Kotlin",
  ") {",
  "    // Spring sees the constructor and injects automatically.",
  "    // No @Autowired needed in modern Spring.",
  "}",
].join("\n");

const lifecycleDemo = [
  "@Component",
  "class LifecycleDemo : InitializingBean, DisposableBean {",
  "    ",
  "    init { println(\"1. Constructor Running\") }",
  "    ",
  "    @PostConstruct",
  "    fun postConstruct() { println(\"2. @PostConstruct\") }",
  "    ",
  "    override fun afterPropertiesSet() { println(\"3. InitializingBean interface\") }",
  "    ",
  "    @PreDestroy",
  "    fun preDestroy() { println(\"4. Context Closing / Bean Destroying\") }",
  "    ",
  "    override fun destroy() { println(\"5. DisposableBean interface\") }",
  "}",
].join("\n");

const configFullMode = [
  "@Configuration",
  "class DatabaseConfig {",
  "    ",
  "    @Bean",
  "    fun dataSource(): DataSource {",
  "        return HikariDataSource() // Creates a connection pool",
  "    }",
  "    ",
  "    @Bean",
  "    fun transactionManager(): PlatformTransactionManager {",
  "        // CALLING THE METHOD ABOVE!",
  "        // @Configuration: Spring intercepts → returns SAME dataSource.",
  "        // @Component: you would create TWO connection pools. Disaster.",
  "        return DataSourceTransactionManager(dataSource())",
  "    }",
  "}",
].join("\n");

const starterConfig = [
  "@Configuration",
  "@ConditionalOnClass(GreetingService::class)",
  "class GreetingAutoConfiguration {",
  "    ",
  "    @Bean",
  "    @ConditionalOnMissingBean",
  "    fun greetingService(): GreetingService {",
  "        return DefaultGreetingService()",
  "    }",
  "}",
].join("\n");

const challengeStarter = [
  "// Phase 1 Challenge: Build Your Own Starter",
  "// 1. GreetingAutoConfiguration + @ConditionalOnMissingBean",
  "// 2. META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports",
  "// 3. Scenario A: no bean → DefaultGreetingService. Scenario B: user @Bean → starter backs off.",
  "// ",
  "// Register: com.example.starter.GreetingAutoConfiguration",
].join("\n");

// --- Phase 2: Web Layer ---
const dtoPattern = [
  "// 1. Request DTO (what user sends)",
  "data class CreateUserRequest(",
  "    @field:NotBlank val username: String,",
  "    @field:Email val email: String",
  ") {",
  "    fun toDomain(): User = User(username = username, email = email)",
  "}",
  " ",
  "// 2. Response DTO (what user gets)",
  "data class UserResponse(val id: String, val username: String, val joinedAt: String)",
  " ",
  "// 3. Extension: Entity -> Response",
  "fun User.toResponse(): UserResponse = UserResponse(",
  "    id = id.toString(), username = username, joinedAt = createdAt.toString()",
  ")",
  " ",
  "// 4. Controller (clean)",
  "@PostMapping",
  "fun createUser(@Valid @RequestBody request: CreateUserRequest): UserResponse {",
  "    val created = userService.createUser(request.toDomain())",
  "    return created.toResponse()",
  "}",
].join("\n");

const globalExceptionHandler = [
  "@RestControllerAdvice",
  "class GlobalExceptionHandler {",
  " ",
  "    @ExceptionHandler(UserNotFoundException::class)",
  "    fun handleNotFound(ex: UserNotFoundException): ProblemDetail {",
  "        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.message ?: \"User not found\")",
  "    }",
  " ",
  "    @ExceptionHandler(MethodArgumentNotValidException::class)",
  "    fun handleValidation(ex: MethodArgumentNotValidException): ProblemDetail {",
  "        val problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST)",
  "        problem.title = \"Validation Failed\"",
  "        val errors = ex.bindingResult.fieldErrors.associate {",
  "            it.field to (it.defaultMessage ?: \"Invalid\")",
  "        }",
  "        problem.setProperty(\"errors\", errors)",
  "        return problem",
  "    }",
  "}",
].join("\n");

const strongPasswordValidator = [
  "@Target(AnnotationTarget.FIELD)",
  "@Constraint(validatedBy = [StrongPasswordValidator::class])",
  "annotation class StrongPassword(",
  "    val message: String = \"Password must be strong\",",
  "    val groups: Array<KClass<*>> = [],",
  "    val payload: Array<KClass<out Payload>> = []",
  ")",
  " ",
  "class StrongPasswordValidator : ConstraintValidator<StrongPassword, String> {",
  "    override fun isValid(value: String?, ctx: ConstraintValidatorContext): Boolean {",
  "        if (value == null) return false",
  "        return value.length > 8 && value.any { it.isDigit() }",
  "    }",
  "}",
].join("\n");

const phase2ChallengeStarter = [
  "// Phase 2 Challenge: The \"Perfect\" Product Catalog API",
  "// POST /products",
  "// 1. Validation: price > 0, sku exactly 8 alphanumeric chars",
  "// 2. Idempotency: X-Idempotency-Key header. Missing -> 400. Seen -> 409 or cached response",
  "// 3. Traceability: X-Correlation-ID on every response. Echo if sent, else UUID",
  "// 4. Errors: JSON map of field errors, no stack traces",
  "// Use Filter for Correlation ID; Filter or Interceptor for idempotency. DTOs only.",
].join("\n");

// --- Phase 3: Data, Hibernate & Transactions ---
const nPlusOneTrap = [
  "@Entity",
  "class User(",
  "    @OneToMany(fetch = FetchType.LAZY) val orders: List<Order>",
  ")",
  " ",
  "fun printUserOrders() {",
  "    val users = userRepository.findAll() // Query 1: SELECT * FROM users",
  "    users.forEach { user ->",
  "        // Query 2,3,4...N: SELECT * FROM orders WHERE user_id = ?",
  "        println(\"User has ${user.orders.size} orders\")",
  "    }",
  "}",
].join("\n");

const nPlusOneFix = [
  "interface UserRepository : JpaRepository<User, Long> {",
  "    @Query(\"SELECT u FROM User u LEFT JOIN FETCH u.orders\")",
  "    fun findAllWithOrders(): List<User>",
  " ",
  "    @EntityGraph(attributePaths = [\"orders\"])",
  "    override fun findAll(): List<User>",
  "}",
].join("\n");

const transactionalProxyTrap = [
  "@Service",
  "class OrderService {",
  "    fun processOrder() {",
  "        saveToDb() // Internal call — proxy bypassed! @Transactional IGNORED.",
  "    }",
  " ",
  "    @Transactional(propagation = Propagation.REQUIRES_NEW)",
  "    fun saveToDb() {",
  "        // This never runs in its own tx when called from processOrder().",
  "    }",
  "}",
].join("\n");

const optimisticLocking = [
  "@Entity",
  "class Product(",
  "    @Id val id: Long,",
  "    var name: String,",
  "    @Version val version: Long = 0",
  ")",
].join("\n");

const phase3ChallengeStarter = [
  "// Phase 3 Challenge: High-Load Optimizer",
  "// GET /dashboard: User + Last 5 Orders + Items in those orders.",
  "// Current: 151 queries (N+1 inside N+1). Target: 1 or 2 queries.",
  "// 1. Profile: show-sql, format_sql, or P6Spy.",
  "// 2. Fix: JOIN FETCH / @EntityGraph. Beware MultipleBagFetchException — Set vs List or 2 queries.",
  "// 3. Prove: QuickPerf or log count; assert queries <= 2.",
  "// Self-check: No EAGER. Use @EntityGraph. Handle LazyInitializationException.",
].join("\n");

// --- Phase 4: Security (OAuth2, JWT, Filter Chain) ---
const securityConfig = [
  "@Configuration",
  "@EnableWebSecurity",
  "@EnableMethodSecurity",
  "class SecurityConfig {",
  "    @Bean",
  "    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {",
  "        http",
  "            .csrf { it.disable() }",
  "            .cors { }",
  "            .authorizeHttpRequests { auth ->",
  "                auth.requestMatchers(\"/public/**\").permitAll()",
  "                    .requestMatchers(\"/actuator/health\").permitAll()",
  "                    .anyRequest().authenticated()",
  "            }",
  "            .oauth2ResourceServer { oauth2 -> oauth2.jwt { } }",
  "        return http.build()",
  "    }",
  "}",
].join("\n");

const jwtIssuerYaml = [
  "spring:",
  "  security:",
  "    oauth2:",
  "      resourceserver:",
  "        jwt:",
  "          issuer-uri: https://dev-xyz.us.auth0.com/",
].join("\n");

const preAuthorizeExamples = [
  "@GetMapping",
  "@PreAuthorize(\"hasAuthority('SCOPE_read:orders')\")",
  "fun getOrders(): List<Order> { ... }",
  " ",
  "@GetMapping(\"/{id}\")",
  "@PreAuthorize(\"hasRole('ADMIN') or #username == authentication.name\")",
  "fun getOrder(@PathVariable id: String, @RequestParam username: String): Order { ... }",
].join("\n");

const corsConfig = [
  "@Bean",
  "fun corsConfigurationSource(): CorsConfigurationSource {",
  "    val configuration = CorsConfiguration()",
  "    configuration.allowedOrigins = listOf(\"http://localhost:3000\")",
  "    configuration.allowedMethods = listOf(\"GET\", \"POST\", \"PUT\", \"DELETE\")",
  "    configuration.allowedHeaders = listOf(\"*\")",
  "    val source = UrlBasedCorsConfigurationSource()",
  "    source.registerCorsConfiguration(\"/**\", configuration)",
  "    return source",
  "}",
].join("\n");

const phase4ChallengeStarter = [
  "// Phase 4 Challenge: The Secure Vault",
  "// GET /vault/secrets -> \"Gold Bar\". Only ROLE_ADMIN. Alice (User) -> 403, Bob (Admin) -> 200.",
  "// 1. Auth0 or Keycloak; issuer-uri in application.yml.",
  "// 2. JwtAuthenticationConverter to map IdP roles to ROLE_...",
  "// 3. No login page in Spring; login on IdP. Alice: 403 (forbidden), not 401.",
].join("\n");

// --- Phase 5: Async & Integration ---
const coroutinesControllerService = [
  "@GetMapping(\"/{id}\")",
  "suspend fun getUser(@PathVariable id: String): UserResponse = userService.getUser(id)",
  " ",
  "@Service",
  "class UserService(private val repo: UserRepository) {",
  "    suspend fun getUser(id: String): UserResponse {",
  "        val user = repo.findById(id) ?: throw UserNotFoundException()",
  "        val score = externalCreditClient.getScore(id)",
  "        return user.toResponse(score)",
  "    }",
  "}",
  "interface UserRepository : CoroutineCrudRepository<User, String>",
].join("\n");

const sequentialVsAsync = [
  "// ❌ Sequential: 2s total",
  "val user = repo.getUser(id); val orders = orderClient.getOrders(id)",
  " ",
  "// ✅ Parallel: coroutineScope + async",
  "suspend fun getUserDashboard(id: String): Dashboard = coroutineScope {",
  "    val userDeferred = async { repo.getUser(id) }",
  "    val ordersDeferred = async { orderClient.getOrders(id) }",
  "    Dashboard(user = userDeferred.await(), orders = ordersDeferred.await())",
  "}",
].join("\n");

const webClientConfig = [
  "@Bean",
  "fun remoteClient(builder: WebClient.Builder): WebClient {",
  "    val httpClient = HttpClient.create()",
  "        .responseTimeout(Duration.ofSeconds(5))",
  "        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 2000)",
  "    return builder.baseUrl(\"https://api.external.com\")",
  "        .clientConnector(ReactorClientHttpConnector(httpClient))",
  "        .build()",
  "}",
  " ",
  "suspend fun fetchData(): String = webClient.get().uri(\"/data\").retrieve().awaitBody()",
].join("\n");

const phase5ChallengeStarter = [
  "// Phase 5 Challenge: The Reliable Notifier",
  "// POST /users -> save user, send message to Rabbit/Kafka.",
  "// Consumer: listen, 'send email' (delay(1000) + print). Randomly throw -> retry 3x -> DLQ.",
  "// Self-check: Retries? Outbox or transactional sim? Main app stays up if mail down (message in DLQ).",
].join("\n");

// --- Phase 6: Observability & Production Readiness ---
const actuatorYaml = [
  "management:",
  "  endpoints:",
  "    web:",
  "      exposure:",
  "        include: \"health,info,metrics,prometheus\"",
  "  endpoint:",
  "    health:",
  "      probes:",
  "        enabled: true",
  "      show-details: always",
].join("\n");

const correlationIdFilter = [
  "@Component",
  "class CorrelationIdFilter : Filter {",
  "    override fun doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain) {",
  "        val id = (req as HttpServletRequest).getHeader(\"X-Correlation-ID\")",
  "            ?: UUID.randomUUID().toString()",
  "        MDC.put(\"correlationId\", id)",
  "        try {",
  "            (res as HttpServletResponse).setHeader(\"X-Correlation-ID\", id)",
  "            chain.doFilter(req, res)",
  "        } finally {",
  "            MDC.clear()",
  "        }",
  "    }",
  "}",
].join("\n");

const micrometerMetrics = [
  "@Service",
  "class PaymentService(private val meterRegistry: MeterRegistry) {",
  "    fun processPayment(amount: Double) {",
  "        try {",
  "            meterRegistry.counter(\"payments.total\", \"status\", \"success\").increment()",
  "        } catch (e: Exception) {",
  "            meterRegistry.counter(\"payments.total\", \"status\", \"failure\").increment()",
  "            throw e",
  "        }",
  "    }",
  "    @Timed(value = \"payments.latency\", description = \"Time to process payment\")",
  "    fun slowExternalCall() { Thread.sleep(1000) }",
  "}",
].join("\n");

const phase6ChallengeStarter = [
  "// Phase 6 Challenge: The Glass Box",
  "// 1. Actuator: /actuator/health -> {\"status\":\"UP\"}",
  "// 2. MDC Filter: X-Correlation-ID in logs and response headers",
  "// 3. POST /config/feature-toggle -> increment config.updates; verify at /actuator/metrics/config.updates",
  "// Self-check: MDC.clear() in finally? Use Micrometer, not hardcoded backend.",
].join("\n");

// --- Phase 7: Architecture & Engineering Judgment ---
const packagingVertical = [
  "/controllers",
  "  - UserController",
  "  - OrderController",
  "/services",
  "  - UserService",
  "  - OrderService",
  "/repositories",
].join("\n");

const packagingHorizontal = [
  "/features",
  "  /users",
  "    - UserController.kt",
  "    - UserService.kt",
  "    - UserRepository.kt (internal)",
  "    - User.kt",
  "  /orders",
  "    - OrderController.kt",
  "    - OrderService.kt",
  "    ...",
].join("\n");

const anemicOrder = [
  "data class Order(var status: String, var total: Double)",
  " ",
  "fun confirmOrder(order: Order) {",
  "    if (order.total <= 0) throw Error()",
  "    order.status = \"CONFIRMED\"",
  "    repo.save(order)",
  "}",
].join("\n");

const richOrder = [
  "@Entity",
  "class Order {",
  "    var status: String = \"DRAFT\"",
  "        private set",
  "    fun confirm() {",
  "        if (total <= 0) throw IllegalStateException(\"Cannot confirm free order\")",
  "        if (status != \"DRAFT\") throw IllegalStateException(\"Already confirmed\")",
  "        status = \"CONFIRMED\"",
  "    }",
  "}",
  " ",
  "fun confirmOrder(id: String) {",
  "    val order = repo.findById(id)",
  "    order.confirm()",
  "    repo.save(order)",
  "}",
].join("\n");

const phase7ChallengeStarter = [
  "// Phase 7 Challenge: The Refactor (Capstone)",
  "// God class ShopService: 3k lines, Users+Inventory+Payments+Notifications, all public.",
  "// 1. Identify boundaries (Inventory vs Payment). 2. com.app.inventory, com.app.payment.",
  "// 3. Move code; internal repos. 4. Public InventoryService interface; ShopService orchestrates.",
  "// 5. Bonus: move 'if (stock < 0) throw...' into Product entity.",
].join("\n");

export default function KotlinSpringCorePage() {
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
          <li className={styles.breadcrumbCurrent}>Spring Core with Kotlin</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Spring Core with Kotlin: Gold Standard (Phase 1–7)
        </Heading>
        <Text className={styles.subtitle}>
          The <strong>Gold Standard</strong> curriculum for a Senior Spring Engineer. <strong>Phase 1</strong> foundation; <strong>Phase 2</strong> web (MVC); <strong>Phase 3</strong> data (N+1, propagation, optimistic locking); <strong>Phase 4</strong> security (OAuth2, JWT, CORS); <strong>Phase 5</strong> async (Coroutines, WebClient, Kafka/Rabbit, Outbox); <strong>Phase 6</strong> observability (Actuator, MDC, Micrometer, tracing); <strong>Phase 7</strong> architecture—Modular Monolith, packaging by feature, DDD lite, testing pyramid. Architecture is managing complexity and drawing boundaries; know when <em>not</em> to add a library.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
            alt="Backend and Spring architecture"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Phase 1:</strong> DI, Lifecycle, @Configuration vs @Component, Scopes, BeanPostProcessors, Starter. <strong>Phase 2:</strong> Controller, DTOs, <code>@ControllerAdvice</code>, Filters vs Interceptors, validation, Perfect API. <strong>Phase 3:</strong> N+1, JOIN FETCH / @EntityGraph, propagation &amp; proxy, <code>@Version</code>, High-Load Optimizer. <strong>Phase 4:</strong> OAuth2/OIDC, JWT, filter chain, <code>@PreAuthorize</code>, CORS, Secure Vault. <strong>Phase 5:</strong> Coroutines, WebClient, Kafka/Rabbit, DLQ, Outbox, Reliable Notifier. <strong>Phase 6:</strong> Actuator, MDC, Micrometer, tracing, Glass Box. <strong>Phase 7:</strong> Modular Monolith, packaging by feature, DDD lite (rich vs anemic), testing pyramid, Refactor capstone. Course complete.
          </Text>
        </div>
      </div>

      {/* Topic 1.1: DI */}
      <section id="topic-1-1-di" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 1.1: Dependency Injection (The &quot;Constructor Only&quot; Rule)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>The rule:</strong> never use field injection (<code>@Autowired lateinit var</code>). <strong>Why:</strong> (1) <strong>Immutability</strong> — field injection requires <code>var</code>; constructor injection allows <code>val</code>. (2) <strong>Null safety</strong> — you guarantee the bean exists at creation time. (3) <strong>Testing</strong> — no <code>ReflectionTestUtils</code> or Spring context; you just <code>new</code> it up.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              ❌ Junior / Mid (Field Injection)
            </Heading>
            <CodeEditor code={diFieldInjection} language="kotlin" readOnly height={160} />
            <Heading level={3} className={styles.categoryTitle}>
              ✅ Senior (Constructor Injection)
            </Heading>
            <CodeEditor code={diConstructor} language="kotlin" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Topic 1.2: Lifecycle */}
      <section id="topic-1-2-lifecycle" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 1.2: The Bean Lifecycle (The Pulse of Spring)
            </Heading>
            <Text className={styles.sectionDescription}>
              To debug complex issues, you must know the <strong>order of events</strong>:
            </Text>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Instantiation</strong> — Spring calls the constructor.</li>
              <li><strong>Populate properties</strong> — Setters/fields are filled.</li>
              <li><strong>BeanPostProcessor (before)</strong> — Modify the raw bean instance.</li>
              <li><strong>Initialization</strong> — <code>@PostConstruct</code>, <code>InitializingBean.afterPropertiesSet()</code>.</li>
              <li><strong>BeanPostProcessor (after)</strong> — <strong>Critical:</strong> proxies (AOP, <code>@Transactional</code>) are created here.</li>
              <li><strong>Ready</strong> — Bean is in the context.</li>
              <li><strong>Destruction</strong> — <code>@PreDestroy</code>.</li>
            </ol>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Lifecycle and flow"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
              />
            </div>
            <CodeEditor code={lifecycleDemo} language="kotlin" readOnly height={360} />
          </Stack>
        </Card>
      </section>

      {/* Topic 1.3: Proxy trap */}
      <section id="topic-1-3-proxy" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 1.3: The Proxy Trap (@Configuration vs @Component)
            </Heading>
            <Text className={styles.sectionDescription}>
              Classic &quot;Senior Signal&quot; interview question: <strong>Why put <code>@Bean</code> methods inside <code>@Configuration</code> and not just <code>@Component</code>?</strong> Answer: <strong>inter-bean dependencies.</strong>
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>@Component</strong> (Lite Mode): If you call a <code>@Bean</code> method from another <code>@Bean</code> method, you get a <strong>new instance</strong>. Spring treats it as a normal function call. <strong>@Configuration</strong> (Full Mode): Spring uses <strong>CGLIB</strong> to subclass your config. It overrides those methods to check the container first—&quot;Do I already have this bean? Yes? Return the cached one.&quot;
            </Text>
            <CodeEditor code={configFullMode} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* Topic 1.4: Scopes */}
      <section id="topic-1-4-scopes" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 1.4: Scopes (The Prototype Trap)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Singleton</strong> (default): one instance per application. Stateless; thread-safe logic required. <strong>Prototype:</strong> new instance every time it is injected.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>The trap:</strong> If you inject a <code>Prototype</code> bean into a <code>Singleton</code>, the prototype <strong>behaves like a singleton</strong>. The singleton is created once and calls the prototype&apos;s constructor once during injection; that instance lives inside the singleton forever. <strong>Fix:</strong> use <code>ObjectProvider&lt;MyPrototype&gt;</code> or <code>@Lookup</code> method injection when you need a fresh instance each time.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 1.5: BPP */}
      <section id="topic-1-5-bpp" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 1.5: Deep Skill — BeanPostProcessors (BPP)
            </Heading>
            <Text className={styles.sectionDescription}>
              This is how Spring implements <code>@Value</code>, <code>@Autowired</code>, and <code>@Transactional</code>. A <strong>BeanPostProcessor</strong> lets you modify beans <em>before</em> they enter the container. Use it for infrastructure: e.g. decrypting passwords in properties, wrapping beans in monitoring or logging proxies.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Phase 1 Challenge */}
      <section id="phase-1-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 1 Challenge: Build Your Own &quot;Starter&quot;
            </Heading>
            <Text className={styles.sectionDescription}>
              Create a library that, when added to a project, auto-configures a <code>GreetingService</code> bean—<strong>only if</strong> the user hasn&apos;t defined one.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Steps
            </Heading>
            <Text className={styles.sectionDescription}>
              (1) <strong>Configuration class:</strong> <code>@ConditionalOnClass(GreetingService::class)</code>, <code>@Bean</code> <code>@ConditionalOnMissingBean</code> returning <code>DefaultGreetingService</code>. (2) <strong>Register</strong> (Spring Boot 3): create <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> and add the full class name, e.g. <code>com.example.starter.GreetingAutoConfiguration</code>. (3) <strong>Test:</strong> Scenario A — no bean defined, inject <code>GreetingService</code>, expect &quot;Default Hello&quot;. Scenario B — define your own <code>@Bean</code> <code>greetingService()</code>; the starter should back off.
            </Text>
            <CodeEditor code={starterConfig} language="kotlin" readOnly height={240} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Validation:</strong> If you can explain exactly <em>why</em> your starter backed off in Scenario B, you&apos;ve mastered Spring Core configuration precedence.
              </Text>
            </div>
            <CodeEditor code={challengeStarter} language="kotlin" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Phase 2 intro */}
      <section id="phase-2-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 2: Web Layer (MVC) — Done Correctly
            </Heading>
            <Text className={styles.sectionDescription}>
              The layer where most developers spend their time—but often do it wrong. <strong>Senior mindset:</strong> the Controller is a <strong>Gateway</strong>, not a worker. It should have zero business logic. Its job is <strong>Deserialise → Validate → Delegate → Respond</strong>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 2.1: DTOs */}
      <section id="topic-2-1-dtos" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 2.1: Controller Design &amp; DTOs (The &quot;No Entities&quot; Rule)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>The rule:</strong> Never return your JPA <code>@Entity</code> (database object) to the frontend. <strong>Why:</strong> (1) <strong>Security</strong> — you risk leaking <code>password_hash</code> or <code>version</code>. (2) <strong>Coupling</strong> — DB schema changes break API clients. (3) <strong>Cyclic references</strong> — bidirectional relations (e.g. User ↔ Orders) can cause <code>StackOverflowError</code> when serialising to JSON.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Senior pattern:</strong> Keep DTOs dumb. Use Kotlin extension functions for mapping. Request DTO → <code>toDomain()</code>; Entity → <code>toResponse()</code>. Controller stays thin.
            </Text>
            <CodeEditor code={dtoPattern} language="kotlin" readOnly height={420} />
          </Stack>
        </Card>
      </section>

      {/* Topic 2.2: GlobalExceptionHandler */}
      <section id="topic-2-2-global-error" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 2.2: Global Error Handling (Stop try-catch)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>The rule:</strong> Controllers should almost never have <code>try-catch</code>. Let exceptions bubble up. <strong>Solution:</strong> <code>@ControllerAdvice</code> (or <code>@RestControllerAdvice</code>). Return a standard format—e.g. <strong>RFC 7807 (Problem Details)</strong>, which Spring Boot 3 supports natively.
            </Text>
            <Text className={styles.sectionDescription}>
              Handle specific exceptions (e.g. <code>UserNotFoundException</code> → 404) and <code>MethodArgumentNotValidException</code> for validation errors. Extract <strong>field paths</strong> from <code>bindingResult.fieldErrors</code> and attach them to the problem detail so clients get a map like <code>email → &quot;must be a valid email&quot;</code>.
            </Text>
            <CodeEditor code={globalExceptionHandler} language="kotlin" readOnly height={380} />
          </Stack>
        </Card>
      </section>

      {/* Topic 2.3: Filters vs Interceptors */}
      <section id="topic-2-3-filters-interceptors" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 2.3: Filters vs Interceptors
            </Heading>
            <Text className={styles.sectionDescription}>
              Common interview question: <strong>When do you use a Filter versus an Interceptor?</strong>
            </Text>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>Filters (Servlet layer):</strong> Run <em>before</em> Spring MVC. They only see raw <code>HttpServletRequest</code>. Use for: CORS, auth headers, logging raw bytes, compression (GZIP). <strong>Blind spot:</strong> they don&apos;t know which controller method will handle the request.</li>
              <li><strong>Interceptors (Spring MVC layer):</strong> Run inside <code>DispatcherServlet</code>. They have access to the <strong>Handler</strong> (the specific controller method). Use for: permission checks per endpoint, adding model attributes, measuring execution time.</li>
            </ul>
            <Text className={styles.sectionDescription}>
              <strong>Quick rule:</strong> Manipulate the <strong>stream</strong> (body/headers) → use a <strong>Filter</strong>. Need application context (beans, handler method) → use an <strong>Interceptor</strong>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 2.4: Validation */}
      <section id="topic-2-4-validation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 2.4: Validation (Bean Validation)
            </Heading>
            <Text className={styles.sectionDescription}>
              Don&apos;t write <code>if (request.email == null)</code>. Use <strong>Jakarta Validation</strong> (<code>@NotBlank</code>, <code>@Email</code>, etc.). <strong>Senior tip:</strong> use <strong>group sequences</strong> when you need ordered checks (e.g. &quot;Not null&quot; first, then &quot;database uniqueness&quot;).
            </Text>
            <Text className={styles.sectionDescription}>
              Don&apos;t limit yourself to built-in annotations. Define <strong>custom validators</strong> for domain rules (e.g. <code>@StrongPassword</code>) with <code>@Constraint</code> and a <code>ConstraintValidator</code> implementation.
            </Text>
            <CodeEditor code={strongPasswordValidator} language="kotlin" readOnly height={300} />
          </Stack>
        </Card>
      </section>

      {/* Phase 2 Challenge */}
      <section id="phase-2-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 2 Challenge: The &quot;Perfect&quot; API
            </Heading>
            <Text className={styles.sectionDescription}>
              Design a <strong>Product Catalog API</strong> with one endpoint: <code>POST /products</code>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Requirements
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Validation:</strong> <code>price</code> &gt; 0. <code>sku</code> exactly 8 alphanumeric characters.</li>
              <li><strong>Idempotency:</strong> Client sends <code>X-Idempotency-Key</code>. If missing → <code>400 Bad Request</code>. If seen before → <code>409 Conflict</code> or return the cached response. Use a Filter or Interceptor to check.</li>
              <li><strong>Traceability:</strong> Every response has <code>X-Correlation-ID</code>. Echo if the client sent one; otherwise generate a UUID. <em>Hint: use a Filter.</em></li>
              <li><strong>Error handling:</strong> Validation failures → JSON map of field errors, never a stack trace.</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Self-check:</strong> Did you put logic in the controller? (Fail.) Use a Filter for Correlation ID? (Correct—it applies to every request.) Return a <code>Product</code> entity? (Fail. Use <code>ProductResponse</code>.)
              </Text>
            </div>
            <CodeEditor code={phase2ChallengeStarter} language="kotlin" readOnly height={200} />
          </Stack>
        </Card>
      </section>

      {/* Phase 3 intro */}
      <section id="phase-3-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 3: Data, Hibernate &amp; Transactions
            </Heading>
            <Text className={styles.sectionDescription}>
              The phase that separates &quot;Spring Boot developers&quot; from <strong>Senior Engineers</strong>. In MVC, mistakes usually mean a bug. In the data layer, mistakes mean <strong>production outages</strong>, <strong>deadlocks</strong>, and <strong>data corruption</strong>. <strong>Senior mindset:</strong> Hibernate is a leaky abstraction—if you don&apos;t know the SQL it generates, you are writing bugs.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 3.1: N+1 */}
      <section id="topic-3-1-n-plus-one" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 3.1: The N+1 Problem (The Performance Killer)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>The problem:</strong> You fetch 10 users, then loop and access each user&apos;s <code>orders</code>. Hibernate runs <strong>1 query</strong> for users, then <strong>N extra queries</strong> (one per user) for orders. Total: <strong>N+1</strong>. With N=1000, your database dies.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              ❌ Junior code (the trap)
            </Heading>
            <CodeEditor code={nPlusOneTrap} language="kotlin" readOnly height={280} />
            <Heading level={3} className={styles.categoryTitle}>
              ✅ Senior solution (JOIN FETCH / @EntityGraph)
            </Heading>
            <Text className={styles.sectionDescription}>
              Tell Hibernate to fetch everything in <strong>one</strong> query: <code>@Query(&quot;SELECT u FROM User u LEFT JOIN FETCH u.orders&quot;)</code> or <code>@EntityGraph(attributePaths = [&quot;orders&quot;])</code> on <code>findAll()</code>.
            </Text>
            <CodeEditor code={nPlusOneFix} language="kotlin" readOnly height={200} />
          </Stack>
        </Card>
      </section>

      {/* Topic 3.2: Transaction propagation / proxy */}
      <section id="topic-3-2-transaction-proxy" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 3.2: Transaction Propagation (The &quot;Proxy&quot; Gotcha)
            </Heading>
            <Text className={styles.sectionDescription}>
              <code>@Transactional</code> wraps a method in a DB transaction. Spring uses <strong>proxies</strong>. If you call method B from method A <em>inside the same class</em>, the <code>@Transactional</code> on B is <strong>ignored</strong>—you&apos;re calling <code>this.methodB()</code>, bypassing the proxy that starts the transaction.
            </Text>
            <CodeEditor code={transactionalProxyTrap} language="kotlin" readOnly height={240} />
            <Text className={styles.sectionDescription}>
              <strong>Fix:</strong> Move <code>saveToDb</code> to a separate service (so the call goes through the proxy) or use self-injection / lazy injection of the same bean.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 3.3: Propagation types */}
      <section id="topic-3-3-propagation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 3.3: Propagation Types (Know Your Boundaries)
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>REQUIRED (default):</strong> Join an existing transaction or start a new one. If an inner method throws, the <em>entire</em> transaction is marked for rollback; you can&apos;t catch in the outer method and proceed.</li>
              <li><strong>REQUIRES_NEW:</strong> Suspend the current transaction, start a fresh one, commit/rollback it independently, then resume the original. Use for e.g. saving an <strong>audit log</strong> even when the main business logic fails.</li>
            </ul>
          </Stack>
        </Card>
      </section>

      {/* Topic 3.4: Optimistic locking */}
      <section id="topic-3-4-optimistic-locking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 3.4: Optimistic Locking (Preventing Lost Updates)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Scenario:</strong> Two admins edit the same user. A sets name to &quot;Alice&quot;, B to &quot;Bob&quot;. A saves, then B saves—B overwrites A silently. <strong>Solution:</strong> <code>@Version</code>. Hibernate auto-increments the version on update. If B saves with an outdated version, the DB version is higher → <code>OptimisticLockingFailureException</code>.
            </Text>
            <CodeEditor code={optimisticLocking} language="kotlin" readOnly height={160} />
          </Stack>
        </Card>
      </section>

      {/* Phase 3 Challenge */}
      <section id="phase-3-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 3 Challenge: The High-Load Optimizer
            </Heading>
            <Text className={styles.sectionDescription}>
              Endpoint <code>GET /dashboard</code> loads a <strong>User</strong>, their <strong>last 5 orders</strong>, and the <strong>items</strong> in those orders. Currently it runs <strong>151 queries</strong> for a user with 50 orders (N+1 nested inside N+1).
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Your mission
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Profile:</strong> Enable SQL logging (<code>spring.jpa.show-sql=true</code>, <code>format_sql=true</code>) or use P6Spy.</li>
              <li><strong>Fix:</strong> Refactor the repository so User + Orders + Items load in <strong>1 or 2 queries</strong>. Watch for <code>MultipleBagFetchException</code> (cartesian product) when fetching multiple collections—use <code>Set</code> instead of <code>List</code> or two separate queries.</li>
              <li><strong>Prove:</strong> Add a test (e.g. QuickPerf or log counting) that asserts query count ≤ 2.</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Self-check:</strong> Did you switch to <code>FetchType.EAGER</code>? (Fail—never use EAGER.) Use <code>@EntityGraph</code>? (Pass.) Handle <code>LazyInitializationException</code>? (Pass.)
              </Text>
            </div>
            <CodeEditor code={phase3ChallengeStarter} language="kotlin" readOnly height={200} />
          </Stack>
        </Card>
      </section>

      {/* Phase 4 intro */}
      <section id="phase-4-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 4: Security (OAuth2, JWT &amp; The Filter Chain)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Senior mindset:</strong> Don&apos;t write your own login page. Don&apos;t hash passwords yourself if you can avoid it. Use standard protocols (OIDC/OAuth2). Your job is to <strong>secure the resource</strong>, not manage identity.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 4.1: OAuth2 vs OIDC */}
      <section id="topic-4-1-oauth2-oidc" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 4.1: OAuth2 vs OIDC (Know the Difference)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>OAuth2 (Authorization):</strong> &quot;I have a key to your house.&quot; It handles <em>access</em> (e.g. &quot;Allow this app to read my Google Drive&quot;). <strong>OIDC (OpenID Connect — Authentication):</strong> &quot;I know <em>who</em> you are.&quot; It adds an identity layer on top of OAuth2 (e.g. &quot;Sign in with Google&quot;).
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Flow (simplified):</strong> (1) User clicks Login → (2) Redirect to <strong>IdP</strong> (Auth0, Keycloak, Google). (3) User logs in <em>there</em>, not on your server. (4) IdP returns a <strong>code</strong> to your frontend. (5) Frontend exchanges code for a <strong>JWT</strong>. (6) Frontend sends <code>Authorization: Bearer &lt;token&gt;</code> to your Spring Boot API.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 4.2: Filter chain */}
      <section id="topic-4-2-filter-chain" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 4.2: The Spring Security Filter Chain
            </Heading>
            <Text className={styles.sectionDescription}>
              Spring Security is a chain of Servlet Filters. If a request reaches your controller, it has already passed the chain.
            </Text>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>SecurityContextPersistenceFilter:</strong> Restores user session (often disabled for stateless APIs).</li>
              <li><strong>CorsFilter:</strong> Decides if e.g. <code>localhost:3000</code> can call <code>localhost:8080</code>.</li>
              <li><strong>BearerTokenAuthenticationFilter:</strong> Validates JWT, extracts roles.</li>
              <li><strong>FilterSecurityInterceptor:</strong> Final gatekeeper; checks e.g. &quot;Does this user have <code>ROLE_ADMIN</code> for <code>/admin/**</code>?&quot;</li>
            </ul>
            <Text className={styles.sectionDescription}>
              <strong>Debug tip:</strong> Enable <code>logging.level.org.springframework.security=DEBUG</code> to see exactly which filter rejected a request (e.g. 403 Forbidden).
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 4.3: Resource server */}
      <section id="topic-4-3-resource-server" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 4.3: Implementing a Resource Server (The Code)
            </Heading>
            <Text className={styles.sectionDescription}>
              You build the API; you trust the IdP (e.g. Auth0). You only validate the token. Add <code>spring-boot-starter-oauth2-resource-server</code>. Use <code>@EnableWebSecurity</code> and <code>@EnableMethodSecurity</code> for <code>@PreAuthorize</code>.
            </Text>
            <CodeEditor code={securityConfig} language="kotlin" readOnly height={400} />
            <Text className={styles.sectionDescription}>
              In <code>application.yml</code>, set <code>spring.security.oauth2.resourceserver.jwt.issuer-uri</code> to your IdP URL. Spring Boot fetches public keys and validates JWT signatures automatically.
            </Text>
            <CodeEditor code={jwtIssuerYaml} language="yaml" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Topic 4.4: @PreAuthorize */}
      <section id="topic-4-4-preauthorize" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 4.4: Method Security (@PreAuthorize)
            </Heading>
            <Text className={styles.sectionDescription}>
              Keep authorization close to the code. <strong>Scope</strong> = what the <em>client</em> (app) can do (e.g. <code>SCOPE_read:orders</code>). <strong>Role</strong> = what the <em>user</em> is (e.g. <code>ROLE_ADMIN</code>). Use <code>hasAuthority</code> for scopes, <code>hasRole</code> for roles; SpEL supports <code>#paramName</code> and <code>authentication.name</code>.
            </Text>
            <CodeEditor code={preAuthorizeExamples} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* Topic 4.5: CORS */}
      <section id="topic-4-5-cors" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 4.5: CORS (Cross-Origin Resource Sharing)
            </Heading>
            <Text className={styles.sectionDescription}>
              Common cause of &quot;It works in Postman but fails in Chrome.&quot; Browsers block cross-origin requests (e.g. React on <code>localhost:3000</code> → Spring on <code>localhost:8080</code>) unless you allow them. Define a <code>CorsConfigurationSource</code> bean: <code>allowedOrigins</code>, <code>allowedMethods</code>, <code>allowedHeaders</code>, and <code>registerCorsConfiguration(&quot;/**&quot;, ...)</code>.
            </Text>
            <CodeEditor code={corsConfig} language="kotlin" readOnly height={240} />
          </Stack>
        </Card>
      </section>

      {/* Phase 4 Challenge */}
      <section id="phase-4-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 4 Challenge: The Secure Vault
            </Heading>
            <Text className={styles.sectionDescription}>
              Build <code>GET /vault/secrets</code> that returns &quot;Gold Bar&quot;. Only users with <code>ROLE_ADMIN</code> may access it.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Requirements
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Setup:</strong> Auth0 (free) or Keycloak via Docker. Point Spring Boot to the issuer URI.</li>
              <li><strong>Roles:</strong> Create Alice (User) and Bob (Admin). <code>/vault/secrets</code> → &quot;Gold Bar&quot;. Alice → <code>403 Forbidden</code>. Bob → <code>200 OK</code>.</li>
              <li><strong>Custom converter:</strong> Implement <code>JwtAuthenticationConverter</code> to map IdP roles (e.g. Auth0) into Spring <code>ROLE_...</code> format.</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Self-check:</strong> Did you implement a login page in Spring? (Fail—login happens on the IdP.) Does Alice get 401 or 403? She should get <strong>403</strong> (forbidden): &quot;I know you, but you&apos;re not allowed.&quot; 401 = &quot;Who are you?&quot;
              </Text>
            </div>
            <CodeEditor code={phase4ChallengeStarter} language="kotlin" readOnly height={160} />
          </Stack>
        </Card>
      </section>

      {/* Phase 5 intro */}
      <section id="phase-5-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 5: Async &amp; Integration (Coroutines, Messaging &amp; The Outbox)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Senior mindset:</strong> &quot;Fire and forget&quot; is a lie. Unsupervised background tasks crash silently. Sending to Kafka without an Outbox loses data. Use structured concurrency and the Transactional Outbox for consistency.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 5.1: Coroutines in Spring */}
      <section id="topic-5-1-coroutines" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 5.1: Coroutines in Spring Boot (The Native Way)
            </Heading>
            <Text className={styles.sectionDescription}>
              Since Spring Boot 3.0, Coroutines are first-class. No <code>CompletableFuture</code> wrappers. Controllers and services use <code>suspend</code>; the thread is released while waiting. Use <code>CoroutineCrudRepository</code> (or R2DBC) for reactive data access.
            </Text>
            <CodeEditor code={coroutinesControllerService} language="kotlin" readOnly height={340} />
            <Text className={styles.sectionDescription}>
              <strong>⚠️ Trap:</strong> Never use <code>GlobalScope.launch</code>. If the request ends or errors, the global coroutine keeps running (zombie). Use a <code>CoroutineScope</code> tied to a lifecycle or plain <code>suspend</code> functions that Spring manages.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 5.2: Structured concurrency */}
      <section id="topic-5-2-structured-concurrency" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 5.2: Structured Concurrency (Parallel Execution)
            </Heading>
            <Text className={styles.sectionDescription}>
              Fetch User and Orders in parallel instead of sequentially. Wrap parallel work in <code>coroutineScope</code> so that if one task fails, the other is cancelled (cleanup). Use <code>async</code> for both, then <code>await()</code>—total time ≈ slowest task, not the sum.
            </Text>
            <CodeEditor code={sequentialVsAsync} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </section>

      {/* Topic 5.3: WebClient */}
      <section id="topic-5-3-webclient" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 5.3: Resilient HTTP Clients (WebClient)
            </Heading>
            <Text className={styles.sectionDescription}>
              Don&apos;t use <code>RestTemplate</code> (blocking, maintenance mode). Use <code>WebClient</code> with Coroutine extensions. <strong>Senior tip:</strong> Always set timeouts (response, connect); defaults can be effectively infinite and hang your pool.
            </Text>
            <CodeEditor code={webClientConfig} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </section>

      {/* Topic 5.4: Messaging */}
      <section id="topic-5-4-messaging" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 5.4: Messaging Patterns (Kafka / RabbitMQ)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Consumer groups:</strong> Multiple instances (scale 3) should not all process the same &quot;Order Created&quot; event. Put them in the same consumer group; the broker ensures only one instance gets each message.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Dead Letter Queue (DLQ):</strong> If processing crashes, retry (e.g. 3x). After exhausting retries, move the message to a DLQ (<code>orders-dlq</code>). Avoids blocking the main queue with a poison pill while preserving the message for later inspection.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 5.5: Outbox */}
      <section id="topic-5-5-outbox" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 5.5: The Outbox Pattern (Critical Consistency)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Dual-write problem:</strong> Save Order to DB and publish &quot;Order Created&quot; to Kafka. If DB commits but Kafka fails → downstream never sees the order. If Kafka sends but DB fails → ghost order. Neither is acceptable.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Transactional Outbox:</strong> (1) Start transaction. (2) Insert <code>Order</code> into <code>orders_table</code>. (3) Insert event payload into <code>outbox_table</code> in the <em>same</em> transaction. (4) Commit—both or neither. (5) A separate relay (e.g. Debezium, Kafka Connect) reads <code>outbox_table</code> and publishes to Kafka. Atomicity guaranteed.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Phase 5 Challenge */}
      <section id="phase-5-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 5 Challenge: The Reliable Notifier
            </Heading>
            <Text className={styles.sectionDescription}>
              Build a system that sends a &quot;Welcome Email&quot; when a user signs up.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Requirements
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>User service:</strong> <code>POST /users</code> — save user (Mongo/Postgres), then publish to RabbitMQ or Kafka.</li>
              <li><strong>Notification service (consumer):</strong> Listen to the queue; &quot;send email&quot; (e.g. <code>delay(1000)</code> + print).</li>
              <li><strong>Resilience:</strong> Make &quot;send email&quot; throw randomly (simulate mail server down). Configure retry 3×; after 3 failures, route to a DLQ.</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Self-check:</strong> Retries? Outbox (or at least transactional simulation)? If the mail server is down forever, does the main app crash? It shouldn&apos;t—the message should sit in the DLQ.
              </Text>
            </div>
            <CodeEditor code={phase5ChallengeStarter} language="kotlin" readOnly height={140} />
          </Stack>
        </Card>
      </section>

      {/* Phase 6 intro */}
      <section id="phase-6-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 6: Observability &amp; Production Readiness
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Senior mindset:</strong> Code that runs without eyes on it is a ticking time bomb. You don&apos;t debug production with a debugger—you debug by reading the telemetry your code emits.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 6.1: Actuator */}
      <section id="topic-6-1-actuator" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 6.1: Spring Boot Actuator (The Cockpit)
            </Heading>
            <Text className={styles.sectionDescription}>
              Actuator adds production endpoints. Not just &quot;UP&quot;—it powers Kubernetes orchestration. <strong>Liveness</strong> (<code>/actuator/health/liveness</code>): is the process running? If no → K8s restarts the container. <strong>Readiness</strong> (<code>/actuator/health/readiness</code>): can the app accept traffic? (DB up, cache warm.) If no → K8s stops routing traffic but keeps the container alive.
            </Text>
            <Text className={styles.sectionDescription}>
              Don&apos;t expose everything. Use <code>management.endpoints.web.exposure.include</code> (e.g. <code>health,info,metrics,prometheus</code>), <code>management.endpoint.health.probes.enabled: true</code>, and <code>show-details</code> only where appropriate (secure in prod).
            </Text>
            <CodeEditor code={actuatorYaml} language="yaml" readOnly height={280} />
          </Stack>
        </Card>
      </section>

      {/* Topic 6.2: MDC & Correlation IDs */}
      <section id="topic-6-2-mdc-correlation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 6.2: Structured Logging &amp; Correlation IDs
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Rule:</strong> No <code>println</code>. No stack traces without context. <strong>Goal:</strong> Track a single request across Nginx → Service A → Service B → DB. <strong>MDC (Mapped Diagnostic Context)</strong> is a thread-local map that Logback/Log4j2 read from. Use a filter: read or generate <code>X-Correlation-ID</code>, put it in MDC, add it to the response, then <strong>clear MDC in <code>finally</code></strong>—threads are reused; otherwise you leak data to the next request.
            </Text>
            <CodeEditor code={correlationIdFilter} language="kotlin" readOnly height={340} />
            <Text className={styles.sectionDescription}>
              Configure Logback to include <code>%X&#123;correlationId&#125;</code> in the pattern. Logs look like: <code>[correlationId=abc-123] INFO OrderService - Processing order...</code> (Spring Boot 3 + Micrometer Tracing can do this automatically, but understanding MDC is essential.)
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 6.3: Micrometer */}
      <section id="topic-6-3-micrometer" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 6.3: Custom Metrics (Micrometer)
            </Heading>
            <Text className={styles.sectionDescription}>
              Beyond CPU/memory: you need <strong>business metrics</strong>—e.g. &quot;orders failed payment&quot;, &quot;time spent in <code>calculateTax()</code>&quot;. Spring Boot uses <strong>Micrometer</strong> (SLF4J-style facade for metrics). It ships to Prometheus, Datadog, New Relic, etc. Use <code>MeterRegistry</code>: <code>counter(&quot;name&quot;, &quot;tag&quot;, &quot;value&quot;).increment()</code> and <code>@Timed</code> for latency. Tag failures (e.g. <code>status=failure</code>) so you can alert: &quot;If <code>payments.total</code> with <code>status=failure</code> &gt; 5% for 5 minutes, page the engineer.&quot;
            </Text>
            <CodeEditor code={micrometerMetrics} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* Topic 6.4: Tracing */}
      <section id="topic-6-4-tracing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 6.4: Distributed Tracing (OpenTelemetry)
            </Heading>
            <Text className={styles.sectionDescription}>
              Logs = <em>what</em> happened. Metrics = <em>trends</em>. Traces = <em>where</em> time was spent. If &quot;Get User&quot; takes 5s, a trace shows Controller 5ms, Service 10ms, <strong>DB 4900ms</strong>—you&apos;ve found the bottleneck. Add <code>micrometer-tracing-bridge-otel</code>; Spring Boot 3 injects trace IDs into logs and propagates them over HTTP (WebClient/RestTemplate) to other services.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Phase 6 Challenge */}
      <section id="phase-6-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 6 Challenge: The Glass Box
            </Heading>
            <Text className={styles.sectionDescription}>
              Make your API transparent.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Requirements
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Actuator:</strong> <code>GET /actuator/health</code> returns <code>&#123;&quot;status&quot;: &quot;UP&quot;&#125;</code>.</li>
              <li><strong>Correlation:</strong> MDC filter. Request via Postman; logs include <code>[correlationId=...]</code> and response headers include <code>X-Correlation-ID</code>.</li>
              <li><strong>Metric:</strong> <code>POST /config/feature-toggle</code> increments <code>config.updates</code>. Verify at <code>/actuator/metrics/config.updates</code>.</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Self-check:</strong> MDC cleared in <code>finally</code>? (If not, logs are wrong.) Using Micrometer abstraction, not a hardcoded metrics backend? (So you can swap Prometheus for Datadog later.)
              </Text>
            </div>
            <CodeEditor code={phase6ChallengeStarter} language="kotlin" readOnly height={140} />
          </Stack>
        </Card>
      </section>

      {/* Phase 7 intro */}
      <section id="phase-7-intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Phase 7: Architecture &amp; Engineering Judgment
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Senior mindset:</strong> Any junior can add a library. A senior knows when <em>not</em> to. Architecture is not drawing boxes—it&apos;s <strong>managing complexity</strong> and <strong>drawing boundaries</strong>. Postpone hard decisions (like splitting into microservices) as long as possible by keeping the system modular.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 7.1: Modular Monolith */}
      <section id="topic-7-1-modular-monolith" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 7.1: The Modular Monolith (The &quot;Golden Default&quot;)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Trap:</strong> &quot;We need microservices because Netflix uses them.&quot; <strong>Reality:</strong> If you can&apos;t build a clean monolith, you&apos;ll build a distributed monolith—the worst of both worlds. <strong>Solution:</strong> a <strong>Modular Monolith</strong>: single deployment (one JAR), strict boundaries. Code in <code>Order</code> must not directly import <code>User</code> internals.
            </Text>
            <Text className={styles.sectionDescription}>
              Use Kotlin <code>internal</code>: domain and DTOs <code>public</code>; repository implementations and helpers <code>internal</code>. That physically prevents other modules from touching your privates.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Topic 7.2: Packaging by feature */}
      <section id="topic-7-2-packaging" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 7.2: Packaging by Feature (Not by Layer)
            </Heading>
            <Text className={styles.sectionDescription}>
              Don&apos;t slice vertically (<code>/controllers</code>, <code>/services</code>, <code>/repositories</code>). <strong>Slice horizontally</strong>: group what changes together (<code>/features/users</code>, <code>/features/orders</code>). When you extract &quot;Orders&quot; into a microservice, you cut-and-paste the <code>orders</code> folder.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              ❌ Vertical (by layer)
            </Heading>
            <CodeEditor code={packagingVertical} language="plaintext" readOnly height={200} />
            <Heading level={3} className={styles.categoryTitle}>
              ✅ Horizontal (by feature)
            </Heading>
            <CodeEditor code={packagingHorizontal} language="plaintext" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* Topic 7.3: DDD lite */}
      <section id="topic-7-3-ddd-lite" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 7.3: DDD Lite (Rich vs Anemic Models)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Anemic:</strong> Entities are bags of getters/setters; all logic in the service. <strong>Rich:</strong> The entity enforces invariants; the service orchestrates. Use <code>private set</code> for <code>status</code>; only the entity changes it. Move rules like &quot;cannot confirm free order&quot; inside <code>Order.confirm()</code>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              ❌ Anemic
            </Heading>
            <CodeEditor code={anemicOrder} language="kotlin" readOnly height={200} />
            <Heading level={3} className={styles.categoryTitle}>
              ✅ Rich domain
            </Heading>
            <CodeEditor code={richOrder} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* Topic 7.4: Testing pyramid */}
      <section id="topic-7-4-testing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Topic 7.4: Testing Strategy (The Pyramid)
            </Heading>
            <Text className={styles.sectionDescription}>
              Test <strong>behaviors</strong>, not methods. (1) <strong>Unit:</strong> Domain entities (rich models). No Spring, no DB. (2) <strong>Integration:</strong> Repositories and controllers. Use <strong>Testcontainers</strong>—not H2 if you run Postgres in prod; H2 differs (JSON, syntax). (3) <strong>E2E:</strong> Critical flows only (e.g. Login → Buy → Logout). Keep these few.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Phase 7 Challenge */}
      <section id="phase-7-challenge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🔥 Phase 7 Challenge: The Refactor (Capstone)
            </Heading>
            <Text className={styles.sectionDescription}>
              You inherit a 3,000-line &quot;God class&quot; <code>ShopService</code> mixing Users, Inventory, Payments, and Notifications. Everything is <code>public</code>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Task
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Identify boundaries:</strong> Inventory vs Payment.</li>
              <li><strong>Create modules:</strong> <code>com.app.inventory</code>, <code>com.app.payment</code>.</li>
              <li><strong>Lock down:</strong> Move code; mark repositories <code>internal</code>.</li>
              <li><strong>Define APIs:</strong> Public <code>InventoryService</code> interface. <code>ShopService</code> becomes an orchestrator and only calls that interface.</li>
              <li><strong>Bonus (DDD):</strong> Move logic like <code>if (stock &lt; 0) throw ...</code> into the <code>Product</code> entity.</li>
            </ol>
            <CodeEditor code={phase7ChallengeStarter} language="kotlin" readOnly height={140} />
          </Stack>
        </Card>
      </section>

      {/* Recap */}
      <section className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Recap
            </Heading>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 1
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Constructor-only DI; lifecycle; @Configuration vs @Component; Prototype trap; BeanPostProcessors.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 2
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Controller as gateway; DTOs only; <code>@ControllerAdvice</code>; Filters vs Interceptors; validation; idempotency and correlation IDs.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 3
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>N+1: JOIN FETCH / <code>@EntityGraph</code>; never EAGER. Transaction proxy; REQUIRED vs REQUIRES_NEW; <code>@Version</code>; profile and prove query count.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 4
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>OAuth2 vs OIDC; resource server + JWT; filter chain; <code>@PreAuthorize</code>; CORS; JWT converter; 401 vs 403.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 5
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Coroutines &amp; <code>suspend</code>; no <code>GlobalScope</code>. <code>coroutineScope</code> + <code>async</code>; WebClient with timeouts; consumer groups; DLQ; Transactional Outbox.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 6
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Actuator liveness/readiness; MDC &amp; correlation IDs; Micrometer; distributed tracing.</li>
            </ul>
            <Heading level={3} className={styles.categoryTitle}>
              Phase 7
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Modular Monolith; <code>internal</code> boundaries. Packaging by feature. Rich vs anemic domain; Testcontainers; testing pyramid. Refactor capstone.</li>
            </ul>
          </Stack>
        </Card>
      </section>

      {/* Course Completion */}
      <section id="course-completion" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              🎓 Course Completion
            </Heading>
            <Text className={styles.sectionDescription}>
              You&apos;ve gone from <strong>DI fundamentals</strong> to <strong>architectural boundaries</strong>. You now have the toolkit of a Senior Spring Engineer:
            </Text>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Core:</strong> Constructor injection &amp; proxies.</li>
              <li><strong>Web:</strong> Global error handling &amp; DTOs.</li>
              <li><strong>Data:</strong> N+1 prevention &amp; transaction propagation.</li>
              <li><strong>Security:</strong> OAuth2 resource servers.</li>
              <li><strong>Async:</strong> Coroutines &amp; Outbox pattern.</li>
              <li><strong>Ops:</strong> Metrics &amp; correlation IDs.</li>
              <li><strong>Arch:</strong> Modular monoliths &amp; DDD.</li>
            </ol>
            <Text className={styles.sectionDescription}>
              <strong>Next step:</strong> Pick a Master Project (e.g. an <strong>Event-Driven Payment System</strong>) and build it. Apply every phase to that one project. That is how you become unstoppable. Good luck.
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
          href={createLocalizedPath("/developer-section/blog/kotlin-spring-reactivity")}
          variant="primary"
        >
          Spring Reactive with Kotlin →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
