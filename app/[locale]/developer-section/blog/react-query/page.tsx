"use client";

import { Stack, Heading, Text, ButtonLink, CodeEditor, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ReactQueryPage() {
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
          <li className={styles.breadcrumbCurrent}>React Query</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          React Query: Production-Grade Patterns
        </Heading>
        <Text className={styles.subtitle}>
          Here are <strong>Production-Grade</strong> examples for React Query. These go beyond the basics. "Realistic" in a senior context means handling <strong>TypeScript</strong>, <strong>Optimistic Updates</strong> (updating UI before server responds), <strong>Race Conditions</strong>, and <strong>Data Transformation</strong>.
        </Text>
      </div>

      {/* Unit 70: Advanced Mutations (Optimistic Updates) */}
      <section id="optimistic-updates" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Unit 70: Advanced Mutations (The "Optimistic Update" Pattern)
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Real-World Scenario:</strong> A "Like" button or "Todo Checkbox." Users expect this to be instant. You cannot wait 200ms for the server to reply.
                <br /><br />
                <strong>The Realistic Complexity:</strong>
                <br />
                1. User clicks "Like".
                <br />
                2. <strong>Immediately</strong> update the UI to show the heart (Optimistic).
                <br />
                3. Send request to server.
                <br />
                4. If server fails, <strong>Rollback</strong> to the previous state automatically.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> In production, users expect instant feedback when interacting with UI elements. By using optimistic updates, we make the app feel instant while still maintaining data consistency through automatic rollback on errors.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// hooks/useToggleLike.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Post } from '@/types';

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => api.post(\`/posts/\${postId}/like\`),

    // 1. ⚡ ON MUTATE: Run before the request is sent
    onMutate: async (postId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value (for rollback if needed)
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(['posts'], (old) => {
        return old?.map(post => 
          post.id === postId 
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        );
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },

    // 2. ❌ ON ERROR: If server fails, roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error("Could not update like status");
    },

    // 3. ✅ ON SETTLED: Always refetch after error or success to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Component Usage
const LikeButton = ({ postId }: { postId: string }) => {
  const { mutate: toggleLike, isPending } = useToggleLike();

  return (
    <button 
      onClick={() => toggleLike(postId)}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      <HeartIcon filled={isLiked} />
      <span>{likes}</span>
    </button>
  );
};`}
              readOnly={true}
              height={500}
            />
          </Stack>
        </Card>
      </section>

      {/* Unit 71 & 73: Search Grid (Cancellation + KeepPreviousData) */}
      <section id="search-grid" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Unit 71 & 73: Search Grid (Cancellation + KeepPreviousData)
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Real-World Scenario:</strong> A Data Table with Search and Pagination.
                <br /><br />
                <strong>The Realistic Complexity:</strong>
                <br />
                • <strong>Race Condition:</strong> User types "Ap", then "Appl". The "Ap" request might finish <em>after</em> "Appl" and show wrong data. (Solved by Cancellation).
                <br />
                • <strong>UX Jitter:</strong> Table shouldn't blink or disappear when switching pages.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> Race conditions can cause incorrect data to be displayed. By using AbortSignal for cancellation and placeholderData for smooth transitions, we ensure data integrity and a polished user experience.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// hooks/useProductSearch.ts
import { useQuery } from '@tanstack/react-query';
import { ProductResponse } from '@/types';

// Standard Senior Pattern: Pass a simplified "filters" object
export const useProductSearch = ({ page, search }: { page: number; search: string }) => {
  return useQuery({
    // 🔑 Key includes all dependencies. If 'search' changes, it refetches.
    queryKey: ['products', page, search], 
    
    // ⚡ Query Function receives the 'signal' for cancellation
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ 
        page: page.toString(), 
        q: search 
      });
      
      // Pass the signal to fetch/axios. 
      // If user types again, browser KILLS this request automatically.
      const res = await fetch(\`/api/products?\${params}\`, { signal });
      if (!res.ok) throw new Error('Network error');
      return res.json() as Promise<ProductResponse>;
    },

    // 🛡️ UX: Keep showing Page 1 data while Page 2 is loading.
    // Prevents the "Loading Spinner Flash" between pages.
    placeholderData: (previousData) => previousData, 
    
    // 🧠 Cache: Keep unused pages in memory for 5 mins so "Back" button is instant
    staleTime: 1000 * 60 * 5, 
  });
};

// Component Usage
const ProductTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data, isLoading, isFetching } = useProductSearch({ page, search });

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table>
            {data?.products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </table>
          
          <div>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};`}
              readOnly={true}
              height={550}
            />
          </Stack>
        </Card>
      </section>

      {/* Unit 72: Infinite Feed with Data Transformation */}
      <section id="infinite-feed" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Unit 72: Infinite Feed with Data Transformation
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>Real-World Scenario:</strong> A Social Media Feed (Twitter/Instagram).
                <br /><br />
                <strong>The Realistic Complexity:</strong> The API returns "Pages" (arrays of arrays), but the UI just wants one flat list of items.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> The <code>select</code> option allows us to transform data at the query level, keeping components clean and focused on rendering. This is a senior pattern for data transformation that improves both performance and maintainability.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`// hooks/useInfiniteFeed.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(\`/api/feed?page=\${pageParam}\`);
      return res.json();
    },
    
    // Logic to find the next cursor
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },

    // ✨ SENIOR TRICK: The 'select' option
    // Transform the data HERE, not in the component.
    // We flatten the "pages" array into a single "items" array.
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Create a flat array for easy mapping in the UI
      items: data.pages.flatMap((page) => page.results)
    }),
  });
};

// Component Usage (Clean UI)
const Feed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFeed();
  
  // No need to map over pages in the UI anymore!
  // We can just map over 'data.items' because we transformed it above.
  return (
    <div>
      {data?.items.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

// Alternative: Using Intersection Observer for auto-load
const FeedWithAutoLoad = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteFeed();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.items.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
};`}
              readOnly={true}
              height={600}
            />
          </Stack>
        </Card>
      </section>

      {/* Summary Section */}
      <section id="summary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Summary of Senior Practices Used
            </Heading>
            <div className="space-y-4">
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>1. Optimistic UI:</strong> Used <code>onMutate</code> to make the app feel instant (Unit 70). The UI updates immediately, and if the server request fails, we automatically rollback to the previous state.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>2. AbortSignal:</strong> Used for network efficiency and preventing race conditions (Unit 73). When a user types quickly, previous requests are automatically cancelled, ensuring only the latest data is displayed.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>3. Selectors:</strong> Used <code>select</code> to clean up data <em>before</em> it reaches the component (Unit 72). This keeps components focused on rendering and improves performance by transforming data at the query level.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>4. Placeholder Data:</strong> Used to create "Jitter-free" pagination (Unit 71). The previous page's data remains visible while the next page loads, creating a smooth user experience without loading spinners.
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

