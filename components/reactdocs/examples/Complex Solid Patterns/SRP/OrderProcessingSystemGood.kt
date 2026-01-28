// ✅ GOOD EXAMPLE: Single Responsibility Principle Applied
// Each class has a single, well-defined responsibility
// Classes are focused, testable, and maintainable

package com.solidpatterns.complex.srp.good

data class ComplexOrder(
    val id: String,
    val customerId: String,
    val items: List<OrderItem>,
    val shippingAddress: String,
    val paymentMethod: String
)

data class OrderItem(
    val productId: String,
    val quantity: Int,
    val price: Double
)

// ✅ Responsibility 1: Order Validation Only
class OrderValidator {
    private val customerRepository = CustomerRepository()
    
    fun validate(order: ComplexOrder): ValidationResult {
        val errors = mutableListOf<String>()
        
        if (order.items.isEmpty()) {
            errors.add("Order must contain at least one item")
        }
        
        if (!customerRepository.exists(order.customerId)) {
            errors.add("Customer ${order.customerId} not found")
        }
        
        if (order.shippingAddress.isBlank()) {
            errors.add("Shipping address is required")
        }
        
        if (order.paymentMethod.isBlank()) {
            errors.add("Payment method is required")
        }
        
        return if (errors.isEmpty()) {
            ValidationResult.Success
        } else {
            ValidationResult.Failure(errors)
        }
    }
}

sealed class ValidationResult {
    object Success : ValidationResult()
    data class Failure(val errors: List<String>) : ValidationResult()
}

// ✅ Responsibility 2: Price Calculation Only
class PriceCalculator {
    private val taxCalculator = TaxCalculator()
    private val shippingCalculator = ShippingCalculator()
    private val discountCalculator = DiscountCalculator()
    
    fun calculateTotal(order: ComplexOrder): Double {
        val subtotal = order.items.sumOf { it.price * it.quantity }
        val discount = discountCalculator.calculateDiscount(order)
        val discountedSubtotal = subtotal - discount
        val tax = taxCalculator.calculateTax(discountedSubtotal)
        val shipping = shippingCalculator.calculateShipping(order.items.size)
        
        return discountedSubtotal + tax + shipping
    }
}

class TaxCalculator {
    private val taxRate = 0.08 // 8%
    
    fun calculateTax(amount: Double): Double {
        return amount * taxRate
    }
}

class ShippingCalculator {
    fun calculateShipping(itemCount: Int): Double {
        return when {
            itemCount <= 3 -> 5.0
            itemCount <= 10 -> 10.0
            else -> 15.0
        }
    }
}

class DiscountCalculator {
    fun calculateDiscount(order: ComplexOrder): Double {
        val subtotal = order.items.sumOf { it.price * it.quantity }
        
        // 10% discount for orders with more than 5 items
        return if (order.items.size > 5) {
            subtotal * 0.10
        } else {
            0.0
        }
    }
}

// ✅ Responsibility 3: Payment Processing Only
interface PaymentProcessor {
    fun process(customerId: String, amount: Double): PaymentResult
}

data class PaymentResult(val success: Boolean, val transactionId: String?)

class CreditCardProcessor : PaymentProcessor {
    override fun process(customerId: String, amount: Double): PaymentResult {
        println("Processing credit card payment of $$amount for customer $customerId")
        // Simulate payment processing
        return PaymentResult(true, "TXN-CC-${System.currentTimeMillis()}")
    }
}

class PayPalProcessor : PaymentProcessor {
    override fun process(customerId: String, amount: Double): PaymentResult {
        println("Processing PayPal payment of $$amount for customer $customerId")
        // Simulate payment processing
        return PaymentResult(true, "TXN-PP-${System.currentTimeMillis()}")
    }
}

class BankTransferProcessor : PaymentProcessor {
    override fun process(customerId: String, amount: Double): PaymentResult {
        println("Processing bank transfer of $$amount for customer $customerId")
        // Simulate payment processing
        return PaymentResult(true, "TXN-BT-${System.currentTimeMillis()}")
    }
}

class PaymentProcessorFactory {
    fun create(paymentMethod: String): PaymentProcessor {
        return when (paymentMethod) {
            "credit_card" -> CreditCardProcessor()
            "paypal" -> PayPalProcessor()
            "bank_transfer" -> BankTransferProcessor()
            else -> throw IllegalArgumentException("Unsupported payment method: $paymentMethod")
        }
    }
}

// ✅ Responsibility 4: Inventory Management Only
class InventoryManager {
    private val inventoryRepository = InventoryRepository()
    
    fun reserveItems(order: ComplexOrder): InventoryReservationResult {
        val reservations = mutableListOf<ItemReservation>()
        
        for (item in order.items) {
            val availableStock = inventoryRepository.getStock(item.productId)
            
            if (availableStock < item.quantity) {
                // Rollback previous reservations
                reservations.forEach { inventoryRepository.releaseReservation(it) }
                return InventoryReservationResult.Failure(
                    "Insufficient stock for product ${item.productId}. Available: $availableStock, Required: ${item.quantity}"
                )
            }
            
            val reservation = inventoryRepository.reserve(item.productId, item.quantity)
            reservations.add(reservation)
        }
        
        return InventoryReservationResult.Success(reservations)
    }
    
    fun releaseReservations(reservations: List<ItemReservation>) {
        reservations.forEach { inventoryRepository.releaseReservation(it) }
    }
}

data class ItemReservation(val id: String, val productId: String, val quantity: Int)

