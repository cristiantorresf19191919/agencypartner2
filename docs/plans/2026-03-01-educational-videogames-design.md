# Educational Videogames Design — Spring Boot, Kotlin, Kotlin Coroutines

**Date:** 2026-03-01
**Status:** Approved

## Overview

Three new educational videogames for the developer section, matching the existing React 19 and Reactor game quality. Each game: single `page.tsx` + CSS module, dark theme, Framer Motion + CSS animations, bilingual ES/EN, localStorage persistence, responsive design. 25+ levels each.

---

## Game 1: Spring Boot Defender (Tower Defense)

**Path:** `app/[locale]/developer-section/springboot-game/`
**Mechanic:** Tower defense — Spring Boot annotations as towers, runtime exceptions as enemies.
**Rendering:** Canvas 2D + requestAnimationFrame (same pattern as React 19 game)

### Towers (9)

| Tower | Emoji | Cost | Damage | Range | Special |
|-------|-------|------|--------|-------|---------|
| `@RestController` | 🎯 | 50 | 12 | 3 | Routes HTTP requests |
| `@Service` | ⚙️ | 75 | 18 | 2.5 | AOE business logic blast |
| `@Repository` | 🗄️ | 60 | 15 | 3 | Pierce through enemies |
| `@Transactional` | 🔒 | 100 | 25 | 2 | Rollback: instant kill on debuffed |
| `@Autowired` | 🔌 | 40 | 8 | 4 | Boosts adjacent towers +30% |
| `@Valid` | ✅ | 80 | 20 | 3 | Validates & slows enemies 50% |
| `@Cacheable` | 💾 | 90 | 30 | 2.5 | Double damage on repeated enemy type |
| `@ExceptionHandler` | 🛡️ | 120 | 45 | 3.5 | Boss killer: 3x damage to bosses |
| `@Async` | ⚡ | 110 | 35 | 3 | Fires twice per attack cycle |

### Enemies (7)

| Enemy | Emoji | HP | Speed | Reward | Special |
|-------|-------|----|-------|--------|---------|
| NullPointerException | 🐛 | 40 | 1.2 | 15 | Basic |
| 404 Not Found | 👻 | 60 | 1.5 | 20 | Invisible for 1s every 3s |
| 500 Internal Error | 💥 | 100 | 0.8 | 30 | Splits into 2 small errors on death |
| CircularDependency | 🔄 | 120 | 0.6 | 35 | Regenerates 2 HP/s |
| StackOverflow | 📚 | 80 | 1.0 | 25 | Spawns 1 copy at 50% HP |
| ClassCastException | 🎭 | 90 | 1.1 | 28 | Disguises as friendly until close |
| OutOfMemory (Boss) | 🧠 | 300 | 0.4 | 100 | Teleports, AOE damage to towers |

### Waves (25+)

- Waves 1-5: Basic enemies (NullPointer, 404)
- Waves 6-10: Mixed + CircularDependency introduced
- Waves 11-15: StackOverflow + ClassCast, faster spawns
- Waves 16-20: Mixed heavy waves with multiple boss appearances
- Waves 21-25: Extreme mode — all enemy types, double speed, boss every 3 waves
- Waves 25+: Endless mode with scaling difficulty

### Teaching Goals

Each tower teaches a Spring Boot annotation's purpose. Info panel shows what the annotation does in real Spring Boot apps when hovering.

---

## Game 2: Kotlin Type Alchemist (Crafting Puzzle)

**Path:** `app/[locale]/developer-section/kotlin-game/`
**Mechanic:** Select and combine Kotlin constructs in a "cauldron" to transform input types to target output. Star rating for optimal solutions.
**Rendering:** DOM + Framer Motion (same pattern as Reactor game)

### Ingredients (Operators) — 20+

| Category | Ingredients |
|----------|------------|
| **Variables** | `val`, `var`, `const val` |
| **Null Safety** | `?.`, `?:`, `!!`, `?.let{}`, `as?`, `requireNotNull()` |
| **Collections** | `listOf`, `map{}`, `filter{}`, `reduce{}`, `flatMap{}`, `groupBy{}`, `sortedBy{}`, `associate{}`, `zip()`, `chunked()` |
| **Type System** | `data class`, `sealed class`, `enum class`, `object`, `copy()`, `destructuring` |
| **Scope Functions** | `let`, `also`, `apply`, `run`, `with` |
| **Extensions** | `fun T.ext()`, `infix`, `operator` |
| **Generics** | `<T>`, `<out T>`, `<in T>`, `where T :` |
| **Lambdas** | `{ }`, `it`, `::ref`, `invoke()` |
| **Delegation** | `by lazy`, `by map`, `by Delegates.observable` |
| **DSL** | `@DslMarker`, receiver lambdas, builder pattern |

### Levels (25)

1. **val vs var** — Assign correctly (immutable vs mutable)
2. **Type inference** — Let Kotlin infer types
3. **String templates** — Build strings with `${}`
4. **Nullable intro** — `String?` to `String` with `?:`
5. **Safe calls** — Chain `?.` operations
6. **Let & Elvis** — `?.let { } ?: default`
7. **Smart casts** — `is` checks + automatic cast
8. **When expressions** — Pattern matching basics
9. **List basics** — `listOf`, `mutableListOf`, indexing
10. **Map & Filter** — Transform and filter collections
11. **FlatMap & Reduce** — Advanced collection operations
12. **Data classes** — Create, copy, destructure
13. **Sealed classes** — Exhaustive when + sealed hierarchies
14. **Enum classes** — Define and use enums with properties
15. **Extension functions** — Add methods to existing types
16. **Scope functions 1** — `let` and `also`
17. **Scope functions 2** — `apply`, `run`, `with`
18. **Lambdas & HOF** — Higher-order functions
19. **Function references** — `::method` syntax
20. **Generics basics** — `<T>` type parameters
21. **Variance** — `out` (covariance) vs `in` (contravariance)
22. **Delegation** — `by lazy`, property delegates
23. **Operator overloading** — `plus`, `invoke`, `get`
24. **Infix functions** — Clean DSL syntax
25. **DSL Builder** — Combine everything into a DSL

