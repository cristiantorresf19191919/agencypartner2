"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks ---
const module1Deps = [
  "// build.gradle.kts",
  "dependencies {",
  "    implementation(\"org.springframework.boot:spring-boot-starter-data-mongodb-reactive\")",
  "    implementation(\"org.springframework.boot:spring-boot-starter-webflux\")",
  "    implementation(\"io.projectreactor.kotlin:reactor-kotlin-extensions\")",
  "}",
].join("\n");

const module2Product = [
  "import org.springframework.data.annotation.Id",
  "import org.springframework.data.mongodb.core.mapping.Document",
  "",
  "@Document(collection = \"products\") // 1. Maps to a Mongo 'Collection' (like a Table)",
  "data class Product(",
  "    @Id // 2. The Primary Key (usually a MongoDB ObjectId string)",
  "    val id: String? = null, // Nullable: Mongo generates it on save",
  "    ",
  "    val name: String,",
  "    val price: Double,",
  "    val category: String,",
  "    val inStock: Boolean = true",
  ")",
].join("\n");

const challenge1Starter = [
  "// 🔥 Challenge 1: The User Model",
  "// 1. Create a User data class",
  "// 2. Fields: id, email, username, roles (List<String>)",
  "// 3. id null by default so Mongo can auto-generate it",
  "",
  "import org.springframework.data.annotation.Id",
  "import org.springframework.data.mongodb.core.mapping.Document",
  "",
  "// Your @Document and data class here",
  "// @Document(collection = \"users\")",
  "// data class User(...)",
].join("\n");

const challenge1Solution = [
  "@Document(collection = \"users\")",
  "data class User(",
  "    @Id",
  "    val id: String? = null,",
  "    val email: String,",
  "    val username: String,",
  "    val roles: List<String>",
  ")",
].join("\n");

const module3Repo = [
  "import org.springframework.data.mongodb.repository.ReactiveMongoRepository",
  "import org.springframework.stereotype.Repository",
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "@Repository",
  "interface ProductRepository : ReactiveMongoRepository<Product, String> {",
  "    // Custom Query 1: Find by category → Flux (many results)",
  "    fun findByCategory(category: String): Flux<Product>",
  "",
  "    // Custom Query 2: Spring parses method name → Mongo query",
  "    fun findByPriceLessThan(maxPrice: Double): Flux<Product>",
  "",
  "    // Custom Query 3: Find one → Mono",
  "    fun findByName(name: String): Mono<Product>",
  "}",
].join("\n");

const challenge2Starter = [
  "// 🔥 Challenge 2: The User Repo",
  "// 1. Create UserRepository extending ReactiveMongoRepository<User, String>",
  "// 2. findByEmail(email: String): Mono<User>",
  "// 3. findByRolesContaining(role: String): Flux<User>",
  "",
  "// @Repository",
  "// interface UserRepository : ReactiveMongoRepository<User, String> {",
  "//     ...",
  "// }",
].join("\n");

const challenge2Solution = [
  "@Repository",
  "interface UserRepository : ReactiveMongoRepository<User, String> {",
  "    fun findByEmail(email: String): Mono<User>",
  "    fun findByRolesContaining(role: String): Flux<User>",
  "}",
].join("\n");

const module4Service = [
  "import org.springframework.stereotype.Service",
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "@Service",
  "class ProductService(private val repo: ProductRepository) {",
  "",
  "    fun getAllProducts(): Flux<Product> = repo.findAll()",
  "",
  "    fun createProduct(product: Product): Mono<Product> {",
  "        if (product.price < 0) return Mono.error(IllegalArgumentException(\"Price cannot be negative\"))",
  "        return repo.save(product)",
  "    }",
  "",
  "    fun updatePrice(id: String, newPrice: Double): Mono<Product> {",
  "        return repo.findById(id)",
  "            .switchIfEmpty(Mono.error(RuntimeException(\"Product not found\")))",
  "            .flatMap { existing ->",
  "                val updated = existing.copy(price = newPrice)",
  "                repo.save(updated)",
  "            }",
  "    }",
  "}",
].join("\n");

