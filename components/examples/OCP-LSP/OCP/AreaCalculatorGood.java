// ✅ The Good Way (OCP Applied)
// We create an interface. The AreaCalculator never needs to change again,
// even if we add 1,000 new shapes.

// 1. The Contract
interface Shape {
    double getArea();
}

// 2. The Extensions (We add new files, we don't touch old ones)
class Circle implements Shape {
    double radius;
    
    Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return 3.14 * radius * radius;
    }
}

class Rectangle implements Shape {
    double width, height;
    
    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
}

// ✅ Example: Adding a new shape (Triangle) - NO MODIFICATION to AreaCalculator!
class Triangle implements Shape {
    double base, height;
    
    Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return 0.5 * base * height;
    }
}

// 3. The Closed Consumer
// ✅ This code never changes again!
class AreaCalculator {
    public double calculate(Shape shape) {
        return shape.getArea();
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        AreaCalculator calculator = new AreaCalculator();
        
        // Calculate area of a circle
        Circle circle = new Circle(5.0);
        double circleArea = calculator.calculate(circle);
        System.out.println("Circle area (radius=5): " + circleArea);
        
        // Calculate area of a rectangle
        Rectangle rectangle = new Rectangle(4.0, 6.0);
        double rectangleArea = calculator.calculate(rectangle);
        System.out.println("Rectangle area (4x6): " + rectangleArea);
        
        // ✅ Adding Triangle - NO modification to AreaCalculator needed!
        Triangle triangle = new Triangle(3.0, 4.0);
        double triangleArea = calculator.calculate(triangle);
        System.out.println("Triangle area (base=3, height=4): " + triangleArea);
        
        // ✅ We can add infinite new shapes without touching AreaCalculator!
        // This follows Open/Closed Principle - open for extension, closed for modification
    }
}