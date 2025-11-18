'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectAdvisorContextType {
  isOpen: boolean;
  openAdvisor: () => void;
  closeAdvisor: () => void;
}

const ProjectAdvisorContext = createContext<ProjectAdvisorContextType | undefined>(undefined);

export function ProjectAdvisorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAdvisor = () => setIsOpen(true);
  const closeAdvisor = () => setIsOpen(false);

  return (
    <ProjectAdvisorContext.Provider value={{ isOpen, openAdvisor, closeAdvisor }}>
      {children}
    </ProjectAdvisorContext.Provider>
  );
}

export function useProjectAdvisor() {
  const context = useContext(ProjectAdvisorContext);
  if (context === undefined) {
    throw new Error('useProjectAdvisor must be used within a ProjectAdvisorProvider');
  }
  return context;
}

