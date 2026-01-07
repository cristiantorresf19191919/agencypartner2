// ❌ The Bad Way (Violating Open/Closed Principle)
// Every time we add a new vehicle type, we have to modify this class

class VehicleFactory {
    // ❌ Problem: Tightly coupled, violates OCP
    public Vehicle createVehicle(String type) {
        if (type.equalsIgnoreCase("car")) {
            return new Car();
        } else if (type.equalsIgnoreCase("bike")) {
            return new Bike();
        } else if (type.equalsIgnoreCase("truck")) {
            // ❌ We have to modify this method to add new types
            return new Truck();
        }
        throw new IllegalArgumentException("Unknown vehicle type: " + type);
    }
}

interface Vehicle {
    void drive();
}

class Car implements Vehicle {
    public void drive() {
        System.out.println("Driving a car");
    }
}

class Bike implements Vehicle {
    public void drive() {
        System.out.println("Riding a bike");
    }
}

class Truck implements Vehicle {
    public void drive() {
        System.out.println("Driving a truck");
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        VehicleFactory factory = new VehicleFactory();
        
        // Create vehicles
        Vehicle car = factory.createVehicle("car");
        car.drive();
        
        Vehicle bike = factory.createVehicle("bike");
        bike.drive();
        
        Vehicle truck = factory.createVehicle("truck");
        truck.drive();
        
        // ❌ Problem: To add a new vehicle type (e.g., "motorcycle"),
        // we must modify the VehicleFactory.createVehicle() method
        // This violates Open/Closed Principle
        try {
            Vehicle motorcycle = factory.createVehicle("motorcycle");
            motorcycle.drive();
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Error: " + e.getMessage());
            System.out.println("❌ Must modify VehicleFactory to add motorcycle support!");
        }
    }
}