const challenge3Starter = [
  "// 🔥 Challenge 3: The Safe User Updater",
  "// 1. updateUsername(email: String, newName: String): Mono<User>",
  "// 2. Find user by email",
  "// 3. If not found → Mono.error(\"User Unknown\")",
  "// 4. If found → update username, save, return",
  "",
  "// fun updateUsername(email: String, newName: String): Mono<User> {",
  "//     return userRepo.findByEmail(email)",
  "//         .switchIfEmpty(Mono.error(...))",
  "//         .flatMap { ... }",
  "// }",
].join("\n");

const challenge3Solution = [
  "fun updateUsername(email: String, newName: String): Mono<User> {",
  "    return userRepo.findByEmail(email)",
  "        .switchIfEmpty(Mono.error(RuntimeException(\"User Unknown\")))",
  "        .flatMap { user ->",
  "            val updated = user.copy(username = newName)",
  "            userRepo.save(updated)",
  "        }",
  "}",
].join("\n");

const module5Controller = [
  "import org.springframework.http.HttpStatus",
  "import org.springframework.web.bind.annotation.*",
  "import reactor.core.publisher.Flux",
  "import reactor.core.publisher.Mono",
  "",
  "@RestController",
  "@RequestMapping(\"/api/products\")",
  "class ProductController(private val service: ProductService) {",
  "",
  "    @GetMapping",
  "    fun getAll(): Flux<Product> = service.getAllProducts()",
  "",
  "    @PostMapping",
  "    @ResponseStatus(HttpStatus.CREATED)",
  "    fun create(@RequestBody product: Product): Mono<Product> = service.createProduct(product)",
  "",
  "    @PutMapping(\"/{id}/price\")",
  "    fun updatePrice(@PathVariable id: String, @RequestParam newPrice: Double): Mono<Product> {",
  "        return service.updatePrice(id, newPrice)",
  "    }",
  "}",
].join("\n");

const module6Template = [
  "import org.springframework.data.mongodb.core.ReactiveMongoTemplate",
  "import org.springframework.data.mongodb.core.query.Criteria",
  "import org.springframework.data.mongodb.core.query.Query",
  "",
  "@Service",
  "class ComplexSearchService(private val template: ReactiveMongoTemplate) {",
  "",
  "    fun searchProducts(minPrice: Double?, category: String?): Flux<Product> {",
  "        val criteriaList = mutableListOf<Criteria>()",
  "        if (minPrice != null) criteriaList.add(Criteria.where(\"price\").gte(minPrice))",
  "        if (category != null) criteriaList.add(Criteria.where(\"category\").`is`(category))",
  "        val query = if (criteriaList.isEmpty()) Query()",
  "            else Query().addCriteria(Criteria().andOperator(*criteriaList.toTypedArray()))",
  "        return template.find(query, Product::class.java)",
  "    }",
  "}",
].join("\n");

const capstoneModels = [
  "import java.time.Instant",
  "",
  "@Document(collection = \"posts\")",
  "data class Post(",
  "    @Id val id: String? = null,",
  "    val title: String,",
  "    val content: String,",
  "    val authorId: String,",
  "    val createdAt: Instant = Instant.now()",
  ")",
  "",
  "@Document(collection = \"comments\")",
  "data class Comment(",
  "    @Id val id: String? = null,",
  "    val postId: String,",
  "    val content: String",
  ")",
].join("\n");

const capstoneDetails = [
  "// GET /posts/{id}/details → Post + Comments",
  "data class PostDetailsDto(val post: Post, val comments: List<Comment>)",
  "",
  "fun getPostWithComments(postId: String): Mono<PostDetailsDto> {",
  "    val postMono = postRepo.findById(postId)",
  "        .switchIfEmpty(Mono.error(NoSuchElementException(\"Post not found\")))",
  "    val commentsFlux = commentRepo.findByPostId(postId).collectList()",
  "    return postMono.flatMap { post ->",
  "        commentsFlux.map { comments -> PostDetailsDto(post, comments) }",
  "    }",
  "}",
].join("\n");

