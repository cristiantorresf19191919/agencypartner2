// ✅ The Good Way (Builder Pattern)
// Clean, readable, and allows for optional parameters

class User {
    private final String name;
    private final String email;
    private final int age;
    private final String phone;
    private final String address;
    private final boolean isActive;
    
    // Private constructor - only Builder can create instances
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
        this.isActive = builder.isActive;
    }
    
    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public boolean isActive() { return isActive; }
    
    // ✅ Builder class
    public static class Builder {
        // Required fields
        private final String name;
        
        // Optional fields with defaults
        private String email = "";
        private int age = 0;
        private String phone = "";
        private String address = "";
        private boolean isActive = true;
        
        public Builder(String name) {
            this.name = name;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public Builder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Usage
class App {
    public static void main(String[] args) {
        // ✅ Clean, readable, and flexible
        User user1 = new User.Builder("John Doe")
            .email("john@example.com")
            .age(30)
            .build();
        
        User user2 = new User.Builder("Jane Smith")
            .email("jane@example.com")
            .age(25)
            .phone("123-456-7890")
            .address("123 Main St")
            .isActive(false)
            .build();
    }
}






