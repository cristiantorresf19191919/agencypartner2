// ✅ The Good Way (Factory Pattern with Interface)
// New vehicle types can be added without modifying existing code

// Base interface
interface Vehicle {
    void drive();
}

// Concrete implementations
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

// ✅ Factory interface (allows different factory implementations)
interface VehicleFactory {
    Vehicle createVehicle();
}

// Concrete factories
class CarFactory implements VehicleFactory {
    public Vehicle createVehicle() {
        return new Car();
    }
}

class BikeFactory implements VehicleFactory {
    public Vehicle createVehicle() {
        return new Bike();
    }
}

class TruckFactory implements VehicleFactory {
    public Vehicle createVehicle() {
        return new Truck();
    }
}

// ✅ Simple factory (alternative approach)
class SimpleVehicleFactory {
    public static Vehicle createVehicle(String type) {
        switch (type.toLowerCase()) {
            case "car":
                return new Car();
            case "bike":
                return new Bike();
            case "truck":
                return new Truck();
            default:
                throw new IllegalArgumentException("Unknown vehicle type: " + type);
        }
    }
}

// Usage
class App {
    public static void main(String[] args) {
        // Using factory interface
        VehicleFactory carFactory = new CarFactory();
        Vehicle car = carFactory.createVehicle();
        car.drive();
        
        // Using simple factory
        Vehicle bike = SimpleVehicleFactory.createVehicle("bike");
        bike.drive();
    }
}





