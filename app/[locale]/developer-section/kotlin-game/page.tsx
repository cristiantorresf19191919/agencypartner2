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
import styles from "./KotlinGame.module.css";

/* ============ Types ============ */
type Screen = "menu" | "levels" | "game" | "complete";

interface Operator {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  kotlinCode: string;
  category: string;
}

interface Level {
  id: number;
  name: string;
  description: string;
  inputDisplay: string;
  targetDisplay: string;
  availableOps: string[];
  slots: number;
  par: number;
  hint: string;
  teaches: string;
  validate: (ops: string[]) => boolean;
}

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
}

/* ============ Operator Definitions ============ */
const OPERATORS: Record<string, Operator> = {
  /* --- Variables --- */
  val: {
    id: "val",
    label: "val",
    emoji: "\uD83D\uDD12",
    color: "#7c3aed",
    description: "Immutable variable declaration",
    kotlinCode: "val x = value",
    category: "Variables",
  },
  var_kw: {
    id: "var_kw",
    label: "var",
    emoji: "\uD83D\uDD13",
    color: "#8b5cf6",
    description: "Mutable variable declaration",
    kotlinCode: "var x = value",
    category: "Variables",
  },
  const_val: {
    id: "const_val",
    label: "const val",
    emoji: "\uD83D\uDCCC",
    color: "#6d28d9",
    description: "Compile-time constant",
    kotlinCode: "const val X = value",
    category: "Variables",
  },
  /* --- Type Inference --- */
  type_inference: {
    id: "type_inference",
    label: "Type Inference",
    emoji: "\uD83E\uDDE0",
    color: "#a78bfa",
    description: "Kotlin infers type from the assigned value",
    kotlinCode: "val name = \"Kotlin\" // String",
    category: "Variables",
  },
  type_string: {
    id: "type_string",
    label: ": String",
    emoji: "\uD83C\uDFF7\uFE0F",
    color: "#818cf8",
    description: "Explicit String type annotation",
    kotlinCode: "val name: String = \"Kotlin\"",
    category: "Variables",
  },
  type_int: {
    id: "type_int",
    label: ": Int",
    emoji: "\uD83D\uDD22",
    color: "#6366f1",
    description: "Explicit Int type annotation",
    kotlinCode: "val count: Int = 42",
    category: "Variables",
  },
  /* --- String --- */
  string_template: {
    id: "string_template",
    label: "${}",
    emoji: "\uD83D\uDCDD",
    color: "#22d3ee",
    description: "String template for interpolation",
    kotlinCode: "\"Hello, ${name}!\"",
    category: "Strings",
  },
  concatenation: {
    id: "concatenation",
    label: "+ concat",
    emoji: "\uD83D\uDD17",
    color: "#06b6d4",
    description: "String concatenation with + operator",
    kotlinCode: "\"Hello, \" + name + \"!\"",
    category: "Strings",
  },
  format_str: {
    id: "format_str",
    label: ".format()",
    emoji: "\uD83C\uDFA8",
    color: "#0891b2",
    description: "String.format() method",
    kotlinCode: "\"Hello, %s!\".format(name)",
    category: "Strings",
  },
  /* --- Null Safety --- */
  safe_call: {
    id: "safe_call",
    label: "?.",
    emoji: "\uD83D\uDEE1\uFE0F",
    color: "#34d399",
    description: "Safe call operator — returns null if receiver is null",
    kotlinCode: "obj?.property",
    category: "Null Safety",
  },
  elvis: {
    id: "elvis",
    label: "?:",
    emoji: "\uD83D\uDC51",
    color: "#10b981",
    description: "Elvis operator — provides default when null",
    kotlinCode: "value ?: \"default\"",
    category: "Null Safety",
  },
  not_null_assert: {
    id: "not_null_assert",
    label: "!!",
    emoji: "\u26A0\uFE0F",
    color: "#f87171",
    description: "Not-null assertion — throws if null",
    kotlinCode: "value!!",
    category: "Null Safety",
  },
  let_scope: {
    id: "let_scope",
    label: "?.let{}",
    emoji: "\uD83D\uDD2C",
    color: "#059669",
    description: "Execute block only if not null",
    kotlinCode: "value?.let { println(it) }",
    category: "Null Safety",
  },
  as_safe: {
    id: "as_safe",
    label: "as?",
    emoji: "\uD83D\uDD04",
    color: "#047857",
    description: "Safe cast — returns null on failure",
    kotlinCode: "obj as? String",
    category: "Null Safety",
  },
  requireNotNull_op: {
    id: "requireNotNull_op",
    label: "requireNotNull()",
    emoji: "\uD83D\uDED1",
    color: "#ef4444",
    description: "Throws IllegalArgumentException if null",
    kotlinCode: "requireNotNull(value)",
    category: "Null Safety",
  },
  is_check: {
    id: "is_check",
    label: "is",
    emoji: "\uD83D\uDD0D",
    color: "#2dd4bf",
    description: "Type check with smart cast",
    kotlinCode: "if (x is String) x.length",
    category: "Null Safety",
  },
  as_unsafe: {
    id: "as_unsafe",
    label: "as",
    emoji: "\uD83D\uDCA5",
    color: "#dc2626",
    description: "Unsafe cast — throws ClassCastException on failure",
    kotlinCode: "obj as String",
    category: "Null Safety",
  },
  /* --- Collections --- */
  map_op: {
    id: "map_op",
    label: ".map{}",
    emoji: "\uD83D\uDD04",
    color: "#818cf8",
    description: "Transform each element in the collection",
    kotlinCode: "list.map { it * 2 }",
    category: "Collections",
  },
  filter_op: {
    id: "filter_op",
    label: ".filter{}",
    emoji: "\uD83D\uDD0D",
    color: "#34d399",
    description: "Keep elements matching a predicate",
    kotlinCode: "list.filter { it % 2 == 0 }",
    category: "Collections",
  },
  reduce_op: {
    id: "reduce_op",
    label: ".reduce{}",
    emoji: "\uD83E\uDDEE",
    color: "#fbbf24",
    description: "Accumulate elements to a single value",
    kotlinCode: "list.reduce { acc, x -> acc + x }",
    category: "Collections",
  },
  flatMap_op: {
    id: "flatMap_op",
    label: ".flatMap{}",
    emoji: "\uD83D\uDDC2\uFE0F",
    color: "#f472b6",
    description: "Map and flatten the result",
    kotlinCode: "list.flatMap { listOf(it, it) }",
    category: "Collections",
  },
  groupBy_op: {
    id: "groupBy_op",
    label: ".groupBy{}",
    emoji: "\uD83D\uDCCA",
    color: "#fb923c",
    description: "Group elements by a key function",
    kotlinCode: "list.groupBy { it.length }",
    category: "Collections",
  },
  sortedBy_op: {
    id: "sortedBy_op",
    label: ".sortedBy{}",
    emoji: "\uD83D\uDCC8",
    color: "#a78bfa",
    description: "Sort by a selector function",
    kotlinCode: "list.sortedBy { it.length }",
    category: "Collections",
  },
  associate_op: {
    id: "associate_op",
    label: ".associate{}",
    emoji: "\uD83D\uDCCB",
    color: "#60a5fa",
    description: "Create map from collection",
    kotlinCode: "list.associate { it to it.length }",
    category: "Collections",
  },
  partition_op: {
    id: "partition_op",
    label: ".partition{}",
    emoji: "\u2702\uFE0F",
    color: "#c084fc",
    description: "Split into two lists by predicate",
    kotlinCode: "list.partition { it > 3 }",
    category: "Collections",
  },
  sum_op: {
    id: "sum_op",
    label: ".sum()",
    emoji: "\u2795",
    color: "#fbbf24",
    description: "Sum all numeric elements",
    kotlinCode: "list.sum()",
    category: "Collections",
  },
  fold_op: {
    id: "fold_op",
    label: ".fold{}",
    emoji: "\uD83D\uDCE6",
    color: "#f59e0b",
    description: "Accumulate with initial value",
    kotlinCode: "list.fold(0) { acc, x -> acc + x }",
    category: "Collections",
  },
  take_op: {
    id: "take_op",
    label: ".take(n)",
    emoji: "\u2702\uFE0F",
    color: "#f472b6",
    description: "Take first n elements",
    kotlinCode: "list.take(3)",
    category: "Collections",
  },
  /* --- Type System --- */
  data_class: {
    id: "data_class",
    label: "data class",
    emoji: "\uD83D\uDCE6",
    color: "#7c3aed",
    description: "Auto-generates equals, hashCode, toString, copy",
    kotlinCode: "data class User(val name: String, val age: Int)",
    category: "Type System",
  },
  sealed_class: {
    id: "sealed_class",
    label: "sealed class",
    emoji: "\uD83D\uDD10",
    color: "#6d28d9",
    description: "Restricted class hierarchy for exhaustive when",
    kotlinCode: "sealed class Result<T>",
    category: "Type System",
  },
  enum_class: {
    id: "enum_class",
    label: "enum class",
    emoji: "\uD83C\uDFF3\uFE0F",
    color: "#8b5cf6",
    description: "Enumeration of fixed constants",
    kotlinCode: "enum class Color { RED, GREEN, BLUE }",
    category: "Type System",
  },
  object_decl: {
    id: "object_decl",
    label: "object",
    emoji: "\uD83D\uDD33",
    color: "#a855f7",
    description: "Singleton declaration",
    kotlinCode: "object Singleton { ... }",
    category: "Type System",
  },
  copy_op: {
    id: "copy_op",
    label: ".copy()",
    emoji: "\uD83D\uDCCB",
    color: "#c084fc",
    description: "Copy data class with modified fields",
    kotlinCode: "user.copy(age = 26)",
    category: "Type System",
  },
  destructuring: {
    id: "destructuring",
    label: "destructuring",
    emoji: "\uD83E\uDDE9",
    color: "#d946ef",
    description: "Unpack data class or pair into variables",
    kotlinCode: "val (name, age) = user",
    category: "Type System",
  },
  when_op: {
    id: "when_op",
    label: "when{}",
    emoji: "\uD83D\uDD00",
    color: "#a78bfa",
    description: "Exhaustive pattern matching expression",
    kotlinCode: "when(result) { is Success -> ... }",
    category: "Type System",
  },
  abstract_class: {
    id: "abstract_class",
    label: "abstract class",
    emoji: "\uD83C\uDFDB\uFE0F",
    color: "#7c3aed",
    description: "Abstract base class (cannot seal hierarchy)",
    kotlinCode: "abstract class Shape",
    category: "Type System",
  },
  constructor_op: {
    id: "constructor_op",
    label: "constructor()",
    emoji: "\uD83C\uDFD7\uFE0F",
    color: "#9333ea",
    description: "Create new instance via constructor",
    kotlinCode: "User(\"Alice\", 26)",
    category: "Type System",
  },
  class_op: {
    id: "class_op",
    label: "class",
    emoji: "\uD83D\uDCE6",
    color: "#7e22ce",
    description: "Regular class (no auto-generated methods)",
    kotlinCode: "class User(val name: String)",
    category: "Type System",
  },
  first_second: {
    id: "first_second",
    label: ".first / .second",
    emoji: "\u2194\uFE0F",
    color: "#a855f7",
    description: "Access pair components directly",
    kotlinCode: "pair.first, pair.second",
    category: "Type System",
  },
  get_op: {
    id: "get_op",
    label: "[index]",
    emoji: "\uD83D\uDCCD",
    color: "#9333ea",
    description: "Access by index (get operator)",
    kotlinCode: "list[0]",
    category: "Type System",
  },
  /* --- Scope Functions --- */
  apply_scope: {
    id: "apply_scope",
    label: "apply{}",
    emoji: "\uD83D\uDD27",
    color: "#f472b6",
    description: "Configure object, returns object (this reference)",
    kotlinCode: "obj.apply { prop = value }",
    category: "Scope Functions",
  },
  also_scope: {
    id: "also_scope",
    label: "also{}",
    emoji: "\uD83D\uDC41\uFE0F",
    color: "#ec4899",
    description: "Side effects, returns object (it reference)",
    kotlinCode: "obj.also { println(it) }",
    category: "Scope Functions",
  },
  let_func: {
    id: "let_func",
    label: "let{}",
    emoji: "\u27A1\uFE0F",
    color: "#be185d",
    description: "Transform value, returns lambda result",
    kotlinCode: "obj.let { it.toString() }",
    category: "Scope Functions",
  },
  run_scope: {
    id: "run_scope",
    label: "run{}",
    emoji: "\uD83C\uDFC3",
    color: "#db2777",
    description: "Execute block, returns lambda result (this reference)",
    kotlinCode: "obj.run { length + 1 }",
    category: "Scope Functions",
  },
  with_scope: {
    id: "with_scope",
    label: "with(){}",
    emoji: "\uD83E\uDD1D",
    color: "#e11d48",
    description: "Non-extension scope function, returns lambda result",
    kotlinCode: "with(obj) { toString() }",
    category: "Scope Functions",
  },
  /* --- Advanced --- */
  extension: {
    id: "extension",
    label: "fun T.ext()",
    emoji: "\uD83E\uDE84",
    color: "#22d3ee",
    description: "Extension function adds method to existing type",
    kotlinCode: "fun String.shout() = uppercase() + \"!\"",
    category: "Advanced",
  },
  method_op: {
    id: "method_op",
    label: "fun method()",
    emoji: "\u2699\uFE0F",
    color: "#06b6d4",
    description: "Regular member function",
    kotlinCode: "fun transform(): String",
    category: "Advanced",
  },
  lambda_op: {
    id: "lambda_op",
    label: "{ }",
    emoji: "\u03BB",
    color: "#0891b2",
    description: "Lambda expression / anonymous function",
    kotlinCode: "{ x: Int -> x * 2 }",
    category: "Advanced",
  },
  generic_t: {
    id: "generic_t",
    label: "<T>",
    emoji: "\uD83D\uDD36",
    color: "#fb923c",
    description: "Generic type parameter for type-safe containers",
    kotlinCode: "class Box<T>(val value: T)",
    category: "Advanced",
  },
  out_t: {
    id: "out_t",
    label: "<out T>",
    emoji: "\uD83D\uDD3C",
    color: "#f97316",
    description: "Covariant generic (producer, can only return T)",
    kotlinCode: "class Producer<out T>",
    category: "Advanced",
  },
  in_t: {
    id: "in_t",
    label: "<in T>",
    emoji: "\uD83D\uDD3D",
    color: "#ea580c",
    description: "Contravariant generic (consumer, can only accept T)",
    kotlinCode: "class Consumer<in T>",
    category: "Advanced",
  },
  star_proj: {
    id: "star_proj",
    label: "<*>",
    emoji: "\u2B50",
    color: "#d97706",
    description: "Star projection (unknown type)",
    kotlinCode: "fun check(list: List<*>)",
    category: "Advanced",
  },
  by_lazy: {
    id: "by_lazy",
    label: "by lazy",
    emoji: "\uD83D\uDE34",
    color: "#34d399",
    description: "Lazy property delegation, initialized on first access",
    kotlinCode: "val heavy: String by lazy { compute() }",
    category: "Advanced",
  },
  by_map: {
    id: "by_map",
    label: "by map",
    emoji: "\uD83D\uDDFA\uFE0F",
    color: "#10b981",
    description: "Delegated properties backed by a Map",
    kotlinCode: "val name: String by map",
    category: "Advanced",
  },
  lateinit_op: {
    id: "lateinit_op",
    label: "lateinit",
    emoji: "\u23F3",
    color: "#059669",
    description: "Late initialization (must assign before use)",
    kotlinCode: "lateinit var name: String",
    category: "Advanced",
  },
  receiver_lambda: {
    id: "receiver_lambda",
    label: "T.() -> R",
    emoji: "\uD83D\uDCE1",
    color: "#14b8a6",
    description: "Lambda with receiver for DSL building",
    kotlinCode: "fun html(init: HTML.() -> Unit): HTML",
    category: "Advanced",
  },
  infix_op: {
    id: "infix_op",
    label: "infix",
    emoji: "\u21C4",
    color: "#0d9488",
    description: "Infix function for readable binary operations",
    kotlinCode: "infix fun Int.plus(x: Int) = this + x",
    category: "Advanced",
  },
};

