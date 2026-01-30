"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  Lightbulb as HintIcon,
  Visibility as SolutionIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
// @ts-ignore
import * as Babel from "@babel/standalone";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReactChallengeById } from "@/lib/reactChallengesData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

const MAX_ATTEMPTS = 10;
const STORAGE_KEY_PREFIX = "react-challenge-attempts-";

function getAttemptCount(challengeId: string): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${challengeId}`);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementAttemptCount(challengeId: string): number {
  if (typeof window === "undefined") return 0;
  const current = getAttemptCount(challengeId);
  const newCount = current + 1;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${challengeId}`, newCount.toString());
  return newCount;
}

function resetAttemptCount(challengeId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${challengeId}`);
}

export default function ReactChallengePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const challenge = getReactChallengeById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRunningPreview, setIsRunningPreview] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const uri = `file:///react-challenge.tsx`;

  useEffect(() => {
    if (challenge) {
      setCode(challenge.problemCode);
      setError(null);
      setSubmitResult(null);
      setShowSuccess(false);
      setShowSolution(false);
      setShowHints(false);
      setPreviewHtml("");
      setPreviewError(null);
      const count = getAttemptCount(challenge.id);
      setAttemptCount(count);
      if (count >= MAX_ATTEMPTS) {
        setShowSolution(true);
      }
    }
  }, [challenge?.id]);

  const resetToProblem = useCallback(() => {
    if (challenge) {
      setCode(challenge.problemCode);
      setError(null);
      setSubmitResult(null);
      setShowSuccess(false);
      setPreviewHtml("");
      setPreviewError(null);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(challenge.problemCode);
      }
    }
  }, [challenge, uri]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) return model.getValue();
    }
    return code;
  }, [code, uri]);

  const REACT_UMD = `
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
`;

  const buildPreviewHTML = useCallback((jsCode: string) => {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${REACT_UMD}
    <style>
      body { margin: 0; padding: 16px; background:#0b1020; color:#e5edff; font-family: Inter, system-ui, -apple-system, sans-serif;}
      #root { min-height: 100px; }
      pre { white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const parentWindow = window.parent;
      const safeConsole = {
        log: (...args) => parentWindow.postMessage({ type: "playground-log", message: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ") }, "*"),
        warn: (...args) => parentWindow.postMessage({ type: "playground-log", message: "⚠️ " + args.join(" ") }, "*"),
        error: (...args) => parentWindow.postMessage({ type: "playground-log", message: "❌ " + args.join(" ") }, "*"),
      };
      try {
        ${jsCode}
        const App = window.__APP__;
        if (App && window.React && window.ReactDOM) {
          const root = document.getElementById("root");
          const React = window.React;
          const ReactDOM = window.ReactDOM;
          ReactDOM.createRoot(root).render(React.createElement(App));
        } else if (window.ReactDOM) {
          const root = document.getElementById("root");
          root.innerHTML = "<pre style='color:#e5edff;white-space:pre-wrap'>No default export named App was found. Console output is still captured.</pre>";
        }
      } catch (err) {
        parentWindow.postMessage({ type: "playground-error", message: err?.message || String(err) }, "*");
      }
    </script>
  </body>
</html>
`;
  }, []);

  const runPreview = useCallback(async () => {
    setIsRunningPreview(true);
    setPreviewError(null);
    setPreviewHtml("");

    try {
      const src = getEditorCode();

      // Check if code already defines App or has default export
      const hasApp = /\b(App|window\.__APP__)\s*[=:]/.test(src);
      const hasDefaultExport = /export\s+default\s+/.test(src);

      let wrapped = src;
      if (!hasApp && !hasDefaultExport) {
        // Try to find exported component names
        const exportMatches = [
          ...src.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g),
          ...src.matchAll(/export\s+{\s*(\w+)/g),
        ];

        // Also try to find non-exported components (common in challenges)
        const componentMatches = [
          ...src.matchAll(/(?:const|function|class)\s+(\w+)\s*[=:]\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*\{)/g),
        ];

        let componentName: string | null = null;
        if (exportMatches.length > 0) {
          componentName = exportMatches[0][1];
        } else if (componentMatches.length > 0) {
          // Find the first component that looks like it returns JSX
          for (const match of componentMatches) {
            const name = match[1];
            // Check if it's likely a React component (returns JSX)
            const componentCode = src.substring(match.index || 0);
            if (componentCode.includes('return') && (componentCode.includes('<') || componentCode.includes('React.createElement'))) {
              componentName = name;
              break;
            }
          }
        }

        if (componentName) {
          // Wrap code to capture component and create App
          wrapped = `${src}

// Auto-generated preview wrapper
(function() {
  var _exports = typeof exports !== 'undefined' ? exports : {};
  var Component = _exports.${componentName} || (typeof ${componentName} !== 'undefined' ? ${componentName} : null);
  
  var App = function App() {
    try {
      if (Component && typeof Component === 'function') {
        return React.createElement(Component, {});
      }
      if (_exports.default) {
        return React.createElement(_exports.default, {});
      }
      // Try any exported function
      var keys = Object.keys(_exports);
      for (var i = 0; i < keys.length; i++) {
        var exp = _exports[keys[i]];
        if (typeof exp === 'function') {
          return React.createElement(exp, {});
        }
      }
      return React.createElement('div', { style: { padding: '16px', color: '#e5edff' } }, 
        'Component "${componentName}" code executed. Check console for output.'
      );
    } catch (err) {
      return React.createElement('div', { 
        style: { color: '#ef4444', padding: '16px' } 
      }, String(err?.message || err));
    }
  };
  
  window.__APP__ = App;
})();`;
        } else {
          // No exports found, create generic wrapper
          wrapped = `${src}

// Auto-generated preview wrapper
(function() {
  var _exports = typeof exports !== 'undefined' ? exports : {};
  var App = function App() {
    try {
      if (_exports.default) {
        return React.createElement(_exports.default, {});
      }
      var keys = Object.keys(_exports);
      for (var i = 0; i < keys.length; i++) {
        var exp = _exports[keys[i]];
        if (typeof exp === 'function') {
          return React.createElement(exp, {});
        }
      }
      return React.createElement('div', { style: { padding: '16px', color: '#e5edff' } }, 
        'Code executed. Check console for output.'
      );
    } catch (err) {
      return React.createElement('div', { style: { color: '#ef4444', padding: '16px' } }, 
        String(err?.message || err)
      );
    }
  };
  window.__APP__ = App;
})();`;
        }
      } else {
        // Has App or default export, use existing pattern
        wrapped = `${src}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
      }

      const result = Babel.transform(wrapped, {
        presets: ["env", "react", "typescript"],
        sourceType: "module",
        filename: "App.tsx",
      }).code;

      const html = buildPreviewHTML(result || "");
      setPreviewHtml(html);
    } catch (err) {
      setPreviewError((err as Error).message);
    } finally {
      setIsRunningPreview(false);
    }
  }, [getEditorCode, buildPreviewHTML]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "playground-error") {
        setPreviewError(event.data.message);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runPreview();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runPreview]);

  const submitCode = useCallback(async () => {
    if (!challenge || !challenge.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setSubmitResult(null);
    setShowSuccess(false);

    const src = getEditorCode();
    let passed = 0;
    const total = challenge.testCases.length;

    try {
      for (const tc of challenge.testCases) {
        if (tc.validate(src)) {
          passed++;
        }
      }

      const success = passed === total;
      setSubmitResult({ passed, total, success });

      if (success) {
        setShowSuccess(true);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (_) { }
        resetAttemptCount(challenge.id);
      } else {
        const newCount = incrementAttemptCount(challenge.id);
        setAttemptCount(newCount);
        if (newCount >= MAX_ATTEMPTS) {
          setShowSolution(true);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Validation failed");
    }

    setIsSubmitting(false);
  }, [challenge, getEditorCode]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
    }),
    []
  );

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");

    // Configure TypeScript compiler options for React/TSX
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      jsx: monaco.languages.typescript.JsxEmit.React,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      allowJs: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [1375], // Allow top-level await
    });

    // Add React type definitions - make React hooks available globally
    const reactTypes = `
      // Global browser APIs (setTimeout, console, alert, etc.) - available without imports
      declare global {
        function setTimeout(callback: (...args: any[]) => void, delay?: number, ...args: any[]): number;
        function clearTimeout(timeoutId: number): void;
        function setInterval(callback: (...args: any[]) => void, delay?: number, ...args: any[]): number;
        function clearInterval(intervalId: number): void;
        function requestAnimationFrame(callback: (time: number) => void): number;
        function cancelAnimationFrame(handle: number): void;
        
        var console: {
          log(...args: any[]): void;
          warn(...args: any[]): void;
          error(...args: any[]): void;
          info(...args: any[]): void;
          debug(...args: any[]): void;
          trace(...args: any[]): void;
          table(...args: any[]): void;
          group(...args: any[]): void;
          groupEnd(): void;
          time(label?: string): void;
          timeEnd(label?: string): void;
          assert(condition: boolean, ...args: any[]): void;
          clear(): void;
          count(label?: string): void;
          countReset(label?: string): void;
          dir(...args: any[]): void;
          dirxml(...args: any[]): void;
          profile(label?: string): void;
          profileEnd(label?: string): void;
        };
        
        function alert(message?: any): void;
        function confirm(message?: string): boolean;
        function prompt(message?: string, defaultText?: string): string | null;
        
        // Make React hooks available globally (no import needed)
        function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
        function useState<S = undefined>(): [S | undefined, (value: S | ((prev: S) => S)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
        function useRef<T>(initialValue: T | null): { current: T | null };
        function useRef<T = undefined>(): { current: T | undefined };
        function useContext<T>(context: React.Context<T>): T;
        function useReducer<R extends React.Reducer<any, any>>(
          reducer: R,
          initialState: React.ReducerState<R>,
          init?: (initial: React.ReducerState<R>) => React.ReducerState<R>
        ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
        function useReducer<R extends React.Reducer<any, any>, I>(
          reducer: R,
          initialArg: I,
          init: (arg: I) => React.ReducerState<R>
        ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
        function useReducer<R extends React.Reducer<any, any>>(
          reducer: R,
          initialState: React.ReducerState<R>
        ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
        function useImperativeHandle<T, R extends T>(ref: React.Ref<T>, init: () => R, deps?: any[]): void;
        function useDebugValue<T>(value: T, format?: (value: T) => any): void;
        function forwardRef<T, P = {}>(
          render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
        ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>;
        function memo<P extends object>(
          Component: React.FunctionComponent<P>,
          propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
        ): React.MemoExoticComponent<React.FunctionComponent<P>>;
        function createContext<T>(defaultValue: T): React.Context<T>;
        function createElement<P extends {}>(
          type: React.ElementType<P>,
          props?: (React.Attributes & P) | null,
          ...children: React.ReactNode[]
        ): React.ReactElement<P>;
      }
      
      // Global React namespace
      declare namespace React {
        type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];
        type ReactElement<P = any, T = any> = { type: T; props: P; key: Key | null; };
        type Key = string | number;
        type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null | undefined;
        type RefObject<T> = { readonly current: T | null };
        type Context<T> = { Provider: Provider<T>; Consumer: Consumer<T>; displayName?: string };
        type Provider<T> = FunctionComponent<{ value: T; children?: ReactNode }>;
        type Consumer<T> = FunctionComponent<{ children: (value: T) => ReactNode }>;
        type FunctionComponent<P = {}> = (props: P, context?: any) => ReactElement<any, any> | null;
        type FC<P = {}> = FunctionComponent<P>;
        type Component<P = {}, S = {}, SS = any> = any;
        type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P>;
        type ComponentClass<P = {}, S = {}> = new (props: P, context?: any) => Component<P, S>;
        type ElementType<P = any> = string | ComponentType<P>;
        type Reducer<S, A> = (prevState: S, action: A) => S;
        type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
        type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
        type Dispatch<A> = (value: A) => void;
        type ForwardRefExoticComponent<P> = any;
        type ForwardRefRenderFunction<T, P = {}> = (props: P, ref: Ref<T>) => ReactElement | null;
        type MemoExoticComponent<T extends ComponentType<any>> = T;
        type PropsWithoutRef<P> = P;
        type RefAttributes<T> = { ref?: Ref<T> };
        type Attributes = { key?: Key };
        type DetailedHTMLProps<T, U> = T & { ref?: Ref<U> };
        type HTMLAttributes<T> = Attributes & { [key: string]: any; className?: string; style?: any; id?: string; };
        type ButtonHTMLAttributes<T> = HTMLAttributes<T> & { 
          autoFocus?: boolean; disabled?: boolean; form?: string; name?: string; 
          type?: 'button' | 'submit' | 'reset'; value?: string | number | string[]; 
          onClick?: (event: MouseEvent) => void; 
        };
        type InputHTMLAttributes<T> = HTMLAttributes<T> & { 
          type?: string; value?: string | number | string[]; checked?: boolean; disabled?: boolean;
          onChange?: (event: Event) => void; onClick?: (event: MouseEvent) => void;
        };
        type LabelHTMLAttributes<T> = HTMLAttributes<T> & { form?: string; htmlFor?: string; };
        type SelectHTMLAttributes<T> = HTMLAttributes<T> & { 
          value?: string | number | string[]; multiple?: boolean; 
          onChange?: (event: Event) => void; 
        };
        type TextareaHTMLAttributes<T> = HTMLAttributes<T> & { 
          value?: string | number | string[]; rows?: number; cols?: number;
          onChange?: (event: Event) => void; 
        };
        type FormHTMLAttributes<T> = HTMLAttributes<T> & { 
          action?: string; method?: string; onSubmit?: (event: Event) => void; 
        };
        type LiHTMLAttributes<T> = HTMLAttributes<T> & { value?: string | number | string[]; };
        type AnchorHTMLAttributes<T> = HTMLAttributes<T> & { href?: string; target?: string; download?: string; rel?: string; };
        type ImgHTMLAttributes<T> = HTMLAttributes<T> & { alt?: string; src?: string; width?: number | string; height?: number | string; };
      }
      
      declare module 'react' {
        export interface FunctionComponent<P = {}> {
          (props: P, context?: any): ReactElement<any, any> | null;
        }
        
        export interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
        
        export type ReactElement<P = any, T = any> = {
          type: T;
          props: P;
          key: Key | null;
        };
        
        export type Key = string | number;
        
        export interface ComponentLifecycle<P, S, SS = any> {}
        
        export type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];
        
        export type FC<P = {}> = FunctionComponent<P>;
        
        export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
        export function useState<S = undefined>(): [S | undefined, (value: S | ((prev: S) => S)) => void];
        
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        export function useRef<T>(initialValue: T): { current: T };
        export function useRef<T>(initialValue: T | null): { current: T | null };
        export function useRef<T = undefined>(): { current: T | undefined };
        export function useContext<T>(context: Context<T>): T;
        export function useReducer<R extends Reducer<any, any>>(
          reducer: R,
          initialState: ReducerState<R>,
          init?: (initial: ReducerState<R>) => ReducerState<R>
        ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
        export function useReducer<R extends Reducer<any, any>, I>(
          reducer: R,
          initialArg: I,
          init: (arg: I) => ReducerState<R>
        ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
        export function useReducer<R extends Reducer<any, any>>(
          reducer: R,
          initialState: ReducerState<R>
        ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
        export function useImperativeHandle<T, R extends T>(ref: Ref<T>, init: () => R, deps?: any[]): void;
        export function useDebugValue<T>(value: T, format?: (value: T) => any): void;
        export function forwardRef<T, P = {}>(
          render: (props: P, ref: Ref<T>) => ReactElement | null
        ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
        export function memo<P extends object>(
          Component: FunctionComponent<P>,
          propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
        ): MemoExoticComponent<FunctionComponent<P>>;
        export function createContext<T>(defaultValue: T): Context<T>;
        export function createElement<P extends {}>(
          type: ElementType<P>,
          props?: (Attributes & P) | null,
          ...children: ReactNode[]
        ): ReactElement<P>;
        
        export type Ref<T> = { current: T | null } | ((instance: T | null) => void) | null | undefined;
        export type RefObject<T> = { readonly current: T | null };
        export type RefCallback<T> = (instance: T | null) => void;
        export type Context<T> = { Provider: Provider<T>; Consumer: Consumer<T>; displayName?: string };
        export type Provider<T> = FunctionComponent<{ value: T; children?: ReactNode }>;
        export type Consumer<T> = FunctionComponent<{ children: (value: T) => ReactNode }>;
        export type Reducer<S, A> = (prevState: S, action: A) => S;
        export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
        export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
        export type Dispatch<A> = (value: A) => void;
        export type ForwardRefExoticComponent<P> = MemoExoticComponent<ForwardRefRenderFunction<any, P>>;
        export type ForwardRefRenderFunction<T, P = {}> = (props: P, ref: Ref<T>) => ReactElement | null;
        export type MemoExoticComponent<T extends ComponentType<any>> = T;
        export type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P>;
        export type ComponentClass<P = {}, S = {}> = new (props: P, context?: any) => Component<P, S>;
        export type ElementType<P = any> = string | ComponentType<P>;
        export type PropsWithoutRef<P> = P;
        export type RefAttributes<T> = { ref?: Ref<T> };
        export type Attributes = { key?: Key };
      }
      
      // Global JSX namespace
      declare namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
        interface ElementClass extends React.Component<any> {}
        interface ElementAttributesProperty { props: {}; }
        interface ElementChildrenProperty { children?: React.ReactNode; }
        interface IntrinsicAttributes extends React.Attributes {}
        interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
        interface IntrinsicElements {
          [elemName: string]: any;
            a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: React.DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
            body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: React.DetailedHTMLProps<React.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: React.DetailedHTMLProps<React.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: React.DetailedHTMLProps<React.DelHTMLAttributes<HTMLElement>, HTMLElement>;
            details: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLElement>, HTMLElement>;
            dfn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: React.DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            keygen: React.DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: React.DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: React.DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: React.DetailedHTMLProps<React.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
            nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: React.DetailedHTMLProps<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: React.DetailedHTMLProps<React.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
            p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: React.DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: React.DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: React.DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLElement>, HTMLElement>;
            title: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: React.DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            var: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
          }
        }
      type AnchorHTMLAttributes<T> = HTMLAttributes<T> & { href?: string; target?: string; download?: string; rel?: string; };
      type AreaHTMLAttributes<T> = HTMLAttributes<T> & { alt?: string; coords?: string; href?: string; target?: string; download?: string; rel?: string; shape?: string; };
      type AudioHTMLAttributes<T> = HTMLAttributes<T> & { autoPlay?: boolean; controls?: boolean; crossOrigin?: string; loop?: boolean; muted?: boolean; preload?: string; src?: string; };
      type BaseHTMLAttributes<T> = HTMLAttributes<T> & { href?: string; target?: string; };
      type BlockquoteHTMLAttributes<T> = HTMLAttributes<T> & { cite?: string; };
      type ButtonHTMLAttributes<T> = HTMLAttributes<T> & { autoFocus?: boolean; disabled?: boolean; form?: string; formAction?: string; formEncType?: string; formMethod?: string; formNoValidate?: boolean; formTarget?: string; name?: string; type?: 'button' | 'submit' | 'reset'; value?: string | number | string[]; onClick?: (event: MouseEvent) => void; };
      type CanvasHTMLAttributes<T> = HTMLAttributes<T> & { height?: number | string; width?: number | string; };
      type ColHTMLAttributes<T> = HTMLAttributes<T> & { span?: number; };
      type ColgroupHTMLAttributes<T> = HTMLAttributes<T> & { span?: number; };
      type DataHTMLAttributes<T> = HTMLAttributes<T> & { value?: string | number | string[]; };
      type DelHTMLAttributes<T> = HTMLAttributes<T> & { cite?: string; dateTime?: string; };
      type DetailsHTMLAttributes<T> = HTMLAttributes<T> & { open?: boolean; };
      type DialogHTMLAttributes<T> = HTMLAttributes<T> & { open?: boolean; };
      type EmbedHTMLAttributes<T> = HTMLAttributes<T> & { height?: number | string; src?: string; type?: string; width?: number | string; };
      type FieldsetHTMLAttributes<T> = HTMLAttributes<T> & { disabled?: boolean; form?: string; name?: string; };
      type FormHTMLAttributes<T> = HTMLAttributes<T> & { acceptCharset?: string; action?: string; autoComplete?: string; encType?: string; method?: string; name?: string; noValidate?: boolean; target?: string; };
      type HtmlHTMLAttributes<T> = HTMLAttributes<T> & { manifest?: string; };
      type IframeHTMLAttributes<T> = HTMLAttributes<T> & { allow?: string; allowFullScreen?: boolean; allowPaymentRequest?: boolean; height?: number | string; name?: string; referrerPolicy?: string; sandbox?: string; src?: string; srcDoc?: string; width?: number | string; };
      type ImgHTMLAttributes<T> = HTMLAttributes<T> & { alt?: string; crossOrigin?: string; decoding?: 'async' | 'auto' | 'sync'; height?: number | string; loading?: 'eager' | 'lazy'; referrerPolicy?: string; sizes?: string; src?: string; srcSet?: string; useMap?: string; width?: number | string; };
      type InputHTMLAttributes<T> = HTMLAttributes<T> & { accept?: string; alt?: string; autoComplete?: string; autoFocus?: boolean; capture?: boolean | string; checked?: boolean; crossOrigin?: string; disabled?: boolean; form?: string; formAction?: string; formEncType?: string; formMethod?: string; formNoValidate?: boolean; formTarget?: string; height?: number | string; list?: string; max?: number | string; maxLength?: number; min?: number | string; minLength?: number; multiple?: boolean; name?: string; pattern?: string; placeholder?: string; readOnly?: boolean; required?: boolean; size?: number; src?: string; step?: number | string; type?: string; value?: string | number | string[]; width?: number | string; onChange?: (event: Event) => void; };
      type InsHTMLAttributes<T> = HTMLAttributes<T> & { cite?: string; dateTime?: string; };
      type KeygenHTMLAttributes<T> = HTMLAttributes<T> & { autoFocus?: boolean; challenge?: string; disabled?: boolean; form?: string; keyType?: string; keyParams?: string; name?: string; };
      type LabelHTMLAttributes<T> = HTMLAttributes<T> & { form?: string; htmlFor?: string; };
      type LiHTMLAttributes<T> = HTMLAttributes<T> & { value?: string | number | string[]; };
      type LinkHTMLAttributes<T> = HTMLAttributes<T> & { as?: string; crossOrigin?: string; href?: string; hrefLang?: string; integrity?: string; media?: string; referrerPolicy?: string; rel?: string; sizes?: string; type?: string; };
      type MapHTMLAttributes<T> = HTMLAttributes<T> & { name?: string; };
      type MetaHTMLAttributes<T> = HTMLAttributes<T> & { charSet?: string; content?: string; httpEquiv?: string; name?: string; };
      type MeterHTMLAttributes<T> = HTMLAttributes<T> & { form?: string; high?: number; low?: number; max?: number | string; min?: number | string; optimum?: number; value?: number | string; };
      type ObjectHTMLAttributes<T> = HTMLAttributes<T> & { classID?: string; data?: string; form?: string; height?: number | string; name?: string; type?: string; useMap?: string; width?: number | string; wmode?: string; };
      type OlHTMLAttributes<T> = HTMLAttributes<T> & { reversed?: boolean; start?: number; type?: '1' | 'a' | 'A' | 'i' | 'I'; };
      type OptgroupHTMLAttributes<T> = HTMLAttributes<T> & { disabled?: boolean; label?: string; };
      type OptionHTMLAttributes<T> = HTMLAttributes<T> & { disabled?: boolean; label?: string; selected?: boolean; value?: string | number | string[]; };
      type OutputHTMLAttributes<T> = HTMLAttributes<T> & { form?: string; name?: string; };
      type ParamHTMLAttributes<T> = HTMLAttributes<T> & { name?: string; value?: string | number | string[]; };
      type ProgressHTMLAttributes<T> = HTMLAttributes<T> & { max?: number | string; value?: number | string; };
      type QuoteHTMLAttributes<T> = HTMLAttributes<T> & { cite?: string; };
      type ScriptHTMLAttributes<T> = HTMLAttributes<T> & { async?: boolean; charSet?: string; crossOrigin?: string; defer?: boolean; integrity?: string; noModule?: boolean; referrerPolicy?: string; src?: string; type?: string; };
      type SelectHTMLAttributes<T> = HTMLAttributes<T> & { autoComplete?: string; autoFocus?: boolean; disabled?: boolean; form?: string; multiple?: boolean; name?: string; required?: boolean; size?: number; value?: string | number | string[]; onChange?: (event: Event) => void; };
      type SourceHTMLAttributes<T> = HTMLAttributes<T> & { height?: number | string; media?: string; sizes?: string; src?: string; srcSet?: string; type?: string; width?: number | string; };
      type StyleHTMLAttributes<T> = HTMLAttributes<T> & { media?: string; nonce?: string; type?: string; };
      type TableHTMLAttributes<T> = HTMLAttributes<T> & { cellPadding?: number | string; cellSpacing?: number | string; summary?: string; };
      type TdHTMLAttributes<T> = HTMLAttributes<T> & { abbr?: string; colSpan?: number; headers?: string; rowSpan?: number; scope?: string; };
      type TextareaHTMLAttributes<T> = HTMLAttributes<T> & { autoComplete?: string; autoFocus?: boolean; cols?: number; disabled?: boolean; form?: string; maxLength?: number; minLength?: number; name?: string; placeholder?: string; readOnly?: boolean; required?: boolean; rows?: number; value?: string | number | string[]; wrap?: string; onChange?: (event: Event) => void; };
      type ThHTMLAttributes<T> = HTMLAttributes<T> & { abbr?: string; colSpan?: number; headers?: string; rowSpan?: number; scope?: string; };
      type TimeHTMLAttributes<T> = HTMLAttributes<T> & { dateTime?: string; };
      type TrackHTMLAttributes<T> = HTMLAttributes<T> & { default?: boolean; kind?: string; label?: string; src?: string; srcLang?: string; };
      type VideoHTMLAttributes<T> = HTMLAttributes<T> & { autoPlay?: boolean; controls?: boolean; crossOrigin?: string; height?: number | string; loop?: boolean; muted?: boolean; playsInline?: boolean; preload?: string; src?: string; width?: number | string; };
    `;

    // Add types to TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // Also add to JavaScript defaults for better support
    if (monaco.languages.typescript.javascriptDefaults) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        reactTypes,
        'file:///node_modules/@types/react/index.d.ts'
      );
    }
  };

  if (!challenge) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Challenge not found</p>
          <a href={createLocalizedPath("/developer-section/react-challenges")}>Back to challenges</a>
        </div>
        <Footer />
      </main>
    );
  }

  const remainingAttempts = MAX_ATTEMPTS - attemptCount;
  const showAttemptWarning = attemptCount > 0 && remainingAttempts > 0;

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
              <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{challenge.title}</h1>
            <div className={playStyles.descBody}>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>{challenge.description}</p>

              {showAttemptWarning && (
                <div style={{
                  padding: "12px",
                  marginBottom: "16px",
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <WarningIcon fontSize="small" style={{ color: "#ffc107" }} />
                  <span style={{ fontSize: "14px", color: "#ffc107" }}>
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              {attemptCount >= MAX_ATTEMPTS && (
                <div style={{
                  padding: "12px",
                  marginBottom: "16px",
                  background: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <SolutionIcon fontSize="small" style={{ color: "#ff9800" }} />
                  <span style={{ fontSize: "14px", color: "#ff9800" }}>
                    Solution unlocked after {MAX_ATTEMPTS} attempts
                  </span>
                </div>
              )}

              <h4 className={playStyles.descSub}>Problem Code</h4>
              <pre className={playStyles.sample}>{challenge.problemCode}</pre>

              {challenge.hints.length > 0 && (
                <>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    style={{
                      marginTop: "16px",
                      padding: "8px 16px",
                      background: "rgba(124, 244, 255, 0.1)",
                      border: "1px solid rgba(124, 244, 255, 0.3)",
                      borderRadius: "6px",
                      color: "#7cf4ff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <HintIcon fontSize="small" />
                    {showHints ? "Hide Hints" : "Show Hints"}
                  </button>
                  {showHints && (
                    <ul style={{ marginTop: "12px", paddingLeft: "20px", color: "#c6d5ff" }}>
                      {challenge.hints.map((hint, i) => (
                        <li key={i} style={{ marginBottom: "8px", fontSize: "14px" }}>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {showSolution && (
                <>
                  <h4 className={playStyles.descSub} style={{ marginTop: "24px", color: "#ff9800" }}>
                    Solution
                  </h4>
                  <pre className={playStyles.sample} style={{ borderColor: "rgba(255, 152, 0, 0.3)" }}>
                    {challenge.solution}
                  </pre>
                  <p style={{ marginTop: "12px", fontSize: "13px", color: "#c6d5ff", fontStyle: "italic" }}>
                    {challenge.explanation}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: editor + output */}
          <div className={playStyles.editorColumn}>
            <div className={`${playStyles.editorWrap} code-editor-contained`}>
              <MonacoEditor
                height="100%"
                language="typescript"
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.toolbar}>
              <button className={playStyles.iconBtn} onClick={resetToProblem}>
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button
                className={playStyles.iconBtn}
                onClick={runPreview}
                disabled={isRunningPreview}
                style={{ marginRight: "8px" }}
              >
                <PlayIcon fontSize="small" /> {isRunningPreview ? "Running..." : "Preview"}
              </button>
              <button
                className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`}
                onClick={submitCode}
                disabled={isSubmitting}
              >
                <CheckIcon fontSize="small" /> Submit Solution
              </button>
            </div>

            {/* Preview Section */}
            {previewHtml && (
              <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                <div className={playStyles.outputHead}>
                  Preview
                </div>
                <div style={{
                  padding: "12px",
                  background: "#0b1020",
                  borderRadius: "4px",
                  minHeight: "200px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <iframe
                    ref={previewIframeRef}
                    title="react-challenge-preview"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={previewHtml}
                    style={{
                      width: "100%",
                      minHeight: "200px",
                      border: "none",
                      borderRadius: "4px",
                      background: "#0e1628"
                    }}
                  />
                  {previewError && (
                    <div style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: "rgba(244, 67, 54, 0.1)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      borderRadius: "4px",
                      color: "#ff6b6b",
                      fontSize: "13px"
                    }}>
                      ❌ {previewError}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                Result
                {submitResult != null && (
                  <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                    {submitResult.passed}/{submitResult.total} Tests Passed
                  </span>
                )}
              </div>
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div
                    key="success"
                    className={playStyles.successBanner}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckIcon className={playStyles.successIcon} /> Challenge Completed! 🎉
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <div className={playStyles.errorLine}>❌ {error}</div>}
              {submitResult && !submitResult.success && (
                <div className={playStyles.logList}>
                  <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "8px" }}>
                    Some tests failed. Try again!
                  </p>
                  {challenge.testCases.map((tc, i) => {
                    const passed = tc.validate(getEditorCode());
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "8px",
                          marginBottom: "4px",
                          background: passed ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                          border: `1px solid ${passed ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"}`,
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        {passed ? "✓" : "✗"} {tc.description}
                      </div>
                    );
                  })}
                </div>
              )}
              {submitResult && submitResult.success && (
                <div style={{ padding: "16px", color: "#4caf50", fontSize: "14px" }}>
                  ✓ All tests passed! Great job!
                </div>
              )}
              {!submitResult && !error && (
                <p className={playStyles.emptyLog}>Submit your solution to see results</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-challenges")}>
            Back to React Challenges
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
