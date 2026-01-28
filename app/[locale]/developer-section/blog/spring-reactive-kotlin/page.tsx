"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor, FullscreenSection } from "@/components/ui";
import { CodeComparison } from "@/components/ui/CodeComparison";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import Image from "next/image";
import Link from "next/link";
import { SPRING_REACTIVE_CHALLENGES } from "@/lib/challengesData";
import styles from "../BlogPostPage.module.css";

// ——— Module 1: Foundation ———
const monoFluxCode = [
  "// 1. Creating a Mono (Just one item)",
  'val namePipe: Mono<String> = Mono.just("Christian")',
  "",
  "// 2. Creating a Flux (Multiple items)",
  "val numbersPipe: Flux<Int> = Flux.just(1, 2, 3, 4, 5)",
  "",
  "// 3. Kotlin Extension Way (The \"Cool\" way)",
  "// This is what .toMono() does!",
  '"Christian".toMono()',
  "listOf(1, 2, 3).toFlux()",
  "",
  "// ⚠️ Crucial: Nothing happens until you Subscribe",
  "namePipe.subscribe { name -> println(name) } // Output: Christian",
].join("\n");

// ——— Module 2: Map vs FlatMap ———
const mapFlatMapFullCode = [
  "data class User(val id: String, val name: String)",
  "",
  "fun findUser(id: String): Mono<User> = Mono.just(User(id, \"Christian\"))",
  "fun getOrders(userId: String): Flux<String> = Flux.just(\"Order1\", \"Order2\")",
  "",
  "// BAD: .map returns Mono<Flux<String>>",
  "val bad: Mono<Flux<String>> = findUser(\"123\").map { user -> getOrders(user.id) }",
  "",
  "// GOOD: .flatMapMany returns Flux<String>",
  "val good: Flux<String> = findUser(\"123\").flatMapMany { user -> getOrders(user.id) }",
].join("\n");

// ——— Module 3: Zip ———
const zipCode = [
  "val userMono = findUser(\"123\")       // Takes 2 seconds",
  "val addressMono = findAddress(\"123\") // Takes 2 seconds",
  "",
  "// Total time: 2 seconds (parallel!)",
  "val combined: Mono<Tuple2<User, Address>> = Mono.zip(userMono, addressMono)",
  "",
  "combined.subscribe { tuple ->",
  "    val user = tuple.t1",
  "    val address = tuple.t2",
  "    println(\"Sending package to ${user.name} at ${address.street}\")",
  "}",
].join("\n");

// ——— Module 4: Decision Making ———
const switchIfEmptyCode = [
  "val userPipe = cacheService.getUser(\"123\")",
  "    .switchIfEmpty(databaseService.getUser(\"123\"))",
  "    .switchIfEmpty(Mono.error(Exception(\"User not found anywhere!\")))",
].join("\n");

const elvisCode = [
  "val userState: String? = request.queryParam(\"state\")",
  "",
  "// If userState is null, CREATE a Mono that fetches it.",
  "// If userState exists, CREATE a Mono that just holds it.",
  "val finalMono: Mono<String> = userState?.toMono()",
  "    ?: geoService.fetchState()",
].join("\n");

// ——— Module 5: Product API ———
const productControllerCode = [
  "@RestController",
  '@RequestMapping("/api/v1/products")',
  "class ProductController(",
  "    private val productRepo: ProductRepository,",
  "    private val inventoryClient: InventoryWebClient",
  ") {",
  "",
  "    @GetMapping(\"/{id}\")",
  "    fun getProduct(@PathVariable id: String): Mono<ResponseEntity<ProductDto>> {",
  "        val productMono = productRepo.findById(id)",
  "            .switchIfEmpty(Mono.error(NotFoundException(\"Product $id not found\")))",
  "        val inventoryMono = inventoryClient.getStock(id).defaultIfEmpty(0)",
  "",
  "        return Mono.zip(productMono, inventoryMono)",
  "            .map { tuple ->",
  "                val product = tuple.t1",
  "                val stock = tuple.t2",
  "                ProductDto(",
  "                    name = product.name,",
  "                    price = product.price,",
  "                    isAvailable = stock > 0,",
  "                    stockCount = stock",
  "                )",
  "            }",
  "            .map { dto -> ResponseEntity.ok(dto) }",
  "            .onErrorResume { e ->",
  "                when(e) {",
  "                    is NotFoundException -> Mono.just(ResponseEntity.notFound().build())",
  "                    else -> Mono.just(ResponseEntity.status(500).build())",
  "                }",
  "            }",
  "    }",
  "}",
].join("\n");