/* ============ Level Definitions ============ */
const LEVELS: Level[] = [
  /* ===== Block 1: Basics (1-5) ===== */
  {
    id: 1,
    name: "val vs var",
    description: "Make the variable immutable so it cannot be reassigned",
    inputDisplay: "var x = 5\nx = 10  // compiles fine",
    targetDisplay: "val x = 5\nx = 10  // ERROR: Val cannot be reassigned",
    availableOps: ["val", "var_kw"],
    slots: 1,
    par: 1,
    hint: "val declares an immutable reference. Once assigned, it cannot be changed.",
    teaches: "val vs var",
    validate: (ops) => ops.length >= 1 && ops.includes("val"),
  },
  {
    id: 2,
    name: "Type Inference",
    description: "Let Kotlin infer the type instead of declaring it explicitly",
    inputDisplay: 'val name: ??? = "Kotlin"',
    targetDisplay: 'val name = "Kotlin"  // type: String',
    availableOps: ["type_inference", "type_string", "type_int"],
    slots: 1,
    par: 1,
    hint: "Kotlin can automatically determine the type from the assigned value.",
    teaches: "Type inference",
    validate: (ops) => ops.length >= 1 && ops.includes("type_inference"),
  },
  {
    id: 3,
    name: "String Templates",
    description: 'Create "Hello, World!" using string interpolation',
    inputDisplay: 'val name = "World"',
    targetDisplay: '"Hello, ${name}!"  // "Hello, World!"',
    availableOps: ["string_template", "concatenation", "format_str"],
    slots: 1,
    par: 1,
    hint: "String templates with ${} embed expressions directly in strings.",
    teaches: "String templates",
    validate: (ops) => ops.length >= 1 && ops.includes("string_template"),
  },
  {
    id: 4,
    name: "Nullable Default",
    description: "Provide a default value when a nullable String is null",
    inputDisplay: 'val input: String? = null',
    targetDisplay: 'val result: String = input ?: "default"\n// result = "default"',
    availableOps: ["elvis", "not_null_assert", "safe_call"],
    slots: 1,
    par: 1,
    hint: "The Elvis operator ?: provides a fallback when the left side is null.",
    teaches: "Elvis operator ?:",
    validate: (ops) => ops.length >= 1 && ops.includes("elvis"),
  },
  {
    id: 5,
    name: "Safe Calls",
    description: "Safely access nested nullable properties without crashing",
    inputDisplay: "val user: User? = getUser()\n// user?.address?.city",
    targetDisplay: "val city: String? = user?.address?.city\n// null if any part is null",
    availableOps: ["safe_call", "not_null_assert", "let_scope"],
    slots: 1,
    par: 1,
    hint: "The ?. operator short-circuits to null if the receiver is null.",
    teaches: "Safe call operator ?.",
    validate: (ops) => ops.length >= 1 && ops.includes("safe_call"),
  },
  /* ===== Block 2: Null Safety (6-9) ===== */
  {
    id: 6,
    name: "Let Scope",
    description: "Print a value only if it is not null",
    inputDisplay: "val name: String? = getName()",
    targetDisplay: 'name?.let { println(it) }\n// prints only if name != null',
    availableOps: ["let_scope", "also_scope", "safe_call", "elvis"],
    slots: 1,
    par: 1,
    hint: "?.let{} executes the lambda only when the value is non-null.",
    teaches: "?.let{} scope function",
    validate: (ops) => ops.length >= 1 && ops.includes("let_scope"),
  },
  {
    id: 7,
    name: "Elvis Chain",
    description: "Transform a nullable string or provide a default",
    inputDisplay: "val input: String? = getData()",
    targetDisplay: 'val result = input?.let { it.uppercase() } ?: "N/A"\n// transform or default',
    availableOps: ["let_scope", "elvis", "safe_call", "requireNotNull_op"],
    slots: 2,
    par: 2,
    hint: "Combine ?.let{} for transformation with ?: for a fallback value.",
    teaches: "?.let{} ?: pattern",
    validate: (ops) => {
      return ops.includes("let_scope") && ops.includes("elvis");
    },
  },
  {
    id: 8,
    name: "Smart Cast",
    description: "Safely access String.length from an Any reference",
    inputDisplay: 'val obj: Any = "Hello"',
    targetDisplay: "if (obj is String) {\n  println(obj.length)  // Smart cast to String\n}",
    availableOps: ["is_check", "as_safe", "as_unsafe"],
    slots: 1,
    par: 1,
    hint: "After an 'is' check, Kotlin automatically casts to that type.",
    teaches: "Smart cast with is",
    validate: (ops) => ops.length >= 1 && ops.includes("is_check"),
  },
  {
    id: 9,
    name: "Require Not Null",
    description: "Throw an exception with a message if a value is null",
    inputDisplay: "val config: String? = loadConfig()",
    targetDisplay: 'val safe = requireNotNull(config) { "Config missing!" }',
    availableOps: ["requireNotNull_op", "not_null_assert", "elvis"],
    slots: 1,
    par: 1,
    hint: "requireNotNull() throws IllegalArgumentException with a custom message.",
    teaches: "requireNotNull()",
    validate: (ops) => ops.length >= 1 && ops.includes("requireNotNull_op"),
  },
  /* ===== Block 3: Collections (10-14) ===== */
  {
    id: 10,
    name: "Map Transform",
    description: "Double every element in the list",
    inputDisplay: "val nums = listOf(1, 2, 3, 4, 5)",
    targetDisplay: "nums.map { it * 2 }\n// [2, 4, 6, 8, 10]",
    availableOps: ["map_op", "filter_op", "flatMap_op"],
    slots: 1,
    par: 1,
    hint: ".map{} transforms each element using the given lambda.",
    teaches: ".map{}",
    validate: (ops) => ops.length >= 1 && ops.includes("map_op"),
  },
  {
    id: 11,
    name: "Filter",
    description: "Keep only even numbers from the list",
    inputDisplay: "val nums = listOf(1, 2, 3, 4, 5, 6)",
    targetDisplay: "nums.filter { it % 2 == 0 }\n// [2, 4, 6]",
    availableOps: ["filter_op", "map_op", "take_op"],
    slots: 1,
    par: 1,
    hint: ".filter{} keeps elements where the predicate returns true.",
    teaches: ".filter{}",
    validate: (ops) => ops.length >= 1 && ops.includes("filter_op"),
  },
  {
    id: 12,
    name: "Map + Filter",
    description: "Double each element, then keep only those > 5",
    inputDisplay: "val nums = listOf(1, 2, 3, 4, 5)",
    targetDisplay: "nums.map { it * 2 }.filter { it > 5 }\n// [6, 8, 10]",
    availableOps: ["map_op", "filter_op", "reduce_op", "flatMap_op"],
    slots: 2,
    par: 2,
    hint: "Chain map first to transform, then filter to select.",
    teaches: "Chaining .map{} + .filter{}",
    validate: (ops) => {
      const mapIdx = ops.indexOf("map_op");
      const filterIdx = ops.indexOf("filter_op");
      return mapIdx !== -1 && filterIdx !== -1 && mapIdx < filterIdx;
    },
  },
  {
    id: 13,
    name: "Reduce",
    description: "Sum all elements into a single value",
    inputDisplay: "val nums = listOf(1, 2, 3, 4, 5)",
    targetDisplay: "nums.reduce { acc, x -> acc + x }\n// 15",
    availableOps: ["reduce_op", "map_op", "sum_op", "fold_op"],
    slots: 1,
    par: 1,
    hint: ".reduce{} accumulates elements pairwise using a binary operation.",
    teaches: ".reduce{}",
    validate: (ops) => ops.length >= 1 && (ops.includes("reduce_op") || ops.includes("sum_op")),
  },
  {
    id: 14,
    name: "GroupBy",
    description: "Group strings by their length",
    inputDisplay: 'val words = listOf("a", "bb", "c", "dd")',
    targetDisplay: 'words.groupBy { it.length }\n// {1: ["a", "c"], 2: ["bb", "dd"]}',
    availableOps: ["groupBy_op", "associate_op", "partition_op", "sortedBy_op"],
    slots: 1,
    par: 1,
    hint: ".groupBy{} creates a Map where the key is the selector result.",
    teaches: ".groupBy{}",
    validate: (ops) => ops.length >= 1 && ops.includes("groupBy_op"),
  },
  /* ===== Block 4: Type System (15-18) ===== */
  {
    id: 15,
    name: "Data Class",
    description: "Get auto-generated toString(), equals(), copy()",
    inputDisplay: 'class User(val name: String, val age: Int)\nUser("Alice", 25).toString()',
    targetDisplay: 'data class User(val name: String, val age: Int)\n// toString() = "User(name=Alice, age=25)"',
    availableOps: ["data_class", "class_op", "object_decl"],
    slots: 1,
    par: 1,
    hint: "The data keyword auto-generates useful methods from primary constructor properties.",
    teaches: "data class",
    validate: (ops) => ops.length >= 1 && ops.includes("data_class"),
  },
  {
    id: 16,
    name: "Copy & Modify",
    description: "Create a new User with updated age using copy()",
    inputDisplay: 'val alice = User("Alice", 25)',
    targetDisplay: 'val older = alice.copy(age = 26)\n// User("Alice", 26)',
    availableOps: ["copy_op", "constructor_op", "apply_scope"],
    slots: 1,
    par: 1,
    hint: ".copy() creates a new instance, overriding specified properties.",
    teaches: ".copy()",
    validate: (ops) => ops.length >= 1 && ops.includes("copy_op"),
  },
  {
    id: 17,
    name: "Sealed Class",
    description: "Create a sealed hierarchy with exhaustive when",
    inputDisplay: "// Need exhaustive type matching\nclass Result<T>",
    targetDisplay: "sealed class Result<T>\ndata class Success<T>(val data: T): Result<T>()\ndata class Error(val msg: String): Result<Nothing>()\n\nwhen(result) {\n  is Success -> result.data\n  is Error -> result.msg\n}",
    availableOps: ["sealed_class", "enum_class", "abstract_class", "when_op"],
    slots: 2,
    par: 2,
    hint: "sealed class restricts subclasses. Combined with when, the compiler verifies all cases.",
    teaches: "sealed class + when",
    validate: (ops) => ops.includes("sealed_class") && ops.includes("when_op"),
  },
  {
    id: 18,
    name: "Destructuring",
    description: "Extract name and value from a Pair into separate variables",
    inputDisplay: 'val pair = Pair("x", 1)',
    targetDisplay: 'val (name, value) = pair\n// name = "x", value = 1',
    availableOps: ["destructuring", "first_second", "get_op"],
    slots: 1,
    par: 1,
    hint: "Destructuring declarations call component1(), component2() etc. under the hood.",
    teaches: "Destructuring declarations",
    validate: (ops) => ops.length >= 1 && ops.includes("destructuring"),
  },
  /* ===== Block 5: Scope Functions (19-21) ===== */
  {
    id: 19,
    name: "Apply Builder",
    description: "Configure a StringBuilder using apply{}",
    inputDisplay: "val sb = StringBuilder()",
    targetDisplay: 'val sb = StringBuilder().apply {\n  append("Hello")\n  append(", ")\n  append("World!")\n}\n// "Hello, World!"',
    availableOps: ["apply_scope", "also_scope", "let_func", "run_scope"],
    slots: 1,
    par: 1,
    hint: "apply{} lets you configure an object using 'this' and returns the object itself.",
    teaches: "apply{} scope function",
    validate: (ops) => ops.length >= 1 && ops.includes("apply_scope"),
  },
  {
    id: 20,
    name: "Let Transform",
    description: "Transform a String into its length using let{}",
    inputDisplay: 'val greeting = "Hello, Kotlin!"',
    targetDisplay: 'val len = greeting.let { it.length }\n// len = 14',
    availableOps: ["let_func", "run_scope", "also_scope", "with_scope"],
    slots: 1,
    par: 1,
    hint: "let{} runs a lambda with the object as 'it' and returns the lambda result.",
    teaches: "let{} scope function",
    validate: (ops) => ops.length >= 1 && ops.includes("let_func"),
  },
  {
    id: 21,
    name: "Also Side Effect",
    description: "Log a list without changing the chain result",
    inputDisplay: "val nums = listOf(1, 2, 3).map { it * 2 }",
    targetDisplay: 'val nums = listOf(1, 2, 3)\n  .map { it * 2 }\n  .also { println("Mapped: $it") }\n// prints debug, returns [2, 4, 6]',
    availableOps: ["also_scope", "let_func", "apply_scope", "run_scope"],
    slots: 1,
    par: 1,
    hint: "also{} performs a side effect (like logging) and returns the original object.",
    teaches: "also{} scope function",
    validate: (ops) => ops.length >= 1 && ops.includes("also_scope"),
  },
  /* ===== Block 6: Advanced (22-25) ===== */
  {
    id: 22,
    name: "Extension Function",
    description: 'Add a custom capitalize method to String',
    inputDisplay: '"hello".customCapitalize()\n// needs a new method on String',
    targetDisplay: 'fun String.customCapitalize() =\n  replaceFirstChar { it.uppercase() }\n\n"hello".customCapitalize() // "Hello"',
    availableOps: ["extension", "method_op", "lambda_op"],
    slots: 1,
    par: 1,
    hint: "Extension functions add new methods to existing types without modifying them.",
    teaches: "Extension functions",
    validate: (ops) => ops.length >= 1 && ops.includes("extension"),
  },
  {
    id: 23,
    name: "Generics",
    description: "Create a type-safe Box container using generics",
    inputDisplay: "class Box(val value: Any)\n// Not type-safe!",
    targetDisplay: "class Box<T>(val value: T)\n\nval intBox: Box<Int> = Box(42)\nval strBox: Box<String> = Box(\"hello\")",
    availableOps: ["generic_t", "out_t", "in_t", "star_proj"],
    slots: 1,
    par: 1,
    hint: "<T> makes the class parameterized, ensuring type safety at compile time.",
    teaches: "Generic type parameters",
    validate: (ops) => ops.length >= 1 && ops.includes("generic_t"),
  },
  {
    id: 24,
    name: "Lazy Delegation",
    description: "Initialize an expensive property only on first access",
    inputDisplay: "val heavyData: String = computeExpensive()\n// runs immediately!",
    targetDisplay: "val heavyData: String by lazy {\n  computeExpensive()\n}\n// runs only on first access",
    availableOps: ["by_lazy", "by_map", "lateinit_op"],
    slots: 1,
    par: 1,
    hint: "by lazy{} defers initialization until the property is first accessed.",
    teaches: "by lazy delegation",
    validate: (ops) => ops.length >= 1 && ops.includes("by_lazy"),
  },
  {
    id: 25,
    name: "DSL Builder",
    description: "Build an HTML DSL using receiver lambdas, extensions, and apply",
    inputDisplay: '// Want: html { body { p("Hello DSL") } }',
    targetDisplay: 'fun html(init: HTML.() -> Unit): HTML =\n  HTML().apply(init)\n\nfun HTML.body(init: Body.() -> Unit) { ... }\n\nhtml {\n  body {\n    p("Hello DSL")\n  }\n}',
    availableOps: ["receiver_lambda", "extension", "apply_scope", "infix_op"],
    slots: 3,
    par: 3,
    hint: "Combine receiver lambdas (T.() -> R) with extension functions and apply for DSL structure.",
    teaches: "Kotlin DSL patterns",
    validate: (ops) => {
      return (
        ops.includes("receiver_lambda") &&
        ops.includes("extension") &&
        ops.includes("apply_scope")
      );
    },
  },
];

