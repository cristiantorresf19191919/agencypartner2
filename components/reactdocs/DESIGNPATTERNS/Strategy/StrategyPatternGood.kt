/**
 * ✅ GOOD EXAMPLE: Strategy Pattern in Kotlin
 * 
 * WHAT IS THE STRATEGY PATTERN?
 * =============================
 * The Strategy Pattern defines a family of algorithms, encapsulates each one,
 * and makes them interchangeable. It lets the algorithm vary independently from
 * clients that use it. In OOP:
 * - Strategies encapsulate different algorithms or behaviors
 * - Context classes can switch between strategies at runtime
 * - New strategies can be added without modifying existing code
 * - Algorithms are reusable and testable independently
 * 
 * WHY IS THE STRATEGY PATTERN GOOD IN CODING?
 * ===========================================
 * 1. ELIMINATES CONDITIONALS: Instead of complex if/else or switch statements,
 *    you encapsulate each algorithm in its own strategy class. This makes code
 *    cleaner and easier to read.
 * 
 * 2. OPEN/CLOSED PRINCIPLE: The system is open for extension (new strategies)
 *    but closed for modification (no changes to existing code needed).
 * 
 * 3. SINGLE RESPONSIBILITY: Each strategy class has one job - implement one
 *    algorithm. This makes code more maintainable and testable.
 * 
 * 4. REUSABILITY: Strategies can be reused across different contexts and
 *    classes, reducing code duplication.
 * 
 * 5. TESTABILITY: Each strategy can be tested independently. You can easily
 *    mock strategies for testing context classes.
 * 
 * 6. RUNTIME FLEXIBILITY: Algorithms can be selected and changed at runtime,
 *    providing dynamic behavior without code changes.
 * 
 * 7. MAINTAINABILITY: Algorithm logic is separated from context logic,
 *    making both easier to maintain and understand.
 * 
 * 8. NO CODE DUPLICATION: Common algorithm logic is encapsulated in one place,
 *    preventing scattered implementations across the codebase.
 */

package com.designpatterns.strategy.good

// ============================================
// Step 1: Strategy Interface
// ============================================
// Defines the contract for all shipping strategies
interface ShippingStrategy {
    fun calculate(amount: Double): Double
    fun getName(): String
}

// ============================================
// Step 2: Concrete Strategies
// ============================================

// ✅ GOOD: Standard shipping strategy
class StandardShipping : ShippingStrategy {
    override fun calculate(amount: Double): Double {
        return amount * 0.1 // 10% of order total
    }

    override fun getName(): String {
        return "Standard Shipping"
    }
}

// ✅ GOOD: Express shipping strategy
class ExpressShipping : ShippingStrategy {
    override fun calculate(amount: Double): Double {
        return amount * 0.2 // 20% of order total
    }

    override fun getName(): String {
        return "Express Shipping"
    }
}

// ✅ GOOD: Overnight shipping strategy
class OvernightShipping : ShippingStrategy {
    override fun calculate(amount: Double): Double {
        return amount * 0.5 // 50% of order total
    }

    override fun getName(): String {
        return "Overnight Shipping"
    }
}

// ============================================
// Step 3: Context Class (Uses Strategy)
// ============================================

class Order(private var total: Double, private var shippingStrategy: ShippingStrategy) {
    // ✅ GOOD: Can change strategy at runtime
    fun setShippingStrategy(strategy: ShippingStrategy) {
        this.shippingStrategy = strategy
    }

    fun calculateShipping(): Double {
        // ✅ GOOD: Delegates to strategy - no conditionals
        return shippingStrategy.calculate(total)
    }

    fun getTotal(): Double {
        return total + calculateShipping()
    }

    fun getShippingMethod(): String {
        return shippingStrategy.getName()
    }
}

// ============================================
// Usage Example
// ============================================

fun main() {
    println("=== Strategy Pattern Example ===\n")
    
    // ✅ GOOD: Create orders with different strategies
    val order1 = Order(100.0, StandardShipping())
    val order2 = Order(100.0, ExpressShipping())
    val order3 = Order(100.0, OvernightShipping())
    
    println("Fixed Strategy Orders:")
    println("${order1.getShippingMethod()}: $${order1.getTotal()}")
    println("${order2.getShippingMethod()}: $${order2.getTotal()}")
    println("${order3.getShippingMethod()}: $${order3.getTotal()}")
    println()
    
    // ✅ GOOD: Can change strategy at runtime
    val order4 = Order(100.0, StandardShipping())
    println("Before strategy change:")
    println("${order4.getShippingMethod()}: $${order4.getTotal()}")
    
    order4.setShippingStrategy(ExpressShipping())
    println("After strategy change:")
    println("${order4.getShippingMethod()}: $${order4.getTotal()}")
    println()
    
    // ✅ GOOD: Strategies can be reused across different orders
    val standardStrategy = StandardShipping()
    val orders = listOf(
        Order(50.0, standardStrategy),
        Order(150.0, standardStrategy),
        Order(200.0, standardStrategy)
    )
    
    println("Multiple orders using same strategy:")
    orders.forEachIndexed { index, order ->
        println("Order ${index + 1}: ${order.getShippingMethod()} - Total: $${order.getTotal()}")
    }
    
    // ✅ Benefits:
    // 1. No conditionals - strategy handles algorithm
    // 2. Easy to add new strategies - just implement ShippingStrategy
    // 3. Strategies are reusable - can use same strategy for multiple orders
    // 4. Follows Open/Closed Principle - open for extension, closed for modification
    // 5. Testable - can test each strategy independently
    // 6. Maintainable - algorithm logic separated from Order class
    // 7. Flexible - can change strategy at runtime
}

