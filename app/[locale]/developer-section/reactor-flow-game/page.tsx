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
  EmojiEvents as TrophyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./ReactorFlowGame.module.css";

/* ================================================================
   Types
   ================================================================ */
type Screen = "menu" | "levels" | "game" | "complete";

interface StreamEvent {
  value: number | string;
  time: number;
  type: "next" | "error" | "complete";
}

interface Stream {
  id: string;
  label: string;
  color: string;
  events: StreamEvent[];
}

interface FlowOperator {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  reactorCode: string;
  category: string;
  process: (inputs: Stream[], params?: Record<string, unknown>) => StreamEvent[];
}

interface Level {
  id: number;
  name: string;
  description: string;
  inputStreams: Stream[];
  targetOutput: StreamEvent[];
  availableOps: string[];
  slots: number;
  par: number;
  hint: string;
  teaches: string;
  block: number;
}

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

/* ================================================================
   Constants & Helpers
   ================================================================ */
const PROGRESS_KEY = "reactor-flow-game-progress";
const MARBLE_COLORS = [
  "#818cf8", "#22d3ee", "#34d399", "#fb923c", "#f472b6",
  "#fbbf24", "#60a5fa", "#ef4444", "#a78bfa", "#2dd4bf",
];

function getMarbleColor(value: number | string): string {
  if (typeof value === "string") {
    if (value === "ERR") return "#ef4444";
    const hash = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return MARBLE_COLORS[hash % MARBLE_COLORS.length];
  }
  return MARBLE_COLORS[Math.abs(value) % MARBLE_COLORS.length];
}

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

