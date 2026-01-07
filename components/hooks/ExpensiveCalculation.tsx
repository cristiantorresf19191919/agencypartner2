"use client";

import React, { useMemo } from "react";

// Simulate expensive calculation
function expensiveCalculation(numbers: number[]): number {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += numbers.reduce((sum, num) => sum + num * i, 0);
  }
  return result;
}

interface ExpensiveCalculationProps {
  numbers: number[];
  variant: "no-memo" | "with-memo";
}

// Component WITHOUT useMemo - recalculates on every render
function ExpensiveCalculationNoMemo({ numbers }: { numbers: number[] }) {
  const result = expensiveCalculation(numbers);
  
  console.log('[No Memo] Expensive calculation ran. Result:', result);
  
  return (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
      <h3 className="text-lg font-bold mb-2 text-red-700 dark:text-red-400">
        ❌ Without useMemo
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
        Numbers: [{numbers.join(", ")}]
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
        Result: {result.toLocaleString()}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Calculation runs on every render
      </p>
    </div>
  );
}

// Component WITH useMemo - only recalculates when numbers change
function ExpensiveCalculationWithMemo({ numbers }: { numbers: number[] }) {
  const result = useMemo(() => {
    return expensiveCalculation(numbers);
  }, [numbers]);
  
  console.log('[With Memo] Expensive calculation ran. Result:', result);
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
      <h3 className="text-lg font-bold mb-2 text-green-700 dark:text-green-400">
        ✅ With useMemo
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
        Numbers: [{numbers.join(", ")}]
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
        Result: {result.toLocaleString()}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Calculation only runs when numbers change
      </p>
    </div>
  );
}

export function ExpensiveCalculation({ numbers, variant }: ExpensiveCalculationProps) {
  if (variant === "no-memo") {
    return <ExpensiveCalculationNoMemo numbers={numbers} />;
  }
  
  return <ExpensiveCalculationWithMemo numbers={numbers} />;
}

