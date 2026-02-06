"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Search as SearchIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
  Extension as ExtensionIcon,
  Settings as HookIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { getSearchIndex, searchItems, type SearchItem } from "@/lib/searchIndex";
import { normalizeColorForMUI } from "@/lib/utils";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import SearchBar from "@/components/Search/SearchBar";
import styles from "./SearchResults.module.css";

const sectionIcons: Record<string, React.ReactNode> = {
  "react-patterns-title": <ExtensionIcon sx={{ fontSize: 20 }} />,
  "design-patterns-title": <CodeIcon sx={{ fontSize: 20 }} />,
  "solid-title": <CategoryIcon sx={{ fontSize: 20 }} />,
  "Advanced React Hooks": <HookIcon sx={{ fontSize: 20 }} />,
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [searchQuery, setSearchQuery] = useState(query);

  const searchIndex = useMemo(() => getSearchIndex(t), [t]);
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return searchItems(searchIndex, searchQuery);
  }, [searchIndex, searchQuery]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);


  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    results.forEach((item) => {
      if (!groups[item.sectionKey]) {
        groups[item.sectionKey] = [];
      }
      groups[item.sectionKey].push(item);
    });
    return groups;
  }, [results]);

  return (
    <BlogContentLayout>
      <div className={styles.searchPage}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.searchHeader}
        >
          <Typography
            variant="h1"
            className={styles.pageTitle}
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #a06af9 0%, #35E4B2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 3,
            }}
          >
            {t("search-docs-title")}
          </Typography>

          <Box className={styles.searchBarContainer}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
              <SearchBar />
            </div>
          </Box>

          {query && (
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.95rem",
              }}
            >
              {results.length > 0
                ? t("search-found-results").replace("{count}", String(results.length)).replace("{query}", query)
                : t("search-no-results-for").replace("{query}", query)}
            </Typography>
          )}
        </motion.div>

        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.emptyState}
          >
            <SearchIcon
              sx={{
                fontSize: 80,
                color: "rgba(160, 106, 249, 0.3)",
                mb: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: 1,
                fontWeight: 500,
              }}
            >
              {t("search-empty-prompt")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {t("search-empty-hint")}
            </Typography>
          </motion.div>
        )}

        {query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.emptyState}
          >
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: 2,
              }}
            >
              {t("search-no-results")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {t("search-try-different")}
            </Typography>
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={styles.resultsContainer}
          >
            {Object.entries(groupedResults).map(([sectionKey, items], groupIdx) => (
              <motion.div
                key={sectionKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIdx * 0.1 }}
                className={styles.sectionGroup}
              >
                <Box className={styles.sectionHeader}>
                  {sectionIcons[sectionKey]}
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 1.5,
                      fontWeight: 600,
                      color: "#ffffff",
                      fontSize: "1.1rem",
                    }}
                  >
                    {items[0]?.section || sectionKey}
                  </Typography>
                  <Chip
                    label={items.length}
                    size="small"
                    sx={{
                      ml: "auto",
                      bgcolor: alpha("#a06af9", 0.2),
                      color: "#a06af9",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <div className={styles.resultsGrid}>
                  {items.map((item, idx) => {
                    const normalizedColor = normalizeColorForMUI(item.color);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (groupIdx * 0.1) + (idx * 0.05) }}
                      >
                        <Link
                          href={createLocalizedPath(item.href)}
                          style={{ textDecoration: "none" }}
                        >
                          <Card
                            className={styles.resultCard}
                            sx={{
                              bgcolor: alpha("#1a1a2e", 0.6),
                              border: `1px solid ${alpha(normalizedColor, 0.3)}`,
                              backdropFilter: "blur(10px)",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                borderColor: normalizedColor,
                                bgcolor: alpha("#1a1a2e", 0.8),
                                boxShadow: `0 8px 24px ${alpha(normalizedColor, 0.3)}`,
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: normalizedColor,
                                    mr: 1.5,
                                    boxShadow: `0 0 8px ${alpha(normalizedColor, 0.5)}`,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#ffffff",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                  fontSize: "0.85rem",
                                  mt: 1,
                                }}
                              >
                                {item.section}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </BlogContentLayout>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <BlogContentLayout>
        <div className={styles.searchPage}>
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Loading...
          </div>
        </div>
      </BlogContentLayout>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}

