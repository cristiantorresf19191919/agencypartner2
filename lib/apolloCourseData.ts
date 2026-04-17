/**
 * Apollo GraphQL Course - 15 comprehensive lessons covering Apollo Client from
 * foundations through advanced patterns. Uses Monaco editor with validation.
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

function buildApolloLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
    /* ──────────────────────────────────────────────────────────────────────
     * TIER 1 — Foundations (Lessons 1-5)
     * ────────────────────────────────────────────────────────────────────── */

    // ── Lesson 1: Queries & useQuery ──────────────────────────────────────
    {
      title: "Apollo 1: Queries & useQuery",
      content: [
        "useQuery is the primary hook for fetching data in Apollo Client. It returns loading, error, and data — the essential triple for handling async state.",
        "Write a component that uses useQuery to fetch a list of users. Handle loading, error, and data states with conditional rendering.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What is useQuery?",
          body: "The **useQuery** hook is how you fetch data with Apollo Client in React. You pass it a GraphQL query (tagged with `gql`) and it returns an object with three key fields: **loading** (boolean while the request is in flight), **error** (an `ApolloError` if something went wrong), and **data** (the result once resolved). Apollo automatically **normalizes** the response into its in-memory cache using each object's `__typename` and `id`, meaning subsequent queries for the same data are served instantly from cache.",
          badges: ["Apollo Client", "useQuery", "Cache"],
          code: "import { useQuery, gql } from '@apollo/client';\n\nconst GET_USERS = gql`\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n`;\n\nfunction UserList() {\n  const { loading, error, data } = useQuery(GET_USERS);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error.message}</p>;\n\n  return (\n    <ul>\n      {data.users.map(user => (\n        <li key={user.id}>{user.name} — {user.email}</li>\n      ))}\n    </ul>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Fetch and display a user list",
          body: "Define a `GET_USERS` query with `gql` that selects **id**, **name**, and **email** from a `users` field. Use `useQuery(GET_USERS)` inside a **UserList** component and destructure `{ loading, error, data }`. Render a loading message, an error message, or a `<ul>` of users. Export **App** as the default.",
          badges: ["Practice", "useQuery"],
        },
        {
          tag: "tip",
          title: "Skip option for conditional queries",
          body: "Pass `skip: true` to **useQuery** to prevent the query from executing. This is useful when you need a value (like a selected ID) before the query makes sense: `useQuery(GET_USER, { variables: { id }, skip: !id })`. The hook still returns `{ loading: false, data: undefined }` while skipped, so your UI stays consistent.",
          badges: ["skip", "Conditional"],
          code: "const { data } = useQuery(GET_USER_DETAIL, {\n  variables: { id: selectedId },\n  skip: !selectedId,\n});",
        },
        {
          tag: "key-point",
          title: "Automatic cache normalization",
          body: "Apollo's **InMemoryCache** splits every object in a query result by its `__typename` and `id` (or `_id`). If two different queries return the same user, Apollo stores only **one** copy. When a mutation updates that user, **every** query referencing it re-renders automatically. This is the single most important concept in Apollo — the cache is the source of truth.",
          badges: ["Cache", "Normalization"],
        },
      ],
      codeExamples: [
        {
          code: "const GET_USERS = gql`\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n`;",
          comment: "GraphQL query definition with gql tagged template",
        },
        {
          code: "const { loading, error, data } = useQuery(GET_USERS);",
          comment: "Destructuring the useQuery result triple",
        },
        {
          code: "const { data } = useQuery(GET_USERS, {\n  fetchPolicy: 'cache-and-network',\n});",
          comment: "Passing options to useQuery",
        },
      ],
      defaultCode: `import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          <strong>{user.name}</strong> — {user.email}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div>
      <h2>User Directory</h2>
      <UserList />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("useQuery") &&
            (code.includes("gql`") || code.includes("gql`") || code.includes("graphql`")) &&
            code.includes("loading") &&
            code.includes("error") &&
            code.includes("data")),
        message: "useQuery mastered! You can now fetch data with Apollo Client.",
      }),
    },

    // ── Lesson 2: Variables & Dynamic Queries ─────────────────────────────
    {
      title: "Apollo 2: Variables & Dynamic Queries",
      content: [
        "GraphQL variables let you parameterize queries. Pass them via the variables option in useQuery to build dynamic, reusable data-fetching components.",
        "Build a search component that uses useQuery with a variables option. Use useState for the search term and pass it as a variable to the query.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Passing variables to queries",
          body: "GraphQL queries accept **variables** — named parameters prefixed with `$`. In Apollo, pass them via the `variables` option: `useQuery(SEARCH_USERS, { variables: { term } })`. When the variable changes, Apollo automatically re-executes the query (or serves from cache if available). Variables are **type-safe** in your schema: `query Search($term: String!)` ensures the server validates the input.",
          badges: ["Variables", "useQuery", "Dynamic"],
          code: "const SEARCH_USERS = gql`\n  query SearchUsers($term: String!) {\n    searchUsers(term: $term) {\n      id\n      name\n      email\n    }\n  }\n`;\n\nfunction Search() {\n  const [term, setTerm] = useState('');\n  const { loading, data } = useQuery(SEARCH_USERS, {\n    variables: { term },\n    skip: term.length < 2,\n  });\n}",
        },
        {
          tag: "exercise",
          title: "Build a search with variables",
          body: "Create a `SEARCH_USERS` query that takes a `$term: String!` variable. Use `useState` to track the search input. Pass the term via `variables: { term }` in your `useQuery` call. Add `skip: term.length < 2` so the query only fires when the user has typed at least 2 characters. Display results in a list.",
          badges: ["Practice", "Variables"],
        },
        {
          tag: "tip",
          title: "previousData for smooth UX",
          body: "When variables change, `data` becomes `undefined` while the new query loads. Use the **previousData** field from useQuery to keep showing the old results: `const { data, previousData } = useQuery(...)`. Render `data ?? previousData` to avoid the UI flashing blank between searches.",
          badges: ["UX", "previousData"],
          code: "const { data, previousData, loading } = useQuery(SEARCH_USERS, {\n  variables: { term },\n});\n\nconst displayData = data ?? previousData;",
        },
        {
          tag: "key-point",
          title: "skip for conditional execution",
          body: "The `skip` option prevents a query from executing. Unlike wrapping in a conditional, `skip` keeps the hook call **unconditional** (React rules of hooks). Common pattern: `skip: !selectedId` or `skip: searchTerm.length < 3`. The query will automatically execute when skip becomes `false`.",
          badges: ["skip", "Hooks"],
        },
      ],
      codeExamples: [
        {
          code: "useQuery(GET_USER, { variables: { id: userId } });",
          comment: "Passing a single variable",
        },
        {
          code: "const { refetch } = useQuery(GET_USERS);\nrefetch({ status: 'active' });",
          comment: "Refetching with new variables",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const SEARCH_USERS = gql\`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      id
      name
      email
    }
  }
\`;

function UserSearch() {
  const [term, setTerm] = useState('');
  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { term },
    skip: term.length < 2,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.searchUsers && (
        <ul>
          {data.searchUsers.map(user => (
            <li key={user.id}>{user.name} — {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>User Search</h2>
      <UserSearch />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("useQuery") &&
          code.includes("variables") &&
          code.includes("useState"),
        message: "Dynamic queries with variables mastered!",
      }),
    },

    // ── Lesson 3: Fragments & Composition ─────────────────────────────────
    {
      title: "Apollo 3: Fragments & Composition",
      content: [
        "Fragments let you define reusable sets of fields that can be shared across multiple queries and mutations, keeping your GraphQL operations DRY.",
        "Create a UserFields fragment and use it in both a list query and a detail query. Compose multiple fragments in a single query.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Reusable field selections",
          body: "A **fragment** defines a set of fields on a specific GraphQL type. Instead of repeating `id name email avatar` in every query, you define it once: `fragment UserFields on User { id name email avatar }`. Then **spread** it: `...UserFields`. Fragments are the foundation of **component-driven data fetching** — each component declares exactly the data it needs.",
          badges: ["Fragments", "DRY", "Composition"],
          code: "const USER_FIELDS = gql`\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n  }\n`;\n\nconst GET_USERS = gql`\n  query GetUsers {\n    users {\n      ...UserFields\n    }\n  }\n  ${USER_FIELDS}\n`;",
        },
        {
          tag: "exercise",
          title: "Create and compose fragments",
          body: "Define a `USER_FIELDS` fragment on `User` with `id`, `name`, `email`, and `avatar`. Define a `POST_FIELDS` fragment on `Post` with `id`, `title`, `createdAt`. Compose both in a `GET_USER_WITH_POSTS` query that selects `user(id: $id) { ...UserFields posts { ...PostFields } }`. Use both fragments with `${USER_FIELDS}` and `${POST_FIELDS}` interpolation.",
          badges: ["Practice", "Fragments"],
        },
        {
          tag: "tip",
          title: "Colocation pattern",
          body: "The **colocation** pattern means defining a fragment **next to the component** that uses its fields. `UserAvatar` defines `UserAvatar.fragments = { user: gql'fragment UserAvatarUser on User { id avatar name }' }`. The parent query includes the fragment via interpolation. This way, when `UserAvatar` needs a new field, you only change one file.",
          badges: ["Colocation", "Best Practice"],
          code: "// UserAvatar.tsx\nexport const USER_AVATAR_FRAGMENT = gql`\n  fragment UserAvatarFields on User {\n    id\n    avatar\n    name\n  }\n`;\n\n// Parent query\nconst GET_USERS = gql`\n  query GetUsers {\n    users { ...UserAvatarFields }\n  }\n  ${USER_AVATAR_FRAGMENT}\n`;",
        },
        {
          tag: "key-point",
          title: "Fragment masking benefits",
          body: "Modern GraphQL clients (like Apollo with codegen) support **fragment masking**: a component can only access fields from its own fragment, not from the parent query. This enforces data isolation — `UserAvatar` cannot accidentally depend on fields from `UserBio`'s fragment. It makes refactoring safer and component boundaries clearer.",
          badges: ["Fragment Masking", "Type Safety"],
        },
      ],
      codeExamples: [
        {
          code: "const USER_FIELDS = gql`\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n`;",
          comment: "Fragment definition",
        },
        {
          code: "const GET_USERS = gql`\n  query GetUsers {\n    users {\n      ...UserFields\n    }\n  }\n  ${USER_FIELDS}\n`;",
          comment: "Spreading a fragment in a query",
        },
      ],
      defaultCode: `import { useQuery, gql } from '@apollo/client';

const USER_FIELDS = gql\`
  fragment UserFields on User {
    id
    name
    email
    avatar
  }
\`;

const POST_FIELDS = gql\`
  fragment PostFields on Post {
    id
    title
    createdAt
  }
\`;

const GET_USER_WITH_POSTS = gql\`
  query GetUserWithPosts($id: ID!) {
    user(id: $id) {
      ...UserFields
      posts {
        ...PostFields
      }
    }
  }
  \${USER_FIELDS}
  \${POST_FIELDS}
\`;

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_WITH_POSTS, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { user } = data;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={user.avatar} alt={user.name} width={48} height={48} style={{ borderRadius: '50%' }} />
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      <h4>Posts</h4>
      <ul>
        {user.posts.map(post => (
          <li key={post.id}>{post.title} — {post.createdAt}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>User Profile with Fragments</h2>
      <UserProfile userId="1" />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("fragment") &&
          code.includes("...") &&
          (code.includes("gql`") || code.includes("gql`")),
        message: "Fragments and composition mastered!",
      }),
    },

    // ── Lesson 4: Mutations & Optimistic UI ───────────────────────────────
    {
      title: "Apollo 4: Mutations & Optimistic UI",
      content: [
        "useMutation is how you send writes to your GraphQL server. Combine it with optimisticResponse to make your UI feel instant.",
        "Build a todo form that uses useMutation to add items. Add an optimisticResponse so the new todo appears immediately before the server responds.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The useMutation hook",
          body: "**useMutation** returns a tuple: `[mutate, { data, loading, error }]`. Unlike `useQuery`, mutations don't execute on render — you call the `mutate` function when the user takes an action (submit, click, etc.). The second element gives you the mutation's state. You define your mutation with `gql` just like queries, but use the `mutation` keyword.",
          badges: ["useMutation", "Apollo Client"],
          code: "const ADD_TODO = gql`\n  mutation AddTodo($title: String!) {\n    addTodo(title: $title) {\n      id\n      title\n      completed\n    }\n  }\n`;\n\nconst [addTodo, { loading }] = useMutation(ADD_TODO);",
        },
        {
          tag: "exercise",
          title: "Build a form with mutation",
          body: "Define an `ADD_TODO` mutation that accepts `$title: String!` and returns `id`, `title`, `completed`. Use `useMutation(ADD_TODO)` and destructure `[addTodo, { loading }]`. Create a form with an input and submit handler that calls `addTodo({ variables: { title } })`. Add an **optimisticResponse** that fakes the server result with a temporary `id` and `__typename: 'Todo'`.",
          badges: ["Practice", "useMutation"],
        },
        {
          tag: "tip",
          title: "optimisticResponse for instant UI",
          body: "Pass `optimisticResponse` to the mutate call to **immediately** update the cache before the server responds. Apollo writes the optimistic data to cache, re-renders affected components, then swaps in the real server response when it arrives. If the mutation fails, the optimistic data is rolled back automatically. Use a **negative temp ID** to distinguish optimistic entries: `id: -Date.now()`.",
          badges: ["Optimistic UI", "UX"],
          code: "addTodo({\n  variables: { title: 'Buy milk' },\n  optimisticResponse: {\n    addTodo: {\n      __typename: 'Todo',\n      id: `temp-${Date.now()}`,\n      title: 'Buy milk',\n      completed: false,\n    },\n  },\n});",
        },
        {
          tag: "key-point",
          title: "Cache update after mutation",
          body: "By default, Apollo updates cached objects that share the same `id` and `__typename`. But for **list additions or removals**, you need the `update` callback to manually modify the cache: `update(cache, { data }) { const existing = cache.readQuery(...); cache.writeQuery({ query: GET_TODOS, data: { todos: [...existing.todos, data.addTodo] } }); }`. Without this, newly created items won't appear in lists.",
          badges: ["Cache", "update"],
          code: "addTodo({\n  variables: { title },\n  update(cache, { data: { addTodo: newTodo } }) {\n    const existing = cache.readQuery({ query: GET_TODOS });\n    cache.writeQuery({\n      query: GET_TODOS,\n      data: { todos: [...existing.todos, newTodo] },\n    });\n  },\n});",
        },
      ],
      codeExamples: [
        {
          code: "const [addTodo, { loading, error }] = useMutation(ADD_TODO);",
          comment: "useMutation returns [mutateFunction, result]",
        },
        {
          code: "addTodo({ variables: { title }, optimisticResponse: { addTodo: { __typename: 'Todo', id: 'temp', title, completed: false } } });",
          comment: "Calling mutation with optimistic response",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
\`;

const ADD_TODO = gql\`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
\`;

function TodoApp() {
  const [title, setTitle] = useState('');
  const { data, loading: queryLoading } = useQuery(GET_TODOS);
  const [addTodo, { loading: mutationLoading }] = useMutation(ADD_TODO);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo({
      variables: { title },
      optimisticResponse: {
        addTodo: {
          __typename: 'Todo',
          id: \`temp-\${Date.now()}\`,
          title,
          completed: false,
        },
      },
      update(cache, { data: { addTodo: newTodo } }) {
        const existing = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: [...(existing?.todos || []), newTodo] },
        });
      },
    });

    setTitle('');
  };

  if (queryLoading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New todo..."
          disabled={mutationLoading}
        />
        <button type="submit" disabled={mutationLoading}>
          {mutationLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      <ul>
        {data?.todos?.map(todo => (
          <li key={todo.id} style={{ opacity: todo.id.toString().startsWith('temp') ? 0.5 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Todo List with Mutations</h2>
      <TodoApp />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("useMutation") &&
          (code.includes("gql`") || code.includes("gql`")) &&
          (code.includes("optimisticResponse") || code.includes("update(")),
        message: "Mutations and optimistic UI mastered!",
      }),
    },

    // ── Lesson 5: Fetch Policies ──────────────────────────────────────────
    {
      title: "Apollo 5: Fetch Policies",
      content: [
        "Apollo's fetchPolicy controls where data comes from — cache, network, or both. The right choice depends on data freshness requirements.",
        "Create a component that switches between fetch policies and observe the different behaviors. Use cache-first for static data and network-only for live data.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The 6 fetch policies",
          body: "Apollo offers six fetch policies:\n\n- **cache-first** (default): Returns cache if available, otherwise fetches from network.\n- **cache-and-network**: Returns cache immediately AND fetches from network to update.\n- **network-only**: Always fetches from network, then writes to cache.\n- **no-cache**: Always fetches from network, never reads or writes cache.\n- **cache-only**: Only reads from cache, never contacts network.\n- **standby**: Like `cache-first` but won't auto-update on cache changes.\n\nChoose based on how stale your data can be.",
          badges: ["Fetch Policy", "Cache Strategy"],
          code: "// Always fresh from server\nuseQuery(GET_NOTIFICATIONS, {\n  fetchPolicy: 'network-only',\n});\n\n// Cache first, then background update\nuseQuery(GET_USER_PROFILE, {\n  fetchPolicy: 'cache-and-network',\n});",
        },
        {
          tag: "exercise",
          title: "Switch between policies",
          body: "Create a **DataViewer** component with a `useState` to track the selected `fetchPolicy`. Render buttons for at least `cache-first`, `network-only`, and `cache-and-network`. Pass the selected policy to `useQuery(GET_DATA, { fetchPolicy })`. Display the data and show which policy is active.",
          badges: ["Practice", "Fetch Policy"],
        },
        {
          tag: "key-point",
          title: "Decision table",
          body: "Use this decision table:\n- **Static config/enums** → `cache-first` (default)\n- **User profile data** → `cache-and-network` (show cached, update in bg)\n- **Real-time feeds** → `network-only` (always fresh)\n- **Sensitive one-time data** → `no-cache` (don't persist)\n- **Offline-first apps** → `cache-first` with manual `refetch`",
          badges: ["Best Practice", "Decision"],
        },
        {
          tag: "tip",
          title: "nextFetchPolicy optimization",
          body: "Use `nextFetchPolicy` to change policy **after** the first fetch. Common pattern: first render uses `network-only` to ensure fresh data, then switches to `cache-first` for subsequent renders: `{ fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' }`. This gives you the best of both worlds — guaranteed fresh initial load, then fast cache reads.",
          badges: ["Performance", "nextFetchPolicy"],
          code: "useQuery(GET_DASHBOARD, {\n  fetchPolicy: 'network-only',\n  nextFetchPolicy: 'cache-first',\n});",
        },
      ],
      codeExamples: [
        {
          code: "useQuery(GET_DATA, { fetchPolicy: 'cache-and-network' });",
          comment: "Cache-and-network returns cached data immediately, then updates from network",
        },
        {
          code: "useQuery(GET_DATA, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });",
          comment: "First fetch is network-only, subsequent reads from cache",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      author
      createdAt
    }
  }