// ——— Final Exam: Bad vs Fixed ———
const finalExamBadCode = [
  "// BAD CODE - The Russian Doll problem",
  "fun getCreateDate(userId: String): Mono<Date> {",
  "    return repo.findById(userId)",
  "        .map { user ->",
  "            // repo.getDetails returns a Mono<Details>",
  "            repo.getDetails(user.detailsId)",
  "        }",
  "        .map { detailsMono ->",
  "            // detailsMono is actually Mono<Details>",
  "            detailsMono.map { it.createdDate }",
  "        }",
  "}",
].join("\n");

const finalExamFixedCode = [
  "// FIXED CODE - Use flatMap to flatten",
  "fun getCreateDate(userId: String): Mono<Date> {",
  "    return repo.findById(userId)",
  "        .flatMap { user ->",
  "            repo.getDetails(user.detailsId)",
  "        }",
  "        .map { details ->",
  "            details.createdDate",
  "        }",
  "}",
].join("\n");

// ——— Part 2: Module 6 — collectList ———
const collectListCode = [
  "fun getAllActiveUsers(): Mono<List<UserDto>> {",
  "    return userRepository.findAll() // Returns Flux<User> (1, 2, 3...)",
  "        .filter { user -> user.isActive } // Still Flux<User> (drops inactive ones)",
  "        .map { user -> UserDto(user.name) } // Still Flux<UserDto>",
  "        .collectList() // BOOM: Becomes Mono<List<UserDto>>",
  "    // Now it's a single \"Box\" containing the whole list.",
  "    // Ready to be returned as a JSON Array response.",
  "}",
].join("\n");

// ——— Part 2: Module 7 — doOnNext / doOnSuccess / doOnError ———
const doOnCode = [
  "fun getUserWithLogging(id: String): Mono<User> {",
  "    return repo.findById(id)",
  "        .doOnSubscribe { println(\"Stream started!\") } // Runs when someone subscribes",
  "        .doOnNext { user ->",
  "            // This runs every time a user emits.",
  "            println(\"Found user: ${user.name}\")",
  "        }",
  "        .doOnError { error ->",
  "            println(\"Uh oh, DB failed: ${error.message}\")",
  "        }",
  "    // The original user flows through here untouched",
  "}",
].join("\n");

// ——— Part 2: Module 8 — onErrorReturn / onErrorResume ———
const errorHandlingCode = [
  "fun getResilientPrice(productId: String): Mono<BigDecimal> {",
  "    return livePriceApi.getPrice(productId) // Primary Source",
  "        .doOnError { e -> logger.error(\"Live API failed\", e) }",
  "        .onErrorResume {",
  "            // Fallback 1: Database",
  "            println(\"Switching to DB backup...\")",
  "            dbPriceRepo.getPrice(productId)",
  "        }",
  "        .onErrorReturn(BigDecimal.ZERO) // Fallback 2: Hardcoded default",
  "}",
].join("\n");

// ——— Part 2: Module 9 — then() (Void / Fire and Forget) ———
const voidPatternCode = [
  "fun deleteUserAndSendEmail(userId: String): Mono<Void> {",
  "    return userRepository.deleteById(userId) // Returns Mono<Void>",
  "        .then(emailService.sendGoodbyeEmail(userId)) // Wait for delete, then Email",
  "        .then() // Ensure the final result is Mono<Void>",
  "}",
].join("\n");

// ——— Part 2: Module 10 — zipWhen ———
const zipWhenCode = [
  "fun getUserAndWeather(userId: String): Mono<UserWeatherDto> {",
  "    return userRepo.findById(userId) // 1. Get User",
  "        .zipWhen { user ->",
  "            // 2. Use user to get Weather",
  "            weatherService.getWeather(user.homeCity)",
  "        }",
  "        // 3. Result here is Tuple2<User, Weather>",
  "        .map { tuple ->",
  "            val user = tuple.t1",
  "            val weather = tuple.t2",
  "            UserWeatherDto(user.name, weather.temp)",
  "        }",
  "}",
].join("\n");

