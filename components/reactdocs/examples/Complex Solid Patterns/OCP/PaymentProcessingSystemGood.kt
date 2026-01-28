// ✅ GOOD EXAMPLE: Open/Closed Principle Applied
// New payment methods can be added by creating new classes implementing the PaymentMethod interface
// The PaymentProcessor class remains closed for modification but open for extension

package com.solidpatterns.complex.ocp.good

data class PaymentRequest(
    val amount: Double,
    val currency: String,
    val customerId: String,
    val paymentDetails: Map<String, String>
)

data class PaymentResponse(
    val success: Boolean,
    val transactionId: String?,
    val message: String,
    val fees: Double
)

// ✅ Abstraction - closed for modification
interface PaymentMethod {
    fun process(request: PaymentRequest): PaymentResponse
    fun calculateFees(amount: Double): Double
    fun processRefund(transactionId: String, amount: Double): Boolean
    fun validateDetails(details: Map<String, String>): Boolean
}

// ✅ Extension 1: Credit Card Payment - open for extension
class CreditCardPaymentMethod : PaymentMethod {
    override fun process(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.amount)
        val totalAmount = request.amount + fees
        
        if (!validateDetails(request.paymentDetails)) {
            return PaymentResponse(
                success = false,
                transactionId = null,
                message = "Invalid credit card details",
                fees = fees
            )
        }
        
        val cardNumber = request.paymentDetails["cardNumber"] ?: ""
        val transactionId = "CC-${System.currentTimeMillis()}"
        println("Processing credit card payment: $cardNumber, Amount: $totalAmount")
        
        return PaymentResponse(
            success = true,
            transactionId = transactionId,
            message = "Credit card payment processed",
            fees = fees
        )
    }
    
    override fun calculateFees(amount: Double): Double {
        return amount * 0.029 + 0.30 // 2.9% + $0.30
    }
    
    override fun processRefund(transactionId: String, amount: Double): Boolean {
        println("Refunding credit card transaction: $transactionId, Amount: $amount")
        return true
    }
    
    override fun validateDetails(details: Map<String, String>): Boolean {
        val cardNumber = details["cardNumber"] ?: ""
        val cvv = details["cvv"] ?: ""
        return cardNumber.length == 16 && cvv.length == 3
    }
}

// ✅ Extension 2: PayPal Payment - open for extension
class PayPalPaymentMethod : PaymentMethod {
    override fun process(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.amount)
        val totalAmount = request.amount + fees
        
        if (!validateDetails(request.paymentDetails)) {
            return PaymentResponse(
                success = false,
                transactionId = null,
                message = "Invalid PayPal email",
                fees = fees
            )
        }
        
        val paypalEmail = request.paymentDetails["email"] ?: ""
        val transactionId = "PP-${System.currentTimeMillis()}"
        println("Processing PayPal payment: $paypalEmail, Amount: $totalAmount")
        
        return PaymentResponse(
            success = true,
            transactionId = transactionId,
            message = "PayPal payment processed",
            fees = fees
        )
    }
    
    override fun calculateFees(amount: Double): Double {
        return amount * 0.034 + 0.30 // 3.4% + $0.30
    }
    
    override fun processRefund(transactionId: String, amount: Double): Boolean {
        println("Refunding PayPal transaction: $transactionId, Amount: $amount")
        return true
    }
    
    override fun validateDetails(details: Map<String, String>): Boolean {
        val email = details["email"] ?: ""
        return email.contains("@") && email.contains(".")
    }
}

// ✅ Extension 3: Bank Transfer Payment - open for extension
class BankTransferPaymentMethod : PaymentMethod {
    override fun process(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.amount)
        val totalAmount = request.amount + fees
        
        if (!validateDetails(request.paymentDetails)) {
            return PaymentResponse(
                success = false,
                transactionId = null,
                message = "Invalid bank account details",
                fees = fees
            )
        }
        
        val accountNumber = request.paymentDetails["accountNumber"] ?: ""
        val transactionId = "BT-${System.currentTimeMillis()}"
        println("Processing bank transfer: $accountNumber, Amount: $totalAmount")
        
        return PaymentResponse(
            success = true,
            transactionId = transactionId,
            message = "Bank transfer processed",
            fees = fees
        )
    }
    
    override fun calculateFees(amount: Double): Double {
        return 5.0 // Flat $5 fee
    }
    
    override fun processRefund(transactionId: String, amount: Double): Boolean {
        println("Refunding bank transfer: $transactionId, Amount: $amount")
        return true
    }
    
    override fun validateDetails(details: Map<String, String>): Boolean {
        val accountNumber = details["accountNumber"] ?: ""
        val routingNumber = details["routingNumber"] ?: ""
        return accountNumber.length >= 8 && routingNumber.length == 9
    }
}

// ✅ Extension 4: Cryptocurrency Payment - open for extension (NEW, no modification needed!)
class CryptocurrencyPaymentMethod : PaymentMethod {
    override fun process(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.amount)
        val totalAmount = request.amount + fees
        
        if (!validateDetails(request.paymentDetails)) {
            return PaymentResponse(
                success = false,
                transactionId = null,
                message = "Invalid wallet address",
                fees = fees
            )
        }
        
