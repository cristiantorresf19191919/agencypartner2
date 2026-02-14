"use client";

import { Stack, Heading, Text, ButtonLink, CodeEditor, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function StateManagementPage() {
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
          <li className={styles.breadcrumbCurrent}>State Management</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          React State Management in 2025: What You Actually Need
        </Heading>
        <Text className={styles.subtitle}>
          Learn how to manage state in modern React apps. Understand what is <strong>remote</strong>, <strong>URL</strong>, <strong>local</strong>, and <strong>shared</strong> state, and when you actually need a state management library. We'll cover <strong>Immer</strong> for immutable updates, <strong>Zustand</strong> for shared state, <strong>TanStack Query</strong> for remote data, and more.
        </Text>
      </div>

      {/* State Concerns Overview */}
      <section id="state-concerns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🧠"} Understanding State Concerns
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Forget everything you thought you knew about Redux! 🤯 Most React apps don't need a massive state library. The secret sauce? Break your state into categories and pick the right tool for each. It's like using the right utensil for each course of a meal — you wouldn't eat soup with a fork!"}
                <br /><br />
                • <strong>Remote State:</strong> Data from APIs, databases → Use <strong>TanStack Query</strong> or <strong>SWR</strong>
                <br />
                • <strong>URL State:</strong> Query parameters, routing → Use <strong>nuqs</strong> or router hooks
                <br />
                • <strong>Local State:</strong> Component-specific state → Use <strong>useState</strong> or <strong>useReducer</strong>
                <br />
                • <strong>Shared State:</strong> State shared across components → Use <strong>Zustand</strong> or <strong>Context</strong> (sparingly)
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"This mental model changes EVERYTHING about how you think about state — get it right and 90% of your problems vanish"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> State Categories • Remote vs Local vs URL vs Shared • Tool Selection Guide
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Insight:</strong> ~90% of state management problems disappear when you use the right tool for each concern. Only ~10% of state actually needs a shared state management library.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Unit 74: Immutable Updates with useImmer */}
      <section id="use-immer" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"✨"} Unit 74: Immutable Updates with useImmer
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Tired of spread operator madness? 🤪 Imagine writing state updates that LOOK like mutations but are actually 100% immutable under the hood. That's Immer! It's like having a magic notebook — scribble whatever you want, and it creates a clean copy automatically. No more ...spreading ...everything ...everywhere! 🎩✨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Immer turns painful nested updates into simple, readable one-liners that just work"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> useImmer Hook • Nested State Updates • Array Manipulation • Complex State Structures
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> Immer eliminates the mental overhead of tracking nested updates. You write code that looks like mutations, but Immer creates immutable updates automatically. Perfect for complex state structures.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { useImmer } from 'use-immer';

// ❌ WITHOUT IMMER: Verbose and error-prone
function TodoListWithoutImmer() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false, tags: ['learning'] }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const addTag = (todoId: number, tag: string) => {
    setTodos(todos.map(todo => 
      todo.id === todoId
        ? { ...todo, tags: [...todo.tags, tag] } // Nested spread!
        : todo
    ));
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </div>
      ))}
    </div>
  );
}

// ✅ WITH IMMER: Clean and intuitive
function TodoListWithImmer() {
  const [todos, setTodos] = useImmer([
    { id: 1, text: 'Learn React', completed: false, tags: ['learning'] }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed; // Looks like mutation, but it's safe!
      }
    });
  };

  const addTag = (todoId: number, tag: string) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === todoId);
      if (todo) {
        todo.tags.push(tag); // Direct push! No spread needed.
      }
    });
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </div>
      ))}
    </div>
  );
}

