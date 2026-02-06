"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import styles from "../BlogPostPage.module.css";

// ==========================================
// SECTION 1: BIG O NOTATION - CODE EXAMPLES
// ==========================================

const bigOConstantTS = `// O(1) - Constant Time
// The operation takes the same time regardless of input size
// Think of it like looking up a word in a dictionary by page number

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0]; // Always one operation, no matter if array has 10 or 10 million elements
}

function getLastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]; // Still O(1) - direct index access
}

// Hash table lookup is O(1) on average
const hashMap = new Map<string, number>();
hashMap.set("apple", 5);
hashMap.set("banana", 3);
console.log(hashMap.get("apple")); // O(1) lookup

// Array access by index
const numbers = [10, 20, 30, 40, 50];
console.log("First:", getFirstElement(numbers)); // 10
console.log("Last:", getLastElement(numbers));   // 50
console.log("Direct access numbers[2]:", numbers[2]); // 30 - O(1)`;

const bigOConstantKT = `// O(1) - Constant Time
// The operation takes the same time regardless of input size
// Think of it like looking up a word in a dictionary by page number

fun <T> getFirstElement(arr: List<T>): T? {
    return arr.firstOrNull() // Always one operation
}

fun <T> getLastElement(arr: List<T>): T? {
    return arr.lastOrNull() // Still O(1) - direct index access
}

fun main() {
    // Hash table lookup is O(1) on average
    val hashMap = mutableMapOf<String, Int>()
    hashMap["apple"] = 5
    hashMap["banana"] = 3
    println(hashMap["apple"]) // O(1) lookup

    // Array access by index
    val numbers = listOf(10, 20, 30, 40, 50)
    println("First: \${getFirstElement(numbers)}") // 10
    println("Last: \${getLastElement(numbers)}")   // 50
    println("Direct access numbers[2]: \${numbers[2]}") // 30 - O(1)
}`;

const bigOLinearTS = `// O(n) - Linear Time
// Time grows proportionally with input size
// If input doubles, time roughly doubles

function findMax(arr: number[]): number {
  if (arr.length === 0) throw new Error("Empty array");

  let max = arr[0];
  let comparisons = 0;

  for (let i = 1; i < arr.length; i++) {
    comparisons++;
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  console.log(\`Array size: \${arr.length}, Comparisons: \${comparisons}\`);
  return max;
}

// Linear search - must check each element
function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1; // Not found
}

// Sum all elements - must visit each one
function sumArray(arr: number[]): number {
  return arr.reduce((sum, num) => sum + num, 0);
}

const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log("Max:", findMax(data));
console.log("Index of 9:", linearSearch(data, 9));
console.log("Sum:", sumArray(data));`;

const bigOLinearKT = `// O(n) - Linear Time
// Time grows proportionally with input size
// If input doubles, time roughly doubles

fun findMax(arr: List<Int>): Int {
    require(arr.isNotEmpty()) { "Empty array" }

    var max = arr[0]
    var comparisons = 0

    for (i in 1 until arr.size) {
        comparisons++
        if (arr[i] > max) {
            max = arr[i]
        }
    }

    println("Array size: \${arr.size}, Comparisons: $comparisons")
    return max
}

// Linear search - must check each element
fun <T> linearSearch(arr: List<T>, target: T): Int {
    for (i in arr.indices) {
        if (arr[i] == target) return i
    }
    return -1 // Not found
}

// Sum all elements - must visit each one
fun sumArray(arr: List<Int>): Int = arr.sum()

fun main() {
    val data = listOf(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5)
    println("Max: \${findMax(data)}")
    println("Index of 9: \${linearSearch(data, 9)}")
    println("Sum: \${sumArray(data)}")
}`;

const bigOLogTS = `// O(log n) - Logarithmic Time
// Halves the problem size with each step
// EXTREMELY efficient for large datasets!
// 1 billion elements? Only ~30 steps needed!

function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  let steps = 0;

  while (left <= right) {
    steps++;
    const mid = Math.floor((left + right) / 2);
    console.log(\`Step \${steps}: Checking index \${mid}, value \${arr[mid]}\`);

    if (arr[mid] === target) {
      console.log(\`Found in \${steps} steps!\`);
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;  // Discard left half
    } else {
      right = mid - 1; // Discard right half
    }
  }

  console.log(\`Not found after \${steps} steps\`);
  return -1;
}

// IMPORTANT: Array must be sorted for binary search!
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
console.log("Searching for 19 in array of", sortedArray.length, "elements:");
console.log("Result index:", binarySearch(sortedArray, 19));

console.log("\\nSearching for 10 (not in array):");
binarySearch(sortedArray, 10);`;

const bigOLogKT = `// O(log n) - Logarithmic Time
// Halves the problem size with each step
// EXTREMELY efficient for large datasets!
// 1 billion elements? Only ~30 steps needed!

fun binarySearch(arr: IntArray, target: Int): Int {
    var left = 0
    var right = arr.size - 1
    var steps = 0

    while (left <= right) {
        steps++
        val mid = (left + right) / 2
        println("Step $steps: Checking index $mid, value \${arr[mid]}")

        when {
            arr[mid] == target -> {
                println("Found in $steps steps!")
                return mid
            }
            arr[mid] < target -> left = mid + 1  // Discard left half
            else -> right = mid - 1              // Discard right half
        }
    }

    println("Not found after $steps steps")
    return -1
}

fun main() {
    // IMPORTANT: Array must be sorted for binary search!
    val sortedArray = intArrayOf(1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29)
    println("Searching for 19 in array of \${sortedArray.size} elements:")
    println("Result index: \${binarySearch(sortedArray, 19)}")

    println("\\nSearching for 10 (not in array):")
    binarySearch(sortedArray, 10)
}`;

const bigOQuadraticTS = `// O(n²) - Quadratic Time
// Nested loops over the data = n * n operations
// AVOID for large inputs! 10,000 elements = 100,000,000 operations!

function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;
  let swaps = 0;
  let comparisons = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swaps++;
      }
    }
  }

  console.log(\`Array size: \${n}\`);
  console.log(\`Total comparisons: \${comparisons}\`);
  console.log(\`Total swaps: \${swaps}\`);
  return result;
}

// Finding all pairs is also O(n²)
function findAllPairs(arr: number[]): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

const unsorted = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", unsorted);
console.log("Sorted:", bubbleSort(unsorted));

console.log("\\nAll pairs from [1,2,3]:", findAllPairs([1, 2, 3]));`;

const bigOQuadraticKT = `// O(n²) - Quadratic Time
// Nested loops over the data = n * n operations
// AVOID for large inputs! 10,000 elements = 100,000,000 operations!

fun bubbleSort(arr: IntArray): IntArray {
    val result = arr.copyOf()
    val n = result.size
    var swaps = 0
    var comparisons = 0

    for (i in 0 until n) {
        for (j in 0 until n - i - 1) {
            comparisons++
            if (result[j] > result[j + 1]) {
                val temp = result[j]
                result[j] = result[j + 1]
                result[j + 1] = temp
                swaps++
            }
        }
    }

    println("Array size: $n")
    println("Total comparisons: $comparisons")
    println("Total swaps: $swaps")
    return result
}

// Finding all pairs is also O(n²)
fun findAllPairs(arr: IntArray): List<Pair<Int, Int>> {
    val pairs = mutableListOf<Pair<Int, Int>>()
    for (i in arr.indices) {
        for (j in i + 1 until arr.size) {
            pairs.add(arr[i] to arr[j])
        }
    }
    return pairs
}

fun main() {
    val unsorted = intArrayOf(64, 34, 25, 12, 22, 11, 90)
    println("Original: \${unsorted.toList()}")
    println("Sorted: \${bubbleSort(unsorted).toList()}")

    println("\\nAll pairs from [1,2,3]: \${findAllPairs(intArrayOf(1, 2, 3))}")
}`;

const bigONLogNTS = `// O(n log n) - Linearithmic Time
// The "sweet spot" for comparison-based sorting
// Merge Sort, Quick Sort, Heap Sort all achieve this

function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));   // log n levels of recursion
  const right = mergeSort(arr.slice(mid));     // log n levels of recursion

  return merge(left, right);  // n operations at each level
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}

const data = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", data);
console.log("Merge Sorted:", mergeSort(data));

// Comparison with O(n²):
// n = 1,000,000
// O(n²) = 1,000,000,000,000 operations (1 trillion!)
// O(n log n) = 20,000,000 operations (20 million)
// That's 50,000x faster!`;

const bigONLogNKT = `// O(n log n) - Linearithmic Time
// The "sweet spot" for comparison-based sorting
// Merge Sort, Quick Sort, Heap Sort all achieve this

fun mergeSort(arr: List<Int>): List<Int> {
    if (arr.size <= 1) return arr

    val mid = arr.size / 2
    val left = mergeSort(arr.subList(0, mid))   // log n levels
    val right = mergeSort(arr.subList(mid, arr.size)) // log n levels

    return merge(left, right)  // n operations at each level
}

fun merge(left: List<Int>, right: List<Int>): List<Int> {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0

    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }

    result.addAll(left.subList(i, left.size))
    result.addAll(right.subList(j, right.size))
    return result
}

fun main() {
    val data = listOf(38, 27, 43, 3, 9, 82, 10)
    println("Original: $data")
    println("Merge Sorted: \${mergeSort(data)}")

    // Comparison with O(n²):
    // n = 1,000,000
    // O(n²) = 1,000,000,000,000 operations (1 trillion!)
    // O(n log n) = 20,000,000 operations (20 million)
    // That's 50,000x faster!
}`;

// ==========================================
// SECTION 2: ARRAYS - CODE EXAMPLES
// ==========================================

const arrayBasicsTS = `// Arrays: The Foundation of All Data Structures
// Contiguous memory, O(1) random access, cache-friendly

// Creating arrays
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: string[] = ["apple", "banana", "cherry"];
const mixed: (number | string)[] = [1, "two", 3];

// ========== BASIC OPERATIONS ==========

// ACCESS - O(1): Direct index access
console.log("First element:", numbers[0]);        // 1
console.log("Last element:", numbers[numbers.length - 1]); // 5
console.log("Middle element:", numbers[Math.floor(numbers.length / 2)]); // 3

// SEARCH - O(n): Must check each element
const index = numbers.indexOf(3);
console.log("Index of 3:", index); // 2
console.log("Includes 4?", numbers.includes(4)); // true

// INSERT at end - O(1) amortized
numbers.push(6);
console.log("After push(6):", numbers); // [1,2,3,4,5,6]

// INSERT at beginning - O(n): shifts all elements!
numbers.unshift(0);
console.log("After unshift(0):", numbers); // [0,1,2,3,4,5,6]

// INSERT at index - O(n)
numbers.splice(3, 0, 99);  // Insert 99 at index 3
console.log("After splice:", numbers); // [0,1,2,99,3,4,5,6]

// DELETE from end - O(1)
const popped = numbers.pop();
console.log("Popped:", popped, "Array:", numbers);

// DELETE from beginning - O(n)
const shifted = numbers.shift();
console.log("Shifted:", shifted, "Array:", numbers);

// DELETE at index - O(n)
numbers.splice(2, 1);  // Remove 1 element at index 2
console.log("After delete at index 2:", numbers);`;

