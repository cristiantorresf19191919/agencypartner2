// ✅ The Good Way (Command Pattern in React)
// Encapsulate actions as commands, enabling undo/redo

import React, { useState, useCallback } from "react";

// ✅ Command interface
interface Command {
  execute: () => void;
  undo: () => void;
}

// ✅ Command hook with history
const useCommandHistory = () => {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const executeCommand = useCallback((command: Command) => {
    command.execute();
    // Remove any commands after current index (when undoing and then executing new command)
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, command]);
    setCurrentIndex(newHistory.length);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      history[currentIndex].undo();
      setCurrentIndex(currentIndex - 1);
    }
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      history[nextIndex].execute();
      setCurrentIndex(nextIndex);
    }
  }, [history, currentIndex]);

  return { executeCommand, undo, redo, canUndo: currentIndex >= 0, canRedo: currentIndex < history.length - 1 };
};

// ✅ Counter with command pattern
const Counter = () => {
  const [count, setCount] = useState(0);
  const { executeCommand, undo, redo, canUndo, canRedo } = useCommandHistory();

  const increment = () => {
    const command: Command = {
      execute: () => setCount((prev) => prev + 1),
      undo: () => setCount((prev) => prev - 1),
    };
    executeCommand(command);
  };

  const decrement = () => {
    const command: Command = {
      execute: () => setCount((prev) => prev - 1),
      undo: () => setCount((prev) => prev + 1),
    };
    executeCommand(command);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
};

// ✅ Alternative: Simple command pattern for form actions
const useFormCommands = <T,>(initialState: T) => {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const executeCommand = useCallback((command: (state: T) => T) => {
    const newState = command(state);
    setState(newState);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  }, [state, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setState(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setState(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  return { state, executeCommand, undo, redo };
};

export { Counter, useFormCommands };




