"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DeveloperSectionFontProvider } from "@/contexts/DeveloperSectionFontContext";
import { CommandPaletteProvider } from "@/contexts/CommandPaletteContext";
import CommandPalette from "@/components/Search/CommandPalette";

type DeveloperSectionLayoutProps = {
  children: ReactNode;
};

export default function DeveloperSectionLayout({ children }: DeveloperSectionLayoutProps) {
  const pathname = usePathname();

  return (
    <CommandPaletteProvider>
      <DeveloperSectionFontProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <CommandPalette />
      </DeveloperSectionFontProvider>
    </CommandPaletteProvider>
  );
}
