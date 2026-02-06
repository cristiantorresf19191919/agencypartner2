"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import { getCategoryForPost } from "@/lib/blogCategories";

// ==========================================
// SECTION 1: INTRODUCTION & CONCEPTS
// ==========================================

const whatIsDocker = `# Docker is NOT a virtual machine!
# Docker = Application Containerization Platform

# Key differences from VMs:
# - VMs virtualize HARDWARE (full OS per VM)
# - Containers virtualize the OS (share kernel)
# - Containers are LIGHTWEIGHT (MBs vs GBs)
# - Containers start in SECONDS (vs minutes)

# The problem Docker solves:
# "Works on my machine" → "Works EVERYWHERE"

# Your app + dependencies = Container
# Runs identically on:
# - Your laptop (macOS/Windows/Linux)
# - CI/CD pipeline
# - Production servers
# - Cloud platforms (AWS, GCP, Azure)`;

const dockerTerminology = `# Essential Docker Terminology

# IMAGE
# - Blueprint/template for containers
# - Read-only, immutable
# - Built from a Dockerfile
# - Stored in registries (Docker Hub, GHCR, ECR)
# - Has layers (each instruction = layer)

# CONTAINER
# - Running instance of an image
# - Isolated process with its own filesystem
# - Can be started, stopped, removed
# - Ephemeral by default (data lost when removed)

# DOCKERFILE
# - Text file with instructions to build an image
# - Each instruction creates a layer
# - Defines base image, files, commands, ports

# REGISTRY
# - Storage for Docker images
# - Docker Hub (public), GHCR, AWS ECR, Google GCR
# - Push/pull images like git push/pull

# VOLUME
# - Persistent data storage
# - Survives container removal
# - Can be shared between containers

# NETWORK
# - Virtual network for containers
# - Containers on same network can communicate
# - Isolation from host and other networks`;

// ==========================================
// SECTION 2: INSTALLATION & VERIFICATION
// ==========================================

const installDocker = `# Installation varies by OS:

# macOS / Windows:
# Download Docker Desktop from https://docker.com/products/docker-desktop
# Install and start Docker Desktop

# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add yourself to docker group (avoids sudo):
sudo usermod -aG docker $USER
# Log out and back in for this to take effect

# Verify installation:
docker --version
# Docker version 24.0.7, build afdd53b

docker compose version
# Docker Compose version v2.23.0`;

const verifyInstallation = `# Verify Docker is working correctly:

# 1. Check Docker daemon is running
docker info

# 2. Run the hello-world test container
docker run hello-world

# Expected output:
# Hello from Docker!
# This message shows that your installation appears to be working correctly.

# 3. Check Docker Compose
docker compose version

# If all commands work, you're ready to go!`;

// ==========================================
// SECTION 3: BASIC COMMANDS
// ==========================================

const dockerRunBasics = `# docker run - The most important command
# Syntax: docker run [OPTIONS] IMAGE [COMMAND]

# Run nginx web server (foreground)
docker run nginx

# Run in DETACHED mode (background) with -d
docker run -d nginx

# Give it a NAME with --name
docker run -d --name my-nginx nginx

# Map PORTS with -p (host:container)
docker run -d -p 8080:80 --name my-nginx nginx
# Access at http://localhost:8080

# Run and REMOVE automatically when stopped
docker run --rm -d -p 8080:80 nginx

# Run with ENVIRONMENT variables
docker run -d -e MY_VAR=value nginx

# Run with a specific TAG (version)
docker run -d nginx:1.25-alpine

# Run INTERACTIVELY with -it (for debugging)
docker run -it ubuntu bash
# You're now inside the container!`;

const containerManagement = `# ========== CONTAINER MANAGEMENT ==========

# List RUNNING containers
docker ps

# List ALL containers (including stopped)
docker ps -a

# Stop a container (graceful shutdown)
docker stop my-nginx

# Start a stopped container
docker start my-nginx

# Restart a container
docker restart my-nginx

# Kill a container (force stop)
docker kill my-nginx

# Remove a container (must be stopped first)
docker rm my-nginx

# Force remove a running container
docker rm -f my-nginx

# Remove ALL stopped containers
docker container prune

# Remove ALL containers (running and stopped)
docker rm -f $(docker ps -aq)`;

const containerInspection = `# ========== INSPECT & DEBUG ==========

# View container logs
docker logs my-nginx

# Follow logs in real-time (like tail -f)
docker logs -f my-nginx

# Show last 100 lines
docker logs --tail 100 my-nginx

# Show logs with timestamps
docker logs -t my-nginx

# Execute command INSIDE running container
docker exec my-nginx ls -la

# Get interactive shell inside container
docker exec -it my-nginx /bin/bash
# Or for Alpine images:
docker exec -it my-nginx /bin/sh

# Inspect container details (JSON output)
docker inspect my-nginx

# Get specific field from inspect
docker inspect --format='{{.NetworkSettings.IPAddress}}' my-nginx

# Show container resource usage
docker stats

# Show processes inside container
docker top my-nginx`;

const imageManagement = `# ========== IMAGE MANAGEMENT ==========

# List all local images
docker images

# Pull an image from registry
docker pull nginx
docker pull nginx:1.25-alpine
docker pull node:20-alpine

# Search for images on Docker Hub
docker search nginx

# Remove an image
docker rmi nginx

# Remove unused images
docker image prune

# Remove ALL images
docker rmi $(docker images -q)

# Tag an image (for pushing to registry)
docker tag my-app:latest myregistry/my-app:v1.0

# Push to registry (must be logged in)
docker push myregistry/my-app:v1.0

# Login to Docker Hub
docker login

# Login to other registries
docker login ghcr.io
docker login ecr.aws`;

