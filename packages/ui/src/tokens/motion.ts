// packages/ui/src/tokens/motion.ts
// 모션 토큰. UI 인터랙션 일관성을 위해 컴포넌트 간 공유한다.
//   duration: 0ms (instant) / 150 (fast, hover/focus) / 200 (base, popover/dropdown)
//             / 300 (slow, dialog/sheet) / 500 (slower, page transition)
//   easing  : standard (대부분 use case) / decelerate (entering, slide-in)
//             / accelerate (exiting, slide-out) / emphasized (강조 모션)
export const duration = Object.freeze({
  instant: "0ms",
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
});

export const easing = Object.freeze({
  linear: "linear",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
});

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;

export const motion = Object.freeze({ duration, easing });