const arrayBasicsKT = `// Arrays: The Foundation of All Data Structures
// Contiguous memory, O(1) random access, cache-friendly

fun main() {
    // Creating arrays/lists
    val numbers = mutableListOf(1, 2, 3, 4, 5)
    val strings = listOf("apple", "banana", "cherry")
    val mixed = listOf<Any>(1, "two", 3)

    // ========== BASIC OPERATIONS ==========

    // ACCESS - O(1): Direct index access
    println("First element: \${numbers[0]}")        // 1
    println("Last element: \${numbers.last()}")     // 5
    println("Middle element: \${numbers[numbers.size / 2]}") // 3

    // SEARCH - O(n): Must check each element
    val index = numbers.indexOf(3)
    println("Index of 3: $index") // 2
    println("Contains 4? \${4 in numbers}") // true

    // INSERT at end - O(1) amortized
    numbers.add(6)
    println("After add(6): $numbers") // [1,2,3,4,5,6]

    // INSERT at beginning - O(n): shifts all elements!
    numbers.add(0, 0)
    println("After add(0, 0): $numbers") // [0,1,2,3,4,5,6]

    // INSERT at index - O(n)
    numbers.add(3, 99)  // Insert 99 at index 3
    println("After add(3, 99): $numbers")

    // DELETE from end - O(1)
    val popped = numbers.removeLast()
    println("Removed last: $popped, Array: $numbers")

    // DELETE from beginning - O(n)
    val shifted = numbers.removeAt(0)
    println("Removed first: $shifted, Array: $numbers")

    // DELETE at index - O(n)
    numbers.removeAt(2)  // Remove element at index 2
    println("After removeAt(2): $numbers")
}`;

const arrayMethodsTS = `// Array Methods Every Developer Must Know
// These are your daily tools for array manipulation

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ========== TRANSFORMATION METHODS ==========

// MAP: Transform each element - O(n)
const doubled = nums.map(n => n * 2);
console.log("Doubled:", doubled); // [2,4,6,8,10,12,14,16,18,20]

// FILTER: Keep elements matching condition - O(n)
const evens = nums.filter(n => n % 2 === 0);
console.log("Evens:", evens); // [2,4,6,8,10]

// REDUCE: Accumulate to single value - O(n)
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 55

const product = nums.reduce((acc, n) => acc * n, 1);
console.log("Product:", product); // 3628800

// FIND: Get first matching element - O(n)
const firstEven = nums.find(n => n % 2 === 0);
console.log("First even:", firstEven); // 2

// FINDINDEX: Get index of first match - O(n)
const firstEvenIndex = nums.findIndex(n => n % 2 === 0);
console.log("First even index:", firstEvenIndex); // 1

// SOME: Check if any element matches - O(n)
const hasEven = nums.some(n => n % 2 === 0);
console.log("Has even?", hasEven); // true

// EVERY: Check if all elements match - O(n)
const allPositive = nums.every(n => n > 0);
console.log("All positive?", allPositive); // true

// ========== CHAINING METHODS ==========
// Powerful pattern: chain multiple operations
const result = nums
  .filter(n => n % 2 === 0)      // Keep evens: [2,4,6,8,10]
  .map(n => n * n)               // Square: [4,16,36,64,100]
  .reduce((a, b) => a + b, 0);   // Sum: 220
console.log("Evens squared summed:", result);`;

const arrayMethodsKT = `// Array Methods Every Developer Must Know
// These are your daily tools for array manipulation

fun main() {
    val nums = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // ========== TRANSFORMATION METHODS ==========

    // MAP: Transform each element - O(n)
    val doubled = nums.map { it * 2 }
    println("Doubled: $doubled") // [2,4,6,8,10,12,14,16,18,20]

    // FILTER: Keep elements matching condition - O(n)
    val evens = nums.filter { it % 2 == 0 }
    println("Evens: $evens") // [2,4,6,8,10]

    // REDUCE: Accumulate to single value - O(n)
    val sum = nums.reduce { acc, n -> acc + n }
    println("Sum: $sum") // 55

    val product = nums.reduce { acc, n -> acc * n }
    println("Product: $product") // 3628800

    // FIND: Get first matching element - O(n)
    val firstEven = nums.find { it % 2 == 0 }
    println("First even: $firstEven") // 2

    // INDEXOFFIRST: Get index of first match - O(n)
    val firstEvenIndex = nums.indexOfFirst { it % 2 == 0 }
    println("First even index: $firstEvenIndex") // 1

    // ANY: Check if any element matches - O(n)
    val hasEven = nums.any { it % 2 == 0 }
    println("Has even? $hasEven") // true

    // ALL: Check if all elements match - O(n)
    val allPositive = nums.all { it > 0 }
    println("All positive? $allPositive") // true

    // ========== CHAINING METHODS ==========
    // Powerful pattern: chain multiple operations
    val result = nums
        .filter { it % 2 == 0 }    // Keep evens: [2,4,6,8,10]
        .map { it * it }           // Square: [4,16,36,64,100]
        .reduce { a, b -> a + b }  // Sum: 220
    println("Evens squared summed: $result")
}`;

const twoSumTS = `// ===== INTERVIEW CLASSIC: Two Sum =====
// Given an array and target, find two numbers that add up to target
// Return their indices

// BRUTE FORCE: O(n²) - Check all pairs
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// OPTIMAL: O(n) - Use hash map to find complement
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

// Test cases
console.log("Example 1:", twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log("Example 2:", twoSum([3, 2, 4], 6));      // [1, 2]
console.log("Example 3:", twoSum([3, 3], 6));         // [0, 1]

// Why hash map works:
// For each number, we ask: "Have I seen its complement before?"
// If yes, we found our pair!
// If no, store current number for future lookups`;

const twoSumKT = `// ===== INTERVIEW CLASSIC: Two Sum =====
// Given an array and target, find two numbers that add up to target
// Return their indices

// BRUTE FORCE: O(n²) - Check all pairs
fun twoSumBrute(nums: IntArray, target: Int): IntArray {
    for (i in nums.indices) {
        for (j in i + 1 until nums.size) {
            if (nums[i] + nums[j] == target) {
                return intArrayOf(i, j)
            }
        }
    }
    return intArrayOf()
}

// OPTIMAL: O(n) - Use hash map to find complement
fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = mutableMapOf<Int, Int>() // value -> index

    for (i in nums.indices) {
        val complement = target - nums[i]

        if (complement in seen) {
            return intArrayOf(seen[complement]!!, i)
        }

        seen[nums[i]] = i
    }

    return intArrayOf()
}

fun main() {
    // Test cases
    println("Example 1: \${twoSum(intArrayOf(2, 7, 11, 15), 9).toList()}") // [0, 1]
    println("Example 2: \${twoSum(intArrayOf(3, 2, 4), 6).toList()}")      // [1, 2]
    println("Example 3: \${twoSum(intArrayOf(3, 3), 6).toList()}")         // [0, 1]

    // Why hash map works:
    // For each number, we ask: "Have I seen its complement before?"
    // If yes, we found our pair!
    // If no, store current number for future lookups
}`;

const maxSubarrayTS = `// ===== INTERVIEW CLASSIC: Maximum Subarray (Kadane's Algorithm) =====
// Find the contiguous subarray with the largest sum
// This is THE algorithm to know for array problems!

function maxSubArray(nums: number[]): number {
  if (nums.length === 0) return 0;

  let maxSum = nums[0];      // Best sum found so far
  let currentSum = nums[0];  // Sum of current subarray

  // Track the actual subarray (bonus)
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    // Key insight: Should we extend current subarray or start fresh?
    // If currentSum + nums[i] < nums[i], start fresh!
    if (currentSum + nums[i] < nums[i]) {
      currentSum = nums[i];
      tempStart = i;
    } else {
      currentSum = currentSum + nums[i];
    }

    // Update max if current is better
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  console.log(\`Max subarray: [\${nums.slice(start, end + 1)}]\`);
  console.log(\`From index \${start} to \${end}\`);
  return maxSum;
}

// Test cases
console.log("Max sum:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log("\\nMax sum:", maxSubArray([1])); // 1
console.log("\\nMax sum:", maxSubArray([5, 4, -1, 7, 8])); // 23

// Visual walkthrough for [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
// i=0: current=-2, max=-2
// i=1: current=1 (start fresh), max=1
// i=2: current=-2, max=1
// i=3: current=4 (start fresh), max=4
// i=4: current=3, max=4
// i=5: current=5, max=5
// i=6: current=6, max=6 ← Winner: [4,-1,2,1]
// i=7: current=1, max=6
// i=8: current=5, max=6`;

const maxSubarrayKT = `// ===== INTERVIEW CLASSIC: Maximum Subarray (Kadane's Algorithm) =====
// Find the contiguous subarray with the largest sum
// This is THE algorithm to know for array problems!

fun maxSubArray(nums: IntArray): Int {
    if (nums.isEmpty()) return 0

    var maxSum = nums[0]      // Best sum found so far
    var currentSum = nums[0]  // Sum of current subarray

    // Track the actual subarray (bonus)
    var start = 0
    var end = 0
    var tempStart = 0

    for (i in 1 until nums.size) {
        // Key insight: Should we extend current subarray or start fresh?
        // If currentSum + nums[i] < nums[i], start fresh!
        if (currentSum + nums[i] < nums[i]) {
            currentSum = nums[i]
            tempStart = i
        } else {
            currentSum += nums[i]
        }

        // Update max if current is better
        if (currentSum > maxSum) {
            maxSum = currentSum
            start = tempStart
            end = i
        }
    }

    println("Max subarray: \${nums.slice(start..end)}")
    println("From index $start to $end")
    return maxSum
}

fun main() {
    // Test cases
    println("Max sum: \${maxSubArray(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4))}") // 6
    println("\\nMax sum: \${maxSubArray(intArrayOf(1))}") // 1
    println("\\nMax sum: \${maxSubArray(intArrayOf(5, 4, -1, 7, 8))}") // 23

    // Visual walkthrough for [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
    // i=0: current=-2, max=-2
    // i=1: current=1 (start fresh), max=1
    // ... Winner: [4,-1,2,1] = 6
}`;

// ==========================================
// SECTION 3: LINKED LISTS - CODE EXAMPLES
// ==========================================

const linkedListTS = `// ===== SINGLY LINKED LIST =====
// Each node points to the next node
// Advantages: O(1) insert/delete at known position
// Disadvantages: No random access, extra memory for pointers

class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  length: number = 0;

  // Add to end - O(1) with tail pointer
  append(value: T): this {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }

    this.length++;
    return this;
  }

  // Add to beginning - O(1)
  prepend(value: T): this {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    this.length++;
    return this;
  }

  // Get at index - O(n)
  getAt(index: number): T | null {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current!.value;
  }

  // Insert at index - O(n)
  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this.length) return false;
    if (index === 0) { this.prepend(value); return true; }
    if (index === this.length) { this.append(value); return true; }

    const node = new ListNode(value);
    let current = this.head;

    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    node.next = current!.next;
    current!.next = node;
    this.length++;

    return true;
  }

  // Remove at index - O(n)
  removeAt(index: number): T | null {
    if (index < 0 || index >= this.length) return null;

    let removed: ListNode<T>;

    if (index === 0) {
      removed = this.head!;
      this.head = this.head!.next;
      if (this.length === 1) this.tail = null;
    } else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current!.next;
      }
      removed = current!.next!;
      current!.next = removed.next;
      if (index === this.length - 1) this.tail = current;
    }

    this.length--;
    return removed.value;
  }

  // Print list
  print(): string {
    const values: T[] = [];
    let current = this.head;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    return values.join(" -> ") + " -> null";
  }
}

// Demo
const list = new SinglyLinkedList<number>();
list.append(1).append(2).append(3).append(4);
console.log("Initial:", list.print());

list.prepend(0);
console.log("After prepend(0):", list.print());

list.insertAt(2, 99);
console.log("After insertAt(2, 99):", list.print());

console.log("Get at index 3:", list.getAt(3));

list.removeAt(2);
console.log("After removeAt(2):", list.print());

console.log("Length:", list.length);`;

