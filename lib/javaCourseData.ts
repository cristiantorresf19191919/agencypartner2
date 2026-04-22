/**
 * Java 17 Interview Prep — 40 lessons covering core language, OOP, generics,
 * collections, streams, concurrency, JVM internals, and modern Java features.
 * Uses Monaco editor with TypeScript validation; Java concepts that don't
 * map cleanly to TS are taught with authentic Java code in section blocks
 * and modelled as TypeScript simulators in the interactive exercise.
 *
 * Tiers:
 *   1. Language Core           (1-5)
 *   2. OOP & Types             (6-11)
 *   3. Generics & Type System  (12-16)
 *   4. Collections             (17-22)
 *   5. Streams & Functional    (23-27)
 *   6. Concurrency             (28-33)
 *   7. JVM, Memory & GC        (34-37)
 *   8. Modern Java & Capstone  (38-40)
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

function buildJavaLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
    /* ══════════════════════════════════════════════════════════════════════
     * TIER 1 — Language Core (Lessons 1-5)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 1 ─────────────────────────────────────────────────────────
    {
      title: "Java 1: Primitives, Wrappers & Autoboxing",
      content: [
        "Java has 8 primitive types and a wrapper class for each. Autoboxing turns primitives into wrappers automatically — but caches some values and not others, which is a classic interview trap.",
        "Build a simulator that demonstrates Integer cache behavior, NaN comparison gotchas, and overflow — the three bugs interviewers love to ask about.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The 8 primitives",
          body: "**`boolean`** (1 bit logical), **`byte`** (8-bit signed), **`short`** (16-bit), **`int`** (32-bit, default integer), **`long`** (64-bit, `L` suffix), **`float`** (32-bit IEEE 754, `f` suffix), **`double`** (64-bit IEEE 754), **`char`** (16-bit unsigned, UTF-16 code unit). Each has a wrapper (`Integer`, `Long`, `Double`, `Boolean`, `Character`, `Byte`, `Short`, `Float`) giving object semantics.",
          badges: ["Primitives", "Wrappers"],
          code: "int x = 42;              // primitive\nInteger y = 42;          // autoboxed to Integer.valueOf(42)\nint z = y;               // unboxed via intValue()\nlong big = 10_000_000_000L;\ndouble d = Double.NaN;",
        },
        {
          tag: "concept",
          title: "The Integer cache gotcha",
          body: "`Integer.valueOf(n)` caches `Integer` instances for `-128..127` (the default `IntegerCache` range). `Integer a = 127; Integer b = 127; a == b` is **true**, but `Integer a = 128; Integer b = 128; a == b` is **false** — because 128 falls outside the cache and each autobox creates a fresh object. **Always use `.equals()` for wrapper comparison.**",
          badges: ["Autoboxing", "Gotcha"],
          code: "Integer a = 127, b = 127;\nSystem.out.println(a == b);        // true  (cached)\nInteger c = 128, d = 128;\nSystem.out.println(c == d);        // false (fresh objects)\nSystem.out.println(c.equals(d));   // true  (correct way)",
        },
        {
          tag: "exercise",
          title: "Build an Integer cache simulator",
          body: "Write an `IntegerBox` class that mirrors Java's caching: `IntegerBox.valueOf(n)` returns the same instance for `-128..127` and a new instance otherwise. Verify with `===` (TS reference equality = Java `==`) across the boundary. Also log an overflow demo: `2_147_483_647 + 1` in 32-bit signed math wraps to `-2_147_483_648`.",
          badges: ["Practice", "Autoboxing"],
        },
        {
          tag: "tip",
          title: "NaN is not equal to itself",
          body: "`Double.NaN == Double.NaN` is **false** — IEEE 754 says NaN is unordered. Use `Double.isNaN(x)` to detect it. In a `HashMap<Double, ?>` this means two NaN keys can coexist because `hashCode` uses bit equality but `equals` uses NaN semantics — an impressive gotcha.",
          badges: ["NaN", "IEEE 754"],
        },
        {
          tag: "key-point",
          title: "Quiz: == vs .equals()",
          body: "When is `Integer a == Integer b` reliable? **Never rely on it for correctness** — it's true only for cached values. Always use `.equals()` for wrappers. The `==` on primitives compares values; on references it compares identity.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Java Integer Cache + Overflow Simulator\nclass IntegerBox {\n  private static cache = new Map<number, IntegerBox>();\n\n  private constructor(public readonly value: number) {}\n\n  static valueOf(n: number): IntegerBox {\n    // Java caches -128..127 by default\n    if (n >= -128 && n <= 127) {\n      let boxed = IntegerBox.cache.get(n);\n      if (!boxed) {\n        boxed = new IntegerBox(n);\n        IntegerBox.cache.set(n, boxed);\n      }\n      return boxed;\n    }\n    return new IntegerBox(n);\n  }\n\n  equals(other: IntegerBox): boolean {\n    return this.value === other.value;\n  }\n}\n\n// Inside the cache\nconst a = IntegerBox.valueOf(127);\nconst b = IntegerBox.valueOf(127);\nconsole.log("127 same ref?        " + (a === b));         // true\n\n// Outside the cache\nconst c = IntegerBox.valueOf(128);\nconst d = IntegerBox.valueOf(128);\nconsole.log("128 same ref?        " + (c === d));         // false\nconsole.log("128 equals?          " + c.equals(d));       // true\n\n// 32-bit signed integer overflow (Java int wraps silently)\nfunction addInt(a: number, b: number): number {\n  const sum = a + b;\n  // Force 32-bit two's complement wrap\n  return (sum | 0);\n}\nconst MAX = 2147483647;\nconsole.log("MAX_VALUE + 1        " + addInt(MAX, 1));    // -2147483648\n\n// NaN is not equal to itself\nconst nan = Number.NaN;\nconsole.log("NaN === NaN          " + (nan === nan));     // false\nconsole.log("isNaN(NaN)           " + Number.isNaN(nan)); // true`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("IntegerBox") &&
          code.includes("valueOf") &&
          logs.some((l) => l.includes("127 same ref?        true")) &&
          logs.some((l) => l.includes("128 same ref?        false")) &&
          logs.some((l) => l.includes("-2147483648")) &&
          logs.some((l) => l.includes("NaN === NaN          false")),
        message: "Integer cache + overflow + NaN — all three classic Java primitive gotchas working.",
      }),
    },

    // ── Lesson 2 ─────────────────────────────────────────────────────────
    {
      title: "Java 2: Strings, Immutability & StringBuilder",
      content: [
        "Strings in Java are immutable objects stored in a special String Pool. Every concatenation creates a new String — which is why tight loops should use `StringBuilder` (not thread-safe, fast) or `StringBuffer` (thread-safe, slower).",
        "Build a benchmark simulator that proves concatenation is quadratic and StringBuilder is linear, plus demonstrate the pool's intern behavior.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The String Pool",
          body: "String **literals** (`\"hello\"`) are interned into a pool — duplicate literals share the same reference. `new String(\"hello\")` bypasses the pool and creates a fresh object on the heap. `s.intern()` manually promotes a String into the pool. This is why `\"a\" + \"b\" == \"ab\"` (both compile-time constants, interned) but `new String(\"ab\") == \"ab\"` is false.",
          badges: ["String Pool", "Immutable"],
          code: "String a = \"hello\";\nString b = \"hello\";\nString c = new String(\"hello\");\nSystem.out.println(a == b);          // true  (pool)\nSystem.out.println(a == c);          // false (new heap)\nSystem.out.println(a.equals(c));     // true  (value)\nSystem.out.println(a == c.intern()); // true  (promoted)",
        },
        {
          tag: "concept",
          title: "Why concatenation is quadratic",
          body: "`result = result + ch` in a loop builds a new String each iteration, copying all previous characters. For `n` iterations that's O(n²) work and O(n²) garbage. `StringBuilder.append(ch)` amortizes to O(1) per append by growing an internal `char[]`, giving the full loop O(n). For 100k iterations that's the difference between milliseconds and seconds.",
          badges: ["StringBuilder", "Performance"],
          code: "// BAD — O(n²)\nString s = \"\";\nfor (int i = 0; i < 10_000; i++) s = s + \"x\";\n\n// GOOD — O(n)\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 10_000; i++) sb.append('x');\nString result = sb.toString();",
        },
        {
          tag: "concept",
          title: "StringBuilder vs StringBuffer",
          body: "**`StringBuilder`** (Java 5+): not thread-safe, fast — the default choice. **`StringBuffer`** (Java 1.0): methods are `synchronized`, thread-safe but slower. 99% of code wants `StringBuilder`; use `StringBuffer` only when a shared buffer is appended from multiple threads (rare — usually you'd use a queue instead).",
          badges: ["Thread Safety"],
        },
        {
          tag: "exercise",
          title: "Build a concat vs builder benchmark",
          body: "Simulate both approaches. `concatLoop(n)` does quadratic concatenation — count the character copies (1+2+3+...+n). `builderLoop(n)` uses a growing buffer — count array resizes (doubling from 16). Log both totals for n=1000 and compare. You should see ~500,000 copies vs ~7 resizes.",
          badges: ["Practice", "Complexity"],
        },
        {
          tag: "tip",
          title: "Prefer `String.format` or text blocks for readable output",
          body: "For complex formatted output, `String.format(\"%-10s %5d\", name, count)` or Java 15+ text blocks (`\"\"\"multi\\nline\"\"\"`) beat `+` chains for readability. For hot paths, `StringBuilder` still wins on speed. Template expressions (JEP 430, preview) are the future.",
          badges: ["Formatting"],
        },
        {
          tag: "key-point",
          title: "Quiz: String immutability benefit",
          body: "Why are Strings immutable in Java? **Thread safety + hash caching + security** — an immutable String can be safely shared across threads, its hashCode can be cached (computed once), and sensitive paths (classloader URLs, file paths) can't be mutated after validation.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// String Concatenation vs StringBuilder Benchmark Simulator\nfunction concatLoop(n: number): { result: string; copies: number } {\n  let s = "";\n  let copies = 0;\n  for (let i = 0; i < n; i++) {\n    // Every + builds a new String: copies = length of old s + 1\n    copies += s.length + 1;\n    s = s + "x";\n  }\n  return { result: s, copies };\n}\n\nfunction builderLoop(n: number, initialCap = 16): { result: string; resizes: number; finalCap: number } {\n  let buf = new Array<string>(initialCap);\n  let len = 0;\n  let cap = initialCap;\n  let resizes = 0;\n  for (let i = 0; i < n; i++) {\n    if (len === cap) {\n      cap = cap * 2;\n      buf = buf.concat(new Array<string>(cap - buf.length));\n      resizes++;\n    }\n    buf[len++] = "x";\n  }\n  return { result: buf.slice(0, len).join(""), resizes, finalCap: cap };\n}\n\nconst N = 1000;\nconst concat = concatLoop(N);\nconst builder = builderLoop(N);\n\nconsole.log("=== Concatenation vs StringBuilder (n=" + N + ") ===");\nconsole.log("concat:  copies=" + concat.copies + "   (O(n^2) — half of n*(n+1))");\nconsole.log("builder: resizes=" + builder.resizes + "  finalCap=" + builder.finalCap + "  (O(log n) resizes)");\nconsole.log("ratio:   " + Math.round(concat.copies / builder.resizes) + "x more work for naive concat");\n\n// String Pool demo\nfunction poolDemo(): void {\n  const pool = new Map<string, object>();\n  function literal(s: string): object {\n    if (!pool.has(s)) pool.set(s, { value: s });\n    return pool.get(s)!;\n  }\n  function newString(s: string): object { return { value: s }; }\n\n  const a = literal("hello");\n  const b = literal("hello");\n  const c = newString("hello");\n  console.log("\\n=== String Pool ===");\n  console.log("literal == literal: " + (a === b));      // true\n  console.log("literal == new:     " + (a === c));      // false\n}\npoolDemo();`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("concatLoop") &&
          code.includes("builderLoop") &&
          logs.some((l) => l.includes("copies=")) &&
          logs.some((l) => l.includes("resizes=")) &&
          logs.some((l) => l.includes("literal == literal: true")) &&
          logs.some((l) => l.includes("literal == new:     false")),
        message: "You have proven why StringBuilder beats + in loops — and why the String Pool matters.",
      }),
    },

    // ── Lesson 3 ─────────────────────────────────────────────────────────
    {
      title: "Java 3: Control Flow, Labels & Early Returns",
      content: [
        "Java's control flow is familiar — `if`, `for`, `while`, `do-while`, `switch` — but Java has two features most devs forget: **labeled break/continue** (for nested loops) and the **traditional `switch` fall-through** which is why `switch expressions` were added in Java 14.",
        "Build a control-flow explorer that demonstrates labeled break, classic switch fall-through bugs, and how switch expressions fix them.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Labeled break & continue",
          body: "Nested loops can target an **outer** loop with a label. `outer: for (...) { for (...) { if (x) break outer; } }` exits both loops at once. `continue outer` skips to the next iteration of the outer loop. This is the cleanest way to short-circuit a matrix scan — without labels you'd need a flag or extract the inner code into a helper that `return`s.",
          badges: ["Labels", "Nested Loops"],
          code: "outer:\nfor (int i = 0; i < rows; i++) {\n  for (int j = 0; j < cols; j++) {\n    if (grid[i][j] == TARGET) {\n      found = new int[]{ i, j };\n      break outer;        // exits BOTH loops\n    }\n  }\n}",
        },
        {
          tag: "concept",
          title: "Switch fall-through: the classic bug",
          body: "Traditional `switch` falls through case to case unless you add `break`. Forgetting a `break` silently executes the next case — a notoriously hard-to-spot bug. **Switch expressions** (Java 14) use arrow syntax (`case A -> ...`) and don't fall through, and they can return a value. Always prefer them in new code.",
          badges: ["Switch", "Fall-through"],
          code: "// Classic switch — fall-through bug waiting to happen\nswitch (day) {\n  case MON: case TUE: case WED: case THU: case FRI:\n    type = \"weekday\"; break;\n  case SAT: case SUN:\n    type = \"weekend\"; break;\n}\n\n// Switch expression — Java 14+, no fall-through\nString type = switch (day) {\n  case MON, TUE, WED, THU, FRI -> \"weekday\";\n  case SAT, SUN                -> \"weekend\";\n};",
        },
        {
          tag: "exercise",
          title: "Build a matrix scanner with labeled break",
          body: "Write a function `findFirst(grid, target)` that scans a 2D array for a target value, breaks out of both loops on match, and returns the `[row, col]` coordinates (or `null`). Count how many cells were visited — it should stop immediately on match, not scan the rest.",
          badges: ["Practice", "Labels"],
        },
        {
          tag: "tip",
          title: "Prefer `return` over labels when extracting a helper is possible",
          body: "Labels are legal but unusual — many style guides discourage them. A small helper method that returns `Optional<Point>` or `null` reads more naturally to most readers. Use labels only when the nested loop is already small and extracting would cost more clarity than the label.",
          badges: ["Style"],
        },
        {
          tag: "key-point",
          title: "Quiz: Switch expression exhaustiveness",
          body: "If `day` is an enum, does the compiler force you to cover all cases in a switch **expression**? **Yes** — switch expressions must be exhaustive. Missing a case is a compile error. Switch statements (old style) don't enforce this.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Matrix Scanner with Labeled Break Simulator\ntype Grid = number[][];\ntype Point = { row: number; col: number; visited: number };\n\nfunction findFirst(grid: Grid, target: number): Point | null {\n  let visited = 0;\n  // Simulate labeled break with an explicit flag — TS has no labels\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[i].length; j++) {\n      visited++;\n      if (grid[i][j] === target) {\n        return { row: i, col: j, visited };\n      }\n    }\n  }\n  return null;\n}\n\n// Switch expression simulator\ntype Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";\nfunction dayType(d: Day): string {\n  // Mirrors Java 14 switch expression: exhaustive, no fall-through\n  switch (d) {\n    case "MON": case "TUE": case "WED": case "THU": case "FRI": return "weekday";\n    case "SAT": case "SUN":                                      return "weekend";\n  }\n}\n\nconst grid: Grid = [\n  [1, 2, 3, 4],\n  [5, 6, 7, 8],\n  [9, 10, 42, 12],  // target at (2, 2)\n  [13, 14, 15, 16],\n];\n\nconst found = findFirst(grid, 42);\nconsole.log("Target found at: " + JSON.stringify(found));\nconsole.log("Total cells: " + (4 * 4) + ", visited: " + (found?.visited ?? 0));\n\nconst missing = findFirst(grid, 999);\nconsole.log("\\nTarget 999: " + (missing ?? "not found"));\n\nconsole.log("\\n=== Switch Expression ===");\nfor (const d of ["MON", "WED", "FRI", "SAT", "SUN"] as Day[]) {\n  console.log(d + " -> " + dayType(d));\n}`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("findFirst") &&
          code.includes("dayType") &&
          logs.some((l) => l.includes("visited: 11")) &&
          logs.some((l) => l.includes("weekday")) &&
          logs.some((l) => l.includes("weekend")),
        message: "Labeled break + switch expressions — two Java control-flow tools most devs forget.",
      }),
    },

    // ── Lesson 4 ─────────────────────────────────────────────────────────
    {
      title: "Java 4: Arrays, Varargs & Defensive Copies",
      content: [
        "Java arrays are fixed-size, covariant, and reified (they know their element type at runtime) — unlike generics which are erased. Varargs (`String... args`) look like syntactic sugar, but they **are** arrays, with all the implications.",
        "Build an array toolkit: detect covariance pitfalls, implement a defensive-copy wrapper, and expose varargs behavior.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Covariant + reified arrays",
          body: "`String[]` is a subtype of `Object[]` — **array covariance**. That means `Object[] arr = new String[3]; arr[0] = 42;` **compiles** but throws `ArrayStoreException` at runtime. Arrays carry their component type; the JVM checks every store. Generics are the opposite: `List<String>` is **not** a subtype of `List<Object>` (invariant), but the type info is erased at runtime.",
          badges: ["Covariance", "Reified"],
          code: "Object[] arr = new String[3];\narr[0] = \"hello\";            // OK\narr[1] = 42;                  // throws ArrayStoreException at runtime\n\n// Generics are invariant — this won't even compile:\n// List<Object> list = new ArrayList<String>();  // error",
        },
        {
          tag: "concept",
          title: "Varargs are arrays",
          body: "`void log(String... messages)` is exactly `void log(String[] messages)` at the bytecode level. The compiler wraps call-site arguments into an array. This means (1) passing no args creates an empty array (not null), (2) you can pass an existing `String[]` directly, (3) autoboxing with `Integer...` works but is slow for hot paths.",
          badges: ["Varargs"],
          code: "static int sum(int... nums) {\n  int total = 0;\n  for (int n : nums) total += n;\n  return total;\n}\n\nsum();            // sum(new int[0])\nsum(1, 2, 3);     // sum(new int[]{1, 2, 3})\nint[] arr = {1, 2, 3};\nsum(arr);         // passes arr directly",
        },
        {
          tag: "exercise",
          title: "Build a defensive-copy wrapper",
          body: "A class exposing `int[] getValues()` can be sabotaged — the caller mutates the returned array. Write an `ImmutableInts` class that takes an array in the constructor, makes a defensive copy, and `getValues()` returns a fresh copy every call. Show that mutating the input array before construction and mutating the returned array after never affect internal state.",
          badges: ["Practice", "Defensive Copy"],
        },
        {
          tag: "tip",
          title: "Use `List.of(...)` or `Arrays.asList(...)` instead of arrays",
          body: "In modern Java, prefer immutable collections over arrays: `List.of(1, 2, 3)` returns an unmodifiable list — no defensive copy needed, and generics work properly. Arrays are still required for primitives and for varargs interop, but for ordinary data exchange, collections are safer.",
          badges: ["Modern Java"],
        },
        {
          tag: "key-point",
          title: "Quiz: ArrayStoreException",
          body: "Why doesn't `Object[] o = new Integer[3]; o[0] = \"hi\";` cause a compile error? **Array covariance** — the compiler accepts `Integer[]` as `Object[]` and can't statically tell that the underlying component type rejects `String`. The JVM catches it at runtime. Generics would have rejected this at compile time.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Defensive-copy immutable array wrapper + covariance demo\nclass ImmutableInts {\n  private readonly data: number[];\n\n  constructor(input: number[]) {\n    // Defensive copy on the way in\n    this.data = [...input];\n  }\n\n  get length(): number { return this.data.length; }\n\n  getValues(): number[] {\n    // Defensive copy on the way out\n    return [...this.data];\n  }\n\n  get(i: number): number {\n    if (i < 0 || i >= this.data.length) throw new Error("IndexOutOfBoundsException: " + i);\n    return this.data[i];\n  }\n}\n\n// Scenario: external code tries to sabotage our state\nconst source = [1, 2, 3];\nconst immutable = new ImmutableInts(source);\n\n// 1. Mutate the SOURCE after construction — defensive copy blocks this\nsource[0] = 999;\nconsole.log("after source mutation, get(0): " + immutable.get(0));  // 1\n\n// 2. Mutate the RETURNED array — defensive copy blocks this too\nconst exported = immutable.getValues();\nexported[1] = 888;\nconsole.log("after exported mutation, get(1): " + immutable.get(1)); // 2\n\nconsole.log("internal state intact: [" + immutable.getValues().join(", ") + "]");\n\n// Covariance demo (simulates ArrayStoreException)\nfunction simulateArrayStore<T>(compType: string, arr: unknown[], value: unknown): void {\n  if (typeof value !== compType) {\n    throw new Error("ArrayStoreException: " + typeof value + " into " + compType + "[]");\n  }\n  arr.push(value);\n}\n\nconst strArr: unknown[] = [];\nsimulateArrayStore("string", strArr, "hello");\nconsole.log("\\nStored 'hello' OK");\ntry {\n  simulateArrayStore("string", strArr, 42);\n} catch (e) {\n  console.log("Caught: " + (e as Error).message);\n}`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("ImmutableInts") &&
          code.includes("getValues") &&
          logs.some((l) => l.includes("get(0): 1")) &&
          logs.some((l) => l.includes("get(1): 2")) &&
          logs.some((l) => l.includes("ArrayStoreException")),
        message: "Defensive copies in and out — this is exactly the Effective Java pattern.",
      }),
    },

    // ── Lesson 5 ─────────────────────────────────────────────────────────
    {
      title: "Java 5: Methods, Overloading & the main Signature",
      content: [
        "Method overloading resolves at **compile time** (static binding) based on the *declared* type of the arguments, while overriding resolves at **runtime** (dynamic dispatch) based on the *actual* type. Confusing these two is a top-3 interview miss.",
        "Build a dispatch tracer that shows overload resolution happening statically — changing the declared type changes which overload is picked, even for the same runtime object.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Overloading = static, Overriding = dynamic",
          body: "**Overloading** picks a method by the compile-time types of arguments — identical within a single class. **Overriding** replaces a superclass method with a subclass version of the same signature, chosen at runtime by the actual object type. A child class method with a **different** parameter list isn't an override — it's an overload, and the parent method still exists.",
          badges: ["Static Binding", "Dynamic Dispatch"],
          code: "class Printer {\n  void print(Object o)   { System.out.println(\"Object\"); }\n  void print(String s)   { System.out.println(\"String\"); }\n}\n\nObject x = \"hello\";    // runtime: String, compile-time: Object\nnew Printer().print(x); // prints \"Object\" — overload resolved at compile time",
        },
        {
          tag: "concept",
          title: "Resolution rules in order",
          body: "When multiple overloads match, Java picks the **most specific** one in this order: (1) exact match, (2) widening conversion (`int -> long`), (3) autoboxing (`int -> Integer`), (4) varargs. Mixing these is a common gotcha — `call(1)` where you have `call(long)` and `call(Integer)` picks `call(long)` because widening beats boxing.",
          badges: ["Resolution"],
          code: "static void call(long n)    { System.out.println(\"long\"); }\nstatic void call(Integer n) { System.out.println(\"Integer\"); }\nstatic void call(int... n)  { System.out.println(\"varargs\"); }\n\ncall(1);  // prints \"long\" — widening int->long beats boxing int->Integer",
        },
        {
          tag: "concept",
          title: "The main signature",
          body: "Any of these are valid entry points: `public static void main(String[] args)`, `public static void main(String... args)` (varargs is just an array), `static public void main(...)` (modifier order doesn't matter). `main` must be **static** (no instance yet) and return **void**. Java 21 preview: unnamed classes and instance main methods.",
          badges: ["main", "Entry Point"],
        },
        {
          tag: "exercise",
          title: "Build a dispatch tracer",
          body: "Write `dispatch(declared, runtime)` that takes a 'declared type' name and simulates which overload wins. Given overloads for `Object`, `CharSequence`, and `String`, show that a `String` passed as `Object` picks the `Object` overload — and as `CharSequence` picks `CharSequence`. Overloading is decided *before* the JVM sees the real object.",
          badges: ["Practice", "Overloading"],
        },
        {
          tag: "tip",
          title: "Avoid overloading ambiguity",
          body: "Overloads that differ only by a parameter's superclass/subclass relationship invite bugs. Prefer distinct method names (`printObject`, `printString`) or distinct method count/kinds. Effective Java Item 52 goes further: *avoid* overloading with the same number of parameters where possible.",
          badges: ["Style"],
        },
        {
          tag: "key-point",
          title: "Quiz: The @Override trap",
          body: "What does `@Override` do at compile time? **It forces a compile error if the method doesn't actually override a parent method.** Without it, a typo (`equals(Object o)` vs `equls(Object o)`) silently becomes an overload instead of an override — one of the most common subtle Java bugs. Always use `@Override`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Method Overload Dispatch Tracer\ntype DeclaredType = "Object" | "CharSequence" | "String" | "Integer" | "long";\n\nclass OverloadTable {\n  private overloads = new Map<DeclaredType, string>();\n\n  register(declared: DeclaredType, name: string): this {\n    this.overloads.set(declared, name);\n    return this;\n  }\n\n  // Mirrors Java: most-specific overload wins — picked at compile time by declared type\n  resolve(declared: DeclaredType): string {\n    const found = this.overloads.get(declared);\n    if (found) return found;\n    // Fall back through the type hierarchy\n    const parents: Record<DeclaredType, DeclaredType | null> = {\n      String: "CharSequence",\n      CharSequence: "Object",\n      Integer: "Object",\n      Object: null,\n      long: null,\n    };\n    let cursor: DeclaredType | null = parents[declared];\n    while (cursor) {\n      const m = this.overloads.get(cursor);\n      if (m) return m + " (via " + cursor + ")";\n      cursor = parents[cursor];\n    }\n    return "NO MATCH";\n  }\n}\n\nconst printer = new OverloadTable()\n  .register("Object",       "print(Object)")\n  .register("CharSequence", "print(CharSequence)")\n  .register("String",       "print(String)");\n\n// Same runtime String, different declared types\nconsole.log("declared=String:       " + printer.resolve("String"));\nconsole.log("declared=CharSequence: " + printer.resolve("CharSequence"));\nconsole.log("declared=Object:       " + printer.resolve("Object"));\n\nconsole.log("\\n=== Widening vs Autoboxing ===");\nconst numeric = new OverloadTable()\n  .register("long",    "call(long)")\n  .register("Integer", "call(Integer)");\n// int literal — Java picks widening long over boxing Integer\nconsole.log("int literal -> " + numeric.resolve("long"));\nconsole.log("(If only Integer existed it would box; widening has higher priority)");`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("OverloadTable") &&
          code.includes("resolve") &&
          logs.some((l) => l.includes("print(String)")) &&
          logs.some((l) => l.includes("print(CharSequence)")) &&
          logs.some((l) => l.includes("print(Object)")) &&
          logs.some((l) => l.includes("call(long)")),
        message: "Dispatch tracer working — you can now predict which overload Java picks.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 2 — OOP & Types (Lessons 6-11)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 6 ─────────────────────────────────────────────────────────
    {
      title: "Java 6: Classes, Constructors & this/super",
      content: [
        "Every Java class has a **constructor** — either one you write or a compiler-inserted zero-arg default. Constructors use `this()` to chain to another constructor in the same class and `super()` to call a parent constructor (implicit if omitted).",
        "Build a construction-order tracer that proves the exact sequence: static blocks, parent constructor, instance initializers, child constructor body.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Construction order",
          body: "On `new Child()`: (1) static blocks of Parent and Child run **once** on class load, top-to-bottom. (2) Parent instance initializers + Parent constructor body run. (3) Child instance initializers + Child constructor body run. Missing this order is how people break subclassing — e.g., a Parent constructor calling an overridden method sees Child fields still at defaults.",
          badges: ["Order", "Lifecycle"],
          code: "class Parent {\n  int x = log(\"parent field\", 1);\n  Parent() { log(\"parent ctor\", 0); }\n  int log(String msg, int v) { System.out.println(msg); return v; }\n}\nclass Child extends Parent {\n  int y = log(\"child field\", 2);\n  Child() { log(\"child ctor\", 0); }\n}\n// new Child() prints: parent field, parent ctor, child field, child ctor",
        },
        {
          tag: "concept",
          title: "this() and super() rules",
          body: "Either `this(args)` **or** `super(args)` — never both — and it **must be the first statement** in a constructor. If you write neither, the compiler inserts `super()` (zero-arg parent). If the parent has no zero-arg constructor, you must call a specific `super(args)` explicitly or the child won't compile.",
          badges: ["this()", "super()"],
        },
        {
          tag: "exercise",
          title: "Build an init-order tracer",
          body: "Simulate Parent and Child classes with static init blocks, instance field initializers, and constructors. Use a shared `log: string[]` array. After `new Child()`, the log should contain the 4-step order exactly. Then create a second `Child` — static blocks should **not** fire again.",
          badges: ["Practice", "Lifecycle"],
        },
        {
          tag: "tip",
          title: "Never call overridable methods from a constructor",
          body: "If Parent's constructor calls `this.format()` and Child overrides `format()`, the Child version runs **before Child's constructor has initialized its fields** — they're still at default values (0/null/false). This is one of the sharpest traps in Java. Rule: constructors should only call `final`, `private`, or `static` methods.",
          badges: ["Effective Java", "Trap"],
        },
        {
          tag: "key-point",
          title: "Quiz: Default constructor",
          body: "When does the compiler NOT insert a default constructor? **When you define any constructor yourself.** As soon as you write `public Foo(int x) {...}`, there is no more zero-arg constructor unless you add one explicitly. This breaks frameworks like JPA that require a no-arg constructor.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Construction Order Tracer\nconst log: string[] = [];\n\nclass ParentClass {\n  static loaded = (() => { log.push("static Parent"); return true; })();\n  x = (() => { log.push("Parent field init"); return 1; })();\n  constructor() { log.push("Parent ctor body"); }\n}\n\nclass ChildClass extends ParentClass {\n  static loaded = (() => { log.push("static Child"); return true; })();\n  y = (() => { log.push("Child field init"); return 2; })();\n  constructor() {\n    super();  // Java's implicit super() is explicit in TS\n    log.push("Child ctor body");\n  }\n}\n\nlog.push("--- new ChildClass() ---");\nnew ChildClass();\nlog.push("--- new ChildClass() again ---");\nnew ChildClass();   // static blocks don't fire again\n\nfor (const line of log) console.log(line);`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("ParentClass") &&
          code.includes("ChildClass") &&
          logs.some((l) => l.includes("static Parent")) &&
          logs.some((l) => l.includes("Parent field init")) &&
          logs.some((l) => l.includes("Parent ctor body")) &&
          logs.some((l) => l.includes("Child ctor body")),
        message: "Construction order proven — statics once, then parent fields, parent ctor, child fields, child ctor.",
      }),
    },

    // ── Lesson 7 ─────────────────────────────────────────────────────────
    {
      title: "Java 7: Inheritance & Method Overriding",
      content: [
        "Overriding replaces a parent method with a child version at runtime. Rules: same name + parameter types, covariant return allowed, can't narrow access (`protected` → `public` OK, `public` → `protected` fails), can't throw broader checked exceptions.",
        "Build a dispatch table that proves dynamic dispatch: a `Parent` reference pointing to a `Child` instance calls the Child's overridden method.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Dynamic dispatch (polymorphism)",
          body: "Java uses **virtual method tables (vtables)** — each class has a table mapping method signatures to implementations. At `obj.method()`, the JVM reads `obj`'s actual class vtable (not the declared reference type). That's why `Parent p = new Child(); p.speak();` calls `Child.speak()`. This is the mechanism behind polymorphism.",
          badges: ["vtable", "Polymorphism"],
          code: "class Animal { String speak() { return \"...\"; } }\nclass Dog extends Animal { @Override String speak() { return \"woof\"; } }\nclass Cat extends Animal { @Override String speak() { return \"meow\"; } }\n\nAnimal a = new Dog();\nSystem.out.println(a.speak());  // \"woof\"",
        },
        {
          tag: "concept",
          title: "Overriding constraints",
          body: "A child override: (1) must have the **same** parameter types (not a compatible type — that's overloading), (2) may **narrow** the return type (covariant return: `Object` parent → `String` child), (3) can't **narrow** the access modifier, (4) can **remove** checked exceptions but not **add** new ones, (5) `static` methods are hidden not overridden (resolved by reference type).",
          badges: ["Rules", "Covariant Return"],
        },
        {
          tag: "concept",
          title: "Static methods are hidden, not overridden",
          body: "`class A { static void x() {...} }` and `class B extends A { static void x() {...} }` — calling `((A)b).x()` runs `A.x()`, not `B.x()`. Static methods don't participate in dynamic dispatch. This is a common interview gotcha.",
          badges: ["Static", "Hiding"],
          code: "A ref = new B();\nref.x();   // A.x() — NOT B.x(). Static calls bind at compile time.",
        },
        {
          tag: "exercise",
          title: "Build a shape hierarchy",
          body: "Define `Shape` (abstract) with `area()`. Create `Circle`, `Rectangle`, `Square` overrides. Put them in an array typed as `Shape[]` and compute the total area — polymorphism means you call `area()` once and each subclass's version runs. Print the class name + area per shape to prove the dispatch.",
          badges: ["Practice", "Polymorphism"],
        },
        {
          tag: "tip",
          title: "Mark with @Override, use final to lock",
          body: "Always `@Override` — catches typos and signals intent. To **prevent** further overriding, mark a method `final` — useful for template methods and security-sensitive code. To prevent subclassing entirely, mark the class `final` (or `sealed` in modern Java, see Lesson 10).",
          badges: ["Best Practice"],
        },
        {
          tag: "key-point",
          title: "Quiz: Covariant return",
          body: "Can a child's overriding method return a **different** type? **Only a subtype** (covariant return). Parent returns `Object`, child can return `String`. Parent returns `Number`, child can return `Integer`. A completely unrelated type would not satisfy the parent's contract.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Shape hierarchy with dynamic dispatch\nabstract class Shape {\n  abstract area(): number;\n  abstract kind(): string;\n}\n\nclass Circle extends Shape {\n  constructor(private r: number) { super(); }\n  area(): number { return Math.PI * this.r * this.r; }\n  kind(): string { return "Circle(r=" + this.r + ")"; }\n}\n\nclass Rectangle extends Shape {\n  constructor(private w: number, private h: number) { super(); }\n  area(): number { return this.w * this.h; }\n  kind(): string { return "Rectangle(" + this.w + "x" + this.h + ")"; }\n}\n\n// Square overrides area with a covariant-return-style specialization\nclass Square extends Rectangle {\n  constructor(side: number) { super(side, side); }\n  kind(): string { return "Square(side=" + (this.area() ** 0.5) + ")"; }\n}\n\nconst shapes: Shape[] = [\n  new Circle(5),\n  new Rectangle(3, 4),\n  new Square(6),\n];\n\nlet total = 0;\nfor (const s of shapes) {\n  // Dynamic dispatch: s.area() resolves to the actual subclass implementation\n  const a = s.area();\n  total += a;\n  console.log(s.kind().padEnd(22) + " area=" + a.toFixed(2));\n}\nconsole.log("\\nTotal area: " + total.toFixed(2));`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("abstract class Shape") &&
          code.includes("Circle") &&
          code.includes("Rectangle") &&
          code.includes("Square") &&
          logs.some((l) => l.includes("Circle")) &&
          logs.some((l) => l.includes("Square")) &&
          logs.some((l) => l.includes("Total area")),
        message: "Polymorphism working — one array, many actual types, correct method per object.",
      }),
    },

    // ── Lesson 8 ─────────────────────────────────────────────────────────
    {
      title: "Java 8: Polymorphism, Abstract & Interface",
      content: [
        "Both **abstract classes** and **interfaces** define contracts, but they're not interchangeable. Abstract classes can hold state and partial implementation; interfaces define behavior and (since Java 8) default methods, but no instance state.",
        "Build a design-decision helper: given requirements (shared state? multiple inheritance? private helpers?), it recommends abstract class vs interface and explains why.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Abstract class vs Interface",
          body: "**Abstract class**: single inheritance, can have fields, constructors, and any access modifier. Use when subclasses share **state** and partial implementation (Template Method pattern). **Interface**: multiple inheritance, no instance fields (only `public static final` constants), default + static + private methods since Java 8/9. Use for **capability** contracts (Comparable, Runnable, AutoCloseable).",
          badges: ["Abstract", "Interface"],
          code: "// Abstract — shared state + template method\nabstract class Processor {\n  protected final String name;\n  Processor(String name) { this.name = name; }\n  public final void run() { setup(); process(); teardown(); }\n  protected abstract void process();\n  protected void setup() {}\n  protected void teardown() {}\n}",
        },
        {
          tag: "concept",
          title: "Default methods (Java 8)",
          body: "`interface List<E> { default void sort(Comparator<E> c) {...} }` lets interfaces ship a default implementation without breaking existing implementers. This is how `Iterable.forEach`, `Collection.stream`, and `List.sort` were retrofitted. Conflict resolution: if two parent interfaces have the same default method, the implementer **must** override it (`Interface.super.method()` to pick one).",
          badges: ["default", "Java 8"],
          code: "interface Greeter {\n  default String greet(String name) { return \"Hello, \" + name; }\n}\nclass Impl implements Greeter {}\n// new Impl().greet(\"world\") -> \"Hello, world\" without writing a body",
        },
        {
          tag: "concept",
          title: "Private interface methods (Java 9)",
          body: "Before Java 9, shared logic between default methods had to be duplicated or moved to a package-private helper. Java 9 added **`private`** methods on interfaces — usable from default methods to share implementation without exposing it.",
          badges: ["private", "Java 9"],
          code: "interface Logger {\n  default void info(String m)  { log(\"INFO\",  m); }\n  default void error(String m) { log(\"ERROR\", m); }\n  private void log(String level, String m) { System.out.println(level + \" \" + m); }\n}",
        },
        {
          tag: "exercise",
          title: "Build a design advisor",
          body: "Write `advise(req)` where `req` has flags `{ sharedState, multipleInheritance, constructorLogic, publicConstants, templateMethod }`. Return `'abstract-class'`, `'interface'`, or `'both'` with a short rationale. Test with 4 realistic scenarios and log each recommendation.",
          badges: ["Practice", "Design"],
        },
        {
          tag: "tip",
          title: "Prefer interfaces for public APIs",
          body: "Exposing an abstract class as the public type forces every consumer into your class hierarchy. Interfaces leave consumers free to implement in any way, compose with other interfaces, and swap implementations. Use abstract classes as an **internal** implementation aid (often a \\`Skeletal\\` class backing an interface, e.g. \\`AbstractList\\` behind \\`List\\`).",
          badges: ["API Design"],
        },
        {
          tag: "key-point",
          title: "Quiz: Diamond problem",
          body: "Two interfaces `A` and `B` both have `default void f()`. A class `C implements A, B` — what happens? **Compile error.** Java forces C to override `f()` and pick explicitly (`A.super.f()` or `B.super.f()`) — explicit disambiguation, no silent choice.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Abstract vs Interface Design Advisor\ninterface Requirements {\n  sharedState: boolean;\n  multipleInheritance: boolean;\n  constructorLogic: boolean;\n  publicConstants: boolean;\n  templateMethod: boolean;\n}\n\ntype Advice = { choice: "abstract-class" | "interface" | "both"; rationale: string };\n\nfunction advise(req: Requirements): Advice {\n  if (req.constructorLogic || (req.sharedState && !req.multipleInheritance) || req.templateMethod) {\n    return {\n      choice: "abstract-class",\n      rationale: "Shared state + constructor logic + template method is what abstract classes are for.",\n    };\n  }\n  if (req.multipleInheritance && !req.sharedState) {\n    return {\n      choice: "interface",\n      rationale: "Multiple capabilities without shared state — interfaces compose, abstract classes do not.",\n    };\n  }\n  if (req.multipleInheritance && req.sharedState) {\n    return {\n      choice: "both",\n      rationale: "Public interface for the capability contract + internal abstract 'Skeletal' class for shared state (see AbstractList, AbstractMap).",\n    };\n  }\n  return { choice: "interface", rationale: "Default — prefer interfaces for public APIs." };\n}\n\nconst scenarios: [string, Requirements][] = [\n  ["LoggingService",      { sharedState: false, multipleInheritance: true,  constructorLogic: false, publicConstants: true,  templateMethod: false }],\n  ["AbstractProcessor",   { sharedState: true,  multipleInheritance: false, constructorLogic: true,  publicConstants: false, templateMethod: true  }],\n  ["CollectionLikeType",  { sharedState: true,  multipleInheritance: true,  constructorLogic: false, publicConstants: true,  templateMethod: true  }],\n  ["MarkerCapability",    { sharedState: false, multipleInheritance: true,  constructorLogic: false, publicConstants: false, templateMethod: false }],\n];\n\nfor (const [name, req] of scenarios) {\n  const a = advise(req);\n  console.log(name.padEnd(22) + " -> " + a.choice);\n  console.log("                       " + a.rationale);\n}`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("advise") &&
          logs.some((l) => l.includes("abstract-class")) &&
          logs.some((l) => l.includes("interface")) &&
          logs.some((l) => l.includes("both")),
        message: "Design advisor working — you can now justify abstract vs interface in a code review.",
      }),
    },

    // ── Lesson 9 ─────────────────────────────────────────────────────────
    {
      title: "Java 9: Composition over Inheritance",
      content: [
        "Inheritance creates a tight coupling that's hard to change — the LSP (Liskov Substitution Principle) demands every subclass be substitutable for its parent. Composition — 'has-a' instead of 'is-a' — gives you the same reuse with looser coupling and no fragile-base-class problem.",
        "Refactor a broken inheritance design into composition: a `CountingSet` that extends `HashSet` double-counts on `addAll`. Fix it with a delegating wrapper.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The fragile base class",
          body: "Classic bug: `CountingSet extends HashSet` overrides `add` to increment a counter, also overrides `addAll` to iterate and `add` each element. It works — until HashSet's **internal** `addAll` already calls `add` per element. Now every `addAll` double-counts. The parent's *implementation detail* (not its contract) leaked into the child. **You don't own the parent class — it can change.**",
          badges: ["Fragile", "LSP"],
        },
        {
          tag: "concept",
          title: "Composition + delegation",
          body: "Wrap instead of extend. `CountingSet` has a `Set<E> inner` field and implements `Set<E>` by delegating every method to `inner`, except `add` which also bumps the counter. Now the parent's internals can't leak — you only touch the contracted `Set` interface. This is also how `Collections.unmodifiableXxx` and `Collections.synchronizedXxx` are built.",
          badges: ["Delegation", "has-a"],
          code: "public class CountingSet<E> implements Set<E> {\n  private final Set<E> inner;\n  private int addCount = 0;\n  public CountingSet(Set<E> inner) { this.inner = inner; }\n\n  @Override public boolean add(E e) { addCount++; return inner.add(e); }\n  @Override public boolean addAll(Collection<? extends E> c) {\n    for (E e : c) add(e); return true;\n  }\n  // ... delegate every other Set method to inner\n}",
        },
        {
          tag: "concept",
          title: "When inheritance is still right",
          body: "Use inheritance when: (1) You **own** the parent class, (2) There's a true 'is-a' relationship (a `Square` is a `Rectangle` — but even this breaks LSP if Rectangle has `setWidth`!), (3) The parent was **designed for extension** (documented hooks, `protected` extension points, sealed hierarchies).",
          badges: ["Guidelines"],
        },
        {
          tag: "exercise",
          title: "Build a composition-based CountingList",
          body: "Create a `CountingList<T>` that wraps an inner `T[]`-backed list and implements `add`, `addAll`, `get`, `size`, and exposes `addCount`. Show that `addAll([1,2,3])` counts exactly 3 (not 6 — the bug) because you delegate to the inner `push` and not to your own `add`.",
          badges: ["Practice", "Composition"],
        },
        {
          tag: "tip",
          title: "Forwarding classes make delegation cheap",
          body: "Writing 20 delegation methods by hand is tedious. Effective Java calls this a **forwarding class** — often generated by IDE or annotation processors. Guava's `ForwardingList` gives you a skeletal forwarder; you override just the methods that need custom behavior.",
          badges: ["Forwarding"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why prefer composition?",
          body: "Name three benefits. **(1)** You're immune to parent changes — only the *interface* matters. **(2)** You can swap inner implementation at runtime (wrap a different set). **(3)** Test doubles — inject a mock inner for unit tests without subclassing.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Inheritance vs Composition — the classic CountingSet bug\n\n// BAD: inheritance-based — double-counts on addAll because\n// the parent addAll internally calls add()\nclass BrokenCountingList<T> extends Array<T> {\n  public addCount = 0;\n  add(v: T): void { this.addCount++; this.push(v); }\n  addAll(items: T[]): void {\n    this.addCount += items.length;  // naive bump\n    for (const v of items) this.add(v);  // but add() also bumps!\n  }\n}\n\n// GOOD: composition-based — delegates to inner, no double-count\nclass CountingList<T> {\n  private inner: T[] = [];\n  public addCount = 0;\n\n  add(v: T): void { this.addCount++; this.inner.push(v); }\n  // Delegate to inner — skip our own add() to avoid double-counting\n  addAll(items: T[]): void {\n    for (const v of items) { this.addCount++; this.inner.push(v); }\n  }\n  get size(): number { return this.inner.length; }\n  get(i: number): T { return this.inner[i]; }\n}\n\nconst broken = new BrokenCountingList<number>();\nbroken.addAll([1, 2, 3]);\nconsole.log("BROKEN  addCount: " + broken.addCount + "  (expected 3)");\n\nconst good = new CountingList<number>();\ngood.addAll([1, 2, 3]);\nconsole.log("FIXED   addCount: " + good.addCount + "  (expected 3)");\nconsole.log("FIXED   size:     " + good.size);`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("CountingList") &&
          logs.some((l) => l.includes("BROKEN  addCount: 6")) &&
          logs.some((l) => l.includes("FIXED   addCount: 3")),
        message: "Composition beats inheritance — delegation gives you counting without the double-count bug.",
      }),
    },

    // ── Lesson 10 ────────────────────────────────────────────────────────
    {
      title: "Java 10: Sealed Classes (Java 17)",
      content: [
        "**Sealed classes** (Java 17) let a type declare its permitted subclasses explicitly. The compiler can then perform exhaustive checks in switch expressions — the third leg of pattern matching, together with records and instanceof pattern.",
        "Build a sealed `Result<T>` hierarchy (Success | Failure) and implement exhaustive pattern matching — adding a new variant should force every switch to be updated.",
      ],
      sections: [
        {
          tag: "concept",
          title: "sealed permits",
          body: "`sealed class Shape permits Circle, Square, Triangle {}` — only the three named subtypes are allowed. Each subtype must be `final`, `sealed`, or `non-sealed` (explicitly opts back into open hierarchy). The compiler now **knows** the complete set of subtypes, enabling exhaustive checks.",
          badges: ["sealed", "permits"],
          code: "public sealed interface Result<T> permits Success, Failure {}\npublic record Success<T>(T value) implements Result<T> {}\npublic record Failure<T>(String reason) implements Result<T> {}",
        },
        {
          tag: "concept",
          title: "Exhaustive switch expressions",
          body: "With a sealed type, `switch (result)` over `Result<T>` lets the compiler verify every case is covered. Missing a case is a compile error. Add a new `Pending` variant later and every switch in your codebase fails to compile until you handle it — **this is the killer feature**. Compare to untagged subclasses where you rely on a `default` branch and hope.",
          badges: ["Exhaustive", "Pattern Matching"],
          code: "String describe(Result<User> r) {\n  return switch (r) {\n    case Success<User> s -> \"got \" + s.value().name();\n    case Failure<User> f -> \"failed: \" + f.reason();\n    // no default — compiler ensures exhaustiveness\n  };\n}",
        },
        {
          tag: "concept",
          title: "sealed vs enum vs union type",
          body: "**Enum**: fixed set of **instances**, each a stateless constant. **Sealed**: fixed set of **subtypes**, each with its own state and fields. **Union (TypeScript)**: compile-time tag, no runtime class. Sealed classes are the Java answer to ADTs (algebraic data types) — used heavily in functional patterns like `Optional`, `Result`, AST nodes, state machines.",
          badges: ["ADT", "Comparison"],
        },
        {
          tag: "exercise",
          title: "Build a Result<T> with exhaustive match",
          body: "Define a discriminated-union `Result<T> = Success<T> | Failure` using TS's tagged-union equivalent. Write `describe(r)` using a `switch (r.kind)` that the compiler proves is exhaustive (TS's `never` trick). Then add a `Pending` variant and watch every caller's type check fail until updated.",
          badges: ["Practice", "ADT"],
        },
        {
          tag: "tip",
          title: "Use sealed for state machines",
          body: "Any state machine — `Draft | Submitted | Approved | Rejected` — is a perfect fit. The compiler ensures every transition handler covers every state. Combined with records for payload, you get a fully-checked finite-state-machine in ~10 lines of Java.",
          badges: ["State Machine"],
        },
        {
          tag: "key-point",
          title: "Quiz: non-sealed",
          body: "When do you use `non-sealed`? **When you want the sealed parent to define its direct children, but one of those children should itself be openly extensible.** For example, a `sealed Shape permits Circle, Polygon` where `non-sealed class Polygon` can be extended freely — the seal stops at Polygon.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Sealed-style Result<T> with exhaustive matching (TS uses 'never' trick)\ntype Result<T> =\n  | { kind: "success"; value: T }\n  | { kind: "failure"; reason: string };\n\nfunction describe<T>(r: Result<T>): string {\n  switch (r.kind) {\n    case "success": return "got " + JSON.stringify(r.value);\n    case "failure": return "failed: " + r.reason;\n    // If we add a new variant (e.g. "pending"), TS forces exhaustiveness via never\n    default: {\n      const _exhaustive: never = r;\n      return _exhaustive;\n    }\n  }\n}\n\nfunction fetchUser(id: number): Result<{ id: number; name: string }> {\n  if (id < 0) return { kind: "failure", reason: "invalid id" };\n  return { kind: "success", value: { id, name: "User-" + id } };\n}\n\nconsole.log(describe(fetchUser(42)));\nconsole.log(describe(fetchUser(-1)));\n\n// State machine example\ntype OrderState =\n  | { kind: "draft" }\n  | { kind: "submitted"; at: number }\n  | { kind: "approved"; by: string }\n  | { kind: "rejected"; reason: string };\n\nfunction transition(current: OrderState, event: "submit" | "approve" | "reject"): OrderState {\n  switch (current.kind) {\n    case "draft":      return event === "submit"  ? { kind: "submitted", at: Date.now() } : current;\n    case "submitted":  return event === "approve" ? { kind: "approved", by: "manager" }\n                            : event === "reject"  ? { kind: "rejected", reason: "policy" } : current;\n    case "approved":   return current;  // terminal\n    case "rejected":   return current;  // terminal\n  }\n}\n\nlet order: OrderState = { kind: "draft" };\nfor (const ev of ["submit", "approve"] as const) {\n  order = transition(order, ev);\n  console.log("after " + ev + ": " + JSON.stringify(order));\n}`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("Result") &&
          code.includes("describe") &&
          code.includes("never") &&
          logs.some((l) => l.includes("got")) &&
          logs.some((l) => l.includes("failed")) &&
          logs.some((l) => l.includes("submitted")) &&
          logs.some((l) => l.includes("approved")),
        message: "Sealed-style ADT + exhaustive match + state machine — the Java 17 pattern for type-safe domains.",
      }),
    },

    // ── Lesson 11 ────────────────────────────────────────────────────────
    {
      title: "Java 11: Records & Value Semantics (Java 16)",
      content: [
        "**Records** (Java 16) are compact, immutable data carriers. One line — `record Point(int x, int y) {}` — gives you a private-final pair of fields, canonical constructor, accessors, `equals`, `hashCode`, and `toString`. They're the modern replacement for Lombok `@Value` and hand-written DTOs.",
        "Build a pricing DTO with a record, add a compact constructor for validation, derive a method, and prove `equals`/`hashCode` work from the component tuple.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What a record gives you for free",
          body: "`record User(String name, int age) {}` auto-generates: (1) `private final String name; private final int age;`, (2) a canonical constructor, (3) accessors `name()` and `age()` — note: no `get` prefix, (4) `equals`/`hashCode` from the component tuple, (5) `toString` as `User[name=..., age=...]`, (6) implicitly `final` — you can't extend a record.",
          badges: ["Records", "Java 16"],
          code: "public record User(String name, int age) {}\n// Auto-generated equivalents:\n//   name()  -> String\n//   age()   -> int\n//   equals, hashCode by (name, age) tuple\n//   toString -> \"User[name=alice, age=30]\"",
        },
        {
          tag: "concept",
          title: "Compact constructor for validation",
          body: "The **compact constructor** has no parameter list — the canonical parameters are already in scope. Use it to validate or normalize. The compiler then assigns to the fields from the (possibly modified) parameters. You can't reference `this.name = ...` in a compact constructor — you assign to the implicit parameter.",
          badges: ["Validation"],
          code: "public record Price(String currency, long cents) {\n  public Price {                          // compact — no param list\n    if (cents < 0) throw new IllegalArgumentException(\"negative\");\n    currency = currency.toUpperCase();    // normalize\n  }\n}",
        },
        {
          tag: "concept",
          title: "Derived methods & static factories",
          body: "Records are classes — you can add methods, static factories, even nested types. What you cannot do: add instance fields (state must come from the components) or extend another class (records are implicitly `final` and extend `Record`).",
          badges: ["Methods", "Factories"],
          code: "public record Money(long cents) {\n  public static Money usd(double dollars) { return new Money(Math.round(dollars * 100)); }\n  public Money plus(Money other) { return new Money(cents + other.cents); }\n  public double asDollars() { return cents / 100.0; }\n}",
        },
        {
          tag: "exercise",
          title: "Build a validated Price record",
          body: "Create a `Price` class mirroring a record: fields `currency` and `cents`, a constructor that uppercases currency and rejects negative cents, and a `plus` method. Use a `HashSet` / `Map` to prove that two `Price` objects with identical components are equal and share a hash code. Add a third `Price` with different cents to show they're not equal.",
          badges: ["Practice", "Records"],
        },
        {
          tag: "tip",
          title: "Records are for data, not behavior",
          body: "If your class has behavior beyond computing from its components — state transitions, side effects, external calls — a record is probably the wrong shape. Use a record for DTOs, value objects, message payloads, API responses, keys in maps. Use a class for services, aggregates, and anything with identity independent of its fields.",
          badges: ["Design"],
        },
        {
          tag: "key-point",
          title: "Quiz: Records and equals",
          body: "What defines record equality? **The component tuple.** `new User(\"a\", 1).equals(new User(\"a\", 1))` is true even though they're different objects. This makes records ideal as map keys — but only if all components are themselves value-like (primitives, Strings, immutable objects).",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Record-equivalent Price class with validation, derived methods, value equality\nclass Price {\n  readonly currency: string;\n  readonly cents: number;\n\n  constructor(currency: string, cents: number) {\n    // Compact constructor equivalent: validate + normalize\n    if (cents < 0) throw new Error("IllegalArgumentException: negative cents");\n    if (!/^[A-Za-z]{3}$/.test(currency)) throw new Error("IllegalArgumentException: invalid currency");\n    this.currency = currency.toUpperCase();\n    this.cents = cents;\n  }\n\n  plus(other: Price): Price {\n    if (other.currency !== this.currency) throw new Error("currency mismatch");\n    return new Price(this.currency, this.cents + other.cents);\n  }\n\n  asMajor(): number { return this.cents / 100; }\n\n  // equals — by component tuple\n  equals(other: Price): boolean {\n    return this.currency === other.currency && this.cents === other.cents;\n  }\n\n  // hashCode — tuple hash\n  hashCode(): number {\n    let h = 17;\n    for (const ch of this.currency) h = (h * 31 + ch.charCodeAt(0)) | 0;\n    return (h * 31 + this.cents) | 0;\n  }\n\n  toString(): string { return "Price[currency=" + this.currency + ", cents=" + this.cents + "]"; }\n}\n\nconst a = new Price("usd", 1250);\nconst b = new Price("USD", 1250);\nconst c = new Price("USD", 999);\n\nconsole.log(a.toString());\nconsole.log(b.toString());\nconsole.log("a equals b?     " + a.equals(b));                     // true — same components after normalization\nconsole.log("a.hashCode == b " + (a.hashCode() === b.hashCode())); // true\nconsole.log("a equals c?     " + a.equals(c));                     // false\n\nconst sum = a.plus(b);\nconsole.log("sum: " + sum.toString() + " = $" + sum.asMajor().toFixed(2));\n\ntry { new Price("USD", -5); } catch (e) { console.log("caught: " + (e as Error).message); }`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("class Price") &&
          code.includes("equals") &&
          code.includes("hashCode") &&
          logs.some((l) => l.includes("a equals b?     true")) &&
          logs.some((l) => l.includes("a equals c?     false")) &&
          logs.some((l) => l.includes("caught")),
        message: "Record-style Price — validation, value equality, derived methods. This is how modern Java models data.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 3 — Generics & Type System (Lessons 12-16)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 12 ────────────────────────────────────────────────────────
    {
      title: "Java 12: Generic Classes & Methods",
      content: [
        "Generics give you compile-time type safety without casts. A `Box<T>` can hold any type, and the compiler enforces that you only get out what you put in.",
        "Build a generic `Pair<A, B>` and a generic `swap` method. See how TS generics mirror Java's — minus the erasure.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Generic class",
          body: "`class Box<T> { private T value; public T get() { return value; } }`. The `T` is a type parameter — bound at each use site: `Box<String>`, `Box<Integer>`. The compiler checks every `put`/`get`; at runtime, generics are **erased** to `Object` (see Lesson 14).",
          badges: ["Generics"],
          code: "Box<String> b = new Box<>();\nb.set(\"hi\");\nString s = b.get();      // no cast needed\n// b.set(42);            // compile error",
        },
        {
          tag: "concept",
          title: "Generic method",
          body: "A method can declare its own type parameters, independent of its class: `public static <T> List<T> repeat(T x, int n) {...}`. Type inference usually picks `T` from the arguments — `repeat(\"x\", 3)` infers `T=String`.",
          badges: ["Methods"],
          code: "public static <T> void swap(T[] arr, int i, int j) {\n  T tmp = arr[i];\n  arr[i] = arr[j];\n  arr[j] = tmp;\n}",
        },
        {
          tag: "exercise",
          title: "Build a Pair<A, B>",
          body: "Create a `Pair<A, B>` class with `first`, `second`, and a `swap(): Pair<B, A>` method. Then write a generic `zip<A, B>(a: A[], b: B[]): Pair<A, B>[]`. Test with `Pair<string, number>` and show the swap returns `Pair<number, string>`.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Diamond operator",
          body: "Java 7+ infers the right-hand generic: `Map<String, List<Integer>> m = new HashMap<>();` — no need to repeat the types. Since Java 10, `var` makes it even tighter: `var m = new HashMap<String, List<Integer>>();`.",
          badges: ["Diamond", "var"],
        },
        {
          tag: "key-point",
          title: "Quiz: Generic static method",
          body: "Is this legal: `class Box<T> { static T identity(T x) { return x; } }`? **No.** A static method can't use the class's type parameter (it has no instance). Declare its own: `static <U> U identity(U x)`. Static context has no `T`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Generic Pair<A, B> and swap\nclass Pair<A, B> {\n  constructor(public readonly first: A, public readonly second: B) {}\n  swap(): Pair<B, A> { return new Pair<B, A>(this.second, this.first); }\n  toString(): string { return "(" + String(this.first) + ", " + String(this.second) + ")"; }\n}\n\nfunction zip<A, B>(a: A[], b: B[]): Pair<A, B>[] {\n  const n = Math.min(a.length, b.length);\n  const out: Pair<A, B>[] = [];\n  for (let i = 0; i < n; i++) out.push(new Pair<A, B>(a[i], b[i]));\n  return out;\n}\n\nconst p = new Pair<string, number>("age", 30);\nconsole.log("original:  " + p.toString());\nconsole.log("swapped:   " + p.swap().toString());\n\nconst zipped = zip(["x", "y", "z"], [1, 2, 3]);\nconsole.log("\\nzipped: " + zipped.map(p => p.toString()).join(", "));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("class Pair") &&
          code.includes("swap") &&
          code.includes("zip") &&
          logs.some((l) => l.includes("(age, 30)")) &&
          logs.some((l) => l.includes("(30, age)")),
        message: "Generic Pair + zip working — type-safe pairs and a helper that preserves both type parameters.",
      }),
    },

    // ── Lesson 13 ────────────────────────────────────────────────────────
    {
      title: "Java 13: Wildcards & PECS",
      content: [
        "`? extends T` is a **producer** bound — you can only **read** T out of it. `? super T` is a **consumer** bound — you can only **write** T into it. The rule is PECS: **Producer Extends, Consumer Super**.",
        "Build helpers that prove which operations are legal under each bound. Then see why `List<Number>` is not a subtype of `List<Object>` (generics are invariant).",
      ],
      sections: [
        {
          tag: "concept",
          title: "Invariance by default",
          body: "`List<Integer>` is **not** a subtype of `List<Number>`, even though `Integer extends Number`. Generics are **invariant**. The reason: if the assignment were legal, you could `add(3.14)` to a `List<Number>` reference that actually points to a `List<Integer>` — runtime heap pollution. Wildcards are Java's way to relax invariance safely.",
          badges: ["Invariance"],
        },
        {
          tag: "concept",
          title: "? extends T — producer",
          body: "`List<? extends Number> list` means 'a list of *some* specific subtype of Number — I don't know which'. You can `get()` items as `Number`, but you **can't `add()`** anything (except `null`) — the compiler doesn't know the exact type. Use this when you only **read**.",
          badges: ["extends", "Read"],
          code: "List<? extends Number> nums = List.of(1, 2, 3);  // actually List<Integer>\nNumber n = nums.get(0);   // OK — everything is a Number\n// nums.add(4);           // compile error — can't add to unknown subtype",
        },
        {
          tag: "concept",
          title: "? super T — consumer",
          body: "`List<? super Integer> list` means 'a list of *some* specific supertype of Integer'. You can `add(Integer)` safely (it fits any supertype), but `get()` only returns `Object`. Use this when you only **write**.",
          badges: ["super", "Write"],
          code: "List<? super Integer> sink = new ArrayList<Number>();\nsink.add(42);          // OK — Integer fits Number or Object\nObject x = sink.get(0); // best you can say about the element",
        },
        {
          tag: "exercise",
          title: "Implement `copy<T>(src, dest)` using PECS",
          body: "Signature: `copy<T>(src: T[] as 'producer', dest: T[] as 'consumer')`. Annotate intent with comments showing where `? extends T` vs `? super T` would apply. Log a run with `src = Integer[]` and `dest = Number[]` — in Java this requires `copy(List<? extends Integer>, List<? super Integer>)`.",
          badges: ["Practice", "PECS"],
        },
        {
          tag: "tip",
          title: "Collections.copy uses PECS",
          body: "`public static <T> void copy(List<? super T> dest, List<? extends T> src)` — the classic PECS example from `java.util.Collections`. Memorize that signature and you've memorized PECS.",
          badges: ["Collections"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why can't you add to ? extends",
          body: "`List<? extends Number> l = new ArrayList<Integer>();` — why does `l.add(5)` fail to compile? **Because the compiler only knows it's *some* subtype of Number — possibly `Double`. Adding an `Integer` could violate that.** Safety over convenience.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// PECS (Producer Extends, Consumer Super) demo\n\n// A "producer" you only READ from\ntype Producer<T> = { get(i: number): T; size(): number };\n// A "consumer" you only WRITE to\ntype Consumer<T> = { add(v: T): void };\n\nclass NumList implements Producer<number>, Consumer<number> {\n  private data: number[] = [];\n  add(v: number): void { this.data.push(v); }\n  get(i: number): number { return this.data[i]; }\n  size(): number { return this.data.length; }\n}\n\n// copy<T>(src as producer, dest as consumer) — mirrors Collections.copy\nfunction copy<T>(src: Producer<T>, dest: Consumer<T>): void {\n  for (let i = 0; i < src.size(); i++) dest.add(src.get(i));\n}\n\nconst integers = new NumList();\n[1, 2, 3].forEach((n) => integers.add(n));\n\nconst numbers = new NumList();\ncopy<number>(integers, numbers);\n\nconsole.log("copied " + numbers.size() + " items");\nfor (let i = 0; i < numbers.size(); i++) console.log("  [" + i + "] = " + numbers.get(i));\n\n// In Java:  Collections.copy(List<? super Number> dest, List<? extends Number> src)\nconsole.log("\\nPECS memory aid:");\nconsole.log("  Producer Extends — you READ T out of it");\nconsole.log("  Consumer Super   — you WRITE T into it");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("copy") &&
          code.includes("Producer") &&
          code.includes("Consumer") &&
          logs.some((l) => l.includes("copied 3")) &&
          logs.some((l) => l.includes("Producer Extends")),
        message: "PECS applied — you now know which bound a generic API should use.",
      }),
    },

    // ── Lesson 14 ────────────────────────────────────────────────────────
    {
      title: "Java 14: Type Erasure & Bridge Methods",
      content: [
        "At runtime, `List<String>` and `List<Integer>` are both just `List` — the type parameters are **erased**. This is why you can't do `new T[]` or `if (x instanceof List<String>)`. It's also why the JVM stayed backward-compatible when generics were added in Java 5.",
        "Build a demo that proves two generic types share the same class at runtime, and sketch how bridge methods let a generic subclass remain binary-compatible.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What gets erased",
          body: "After compilation, `List<String>` becomes `List`, `Box<T>` becomes `Box` with `T` replaced by its bound (default `Object`). Casts are inserted at call sites. This means: (1) `list.getClass() == list2.getClass()` for any two generic lists, (2) you can't overload on different type parameters alone — `method(List<String>)` and `method(List<Integer>)` collide.",
          badges: ["Erasure"],
          code: "List<String> a = new ArrayList<>();\nList<Integer> b = new ArrayList<>();\nSystem.out.println(a.getClass() == b.getClass());  // true — both ArrayList",
        },
        {
          tag: "concept",
          title: "What you can't do",
          body: "You can't: (1) create a generic array `new T[n]` (compiler needs reified T), (2) throw a generic exception `throw new MyException<String>(...)` (catch uses instanceof), (3) write `instanceof List<String>` (use `instanceof List<?>`), (4) have two methods `void f(List<A>)` and `void f(List<B>)` — both erase to `f(List)`.",
          badges: ["Limitations"],
        },
        {
          tag: "concept",
          title: "Bridge methods",
          body: "When a generic class is overridden, the compiler generates a **bridge method** — a synthetic method with erased types that delegates to the real overriding method. This keeps the vtable consistent across erasure. You'll see it in stack traces as a method with `$bridge` or in `getDeclaredMethods`.",
          badges: ["Bridge"],
          code: "class Parent<T> { T value; T get() { return value; } }\nclass StringChild extends Parent<String> {\n  @Override String get() { return value; }  // override\n}\n// Compiler adds synthetic:\n//   Object get() { return (String) this.getAsString(); }  // bridge",
        },
        {
          tag: "exercise",
          title: "Prove erasure at runtime",
          body: "Create two `GenericBox<T>` instances — one with a string, one with a number. Log their 'class name' (use a marker field that mirrors what `getClass()` would return). They should be identical — `GenericBox`, not `GenericBox<string>`. Then show an overloaded method conflict.",
          badges: ["Practice", "Erasure"],
        },
        {
          tag: "tip",
          title: "TypeToken & super type tokens",
          body: "To carry generic info at runtime (e.g. for JSON deserialization), libraries like Guava and Jackson use **super type tokens**: `new TypeToken<List<String>>(){}`. The anonymous subclass preserves the parameterized type in its reflective signature, which the library reads via reflection.",
          badges: ["TypeToken"],
        },
        {
          tag: "key-point",
          title: "Quiz: Array vs List",
          body: "Why can you do `new String[10]` but not `new T[10]`? **Arrays are reified — they carry their component type at runtime. Generics are erased.** That's also why arrays are covariant but generics are invariant.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Type Erasure Demonstration\nclass GenericBox<T> {\n  // The "runtime class" has no type argument — this mirrors erasure\n  static readonly className = "GenericBox";\n  constructor(public value: T) {}\n  runtimeClass(): string { return GenericBox.className; }\n}\n\nconst strBox = new GenericBox<string>("hello");\nconst numBox = new GenericBox<number>(42);\n\nconsole.log("strBox class: " + strBox.runtimeClass());\nconsole.log("numBox class: " + numBox.runtimeClass());\nconsole.log("same class at runtime? " + (strBox.runtimeClass() === numBox.runtimeClass()));\n\n// Simulate: two overloaded methods that would collide after erasure\nclass BadOverload {\n  // In Java:\n  //   void f(List<String> l) {}\n  //   void f(List<Integer> l) {}  // compile error — same erasure\n  // The erased signatures would both be: f(List)\n}\n\nconsole.log("\\nBad overload attempt:");\nconsole.log("  void f(List<String>)   -> erases to f(List)");\nconsole.log("  void f(List<Integer>)  -> erases to f(List)");\nconsole.log("  -> compile error: name clash");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("GenericBox") &&
          logs.some((l) => l.includes("same class at runtime? true")) &&
          logs.some((l) => l.includes("name clash")),
        message: "Erasure demonstrated — same runtime class, name-clash overloads. This is why `List<T>.class` doesn't exist.",
      }),
    },

    // ── Lesson 15 ────────────────────────────────────────────────────────
    {
      title: "Java 15: Bounded Type Parameters",
      content: [
        "`<T extends Comparable<T>>` says T must implement `Comparable<T>`. Bounds let you call methods on T without casts, while keeping the method generic.",
        "Build a generic `max` that returns the largest element of a list under a `<T extends Comparable<T>>` bound — and see what happens when you try to call `max` on a list of a non-comparable type.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Upper bounds",
          body: "`<T extends Number>` — T must be Number or a subtype. Inside the method you can call Number methods on T. **Multiple bounds**: `<T extends Number & Comparable<T>>` — the first must be a class (or none), the rest are interfaces. Fewer than 1% of Java code uses multi-bound, but it's legal.",
          badges: ["extends"],
          code: "public static <T extends Number> double sum(List<T> nums) {\n  double total = 0;\n  for (T n : nums) total += n.doubleValue();  // Number method\n  return total;\n}",
        },
        {
          tag: "concept",
          title: "Self-bounded type (F-bound)",
          body: "`<T extends Comparable<T>>` reads: 'T is comparable **to itself**'. This rules out weird cases like `Integer` being comparable to `String`. You'll see the same pattern in `Enum<E extends Enum<E>>` — the self-bound is how Java makes enum operations type-safe without casts.",
          badges: ["F-bound", "Self-reference"],
          code: "// From java.lang.Enum — the archetypal F-bound\npublic abstract class Enum<E extends Enum<E>> implements Comparable<E>, Serializable {\n  public final int compareTo(E o) { ... }\n}",
        },
        {
          tag: "exercise",
          title: "Build a bounded `max`",
          body: "Write `max<T extends Comparable<T>>(items: T[]): T`. For each element, call `compareTo` on the running max. Test with numbers (TS `number` doesn't implement Comparable, so wrap in a `ComparableNumber` class). Also test with a `Semver` class that compares by major.minor.patch.",
          badges: ["Practice", "Bounds"],
        },
        {
          tag: "tip",
          title: "Lower bounds for type parameters don't exist",
          body: "Java allows `<T extends X>` (upper bound) but **not** `<T super X>` (lower bound). Lower bounds only exist for **wildcards** (`? super X`). If you need lower-bound-like behavior on a type parameter, you usually want a wildcard instead.",
          badges: ["Gotcha"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why F-bound in Enum",
          body: "Why does `Enum` use `E extends Enum<E>` and not just `Enum<E>`? **To guarantee `compareTo(E)` only compares values of the same enum class.** Without the self-bound, the compiler would allow `Color.RED.compareTo(Size.LARGE)` — a nonsense comparison across enum types.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Bounded generic max — T must be Comparable<T>\ninterface Comparable<T> { compareTo(other: T): number; }\n\nclass CNum implements Comparable<CNum> {\n  constructor(public readonly value: number) {}\n  compareTo(other: CNum): number { return this.value - other.value; }\n  toString(): string { return String(this.value); }\n}\n\nclass Semver implements Comparable<Semver> {\n  constructor(public readonly maj: number, public readonly min: number, public readonly patch: number) {}\n  compareTo(o: Semver): number {\n    if (this.maj !== o.maj) return this.maj - o.maj;\n    if (this.min !== o.min) return this.min - o.min;\n    return this.patch - o.patch;\n  }\n  toString(): string { return this.maj + "." + this.min + "." + this.patch; }\n}\n\nfunction max<T extends Comparable<T>>(items: T[]): T {\n  if (items.length === 0) throw new Error("empty");\n  let best = items[0];\n  for (let i = 1; i < items.length; i++) {\n    if (items[i].compareTo(best) > 0) best = items[i];\n  }\n  return best;\n}\n\nconst nums = [3, 14, 7, 1, 42, 9].map((n) => new CNum(n));\nconsole.log("max number: " + max(nums));\n\nconst versions = [new Semver(1, 2, 3), new Semver(1, 10, 0), new Semver(1, 2, 10), new Semver(2, 0, 0)];\nconsole.log("max semver: " + max(versions));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("max") &&
          code.includes("compareTo") &&
          logs.some((l) => l.includes("max number: 42")) &&
          logs.some((l) => l.includes("max semver: 2.0.0")),
        message: "Bounded generic max works on any Comparable<T> — numbers, semvers, anything you can compare.",
      }),
    },

    // ── Lesson 16 ────────────────────────────────────────────────────────
    {
      title: "Java 16: var, Type Inference & Lambdas",
      content: [
        "Java 10's `var` keyword gives you local type inference — the compiler figures out the type from the right-hand side. It's not dynamic typing; it's just less keystrokes. Combined with diamond operator and lambdas, modern Java feels very different from Java 8.",
        "Build a style guide checker that flags good vs bad uses of `var` based on the Java team's official guidelines (JEP 286).",
      ],
      sections: [
        {
          tag: "concept",
          title: "Where var works",
          body: "**Local variables with initializers only** — `var list = new ArrayList<String>();` works, `var x;` doesn't (no RHS to infer from). Not allowed for: method parameters, method return types, fields, or uninitialized locals. `var` is a soft keyword — `var` as a variable name still works.",
          badges: ["var", "Local"],
          code: "var list = new ArrayList<String>();   // List<String>\nvar stream = Files.lines(path);         // Stream<String>\nfor (var line : lines) { ... }          // var for-each",
        },
        {
          tag: "concept",
          title: "When var hurts readability",
          body: "`var result = compute();` — what's `result`? A `List`, a `Future`, a primitive? Without a good variable name, `var` hides information. The official guidance: use `var` when the RHS **obviously** names the type (`new ArrayList<String>()`, factory methods like `List.of(...)`, static types that are all over your codebase).",
          badges: ["Readability"],
        },
        {
          tag: "concept",
          title: "Lambdas + inference",
          body: "`Function<String, Integer> len = s -> s.length();` — the parameter type is inferred from the target type (`Function<String, Integer>`). Combined with `var`, you get `var fn = (Function<String, Integer>) s -> s.length();` — but usually just declare the functional type.",
          badges: ["Lambdas"],
        },
        {
          tag: "exercise",
          title: "Build a var style checker",
          body: "Write `checkVar(declaration)` that takes `{ rhs: string, varName: string }` and returns `'good'` or `'bad'` with a reason. Rules: good if RHS contains `new Type(...)` or `Type.of(...)`; bad if RHS is a bare method call like `compute()` or `get()` (hidden type). Run on 6 examples.",
          badges: ["Practice", "Style"],
        },
        {
          tag: "tip",
          title: "Diamond still works with var",
          body: "`var map = new HashMap<String, Integer>();` — var infers `HashMap<String, Integer>`, not the interface. If you wanted `Map<String, Integer>`, you still write it out: `Map<String, Integer> map = new HashMap<>();`. Choose explicit for API boundaries, var for short-lived locals.",
          badges: ["Diamond"],
        },
        {
          tag: "key-point",
          title: "Quiz: var and null",
          body: "`var x = null;` — legal? **No.** The compiler can't infer a type from `null` alone. Write `String x = null;` or `var x = (String) null;`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// var style checker\ntype Decl = { rhs: string; varName: string };\ntype Verdict = { ok: boolean; reason: string };\n\nfunction checkVar(d: Decl): Verdict {\n  const rhs = d.rhs.trim();\n  // Good: explicit constructor\n  if (/^new\\s+[A-Z][A-Za-z0-9_<>]*\\(/.test(rhs))\n    return { ok: true, reason: "explicit constructor names the type" };\n  // Good: static factory like List.of, Map.of, Optional.of\n  if (/^[A-Z][A-Za-z0-9_]*\\.(of|ofEntries|copyOf)\\(/.test(rhs))\n    return { ok: true, reason: "factory method names the type" };\n  // Good: literal with obvious type\n  if (/^("|[0-9]|true|false|\\[)/.test(rhs))\n    return { ok: true, reason: "literal — type obvious" };\n  // Bad: bare method call hides the type\n  if (/^[a-z][A-Za-z0-9_]*\\(/.test(rhs))\n    return { ok: false, reason: "bare method call hides the return type — write it explicitly" };\n  return { ok: false, reason: "ambiguous — reader can't tell the type" };\n}\n\nconst examples: Decl[] = [\n  { varName: "list",   rhs: "new ArrayList<String>()" },\n  { varName: "users",  rhs: "List.of(\\"a\\", \\"b\\")" },\n  { varName: "count",  rhs: "42" },\n  { varName: "result", rhs: "compute()" },\n  { varName: "data",   rhs: "fetch()" },\n  { varName: "map",    rhs: "Map.ofEntries(...)" },\n];\n\nfor (const e of examples) {\n  const v = checkVar(e);\n  console.log((v.ok ? "OK  " : "BAD ") + "var " + e.varName.padEnd(8) + " = " + e.rhs.padEnd(30) + "  // " + v.reason);\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("checkVar") &&
          logs.some((l) => l.includes("OK  var list")) &&
          logs.some((l) => l.includes("BAD var result")),
        message: "Style checker working — you can now tell good var from bad var in a code review.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 4 — Collections (Lessons 17-22)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 17 ────────────────────────────────────────────────────────
    {
      title: "Java 17: ArrayList vs LinkedList",
      content: [
        "`ArrayList` is backed by a resizing array: O(1) random access, O(n) insertion in the middle. `LinkedList` is a doubly-linked list: O(n) random access, O(1) insertion at ends. In practice `ArrayList` wins almost everywhere — modern CPUs crush linked-list cache-miss latency.",
        "Build a benchmark that counts array copies vs node allocations for the same workload, then explain why the `LinkedList` name is misleading in 2026.",
      ],
      sections: [
        {
          tag: "concept",
          title: "ArrayList internals",
          body: "Backed by `Object[] elementData` (default initial capacity 10). On `add` at the end: O(1) amortized; on resize, grows by 1.5x and `System.arraycopy` copies the old elements. On `add(i, elem)` in the middle: O(n) — shifts all elements after `i` right by one.",
          badges: ["ArrayList"],
        },
        {
          tag: "concept",
          title: "LinkedList internals",
          body: "Doubly-linked list of `Node { item, prev, next }`. Every insert allocates a new node (GC pressure). Random access `get(i)` walks from head or tail. Because nodes are scattered in memory, cache misses dominate — typically 5-10x slower than `ArrayList` even for sequential iteration.",
          badges: ["LinkedList"],
        },
        {
          tag: "concept",
          title: "When to use which",
          body: "**`ArrayList`**: the default — random access, append, iterate. **`ArrayDeque`**: if you need a stack or queue (faster than `LinkedList`). **`LinkedList`**: essentially never. The only niche is middle-insertion *with an existing iterator position* — and even then profile first.",
          badges: ["Guidelines"],
          code: "// Prefer ArrayDeque over LinkedList for queue/stack\nDeque<Integer> stack = new ArrayDeque<>();\nDeque<Integer> queue = new ArrayDeque<>();\nstack.push(1); stack.pop();\nqueue.offer(1); queue.poll();",
        },
        {
          tag: "exercise",
          title: "Build a capacity grower",
          body: "Simulate ArrayList growth: start at capacity 10, grow by 1.5x each time `add` would overflow. Append 1000 items. Log each resize (new capacity + total copies so far). Compare to LinkedList: 1000 node allocations, zero resizes, but each access is O(n).",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Pre-size when possible",
          body: "If you know the size, pass it to the constructor: `new ArrayList<>(1000)`. That skips all intermediate resizes. The default 10 → 15 → 22 → 33... chain wastes work for large collections.",
          badges: ["Perf"],
        },
        {
          tag: "key-point",
          title: "Quiz: Iterator.remove vs list.remove",
          body: "You're iterating a list and removing elements. Which is safe? **`iterator.remove()`** — `list.remove()` throws `ConcurrentModificationException` because the iterator sees the underlying size change behind its back. Or use `removeIf(Predicate)` — cleanest.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// ArrayList growth simulator vs LinkedList node allocations\nclass ArrayListSim<T> {\n  private data: (T | undefined)[];\n  private cap: number;\n  private len = 0;\n  public copies = 0;\n  public resizes = 0;\n\n  constructor(initial = 10) { this.cap = initial; this.data = new Array(initial); }\n\n  add(v: T): void {\n    if (this.len === this.cap) {\n      const newCap = Math.floor(this.cap * 1.5) + 1;\n      const fresh = new Array<T | undefined>(newCap);\n      for (let i = 0; i < this.len; i++) { fresh[i] = this.data[i]; this.copies++; }\n      this.data = fresh; this.cap = newCap; this.resizes++;\n    }\n    this.data[this.len++] = v;\n  }\n  size(): number { return this.len; }\n}\n\nclass LinkedListSim<T> {\n  public nodes = 0;\n  private head: { v: T; next?: unknown } | null = null;\n  private tail: { v: T; next?: unknown } | null = null;\n  add(v: T): void {\n    const node = { v, next: undefined } as { v: T; next?: { v: T; next?: unknown } };\n    this.nodes++;\n    if (!this.head) this.head = this.tail = node;\n    else { (this.tail as { next?: unknown }).next = node; this.tail = node; }\n  }\n}\n\nconst al = new ArrayListSim<number>();\nconst ll = new LinkedListSim<number>();\nfor (let i = 0; i < 1000; i++) { al.add(i); ll.add(i); }\n\nconsole.log("ArrayList: resizes=" + al.resizes + " copies=" + al.copies);\nconsole.log("LinkedList: nodes=" + ll.nodes + " (1 alloc per add, no resizes)");\nconsole.log("\\nArrayList wastes fewer ops BUT benefits from cache locality —");\nconsole.log("a sequential scan is 5-10x faster in real JVMs.");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("ArrayListSim") &&
          code.includes("LinkedListSim") &&
          logs.some((l) => l.includes("resizes=")) &&
          logs.some((l) => l.includes("nodes=1000")),
        message: "You have quantified the two data structures — prefer ArrayList unless you profile and prove otherwise.",
      }),
    },

    // ── Lesson 18 ────────────────────────────────────────────────────────
    {
      title: "Java 18: HashMap Internals",
      content: [
        "`HashMap` is an array of buckets (default 16), each a chain of `Node(hash, key, value, next)`. Lookup: hash the key, pick the bucket, walk the chain. Java 8 adds: when a bucket's chain exceeds 8 nodes, it **upgrades to a red-black tree** — O(log n) worst case on collisions.",
        "Build a tiny HashMap that shows bucketing, collision chains, resize at the load factor, and the treeify threshold at chain length 8.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Hash, bucket, chain",
          body: "`bucket = hash(key) & (table.length - 1)`. The `& (n-1)` is why `table.length` is always a power of 2 — the mask cheaply replaces modulo. `hash(key)` in Java 8 XORs the high bits: `h ^ (h >>> 16)` to spread poor-quality hashes across buckets.",
          badges: ["Hashing"],
          code: "static final int hash(Object key) {\n  int h;\n  return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);\n}",
        },
        {
          tag: "concept",
          title: "Load factor & resize",
          body: "Default load factor is 0.75 — when size > capacity * 0.75, the table doubles and **every entry is rehashed**. Doubling means each entry stays in its old bucket or moves to `oldBucket + oldCap` — cheap. Too-low load factor wastes memory; too-high load factor means long chains.",
          badges: ["Load Factor"],
        },
        {
          tag: "concept",
          title: "Treeification (Java 8+)",
          body: "If a bucket's chain reaches **8** nodes **and** the table has at least **64** buckets, the chain converts to a **red-black tree** — lookups drop from O(n) to O(log n). On removal below 6, it degrades back to a list. This mitigates worst-case hash attacks and poor hashCode impls.",
          badges: ["Treeify", "RBTree"],
        },
        {
          tag: "exercise",
          title: "Build a mini HashMap",
          body: "Implement `MiniMap` with: `put(k, v)`, `get(k)`, `size`, and a `buckets()` view. Bucket count = 16 initially, double on load > 0.75. Use a chain (array) per bucket. Insert 30 entries and log the bucket distribution + whether any bucket hit the treeify threshold.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "hashCode quality matters",
          body: "A bad `hashCode` that returns `1` for all keys turns a HashMap into a linked list — every operation O(n). `Objects.hash(field1, field2)` is the lazy-correct choice; for perf-critical keys, hand-roll using primes (`17 * 31 + field.hashCode()`).",
          badges: ["hashCode"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why table is power-of-2",
          body: "Why is HashMap's table length always a power of 2? **So bucket = hash & (n-1) works** — a bitmask is 10-50x faster than modulo on most CPUs. If you chose a prime capacity you'd need `hash % n` which is slower.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Mini HashMap — bucketing, collisions, resize\nclass MiniMap<K, V> {\n  private table: Array<{ k: K; v: V }[] | undefined>;\n  private cap: number;\n  private _size = 0;\n  private static TREEIFY = 8;\n  private static LOAD = 0.75;\n\n  constructor(initial = 16) { this.cap = initial; this.table = new Array(initial); }\n\n  private hash(k: K): number {\n    const s = String(k);\n    let h = 0;\n    for (const ch of s) h = ((h * 31) + ch.charCodeAt(0)) | 0;\n    return (h ^ (h >>> 16)) & (this.cap - 1);\n  }\n\n  put(k: K, v: V): void {\n    const bucket = this.hash(k);\n    const chain = this.table[bucket] ?? (this.table[bucket] = []);\n    const existing = chain.find((e) => e.k === k);\n    if (existing) { existing.v = v; return; }\n    chain.push({ k, v });\n    this._size++;\n    if (this._size > this.cap * MiniMap.LOAD) this.resize();\n  }\n\n  get(k: K): V | undefined {\n    const chain = this.table[this.hash(k)];\n    return chain?.find((e) => e.k === k)?.v;\n  }\n\n  private resize(): void {\n    const old = this.table;\n    this.cap *= 2;\n    this.table = new Array(this.cap);\n    this._size = 0;\n    for (const chain of old) if (chain) for (const { k, v } of chain) this.put(k, v);\n  }\n\n  stats(): { cap: number; size: number; chains: number[]; treeifyWarn: boolean } {\n    const chains = this.table.map((c) => (c ? c.length : 0));\n    return { cap: this.cap, size: this._size, chains, treeifyWarn: chains.some((l) => l >= MiniMap.TREEIFY) };\n  }\n}\n\nconst m = new MiniMap<string, number>();\nfor (let i = 0; i < 30; i++) m.put("key-" + i, i);\n\nconst s = m.stats();\nconsole.log("cap=" + s.cap + " size=" + s.size);\nconsole.log("chain lengths: [" + s.chains.join(", ") + "]");\nconsole.log("any bucket at treeify threshold? " + s.treeifyWarn);\nconsole.log("lookup key-17: " + m.get("key-17"));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("MiniMap") &&
          code.includes("put") &&
          code.includes("get") &&
          logs.some((l) => l.includes("size=30")) &&
          logs.some((l) => l.includes("lookup key-17: 17")),
        message: "Mini HashMap working — you can now explain bucket + chain + resize in a whiteboard interview.",
      }),
    },

    // ── Lesson 19 ────────────────────────────────────────────────────────
    {
      title: "Java 19: equals/hashCode Contract",
      content: [
        "Break the `equals`/`hashCode` contract and your objects silently disappear from HashMaps and HashSets. The contract is five rules — and *the* most common Java bug is violating one of them.",
        "Build a contract checker that verifies reflexive, symmetric, transitive, consistent equals, plus the equals-implies-equal-hashCode rule.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The five rules",
          body: "(1) **Reflexive**: `x.equals(x)` is true. (2) **Symmetric**: `x.equals(y)` iff `y.equals(x)`. (3) **Transitive**: `x==y && y==z` implies `x==z`. (4) **Consistent**: repeated calls return the same result (no mutation between calls). (5) **`x.equals(null)` is false**. Plus: `x.equals(y)` implies `x.hashCode() == y.hashCode()`.",
          badges: ["Contract"],
        },
        {
          tag: "concept",
          title: "The classic break: symmetry",
          body: "`CaseInsensitiveString.equals(String)` is seductive — but breaks symmetry. A `String` doesn't know anything about the custom class. `cis.equals(str)` might be true; `str.equals(cis)` is false. **Rule: only return true if the other object is the same class (or `instanceof this class`).**",
          badges: ["Symmetry"],
          code: "// BAD — breaks symmetry\npublic boolean equals(Object o) {\n  if (o instanceof String)        return this.s.equalsIgnoreCase((String) o);\n  if (o instanceof CaseInsensitive) return this.s.equalsIgnoreCase(((CaseInsensitive) o).s);\n  return false;\n}",
        },
        {
          tag: "concept",
          title: "hashCode must match equals",
          body: "If `a.equals(b)`, then `a.hashCode() == b.hashCode()`. Failing this makes the object unusable in hash-based collections: you can `put` then `get` an equal key and get `null`. Records auto-generate both; for classes use `Objects.hash(field1, field2)` or an IDE generator.",
          badges: ["hashCode"],
        },
        {
          tag: "exercise",
          title: "Build a contract checker",
          body: "Write `checkContract(a, b, c)` that runs each of the 5 rules against three objects and reports pass/fail. Use a broken class (`BrokenPoint` — mutates state in equals) and a correct one (`GoodPoint`). Show the broken one failing consistency.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer records or Lombok @EqualsAndHashCode",
          body: "Hand-writing these is error-prone. For DTOs, use `record` (Java 16+). For non-record classes, use Lombok's `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` or `@Data`. Always generate, never write by hand.",
          badges: ["Tools"],
        },
        {
          tag: "key-point",
          title: "Quiz: Mutable hashCode",
          body: "Is it OK to use a mutable field in `hashCode`? **No.** If you put the object in a HashMap then mutate the field, the bucket calculation changes — you can never find it again. `hashCode` must depend only on fields set at construction (or be refreshed on every mutation — expensive and brittle).",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// equals/hashCode contract checker\ninterface Equatable { equals(o: unknown): boolean; hashCode(): number; }\n\nclass GoodPoint implements Equatable {\n  constructor(public readonly x: number, public readonly y: number) {}\n  equals(o: unknown): boolean {\n    if (!(o instanceof GoodPoint)) return false;\n    return this.x === o.x && this.y === o.y;\n  }\n  hashCode(): number { return (this.x * 31 + this.y) | 0; }\n}\n\nfunction checkContract(a: Equatable, b: Equatable, c: Equatable): void {\n  const reflexive = a.equals(a) && b.equals(b);\n  const symmetric = a.equals(b) === b.equals(a);\n  const transitive = a.equals(b) && b.equals(c) ? a.equals(c) : true;\n  const consistent = a.equals(b) === a.equals(b);\n  const nonNull = a.equals(null) === false;\n  const hashMatch = !a.equals(b) || a.hashCode() === b.hashCode();\n  console.log("reflexive:    " + reflexive);\n  console.log("symmetric:    " + symmetric);\n  console.log("transitive:   " + transitive);\n  console.log("consistent:   " + consistent);\n  console.log("non-null:     " + nonNull);\n  console.log("hash matches: " + hashMatch);\n}\n\nconst p1 = new GoodPoint(1, 2);\nconst p2 = new GoodPoint(1, 2);\nconst p3 = new GoodPoint(1, 2);\nconsole.log("=== GoodPoint ===");\ncheckContract(p1, p2, p3);\n\nconsole.log("\\n=== In a Map ===");\nconst m = new Map<string, string>();\nfunction keyOf(p: GoodPoint): string { return p.x + "," + p.y; }\nm.set(keyOf(p1), "first");\nconsole.log("lookup with equal point: " + m.get(keyOf(p2)));  // "first"`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("checkContract") &&
          code.includes("GoodPoint") &&
          logs.some((l) => l.includes("reflexive:    true")) &&
          logs.some((l) => l.includes("symmetric:    true")) &&
          logs.some((l) => l.includes("lookup with equal point: first")),
        message: "All 5 contract rules pass — your objects will behave in HashMaps and Sets.",
      }),
    },

    // ── Lesson 20 ────────────────────────────────────────────────────────
    {
      title: "Java 20: TreeMap & Sorted Collections",
      content: [
        "`TreeMap` is a red-black tree — O(log n) ops, ordered iteration, and range queries (`headMap`, `subMap`, `tailMap`). `HashMap` is faster per op but unordered. Pick based on whether you need ordering.",
        "Build a range-query example over a TreeMap-like structure and measure how range queries let you answer 'all entries between X and Y' in O(log n + k).",
      ],
      sections: [
        {
          tag: "concept",
          title: "TreeMap properties",
          body: "Natural ordering by key (or a provided `Comparator`). All ops O(log n). `firstKey()`, `lastKey()`, `ceilingKey(k)`, `floorKey(k)`, `higherKey(k)`, `lowerKey(k)` — unique powers of the tree. Iteration is in sorted order, at the cost of ~2x overhead per put/get vs HashMap.",
          badges: ["TreeMap"],
        },
        {
          tag: "concept",
          title: "NavigableMap / NavigableSet",
          body: "Both `TreeMap` and `TreeSet` implement `NavigableMap`/`NavigableSet` — giving you `subMap(from, to)` views that are live (modifications propagate). Great for range queries, time-series bucketing, leaderboard top-N.",
          badges: ["Navigable"],
          code: "TreeMap<LocalDate, Event> events = ...;\nSortedMap<LocalDate, Event> today =\n  events.subMap(LocalDate.now(), LocalDate.now().plusDays(1));",
        },
        {
          tag: "exercise",
          title: "Build a range-query map",
          body: "Implement a `SortedBag<V>` over numeric keys using a sorted array. Methods: `put(k, v)`, `get(k)`, `rangeClosed(lo, hi): V[]`. Use binary search to locate the range boundaries. Insert 100 entries and query a 10-key window — should be O(log n + 10).",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "LinkedHashMap preserves insertion order",
          body: "Between `HashMap` (unordered, fastest) and `TreeMap` (sorted, slowest) sits `LinkedHashMap`: O(1) ops plus insertion-order iteration. It also supports access-order mode for building LRU caches (`removeEldestEntry` hook).",
          badges: ["LinkedHashMap"],
        },
        {
          tag: "key-point",
          title: "Quiz: When TreeMap beats HashMap",
          body: "When should you reach for TreeMap? **When you need range queries, ordered iteration, or nearest-key lookup.** For pure key-value storage with no ordering needs, HashMap is faster.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Sorted-key bag with range queries (TreeMap-style)\nclass SortedBag<V> {\n  private keys: number[] = [];\n  private values: V[] = [];\n\n  private bsearch(k: number): number {\n    let lo = 0, hi = this.keys.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >>> 1;\n      if (this.keys[mid] < k) lo = mid + 1; else hi = mid;\n    }\n    return lo;\n  }\n\n  put(k: number, v: V): void {\n    const i = this.bsearch(k);\n    if (this.keys[i] === k) { this.values[i] = v; return; }\n    this.keys.splice(i, 0, k);\n    this.values.splice(i, 0, v);\n  }\n\n  get(k: number): V | undefined {\n    const i = this.bsearch(k);\n    return this.keys[i] === k ? this.values[i] : undefined;\n  }\n\n  rangeClosed(lo: number, hi: number): V[] {\n    const start = this.bsearch(lo);\n    const end = this.bsearch(hi + 0.000001);\n    return this.values.slice(start, end);\n  }\n}\n\nconst bag = new SortedBag<string>();\nfor (let i = 0; i < 100; i++) bag.put(i, "v" + i);\n\nconst window = bag.rangeClosed(40, 49);\nconsole.log("range [40..49] size: " + window.length);\nconsole.log("first: " + window[0] + ", last: " + window[window.length - 1]);\nconsole.log("get(42): " + bag.get(42));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("SortedBag") &&
          code.includes("rangeClosed") &&
          logs.some((l) => l.includes("range [40..49] size: 10")) &&
          logs.some((l) => l.includes("get(42): v42")),
        message: "Range queries in O(log n + k) — this is why TreeMap exists.",
      }),
    },

    // ── Lesson 21 ────────────────────────────────────────────────────────
    {
      title: "Java 21: ConcurrentHashMap & Lock Striping",
      content: [
        "`ConcurrentHashMap` (CHM) is thread-safe without locking the whole table. Java 8+ uses **fine-grained synchronization per bucket** + CAS on the head node. Read is lock-free; write locks only its bucket.",
        "Simulate the lock-striping design: 16 bucket-locks, concurrent writers touching different buckets don't block each other.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Segments → per-bucket locks (Java 8)",
          body: "Java 7 CHM used 16 'segments' (default concurrency level), each a mini HashMap with its own lock. Java 8 dropped segments: now every **bucket** can be locked independently via `synchronized` on the bucket's head node — finer granularity, lock-free reads with `volatile`.",
          badges: ["CHM", "Lock Striping"],
        },
        {
          tag: "concept",
          title: "CAS on empty buckets",
          body: "First write to an empty bucket uses `compareAndSwap` (CAS) on the `tab[i]` slot — no lock, just a single atomic instruction. Only if CAS fails (contention) does it fall back to `synchronized`. That's why CHM absolutely crushes a plain `synchronized HashMap`.",
          badges: ["CAS"],
          code: "// CHM.putVal (simplified)\nif ((f = tabAt(tab, i)) == null) {\n  if (casTabAt(tab, i, null, new Node(hash, k, v))) break;  // no lock\n}\nelse synchronized (f) {    // lock ONLY this bucket's chain\n  // walk + update\n}",
        },
        {
          tag: "concept",
          title: "Weak consistency for iterators",
          body: "CHM iterators are **weakly consistent** — they don't throw `ConcurrentModificationException`, but may or may not see concurrent updates. `size()` is a rough estimate, not a snapshot. `keySet().toArray()` is consistent *per bucket*. This is a deliberate trade for scalability.",
          badges: ["Consistency"],
        },
        {
          tag: "exercise",
          title: "Simulate lock-striped writes",
          body: "Build a `StripedMap<K, V>` with 16 stripes. On `put`, pick stripe by `hash(k) & 15`. Simulate 4 concurrent workers writing 1000 keys each, logging contention events (when two workers pick the same stripe). Show why even-stripe distribution gives near-zero contention.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "compute/merge are atomic",
          body: "`chm.compute(k, (k, v) -> v == null ? 1 : v + 1)` is atomic for a single bucket. Use it instead of `get` + `put` for counters. Same for `merge(k, 1, Integer::sum)` — the cleanest atomic-increment in Java.",
          badges: ["Atomic"],
          code: "ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();\ncounts.merge(word, 1, Integer::sum);  // atomic counter increment",
        },
        {
          tag: "key-point",
          title: "Quiz: ConcurrentHashMap vs Collections.synchronizedMap",
          body: "Why is CHM faster than `Collections.synchronizedMap(new HashMap<>())`? **synchronizedMap locks the entire map per call** — one writer blocks everyone. CHM locks only the affected bucket (and reads are lock-free). Under contention, CHM is 10-100x faster.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Lock-striped concurrent map simulator\nclass StripedMap<K, V> {\n  private static STRIPES = 16;\n  private table: Map<K, V>[] = Array.from({ length: StripedMap.STRIPES }, () => new Map());\n  public contentions = 0;\n  private inUse: boolean[] = new Array(StripedMap.STRIPES).fill(false);\n\n  private stripeOf(k: K): number {\n    const s = String(k);\n    let h = 0;\n    for (const c of s) h = ((h * 31) + c.charCodeAt(0)) | 0;\n    return (h & 0x7fffffff) % StripedMap.STRIPES;\n  }\n\n  put(k: K, v: V): void {\n    const i = this.stripeOf(k);\n    if (this.inUse[i]) this.contentions++;\n    this.inUse[i] = true;\n    try { this.table[i].set(k, v); }\n    finally { this.inUse[i] = false; }\n  }\n\n  get(k: K): V | undefined {\n    // Reads are lock-free\n    return this.table[this.stripeOf(k)].get(k);\n  }\n\n  size(): number {\n    return this.table.reduce((n, m) => n + m.size, 0);\n  }\n}\n\nconst map = new StripedMap<string, number>();\n// Simulate 4 workers, each writing 1000 non-overlapping keys\nfor (let w = 0; w < 4; w++) {\n  for (let i = 0; i < 1000; i++) map.put("worker-" + w + "-k-" + i, i);\n}\nconsole.log("size: " + map.size());\nconsole.log("contentions (sequential, so 0 by construction): " + map.contentions);\nconsole.log("lookup: " + map.get("worker-2-k-500"));\nconsole.log("\\nIn real Java, CHM uses CAS for first write to an empty bucket +");\nconsole.log("synchronized on the head node for collision — near-zero contention.");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("StripedMap") &&
          code.includes("stripeOf") &&
          logs.some((l) => l.includes("size: 4000")) &&
          logs.some((l) => l.includes("worker-2-k-500: 500")),
        message: "Lock striping demonstrated — you can now explain why CHM beats synchronizedMap 100x.",
      }),
    },

    // ── Lesson 22 ────────────────────────────────────────────────────────
    {
      title: "Java 22: CopyOnWriteArrayList & When It Wins",
      content: [
        "`CopyOnWriteArrayList` copies the entire backing array on every **write**. Reads are lock-free and consistent. Use when reads vastly outnumber writes — classic case: event-listener lists, cached config.",
        "Build a simulator that counts reads vs writes, and see when the copy cost becomes worthwhile.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The COW strategy",
          body: "Every `add`/`remove` allocates a new array with the change and atomically replaces the reference. Readers holding an old reference finish their iteration unaffected — **snapshot semantics**, no `ConcurrentModificationException`. The trade: write cost is O(n) (array copy), memory churn.",
          badges: ["COW"],
        },
        {
          tag: "concept",
          title: "When COW wins",
          body: "**Event listeners**: registered once, invoked thousands of times per second. **Cache snapshots**: periodic refresh, constant reads. **Observer lists**: tiny lists with occasional changes. Rule of thumb: reads > 100x writes.",
          badges: ["Use Cases"],
        },
        {
          tag: "concept",
          title: "Iterators are snapshots",
          body: "A `CopyOnWriteArrayList` iterator references the backing array **at creation time**. Subsequent modifications don't affect iteration — and `iterator.remove()` throws `UnsupportedOperationException`. For mutation during iteration, use `ArrayList` + explicit sync, or `ConcurrentLinkedQueue`.",
          badges: ["Iterator"],
        },
        {
          tag: "exercise",
          title: "Build a COW list + crossover calculator",
          body: "Implement `CowList<T>` with `add`, `get`, `snapshot()`. Track the total `copyCost` (sum of sizes at each write) and `readCost` (number of reads). Find the crossover: at what read:write ratio does COW beat a copy-on-every-read design?",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "COW is almost never the right default",
          body: "If your write rate is anything beyond occasional, COW will hurt. `ConcurrentLinkedQueue` is better for high-throughput FIFO. `ConcurrentHashMap.newKeySet()` is better for concurrent sets. COW is a niche tool — know when to reach for it.",
          badges: ["Guideline"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why no ConcurrentModificationException",
          body: "Why don't COW iterators throw CME? **Each iterator holds its own snapshot — the array it sees is immutable to it.** Later writes create new arrays; the iterator never sees them.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Copy-on-write list simulator\nclass CowList<T> {\n  private arr: readonly T[] = [];\n  public writes = 0;\n  public reads = 0;\n  public copyCost = 0;\n\n  add(v: T): void {\n    const next = this.arr.slice();\n    next.push(v);\n    this.arr = next;\n    this.writes++;\n    this.copyCost += this.arr.length;\n  }\n\n  get(i: number): T {\n    this.reads++;\n    return this.arr[i];\n  }\n\n  size(): number { return this.arr.length; }\n  snapshot(): readonly T[] { return this.arr; }\n}\n\nconst list = new CowList<string>();\nfor (let i = 0; i < 20; i++) list.add("listener-" + i);\n// Lots of reads (e.g., dispatching events)\nfor (let e = 0; e < 10_000; e++) {\n  for (let i = 0; i < list.size(); i++) list.get(i);\n}\n\nconsole.log("writes:    " + list.writes);\nconsole.log("reads:     " + list.reads);\nconsole.log("copyCost:  " + list.copyCost + " element-copies");\nconsole.log("read/write: " + (list.reads / list.writes).toFixed(0) + "x — COW is great here");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("CowList") &&
          logs.some((l) => l.includes("writes:    20")) &&
          logs.some((l) => l.includes("reads:     200000")),
        message: "COW in action — 10000:1 read-write ratio is where CopyOnWriteArrayList shines.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 5 — Streams & Functional (Lessons 23-27)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 23 ────────────────────────────────────────────────────────
    {
      title: "Java 23: Lambdas & Functional Interfaces",
      content: [
        "A **functional interface** has exactly one abstract method. Lambdas (`x -> x * 2`) are syntactic sugar for implementing one. The `java.util.function` package provides the core set: `Function`, `Predicate`, `Consumer`, `Supplier`, `BiFunction`.",
        "Build a lambda-based pipeline with `Function.compose` and `Function.andThen`, then use method references (`String::length`) and show they're equivalent to equivalent lambdas.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The functional interface",
          body: "`@FunctionalInterface interface Func { int apply(int x); }`. Exactly one abstract method (SAM = Single Abstract Method). `default` and `static` methods don't count against the single. The annotation is optional but catches accidents (second abstract method = compile error).",
          badges: ["SAM", "FunctionalInterface"],
          code: "@FunctionalInterface\ninterface Adder { int add(int a, int b); }\n\nAdder plus = (a, b) -> a + b;\nplus.add(2, 3);   // 5",
        },
        {
          tag: "concept",
          title: "The core five",
          body: "**`Function<T, R>`**: `R apply(T)`. **`Predicate<T>`**: `boolean test(T)`. **`Consumer<T>`**: `void accept(T)`. **`Supplier<T>`**: `T get()`. **`BiFunction<T, U, R>`**: two args. Primitive specializations avoid boxing: `IntFunction<R>`, `ToIntFunction<T>`, `IntPredicate`, etc.",
          badges: ["java.util.function"],
        },
        {
          tag: "concept",
          title: "Method references",
          body: "Four kinds: (1) **static**: `Integer::parseInt`. (2) **bound instance**: `obj::method`. (3) **unbound instance**: `String::length` — the receiver becomes the first arg. (4) **constructor**: `ArrayList::new`. All produce equivalent lambdas and are often more readable.",
          badges: ["::"],
          code: "Function<String, Integer> len1 = s -> s.length();   // lambda\nFunction<String, Integer> len2 = String::length;    // method ref",
        },
        {
          tag: "exercise",
          title: "Build a Function pipeline",
          body: "Implement `compose` and `andThen` on a tiny `Func<A, B>` class — `f.andThen(g)` returns `x => g(f(x))`, `g.compose(f)` returns `x => g(f(x))` (same result, different read order). Chain 4 functions that trim, uppercase, prefix with '> ', and truncate to 10 chars. Run on 3 inputs.",
          badges: ["Practice", "Composition"],
        },
        {
          tag: "tip",
          title: "Lambdas capture effectively final",
          body: "Lambdas can reference local variables **only if they're `final` or effectively final** (never reassigned). This prevents data races in closed-over state and lets the compiler transform lambdas into static call sites. If you need mutation, use an `AtomicInteger` or a single-element array.",
          badges: ["Capture"],
        },
        {
          tag: "key-point",
          title: "Quiz: Lambda vs anonymous class",
          body: "What's the main difference? **A lambda doesn't create a `this` — it captures the enclosing `this`. Anonymous classes create their own `this`.** Lambdas are also compiled to `invokedynamic` + LambdaMetafactory (no separate class file per lambda).",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Function composition + method references\nclass Func<A, B> {\n  constructor(public apply: (a: A) => B) {}\n  andThen<C>(g: Func<B, C>): Func<A, C> { return new Func((a) => g.apply(this.apply(a))); }\n  compose<Z>(g: Func<Z, A>): Func<Z, B> { return new Func((z) => this.apply(g.apply(z))); }\n}\n\nconst trim     = new Func<string, string>((s) => s.trim());\nconst upper    = new Func<string, string>((s) => s.toUpperCase());\nconst prefix   = new Func<string, string>((s) => "> " + s);\nconst truncate = new Func<string, string>((s) => s.length > 10 ? s.slice(0, 10) + "..." : s);\n\n// pipeline: trim -> upper -> prefix -> truncate\nconst pipeline = trim.andThen(upper).andThen(prefix).andThen(truncate);\n\nfor (const s of ["  hello world  ", "java", "   how are you today  "]) {\n  console.log("[" + s + "] -> " + pipeline.apply(s));\n}\n\n// "method ref" equivalent\nconst len1: (s: string) => number = (s) => s.length;   // lambda\nconst len2: (s: string) => number = "".constructor.prototype.length ? ((s: string) => s.length) : ((s: string) => s.length);\nconsole.log("\\nlen1('hello')=" + len1("hello") + " len2('world')=" + len2("world"));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("andThen") &&
          code.includes("compose") &&
          logs.some((l) => l.includes("> HELLO WOR")) &&
          logs.some((l) => l.includes("> JAVA")),
        message: "Function composition working — this is the foundation of the entire Streams API.",
      }),
    },

    // ── Lesson 24 ────────────────────────────────────────────────────────
    {
      title: "Java 24: Stream API — Lazy Evaluation",
      content: [
        "Streams are **lazy pipelines**: intermediate ops (filter, map, peek) do nothing until a terminal op (count, collect, forEach) triggers them. This lazy + fused execution is why streams can be fast despite looking functional.",
        "Build a stream-like class that logs when each element passes through each stage, so you can *see* the element-at-a-time flow and short-circuit behavior.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Intermediate vs terminal",
          body: "**Intermediate** ops return a `Stream` — `filter`, `map`, `flatMap`, `distinct`, `sorted`, `peek`, `limit`, `skip`. They're lazy — just recorded. **Terminal** ops consume the stream and return a result (or `void`) — `forEach`, `count`, `collect`, `reduce`, `findFirst`, `anyMatch`. Only a terminal op kicks off execution.",
          badges: ["Lazy"],
          code: "IntStream.range(0, 1_000_000)\n  .map(x -> x * 2)        // lazy\n  .filter(x -> x > 10)    // lazy\n  .findFirst();           // terminal — triggers execution, stops at first match",
        },
        {
          tag: "concept",
          title: "Element-at-a-time",
          body: "Streams pipe one element through all stages before moving to the next — **not** stage-by-stage. `stream.filter(...).map(...).findFirst()` pulls the first source element through filter, then map, then yields it — if it passes. `findFirst` can short-circuit the entire pipeline after one match.",
          badges: ["Pipeline"],
        },
        {
          tag: "concept",
          title: "Streams are single-use",
          body: "Once a terminal op runs, the stream is consumed — reusing it throws `IllegalStateException`. Build a fresh stream from the source. Think of them as iterators, not collections.",
          badges: ["Single-use"],
        },
        {
          tag: "exercise",
          title: "Build a traced stream",
          body: "Implement `TracedStream<T>` with `filter`, `map`, `forEach`, `findFirst`. Log every element + stage visited. Process `[1..1000]`, filter even, map `*3`, findFirst where `> 50`. You should stop after just 6 elements — proof of short-circuit.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "peek for debugging, not side effects",
          body: "`.peek(System.out::println)` is designed for debugging lazy pipelines — it runs only when elements flow through. Never rely on `peek` for real side effects — if the terminal op short-circuits, not every element gets peeked.",
          badges: ["peek"],
        },
        {
          tag: "key-point",
          title: "Quiz: sorted + findFirst",
          body: "`stream.sorted().findFirst()` — does this visit every element? **Yes** — `sorted` is a **stateful** intermediate that must buffer everything before emitting the first result. Short-circuit can't kick in. If you only need the minimum, use `min(Comparator)` instead.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Traced lazy stream\nclass TracedStream<T> {\n  public visits = 0;\n  constructor(private gen: () => Iterable<T>, private stages: Array<(v: T) => T | undefined> = []) {}\n\n  filter(pred: (v: T) => boolean): TracedStream<T> {\n    return new TracedStream(this.gen, [...this.stages, (v) => (pred(v) ? v : undefined)]);\n  }\n  map(fn: (v: T) => T): TracedStream<T> {\n    return new TracedStream(this.gen, [...this.stages, (v) => fn(v)]);\n  }\n\n  findFirst(pred: (v: T) => boolean): T | undefined {\n    for (const initial of this.gen()) {\n      this.visits++;\n      let v: T | undefined = initial;\n      for (const stage of this.stages) {\n        if (v === undefined) break;\n        v = stage(v);\n      }\n      if (v !== undefined && pred(v)) return v;\n    }\n    return undefined;\n  }\n}\n\nfunction* range(n: number): Iterable<number> { for (let i = 0; i < n; i++) yield i; }\n\nconst stream = new TracedStream<number>(() => range(1000))\n  .filter((n) => n % 2 === 0)\n  .map((n) => n * 3);\n\nconst first = stream.findFirst((n) => n > 50);\nconsole.log("first > 50: " + first);\nconsole.log("elements visited: " + stream.visits + " out of 1000");\nconsole.log("short-circuit working — we stopped as soon as the predicate matched.");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("TracedStream") &&
          code.includes("findFirst") &&
          logs.some((l) => l.includes("first > 50: 54")) &&
          logs.some((l) => /visited: ([0-9]|1[0-9]|2[0-9])\b/.test(l)),
        message: "Short-circuit working — only a handful of elements visited. Lazy evaluation is the superpower.",
      }),
    },

    // ── Lesson 25 ────────────────────────────────────────────────────────
    {
      title: "Java 25: Collectors — groupingBy, partitioningBy, joining",
      content: [
        "`Collectors` produces the final result of a stream — `toList()`, `toMap()`, `groupingBy(keyFn)`, `partitioningBy(predicate)`, `joining(\", \")`, and `reducing(...)`. Composing collectors is where the stream API starts to feel like SQL.",
        "Build a data-analysis pipeline: given a list of orders, group by status, count per group, and compute the total revenue per group — all in one pipeline.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Common terminal collectors",
          body: "**`toList()`**: the default. **`toSet()`**: dedupes. **`toMap(kFn, vFn)`**: throws on duplicate key unless you pass a merge function. **`joining(sep)`**: for String streams. **`counting()`**: nested counter.",
          badges: ["Collectors"],
        },
        {
          tag: "concept",
          title: "groupingBy composability",
          body: "`groupingBy(Order::status)` → `Map<Status, List<Order>>`. Add a downstream collector: `groupingBy(Order::status, counting())` → `Map<Status, Long>`. Or `groupingBy(Order::status, summingDouble(Order::total))` → `Map<Status, Double>`. Or multi-level: `groupingBy(Order::status, groupingBy(Order::customer))`.",
          badges: ["groupingBy"],
          code: "Map<Status, Double> totalByStatus = orders.stream()\n  .collect(Collectors.groupingBy(\n    Order::status,\n    Collectors.summingDouble(Order::total)));",
        },
        {
          tag: "concept",
          title: "partitioningBy — binary group",
          body: "`partitioningBy(p)` returns a `Map<Boolean, List<T>>` — always has `true` and `false` keys, even if empty. Specialized `groupingBy` for yes/no — 2x faster because it can use a flat array-backed map.",
          badges: ["partitioningBy"],
        },
        {
          tag: "exercise",
          title: "Analyze orders",
          body: "Given 50 orders with `{ id, status, total }`, compute in one pipeline: (1) total revenue per status, (2) count per status, (3) join order ids per status as a comma-separated string. Log each map.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Collectors.toMap duplicate key",
          body: "`toMap(Order::customer, o -> o)` throws `IllegalStateException` on duplicate customer. Pass a merge: `toMap(Order::customer, o -> o, (a, b) -> a.total() > b.total() ? a : b)` — keeps the bigger order per customer.",
          badges: ["Gotcha"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why downstream collectors",
          body: "Why is `groupingBy(k, counting())` better than `groupingBy(k).entrySet().stream().map(e -> e.getValue().size())`? **Single pass + single allocation**. No intermediate List per group — the counter is built directly.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Collector-style data analysis\ntype Status = "NEW" | "PAID" | "SHIPPED" | "CANCELLED";\ninterface Order { id: number; status: Status; total: number }\n\nconst orders: Order[] = [];\nconst statuses: Status[] = ["NEW", "PAID", "SHIPPED", "CANCELLED"];\nfor (let i = 0; i < 50; i++) {\n  orders.push({ id: 1000 + i, status: statuses[i % 4], total: Math.round(Math.random() * 500 * 100) / 100 });\n}\n\nfunction groupingBy<T, K extends string>(items: T[], keyFn: (t: T) => K): Record<K, T[]> {\n  const out = {} as Record<K, T[]>;\n  for (const t of items) {\n    const k = keyFn(t);\n    (out[k] ??= []).push(t);\n  }\n  return out;\n}\n\nfunction summingOn<T>(items: T[], fn: (t: T) => number): number {\n  return items.reduce((s, t) => s + fn(t), 0);\n}\n\nconst byStatus = groupingBy(orders, (o) => o.status);\n\nconsole.log("=== Revenue per status ===");\nfor (const s of statuses) console.log(s.padEnd(10) + " $" + summingOn(byStatus[s] ?? [], (o) => o.total).toFixed(2));\n\nconsole.log("\\n=== Count per status ===");\nfor (const s of statuses) console.log(s.padEnd(10) + " " + (byStatus[s]?.length ?? 0));\n\nconsole.log("\\n=== Order ids (first 5) per status ===");\nfor (const s of statuses) {\n  const ids = (byStatus[s] ?? []).slice(0, 5).map((o) => o.id).join(", ");\n  console.log(s.padEnd(10) + " " + ids);\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("groupingBy") &&
          code.includes("summingOn") &&
          logs.some((l) => l.includes("Revenue per status")) &&
          logs.some((l) => l.includes("Count per status")) &&
          logs.some((l) => l.includes("Order ids")),
        message: "groupingBy + downstream aggregation — SQL-style analytics in a single pipeline.",
      }),
    },

    // ── Lesson 26 ────────────────────────────────────────────────────────
    {
      title: "Java 26: Parallel Streams — When They Help",
      content: [
        "`.parallelStream()` uses the common `ForkJoinPool` to split work across CPU cores. Sounds free — it isn't. Parallel streams win only for **CPU-bound** work on **large** collections with **stateless** operations.",
        "Build a benchmark that shows the sweet spot — tiny collection = overhead dominates; huge CPU-bound work = real speedup.",
      ],
      sections: [
        {
          tag: "concept",
          title: "How parallel works",
          body: "The stream is split via the spliterator into ranges. Each range is processed by a `ForkJoinPool.commonPool()` worker (by default N = cores - 1). Results are combined via the collector's `combiner`. Splitting, scheduling, and combining all add overhead — if the per-element work is trivial, overhead dwarfs any gain.",
          badges: ["ForkJoin"],
        },
        {
          tag: "concept",
          title: "When it helps",
          body: "(1) The pipeline is **stateless** (no shared mutable state). (2) The per-element work is **non-trivial** (real CPU time). (3) The source **splits cheaply** (`ArrayList`, `int[]` — good; `LinkedList`, `HashSet` — bad). (4) The collection is **large** (10k+ elements). All four should hold.",
          badges: ["Criteria"],
        },
        {
          tag: "concept",
          title: "When it hurts",
          body: "**I/O-bound** work (blocks pool workers, starves others). **Tiny collections** (overhead >> work). **Stateful** ops (sorted/distinct need full buffer). **Shared mutable state** (race conditions — `list.add` in a parallel forEach is a bug). **Order-dependent** ops (forces sequential merge).",
          badges: ["Anti-patterns"],
        },
        {
          tag: "exercise",
          title: "Benchmark sequential vs parallel",
          body: "For arrays of size 10, 1_000, 100_000: run a CPU-heavy op (compute `Math.sqrt` 1000x per element) sequentially and 'in parallel' (simulated by chunking and Promise.all). Log wall time for each. You should see parallel lose on 10, break-even around 1000, and win big at 100000.",
          badges: ["Practice", "Benchmark"],
        },
        {
          tag: "tip",
          title: "Custom pool for parallel",
          body: "By default everything shares `ForkJoinPool.commonPool()`. Mixing I/O with CPU work on the same pool is trouble. Isolate by submitting to a custom pool: `myPool.submit(() -> list.parallelStream().reduce(...)).get();`.",
          badges: ["Isolation"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why is shared mutable state a bug?",
          body: "`list.parallelStream().forEach(list::add)` — why dangerous? **`ArrayList` is not thread-safe.** Concurrent writes produce data races, corrupt internal state, and throw `ArrayIndexOutOfBoundsException`. Use `.collect(...)` to build a new collection safely.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Sequential vs 'parallel' chunked benchmark\nasync function heavyWork(x: number): Promise<number> {\n  let s = x;\n  for (let i = 0; i < 1000; i++) s = Math.sqrt(s + i);\n  return s;\n}\n\nasync function sequential(arr: number[]): Promise<number> {\n  let sum = 0;\n  for (const x of arr) sum += await heavyWork(x);\n  return sum;\n}\n\nasync function parallel(arr: number[], chunks = 4): Promise<number> {\n  const size = Math.ceil(arr.length / chunks);\n  const promises: Promise<number>[] = [];\n  for (let i = 0; i < arr.length; i += size) {\n    const slice = arr.slice(i, i + size);\n    promises.push((async () => {\n      let s = 0;\n      for (const x of slice) s += await heavyWork(x);\n      return s;\n    })());\n  }\n  const parts = await Promise.all(promises);\n  return parts.reduce((a, b) => a + b, 0);\n}\n\nasync function bench(name: string, arr: number[]): Promise<void> {\n  const t1 = Date.now(); await sequential(arr); const seqTime = Date.now() - t1;\n  const t2 = Date.now(); await parallel(arr);   const parTime = Date.now() - t2;\n  console.log(name.padEnd(10) + " n=" + arr.length + " seq=" + seqTime + "ms par=" + parTime + "ms ratio=" + (seqTime / Math.max(parTime, 1)).toFixed(2) + "x");\n}\n\nconst main = async () => {\n  await bench("tiny",    Array.from({ length: 10 },      (_, i) => i));\n  await bench("medium",  Array.from({ length: 1_000 },   (_, i) => i));\n  await bench("large",   Array.from({ length: 10_000 },  (_, i) => i));\n  console.log("\\nTakeaway: parallel overhead dominates tiny collections; real CPU work wins on big ones.");\n};\nmain();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("sequential") &&
          code.includes("parallel") &&
          logs.some((l) => l.includes("tiny")) &&
          logs.some((l) => l.includes("large")),
        message: "You have measured the crossover — parallel streams are not free.",
      }),
    },

    // ── Lesson 27 ────────────────────────────────────────────────────────
    {
      title: "Java 27: Optional — Avoiding Null",
      content: [
        "`Optional<T>` is Java's way to signal 'may or may not have a value' without returning `null`. Used right, it makes missing values impossible to ignore. Used wrong, it's just a more verbose null pointer.",
        "Build a chain of Optional-returning operations and use `map`, `flatMap`, `orElse`, `orElseThrow` — then see the anti-patterns.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Create + unwrap",
          body: "`Optional.of(x)` (x must be non-null), `Optional.ofNullable(x)` (x may be null), `Optional.empty()`. To unwrap: `.orElse(default)`, `.orElseGet(() -> compute())` (lazy), `.orElseThrow()`, `.orElseThrow(() -> new MyExc())`. `.get()` throws on empty — **avoid**.",
          badges: ["Create", "Unwrap"],
        },
        {
          tag: "concept",
          title: "Chain with map + flatMap",
          body: "`user.getAddress().map(Address::getCity).orElse(\"unknown\")` — if any step is empty, the chain short-circuits. `flatMap` is for when your mapper itself returns an Optional: `user.getSpouse().flatMap(User::getEmail)`.",
          badges: ["map", "flatMap"],
          code: "Optional<String> city = userRepo.findById(id)\n  .map(User::getAddress)          // Optional<Optional<Address>>... wait\n  .flatMap(a -> a.map(Address::getCity));  // use flatMap for Optional-returning mappers",
        },
        {
          tag: "concept",
          title: "Anti-patterns",
          body: "(1) `Optional` fields — not their design intent, use null + validation. (2) `Optional` method parameters — forces callers to wrap, use overloads instead. (3) `Optional<List<T>>` — return empty list instead. (4) `.isPresent() + .get()` — use `.orElse` or `.ifPresent`. (5) Serializing `Optional` — it's not `Serializable`.",
          badges: ["Anti-patterns"],
        },
        {
          tag: "exercise",
          title: "Build an Optional chain",
          body: "Implement `Opt<T>` with `of`, `empty`, `map`, `flatMap`, `orElse`, `ifPresent`, `filter`. Chain: find user → get address → get postal code → default to 'UNKNOWN'. Test with present and absent paths.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "orElseGet for expensive defaults",
          body: "`.orElse(computeDefault())` **always evaluates** `computeDefault()` — even when the value is present. `.orElseGet(() -> computeDefault())` is **lazy** — only called on empty. Use `orElseGet` for any default that's more than a constant.",
          badges: ["Performance"],
        },
        {
          tag: "key-point",
          title: "Quiz: When Optional fields are OK",
          body: "Never on an entity or DTO. When **is** an `Optional` field OK? **Basically never.** Use `@Nullable` + null for fields; reserve Optional for return values where the caller needs to handle absence. Jackson and JPA both have trouble with Optional fields.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Optional-style Opt<T>\nclass Opt<T> {\n  private constructor(private readonly value: T | null) {}\n  static of<T>(v: T): Opt<T> { if (v == null) throw new Error("null"); return new Opt(v); }\n  static ofNullable<T>(v: T | null | undefined): Opt<T> { return new Opt(v ?? null); }\n  static empty<T>(): Opt<T> { return new Opt<T>(null); }\n\n  isPresent(): boolean { return this.value !== null; }\n  map<U>(fn: (t: T) => U): Opt<U> { return this.value === null ? Opt.empty<U>() : Opt.ofNullable(fn(this.value)); }\n  flatMap<U>(fn: (t: T) => Opt<U>): Opt<U> { return this.value === null ? Opt.empty<U>() : fn(this.value); }\n  filter(pred: (t: T) => boolean): Opt<T> { return this.value !== null && pred(this.value) ? this : Opt.empty(); }\n  orElse(def: T): T { return this.value ?? def; }\n  orElseGet(supplier: () => T): T { return this.value ?? supplier(); }\n  ifPresent(action: (t: T) => void): void { if (this.value !== null) action(this.value); }\n}\n\ninterface Address { city: string; postal?: string }\ninterface User { name: string; address?: Address }\n\nconst users: Record<number, User> = {\n  1: { name: "alice", address: { city: "NYC", postal: "10001" } },\n  2: { name: "bob",   address: { city: "SFO" } },\n  3: { name: "carol" },\n};\n\nfunction findUser(id: number): Opt<User> { return Opt.ofNullable(users[id]); }\nfunction postalOf(id: number): string {\n  return findUser(id)\n    .flatMap((u) => Opt.ofNullable(u.address))\n    .flatMap((a) => Opt.ofNullable(a.postal))\n    .orElse("UNKNOWN");\n}\n\nfor (const id of [1, 2, 3, 99]) {\n  console.log("user " + id + " postal: " + postalOf(id));\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("class Opt") &&
          code.includes("flatMap") &&
          logs.some((l) => l.includes("user 1 postal: 10001")) &&
          logs.some((l) => l.includes("user 2 postal: UNKNOWN")) &&
          logs.some((l) => l.includes("user 3 postal: UNKNOWN")) &&
          logs.some((l) => l.includes("user 99 postal: UNKNOWN")),
        message: "Optional chain short-circuits gracefully — no NPE, no if-null-return-null ladder.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 6 — Concurrency (Lessons 28-33)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 28 ────────────────────────────────────────────────────────
    {
      title: "Java 28: Thread, Runnable & Thread.start vs run",
      content: [
        "A `Thread` is a real OS-backed thread (until Loom changed that). `Runnable` is just a 'piece of work'. `t.start()` schedules work on a new thread; `t.run()` runs it on **your** thread — a classic interview gotcha.",
        "Build a traced-thread simulator that shows which OS thread each piece of work ran on, and demonstrate the `start` vs `run` pitfall.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Thread vs Runnable",
          body: "`Runnable` = the work (`void run()`). `Thread` = the executor. `new Thread(runnable).start()` creates a new thread and invokes `runnable.run()` on it. **Prefer `Runnable` over extending `Thread`** — composition over inheritance, and the same runnable can be passed to any executor.",
          badges: ["Runnable", "Thread"],
          code: "// Preferred — Runnable\nRunnable work = () -> System.out.println(\"hi from \" + Thread.currentThread().getName());\nnew Thread(work, \"worker-1\").start();",
        },
        {
          tag: "concept",
          title: "start() vs run()",
          body: "`t.start()` spawns a new OS thread and schedules `run` on it. `t.run()` is a **plain method call** — it runs on the current thread. If you write `t.run()` thinking you started a thread, you'll get fully sequential execution. `t.start()` can only be called **once** per Thread — calling it twice throws `IllegalThreadStateException`.",
          badges: ["start", "Gotcha"],
        },
        {
          tag: "concept",
          title: "Thread states",
          body: "`NEW` → `RUNNABLE` → (`BLOCKED` / `WAITING` / `TIMED_WAITING`) ↔ `RUNNABLE` → `TERMINATED`. `BLOCKED`: waiting for a monitor lock. `WAITING`: `wait()`/`join()`. `TIMED_WAITING`: `sleep(ms)`/`wait(ms)`. `Thread.getState()` returns the current state — great for debugging deadlocks.",
          badges: ["States"],
        },
        {
          tag: "exercise",
          title: "Simulate start vs run",
          body: "Build a `SimThread` that records which 'virtual OS thread' it ran on. `start()` assigns a new thread id; `run()` uses the current 'main' thread id. Run three tasks via `start` and three via `run`; log the thread id each task saw.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Name your threads",
          body: "`new Thread(r, \"order-processor\")` — give every thread a name. Thread dumps become readable: `\"pool-2-thread-3\"` is useless; `\"order-processor-3\"` tells you exactly what was running. `ThreadFactory` sets this for pools.",
          badges: ["Debugging"],
        },
        {
          tag: "key-point",
          title: "Quiz: Can you restart a Thread?",
          body: "Can you call `thread.start()` twice? **No.** Once terminated, a Thread is unusable — you have to create a new one. If you need repeated work, use an `ExecutorService` and submit tasks to it.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// start() vs run() simulator\nlet nextThreadId = 1;\nlet mainThreadId = 0;\nconst log: string[] = [];\n\nclass SimThread {\n  constructor(private name: string, private work: (tid: number) => void) {}\n  start(): void {\n    const tid = nextThreadId++;\n    // Would be asynchronous on a real OS thread; simulate with setTimeout 0 in real code\n    log.push(this.name + " start() -> scheduled on thread-" + tid);\n    this.work(tid);\n  }\n  run(): void {\n    log.push(this.name + " run()   -> INLINE on thread-" + mainThreadId + " (bug!)");\n    this.work(mainThreadId);\n  }\n}\n\nfunction task(tid: number): void { log.push("  work ran on thread-" + tid); }\n\nconsole.log("=== Using start() — correct ===");\nnew SimThread("worker-A", task).start();\nnew SimThread("worker-B", task).start();\n\nconsole.log("\\n=== Using run() — bug ===");\nnew SimThread("worker-C", task).run();\nnew SimThread("worker-D", task).run();\n\nfor (const line of log) console.log(line);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("SimThread") &&
          code.includes("start") &&
          logs.some((l) => l.includes("start() ->")) &&
          logs.some((l) => l.includes("INLINE")),
        message: "start() vs run() difference proven — this is a top interview gotcha.",
      }),
    },

    // ── Lesson 29 ────────────────────────────────────────────────────────
    {
      title: "Java 29: synchronized, volatile, Atomic",
      content: [
        "Three tools for safe concurrent state: `synchronized` (mutual exclusion via monitor), `volatile` (visibility + ordering, no atomicity for compound ops), `AtomicInteger`/`AtomicReference` (lock-free CAS-based). Pick the weakest that fits.",
        "Build a counter three ways (synchronized, volatile, atomic) and stress-test under concurrent increment. Prove volatile alone isn't enough for `count++`.",
      ],
      sections: [
        {
          tag: "concept",
          title: "synchronized = monitor lock",
          body: "Every Java object has a monitor. `synchronized(obj) { ... }` acquires it; leaving the block releases it. `synchronized` on an instance method locks `this`; on a static method locks `ClassName.class`. Gives mutual exclusion + happens-before memory semantics (all writes before release are visible after acquire).",
          badges: ["synchronized", "Monitor"],
        },
        {
          tag: "concept",
          title: "volatile = visibility only",
          body: "`volatile` guarantees: (1) reads/writes go to main memory (not a CPU cache), so other threads see the latest value. (2) Ordering — no reordering of volatile reads/writes with surrounding instructions. It does **NOT** give atomicity for compound ops like `count++` (read + increment + write = 3 ops, race window between them).",
          badges: ["volatile"],
        },
        {
          tag: "concept",
          title: "Atomic = lock-free CAS",
          body: "`AtomicInteger.incrementAndGet()` uses `compareAndSet` in a spin loop: read the current value, try to swap to current+1 atomically. On failure (someone else swapped first), retry. No lock, no blocking. `LongAdder` (Java 8) scales even better — per-thread cells summed on read.",
          badges: ["CAS", "Atomic"],
          code: "private final AtomicInteger count = new AtomicInteger();\npublic void inc() { count.incrementAndGet(); }    // atomic, lock-free\npublic int  get() { return count.get(); }",
        },
        {
          tag: "exercise",
          title: "Stress-test three counters",
          body: "Implement `SyncCounter` (synchronized inc), `VolatileCounter` (volatile int, non-atomic `count++`), `AtomicCounter` (CAS loop). Run 1000 'increment' simulations with interleaved 'concurrent' runs. Volatile should sometimes lose updates; sync and atomic should always be 1000.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Reach for concurrent collections first",
          body: "Before using low-level `synchronized`/`volatile`, check if a `ConcurrentHashMap`, `ConcurrentLinkedQueue`, `AtomicReference`, or `CompletableFuture` covers your case. Higher-level tools are easier to get right and usually faster.",
          badges: ["Strategy"],
        },
        {
          tag: "key-point",
          title: "Quiz: Double-checked locking",
          body: "`if (instance == null) synchronized(lock) { if (instance == null) instance = new X(); }` — does this work? **Only if `instance` is `volatile`.** Without volatile, a partially-constructed `X` might leak via the first unsynchronized check. The volatile happens-before ensures full construction is visible before publication.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Three counters — synchronized, volatile, atomic\nclass SyncCounter {\n  private count = 0;\n  private locked = false;\n  inc(): void {\n    // spin-lock simulation of synchronized\n    while (this.locked) { /* wait */ }\n    this.locked = true;\n    this.count++;\n    this.locked = false;\n  }\n  get(): number { return this.count; }\n}\n\nclass VolatileCounter {\n  // 'volatile' in Java — just visibility, NOT atomic for count++\n  public count = 0;\n  inc(): void {\n    const snap = this.count;      // read\n    // simulate context switch between read and write\n    this.count = snap + 1;        // write — may overwrite others\n  }\n  get(): number { return this.count; }\n}\n\nclass AtomicCounter {\n  private count = 0;\n  private inProgress = false;\n  inc(): void {\n    // CAS loop simulation — retry until success\n    for (;;) {\n      const current = this.count;\n      // Try to swap; here TS is single-threaded so always succeeds, but\n      // in real Java this is where multiple threads would race\n      if (!this.inProgress) {\n        this.inProgress = true;\n        if (this.count === current) {\n          this.count = current + 1;\n          this.inProgress = false;\n          return;\n        }\n        this.inProgress = false;\n      }\n    }\n  }\n  get(): number { return this.count; }\n}\n\nconst N = 1000;\nconst sync = new SyncCounter();\nconst vol  = new VolatileCounter();\nconst atom = new AtomicCounter();\n\nfor (let i = 0; i < N; i++) {\n  sync.inc();\n  // Simulate race for volatile: two "threads" each reading and writing\n  const s1 = vol.count; const s2 = vol.count;\n  vol.count = Math.max(s1, s2) + 1;   // one update wins, not both\n  atom.inc();\n}\n\nconsole.log("expected:  " + N);\nconsole.log("sync:      " + sync.get() + "  (correct)");\nconsole.log("volatile:  " + vol.get()  + "  (LOSES UPDATES under contention)");\nconsole.log("atomic:    " + atom.get() + "  (correct)");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("SyncCounter") &&
          code.includes("VolatileCounter") &&
          code.includes("AtomicCounter") &&
          logs.some((l) => l.includes("expected:  1000")) &&
          logs.some((l) => l.includes("sync:      1000")),
        message: "Three counters, three safety levels — you can now defend each choice in a review.",
      }),
    },

    // ── Lesson 30 ────────────────────────────────────────────────────────
    {
      title: "Java 30: ExecutorService & Thread Pools",
      content: [
        "Don't spawn raw `Thread`s — use an `ExecutorService`. Submit `Runnable`s or `Callable`s, get back a `Future`. Pools reuse threads (expensive to create) and bound concurrency (protects your memory + CPU).",
        "Build a bounded thread pool simulator with a work queue, then see what happens when you saturate it.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The four factories",
          body: "**`newFixedThreadPool(n)`** — n threads, unbounded queue. **`newCachedThreadPool()`** — grow as needed, 60s idle timeout. **`newSingleThreadExecutor()`** — serial task execution. **`newScheduledThreadPool(n)`** — timed / periodic tasks. Or build your own `ThreadPoolExecutor` for full control.",
          badges: ["Factories"],
          code: "ExecutorService exec = Executors.newFixedThreadPool(4);\nFuture<Integer> f = exec.submit(() -> compute());\nint result = f.get();    // blocks until done\nexec.shutdown();",
        },
        {
          tag: "concept",
          title: "Queue & rejection policy",
          body: "`ThreadPoolExecutor(core, max, keepalive, queue, rejHandler)` — the real deal. Tasks go into `queue` until `core` threads can take them; pool grows to `max` only when queue is full. If queue AND pool are full, `rejHandler` runs — defaults: `AbortPolicy` (throws), `CallerRunsPolicy` (runs on submitter), `DiscardPolicy` (silent drop — dangerous).",
          badges: ["Queue"],
        },
        {
          tag: "concept",
          title: "Shutdown vs shutdownNow",
          body: "**`shutdown()`**: stop accepting new work, finish running + queued. **`shutdownNow()`**: stop accepting, interrupt running threads, return queued-but-unstarted tasks. Always pair with `awaitTermination(timeout)` — and log any tasks that didn't finish.",
          badges: ["Shutdown"],
        },
        {
          tag: "exercise",
          title: "Build a bounded pool",
          body: "`BoundedPool(coreSize, maxQueue)` with `submit(task)` that (1) runs on the next free 'thread' (up to core), (2) queues if all busy (up to maxQueue), (3) rejects if both full — log the rejection. Submit 20 tasks to a pool(core=3, queue=5). Track concurrent execution count.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Never submit to a single, shared pool",
          body: "Mixing long-running and short tasks in one pool causes head-of-line blocking. Use **bulkheads** — separate pools per concern (DB, HTTP, CPU-compute). If one pool is saturated, the others keep serving traffic.",
          badges: ["Bulkheads"],
        },
        {
          tag: "key-point",
          title: "Quiz: unbounded queue danger",
          body: "Why is `newFixedThreadPool`'s unbounded queue risky? **Under load, the queue grows without limit — you'll OOM.** Always bound your queue. Size it based on memory + acceptable latency. If you can't bound, at least add a circuit breaker upstream.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Bounded thread pool simulator\ntype Task = () => string;\n\nclass BoundedPool {\n  private running = 0;\n  private queue: Task[] = [];\n  public rejected = 0;\n  public executed = 0;\n  public peakRunning = 0;\n\n  constructor(private core: number, private maxQueue: number) {}\n\n  submit(task: Task): void {\n    if (this.running < this.core) { this.execute(task); return; }\n    if (this.queue.length < this.maxQueue) { this.queue.push(task); return; }\n    this.rejected++;\n    console.log("  REJECTED — pool core=" + this.core + " queue=" + this.queue.length + "/" + this.maxQueue);\n  }\n\n  private execute(task: Task): void {\n    this.running++;\n    this.peakRunning = Math.max(this.peakRunning, this.running);\n    const result = task();\n    this.executed++;\n    console.log("  ran: " + result + " (running now=" + (this.running - 1) + ")");\n    this.running--;\n    // When a "thread" frees up, it pulls from the queue\n    const next = this.queue.shift();\n    if (next) this.execute(next);\n  }\n}\n\nconst pool = new BoundedPool(3, 5);\nfor (let i = 1; i <= 20; i++) {\n  pool.submit(() => "task-" + i);\n}\n\nconsole.log("\\n=== summary ===");\nconsole.log("executed: " + pool.executed);\nconsole.log("rejected: " + pool.rejected);\nconsole.log("peak running: " + pool.peakRunning + " (max was core=3)");`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("BoundedPool") &&
          code.includes("submit") &&
          logs.some((l) => l.includes("REJECTED")) &&
          logs.some((l) => l.includes("executed:")) &&
          logs.some((l) => l.includes("rejected:")),
        message: "Pool saturation + rejection policy working — this is how you survive overload in production.",
      }),
    },

    // ── Lesson 31 ────────────────────────────────────────────────────────
    {
      title: "Java 31: CompletableFuture Composition",
      content: [
        "`CompletableFuture<T>` is the composable async type — `thenApply` (sync transform), `thenCompose` (async chain), `thenCombine` (join two), `allOf`/`anyOf` (fan-in), `exceptionally` (recover). It's the Java answer to JS Promises.",
        "Build a dependency DAG: fetch user → in parallel fetch orders + preferences → combine, with a fallback on failure. Show non-blocking composition.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The core operators",
          body: "`thenApply(fn)` = Promise `.then` with sync fn. `thenCompose(fn)` = `.then` with async fn (no nesting). `thenAcceptBoth(other, biFn)`/`thenCombine` = join two. `exceptionally(fn)` = `.catch`. `handle(biFn)` = access both value and throwable. `allOf(cfs...)` = `Promise.all`. `anyOf(cfs...)` = `Promise.race`.",
          badges: ["Operators"],
          code: "CompletableFuture<User> u = fetchUser(id);\nCompletableFuture<Report> r = u\n  .thenCompose(user -> fetchOrders(user.id()).thenApply(orders -> new Report(user, orders)))\n  .exceptionally(ex -> Report.empty());",
        },
        {
          tag: "concept",
          title: "thenApply vs thenCompose",
          body: "`thenApply(fn)` — `fn` returns a plain value. If you pass a function returning another CompletableFuture, you get `CompletableFuture<CompletableFuture<T>>` (nested, bad). **`thenCompose`** unwraps it: `fn` returns a CF, `thenCompose` returns a plain CF. Use `thenCompose` for async steps.",
          badges: ["Flat"],
        },
        {
          tag: "concept",
          title: "Exception propagation",
          body: "If any stage throws, downstream stages skip to the next `exceptionally`/`handle`. `exceptionally(ex -> default)` only runs on failure; `handle((val, ex) -> ...)` always runs. **CompletionException** wraps the real cause — unwrap with `cause.getCause()`.",
          badges: ["Errors"],
        },
        {
          tag: "exercise",
          title: "Build a user-report pipeline",
          body: "Simulate async `fetchUser(id)`, `fetchOrders(userId)`, `fetchPrefs(userId)` returning CFs (use `Promise`). Compose: fetch user → fetch orders + prefs in parallel → combine into a report. Add `.exceptionally` to fall back to an empty report. Test the happy path and a failure path.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Always use thenXxxAsync for CPU work",
          body: "`thenApply` runs on the **completing thread** — if that thread is an I/O thread, your CPU work blocks it. Use `thenApplyAsync(fn, executor)` to dispatch CPU-heavy transforms to a dedicated pool.",
          badges: ["Pools"],
        },
        {
          tag: "key-point",
          title: "Quiz: get() vs join()",
          body: "Both block until the future completes. Difference? **`get()` throws checked `ExecutionException` + `InterruptedException`; `join()` throws unchecked `CompletionException`.** `join` is nicer inside stream lambdas (no try/catch). Both are still blocking — avoid in hot paths.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// CompletableFuture-style async composition\ninterface User   { id: number; name: string }\ninterface Order  { id: number; total: number }\ninterface Prefs  { dark: boolean }\ninterface Report { user: User | null; orders: Order[]; prefs: Prefs | null; error?: string }\n\nasync function fetchUser(id: number): Promise<User> {\n  if (id < 0) throw new Error("not found");\n  return { id, name: "User-" + id };\n}\nasync function fetchOrders(userId: number): Promise<Order[]> {\n  return [{ id: userId * 10, total: 99.9 }];\n}\nasync function fetchPrefs(userId: number): Promise<Prefs> {\n  return { dark: userId % 2 === 0 };\n}\n\nasync function buildReport(userId: number): Promise<Report> {\n  try {\n    const user = await fetchUser(userId);\n    // Fan out in parallel (CF.allOf equivalent)\n    const [orders, prefs] = await Promise.all([fetchOrders(user.id), fetchPrefs(user.id)]);\n    return { user, orders, prefs };\n  } catch (e) {\n    return { user: null, orders: [], prefs: null, error: (e as Error).message };\n  }\n}\n\n(async () => {\n  const good = await buildReport(42);\n  console.log("happy path: user=" + good.user?.name + " orders=" + good.orders.length + " dark=" + good.prefs?.dark);\n  const bad = await buildReport(-1);\n  console.log("error path: error=" + bad.error + " (fell back to empty)");\n})();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("buildReport") &&
          code.includes("Promise.all") &&
          logs.some((l) => l.includes("happy path:")) &&
          logs.some((l) => l.includes("error path:")),
        message: "Async composition + parallel fan-out + exceptional fallback — the three CompletableFuture superpowers.",
      }),
    },

    // ── Lesson 32 ────────────────────────────────────────────────────────
    {
      title: "Java 32: Virtual Threads (Project Loom)",
      content: [
        "**Virtual threads** (Java 21) are JVM-scheduled threads — millions of them fit in memory, context switches cost nanoseconds. They **don't** replace platform threads; they solve the 'one thread per request' problem for I/O-heavy servers.",
        "Simulate the scheduling difference: 10,000 concurrent 'sleeps' — platform threads run out of memory; virtual threads fly.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Platform vs virtual threads",
          body: "**Platform thread**: 1:1 OS thread, ~1MB stack, expensive (few thousand per JVM). **Virtual thread**: JVM-scheduled, stack stored on heap + resized, ~100 bytes when idle. A single OS thread (called **carrier**) runs many virtual threads cooperatively via a continuation mechanism.",
          badges: ["Loom", "Virtual"],
        },
        {
          tag: "concept",
          title: "Pinning and blocking",
          body: "A virtual thread **unmounts** from its carrier when it hits a blocking op (`Thread.sleep`, `socket.read`). Carrier is free to run another VT. It **pins** (can't unmount) when: (1) inside `synchronized` block, (2) in a native call, (3) in a native library. For high-throughput I/O, replace `synchronized` with `ReentrantLock`.",
          badges: ["Pinning"],
        },
        {
          tag: "concept",
          title: "Spawning",
          body: "`Thread.ofVirtual().start(runnable)` or `Thread.startVirtualThread(runnable)`. `Executors.newVirtualThreadPerTaskExecutor()` gives you an ExecutorService that spawns one VT per task — the canonical replacement for `newFixedThreadPool(N)` in server code.",
          badges: ["Spawning"],
          code: "try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {\n  for (Request r : requests) exec.submit(() -> handle(r));\n}  // try-with-resources closes and awaits",
        },
        {
          tag: "exercise",
          title: "Simulate VT vs platform",
          body: "Simulate `runN(threadsMax, tasks, taskDurationMs)` twice: platform mode caps at `threadsMax = 200`, virtual mode has no cap. Submit 10000 fake 'sleeps' of 10ms. Log total wall time — platform serializes in batches; virtual runs all concurrently.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Don't pool virtual threads",
          body: "The point of VTs is **create-and-discard**. `Executors.newFixedThreadPool(10)` with VTs makes no sense — you're just capping what was meant to scale. Use `newVirtualThreadPerTaskExecutor()` and let the JVM handle scheduling.",
          badges: ["Anti-pattern"],
        },
        {
          tag: "key-point",
          title: "Quiz: When do VTs NOT help",
          body: "When are virtual threads the wrong tool? **CPU-bound work.** VTs give you concurrency, not parallelism. You still have N cores; 1M VTs doing `Math.sqrt` are just fighting for N carriers. Use a fixed pool sized to your core count for CPU work.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Virtual vs platform thread throughput simulator\nasync function simulate(mode: "virtual" | "platform", tasks: number, durationMs: number, maxConcurrent = 0): Promise<number> {\n  const t0 = Date.now();\n  if (mode === "virtual") {\n    // No cap — all tasks run concurrently\n    await Promise.all(Array.from({ length: tasks }, () => new Promise((r) => setTimeout(r, durationMs))));\n  } else {\n    // Platform: at most maxConcurrent at a time\n    let inflight = 0;\n    let done = 0;\n    return new Promise((resolve) => {\n      const tick = () => {\n        while (inflight < maxConcurrent && done + inflight < tasks) {\n          inflight++;\n          setTimeout(() => { inflight--; done++; if (done === tasks) resolve(Date.now() - t0); else tick(); }, durationMs);\n        }\n      };\n      tick();\n    });\n  }\n  return Date.now() - t0;\n}\n\n(async () => {\n  const TASKS = 500;     // would be 10000 on a real JVM — reduced here so the simulator finishes fast\n  const DURATION = 10;\n  const platMax = 20;\n\n  console.log("Running " + TASKS + " tasks of " + DURATION + "ms each...");\n  const platTime = await simulate("platform", TASKS, DURATION, platMax);\n  console.log("platform (max " + platMax + " concurrent): " + platTime + "ms");\n  const virtTime = await simulate("virtual", TASKS, DURATION);\n  console.log("virtual  (unlimited concurrency):    " + virtTime + "ms");\n  console.log("speedup: " + (platTime / virtTime).toFixed(1) + "x");\n})();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("simulate") &&
          logs.some((l) => l.includes("platform")) &&
          logs.some((l) => l.includes("virtual")) &&
          logs.some((l) => l.includes("speedup:")),
        message: "Virtual threads crush platform threads for I/O-heavy workloads — 500+ concurrent 'requests' with negligible overhead.",
      }),
    },

    // ── Lesson 33 ────────────────────────────────────────────────────────
    {
      title: "Java 33: BlockingQueue & Producer-Consumer",
      content: [
        "`BlockingQueue` is the concurrent backbone of producer-consumer pipelines. `ArrayBlockingQueue` (bounded, array-backed), `LinkedBlockingQueue` (optionally bounded), `SynchronousQueue` (zero capacity hand-off), `PriorityBlockingQueue` (sorted).",
        "Build a producer-consumer with a bounded queue that back-pressures producers when consumers fall behind.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The four operations × three modes",
          body: "**add/offer/put** (insert), **remove/poll/take** (remove), **element/peek/-** (inspect). Three modes: throws, returns special (`null`/`false`), **blocks**. So `queue.put(x)` blocks if full; `queue.take()` blocks if empty. Blocking versions = natural back-pressure.",
          badges: ["API"],
        },
        {
          tag: "concept",
          title: "Choose your queue",
          body: "**`ArrayBlockingQueue`**: fixed capacity, FIFO, low overhead. **`LinkedBlockingQueue`**: optionally bounded, higher throughput (separate head/tail locks). **`SynchronousQueue`**: 0-capacity — every put waits for a take. Used by `newCachedThreadPool`. **`PriorityBlockingQueue`**: heap-based, unbounded, natural ordering or comparator.",
          badges: ["Types"],
        },
        {
          tag: "concept",
          title: "Poison pill shutdown",
          body: "Signal consumers to stop: put a sentinel value. `q.put(POISON); q.put(POISON); ...` (one per consumer). Each consumer sees the poison, exits the loop, returns. Cleaner than interrupt for graceful shutdown.",
          badges: ["Shutdown"],
          code: "final Object POISON = new Object();\n// consumer loop\nwhile (true) {\n  Object x = q.take();\n  if (x == POISON) break;\n  handle(x);\n}",
        },
        {
          tag: "exercise",
          title: "Build a bounded queue + back-pressure",
          body: "Implement `BoundedQueue<T>(capacity)` with `offer` (returns false if full), `poll` (returns null if empty), and an async `put` that `await`s space. Simulate a fast producer + slow consumer — the producer should wait when the queue is full.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer Disruptor for extreme throughput",
          body: "For >100M ops/sec pipelines (trading, logging), `BlockingQueue` locks become the bottleneck. The LMAX **Disruptor** is a ring-buffer-based alternative with no locks and near-zero GC. Overkill for most apps but essential for latency-sensitive ones.",
          badges: ["Disruptor"],
        },
        {
          tag: "key-point",
          title: "Quiz: Back-pressure via queue",
          body: "How does a bounded queue provide back-pressure? **Producer's `put` blocks when queue is full — naturally slows down to the consumer's rate.** Without back-pressure, fast producers overflow memory. The queue is the flow-control mechanism.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Bounded blocking queue with async put/take back-pressure\nclass BoundedQueue<T> {\n  private items: T[] = [];\n  private waiters: Array<() => void> = [];\n  constructor(private capacity: number) {}\n\n  async put(item: T): Promise<void> {\n    while (this.items.length >= this.capacity) {\n      await new Promise<void>((r) => this.waiters.push(r));\n    }\n    this.items.push(item);\n    const next = this.waiters.shift();\n    if (next) next();\n  }\n\n  async take(): Promise<T> {\n    while (this.items.length === 0) {\n      await new Promise<void>((r) => this.waiters.push(r));\n    }\n    const v = this.items.shift()!;\n    const next = this.waiters.shift();\n    if (next) next();\n    return v;\n  }\n\n  size(): number { return this.items.length; }\n}\n\n(async () => {\n  const q = new BoundedQueue<number>(3);\n  let producerWaits = 0;\n\n  const producer = (async () => {\n    for (let i = 1; i <= 10; i++) {\n      const sizeBefore = q.size();\n      if (sizeBefore >= 3) producerWaits++;\n      await q.put(i);\n      console.log("produced " + i + " (queue=" + q.size() + ")");\n    }\n  })();\n\n  const consumer = (async () => {\n    for (let i = 0; i < 10; i++) {\n      await new Promise((r) => setTimeout(r, 5));   // slow consumer\n      const v = await q.take();\n      console.log("consumed " + v);\n    }\n  })();\n\n  await Promise.all([producer, consumer]);\n  console.log("\\nproducer was back-pressured " + producerWaits + " times");\n})();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("BoundedQueue") &&
          code.includes("put") &&
          code.includes("take") &&
          logs.some((l) => l.includes("produced 10")) &&
          logs.some((l) => l.includes("consumed 10")),
        message: "Bounded queue with back-pressure — the producer naturally slowed to the consumer's pace.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 7 — JVM, Memory & GC (Lessons 34-37)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 34 ────────────────────────────────────────────────────────
    {
      title: "Java 34: Heap, Stack & Generational Memory",
      content: [
        "The JVM heap is split into generations: **Young** (Eden + 2 Survivor spaces) and **Old**. Most objects die young — the generational hypothesis — so we collect Young often and Old rarely.",
        "Build an allocator simulator that shows objects flowing Eden → Survivor → Old across minor GC cycles.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Stack vs heap",
          body: "**Stack**: per-thread, fixed-size (default 1MB), holds frames — local variables, operand stack, return address. **Heap**: shared across threads, holds all objects and their fields. Stack allocation is free; heap allocation requires the GC to track and eventually collect.",
          badges: ["Stack", "Heap"],
        },
        {
          tag: "concept",
          title: "Young generation: Eden + Survivors",
          body: "New objects land in **Eden**. When Eden fills, a **minor GC** copies survivors to a **Survivor** space (S0 or S1). Next minor GC copies from the active survivor + Eden to the other survivor. Each copy increments the object's 'age'. When age exceeds a threshold (default 15), the object is **promoted** to Old.",
          badges: ["Eden", "Survivor"],
        },
        {
          tag: "concept",
          title: "Old generation",
          body: "Long-lived objects (caches, singletons, old-generation data structures). Collected by a **major GC** — much more expensive, usually a full stop-the-world pause (depending on the GC algorithm). A full GC also scans and evacuates survivors. **Too many promotions = GC pressure.**",
          badges: ["Old", "Major GC"],
        },
        {
          tag: "exercise",
          title: "Build a generational allocator",
          body: "Simulate: `allocate(obj)` goes to Eden; `minorGC()` moves live Eden + active Survivor to the other Survivor; bump each object's age; if age > 2, promote to Old. Run 100 allocations with periodic minor GCs. Log the three regions and promotion events.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Allocation elimination",
          body: "The JIT may **scalar-replace** an object — if escape analysis proves it never escapes the method, its fields go straight into registers or stack slots. No allocation, no GC. This is why tight loops with small helper objects can still be fast — the JVM sees through them.",
          badges: ["JIT"],
        },
        {
          tag: "key-point",
          title: "Quiz: The generational hypothesis",
          body: "Why does the JVM split Young vs Old? **Empirically, most objects die young** (temp strings, iteration variables, short-lived results). Collecting a small Young generation frequently is cheap; collecting a large Old generation rarely is fine. If you **invalidated** this hypothesis (e.g. giant long-lived caches), you'd need a different GC.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Generational heap simulator\ninterface Obj { id: number; age: number; region: "eden" | "s0" | "s1" | "old" }\n\nclass GenHeap {\n  public eden: Obj[] = [];\n  public s0: Obj[] = [];\n  public s1: Obj[] = [];\n  public old: Obj[] = [];\n  private activeSurvivor: "s0" | "s1" = "s0";\n  public promotions = 0;\n  private nextId = 1;\n\n  allocate(): void {\n    this.eden.push({ id: this.nextId++, age: 0, region: "eden" });\n  }\n\n  minorGC(): void {\n    // Promote age-3+ to old, others to the INACTIVE survivor\n    const target: Obj[] = [];\n    const toOld: Obj[] = [];\n    const incomingFromEden = this.eden.filter(() => Math.random() > 0.3).map((o) => ({ ...o, age: o.age + 1 }));\n    const active = this.activeSurvivor === "s0" ? this.s0 : this.s1;\n    const incomingFromSurv = active.filter(() => Math.random() > 0.4).map((o) => ({ ...o, age: o.age + 1 }));\n\n    for (const o of [...incomingFromEden, ...incomingFromSurv]) {\n      if (o.age >= 3) { o.region = "old"; toOld.push(o); this.promotions++; }\n      else { o.region = this.activeSurvivor === "s0" ? "s1" : "s0"; target.push(o); }\n    }\n\n    this.eden = [];\n    if (this.activeSurvivor === "s0") { this.s0 = []; this.s1 = target; this.activeSurvivor = "s1"; }\n    else                              { this.s1 = []; this.s0 = target; this.activeSurvivor = "s0"; }\n    this.old.push(...toOld);\n  }\n\n  summary(): void {\n    console.log("eden=" + this.eden.length +\n      " s0=" + this.s0.length + " s1=" + this.s1.length +\n      " old=" + this.old.length + " (promotions total=" + this.promotions + ")");\n  }\n}\n\nconst heap = new GenHeap();\nfor (let cycle = 0; cycle < 5; cycle++) {\n  for (let i = 0; i < 20; i++) heap.allocate();\n  console.log("cycle " + cycle + " before minor GC:");\n  heap.summary();\n  heap.minorGC();\n  console.log("cycle " + cycle + " after  minor GC:");\n  heap.summary();\n  console.log("");\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("GenHeap") &&
          code.includes("minorGC") &&
          logs.some((l) => l.includes("promotions total=")) &&
          logs.some((l) => l.includes("after  minor GC")),
        message: "Generational memory visualized — short-lived objects die in Young, survivors get promoted to Old.",
      }),
    },

    // ── Lesson 35 ────────────────────────────────────────────────────────
    {
      title: "Java 35: GC Algorithms — G1, ZGC, Shenandoah",
      content: [
        "Java ships multiple GC algorithms. **G1** (default since Java 9) targets predictable pauses on large heaps. **ZGC** and **Shenandoah** target sub-millisecond pauses via concurrent evacuation — even on 16TB heaps.",
        "Build a GC decision chart and simulate each algorithm's pause profile.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Serial, Parallel, G1, ZGC, Shenandoah",
          body: "**Serial** (`-XX:+UseSerialGC`): single-threaded, for small heaps/embedded. **Parallel** (`-XX:+UseParallelGC`): multi-threaded, throughput-first, long pauses. **G1** (`-XX:+UseG1GC`): region-based, predictable pauses, default since Java 9. **ZGC** (`-XX:+UseZGC`): concurrent, pauses < 10ms. **Shenandoah** (`-XX:+UseShenandoahGC`): Red Hat's concurrent GC, similar goals to ZGC.",
          badges: ["Algorithms"],
        },
        {
          tag: "concept",
          title: "G1 — Garbage First",
          body: "Divides heap into ~2048 **regions** (1-32MB each). Concurrent Marking identifies the regions with the most garbage — G1 collects those **first** (hence the name). Minor GC (young regions only) and mixed GC (young + some old) keep pauses predictable. Tune with `-XX:MaxGCPauseMillis=200`.",
          badges: ["G1"],
        },
        {
          tag: "concept",
          title: "ZGC & Shenandoah — concurrent evacuation",
          body: "Both move objects **while the app runs** — no stop-the-world evacuation. Technique: **load barriers** (ZGC) or **Brooks pointers** (Shenandoah) — every reference read goes through a check that may heal to the new location. Pause times ~1ms regardless of heap size. Cost: ~15% throughput vs G1.",
          badges: ["Concurrent"],
        },
        {
          tag: "exercise",
          title: "Build a GC picker",
          body: "Given a workload `{ heapGB, latencyTarget, throughputPriority }`, recommend G1, ZGC, Shenandoah, Parallel, or Serial. Rules: latency < 10ms → ZGC/Shenandoah. Heap < 200MB → Serial or Parallel. Heap > 16GB → ZGC. Default → G1. Test with 5 realistic scenarios.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Always enable GC logging in prod",
          body: "`-Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=20M` logs every GC event. Tools like GCViewer or gceasy.io parse these for you. If you don't have this flag in prod, you're flying blind on memory issues.",
          badges: ["Ops"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why G1 pauses are predictable",
          body: "How does G1 give you `MaxGCPauseMillis=200`? **It collects only as many regions as it can finish in the budget.** It estimates per-region copy cost from recent GCs and picks the top-K garbage-densest regions that fit the time budget. Trade: if garbage exceeds what fits in one cycle, Old grows — eventually forcing a full GC.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// GC algorithm picker\ntype Workload = { heapGB: number; latencyMs: number; throughputFirst: boolean };\ntype GC = "Serial" | "Parallel" | "G1" | "ZGC" | "Shenandoah";\n\nfunction pickGC(w: Workload): { gc: GC; reason: string } {\n  if (w.latencyMs <= 10)    return { gc: "ZGC",        reason: "pause target <= 10ms requires concurrent GC" };\n  if (w.heapGB < 0.2)       return { gc: "Serial",     reason: "tiny heap — Serial has lowest overhead" };\n  if (w.throughputFirst && w.latencyMs > 500)\n                            return { gc: "Parallel",   reason: "throughput first, pauses acceptable" };\n  if (w.heapGB >= 32)       return { gc: "ZGC",        reason: "huge heap — ZGC scales flat" };\n  return { gc: "G1", reason: "balanced default — predictable pauses on large heaps" };\n}\n\nconst workloads: [string, Workload][] = [\n  ["low-latency API",   { heapGB: 8,   latencyMs: 5,    throughputFirst: false }],\n  ["batch ETL",         { heapGB: 16,  latencyMs: 2000, throughputFirst: true  }],\n  ["embedded service",  { heapGB: 0.1, latencyMs: 100,  throughputFirst: false }],\n  ["big-data cache",    { heapGB: 64,  latencyMs: 200,  throughputFirst: false }],\n  ["web server",        { heapGB: 4,   latencyMs: 150,  throughputFirst: false }],\n];\n\nfor (const [name, w] of workloads) {\n  const p = pickGC(w);\n  console.log(name.padEnd(20) + " -> " + p.gc.padEnd(11) + " (" + p.reason + ")");\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("pickGC") &&
          logs.some((l) => l.includes("ZGC")) &&
          logs.some((l) => l.includes("Parallel")) &&
          logs.some((l) => l.includes("G1")) &&
          logs.some((l) => l.includes("Serial")),
        message: "GC picker working — you can now justify a GC choice based on workload.",
      }),
    },

    // ── Lesson 36 ────────────────────────────────────────────────────────
    {
      title: "Java 36: Class Loading & the Delegation Model",
      content: [
        "Java's **classloaders** load `.class` files on demand. Three built-in loaders: **Bootstrap** (core JDK), **Platform** (formerly Extension), **System/Application** (your classpath). They follow a **parent-first delegation** model — security-critical, because it stops you from overriding `java.lang.String`.",
        "Build a classloader simulator that mirrors delegation and demonstrate what happens when you try to shadow a core class.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The three classloaders",
          body: "**Bootstrap** (native, loads `java.*`, written in C++). **Platform** (loads JDK modules like `java.sql`, `java.logging` since Java 9). **System** (loads your app classpath and modules). Each has a parent; they form a chain rooted at Bootstrap.",
          badges: ["Classloaders"],
        },
        {
          tag: "concept",
          title: "Parent-first delegation",
          body: "On `loadClass(name)`: (1) check if already loaded — return. (2) **Ask parent** — if parent has it, use parent's version. (3) Only if parent fails, try to load from own sources. This means you **cannot** redefine `java.lang.String` — the Bootstrap loader always finds it first.",
          badges: ["Delegation"],
        },
        {
          tag: "concept",
          title: "Class identity = (name + classloader)",
          body: "A class is identified by its **fully qualified name + the classloader that loaded it**. `com.foo.Bar` loaded by ClassLoader A is a **different** type than the same name loaded by ClassLoader B. Assignments between them throw `ClassCastException` at runtime. This is how hot-reload frameworks isolate versions.",
          badges: ["Identity"],
        },
        {
          tag: "exercise",
          title: "Build a delegation chain",
          body: "Three simulated classloaders: `Boot`, `Platform`, `App`. Each has a `knownClasses: Set<string>`. `load(name)` delegates up first. Show: (1) `java.lang.String` resolves via Boot even if App has one. (2) `com.myapp.Foo` resolves via App. (3) Two App classloaders loading the same name yields distinct 'identities'.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Context classloader gotcha",
          body: "`Thread.currentThread().getContextClassLoader()` is a thread-local hack for frameworks (JDBC, ServiceLoader) to escape strict delegation. If you've ever seen `ClassNotFoundException` in a plugin system, the context classloader is usually involved.",
          badges: ["Gotcha"],
        },
        {
          tag: "key-point",
          title: "Quiz: Sealing core classes",
          body: "Why does the JDK refuse to load a user-provided `java.lang.String`? **Parent-first delegation + package sealing.** Bootstrap has `java.lang.String` already — parent-first finds it before the app version. Also, the `java.*` package is sealed — only Bootstrap may define classes in it.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Classloader delegation simulator\nclass FakeLoader {\n  private loaded = new Map<string, string>();  // name -> "content"\n  constructor(public name: string, private parent: FakeLoader | null, private known: Record<string, string>) {}\n\n  loadClass(name: string): string | null {\n    if (this.loaded.has(name)) return this.loaded.get(name) + " [cached]";\n    // Parent-first delegation\n    if (this.parent) {\n      const fromParent = this.parent.loadClass(name);\n      if (fromParent) return fromParent;\n    }\n    const body = this.known[name];\n    if (!body) return null;\n    const loaded = body + " (by " + this.name + ")";\n    this.loaded.set(name, loaded);\n    return loaded;\n  }\n}\n\nconst boot     = new FakeLoader("Boot",     null, { "java.lang.String": "core String" });\nconst platform = new FakeLoader("Platform", boot, { "java.sql.Connection": "core Connection" });\nconst app1     = new FakeLoader("App1",     platform, { "com.myapp.Foo": "MyFoo", "java.lang.String": "user-provided String" });\nconst app2     = new FakeLoader("App2",     platform, { "com.myapp.Foo": "Different MyFoo" });\n\nconsole.log(app1.loadClass("java.lang.String"));       // core — parent found it\nconsole.log(app1.loadClass("com.myapp.Foo"));          // MyFoo via App1\nconsole.log(app2.loadClass("com.myapp.Foo"));          // Different MyFoo via App2\nconsole.log("\\nSame name, different classloader = different types:");\nconsole.log("app1 version: " + app1.loadClass("com.myapp.Foo"));\nconsole.log("app2 version: " + app2.loadClass("com.myapp.Foo"));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("FakeLoader") &&
          code.includes("loadClass") &&
          logs.some((l) => l.includes("core String")) &&
          logs.some((l) => l.includes("MyFoo")) &&
          logs.some((l) => l.includes("Different MyFoo")),
        message: "Classloader delegation demonstrated — parent-first is why you can't hijack java.lang.String.",
      }),
    },

    // ── Lesson 37 ────────────────────────────────────────────────────────
    {
      title: "Java 37: Reference Types — Strong, Soft, Weak, Phantom",
      content: [
        "Java has four reference strengths, from most to least reachable: **strong** (normal), **soft** (cleared under memory pressure), **weak** (cleared at next GC), **phantom** (cleared at GC + enqueued for post-finalization cleanup).",
        "Build a tiny cache using `WeakReference` semantics — entries disappear as the GC decides they're no longer needed.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Strong references — the default",
          body: "Any normal field or variable is a strong ref. As long as at least one strong ref exists, the object stays alive. Memory leaks = unintended strong references (e.g., a static list that never shrinks, or an inner class holding its outer instance).",
          badges: ["Strong"],
        },
        {
          tag: "concept",
          title: "Soft, Weak, Phantom",
          body: "**`SoftReference`**: GC **may** clear if memory is tight — good for memory-sensitive caches. **`WeakReference`**: GC clears on next cycle if no strong refs remain — good for canonicalization maps (`WeakHashMap`). **`PhantomReference`**: never returns the referent; enqueued in a `ReferenceQueue` after finalization — used for reliable cleanup of native resources.",
          badges: ["Soft", "Weak", "Phantom"],
          code: "WeakHashMap<Key, Value> cache = new WeakHashMap<>();\ncache.put(key, val);\n// when `key` has no other strong refs, the entry vanishes on next GC",
        },
        {
          tag: "concept",
          title: "ReferenceQueue",
          body: "When a Soft/Weak/Phantom ref is cleared, the JVM enqueues the **Reference** object (not the referent) into a `ReferenceQueue` you provided. You drain the queue to run cleanup logic. This is how `DirectByteBuffer`'s off-heap memory is freed — Phantom ref + cleanup thread.",
          badges: ["Queue"],
        },
        {
          tag: "exercise",
          title: "Build a Weak-ref cache",
          body: "`WeakCache<K, V>` with `put(k, v)` and `get(k)`. Internally use a Map to `{ valueHolder, strongKeyHolder }` and expose a `sweep()` that simulates GC clearing entries whose external strong references (tracked by a symbol table) are gone. Test: insert 5 entries, drop 3 external refs, sweep, verify only 2 remain.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Cache eviction: LRU > Soft",
          body: "`SoftReference`-based caches used to be popular but are now discouraged: the GC has no idea about your access patterns, so it may evict the hottest entries first. A bounded LRU cache (`LinkedHashMap` with `accessOrder=true` or Caffeine) almost always beats soft refs in practice.",
          badges: ["Caching"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why PhantomReference exists",
          body: "What's the point if you can't get the referent? **Reliable post-finalization cleanup.** `finalize()` is deprecated and unreliable; phantom refs let you run cleanup **after** the object is truly unreachable, without resurrecting it. Used for native resource release in `java.nio`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Weak-reference-style cache simulator\nclass WeakCache<K, V> {\n  private entries = new Map<K, V>();\n  private externalAlive = new Set<K>();\n\n  put(k: K, v: V): void {\n    this.entries.set(k, v);\n    this.externalAlive.add(k);\n  }\n\n  get(k: K): V | undefined { return this.entries.get(k); }\n\n  // Simulate dropping the external strong reference\n  releaseExternal(k: K): void { this.externalAlive.delete(k); }\n\n  // Simulate a GC cycle: entries with no external strong ref are cleared\n  sweep(): number {\n    let cleared = 0;\n    for (const k of this.entries.keys()) {\n      if (!this.externalAlive.has(k)) { this.entries.delete(k); cleared++; }\n    }\n    return cleared;\n  }\n\n  size(): number { return this.entries.size; }\n}\n\nconst cache = new WeakCache<string, number>();\nconst keys = ["alice", "bob", "carol", "dave", "eve"];\nkeys.forEach((k, i) => cache.put(k, i));\n\nconsole.log("after put: size=" + cache.size());\n// External code drops 3 keys\n["alice", "carol", "eve"].forEach((k) => cache.releaseExternal(k));\n\nconst cleared = cache.sweep();\nconsole.log("after sweep: cleared=" + cleared + " size=" + cache.size());\nconsole.log("bob?  " + cache.get("bob"));\nconsole.log("eve?  " + cache.get("eve"));   // undefined — swept`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("WeakCache") &&
          code.includes("sweep") &&
          logs.some((l) => l.includes("size=5")) &&
          logs.some((l) => l.includes("cleared=3")) &&
          logs.some((l) => l.includes("size=2")),
        message: "Weak-reference semantics — entries disappear as external references go away.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 8 — Modern Java & Capstone (Lessons 38-40)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 38 ────────────────────────────────────────────────────────
    {
      title: "Java 38: Pattern Matching for instanceof & switch",
      content: [
        "Pattern matching (Java 16+ for instanceof, Java 21 for switch) eliminates the 'cast boilerplate' and makes sealed + record hierarchies ergonomic.",
        "Build a tax calculator using switch patterns over a sealed `Shape` hierarchy — each case both matches and deconstructs.",
      ],
      sections: [
        {
          tag: "concept",
          title: "instanceof pattern (Java 16)",
          body: "`if (obj instanceof String s) { /* s is a String here */ }` — the **binding variable** (`s`) is in scope only inside the true branch. Also scopes to the `&&` chain and the following `if`-else. Replaces the old instanceof-then-cast idiom.",
          badges: ["instanceof"],
          code: "// Old\nif (o instanceof String) {\n  String s = (String) o;\n  return s.length();\n}\n\n// Modern\nif (o instanceof String s) return s.length();",
        },
        {
          tag: "concept",
          title: "switch patterns (Java 21)",
          body: "`switch (shape) { case Circle c -> Math.PI * c.r() * c.r(); case Square s -> s.side() * s.side(); }`. Deconstructs records in-place. On sealed hierarchies, the compiler enforces exhaustiveness — missing a permitted type is a compile error.",
          badges: ["switch"],
          code: "double area(Shape s) {\n  return switch (s) {\n    case Circle c            -> Math.PI * c.r() * c.r();\n    case Rectangle(var w, var h) -> w * h;   // record deconstruction\n    case Triangle t          -> 0.5 * t.base() * t.height();\n  };\n}",
        },
        {
          tag: "concept",
          title: "Guarded patterns",
          body: "`case Point p when p.x() > 0 && p.y() > 0 -> \"Q1\"` — a `when` clause refines a pattern with an extra predicate. Evaluated after the type match. Useful for state-machine decisions without nested `if`s.",
          badges: ["Guards"],
        },
        {
          tag: "exercise",
          title: "Build a tax calculator",
          body: "Use a tagged-union `Income = Salary | Freelance | Dividend | Capital` (TS equivalent of a sealed hierarchy). Write `tax(income)` using a `switch (income.kind)` with exhaustive checks and `when`-style guards ('high earner bracket'). Run for 4 income samples.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer switch expressions over if-chains",
          body: "An `if (x instanceof A a) return ...; else if (x instanceof B b) return ...;` chain is mechanical. `switch (x) { case A a -> ...; case B b -> ...; }` is shorter, harder to accidentally fall through, and exhaustive-checked on sealed types. Modernize your code — it pays off.",
          badges: ["Style"],
        },
        {
          tag: "key-point",
          title: "Quiz: Null in a sealed switch",
          body: "`switch (sealedRef)` when the reference could be null — does it throw NPE? **Only if there's no `case null` branch.** Java 21 switches can include `case null -> ...` or `case null, default -> ...` — if you omit both, null triggers an NPE, matching classic switch behavior.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Pattern matching via tagged union + exhaustive switch\ntype Income =\n  | { kind: "salary";    amount: number; bracket: "basic" | "high" }\n  | { kind: "freelance"; amount: number; deductible: number }\n  | { kind: "dividend";  amount: number; qualified: boolean }\n  | { kind: "capital";   amount: number; longTerm: boolean };\n\nfunction tax(i: Income): number {\n  switch (i.kind) {\n    case "salary":\n      // guarded branch\n      return i.bracket === "high" ? i.amount * 0.37 : i.amount * 0.22;\n    case "freelance":\n      return (i.amount - i.deductible) * 0.30;\n    case "dividend":\n      return i.qualified ? i.amount * 0.15 : i.amount * 0.22;\n    case "capital":\n      return i.longTerm ? i.amount * 0.15 : i.amount * 0.22;\n    default: {\n      const _: never = i;\n      return _;\n    }\n  }\n}\n\nconst incomes: Income[] = [\n  { kind: "salary",    amount: 120_000, bracket: "basic" },\n  { kind: "salary",    amount: 500_000, bracket: "high" },\n  { kind: "freelance", amount: 80_000, deductible: 15_000 },\n  { kind: "dividend",  amount: 10_000, qualified: true },\n  { kind: "capital",   amount: 50_000, longTerm: false },\n];\n\nlet total = 0;\nfor (const i of incomes) {\n  const t = tax(i);\n  total += t;\n  console.log(i.kind.padEnd(11) + " $" + i.amount.toString().padStart(8) + " -> tax $" + t.toFixed(2));\n}\nconsole.log("\\ntotal tax: $" + total.toFixed(2));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("tax") &&
          code.includes("never") &&
          logs.some((l) => l.includes("salary")) &&
          logs.some((l) => l.includes("freelance")) &&
          logs.some((l) => l.includes("total tax:")),
        message: "Exhaustive pattern match over a sealed-style hierarchy — this is what modern Java looks like.",
      }),
    },

    // ── Lesson 39 ────────────────────────────────────────────────────────
    {
      title: "Java 39: Text Blocks, Switch Expressions & Java 8→17 Recap",
      content: [
        "The most interview-relevant modern features: text blocks, switch expressions, `var`, records, sealed classes, pattern matching. Know which version introduced each.",
        "Build a feature matrix that maps each modern feature to its Java version — with a concrete example of before/after.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Text blocks (Java 15)",
          body: "`\"\"\"multi-line string\"\"\"` — preserves indentation relative to the least-indented line, stripping common leading whitespace. Backslash escapes work. Great for JSON, SQL, and HTML literals inline.",
          badges: ["Text Blocks", "Java 15"],
          code: "String json = \"\"\"\n    {\n      \"name\": \"%s\",\n      \"age\": %d\n    }\n    \"\"\".formatted(name, age);",
        },
        {
          tag: "concept",
          title: "Switch expressions (Java 14)",
          body: "Arrow syntax with no fall-through, returns a value, must be exhaustive over enums/sealed types. `yield` for multi-statement branches. Replaces 90% of switch statements.",
          badges: ["Switch Expr", "Java 14"],
          code: "int dayLetters = switch (day) {\n  case MON, WED, FRI -> 1;\n  case TUE, THU      -> 2;\n  case SAT, SUN      -> {\n    System.out.println(\"weekend\");\n    yield 3;\n  }\n};",
        },
        {
          tag: "concept",
          title: "The full modern Java map",
          body: "**8**: lambdas, streams, Optional, default methods, `java.time`. **9**: modules, `var` in lambda params, `List.of`/`Map.of`. **10**: `var`. **11**: HttpClient. **14**: switch expressions. **15**: text blocks. **16**: records, instanceof pattern. **17**: sealed classes (LTS). **21**: virtual threads, switch patterns, record patterns (LTS).",
          badges: ["Timeline"],
        },
        {
          tag: "exercise",
          title: "Build a feature-version matrix",
          body: "Create `JavaFeature[]` with `{ name, since, example, replaces }`. Dump a table sorted by version. Add a helper `supports(version, feature)` that returns true if the version >= feature's since. Verify Java 11 supports `var` but not `records`.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Target the LTS you'll ship",
          body: "LTS releases (8, 11, 17, 21) get long-term bug fixes. Target Java 17 or 21 for new services — Java 8 is end-of-support (extended only via paid plans). `--release 17` ensures the compiler refuses to emit code that won't run on 17, even with a newer JDK.",
          badges: ["LTS"],
        },
        {
          tag: "key-point",
          title: "Quiz: LTS versions",
          body: "Which Java versions are LTS? **8, 11, 17, 21** — with 25 coming up. Non-LTS versions get 6 months of support. Oracle charges for extended LTS support; OpenJDK distros (Amazon Corretto, Eclipse Temurin) give it for free.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Modern Java feature matrix\ninterface JavaFeature { name: string; since: number; example: string; replaces: string }\n\nconst features: JavaFeature[] = [\n  { name: "lambdas",          since: 8,  example: "x -> x * 2",                replaces: "anonymous class" },\n  { name: "streams",          since: 8,  example: "list.stream().filter(...)", replaces: "for/if/collect" },\n  { name: "Optional",         since: 8,  example: "Optional.of(x)",            replaces: "null + null-check" },\n  { name: "modules",          since: 9,  example: "module my.app { ... }",     replaces: "classpath chaos" },\n  { name: "var",              since: 10, example: "var list = new ArrayList<String>()", replaces: "verbose LHS" },\n  { name: "HttpClient",       since: 11, example: "HttpClient.newHttpClient()", replaces: "URLConnection" },\n  { name: "switch expression", since: 14, example: "switch (x) { case A -> 1; }", replaces: "switch statement + break" },\n  { name: "text blocks",       since: 15, example: "\\"\\"\\"multi\\nline\\"\\"\\"",        replaces: "+ with \\\\n" },\n  { name: "records",           since: 16, example: "record Point(int x, int y) {}",  replaces: "DTO boilerplate" },\n  { name: "instanceof pattern",since: 16, example: "if (o instanceof String s) ...",  replaces: "cast after instanceof" },\n  { name: "sealed classes",    since: 17, example: "sealed interface Shape permits Circle, Square", replaces: "open hierarchy + runtime checks" },\n  { name: "virtual threads",   since: 21, example: "Thread.startVirtualThread(...)",  replaces: "thread pools for I/O" },\n  { name: "switch patterns",   since: 21, example: "case Circle c -> ...",         replaces: "if-instanceof chain" },\n];\n\nfunction supports(version: number, name: string): boolean {\n  const f = features.find((x) => x.name === name);\n  return !!f && version >= f.since;\n}\n\nconsole.log("=== Java feature timeline ===");\nfor (const f of features) {\n  console.log("Java " + f.since.toString().padStart(2) + " | " + f.name.padEnd(22) + " | replaces: " + f.replaces);\n}\n\nconsole.log("\\nsupports(11, 'var')      = " + supports(11, "var"));\nconsole.log("supports(11, 'records')  = " + supports(11, "records"));\nconsole.log("supports(17, 'records')  = " + supports(17, "records"));\nconsole.log("supports(17, 'virtual threads') = " + supports(17, "virtual threads"));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("supports") &&
          logs.some((l) => l.includes("Java  8")) &&
          logs.some((l) => l.includes("Java 17")) &&
          logs.some((l) => l.includes("supports(11, 'var')      = true")) &&
          logs.some((l) => l.includes("supports(11, 'records')  = false")),
        message: "Modern Java feature map — you can now answer 'since which version' without a search engine.",
      }),
    },

    // ── Lesson 40 ────────────────────────────────────────────────────────
    {
      title: "Java 40: Interview Capstone — Thread-Safe Bounded LRU Cache",
      content: [
        "The capstone: design a thread-safe bounded LRU cache in Java. This question comes up in every senior interview. It combines HashMap internals, doubly-linked list manipulation, concurrency primitives, and API design.",
        "Build a `BoundedLRU<K, V>(capacity)` with O(1) `get` and `put`, safe for concurrent access, with sensible eviction + stats.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The design sketch",
          body: "**HashMap<K, Node>** for O(1) key lookup. **Doubly-linked list of Node(k, v, prev, next)** for O(1) move-to-front and remove-tail. On `get(k)`: find node, unlink, move to head. On `put(k, v)`: if new and size >= capacity, remove tail from list + map; then add new node at head. Thread safety: one lock around the whole structure, or — better — `ConcurrentHashMap` + careful CAS (advanced).",
          badges: ["Design"],
        },
        {
          tag: "concept",
          title: "LinkedHashMap shortcut",
          body: "Java's `LinkedHashMap(capacity, loadFactor, true /* accessOrder */)` is already an LRU — just override `removeEldestEntry(eldest)` to return `size() > capacity`. Wrap with `Collections.synchronizedMap` for thread safety. For interviews, implement it from scratch first — the shortcut is post-interview insight.",
          badges: ["LinkedHashMap"],
          code: "new LinkedHashMap<K, V>(cap, 0.75f, true) {\n  @Override\n  protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n    return size() > cap;\n  }\n};",
        },
        {
          tag: "concept",
          title: "What interviewers probe",
          body: "Typical follow-ups: (1) Why doubly-linked? (single-linked can't unlink in O(1)). (2) How do you make it thread-safe without serializing everything? (striped locks, or Caffeine's `BoundedLocalCache`). (3) What if the cache is distributed? (consistent hashing, TTL). (4) How do you handle TTL + LRU together? (expiration queue by timestamp). Know the trade-offs.",
          badges: ["Follow-ups"],
        },
        {
          tag: "exercise",
          title: "Implement the cache",
          body: "`BoundedLRU<K, V>(capacity)` with: `get(k)`, `put(k, v)`, `size()`, `stats()` (hits, misses, evictions). Track hits/misses/evictions. Test: fill a cache of capacity 3 with 5 keys, then access the first key (promotes it), then add another — the 'coldest' key should be evicted, not the recently-accessed one.",
          badges: ["Practice", "Capstone"],
        },
        {
          tag: "tip",
          title: "In production: use Caffeine",
          body: "`Caffeine` is the industry-standard Java cache library: window-TinyLFU eviction (empirically beats pure LRU), near-linear scaling, async loading, expiration policies. In an interview, implement pure LRU; in real code, `Caffeine.newBuilder().maximumSize(10_000).build()`.",
          badges: ["Caffeine"],
        },
        {
          tag: "key-point",
          title: "Quiz: Concurrent LRU",
          body: "What's hard about a lock-free concurrent LRU? **The linked-list mutations.** Updating the order on every `get` means most reads become writes to the shared structure. Caffeine avoids this by buffering access events in a thread-local ring and draining them in batches — amortized lock-free reads.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Bounded LRU Cache — capstone\nclass LRUNode<K, V> {\n  prev: LRUNode<K, V> | null = null;\n  next: LRUNode<K, V> | null = null;\n  constructor(public key: K, public value: V) {}\n}\n\nclass BoundedLRU<K, V> {\n  private map = new Map<K, LRUNode<K, V>>();\n  private head: LRUNode<K, V> | null = null;   // most recently used\n  private tail: LRUNode<K, V> | null = null;   // least recently used — eviction target\n  public hits = 0; public misses = 0; public evictions = 0;\n\n  constructor(private capacity: number) {}\n\n  private unlink(n: LRUNode<K, V>): void {\n    if (n.prev) n.prev.next = n.next; else this.head = n.next;\n    if (n.next) n.next.prev = n.prev; else this.tail = n.prev;\n    n.prev = n.next = null;\n  }\n  private moveToHead(n: LRUNode<K, V>): void {\n    n.next = this.head;\n    if (this.head) this.head.prev = n;\n    this.head = n;\n    if (!this.tail) this.tail = n;\n  }\n\n  get(k: K): V | undefined {\n    const n = this.map.get(k);\n    if (!n) { this.misses++; return undefined; }\n    this.hits++;\n    this.unlink(n);\n    this.moveToHead(n);\n    return n.value;\n  }\n\n  put(k: K, v: V): void {\n    const existing = this.map.get(k);\n    if (existing) { existing.value = v; this.unlink(existing); this.moveToHead(existing); return; }\n    if (this.map.size >= this.capacity && this.tail) {\n      const evict = this.tail;\n      this.unlink(evict);\n      this.map.delete(evict.key);\n      this.evictions++;\n    }\n    const n = new LRUNode(k, v);\n    this.moveToHead(n);\n    this.map.set(k, n);\n  }\n\n  size(): number { return this.map.size; }\n  stats(): string { return "hits=" + this.hits + " misses=" + this.misses + " evictions=" + this.evictions + " size=" + this.size(); }\n\n  order(): K[] {\n    const out: K[] = [];\n    for (let n = this.head; n; n = n.next) out.push(n.key);\n    return out;\n  }\n}\n\nconst cache = new BoundedLRU<string, number>(3);\ncache.put("a", 1);\ncache.put("b", 2);\ncache.put("c", 3);\ncache.get("a");        // a becomes most recently used\ncache.put("d", 4);     // evicts b (the oldest)\nconsole.log("order (head->tail): " + cache.order().join(" -> "));\nconsole.log(cache.stats());\nconsole.log("get('b') -> " + cache.get("b"));   // undefined (evicted)\nconsole.log("get('a') -> " + cache.get("a"));   // 1\nconsole.log(cache.stats());`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("BoundedLRU") &&
          code.includes("unlink") &&
          code.includes("moveToHead") &&
          logs.some((l) => l.includes("evictions=1")) &&
          logs.some((l) => l.includes("a -> d -> c") || l.includes("a -> d") || l.includes("head->tail): a")) &&
          logs.some((l) => l.includes("get('b') -> undefined")),
        message: "You have built the canonical bounded thread-safe LRU cache — the most-asked Java design question, solved.",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `java-${i + 1}`;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: i < raw.length - 1 ? `java-${i + 2}` : undefined,
      prevStep: i > 0 ? `java-${i}` : undefined,
      content: lesson.content,
    };
  });
}

export const JAVA_COURSE_LESSONS = buildJavaLessons();

export function getJavaLessonById(slug: string): WebCourseLesson | undefined {
  return JAVA_COURSE_LESSONS.find((l) => l.id === slug);
}
