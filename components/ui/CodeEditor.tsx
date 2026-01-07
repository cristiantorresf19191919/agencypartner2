"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(
  () => import("react-simple-code-editor"),
  { 
    ssr: false,
    loading: () => null
  }
);

// Dynamically import PrismJS only on client side to avoid SSR issues
let prismLoaded = false;
let prismHighlight: any = null;
let prismLanguages: any = null;

const loadPrism = async () => {
  if (typeof window === "undefined") return; // Only run on client
  if (prismLoaded) return;
  
  try {
    // Import in correct order - core first, then dependencies, then languages
    const prismCore = await import("prismjs/components/prism-core");
    
    // Load dependencies first
    await import("prismjs/components/prism-clike");
    await import("prismjs/components/prism-markup");
    
    // Then load language-specific components
    await import("prismjs/components/prism-javascript");
    await import("prismjs/components/prism-typescript");
    await import("prismjs/components/prism-jsx");
    await import("prismjs/components/prism-tsx");
    await import("prismjs/components/prism-java");
    await import("prismjs/components/prism-css");
    
    // Load theme
    await import("prismjs/themes/prism-tomorrow.css");
    
    prismHighlight = prismCore.highlight;
    prismLanguages = prismCore.languages;
    prismLoaded = true;
  } catch (error) {
    console.error("Failed to load PrismJS:", error);
  }
};

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  height?: string | number;
  className?: string;
  defaultFullscreen?: boolean;
}

