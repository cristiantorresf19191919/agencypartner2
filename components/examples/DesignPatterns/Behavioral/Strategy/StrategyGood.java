// ✅ The Good Way (Strategy Pattern)
// Encapsulate algorithms in separate classes

// ✅ Strategy interface
interface PaymentStrategy {
    void pay(double amount);
}

// ✅ Concrete strategies
class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String name;
    
    public CreditCardPayment(String cardNumber, String name) {
        this.cardNumber = cardNumber;
        this.name = name;
    }
    
    public void pay(double amount) {
        System.out.println("Processing credit card payment: $" + amount);
        System.out.println("Card: " + cardNumber + ", Name: " + name);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    public void pay(double amount) {
        System.out.println("Processing PayPal payment: $" + amount);
        System.out.println("Email: " + email);
    }
}

class BitcoinPayment implements PaymentStrategy {
    private String walletAddress;
    
    public BitcoinPayment(String walletAddress) {
        this.walletAddress = walletAddress;
    }
    
    public void pay(double amount) {
        System.out.println("Processing Bitcoin payment: $" + amount);
        System.out.println("Wallet: " + walletAddress);
    }
}

// ✅ Context class
class PaymentProcessor {
    private PaymentStrategy strategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void processPayment(double amount) {
        if (strategy == null) {
            throw new IllegalStateException("Payment strategy not set");
        }
        strategy.pay(amount);
    }
}

// Usage
class App {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        // ✅ Use different strategies
        processor.setPaymentStrategy(new CreditCardPayment("1234-5678", "John Doe"));
        processor.processPayment(100.0);
        
        processor.setPaymentStrategy(new PayPalPayment("user@example.com"));
        processor.processPayment(50.0);
        
        processor.setPaymentStrategy(new BitcoinPayment("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"));
        processor.processPayment(25.0);
        
        // ✅ Easy to add new payment methods without modifying existing code
    }
}






