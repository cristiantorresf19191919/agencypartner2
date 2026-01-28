// ❌ BAD EXAMPLE: Single Responsibility Principle Violation
// This class has multiple responsibilities: order validation, pricing, payment processing,
// inventory management, email notifications, and database operations

package com.solidpatterns.complex.srp.bad

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

class ComplexOrderProcessor {
    // ❌ Responsibility 1: Order Validation
    fun validateOrder(order: ComplexOrder): Boolean {
        if (order.items.isEmpty()) {
            println("❌ Order validation failed: No items in order")
            return false
        }
        
        // Check if customer exists
        if (!checkCustomerExists(order.customerId)) {
            println("❌ Order validation failed: Customer not found")
            return false
        }
        
        // Validate shipping address
        if (order.shippingAddress.isBlank()) {
            println("❌ Order validation failed: Invalid shipping address")
            return false
        }
        
        return true
    }
    
    private fun checkCustomerExists(customerId: String): Boolean {
        // Simulate database check
        return customerId.isNotBlank()
    }
    
    // ❌ Responsibility 2: Price Calculation
    fun calculateTotalPrice(order: ComplexOrder): Double {
        var subtotal = order.items.sumOf { it.price * it.quantity }
        
        // Apply discounts
        if (order.items.size > 5) {
            subtotal *= 0.9 // 10% discount for orders with more than 5 items
        }
        
        // Calculate tax
        val tax = subtotal * 0.08 // 8% tax
        
        // Calculate shipping
        val shipping = calculateShippingCost(order.items.size)
        
        return subtotal + tax + shipping
    }
    
    private fun calculateShippingCost(itemCount: Int): Double {
        return when {
            itemCount <= 3 -> 5.0
            itemCount <= 10 -> 10.0
            else -> 15.0
        }
    }
    
    // ❌ Responsibility 3: Payment Processing
    fun processPayment(order: ComplexOrder, totalAmount: Double): Boolean {
        println("Processing payment of $$totalAmount using ${order.paymentMethod}")
        
        return when (order.paymentMethod) {
            "credit_card" -> processCreditCardPayment(order.customerId, totalAmount)
            "paypal" -> processPayPalPayment(order.customerId, totalAmount)
            "bank_transfer" -> processBankTransfer(order.customerId, totalAmount)
            else -> {
                println("❌ Unsupported payment method: ${order.paymentMethod}")
                false
            }
        }
    }
    
    private fun processCreditCardPayment(customerId: String, amount: Double): Boolean {
        // Simulate credit card processing
        println("Processing credit card payment...")
        return true
    }
    
    private fun processPayPalPayment(customerId: String, amount: Double): Boolean {
        // Simulate PayPal processing
        println("Processing PayPal payment...")
        return true
    }
    
    private fun processBankTransfer(customerId: String, amount: Double): Boolean {
        // Simulate bank transfer
        println("Processing bank transfer...")
        return true
    }
    
    // ❌ Responsibility 4: Inventory Management
    fun updateInventory(order: ComplexOrder): Boolean {
        println("Updating inventory for order ${order.id}")
        
        for (item in order.items) {
            val currentStock = getCurrentStock(item.productId)
            if (currentStock < item.quantity) {
                println("❌ Insufficient stock for product ${item.productId}")
                return false
            }
            
            decreaseStock(item.productId, item.quantity)
            println("Reduced stock for product ${item.productId} by ${item.quantity}")
        }
        
        return true
    }
    
    private fun getCurrentStock(productId: String): Int {
        // Simulate database query
        return 100 // Mock stock
    }
    
    private fun decreaseStock(productId: String, quantity: Int) {
        // Simulate database update
        println("Decreasing stock for $productId by $quantity")
    }
    
    // ❌ Responsibility 5: Email Notifications
    fun sendOrderConfirmationEmail(order: ComplexOrder, totalAmount: Double) {
        val customerEmail = getCustomerEmail(order.customerId)
        val emailContent = """
            Dear Customer,
            
            Your order #${order.id} has been confirmed.
            Total amount: $$totalAmount
            Shipping address: ${order.shippingAddress}
            
            Thank you for your purchase!
        """.trimIndent()
        
        sendEmail(customerEmail, "Order Confirmation - Order #${order.id}", emailContent)
        println("Order confirmation email sent to $customerEmail")
    }
    
    private fun getCustomerEmail(customerId: String): String {
        // Simulate database query
        return "customer$customerId@example.com"
    }
    
    private fun sendEmail(to: String, subject: String, body: String) {
        // Simulate email sending
        println("Sending email to $to with subject: $subject")
    }
    
    // ❌ Responsibility 6: Database Operations
    fun saveOrderToDatabase(order: ComplexOrder, totalAmount: Double) {
        println("Saving order ${order.id} to database")
        // Simulate database insert
        println("Order saved: ID=${order.id}, Customer=${order.customerId}, Total=$$totalAmount")
    }
    
    // ❌ This method does EVERYTHING - violates SRP
    fun processOrder(order: ComplexOrder): Boolean {
        // Step 1: Validate
        if (!validateOrder(order)) {
            return false
        }
        
        // Step 2: Calculate price
        val totalPrice = calculateTotalPrice(order)
        println("Total price calculated: $$totalPrice")
        
        // Step 3: Check inventory
        if (!updateInventory(order)) {
            return false
        }
        
        // Step 4: Process payment
        if (!processPayment(order, totalPrice)) {
            // Rollback inventory
            rollbackInventory(order)
            return false
        }
        
        // Step 5: Save to database
        saveOrderToDatabase(order, totalPrice)
        
        // Step 6: Send email
        sendOrderConfirmationEmail(order, totalPrice)
        
        println("✅ Order ${order.id} processed successfully")
        return true
    }
    
    private fun rollbackInventory(order: ComplexOrder) {
        println("Rolling back inventory changes for order ${order.id}")
        // Simulate rollback
    }
}

fun main() {
    val processor = ComplexOrderProcessor()
    
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
    
    processor.processOrder(order)
}

