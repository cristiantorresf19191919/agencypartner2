// ❌ BAD EXAMPLE: Open/Closed Principle Violation
// Adding new payment methods requires modifying the PaymentProcessor class
// The class is not closed for modification when new payment types are needed

package com.solidpatterns.complex.ocp.bad

data class PaymentRequest(
    val amount: Double,
    val currency: String,
    val customerId: String,
    val paymentMethod: String,
    val paymentDetails: Map<String, String>
)

data class PaymentResponse(
    val success: Boolean,
    val transactionId: String?,
    val message: String,
    val fees: Double
)

class ComplexPaymentProcessor {
    // ❌ Every new payment method requires modifying this method
    fun processPayment(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.paymentMethod, request.amount)
        val totalAmount = request.amount + fees
        
        return when (request.paymentMethod) {
            "credit_card" -> {
                // ❌ Hard-coded logic for credit card
                val cardNumber = request.paymentDetails["cardNumber"] ?: ""
                val expiryDate = request.paymentDetails["expiryDate"] ?: ""
                val cvv = request.paymentDetails["cvv"] ?: ""
                
                if (cardNumber.length != 16 || cvv.length != 3) {
                    return PaymentResponse(
                        success = false,
                        transactionId = null,
                        message = "Invalid credit card details",
                        fees = fees
                    )
                }
                
                val transactionId = "CC-${System.currentTimeMillis()}"
                println("Processing credit card payment: $cardNumber, Amount: $totalAmount")
                
                PaymentResponse(
                    success = true,
                    transactionId = transactionId,
                    message = "Credit card payment processed",
                    fees = fees
                )
            }
            
            "paypal" -> {
                // ❌ Hard-coded logic for PayPal
                val paypalEmail = request.paymentDetails["email"] ?: ""
                
                if (!paypalEmail.contains("@")) {
                    return PaymentResponse(
                        success = false,
                        transactionId = null,
                        message = "Invalid PayPal email",
                        fees = fees
                    )
                }
                
                val transactionId = "PP-${System.currentTimeMillis()}"
                println("Processing PayPal payment: $paypalEmail, Amount: $totalAmount")
                
                PaymentResponse(
                    success = true,
                    transactionId = transactionId,
                    message = "PayPal payment processed",
                    fees = fees
                )
            }
            
            "bank_transfer" -> {
                // ❌ Hard-coded logic for bank transfer
                val accountNumber = request.paymentDetails["accountNumber"] ?: ""
                val routingNumber = request.paymentDetails["routingNumber"] ?: ""
                
                if (accountNumber.length < 8 || routingNumber.length != 9) {
                    return PaymentResponse(
                        success = false,
                        transactionId = null,
                        message = "Invalid bank account details",
                        fees = fees
                    )
                }
                
                val transactionId = "BT-${System.currentTimeMillis()}"
                println("Processing bank transfer: $accountNumber, Amount: $totalAmount")
                
                PaymentResponse(
                    success = true,
                    transactionId = transactionId,
                    message = "Bank transfer processed",
                    fees = fees
                )
            }
            
            "cryptocurrency" -> {
                // ❌ Adding cryptocurrency requires modifying this class
                val walletAddress = request.paymentDetails["walletAddress"] ?: ""
                val cryptoType = request.paymentDetails["cryptoType"] ?: "BTC"
                
                if (walletAddress.length < 26) {
                    return PaymentResponse(
                        success = false,
                        transactionId = null,
                        message = "Invalid wallet address",
                        fees = fees
                    )
                }
                
                val transactionId = "CRYPTO-${System.currentTimeMillis()}"
                println("Processing cryptocurrency payment: $cryptoType, Address: $walletAddress, Amount: $totalAmount")
                
                PaymentResponse(
                    success = true,
                    transactionId = transactionId,
                    message = "Cryptocurrency payment processed",
                    fees = fees
                )
            }
            
            else -> {
                PaymentResponse(
                    success = false,
                    transactionId = null,
                    message = "Unsupported payment method: ${request.paymentMethod}",
                    fees = 0.0
                )
            }
        }
    }
    
    // ❌ Fee calculation logic also needs modification for each new payment type
    private fun calculateFees(paymentMethod: String, amount: Double): Double {
        return when (paymentMethod) {
            "credit_card" -> amount * 0.029 + 0.30 // 2.9% + $0.30
            "paypal" -> amount * 0.034 + 0.30 // 3.4% + $0.30
            "bank_transfer" -> 5.0 // Flat $5 fee
            "cryptocurrency" -> amount * 0.01 // 1% fee
            else -> 0.0
        }
    }
    
    // ❌ Refund logic also requires modification
    fun processRefund(transactionId: String, amount: Double, paymentMethod: String): Boolean {
        return when (paymentMethod) {
            "credit_card" -> {
                println("Refunding credit card transaction: $transactionId, Amount: $amount")
                true
            }
            "paypal" -> {
                println("Refunding PayPal transaction: $transactionId, Amount: $amount")
                true
            }
            "bank_transfer" -> {
                println("Refunding bank transfer: $transactionId, Amount: $amount")
                true
            }
            "cryptocurrency" -> {
                println("Refunding cryptocurrency: $transactionId, Amount: $amount")
                true
            }
            else -> false
        }
    }
}

fun main() {
    val processor = ComplexPaymentProcessor()
    
    // Credit card payment
    val creditCardRequest = PaymentRequest(
        amount = 100.0,
        currency = "USD",
        customerId = "CUST-123",
        paymentMethod = "credit_card",
        paymentDetails = mapOf(
            "cardNumber" to "1234567890123456",
            "expiryDate" to "12/25",
            "cvv" to "123"
        )
    )
    
    val creditCardResponse = processor.processPayment(creditCardRequest)
    println("Credit Card Payment: ${creditCardResponse.message}, Transaction: ${creditCardResponse.transactionId}")
    
    // PayPal payment
    val paypalRequest = PaymentRequest(
        amount = 50.0,
        currency = "USD",
        customerId = "CUST-123",
        paymentMethod = "paypal",
        paymentDetails = mapOf("email" to "customer@example.com")
    )
    
    val paypalResponse = processor.processPayment(paypalRequest)
    println("PayPal Payment: ${paypalResponse.message}, Transaction: ${paypalResponse.transactionId}")
    
    // ❌ To add a new payment method like "Apple Pay", we MUST modify the ComplexPaymentProcessor class
    // This violates the Open/Closed Principle
}

