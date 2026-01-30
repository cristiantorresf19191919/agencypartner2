"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks (Gradle Kotlin DSL) ---
const firstBuildKts = `plugins {
  java
}

repositories {
  mavenCentral()
}

dependencies {
  testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}

tasks.test {
  useJUnitPlatform()
}`;

const customTaskKts = `tasks.register("hello") {
  group = "demo"
  description = "Prints hello"
  doLast {
    println("Hello from Gradle")
  }
}`;

const taskDepsKts = `tasks.register("taskA") {
  doLast { println("A") }
}

tasks.register("taskB") {
  dependsOn("taskA")
  doLast { println("B") }
}`;

const springBootKts = `plugins {
  id("org.springframework.boot") version "3.3.2"
  id("io.spring.dependency-management") version "1.1.6"
  kotlin("jvm") version "1.9.24"
  kotlin("plugin.spring") version "1.9.24"
}

group = "com.example"
version = "0.0.1"

java {
  toolchain {
    languageVersion.set(JavaLanguageVersion.of(21))
  }
}

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation(kotlin("reflect"))

  testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
  useJUnitPlatform()
}`;

const excludeTransitiveKts = `dependencies {
  implementation("some:lib:1.0") {
    exclude(group = "commons-logging", module = "commons-logging")
  }
}`;

const settingsSingleKts = `rootProject.name = "my-app"`;

const settingsMultiKts = `rootProject.name = "my-platform"
include("api", "service", "common")`;

const libsVersionsToml = `[versions]
springBoot = "3.3.2"
junit = "5.10.2"

[libraries]
junit = { module = "org.junit.jupiter:junit-jupiter", version.ref = "junit" }`;

const useLibsKts = `dependencies {
  testImplementation(libs.junit)
}`;

const gradleProperties = `org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true`;

const printVersionTaskKts = `tasks.register("printVersion") {
  doLast {
    println(version)
  }
}`;