\`;

const POLICIES = ['cache-first', 'cache-and-network', 'network-only', 'no-cache', 'cache-only'];

function PostList() {
  const [policy, setPolicy] = useState('cache-first');
  const { loading, error, data, networkStatus } = useQuery(GET_POSTS, {
    fetchPolicy: policy,
    notifyOnNetworkStatusChange: true,
  });

  return (
    <div>
      <h3>Active Policy: <code>{policy}</code></h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {POLICIES.map(p => (
          <button
            key={p}
            onClick={() => setPolicy(p)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: policy === p ? '2px solid #61dafb' : '1px solid #444',
              background: policy === p ? 'rgba(97,218,251,0.15)' : 'transparent',
              color: policy === p ? '#61dafb' : '#ccc',
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <p>Network status: {networkStatus}</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.posts && (
        <ul>
          {data.posts.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong> by {post.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Fetch Policy Explorer</h2>
      <PostList />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("fetchPolicy") &&
          code.includes("useQuery"),
        message: "Fetch policies mastered! You control where Apollo reads data from.",
      }),
    },

    /* ──────────────────────────────────────────────────────────────────────
     * TIER 2 — Cache Mastery (Lessons 6-10)
     * ────────────────────────────────────────────────────────────────────── */

    // ── Lesson 6: Cache Read & Write ──────────────────────────────────────
    {
      title: "Apollo 6: Cache Read & Write",
      content: [
        "Apollo's cache is not just automatic — you can read from and write to it directly using readQuery, writeQuery, readFragment, and writeFragment.",
        "Write a component that manually reads data from the cache and writes updates directly. Use cache.modify for fine-grained changes.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Direct cache manipulation",
          body: "Apollo exposes four key methods for direct cache access:\n\n- **readQuery / writeQuery** — Read or write an entire query result in the cache. Great for updating list queries after a mutation.\n- **readFragment / writeFragment** — Read or write a single entity by its cache ID (e.g., `User:5`). Perfect for updating one field on one object.\n- **cache.modify** — The most surgical option. Modify individual fields on a cached entity without needing to know the full query shape.\n\nAll these methods trigger re-renders in components that depend on the affected data.",
          badges: ["Cache", "readQuery", "writeQuery"],
          code: "// Read a cached query result\nconst data = client.readQuery({ query: GET_TODOS });\n\n// Write updated data back\nclient.writeQuery({\n  query: GET_TODOS,\n  data: { todos: [...data.todos, newTodo] },\n});",
        },
        {
          tag: "exercise",
          title: "Manually update cache after action",
          body: "Create a **TodoManager** component. After adding a todo via mutation, use `cache.writeQuery` inside the `update` callback to append the new todo to the cached list. Also implement a \"Mark Complete\" button that uses `cache.modify` to toggle the `completed` field directly in cache without a network request.",
          badges: ["Practice", "Cache"],
        },
        {
          tag: "tip",
          title: "cache.modify for surgical updates",
          body: "When you need to change one field on one object, `cache.modify` is the cleanest approach. It takes the cache ID (like `Todo:5`) and a `fields` object where each key is a field name and the value is a modifier function. The modifier receives the current cached value and returns the new value. No need to read/write the full query shape.",
          badges: ["cache.modify", "Performance"],
          code: "cache.modify({\n  id: cache.identify(todo),\n  fields: {\n    completed(prev) {\n      return !prev;\n    },\n  },\n});",
        },
        {
          tag: "key-point",
          title: "When to use each method",
          body: "Use **writeQuery** when updating list queries (add/remove items). Use **writeFragment** when updating a single entity's fields (e.g., toggling a boolean). Use **cache.modify** when you want the most precise control and don't want to read the existing data first. Use **readQuery** to check the current cache state before writing. Always prefer the least invasive method — `cache.modify` > `writeFragment` > `writeQuery`.",
          badges: ["Best Practice", "Cache Strategy"],
        },
      ],
      codeExamples: [
        {
          code: "cache.modify({\n  id: cache.identify(todo),\n  fields: {\n    completed: (prev) => !prev,\n  },\n});",
          comment: "Surgical field modification",
        },
        {
          code: "client.writeFragment({\n  id: 'User:5',\n  fragment: gql`fragment UserName on User { name }`,\n  data: { name: 'Updated Name' },\n});",
          comment: "Write a single entity field via fragment",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
\`;

const ADD_TODO = gql\`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
\`;

function TodoManager() {
  const [title, setTitle] = useState('');
  const client = useApolloClient();
  const { data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTodo({
      variables: { title },
      update(cache, { data: { addTodo: newTodo } }) {
        const existing = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: [...existing.todos, newTodo] },
        });
      },
    });
    setTitle('');
  };

  const toggleComplete = (todo) => {
    client.cache.modify({
      id: client.cache.identify(todo),
      fields: {
        completed(prev) {
          return !prev;
        },
      },
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo..." />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {data?.todos?.map(todo => (
          <li key={todo.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Cache Read & Write</h2>
      <TodoManager />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("readQuery") ||
          code.includes("writeQuery") ||
          code.includes("cache.modify"),
        message: "Direct cache manipulation mastered!",
      }),
    },

    // ── Lesson 7: Type Policies ───────────────────────────────────────────
    {
      title: "Apollo 7: Type Policies",
      content: [
        "Type policies let you customize how Apollo normalizes, stores, and reads specific types in the cache. They are the key to advanced caching behavior.",
        "Configure an InMemoryCache with type policies. Define keyFields for custom identity, a merge function for pagination, and a read function for computed fields.",
      ],
      sections: [
        {
          tag: "concept",
          title: "keyFields, merge, and read functions",
          body: "**Type policies** are configured in `InMemoryCache` and let you customize three aspects of cache behavior per type:\n\n- **keyFields**: Define which fields make an object unique. Default is `['id']` or `['_id']`. For objects without an `id`, use `keyFields: ['slug']` or `keyFields: false` (singleton).\n- **merge**: Custom logic for merging incoming data with existing cached data. Essential for **pagination** — without it, fetching page 2 overwrites page 1.\n- **read**: Transform data when it's read from cache. Great for computed fields, formatting, or default values.",
          badges: ["Type Policies", "InMemoryCache", "Normalization"],
          code: "const cache = new InMemoryCache({\n  typePolicies: {\n    Product: {\n      keyFields: ['sku'],\n    },\n    Query: {\n      fields: {\n        posts: {\n          keyArgs: ['category'],\n          merge(existing = [], incoming) {\n            return [...existing, ...incoming];\n          },\n        },\n      },\n    },\n  },\n});",
        },
        {
          tag: "exercise",
          title: "Configure pagination merge",
          body: "Create an `InMemoryCache` with type policies. Set `Product` to use `keyFields: ['sku']`. Configure `Query.fields.products` with a `merge` function that appends incoming items to existing ones (for infinite scroll). Add `keyArgs: ['category']` so each category has its own cache entry. Finally, add a `read` function on `User.fullName` that concatenates `firstName` and `lastName`.",
          badges: ["Practice", "Type Policies"],
        },
        {
          tag: "tip",
          title: "Computed fields via read",
          body: "The `read` function lets you create **computed fields** that don't exist in your schema. Access other fields on the same object via `readField`: `read(_, { readField }) { return readField('firstName') + ' ' + readField('lastName'); }`. Components can query `fullName` as if it were a real field. Combine with `@client` directive for local-only computed properties.",
          badges: ["Computed Fields", "read"],
          code: "User: {\n  fields: {\n    fullName: {\n      read(_, { readField }) {\n        const first = readField('firstName');\n        const last = readField('lastName');\n        return `${first} ${last}`;\n      },\n    },\n  },\n}",
        },
        {
          tag: "key-point",
          title: "Normalization control",
          body: "By default, Apollo normalizes using `__typename:id`. When your data has different identifiers (`sku`, `slug`, `email`), or no identifier at all (singletons like `currentUser`), type policies give you full control. Use `keyFields: false` to disable normalization for a type (it becomes embedded in its parent). Use `keyFields: ['isbn', 'edition']` for **composite keys**.",
          badges: ["Normalization", "keyFields"],
        },
      ],
      codeExamples: [
        {
          code: "const cache = new InMemoryCache({\n  typePolicies: {\n    Product: { keyFields: ['sku'] },\n  },\n});",
          comment: "Custom key fields for non-id types",
        },
      ],
      defaultCode: `import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      keyFields: ['sku'],
    },
    User: {
      fields: {
        fullName: {
          read(_, { readField }) {
            const first = readField('firstName') || '';
            const last = readField('lastName') || '';
            return \`\${first} \${last}\`.trim();
          },
        },
      },
    },
    Query: {
      fields: {
        products: {
          keyArgs: ['category'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const GET_PRODUCTS = gql\`
  query GetProducts($category: String!, $offset: Int!, $limit: Int!) {
    products(category: $category, offset: $offset, limit: $limit) {
      sku
      name
      price
      category
    }
  }
\`;

function ProductList() {
  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { category: 'electronics', offset: 0, limit: 10 },
  });

  const loadMore = () => {
    fetchMore({
      variables: { offset: data.products.length },
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {data?.products?.map(p => (
          <li key={p.sku}>{p.name} — \${p.price}</li>
        ))}
      </ul>
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Type Policies</h2>
      <ProductList />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("typePolicies") &&
          (code.includes("keyFields") || code.includes("merge") || code.includes("read")),
        message: "Type policies mastered! You control how Apollo normalizes and reads data.",
      }),
    },

    // ── Lesson 8: Reactive Variables ──────────────────────────────────────
    {
      title: "Apollo 8: Reactive Variables",
      content: [
        "Reactive variables are Apollo's solution for local state — like React Context, but integrated with the Apollo cache and queryable via @client.",
        "Build a favorites feature using makeVar and useReactiveVar. Create a local-only query field that reads from the reactive variable.",
      ],
      sections: [
        {
          tag: "concept",
          title: "makeVar and useReactiveVar",
          body: "**Reactive variables** are created with `makeVar(initialValue)`. They live outside the cache but can be read from within it. Use `useReactiveVar(myVar)` in components to **subscribe** to changes — the component re-renders whenever the variable updates. Update the value by calling the variable as a function: `myVar([...myVar(), newItem])`. No providers, no actions, no reducers.",
          badges: ["Reactive Variables", "Local State", "makeVar"],
          code: "import { makeVar, useReactiveVar } from '@apollo/client';\n\n// Create the reactive variable\nconst favoritesVar = makeVar([]);\n\n// Read in a component\nfunction FavCount() {\n  const favorites = useReactiveVar(favoritesVar);\n  return <span>{favorites.length} favorites</span>;\n}\n\n// Update from anywhere\nfavoritesVar([...favoritesVar(), 'item-1']);",
        },
        {
          tag: "exercise",
          title: "Build local favorites with reactive vars",
          body: "Create a `favoritesVar` with `makeVar([])`. Build an **ItemCard** component that shows a product and a heart/star toggle. When clicked, add or remove the item ID from `favoritesVar`. Build a **FavoriteCount** badge that uses `useReactiveVar(favoritesVar)` to display the count. No server queries needed — this is pure local state.",
          badges: ["Practice", "Reactive Variables"],
        },
        {
          tag: "tip",
          title: "@client directive for local fields",
          body: "You can read reactive variables inside GraphQL queries using the `@client` directive and a `read` function in type policies. Define a local field: `Query.fields.favorites = { read() { return favoritesVar(); } }`. Then query it: `gql'query { favorites @client }'`. This unifies local and remote data into one query, which is powerful for components that need both.",
          badges: ["@client", "Type Policies"],
          code: "const cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        favorites: {\n          read() {\n            return favoritesVar();\n          },\n        },\n      },\n    },\n  },\n});\n\n// Query local state alongside remote data\nconst GET_DATA = gql`\n  query GetData {\n    products { id name }\n    favorites @client\n  }\n`;",
        },
        {
          tag: "key-point",
          title: "Reactive vars vs Context",
          body: "Reactive variables solve the same problem as React Context but with key advantages: **no provider nesting**, **no re-render of the entire tree** (only subscribers re-render), **accessible from outside React** (in utility functions, link chains), and **queryable alongside remote data** via `@client`. Use Context for theme/auth, reactive vars for fine-grained local state.",
          badges: ["Comparison", "Architecture"],
        },
      ],
      codeExamples: [
        {
          code: "const cartVar = makeVar([]);\ncartVar([...cartVar(), { id: '1', qty: 1 }]);",
          comment: "Creating and updating a reactive variable",
        },
        {
          code: "const cart = useReactiveVar(cartVar);",
          comment: "Subscribing to reactive variable changes in a component",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';

// Reactive variable for favorites
const favoritesVar = makeVar([]);

const PRODUCTS = [
  { id: '1', name: 'Apollo Client', price: 'Free' },
  { id: '2', name: 'GraphQL Yoga', price: 'Free' },
  { id: '3', name: 'Relay', price: 'Free' },
  { id: '4', name: 'URQL', price: 'Free' },
];

function toggleFavorite(id) {
  const current = favoritesVar();
  if (current.includes(id)) {
    favoritesVar(current.filter(fav => fav !== id));
  } else {
    favoritesVar([...current, id]);
  }
}

function ItemCard({ product }) {
  const favorites = useReactiveVar(favoritesVar);
  const isFav = favorites.includes(product.id);

  return (
    <div style={{
      padding: 16, borderRadius: 8,
      border: isFav ? '2px solid #f59e0b' : '1px solid #333',
      background: isFav ? 'rgba(245,158,11,0.1)' : 'transparent',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <strong>{product.name}</strong>
        <span style={{ marginLeft: 8, color: '#888' }}>{product.price}</span>
      </div>
      <button onClick={() => toggleFavorite(product.id)} style={{
        fontSize: 20, background: 'none', border: 'none', cursor: 'pointer',
      }}>
        {isFav ? '★' : '☆'}
      </button>
    </div>
  );
}

function FavoriteCount() {
  const favorites = useReactiveVar(favoritesVar);
  return <p>Favorites: {favorites.length} / {PRODUCTS.length}</p>;
}

function App() {
  return (
    <div>
      <h2>Reactive Variables</h2>
      <FavoriteCount />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PRODUCTS.map(p => <ItemCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("makeVar") &&
          code.includes("useReactiveVar"),
        message: "Reactive variables mastered! You can manage local state with Apollo.",
      }),
    },

    // ── Lesson 9: Cache Invalidation ──────────────────────────────────────
    {
      title: "Apollo 9: Cache Invalidation",
      content: [
        "Cache invalidation is famously hard. Apollo gives you evict, gc, refetchQueries, and resetStore to keep your cache accurate after data changes.",
        "Implement a delete flow that uses cache.evict to remove the deleted item, then cache.gc to clean up dangling references.",
      ],
      sections: [
        {
          tag: "concept",
          title: "evict, gc, refetchQueries, resetStore",
          body: "Apollo provides four invalidation strategies:\n\n- **cache.evict({ id })** — Remove a specific object from the cache by its cache ID (e.g., `Todo:5`). Fast and surgical.\n- **cache.gc()** — Garbage collect unreachable objects. Call after `evict` to clean up orphaned references.\n- **refetchQueries** — Re-execute specified queries after a mutation. Simpler but slower (network round-trip).\n- **client.resetStore()** — Nuclear option: clears the entire cache and refetches all active queries. Use for logout flows.",
          badges: ["Cache Invalidation", "evict", "gc"],
          code: "// Surgical eviction\ncache.evict({ id: cache.identify(deletedTodo) });\ncache.gc();\n\n// Refetch after mutation\nuseMutation(DELETE_TODO, {\n  refetchQueries: [{ query: GET_TODOS }],\n});\n\n// Full reset (logout)\nclient.resetStore();",
        },
        {
          tag: "exercise",
          title: "Implement eviction after delete",
          body: "Create a **TodoList** with a delete button per item. Use `useMutation(DELETE_TODO)` with an `update` callback. In the callback, call `cache.evict({ id: cache.identify(deletedTodo) })` followed by `cache.gc()`. The item should disappear from the list immediately without refetching the full query. Also add a \"Reset All\" button that calls `client.resetStore()`.",
          badges: ["Practice", "evict", "gc"],
        },
        {
          tag: "tip",
          title: "Surgical eviction vs full refetch",
          body: "Prefer `cache.evict` + `cache.gc` when deleting a single item — it's instant and doesn't hit the network. Use `refetchQueries` when the server might reorder or recompute results (e.g., deleting an item changes rankings). Use `resetStore` only for auth state changes (login/logout) when the entire cache is suspect. The more precise your invalidation, the faster your UI.",
          badges: ["Performance", "Strategy"],
        },
        {
          tag: "key-point",
          title: "Garbage collection strategy",
          body: "After evicting an object, other cached objects may still reference it (e.g., a user's `posts` array contains a reference to evicted `Post:5`). `cache.gc()` traverses the cache and removes these **dangling references**. Always pair `evict` with `gc`. You can also use `cache.evict({ id, fieldName })` to remove a single field instead of the whole object — useful when you want to force a re-fetch of just one field.",
          badges: ["gc", "Dangling References"],
        },
      ],
      codeExamples: [
        {
          code: "cache.evict({ id: 'Todo:5' });\ncache.gc();",
          comment: "Remove a specific cached object and clean up references",
        },
        {
          code: "useMutation(DELETE_TODO, { refetchQueries: ['GetTodos'] });",
          comment: "Refetch by query name string",
        },
      ],
      defaultCode: `import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
\`;

const DELETE_TODO = gql\`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
\`;

function TodoList() {
  const client = useApolloClient();
  const { data, loading } = useQuery(GET_TODOS);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleDelete = (todo) => {
    deleteTodo({
      variables: { id: todo.id },
      update(cache) {
        // Surgically remove the deleted todo from cache
        cache.evict({ id: cache.identify(todo) });
        // Clean up any dangling references
        cache.gc();
      },
    });
  };

  const handleReset = () => {
    // Nuclear option: clear entire cache and refetch
    client.resetStore();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3>Todos ({data?.todos?.length || 0})</h3>
        <button onClick={handleReset} style={{ color: '#ef4444' }}>
          Reset Store
        </button>
      </div>
      <ul>
        {data?.todos?.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
            <span>{todo.title}</span>
            <button onClick={() => handleDelete(todo)} style={{ color: '#ef4444', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Cache Invalidation</h2>
      <TodoList />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("cache.evict") ||
          code.includes("refetchQueries"),
        message: "Cache invalidation mastered! You can keep your cache in sync with the server.",
      }),
    },

    // ── Lesson 10: Pagination ─────────────────────────────────────────────
    {
      title: "Apollo 10: Pagination",
      content: [
        "fetchMore is Apollo's built-in pattern for pagination. Combined with type policy merge functions, it elegantly handles both offset and cursor-based pagination.",
        "Implement an infinite scroll list using fetchMore. Configure a merge function in type policies to accumulate pages in the cache.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The fetchMore pattern",
          body: "The `useQuery` hook returns a **fetchMore** function that lets you load additional data into the same query. You pass new variables (like `offset` or `cursor`) and Apollo merges the results with existing data using your type policy's `merge` function. Without a merge function, new data **overwrites** existing data — so pagination always requires a type policy.",
          badges: ["fetchMore", "Pagination"],
          code: "const { data, loading, fetchMore } = useQuery(GET_POSTS, {\n  variables: { offset: 0, limit: 10 },\n});\n\nconst loadMore = () => {\n  fetchMore({\n    variables: { offset: data.posts.length },\n  });\n};",
        },
        {
          tag: "exercise",
          title: "Implement infinite scroll with fetchMore",
          body: "Create a paginated **PostFeed** component. Use `useQuery` with `offset: 0` and `limit: 10`. Add a \"Load More\" button that calls `fetchMore({ variables: { offset: data.posts.length } })`. Configure a `merge` function in type policies for `Query.fields.posts` that concatenates existing and incoming arrays. Track `hasMore` to hide the button when all items are loaded.",
          badges: ["Practice", "fetchMore"],
        },
        {
          tag: "tip",
          title: "Offset vs cursor comparison",
          body: "**Offset pagination** (`offset: 20, limit: 10`) is simple but breaks when items are inserted/deleted between pages — you might skip or duplicate items. **Cursor pagination** (`after: 'abc123', first: 10`) uses an opaque marker from the last item, making it resilient to changes. Apollo provides `relayStylePagination()` for Relay-compatible cursor pagination out of the box.",
          badges: ["Offset", "Cursor", "Relay"],
          code: "import { relayStylePagination } from '@apollo/client/utilities';\n\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        posts: relayStylePagination(),\n      },\n    },\n  },\n});",
        },
        {
          tag: "key-point",
          title: "Merge function in type policies",
          body: "The `merge` function in type policies is the heart of Apollo pagination. It receives `existing` (current cached data, initially `undefined`) and `incoming` (new data from the server). For offset pagination: `merge(existing = [], incoming) { return [...existing, ...incoming]; }`. Use `keyArgs` to tell Apollo which variables create separate cache entries (e.g., `keyArgs: ['category']` means each category has its own paginated list).",
          badges: ["merge", "Type Policies"],
        },
      ],
      codeExamples: [
        {
          code: "fetchMore({ variables: { offset: data.posts.length } });",
          comment: "Load next page of results",
        },
        {
          code: "merge(existing = [], incoming) {\n  return [...existing, ...incoming];\n}",
          comment: "Merge function for offset-based pagination",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

// Type policy for paginated merging
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: ['category'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const GET_POSTS = gql\`
  query GetPosts($offset: Int!, $limit: Int!, $category: String) {
    posts(offset: $offset, limit: $limit, category: $category) {
      id
      title
      excerpt
      author
    }
  }
\`;

function PostFeed() {
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: 5, category: 'tech' },
  });

  const loadMore = async () => {
    const { data: newData } = await fetchMore({
      variables: { offset: data.posts.length },
    });
    if (newData.posts.length < 5) {
      setHasMore(false);
    }
  };

  if (loading && !data) return <p>Loading...</p>;

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.posts?.map(post => (
          <li key={post.id} style={{ padding: 12, borderBottom: '1px solid #333', marginBottom: 8 }}>
            <h4 style={{ margin: '0 0 4px' }}>{post.title}</h4>
            <p style={{ margin: 0, color: '#aaa' }}>{post.excerpt}</p>
            <small style={{ color: '#666' }}>by {post.author}</small>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={loadMore} disabled={loading} style={{
          padding: '10px 20px', borderRadius: 8, border: '1px solid #61dafb',
          background: 'transparent', color: '#61dafb', cursor: 'pointer', width: '100%',
        }}>
          {loading ? 'Loading...' : 'Load More Posts'}
        </button>
      )}
      {!hasMore && <p style={{ textAlign: 'center', color: '#666' }}>No more posts</p>}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Paginated Feed</h2>
      <PostFeed />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success: code.includes("fetchMore"),
        message: "Pagination mastered! You can load data incrementally with Apollo.",
      }),
    },

    /* ──────────────────────────────────────────────────────────────────────
     * TIER 3 — Advanced Patterns (Lessons 11-15)
     * ────────────────────────────────────────────────────────────────────── */

    // ── Lesson 11: Error Handling & Links ─────────────────────────────────
    {
      title: "Apollo 11: Error Handling & Links",
      content: [
        "Apollo Links form a chain that processes each GraphQL operation. ErrorLink, RetryLink, and custom links give you fine-grained control over error handling and request routing.",
        "Build an Apollo Client with an error handling link chain. Use onError for logging, RetryLink for transient failures, and split for routing subscriptions.",
      ],
      sections: [
        {
          tag: "concept",
          title: "ApolloLink chain",
          body: "An **Apollo Link** is middleware for your GraphQL operations. Links form a **chain** — each link can inspect, modify, or short-circuit the operation before passing it to the next link. Common links:\n\n- **HttpLink**: The terminating link that sends operations to your server.\n- **ErrorLink** (via `onError`): Catches GraphQL and network errors.\n- **RetryLink**: Automatically retries failed operations.\n- **ApolloLink.split**: Routes operations to different links based on a condition (e.g., subscriptions via WebSocket, queries via HTTP).",
          badges: ["ApolloLink", "Middleware", "Error Handling"],
          code: "import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';\nimport { onError } from '@apollo/client/link/error';\nimport { RetryLink } from '@apollo/client/link/retry';\n\nconst errorLink = onError(({ graphQLErrors, networkError }) => {\n  if (graphQLErrors) {\n    graphQLErrors.forEach(({ message, locations, path }) => {\n      console.error(`[GraphQL error]: ${message}`);\n    });\n  }\n  if (networkError) {\n    console.error(`[Network error]: ${networkError}`);\n  }\n});\n\nconst retryLink = new RetryLink({\n  delay: { initial: 300, max: 3000, jitter: true },\n  attempts: { max: 3, retryIf: (error) => !!error },\n});\n\nconst httpLink = new HttpLink({ uri: '/graphql' });\n\nconst client = new ApolloClient({\n  link: from([errorLink, retryLink, httpLink]),\n  cache: new InMemoryCache(),\n});",
        },
        {
          tag: "exercise",
          title: "Build an error handling chain",
          body: "Create an Apollo Client with a link chain using `from([...])`. Add an `onError` link that logs GraphQL errors and network errors to the console. Add a `RetryLink` that retries up to 3 times with exponential backoff. Use `ApolloLink.split` to route subscription operations to a `WebSocketLink` and everything else to `HttpLink`.",
          badges: ["Practice", "Links"],
        },
        {
          tag: "tip",
          title: "errorPolicy variants",
          body: "The `errorPolicy` option on `useQuery`/`useMutation` controls how errors are surfaced:\n- **none** (default): Errors in the `error` field, `data` is `undefined`.\n- **ignore**: Errors are discarded, only valid data is returned.\n- **all**: Both `data` and `error` can coexist — partial data with errors.\n\nUse `all` when you want to show whatever data came back even if some fields errored (common with federated schemas).",
          badges: ["errorPolicy", "Partial Data"],
          code: "const { data, error } = useQuery(GET_DASHBOARD, {\n  errorPolicy: 'all',\n});\n// data AND error can both have values",
        },
        {
          tag: "key-point",
          title: "Error Boundaries with Apollo",
          body: "Combine React **Error Boundaries** with Apollo's error handling for a robust strategy: `onError` link handles global logging/auth redirects, `errorPolicy: 'all'` surfaces partial data, and React Error Boundaries catch any unhandled rendering errors. For mutations, always handle errors in the `.catch()` or mutation result — don't rely on Error Boundaries for user-initiated actions.",
          badges: ["Error Boundaries", "Strategy"],
        },
      ],
      codeExamples: [
        {
          code: "const link = ApolloLink.split(\n  ({ query }) => {\n    const def = getMainDefinition(query);\n    return def.kind === 'OperationDefinition' && def.operation === 'subscription';\n  },\n  wsLink,\n  httpLink,\n);",
          comment: "Split subscriptions to WebSocket, queries to HTTP",
        },
      ],
      defaultCode: `import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Error handling link — logs all errors
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        \`[GraphQL error]: Message: \${message}, Path: \${path}\`
      );
    });
  }
  if (networkError) {
    console.error(\`[Network error on \${operation.operationName}]: \${networkError}\`);
  }
});

// Retry link — retry transient failures
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
});

// Logging link — track operation timing
const loggingLink = new ApolloLink((operation, forward) => {
  const start = Date.now();
  operation.setContext({ start });

  return forward(operation).map(response => {
    const duration = Date.now() - start;
    console.log(\`[Apollo] \${operation.operationName} took \${duration}ms\`);
    return response;
  });
});

// HTTP link — terminating link
const httpLink = new HttpLink({
  uri: '/graphql',
  headers: {
    authorization: \`Bearer \${localStorage.getItem('token') || ''}\`,
  },
});

// Chain: logging → error → retry → http
const client = new ApolloClient({
  link: from([loggingLink, errorLink, retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
  },
});

function App() {
  return (
    <div>
      <h2>Apollo Link Chain</h2>
      <p>Client configured with error handling, retry, and logging links.</p>
      <pre style={{ background: '#1a1a2e', padding: 16, borderRadius: 8, fontSize: 12 }}>
        {JSON.stringify({
          links: ['LoggingLink', 'ErrorLink', 'RetryLink', 'HttpLink'],
          errorPolicy: 'all',
          retryAttempts: 3,
        }, null, 2)}
      </pre>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("ApolloLink") ||
          code.includes("onError") ||
          code.includes("ErrorLink"),
        message: "Error handling and link chains mastered!",
      }),
    },

    // ── Lesson 12: Suspense Hooks ─────────────────────────────────────────
    {
      title: "Apollo 12: Suspense Hooks",
      content: [
        "Apollo 3.8+ introduces Suspense-compatible hooks: useSuspenseQuery, useBackgroundQuery, and useLoadableQuery. They work with React Suspense boundaries for declarative loading states.",
        "Convert a useQuery component to use useSuspenseQuery with a Suspense boundary. Use useBackgroundQuery to avoid request waterfalls in parent-child trees.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Suspense-compatible hooks",
          body: "Apollo provides three Suspense hooks:\n\n- **useSuspenseQuery**: Suspends the component while the query loads. No `loading` boolean — the Suspense boundary handles it. Returns `{ data, error }`.\n- **useBackgroundQuery**: Starts a query in a parent component and returns a `queryRef`. The child consumes it with `useReadQuery(queryRef)`, which suspends. This avoids **request waterfalls** because the parent starts fetching before the child mounts.\n- **useLoadableQuery**: Returns `[loadQuery, queryRef]` — the query only executes when you call `loadQuery()`. Perfect for user-triggered data loading (click to load detail).",
          badges: ["Suspense", "useSuspenseQuery", "useBackgroundQuery"],
          code: "import { Suspense } from 'react';\nimport { useSuspenseQuery } from '@apollo/client';\n\nfunction UserProfile({ id }) {\n  // This suspends — no loading state needed!\n  const { data } = useSuspenseQuery(GET_USER, {\n    variables: { id },\n  });\n  return <h2>{data.user.name}</h2>;\n}\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading profile...</p>}>\n      <UserProfile id=\"1\" />\n    </Suspense>\n  );\n}",
        },
        {
          tag: "exercise",
          title: "Convert useQuery to Suspense",
          body: "Replace `useQuery(GET_USERS)` with `useSuspenseQuery(GET_USERS)` in a **UserList** component. Remove the `if (loading)` check — Suspense handles it now. Wrap the component in `<Suspense fallback={<Skeleton />}>`. Then use `useBackgroundQuery` in a parent to start fetching user details while the list is still rendering.",
          badges: ["Practice", "Suspense"],
        },
        {
          tag: "tip",
          title: "startTransition for smooth UX",
          body: "Wrap variable changes in `startTransition` to keep showing the current UI while new data loads: `startTransition(() => setUserId('2'))`. Without it, React Suspense would immediately show the fallback. With `startTransition`, the old data stays visible (in a \"pending\" state) until the new data is ready. Combine with `useTransition` for an `isPending` boolean to show a subtle loading indicator.",
          badges: ["startTransition", "UX"],
          code: "import { useTransition } from 'react';\n\nfunction UserList() {\n  const [isPending, startTransition] = useTransition();\n  const [userId, setUserId] = useState('1');\n\n  const selectUser = (id) => {\n    startTransition(() => setUserId(id));\n  };\n\n  return (\n    <div style={{ opacity: isPending ? 0.7 : 1 }}>\n      {/* content */}\n    </div>\n  );\n}",
        },
        {
          tag: "key-point",
          title: "Avoiding waterfalls with useBackgroundQuery",
          body: "A **request waterfall** happens when a parent fetches data, then a child mounts and starts its own fetch. The child's request is delayed by the parent's loading time. `useBackgroundQuery` solves this: the parent starts both requests simultaneously. The parent renders `<Suspense>` around the child, which uses `useReadQuery(queryRef)` to consume the already-in-flight query. Both queries load in parallel instead of sequentially.",
          badges: ["Performance", "useBackgroundQuery"],
          code: "function Parent() {\n  const [queryRef] = useBackgroundQuery(GET_DETAILS, {\n    variables: { id: '1' },\n  });\n\n  return (\n    <Suspense fallback={<p>Loading details...</p>}>\n      <Child queryRef={queryRef} />\n    </Suspense>\n  );\n}\n\nfunction Child({ queryRef }) {\n  const { data } = useReadQuery(queryRef);\n  return <p>{data.details.title}</p>;\n}",
        },
      ],
      codeExamples: [
        {
          code: "const { data } = useSuspenseQuery(GET_USERS);",
          comment: "No loading boolean — component suspends until data is ready",
        },
        {
          code: "const [queryRef] = useBackgroundQuery(GET_DETAILS);\n// pass queryRef to child via props",
          comment: "Start query in parent, consume in child",
        },
      ],
      defaultCode: `import { Suspense, useState, useTransition } from 'react';
import { useSuspenseQuery, useBackgroundQuery, useReadQuery, gql } from '@apollo/client';

const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`;

const GET_USER_DETAIL = gql\`
  query GetUserDetail($id: ID!) {
    user(id: $id) {
      id
      name
      email
      bio
      avatar
    }
  }
\`;

// Suspense-compatible component — no loading checks needed
function UserList({ onSelect }) {
  const { data } = useSuspenseQuery(GET_USERS);

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          <button onClick={() => onSelect(user.id)} style={{
            background: 'none', border: 'none', color: '#61dafb',
            cursor: 'pointer', textDecoration: 'underline',
          }}>
            {user.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Child that reads background query
function UserDetail({ queryRef }) {
  const { data } = useReadQuery(queryRef);
  const user = data.user;

  return (
    <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState('1');
  const [isPending, startTransition] = useTransition();

  // Background query starts in parent — no waterfall!
  const [queryRef] = useBackgroundQuery(GET_USER_DETAIL, {
    variables: { id: selectedId },
  });

  const handleSelect = (id) => {
    startTransition(() => setSelectedId(id));
  };

  return (
    <div>
      <h2>Suspense Hooks</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h3>Users</h3>
          <Suspense fallback={<p>Loading users...</p>}>
            <UserList onSelect={handleSelect} />
          </Suspense>
        </div>
        <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <h3>Detail</h3>
          <Suspense fallback={<p>Loading detail...</p>}>
            <UserDetail queryRef={queryRef} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("useSuspenseQuery") || code.includes("useBackgroundQuery")) &&
          code.includes("Suspense"),
        message: "Suspense hooks mastered! Declarative loading states with Apollo.",
      }),
    },

    // ── Lesson 13: Subscriptions & Polling ────────────────────────────────
    {
      title: "Apollo 13: Subscriptions & Polling",
      content: [
        "For real-time data, Apollo offers subscriptions (WebSocket-based), subscribeToMore (add real-time updates to a query), and polling (simple interval-based refetching).",
        "Add polling to a query for near-real-time updates. Implement subscribeToMore to append new messages to an existing query result.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Real-time data strategies",
          body: "Apollo provides three strategies for real-time data:\n\n- **useSubscription**: A hook that opens a WebSocket connection and returns data as it arrives. Similar API to `useQuery` but for push-based data.\n- **subscribeToMore**: Called on a `useQuery` result, it opens a subscription that updates the query's cached data. Perfect for appending new items to a list.\n- **pollInterval**: The simplest option — pass `pollInterval: 5000` to `useQuery` and it re-fetches every 5 seconds. No WebSocket needed.",
          badges: ["Subscriptions", "Polling", "Real-time"],
          code: "// Polling — simplest real-time\nconst { data } = useQuery(GET_MESSAGES, {\n  pollInterval: 3000, // refetch every 3s\n});\n\n// subscribeToMore — append new items\nconst { data, subscribeToMore } = useQuery(GET_MESSAGES);\n\nuseEffect(() => {\n  return subscribeToMore({\n    document: MESSAGE_ADDED,\n    updateQuery: (prev, { subscriptionData }) => ({\n      messages: [...prev.messages, subscriptionData.data.messageAdded],\n    }),\n  });\n}, [subscribeToMore]);",
        },
        {
          tag: "exercise",
          title: "Add polling to a query",
          body: "Create a **MessageFeed** component that uses `useQuery(GET_MESSAGES, { pollInterval: 5000 })`. Add a toggle button to start/stop polling using `startPolling(5000)` and `stopPolling()`. Display the last-updated timestamp so users can see when data was refreshed. Show the message count updating in real-time.",
          badges: ["Practice", "Polling"],
        },
        {
          tag: "tip",
          title: "Polling as WebSocket fallback",
          body: "WebSocket subscriptions require server-side support and add infrastructure complexity. **Polling** is a great alternative when: data changes infrequently (every few seconds is fine), you can't set up WebSocket infrastructure, or you need to work through proxies that don't support WebSocket. Start with polling — upgrade to subscriptions only when you need sub-second latency.",
          badges: ["Strategy", "Polling vs Subscriptions"],
        },
        {
          tag: "key-point",
          title: "When to use subscriptions vs polling",
          body: "Use **subscriptions** for: chat messages, live notifications, collaborative editing, stock prices — anything where sub-second latency matters and events are frequent. Use **polling** for: dashboards, feed refreshes, status checks — anything where a few seconds of staleness is acceptable. Use **subscribeToMore** when you have an initial query result (e.g., last 50 messages) and want to append new items as they arrive via subscription.",
          badges: ["Architecture", "Decision"],
        },
      ],
      codeExamples: [
        {
          code: "const { data, startPolling, stopPolling } = useQuery(GET_DATA, {\n  pollInterval: 5000,\n});",
          comment: "Polling with start/stop controls",
        },
        {
          code: "useSubscription(MESSAGE_ADDED, {\n  onData: ({ data }) => console.log('New:', data),\n});",
          comment: "useSubscription with onData callback",
        },
      ],
      defaultCode: `import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_MESSAGES = gql\`
  query GetMessages {
    messages {
      id
      text
      sender
      timestamp
    }
  }
\`;

function MessageFeed() {
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { data, loading, startPolling, stopPolling } = useQuery(GET_MESSAGES, {
    pollInterval: 5000, // Poll every 5 seconds
    onCompleted: () => setLastUpdate(new Date()),
  });

  const togglePolling = () => {
    if (isPolling) {
      stopPolling();
    } else {
      startPolling(5000);
    }
    setIsPolling(!isPolling);
  };

  if (loading && !data) return <p>Loading messages...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <span style={{ color: isPolling ? '#22c55e' : '#ef4444' }}>
            {isPolling ? '● Live' : '○ Paused'}
          </span>
          <small style={{ marginLeft: 8, color: '#888' }}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </small>
        </div>
        <button onClick={togglePolling} style={{
          padding: '6px 16px', borderRadius: 6,
          border: '1px solid #61dafb', background: 'transparent',
          color: '#61dafb', cursor: 'pointer',
        }}>
          {isPolling ? 'Stop Polling' : 'Start Polling'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data?.messages?.map(msg => (
          <div key={msg.id} style={{
            padding: 12, borderRadius: 8,
            background: 'rgba(97,218,251,0.05)',
            border: '1px solid #222',
          }}>
            <strong style={{ color: '#61dafb' }}>{msg.sender}</strong>
            <p style={{ margin: '4px 0 0' }}>{msg.text}</p>
            <small style={{ color: '#666' }}>{msg.timestamp}</small>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, color: '#888', fontSize: 12 }}>
        Messages: {data?.messages?.length || 0} | Polling interval: 5000ms
      </p>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Real-time Messages</h2>
      <MessageFeed />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("pollInterval") ||
          code.includes("useSubscription") ||
          code.includes("subscribeToMore"),
        message: "Real-time patterns mastered! You can keep data fresh with Apollo.",
      }),
    },

    // ── Lesson 14: Testing Apollo ─────────────────────────────────────────
    {
      title: "Apollo 14: Testing Apollo",
      content: [
        "MockedProvider lets you test Apollo components without a real server. Define mock responses for your queries and mutations, then render your components in tests.",
        "Write a test file with MockedProvider. Mock a query, render a component, and assert that the data appears correctly. Test error states too.",
      ],
      sections: [
        {
          tag: "concept",
          title: "MockedProvider and mock structure",
          body: "Apollo provides **MockedProvider** as a test wrapper. It replaces `ApolloProvider` and accepts a `mocks` array. Each mock is an object with `request` (containing `query` and `variables`) and `result` (containing `data`). When a component inside `MockedProvider` executes a matching query, the mock result is returned instead of hitting the network. Mocks are consumed **in order** — if you render the same query twice, you need two mock entries.",
          badges: ["Testing", "MockedProvider"],
          code: "import { MockedProvider } from '@apollo/client/testing';\n\nconst mocks = [\n  {\n    request: {\n      query: GET_USERS,\n      variables: {},\n    },\n    result: {\n      data: {\n        users: [\n          { id: '1', name: 'Alice', email: 'alice@test.com' },\n          { id: '2', name: 'Bob', email: 'bob@test.com' },\n        ],\n      },\n    },\n  },\n];\n\nrender(\n  <MockedProvider mocks={mocks} addTypename={false}>\n    <UserList />\n  </MockedProvider>\n);",
        },
        {
          tag: "exercise",
          title: "Write a test with mocked query",
          body: "Create a test that wraps **UserList** in `MockedProvider` with a mock for `GET_USERS`. Use `addTypename={false}` to simplify mocks. After rendering, wait for the loading state to resolve (use `waitFor` or `findByText`). Assert that user names appear in the document. Then add a second test with `result: { errors: [new GraphQLError('Not found')] }` to test the error state.",
          badges: ["Practice", "Testing"],
        },
        {
          tag: "tip",
          title: "Testing error states",
          body: "Test both GraphQL errors and network errors. For GraphQL errors: `{ request: {...}, result: { errors: [new GraphQLError('Oops')] } }`. For network errors: `{ request: {...}, error: new Error('Network error') }`. Always test the error UI path — it's easy to miss broken error states in development but critical in production.",
          badges: ["Error Testing", "Robustness"],
          code: "const errorMock = {\n  request: { query: GET_USERS },\n  error: new Error('Network error'),\n};\n\nrender(\n  <MockedProvider mocks={[errorMock]} addTypename={false}>\n    <UserList />\n  </MockedProvider>\n);\n\nawait screen.findByText(/error/i);",
        },
        {
          tag: "key-point",
          title: "Testing reactive variables",
          body: "Reactive variables can be tested by setting them before rendering, then asserting the result. Since reactive variables are global singletons, **reset them** in `beforeEach` to avoid test pollution: `beforeEach(() => { favoritesVar([]); })`. You can also test that UI updates when the variable changes: set the var, wait for re-render, assert new UI state.",
          badges: ["Reactive Variables", "Test Isolation"],
          code: "beforeEach(() => {\n  favoritesVar([]); // Reset before each test\n});\n\ntest('shows favorite count', () => {\n  favoritesVar(['1', '2']); // Set initial state\n  render(<FavoriteCount />);\n  expect(screen.getByText('2 favorites')).toBeInTheDocument();\n});",
        },
      ],
      codeExamples: [
        {
          code: "render(\n  <MockedProvider mocks={mocks} addTypename={false}>\n    <UserList />\n  </MockedProvider>\n);",
          comment: "Wrapping component in MockedProvider for testing",
        },
        {
          code: "const mocks = [{\n  request: { query: GET_USERS },\n  result: { data: { users: [{ id: '1', name: 'Alice' }] } },\n}];",
          comment: "Mock definition structure",
        },
      ],
      defaultCode: `import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

// The query we're testing
const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`;

// Component under test
function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Mock data
const mocks = [
  {
    request: {
      query: GET_USERS,
    },
    result: {
      data: {
        users: [
          { id: '1', name: 'Alice', email: 'alice@example.com' },
          { id: '2', name: 'Bob', email: 'bob@example.com' },
          { id: '3', name: 'Charlie', email: 'charlie@example.com' },
        ],
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: GET_USERS,
    },
    error: new Error('Failed to fetch users'),
  },
];

// Tests
describe('UserList', () => {
  it('renders users after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    );

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to appear
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

// For the exercise preview
function App() {
  return (
    <div>
      <h2>Testing Apollo Components</h2>
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserList />
      </MockedProvider>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("MockedProvider") &&
          code.includes("mocks"),
        message: "Apollo testing patterns mastered!",
      }),
    },

    // ── Lesson 15: Performance Optimization ───────────────────────────────
    {
      title: "Apollo 15: Performance Optimization",
      content: [
        "Apollo offers several performance tools: @defer for incremental delivery, BatchHttpLink for request batching, persisted queries for reduced bandwidth, and useFragment for fine-grained reactivity.",
        "Configure an Apollo Client with BatchHttpLink and persisted queries. Use @defer to prioritize critical data and load secondary data progressively.",
      ],
      sections: [
        {
          tag: "concept",
          title: "@defer, BatchHttpLink, persisted queries",
          body: "Three powerful optimization techniques:\n\n- **@defer**: A directive that tells the server to send part of the response later. Critical data arrives first, deferred fields stream in after: `user { name posts @defer { title } }`. The component re-renders as each deferred chunk arrives.\n- **BatchHttpLink**: Combines multiple GraphQL operations sent within a short window into a **single HTTP request**. Reduces connection overhead when components fire many queries simultaneously.\n- **Persisted queries**: Instead of sending the full query string, send a hash. The server looks up the query by hash. Saves bandwidth (queries can be 10KB+) and adds a security layer.",
          badges: ["Performance", "@defer", "Batching", "APQ"],
          code: "// @defer directive\nconst GET_USER = gql`\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      name\n      email\n      ... @defer {\n        posts {\n          id\n          title\n        }\n        analytics {\n          views\n          followers\n        }\n      }\n    }\n  }\n`;",
        },
        {
          tag: "exercise",
          title: "Configure batching and APQ",
          body: "Create an Apollo Client using `BatchHttpLink` instead of `HttpLink`. Set `batchMax: 5` and `batchInterval: 20` for optimal batching. Add `createPersistedQueryLink` from `@apollo/client/link/persisted-queries` before the batch link. Use `sha256` from `crypto-hash` for the hash function. Test with a component that fires multiple queries on mount.",
          badges: ["Practice", "Performance"],
        },
        {
          tag: "tip",
          title: "useFragment for fine-grained reactivity",
          body: "By default, when **any** field in a query result changes, **every** component using that query re-renders. `useFragment` subscribes to a **single fragment** on a specific cache entity. It only re-renders when that fragment's fields change. Use it for list items: each `TodoItem` subscribes to its own `TodoFields` fragment, so checking off one todo doesn't re-render the entire list.",
          badges: ["useFragment", "Reactivity"],
          code: "import { useFragment } from '@apollo/client';\n\nconst TODO_FIELDS = gql`\n  fragment TodoFields on Todo {\n    id\n    title\n    completed\n  }\n`;\n\nfunction TodoItem({ id }) {\n  const { data } = useFragment({\n    fragment: TODO_FIELDS,\n    from: { __typename: 'Todo', id },\n  });\n  // Only re-renders when THIS todo's fields change\n  return <li>{data.title}</li>;\n}",
        },
        {
          tag: "key-point",
          title: "Federation overview for scaling",
          body: "For large-scale applications, **Apollo Federation** lets you split your graph across multiple services (subgraphs). Each team owns a subgraph (users, products, orders) and a **gateway** (Apollo Router) composes them into a single graph. Clients query the gateway as if it's one schema. Federation is about **team autonomy** — teams can deploy independently while maintaining a unified API for the frontend.",
          badges: ["Federation", "Architecture", "Scaling"],
        },
        {
          tag: "tip",
          title: "Measuring Apollo performance",
          body: "Use Apollo Client Devtools to inspect cache contents, track query timing, and debug cache misses. In production, use `ApolloLink` to log operation durations. Monitor cache hit rates — if `cache-first` queries always miss, check your `keyFields` and type policies. A well-tuned Apollo cache should serve 60-80% of reads from cache in typical apps.",
          badges: ["Devtools", "Monitoring"],
        },
      ],
      codeExamples: [
        {
          code: "import { BatchHttpLink } from '@apollo/client/link/batch-http';\n\nconst batchLink = new BatchHttpLink({\n  uri: '/graphql',\n  batchMax: 5,\n  batchInterval: 20,\n});",
          comment: "Batch up to 5 operations within 20ms",
        },
        {
          code: "import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';\nimport { sha256 } from 'crypto-hash';\n\nconst persistedLink = createPersistedQueryLink({ sha256 });",
          comment: "Send query hashes instead of full query strings",
        },
      ],
      defaultCode: `import {
  ApolloClient,
  InMemoryCache,
  gql,
  useQuery,
  useFragment,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

// Performance-optimized Apollo Client
const persistedLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

const batchLink = new BatchHttpLink({
  uri: '/graphql',
  batchMax: 5,
  batchInterval: 20,
});

const client = new ApolloClient({
  link: persistedLink.concat(batchLink),
  cache: new InMemoryCache(),
});

// Query with @defer for incremental delivery
const GET_DASHBOARD = gql\`
  query GetDashboard {
    user {
      id
      name
      email
      ... @defer {
        posts {
          id
          title
          views
        }
        analytics {
          totalViews
          followers
          engagement
        }
      }
    }
  }
\`;

// Fragment for fine-grained reactivity
const POST_FIELDS = gql\`
  fragment PostFields on Post {
    id
    title
    views
  }
\`;

function PostItem({ postId }) {
  const { data } = useFragment({
    fragment: POST_FIELDS,
    from: { __typename: 'Post', id: postId },
  });

  return (
    <li>
      <strong>{data.title}</strong>
      <span style={{ marginLeft: 8, color: '#888' }}>{data.views} views</span>
    </li>
  );
}

function Dashboard() {
  const { data, loading } = useQuery(GET_DASHBOARD);

  if (loading && !data) return <p>Loading dashboard...</p>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3>{data?.user?.name}</h3>
        <p style={{ color: '#888' }}>{data?.user?.email}</p>
      </div>

      {data?.user?.posts ? (
        <div>
          <h4>Posts</h4>
          <ul>
            {data.user.posts.map(post => (
              <PostItem key={post.id} postId={post.id} />
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: '#666' }}>Loading posts (deferred)...</p>
      )}

      {data?.user?.analytics ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
          <div style={{ padding: 12, background: 'rgba(97,218,251,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 24, margin: 0, color: '#61dafb' }}>{data.user.analytics.totalViews}</p>
            <small style={{ color: '#888' }}>Views</small>
          </div>
          <div style={{ padding: 12, background: 'rgba(139,92,246,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 24, margin: 0, color: '#a78bfa' }}>{data.user.analytics.followers}</p>
            <small style={{ color: '#888' }}>Followers</small>
          </div>
          <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 24, margin: 0, color: '#22c55e' }}>{data.user.analytics.engagement}%</p>
            <small style={{ color: '#888' }}>Engagement</small>
          </div>
        </div>
      ) : (
        <p style={{ color: '#666' }}>Loading analytics (deferred)...</p>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Performance Optimization</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>
        BatchHttpLink + Persisted Queries + @defer + useFragment
      </p>
      <Dashboard />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("BatchHttpLink") ||
          code.includes("PersistedQuery") ||
          code.includes("persisted") ||
          code.includes("@defer"),
        message: "Apollo performance optimization mastered! You've completed the course.",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `apollo-${i + 1}`;
    const next = i < raw.length - 1 ? `apollo-${i + 2}` : undefined;
    const prev = i > 0 ? `apollo-${i}` : undefined;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: next,
      prevStep: prev,
      content: lesson.content,
    };
  });
}

export const APOLLO_COURSE_LESSONS = buildApolloLessons();

export function getApolloLessonById(slug: string): WebCourseLesson | undefined {
  return APOLLO_COURSE_LESSONS.find((l) => l.id === slug);
}
