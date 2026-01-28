// ✅ The Good Way (Strategy Pattern in React)
// Navigation app with interchangeable routing strategies
// Encapsulate algorithms in separate classes/functions

import React, { useState } from "react";

// ✅ Strategy interface
// Common interface for all routing algorithms
interface Point {
  lat: number;
  lng: number;
}

interface RouteStrategy {
  buildRoute: (origin: Point, destination: Point) => Point[];
  getName: () => string;
}

// ✅ Concrete strategies
// Each routing algorithm encapsulated in its own implementation

const drivingStrategy: RouteStrategy = {
  buildRoute: (origin: Point, destination: Point) => {
    console.log("Calculating driving route over roads...");
    // Complex algorithm for roads
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 },
      { lat: destination.lat, lng: destination.lng }
    ];
  },
  getName: () => "Driving Route"
};

const walkingStrategy: RouteStrategy = {
  buildRoute: (origin: Point, destination: Point) => {
    console.log("Calculating walking route via sidewalks...");
    // Complex algorithm for sidewalks and pedestrian paths
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: destination.lat, lng: destination.lng }
    ];
  },
  getName: () => "Walking Route"
};

const transitStrategy: RouteStrategy = {
  buildRoute: (origin: Point, destination: Point) => {
    console.log("Calculating public transport route...");
    // Complex algorithm for buses, trains, etc.
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0, lng: 0 }, // Bus stop
      { lat: 1, lng: 1 }, // Train station
      { lat: destination.lat, lng: destination.lng }
    ];
  },
  getName: () => "Public Transport Route"
};

const cyclingStrategy: RouteStrategy = {
  buildRoute: (origin: Point, destination: Point) => {
    console.log("Calculating cycling route via bike paths...");
    // Complex algorithm for bike paths
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0.5, lng: 0.5 }, // Bike path entry
      { lat: destination.lat, lng: destination.lng }
    ];
  },
  getName: () => "Cycling Route"
};

// ✅ Strategy map
const routeStrategies: Record<string, RouteStrategy> = {
  driving: drivingStrategy,
  walking: walkingStrategy,
  transit: transitStrategy,
  cycling: cyclingStrategy,
};

// ✅ Context class (using React hooks)
const useNavigator = (initialStrategy: RouteStrategy) => {
  const [strategy, setStrategy] = useState<RouteStrategy>(initialStrategy);

  const buildRoute = (origin: Point, destination: Point): Point[] => {
    return strategy.buildRoute(origin, destination);
  };

  const renderRoute = (origin: Point, destination: Point): void => {
    const checkpoints = buildRoute(origin, destination);
    console.log(`Rendering ${strategy.getName()}:`, checkpoints);
    // Render checkpoints on map
  };

  return {
    strategy,
    setStrategy,
    buildRoute,
    renderRoute,
    getStrategyName: () => strategy.getName()
  };
};

// ✅ Component using strategy pattern
const NavigationApp = () => {
  const [routeType, setRouteType] = useState<string>("driving");
  const [origin, setOrigin] = useState<Point>({ lat: 40.7128, lng: -74.0060 }); // NYC
  const [destination, setDestination] = useState<Point>({ lat: 40.7589, lng: -73.9851 }); // Times Square

  const navigator = useNavigator(routeStrategies[routeType]);

  const handleRouteChange = (newType: string) => {
    setRouteType(newType);
    navigator.setStrategy(routeStrategies[newType]);
  };

  const handleCalculateRoute = () => {
    navigator.renderRoute(origin, destination);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Navigation App</h2>
      
      <div className="space-y-2">
        <label className="block font-semibold">Route Type:</label>
        <select 
          value={routeType} 
          onChange={(e) => handleRouteChange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="driving">Driving</option>
          <option value="walking">Walking</option>
          <option value="transit">Public Transport</option>
          <option value="cycling">Cycling</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Origin:</label>
        <input
          type="text"
          placeholder="Lat, Lng"
          className="border rounded px-3 py-2 w-full"
          onChange={(e) => {
            const [lat, lng] = e.target.value.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              setOrigin({ lat, lng });
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Destination:</label>
        <input
          type="text"
          placeholder="Lat, Lng"
          className="border rounded px-3 py-2 w-full"
          onChange={(e) => {
            const [lat, lng] = e.target.value.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              setDestination({ lat, lng });
            }
          }}
        />
      </div>

      <button 
        onClick={handleCalculateRoute}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Calculate {navigator.getStrategyName()}
      </button>

      {/* ✅ Benefits:
          - No conditionals - strategy handles algorithm
          - Easy to add new strategies (e.g., TouristRouteStrategy)
          - Strategies are reusable across different navigators
          - Follows Open/Closed Principle
          - Each algorithm isolated and testable independently
          - Can switch strategies at runtime */}
    </div>
  );
};

export { NavigationApp, useNavigator };






