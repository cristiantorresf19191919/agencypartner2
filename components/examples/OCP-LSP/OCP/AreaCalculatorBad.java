// ❌ The Bad Way (Violating OCP)
// Every time we add a new shape, we have to modify the AreaCalculator class.
// This risks breaking the calculation for other shapes.

class AreaCalculatorBad {
    public double calculate(Object shape) {
        if (shape instanceof Circle) {
            return 3.14 * ((Circle) shape).radius * ((Circle) shape).radius;
        } else if (shape instanceof Rectangle) {
            // ❌ WE HAVE TO MODIFY THIS CLASS TO ADD RECTANGLE
            return ((Rectangle) shape).width * ((Rectangle) shape).height;
        }
        // ❌ What if we want to add Triangle? We have to modify this class again!
        return 0;
    }
}

class CircleBad {
    double radius;
    CircleBad(double radius) {
        this.radius = radius;
    }
}

class RectangleBad {
    double width, height;
    RectangleBad(double width, double height) {
        this.width = width;
        this.height = height;
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        AreaCalculatorBad calculator = new AreaCalculatorBad();
        
        // Calculate area of a circle
        CircleBad circle = new CircleBad(5.0);
        double circleArea = calculator.calculate(circle);
        System.out.println("Circle area (radius=5): " + circleArea);
        
        // Calculate area of a rectangle
        RectangleBad rectangle = new RectangleBad(4.0, 6.0);
        double rectangleArea = calculator.calculate(rectangle);
        System.out.println("Rectangle area (4x6): " + rectangleArea);
        
        // ❌ Problem: To add Triangle, we must modify AreaCalculator class!
        // This violates Open/Closed Principle - we're modifying existing code
    }
}
