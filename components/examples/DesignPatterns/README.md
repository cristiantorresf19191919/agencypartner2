# Design Patterns Examples

This folder contains comprehensive examples of common design patterns implemented in both **Java** and **React/TypeScript**. Each pattern includes both "Bad" (anti-pattern) and "Good" (correct implementation) examples to help you understand the differences.

## 📁 Folder Structure

```
DesignPatterns/
├── Creational/              # Patterns for object creation
│   ├── Singleton/
│   │   ├── SingletonBad.java
│   │   ├── SingletonGood.java
│   │   ├── SingletonBad.tsx
│   │   └── SingletonGood.tsx
│   ├── Factory/
│   │   ├── FactoryBad.java
│   │   ├── FactoryGood.java
│   │   ├── FactoryBad.tsx
│   │   └── FactoryGood.tsx
│   └── Builder/
│       ├── BuilderBad.java
│       ├── BuilderGood.java
│       ├── BuilderBad.tsx
│       └── BuilderGood.tsx
│
├── Structural/              # Patterns for object composition
│   ├── Adapter/
│   │   ├── AdapterBad.java
│   │   ├── AdapterGood.java
│   │   ├── AdapterBad.tsx
│   │   └── AdapterGood.tsx
│   ├── Decorator/
│   │   ├── DecoratorBad.java
│   │   ├── DecoratorGood.java
│   │   ├── DecoratorBad.tsx
│   │   └── DecoratorGood.tsx
│   ├── Facade/
│   │   ├── FacadeBad.java
│   │   ├── FacadeGood.java
│   │   ├── FacadeBad.tsx
│   │   └── FacadeGood.tsx
│   └── Proxy/
│       ├── ProxyBad.java
│       ├── ProxyGood.java
│       ├── ProxyBad.tsx
│       └── ProxyGood.tsx
│
└── Behavioral/              # Patterns for object interaction
    ├── Observer/
    │   ├── ObserverBad.java
    │   ├── ObserverGood.java
    │   ├── ObserverBad.tsx
    │   └── ObserverGood.tsx
    ├── Strategy/
    │   ├── StrategyBad.java
    │   ├── StrategyGood.java
    │   ├── StrategyBad.tsx
    │   └── StrategyGood.tsx
    ├── Command/
    │   ├── CommandBad.java
    │   ├── CommandGood.java
    │   ├── CommandBad.tsx
    │   └── CommandGood.tsx
    └── State/
        ├── StateBad.java
        ├── StateGood.java
        ├── StateBad.tsx
        └── StateGood.tsx
```

---

## 🏗️ Creational Patterns

### 1. Singleton Pattern
**Purpose:** Ensure a class has only one instance and provide global access to it.

- **Java:** Thread-safe singleton implementations
- **React:** Context API and module-level instances

**Use Cases:**
- Database connections
- Configuration managers
- Logging services

---

### 2. Factory Pattern
**Purpose:** Create objects without specifying the exact class of object that will be created.

- **Java:** Factory interface and concrete factories
- **React:** Factory functions and component factories

**Use Cases:**
- Creating different UI components based on type
- Creating different payment processors
- Creating different vehicle types

---

### 3. Builder Pattern
**Purpose:** Construct complex objects step by step.

- **Java:** Builder class with fluent interface
- **React:** Object spread and component composition

**Use Cases:**
- Creating complex configuration objects
- Building forms with many optional fields
- Creating query builders

---

## 🧩 Structural Patterns

### 4. Adapter Pattern
**Purpose:** Allow incompatible interfaces to work together.

- **Java:** Adapter class implementing target interface
- **React:** Adapter functions transforming data formats

**Use Cases:**
- Integrating third-party libraries
- Converting data formats
- Making old code work with new interfaces

---

### 5. Decorator Pattern
**Purpose:** Add new functionality to objects dynamically without altering their structure.

- **Java:** Decorator classes wrapping components
- **React:** Higher-order components and composition

**Use Cases:**
- Adding features to UI components
- Adding logging/caching to methods
- Extending functionality without inheritance

---

### 6. Facade Pattern
**Purpose:** Provide a simplified interface to a complex subsystem.

- **Java:** Facade class hiding subsystem complexity
- **React:** Custom hooks and service facades