/* ============ Block Metadata ============ */
const LEVEL_BLOCKS = [
  { name: "Basics", range: [1, 5] as const },
  { name: "Null Safety", range: [6, 9] as const },
  { name: "Collections", range: [10, 14] as const },
  { name: "Type System", range: [15, 18] as const },
  { name: "Scope Functions", range: [19, 21] as const },
  { name: "Advanced", range: [22, 25] as const },
];

/* ============ Helpers ============ */
const PROGRESS_KEY = "kotlin-game-progress";
const MARBLE_COLORS = [
  "#7c3aed",
  "#22d3ee",
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#fbbf24",
  "#60a5fa",
  "#ef4444",
  "#a78bfa",
  "#2dd4bf",
];

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

/* ============ Marble Component ============ */
function Marble({
  value,
  size = "md",
  delay = 0,
}: {
  value: string;
  size?: "sm" | "md";
  delay?: number;
}) {
  const idx = value.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const color = MARBLE_COLORS[Math.abs(idx) % MARBLE_COLORS.length];
  const sz = size === "sm" ? "1.5rem" : "2.25rem";
  const fsz = size === "sm" ? "0.55rem" : "0.7rem";
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
export default function KotlinGamePage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [placedOps, setPlacedOps] = useState<(string | null)[]>([]);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
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

  const runCauldron = useCallback(() => {
    const filledOps = placedOps.filter(Boolean) as string[];
    if (filledOps.length === 0) return;

    setIsRunning(true);
    setResult(null);
    setAnimStep(-1);

    // Animate step by step through placed operators
    const timers: NodeJS.Timeout[] = [];
    const activeSlots = placedOps
      .map((op, i) => (op ? i : -1))
      .filter((i) => i >= 0);

    activeSlots.forEach((slotIdx, i) => {
      const timer = setTimeout(() => setAnimStep(slotIdx), (i + 1) * 700);
      timers.push(timer);
    });

    // Check result after animations
    const finalTimer = setTimeout(
      () => {
        const success = level.validate(filledOps);

        if (success) {
          const opsUsed = filledOps.length;
          const stars =
            opsUsed <= level.par ? 3 : opsUsed <= level.par + 1 ? 2 : 1;
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
      },
      (activeSlots.length + 1) * 700 + 300
    );
    timers.push(finalTimer);
    animTimers.current = timers;
  }, [placedOps, level, progress]);

  // Build Kotlin code from placed operators
  const buildKotlinCode = useCallback(() => {
    let code = `// Level ${level.id}: ${level.name}\n`;
    code += `// Input:\n`;
    code += level.inputDisplay
      .split("\n")
      .map((l) => `//   ${l}`)
      .join("\n");
    code += "\n\n// Solution:\n";
    for (const opId of placedOps) {
      if (opId && OPERATORS[opId]) {
        code += `${OPERATORS[opId].kotlinCode}\n`;
      }
    }
    code += `\n// Target: ${level.targetDisplay.split("\n")[0]}`;
    return code;
  }, [placedOps, level]);

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId === 1) return true;
      return progress[levelId - 1]?.completed || false;
    },
    [progress]
  );

  const totalStars = Object.values(progress).reduce(
    (sum, p) => sum + (p.stars || 0),
    0
  );
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
            <div className={styles.menuIcon}>{"\u2697\uFE0F"}</div>
            <h1 className={styles.menuTitle}>Kotlin Type Alchemist</h1>
            <p className={styles.menuSubtitle}>
              {t("kotlin-game-subtitle")}
            </p>
            <div className={styles.menuStats}>
              <span>
                {"\u2B50"} {totalStars}/{maxStars}
              </span>
              <span>
                {"\uD83D\uDCCA"}{" "}
                {
                  Object.values(progress).filter((p) => p.completed)
                    .length
                }
                /{LEVELS.length}
              </span>
            </div>
            <motion.button
              className={styles.playBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("levels")}
            >
              <PlayIcon /> {t("kotlin-game-play")}
            </motion.button>
            <motion.a
              href={createLocalizedPath("/developer-section")}
              className={styles.backLink}
              whileHover={{ x: -3 }}
            >
              <ArrowBack /> {t("kotlin-game-back-hub")}
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
              <button
                className={styles.iconBtn}
                onClick={() => setScreen("menu")}
              >
                <ArrowBack />
              </button>
              <h2 className={styles.levelsTitle}>
                {t("kotlin-game-select-level")}
              </h2>
              <span className={styles.levelsStars}>
                {"\u2B50"} {totalStars}/{maxStars}
              </span>
            </div>
            {LEVEL_BLOCKS.map((block) => {
              const blockLevels = LEVELS.filter(
                (l) => l.id >= block.range[0] && l.id <= block.range[1]
              );
              return (
                <div key={block.name}>
                  <div className={styles.blockTitle}>
                    {block.name}
                  </div>
                  <div className={styles.levelsGrid}>
                    {blockLevels.map((lvl) => {
                      const i = LEVELS.findIndex((l) => l.id === lvl.id);
                      const unlocked = isLevelUnlocked(lvl.id);
                      const prog = progress[lvl.id];
                      return (
                        <motion.button
                          key={lvl.id}
                          className={`${styles.levelCard} ${
                            !unlocked ? styles.levelLocked : ""
                          } ${
                            prog?.completed ? styles.levelCompleted : ""
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          whileHover={
                            unlocked ? { scale: 1.04, y: -4 } : {}
                          }
                          whileTap={unlocked ? { scale: 0.96 } : {}}
                          onClick={() => unlocked && startLevel(i)}
                          disabled={!unlocked}
                        >
                          {!unlocked && (
                            <LockIcon className={styles.lockIcon} />
                          )}
                          <span className={styles.levelNum}>{lvl.id}</span>
                          <span className={styles.levelName}>
                            {lvl.name}
                          </span>
                          <div className={styles.levelStars}>
                            {[1, 2, 3].map((s) =>
                              prog && prog.stars >= s ? (
                                <StarIcon
                                  key={s}
                                  className={styles.starFilled}
                                />
                              ) : (
                                <StarBorderIcon
                                  key={s}
                                  className={styles.starEmpty}
                                />
                              )
                            )}
                          </div>
                          {prog?.completed && (
                            <span className={styles.levelTeaches}>
                              {lvl.teaches}
                            </span>
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
              {t("kotlin-game-complete-title")}
            </h1>
            <p className={styles.completeSubtitle}>
              {t("kotlin-game-complete-subtitle")}
            </p>
            <div className={styles.completeStats}>
              <span>
                {"\u2B50"} {totalStars}/{maxStars}
              </span>
            </div>
            <div className={styles.completeCode}>
              <p className={styles.completeCodeLabel}>
                {t("kotlin-game-learned")}
              </p>
              <pre className={styles.codeBlock}>
                {`// Kotlin essentials you've mastered:
data class User(val name: String, val age: Int)

val user: User? = fetchUser()

val result = user
    ?.let { it.copy(age = it.age + 1) }
    ?: User("Guest", 0)

val nums = listOf(1, 2, 3, 4, 5)
    .map { it * 2 }
    .filter { it > 5 }
    .groupBy { if (it > 8) "high" else "low" }

sealed class Result<out T>
data class Success<T>(val data: T) : Result<T>()
data class Error(val msg: String) : Result<Nothing>()

val heavy: String by lazy { expensiveCompute() }

fun String.shout() = uppercase() + "!"
"hello".shout() // "HELLO!"`}
              </pre>
            </div>
            <div className={styles.completeBtns}>
              <button
                className={styles.playBtn}
                onClick={() => setScreen("levels")}
              >
                {t("kotlin-game-replay")}
              </button>
              <a
                href={createLocalizedPath("/developer-section")}
                className={styles.backLink}
              >
                <HomeIcon /> {t("kotlin-game-back-hub")}
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ============ Game Screen ============ */
  // Group available ops by category for display
  const groupedOps: { category: string; ops: string[] }[] = [];
  const seenCategories = new Set<string>();
  for (const opId of level.availableOps) {
    const op = OPERATORS[opId];
    if (!op) continue;
    if (!seenCategories.has(op.category)) {
      seenCategories.add(op.category);
      groupedOps.push({
        category: op.category,
        ops: level.availableOps.filter(
          (id) => OPERATORS[id]?.category === op.category
        ),
      });
    }
  }

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
            <button
              className={styles.iconBtn}
              onClick={() => setScreen("levels")}
            >
              <ArrowBack />
            </button>
            <div className={styles.gameHeaderInfo}>
              <span className={styles.gameLevelBadge}>
                Level {level.id}
              </span>
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

          {/* Cauldron Layout: Input | Cauldron | Target */}
          <div className={styles.cauldronLayout}>
            {/* Input Panel */}
            <div className={styles.ioPanel}>
              <div className={styles.ioPanelLabel}>INPUT</div>
              <div className={styles.ioPanelBox}>
                <pre className={styles.ioCode}>{level.inputDisplay}</pre>
                {/* Decorative marbles */}
                <div className={styles.marbleRow}>
                  {level.inputDisplay
                    .split(/\s+/)
                    .filter((w) => w.length <= 5 && w.length > 0)
                    .slice(0, 6)
                    .map((w, i) => (
                      <Marble
                        key={`in-${i}`}
                        value={w.replace(/[^a-zA-Z0-9?.:!]/g, "").slice(0, 3)}
                        size="sm"
                        delay={i * 0.05}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Cauldron Center */}
            <div className={styles.cauldronCenter}>
              <div className={styles.cauldronLabel}>
                {"\u2697\uFE0F"} CAULDRON
              </div>
              <div
                className={`${styles.cauldronBox} ${
                  isRunning ? styles.cauldronActive : ""
                } ${
                  result === "success"
                    ? styles.cauldronSuccess
                    : result === "fail"
                    ? styles.cauldronFail
                    : ""
                }`}
              >
                {placedOps.map((opId, slotIndex) => {
                  const op = opId ? OPERATORS[opId] : null;
                  const isActiveSlot = animStep === slotIndex;
                  return (
                    <div key={slotIndex} style={{ width: "100%" }}>
                      {slotIndex > 0 && (
                        <div className={styles.slotRow}>
                          <ArrowRight className={styles.slotArrow} />
                        </div>
                      )}
                      <div className={styles.slotRow}>
                        <motion.button
                          className={`${styles.cauldronSlot} ${
                            op ? styles.cauldronSlotFilled : ""
                          } ${isActiveSlot ? styles.cauldronSlotActive : ""}`}
                          style={
                            op
                              ? {
                                  borderColor: `${op.color}66`,
                                  background: `${op.color}15`,
                                }
                              : {}
                          }
                          whileHover={!isRunning ? { scale: 1.03 } : {}}
                          whileTap={!isRunning ? { scale: 0.97 } : {}}
                          onClick={() => placeOperator(slotIndex)}
                        >
                          <span className={styles.slotNumber}>
                            {slotIndex + 1}
                          </span>
                          {op ? (
                            <span
                              style={{ color: op.color, fontWeight: 600 }}
                            >
                              {op.emoji} {op.label}
                            </span>
                          ) : (
                            <span className={styles.slotPlaceholder}>
                              {selectedOp
                                ? t("kotlin-game-click-place")
                                : t("kotlin-game-select-op")}
                            </span>
                          )}
                        </motion.button>
                      </div>
                      {/* Intermediate animation step indicator */}
                      <AnimatePresence>
                        {isActiveSlot && op && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={styles.intermediateResult}
                          >
                            <div className={styles.intermediateBox}>
                              <span className={styles.intermediateCode}>
                                {op.kotlinCode}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Flow animation marbles */}
                <AnimatePresence>
                  {isRunning && (
                    <motion.div
                      className={styles.flowContainer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <Marble
                          key={`flow-${i}`}
                          value={
                            ["\u2697", "\uD83D\uDD25", "\u2728"][i]
                          }
                          size="sm"
                          delay={i * 0.2}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Target Panel */}
            <div
              className={`${styles.ioPanel} ${styles.targetPanel} ${
                result === "success"
                  ? styles.targetSuccess
                  : result === "fail"
                  ? styles.targetFail
                  : ""
              }`}
            >
              <div className={styles.ioPanelLabel}>TARGET</div>
              <div className={styles.ioPanelBox}>
                <pre className={styles.ioCode}>{level.targetDisplay}</pre>
                <div className={styles.marbleRow}>
                  {level.targetDisplay
                    .split(/\s+/)
                    .filter((w) => w.length <= 5 && w.length > 0)
                    .slice(0, 6)
                    .map((w, i) => (
                      <Marble
                        key={`tgt-${i}`}
                        value={w.replace(/[^a-zA-Z0-9?.:!]/g, "").slice(0, 3)}
                        size="sm"
                        delay={i * 0.05}
                      />
                    ))}
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
                className={`${styles.resultMessage} ${
                  result === "success"
                    ? styles.resultSuccess
                    : styles.resultFail
                }`}
              >
                {result === "success" ? (
                  <>
                    <span>
                      {"\uD83C\uDF89"} {t("kotlin-game-success")}
                    </span>
                    <span className={styles.resultStars}>
                      {"\u2B50".repeat(earnedStars)}
                    </span>
                  </>
                ) : (
                  <span>
                    {"\u274C"} {t("kotlin-game-try-again")}
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
                {t("kotlin-game-your-code")}
              </span>
              <pre className={styles.codeBlock}>{buildKotlinCode()}</pre>
            </motion.div>
          )}

          {/* Operator Toolbox */}
          <div className={styles.toolbox}>
            <div className={styles.toolboxLabel}>
              {t("kotlin-game-ingredients")}
            </div>
            <div className={styles.toolboxGrid}>
              {groupedOps.map((group) => (
                <div key={group.category} style={{ display: "contents" }}>
                  <div className={styles.categoryLabel}>
                    {group.category}
                  </div>
                  {group.ops.map((opId) => {
                    const op = OPERATORS[opId];
                    if (!op) return null;
                    const isPlaced = placedOps.includes(opId);
                    const isSelected = selectedOp === opId;
                    return (
                      <motion.button
                        key={opId}
                        className={`${styles.opCard} ${
                          isSelected ? styles.opCardSelected : ""
                        } ${isPlaced ? styles.opCardUsed : ""}`}
                        style={{
                          borderColor: isSelected
                            ? op.color
                            : `${op.color}44`,
                          background: isSelected
                            ? `${op.color}20`
                            : `${op.color}08`,
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          !isRunning &&
                          setSelectedOp(isSelected ? null : opId)
                        }
                        disabled={isRunning}
                      >
                        <span className={styles.opEmoji}>{op.emoji}</span>
                        <span
                          className={styles.opLabel}
                          style={{ color: op.color }}
                        >
                          {op.label}
                        </span>
                        <span className={styles.opDesc}>
                          {op.description}
                        </span>
                        <span className={styles.opCode}>
                          {op.kotlinCode}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionBar}>
            <button
              className={styles.hintBtn}
              onClick={() => setShowHint(!showHint)}
            >
              <HintIcon /> {t("kotlin-game-hint")}
            </button>
            <button className={styles.resetBtn} onClick={resetLevel}>
              <ResetIcon /> {t("kotlin-game-reset")}
            </button>
            <motion.button
              className={styles.runBtn}
              whileHover={canRun ? { scale: 1.04 } : {}}
              whileTap={canRun ? { scale: 0.96 } : {}}
              onClick={runCauldron}
              disabled={!canRun}
            >
              <PlayIcon />{" "}
              {isRunning
                ? t("kotlin-game-running")
                : t("kotlin-game-run")}
            </motion.button>
            {result === "success" && currentLevel < LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => startLevel(currentLevel + 1)}
              >
                {t("kotlin-game-next")} <ArrowRight />
              </motion.button>
            )}
            {result === "success" && currentLevel === LEVELS.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.nextBtn}
                onClick={() => setScreen("complete")}
              >
                {t("kotlin-game-finish")} <TrophyIcon />
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
                    <strong>{t("kotlin-game-teaches")}:</strong>{" "}
                    {level.teaches}
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
                  backgroundColor:
                    MARBLE_COLORS[i % MARBLE_COLORS.length],
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
