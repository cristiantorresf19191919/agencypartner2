/**
 * MobX Interview Prep — 24 lessons covering the reactivity model, derivations,
 * React integration, and advanced patterns. Every lesson uses real MobX APIs
 * in the Monaco editor, so you can experiment with `observable`, `computed`,
 * `autorun`, `reaction`, `when`, and `makeAutoObservable` as they actually run.
 *
 * Tiers:
 *   1. Reactivity Fundamentals (1-6)
 *   2. Derivations & Actions   (7-12)
 *   3. React Integration       (13-18)
 *   4. Advanced + Interview    (19-24)
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

/**
 * NOTE: the interactive code uses a tiny hand-rolled "reactive" helper that
 * mirrors MobX's semantics (observable value + observer registration + push
 * notification). This lets learners see the reactivity model — the actual
 * MobX library adds proxy-based tracking, batching, and a derivation graph.
 */

function buildMobxLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
    /* ══════════════════════════════════════════════════════════════════════
     * TIER 1 — Reactivity Fundamentals (Lessons 1-6)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 1 ─────────────────────────────────────────────────────────
    {
      title: "MobX 1: What Is MobX? The Reactivity Model",
      content: [
        "MobX is a **transparent functional reactive programming** library. You declare state as observable, derivations as computed, and reactions as autoruns/reactions. When state changes, MobX automatically recomputes only what's needed — nothing more.",
        "Build a tiny reactive primitive that mirrors MobX's core loop: observable → observer registration → automatic re-run on change.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The three roles",
          body: "**State**: observable values. **Derivations**: pure functions of state (`computed`). **Reactions**: side-effects that re-run when their inputs change (`autorun`, `reaction`, `observer` components). MobX tracks which observable each derivation and reaction reads, then **only** invalidates the ones that actually depend on a changed value.",
          badges: ["State", "Derivation", "Reaction"],
          code: "import { observable, computed, autorun } from 'mobx';\nconst cart = observable({ items: [] as Item[] });\nconst total = computed(() => cart.items.reduce((s, i) => s + i.price, 0));\nautorun(() => console.log('total:', total.get()));",
        },
        {
          tag: "concept",
          title: "Auto-tracking via proxies",
          body: "When a derivation runs, MobX records every observable it reads (via a Proxy intercepting property access). When that observable later changes, MobX re-invokes the derivation. No dependency declarations, no `useMemo(fn, [deps])` arrays — the tracking is automatic and always correct.",
          badges: ["Proxy", "Tracking"],
        },
        {
          tag: "concept",
          title: "Minimal re-computation",
          body: "If you have 100 computed values but only 3 depend on the property you changed, only those 3 recompute. MobX doesn't diff your UI — it diffs your *data*, which is cheaper.",
          badges: ["Granular"],
        },
        {
          tag: "exercise",
          title: "Build a tiny reactive primitive",
          body: "Implement `reactive<T>(initial)` that returns `{ get(), set(v), onChange(fn) }`. Reactions registered via `autorun(fn)` should read the current value via `.get()` — the framework records every observable accessed during the run, and re-runs the reaction when any of them change.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Think in state + derivations",
          body: "The MobX discipline: **never write code that transforms state imperatively when a `computed` would do**. A computed derivation is guaranteed consistent, auto-memoized, and auto-invalidated. Imperative transformation is where bugs live.",
          badges: ["Discipline"],
        },
        {
          tag: "key-point",
          title: "Quiz: MobX vs Redux mental model",
          body: "Redux: single store + pure reducers + dispatch → re-render the whole world. MobX: decentralized observables + tracked reactions → re-render only what changed. **Redux is explicit; MobX is reactive.** Neither is strictly better — MobX wins on ceremony, Redux on time-travel debugging.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Mini reactive primitive — mirrors MobX's core loop\nlet currentTracker: Set<() => void> | null = null;\n\nfunction reactive<T>(initial: T) {\n  let value = initial;\n  const subscribers = new Set<() => void>();\n\n  return {\n    get(): T {\n      // Register this read with whatever reaction is currently tracking\n      if (currentTracker) currentTracker.add(() => subscribers.forEach((s) => s()));\n      return value;\n    },\n    set(v: T): void {\n      if (Object.is(v, value)) return;   // no change — skip notify\n      value = v;\n      subscribers.forEach((sub) => sub());\n    },\n    subscribe(fn: () => void): () => void {\n      subscribers.add(fn);\n      return () => subscribers.delete(fn);\n    },\n  };\n}\n\nfunction autorun(fn: () => void): void {\n  const run = () => {\n    currentTracker = new Set();\n    fn();\n    const finalize = currentTracker;\n    currentTracker = null;\n    finalize.forEach((register) => register());\n  };\n  run();\n}\n\n// Demo: counter + double\nconst count = reactive(0);\nlet doubleCalls = 0;\n\nautorun(() => {\n  doubleCalls++;\n  console.log("autorun fires: count=" + count.get() + " double=" + count.get() * 2);\n});\n\ncount.set(1);\ncount.set(2);\ncount.set(2);    // same value — no fire\ncount.set(5);\n\nconsole.log("\\ntotal autorun invocations: " + doubleCalls);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("reactive") &&
          code.includes("autorun") &&
          logs.some((l) => l.includes("count=0")) &&
          logs.some((l) => l.includes("count=5")) &&
          logs.some((l) => l.includes("total autorun invocations")),
        message: "You have built MobX's core reactivity loop — observable + tracked reads + push notification.",
      }),
    },

    // ── Lesson 2 ─────────────────────────────────────────────────────────
    {
      title: "MobX 2: observable & makeObservable",
      content: [
        "`observable` turns a plain object into a reactive one. `makeObservable(this, annotations)` (MobX 6+) lets you annotate class fields explicitly — the replacement for legacy decorators.",
        "Build a `CartStore` class with `makeObservable` annotations and see that mutations to observable fields trigger tracked reactions.",
      ],
      sections: [
        {
          tag: "concept",
          title: "observable: the primary decorator",
          body: "`observable` (the annotation) marks a field as tracked. Reading it registers the current reaction as a dependency. Writing it notifies all dependents. For objects, every property is recursively observable unless explicitly opted out.",
          badges: ["observable"],
          code: "import { observable, makeObservable, action } from 'mobx';\n\nclass Cart {\n  items: Item[] = [];\n  coupon = '';\n\n  constructor() {\n    makeObservable(this, {\n      items:     observable,\n      coupon:    observable,\n      addItem:   action,\n      clear:     action,\n    });\n  }\n\n  addItem(item: Item) { this.items.push(item); }\n  clear() { this.items = []; this.coupon = ''; }\n}",
        },
        {
          tag: "concept",
          title: "makeAutoObservable",
          body: "`makeAutoObservable(this)` infers the annotations: fields become `observable`, methods become `action`, getters become `computed`. Call in the constructor. It's the most ergonomic option — but doesn't work well with inheritance (use `makeObservable` if you extend).",
          badges: ["makeAutoObservable"],
          code: "class Cart {\n  items: Item[] = [];\n  constructor() { makeAutoObservable(this); }\n  addItem(item: Item) { this.items.push(item); }\n  get total() { return this.items.reduce((s, i) => s + i.price, 0); }\n}",
        },
        {
          tag: "concept",
          title: "observable vs observable.ref vs observable.shallow",
          body: "**`observable`** (default): deep — nested objects/arrays become observable too. **`observable.ref`**: only the reference is tracked, contents aren't (useful for immutable data). **`observable.shallow`**: collection's top-level tracked, but its items aren't. Choose based on mutation patterns.",
          badges: ["Depth"],
        },
        {
          tag: "exercise",
          title: "Build a CartStore",
          body: "Implement a `CartStore` class using the reactive primitive from Lesson 1: `items: Item[]`, `coupon: string`, `addItem(item)`, `clear()`. Wire up an `autorun` that logs the item count. Mutate and watch it re-run.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "One store per domain",
          body: "Don't stuff everything into one giant store. Split: `UserStore`, `CartStore`, `UiStore`. Inject a `RootStore` that holds them all, and pass the root into each child so they can reference each other. Better mental model + better test isolation.",
          badges: ["Architecture"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why makeObservable in the constructor?",
          body: "Why must `makeObservable`/`makeAutoObservable` be called in the constructor? **Because it wraps the *instance* — each instance gets its own observable state.** Calling it once at class definition would share state across instances (bug).",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// CartStore with the mini reactive primitive\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial;\n  const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { v = nv; subs.forEach((s) => s()); },\n    mutate(fn: (t: T) => void): void { fn(v); subs.forEach((s) => s()); },\n  };\n}\n\nfunction autorun(fn: () => void): void {\n  const go = () => {\n    tracker = new Set();\n    fn();\n    const finalize = tracker; tracker = null;\n    finalize.forEach((r) => r());\n  };\n  go();\n}\n\ninterface Item { id: number; name: string; price: number }\n\nclass CartStore {\n  items = obs<Item[]>([]);\n  coupon = obs<string>("");\n\n  addItem(item: Item): void { this.items.mutate((arr) => arr.push(item)); }\n  applyCoupon(c: string): void { this.coupon.set(c); }\n  clear(): void { this.items.set([]); this.coupon.set(""); }\n}\n\nconst cart = new CartStore();\nautorun(() => console.log("cart size: " + cart.items.get().length + " coupon: '" + cart.coupon.get() + "'"));\n\ncart.addItem({ id: 1, name: "Laptop", price: 1200 });\ncart.addItem({ id: 2, name: "Mouse",  price: 25 });\ncart.applyCoupon("SUMMER10");\ncart.clear();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("CartStore") &&
          code.includes("addItem") &&
          logs.some((l) => l.includes("cart size: 0")) &&
          logs.some((l) => l.includes("cart size: 2")) &&
          logs.some((l) => l.includes("SUMMER10")),
        message: "Observable store working — mutations to items/coupon auto-fired the logging reaction.",
      }),
    },

    // ── Lesson 3 ─────────────────────────────────────────────────────────
    {
      title: "MobX 3: computed — Auto-Memoized Derivations",
      content: [
        "`computed` values are derivations of observable state. They're **auto-memoized** — MobX only recomputes when a dependency changes. If nothing observable in the derivation changed, the cached value is returned.",
        "Build a cart with a `total` computed — and verify the derivation recomputes exactly as often as its inputs change, not once per read.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Getters become computed",
          body: "With `makeAutoObservable`, class getters are treated as `computed` automatically. The first call computes; subsequent calls return the cache; the cache invalidates when any tracked observable changes.",
          badges: ["Getter"],
          code: "class Cart {\n  items: Item[] = [];\n  constructor() { makeAutoObservable(this); }\n  get total() { return this.items.reduce((s, i) => s + i.price, 0); }\n}",
        },
        {
          tag: "concept",
          title: "Cache keeping — keepAlive",
          body: "By default, `computed` is only cached while at least one observer (reaction or another computed) is watching. With no observers, each read recomputes. Use `computed({ keepAlive: true })` or just ensure a reaction subscribes to it.",
          badges: ["Lifecycle"],
        },
        {
          tag: "concept",
          title: "Computeds are pure",
          body: "Never mutate state inside a computed. It must be a **pure function of its inputs**. If it has side effects, you'll get weird behavior as MobX decides when to call it (0+ times per change). Put side effects in `reaction` or `autorun`.",
          badges: ["Purity"],
        },
        {
          tag: "exercise",
          title: "Measure computation count",
          body: "Implement a cart with an observable items array and a `total` computed that increments a `computations` counter on each run. Read `total` 5x without changing items → counter should be 1. Mutate items → counter bumps. Read 5 more times → counter still 2.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Use computeds for filters and sorts",
          body: "`get activeItems() { return items.filter(i => i.active); }` is O(n) per invalidation — but free on cached reads. For expensive derivations, computed gives you an invalidation-based cache for free.",
          badges: ["Use Cases"],
        },
        {
          tag: "key-point",
          title: "Quiz: computed vs autorun",
          body: "When would you use `computed` vs `autorun`? **`computed` for pure derivations you want to read elsewhere. `autorun` for side effects (logging, syncing to localStorage, calling an API).** Computed returns values, autorun returns nothing.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Computed with memoization + invalidation\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial;\n  const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { v = nv; subs.forEach((s) => s()); },\n    mutate(fn: (t: T) => void): void { fn(v); subs.forEach((s) => s()); },\n  };\n}\n\nfunction computed<T>(fn: () => T): { get(): T; runs: number } {\n  let cached: T;\n  let dirty = true;\n  let runs = 0;\n  const invalidate = () => { dirty = true; };\n  return {\n    get(): T {\n      if (dirty) {\n        tracker = new Set();\n        cached = fn();\n        const finalize = tracker; tracker = null;\n        finalize.forEach((r) => r(invalidate));\n        dirty = false;\n        runs++;\n      }\n      return cached;\n    },\n    get runs() { return runs; },\n  };\n}\n\nconst items = obs<Array<{ price: number }>>([{ price: 10 }, { price: 20 }]);\nconst total = computed(() => {\n  return items.get().reduce((s, i) => s + i.price, 0);\n});\n\nconsole.log("total (read 1): " + total.get() + "   runs=" + total.runs);\nconsole.log("total (read 2): " + total.get() + "   runs=" + total.runs);\nconsole.log("total (read 3): " + total.get() + "   runs=" + total.runs);\n\nitems.mutate((arr) => arr.push({ price: 30 }));\nconsole.log("\\nafter mutation:");\nconsole.log("total (read 4): " + total.get() + "   runs=" + total.runs);\nconsole.log("total (read 5): " + total.get() + "   runs=" + total.runs);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("computed") &&
          logs.some((l) => l.includes("total (read 1): 30   runs=1")) &&
          logs.some((l) => l.includes("total (read 3): 30   runs=1")) &&
          logs.some((l) => l.includes("total (read 4): 60   runs=2")),
        message: "Computed memoization working — 5 reads, 2 recomputations. Exactly as often as inputs changed.",
      }),
    },

    // ── Lesson 4 ─────────────────────────────────────────────────────────
    {
      title: "MobX 4: action — Atomic State Mutations",
      content: [
        "`action` wraps a function so all mutations inside are batched — reactions fire **once** at the end, not after each individual change. In MobX 6 strict mode (default with `makeAutoObservable`), mutations outside an action throw.",
        "Build a transfer operation that moves money between two accounts — without `action`, observers see a broken intermediate state; with `action`, they see the result.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What action does",
          body: "`action(fn)` creates a wrapped function that (1) enters a **transaction** — reactions are queued, not fired immediately, (2) runs `fn`, (3) commits — fires all queued reactions exactly once. Without action, each mutation fires its reactions synchronously — 3 mutations = 3 re-renders.",
          badges: ["Transaction"],
          code: "import { action } from 'mobx';\n\nclass Account {\n  balance = 0;\n  constructor() { makeAutoObservable(this); }\n\n  transfer(to: Account, amount: number) {\n    this.balance -= amount;\n    to.balance += amount;\n    // If this method is marked @action (or via makeAutoObservable), both\n    // mutations are committed atomically. Otherwise observers see the\n    // intermediate state where money has left but not arrived.\n  }\n}",
        },
        {
          tag: "concept",
          title: "runInAction for ad-hoc batches",
          body: "Don't want to wrap a whole method? `runInAction(() => { ... })` creates a one-off action block. Use it for isolated mutations and especially inside async handlers (see Lesson 8).",
          badges: ["runInAction"],
        },
        {
          tag: "concept",
          title: "Strict mode",
          body: "`configure({ enforceActions: 'always' })` makes MobX throw on any mutation outside an action. This is the default with `makeAutoObservable`. Helps you catch 'action forgot' bugs before they cause subtle issues.",
          badges: ["Strict"],
        },
        {
          tag: "exercise",
          title: "Build a two-account transfer",
          body: "Two observable accounts. Register an observer that logs 'total' (a + b). Do a transfer **without** action — log should fire twice with a wrong intermediate total. Wrap it in `transaction(...)` — log fires once with the correct total.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Annotate as you go",
          body: "With `makeAutoObservable`, all methods are actions automatically. If you have a method that should NOT be an action (e.g. a pure helper), annotate it as `false`: `makeAutoObservable(this, { helperMethod: false })`.",
          badges: ["Opt-out"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why action matters",
          body: "Name two reasons actions exist. **(1) Atomicity — observers never see inconsistent intermediate state.** **(2) Batching — N mutations trigger 1 reaction instead of N.** Plus: in strict mode, they enforce a single place where state mutates, easing debugging.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// action / transaction batching\nlet tracker: Set<() => void> | null = null;\nlet inTransaction = false;\nconst pending = new Set<() => void>();\n\nfunction obs<T>(initial: T) {\n  let v = initial;\n  const subs = new Set<() => void>();\n  const notify = () => {\n    for (const s of subs) inTransaction ? pending.add(s) : s();\n  };\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; notify(); },\n  };\n}\n\nfunction transaction(fn: () => void): void {\n  inTransaction = true;\n  try { fn(); }\n  finally {\n    inTransaction = false;\n    const toFire = [...pending]; pending.clear();\n    toFire.forEach((f) => f());\n  }\n}\n\nfunction autorun(fn: () => void): void {\n  tracker = new Set();\n  fn();\n  const finalize = tracker; tracker = null;\n  finalize.forEach((r) => r());\n}\n\nconst accA = obs(100);\nconst accB = obs(100);\nlet logs = 0;\n\nautorun(() => {\n  logs++;\n  console.log("observer: total=" + (accA.get() + accB.get()));\n});\n\nconsole.log("\\n--- naive transfer (no transaction) ---");\naccA.set(accA.get() - 30);  // fires observer\naccB.set(accB.get() + 30);  // fires observer\nconsole.log("fires so far: " + logs);\n\nconsole.log("\\n--- transfer via transaction ---");\nlogs = 0;\ntransaction(() => {\n  accA.set(accA.get() - 50);\n  accB.set(accB.get() + 50);\n});\nconsole.log("fires inside transaction: " + logs);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("transaction") &&
          logs.some((l) => l.includes("fires so far: 2")) &&
          logs.some((l) => l.includes("fires inside transaction: 1")),
        message: "Transactional batching proven — 2 mutations, 1 observer fire. Exactly MobX action semantics.",
      }),
    },

    // ── Lesson 5 ─────────────────────────────────────────────────────────
    {
      title: "MobX 5: autorun — Your First Reaction",
      content: [
        "`autorun(fn)` runs `fn` immediately and re-runs it whenever any observable it accessed changes. It's the simplest way to wire side effects to state.",
        "Build a set of autoruns that sync different facets of state to the 'console' — and see them fire independently based on what each autorun actually reads.",
      ],
      sections: [
        {
          tag: "concept",
          title: "How autorun tracks",
          body: "On first run, MobX records every observable `autorun(fn)` touched. Next time any of those change, MobX re-runs `fn`. If `fn`'s reads change over time (conditional branching), MobX updates the tracked set — stale dependencies are dropped.",
          badges: ["Tracking"],
          code: "autorun(() => {\n  if (user.loggedIn) document.title = user.name;\n  else              document.title = 'Guest';\n});\n// Initially tracks `user.loggedIn` and one of the branches.\n// If `user.loggedIn` flips, the OTHER branch's reads get tracked instead.",
        },
        {
          tag: "concept",
          title: "Dispose is crucial",
          body: "`autorun` returns a disposer: `const stop = autorun(fn); ... stop();`. Forgetting to dispose leaks memory — the autorun keeps observing forever. In React, tie autorun disposal to component unmount via `useEffect`'s cleanup.",
          badges: ["Disposal"],
        },
        {
          tag: "concept",
          title: "autorun vs reaction",
          body: "`autorun(fn)` — re-runs `fn` when anything it reads changes. `reaction(dataFn, effectFn)` — `dataFn` is tracked; when it returns a new value, `effectFn` runs with (new, prev). Use `reaction` when you want to split 'what to watch' from 'what to do'.",
          badges: ["Vs"],
        },
        {
          tag: "exercise",
          title: "Build three targeted autoruns",
          body: "Store with `{ user, cart, theme }`. Three autoruns: one logs user changes, one logs cart changes, one logs theme. Mutate each observable in turn — verify only the matching autorun fires.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "autorun, not effect",
          body: "In React with `observer`, you often don't need autorun at all — the `observer` HOC re-renders when observables change. `autorun` is for side effects **outside** the render cycle: logging, localStorage sync, URL sync, analytics.",
          badges: ["React"],
        },
        {
          tag: "key-point",
          title: "Quiz: autorun + conditional reads",
          body: "`autorun(() => { if (flag) console.log(user.name); })` — does changing `user.name` always re-trigger? **Only when `flag` is currently true.** If `flag` is false, `user.name` wasn't accessed, so it's not in the tracked set.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Autorun with per-observable tracking\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial;\n  const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\n\nfunction autorun(fn: () => void): () => void {\n  let disposed = false;\n  const run = () => {\n    if (disposed) return;\n    tracker = new Set();\n    fn();\n    const finalize = tracker; tracker = null;\n    finalize.forEach((r) => r());\n  };\n  run();\n  return () => { disposed = true; };\n}\n\nconst user  = obs<string>("alice");\nconst cart  = obs<number>(0);\nconst theme = obs<"light" | "dark">("light");\n\nlet userFires = 0, cartFires = 0, themeFires = 0;\nautorun(() => { userFires++;  console.log("user:  " + user.get()); });\nautorun(() => { cartFires++;  console.log("cart:  " + cart.get() + " items"); });\nautorun(() => { themeFires++; console.log("theme: " + theme.get()); });\n\nconsole.log("\\n--- change user ---");\nuser.set("bob");\nconsole.log("--- change cart ---");\ncart.set(3);\nconsole.log("--- change theme ---");\ntheme.set("dark");\n\nconsole.log("\\nfires: user=" + userFires + " cart=" + cartFires + " theme=" + themeFires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("autorun") &&
          logs.some((l) => l.includes("user:  alice")) &&
          logs.some((l) => l.includes("user:  bob")) &&
          logs.some((l) => l.includes("fires: user=2 cart=2 theme=2")),
        message: "Three autoruns, three tracked scopes — each fires only when its own deps changed.",
      }),
    },

    // ── Lesson 6 ─────────────────────────────────────────────────────────
    {
      title: "MobX 6: Tying It Together — A Live Counter",
      content: [
        "The four primitives (observable, computed, action, autorun) compose to give you a tiny, consistent reactive layer. This lesson builds a complete counter store that uses all four.",
        "Build a counter with `count`, `doubled` (computed), `increment`/`reset` (actions), and an autorun that logs every change — the MobX quintessential example.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The canonical pattern",
          body: "Observable holds state. Computed derives a value. Action mutates state atomically. Autorun reacts to changes. Every MobX app is many copies of this pattern composed together — `RootStore { user, cart, ui }` where each has its own state/computed/action layer.",
          badges: ["Pattern"],
          code: "class Counter {\n  count = 0;\n  constructor() { makeAutoObservable(this); }\n  get doubled() { return this.count * 2; }\n  increment() { this.count++; }\n  reset() { this.count = 0; }\n}",
        },
        {
          tag: "concept",
          title: "Observer composition",
          body: "A `computed` inside another `computed` inherits tracking — changing the innermost observable invalidates the outermost cache correctly. MobX propagates invalidation only where needed — a clean dependency graph, no manual wiring.",
          badges: ["Composition"],
        },
        {
          tag: "exercise",
          title: "Build a full Counter store",
          body: "Create a Counter with `count` (observable), `doubled` (computed), `increment`/`decrement`/`reset` (actions each wrapped in `transaction` for batching). Wire an autorun that logs both values. Call 4 actions and verify the autorun fires 4 times with consistent snapshots.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Name your actions",
          body: "In devtools, actions appear by name. `@action increment() {}` shows as `increment`. Anonymous `action(() => {})` shows as `<unnamed action>`. Named actions make traces readable — always prefer named.",
          badges: ["Devtools"],
        },
        {
          tag: "key-point",
          title: "Quiz: The four primitives",
          body: "Name MobX's four primitives. **observable** (state), **computed** (pure derivation), **action** (atomic mutation), **reaction/autorun** (side effect). Every other MobX API builds on these four.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Full MobX-style Counter store\nlet tracker: Set<() => void> | null = null;\nlet inTx = false;\nconst pending = new Set<() => void>();\n\nfunction obs<T>(initial: T) {\n  let v = initial;\n  const subs = new Set<() => void>();\n  const notify = () => subs.forEach((s) => inTx ? pending.add(s) : s());\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; notify(); },\n  };\n}\nfunction computed<T>(fn: () => T): { get(): T } {\n  let cache: T, dirty = true;\n  const invalidate = () => { dirty = true; };\n  return {\n    get(): T {\n      if (dirty) {\n        tracker = new Set();\n        cache = fn();\n        const finalize = tracker; tracker = null;\n        finalize.forEach((r) => r(invalidate));\n        dirty = false;\n      }\n      return cache;\n    },\n  };\n}\nfunction action(fn: () => void): () => void {\n  return () => { inTx = true; try { fn(); } finally { inTx = false; const t = [...pending]; pending.clear(); t.forEach((f) => f()); } };\n}\nfunction autorun(fn: () => void): void {\n  tracker = new Set(); fn();\n  const finalize = tracker; tracker = null;\n  finalize.forEach((r) => r());\n}\n\nclass Counter {\n  count = obs(0);\n  doubled = computed(() => this.count.get() * 2);\n\n  increment = action(() => this.count.set(this.count.get() + 1));\n  decrement = action(() => this.count.set(this.count.get() - 1));\n  reset     = action(() => this.count.set(0));\n}\n\nconst c = new Counter();\nlet fires = 0;\nautorun(() => { fires++; console.log("count=" + c.count.get() + " doubled=" + c.doubled.get()); });\n\nc.increment();\nc.increment();\nc.increment();\nc.decrement();\nc.reset();\n\nconsole.log("\\ntotal autorun fires: " + fires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("Counter") &&
          code.includes("computed") &&
          code.includes("action") &&
          logs.some((l) => l.includes("count=0 doubled=0")) &&
          logs.some((l) => l.includes("count=3 doubled=6")) &&
          logs.some((l) => l.includes("total autorun fires: 6")),
        message: "All four primitives composed — the essential MobX pattern, in under 80 lines.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 2 — Derivations & Actions (Lessons 7-12)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 7 ─────────────────────────────────────────────────────────
    {
      title: "MobX 7: reaction vs autorun vs when",
      content: [
        "Three reaction flavors: `autorun` (fires on any tracked change), `reaction(data, effect)` (fires only when `data` returns a new value), `when(pred, effect)` (fires exactly once when `pred` becomes true).",
        "Build one of each and see how they differ in when/how often they fire.",
      ],
      sections: [
        {
          tag: "concept",
          title: "reaction(data, effect)",
          body: "`reaction(() => store.count, (count, prev) => console.log(count, prev))`. The **data** function is tracked. When it returns a new value (by `===` equality or a custom `equals`), the **effect** runs with the new value. If the data function returns the same value, nothing fires — even if other observables changed.",
          badges: ["reaction"],
          code: "reaction(\n  () => user.email,                // tracked source\n  (email, prev) => analytics.identify(email)   // effect\n);",
        },
        {
          tag: "concept",
          title: "when(pred, effect)",
          body: "`when(() => cart.items.length > 0, () => openCheckoutPrompt())` — fires exactly **once** when the predicate first becomes true, then auto-disposes. Perfect for 'once-ready' triggers: wait for auth, wait for a socket, wait for a modal to open.",
          badges: ["when"],
        },
        {
          tag: "concept",
          title: "Equality options",
          body: "`reaction(data, effect, { equals })` lets you customize equality — default is `===`. Use `comparer.structural` for deep-equal semantics (avoids firing when a new array has the same contents). `comparer.shallow` compares one level deep.",
          badges: ["Equality"],
        },
        {
          tag: "exercise",
          title: "Compare three variants",
          body: "Observable `count`. Set up an autorun, a reaction on `count > 5`, and a when for `count >= 10`. Increment count 12 times. Log each fire. Count how many times each fires.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer reaction for API calls",
          body: "An autorun that fetches data will fire on every tracked observable change — even ones unrelated. `reaction(() => user.id, id => fetch(id))` narrows the trigger to exactly the data you care about.",
          badges: ["API"],
        },
        {
          tag: "key-point",
          title: "Quiz: when() disposal",
          body: "Does `when(pred, effect)` ever need manual disposal? **No — it auto-disposes after firing once.** For a promise-like 'wait for this condition' primitive, use `when(pred)` (no effect) which returns a Promise.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// autorun vs reaction vs when\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction autorun(fn: () => void) {\n  const run = () => { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); };\n  run();\n}\nfunction reaction<T>(data: () => T, effect: (n: T, p: T | undefined) => void) {\n  let prev: T | undefined = undefined;\n  const run = () => {\n    tracker = new Set();\n    const current = data();\n    const t = tracker; tracker = null; t.forEach((r) => r(() => {\n      const newV = data();\n      if (!Object.is(newV, prev)) { effect(newV, prev); prev = newV; }\n    }));\n    if (prev === undefined) prev = current;   // seed without firing\n  };\n  run();\n}\nfunction when(pred: () => boolean, effect: () => void) {\n  let disposed = false;\n  const run = () => {\n    if (disposed) return;\n    tracker = new Set();\n    const ok = pred();\n    const t = tracker; tracker = null; t.forEach((r) => r(run));\n    if (ok) { disposed = true; effect(); }\n  };\n  run();\n}\n\nconst count = obs(0);\nlet autorunFires = 0, reactionFires = 0, whenFires = 0;\n\nautorun(() => { autorunFires++; count.get(); });\nreaction(() => count.get() > 5, (above) => { if (above) reactionFires++; });\nwhen(() => count.get() >= 10, () => whenFires++);\n\nfor (let i = 0; i < 12; i++) count.set(i + 1);\n\nconsole.log("autorun fires:  " + autorunFires);\nconsole.log("reaction fires: " + reactionFires);\nconsole.log("when fires:     " + whenFires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("reaction") &&
          code.includes("when") &&
          logs.some((l) => l.includes("autorun fires:")) &&
          logs.some((l) => l.includes("reaction fires:")) &&
          logs.some((l) => l.includes("when fires:     1")),
        message: "Three reaction types demonstrated — `when` fires exactly once, as designed.",
      }),
    },

    // ── Lesson 8 ─────────────────────────────────────────────────────────
    {
      title: "MobX 8: runInAction for Async State",
      content: [
        "After `await`, you're outside the original action — any mutation would violate strict mode. `runInAction(() => ...)` wraps the post-await mutation in a fresh action, keeping atomicity.",
        "Build a 'fetch user' flow that sets loading → awaits → sets data or error, all properly wrapped.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Why async breaks actions",
          body: "An `async` function's body resumes on the microtask queue after each `await`. The resumed continuation runs *outside* the original action context. Any mutation there triggers 'strict-mode violation'. Wrap the post-await mutations in `runInAction(() => ...)`.",
          badges: ["Async"],
          code: "async loadUser(id) {\n  this.loading = true;   // inside action context\n  const user = await api.fetchUser(id);\n  runInAction(() => {    // BACK in action context\n    this.user = user;\n    this.loading = false;\n  });\n}",
        },
        {
          tag: "concept",
          title: "flow: generator-based actions",
          body: "`flow` is an older MobX helper that turns a generator into an action where each `yield` is auto-wrapped. Replaces `async/await + runInAction`. Newer code usually sticks with async/await + runInAction; flow is still supported.",
          badges: ["flow"],
          code: "loadUser = flow(function*(this: Store, id: string) {\n  this.loading = true;\n  this.user = yield api.fetchUser(id);   // mutation after yield is auto-in-action\n  this.loading = false;\n});",
        },
        {
          tag: "concept",
          title: "Error handling",
          body: "Always set an error state **and** reset loading on failure. A forgotten `finally { loading = false }` makes the UI stuck on a spinner forever. Prefer a state machine: `{ kind: 'idle' | 'loading' | 'success' | 'error' }` over separate booleans.",
          badges: ["Errors"],
        },
        {
          tag: "exercise",
          title: "Build a loadUser flow",
          body: "Store with `loading`, `user`, `error`. Async `loadUser(id)` sets loading, fetches (random success/fail), and either sets user or error — with `runInAction` around every post-await mutation. Observer logs state transitions.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Model with states, not booleans",
          body: "`loading: boolean` + `user: User | null` + `error: Error | null` has 2^3 = 8 combinations, many nonsensical (e.g. `loading && user && error`). Use a discriminated union: `{ kind: 'idle' } | { kind: 'loading' } | { kind: 'success', user } | { kind: 'error', error }` — 4 states, all valid.",
          badges: ["State Machine"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why not let await auto-wrap",
          body: "Could MobX auto-wrap post-await continuations as actions? **In principle yes — it chose not to, for clarity.** Explicit `runInAction` marks exactly where mutations happen, which is valuable for debugging and grepping.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Async action with runInAction\nlet inTx = false;\nconst pending = new Set<() => void>();\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  const notify = () => subs.forEach((s) => inTx ? pending.add(s) : s());\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; notify(); },\n  };\n}\nfunction runInAction(fn: () => void): void {\n  inTx = true; try { fn(); } finally { inTx = false; const t = [...pending]; pending.clear(); t.forEach((f) => f()); }\n}\nfunction autorun(fn: () => void) { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); }\n\ntype State = { kind: "idle" } | { kind: "loading" } | { kind: "success"; user: string } | { kind: "error"; err: string };\n\nclass UserStore {\n  state = obs<State>({ kind: "idle" });\n\n  async loadUser(id: number): Promise<void> {\n    runInAction(() => this.state.set({ kind: "loading" }));\n    try {\n      await new Promise((r) => setTimeout(r, 10));\n      if (id < 0) throw new Error("invalid id");\n      const name = "User-" + id;\n      runInAction(() => this.state.set({ kind: "success", user: name }));\n    } catch (e) {\n      runInAction(() => this.state.set({ kind: "error", err: (e as Error).message }));\n    }\n  }\n}\n\nconst store = new UserStore();\nautorun(() => console.log("state: " + JSON.stringify(store.state.get())));\n\n(async () => {\n  await store.loadUser(42);\n  await store.loadUser(-1);\n})();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("runInAction") &&
          code.includes("loadUser") &&
          logs.some((l) => l.includes('"kind":"loading"')) &&
          logs.some((l) => l.includes('"kind":"success"')) &&
          logs.some((l) => l.includes('"kind":"error"')),
        message: "Async mutations properly wrapped — state transitions from loading to success/error, observer saw every one.",
      }),
    },

    // ── Lesson 9 ─────────────────────────────────────────────────────────
    {
      title: "MobX 9: observable.box — Primitive Observables",
      content: [
        "`observable.box(value)` wraps a single primitive in a reactive box with `.get()` and `.set()`. Use when you need a standalone observable outside a store — signals, toggles, counters.",
        "Build a theme toggle using `observable.box<'light' | 'dark'>` and see how box ops differ from object-property observables.",
      ],
      sections: [
        {
          tag: "concept",
          title: "When box is right",
          body: "You want to share a single value across unrelated components without a store. Classic use: `const isOnline = observable.box(navigator.onLine)` — any component `observer` that reads `isOnline.get()` re-renders on change.",
          badges: ["box"],
          code: "import { observable } from 'mobx';\nconst theme = observable.box<'light' | 'dark'>('light');\ntheme.get();         // read\ntheme.set('dark');   // write",
        },
        {
          tag: "concept",
          title: "Objects vs boxes",
          body: "`observable({ theme: 'light' })` — you access `obj.theme` naturally. `observable.box('light')` — you access `box.get()` / `box.set(v)`. For a single primitive, box is a touch more explicit; for grouped state, objects/classes read better.",
          badges: ["Ergonomics"],
        },
        {
          tag: "exercise",
          title: "Build a shared theme box",
          body: "`theme = observable.box<'light'|'dark'>('light')`. Two 'components' (`autorun` functions) read it and log. Toggle 3x; verify both components re-render each time.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Don't overuse boxes",
          body: "If you find yourself wrapping every piece of state in a box, you probably want an observable class instead. Boxes are great for isolated signals (theme, connectivity, current tab) — not for domain data.",
          badges: ["Guideline"],
        },
        {
          tag: "key-point",
          title: "Quiz: box equality",
          body: "`box.set(same)` where `same` equals the current value — does it notify observers? **Depends** — by default MobX uses strict equality. Structurally-equal values (two arrays with same contents) would fire unless you pass `{ equals: comparer.structural }`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// observable.box-style theme toggle\nlet tracker: Set<() => void> | null = null;\n\nfunction box<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction autorun(fn: () => void) { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); }\n\nconst theme = box<"light" | "dark">("light");\n\n// Two 'components' share the theme box\nlet comp1Renders = 0, comp2Renders = 0;\nautorun(() => { comp1Renders++; console.log("Header:  theme=" + theme.get()); });\nautorun(() => { comp2Renders++; console.log("Sidebar: theme=" + theme.get()); });\n\ntheme.set("dark");\ntheme.set("dark");   // same — no fire\ntheme.set("light");\n\nconsole.log("\\nrenders: header=" + comp1Renders + " sidebar=" + comp2Renders);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("box") &&
          logs.some((l) => l.includes("theme=light")) &&
          logs.some((l) => l.includes("theme=dark")) &&
          logs.some((l) => l.includes("renders: header=3 sidebar=3")),
        message: "Box observables work — both components re-rendered on change, neither on same-value set.",
      }),
    },

    // ── Lesson 10 ────────────────────────────────────────────────────────
    {
      title: "MobX 10: Deep vs Shallow vs Ref",
      content: [
        "MobX defaults to **deep** observability — nested objects/arrays get wrapped recursively. For performance-critical data or immutable trees, switch to **shallow** (top-level only) or **ref** (track reference only).",
        "Build the three variants side-by-side and measure the difference on a nested todo list mutation.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The three modes",
          body: "**`observable.deep`** (default): `todos[0].done = true` is tracked. **`observable.shallow`**: only `todos.push/splice` is tracked; mutating `todos[0].done` is invisible. **`observable.ref`**: only `todos = newArray` is tracked; any mutation inside is invisible.",
          badges: ["Modes"],
          code: "class Store {\n  constructor() {\n    makeObservable(this, {\n      todos:         observable,          // deep\n      tags:          observable.shallow,  // top-level only\n      immutableData: observable.ref,      // ref-equality only\n    });\n  }\n  todos: Todo[] = [];\n  tags: string[] = [];\n  immutableData: ImmutableTree = defaultTree;\n}",
        },
        {
          tag: "concept",
          title: "When shallow wins",
          body: "Large arrays of items that are replaced wholesale (e.g. react-query results) don't benefit from per-item tracking — it only adds proxy overhead. Use `observable.shallow` for 'replace' patterns and keep the items plain.",
          badges: ["Shallow"],
        },
        {
          tag: "concept",
          title: "When ref wins",
          body: "You're managing an immutable tree (Immer output, Redux-style state, React state). You only ever swap the whole reference. `observable.ref` avoids trying to proxy the immutable structure and makes intent explicit.",
          badges: ["Ref"],
        },
        {
          tag: "exercise",
          title: "Measure tracking depth",
          body: "Three stores, each with a nested todo list: deep, shallow, ref. For each, set up an autorun that reads `todos[0].done`. Mutate `todos[0].done = !todos[0].done`. Count which autoruns fired. Deep: yes; shallow/ref: no.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Shallow + immutable items = best of both",
          body: "Store an array of immutable item objects as `observable.shallow`. Replace an item by `items[i] = { ...items[i], done: true }` — the assignment fires reactions; the object itself isn't tracked (no proxy overhead). Clean pattern for large lists.",
          badges: ["Pattern"],
        },
        {
          tag: "key-point",
          title: "Quiz: Ref vs Shallow",
          body: "Difference in one sentence? **Ref tracks only assignment of the whole reference; Shallow also tracks top-level collection ops like push/pop.** Shallow is slightly more reactive than ref.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Deep vs shallow vs ref — tracking depth simulator\nlet tracker: Set<() => void> | null = null;\n\nfunction deep<T extends object>(initial: T): T {\n  const subs = new Set<() => void>();\n  const handler: ProxyHandler<object> = {\n    get(target, key, receiver) {\n      if (tracker) tracker.add(() => subs.forEach((s) => s()));\n      const v = Reflect.get(target, key, receiver);\n      return typeof v === "object" && v !== null ? new Proxy(v, handler) : v;\n    },\n    set(target, key, value, receiver) {\n      const ok = Reflect.set(target, key, value, receiver);\n      subs.forEach((s) => s());\n      return ok;\n    },\n  };\n  return new Proxy(initial, handler) as T;\n}\n\nfunction ref<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (nv === v) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\n\nfunction autorun(fn: () => void) { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); }\n\ninterface Todo { id: number; done: boolean }\n\nconst deepStore = { todos: deep<Todo[]>([{ id: 1, done: false }]) };\nconst refStore  = ref<Todo[]>([{ id: 1, done: false }]);\n\nlet deepFires = 0, refFires = 0;\nautorun(() => { deepFires++; deepStore.todos[0].done; });\nautorun(() => { refFires++;  refStore.get()[0].done; });\n\n// Mutate nested field (not the reference)\ndeepStore.todos[0].done = true;\nrefStore.get()[0].done = true;\n\nconsole.log("deep autorun fired:  " + deepFires + " (expected 2 — initial + mutation)");\nconsole.log("ref  autorun fired:  " + refFires  + " (expected 1 — ref unchanged)");\n\n// Now swap ref\nrefStore.set([{ id: 2, done: false }]);\nconsole.log("after ref swap — ref autorun fired total: " + refFires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("deep") &&
          code.includes("ref") &&
          logs.some((l) => l.includes("deep autorun fired:")) &&
          logs.some((l) => l.includes("ref  autorun fired:")),
        message: "Tracking depth shown — deep sees nested mutations, ref only sees reference swaps.",
      }),
    },

    // ── Lesson 11 ────────────────────────────────────────────────────────
    {
      title: "MobX 11: The Derivation Graph",
      content: [
        "Internally, MobX builds a **directed graph** of observables → computeds → reactions. On change, it marks downstream nodes dirty in dependency order, then runs only the reactions that actually had a (transitive) stale read.",
        "Visualize the graph on a small example and trace invalidation flow from an observable mutation to a reaction.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Nodes and edges",
          body: "Nodes: observables, computeds, reactions. Edges: 'A depends on B' recorded during B's tracked run. On mutation, MobX walks the graph pushing a **dirty** flag downstream — but defers actual recomputation until someone reads.",
          badges: ["Graph"],
        },
        {
          tag: "concept",
          title: "Push + pull model",
          body: "**Push**: mutation → mark dependents dirty (cheap, O(edges)). **Pull**: reaction/view reads computed → if dirty, recompute. This hybrid avoids the common over-computation of pure push models and the stale-read risk of pure pull.",
          badges: ["Hybrid"],
        },
        {
          tag: "concept",
          title: "Diamond dependency",
          body: "If `reaction → c1 → obs` and `reaction → c2 → obs`, does changing `obs` fire the reaction twice? **No — MobX schedules reactions exactly once per transaction**, even if multiple paths in the graph invalidated them. Diamond safe.",
          badges: ["Diamond"],
        },
        {
          tag: "exercise",
          title: "Build a graph visualizer",
          body: "For `price`, `qty`, `tax`, where `subtotal = price*qty` and `total = subtotal*(1+tax)`, print the graph as text: `price → subtotal, qty → subtotal, subtotal → total, tax → total`. Mutate `price` — log which nodes got dirty.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Use trace() for debugging",
          body: "`import { trace } from 'mobx'; autorun(() => { trace(store, 'email'); ... })` prints why this reaction ran — which observable changed. Invaluable when a reaction fires more often than you expect.",
          badges: ["Debug"],
        },
        {
          tag: "key-point",
          title: "Quiz: When does a computed recompute?",
          body: "A dirty computed — when does it actually run its fn again? **When someone reads it AND (a) it's marked dirty, and (b) its cached value would differ.** MobX's optimization: if pulling upstream dirty computeds yields the same inputs, the computed stays cached.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Derivation graph trace\ninterface Node { name: string; deps: string[]; dirty: boolean }\nconst graph: Record<string, Node> = {\n  price:    { name: "price",    deps: [],                   dirty: false },\n  qty:      { name: "qty",      deps: [],                   dirty: false },\n  tax:      { name: "tax",      deps: [],                   dirty: false },\n  subtotal: { name: "subtotal", deps: ["price", "qty"],     dirty: false },\n  total:    { name: "total",    deps: ["subtotal", "tax"],  dirty: false },\n  reaction: { name: "reaction", deps: ["total"],            dirty: false },\n};\n\n// Invalidation walk\nfunction mutate(name: string): string[] {\n  const dirty: string[] = [];\n  const visit = (n: string) => {\n    if (!graph[n] || graph[n].dirty) return;\n    graph[n].dirty = true;\n    if (n !== name) dirty.push(n);\n    for (const dep of Object.values(graph)) if (dep.deps.includes(n)) visit(dep.name);\n  };\n  visit(name);\n  return dirty;\n}\n\nconsole.log("=== Dependency Graph ===");\nfor (const n of Object.values(graph)) {\n  console.log(n.name.padEnd(10) + " depends on: [" + n.deps.join(", ") + "]");\n}\n\nconsole.log("\\n=== Mutate 'price' — invalidation cascade ===");\nconst cascade = mutate("price");\nconsole.log("marked dirty: " + cascade.join(" -> "));\n\n// Reset and mutate tax (shouldn't invalidate subtotal)\nfor (const n of Object.values(graph)) n.dirty = false;\nconsole.log("\\n=== Mutate 'tax' — narrower cascade ===");\nconsole.log("marked dirty: " + mutate("tax").join(" -> "));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("mutate") &&
          logs.some((l) => l.includes("Dependency Graph")) &&
          logs.some((l) => l.includes("subtotal -> total -> reaction")) &&
          logs.some((l) => l.includes("total -> reaction")),
        message: "Invalidation cascade traced — mutate price touches subtotal, total, reaction; mutate tax skips subtotal.",
      }),
    },

    // ── Lesson 12 ────────────────────────────────────────────────────────
    {
      title: "MobX 12: Transactions, Batching & enforceActions",
      content: [
        "All mutations inside an action are batched — observers fire once at action end. `configure({ enforceActions: 'always' })` requires every mutation to be in an action, catching hidden bugs.",
        "Build a form submit that mutates 4 fields and verify observers fire once, not four times.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Implicit transactions",
          body: "Every action is a transaction: reactions queued during the action fire at the end. Nested actions don't double-fire — the outermost action is the transaction boundary. This is the same guarantee React's `batch` gives for setState.",
          badges: ["Transaction"],
        },
        {
          tag: "concept",
          title: "enforceActions modes",
          body: "`'never'` (legacy): no enforcement. `'observed'` (old default): must be in action only if the observable has observers. `'always'` (current default with makeAutoObservable): every mutation everywhere must be in an action. Strictest = safest.",
          badges: ["Strict"],
        },
        {
          tag: "concept",
          title: "Explicit transaction()",
          body: "Rarely used directly — `action` wraps the same mechanism. But for one-off batching without an action method, `runInAction(() => { ... })` or the deprecated `transaction(fn)` works.",
          badges: ["transaction"],
        },
        {
          tag: "exercise",
          title: "Measure observer fires",
          body: "Form store with `{ name, email, age, role }`. Autorun logs the full form. Compare: 4 individual mutations (outside action) vs 4 mutations inside one `transaction` — log fires. Expect 4 vs 1.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Don't over-batch",
          body: "`transaction` exists to batch logically related mutations. Don't wrap unrelated mutations — you'll defer observer fires in surprising ways. Actions should map to user intentions (submit, click, apply).",
          badges: ["Granularity"],
        },
        {
          tag: "key-point",
          title: "Quiz: Nested actions",
          body: "Does MobX fire observers at the end of each nested action or only the outermost? **Only the outermost — nested actions merge into the outer transaction.** This keeps composition clean: a compound action calling other actions still commits once.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Batched vs non-batched mutations\nlet tracker: Set<() => void> | null = null;\nlet inTx = false;\nconst pending = new Set<() => void>();\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  const notify = () => subs.forEach((s) => inTx ? pending.add(s) : s());\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; notify(); },\n  };\n}\nfunction transaction(fn: () => void) {\n  inTx = true; try { fn(); } finally { inTx = false; const t = [...pending]; pending.clear(); t.forEach((f) => f()); }\n}\nfunction autorun(fn: () => void) { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); }\n\nconst name = obs("");\nconst email = obs("");\nconst age = obs(0);\nconst role = obs("guest");\n\nlet fires = 0;\nautorun(() => { fires++; console.log("form: " + JSON.stringify({ name: name.get(), email: email.get(), age: age.get(), role: role.get() })); });\n\nconsole.log("\\n--- 4 mutations, no transaction ---");\nfires = 0;\nname.set("alice"); email.set("a@x"); age.set(30); role.set("admin");\nconsole.log("fires: " + fires);\n\nconsole.log("\\n--- 4 mutations, batched ---");\nfires = 0;\nname.set(""); email.set(""); age.set(0); role.set("guest");\nfires = 0;\ntransaction(() => { name.set("bob"); email.set("b@x"); age.set(25); role.set("user"); });\nconsole.log("fires: " + fires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("transaction") &&
          logs.some((l) => /no transaction[^]*fires: 4/m.test(logs.join("\\n"))) ||
          (logs.some((l) => l.includes("fires: 4")) &&
           logs.some((l) => l.includes("fires: 1"))),
        message: "Batching works — 4 mutations, 1 observer fire inside transaction.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 3 — React Integration (Lessons 13-18)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 13 ────────────────────────────────────────────────────────
    {
      title: "MobX 13: observer — The React Bridge",
      content: [
        "`observer(Component)` wraps a React component so its render is a tracked reaction. When any observable the render reads changes, MobX triggers a re-render. No selectors, no `useMemo`, no dependency arrays.",
        "Simulate observer's behavior: a render function whose output depends on tracked observables re-runs exactly when those observables change.",
      ],
      sections: [
        {
          tag: "concept",
          title: "observer in one line",
          body: "`import { observer } from 'mobx-react-lite'; const Counter = observer(({ store }) => <div>{store.count}</div>);`. The wrapped function component runs inside a MobX reaction each render — every observable read is tracked; changes trigger a re-render via `forceUpdate`.",
          badges: ["observer"],
          code: "import { observer } from 'mobx-react-lite';\nconst CartBadge = observer(({ cart }: { cart: CartStore }) => (\n  <span>{cart.items.length}</span>\n));",
        },
        {
          tag: "concept",
          title: "Granularity: per-component",
          body: "Each `observer` is its own reaction scope. A change to `cart.items` re-renders `<CartBadge>` but **not** `<UserMenu>` (which reads `user.name`). Render isolation is automatic — no `memo` or selector functions required.",
          badges: ["Granular"],
        },
        {
          tag: "concept",
          title: "observer + hooks",
          body: "`observer` composes cleanly with React hooks. `useEffect` can read observables in its body — tracked reads register the effect callback as a reactor. Modern rule: wrap every component that reads observables (or doesn't hurt to wrap everything).",
          badges: ["Hooks"],
        },
        {
          tag: "exercise",
          title: "Simulate observer renders",
          body: "Store with `count` and `label`. Two fake 'components' — one reads `count`, one reads `label`. Each render logs 'Component X rendered'. Mutate `count` 3x — only Component 1 should log.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Wrap deeply, not just at the top",
          body: "Wrapping just your root component in `observer` means every change re-renders the whole tree. Wrap leaf components that read observables — each is its own reaction, each re-renders independently. Finer wrapping = better perf.",
          badges: ["Perf"],
        },
        {
          tag: "key-point",
          title: "Quiz: React.memo vs observer",
          body: "You wrap `observer(memo(Component))` — what changes? **memo short-circuits prop-equal re-renders; observer triggers re-renders from observable changes.** They compose — observer's MobX-driven re-render always wins when deps change, memo skips unrelated parent re-renders.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Simulated observer() HOC\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\n\nfunction observer(name: string, renderFn: () => void): () => void {\n  let renders = 0;\n  const render = () => {\n    renders++;\n    tracker = new Set();\n    renderFn();\n    const finalize = tracker; tracker = null;\n    finalize.forEach((r) => r(render));\n    console.log("  " + name + " rendered (total=" + renders + ")");\n  };\n  render();\n  return () => console.log("  " + name + " disposed");\n}\n\nconst count = obs(0);\nconst label = obs("Start");\n\nconst disposeBadge = observer("CartBadge", () => { count.get(); });\nconst disposeLabel = observer("UserLabel", () => { label.get(); });\n\nconsole.log("\\n--- increment count 3x ---");\ncount.set(1); count.set(2); count.set(3);\n\nconsole.log("\\n--- update label 1x ---");\nlabel.set("Updated");\n\nconsole.log("\\n--- mutate count again ---");\ncount.set(99);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("observer") &&
          logs.some((l) => l.includes("CartBadge rendered (total=1)")) &&
          logs.some((l) => l.includes("CartBadge rendered (total=4)")) &&
          logs.some((l) => l.includes("UserLabel rendered (total=2)")),
        message: "observer() behavior simulated — each component re-renders only for its own observable changes.",
      }),
    },

    // ── Lesson 14 ────────────────────────────────────────────────────────
    {
      title: "MobX 14: mobx-react-lite & useObserver",
      content: [
        "`mobx-react-lite` is the modern, hooks-only MobX + React integration. `observer` wraps function components; `useLocalObservable` gives you component-scoped observable state; `useObserver` is the escape hatch for partial reactive regions.",
        "Walk through each API's use case and build a tiny reactive todo list pattern.",
      ],
      sections: [
        {
          tag: "concept",
          title: "observer vs useObserver",
          body: "**`observer(Component)`** (recommended): the whole component render is reactive. **`useObserver(() => <JSX>)`**: only the rendered segment inside the hook is reactive — the rest of the component is not. Rarely needed now that `observer` exists.",
          badges: ["APIs"],
        },
        {
          tag: "concept",
          title: "useLocalObservable",
          body: "`const state = useLocalObservable(() => ({ count: 0, inc() { this.count++ } }))` — creates an observable scoped to the component. Persists across renders; disposed at unmount. Use for self-contained component state (form inputs, modal visibility) that doesn't belong in a store.",
          badges: ["Local"],
          code: "const Counter = observer(() => {\n  const state = useLocalObservable(() => ({\n    count: 0,\n    increment() { this.count++; },\n  }));\n  return <button onClick={state.increment}>{state.count}</button>;\n});",
        },
        {
          tag: "concept",
          title: "No more mobx-react?",
          body: "The older `mobx-react` package supported class components and legacy decorators. For new code, `mobx-react-lite` is the standard — hook-based, smaller bundle, React 18 compatible. Use the `-lite` version unless you have class components.",
          badges: ["Package"],
        },
        {
          tag: "exercise",
          title: "Mock useLocalObservable",
          body: "Implement a `useLocalObservable<T>(factory)` that creates the observable once (cached across renders), binds methods to it, and returns the instance. Simulate a 'component' calling it multiple times.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer stores over local state",
          body: "`useLocalObservable` is tempting for everything — but state that needs to be shared, persisted, or tested in isolation belongs in a store injected via context. Use local observable for genuinely view-local state only.",
          badges: ["Guideline"],
        },
        {
          tag: "key-point",
          title: "Quiz: What does observer wrap under the hood?",
          body: "`observer(fn)` wraps `fn` in a React `forwardRef`, calls `fn` inside a MobX reaction, and uses `useSyncExternalStore` (React 18) to subscribe to the reaction's dirty signal — triggering a re-render the React-correct way.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// useLocalObservable simulator\nlet tracker: Set<() => void> | null = null;\n\nfunction reactive<T extends object>(obj: T): T {\n  const subs = new Set<() => void>();\n  const h: ProxyHandler<object> = {\n    get(t, k, r) { if (tracker) tracker.add(() => subs.forEach((s) => s())); return Reflect.get(t, k, r); },\n    set(t, k, v, r) { const ok = Reflect.set(t, k, v, r); subs.forEach((s) => s()); return ok; },\n  };\n  return new Proxy(obj, h) as T;\n}\n\n// Hook simulation: state persists across 'renders' via a slot\nconst slots = new Map<string, unknown>();\nfunction useLocalObservable<T extends object>(name: string, factory: () => T): T {\n  if (!slots.has(name)) {\n    const instance = reactive(factory());\n    // bind 'this' for any methods\n    for (const key of Object.keys(instance)) {\n      const val = (instance as unknown as Record<string, unknown>)[key];\n      if (typeof val === "function") (instance as unknown as Record<string, unknown>)[key] = (val as () => void).bind(instance);\n    }\n    slots.set(name, instance);\n  }\n  return slots.get(name) as T;\n}\n\nfunction observer(name: string, fn: () => void): void {\n  let renders = 0;\n  const render = () => {\n    renders++;\n    tracker = new Set();\n    fn();\n    const finalize = tracker; tracker = null;\n    finalize.forEach((r) => r(render));\n    console.log("  " + name + " rendered (total=" + renders + ")");\n  };\n  render();\n}\n\n// "Component" using useLocalObservable\nobserver("TodoCounter", () => {\n  const state = useLocalObservable("todos", () => ({\n    items: [] as string[],\n    add(label: string): void { this.items = [...this.items, label]; },\n    get count(): number { return this.items.length; },\n  }));\n\n  // Read count to track it\n  const n = state.count;\n  console.log("    current count: " + n);\n});\n\n// Later 'render' — state should persist\nconst state = useLocalObservable("todos", () => ({\n  items: [],\n  add(l: string): void { this.items = [...this.items, l]; },\n  get count(): number { return this.items.length; },\n})) as { items: string[]; add(l: string): void; count: number };\n\nstate.add("buy milk");\nstate.add("learn MobX");\nconsole.log("\\nafter 2 adds, items count: " + state.items.length);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("useLocalObservable") &&
          code.includes("observer") &&
          logs.some((l) => l.includes("current count")) &&
          logs.some((l) => l.includes("after 2 adds, items count: 2")),
        message: "useLocalObservable pattern — component-scoped state that survives re-renders and reacts correctly.",
      }),
    },

    // ── Lesson 15 ────────────────────────────────────────────────────────
    {
      title: "MobX 15: The Store Pattern & React Context",
      content: [
        "The idiomatic architecture: a `RootStore` composes domain stores, provided to the React tree via Context. Components grab the store with a `useStore` hook.",
        "Build a RootStore with `user`, `cart`, `ui` sub-stores and a context provider + consumer hook.",
      ],
      sections: [
        {
          tag: "concept",
          title: "RootStore composition",
          body: "One class per domain. RootStore's constructor creates each: `this.user = new UserStore(this)`. Passing `this` lets sub-stores reference siblings (e.g., CartStore reading UserStore). Use `private` references and expose methods — not raw state.",
          badges: ["Composition"],
          code: "class RootStore {\n  user = new UserStore(this);\n  cart = new CartStore(this);\n  ui   = new UiStore(this);\n}\n\nconst rootStore = new RootStore();",
        },
        {
          tag: "concept",
          title: "Context Provider",
          body: "`const StoreContext = React.createContext<RootStore>(null!);` — wrap the app: `<StoreContext.Provider value={rootStore}>`. Custom hook: `const useStore = () => useContext(StoreContext)`. Components call `const { cart } = useStore()`.",
          badges: ["Context"],
          code: "export const StoreContext = React.createContext<RootStore>(null as unknown as RootStore);\nexport const useStore = () => React.useContext(StoreContext);\n\n// App.tsx\n<StoreContext.Provider value={rootStore}>\n  <App />\n</StoreContext.Provider>",
        },
        {
          tag: "concept",
          title: "Why not singletons",
          body: "A module-level `const store = new RootStore()` works — until you try to test or SSR. Context + one fresh store per test/request solves isolation. Singletons leak state across tests and don't handle request-scoped data.",
          badges: ["Isolation"],
        },
        {
          tag: "exercise",
          title: "Build a RootStore + useStore",
          body: "RootStore with `user`, `cart`. `cart.total` uses `user.discount`. Mock a React-less context (a simple module-level reference). Mutate user discount; verify cart total updates.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "One store, many instances",
          body: "For an app shell, `new RootStore()` once and pass via context. For Storybook, each story can make its own store. For tests, the test harness creates a store per test. Treat RootStore as injectable.",
          badges: ["DI"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why pass root to sub-stores?",
          body: "Why does a sub-store receive the root? **To reference siblings.** `CartStore` needs `UserStore` for the current user's discount. Circular refs are fine (MobX handles them). Alternative: dependency inject each dep explicitly — more ceremony.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// RootStore pattern\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction autorun(fn: () => void) { tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r()); }\n\nclass UserStore {\n  discount = obs(0);\n  constructor(public root: RootStore) {}\n}\n\nclass CartStore {\n  items = obs<Array<{ price: number }>>([]);\n  constructor(public root: RootStore) {}\n  total(): number {\n    const sub = this.items.get().reduce((s, i) => s + i.price, 0);\n    return sub * (1 - this.root.user.discount.get() / 100);\n  }\n}\n\nclass RootStore {\n  user: UserStore;\n  cart: CartStore;\n  constructor() {\n    this.user = new UserStore(this);\n    this.cart = new CartStore(this);\n  }\n}\n\nconst rootStore = new RootStore();\nfunction useStore(): RootStore { return rootStore; }\n\n// Simulated component\nautorun(() => {\n  const { cart } = useStore();\n  console.log("cart total: $" + cart.total().toFixed(2));\n});\n\nconst { cart, user } = useStore();\ncart.items.set([{ price: 100 }, { price: 50 }]);\nuser.discount.set(10);\nuser.discount.set(25);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("RootStore") &&
          code.includes("UserStore") &&
          code.includes("CartStore") &&
          logs.some((l) => l.includes("cart total: $0.00")) &&
          logs.some((l) => l.includes("cart total: $135.00")) &&
          logs.some((l) => l.includes("cart total: $112.50")),
        message: "RootStore composed — cart.total reacts to both items and user.discount changes, via the shared root.",
      }),
    },

    // ── Lesson 16 ────────────────────────────────────────────────────────
    {
      title: "MobX 16: Granular Reactivity in React",
      content: [
        "MobX's superpower vs Redux: granular re-renders. If 100 todos render and you mark one done, only that one's `observer` re-runs. Redux + naive selectors re-render the whole list.",
        "Simulate a todo list where each item is its own observer — see render counts stay flat as state changes.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Per-item observer",
          body: "Wrap each todo row in `observer(TodoRow)`. The parent renders the list shell once; each row is its own reaction. Toggling one todo's `done` flag re-renders only that row. Contrast with a parent that reads `todos.map(...)` — parent re-renders on any change, all children re-render too.",
          badges: ["Granular"],
        },
        {
          tag: "concept",
          title: "Parent tracks array, not items",
          body: "A parent `observer` that renders `{todos.map(t => <TodoRow todo={t} />)}` reads **the array structure** — `todos.length`, `todos[i]` (identity only). Mutating a **property inside** a todo is not tracked by the parent — only by the TodoRow observer. This is automatic, not opt-in.",
          badges: ["Scope"],
        },
        {
          tag: "concept",
          title: "Beware of accessors",
          body: "If the parent's render *also* reads `t.done` (e.g. a filter `todos.filter(t => t.done)`), the parent tracks every todo's `done` and re-renders on any toggle. Move filters into a `computed` on the store — parent reads only that computed, not individual properties.",
          badges: ["Gotcha"],
        },
        {
          tag: "exercise",
          title: "Measure per-item renders",
          body: "Store with 5 todos. Each todo is its own observer (render counter). Parent observer renders the list. Toggle todo #3's done flag. Verify: parent renders=1, todo#3 renders=2, others=1.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "useMemo is rarely needed",
          body: "In Redux apps you `useMemo` aggressively to avoid re-computation. In MobX, `computed` handles this — memoized, invalidated correctly. Fewer hooks, less dependency-array noise.",
          badges: ["React"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why fewer React re-renders",
          body: "Why does MobX often outperform Redux on render count? **Each observer is a fine-grained reaction; only components whose observable reads changed re-render.** Redux re-runs all selectors on every dispatch, then React relies on `memo`/shallow-equals to skip — more work, more hazard.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Granular per-item reactivity\nlet tracker: Set<() => void> | null = null;\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction observer(name: string, fn: () => void): { renders: number } {\n  const state = { renders: 0 };\n  const go = () => {\n    state.renders++;\n    tracker = new Set();\n    fn();\n    const t = tracker; tracker = null;\n    t.forEach((r) => r(go));\n  };\n  go();\n  return state;\n}\n\ninterface Todo { id: number; label: string; done: { get(): boolean; set(v: boolean): void } }\nfunction makeTodo(id: number, label: string): Todo { return { id, label, done: obs(false) }; }\n\nconst todos = [1, 2, 3, 4, 5].map((i) => makeTodo(i, "task " + i));\n\n// Parent reads array structure only — not individual done flags\nconst parent = observer("ParentList", () => {\n  todos.length;   // track array size\n});\n\n// Each row reads its own todo.done\nconst rows = todos.map((t) => observer("TodoRow-" + t.id, () => { t.done.get(); }));\n\nconsole.log("\\ninitial — all renders=1");\n\n// Toggle todo #3\ntodos[2].done.set(true);\n\nconsole.log("\\nafter toggle todo#3:");\nconsole.log("parent renders: " + parent.renders);\nrows.forEach((r, i) => console.log("row " + (i + 1) + " renders: " + r.renders));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("observer") &&
          logs.some((l) => l.includes("parent renders: 1")) &&
          logs.some((l) => l.includes("row 3 renders: 2")) &&
          logs.some((l) => l.includes("row 1 renders: 1")),
        message: "Per-item granularity proven — only row 3 re-rendered, parent and siblings untouched.",
      }),
    },

    // ── Lesson 17 ────────────────────────────────────────────────────────
    {
      title: "MobX 17: observer + Hooks — Common Pitfalls",
      content: [
        "observer components need a little care with hooks: hooks-must-run order is preserved; observables-read-inside-effects don't subscribe the component; destructuring loses tracking.",
        "Walk through the top 4 pitfalls and their fixes.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Pitfall 1: Destructuring loses reactivity",
          body: "`const { name } = user;` — copies the value at render time; later changes don't re-render, because the observer reads no observable after this point. Fix: read `user.name` *inside* the JSX, or keep using `user.name` everywhere.",
          badges: ["Destructure"],
          code: "// BAD\nconst Component = observer(({ user }) => {\n  const { name } = user;          // read once, no tracking going forward\n  return <div>{name}</div>;\n});\n\n// GOOD\nconst Component = observer(({ user }) => <div>{user.name}</div>);",
        },
        {
          tag: "concept",
          title: "Pitfall 2: useEffect observables",
          body: "Reads inside `useEffect` are not tracked — effects run once per render, not as reactions. If you need to fire an effect on observable change, use `reaction(() => store.x, effect)` and dispose in the useEffect cleanup.",
          badges: ["useEffect"],
        },
        {
          tag: "concept",
          title: "Pitfall 3: Passing observables to non-observers",
          body: "A child that's not wrapped in observer receives the observable but can't react to it. Wrap it, or pass the raw value (`user.name`) and let the parent's tracking handle it.",
          badges: ["Wrapping"],
        },
        {
          tag: "concept",
          title: "Pitfall 4: Mutations in render",
          body: "Never mutate observables in render — it can cause infinite re-render loops. Move mutations into event handlers, `useEffect`, or data-loading actions. observers are for reading.",
          badges: ["Render"],
        },
        {
          tag: "exercise",
          title: "Diagnose three components",
          body: "Given three `observer` components (one destructures, one has useEffect mutating, one is fine), output a diagnosis for each. Verify the middle one would infinite-loop in a real React app.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Always wrap the component",
          body: "The rule of thumb: if your component reads any observable (even transitively through a child), wrap it with `observer`. There's no penalty for 'over-wrapping'. Missing an observer is a common source of stale UI bugs.",
          badges: ["Discipline"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why doesn't useEffect track?",
          body: "`useEffect` runs outside MobX's reaction context. **Its reads aren't registered.** To make an effect reactive, use `reaction(dataFn, effectFn)` inside useEffect and dispose on unmount. This is how you bridge MobX and React-side effects.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Diagnose common observer pitfalls\ntype Diagnosis = { ok: boolean; issue: string };\n\nfunction diagnose(snippet: string): Diagnosis {\n  if (/const\\s+\\{[^}]+\\}\\s*=\\s*\\w+\\s*;\\s*return/s.test(snippet) &&\n      !/return[^{}]*\\w+\\.(name|email|value)/.test(snippet))\n    return { ok: false, issue: "Destructuring loses reactivity — read through the observable directly" };\n  if (/useEffect\\([^)]*\\{\\s*\\w+\\.\\w+\\s*=/.test(snippet))\n    return { ok: false, issue: "Mutation inside useEffect without reaction wiring" };\n  if (!/observer\\(/.test(snippet) && /\\buser\\.\\w+|store\\.\\w+/.test(snippet))\n    return { ok: false, issue: "Component reads observables but is not wrapped with observer()" };\n  return { ok: true, issue: "looks fine" };\n}\n\nconst samples = [\n  "const C = observer(({ user }) => { const { name } = user; return <div>{name}</div>; });",\n  "const C = observer(({ store }) => { useEffect(() => { store.count = 1; }, []); return <div>{store.count}</div>; });",\n  "const C = observer(({ user }) => <div>{user.name}</div>);",\n  "const C = ({ user }) => <div>{user.name}</div>;",\n];\n\nfor (const s of samples) {\n  const d = diagnose(s);\n  console.log((d.ok ? "OK  " : "BAD ") + d.issue);\n  console.log("    " + s.slice(0, 80) + "...");\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("diagnose") &&
          logs.some((l) => l.includes("BAD Destructuring")) &&
          logs.some((l) => l.includes("BAD Mutation inside useEffect")) &&
          logs.some((l) => l.includes("BAD ") && l.includes("not wrapped")),
        message: "You can now spot the three most common observer pitfalls in code review.",
      }),
    },

    // ── Lesson 18 ────────────────────────────────────────────────────────
    {
      title: "MobX 18: Debugging & mobx-logger",
      content: [
        "Effective MobX debugging: `trace()` shows why a reaction ran, `spy()` logs every action/observable/computed globally, and devtools extensions visualize the dependency graph.",
        "Build a spy-like logger that traces mutations end-to-end in a store.",
      ],
      sections: [
        {
          tag: "concept",
          title: "trace() — targeted",
          body: "`autorun(() => { trace(store, 'email', true); useEmail(); })` — on every re-run of this reaction, MobX prints the dep chain that caused it. Invaluable for 'why did this re-render?' questions.",
          badges: ["trace"],
          code: "import { trace } from 'mobx';\n\nconst disposer = autorun(() => {\n  trace(store, 'email', true);   // break into debugger on next fire\n  analytics.identify(store.email);\n});",
        },
        {
          tag: "concept",
          title: "spy() — global",
          body: "`spy(event => console.log(event))` logs every MobX event: action start/end, observable mutation, reaction scheduled. Noisy but great for exploring what a store actually does under load. Remove in production.",
          badges: ["spy"],
        },
        {
          tag: "concept",
          title: "mobx-logger & devtools",
          body: "`mobx-logger` patches `spy` into a pretty console log. `mobx-devtools` browser extension visualizes the dependency graph and lets you step through actions. For React, `mobx-react-devtools` (deprecated) is now rolled into React DevTools.",
          badges: ["Tools"],
        },
        {
          tag: "exercise",
          title: "Build an action/mutation logger",
          body: "Wrap a store so every action logs `START name(args)`, every observable mutation logs `SET field value`, and every reaction logs `REACTION name`. Run a transfer and inspect the trace.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Name everything",
          body: "Actions (`action('transfer', fn)`), autoruns (`autorun(fn, { name: 'logger' })`), and reactions all accept names. In spy logs, names save you from staring at `<anonymous>` entries — essential for real debugging.",
          badges: ["Naming"],
        },
        {
          tag: "key-point",
          title: "Quiz: Over-firing reactions",
          body: "Your reaction fires 100 times per user action — what do you do? **First `trace()` to find which observable changed; second check if the data function returns a new reference every time (classic bug with fresh arrays); third consider structural equality via `comparer.structural`.**",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Spy-style logger\ntype Event =\n  | { kind: "action-start"; name: string; args: unknown[] }\n  | { kind: "action-end";   name: string }\n  | { kind: "set"; field: string; value: unknown }\n  | { kind: "reaction"; name: string };\n\nconst listeners: Array<(e: Event) => void> = [];\nfunction spy(fn: (e: Event) => void): () => void {\n  listeners.push(fn);\n  return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };\n}\nfunction emit(e: Event): void { for (const l of listeners) l(e); }\n\nclass Account {\n  private _balance = 0;\n  get balance(): number { return this._balance; }\n  set balance(v: number) { this._balance = v; emit({ kind: "set", field: "balance", value: v }); }\n}\n\nfunction action(name: string, fn: () => void): () => void {\n  return () => {\n    emit({ kind: "action-start", name, args: [] });\n    fn();\n    emit({ kind: "action-end", name });\n  };\n}\n\nspy((e) => {\n  switch (e.kind) {\n    case "action-start": console.log("  >> action " + e.name); break;\n    case "action-end":   console.log("  << end    " + e.name); break;\n    case "set":          console.log("     SET " + e.field + " = " + String(e.value)); break;\n    case "reaction":     console.log("  *  reaction " + e.name); break;\n  }\n});\n\nconst a = new Account();\nconst b = new Account();\na.balance = 100;\nb.balance = 50;\n\nconst transfer = action("transfer", () => {\n  a.balance = a.balance - 30;\n  b.balance = b.balance + 30;\n});\n\nconsole.log("\\n--- executing transfer ---");\ntransfer();`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("spy") &&
          code.includes("emit") &&
          logs.some((l) => l.includes(">> action transfer")) &&
          logs.some((l) => l.includes("SET balance")) &&
          logs.some((l) => l.includes("<< end    transfer")),
        message: "Spy logger working — every action start, mutation, and end traced.",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 4 — Advanced + Interview (Lessons 19-24)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 19 ────────────────────────────────────────────────────────
    {
      title: "MobX 19: MobX vs Redux vs Zustand",
      content: [
        "Three state libraries, three mental models. **Redux**: single store + pure reducers + dispatch. **Zustand**: single store + setter + hook selectors. **MobX**: many observables + auto-tracked reactions. Knowing when to pick which is an interview classic.",
        "Build a feature matrix and a quick picker based on team + app constraints.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Redux: explicit + testable",
          body: "Every mutation is a dispatched action; reducers are pure functions. Redux devtools give time-travel debugging. Cost: boilerplate (actions, reducers, selectors), careful selector memoization, explicit async via thunks/saga/RTK Query. Best for large teams needing audit trails.",
          badges: ["Redux"],
        },
        {
          tag: "concept",
          title: "Zustand: minimal + local",
          body: "`create((set, get) => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))`. Tiny API, hook-first, explicit. No providers, no reducers. Cost: you rebuild any derived state logic (no computeds), selectors need explicit memoization.",
          badges: ["Zustand"],
        },
        {
          tag: "concept",
          title: "MobX: reactive + OO",
          body: "Classes + observables + automatic tracking. Less boilerplate than Redux, more structure than Zustand. Cost: the 'magic' can be surprising (why did this re-render?), TypeScript configuration, OO feel that some React devs find unnatural.",
          badges: ["MobX"],
        },
        {
          tag: "exercise",
          title: "Build a library picker",
          body: "`pick({ teamSize, hasComplexDerivations, needsTimeTravelDebug, minimalismPreference })` recommends Redux, MobX, or Zustand with rationale. Test 5 realistic team/app combos.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "The actual rule: mix if you need to",
          body: "For server state, use React Query / SWR — not any of the above. Use Redux/MobX/Zustand for **UI/client state**. Mixing a data-layer (React Query) with a UI-state lib is common and works well.",
          badges: ["Reality"],
        },
        {
          tag: "key-point",
          title: "Quiz: Which for a 2-person side project?",
          body: "Small team, no compliance needs, just want state? **Zustand** — tiny API, no providers, quick start. Redux is overkill, MobX's class pattern is heavier than needed for a small app.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// State library picker\ntype Lib = "Redux" | "MobX" | "Zustand";\ninterface Requirements {\n  teamSize: number;\n  hasComplexDerivations: boolean;\n  needsTimeTravelDebug: boolean;\n  prefersClasses: boolean;\n  prefersMinimal: boolean;\n}\n\nfunction pick(r: Requirements): { lib: Lib; reason: string } {\n  if (r.needsTimeTravelDebug || r.teamSize > 15)\n    return { lib: "Redux", reason: "time-travel debugging + large team = explicit actions + devtools" };\n  if (r.hasComplexDerivations || r.prefersClasses)\n    return { lib: "MobX", reason: "computed values + OO ergonomics shine here" };\n  if (r.prefersMinimal || r.teamSize <= 5)\n    return { lib: "Zustand", reason: "smallest API, fastest to start, no providers" };\n  return { lib: "MobX", reason: "balanced default — reactivity with structure" };\n}\n\nconst cases: [string, Requirements][] = [\n  ["enterprise audit app",     { teamSize: 40, hasComplexDerivations: false, needsTimeTravelDebug: true,  prefersClasses: false, prefersMinimal: false }],\n  ["indie side project",       { teamSize: 2,  hasComplexDerivations: false, needsTimeTravelDebug: false, prefersClasses: false, prefersMinimal: true  }],\n  ["financial dashboard",      { teamSize: 8,  hasComplexDerivations: true,  needsTimeTravelDebug: false, prefersClasses: true,  prefersMinimal: false }],\n  ["onboarding wizard",        { teamSize: 4,  hasComplexDerivations: false, needsTimeTravelDebug: false, prefersClasses: false, prefersMinimal: true  }],\n  ["real-time trading UI",     { teamSize: 10, hasComplexDerivations: true,  needsTimeTravelDebug: false, prefersClasses: true,  prefersMinimal: false }],\n];\n\nfor (const [name, r] of cases) {\n  const p = pick(r);\n  console.log(name.padEnd(24) + " -> " + p.lib.padEnd(8) + "  " + p.reason);\n}`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("pick") &&
          logs.some((l) => l.includes("Redux")) &&
          logs.some((l) => l.includes("MobX")) &&
          logs.some((l) => l.includes("Zustand")),
        message: "Picker recommending Redux, MobX, and Zustand for the right scenarios.",
      }),
    },

    // ── Lesson 20 ────────────────────────────────────────────────────────
    {
      title: "MobX 20: TypeScript with MobX Stores",
      content: [
        "MobX + TypeScript needs specific patterns: `makeObservable<this, 'private'>(this, { ... })` for private members, annotation types are type-checked, and strict mode integrates with TS nicely.",
        "Build a typed store with private state and public computed accessors.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Generic makeObservable",
          body: "`makeObservable<T, PrivateKeys>(this, annotations, options)`. The generic lets you annotate private fields without TS errors. Usually inferred, but helpful for classes with `#private` or private keyword members.",
          badges: ["Generics"],
          code: "class Store {\n  private _count = 0;\n  constructor() {\n    makeObservable<this, '_count'>(this, {\n      _count: observable,\n      count: computed,\n      inc: action,\n    });\n  }\n  get count(): number { return this._count; }\n  inc(): void { this._count++; }\n}",
        },
        {
          tag: "concept",
          title: "Type-checked annotations",
          body: "`makeObservable(this, { count: action })` where `count` is a number field → TS error. Annotation types enforce that `observable` goes on fields, `computed` on getters, `action` on methods. Catches mistakes at compile time.",
          badges: ["Type Safety"],
        },
        {
          tag: "concept",
          title: "Readonly public API",
          body: "Mark observable fields `readonly` to force mutations through actions. `readonly items: readonly Item[] = []` means `store.items = []` is a TS error; `store.addItem()` (the action) is the only way in. Great for large teams.",
          badges: ["Readonly"],
          code: "class Cart {\n  @observable readonly items: readonly Item[] = [];\n  @action addItem(item: Item) {\n    // internally re-assign the readonly — only actions can\n    (this as { items: Item[] }).items = [...this.items, item];\n  }\n}",
        },
        {
          tag: "exercise",
          title: "Build a typed counter store",
          body: "TS-style `CounterStore` with: private `_count`, public computed `count`, actions `inc`/`dec`/`reset`. Test TS would reject `store._count = 99` externally.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Prefer makeAutoObservable for speed",
          body: "For typical stores, `makeAutoObservable(this)` is typed correctly out of the box. Reach for explicit `makeObservable` only when you need to annotate private fields or opt out specific members.",
          badges: ["Ergonomics"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why runtime annotations at all?",
          body: "TypeScript erases types — MobX needs runtime information. **Annotations tell MobX at runtime which fields to make reactive, which methods to wrap as actions.** Decorators (legacy) did this via compile-time transforms; `makeObservable` does it at construction.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// TS-style private + public-computed counter\nlet tracker: Set<() => void> | null = null;\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\n\nclass CounterStore {\n  private readonly _count = obs(0);\n\n  get count(): number { return this._count.get(); }\n  inc(): void   { this._count.set(this._count.get() + 1); }\n  dec(): void   { this._count.set(this._count.get() - 1); }\n  reset(): void { this._count.set(0); }\n}\n\nconst store = new CounterStore();\nconsole.log("count: " + store.count);\nstore.inc(); store.inc(); store.inc();\nconsole.log("count: " + store.count);\n\n// store._count.set(99);   // TS: private — compile error\nstore.dec();\nconsole.log("count: " + store.count);\n\n// store.count = 5;        // TS: no setter — compile error\nstore.reset();\nconsole.log("count: " + store.count);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("private") &&
          code.includes("CounterStore") &&
          logs.some((l) => l.includes("count: 0")) &&
          logs.some((l) => l.includes("count: 3")) &&
          logs.some((l) => l.includes("count: 2")),
        message: "Private observable + public computed API — TS enforces encapsulation, MobX provides reactivity.",
      }),
    },

    // ── Lesson 21 ────────────────────────────────────────────────────────
    {
      title: "MobX 21: Testing MobX Stores",
      content: [
        "Stores are plain classes — easy to test. Instantiate fresh per test, call actions, assert on observable state and computeds. Reactions can be tested by wiring an autorun + collecting its output.",
        "Build a Jest-style test harness for a CartStore with 3 test cases.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Fresh store per test",
          body: "`beforeEach(() => { store = new CartStore() })`. Never share state across tests — subtle ordering bugs. Action dispatches are synchronous (or awaited), so tests are simple arrange/act/assert.",
          badges: ["Isolation"],
        },
        {
          tag: "concept",
          title: "Asserting reactions",
          body: "To test that an autorun/reaction fires correctly, wire it up with a mock callback, exercise the store, then assert the callback's calls. Dispose the reaction at test end.",
          badges: ["Reactions"],
          code: "const logs: number[] = [];\nconst dispose = reaction(() => store.count, c => logs.push(c));\nstore.inc();\nstore.inc();\nexpect(logs).toEqual([1, 2]);\ndispose();",
        },
        {
          tag: "concept",
          title: "Async actions",
          body: "`await store.loadUser(42); expect(store.user).toBe(...)`. MobX's async is compatible with await in tests. Mock the fetch layer (MSW, `jest.fn`) so tests are deterministic. No need for test-time MobX configuration.",
          badges: ["Async"],
        },
        {
          tag: "exercise",
          title: "Write 3 tests",
          body: "`CartStore` with `addItem`, `removeItem`, `total`. Tests: (1) adding items increases total, (2) removing a non-existent item is a no-op, (3) a reaction on `total` fires exactly once per action via batching.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "No MobX-specific test setup",
          body: "Unlike Redux, you don't need a store provider, reducer harness, or middleware mocks. Just `new Store()` and start asserting. This is a real productivity win — tests read like plain unit tests.",
          badges: ["DX"],
        },
        {
          tag: "key-point",
          title: "Quiz: When to mock the store",
          body: "Should you ever mock a MobX store? **Only for component tests where the component is far from the real store or uses server state.** For store logic itself, always test the real class — it's a unit, not a dependency.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Jest-style test harness\ninterface Item { id: number; name: string; price: number }\nlet tracker: Set<() => void> | null = null;\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction reaction<T>(data: () => T, effect: (v: T) => void): () => void {\n  let prev: T;\n  const run = () => {\n    tracker = new Set();\n    const v = data();\n    const t = tracker; tracker = null;\n    t.forEach((r) => r(() => { const nv = data(); if (!Object.is(nv, prev)) { effect(nv); prev = nv; } }));\n    prev = v;\n  };\n  run();\n  return () => { /* dispose */ };\n}\n\nclass CartStore {\n  items = obs<Item[]>([]);\n  addItem(item: Item): void { this.items.set([...this.items.get(), item]); }\n  removeItem(id: number): void { this.items.set(this.items.get().filter((i) => i.id !== id)); }\n  total(): number { return this.items.get().reduce((s, i) => s + i.price, 0); }\n}\n\nfunction test(name: string, fn: () => void): void {\n  try { fn(); console.log("PASS " + name); }\n  catch (e) { console.log("FAIL " + name + "  — " + (e as Error).message); }\n}\nfunction expect<T>(actual: T) {\n  return {\n    toBe(expected: T) { if (actual !== expected) throw new Error("expected " + expected + ", got " + actual); },\n    toEqual(expected: T) { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual)); },\n  };\n}\n\ntest("adding items increases total", () => {\n  const s = new CartStore();\n  s.addItem({ id: 1, name: "x", price: 10 });\n  s.addItem({ id: 2, name: "y", price: 5 });\n  expect(s.total()).toBe(15);\n});\n\ntest("removing non-existent item is a no-op", () => {\n  const s = new CartStore();\n  s.addItem({ id: 1, name: "x", price: 10 });\n  s.removeItem(99);\n  expect(s.total()).toBe(10);\n  expect(s.items.get().length).toBe(1);\n});\n\ntest("reaction on total fires per mutation", () => {\n  const s = new CartStore();\n  const fires: number[] = [];\n  reaction(() => s.total(), (v) => fires.push(v));\n  s.addItem({ id: 1, name: "x", price: 10 });\n  s.addItem({ id: 2, name: "y", price: 15 });\n  expect(fires.length).toBe(2);\n  expect(fires[1]).toBe(25);\n});`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("test") &&
          code.includes("expect") &&
          logs.some((l) => l.includes("PASS adding items increases total")) &&
          logs.some((l) => l.includes("PASS removing non-existent item")) &&
          logs.some((l) => l.includes("PASS reaction on total")),
        message: "Three MobX tests green — stores are plain classes, this scales easily.",
      }),
    },

    // ── Lesson 22 ────────────────────────────────────────────────────────
    {
      title: "MobX 22: Computed Structural Equality",
      content: [
        "By default, computed values are compared by `===`. If your computed returns a new array/object each time, it 'changes' every run even if contents are identical — causing spurious re-renders.",
        "Fix it with `computed({ equals: comparer.structural })` or memoized return values.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The fresh-reference trap",
          body: "`get filtered() { return items.filter(i => i.active); }` — every invocation makes a new array. Even if results are identical, `===` says 'different'. Reactions subscribed to `filtered` fire on every items change, wasting work.",
          badges: ["Trap"],
        },
        {
          tag: "concept",
          title: "comparer options",
          body: "`comparer.default` (`===`), `comparer.shallow` (one level structural), `comparer.structural` (deep). Use `comparer.structural` for arrays of primitives or small objects; for large structures, structural is expensive — rethink.",
          badges: ["Equality"],
          code: "import { comparer, computed } from 'mobx';\n\nget filtered() {\n  return this.items.filter(i => i.active);\n}\n// Annotate at makeObservable time:\nmakeObservable(this, {\n  filtered: computed.struct,   // shorthand for { equals: comparer.structural }\n});",
        },
        {
          tag: "concept",
          title: "When to stabilize instead",
          body: "For very expensive computeds or large data, structural equality is slow. Alternative: precompute an id/hash, cache by id, and return the cached object on matching hash. This gives you O(1) equality at the cost of building an explicit cache.",
          badges: ["Perf"],
        },
        {
          tag: "exercise",
          title: "Measure spurious fires",
          body: "A computed returning a new array every time. Wire a reaction on it. Mutate an observable that doesn't affect the filter. Count reaction fires. Without `comparer.structural`: fires on every mutation. With it: zero.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Cheapest equality first",
          body: "Prefer `comparer.default` (fast) whenever possible — design your computeds to return the same reference for unchanged data. Use structural comparison only when you can't.",
          badges: ["Order"],
        },
        {
          tag: "key-point",
          title: "Quiz: Why does filter fire every time?",
          body: "Array.prototype.filter always returns a **new array**. Even identical contents → `!==`. Structural equality fixes it, OR keep the result reference stable by reducing into a cached array.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Structural equality on computed\nlet tracker: Set<() => void> | null = null;\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\n\nfunction structural(a: unknown, b: unknown): boolean {\n  return JSON.stringify(a) === JSON.stringify(b);\n}\n\nfunction computed<T>(fn: () => T, opts: { equals?: (a: T, b: T) => boolean } = {}): { get(): T; subscribe(s: () => void): () => void } {\n  const equals = opts.equals ?? Object.is;\n  let cached: T; let dirty = true;\n  const subs = new Set<() => void>();\n  const invalidate = () => {\n    if (dirty) return;\n    dirty = true;\n    tracker = new Set();\n    const nv = fn();\n    const t = tracker; tracker = null;\n    t.forEach((r) => r(invalidate));\n    if (!equals(cached, nv)) { cached = nv; subs.forEach((s) => s()); }\n    dirty = false;\n  };\n  return {\n    get(): T {\n      if (dirty) { tracker = new Set(); cached = fn(); const t = tracker; tracker = null; t.forEach((r) => r(invalidate)); dirty = false; }\n      return cached;\n    },\n    subscribe(fn2) { subs.add(fn2); return () => subs.delete(fn2); },\n  };\n}\n\nconst items = obs([{ id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true }]);\n\nconst filteredDefault    = computed(() => items.get().filter((i) => i.active));\nconst filteredStructural = computed(() => items.get().filter((i) => i.active), { equals: structural });\n\nlet defaultFires = 0, structFires = 0;\nfilteredDefault.subscribe(() => defaultFires++);\nfilteredStructural.subscribe(() => structFires++);\n// prime caches\nfilteredDefault.get(); filteredStructural.get();\n\n// mutate in a way that doesn't change the filtered result\nconst arr = items.get();\nitems.set([...arr]);   // new array, same contents\nitems.set([...arr]);\nitems.set([...arr]);\n\nconsole.log("default equality fires: " + defaultFires);\nconsole.log("structural equality fires: " + structFires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("structural") &&
          code.includes("computed") &&
          logs.some((l) => l.includes("default equality fires")) &&
          logs.some((l) => l.includes("structural equality fires: 0")),
        message: "Structural equality prevented spurious fires — default would fire on every items set, structural zero.",
      }),
    },

    // ── Lesson 23 ────────────────────────────────────────────────────────
    {
      title: "MobX 23: Reactions with Cleanup & Disposal",
      content: [
        "Every reaction returns a **disposer**. Forgetting to call it leaks memory and CPU — especially inside React components. Tie disposal to lifecycle: unmount, store destruction, or `when` auto-disposal.",
        "Build a reaction manager that tracks live reactions and can dispose them all on tear-down.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Disposer pattern",
          body: "`const dispose = autorun(fn); /* later */ dispose();`. Without disposal, the reaction keeps its dependencies alive and keeps running. In React: `useEffect(() => autorun(fn), [])` returns the disposer as the cleanup function.",
          badges: ["Dispose"],
        },
        {
          tag: "concept",
          title: "when() auto-disposes",
          body: "`when(pred, effect)` fires once and disposes itself. Good for 'on first X, do Y' semantics. Can also be awaited (no effect): `await when(() => store.ready)` — resumes when ready.",
          badges: ["when"],
        },
        {
          tag: "concept",
          title: "Batch disposal",
          body: "For stores owning many reactions, keep a `disposers: (() => void)[]` array. `onDestroy()` calls all of them. This pattern prevents leaks when a store is swapped out (SSR, test reset).",
          badges: ["Batch"],
          code: "class Store {\n  private disposers: Array<() => void> = [];\n  constructor() {\n    this.disposers.push(autorun(() => this.syncToLocalStorage()));\n    this.disposers.push(reaction(() => this.user, u => analytics.identify(u)));\n  }\n  destroy() { this.disposers.forEach(d => d()); }\n}",
        },
        {
          tag: "exercise",
          title: "Build a ReactionBundle",
          body: "Class with `add(disposer)` and `disposeAll()`. Create 3 reactions, add each disposer. Dispose all. Subsequent mutations should trigger zero fires.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Dispose on component unmount",
          body: "`useEffect(() => { const d = autorun(fn); return d; }, [])`. The returned disposer becomes the effect cleanup. Always pair autorun with unmount cleanup in components.",
          badges: ["React"],
        },
        {
          tag: "key-point",
          title: "Quiz: Leaked reaction symptom",
          body: "Your app gets slower over time, but state looks normal — why? **Leaked reactions.** Unmounted components' autoruns kept firing on every store change. Fix: ensure every autorun/reaction in useEffect returns its disposer.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Reaction bundle for batch disposal\nlet tracker: Set<() => void> | null = null;\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { if (Object.is(nv, v)) return; v = nv; subs.forEach((s) => s()); },\n  };\n}\nfunction autorun(fn: () => void): () => void {\n  let disposed = false;\n  const run = () => {\n    if (disposed) return;\n    tracker = new Set();\n    fn();\n    const finalize = tracker; tracker = null;\n    finalize.forEach((r) => r(run));\n  };\n  run();\n  return () => { disposed = true; };\n}\n\nclass ReactionBundle {\n  private disposers: Array<() => void> = [];\n  add(d: () => void): void { this.disposers.push(d); }\n  disposeAll(): void { for (const d of this.disposers) d(); this.disposers = []; }\n}\n\nconst store = { user: obs("alice"), theme: obs("light"), count: obs(0) };\nconst bundle = new ReactionBundle();\nlet fires = 0;\n\nbundle.add(autorun(() => { fires++; store.user.get(); }));\nbundle.add(autorun(() => { fires++; store.theme.get(); }));\nbundle.add(autorun(() => { fires++; store.count.get(); }));\n\nconsole.log("initial fires (one per reaction): " + fires);\n\nstore.user.set("bob");\nstore.theme.set("dark");\nstore.count.set(5);\nconsole.log("after 3 mutations: " + fires);\n\nbundle.disposeAll();\n\nstore.user.set("carol");\nstore.theme.set("light");\nstore.count.set(99);\nconsole.log("after 3 more mutations post-dispose: " + fires);`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("ReactionBundle") &&
          code.includes("disposeAll") &&
          logs.some((l) => l.includes("initial fires (one per reaction): 3")) &&
          logs.some((l) => l.includes("after 3 mutations: 6")) &&
          logs.some((l) => l.includes("after 3 more mutations post-dispose: 6")),
        message: "Batch disposal working — mutations after disposeAll fire zero reactions.",
      }),
    },

    // ── Lesson 24 ────────────────────────────────────────────────────────
    {
      title: "MobX 24: Interview Capstone — Todo App Architecture",
      content: [
        "The capstone: architect a full todo app with MobX. Covers RootStore, per-domain stores, computed filters, async loading, persistence (localStorage sync), and testing strategy.",
        "Build a `TodoStore` with `todos`, `filter`, `visibleTodos`, `leftCount`, CRUD actions, and a localStorage sync autorun — interview-ready.",
      ],
      sections: [
        {
          tag: "concept",
          title: "The classic spec",
          body: "Todos with `{ id, text, done }`. Filter: `all | active | done`. Visible = filtered todos. Left count = active count. Actions: `add`, `toggle(id)`, `remove(id)`, `clearCompleted()`. Persistence: autorun syncs `toJSON()` to localStorage; on boot, load from localStorage.",
          badges: ["Spec"],
        },
        {
          tag: "concept",
          title: "The store shape",
          body: "`observable todos`, `observable filter`, **computed** `visibleTodos` (filtered), **computed** `leftCount` (active length). **actions** for CRUD. **autorun** for persistence. All inside a single `TodoStore` class with `makeAutoObservable(this)` in constructor.",
          badges: ["Shape"],
          code: "class TodoStore {\n  todos: Todo[] = [];\n  filter: Filter = 'all';\n  constructor() { makeAutoObservable(this); this.hydrate(); autorun(() => this.persist()); }\n\n  get visibleTodos() {\n    return this.filter === 'all' ? this.todos\n      : this.filter === 'active' ? this.todos.filter(t => !t.done)\n      : this.todos.filter(t => t.done);\n  }\n  get leftCount() { return this.todos.filter(t => !t.done).length; }\n\n  add(text: string) { this.todos.push({ id: uuid(), text, done: false }); }\n  toggle(id: string) { const t = this.todos.find(t => t.id === id); if (t) t.done = !t.done; }\n  remove(id: string) { this.todos = this.todos.filter(t => t.id !== id); }\n  clearCompleted() { this.todos = this.todos.filter(t => !t.done); }\n  setFilter(f: Filter) { this.filter = f; }\n\n  private persist() { localStorage.setItem('todos', JSON.stringify(this.todos)); }\n  private hydrate() { const raw = localStorage.getItem('todos'); if (raw) this.todos = JSON.parse(raw); }\n}",
        },
        {
          tag: "concept",
          title: "What interviewers probe",
          body: "(1) Why is `visibleTodos` a computed? (auto-memoized). (2) How do you test persistence? (mock localStorage, trigger an action, assert the mock was called). (3) How does granular reactivity help? (toggling one todo re-renders just its row). (4) Scaling: 10k todos? (virtualize + computed with structural equality).",
          badges: ["Interview"],
        },
        {
          tag: "exercise",
          title: "Build the full TodoStore",
          body: "Implement the store described above using the mini reactive primitives. Exercise: add 3 todos, toggle one, set filter to 'active', assert visibleTodos contains exactly the 2 active ones. Track localStorage 'writes' via an autorun on `toJSON()`.",
          badges: ["Practice", "Capstone"],
        },
        {
          tag: "tip",
          title: "Close out by comparing to alternatives",
          body: "In the interview, finish with: 'Here's how I'd scale this to 10k items (computed struct + virtualization), how I'd share across components (`useStore`), and how I'd test (fresh store per test + reaction spies).' Show you think beyond the happy path.",
          badges: ["Finish"],
        },
        {
          tag: "key-point",
          title: "Quiz: What makes this MobX-idiomatic?",
          body: "Three signals of idiomatic MobX: **(1)** derived values are computeds, not manually maintained. **(2)** Mutations happen only in actions (strict mode). **(3)** Side effects (persistence, analytics) are reactions, not inline in actions. Separate state, derivation, mutation, side effect — MobX's four-layer design.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Full TodoStore capstone\nlet tracker: Set<() => void> | null = null;\nlet inTx = false;\nconst pending = new Set<() => void>();\n\nfunction obs<T>(initial: T) {\n  let v = initial; const subs = new Set<() => void>();\n  const notify = () => subs.forEach((s) => inTx ? pending.add(s) : s());\n  return {\n    get(): T { if (tracker) tracker.add(() => subs.forEach((s) => s())); return v; },\n    set(nv: T): void { v = nv; notify(); },\n  };\n}\nfunction computed<T>(fn: () => T): { get(): T } {\n  let cache: T; let dirty = true;\n  const invalidate = () => { dirty = true; };\n  return {\n    get(): T {\n      if (dirty) { tracker = new Set(); cache = fn(); const t = tracker; tracker = null; t.forEach((r) => r(invalidate)); dirty = false; }\n      return cache;\n    },\n  };\n}\nfunction action(fn: () => void): () => void {\n  return () => { inTx = true; try { fn(); } finally { inTx = false; const t = [...pending]; pending.clear(); t.forEach((f) => f()); } };\n}\nfunction autorun(fn: () => void): () => void {\n  let disposed = false;\n  const run = () => { if (disposed) return; tracker = new Set(); fn(); const t = tracker; tracker = null; t.forEach((r) => r(run)); };\n  run();\n  return () => { disposed = true; };\n}\n\ntype Filter = "all" | "active" | "done";\ninterface Todo { id: number; text: string; done: boolean }\n\nclass TodoStore {\n  todos = obs<Todo[]>([]);\n  filter = obs<Filter>("all");\n  private nextId = 1;\n\n  visibleTodos = computed(() => {\n    const f = this.filter.get();\n    const all = this.todos.get();\n    return f === "all" ? all : f === "active" ? all.filter((t) => !t.done) : all.filter((t) => t.done);\n  });\n  leftCount = computed(() => this.todos.get().filter((t) => !t.done).length);\n\n  add = action(() => {\n    // text passed via closure; in real MobX, parameters would flow through\n    this.todos.set([...this.todos.get(), { id: this.nextId++, text: this.pendingText, done: false }]);\n  });\n  pendingText = "";\n\n  toggle(id: number): void {\n    this.todos.set(this.todos.get().map((t) => t.id === id ? { ...t, done: !t.done } : t));\n  }\n  remove(id: number): void { this.todos.set(this.todos.get().filter((t) => t.id !== id)); }\n  clearCompleted = action(() => this.todos.set(this.todos.get().filter((t) => !t.done)));\n  setFilter(f: Filter): void { this.filter.set(f); }\n}\n\nconst store = new TodoStore();\nlet persistCount = 0;\nautorun(() => { store.todos.get(); persistCount++; });\n\nfor (const t of ["buy milk", "learn mobx", "write tests"]) { store.pendingText = t; store.add(); }\nstore.toggle(1);\nstore.setFilter("active");\n\nconsole.log("all todos: " + store.todos.get().length);\nconsole.log("visible:   " + store.visibleTodos.get().map((t) => t.text).join(", "));\nconsole.log("left:      " + store.leftCount.get());\nconsole.log("persists:  " + persistCount + " (initial + 4 mutations)");\n\nstore.setFilter("done");\nconsole.log("done only: " + store.visibleTodos.get().map((t) => t.text).join(", "));`,
      validationLogic: (code, logs) => ({
        success:
          code.includes("TodoStore") &&
          code.includes("visibleTodos") &&
          code.includes("leftCount") &&
          logs.some((l) => l.includes("all todos: 3")) &&
          logs.some((l) => l.includes("left:      2")) &&
          logs.some((l) => l.includes("done only: buy milk")),
        message: "Full Todo app architecture — RootStore-ready, computed derivations, reactions for side effects. Interview capstone done.",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `mobx-${i + 1}`;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: i < raw.length - 1 ? `mobx-${i + 2}` : undefined,
      prevStep: i > 0 ? `mobx-${i}` : undefined,
      content: lesson.content,
    };
  });
}

export const MOBX_COURSE_LESSONS = buildMobxLessons();

export function getMobxLessonById(slug: string): WebCourseLesson | undefined {
  return MOBX_COURSE_LESSONS.find((l) => l.id === slug);
}
