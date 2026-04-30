// packages/ui/src/tokens/colors.ts
//
// 토큰 계층 (3 단계):
//   1. Primitive   - primary, neutral, semantic (이 파일)
//   2. Semantic    - background, foreground, surface, muted, ring 등 (templates/globals.css)
//   3. Intent      - status (success/warning/danger/info × bg/fg), surface (subtle/raised),
//                    interactive (hover/active), focus-ring (templates/globals.css)
// 컴포넌트는 가능한 한 Intent / Semantic 토큰만 참조하고, Primitive 직접 사용은 피한다.

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

// Brand accent (v0.5.0 도입). indigo primary 의 보조 시그니처. 차분한 teal 계열.
// 사용 가이드: link hover 강조, badge accent, 서브 헤딩의 강조 색 등 "primary 가 아닌
// 곳" 에서 brand 정체성을 유지하기 위한 색조.
export const accent = {
  brand: {
    light: "#0d9488", // teal-600 (light 모드의 --accent-brand)
    dark: "#2dd4bf",  // teal-400 (dark 모드의 --accent-brand)
  },
} as const;

/**
 * 다크 모드 시맨틱 토큰 (CSS variables, L >= 15 절대 밝기 규칙 준수).
 * 실제 값은 templates/globals.css 의 :root / .dark 에서 주입된다.
 * Tailwind 유틸: bg-background / bg-surface / bg-muted / text-foreground / text-muted-foreground / border-border / ring-focus-ring 등
 */
export const semanticTokens = [
  "background", "foreground",
  "surface", "surface-elevated", "surface-subtle", "surface-raised",
  "muted", "muted-foreground",
  "border", "input", "ring", "focus-ring",
  "primary", "primary-foreground",
  "accent", "accent-foreground", "accent-brand",
  "destructive", "destructive-foreground",
  "popover", "popover-foreground",
  "overlay",
] as const;
export type SemanticToken = (typeof semanticTokens)[number];

/**
 * Intent 토큰 (status × bg/fg, interactive layer). v0.5.0 도입.
 * Tailwind 유틸 예: bg-status-success-bg text-status-success-fg, bg-interactive-hover.
 */
export const intentTokens = [
  "status-success-bg", "status-success-fg",
  "status-warning-bg", "status-warning-fg",
  "status-danger-bg", "status-danger-fg",
  "status-info-bg", "status-info-fg",
  "interactive-hover", "interactive-active",
] as const;
export type IntentToken = (typeof intentTokens)[number];

export const colors = { primary, neutral, semantic, accent } as const;
export type ColorScale = typeof primary;
export type SemanticColor = keyof typeof semantic;
