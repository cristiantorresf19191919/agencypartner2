// ✅ The Good Way (Builder Pattern in React)
// Using a builder hook or component composition for clean API

import React, { useState } from "react";

// ✅ Builder hook pattern
interface UserConfig {
  name: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
  avatar?: string;
  bio?: string;
}

const useUserBuilder = (name: string) => {
  const [config, setConfig] = useState<UserConfig>({ name });

  const builder = {
    email: (email: string) => {
      setConfig((prev) => ({ ...prev, email }));
      return builder;
    },
    age: (age: number) => {
      setConfig((prev) => ({ ...prev, age }));
      return builder;
    },
    phone: (phone: string) => {
      setConfig((prev) => ({ ...prev, phone }));
      return builder;
    },
    build: () => config,
  };

  return builder;
};

// ✅ Better: Component with builder props (more React-idiomatic)
interface UserBuilderProps {
  name: string;
  children: (builder: {
    email: (email: string) => UserBuilderProps;
    age: (age: number) => UserBuilderProps;
    phone: (phone: string) => UserBuilderProps;
  }) => React.ReactNode;
}

// ✅ Best: Simple component with sensible defaults
interface UserProps {
  name: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
  avatar?: string;
  bio?: string;
}

const User = ({ name, email, age, phone, address, isActive = true, avatar, bio }: UserProps) => {
  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} />}
      <h2>{name}</h2>
      {email && <p>Email: {email}</p>}
      {age && <p>Age: {age}</p>}
      {phone && <p>Phone: {phone}</p>}
      {address && <p>Address: {address}</p>}
      {bio && <p>{bio}</p>}
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
    </div>
  );
};

// ✅ Usage with object spread (cleaner than individual props)
const App = () => {
  const user1 = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  };

  const user2 = {
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    phone: "123-456-7890",
    address: "123 Main St",
    isActive: false,
  };

  return (
    <div>
      {/* ✅ Clean usage with object spread */}
      <User {...user1} />
      <User {...user2} />
      
      {/* ✅ Or with explicit props */}
      <User
        name="Bob Johnson"
        email="bob@example.com"
        age={35}
        isActive={true}
      />
    </div>
  );
};

export default App;






