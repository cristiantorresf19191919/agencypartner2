/**
 * Apollo GraphQL challenges for the Developer Section.
 * These test deep knowledge of Apollo Client hooks, caching, mutations, and advanced patterns.
 * After 10 failed attempts, the solution is automatically revealed.
 */

export interface ApolloChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  problemCode: string;
  explanation: string;
  solution: string;
  hints: string[];
  testCases: {
    description: string;
    validate: (code: string) => boolean;
  }[];
}

export const APOLLO_CHALLENGES: ApolloChallenge[] = [
  // ─────────────────────────────────────────────────────────
  // 1. Write Your First Query (Easy)
  // ─────────────────────────────────────────────────────────
  {
    id: "write-your-first-query",
    title: "Write Your First Query",
    difficulty: "Easy",
    description: `The component below is supposed to fetch a list of books from a GraphQL API and display them. However, the developer hardcoded the data instead of using Apollo Client's useQuery hook.\n\nYour task:\n1. Import useQuery and gql from @apollo/client.\n2. Define a GET_BOOKS query using a gql tagged template.\n3. Replace the hardcoded data with the result of useQuery.\n4. Handle loading, error, and data states properly.\n\nThe GraphQL schema exposes:\n  query { books { id title author } }`,
    problemCode: `import React from 'react';

// TODO: import useQuery and gql from @apollo/client

const BookList = () => {
  // Bug: hardcoded data instead of fetching from GraphQL
  const books = [
    { id: '1', title: 'Hardcoded Book', author: 'Nobody' },
  ];

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;`,
    explanation: `Apollo Client's useQuery hook is the primary way to fetch data from a GraphQL endpoint in React. It returns an object with loading, error, and data properties that let you handle every state of the request lifecycle. The gql tagged template literal parses the query string into a document AST that Apollo can process. By replacing the hardcoded array with useQuery, the component becomes dynamic and reactive to server data.`,
    solution: `import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql\`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
\`;

const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {data.books.map((book: { id: string; title: string; author: string }) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;`,
    hints: [
      "You need to import two things from @apollo/client to make this work.",
      "useQuery returns an object with three key properties: loading, error, and data.",
      "Define your query with gql`query GetBooks { books { id title author } }` and pass it to useQuery.",
    ],
    testCases: [
      {
        description: "Imports useQuery from @apollo/client",
        validate: (code: string) => /useQuery/.test(code) && /@apollo\/client/.test(code),
      },
      {
        description: "Defines a GraphQL query using gql",
        validate: (code: string) => /gql\s*`/.test(code) && /books/.test(code),
      },
      {
        description: "Handles the loading state",
        validate: (code: string) => /loading/.test(code) && /if\s*\(\s*loading\s*\)/.test(code),
      },
      {
        description: "Handles the error state",
        validate: (code: string) => /error/.test(code) && /error\.message/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. Dynamic Variables (Easy)
  // ─────────────────────────────────────────────────────────
  {
    id: "dynamic-variables",
    title: "Dynamic Variables",
    difficulty: "Easy",
    description: `The search component below is supposed to let users type a search term and fetch matching users from the API. However, the query always fetches the same results regardless of what the user types.\n\nYour task:\n1. Add a search input controlled by useState.\n2. Pass the search term as a variable to the useQuery hook.\n3. Make sure the query re-executes when the user changes the input.\n\nThe GraphQL schema exposes:\n  query SearchUsers($term: String!) { searchUsers(term: $term) { id name email } }`,
    problemCode: `import React from 'react';
import { useQuery, gql } from '@apollo/client';

const SEARCH_USERS = gql\`
  query SearchUsers {
    searchUsers {
      id
      name
      email
    }
  }
\`;

const UserSearch = () => {
  // Bug: no state for search term, no variables passed to query
  const { loading, error, data } = useQuery(SEARCH_USERS);

  return (
    <div>
      <h1>User Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        onChange={() => {
          // Bug: does nothing with the input value
        }}
      />
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.searchUsers.map((user: { id: string; name: string; email: string }) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;`,
    explanation: `Apollo Client's useQuery hook accepts a second argument — an options object that can include variables. When the variables change, Apollo automatically re-executes the query and updates the component. By connecting a useState hook to the input field and passing its value as a variable, the query becomes reactive to user input. The query definition must also declare the variable with $term: String! and pass it to the field argument.`,
    solution: `import React, { useState } from 'react';
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

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data } = useQuery(SEARCH_USERS, {
    variables: { term: searchTerm },
  });

  return (
    <div>
      <h1>User Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.searchUsers.map((user: { id: string; name: string; email: string }) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;`,
    hints: [
      "The useQuery hook accepts an options object as its second argument.",
      "You need a controlled input — use useState to track the search term.",
      "Pass { variables: { term: searchTerm } } as the second argument to useQuery, and update the gql query to accept $term: String!.",
    ],
    testCases: [
      {
        description: "Uses useState for the search input",
        validate: (code: string) => /useState/.test(code) && /searchTerm|search|term/i.test(code),
      },
      {
        description: "Passes variables to useQuery",
        validate: (code: string) => /useQuery\s*\(\s*\w+\s*,\s*\{[\s\S]*variables\s*:/.test(code),
      },
      {
        description: "Query accepts a $term variable",
        validate: (code: string) => /\$term\s*:\s*String/.test(code),
      },
      {
        description: "Input onChange updates the state",
        validate: (code: string) => /onChange[\s\S]*set[A-Z]\w*\(/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. Fragment Composition (Easy)
  // ─────────────────────────────────────────────────────────
  {
    id: "fragment-composition",
    title: "Fragment Composition",
    difficulty: "Easy",
    description: `The component below has two separate queries that fetch user data. Both queries select the exact same set of fields on the User type, leading to duplicated field selections.\n\nYour task:\n1. Extract the common User fields into a GraphQL fragment.\n2. Use the fragment spread syntax (...FragmentName) in both queries.\n3. Keep the queries working exactly as before, but DRY.\n\nDuplicated fields: id, name, email, avatar, role`,
    problemCode: `import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Bug: duplicated field selections in both queries
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

const GET_USER_BY_ID = gql\`
  query GetUserById($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      avatar
      role
    }
  }
\`;

const UserProfile = ({ userId }: { userId?: string }) => {
  const currentUserResult = useQuery(GET_CURRENT_USER);
  const specificUserResult = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    skip: !userId,
  });

  const user = userId ? specificUserResult.data?.user : currentUserResult.data?.currentUser;

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <span>{user.role}</span>
    </div>
  );
};

export default UserProfile;`,
    explanation: `GraphQL fragments let you define a reusable set of fields on a specific type. By extracting the common fields (id, name, email, avatar, role) into a fragment on the User type, you eliminate duplication and make maintenance easier. If you ever need to add or remove a field, you change it in one place. The fragment is included in queries using the spread syntax ...FragmentName, and the fragment definition must be interpolated into each query's gql template.`,
    solution: `import React from 'react';
import { useQuery, gql } from '@apollo/client';

const USER_FIELDS = gql\`
  fragment UserFields on User {
    id
    name
    email
    avatar
    role
  }
\`;

const GET_CURRENT_USER = gql\`
  query GetCurrentUser {
    currentUser {
      ...UserFields
    }
  }
  \${USER_FIELDS}
\`;

const GET_USER_BY_ID = gql\`
  query GetUserById($userId: ID!) {
    user(id: $userId) {
      ...UserFields
    }
  }
  \${USER_FIELDS}
\`;

const UserProfile = ({ userId }: { userId?: string }) => {
  const currentUserResult = useQuery(GET_CURRENT_USER);
  const specificUserResult = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    skip: !userId,
  });

  const user = userId ? specificUserResult.data?.user : currentUserResult.data?.currentUser;

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <span>{user.role}</span>
    </div>
  );
};

export default UserProfile;`,
    hints: [
      "GraphQL has a feature that lets you define a reusable set of fields for a specific type.",
      "Define a fragment with: fragment FragmentName on TypeName { field1 field2 ... }",
      "Use ...UserFields inside each query and interpolate the fragment constant with ${USER_FIELDS} at the end of the gql template.",
    ],
    testCases: [
      {
        description: "Defines a GraphQL fragment",
        validate: (code: string) => /fragment\s+\w+\s+on\s+User/.test(code),
      },
      {
        description: "Uses fragment spread syntax in queries",
        validate: (code: string) => /\.\.\.\w+Fields/.test(code),
      },
      {
        description: "Interpolates fragment into gql templates",
        validate: (code: string) => /\$\{.*FIELDS.*\}/.test(code) || /\$\{.*Fields.*\}/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. Optimistic Mutation (Medium)
  // ─────────────────────────────────────────────────────────
  {
    id: "optimistic-mutation",
    title: "Optimistic Mutation",
    difficulty: "Medium",
    description: `The todo app below lets users add new tasks. The mutation works correctly, but after clicking "Add", there is a noticeable delay before the new item appears in the list — the UI waits for the server round-trip.\n\nYour task:\n1. Add an optimisticResponse to the useMutation call so the UI updates instantly.\n2. Include the correct __typename fields in the optimistic response.\n3. Implement an update callback to write the new todo into the cache.\n\nThe mutation returns: { addTodo { id text completed __typename } }`,
    problemCode: `import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
\`;

const ADD_TODO = gql\`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
\`;

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const { data, loading } = useQuery(GET_TODOS);

  // Bug: no optimistic response — UI feels slow
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    addTodo({ variables: { text: newTodo } });
    setNewTodo('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {data?.todos.map((todo: { id: string; text: string; completed: boolean }) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,
    explanation: `Optimistic UI is a pattern where you immediately update the cache with the expected server response before the mutation completes. Apollo Client supports this via the optimisticResponse option on mutations. The update callback gives you direct access to the cache so you can write the new item into the existing query result. The __typename field is required for Apollo's normalized cache to correctly identify and store the object. This removes the refetchQueries call and replaces it with a much faster, local cache update.`,
    solution: `import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TODOS = gql\`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
\`;

const ADD_TODO = gql\`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
\`;

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const { data, loading } = useQuery(GET_TODOS);

  const [addTodo] = useMutation(ADD_TODO, {
    optimisticResponse: {
      addTodo: {
        id: 'temp-id-' + Date.now(),
        text: newTodo,
        completed: false,
        __typename: 'Todo',
      },
    },
    update(cache, { data: mutationData }) {
      const existing = cache.readQuery<{ todos: any[] }>({ query: GET_TODOS });
      if (existing && mutationData) {
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            todos: [...existing.todos, mutationData.addTodo],
          },
        });
      }
    },
  });

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    addTodo({ variables: { text: newTodo } });
    setNewTodo('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {data?.todos.map((todo: { id: string; text: string; completed: boolean }) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,
    hints: [
      "Apollo mutations accept an optimisticResponse option that immediately updates the cache.",
      "The optimistic response must match the shape of the mutation result and include __typename.",
      "Use the update callback with cache.readQuery and cache.writeQuery to add the new todo to the existing list.",
    ],
    testCases: [
      {
        description: "Includes an optimisticResponse",
        validate: (code: string) => /optimisticResponse/.test(code),
      },
      {
        description: "Has __typename in the optimistic response",
        validate: (code: string) => /__typename/.test(code),
      },
      {
        description: "Uses an update callback to modify the cache",
        validate: (code: string) => /update\s*\(\s*cache/.test(code) || /update\s*:\s*\(\s*cache/.test(code),
      },
      {
        description: "Writes to the cache with writeQuery",
        validate: (code: string) => /cache\.writeQuery/.test(code) && /cache\.readQuery/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. Cache Surgery (Medium)
  // ─────────────────────────────────────────────────────────
  {
    id: "cache-surgery",
    title: "Cache Surgery",
    difficulty: "Medium",
    description: `The contact manager below lets users delete contacts. The mutation fires successfully and the server removes the contact, but the deleted item still appears in the list until the page is refreshed.\n\nYour task:\n1. After the delete mutation succeeds, remove the deleted contact from the Apollo cache.\n2. Use cache.evict to remove the item by its cache ID, or use cache.modify on the ROOT_QUERY.\n3. Call cache.gc() to garbage-collect any orphaned references.\n\nThe mutation returns: { deleteContact { id } }`,
    problemCode: `import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_CONTACTS = gql\`
  query GetContacts {
    contacts {
      id
      name
      phone
      email
    }
  }
\`;

const DELETE_CONTACT = gql\`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
    }
  }
\`;

const ContactList = () => {
  const { data, loading } = useQuery(GET_CONTACTS);

  // Bug: no cache update after deletion — stale data persists
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const handleDelete = (id: string) => {
    deleteContact({ variables: { id } });
  };

  if (loading) return <p>Loading contacts...</p>;

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {data?.contacts.map((contact: { id: string; name: string; phone: string; email: string }) => (
          <li key={contact.id}>
            <span>{contact.name} — {contact.phone}</span>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;`,
    explanation: `When you delete an item via a mutation, Apollo's normalized cache still holds the object and any query result lists that reference it. The cache does not automatically remove items from lists when the underlying object is deleted. You need to manually evict the deleted object using cache.evict({ id: cache.identify(deletedObject) }) or use cache.modify on the parent query to filter it out. After evicting, cache.gc() cleans up any dangling references to the evicted object from other parts of the cache.`,
    solution: `import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_CONTACTS = gql\`
  query GetContacts {
    contacts {
      id
      name
      phone
      email
    }
  }
\`;

const DELETE_CONTACT = gql\`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
    }
  }
\`;

const ContactList = () => {
  const { data, loading } = useQuery(GET_CONTACTS);

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    update(cache, { data: mutationData }) {
      if (mutationData?.deleteContact) {
        const deletedId = mutationData.deleteContact.id;
        cache.evict({ id: cache.identify({ __typename: 'Contact', id: deletedId }) });
        cache.gc();
      }
    },
  });

  const handleDelete = (id: string) => {
    deleteContact({ variables: { id } });
  };

  if (loading) return <p>Loading contacts...</p>;

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {data?.contacts.map((contact: { id: string; name: string; phone: string; email: string }) => (
          <li key={contact.id}>
            <span>{contact.name} — {contact.phone}</span>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;`,
    hints: [
      "After a mutation, Apollo does not automatically remove deleted items from cached query lists.",
      "cache.evict removes an object from the cache by its normalized ID, and cache.gc cleans up dangling references.",
      "Use the update callback on useMutation: update(cache, { data }) { cache.evict({ id: cache.identify(...) }); cache.gc(); }",
    ],
    testCases: [
      {
        description: "Uses cache.evict or cache.modify to remove the item",
        validate: (code: string) => /cache\.evict/.test(code) || /cache\.modify/.test(code),
      },
      {
        description: "Calls cache.gc() to garbage-collect",
        validate: (code: string) => /cache\.gc\s*\(\s*\)/.test(code),
      },
      {
        description: "Has an update callback on the mutation",
        validate: (code: string) => /update\s*\(\s*cache/.test(code) || /update\s*:\s*\(\s*cache/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. Reactive Local State (Medium)
  // ─────────────────────────────────────────────────────────
  {
    id: "reactive-local-state",
    title: "Reactive Local State",
    difficulty: "Medium",
    description: `The bookstore app below lets users favorite books. Currently, favorites are stored in component-level useState, so they are lost whenever the user navigates away and comes back.\n\nYour task:\n1. Replace useState with a reactive variable (makeVar) that persists across component mounts.\n2. Use useReactiveVar to read the reactive variable in the component.\n3. Add the @client directive to a local-only GraphQL field (optional bonus) or simply use the reactive variable directly.\n\nThe favorites should persist as long as the Apollo Client instance is alive (no page reload needed).`,
    problemCode: `import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql\`
  query GetBooks {
    books {
      id
      title
      author
      coverUrl
    }
  }
\`;

const BookStore = () => {
  // Bug: favorites lost on navigation/re-mount
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data, loading } = useQuery(GET_BOOKS);

  const toggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      <h1>Bookstore</h1>
      <div>
        {data?.books.map((book: { id: string; title: string; author: string; coverUrl: string }) => (
          <div key={book.id}>
            <img src={book.coverUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button onClick={() => toggleFavorite(book.id)}>
              {favorites.includes(book.id) ? '★ Unfavorite' : '☆ Favorite'}
            </button>
          </div>
        ))}
      </div>
      <h2>Favorites ({favorites.length})</h2>
    </div>
  );
};

export default BookStore;`,
    explanation: `Apollo Client reactive variables (makeVar) are a way to store local state outside of React's component tree. Unlike useState, a reactive variable persists across component mounts and unmounts because it lives at the module level. useReactiveVar subscribes a component to changes in the variable and triggers re-renders when the value changes. This is ideal for client-only state like UI preferences, filters, or selections that should survive navigation. You can optionally use the @client directive in queries to read reactive variables through the cache, but using useReactiveVar directly is simpler for most cases.`,
    solution: `import React from 'react';
import { useQuery, gql, makeVar, useReactiveVar } from '@apollo/client';

// Reactive variable — persists across mounts
const favoritesVar = makeVar<string[]>([]);

const GET_BOOKS = gql\`
  query GetBooks {
    books {
      id
      title
      author
      coverUrl
    }
  }
\`;

const BookStore = () => {
  const favorites = useReactiveVar(favoritesVar);
  const { data, loading } = useQuery(GET_BOOKS);

  const toggleFavorite = (bookId: string) => {
    const current = favoritesVar();
    if (current.includes(bookId)) {
      favoritesVar(current.filter((id) => id !== bookId));
    } else {
      favoritesVar([...current, bookId]);
    }
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      <h1>Bookstore</h1>
      <div>
        {data?.books.map((book: { id: string; title: string; author: string; coverUrl: string }) => (
          <div key={book.id}>
            <img src={book.coverUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button onClick={() => toggleFavorite(book.id)}>
              {favorites.includes(book.id) ? '★ Unfavorite' : '☆ Favorite'}
            </button>
          </div>
        ))}
      </div>
      <h2>Favorites ({favorites.length})</h2>
    </div>
  );
};

export default BookStore;`,
    hints: [
      "Apollo Client has a local state primitive that lives outside of React's component tree.",
      "makeVar creates a reactive variable, and useReactiveVar subscribes a component to its changes.",
      "Define const favoritesVar = makeVar<string[]>([]) at the module level, then use useReactiveVar(favoritesVar) in your component instead of useState.",
    ],
    testCases: [
      {
        description: "Uses makeVar to create a reactive variable",
        validate: (code: string) => /makeVar/.test(code),
      },
      {
        description: "Uses useReactiveVar to subscribe to changes",
        validate: (code: string) => /useReactiveVar/.test(code),
      },
      {
        description: "Reactive variable is defined at module level (outside component)",
        validate: (code: string) => {
          const makeVarIndex = code.indexOf("makeVar");
          const componentIndex = code.indexOf("const BookStore") !== -1
            ? code.indexOf("const BookStore")
            : code.indexOf("function BookStore");
          return makeVarIndex !== -1 && componentIndex !== -1 && makeVarIndex < componentIndex;
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 7. Pagination Merge (Medium)
  // ─────────────────────────────────────────────────────────
  {
    id: "pagination-merge",
    title: "Pagination Merge",
    difficulty: "Medium",
    description: `The social feed below implements infinite scroll pagination using fetchMore. When the user clicks "Load More", the query runs with a new offset, but the existing posts disappear and only the new batch is shown.\n\nYour task:\n1. Configure a type policy with a merge function for the "posts" field so Apollo merges old and new results.\n2. Keep the fetchMore call and update the offset variable.\n3. Provide keyArgs so Apollo knows how to cache different filter combinations.\n\nThe query signature:\n  query GetPosts($offset: Int!, $limit: Int!) { posts(offset: $offset, limit: $limit) { id content author createdAt } }`,
    problemCode: `import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql\`
  query GetPosts($offset: Int!, $limit: Int!) {
    posts(offset: $offset, limit: $limit) {
      id
      content
      author
      createdAt
    }
  }
\`;

const LIMIT = 10;

const SocialFeed = () => {
  const [offset, setOffset] = useState(0);

  // Bug: fetchMore replaces results instead of appending
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: LIMIT },
  });

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchMore({
      variables: { offset: nextOffset, limit: LIMIT },
    });
  };

  if (loading && !data) return <p>Loading feed...</p>;

  return (
    <div>
      <h1>Social Feed</h1>
      <ul>
        {data?.posts.map((post: { id: string; content: string; author: string; createdAt: string }) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <small>{post.author} — {post.createdAt}</small>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
};

// Bug: no cache configuration — needs InMemoryCache with typePolicies
// const client = new ApolloClient({
//   uri: '/graphql',
//   cache: new InMemoryCache(),
// });

export default SocialFeed;`,
    explanation: `By default, Apollo Client's InMemoryCache replaces query results when the same field is fetched with different arguments. For offset-based pagination, you need to tell the cache how to merge the old and new pages together. This is done through typePolicies on the InMemoryCache. The merge function for the "posts" field concatenates existing and incoming arrays. keyArgs tells Apollo which arguments (if any) should create separate cache entries — for pagination, you typically set keyArgs to false or an empty array so all pages are stored under the same cache key and merged together.`,
    solution: `import React, { useState } from 'react';
import { useQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

const GET_POSTS = gql\`
  query GetPosts($offset: Int!, $limit: Int!) {
    posts(offset: $offset, limit: $limit) {
      id
      content
      author
      createdAt
    }
  }
\`;

const LIMIT = 10;

const SocialFeed = () => {
  const [offset, setOffset] = useState(0);

  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: LIMIT },
  });

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchMore({
      variables: { offset: nextOffset, limit: LIMIT },
    });
  };

  if (loading && !data) return <p>Loading feed...</p>;

  return (
    <div>
      <h1>Social Feed</h1>
      <ul>
        {data?.posts.map((post: { id: string; content: string; author: string; createdAt: string }) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <small>{post.author} — {post.createdAt}</small>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
};

// Cache configuration with merge function for pagination
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: false,
          merge(existing = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

export default SocialFeed;`,
    hints: [
      "Apollo's InMemoryCache needs to know how to combine paginated results.",
      "typePolicies on InMemoryCache let you define a merge function for specific fields.",
      "Set keyArgs: false for the posts field and define merge(existing = [], incoming) { return [...existing, ...incoming]; } in the type policy.",
    ],
    testCases: [
      {
        description: "Defines typePolicies with a merge function",
        validate: (code: string) => /typePolicies/.test(code) && /merge/.test(code),
      },
      {
        description: "Merge function concatenates existing and incoming",
        validate: (code: string) => /\.\.\.\s*existing/.test(code) && /\.\.\.\s*incoming/.test(code),
      },
      {
        description: "Uses keyArgs configuration",
        validate: (code: string) => /keyArgs/.test(code),
      },
      {
        description: "Uses fetchMore for loading more data",
        validate: (code: string) => /fetchMore/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. Error Boundary Chain (Hard)
  // ─────────────────────────────────────────────────────────
  {
    id: "error-boundary-chain",
    title: "Error Boundary Chain",
    difficulty: "Hard",
    description: `The dashboard app below makes several GraphQL queries, but when a network error occurs, the entire app crashes with an unhandled promise rejection. There is no centralized error handling.\n\nYour task:\n1. Create an Apollo error link (onError from @apollo/client/link/error) that intercepts and logs GraphQL and network errors.\n2. Chain the error link before the HTTP link using ApolloLink.from().\n3. Add a React ErrorBoundary component that catches rendering errors and shows a fallback UI.\n4. Make sure GraphQL errors are extracted and surfaced, not swallowed.\n\nThis requires changes to both the Apollo Client setup and the React component tree.`,
    problemCode: `import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  useQuery,
  gql,
} from '@apollo/client';

// Bug: no error link — network errors crash silently
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

const GET_DASHBOARD = gql\`
  query GetDashboard {
    dashboard {
      totalUsers
      totalRevenue
      recentOrders {
        id
        amount
        status
      }
    }
  }
\`;

// Bug: no error boundary — render errors crash the whole app
const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) throw error; // This crashes with no boundary!

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Total Users: {data.dashboard.totalUsers}</p>
        <p>Total Revenue: \${data.dashboard.totalRevenue}</p>
      </div>
      <h2>Recent Orders</h2>
      <ul>
        {data.dashboard.recentOrders.map((order: { id: string; amount: number; status: string }) => (
          <li key={order.id}>
            Order #{order.id} — \${order.amount} ({order.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <Dashboard />
);

export default App;`,
    explanation: `Robust Apollo applications need two layers of error handling. The first layer is an error link created with onError from @apollo/client/link/error. This sits in the link chain before the HTTP link and intercepts all GraphQL and network errors, letting you log them, show notifications, or retry requests. The second layer is a React ErrorBoundary that catches errors thrown during rendering (like the "throw error" in our component). Together, these ensure that no error goes unhandled — the error link handles transport-level issues, and the ErrorBoundary prevents the UI from crashing.`,
    solution: `import React, { Component, ReactNode } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  useQuery,
  gql,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error link — intercepts and logs all errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        \`[GraphQL error]: Message: \${message}, Location: \${locations}, Path: \${path}\`
      );
    });
  }
  if (networkError) {
    console.error(\`[Network error]: \${networkError}\`);
  }
});

const httpLink = new HttpLink({ uri: '/graphql' });

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const GET_DASHBOARD = gql\`
  query GetDashboard {
    dashboard {
      totalUsers
      totalRevenue
      recentOrders {
        id
        amount
        status
      }
    }
  }
\`;

// Error Boundary component
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Total Users: {data.dashboard.totalUsers}</p>
        <p>Total Revenue: \${data.dashboard.totalRevenue}</p>
      </div>
      <h2>Recent Orders</h2>
      <ul>
        {data.dashboard.recentOrders.map((order: { id: string; amount: number; status: string }) => (
          <li key={order.id}>
            Order #{order.id} — \${order.amount} ({order.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <ErrorBoundary fallback={<p>Dashboard failed to load. Please try again.</p>}>
    <Dashboard />
  </ErrorBoundary>
);

export default App;`,
    hints: [
      "Apollo provides an error link factory called onError in @apollo/client/link/error that can intercept errors before they reach your components.",
      "Use ApolloLink.from([errorLink, httpLink]) to chain the error link before the HTTP link in your Apollo Client setup.",
      "Create a React class component with getDerivedStateFromError and componentDidCatch to catch render-time errors, then wrap your Dashboard in it.",
    ],
    testCases: [
      {
        description: "Creates an error link with onError",
        validate: (code: string) => /onError/.test(code) && /graphQLErrors|networkError/.test(code),
      },
      {
        description: "Chains links using ApolloLink.from",
        validate: (code: string) => /ApolloLink\.from/.test(code),
      },
      {
        description: "Implements an ErrorBoundary component",
        validate: (code: string) =>
          (/ErrorBoundary/.test(code) && /getDerivedStateFromError/.test(code)) ||
          (/ErrorBoundary/.test(code) && /componentDidCatch/.test(code)),
      },
      {
        description: "Wraps the dashboard in the ErrorBoundary",
        validate: (code: string) => /<ErrorBoundary[\s\S]*>[\s\S]*<Dashboard/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. Suspense Waterfall Fix (Hard)
  // ─────────────────────────────────────────────────────────
  {
    id: "suspense-waterfall-fix",
    title: "Suspense Waterfall Fix",
    difficulty: "Hard",
    description: `The project page below loads a project and then its tasks. Because the tasks query depends on the project loading first, there is a "waterfall" — the tasks query does not start until the project query finishes, doubling the perceived load time.\n\nYour task:\n1. Use useBackgroundQuery in the parent component to kick off the tasks query immediately (in parallel with the project query).\n2. Pass the queryRef down to the child component.\n3. Use useReadQuery in the child to read the data from the queryRef.\n4. Wrap the child in a Suspense boundary for loading state.\n\nThis uses Apollo Client 3.8+ Suspense features.`,
    problemCode: `import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_PROJECT = gql\`
  query GetProject($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      description
      owner {
        id
        name
      }
    }
  }
\`;

const GET_TASKS = gql\`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      status
      assignee {
        id
        name
      }
    }
  }
\`;

// Bug: sequential waterfall — tasks wait for project to finish
const TaskList = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useQuery(GET_TASKS, {
    variables: { projectId },
  });

  if (loading) return <p>Loading tasks...</p>;

  return (
    <ul>
      {data?.tasks.map((task: { id: string; title: string; status: string; assignee: { name: string } }) => (
        <li key={task.id}>
          {task.title} — {task.status} (Assigned to: {task.assignee.name})
        </li>
      ))}
    </ul>
  );
};

const ProjectPage = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useQuery(GET_PROJECT, {
    variables: { projectId },
  });

  if (loading) return <p>Loading project...</p>;

  return (
    <div>
      <h1>{data?.project.name}</h1>
      <p>{data?.project.description}</p>
      <p>Owner: {data?.project.owner.name}</p>
      <h2>Tasks</h2>
      {/* Bug: TaskList only mounts (and starts its query) after project loads */}
      <TaskList projectId={projectId} />
    </div>
  );
};

export default ProjectPage;`,
    explanation: `The waterfall problem occurs because TaskList only mounts after ProjectPage finishes loading, and TaskList's useQuery only fires on mount. Apollo Client 3.8+ introduces useBackgroundQuery, which starts a query immediately without suspending the component. It returns a queryRef that you pass to a child component, which reads the data using useReadQuery. Since useBackgroundQuery runs in the parent at the same time as the project query, both requests fire in parallel. The child component is wrapped in a Suspense boundary, which shows a fallback while the data loads. This eliminates the waterfall entirely.`,
    solution: `import React, { Suspense } from 'react';
import {
  useQuery,
  useBackgroundQuery,
  useReadQuery,
  gql,
  QueryRef,
} from '@apollo/client';

const GET_PROJECT = gql\`
  query GetProject($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      description
      owner {
        id
        name
      }
    }
  }
\`;

const GET_TASKS = gql\`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      status
      assignee {
        id
        name
      }
    }
  }
\`;

// Child reads from the queryRef — suspends until data is ready
const TaskList = ({ queryRef }: { queryRef: QueryRef }) => {
  const { data } = useReadQuery(queryRef);

  return (
    <ul>
      {data?.tasks.map((task: { id: string; title: string; status: string; assignee: { name: string } }) => (
        <li key={task.id}>
          {task.title} — {task.status} (Assigned to: {task.assignee.name})
        </li>
      ))}
    </ul>
  );
};

const ProjectPage = ({ projectId }: { projectId: string }) => {
  const { data, loading } = useQuery(GET_PROJECT, {
    variables: { projectId },
  });

  // Kicks off tasks query immediately — runs in parallel with project query
  const [queryRef] = useBackgroundQuery(GET_TASKS, {
    variables: { projectId },
  });

  if (loading) return <p>Loading project...</p>;

  return (
    <div>
      <h1>{data?.project.name}</h1>
      <p>{data?.project.description}</p>
      <p>Owner: {data?.project.owner.name}</p>
      <h2>Tasks</h2>
      <Suspense fallback={<p>Loading tasks...</p>}>
        <TaskList queryRef={queryRef} />
      </Suspense>
    </div>
  );
};

export default ProjectPage;`,
    hints: [
      "Apollo Client 3.8+ has Suspense-compatible hooks that let you start queries early and read data later.",
      "useBackgroundQuery starts the query without suspending — it returns a queryRef. useReadQuery reads data from that queryRef and suspends until ready.",
      "Call useBackgroundQuery(GET_TASKS, { variables }) in the parent, pass the queryRef to TaskList, and use useReadQuery(queryRef) inside TaskList. Wrap TaskList in <Suspense>.",
    ],
    testCases: [
      {
        description: "Uses useBackgroundQuery to start the tasks query early",
        validate: (code: string) => /useBackgroundQuery/.test(code),
      },
      {
        description: "Uses useReadQuery to read data from queryRef",
        validate: (code: string) => /useReadQuery/.test(code),
      },
      {
        description: "Wraps child component in Suspense boundary",
        validate: (code: string) => /<Suspense[\s\S]*fallback/.test(code),
      },
      {
        description: "Passes queryRef from parent to child",
        validate: (code: string) => /queryRef/.test(code),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. Full Stack Cache (Hard)
  // ─────────────────────────────────────────────────────────
  {
    id: "full-stack-cache",
    title: "Full Stack Cache",
    difficulty: "Hard",
    description: `The shopping list app below has three broken features:\n\n1. Adding an item: The mutation succeeds but the new item does not appear until page refresh.\n2. Deleting an item: The mutation succeeds but the item stays visible in the list.\n3. Pagination: Clicking "Load More" replaces the visible items instead of appending.\n\nYour task:\n1. Add an optimisticResponse and update callback for the add mutation (cache.modify to append the new item ref).\n2. Add an update callback for the delete mutation that uses cache.evict + cache.gc.\n3. Configure typePolicies with a merge function for the "items" field to support pagination.\n\nThis challenge combines three core cache management patterns into one cohesive solution.`,
    problemCode: `import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  gql,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

const GET_ITEMS = gql\`
  query GetItems($offset: Int!, $limit: Int!) {
    items(offset: $offset, limit: $limit) {
      id
      name
      quantity
      category
    }
  }
\`;

const ADD_ITEM = gql\`
  mutation AddItem($name: String!, $quantity: Int!, $category: String!) {
    addItem(name: $name, quantity: $quantity, category: $category) {
      id
      name
      quantity
      category
    }
  }
\`;

const DELETE_ITEM = gql\`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
\`;

const LIMIT = 10;

// Bug 3: no merge function — pagination replaces instead of appending
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const ShoppingList = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('General');
  const [offset, setOffset] = useState(0);

  const { data, loading, fetchMore } = useQuery(GET_ITEMS, {
    variables: { offset: 0, limit: LIMIT },
  });

  // Bug 1: no optimistic response or cache update for add
  const [addItem] = useMutation(ADD_ITEM, {
    refetchQueries: [{ query: GET_ITEMS, variables: { offset: 0, limit: LIMIT } }],
  });

  // Bug 2: no cache update for delete
  const [deleteItem] = useMutation(DELETE_ITEM);

  const handleAdd = () => {
    if (!name.trim()) return;
    addItem({ variables: { name, quantity, category } });
    setName('');
    setQuantity(1);
  };

  const handleDelete = (id: string) => {
    deleteItem({ variables: { id } });
  };

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchMore({ variables: { offset: nextOffset, limit: LIMIT } });
  };

  if (loading && !data) return <p>Loading shopping list...</p>;

  return (
    <div>
      <h1>Shopping List</h1>
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Produce</option>
          <option>Dairy</option>
          <option>Meat</option>
        </select>
        <button onClick={handleAdd}>Add Item</button>
      </div>
      <ul>
        {data?.items.map((item: { id: string; name: string; quantity: number; category: string }) => (
          <li key={item.id}>
            {item.name} x{item.quantity} [{item.category}]
            <button onClick={() => handleDelete(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={loading}>Load More</button>
    </div>
  );
};

export default ShoppingList;`,
    explanation: `This challenge tests three fundamental Apollo cache management patterns working together:\n\n1. Optimistic add: The optimisticResponse immediately shows the new item while the mutation is in flight. The update callback uses cache.modify on the ROOT_QUERY's items field to append a reference to the new item, which is faster and more reliable than refetchQueries.\n\n2. Cache eviction on delete: cache.evict removes the normalized object by its cache ID, and cache.gc cleans up all dangling references in any query result lists that referenced it.\n\n3. Pagination merge: The typePolicies merge function tells InMemoryCache to concatenate existing and incoming arrays for the items field instead of replacing them. keyArgs: false ensures all pages are stored under the same cache key.\n\nTogether, these patterns provide a responsive, consistent UI without unnecessary network requests.`,
    solution: `import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  gql,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

const GET_ITEMS = gql\`
  query GetItems($offset: Int!, $limit: Int!) {
    items(offset: $offset, limit: $limit) {
      id
      name
      quantity
      category
    }
  }
\`;

const ADD_ITEM = gql\`
  mutation AddItem($name: String!, $quantity: Int!, $category: String!) {
    addItem(name: $name, quantity: $quantity, category: $category) {
      id
      name
      quantity
      category
    }
  }
\`;

const DELETE_ITEM = gql\`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
\`;

const LIMIT = 10;

// Fix 3: typePolicies with merge function for pagination
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          items: {
            keyArgs: false,
            merge(existing = [], incoming: any[]) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

const ShoppingList = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('General');
  const [offset, setOffset] = useState(0);

  const { data, loading, fetchMore } = useQuery(GET_ITEMS, {
    variables: { offset: 0, limit: LIMIT },
  });

  // Fix 1: optimistic response + cache update for add
  const [addItem] = useMutation(ADD_ITEM, {
    optimisticResponse: {
      addItem: {
        id: 'temp-' + Date.now(),
        name,
        quantity,
        category,
        __typename: 'Item',
      },
    },
    update(cache, { data: mutationData }) {
      if (!mutationData) return;
      cache.modify({
        fields: {
          items(existingItemRefs = [], { toReference }) {
            const newItemRef = toReference(mutationData.addItem);
            return [...existingItemRefs, newItemRef];
          },
        },
      });
    },
  });

  // Fix 2: cache eviction for delete
  const [deleteItem] = useMutation(DELETE_ITEM, {
    update(cache, { data: mutationData }) {
      if (!mutationData?.deleteItem) return;
      const deletedId = mutationData.deleteItem.id;
      cache.evict({ id: cache.identify({ __typename: 'Item', id: deletedId }) });
      cache.gc();
    },
  });

  const handleAdd = () => {
    if (!name.trim()) return;
    addItem({ variables: { name, quantity, category } });
    setName('');
    setQuantity(1);
  };

  const handleDelete = (id: string) => {
    deleteItem({ variables: { id } });
  };

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchMore({ variables: { offset: nextOffset, limit: LIMIT } });
  };

  if (loading && !data) return <p>Loading shopping list...</p>;

  return (
    <div>
      <h1>Shopping List</h1>
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Produce</option>
          <option>Dairy</option>
          <option>Meat</option>
        </select>
        <button onClick={handleAdd}>Add Item</button>
      </div>
      <ul>
        {data?.items.map((item: { id: string; name: string; quantity: number; category: string }) => (
          <li key={item.id}>
            {item.name} x{item.quantity} [{item.category}]
            <button onClick={() => handleDelete(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={loading}>Load More</button>
    </div>
  );
};

export default ShoppingList;`,
    hints: [
      "This challenge combines three patterns: optimistic mutation, cache eviction, and pagination merge. Tackle them one at a time.",
      "For add: use optimisticResponse with __typename and cache.modify with toReference. For delete: use cache.evict + cache.gc. For pagination: use typePolicies with a merge function.",
      "The complete solution needs: optimisticResponse on ADD_ITEM, update with cache.modify using toReference for add, update with cache.evict + cache.gc for delete, and typePolicies { Query: { fields: { items: { keyArgs: false, merge(existing=[], incoming) { return [...existing, ...incoming] } } } } }.",
    ],
    testCases: [
      {
        description: "Has optimisticResponse for the add mutation",
        validate: (code: string) => /optimisticResponse/.test(code) && /__typename/.test(code),
      },
      {
        description: "Uses cache.modify or cache.writeQuery to add items to cache",
        validate: (code: string) => /cache\.modify/.test(code) || /cache\.writeQuery/.test(code),
      },
      {
        description: "Uses cache.evict and cache.gc for deletion",
        validate: (code: string) => /cache\.evict/.test(code) && /cache\.gc/.test(code),
      },
      {
        description: "Configures typePolicies with merge for pagination",
        validate: (code: string) =>
          /typePolicies/.test(code) &&
          /merge/.test(code) &&
          /keyArgs/.test(code),
      },
    ],
  },
];

/** Get an Apollo challenge by id. */
export function getApolloChallengeById(id: string): ApolloChallenge | undefined {
  return APOLLO_CHALLENGES.find((c) => c.id === id);
}

/** Get all Apollo challenge ids for static paths. */
export function getAllApolloChallengeIds(): string[] {
  return APOLLO_CHALLENGES.map((c) => c.id);
}
