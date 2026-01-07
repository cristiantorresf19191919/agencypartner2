// ❌ The Bad Way (Direct Data Fetching)
// Component fetches data immediately, even if not needed

import React, { useState, useEffect } from "react";

// ❌ Problem: Data loads immediately when component mounts
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // ❌ Expensive API call happens immediately
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  return (
    <div>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide" : "Show"} Details
      </button>
      {showDetails && user && (
        <div>
          {/* ❌ Data was fetched even if user never clicks "Show Details" */}
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
};

