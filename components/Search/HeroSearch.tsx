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
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { useNavigationLoader } from "@/contexts/NavigationLoaderContext";
import { useCommandPalette } from "@/contexts/CommandPaletteContext";
import { getSearchIndex, searchItems, type SearchItem } from "@/lib/searchIndex";
import styles from "./HeroSearch.module.css";

interface GroupedResults {
  [key: string]: SearchItem[];
}

const sectionIcons: Record<string, React.ReactNode> = {
  "react-course": <CourseIcon sx={{ fontSize: 16 }} />,
  "kotlin-course": <CourseIcon sx={{ fontSize: 16 }} />,
  "css-course": <CourseIcon sx={{ fontSize: 16 }} />,
  "typescript-course": <CourseIcon sx={{ fontSize: 16 }} />,
  "challenges": <ChallengeIcon sx={{ fontSize: 16 }} />,
  "blog": <BlogIcon sx={{ fontSize: 16 }} />,
  "patterns": <PatternIcon sx={{ fontSize: 16 }} />,
  "default": <SearchIcon sx={{ fontSize: 16 }} />,
};

const sectionColors: Record<string, string> = {
  "react-course": "#61DAFB",
  "kotlin-course": "#A97BFF",
  "css-course": "#38BDF8",
  "typescript-course": "#3178C6",
  "challenges": "#F472B6",
  "blog": "#34D399",
  "patterns": "#FBBF24",
  "default": "#a06af9",
};

const popularSearches = [
  "React", "Kotlin", "TypeScript", "CSS", "Hooks", "Patterns",
];

export default function HeroSearch() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const { showLoader } = useNavigationLoader();
  const { recentSearches, addRecentSearch } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => getSearchIndex(t), [t]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchItems(searchIndex, query).slice(0, 12);
  }, [searchIndex, query]);

  const groupedResults = useMemo<GroupedResults>(() => {
    const groups: GroupedResults = {};
    results.forEach((item) => {
      const key = item.sectionKey || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [results]);

  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  const showDropdown = isFocused && (query.trim().length > 0 || recentSearches.length > 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (dropdownRef.current && selectedIndex >= 0) {
      const el = dropdownRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const handleNavigate = useCallback((href: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    showLoader();
    const localizedPath = createLocalizedPath(href);
    window.location.href = localizedPath;
    setIsFocused(false);
  }, [query, addRecentSearch, createLocalizedPath, showLoader]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const total = flatResults.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, total));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && flatResults[selectedIndex]) {
          handleNavigate(flatResults[selectedIndex].href);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  }, [flatResults, selectedIndex, handleNavigate]);

  const handlePopularClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  let itemIndex = 0;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {/* Search Input */}
      <motion.div
        className={`${styles.searchContainer} ${isFocused ? styles.focused : ""}`}
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <SearchIcon className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("hero-search-placeholder") || "Search courses, articles, challenges..."}
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
            aria-label="Clear"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        )}
        <div className={styles.shortcutHint}>
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </div>
      </motion.div>

      {/* Popular searches (shown when not focused) */}
      <AnimatePresence>
        {!isFocused && (
          <motion.div
            className={styles.popularTags}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <TrendingIcon sx={{ fontSize: 14 }} className={styles.trendingIcon} />
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                className={styles.popularTag}
                onClick={() => handlePopularClick(term)}
              >
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={styles.dropdown}
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Recent searches when no query */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <HistoryIcon sx={{ fontSize: 14 }} />
                  <span>{t("command-palette-recent") || "Recent"}</span>
                </div>
                {recentSearches.slice(0, 4).map((recent, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.recentItem}
                    onClick={() => handleRecentClick(recent)}
                  >
                    <HistoryIcon sx={{ fontSize: 14, opacity: 0.4 }} />
                    <span>{recent}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query.trim() && results.length === 0 && (
              <div className={styles.emptyState}>
                <p>{t("command-palette-no-results") || "No results found"}</p>
                <span>{t("command-palette-try-different") || "Try a different search term"}</span>
              </div>
            )}

            {/* Grouped results */}
            {Object.entries(groupedResults).map(([sectionKey, items]) => {
              const color = sectionColors[sectionKey] || sectionColors.default;
              return (
                <div key={sectionKey} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionDot} style={{ backgroundColor: color }} />
                    <span>{items[0]?.section || sectionKey}</span>
                    <span className={styles.sectionCount}>{items.length}</span>
                  </div>
                  {items.map((item) => {
                    const currentIndex = itemIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={currentIndex}
                        className={`${styles.resultItem} ${isSelected ? styles.selected : ""}`}
                        onClick={() => handleNavigate(item.href)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <span className={styles.resultIcon}>
                          {sectionIcons[sectionKey] || sectionIcons.default}
                        </span>
                        <span className={styles.resultTitle}>{item.title}</span>
                        {isSelected && (
                          <span className={styles.enterBadge}>
                            <EnterIcon sx={{ fontSize: 12 }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Footer hint */}
            {results.length > 0 && (
              <div className={styles.dropdownFooter}>
                <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span>
                <span><kbd>Enter</kbd> go</span>
                <span><kbd>Esc</kbd> close</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
