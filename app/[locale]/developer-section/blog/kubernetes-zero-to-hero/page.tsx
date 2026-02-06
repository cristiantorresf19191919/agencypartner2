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

const whatIsKubernetes = `# Kubernetes (K8s) = Container Orchestration Platform
# Developed by Google, now maintained by CNCF

# The problem Kubernetes solves:
# - How do you manage 100s or 1000s of containers?
# - How do you ensure high availability?
# - How do you scale automatically?
# - How do you update without downtime?
# - How do you recover from failures?

# Kubernetes provides:
# ✓ Automatic container deployment
# ✓ Scaling (up/down based on load)
# ✓ Load balancing
# ✓ Self-healing (restart failed containers)
# ✓ Rolling updates & rollbacks
# ✓ Service discovery
# ✓ Secret & configuration management
# ✓ Storage orchestration

# Think of K8s as a "datacenter operating system"
# It manages your containers like an OS manages processes`;

const k8sVsDocker = `# Kubernetes vs Docker - They're COMPLEMENTARY!

# DOCKER:
# - Builds container images
# - Runs individual containers
# - Great for development
# - Single host focus

# KUBERNETES:
# - Orchestrates containers across MULTIPLE hosts
# - Manages container lifecycle at scale
# - Production-grade features
# - Cluster management

# Analogy:
# Docker = A musician who can play instruments
# Kubernetes = The conductor of an orchestra

# Docker builds and runs containers
# Kubernetes tells containers WHERE and HOW to run

# You need BOTH:
# 1. Build images with Docker (or alternatives)
# 2. Deploy and manage with Kubernetes`;

const k8sTerminology = `# Essential Kubernetes Terminology

# CLUSTER
# - A set of machines (nodes) running Kubernetes
# - Has Control Plane + Worker Nodes

# NODE
# - A machine (physical or VM) in the cluster
# - Worker nodes run your containers
# - Control plane nodes manage the cluster

# POD
# - Smallest deployable unit in K8s
# - Contains one or more containers
# - Containers in a pod share network/storage
# - Pods are ephemeral (can be replaced anytime)

# DEPLOYMENT
# - Manages pods declaratively
# - Defines desired state (replicas, image, etc.)
# - Handles rolling updates & rollbacks

# SERVICE
# - Stable network endpoint for pods
# - Load balances traffic to pods
# - Types: ClusterIP, NodePort, LoadBalancer

# NAMESPACE
# - Virtual cluster within a cluster
# - Isolates resources (like folders)
# - Examples: dev, staging, production

# CONFIGMAP & SECRET
# - External configuration for pods
# - ConfigMap: non-sensitive data
# - Secret: sensitive data (encoded)`;

// ==========================================
// SECTION 2: ARCHITECTURE
// ==========================================

const controlPlaneComponents = `# Control Plane Components (Master Node)
# These manage the cluster state

# API SERVER (kube-apiserver)
# - Front door to Kubernetes
# - All communication goes through here
# - RESTful API
# - Validates and configures data

# ETCD
# - Distributed key-value store
# - Stores ALL cluster state
# - The "source of truth"
# - Highly available (usually 3+ replicas)

# SCHEDULER (kube-scheduler)
# - Assigns pods to nodes
# - Considers resources, constraints, affinity
# - "Where should this pod run?"

# CONTROLLER MANAGER (kube-controller-manager)
# - Runs controllers (control loops)
# - Node Controller: monitors node health
# - Replication Controller: maintains pod count
# - Endpoints Controller: populates Services
# - Service Account Controller: creates accounts

# CLOUD CONTROLLER MANAGER
# - Integrates with cloud providers
# - Manages load balancers, routes, volumes
# - Only in cloud deployments`;

const workerNodeComponents = `# Worker Node Components
# These run on every worker node

# KUBELET
# - Agent that runs on each node
# - Ensures containers are running in pods
# - Communicates with API server
# - Reports node and pod status

# KUBE-PROXY
# - Network proxy on each node
# - Implements Service concept
# - Manages network rules (iptables/IPVS)
# - Enables pod-to-pod communication

# CONTAINER RUNTIME
# - Runs containers (Docker, containerd, CRI-O)
# - Kubernetes is container-runtime agnostic
# - containerd is most common today

# The flow:
# 1. You: kubectl apply -f deployment.yaml
# 2. API Server: validates and stores in etcd
# 3. Scheduler: assigns pods to nodes
# 4. Kubelet: pulls image, starts containers
# 5. Kube-proxy: sets up networking`;

// ==========================================
// SECTION 3: INSTALLATION
// ==========================================

const installKubectl = `# Install kubectl - The Kubernetes CLI

# macOS (Homebrew):
brew install kubectl

# macOS (curl):
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Linux (curl):
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Windows (Chocolatey):
choco install kubernetes-cli

# Verify installation:
kubectl version --client

# Output:
# Client Version: v1.29.0
# Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3`;

const installMinikube = `# Minikube - Local Kubernetes for Development

# macOS:
brew install minikube

# Linux:
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Windows:
choco install minikube

# Start a cluster:
minikube start

# With specific resources:
minikube start --cpus=4 --memory=8192 --driver=docker

# Check status:
minikube status

# Access Kubernetes dashboard:
minikube dashboard

# Stop cluster:
minikube stop

# Delete cluster:
minikube delete

# Useful addons:
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons list`;

const installK3s = `# K3s - Lightweight Kubernetes for Edge/IoT

# Install K3s (single command!):
curl -sfL https://get.k3s.io | sh -

# Check if running:
sudo systemctl status k3s

# Get kubeconfig:
sudo cat /etc/rancher/k3s/k3s.yaml

# Use kubectl (included with k3s):
sudo k3s kubectl get nodes

# Or copy config for regular kubectl:
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config

# Add a worker node:
# On master, get token:
sudo cat /var/lib/rancher/k3s/server/node-token

# On worker:
curl -sfL https://get.k3s.io | K3S_URL=https://master-ip:6443 K3S_TOKEN=<token> sh -

# Uninstall:
/usr/local/bin/k3s-uninstall.sh`;

const installKind = `# Kind - Kubernetes IN Docker (for CI/CD)

# Install Kind:
# macOS:
brew install kind

# Linux:
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create a cluster:
kind create cluster

# Create with custom name:
kind create cluster --name my-cluster

# Multi-node cluster (create config file first):
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
EOF

# List clusters:
kind get clusters

# Delete cluster:
kind delete cluster --name my-cluster

# Load local Docker image to Kind:
kind load docker-image my-app:latest`;

// ==========================================
// SECTION 4: KUBECTL BASICS
// ==========================================

const kubectlConfig = `# kubectl Configuration

# View current context:
kubectl config current-context

# List all contexts:
kubectl config get-contexts

# Switch context:
kubectl config use-context my-cluster

# View config:
kubectl config view

# Set default namespace for context:
kubectl config set-context --current --namespace=my-namespace

# Create a new context:
kubectl config set-context my-context \\
  --cluster=my-cluster \\
  --user=my-user \\
  --namespace=my-namespace

# Kubeconfig file location:
# Default: ~/.kube/config
# Override with: export KUBECONFIG=/path/to/config

# Merge multiple kubeconfig files:
export KUBECONFIG=~/.kube/config:~/.kube/other-config
kubectl config view --flatten > ~/.kube/merged-config`;

const kubectlBasicCommands = `# Essential kubectl Commands

# ========== GET RESOURCES ==========
kubectl get pods                    # List pods in current namespace
kubectl get pods -A                 # List pods in ALL namespaces
kubectl get pods -o wide            # More details (IP, node)
kubectl get pods -o yaml            # Full YAML output
kubectl get pods -o json            # Full JSON output
kubectl get pods --watch            # Watch for changes
kubectl get pods -l app=nginx       # Filter by label

kubectl get nodes                   # List cluster nodes
kubectl get services                # List services
kubectl get deployments             # List deployments
kubectl get all                     # List common resources

# ========== DESCRIBE (detailed info) ==========
kubectl describe pod my-pod
kubectl describe node my-node
kubectl describe service my-service

# ========== CREATE / APPLY ==========
kubectl apply -f manifest.yaml      # Create/update from file
kubectl apply -f ./manifests/       # Apply all files in directory
kubectl apply -f https://url.com/manifest.yaml

kubectl create deployment nginx --image=nginx
kubectl create namespace my-ns

# ========== DELETE ==========
kubectl delete pod my-pod
kubectl delete -f manifest.yaml
kubectl delete deployment my-deploy
kubectl delete pods --all           # Delete all pods in namespace`;

