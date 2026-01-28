// ✅ The Good Way (Facade Pattern)
// Simple interface that hides subsystem complexity

// Complex subsystem classes (same as before)
class CPU {
    public void freeze() {
        System.out.println("CPU: Freezing...");
    }
    
    public void jump(long position) {
        System.out.println("CPU: Jumping to position " + position);
    }
    
    public void execute() {
        System.out.println("CPU: Executing...");
    }
}

class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory: Loading data at position " + position);
    }
}

class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HardDrive: Reading " + size + " bytes from LBA " + lba);
        return new byte[size];
    }
}

// ✅ Facade: Provides simple interface to complex subsystem
class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    // ✅ Simple method that hides all complexity
    public void startComputer() {
        System.out.println("Starting computer...");
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
        System.out.println("Computer started!");
    }
    
    // ✅ Can add more simple methods
    public void shutdownComputer() {
        System.out.println("Shutting down computer...");
        // Complex shutdown logic here
        System.out.println("Computer shut down!");
    }
}

// Usage
class App {
    public static void main(String[] args) {
        // ✅ Client only needs to know about the facade
        ComputerFacade computer = new ComputerFacade();
        computer.startComputer();
        
        // ✅ If subsystem changes, only facade needs to be updated
        // All clients continue to work
    }
}