**Use Cases:**
- Simplifying complex API interactions
- Providing simple interfaces to complex libraries
- Orchestrating multiple service calls

---

### 7. Proxy Pattern
**Purpose:** Provide a placeholder for another object to control access to it.

- **Java:** Proxy class controlling access to real object
- **React:** Lazy loading and React.memo

**Use Cases:**
- Lazy loading of expensive resources
- Access control
- Caching and performance optimization

---

## 🎭 Behavioral Patterns

### 8. Observer Pattern
**Purpose:** Define a one-to-many dependency between objects so that when one object changes state, all dependents are notified.

- **Java:** Subject/Observer interface pattern
- **React:** Context API and custom hooks

**Use Cases:**
- Event handling systems
- Model-View architectures
- Publish-subscribe systems

---

### 9. Strategy Pattern
**Purpose:** Define a family of algorithms, encapsulate each one, and make them interchangeable.

- **Java:** Strategy interface with concrete implementations
- **React:** Strategy functions and hooks

**Use Cases:**
- Payment processing methods
- Sorting algorithms
- Validation strategies

---

### 10. Command Pattern
**Purpose:** Encapsulate a request as an object, allowing parameterization and queuing of requests.

- **Java:** Command interface with execute/undo methods
- **React:** Command hooks with history management

**Use Cases:**
- Undo/redo functionality
- Macro recording
- Queuing operations

---

### 11. State Pattern
**Purpose:** Allow an object to alter its behavior when its internal state changes.

- **Java:** State interface with concrete state classes
- **React:** useReducer and state machines

**Use Cases:**
- State machines
- Workflow management
- UI state management

---

## 📚 How to Use These Examples

1. **Start with the "Bad" examples** to understand common anti-patterns
2. **Compare with the "Good" examples** to see the correct implementation
3. **Read the comments** in each file for detailed explanations
4. **Run the code** (where applicable) to see the differences in behavior
5. **Apply these patterns** to your own codebase when appropriate

---

## 🎯 Key Principles

### When to Use Design Patterns

- ✅ **Use patterns when they solve a real problem** - Don't force patterns where simple code works
- ✅ **Understand the problem first** - Patterns are solutions to specific problems
- ✅ **Consider the trade-offs** - Patterns add complexity; make sure the benefits outweigh the costs
- ✅ **Start simple** - Don't over-engineer; add patterns as complexity grows

### Common Mistakes

- ❌ **Overusing patterns** - Not every problem needs a design pattern
- ❌ **Using patterns incorrectly** - Understand the pattern before applying it
- ❌ **Ignoring simpler solutions** - Sometimes a simple function is better than a pattern
- ❌ **Copying without understanding** - Learn why patterns work, not just how

---

## 🔗 Related Resources

- **SOLID Principles:** See `../OCP-LSP/` for Open/Closed and Liskov Substitution examples
- **Dependency Inversion:** See `../DI/` for Dependency Inversion Principle examples

---

## 📖 Pattern Categories Summary

| Category | Patterns | Purpose |
|----------|----------|---------|
| **Creational** | Singleton, Factory, Builder | Object creation mechanisms |
| **Structural** | Adapter, Decorator, Facade, Proxy | Object composition and relationships |
| **Behavioral** | Observer, Strategy, Command, State | Object interaction and communication |

---

## 💡 Tips for Learning

1. **Read both Bad and Good examples** - Understanding what NOT to do is as important as knowing what TO do
2. **Compare Java and React implementations** - See how patterns adapt to different paradigms
3. **Practice refactoring** - Try converting Bad examples to Good examples
4. **Look for patterns in existing code** - Identify where patterns could improve your codebase
5. **Don't memorize, understand** - Focus on the problem each pattern solves

---

## 🚀 Next Steps

After understanding these patterns:

1. Identify anti-patterns in your own code
2. Refactor using appropriate patterns
3. Learn additional patterns as needed (Iterator, Mediator, Template Method, etc.)
4. Study real-world applications of these patterns in popular frameworks
5. Practice implementing patterns in your projects

---

**Remember:** Design patterns are tools, not goals. Use them to write better, more maintainable code, not to show off complexity!