// ==========================================
// SECTION 4: DOCKERFILE DEEP DIVE
// ==========================================

const dockerfileBasics = `# ========== DOCKERFILE BASICS ==========
# A Dockerfile is a recipe to build an image

# FROM - Base image (REQUIRED, must be first)
FROM node:20-alpine

# WORKDIR - Set working directory (creates if not exists)
WORKDIR /app

# COPY - Copy files from host to image
COPY package.json ./
COPY . .

# ADD - Like COPY, but can also:
# - Extract tar archives
# - Download from URLs (not recommended)
ADD archive.tar.gz /app/

# RUN - Execute commands during build
RUN npm install
RUN apt-get update && apt-get install -y curl

# ENV - Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# ARG - Build-time variables (not available at runtime)
ARG VERSION=1.0
RUN echo "Building version $VERSION"

# EXPOSE - Document which ports the container listens on
# (doesn't actually publish the port!)
EXPOSE 3000

# CMD - Default command when container starts
# Only ONE CMD per Dockerfile (last one wins)
CMD ["npm", "start"]

# ENTRYPOINT - Like CMD, but harder to override
ENTRYPOINT ["npm"]
CMD ["start"]
# Running: docker run my-app test → runs "npm test"`;

const dockerfileNodeExample = `# Production-ready Node.js Dockerfile
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \\
    npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (documentation)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]`;

const dockerfilePythonExample = `# Production-ready Python Dockerfile
FROM python:3.12-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]`;

const dockerfileGoExample = `# Production-ready Go Dockerfile (multi-stage)
# Stage 1: Build
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go mod files first
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
# CGO_ENABLED=0 for static binary
# -ldflags="-w -s" strips debug info (smaller binary)
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server .

# Stage 2: Runtime (minimal image)
FROM scratch

# Copy SSL certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the binary
COPY --from=builder /app/server /server

# Expose port
EXPOSE 8080

# Run as non-root (numeric UID for scratch)
USER 65534

# Run the binary
ENTRYPOINT ["/server"]`;

const dockerfileBestPractices = `# ========== DOCKERFILE BEST PRACTICES ==========

# 1. Use specific base image tags (not :latest)
# BAD:
FROM node:latest

# GOOD:
FROM node:20.11-alpine3.19

# 2. Order instructions by change frequency
# (less frequent changes first for better caching)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./      # Changes less often
RUN npm ci
COPY . .                   # Changes more often

# 3. Combine RUN commands (fewer layers)
# BAD:
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# GOOD:
RUN apt-get update && apt-get install -y \\
    curl \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# 4. Use .dockerignore
# Create .dockerignore file:
# node_modules
# .git
# .env
# *.log
# Dockerfile
# docker-compose.yml

# 5. Don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 6. Use COPY instead of ADD (unless you need tar extraction)

# 7. Use multi-stage builds for smaller images

# 8. Set proper labels
LABEL maintainer="you@example.com"
LABEL version="1.0"
LABEL description="My awesome app"`;

const dockerignoreExample = `# .dockerignore - Files to exclude from build context

# Dependencies
node_modules
npm-debug.log
yarn-error.log

# Build outputs
dist
build
*.egg-info

# Version control
.git
.gitignore
.svn

# IDE and editors
.idea
.vscode
*.swp
*.swo

# Environment and secrets
.env
.env.local
.env.*.local
*.pem
*.key

# Docker files (not needed in image)
Dockerfile*
docker-compose*
.dockerignore

# Documentation
README.md
docs
*.md

# Tests
tests
__tests__
*.test.js
*.spec.js
coverage

# Misc
.DS_Store
Thumbs.db
*.log`;

// ==========================================
// SECTION 5: IMAGE LAYERS & CACHING
// ==========================================

const imageLayers = `# ========== UNDERSTANDING IMAGE LAYERS ==========

# Each Dockerfile instruction creates a LAYER
# Layers are cached and reused

# Example Dockerfile:
FROM node:20-alpine          # Layer 1: Base image
WORKDIR /app                 # Layer 2: Set workdir
COPY package.json ./         # Layer 3: Copy package.json
RUN npm install              # Layer 4: Install deps
COPY . .                     # Layer 5: Copy source
CMD ["npm", "start"]         # Layer 6: Set command

# View image layers:
docker history my-app:latest

# Key caching rules:
# 1. If a layer changes, ALL subsequent layers rebuild
# 2. COPY/ADD invalidate cache if file contents change
# 3. RUN commands always produce same layer if command unchanged

# This is why we copy package.json BEFORE source code:
# - package.json rarely changes
# - source code changes often
# - npm install layer is cached when package.json unchanged`;

const buildCacheOptimization = `# ========== BUILD CACHE OPTIMIZATION ==========

# Build with cache (default)
docker build -t my-app .

# Build without cache (force rebuild)
docker build --no-cache -t my-app .

# See cache usage during build
docker build --progress=plain -t my-app .

# Use BuildKit for better caching (recommended)
DOCKER_BUILDKIT=1 docker build -t my-app .

# Mount cache for package managers (BuildKit feature)
# Dockerfile:
# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
CMD ["npm", "start"]

# This caches npm packages between builds!`;

