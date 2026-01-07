// ✅ The Good Way (Singleton-like Pattern in React)
// In React, we use Context API or module-level instances for singleton-like behavior

import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Module-level singleton instance
class ConfigService {
  private static instance: ConfigService;
  private settings: Record<string, any> = {};

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  setSetting(key: string, value: any) {
    this.settings[key] = value;
  }

  getSetting(key: string) {
    return this.settings[key];
  }
}

// ✅ Better: Use React Context (more React-idiomatic)
interface ConfigContextType {
  settings: Record<string, any>;
  setSetting: (key: string, value: any) => void;
  getSetting: (key: string) => any;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});

  const setSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getSetting = (key: string) => {
    return settings[key];
  };

  return (
    <ConfigContext.Provider value={{ settings, setSetting, getSetting }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};

// Usage
const ComponentA = () => {
  const { setSetting } = useConfig();
  setSetting("theme", "dark");
  return <div>Component A</div>;
};

const ComponentB = () => {
  const { getSetting } = useConfig();
  // ✅ Now has access to ComponentA's settings
  const theme = getSetting("theme"); // "dark"
  return <div>Component B - Theme: {theme}</div>;
};

const App = () => {
  return (
    <ConfigProvider>
      <ComponentA />
      <ComponentB />
    </ConfigProvider>
  );
};

export default App;