const kubectlAdvancedCommands = `# Advanced kubectl Commands

# ========== LOGS ==========
kubectl logs my-pod                 # View pod logs
kubectl logs my-pod -c my-container # Specific container
kubectl logs my-pod -f              # Follow logs (stream)
kubectl logs my-pod --tail=100      # Last 100 lines
kubectl logs my-pod --since=1h      # Last hour
kubectl logs -l app=nginx           # Logs by label

# ========== EXEC (run commands in pod) ==========
kubectl exec my-pod -- ls -la
kubectl exec my-pod -- cat /etc/config
kubectl exec -it my-pod -- /bin/bash    # Interactive shell
kubectl exec -it my-pod -c container -- sh

# ========== PORT FORWARD ==========
kubectl port-forward pod/my-pod 8080:80
kubectl port-forward svc/my-service 8080:80
kubectl port-forward deploy/my-deploy 8080:80

# ========== COPY FILES ==========
kubectl cp my-pod:/path/file ./local-file
kubectl cp ./local-file my-pod:/path/file

# ========== DEBUGGING ==========
kubectl get events                  # Cluster events
kubectl get events --sort-by='.lastTimestamp'
kubectl top pods                    # Resource usage
kubectl top nodes
kubectl api-resources               # List all resource types

# ========== DRY RUN (test without applying) ==========
kubectl apply -f manifest.yaml --dry-run=client
kubectl apply -f manifest.yaml --dry-run=server`;

const kubectlShortcuts = `# kubectl Shortcuts & Aliases

# Built-in short names:
kubectl get po          # pods
kubectl get svc         # services
kubectl get deploy      # deployments
kubectl get ns          # namespaces
kubectl get no          # nodes
kubectl get cm          # configmaps
kubectl get secret      # secrets
kubectl get pv          # persistentvolumes
kubectl get pvc         # persistentvolumeclaims
kubectl get ing         # ingresses
kubectl get ds          # daemonsets
kubectl get sts         # statefulsets
kubectl get rs          # replicasets
kubectl get ep          # endpoints
kubectl get sa          # serviceaccounts

# Recommended bash aliases (~/.bashrc or ~/.zshrc):
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgpa='kubectl get pods -A'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kgn='kubectl get nodes'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias ke='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdf='kubectl delete -f'

# Enable kubectl autocompletion:
# Bash:
echo 'source <(kubectl completion bash)' >> ~/.bashrc

# Zsh:
echo 'source <(kubectl completion zsh)' >> ~/.zshrc`;

// ==========================================
// SECTION 5: PODS
// ==========================================

const podBasics = `# Pods - The Smallest Deployable Unit

# A Pod is:
# - One or more containers that share:
#   - Network namespace (same IP, localhost)
#   - Storage volumes
#   - Lifecycle (created/deleted together)
# - Ephemeral - can be replaced anytime
# - Usually managed by a controller (Deployment)

# When to use multi-container pods:
# - Sidecar pattern (logging, proxies)
# - Adapter pattern (format conversion)
# - Ambassador pattern (connection proxying)

# Pod lifecycle states:
# - Pending: scheduled, waiting for resources
# - Running: at least one container running
# - Succeeded: all containers completed successfully
# - Failed: at least one container failed
# - Unknown: cannot determine state`;

const podYamlExample = `# pod.yaml - Simple Pod definition
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
    environment: development
  annotations:
    description: "Demo nginx pod"
spec:
  containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
    - containerPort: 80
      name: http
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
    env:
    - name: NGINX_HOST
      value: "localhost"
    volumeMounts:
    - name: html-volume
      mountPath: /usr/share/nginx/html
  volumes:
  - name: html-volume
    emptyDir: {}
  restartPolicy: Always`;

const podMultiContainer = `# Multi-container Pod (Sidecar Pattern)
apiVersion: v1
kind: Pod
metadata:
  name: web-with-sidecar
spec:
  containers:
  # Main application container
  - name: web-app
    image: nginx:alpine
    ports:
    - containerPort: 80
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/nginx

  # Sidecar: Log shipper
  - name: log-shipper
    image: fluent/fluent-bit:latest
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/nginx
      readOnly: true
    - name: fluent-config
      mountPath: /fluent-bit/etc/

  # Sidecar: Metrics exporter
  - name: metrics-exporter
    image: nginx/nginx-prometheus-exporter:latest
    args:
    - "-nginx.scrape-uri=http://localhost/nginx_status"
    ports:
    - containerPort: 9113
      name: metrics

  volumes:
  - name: shared-logs
    emptyDir: {}
  - name: fluent-config
    configMap:
      name: fluent-bit-config`;

const podLifecycleHooks = `# Pod Lifecycle Hooks & Probes
apiVersion: v1
kind: Pod
metadata:
  name: lifecycle-demo
spec:
  containers:
  - name: app
    image: my-app:latest

    # Startup Probe - for slow-starting containers
    startupProbe:
      httpGet:
        path: /healthz
        port: 8080
      failureThreshold: 30
      periodSeconds: 10

    # Liveness Probe - restart if unhealthy
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 3

    # Readiness Probe - remove from service if not ready
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 3

    # Lifecycle hooks
    lifecycle:
      postStart:
        exec:
          command: ["/bin/sh", "-c", "echo Started > /tmp/started"]
      preStop:
        exec:
          command: ["/bin/sh", "-c", "nginx -s quit; sleep 10"]`;

// ==========================================
// SECTION 6: DEPLOYMENTS
// ==========================================

const deploymentBasics = `# Deployments - Declarative Pod Management

# A Deployment:
# - Manages ReplicaSets (which manage Pods)
# - Ensures desired number of pods are running
# - Handles rolling updates
# - Supports rollbacks
# - Self-healing (replaces failed pods)

# Why use Deployments instead of Pods?
# - Pods are ephemeral, no self-healing
# - Deployments maintain desired state
# - Easy scaling (kubectl scale)
# - Rolling updates without downtime
# - Rollback to previous versions

# Deployment → ReplicaSet → Pods
# The Deployment creates ReplicaSets
# ReplicaSets ensure pod count
# You rarely interact with ReplicaSets directly`;

const deploymentYaml = `# deployment.yaml - Production-ready example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx

  # Update strategy
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1      # Max pods that can be unavailable
      maxSurge: 1            # Max pods above desired count

  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80

        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"

        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5

        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 3`;

const deploymentCommands = `# Deployment Commands

# Create deployment imperatively:
kubectl create deployment nginx --image=nginx:1.25
kubectl create deployment nginx --image=nginx --replicas=3

# Apply from file:
kubectl apply -f deployment.yaml

# View deployments:
kubectl get deployments
kubectl get deploy nginx-deployment -o yaml
kubectl describe deployment nginx-deployment

# ========== SCALING ==========
kubectl scale deployment nginx-deployment --replicas=5

# Autoscaling (HPA):
kubectl autoscale deployment nginx-deployment \\
  --min=2 --max=10 --cpu-percent=80

# ========== UPDATES ==========
# Update image:
kubectl set image deployment/nginx-deployment nginx=nginx:1.26

# Update via edit (opens editor):
kubectl edit deployment nginx-deployment

# ========== ROLLOUT STATUS ==========
kubectl rollout status deployment/nginx-deployment
kubectl rollout history deployment/nginx-deployment

# ========== ROLLBACK ==========
kubectl rollout undo deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment --to-revision=2

# Pause/resume rollout:
kubectl rollout pause deployment/nginx-deployment
kubectl rollout resume deployment/nginx-deployment

# ========== DELETE ==========
kubectl delete deployment nginx-deployment`;

// ==========================================
// SECTION 7: SERVICES
// ==========================================

const serviceBasics = `# Services - Stable Network Endpoints

# Problem: Pods are ephemeral
# - Pods get new IPs when recreated
# - How do other pods find them?
# - How does external traffic reach them?

# Solution: Services
# - Stable DNS name and IP
# - Load balances to healthy pods
# - Uses labels to select pods

# Service Types:
# 1. ClusterIP (default)
#    - Internal cluster IP only
#    - Only reachable within cluster
#    - Use for internal communication

# 2. NodePort
#    - Exposes on each node's IP
#    - Port range: 30000-32767
#    - External access without load balancer

# 3. LoadBalancer
#    - Provisions cloud load balancer
#    - External IP assigned by cloud provider
#    - Most common for production

# 4. ExternalName
#    - Maps to external DNS name
#    - No proxying, just DNS CNAME`;

const serviceClusterIP = `# ClusterIP Service (default)
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP           # Optional, this is default
  selector:
    app: backend            # Selects pods with this label
  ports:
  - name: http
    port: 80                # Service port
    targetPort: 8080        # Container port
    protocol: TCP

---
# Headless Service (no load balancing, direct pod DNS)
apiVersion: v1
kind: Service
metadata:
  name: database-headless
spec:
  clusterIP: None           # Makes it headless
  selector:
    app: database
  ports:
  - port: 5432
    targetPort: 5432

# DNS resolution:
# ClusterIP:  backend-service.namespace.svc.cluster.local
# Headless:   pod-name.database-headless.namespace.svc.cluster.local`;