// ==========================================
// SECTION 6: VOLUMES & PERSISTENCE
// ==========================================

const volumeTypes = `# ========== VOLUME TYPES ==========

# 1. NAMED VOLUMES (recommended for data)
# Managed by Docker, stored in Docker's storage area
docker volume create mydata
docker run -v mydata:/app/data my-app

# 2. BIND MOUNTS (for development)
# Maps host directory to container directory
docker run -v /host/path:/container/path my-app
docker run -v $(pwd):/app my-app

# 3. TMPFS MOUNTS (temporary, in memory)
# Data only exists while container runs
docker run --tmpfs /app/temp my-app

# Key differences:
# Named Volume: Docker manages location, good for databases
# Bind Mount: You control location, good for dev (live reload)
# tmpfs: In memory only, good for secrets/temp files`;

const volumeManagement = `# ========== VOLUME MANAGEMENT ==========

# Create a named volume
docker volume create mydata

# List all volumes
docker volume ls

# Inspect a volume (see where it's stored)
docker volume inspect mydata

# Remove a volume (fails if in use)
docker volume rm mydata

# Remove ALL unused volumes
docker volume prune

# Run container with named volume
docker run -d \\
    --name postgres-db \\
    -v pgdata:/var/lib/postgresql/data \\
    -e POSTGRES_PASSWORD=secret \\
    postgres:16

# The data persists even if container is removed!
docker rm -f postgres-db
docker run -d \\
    --name postgres-db-new \\
    -v pgdata:/var/lib/postgresql/data \\
    -e POSTGRES_PASSWORD=secret \\
    postgres:16
# Your data is still there!`;

const bindMountDev = `# ========== BIND MOUNTS FOR DEVELOPMENT ==========

# Mount current directory for live code reload
docker run -d \\
    --name dev-app \\
    -p 3000:3000 \\
    -v $(pwd):/app \\
    -v /app/node_modules \\
    node:20-alpine npm run dev

# The second -v creates an anonymous volume for node_modules
# This prevents host node_modules from overwriting container's

# Read-only bind mount (container can't modify)
docker run -v $(pwd)/config:/app/config:ro my-app

# Common development setup:
docker run -d \\
    --name my-dev \\
    -p 3000:3000 \\
    -v $(pwd)/src:/app/src \\
    -v $(pwd)/public:/app/public \\
    -e NODE_ENV=development \\
    my-app`;

// ==========================================
// SECTION 7: NETWORKING
// ==========================================

const networkingBasics = `# ========== DOCKER NETWORKING BASICS ==========

# Docker network types:
# 1. bridge (default) - Isolated network on host
# 2. host - Use host's network directly
# 3. none - No networking
# 4. overlay - Multi-host networking (Swarm)

# List networks
docker network ls

# Create a custom bridge network
docker network create my-network

# Inspect a network
docker network inspect my-network

# Remove a network
docker network rm my-network

# Remove all unused networks
docker network prune`;

const containerCommunication = `# ========== CONTAINERS TALKING TO EACH OTHER ==========

# Create a network for your app
docker network create app-network

# Run database on the network
docker run -d \\
    --name postgres \\
    --network app-network \\
    -e POSTGRES_PASSWORD=secret \\
    -e POSTGRES_USER=app \\
    -e POSTGRES_DB=myapp \\
    postgres:16

# Run your app on the same network
docker run -d \\
    --name api \\
    --network app-network \\
    -p 3000:3000 \\
    -e DATABASE_URL=postgres://app:secret@postgres:5432/myapp \\
    my-app

# Key insight: Container name = hostname on the network
# 'api' can reach 'postgres' using hostname 'postgres'

# Connect existing container to network
docker network connect app-network existing-container

# Disconnect from network
docker network disconnect app-network existing-container`;

const portMapping = `# ========== PORT MAPPING ==========

# Syntax: -p HOST_PORT:CONTAINER_PORT

# Map port 8080 on host to 80 in container
docker run -p 8080:80 nginx

# Map multiple ports
docker run -p 8080:80 -p 8443:443 nginx

# Map to specific host interface
docker run -p 127.0.0.1:8080:80 nginx  # localhost only
docker run -p 0.0.0.0:8080:80 nginx    # all interfaces

# Random host port (Docker chooses)
docker run -p 80 nginx
# Check which port was assigned:
docker port container_name

# Expose all ports defined in Dockerfile
docker run -P nginx

# UDP port mapping
docker run -p 53:53/udp dns-server`;

// ==========================================
// SECTION 8: DOCKER COMPOSE
// ==========================================

const composeBasics = `# docker-compose.yml - Define multi-container apps
# File: docker-compose.yml

services:
  # Web application
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://app:secret@db:5432/myapp
    depends_on:
      - db
      - redis
    restart: unless-stopped

  # PostgreSQL database
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

# Named volumes (persist data)
volumes:
  pgdata:`;

const composeCommands = `# ========== DOCKER COMPOSE COMMANDS ==========

# Start all services (detached)
docker compose up -d

# Start and rebuild images
docker compose up -d --build

# Start specific service
docker compose up -d web

# Stop all services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (deletes data!)
docker compose down -v

# View running services
docker compose ps

# View logs
docker compose logs
docker compose logs -f web    # Follow specific service

# Execute command in service
docker compose exec web sh

# Scale a service
docker compose up -d --scale web=3

# Pull latest images
docker compose pull

# Build images without starting
docker compose build`;

