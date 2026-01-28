/**
 * ✅ GOOD EXAMPLE: Adapter Pattern in Kotlin
 * 
 * WHAT IS THE ADAPTER PATTERN?
 * ============================
 * The Adapter Pattern allows incompatible interfaces to work together by creating
 * a wrapper (adapter) that translates between them. In OOP:
 * - Adapters bridge incompatible classes/interfaces to a common interface
 * - Clients depend on abstractions, not concrete implementations
 * - New services can be integrated by creating adapters without changing client code
 * 
 * WHY IS THE ADAPTER PATTERN GOOD IN CODING?
 * ==========================================
 * 1. LOOSE COUPLING: Client code depends on a stable interface (abstraction) rather
 *    than concrete implementations. This means clients don't need to know
 *    about implementation details or changes.
 * 
 * 2. INTERCHANGEABILITY: You can switch between different services (old API,
 *    new API, mock for testing) by simply changing the adapter. No client code
 *    needs to change.
 * 
 * 3. CONSISTENCY: All clients work with the same data structure and interface,
 *    regardless of which underlying service is used. This prevents inconsistencies
 *    and bugs from API differences.
 * 
 * 4. TESTABILITY: You can easily inject mock adapters for testing without
 *    modifying client code. This makes unit testing much easier.
 * 
 * 5. MAINTAINABILITY: When an API changes, you only need to update the adapter,
 *    not every client that uses it. Changes are isolated to one place.
 * 
 * 6. OPEN/CLOSED PRINCIPLE: The system is open for extension (new adapters)
 *    but closed for modification (no client changes needed).
 * 
 * 7. SINGLE RESPONSIBILITY: Adapters have one job - translate between interfaces.
 *    Clients have one job - use the service. Clear separation of concerns.
 * 
 * 8. LEGACY SYSTEM INTEGRATION: Allows you to integrate legacy systems or
 *    third-party APIs with incompatible interfaces into modern codebases.
 */

package com.designpatterns.adapter.good

// ============================================
// Step 1: Define Target Interface (Abstraction)
// ============================================
// This is what clients expect - a consistent interface
interface PaymentProcessor {
    fun pay(amount: Double, currency: String): Boolean
}

// ============================================
// Step 2: Existing Services (Adaptees) - Incompatible Interfaces
// ============================================

// Old payment service with different method signature
class OldPaymentService {
    // Different method name and parameter structure
    fun processPayment(amount: Double, currencyCode: String): Boolean {
        println("Processing payment of $amount $currencyCode using old system")
        return true
    }
}

// New payment service with incompatible interface
class NewPaymentService {
    // Incompatible interface - different method name and parameters
    fun executePayment(amount: Double, currency: String, metadata: Map<String, String>): Boolean {
        println("Executing payment of $amount $currency using new system")
        println("Metadata: $metadata")
        return true
    }
}

// ============================================
// Step 3: Adapters (Bridge incompatible interfaces)
// ============================================

// ✅ GOOD: Adapter for OldPaymentService
// Adapts old service to PaymentProcessor interface
class OldPaymentAdapter(private val oldService: OldPaymentService) : PaymentProcessor {
    override fun pay(amount: Double, currency: String): Boolean {
        // ✅ Adapts the interface - maps currency to currencyCode
        return oldService.processPayment(amount, currency)
    }
}

// ✅ GOOD: Adapter for NewPaymentService
// Adapts new service's incompatible interface
class NewPaymentAdapter(private val newService: NewPaymentService) : PaymentProcessor {
    override fun pay(amount: Double, currency: String): Boolean {
        // ✅ Adapts the interface - provides default metadata and calls executePayment
        return newService.executePayment(amount, currency, emptyMap())
    }
}

// ============================================
// Step 4: Client Code (Works with abstraction)
// ============================================

class PaymentClient(private val processor: PaymentProcessor) {
    fun makePayment(amount: Double, currency: String): Boolean {
        // ✅ GOOD: Client depends on PaymentProcessor abstraction
        // Works with any adapter that implements PaymentProcessor
        return processor.pay(amount, currency)
    }
}

// ============================================
// Usage Example
// ============================================

fun main() {
    println("=== Adapter Pattern Example ===\n")
    
    // ✅ GOOD: Can use old service through adapter
    val oldService = OldPaymentService()
    val oldAdapter: PaymentProcessor = OldPaymentAdapter(oldService)
    val client1 = PaymentClient(oldAdapter)
    
    println("Using Old Payment Service:")
    client1.makePayment(100.0, "USD")
    println()
    
    // ✅ GOOD: Can use new service through adapter
    val newService = NewPaymentService()
    val newAdapter: PaymentProcessor = NewPaymentAdapter(newService)
    val client2 = PaymentClient(newAdapter)
    
    println("Using New Payment Service:")
    client2.makePayment(200.0, "EUR")
    println()
    
    // ✅ GOOD: Clients can use processors interchangeably
    val processors: List<PaymentProcessor> = listOf(oldAdapter, newAdapter)
    
    println("Processing multiple payments:")
    processors.forEachIndexed { index, processor ->
        val client = PaymentClient(processor)
        println("Payment ${index + 1}:")
        client.makePayment(50.0 + index * 10, "GBP")
    }
    
    // ✅ Benefits:
    // 1. Easy to switch services - just change adapter
    // 2. Consistent interface across all clients
    // 3. Easy to test - inject mock adapter
    // 4. Loose coupling - clients don't know about service implementations
    // 5. Single Responsibility - adapters handle interface conversion
    // 6. Maintainable - service changes only affect adapters
    // 7. Open/Closed - add new services by creating new adapters
}

