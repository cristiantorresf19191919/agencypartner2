"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./SearchSection.module.css";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchPath = createLocalizedPath(`/developer-section/search?q=${encodeURIComponent(query.trim())}`);
      router.push(searchPath);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className={styles.searchSection}>
      <div className={styles.searchSectionContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div
            className={`${styles.searchContainer} ${isFocused ? styles.focused : ""}`}
          >
            <div className={styles.searchIconWrapper}>
              <SearchIcon className={styles.searchIcon} />
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={t("search-placeholder") || "Search blog posts, patterns, concepts..."}
                className={styles.searchInput}
                autoComplete="off"
              />
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearButton}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </motion.button>
              )}
            </div>

            {/* Subtle glow effect */}
            <div className={styles.glow} />
          </div>
        </form>
      </div>
    </section>
  );
}

