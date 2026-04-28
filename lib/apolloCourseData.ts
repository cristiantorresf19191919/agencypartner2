/**
 * Apollo GraphQL Course - 25 comprehensive lessons covering Apollo Client from
 * foundations through production mastery. Uses Monaco editor with validation.
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";
import { APOLLO_TITLES_ES } from "./courseShellTranslations";

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

    /* ──────────────────────────────────────────────────────────────────────
     * TIER 4 — Real-World Patterns (Lessons 16-20)
     * ────────────────────────────────────────────────────────────────────── */

    // ── Lesson 16: Custom Hooks ──────────────────────────────────────────
    {
      title: "Apollo 16: Custom Hooks",
      content: [
        "Wrapping Apollo hooks in custom hooks lets you encapsulate query logic, add type safety, and create reusable data-fetching patterns across your app.",
        "Build three custom hooks — useCurrentUser, usePaginatedQuery, and useOptimisticToggle — that abstract common Apollo patterns into clean, composable units.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Why wrap Apollo hooks?",
          body: "Raw `useQuery` and `useMutation` calls scattered across components create **duplication** and **tight coupling** to your GraphQL schema. Custom hooks solve this by:\n\n- **Encapsulating** the query, variables, and options in one place.\n- **Adding type safety** — the hook returns strongly-typed data, not `any`.\n- **Abstracting complexity** — pagination logic, optimistic updates, and error handling live inside the hook, not in the component.\n- **Enabling testing** — mock the custom hook instead of MockedProvider.\n\nThe pattern is simple: define a function that calls Apollo hooks internally and returns a curated API.",
          badges: ["Custom Hooks", "Abstraction", "DRY"],
          code: "// Before: duplicated everywhere\nconst { data } = useQuery(GET_CURRENT_USER);\nconst user = data?.currentUser;\n\n// After: one clean hook\nfunction useCurrentUser() {\n  const { data, loading, error } = useQuery(GET_CURRENT_USER);\n  return {\n    user: data?.currentUser ?? null,\n    loading,\n    error,\n    isAuthenticated: !!data?.currentUser,\n  };\n}\n\n// Usage\nconst { user, isAuthenticated } = useCurrentUser();",
        },
        {
          tag: "exercise",
          title: "Create useCurrentUser",
          body: "Define a `GET_CURRENT_USER` query that fetches `id`, `name`, `email`, `avatar`, and `role`. Create a `useCurrentUser` custom hook that calls `useQuery(GET_CURRENT_USER)` internally and returns `{ user, loading, error, isAuthenticated, isAdmin }`. Derive `isAuthenticated` from `!!data?.currentUser` and `isAdmin` from `user?.role === 'ADMIN'`. Use the hook in a **Navbar** component to show the user's name or a login button.",
          badges: ["Practice", "Custom Hooks"],
        },
        {
          tag: "tip",
          title: "Typing custom hooks with generics",
          body: "Use TypeScript generics to create **reusable** custom hooks. For example, `usePaginatedQuery<TData, TVars>` accepts any query and returns paginated data with `loadMore` and `hasMore`. The key is to constrain the generic with `DocumentNode` and use Apollo's `TypedDocumentNode` for end-to-end type inference: `function usePaginatedQuery<TData, TVars>(query: TypedDocumentNode<TData, TVars>, options: QueryHookOptions<TData, TVars>)`.",
          badges: ["TypeScript", "Generics"],
          code: "import { TypedDocumentNode } from '@apollo/client';\n\nfunction usePaginatedQuery<TData, TVars extends { offset: number; limit: number }>(\n  query: TypedDocumentNode<TData, TVars>,\n  options: { variables: TVars; getItems: (data: TData) => unknown[] }\n) {\n  const { data, loading, fetchMore } = useQuery(query, {\n    variables: options.variables,\n  });\n\n  const items = data ? options.getItems(data) : [];\n\n  const loadMore = () =>\n    fetchMore({\n      variables: { ...options.variables, offset: items.length } as TVars,\n    });\n\n  return { items, loading, loadMore, hasMore: items.length % options.variables.limit === 0 };\n}",
        },
        {
          tag: "key-point",
          title: "Hook composition patterns",
          body: "Custom hooks **compose** — build small hooks that combine into larger ones:\n\n1. `useCurrentUser()` — fetches and returns the current user.\n2. `usePermissions(user)` — derives permissions from the user object.\n3. `useAuthGuard()` — calls both, redirects if not authenticated.\n\nEach hook has a **single responsibility**. The composition happens at the call site, not inside a God hook. This mirrors React's philosophy: prefer composition over inheritance, even in data-fetching.",
          badges: ["Composition", "Architecture"],
        },
      ],
      codeExamples: [
        {
          code: "function useCurrentUser() {\n  const { data, loading, error } = useQuery(GET_CURRENT_USER);\n  return { user: data?.currentUser ?? null, loading, error, isAuthenticated: !!data?.currentUser };\n}",
          comment: "Custom hook wrapping a query with derived state",
        },
        {
          code: "const { toggleLike, isLiked } = useOptimisticToggle(post.id);",
          comment: "Clean API from a custom optimistic mutation hook",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_CURRENT_USER = gql\`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
      avatar
      role
    }
  }
\`;

const TOGGLE_FAVORITE = gql\`
  mutation ToggleFavorite($itemId: ID!) {
    toggleFavorite(itemId: $itemId) {
      id
      isFavorite
    }
  }
\`;

// Custom Hook: useCurrentUser
function useCurrentUser() {
  const { data, loading, error } = useQuery(GET_CURRENT_USER);
  const user = data?.currentUser ?? null;

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };
}

// Custom Hook: useOptimisticToggle
function useOptimisticToggle(itemId, initialState = false) {
  const [isActive, setIsActive] = useState(initialState);
  const [toggleMutation] = useMutation(TOGGLE_FAVORITE);

  const toggle = () => {
    const newState = !isActive;
    setIsActive(newState); // Optimistic local update

    toggleMutation({
      variables: { itemId },
      optimisticResponse: {
        toggleFavorite: {
          __typename: 'Item',
          id: itemId,
          isFavorite: newState,
        },
      },
    }).catch(() => setIsActive(!newState)); // Rollback on error
  };

  return { isActive, toggle };
}

// Custom Hook: usePaginatedQuery
function usePaginatedQuery(query, variables, getItems) {
  const { data, loading, fetchMore } = useQuery(query, { variables });
  const items = data ? getItems(data) : [];
  const limit = variables.limit || 10;

  const loadMore = () =>
    fetchMore({ variables: { ...variables, offset: items.length } });

  return {
    items,
    loading,
    loadMore,
    hasMore: items.length > 0 && items.length % limit === 0,
  };
}

function Navbar() {
  const { user, loading, isAuthenticated, isAdmin } = useCurrentUser();

  if (loading) return <nav style={{ padding: 16 }}>Loading...</nav>;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #333' }}>
      <strong>MyApp</strong>
      {isAuthenticated ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={user.avatar} alt={user.name} width={32} height={32} style={{ borderRadius: '50%' }} />
          <span>{user.name}</span>
          {isAdmin && <span style={{ color: '#f59e0b', fontSize: 12 }}>ADMIN</span>}
        </div>
      ) : (
        <button>Log In</button>
      )}
    </nav>
  );
}

function FavoriteButton({ itemId }) {
  const { isActive, toggle } = useOptimisticToggle(itemId);

  return (
    <button onClick={toggle} style={{
      fontSize: 20, background: 'none', border: 'none', cursor: 'pointer',
    }}>
      {isActive ? '★' : '☆'}
    </button>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <h2>Custom Hooks</h2>
        <p style={{ color: '#888' }}>useCurrentUser + useOptimisticToggle + usePaginatedQuery</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {['1', '2', '3'].map(id => (
            <div key={id} style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
              <p>Item {id}</p>
              <FavoriteButton itemId={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("useQuery") &&
          (code.includes("function use") || code.includes("const use")) &&
          (code.includes("return {") || code.includes("return{")),
        message: "Custom hooks mastered! You can encapsulate Apollo logic in reusable hooks.",
      }),
    },

    // ── Lesson 17: Schema-Driven Development ─────────────────────────────
    {
      title: "Apollo 17: Schema-Driven Development",
      content: [
        "Schema-driven development means designing your GraphQL schema first, then generating TypeScript types and typed hooks automatically with @graphql-codegen.",
        "Write a GraphQL schema, configure codegen, and use TypedDocumentNode for end-to-end type safety from schema to component.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Schema-first approach",
          body: "In **schema-driven development**, you design your GraphQL schema before writing any resolver or component code. The schema becomes the **contract** between backend and frontend teams. Once defined, tools like `@graphql-codegen` read your schema and operations (`.graphql` files) to generate:\n\n- **TypeScript types** for every type, input, and enum in your schema.\n- **Typed document nodes** that replace `gql` tagged templates.\n- **Typed hooks** (`useGetUsersQuery`, `useAddTodoMutation`) with full input/output typing.\n\nThis eliminates manual type definitions and catches schema mismatches at **build time**, not runtime.",
          badges: ["Schema-First", "Codegen", "Type Safety"],
          code: "# schema.graphql\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n  role: Role!\n  posts: [Post!]!\n}\n\nenum Role {\n  USER\n  ADMIN\n  MODERATOR\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  body: String!\n  author: User!\n  createdAt: DateTime!\n}\n\ntype Query {\n  users: [User!]!\n  user(id: ID!): User\n  posts(limit: Int, offset: Int): [Post!]!\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n  updateUser(id: ID!, input: UpdateUserInput!): User!\n}",
        },
        {
          tag: "exercise",
          title: "Write a schema and generate types",
          body: "Write a GraphQL schema with `User`, `Post`, and `Comment` types. Define `Query` and `Mutation` root types. Create a `codegen.ts` config file that uses `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations`, and `@graphql-codegen/typescript-react-apollo` plugins. Point `documents` at your `.graphql` files and `schema` at your SDL. Run codegen and use the generated `useGetUsersQuery` hook in a component.",
          badges: ["Practice", "Codegen"],
        },
        {
          tag: "tip",
          title: "TypedDocumentNode",
          body: "**TypedDocumentNode** is a typed version of `DocumentNode` that carries the query's result and variable types. Instead of `gql` tagged templates (which return untyped `DocumentNode`), codegen produces typed documents. When you pass a `TypedDocumentNode<TData, TVars>` to `useQuery`, the return type is automatically `QueryResult<TData, TVars>` — no manual generic annotations needed. This is the foundation of zero-config type safety with Apollo.",
          badges: ["TypedDocumentNode", "TypeScript"],
          code: "// Generated by codegen — fully typed!\nimport { TypedDocumentNode } from '@apollo/client';\n\ntype GetUsersQuery = {\n  users: Array<{ id: string; name: string; email: string }>;\n};\n\nconst GetUsersDocument: TypedDocumentNode<GetUsersQuery, {}> = gql`\n  query GetUsers {\n    users { id name email }\n  }\n`;\n\n// useQuery infers types automatically\nconst { data } = useQuery(GetUsersDocument);\n// data.users is typed as Array<{ id: string; name: string; email: string }>",
        },
        {
          tag: "key-point",
          title: "End-to-end type safety",
          body: "With schema-driven development, types flow from **schema** → **codegen** → **hooks** → **components** without any manual type definitions. When the schema changes (e.g., a field is renamed), codegen produces updated types, and TypeScript immediately flags every component that uses the old field name. This catches breaking changes at **build time**. Combined with CI/CD, schema changes become safe: if the build passes, the frontend is compatible with the new schema.",
          badges: ["Type Safety", "CI/CD", "DX"],
        },
      ],
      codeExamples: [
        {
          code: "import { CodegenConfig } from '@graphql-codegen/cli';\n\nconst config: CodegenConfig = {\n  schema: 'http://localhost:4000/graphql',\n  documents: ['src/**/*.graphql'],\n  generates: {\n    'src/generated/graphql.ts': {\n      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],\n    },\n  },\n};\n\nexport default config;",
          comment: "codegen.ts configuration file",
        },
        {
          code: "import { useGetUsersQuery } from '../generated/graphql';\n\nfunction UserList() {\n  const { data, loading } = useGetUsersQuery();\n  // data is fully typed!\n}",
          comment: "Using generated typed hooks",
        },
      ],
      defaultCode: `import { useQuery, gql } from '@apollo/client';

// In a real project, these types would be generated by @graphql-codegen
// This demonstrates the pattern manually

// ── Generated Types (from schema) ──────────────────────
type Role = 'USER' | 'ADMIN' | 'MODERATOR';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface Post {
  id: string;
  title: string;
  body: string;
  author: User;
  createdAt: string;
}

interface GetUsersQuery {
  users: User[];
}

interface GetPostsQuery {
  posts: Post[];
}

interface GetPostsVars {
  limit: number;
  offset: number;
}

// ── Typed Document Nodes ──────────────────────────────
const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
\`;

const GET_POSTS = gql\`
  query GetPosts($limit: Int!, $offset: Int!) {
    posts(limit: $limit, offset: $offset) {
      id
      title
      body
      author {
        id
        name
      }
      createdAt
    }
  }
\`;

// ── Custom Typed Hooks (codegen generates these) ──────
function useGetUsersQuery() {
  return useQuery<GetUsersQuery>(GET_USERS);
}

function useGetPostsQuery(variables: GetPostsVars) {
  return useQuery<GetPostsQuery, GetPostsVars>(GET_POSTS, { variables });
}

// ── Components using typed hooks ──────────────────────
function UserTable() {
  const { data, loading, error } = useGetUsersQuery();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #333' }}>
          <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
        </tr>
      </thead>
      <tbody>
        {data?.users.map(user => (
          <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
            <td style={{ padding: 8 }}>{user.name}</td>
            <td style={{ padding: 8, color: '#888' }}>{user.email}</td>
            <td style={{ padding: 8 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 12,
                background: user.role === 'ADMIN' ? 'rgba(239,68,68,0.2)' : 'rgba(97,218,251,0.2)',
                color: user.role === 'ADMIN' ? '#ef4444' : '#61dafb',
              }}>
                {user.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PostFeed() {
  const { data, loading } = useGetPostsQuery({ limit: 5, offset: 0 });

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data?.posts.map(post => (
        <article key={post.id} style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 4px' }}>{post.title}</h4>
          <p style={{ margin: '0 0 8px', color: '#aaa' }}>{post.body}</p>
          <small style={{ color: '#666' }}>by {post.author.name} on {post.createdAt}</small>
        </article>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Schema-Driven Development</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>
        Types generated from schema via @graphql-codegen
      </p>
      <h3>Users</h3>
      <UserTable />
      <h3 style={{ marginTop: 24 }}>Posts</h3>
      <PostFeed />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("interface") || code.includes("type ")) &&
          code.includes("useQuery") &&
          (code.includes("TypedDocumentNode") || code.includes("Query>") || code.includes("Query,")),
        message: "Schema-driven development mastered! Types flow from schema to components.",
      }),
    },

    // ── Lesson 18: Local State Management ────────────────────────────────
    {
      title: "Apollo 18: Local State Management",
      content: [
        "Apollo can manage local state alongside remote data using type extensions, local resolvers, and the @client directive — replacing Context or Redux for many use cases.",
        "Extend your schema with local-only fields, write local resolvers, and query local + remote data in a single operation using @client.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Extending the schema locally",
          body: "Apollo lets you **extend** your remote schema with local-only types and fields using `typeDefs`. These fields exist only on the client and are resolved by **local resolvers** or **type policy read functions**. You query them with the `@client` directive: `cartItems @client`. This unifies local and remote state into one query — a component can fetch a user from the server and the user's UI preferences from local state in the same operation.",
          badges: ["@client", "typeDefs", "Local State"],
          code: "import { ApolloClient, InMemoryCache, gql } from '@apollo/client';\n\nconst typeDefs = gql`\n  extend type Query {\n    cartItems: [CartItem!]!\n    isDarkMode: Boolean!\n  }\n\n  type CartItem {\n    id: ID!\n    name: String!\n    quantity: Int!\n    price: Float!\n  }\n`;\n\nconst client = new ApolloClient({\n  uri: '/graphql',\n  cache: new InMemoryCache(),\n  typeDefs,\n});",
        },
        {
          tag: "exercise",
          title: "Add local-only fields",
          body: "Define `typeDefs` that extend `Query` with `cartItems: [CartItem!]!` and `isDarkMode: Boolean!`. Create a `CartItem` type with `id`, `name`, `quantity`, and `price`. Use `cache.writeQuery` to initialize the cart as an empty array. Create a type policy `read` function for `isDarkMode` that reads from `localStorage`. Build a component that queries `cartItems @client` and displays them, and an `addToCart` function that uses `cache.writeQuery` to update the cart.",
          badges: ["Practice", "@client"],
        },
        {
          tag: "tip",
          title: "Mixing local + remote in one query",
          body: "The `@client` directive can be applied at the **field level**, so you can mix local and remote data in a single query. The server fields are fetched normally; the `@client` fields are resolved locally. This is powerful for UI state that relates to server data — e.g., a `product` from the server with `isInCart @client` resolved locally:\n`query { product(id: $id) { id name price isInCart @client } }`",
          badges: ["@client", "Mixed Queries"],
          code: "const GET_PRODUCT_WITH_CART_STATUS = gql`\n  query GetProduct($id: ID!) {\n    product(id: $id) {\n      id\n      name\n      price\n      isInCart @client\n    }\n  }\n`;\n\n// Type policy resolves the local field\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Product: {\n      fields: {\n        isInCart: {\n          read(_, { readField }) {\n            const id = readField('id');\n            return cartVar().some(item => item.id === id);\n          },\n        },\n      },\n    },\n  },\n});",
        },
        {
          tag: "key-point",
          title: "Apollo local state vs Context/Redux",
          body: "Use **Apollo local state** when:\n- Local state relates to server data (e.g., `isInCart` on a product).\n- You want to query local + remote data in one operation.\n- The state needs to interact with the Apollo cache.\n\nUse **React Context** when:\n- State is simple and UI-focused (theme, sidebar open/close).\n- You don't need GraphQL query integration.\n\nUse **Redux/Zustand** when:\n- You have complex state transitions (state machines, undo/redo).\n- State is independent of your GraphQL layer.\n\nApollo local state shines when it **augments** server data, not when it replaces a general state manager.",
          badges: ["Architecture", "Comparison"],
        },
      ],
      codeExamples: [
        {
          code: "const typeDefs = gql`\n  extend type Query {\n    isDarkMode: Boolean!\n  }\n`;",
          comment: "Extending the remote schema with local fields",
        },
        {
          code: "const { data } = useQuery(gql`\n  query { isDarkMode @client }\n`);",
          comment: "Querying local-only fields",
        },
      ],
      defaultCode: `import { useState } from 'react';
import { ApolloClient, InMemoryCache, useQuery, gql, makeVar, useReactiveVar } from '@apollo/client';

// Reactive variable for cart state
const cartVar = makeVar([]);

// Local schema extensions
const typeDefs = gql\`
  extend type Query {
    cartItems: [CartItem!]!
    cartTotal: Float!
  }

  type CartItem {
    id: ID!
    name: String!
    quantity: Int!
    price: Float!
  }
\`;

// Cache with local field resolvers via type policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        cartItems: {
          read() {
            return cartVar();
          },
        },
        cartTotal: {
          read() {
            return cartVar().reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
          },
        },
      },
    },
  },
});

// Query mixing server data with @client local fields
const GET_CART = gql\`
  query GetCart {
    cartItems @client {
      id
      name
      quantity
      price
    }
    cartTotal @client
  }
\`;

function addToCart(product) {
  const current = cartVar();
  const existing = current.find(item => item.id === product.id);

  if (existing) {
    cartVar(
      current.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  } else {
    cartVar([...current, { ...product, quantity: 1 }]);
  }
}

function removeFromCart(productId) {
  cartVar(cartVar().filter(item => item.id !== productId));
}

const PRODUCTS = [
  { id: '1', name: 'Apollo Client', price: 29.99, __typename: 'CartItem' },
  { id: '2', name: 'GraphQL Yoga', price: 19.99, __typename: 'CartItem' },
  { id: '3', name: 'Relay Compiler', price: 39.99, __typename: 'CartItem' },
];

function ProductShelf() {
  const cart = useReactiveVar(cartVar);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {PRODUCTS.map(product => {
        const inCart = cart.some(item => item.id === product.id);
        return (
          <div key={product.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 12, border: '1px solid #333', borderRadius: 8,
            background: inCart ? 'rgba(34,197,94,0.1)' : 'transparent',
          }}>
            <div>
              <strong>{product.name}</strong>
              <span style={{ marginLeft: 8, color: '#888' }}>\${product.price}</span>
            </div>
            <button onClick={() => addToCart(product)} style={{
              padding: '6px 12px', borderRadius: 6,
              border: '1px solid #61dafb', background: 'transparent',
              color: '#61dafb', cursor: 'pointer',
            }}>
              {inCart ? 'Add More' : 'Add to Cart'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CartSummary() {
  const { data } = useQuery(GET_CART);

  return (
    <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8, marginTop: 16 }}>
      <h3>Cart ({data?.cartItems?.length || 0} items)</h3>
      {data?.cartItems?.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
          <span>{item.name} x{item.quantity}</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>\${(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #333', paddingTop: 8, marginTop: 8, textAlign: 'right' }}>
        <strong>Total: \${data?.cartTotal?.toFixed(2) || '0.00'}</strong>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Local State Management</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>@client fields + reactive variables + type policies</p>
      <ProductShelf />
      <CartSummary />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("@client") &&
          (code.includes("typeDefs") || code.includes("typePolicies") || code.includes("makeVar")),
        message: "Local state management with Apollo mastered!",
      }),
    },

    // ── Lesson 19: Authentication Patterns ───────────────────────────────
    {
      title: "Apollo 19: Authentication Patterns",
      content: [
        "Authentication in Apollo is handled via the link chain. SetContextLink adds auth headers, token refresh links handle expiry, and resetStore clears cached data on logout.",
        "Build a complete auth link chain with JWT headers, automatic token refresh, and a logout flow that clears the Apollo cache.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Auth link chain",
          body: "The **setContext** link intercepts every GraphQL operation and adds headers before the request is sent. For authentication, you read the JWT token from storage and attach it as an `Authorization: Bearer <token>` header. The link chain typically looks like:\n\n`authLink → errorLink (catch 401) → retryLink → httpLink`\n\nThe error link watches for authentication errors (401 or specific GraphQL error codes) and can trigger a **token refresh** flow before retrying the failed operation.",
          badges: ["Authentication", "setContext", "JWT"],
          code: "import { setContext } from '@apollo/client/link/context';\n\nconst authLink = setContext((_, { headers }) => {\n  const token = localStorage.getItem('authToken');\n  return {\n    headers: {\n      ...headers,\n      authorization: token ? `Bearer ${token}` : '',\n    },\n  };\n});\n\nconst client = new ApolloClient({\n  link: from([authLink, errorLink, httpLink]),\n  cache: new InMemoryCache(),\n});",
        },
        {
          tag: "exercise",
          title: "Add JWT auth header",
          body: "Create an `authLink` using `setContext` that reads a JWT token from `localStorage` and adds it as a `Bearer` token in the `Authorization` header. Create an `errorLink` using `onError` that checks for a `401` status or `UNAUTHENTICATED` GraphQL error code. When detected, attempt to refresh the token using a `REFRESH_TOKEN` mutation, update localStorage, and retry the original operation using `forward(operation)`. Build a login form that stores the token on success.",
          badges: ["Practice", "Auth"],
        },
        {
          tag: "tip",
          title: "Refresh token flow",
          body: "When a JWT expires, the server returns a 401 or an `UNAUTHENTICATED` error. Your error link should:\n1. **Queue** all pending operations.\n2. Call a `refreshToken` endpoint with the refresh token.\n3. **Update** localStorage with the new access token.\n4. **Retry** all queued operations with the new token.\n5. If refresh fails, redirect to login.\n\nUse a **promise queue** to prevent multiple simultaneous refresh requests when several queries fail at once.",
          badges: ["Token Refresh", "Error Handling"],
          code: "let isRefreshing = false;\nlet pendingRequests = [];\n\nconst errorLink = onError(({ graphQLErrors, operation, forward }) => {\n  if (graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {\n    if (!isRefreshing) {\n      isRefreshing = true;\n      refreshToken().then(newToken => {\n        localStorage.setItem('authToken', newToken);\n        pendingRequests.forEach(cb => cb());\n        pendingRequests = [];\n        isRefreshing = false;\n      });\n    }\n    return new Observable(observer => {\n      pendingRequests.push(() => {\n        const oldHeaders = operation.getContext().headers;\n        operation.setContext({\n          headers: {\n            ...oldHeaders,\n            authorization: `Bearer ${localStorage.getItem('authToken')}`,\n          },\n        });\n        forward(operation).subscribe(observer);\n      });\n    });\n  }\n});",
        },
        {
          tag: "key-point",
          title: "resetStore on logout",
          body: "When a user logs out, you **must** clear the Apollo cache to prevent the next user from seeing stale data. `client.resetStore()` clears the cache AND refetches all active queries — but since the user is logged out, those refetches will fail. Use `client.clearStore()` instead, which clears without refetching. Also clear localStorage tokens and redirect to the login page. This three-step logout (`clearToken → clearStore → redirect`) is the standard pattern.",
          badges: ["Logout", "resetStore", "Security"],
        },
      ],
      codeExamples: [
        {
          code: "const authLink = setContext((_, { headers }) => ({\n  headers: { ...headers, authorization: `Bearer ${getToken()}` },\n}));",
          comment: "Auth link adding JWT to every request",
        },
        {
          code: "const logout = async () => {\n  localStorage.removeItem('authToken');\n  await client.clearStore();\n  navigate('/login');\n};",
          comment: "Three-step logout: clear token, clear cache, redirect",
        },
      ],
      defaultCode: `import { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  useQuery,
  useMutation,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// ── Auth Link: adds JWT to every request ────────────────
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? \`Bearer \${token}\` : '',
    },
  };
});

// ── Error Link: catches auth errors ─────────────────────
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        console.warn('Auth error — redirecting to login');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
  }
  if (networkError && 'statusCode' in networkError) {
    if (networkError.statusCode === 401) {
      console.warn('401 — clearing token');
      localStorage.removeItem('authToken');
    }
  }
});

const httpLink = new HttpLink({ uri: '/graphql' });

// ── Client with auth chain ──────────────────────────────
const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const LOGIN = gql\`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
\`;

const GET_ME = gql\`
  query GetMe {
    me {
      id
      name
      email
      avatar
    }
  }
\`;

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem('authToken', data.login.token);
      onSuccess(data.login.user);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <h3>Login</h3>
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
      />
      <input
        type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Password" style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
      />
      <button type="submit" disabled={loading} style={{
        padding: 10, borderRadius: 6, border: 'none',
        background: '#61dafb', color: '#000', cursor: 'pointer', fontWeight: 'bold',
      }}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      {error && <p style={{ color: '#ef4444' }}>Error: {error.message}</p>}
    </form>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Welcome, {user.name}!</h3>
        <button onClick={onLogout} style={{
          padding: '6px 16px', borderRadius: 6,
          border: '1px solid #ef4444', background: 'transparent',
          color: '#ef4444', cursor: 'pointer',
        }}>
          Logout
        </button>
      </div>
      <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Token:</strong> {localStorage.getItem('authToken')?.slice(0, 20)}...</p>
        <p style={{ color: '#888', fontSize: 12 }}>
          Auth header is automatically added to every GraphQL request via setContext link.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    await client.clearStore();
    setUser(null);
  };

  return (
    <div>
      <h2>Authentication Patterns</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>setContext + errorLink + clearStore</p>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onSuccess={setUser} />
      )}
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("setContext") || code.includes("authLink") || code.includes("authorization")) &&
          (code.includes("Bearer") || code.includes("token") || code.includes("Token")),
        message: "Authentication patterns mastered! You can secure Apollo requests.",
      }),
    },

    // ── Lesson 20: File Uploads ──────────────────────────────────────────
    {
      title: "Apollo 20: File Uploads",
      content: [
        "GraphQL file uploads use the multipart request spec. Apollo supports uploads via createUploadLink, which replaces HttpLink and handles File/Blob objects in variables.",
        "Build a file upload component that sends files via a GraphQL mutation using createUploadLink and tracks upload progress.",
      ],
      sections: [
        {
          tag: "concept",
          title: "How file uploads work in GraphQL",
          body: "Standard GraphQL operations send JSON over HTTP. File uploads require **multipart form data** (like traditional HTML file uploads). The `apollo-upload-client` package provides `createUploadLink`, which detects `File` or `Blob` objects in your mutation variables and automatically switches to multipart encoding. The server expects an `Upload` scalar type. The flow:\n\n1. Client sends a multipart request with the file and GraphQL operation.\n2. Server parses the multipart body and provides a readable stream.\n3. Server resolves the `Upload` scalar to get the file stream.\n4. Your resolver reads the stream and saves the file.",
          badges: ["File Upload", "Multipart", "Upload Scalar"],
          code: "import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';\n\nconst uploadLink = createUploadLink({\n  uri: '/graphql',\n  headers: {\n    'Apollo-Require-Preflight': 'true',\n  },\n});\n\nconst client = new ApolloClient({\n  link: uploadLink,\n  cache: new InMemoryCache(),\n});",
        },
        {
          tag: "exercise",
          title: "Build upload mutation",
          body: "Define an `UPLOAD_FILE` mutation that accepts `$file: Upload!` and returns `id`, `filename`, `mimetype`, and `url`. Create a file input component that captures the selected `File` object. Call the mutation with `variables: { file }` — the upload link handles the rest. Display upload status and the returned file URL on success. Add `onProgress` tracking via the `context` option in the mutation call.",
          badges: ["Practice", "Upload"],
        },
        {
          tag: "tip",
          title: "Progress tracking",
          body: "To track upload progress, use the `context` option with `fetchOptions` to pass an `onUploadProgress` callback. However, `createUploadLink` doesn't natively support progress tracking. For progress, use `XMLHttpRequest` or the Fetch API's `ReadableStream` wrapped in a custom link. A simpler approach: show an indeterminate progress bar during upload and rely on the mutation's `loading` state. For large files, consider **pre-signed URLs** (upload directly to S3/GCS, then send the URL to your API).",
          badges: ["Progress", "UX"],
          code: "// Alternative: pre-signed URL pattern\nconst GENERATE_UPLOAD_URL = gql`\n  mutation GenerateUploadUrl($filename: String!, $contentType: String!) {\n    generateUploadUrl(filename: $filename, contentType: $contentType) {\n      uploadUrl\n      fileUrl\n    }\n  }\n`;\n\nasync function uploadWithPresignedUrl(file) {\n  const { data } = await generateUrl({\n    variables: { filename: file.name, contentType: file.type },\n  });\n  await fetch(data.generateUploadUrl.uploadUrl, {\n    method: 'PUT',\n    body: file,\n    headers: { 'Content-Type': file.type },\n  });\n  return data.generateUploadUrl.fileUrl;\n}",
        },
        {
          tag: "key-point",
          title: "Upload link vs HTTP link",
          body: "`createUploadLink` is a **drop-in replacement** for `HttpLink`. It handles regular JSON requests identically but also detects `File`/`Blob` objects in variables and switches to multipart encoding. You don't need both — just replace `new HttpLink(...)` with `createUploadLink(...)`. If you use other links in your chain (auth, error, retry), place the upload link as the **terminating** link (last in the chain), just like you would with HttpLink.",
          badges: ["Upload Link", "Architecture"],
        },
      ],
      codeExamples: [
        {
          code: "const UPLOAD_FILE = gql`\n  mutation UploadFile($file: Upload!) {\n    uploadFile(file: $file) {\n      id\n      filename\n      url\n    }\n  }\n`;",
          comment: "Upload mutation using Upload scalar",
        },
        {
          code: "uploadFile({ variables: { file: event.target.files[0] } });",
          comment: "Passing a File object from an input element",
        },
      ],
      defaultCode: `import { useState, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Upload link replaces HttpLink
const uploadLink = createUploadLink({
  uri: '/graphql',
  headers: { 'Apollo-Require-Preflight': 'true' },
});

const UPLOAD_FILE = gql\`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      id
      filename
      mimetype
      url
      size
    }
  }
\`;

const UPLOAD_AVATAR = gql\`
  mutation UploadAvatar($file: Upload!, $userId: ID!) {
    uploadAvatar(file: $file, userId: $userId) {
      id
      avatarUrl
    }
  }
\`;

function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [uploadFile, { loading, error }] = useMutation(UPLOAD_FILE);

  const handleFiles = async (files) => {
    for (const file of files) {
      try {
        const { data } = await uploadFile({
          variables: { file },
        });
        setUploadedFiles(prev => [...prev, data.uploadFile]);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: 40, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
          border: \`2px dashed \${dragActive ? '#61dafb' : '#333'}\`,
          background: dragActive ? 'rgba(97,218,251,0.05)' : 'transparent',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={e => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <p style={{ margin: 0, color: dragActive ? '#61dafb' : '#888' }}>
          {loading ? 'Uploading...' : 'Drop files here or click to browse'}
        </p>
      </div>

      {/* Upload progress */}
      {loading && (
        <div style={{ marginTop: 12, padding: 8, background: 'rgba(97,218,251,0.1)', borderRadius: 8 }}>
          <div style={{
            height: 4, borderRadius: 2, background: '#61dafb',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <small style={{ color: '#61dafb' }}>Uploading...</small>
        </div>
      )}

      {error && <p style={{ color: '#ef4444', marginTop: 8 }}>Error: {error.message}</p>}

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>Uploaded Files</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {uploadedFiles.map(file => (
              <div key={file.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 12, border: '1px solid #333', borderRadius: 8,
              }}>
                <div>
                  <strong>{file.filename}</strong>
                  <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>{file.mimetype}</span>
                </div>
                <a href={file.url} target="_blank" rel="noopener" style={{ color: '#61dafb' }}>
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>File Uploads</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>createUploadLink + Upload scalar + drag & drop</p>
      <FileUploader />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("Upload") || code.includes("upload")) &&
          (code.includes("useMutation") || code.includes("createUploadLink")),
        message: "File uploads with Apollo mastered!",
      }),
    },

    /* ──────────────────────────────────────────────────────────────────────
     * TIER 5 — Production Mastery (Lessons 21-25)
     * ────────────────────────────────────────────────────────────────────── */

    // ── Lesson 21: DevTools & Debugging ──────────────────────────────────
    {
      title: "Apollo 21: DevTools & Debugging",
      content: [
        "Apollo DevTools lets you inspect the cache, watch queries in flight, and debug GraphQL operations in the browser. Combined with custom logging links, you get full visibility into your data layer.",
        "Use Apollo DevTools to inspect cache contents and debug a cache issue. Create a custom logging link that tracks operation timing and errors.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What Apollo DevTools shows",
          body: "**Apollo Client DevTools** is a browser extension (Chrome/Firefox) with three main panels:\n\n- **Queries**: Shows all active queries, their variables, loading state, and results. You can re-run queries from here.\n- **Mutations**: Lists executed mutations with their variables and results.\n- **Cache**: Visualizes the entire `InMemoryCache` as a normalized object tree. Each entry shows its cache ID (`User:5`), fields, and references. This is invaluable for debugging why a component isn't re-rendering — if the data isn't in cache, the query hasn't resolved.\n\nDevTools also lets you **modify** cache entries directly, which is powerful for testing edge cases without changing server data.",
          badges: ["DevTools", "Debugging", "Cache Inspector"],
          code: "// Enable DevTools in development\nconst client = new ApolloClient({\n  link: httpLink,\n  cache: new InMemoryCache(),\n  connectToDevTools: process.env.NODE_ENV === 'development',\n});\n\n// DevTools are automatically connected when:\n// 1. The browser extension is installed\n// 2. connectToDevTools is true (default in dev)\n// 3. window.__APOLLO_CLIENT__ is set",
        },
        {
          tag: "exercise",
          title: "Debug a cache issue",
          body: "Create a component that fetches a user list and a user detail. After updating the user's name via mutation, the list still shows the old name. Debug this using the DevTools cache inspector. The issue is that the list query returns `name` but the mutation returns `id` and `email` only — the cache entry for the user doesn't have the updated `name`. Fix the mutation to also return `name`, or use `refetchQueries` to refresh the list.",
          badges: ["Practice", "Debugging"],
        },
        {
          tag: "tip",
          title: "Logging link for request tracing",
          body: "A **logging link** sits in your link chain and logs every operation. It captures the operation name, type (query/mutation/subscription), variables, timing, and any errors. In development, log to console. In production, send to your monitoring service (DataDog, Sentry, etc.). Place the logging link **first** in the chain to capture the complete operation lifecycle including retries.",
          badges: ["Logging", "Monitoring"],
          code: "const loggingLink = new ApolloLink((operation, forward) => {\n  const { operationName } = operation;\n  const start = performance.now();\n  console.log(`[Apollo] Start: ${operationName}`, operation.variables);\n\n  return forward(operation).map(response => {\n    const duration = Math.round(performance.now() - start);\n    console.log(`[Apollo] Done: ${operationName} (${duration}ms)`);\n    if (response.errors) {\n      console.warn(`[Apollo] Errors in ${operationName}:`, response.errors);\n    }\n    return response;\n  });\n});",
        },
        {
          tag: "key-point",
          title: "Cache normalization debugging",
          body: "Most Apollo bugs come down to **cache normalization**. Common issues:\n\n- **Missing `id` in query selection**: If you don't select `id` for a type, Apollo can't normalize it and treats it as an embedded object.\n- **Missing `__typename`**: Without `__typename`, cache lookups fail. Apollo adds it automatically unless `addTypename` is false.\n- **Mutation doesn't return updated fields**: The cache only updates fields present in the mutation response. Always return the same fields your queries select.\n- **Custom keyFields not configured**: If your type uses `sku` instead of `id`, you need `typePolicies: { Product: { keyFields: ['sku'] } }`.\n\nDevTools cache inspector reveals all of these instantly.",
          badges: ["Normalization", "Common Issues"],
        },
      ],
      codeExamples: [
        {
          code: "connectToDevTools: process.env.NODE_ENV === 'development'",
          comment: "Enable DevTools only in development",
        },
        {
          code: "const loggingLink = new ApolloLink((op, forward) => {\n  console.log(`[Apollo] ${op.operationName}`);\n  return forward(op);\n});",
          comment: "Simple logging link for debugging",
        },
      ],
      defaultCode: `import { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  useQuery,
  useMutation,
  gql,
} from '@apollo/client';

// ── Logging Link: traces all operations ─────────────────
const loggingLink = new ApolloLink((operation, forward) => {
  const { operationName, variables } = operation;
  const opType = operation.query.definitions[0]?.operation || 'unknown';
  const start = performance.now();

  console.log(
    \`%c[Apollo] \${opType.toUpperCase()}: \${operationName}\`,
    'color: #61dafb; font-weight: bold',
    variables
  );

  return forward(operation).map(response => {
    const duration = Math.round(performance.now() - start);
    const hasErrors = response.errors && response.errors.length > 0;

    console.log(
      \`%c[Apollo] \${operationName} completed in \${duration}ms \${hasErrors ? '(with errors)' : ''}\`,
      hasErrors ? 'color: #ef4444' : 'color: #22c55e',
      { data: response.data, errors: response.errors }
    );

    return response;
  });
});

// ── Metrics Link: collects performance data ──────────────
const metrics = { operations: [], errors: [] };

const metricsLink = new ApolloLink((operation, forward) => {
  const start = Date.now();

  return forward(operation).map(response => {
    const entry = {
      name: operation.operationName,
      duration: Date.now() - start,
      timestamp: new Date().toISOString(),
      cached: response.data && !operation.getContext().response,
    };
    metrics.operations.push(entry);

    if (response.errors) {
      metrics.errors.push({
        operation: operation.operationName,
        errors: response.errors.map(e => e.message),
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  });
});

const httpLink = new HttpLink({ uri: '/graphql' });

const client = new ApolloClient({
  link: from([loggingLink, metricsLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`;

const UPDATE_USER = gql\`
  mutation UpdateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) {
      id
      name
      email
    }
  }
\`;

function DebugPanel() {
  const [cacheContents, setCacheContents] = useState('');

  const inspectCache = () => {
    const data = client.cache.extract();
    setCacheContents(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={inspectCache} style={{
          padding: '6px 12px', borderRadius: 6, border: '1px solid #61dafb',
          background: 'transparent', color: '#61dafb', cursor: 'pointer',
        }}>
          Inspect Cache
        </button>
        <button onClick={() => setCacheContents(JSON.stringify(metrics, null, 2))} style={{
          padding: '6px 12px', borderRadius: 6, border: '1px solid #a78bfa',
          background: 'transparent', color: '#a78bfa', cursor: 'pointer',
        }}>
          View Metrics
        </button>
      </div>
      {cacheContents && (
        <pre style={{
          background: '#0a0a1a', padding: 16, borderRadius: 8,
          fontSize: 11, maxHeight: 300, overflow: 'auto',
          border: '1px solid #333',
        }}>
          {cacheContents}
        </pre>
      )}
    </div>
  );
}

function UserManager() {
  const { data, loading } = useQuery(GET_USERS);
  const [updateUser] = useMutation(UPDATE_USER);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {data?.users?.map(user => (
          <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
            <span>{user.name} ({user.email})</span>
            <button onClick={() => updateUser({
              variables: { id: user.id, name: user.name + ' (edited)' },
            })} style={{ color: '#61dafb', cursor: 'pointer', background: 'none', border: 'none' }}>
              Edit Name
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
      <h2>DevTools & Debugging</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>Logging link + metrics link + cache inspector</p>
      <UserManager />
      <DebugPanel />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          code.includes("ApolloLink") &&
          (code.includes("console.log") || code.includes("console.warn") || code.includes("performance")),
        message: "Apollo debugging and DevTools mastered!",
      }),
    },

    // ── Lesson 22: SSR with Next.js ──────────────────────────────────────
    {
      title: "Apollo 22: SSR with Next.js",
      content: [
        "Apollo Client integrates with Next.js App Router via server-side queries in RSC, ApolloNextAppProvider for client components, and proper hydration to avoid mismatches.",
        "Configure Apollo for Next.js with server-side data fetching, client-side hydration, and Suspense streaming for optimal performance.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Apollo in Next.js App Router",
          body: "Next.js App Router uses **React Server Components** (RSC) by default. Apollo works in this model with two patterns:\n\n1. **Server Components**: Use `getClient()` from `@apollo/experimental-nextjs-app-support` to create a server-side Apollo Client. Call `client.query()` directly — no hooks, no providers.\n2. **Client Components**: Wrap your tree with `ApolloNextAppProvider` and use hooks (`useQuery`, `useSuspenseQuery`) normally.\n\nThe key challenge is **hydration**: data fetched on the server must be passed to the client without re-fetching. The `@apollo/experimental-nextjs-app-support` package handles this via cache serialization and rehydration.",
          badges: ["Next.js", "SSR", "RSC", "Hydration"],
          code: "// lib/apollo-client.ts — Server-side client\nimport { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';\nimport { registerApolloClient, ApolloClient as RSCApolloClient } from '@apollo/experimental-nextjs-app-support';\n\nexport const { getClient } = registerApolloClient(() =>\n  new ApolloClient({\n    cache: new InMemoryCache(),\n    link: new HttpLink({\n      uri: process.env.GRAPHQL_ENDPOINT,\n    }),\n  })\n);",
        },
        {
          tag: "exercise",
          title: "Server-side query in RSC",
          body: "Create a `getClient()` function using `registerApolloClient` from `@apollo/experimental-nextjs-app-support`. In a Server Component (`page.tsx`), call `const { data } = await getClient().query({ query: GET_POSTS })`. Render the posts directly — no loading states needed since this runs on the server. For interactive parts, create a Client Component (`'use client'`) wrapped in `ApolloNextAppProvider` that uses `useSuspenseQuery` for real-time updates.",
          badges: ["Practice", "SSR"],
        },
        {
          tag: "tip",
          title: "Avoiding hydration mismatch",
          body: "Hydration mismatches occur when server-rendered HTML doesn't match client-rendered HTML. With Apollo, this happens when:\n\n- The server and client use **different cache states** — the client re-fetches and gets different data.\n- `Date.now()` or random values are used in queries.\n- The server has different environment variables.\n\nFix: use `ApolloNextAppProvider` which automatically serializes the server cache and rehydrates it on the client. Always use `useSuspenseQuery` instead of `useQuery` in SSR — it integrates with React's streaming architecture.",
          badges: ["Hydration", "SSR Pitfalls"],
          code: "// app/layout.tsx — Provider for client components\n'use client';\nimport { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support';\nimport { makeClient } from './lib/apollo-client';\n\nexport function ApolloWrapper({ children }) {\n  return (\n    <ApolloNextAppProvider makeClient={makeClient}>\n      {children}\n    </ApolloNextAppProvider>\n  );\n}",
        },
        {
          tag: "key-point",
          title: "Streaming with Suspense",
          body: "Next.js App Router supports **streaming**: the server sends HTML progressively as data becomes available. Combine this with Apollo's `useSuspenseQuery` for optimal UX:\n\n1. The server renders the shell immediately.\n2. Components using `useSuspenseQuery` show Suspense fallbacks.\n3. As each query resolves on the server, the HTML chunk is streamed to the client.\n4. The client hydrates each chunk as it arrives.\n\nThis gives you fast initial paint (TTFB) with progressive data loading — the best of both SSR and client-side fetching.",
          badges: ["Streaming", "Suspense", "Performance"],
        },
      ],
      codeExamples: [
        {
          code: "const { data } = await getClient().query({ query: GET_POSTS });",
          comment: "Server-side query in a React Server Component",
        },
        {
          code: "<ApolloNextAppProvider makeClient={makeClient}>\n  {children}\n</ApolloNextAppProvider>",
          comment: "Provider for client components in Next.js",
        },
      ],
      defaultCode: `// This demonstrates the Apollo + Next.js App Router pattern
// In production, these would be separate files

import { Suspense } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  useQuery,
  gql,
} from '@apollo/client';

// ── Server-side client factory ──────────────────────────
// In Next.js, use registerApolloClient from
// @apollo/experimental-nextjs-app-support
function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || '/graphql',
      fetchOptions: { cache: 'no-store' }, // SSR: always fresh
    }),
    ssrMode: typeof window === 'undefined',
  });
}

const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      excerpt
      author { name }
      publishedAt
    }
  }
