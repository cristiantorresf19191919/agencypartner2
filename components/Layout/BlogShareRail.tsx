"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Code as CodeIcon,
  ArrowUpward as ArrowUpIcon,
} from "@mui/icons-material";
import { setPendingCode, playgroundPathForLanguage } from "@/lib/playgroundHandoff";
import styles from "./BlogShareRail.module.css";

const BOOKMARK_STORAGE_KEY = "blog-bookmarks-v1";

function readBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function writeBookmarks(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // storage full / disabled — silent
  }
}

interface Props {
  /** Slug used to mark a bookmark; usually the path's last segment. */
  slug: string;
  /** Title used when sharing. */
  title?: string;
}

/**
 * Sticky vertical rail of share/bookmark/lift-to-playground actions. Fades in
 * after the user scrolls past 200 px. Hidden on phones to save room.
 */
export function BlogShareRail({ slug, title }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const tailoredTitle = useRef<string>("");

  useEffect(() => {
    setBookmarked(readBookmarks().has(slug));
    tailoredTitle.current = title || (typeof document !== "undefined" ? document.title : "");
    const onScroll = () => setVisible((window.scrollY || 0) > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, title]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleBookmark = useCallback(() => {
    const set = readBookmarks();
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    writeBookmarks(set);
    setBookmarked(set.has(slug));
  }, [slug]);

  const shareTwitter = useCallback(() => {
    const text = encodeURIComponent(tailoredTitle.current);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, []);

  const shareLinkedIn = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, []);

  const sendSelectionToPlayground = useCallback(() => {
    const sel = typeof window !== "undefined" ? window.getSelection?.()?.toString() : "";
    if (!sel || sel.trim().length < 4) {
      // No selection — surface a hint for next time.
      const note = document.createElement("div");
      note.textContent = "Select some code first, then click again.";
      note.className = styles.toast;
      document.body.appendChild(note);
      setTimeout(() => note.remove(), 2200);
      return;
    }
    // Best-effort language guess: if it looks Kotlin-ish, route there.
    const isKotlin = /\b(fun|val|var|suspend|coroutineScope)\b/.test(sel);
    setPendingCode({
      language: isKotlin ? "kotlin" : "typescript",
      code: sel,
    });
    const path = playgroundPathForLanguage(isKotlin ? "kotlin" : "typescript");
    const localePrefix = window.location.pathname.split("/")[1] || "es";
    const isLocale = /^(en|es)$/.test(localePrefix);
    window.location.href = `${isLocale ? "/" + localePrefix : ""}${path}`;
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <nav
      className={styles.rail}
      data-visible={visible ? "true" : "false"}
      aria-label="Share and bookmark"
    >
      <button
        type="button"
        className={styles.btn}
        onClick={copyLink}
        title={copied ? "Copied!" : "Copy link"}
        aria-label={copied ? "Copied!" : "Copy link"}
      >
        {copied ? <CheckIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={shareTwitter}
        title="Share on X / Twitter"
        aria-label="Share on Twitter"
      >
        <TwitterIcon fontSize="small" />
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={shareLinkedIn}
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon fontSize="small" />
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={sendSelectionToPlayground}
        title="Send selected code to the playground"
        aria-label="Send selected code to the playground"
      >
        <CodeIcon fontSize="small" />
      </button>
      <button
        type="button"
        className={`${styles.btn} ${bookmarked ? styles.btnActive : ""}`}
        onClick={toggleBookmark}
        title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
        aria-pressed={bookmarked}
      >
        {bookmarked ? <BookmarkFilledIcon fontSize="small" /> : <BookmarkIcon fontSize="small" />}
      </button>
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={styles.btn}
        onClick={scrollTop}
        title="Back to top"
        aria-label="Back to top"
      >
        <ArrowUpIcon fontSize="small" />
      </button>
    </nav>
  );
}

export default BlogShareRail;
