// packages/ui/src/tokens/motion.ts
// 모션 토큰. UI 인터랙션 일관성을 위해 컴포넌트 간 공유한다.
//   duration: 0ms (instant) / 150 (fast, hover/focus) / 200 (base, popover/dropdown)
//             / 300 (slow, dialog/sheet) / 500 (slower, page transition)
//   easing  : standard (대부분 use case) / decelerate (entering, slide-in)
//             / accelerate (exiting, slide-out) / emphasized (강조 모션)
//
// easing 곡선의 의도:
//   - standard / decelerate / accelerate 는 Material Design 2 + Tailwind 기본값과
//     호환되는 곡선으로 의도적으로 선택했다 (transition-* 유틸리티와 함께 자연스럽게
//     섞이도록). Material Design 3 의 standard easing (cubic-bezier(0.2,0,0,1)) 은
//     본 토큰의 emphasized 와 매핑된다.
//   - M3 에 더 가까운 디자인이 필요한 프로젝트는 Tailwind preset 의 transitionTimingFunction
//     항목을 그대로 override 하면 된다 (preset 합성 시 후순위가 우선).
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