const composeAdvanced = `# Advanced docker-compose.yml features

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
    image: my-api:latest
    container_name: my-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    networks:
      - frontend
      - backend
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - backend

networks:
  frontend:
  backend:
    driver: bridge

volumes:
  pgdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt`;

const composeProfiles = `# Compose profiles - Enable services conditionally

services:
  web:
    build: .
    ports:
      - "3000:3000"

  db:
    image: postgres:16-alpine
    profiles:
      - dev
      - production

  redis:
    image: redis:7-alpine
    profiles:
      - dev
      - production

  # Only for development
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles:
      - dev

  # Only for debugging
  debug:
    build:
      context: .
      dockerfile: Dockerfile.debug
    profiles:
      - debug

# Usage:
# docker compose up                    # Only 'web' (no profile)
# docker compose --profile dev up      # web + db + redis + adminer
# docker compose --profile debug up    # web + debug`;

// ==========================================
// SECTION 9: MULTI-STAGE BUILDS
// ==========================================

const multiStageBasics = `# ========== MULTI-STAGE BUILDS ==========
# Build in one stage, run in another = smaller images

# Stage 1: Build dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only production files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

USER nextjs
EXPOSE 3000
CMD ["node", "dist/index.js"]`;

const multiStageNextjs = `# Optimized Next.js Dockerfile (from official example)
FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]`;

const multiStageReact = `# Optimized React (Vite/CRA) Dockerfile
# Build with Node, serve with Nginx

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;

const nginxConfigReact = `# nginx.conf - For React SPA routing

server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}`;

// ==========================================
// SECTION 10: SECURITY BEST PRACTICES
// ==========================================

const securityBestPractices = `# ========== DOCKER SECURITY BEST PRACTICES ==========

# 1. Never run as root
FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 2. Use official/verified images
FROM node:20-alpine          # Official
FROM bitnami/postgresql      # Verified publisher

# 3. Scan images for vulnerabilities
docker scout cves my-image
docker scout quickview my-image

# 4. Use specific image tags, not :latest
FROM node:20.11.1-alpine3.19

# 5. Don't store secrets in images
# BAD:
ENV API_KEY=mysecret

# GOOD: Use Docker secrets or env at runtime
docker run -e API_KEY=$API_KEY my-app

# 6. Use multi-stage builds (smaller attack surface)

# 7. Set read-only filesystem where possible
docker run --read-only my-app

# 8. Drop unnecessary capabilities
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE my-app

# 9. Use no-new-privileges flag
docker run --security-opt=no-new-privileges my-app

# 10. Keep images updated
docker pull node:20-alpine  # Get security patches`;

const secretsManagement = `# ========== MANAGING SECRETS ==========

# Method 1: Environment variables (simplest)
docker run -e DATABASE_PASSWORD=secret my-app

# Method 2: Environment file
# .env file:
# DATABASE_PASSWORD=secret
# API_KEY=mykey
docker run --env-file .env my-app

# Method 3: Docker secrets (Compose)
# docker-compose.yml:
services:
  app:
    secrets:
      - db_password
secrets:
  db_password:
    file: ./secrets/db_password.txt

# In container, secret is at /run/secrets/db_password

# Method 4: External secret managers
# - HashiCorp Vault
# - AWS Secrets Manager
# - Google Secret Manager
# - Azure Key Vault

# Never commit secrets to git!
# Add to .gitignore:
# .env
# .env.local
# secrets/`;

// ==========================================
// SECTION 11: PRODUCTION CONSIDERATIONS
// ==========================================

const productionTips = `# ========== PRODUCTION TIPS ==========

# 1. Always use health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:3000/health || exit 1

# 2. Set resource limits (prevent runaway containers)
docker run --memory=512m --cpus=0.5 my-app

# In Compose:
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M

# 3. Use restart policies
docker run --restart=unless-stopped my-app
# Options: no, on-failure, always, unless-stopped

# 4. Log to stdout/stderr (Docker handles rotation)
# Don't write logs to files inside container

# 5. Use .dockerignore to speed up builds

# 6. Tag images properly
docker tag my-app:latest my-app:v1.2.3
docker tag my-app:latest my-app:$(git rev-parse --short HEAD)

# 7. Use Docker BuildKit
DOCKER_BUILDKIT=1 docker build -t my-app .`;

const loggingMonitoring = `# ========== LOGGING & MONITORING ==========

# View container logs
docker logs my-app
docker logs -f my-app           # Follow
docker logs --tail 100 my-app   # Last 100 lines
docker logs --since 1h my-app   # Last hour

# Configure logging driver
docker run --log-driver json-file \\
    --log-opt max-size=10m \\
    --log-opt max-file=3 \\
    my-app

# In Compose:
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

# View resource usage
docker stats
docker stats my-app

# Monitor container events
docker events

# Inspect container processes
docker top my-app

# Export metrics (for Prometheus)
# Use cAdvisor: https://github.com/google/cadvisor`;

// ==========================================
// SECTION 12: COMMON PROBLEMS & SOLUTIONS
// ==========================================

