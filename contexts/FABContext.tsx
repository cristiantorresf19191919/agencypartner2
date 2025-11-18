'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FABContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FABContext = createContext<FABContextType | undefined>(undefined);

export function FABProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FABContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </FABContext.Provider>
  );
}

export function useFAB() {
  const context = useContext(FABContext);
  if (context === undefined) {
    throw new Error('useFAB must be used within a FABProvider');
  }
  return context;
}