\`;

const GET_FEATURED = gql\`
  query GetFeatured {
    featured {
      id
      title
      image
      description
    }
  }
\`;

// ── Server Component Pattern ────────────────────────────
// In Next.js RSC, you'd await the query directly:
// export default async function PostsPage() {
//   const { data } = await getClient().query({ query: GET_POSTS });
//   return <PostList posts={data.posts} />;
// }

function ServerRenderedPosts({ posts }) {
  return (
    <div>
      <h3>Server-Rendered Posts</h3>
      <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
        Pre-rendered on server — no loading state needed
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {posts.map(post => (
          <article key={post.id} style={{
            padding: 12, border: '1px solid #333', borderRadius: 8,
          }}>
            <h4 style={{ margin: '0 0 4px' }}>{post.title}</h4>
            <p style={{ margin: 0, color: '#aaa', fontSize: 14 }}>{post.excerpt}</p>
            <small style={{ color: '#666' }}>by {post.author.name}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── Client Component Pattern ────────────────────────────
// 'use client' — uses hooks, needs ApolloNextAppProvider
function ClientInteractiveSection() {
  const { data, loading, refetch } = useQuery(GET_FEATURED);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Client-Side Interactive</h3>
        <button onClick={() => refetch()} style={{
          padding: '4px 12px', borderRadius: 6, border: '1px solid #61dafb',
          background: 'transparent', color: '#61dafb', cursor: 'pointer', fontSize: 12,
        }}>
          Refresh
        </button>
      </div>
      {loading && <p>Loading featured...</p>}
      {data?.featured && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {data.featured.map(item => (
            <div key={item.id} style={{
              padding: 16, border: '1px solid #333', borderRadius: 8,
              background: 'rgba(97,218,251,0.05)',
            }}>
              <strong>{item.title}</strong>
              <p style={{ color: '#aaa', fontSize: 13, margin: '4px 0 0' }}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Layout Pattern ──────────────────────────────────────
// In Next.js: layout.tsx wraps children with ApolloWrapper
function App() {
  // Simulated server-rendered data
  const serverPosts = [
    { id: '1', title: 'Apollo + Next.js Guide', excerpt: 'Complete SSR setup...', author: { name: 'Apollo Team' } },
    { id: '2', title: 'Streaming with Suspense', excerpt: 'Progressive rendering...', author: { name: 'React Team' } },
    { id: '3', title: 'Cache Hydration', excerpt: 'Server-to-client data transfer...', author: { name: 'Next.js Team' } },
  ];

  return (
    <div>
      <h2>SSR with Next.js</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>
        Server Components + Client Components + Suspense Streaming
      </p>
      <div style={{
        display: 'inline-block', padding: '4px 12px', borderRadius: 4,
        background: 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 12, marginBottom: 16,
      }}>
        @apollo/experimental-nextjs-app-support
      </div>
      <ServerRenderedPosts posts={serverPosts} />
      <Suspense fallback={<p>Loading interactive section...</p>}>
        <ClientInteractiveSection />
      </Suspense>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("ApolloClient") || code.includes("getClient")) &&
          (code.includes("ssrMode") || code.includes("makeClient") || code.includes("registerApolloClient") || code.includes("Suspense")),
        message: "Apollo SSR with Next.js mastered!",
      }),
    },

    // ── Lesson 23: Offline Support ───────────────────────────────────────
    {
      title: "Apollo 23: Offline Support",
      content: [
        "Apollo can work offline using apollo-cache-persist for cache storage, optimistic mutations for offline writes, and a retry queue for syncing when the connection is restored.",
        "Add persistent cache storage so your app loads instantly from disk. Build an offline mutation queue that replays failed mutations when connectivity returns.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Offline-first strategy",
          body: "An **offline-first** app works without a network connection by:\n\n1. **Persisting the cache** to localStorage or IndexedDB via `apollo3-cache-persist`. On app load, the cache is restored from storage before any network request.\n2. **Optimistic mutations** update the cache immediately when offline. The user sees the change instantly.\n3. **A retry queue** stores failed mutations and replays them when the network is restored.\n4. **Conflict resolution** handles cases where the server state diverged while offline.\n\nThis architecture gives users a seamless experience — the app feels fast and responsive even with poor connectivity.",
          badges: ["Offline", "Cache Persist", "PWA"],
          code: "import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';\n\nconst cache = new InMemoryCache();\n\n// Restore cache from storage before creating the client\nawait persistCache({\n  cache,\n  storage: new LocalStorageWrapper(window.localStorage),\n  maxSize: 1048576, // 1MB\n  debug: true,\n});\n\nconst client = new ApolloClient({\n  link: httpLink,\n  cache, // Pre-populated from localStorage\n});",
        },
        {
          tag: "exercise",
          title: "Add cache persistence",
          body: "Install `apollo3-cache-persist` and call `persistCache({ cache, storage: new LocalStorageWrapper(window.localStorage) })` before creating your Apollo Client. Wrap the client creation in an async function and use a loading state while the cache restores. Verify persistence by fetching data, refreshing the page, and observing that data appears instantly before any network request. Add `maxSize: 1048576` to limit storage to 1MB.",
          badges: ["Practice", "Persistence"],
        },
        {
          tag: "tip",
          title: "Conflict resolution strategies",
          body: "When the user makes changes offline and the server data has also changed, you need a **conflict resolution** strategy:\n\n- **Last write wins**: The most recent mutation overwrites. Simple but can lose data.\n- **Server wins**: Always accept the server's version. Safe but discards offline changes.\n- **Client wins**: Always accept the client's version. Dangerous for shared data.\n- **Merge**: Combine changes field by field. Complex but preserves all data.\n- **User decides**: Show a conflict UI and let the user choose.\n\nFor most apps, **last write wins** with timestamps is sufficient. For collaborative apps, use operational transforms or CRDTs.",
          badges: ["Conflict Resolution", "Strategy"],
          code: "// Detect online/offline status\nfunction useOnlineStatus() {\n  const [isOnline, setIsOnline] = useState(navigator.onLine);\n\n  useEffect(() => {\n    const handleOnline = () => setIsOnline(true);\n    const handleOffline = () => setIsOnline(false);\n\n    window.addEventListener('online', handleOnline);\n    window.addEventListener('offline', handleOffline);\n\n    return () => {\n      window.removeEventListener('online', handleOnline);\n      window.removeEventListener('offline', handleOffline);\n    };\n  }, []);\n\n  return isOnline;\n}",
        },
        {
          tag: "key-point",
          title: "Offline mutation queue",
          body: "When mutations fail due to network errors, store them in a **persistent queue** (IndexedDB or localStorage). Each entry contains the mutation document, variables, and optimistic response. When the app detects connectivity (`navigator.onLine` or a successful health check), replay the queue in order. Use `RetryLink` for automatic retry on network errors, or build a custom queue for more control. Always apply optimistic responses immediately so the UI stays responsive while offline.",
          badges: ["Mutation Queue", "Retry", "Resilience"],
        },
      ],
      codeExamples: [
        {
          code: "await persistCache({\n  cache,\n  storage: new LocalStorageWrapper(window.localStorage),\n});",
          comment: "Persist Apollo cache to localStorage",
        },
        {
          code: "window.addEventListener('online', () => replayMutationQueue());",
          comment: "Replay queued mutations when back online",
        },
      ],
      defaultCode: `import { useState, useEffect, useCallback } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
  gql,
} from '@apollo/client';

