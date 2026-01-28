"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  RestartAlt as ResetIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAndroidLessonById } from "@/lib/androidKotlinData";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading Kotlin editor…</p>
    </div>
  ),
});

export default function AndroidKotlinLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getAndroidLessonById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const uri = `file:///android-lesson.kt`;

  useEffect(() => {
    if (lesson) {
      setCode(lesson.code);
    }
  }, [lesson?.id]);

  const resetToStarter = useCallback(() => {
    if (lesson) {
      setCode(lesson.code);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(lesson.code);
      }
    }
  }, [lesson, uri]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      formatOnPaste: true,
      formatOnType: true,
      suggest: {
        preview: true,
        showWords: true,
      },
      quickSuggestions: true,
      readOnly: false,
    }),
    []
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    
    // Configure Kotlin language support
    // Monaco doesn't have built-in Kotlin support, but we can configure it
    // to use similar syntax highlighting and disable validation
    monaco.languages.register({ id: "kotlin" });
    
    // Set up Kotlin-like editor configuration
    // We'll use TypeScript-like settings for better autocomplete experience
    // Note: Full Kotlin language server would require additional setup
    monaco.languages.setLanguageConfiguration("kotlin", {
      comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });

    // Define Kotlin keywords and common Android/Compose terms for autocomplete
    monaco.languages.setMonarchTokensProvider("kotlin", {
      keywords: [
        "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
        "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
        "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
        "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
        "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
        "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
        "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while"
      ],
      typeKeywords: [
        "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing"
      ],
      operators: [
        "+", "-", "*", "/", "%", "=", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "!", "++", "--",
        "+=", "-=", "*=", "/=", "%=", "?.", "?:", "!!", "as?", "is", "!is", "in", "!in"
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, {
            cases: {
              "@keywords": "keyword",
              "@typeKeywords": "type",
              "@default": "identifier"
            }
          }],
          [/[A-Z][\w\$]*/, "type.identifier"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/'/, { token: "string.quote", bracket: "@open", next: "@stringSingle" }],
          [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
          [/0[xX][0-9a-fA-F]+[Ll]?/, "number.hex"],
          [/0[0-7]+[Ll]?/, "number.octal"],
          [/\d+[lL]?/, "number"],
          [/[;,.]/, "delimiter"],
          [/[{}()\[\]]/, "@brackets"],
          [/@symbols/, {
            cases: {
              "@operators": "operator",
              "@default": ""
            }
          }],
          [/\/\*/, "comment", "@comment"],
          [/\/\/.*$/, "comment"],
        ],
        comment: [
          [/[^/*]+/, "comment"],
          [/\/\*/, "comment", "@push"],
          ["\\*/", "comment", "@pop"],
          [/[/*]/, "comment"]
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape.invalid"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
        ],
        stringSingle: [
          [/[^\\']+/, "string"],
          [/\\./, "string.escape.invalid"],
          [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }]
        ]
      }
    });

    // Add Android/Compose autocomplete suggestions
    const androidComposeSuggestions = [
      // Compose basics
      { label: "@Composable", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@Composable\n" },
      { label: "remember", kind: monaco.languages.CompletionItemKind.Function, insertText: "remember { $0 }" },
      { label: "mutableStateOf", kind: monaco.languages.CompletionItemKind.Function, insertText: "mutableStateOf($0)" },
      { label: "mutableIntStateOf", kind: monaco.languages.CompletionItemKind.Function, insertText: "mutableIntStateOf($0)" },
      { label: "LaunchedEffect", kind: monaco.languages.CompletionItemKind.Function, insertText: "LaunchedEffect($0) { $1 }" },
      { label: "rememberCoroutineScope", kind: monaco.languages.CompletionItemKind.Function, insertText: "rememberCoroutineScope()" },
      
      // Layouts
      { label: "Column", kind: monaco.languages.CompletionItemKind.Function, insertText: "Column($0) { $1 }" },
      { label: "Row", kind: monaco.languages.CompletionItemKind.Function, insertText: "Row($0) { $1 }" },
      { label: "Box", kind: monaco.languages.CompletionItemKind.Function, insertText: "Box($0) { $1 }" },
      { label: "LazyColumn", kind: monaco.languages.CompletionItemKind.Function, insertText: "LazyColumn($0) { $1 }" },
      { label: "LazyRow", kind: monaco.languages.CompletionItemKind.Function, insertText: "LazyRow($0) { $1 }" },
      
      // Material3
      { label: "Text", kind: monaco.languages.CompletionItemKind.Function, insertText: "Text(text = \"$0\")" },
      { label: "Button", kind: monaco.languages.CompletionItemKind.Function, insertText: "Button(onClick = { $0 }) { $1 }" },
      { label: "TextField", kind: monaco.languages.CompletionItemKind.Function, insertText: "TextField(value = $0, onValueChange = { $1 })" },
      { label: "CircularProgressIndicator", kind: monaco.languages.CompletionItemKind.Function, insertText: "CircularProgressIndicator()" },
      
      // Modifiers
      { label: "Modifier", kind: monaco.languages.CompletionItemKind.Class, insertText: "Modifier" },
      { label: "padding", kind: monaco.languages.CompletionItemKind.Method, insertText: ".padding($0)" },
      { label: "fillMaxWidth", kind: monaco.languages.CompletionItemKind.Method, insertText: ".fillMaxWidth()" },
      { label: "background", kind: monaco.languages.CompletionItemKind.Method, insertText: ".background($0)" },
      { label: "size", kind: monaco.languages.CompletionItemKind.Method, insertText: ".size($0)" },
      
      // ViewModel & Flow
      { label: "ViewModel", kind: monaco.languages.CompletionItemKind.Class, insertText: "ViewModel" },
      { label: "MutableStateFlow", kind: monaco.languages.CompletionItemKind.Class, insertText: "MutableStateFlow($0)" },
      { label: "StateFlow", kind: monaco.languages.CompletionItemKind.Class, insertText: "StateFlow" },
      { label: "asStateFlow", kind: monaco.languages.CompletionItemKind.Method, insertText: ".asStateFlow()" },
      { label: "collectAsStateWithLifecycle", kind: monaco.languages.CompletionItemKind.Method, insertText: ".collectAsStateWithLifecycle()" },
      
      // Navigation
      { label: "NavHost", kind: monaco.languages.CompletionItemKind.Function, insertText: "NavHost(navController = $0, startDestination = \"$1\") { $2 }" },
      { label: "rememberNavController", kind: monaco.languages.CompletionItemKind.Function, insertText: "rememberNavController()" },
      { label: "composable", kind: monaco.languages.CompletionItemKind.Function, insertText: "composable(\"$0\") { $1 }" },
      
      // Coroutines
      { label: "flow", kind: monaco.languages.CompletionItemKind.Function, insertText: "flow { $0 }" },
      { label: "emit", kind: monaco.languages.CompletionItemKind.Function, insertText: "emit($0)" },
      { label: "delay", kind: monaco.languages.CompletionItemKind.Function, insertText: "delay($0)" },
      { label: "launch", kind: monaco.languages.CompletionItemKind.Function, insertText: "launch { $0 }" },
      
      // Hilt
      { label: "@HiltViewModel", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@HiltViewModel\n" },
      { label: "@Inject", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@Inject\n" },
      { label: "@AndroidEntryPoint", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@AndroidEntryPoint\n" },
      
      // Retrofit
      { label: "@GET", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@GET(\"$0\")" },
      { label: "@POST", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "@POST(\"$0\")" },
      { label: "suspend", kind: monaco.languages.CompletionItemKind.Keyword, insertText: "suspend " },
    ];

    monaco.languages.registerCompletionItemProvider("kotlin", {
      provideCompletionItems: () => {
        return {
          suggestions: androidComposeSuggestions.map(s => ({
            ...s,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          })),
        };
      },
    });
  };

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <a href={createLocalizedPath("/developer-section/android-kotlin")}>Back to levels</a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          {/* Left: description */}
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                Level {lesson.level}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{lesson.title}</h1>
            <div className={playStyles.descBody}>
              <p style={{ marginBottom: "12px", color: "#7cf4ff", fontWeight: 600 }}>
                {lesson.concept}
              </p>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>{lesson.description}</p>

              <h4 className={playStyles.descSub} style={{ marginTop: "24px" }}>
                📚 Explanation
              </h4>
              <p style={{ fontSize: "14px", color: "#c6d5ff", lineHeight: "1.6" }}>
                {lesson.explanation}
              </p>
            </div>
          </div>

          {/* Right: editor */}
          <div className={playStyles.editorColumn}>
            <div className={playStyles.editorWrap} style={{ height: "600px" }}>
              <div className={playStyles.toolbar} style={{ marginBottom: "8px" }}>
                <div className={playStyles.toolbarLeft}>
                  <div className={playStyles.statusDot} />
                  <span className={playStyles.toolbarLabel}>Kotlin · Monaco Editor with autocomplete</span>
                </div>
                <button className={playStyles.iconBtn} onClick={resetToStarter}>
                  <ResetIcon fontSize="small" /> Reset
                </button>
              </div>
              <MonacoEditor
                height="calc(100% - 50px)"
                language="kotlin"
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.outputPanel} style={{ marginTop: "16px" }}>
              <div className={playStyles.outputHead}>
                <CodeIcon fontSize="small" /> Code Editor
              </div>
              <p className={playStyles.emptyLog}>
                Edit the Kotlin code above. The editor supports syntax highlighting, autocomplete, and formatting.
                <br />
                <span style={{ fontSize: "12px", color: "#7cf4ff" }}>
                  Note: Code execution is not available for Android code in the browser.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/android-kotlin")}>
            Back to Android Levels
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