Each level: input type → place ingredients in cauldron slots (1-3 slots depending on level) → animated transformation → compare to target. Par system for star ratings.

### Visual Design

- Animated "cauldron" with particle effects (bubbles, sparks)
- Ingredients as potion bottles/crystals with glow effects
- Transformation animation: input floats in → swirls → output emerges
- Success: confetti + cauldron glows gold
- Failure: cauldron smokes red + shake

---

## Game 3: Coroutine Conductor (Async Flow Orchestration)

**Path:** `app/[locale]/developer-section/coroutines-game/`
**Mechanic:** Visual timeline with thread lanes. Place coroutine operators to orchestrate async tasks without blocking main thread or causing deadlocks.
**Rendering:** DOM + Framer Motion + CSS animations for timeline visualization

### Thread Lanes (Visual)

- `Main` — UI thread (red lane — must never block)
- `Dispatchers.IO` — I/O operations (blue lane)
- `Dispatchers.Default` — CPU computation (green lane)
- `Dispatchers.Unconfined` — No confinement (yellow lane)

### Operators (12)

| Operator | Emoji | Effect |
|----------|-------|--------|
| `launch` | 🚀 | Fire-and-forget coroutine on specified dispatcher |
| `async` | ⚡ | Returns Deferred, runs concurrently |
| `await()` | ⏳ | Suspends until Deferred completes |
| `suspend` | ⏸️ | Marks function as suspendable |
| `delay()` | ⏱️ | Non-blocking delay (vs Thread.sleep) |
| `withContext()` | 🔄 | Switch to different dispatcher |
| `coroutineScope` | 📦 | Structured concurrency boundary |
| `supervisorScope` | 🏗️ | Independent child failures |
| `flow { emit() }` | 🌊 | Cold async stream producer |
| `collect` | 🪣 | Terminal flow consumer |
| `Channel` | 📡 | Hot async stream (send/receive) |
| `cancel()` | ❌ | Cancel coroutine/job |

### Levels (25)

**Block 1 — Basics (1-7):**
1. **Hello Coroutine** — Place `launch` to run a task off main thread
2. **Suspend Function** — Use `suspend` to make a function non-blocking
3. **Delay vs Sleep** — `delay()` vs `Thread.sleep()` — don't block Main!
4. **Multiple Launches** — Fire 3 concurrent tasks
5. **Dispatcher Choice** — Route IO task to `Dispatchers.IO`
6. **withContext Switch** — Switch from Main to IO and back
7. **Sequential Suspend** — Chain 2 suspend functions in order

**Block 2 — Async/Await (8-12):**
8. **Async Basics** — Get a Deferred result with `async`
9. **Parallel Decomposition** — 2 async tasks + await both
10. **Structured Concurrency** — `coroutineScope` waits for all children
11. **Error in Scope** — One child fails → all siblings cancel
12. **SupervisorScope** — Independent failure handling

**Block 3 — Flow (13-18):**
13. **Cold Flow** — `flow { emit() }` + `collect`
14. **Flow Operators** — `map`, `filter` on flows
15. **Flow on Different Dispatcher** — `flowOn(Dispatchers.IO)`
16. **StateFlow** — Hot state holder
17. **SharedFlow** — Broadcast to multiple collectors
18. **Channel Basics** — `Channel` send/receive

**Block 4 — Advanced (19-25):**
19. **Timeout** — `withTimeout` to prevent hanging
20. **Cancellation** — Cooperative cancellation with `isActive`
21. **Exception Handling** — `try/catch` in coroutines + `CoroutineExceptionHandler`
22. **Mutex** — Prevent race conditions
23. **Parallel Map** — Process list items concurrently
24. **Retry with Delay** — Exponential backoff pattern
25. **Real-World: API Aggregator** — Parallel API calls, combine results, handle partial failures

### Visual Design

- Horizontal timeline lanes (threads) with animated task blocks sliding across
- Tasks are colored rectangles that flow left-to-right on their assigned lane
- Thread switching shown as diagonal connecting lines between lanes
- Blocking indicator: Main lane turns red with warning when blocked
- Success: all tasks complete, timeline shows clean parallel execution
- Failure: deadlock visualization (tasks stuck), race condition (tasks overlap with sparks)

---

## Shared Architecture

All games follow existing patterns:
- Single `page.tsx` (~1000-1500 lines) + `GameName.module.css`
- `"use client"` directive
- Framer Motion for UI transitions
- Canvas 2D for Spring Boot game (real-time)
- DOM + Framer Motion for Kotlin and Coroutines games (turn-based)
- `useLanguage()` for ES/EN translations
- `useLocale()` for navigation
- `DeveloperHeader` + `Footer` components
- localStorage for progress/highscore persistence
- Dark theme with colored accents
- Responsive: mobile-first grid layouts

## Hub Integration

Register all 3 games in `app/[locale]/developer-section/page.tsx` contentGroups under the "game" section alongside existing React 19 and Reactor games.

## Translation Keys

~20 keys per game in `lib/translations.ts` for both `es` and `en`.
