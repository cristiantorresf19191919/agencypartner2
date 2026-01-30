// ✅ The Good Way (Proxy Pattern / Lazy Loading in React)
// Using lazy loading and code splitting

import React, { useState, lazy, Suspense } from "react";

// ✅ Lazy load component (React's built-in proxy pattern)
// const UserDetails = lazy(() => import("./UserDetails"));

// ✅ Proxy hook: Only fetches data when needed
type UserData = { name: string; email: string };

const useLazyUser = (userId: number) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUser = async () => {
    if (user) return; // Already loaded

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, loadUser };
};

// ✅ Component with lazy loading
const UserProfile = ({ userId }: { userId: number }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user, isLoading, loadUser } = useLazyUser(userId);

  const handleToggle = () => {
    if (!showDetails && !user) {
      loadUser(); // ✅ Only fetch when user wants to see details
    }
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {showDetails ? "Hide" : "Show"} Details
      </button>
      {showDetails && (
        <Suspense fallback={<div>Loading...</div>}>
          {isLoading ? (
            <div>Loading user data...</div>
          ) : user ? (
            <div>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          ) : null}
        </Suspense>
      )}
    </div>
  );
};

// ✅ Alternative: Using React.memo as a proxy for expensive renders
const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
  // Expensive rendering logic
  return <div>{/* Complex rendering */}</div>;
});

// ✅ Image proxy component
const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div>
      {!loaded && !error && <div>Loading image...</div>}
      {error && <div>Failed to load image</div>}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ display: loaded ? "block" : "none" }}
      />
    </div>
  );
};

export { UserProfile, LazyImage, ExpensiveComponent };






