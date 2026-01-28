// ❌ The Bad Way (Not Thread-Safe Singleton)
// Multiple instances can be created in a multi-threaded environment

class DatabaseConnection {
    private static DatabaseConnection instance;
    
    // Private constructor to prevent instantiation
    private DatabaseConnection() {
        System.out.println("Creating database connection...");
    }
    
    // ❌ Problem: Not thread-safe
    // If two threads call this simultaneously, two instances might be created
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    public void connect() {
        System.out.println("Connected to database");
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        // ❌ Problem: In multi-threaded environment, multiple instances might be created
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        
        db1.connect();
        db2.connect();
        
        // ❌ In a multi-threaded scenario, two threads might both see instance == null
        // and create two separate instances, breaking the singleton pattern
        System.out.println("Are instances the same? " + (db1 == db2));
        // This might print false in a multi-threaded environment!
    }
}
