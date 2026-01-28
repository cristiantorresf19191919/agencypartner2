// ✅ The Good Way (Strategy Pattern)
// Navigation app with interchangeable routing strategies
// Encapsulate algorithms in separate classes

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

// ✅ Strategy interface
// Common interface for all routing algorithms
interface RouteStrategy {
    Point[] buildRoute(Point origin, Point destination);
    String getName();
}

// ✅ Concrete strategies
// Each routing algorithm encapsulated in its own class

class DrivingStrategy implements RouteStrategy {
    @Override
    public Point[] buildRoute(Point origin, Point destination) {
        System.out.println("Calculating driving route over roads...");
        // Complex algorithm for roads
        return new Point[] {
            origin,
            new Point((origin.getLat() + destination.getLat()) / 2, 
                     (origin.getLng() + destination.getLng()) / 2),
            destination
        };
    }
    
    @Override
    public String getName() {
        return "Driving Route";
    }
}

class WalkingStrategy implements RouteStrategy {
    @Override
    public Point[] buildRoute(Point origin, Point destination) {
        System.out.println("Calculating walking route via sidewalks...");
        // Complex algorithm for sidewalks and pedestrian paths
        return new Point[] { origin, destination };
    }
    
    @Override
    public String getName() {
        return "Walking Route";
    }
}

class TransitStrategy implements RouteStrategy {
    @Override
    public Point[] buildRoute(Point origin, Point destination) {
        System.out.println("Calculating public transport route...");
        // Complex algorithm for buses, trains, etc.
        return new Point[] {
            origin,
            new Point(0, 0), // Bus stop
            new Point(1, 1), // Train station
            destination
        };
    }
    
    @Override
    public String getName() {
        return "Public Transport Route";
    }
}

class CyclingStrategy implements RouteStrategy {
    @Override
    public Point[] buildRoute(Point origin, Point destination) {
        System.out.println("Calculating cycling route via bike paths...");
        // Complex algorithm for bike paths
        return new Point[] {
            origin,
            new Point(0.5, 0.5), // Bike path entry
            destination
        };
    }
    
    @Override
    public String getName() {
        return "Cycling Route";
    }
}

// ✅ Context class (Navigator)
// Holds reference to strategy and delegates work to it
class Navigator {
    private RouteStrategy routeStrategy;
    
    public Navigator(RouteStrategy routeStrategy) {
        this.routeStrategy = routeStrategy;
    }
    
    // ✅ GOOD: Can change strategy at runtime
    public void setRouteStrategy(RouteStrategy strategy) {
        this.routeStrategy = strategy;
    }
    
    // ✅ GOOD: Delegates to strategy - no conditionals
    public Point[] buildRoute(Point origin, Point destination) {
        return routeStrategy.buildRoute(origin, destination);
    }
    
    public void renderRoute(Point origin, Point destination) {
        Point[] checkpoints = buildRoute(origin, destination);
        System.out.println("Rendering " + routeStrategy.getName() + ":");
        for (Point checkpoint : checkpoints) {
            System.out.println("  Checkpoint: " + checkpoint);
        }
        // Render checkpoints on map
    }
}

// Usage
class App {
    public static void main(String[] args) {
        Point origin = new Point(40.7128, -74.0060); // NYC
        Point destination = new Point(40.7589, -73.9851); // Times Square
        
        // ✅ Create navigator with different strategies
        Navigator drivingNav = new Navigator(new DrivingStrategy());
        drivingNav.renderRoute(origin, destination);
        
        Navigator walkingNav = new Navigator(new WalkingStrategy());
        walkingNav.renderRoute(origin, destination);
        
        // ✅ Can switch strategies at runtime
        Navigator nav = new Navigator(new DrivingStrategy());
        nav.renderRoute(origin, destination);
        
        nav.setRouteStrategy(new WalkingStrategy());
        nav.renderRoute(origin, destination);
        
        nav.setRouteStrategy(new TransitStrategy());
        nav.renderRoute(origin, destination);
        
        nav.setRouteStrategy(new CyclingStrategy());
        nav.renderRoute(origin, destination);
        
        // ✅ Benefits:
        // - No conditionals - strategy handles algorithm
        // - Easy to add new strategies (e.g., TouristRouteStrategy)
        // - Strategies are reusable across different navigators
        // - Follows Open/Closed Principle
        // - Each algorithm isolated and testable independently
    }
}