// ── Online Status Hook ──────────────────────────────────
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}

// ── Offline Mutation Queue ──────────────────────────────
const QUEUE_KEY = 'apollo_offline_queue';

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function addToQueue(mutation) {
  const queue = getQueue();
  queue.push({ ...mutation, timestamp: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

// ── Queries & Mutations ─────────────────────────────────
const GET_NOTES = gql\`
  query GetNotes {
    notes {
      id
      title
      body
      updatedAt
      synced
    }
  }
\`;

const ADD_NOTE = gql\`
  mutation AddNote($title: String!, $body: String!) {
    addNote(title: $title, body: $body) {
      id
      title
      body
      updatedAt
      synced
    }
  }
\`;

function OfflineNoteApp() {
  const isOnline = useOnlineStatus();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { data } = useQuery(GET_NOTES, { fetchPolicy: 'cache-first' });
  const [addNote] = useMutation(ADD_NOTE);

  const handleAdd = useCallback(() => {
    if (!title.trim()) return;

    const tempId = \`offline-\${Date.now()}\`;
    const variables = { title, body };

    if (isOnline) {
      addNote({
        variables,
        optimisticResponse: {
          addNote: {
            __typename: 'Note',
            id: tempId,
            title,
            body,
            updatedAt: new Date().toISOString(),
            synced: true,
          },
        },
        update(cache, { data: result }) {
          const existing = cache.readQuery({ query: GET_NOTES });
          cache.writeQuery({
            query: GET_NOTES,
            data: { notes: [...(existing?.notes || []), result.addNote] },
          });
        },
      });
    } else {
      // Offline: queue mutation and update cache optimistically
      addToQueue({ type: 'ADD_NOTE', variables });
      const cache = addNote;
      // Manually write to cache for offline display
    }

    setTitle('');
    setBody('');
  }, [title, body, isOnline, addNote]);

  // Sync queue when coming back online
  useEffect(() => {
    if (isOnline) {
      const queue = getQueue();
      if (queue.length > 0) {
        console.log(\`[Offline] Syncing \${queue.length} queued mutations...\`);
        queue.forEach(item => {
          if (item.type === 'ADD_NOTE') {
            addNote({ variables: item.variables });
          }
        });
        clearQueue();
      }
    }
  }, [isOnline, addNote]);

  const queueLength = getQueue().length;

  return (
    <div>
      {/* Online status banner */}
      <div style={{
        padding: '8px 16px', borderRadius: 8, marginBottom: 16,
        background: isOnline ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: \`1px solid \${isOnline ? '#22c55e' : '#ef4444'}\`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
          {isOnline ? 'Online' : 'Offline'} {!isOnline && \`(\${queueLength} pending)\`}
        </span>
        <small style={{ color: '#888' }}>
          {isOnline ? 'Changes sync immediately' : 'Changes queued for sync'}
        </small>
      </div>

      {/* Add note form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Note title..." style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
        />
        <textarea
          value={body} onChange={e => setBody(e.target.value)}
          placeholder="Note body..." rows={3} style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#1a1a2e', color: '#fff', resize: 'vertical' }}
        />
        <button onClick={handleAdd} style={{
          padding: 10, borderRadius: 6, border: 'none',
          background: '#61dafb', color: '#000', cursor: 'pointer', fontWeight: 'bold',
        }}>
          {isOnline ? 'Add Note' : 'Add Note (Offline)'}
        </button>
      </div>

      {/* Notes list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data?.notes?.map(note => (
          <div key={note.id} style={{
            padding: 12, border: '1px solid #333', borderRadius: 8,
            opacity: note.id.startsWith('offline') ? 0.6 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{note.title}</strong>
              <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 4,
                background: note.synced ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)',
                color: note.synced ? '#22c55e' : '#f59e0b',
              }}>
                {note.synced ? 'Synced' : 'Pending'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 14 }}>{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Offline Support</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>Cache persistence + offline queue + sync on reconnect</p>
      <OfflineNoteApp />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("localStorage") || code.includes("persistCache") || code.includes("IndexedDB")) &&
          (code.includes("online") || code.includes("offline") || code.includes("navigator.onLine")),
        message: "Offline support mastered! Your app works without connectivity.",
      }),
    },

    // ── Lesson 24: Real-Time Architecture ────────────────────────────────
    {
      title: "Apollo 24: Real-Time Architecture",
      content: [
        "Real-time data is a spectrum from polling (simplest) to subscriptions (most real-time) to live queries (bleeding edge). The right choice depends on latency requirements, infrastructure, and scale.",
        "Build a complete real-time system that combines polling for dashboard metrics, subscriptions for chat messages, and subscribeToMore for incremental list updates.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The real-time spectrum",
          body: "Real-time data strategies form a spectrum of complexity vs latency:\n\n- **Manual refetch** (`refetch()` on button click) — Zero latency guarantee, zero infrastructure cost. Good for user-triggered refreshes.\n- **Polling** (`pollInterval: 5000`) — Predictable latency (max = poll interval). No infrastructure beyond HTTP. Good for dashboards.\n- **subscribeToMore** — Combines a query (initial load) with a subscription (real-time updates). The subscription appends to the query result. Perfect for feeds.\n- **useSubscription** — Pure push-based data. Requires WebSocket infrastructure. Best for chat, notifications, live cursors.\n- **Live queries** — Server pushes updated query results automatically when underlying data changes. Experimental/emerging pattern.\n\nStart simple (polling), upgrade only when latency requirements demand it.",
          badges: ["Real-time", "Architecture", "Subscriptions"],
          code: "// ── Strategy 1: Polling for dashboard metrics ──────────\nconst { data: metrics } = useQuery(GET_METRICS, {\n  pollInterval: 10000, // refresh every 10s\n});\n\n// ── Strategy 2: subscribeToMore for feeds ──────────────\nconst { data, subscribeToMore } = useQuery(GET_MESSAGES);\n\nuseEffect(() => {\n  return subscribeToMore({\n    document: ON_NEW_MESSAGE,\n    updateQuery: (prev, { subscriptionData }) => ({\n      messages: [...prev.messages, subscriptionData.data.messageAdded],\n    }),\n  });\n}, [subscribeToMore]);\n\n// ── Strategy 3: useSubscription for live events ────────\nconst { data: event } = useSubscription(ON_TYPING, {\n  variables: { channelId },\n});",
        },
        {
          tag: "exercise",
          title: "Combine polling + subscriptions",
          body: "Build a dashboard with three real-time sections:\n1. **Metrics panel** using polling (`pollInterval: 10000`) for server stats.\n2. **Activity feed** using `subscribeToMore` that appends new events to a `GET_ACTIVITY` query result.\n3. **Live presence indicator** using `useSubscription(ON_USER_STATUS)` that shows which users are currently online.\n\nEach section should have a visual indicator showing its real-time strategy (polling interval, subscription status).",
          badges: ["Practice", "Real-time"],
        },
        {
          tag: "tip",
          title: "Scaling WebSockets",
          body: "WebSocket subscriptions don't scale like HTTP:\n\n- Each connection holds a persistent TCP socket on the server.\n- Load balancers need **sticky sessions** or WebSocket-aware routing.\n- With 10K concurrent users, you need 10K open connections.\n\nMitigation strategies:\n- Use **polling** for most data, subscriptions only for truly real-time features.\n- Use **server-sent events** (SSE) instead of WebSockets — they work over HTTP/2 and through proxies.\n- Consider **GraphQL over SSE** with libraries like `graphql-sse`.\n- Use a managed service (Pusher, Ably) for the WebSocket layer and trigger from your GraphQL resolvers.",
          badges: ["Scaling", "WebSocket", "Infrastructure"],
          code: "// GraphQL over Server-Sent Events (SSE)\n// Alternative to WebSockets — works through proxies\nimport { createClient } from 'graphql-sse';\n\nconst sseClient = createClient({\n  url: '/graphql/stream',\n});\n\n// Use with Apollo via a custom link\nconst sseLink = new ApolloLink((operation) => {\n  return new Observable(observer => {\n    const unsubscribe = sseClient.subscribe(\n      { query: print(operation.query), variables: operation.variables },\n      { next: observer.next.bind(observer), complete: observer.complete.bind(observer), error: observer.error.bind(observer) }\n    );\n    return unsubscribe;\n  });\n});",
        },
        {
          tag: "key-point",
          title: "Decision matrix for real-time strategy",
          body: "Use this decision matrix:\n\n| Requirement | Strategy | Example |\n|---|---|---|\n| Data changes every few minutes | **Polling** (30-60s) | Dashboard stats |\n| Data changes every few seconds | **Polling** (3-5s) | Stock prices |\n| User needs instant feedback | **subscribeToMore** | Chat messages |\n| Sub-second latency required | **useSubscription** | Live cursors, typing indicators |\n| Data changes server-side, client needs push | **Live queries** | Collaborative editing |\n\nKey rule: **never use subscriptions when polling is sufficient**. Each subscription is a persistent connection — each poll is a single HTTP request that closes immediately.",
          badges: ["Decision Matrix", "Architecture"],
        },
      ],
      codeExamples: [
        {
          code: "const { data } = useQuery(GET_METRICS, { pollInterval: 10000 });",
          comment: "Simple polling for dashboard metrics",
        },
        {
          code: "subscribeToMore({\n  document: ON_NEW_MESSAGE,\n  updateQuery: (prev, { subscriptionData }) => ({\n    messages: [...prev.messages, subscriptionData.data.messageAdded],\n  }),\n});",
          comment: "Appending subscription data to a query result",
        },
      ],
      defaultCode: `import { useState, useEffect } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';

// ── Queries & Subscriptions ─────────────────────────────
const GET_METRICS = gql\`
  query GetMetrics {
    metrics {
      activeUsers
      requestsPerSecond
      errorRate
      avgResponseTime
    }
  }
\`;

const GET_ACTIVITY = gql\`
  query GetActivity {
    activity {
      id
      type
      message
      timestamp
      user { name avatar }
    }
  }
\`;

const ON_NEW_ACTIVITY = gql\`
  subscription OnNewActivity {
    activityAdded {
      id
      type
      message
      timestamp
      user { name avatar }
    }
  }
\`;

const ON_USER_STATUS = gql\`
  subscription OnUserStatus {
    userStatusChanged {
      id
      name
      status
    }
  }
\`;

// ── Strategy 1: Polling for metrics ─────────────────────
function MetricsPanel() {
  const { data, loading } = useQuery(GET_METRICS, {
    pollInterval: 10000, // Poll every 10 seconds
  });

  const metrics = data?.metrics;

  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Server Metrics</h3>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(97,218,251,0.2)', color: '#61dafb' }}>
          POLLING: 10s
        </span>
      </div>
      {loading && !metrics ? (
        <p>Loading metrics...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: 0, color: '#22c55e' }}>{metrics?.activeUsers || 0}</p>
            <small style={{ color: '#888' }}>Active Users</small>
          </div>
          <div style={{ padding: 12, background: 'rgba(97,218,251,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: 0, color: '#61dafb' }}>{metrics?.requestsPerSecond || 0}</p>
            <small style={{ color: '#888' }}>Req/s</small>
          </div>
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: 0, color: '#ef4444' }}>{metrics?.errorRate || 0}%</p>
            <small style={{ color: '#888' }}>Error Rate</small>
          </div>
          <div style={{ padding: 12, background: 'rgba(167,139,250,0.1)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: 0, color: '#a78bfa' }}>{metrics?.avgResponseTime || 0}ms</p>
            <small style={{ color: '#888' }}>Avg Response</small>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Strategy 2: subscribeToMore for activity feed ───────
function ActivityFeed() {
  const { data, subscribeToMore } = useQuery(GET_ACTIVITY);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: ON_NEW_ACTIVITY,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          activity: [subscriptionData.data.activityAdded, ...prev.activity],
        };
      },
    });
    return () => unsubscribe?.();
  }, [subscribeToMore]);

  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Activity Feed</h3>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
          SUBSCRIPTION
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflow: 'auto' }}>
        {data?.activity?.map(event => (
          <div key={event.id} style={{
            display: 'flex', gap: 8, padding: 8, borderRadius: 6,
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, background: event.type === 'error' ? '#ef4444' : '#22c55e' }} />
            <div>
              <p style={{ margin: 0, fontSize: 14 }}>{event.message}</p>
              <small style={{ color: '#666' }}>{event.user?.name} - {event.timestamp}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Strategy 3: useSubscription for live presence ───────
function PresenceIndicator() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice', status: 'online' },
    { id: '2', name: 'Bob', status: 'away' },
    { id: '3', name: 'Charlie', status: 'offline' },
  ]);

  useSubscription(ON_USER_STATUS, {
    onData: ({ data: subData }) => {
      if (subData?.data?.userStatusChanged) {
        const updated = subData.data.userStatusChanged;
        setUsers(prev =>
          prev.map(u => (u.id === updated.id ? { ...u, status: updated.status } : u))
        );
      }
    },
  });

  const statusColor = { online: '#22c55e', away: '#f59e0b', offline: '#666' };

  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Live Presence</h3>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
          LIVE SUBSCRIPTION
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {users.map(user => (
          <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: statusColor[user.status] || '#666',
            }} />
            <span style={{ fontSize: 14 }}>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Real-Time Architecture</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>
        Polling + subscribeToMore + useSubscription — choosing the right strategy
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MetricsPanel />
        <ActivityFeed />
        <PresenceIndicator />
      </div>
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("pollInterval") || code.includes("useSubscription") || code.includes("subscribeToMore")) &&
          code.includes("useQuery"),
        message: "Real-time architecture mastered! You can choose the right strategy for any use case.",
      }),
    },

    // ── Lesson 25: Production Checklist ──────────────────────────────────
    {
      title: "Apollo 25: Production Checklist",
      content: [
        "Going to production with Apollo requires APQ for bandwidth, CDN caching for performance, error monitoring for reliability, performance budgets for speed, and schema governance for team coordination.",
        "Configure a production-ready Apollo Client with APQ, error monitoring, and performance tracking. Build a health dashboard that monitors your GraphQL layer.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Production hardening",
          body: "A production Apollo setup needs five pillars:\n\n1. **Automatic Persisted Queries (APQ)**: Instead of sending full query strings (often 5-20KB), send a SHA-256 hash. The server looks up the query by hash. First request sends both hash + query; subsequent requests send only the hash. Saves bandwidth and adds security.\n2. **CDN caching**: For public queries (no auth), add `Cache-Control` headers. CDNs can cache GraphQL responses at the edge.\n3. **Error monitoring**: Use `onError` link to send errors to Sentry/DataDog. Track GraphQL errors separately from network errors.\n4. **Performance budgets**: Set limits on query complexity, depth, and response size. Use Apollo Studio for query-level performance tracking.\n5. **Schema governance**: Use Apollo Schema Registry to track schema changes, run CI checks for breaking changes, and maintain a schema changelog.",
          badges: ["Production", "APQ", "Monitoring"],
          code: "// Production-ready client configuration\nimport { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';\nimport { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';\nimport { onError } from '@apollo/client/link/error';\nimport { RetryLink } from '@apollo/client/link/retry';\nimport { sha256 } from 'crypto-hash';\n\nconst persistedLink = createPersistedQueryLink({ sha256 });\n\nconst errorLink = onError(({ graphQLErrors, networkError, operation }) => {\n  // Send to monitoring service\n  if (graphQLErrors) {\n    Sentry.captureException(new Error(`GraphQL: ${operation.operationName}`), {\n      extra: { errors: graphQLErrors },\n    });\n  }\n});\n\nconst retryLink = new RetryLink({ attempts: { max: 3 } });\nconst httpLink = new HttpLink({ uri: '/graphql' });",
        },
        {
          tag: "exercise",
          title: "Configure APQ + monitoring",
          body: "Create a production Apollo Client with:\n1. `createPersistedQueryLink` with `sha256` for APQ.\n2. An `onError` link that reports errors to a monitoring object (simulated Sentry).\n3. A `RetryLink` with `{ attempts: { max: 3 }, delay: { initial: 300 } }`.\n4. A custom metrics link that tracks operation count, error count, and average duration.\n5. A dashboard component that displays these metrics in real-time.",
          badges: ["Practice", "Production"],
        },
        {
          tag: "tip",
          title: "Apollo Studio integration",
          body: "**Apollo Studio** (formerly Apollo Graph Manager) provides production-grade observability:\n\n- **Operation tracing**: See p50/p95/p99 latency for every operation.\n- **Field usage**: Know which fields are actually queried — safely deprecate unused fields.\n- **Schema checks**: CI integration that blocks PRs with breaking schema changes.\n- **Alerts**: Get notified when error rates spike or latency exceeds thresholds.\n\nEnable it by setting the `APOLLO_KEY` environment variable and using `@apollo/server`'s built-in usage reporting. The client-side equivalent is Apollo Client DevTools in development.",
          badges: ["Apollo Studio", "Observability"],
          code: "// Apollo Studio usage reporting (server-side)\nimport { ApolloServer } from '@apollo/server';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  plugins: [\n    ApolloServerPluginUsageReporting({\n      sendVariableValues: { all: true },\n      sendHeaders: { all: true },\n    }),\n  ],\n});",
        },
        {
          tag: "key-point",
          title: "The production readiness checklist",
          body: "Before shipping Apollo to production, verify:\n\n- [ ] **APQ enabled** — reduces payload size by 90%+\n- [ ] **Error link** sends to Sentry/DataDog with operation context\n- [ ] **Retry link** handles transient network failures (3 attempts, exponential backoff)\n- [ ] **Cache policies** configured for all types (`keyFields`, `merge` for pagination)\n- [ ] **Fetch policies** chosen per query (not all `network-only`)\n- [ ] **Bundle size** checked — tree-shake unused Apollo modules\n- [ ] **SSR hydration** tested if using Next.js/Remix\n- [ ] **Auth flow** handles token refresh without user-visible errors\n- [ ] **No sensitive data** logged or cached (PII in cache can leak)\n- [ ] **Schema governance** — breaking changes caught in CI",
          badges: ["Checklist", "Production", "DevOps"],
        },
        {
          tag: "tip",
          title: "Bundle size optimization",
          body: "Apollo Client's full bundle is ~35KB gzipped. Optimize by:\n\n- Import from specific paths: `import { useQuery } from '@apollo/client'` tree-shakes correctly in modern bundlers.\n- Don't import `@apollo/client/core` in React apps — use `@apollo/client` which includes React bindings.\n- If you only need queries (no mutations, no subscriptions), consider lighter alternatives like `graphql-request` for simple cases.\n- Use `@apollo/client/link/batch-http` only if you actually batch — each link adds to bundle size.\n- Run `npx source-map-explorer` to verify Apollo's contribution to your bundle.",
          badges: ["Bundle Size", "Performance"],
        },
      ],
      codeExamples: [
        {
          code: "const link = from([\n  persistedQueryLink,\n  errorLink,\n  retryLink,\n  httpLink,\n]);",
          comment: "Production link chain order",
        },
        {
          code: "Sentry.captureException(new Error(`GraphQL: ${operationName}`));",
          comment: "Error reporting to monitoring service",
        },
      ],
      defaultCode: `import { useState, useEffect, useRef } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  useQuery,
  gql,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { sha256 } from 'crypto-hash';

// ── Production Metrics Collector ────────────────────────
const prodMetrics = {
  operations: 0,
  errors: 0,
  totalDuration: 0,
  operationLog: [],
  errorLog: [],
};

// ── APQ Link: persisted queries for bandwidth ───────────
const persistedLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

// ── Error Link: report to monitoring ────────────────────
const errorMonitorLink = onError(({ graphQLErrors, networkError, operation }) => {
  prodMetrics.errors++;
  const entry = {
    operation: operation.operationName,
    timestamp: new Date().toISOString(),
  };

  if (graphQLErrors) {
    entry.graphQLErrors = graphQLErrors.map(e => e.message);
    // In production: Sentry.captureException(...)
    console.error('[Monitor] GraphQL errors:', entry);
  }

  if (networkError) {
    entry.networkError = networkError.message;
    console.error('[Monitor] Network error:', entry);
  }

  prodMetrics.errorLog.push(entry);
});

// ── Retry Link: handle transient failures ───────────────
const retryLink = new RetryLink({
  delay: { initial: 300, max: 3000, jitter: true },
  attempts: { max: 3, retryIf: (error) => !!error },
});

// ── Metrics Link: track performance ─────────────────────
const metricsLink = new ApolloLink((operation, forward) => {
  const start = performance.now();
  prodMetrics.operations++;

  return forward(operation).map(response => {
    const duration = Math.round(performance.now() - start);
    prodMetrics.totalDuration += duration;
    prodMetrics.operationLog.push({
      name: operation.operationName || 'anonymous',
      duration,
      timestamp: new Date().toISOString(),
      hasErrors: !!response.errors,
    });
    return response;
  });
});

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
});

// ── Production Client ───────────────────────────────────
const client = new ApolloClient({
  link: from([metricsLink, persistedLink, errorMonitorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
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
  }),
  connectToDevTools: false, // Disabled in production
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  },
});

