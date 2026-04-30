# sym-ui Release Notes

## 버전 테이블

| 패키지 | 현재 버전 | 직전 버전 | 릴리즈 일자 |
|--------|-----------|-----------|-------------|
| @sym/ui | 0.2.0 | 0.1.0 | 2026-04-30 |
| @sym/ui-cli | 0.2.0 | 0.1.0 | 2026-04-30 |

---

## v0.2.0 - 2026-04-30

Codex 1차 외부 검토 5건 + Claude 종합 평가에서 도출된 4건의 약점을 일괄 해소. 핵심은
**CLI 설치 흐름 정상화 (init/add 가 실제로 동작하도록)**, 카탈로그 36개로 확장, 모션 토큰
도입, Storybook test-runner + axe 기반 a11y 자동 검증 도입, 정체성/스펙 문서 정리.

### Critical (2건)

- **CLI init 이 토큰 CSS 변수와 Tailwind preset 을 주입하지 않던 결함** (backend) -
  `init.ts:9` 의 `GLOBALS_CSS` 가 폰트 + Tailwind 지시문만 포함하고 `--background`,
  `--primary` 등 시맨틱 토큰을 누락. 또한 `tailwind.config` 에 preset 자동 패치 없이
  경고만 출력. 결과적으로 CLI 로 설치한 소비 프로젝트에서 `bg-background`, `bg-primary`
  등이 정상 렌더링되지 않았음. **수정**: `build-registry.ts` 가 `templates/globals.css`
  내용을 registry.json 의 `globalsCss` 필드로 임베드 → init 이 그대로 prepend. preset 은
  `.cjs/.js` 에 한해 regex 기반 자동 patch (presets 배열에 삽입 / module.exports 객체에
  주입 두 전략), `.ts/.mjs` 는 명확한 수동 안내 출력. (packages/cli/src/commands/init.ts,
  packages/cli/src/scripts/build-registry.ts, packages/cli/src/utils/registry.ts)

- **CLI add 가 internalDeps 를 따라가지 않던 결함** (backend) - `add.ts:52` 가 요청한
  컴포넌트 1개만 복사하고 `combobox` (popover/command/button 의존), `form` (label 의존),
  `date-picker` (calendar/popover/button 의존) 같은 합성 컴포넌트가 컴파일 실패하던
  상태. **수정**: `resolveDependencyClosure()` BFS 구현으로 internalDeps 그래프를
  순회하며 ordered list 를 계산해 누락 없이 복사. utils 는 init 이 이미 생성하므로
  SKIP 셋으로 제외. npm 의존성도 모든 종속 컴포넌트 분을 단일 install 로 묶어 호출.
  (packages/cli/src/commands/add.ts)

### Major (5건)