const linkedListKT = `// ===== SINGLY LINKED LIST =====
// Each node points to the next node
// Advantages: O(1) insert/delete at known position
// Disadvantages: No random access, extra memory for pointers

class ListNode<T>(val value: T) {
    var next: ListNode<T>? = null
}

class SinglyLinkedList<T> {
    var head: ListNode<T>? = null
    var tail: ListNode<T>? = null
    var length: Int = 0

    // Add to end - O(1) with tail pointer
    fun append(value: T): SinglyLinkedList<T> {
        val node = ListNode(value)

        if (head == null) {
            head = node
            tail = node
        } else {
            tail?.next = node
            tail = node
        }

        length++
        return this
    }

    // Add to beginning - O(1)
    fun prepend(value: T): SinglyLinkedList<T> {
        val node = ListNode(value)
        node.next = head
        head = node

        if (tail == null) {
            tail = node
        }

        length++
        return this
    }

    // Get at index - O(n)
    fun getAt(index: Int): T? {
        if (index < 0 || index >= length) return null

        var current = head
        repeat(index) {
            current = current?.next
        }

        return current?.value
    }

    // Insert at index - O(n)
    fun insertAt(index: Int, value: T): Boolean {
        if (index < 0 || index > length) return false
        if (index == 0) { prepend(value); return true }
        if (index == length) { append(value); return true }

        val node = ListNode(value)
        var current = head

        repeat(index - 1) {
            current = current?.next
        }

        node.next = current?.next
        current?.next = node
        length++

        return true
    }

    // Print list
    fun print(): String {
        val values = mutableListOf<T>()
        var current = head

        while (current != null) {
            values.add(current.value)
            current = current.next
        }

        return values.joinToString(" -> ") + " -> null"
    }
}

fun main() {
    val list = SinglyLinkedList<Int>()
    list.append(1).append(2).append(3).append(4)
    println("Initial: \${list.print()}")

    list.prepend(0)
    println("After prepend(0): \${list.print()}")

    list.insertAt(2, 99)
    println("After insertAt(2, 99): \${list.print()}")

    println("Get at index 3: \${list.getAt(3)}")

    println("Length: \${list.length}")
}`;

const reverseLinkedListTS = `// ===== INTERVIEW CLASSIC: Reverse a Linked List =====
// THE most common linked list interview question!
// Learn this pattern cold - it appears everywhere

class ListNode {
  constructor(
    public val: number,
    public next: ListNode | null = null
  ) {}
}

// ITERATIVE APPROACH - O(n) time, O(1) space
// This is the preferred solution
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    // 1. Save the next node (we'll lose reference otherwise)
    const nextTemp = current.next;

    // 2. Reverse the pointer
    current.next = prev;

    // 3. Move prev and current forward
    prev = current;
    current = nextTemp;
  }

  // prev is now the new head
  return prev;
}

// RECURSIVE APPROACH - O(n) time, O(n) space (call stack)
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // Base case: empty or single node
  if (head === null || head.next === null) {
    return head;
  }

  // Recursively reverse the rest
  const newHead = reverseListRecursive(head.next);

  // The magic: make the next node point back to us
  head.next.next = head;
  head.next = null;

  return newHead;
}

// Helper to print list
function printList(head: ListNode | null): string {
  const values: number[] = [];
  while (head) {
    values.push(head.val);
    head = head.next;
  }
  return values.join(" -> ");
}

// Create: 1 -> 2 -> 3 -> 4 -> 5
let head: ListNode | null = new ListNode(1,
  new ListNode(2,
    new ListNode(3,
      new ListNode(4,
        new ListNode(5)))));

console.log("Original:", printList(head));

head = reverseList(head);
console.log("Reversed:", printList(head));

// Visual walkthrough:
// Initial:  1 -> 2 -> 3 -> 4 -> 5 -> null
//           ^
//           current, prev=null
//
// Step 1:   null <- 1    2 -> 3 -> 4 -> 5 -> null
//                   ^    ^
//                   prev current
//
// Step 2:   null <- 1 <- 2    3 -> 4 -> 5 -> null
//                        ^    ^
//                        prev current
// ... continue until current is null`;

const reverseLinkedListKT = `// ===== INTERVIEW CLASSIC: Reverse a Linked List =====
// THE most common linked list interview question!
// Learn this pattern cold - it appears everywhere

class ListNode(var value: Int) {
    var next: ListNode? = null
}

// ITERATIVE APPROACH - O(n) time, O(1) space
// This is the preferred solution
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var current = head

    while (current != null) {
        // 1. Save the next node
        val nextTemp = current.next

        // 2. Reverse the pointer
        current.next = prev

        // 3. Move prev and current forward
        prev = current
        current = nextTemp
    }

    // prev is now the new head
    return prev
}

// RECURSIVE APPROACH - O(n) time, O(n) space (call stack)
fun reverseListRecursive(head: ListNode?): ListNode? {
    // Base case: empty or single node
    if (head?.next == null) {
        return head
    }

    // Recursively reverse the rest
    val newHead = reverseListRecursive(head.next)

    // The magic: make the next node point back to us
    head.next?.next = head
    head.next = null

    return newHead
}

// Helper to print list
fun printList(head: ListNode?): String {
    val values = mutableListOf<Int>()
    var current = head
    while (current != null) {
        values.add(current.value)
        current = current.next
    }
    return values.joinToString(" -> ")
}

fun main() {
    // Create: 1 -> 2 -> 3 -> 4 -> 5
    val n5 = ListNode(5)
    val n4 = ListNode(4).also { it.next = n5 }
    val n3 = ListNode(3).also { it.next = n4 }
    val n2 = ListNode(2).also { it.next = n3 }
    var head: ListNode? = ListNode(1).also { it.next = n2 }

    println("Original: \${printList(head)}")

    head = reverseList(head)
    println("Reversed: \${printList(head)}")
}`;

const detectCycleTS = `// ===== INTERVIEW CLASSIC: Detect Cycle in Linked List =====
// Floyd's Cycle Detection (Tortoise and Hare)
// Brilliant algorithm using two pointers at different speeds

class ListNode {
  constructor(
    public val: number,
    public next: ListNode | null = null
  ) {}
}

// Detect if cycle exists - O(n) time, O(1) space
function hasCycle(head: ListNode | null): boolean {
  if (!head || !head.next) return false;

  let slow = head;        // Moves 1 step at a time
  let fast = head.next;   // Moves 2 steps at a time

  while (slow !== fast) {
    // If fast reaches end, no cycle
    if (!fast || !fast.next) {
      return false;
    }

    slow = slow.next!;
    fast = fast.next.next;
  }

  // They met - there's a cycle!
  return true;
}

// Find where cycle begins - O(n) time, O(1) space
function detectCycle(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return null;

  let slow = head;
  let fast = head;

  // Phase 1: Detect if cycle exists
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;

    if (slow === fast) {
      // Phase 2: Find cycle start
      // Mathematical proof: distance from head to cycle start
      // equals distance from meeting point to cycle start
      let pointer = head;
      while (pointer !== slow) {
        pointer = pointer.next!;
        slow = slow.next!;
      }
      return pointer;
    }
  }

  return null; // No cycle
}

// Create a list with cycle: 1 -> 2 -> 3 -> 4 -> 5
//                                    ^         |
//                                    |_________|
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);
const node4 = new ListNode(4);
const node5 = new ListNode(5);

node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
node5.next = node3;  // Creates cycle back to node3

console.log("Has cycle:", hasCycle(node1)); // true

const cycleStart = detectCycle(node1);
console.log("Cycle starts at node with value:", cycleStart?.val); // 3

// Why does Floyd's algorithm work?
// If there's a cycle, fast will eventually "lap" slow
// They MUST meet because fast gains 1 node per iteration
// Meeting point math proves the cycle start location`;

const detectCycleKT = `// ===== INTERVIEW CLASSIC: Detect Cycle in Linked List =====
// Floyd's Cycle Detection (Tortoise and Hare)
// Brilliant algorithm using two pointers at different speeds

class ListNode(var value: Int) {
    var next: ListNode? = null
}

// Detect if cycle exists - O(n) time, O(1) space
fun hasCycle(head: ListNode?): Boolean {
    if (head?.next == null) return false

    var slow = head        // Moves 1 step at a time
    var fast = head.next   // Moves 2 steps at a time

    while (slow != fast) {
        // If fast reaches end, no cycle
        if (fast?.next == null) {
            return false
        }

        slow = slow?.next
        fast = fast.next?.next
    }

    // They met - there's a cycle!
    return true
}

// Find where cycle begins - O(n) time, O(1) space
fun detectCycle(head: ListNode?): ListNode? {
    if (head?.next == null) return null

    var slow = head
    var fast = head

    // Phase 1: Detect if cycle exists
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next

        if (slow == fast) {
            // Phase 2: Find cycle start
            var pointer = head
            while (pointer != slow) {
                pointer = pointer?.next
                slow = slow?.next
            }
            return pointer
        }
    }

    return null // No cycle
}

fun main() {
    // Create a list with cycle: 1 -> 2 -> 3 -> 4 -> 5
    //                                    ^         |
    //                                    |_________|
    val node1 = ListNode(1)
    val node2 = ListNode(2)
    val node3 = ListNode(3)
    val node4 = ListNode(4)
    val node5 = ListNode(5)

    node1.next = node2
    node2.next = node3
    node3.next = node4
    node4.next = node5
    node5.next = node3  // Creates cycle back to node3

    println("Has cycle: \${hasCycle(node1)}") // true

    val cycleStart = detectCycle(node1)
    println("Cycle starts at node with value: \${cycleStart?.value}") // 3
}`;

// ==========================================
// SECTION 4: STACKS - CODE EXAMPLES
// ==========================================

const stackImplementationTS = `// ===== STACK: Last In, First Out (LIFO) =====
// Think of a stack of plates - you can only add/remove from the top
// Operations: push, pop, peek - all O(1)!

class Stack<T> {
  private items: T[] = [];

  // Add to top - O(1)
  push(item: T): void {
    this.items.push(item);
  }

  // Remove from top - O(1)
  pop(): T | undefined {
    return this.items.pop();
  }

  // View top without removing - O(1)
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Check if empty - O(1)
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Get size - O(1)
  size(): number {
    return this.items.length;
  }

  // Clear all elements
  clear(): void {
    this.items = [];
  }

  // Print stack (for debugging)
  print(): string {
    return \`Stack (top->bottom): [\${this.items.slice().reverse().join(", ")}]\`;
  }
}

// Demo
const stack = new Stack<number>();

console.log("=== Stack Operations ===");
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.print()); // [30, 20, 10]

console.log("Peek:", stack.peek());        // 30
console.log("Pop:", stack.pop());          // 30
console.log("After pop:", stack.print());  // [20, 10]
console.log("Size:", stack.size());        // 2
console.log("Is empty?", stack.isEmpty()); // false

// Real-world uses of stacks:
// 1. Undo/Redo functionality
// 2. Browser back button
// 3. Function call stack
// 4. Expression evaluation
// 5. Syntax parsing`;

const stackImplementationKT = `// ===== STACK: Last In, First Out (LIFO) =====
// Think of a stack of plates - you can only add/remove from the top
// Operations: push, pop, peek - all O(1)!

class Stack<T> {
    private val items = mutableListOf<T>()

    // Add to top - O(1)
    fun push(item: T) {
        items.add(item)
    }

    // Remove from top - O(1)
    fun pop(): T? {
        return if (items.isNotEmpty()) items.removeLast() else null
    }

    // View top without removing - O(1)
    fun peek(): T? {
        return items.lastOrNull()
    }

    // Check if empty - O(1)
    fun isEmpty(): Boolean = items.isEmpty()

    // Get size - O(1)
    fun size(): Int = items.size

    // Clear all elements
    fun clear() {
        items.clear()
    }

    // Print stack (for debugging)
    fun print(): String {
        return "Stack (top->bottom): [\${items.reversed().joinToString(", ")}]"
    }
}

fun main() {
    val stack = Stack<Int>()

    println("=== Stack Operations ===")
    stack.push(10)
    stack.push(20)
    stack.push(30)
    println(stack.print()) // [30, 20, 10]

    println("Peek: \${stack.peek()}")        // 30
    println("Pop: \${stack.pop()}")          // 30
    println("After pop: \${stack.print()}")  // [20, 10]
    println("Size: \${stack.size()}")        // 2
    println("Is empty? \${stack.isEmpty()}") // false
}`;

