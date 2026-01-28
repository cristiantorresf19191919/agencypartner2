export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Converts Tailwind gradient classes (e.g., "from-indigo-500 to-purple-500") 
 * to valid CSS color values for use with MUI's alpha function.
 * Extracts the first color from the gradient and converts it to hex.
 */
export function normalizeColorForMUI(color?: string): string {
  if (!color) return "#a06af9"; // Default fallback color
  
  // If it's already a valid CSS color (starts with #, rgb, rgba, hsl, hsla, or color())
  if (/^(#|rgb|rgba|hsl|hsla|color\(\))/.test(color.trim())) {
    return color;
  }
  
  // If it's a Tailwind gradient class (e.g., "from-indigo-500 to-purple-500")
  if (color.includes("from-")) {
    // Extract the first color from the gradient
    const match = color.match(/from-(\w+)-(\d+)/);
    if (match) {
      const [, colorName, shade] = match;
      return tailwindColorToHex(colorName, parseInt(shade));
    }
  }
  
  // If it's a simple Tailwind color class (e.g., "indigo-500")
  const simpleMatch = color.match(/(\w+)-(\d+)/);
  if (simpleMatch) {
    const [, colorName, shade] = simpleMatch;
    return tailwindColorToHex(colorName, parseInt(shade));
  }
  
  // Fallback to default if we can't parse it
  return "#a06af9";
}

/**
 * Converts Tailwind color name and shade to hex value
 */
function tailwindColorToHex(colorName: string, shade: number): string {
  const colorMap: Record<string, Record<number, string>> = {
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
    violet: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    cyan: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },
    emerald: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    teal: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    yellow: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
    },
    orange: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9f1239",
      900: "#831843",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  };
  
  const normalizedName = colorName.toLowerCase();
  const colorShades = colorMap[normalizedName];
  
  if (colorShades && colorShades[shade]) {
    return colorShades[shade];
  }
  
  // Fallback to a default color if not found
  return "#a06af9";
}