// Advanced: Complex nested updates
function ComplexStateExample() {
  const [state, setState] = useImmer({
    user: {
      profile: {
        name: 'John',
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false
          }
        }
      },
      posts: [
        { id: 1, title: 'Post 1', comments: [] }
      ]
    }
  });

  // Update deeply nested property - one line!
  const toggleEmailNotifications = () => {
    setState(draft => {
      draft.user.profile.settings.notifications.email = 
        !draft.user.profile.settings.notifications.email;
    });
  };

  // Add comment to post - direct array manipulation!
  const addComment = (postId: number, comment: string) => {
    setState(draft => {
      const post = draft.user.posts.find(p => p.id === postId);
      if (post) {
        post.comments.push({ id: Date.now(), text: comment });
      }
    });
  };

  return (
    <div>
      <button onClick={toggleEmailNotifications}>
        Toggle Email Notifications
      </button>
      {/* ... */}
    </div>
  );
}`}
              readOnly={true}
              height={650}
            />
          </Stack>
        </Card>
      </section>

      {/* Unit 75: Cleaner Reducer with useImmerReducer */}
      <section id="use-immer-reducer" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"⚡"} Unit 75: Cleaner Reducer with useImmerReducer
              </Heading>
              <Text className={styles.sectionDescription}>
                {"If useReducer is the serious, buttoned-up version of state management, then useImmerReducer is its cool, laid-back cousin. 😎 Write your reducer cases with direct mutations — no more return statements with spread operators everywhere. Your reducers just got 50% shorter and 200% more readable!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> — {"Cleaner reducers mean fewer bugs in complex state logic — your team will thank you during code reviews"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> useImmerReducer API • Reducer Simplification • Action Patterns • Todo App Example
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Why this matters:</strong> When you have complex state logic that benefits from a reducer pattern, useImmerReducer makes it much more readable. Perfect for state machines, undo/redo, or complex form state.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { useImmerReducer } from 'use-immer';

// ❌ WITHOUT IMMER: Verbose reducer
type State = {
  items: Array<{ id: number; name: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
};

type Action =
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'TOGGLE_ITEM'; payload: number }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' };

function reducerWithoutImmer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { 
          id: Date.now(), 
          name: action.payload, 
          completed: false 
        }]
      };
    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

// ✅ WITH IMMER: Clean and readable
function reducerWithImmer(draft: State, action: Action) {
  switch (action.type) {
    case 'ADD_ITEM':
      draft.items.push({
        id: Date.now(),
        name: action.payload,
        completed: false
      });
      break;
    case 'TOGGLE_ITEM':
      const item = draft.items.find(i => i.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
      break;
    case 'DELETE_ITEM':
      draft.items = draft.items.filter(i => i.id !== action.payload);
      break;
    case 'SET_FILTER':
      draft.filter = action.payload;
      break;
  }
}

function TodoApp() {
  const [state, dispatch] = useImmerReducer(reducerWithImmer, {
    items: [],
    filter: 'all'
  });

  const filteredItems = state.items.filter(item => {
    if (state.filter === 'active') return !item.completed;
    if (state.filter === 'completed') return item.completed;
    return true;
  });

  return (
    <div>
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            dispatch({ type: 'ADD_ITEM', payload: e.currentTarget.value });
            e.currentTarget.value = '';
          }
        }}
        placeholder="Add todo..."
      />
      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          All
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          Active
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          Completed
        </button>
      </div>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => dispatch({ type: 'TOGGLE_ITEM', payload: item.id })}
            />
            {item.name}
            <button onClick={() => dispatch({ type: 'DELETE_ITEM', payload: item.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
              readOnly={true}
              height={650}
            />
          </Stack>
        </Card>
      </section>

      {/* Remote State: TanStack Query */}
      <section id="remote-state" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🌐"} Remote State: TanStack Query (React Query)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Here's a mind-blowing fact: ~80% of what you call 'state management' is actually just fetching data from a server! 🤯 TanStack Query swoops in like a superhero and handles caching, deduplication, refetching, and optimistic updates — all automatically. Say goodbye to isLoading useState nightmares!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"TanStack Query single-handedly eliminates 80% of your state management complexity — it's the biggest bang for your buck"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Query Keys • Caching Strategy • Mutations • Optimistic Updates • Request Deduplication
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> You don{"'"}t manage loading states, error states, or caching manually. The library handles it all, and multiple components can use the same data without duplicate requests.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simple data fetching with automatic caching
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(\`/api/users/\${userId}\`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}

// Use the same query in another component - no duplicate request!
function UserAvatar({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['user', userId], // Same key = same cache
    queryFn: async () => {
      const res = await fetch(\`/api/users/\${userId}\`);
      return res.json();
    },
  });

  return <img src={data?.avatar} alt={data?.name} />;
}

// Mutations with optimistic updates
function LikeButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
      return res.json();
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['post', postId]);
      
      // Optimistically update
      queryClient.setQueryData(['post', postId], (old: any) => ({
        ...old,
        likes: old.likes + 1,
        isLiked: true
      }));
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['post', postId], context?.previous);
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      Like
    </button>
  );
}`}
              readOnly={true}
              height={550}
            />
          </Stack>
        </Card>
      </section>

      {/* Shared State: Zustand */}
      <section id="shared-state-zustand" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🐻"} Shared State: Zustand
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Meet Zustand — the bear-themed state library that's small, fast, and ridiculously simple! 🐻 No providers, no boilerplate, no headaches. Just create a store and use it anywhere. It's like Context, but without the performance problems and Provider Hell. Your components only re-render when THEIR slice of state changes. Magic! ✨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> — {"Zustand replaces Context + Redux for shared state with a fraction of the code and zero Provider Hell"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Store Creation • Selective Subscriptions • DevTools & Persist • Immer Integration
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> Zustand solves the {"\"Provider Hell\""} problem. You create a store and use it anywhere. Only components that use the changed part of state will re-render.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Simple store - no providers needed!
interface BearState {
  bears: number;
  increase: (by: number) => void;
  decrease: () => void;
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
        decrease: () => set((state) => ({ bears: state.bears - 1 })),
      }),
      { name: 'bear-storage' } // Persist to localStorage
    ),
    { name: 'BearStore' } // DevTools name
  )
);