function eventsEqual(a: StreamEvent[], b: StreamEvent[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((ev, i) => {
    const bev = b[i];
    return ev.type === bev.type && String(ev.value) === String(bev.value);
  });
}

/** Create events from a simple array of values */
function vals(values: (number | string)[], startTime = 0, interval = 500): StreamEvent[] {
  return values.map((v, i) => ({
    value: v,
    time: startTime + i * interval,
    type: v === "ERR" ? "error" as const : "next" as const,
  }));
}

/** Create a complete event */
function complete(time: number): StreamEvent {
  return { value: "|", time, type: "complete" };
}

/** Get only "next" values from events */
function nextValues(events: StreamEvent[]): (number | string)[] {
  return events.filter((e) => e.type === "next").map((e) => e.value);
}

/** Get numeric values from events */
function numValues(events: StreamEvent[]): number[] {
  return events
    .filter((e) => e.type === "next" && typeof e.value === "number")
    .map((e) => e.value as number);
}

/* ================================================================
   Operator Definitions (22 operators)
   ================================================================ */
const OPERATORS: Record<string, FlowOperator> = {
  /* --- Combining (6) --- */
  merge: {
    id: "merge",
    label: "merge",
    emoji: "\u{1F500}",
    color: "#818cf8",
    description: "Interleave elements by emission time",
    reactorCode: "Flux.merge(a, b)",
    category: "combining",
    process: (inputs) => {
      const all = inputs.flatMap((s) => s.events.filter((e) => e.type === "next"));
      all.sort((a, b) => a.time - b.time);
      return all.map((e, i) => ({ ...e, time: i * 500 }));
    },
  },
  concat: {
    id: "concat",
    label: "concat",
    emoji: "\u27A1\uFE0F",
    color: "#34d399",
    description: "Sequential: all of A, then all of B",
    reactorCode: "Flux.concat(a, b)",
    category: "combining",
    process: (inputs) => {
      const result: StreamEvent[] = [];
      let t = 0;
      for (const s of inputs) {
        for (const e of s.events) {
          if (e.type === "next") {
            result.push({ ...e, time: t });
            t += 500;
          }
        }
      }
      return result;
    },
  },
  zip: {
    id: "zip",
    label: "zip",
    emoji: "\u{1F91D}",
    color: "#f472b6",
    description: "Pair elements 1:1 from each stream (sum)",
    reactorCode: "Flux.zip(a, b, (x, y) -> x + y)",
    category: "combining",
    process: (inputs) => {
      if (inputs.length < 2) return [];
      const aVals = numValues(inputs[0].events);
      const bVals = numValues(inputs[1].events);
      const len = Math.min(aVals.length, bVals.length);
      return Array.from({ length: len }, (_, i) => ({
        value: aVals[i] + bVals[i],
        time: i * 500,
        type: "next" as const,
      }));
    },
  },
  combineLatest: {
    id: "combineLatest",
    label: "combineLatest",
    emoji: "\u{1F517}",
    color: "#fb923c",
    description: "Combine latest values when either emits",
    reactorCode: "Flux.combineLatest(a, b, (x, y) -> x + y)",
    category: "combining",
    process: (inputs) => {
      if (inputs.length < 2) return [];
      const allEvents: { value: number; time: number; source: number }[] = [];
      inputs.forEach((s, si) => {
        s.events.forEach((e) => {
          if (e.type === "next" && typeof e.value === "number") {
            allEvents.push({ value: e.value, time: e.time, source: si });
          }
        });
      });
      allEvents.sort((a, b) => a.time - b.time);
      const latest: (number | null)[] = [null, null];
      const result: StreamEvent[] = [];
      for (const ev of allEvents) {
        latest[ev.source] = ev.value;
        if (latest[0] !== null && latest[1] !== null) {
          result.push({
            value: latest[0] + latest[1],
            time: result.length * 500,
            type: "next",
          });
        }
      }
      return result;
    },
  },
  mergeWith: {
    id: "mergeWith",
    label: "mergeWith",
    emoji: "\u{1F500}",
    color: "#818cf8",
    description: "Merge another stream into this one",
    reactorCode: "a.mergeWith(b)",
    category: "combining",
    process: (inputs) => {
      const all = inputs.flatMap((s) => s.events.filter((e) => e.type === "next"));
      all.sort((a, b) => a.time - b.time);
      return all.map((e, i) => ({ ...e, time: i * 500 }));
    },
  },
  concatWith: {
    id: "concatWith",
    label: "concatWith",
    emoji: "\u27A1\uFE0F",
    color: "#34d399",
    description: "Concat another stream after this one",
    reactorCode: "a.concatWith(b)",
    category: "combining",
    process: (inputs) => {
      const result: StreamEvent[] = [];
      let t = 0;
      for (const s of inputs) {
        for (const e of s.events) {
          if (e.type === "next") {
            result.push({ ...e, time: t });
            t += 500;
          }
        }
      }
      return result;
    },
  },

  /* --- FlatMapping (3) --- */
  flatMap: {
    id: "flatMap",
    label: "flatMap",
    emoji: "\u{1F30A}",
    color: "#22d3ee",
    description: "Map each element to a stream, merge results",
    reactorCode: ".flatMap(x -> Flux.just(x, x*10))",
    category: "flatmapping",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      const result: StreamEvent[] = [];
      let t = 0;
      for (const v of values) {
        result.push({ value: v, time: t, type: "next" });
        t += 250;
        result.push({ value: v * 10, time: t, type: "next" });
        t += 250;
      }
      return result;
    },
  },
  concatMap: {
    id: "concatMap",
    label: "concatMap",
    emoji: "\u{1F30A}",
    color: "#22d3ee",
    description: "Like flatMap but preserves order",
    reactorCode: ".concatMap(x -> Flux.just(x, x*10))",
    category: "flatmapping",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      const result: StreamEvent[] = [];
      let t = 0;
      for (const v of values) {
        result.push({ value: v, time: t, type: "next" });
        t += 500;
        result.push({ value: v * 10, time: t, type: "next" });
        t += 500;
      }
      return result;
    },
  },
  switchMap: {
    id: "switchMap",
    label: "switchMap",
    emoji: "\u{1F504}",
    color: "#a78bfa",
    description: "Cancel previous inner on new emission",
    reactorCode: ".switchMap(x -> Flux.just(x, x*10))",
    category: "flatmapping",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      if (values.length === 0) return [];
      const last = values[values.length - 1];
      return [
        { value: last, time: 0, type: "next" as const },
        { value: last * 10, time: 500, type: "next" as const },
      ];
    },
  },

  /* --- Error Handling (4) --- */
  onErrorReturn: {
    id: "onErrorReturn",
    label: "onErrorReturn",
    emoji: "\u{1F6E1}\uFE0F",
    color: "#fbbf24",
    description: "Replace error with fallback value (-1)",
    reactorCode: ".onErrorReturn(-1)",
    category: "errors",
    process: (inputs) => {
      const result: StreamEvent[] = [];
      let t = 0;
      for (const e of inputs[0].events) {
        if (e.type === "error") {
          result.push({ value: -1, time: t, type: "next" });
          break;
        }
        if (e.type === "next") {
          result.push({ ...e, time: t });
          t += 500;
        }
      }
      return result;
    },
  },
  onErrorResume: {
    id: "onErrorResume",
    label: "onErrorResume",
    emoji: "\u{1F504}",
    color: "#fbbf24",
    description: "Switch to fallback stream [0,0] on error",
    reactorCode: ".onErrorResume(e -> Flux.just(0, 0))",
    category: "errors",
    process: (inputs) => {
      const result: StreamEvent[] = [];
      let t = 0;
      for (const e of inputs[0].events) {
        if (e.type === "error") {
          result.push({ value: 0, time: t, type: "next" });
          t += 500;
          result.push({ value: 0, time: t, type: "next" });
          break;
        }
        if (e.type === "next") {
          result.push({ ...e, time: t });
          t += 500;
        }
      }
      return result;
    },
  },
  retry: {
    id: "retry",
    label: "retry",
    emoji: "\u{1F501}",
    color: "#f87171",
    description: "Retry the source on error (once)",
    reactorCode: ".retry(1)",
    category: "errors",
    process: (inputs) => {
      const src = inputs[0].events;
      const result: StreamEvent[] = [];
      let t = 0;
      // First attempt: emit up to error
      for (const e of src) {
        if (e.type === "error") break;
        if (e.type === "next") {
          result.push({ ...e, time: t });
          t += 500;
        }
      }
      // Retry: re-emit all next events from source (assuming retry succeeds)
      for (const e of src) {
        if (e.type === "next") {
          result.push({ ...e, time: t });
          t += 500;
        }
      }
      return result;
    },
  },
  timeout: {
    id: "timeout",
    label: "timeout",
    emoji: "\u23F0",
    color: "#ef4444",
    description: "Error if gap between emissions > 2s",
    reactorCode: ".timeout(Duration.ofSeconds(2))",
    category: "errors",
    process: (inputs) => {
      const result: StreamEvent[] = [];
      const events = inputs[0].events.filter((e) => e.type === "next");
      let t = 0;
      for (let i = 0; i < events.length; i++) {
        if (i > 0 && events[i].time - events[i - 1].time > 2000) {
          result.push({ value: "ERR", time: t, type: "error" });
          break;
        }
        result.push({ ...events[i], time: t });
        t += 500;
      }
      return result;
    },
  },

  /* --- Buffering (3) --- */
  buffer: {
    id: "buffer",
    label: "buffer(3)",
    emoji: "\u{1F5C2}\uFE0F",
    color: "#06b6d4",
    description: "Collect elements into groups of 3, sum each",
    reactorCode: ".buffer(3).map(list -> list.stream().reduce(0, Integer::sum))",
    category: "buffering",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      const result: StreamEvent[] = [];
      let t = 0;
      for (let i = 0; i < values.length; i += 3) {
        const chunk = values.slice(i, i + 3);
        const sum = chunk.reduce((a, b) => a + b, 0);
        result.push({ value: sum, time: t, type: "next" });
        t += 500;
      }
      return result;
    },
  },
  window: {
    id: "window",
    label: "window(2)",
    emoji: "\u{1FA9F}",
    color: "#06b6d4",
    description: "Split stream into windows of 2, sum each",
    reactorCode: ".window(2).flatMap(w -> w.reduce(0, Integer::sum))",
    category: "buffering",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      const result: StreamEvent[] = [];
      let t = 0;
      for (let i = 0; i < values.length; i += 2) {
        const chunk = values.slice(i, i + 2);
        const sum = chunk.reduce((a, b) => a + b, 0);
        result.push({ value: sum, time: t, type: "next" });
        t += 500;
      }
      return result;
    },
  },
  groupBy: {
    id: "groupBy",
    label: "groupBy",
    emoji: "\u{1F3F7}\uFE0F",
    color: "#06b6d4",
    description: "Split by even/odd, evens first then odds",
    reactorCode: '.groupBy(x -> x % 2 == 0 ? "even" : "odd")',
    category: "buffering",
    process: (inputs) => {
      const values = numValues(inputs[0].events);
      const evens = values.filter((v) => v % 2 === 0);
      const odds = values.filter((v) => v % 2 !== 0);
      const combined = [...evens, ...odds];
      return combined.map((v, i) => ({ value: v, time: i * 500, type: "next" as const }));
    },
  },

  /* --- Timing (3) --- */
  delay: {
    id: "delay",
    label: "delay",
    emoji: "\u23F3",
    color: "#94a3b8",
    description: "Delay each emission by 500ms",
    reactorCode: ".delayElements(Duration.ofMillis(500))",
    category: "timing",
    process: (inputs) => {
      return inputs[0].events
        .filter((e) => e.type === "next")
        .map((e, i) => ({ ...e, time: (i + 1) * 500 }));
    },
  },
  sample: {
    id: "sample",
    label: "sample",
    emoji: "\u{1F4F8}",
    color: "#94a3b8",
    description: "Take most recent value at intervals",
    reactorCode: ".sample(Duration.ofSeconds(1))",
    category: "timing",
    process: (inputs) => {
      const events = inputs[0].events.filter((e) => e.type === "next");
      const result: StreamEvent[] = [];
      const interval = 1000;
      let t = interval;
      const maxTime = events.length > 0 ? events[events.length - 1].time + interval : 0;
      while (t <= maxTime) {
        let latest: StreamEvent | null = null;
        for (const e of events) {
          if (e.time < t) latest = e;
          else break;
        }
        if (latest && (result.length === 0 || result[result.length - 1].value !== latest.value)) {
          result.push({ ...latest, time: result.length * 500 });
        }
        t += interval;
      }
      return result;
    },
  },
  throttleFirst: {
    id: "throttleFirst",
    label: "throttleFirst",
    emoji: "\u{1F6A6}",
    color: "#94a3b8",
    description: "Emit first, suppress for duration",
    reactorCode: ".throttleFirst(Duration.ofSeconds(1))",
    category: "timing",
    process: (inputs) => {
      const events = inputs[0].events.filter((e) => e.type === "next");
      const result: StreamEvent[] = [];
      let lastEmit = -Infinity;
      const window = 1000;
      for (const e of events) {
        if (e.time - lastEmit >= window) {
          result.push({ ...e, time: result.length * 500 });
          lastEmit = e.time;
        }
      }
      return result;
    },
  },

  /* --- Side Effects & Terminal (3) --- */
  doOnNext: {
    id: "doOnNext",
    label: "doOnNext",
    emoji: "\u{1F441}\uFE0F",
    color: "#e879f9",
    description: "Side effect on each element (logging)",
    reactorCode: ".doOnNext(System.out::println)",
    category: "terminal",
    process: (inputs) => {
      return inputs[0].events
        .filter((e) => e.type === "next")
        .map((e, i) => ({ ...e, time: i * 500 }));
    },
  },
  collectList: {
    id: "collectList",
    label: "collectList",
    emoji: "\u{1F4E6}",
    color: "#e879f9",
    description: "Collect all into a single list",
    reactorCode: ".collectList()",
    category: "terminal",
    process: (inputs) => {
      const values = nextValues(inputs[0].events);
      const listStr = "[" + values.join(",") + "]";
      return [{ value: listStr, time: 0, type: "next" as const }];
    },
  },
  then: {
    id: "then",
    label: "then",
    emoji: "\u23ED\uFE0F",
    color: "#e879f9",
    description: "Ignore values, signal only completion",
    reactorCode: ".then()",
    category: "terminal",
    process: () => {
      return [complete(0)];
    },
  },
};