// ——— Part 2: Final Boss — createOrder ———
const createOrderCode = [
  "fun createOrder(userId: String, itemIds: List<String>): Mono<OrderResponse> {",
  "    return userRepo.findById(userId)",
  "        .filter { user -> !user.isBanned }",
  "        .switchIfEmpty(Mono.error(IllegalArgumentException(\"User is banned or not found\")))",
  "        .flatMap { user ->",
  "            Flux.fromIterable(itemIds)",
  "                .flatMap { id -> itemService.getItemDetails(id) }",
  "                .collectList()",
  "                .map { items ->",
  "                    val total = items.sumOf { it.price }",
  "                    Tuples.of(user, items, total)",
  "                }",
  "        }",
  "        .flatMap { (user, items, total) ->",
  "            val newOrder = Order(userId = user.id, totalAmount = total, itemCount = items.size)",
  "            orderRepo.save(newOrder)",
  "                .doOnSuccess { savedOrder ->",
  "                    emailService.sendReceipt(user.email, savedOrder).subscribe()",
  "                }",
  "        }",
  "        .map { savedOrder ->",
  "            OrderResponse(savedOrder.id, \"Order Created Successfully\")",
  "        }",
  "}",
].join("\n");

export default function SpringReactiveKotlinPage() {
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
          <li className={styles.breadcrumbCurrent}>Spring Reactive (Project Reactor)</li>
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
                Spring Reactive (Project Reactor) in Kotlin
              </Heading>
              <Text className={styles.subtitle}>
                From &quot;confused by flatMap&quot; to production-ready reactive backends. Mental models first, then code—Mono, Flux, map vs flatMap, zip, and real API examples.
              </Text>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">Mono & Flux</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">map vs flatMap</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">Zip</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/10">switchIfEmpty</span>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-xl aspect-[4/3] relative">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
                alt="Reactive streams and data flow concept"
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
            <strong>Core idea:</strong> Stop thinking about variables (<code className="text-white/90 bg-white/10 px-1 rounded">String name</code>). Start thinking about <strong>pipelines</strong> (<code className="text-white/90 bg-white/10 px-1 rounded">Mono&lt;String&gt;</code>). Nothing runs until you subscribe.
          </Text>
        </div>
      </div>

      {/* Module 1: Foundation */}
      <FullscreenSection id="foundation" title="Module 1: The Foundation (The Box Analogy)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Mono and Flux: Pipes, Not Variables
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Mono&lt;T&gt;</strong>: a pipe that will deliver <strong>0 or 1</strong> item (like a Promise in JS). <strong>Flux&lt;T&gt;</strong>: a pipe that will deliver <strong>0 to N</strong> items (like a Stream). Create them with <code className="bg-white/10 px-1 rounded">Mono.just</code>, <code className="bg-white/10 px-1 rounded">Flux.just</code>, or Kotlin extensions like <code className="bg-white/10 px-1 rounded">.toMono()</code> and <code className="bg-white/10 px-1 rounded">.toFlux()</code>.
              </Text>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 aspect-[2/1] max-h-48">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Data pipelines and flow"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <CodeEditor code={monoFluxCode} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 2: Map vs FlatMap */}
      <FullscreenSection id="map-flatmap" title="Module 2: Map vs FlatMap (The #1 Interview Question)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                When to use .map vs .flatMap
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>.map</strong>: transform data <strong>synchronously</strong> (math, string manipulation)—same box, different content. <strong>.flatMap</strong>: call another <strong>asynchronous</strong> service/DB; you unwrap one box and replace it with the result of another pipeline. Using <code className="bg-white/10 px-1 rounded">.map</code> when the lambda returns a <code className="bg-white/10 px-1 rounded">Mono</code> or <code className="bg-white/10 px-1 rounded">Flux</code> gives you a nested type (e.g. <code className="bg-white/10 px-1 rounded">Mono&lt;Flux&lt;String&gt;&gt;</code>); use <code className="bg-white/10 px-1 rounded">.flatMap</code> or <code className="bg-white/10 px-1 rounded">.flatMapMany</code> to flatten.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>Analogy:</strong> map = unwrap a gift, paint it blue, put it back in the same box. flatMap = unwrap a gift, follow a map to a treasure chest, and swap the gift for the chest.
              </Text>
            </div>
            <CodeEditor code={mapFlatMapFullCode} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 3: Zip */}
      <FullscreenSection id="zip" title="Module 3: Combining Data (Tuples & Zip)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Parallel fetch with Mono.zip
              </Heading>
              <Text className={styles.sectionDescription}>
                Fetch from Source A and Source B at the same time, then combine results. <code className="bg-white/10 px-1 rounded">Mono.zip(userMono, addressMono)</code> runs both in parallel; total time is the max of the two, not the sum.
              </Text>
            </div>
            <CodeEditor code={zipCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 4: Decision Making */}
      <FullscreenSection id="decision-making" title="Module 4: Decision Making (switchIfEmpty & Elvis)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Try cache, then DB; or use a fallback Mono
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>switchIfEmpty</strong>: if the current Mono completes empty, subscribe to the fallback (e.g. DB when cache misses). <strong>Elvis (?:)</strong>: when you have a nullable value, choose between <code className="bg-white/10 px-1 rounded">value?.toMono()</code> or <code className="bg-white/10 px-1 rounded">fallbackMono</code>.
              </Text>
            </div>
            <CodeEditor code={switchIfEmptyCode} language="kotlin" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>Kotlin Elvis with Mono</Heading>
            <CodeEditor code={elvisCode} language="kotlin" readOnly height={160} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 5: Product API */}
      <FullscreenSection id="grand-finale" title="Module 5: The Grand Finale (Product API)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Full controller: find product + inventory, then DTO
              </Heading>
              <Text className={styles.sectionDescription}>
                One endpoint: fetch product (DB) and inventory (external API) in parallel with <code className="bg-white/10 px-1 rounded">Mono.zip</code>, map to a DTO, and handle 404/500 with <code className="bg-white/10 px-1 rounded">onErrorResume</code>.
              </Text>
            </div>
            <CodeEditor code={productControllerCode} language="kotlin" readOnly height={420} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Final Exam */}
      <FullscreenSection id="final-exam" title="Final Exam: The Russian Doll Bug" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                What’s wrong with this code?
              </Heading>
              <Text className={styles.sectionDescription}>
                The first <code className="bg-white/10 px-1 rounded">.map</code> returns <code className="bg-white/10 px-1 rounded">Mono&lt;Mono&lt;Details&gt;&gt;</code>; the second <code className="bg-white/10 px-1 rounded">.map</code> operates on the inner Mono, not the date. Fix: use <code className="bg-white/10 px-1 rounded">.flatMap</code> for the async call so the pipeline stays <code className="bg-white/10 px-1 rounded">Mono&lt;Details&gt;</code>, then <code className="bg-white/10 px-1 rounded">.map</code> to <code className="bg-white/10 px-1 rounded">createdDate</code>.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
              <Text className={styles.infoText}>
                <strong>Rule:</strong> If your lambda returns a Mono or Flux, use flatMap / flatMapMany. If it returns a plain value, use map.
              </Text>
            </div>
            <CodeComparison
              wrong={finalExamBadCode}
              good={finalExamFixedCode}
              language="kotlin"
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* ——— Part 2: Intermediate Patterns ——— */}
      <div className={styles.section}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-cyan-500/10 p-6 sm:p-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-300/90 bg-violet-500/20 border border-violet-400/30 mb-4">
            Part 2
          </span>
          <Heading level={2} className={styles.sectionTitle}>
            Intermediate Patterns: Junior → Senior Reactive
          </Heading>
          <Text className={styles.sectionDescription}>
            We established the basics (<code className="bg-white/10 px-1 rounded">Mono</code>, <code className="bg-white/10 px-1 rounded">Flux</code>, <code className="bg-white/10 px-1 rounded">map</code> vs <code className="bg-white/10 px-1 rounded">flatMap</code>). Now we tackle the patterns that distinguish a junior developer from a senior reactive engineer: lists, side effects, error handling, void flows, dependent combination, and a full Create Order scenario.
          </Text>
        </div>
      </div>

      {/* Module 6: collectList */}
      <FullscreenSection id="module-6-lists" title="Module 6: Handling Lists (Stream → Collection)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Flux to Mono&lt;List&lt;T&gt;&gt; with .collectList()
              </Heading>
              <Text className={styles.sectionDescription}>
                In reactive code you usually work with <code className="bg-white/10 px-1 rounded">Flux&lt;User&gt;</code>. When you need a single JSON array (e.g. for the frontend), turn the stream back into one &quot;box&quot;: <code className="bg-white/10 px-1 rounded">Flux&lt;T&gt;</code> → <code className="bg-white/10 px-1 rounded">Mono&lt;List&lt;T&gt;&gt;</code> with <code className="bg-white/10 px-1 rounded">.collectList()</code>.
              </Text>
            </div>
            <CodeEditor code={collectListCode} language="kotlin" readOnly height={220} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 7: Side Effects */}
      <FullscreenSection id="module-7-side-effects" title="Module 7: Side Effects (Peeking)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                .doOnNext, .doOnSuccess, .doOnError
              </Heading>
              <Text className={styles.sectionDescription}>
                Don&apos;t break the chain—but you still need to log or observe. Use <strong>side-effect</strong> operators: they look at the data passing by and <strong>do not change it</strong>. <code className="bg-white/10 px-1 rounded">.doOnSubscribe</code>, <code className="bg-white/10 px-1 rounded">.doOnNext</code>, <code className="bg-white/10 px-1 rounded">.doOnSuccess</code>, <code className="bg-white/10 px-1 rounded">.doOnError</code> run at the right moment; the stream continues unchanged.
              </Text>
            </div>
            <CodeEditor code={doOnCode} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 8: Error Handling */}
      <FullscreenSection id="module-8-error-handling" title="Module 8: Advanced Error Handling (Safety Nets)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                onErrorReturn vs onErrorResume
              </Heading>
              <Text className={styles.sectionDescription}>
                In reactive code you use <code className="bg-white/10 px-1 rounded">onError...</code> instead of try/catch. <strong>onErrorReturn</strong>: emit a static default (e.g. &quot;if the ATM is broken, give me $0&quot;). <strong>onErrorResume</strong>: call a backup function or service (e.g. &quot;if the ATM is broken, go to the bank teller&quot;). Chain them for a circuit-breaker style fallback.
              </Text>
            </div>
            <CodeEditor code={errorHandlingCode} language="kotlin" readOnly height={240} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 9: Void Pattern */}
      <FullscreenSection id="module-9-void-pattern" title="Module 9: The Void Pattern (Fire and Forget)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Mono&lt;Void&gt; and .then()
              </Heading>
              <Text className={styles.sectionDescription}>
                For delete, send-email, or other &quot;did it finish?&quot; flows you don&apos;t have a value to return. Use <code className="bg-white/10 px-1 rounded">Mono&lt;Void&gt;</code>. <code className="bg-white/10 px-1 rounded">.then(nextMono)</code> means: &quot;I don&apos;t care what the previous step emitted; wait for it to finish, then run the next step.&quot;
              </Text>
            </div>
            <CodeEditor code={voidPatternCode} language="kotlin" readOnly height={160} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Module 10: zipWhen */}
      <FullscreenSection id="module-10-zip-when" title="Module 10: Dependent Combination (zipWhen)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                When Step B needs the result of Step A
              </Heading>
              <Text className={styles.sectionDescription}>
                <code className="bg-white/10 px-1 rounded">Mono.zip</code> runs in parallel. When B depends on A (e.g. get User, then get Weather for <code className="bg-white/10 px-1 rounded">user.homeCity</code>), use <strong>.zipWhen</strong>: do A, keep the result, use it to run B, then get both as a Tuple.
              </Text>
            </div>
            <CodeEditor code={zipWhenCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Final Boss: createOrder */}
      <FullscreenSection id="final-boss" title="Final Boss: Create Order (Real-World Chain)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Create Order: Validate → Fetch Items → Total → Save → Side Effect
              </Heading>
              <Text className={styles.sectionDescription}>
                A full chain: (1) validate user (filter + switchIfEmpty), (2) fetch all items in parallel via <code className="bg-white/10 px-1 rounded">Flux.fromIterable</code> + <code className="bg-white/10 px-1 rounded">flatMap</code> + <code className="bg-white/10 px-1 rounded">collectList</code>, (3) sum total and bundle in a Tuple, (4) save order, (5) fire-and-forget email in <code className="bg-white/10 px-1 rounded">doOnSuccess</code>, (6) map to response.
              </Text>
            </div>
            <CodeEditor code={createOrderCode} language="kotlin" readOnly height={480} />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Three Golden Rules */}
      <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-8`}>
        <Heading level={3} className={styles.categoryTitle}>Three Golden Rules to Memorize</Heading>
        <ol className="list-decimal list-inside space-y-2 text-white/95 text-[0.9375rem] leading-relaxed">
          <li><strong>If you see <code className="bg-white/10 px-1 rounded">Mono&lt;Mono&lt;T&gt;&gt;</code></strong>, you made a mistake. Change <code className="bg-white/10 px-1 rounded">.map</code> to <code className="bg-white/10 px-1 rounded">.flatMap</code>.</li>
          <li><strong>If you need <code className="bg-white/10 px-1 rounded">T</code> later in the chain</strong>, use <code className="bg-white/10 px-1 rounded">zipWhen</code> or carry it down in a Tuple.</li>
          <li><strong>Nothing happens until the Controller returns.</strong> WebFlux calls <code className="bg-white/10 px-1 rounded">.subscribe()</code> for you at the end. You rarely need to call <code className="bg-white/10 px-1 rounded">.subscribe()</code> yourself in backend code.</li>
        </ol>
      </div>

      {/* ——— Challenges Section (20 reactive-themed challenges) ——— */}
      <FullscreenSection id="challenges" title="Challenges (Kotlin / TypeScript)" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Practice: 20 Reactive-Themed Challenges
              </Heading>
              <Text className={styles.sectionDescription}>
                From basic (emit one, sum, filter) to intermediate (zip, default if empty, reduce). Each challenge is runnable in the shared TypeScript/Kotlin runner: run with sample input or submit against test cases. Open any challenge to code and submit.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                <strong>How to play:</strong> Click a challenge → solve in Kotlin or TypeScript → Run (sample) or Submit (test cases). Challenges are listed from basic to advanced.
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
              {SPRING_REACTIVE_CHALLENGES.map((ch, idx) => (
                <Link
                  key={ch.id}
                  href={createLocalizedPath(`/developer-section/challenges/${ch.id}`)}
                  className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-violet-400/30 transition-colors text-left"
                  role="listitem"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-white/60 tabular-nums">#{idx + 1}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${ch.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white/95 text-sm mb-0.5">{ch.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-2">{ch.description}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs text-violet-300">
                    Solve →
                  </span>
                </Link>
              ))}
            </div>
            <p className="text-sm text-white/70">
              All {SPRING_REACTIVE_CHALLENGES.length} challenges are available at{" "}
              <ButtonLink href={createLocalizedPath("/developer-section/challenges/typescript-kotlin")} variant="secondary" className="!text-violet-300 !border-violet-400/40 hover:!bg-violet-500/20">
                TypeScript & Kotlin challenges
              </ButtonLink>
              {" "}(filter or scroll to Reactive).
            </p>
          </Stack>
        </Card>
      </FullscreenSection>

      <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-12`}>
        <Text className={styles.infoText}>
          You now have the mental model and the operators (Part 1 + Part 2). Use <strong>Mono</strong>/<strong>Flux</strong> as pipelines, <strong>flatMap</strong> for async steps, <strong>zip</strong> / <strong>zipWhen</strong> for parallel or dependent work, <strong>collectList</strong> for JSON arrays, <strong>doOn*</strong> for side effects, <strong>onErrorResume</strong> / <strong>onErrorReturn</strong> for safety nets, and <strong>then()</strong> for void flows. Build something reactive!
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
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/kotlin-multiplatform")}>
          <span className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
              <span className="font-semibold">Kotlin Multiplatform UI</span>
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
