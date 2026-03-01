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
import styles from "./ReactorGame.module.css";

/* ============ Types ============ */
type Screen = "menu" | "levels" | "game" | "complete";

interface Operator {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  reactorCode: string;
  apply: (input: number[]) => number[];
}

interface Level {
  id: number;
  name: string;
  description: string;
  input: number[];
  target: number[];
  availableOps: string[];
  slots: number;
  par: number;
  hint: string;
  teaches: string;
}

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

/* ============ Helper: isPrime ============ */
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/* ============ Operator Definitions (42 total) ============ */
const OPERATORS: Record<string, Operator> = {
  /* --- Transforming (10) --- */
  map_x2: {
    id: "map_x2",
    label: "map(\u00d72)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Transforms each element by multiplying by 2",
    reactorCode: ".map(x -> x * 2)",
    apply: (input) => input.map((x) => x * 2),
  },
  map_x3: {
    id: "map_x3",
    label: "map(\u00d73)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Transforms each element by multiplying by 3",
    reactorCode: ".map(x -> x * 3)",
    apply: (input) => input.map((x) => x * 3),
  },
  map_add3: {
    id: "map_add3",
    label: "map(+3)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Adds 3 to each element in the stream",
    reactorCode: ".map(x -> x + 3)",
    apply: (input) => input.map((x) => x + 3),
  },
  map_sub1: {
    id: "map_sub1",
    label: "map(-1)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Subtracts 1 from each element in the stream",
    reactorCode: ".map(x -> x - 1)",
    apply: (input) => input.map((x) => x - 1),
  },
  map_abs: {
    id: "map_abs",
    label: "map(abs)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Takes the absolute value of each element",
    reactorCode: ".map(Math::abs)",
    apply: (input) => input.map((x) => Math.abs(x)),
  },
  map_square: {
    id: "map_square",
    label: "map(x\u00b2)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Squares each element in the stream",
    reactorCode: ".map(x -> x * x)",
    apply: (input) => input.map((x) => x * x),
  },
  map_add10: {
    id: "map_add10",
    label: "map(+10)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Adds 10 to each element in the stream",
    reactorCode: ".map(x -> x + 10)",
    apply: (input) => input.map((x) => x + 10),
  },
  map_div2: {
    id: "map_div2",
    label: "map(\u00f72)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Floor divides each element by 2",
    reactorCode: ".map(x -> x / 2)",
    apply: (input) => input.map((x) => Math.floor(x / 2)),
  },
  map_neg: {
    id: "map_neg",
    label: "map(neg)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Negates each element in the stream",
    reactorCode: ".map(x -> -x)",
    apply: (input) => input.map((x) => -x),
  },
  map_mod3: {
    id: "map_mod3",
    label: "map(%3)",
    emoji: "\ud83d\udd04",
    color: "#818cf8",
    description: "Applies modulo 3 to each element",
    reactorCode: ".map(x -> x % 3)",
    apply: (input) => input.map((x) => ((x % 3) + 3) % 3),
  },

  /* --- Filtering (8) --- */
  filter_even: {
    id: "filter_even",
    label: "filter(even)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only even numbers from the stream",
    reactorCode: ".filter(x -> x % 2 == 0)",
    apply: (input) => input.filter((x) => x % 2 === 0),
  },
  filter_odd: {
    id: "filter_odd",
    label: "filter(odd)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only odd numbers from the stream",
    reactorCode: ".filter(x -> x % 2 != 0)",
    apply: (input) => input.filter((x) => x % 2 !== 0),
  },
  filter_gt5: {
    id: "filter_gt5",
    label: "filter(>5)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only elements greater than 5",
    reactorCode: ".filter(x -> x > 5)",
    apply: (input) => input.filter((x) => x > 5),
  },
  filter_lt10: {
    id: "filter_lt10",
    label: "filter(<10)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only elements less than 10",
    reactorCode: ".filter(x -> x < 10)",
    apply: (input) => input.filter((x) => x < 10),
  },
  filter_positive: {
    id: "filter_positive",
    label: "filter(>0)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only positive numbers",
    reactorCode: ".filter(x -> x > 0)",
    apply: (input) => input.filter((x) => x > 0),
  },
  filter_nonzero: {
    id: "filter_nonzero",
    label: "filter(\u22600)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Removes all zero values from the stream",
    reactorCode: ".filter(x -> x != 0)",
    apply: (input) => input.filter((x) => x !== 0),
  },
  filter_prime: {
    id: "filter_prime",
    label: "filter(prime)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only prime numbers",
    reactorCode: ".filter(MathUtils::isPrime)",
    apply: (input) => input.filter((x) => isPrime(x)),
  },
  filter_lte20: {
    id: "filter_lte20",
    label: "filter(\u226420)",
    emoji: "\ud83d\udd0d",
    color: "#34d399",
    description: "Keeps only elements less than or equal to 20",
    reactorCode: ".filter(x -> x <= 20)",
    apply: (input) => input.filter((x) => x <= 20),
  },

  /* --- Limiting (6) --- */
  take_3: {
    id: "take_3",
    label: "take(3)",
    emoji: "\u2702\ufe0f",
    color: "#f472b6",
    description: "Takes only the first 3 elements from the stream",
    reactorCode: ".take(3)",
    apply: (input) => input.slice(0, 3),
  },
  take_5: {
    id: "take_5",
    label: "take(5)",
    emoji: "\u2702\ufe0f",
    color: "#f472b6",
    description: "Takes only the first 5 elements from the stream",
    reactorCode: ".take(5)",
    apply: (input) => input.slice(0, 5),
  },
  takeLast_2: {
    id: "takeLast_2",
    label: "takeLast(2)",
    emoji: "\u2702\ufe0f",
    color: "#f472b6",
    description: "Takes only the last 2 elements from the stream",
    reactorCode: ".takeLast(2)",
    apply: (input) => input.slice(-2),
  },
  takeWhile_lt10: {
    id: "takeWhile_lt10",
    label: "takeWhile(<10)",
    emoji: "\u2702\ufe0f",
    color: "#f472b6",
    description: "Takes elements while they are less than 10",
    reactorCode: ".takeWhile(x -> x < 10)",
    apply: (input) => {
      const result: number[] = [];
      for (const x of input) {
        if (x >= 10) break;
        result.push(x);
      }
      return result;
    },
  },
  skip_2: {
    id: "skip_2",
    label: "skip(2)",
    emoji: "\u23ed\ufe0f",
    color: "#fb923c",
    description: "Skips the first 2 elements of the stream",
    reactorCode: ".skip(2)",
    apply: (input) => input.slice(2),
  },
  skipWhile_lt5: {
    id: "skipWhile_lt5",
    label: "skipWhile(<5)",
    emoji: "\u23ed\ufe0f",
    color: "#fb923c",
    description: "Skips elements while they are less than 5",
    reactorCode: ".skipWhile(x -> x < 5)",
    apply: (input) => {
      let skipping = true;
      return input.filter((x) => {
        if (skipping && x < 5) return false;
        skipping = false;
        return true;
      });
    },
  },

  /* --- Deduplication & Ordering (4) --- */
  distinct: {
    id: "distinct",
    label: "distinct()",
    emoji: "\ud83d\udc8e",
    color: "#22d3ee",
    description: "Removes duplicate elements, keeping first occurrence",
    reactorCode: ".distinct()",
    apply: (input) => [...new Set(input)],
  },
  sort: {
    id: "sort",
    label: "sort()",
    emoji: "\ud83d\udcca",
    color: "#a78bfa",
    description: "Sorts elements in ascending order",
    reactorCode: ".sort()",
    apply: (input) => [...input].sort((a, b) => a - b),
  },
  sort_desc: {
    id: "sort_desc",
    label: "sort(desc)",
    emoji: "\ud83d\udcca",
    color: "#a78bfa",
    description: "Sorts elements in descending order",
    reactorCode: ".sort(Comparator.reverseOrder())",
    apply: (input) => [...input].sort((a, b) => b - a),
  },
  distinctUntilChanged: {
    id: "distinctUntilChanged",
    label: "distinctUntilChanged()",
    emoji: "\ud83d\udc8e",
    color: "#22d3ee",
    description: "Removes consecutive duplicate elements only",
    reactorCode: ".distinctUntilChanged()",
    apply: (input) => input.filter((x, i) => i === 0 || x !== input[i - 1]),
  },

  /* --- Aggregation (6) --- */
  reduce_sum: {
    id: "reduce_sum",
    label: "reduce(+)",
    emoji: "\ud83e\uddee",
    color: "#fbbf24",
    description: "Reduces all elements to a single sum using Mono",
    reactorCode: ".reduce(Integer::sum)",
    apply: (input) => (input.length > 0 ? [input.reduce((a, b) => a + b, 0)] : []),
  },
  reduce_mul: {
    id: "reduce_mul",
    label: "reduce(\u00d7)",
    emoji: "\ud83e\uddee",
    color: "#fbbf24",
    description: "Multiplies all elements together into a single value",
    reactorCode: ".reduce((a, b) -> a * b)",
    apply: (input) => (input.length > 0 ? [input.reduce((a, b) => a * b, 1)] : []),
  },
  scan_sum: {
    id: "scan_sum",
    label: "scan(+)",
    emoji: "\ud83d\udcc8",
    color: "#10b981",
    description: "Running sum \u2014 emits all intermediate accumulated values",
    reactorCode: ".scan(Integer::sum)",
    apply: (input) => {
      let acc = 0;
      return input.map((x) => {
        acc += x;
        return acc;
      });
    },
  },
  scan_mul: {
    id: "scan_mul",
    label: "scan(\u00d7)",
    emoji: "\ud83d\udcc8",
    color: "#10b981",
    description: "Running product \u2014 emits all intermediate multiplied values",
    reactorCode: ".scan((a, b) -> a * b)",
    apply: (input) => {
      if (input.length === 0) return [];
      const result: number[] = [input[0]];
      for (let i = 1; i < input.length; i++) {
        result.push(result[i - 1] * input[i]);
      }
      return result;
    },
  },
  count: {
    id: "count",
    label: "count()",
    emoji: "\ud83d\udd22",
    color: "#f87171",
    description: "Returns the count of elements as a single value",
    reactorCode: ".count()",
    apply: (input) => [input.length],
  },
  collectList: {
    id: "collectList",
    label: "collectList()",
    emoji: "\ud83d\udce6",
    color: "#e879f9",
    description: "Collects all elements into a single list (passthrough)",
    reactorCode: ".collectList()",
    apply: (input) => [...input],
  },

  /* --- Advanced (8) --- */
  buffer_3: {
    id: "buffer_3",
    label: "buffer(3)",
    emoji: "\ud83d\uddc2\ufe0f",
    color: "#06b6d4",
    description: "Groups into chunks of 3, sums each chunk",
    reactorCode: ".buffer(3).map(list -> list.stream().reduce(0, Integer::sum))",
    apply: (input) => {
      const result: number[] = [];
      for (let i = 0; i < input.length; i += 3) {
        const chunk = input.slice(i, i + 3);
        result.push(chunk.reduce((a, b) => a + b, 0));
      }
      return result;
    },
  },
  window_2: {
    id: "window_2",
    label: "window(2)",
    emoji: "\ud83e\ade9",
    color: "#06b6d4",
    description: "Sliding windows of 2, sums each window",
    reactorCode: ".window(2).flatMap(w -> w.reduce(0, Integer::sum))",
    apply: (input) => {
      if (input.length < 2) return [...input];
      const result: number[] = [];
      for (let i = 0; i <= input.length - 2; i++) {
        result.push(input[i] + input[i + 1]);
      }
      return result;
    },
  },
  groupBy_evenodd: {
    id: "groupBy_evenodd",
    label: "groupBy(parity)",
    emoji: "\ud83c\udff7\ufe0f",
    color: "#06b6d4",
    description: "Groups by parity \u2014 evens first, then odds",
    reactorCode: ".groupBy(x -> x % 2).flatMap(g -> g)",
    apply: (input) => {
      const evens = input.filter((x) => x % 2 === 0);
      const odds = input.filter((x) => x % 2 !== 0);
      return [...evens, ...odds];
    },
  },
  flatMap_dup: {
    id: "flatMap_dup",
    label: "flatMap(dup)",
    emoji: "\ud83d\udd00",
    color: "#f43f5e",
    description: "Duplicates each element [x, x]",
    reactorCode: ".flatMap(x -> Flux.just(x, x))",
    apply: (input) => input.flatMap((x) => [x, x]),
  },
  defaultIfEmpty_0: {
    id: "defaultIfEmpty_0",
    label: "defaultIfEmpty(0)",
    emoji: "\u26a0\ufe0f",
    color: "#94a3b8",
    description: "If stream is empty, emits [0]; otherwise passthrough",
    reactorCode: ".defaultIfEmpty(0)",
    apply: (input) => (input.length === 0 ? [0] : [...input]),
  },
  switchIfEmpty_1: {
    id: "switchIfEmpty_1",
    label: "switchIfEmpty([1])",
    emoji: "\ud83d\udd04",
    color: "#94a3b8",
    description: "If stream is empty, emits [1]; otherwise passthrough",
    reactorCode: ".switchIfEmpty(Mono.just(1))",
    apply: (input) => (input.length === 0 ? [1] : [...input]),
  },
  repeat_2: {
    id: "repeat_2",
    label: "repeat(2)",
    emoji: "\ud83d\udd01",
    color: "#f59e0b",
    description: "Repeats the entire sequence twice (concat with itself)",
    reactorCode: ".repeat(1)",
    apply: (input) => [...input, ...input],
  },
  any_gt10: {
    id: "any_gt10",
    label: "any(>10)",
    emoji: "\u2753",
    color: "#ec4899",
    description: "Returns [1] if any element > 10, else [0]",
    reactorCode: ".any(x -> x > 10).map(b -> b ? 1 : 0)",
    apply: (input) => [input.some((x) => x > 10) ? 1 : 0],
  },
};