export default function GradleZeroToHeroPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [answersOpen, setAnswersOpen] = useState(false);

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
          <li className={styles.breadcrumbCurrent}>Gradle From Zero to Hero</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Gradle From Zero to Hero (Practical Guide + Challenges)
        </Heading>
        <Text className={styles.subtitle}>
          A blog-style Gradle tutorial that takes you from zero to hero: install with the wrapper, recognize key files, write your first build script, create tasks, use plugins and dependencies, and master multi-module and version catalogs. All examples use the <strong>Kotlin DSL</strong> (<code>build.gradle.kts</code>). Challenges at the end evaluate your knowledge.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
            alt="Build and automation concept"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>What is Gradle (in one sentence):</strong> Gradle is a build automation tool that compiles code, runs tests, packages apps, manages dependencies, and can automate anything via tasks.
          </Text>
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
          <Text className={styles.infoText}>
            <strong>The 3 key ideas:</strong> (1) <strong>Projects</strong> — your build is one project or many (multi-module). (2) <strong>Tasks</strong> — Gradle runs tasks (compile, test, build, etc). (3) <strong>Plugins + Dependencies</strong> — plugins add capabilities; dependencies bring libraries.
          </Text>
        </div>
      </div>

      {/* 1) Install the right way: Gradle Wrapper */}
      <section id="install-wrapper" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              1) Install the right way: Gradle Wrapper
            </Heading>
            <Text className={styles.sectionDescription}>
              Never rely on &quot;whatever Gradle you have installed&quot;. Use the wrapper so the whole team uses the same Gradle version.
            </Text>
            <Text className={styles.sectionDescription}>
              Commands: <code>./gradlew --version</code>, <code>./gradlew tasks</code>, <code>./gradlew build</code>. Wrapper files: <code>gradlew</code>, <code>gradlew.bat</code>, <code>gradle/wrapper/gradle-wrapper.properties</code>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 2) Files you must recognize */}
      <section id="files-layout" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              2) Files you must recognize
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Kotlin DSL (recommended):</strong> <code>settings.gradle.kts</code>, <code>build.gradle.kts</code>, <code>gradle.properties</code>.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>Groovy DSL (older but common):</strong> <code>settings.gradle</code>, <code>build.gradle</code>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 3) Your first build script */}
      <section id="first-build" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              3) Your first build script (Java example)
            </Heading>
            <Text className={styles.sectionDescription}>
              Kotlin DSL: <code>build.gradle.kts</code>. Run <code>./gradlew test</code> and <code>./gradlew build</code>.
            </Text>
            <CodeEditor code={firstBuildKts} language="kotlin" readOnly height={280} />
          </Stack>
        </Card>
      </section>

      {/* 4) Tasks */}
      <section id="tasks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              4) Tasks: the core of Gradle
            </Heading>
            <Text className={styles.sectionDescription}>
              List tasks: <code>./gradlew tasks</code>. Run a task: <code>./gradlew test</code>. Create your own task (Kotlin DSL):
            </Text>
            <CodeEditor code={customTaskKts} language="kotlin" readOnly height={200} />
            <Text className={styles.sectionDescription}>
              Run: <code>./gradlew hello</code>. Task dependencies (run A before B):
            </Text>
            <CodeEditor code={taskDepsKts} language="kotlin" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* 5) Plugins */}
      <section id="plugins" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              5) Plugins: add &quot;powers&quot;
            </Heading>
            <Text className={styles.sectionDescription}>
              Plugins define conventions and tasks. Spring Boot + Kotlin example (real world) — <code>build.gradle.kts</code>:
            </Text>
            <CodeEditor code={springBootKts} language="kotlin" readOnly height={420} />
            <Text className={styles.sectionDescription}>
              Run: <code>./gradlew bootRun</code>, <code>./gradlew test</code>, <code>./gradlew bootJar</code>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 6) Dependencies */}
      <section id="dependencies" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              6) Dependencies: what you actually install
            </Heading>
            <Text className={styles.sectionDescription}>
              <strong>Common scopes:</strong> <code>implementation</code> (compile + runtime, not leaked to consumers), <code>api</code> (leaked to consumers, for libraries), <code>runtimeOnly</code> (runtime only), <code>testImplementation</code> (tests).
            </Text>
            <Text className={styles.sectionDescription}>
              See dependency tree: <code>./gradlew dependencies</code>, <code>./gradlew dependencyInsight --dependency jackson --configuration runtimeClasspath</code>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 7) Configurations */}
      <section id="configurations" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              7) Configurations: the &quot;buckets&quot; dependencies go into
            </Heading>
            <Text className={styles.sectionDescription}>
              Configs are named containers: <code>compileClasspath</code>, <code>runtimeClasspath</code>, <code>testRuntimeClasspath</code>. Example: exclude a transitive dependency:
            </Text>
            <CodeEditor code={excludeTransitiveKts} language="kotlin" readOnly height={160} />
          </Stack>
        </Card>
      </section>

      {/* 8) settings.gradle */}
      <section id="settings" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              8) settings.gradle: single vs multi-module
            </Heading>
            <Text className={styles.sectionDescription}>
              Single project — <code>settings.gradle.kts</code>:
            </Text>
            <CodeEditor code={settingsSingleKts} language="kotlin" readOnly height={80} />
            <Text className={styles.sectionDescription}>
              Multi-module:
            </Text>
            <CodeEditor code={settingsMultiKts} language="kotlin" readOnly height={100} />
            <Text className={styles.sectionDescription}>
              Each module has its own <code>build.gradle.kts</code>. Run <code>./gradlew build</code> for all; <code>./gradlew :service:test</code> for one module.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 9) Version catalogs */}
      <section id="version-catalogs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              9) Version catalogs (clean dependency versions)
            </Heading>
            <Text className={styles.sectionDescription}>
              Create <code>gradle/libs.versions.toml</code>:
            </Text>
            <CodeEditor code={libsVersionsToml} language="toml" readOnly height={180} />
            <Text className={styles.sectionDescription}>
              Use in <code>build.gradle.kts</code>:
            </Text>
            <CodeEditor code={useLibsKts} language="kotlin" readOnly height={100} />
            <Text className={styles.sectionDescription}>
              This prevents &quot;version soup&quot; across modules.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 10) Performance */}
      <section id="performance" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              10) Performance and build hygiene (senior moves)
            </Heading>
            <Text className={styles.sectionDescription}>
              Use the Gradle daemon (usually on by default). <code>gradle.properties</code>:
            </Text>
            <CodeEditor code={gradleProperties} language="properties" readOnly height={120} />
            <Text className={styles.sectionDescription}>
              Clean build: <code>./gradlew clean build</code>. Build scan (if enabled): <code>./gradlew build --scan</code>.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 11) Debugging */}
      <section id="debugging" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              11) Debugging when builds fail
            </Heading>
            <Text className={styles.sectionDescription}>
              Run with more info: <code>./gradlew build --info</code>, <code>./gradlew build --stacktrace</code>. Common causes: wrong Java version (fix via toolchain), missing repository (<code>mavenCentral()</code> not set), plugin version mismatch, dependency conflict (use <code>dependencyInsight</code>).
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Challenges */}
      <section id="challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Challenges (Test Yourself)
            </Heading>

            <Heading level={3} className={styles.categoryTitle}>
              Level 1 — Basics
            </Heading>
            <ol className={styles.challengeList} start={1}>
              <li>What&apos;s the purpose of the Gradle Wrapper and which command uses it?</li>
              <li>What&apos;s the difference between <code>build.gradle.kts</code> and <code>build.gradle</code>?</li>
              <li>How do you list all tasks and run only the test task?</li>
              <li>What does <code>{'repositories { mavenCentral() }'}</code> do?</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 2 — Real build skills
            </Heading>
            <ol className={styles.challengeList} start={5}>
              <li>Explain <code>implementation</code> vs <code>api</code> vs <code>runtimeOnly</code>.</li>
              <li>How do you see why a specific dependency version was chosen?</li>
              <li>Create a task <code>printVersion</code> that prints the project version.</li>
              <li>Make task B depend on task A. What keyword do you use?</li>
            </ol>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                <strong>Hint for #7:</strong> Use <code>tasks.register("printVersion")</code> and <code>{'doLast { println(version) }'}</code>.
              </Text>
            </div>
            <CodeEditor code={printVersionTaskKts} language="kotlin" readOnly height={140} />

            <Heading level={3} className={styles.categoryTitle}>
              Level 3 — Multi-module
            </Heading>
            <ol className={styles.challengeList} start={9}>
              <li>You have modules <code>api</code> and <code>service</code>. How do you run tests only for <code>service</code>?</li>
              <li>Where do you define included modules? (settings.gradle(.kts) question)</li>
              <li>How do you share common dependencies across modules cleanly?</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 4 — Senior-level Gradle
            </Heading>
            <ol className={styles.challengeList} start={12}>
              <li>A build is slow. Name 4 knobs or strategies to speed it up.</li>
              <li>You have a dependency conflict. What 2 Gradle commands do you use first?</li>
              <li>When would you choose Kotlin DSL over Groovy DSL (real reason)?</li>
            </ol>

            <button
              type="button"
              onClick={() => setAnswersOpen((v) => !v)}
              className={styles.answerKeyToggle}
              aria-expanded={answersOpen}
            >
              {answersOpen ? "▼ Hide" : "▶ Show"} optional answer key
            </button>
            {answersOpen && (
              <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
                <div className={styles.infoText}>
                  <strong>Answer key (don&apos;t read until you try):</strong>
                  <ol start={1} style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                    <li>Ensures same Gradle version for everyone; use <code>./gradlew ...</code></li>
                    <li>Kotlin vs Groovy DSL</li>
                    <li><code>./gradlew tasks</code>, <code>./gradlew test</code></li>
                    <li>Tells Gradle where to download dependencies from</li>
                    <li><code>implementation</code> internal, <code>api</code> exposed to consumers, <code>runtimeOnly</code> runtime only</li>
                    <li><code>dependencyInsight</code></li>
                    <li><code>tasks.register("printVersion") {"{ doLast { println(version) } }"}</code></li>
                    <li><code>dependsOn(...)</code></li>
                    <li><code>./gradlew :service:test</code></li>
                    <li><code>settings.gradle.kts</code> with <code>include(...)</code></li>
                    <li>Root build + convention plugins or version catalogs</li>
                    <li>Daemon/parallel/build cache/config cache, reduce work, avoid dynamic versions, keep tasks incremental</li>
                    <li><code>dependencies</code> + <code>dependencyInsight</code></li>
                    <li>Better IDE support + type safety + refactoring friendliness</li>
                  </ol>
                </div>
              </div>
            )}
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
          href={createLocalizedPath("/developer-section/blog/category/build-tools")}
          variant="primary"
        >
          Build Tools →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
