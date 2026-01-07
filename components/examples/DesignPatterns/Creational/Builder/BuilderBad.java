// ❌ The Bad Way (Telescoping Constructor)
// Too many constructor parameters, hard to read and maintain

class User {
    private String name;
    private String email;
    private int age;
    private String phone;
    private String address;
    private boolean isActive;
    
    // ❌ Problem: Too many constructors for different combinations
    public User(String name) {
        this.name = name;
    }
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // ❌ This becomes unmanageable with many optional parameters
    public User(String name, String email, int age, String phone, String address, boolean isActive) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.phone = phone;
        this.address = address;
        this.isActive = isActive;
    }
    
    // ❌ Or using setters (but object can be in inconsistent state)
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    // ... more setters
}

// Usage example
class App {
    public static void main(String[] args) {
        // ❌ Problem 1: Too many constructors, hard to remember which one to use
        User user1 = new User("John Doe");
        User user2 = new User("Jane Smith", "jane@example.com");
        User user3 = new User("Bob", "bob@example.com", 30, "123-456-7890", "123 Main St", true);
        
        // ❌ Problem 2: Using setters - object can be in inconsistent state
        User user4 = new User("Alice");
        user4.setEmail("alice@example.com");
        // What if we forget to set required fields? Object is in invalid state!
        
        // ❌ Problem 3: Constructor with many parameters is hard to read
        // Which parameter is which? Easy to mix up order!
        User user5 = new User("Charlie", "charlie@example.com", 25, "555-1234", "456 Oak Ave", false);
    }
}
