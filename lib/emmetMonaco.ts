/**
 * One-time Emmet (JSX/HTML) setup for Monaco. Use in beforeMount so React/TS/JSX
 * editors get Emmet expansion (e.g. div + Tab → <div></div>).
 */
import { emmetJSX } from "emmet-monaco-es";

const monacoEmmetInitialized = new WeakSet<object>();

export function ensureEmmetJSX(monaco: any): void {
  if (!monaco || monacoEmmetInitialized.has(monaco)) return;
  try {
    emmetJSX(monaco, ["javascript", "typescript"]);
    monacoEmmetInitialized.add(monaco);
  } catch {
    // Best-effort; avoid breaking the editor
  }
}
