// ❌ The Bad Way (Complex Subsystem Exposure)
// Client code directly interacts with complex subsystem

// Complex subsystem classes
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

// ❌ Problem: Client has to know about all subsystem details
class Computer {
    private CPU cpu = new CPU();
    private Memory memory = new Memory();
    private HardDrive hardDrive = new HardDrive();
    
    // ❌ Client has to understand the complex startup sequence
    public void startComputer() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
        // ❌ What if the sequence changes? All clients break!
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        Computer computer = new Computer();
        
        // ❌ Problem: Client has to know the exact startup sequence
        // ❌ If the internal implementation changes, this code breaks
        computer.startComputer();
        
        // ❌ What if we want to add shutdown? We expose more complexity
        // ❌ Client code becomes tightly coupled to subsystem details
    }
}
