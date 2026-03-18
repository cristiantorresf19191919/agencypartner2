/**
 * One-time Bash/Shell language registration for Monaco.
 * Provides:
 * - Monarch tokenizer with rich syntax coloring (commands, flags, variables, pipes, strings, comments)
 * - Autocomplete for git worktree commands, Claude Code CLI, and common shell builtins
 */

const bashRegistered = new WeakSet<object>();

export function ensureBashLanguage(monaco: any): void {
  if (!monaco || bashRegistered.has(monaco)) return;
  // If Monaco already has a built-in shell language, enhance it; otherwise register fresh
  const existing = monaco.languages.getLanguages().some((l: { id: string }) => l.id === "shell");
  if (existing) {
    bashRegistered.add(monaco);
    // Still register our custom tokenizer on top
  }

  // Register bash as an alias if not present
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "bash")) {
    monaco.languages.register({ id: "bash" });
  }
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "sh")) {
    monaco.languages.register({ id: "sh" });
  }

  const config = {
    comments: { lineComment: "#" },
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
      { open: "`", close: "`" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "`", close: "`" },
    ],
  };

  const tokenizer = {
    // Shell builtins and common commands
    keywords: [
      "if", "then", "else", "elif", "fi", "for", "do", "done", "while", "until",
      "case", "esac", "in", "function", "return", "exit", "break", "continue",
      "select", "time", "coproc",
    ],
    builtins: [
      "echo", "printf", "read", "cd", "pwd", "pushd", "popd", "dirs",
      "export", "unset", "set", "shift", "source", "alias", "unalias",
      "eval", "exec", "trap", "wait", "kill", "test", "true", "false",
      "type", "which", "whereis", "man", "help", "history",
      "mkdir", "rmdir", "rm", "cp", "mv", "ln", "chmod", "chown", "chgrp",
      "touch", "cat", "head", "tail", "less", "more", "wc", "sort", "uniq",
      "grep", "sed", "awk", "find", "xargs", "tee", "cut", "paste", "tr",
      "curl", "wget", "ssh", "scp", "tar", "gzip", "gunzip", "zip", "unzip",
      "ps", "top", "htop", "kill", "killall", "bg", "fg", "jobs", "nohup",
      "sudo", "su", "apt", "yum", "brew", "pip", "npm", "npx", "yarn", "pnpm",
    ],
    // Git and Claude commands get special treatment
    gitCommands: [
      "git", "gh",
    ],
    claudeCommands: [
      "claude",
    ],

    symbols: /[=><!~?&|+\-*/^%]+/,

    tokenizer: {
      root: [
        // Shebang
        [/^#!.*$/, "comment.shebang"],

        // Comments
        [/#.*$/, "comment"],

        // Strings
        [/"/, "string.double", "@stringDouble"],
        [/'/, "string.single", "@stringSingle"],
        [/`/, "string.backtick", "@stringBacktick"],

        // Variable assignments: VAR=value
        [/[A-Z_][A-Z0-9_]*(?=\s*=)/, "variable.assignment"],

        // Environment variables: $VAR, ${VAR}, $1, $@, $?, $$
        [/\$\{[^}]+\}/, "variable.env"],
        [/\$[A-Za-z_][A-Za-z0-9_]*/, "variable.env"],
        [/\$[0-9@?$#!*-]/, "variable.special"],

        // Flags/options: --long-flag, -s
        [/\s--[a-zA-Z][a-zA-Z0-9-]*/, "parameter.flag"],
        [/\s-[a-zA-Z]+/, "parameter.flag.short"],

        // Pipe, redirect, background
        [/\|{1,2}/, "operator.pipe"],
        [/>{1,2}|<|&>|2>&1/, "operator.redirect"],
        [/&&|\|\|/, "operator.logical"],
        [/;/, "delimiter"],
        [/&\s*$/, "operator.background"],

        // Numbers
        [/\b\d+\b/, "number"],

        // Path-like tokens (with slashes)
        [/[.~]?\/[a-zA-Z0-9_./-]+/, "string.path"],

        // Git commands
        [/\bgit\b/, { token: "keyword.git", next: "@gitSubcommand" }],
        [/\bgh\b/, { token: "keyword.git" }],

        // Claude commands
        [/\bclaude\b/, { token: "keyword.claude" }],

        // npm/npx/yarn/pnpm
        [/\b(npm|npx|yarn|pnpm)\b/, "keyword.package"],

        // Docker/k8s
        [/\b(docker|kubectl|helm|kind|k9s)\b/, "keyword.devops"],

        // Other commands: check builtins then keywords
        [/[a-zA-Z_][a-zA-Z0-9_-]*/, {
          cases: {
            "@keywords": "keyword",
            "@builtins": "keyword.builtin",
            "@default": "identifier",
          },
        }],

        // Brackets
        [/[{}()[\]]/, "@brackets"],
      ],

      gitSubcommand: [
        [/\s+(worktree|add|commit|push|pull|merge|rebase|checkout|branch|clone|fetch|log|diff|status|stash|remote|reset|cherry-pick|tag|init|config|bisect|reflog|show|revert|clean|gc|prune)\b/, "keyword.git.subcommand"],
        [/\s+(list|remove|prune|--porcelain)\b/, "keyword.git.subcommand"],
        [/$/, "", "@pop"],
        [/\s/, "", "@pop"],
      ],

      stringDouble: [
        [/\$\{[^}]+\}/, "variable.env"],
        [/\$[A-Za-z_][A-Za-z0-9_]*/, "variable.env"],
        [/\$[0-9@?$#!*-]/, "variable.special"],
        [/\\[\\nrt"$`]/, "string.escape"],
        [/[^"$\\]+/, "string.double"],
        [/"/, "string.double", "@pop"],
      ],

      stringSingle: [
        [/[^']+/, "string.single"],
        [/'/, "string.single", "@pop"],
      ],

      stringBacktick: [
        [/\$\{[^}]+\}/, "variable.env"],
        [/\$[A-Za-z_][A-Za-z0-9_]*/, "variable.env"],
        [/[^`$]+/, "string.backtick"],
        [/`/, "string.backtick", "@pop"],
      ],
    },
  };

  // Register for both "bash" and "sh"
  for (const id of ["bash", "sh"]) {
    monaco.languages.setLanguageConfiguration(id, config);
    monaco.languages.setMonarchTokensProvider(id, tokenizer);
  }

  bashRegistered.add(monaco);
}

/**
 * Register autocomplete/suggestions for git worktree commands and Claude CLI.
 * Call this after ensureBashLanguage.
 */
export function registerBashCompletions(monaco: any): void {
  if (!monaco) return;

  const CompletionItemKind = monaco.languages.CompletionItemKind;
  const CompletionItemInsertTextRule = monaco.languages.CompletionItemInsertTextRule;

  const suggestions = [
    // Git worktree commands
    { label: "git worktree add", kind: CompletionItemKind.Function, insertText: "git worktree add -b ${1:branch-name} ${2:../path} ${3:main}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Create a new worktree", documentation: "Create a new worktree checked out to a new branch" },
    { label: "git worktree list", kind: CompletionItemKind.Function, insertText: "git worktree list", detail: "List all worktrees" },
    { label: "git worktree remove", kind: CompletionItemKind.Function, insertText: "git worktree remove ${1:path}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Remove a worktree" },
    { label: "git worktree prune", kind: CompletionItemKind.Function, insertText: "git worktree prune --verbose", detail: "Prune stale worktree references" },
    { label: "git worktree list --porcelain", kind: CompletionItemKind.Function, insertText: "git worktree list --porcelain", detail: "List worktrees in machine-readable format" },

    // Git common
    { label: "git status", kind: CompletionItemKind.Function, insertText: "git status", detail: "Show working tree status" },
    { label: "git add", kind: CompletionItemKind.Function, insertText: "git add ${1:.}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Stage files" },
    { label: "git commit", kind: CompletionItemKind.Function, insertText: 'git commit -m "${1:message}"', insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Create a commit" },
    { label: "git push", kind: CompletionItemKind.Function, insertText: "git push -u origin ${1:branch}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Push to remote" },
    { label: "git branch", kind: CompletionItemKind.Function, insertText: "git branch ${1:--show-current}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "List or create branches" },
    { label: "git log", kind: CompletionItemKind.Function, insertText: "git log --oneline -${1:10}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Show commit history" },
    { label: "git diff", kind: CompletionItemKind.Function, insertText: "git diff ${1:main}...${2:HEAD}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Show changes" },
    { label: "git merge", kind: CompletionItemKind.Function, insertText: "git merge ${1:branch}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Merge a branch" },
    { label: "git cherry-pick", kind: CompletionItemKind.Function, insertText: "git cherry-pick ${1:commit-hash}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Apply specific commits" },
    { label: "git stash", kind: CompletionItemKind.Function, insertText: "git stash", detail: "Stash changes" },

    // Claude Code CLI
    { label: "claude --worktree", kind: CompletionItemKind.Function, insertText: "claude --worktree ${1:name}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Start Claude in a worktree" },
    { label: "claude -w", kind: CompletionItemKind.Function, insertText: "claude -w ${1:name}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Short form: start Claude in a worktree" },
    { label: "claude --resume", kind: CompletionItemKind.Function, insertText: "claude --resume ${1:session}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Resume a Claude session" },

    // gh CLI
    { label: "gh pr create", kind: CompletionItemKind.Function, insertText: 'gh pr create --title "${1:title}" --base ${2:main} --head ${3:branch}', insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Create a pull request" },

    // Common shell builtins
    { label: "echo", kind: CompletionItemKind.Function, insertText: 'echo "${1:message}"', insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Print to stdout" },
    { label: "cd", kind: CompletionItemKind.Function, insertText: "cd ${1:path}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Change directory" },
    { label: "mkdir -p", kind: CompletionItemKind.Function, insertText: "mkdir -p ${1:dir}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Create directory (recursive)" },
    { label: "rm -rf", kind: CompletionItemKind.Function, insertText: "rm -rf ${1:path}", insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet, detail: "Remove recursively" },
    { label: "npm install", kind: CompletionItemKind.Function, insertText: "npm install", detail: "Install dependencies" },
    { label: "npm run build", kind: CompletionItemKind.Function, insertText: "npm run build", detail: "Run build script" },
  ];

  for (const id of ["bash", "sh"]) {
    monaco.languages.registerCompletionItemProvider(id, {
      provideCompletionItems(model: any, position: any) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: suggestions.map((s) => ({ ...s, range })),
        };
      },
    });
  }
}
