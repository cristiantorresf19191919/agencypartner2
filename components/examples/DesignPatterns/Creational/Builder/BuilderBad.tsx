// ❌ The Bad Way (Too Many Props)
// Component with too many optional props, hard to use and maintain

import React from "react";

interface UserProps {
  name: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
  avatar?: string;
  bio?: string;
  // ❌ Problem: Too many optional props, hard to track
}

// ❌ Component with many optional props
const User = ({
  name,
  email,
  age,
  phone,
  address,
  isActive,
  avatar,
  bio,
}: UserProps) => {
  return (
    <div>
      <h2>{name}</h2>
      {email && <p>Email: {email}</p>}
      {age && <p>Age: {age}</p>}
      {/* ❌ Lots of conditional rendering */}
    </div>
  );
};

// ❌ Usage becomes messy
const App = () => {
  return (
    <div>
      <User
        name="John"
        email="john@example.com"
        age={30}
        phone="123-456-7890"
        address="123 Main St"
        isActive={true}
        avatar="avatar.jpg"
        bio="Software developer"
      />
    </div>
  );
};