export function CodeEditor({
  code: initialCode,
  language = "tsx",
  onChange,
  readOnly = false,
  height = 400,
  className = "",
  defaultFullscreen = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isPrismReady, setIsPrismReady] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showCopied, setShowCopied] = useState(false);
  // Always start with false - fullscreen should only be triggered by user action
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isInternalUpdateRef = useRef(false);
  
  // Store original values for reset
  const originalCodeRef = useRef(initialCode);
  const originalFontSizeRef = useRef(14);

  // Sync code state with prop changes (only if not from internal update)
  useEffect(() => {
    if (!isInternalUpdateRef.current && initialCode !== code) {
      setCode(initialCode);
      originalCodeRef.current = initialCode; // Update original when prop changes
    }
    isInternalUpdateRef.current = false;
  }, [initialCode]);
  
  // Reset to original state
  const handleReset = useCallback(() => {
    isInternalUpdateRef.current = true;
    setCode(originalCodeRef.current);
    setFontSize(originalFontSizeRef.current);
    if (onChange) {
      onChange(originalCodeRef.current);
    }
  }, [onChange]);

  // Track mount state for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    loadPrism().then(() => {
      setIsPrismReady(true);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleValueChange = useCallback((newCode: string) => {
    isInternalUpdateRef.current = true;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  }, [onChange]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const highlightCode = useCallback((code: string) => {
    if (!isPrismReady || !prismHighlight || !prismLanguages) {
      return code;
    }

    try {
      // Kotlin is similar to Java, so use Java syntax highlighting
      const lang = language === "tsx" ? prismLanguages.tsx : 
                   language === "jsx" ? prismLanguages.jsx :
                   language === "typescript" ? prismLanguages.typescript :
                   language === "javascript" ? prismLanguages.javascript :
                   language === "kotlin" ? prismLanguages.java : // Use Java for Kotlin
                   language === "java" ? prismLanguages.java :
                   prismLanguages.markup;
      
      return prismHighlight(code, lang, language);
    } catch (e) {
      console.error("PrismJS highlighting error:", e);
      return code;
    }
  }, [isPrismReady, language]);

  const editorStyle: React.CSSProperties = useMemo(() => ({
    fontFamily: '"Fira Code", "Fira Mono", "Monaco", "Consolas", "Courier New", monospace',
    fontSize: `${fontSize}px`,
    lineHeight: 1.6,
    outline: 0,
    minHeight: isFullscreen ? "100vh" : (typeof height === "number" ? `${height}px` : height),
    height: isFullscreen ? "100vh" : "auto",
    width: isFullscreen ? "100vw" : "100%",
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
    padding: isFullscreen ? "24px" : "20px",
    borderBottomLeftRadius: isFullscreen ? "0" : "8px",
    borderBottomRightRadius: isFullscreen ? "0" : "8px",
    border: "none",
    borderTop: "none",
    overflow: "auto",
    boxSizing: "border-box",
  }), [fontSize, isFullscreen, height]);

  const renderEditorContent = () => {
    return (
      <>
        {/* Toolbar */}
        <div className={`flex items-center justify-between bg-[#161b22] border-b border-[#30363d] shrink-0 ${
          isFullscreen ? "px-6 py-4" : "px-4 py-3"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8b949e] font-mono uppercase tracking-wider font-medium">{language}</span>
          </div>
          <div className={`flex items-center gap-2 ${isFullscreen ? "pr-2" : ""}`}>
            {/* Font Size Controls */}
            <div className="flex items-center gap-1.5 bg-[#0d1117] rounded-lg border border-[#30363d] px-2 py-1">
              <button 
                onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                className="p-1.5 hover:bg-[#21262d] rounded-md text-[#8b949e] hover:text-[#c9d1d9] transition-all duration-200 active:scale-95"
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              <span className="text-xs text-[#c9d1d9] w-6 text-center font-semibold tabular-nums">{fontSize}</span>
              <button 
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="p-1.5 hover:bg-[#21262d] rounded-md text-[#8b949e] hover:text-[#c9d1d9] transition-all duration-200 active:scale-95"
                title="Increase font size"
                aria-label="Increase font size"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
            <div className="w-px h-5 bg-[#30363d] mx-1"></div>
            {/* Copy Button */}
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#21262d] rounded-md text-xs text-[#8b949e] hover:text-[#c9d1d9] transition-all duration-200 active:scale-95 border border-transparent hover:border-[#30363d]"
              title="Copy code to clipboard"
              aria-label="Copy code"
            >
              {showCopied ? (
                <>
                  <i className="fas fa-check text-[#3fb950]"></i>
                  <span className="text-[#3fb950] font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <i className="far fa-copy"></i>
                  <span>Copy</span>
                </>
              )}
            </button>
            <div className="w-px h-5 bg-[#30363d] mx-1"></div>
            {/* Reset Button */}
            <button 
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#21262d] rounded-md text-xs text-[#8b949e] hover:text-[#c9d1d9] transition-all duration-200 active:scale-95 border border-transparent hover:border-[#30363d]"
              title="Reset to original code and font size"
              aria-label="Reset editor"
            >
              <i className="fas fa-undo text-xs"></i>
              <span>Reset</span>
            </button>
            <div className="w-px h-5 bg-[#30363d] mx-1"></div>
            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#21262d] rounded-md text-xs text-[#8b949e] hover:text-[#c9d1d9] transition-all duration-200 active:scale-95 border border-transparent hover:border-[#30363d] ${
                isFullscreen ? "mr-0" : ""
              }`}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <>
                  <i className="fas fa-compress"></i>
                  <span>Exit</span>
                </>
              ) : (
                <>
                  <i className="fas fa-expand"></i>
                  <span>Maximize</span>
                </>
              )}
            </button>
          </div>
        </div>

        <style jsx global>{`
          .code-editor-wrapper {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .code-editor-wrapper pre {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .code-editor-textarea {
            caret-color: #58a6ff !important;
            outline: none !important;
            border: none !important;
            resize: none !important;
          }
          .code-editor-textarea:focus {
            outline: none !important;
            border: none !important;
          }
          .code-editor-wrapper .code-editor-pre {
            pointer-events: none !important;
            overflow: visible !important;
          }
          .code-editor-wrapper pre {
            scrollbar-width: thin;
            scrollbar-color: #30363d #0d1117;
          }
          .code-editor-wrapper pre::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          .code-editor-wrapper pre::-webkit-scrollbar-track {
            background: #0d1117;
          }
          .code-editor-wrapper pre::-webkit-scrollbar-thumb {
            background: #30363d;
            border-radius: 5px;
          }
          .code-editor-wrapper pre::-webkit-scrollbar-thumb:hover {
            background: #484f58;
          }
          .code-editor-wrapper .token.comment,
          .code-editor-wrapper .token.prolog,
          .code-editor-wrapper .token.doctype,
          .code-editor-wrapper .token.cdata {
            color: #8b949e;
            font-style: italic;
          }
          .code-editor-wrapper .token.punctuation {
            color: #c9d1d9;
          }
          .code-editor-wrapper .token.property,
          .code-editor-wrapper .token.tag,
          .code-editor-wrapper .token.boolean,
          .code-editor-wrapper .token.number,
          .code-editor-wrapper .token.constant,
          .code-editor-wrapper .token.symbol,
          .code-editor-wrapper .token.deleted {
            color: #79c0ff;
          }
          .code-editor-wrapper .token.selector,
          .code-editor-wrapper .token.attr-name,
          .code-editor-wrapper .token.string,
          .code-editor-wrapper .token.char,
          .code-editor-wrapper .token.builtin,
          .code-editor-wrapper .token.inserted {
            color: #a5d6ff;
          }
          .code-editor-wrapper .token.operator,
          .code-editor-wrapper .token.entity,
          .code-editor-wrapper .token.url,
          .code-editor-wrapper .language-css .token.string,
          .code-editor-wrapper .style .token.string {
            color: #ff7b72;
          }
          .code-editor-wrapper .token.atrule,
          .code-editor-wrapper .token.attr-value,
          .code-editor-wrapper .token.keyword {
            color: #ff7b72;
            font-weight: 500;
          }
          .code-editor-wrapper .token.function,
          .code-editor-wrapper .token.class-name {
            color: #d2a8ff;
          }
          .code-editor-wrapper .token.regex,
          .code-editor-wrapper .token.important,
          .code-editor-wrapper .token.variable {
            color: #ffa657;
          }
        `}</style>
        <div 
          className={`grow overflow-auto bg-[#0d1117] ${isFullscreen ? "" : ""}`}
          style={isFullscreen ? { 
            height: "calc(100vh - 64px)",
            width: "100vw"
          } : {}}
        >
          {isPrismReady ? (
            <Editor
              value={code}
              onValueChange={handleValueChange}
              highlight={highlightCode}
              padding={isFullscreen ? 24 : 16}
              style={editorStyle}
              readOnly={readOnly}
              tabSize={2}
              insertSpaces={true}
              ignoreTabKey={false}
              preClassName="code-editor-pre"
              textareaClassName="code-editor-textarea"
            />
          ) : (
            <div style={editorStyle}>
              <pre style={{ margin: 0, padding: 0, color: "#c9d1d9", lineHeight: 1.6 }}>
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Regular editor (non-fullscreen) */}
      {!isFullscreen && (
        <motion.div 
          layout
          className={`code-editor-wrapper overflow-hidden border border-[#30363d] shadow-2xl rounded-xl relative block w-full ${className}`}
          style={{ display: 'block', width: '100%', minWidth: 0 }}
          initial={false}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
        >
          {renderEditorContent()}
        </motion.div>
      )}

      {/* Fullscreen Modal using React Portal */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md"
                style={{ zIndex: 99999 }}
                onClick={() => setIsFullscreen(false)}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3
                }}
                className="fixed inset-0 flex flex-col overflow-hidden code-editor-wrapper"
                style={{ zIndex: 100000 }}
                onClick={(e) => e.stopPropagation()}
              >
                {renderEditorContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