const troubleshooting = `# ========== TROUBLESHOOTING ==========

# Problem: Container exits immediately
# Solution: Check logs
docker logs my-app
# Run interactively to debug:
docker run -it my-app sh

# Problem: Can't connect to container
# Solution: Check port mapping
docker port my-app
docker inspect my-app | grep -A 10 "Ports"

# Problem: Permission denied
# Solution: Check user/group
docker exec my-app id
docker exec my-app ls -la /app

# Problem: Out of disk space
# Solution: Clean up
docker system prune -a --volumes

# Problem: Slow builds
# Solution: Optimize Dockerfile, use .dockerignore
# Check layer sizes:
docker history my-app

# Problem: Image too large
# Solution: Multi-stage builds, smaller base images
# Use Alpine variants: node:20-alpine instead of node:20

# Problem: Container can't resolve hostname
# Solution: Check network
docker network inspect bridge
docker inspect my-app | grep -A 5 "Networks"`;

const cleanup = `# ========== CLEANUP COMMANDS ==========

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove unused images (including tagged)
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove EVERYTHING unused (containers, images, volumes, networks)
docker system prune -a --volumes

# View disk usage
docker system df

# View detailed disk usage
docker system df -v`;

// ==========================================
// CHALLENGES - MORE EXTENSIVE
// ==========================================

const challengeLevel1 = `# ========== CHALLENGE LEVEL 1: BASICS ==========

# 1. Run nginx on port 9090 and verify it works
#    Expected: Browser shows "Welcome to nginx!"

# 2. Run the container in detached mode with name "my-web"

# 3. View the logs of my-web

# 4. Stop my-web, then start it again

# 5. Remove my-web container

# 6. Pull redis:alpine and run it as "my-cache" on port 6379

# 7. Execute "redis-cli ping" inside my-cache
#    Expected output: PONG

# 8. List all containers (running and stopped)

# 9. Remove all stopped containers with one command

# 10. Check Docker disk usage`;

const challengeLevel2 = `# ========== CHALLENGE LEVEL 2: BUILDING IMAGES ==========

# Create a project folder with these files:

# --- server.js ---
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from Docker!',
    timestamp: new Date().toISOString()
  }));
});
server.listen(port, () => console.log(\`Server on port \${port}\`));

# --- package.json ---
{
  "name": "docker-demo",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" }
}

# TASKS:
# 1. Write a Dockerfile for this app
# 2. Build the image with tag "my-api:1.0"
# 3. Run it on port 3000
# 4. Test with: curl http://localhost:3000
# 5. Run another instance on port 4000 using -e PORT=4000
# 6. Enter the container and view files
# 7. View the image layers with docker history`;

const challengeLevel3 = `# ========== CHALLENGE LEVEL 3: PERSISTENCE ==========

# 1. Create a named volume "mydata"

# 2. Run postgres with this volume:
#    - Volume: mydata:/var/lib/postgresql/data
#    - Name: my-postgres
#    - Password: supersecret
#    - Database: mydb

# 3. Connect to postgres and create a table:
#    docker exec -it my-postgres psql -U postgres -d mydb
#    CREATE TABLE users (id SERIAL, name TEXT);
#    INSERT INTO users (name) VALUES ('Alice'), ('Bob');
#    SELECT * FROM users;
#    \\q

# 4. Remove the postgres container

# 5. Create a new postgres container with SAME volume

# 6. Verify your data still exists!

# 7. Explain: What would happen with a bind mount?`;

const challengeLevel4 = `# ========== CHALLENGE LEVEL 4: NETWORKING ==========

# 1. Create a network called "app-net"

# 2. Run postgres on app-net (no port mapping needed!)
#    Name: db

# 3. Run a Node app that connects to postgres using hostname "db"
#    Create this app:

# --- app.js ---
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST || 'db',
  user: 'postgres',
  password: 'secret',
  database: 'mydb'
});

client.connect()
  .then(() => console.log('Connected to database!'))
  .catch(err => console.error('Connection error:', err));

# 4. Verify the app can connect to the database

# 5. Create a docker-compose.yml with both services

# 6. Run with docker compose up and verify connectivity`;