const validParenthesesTS = `// ===== INTERVIEW CLASSIC: Valid Parentheses =====
// Check if brackets are properly balanced and nested
// This is a MUST-KNOW stack problem!

function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      // Opening bracket: push to stack
      stack.push(char);
    } else {
      // Closing bracket: must match top of stack
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  // Stack must be empty (all brackets matched)
  return stack.length === 0;
}

// Test cases
console.log("'()' =>", isValid("()"));           // true
console.log("'()[]{}' =>", isValid("()[]{}"));   // true
console.log("'(]' =>", isValid("(]"));           // false
console.log("'([)]' =>", isValid("([)]"));       // false
console.log("'{[]}' =>", isValid("{[]}"));       // true
console.log("'(((' =>", isValid("((("));         // false (unclosed)
console.log("')))' =>", isValid(")))"));         // false (no opening)

// Why this works:
// - Opening brackets go on stack
// - Closing brackets must match most recent opening (LIFO!)
// - If we can't match or stack isn't empty, it's invalid`;

const validParenthesesKT = `// ===== INTERVIEW CLASSIC: Valid Parentheses =====
// Check if brackets are properly balanced and nested
// This is a MUST-KNOW stack problem!

fun isValid(s: String): Boolean {
    val stack = mutableListOf<Char>()
    val pairs = mapOf(')' to '(', ']' to '[', '}' to '{')

    for (char in s) {
        when (char) {
            '(', '[', '{' -> {
                // Opening bracket: push to stack
                stack.add(char)
            }
            else -> {
                // Closing bracket: must match top of stack
                if (stack.isEmpty() || stack.removeLast() != pairs[char]) {
                    return false
                }
            }
        }
    }

    // Stack must be empty (all brackets matched)
    return stack.isEmpty()
}

fun main() {
    // Test cases
    println("'()' => \${isValid("()")}")           // true
    println("'()[]{}' => \${isValid("()[]{}")}")   // true
    println("'(]' => \${isValid("(]")}")           // false
    println("'([)]' => \${isValid("([)]")}")       // false
    println("'{[]}' => \${isValid("{[]}")}")       // true
    println("'(((' => \${isValid("(((")}")         // false (unclosed)
    println("')))' => \${isValid(")))")}")         // false (no opening)
}`;

const minStackTS = `// ===== INTERVIEW CLASSIC: Min Stack =====
// Design a stack that supports push, pop, top, and getMin in O(1)
// The trick: maintain a second stack to track minimums!

class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];  // Tracks minimum at each level

  push(val: number): void {
    this.stack.push(val);

    // Push to minStack if empty or val <= current min
    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop(): void {
    const popped = this.stack.pop();

    // If popped value was the min, remove from minStack too
    if (popped === this.getMin()) {
      this.minStack.pop();
    }
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

// Demo
const minStack = new MinStack();

minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log("Min:", minStack.getMin()); // -3

minStack.pop();
console.log("Top:", minStack.top());    // 0
console.log("Min:", minStack.getMin()); // -2

minStack.push(-1);
console.log("Min:", minStack.getMin()); // -2 (still!)

// Why two stacks?
// When we pop, we need to know what the min was BEFORE that element
// The minStack keeps a history of minimums`;

const minStackKT = `// ===== INTERVIEW CLASSIC: Min Stack =====
// Design a stack that supports push, pop, top, and getMin in O(1)
// The trick: maintain a second stack to track minimums!

class MinStack {
    private val stack = mutableListOf<Int>()
    private val minStack = mutableListOf<Int>()  // Tracks minimum at each level

    fun push(value: Int) {
        stack.add(value)

        // Push to minStack if empty or val <= current min
        if (minStack.isEmpty() || value <= getMin()) {
            minStack.add(value)
        }
    }

    fun pop() {
        val popped = stack.removeLast()

        // If popped value was the min, remove from minStack too
        if (popped == getMin()) {
            minStack.removeLast()
        }
    }

    fun top(): Int = stack.last()

    fun getMin(): Int = minStack.last()
}

fun main() {
    val minStack = MinStack()

    minStack.push(-2)
    minStack.push(0)
    minStack.push(-3)
    println("Min: \${minStack.getMin()}") // -3

    minStack.pop()
    println("Top: \${minStack.top()}")    // 0
    println("Min: \${minStack.getMin()}") // -2

    minStack.push(-1)
    println("Min: \${minStack.getMin()}") // -2 (still!)
}`;

// ==========================================
// SECTION 5: QUEUES - CODE EXAMPLES
// ==========================================

const queueImplementationTS = `// ===== QUEUE: First In, First Out (FIFO) =====
// Think of a line at a store - first person in line is first served
// Operations: enqueue, dequeue, front - all O(1)!

class Queue<T> {
  private items: T[] = [];
  private head: number = 0;  // Index of front element

  // Add to back - O(1)
  enqueue(item: T): void {
    this.items.push(item);
  }

  // Remove from front - O(1) amortized
  // Note: Using head pointer instead of shift() for O(1)
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.head];
    this.head++;

    // Clean up when head gets too far ahead
    if (this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  // View front without removing - O(1)
  front(): T | undefined {
    return this.items[this.head];
  }

  // View back - O(1)
  back(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  size(): number {
    return this.items.length - this.head;
  }

  print(): string {
    return \`Queue (front->back): [\${this.items.slice(this.head).join(", ")}]\`;
  }
}

// Demo
const queue = new Queue<string>();

console.log("=== Queue Operations ===");
queue.enqueue("Alice");
queue.enqueue("Bob");
queue.enqueue("Charlie");
console.log(queue.print()); // [Alice, Bob, Charlie]

console.log("Front:", queue.front());      // Alice
console.log("Dequeue:", queue.dequeue());  // Alice
console.log("After dequeue:", queue.print()); // [Bob, Charlie]
console.log("Size:", queue.size());        // 2

// Real-world uses of queues:
// 1. Print job scheduling
// 2. Task scheduling (CPU)
// 3. Breadth-first search
// 4. Message queues
// 5. Handling requests (web servers)`;

const queueImplementationKT = `// ===== QUEUE: First In, First Out (FIFO) =====
// Think of a line at a store - first person in line is first served
// Operations: enqueue, dequeue, front - all O(1)!

import java.util.LinkedList

class Queue<T> {
    // Using LinkedList for true O(1) operations
    private val items = LinkedList<T>()

    // Add to back - O(1)
    fun enqueue(item: T) {
        items.addLast(item)
    }

    // Remove from front - O(1)
    fun dequeue(): T? {
        return if (items.isNotEmpty()) items.removeFirst() else null
    }

    // View front without removing - O(1)
    fun front(): T? = items.firstOrNull()

    // View back - O(1)
    fun back(): T? = items.lastOrNull()

    fun isEmpty(): Boolean = items.isEmpty()

    fun size(): Int = items.size

    fun print(): String {
        return "Queue (front->back): [\${items.joinToString(", ")}]"
    }
}

fun main() {
    val queue = Queue<String>()

    println("=== Queue Operations ===")
    queue.enqueue("Alice")
    queue.enqueue("Bob")
    queue.enqueue("Charlie")
    println(queue.print()) // [Alice, Bob, Charlie]

    println("Front: \${queue.front()}")      // Alice
    println("Dequeue: \${queue.dequeue()}")  // Alice
    println("After dequeue: \${queue.print()}") // [Bob, Charlie]
    println("Size: \${queue.size()}")        // 2
}`;

// ==========================================
// SECTION 6: HASH TABLES - CODE EXAMPLES
// ==========================================

const hashTableTS = `// ===== HASH TABLE: O(1) Average Lookup! =====
// The most important data structure for interview optimization
// Maps keys to values using a hash function

class HashTable<K, V> {
  private buckets: [K, V][][];
  private size: number;
  private count: number = 0;

  constructor(size = 53) {  // Prime numbers reduce collisions
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }

  // Hash function: converts key to array index
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;

    // Simple polynomial rolling hash
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.size;
    }

    return hash;
  }

  // Set key-value pair - O(1) average
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    // Check if key exists (update)
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    // Add new key-value pair
    bucket.push([key, value]);
    this.count++;
  }

  // Get value by key - O(1) average
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }

    return undefined;
  }

  // Check if key exists - O(1) average
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  // Delete key - O(1) average
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.count--;
        return true;
      }
    }

    return false;
  }

  getSize(): number {
    return this.count;
  }
}

// Demo
const table = new HashTable<string, number>();

table.set("apple", 5);
table.set("banana", 3);
table.set("orange", 7);
table.set("apple", 10);  // Update existing

console.log("apple:", table.get("apple"));     // 10
console.log("banana:", table.get("banana"));   // 3
console.log("grape:", table.get("grape"));     // undefined
console.log("has orange?", table.has("orange")); // true
console.log("size:", table.getSize());         // 3

table.delete("banana");
console.log("after delete banana:", table.get("banana")); // undefined`;

const hashTableKT = `// ===== HASH TABLE: O(1) Average Lookup! =====
// The most important data structure for interview optimization
// Maps keys to values using a hash function

class HashTable<K, V>(private val size: Int = 53) {
    private val buckets = Array(size) { mutableListOf<Pair<K, V>>() }
    private var count = 0

    // Hash function: converts key to array index
    private fun hash(key: K): Int {
        val str = key.toString()
        var hash = 0

        // Simple polynomial rolling hash
        for (char in str) {
            hash = (hash * 31 + char.code) % size
        }

        return hash
    }

    // Set key-value pair - O(1) average
    fun set(key: K, value: V) {
        val index = hash(key)
        val bucket = buckets[index]

        // Check if key exists (update)
        for (i in bucket.indices) {
            if (bucket[i].first == key) {
                bucket[i] = key to value
                return
            }
        }

        // Add new key-value pair
        bucket.add(key to value)
        count++
    }

    // Get value by key - O(1) average
    fun get(key: K): V? {
        val index = hash(key)
        val bucket = buckets[index]

        for ((k, v) in bucket) {
            if (k == key) return v
        }

        return null
    }

    // Check if key exists - O(1) average
    fun has(key: K): Boolean = get(key) != null

    // Delete key - O(1) average
    fun delete(key: K): Boolean {
        val index = hash(key)
        val bucket = buckets[index]

        for (i in bucket.indices) {
            if (bucket[i].first == key) {
                bucket.removeAt(i)
                count--
                return true
            }
        }

        return false
    }

    fun getSize(): Int = count
}

fun main() {
    val table = HashTable<String, Int>()

    table.set("apple", 5)
    table.set("banana", 3)
    table.set("orange", 7)
    table.set("apple", 10)  // Update existing

    println("apple: \${table.get("apple")}")     // 10
    println("banana: \${table.get("banana")}")   // 3
    println("grape: \${table.get("grape")}")     // null
    println("has orange? \${table.has("orange")}") // true
    println("size: \${table.getSize()}")         // 3

    table.delete("banana")
    println("after delete banana: \${table.get("banana")}") // null
}`;

const groupAnagramsTS = `// ===== INTERVIEW CLASSIC: Group Anagrams =====
// Group words that are anagrams of each other
// Key insight: anagrams have the same sorted characters!

function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    // Create a key by sorting characters
    // "eat" -> "aet", "tea" -> "aet", "ate" -> "aet"
    const key = str.split('').sort().join('');

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}

// Alternative: use character count as key (faster for long strings)
function groupAnagramsCount(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    // Count each character
    const count = new Array(26).fill(0);
    for (const char of str) {
      count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }

    // Use count as key: "2#1#0#..." means 2 a's, 1 b, 0 c's...
    const key = count.join('#');

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}

// Test
const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log("Input:", words);
console.log("Grouped:", groupAnagrams(words));
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

// Time: O(n * k log k) where n = number of strings, k = max string length
// Space: O(n * k)`;

