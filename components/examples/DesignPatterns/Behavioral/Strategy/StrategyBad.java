// ❌ The Bad Way (If/Else Hell)
// Navigation app with bloated Navigator class
// Using conditional statements for different algorithms

// Point class for coordinates
class Point {
    private double lat;
    private double lng;
    
    public Point(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }
    
    public double getLat() { return lat; }
    public double getLng() { return lng; }
    
    @Override
    public String toString() {
        return "(" + lat + ", " + lng + ")";
    }
}

class NavigatorBad {
    private Point origin;
    private Point destination;
    private String routeType;
    
    public NavigatorBad(Point origin, Point destination, String routeType) {
        this.origin = origin;
        this.destination = destination;
        this.routeType = routeType;
    }
    
    // ❌ BAD: Massive conditional logic - bloated method
    public Point[] buildRoute() {
        if (routeType.equals("driving")) {
            // Complex driving route calculation
            System.out.println("Calculating driving route...");
            return calculateDrivingRoute();
        } else if (routeType.equals("walking")) {
            // Complex walking route calculation
            System.out.println("Calculating walking route...");
            return calculateWalkingRoute();
        } else if (routeType.equals("transit")) {
            // Complex transit route calculation
            System.out.println("Calculating transit route...");
            return calculateTransitRoute();
        } else if (routeType.equals("cycling")) {
            // Complex cycling route calculation
            System.out.println("Calculating cycling route...");
            return calculateCyclingRoute();
        }
        return new Point[0];
    }
    
    // ❌ Problem: Each new routing algorithm doubles the class size
    private Point[] calculateDrivingRoute() {
        // Complex algorithm for roads
        return new Point[] {
            origin,
            new Point((origin.getLat() + destination.getLat()) / 2, 
                     (origin.getLng() + destination.getLng()) / 2),
            destination
        };
    }
    
    private Point[] calculateWalkingRoute() {
        // Complex algorithm for sidewalks
        return new Point[] { origin, destination };
    }
    
    private Point[] calculateTransitRoute() {
        // Complex algorithm for public transport
        return new Point[] {
            origin,
            new Point(0, 0), // Bus stop
            new Point(1, 1), // Train station
            destination
        };
    }
    
    private Point[] calculateCyclingRoute() {
        // Complex algorithm for bike paths
        return new Point[] {
            origin,
            new Point(0.5, 0.5), // Bike path entry
            destination
        };
    }
    
    // ❌ Problems:
    // - Any change risks breaking existing code
    // - Merge conflicts for teammates
    // - Hard to add new routing algorithms (e.g., tourist routes)
    // - Violates Open/Closed Principle
    // - Algorithm logic mixed with Navigator class
}

// Usage example
class App {
    public static void main(String[] args) {
        Point origin = new Point(40.7128, -74.0060); // NYC
        Point destination = new Point(40.7589, -73.9851); // Times Square
        
        // Process different route types
        NavigatorBad nav1 = new NavigatorBad(origin, destination, "driving");
        Point[] route1 = nav1.buildRoute();
        System.out.println("Driving route: " + java.util.Arrays.toString(route1));
        
        NavigatorBad nav2 = new NavigatorBad(origin, destination, "walking");
        Point[] route2 = nav2.buildRoute();
        System.out.println("Walking route: " + java.util.Arrays.toString(route2));
        
        NavigatorBad nav3 = new NavigatorBad(origin, destination, "transit");
        Point[] route3 = nav3.buildRoute();
        System.out.println("Transit route: " + java.util.Arrays.toString(route3));
        
        // ❌ Problem: To add a new route type (e.g., "tourist"),
        // we must modify the buildRoute() method and add calculateTouristRoute()
        // ❌ Violates Open/Closed Principle
        // ❌ The Navigator class becomes bloated with each new algorithm
    }
}