// Use in any component - no provider needed!
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} bears around here...</h1>;
}

function Controls() {
  const increase = useBearStore((state) => state.increase);
  return <button onClick={() => increase(1)}>Add bear</button>;
}

// Advanced: Complex store with nested state
interface AppState {
  user: {
    name: string;
    email: string;
  } | null;
  theme: 'light' | 'dark';
  sidebar: {
    isOpen: boolean;
    width: number;
  };
  setUser: (user: AppState['user']) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
}

const useAppStore = create<AppState>()((set) => ({
  user: null,
  theme: 'light',
  sidebar: {
    isOpen: true,
    width: 250,
  },
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({
    sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen }
  })),
  setSidebarWidth: (width) => set((state) => ({
    sidebar: { ...state.sidebar, width }
  })),
}));

// Selective subscriptions - only re-render when specific part changes
function SidebarToggle() {
  // Only re-renders when sidebar.isOpen changes
  const isOpen = useAppStore((state) => state.sidebar.isOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  
  return (
    <button onClick={toggleSidebar}>
      {isOpen ? 'Close' : 'Open'} Sidebar
    </button>
  );
}

function ThemeSwitcher() {
  // Only re-renders when theme changes
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// Combining with Immer for complex updates
import { produce } from 'immer';

const useComplexStore = create<{ items: Array<{ id: number; count: number }> }>()(
  (set) => ({
    items: [],
    addItem: (id: number) => set(produce((draft) => {
      draft.items.push({ id, count: 0 });
    })),
    incrementItem: (id: number) => set(produce((draft) => {
      const item = draft.items.find(i => i.id === id);
      if (item) item.count++;
    })),
  })
);`}
              readOnly={true}
              height={700}
            />
          </Stack>
        </Card>
      </section>

      {/* URL State: nuqs */}
      <section id="url-state" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔗"} URL State: nuqs (Next.js Query State)
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Stop fighting with URL params manually! 🛑 nuqs gives you useState-like simplicity for URL query parameters. Type-safe, auto-synced, and works perfectly with Next.js App Router. Share a link and the state is already there — it's like teleportation for your app state! 🚀"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> — {"URL state done right means shareable, bookmarkable, and back-button-friendly user experiences"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Query Params • Type-Safe Parsers • Pagination • Complex Filters
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Benefit:</strong> No more manual URL parsing or manual state syncing. The library handles all the edge cases automatically.
              </Text>
            </div>

            <CodeEditor
              language="tsx"
              code={`import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

// Simple string query param
function SearchPage() {
  const [search, setSearch] = useQueryState('q', parseAsString);

  return (
    <div>
      <input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value || null)}
        placeholder="Search..."
      />
    </div>
  );
}

// Integer with default value
function PaginatedList() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <div>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

// Multiple query params
function FilterableTable() {
  const [search, setSearch] = useQueryState('search', parseAsString);
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('name'));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <div>
      <input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value || null)}
        placeholder="Search..."
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </select>
      {/* URL automatically updates: /table?search=test&sort=price&page=2 */}
    </div>
  );
}

// Custom parser for complex types
import { parseAsJson } from 'nuqs';

function ComplexState() {
  const [filters, setFilters] = useQueryState(
    'filters',
    parseAsJson<{ category: string; tags: string[] }>()
  );

  const updateFilters = (newFilters: { category: string; tags: string[] }) => {
    setFilters(newFilters);
  };

  return (
    <div>
      {/* Filters automatically synced with URL */}
    </div>
  );
}`}
              readOnly={true}
              height={550}
            />
          </Stack>
        </Card>
      </section>

      {/* Summary Section */}
      <section id="summary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              {"🎯"} {"TL;DR: State Management Strategy for 2025"}
            </Heading>

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟢"} <strong>Impact: LOW</strong> — {"Quick cheat sheet to remember — pin this to your desk and never overthink state management again!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Remote State Strategy • URL State Strategy • Local State Strategy • Shared State Strategy
              </Text>
            </div>
            <div className="space-y-4">
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>1. Remote State (~80% of state):</strong> Use <strong>TanStack Query</strong> or <strong>SWR</strong>. They handle caching, deduplication, loading states, error states, optimistic updates, and more. Don't use Redux for this.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>2. URL State (~10% of state):</strong> Use <strong>nuqs</strong> for query parameters. Don't manually sync state with URLs - it's error-prone.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>3. Local State (~5% of state):</strong> Use <strong>useState</strong> or <strong>useReducer</strong>. For complex nested updates, use <strong>useImmer</strong> or <strong>useImmerReducer</strong>.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>4. Shared State (~5% of state):</strong> Use <strong>Zustand</strong> when Context becomes unwieldy. It's simple, performant, and doesn't require providers. Only use Context for 1-2 shared concerns.
                </Text>
              </div>
              <div>
                <Text className={styles.sectionDescription}>
                  <strong>Result:</strong> ~90% of your state management problems disappear. You'll have less code, better performance, and easier maintenance. No need for Redux in most cases!
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

