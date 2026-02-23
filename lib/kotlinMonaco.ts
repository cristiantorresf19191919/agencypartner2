/**
 * One-time Kotlin language registration for Monaco. Provides Monarch tokenizer
 * for syntax highlighting (keywords, types, strings, comments, numbers).
 */

const kotlinRegistered = new WeakSet<object>();

export function ensureKotlinLanguage(monaco: any): void {
  if (!monaco || kotlinRegistered.has(monaco)) return;
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === "kotlin")) {
    kotlinRegistered.add(monaco);
    return;
  }

  monaco.languages.register({ id: "kotlin" });
  monaco.languages.setLanguageConfiguration("kotlin", {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
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
  monaco.languages.setMonarchTokensProvider("kotlin", {
    keywords: [
      "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
      "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
      "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
      "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
      "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
      "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
      "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while",
    ],
    typeKeywords: [
      "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing",
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { "@keywords": "keyword", "@typeKeywords": "type", "@default": "identifier" } }],
        [/[A-Z][\w$]*/, "type.identifier"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        [/'/, { token: "string.quote", bracket: "@open", next: "@stringSingle" }],
        [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
        [/0[xX][0-9a-fA-F]+[Ll]?/, "number.hex"],
        [/\d+[lL]?/, "number"],
        [/[;,.]/, "delimiter"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, "operator"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        ["\\*/", "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
      stringSingle: [
        [/[^\\']+/, "string"],
        [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
    },
  });

  kotlinRegistered.add(monaco);
}
