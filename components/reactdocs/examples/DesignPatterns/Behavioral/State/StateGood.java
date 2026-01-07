// ✅ The Good Way (State Pattern)
// Encapsulate state-specific behavior in separate classes

// ✅ State interface
interface VendingMachineState {
    void insertMoney(int amount);
    void selectProduct(String product);
    void cancel();
}

// ✅ Concrete states
class IdleState implements VendingMachineState {
    private VendingMachine machine;
    
    public IdleState(VendingMachine machine) {
        this.machine = machine;
    }
    
    public void insertMoney(int amount) {
        System.out.println("Money inserted: $" + amount);
        machine.setMoney(amount);
        machine.setState(machine.getHasMoneyState());
    }
    
    public void selectProduct(String product) {
        System.out.println("Please insert money first");
    }
    
    public void cancel() {
        System.out.println("No transaction to cancel");
    }
}

class HasMoneyState implements VendingMachineState {
    private VendingMachine machine;
    
    public HasMoneyState(VendingMachine machine) {
        this.machine = machine;
    }
    
    public void insertMoney(int amount) {
        System.out.println("Money already inserted");
    }
    
    public void selectProduct(String product) {
        if (machine.getMoney() >= 10) {
            System.out.println("Dispensing " + product);
            machine.setMoney(0);
            machine.setState(machine.getIdleState());
        } else {
            System.out.println("Insufficient funds");
        }
    }
    
    public void cancel() {
        System.out.println("Returning $" + machine.getMoney());
        machine.setMoney(0);
        machine.setState(machine.getIdleState());
    }
}

// ✅ Context class
class VendingMachine {
    private VendingMachineState idleState;
    private VendingMachineState hasMoneyState;
    private VendingMachineState currentState;
    private int money;
    
    public VendingMachine() {
        this.idleState = new IdleState(this);
        this.hasMoneyState = new HasMoneyState(this);
        this.currentState = idleState;
        this.money = 0;
    }
    
    public void setState(VendingMachineState state) {
        this.currentState = state;
    }
    
    public VendingMachineState getIdleState() {
        return idleState;
    }
    
    public VendingMachineState getHasMoneyState() {
        return hasMoneyState;
    }
    
    public void setMoney(int money) {
        this.money = money;
    }
    
    public int getMoney() {
        return money;
    }
    
    // Delegate to current state
    public void insertMoney(int amount) {
        currentState.insertMoney(amount);
    }
    
    public void selectProduct(String product) {
        currentState.selectProduct(product);
    }
    
    public void cancel() {
        currentState.cancel();
    }
}

// Usage
class App {
    public static void main(String[] args) {
        VendingMachine machine = new VendingMachine();
        
        machine.selectProduct("Coke"); // Please insert money first
        machine.insertMoney(10);      // Money inserted: $10
        machine.selectProduct("Coke"); // Dispensing Coke
        machine.insertMoney(5);       // Money inserted: $5
        machine.cancel();              // Returning $5
    }
}

