"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  People as PeopleIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import CollaborativeEditor from "@/components/CollaborativeEditor/CollaborativeEditor";
import styles from "./CollaborativePage.module.css";

export default function CollaborativePage() {
  const { createLocalizedPath } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("typescript");

  useEffect(() => {
    // Get room ID from URL or generate new one
    const urlRoomId = searchParams.get("room");
    if (urlRoomId) {
      setRoomId(urlRoomId);
    } else {
      const newRoomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      setRoomId(newRoomId);
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.replace(`${currentPath}?room=${newRoomId}`, { scroll: false });
      }
    }

    // Get or set user name
    const storedName = localStorage.getItem("collab-user-name") || "";
    if (storedName) {
      setUserName(storedName);
    } else {
      const defaultName = `User-${Math.random().toString(36).slice(2, 7)}`;
      setUserName(defaultName);
      localStorage.setItem("collab-user-name", defaultName);
    }
  }, [searchParams, router]);

  const copyRoomLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join my collaborative coding session",
        text: "Let's code together!",
        url: `${window.location.origin}${window.location.pathname}?room=${roomId}`,
      });
    } else {
      copyRoomLink();
    }
  };

  if (!roomId || !userName) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Real-Time Collaborative Editor
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Code together in real-time. Share the link and collaborate instantly. Works on Netlify! 🚀
        </motion.p>

        <div className={styles.roomControls}>
          <div className={styles.roomInfo}>
            <PeopleIcon fontSize="small" />
            <span>Room: {roomId}</span>
          </div>
          <div className={styles.userInput}>
            <label>Your name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                const newName = e.target.value;
                setUserName(newName);
                localStorage.setItem("collab-user-name", newName);
              }}
              placeholder="Enter your name"
            />
          </div>
          <div className={styles.languageSelect}>
            <label>Language:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="kotlin">Kotlin</option>
            </select>
          </div>
          <button onClick={shareRoom} className={styles.shareButton}>
            {copied ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
            {copied ? "Copied!" : "Share Room"}
          </button>
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.editorContainer}>
          <CollaborativeEditor
            roomId={roomId}
            userName={userName}
            language={language}
            initialCode={`// Welcome to collaborative coding! 🎉
// Share this room link with your friend to code together in real-time.
// You'll see each other's changes instantly via Firebase Firestore.

function greet(name: string) {
  return \`Hello, \${name}! 👋\`;
}

console.log(greet("${userName}"));
console.log("Room ID: ${roomId}");

// Try editing this code - your friend will see it in real-time!
`}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
