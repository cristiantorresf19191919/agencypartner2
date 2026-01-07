"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { useLocale } from "@/lib/useLocale";
import styles from "./SearchSection.module.css";

export default function SearchSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { createLocalizedPath } = useLocale();

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
      setIsExpanded(false);
      setQuery("");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!query) {
      setIsFocused(false);
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (!query) {
          setIsExpanded(false);
          setIsFocused(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, query]);

  return (
    <section className={styles.searchSection}>
      <div className={styles.searchSectionContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <motion.div
            className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ""} ${isFocused ? styles.focused : ""}`}
            initial={false}
            animate={{
              width: isExpanded ? "100%" : "64px",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <motion.div
              className={styles.searchIconWrapper}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isExpanded) {
                  setIsExpanded(true);
                  setIsFocused(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
            >
              <SearchIcon className={styles.searchIcon} />
            </motion.div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className={styles.inputWrapper}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Search patterns, concepts, principles..."
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Elegant glow effect */}
            <div className={styles.glow} />
          </motion.div>
        </form>
      </div>
    </section>
  );
}

