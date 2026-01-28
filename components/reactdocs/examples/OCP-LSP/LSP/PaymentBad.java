// ❌ The Bad Way (Violating LSP)
// A CreditCard is a Payment, but Cash is also a Payment.
// If the system expects Payment to have a processPayment, Cash works.
// But if Payment assumes "Validation" (like checking a bank), Cash fails.

abstract class Payment {
    // ❌ Problem: Not all payments can validate with a bank
    abstract void validateWithBank();
    abstract void pay();
}

class CreditCard extends Payment {
    @Override
    public void validateWithBank() {
        System.out.println("Calling Bank API... Validating card.");
    }
    
    @Override
    public void pay() {
        System.out.println("Paid with Credit Card");
    }
}

class Cash extends Payment {
    // ❌ VIOLATION: Cash cannot validate with a bank!
    // This child breaks the parent's contract.
    // We're forced to throw an exception or do nothing meaningful.
    @Override
    public void validateWithBank() {
        throw new UnsupportedOperationException("Cash has no bank!");
        // OR: System.out.println("No validation needed"); // But this violates the contract
    }
    
    @Override
    public void pay() {
        System.out.println("Paid with Cash");
    }
}

// Usage that breaks:
class PaymentProcessor {
    public void process(Payment payment) {
        // ❌ This will crash if payment is Cash!
        payment.validateWithBank(); // Throws exception for Cash
        payment.pay();
    }
}

// Usage example demonstrating the problem
class App {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        // ✅ This works fine
        Payment card = new CreditCard();
        try {
            processor.process(card);
            System.out.println("Credit card payment processed successfully");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // ❌ This crashes! Cash cannot validate with bank
        Payment cash = new Cash();
        try {
            processor.process(cash); // ❌ Throws UnsupportedOperationException
            System.out.println("Cash payment processed successfully");
        } catch (UnsupportedOperationException e) {
            System.out.println("❌ ERROR: " + e.getMessage());
            System.out.println("❌ Cash payment failed because it cannot validate with bank!");
            // This violates Liskov Substitution Principle - Cash cannot substitute Payment
        }
    }
}
