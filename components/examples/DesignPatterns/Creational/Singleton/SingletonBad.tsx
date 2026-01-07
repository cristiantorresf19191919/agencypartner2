// ❌ The Bad Way (Not a True Singleton in React)
// In React, we typically don't use Singleton pattern directly,
// but we can demonstrate the anti-pattern of creating multiple instances

import React, { createContext, useContext, useState } from "react";

// ❌ Problem: Each component creates its own instance
class ConfigService {
  private settings: Record<string, any> = {};

  setSetting(key: string, value: any) {
    this.settings[key] = value;
  }

  getSetting(key: string) {
    return this.settings[key];
  }
}

// ❌ Each component gets a different instance
const ComponentA = () => {
  const config = new ConfigService(); // New instance!
  config.setSetting("theme", "dark");
  return <div>Component A</div>;
};

const ComponentB = () => {
  const config = new ConfigService(); // Different instance!
  // ❌ Won't have access to ComponentA's settings
  console.log(config.getSetting("theme")); // undefined
  return <div>Component B</div>;
};




