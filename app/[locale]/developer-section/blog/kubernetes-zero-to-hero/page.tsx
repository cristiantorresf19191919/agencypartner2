"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";
import Image from "next/image";

// --- Code blocks ---
const serverJs = `const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello from Kubernetes!"));
app.get("/healthz", (req, res) => res.status(200).send("ok"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(\`Listening on \${port}\`));`;

const packageJson = `{
  "name": "k8s-zero-hero",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.19.2"
  }
}`;

const dockerfile = `FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["node", "server.js"]`;

const kindSetup = `# Create a cluster
kind create cluster --name k8s-zero-hero
kubectl cluster-info
kubectl get nodes

# Build and load image
docker build -t k8s-zero-hero:1.0.0 .
kind load docker-image k8s-zero-hero:1.0.0 --name k8s-zero-hero

# Optional: delete when done
kind delete cluster --name k8s-zero-hero`;

const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: zero-hero-pod
  labels:
    app: zero-hero
spec:
  containers:
    - name: app
      image: k8s-zero-hero:1.0.0
      ports:
        - containerPort: 3000`;

const podCommands = `kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod zero-hero-pod
kubectl logs zero-hero-pod

# Port-forward to test
kubectl port-forward pod/zero-hero-pod 3000:3000
# curl http://localhost:3000`;

const deploymentYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: zero-hero
spec:
  replicas: 2
  selector:
    matchLabels:
      app: zero-hero
  template:
    metadata:
      labels:
        app: zero-hero
    spec:
      containers:
        - name: app
          image: k8s-zero-hero:1.0.0
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 2
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10`;

const deploymentCommands = `kubectl apply -f deployment.yaml
kubectl get deploy
kubectl get pods -l app=zero-hero
kubectl rollout status deploy/zero-hero

# Scale
kubectl scale deploy/zero-hero --replicas=5
kubectl get pods -l app=zero-hero`;

const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: zero-hero-svc
spec:
  selector:
    app: zero-hero
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP`;

const serviceCommands = `kubectl apply -f service.yaml
kubectl get svc
kubectl port-forward svc/zero-hero-svc 8080:80
# curl http://localhost:8080`;

const ingressYaml = `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zero-hero-ingress
spec:
  rules:
    - host: zerohero.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: zero-hero-svc
                port:
                  number: 80`;

const configmapYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: zero-hero-config
data:
  PORT: "3000"
  GREETING: "Hello from ConfigMap"`;

const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: zero-hero-secret
type: Opaque
data:
  API_KEY: bXktc2VjcmV0LWtleQ==`;

const deploymentEnvFrom = `# In your Deployment spec.containers[0]:
envFrom:
  - configMapRef:
      name: zero-hero-config
  - secretRef:
      name: zero-hero-secret`;

const pvcYaml = `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zero-hero-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi`;

const volumeMountSnippet = `# In Deployment spec.template.spec.containers[0]:
volumeMounts:
  - name: data
    mountPath: /data
# In spec.template.spec:
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: zero-hero-pvc`;

const namespaceCommands = `kubectl create ns playground
kubectl config set-context --current --namespace=playground
kubectl get all`;

const hpaCommand = `kubectl autoscale deploy zero-hero --cpu-percent=50 --min=2 --max=10
kubectl get hpa`;

const jobYaml = `apiVersion: batch/v1
kind: Job
metadata:
  name: hello-job
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: c
          image: busybox
          command: ["sh", "-c", "echo hello && sleep 2"]`;

const cronJobYaml = `apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: c
              image: busybox
              command: ["sh", "-c", "date; echo cron hello"]`;

const debugCommands = `# The 5 commands you'll use daily
kubectl get pods
kubectl describe pod <pod>
kubectl logs <pod>
kubectl exec -it <pod> -- sh
kubectl get events --sort-by=.metadata.creationTimestamp`;

const helmCommands = `helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-nginx bitnami/nginx
kubectl get all`;

