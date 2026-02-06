"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  School as CourseIcon,
  Article as BlogIcon,
  Code as ChallengeIcon,
  Extension as PatternIcon,
  KeyboardReturn as EnterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { useCommandPalette } from "@/contexts/CommandPaletteContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { getSearchIndex, searchItems, type SearchItem } from "@/lib/searchIndex";
import styles from "./CommandPalette.module.css";

interface GroupedResults {
  [key: string]: SearchItem[];
}

const sectionIcons: Record<string, React.ReactNode> = {
  "react-course": <CourseIcon sx={{ fontSize: 18 }} />,
  "kotlin-course": <CourseIcon sx={{ fontSize: 18 }} />,
  "css-course": <CourseIcon sx={{ fontSize: 18 }} />,
  "challenges": <ChallengeIcon sx={{ fontSize: 18 }} />,
  "blog": <BlogIcon sx={{ fontSize: 18 }} />,
  "patterns": <PatternIcon sx={{ fontSize: 18 }} />,
  "default": <SearchIcon sx={{ fontSize: 18 }} />,
};

const sectionColors: Record<string, string> = {
  "react-course": "#61DAFB",
  "kotlin-course": "#A97BFF",
  "css-course": "#38BDF8",
  "challenges": "#F472B6",
  "blog": "#34D399",
  "patterns": "#FBBF24",
  "default": "#a06af9",
};

export default function CommandPalette() {
  const { isOpen, close, recentSearches, addRecentSearch, clearRecentSearches } = useCommandPalette();
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => getSearchIndex(t), [t]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchItems(searchIndex, query);
  }, [searchIndex, query]);

  // Group results by section
  const groupedResults = useMemo<GroupedResults>(() => {
    const groups: GroupedResults = {};
    results.forEach((item) => {
      const key = item.sectionKey || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [results]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && flatResults.length > 0) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex, flatResults]);

  const handleNavigate = useCallback((href: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    const localizedPath = createLocalizedPath(href);
    window.location.href = localizedPath;
    close();
  }, [query, addRecentSearch, createLocalizedPath, close]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalResults = flatResults.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalResults) % Math.max(1, totalResults));
        break;
      case "Enter":
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          handleNavigate(flatResults[selectedIndex].href);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  }, [flatResults, selectedIndex, handleNavigate, close]);

  const handleRecentClick = useCallback((recent: string) => {
    setQuery(recent);
    inputRef.current?.focus();
  }, []);

  if (!isOpen) return null;

  let itemIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={t("command-palette-label") || "Search"}
          >
            {/* Search Input */}
            <div className={styles.inputWrapper}>
              <SearchIcon className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("command-palette-placeholder") || "Search courses, blog, challenges..."}
                className={styles.input}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className={styles.clearButton}
                  aria-label="Clear search"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </button>
              )}
            </div>

            {/* Results */}
            <div className={styles.results} ref={resultsRef}>
              {/* Recent Searches (when no query) */}
              {!query && recentSearches.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <HistoryIcon sx={{ fontSize: 16 }} />
                    <span>{t("command-palette-recent") || "Recent"}</span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className={styles.clearRecent}
                    >
                      {t("command-palette-clear") || "Clear"}
                    </button>
                  </div>
                  {recentSearches.map((recent, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.recentItem}
                      onClick={() => handleRecentClick(recent)}
                    >
                      <HistoryIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                      <span>{recent}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No query, no recent */}
              {!query && recentSearches.length === 0 && (
                <div className={styles.emptyState}>
                  <SearchIcon sx={{ fontSize: 48, opacity: 0.2 }} />
                  <p>{t("command-palette-hint") || "Type to search across all content"}</p>
                </div>
              )}

              {/* No results */}
              {query && results.length === 0 && (
                <div className={styles.emptyState}>
                  <p>{t("command-palette-no-results") || "No results found"}</p>
                  <span>{t("command-palette-try-different") || "Try a different search term"}</span>
                </div>
              )}

              {/* Grouped Results */}
              {Object.entries(groupedResults).map(([sectionKey, items]) => (
                <div key={sectionKey} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    {sectionIcons[sectionKey] || sectionIcons.default}
                    <span>{items[0]?.section || sectionKey}</span>
                    <span className={styles.sectionCount}>{items.length}</span>
                  </div>
                  {items.map((item) => {
                    const currentIndex = itemIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    const color = sectionColors[sectionKey] || item.color || sectionColors.default;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={currentIndex}
                        className={`${styles.resultItem} ${isSelected ? styles.selected : ""}`}
                        onClick={() => handleNavigate(item.href)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <span
                          className={styles.resultDot}
                          style={{ backgroundColor: color }}
                        />
                        <span className={styles.resultTitle}>{item.title}</span>
                        {isSelected && (
                          <span className={styles.enterHint}>
                            <EnterIcon sx={{ fontSize: 14 }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer with keyboard hints */}
            <div className={styles.footer}>
              <div className={styles.keyboardHints}>
                <span className={styles.hint}>
                  <kbd><ArrowUpIcon sx={{ fontSize: 12 }} /></kbd>
                  <kbd><ArrowDownIcon sx={{ fontSize: 12 }} /></kbd>
                  <span>{t("command-palette-navigate") || "Navigate"}</span>
                </span>
                <span className={styles.hint}>
                  <kbd>Enter</kbd>
                  <span>{t("command-palette-select") || "Select"}</span>
                </span>
                <span className={styles.hint}>
                  <kbd>Esc</kbd>
                  <span>{t("command-palette-close") || "Close"}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