sealed class InventoryReservationResult {
    data class Success(val reservations: List<ItemReservation>) : InventoryReservationResult()
    data class Failure(val message: String) : InventoryReservationResult()
}

// ✅ Responsibility 5: Email Notifications Only
class EmailNotificationService {
    private val customerRepository = CustomerRepository()
    private val emailSender = EmailSender()
    
    fun sendOrderConfirmation(order: ComplexOrder, totalAmount: Double) {
        val customerEmail = customerRepository.getEmail(order.customerId)
        val emailContent = OrderEmailTemplate.generateConfirmation(order, totalAmount)
        
        emailSender.send(
            to = customerEmail,
            subject = "Order Confirmation - Order #${order.id}",
            body = emailContent
        )
    }
}

class OrderEmailTemplate {
    companion object {
        fun generateConfirmation(order: ComplexOrder, totalAmount: Double): String {
            return """
                Dear Customer,
                
                Your order #${order.id} has been confirmed.
                Total amount: $$totalAmount
                Shipping address: ${order.shippingAddress}
                
                Thank you for your purchase!
            """.trimIndent()
        }
    }
}

// ✅ Responsibility 6: Database Operations Only
class OrderRepository {
    fun save(order: ComplexOrder, totalAmount: Double, transactionId: String?) {
        println("Saving order to database: ID=${order.id}, Customer=${order.customerId}, Total=$$totalAmount, Transaction=$transactionId")
        // Simulate database insert
    }
    
    fun findById(orderId: String): ComplexOrder? {
        // Simulate database query
        return null
    }
}

// Supporting classes
class CustomerRepository {
    fun exists(customerId: String): Boolean = customerId.isNotBlank()
    fun getEmail(customerId: String): String = "customer$customerId@example.com"
}

class InventoryRepository {
    private val stock = mutableMapOf<String, Int>()
    
    init {
        // Initialize mock stock
        stock["PROD-1"] = 100
        stock["PROD-2"] = 50
        stock["PROD-3"] = 200
    }
    
    fun getStock(productId: String): Int = stock.getOrDefault(productId, 0)
    
    fun reserve(productId: String, quantity: Int): ItemReservation {
        val currentStock = stock[productId] ?: 0
        stock[productId] = currentStock - quantity
        return ItemReservation("RES-${System.currentTimeMillis()}", productId, quantity)
    }
    
    fun releaseReservation(reservation: ItemReservation) {
        val currentStock = stock[reservation.productId] ?: 0
        stock[reservation.productId] = currentStock + reservation.quantity
    }
}

class EmailSender {
    fun send(to: String, subject: String, body: String) {
        println("Sending email to $to with subject: $subject")
        println("Body: $body")
    }
}

// ✅ Orchestrator: Coordinates the process but doesn't implement business logic
class OrderProcessingService {
    private val validator = OrderValidator()
    private val priceCalculator = PriceCalculator()
    private val paymentProcessorFactory = PaymentProcessorFactory()
    private val inventoryManager = InventoryManager()
    private val emailService = EmailNotificationService()
    private val orderRepository = OrderRepository()
    
    fun processOrder(order: ComplexOrder): OrderProcessingResult {
        // Step 1: Validate
        val validation = validator.validate(order)
        if (validation is ValidationResult.Failure) {
            return OrderProcessingResult.Failure(validation.errors.joinToString(", "))
        }
        
        // Step 2: Calculate price
        val totalPrice = priceCalculator.calculateTotal(order)
        println("Total price calculated: $$totalPrice")
        
        // Step 3: Reserve inventory
        val inventoryResult = inventoryManager.reserveItems(order)
        if (inventoryResult is InventoryReservationResult.Failure) {
            return OrderProcessingResult.Failure(inventoryResult.message)
        }
        
        val reservations = (inventoryResult as InventoryReservationResult.Success).reservations
        
        // Step 4: Process payment
        val paymentProcessor = paymentProcessorFactory.create(order.paymentMethod)
        val paymentResult = paymentProcessor.process(order.customerId, totalPrice)
        
        if (!paymentResult.success) {
            inventoryManager.releaseReservations(reservations)
            return OrderProcessingResult.Failure("Payment processing failed")
        }
        
        // Step 5: Save order
        orderRepository.save(order, totalPrice, paymentResult.transactionId)
        
        // Step 6: Send confirmation email
        emailService.sendOrderConfirmation(order, totalPrice)
        
        println("✅ Order ${order.id} processed successfully")
        return OrderProcessingResult.Success(order.id, totalPrice, paymentResult.transactionId!!)
    }
}

sealed class OrderProcessingResult {
    data class Success(val orderId: String, val totalAmount: Double, val transactionId: String) : OrderProcessingResult()
    data class Failure(val message: String) : OrderProcessingResult()
}

fun main() {
    val orderService = OrderProcessingService()
    
    val order = ComplexOrder(
        id = "ORD-001",
        customerId = "CUST-123",
        items = listOf(
            OrderItem("PROD-1", 2, 25.0),
            OrderItem("PROD-2", 1, 50.0),
            OrderItem("PROD-3", 3, 15.0)
        ),
        shippingAddress = "123 Main St, City, Country",
        paymentMethod = "credit_card"
    )
    
    val result = orderService.processOrder(order)
    when (result) {
        is OrderProcessingResult.Success -> {
            println("Order processed: ${result.orderId}, Total: $${result.totalAmount}")
        }
        is OrderProcessingResult.Failure -> {
            println("Order processing failed: ${result.message}")
        }
    }
}