const serviceNodePort = `# NodePort Service
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web
  ports:
  - name: http
    port: 80                # Internal cluster port
    targetPort: 8080        # Container port
    nodePort: 30080         # External port (30000-32767)
    # If not specified, K8s assigns random port

---
# Access the service:
# http://<any-node-ip>:30080

# Get node IPs:
# kubectl get nodes -o wide

# With Minikube:
# minikube service web-nodeport --url`;

const serviceLoadBalancer = `# LoadBalancer Service
apiVersion: v1
kind: Service
metadata:
  name: web-loadbalancer
  annotations:
    # Cloud-specific annotations
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-internal: "false"
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8443

  # Optional: specify desired external IP
  # loadBalancerIP: 1.2.3.4

  # Optional: limit source IPs
  # loadBalancerSourceRanges:
  # - 10.0.0.0/8

---
# Check external IP:
# kubectl get svc web-loadbalancer
# NAME               TYPE           EXTERNAL-IP     PORT(S)
# web-loadbalancer   LoadBalancer   203.0.113.10    80:31234/TCP`;

// ==========================================
// SECTION 8: CONFIGMAPS & SECRETS
// ==========================================

const configMapBasics = `# ConfigMaps - External Configuration

# ConfigMaps store non-sensitive configuration:
# - Environment variables
# - Configuration files
# - Command-line arguments

# Benefits:
# - Separate config from container image
# - Update config without rebuilding
# - Share config across multiple pods
# - Environment-specific values`;

const configMapExamples = `# ConfigMap Examples

# From literal values:
kubectl create configmap app-config \\
  --from-literal=DATABASE_HOST=postgres \\
  --from-literal=LOG_LEVEL=info

# From file:
kubectl create configmap nginx-config --from-file=nginx.conf

# From directory:
kubectl create configmap configs --from-file=./config-dir/

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Simple key-value pairs
  DATABASE_HOST: "postgres.default.svc.cluster.local"
  DATABASE_PORT: "5432"
  LOG_LEVEL: "info"

  # Multi-line configuration file
  app.properties: |
    server.port=8080
    server.host=0.0.0.0
    feature.enabled=true

  nginx.conf: |
    server {
      listen 80;
      location / {
        proxy_pass http://backend:8080;
      }
    }`;

const configMapUsage = `# Using ConfigMaps in Pods
apiVersion: v1
kind: Pod
metadata:
  name: app-with-config
spec:
  containers:
  - name: app
    image: my-app:latest

    # Method 1: Environment variables from ConfigMap
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DATABASE_HOST

    # Method 2: All keys as environment variables
    envFrom:
    - configMapRef:
        name: app-config
        # optional: true  # Don't fail if ConfigMap missing

    # Method 3: Mount as files
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
      readOnly: true

    # Method 4: Mount specific key as file
    - name: nginx-config
      mountPath: /etc/nginx/nginx.conf
      subPath: nginx.conf

  volumes:
  - name: config-volume
    configMap:
      name: app-config
  - name: nginx-config
    configMap:
      name: app-config
      items:
      - key: nginx.conf
        path: nginx.conf`;

const secretBasics = `# Secrets - Sensitive Data Storage

# Secrets store sensitive data:
# - Passwords
# - API keys
# - TLS certificates
# - SSH keys

# Important security notes:
# - Secrets are base64 encoded (NOT encrypted!)
# - Enable encryption at rest in etcd
# - Use RBAC to limit access
# - Consider external secret managers
#   (HashiCorp Vault, AWS Secrets Manager)

# Secret types:
# - Opaque: arbitrary user-defined data
# - kubernetes.io/tls: TLS certificates
# - kubernetes.io/dockerconfigjson: Docker registry credentials
# - kubernetes.io/basic-auth: basic authentication
# - kubernetes.io/ssh-auth: SSH authentication`;

const secretExamples = `# Secret Examples

# Create from literal (auto base64 encodes):
kubectl create secret generic db-credentials \\
  --from-literal=username=admin \\
  --from-literal=password='S3cr3tP@ssw0rd!'

# Create TLS secret:
kubectl create secret tls my-tls \\
  --cert=path/to/tls.crt \\
  --key=path/to/tls.key

# Create Docker registry secret:
kubectl create secret docker-registry regcred \\
  --docker-server=ghcr.io \\
  --docker-username=user \\
  --docker-password=token \\
  --docker-email=user@example.com

---
# secret.yaml (values must be base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  # echo -n 'admin' | base64
  username: YWRtaW4=
  # echo -n 'password123' | base64
  password: cGFzc3dvcmQxMjM=

---
# Using stringData (auto-encodes, easier to read)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: password123`;

const secretUsage = `# Using Secrets in Pods
apiVersion: v1
kind: Pod
metadata:
  name: app-with-secrets
spec:
  containers:
  - name: app
    image: my-app:latest

    # Method 1: Environment variable from Secret
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password

    # Method 2: All keys as environment variables
    envFrom:
    - secretRef:
        name: db-credentials

    # Method 3: Mount as files
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true

  volumes:
  - name: secret-volume
    secret:
      secretName: db-credentials
      # Optional: set file permissions
      defaultMode: 0400

---
# Using Docker registry secret
apiVersion: v1
kind: Pod
metadata:
  name: private-image-pod
spec:
  containers:
  - name: app
    image: ghcr.io/myorg/private-app:latest
  imagePullSecrets:
  - name: regcred`;

// ==========================================
// SECTION 9: VOLUMES & STORAGE
// ==========================================

const volumeTypes = `# Kubernetes Storage Concepts

# VOLUMES - Temporary or persistent storage for pods

# Volume Types:
# 1. emptyDir - temporary, deleted with pod
# 2. hostPath - mounts host filesystem (dangerous!)
# 3. configMap/secret - configuration data
# 4. persistentVolumeClaim - persistent storage
# 5. nfs - Network File System
# 6. cloud volumes - AWS EBS, GCE PD, Azure Disk

# PERSISTENT VOLUMES (PV)
# - Cluster-level storage resource
# - Provisioned by admin or dynamically
# - Independent of pod lifecycle

# PERSISTENT VOLUME CLAIMS (PVC)
# - Request for storage by user
# - Binds to a matching PV
# - Used by pods to access storage

# STORAGE CLASSES
# - Define "classes" of storage
# - Enable dynamic provisioning
# - Examples: fast-ssd, standard, slow-hdd`;

const volumeExamples = `# Volume Examples
apiVersion: v1
kind: Pod
metadata:
  name: volume-demo
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    # emptyDir - shared between containers
    - name: cache
      mountPath: /cache

    # hostPath - access host filesystem
    - name: host-logs
      mountPath: /var/log/host

    # configMap as volume
    - name: config
      mountPath: /etc/config
      readOnly: true

  volumes:
  # Temporary storage, deleted with pod
  - name: cache
    emptyDir:
      sizeLimit: 500Mi

  # Mount host directory (use with caution!)
  - name: host-logs
    hostPath:
      path: /var/log
      type: Directory

  # ConfigMap as files
  - name: config
    configMap:
      name: my-config`;

const persistentVolumeYaml = `# PersistentVolume (cluster resource)
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce       # RWO - single node
    # - ReadOnlyMany      # ROX - multiple nodes read-only
    # - ReadWriteMany     # RWX - multiple nodes read-write
  persistentVolumeReclaimPolicy: Retain
    # Retain: keep data after PVC deleted
    # Delete: delete volume after PVC deleted
    # Recycle: deprecated
  storageClassName: standard
  hostPath:
    path: /data/my-pv

---
# PersistentVolumeClaim (user request)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard

---
# Using PVC in Pod
apiVersion: v1
kind: Pod
metadata:
  name: app-with-pvc
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: my-pvc`;

const storageClassYaml = `# StorageClass for dynamic provisioning
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs  # Cloud-specific
parameters:
  type: gp3
  iopsPerGB: "50"
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer

---
# AWS EBS StorageClass
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  encrypted: "true"
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer

---
# GKE StorageClass
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ssd-sc
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-ssd
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer

---
# PVC using StorageClass (dynamic provisioning)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi`;

// ==========================================
// SECTION 10: NETWORKING & INGRESS
// ==========================================

