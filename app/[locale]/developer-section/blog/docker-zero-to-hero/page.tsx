"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import { getCategoryForPost } from "@/lib/blogCategories";

// --- Code blocks ---
const installVerify = `# After installing Docker Desktop:

docker --version
docker info
docker run hello-world

# If hello-world runs, you're good.`;
const firstContainer = `# Run nginx web server
docker run --name mynginx -p 8080:80 -d nginx:alpine

# Open: http://localhost:8080

# Stop and remove
docker stop mynginx
docker rm mynginx

# Key flags:
# -p 8080:80  → maps host port → container port
# -d          → detached mode (runs in background)
# --name      → names the container`;
const mustKnowCommands = `# See what's running
docker ps
docker ps -a

# Logs
docker logs -f mynginx

# Execute a shell inside container
docker exec -it mynginx sh

# Images
docker images
docker pull node:20-alpine
docker rmi node:20-alpine

# Remove all stopped containers quickly
docker container prune`;
const serverJs = `const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, message: "Hello from Docker", path: req.url }));
});

server.listen(port, () => {
  console.log(\`Server listening on \${port}\`);
});`;
const packageJson = `{
  "name": "docker-node-demo",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js"
  }
}`;
const dockerfileNode = `FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]`;
const buildRun = `# Build the image
docker build -t docker-node-demo:1.0 .

# Run it
docker run --name node-demo -p 3000:3000 -d docker-node-demo:1.0

# Test
curl http://localhost:3000`;
const envVars = `# Run with a different port
docker run --rm -e PORT=4000 -p 4000:4000 docker-node-demo:1.0`;
const volumesPostgres = `# Create a named volume
docker volume create pgdata

# Run Postgres with the volume
docker run --name pg \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_USER=app \\
  -e POSTGRES_DB=appdb \\
  -p 5432:5432 \\
  -v pgdata:/var/lib/postgresql/data \\
  -d postgres:16-alpine

# If you remove the container and recreate it, the database stays.`;
const networking = `# Create a network
docker network create app-net

# Run Postgres on that network
docker run --name pg \\
  --network app-net \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_USER=app \\
  -e POSTGRES_DB=appdb \\
  -d postgres:16-alpine

# Any container on app-net can reach Postgres using hostname: pg`;
const dockerComposeYml = `services:
  api:
    build: .
    container_name: node-demo
    environment:
      - PORT=3000
      - DATABASE_URL=postgres://app:secret@db:5432/appdb
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    container_name: postgres-db
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_USER=app
      - POSTGRES_DB=appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`;
const composeCommands = `# Run
docker compose up -d --build
docker compose ps
docker compose logs -f api

# Stop
docker compose down

# Remove everything including volumes (careful, deletes DB data)
docker compose down -v`;
const multiStageDockerfile = `# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runtime (smaller image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "start"]

# Big win: cleaner, smaller runtime image.`;

