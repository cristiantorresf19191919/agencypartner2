"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./CollaborativePage.module.css";

const CollaborativeEditor = dynamic(
  () => import("@/components/CollaborativeEditor/CollaborativeEditor"),
  { ssr: false }
);

function CollaborativePageContent() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [codeLang, setCodeLang] = useState("typescript");

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
        title: t("collab-share-title"),
        text: t("collab-share-text"),
        url: `${window.location.origin}${window.location.pathname}?room=${roomId}`,
      });
    } else {
      copyRoomLink();
    }
  };

  if (!roomId || !userName) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <Skeleton width={200} height={24} />
          <Skeleton width={300} height={16} />
        </div>
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
          {t("collab-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("collab-subtitle")}
        </motion.p>

        <div className={styles.roomControls}>
          <div className={styles.roomInfo}>
            <PeopleIcon fontSize="small" />
            <span>{t("collab-room")}: {roomId}</span>
          </div>
          <div className={styles.userInput}>
            <label>{t("collab-your-name")}:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                const newName = e.target.value;
                setUserName(newName);
                localStorage.setItem("collab-user-name", newName);
              }}
              placeholder={t("collab-enter-name")}
            />
          </div>
          <div className={styles.languageSelect}>
            <label>{t("collab-language")}:</label>
            <select value={codeLang} onChange={(e) => setCodeLang(e.target.value)}>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="kotlin">Kotlin</option>
            </select>
          </div>
          <button onClick={shareRoom} className={styles.shareButton}>
            {copied ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
            {copied ? t("collab-copied") : t("collab-share-room")}
          </button>
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.editorContainer}>
          <CollaborativeEditor
            roomId={roomId}
            userName={userName}
            language={codeLang}
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

export default function CollaborativePage() {
  return (
    <Suspense fallback={
      <main className={styles.page}>
        <div className={styles.loading}>
          <Skeleton width={200} height={24} />
          <Skeleton width={300} height={16} />
        </div>
      </main>
    }>
      <CollaborativePageContent />
    </Suspense>
  );
}
