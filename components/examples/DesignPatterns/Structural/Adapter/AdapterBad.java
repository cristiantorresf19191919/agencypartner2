// ❌ The Bad Way (Direct Dependency on Incompatible Interface)
// Client code directly depends on incompatible third-party library

// Third-party library with incompatible interface
class ThirdPartyLogger {
    public void logMessage(String message, int level) {
        System.out.println("[" + level + "] " + message);
    }
}

// ❌ Problem: Our code is tightly coupled to ThirdPartyLogger
// If we want to switch to a different logger, we have to change all our code
class Application {
    private ThirdPartyLogger logger = new ThirdPartyLogger();
    
    public void doSomething() {
        // ❌ We're forced to use ThirdPartyLogger's interface
        logger.logMessage("Application started", 1);
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        Application app = new Application();
        app.doSomething();
        
        // ❌ Problem: If we want to use a different logger library,
        // we have to modify the Application class
        // ❌ We're tightly coupled to ThirdPartyLogger's interface
        // ❌ Can't easily switch to another logging library
    }
}