        val walletAddress = request.paymentDetails["walletAddress"] ?: ""
        val cryptoType = request.paymentDetails["cryptoType"] ?: "BTC"
        val transactionId = "CRYPTO-${System.currentTimeMillis()}"
        println("Processing cryptocurrency payment: $cryptoType, Address: $walletAddress, Amount: $totalAmount")
        
        return PaymentResponse(
            success = true,
            transactionId = transactionId,
            message = "Cryptocurrency payment processed",
            fees = fees
        )
    }
    
    override fun calculateFees(amount: Double): Double {
        return amount * 0.01 // 1% fee
    }
    
    override fun processRefund(transactionId: String, amount: Double): Boolean {
        println("Refunding cryptocurrency: $transactionId, Amount: $amount")
        return true
    }
    
    override fun validateDetails(details: Map<String, String>): Boolean {
        val walletAddress = details["walletAddress"] ?: ""
        return walletAddress.length >= 26
    }
}

// ✅ Extension 5: Apple Pay Payment - open for extension (NEW, no modification needed!)
class ApplePayPaymentMethod : PaymentMethod {
    override fun process(request: PaymentRequest): PaymentResponse {
        val fees = calculateFees(request.amount)
        val totalAmount = request.amount + fees
        
        if (!validateDetails(request.paymentDetails)) {
            return PaymentResponse(
                success = false,
                transactionId = null,
                message = "Invalid Apple Pay token",
                fees = fees
            )
        }
        
        val token = request.paymentDetails["token"] ?: ""
        val transactionId = "AP-${System.currentTimeMillis()}"
        println("Processing Apple Pay payment: Token: $token, Amount: $totalAmount")
        
        return PaymentResponse(
            success = true,
            transactionId = transactionId,
            message = "Apple Pay payment processed",
            fees = fees
        )
    }
    
    override fun calculateFees(amount: Double): Double {
        return amount * 0.025 + 0.25 // 2.5% + $0.25
    }
    
    override fun processRefund(transactionId: String, amount: Double): Boolean {
        println("Refunding Apple Pay transaction: $transactionId, Amount: $amount")
        return true
    }
    
    override fun validateDetails(details: Map<String, String>): Boolean {
        val token = details["token"] ?: ""
        return token.isNotBlank() && token.length >= 32
    }
}

// ✅ Payment Processor - closed for modification
class PaymentProcessorFactory {
    fun createPaymentMethod(methodType: String): PaymentMethod {
        return when (methodType) {
            "credit_card" -> CreditCardPaymentMethod()
            "paypal" -> PayPalPaymentMethod()
            "bank_transfer" -> BankTransferPaymentMethod()
            "cryptocurrency" -> CryptocurrencyPaymentMethod()
            "apple_pay" -> ApplePayPaymentMethod()
            else -> throw IllegalArgumentException("Unsupported payment method: $methodType")
        }
    }
}

class PaymentProcessingService {
    private val factory = PaymentProcessorFactory()
    
    // ✅ This method never needs to change when adding new payment methods
    fun processPayment(request: PaymentRequest, paymentMethodType: String): PaymentResponse {
        val paymentMethod = factory.createPaymentMethod(paymentMethodType)
        return paymentMethod.process(request)
    }
    
    fun processRefund(transactionId: String, amount: Double, paymentMethodType: String): Boolean {
        val paymentMethod = factory.createPaymentMethod(paymentMethodType)
        return paymentMethod.processRefund(transactionId, amount)
    }
}

fun main() {
    val paymentService = PaymentProcessingService()
    
    // Credit card payment
    val creditCardRequest = PaymentRequest(
        amount = 100.0,
        currency = "USD",
        customerId = "CUST-123",
        paymentDetails = mapOf(
            "cardNumber" to "1234567890123456",
            "expiryDate" to "12/25",
            "cvv" to "123"
        )
    )
    
    val creditCardResponse = paymentService.processPayment(creditCardRequest, "credit_card")
    println("Credit Card Payment: ${creditCardResponse.message}, Transaction: ${creditCardResponse.transactionId}")
    
    // PayPal payment
    val paypalRequest = PaymentRequest(
        amount = 50.0,
        currency = "USD",
        customerId = "CUST-123",
        paymentDetails = mapOf("email" to "customer@example.com")
    )
    
    val paypalResponse = paymentService.processPayment(paypalRequest, "paypal")
    println("PayPal Payment: ${paypalResponse.message}, Transaction: ${paypalResponse.transactionId}")
    
    // ✅ Adding Apple Pay - NO modification to PaymentProcessingService needed!
    val applePayRequest = PaymentRequest(
        amount = 75.0,
        currency = "USD",
        customerId = "CUST-123",
        paymentDetails = mapOf("token" to "applepay_token_12345678901234567890123456789012")
    )
    
    val applePayResponse = paymentService.processPayment(applePayRequest, "apple_pay")
    println("Apple Pay Payment: ${applePayResponse.message}, Transaction: ${applePayResponse.transactionId}")
    
    // ✅ The system is OPEN for extension (new payment methods) but CLOSED for modification (PaymentProcessingService)
}

