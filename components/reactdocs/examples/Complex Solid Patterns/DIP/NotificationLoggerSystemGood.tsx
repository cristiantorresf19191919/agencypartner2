// ✅ GOOD EXAMPLE: Dependency Inversion Principle Applied
// High-level modules depend on abstractions (interfaces)
// Low-level modules implement abstractions
// Both depend on abstractions, not concrete implementations

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

// ✅ Abstraction (interface) - high level
interface Logger {
  log(entry: LogEntry): void;
}

interface NotificationSender {
  send(notification: NotificationMessage): Promise<boolean>;
}

// ✅ Low-level module: Concrete implementation of abstraction
class FileLoggerGood implements Logger {
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

class ConsoleLoggerGood implements Logger {
  log(entry: LogEntry): void {
    console.log(
      `CONSOLE LOGGER: [${entry.level}] ${entry.message} at ${entry.timestamp}`
    );
  }
}

class DatabaseLoggerGood implements Logger {
  log(entry: LogEntry): void {
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

// ✅ Composite logger - implements Logger interface
class CompositeLoggerGood implements Logger {
  constructor(private loggers: Logger[]) {}

  log(entry: LogEntry): void {
    this.loggers.forEach((logger) => logger.log(entry));
  }
}

// ✅ Low-level module: Concrete implementation of abstraction
class EmailNotificationServiceGood implements NotificationSender {
  async send(notification: NotificationMessage): Promise<boolean> {
    console.log(`EMAIL SERVICE: Sending email to ${notification.recipient}`);
    console.log(`Subject: ${notification.subject}`);
    console.log(`Body: ${notification.body}`);
    // In real implementation: SMTP connection, send email
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateEmail(email: string): boolean {
    return email.includes("@");
  }
}

class SMSNotificationServiceGood implements NotificationSender {
  async send(notification: NotificationMessage): Promise<boolean> {
    console.log(`SMS SERVICE: Sending SMS to ${notification.recipient}`);
    console.log(`Message: ${notification.body}`);
    // In real implementation: SMS gateway API call
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validatePhoneNumber(phone: string): boolean {
    return phone.length >= 10;
  }
}

class PushNotificationServiceGood implements NotificationSender {
  async send(notification: NotificationMessage): Promise<boolean> {
    console.log(
      `PUSH SERVICE: Sending push notification to device ${notification.recipient}`
    );
    console.log(`Title: ${notification.subject}`);
    console.log(`Body: ${notification.body}`);
    // In real implementation: Firebase/APNs API call
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  registerDevice(deviceId: string): void {
    console.log(`Registering device: ${deviceId}`);
  }
}

// ✅ Composite notification sender - implements NotificationSender interface
class CompositeNotificationSenderGood implements NotificationSender {
  constructor(private senders: NotificationSender[]) {}

  async send(notification: NotificationMessage): Promise<boolean> {
    let allSuccess = true;
    for (const sender of this.senders) {
      const success = await sender.send(notification);
      if (!success) allSuccess = false;
    }
    return allSuccess;
  }
}

// ✅ High-level module: Depends on abstraction, not concrete implementation
class ApplicationServiceGood {
  constructor(
    private logger: Logger, // ✅ Depends on abstraction
    private notificationSender: NotificationSender // ✅ Depends on abstraction
  ) {}

  async processUserRegistration(username: string, email: string): Promise<void> {
    // ✅ Uses abstraction
    this.logger.log({
      level: "INFO",
      message: `User registration started: ${username}`,
      timestamp: Date.now(),
    });

    // Business logic
    console.log(`Processing user registration for ${username}`);

    // ✅ Uses abstraction
    await this.notificationSender.send({
      recipient: email,
      subject: "Welcome!",
      body: `Thank you for registering, ${username}!`,
      priority: "NORMAL",
    });

    this.logger.log({
      level: "INFO",
      message: `User registration completed: ${username}`,
      timestamp: Date.now(),
    });
  }

  async processOrder(orderId: string, customerEmail: string): Promise<void> {
    this.logger.log({
      level: "INFO",
      message: `Order processing started: ${orderId}`,
      timestamp: Date.now(),
    });

    // Business logic
    console.log(`Processing order ${orderId}`);

    await this.notificationSender.send({
      recipient: customerEmail,
      subject: "Order Confirmation",
      body: `Your order ${orderId} has been confirmed.`,
      priority: "NORMAL",
    });

    this.logger.log({
      level: "INFO",
      message: `Order processing completed: ${orderId}`,
      timestamp: Date.now(),
    });
  }
}

// ✅ High-level module: Depends on abstraction
class MonitoringServiceGood {
  constructor(private logger: Logger) {} // ✅ Depends on abstraction

  monitorSystemHealth(): void {
    this.logger.log({
      level: "INFO",
      message: "System health check started",
      timestamp: Date.now(),
    });

    // Business logic
    console.log("Checking system health...");

    this.logger.log({
      level: "INFO",
      message: "System health check completed",
      timestamp: Date.now(),
    });
  }
}

// ✅ High-level module: Depends on abstraction
class AlertServiceGood {
  constructor(
    private notificationSender: NotificationSender // ✅ Depends on abstraction
  ) {}

  async sendCriticalAlert(recipient: string, message: string): Promise<void> {
    // ✅ Uses abstraction - can be any NotificationSender implementation
    await this.notificationSender.send({
      recipient,
      subject: "CRITICAL ALERT",
      body: message,
      priority: "HIGH",
    });
  }
}

export function NotificationLoggerSystemGood() {
  const handleUserRegistration = async () => {
    // ✅ Dependency injection: High-level modules receive abstractions
    const fileLogger = new FileLoggerGood();
    const consoleLogger = new ConsoleLoggerGood();
    const compositeLogger = new CompositeLoggerGood([fileLogger, consoleLogger]);

    const emailService = new EmailNotificationServiceGood();

    // ✅ ApplicationService receives abstractions
    const appService = new ApplicationServiceGood(compositeLogger, emailService);
    await appService.processUserRegistration("john_doe", "john@example.com");
  };

  const handleMonitoring = () => {
    // ✅ MonitoringService receives abstraction
    const databaseLogger = new DatabaseLoggerGood();
    databaseLogger.connect();
    const monitoringService = new MonitoringServiceGood(databaseLogger);
    monitoringService.monitorSystemHealth();
    databaseLogger.disconnect();
  };

  const handleAlert = async () => {
    // ✅ AlertService receives abstraction - can use composite sender
    const emailService = new EmailNotificationServiceGood();
    const smsService = new SMSNotificationServiceGood();
    const pushService = new PushNotificationServiceGood();
    const compositeSender = new CompositeNotificationSenderGood([
      emailService,
      smsService,
      pushService,
    ]);
    const alertService = new AlertServiceGood(compositeSender);
    await alertService.sendCriticalAlert(
      "admin@example.com",
      "System overload detected"
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Good: Following DIP</h2>
      <p className="mb-4 text-gray-600">
        High-level modules depend on abstractions (Logger, NotificationSender
        interfaces). To change logging from file to database, just inject a
        different Logger implementation. High-level modules never need to change
        - they depend on abstractions, not concrete implementations.
      </p>
      <div className="space-x-2">
        <button
          onClick={handleUserRegistration}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test User Registration (Check Console)
        </button>
        <button
          onClick={handleMonitoring}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Monitoring (Check Console)
        </button>
        <button
          onClick={handleAlert}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Alert (Check Console)
        </button>
      </div>
    </div>
  );
}