const networkingBasics = `# Kubernetes Networking Model

# Fundamental rules:
# 1. All pods can communicate with all other pods (no NAT)
# 2. All nodes can communicate with all pods (no NAT)
# 3. Pod sees itself with same IP others see it

# Network implementations (CNI plugins):
# - Calico: most popular, network policies
# - Cilium: eBPF-based, advanced features
# - Flannel: simple, overlay network
# - Weave: mesh network
# - AWS VPC CNI: native AWS networking

# Service Discovery:
# - DNS: my-service.my-namespace.svc.cluster.local
# - Environment variables: MY_SERVICE_HOST, MY_SERVICE_PORT

# Network Policies:
# - Firewall rules for pods
# - Control ingress/egress traffic
# - Require CNI that supports them`;

const networkPolicyYaml = `# NetworkPolicy Examples
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}           # Applies to all pods
  policyTypes:
  - Ingress
  - Egress
  # No rules = deny all traffic

---
# Allow ingress from specific pods
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080

---
# Allow egress to specific external IPs
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external-api
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 203.0.113.0/24
    ports:
    - protocol: TCP
      port: 443`;

const ingressBasics = `# Ingress - HTTP/HTTPS Routing

# Ingress provides:
# - External access to services
# - URL-based routing
# - SSL/TLS termination
# - Name-based virtual hosting
# - Load balancing

# Requires an Ingress Controller:
# - NGINX Ingress (most popular)
# - Traefik
# - HAProxy
# - AWS ALB Ingress Controller
# - GKE Ingress
# - Istio Gateway

# Without Ingress:
# External → LoadBalancer → Service → Pods

# With Ingress:
# External → Ingress → Service → Pods
#         ↘ Ingress → Service → Pods`;

const ingressYaml = `# Ingress Examples
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: simple-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80

---
# Multiple hosts and paths
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-path-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: api-v1
            port:
              number: 80
      - path: /v2
        pathType: Prefix
        backend:
          service:
            name: api-v2
            port:
              number: 80
  - host: web.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-frontend
            port:
              number: 80`;

const ingressTLS = `# Ingress with TLS
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
  annotations:
    # Redirect HTTP to HTTPS
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    # Use cert-manager for auto-renewal
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80

---
# Create TLS secret manually:
# kubectl create secret tls myapp-tls-secret \\
#   --cert=tls.crt --key=tls.key

# Or use cert-manager for automatic Let's Encrypt:
# 1. Install cert-manager
# 2. Create ClusterIssuer for Let's Encrypt
# 3. Add annotation to Ingress`;

// ==========================================
// SECTION 11: K9S - TERMINAL UI
// ==========================================

const k9sInstall = `# K9s - Terminal UI for Kubernetes

# Install K9s:
# macOS:
brew install derailed/k9s/k9s

# Linux (via curl):
curl -sS https://webinstall.dev/k9s | bash

# Linux (via snap):
sudo snap install k9s

# Windows (via chocolatey):
choco install k9s

# Verify installation:
k9s version

# Launch k9s (uses current kubectl context):
k9s

# Launch with specific context:
k9s --context my-cluster

# Launch with specific namespace:
k9s -n my-namespace

# Launch in read-only mode:
k9s --readonly`;

const k9sNavigation = `# K9s Navigation & Shortcuts

# GLOBAL SHORTCUTS
# :           Command mode (type resource name)
# /           Filter/search
# ?           Help
# Ctrl+a      Show all resources
# Ctrl+d      Delete resource
# Esc         Back / Cancel
# q           Quit k9s

# NAVIGATION
# :pods       Switch to pods view
# :svc        Switch to services view
# :deploy     Switch to deployments view
# :ns         Switch to namespaces view
# :nodes      Switch to nodes view
# :secrets    Switch to secrets view
# :cm         Switch to configmaps view
# :pv         Switch to persistent volumes
# :pvc        Switch to persistent volume claims

# ON A RESOURCE
# Enter       View details
# d           Describe
# l           View logs
# s           Shell into container
# y           View YAML
# e           Edit resource
# k           Kill/delete
# Ctrl+k      Kill pod (force)

# LOGS VIEW
# w           Toggle wrap
# s           Toggle auto-scroll
# 0           Jump to start
# Shift+g     Jump to end
# /           Search in logs`;

const k9sAdvanced = `# K9s Advanced Features

# FILTERING
# /nginx          Filter by name containing "nginx"
# /app=web        Filter by label
# /-n default     Filter by namespace
# /!running       Exclude "running" from results

# CONTEXT SWITCHING
# :ctx            List contexts
# Enter on ctx    Switch to that context

# BENCHMARKING
# :be             HTTP benchmarks view
# (on a pod)      b to run benchmark

# PORT FORWARDING
# (on a pod)      Shift+f to port forward

# XRAY VIEW
# :xray deploy    Shows deployment tree
# :xray svc       Shows service endpoints

# PULSE VIEW
# :pulse          Cluster health metrics

# CONFIGURATION (~/.config/k9s/config.yml)
# k9s:
#   refreshRate: 2
#   maxConnRetry: 5
#   readOnly: false
#   noIcons: false
#   logger:
#     tail: 100
#     buffer: 5000
#     sinceSeconds: 60
#   currentContext: minikube
#   currentCluster: minikube`;

const k9sHotkeys = `# K9s Custom Hotkeys (~/.config/k9s/hotkey.yml)

# Define custom hotkeys:
hotKey:
  # Shift-1: Switch to pods in all namespaces
  shift-1:
    shortCut: Shift-1
    description: View all pods
    command: pods

  # Shift-2: Switch to deployments
  shift-2:
    shortCut: Shift-2
    description: View deployments
    command: deploy

  # Shift-3: Switch to services
  shift-3:
    shortCut: Shift-3
    description: View services
    command: svc

  # Shift-4: Show node resources
  shift-4:
    shortCut: Shift-4
    description: View nodes
    command: nodes

  # Shift-l: Logs with timestamps
  shift-l:
    shortCut: Shift-L
    description: Logs with timestamps
    command: "pods -c <pod>"`;

// ==========================================
// SECTION 12: HELM CHARTS
// ==========================================

const helmBasics = `# Helm - The Package Manager for Kubernetes

# What is Helm?
# - Package manager for Kubernetes
# - Uses "charts" (packages of K8s resources)
# - Templating engine for YAML
# - Release management & upgrades
# - Rollback capability

# Key concepts:
# - Chart: Package of K8s resources
# - Release: Instance of a chart
# - Repository: Collection of charts
# - Values: Configuration for a chart

# Why use Helm?
# - Avoid repetitive YAML
# - Parameterize deployments
# - Share configurations
# - Version control releases
# - Easy upgrades and rollbacks`;

const helmInstall = `# Install Helm

# macOS:
brew install helm

# Linux (script):
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Linux (snap):
sudo snap install helm --classic

# Windows:
choco install kubernetes-helm

# Verify installation:
helm version

# Add popular chart repositories:
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Update repositories:
helm repo update

# Search for charts:
helm search repo nginx
helm search hub wordpress`;

const helmCommands = `# Essential Helm Commands

# ========== REPOSITORY MANAGEMENT ==========
helm repo list                      # List repos
helm repo add name url              # Add repo
helm repo remove name               # Remove repo
helm repo update                    # Update all repos

# ========== SEARCH ==========
helm search repo nginx              # Search in repos
helm search hub wordpress           # Search Helm Hub

# ========== INSTALL ==========
helm install release-name chart     # Install chart
helm install my-nginx bitnami/nginx

# With custom values:
helm install my-nginx bitnami/nginx -f values.yaml
helm install my-nginx bitnami/nginx --set replicas=3

# Install in namespace:
helm install my-nginx bitnami/nginx -n my-namespace

# Dry run (preview):
helm install my-nginx bitnami/nginx --dry-run

# ========== MANAGE RELEASES ==========
helm list                           # List releases
helm list -A                        # All namespaces
helm status my-nginx                # Release status
helm history my-nginx               # Release history

# ========== UPGRADE ==========
helm upgrade my-nginx bitnami/nginx
helm upgrade my-nginx bitnami/nginx -f new-values.yaml

# ========== ROLLBACK ==========
helm rollback my-nginx              # Rollback to previous
helm rollback my-nginx 2            # Rollback to revision 2

# ========== UNINSTALL ==========
helm uninstall my-nginx`;

const helmChartStructure = `# Helm Chart Structure

my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── charts/             # Chart dependencies
├── templates/          # K8s manifests (templates)
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── _helpers.tpl    # Template helpers
│   ├── NOTES.txt       # Post-install notes
│   └── tests/          # Test hooks
└── .helmignore         # Files to ignore

# Chart.yaml example:
apiVersion: v2
name: my-app
description: My application chart
type: application
version: 1.0.0           # Chart version
appVersion: "2.0.0"      # App version
dependencies:
  - name: postgresql
    version: "12.1.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled`;

