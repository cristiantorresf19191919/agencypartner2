// ❌ The Bad Way (Direct Dependency on Incompatible API)
// Component directly uses incompatible data format

import React, { useState, useEffect } from "react";

// ❌ Problem: Third-party API returns data in different format
interface ThirdPartyUser {
  user_name: string;
  user_email: string;
  user_age: number;
}

// ❌ Component is tightly coupled to ThirdPartyUser format
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<ThirdPartyUser | null>(null);

  useEffect(() => {
    // ❌ Direct dependency on third-party format
    fetch(`/api/third-party/users/${userId}`)
      .then((res) => res.json())
      .then((data: ThirdPartyUser) => {
        setUser(data);
      });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  // ❌ Have to use third-party naming convention throughout
  return (
    <div>
      <h1>{user.user_name}</h1>
      <p>{user.user_email}</p>
      <p>Age: {user.user_age}</p>
    </div>
  );
};