- **카탈로그 26개 → 36개 확장** (frontend) - Tier 4 신규: Separator, Alert (status/alert
  role 자동 분기), Breadcrumb (aria-label="Breadcrumb"), Pagination (aria-current="page"),
  Slider (Radix, 단일/range thumb 자동), NumberInput (Button + Input 합성), Drawer (Sheet
  의 bottom 변형 + drag handle), Stepper (ol + aria-current="step"), EmptyState (status
  region), FileUpload (button role + drag&drop, aria-describedby 힌트). 의존성에
  @radix-ui/react-separator, @radix-ui/react-slider 추가. (packages/ui/src/components/*,
  apps/docs/stories/components/*)

- **모션 토큰 도입** (frontend) - duration (instant/fast 150/base 200/slow 300/slower 500)
  + easing (standard/decelerate/accelerate/emphasized) 토큰 추가. Tailwind preset 의
  transitionDuration / transitionTimingFunction 으로 노출되어 `duration-fast`,
  `ease-standard` 클래스로 사용 가능. 이전엔 accordion-down/up 키프레임만 존재했음.
  (packages/ui/src/tokens/motion.ts, packages/ui/tailwind.preset.cjs)

- **a11y 자동 검증 CI 게이트 추가** (etc) - @storybook/test-runner + axe-playwright 도입.
  CI 의 a11y job 이 storybook 빌드본을 Headless Chromium 에서 순회하며 모든 stories 의
  WCAG 2.1 AA 위반을 자동 차단. landmark 단위 룰 (region) 만 stories scope 부적합으로
  비활성. (apps/docs/.storybook/test-runner.ts, apps/docs/package.json,
  .github/workflows/ci.yml)

- **README 정체성 명시 + 36개 카탈로그 + 모션 토큰 + a11y 자동화 반영** (etc) -
  Codex 5번 지적 (스펙/구현 불일치) 의 일부. shadcn 식 소스 복사 모델임을 README 상단에
  명시. @sym/ui 는 private:true 로 npm 미배포, @sym/ui-cli 만 배포한다는 분리 명확화.
  (README.md)

- **설계 스펙 문서를 Draft / Future Plan 으로 명시** (etc) - Codex 5번 지적의 잔여.
  Button loading prop, Label hint, --color-primary-500 명명, Chromatic, Husky 등이
  현재 구현에 없음을 표로 명시. 향후 작업 체크리스트로 보존.
  (docs/superpowers/specs/2026-04-24-design-system-design.md)

### Minor (3건)

- **asChild 패턴 일관성: Card, Badge 에 추가** (frontend) - 기존 Button 만 지원하던
  asChild 를 Card (Link 로 감쌀 때) 와 Badge (NavLink 등) 에도 노출. Trigger 계열은
  Radix Primitive 의 asChild 가 자동 통과되므로 별도 작업 불필요. (card.tsx, badge.tsx)

- **CLI tailwind.config 후보에 .cjs 추가** (backend) - findConfigFile 후보가
  `.ts/.js/.mjs` 만 검사하던 누락 보강. (packages/cli/src/commands/init.ts)

- **Slider 다중 thumb 자동 렌더** (frontend) - 초기 구현이 thumb 1개만 렌더해 range
  모드에서 thumb 갯수가 어긋남. defaultValue/value 의 length 만큼 동적 렌더로 수정.
  (packages/ui/src/components/slider.tsx)

### 검증 결과

- **로컬**: typecheck (@sym/ui, @sym/ui-cli, docs) ✅, lint (@sym/ui, @sym/ui-cli, docs) ✅,
  test 37 files / 79 tests ✅, @sym/ui-cli build ✅, registry:build (36 components +
  globalsCss) ✅
- **Codex 1차 외부 검토 5건**: CLI init 토큰 누락, CLI add internalDeps 누락, init preset
  자동 패치 부재, a11y 자동화 부재, 스펙/구현 불일치 → 5건 모두 본 릴리즈에서 해소
- **Codex v0.2.0 교차 검증**: 디스패치 후 결과는 v0.2.x patch 또는 별도 섹션에 후속 기록

### 호환성

- 기존 26개 컴포넌트 API 변경 없음. Card, Badge 에 `asChild?: boolean` prop 추가 (옵션).
- registry.json 스키마 변경 (`{ components: ... }` → `{ components: ..., globalsCss: ... }`).
  CLI 0.1.x 와는 호환되지 않으므로 CLI 도 함께 0.2.0 으로 bump.
- @sym/ui 는 여전히 private:true (배포되지 않음). @sym/ui-cli 만 npm 배포 대상.

---

## v0.1.0 - 2026-04-27

자체 검증 + Codex 1차 교차 검증 22건 + 2차 재검증 회귀 2건 + 3차 재검증 토큰 잔존 3건, 총 **27건의 이슈를 모두 수정**. 다크모드 토큰 시스템을 처음부터 다시 설계하고 26개 컴포넌트를 일괄 마이그레이션.

### Critical (4건)

- **다크 토큰 시스템 도입** (frontend) - shadcn 스타일 시맨틱 CSS 변수 (background, surface, muted, border, primary 등 18종) 를 :root / .dark 양쪽에 정의. 26개 컴포넌트의 `dark:[#hex]` 하드코딩을 모두 토큰으로 통일. (templates/globals.css, tailwind.preset.cjs, src/tokens/colors.ts)
- **다크 배경 절대 밝기 L >= 15 보장** (frontend) - 다크 --background L 6% → 15%, --surface 14.7% → 18%, --surface-elevated 22%. 글로벌 다크 팔레트 규칙 위반 해소.
- **Dialog 기본 a11y 위반 해소** (frontend) - DialogContent 가 aria-describedby 를 명시적 받아 Radix 경고 회피, 테스트/JSDoc 에 DialogDescription 권장 명시. (src/components/dialog.tsx, dialog.test.tsx)
- **Sheet 기본 a11y 위반 해소** (frontend) - 동일 패턴. (src/components/sheet.tsx, sheet.test.tsx)

### Major (14건)

- **Progress: max=0 NaN 가드** (frontend) - safeMax 변수로 0 이하 max 는 100 으로 보정. (src/components/progress.tsx)
- **CLI add 취소 시 크래시** (backend) - prompts cancel 시 selected 가 배열인지 확인 후 종료. (packages/cli/src/commands/add.ts)
- **CLI init 취소 시 크래시** (backend) - componentsDir 가 string 이고 비어있지 않은지 가드. (packages/cli/src/commands/init.ts)
- **CLI 설치 실패 무시** (backend) - installPackages 가 실패 코드 검사 후 InstallError throw, add/init 에서 catch. child error 핸들러 추가. (packages/cli/src/utils/runner.ts)
- **비핵심 hex 혼입 제거** (frontend) - #a3a6af, #3a3e4c, #ff6b6b 모두 시맨틱 토큰으로 치환.
- **Calendar day_disabled / day_range_middle 다크 누락** (frontend) - muted-foreground / muted 토큰으로 통일.
- **Input/Select 다크 포커스 링** (frontend) - primary-900/40 → ring 토큰으로 통일.
- **보더-배경 분리도** (frontend) - border 토큰 L=28, surface L=18 ΔL=10 확보.
- **Tooltip 다크 반전 버그** (frontend) - dark:bg-neutral-50 → bg-foreground text-background (양 모드 자동 반전).
- **Accent 색 혼용** (frontend) - blue-500 ↔ #3d7eff 모두 primary 토큰으로 통일.
- **DataTable 정렬 헤더 a11y** (frontend) - 정렬 가능 헤더를 button 으로 감싸고 aria-sort, Enter/Space, focus-visible 추가.
- **Accordion Trigger 포커스 링 추가** (frontend) - focus-visible:ring-ring + offset.
- **Calendar nav/day 포커스 링 추가** (frontend) - focus-visible:ring-ring + offset-1.
- **Combobox CommandInput 라벨** (frontend) - searchAriaLabel prop 노출, aria-label 자동 연결.

### Minor (4건)

- **Button asChild + Slot 패턴 추가** (frontend) - shadcn 표준 패턴. (src/components/button.tsx)
- **Disabled 색 통일** (frontend) - 모두 muted-foreground/40 또는 opacity-40 패턴.
- **보조 텍스트 대비 4.5:1 충족** (frontend) - muted-foreground L=70 (이전 #787b86 L=50 → AA 미달) 로 4.5:1 이상.
- **docs lint 9건** (etc) - Storybook stories 4개에서 render 함수를 실제 컴포넌트로 추출 (rules-of-hooks 위반 해소), eslint config 에서 `**/*.cjs` 무시.

### Codex 2차 재검증에서 발견된 회귀 2건 (수정 도중 발생, 같이 해소)

- **DataTable 정렬 button 의 onKeyDown 이중 토글** (Major, frontend) - 1차 수정에서 button 으로 감싸면서 onKeyDown 도 추가했는데 native button 의 Enter/Space 와 충돌해 토글이 두 번 발생할 수 있었음. onKeyDown 핸들러 제거하고 native onClick 만 유지.
- **Calendar day_range_middle 토큰 통일 누락** (Minor, frontend) - 1차 수정에서 `text-foreground` 로 잘못 적용. `text-muted-foreground` 로 통일.

### Codex 3차 재검증에서 발견된 토큰 잔존 3건 (수정 도중 발생, 같이 해소)

- **Avatar fallback 이 primary-500/700 + text-white 직접 사용** (Minor, frontend) - 토큰 마이그레이션 누락. `bg-primary text-primary-foreground` 로 통일.
- **Badge primary/danger variant 가 primary-50/700/950 등 직접 사용** (Minor, frontend) - 색조형 variant 누락. `bg-primary/15 text-primary`, `bg-destructive/10 text-destructive` 로 통일.
- **Dialog/Sheet overlay 가 bg-black/50 하드코딩** (Minor, frontend) - `--overlay` 토큰 도입 (light: 222 16% 6%, dark: 0 0% 0%) + tailwind preset 추가, `bg-overlay/50` 로 통일.

### 검증 결과

- **로컬 4종**: typecheck 3/3 ✅, lint 0 errors ✅, test 27 files / 61 tests ✅, build 성공 ✅
- **Codex 1차 교차 검증 (3축)**: 코드 품질 5건 / 접근성 7건 / 다크모드 9건 = 22건 → 전부 수정
- **Codex 2차 재검증 (3축)**: 코드 품질 잔존 0, 접근성 회귀 2건 → 즉시 수정, 다크모드 통과
- **Codex 3차 재검증 (다크모드)**: 토큰 잔존 3건 → 즉시 수정, 최종 통과 (대비비 7.22:1 AAA, L≥15 전부 충족, hex 잔존 0)

### 호환성

- 기존 컴포넌트 API 변경 없음. 단, Button 에 `asChild?: boolean` prop 이 추가됨.
- 다크 토큰 시스템은 신규 도입이지만 기존 Tailwind 색 스케일 (neutral, primary 50-950) 은 그대로 유지되어 backward compatible.

### v0.1.0 후속 (docs 영역, 라이브러리 출판물 영향 없음)

- **#28 Storybook preview.tsx wrapper decorator 토큰화** (Minor, etc) - Gemini 외부 평가에서 발견. v0.1.0 에서 Codex 가 `packages/ui/src/components/` 만 grep 해서 `apps/docs/.storybook/preview.tsx` 의 `dark:bg-[#131722] dark:text-[#d1d4dc]` 잔존 누락. `bg-background text-foreground` 로 교체. (apps/docs 만 영향)
