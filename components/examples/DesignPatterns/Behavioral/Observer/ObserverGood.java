// ✅ The Good Way (Observer Pattern)
// Subject and observers are loosely coupled through interface
// Defines a subscription mechanism to notify multiple objects about events

import java.util.ArrayList;
import java.util.List;

// ✅ Step 1: Observer Interface
// Declares the notification interface
interface Observer {
    void update(String eventType, String data);
}

// ✅ Step 2: Subject/Publisher Interface
// Describes methods for adding/removing subscribers
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers(String eventType, String data);
}

// ✅ Step 3: Concrete Publisher
// Contains subscription infrastructure and business logic
class Store implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String product;
    
    // ✅ Subscription management
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers(String eventType, String data) {
        for (Observer observer : observers) {
            observer.update(eventType, data);
        }
    }
    
    // ✅ Business logic methods notify subscribers automatically
    public void setProduct(String product) {
        this.product = product;
        notifyObservers("product_available", product);
    }
    
    public void setPrice(String product, double price) {
        notifyObservers("price_change", product + " - $" + price);
    }
}

// ✅ Step 4: Concrete Subscribers
// React to notifications issued by the publisher
// All implement the same interface so publisher isn't coupled to concrete classes

class Customer implements Observer {
    private String name;
    private String interestedProduct;
    
    public Customer(String name, String interestedProduct) {
        this.name = name;
        this.interestedProduct = interestedProduct;
    }
    
    public void update(String eventType, String data) {
        if ("product_available".equals(eventType) && data.contains(interestedProduct)) {
            System.out.println(name + " notified: " + data + " is now available!");
        }
    }
}

class EmailSubscriber implements Observer {
    private String email;
    
    public EmailSubscriber(String email) {
        this.email = email;
    }
    
    public void update(String eventType, String data) {
        System.out.println("Email to " + email + ": " + data);
    }
}

class SMSSubscriber implements Observer {
    private String phone;
    
    public SMSSubscriber(String phone) {
        this.phone = phone;
    }
    
    public void update(String eventType, String data) {
        System.out.println("SMS to " + phone + ": " + data);
    }
}

// ✅ Easy to add new observer types without modifying subject
class PushNotificationSubscriber implements Observer {
    public void update(String eventType, String data) {
        System.out.println("Push Notification: " + data);
    }
}

// ✅ Step 5: Usage
// Client creates publisher and subscriber objects separately
// and registers subscribers for publisher updates
class App {
    public static void main(String[] args) {
        Store store = new Store();
        
        // ✅ Add observers dynamically
        Customer alice = new Customer("Alice", "iPhone");
        store.attach(alice);
        
        store.attach(new EmailSubscriber("user@example.com"));
        store.attach(new SMSSubscriber("123-456-7890"));
        store.attach(new PushNotificationSubscriber());
        
        // ✅ Business logic triggers notifications automatically
        store.setProduct("New iPhone 15");
        // Output:
        // Alice notified: New iPhone 15 is now available!
        // Email to user@example.com: New iPhone 15
        // SMS to 123-456-7890: New iPhone 15
        // Push Notification: New iPhone 15
        
        store.setPrice("New iPhone 15", 999.99);
        // Output:
        // Email to user@example.com: New iPhone 15 - $999.99
        // SMS to 123-456-7890: New iPhone 15 - $999.99
        // Push Notification: New iPhone 15 - $999.99
        
        // ✅ Remove observer dynamically
        store.detach(alice);
        store.setProduct("New MacBook Pro");
        // Alice is no longer notified
        
        // ✅ Benefits:
        // - Open/Closed Principle: add new subscribers without changing publisher
        // - Loose coupling: publisher doesn't know concrete subscriber classes
        // - Dynamic relationships: subscribe/unsubscribe at runtime
        // - Single Responsibility: each class has one job
    }
}






