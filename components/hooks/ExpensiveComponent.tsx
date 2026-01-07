"use client";

import React from "react";

// Simulate expensive computation
function expensiveCalculation() {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result;
}

// Component WITHOUT React.memo - re-renders on every parent update
export function ExpensiveComponentNoMemo({ name, count }: { name: string; count: number }) {
  const value = expensiveCalculation();
  
  console.log(`[No Memo] ${name} rendered. Count: ${count}, Value: ${value}`);
  
  return (
    <div className="p-3 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
      <p className="font-medium text-zinc-900 dark:text-zinc-100">{name}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Count: {count}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">Computed: {value}</p>
    </div>
  );
}

// Component WITH React.memo - only re-renders when props change
export const ExpensiveComponentWithMemo = React.memo(({ name, count }: { name: string; count: number }) => {
  const value = expensiveCalculation();
  
  console.log(`[With Memo] ${name} rendered. Count: ${count}, Value: ${value}`);
  
  return (
    <div className="p-3 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
      <p className="font-medium text-zinc-900 dark:text-zinc-100">{name}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Count: {count}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">Computed: {value}</p>
    </div>
  );
});

ExpensiveComponentWithMemo.displayName = "ExpensiveComponentWithMemo";

