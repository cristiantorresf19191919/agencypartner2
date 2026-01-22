// ❌ The Bad Way (If/Else State Management)
// Using conditional statements to manage state behavior
// Problem: State machine based on conditionals becomes bloated and hard to maintain

import React, { useState } from "react";

// ❌ Problem: Lots of if/else logic in component
const DocumentComponent = () => {
  const [state, setState] = useState<"draft" | "moderation" | "published">("draft");
  const [content] = useState("My Article");

  // ❌ Complex conditional logic for publish
  const publish = (user: { isAdmin: boolean }) => {
    switch (state) {
      case "draft":
        setState("moderation");
        console.log("Moving document from Draft to Moderation");
        break;
      case "moderation":
        if (user.isAdmin) {
          setState("published");
          console.log("Publishing document (admin approved)");
        } else {
          console.log("Only administrators can publish from Moderation");
        }
        break;
      case "published":
        // Do nothing
        console.log("Document is already published");
        break;
    }
  };

  // ❌ More conditional logic for render
  const render = (): string => {
    switch (state) {
      case "draft":
        return "Rendering document in Draft state (editable)";
      case "moderation":
        return "Rendering document in Moderation state (pending review)";
      case "published":
        return "Rendering document in Published state (read-only)";
      default:
        return "";
    }
  };

  // ❌ What if we want to add a new state (e.g., "archived")?
  // We must modify ALL methods with more if/else statements
  // ❌ State logic is scattered and hard to maintain
  // ❌ Easy to introduce bugs when modifying state transitions
  // ❌ Violates Open/Closed Principle - need to modify existing code for new states

  const admin = { isAdmin: true };
  const editor = { isAdmin: false };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Document State Management (Bad Way)</h3>
      <div style={{ marginBottom: "10px" }}>
        <p>Current State: {state}</p>
        <p>Render Output: {render()}</p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => publish(editor)}>Publish as Editor</button>
        <button onClick={() => publish(admin)}>Publish as Admin</button>
        <button onClick={() => setState("draft")}>Reset</button>
      </div>
      <div style={{ marginTop: "20px", padding: "10px", background: "#ffe6e6" }}>
        <strong>Problems with this approach:</strong>
        <ul>
          <li>State logic scattered across multiple switch statements</li>
          <li>Adding new states requires modifying all methods</li>
          <li>Hard to maintain and test</li>
          <li>Violates Single Responsibility Principle</li>
          <li>Violates Open/Closed Principle</li>
        </ul>
      </div>
    </div>
  );
};

// ❌ Alternative bad approach: Using nested conditionals
const DocumentComponentAlt = () => {
  const [state, setState] = useState<"draft" | "moderation" | "published">("draft");
  const [content] = useState("My Article");

  // ❌ Even worse: nested if/else statements
  const publish = (user: { isAdmin: boolean }) => {
    if (state === "draft") {
      setState("moderation");
      console.log("Moving document from Draft to Moderation");
    } else if (state === "moderation") {
      if (user.isAdmin) {
        setState("published");
        console.log("Publishing document (admin approved)");
      } else {
        console.log("Only administrators can publish from Moderation");
      }
    } else if (state === "published") {
      console.log("Document is already published");
    }
    // ❌ What happens if we add "archived" state? More nested if/else!
  };

  const render = (): string => {
    if (state === "draft") {
      return "Rendering document in Draft state (editable)";
    } else if (state === "moderation") {
      return "Rendering document in Moderation state (pending review)";
    } else if (state === "published") {
      return "Rendering document in Published state (read-only)";
    }
    return "";
    // ❌ More if/else for each new state
  };

  return (
    <div>
      <p>State: {state}</p>
      <p>Render: {render()}</p>
      <button onClick={() => publish({ isAdmin: false })}>Publish</button>
    </div>
  );
};

export { DocumentComponent, DocumentComponentAlt };
