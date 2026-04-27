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

/**
 * 다크 모드 시맨틱 토큰 (CSS variables, L >= 15 절대 밝기 규칙 준수).
 * 실제 값은 templates/globals.css 의 :root / .dark 에서 주입된다.
 * Tailwind 유틸: bg-background / bg-surface / bg-muted / text-foreground / text-muted-foreground / border-border / ring-ring 등
 */
export const semanticTokens = [
  "background", "foreground",
  "surface", "surface-elevated",
  "muted", "muted-foreground",
  "border", "input", "ring",
  "primary", "primary-foreground",
  "accent", "accent-foreground",
  "destructive", "destructive-foreground",
  "popover", "popover-foreground",
] as const;
export type SemanticToken = (typeof semanticTokens)[number];

export const colors = { primary, neutral, semantic } as const;
export type ColorScale = typeof primary;
export type SemanticColor = keyof typeof semantic;