const groupAnagramsKT = `// ===== INTERVIEW CLASSIC: Group Anagrams =====
// Group words that are anagrams of each other
// Key insight: anagrams have the same sorted characters!

fun groupAnagrams(strs: List<String>): List<List<String>> {
    val map = mutableMapOf<String, MutableList<String>>()

    for (str in strs) {
        // Create a key by sorting characters
        // "eat" -> "aet", "tea" -> "aet", "ate" -> "aet"
        val key = str.toCharArray().sorted().joinToString("")

        map.getOrPut(key) { mutableListOf() }.add(str)
    }

    return map.values.toList()
}

// Alternative: use character count as key (faster for long strings)
fun groupAnagramsCount(strs: List<String>): List<List<String>> {
    val map = mutableMapOf<String, MutableList<String>>()

    for (str in strs) {
        // Count each character
        val count = IntArray(26)
        for (char in str) {
            count[char - 'a']++
        }

        // Use count as key
        val key = count.joinToString("#")

        map.getOrPut(key) { mutableListOf() }.add(str)
    }

    return map.values.toList()
}

fun main() {
    val words = listOf("eat", "tea", "tan", "ate", "nat", "bat")
    println("Input: $words")
    println("Grouped: \${groupAnagrams(words)}")
    // [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]

    // Time: O(n * k log k) where n = number of strings, k = max string length
    // Space: O(n * k)
}`;

// ==========================================
// SECTION 7: BINARY SEARCH TREE - CODE EXAMPLES
// ==========================================

const bstTS = `// ===== BINARY SEARCH TREE (BST) =====
// Left subtree < Node < Right subtree
// Average O(log n) for search, insert, delete

class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

class BST {
  root: TreeNode | null = null;

  // Insert - O(log n) average, O(n) worst
  insert(value: number): void {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }

  // Search - O(log n) average
  search(value: number): boolean {
    let current = this.root;

    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }

    return false;
  }

  // In-order traversal: Left -> Root -> Right (sorted!)
  inOrder(node: TreeNode | null = this.root): number[] {
    if (!node) return [];
    return [
      ...this.inOrder(node.left),
      node.value,
      ...this.inOrder(node.right)
    ];
  }

  // Pre-order: Root -> Left -> Right
  preOrder(node: TreeNode | null = this.root): number[] {
    if (!node) return [];
    return [
      node.value,
      ...this.preOrder(node.left),
      ...this.preOrder(node.right)
    ];
  }

  // Post-order: Left -> Right -> Root
  postOrder(node: TreeNode | null = this.root): number[] {
    if (!node) return [];
    return [
      ...this.postOrder(node.left),
      ...this.postOrder(node.right),
      node.value
    ];
  }

  // Find minimum (leftmost node)
  findMin(): number | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.left) {
      current = current.left;
    }
    return current.value;
  }

  // Find maximum (rightmost node)
  findMax(): number | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.right) {
      current = current.right;
    }
    return current.value;
  }
}

// Demo
const bst = new BST();
[8, 3, 10, 1, 6, 14, 4, 7, 13].forEach(v => bst.insert(v));

console.log("In-order (sorted):", bst.inOrder());
// [1, 3, 4, 6, 7, 8, 10, 13, 14]

console.log("Pre-order:", bst.preOrder());
// [8, 3, 1, 6, 4, 7, 10, 14, 13]

console.log("Search 6:", bst.search(6));   // true
console.log("Search 5:", bst.search(5));   // false
console.log("Min:", bst.findMin());        // 1
console.log("Max:", bst.findMax());        // 14`;

const bstKT = `// ===== BINARY SEARCH TREE (BST) =====
// Left subtree < Node < Right subtree
// Average O(log n) for search, insert, delete

class TreeNode(val value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

class BST {
    var root: TreeNode? = null

    // Insert - O(log n) average, O(n) worst
    fun insert(value: Int) {
        val node = TreeNode(value)

        if (root == null) {
            root = node
            return
        }

        var current = root
        while (true) {
            if (value < current!!.value) {
                if (current.left == null) {
                    current.left = node
                    return
                }
                current = current.left
            } else {
                if (current.right == null) {
                    current.right = node
                    return
                }
                current = current.right
            }
        }
    }

    // Search - O(log n) average
    fun search(value: Int): Boolean {
        var current = root

        while (current != null) {
            if (value == current.value) return true
            current = if (value < current.value) current.left else current.right
        }

        return false
    }

    // In-order traversal: Left -> Root -> Right (sorted!)
    fun inOrder(node: TreeNode? = root): List<Int> {
        if (node == null) return emptyList()
        return inOrder(node.left) + node.value + inOrder(node.right)
    }

    // Find minimum (leftmost node)
    fun findMin(): Int? {
        var current = root ?: return null
        while (current.left != null) {
            current = current.left!!
        }
        return current.value
    }

    // Find maximum (rightmost node)
    fun findMax(): Int? {
        var current = root ?: return null
        while (current.right != null) {
            current = current.right!!
        }
        return current.value
    }
}

fun main() {
    val bst = BST()
    listOf(8, 3, 10, 1, 6, 14, 4, 7, 13).forEach { bst.insert(it) }

    println("In-order (sorted): \${bst.inOrder()}")
    // [1, 3, 4, 6, 7, 8, 10, 13, 14]

    println("Search 6: \${bst.search(6)}")   // true
    println("Search 5: \${bst.search(5)}")   // false
    println("Min: \${bst.findMin()}")        // 1
    println("Max: \${bst.findMax()}")        // 14
}`;

// ==========================================
// SECTION 8: GRAPHS - CODE EXAMPLES
// ==========================================

const graphBfsDfsTS = `// ===== GRAPH TRAVERSAL: BFS & DFS =====
// Two fundamental ways to explore a graph

class Graph {
  private adjacencyList = new Map<number, number[]>();

  addVertex(vertex: number): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1: number, v2: number): void {
    this.adjacencyList.get(v1)?.push(v2);
    this.adjacencyList.get(v2)?.push(v1);  // Undirected
  }

  // BFS: Level by level (uses Queue)
  // Good for: shortest path, level-order
  bfs(start: number): number[] {
    const visited = new Set<number>();
    const result: number[] = [];
    const queue: number[] = [start];

    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  // DFS: Go deep first (uses Stack/Recursion)
  // Good for: cycle detection, topological sort, path finding
  dfs(start: number): number[] {
    const visited = new Set<number>();
    const result: number[] = [];

    const traverse = (vertex: number) => {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          traverse(neighbor);
        }
      }
    };

    traverse(start);
    return result;
  }

  // DFS Iterative (using explicit stack)
  dfsIterative(start: number): number[] {
    const visited = new Set<number>();
    const result: number[] = [];
    const stack: number[] = [start];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);

        // Add neighbors to stack (reverse for consistent order)
        const neighbors = this.adjacencyList.get(vertex) || [];
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i])) {
            stack.push(neighbors[i]);
          }
        }
      }
    }

    return result;
  }
}

// Build graph:
//     0
//    / \\
//   1   2
//   |   |
//   3   4
//    \\ /
//     5

const graph = new Graph();
[0, 1, 2, 3, 4, 5].forEach(v => graph.addVertex(v));
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
graph.addEdge(3, 5);
graph.addEdge(4, 5);

console.log("BFS from 0:", graph.bfs(0));
// Level by level: [0, 1, 2, 3, 4, 5]

console.log("DFS from 0:", graph.dfs(0));
// Go deep first: [0, 1, 3, 5, 4, 2]

console.log("DFS Iterative:", graph.dfsIterative(0));`;

const graphBfsDfsKT = `// ===== GRAPH TRAVERSAL: BFS & DFS =====
// Two fundamental ways to explore a graph

class Graph {
    private val adjacencyList = mutableMapOf<Int, MutableList<Int>>()

    fun addVertex(vertex: Int) {
        adjacencyList.putIfAbsent(vertex, mutableListOf())
    }

    fun addEdge(v1: Int, v2: Int) {
        adjacencyList[v1]?.add(v2)
        adjacencyList[v2]?.add(v1)  // Undirected
    }

    // BFS: Level by level (uses Queue)
    fun bfs(start: Int): List<Int> {
        val visited = mutableSetOf<Int>()
        val result = mutableListOf<Int>()
        val queue = ArrayDeque<Int>()

        queue.add(start)
        visited.add(start)

        while (queue.isNotEmpty()) {
            val vertex = queue.removeFirst()
            result.add(vertex)

            for (neighbor in adjacencyList[vertex] ?: emptyList()) {
                if (neighbor !in visited) {
                    visited.add(neighbor)
                    queue.add(neighbor)
                }
            }
        }

        return result
    }

    // DFS: Go deep first (Recursive)
    fun dfs(start: Int): List<Int> {
        val visited = mutableSetOf<Int>()
        val result = mutableListOf<Int>()

        fun traverse(vertex: Int) {
            visited.add(vertex)
            result.add(vertex)

            for (neighbor in adjacencyList[vertex] ?: emptyList()) {
                if (neighbor !in visited) {
                    traverse(neighbor)
                }
            }
        }

        traverse(start)
        return result
    }
}

fun main() {
    val graph = Graph()
    (0..5).forEach { graph.addVertex(it) }
    graph.addEdge(0, 1)
    graph.addEdge(0, 2)
    graph.addEdge(1, 3)
    graph.addEdge(2, 4)
    graph.addEdge(3, 5)
    graph.addEdge(4, 5)

    println("BFS from 0: \${graph.bfs(0)}")
    // Level by level: [0, 1, 2, 3, 4, 5]

    println("DFS from 0: \${graph.dfs(0)}")
    // Go deep first: [0, 1, 3, 5, 4, 2]
}`;

// ==========================================
// SECTION 9: SORTING ALGORITHMS
// ==========================================

const quickSortTS = `// ===== QUICK SORT: Divide and Conquer =====
// Average O(n log n), Worst O(n²)
// In-place, not stable

function quickSort(arr: number[]): number[] {
  // Create a copy to avoid mutating original
  const result = [...arr];
  quickSortHelper(result, 0, result.length - 1);
  return result;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSortHelper(arr, low, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  // Choose last element as pivot
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Place pivot in correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Simpler version (not in-place, easier to understand)
function quickSortSimple(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSortSimple(left), ...middle, ...quickSortSimple(right)];
}

const unsorted = [64, 34, 25, 12, 22, 11, 90, 42];
console.log("Original:", unsorted);
console.log("Quick Sort:", quickSort(unsorted));
console.log("Simple version:", quickSortSimple(unsorted));

// Quick Sort is often the fastest in practice because:
// 1. In-place (low memory overhead)
// 2. Cache-friendly (sequential access)
// 3. Average case is common`;

const quickSortKT = `// ===== QUICK SORT: Divide and Conquer =====
// Average O(n log n), Worst O(n²)
// In-place, not stable

fun quickSort(arr: IntArray): IntArray {
    val result = arr.copyOf()
    quickSortHelper(result, 0, result.size - 1)
    return result
}

fun quickSortHelper(arr: IntArray, low: Int, high: Int) {
    if (low < high) {
        val pivotIndex = partition(arr, low, high)
        quickSortHelper(arr, low, pivotIndex - 1)
        quickSortHelper(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    val pivot = arr[high]
    var i = low - 1

    for (j in low until high) {
        if (arr[j] < pivot) {
            i++
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }

    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    return i + 1
}

// Simpler version (not in-place)
fun quickSortSimple(arr: List<Int>): List<Int> {
    if (arr.size <= 1) return arr

    val pivot = arr[arr.size / 2]
    val left = arr.filter { it < pivot }
    val middle = arr.filter { it == pivot }
    val right = arr.filter { it > pivot }

    return quickSortSimple(left) + middle + quickSortSimple(right)
}

fun main() {
    val unsorted = intArrayOf(64, 34, 25, 12, 22, 11, 90, 42)
    println("Original: \${unsorted.toList()}")
    println("Quick Sort: \${quickSort(unsorted).toList()}")
    println("Simple: \${quickSortSimple(unsorted.toList())}")
}`;

// ==========================================
// SECTION 10: DYNAMIC PROGRAMMING
// ==========================================

