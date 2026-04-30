# sym-ui

개인 범용 React 디자인 시스템. shadcn/ui 식 **소스 복사 모델** 로 배포한다.

> 정체성: 컴포넌트를 npm 모듈로 import 하는 대신, CLI 가 컴포넌트 소스를 소비 프로젝트의
> `components/ui/` 로 복사한다. 토큰/Tailwind preset 만 패키지로 공유한다. 복사된 소스는
> 프로젝트별로 자유롭게 수정 가능. 본 모노레포의 `@sym/ui` 는 stories/test 검증용이며
> npm 에 라이브러리로 배포하지 않는다 (`private: true`).

## 설치

```bash
cd my-app
npx @sym/ui-cli@latest init                  # tailwind preset 자동 패치 + 토큰 globals.css 주입
npx @sym/ui-cli@latest add button input form # 의존 컴포넌트(label 등) 까지 재귀 복사
```

`init` 이 처리하는 것:

- `tailwind.config.{cjs,js}` 의 `presets` 배열에 `@sym/ui/tailwind.preset` 자동 주입
  (`.ts/.mjs` 는 자동 패치 실패 시 수동 추가 안내 출력)
- `app/globals.css` (또는 `src/styles/globals.css` 등) 에 시맨틱 토큰 CSS 변수 + Tailwind
  지시문 주입 (`--background`, `--primary`, `--border`, ... 18종 + light/dark 양쪽)
- `src/lib/utils.ts` 에 `cn()` 유틸 작성, `clsx` / `tailwind-merge` / `cva` 자동 설치

`add` 가 처리하는 것:

- `internalDeps` 를 따라 종속 컴포넌트 재귀 복사 (`combobox` → `popover` + `command` +
  `button` 자동 동반, `form` → `label` 자동 동반)
- 컴포넌트별 `dependencies` (Radix 프리미티브 등) 를 통합해 한 번에 설치

## 컴포넌트 카탈로그 (36개)

- **Tier 1 — Core (8)**: Button / Input / Label / Card / Badge / Avatar / Tooltip / Toast
- **Tier 2 — Forms & Modals (7)**: Dialog / DropdownMenu / Select / Checkbox / Switch / Tabs / Skeleton
- **Tier 3 — Full Suite (11)**: Popover / Accordion / Progress / RadioGroup / Sheet / Command / Combobox / DataTable / Calendar / DatePicker / Form
- **Tier 4 — v0.2.0 추가 (10)**: Separator / Alert / Breadcrumb / Pagination / Slider / NumberInput / Drawer / Stepper / EmptyState / FileUpload

전부 다크모드 + 시맨틱 토큰 기반. Card / Badge / Button / Breadcrumb 은 `asChild` 로
다른 태그(Link 등) 위에 스타일을 입힐 수 있다. Trigger 계열은 Radix Primitive 의
`asChild` 가 자동 통과된다.

## 디자인 토큰

- **Color**: primary 11단계 (50-950) + neutral 11단계 + semantic (success/warning/danger/info)
- **Semantic CSS variables (light/dark)**: background / foreground / surface / surface-elevated /
  muted / muted-foreground / border / input / ring / primary / primary-foreground / accent /
  accent-foreground / destructive / destructive-foreground / popover / popover-foreground / overlay
- **Typography**: caption / small / body / h3 / h2 / h1 / display (Pretendard Variable + IBM Plex Mono)
- **Spacing**: 4px 기반 13단계 (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- **Radius**: 7단계 (none / sm / base / md / lg / xl / full)
- **Shadow**: 4단계 (sm / md / lg / xl)
- **Motion (v0.2.0 신규)**:
  - `duration`: instant(0) / fast(150) / base(200) / slow(300) / slower(500) ms
  - `easing`: standard / decelerate / accelerate / emphasized
  - Tailwind 유틸: `duration-fast`, `ease-standard` 등으로 사용

다크 팔레트는 절대 밝기 **L >= 15%** 규칙을 준수한다 (검정에 가까운 배경 회피).

## 접근성

- Radix UI 프리미티브 위에 빌드 → 키보드 네비게이션, focus management, ARIA 속성 기본 제공
- Storybook 8 의 `addon-a11y` 가 dev 시 axe 위반 표시
- **CI 자동 검사 (v0.2.0 신규)**: `@storybook/test-runner` + `axe-playwright` 가
  storybook 빌드본을 Headless Chromium 에서 순회하며 모든 stories 의 WCAG 2.1 AA 위반을
  자동 차단 (`.github/workflows/ci.yml` 의 `a11y` job)

## 로컬 개발

```bash
pnpm install
pnpm dev            # storybook
pnpm test           # vitest (단위 테스트)
pnpm typecheck      # tsc --noEmit
pnpm lint
pnpm build

# 접근성 자동 검증 (로컬)
pnpm --filter docs build
pnpm --filter docs test:a11y:ci
```

## 시각 회귀 (v0.7.0)

핵심 10개 stories (Patterns + 토큰 영향이 큰 Components) 의 스크린샷을 베이스라인과 비교.
CI 의 `visual` job 이 PR 에서 차단한다.

```bash
# 로컬 visual run (베이스라인이 있어야 함)
pnpm --filter docs build
pnpm --filter docs visual

# 베이스라인 갱신 (의도적인 시각 변경 후)
pnpm --filter docs visual:update

# 실패 보고서 (diff 이미지) 보기
pnpm --filter docs visual:report
```

**OS 일관성 주의**: 폰트 anti-aliasing 차이로 Windows / macOS / Ubuntu 베이스라인이 미세하게
다르다. 베이스라인은 **CI 와 동일한 ubuntu-jammy 환경** 에서 생성하는 것이 표준:

```bash
docker run --rm -v %CD%:/work -w /work mcr.microsoft.com/playwright:v1.59.1-jammy \
  pnpm --filter docs visual:update
```

생성된 `apps/docs/tests/visual/__screenshots__/*.png` 를 git 에 commit.

## 배포

- `@sym/ui-cli` 는 `npm` 에 publish (changesets + GitHub Actions release.yml)
- `@sym/ui` 는 `private: true`. 배포 산출물 아님. 모노레포 내부에서 stories/test 만 사용.
- `registry.json` 은 CLI 빌드 시 `pnpm registry:build` 로 `packages/ui/src/components/`
  와 `packages/ui/templates/globals.css` 를 스캔해 생성

## 스택

React 18, TypeScript 5 (strict), Tailwind v3 (+ tailwindcss-animate), Radix UI, CVA, cmdk,
TanStack Table, react-day-picker, react-hook-form + zod, Storybook 8, Vitest, Turborepo,
@storybook/test-runner + axe-playwright (CI a11y).

## 문서

https://ymseo.github.io/sym-ui (Storybook 자동 배포)
