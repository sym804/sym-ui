// packages/ui/src/tokens/colors.ts
export const primary = {
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
  950: "#172554",
} as const;

export const neutral = {
  50: "#fafaf9",
  100: "#f5f4f2",
  200: "#e7e5e1",
  300: "#d3d0ca",
  400: "#a8a49c",
  500: "#78746c",
  600: "#57544e",
  700: "#433f3b",
  800: "#2a2724",
  900: "#1a1815",
  950: "#0f0e0c",
} as const;

export const semantic = {
  success: "#12b76a",
  warning: "#f2a900",
  danger: "#f04438",
  info: "#3d7eff",
} as const;

export const colors = { primary, neutral, semantic } as const;
export type ColorScale = typeof primary;
export type SemanticColor = keyof typeof semantic;
