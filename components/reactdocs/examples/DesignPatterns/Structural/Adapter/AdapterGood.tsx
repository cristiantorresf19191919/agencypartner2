// ✅ The Good Way (Adapter Pattern in React)
// Adapter transforms incompatible data to our expected format

import React, { useState, useEffect } from "react";

// Third-party API format
interface ThirdPartyUser {
  user_name: string;
  user_email: string;
  user_age: number;
}

// Our application's expected format
interface User {
  name: string;
  email: string;
  age: number;
}

// ✅ Adapter function: Transforms third-party format to our format
const adaptUser = (thirdPartyUser: ThirdPartyUser): User => {
  return {
    name: thirdPartyUser.user_name,
    email: thirdPartyUser.user_email,
    age: thirdPartyUser.user_age,
  };
};

// ✅ Component uses our standard User interface
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/third-party/users/${userId}`)
      .then((res) => res.json())
      .then((data: ThirdPartyUser) => {
        // ✅ Adapt the data to our format
        const adaptedUser = adaptUser(data);
        setUser(adaptedUser);
      });
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  // ✅ Use our standard naming convention
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  );
};

// ✅ Alternative: Custom hook adapter
const useUserAdapter = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/third-party/users/${userId}`)
      .then((res) => res.json())
      .then((data: ThirdPartyUser) => {
        setUser(adaptUser(data));
      });
  }, [userId]);

  return user;
};

const UserProfileWithHook = ({ userId }: { userId: number }) => {
  const user = useUserAdapter(userId);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export { UserProfile, UserProfileWithHook };

