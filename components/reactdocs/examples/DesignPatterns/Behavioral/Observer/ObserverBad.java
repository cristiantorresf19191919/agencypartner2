// ❌ The Bad Way (Tight Coupling)
// Subject directly knows about all observers

// ❌ Problem: Subject is tightly coupled to concrete observer classes
class NewsPublisher {
    private String news;
    private EmailSubscriber emailSubscriber;
    private SMSSubscriber smsSubscriber;
    
    public void setNews(String news) {
        this.news = news;
        // ❌ Have to manually notify each observer
        if (emailSubscriber != null) {
            emailSubscriber.update(news);
        }
        if (smsSubscriber != null) {
            smsSubscriber.update(news);
        }
        // ❌ What if we want to add a new subscriber type?
        // We have to modify this class!
    }
    
    public void setEmailSubscriber(EmailSubscriber subscriber) {
        this.emailSubscriber = subscriber;
    }
    
    public void setSmsSubscriber(SMSSubscriber subscriber) {
        this.smsSubscriber = subscriber;
    }
}

class EmailSubscriber {
    public void update(String news) {
        System.out.println("Email: " + news);
    }
}

class SMSSubscriber {
    public void update(String news) {
        System.out.println("SMS: " + news);
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        NewsPublisher publisher = new NewsPublisher();
        
        // Set subscribers
        publisher.setEmailSubscriber(new EmailSubscriber());
        publisher.setSmsSubscriber(new SMSSubscriber());
        
        // Publish news
        publisher.setNews("Breaking: New update available!");
        
        // ❌ Problem: To add a new subscriber type (e.g., PushNotification),
        // we must modify the NewsPublisher class
        // ❌ Subject is tightly coupled to concrete observer classes
        // ❌ Can't dynamically add/remove observers
    }
}
