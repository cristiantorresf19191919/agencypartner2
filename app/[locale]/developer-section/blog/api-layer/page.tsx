"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function APILayerPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
        {/* Breadcrumb */}
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
              <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("nav-blog")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={styles.breadcrumbCurrent}>{t("api-layer-title")}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            {t("api-layer-title")}
          </Heading>
          <Text className={styles.subtitle}>
            {t("api-layer-subtitle")}
          </Text>
          <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-6`}>
            <Text className={styles.infoText}>
              {t("api-layer-intro-note")}
            </Text>
          </div>
        </div>

        {/* What is an API Layer */}
        <section id="what-is-api-layer" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-what-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("api-layer-what-desc")}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>{t("api-layer-what-benefit-title")}</strong>
                  <br />
                  {t("api-layer-what-benefit-desc")}
                </Text>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Bad Code: Mixed API and UI */}
        <section id="bad-example" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-bad-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("api-layer-bad-desc")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ BAD: Mixed API and UI code
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiClient } from "@/api/client";

export function UserProfile() {
  const { handle } = useParams<{ handle: string }>();
  const [user, setUser] = useState();
  const [userShouts, setUserShouts] = useState();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // API details mixed with UI logic
    apiClient
      .get(\`/user/\${handle}\`)  // Endpoint path in component
      .then((response) => setUser(response.data))
      .catch(() => setHasError(true));

    apiClient
      .get(\`/user/\${handle}/shouts\`)  // Another endpoint in component
      .then((response) => setUserShouts(response.data))
      .catch(() => setHasError(true));
  }, [handle]);

  if (hasError) return <div>An error occurred</div>;
  if (!user || !userShouts) return <LoadingSpinner />;

  return <div>{/* UI code */}</div>;
}

// Problems:
// - Component knows about API endpoints (/user/:handle)
// - Component knows about HTTP methods (GET)
// - Component handles API response structure (response.data)
// - Hard to reuse this API logic in other components
// - If endpoint changes, must update component code`}
                good={`// ✅ GOOD: Separated API layer
// src/api/user.ts
import { apiClient } from "./client";

async function getUser(handle: string) {
  const response = await apiClient.get(\`/user/\${handle}\`);
  return response.data;
}

async function getUserShouts(handle: string) {
  const response = await apiClient.get(\`/user/\${handle}/shouts\`);
  return response.data;
}

export default { getUser, getUserShouts };

// Component - clean and focused on UI
import UserApi from "@/api/user";

export function UserProfile() {
  const { handle } = useParams<{ handle: string }>();
  const [user, setUser] = useState();
  const [userShouts, setUserShouts] = useState();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!handle) return;

    UserApi.getUser(handle)
      .then((data) => setUser(data))
      .catch(() => setHasError(true));

    UserApi.getUserShouts(handle)
      .then((data) => setUserShouts(data))
      .catch(() => setHasError(true));
  }, [handle]);

  // Component only cares about UI
  if (hasError) return <div>An error occurred</div>;
  if (!user || !userShouts) return <LoadingSpinner />;

  return <div>{/* UI code */}</div>;
}

// Benefits:
// - Component doesn't know endpoint paths
// - Component doesn't know HTTP methods
// - API logic is reusable
// - Easy to change API without touching UI`}
              />
            </Stack>
          </Card>
        </section>

        {/* Why API Layer Matters */}
        <section id="why-matters" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-why-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("api-layer-why-desc")}
                </Text>
              </div>

              <div className="space-y-4">
                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>1. {t("api-layer-why-separation-title")}</strong>
                    <br />
                    {t("api-layer-why-separation-desc")}
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>2. {t("api-layer-why-maintainability-title")}</strong>
                    <br />
                    {t("api-layer-why-maintainability-desc")}
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>3. {t("api-layer-why-reusability-title")}</strong>
                    <br />
                    {t("api-layer-why-reusability-desc")}
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>4. {t("api-layer-why-flexibility-title")}</strong>
                    <br />
                    {t("api-layer-why-flexibility-desc")}
                  </Text>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Building with Custom Hooks */}
        <section id="custom-hooks" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-hooks-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("api-layer-hooks-desc")}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  {t("api-layer-hooks-benefit")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ BAD: Basic fetch functions without hooks
// api/user.ts
export async function getUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// Component - must manage state manually
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;
  return <div>{user?.name}</div>;
}

