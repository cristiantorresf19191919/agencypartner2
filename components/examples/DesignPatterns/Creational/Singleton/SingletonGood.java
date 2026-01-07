// ✅ The Good Way (Thread-Safe Singleton)
// Ensures only one instance exists, even in multi-threaded environments

class DatabaseConnection {
    // Eager initialization - thread-safe by default
    private static final DatabaseConnection instance = new DatabaseConnection();
    
    // Private constructor to prevent instantiation
    private DatabaseConnection() {
        System.out.println("Creating database connection...");
    }
    
    // ✅ Thread-safe: instance is already created
    public static DatabaseConnection getInstance() {
        return instance;
    }
    
    public void connect() {
        System.out.println("Connected to database");
    }
}

// Alternative: Lazy initialization with double-checked locking
class DatabaseConnectionLazy {
    private static volatile DatabaseConnectionLazy instance;
    
    private DatabaseConnectionLazy() {
        System.out.println("Creating database connection (lazy)...");
    }
    
    // ✅ Thread-safe with double-checked locking
    public static DatabaseConnectionLazy getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionLazy.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionLazy();
                }
            }
        }
        return instance;
    }
    
    public void connect() {
        System.out.println("Connected to database");
    }
}