/* ================================================================
   Level Definitions (30 levels)
   ================================================================ */
const LEVELS: Level[] = [
  /* ---- Block 1: Combining (1-8) ---- */
  {
    id: 1, name: "Merge Two", block: 1,
    description: "Merge two streams — elements interleave by emission time",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#818cf8", events: vals([1, 2, 3], 0, 1000) },
      { id: "b", label: "Stream B", color: "#f472b6", events: vals([4, 5, 6], 500, 1000) },
    ],
    targetOutput: vals([1, 4, 2, 5, 3, 6]),
    availableOps: ["merge", "concat", "zip"],
    slots: 1, par: 1,
    hint: "merge() interleaves elements by their emission time from both streams",
    teaches: "Flux.merge()",
  },
  {
    id: 2, name: "Merge Timing", block: 1,
    description: "Two streams emit at alternating times — merge them in order",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#818cf8", events: [
        { value: 1, time: 0, type: "next" }, { value: 3, time: 1000, type: "next" }, { value: 5, time: 2000, type: "next" },
      ]},
      { id: "b", label: "Stream B", color: "#f472b6", events: [
        { value: 2, time: 500, type: "next" }, { value: 4, time: 1500, type: "next" },
      ]},
    ],
    targetOutput: vals([1, 2, 3, 4, 5]),
    availableOps: ["merge", "concat", "combineLatest"],
    slots: 1, par: 1,
    hint: "merge() preserves the temporal ordering of elements from both streams",
    teaches: "Flux.merge() timing",
  },
  {
    id: 3, name: "Concat", block: 1,
    description: "Concatenate two streams — all of A, then all of B",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#34d399", events: vals([1, 2, 3]) },
      { id: "b", label: "Stream B", color: "#fb923c", events: vals([4, 5, 6]) },
    ],
    targetOutput: vals([1, 2, 3, 4, 5, 6]),
    availableOps: ["concat", "merge", "zip"],
    slots: 1, par: 1,
    hint: "concat() waits for stream A to complete, then subscribes to stream B",
    teaches: "Flux.concat()",
  },
  {
    id: 4, name: "Concat Order", block: 1,
    description: "Concat preserves internal order of each stream",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#34d399", events: vals([3, 1]) },
      { id: "b", label: "Stream B", color: "#fb923c", events: vals([2, 4]) },
    ],
    targetOutput: vals([3, 1, 2, 4]),
    availableOps: ["concat", "merge", "concatWith"],
    slots: 1, par: 1,
    hint: "concat keeps the element order within each stream — A fully, then B fully",
    teaches: "Flux.concat() ordering",
  },
  {
    id: 5, name: "Zip Pairs", block: 1,
    description: "Pair elements 1:1 and sum them",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#f472b6", events: vals([1, 2, 3]) },
      { id: "b", label: "Stream B", color: "#22d3ee", events: vals([10, 20, 30]) },
    ],
    targetOutput: vals([11, 22, 33]),
    availableOps: ["zip", "merge", "combineLatest"],
    slots: 1, par: 1,
    hint: "zip() pairs the Nth element from A with the Nth from B and combines them",
    teaches: "Flux.zip()",
  },
  {
    id: 6, name: "Zip Unequal", block: 1,
    description: "Zip with streams of different lengths — shorter wins",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#f472b6", events: vals([1, 2, 3, 4]) },
      { id: "b", label: "Stream B", color: "#22d3ee", events: vals([10, 20]) },
    ],
    targetOutput: vals([11, 22]),
    availableOps: ["zip", "merge", "concat"],
    slots: 1, par: 1,
    hint: "zip() completes when the shorter stream completes — extra elements are dropped",
    teaches: "Flux.zip() with unequal lengths",
  },
  {
    id: 7, name: "CombineLatest", block: 1,
    description: "Combine the latest value from each stream on every emission",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#fb923c", events: [
        { value: 1, time: 0, type: "next" }, { value: 2, time: 1000, type: "next" },
      ]},
      { id: "b", label: "Stream B", color: "#22d3ee", events: [
        { value: 10, time: 500, type: "next" }, { value: 20, time: 1500, type: "next" },
      ]},
    ],
    targetOutput: vals([11, 12, 22]),
    availableOps: ["combineLatest", "zip", "merge"],
    slots: 1, par: 1,
    hint: "combineLatest() emits whenever either stream emits, combining with the latest from the other",
    teaches: "Flux.combineLatest()",
  },
  {
    id: 8, name: "Merge Then Zip", block: 1,
    description: "First merge two helper streams, then zip the result with a third stream concept",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#818cf8", events: vals([1, 2], 0, 1000) },
      { id: "b", label: "Stream B", color: "#f472b6", events: vals([3, 4], 500, 1000) },
    ],
    targetOutput: vals([1, 3, 2, 4]),
    availableOps: ["merge", "mergeWith", "concat", "zip"],
    slots: 1, par: 1,
    hint: "Use mergeWith to interleave elements by their emission time",
    teaches: "mergeWith()",
  },

  /* ---- Block 2: FlatMapping (9-14) ---- */
  {
    id: 9, name: "FlatMap Basics", block: 2,
    description: "Expand each element into [x, x*10] and merge",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#22d3ee", events: vals([1, 2, 3]) },
    ],
    targetOutput: vals([1, 10, 2, 20, 3, 30]),
    availableOps: ["flatMap", "concatMap", "switchMap"],
    slots: 1, par: 1,
    hint: "flatMap() transforms each element into a new stream and merges the results",
    teaches: "Flux.flatMap()",
  },
  {
    id: 10, name: "ConcatMap Order", block: 2,
    description: "Expand each element preserving strict order",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#22d3ee", events: vals([1, 2, 3]) },
    ],
    targetOutput: vals([1, 10, 2, 20, 3, 30]),
    availableOps: ["concatMap", "flatMap", "switchMap"],
    slots: 1, par: 1,
    hint: "concatMap() is like flatMap but waits for each inner stream to complete before the next",
    teaches: "Flux.concatMap()",
  },
  {
    id: 11, name: "SwitchMap", block: 2,
    description: "Only the last element's inner stream survives",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#a78bfa", events: vals([1, 2, 3]) },
    ],
    targetOutput: vals([3, 30]),
    availableOps: ["switchMap", "flatMap", "concatMap"],
    slots: 1, par: 1,
    hint: "switchMap() cancels the previous inner stream whenever a new element arrives",
    teaches: "Flux.switchMap()",
  },
  {
    id: 12, name: "FlatMap Merge", block: 2,
    description: "FlatMap one stream then merge with another",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#22d3ee", events: vals([1, 2]) },
      { id: "b", label: "Stream B", color: "#f472b6", events: vals([100], 250, 500) },
    ],
    targetOutput: vals([1, 10, 100, 2, 20]),
    availableOps: ["flatMap", "merge", "concat", "concatMap"],
    slots: 2, par: 2,
    hint: "First flatMap stream A to expand elements, then merge with stream B by time",
    teaches: "flatMap() + merge()",
  },
  {
    id: 13, name: "ConcatMap Chain", block: 2,
    description: "ConcatMap to expand, producing ordered pairs",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#22d3ee", events: vals([5, 10]) },
    ],
    targetOutput: vals([5, 50, 10, 100]),
    availableOps: ["concatMap", "flatMap", "switchMap", "merge"],
    slots: 1, par: 1,
    hint: "concatMap expands each value into [x, x*10] in strict order",
    teaches: "concatMap() ordering",
  },
  {
    id: 14, name: "Multi FlatMap", block: 2,
    description: "Concat two streams, then flatMap the result",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#34d399", events: vals([1]) },
      { id: "b", label: "Stream B", color: "#fb923c", events: vals([2]) },
    ],
    targetOutput: vals([1, 10, 2, 20]),
    availableOps: ["concat", "flatMap", "merge", "concatMap"],
    slots: 2, par: 2,
    hint: "First concat streams A and B, then flatMap to expand each value",
    teaches: "concat() + flatMap()",
  },

  /* ---- Block 3: Error Handling (15-20) ---- */
  {
    id: 15, name: "Error Return", block: 3,
    description: "Replace an error with a fallback value of -1",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#fbbf24", events: [
        ...vals([1, 2]),
        { value: "ERR", time: 1000, type: "error" },
      ]},
    ],
    targetOutput: vals([1, 2, -1]),
    availableOps: ["onErrorReturn", "onErrorResume", "retry"],
    slots: 1, par: 1,
    hint: "onErrorReturn() replaces the error signal with a default value and completes",
    teaches: "onErrorReturn()",
  },
  {
    id: 16, name: "Error Resume", block: 3,
    description: "Switch to a fallback stream [0, 0] on error",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#fbbf24", events: [
        { value: 1, time: 0, type: "next" },
        { value: "ERR", time: 500, type: "error" },
      ]},
    ],
    targetOutput: vals([1, 0, 0]),
    availableOps: ["onErrorResume", "onErrorReturn", "retry"],
    slots: 1, par: 1,
    hint: "onErrorResume() switches to an alternative stream when an error occurs",
    teaches: "onErrorResume()",
  },
  {
    id: 17, name: "Retry Once", block: 3,
    description: "Retry the source after error — second attempt succeeds",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#f87171", events: [
        { value: 1, time: 0, type: "next" },
        { value: "ERR", time: 500, type: "error" },
      ]},
    ],
    targetOutput: vals([1, 1]),
    availableOps: ["retry", "onErrorReturn", "onErrorResume"],
    slots: 1, par: 1,
    hint: "retry(1) resubscribes to the source once after an error, replaying all next events",
    teaches: "retry()",
  },
  {
    id: 18, name: "Timeout", block: 3,
    description: "Emit error if too much time passes between elements",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#ef4444", events: [
        { value: 1, time: 0, type: "next" },
        { value: 2, time: 3000, type: "next" },
      ]},
    ],
    targetOutput: [
      { value: 1, time: 0, type: "next" },
      { value: "ERR", time: 500, type: "error" },
    ],
    availableOps: ["timeout", "retry", "onErrorReturn"],
    slots: 1, par: 1,
    hint: "timeout() emits an error if no element arrives within the specified duration",
    teaches: "timeout()",
  },
  {
    id: 19, name: "Error + Merge", block: 3,
    description: "Handle error in stream A, then merge with stream B",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#fbbf24", events: [
        { value: 1, time: 0, type: "next" },
        { value: "ERR", time: 500, type: "error" },
      ]},
      { id: "b", label: "Stream B", color: "#818cf8", events: vals([10, 20], 0, 500) },
    ],
    targetOutput: vals([1, -1, 10, 20]),
    availableOps: ["onErrorReturn", "merge", "concat", "onErrorResume"],
    slots: 2, par: 2,
    hint: "First handle the error with onErrorReturn, then concat with stream B",
    teaches: "Error handling + combining",
  },
  {
    id: 20, name: "Retry + Fallback", block: 3,
    description: "Retry once, and if still error, return fallback -1",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#f87171", events: [
        { value: 1, time: 0, type: "next" },
        { value: "ERR", time: 500, type: "error" },
      ]},
    ],
    targetOutput: vals([1, 1, -1]),
    availableOps: ["retry", "onErrorReturn", "onErrorResume", "timeout"],
    slots: 2, par: 2,
    hint: "First retry once (which re-emits 1 then errors again), then onErrorReturn(-1)",
    teaches: "retry() + onErrorReturn()",
  },

  /* ---- Block 4: Buffering & Timing (21-26) ---- */
  {
    id: 21, name: "Buffer", block: 4,
    description: "Group elements into chunks of 3 and sum each chunk",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#06b6d4", events: vals([1, 2, 3, 4, 5, 6]) },
    ],
    targetOutput: vals([6, 15]),
    availableOps: ["buffer", "window", "groupBy"],
    slots: 1, par: 1,
    hint: "buffer(3) collects elements into groups of 3, then sums each group: [1+2+3, 4+5+6]",
    teaches: "buffer()",
  },
  {
    id: 22, name: "Window", block: 4,
    description: "Split into windows of 2 and sum each window",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#06b6d4", events: vals([1, 2, 3, 4, 5, 6]) },
    ],
    targetOutput: vals([3, 7, 11]),
    availableOps: ["window", "buffer", "groupBy"],
    slots: 1, par: 1,
    hint: "window(2) creates sub-streams of 2 elements each: [1+2, 3+4, 5+6]",
    teaches: "window()",
  },
  {
    id: 23, name: "GroupBy", block: 4,
    description: "Group by even/odd — evens first, then odds",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#06b6d4", events: vals([1, 2, 3, 4, 5, 6]) },
    ],
    targetOutput: vals([2, 4, 6, 1, 3, 5]),
    availableOps: ["groupBy", "buffer", "window"],
    slots: 1, par: 1,
    hint: "groupBy() splits the stream by a key function — even numbers first, then odd",
    teaches: "groupBy()",
  },
  {
    id: 24, name: "Sample", block: 4,
    description: "Sample the stream at regular intervals",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#94a3b8", events: [
        { value: 1, time: 0, type: "next" }, { value: 2, time: 400, type: "next" },
        { value: 3, time: 800, type: "next" }, { value: 4, time: 1200, type: "next" },
        { value: 5, time: 1600, type: "next" }, { value: 6, time: 2000, type: "next" },
      ]},
    ],
    targetOutput: vals([2, 4, 6]),
    availableOps: ["sample", "throttleFirst", "delay"],
    slots: 1, par: 1,
    hint: "sample() picks the most recent value at each sampling interval",
    teaches: "sample()",
  },
  {
    id: 25, name: "ThrottleFirst", block: 4,
    description: "Emit the first element, then suppress for a duration",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#94a3b8", events: [
        { value: 1, time: 0, type: "next" }, { value: 2, time: 300, type: "next" },
        { value: 3, time: 600, type: "next" }, { value: 4, time: 1100, type: "next" },
        { value: 5, time: 1400, type: "next" }, { value: 6, time: 1700, type: "next" },
      ]},
    ],
    targetOutput: vals([1, 4]),
    availableOps: ["throttleFirst", "sample", "delay"],
    slots: 1, par: 1,
    hint: "throttleFirst() emits the first value and then suppresses for the window duration",
    teaches: "throttleFirst()",
  },
  {
    id: 26, name: "Buffer + Concat", block: 4,
    description: "Buffer stream A into sums, then concat with stream B",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#06b6d4", events: vals([1, 2, 3]) },
      { id: "b", label: "Stream B", color: "#fb923c", events: vals([100, 200]) },
    ],
    targetOutput: vals([6, 100, 200]),
    availableOps: ["buffer", "concat", "merge", "window"],
    slots: 2, par: 2,
    hint: "First buffer(3) stream A into a single sum [6], then concat with stream B",
    teaches: "buffer() + concat()",
  },

  /* ---- Block 5: Advanced (27-30) ---- */
  {
    id: 27, name: "CollectList", block: 5,
    description: "Collect all elements into a single list emission",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#e879f9", events: vals([3, 1, 4, 1, 5]) },
    ],
    targetOutput: [{ value: "[3,1,4,1,5]", time: 0, type: "next" }],
    availableOps: ["collectList", "buffer", "then"],
    slots: 1, par: 1,
    hint: "collectList() waits for the stream to complete, then emits a single list of all values",
    teaches: "collectList()",
  },
  {
    id: 28, name: "DoOnNext + Merge", block: 5,
    description: "Log stream A elements (doOnNext), then merge with stream B",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#e879f9", events: vals([1, 2], 0, 1000) },
      { id: "b", label: "Stream B", color: "#818cf8", events: vals([10, 20], 500, 1000) },
    ],
    targetOutput: vals([1, 10, 2, 20]),
    availableOps: ["doOnNext", "merge", "concat", "zip"],
    slots: 2, par: 2,
    hint: "doOnNext is a pass-through for logging — apply it to A, then merge with B",
    teaches: "doOnNext() + merge()",
  },
  {
    id: 29, name: "Multi Pipeline", block: 5,
    description: "Merge two streams, then buffer(3) the combined result, and handle potential leftovers",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#818cf8", events: vals([1, 3, 5], 0, 1000) },
      { id: "b", label: "Stream B", color: "#f472b6", events: vals([2, 4, 6], 500, 1000) },
    ],
    targetOutput: vals([6, 15]),
    availableOps: ["merge", "buffer", "concat", "window", "groupBy"],
    slots: 2, par: 2,
    hint: "First merge to get [1,2,3,4,5,6], then buffer(3) to get sums [1+2+3, 4+5+6]",
    teaches: "merge() + buffer() pipeline",
  },
  {
    id: 30, name: "Grand Master", block: 5,
    description: "Concat two streams, then groupBy even/odd, then collectList the result",
    inputStreams: [
      { id: "a", label: "Stream A", color: "#fbbf24", events: vals([1, 2, 3]) },
      { id: "b", label: "Stream B", color: "#34d399", events: vals([4, 5, 6]) },
    ],
    targetOutput: [{ value: "[2,4,6,1,3,5]", time: 0, type: "next" }],
    availableOps: ["concat", "groupBy", "collectList", "merge", "buffer", "flatMap"],
    slots: 3, par: 3,
    hint: "Concat to get [1,2,3,4,5,6] -> groupBy for [2,4,6,1,3,5] -> collectList for the final list",
    teaches: "Complete reactive pipeline mastery",
  },
];

