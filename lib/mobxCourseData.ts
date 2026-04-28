/**
 * MobX Interview Prep — 65 lessons covering the reactivity model,
 * derivations, React integration, advanced patterns, and interview capstones.
 * Every lesson uses REAL `mobx` + `mobx-react-lite` imports; the Monaco
 * editor's iframe preview loads both UMDs so `observable`, `observer`,
 * `computed`, `autorun`, and friends actually run.
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";
import { MOBX_TITLES_ES } from "./courseShellTranslations";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

function buildMobxLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
  {
    title: "MobX 1: What Is MobX? The Reactivity Model",
    content: [
      "**MobX is transparent functional reactive programming**. You declare state as observable, derivations as computed, and reactions as autoruns/reactions — everything else recomputes automatically.",
      "In this first lesson we render a React counter that reads a MobX observable and updates whenever it changes — zero `useState`, zero prop drilling.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The three roles",
      body: "**State**: observable values. **Derivations**: pure functions of state (`computed`). **Reactions**: side-effects that re-run (`autorun`, `observer` components). MobX tracks which observables each derivation/reaction reads.",
      badges: ["State","Derivation","Reaction"],
    },
    {
      tag: "concept",
      title: "Auto-tracking via Proxies",
      body: "When a derivation runs, MobX's Proxy records every observable it reads. When that observable changes, MobX re-invokes the derivation. No dependency arrays, no `useMemo(fn, [deps])` — tracking is automatic.",
      badges: ["Proxy"],
    },
    {
      tag: "tip",
      title: "React integration",
      body: "`observer(Component)` from `mobx-react-lite` wraps a component in a reaction. Every observable the component reads becomes a re-render trigger. That's the whole bridge.",
      badges: ["observer"],
    },
    {
      tag: "key-point",
      title: "Interview framing",
      body: "When an interviewer asks \"Why MobX over Redux?\", answer: **decentralized observables + automatic dependency tracking = less ceremony, surgically granular re-renders**. Redux is explicit & time-travel-friendly. MobX is reactive & minimal.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react-lite";

// MobX state — plain object wrapped in observable
const counter = observable({ value: 0 });

// MobX action — batches mutations
const increment = action(() => { counter.value += 1; });

// React component, observer wrapper from mobx-react-lite
const Counter = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <h2>Count: {counter.value}</h2>
    <button onClick={increment}>+1</button>
  </div>
));

export default function App() {
  console.log("rendering with count=" + counter.value);
  return <Counter />;
}`,
    validationLogic: (code) => ({
    success: code.includes("from \"mobx\"") && code.includes("mobx-react-lite") && code.includes("observer("),
    message: "React + MobX wired — `observer` re-renders only when tracked observables change.",
  }),
  },

  {
    title: "MobX 2: observable & makeObservable",
    content: [
      "`observable` marks data reactive. For class-based stores, use **`makeObservable(this, { ... })`** to declare which fields are observable, which methods are actions, and which getters are computed.",
      "Build a `CartStore` class and watch reactions fire when `items` changes.",
    ],
    sections: [
    {
      tag: "concept",
      title: "observable — the workhorse",
      body: "`observable` wraps plain objects/arrays. Reading a property registers the reader as a dependency; writing notifies all dependents. Nested objects are made observable recursively.",
      code: `import { observable } from 'mobx';
const cart = observable({ items: [], coupon: '' });`,
      badges: ["observable"],
    },
    {
      tag: "concept",
      title: "makeObservable for classes",
      body: "For class stores, `makeObservable(this, { field: observable, method: action, getter: computed })` in the constructor makes each instance individually reactive. **Each instance gets its own observable state.**",
      badges: ["class"],
    },
    {
      tag: "exercise",
      title: "Build CartStore",
      body: "Implement `CartStore` with `items`, `coupon`, `addItem(item)`, `clear()`, a `get total()` computed. Wire it to a React component. Adding items should update the badge automatically.",
      badges: ["Practice"],
    },
    {
      tag: "key-point",
      title: "Interview probe",
      body: "Why does `makeObservable` live in the **constructor**? Because it wraps *this instance* — each instance gets its own observable state. Defining it at class level would share state across instances (bug).",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeObservable, observable, action, computed } from "mobx";
import { observer } from "mobx-react-lite";

interface Item { id: number; name: string; price: number }

class CartStore {
  items: Item[] = [];
  coupon = "";

  constructor() {
    makeObservable(this, {
      items:    observable,
      coupon:   observable,
      total:    computed,
      addItem:  action,
      clear:    action,
    });
  }

  get total(): number {
    const base = this.items.reduce((s, i) => s + i.price, 0);
    return this.coupon === "SAVE10" ? base * 0.9 : base;
  }

  addItem(item: Item) { this.items.push(item); }
  clear() { this.items = []; this.coupon = ""; }
}

const cart = new CartStore();

const Cart = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <h3>Cart ({cart.items.length} items)</h3>
    <ul>{cart.items.map(i => <li key={i.id}>{i.name} — \${i.price}</li>)}</ul>
    <strong>Total: \${cart.total.toFixed(2)}</strong>
    <div style={{ marginTop: 12 }}>
      <button onClick={() => cart.addItem({ id: Date.now(), name: "Widget", price: 25 })}>Add Widget</button>
      <button onClick={() => cart.clear()} style={{ marginLeft: 8 }}>Clear</button>
    </div>
  </div>
));

export default function App() {
  console.log("Cart rendered, items=" + cart.items.length + " total=" + cart.total);
  return <Cart />;
}`,
    validationLogic: (code) => ({
    success: code.includes("makeObservable") && code.includes("observer(") && code.includes("from \"mobx\""),
    message: "Class store with makeObservable + observer React component — the bread and butter of MobX apps.",
  }),
  },

  {
    title: "MobX 3: makeAutoObservable — The Shortcut",
    content: [
      "`makeAutoObservable(this)` infers annotations: **fields** become observable, **methods** become actions, **getters** become computed. It's the most ergonomic option for most stores.",
      "Build the same CartStore with one-line setup.",
    ],
    sections: [
    {
      tag: "concept",
      title: "One call, everything inferred",
      body: "`makeAutoObservable(this)` in the constructor. No explicit annotation map. Works for 95% of stores. Use `makeObservable` only when you need inheritance or want non-observable fields.",
      badges: ["shortcut"],
    },
    {
      tag: "tip",
      title: "Opt out per field",
      body: "Pass a second argument to override: `makeAutoObservable(this, { secret: false, computedHeavy: computed.struct })`. `false` means \"don't make reactive\".",
      badges: ["override"],
    },
    {
      tag: "key-point",
      title: "When NOT to use it",
      body: "Inheritance + `makeAutoObservable` is a trap — the subclass needs `makeObservable` so it can annotate its own fields without double-wrapping the parent. Rule: extends → makeObservable.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class TaskStore {
  tasks: string[] = [];

  constructor() {
    makeAutoObservable(this);    // fields=observable, methods=action, getters=computed
  }

  get count(): number { return this.tasks.length; }
  get summary(): string { return this.count === 0 ? "empty" : \`\${this.count} task(s)\`; }

  add(task: string) { this.tasks.push(task); }
  remove(idx: number) { this.tasks.splice(idx, 1); }
  clear() { this.tasks = []; }
}

const store = new TaskStore();

const TaskList = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <h3>Tasks — {store.summary}</h3>
    <ul>
      {store.tasks.map((t, i) => (
        <li key={i} onClick={() => store.remove(i)} style={{ cursor: "pointer" }}>
          {t} <small>(click to remove)</small>
        </li>
      ))}
    </ul>
    <button onClick={() => store.add("Task #" + (store.count + 1))}>Add Task</button>
  </div>
));

export default function App() {
  console.log("summary: " + store.summary);
  return <TaskList />;
}`,
    validationLogic: (code) => ({
    success: code.includes("makeAutoObservable") && code.includes("observer("),
    message: "makeAutoObservable — the 80% solution. Fast to set up, covers most cases.",
  }),
  },

  {
    title: "MobX 4: action — Atomic State Mutations",
    content: [
      "`action` groups mutations into a single atomic transaction. Observers see the world only *after* the action completes — never a half-updated state.",
      "Transfer money between two accounts without ever showing an intermediate balance.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why actions matter",
      body: "Without action, every `this.x = y` notifies dependents immediately. Two mutations = two re-renders + possibly a broken invariant in between. Actions batch the notify so observers only see consistent state.",
      badges: ["atomic"],
    },
    {
      tag: "concept",
      title: "runInAction",
      body: "`runInAction(() => { ... })` wraps arbitrary code (e.g. inside an async function) so the mutations inside are batched. Essential for `await`.",
      badges: ["async"],
    },
    {
      tag: "key-point",
      title: "Interview: enforceActions",
      body: "Add `configure({ enforceActions: \"always\" })` at app boot. MobX then **throws** if you mutate an observable outside an action. Catches bugs at dev time.",
      badges: ["Interview","strict"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, action, configure } from "mobx";
import { observer } from "mobx-react-lite";

configure({ enforceActions: "always" });

class Account {
  balance: number;
  constructor(initial: number) {
    this.balance = initial;
    makeAutoObservable(this);
  }
}

class Bank {
  a = new Account(100);
  b = new Account(0);

  constructor() { makeAutoObservable(this); }

  transfer(amount: number) {
    // Both mutations commit atomically — observers never see intermediate state
    this.a.balance -= amount;
    this.b.balance += amount;
  }
}

const bank = new Bank();
let renderCount = 0;

const Ledger = observer(() => {
  renderCount++;
  console.log("ledger render #" + renderCount + " A=" + bank.a.balance + " B=" + bank.b.balance);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <p>Account A: \${bank.a.balance}</p>
      <p>Account B: \${bank.b.balance}</p>
      <button onClick={() => bank.transfer(25)}>Transfer $25 A → B</button>
    </div>
  );
});

export default function App() { return <Ledger />; }`,
    validationLogic: (code) => ({
    success: code.includes("configure") && code.includes("enforceActions") && code.includes("observer("),
    message: "Actions batch mutations atomically — one render per action, even with multiple state changes.",
  }),
  },

  {
    title: "MobX 5: computed — Auto-Memoized Derivations",
    content: [
      "`computed` turns a getter into a **memoized derivation**: runs once, caches result, re-runs only when a tracked dependency changes.",
      "A filtered-todos derivation that logs once per relevant change, never on unrelated mutations.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The memoization contract",
      body: "`get foo()` declared via `computed` (or inferred by `makeAutoObservable`) runs lazily. If read 10 times, it runs once and returns the cache 9 times — **until** a dependency changes. Then it invalidates and re-runs on next read.",
      badges: ["lazy","cache"],
    },
    {
      tag: "concept",
      title: "Pure inputs only",
      body: "Computeds must be **pure** functions of observables. No side-effects, no `Date.now()`, no `fetch`. That's what makes memoization safe.",
      badges: ["pure"],
    },
    {
      tag: "tip",
      title: "computed vs useMemo",
      body: "`useMemo(fn, [deps])` needs you to name the deps. `computed` tracks them automatically. In React with observer, put heavy derivations on the store as computed — they're shared, cached, and auto-invalidated.",
      badges: ["React"],
    },
    {
      tag: "key-point",
      title: "Interview: computed inside observer",
      body: "Q: \"If I call `store.total` in 3 observer components, does it run 3 times?\" A: **No — once.** MobX memoizes across readers until invalidated. This is granular and cheap.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

interface Todo { id: number; text: string; done: boolean }

class TodoStore {
  todos: Todo[] = [
    { id: 1, text: "Buy milk", done: false },
    { id: 2, text: "Learn MobX", done: true },
    { id: 3, text: "Write tests", done: false },
  ];
  filter: "all" | "active" | "done" = "all";

  constructor() { makeAutoObservable(this); }

  // computed: auto-memoized, only re-runs when \`todos\` or \`filter\` changes
  get visible(): Todo[] {
    console.log("computing visible for filter=" + this.filter);
    if (this.filter === "all") return this.todos;
    return this.todos.filter(t => this.filter === "active" ? !t.done : t.done);
  }

  setFilter(f: "all" | "active" | "done") { this.filter = f; }
  toggle(id: number) {
    const t = this.todos.find(t => t.id === id);
    if (t) t.done = !t.done;
  }
}

const store = new TodoStore();

const Todos = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <div>
      {(["all", "active", "done"] as const).map(f => (
        <button key={f} onClick={() => store.setFilter(f)}
          style={{ fontWeight: store.filter === f ? "bold" : "normal", marginRight: 4 }}>
          {f}
        </button>
      ))}
    </div>
    <ul>{store.visible.map(t => (
      <li key={t.id} onClick={() => store.toggle(t.id)} style={{ textDecoration: t.done ? "line-through" : "none", cursor: "pointer" }}>
        {t.text}
      </li>
    ))}</ul>
  </div>
));

export default function App() { return <Todos />; }`,
    validationLogic: (code) => ({
    success: code.includes("get visible") && code.includes("makeAutoObservable"),
    message: "Computed derivations memoize — the filtered list only re-computes when todos or filter changes.",
  }),
  },

  {
    title: "MobX 6: autorun — Your First Reaction",
    content: [
      "`autorun(fn)` runs `fn` once immediately, tracks every observable it reads, and re-runs `fn` whenever any tracked observable changes. The simplest reaction in MobX.",
      "Use autorun for logging, analytics, and DOM side-effects outside React.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Immediate + reactive",
      body: "autorun fires **once** on creation (to learn dependencies) then on every relevant change. Returns a **disposer** — call it to stop the reaction.",
      code: `import { autorun } from 'mobx';
const stop = autorun(() => console.log('count:', counter.value));
// later:
stop();`,
      badges: ["autorun"],
    },
    {
      tag: "tip",
      title: "autorun vs observer",
      body: "`observer` is autorun for React components (the \"reaction\" is a re-render). `autorun` is for side-effects — logging, syncing to localStorage, pushing to analytics.",
      badges: ["observer"],
    },
    {
      tag: "key-point",
      title: "Don't forget disposal",
      body: "Every autorun holds references to observables. In a long-lived app, call the disposer on unmount. In React with `useEffect`, return the disposer.",
      badges: ["Interview","cleanup"],
    },
    ],
    defaultCode: `import React, { useEffect, useState } from "react";
import { makeAutoObservable, autorun } from "mobx";
import { observer } from "mobx-react-lite";

class Counter {
  value = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.value++; }
}

const counter = new Counter();

// Autorun for side-effect (logging)
const stopLog = autorun(() => {
  console.log("[autorun] count changed to " + counter.value);
});

const CounterUI = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <h3>Count: {counter.value}</h3>
    <button onClick={() => counter.inc()}>+1</button>
    <button onClick={() => counter.inc()}>+1 again</button>
  </div>
));

export default function App() {
  useEffect(() => stopLog, []);     // cleanup on unmount
  return <CounterUI />;
}`,
    validationLogic: (code) => ({
    success: code.includes("autorun(") && code.includes("observer("),
    message: "autorun for side-effects + observer for render — the two ways to react to observables.",
  }),
  },

  {
    title: "MobX 7: reaction vs autorun vs when",
    content: [
      "**`autorun`** re-runs on *any* dep change. **`reaction(data, effect)`** decouples tracking from effect: only the data fn's deps are tracked, and `effect` runs only when `data` returns a new value. **`when(pred, effect)`** runs `effect` **once** when `pred` becomes true.",
      "Pick the right primitive for each scenario — this is a common interview topic.",
    ],
    sections: [
    {
      tag: "concept",
      title: "reaction — tracked data, decoupled effect",
      body: "Use when you want to react to specific data, not every observable the effect reads. Example: save to server when user's email changes, but don't re-save when `lastLogin` updates.",
      badges: ["reaction"],
    },
    {
      tag: "concept",
      title: "when — one-shot on predicate",
      body: "`when(() => store.ready, () => store.load())` — runs load exactly once, the first time ready is true. Great for initialization gates.",
      badges: ["when"],
    },
    {
      tag: "key-point",
      title: "Decision matrix",
      body: "**autorun** = wide side-effect (logging). **reaction** = narrow, diffed side-effect (persist). **when** = one-time trigger (boot gate).",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, reaction, when, autorun } from "mobx";
import { observer } from "mobx-react-lite";

class AppStore {
  user = "";
  ready = false;
  loginCount = 0;

  constructor() { makeAutoObservable(this); }

  setUser(u: string) { this.user = u; this.ready = u !== ""; }
  login() { this.loginCount++; }
}

const store = new AppStore();

// autorun — logs EVERY observable read (user, loginCount)
autorun(() => console.log("[autorun] user=" + store.user + " logins=" + store.loginCount));

// reaction — only fires when user changes, ignores loginCount
reaction(
  () => store.user,
  (u) => console.log("[reaction] user changed to " + u),
);

// when — fires exactly once when ready becomes true
when(
  () => store.ready,
  () => console.log("[when] app is ready, initial boot done"),
);

store.login();          // autorun fires (count), reaction silent
store.setUser("ada");   // autorun fires, reaction fires, when fires
store.setUser("bob");   // autorun fires, reaction fires, when silent (already disposed)

const UI = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>User: {store.user || "-"}</p>
    <p>Logins: {store.loginCount}</p>
  </div>
));

export default function App() { return <UI />; }`,
    validationLogic: (code, logs) => ({
    success: code.includes("reaction(") && code.includes("when(") && code.includes("autorun("),
    message: "Three reaction primitives, three use-cases. Picking the right one is an interview signal.",
  }),
  },

  {
    title: "MobX 8: observable.box — Primitive Observables",
    content: [
      "`observable.box<T>(initial)` wraps a **primitive** (string, number, boolean) into an observable container with `.get()` / `.set()`.",
      "Useful for top-level primitives you don't want to nest inside an object.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why a box?",
      body: "`observable(5)` doesn't work — primitives are passed by value, so MobX can't track mutation. `observable.box(5)` creates an object container whose value is reactive.",
      badges: ["box"],
    },
    {
      tag: "tip",
      title: "Prefer class fields",
      body: "In practice, put primitives inside a class and use `makeAutoObservable`. `box` shines for module-level globals (feature flags, theme, etc.) that don't belong in any specific store.",
      badges: ["practical"],
    },
    ],
    defaultCode: `import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

// Global theme flag — lives outside any store
const theme = observable.box<"light" | "dark">("light");

const ThemeSwitcher = observer(() => (
  <div style={{
    padding: 20, minHeight: 80, fontFamily: "system-ui",
    background: theme.get() === "dark" ? "#222" : "#eee",
    color: theme.get() === "dark" ? "#eee" : "#222",
  }}>
    <p>Theme: {theme.get()}</p>
    <button onClick={() => theme.set(theme.get() === "light" ? "dark" : "light")}>
      Toggle
    </button>
  </div>
));

export default function App() { return <ThemeSwitcher />; }`,
    validationLogic: (code) => ({
    success: code.includes("observable.box"),
    message: "observable.box — reactive primitives without wrapping in a class.",
  }),
  },

  {
    title: "MobX 9: Deep vs Shallow vs Ref",
    content: [
      "By default `observable` is **deep** — nested objects/arrays become observable too. Use `observable.shallow` or `observable.ref` when you don't want that.",
      "Understand the three depths — deep, shallow, ref — and when to use each.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Deep (default)",
      body: "`observable({ user: { name: 'Ada' } })` — the outer object AND the inner `user` object are both tracked. Setting `obj.user.name = 'Bob'` notifies observers of `obj.user.name`.",
      badges: ["deep"],
    },
    {
      tag: "concept",
      title: "shallow",
      body: "`observable.shallow([])` — the array itself is tracked (adds/removes notify) but the items inside are not. Useful when items are immutable or large.",
      badges: ["shallow"],
    },
    {
      tag: "concept",
      title: "ref",
      body: "`observable.ref(obj)` — **only the reference** is tracked. Mutating `obj.foo` does NOT notify; you must re-assign the whole object. Great for immutable data/trees.",
      badges: ["ref"],
    },
    {
      tag: "key-point",
      title: "Interview: perf trade-offs",
      body: "Deep = easiest to use, most reactive overhead. Ref = cheapest, forces immutability discipline. Shallow = middle ground. Mention this when discussing performance tuning.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeObservable, observable, action } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  // deep: nested mutations tracked
  user = { name: "Ada", age: 30 };
  // ref: only reassignment tracked
  immutableConfig = { theme: "dark" };

  constructor() {
    makeObservable(this, {
      user:             observable,           // deep
      immutableConfig:  observable.ref,       // ref — mutating fields WON'T notify
      renameUser:       action,
      ageUp:            action,
      swapConfig:       action,
    });
  }

  renameUser(n: string) { this.user.name = n; }                     // notifies (deep)
  ageUp() { this.user.age++; }                                       // notifies (deep)
  swapConfig(c: { theme: string }) { this.immutableConfig = c; }     // notifies (ref re-assign)
}

const s = new Store();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>User: {s.user.name} (age {s.user.age})</p>
    <p>Theme: {s.immutableConfig.theme}</p>
    <button onClick={() => s.renameUser(s.user.name === "Ada" ? "Bob" : "Ada")}>Rename</button>
    <button onClick={() => s.ageUp()}>Age+1</button>
    <button onClick={() => s.swapConfig({ theme: s.immutableConfig.theme === "dark" ? "light" : "dark" })}>Swap Config</button>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({
    success: code.includes("observable.ref") && code.includes("observer("),
    message: "Deep, shallow, and ref — three reactivity depths, each with clear trade-offs.",
  }),
  },

  {
    title: "MobX 10: observable arrays, maps, and sets",
    content: [
      "MobX provides reactive **Arrays**, **Maps**, and **Sets** with the same API as their native counterparts — plus automatic tracking.",
      "Render a tag list backed by an observable Set so dedupe is free.",
    ],
    sections: [
    {
      tag: "concept",
      title: "observable.array vs observable.map",
      body: "Arrays suit ordered collections. Maps suit keyed lookups with O(1). Both are fully reactive — iteration, `.has()`, `.get()` all register dependencies.",
      badges: ["collection"],
    },
    {
      tag: "tip",
      title: "When to use Map over object",
      body: "Use `observable.map` when keys are dynamic strings/numbers. Observable objects are best when keys are known at class definition. Maps also fire a single change event for add/remove, making them cleaner for react-on-key-set patterns.",
      badges: ["practical"],
    },
    ],
    defaultCode: `import React, { useState } from "react";
import { makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";

class TagStore {
  tags = observable.set<string>();                // reactive Set
  counts = observable.map<string, number>();      // reactive Map: tag → uses

  constructor() { makeAutoObservable(this, { tags: false, counts: false }); }

  add(tag: string) {
    this.tags.add(tag);
    this.counts.set(tag, (this.counts.get(tag) ?? 0) + 1);
  }

  remove(tag: string) {
    this.tags.delete(tag);
    this.counts.delete(tag);
  }
}

const store = new TagStore();

const TagCloud = observer(() => {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h3>Tags ({store.tags.size})</h3>
      <ul>
        {Array.from(store.tags).map(t => (
          <li key={t}>
            {t} <small>({store.counts.get(t)} uses)</small>{" "}
            <button onClick={() => store.remove(t)}>×</button>
          </li>
        ))}
      </ul>
      <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="new tag" />
      <button onClick={() => { if (draft) { store.add(draft); setDraft(""); } }}>Add</button>
    </div>
  );
});

export default function App() { return <TagCloud />; }`,
    validationLogic: (code) => ({
    success: code.includes("observable.set") || code.includes("observable.map"),
    message: "observable Set/Map — reactive collections with native-like API.",
  }),
  },

  {
    title: "MobX 11: toJS — Serializing Observables",
    content: [
      "`toJS(obj)` recursively converts observable structures back to plain JS objects/arrays. Needed for JSON serialization, deep equality checks, and passing state outside MobX.",
      "Never `JSON.stringify(observable)` directly — use `toJS` first.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why toJS",
      body: "Observable proxies aren't perfectly equal to plain objects — some APIs (older serializers, diff libraries) fail. `toJS` returns the plain snapshot.",
      badges: ["serialize"],
    },
    {
      tag: "tip",
      title: "Performance note",
      body: "`toJS` allocates a new deep copy. Don't call it inside renders. Call once when you need to send state to a worker, persist, or log.",
      badges: ["perf"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, toJS } from "mobx";
import { observer } from "mobx-react-lite";

class Profile {
  name = "Ada";
  address = { city: "Paris", zip: "75000" };

  constructor() { makeAutoObservable(this); }

  updateCity(c: string) { this.address.city = c; }
}

const profile = new Profile();

const View = observer(() => {
  const snapshot = toJS(profile);    // plain object copy
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h3>Live view (observable proxy):</h3>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <h3>Serialized (toJS):</h3>
      <pre>{JSON.stringify(snapshot, null, 2)}</pre>
      <button onClick={() => profile.updateCity(profile.address.city === "Paris" ? "Lyon" : "Paris")}>
        Move
      </button>
    </div>
  );
});

export default function App() {
  console.log("toJS:", JSON.stringify(toJS(profile)));
  return <View />;
}`,
    validationLogic: (code) => ({
    success: code.includes("toJS"),
    message: "toJS — the serialization bridge between MobX proxies and plain JSON.",
  }),
  },

  {
    title: "MobX 12: The Derivation Graph",
    content: [
      "Under the hood, MobX builds a **dependency graph**: observables → computeds → reactions. A write invalidates only nodes downstream of it.",
      "Visualize the graph by reading computed chains and noting which fire on each mutation.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Lazy invalidation",
      body: "Writing an observable marks its dependents dirty. They don't recompute until read. Result: unused computed branches are *free*.",
      badges: ["lazy"],
    },
    {
      tag: "concept",
      title: "Re-running on change",
      body: "For reactions (autorun/observer), dirty = re-run scheduled. For computeds, dirty = recompute on next read. MobX's scheduler deduplicates within a single action.",
      badges: ["scheduler"],
    },
    {
      tag: "tip",
      title: "trace() for debugging",
      body: "`import { trace } from 'mobx'` — call inside a computed or observer with `trace(true)` to break into the debugger on next invalidation. Shows WHY it fired.",
      badges: ["debug"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, trace } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  a = 0; b = 0; c = 0;
  constructor() { makeAutoObservable(this); }

  get sum() {
    console.log("  [sum] re-computing");
    return this.a + this.b;            // depends on a, b — NOT c
  }
  get doubled() {
    console.log("  [doubled] re-computing");
    return this.sum * 2;
  }
}

const s = new Store();

console.log("— first read —");
console.log("doubled=" + s.doubled);    // runs sum + doubled

console.log("— read again (memoized) —");
console.log("doubled=" + s.doubled);    // both cached; no re-compute

console.log("— mutate c (not a dep of sum) —");
s.c = 99;
console.log("doubled=" + s.doubled);    // still cached!

console.log("— mutate a —");
s.a = 10;
console.log("doubled=" + s.doubled);    // sum + doubled re-run

const View = observer(() => <div style={{ padding: 20, fontFamily: "system-ui" }}>
  <p>a={s.a} b={s.b} c={s.c}</p>
  <p>sum={s.sum} doubled={s.doubled}</p>
  <button onClick={() => s.a++}>a++</button>{" "}
  <button onClick={() => s.c++}>c++ (not a dep)</button>
</div>);

export default function App() { return <View />; }`,
    validationLogic: (code, logs) => ({
    success: code.includes("get sum") && code.includes("get doubled"),
    message: "Lazy, memoized, graph-aware — only dirty branches recompute, and only when read.",
  }),
  },

  {
    title: "MobX 13: Transactions & Batching",
    content: [
      "Mutations inside an action are **batched**: observers fire once at the end, not per mutation. This is MobX's key performance trick.",
      "See `runInAction` wrap mutations inside async code where direct action decorators don't help.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Implicit batching",
      body: "Actions batch automatically. A method annotated `action` that does 100 mutations causes 1 re-render, not 100.",
      badges: ["batch"],
    },
    {
      tag: "concept",
      title: "runInAction for async continuation",
      body: "After `await`, you've left the action's synchronous body. Wrap the continuation in `runInAction(() => { ... })` so its mutations are still batched.",
      badges: ["async"],
    },
    {
      tag: "key-point",
      title: "Common mistake",
      body: "Awaiting inside a decorated action and mutating observables after the await: each mutation is unbatched and triggers enforceActions. Fix: wrap the continuation in `runInAction`.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction, configure } from "mobx";
import { observer } from "mobx-react-lite";

configure({ enforceActions: "always" });

class Store {
  loading = false;
  data: number[] = [];

  constructor() { makeAutoObservable(this); }

  async load() {
    this.loading = true;                          // sync portion — inside action
    const result = await new Promise<number[]>(r => setTimeout(() => r([1, 2, 3, 4, 5]), 300));
    // we're past an await now — must runInAction to mutate observables
    runInAction(() => {
      this.data = result;
      this.loading = false;
    });
  }
}

const store = new Store();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <button onClick={() => store.load()} disabled={store.loading}>
      {store.loading ? "Loading…" : "Load data"}
    </button>
    <ul>{store.data.map(n => <li key={n}>{n}</li>)}</ul>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({
    success: code.includes("runInAction") && code.includes("enforceActions"),
    message: "runInAction around post-await mutations — essential for async actions.",
  }),
  },

  {
    title: "MobX 14: configure — Strict Mode & Tuning",
    content: [
      "`configure` sets global MobX behavior: strictness, proxy policy, computed rules. In production apps, set these once at boot.",
      "Apply `enforceActions: 'always'` and `reactionRequiresObservable` so bugs are caught immediately.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The key flags",
      body: "**`enforceActions: 'always'`** — writes must be in actions. **`computedRequiresReaction`** — throws if a computed is read outside a reaction. **`reactionRequiresObservable`** — reactions must read at least one observable.",
      badges: ["strict"],
    },
    {
      tag: "tip",
      title: "`observableRequiresReaction` is too strict",
      body: "Don't enable `observableRequiresReaction: true` — it throws when reading observables outside any reaction, which makes plain console debugging painful.",
      badges: ["caution"],
    },
    ],
    defaultCode: `import React from "react";
import { configure, makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

configure({
  enforceActions: "always",
  computedRequiresReaction: false,       // keep off for simplicity
  reactionRequiresObservable: true,      // catch "empty" autoruns
  disableErrorBoundaries: false,
});

class Store {
  count = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.count++; }
}

const store = new Store();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>Count: {store.count}</p>
    <button onClick={() => store.inc()}>+1</button>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({
    success: code.includes("configure(") && code.includes("enforceActions"),
    message: "Strict mode at boot — every store gets the same safety rails.",
  }),
  },

  {
    title: "MobX 15: observer — the React Bridge",
    content: [
      "`observer(Component)` from `mobx-react-lite` wraps a function component in a reaction. Every observable it reads becomes a render dependency.",
      "Build a status badge that re-renders only when the specific field it reads changes.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Surgical re-renders",
      body: "If `StatusBadge` reads `store.online` and `UserName` reads `store.name`, mutating `online` re-renders only `StatusBadge`. React doesn't need memo — MobX tracks at the read site.",
      badges: ["granular"],
    },
    {
      tag: "tip",
      title: "observer + children",
      body: "`observer` and `React.memo` serve similar purposes. `observer` replaces memo in MobX apps — you don't need both.",
      badges: ["memo"],
    },
    {
      tag: "key-point",
      title: "Interview question",
      body: "\"Why is MobX faster than Redux for dashboards with many widgets?\" — each observer widget reads only its relevant observables; a state change fan-outs only to affected widgets. Redux + connect fires `mapStateToProps` for everyone and relies on shallow equality.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class UserStore {
  name = "Ada";
  online = true;

  constructor() { makeAutoObservable(this); }

  toggle() { this.online = !this.online; }
  rename(n: string) { this.name = n; }
}

const store = new UserStore();

// Each observer only re-renders when its own reads change
const UserName = observer(() => {
  console.log("[UserName] render");
  return <span style={{ fontWeight: "bold" }}>{store.name}</span>;
});

const StatusBadge = observer(() => {
  console.log("[StatusBadge] render");
  return <span style={{ color: store.online ? "green" : "gray", marginLeft: 8 }}>
    {store.online ? "● online" : "○ offline"}
  </span>;
});

const Card = () => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <UserName /><StatusBadge />
    <div style={{ marginTop: 12 }}>
      <button onClick={() => store.rename(store.name === "Ada" ? "Bob" : "Ada")}>Rename</button>
      <button onClick={() => store.toggle()} style={{ marginLeft: 8 }}>Toggle status</button>
    </div>
  </div>
);

export default function App() { return <Card />; }`,
    validationLogic: (code) => ({
    success: code.includes("observer(") && code.includes("mobx-react-lite"),
    message: "Surgical re-renders — each observer component depends only on what it reads.",
  }),
  },

  {
    title: "MobX 16: Local vs Global Observable State",
    content: [
      "Not every observable lives in a big store. **`useLocalObservable`** from mobx-react-lite creates a component-scoped observable that survives re-renders.",
      "Build a component-local counter — like `useState`, but with computed derivations baked in.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Local = lives with the component",
      body: "`useLocalObservable(() => ({ count: 0, get doubled() { return this.count * 2 }, inc() { this.count++ } }))` — returns a stable observable object. No `setState`, no re-render wiring.",
      badges: ["local"],
    },
    {
      tag: "tip",
      title: "When to go local",
      body: "Form state, UI toggles, component-only counters. Anything that doesn't need to outlive the component.",
      badges: ["practical"],
    },
    ],
    defaultCode: `import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";

const Timer = observer(() => {
  const state = useLocalObservable(() => ({
    seconds: 0,
    running: false,
    get display() { return \`\${this.seconds}s \${this.running ? "(running)" : "(paused)"}\`; },
    tick() { if (this.running) this.seconds++; },
    toggle() { this.running = !this.running; },
    reset() { this.seconds = 0; this.running = false; },
  }));

  React.useEffect(() => {
    const id = setInterval(() => state.tick(), 1000);
    return () => clearInterval(id);
  }, [state]);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h3>{state.display}</h3>
      <button onClick={() => state.toggle()}>{state.running ? "Pause" : "Start"}</button>
      <button onClick={() => state.reset()} style={{ marginLeft: 8 }}>Reset</button>
    </div>
  );
});

export default function App() { return <Timer />; }`,
    validationLogic: (code) => ({
    success: code.includes("useLocalObservable"),
    message: "Component-local observable state — the MobX replacement for useState/useReducer.",
  }),
  },

  {
    title: "MobX 17: Provider + Context Pattern",
    content: [
      "For app-wide stores, use React Context to make them injectable. Components consume via a typed `useStore()` hook — clean, test-friendly.",
      "Wire a RootStore through Context and consume it from a deeply nested component.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why Context",
      body: "Avoid global singletons. Context lets tests inject a fresh store per render, and lets Storybook showcase components in different states.",
      badges: ["inject"],
    },
    {
      tag: "tip",
      title: "One RootStore, many child stores",
      body: "`rootStore.user` / `rootStore.cart` / `rootStore.ui` — children can reference each other by holding a `root` ref. Pass `root` into each child constructor.",
      badges: ["architecture"],
    },
    ],
    defaultCode: `import React, { createContext, useContext } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class UserStore {
  name = "Ada";
  constructor() { makeAutoObservable(this); }
  rename(n: string) { this.name = n; }
}
class UIStore {
  darkMode = false;
  constructor() { makeAutoObservable(this); }
  toggle() { this.darkMode = !this.darkMode; }
}
class RootStore {
  user = new UserStore();
  ui = new UIStore();
}

const StoreContext = createContext<RootStore | null>(null);
const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be inside StoreProvider");
  return store;
};

const Header = observer(() => {
  const { user, ui } = useStore();
  return (
    <header style={{
      padding: 16,
      background: ui.darkMode ? "#111" : "#eee",
      color: ui.darkMode ? "#eee" : "#111",
    }}>
      Welcome, {user.name}{"  "}
      <button onClick={() => ui.toggle()}>Toggle theme</button>
    </header>
  );
});

const root = new RootStore();

export default function App() {
  return (
    <StoreContext.Provider value={root}>
      <Header />
    </StoreContext.Provider>
  );
}`,
    validationLogic: (code) => ({
    success: code.includes("createContext") && code.includes("useStore") && code.includes("RootStore"),
    message: "Provider + useStore — the clean way to inject MobX stores into a React tree.",
  }),
  },

  {
    title: "MobX 18: Controlled Forms with MobX",
    content: [
      "Forms are ideal for MobX: a single store holds field values + validation + submit state.",
      "Build a login form whose state lives in an observable class — zero useState.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Form as a store",
      body: "Each field is an observable. Validation is computed. Submit is an action. This scales better than hundreds of useState hooks across nested components.",
      badges: ["form"],
    },
    {
      tag: "tip",
      title: "Bind input value + onChange",
      body: "`<input value={form.email} onChange={e => form.setEmail(e.target.value)} />` — classic controlled pattern, backed by observable state.",
      badges: ["controlled"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class LoginForm {
  email = "";
  password = "";
  submitted = false;

  constructor() { makeAutoObservable(this); }

  setEmail(v: string) { this.email = v; }
  setPassword(v: string) { this.password = v; }

  get emailError(): string | null {
    if (!this.email) return "email required";
    if (!this.email.includes("@")) return "not a valid email";
    return null;
  }
  get passwordError(): string | null {
    if (this.password.length < 6) return "6+ chars";
    return null;
  }
  get isValid(): boolean { return !this.emailError && !this.passwordError; }

  submit() {
    if (!this.isValid) return;
    this.submitted = true;
    console.log("submitting", this.email);
  }
}

const form = new LoginForm();

const LoginView = observer(() => (
  <form onSubmit={(e) => { e.preventDefault(); form.submit(); }} style={{ padding: 20, fontFamily: "system-ui", maxWidth: 320 }}>
    <div style={{ marginBottom: 10 }}>
      <input placeholder="email" value={form.email} onChange={e => form.setEmail(e.target.value)} style={{ width: "100%" }} />
      {form.emailError && <small style={{ color: "red" }}>{form.emailError}</small>}
    </div>
    <div style={{ marginBottom: 10 }}>
      <input type="password" placeholder="password" value={form.password} onChange={e => form.setPassword(e.target.value)} style={{ width: "100%" }} />
      {form.passwordError && <small style={{ color: "red" }}>{form.passwordError}</small>}
    </div>
    <button disabled={!form.isValid}>Submit</button>
    {form.submitted && <p style={{ color: "green" }}>Submitted!</p>}
  </form>
));

export default function App() { return <LoginView />; }`,
    validationLogic: (code) => ({
    success: code.includes("makeAutoObservable") && code.includes("emailError") && code.includes("observer("),
    message: "Form state, validation, and submit — all in one observable class. Interview-ready.",
  }),
  },

  {
    title: "MobX 19: Async Data Fetching Store",
    content: [
      "Loading, data, and error — the three states of every async request. A store owns them and exposes computed helpers like `isLoading`, `hasError`, `items`.",
      "Build a search store that debounces requests and mutations under `runInAction`.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The async pattern",
      body: "`loading: boolean`, `data: T | null`, `error: string | null`. Actions: `load()` sets loading true, awaits, on success sets data in `runInAction`, on failure sets error.",
      badges: ["async"],
    },
    {
      tag: "tip",
      title: "Debounce in the caller",
      body: "The store shouldn't know about debouncing — that's a UI concern. Let the component debounce via `useEffect` or a `setTimeout`.",
      badges: ["separation"],
    },
    ],
    defaultCode: `import React, { useEffect, useState } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class SearchStore {
  query = "";
  results: string[] = [];
  loading = false;
  error: string | null = null;

  constructor() { makeAutoObservable(this); }

  setQuery(q: string) { this.query = q; }

  async search() {
    this.loading = true; this.error = null;
    try {
      const q = this.query;
      const data = await new Promise<string[]>(r =>
        setTimeout(() => r(q ? ["Result for " + q, "Another " + q] : []), 300)
      );
      runInAction(() => { this.results = data; });
    } catch (e: any) {
      runInAction(() => { this.error = String(e); });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}

const store = new SearchStore();

const Search = observer(() => {
  // debounce — component concern
  useEffect(() => {
    const id = setTimeout(() => store.search(), 250);
    return () => clearTimeout(id);
  }, [store.query]);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <input value={store.query} onChange={e => store.setQuery(e.target.value)} placeholder="Search…" />
      {store.loading && <span> loading…</span>}
      {store.error && <span style={{ color: "red" }}> {store.error}</span>}
      <ul>{store.results.map((r, i) => <li key={i}>{r}</li>)}</ul>
    </div>
  );
});

export default function App() { return <Search />; }`,
    validationLogic: (code) => ({
    success: code.includes("runInAction") && code.includes("loading") && code.includes("observer("),
    message: "Loading/data/error tri-state + async action — the canonical MobX fetching pattern.",
  }),
  },

  {
    title: "MobX 20: Optimistic UI with useOptimistic-style MobX",
    content: [
      "MobX is perfect for optimistic updates: mutate locally, send to server, rollback on failure.",
      "Build a toggle that optimistically flips, then restores on server error.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Optimistic flip with rollback",
      body: "In the action: capture previous value, mutate, await server. If error: restore previous value (in runInAction).",
      badges: ["optimistic"],
    },
    {
      tag: "tip",
      title: "Multiple concurrent operations",
      body: "Track a `pending` Set of IDs. UI shows spinner on pending items while letting others continue interactively.",
      badges: ["concurrency"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class Toggle {
  on = false;
  error: string | null = null;

  constructor() { makeAutoObservable(this); }

  async toggle() {
    const prev = this.on;
    this.on = !prev;                               // optimistic flip
    this.error = null;
    try {
      await new Promise((res, rej) => setTimeout(() => Math.random() > 0.5 ? res(null) : rej(new Error("server failed")), 400));
    } catch (e: any) {
      runInAction(() => {
        this.on = prev;                            // rollback
        this.error = e.message;
      });
    }
  }
}

const t = new Toggle();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>Status: {t.on ? "ON" : "OFF"}</p>
    {t.error && <p style={{ color: "red" }}>Error: {t.error}</p>}
    <button onClick={() => t.toggle()}>Toggle</button>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({
    success: code.includes("runInAction") && code.includes("const prev") && code.includes("observer("),
    message: "Optimistic UI + rollback on error — MobX makes it trivial.",
  }),
  },

  {
    title: "MobX 21: Granular Row Re-renders in Lists",
    content: [
      "A list of 1000 items where one changes should re-render only that one row. Key: wrap each row in `observer` and pass the item object directly.",
      "Build a list where clicking a row toggles its 'done' state and only that row re-renders.",
    ],
    sections: [
    {
      tag: "concept",
      title: "One observer per row",
      body: "Parent maps `items.map(i => <Row item={i} />)`. `Row = observer(({item}) => ...)`. Only the row whose item mutated re-renders. Parent renders once on add/remove.",
      badges: ["granular"],
    },
    {
      tag: "tip",
      title: "Avoid passing primitives from computed",
      body: "If you pass `done={item.done}` from parent, the parent reads `item.done` and re-renders on every change. Pass the whole `item` object; the row does the read.",
      badges: ["tracking"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Item {
  constructor(public id: number, public text: string, public done = false) {
    makeAutoObservable(this);
  }
  toggle() { this.done = !this.done; }
}

class ListStore {
  items: Item[] = [];
  constructor() {
    makeAutoObservable(this);
    for (let i = 1; i <= 5; i++) this.items.push(new Item(i, "Task " + i));
  }
}

const store = new ListStore();

const Row = observer(({ item }: { item: Item }) => {
  console.log("  Row " + item.id + " rendered");
  return (
    <li onClick={() => item.toggle()}
        style={{ cursor: "pointer", textDecoration: item.done ? "line-through" : "none" }}>
      {item.text}
    </li>
  );
});

const List = observer(() => {
  console.log("List rendered");
  return (
    <ul style={{ padding: 20, fontFamily: "system-ui" }}>
      {store.items.map(i => <Row key={i.id} item={i} />)}
    </ul>
  );
});

export default function App() { return <List />; }`,
    validationLogic: (code) => ({
    success: code.includes("observer(({ item }") || (code.includes("observer(") && code.includes("Row")),
    message: "Observer per row — MobX's signature performance win for big lists.",
  }),
  },

  {
    title: "MobX 22: Derived Stores — Cross-Store Composition",
    content: [
      "A derived store reads from other stores to produce a combined view. Example: `CheckoutStore` that depends on `CartStore` + `UserStore` + `ShippingStore`.",
      "Compose three domain stores into a checkout summary — all computed, no duplication.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Inject root into child",
      body: "Each domain store takes `root: RootStore` in constructor, stores the ref, and reads from siblings as needed. Enables cross-cutting computeds.",
      badges: ["architecture"],
    },
    {
      tag: "tip",
      title: "Avoid circular dependencies at init time",
      body: "Read from siblings inside methods/computeds, not in the constructor body. Constructor body runs before all siblings are attached.",
      badges: ["caution"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class CartStore {
  total = 0;
  constructor(root: any) { makeAutoObservable(this); }
}
class UserStore {
  discountTier: "none" | "gold" = "none";
  constructor(root: any) { makeAutoObservable(this); }
}
class CheckoutStore {
  constructor(private root: any) { makeAutoObservable(this); }

  get discountedTotal(): number {
    const base = this.root.cart.total;
    const pct = this.root.user.discountTier === "gold" ? 0.15 : 0;
    return base * (1 - pct);
  }
}
class RootStore {
  cart: CartStore;
  user: UserStore;
  checkout: CheckoutStore;
  constructor() {
    this.cart = new CartStore(this);
    this.user = new UserStore(this);
    this.checkout = new CheckoutStore(this);
  }
}

const root = new RootStore();
root.cart.total = 200;

const Summary = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>Tier: {root.user.discountTier}</p>
    <p>Cart total: \${root.cart.total}</p>
    <p>After discount: \${root.checkout.discountedTotal.toFixed(2)}</p>
    <button onClick={() => root.user.discountTier = root.user.discountTier === "gold" ? "none" : "gold"}>
      Toggle tier
    </button>
  </div>
));

export default function App() { return <Summary />; }`,
    validationLogic: (code) => ({
    success: code.includes("RootStore") && code.includes("discountedTotal") && code.includes("observer("),
    message: "Cross-store derivations via root injection — the right shape for large MobX apps.",
  }),
  },

  {
    title: "MobX 23: Lazy Initialization with onBecomeObserved",
    content: [
      "`onBecomeObserved` / `onBecomeUnobserved` fire when a specific observable starts/stops being watched. Perfect for lazy data loading.",
      "Load user data only when a component starts reading it, and stop polling when no one watches.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Demand-driven fetch",
      body: "`onBecomeObserved(store, 'user', () => store.loadUser())` — fires the first time any reaction reads `store.user`. Frees you from manual `useEffect(() => load(), [])` boilerplate.",
      badges: ["lazy"],
    },
    {
      tag: "tip",
      title: "Pair with onBecomeUnobserved",
      body: "Stop polling/websocket subscriptions when the last observer leaves. Saves CPU/network when screens are unmounted.",
      badges: ["cleanup"],
    },
    ],
    defaultCode: `import React, { useState } from "react";
import { makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class UserStore {
  user: { name: string } | null = null;
  loaded = false;

  constructor() {
    makeAutoObservable(this);
    onBecomeObserved(this, "user", () => {
      console.log("[lazy] someone is watching user — loading");
      this.load();
    });
    onBecomeUnobserved(this, "user", () => {
      console.log("[lazy] no one watching — could stop polling here");
    });
  }

  async load() {
    if (this.loaded) return;
    await new Promise(r => setTimeout(r, 300));
    runInAction(() => {
      this.user = { name: "Ada Lovelace" };
      this.loaded = true;
    });
  }
}

const store = new UserStore();

const UserCard = observer(() => {
  console.log("UserCard reading store.user");
  if (!store.user) return <p>Loading user…</p>;
  return <p>Hello, {store.user.name}!</p>;
});

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <button onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"} user</button>
      {show && <UserCard />}
    </div>
  );
}`,
    validationLogic: (code) => ({
    success: code.includes("onBecomeObserved") && code.includes("observer("),
    message: "Lazy load via onBecomeObserved — data loads only when a component cares.",
  }),
  },

  {
    title: "MobX 24: Disposers & Cleanup in React",
    content: [
      "Reactions hold references. In React, create reactions in `useEffect` and **return the disposer** so they clean up on unmount.",
      "See a useEffect + autorun pattern that avoids leaks.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The leak",
      body: "Forgetting to dispose an autorun keeps the closure alive as long as the store lives — prevents component GC and causes duplicate logs.",
      badges: ["leak"],
    },
    {
      tag: "tip",
      title: "useEffect + disposer",
      body: "`useEffect(() => autorun(fn), [])` — return value IS the cleanup. MobX's disposer fits React's effect contract perfectly.",
      badges: ["React"],
    },
    ],
    defaultCode: `import React, { useEffect, useState } from "react";
import { makeAutoObservable, autorun } from "mobx";
import { observer } from "mobx-react-lite";

class Counter {
  n = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.n++; }
}

const counter = new Counter();

const Logger = () => {
  useEffect(() => {
    const stop = autorun(() => console.log("[logger] n=" + counter.n));
    return stop;                         // returns disposer — autorun stops on unmount
  }, []);
  return <p>Logger mounted — open the console.</p>;
};

const Controls = observer(() => (
  <>
    <p>n = {counter.n}</p>
    <button onClick={() => counter.inc()}>+1</button>
  </>
));

export default function App() {
  const [mounted, setMounted] = useState(true);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Controls />
      {mounted && <Logger />}
      <button onClick={() => setMounted(m => !m)} style={{ marginTop: 8 }}>
        {mounted ? "Unmount" : "Mount"} Logger
      </button>
    </div>
  );
}`,
    validationLogic: (code) => ({
    success: code.includes("useEffect") && code.includes("autorun") && code.includes("return "),
    message: "useEffect + autorun + disposer return — leak-free reactions in React.",
  }),
  },

  {
    title: "MobX 25: LocalStorage Persistence via autorun",
    content: [
      "Persist store state with one autorun: serialize on every change. Rehydrate once on boot.",
      "A shopping cart that survives page reloads — no libraries, just MobX primitives.",
    ],
    sections: [
    {
      tag: "concept",
      title: "The pattern",
      body: "(1) Load from localStorage in constructor. (2) `autorun(() => localStorage.setItem('key', toJSON(this)))`. MobX handles re-runs efficiently; reactions are diffed by action boundary.",
      badges: ["persist"],
    },
    {
      tag: "tip",
      title: "Throttle heavy states",
      body: "For large state, wrap the autorun body in `reaction(() => toJS(this), (snap) => debouncedSave(snap))`. Saves I/O.",
      badges: ["perf"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, autorun, toJS } from "mobx";
import { observer } from "mobx-react-lite";

const KEY = "mobx-cart-demo";

class CartStore {
  items: { name: string; qty: number }[] = [];

  constructor() {
    makeAutoObservable(this);
    this.hydrate();
    autorun(() => {
      // Note: iframe localStorage may be sandboxed; guarded
      try { window.localStorage.setItem(KEY, JSON.stringify(toJS(this.items))); } catch {}
    });
  }

  hydrate() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) this.items = JSON.parse(raw);
    } catch {}
  }

  add(name: string) {
    const existing = this.items.find(i => i.name === name);
    if (existing) existing.qty++;
    else this.items.push({ name, qty: 1 });
  }
  clear() { this.items = []; }
}

const cart = new CartStore();

const CartView = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <h3>Persistent Cart</h3>
    <ul>{cart.items.map((i, k) => <li key={k}>{i.name} ×{i.qty}</li>)}</ul>
    <button onClick={() => cart.add("Apple")}>+ Apple</button>
    <button onClick={() => cart.add("Bread")} style={{ marginLeft: 4 }}>+ Bread</button>
    <button onClick={() => cart.clear()} style={{ marginLeft: 4 }}>Clear</button>
  </div>
));

export default function App() { return <CartView />; }`,
    validationLogic: (code) => ({
    success: code.includes("localStorage") && code.includes("autorun") && code.includes("toJS"),
    message: "LocalStorage persistence via autorun — two lines for durable state.",
  }),
  },

  {
    title: "MobX 26: Debounced Search with MobX + React",
    content: [
      "Debouncing a query is a two-layer concern: store owns the query and results; UI owns the debounce timer.",
      "Keep the store pure; put the timer in a `useEffect`.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Separation of concerns",
      body: "Store knows about data; component knows about timing. Keeps the store unit-testable without fake timers.",
    },
    {
      tag: "tip",
      title: "AbortController for cancelation",
      body: "Cancel in-flight fetches when the query changes again — avoids a late response overwriting a newer one.",
    },
    ],
    defaultCode: `import React, { useEffect } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class SearchStore {
  q = ""; results: string[] = []; loading = false;
  private controller: AbortController | null = null;
  constructor() { makeAutoObservable(this, { controller: false } as any); }
  setQuery(q: string) { this.q = q; }
  async run() {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const mine = this.controller;
    this.loading = true;
    try {
      const data = await new Promise<string[]>((res, rej) => {
        const t = setTimeout(() => res(this.q ? [this.q + "-alpha", this.q + "-beta"] : []), 300);
        mine.signal.addEventListener("abort", () => { clearTimeout(t); rej(new Error("aborted")); });
      });
      runInAction(() => { this.results = data; });
    } catch (e: any) {
      if (e.message !== "aborted") console.log("error:", e.message);
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}

const store = new SearchStore();

const SearchBox = observer(() => {
  useEffect(() => { const id = setTimeout(() => store.run(), 250); return () => clearTimeout(id); }, [store.q]);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <input value={store.q} onChange={e => store.setQuery(e.target.value)} placeholder="Type fast…" />
      {store.loading && <span> …loading</span>}
      <ul>{store.results.map((r, k) => <li key={k}>{r}</li>)}</ul>
    </div>
  );
});

export default function App() { return <SearchBox />; }`,
    validationLogic: (code) => ({ success: code.includes("AbortController") && code.includes("runInAction"), message: "Debounce in the component, cancel in the store — robust under rapid typing." }),
  },

  {
    title: "MobX 27: Pagination Store",
    content: [
      "Pagination needs page number + page size + total + fetched items. A small computed reveals last page.",
      "Build a pager with next/prev and disable buttons at boundaries via computed.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Core fields",
      body: "`page`, `pageSize`, `total`, `items`. `totalPages = Math.ceil(total / pageSize)`. `canNext = page < totalPages - 1`.",
    },
    {
      tag: "tip",
      title: "Cache pages",
      body: "Cache `items` by page in an observable.map. Moving back to a visited page is instant.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class Pager {
  page = 0; pageSize = 10; total = 100;
  items: number[] = []; loading = false;
  constructor() { makeAutoObservable(this); this.load(); }

  get totalPages() { return Math.ceil(this.total / this.pageSize); }
  get canNext() { return this.page < this.totalPages - 1; }
  get canPrev() { return this.page > 0; }

  async load() {
    this.loading = true;
    const p = this.page, size = this.pageSize;
    const data = await new Promise<number[]>(r =>
      setTimeout(() => r(Array.from({ length: size }, (_, i) => p * size + i + 1)), 200)
    );
    runInAction(() => { this.items = data; this.loading = false; });
  }

  next() { if (this.canNext) { this.page++; this.load(); } }
  prev() { if (this.canPrev) { this.page--; this.load(); } }
}

const pager = new Pager();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>Page {pager.page + 1} of {pager.totalPages} {pager.loading && "…"}</p>
    <ul>{pager.items.map(n => <li key={n}>Item #{n}</li>)}</ul>
    <button onClick={() => pager.prev()} disabled={!pager.canPrev}>◀ Prev</button>{" "}
    <button onClick={() => pager.next()} disabled={!pager.canNext}>Next ▶</button>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({ success: code.includes("totalPages") && code.includes("runInAction"), message: "Computed boundaries + load-on-navigate = paginated UIs in 30 lines." }),
  },

  {
    title: "MobX 28: Infinite Scroll",
    content: [
      "Instead of pages, append. `hasMore` boolean + `loadMore()` action + IntersectionObserver on a sentinel.",
      "The store doesn't know about the observer — UI triggers `loadMore` when the sentinel is visible.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Append vs replace",
      body: "For infinite scroll: concat the new page to items. For pagination: replace.",
    },
    {
      tag: "tip",
      title: "Guard against double-fire",
      body: "`if (this.loading) return;` at the top of loadMore — IntersectionObserver can fire multiple times during momentum scroll.",
    },
    ],
    defaultCode: `import React, { useEffect, useRef } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class Feed {
  items: number[] = []; page = 0; hasMore = true; loading = false;
  constructor() { makeAutoObservable(this); this.loadMore(); }
  async loadMore() {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    const data = await new Promise<number[]>(r =>
      setTimeout(() => r(Array.from({ length: 10 }, (_, i) => this.page * 10 + i + 1)), 250)
    );
    runInAction(() => {
      this.items.push(...data);
      this.page++;
      if (this.page >= 3) this.hasMore = false;
      this.loading = false;
    });
  }
}

const feed = new Feed();

const View = observer(() => {
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) feed.loadMore();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui", maxHeight: 320, overflow: "auto" }}>
      <ul>{feed.items.map(n => <li key={n}>Item #{n}</li>)}</ul>
      {feed.hasMore && <div ref={sentinel} style={{ padding: 16, textAlign: "center" }}>{feed.loading ? "Loading…" : "Scroll for more"}</div>}
      {!feed.hasMore && <p>End.</p>}
    </div>
  );
});

export default function App() { return <View />; }`,
    validationLogic: (code) => ({ success: code.includes("IntersectionObserver") && code.includes("loadMore"), message: "Infinite scroll — store owns state; component owns DOM observation." }),
  },

  {
    title: "MobX 29: Form Wizard with Per-Step Validation",
    content: [
      "Multi-step form: a `step` observable + computed validation per step.",
      "`canGoNext` is a computed — button state updates automatically as fields fill in.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Step-gated navigation",
      body: "`canGoNext` reads fields for the current step. Each step has its own validation.",
    },
    {
      tag: "tip",
      title: "Wrap steps in keys",
      body: "Use React keys on step containers so internal local state resets between steps.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Wizard {
  step = 0; name = ""; email = ""; agree = false;
  constructor() { makeAutoObservable(this); }
  get canGoNext() {
    if (this.step === 0) return this.name.trim().length > 0;
    if (this.step === 1) return this.email.includes("@");
    if (this.step === 2) return this.agree;
    return false;
  }
  next() { if (this.canGoNext && this.step < 2) this.step++; }
  prev() { if (this.step > 0) this.step--; }
}

const w = new Wizard();

const Wz = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui", maxWidth: 360 }}>
    <h3>Step {w.step + 1} of 3</h3>
    {w.step === 0 && <input placeholder="your name" value={w.name} onChange={e => w.name = e.target.value} />}
    {w.step === 1 && <input placeholder="email" value={w.email} onChange={e => w.email = e.target.value} />}
    {w.step === 2 && (
      <label><input type="checkbox" checked={w.agree} onChange={e => w.agree = e.target.checked} /> I agree</label>
    )}
    <div style={{ marginTop: 12 }}>
      <button onClick={() => w.prev()} disabled={w.step === 0}>Back</button>{" "}
      <button onClick={() => w.next()} disabled={!w.canGoNext}>
        {w.step === 2 ? "Finish" : "Next"}
      </button>
    </div>
  </div>
));

export default function App() { return <Wz />; }`,
    validationLogic: (code) => ({ success: code.includes("canGoNext") && code.includes("makeAutoObservable"), message: "Per-step validation via computed — wizard UX without ceremony." }),
  },

  {
    title: "MobX 30: Undo/Redo Stack",
    content: [
      "Keep a history of snapshots; push on each action, pop on undo.",
      "Because observables are mutable, capture via `toJS` before each push.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Snapshot vs command",
      body: "Snapshot = serialize full state. Command = record inverse operation. Snapshots are simpler; commands are smaller.",
    },
    {
      tag: "tip",
      title: "Cap the stack size",
      body: "Keep last N snapshots. Unbounded history → memory leak.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, toJS } from "mobx";
import { observer } from "mobx-react-lite";

class TextEditor {
  value = "";
  history: string[] = [];
  future: string[] = [];
  constructor() { makeAutoObservable(this); }

  set(next: string) {
    this.history.push(this.value);
    if (this.history.length > 50) this.history.shift();
    this.future = [];
    this.value = next;
  }
  undo() {
    const prev = this.history.pop();
    if (prev !== undefined) { this.future.push(this.value); this.value = prev; }
  }
  redo() {
    const next = this.future.pop();
    if (next !== undefined) { this.history.push(this.value); this.value = next; }
  }
}

const ed = new TextEditor();

const Ed = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <textarea rows={4} cols={40} value={ed.value} onChange={e => ed.set(e.target.value)} />
    <div>
      <button onClick={() => ed.undo()} disabled={ed.history.length === 0}>Undo</button>{" "}
      <button onClick={() => ed.redo()} disabled={ed.future.length === 0}>Redo</button>
      <small> (history: {ed.history.length}, future: {ed.future.length})</small>
    </div>
  </div>
));

export default function App() { return <Ed />; }`,
    validationLogic: (code) => ({ success: code.includes("history") && code.includes("undo"), message: "Undo/redo via snapshot stack — ergonomic with MobX's mutation model." }),
  },

  {
    title: "MobX 31: Toast Notification Service",
    content: [
      "A global `ToastStore` with an `observable.array`; push/auto-dismiss via setTimeout.",
      "Any store/component can `toasts.push({ message, type })`; UI lives elsewhere.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Service pattern",
      body: "Cross-cutting services (toasts, modals, auth) are stores too. Expose via Context.",
    },
    {
      tag: "tip",
      title: "Auto-dismiss",
      body: "On push, schedule a `setTimeout(() => remove(id), ms)`. Store the timer so `dismiss()` can cancel early.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

interface Toast { id: number; message: string; type: "info" | "error" }

class ToastStore {
  items: Toast[] = [];
  private nextId = 1;
  constructor() { makeAutoObservable(this); }
  push(t: Omit<Toast, "id">) {
    const id = this.nextId++;
    this.items.push({ id, ...t });
    setTimeout(() => this.dismiss(id), 3000);
  }
  dismiss(id: number) { this.items = this.items.filter(t => t.id !== id); }
}

const toasts = new ToastStore();

const ToastList = observer(() => (
  <div style={{ position: "fixed", bottom: 20, right: 20 }}>
    {toasts.items.map(t => (
      <div key={t.id} style={{
        padding: "10px 14px", marginTop: 6, borderRadius: 6,
        background: t.type === "error" ? "#fee" : "#eef",
        border: "1px solid " + (t.type === "error" ? "#f99" : "#99f"),
      }}>{t.message}</div>
    ))}
  </div>
));

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui", minHeight: 200 }}>
      <button onClick={() => toasts.push({ message: "Saved!", type: "info" })}>Show info toast</button>
      <button onClick={() => toasts.push({ message: "Oops, failed", type: "error" })} style={{ marginLeft: 8 }}>Show error</button>
      <ToastList />
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("ToastStore") && code.includes("dismiss"), message: "Toast service — one store, many consumers, auto-dismiss timers." }),
  },

  {
    title: "MobX 32: Modal Manager",
    content: [
      "Same pattern as toasts: a `ModalStore` owns `open: Modal | null` and `open()/close()` actions.",
      "Typed modal kind discriminator keeps open/close type-safe.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Single open modal at a time",
      body: "Most apps want one modal at a time — `open` is a single slot, not an array.",
    },
    {
      tag: "tip",
      title: "Callbacks via promises",
      body: "`openConfirm(msg): Promise<boolean>` — return a promise that resolves on close. Great ergonomics for confirms.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

type Modal = { kind: "confirm"; message: string; resolve: (ok: boolean) => void };

class ModalStore {
  current: Modal | null = null;
  constructor() { makeAutoObservable(this); }
  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => { this.current = { kind: "confirm", message, resolve }; });
  }
  resolve(ok: boolean) {
    if (this.current?.kind === "confirm") this.current.resolve(ok);
    this.current = null;
  }
}

const modals = new ModalStore();

const Root = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <button onClick={async () => {
      const ok = await modals.confirm("Delete this file?");
      console.log("user said", ok);
    }}>Delete</button>
    {modals.current?.kind === "confirm" && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
          <p>{modals.current.message}</p>
          <button onClick={() => modals.resolve(true)}>OK</button>
          <button onClick={() => modals.resolve(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </div>
    )}
  </div>
));

export default function App() { return <Root />; }`,
    validationLogic: (code) => ({ success: code.includes("ModalStore") && code.includes("resolve"), message: "Promise-based modal — clean async UX without callback hell." }),
  },

  {
    title: "MobX 33: Authentication Store",
    content: [
      "Auth store with `user`, `loading`, and computed `isLoggedIn`.",
      "Actions for `login/logout`. Keep token in memory only; sync to localStorage if needed.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Auth as a store",
      body: "Observer components derive their behavior from `isLoggedIn`. Routing guards read the same observable.",
    },
    {
      tag: "tip",
      title: "Never keep JWT in a Proxy",
      body: "Tokens should be in a non-observable field (`{}` outside makeAutoObservable) — reduces surface for accidental subscriptions.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class AuthStore {
  user: { name: string; email: string } | null = null;
  loading = false;
  private token: string | null = null;

  constructor() { makeAutoObservable(this, { token: false } as any); }

  get isLoggedIn() { return this.user !== null; }

  async login(email: string, password: string) {
    this.loading = true;
    try {
      await new Promise(r => setTimeout(r, 300));
      if (password !== "secret") throw new Error("bad creds");
      runInAction(() => {
        this.user = { name: email.split("@")[0], email };
        this.token = "fake-jwt-token";
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => { this.loading = false; });
      throw e;
    }
  }

  logout() { this.user = null; this.token = null; }
}

const auth = new AuthStore();

const App_ = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    {auth.isLoggedIn
      ? <><p>Hello, {auth.user!.name}!</p><button onClick={() => auth.logout()}>Logout</button></>
      : <>
          <p>Not logged in{auth.loading && "…loading"}</p>
          <button onClick={() => auth.login("ada@lab.io", "secret").catch(e => alert(e.message))}>Login</button>
        </>}
  </div>
));

export default function App() { return <App_ />; }`,
    validationLogic: (code) => ({ success: code.includes("isLoggedIn") && code.includes("runInAction"), message: "Auth store with computed isLoggedIn — the single source of truth for routing guards." }),
  },

  {
    title: "MobX 34: Router-Like State with History",
    content: [
      "Route is a store field. Back-forward is a stack. Integrates with URL via popstate.",
      "Push the current route into history on navigate; pop on back.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Route as state",
      body: "Don't treat URL as special — it's just another observable. React to it like any other.",
    },
    {
      tag: "tip",
      title: "Sync to window.location",
      body: "Use `autorun(() => history.pushState({}, '', router.path))` to keep the browser URL in sync.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Router {
  path = "/";
  history: string[] = [];
  constructor() { makeAutoObservable(this); }
  navigate(to: string) { this.history.push(this.path); this.path = to; }
  back() { const prev = this.history.pop(); if (prev) this.path = prev; }
}

const router = new Router();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <nav>
      <button onClick={() => router.navigate("/")}>Home</button>{" "}
      <button onClick={() => router.navigate("/about")}>About</button>{" "}
      <button onClick={() => router.back()} disabled={router.history.length === 0}>◀ Back</button>
    </nav>
    <hr />
    {router.path === "/" && <h3>Home</h3>}
    {router.path === "/about" && <h3>About</h3>}
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({ success: code.includes("Router") && code.includes("navigate"), message: "Route as observable — MobX makes custom routers trivial." }),
  },

  {
    title: "MobX 35: Derived Selectors (Computed Composition)",
    content: [
      "Express domain queries as chained computeds; each layer is memoized independently.",
      "Filter → sort → paginate — three computeds, each cheap to re-read.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Layered memoization",
      body: "`filtered` depends on `items, filter`. `sorted` depends on `filtered, sortBy`. `page` depends on `sorted, page`. Changing `page` only re-runs `page`.",
    },
    {
      tag: "tip",
      title: "Readable > clever",
      body: "Write the chain naturally; trust MobX to cache. Premature flattening makes code harder to reason about.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

interface User { name: string; age: number; active: boolean }

class Users {
  items: User[] = [
    { name: "Ada", age: 31, active: true },
    { name: "Bob", age: 45, active: false },
    { name: "Cat", age: 28, active: true },
    { name: "Dan", age: 52, active: true },
  ];
  sortBy: "name" | "age" = "name";
  onlyActive = true;
  page = 0; size = 2;
  constructor() { makeAutoObservable(this); }

  get filtered() { return this.onlyActive ? this.items.filter(i => i.active) : this.items; }
  get sorted() {
    return [...this.filtered].sort((a, b) => this.sortBy === "name" ? a.name.localeCompare(b.name) : a.age - b.age);
  }
  get paged() { return this.sorted.slice(this.page * this.size, (this.page + 1) * this.size); }
  get pages() { return Math.ceil(this.sorted.length / this.size); }
}

const u = new Users();

const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <label><input type="checkbox" checked={u.onlyActive} onChange={e => u.onlyActive = e.target.checked} /> only active</label>{" | "}
    <label>sort:<select value={u.sortBy} onChange={e => u.sortBy = e.target.value as any}>
      <option value="name">name</option><option value="age">age</option>
    </select></label>
    <ul>{u.paged.map(i => <li key={i.name}>{i.name} (age {i.age})</li>)}</ul>
    <button onClick={() => u.page = Math.max(0, u.page - 1)} disabled={u.page === 0}>◀</button>
    Page {u.page + 1} / {u.pages}
    <button onClick={() => u.page = Math.min(u.pages - 1, u.page + 1)} disabled={u.page >= u.pages - 1}>▶</button>
  </div>
));

export default function App() { return <View />; }`,
    validationLogic: (code) => ({ success: code.includes("filtered") && code.includes("sorted") && code.includes("paged"), message: "Chained computeds = layered memoization — each change re-computes the minimum." }),
  },

  {
    title: "MobX 36: Computed Structural Equality",
    content: [
      "By default, computeds compare with `===`. `computed.struct` (or `comparer.structural`) does a deep equal — avoids re-fires when arrays/objects are rebuilt with same content.",
      "Essential when a filter/map returns a new array with same items.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Structural vs reference",
      body: "`[1,2] === [1,2]` is false. `computed.struct` says 'equal enough — don't notify downstream'. Saves renders.",
    },
    {
      tag: "tip",
      title: "Default comparer",
      body: "Use default (referential) for simple computeds. Add `struct` when you see wasted renders caused by derivations returning new arrays.",
    },
    ],
    defaultCode: `import React from "react";
import { makeObservable, observable, computed, comparer } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  a = 1; b = 2;
  constructor() {
    makeObservable(this, {
      a: observable,
      b: observable,
      asArray: computed({ equals: comparer.structural }),  // structural equality
    });
  }
  get asArray() { return [this.a, this.b]; }
}

const s = new Store();

let downstreamCalls = 0;
const View = observer(() => {
  downstreamCalls++;
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <p>array: [{s.asArray.join(",")}]</p>
      <p>render # {downstreamCalls}</p>
      <button onClick={() => s.a = s.a}>reassign a (same value)</button>
      <button onClick={() => { s.a = s.a + 1; s.a = s.a - 1; }} style={{ marginLeft: 8 }}>
        bump and revert
      </button>
    </div>
  );
});

export default function App() { return <View />; }`,
    validationLogic: (code) => ({ success: code.includes("computed.struct") && code.includes("comparer.structural"), message: "Structural equality — stops cascading re-renders when derived arrays are rebuilt with same content." }),
  },

  {
    title: "MobX 37: keepAlive Computed",
    content: [
      "By default, a computed with no observers is torn down and recomputed from scratch on next read. `keepAlive: true` forces it to retain cache indefinitely.",
      "Use for expensive computeds that would otherwise thrash.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Normal lifecycle",
      body: "Computed is created on first read in a reaction, retained while observed, torn down when unobserved.",
    },
    {
      tag: "tip",
      title: "Memory cost",
      body: "`keepAlive` holds references — beware of memory. Use only when recompute cost vastly outweighs memory cost.",
    },
    ],
    defaultCode: `import React, { useState } from "react";
import { makeObservable, observable, computed } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  n = 5;
  calls = 0;
  constructor() {
    makeObservable(this, {
      n: observable,
      calls: observable,
      square: computed({ keepAlive: true }),
    });
  }
  get square(): number {
    this.calls++;
    console.log("square computed, total calls:", this.calls);
    return this.n * this.n;
  }
}

const s = new Store();

const View = observer(() => (
  <p style={{ fontFamily: "system-ui" }}>
    {s.n}² = {s.square} (computed calls so far: {s.calls})
  </p>
));

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      {show && <View />}
      <button onClick={() => setShow(v => !v)}>Mount/Unmount view</button>{" "}
      <button onClick={() => s.n++}>n++</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("keepAlive"), message: "keepAlive — trade memory for skip-recompute. Use sparingly." }),
  },

  {
    title: "MobX 38: spy() — MobX's Event Stream",
    content: [
      "`spy(handler)` is a global event stream: every action, reaction, observable change emits an event. Build custom devtools on top.",
      "Great for logging in dev mode; off in prod.",
    ],
    sections: [
    {
      tag: "concept",
      title: "One handler, all events",
      body: "spy emits action fire, reaction run, observable update. Filter by event type.",
    },
    {
      tag: "tip",
      title: "Dev-only",
      body: "`if (process.env.NODE_ENV !== 'production') spy(fn)` — avoid hot-path overhead in prod.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, spy } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  n = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.n++; }
}

const store = new Store();

const stopSpy = spy(ev => {
  if (ev.type === "action") console.log("[spy] action:", ev.name);
  if (ev.type === "update") console.log("[spy] update:", ev.debugObjectName);
});

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>n = {store.n}</p>
    <button onClick={() => store.inc()}>+1</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("spy("), message: "spy — build your own mini devtools by listening to every MobX event." }),
  },

  {
    title: "MobX 39: trace() for Targeted Debugging",
    content: [
      "`trace(store, 'field')` inside a reaction prints WHY the reaction re-fires. Invaluable for 'why is this running?' debugging.",
      "Trace a computed to see which observable invalidated it.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Breakpoint on next fire",
      body: "`trace(true)` — debugger pauses on next re-invocation. Ideal in Chrome DevTools.",
    },
    {
      tag: "tip",
      title: "Use in developing, remove in PRs",
      body: "trace() is verbose. Don't commit unless it's behind an env flag.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, trace } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  a = 0; b = 0;
  constructor() { makeAutoObservable(this); }
  get sum() {
    trace();                      // prints dep changes to console
    return this.a + this.b;
  }
}

const s = new Store();

const V = observer(() => <div style={{ padding: 20, fontFamily: "system-ui" }}>
  <p>a={s.a} b={s.b} sum={s.sum}</p>
  <button onClick={() => s.a++}>a++</button>{" "}
  <button onClick={() => s.b++}>b++</button>
</div>);

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("trace("), message: "trace() — the first tool to reach for when a reaction fires unexpectedly." }),
  },

  {
    title: "MobX 40: mobx-logger Alternative",
    content: [
      "Minimal pattern: an autorun spying on a store prints mutations to the console — poor man's devtools.",
      "Wrap autorun in a small helper to reuse across stores.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Roll your own",
      body: "Use `spy` or a plain `autorun(() => console.log(toJS(store)))` for ad-hoc debugging.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, autorun, toJS } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  items: string[] = [];
  constructor() { makeAutoObservable(this); }
  add(x: string) { this.items.push(x); }
}

const store = new Store();

function logStore(name: string, s: object) {
  return autorun(() => console.log("[" + name + "]", toJS(s)));
}

logStore("Store", store);

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>{store.items.join(", ") || "(empty)"}</p>
    <button onClick={() => store.add("item-" + (store.items.length + 1))}>Add</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("autorun") && code.includes("toJS"), message: "Roll your own logger in 3 lines — good enough for most day-to-day debugging." }),
  },

  {
    title: "MobX 41: Running Multiple Stores in React",
    content: [
      "Pattern: one React Provider with a RootStore that contains all domain stores.",
      "Each component consumes the relevant slice via `useStore()`.",
    ],
    sections: [
    {
      tag: "concept",
      title: "One Provider, many slices",
      body: "Avoid nested contexts. Single root + destructure in consumers.",
    },
    {
      tag: "tip",
      title: "Lazy store creation",
      body: "Instantiate stores on first access if cold-start matters. Usually overkill.",
    },
    ],
    defaultCode: `import React, { createContext, useContext } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class UserStore { name = "Ada"; constructor() { makeAutoObservable(this); } rename(n: string) { this.name = n; } }
class UIStore { dark = false; constructor() { makeAutoObservable(this); } toggle() { this.dark = !this.dark; } }
class RootStore { user = new UserStore(); ui = new UIStore(); }

const Ctx = createContext<RootStore | null>(null);
const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("no store");
  return s;
};

const Name = observer(() => <p>Name: {useStore().user.name}</p>);
const Toggle = observer(() => {
  const s = useStore();
  return <button onClick={() => s.ui.toggle()}>{s.ui.dark ? "☀" : "☾"} Theme</button>;
});

const root = new RootStore();
export default function App() {
  return <Ctx.Provider value={root}>
    <div style={{ padding: 20, fontFamily: "system-ui", background: root.ui.dark ? "#111" : "#fff", color: root.ui.dark ? "#fff" : "#111" }}>
      <Name /><Toggle />
    </div>
  </Ctx.Provider>;
}`,
    validationLogic: (code) => ({ success: code.includes("RootStore") && code.includes("useStore"), message: "One RootStore, many slices — clean Provider/Context pattern at scale." }),
  },

  {
    title: "MobX 42: Custom useStore Hook with Types",
    content: [
      "Strongly-typed `useStore()` avoids repetitive generics at call sites.",
      "Bonus: a `useCartStore()` shorthand hides navigation into the root.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Per-domain shortcuts",
      body: "`useCartStore()` = `useStore().cart`. Tiny helpers, huge DX gain.",
    },
    {
      tag: "tip",
      title: "Type safety end-to-end",
      body: "Declaring `Ctx` with the RootStore type flows types into every consumer.",
    },
    ],
    defaultCode: `import React, { createContext, useContext } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class CartStore { items = 0; constructor() { makeAutoObservable(this); } add() { this.items++; } }
class RootStore { cart = new CartStore(); }

const root = new RootStore();
const Ctx = createContext<RootStore>(root);
const useStore = () => useContext(Ctx);
const useCart = () => useStore().cart;

const CartBadge = observer(() => <span>Cart: {useCart().items}</span>);
const AddBtn = () => <button onClick={() => useCart().add()}>Add</button>;

export default function App() {
  return <Ctx.Provider value={root}>
    <div style={{ padding: 20, fontFamily: "system-ui" }}><CartBadge /> <AddBtn /></div>
  </Ctx.Provider>;
}`,
    validationLogic: (code) => ({ success: code.includes("useCart") && code.includes("createContext"), message: "Typed, per-domain hooks — ergonomic access without boilerplate at every call site." }),
  },

  {
    title: "MobX 43: TypeScript Patterns with MobX",
    content: [
      "Annotate observables as typed class fields; let `makeAutoObservable` do the rest.",
      "Pay attention to `private` fields — they're NOT made observable with makeAutoObservable.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Private = non-observable",
      body: "Use `private` for internal plumbing. `makeAutoObservable` ignores private fields by default (in newer versions).",
    },
    {
      tag: "tip",
      title: "Discriminated unions for state",
      body: "`type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; msg: string }` — TS narrows in observer code.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success"; data: string } | { kind: "error"; msg: string };

class FetchStore {
  status: Status = { kind: "idle" };
  constructor() { makeAutoObservable(this); }

  async fetch() {
    this.status = { kind: "loading" };
    try {
      const data = await new Promise<string>(r => setTimeout(() => r("hello"), 250));
      runInAction(() => { this.status = { kind: "success", data }; });
    } catch (e: any) {
      runInAction(() => { this.status = { kind: "error", msg: e.message }; });
    }
  }
}

const s = new FetchStore();

const V = observer(() => {
  switch (s.status.kind) {
    case "idle":    return <button onClick={() => s.fetch()}>Start</button>;
    case "loading": return <p>Loading…</p>;
    case "success": return <p>Got: {s.status.data}</p>;
    case "error":   return <p style={{ color: "red" }}>{s.status.msg}</p>;
  }
});

export default function App() { return <div style={{ padding: 20, fontFamily: "system-ui" }}><V /></div>; }`,
    validationLogic: (code) => ({ success: code.includes("Status") && code.includes("kind:"), message: "Discriminated unions + MobX = type-safe UI states." }),
  },

  {
    title: "MobX 44: Testing a Store in Isolation",
    content: [
      "MobX stores are POJO classes — test them with any runner. Fresh store per test.",
      "Use `autorun` spies to assert reactivity.",
    ],
    sections: [
    {
      tag: "concept",
      title: "No React needed",
      body: "Store tests run 10× faster than React tests. Keep business logic in the store; React layer is just rendering.",
    },
    {
      tag: "tip",
      title: "Spy pattern",
      body: "`let calls = 0; autorun(() => { store.total; calls++ });` — assert reactivity without snapshot tests.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, autorun } from "mobx";

class Counter {
  n = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.n++; }
}

// Simulated test inside the sandbox
function run() {
  const c = new Counter();
  let reactions = 0;
  const stop = autorun(() => { c.n; reactions++; });

  console.assert(c.n === 0, "initial n");
  c.inc();
  console.assert(c.n === 1, "after inc");
  console.assert(reactions === 2, "autorun fired once on setup + once on inc, got " + reactions);
  stop();

  console.log("✅ All assertions passed — ran " + reactions + " reactions");
}

run();

export default function App() {
  return <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>Check the console for test results.</p>
    <p>(In a real project, run with Jest/Vitest.)</p>
  </div>;
}`,
    validationLogic: (code) => ({ success: code.includes("autorun") && code.includes("reactions"), message: "Test MobX stores as plain classes — no component tree needed." }),
  },

  {
    title: "MobX 45: Testing observer Components",
    content: [
      "Render an observer component with React Testing Library; mutate the store; assert new DOM.",
      "Observer re-renders synchronously within the same tick — no `act()` dance required for sync mutations.",
    ],
    sections: [
    {
      tag: "concept",
      title: "One render per mutation tick",
      body: "Mutation → reaction → render. Assert on the post-render DOM.",
    },
    {
      tag: "tip",
      title: "Avoid global store in tests",
      body: "Use Context to inject a test-scoped instance. Keeps tests isolated.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Counter {
  n = 0;
  constructor() { makeAutoObservable(this); }
  inc() { this.n++; }
}

const store = new Counter();

const V = observer(() => <p>Count: {store.n}</p>);

// Simulated assertion
console.log("Before inc:", "n=" + store.n);
store.inc();
console.log("After inc:",  "n=" + store.n);

export default function App() {
  return <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <V />
    <button onClick={() => store.inc()}>+1</button>
    <p><small>In a real test: <code>fireEvent.click(screen.getByText("+1"))</code> then assert <code>getByText("Count: 1")</code>.</small></p>
  </div>;
}`,
    validationLogic: (code) => ({ success: code.includes("observer(") && code.includes("makeAutoObservable"), message: "Testing observer components is just React testing — MobX updates sync before assertion." }),
  },

  {
    title: "MobX 46: Atoms — The Low-Level Primitive",
    content: [
      "`createAtom(name, onBecomeObserved?, onBecomeUnobserved?)` lets you build custom observables. Used internally by observable.box etc.",
      "Integrate a non-MobX data source (e.g. `Date.now()`) into MobX reactivity.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Custom observable source",
      body: "Atom = manually report 'someone read me' (`reportObserved()`) and 'I changed' (`reportChanged()`).",
    },
    {
      tag: "tip",
      title: "Rarely needed",
      body: "95% of apps never need Atom. But it's the superpower for building MobX integrations (ag-grid, routers, custom sources).",
    },
    ],
    defaultCode: `import React, { useEffect, useState } from "react";
import { createAtom } from "mobx";
import { observer } from "mobx-react-lite";

class Clock {
  private atom = createAtom(
    "Clock",
    () => { this.start(); },
    () => { this.stop(); },
  );
  private interval: any = null;
  get now(): number {
    this.atom.reportObserved();
    return Date.now();
  }
  start() { this.interval = setInterval(() => this.atom.reportChanged(), 1000); }
  stop()  { clearInterval(this.interval); }
}

const clock = new Clock();

const TimeView = observer(() => {
  const now = clock.now;
  return <p>Now: {new Date(now).toLocaleTimeString()}</p>;
});

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      {show && <TimeView />}
      <button onClick={() => setShow(s => !s)}>Toggle clock</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("createAtom") && code.includes("reportObserved"), message: "Atom — integrate any external data source (time, WebSocket, DOM) with MobX reactivity." }),
  },

  {
    title: "MobX 47: WebSocket Subscription Store",
    content: [
      "A store that lazy-connects on first read, disconnects when no observers remain.",
      "Uses `onBecomeObserved` / `onBecomeUnobserved` to manage the socket lifecycle.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Lifecycle-bound connection",
      body: "Socket tied to whether anyone's watching. Multiple screens can watch the same feed without duplicating connections.",
    },
    {
      tag: "tip",
      title: "Reconnect with backoff",
      body: "On disconnect, schedule reconnect with exponential backoff. Wrap in runInAction.",
    },
    ],
    defaultCode: `import React, { useState } from "react";
import { makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

class PriceFeed {
  price = 0;
  connected = false;
  private timer: any = null;

  constructor() {
    makeAutoObservable(this);
    onBecomeObserved(this, "price", () => this.connect());
    onBecomeUnobserved(this, "price", () => this.disconnect());
  }

  connect() {
    console.log("[feed] connecting");
    this.connected = true;
    this.timer = setInterval(() => runInAction(() => {
      this.price += Math.round((Math.random() - 0.5) * 10);
    }), 1000);
  }
  disconnect() {
    console.log("[feed] disconnecting");
    this.connected = false;
    clearInterval(this.timer);
  }
}

const feed = new PriceFeed();

const Ticker = observer(() => <p>BTC: \${feed.price} ({feed.connected ? "live" : "off"})</p>);

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      {show && <Ticker />}
      <button onClick={() => setShow(s => !s)}>{show ? "Unmount" : "Mount"} Ticker</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("onBecomeObserved") && code.includes("onBecomeUnobserved"), message: "Lazy socket — connect when watched, disconnect when not. Classic MobX power move." }),
  },

  {
    title: "MobX 48: Async Flows with flow() Generators",
    content: [
      "`flow(generatorFn)` lets you write async actions as generators: yield promises, no `runInAction` needed after awaits.",
      "Replaces async functions for action bodies.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why generators",
      body: "Each `yield` restores the action context. Mutations after the yield are automatically batched.",
    },
    {
      tag: "tip",
      title: "When to prefer flow",
      body: "When the async function has many mutations after awaits. For simple cases, `runInAction` is fine.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, flow } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  loading = false; data: string | null = null; err: string | null = null;
  constructor() { makeAutoObservable(this, { load: flow } as any); }

  *load(): any {
    this.loading = true; this.err = null;
    try {
      const r = yield new Promise<string>(res => setTimeout(() => res("hello from the future"), 300));
      this.data = r;              // no runInAction needed — flow handles it
    } catch (e: any) {
      this.err = e.message;
    } finally {
      this.loading = false;
    }
  }
}

const s = new Store();

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <button onClick={() => s.load()} disabled={s.loading}>{s.loading ? "…" : "Load"}</button>
    {s.data && <p>Got: {s.data}</p>}
    {s.err && <p style={{ color: "red" }}>{s.err}</p>}
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("flow"), message: "flow() generators — async actions without runInAction ceremony." }),
  },

  {
    title: "MobX 49: Action Parameters & Logging",
    content: [
      "Actions can be named via `action('name', fn)` — names show up in devtools and spy events.",
      "Names matter when debugging complex flows.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Named actions",
      body: "`action('setEmail', v => { this.email = v })` — `spy` events carry `name: 'setEmail'`. Grep-friendly logs.",
    },
    {
      tag: "tip",
      title: "Anonymous class methods already have names",
      body: "`makeAutoObservable` uses method names. Explicit `action('foo', fn)` is for standalone functions.",
    },
    ],
    defaultCode: `import React from "react";
import { action, makeAutoObservable, spy } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  email = "";
  constructor() { makeAutoObservable(this); }
  setEmail(v: string) { this.email = v; }
}

const s = new Store();

spy(ev => {
  if (ev.type === "action") console.log("[spy] fired action:", ev.name);
});

const FreeAction = action("bulkReset", () => {
  s.email = "";
  console.log("bulk reset fired");
});

const V = observer(() => <div style={{ padding: 20, fontFamily: "system-ui" }}>
  <input value={s.email} onChange={e => s.setEmail(e.target.value)} placeholder="email" />
  <button onClick={FreeAction}>Reset</button>
</div>);

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("action(\"") && code.includes("spy"), message: "Named actions + spy — easier breadcrumbs in devtools." }),
  },

  {
    title: "MobX 50: Error Boundary + Observer",
    content: [
      "React Error Boundaries catch render errors. Combine with observer: a store error flows into a render error → boundary catches it.",
      "Gracefully degrade when a derived value throws.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Normal React rules",
      body: "Error boundaries work with observer just like any other component. Nothing MobX-specific.",
    },
    {
      tag: "tip",
      title: "Don't throw in computeds",
      body: "Prefer returning an error-discriminated union over throwing inside `get`. Throws make debugging harder.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Store {
  v: number | null = 0;
  constructor() { makeAutoObservable(this); }
  break() { this.v = null; }
}

const s = new Store();

class Boundary extends React.Component<any, { e: Error | null }> {
  state = { e: null as Error | null };
  static getDerivedStateFromError(e: Error) { return { e }; }
  render() {
    if (this.state.e) return <p style={{ color: "red" }}>Caught: {this.state.e.message}</p>;
    return this.props.children;
  }
}

const Risky = observer(() => {
  if (s.v === null) throw new Error("no value");
  return <p>value × 2 = {s.v * 2}</p>;
});

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Boundary><Risky /></Boundary>
      <button onClick={() => s.break()}>Break it</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("Boundary") && code.includes("getDerivedStateFromError"), message: "Error boundaries + observer — graceful recovery from derivation errors." }),
  },

  {
    title: "MobX 51: DI with RootStore + Interface Split",
    content: [
      "Larger apps split stores into interfaces. RootStore holds concrete impls; tests swap with mocks.",
      "A nicer architecture for microservice-sized frontends.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Interface at the boundary",
      body: "`interface ICartApi { fetch(): Promise<Item[]> }` — `CartStore` takes this in the ctor. Mock it in tests.",
    },
    {
      tag: "tip",
      title: "Constructor injection",
      body: "DI by constructor parameter. Simple. No decorators required.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";

interface ICartApi { fetch(): Promise<string[]> }

class RealApi implements ICartApi {
  async fetch() { return new Promise<string[]>(r => setTimeout(() => r(["apple", "bread"]), 200)); }
}

class CartStore {
  items: string[] = []; loading = false;
  constructor(private api: ICartApi) { makeAutoObservable(this, { api: false } as any); }
  async load() {
    this.loading = true;
    const data = await this.api.fetch();
    runInAction(() => { this.items = data; this.loading = false; });
  }
}

const cart = new CartStore(new RealApi());

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <button onClick={() => cart.load()}>Load</button>
    {cart.loading && <span> …</span>}
    <ul>{cart.items.map((i, k) => <li key={k}>{i}</li>)}</ul>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("ICartApi") && code.includes("constructor(private api"), message: "Interface split + constructor DI — testable stores at scale." }),
  },

  {
    title: "MobX 52: Domain Entities with Methods",
    content: [
      "Not every observable is a store. Entities (Todo, Message, Order) can carry their own methods.",
      "`todo.toggle()` reads cleaner than `store.toggle(todo.id)`.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Rich models",
      body: "Domain objects with behavior (not anemic DTOs). Encapsulation at the right layer.",
    },
    {
      tag: "tip",
      title: "Avoid business logic leakage",
      body: "If a method touches multiple entities, it belongs on the store — not the entity.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Todo {
  constructor(public id: number, public text: string, public done = false) {
    makeAutoObservable(this);
  }
  toggle() { this.done = !this.done; }
  edit(t: string) { this.text = t; }
}

class TodoStore {
  items: Todo[] = [];
  constructor() {
    makeAutoObservable(this);
    this.items.push(new Todo(1, "Read MobX docs"));
    this.items.push(new Todo(2, "Ship feature"));
  }
  add(text: string) { this.items.push(new Todo(this.items.length + 1, text)); }
}

const store = new TodoStore();

const Row = observer(({ todo }: { todo: Todo }) => (
  <li onClick={() => todo.toggle()} style={{ textDecoration: todo.done ? "line-through" : "none", cursor: "pointer" }}>
    {todo.text}
  </li>
));

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <ul>{store.items.map(t => <Row key={t.id} todo={t} />)}</ul>
    <button onClick={() => store.add("new todo")}>Add</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("class Todo") && code.includes("toggle()"), message: "Rich entities — behavior lives with the data. Cleaner call sites." }),
  },

  {
    title: "MobX 53: Performance Checklist",
    content: [
      "(1) observer each row of a list. (2) computed for derived data. (3) action-wrap rapid mutations. (4) computed.struct for array returns. (5) onBecomeObserved for lazy sockets.",
      "Ship these and MobX carries most apps to production scale.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Granular = fast",
      body: "MobX's win is surgical re-renders. Every tip above reduces re-render scope.",
    },
    {
      tag: "key-point",
      title: "Interview question",
      body: "\"Why is MobX fast?\" — answer with the five checklist items + 'lazy, memoized, demand-driven dependency graph'.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, comparer, makeObservable, observable, computed } from "mobx";
import { observer } from "mobx-react-lite";

// Showcase of all 5 checklist items
class Item { constructor(public id: number, public text: string) { makeAutoObservable(this); } }

class List {
  items: Item[] = [];
  filter = "";
  constructor() {
    makeObservable(this, {
      items: observable,
      filter: observable,
      visible: computed({ equals: comparer.structural }),   // (4)
      add: this.add as any,
      setFilter: this.setFilter as any,
    });
    for (let i = 0; i < 5; i++) this.items.push(new Item(i, "Item " + i));
  }
  get visible() {
    return this.filter ? this.items.filter(i => i.text.includes(this.filter)) : this.items;  // (2)
  }
  add(t: string) { this.items.push(new Item(this.items.length, t)); }          // (3)
  setFilter(f: string) { this.filter = f; }
}

const list = new List();

const Row = observer(({ it }: { it: Item }) => <li>{it.text}</li>);            // (1)

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <input placeholder="filter" value={list.filter} onChange={e => list.setFilter(e.target.value)} />
    <ul>{list.visible.map(i => <Row key={i.id} it={i} />)}</ul>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("comparer.structural") && code.includes("observer(({ it"), message: "The five-point performance checklist — shippable scaling tips." }),
  },

  {
    title: "MobX 54: observable over POJOs vs Classes",
    content: [
      "Classes shine for stores with methods/computeds. `observable({...})` fits lightweight state.",
      "Use what you need — no religious wars.",
    ],
    sections: [
    {
      tag: "concept",
      title: "POJO style",
      body: "`const s = observable({ n: 0, inc() { this.n++ } })` — less ceremony, loses `this` typing.",
    },
    {
      tag: "tip",
      title: "Prefer classes at scale",
      body: "Once a store grows 5+ methods or computeds, switch to a class. Better encapsulation, better types.",
    },
    ],
    defaultCode: `import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

const counter = observable({
  n: 0,
  inc() { this.n++; },
  reset() { this.n = 0; },
});

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>n = {counter.n}</p>
    <button onClick={() => counter.inc()}>+1</button>
    <button onClick={() => counter.reset()} style={{ marginLeft: 8 }}>reset</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("observable({"), message: "POJO observables — fine for small state, but class scales better." }),
  },

  {
    title: "MobX 55: when() as a Promise",
    content: [
      "`when(pred)` (without effect) returns a **Promise** that resolves when pred is true. Perfect for one-time async gates.",
      "Wait for auth before starting analytics.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Promise form",
      body: "`await when(() => auth.ready)` — pauses until the observable condition is true. Composable in async functions.",
    },
    ],
    defaultCode: `import React, { useEffect, useState } from "react";
import { makeAutoObservable, when } from "mobx";
import { observer } from "mobx-react-lite";

class Auth { ready = false; constructor() { makeAutoObservable(this); } init() { setTimeout(() => this.ready = true, 600); } }
const auth = new Auth();

async function bootAnalytics() {
  await when(() => auth.ready);
  console.log("[analytics] booted after auth ready");
}

auth.init();
bootAnalytics();

const V = observer(() => <p style={{ padding: 20 }}>auth ready: {String(auth.ready)}</p>);
export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("when("), message: "when() as a Promise — elegant one-time async gates." }),
  },

  {
    title: "MobX 56: MobX vs Redux Head-to-Head",
    content: [
      "Same counter, two approaches. Redux: actions + reducers + dispatch. MobX: observables + mutations + observer.",
      "Know both. Interview gold.",
    ],
    sections: [
    {
      tag: "key-point",
      title: "Mental model",
      body: "Redux = event log + pure reducers. MobX = reactive graph. Redux excels at time-travel; MobX excels at ergonomics.",
      badges: ["Interview"],
    },
    {
      tag: "concept",
      title: "LOC count",
      body: "The same app in MobX is typically 40-60% less code than Redux + Redux Toolkit. Plain Redux (no toolkit) is far worse.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// MobX — 15 lines total
class Counter { n = 0; constructor() { makeAutoObservable(this); } inc() { this.n++; } dec() { this.n--; } }
const counter = new Counter();
const View = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>n = {counter.n}</p>
    <button onClick={() => counter.dec()}>-</button>
    <button onClick={() => counter.inc()} style={{ marginLeft: 8 }}>+</button>
  </div>
));
export default function App() { return <View />; }
/*
// Redux equivalent (for reference):
// createSlice({ name: "counter", initialState: { n: 0 }, reducers: {
//   inc: s => { s.n++ }, dec: s => { s.n-- },
// }});
// const store = configureStore(...)
// <Provider store={store}>
//   const { n } = useSelector(...); const d = useDispatch();
*/`,
    validationLogic: (code) => ({ success: code.includes("makeAutoObservable") && code.includes("observer("), message: "Same feature, half the code. Redux's power is history; MobX's is speed-to-value." }),
  },

  {
    title: "MobX 57: MobX vs Zustand",
    content: [
      "Zustand: small, hooks-based, immutable. MobX: reactive, mutable, class-oriented.",
      "Zustand fits 'useState++'. MobX fits large domain models.",
    ],
    sections: [
    {
      tag: "key-point",
      title: "Selector vs read",
      body: "Zustand: `useStore(s => s.n)` (selector). MobX: `store.n` inside observer (reads tracked).",
      badges: ["Interview"],
    },
    {
      tag: "concept",
      title: "Sweet spots",
      body: "Zustand for small apps or teams that prefer Redux-lite. MobX for domain-rich UIs with many computed derivations.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// MobX
class S { n = 0; constructor() { makeAutoObservable(this); } inc() { this.n++; } }
const s = new S();

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>MobX n = {s.n}</p>
    <button onClick={() => s.inc()}>+1</button>
  </div>
));

// Zustand equivalent (commented):
// const useStore = create(set => ({ n: 0, inc: () => set(s => ({ n: s.n + 1 })) }));
// In component:  const n = useStore(s => s.n);

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("observer("), message: "Zustand: simple. MobX: reactive. Pick per team skills + app complexity." }),
  },

  {
    title: "MobX 58: Common Pitfall — Destructuring Observables",
    content: [
      "`const { name } = store` **snapshots** — reactivity lost. Destructure inside render to keep tracking.",
      "Classic mistake — teach your team to spot it.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why destructure breaks",
      body: "`const { name } = store` evaluates `store.name` once, binds to local `name`. No tracking after that. Use `store.name` inline in JSX.",
    },
    {
      tag: "tip",
      title: "Fix",
      body: "Either (1) read inline, or (2) destructure inside the observer component render function body (re-runs on every render).",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Store { name = "Ada"; constructor() { makeAutoObservable(this); } rename(n: string) { this.name = n; } }
const s = new Store();

// ❌ BAD: destructured ONCE in outer scope — never re-tracked
const { name: stale } = s;

const Broken = observer(() => <p>stale = {stale}</p>);       // never updates
const Correct = observer(() => <p>live  = {s.name}</p>);     // updates on change

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Broken /><Correct />
      <button onClick={() => s.rename(s.name === "Ada" ? "Bob" : "Ada")}>Rename</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("stale") && code.includes("s.name"), message: "Destructuring outside render kills reactivity. Inline or destructure inside." }),
  },

  {
    title: "MobX 59: Common Pitfall — Passing a Primitive to a Memoized Child",
    content: [
      "Parent observer reads `store.n`, passes to child. Child is memoized. Parent re-renders on every `n` change.",
      "Fix: pass the store; let the child read.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Why",
      body: "The whole point of observer is reading at the use site. Reading in parent + passing down defeats granularity.",
    },
    {
      tag: "tip",
      title: "Push reads down",
      body: "Rule of thumb: the component that **renders** the value should also **read** it.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class Store { n = 0; constructor() { makeAutoObservable(this); } inc() { this.n++; } }
const s = new Store();

// ❌ Parent reads n, triggers re-render cascade
const Parent_Bad = observer(() => {
  console.log("Parent_Bad render");
  return <Child_Bad n={s.n} />;
});
const Child_Bad = ({ n }: { n: number }) => <p>(bad) n = {n}</p>;

// ✅ Parent doesn't read; child is an observer
const Parent_Good = observer(() => {
  console.log("Parent_Good render");
  return <Child_Good />;
});
const Child_Good = observer(() => <p>(good) n = {s.n}</p>);

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Parent_Bad /><Parent_Good />
      <button onClick={() => s.inc()}>+1 (watch the console)</button>
    </div>
  );
}`,
    validationLogic: (code) => ({ success: code.includes("Parent_Good") && code.includes("Child_Good"), message: "Push reads down. Parent should render layout; child should render value." }),
  },

  {
    title: "MobX 60: mobx-react vs mobx-react-lite",
    content: [
      "mobx-react-lite = function components only, tiny (~8kb). mobx-react = lite + class-component HOCs + Provider + inject. Use lite unless you support class components.",
      "Knowing when to reach for each is an interview topic.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Feature matrix",
      body: "Lite: `observer`, `useLocalObservable`, `useObserver`, Context (bring your own). mobx-react: all of lite + `<Provider>` + `inject(...)(Class)`.",
    },
    {
      tag: "tip",
      title: "New projects → lite",
      body: "Almost everyone builds function components now. mobx-react-lite is the default pick.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";

const Demo = observer(() => {
  const s = useLocalObservable(() => ({ n: 0, inc() { this.n++; } }));
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <p>mobx-react-lite: n = {s.n}</p>
      <button onClick={() => s.inc()}>+1</button>
    </div>
  );
});

export default function App() { return <Demo />; }`,
    validationLogic: (code) => ({ success: code.includes("useLocalObservable"), message: "mobx-react-lite covers 99% of modern codebases. mobx-react stays for legacy class HOCs." }),
  },

  {
    title: "MobX 61: Signals vs MobX Observables",
    content: [
      "Signals (Solid, Preact, Angular) and MobX observables share the 'reactive primitive' idea. MobX tracks reads; signals tie reactivity to specific read functions.",
      "Both give surgical updates. Trade-offs differ.",
    ],
    sections: [
    {
      tag: "concept",
      title: "Signals",
      body: "`const [get, set] = createSignal(0)` — explicit read function. Reactivity happens when you call `get()`.",
    },
    {
      tag: "concept",
      title: "MobX observables",
      body: "Plain property access (`store.n`) tracks. Proxy-based, implicit.",
    },
    {
      tag: "key-point",
      title: "Interview framing",
      body: "Signals are closer to fine-grained reactivity at the language level; MobX is a general OO reactive library.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// MobX equivalent of a signal
class Signal<T> {
  v: T;
  constructor(initial: T) { this.v = initial; makeAutoObservable(this); }
  get() { return this.v; }
  set(next: T) { this.v = next; }
}

const count = new Signal(0);

const V = observer(() => <p>MobX-signal: {count.get()}</p>);

export default function App() {
  return <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <V />
    <button onClick={() => count.set(count.get() + 1)}>+1</button>
  </div>;
}`,
    validationLogic: (code) => ({ success: code.includes("Signal") && code.includes("makeAutoObservable"), message: "Signals and MobX: same spirit, different ergonomics. Both track, both update surgically." }),
  },

  {
    title: "MobX 62: MobX-State-Tree (MST) — Brief Intro",
    content: [
      "MST adds: typed snapshots, actions-only mutations, middleware, and time-travel. Heavier but more structured.",
      "Good fit for large teams needing Redux-like rigor with MobX ergonomics.",
    ],
    sections: [
    {
      tag: "concept",
      title: "When to reach for MST",
      body: "Team > 5, desire for snapshot persistence, strong type inference for schemas, middleware for logging/undo.",
    },
    {
      tag: "tip",
      title: "Not automatic",
      body: "MST is a separate package (`mobx-state-tree`). Commit to its model or stick to vanilla MobX.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// Vanilla MobX counter (for comparison — MST not in the sandbox)
class Counter { n = 0; constructor() { makeAutoObservable(this); } inc() { this.n++; } }
const c = new Counter();

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui" }}>
    <p>n = {c.n}</p>
    <p><small>MST equivalent:</small></p>
    <pre style={{ background: "#f4f4f4", padding: 8, fontSize: 11 }}>{\`const Counter = types
  .model({ n: types.number })
  .actions(self => ({ inc() { self.n++ } }));
const c = Counter.create({ n: 0 });
\`}</pre>
    <button onClick={() => c.inc()}>+1</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("makeAutoObservable"), message: "MST adds structure to MobX — pick it when you want Redux rigor with MobX ergonomics." }),
  },

  {
    title: "MobX 63: Scaling MobX in Large Apps",
    content: [
      "Rules of thumb at scale: one RootStore, per-feature subtrees, domain entities with methods, keep side-effects in reactions, enforce actions, trace in dev only.",
      "This is the 'senior interview' answer to 'how would you structure a MobX app?'",
    ],
    sections: [
    {
      tag: "key-point",
      title: "Six scaling rules",
      body: "(1) One RootStore. (2) Feature-scoped child stores. (3) Entities with methods. (4) Reactions for side-effects. (5) `enforceActions: 'always'`. (6) trace/spy dev-only.",
      badges: ["Interview"],
    },
    {
      tag: "concept",
      title: "Boundaries by feature",
      body: "Checkout, Catalog, Auth, UI — each is a tree under root. Cross-tree communication through computeds in a separate `checkoutSummary` layer.",
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, configure } from "mobx";
import { observer } from "mobx-react-lite";

configure({ enforceActions: "always" });

class AuthStore { user: string | null = null; constructor() { makeAutoObservable(this); } login(u: string) { this.user = u; } }
class CartStore { items: string[] = []; constructor() { makeAutoObservable(this); } add(x: string) { this.items.push(x); } }
class UIStore { theme: "light" | "dark" = "light"; constructor() { makeAutoObservable(this); } toggle() { this.theme = this.theme === "light" ? "dark" : "light"; } }

class RootStore {
  auth = new AuthStore();
  cart = new CartStore();
  ui = new UIStore();
}

const root = new RootStore();
root.auth.login("ada");
root.cart.add("laptop");

const V = observer(() => (
  <div style={{ padding: 20, fontFamily: "system-ui", background: root.ui.theme === "dark" ? "#111" : "#eee", color: root.ui.theme === "dark" ? "#eee" : "#111" }}>
    <p>User: {root.auth.user}</p>
    <p>Cart: {root.cart.items.join(", ")}</p>
    <button onClick={() => root.ui.toggle()}>Toggle theme</button>
  </div>
));

export default function App() { return <V />; }`,
    validationLogic: (code) => ({ success: code.includes("RootStore") && code.includes("enforceActions"), message: "Six rules that carry MobX into enterprise scale." }),
  },

  {
    title: "MobX 64: System Design — E-commerce Dashboard",
    content: [
      "Architect it live: Product catalog, Cart, Auth, Orders, UI state. Each is a store. Derivations link them.",
      "This is a typical senior interview asked in 20 min. Tell them how you'd structure it.",
    ],
    sections: [
    {
      tag: "key-point",
      title: "The 5 stores",
      body: "Product, Cart, Auth, Orders, UI. Cross-cut: OrderSummary (computed), CheckoutFlow (actions + flow).",
      badges: ["Interview"],
    },
    {
      tag: "concept",
      title: "Where reactions live",
      body: "Persistence autorun on Cart (`toJS → localStorage`). Analytics reaction on Orders. Theme autorun on UI.",
      badges: ["system-design"],
    },
    ],
    defaultCode: `import React from "react";
import { makeAutoObservable, autorun } from "mobx";
import { observer } from "mobx-react-lite";

interface Product { id: number; name: string; price: number }

class ProductStore {
  items: Product[] = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Phone",  price: 700  },
    { id: 3, name: "Watch",  price: 250  },
  ];
  constructor() { makeAutoObservable(this); }
}

class CartStore {
  ids: number[] = [];
  constructor(private root: RootStore) { makeAutoObservable(this, { root: false } as any); }
  add(id: number) { this.ids.push(id); }
  get products() { return this.ids.map(id => this.root.products.items.find(p => p.id === id)!); }
  get total() { return this.products.reduce((s, p) => s + p.price, 0); }
}

class RootStore {
  products = new ProductStore();
  cart: CartStore;
  constructor() { this.cart = new CartStore(this); }
}

const root = new RootStore();

// Persistence reaction
autorun(() => console.log("[persist] cart has", root.cart.ids.length, "items"));

const Catalog = observer(() => (
  <ul>{root.products.items.map(p => (
    <li key={p.id}>{p.name} — \${p.price}
      <button onClick={() => root.cart.add(p.id)} style={{ marginLeft: 8 }}>Add</button>
    </li>
  ))}</ul>
));

const CartTotal = observer(() => <p>Total: \${root.cart.total}</p>);

export default function App() {
  return <div style={{ padding: 20, fontFamily: "system-ui" }}><Catalog /><CartTotal /></div>;
}`,
    validationLogic: (code) => ({ success: code.includes("ProductStore") && code.includes("CartStore") && code.includes("RootStore"), message: "E-commerce dashboard in 40 lines — typical senior design question." }),
  },

  {
    title: "MobX 65: Capstone — TodoMVC Interview Edition",
    content: [
      "Full TodoMVC: todos with CRUD, filter, computed leftCount, persistence. Ship-ready patterns.",
      "The closing interview question: 'build TodoMVC in MobX'. Do it in 80 lines.",
    ],
    sections: [
    {
      tag: "key-point",
      title: "What interviewers watch for",
      body: "(1) observer per row, (2) computed visible/leftCount, (3) actions only, (4) persistence reaction, (5) keyed list.",
      badges: ["Interview"],
    },
    ],
    defaultCode: `import React, { useState } from "react";
import { makeAutoObservable, autorun, toJS } from "mobx";
import { observer } from "mobx-react-lite";

type Filter = "all" | "active" | "done";

class Todo {
  constructor(public id: number, public text: string, public done = false) { makeAutoObservable(this); }
  toggle() { this.done = !this.done; }
  setText(t: string) { this.text = t; }
}

class TodoStore {
  todos: Todo[] = [];
  filter: Filter = "all";
  private nextId = 1;

  constructor() {
    makeAutoObservable(this);
    this.hydrate();
    autorun(() => { try { localStorage.setItem("todomvc", JSON.stringify(toJS(this.todos))); } catch {} });
  }

  hydrate() {
    try {
      const raw = localStorage.getItem("todomvc");
      if (raw) {
        const data = JSON.parse(raw) as { id: number; text: string; done: boolean }[];
        data.forEach(d => this.todos.push(new Todo(d.id, d.text, d.done)));
        this.nextId = Math.max(0, ...data.map(d => d.id)) + 1;
      }
    } catch {}
  }

  add(text: string) { if (text.trim()) this.todos.push(new Todo(this.nextId++, text.trim())); }
  remove(id: number) { this.todos = this.todos.filter(t => t.id !== id); }
  setFilter(f: Filter) { this.filter = f; }
  clearCompleted() { this.todos = this.todos.filter(t => !t.done); }

  get visible(): Todo[] {
    if (this.filter === "active") return this.todos.filter(t => !t.done);
    if (this.filter === "done")   return this.todos.filter(t => t.done);
    return this.todos;
  }
  get leftCount(): number { return this.todos.filter(t => !t.done).length; }
}

const store = new TodoStore();

const Row = observer(({ t }: { t: Todo }) => (
  <li style={{ textDecoration: t.done ? "line-through" : "none" }}>
    <input type="checkbox" checked={t.done} onChange={() => t.toggle()} />
    <span onDoubleClick={() => t.setText(prompt("edit?", t.text) ?? t.text)}>{t.text}</span>
    <button onClick={() => store.remove(t.id)} style={{ marginLeft: 8 }}>×</button>
  </li>
));

const TodoMVC = observer(() => {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ padding: 20, fontFamily: "system-ui", maxWidth: 460 }}>
      <h2>todos</h2>
      <input value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { store.add(draft); setDraft(""); } }}
        placeholder="What needs doing?" style={{ width: "100%", padding: 8 }} />
      <ul>{store.visible.map(t => <Row key={t.id} t={t} />)}</ul>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ddd", paddingTop: 8 }}>
        <span>{store.leftCount} left</span>
        <div>
          {(["all","active","done"] as Filter[]).map(f => (
            <button key={f} onClick={() => store.setFilter(f)}
              style={{ fontWeight: store.filter === f ? 700 : 400, marginLeft: 4 }}>{f}</button>
          ))}
        </div>
        <button onClick={() => store.clearCompleted()}>Clear completed</button>
      </div>
    </div>
  );
});

export default function App() { return <TodoMVC />; }`,
    validationLogic: (code) => ({ success: code.includes("TodoStore") && code.includes("visible") && code.includes("leftCount") && code.includes("autorun"), message: "TodoMVC in MobX — interview capstone. Senior-ready architecture in 80 lines." }),
  }
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
      titleEs: MOBX_TITLES_ES[id],
    };
  });
}

export const MOBX_COURSE_LESSONS = buildMobxLessons();

export function getMobxLessonById(slug: string): WebCourseLesson | undefined {
  return MOBX_COURSE_LESSONS.find((l) => l.id === slug);
}
