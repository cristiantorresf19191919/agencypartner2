// 1. The Low-Level Hooks (Different Implementations)

import { useEffect, useState } from "react";

// Implementation A: Real API
const useRealApiUser = (userId) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
     /* fetch logic */ 
     setUser({ name: "Live User from API" })
  }, [userId]);
  return user;
};

// Implementation B: Mock Data (For testing/development)
const useMockUser = (userId) => {
  // Returns instant data without network
  return { name: "Test User (Mock)" };
};

// 2. High-Level Component (Pure UI)
// ✅ DIP: It accepts the "hook" as a dependency prop (useDataSource)
const UserProfile = ({ userId, useDataSource }) => {
  // The component doesn't know if it's hitting an API or a Mock
  const user = useDataSource(userId);

  if (!user) return <div>Loading...</div>;
  return <h1>{user.name}</h1>;
};

// 3. Usage (The "Main" or Parent Component injects the dependency)
const App = () => {
  const isDevelopment = true;

  return (
    <div>
      {/* Scenario 1: Production (Real API) */}
      <UserProfile userId={1} useDataSource={useRealApiUser} />

      {/* Scenario 2: Testing (Mock Data) - No API calls made! */}
      <UserProfile userId={1} useDataSource={useMockUser} />
    </div>
  );
};