const BLOCK_INFO: { name: string; emoji: string }[] = [
  { name: "Combining", emoji: "\u{1F500}" },
  { name: "FlatMapping", emoji: "\u{1F30A}" },
  { name: "Error Handling", emoji: "\u{1F6E1}\uFE0F" },
  { name: "Buffering & Timing", emoji: "\u23F3" },
  { name: "Advanced", emoji: "\u{1F680}" },
];

/* ================================================================
   Pipeline Execution Logic
   ================================================================ */
function applyOperatorChain(ops: (string | null)[], inputStreams: Stream[]): StreamEvent[][] {
  const results: StreamEvent[][] = [];
  let currentStreams = [...inputStreams];

  for (const opId of ops) {
    if (!opId || !OPERATORS[opId]) continue;
    const op = OPERATORS[opId];
    const output = op.process(currentStreams);
    results.push(output);
    // The output becomes a single stream for the next operator
    currentStreams = [{
      id: "intermediate",
      label: "Intermediate",
      color: op.color,
      events: output,
    }];
  }
  return results;
}

/* ================================================================
   Marble Component
   ================================================================ */
function Marble({
  value, color, size = "md", delay: d = 0, showLog = false,
}: {
  value: number | string;
  color?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  showLog?: boolean;
}) {
  const c = color || getMarbleColor(value);
  const sz = size === "sm" ? "1.5rem" : size === "lg" ? "2.75rem" : "2.25rem";
  const fsz = size === "sm" ? "0.6rem" : size === "lg" ? "0.95rem" : "0.8rem";
  const isError = value === "ERR";
  const isComplete = value === "|";
  const isList = typeof value === "string" && value.startsWith("[");

  if (isComplete) {
    return (
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: d, duration: 0.3 }}
        className={styles.completionBar}
        style={{ background: c }}
      />
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: d, duration: 0.3, type: "spring", stiffness: 300 }}
        className={styles.errorMarker}
      >
        X
      </motion.div>
    );
  }

  if (isList) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: d, duration: 0.3, type: "spring", stiffness: 300 }}
        className={styles.listMarble}
        style={{
          background: `${c}22`,
          borderColor: `${c}88`,
        }}
      >
        <span className={styles.marbleValue}>{value}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: d, duration: 0.3, type: "spring", stiffness: 300 }}
      className={styles.marble}
      style={{
        width: sz,
        height: sz,
        background: `radial-gradient(circle at 35% 35%, ${c}dd, ${c}88)`,
        boxShadow: `0 0 10px ${c}66, inset 0 -2px 4px ${c}44`,
        fontSize: fsz,
      }}
    >
      <span className={styles.marbleValue}>{value}</span>
      {showLog && <span className={styles.marbleLog}>{"\uD83D\uDC41\uFE0F"}</span>}
    </motion.div>
  );
}

