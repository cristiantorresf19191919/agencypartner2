"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AutoAwesome as SparklesIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  BoltRounded as BoltIcon,
  ContentCopyRounded as CopyIcon,
  CheckRounded as CheckIcon,
} from "@mui/icons-material";
import type { MLConnectionSpec } from "@/lib/mmlTypes";
import { MathContent } from "../MathContent";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "../MathML.module.css";

interface Props {
  spec: MLConnectionSpec;
}

function pick<T>(lang: string, es: T | undefined, en: T): T {
  return lang === "es" && es !== undefined ? es : en;
}

export function MLConnectionPanel({ spec }: Props) {
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const technique = pick(lang, spec.techniqueEs, spec.technique);
  const summary = pick(lang, spec.summaryEs, spec.summary);
  const ifRemoved = pick(lang, spec.ifRemovedEs, spec.ifRemoved);
  const codeLang = spec.codeLanguage ?? "python";

  const header =
    lang === "es" ? "¿Por qué importa en ML?" : "Why this matters in ML";
  const expand = lang === "es" ? "Expandir" : "Expand";
  const collapse = lang === "es" ? "Contraer" : "Collapse";
  const ifRemovedLabel =
    lang === "es" ? "Si esto no existiera…" : "If this didn't exist…";

  const handleCopy = async () => {
    if (!spec.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(spec.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // copy failed silently
    }
  };

  return (
    <section className={styles.mlConn}>
      <button
        type="button"
        className={styles.mlConnHead}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className={styles.mlConnIcon}>
          <SparklesIcon fontSize="small" />
        </div>
        <div className={styles.mlConnHeadText}>
          <span className={styles.mlConnTag}>
            {lang === "es" ? "Conexión con ML" : "ML connection"}
          </span>
          <div className={styles.mlConnTitle}>{header}</div>
          <div className={styles.mlConnTechnique}>{technique}</div>
        </div>
        <span className={styles.mlConnToggle}>
          <span>{open ? collapse : expand}</span>
          <ExpandMoreIcon
            className={`${styles.mlConnChevron} ${open ? styles.mlConnChevronOpen : ""}`}
            fontSize="small"
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.mlConnBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.mlConnInner}>
              <MathContent
                text={summary}
                as="p"
                className={styles.mlConnSummary}
              />
              {spec.codeSnippet && (
                <div className={styles.mlConnCode}>
                  <div className={styles.mlConnCodeHead}>
                    <CodeIcon fontSize="small" />
                    <span className={styles.mlConnCodeLang}>{codeLang}</span>
                    <button
                      type="button"
                      className={styles.mlConnCopyBtn}
                      onClick={handleCopy}
                      aria-label={
                        lang === "es" ? "Copiar código" : "Copy code"
                      }
                    >
                      {copied ? (
                        <>
                          <CheckIcon fontSize="small" />
                          {lang === "es" ? "Copiado" : "Copied"}
                        </>
                      ) : (
                        <>
                          <CopyIcon fontSize="small" />
                          {lang === "es" ? "Copiar" : "Copy"}
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={styles.mlConnCodeBody}>
                    <code>{spec.codeSnippet}</code>
                  </pre>
                </div>
              )}
              {ifRemoved && (
                <div className={styles.mlConnIfRemoved}>
                  <BoltIcon fontSize="small" />
                  <div>
                    <div className={styles.mlConnIfRemovedLabel}>
                      {ifRemovedLabel}
                    </div>
                    <MathContent text={ifRemoved} as="div" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default MLConnectionPanel;
