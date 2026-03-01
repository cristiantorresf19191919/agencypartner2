# Reactor Games Expansion Design

**Date:** 2026-03-01
**Status:** Approved

## Overview

Two changes:
1. Expand existing Reactor Pipes game: unlock all levels, add 40+ operators, expand to 30+ levels
2. Create new Reactor Flow Simulator game: marble diagram visualization for multi-stream operators, 30+ levels

---

## Change 1: Expand Reactor Pipes Game

### Remove Level Locking
All levels freely accessible from start. Remove `isLevelUnlocked` check.

### Operators (40+ total)

**Transforming (10):**
- `map(×2)`, `map(×3)`, `map(+3)`, `map(-1)`, `map(abs)`, `map(square)`, `map(+10)`, `map(÷2)`, `map(neg)`, `map(%3)`

**Filtering (8):**
- `filter(even)`, `filter(odd)`, `filter(>5)`, `filter(<10)`, `filter(>0)`, `filter(!=0)`, `filter(prime)`, `filter(<=20)`

**Limiting (6):**
- `take(3)`, `take(5)`, `takeLast(2)`, `takeWhile(<10)`, `skip(2)`, `skipWhile(<5)`

**Deduplication & Ordering (4):**
- `distinct()`, `sort()`, `sort(desc)`, `distinctUntilChanged()`

**Aggregation (6):**
- `reduce(+)`, `reduce(×)`, `scan(+)`, `scan(×)`, `count()`, `collectList()`

**Advanced (8):**
- `buffer(3)`, `window(2)`, `groupBy(even/odd)`, `flatMap(dup)`, `defaultIfEmpty(0)`, `switchIfEmpty([1])`, `repeat(2)`, `any(>10)`

**Total: 42 operators**

### Levels (30+)

Levels 1-7: Single operator (existing + new operators)
Levels 8-15: Two-operator chains
Levels 16-22: Three-operator chains
Levels 23-28: Four-operator chains with complex logic
Levels 29-30: Master pipelines using 4-5 slots

---

## Change 2: New Game — Reactor Flow Simulator

### Path
`app/[locale]/developer-section/reactor-flow-game/`

### Concept
Visual marble diagram simulator. Multiple horizontal stream timelines. Marbles flow left-to-right. Operators combine/transform streams. Animated timing shows concurrent behavior. All levels unlocked.

### Operators (20+ multi-stream & advanced)

**Combining:** zip, merge, concat, combineLatest, mergeWith, concatWith
**FlatMapping:** flatMap, concatMap, switchMap
**Error Handling:** onErrorReturn, onErrorResume, retry, timeout
**Buffering:** buffer, window, groupBy
**Timing:** delay, delayElements, sample, throttleFirst
**Side Effects:** doOnNext, doOnError, doOnComplete
**Backpressure:** onBackpressureDrop, onBackpressureBuffer, limitRate

### 30 Levels
Block 1 (1-8): Combining streams
Block 2 (9-14): FlatMapping
Block 3 (15-20): Error handling
Block 4 (21-26): Buffering & timing
Block 5 (27-30): Advanced (threading, backpressure, master)

All levels unlocked from start.
