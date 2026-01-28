// ❌ The Bad Way (Direct Method Calls)
// Invoker directly calls receiver methods

// Receiver
class Light {
    public void turnOn() {
        System.out.println("Light is ON");
    }
    
    public void turnOff() {
        System.out.println("Light is OFF");
    }
}

// ❌ Problem: Invoker is tightly coupled to receiver
class RemoteControl {
    private Light light;
    
    public RemoteControl(Light light) {
        this.light = light;
    }
    
    // ❌ Direct method calls - can't undo, can't queue, can't log
    public void pressOnButton() {
        light.turnOn();
    }
    
    public void pressOffButton() {
        light.turnOff();
    }
    
    // ❌ What if we want to add undo functionality?
    // What if we want to add a new device?
    // We have to modify this class!
}

// Usage example
class App {
    public static void main(String[] args) {
        Light light = new Light();
        RemoteControl remote = new RemoteControl(light);
        
        remote.pressOnButton();  // Light ON
        remote.pressOffButton(); // Light OFF
        
        // ❌ Problem: No undo functionality
        // ❌ Can't queue commands
        // ❌ Can't log commands
        // ❌ Tightly coupled to Light - can't use with other devices
        // ❌ To add undo or support other devices, must modify RemoteControl
    }
}
