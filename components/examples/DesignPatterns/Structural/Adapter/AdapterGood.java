// ✅ The Good Way (Adapter Pattern)
// Adapter allows incompatible interfaces to work together

// Our application's expected interface
interface Logger {
    void log(String message);
    void error(String message);
    void warn(String message);
}

// Third-party library with incompatible interface
class ThirdPartyLogger {
    public void logMessage(String message, int level) {
        System.out.println("[" + level + "] " + message);
    }
}

// ✅ Adapter: Adapts ThirdPartyLogger to our Logger interface
class LoggerAdapter implements Logger {
    private ThirdPartyLogger thirdPartyLogger;
    
    public LoggerAdapter(ThirdPartyLogger thirdPartyLogger) {
        this.thirdPartyLogger = thirdPartyLogger;
    }
    
    public void log(String message) {
        thirdPartyLogger.logMessage(message, 1);
    }
    
    public void error(String message) {
        thirdPartyLogger.logMessage("ERROR: " + message, 3);
    }
    
    public void warn(String message) {
        thirdPartyLogger.logMessage("WARN: " + message, 2);
    }
}

// ✅ Application uses our Logger interface, not ThirdPartyLogger directly
class Application {
    private Logger logger;
    
    public Application(Logger logger) {
        this.logger = logger;
    }
    
    public void doSomething() {
        logger.log("Application started");
        logger.warn("This is a warning");
        logger.error("This is an error");
    }
}

// Usage
class App {
    public static void main(String[] args) {
        // ✅ We can use any logger that implements our interface
        ThirdPartyLogger thirdPartyLogger = new ThirdPartyLogger();
        Logger adapter = new LoggerAdapter(thirdPartyLogger);
        
        Application app = new Application(adapter);
        app.doSomething();
        
        // ✅ Easy to switch to a different logger implementation
        // Just create a new adapter or implement Logger directly
    }
}






