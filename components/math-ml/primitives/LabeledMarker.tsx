"use client";

import React from "react";
import { Point, Text } from "mafs";

const COLORS = {
  emerald: "#34D399",
  blue: "#60A5FA",
  amber: "#FBBF24",
  violet: "#C4B5FD",
  red: "#F87171",
  white: "#F8FAFC",
} as const;

export type MarkerKind =
  | "star"     // ★  minimum / extremum
  | "square"   // ■  solution / fixed point
  | "ring"     // ◎  eigen-fixed
  | "dot"      // •  generic data point
  | "diamond"; // ◆  saddle / inflection

const KIND_GLYPH: Record<MarkerKind, string> = {
  star: "★",
  square: "■",
  ring: "◎",
  dot: "•",
  diamond: "◆",
};

export type AccentName = keyof typeof COLORS;

export interface LabeledMarkerProps {
  x: number;
  y: number;
  label: string;
  kind?: MarkerKind;
  accent?: AccentName;
  /** Where the label sits relative to the point. */
  attach?: "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
  attachDistance?: number;
  size?: number;
}

/**
 * A point + adjacent caption with a glyph prefix. Drop into any Mafs `<Mafs>`
 * tree to annotate the lesson's hero coordinate (minimum, intersection,
 * eigen-fixed point, etc.) without re-implementing positioning per viz.
 */
export function LabeledMarker({
  x,
  y,
  label,
  kind = "dot",
  accent = "emerald",
  attach = "ne",
  attachDistance = 16,
  size = 14,
}: LabeledMarkerProps) {
  const color = COLORS[accent];
  return (
    <>
      <Point x={x} y={y} color={color} />
      <Text
        x={x}
        y={y}
        attach={attach}
        attachDistance={attachDistance}
        color={color}
        size={size}
      >
        {`${KIND_GLYPH[kind]}  ${label}`}
      </Text>
    </>
  );
}

export default LabeledMarker;