const challengeLevel5 = `# ========== CHALLENGE LEVEL 5: PRODUCTION ==========

# 1. Write a multi-stage Dockerfile for a React app:
#    - Stage 1: Build with Node
#    - Stage 2: Serve with Nginx
#    - Include proper nginx.conf for SPA routing

# 2. Add health checks to your Dockerfile

# 3. Create a complete docker-compose.yml with:
#    - React frontend (Nginx)
#    - Node.js API
#    - PostgreSQL database
#    - Redis cache
#    - Proper networks (frontend, backend)
#    - Named volumes for data
#    - Environment variables
#    - Health checks
#    - Restart policies

# 4. Set up logging with size limits

# 5. Add resource limits (memory, CPU)

# 6. Compare image sizes before/after multi-stage build

# 7. Scan your image for vulnerabilities:
#    docker scout cves your-image`;

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

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Docker from Zero to Hero: Complete Practical Guide
        </Heading>
        <Text className={styles.subtitle}>
          Master Docker containerization from the ground up. This comprehensive tutorial covers everything
          from basic concepts to production-ready deployments, with extensive code examples, best practices,
          and hands-on challenges to solidify your knowledge.
        </Text>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img
          src="/images/docker/docker-architecture.png"
          alt="Docker Architecture"
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </div>

      {/* Table of Contents */}
      <Card className={styles.sectionCard}>
        <Heading level={2}>Table of Contents</Heading>
        <div className={styles.tocGrid}>
          <a href="#what-is-docker" className={styles.tocLink}>1. What is Docker?</a>
          <a href="#installation" className={styles.tocLink}>2. Installation</a>
          <a href="#basic-commands" className={styles.tocLink}>3. Basic Commands</a>
          <a href="#dockerfile" className={styles.tocLink}>4. Dockerfile Deep Dive</a>
          <a href="#image-layers" className={styles.tocLink}>5. Image Layers</a>
          <a href="#volumes" className={styles.tocLink}>6. Volumes & Data</a>
          <a href="#networking" className={styles.tocLink}>7. Networking</a>
          <a href="#docker-compose" className={styles.tocLink}>8. Docker Compose</a>
          <a href="#multi-stage" className={styles.tocLink}>9. Multi-Stage Builds</a>
          <a href="#security" className={styles.tocLink}>10. Security</a>
          <a href="#production" className={styles.tocLink}>11. Production Tips</a>
          <a href="#troubleshooting" className={styles.tocLink}>12. Troubleshooting</a>
          <a href="#challenges" className={styles.tocLink}>13. Challenges</a>
        </div>
      </Card>

      {/* ==================== SECTION 1: WHAT IS DOCKER ==================== */}
      <section id="what-is-docker" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            1. What is Docker? (Containers vs VMs)
          </Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/container-vs-vm.png"
              alt="Container vs Virtual Machine"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            Docker is a platform for developing, shipping, and running applications in <strong>containers</strong>.
            Unlike virtual machines that virtualize hardware, containers virtualize the operating system,
            making them lightweight, fast, and portable.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>KEY BENEFITS</div>
            <Text className={styles.infoText}>
              <strong>Consistency:</strong> &quot;Works on my machine&quot; → &quot;Works everywhere&quot;<br/>
              <strong>Isolation:</strong> Each container is isolated from others<br/>
              <strong>Efficiency:</strong> Lightweight (MBs vs GBs), starts in seconds<br/>
              <strong>Portability:</strong> Run on any system with Docker installed
            </Text>
          </div>

          <Heading level={3}>Understanding Docker Concepts</Heading>
          <CodeEditor code={whatIsDocker} language="bash" readOnly height={400} />

          <Heading level={3}>Essential Terminology</Heading>
          <CodeEditor code={dockerTerminology} language="bash" readOnly height={550} />

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/docker-image-container.png"
              alt="Docker Image vs Container"
              style={{ width: "100%", borderRadius: "8px", marginTop: "1.5rem" }}
            />
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 2: INSTALLATION ==================== */}
      <section id="installation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            2. Installing Docker
          </Heading>

          <Text className={styles.sectionDescription}>
            Docker Desktop is the easiest way to get started on macOS and Windows. For Linux, install the
            Docker Engine directly. After installation, verify everything works correctly.
          </Text>

          <Heading level={3}>Installation Commands</Heading>
          <CodeEditor code={installDocker} language="bash" readOnly height={350} />

          <Heading level={3}>Verify Installation</Heading>
          <CodeEditor code={verifyInstallation} language="bash" readOnly height={280} />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>SUCCESS CHECK</div>
            <Text className={styles.infoText}>
              If <code>docker run hello-world</code> shows &quot;Hello from Docker!&quot;, your installation is working.
              You&apos;re ready to start containerizing!
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 3: BASIC COMMANDS ==================== */}
      <section id="basic-commands" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            3. Essential Docker Commands
          </Heading>

          <Text className={styles.sectionDescription}>
            Master these commands and you can handle 90% of daily Docker operations. The most important
            command is <code>docker run</code> - it creates and starts containers from images.
          </Text>

          <Heading level={3}>Running Containers (docker run)</Heading>
          <CodeEditor code={dockerRunBasics} language="bash" readOnly height={500} />

          <Heading level={3}>Container Management</Heading>
          <CodeEditor code={containerManagement} language="bash" readOnly height={450} />

          <Heading level={3}>Inspection & Debugging</Heading>
          <CodeEditor code={containerInspection} language="bash" readOnly height={500} />

          <Heading level={3}>Image Management</Heading>
          <CodeEditor code={imageManagement} language="bash" readOnly height={480} />

          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>PRO TIP</div>
            <Text className={styles.infoText}>
              Use <code>docker exec -it container_name sh</code> to get a shell inside any running container.
              This is invaluable for debugging! Use <code>/bin/bash</code> if available, <code>/bin/sh</code> for Alpine images.
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 4: DOCKERFILE ==================== */}
      <section id="dockerfile" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            4. Dockerfile Deep Dive
          </Heading>

          <Text className={styles.sectionDescription}>
            A Dockerfile is a text file with instructions to build a Docker image. Each instruction creates
            a layer in the image. Understanding Dockerfile syntax is crucial for creating efficient,
            secure, and production-ready containers.
          </Text>

          <Heading level={3}>Dockerfile Instructions Reference</Heading>
          <CodeEditor code={dockerfileBasics} language="dockerfile" readOnly height={600} />

          <Heading level={3}>Production Node.js Dockerfile</Heading>
          <Text className={styles.sectionText}>
            This Dockerfile follows best practices: non-root user, health check, proper layer ordering,
            and security considerations.
          </Text>
          <CodeEditor code={dockerfileNodeExample} language="dockerfile" readOnly height={550} />

          <Heading level={3}>Production Python Dockerfile</Heading>
          <CodeEditor code={dockerfilePythonExample} language="dockerfile" readOnly height={550} />

          <Heading level={3}>Production Go Dockerfile (Multi-Stage)</Heading>
          <Text className={styles.sectionText}>
            Go applications can use <code>scratch</code> as the base image for minimal container size.
            The resulting image contains only the static binary!
          </Text>
          <CodeEditor code={dockerfileGoExample} language="dockerfile" readOnly height={480} />

          <Heading level={3}>Dockerfile Best Practices</Heading>
          <CodeEditor code={dockerfileBestPractices} language="dockerfile" readOnly height={600} />

          <Heading level={3}>.dockerignore File</Heading>
          <Text className={styles.sectionText}>
            Always create a <code>.dockerignore</code> file to exclude unnecessary files from the build context.
            This speeds up builds and prevents sensitive files from being included.
          </Text>
          <CodeEditor code={dockerignoreExample} language="bash" readOnly height={480} />
        </Card>
      </section>

      {/* ==================== SECTION 5: IMAGE LAYERS ==================== */}
      <section id="image-layers" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            5. Understanding Image Layers & Caching
          </Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/docker-layers.png"
              alt="Docker Image Layers"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            Docker images are made of <strong>layers</strong>. Each Dockerfile instruction creates a new layer.
            Understanding layers is key to creating efficient images and leveraging Docker&apos;s build cache.
          </Text>

          <Heading level={3}>How Layers Work</Heading>
          <CodeEditor code={imageLayers} language="bash" readOnly height={400} />

          <Heading level={3}>Build Cache Optimization</Heading>
          <CodeEditor code={buildCacheOptimization} language="bash" readOnly height={380} />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>CACHE STRATEGY</div>
            <Text className={styles.infoText}>
              Order Dockerfile instructions from least to most frequently changing.
              Copy <code>package.json</code> before source code, install dependencies, then copy the rest.
              This way, dependency installation is cached when only source code changes.
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 6: VOLUMES ==================== */}
      <section id="volumes" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            6. Volumes & Data Persistence
          </Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/docker-volumes.png"
              alt="Docker Volumes"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          </div>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/bind-mount-vs-volume.png"
              alt="Bind Mount vs Volume"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            Containers are ephemeral - when you remove them, their data is gone. <strong>Volumes</strong> provide
            persistent storage that survives container lifecycle. Use named volumes for databases and bind mounts
            for development workflows.
          </Text>

          <Heading level={3}>Volume Types</Heading>
          <CodeEditor code={volumeTypes} language="bash" readOnly height={350} />

          <Heading level={3}>Volume Management</Heading>
          <CodeEditor code={volumeManagement} language="bash" readOnly height={450} />

          <Heading level={3}>Bind Mounts for Development</Heading>
          <CodeEditor code={bindMountDev} language="bash" readOnly height={380} />

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>WHEN TO USE WHAT</div>
            <Text className={styles.infoText}>
              <strong>Named Volumes:</strong> Database data, persistent application state<br/>
              <strong>Bind Mounts:</strong> Development (live code reload), config files<br/>
              <strong>tmpfs:</strong> Sensitive data that shouldn&apos;t persist
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 7: NETWORKING ==================== */}
      <section id="networking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            7. Docker Networking
          </Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/docker-networking.png"
              alt="Docker Networking"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          </div>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/docker-port-mapping.png"
              alt="Docker Port Mapping"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            Docker creates virtual networks for containers to communicate. By default, containers are isolated.
            Create custom networks to enable container-to-container communication using hostnames.
          </Text>

          <Heading level={3}>Networking Basics</Heading>
          <CodeEditor code={networkingBasics} language="bash" readOnly height={300} />

          <Heading level={3}>Container Communication</Heading>
          <CodeEditor code={containerCommunication} language="bash" readOnly height={450} />

          <Heading level={3}>Port Mapping</Heading>
          <CodeEditor code={portMapping} language="bash" readOnly height={400} />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>KEY INSIGHT</div>
            <Text className={styles.infoText}>
              On a user-defined network, containers can reach each other using their <strong>container names
              as hostnames</strong>. This is how your app connects to the database: <code>postgres://db:5432</code>
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 8: DOCKER COMPOSE ==================== */}
      <section id="docker-compose" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            8. Docker Compose: Multi-Container Applications
          </Heading>

          <Text className={styles.sectionDescription}>
            Docker Compose lets you define and run multi-container applications with a single YAML file.
            Instead of running multiple <code>docker run</code> commands, define everything in
            <code>docker-compose.yml</code> and use <code>docker compose up</code>.
          </Text>

          <Heading level={3}>Basic docker-compose.yml</Heading>
          <CodeEditor code={composeBasics} language="yaml" readOnly height={500} />

          <Heading level={3}>Compose Commands</Heading>
          <CodeEditor code={composeCommands} language="bash" readOnly height={400} />

          <Heading level={3}>Advanced Configuration</Heading>
          <Text className={styles.sectionText}>
            Production-ready compose file with health checks, secrets, resource limits, and more.
          </Text>
          <CodeEditor code={composeAdvanced} language="yaml" readOnly height={700} />

          <Heading level={3}>Compose Profiles</Heading>
          <Text className={styles.sectionText}>
            Use profiles to enable services conditionally (dev tools, debug containers, etc.)
          </Text>
          <CodeEditor code={composeProfiles} language="yaml" readOnly height={480} />
        </Card>
      </section>

      {/* ==================== SECTION 9: MULTI-STAGE BUILDS ==================== */}
      <section id="multi-stage" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            9. Multi-Stage Builds (Smaller Images)
          </Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/docker/multistage-build.png"
              alt="Multi-Stage Build"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            Multi-stage builds let you use multiple FROM statements in a Dockerfile. Build in one stage,
            copy only what you need to the final stage. This produces much smaller, more secure images.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>IMAGE SIZE REDUCTION</div>
            <Text className={styles.infoText}>
              Without multi-stage: 1.2 GB (includes build tools, dev dependencies)<br/>
              With multi-stage: 150 MB (only production files)<br/>
              <strong>Result: 8x smaller image!</strong>
            </Text>
          </div>

          <Heading level={3}>Multi-Stage Pattern</Heading>
          <CodeEditor code={multiStageBasics} language="dockerfile" readOnly height={550} />

          <Heading level={3}>Next.js Production Dockerfile</Heading>
          <CodeEditor code={multiStageNextjs} language="dockerfile" readOnly height={600} />

          <Heading level={3}>React + Nginx Dockerfile</Heading>
          <CodeEditor code={multiStageReact} language="dockerfile" readOnly height={400} />

          <Heading level={3}>Nginx Config for React SPA</Heading>
          <CodeEditor code={nginxConfigReact} language="nginx" readOnly height={400} />
        </Card>
      </section>

      {/* ==================== SECTION 10: SECURITY ==================== */}
      <section id="security" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            10. Docker Security Best Practices
          </Heading>

          <Text className={styles.sectionDescription}>
            Security should be built into your Docker workflow from the start. Follow these practices
            to reduce your attack surface and protect your applications.
          </Text>

          <Heading level={3}>Security Checklist</Heading>
          <CodeEditor code={securityBestPractices} language="bash" readOnly height={550} />

          <Heading level={3}>Managing Secrets</Heading>
          <CodeEditor code={secretsManagement} language="bash" readOnly height={500} />

          <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
            <div className={styles.infoBoxLabel}>NEVER DO THIS</div>
            <Text className={styles.infoText}>
              Never store secrets in Dockerfiles, environment variables in docker-compose.yml committed to git,
              or image layers. Use Docker secrets, environment variables at runtime, or external secret managers.
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 11: PRODUCTION ==================== */}
      <section id="production" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            11. Production Considerations
          </Heading>

          <Text className={styles.sectionDescription}>
            Running Docker in production requires additional considerations: health checks, resource limits,
            logging, monitoring, and restart policies.
          </Text>

          <Heading level={3}>Production Tips</Heading>
          <CodeEditor code={productionTips} language="bash" readOnly height={500} />

          <Heading level={3}>Logging & Monitoring</Heading>
          <CodeEditor code={loggingMonitoring} language="bash" readOnly height={500} />
        </Card>
      </section>

      {/* ==================== SECTION 12: TROUBLESHOOTING ==================== */}
      <section id="troubleshooting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            12. Troubleshooting & Cleanup
          </Heading>

          <Text className={styles.sectionDescription}>
            Docker issues are usually easy to debug once you know where to look. Here are common
            problems and their solutions.
          </Text>

          <Heading level={3}>Common Problems & Solutions</Heading>
          <CodeEditor code={troubleshooting} language="bash" readOnly height={450} />

          <Heading level={3}>Cleanup Commands</Heading>
          <CodeEditor code={cleanup} language="bash" readOnly height={350} />

          <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
            <div className={styles.infoBoxLabel}>WARNING</div>
            <Text className={styles.infoText}>
              <code>docker system prune -a --volumes</code> removes EVERYTHING unused, including all images
              and volumes. This will delete database data! Use with caution.
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 13: CHALLENGES ==================== */}
      <section id="challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            13. Hands-On Challenges
          </Heading>

          <Text className={styles.sectionDescription}>
            Complete these challenges in order to solidify your Docker knowledge. Each level builds
            on the previous one. Solutions are not provided - use everything you&apos;ve learned!
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>HOW TO USE CHALLENGES</div>
            <Text className={styles.infoText}>
              Open a terminal and work through each task. If you get stuck, re-read the relevant section.
              Google is allowed! Real-world Docker work involves lots of documentation reading.
            </Text>
          </div>

          <Heading level={3}>Level 1: Container Basics</Heading>
          <CodeEditor code={challengeLevel1} language="bash" readOnly height={350} />

          <Heading level={3}>Level 2: Building Images</Heading>
          <CodeEditor code={challengeLevel2} language="javascript" readOnly height={500} />

          <Heading level={3}>Level 3: Persistence with Volumes</Heading>
          <CodeEditor code={challengeLevel3} language="bash" readOnly height={400} />

          <Heading level={3}>Level 4: Networking & Compose</Heading>
          <CodeEditor code={challengeLevel4} language="javascript" readOnly height={480} />

          <Heading level={3}>Level 5: Production-Ready</Heading>
          <CodeEditor code={challengeLevel5} language="bash" readOnly height={450} />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>CONGRATULATIONS!</div>
            <Text className={styles.infoText}>
              If you&apos;ve completed all 5 levels, you have a solid foundation in Docker! You can now containerize
              applications, set up development environments, and deploy to production. Keep practicing with real
              projects to deepen your expertise.
            </Text>
          </div>
        </Card>
      </section>

      {/* Footer Navigation */}
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
