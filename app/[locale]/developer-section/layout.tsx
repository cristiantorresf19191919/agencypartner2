import { ReactNode } from "react";
import { DeveloperSectionFontProvider } from "@/contexts/DeveloperSectionFontContext";
import { CommandPaletteProvider } from "@/contexts/CommandPaletteContext";
import CommandPalette from "@/components/Search/CommandPalette";

type DeveloperSectionLayoutProps = {
  children: ReactNode;
};

export default function DeveloperSectionLayout({ children }: DeveloperSectionLayoutProps) {
  return (
    <CommandPaletteProvider>
      <DeveloperSectionFontProvider>
        {children}
        <CommandPalette />
      </DeveloperSectionFontProvider>
    </CommandPaletteProvider>
  );
}
