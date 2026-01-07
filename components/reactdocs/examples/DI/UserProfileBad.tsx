// 👎 Low-level Hook (Specific implementation)

import { useEffect, useState } from "react";

// This hook creates a real network request
const useFetchUserFromAPI = (userId) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`https://api.com/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return user;
};

// 👎 High-level Component
const UserProfile = ({ userId }) => {
  // ❌ VIOLATION: Hard dependency on the specific API hook.
  // We cannot reuse this UI with different data sources.
  const user = useFetchUserFromAPI(userId);

  if (!user) return <div>Loading...</div>;
  return <h1>{user.name}</h1>;
};