const fibonacciDPTS = `// ===== DYNAMIC PROGRAMMING: Fibonacci =====
// Classic example showing memoization vs tabulation

// NAIVE RECURSIVE: O(2^n) - TERRIBLE!
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// MEMOIZATION (Top-Down): O(n) - Much better!
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// TABULATION (Bottom-Up): O(n) - Even better for iteration!
function fibTab(n: number): number {
  if (n <= 1) return n;

  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// SPACE OPTIMIZED: O(1) space!
function fibOptimized(n: number): number {
  if (n <= 1) return n;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log("Fibonacci Examples:");
console.log("fib(10) Memo:", fibMemo(10));      // 55
console.log("fib(10) Tab:", fibTab(10));        // 55
console.log("fib(10) Optimized:", fibOptimized(10)); // 55
console.log("fib(40) Optimized:", fibOptimized(40)); // 102334155

// Don't try fibNaive(40) - it will take forever!`;

const fibonacciDPKT = `// ===== DYNAMIC PROGRAMMING: Fibonacci =====
// Classic example showing memoization vs tabulation

// NAIVE RECURSIVE: O(2^n) - TERRIBLE!
fun fibNaive(n: Int): Long {
    if (n <= 1) return n.toLong()
    return fibNaive(n - 1) + fibNaive(n - 2)
}

// MEMOIZATION (Top-Down): O(n)
fun fibMemo(n: Int, memo: MutableMap<Int, Long> = mutableMapOf()): Long {
    if (n <= 1) return n.toLong()
    if (n in memo) return memo[n]!!

    val result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo)
    memo[n] = result
    return result
}

// TABULATION (Bottom-Up): O(n)
fun fibTab(n: Int): Long {
    if (n <= 1) return n.toLong()

    val dp = LongArray(n + 1)
    dp[0] = 0
    dp[1] = 1

    for (i in 2..n) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }

    return dp[n]
}

// SPACE OPTIMIZED: O(1) space!
fun fibOptimized(n: Int): Long {
    if (n <= 1) return n.toLong()

    var prev2 = 0L
    var prev1 = 1L

    for (i in 2..n) {
        val current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    }

    return prev1
}

fun main() {
    println("Fibonacci Examples:")
    println("fib(10) Memo: \${fibMemo(10)}")      // 55
    println("fib(10) Tab: \${fibTab(10)}")        // 55
    println("fib(10) Optimized: \${fibOptimized(10)}") // 55
    println("fib(40) Optimized: \${fibOptimized(40)}") // 102334155
}`;

const coinChangeTS = `// ===== INTERVIEW CLASSIC: Coin Change =====
// Given coins and amount, find minimum coins needed
// Classic DP problem - bottom-up approach

function coinChange(coins: number[], amount: number): number {
  // dp[i] = minimum coins to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;  // 0 coins needed for amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Test cases
console.log("Coins [1,2,5], Amount 11:", coinChange([1, 2, 5], 11));
// Output: 3 (5 + 5 + 1)

console.log("Coins [2], Amount 3:", coinChange([2], 3));
// Output: -1 (impossible)

console.log("Coins [1], Amount 0:", coinChange([1], 0));
// Output: 0

console.log("Coins [1,2,5], Amount 100:", coinChange([1, 2, 5], 100));
// Output: 20 (20 × 5)

// Visual for amount=11, coins=[1,2,5]:
// dp[0]=0, dp[1]=1, dp[2]=1, dp[3]=2, dp[4]=2
// dp[5]=1, dp[6]=2, dp[7]=2, dp[8]=3, dp[9]=3
// dp[10]=2, dp[11]=3`;

const coinChangeKT = `// ===== INTERVIEW CLASSIC: Coin Change =====
// Given coins and amount, find minimum coins needed
// Classic DP problem - bottom-up approach

fun coinChange(coins: IntArray, amount: Int): Int {
    // dp[i] = minimum coins to make amount i
    val dp = IntArray(amount + 1) { Int.MAX_VALUE }
    dp[0] = 0  // 0 coins needed for amount 0

    for (i in 1..amount) {
        for (coin in coins) {
            if (coin <= i && dp[i - coin] != Int.MAX_VALUE) {
                dp[i] = minOf(dp[i], dp[i - coin] + 1)
            }
        }
    }

    return if (dp[amount] == Int.MAX_VALUE) -1 else dp[amount]
}

fun main() {
    println("Coins [1,2,5], Amount 11: \${coinChange(intArrayOf(1, 2, 5), 11)}")
    // Output: 3 (5 + 5 + 1)

    println("Coins [2], Amount 3: \${coinChange(intArrayOf(2), 3)}")
    // Output: -1 (impossible)

    println("Coins [1], Amount 0: \${coinChange(intArrayOf(1), 0)}")
    // Output: 0

    println("Coins [1,2,5], Amount 100: \${coinChange(intArrayOf(1, 2, 5), 100)}")
    // Output: 20 (20 × 5)
}`;

// ==========================================
// INTERVIEW CHALLENGES
// ==========================================

const challenge1TS = `// ===== CHALLENGE 1: Product of Array Except Self =====
// Return array where each element is product of all OTHER elements
// Constraint: O(n) time, NO division allowed!

function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // TODO: Your solution here
  // Hint: Use prefix and suffix products

  return result;
}

// Test cases
console.log(productExceptSelf([1, 2, 3, 4]));
// Expected: [24, 12, 8, 6]
// Explanation: 24=2*3*4, 12=1*3*4, 8=1*2*4, 6=1*2*3

console.log(productExceptSelf([-1, 1, 0, -3, 3]));
// Expected: [0, 0, 9, 0, 0]`;

const challenge1KT = `// ===== CHALLENGE 1: Product of Array Except Self =====
// Return array where each element is product of all OTHER elements
// Constraint: O(n) time, NO division allowed!

fun productExceptSelf(nums: IntArray): IntArray {
    val n = nums.size
    val result = IntArray(n) { 1 }

    // TODO: Your solution here
    // Hint: Use prefix and suffix products

    return result
}

fun main() {
    println(productExceptSelf(intArrayOf(1, 2, 3, 4)).toList())
    // Expected: [24, 12, 8, 6]

    println(productExceptSelf(intArrayOf(-1, 1, 0, -3, 3)).toList())
    // Expected: [0, 0, 9, 0, 0]
}`;

const challenge2TS = `// ===== CHALLENGE 2: Longest Substring Without Repeating =====
// Find length of longest substring without repeating characters
// Classic sliding window problem!

function lengthOfLongestSubstring(s: string): number {
  // TODO: Your solution here
  // Hint: Use a Set to track characters in current window
  // Use two pointers (left and right)

  return 0;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb"));
// Expected: 3 ("abc")

console.log(lengthOfLongestSubstring("bbbbb"));
// Expected: 1 ("b")

console.log(lengthOfLongestSubstring("pwwkew"));
// Expected: 3 ("wke")

console.log(lengthOfLongestSubstring(""));
// Expected: 0`;

const challenge2KT = `// ===== CHALLENGE 2: Longest Substring Without Repeating =====
// Find length of longest substring without repeating characters
// Classic sliding window problem!

fun lengthOfLongestSubstring(s: String): Int {
    // TODO: Your solution here
    // Hint: Use a Set to track characters in current window
    // Use two pointers (left and right)

    return 0
}

fun main() {
    println(lengthOfLongestSubstring("abcabcbb"))
    // Expected: 3 ("abc")

    println(lengthOfLongestSubstring("bbbbb"))
    // Expected: 1 ("b")

    println(lengthOfLongestSubstring("pwwkew"))
    // Expected: 3 ("wke")
}`;

const challenge3TS = `// ===== CHALLENGE 3: Merge Intervals =====
// Given array of intervals, merge overlapping ones
// Key: Sort by start time first!

function merge(intervals: number[][]): number[][] {
  // TODO: Your solution here
  // 1. Sort intervals by start time
  // 2. Iterate and merge overlapping intervals

  return [];
}

// Test cases
console.log(merge([[1,3],[2,6],[8,10],[15,18]]));
// Expected: [[1,6],[8,10],[15,18]]
// Explanation: [1,3] and [2,6] overlap -> [1,6]

console.log(merge([[1,4],[4,5]]));
// Expected: [[1,5]]
// Explanation: [1,4] and [4,5] touch -> merge

console.log(merge([[1,4],[0,4]]));
// Expected: [[0,4]]`;

const challenge3KT = `// ===== CHALLENGE 3: Merge Intervals =====
// Given array of intervals, merge overlapping ones
// Key: Sort by start time first!

fun merge(intervals: Array<IntArray>): List<IntArray> {
    // TODO: Your solution here
    // 1. Sort intervals by start time
    // 2. Iterate and merge overlapping intervals

    return emptyList()
}

fun main() {
    val result1 = merge(arrayOf(
        intArrayOf(1,3), intArrayOf(2,6),
        intArrayOf(8,10), intArrayOf(15,18)
    ))
    println(result1.map { it.toList() })
    // Expected: [[1,6],[8,10],[15,18]]

    val result2 = merge(arrayOf(intArrayOf(1,4), intArrayOf(4,5)))
    println(result2.map { it.toList() })
    // Expected: [[1,5]]
}`;

