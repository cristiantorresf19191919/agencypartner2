// 👎 Low-level Hook (Specific implementation)

import { useEffect, useState } from "react";

type User = { name: string };

// This hook creates a real network request
const useFetchUserFromAPI = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`https://api.com/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return user;
};

// 👎 High-level Component
const UserProfile = ({ userId }: { userId: string }) => {
  // ❌ VIOLATION: Hard dependency on the specific API hook.
  // We cannot reuse this UI with different data sources.
  const user = useFetchUserFromAPI(userId);

  if (!user) return <div>Loading...</div>;
  return <h1>{user.name}</h1>;
};