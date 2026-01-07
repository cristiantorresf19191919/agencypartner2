// ❌ BAD EXAMPLE: Dependency Inversion Principle Violation
// High-level modules depend directly on low-level concrete implementations
// Changes to low-level modules require changes to high-level modules

interface LogEntry {
  level: string;
  message: string;
  timestamp: number;
}

interface NotificationMessage {
  recipient: string;
  subject: string;
  body: string;
  priority: string;
}

// ❌ Low-level module: Concrete implementation
class FileLoggerBad {
  log(entry: LogEntry): void {
    // Simulate file writing
    console.log(
      `FILE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}`
    );
    // In real implementation: write to file
  }

  close(): void {
    console.log("File logger closed");
  }
}

class ConsoleLoggerBad {
  log(entry: LogEntry): void {
    // Direct console output
    console.log(
      `CONSOLE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}`
    );
  }
}

class DatabaseLoggerBad {
  saveLog(entry: LogEntry): void {
    // Simulate database insert
    console.log(
      `DATABASE LOGGER: Saving log entry [${entry.level}] ${entry.message} to database`
    );
    // In real implementation: INSERT INTO logs ...
  }

  connect(): void {
    console.log("Connecting to database for logging");
  }

  disconnect(): void {
    console.log("Disconnecting from database");
  }
}

// ❌ Low-level module: Concrete implementation
class EmailNotificationServiceBad {
  sendEmail(recipient: string, subject: string, body: string): void {
    // Simulate email sending
    console.log(`EMAIL SERVICE: Sending email to ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    // In real implementation: SMTP connection, send email
  }

  validateEmail(email: string): boolean {
    return email.includes("@");
  }
}

class SMSNotificationServiceBad {
  sendSMS(phoneNumber: string, message: string): void {
    // Simulate SMS sending
    console.log(`SMS SERVICE: Sending SMS to ${phoneNumber}`);
    console.log(`Message: ${message}`);
    // In real implementation: SMS gateway API call
  }

  validatePhoneNumber(phone: string): boolean {
    return phone.length >= 10;
  }
}

class PushNotificationServiceBad {
  sendPushNotification(deviceId: string, title: string, body: string): void {
    // Simulate push notification
    console.log(`PUSH SERVICE: Sending push notification to device ${deviceId}`);
    console.log(`Title: ${title}`);
    console.log(`Body: ${body}`);
    // In real implementation: Firebase/APNs API call
  }

  registerDevice(deviceId: string): void {
    console.log(`Registering device: ${deviceId}`);
  }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class ApplicationServiceBad {
  // ❌ Tight coupling to concrete implementations
  private fileLogger = new FileLoggerBad();
  private emailService = new EmailNotificationServiceBad();

  processUserRegistration(username: string, email: string): void {
    // ❌ Direct dependency on FileLoggerBad
    this.fileLogger.log({
      level: "INFO",
      message: `User registration started: ${username}`,
      timestamp: Date.now(),
    });

    // Business logic
    console.log(`Processing user registration for ${username}`);

    // ❌ Direct dependency on EmailNotificationServiceBad
    this.emailService.sendEmail(email, "Welcome!", `Thank you for registering, ${username}!`);

    this.fileLogger.log({
      level: "INFO",
      message: `User registration completed: ${username}`,
      timestamp: Date.now(),
    });
  }

  processOrder(orderId: string, customerEmail: string): void {
    this.fileLogger.log({
      level: "INFO",
      message: `Order processing started: ${orderId}`,
      timestamp: Date.now(),
    });

    // Business logic
    console.log(`Processing order ${orderId}`);

    this.emailService.sendEmail(
      customerEmail,
      "Order Confirmation",
      `Your order ${orderId} has been confirmed.`
    );

    this.fileLogger.log({
      level: "INFO",
      message: `Order processing completed: ${orderId}`,
      timestamp: Date.now(),
    });
  }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class MonitoringServiceBad {
  // ❌ Tight coupling to ConsoleLoggerBad and DatabaseLoggerBad
  private consoleLogger = new ConsoleLoggerBad();
  private databaseLogger = new DatabaseLoggerBad();

  constructor() {
    this.databaseLogger.connect();
  }

  monitorSystemHealth(): void {
    this.consoleLogger.log({
      level: "INFO",
      message: "System health check started",
      timestamp: Date.now(),
    });
    this.databaseLogger.saveLog({
      level: "INFO",
      message: "System health check started",
      timestamp: Date.now(),
    });

    // Business logic
    console.log("Checking system health...");

    this.consoleLogger.log({
      level: "INFO",
      message: "System health check completed",
      timestamp: Date.now(),
    });
    this.databaseLogger.saveLog({
      level: "INFO",
      message: "System health check completed",
      timestamp: Date.now(),
    });
  }

  cleanup(): void {
    this.databaseLogger.disconnect();
  }
}

// ❌ High-level module: Directly depends on concrete low-level classes
class AlertServiceBad {
  // ❌ Tight coupling to multiple concrete implementations
  private emailService = new EmailNotificationServiceBad();
  private smsService = new SMSNotificationServiceBad();
  private pushService = new PushNotificationServiceBad();

  sendCriticalAlert(recipient: string, message: string): void {
    // ❌ Direct dependencies on concrete services
    this.emailService.sendEmail(recipient, "CRITICAL ALERT", message);
    this.smsService.sendSMS(recipient, message);
    this.pushService.sendPushNotification(recipient, "ALERT", message);
  }
}

export function NotificationLoggerSystemBad() {
  const handleUserRegistration = () => {
    // ❌ High-level modules are tightly coupled to low-level implementations
    const appService = new ApplicationServiceBad();
    appService.processUserRegistration("john_doe", "john@example.com");
  };

  const handleMonitoring = () => {
    const monitoringService = new MonitoringServiceBad();
    monitoringService.monitorSystemHealth();
    monitoringService.cleanup();
  };

  const handleAlert = () => {
    const alertService = new AlertServiceBad();
    alertService.sendCriticalAlert("admin@example.com", "System overload detected");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bad: Violating DIP</h2>
      <p className="mb-4 text-gray-600">
        High-level modules (ApplicationService, MonitoringService, AlertService)
        depend directly on low-level concrete implementations. To change logging
        from file to database, we must modify ApplicationService. This violates
        the Dependency Inversion Principle.
      </p>
      <div className="space-x-2">
        <button
          onClick={handleUserRegistration}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test User Registration (Check Console)
        </button>
        <button
          onClick={handleMonitoring}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Monitoring (Check Console)
        </button>
        <button
          onClick={handleAlert}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Alert (Check Console)
        </button>
      </div>
    </div>
  );
}

