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
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<Array<{ name: string; color: string; id: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const isReadyRef = useRef(false);
  const userIdRef = useRef<string>(`user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const userColorRef = useRef<string>(`hsl(${Math.random() * 360}, 70%, 50%)`);

  useEffect(() => {
    let mounted = true;

    try {
      // Initialize Yjs document
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      // Connect to Firebase
      const provider = new FirebaseProvider(roomId, ydoc);
      providerRef.current = provider;

      // Mark as connected after a brief delay to ensure setup is complete
      setTimeout(() => {
        if (mounted) {
          setConnected(true);
          isReadyRef.current = true;
        }
      }, 300);

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

      // Cleanup
      return () => {
        mounted = false;
        clearInterval(presenceInterval);
        unsubscribeUsers();
        // Remove user presence on disconnect
        deleteDoc(userPresenceRef).catch(console.error);
        bindingRef.current?.destroy();
        provider.destroy();
        ydoc.destroy();
      };
    } catch (e) {
      console.error('Error initializing collaborative editor:', e);
      setError('Failed to initialize editor');
    }
  }, [roomId, userName]);

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Wait for provider to be ready
    const setupBinding = () => {
      if (!ydocRef.current || !providerRef.current || !editorRef.current || !isReadyRef.current) {
        // Retry after a short delay if not ready
        setTimeout(setupBinding, 100);
        return;
      }

      try {
        // Get or create Yjs text type
        const ytext = ydocRef.current.getText("monaco");

        // Set initial content if provided and document is empty
        // Use a delay to ensure Firestore has loaded any existing content
        setTimeout(() => {
          if (initialCode && ytext.length === 0 && editorRef.current) {
            try {
              ytext.insert(0, initialCode);
            } catch (e) {
              console.error('Error inserting initial code:', e);
            }
          }
        }, 800);

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
            background: connected ? "#4ade80" : "#ef4444",
            animation: connected ? "none" : "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "#fff" }}>
          {error ? "Error" : connected ? "Synced" : "Connecting..."}
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
