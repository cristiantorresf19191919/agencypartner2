// ✅ The Good Way (Observer Pattern)
// Subject and observers are loosely coupled through interface

import java.util.ArrayList;
import java.util.List;

// ✅ Observer interface
interface Observer {
    void update(String news);
}

// ✅ Subject interface
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// ✅ Concrete subject
class NewsPublisher implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers(); // ✅ Notify all observers automatically
    }
    
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(news);
        }
    }
}

// ✅ Concrete observers
class EmailSubscriber implements Observer {
    private String email;
    
    public EmailSubscriber(String email) {
        this.email = email;
    }
    
    public void update(String news) {
        System.out.println("Email to " + email + ": " + news);
    }
}

class SMSSubscriber implements Observer {
    private String phone;
    
    public SMSSubscriber(String phone) {
        this.phone = phone;
    }
    
    public void update(String news) {
        System.out.println("SMS to " + phone + ": " + news);
    }
}

// ✅ Easy to add new observer types without modifying subject
class PushNotificationSubscriber implements Observer {
    public void update(String news) {
        System.out.println("Push Notification: " + news);
    }
}

// Usage
class App {
    public static void main(String[] args) {
        NewsPublisher publisher = new NewsPublisher();
        
        // ✅ Add observers dynamically
        publisher.attach(new EmailSubscriber("user@example.com"));
        publisher.attach(new SMSSubscriber("123-456-7890"));
        publisher.attach(new PushNotificationSubscriber());
        
        // ✅ Notify all observers automatically
        publisher.setNews("Breaking: New update available!");
        
        // ✅ Remove observer
        Observer sms = new SMSSubscriber("999-999-9999");
        publisher.attach(sms);
        publisher.setNews("First notification");
        publisher.detach(sms);
        publisher.setNews("Second notification (SMS removed)");
    }
}




