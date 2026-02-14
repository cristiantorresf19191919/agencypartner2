"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function MigrationPatternsPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

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
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Migration Patterns</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>Migration & Refactoring Patterns</Heading>
        <Text className={styles.subtitle}>
          Strategies for migrating legacy React code: Class to Hooks migration, Redux to modern state management, upgrading React versions, and incremental refactoring.
        </Text>
      </div>

      <section id="class-to-hooks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>{"🔀"} 1. Class to Hooks Migration</Heading>
              <Text className={styles.sectionDescription}>
                {"Time to say goodbye to class components! 👋 Let's transform those verbose lifecycle methods into sleek, elegant hooks. It's like upgrading from a flip phone to a smartphone — same job, way better experience! 🚀"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> — {"Classes are the past, hooks are the future — this migration is non-negotiable for modern React! 🏗️"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Class vs Functional Components {"•"} State Migration {"•"} Lifecycle to useEffect {"•"} Event Handlers
                </Text>
              </div>
            </div>
            <CodeComparison
              language="tsx"
              wrong={`// ❌ Class Component
class Counter extends React.Component {
  state = { count: 0 };
  
  componentDidMount() {
    document.title = \`Count: \${this.state.count}\`;
  }
  
  componentDidUpdate() {
    document.title = \`Count: \${this.state.count}\`;
  }
  
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}`}
              good={`// ✅ Hooks Equivalent
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