// Problems:
// - Repetitive state management in every component
// - Loading and error states duplicated
// - Not type-safe
// - Can't easily cancel requests`}
                good={`// ✅ GOOD: Custom hooks for API layer
// hooks/useFetch.ts
import { useState } from "react";

type UseFetchProps = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

export function useFetch<T>({ url, method }: UseFetchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const commonFetch = async (input?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: input ? JSON.stringify(input) : undefined,
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      return jsonData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, commonFetch };
}

// api/user.ts
import { useFetch } from "@/hooks/useFetch";
import { User } from "@/types";

export const useGetUser = () => {
  const { commonFetch, isLoading, data, error } = useFetch<User>({
    url: "/api/users",
    method: "GET",
  });

  const getUser = (id: string) => 
    commonFetch({ id });

  return { getUser, isLoading, data, error };
};

// Component - clean and declarative
function UserProfile({ userId }) {
  const { getUser, isLoading, data: user, error } = useGetUser();

  useEffect(() => {
    getUser(userId);
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user?.name}</div>;
}

// Benefits:
// - Reusable loading/error state
// - Type-safe with TypeScript generics
// - Consistent interface across all API calls
// - Easy to extend with abort logic, caching, etc.`}
              />
            </Stack>
          </Card>
        </section>

        {/* Complete Example: Structured API Layer */}
        <section id="complete-example" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-complete-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("api-layer-complete-desc")}
                </Text>
              </div>

              <div className="space-y-6">
                <div>
                  <Heading level={3} className="text-lg font-semibold mb-2">
                    {t("api-layer-complete-structure-title")}
                  </Heading>
                  <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`api/
  supplier/
    types.ts      # TypeScript types
    requests.ts   # Individual API hooks
    api.ts        # Aggregated API hook
  user/
    types.ts
    requests.ts
    api.ts
hooks/
  useFetch.ts     # Base fetch hook`}
                  </pre>
                </div>

                <div>
                  <Heading level={3} className="text-lg font-semibold mb-2">
                    {t("api-layer-complete-types-title")}
                  </Heading>
                  <CodeComparison
                    language="typescript"
                    wrong={`// ❌ Types scattered or missing
function getUser(id) {  // No type information
  return fetch(\`/api/users/\${id}\`);
}

// Component doesn't know what to expect
const user = await getUser("123");
console.log(user.name); // TypeScript error: Property 'name' does not exist`}
                    good={`// ✅ Types defined clearly
// api/user/types.ts
export type User = {
  id: string;
  name: string;
  email: string;
  createdOn: string;
};

export type GetUserInput = { id: string };

// api/user/requests.ts
import { useFetch } from "@/hooks/useFetch";
import { User, GetUserInput } from "./types";

export const useGetUser = () => {
  const { commonFetch, isLoading, data, error } = useFetch<User>({
    url: "/api/users/get",
    method: "GET",
  });

  const getUser = (input: GetUserInput) => 
    commonFetch({ input });

  return { getUser, isLoading, data, error };
};

// Component - fully type-safe
const { getUser, data } = useGetUser();
await getUser({ id: "123" });
// TypeScript knows data is User | null
console.log(data?.name); // ✅ Type-safe!`}
                  />
                </div>

                <div>
                  <Heading level={3} className="text-lg font-semibold mb-2">
                    {t("api-layer-complete-aggregation-title")}
                  </Heading>
                  <CodeComparison
                    language="tsx"
                    wrong={`// ❌ Multiple hooks imported separately
import { useGetUser } from "@/api/user/requests";
import { useGetUserPosts } from "@/api/user/requests";
import { useUpdateUser } from "@/api/user/requests";

function UserProfile() {
  const { getUser, isLoading: getUserLoading } = useGetUser();
  const { getPosts, isLoading: getPostsLoading } = useGetUserPosts();
  const { updateUser, isLoading: updateLoading } = useUpdateUser();

  // Messy and verbose...`}
                    good={`// ✅ Single aggregated hook
// api/user/api.ts
import { useGetUser, useGetUserPosts, useUpdateUser } from "./requests";

export const useUserApi = () => {
  const getUserHook = useGetUser();
  const getPostsHook = useGetUserPosts();
  const updateUserHook = useUpdateUser();

  return {
    getUser: {
      query: getUserHook.getUser,
      isLoading: getUserHook.isLoading,
      data: getUserHook.data,
    },
    getPosts: {
      query: getPostsHook.getUserPosts,
      isLoading: getPostsHook.isLoading,
      data: getPostsHook.data,
    },
    updateUser: {
      mutation: updateUserHook.updateUser,
      isLoading: updateUserHook.isLoading,
      data: updateUserHook.data,
    },
  };
};

// Component - clean and organized
import { useUserApi } from "@/api/user/api";

function UserProfile() {
  const {
    getUser: { query: getUser, data: user, isLoading: userLoading },
    getPosts: { query: getPosts, data: posts, isLoading: postsLoading },
    updateUser: { mutation: updateUser },
  } = useUserApi();

  // Clean, predictable interface!`}
                  />
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Key Takeaways */}
        <section id="key-takeaways" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("api-layer-takeaways-title")}
                </Heading>
              </div>

              <div className="space-y-4">
                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>✓ {t("api-layer-takeaway-1")}</strong>
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>✓ {t("api-layer-takeaway-2")}</strong>
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>✓ {t("api-layer-takeaway-3")}</strong>
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>✓ {t("api-layer-takeaway-4")}</strong>
                  </Text>
                </div>

                <div className={styles.infoBox}>
                  <Text className={styles.infoText}>
                    <strong>✓ {t("api-layer-takeaway-5")}</strong>
                  </Text>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Back to Blog */}
        <div className={styles.backButton}>
          <ButtonLink
            variant="secondary"
            href={createLocalizedPath("/developer-section/blog")}
            className="!bg-white !text-purple-600 !border-transparent hover:!bg-gray-100 shadow-lg px-8 py-3 rounded-full font-semibold"
          >
            ← {t("blog-back-blog")}
          </ButtonLink>
        </div>
    </BlogContentLayout>
  );
}

