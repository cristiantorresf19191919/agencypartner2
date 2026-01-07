// ✅ GOOD EXAMPLE: Dependency Inversion Principle Applied
// High-level modules depend on abstractions (interfaces)
// Low-level modules implement abstractions
// Both depend on abstractions, not concrete implementations

package com.solidpatterns.complex.dip.good

data class LogEntry(
    val level: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class NotificationMessage(
    val recipient: String,
    val subject: String,
    val body: String,
    val priority: String
)

// ✅ Abstraction (interface) - high level
interface Logger {
    fun log(entry: LogEntry)
}

interface NotificationSender {
    fun send(notification: NotificationMessage): Boolean
}

// ✅ Low-level module: Concrete implementation of abstraction
class FileLoggerGood : Logger {
    override fun log(entry: LogEntry) {
        // Simulate file writing
        println("FILE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}")
        // In real implementation: write to file
    }
    
    fun close() {
        println("File logger closed")
    }
}

class ConsoleLoggerGood : Logger {
    override fun log(entry: LogEntry) {
        println("CONSOLE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}")
    }
}

class DatabaseLoggerGood : Logger {
    override fun log(entry: LogEntry) {
        println("DATABASE LOGGER: Saving log entry [${entry.level}] ${entry.message} to database")
        // In real implementation: INSERT INTO logs ...
    }
    
    fun connect() {
        println("Connecting to database for logging")
    }
    
    fun disconnect() {
        println("Disconnecting from database")
    }
}

// ✅ Composite logger - implements Logger interface
class CompositeLoggerGood(private val loggers: List<Logger>) : Logger {
    override fun log(entry: LogEntry) {
        loggers.forEach { it.log(entry) }
    }
}

// ✅ Low-level module: Concrete implementation of abstraction
class EmailNotificationServiceGood : NotificationSender {
    override fun send(notification: NotificationMessage): Boolean {
        println("EMAIL SERVICE: Sending email to ${notification.recipient}")
        println("Subject: ${notification.subject}")
        println("Body: ${notification.body}")
        // In real implementation: SMTP connection, send email
        return true
    }
    
    fun validateEmail(email: String): Boolean {
        return email.contains("@")
    }
}

class SMSNotificationServiceGood : NotificationSender {
    override fun send(notification: NotificationMessage): Boolean {
        println("SMS SERVICE: Sending SMS to ${notification.recipient}")
        println("Message: ${notification.body}")
        // In real implementation: SMS gateway API call
        return true
    }
    
    fun validatePhoneNumber(phone: String): Boolean {
        return phone.length >= 10
    }
}

class PushNotificationServiceGood : NotificationSender {
    override fun send(notification: NotificationMessage): Boolean {
        println("PUSH SERVICE: Sending push notification to device ${notification.recipient}")
        println("Title: ${notification.subject}")
        println("Body: ${notification.body}")
        // In real implementation: Firebase/APNs API call
        return true
    }
    
    fun registerDevice(deviceId: String) {
        println("Registering device: $deviceId")
    }
}

// ✅ Composite notification sender - implements NotificationSender interface
class CompositeNotificationSenderGood(
    private val senders: List<NotificationSender>
) : NotificationSender {
    override fun send(notification: NotificationMessage): Boolean {
        var allSuccess = true
        senders.forEach { sender ->
            val success = sender.send(notification)
            if (!success) allSuccess = false
        }
        return allSuccess
    }
}

// ✅ High-level module: Depends on abstraction, not concrete implementation
class ApplicationServiceGood(
    private val logger: Logger, // ✅ Depends on abstraction
    private val notificationSender: NotificationSender // ✅ Depends on abstraction
) {
    fun processUserRegistration(username: String, email: String) {
        // ✅ Uses abstraction
        logger.log(LogEntry("INFO", "User registration started: $username"))
        
        // Business logic
        println("Processing user registration for $username")
        
        // ✅ Uses abstraction
        notificationSender.send(
            NotificationMessage(
                recipient = email,
                subject = "Welcome!",
                body = "Thank you for registering, $username!",
                priority = "NORMAL"
            )
        )
        
        logger.log(LogEntry("INFO", "User registration completed: $username"))
    }
    
    fun processOrder(orderId: String, customerEmail: String) {
        logger.log(LogEntry("INFO", "Order processing started: $orderId"))
        
        // Business logic
        println("Processing order $orderId")
        
        notificationSender.send(
            NotificationMessage(
                recipient = customerEmail,
                subject = "Order Confirmation",
                body = "Your order $orderId has been confirmed.",
                priority = "NORMAL"
            )
        )
        
        logger.log(LogEntry("INFO", "Order processing completed: $orderId"))
    }
}

// ✅ High-level module: Depends on abstraction
class MonitoringServiceGood(
    private val logger: Logger // ✅ Depends on abstraction
) {
    fun monitorSystemHealth() {
        logger.log(LogEntry("INFO", "System health check started"))
        
        // Business logic
        println("Checking system health...")
        
        logger.log(LogEntry("INFO", "System health check completed"))
    }
}

// ✅ High-level module: Depends on abstraction
class AlertServiceGood(
    private val notificationSender: NotificationSender // ✅ Depends on abstraction
) {
    fun sendCriticalAlert(recipient: String, message: String) {
        // ✅ Uses abstraction - can be any NotificationSender implementation
        notificationSender.send(
            NotificationMessage(
                recipient = recipient,
                subject = "CRITICAL ALERT",
                body = message,
                priority = "HIGH"
            )
        )
    }
}

fun main() {
    // ✅ Dependency injection: High-level modules receive abstractions
    val fileLogger = FileLoggerGood()
    val consoleLogger = ConsoleLoggerGood()
    val compositeLogger = CompositeLoggerGood(listOf(fileLogger, consoleLogger))
    
    val emailService = EmailNotificationServiceGood()
    
    // ✅ ApplicationService receives abstractions
    val appService = ApplicationServiceGood(compositeLogger, emailService)
    appService.processUserRegistration("john_doe", "john@example.com")
    
    // ✅ MonitoringService receives abstraction
    val databaseLogger = DatabaseLoggerGood()
    databaseLogger.connect()
    val monitoringService = MonitoringServiceGood(databaseLogger)
    monitoringService.monitorSystemHealth()
    databaseLogger.disconnect()
    
    // ✅ AlertService receives abstraction - can use composite sender
    val smsService = SMSNotificationServiceGood()
    val pushService = PushNotificationServiceGood()
    val compositeSender = CompositeNotificationSenderGood(
        listOf(emailService, smsService, pushService)
    )
    val alertService = AlertServiceGood(compositeSender)
    alertService.sendCriticalAlert("admin@example.com", "System overload detected")
    
    // ✅ To change logging from file to database, just inject DatabaseLoggerGood
    // ✅ To add Slack notifications, create SlackNotificationServiceGood implementing NotificationSender
    // ✅ High-level modules never need to change - they depend on abstractions
}

