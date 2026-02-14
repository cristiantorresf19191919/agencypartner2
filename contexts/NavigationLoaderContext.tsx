'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationLoaderContextType {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType | undefined>(undefined);

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const pathname = usePathname();

  const showLoader = useCallback((msg?: string) => {
    setMessage(msg || 'Loading...');
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage('');
  }, []);

  // Auto-hide when the route changes (navigation completed)
  useEffect(() => {
    hideLoader();
  }, [pathname, hideLoader]);

  return (
    <NavigationLoaderContext.Provider value={{ isLoading, message, showLoader, hideLoader }}>
      {children}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);
  if (context === undefined) {
    throw new Error('useNavigationLoader must be used within a NavigationLoaderProvider');
  }
  return context;
}
