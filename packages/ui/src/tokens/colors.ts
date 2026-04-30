// packages/ui/src/tokens/colors.ts
// Primary 는 v0.3.0 부터 Indigo 스케일을 사용한다 (이전: Tailwind blue).
// Tailwind blue 그대로 사용 시 brand 식별력이 약하다는 평가에 따른 변경.
export const primary = {
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
  950: "#1e1b4b",
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
