"use client";

import React from "react";

export const VizFullscreenContext = React.createContext<boolean>(false);

export function useVizFullscreen(): boolean {
  return React.useContext(VizFullscreenContext);
}