export default function KubernetesZeroToHeroPage() {
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
          <li className={styles.breadcrumbCurrent}>Kubernetes Zero to Hero</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Kubernetes From Zero to Hero (Practical Tutorial)
        </Heading>
        <Text className={styles.subtitle}>
          A hands-on course that runs your containers, keeps them healthy, scales them, and exposes them to the network. You will learn <strong>Pods</strong>, <strong>Deployments</strong>, <strong>Services</strong>, <strong>Ingress</strong>, <strong>ConfigMaps/Secrets</strong>, <strong>Volumes</strong>, and <strong>namespaces</strong>—the core you need to “know Kubernetes.” Code editor examples throughout and challenges at the end to evaluate your knowledge.
        </Text>
        <div className={styles.heroImage}>
          <Image
            src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80"
            alt="Kubernetes and containers"
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", borderRadius: "0.75rem", objectFit: "cover" }}
          />
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            <strong>Course structure:</strong> Local cluster with <strong>kind</strong>, a tiny Node.js app, then Pods → Deployments → Services → Ingress → ConfigMaps/Secrets → Volumes → Namespaces → HPA → Jobs/CronJobs → Debugging → Helm → Production habits. Finish with <strong>12 challenges</strong> (Beginner, Intermediate, Advanced) to test yourself.
          </Text>
        </div>
      </div>

      {/* Section 0: What Kubernetes is */}
      <section id="what-is-k8s" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              0) What Kubernetes Actually Is (No Fluff)
            </Heading>
            <Text className={styles.sectionDescription}>
              Kubernetes (K8s) is a <strong>cluster manager</strong> that:
            </Text>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>runs your containers</li>
              <li>keeps them healthy (restarts, reschedules)</li>
              <li>scales them</li>
              <li>exposes them to the network</li>
              <li>rolls out updates safely</li>
            </ul>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Strong opinion:</strong> If you don’t learn Pods, Deployments, Services, Ingress, ConfigMaps/Secrets, Volumes, and namespaces, you don’t “know Kubernetes” yet. Everything else builds on that.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Section 1: Setup kind */}
      <section id="setup-kind" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              1) Setup a Local Cluster (Recommended: kind)
            </Heading>
            <Text className={styles.sectionDescription}>
              Start with <strong>kind</strong> (Kubernetes in Docker). It’s fast, clean, and reproducible. You need: Docker, <code>kubectl</code>, and <code>kind</code>.
            </Text>
            <CodeEditor code={kindSetup} language="shell" readOnly height={220} />
          </Stack>
        </Card>
      </section>

      {/* Section 2: Mental model */}
      <section id="mental-model" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              2) Your First Mental Model
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>Node:</strong> a machine (VM/physical) running workloads</li>
              <li><strong>Pod:</strong> smallest runnable unit (1+ containers)</li>
              <li><strong>Deployment:</strong> keeps Pods running + rolling updates</li>
              <li><strong>Service:</strong> stable network endpoint for Pods</li>
              <li><strong>Ingress:</strong> HTTP routing from outside into Services</li>
              <li><strong>ConfigMap/Secret:</strong> config injection</li>
              <li><strong>Volume/PVC:</strong> storage</li>
            </ul>
          </Stack>
        </Card>
      </section>

      {/* Section 3: Tiny app */}
      <section id="tiny-app" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              3) Build a Tiny App and Containerize It (Node.js Example)
            </Heading>
            <Heading level={3} className={styles.categoryTitle}>server.js</Heading>
            <CodeEditor code={serverJs} language="javascript" readOnly height={180} />
            <Heading level={3} className={styles.categoryTitle}>package.json</Heading>
            <CodeEditor code={packageJson} language="json" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>Dockerfile</Heading>
            <CodeEditor code={dockerfile} language="dockerfile" readOnly height={200} />
            <Text className={styles.sectionDescription}>
              Build: <code>docker build -t k8s-zero-hero:1.0.0 .</code> Then load into kind: <code>kind load docker-image k8s-zero-hero:1.0.0 --name k8s-zero-hero</code>
            </Text>
          </Stack>
        </Card>
      </section>

      {/* Section 4: Pods */}
      <section id="pods" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              4) Pods: Run It Once (Basic)
            </Heading>
            <CodeEditor code={podYaml} language="yaml" readOnly height={200} />
            <CodeEditor code={podCommands} language="shell" readOnly height={180} />
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Why Pods alone are not enough:</strong> if the Pod dies, nothing ensures it comes back. That’s why Deployments exist.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Section 5: Deployments */}
      <section id="deployments" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              5) Deployments: The Real Day-to-Day Tool
            </Heading>
            <Text className={styles.sectionDescription}>
              Deployments keep a desired number of Pods running and support rolling updates. Always use <strong>readinessProbe</strong> and <strong>livenessProbe</strong> for production-like behavior.
            </Text>
            <CodeEditor code={deploymentYaml} language="yaml" readOnly height={380} />
            <CodeEditor code={deploymentCommands} language="shell" readOnly height={200} />
          </Stack>
        </Card>
      </section>

      {/* Section 6: Services */}
      <section id="services" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              6) Services: Stable Networking
            </Heading>
            <Text className={styles.sectionDescription}>
              Pods get replaced; their IPs change. A <strong>Service</strong> gives a stable name and IP so other Pods (or Ingress) can reach your app.
            </Text>
            <CodeEditor code={serviceYaml} language="yaml" readOnly height={200} />
            <CodeEditor code={serviceCommands} language="shell" readOnly height={120} />
          </Stack>
        </Card>
      </section>

      {/* Section 7: Ingress */}
      <section id="ingress" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              7) Ingress: Route HTTP Like a Real Platform
            </Heading>
            <Text className={styles.sectionDescription}>
              Ingress is mandatory once you have more than one service. In kind, install an Ingress controller (e.g. NGINX). Then create an Ingress resource and map the host (e.g. <code>zerohero.local</code>) to localhost in your hosts file.
            </Text>
            <CodeEditor code={ingressYaml} language="yaml" readOnly height={220} />
          </Stack>
        </Card>
      </section>

      {/* Section 8: ConfigMaps & Secrets */}
      <section id="configmaps-secrets" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              8) ConfigMaps &amp; Secrets: Configuration Done Right
            </Heading>
            <Text className={styles.sectionDescription}>
              Don’t hardcode config in images. Inject it with ConfigMap (plain key-value) and Secret (base64 values for sensitive data).
            </Text>
            <Heading level={3} className={styles.categoryTitle}>ConfigMap</Heading>
            <CodeEditor code={configmapYaml} language="yaml" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>Secret (base64 values)</Heading>
            <CodeEditor code={secretYaml} language="yaml" readOnly height={140} />
            <Heading level={3} className={styles.categoryTitle}>Use in Deployment</Heading>
            <CodeEditor code={deploymentEnvFrom} language="yaml" readOnly height={120} />
          </Stack>
        </Card>
      </section>

      {/* Section 9: Storage */}
      <section id="storage" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              9) Storage: Volumes, PV, PVC
            </Heading>
            <Text className={styles.sectionDescription}>
              If your app needs persistence: <strong>PVC</strong> requests storage, <strong>PV</strong> provides it (in cloud usually automatic), and a <strong>Volume</strong> mounts it into a Pod.
            </Text>
            <CodeEditor code={pvcYaml} language="yaml" readOnly height={160} />
            <CodeEditor code={volumeMountSnippet} language="yaml" readOnly height={180} />
          </Stack>
        </Card>
      </section>

      {/* Section 10: Namespaces */}
      <section id="namespaces" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              10) Namespaces: Avoid Chaos
            </Heading>
            <Text className={styles.sectionDescription}>
              Use namespaces early. It saves your sanity when you have multiple apps or environments.
            </Text>
            <CodeEditor code={namespaceCommands} language="shell" readOnly height={100} />
          </Stack>
        </Card>
      </section>

      {/* Section 11: HPA */}
      <section id="hpa" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              11) Autoscaling (HPA)
            </Heading>
            <Text className={styles.sectionDescription}>
              HPA scales your Deployment based on CPU (or memory) metrics. Requires metrics-server in the cluster.
            </Text>
            <CodeEditor code={hpaCommand} language="shell" readOnly height={80} />
          </Stack>
        </Card>
      </section>

      {/* Section 12: Jobs & CronJobs */}
      <section id="jobs-cronjobs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              12) Jobs &amp; CronJobs: Background Work
            </Heading>
            <Heading level={3} className={styles.categoryTitle}>Job</Heading>
            <CodeEditor code={jobYaml} language="yaml" readOnly height={200} />
            <Heading level={3} className={styles.categoryTitle}>CronJob</Heading>
            <CodeEditor code={cronJobYaml} language="yaml" readOnly height={240} />
          </Stack>
        </Card>
      </section>

      {/* Section 13: Debugging */}
      <section id="debugging" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              13) Debugging Like a Pro
            </Heading>
            <Text className={styles.sectionDescription}>
              The 5 commands you’ll use daily:
            </Text>
            <CodeEditor code={debugCommands} language="shell" readOnly height={160} />
            <Heading level={3} className={styles.categoryTitle}>Common failures</Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li><strong>ImagePullBackOff:</strong> image not found / auth / wrong tag</li>
              <li><strong>CrashLoopBackOff:</strong> app exits repeatedly — check logs</li>
              <li><strong>Pending:</strong> no resources / no PV / scheduling constraints</li>
              <li><strong>Readiness failing:</strong> probe wrong or app not ready</li>
            </ul>
          </Stack>
        </Card>
      </section>

      {/* Section 14: Helm */}
      <section id="helm" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              14) Helm (Only After You Understand YAML)
            </Heading>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                <strong>Strong opinion:</strong> Helm is great, but if you start with it, you learn nothing. Master raw YAML first.
              </Text>
            </div>
            <CodeEditor code={helmCommands} language="shell" readOnly height={100} />
          </Stack>
        </Card>
      </section>

      {/* Section 15: Production habits */}
      <section id="production-habits" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              15) “Production” Habits (What Separates Beginners)
            </Heading>
            <ul className={styles.sectionDescription} style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              <li>Always use readiness + liveness probes</li>
              <li>Always set requests/limits</li>
              <li>Use namespaces</li>
              <li>Use Ingress for HTTP</li>
              <li>Use Secrets (and external secret managers in real prod)</li>
              <li>Use observability: logs + metrics + alerts</li>
              <li>Prefer GitOps (ArgoCD/Flux) so the cluster matches Git</li>
            </ul>
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
              Complete these in order. Beginner → Intermediate → Advanced. Use your own kind cluster and the app from this tutorial.
            </Text>

            <Heading level={3} className={styles.categoryTitle}>Beginner</Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }}>
              <li><strong>Namespace:</strong> Create namespace <code>training</code> and deploy the app there. Goal: <code>kubectl get pods -n training</code> shows 2 running pods.</li>
              <li><strong>Scale:</strong> Change replicas from 2 to 4 using <code>kubectl</code> (no YAML edit). Goal: verify with <code>kubectl get pods</code>.</li>
              <li><strong>Service:</strong> Add a Service (ClusterIP) and port-forward it. Goal: <code>curl http://localhost:8080</code> returns the greeting.</li>
              <li><strong>Break it:</strong> Set the image to a wrong tag. Goal: explain what you see in <code>kubectl describe pod</code> and why (e.g. ImagePullBackOff).</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>Intermediate</Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }} start={5}>
              <li><strong>Probes:</strong> Add <code>readinessProbe</code> and <code>livenessProbe</code>. Goal: explain the difference in your own words and show them in YAML.</li>
              <li><strong>ConfigMap:</strong> Create a ConfigMap with <code>GREETING=Hola</code> and read it in the app via env var. Goal: app responds with the greeting from config.</li>
              <li><strong>Resources:</strong> Add resource <code>requests</code> and <code>limits</code>. Goal: show them in <code>kubectl describe pod</code>.</li>
              <li><strong>Rollout:</strong> Roll out a new version <code>k8s-zero-hero:1.0.1</code> with zero downtime. Goal: demonstrate <code>kubectl rollout status</code> and <code>kubectl rollout history</code>.</li>
            </ol>

            <Heading level={3} className={styles.categoryTitle}>Advanced</Heading>
            <ol className={styles.sectionDescription} style={{ listStyle: "decimal", paddingLeft: "1.5rem" }} start={9}>
              <li><strong>HPA:</strong> Set up HPA for the Deployment. Goal: show HPA scaling behavior under load (e.g. with a load generator).</li>
              <li><strong>PVC:</strong> Add a PVC and mount it to <code>/data</code>. Goal: write a file inside the container, delete the pod, confirm the file still exists in a new pod.</li>
              <li><strong>CronJob:</strong> Create a CronJob that runs every minute and logs timestamp. Goal: show logs for at least 3 runs.</li>
              <li><strong>Debug scenario:</strong> Pod is Running but Service returns 503. Find the root cause (e.g. selectors/labels mismatch, wrong targetPort, readiness failing). Goal: write the steps you used and the fix.</li>
            </ol>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                <strong>Tip:</strong> Keep a <code>k8s/</code> folder with all YAML and a Makefile or scripts (e.g. <code>apply-all.sh</code>) so you can practice like a real project. Recreate the cluster with <code>kind delete cluster</code> and <code>kind create cluster</code> to start fresh.
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
        <ButtonLink
          href={createLocalizedPath("/developer-section/blog/terraform")}
          variant="primary"
        >
          Terraform Zero to Hero →
        </ButtonLink>
      </nav>
    </BlogContentLayout>
  );
}
