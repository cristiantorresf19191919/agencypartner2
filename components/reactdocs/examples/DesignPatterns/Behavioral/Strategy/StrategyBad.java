// ❌ The Bad Way (If/Else Hell)
// Using conditional statements for different algorithms

class PaymentProcessor {
    // ❌ Problem: Lots of if/else logic, violates Open/Closed Principle
    public void processPayment(String paymentType, double amount) {
        if (paymentType.equals("credit")) {
            System.out.println("Processing credit card payment: $" + amount);
            // Complex credit card processing logic
        } else if (paymentType.equals("paypal")) {
            System.out.println("Processing PayPal payment: $" + amount);
            // Complex PayPal processing logic
        } else if (paymentType.equals("bitcoin")) {
            System.out.println("Processing Bitcoin payment: $" + amount);
            // Complex Bitcoin processing logic
        } else {
            throw new IllegalArgumentException("Unknown payment type");
        }
        // ❌ What if we want to add a new payment method?
        // We have to modify this class!
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        // Process different payment types
        processor.processPayment("credit", 100.0);
        processor.processPayment("paypal", 50.0);
        processor.processPayment("bitcoin", 25.0);
        
        // ❌ Problem: To add a new payment method (e.g., "applepay"),
        // we must modify the processPayment() method
        // ❌ Violates Open/Closed Principle
        try {
            processor.processPayment("applepay", 75.0);
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Error: " + e.getMessage());
            System.out.println("❌ Must modify PaymentProcessor to add Apple Pay support!");
        }
    }
}