const helmTemplate = `# Helm Template Example

# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        {{- if .Values.resources }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- end }}
        env:
        {{- range $key, $value := .Values.env }}
        - name: {{ $key }}
          value: {{ $value | quote }}
        {{- end }}

# values.yaml (defaults)
replicaCount: 2

image:
  repository: nginx
  tag: "1.25"

service:
  port: 80

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 200m
    memory: 256Mi

env:
  LOG_LEVEL: info`;

// ==========================================
// SECTION 13: NAMESPACES & RBAC
// ==========================================

const namespaceBasics = `# Namespaces - Virtual Clusters

# Namespaces provide:
# - Resource isolation
# - Access control boundaries
# - Resource quotas per namespace
# - Network policy scoping

# Default namespaces:
# - default: for resources without namespace
# - kube-system: K8s system components
# - kube-public: publicly readable
# - kube-node-lease: node heartbeats

# When to use namespaces:
# - Separate environments (dev/staging/prod)
# - Separate teams or projects
# - Separate customers (multi-tenancy)
# - Resource quota enforcement`;

const namespaceCommands = `# Namespace Commands

# Create namespace:
kubectl create namespace my-namespace

# From YAML:
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
  labels:
    environment: development
EOF

# List namespaces:
kubectl get namespaces
kubectl get ns

# Switch default namespace:
kubectl config set-context --current --namespace=my-namespace

# Run command in namespace:
kubectl get pods -n my-namespace
kubectl get all -n my-namespace

# Delete namespace (DELETES ALL RESOURCES IN IT):
kubectl delete namespace my-namespace`;

const resourceQuotaYaml = `# ResourceQuota - Limit namespace resources
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: development
spec:
  hard:
    # Compute resources
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi

    # Object counts
    pods: "20"
    services: "10"
    secrets: "20"
    configmaps: "20"
    persistentvolumeclaims: "5"

---
# LimitRange - Default limits for pods
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: development
spec:
  limits:
  - type: Container
    default:
      cpu: 200m
      memory: 256Mi
    defaultRequest:
      cpu: 100m
      memory: 128Mi
    max:
      cpu: "2"
      memory: 2Gi
    min:
      cpu: 50m
      memory: 64Mi`;

const rbacBasics = `# RBAC - Role-Based Access Control

# RBAC controls WHO can do WHAT on WHICH resources

# Key concepts:
# - Subject: user, group, or service account
# - Role: set of permissions (verbs on resources)
# - RoleBinding: binds role to subject

# Role types:
# - Role: namespace-scoped
# - ClusterRole: cluster-scoped

# Binding types:
# - RoleBinding: binds to namespace
# - ClusterRoleBinding: binds cluster-wide

# Verbs (actions):
# get, list, watch, create, update, patch, delete

# Common ClusterRoles:
# - view: read-only access
# - edit: read/write (no RBAC)
# - admin: full access (no RBAC)
# - cluster-admin: superuser`;

const rbacExamples = `# RBAC Examples

# Role - namespace permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: development
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: ["create"]

---
# RoleBinding - bind role to user
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: development
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: my-app
  namespace: development
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ClusterRole - cluster-wide permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "list"]

---
# ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: developers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io`;

const serviceAccountYaml = `# ServiceAccount - Identity for pods
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app
  namespace: default
automountServiceAccountToken: true

---
# Use ServiceAccount in Pod
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  serviceAccountName: my-app
  containers:
  - name: app
    image: my-app:latest

---
# Create token for ServiceAccount (K8s 1.24+)
kubectl create token my-app

# Or create long-lived secret token:
apiVersion: v1
kind: Secret
metadata:
  name: my-app-token
  annotations:
    kubernetes.io/service-account.name: my-app
type: kubernetes.io/service-account-token`;

// ==========================================
// SECTION 14: MONITORING & LOGGING
// ==========================================

const monitoringStack = `# Kubernetes Monitoring Stack

# Common monitoring tools:
# - Prometheus: metrics collection
# - Grafana: visualization
# - Alertmanager: alerting
# - Loki: log aggregation
# - Jaeger/Zipkin: distributed tracing

# Metrics types:
# - Node metrics (CPU, memory, disk)
# - Pod metrics (container resources)
# - Application metrics (custom)
# - Cluster metrics (API server, etcd)

# Built-in:
# - metrics-server: basic CPU/memory
# - kubectl top pods/nodes

# Install metrics-server:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# View metrics:
kubectl top nodes
kubectl top pods
kubectl top pods -A --sort-by=memory`;

const prometheusInstall = `# Install Prometheus with Helm

# Add repository:
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install full stack (Prometheus + Grafana + Alertmanager):
helm install monitoring prometheus-community/kube-prometheus-stack \\
  -n monitoring --create-namespace \\
  --set prometheus.prometheusSpec.retention=30d \\
  --set grafana.adminPassword=admin

# Port forward to Grafana:
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
# Access at http://localhost:3000 (admin/admin)

# Port forward to Prometheus:
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
# Access at http://localhost:9090

# List installed resources:
kubectl get all -n monitoring`;

const prometheusMetrics = `# Application Metrics with Prometheus

# ServiceMonitor - auto-discover metrics endpoints
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-monitor
  namespace: monitoring
  labels:
    release: monitoring  # Must match Prometheus selector
spec:
  selector:
    matchLabels:
      app: my-app
  namespaceSelector:
    matchNames:
    - default
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s

---
# PodMonitor - monitor pods directly
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: my-app-pods
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-app
  podMetricsEndpoints:
  - port: metrics
    path: /metrics
    interval: 15s`;

const loggingStack = `# Kubernetes Logging

# Log collection options:
# - Fluentd / Fluent Bit
# - Loki + Promtail
# - ELK Stack (Elasticsearch + Logstash + Kibana)
# - Cloud solutions (CloudWatch, Stackdriver)

# Install Loki Stack:
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm install loki grafana/loki-stack \\
  -n logging --create-namespace \\
  --set promtail.enabled=true \\
  --set grafana.enabled=false  # Use existing Grafana

# Add Loki as datasource in Grafana:
# URL: http://loki.logging:3100

# View logs in Grafana:
# 1. Go to Explore
# 2. Select Loki datasource
# 3. Use LogQL: {namespace="default", app="my-app"}

# LogQL examples:
# {job="my-app"} |= "error"
# {namespace="default"} | json | level="error"
# rate({app="nginx"}[5m])`;

// ==========================================
// SECTION 15: BEST PRACTICES
// ==========================================

const bestPracticesResources = `# Best Practices: Resource Management

# ALWAYS set resource requests and limits
resources:
  requests:
    cpu: 100m        # Minimum needed
    memory: 128Mi
  limits:
    cpu: 200m        # Maximum allowed
    memory: 256Mi

# Guidelines:
# - Start with requests = actual usage
# - Set limits 2-3x requests initially
# - Monitor and adjust based on metrics
# - Use VPA (Vertical Pod Autoscaler) for recommendations

# CPU:
# - 1 CPU = 1000m (millicores)
# - 100m = 0.1 CPU = 10% of a core
# - Requests: for scheduling
# - Limits: throttled if exceeded

# Memory:
# - Use Mi (mebibytes) or Gi (gibibytes)
# - Requests: for scheduling
# - Limits: OOMKilled if exceeded

# Anti-patterns to avoid:
# - No limits (can starve other pods)
# - Limits too low (constant throttling)
# - Requests too high (wasted resources)`;

const bestPracticesSecurity = `# Best Practices: Security

# 1. Run as non-root
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000

# 2. Read-only filesystem
securityContext:
  readOnlyRootFilesystem: true
volumeMounts:
- name: tmp
  mountPath: /tmp
volumes:
- name: tmp
  emptyDir: {}

# 3. Drop all capabilities
securityContext:
  capabilities:
    drop:
      - ALL

# 4. Use NetworkPolicies
# - Default deny all ingress/egress
# - Explicitly allow needed traffic

# 5. Secrets management
# - Never commit secrets to git
# - Use external secret managers
# - Rotate secrets regularly

# 6. Image security
# - Use specific image tags (not :latest)
# - Scan images for vulnerabilities
# - Use private registries
# - Sign and verify images`;

const bestPracticesHA = `# Best Practices: High Availability

# 1. Multiple replicas
spec:
  replicas: 3    # At least 2 for HA

# 2. Pod Anti-Affinity (spread across nodes)
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchLabels:
            app: my-app
        topologyKey: kubernetes.io/hostname

# 3. Pod Disruption Budget
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-app-pdb
spec:
  minAvailable: 2    # or maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app

# 4. Topology Spread Constraints
topologySpreadConstraints:
- maxSkew: 1
  topologyKey: topology.kubernetes.io/zone
  whenUnsatisfiable: DoNotSchedule
  labelSelector:
    matchLabels:
      app: my-app

# 5. Proper health checks
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 3`;

