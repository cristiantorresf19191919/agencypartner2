// ❌ The Bad Way (If/Else Hell)
// Navigation app with bloated Navigator class
// Using conditional statements for different algorithms

import React, { useState } from "react";

interface Point {
  lat: number;
  lng: number;
}

type RouteType = 'driving' | 'walking' | 'transit' | 'cycling';

// ❌ Problem: Lots of if/else logic, bloated class
const NavigationAppBad = () => {
  const [routeType, setRouteType] = useState<RouteType>("driving");
  const [origin, setOrigin] = useState<Point>({ lat: 40.7128, lng: -74.0060 });
  const [destination, setDestination] = useState<Point>({ lat: 40.7589, lng: -73.9851 });

  // ❌ BAD: Massive conditional logic - bloated function
  const buildRoute = (origin: Point, destination: Point): Point[] => {
    if (routeType === 'driving') {
      // Complex driving route calculation
      console.log('Calculating driving route...');
      return calculateDrivingRoute(origin, destination);
    } else if (routeType === 'walking') {
      // Complex walking route calculation
      console.log('Calculating walking route...');
      return calculateWalkingRoute(origin, destination);
    } else if (routeType === 'transit') {
      // Complex transit route calculation
      console.log('Calculating transit route...');
      return calculateTransitRoute(origin, destination);
    } else if (routeType === 'cycling') {
      // Complex cycling route calculation
      console.log('Calculating cycling route...');
      return calculateCyclingRoute(origin, destination);
    }
    return [];
  };

  // ❌ Problem: Each new routing algorithm doubles the code
  const calculateDrivingRoute = (origin: Point, destination: Point): Point[] => {
    // Complex algorithm for roads
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 },
      { lat: destination.lat, lng: destination.lng }
    ];
  };

  const calculateWalkingRoute = (origin: Point, destination: Point): Point[] => {
    // Complex algorithm for sidewalks
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: destination.lat, lng: destination.lng }
    ];
  };

  const calculateTransitRoute = (origin: Point, destination: Point): Point[] => {
    // Complex algorithm for public transport
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0, lng: 0 }, // Bus stop
      { lat: 1, lng: 1 }, // Train station
      { lat: destination.lat, lng: destination.lng }
    ];
  };

  const calculateCyclingRoute = (origin: Point, destination: Point): Point[] => {
    // Complex algorithm for bike paths
    return [
      { lat: origin.lat, lng: origin.lng },
      { lat: 0.5, lng: 0.5 }, // Bike path entry
      { lat: destination.lat, lng: destination.lng }
    ];
  };

  const handleCalculateRoute = () => {
    const route = buildRoute(origin, destination);
    console.log(`Rendering ${routeType} route:`, route);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Navigation App (Bad Example)</h2>
      
      <div className="space-y-2">
        <label className="block font-semibold">Route Type:</label>
        <select 
          value={routeType} 
          onChange={(e) => setRouteType(e.target.value as RouteType)}
          className="border rounded px-3 py-2"
        >
          <option value="driving">Driving</option>
          <option value="walking">Walking</option>
          <option value="transit">Public Transport</option>
          <option value="cycling">Cycling</option>
        </select>
      </div>

      <button 
        onClick={handleCalculateRoute}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Calculate Route
      </button>

      {/* ❌ Problems:
          - Complex conditionals
          - Any change risks breaking existing code
          - Merge conflicts for teammates
          - Hard to add new routing algorithms (e.g., tourist routes)
          - Violates Open/Closed Principle
          - Algorithm logic mixed with component
          - Each new algorithm doubles the code size */}
    </div>
  );
};

export { NavigationAppBad };






