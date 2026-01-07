"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AccordionContextType {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within Accordion");
  }
  return context;
}

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: number | null;
}

function AccordionRoot({ children, defaultOpen = null }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  index: number;
  children: ReactNode;
}

function AccordionItem({ index, children }: AccordionItemProps) {
  const { openIndex, setOpenIndex } = useAccordion();
  const isOpen = openIndex === index;

  const childrenArray = React.Children.toArray(children);
  let headerElement: ReactNode = null;
  let contentElement: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const displayName = (child.type as any)?.displayName;
      if (displayName === "AccordionHeader") {
        headerElement = child;
      } else if (displayName === "AccordionContent") {
        contentElement = child;
      }
    }
  });

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      <div onClick={() => setOpenIndex(isOpen ? null : index)} role="button" tabIndex={0}>
        {headerElement}
      </div>
      {isOpen && contentElement}
    </div>
  );
}

interface AccordionHeaderProps {
  children: ReactNode;
}

function AccordionHeader({ children }: AccordionHeaderProps) {
  const { openIndex } = useAccordion();
  // We need to know which item this header belongs to
  // This is a simplified version - in practice, you might want a different approach
  
  return (
    <div className="w-full px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-between cursor-pointer">
      {children}
      <span className="ml-2 text-zinc-500">+</span>
    </div>
  );
}
AccordionHeader.displayName = "AccordionHeader";

interface AccordionContentProps {
  children: ReactNode;
}

function AccordionContent({ children }: AccordionContentProps) {
  return (
    <div className="px-4 py-3 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">
      {children}
    </div>
  );
}
AccordionContent.displayName = "AccordionContent";

// Create compound component
const Accordion = AccordionRoot as any;
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

export default Accordion;