const bestPracticesGeneral = `# General Best Practices

# 1. Use declarative YAML (not imperative commands)
kubectl apply -f deployment.yaml  # Good
kubectl create deployment ...     # Avoid in production

# 2. Use namespaces
# - Separate environments
# - Apply resource quotas
# - Control access with RBAC

# 3. Label everything
metadata:
  labels:
    app: my-app
    version: v1.0.0
    environment: production
    team: backend

# 4. Use ConfigMaps and Secrets
# - Don't hardcode config in images
# - Separate config from code

# 5. Implement GitOps
# - Store manifests in git
# - Use ArgoCD or Flux
# - Automated deployments

# 6. Monitoring and alerting
# - Set up Prometheus + Grafana
# - Create dashboards
# - Configure alerts

# 7. Regular backups
# - Backup etcd
# - Backup PersistentVolumes
# - Test restore procedures

# 8. Keep clusters updated
# - Regular K8s version upgrades
# - Update node OS
# - Patch security vulnerabilities`;

// ==========================================
// SECTION 16: REAL-WORLD EXAMPLES
// ==========================================

const fullStackExample = `# Full Stack Application Deployment

# 1. Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: my-app

---
# 2. ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: my-app
data:
  DATABASE_HOST: postgres-service
  REDIS_HOST: redis-service
  LOG_LEVEL: info

---
# 3. Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: my-app
type: Opaque
stringData:
  DATABASE_PASSWORD: supersecret
  JWT_SECRET: jwt-secret-key

---
# 4. PostgreSQL StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: my-app
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_PASSWORD
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi`;

const fullStackExample2 = `# Full Stack Application (continued)

# 5. PostgreSQL Service
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: my-app
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None

---
# 6. Redis Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379

---
# 7. Redis Service
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: my-app
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379

---
# 8. Backend API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: myapp/backend:v1.0.0
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080`;

const fullStackExample3 = `# Full Stack Application (final)

# 9. Backend Service
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: my-app
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080

---
# 10. Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: my-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: myapp/frontend:v1.0.0
        ports:
        - containerPort: 80
        env:
        - name: API_URL
          value: "http://backend-service"

---
# 11. Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: my-app
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80

---
# 12. Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: my-app
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    - api.myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  - host: api.myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80`;

