// ❌ The Bad Way (Tight Coupling)
// Subject directly knows about all observers
// Problem: Subject is tightly coupled to concrete observer classes

// ❌ Problem: Store directly manages each customer type
class Store {
    private String product;
    private Customer customer1;
    private Customer customer2;
    private VIPCustomer vipCustomer;
    
    public void setProduct(String product) {
        this.product = product;
        // ❌ Have to manually notify each customer type
        if (customer1 != null) {
            customer1.checkProduct(product);
        }
        if (customer2 != null) {
            customer2.checkProduct(product);
        }
        if (vipCustomer != null) {
            vipCustomer.notifyVIP(product);
        }
        // ❌ What if we want to add a new customer type?
        // We have to modify this class!
        // ❌ Can't dynamically add/remove customers
    }
    
    public void setCustomer1(Customer customer) {
        this.customer1 = customer;
    }
    
    public void setCustomer2(Customer customer) {
        this.customer2 = customer;
    }
    
    public void setVipCustomer(VIPCustomer customer) {
        this.vipCustomer = customer;
    }
}

class Customer {
    private String name;
    
    public Customer(String name) {
        this.name = name;
    }
    
    public void checkProduct(String product) {
        System.out.println(name + " checking: " + product);
    }
}

class VIPCustomer {
    private String name;
    
    public VIPCustomer(String name) {
        this.name = name;
    }
    
    public void notifyVIP(String product) {
        System.out.println("VIP " + name + " notified: " + product);
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        Store store = new Store();
        
        // Set customers
        store.setCustomer1(new Customer("Alice"));
        store.setCustomer2(new Customer("Bob"));
        store.setVipCustomer(new VIPCustomer("Charlie"));
        
        // New product arrives
        store.setProduct("New iPhone 15");
        
        // ❌ Problems:
        // - Store is tightly coupled to concrete customer classes
        // - To add a new customer type (e.g., PremiumCustomer),
        //   we must modify the Store class
        // - Can't dynamically add/remove customers
        // - Violates Open/Closed Principle
        // - Manual notification management is error-prone
    }
}