export default function DockerZeroToHeroPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const category = getCategoryForPost("docker-zero-to-hero");

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
          {category && (
            <>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li>
                <ButtonLink
                  href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)}
                  variant="secondary"
                  className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
                >
                  {category.title}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Docker from Zero to Hero</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Docker from Zero to Hero (Practical Tutorial)
        </Heading>
        <Text className={styles.subtitle}>
          Docker lets you package an app and its dependencies into a container so it runs the same on your laptop, your teammate&apos;s laptop, and production. This tutorial covers images, containers, Dockerfile, volumes, networking, Docker Compose, and multi-stage builds—with code editor examples and hands-on challenges at the end to evaluate your knowledge.
        </Text>
        <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
          <Text className={styles.infoText}>
            <strong>Concepts:</strong> Image (blueprint), Container (running instance), Dockerfile (recipe), Registry (Docker Hub, GHCR), Volume (persistent data), Network (containers talking), Docker Compose (multi-container system).
          </Text>
        </div>
      </div>

      {/* 1) What Docker is */}
      <section id="what-docker-is" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              1. What Docker Actually Is (In Plain Words)
            </Heading>
            <Text className={styles.sectionDescription}>
              Docker packages your app and its dependencies into a <strong>container</strong> so it runs identically everywhere. An <strong>image</strong> is the blueprint (snapshot/template); a <strong>container</strong> is a running instance. You define images with a <strong>Dockerfile</strong>. Images are stored in a <strong>registry</strong> (Docker Hub, GHCR). <strong>Volumes</strong> give you persistent data; <strong>networks</strong> let containers talk to each other. <strong>Docker Compose</strong> runs multiple containers as one system.
            </Text>
          </Stack>
        </Card>
      </section>

      <section id="install-verify" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              2. Install + Verify
            </Heading>
            <Text className={styles.sectionDescription}>
              After installing Docker Desktop, run these commands. If <code>hello-world</code> runs, you&apos;re good.
            </Text>
            <CodeEditor code={installVerify} language="bash" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* 3) First container */}
      <section id="first-container" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              3. Your First Container (No Code)
            </Heading>
            <Text className={styles.sectionDescription}>
              Run an nginx web server, open http://localhost:8080, then stop and remove the container. Key flags: <code>-p 8080:80</code> maps host port to container port, <code>-d</code> is detached mode, <code>--name</code> names the container.
            </Text>
            <CodeEditor code={firstContainer} language="bash" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* 4) Must-know commands */}
      <section id="must-know-commands" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              4. Must-Know Commands
            </Heading>
            <Text className={styles.sectionDescription}>
              See what&apos;s running, follow logs, exec into a container, manage images, and prune stopped containers.
            </Text>
            <CodeEditor code={mustKnowCommands} language="bash" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      {/* 5) Build your own image */}
      <section id="build-your-own-image" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              5. Build Your Own Image (Node.js Example)
            </Heading>
            <Text className={styles.sectionDescription}>
              Create a folder <code>docker-node-demo</code> with <code>server.js</code>, <code>package.json</code>, and a <strong>Dockerfile</strong>. Then build and run the image.
            </Text>
            <Text className={styles.sectionDescription}>
              <strong>server.js</strong> — simple HTTP server that returns JSON:
            </Text>
            <CodeEditor code={serverJs} language="javascript" readOnly height={220} />
            <Text className={styles.sectionDescription}>
              <strong>package.json</strong>:
            </Text>
            <CodeEditor code={packageJson} language="json" readOnly height={140} />
            <Text className={styles.sectionDescription}>
              <strong>Dockerfile</strong>:
            </Text>
            <CodeEditor code={dockerfileNode} language="dockerfile" readOnly height={220} />
            <Text className={styles.sectionDescription}>
              <strong>Build and run</strong>:
            </Text>
            <CodeEditor code={buildRun} language="bash" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* 6) Environment variables */}
      <section id="environment-variables" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              6. Environment Variables
            </Heading>
            <Text className={styles.sectionDescription}>
              Run the same image with a different port using <code>-e PORT=4000</code> and <code>-p 4000:4000</code>.
            </Text>
            <CodeEditor code={envVars} language="bash" readOnly height={100} />
          </Stack>
        </Card>
      </section>

      {/* 7) Volumes */}
      <section id="volumes" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              7. Volumes (Persistent Data)
            </Heading>
            <Text className={styles.sectionDescription}>
              Containers are disposable. Volumes keep your data safe. Example: run Postgres with a named volume. If you remove the container and recreate it, the database stays.
            </Text>
            <CodeEditor code={volumesPostgres} language="bash" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* 8) Networking */}
      <section id="networking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              8. Networking (Containers Talking to Each Other)
            </Heading>
            <Text className={styles.sectionDescription}>
              Create a network, run Postgres on it. Any container on <code>app-net</code> can reach Postgres using hostname <code>pg</code>.
            </Text>
            <CodeEditor code={networking} language="bash" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      {/* 9) Docker Compose */}
      <section id="docker-compose" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              9. Docker Compose (Real-World Workflow)
            </Heading>
            <Text className={styles.sectionDescription}>
              Define <code>docker-compose.yml</code> with <code>api</code> and <code>db</code> services. The API uses <code>DATABASE_URL=postgres://app:secret@db:5432/appdb</code> to connect to the database by hostname <code>db</code>.
            </Text>
            <CodeEditor code={dockerComposeYml} language="yaml" readOnly height={380} />
            <Text className={styles.sectionDescription}>
              <strong>Commands</strong>:
            </Text>
            <CodeEditor code={composeCommands} language="bash" readOnly height={220} />
          </Stack>
        </Card>
      </section>

      {/* 10) Multi-stage builds */}
      <section id="multi-stage-builds" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              10. Multi-Stage Builds (Smaller Images) — Next.js Style
            </Heading>
            <Text className={styles.sectionDescription}>
              Avoid shipping your whole build toolchain. Use <strong>deps</strong> for installing dependencies, <strong>builder</strong> for building, and <strong>runner</strong> for the minimal runtime image. Big win: cleaner, smaller runtime image.
            </Text>
            <CodeEditor code={multiStageDockerfile} language="dockerfile" readOnly height={340} />
          </Stack>
        </Card>
      </section>

      {/* 11) Docker mindset */}
      <section id="docker-mindset" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              11. A Docker Mindset
            </Heading>
            <Text className={styles.sectionDescription}>
              If you&apos;re not using Docker for local dev and CI, you&apos;re accepting &quot;works on my machine&quot; as a lifestyle. Docker is one of the best ROI tools you can learn as a developer.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Challenges */}
      <section id="challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Challenges (Evaluate Your Knowledge)
            </Heading>
            <Text className={styles.sectionDescription}>
              Complete these in order. Use your terminal and the examples above. Solutions are not provided—try them yourself first.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>
              Level 1 — Basics
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li>Run nginx on port 9090 and confirm it in the browser.</li>
              <li>List all containers (including stopped).</li>
              <li>Remove all stopped containers using one command.</li>
              <li>Pull <code>redis:alpine</code> and run it detached with the name <code>cache</code>.</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 2 — Build & Debug
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li>Build the Node app image and run it on port 3000.</li>
              <li>Enter the running container and print current directory and files.</li>
              <li>Show logs of the app container, then follow logs live.</li>
              <li>Run the same image but change <code>PORT</code> to 5000.</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 3 — Volumes & Persistence
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li>Run Postgres with a named volume <code>pgdata</code>, create a DB table, delete the container, recreate it, and confirm the table still exists.</li>
              <li>Explain the difference between bind mount vs named volume in your own words.</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 4 — Compose & Networking
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li>Create a compose file with <code>api</code> and <code>db</code> as in the tutorial and run them.</li>
              <li>Prove that <code>api</code> can reach <code>db</code> using hostname <code>db</code>.</li>
              <li>Stop the system but keep DB data, then restart and confirm data still exists.</li>
              <li>Bring it down and delete volumes too; confirm data is gone.</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>
              Level 5 — Real-World Pro (Multi-Stage)
            </Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li>Write a multi-stage Dockerfile for a Next.js app that results in a smaller runtime image.</li>
              <li>Explain what each stage is doing and why.</li>
            </ol>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                Once you complete a level, move to the next. For Level 3–4, use <code>docker exec</code> or a DB client to verify tables and connectivity.
              </Text>
            </div>
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
        {category && (
          <ButtonLink
            href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)}
            variant="primary"
          >
            {category.title} →
          </ButtonLink>
        )}
      </nav>
    </BlogContentLayout>
  );
}
