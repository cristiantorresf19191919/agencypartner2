// ❌ BAD EXAMPLE: Dependency Inversion Principle Violation
// High-level modules depend directly on low-level concrete implementations
// Changes to low-level modules require changes to high-level modules

package com.solidpatterns.complex.dip.bad

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

// ❌ Low-level module: Concrete implementation
class FileLoggerBad {
    fun log(entry: LogEntry) {
        // Simulate file writing
        println("FILE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}")
        // In real implementation: write to file
    }
    
    fun close() {
        println("File logger closed")
    }
}

class ConsoleLoggerBad {
    fun log(entry: LogEntry) {
        // Direct console output
        println("CONSOLE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}")
    }
}

class DatabaseLoggerBad {
    fun saveLog(entry: LogEntry) {
        // Simulate database insert
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

// ❌ Low-level module: Concrete implementation
class EmailNotificationServiceBad {
    fun sendEmail(recipient: String, subject: String, body: String) {
        // Simulate email sending
        println("EMAIL SERVICE: Sending email to $recipient")
        println("Subject: $subject")
        println("Body: $body")
        // In real implementation: SMTP connection, send email
    }
    
    fun validateEmail(email: String): Boolean {
        return email.contains("@")
    }
}

class SMSNotificationServiceBad {
    fun sendSMS(phoneNumber: String, message: String) {
        // Simulate SMS sending
        println("SMS SERVICE: Sending SMS to $phoneNumber")
        println("Message: $message")
        // In real implementation: SMS gateway API call
    }
    
    fun validatePhoneNumber(phone: String): Boolean {
        return phone.length >= 10
    }
}

class PushNotificationServiceBad {
    fun sendPushNotification(deviceId: String, title: String, body: String) {
        // Simulate push notification
        println("PUSH SERVICE: Sending push notification to device $deviceId")
        println("Title: $title")
        println("Body: $body")
        // In real implementation: Firebase/APNs API call
    }
    
    fun registerDevice(deviceId: String) {
        println("Registering device: $deviceId")
    }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class ApplicationServiceBad {
    // ❌ Tight coupling to concrete implementations
    private val fileLogger = FileLoggerBad()
    private val emailService = EmailNotificationServiceBad()
    
    fun processUserRegistration(username: String, email: String) {
        // ❌ Direct dependency on FileLoggerBad
        fileLogger.log(LogEntry("INFO", "User registration started: $username"))
        
        // Business logic
        println("Processing user registration for $username")
        
        // ❌ Direct dependency on EmailNotificationServiceBad
        emailService.sendEmail(
            email,
            "Welcome!",
            "Thank you for registering, $username!"
        )
        
        fileLogger.log(LogEntry("INFO", "User registration completed: $username"))
    }
    
    fun processOrder(orderId: String, customerEmail: String) {
        fileLogger.log(LogEntry("INFO", "Order processing started: $orderId"))
        
        // Business logic
        println("Processing order $orderId")
        
        emailService.sendEmail(
            customerEmail,
            "Order Confirmation",
            "Your order $orderId has been confirmed."
        )
        
        fileLogger.log(LogEntry("INFO", "Order processing completed: $orderId"))
    }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class MonitoringServiceBad {
    // ❌ Tight coupling to ConsoleLoggerBad and DatabaseLoggerBad
    private val consoleLogger = ConsoleLoggerBad()
    private val databaseLogger = DatabaseLoggerBad()
    
    init {
        databaseLogger.connect()
    }
    
    fun monitorSystemHealth() {
        consoleLogger.log(LogEntry("INFO", "System health check started"))
        databaseLogger.saveLog(LogEntry("INFO", "System health check started"))
        
        // Business logic
        println("Checking system health...")
        
        consoleLogger.log(LogEntry("INFO", "System health check completed"))
        databaseLogger.saveLog(LogEntry("INFO", "System health check completed"))
    }
    
    fun cleanup() {
        databaseLogger.disconnect()
    }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class AlertServiceBad {
    // ❌ Tight coupling to multiple concrete implementations
    private val emailService = EmailNotificationServiceBad()
    private val smsService = SMSNotificationServiceBad()
    private val pushService = PushNotificationServiceBad()
    
    fun sendCriticalAlert(recipient: String, message: String) {
        // ❌ Direct dependencies on concrete services
        emailService.sendEmail(recipient, "CRITICAL ALERT", message)
        smsService.sendSMS(recipient, message)
        pushService.sendPushNotification(recipient, "ALERT", message)
    }
}

fun main() {
    // ❌ High-level modules are tightly coupled to low-level implementations
    val appService = ApplicationServiceBad()
    appService.processUserRegistration("john_doe", "john@example.com")
    
    val monitoringService = MonitoringServiceBad()
    monitoringService.monitorSystemHealth()
    monitoringService.cleanup()
    
    val alertService = AlertServiceBad()
    alertService.sendCriticalAlert("admin@example.com", "System overload detected")
    
    // ❌ To change logging from file to database, we must modify ApplicationServiceBad
    // ❌ To add Slack notifications, we must modify AlertServiceBad
    // ❌ High-level modules depend on low-level modules - violates DIP
}

