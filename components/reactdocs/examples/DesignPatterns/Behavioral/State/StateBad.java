// ❌ The Bad Way (If/Else State Management)
// Using conditional statements to manage state behavior

class VendingMachine {
    private String state; // "idle", "hasMoney", "dispensing"
    private int money;
    
    // ❌ Problem: Lots of if/else logic scattered throughout
    public void insertMoney(int amount) {
        if (state.equals("idle")) {
            this.money = amount;
            this.state = "hasMoney";
            System.out.println("Money inserted: $" + amount);
        } else if (state.equals("hasMoney")) {
            System.out.println("Money already inserted");
        } else if (state.equals("dispensing")) {
            System.out.println("Please wait, dispensing...");
        }
    }
    
    public void selectProduct(String product) {
        if (state.equals("idle")) {
            System.out.println("Please insert money first");
        } else if (state.equals("hasMoney")) {
            if (money >= 10) {
                this.state = "dispensing";
                System.out.println("Dispensing " + product);
                this.money = 0;
                this.state = "idle";
            } else {
                System.out.println("Insufficient funds");
            }
        } else if (state.equals("dispensing")) {
            System.out.println("Please wait, dispensing...");
        }
    }
    
    public void cancel() {
        if (state.equals("hasMoney")) {
            System.out.println("Returning $" + money);
            this.money = 0;
            this.state = "idle";
        } else {
            System.out.println("No transaction to cancel");
        }
    }
    // ❌ What if we want to add a new state? More if/else everywhere!
}

// Usage example
class App {
    public static void main(String[] args) {
        VendingMachine machine = new VendingMachine();
        
        machine.selectProduct("Coke"); // Please insert money first
        machine.insertMoney(10);      // Money inserted: $10
        machine.selectProduct("Coke"); // Dispensing Coke
        machine.insertMoney(5);       // Money inserted: $5
        machine.cancel();              // Returning $5
        
        // ❌ Problem: To add a new state (e.g., "outOfStock"),
        // we must modify ALL methods with more if/else statements
        // ❌ State logic is scattered and hard to maintain
        // ❌ Easy to introduce bugs when modifying state transitions
    }
}
