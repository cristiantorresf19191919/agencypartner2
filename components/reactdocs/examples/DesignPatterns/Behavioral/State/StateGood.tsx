// ✅ The Good Way (State Pattern in TypeScript/React)
// State is a behavioral design pattern that lets an object alter its behavior 
// when its internal state changes. It appears as if the object changed its class.

import React, { useReducer, useCallback } from "react";

// ✅ State interface - declares state-specific methods
interface DocumentState {
  publish(user: User): DocumentState;
  render(): string;
}

// ✅ Concrete State: Draft
class DraftState implements DocumentState {
  constructor(private document: DocumentContext) {}

  publish(user: User): DocumentState {
    console.log("Moving document from Draft to Moderation");
    return this.document.getModerationState();
  }

  render(): string {
    return "Rendering document in Draft state (editable)";
  }
}

// ✅ Concrete State: Moderation
class ModerationState implements DocumentState {
  constructor(private document: DocumentContext) {}

  publish(user: User): DocumentState {
    if (user.isAdmin()) {
      console.log("Publishing document (admin approved)");
      return this.document.getPublishedState();
    } else {
      console.log("Only administrators can publish from Moderation");
      return this;
    }
  }

  render(): string {
    return "Rendering document in Moderation state (pending review)";
  }
}

// ✅ Concrete State: Published
class PublishedState implements DocumentState {
  constructor(private document: DocumentContext) {}

  publish(user: User): DocumentState {
    console.log("Document is already published");
    return this;
  }

  render(): string {
    return "Rendering document in Published state (read-only)";
  }
}

// ✅ Context class - stores reference to current state object
interface DocumentContext {
  getDraftState(): DocumentState;
  getModerationState(): DocumentState;
  getPublishedState(): DocumentState;
}

class Document implements DocumentContext {
  private draftState: DocumentState;
  private moderationState: DocumentState;
  private publishedState: DocumentState;
  private currentState: DocumentState;
  private content: string;

  constructor(content: string) {
    this.content = content;
    this.draftState = new DraftState(this);
    this.moderationState = new ModerationState(this);
    this.publishedState = new PublishedState(this);
    this.currentState = this.draftState; // Start in draft state
  }

  changeState(state: DocumentState): void {
    this.currentState = state;
  }

  getDraftState(): DocumentState {
    return this.draftState;
  }

  getModerationState(): DocumentState {
    return this.moderationState;
  }

  getPublishedState(): DocumentState {
    return this.publishedState;
  }

  publish(user: User): void {
    const newState = this.currentState.publish(user);
    this.changeState(newState);
  }

  render(): string {
    return this.currentState.render();
  }

  getContent(): string {
    return this.content;
  }

  getCurrentState(): DocumentState {
    return this.currentState;
  }
}

// Helper class for user roles
class User {
  constructor(private role: string) {}

  isAdmin(): boolean {
    return this.role === "admin";
  }
}

// ✅ React Component using State Pattern
type DocumentAction =
  | { type: "PUBLISH"; user: User }
  | { type: "RESET" };

interface DocumentStateMachine {
  document: Document;
  renderOutput: string;
}

const documentReducer = (
  state: DocumentStateMachine,
  action: DocumentAction
): DocumentStateMachine => {
  switch (action.type) {
    case "PUBLISH":
      const doc = new Document(state.document.getContent());
      doc.changeState(state.document.getCurrentState());
      doc.publish(action.user);
      return {
        document: doc,
        renderOutput: doc.render(),
      };
    case "RESET":
      const newDoc = new Document(state.document.getContent());
      return {
        document: newDoc,
        renderOutput: newDoc.render(),
      };
    default:
      return state;
  }
};

const DocumentComponent: React.FC = () => {
  const [state, dispatch] = useReducer(documentReducer, {
    document: new Document("My Article"),
    renderOutput: "",
  });

  React.useEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  const handlePublish = useCallback(
    (user: User) => {
      dispatch({ type: "PUBLISH", user });
    },
    []
  );

  const admin = new User("admin");
  const editor = new User("editor");

  return (
    <div style={{ padding: "20px" }}>
      <h3>Document State Pattern Example</h3>
      <div style={{ marginBottom: "10px" }}>
        <p>Current State: {state.document.getCurrentState().constructor.name}</p>
        <p>Render Output: {state.document.render()}</p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handlePublish(editor)}>
          Publish as Editor
        </button>
        <button onClick={() => handlePublish(admin)}>
          Publish as Admin
        </button>
        <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      </div>
    </div>
  );
};

// ✅ Alternative: Using React useReducer with state machine pattern
type DocumentStateType = "draft" | "moderation" | "published";

interface DocumentState {
  state: DocumentStateType;
  content: string;
}

type DocumentActionType =
  | { type: "PUBLISH"; user: { isAdmin: boolean } }
  | { type: "RESET" };

const documentStateMachineReducer = (
  state: DocumentState,
  action: DocumentActionType
): DocumentState => {
  switch (state.state) {
    case "draft":
      if (action.type === "PUBLISH") {
        return { ...state, state: "moderation" };
      }
      return state;

    case "moderation":
      if (action.type === "PUBLISH") {
        if (action.user.isAdmin) {
          return { ...state, state: "published" };
        }
        return state; // Only admin can publish
      }
      return state;

    case "published":
      // Published documents don't change state
      return state;

    default:
      return state;
  }
};

const useDocumentStateMachine = (initialContent: string) => {
  const [state, dispatch] = useReducer(documentStateMachineReducer, {
    state: "draft" as DocumentStateType,
    content: initialContent,
  });

  const publish = useCallback(
    (user: { isAdmin: boolean }) => {
      dispatch({ type: "PUBLISH", user });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const getRenderOutput = useCallback((): string => {
    switch (state.state) {
      case "draft":
        return "Rendering document in Draft state (editable)";
      case "moderation":
        return "Rendering document in Moderation state (pending review)";
      case "published":
        return "Rendering document in Published state (read-only)";
      default:
        return "";
    }
  }, [state.state]);

  return {
    state: state.state,
    content: state.content,
    publish,
    reset,
    render: getRenderOutput,
  };
};

export { DocumentComponent, useDocumentStateMachine, Document, User };