// ── Health Dashboard ────────────────────────────────────
function HealthDashboard() {
  const [metrics, setMetrics] = useState(prodMetrics);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMetrics({ ...prodMetrics });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const avgDuration = metrics.operations > 0
    ? Math.round(metrics.totalDuration / metrics.operations)
    : 0;

  const errorRate = metrics.operations > 0
    ? ((metrics.errors / metrics.operations) * 100).toFixed(1)
    : '0.0';

  return (
    <div>
      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 16, background: 'rgba(97,218,251,0.1)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 28, margin: 0, color: '#61dafb' }}>{metrics.operations}</p>
          <small style={{ color: '#888' }}>Operations</small>
        </div>
        <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 28, margin: 0, color: '#ef4444' }}>{metrics.errors}</p>
          <small style={{ color: '#888' }}>Errors</small>
        </div>
        <div style={{ padding: 16, background: 'rgba(167,139,250,0.1)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 28, margin: 0, color: '#a78bfa' }}>{avgDuration}ms</p>
          <small style={{ color: '#888' }}>Avg Duration</small>
        </div>
        <div style={{ padding: 16, background: 'rgba(245,158,11,0.1)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 28, margin: 0, color: errorRate > 5 ? '#ef4444' : '#22c55e' }}>{errorRate}%</p>
          <small style={{ color: '#888' }}>Error Rate</small>
        </div>
      </div>

      {/* Production Checklist */}
      <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 12px' }}>Production Checklist</h3>
        {[
          { label: 'APQ Enabled', done: true, detail: 'createPersistedQueryLink + sha256' },
          { label: 'Error Monitoring', done: true, detail: 'onError link → Sentry/DataDog' },
          { label: 'Retry Link', done: true, detail: '3 attempts, exponential backoff' },
          { label: 'Cache Policies', done: true, detail: 'keyArgs + merge for pagination' },
          { label: 'Fetch Policies', done: true, detail: 'cache-and-network default' },
          { label: 'DevTools Disabled', done: true, detail: 'connectToDevTools: false' },
          { label: 'Error Policy', done: true, detail: 'errorPolicy: all for partial data' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <span style={{ color: item.done ? '#22c55e' : '#ef4444' }}>
              {item.done ? '[x]' : '[ ]'}
            </span>
            <span>{item.label}</span>
            <span style={{ color: '#666', fontSize: 12, marginLeft: 'auto' }}>{item.detail}</span>
          </div>
        ))}
      </div>

      {/* Recent Operations */}
      {metrics.operationLog.length > 0 && (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <h4 style={{ margin: '0 0 8px' }}>Recent Operations</h4>
          <div style={{ maxHeight: 150, overflow: 'auto' }}>
            {metrics.operationLog.slice(-10).reverse().map((op, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: op.hasErrors ? '#ef4444' : '#ccc' }}>{op.name}</span>
                <span style={{ color: op.duration > 1000 ? '#f59e0b' : '#888' }}>{op.duration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h2>Production Checklist</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>
        APQ + Error Monitoring + Retry + Performance Tracking
      </p>
      <HealthDashboard />
    </div>
  );
}

export default App;`,
      validationLogic: (code) => ({
        success:
          (code.includes("PersistedQuery") || code.includes("persisted") || code.includes("sha256")) &&
          (code.includes("onError") || code.includes("errorLink") || code.includes("Monitor")),
        message: "Production checklist complete! You've mastered Apollo Client from foundations to production.",
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
      titleEs: APOLLO_TITLES_ES[id],
    };
  });
}

export const APOLLO_COURSE_LESSONS = buildApolloLessons();

export function getApolloLessonById(slug: string): WebCourseLesson | undefined {
  return APOLLO_COURSE_LESSONS.find((l) => l.id === slug);
}
