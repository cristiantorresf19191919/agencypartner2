'use client';

import { ProjectAdvisorStepper } from './ProjectAdvisorStepper';
import { useProjectAdvisor } from '@/contexts/ProjectAdvisorContext';

export function ProjectAdvisorWrapper() {
  const { isOpen, closeAdvisor } = useProjectAdvisor();
  return <ProjectAdvisorStepper open={isOpen} onClose={closeAdvisor} />;
}