const capstoneStarter = [
  "// Final Capstone: Reactive Blog Engine",
  "// Models: Post(id, title, content, authorId, createdAt), Comment(id, postId, content)",
  "// Endpoints: POST /posts, GET /posts, GET /posts/{id}",
  "// Hard: GET /posts/{id}/details → JSON with Post AND all Comments",
  "// Hint: Mono.zip or flatMap + collectList() to combine Post + Comments into a DTO",
  "",
  "// Implement PostRepository, CommentRepository, PostService, PostController.",
  "// Use DTOs for API responses (don't expose @Document entities directly).",
].join("\n");

const ENDPOINT_POST_ID = "GET /posts/{id}";
const ENDPOINT_POST_DETAILS = "GET /posts/{id}/details";

const tableOfContents = [
  { id: "module-1-reactive-shift", label: "Module 1: The Reactive Shift (Architecture)", level: 1 },
  { id: "module-2-data-model", label: "Module 2: The Data Model (Kotlin Style)", level: 1 },
  { id: "module-3-repository", label: "Module 3: The Reactive Repository", level: 1 },
  { id: "module-4-service", label: "Module 4: The Service Layer", level: 1 },
  { id: "module-5-controller", label: "Module 5: The Controller (API)", level: 1 },
  { id: "module-6-template", label: "Module 6: ReactiveMongoTemplate", level: 1 },
  { id: "capstone-blog-engine", label: "Final Capstone: Reactive Blog Engine", level: 1 },
  { id: "recap", label: "Recap: Key Takeaways", level: 1 },
];

export default function KotlinSpringMongoDBReactivePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout tableOfContents={tableOfContents}>
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
          <li className={styles.breadcrumbCurrent}>Spring Boot Reactive + MongoDB</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Zero to Hero: Spring Boot Reactive with Kotlin &amp; MongoDB
        </Heading>
        <Text className={styles.subtitle}>
          This course takes you from <strong>blocking</strong> applications (SQL/JDBC, thread-per-request) to the high-performance world of <strong>non-blocking Reactive Mongo</strong>. We focus on architecture, clean Kotlin syntax, and Reactor patterns (<code>Mono</code>, <code>Flux</code>, <code>flatMap</code>, <code>switchIfEmpty</code>). Each module teaches fundamentals step-by-step, then challenges you to solve code.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
            alt="Backend code and development"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Course structure:</strong> 6 modules + 3 challenges + 1 capstone. You will define data models with <code>@Document</code>, use <code>ReactiveMongoRepository</code>, implement service-layer logic with <code>flatMap</code> and <code>switchIfEmpty</code>, expose REST APIs with WebFlux, and handle complex queries with <code>ReactiveMongoTemplate</code>. Finish with a Reactive Blog Engine that combines posts and comments using <code>Mono</code> and <code>Flux</code>.
          </Text>
        </div>
      </div>

      {/* Module 1: The Reactive Shift */}
      <section id="module-1-reactive-shift" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 1: The Reactive Shift (Architecture)
            </Heading>
            <Text className={styles.sectionDescription}>
              In a <strong>blocking</strong> app, when you query the database the thread <em>stops and waits</em> for the result. In a <strong>reactive</strong> app we use the <strong>Reactive MongoDB Driver</strong>: the thread sends the query and is released. When Mongo has the data, it pushes it back into the stream (<code>Flux</code> / <code>Mono</code>). No thread is blocked waiting on I/O.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Why MongoDB?</strong> MongoDB is document-based (JSON-like). That fits Reactive Streams well: data flows as chunks rather than rigid table rows, and the reactive driver natively supports non-blocking operations.
            </Text>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Data flow and reactive streams concept"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
              />
            </div>
            <Heading level={3} className={styles.categoryTitle}>
              Setup: Dependencies
            </Heading>
            <Text className={styles.sectionDescription}>
              Add these to your <code>build.gradle.kts</code>:
            </Text>
            <CodeEditor code={module1Deps} language="kotlin" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Module 2: Data Model */}
      <section id="module-2-data-model" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 2: The Data Model (Kotlin Style)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Define how data looks in the database. In SQL you use <code>@Entity</code> and <code>@Table</code>; in Mongo we use <strong><code>@Document</code></strong>. Kotlin <strong>data classes</strong> are ideal: they give <code>equals</code>, <code>hashCode</code>, and <code>copy</code> for free.
            </Text>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
                alt="Documents and data structure"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
              />
            </div>
            <CodeEditor code={module2Product} language="kotlin" readOnly height={280} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 1: The User Model</strong> — (1) Create a <code>User</code> data class. (2) Fields: <code>id</code>, <code>email</code>, <code>username</code>, <code>roles</code> (<code>List&lt;String&gt;</code>). (3) Make <code>id</code> nullable with default <code>null</code> so Mongo can auto-generate it. Map it to a collection <code>users</code> with <code>@Document</code>.
              </Text>
            </div>
            <CodeEditor code={challenge1Starter} language="kotlin" readOnly height={240} />
            <details className={styles.sectionDescription}>
              <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.5rem" }}>💡 Solution (click to expand)</summary>
              <CodeEditor code={challenge1Solution} language="kotlin" readOnly height={160} />
            </details>
          </Stack>
        </Card>
      </section>

      {/* Module 3: Repository */}
      <section id="module-3-repository" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 3: The Reactive Repository (The Interface)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Create the bridge to the database without writing query code. Extend <strong><code>ReactiveMongoRepository</code></strong>. You get <code>save()</code>, <code>findAll()</code>, <code>findById()</code>—all returning <code>Mono</code> or <code>Flux</code>. For custom queries, add method names like <code>findByCategory</code>; Spring parses them and generates the Mongo query.
            </Text>
            <CodeEditor code={module3Repo} language="kotlin" readOnly height={320} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 2: The User Repo</strong> — (1) Create <code>UserRepository</code> extending <code>ReactiveMongoRepository&lt;User, String&gt;</code>. (2) <code>findByEmail(email: String): Mono&lt;User&gt;</code>. (3) <code>findByRolesContaining(role: String): Flux&lt;User&gt;</code>.
              </Text>
            </div>
            <CodeEditor code={challenge2Starter} language="kotlin" readOnly height={200} />
            <details className={styles.sectionDescription}>
              <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.5rem" }}>💡 Solution (click to expand)</summary>
              <CodeEditor code={challenge2Solution} language="kotlin" readOnly height={120} />
            </details>
          </Stack>
        </Card>
      </section>

      {/* Module 4: Service */}
      <section id="module-4-service" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 4: The Service Layer (Business Logic)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Handle “what if?” logic: product not found, negative price, etc. Use <code>flatMap</code>, <code>switchIfEmpty</code>, and <code>map</code> to build a pipeline. We never “unwrap” values here; we chain operations on <code>Mono</code> / <code>Flux</code>.
            </Text>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
                alt="Service layer and business logic"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
              />
            </div>
            <CodeEditor code={module4Service} language="kotlin" readOnly height={380} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                🔥 <strong>Challenge 3: The Safe User Updater</strong> — (1) <code>updateUsername(email: String, newName: String): Mono&lt;User&gt;</code>. (2) Find user by email. (3) If not found, return <code>Mono.error</code> with <code>"User Unknown"</code>. (4) If found, update <code>username</code>, save, and return the updated user.
              </Text>
            </div>
            <CodeEditor code={challenge3Starter} language="kotlin" readOnly height={240} />
            <details className={styles.sectionDescription}>
              <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.5rem" }}>💡 Solution (click to expand)</summary>
              <CodeEditor code={challenge3Solution} language="kotlin" readOnly height={180} />
            </details>
          </Stack>
        </Card>
      </section>

      {/* Module 5: Controller */}
      <section id="module-5-controller" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 5: The Controller (The API Endpoint)
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> Expose your reactive streams as REST. Spring WebFlux subscribes for you: you return <code>Flux</code> or <code>Mono</code>, and the framework streams the response to the client (browser, Postman, etc.).
            </Text>
            <CodeEditor code={module5Controller} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* Module 6: ReactiveMongoTemplate */}
      <section id="module-6-template" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Module 6: Advanced — ReactiveMongoTemplate
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Goal:</strong> When <code>findBy...</code> is not enough (e.g. dynamic filters: “price &gt; 100 AND category in [Tech, Home]”), use <strong><code>ReactiveMongoTemplate</code></strong> with <code>Query</code> and <code>Criteria</code> to build the query programmatically.
            </Text>
            <div className={styles.conceptImage}>
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Complex queries and analytics"
                width={800}
                height={400}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
              />
            </div>
            <CodeEditor code={module6Template} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* Capstone */}
      <section id="capstone-blog-engine" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Final Capstone: The Reactive Blog Engine
            </Heading>
            <Text className={styles.sectionDescription}>
              Combine everything: a mini blog backend with <strong>posts</strong> and <strong>comments</strong>.
            </Text>
            <Heading level={3} className={styles.categoryTitle}>
              Models
            </Heading>
            <CodeEditor code={capstoneModels} language="kotlin" readOnly height={260} />
            <Heading level={3} className={styles.categoryTitle}>
              Endpoints
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><code>POST /posts</code> — Create a post.</li>
              <li><code>GET /posts</code> — List all posts.</li>
              <li><code>{ENDPOINT_POST_ID}</code> — Get one post.</li>
              <li>
                <strong>Hard:</strong> <code>{ENDPOINT_POST_DETAILS}</code> — Return JSON with the post and all its comments.
                Use <code>Mono.zip</code> or <code>flatMap</code> and <code>collectList()</code> to combine them into a DTO.
              </li>
            </ul>
            <Text className={styles.sectionDescription}>
              <strong>Pro tip:</strong> Use <strong>DTOs</strong> for API responses. Don’t return <code>@Document</code> entities directly; that avoids leaking internal fields (e.g. passwords, version).
            </Text>
            <CodeEditor code={capstoneDetails} language="kotlin" readOnly height={280} />
            <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
              <Text className={styles.infoText}>
                Implement <code>PostRepository</code>, <code>CommentRepository</code>, <code>PostService</code>, and <code>PostController</code>. Add the <code>/details</code> endpoint using <code>findById</code> + <code>findByPostId</code> and combine into a <code>PostDetailsDto</code>.
              </Text>
            </div>
            <CodeEditor code={capstoneStarter} language="kotlin" readOnly height={220} />
          </Stack>
        </Card>
      </section>

      {/* Recap */}
      <section id="recap" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Recap: Key Takeaways
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>Reactive</strong> = non-blocking: thread sends the query and is released; data is pushed back via <code>Mono</code> / <code>Flux</code>.</li>
              <li><strong>@Document</strong> + Kotlin data classes model MongoDB collections; <code>@Id</code> nullable for Mongo-generated IDs.</li>
              <li><strong>ReactiveMongoRepository</strong> gives CRUD + derived queries (<code>findByX</code>); returns <code>Mono</code> / <code>Flux</code>.</li>
              <li>Service layer uses <strong>flatMap</strong>, <strong>switchIfEmpty</strong>, <strong>map</strong>; never block or unwrap.</li>
              <li>Controllers return <code>Mono</code> / <code>Flux</code>; WebFlux handles subscription and HTTP streaming.</li>
              <li>Complex queries → <strong>ReactiveMongoTemplate</strong> + <code>Query</code> / <code>Criteria</code>.</li>
              <li>Use <strong>DTOs</strong> for API responses; combine Post + Comments with <code>flatMap</code> and <code>collectList()</code>.</li>
            </ul>
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
