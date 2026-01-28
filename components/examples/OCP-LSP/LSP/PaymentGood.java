// ✅ The Good Way (LSP Applied)
// We separate the interfaces so Cash is never asked to do something it can't.
// Any Payment can be substituted without breaking the system.

// Base interface - all payments must be able to pay
interface Payment {
    void pay();
}

// Separate interface for payments that can validate with a bank
interface Bankable {
    void validateWithBank();
}

// CreditCard implements both - it can pay AND validate with bank
class CreditCard implements Payment, Bankable {
    public void validateWithBank() {
        System.out.println("Calling Bank API... Validating card.");
    }
    
    public void pay() {
        System.out.println("Paid with Credit Card");
    }
}

// Cash only implements Payment - it can pay but has no bank
// ✅ Cash only implements what it can actually do
class Cash implements Payment {
    public void pay() {
        System.out.println("Paid with Cash");
    }
    // ✅ No validateWithBank() - Cash doesn't need it and shouldn't have it
}

// ✅ Now the PaymentProcessor works with any Payment
class PaymentProcessor {
    public void process(Payment payment) {
        // ✅ This works for both CreditCard and Cash
        payment.pay();
    }
    
    // Separate method for bankable payments
    public void processWithValidation(Bankable bankablePayment) {
        bankablePayment.validateWithBank();
        if (bankablePayment instanceof Payment) {
            ((Payment) bankablePayment).pay();
        }
    }
}

// Usage - both work without breaking!
class App {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        // ✅ Both can be used interchangeably as Payment
        Payment card = new CreditCard();
        Payment cash = new Cash();
        
        processor.process(card);  // Works!
        processor.process(cash);  // Works! No exception thrown
    }
}

