// ✅ The Good Way (Command Pattern)
// Encapsulate requests as objects, allowing undo, queuing, and logging

// ✅ Command interface
interface Command {
    void execute();
    void undo();
}

// Receiver
class Light {
    private boolean isOn = false;
    
    public void turnOn() {
        isOn = true;
        System.out.println("Light is ON");
    }
    
    public void turnOff() {
        isOn = false;
        System.out.println("Light is OFF");
    }
    
    public boolean isOn() {
        return isOn;
    }
}

// ✅ Concrete commands
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOn();
    }
    
    public void undo() {
        light.turnOff();
    }
}

class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOff();
    }
    
    public void undo() {
        light.turnOn();
    }
}

// ✅ Invoker
class RemoteControl {
    private Command lastCommand;
    private Command onCommand;
    private Command offCommand;
    
    public void setCommand(Command onCommand, Command offCommand) {
        this.onCommand = onCommand;
        this.offCommand = offCommand;
    }
    
    public void pressOnButton() {
        onCommand.execute();
        lastCommand = onCommand;
    }
    
    public void pressOffButton() {
        offCommand.execute();
        lastCommand = offCommand;
    }
    
    // ✅ Undo functionality
    public void pressUndoButton() {
        if (lastCommand != null) {
            lastCommand.undo();
        }
    }
}

// Usage
class App {
    public static void main(String[] args) {
        Light light = new Light();
        RemoteControl remote = new RemoteControl();
        
        remote.setCommand(
            new LightOnCommand(light),
            new LightOffCommand(light)
        );
        
        remote.pressOnButton();  // Light ON
        remote.pressOffButton(); // Light OFF
        remote.pressUndoButton(); // Light ON (undo)
    }
}





