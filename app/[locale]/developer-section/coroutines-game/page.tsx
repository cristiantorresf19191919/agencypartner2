"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowForward as ArrowRight,
  ArrowBack as ArrowBack,
  PlayArrow as PlayIcon,
  Refresh as ResetIcon,
  Lightbulb as HintIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lock as LockIcon,
  EmojiEvents as TrophyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./CoroutinesGame.module.css";

/* ============ Types ============ */
type Screen = "menu" | "levels" | "game" | "complete";
type ThreadLane = "Main" | "IO" | "Default" | "Unconfined";

interface Operator {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  code: string;
}

interface Task {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface TimelineEvent {
  taskId: string;
  lane: ThreadLane;
  label: string;
  emoji: string;
  isSuspend?: boolean;
  isError?: boolean;
  switchFrom?: ThreadLane;
}

interface Level {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
  targetThreads: Record<string, ThreadLane>;
  availableOps: string[];
  slots: number;
  par: number;
  hint: string;
  teaches: string;
  validate: (ops: string[]) => { success: boolean; timeline: TimelineEvent[]; mainBlocked: boolean };
}

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

/* ============ Operator Definitions ============ */
const OPERATORS: Record<string, Operator> = {
  launch: {
    id: "launch",
    label: "launch",
    emoji: "\u{1F680}",
    color: "#818cf8",
    description: "Fire-and-forget coroutine",
    code: "launch { doWork() }",
  },
  async: {
    id: "async",
    label: "async",
    emoji: "\u26A1",
    color: "#f472b6",
    description: "Returns Deferred result",
    code: "async { fetchData() }",
  },
  await: {
    id: "await",
    label: "await()",
    emoji: "\u231B",
    color: "#fb923c",
    description: "Suspends until Deferred completes",
    code: "val result = deferred.await()",
  },
  suspend: {
    id: "suspend",
    label: "suspend",
    emoji: "\u23F8\uFE0F",
    color: "#34d399",
    description: "Marks function as suspendable",
    code: "suspend fun fetchUser()",
  },
  delay: {
    id: "delay",
    label: "delay()",
    emoji: "\u23F1\uFE0F",
    color: "#22d3ee",
    description: "Non-blocking delay",
    code: "delay(1000L)",
  },
  withContext: {
    id: "withContext",
    label: "withContext()",
    emoji: "\u{1F504}",
    color: "#a78bfa",
    description: "Switch to different dispatcher",
    code: "withContext(Dispatchers.IO) {}",
  },
  coroutineScope: {
    id: "coroutineScope",
    label: "coroutineScope",
    emoji: "\u{1F4E6}",
    color: "#fbbf24",
    description: "Structured concurrency boundary",
    code: "coroutineScope { launch {} }",
  },
  supervisorScope: {
    id: "supervisorScope",
    label: "supervisorScope",
    emoji: "\u{1F3D7}\uFE0F",
    color: "#10b981",
    description: "Independent child failures",
    code: "supervisorScope { launch {} }",
  },
  flow: {
    id: "flow",
    label: "flow { emit() }",
    emoji: "\u{1F30A}",
    color: "#60a5fa",
    description: "Cold async stream producer",
    code: "flow { emit(value) }",
  },
  collect: {
    id: "collect",
    label: "collect",
    emoji: "\u{1FAA3}",
    color: "#f87171",
    description: "Terminal flow consumer",
    code: ".collect { println(it) }",
  },
  channel: {
    id: "channel",
    label: "Channel",
    emoji: "\u{1F4E1}",
    color: "#e879f9",
    description: "Hot async stream",
    code: "Channel<Int>()",
  },
  cancel: {
    id: "cancel",
    label: "cancel()",
    emoji: "\u274C",
    color: "#ef4444",
    description: "Cancel coroutine/job",
    code: "job.cancel()",
  },
};

/* ============ Lane Helpers ============ */
const LANES: { id: ThreadLane; label: string; color: string; dotColor: string; className: string }[] = [
  { id: "Main", label: "Main", color: "#ef4444", dotColor: "#ef4444", className: "laneMain" },
  { id: "IO", label: "Dispatchers.IO", color: "#3b82f6", dotColor: "#3b82f6", className: "laneIO" },
  { id: "Default", label: "Dispatchers.Default", color: "#22c55e", dotColor: "#22c55e", className: "laneDefault" },
  { id: "Unconfined", label: "Unconfined", color: "#eab308", dotColor: "#eab308", className: "laneUnconfined" },
];

function getLaneStyle(lane: ThreadLane): string {
  switch (lane) {
    case "Main": return "taskBlockMain";
    case "IO": return "taskBlockIO";
    case "Default": return "taskBlockDefault";
    case "Unconfined": return "taskBlockUnconfined";
  }
}

/* ============ Level Definitions ============ */
const LEVELS: Level[] = [
  /* ---------- Block 1: Basics (1-7) ---------- */
  {
    id: 1,
    name: "Hello Coroutine",
    description: "Run a print task off the Main thread using launch",
    tasks: [{ id: "print", name: "println()", emoji: "\u{1F4DD}", description: "Print greeting" }],
    targetThreads: { print: "Default" },
    availableOps: ["launch", "suspend", "delay"],
    slots: 1,
    par: 1,
    hint: "launch {} starts a new coroutine that runs on a background thread by default",
    teaches: "launch basics",
    validate: (ops) => {
      const ok = ops.length === 1 && ops[0] === "launch";
      return {
        success: ok,
        mainBlocked: !ok,
        timeline: ok
          ? [{ taskId: "print", lane: "Default", label: "println()", emoji: "\u{1F4DD}" }]
          : [{ taskId: "print", lane: "Main", label: "println() BLOCKED", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 2,
    name: "Suspend Function",
    description: "Call a network function without blocking the Main thread",
    tasks: [{ id: "network", name: "fetchUser()", emoji: "\u{1F310}", description: "Fetch user data" }],
    targetThreads: { network: "IO" },
    availableOps: ["suspend", "launch", "withContext"],
    slots: 1,
    par: 1,
    hint: "A suspend function can be called from a coroutine without blocking the calling thread",
    teaches: "suspend keyword",
    validate: (ops) => {
      const ok = ops.length === 1 && ops[0] === "suspend";
      return {
        success: ok,
        mainBlocked: !ok && ops[0] !== "launch",
        timeline: ok
          ? [
              { taskId: "network", lane: "Main", label: "suspend fetchUser()", emoji: "\u23F8\uFE0F" },
              { taskId: "network", lane: "IO", label: "fetching...", emoji: "\u{1F310}", switchFrom: "Main" },
              { taskId: "network", lane: "Main", label: "resumed", emoji: "\u2705", switchFrom: "IO" },
            ]
          : [{ taskId: "network", lane: "Main", label: "BLOCKED!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 3,
    name: "Delay vs Sleep",
    description: "Wait 1 second without blocking the Main thread. Use the non-blocking delay.",
    tasks: [{ id: "wait", name: "wait 1s", emoji: "\u23F0", description: "Wait 1 second" }],
    targetThreads: { wait: "Main" },
    availableOps: ["delay", "suspend", "launch"],
    slots: 1,
    par: 1,
    hint: "delay() suspends the coroutine without blocking the thread, unlike Thread.sleep()",
    teaches: "non-blocking delay",
    validate: (ops) => {
      const ok = ops.length === 1 && ops[0] === "delay";
      return {
        success: ok,
        mainBlocked: !ok,
        timeline: ok
          ? [
              { taskId: "wait", lane: "Main", label: "delay(1000L)", emoji: "\u23F1\uFE0F", isSuspend: true },
              { taskId: "wait", lane: "Main", label: "resumed after 1s", emoji: "\u2705" },
            ]
          : [{ taskId: "wait", lane: "Main", label: "Thread.sleep BLOCKS!", emoji: "\u{1F6D1}", isError: true }],
      };
    },
  },
  {
    id: 4,
    name: "Multiple Launches",
    description: "Run 3 tasks concurrently on background threads",
    tasks: [
      { id: "task1", name: "taskA()", emoji: "\u{1F7E6}", description: "Task A" },
      { id: "task2", name: "taskB()", emoji: "\u{1F7E9}", description: "Task B" },
      { id: "task3", name: "taskC()", emoji: "\u{1F7E8}", description: "Task C" },
    ],
    targetThreads: { task1: "Default", task2: "Default", task3: "Default" },
    availableOps: ["launch", "async", "suspend", "delay"],
    slots: 3,
    par: 3,
    hint: "Each launch {} creates an independent coroutine that runs concurrently",
    teaches: "concurrent execution",
    validate: (ops) => {
      const ok = ops.length === 3 && ops.every((o) => o === "launch");
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "task1", lane: "Default", label: "taskA()", emoji: "\u{1F7E6}" },
              { taskId: "task2", lane: "Default", label: "taskB()", emoji: "\u{1F7E9}" },
              { taskId: "task3", lane: "Default", label: "taskC()", emoji: "\u{1F7E8}" },
            ]
          : [{ taskId: "task1", lane: "Main", label: "Not concurrent!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 5,
    name: "Dispatcher Choice",
    description: "Run a file-read task on the IO dispatcher instead of Main",
    tasks: [{ id: "fileRead", name: "readFile()", emoji: "\u{1F4C1}", description: "Read from disk" }],
    targetThreads: { fileRead: "IO" },
    availableOps: ["withContext", "launch", "delay", "suspend"],
    slots: 1,
    par: 1,
    hint: "withContext(Dispatchers.IO) switches the coroutine to the IO thread pool",
    teaches: "dispatcher selection",
    validate: (ops) => {
      const ok = ops.length === 1 && ops[0] === "withContext";
      return {
        success: ok,
        mainBlocked: !ok && ops[0] !== "launch",
        timeline: ok
          ? [
              { taskId: "fileRead", lane: "Main", label: "withContext(IO)", emoji: "\u{1F504}" },
              { taskId: "fileRead", lane: "IO", label: "readFile()", emoji: "\u{1F4C1}", switchFrom: "Main" },
              { taskId: "fileRead", lane: "Main", label: "returned", emoji: "\u2705", switchFrom: "IO" },
            ]
          : [{ taskId: "fileRead", lane: "Main", label: "Wrong dispatcher!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 6,
    name: "Context Switch",
    description: "Fetch data on IO, then update the UI on Main thread",
    tasks: [
      { id: "fetch", name: "fetchData()", emoji: "\u{1F310}", description: "Fetch from API" },
      { id: "update", name: "updateUI()", emoji: "\u{1F5A5}\uFE0F", description: "Update UI" },
    ],
    targetThreads: { fetch: "IO", update: "Main" },
    availableOps: ["withContext", "launch", "suspend", "delay"],
    slots: 2,
    par: 2,
    hint: "Use withContext twice: first to switch to IO for the fetch, then to switch back to Main for UI update",
    teaches: "withContext switching",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "withContext" && ops[1] === "withContext";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "fetch", lane: "Main", label: "withContext(IO)", emoji: "\u{1F504}" },
              { taskId: "fetch", lane: "IO", label: "fetchData()", emoji: "\u{1F310}", switchFrom: "Main" },
              { taskId: "update", lane: "Main", label: "withContext(Main)", emoji: "\u{1F504}", switchFrom: "IO" },
              { taskId: "update", lane: "Main", label: "updateUI()", emoji: "\u{1F5A5}\uFE0F" },
            ]
          : [{ taskId: "fetch", lane: "Main", label: "Wrong switch!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 7,
    name: "Sequential Suspend",
    description: "Chain 2 suspend calls in sequence: first fetch user, then fetch posts",
    tasks: [
      { id: "user", name: "fetchUser()", emoji: "\u{1F464}", description: "Fetch user" },
      { id: "posts", name: "fetchPosts()", emoji: "\u{1F4DD}", description: "Fetch user posts" },
    ],
    targetThreads: { user: "IO", posts: "IO" },
    availableOps: ["suspend", "launch", "async", "delay"],
    slots: 2,
    par: 2,
    hint: "Suspend functions execute sequentially by default within the same coroutine",
    teaches: "sequential execution",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "suspend" && ops[1] === "suspend";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "user", lane: "IO", label: "suspend fetchUser()", emoji: "\u{1F464}" },
              { taskId: "user", lane: "IO", label: "user loaded", emoji: "\u2705", isSuspend: true },
              { taskId: "posts", lane: "IO", label: "suspend fetchPosts()", emoji: "\u{1F4DD}" },
              { taskId: "posts", lane: "IO", label: "posts loaded", emoji: "\u2705" },
            ]
          : [{ taskId: "user", lane: "Main", label: "Not suspended!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },

  /* ---------- Block 2: Async/Await (8-12) ---------- */
  {
    id: 8,
    name: "Async Basics",
    description: "Start an async computation and await its Deferred result",
    tasks: [{ id: "compute", name: "compute()", emoji: "\u{1F9EE}", description: "Heavy computation" }],
    targetThreads: { compute: "Default" },
    availableOps: ["async", "await", "launch", "suspend"],
    slots: 2,
    par: 2,
    hint: "async returns a Deferred. Call await() to get the result when you need it.",
    teaches: "async/await pattern",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "async" && ops[1] === "await";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "compute", lane: "Default", label: "async { compute() }", emoji: "\u26A1" },
              { taskId: "compute", lane: "Default", label: "computing...", emoji: "\u{1F9EE}", isSuspend: true },
              { taskId: "compute", lane: "Main", label: ".await() = result", emoji: "\u231B", switchFrom: "Default" },
            ]
          : [{ taskId: "compute", lane: "Main", label: "Missing await!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 9,
    name: "Parallel Decomposition",
    description: "Fetch user and posts in parallel using 2 async calls, then await both",
    tasks: [
      { id: "user", name: "fetchUser()", emoji: "\u{1F464}", description: "Fetch user" },
      { id: "posts", name: "fetchPosts()", emoji: "\u{1F4DD}", description: "Fetch posts" },
    ],
    targetThreads: { user: "IO", posts: "IO" },
    availableOps: ["async", "await", "launch", "withContext", "suspend"],
    slots: 4,
    par: 4,
    hint: "Launch both async blocks first, then await both. They run in parallel!",
    teaches: "parallel decomposition",
    validate: (ops) => {
      const ok = ops.length === 4 && ops[0] === "async" && ops[1] === "async" && ops[2] === "await" && ops[3] === "await";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "user", lane: "IO", label: "async { fetchUser() }", emoji: "\u26A1" },
              { taskId: "posts", lane: "IO", label: "async { fetchPosts() }", emoji: "\u26A1" },
              { taskId: "user", lane: "IO", label: "fetching user...", emoji: "\u{1F464}", isSuspend: true },
              { taskId: "posts", lane: "IO", label: "fetching posts...", emoji: "\u{1F4DD}", isSuspend: true },
              { taskId: "user", lane: "Main", label: "user.await()", emoji: "\u231B", switchFrom: "IO" },
              { taskId: "posts", lane: "Main", label: "posts.await()", emoji: "\u231B", switchFrom: "IO" },
            ]
          : [{ taskId: "user", lane: "Main", label: "Not parallel!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 10,
    name: "Structured Concurrency",
    description: "Use coroutineScope to ensure all children complete before continuing",
    tasks: [
      { id: "taskA", name: "taskA()", emoji: "\u{1F7E6}", description: "Task A" },
      { id: "taskB", name: "taskB()", emoji: "\u{1F7E9}", description: "Task B" },
    ],
    targetThreads: { taskA: "Default", taskB: "Default" },
    availableOps: ["coroutineScope", "launch", "async", "suspend", "delay"],
    slots: 3,
    par: 3,
    hint: "coroutineScope waits for all launched children to complete",
    teaches: "structured concurrency",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "coroutineScope" && ops[1] === "launch" && ops[2] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "taskA", lane: "Main", label: "coroutineScope {", emoji: "\u{1F4E6}" },
              { taskId: "taskA", lane: "Default", label: "launch { taskA() }", emoji: "\u{1F7E6}", switchFrom: "Main" },
              { taskId: "taskB", lane: "Default", label: "launch { taskB() }", emoji: "\u{1F7E9}" },
              { taskId: "taskA", lane: "Default", label: "taskA done", emoji: "\u2705", isSuspend: true },
              { taskId: "taskB", lane: "Default", label: "taskB done", emoji: "\u2705" },
              { taskId: "taskA", lane: "Main", label: "} // all done", emoji: "\u{1F4E6}", switchFrom: "Default" },
            ]
          : [{ taskId: "taskA", lane: "Main", label: "Missing scope!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 11,
    name: "Error in Scope",
    description: "When one child fails in coroutineScope, other children get cancelled",
    tasks: [
      { id: "good", name: "goodTask()", emoji: "\u2705", description: "Succeeding task" },
      { id: "bad", name: "failTask()", emoji: "\u{1F4A5}", description: "Failing task" },
    ],
    targetThreads: { good: "Default", bad: "Default" },
    availableOps: ["coroutineScope", "launch", "cancel", "supervisorScope"],
    slots: 2,
    par: 2,
    hint: "In coroutineScope, if one child fails, all siblings are cancelled too",
    teaches: "error propagation",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "coroutineScope" && ops[1] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "good", lane: "Default", label: "launch { goodTask() }", emoji: "\u2705" },
              { taskId: "bad", lane: "Default", label: "launch { failTask() }", emoji: "\u{1F4A5}" },
              { taskId: "bad", lane: "Default", label: "EXCEPTION!", emoji: "\u274C", isError: true },
              { taskId: "good", lane: "Default", label: "cancelled!", emoji: "\u274C", isError: true },
              { taskId: "good", lane: "Main", label: "scope catches error", emoji: "\u{1F4E6}", switchFrom: "Default" },
            ]
          : [{ taskId: "good", lane: "Main", label: "Wrong approach!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 12,
    name: "SupervisorScope",
    description: "Use supervisorScope so one child's failure doesn't cancel siblings",
    tasks: [
      { id: "safe", name: "safeTask()", emoji: "\u{1F6E1}\uFE0F", description: "Protected task" },
      { id: "risky", name: "riskyTask()", emoji: "\u26A0\uFE0F", description: "May fail" },
    ],
    targetThreads: { safe: "Default", risky: "Default" },
    availableOps: ["supervisorScope", "launch", "coroutineScope", "cancel"],
    slots: 3,
    par: 3,
    hint: "supervisorScope lets children fail independently without cancelling siblings",
    teaches: "supervisor scope",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "supervisorScope" && ops[1] === "launch" && ops[2] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "safe", lane: "Main", label: "supervisorScope {", emoji: "\u{1F3D7}\uFE0F" },
              { taskId: "safe", lane: "Default", label: "launch { safeTask() }", emoji: "\u{1F6E1}\uFE0F", switchFrom: "Main" },
              { taskId: "risky", lane: "Default", label: "launch { riskyTask() }", emoji: "\u26A0\uFE0F" },
              { taskId: "risky", lane: "Default", label: "EXCEPTION!", emoji: "\u274C", isError: true },
              { taskId: "safe", lane: "Default", label: "still running!", emoji: "\u2705" },
              { taskId: "safe", lane: "Main", label: "} // safe done", emoji: "\u{1F3D7}\uFE0F", switchFrom: "Default" },
            ]
          : [{ taskId: "safe", lane: "Main", label: "Use supervisorScope!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },

  /* ---------- Block 3: Flow (13-18) ---------- */
  {
    id: 13,
    name: "Cold Flow",
    description: "Create a flow that emits values, then collect them",
    tasks: [
      { id: "emit", name: "emit values", emoji: "\u{1F30A}", description: "Emit 1, 2, 3" },
      { id: "recv", name: "collect", emoji: "\u{1FAA3}", description: "Receive values" },
    ],
    targetThreads: { emit: "Default", recv: "Main" },
    availableOps: ["flow", "collect", "launch", "channel"],
    slots: 2,
    par: 2,
    hint: "A Flow is cold: it doesn't produce values until someone calls collect",
    teaches: "flow basics",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "flow" && ops[1] === "collect";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "emit", lane: "Default", label: "flow { emit(1) }", emoji: "\u{1F30A}" },
              { taskId: "emit", lane: "Default", label: "flow { emit(2) }", emoji: "\u{1F30A}" },
              { taskId: "emit", lane: "Default", label: "flow { emit(3) }", emoji: "\u{1F30A}" },
              { taskId: "recv", lane: "Main", label: ".collect { }", emoji: "\u{1FAA3}", switchFrom: "Default" },
            ]
          : [{ taskId: "emit", lane: "Main", label: "Need flow + collect!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 14,
    name: "Flow Operators",
    description: "Create a flow, transform with withContext, then collect the results",
    tasks: [
      { id: "produce", name: "produce values", emoji: "\u{1F30A}", description: "Emit raw data" },
      { id: "transform", name: "transform", emoji: "\u{1F504}", description: "Map/filter data" },
      { id: "consume", name: "collect results", emoji: "\u{1FAA3}", description: "Consume results" },
    ],
    targetThreads: { produce: "IO", transform: "Default", consume: "Main" },
    availableOps: ["flow", "withContext", "collect", "launch", "suspend"],
    slots: 3,
    par: 3,
    hint: "Chain: flow produces, withContext transforms on a different dispatcher, collect consumes",
    teaches: "flow operators",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "flow" && ops[1] === "withContext" && ops[2] === "collect";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "produce", lane: "IO", label: "flow { emit(raw) }", emoji: "\u{1F30A}" },
              { taskId: "transform", lane: "Default", label: ".map { transform() }", emoji: "\u{1F504}", switchFrom: "IO" },
              { taskId: "consume", lane: "Main", label: ".collect { use(it) }", emoji: "\u{1FAA3}", switchFrom: "Default" },
            ]
          : [{ taskId: "produce", lane: "Main", label: "Wrong chain!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 15,
    name: "Flow on Dispatcher",
    description: "Emit flow values on IO dispatcher, then collect on Main",
    tasks: [
      { id: "emitIO", name: "emit on IO", emoji: "\u{1F30A}", description: "IO-bound emission" },
      { id: "switch", name: "switch context", emoji: "\u{1F504}", description: "Change dispatcher" },
      { id: "collectMain", name: "collect on Main", emoji: "\u{1FAA3}", description: "Collect on Main" },
    ],
    targetThreads: { emitIO: "IO", switch: "Default", collectMain: "Main" },
    availableOps: ["flow", "withContext", "collect", "launch", "async"],
    slots: 3,
    par: 3,
    hint: "Use flowOn(Dispatchers.IO) or withContext to control which dispatcher your flow emits on",
    teaches: "flow dispatcher control",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "flow" && ops[1] === "withContext" && ops[2] === "collect";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "emitIO", lane: "IO", label: "flow { emit() }.flowOn(IO)", emoji: "\u{1F30A}" },
              { taskId: "emitIO", lane: "IO", label: "emitting data...", emoji: "\u{1F30A}", isSuspend: true },
              { taskId: "switch", lane: "Default", label: "withContext switch", emoji: "\u{1F504}", switchFrom: "IO" },
              { taskId: "collectMain", lane: "Main", label: ".collect { update() }", emoji: "\u{1FAA3}", switchFrom: "Default" },
            ]
          : [{ taskId: "emitIO", lane: "Main", label: "Wrong dispatchers!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 16,
    name: "StateFlow",
    description: "Maintain state with a StateFlow that emits and observers collect",
    tasks: [
      { id: "state", name: "MutableStateFlow", emoji: "\u{1F4CA}", description: "Mutable state holder" },
      { id: "observe", name: "observe changes", emoji: "\u{1F440}", description: "Collect state updates" },
    ],
    targetThreads: { state: "Main", observe: "Main" },
    availableOps: ["flow", "collect", "launch", "coroutineScope"],
    slots: 2,
    par: 2,
    hint: "StateFlow is a special flow that holds current state. Use flow to create, collect to observe.",
    teaches: "StateFlow concept",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "flow" && ops[1] === "collect";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "state", lane: "Main", label: "MutableStateFlow(0)", emoji: "\u{1F4CA}" },
              { taskId: "state", lane: "Main", label: "state.value = 1", emoji: "\u{1F4CA}" },
              { taskId: "state", lane: "Main", label: "state.value = 2", emoji: "\u{1F4CA}" },
              { taskId: "observe", lane: "Main", label: ".collect { update UI }", emoji: "\u{1F440}" },
            ]
          : [{ taskId: "state", lane: "Main", label: "Need flow + collect!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 17,
    name: "SharedFlow",
    description: "Broadcast events to multiple collectors using SharedFlow",
    tasks: [
      { id: "broadcast", name: "SharedFlow", emoji: "\u{1F4E2}", description: "Event broadcaster" },
      { id: "sub1", name: "subscriber 1", emoji: "\u{1F464}", description: "First collector" },
      { id: "sub2", name: "subscriber 2", emoji: "\u{1F464}", description: "Second collector" },
    ],
    targetThreads: { broadcast: "Default", sub1: "Main", sub2: "Main" },
    availableOps: ["flow", "collect", "launch", "coroutineScope", "async"],
    slots: 3,
    par: 3,
    hint: "SharedFlow broadcasts to multiple collectors. Use launch for each subscriber.",
    teaches: "SharedFlow broadcast",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "flow" && ops[1] === "collect" && ops[2] === "collect";
      const alt = ops.length === 3 && ops[0] === "launch" && ops[1] === "collect" && ops[2] === "collect";
      const pass = ok || alt;
      return {
        success: pass,
        mainBlocked: false,
        timeline: pass
          ? [
              { taskId: "broadcast", lane: "Default", label: "SharedFlow emit(event)", emoji: "\u{1F4E2}" },
              { taskId: "sub1", lane: "Main", label: "sub1.collect { }", emoji: "\u{1F464}", switchFrom: "Default" },
              { taskId: "sub2", lane: "Main", label: "sub2.collect { }", emoji: "\u{1F464}" },
            ]
          : [{ taskId: "broadcast", lane: "Main", label: "Need broadcast + collect!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 18,
    name: "Channel",
    description: "Use a Channel for hot producer-consumer communication between coroutines",
    tasks: [
      { id: "ch", name: "Channel<Int>", emoji: "\u{1F4E1}", description: "Create channel" },
      { id: "send", name: "send()", emoji: "\u{1F4E4}", description: "Send values" },
      { id: "receive", name: "receive()", emoji: "\u{1F4E5}", description: "Receive values" },
    ],
    targetThreads: { ch: "Default", send: "IO", receive: "Main" },
    availableOps: ["channel", "launch", "collect", "async", "withContext"],
    slots: 3,
    par: 3,
    hint: "Channel is hot: create it, launch a producer to send, launch a consumer to receive",
    teaches: "channel communication",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "channel" && ops[1] === "launch" && ops[2] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "ch", lane: "Default", label: "Channel<Int>()", emoji: "\u{1F4E1}" },
              { taskId: "send", lane: "IO", label: "launch { send(1) }", emoji: "\u{1F4E4}", switchFrom: "Default" },
              { taskId: "send", lane: "IO", label: "send(2)", emoji: "\u{1F4E4}" },
              { taskId: "receive", lane: "Main", label: "launch { receive() }", emoji: "\u{1F4E5}", switchFrom: "IO" },
              { taskId: "receive", lane: "Main", label: "received: 1, 2", emoji: "\u2705" },
            ]
          : [{ taskId: "ch", lane: "Main", label: "Need Channel + launches!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },

  /* ---------- Block 4: Advanced (19-25) ---------- */
  {
    id: 19,
    name: "Timeout",
    description: "Prevent a slow network call from hanging forever using withTimeout",
    tasks: [
      { id: "slow", name: "slowApi()", emoji: "\u{1F422}", description: "Slow API call" },
      { id: "timeout", name: "timeout guard", emoji: "\u23F0", description: "5 second limit" },
    ],
    targetThreads: { slow: "IO", timeout: "Main" },
    availableOps: ["withContext", "delay", "cancel", "launch", "async"],
    slots: 2,
    par: 2,
    hint: "withContext switches dispatcher, delay sets the timeout boundary. Think: context + non-blocking wait.",
    teaches: "timeout pattern",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "withContext" && ops[1] === "delay";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "slow", lane: "IO", label: "withTimeout(5000) { slowApi() }", emoji: "\u{1F422}" },
              { taskId: "slow", lane: "IO", label: "running...", emoji: "\u23F1\uFE0F", isSuspend: true },
              { taskId: "timeout", lane: "Main", label: "TimeoutCancellationException!", emoji: "\u23F0", switchFrom: "IO", isError: true },
              { taskId: "timeout", lane: "Main", label: "caught & handled", emoji: "\u2705" },
            ]
          : [{ taskId: "slow", lane: "Main", label: "Need timeout guard!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 20,
    name: "Cancellation",
    description: "Launch a long-running task, then cooperatively cancel it",
    tasks: [
      { id: "longTask", name: "longTask()", emoji: "\u267E\uFE0F", description: "Infinite loop task" },
      { id: "cancelIt", name: "cancel job", emoji: "\u274C", description: "Stop it gracefully" },
    ],
    targetThreads: { longTask: "Default", cancelIt: "Main" },
    availableOps: ["launch", "cancel", "delay", "suspend", "async"],
    slots: 2,
    par: 2,
    hint: "launch returns a Job. Call cancel() on it to cooperatively cancel the coroutine.",
    teaches: "cooperative cancellation",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "launch" && ops[1] === "cancel";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "longTask", lane: "Default", label: "val job = launch { while(isActive) }", emoji: "\u267E\uFE0F" },
              { taskId: "longTask", lane: "Default", label: "running...", emoji: "\u{1F504}", isSuspend: true },
              { taskId: "longTask", lane: "Default", label: "running...", emoji: "\u{1F504}" },
              { taskId: "cancelIt", lane: "Main", label: "job.cancel()", emoji: "\u274C", switchFrom: "Default" },
              { taskId: "longTask", lane: "Default", label: "CancellationException", emoji: "\u{1F6D1}", isError: true, switchFrom: "Main" },
              { taskId: "cancelIt", lane: "Main", label: "job cancelled!", emoji: "\u2705", switchFrom: "Default" },
            ]
          : [{ taskId: "longTask", lane: "Main", label: "Need launch + cancel!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 21,
    name: "Exception Handling",
    description: "Handle exceptions in coroutines with structured concurrency",
    tasks: [
      { id: "scope", name: "scope", emoji: "\u{1F4E6}", description: "Concurrency boundary" },
      { id: "risky", name: "riskyWork()", emoji: "\u{1F4A3}", description: "May throw exception" },
    ],
    targetThreads: { scope: "Main", risky: "Default" },
    availableOps: ["coroutineScope", "launch", "supervisorScope", "cancel", "async"],
    slots: 2,
    par: 2,
    hint: "Wrap in coroutineScope + launch. The scope catches and re-throws child exceptions.",
    teaches: "exception handling",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "coroutineScope" && ops[1] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "scope", lane: "Main", label: "coroutineScope {", emoji: "\u{1F4E6}" },
              { taskId: "risky", lane: "Default", label: "launch { riskyWork() }", emoji: "\u{1F4A3}", switchFrom: "Main" },
              { taskId: "risky", lane: "Default", label: "Exception thrown!", emoji: "\u{1F4A5}", isError: true },
              { taskId: "scope", lane: "Main", label: "try/catch handles it", emoji: "\u2705", switchFrom: "Default" },
            ]
          : [{ taskId: "scope", lane: "Main", label: "Need proper scoping!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 22,
    name: "Mutex",
    description: "Use a Mutex to prevent a race condition on shared counter",
    tasks: [
      { id: "inc1", name: "increment()", emoji: "\u{1F522}", description: "Increment counter" },
      { id: "inc2", name: "increment()", emoji: "\u{1F522}", description: "Increment counter" },
    ],
    targetThreads: { inc1: "Default", inc2: "Default" },
    availableOps: ["launch", "coroutineScope", "withContext", "delay", "suspend"],
    slots: 2,
    par: 2,
    hint: "coroutineScope ensures structured concurrency. launch each increment inside a Mutex.withLock.",
    teaches: "mutual exclusion",
    validate: (ops) => {
      const ok = ops.length === 2 && ops[0] === "coroutineScope" && ops[1] === "launch";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "inc1", lane: "Default", label: "mutex.withLock { counter++ }", emoji: "\u{1F512}" },
              { taskId: "inc1", lane: "Default", label: "counter = 1", emoji: "\u{1F522}", isSuspend: true },
              { taskId: "inc2", lane: "Default", label: "mutex.withLock { counter++ }", emoji: "\u{1F512}" },
              { taskId: "inc2", lane: "Default", label: "counter = 2 (correct!)", emoji: "\u2705" },
            ]
          : [
              { taskId: "inc1", lane: "Default", label: "counter++ (race!)", emoji: "\u26A0\uFE0F", isError: true },
              { taskId: "inc2", lane: "Default", label: "counter = 1 (wrong!)", emoji: "\u274C", isError: true },
            ],
      };
    },
  },
  {
    id: 23,
    name: "Parallel Map",
    description: "Process a list of items concurrently using async per item",
    tasks: [
      { id: "item1", name: "process(1)", emoji: "\u{1F4E6}", description: "Process item 1" },
      { id: "item2", name: "process(2)", emoji: "\u{1F4E6}", description: "Process item 2" },
      { id: "item3", name: "process(3)", emoji: "\u{1F4E6}", description: "Process item 3" },
    ],
    targetThreads: { item1: "Default", item2: "Default", item3: "Default" },
    availableOps: ["async", "await", "coroutineScope", "launch", "withContext", "suspend"],
    slots: 3,
    par: 3,
    hint: "Use coroutineScope + async for each item. awaitAll() collects all results.",
    teaches: "parallel map pattern",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "coroutineScope" && ops[1] === "async" && ops[2] === "await";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "item1", lane: "Main", label: "coroutineScope {", emoji: "\u{1F4E6}" },
              { taskId: "item1", lane: "Default", label: "async { process(1) }", emoji: "\u26A1", switchFrom: "Main" },
              { taskId: "item2", lane: "Default", label: "async { process(2) }", emoji: "\u26A1" },
              { taskId: "item3", lane: "Default", label: "async { process(3) }", emoji: "\u26A1" },
              { taskId: "item1", lane: "Default", label: "all processing...", emoji: "\u{1F504}", isSuspend: true },
              { taskId: "item1", lane: "Main", label: "awaitAll() = [r1, r2, r3]", emoji: "\u231B", switchFrom: "Default" },
            ]
          : [{ taskId: "item1", lane: "Main", label: "Not parallel!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 24,
    name: "Retry Pattern",
    description: "Implement exponential backoff retry for flaky API calls",
    tasks: [
      { id: "attempt1", name: "attempt 1", emoji: "\u{1F504}", description: "First try" },
      { id: "attempt2", name: "attempt 2", emoji: "\u{1F504}", description: "Retry with delay" },
      { id: "attempt3", name: "attempt 3", emoji: "\u2705", description: "Final success" },
    ],
    targetThreads: { attempt1: "IO", attempt2: "IO", attempt3: "IO" },
    availableOps: ["suspend", "delay", "withContext", "launch", "cancel", "async"],
    slots: 3,
    par: 3,
    hint: "Retry pattern: suspend to mark suspendable, delay between retries, withContext for IO",
    teaches: "retry with backoff",
    validate: (ops) => {
      const ok = ops.length === 3 && ops[0] === "suspend" && ops[1] === "delay" && ops[2] === "withContext";
      return {
        success: ok,
        mainBlocked: false,
        timeline: ok
          ? [
              { taskId: "attempt1", lane: "IO", label: "suspend fun retry() {", emoji: "\u{1F504}" },
              { taskId: "attempt1", lane: "IO", label: "attempt 1: FAIL", emoji: "\u274C", isError: true },
              { taskId: "attempt2", lane: "IO", label: "delay(1000L) // backoff", emoji: "\u23F1\uFE0F", isSuspend: true },
              { taskId: "attempt2", lane: "IO", label: "attempt 2: FAIL", emoji: "\u274C", isError: true },
              { taskId: "attempt3", lane: "IO", label: "delay(2000L) // exp backoff", emoji: "\u23F1\uFE0F", isSuspend: true },
              { taskId: "attempt3", lane: "IO", label: "attempt 3: SUCCESS!", emoji: "\u2705" },
            ]
          : [{ taskId: "attempt1", lane: "Main", label: "Wrong retry pattern!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
  {
    id: 25,
    name: "API Aggregator",
    description: "Fetch from 2 APIs in parallel, combine results, handle errors",
    tasks: [
      { id: "api1", name: "usersAPI()", emoji: "\u{1F465}", description: "Users endpoint" },
      { id: "api2", name: "postsAPI()", emoji: "\u{1F4F0}", description: "Posts endpoint" },
      { id: "combine", name: "combine()", emoji: "\u{1F504}", description: "Merge results" },
      { id: "handle", name: "errorHandler", emoji: "\u{1F6E1}\uFE0F", description: "Error safety" },
    ],
    targetThreads: { api1: "IO", api2: "IO", combine: "Main", handle: "Main" },
    availableOps: ["async", "await", "coroutineScope", "supervisorScope", "withContext", "launch", "cancel"],
    slots: 4,
    par: 4,
    hint: "coroutineScope for structure, async+async for parallel calls, await to combine. Full pattern!",
    teaches: "complete coroutine pattern",
    validate: (ops) => {
      const ok = ops.length === 4 && ops[0] === "coroutineScope" && ops[1] === "async" && ops[2] === "async" && ops[3] === "await";
      const alt = ops.length === 4 && ops[0] === "async" && ops[1] === "async" && ops[2] === "coroutineScope" && ops[3] === "await";
      const pass = ok || alt;
      return {
        success: pass,
        mainBlocked: false,
        timeline: pass
          ? [
              { taskId: "api1", lane: "Main", label: "coroutineScope {", emoji: "\u{1F4E6}" },
              { taskId: "api1", lane: "IO", label: "async { usersAPI() }", emoji: "\u{1F465}", switchFrom: "Main" },
              { taskId: "api2", lane: "IO", label: "async { postsAPI() }", emoji: "\u{1F4F0}" },
              { taskId: "api1", lane: "IO", label: "fetching users...", emoji: "\u{1F465}", isSuspend: true },
              { taskId: "api2", lane: "IO", label: "fetching posts...", emoji: "\u{1F4F0}", isSuspend: true },
              { taskId: "combine", lane: "Main", label: "val (users, posts) = await()", emoji: "\u231B", switchFrom: "IO" },
              { taskId: "combine", lane: "Main", label: "combine(users, posts)", emoji: "\u{1F504}" },
              { taskId: "handle", lane: "Main", label: "} // success!", emoji: "\u2705" },
            ]
          : [{ taskId: "api1", lane: "Main", label: "Need full pattern!", emoji: "\u26A0\uFE0F", isError: true }],
      };
    },
  },
];

/* ============ Level Blocks (for display grouping) ============ */
const LEVEL_BLOCKS = [
  { title: "Block 1 \u2014 Basics", start: 0, end: 7 },
  { title: "Block 2 \u2014 Async / Await", start: 7, end: 12 },
  { title: "Block 3 \u2014 Flow", start: 12, end: 18 },
  { title: "Block 4 \u2014 Advanced", start: 18, end: 25 },
];

/* ============ Helpers ============ */
const PROGRESS_KEY = "coroutines-game-progress";
const CONFETTI_COLORS = ["#06b6d4", "#22d3ee", "#0891b2", "#818cf8", "#f472b6", "#34d399", "#fbbf24", "#fb923c", "#a78bfa", "#60a5fa"];

function loadProgress(): Record<number, LevelProgress> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<number, LevelProgress>) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* noop */
  }
}

/* ============ Timeline Lane Component ============ */
function TimelineLane({
  laneInfo,
  events,
  animStep,
  mainBlocked,
}: {
  laneInfo: (typeof LANES)[number];
  events: TimelineEvent[];
  animStep: number;
  mainBlocked: boolean;
}) {
  const isBlocked = mainBlocked && laneInfo.id === "Main";
  const laneEvents = events
    .map((ev, idx) => ({ ...ev, globalIndex: idx }))
    .filter((ev) => ev.lane === laneInfo.id);

  return (
    <div
      className={`${styles.lane} ${styles[laneInfo.className]} ${isBlocked ? styles.blockWarning : ""}`}
    >
      <div className={styles.laneLabel}>
        <span className={styles.laneLabelDot} style={{ backgroundColor: laneInfo.dotColor }} />
        {laneInfo.label}
      </div>
      <div className={styles.laneContent}>
        {laneEvents.map((ev) => {
          const visible = animStep >= ev.globalIndex;
          if (!visible) return null;
          return (
            <motion.div
              key={`${ev.taskId}-${ev.globalIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`${styles.taskBlock} ${styles[getLaneStyle(ev.lane)]} ${ev.isError ? styles.taskBlockError : ""} ${styles.taskSlideIn}`}
              style={{ animationDelay: `${(ev.globalIndex - animStep) * 0.1}s` }}
            >
              <span className={styles.taskEmoji}>{ev.emoji}</span>
              {ev.label}
            </motion.div>
          );
        })}
        {laneEvents.some((ev) => ev.isSuspend && animStep >= ev.globalIndex) && (
          <div className={styles.suspendGap} />
        )}
      </div>
      {isBlocked && <span className={styles.blockWarningIcon}>{"\u26A0\uFE0F"}</span>}
    </div>
  );
}

/* ============ Main Component ============ */
export default function CoroutinesGamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedOps, setPlacedOps] = useState<(string | null)[]>([]);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [mainBlocked, setMainBlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState<Record<number, LevelProgress>>({});
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animTimers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const level = LEVELS[currentLevel] || LEVELS[0];

  const startLevel = useCallback((levelIndex: number) => {
    setCurrentLevel(levelIndex);
    setPlacedOps(new Array(LEVELS[levelIndex].slots).fill(null));
    setSelectedOp(null);
    setIsRunning(false);
    setAnimStep(-1);
    setTimelineEvents([]);
    setMainBlocked(false);
    setShowHint(false);
    setResult(null);
    setEarnedStars(0);
    setShowConfetti(false);
    setScreen("game");
  }, []);

  const resetLevel = useCallback(() => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    setPlacedOps(new Array(level.slots).fill(null));
    setSelectedOp(null);
    setIsRunning(false);
    setAnimStep(-1);
    setTimelineEvents([]);
    setMainBlocked(false);
    setResult(null);
    setEarnedStars(0);
    setShowConfetti(false);
  }, [level]);

  const placeOperator = useCallback(
    (slotIndex: number) => {
      if (isRunning) return;
      if (placedOps[slotIndex]) {
        setPlacedOps((prev) => {
          const next = [...prev];
          next[slotIndex] = null;
          return next;
        });
        return;
      }
      if (!selectedOp) return;
      setPlacedOps((prev) => {
        const next = [...prev];
        next[slotIndex] = selectedOp;
        return next;
      });
      setSelectedOp(null);
    },
    [isRunning, selectedOp, placedOps]
  );

  const runPipeline = useCallback(() => {
    const filledOps = placedOps.filter(Boolean) as string[];
    if (filledOps.length === 0) return;

    setIsRunning(true);
    setResult(null);
    setAnimStep(-1);
    setMainBlocked(false);

    const validation = level.validate(filledOps);
    setTimelineEvents(validation.timeline);
    setMainBlocked(validation.mainBlocked);

    const timers: NodeJS.Timeout[] = [];
    validation.timeline.forEach((_, i) => {
      const timer = setTimeout(() => setAnimStep(i), (i + 1) * 700);
      timers.push(timer);
    });

    const finalTimer = setTimeout(() => {
      if (validation.success) {
        const opsUsed = filledOps.length;
        const stars = opsUsed <= level.par ? 3 : opsUsed <= level.par + 1 ? 2 : 1;
        setEarnedStars(stars);
        setResult("success");
        setShowConfetti(true);

        const score = stars * 100 + Math.max(0, (level.par - opsUsed + 1) * 50);
        const newProgress = { ...progress };
        const existing = newProgress[level.id];
        if (!existing || stars > existing.stars || score > existing.bestScore) {
          newProgress[level.id] = {
            completed: true,
            stars: Math.max(stars, existing?.stars || 0),
            bestScore: Math.max(score, existing?.bestScore || 0),
          };
          setProgress(newProgress);
          saveProgress(newProgress);
        }
      } else {
        setResult("fail");
      }
      setIsRunning(false);
    }, (validation.timeline.length + 1) * 700 + 300);
    timers.push(finalTimer);
    animTimers.current = timers;
  }, [placedOps, level, progress]);

  const buildKotlinCode = useCallback(() => {
    const ops = placedOps.filter(Boolean) as string[];
    if (ops.length === 0) return "// Place operators to build code";
    let code = "import kotlinx.coroutines.*\n\n";
    code += "fun main() = runBlocking {\n";
    let indent = "    ";
    for (const opId of ops) {
      const op = OPERATORS[opId];
      if (!op) continue;
      switch (opId) {
        case "coroutineScope":
          code += `${indent}coroutineScope {\n`;
          indent += "    ";
          break;
        case "supervisorScope":
          code += `${indent}supervisorScope {\n`;
          indent += "    ";
          break;
        case "launch":
          code += `${indent}launch {\n${indent}    doWork()\n${indent}}\n`;
          break;
        case "async":
          code += `${indent}val deferred = async {\n${indent}    fetchData()\n${indent}}\n`;
          break;
        case "await":
          code += `${indent}val result = deferred.await()\n`;
          break;
        case "suspend":
          code += `${indent}// suspend fun fetchUser()\n${indent}fetchUser()\n`;
          break;
        case "delay":
          code += `${indent}delay(1000L)\n`;
          break;
        case "withContext":
          code += `${indent}withContext(Dispatchers.IO) {\n${indent}    // switched context\n${indent}}\n`;
          break;
        case "flow":
          code += `${indent}val myFlow = flow {\n${indent}    emit(value)\n${indent}}\n`;
          break;
        case "collect":
          code += `${indent}myFlow.collect { println(it) }\n`;
          break;
        case "channel":
          code += `${indent}val channel = Channel<Int>()\n`;
          break;
        case "cancel":
          code += `${indent}job.cancel()\n`;
          break;
        default:
          code += `${indent}${op.code}\n`;
      }
    }
    if (ops.includes("coroutineScope") || ops.includes("supervisorScope")) {
      indent = indent.slice(4);
      code += `${indent}}\n`;
    }
    code += "}";
    return code;
  }, [placedOps]);

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId === 1) return true;
      return progress[levelId - 1]?.completed || false;
    },
    [progress]
  );

  const totalStars = Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = LEVELS.length * 3;
  const canRun = placedOps.some(Boolean) && !isRunning;

  useEffect(() => {
    return () => {
      animTimers.current.forEach(clearTimeout);
    };
  }, []);

  /* ============ Menu Screen ============ */
  if (screen === "menu") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.menuScreen}
          >
            <div className={styles.menuIcon}>{"\u{1F3BC}"}</div>
            <h1 className={styles.menuTitle}>Coroutine Conductor</h1>
            <p className={styles.menuSubtitle}>
              {t("coroutines-game-subtitle") !== "coroutines-game-subtitle"
                ? t("coroutines-game-subtitle")
                : "Master Kotlin Coroutines by routing tasks across thread dispatchers. Avoid blocking Main!"}
            </p>
            <div className={styles.menuStats}>
              <span>{"\u2B50"} {totalStars}/{maxStars}</span>
              <span>{"\u{1F4CA}"} {Object.values(progress).filter((p) => p.completed).length}/{LEVELS.length}</span>
            </div>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("levels")}
            >
              <PlayIcon /> {t("coroutines-game-play") !== "coroutines-game-play" ? t("coroutines-game-play") : "Play"}
            </motion.button>
            <motion.a
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
              whileHover={{ x: -3 }}
            >
              <ArrowBack /> {t("coroutines-game-back-hub") !== "coroutines-game-back-hub" ? t("coroutines-game-back-hub") : "Back to Hub"}
            </motion.a>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ Level Select Screen ============ */
  if (screen === "levels") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <div className={styles.levelsScreen}>
            <div className={styles.levelsHeader}>
              <button className={styles.iconBtn} onClick={() => setScreen("menu")}>
                <ArrowBack />
              </button>
              <h2 className={styles.levelsTitle}>
                {t("coroutines-game-select-level") !== "coroutines-game-select-level"
                  ? t("coroutines-game-select-level")
                  : "Select Level"}
              </h2>
              <span className={styles.levelsStars}>{"\u2B50"} {totalStars}/{maxStars}</span>
            </div>
            {LEVEL_BLOCKS.map((block) => (
              <div key={block.title}>
                <div className={styles.blockTitle}>{block.title}</div>
                <div className={styles.levelsGrid}>
                  {LEVELS.slice(block.start, block.end).map((lvl) => {
                    const idx = lvl.id - 1;
                    const unlocked = isLevelUnlocked(lvl.id);
                    const prog = progress[lvl.id];
                    return (
                      <motion.button
                        key={lvl.id}
                        className={`${styles.levelCard} ${!unlocked ? styles.levelLocked : ""} ${prog?.completed ? styles.levelCompleted : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (idx - block.start) * 0.04 }}
                        whileHover={unlocked ? { scale: 1.04, y: -4 } : {}}
                        whileTap={unlocked ? { scale: 0.96 } : {}}
                        onClick={() => unlocked && startLevel(idx)}
                        disabled={!unlocked}
                      >
                        {!unlocked && <LockIcon className={styles.lockIcon} />}
                        <span className={styles.levelNum}>{lvl.id}</span>
                        <span className={styles.levelName}>{lvl.name}</span>
                        <div className={styles.levelStars}>
                          {[1, 2, 3].map((s) =>
                            prog && prog.stars >= s ? (
                              <StarIcon key={s} className={styles.starFilled} />
                            ) : (
                              <StarBorderIcon key={s} className={styles.starEmpty} />
                            )
                          )}
                        </div>
                        {prog?.completed && <span className={styles.levelTeaches}>{lvl.teaches}</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ All Levels Complete Screen ============ */
  if (screen === "complete") {
    return (
      <main>
        <DeveloperHeader />
        <div className={styles.container}>
          <div className={styles.bgEffects}>
            <div className={styles.bgGradient1} />
            <div className={styles.bgGradient2} />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.completeScreen}
          >
            <TrophyIcon className={styles.completeTrophy} />
            <h1 className={styles.completeTitle}>
              {t("coroutines-game-complete-title") !== "coroutines-game-complete-title"
                ? t("coroutines-game-complete-title")
                : "Coroutine Master!"}
            </h1>
            <p className={styles.completeSubtitle}>
              {t("coroutines-game-complete-subtitle") !== "coroutines-game-complete-subtitle"
                ? t("coroutines-game-complete-subtitle")
                : "You've mastered Kotlin Coroutines - dispatchers, structured concurrency, flows, and more!"}
            </p>
            <div className={styles.completeStats}>
              <span>{"\u2B50"} {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.completeCode}>
              <p className={styles.completeCodeLabel}>
                {t("coroutines-game-learned") !== "coroutines-game-learned"
                  ? t("coroutines-game-learned")
                  : "What you learned"}
              </p>
              <pre className={styles.codeBlock}>
{`import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking {
    // Structured concurrency
    coroutineScope {
        // Parallel decomposition
        val users = async(Dispatchers.IO) { fetchUsers() }
        val posts = async(Dispatchers.IO) { fetchPosts() }

        // Flow processing
        flow { emit(users.await()) }
            .map { transform(it) }
            .flowOn(Dispatchers.Default)
            .collect { updateUI(it) }

        // Cancellation & timeout
        withTimeout(5000L) {
            retryWithBackoff { riskyCall() }
        }
    }
    println("All done!")
}`}
              </pre>
            </div>
            <div className={styles.completeBtns}>
              <button className={styles.playBtn} onClick={() => setScreen("levels")}>
                {t("coroutines-game-replay") !== "coroutines-game-replay" ? t("coroutines-game-replay") : "Replay Levels"}
              </button>
              <a href={createLocalizedPath("/developer-section")} className={styles.backLink}>
                <HomeIcon /> {t("coroutines-game-back-hub") !== "coroutines-game-back-hub" ? t("coroutines-game-back-hub") : "Back to Hub"}
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ Game Screen ============ */
  return (
    <main>
      <DeveloperHeader />
      <div className={styles.container}>
        <div className={styles.bgEffects}>
          <div className={styles.bgGradient1} />
          <div className={styles.bgGradient2} />
        </div>

        <div className={styles.gameScreen}>
          {/* Header */}
          <div className={styles.gameHeader}>
            <button className={styles.iconBtn} onClick={() => setScreen("levels")}>
              <ArrowBack />
            </button>
            <div className={styles.gameHeaderInfo}>
              <span className={styles.gameLevelBadge}>Level {level.id}</span>
              <h2 className={styles.gameLevelName}>{level.name}</h2>
            </div>
            <div className={styles.gameLevelStars}>
              {[1, 2, 3].map((s) =>
                earnedStars >= s ? (
                  <StarIcon key={s} className={styles.starFilled} />
                ) : (
                  <StarBorderIcon key={s} className={styles.starEmpty} />
                )
              )}
            </div>
          </div>

          {/* Description */}
          <p className={styles.gameDesc}>{level.description}</p>

          {/* Tasks Panel */}
          <div className={styles.taskPanel}>
            <div className={styles.taskPanelTitle}>
              {t("coroutines-game-tasks") !== "coroutines-game-tasks" ? t("coroutines-game-tasks") : "Tasks to Route"}
            </div>
            <div className={styles.taskList}>
              {level.tasks.map((task) => {
                const isDone = result === "success";
                return (
                  <div
                    key={task.id}
                    className={`${styles.taskItem} ${isDone ? styles.taskItemDone : ""}`}
                  >
                    <span className={styles.taskItemIcon}>{task.emoji}</span>
                    <span>{task.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}>
                      {"\u2192"} {level.targetThreads[task.id]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className={styles.timeline}>
            <div className={styles.timelineLegend}>
              {LANES.map((l) => (
                <div key={l.id} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: l.dotColor }} />
                  {l.label}
                </div>
              ))}
            </div>
            {LANES.map((laneInfo) => (
              <TimelineLane
                key={laneInfo.id}
                laneInfo={laneInfo}
                events={timelineEvents}
                animStep={animStep}
                mainBlocked={mainBlocked}
              />
            ))}
          </div>

          {/* Operator Pipeline Slots */}
          <div className={styles.pipeline}>
            {placedOps.map((opId, slotIndex) => {
              const op = opId ? OPERATORS[opId] : null;
              return (
                <div key={slotIndex} className={styles.pipelineStep}>
                  {slotIndex > 0 && <ArrowRight className={styles.pipelineArrow} />}
                  <div className={styles.pipelineNode}>
                    <div className={styles.pipelineLabel}>
                      {op ? op.emoji : `SLOT ${slotIndex + 1}`}
                    </div>
                    <motion.button
                      className={`${styles.pipelineSlot} ${op ? styles.pipelineSlotFilled : ""} ${
                        isRunning && animStep >= 0 ? styles.pipelineSlotActive : ""
                      }`}
                      style={op ? { borderColor: `${op.color}66`, background: `${op.color}15` } : {}}
                      whileHover={!isRunning ? { scale: 1.03 } : {}}
                      whileTap={!isRunning ? { scale: 0.97 } : {}}
                      onClick={() => placeOperator(slotIndex)}
                    >
                      {op ? (
                        <span style={{ color: op.color, fontWeight: 600 }}>{op.label}</span>
                      ) : (
                        <span className={styles.slotPlaceholder}>
                          {selectedOp
                            ? (t("coroutines-game-click-place") !== "coroutines-game-click-place" ? t("coroutines-game-click-place") : "Click to place")
                            : (t("coroutines-game-select-op") !== "coroutines-game-select-op" ? t("coroutines-game-select-op") : "Select operator")}
                        </span>
                      )}
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Message */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${styles.resultMessage} ${result === "success" ? styles.resultSuccess : styles.resultFail}`}
              >
                {result === "success" ? (
                  <>
                    <span>
                      {"\u{1F389}"} {t("coroutines-game-success") !== "coroutines-game-success" ? t("coroutines-game-success") : "All tasks routed correctly!"}
                    </span>
                    <span className={styles.resultStars}>
                      {"\u2B50".repeat(earnedStars)}
                    </span>
                  </>
                ) : (
                  <span>
                    {"\u274C"} {t("coroutines-game-try-again") !== "coroutines-game-try-again" ? t("coroutines-game-try-again") : "Wrong routing! Try again."}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Kotlin Code Preview */}
          {result === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.codePreview}
            >
              <span className={styles.codePreviewLabel}>
                {t("coroutines-game-your-pipeline") !== "coroutines-game-your-pipeline"
                  ? t("coroutines-game-your-pipeline")
                  : "Your Kotlin Code"}
              </span>
              <pre className={styles.codeBlock}>{buildKotlinCode()}</pre>
            </motion.div>
          )}

          {/* Operator Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxLabel}>
              {t("coroutines-game-operators") !== "coroutines-game-operators" ? t("coroutines-game-operators") : "Coroutine Operators"}
            </div>
            <div className={styles.toolboxGrid}>
              {level.availableOps.map((opId) => {
                const op = OPERATORS[opId];
                if (!op) return null;
                const isSelected = selectedOp === opId;
                return (
                  <motion.button
                    key={opId}
                    className={`${styles.opCard} ${isSelected ? styles.opCardSelected : ""}`}
                    style={{
                      borderColor: isSelected ? op.color : `${op.color}44`,
                      background: isSelected ? `${op.color}20` : `${op.color}08`,
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => !isRunning && setSelectedOp(isSelected ? null : opId)}
                    disabled={isRunning}
                  >
                    <span className={styles.opEmoji}>{op.emoji}</span>
                    <span className={styles.opLabel} style={{ color: op.color }}>
                      {op.label}
                    </span>
                    <span className={styles.opDesc}>{op.description}</span>
                    <span className={styles.opCode}>{op.code}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionBar}>
            <button
              className={styles.hintBtn}
              onClick={() => setShowHint(!showHint)}
            >
              <HintIcon /> {t("coroutines-game-hint") !== "coroutines-game-hint" ? t("coroutines-game-hint") : "Hint"}
            </button>
            <button className={styles.resetBtn} onClick={resetLevel}>
              <ResetIcon /> {t("coroutines-game-reset") !== "coroutines-game-reset" ? t("coroutines-game-reset") : "Reset"}
            </button>
            <motion.button
              className={styles.runBtn}
              whileHover={canRun ? { scale: 1.04 } : {}}
              whileTap={canRun ? { scale: 0.96 } : {}}
              onClick={runPipeline}
              disabled={!canRun}
            >
              <PlayIcon /> {isRunning
                ? (t("coroutines-game-running") !== "coroutines-game-running" ? t("coroutines-game-running") : "Running...")
                : (t("coroutines-game-run") !== "coroutines-game-run" ? t("coroutines-game-run") : "Run")}
            </motion.button>
            {result === "success" && currentLevel < LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => startLevel(currentLevel + 1)}
              >
                {t("coroutines-game-next") !== "coroutines-game-next" ? t("coroutines-game-next") : "Next"} <ArrowRight />
              </motion.button>
            )}
            {result === "success" && currentLevel === LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => setScreen("complete")}
              >
                {t("coroutines-game-finish") !== "coroutines-game-finish" ? t("coroutines-game-finish") : "Finish"} <TrophyIcon />
              </motion.button>
            )}
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.hintBox}
              >
                <HintIcon className={styles.hintIcon} />
                <div>
                  <p className={styles.hintText}>{level.hint}</p>
                  <p className={styles.hintTeaches}>
                    <strong>{t("coroutines-game-teaches") !== "coroutines-game-teaches" ? t("coroutines-game-teaches") : "Teaches"}:</strong> {level.teaches}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confetti */}
        {showConfetti && (
          <div className={styles.confettiContainer}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={styles.confetti}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  width: `${6 + Math.random() * 6}px`,
                  height: `${6 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
