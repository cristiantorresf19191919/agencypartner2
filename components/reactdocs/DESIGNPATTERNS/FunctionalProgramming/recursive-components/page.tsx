"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const badExample = `// ❌ BAD EXAMPLE: Imperative Recursive Components
// Using imperative logic, mutations, and side effects in recursive rendering

import { useState, useEffect } from "react";

interface TreeNodeBad {
  id: string;
  label: string;
  children?: TreeNodeBad[];
}

export function TreeBad({ nodes }: { nodes: TreeNodeBad[] }) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // ❌ BAD: Side effect in render
  useEffect(() => {
    // Auto-expand first node (side effect)
    if (nodes.length > 0 && expandedNodes.size === 0) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.add(nodes[0].id);
        return newSet;
      });
    }
  }, [nodes]);

  // ❌ BAD: Mutating state directly
  const toggleNode = (id: string) => {
    const newSet = new Set(expandedNodes);
    newSet.add(id); // ❌ Mutating the Set
    setExpandedNodes(newSet);
  };

  // ❌ BAD: Imperative rendering with side effects
  const renderNode = (node: TreeNodeBad, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    // ❌ BAD: Side effect in render (logging)
    console.log(\`Rendering node \${node.id} at level \${level}\`);

    return (
      <div key={node.id} style={{ marginLeft: \`\${level * 20}px\` }}>
        <div
          onClick={() => {
            toggleNode(node.id);
            setSelectedNode(node.id); // ❌ Multiple state updates
          }}
          style={{
            padding: '8px',
            backgroundColor: isSelected ? 'yellow' : 'white',
            cursor: 'pointer',
          }}
        >
          {isExpanded ? '▼' : '▶'} {node.label}
        </div>
        {isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {nodes.map(node => renderNode(node))}
    </div>
  );
}

// Problems:
// 1. Side effects in render (useEffect, console.log)
// 2. Mutating state directly
// 3. Imperative logic mixed with rendering
// 4. Hard to test - depends on external state
// 5. Not reusable - tightly coupled to specific state`;

const goodExample = `// ✅ GOOD EXAMPLE: Functional Recursive Components
// Using pure functions, immutability, and functional composition

import { useState, useCallback, useMemo } from "react";

// ============================================
// Step 1: Define Pure Data Structures
// ============================================
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

// ============================================
// Step 2: Pure Functions for Tree Operations
// ============================================
// ✅ GOOD: Pure function - no side effects
export function findNodeById(tree: TreeNode[], id: string): TreeNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// ✅ GOOD: Pure function - returns new structure
export function getAllNodeIds(tree: TreeNode[]): string[] {
  const ids: string[] = [];
  
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(tree);
  return ids;
}

// ✅ GOOD: Pure function - immutable update
export function toggleNodeInSet(expandedSet: Set<string>, nodeId: string): Set<string> {
  const newSet = new Set(expandedSet);
  if (newSet.has(nodeId)) {
    newSet.delete(nodeId);
  } else {
    newSet.add(nodeId);
  }
  return newSet;
}

// ============================================
// Step 3: Recursive Component
// ============================================
interface RecursiveTreeNodeProps {
  node: TreeNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  expandedNodes: Set<string>;
  selectedNode: string | null;
}

// ✅ GOOD: Recursive component using pure functions
function RecursiveTreeNode({
  node,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  expandedNodes,
  selectedNode,
}: RecursiveTreeNodeProps) {
  const handleClick = useCallback(() => {
    onToggle(node.id);
    onSelect(node.id);
  }, [node.id, onToggle, onSelect]);

  return (
    <div style={{ marginLeft: \`\${level * 20}px\` }} className="py-1">
      <div
        onClick={handleClick}
        className={\`p-2 cursor-pointer rounded transition-colors \${
          isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }\`}
      >
        <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
        <span className="font-medium">{node.label}</span>
      </div>
      {isExpanded && node.children && (
        <div className="ml-4">
          {node.children.map(child => (
            <RecursiveTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={expandedNodes.has(child.id)}
              isSelected={selectedNode === child.id}
              onToggle={onToggle}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              selectedNode={selectedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Step 4: Container Component
// ============================================
export function Tree({ nodes }: { nodes: TreeNode[] }) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // ✅ GOOD: Pure function handlers
  const handleToggle = useCallback((id: string) => {
    setExpandedNodes(prev => toggleNodeInSet(prev, id));
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedNode(id);
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      {nodes.map(node => (
        <RecursiveTreeNode
          key={node.id}
          node={node}
          level={0}
          isExpanded={expandedNodes.has(node.id)}
          isSelected={selectedNode === node.id}
          onToggle={handleToggle}
          onSelect={handleSelect}
          expandedNodes={expandedNodes}
          selectedNode={selectedNode}
        />
      ))}
    </div>
  );
}

// ✅ Benefits:
// 1. Pure functions - easy to test and reason about
// 2. Immutable updates - React detects changes correctly
// 3. Composable - can combine with other functional patterns
// 4. Reusable - tree operations are separate from rendering
// 5. Predictable - same input always produces same output
// 6. Memoizable - can optimize with useMemo and useCallback`;

export default function RecursiveComponentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming" className="mb-4 inline-block">
              ← Back to Functional Programming
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Recursive Components
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Recursive components are components that render themselves to create tree-like structures.
              Using functional programming principles, we can build recursive components that are pure,
              testable, and maintainable.
            </Text>
          </div>
        </Stack>

        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Functional Approach to Recursion
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  When building recursive components, separate pure functions for data manipulation from
                  the rendering logic. Use immutable updates for state changes, and keep components pure
                  by passing all dependencies as props. This makes recursive components predictable,
                  testable, and easy to optimize with React's memoization.
                </Text>
              </div>

              <CodeComparison wrong={badExample} good={goodExample} language="tsx" />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS/FunctionalProgramming">
            ← Back to Functional Programming
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