/* ============ Level Definitions (30 total) ============ */
const LEVELS: Level[] = [
  /* === Block 1 — Single Operators (1-10) === */
  {
    id: 1,
    name: "Transform",
    description: "Use map to double each value in the stream",
    input: [1, 2, 3, 4, 5],
    target: [2, 4, 6, 8, 10],
    availableOps: ["map_x2", "map_add3", "filter_even"],
    slots: 1,
    par: 1,
    hint: "map() transforms every element passing through the Flux",
    teaches: "Flux.map()",
  },
  {
    id: 2,
    name: "Filter",
    description: "Keep only the even numbers from the stream",
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    target: [2, 4, 6, 8],
    availableOps: ["map_x2", "filter_even", "filter_odd"],
    slots: 1,
    par: 1,
    hint: "filter() only lets elements matching a predicate pass through",
    teaches: "Flux.filter()",
  },
  {
    id: 3,
    name: "First Three",
    description: "Take only the first 3 elements from the stream",
    input: [10, 20, 30, 40, 50],
    target: [10, 20, 30],
    availableOps: ["take_3", "skip_2", "filter_even"],
    slots: 1,
    par: 1,
    hint: "take(n) completes the Flux after emitting n elements",
    teaches: "Flux.take()",
  },
  {
    id: 4,
    name: "Skip Ahead",
    description: "Skip the first 2 elements of the stream",
    input: [5, 10, 15, 20, 25],
    target: [15, 20, 25],
    availableOps: ["take_3", "skip_2", "map_x2"],
    slots: 1,
    par: 1,
    hint: "skip(n) ignores the first n elements then emits the rest",
    teaches: "Flux.skip()",
  },
  {
    id: 5,
    name: "Unique Only",
    description: "Remove all duplicate values from the stream",
    input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [3, 1, 4, 5, 9, 2, 6],
    availableOps: ["distinct", "sort", "filter_odd"],
    slots: 1,
    par: 1,
    hint: "distinct() tracks seen elements and drops repeats",
    teaches: "Flux.distinct()",
  },
  {
    id: 6,
    name: "Sort It",
    description: "Sort the elements in ascending order",
    input: [5, 2, 8, 1, 9, 3],
    target: [1, 2, 3, 5, 8, 9],
    availableOps: ["sort", "distinct", "map_x2"],
    slots: 1,
    par: 1,
    hint: "sort() collects all elements, sorts them, then re-emits",
    teaches: "Flux.sort()",
  },
  {
    id: 7,
    name: "Sum It Up",
    description: "Reduce all elements to a single sum",
    input: [10, 20, 30],
    target: [60],
    availableOps: ["reduce_sum", "map_x2", "filter_even"],
    slots: 1,
    par: 1,
    hint: "reduce() accumulates elements into a single Mono value",
    teaches: "Flux.reduce()",
  },
  {
    id: 8,
    name: "Absolute Values",
    description: "Convert all negative values to positive",
    input: [-3, 2, -5, 4, -1],
    target: [3, 2, 5, 4, 1],
    availableOps: ["map_abs", "map_neg", "filter_positive"],
    slots: 1,
    par: 1,
    hint: "map(abs) takes the absolute value of each element",
    teaches: "Flux.map(Math::abs)",
  },
  {
    id: 9,
    name: "Running Total",
    description: "Compute the running sum of all elements",
    input: [1, 2, 3, 4],
    target: [1, 3, 6, 10],
    availableOps: ["scan_sum", "reduce_sum", "map_add3"],
    slots: 1,
    par: 1,
    hint: "scan() is like reduce but emits every intermediate accumulated value",
    teaches: "Flux.scan()",
  },
  {
    id: 10,
    name: "Count Elements",
    description: "Count how many elements are in the stream",
    input: [7, 3, 9, 1, 5],
    target: [5],
    availableOps: ["count", "reduce_sum", "take_3"],
    slots: 1,
    par: 1,
    hint: "count() emits a single number representing the total element count",
    teaches: "Flux.count()",
  },

  /* === Block 2 — Two Operators (11-18) === */
  {
    id: 11,
    name: "Double & Filter",
    description: "Double all values, then keep only those greater than 5",
    input: [1, 2, 3, 4, 5],
    target: [6, 8, 10],
    availableOps: ["map_x2", "filter_gt5", "filter_even", "take_3"],
    slots: 2,
    par: 2,
    hint: "Chain operators: first map, then filter the results",
    teaches: "Operator chaining",
  },
  {
    id: 12,
    name: "Triple & Take",
    description: "Triple all values, then take only the first 3",
    input: [1, 2, 3, 4, 5],
    target: [3, 6, 9],
    availableOps: ["map_x3", "take_3", "filter_odd", "skip_2"],
    slots: 2,
    par: 2,
    hint: "Apply map first to transform, then take to limit",
    teaches: "map() + take()",
  },
  {
    id: 13,
    name: "Filter & Sort",
    description: "Keep only odd numbers, then sort them",
    input: [8, 3, 6, 1, 4, 7, 2, 9],
    target: [1, 3, 7, 9],
    availableOps: ["filter_odd", "filter_even", "sort", "distinct"],
    slots: 2,
    par: 2,
    hint: "First filter to reduce the set, then sort what remains",
    teaches: "filter() + sort()",
  },
  {
    id: 14,
    name: "Negate & Sum",
    description: "Negate all values, then sum them up",
    input: [3, 7, 2],
    target: [-12],
    availableOps: ["map_neg", "reduce_sum", "map_abs", "filter_positive"],
    slots: 2,
    par: 2,
    hint: "First negate every element, then reduce to a single sum",
    teaches: "map(neg) + reduce()",
  },
  {
    id: 15,
    name: "Square & Filter",
    description: "Square all values, then keep only those less than 10",
    input: [1, 2, 3, 4, 5],
    target: [1, 4, 9],
    availableOps: ["map_square", "filter_lt10", "filter_gt5", "sort"],
    slots: 2,
    par: 2,
    hint: "Square first, then filter out large values",
    teaches: "map(x\u00b2) + filter()",
  },
  {
    id: 16,
    name: "Dedupe & Count",
    description: "Remove duplicates, then count unique elements",
    input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [7],
    availableOps: ["distinct", "count", "reduce_sum", "sort"],
    slots: 2,
    par: 2,
    hint: "First remove duplicates, then count what remains",
    teaches: "distinct() + count()",
  },
  {
    id: 17,
    name: "Sort Desc & Take Top",
    description: "Sort descending, then take the first 3 (top 3)",
    input: [5, 2, 8, 1, 9, 3],
    target: [9, 8, 5],
    availableOps: ["sort_desc", "sort", "take_3", "takeLast_2"],
    slots: 2,
    par: 2,
    hint: "Sort in descending order first, then take the top elements",
    teaches: "sort(desc) + take()",
  },
  {
    id: 18,
    name: "Modulo & Unique",
    description: "Apply modulo 3, then keep only unique results",
    input: [7, 14, 3, 9, 6, 12],
    target: [1, 2, 0],
    availableOps: ["map_mod3", "distinct", "sort", "filter_nonzero"],
    slots: 2,
    par: 2,
    hint: "First apply modulo 3 to each element, then remove duplicates",
    teaches: "map(%3) + distinct()",
  },

  /* === Block 3 — Three Operators (19-24) === */
  {
    id: 19,
    name: "Sort, Filter Odds, Take 3",
    description: "Sort ascending, keep only odds, then take first 3",
    input: [5, 3, 8, 1, 7, 2, 4, 6],
    target: [1, 3, 5],
    availableOps: ["sort", "filter_odd", "filter_even", "take_3", "skip_2", "map_x2"],
    slots: 3,
    par: 3,
    hint: "Think about the order: sort first, then filter, then limit",
    teaches: "Multi-operator pipelines",
  },
  {
    id: 20,
    name: "Distinct, Sort, Take 3",
    description: "Remove duplicates, sort, and take the first 3",
    input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [1, 2, 3],
    availableOps: ["distinct", "sort", "take_3", "filter_even", "map_x2", "reduce_sum", "skip_2"],
    slots: 3,
    par: 3,
    hint: "Clean duplicates first, then sort, then take what you need",
    teaches: "Complete reactive pipeline",
  },
  {
    id: 21,
    name: "Abs, Filter, Sort",
    description: "Take absolute values, filter >5, then sort",
    input: [-5, 3, -8, 7, -9, 1],
    target: [7, 8, 9],
    availableOps: ["map_abs", "filter_gt5", "sort", "filter_lt10", "distinct"],
    slots: 3,
    par: 3,
    hint: "Convert to absolute values first, then filter out small ones, then sort",
    teaches: "map(abs) + filter() + sort()",
  },
  {
    id: 22,
    name: "Double, Running Sum, Take",
    description: "Double each value, compute running sum, take first 3",
    input: [1, 1, 1, 1, 1],
    target: [2, 4, 6],
    availableOps: ["map_x2", "scan_sum", "take_3", "reduce_sum", "filter_even"],
    slots: 3,
    par: 3,
    hint: "Double first, then scan for running totals, then limit",
    teaches: "map() + scan() + take()",
  },
  {
    id: 23,
    name: "Filter Primes, Sort, Reduce",
    description: "Keep only primes, sort them, then sum",
    input: [10, 7, 4, 11, 6, 3, 8, 2, 13],
    target: [36],
    availableOps: ["filter_prime", "sort", "reduce_sum", "filter_odd", "count"],
    slots: 3,
    par: 3,
    hint: "Filter for primes first, then sort, then reduce to a sum",
    teaches: "filter(prime) + sort() + reduce()",
  },
  {
    id: 24,
    name: "Skip, Square, Take 5",
    description: "Skip first 2, square each, then take first 5",
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    target: [9, 16, 25, 36, 49],
    availableOps: ["skip_2", "map_square", "take_5", "take_3", "filter_gt5", "sort"],
    slots: 3,
    par: 3,
    hint: "Skip the first elements, then square the rest, then limit to 5",
    teaches: "skip() + map(x\u00b2) + take()",
  },

  /* === Block 4 — Four Operators (25-28) === */
  {
    id: 25,
    name: "Full Pipeline",
    description: "Dedupe, sort, filter <10, take first 5",
    input: [8, 3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    target: [1, 2, 3, 4, 5],
    availableOps: ["distinct", "sort", "filter_lt10", "take_5", "map_x2", "filter_even", "skip_2"],
    slots: 4,
    par: 4,
    hint: "Remove duplicates, sort ascending, filter small values, then limit",
    teaches: "4-stage reactive pipeline",
  },
  {
    id: 26,
    name: "Advanced Transform",
    description: "Double, filter >5, sort descending, running sum",
    input: [1, 2, 3, 4, 5, 6],
    target: [12, 22, 30, 36],
    availableOps: ["map_x2", "filter_gt5", "sort_desc", "scan_sum", "take_3", "filter_even"],
    slots: 4,
    par: 4,
    hint: "Double values first, filter out small ones, sort descending, then running sum",
    teaches: "map() + filter() + sort(desc) + scan()",
  },
  {
    id: 27,
    name: "Duplicate & Process",
    description: "Duplicate each element, sort, dedupe, triple",
    input: [3, 1, 2],
    target: [3, 6, 9],
    availableOps: ["flatMap_dup", "sort", "distinct", "map_x3", "filter_odd", "take_3"],
    slots: 4,
    par: 4,
    hint: "Duplicate elements, sort them, remove duplicates, then transform",
    teaches: "flatMap(dup) + sort() + distinct() + map()",
  },
  {
    id: 28,
    name: "Statistics Pipeline",
    description: "Sort, skip 2, take last 2, then sum",
    input: [5, 2, 8, 1, 9, 3, 7],
    target: [17],
    availableOps: ["sort", "skip_2", "takeLast_2", "reduce_sum", "filter_odd", "distinct", "map_x2"],
    slots: 4,
    par: 4,
    hint: "Sort first, skip the smallest, take the last two, then sum",
    teaches: "sort() + skip() + takeLast() + reduce()",
  },

  /* === Block 5 — Master (29-30) === */
  {
    id: 29,
    name: "Complex Pipeline",
    description: "Abs, dedupe, sort, filter primes, running sum",
    input: [-7, 3, -3, 7, -11, 2, 5, -5, 11],
    target: [2, 5, 10, 17, 28],
    availableOps: [
      "map_abs", "distinct", "sort", "filter_prime", "scan_sum",
      "filter_gt5", "take_5", "reduce_sum", "map_x2", "skip_2",
    ],
    slots: 5,
    par: 5,
    hint: "Convert negatives to absolute values, deduplicate, sort, keep primes, then compute a running sum",
    teaches: "5-stage pipeline mastery",
  },
  {
    id: 30,
    name: "Grand Master",
    description: "Skip, square, filter \u226420, sort desc, take first 3",
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    target: [16, 9],
    availableOps: [
      "skip_2", "map_square", "filter_lte20", "sort_desc", "takeLast_2",
      "map_x2", "filter_prime", "distinct", "reduce_sum", "scan_sum",
    ],
    slots: 5,
    par: 5,
    hint: "Skip leading elements, square the rest, filter out large values, sort descending, then take the last 2",
    teaches: "Ultimate pipeline mastery",
  },
];

/* ============ Helpers ============ */
const PROGRESS_KEY = "reactor-game-progress";
const MARBLE_COLORS = ["#818cf8", "#22d3ee", "#34d399", "#fb923c", "#f472b6", "#fbbf24", "#60a5fa", "#ef4444", "#a78bfa", "#2dd4bf"];

function getMarbleColor(value: number): string {
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

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/* ============ Marble Component ============ */
function Marble({ value, size = "md", delay = 0 }: { value: number; size?: "sm" | "md"; delay?: number }) {
  const color = getMarbleColor(value);
  const sz = size === "sm" ? "1.5rem" : "2.25rem";
  const fsz = size === "sm" ? "0.65rem" : "0.85rem";
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, type: "spring", stiffness: 300 }}
      className={styles.marble}
      style={{
        width: sz,
        height: sz,
        background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88)`,
        boxShadow: `0 0 10px ${color}66, inset 0 -2px 4px ${color}44`,
        fontSize: fsz,
      }}
    >
      {value}
    </motion.div>
  );
}

/* ============ Main Component ============ */
export default function ReactorGamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedOps, setPlacedOps] = useState<(string | null)[]>([]);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [intermediateResults, setIntermediateResults] = useState<number[][]>([]);
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
        // Remove existing operator
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

    // Calculate intermediate results
    const results: number[][] = [];
    let current = [...level.input];
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        current = OPERATORS[opId].apply(current);
        results.push([...current]);
      }
    }
    setIntermediateResults(results);

    // Animate step by step
    const timers: NodeJS.Timeout[] = [];
    results.forEach((_, i) => {
      const timer = setTimeout(() => setAnimStep(i), (i + 1) * 700);
      timers.push(timer);
    });

    // Check result after animations
    const finalTimer = setTimeout(() => {
      const finalOutput = results.length > 0 ? results[results.length - 1] : level.input;
      const success = arraysEqual(finalOutput, level.target);

      if (success) {
        const opsUsed = filledOps.length;
        const stars = opsUsed <= level.par ? 3 : opsUsed <= level.par + 1 ? 2 : 1;
        setEarnedStars(stars);
        setResult("success");
        setShowConfetti(true);

        // Save progress
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
    }, (results.length + 1) * 700 + 300);
    timers.push(finalTimer);
    animTimers.current = timers;
  }, [placedOps, level, progress]);

  // Build the Reactor code string from the placed operators
  const buildReactorCode = useCallback(() => {
    const inputStr = level.input.join(", ");
    let code = `Flux.just(${inputStr})`;
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        code += `\n    ${OPERATORS[opId].reactorCode}`;
      }
    }
    code += "\n    .subscribe()";
    return code;
  }, [placedOps, level]);

  const isLevelUnlocked = useCallback(() => true, []);

  const totalStars = Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = LEVELS.length * 3;

  const canRun = placedOps.some(Boolean) && !isRunning;

  // Cleanup timers
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
            <div className={styles.menuIcon}>🔬</div>
            <h1 className={styles.menuTitle}>Reactor Pipes</h1>
            <p className={styles.menuSubtitle}>
              {t("reactor-game-subtitle")}
            </p>
            <div className={styles.menuStats}>
              <span>⭐ {totalStars}/{maxStars}</span>
              <span>📊 {Object.values(progress).filter((p) => p.completed).length}/{LEVELS.length}</span>
            </div>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("levels")}
            >
              <PlayIcon /> {t("reactor-game-play")}
            </motion.button>
            <motion.a
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
              whileHover={{ x: -3 }}
            >
              <ArrowBack /> {t("reactor-game-back-hub")}
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
              <h2 className={styles.levelsTitle}>{t("reactor-game-select-level")}</h2>
              <span className={styles.levelsStars}>⭐ {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.levelsGrid}>
              {LEVELS.map((lvl, i) => {
                const prog = progress[lvl.id];
                return (
                  <motion.button
                    key={lvl.id}
                    className={`${styles.levelCard} ${prog?.completed ? styles.levelCompleted : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => startLevel(i)}
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
                    {prog?.completed && <span className={styles.levelTeaches}>{lvl.teaches}</span>}
                  </motion.button>
                );
              })}
            </div>
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
            <h1 className={styles.completeTitle}>{t("reactor-game-complete-title")}</h1>
            <p className={styles.completeSubtitle}>{t("reactor-game-complete-subtitle")}</p>
            <div className={styles.completeStats}>
              <span>⭐ {totalStars}/{maxStars}</span>
            </div>
            <div className={styles.completeCode}>
              <p className={styles.completeCodeLabel}>{t("reactor-game-learned")}</p>
              <pre className={styles.codeBlock}>
                {`Flux.just(1, 2, 3, 4, 5)
    .map(x -> x * 2)
    .filter(x -> x > 5)
    .distinct()
    .sort()
    .take(3)
    .scan(Integer::sum)
    .reduce(Integer::sum)
    .subscribe(System.out::println)`}
              </pre>
            </div>
            <div className={styles.completeBtns}>
              <button className={styles.playBtn} onClick={() => setScreen("levels")}>
                {t("reactor-game-replay")}
              </button>
              <a href={createLocalizedPath("/developer-section")} className={styles.backLink}>
                <HomeIcon /> {t("reactor-game-back-hub")}
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

          {/* Pipeline */}
          <div className={styles.pipeline}>
            {/* Input */}
            <div className={styles.pipelineNode}>
              <div className={styles.pipelineLabel}>INPUT</div>
              <div className={styles.pipelineBox}>
                <div className={styles.marbleRow}>
                  {level.input.map((v, i) => (
                    <Marble key={`in-${i}`} value={v} size="sm" delay={i * 0.05} />
                  ))}
                </div>
              </div>
            </div>

            {/* Operator Slots */}
            {placedOps.map((opId, slotIndex) => {
              const op = opId ? OPERATORS[opId] : null;
              const hasResult = animStep >= slotIndex && intermediateResults[slotIndex];
              return (
                <div key={slotIndex} className={styles.pipelineStep}>
                  <ArrowRight className={styles.pipelineArrow} />
                  <div className={styles.pipelineNode}>
                    <div className={styles.pipelineLabel}>
                      {op ? op.emoji : `SLOT ${slotIndex + 1}`}
                    </div>
                    <motion.button
                      className={`${styles.pipelineSlot} ${op ? styles.pipelineSlotFilled : ""} ${
                        animStep === slotIndex ? styles.pipelineSlotActive : ""
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
                          {selectedOp ? t("reactor-game-click-place") : t("reactor-game-select-op")}
                        </span>
                      )}
                    </motion.button>
                    {/* Intermediate result */}
                    <AnimatePresence>
                      {hasResult && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={styles.intermediateResult}
                        >
                          <div className={styles.marbleRow}>
                            {intermediateResults[slotIndex].map((v, i) => (
                              <Marble key={`r-${slotIndex}-${i}`} value={v} size="sm" delay={i * 0.04} />
                            ))}
                            {intermediateResults[slotIndex].length === 0 && (
                              <span className={styles.emptyStream}>∅</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}

            {/* Target Output */}
            <div className={styles.pipelineStep}>
              <ArrowRight className={styles.pipelineArrow} />
              <div className={styles.pipelineNode}>
                <div className={styles.pipelineLabel}>TARGET</div>
                <div className={`${styles.pipelineBox} ${styles.targetBox} ${
                  result === "success" ? styles.targetSuccess : result === "fail" ? styles.targetFail : ""
                }`}>
                  <div className={styles.marbleRow}>
                    {level.target.map((v, i) => (
                      <Marble key={`t-${i}`} value={v} size="sm" delay={i * 0.05} />
                    ))}
                  </div>
                </div>
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
                    <span>🎉 {t("reactor-game-success")}</span>
                    <span className={styles.resultStars}>
                      {"⭐".repeat(earnedStars)}
                    </span>
                  </>
                ) : (
                  <span>❌ {t("reactor-game-try-again")}</span>
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
              <span className={styles.codePreviewLabel}>{t("reactor-game-your-pipeline")}</span>
              <pre className={styles.codeBlock}>{buildReactorCode()}</pre>
            </motion.div>
          )}

          {/* Operator Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxLabel}>{t("reactor-game-operators")}</div>
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
              <HintIcon /> {t("reactor-game-hint")}
            </button>
            <button className={styles.resetBtn} onClick={resetLevel}>
              <ResetIcon /> {t("reactor-game-reset")}
            </button>
            <motion.button
              className={styles.runBtn}
              whileHover={canRun ? { scale: 1.04 } : {}}
              whileTap={canRun ? { scale: 0.96 } : {}}
              onClick={runPipeline}
              disabled={!canRun}
            >
              <PlayIcon /> {isRunning ? t("reactor-game-running") : t("reactor-game-run")}
            </motion.button>
            {result === "success" && currentLevel < LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => startLevel(currentLevel + 1)}
              >
                {t("reactor-game-next")} <ArrowRight />
              </motion.button>
            )}
            {result === "success" && currentLevel === LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => setScreen("complete")}
              >
                {t("reactor-game-finish")} <TrophyIcon />
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
                    <strong>{t("reactor-game-teaches")}:</strong> {level.teaches}
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
