# Open/Closed Principle (OCP) & Liskov Substitution Principle (LSP)

This folder contains educational examples demonstrating the **Open/Closed Principle** and **Liskov Substitution Principle** from SOLID principles, implemented in both **Java** and **React/TypeScript**.

## 📁 Folder Structure

```
OCP-LSP/
├── OCP/                    # Open/Closed Principle Examples
│   ├── AreaCalculatorBad.java      # ❌ Violating OCP (Java)
│   ├── AreaCalculatorGood.java     # ✅ Following OCP (Java)
│   ├── ButtonBad.tsx               # ❌ Violating OCP (React)
│   └── ButtonGood.tsx              # ✅ Following OCP (React)
│
└── LSP/                    # Liskov Substitution Principle Examples
    ├── PaymentBad.java             # ❌ Violating LSP (Java)
    ├── PaymentGood.java            # ✅ Following LSP (Java)
    ├── InputBad.tsx                # ❌ Violating LSP (React)
    └── InputGood.tsx               # ✅ Following LSP (React)
```

---

## 🔓 Open/Closed Principle (OCP)

**The Rule:** *"Software entities should be OPEN for extension, but CLOSED for modification."*

**The Goal:** You should be able to add new features **without touching** the old, working code.

### Java Examples

- **`AreaCalculatorBad.java`**: ❌ Every new shape requires modifying the `AreaCalculator` class
- **`AreaCalculatorGood.java`**: ✅ New shapes can be added by implementing the `Shape` interface without modifying `AreaCalculator`

### React Examples

- **`ButtonBad.tsx`**: ❌ Adding new button styles requires editing the `Button` component with if/else logic
- **`ButtonGood.tsx`**: ✅ New button styles can be added via props without modifying the `Button` component

---

## 🔄 Liskov Substitution Principle (LSP)

**The Rule:** *"If Class B inherits from Class A, you should be able to swap A for B without crashing the app."*

**The Goal:** Do not create children that break the parent's rules. Subtypes must be substitutable for their base types.

### Java Examples

- **`PaymentBad.java`**: ❌ `Cash` extends `Payment` but cannot fulfill the `validateWithBank()` contract, causing exceptions
- **`PaymentGood.java`**: ✅ Uses separate interfaces (`Payment` and `Bankable`) so `Cash` only implements what it can do

### React Examples

- **`InputBad.tsx`**: ❌ `DateInput` uses different prop names (`date`, `setDate`) than `StandardInput` (`value`, `onChange`), breaking interchangeability
- **`InputGood.tsx`**: ✅ All input components follow the same prop contract (`value`, `onChange`), making them fully interchangeable

---

## 📚 Key Takeaways

### Open/Closed Principle
1. **Don't rewrite** the `Button` component every time you need a new color
2. **Pass the color as a prop** (React) or use an **Interface** (Java)
3. **Extend behavior** through composition and configuration, not modification

### Liskov Substitution Principle
1. **Don't make** a `DateInput` that refuses to accept `value` and `onChange`
2. **If it acts like an Input**, it must speak the language of an Input
3. **Subtypes must be** fully substitutable for their base types without breaking functionality

---

## 🎯 How to Use These Examples

1. **Read the Bad examples first** to understand what NOT to do
2. **Compare with the Good examples** to see the correct approach
3. **Run the code** (where applicable) to see the differences in behavior
4. **Apply these principles** to your own codebase

---

## 🔗 Related Principles

These examples complement the **Dependency Inversion Principle (DIP)** examples in the `../DI/` folder.

