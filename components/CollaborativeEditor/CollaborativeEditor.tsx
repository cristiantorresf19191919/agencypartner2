"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { FirebaseProvider } from "@/lib/firebaseYjsProvider";
import { collection, query, onSnapshot, doc, setDoc, serverTimestamp, deleteDoc, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { OnMount } from "@monaco-editor/react";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CollaborativeEditorProps {
  roomId: string;
  userName: string;
  language?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

export default function CollaborativeEditor({
  roomId,
  userName,
  language = "typescript",
  initialCode = "",
  onCodeChange,
}: CollaborativeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<FirebaseProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [synced, setSynced] = useState(false);
  const [users, setUsers] = useState<Array<{ name: string; color: string; id: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const initialCodeAppliedRef = useRef(false);
  const userIdRef = useRef<string>(`user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const userColorRef = useRef<string>(`hsl(${Math.random() * 360}, 70%, 50%)`);

  useEffect(() => {
    let mounted = true;

    const initializeCollaboration = async () => {
      try {
        // Initialize Yjs document
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        // Connect to Firebase
        const provider = new FirebaseProvider(roomId, ydoc);
        providerRef.current = provider;

        // Wait for initial sync to complete
        await provider.whenSynced();

        if (!mounted) return;

        setSynced(true);

        // Track user presence in Firestore
        const userPresenceRef = doc(db, 'collaborative-rooms', roomId, 'users', userIdRef.current);
        setDoc(userPresenceRef, {
          name: userName,
          color: userColorRef.current,
          lastSeen: serverTimestamp(),
        }).catch((e) => {
          console.error('Error setting user presence:', e);
          if (mounted) setError('Failed to connect to collaboration server');
        });

        // Update lastSeen periodically
        const presenceInterval = setInterval(() => {
          setDoc(userPresenceRef, {
            name: userName,
            color: userColorRef.current,
            lastSeen: serverTimestamp(),
          }, { merge: true });
        }, 30000); // Update every 30 seconds

        // Listen for other users
        const usersQuery = query(
          collection(db, 'collaborative-rooms', roomId, 'users')
        );

        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
          const now = Date.now();
          type UserDoc = { id: string; name?: string; color?: string; lastSeen?: Timestamp };
          const userList = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as UserDoc))
            .filter((user) => {
              const lastSeen = user.lastSeen?.toMillis?.() ?? 0;
              return user.id !== userIdRef.current && (now - lastSeen) < 120000;
            })
            .map((u) => ({ id: u.id, name: u.name ?? "Anonymous", color: u.color ?? "#888" }));
          setUsers(userList);
        });

        // Store cleanup references
        return () => {
          mounted = false;
          clearInterval(presenceInterval);
          unsubscribeUsers();
          deleteDoc(userPresenceRef).catch(console.error);
          bindingRef.current?.destroy();
          provider.destroy();
          ydoc.destroy();
        };
      } catch (e) {
        console.error('Error initializing collaborative editor:', e);
        if (mounted) setError('Failed to initialize editor');
      }
    };

    let cleanup: (() => void) | undefined;
    initializeCollaboration().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [roomId, userName]);

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Wait for provider to be synced before setting up binding
    const setupBinding = async () => {
      const provider = providerRef.current;
      const ydoc = ydocRef.current;

      if (!ydoc || !provider || !editorRef.current) {
        // Retry after a short delay if not ready
        setTimeout(setupBinding, 100);
        return;
      }

      // Wait for provider to be synced
      if (!provider.synced) {
        await provider.whenSynced();
      }

      try {
        // Get or create Yjs text type
        const ytext = ydoc.getText("monaco");

        // Set initial content if provided and document is empty
        // Only do this once and only if no content exists
        if (initialCode && ytext.length === 0 && !initialCodeAppliedRef.current) {
          initialCodeAppliedRef.current = true;
          try {
            ytext.insert(0, initialCode);
          } catch (e) {
            console.error('Error inserting initial code:', e);
          }
        }

        // Bind Monaco to Yjs
        const binding = new MonacoBinding(
          ytext,
          editorRef.current.getModel()!,
          new Set([editorRef.current])
        );
        bindingRef.current = binding;

        // Listen for changes
        ytext.observe(() => {
          if (onCodeChange && editorRef.current) {
            try {
              onCodeChange(editorRef.current.getValue());
            } catch (e) {
              console.error('Error in onCodeChange:', e);
            }
          }
        });

        // Set theme
        monaco.editor.setTheme("vs-dark");
      } catch (e) {
        console.error('Error setting up Monaco binding:', e);
        setError('Failed to setup editor binding');
      }
    };

    setupBinding();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Connection status */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: synced ? "#4ade80" : "#ef4444",
            animation: synced ? "none" : "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "#fff" }}>
          {error ? "Error" : synced ? "Synced" : "Connecting..."}
        </span>
        {error && (
          <span style={{ fontSize: 11, color: "#ef4444", marginLeft: 8 }}>
            {error}
          </span>
        )}
        {users.length > 0 && (
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>
            {users.length} other user{users.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* User avatars */}
      {users.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 10,
            zIndex: 10,
            display: "flex",
            gap: 4,
            flexDirection: "column",
          }}
        >
          {users.map((user) => (
            <div
              key={user.id}
              title={user.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: user.color,
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {user.name[0].toUpperCase()}
            </div>
          ))}
        </div>
      )}

      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontLigatures: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