const cicdExample = `# CI/CD Pipeline with Kubernetes

# GitHub Actions workflow example:
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: |
        docker build -t myapp:\${{ github.sha }} .
        docker tag myapp:\${{ github.sha }} ghcr.io/myorg/myapp:\${{ github.sha }}

    - name: Push to registry
      run: |
        echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u \${{ github.actor }} --password-stdin
        docker push ghcr.io/myorg/myapp:\${{ github.sha }}

    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: \${{ secrets.KUBE_CONFIG }}

    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/myapp \\
          myapp=ghcr.io/myorg/myapp:\${{ github.sha }} \\
          -n production
        kubectl rollout status deployment/myapp -n production`;

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function KubernetesZeroToHeroPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const category = getCategoryForPost("kubernetes-zero-to-hero");

  const isSpanish = language === "es";

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
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
          <li className={styles.breadcrumbCurrent}>Kubernetes: Zero to Hero</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading level={1} className={styles.title}>
          {isSpanish
            ? "Kubernetes: De Cero a Héroe"
            : "Kubernetes: Zero to Hero"}
        </Heading>
        <Text className={styles.subtitle}>
          {isSpanish
            ? "Guía completa de Kubernetes desde fundamentos hasta producción. Aprende arquitectura, kubectl, k9s, pods, deployments, services, ConfigMaps, Secrets, Helm y más. Con ejemplos prácticos y comandos reales."
            : "Complete Kubernetes guide from fundamentals to production. Learn architecture, kubectl, k9s, pods, deployments, services, ConfigMaps, Secrets, Helm and more. With practical examples and real commands."}
        </Text>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img
          src="/images/kubernetes/k8s-logo.png"
          alt="Kubernetes Logo"
          style={{ width: "100%", maxWidth: "400px", margin: "0 auto", display: "block", borderRadius: "12px" }}
        />
      </div>

      {/* Table of Contents */}
      <Card className={styles.sectionCard}>
        <Heading level={2} className={styles.sectionTitle}>
          {isSpanish ? "Tabla de Contenidos" : "Table of Contents"}
        </Heading>
        <div className={styles.tocGrid}>
          <a href="#intro" className={styles.tocLink}>1. {isSpanish ? "Introducción" : "Introduction"}</a>
          <a href="#architecture" className={styles.tocLink}>2. {isSpanish ? "Arquitectura" : "Architecture"}</a>
          <a href="#installation" className={styles.tocLink}>3. {isSpanish ? "Instalación" : "Installation"}</a>
          <a href="#kubectl" className={styles.tocLink}>4. kubectl</a>
          <a href="#pods" className={styles.tocLink}>5. Pods</a>
          <a href="#deployments" className={styles.tocLink}>6. Deployments</a>
          <a href="#services" className={styles.tocLink}>7. Services</a>
          <a href="#configmaps-secrets" className={styles.tocLink}>8. ConfigMaps & Secrets</a>
          <a href="#volumes" className={styles.tocLink}>9. {isSpanish ? "Volúmenes" : "Volumes"}</a>
          <a href="#networking" className={styles.tocLink}>10. Networking & Ingress</a>
          <a href="#k9s" className={styles.tocLink}>11. K9s Terminal UI</a>
          <a href="#helm" className={styles.tocLink}>12. Helm Charts</a>
          <a href="#namespaces" className={styles.tocLink}>13. Namespaces & RBAC</a>
          <a href="#monitoring" className={styles.tocLink}>14. {isSpanish ? "Monitoreo" : "Monitoring"}</a>
          <a href="#best-practices" className={styles.tocLink}>15. {isSpanish ? "Mejores Prácticas" : "Best Practices"}</a>
          <a href="#real-world" className={styles.tocLink}>16. {isSpanish ? "Ejemplos Reales" : "Real-World Examples"}</a>
        </div>
      </Card>

      {/* Section 1: Introduction */}
      <section id="intro" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>
            1. {isSpanish ? "Introducción a Kubernetes" : "Introduction to Kubernetes"}
          </Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Kubernetes (K8s) es una plataforma de orquestación de contenedores desarrollada por Google. Automatiza el despliegue, escalado y gestión de aplicaciones en contenedores."
              : "Kubernetes (K8s) is a container orchestration platform developed by Google. It automates deployment, scaling, and management of containerized applications."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/k8s-architecture.png" alt="Kubernetes Architecture" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "¿Qué es Kubernetes?" : "What is Kubernetes?"}</Heading>
          <CodeEditor code={whatIsKubernetes} language="bash" readOnly height={450} />
          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "DATO CLAVE" : "KEY FACT"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? 'El nombre "Kubernetes" viene del griego κυβερνήτης (kybernḗtēs), que significa "timonel". Se abrevia K8s porque hay 8 letras entre la K y la s.'
                : 'The name "Kubernetes" comes from Greek κυβερνήτης (kybernḗtēs), meaning "helmsman". It\'s abbreviated K8s because there are 8 letters between K and s.'}
            </Text>
          </div>
          <Heading level={3} className={styles.subSectionTitle}>Kubernetes vs Docker</Heading>
          <CodeEditor code={k8sVsDocker} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Terminología Esencial" : "Essential Terminology"}</Heading>
          <CodeEditor code={k8sTerminology} language="bash" readOnly height={520} />
        </Card>
      </section>

      {/* Section 2: Architecture */}
      <section id="architecture" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>2. {isSpanish ? "Arquitectura de Kubernetes" : "Kubernetes Architecture"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Un cluster de Kubernetes consiste en un Control Plane y Worker Nodes. El Control Plane toma decisiones globales; los Workers ejecutan los contenedores."
              : "A Kubernetes cluster consists of a Control Plane and Worker Nodes. The Control Plane makes global decisions; Workers run the containers."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/cluster-architecture.png" alt="Cluster Architecture" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Componentes del Control Plane" : "Control Plane Components"}</Heading>
          <CodeEditor code={controlPlaneComponents} language="bash" readOnly height={480} />
          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "IMPORTANTE" : "IMPORTANT"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "etcd es el cerebro del cluster. Si se pierde, perdemos todo el estado. Por eso siempre se despliega en alta disponibilidad (3+ réplicas) con backups."
                : "etcd is the brain of the cluster. If lost, we lose all state. That's why it's always deployed in high availability (3+ replicas) with backups."}
            </Text>
          </div>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/node-overview.png" alt="Node Overview" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Componentes del Worker Node" : "Worker Node Components"}</Heading>
          <CodeEditor code={workerNodeComponents} language="bash" readOnly height={420} />
        </Card>
      </section>

      {/* Section 3: Installation */}
      <section id="installation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>3. {isSpanish ? "Instalación" : "Installation"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Hay varias formas de ejecutar Kubernetes localmente. Las más populares son Minikube, Kind y K3s."
              : "There are several ways to run Kubernetes locally. The most popular are Minikube, Kind, and K3s."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Instalar kubectl" : "Install kubectl"}</Heading>
          <CodeEditor code={installKubectl} language="bash" readOnly height={350} />
          <Heading level={3} className={styles.subSectionTitle}>Minikube</Heading>
          <CodeEditor code={installMinikube} language="bash" readOnly height={400} />
          <Heading level={3} className={styles.subSectionTitle}>Kind (Kubernetes in Docker)</Heading>
          <CodeEditor code={installKind} language="bash" readOnly height={400} />
          <Heading level={3} className={styles.subSectionTitle}>K3s</Heading>
          <CodeEditor code={installK3s} language="bash" readOnly height={380} />
          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "RECOMENDACIÓN" : "RECOMMENDATION"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "Principiantes: Minikube. CI/CD: Kind. Edge/IoT: K3s. Producción cloud: EKS, GKE, AKS."
                : "Beginners: Minikube. CI/CD: Kind. Edge/IoT: K3s. Cloud production: EKS, GKE, AKS."}
            </Text>
          </div>
        </Card>
      </section>

      {/* Section 4: kubectl */}
      <section id="kubectl" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>4. kubectl {isSpanish ? "Básico" : "Basics"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "kubectl es la herramienta de línea de comandos para interactuar con Kubernetes. Es esencial dominarla."
              : "kubectl is the command-line tool for interacting with Kubernetes. Mastering it is essential."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Configuración" : "Configuration"}</Heading>
          <CodeEditor code={kubectlConfig} language="bash" readOnly height={420} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Comandos Esenciales" : "Essential Commands"}</Heading>
          <CodeEditor code={kubectlBasicCommands} language="bash" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Comandos Avanzados" : "Advanced Commands"}</Heading>
          <CodeEditor code={kubectlAdvancedCommands} language="bash" readOnly height={520} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Atajos y Aliases" : "Shortcuts & Aliases"}</Heading>
          <CodeEditor code={kubectlShortcuts} language="bash" readOnly height={520} />
        </Card>
      </section>

      {/* Section 5: Pods */}
      <section id="pods" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>5. Pods</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Un Pod es la unidad más pequeña que Kubernetes puede desplegar. Representa uno o más contenedores que comparten recursos."
              : "A Pod is the smallest unit Kubernetes can deploy. It represents one or more containers sharing resources."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/pod-overview.png" alt="Pod Overview" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Conceptos Básicos" : "Pod Basics"}</Heading>
          <CodeEditor code={podBasics} language="bash" readOnly height={320} />
          <Heading level={3} className={styles.subSectionTitle}>Pod YAML</Heading>
          <CodeEditor code={podYamlExample} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Pod Multi-Contenedor (Sidecar)" : "Multi-Container Pod (Sidecar)"}</Heading>
          <CodeEditor code={podMultiContainer} language="yaml" readOnly height={520} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Lifecycle Hooks y Probes" : "Lifecycle Hooks & Probes"}</Heading>
          <CodeEditor code={podLifecycleHooks} language="yaml" readOnly height={520} />
          <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "ADVERTENCIA" : "WARNING"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "Nunca crees Pods directamente en producción. Usa Deployments o StatefulSets. Los Pods no se recrean automáticamente."
                : "Never create Pods directly in production. Use Deployments or StatefulSets. Pods won't be recreated automatically."}
            </Text>
          </div>
        </Card>
      </section>

      {/* Section 6: Deployments */}
      <section id="deployments" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>6. Deployments</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Los Deployments son la forma recomendada de gestionar aplicaciones. Proporcionan actualizaciones, escalado y auto-recuperación."
              : "Deployments are the recommended way to manage applications. They provide updates, scaling, and self-healing."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/deployment-overview.png" alt="Deployment Overview" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Conceptos" : "Concepts"}</Heading>
          <CodeEditor code={deploymentBasics} language="bash" readOnly height={320} />
          <Heading level={3} className={styles.subSectionTitle}>deployment.yaml</Heading>
          <CodeEditor code={deploymentYaml} language="yaml" readOnly height={560} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Comandos" : "Commands"}</Heading>
          <CodeEditor code={deploymentCommands} language="bash" readOnly height={520} />
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/scaling.png" alt="Scaling" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
        </Card>
      </section>

      {/* Section 7: Services */}
      <section id="services" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>7. Services</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Los Services proporcionan una dirección de red estable para acceder a Pods. Son esenciales para la comunicación."
              : "Services provide a stable network address to access Pods. They are essential for communication."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/service-types.png" alt="Service Types" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Conceptos" : "Concepts"}</Heading>
          <CodeEditor code={serviceBasics} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>ClusterIP Service</Heading>
          <CodeEditor code={serviceClusterIP} language="yaml" readOnly height={420} />
          <Heading level={3} className={styles.subSectionTitle}>NodePort Service</Heading>
          <CodeEditor code={serviceNodePort} language="yaml" readOnly height={340} />
          <Heading level={3} className={styles.subSectionTitle}>LoadBalancer Service</Heading>
          <CodeEditor code={serviceLoadBalancer} language="yaml" readOnly height={420} />
        </Card>
      </section>

      {/* Section 8: ConfigMaps & Secrets */}
      <section id="configmaps-secrets" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>8. ConfigMaps & Secrets</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "ConfigMaps y Secrets permiten separar la configuración del código. ConfigMaps para datos no sensibles, Secrets para sensibles."
              : "ConfigMaps and Secrets separate configuration from code. ConfigMaps for non-sensitive data, Secrets for sensitive."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>ConfigMaps</Heading>
          <CodeEditor code={configMapBasics} language="bash" readOnly height={200} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Ejemplos de ConfigMap" : "ConfigMap Examples"}</Heading>
          <CodeEditor code={configMapExamples} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Uso en Pods" : "Usage in Pods"}</Heading>
          <CodeEditor code={configMapUsage} language="yaml" readOnly height={520} />
          <Heading level={3} className={styles.subSectionTitle}>Secrets</Heading>
          <CodeEditor code={secretBasics} language="bash" readOnly height={300} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Ejemplos de Secrets" : "Secret Examples"}</Heading>
          <CodeEditor code={secretExamples} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Uso de Secrets" : "Using Secrets"}</Heading>
          <CodeEditor code={secretUsage} language="yaml" readOnly height={480} />
          <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "SEGURIDAD" : "SECURITY"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "Los Secrets solo están en base64, NO encriptados. Usa encryption at rest y considera HashiCorp Vault o AWS Secrets Manager."
                : "Secrets are only base64 encoded, NOT encrypted. Enable encryption at rest and consider HashiCorp Vault or AWS Secrets Manager."}
            </Text>
          </div>
        </Card>
      </section>

      {/* Section 9: Volumes */}
      <section id="volumes" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>9. {isSpanish ? "Volúmenes y Almacenamiento" : "Volumes & Storage"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Kubernetes ofrece varios tipos de almacenamiento: temporal, persistente, y dinámico mediante StorageClasses."
              : "Kubernetes offers various storage types: temporary, persistent, and dynamic via StorageClasses."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Tipos de Volúmenes" : "Volume Types"}</Heading>
          <CodeEditor code={volumeTypes} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Ejemplos de Volúmenes" : "Volume Examples"}</Heading>
          <CodeEditor code={volumeExamples} language="yaml" readOnly height={450} />
          <Heading level={3} className={styles.subSectionTitle}>PersistentVolume & PVC</Heading>
          <CodeEditor code={persistentVolumeYaml} language="yaml" readOnly height={580} />
          <Heading level={3} className={styles.subSectionTitle}>StorageClass</Heading>
          <CodeEditor code={storageClassYaml} language="yaml" readOnly height={580} />
        </Card>
      </section>

      {/* Section 10: Networking */}
      <section id="networking" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>10. Networking & Ingress</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Kubernetes tiene un modelo de red plano donde todos los pods pueden comunicarse entre sí. Ingress proporciona acceso HTTP externo."
              : "Kubernetes has a flat network model where all pods can communicate with each other. Ingress provides external HTTP access."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Modelo de Red" : "Networking Model"}</Heading>
          <CodeEditor code={networkingBasics} language="bash" readOnly height={340} />
          <Heading level={3} className={styles.subSectionTitle}>NetworkPolicy</Heading>
          <CodeEditor code={networkPolicyYaml} language="yaml" readOnly height={560} />
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/ingress-diagram.png" alt="Ingress Diagram" style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>Ingress {isSpanish ? "Conceptos" : "Concepts"}</Heading>
          <CodeEditor code={ingressBasics} language="bash" readOnly height={340} />
          <Heading level={3} className={styles.subSectionTitle}>Ingress YAML</Heading>
          <CodeEditor code={ingressYaml} language="yaml" readOnly height={580} />
          <Heading level={3} className={styles.subSectionTitle}>Ingress TLS</Heading>
          <CodeEditor code={ingressTLS} language="yaml" readOnly height={420} />
        </Card>
      </section>

      {/* Section 11: K9s */}
      <section id="k9s" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>11. K9s - Terminal UI</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "K9s es una interfaz de terminal para Kubernetes que facilita la navegación y gestión de recursos del cluster."
              : "K9s is a terminal UI for Kubernetes that makes it easy to navigate and manage cluster resources."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/k9s-logo.png" alt="K9s Logo" style={{ width: "100%", maxWidth: "300px", margin: "0 auto", display: "block", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Instalación" : "Installation"}</Heading>
          <CodeEditor code={k9sInstall} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Navegación y Atajos" : "Navigation & Shortcuts"}</Heading>
          <CodeEditor code={k9sNavigation} language="bash" readOnly height={520} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Funciones Avanzadas" : "Advanced Features"}</Heading>
          <CodeEditor code={k9sAdvanced} language="bash" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>Custom Hotkeys</Heading>
          <CodeEditor code={k9sHotkeys} language="yaml" readOnly height={420} />
          <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "CONSEJO PRO" : "PRO TIP"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "K9s es mucho más rápido que kubectl para tareas interactivas. Usa / para filtrar, l para logs, s para shell, y d para describe."
                : "K9s is much faster than kubectl for interactive tasks. Use / to filter, l for logs, s for shell, and d for describe."}
            </Text>
          </div>
        </Card>
      </section>

      {/* Section 12: Helm */}
      <section id="helm" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>12. Helm Charts</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Helm es el gestor de paquetes de Kubernetes. Permite instalar aplicaciones complejas con un solo comando."
              : "Helm is the package manager for Kubernetes. It allows installing complex applications with a single command."}
          </Text>
          <div className={styles.conceptImage}>
            <img src="/images/kubernetes/helm-logo.png" alt="Helm Logo" style={{ width: "100%", maxWidth: "200px", margin: "0 auto", display: "block", borderRadius: "8px", marginBottom: "1.5rem" }} />
          </div>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "¿Qué es Helm?" : "What is Helm?"}</Heading>
          <CodeEditor code={helmBasics} language="bash" readOnly height={340} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Instalación" : "Installation"}</Heading>
          <CodeEditor code={helmInstall} language="bash" readOnly height={420} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Comandos Esenciales" : "Essential Commands"}</Heading>
          <CodeEditor code={helmCommands} language="bash" readOnly height={520} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Estructura de un Chart" : "Chart Structure"}</Heading>
          <CodeEditor code={helmChartStructure} language="yaml" readOnly height={420} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Ejemplo de Template" : "Template Example"}</Heading>
          <CodeEditor code={helmTemplate} language="yaml" readOnly height={580} />
        </Card>
      </section>

      {/* Section 13: Namespaces & RBAC */}
      <section id="namespaces" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>13. Namespaces & RBAC</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Los Namespaces proporcionan aislamiento lógico. RBAC controla quién puede hacer qué en el cluster."
              : "Namespaces provide logical isolation. RBAC controls who can do what in the cluster."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>Namespaces</Heading>
          <CodeEditor code={namespaceBasics} language="bash" readOnly height={300} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Comandos" : "Commands"}</Heading>
          <CodeEditor code={namespaceCommands} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>ResourceQuota & LimitRange</Heading>
          <CodeEditor code={resourceQuotaYaml} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>RBAC {isSpanish ? "Conceptos" : "Concepts"}</Heading>
          <CodeEditor code={rbacBasics} language="bash" readOnly height={340} />
          <Heading level={3} className={styles.subSectionTitle}>RBAC {isSpanish ? "Ejemplos" : "Examples"}</Heading>
          <CodeEditor code={rbacExamples} language="yaml" readOnly height={620} />
          <Heading level={3} className={styles.subSectionTitle}>ServiceAccount</Heading>
          <CodeEditor code={serviceAccountYaml} language="yaml" readOnly height={380} />
        </Card>
      </section>

      {/* Section 14: Monitoring */}
      <section id="monitoring" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>14. {isSpanish ? "Monitoreo y Logging" : "Monitoring & Logging"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "El monitoreo es esencial para operar Kubernetes en producción. Prometheus + Grafana es el stack más popular."
              : "Monitoring is essential for running Kubernetes in production. Prometheus + Grafana is the most popular stack."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Stack de Monitoreo" : "Monitoring Stack"}</Heading>
          <CodeEditor code={monitoringStack} language="bash" readOnly height={360} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Instalar Prometheus" : "Install Prometheus"}</Heading>
          <CodeEditor code={prometheusInstall} language="bash" readOnly height={380} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Métricas de Aplicación" : "Application Metrics"}</Heading>
          <CodeEditor code={prometheusMetrics} language="yaml" readOnly height={420} />
          <Heading level={3} className={styles.subSectionTitle}>Logging (Loki)</Heading>
          <CodeEditor code={loggingStack} language="bash" readOnly height={380} />
        </Card>
      </section>

      {/* Section 15: Best Practices */}
      <section id="best-practices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>15. {isSpanish ? "Mejores Prácticas" : "Best Practices"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Estas prácticas te ayudarán a ejecutar cargas de trabajo de producción de manera segura y eficiente."
              : "These practices will help you run production workloads safely and efficiently."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Gestión de Recursos" : "Resource Management"}</Heading>
          <CodeEditor code={bestPracticesResources} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Seguridad" : "Security"}</Heading>
          <CodeEditor code={bestPracticesSecurity} language="yaml" readOnly height={480} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Alta Disponibilidad" : "High Availability"}</Heading>
          <CodeEditor code={bestPracticesHA} language="yaml" readOnly height={560} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Prácticas Generales" : "General Practices"}</Heading>
          <CodeEditor code={bestPracticesGeneral} language="bash" readOnly height={480} />
        </Card>
      </section>

      {/* Section 16: Real-World Examples */}
      <section id="real-world" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2} className={styles.sectionTitle}>16. {isSpanish ? "Ejemplos del Mundo Real" : "Real-World Examples"}</Heading>
          <Text className={styles.sectionDescription}>
            {isSpanish
              ? "Un ejemplo completo de aplicación full-stack desplegada en Kubernetes con base de datos, cache, backend, frontend e Ingress."
              : "A complete full-stack application example deployed on Kubernetes with database, cache, backend, frontend, and Ingress."}
          </Text>
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Aplicación Full-Stack (Parte 1)" : "Full-Stack App (Part 1)"}</Heading>
          <CodeEditor code={fullStackExample} language="yaml" readOnly height={620} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Aplicación Full-Stack (Parte 2)" : "Full-Stack App (Part 2)"}</Heading>
          <CodeEditor code={fullStackExample2} language="yaml" readOnly height={620} />
          <Heading level={3} className={styles.subSectionTitle}>{isSpanish ? "Aplicación Full-Stack (Parte 3)" : "Full-Stack App (Part 3)"}</Heading>
          <CodeEditor code={fullStackExample3} language="yaml" readOnly height={620} />
          <Heading level={3} className={styles.subSectionTitle}>CI/CD Pipeline</Heading>
          <CodeEditor code={cicdExample} language="yaml" readOnly height={480} />
          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>{isSpanish ? "SIGUIENTE PASO" : "NEXT STEP"}</div>
            <Text className={styles.infoText}>
              {isSpanish
                ? "Ahora que conoces los fundamentos, practica creando tu propio cluster con Minikube o Kind, y despliega una aplicación simple. La práctica es la mejor forma de aprender Kubernetes."
                : "Now that you know the fundamentals, practice by creating your own cluster with Minikube or Kind, and deploy a simple application. Practice is the best way to learn Kubernetes."}
            </Text>
          </div>
        </Card>
      </section>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary">
          {isSpanish ? "← Volver al Blog" : "← Back to Blog"}
        </ButtonLink>
        {category && (
          <ButtonLink href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)} variant="secondary">
            {category.title} →
          </ButtonLink>
        )}
      </nav>
    </BlogContentLayout>
  );
}