/* ================================================================
   StreamLane Component
   ================================================================ */
function StreamLane({
  stream,
  animating = false,
  animDelay = 0,
}: {
  stream: Stream;
  animating?: boolean;
  animDelay?: number;
}) {
  return (
    <div className={styles.streamLane}>
      <span className={styles.streamLabel} style={{ color: `${stream.color}cc` }}>
        {stream.label}
      </span>
      <div className={styles.streamLine} style={{ background: `${stream.color}33` }} />
      <div className={styles.marbleTrack}>
        {stream.events.map((e, i) => (
          <Marble
            key={`${stream.id}-${i}`}
            value={e.value}
            color={e.type === "error" ? "#ef4444" : stream.color}
            size="sm"
            delay={animating ? animDelay + i * 0.12 : i * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   Main Component
   ================================================================ */
export default function ReactorFlowGamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedOps, setPlacedOps] = useState<(string | null)[]>([]);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [intermediateResults, setIntermediateResults] = useState<StreamEvent[][]>([]);
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
    setIntermediateResults([]);
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
    setIntermediateResults([]);
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

    const results = applyOperatorChain(placedOps, level.inputStreams);
    setIntermediateResults(results);

    const timers: NodeJS.Timeout[] = [];
    let stepIdx = 0;
    for (let i = 0; i < placedOps.length; i++) {
      if (placedOps[i]) {
        const capturedStep = stepIdx;
        const timer = setTimeout(() => setAnimStep(capturedStep), (capturedStep + 1) * 800);
        timers.push(timer);
        stepIdx++;
      }
    }

    const finalTimer = setTimeout(() => {
      const finalOutput = results.length > 0 ? results[results.length - 1] : [];
      const success = eventsEqual(finalOutput, level.targetOutput);

      if (success) {
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
    }, (stepIdx + 1) * 800 + 400);
    timers.push(finalTimer);
    animTimers.current = timers;
  }, [placedOps, level, progress]);

  const buildReactorCode = useCallback(() => {
    const streams = level.inputStreams;
    let code = "";
    if (streams.length === 1) {
      const inputStr = nextValues(streams[0].events).join(", ");
      code = `Flux.just(${inputStr})`;
    } else {
      const aStr = nextValues(streams[0].events).join(", ");
      const bStr = nextValues(streams[1].events).join(", ");
      code = `Flux a = Flux.just(${aStr});\nFlux b = Flux.just(${bStr});\n\n`;
      const firstOp = placedOps.find(Boolean);
      if (firstOp && OPERATORS[firstOp]) {
        code += OPERATORS[firstOp].reactorCode;
      }
    }
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        if (streams.length === 1 || opId !== placedOps.find(Boolean)) {
          code += `\n    ${OPERATORS[opId].reactorCode}`;
        }
      }
    }
    code += "\n    .subscribe()";
    return code;
  }, [placedOps, level]);

  const totalStars = Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = LEVELS.length * 3;
  const canRun = placedOps.some(Boolean) && !isRunning;

  useEffect(() => {
    return () => {
      animTimers.current.forEach(clearTimeout);
    };
  }, []);

  /* ================================================================
     Menu Screen
     ================================================================ */
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
            <div className={styles.menuIcon}>{"\u{1F30A}"}</div>
            <h1 className={styles.menuTitle}>Reactor Flow</h1>
            <p className={styles.menuSubtitle}>
              {t("reactor-flow-subtitle")}
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
              <PlayIcon /> {t("reactor-flow-play")}
            </motion.button>
            <motion.a
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
              whileHover={{ x: -3 }}
            >
              <ArrowBack /> {t("reactor-flow-back-hub")}
            </motion.a>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ================================================================
     Level Select Screen
     ================================================================ */
  if (screen === "levels") {
    const blockGroups: { block: number; levels: Level[] }[] = [];
    for (const lvl of LEVELS) {
      const existing = blockGroups.find((g) => g.block === lvl.block);
      if (existing) existing.levels.push(lvl);
      else blockGroups.push({ block: lvl.block, levels: [lvl] });
    }

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
              <h2 className={styles.levelsTitle}>{t("reactor-flow-select-level")}</h2>
              <span className={styles.levelsStars}>{"\u2B50"} {totalStars}/{maxStars}</span>
            </div>

            {blockGroups.map((group) => {
              const info = BLOCK_INFO[group.block - 1];
              const completedInBlock = group.levels.filter((l) => progress[l.id]?.completed).length;
              return (
                <div key={group.block}>
                  <div className={styles.blockHeader}>
                    <span className={styles.blockEmoji}>{info.emoji}</span>
                    <span className={styles.blockTitle}>{info.name}</span>
                    <span className={styles.blockCount}>
                      {completedInBlock}/{group.levels.length}
                    </span>
                  </div>
                  <div className={styles.levelsGrid}>
                    {group.levels.map((lvl) => {
                      const idx = LEVELS.findIndex((l) => l.id === lvl.id);
                      const prog = progress[lvl.id];
                      return (
                        <motion.button
                          key={lvl.id}
                          className={`${styles.levelCard} ${prog?.completed ? styles.levelCompleted : ""}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          whileHover={{ scale: 1.04, y: -4 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => startLevel(idx)}
                        >
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
                          {prog?.completed && (
                            <span className={styles.levelTeaches}>{lvl.teaches}</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ================================================================
     Complete Screen
     ================================================================ */
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
            <h1 className={styles.completeTitle}>{t("reactor-flow-complete-title")}</h1>
            <p className={styles.completeSubtitle}>{t("reactor-flow-complete-subtitle")}</p>
            <div className={styles.completeStats}>
              <span>{"\u2B50"} {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.completeCode}>
              <p className={styles.completeCodeLabel}>{t("reactor-flow-learned")}</p>
              <pre className={styles.codeBlock}>
{`// Combining streams
Flux.merge(streamA, streamB)
Flux.concat(streamA, streamB)
Flux.zip(a, b, (x, y) -> x + y)
Flux.combineLatest(a, b, Math::addExact)

// FlatMapping
flux.flatMap(x -> Flux.just(x, x * 10))
flux.concatMap(x -> Flux.just(x, x * 10))
flux.switchMap(x -> Flux.just(x * 2))

// Error handling
flux.onErrorReturn(-1)
flux.onErrorResume(e -> Flux.just(0, 0))
flux.retry(1)
flux.timeout(Duration.ofSeconds(3))

// Buffering & Timing
flux.buffer(3)
flux.window(2).flatMap(w -> w.reduce(0, Integer::sum))
flux.groupBy(x -> x % 2 == 0 ? "even" : "odd")
flux.sample(Duration.ofSeconds(1))
flux.throttleFirst(Duration.ofSeconds(1))

// Terminal
flux.collectList()
flux.doOnNext(System.out::println)
flux.then()`}
              </pre>
            </div>
            <div className={styles.completeBtns}>
              <button className={styles.playBtn} onClick={() => setScreen("levels")}>
                {t("reactor-flow-replay")}
              </button>
              <a href={createLocalizedPath("/developer-section")} className={styles.backLink}>
                <HomeIcon /> {t("reactor-flow-back-hub")}
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ================================================================
     Game Screen
     ================================================================ */
  const finalOutput = intermediateResults.length > 0
    ? intermediateResults[intermediateResults.length - 1]
    : [];
  const showFinalOutput = animStep >= 0 && intermediateResults.length > 0 && animStep >= intermediateResults.length - 1;

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

          {/* Marble Diagram Timeline */}
          <div className={styles.timeline}>
            {/* Input Streams */}
            <div className={styles.sectionDivider}>
              <span className={styles.dividerLabel}>Input</span>
              <div className={styles.dividerLine} />
            </div>
            {level.inputStreams.map((stream) => (
              <StreamLane key={stream.id} stream={stream} />
            ))}

            {/* Operator Node(s) */}
            <div className={styles.sectionDivider}>
              <span className={styles.dividerLabel}>Operator Pipeline</span>
              <div className={styles.dividerLine} />
            </div>
            <div className={styles.operatorNode}>
              {placedOps.map((opId, idx) => {
                const op = opId ? OPERATORS[opId] : null;
                const isProcessing = (() => {
                  let filledIdx = 0;
                  for (let i = 0; i <= idx; i++) {
                    if (placedOps[i]) {
                      if (i === idx) return animStep === filledIdx;
                      filledIdx++;
                    }
                  }
                  return false;
                })();

                return (
                  <motion.div
                    key={idx}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    {idx > 0 && (
                      <ArrowRight
                        style={{
                          width: "1rem",
                          height: "1rem",
                          color: "rgba(245, 158, 11, 0.35)",
                        }}
                      />
                    )}
                    <motion.div
                      className={`${styles.operatorDiamond} ${isProcessing ? styles.operatorProcessing : ""}`}
                      style={{
                        borderColor: op ? `${op.color}66` : "rgba(255,255,255,0.12)",
                        background: op ? `${op.color}15` : "rgba(255,255,255,0.03)",
                        cursor: !isRunning ? "pointer" : "default",
                      }}
                      whileHover={!isRunning ? { scale: 1.08 } : {}}
                      whileTap={!isRunning ? { scale: 0.94 } : {}}
                      onClick={() => placeOperator(idx)}
                    >
                      <div className={styles.operatorDiamondInner}>
                        {op ? (
                          <>
                            <span className={styles.operatorEmoji}>{op.emoji}</span>
                            <span
                              className={styles.operatorSmallLabel}
                              style={{ color: op.color }}
                            >
                              {op.label}
                            </span>
                          </>
                        ) : (
                          <span
                            className={styles.operatorSmallLabel}
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          >
                            {selectedOp ? "+" : `S${idx + 1}`}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Intermediate results display */}
            <AnimatePresence>
              {intermediateResults.map((stepResult, idx) => {
                if (animStep < idx) return null;
                const opIdx = (() => {
                  let filled = 0;
                  for (let i = 0; i < placedOps.length; i++) {
                    if (placedOps[i]) {
                      if (filled === idx) return i;
                      filled++;
                    }
                  }
                  return 0;
                })();
                const op = placedOps[opIdx] ? OPERATORS[placedOps[opIdx]!] : null;

                // Only show intermediate for multi-slot levels, not the final result
                if (intermediateResults.length <= 1) return null;
                if (idx === intermediateResults.length - 1) return null;

                return (
                  <motion.div
                    key={`inter-${idx}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={styles.streamLane}
                    style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}
                  >
                    <span
                      className={styles.streamLabel}
                      style={{ color: op ? `${op.color}99` : "rgba(255,255,255,0.4)", fontSize: "0.5rem" }}
                    >
                      Step {idx + 1}
                    </span>
                    <div
                      className={styles.streamLine}
                      style={{ background: op ? `${op.color}22` : "rgba(255,255,255,0.08)" }}
                    />
                    <div className={styles.marbleTrack}>
                      {stepResult.map((e, i) => (
                        <Marble
                          key={`step-${idx}-${i}`}
                          value={e.value}
                          color={e.type === "error" ? "#ef4444" : op?.color}
                          size="sm"
                          delay={i * 0.06}
                        />
                      ))}
                      {stepResult.length === 0 && (
                        <span className={styles.emptyStream}>{"\u2205"}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Output */}
            <div className={styles.sectionDivider}>
              <span className={styles.dividerLabel}>Output</span>
              <div className={styles.dividerLine} />
            </div>
            <AnimatePresence>
              {showFinalOutput && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.streamLane}
                >
                  <span
                    className={styles.streamLabel}
                    style={{ color: result === "success" ? "#34d399cc" : result === "fail" ? "#f87171cc" : "#f59e0bcc" }}
                  >
                    Result
                  </span>
                  <div
                    className={styles.streamLine}
                    style={{ background: result === "success" ? "#34d39933" : result === "fail" ? "#f8717133" : "#f59e0b33" }}
                  />
                  <div className={styles.marbleTrack}>
                    {finalOutput.map((e, i) => (
                      <Marble
                        key={`out-${i}`}
                        value={e.value}
                        color={e.type === "error" ? "#ef4444" : result === "success" ? "#34d399" : "#f59e0b"}
                        size="sm"
                        delay={i * 0.08}
                        showLog={placedOps.includes("doOnNext")}
                      />
                    ))}
                    {finalOutput.length === 0 && (
                      <span className={styles.emptyStream}>{"\u2205"}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Time axis */}
            <div className={styles.timeAxis}>
              <div className={styles.timeArrow} />
              <span className={styles.timeLabel}>time</span>
            </div>
          </div>

          {/* Target vs Result comparison */}
          <div className={styles.outputComparison}>
            <div className={`${styles.outputPanel} ${styles.outputPanelTarget}`}>
              <div className={styles.outputLabel} style={{ color: "#f59e0baa" }}>
                {"\u{1F3AF}"} Target Output
              </div>
              <div className={styles.outputMarbles}>
                {level.targetOutput.map((e, i) => (
                  <Marble
                    key={`target-${i}`}
                    value={e.value}
                    color={e.type === "error" ? "#ef4444" : "#f59e0b"}
                    size="sm"
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>
            <div
              className={`${styles.outputPanel} ${styles.outputPanelResult} ${
                result === "success" ? styles.outputSuccess : result === "fail" ? styles.outputFail : ""
              }`}
            >
              <div
                className={styles.outputLabel}
                style={{ color: result === "success" ? "#34d399aa" : result === "fail" ? "#f87171aa" : "#818cf8aa" }}
              >
                {result === "success" ? "\u2705" : result === "fail" ? "\u274C" : "\u{1F4E4}"} Your Output
              </div>
              <div className={styles.outputMarbles}>
                {showFinalOutput ? (
                  finalOutput.map((e, i) => (
                    <Marble
                      key={`result-${i}`}
                      value={e.value}
                      color={e.type === "error" ? "#ef4444" : result === "success" ? "#34d399" : "#818cf8"}
                      size="sm"
                      delay={i * 0.04}
                    />
                  ))
                ) : (
                  <span className={styles.emptyStream}>{"\u2014"}</span>
                )}
              </div>
            </div>
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
                    <span>{"\u{1F389}"} {t("reactor-flow-success")}</span>
                    <span className={styles.resultStars}>
                      {"\u2B50".repeat(earnedStars)}
                    </span>
                  </>
                ) : (
                  <span>{"\u274C"} {t("reactor-flow-try-again")}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reactor Code Preview */}
          {result === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.codePreview}
            >
              <span className={styles.codePreviewLabel}>{t("reactor-flow-your-pipeline")}</span>
              <pre className={styles.codeBlock}>{buildReactorCode()}</pre>
            </motion.div>
          )}

          {/* Operator Slots */}
          <div className={styles.slotsArea}>
            <div className={styles.slotsLabel}>{t("reactor-flow-pipeline-slots")}</div>
            <div className={styles.slotsRow}>
              {placedOps.map((opId, slotIndex) => {
                const op = opId ? OPERATORS[opId] : null;
                const isActive = (() => {
                  let filled = 0;
                  for (let i = 0; i <= slotIndex; i++) {
                    if (placedOps[i]) {
                      if (i === slotIndex) return animStep === filled;
                      filled++;
                    }
                  }
                  return false;
                })();

                return (
                  <div key={slotIndex} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {slotIndex > 0 && <ArrowRight className={styles.slotArrow} />}
                    <motion.button
                      className={`${styles.slot} ${op ? styles.slotFilled : ""} ${isActive ? styles.slotActive : ""}`}
                      style={op ? { borderColor: `${op.color}66`, background: `${op.color}15` } : {}}
                      whileHover={!isRunning ? { scale: 1.03 } : {}}
                      whileTap={!isRunning ? { scale: 0.97 } : {}}
                      onClick={() => placeOperator(slotIndex)}
                    >
                      {op ? (
                        <span style={{ color: op.color, fontWeight: 600, fontSize: "0.85rem" }}>
                          {op.emoji} {op.label}
                        </span>
                      ) : (
                        <span className={styles.slotPlaceholder}>
                          {selectedOp ? t("reactor-flow-click-place") : t("reactor-flow-select-op")}
                        </span>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operator Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxLabel}>{t("reactor-flow-operators")}</div>
            <div className={styles.toolboxGrid}>
              {level.availableOps.map((opId) => {
                const op = OPERATORS[opId];
                if (!op) return null;
                const isPlaced = placedOps.includes(opId);
                const isSelected = selectedOp === opId;
                return (
                  <motion.button
                    key={opId}
                    className={`${styles.opCard} ${isSelected ? styles.opCardSelected : ""} ${isPlaced ? styles.opCardUsed : ""}`}
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
                    <span className={styles.opCode}>{op.reactorCode}</span>
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
              <HintIcon /> {t("reactor-flow-hint")}
            </button>
            <button className={styles.resetBtn} onClick={resetLevel}>
              <ResetIcon /> {t("reactor-flow-reset")}
            </button>
            <motion.button
              className={styles.runBtn}
              whileHover={canRun ? { scale: 1.04 } : {}}
              whileTap={canRun ? { scale: 0.96 } : {}}
              onClick={runPipeline}
              disabled={!canRun}
            >
              <PlayIcon /> {isRunning ? t("reactor-flow-running") : t("reactor-flow-run")}
            </motion.button>
            {result === "success" && currentLevel < LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => startLevel(currentLevel + 1)}
              >
                {t("reactor-flow-next")} <ArrowRight />
              </motion.button>
            )}
            {result === "success" && currentLevel === LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => setScreen("complete")}
              >
                {t("reactor-flow-finish")} <TrophyIcon />
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
                    <strong>{t("reactor-flow-teaches")}:</strong> {level.teaches}
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
                  backgroundColor: MARBLE_COLORS[i % MARBLE_COLORS.length],
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