// Export the component
export default function DSACompletGuidePage() {
  const { language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("dsa-complete-guide", language);
  const [activeLang, setActiveLang] = useState<"typescript" | "kotlin">("typescript");

  const LangTabs = () => (
    <div className={styles.langTabs}>
      <button
        className={`${styles.langTab} ${activeLang === "typescript" ? styles.active : ""}`}
        onClick={() => setActiveLang("typescript")}
      >
        TypeScript
      </button>
      <button
        className={`${styles.langTab} ${activeLang === "kotlin" ? styles.active : ""}`}
        onClick={() => setActiveLang("kotlin")}
      >
        Kotlin
      </button>
    </div>
  );

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <a href={createLocalizedPath("/")}>Home</a>
        <span>/</span>
        <a href={createLocalizedPath("/developer-section")}>Developer</a>
        <span>/</span>
        <a href={createLocalizedPath("/developer-section/blog")}>Blog</a>
        <span>/</span>
        <span>{postContent?.breadcrumbLabel || "DSA Complete Guide"}</span>
      </nav>

      {/* Header */}
      <header className={styles.headerSection}>
        <h1 className={styles.title}>
          {postContent?.title || "Data Structures & Algorithms: Complete Guide"}
        </h1>
        <p className={styles.subtitle}>
          {postContent?.subtitle || "Master DSA with executable code examples in TypeScript and Kotlin"}
        </p>
      </header>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img
          src="/images/dsa/data-structures-overview.png"
          alt="Data Structures Overview"
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </div>

      {/* Table of Contents */}
      <Card className={styles.sectionCard}>
        <Heading level={2}>Table of Contents</Heading>
        <Text className={styles.sectionDescription}>
          This comprehensive guide covers everything you need to master data structures and algorithms.
          Each section includes detailed explanations, visual diagrams, and executable code in both TypeScript and Kotlin.
        </Text>
        <div className={styles.tocGrid}>
          <a href="#big-o" className={styles.tocLink}>1. Big O Notation</a>
          <a href="#arrays" className={styles.tocLink}>2. Arrays</a>
          <a href="#linked-lists" className={styles.tocLink}>3. Linked Lists</a>
          <a href="#stacks" className={styles.tocLink}>4. Stacks</a>
          <a href="#queues" className={styles.tocLink}>5. Queues</a>
          <a href="#hash-tables" className={styles.tocLink}>6. Hash Tables</a>
          <a href="#trees" className={styles.tocLink}>7. Trees</a>
          <a href="#heaps" className={styles.tocLink}>8. Heaps</a>
          <a href="#graphs" className={styles.tocLink}>9. Graphs</a>
          <a href="#sorting" className={styles.tocLink}>10. Sorting</a>
          <a href="#searching" className={styles.tocLink}>11. Searching</a>
          <a href="#dynamic-programming" className={styles.tocLink}>12. Dynamic Programming</a>
          <a href="#interview-challenges" className={styles.tocLink}>13. Interview Challenges</a>
        </div>
      </Card>

      {/* ==================== SECTION 1: BIG O NOTATION ==================== */}
      <section id="big-o" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>1. Big O Notation & Time Complexity</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/big-o-complexity.png"
              alt="Big O Complexity Chart"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Big O notation</strong> is the language we use to describe how efficient an algorithm is.
            It tells us how the runtime or space requirements grow as the input size increases.
            Understanding Big O is crucial for writing efficient code and acing technical interviews.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>WHY IT MATTERS</div>
            <Text className={styles.infoText}>
              The difference between O(n) and O(n²) can mean the difference between your code running in
              1 second vs 11 days for 1 million elements. Companies like Google and Amazon specifically
              test candidates on their ability to analyze and optimize algorithm complexity.
            </Text>
          </div>

          <Heading level={3}>Common Time Complexities (Best to Worst)</Heading>

          <div className={styles.complexityTable}>
            <table>
              <thead>
                <tr>
                  <th>Notation</th>
                  <th>Name</th>
                  <th>Example</th>
                  <th>n=1000</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>O(1)</td><td>Constant</td><td>Array access, Hash lookup</td><td>1</td></tr>
                <tr><td>O(log n)</td><td>Logarithmic</td><td>Binary search</td><td>~10</td></tr>
                <tr><td>O(n)</td><td>Linear</td><td>Simple loop</td><td>1,000</td></tr>
                <tr><td>O(n log n)</td><td>Linearithmic</td><td>Merge sort, Quick sort</td><td>~10,000</td></tr>
                <tr><td>O(n²)</td><td>Quadratic</td><td>Nested loops, Bubble sort</td><td>1,000,000</td></tr>
                <tr><td>O(2ⁿ)</td><td>Exponential</td><td>Recursive Fibonacci</td><td>HUGE!</td></tr>
              </tbody>
            </table>
          </div>

          <Heading level={3}>O(1) - Constant Time</Heading>
          <Text className={styles.sectionText}>
            <strong>The operation takes the same time regardless of input size.</strong> Whether your array
            has 10 elements or 10 million, accessing an element by index is always one operation. Hash table
            lookups are also O(1) on average because the hash function directly computes the location.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bigOConstantTS : bigOConstantKT}
            language={activeLang}
            height={450}
          />

          <Heading level={3}>O(n) - Linear Time</Heading>
          <Text className={styles.sectionText}>
            <strong>Time grows proportionally with input size.</strong> If you need to examine every element
            at least once (like finding a maximum or summing all values), you cannot do better than O(n).
            This is often the baseline for many problems.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bigOLinearTS : bigOLinearKT}
            language={activeLang}
            height={500}
          />

          <Heading level={3}>O(log n) - Logarithmic Time</Heading>
          <Text className={styles.sectionText}>
            <strong>Halves the problem size with each step.</strong> Binary search is the classic example.
            For 1 billion elements, you need only about 30 comparisons! This is incredibly powerful.
            Any algorithm that divides the problem in half each iteration is O(log n).
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bigOLogTS : bigOLogKT}
            language={activeLang}
            height={520}
          />

          <Heading level={3}>O(n²) - Quadratic Time</Heading>
          <Text className={styles.sectionText}>
            <strong>Nested loops over the data = n × n operations.</strong> This is where algorithms start
            becoming slow for large inputs. Bubble sort, selection sort, and checking all pairs are O(n²).
            For 10,000 elements, that&apos;s 100 million operations!
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bigOQuadraticTS : bigOQuadraticKT}
            language={activeLang}
            height={520}
          />

          <Heading level={3}>O(n log n) - Linearithmic Time</Heading>
          <Text className={styles.sectionText}>
            <strong>The sweet spot for comparison-based sorting.</strong> Merge sort and quick sort achieve
            this complexity. It&apos;s proven that you cannot sort faster using only comparisons. This is why
            knowing these algorithms is essential for interviews.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bigONLogNTS : bigONLogNKT}
            language={activeLang}
            height={520}
          />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>INTERVIEW TIP</div>
            <Text className={styles.infoText}>
              Always state the time AND space complexity of your solution. For example: &quot;This solution is
              O(n) time and O(1) space.&quot; Interviewers specifically look for this analysis. If you can
              explain why your solution has that complexity, you&apos;ll stand out.
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 2: ARRAYS ==================== */}
      <section id="arrays" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>2. Arrays - The Foundation</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/array-memory.png"
              alt="Array Memory Layout"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Arrays are the most fundamental data structure.</strong> They store elements in contiguous
            (adjacent) memory locations, which makes them incredibly cache-friendly and fast for access.
            Most other data structures are built on top of arrays!
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>KEY INSIGHT</div>
            <Text className={styles.infoText}>
              Arrays give O(1) random access because memory addresses are calculated directly:
              <code> address = base + (index × element_size)</code>. This formula works instantly
              regardless of array size. This is why arrays are so powerful!
            </Text>
          </div>

          <Heading level={3}>Time Complexity Summary</Heading>
          <div className={styles.complexityTable}>
            <table>
              <thead>
                <tr><th>Operation</th><th>Time</th><th>Why?</th></tr>
              </thead>
              <tbody>
                <tr><td>Access by index</td><td>O(1)</td><td>Direct address calculation</td></tr>
                <tr><td>Search (unsorted)</td><td>O(n)</td><td>Must check each element</td></tr>
                <tr><td>Search (sorted)</td><td>O(log n)</td><td>Binary search</td></tr>
                <tr><td>Insert at end</td><td>O(1)*</td><td>*Amortized - occasionally O(n) to resize</td></tr>
                <tr><td>Insert at beginning</td><td>O(n)</td><td>Must shift all elements</td></tr>
                <tr><td>Delete at end</td><td>O(1)</td><td>Just update length</td></tr>
                <tr><td>Delete at beginning</td><td>O(n)</td><td>Must shift all elements</td></tr>
              </tbody>
            </table>
          </div>

          <Heading level={3}>Array Basics & Operations</Heading>
          <Text className={styles.sectionText}>
            Understanding array operations and their complexities is essential. Pay attention to which
            operations are O(1) vs O(n) - this knowledge helps you write efficient code.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? arrayBasicsTS : arrayBasicsKT}
            language={activeLang}
            height={550}
          />

          <Heading level={3}>Essential Array Methods</Heading>
          <Text className={styles.sectionText}>
            These methods (map, filter, reduce, find, etc.) are your daily tools. Master them and you can
            solve most array problems elegantly. Chaining these methods is a powerful pattern.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? arrayMethodsTS : arrayMethodsKT}
            language={activeLang}
            height={600}
          />

          <Heading level={3}>Interview Problem: Two Sum</Heading>
          <Text className={styles.sectionText}>
            <strong>This is the #1 most asked interview question!</strong> Given an array and a target,
            find two numbers that add up to the target. The brute force is O(n²), but using a hash map
            gives us O(n). This optimization pattern appears constantly in interviews.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? twoSumTS : twoSumKT}
            language={activeLang}
            height={480}
          />

          <Heading level={3}>Interview Problem: Maximum Subarray (Kadane&apos;s Algorithm)</Heading>
          <Text className={styles.sectionText}>
            <strong>Another must-know algorithm!</strong> Find the contiguous subarray with the largest sum.
            Kadane&apos;s algorithm solves this in O(n) time with O(1) space. The key insight is deciding at
            each position: extend the current subarray or start fresh?
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? maxSubarrayTS : maxSubarrayKT}
            language={activeLang}
            height={600}
          />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>ARRAY PATTERNS TO MASTER</div>
            <Text className={styles.infoText}>
              1. <strong>Two Pointers:</strong> Start from both ends, move toward middle<br/>
              2. <strong>Sliding Window:</strong> Track a window of elements as you iterate<br/>
              3. <strong>Hash Map:</strong> Trade space for time by storing seen elements<br/>
              4. <strong>Prefix Sum:</strong> Precompute cumulative sums for range queries
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 3: LINKED LISTS ==================== */}
      <section id="linked-lists" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>3. Linked Lists</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/linked-list.png"
              alt="Singly Linked List"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          </div>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/doubly-linked-list.png"
              alt="Doubly Linked List"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Linked Lists store elements in nodes connected by pointers.</strong> Unlike arrays,
            elements are not stored contiguously in memory. Each node contains data and a reference to
            the next node. This structure enables O(1) insertions and deletions at known positions.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>ARRAYS VS LINKED LISTS</div>
            <Text className={styles.infoText}>
              <strong>Arrays win:</strong> Random access, cache locality, less memory overhead<br/>
              <strong>Linked Lists win:</strong> Insert/delete at beginning, dynamic size, no resizing<br/>
              In practice, arrays (dynamic arrays/vectors) are used more often due to cache performance.
            </Text>
          </div>

          <Heading level={3}>Time Complexity Comparison</Heading>
          <div className={styles.complexityTable}>
            <table>
              <thead>
                <tr><th>Operation</th><th>Array</th><th>Linked List</th></tr>
              </thead>
              <tbody>
                <tr><td>Access by index</td><td>O(1)</td><td>O(n)</td></tr>
                <tr><td>Insert at beginning</td><td>O(n)</td><td>O(1)</td></tr>
                <tr><td>Insert at end</td><td>O(1)*</td><td>O(1) with tail</td></tr>
                <tr><td>Insert at middle</td><td>O(n)</td><td>O(1) if node known</td></tr>
                <tr><td>Delete at beginning</td><td>O(n)</td><td>O(1)</td></tr>
                <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
              </tbody>
            </table>
          </div>

          <Heading level={3}>Singly Linked List Implementation</Heading>
          <Text className={styles.sectionText}>
            A complete linked list implementation with all common operations. Understanding this code
            deeply will help you solve many interview problems involving linked lists.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? linkedListTS : linkedListKT}
            language={activeLang}
            height={700}
          />

          <Heading level={3}>Interview Classic: Reverse a Linked List</Heading>
          <Text className={styles.sectionText}>
            <strong>This is THE most common linked list interview question!</strong> You must be able to
            write this in your sleep. Both iterative and recursive approaches are important to know.
            The iterative solution is preferred (O(1) space).
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? reverseLinkedListTS : reverseLinkedListKT}
            language={activeLang}
            height={650}
          />

          <Heading level={3}>Interview Classic: Detect Cycle (Floyd&apos;s Algorithm)</Heading>
          <Text className={styles.sectionText}>
            <strong>Floyd&apos;s Tortoise and Hare algorithm</strong> is a brilliant O(n) time, O(1) space
            solution to detect cycles. The slow pointer moves 1 step, fast moves 2 steps. If there&apos;s
            a cycle, they will eventually meet!
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? detectCycleTS : detectCycleKT}
            language={activeLang}
            height={680}
          />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>LINKED LIST PATTERNS</div>
            <Text className={styles.infoText}>
              1. <strong>Two Pointers (Fast/Slow):</strong> Cycle detection, find middle, nth from end<br/>
              2. <strong>Dummy Node:</strong> Simplifies edge cases for head modifications<br/>
              3. <strong>Reverse in Groups:</strong> Reverse k nodes at a time<br/>
              4. <strong>Merge Lists:</strong> Combine two sorted lists
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 4: STACKS ==================== */}
      <section id="stacks" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>4. Stacks - LIFO Structure</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/stack-operations.png"
              alt="Stack Operations"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Stacks follow Last In, First Out (LIFO).</strong> Think of a stack of plates - you can only
            add or remove from the top. This simple constraint makes stacks incredibly useful for problems
            involving nested structures, undo operations, and expression evaluation.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>ALL OPERATIONS ARE O(1)!</div>
            <Text className={styles.infoText}>
              <strong>push:</strong> Add to top | <strong>pop:</strong> Remove from top |
              <strong>peek:</strong> View top | <strong>isEmpty:</strong> Check if empty
            </Text>
          </div>

          <Heading level={3}>Stack Implementation</Heading>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? stackImplementationTS : stackImplementationKT}
            language={activeLang}
            height={600}
          />

          <Heading level={3}>Interview Classic: Valid Parentheses</Heading>
          <Text className={styles.sectionText}>
            <strong>The classic stack problem!</strong> Check if brackets are properly balanced.
            Opening brackets go on stack, closing brackets must match the top.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? validParenthesesTS : validParenthesesKT}
            language={activeLang}
            height={500}
          />

          <Heading level={3}>Interview Classic: Min Stack</Heading>
          <Text className={styles.sectionText}>
            Design a stack that supports getMin() in O(1). The trick is using an auxiliary stack
            to track minimums at each level!
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? minStackTS : minStackKT}
            language={activeLang}
            height={550}
          />
        </Card>
      </section>

      {/* ==================== SECTION 5: QUEUES ==================== */}
      <section id="queues" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>5. Queues - FIFO Structure</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/queue-operations.png"
              alt="Queue Operations"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Queues follow First In, First Out (FIFO).</strong> Like a line at a store - the first
            person in line is served first. Queues are essential for BFS traversal, task scheduling,
            and handling requests in order.
          </Text>

          <Heading level={3}>Queue Implementation</Heading>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? queueImplementationTS : queueImplementationKT}
            language={activeLang}
            height={600}
          />
        </Card>
      </section>

      {/* ==================== SECTION 6: HASH TABLES ==================== */}
      <section id="hash-tables" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>6. Hash Tables - O(1) Lookup</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/hash-table.png"
              alt="Hash Table Structure"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Hash tables are THE optimization tool for interviews.</strong> They provide O(1)
            average-case lookup, insert, and delete. When you see a brute-force O(n²) solution,
            ask yourself: &quot;Can I use a hash table to make this O(n)?&quot;
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>WHEN TO USE HASH TABLES</div>
            <Text className={styles.infoText}>
              • Counting frequencies<br/>
              • Finding duplicates<br/>
              • Two Sum and similar &quot;find complement&quot; problems<br/>
              • Caching/memoization<br/>
              • Grouping items by key
            </Text>
          </div>

          <Heading level={3}>Hash Table Implementation</Heading>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? hashTableTS : hashTableKT}
            language={activeLang}
            height={700}
          />

          <Heading level={3}>Interview Classic: Group Anagrams</Heading>
          <Text className={styles.sectionText}>
            Group words that are anagrams. Key insight: anagrams have the same sorted characters!
            Use the sorted string as a hash key.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? groupAnagramsTS : groupAnagramsKT}
            language={activeLang}
            height={550}
          />
        </Card>
      </section>

      {/* ==================== SECTION 7: TREES ==================== */}
      <section id="trees" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>7. Trees & Binary Search Trees</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/binary-tree.png"
              alt="Binary Tree Structure"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          </div>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/tree-traversals.png"
              alt="Tree Traversals"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Trees are hierarchical data structures.</strong> Binary Search Trees (BST) maintain
            a special property: left subtree &lt; node &lt; right subtree. This allows O(log n)
            search, insert, and delete on average.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>TRAVERSAL TYPES</div>
            <Text className={styles.infoText}>
              • <strong>In-order:</strong> Left → Root → Right (gives sorted output for BST!)<br/>
              • <strong>Pre-order:</strong> Root → Left → Right (copy tree, prefix expression)<br/>
              • <strong>Post-order:</strong> Left → Right → Root (delete tree, postfix expression)<br/>
              • <strong>Level-order:</strong> BFS, level by level
            </Text>
          </div>

          <Heading level={3}>Binary Search Tree Implementation</Heading>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? bstTS : bstKT}
            language={activeLang}
            height={750}
          />
        </Card>
      </section>

      {/* ==================== SECTION 8: HEAPS ==================== */}
      <section id="heaps" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>8. Heaps & Priority Queues</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/heap-structure.png"
              alt="Min Heap and Max Heap"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Heaps are complete binary trees</strong> where each parent is smaller (min-heap) or
            larger (max-heap) than its children. They provide O(1) access to the minimum/maximum and
            O(log n) insertion and deletion. Perfect for &quot;find K largest/smallest&quot; problems!
          </Text>

          <div className={styles.complexityTable}>
            <table>
              <thead>
                <tr><th>Operation</th><th>Time</th></tr>
              </thead>
              <tbody>
                <tr><td>Get min/max</td><td>O(1)</td></tr>
                <tr><td>Insert</td><td>O(log n)</td></tr>
                <tr><td>Delete min/max</td><td>O(log n)</td></tr>
                <tr><td>Build heap</td><td>O(n)</td></tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>WHEN TO USE HEAPS</div>
            <Text className={styles.infoText}>
              • Find K largest/smallest elements<br/>
              • Merge K sorted lists<br/>
              • Median of a stream<br/>
              • Dijkstra&apos;s shortest path<br/>
              • Task scheduling by priority
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 9: GRAPHS ==================== */}
      <section id="graphs" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>9. Graphs & Traversals</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/graph-types.png"
              alt="Graph Types"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Graphs model relationships between entities.</strong> They consist of vertices (nodes)
            connected by edges. Graphs can be directed/undirected, weighted/unweighted, cyclic/acyclic.
            Master BFS and DFS - they&apos;re the foundation for most graph problems!
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>BFS VS DFS</div>
            <Text className={styles.infoText}>
              <strong>BFS (Breadth-First):</strong> Level by level, uses Queue, finds shortest path<br/>
              <strong>DFS (Depth-First):</strong> Go deep first, uses Stack/Recursion, detects cycles
            </Text>
          </div>

          <Heading level={3}>Graph BFS & DFS Implementation</Heading>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? graphBfsDfsTS : graphBfsDfsKT}
            language={activeLang}
            height={750}
          />
        </Card>
      </section>

      {/* ==================== SECTION 10: SORTING ==================== */}
      <section id="sorting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>10. Sorting Algorithms</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/quick-sort.png"
              alt="Quick Sort Visualization"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
          </div>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/merge-sort.png"
              alt="Merge Sort Visualization"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Sorting is fundamental to computer science.</strong> Understanding different sorting
            algorithms, their trade-offs, and when to use each is crucial for interviews. Quick Sort
            and Merge Sort are the most important to master.
          </Text>

          <div className={styles.complexityTable}>
            <table>
              <thead>
                <tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable?</th></tr>
              </thead>
              <tbody>
                <tr><td>Quick Sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>No</td></tr>
                <tr><td>Merge Sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
                <tr><td>Heap Sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>No</td></tr>
                <tr><td>Bubble Sort</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>Yes</td></tr>
              </tbody>
            </table>
          </div>

          <Heading level={3}>Quick Sort</Heading>
          <Text className={styles.sectionText}>
            Quick Sort is often the fastest in practice due to cache efficiency and in-place sorting.
            It uses a pivot to partition the array: elements smaller than pivot go left, larger go right.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? quickSortTS : quickSortKT}
            language={activeLang}
            height={600}
          />
        </Card>
      </section>

      {/* ==================== SECTION 11: SEARCHING ==================== */}
      <section id="searching" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>11. Searching Algorithms</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/binary-search.png"
              alt="Binary Search Visualization"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Binary Search is the most important searching algorithm.</strong> It finds elements
            in O(log n) time by repeatedly halving the search space. The key requirement is that the
            data must be sorted. Binary search patterns appear in many interview problems!
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <div className={styles.infoBoxLabel}>BINARY SEARCH VARIATIONS</div>
            <Text className={styles.infoText}>
              • Find exact element<br/>
              • Find first occurrence (leftmost)<br/>
              • Find last occurrence (rightmost)<br/>
              • Find insertion point<br/>
              • Search in rotated sorted array
            </Text>
          </div>
        </Card>
      </section>

      {/* ==================== SECTION 12: DYNAMIC PROGRAMMING ==================== */}
      <section id="dynamic-programming" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>12. Dynamic Programming</Heading>

          <div className={styles.conceptImage}>
            <img
              src="/images/dsa/dp-fibonacci.png"
              alt="Dynamic Programming Fibonacci"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
            />
          </div>

          <Text className={styles.sectionDescription}>
            <strong>Dynamic Programming breaks complex problems into overlapping subproblems.</strong>
            The key insight is to store solutions to subproblems (memoization) instead of recomputing them.
            DP is challenging but mastering it will help you solve many interview problems!
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>DP APPROACH</div>
            <Text className={styles.infoText}>
              1. <strong>Identify:</strong> Can the problem be broken into subproblems?<br/>
              2. <strong>Define state:</strong> What information do we need to track?<br/>
              3. <strong>Recurrence:</strong> How do subproblems relate to each other?<br/>
              4. <strong>Base cases:</strong> What are the smallest subproblems?<br/>
              5. <strong>Order:</strong> Bottom-up (tabulation) or top-down (memoization)?
            </Text>
          </div>

          <Heading level={3}>Fibonacci: The Classic DP Example</Heading>
          <Text className={styles.sectionText}>
            Fibonacci perfectly illustrates the power of DP. Naive recursion is O(2^n), but with
            memoization it becomes O(n). This is the speedup DP provides!
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? fibonacciDPTS : fibonacciDPKT}
            language={activeLang}
            height={550}
          />

          <Heading level={3}>Interview Classic: Coin Change</Heading>
          <Text className={styles.sectionText}>
            Given coins of different denominations, find the minimum number of coins needed to make
            a target amount. This is a classic bottom-up DP problem.
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? coinChangeTS : coinChangeKT}
            language={activeLang}
            height={480}
          />
        </Card>
      </section>

      {/* ==================== SECTION 13: INTERVIEW CHALLENGES ==================== */}
      <section id="interview-challenges" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Heading level={2}>13. Interview Challenges</Heading>

          <Text className={styles.sectionDescription}>
            <strong>Test your skills with these interview-style challenges!</strong> Try to solve
            each problem before looking at the hints. The code editor supports maximize and font
            size adjustment - use it to code your solutions.
          </Text>

          <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
            <div className={styles.infoBoxLabel}>TIPS FOR SOLVING</div>
            <Text className={styles.infoText}>
              1. Understand the problem - ask clarifying questions<br/>
              2. Work through examples by hand<br/>
              3. Identify the pattern (two pointers, sliding window, DP, etc.)<br/>
              4. Start with brute force, then optimize<br/>
              5. Test with edge cases
            </Text>
          </div>

          <Heading level={3}>Challenge 1: Product of Array Except Self</Heading>
          <Text className={styles.sectionText}>
            Given an array, return an array where each element is the product of all other elements.
            <strong> Constraint: O(n) time, no division!</strong>
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? challenge1TS : challenge1KT}
            language={activeLang}
            height={350}
          />

          <Heading level={3}>Challenge 2: Longest Substring Without Repeating</Heading>
          <Text className={styles.sectionText}>
            Find the length of the longest substring without repeating characters.
            <strong> Hint: Sliding window pattern!</strong>
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? challenge2TS : challenge2KT}
            language={activeLang}
            height={350}
          />

          <Heading level={3}>Challenge 3: Merge Intervals</Heading>
          <Text className={styles.sectionText}>
            Given an array of intervals, merge all overlapping intervals.
            <strong> Hint: Sort first!</strong>
          </Text>
          <LangTabs />
          <CodeEditor
            code={activeLang === "typescript" ? challenge3TS : challenge3KT}
            language={activeLang}
            height={400}
          />

          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <div className={styles.infoBoxLabel}>KEEP PRACTICING!</div>
            <Text className={styles.infoText}>
              DSA mastery comes from practice. Work through these challenges, understand the patterns,
              and apply them to new problems. The more you practice, the faster you&apos;ll recognize
              which technique to use!
            </Text>
          </div>
        </Card>
      </section>

      {/* Footer Navigation */}
      <div className={styles.footerActions}>
        <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary">
          Back to Blog
        </ButtonLink>
        <ButtonLink href="#stacks" variant="primary">
          Continue to Stacks →
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}
