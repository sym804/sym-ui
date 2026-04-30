# sym-ui Release Notes

## 버전 테이블

| 패키지 | 현재 버전 | 직전 버전 | 릴리즈 일자 |
|--------|-----------|-----------|-------------|
| @sym/ui | 0.8.0 | 0.7.2 | 2026-05-01 |
| @sym/ui-cli | 0.8.0 | 0.7.2 | 2026-05-01 |

---

## v0.8.0 - 2026-05-01

CI 의 a11y job 이 v0.5.0 도입 이후 한 번도 통과하지 못했다는 사실이 v0.7.x 의 visual
gate 안정화 이후 노출. 31 axe violations 발견 후 일괄 해소. **CI a11y 게이트가
실제로 enforce** 됨. Codex 평가 9.2 → 9.4+ 도달 예상.

### Major (1건)

- **a11y 31 violations → 0 일괄 해소** (frontend + etc) - 7 종 axe rule 위반을 단계적
  으로 추적 + 수정.
  - **race condition 차단** (`addon-a11y` manual mode): storybook addon-a11y 의 자동
    axe 실행과 test-runner 의 axe-playwright 가 충돌해 `Axe is already running` race
    발생. `parameters.a11y.manual = true` 로 dev-only addon 의 자동 실행 끔. 결과 false-
    positive 다수 제거. (apps/docs/.storybook/preview.tsx)
  - **`label` rule (8 위반)**: Progress / Slider 컴포넌트 stories 에 `aria-label` 명시,
    SettingsPage 의 SelectTrigger 에 명시적 `aria-label`, Combobox 의 trigger Button 에
    `triggerAriaLabel` prop + fallback (`selected.label ?? placeholder`)
  - **`aria-input-field-name` rule (2 위반)**: NumberInput 의 input 에 `inputAriaLabel`
    default, Slider 단일 thumb 일 때 root 의 `aria-label` 을 thumb 에 자동 fallback 상속
  - **`aria-progressbar-name` rule (2 위반)**: Progress stories 에 `aria-label` 명시
  - **`button-name` rule (5 위반)**: FileUpload 의 hidden file input 에 `aria-label`
    + `aria-hidden + tabIndex={-1}` (visible drop zone 이 단일 진입점), Combobox trigger
    button 의 aria-label 항상 부여
  - **`link-in-text-block` rule (4 위반)**: SettingsPage 의 "구독 관리" `<a>` 에 default
    `underline underline-offset-4` 적용 (이전엔 `hover:underline` 만)
  - **`color-contrast` rule (7 위반)**:
    - `accent-brand` 토큰 색조 강화: light `173 80% 35%` → `173 80% 28%` (teal-700 부근),
      dark `172 66% 58%` → `172 66% 65%` (teal-300 부근). WCAG AA 4.5:1 확보.
    - Badge primary variant: `text-primary` → `text-primary-700 dark:text-primary-200`
      (bg-primary/15 위에서 contrast AA 확보)
    - Calendar `day_outside` / `day_disabled` 의 `opacity-50/-40` 제거. day_disabled 는
      `line-through` + `cursor-not-allowed` 로 시각 단서 강화
  - **`aria-required-children` rule (1 위반, 외부 의존성)**: cmdk 라이브러리의 List 가
    검색 결과 0 일 때 listbox role 을 children 없이 렌더하는 default 동작. 라이브러리
    수정 어려움 + 사용자 입장 a11y 손실 없음 (CommandEmpty / EmptyState 가 별도 표시)
    → axe rule 비활성 (사유 주석 명시).

### 검증 결과

- **CI 모든 job 통과**: ci ✅ / a11y ✅ (93 tests / 93 passed) / visual ✅
- **로컬**: typecheck (3종) ✅, lint (3종) ✅, test 37 files / 79 tests ✅,
  @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅, storybook build ✅

### 호환성

- 시각 변화: Badge primary text 약간 진해짐, accent-brand 색조 약간 강화, Calendar
  day_outside 옅은 회색 제거. visual baseline 은 이번 사이클의 commit 들로 자동 갱신됨.
- API 추가: `Combobox.triggerAriaLabel`, `NumberInput.inputAriaLabel`, `Slider` 의
  단일 thumb 시 root aria-label 자동 상속. 모두 추가형이라 기존 사용처 영향 없음.

---

## v0.7.2 - 2026-04-30

Codex 재평가 (9.2/10) 의 마지막 운영 정리. CI 가 ubuntu-latest 라 linux baseline 이
필요한데 v0.7.1 이 win32 만 commit 한 상태였음. 사용자가 linux baseline 을 클릭 한
번으로 main 에 들어가도록 workflow_dispatch 자동 commit 보강.

### Minor (1건)

- **visual-baseline.yml 의 자동 commit 단계 추가** (etc) - 이전에는 baseline 을
  artifact 로 업로드만 하고 사용자가 다운받아 수동 commit 해야 했음. v0.7.2 부터는
  artifact 업로드 + main 자동 commit + push 둘 다 수행. 권한: `contents: write`.
  artifact 는 검토용으로 유지 (30일 retention). branch protection rule 이 있을 때
  처리 안내를 README + workflow 코멘트에 명시.
  (.github/workflows/visual-baseline.yml, README.md)

### 사용 흐름

GitHub Actions 탭 → "Visual Baseline (linux)" → Run workflow → 끝나면 main 에 새
commit (`chore(visual): update linux baseline (workflow_dispatch)`) 자동 들어감 →
이후 PR 의 visual job 이 정상 통과.

### 호환성

- 기능적 변경 없음. 사용자 환경에 따라 push 권한 제약이 있을 경우 PR 모드 전환 가능.

---

## v0.7.1 - 2026-04-30

Codex 재평가 (9.1/10) 의 4가지 잔존 cleanup. v0.7.0 에서 누락된 미세 정합성과 baseline
부재 문제를 해소. Codex 예상 점수 효과: 9.1 → 9.2.

### Major (1건)

- **win32 visual baseline 10개 commit + linux baseline 생성용 workflow_dispatch
  워크플로우 추가** (etc) - v0.7.0 의 visual job 이 baseline 부재로 fail 하던 의도된
  상태 해소.
  - `apps/docs/tests/visual/smoke.spec.ts-snapshots/*-chromium-win32.png` 10개 commit
    (Windows 환경 검증용)
  - `.github/workflows/visual-baseline.yml` 신규 (workflow_dispatch). Actions 탭에서
    수동 트리거 → ubuntu-latest + playwright/jammy 에서 visual:update 실행 → 결과를
    `visual-baseline-linux` artifact 로 업로드. 사용자가 다운받아 commit 하면 CI 의
    visual job 이 정상 통과
  - README 의 visual regression 섹션을 두 가지 baseline 생성 경로 (GitHub Actions /
    Docker 로컬) 로 보강

### Minor (3건)

- **Brand/Identity.mdx 의 잔존 ring-ring 표기 정리** (etc) - v0.7.0 에서 컴포넌트는
  ring-focus-ring 으로 통일했지만 brand 문서가 여전히 `ring-ring` 으로 안내.
  `ring-focus-ring` 으로 정정 + "intent token, --focus-ring 직접 매핑" 설명 보강.

- **Calendar 의 잔존 hover:bg-muted → hover:bg-interactive-hover** (frontend) - v0.6.0
  에서 다른 컴포넌트는 interactive-hover 로 일괄 마이그레이션 했지만 Calendar 의 nav
  버튼과 day cell 두 곳이 누락. interactive intent 일관성 회복.
  (packages/ui/src/components/calendar.tsx)

- **.gitignore 에 test-results / playwright-report 추가** (etc) - playwright 첫 실행 시
  생성되는 임시 디렉토리들이 git 추적에서 제외되도록 보강.

### 검증 결과

- **로컬**: typecheck (3종) ✅, lint (3종) ✅, test 37 files / 79 tests ✅,
  @sym/ui-cli build ✅, registry:build ✅, storybook build 10.01s ✅
- **시각 회귀**: `pnpm --filter docs visual` 10 passed (win32 baseline 기준)

### 호환성

- 시각 변화 없음. Calendar 의 hover layer 가 interactive 로 통일되었으나 색조 동일.
- linux baseline 은 사용자가 workflow_dispatch 또는 docker 로 별도 생성 + commit 필요.

---

## v0.7.0 - 2026-04-30

Codex 평가 (9.0/10) 의 마지막 3가지 감점 포인트 (문서/구현 불일치, focus-ring 명명
일관성, 시각 회귀 부재) 를 일괄 해소. **공개 라이브러리급 완성도** 진입을 목표로 한
릴리즈. Codex 예상 점수 효과: 9.0 → 9.2+.

### Major (2건)

- **시각 회귀 (Playwright screenshot smoke) CI 게이트 도입** (etc) -
  `@playwright/test` + `apps/docs/playwright.config.ts` + `apps/docs/tests/visual/smoke.spec.ts`
  로 핵심 10 stories (Patterns 7 + Components 3) 의 스크린샷을 베이스라인과 비교하는
  smoke 게이트 도입. CI 의 `visual` job 이 storybook 빌드 → http-server → playwright
  순으로 실행. 실패 시 diff 보고서를 artifact 로 업로드. PR 에서 토큰 / 컴포넌트 변경의
  unintended 시각적 영향을 차단.
  - 베이스라인은 `apps/docs/tests/visual/__screenshots__/*.png` 로 git 관리
  - OS 일관성을 위해 docker (`mcr.microsoft.com/playwright:v1.59.1-jammy`) 사용 권장
  - scripts: `visual` (검증), `visual:update` (베이스라인 갱신), `visual:report` (diff 보기)
  - **첫 실행 시 베이스라인 미존재로 visual job 이 fail** 함. README 의 docker 명령으로
    한 번 생성 후 commit 하면 이후 회귀 차단 정상 동작.
  (apps/docs/playwright.config.ts, tests/visual/smoke.spec.ts, package.json,
  .github/workflows/ci.yml, README.md)

- **focus-visible 의 ring-ring → ring-focus-ring 일괄 통일** (frontend) - intent token
  명명 일관성. `--focus-ring` 토큰이 v0.5.0 에서 정의됐지만 컴포넌트들은 여전히 `ring-ring`
  사용 (Tailwind 의 ring color shortcut) 이었음. 17개 위치를 `ring-focus-ring` 으로 일괄
  교체.
  - 컴포넌트 13개: data-table, tabs, button, checkbox, accordion, sheet, breadcrumb,
    file-upload, slider, calendar, switch, radio-group, input
  - select.tsx 의 `focus:ring-ring/40` → `focus:ring-focus-ring/40`
  - tokens/colors.ts 의 코멘트 예시 갱신
  - 패턴 스토리 2곳 (SettingsPage, EmptySearchResults) 의 inline 클래스도 일괄 교체
  시각적 변화 없음 (별칭이라 동일한 색조). 토큰 의도 (intent) 가 코드에서도 명확히
  드러나도록 정리.

### Minor (1건)

- **Guidelines/DataTable.mdx 의 row hover 표기 정정** (etc) - v0.6.0 에서 row hover 를
  `interactive-hover` 로 마이그레이션 했으나 가이드 문서가 여전히 `hover:bg-muted` 라고
  안내. 문서 / 구현 불일치 해소.
  (apps/docs/stories/guidelines/DataTable.mdx)

### 검증 결과

- **로컬**: typecheck (3종) ✅, lint (3종) ✅, test 37 files / 79 tests ✅,
  @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅, storybook build 9.96s ✅
- **시각 회귀 베이스라인**: 본 릴리즈에서는 미생성. 첫 baseline 은 사용자/CI 가
  README 의 docker 명령으로 별도 생성.

### 호환성

- API 변경 없음. `ring-focus-ring` 은 `ring-ring` 과 동일 색조 (별칭) 라 시각적 변화 없음.
- `lucide-react`, `@playwright/test` 외에 새 의존성 없음 (모두 docs 의 devDeps).

### 마무리

v0.1.0 (2026-04-27) 부터 v0.7.0 (2026-04-30) 까지 4 일 간 7 차례 릴리즈, 누적 73 건의
이슈 해소. Codex 평가 7.5 → 9.0+ 도달 예상. 다음 사이클부터는 신기능 / 컴포넌트 추가가
중심.

---

## v0.6.0 - 2026-04-30

Codex 평가 (8.7/10) 의 9점 갭 (intent 토큰을 정의했지만 컴포넌트가 아직 안 먹음) 을
해소. 본 릴리즈로 v0.5.0 에서 도입한 intent 토큰이 핵심 컴포넌트와 패턴에 실제 적용됨.
시각 회귀 게이트는 의도적으로 v0.7.0 으로 보류. Codex 예상 점수 효과: 8.7 → 9.0+.

### Major (2건)

- **Badge / Alert / Toast 의 status variant 를 intent token 으로 마이그레이션**
  (frontend) - 이전 `bg-success/10 text-success` (semantic + alpha) 패턴을
  `bg-status-success-bg text-status-success-fg` 로 교체. 다크 모드 색상 분기는 토큰의
  `.dark` 변종이 자동 처리하므로 `dark:` 프리픽스 불필요.
  - Badge: success / warning / danger
  - Alert: success / warning / destructive (info 는 surface 톤 유지)
  - Toast: info / success / warning / danger (이전엔 border 만 색조였고 bg 가 popover
    였으나 이제 bg+text+border 모두 status 토큰)
  ToastDescription 도 `text-muted-foreground` 에서 `opacity-80` (text-current 상속) 으로
  변경해 status text 색을 자연스럽게 따라가도록 수정.
  (packages/ui/src/components/{badge,alert,toast}.tsx)

- **Button / Tabs / Select / DropdownMenu / DataTable 의 hover / focus 를 interactive
  intent 토큰으로 통일** (frontend) - 컴포넌트 간 일관된 hover layer 색상.
  - Button: secondary / outline / ghost 의 `hover:bg-muted` 또는 `hover:bg-accent` 를
    `hover:bg-interactive-hover` 로. `active:bg-interactive-active` 도 추가 (primary /
    destructive 는 자체 색조 hover 유지)
  - Tabs: 비활성 TabsTrigger 에 `hover:bg-interactive-hover/60` 추가, active 시 hover
    무효화로 시각적 jitter 방지
  - Select: SelectItem 의 `focus:bg-accent` → `focus:bg-interactive-hover focus:text-foreground`
  - DropdownMenu: 동일 패턴
  - DataTable: row `hover:bg-muted` → `hover:bg-interactive-hover`
  (packages/ui/src/components/{button,tabs,select,dropdown-menu,data-table}.tsx)

### Minor (2건)

- **3개 패턴 스토리에 surface-subtle / accent-brand 실사용** (etc) - v0.5.0 토큰 정의
  단계에서 사용 사례 부재 → v0.6.0 에서 적용.
  - SettingsPage: 페이지 외곽을 `bg-surface-subtle min-h-screen` 으로 깔아 카드와
    layer 분리. header 에 "구독 관리" 보조 link 를 `text-accent-brand` 로 (primary CTA
    가 아닌 brand 시그니처)
  - DataTableWithFilters: 페이지 외곽 `bg-surface-subtle`
  - AccountActivity: 활동 로그의 행위자 이름 `<span>` 에 `text-accent-brand`
  (apps/docs/stories/patterns/{SettingsPage,DataTableWithFilters,AccountActivity}.stories.tsx)

- **Brand/Identity.mdx 에 색상 사용 규칙 + accent-brand 가이드 추가** (etc) - 이전엔
  "indigo 중심" 한 줄 수준이었음. Primary / Accent / Neutral / Status 별 사용처 표 +
  안티패턴 + 다크 모드 규칙 추가. 변경 이력에 v0.5.0 / v0.6.0 항목 보강.
  (apps/docs/stories/brand/Identity.mdx)

### 검증 결과

- **로컬**: typecheck (3종) ✅, lint (3종) ✅, test 37 files / 79 tests ✅,
  @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅, storybook build 9.89s ✅

### 호환성

- 시각적 변화: Badge / Alert / Toast 의 status variant 색조가 약간 부드러워짐 (이전 alpha
  10% → 새 토큰의 정해진 light 95% / dark 14% 톤). hover / focus layer 도 통일되어 더
  자연스러운 인터랙션. 토큰 기반이라 사용자가 globals.css 의 토큰 값을 override 하면 즉시
  반영.
- API 변경 없음.

### 의도적 미처리 (v0.7.0 이상)

- **Playwright/Chromatic 시각 회귀 게이트** - 시스템이 충분히 안정된 뒤 도입할 예정.
  현재 토큰 마이그레이션이 끝났으니 다음 사이클에서 베이스라인 캡처 → 회귀 차단으로
  점진 도입.

---

## v0.5.0 - 2026-04-30

Codex 디자인 평가 (8.3/10) 에서 "9점대로 가려면 더 많은 컴포넌트가 아니라 **더 선명한
기준**" 이 필요하다는 지적을 받아, 시스템성을 끌어올리는 4 가지를 일괄 도입.
Codex 예상 점수 효과: 8.3 → 9.0+.

### Major (4건)

- **Brand accent (teal) 토큰 도입** (frontend) - indigo primary 의 보조 시그니처로
  차분한 teal 추가. light `--accent-brand: 173 80% 35%` (teal-600 #0d9488 살짝 밝게),
  dark `172 66% 58%` (teal-400 기준 다크 가시성). Tailwind 노출 `accent-brand` 색상.
  사용 가이드: link hover, badge accent, 서브 헤딩의 강조 색 등 "primary 가 아닌 곳" 의
  brand 정체성 유지. (packages/ui/src/tokens/colors.ts, templates/globals.css,
  tailwind.preset.cjs)

- **Intent 토큰 3계층 도입 (status / surface / interactive)** (frontend) - primitive
  + semantic 의 기존 2계층 위에 의미 기반 intent 계층 추가. 토큰은 구체적 사용처를
  드러내는 이름이라 컴포넌트 코드의 의도가 토큰 단계에서 보임.
  - Status: `--status-success-bg/-fg`, `--status-warning-bg/-fg`, `--status-danger-bg/-fg`,
    `--status-info-bg/-fg` (light/dark 양쪽). Alert / Toast / Badge 의 상태 표현용.
  - Surface: `--surface-subtle` (그룹 구분 옅은 layer), `--surface-raised` (elevated 보다
    더 부각)
  - Interactive: `--interactive-hover`, `--interactive-active`, `--focus-ring` (ring 의
    의미 별칭)
  Tailwind 노출: `bg-status-success-bg text-status-success-fg`, `bg-surface-subtle`,
  `bg-interactive-hover`. tokens/colors.ts 의 `intentTokens` 배열로 타입 export.
  (packages/ui/templates/globals.css, tailwind.preset.cjs, src/tokens/colors.ts)

- **5개 패턴 스토리에 Dark variant 추가** (etc) - Settings Page / Empty Search Results /
  File Upload Form / DataTable with Filters / Account Activity 각각에 `Dark` story 추가.
  themes addon 의 themeOverride + dark wrapper decorator 조합으로 강제 다크. 각 패턴의
  description 에 다크에서 별도로 검토할 항목 (border 대비, ring 가시성, status 색상,
  hover layer 등) 명시. 총 23 stories → 41 stories 가 아니라 패턴 영역만 18 → 23 으로
  증가. (apps/docs/stories/patterns/*.stories.tsx)

- **Guidelines/ MDX 5종 도입 (사용 규칙 문서화)** (etc) - "이런 컴포넌트가 있다" 수준에서
  "이렇게 쓰고 / 이렇게 쓰지 않는다" 수준으로 격상. Codex 가 9 점대 핵심으로 짚은 항목.
  - **Button**: variant 매핑표, size 매핑표, 페어링 규칙 (primary 우측 / 모바일 세로),
    asChild, 안티패턴 5 가지
  - **Badge**: 색상 매핑, 길이 가이드 (16자), asChild 패턴, 안티패턴
  - **Alert**: variant 별 자동 role 매핑, 위치 가이드, 카피 길이, 안티패턴
  - **EmptyState**: 시나리오 분류 (첫 방문/빈 검색/권한 없음/오류), title 20자/desc 60자,
    action 갯수, 안티패턴
  - **DataTable**: column 디자인표, 상태 매트릭스 (Loading/Empty/Mobile), Pagination 위치,
    안티패턴 5 가지
  (apps/docs/stories/guidelines/*.mdx)

### 검증 결과

- **로컬**: typecheck (3종) ✅, lint (3종) ✅, test 37 files / 79 tests ✅,
  @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅, storybook build 10.52s ✅
- **Storybook stories**: 컴포넌트 36 + 패턴 23 + Guidelines 5 + Brand 3 = **67 stories**

### 호환성

- 기존 토큰 / 컴포넌트 API 변경 없음. 새 intent 토큰은 추가형이라 기존 사용처에 영향 없음.
- 컴포넌트의 직접적 마이그레이션은 v0.5.0 에서 보류 (토큰만 정의). 향후 v0.6 에서 Alert /
  Badge / Button hover 등을 새 intent 토큰으로 점진적 마이그레이션.

### 의도적 미처리 (v0.6.0 이상)

- **Playwright/Chromatic 시각 회귀 게이트** - 시스템이 안정된 뒤 베이스라인 관리 비용을
  최소화하기 위해 별도 사이클로 분리.
- **컴포넌트 본체의 intent 토큰 마이그레이션** - 토큰은 정의됐고, 시각 회귀 게이트가 켜진
  뒤에 점진적으로 적용.

---

## v0.4.0 - 2026-04-30

Codex 디자인 재평가 (8.0/10) 의 남은 아쉬움 4건 중 3건 (색상 정체성 추가 강화 제외) 을
해소. 핵심은 **패턴 스토리에 시나리오 변형 추가** 로, Storybook 에서 단순한 happy path
뿐 아니라 Loading / Error / Empty / Mobile / Success 같은 실제 운영 상태를 함께 검토할
수 있도록 확장.

### Major (1건)

- **패턴 스토리 시나리오 확장 (5개 패턴 → 18개 stories)** (etc) - 기존 Default 만 있던
  5개 패턴 스토리에 Loading / Error / Empty / Mobile / Success / WithSuggestions /
  Blocked / Completed 등 운영 상태 변형을 추가.
  - Settings Page: Default / Loading / ErrorState / Mobile
  - Empty Search Results: Default / Loading / WithSuggestions
  - File Upload Form: Default / Uploading / ValidationError / Success
  - DataTable with Filters: Default / Loading / Empty / Mobile
  - Account Activity: InProgress / Completed / Blocked
  Skeleton, Alert (info / success / warning / destructive), Progress, Badge 의
  복합 사용 패턴이 함께 검토 가능.
  (apps/docs/stories/patterns/*.stories.tsx)

### Minor (3건)

- **brand/Identity.mdx 의 블루 표기를 indigo 로 정정** (etc) - v0.3.0 에서 primary 를
  indigo 로 바꿨지만 brand 문서가 여전히 "블루 중심", "블루 프라이머리" 로 남아 있던
  문서 모순 해소. 다크 배경 L>=15% 규칙, 변경 이력도 추가.
  (apps/docs/stories/brand/Identity.mdx)

- **Accordion 의 ▾ → ChevronDown** (frontend) - v0.3.0 의 lucide 일괄 교체에서 누락된
  컴포넌트. AccordionTrigger 의 회전 애니메이션 셀렉터도 `>span` 에서 `>svg` 로 변경
  (lucide 가 svg 로 렌더되므로). dependencies 에 lucide-react 추가.
  (packages/ui/src/components/accordion.tsx)

- **Checkbox 의 ✓ → Check** (frontend) - v0.3.0 누락. CheckboxPrimitive.Indicator 의
  자식이 `<Check className="h-3 w-3" />` 로 변경. dependencies 에 lucide-react 추가.
  (packages/ui/src/components/checkbox.tsx)

### 검증 결과

- **로컬**: typecheck (@sym/ui, @sym/ui-cli, docs) ✅, lint (3종) ✅,
  test 37 files / 79 tests ✅, @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅,
  storybook build (10.18s, 54 stories: 36 컴포넌트 + 18 패턴) ✅

### 호환성

- 컴포넌트 API 변경 없음. Accordion / Checkbox 의 시각적 아이콘만 변경 (텍스트 → SVG).
- 새 의존성 추가 없음 (lucide-react 는 이미 v0.3.0 에서 도입).

### 의도적 미처리

- **색상 정체성 추가 강화** (indigo + warm gray 조합도 익숙한 SaaS 팔레트라는 평가) 는
  사용자 취향에 영향이 크고 시각 검토 비용이 높아 v0.4.0 에서는 보류. 향후 별도
  실험적 brand 변형이 필요할 때 재검토.

---

## v0.3.0 - 2026-04-30

Codex 디자인 평가 (7.5/10) 에서 지적된 3가지 약점 (브랜드 식별력, 텍스트 글리프 아이콘,
패턴 스토리 부재) 을 일괄 해소. **디자인 톤 업그레이드 릴리즈** 로, 기능적으로는 v0.2.1
과 호환되지만 시각적 인상이 크게 바뀐다.

### Major (3건)

- **lucide-react 1.14.0 도입 + 11개 컴포넌트의 텍스트 글리프 교체** (frontend) -
  유니코드 문자 (`+`, `−`, `‹`, `›`, `▾`, `▦`, `▲`, `▼`, `↕`, `…`, `⌕`, `⬆`, `✕`, `✓`)
  로 렌더되던 아이콘을 lucide 의 정식 SVG 아이콘 (Plus, Minus, ChevronLeft/Right/Down,
  ArrowUp/Down/UpDown, MoreHorizontal, Search, UploadCloud, X, Check, Calendar) 으로
  교체. 일관된 stroke 굵기와 크기 (대부분 h-4 w-4) 로 시각 완성도 상향.
  대상: combobox, date-picker, select, command, file-upload, data-table, pagination,
  breadcrumb, sheet, stepper, number-input. 각 컴포넌트의 `@registry-meta dependencies`
  에 `lucide-react` 추가.

- **5개 패턴 스토리 추가 (Patterns/ 카테고리)** (etc) - 기존 stories 가 컴포넌트 단품
  나열 중심이라 실제 화면에서의 리듬을 판단하기 어려웠던 약점 해소.
  - `Patterns/Settings Page` - Tabs + Card + Form (Input, Switch, Select) + Badge + Separator
  - `Patterns/Empty Search Results` - Input + EmptyState + Button + Search 아이콘
  - `Patterns/File Upload Form` - Card + Alert + FileUpload + Form + Badge
  - `Patterns/DataTable with Filters` - Card + Input + Combobox + DataTable + Pagination + EmptyState
  - `Patterns/Account Activity` - Stepper + Card + Badge + Separator
  (apps/docs/stories/patterns/*.stories.tsx)

- **브랜드 primary 를 Indigo 로 교체 (Tailwind blue 탈피)** (frontend) - shadcn/ui
  베이스에서 `Tailwind blue` 그대로 쓰면 brand 식별력이 약하다는 평가에 따른 변경.
  - light mode: `--primary: 243 75% 59%` (Indigo 600 #4f46e5), `--ring` 동일
  - dark mode: `--primary: 234 89% 74%` (Indigo 400 #818cf8, L=74 로 가시성 확보) +
    `--primary-foreground: 240 25% 12%` (light primary 위 텍스트 대비 보강)
  - Tailwind preset 의 `primary.50-950` 스케일도 Indigo 로 일괄 교체
  - tokens/colors.ts 의 `primary` 객체 동기화 + 변경 의도 코멘트
  (packages/ui/templates/globals.css, packages/ui/tailwind.preset.cjs,
  packages/ui/src/tokens/colors.ts)

### Minor (1건)

- **docs 의존성 정리** (etc) - patterns 스토리에서 lucide 아이콘을 사용하므로
  apps/docs/package.json 의 devDependencies 에 `lucide-react`, `@radix-ui/react-slot`
  명시. pnpm strict resolution 환경에서 호이스팅에 의존하지 않도록 의존성 선언 강화.

### 검증 결과

- **로컬**: typecheck (@sym/ui, @sym/ui-cli, docs) ✅, lint (3종) ✅,
  test 37 files / 79 tests ✅, @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅,
  storybook build (9.55s, 41 stories 포함) ✅
- **시각 변경 검증**: storybook-static 에 36 컴포넌트 stories + 5 패턴 stories 모두 정상
  생성. 다크 모드 토글 시 indigo dark variant (L=74) 가 충분한 대비 유지.

### 호환성

- 컴포넌트 API 변경 없음. lucide 아이콘은 컴포넌트 내부 자식으로 렌더되므로 외부에서는
  변화 없음.
- primary 토큰의 색조 (blue → indigo) 변경. 사용자 프로젝트에서 globals.css 의 `--primary`
  값을 override 했다면 그대로 유지됨. 그렇지 않다면 시각적으로 indigo 로 변경됨.
- 새 의존성 `lucide-react@^1.14.0` 가 11개 컴포넌트에 추가. CLI add 시 자동 설치됨.

---

## v0.2.1 - 2026-04-30

v0.2.0 직후 Codex 동기 교차 검증에서 발견된 17건 (Major 11 + Minor 6) 을 일괄 해소.
릴리즈 직후 발견된 회귀가 아니라, 기능적 동작은 OK 였지만 안전성/타입/접근성/코너
케이스에서 보강이 필요한 항목들. v0.2.0 의 핵심 가치는 유지하면서 패치 레벨로 보정.

### Major (11건)

- **CLI add: 누락 의존 시 무조건 abort** (backend) - 이전엔 missing dep 발견 후에도
  부모 컴포넌트가 계속 ordered 에 push 되어 깨진 상태로 설치될 수 있었음. 수정:
  missing.length > 0 이면 즉시 process.exit(1). registry 오타 가드.
  (packages/cli/src/commands/add.ts)

- **CLI init: globals.css 토큰 검사 정밀화** (backend) - 이전엔 `includes("--background")`
  로만 검사해 주석이나 `--background-color` 같은 다른 이름에도 반응해 주입을 잘못
  스킵할 수 있었음. 수정: `(^|[;{]\s*)--background\s*:` 정규식으로 실제 custom property
  선언만 매칭. (packages/cli/src/commands/init.ts)

- **CLI init: Tailwind 지시문 중복 회피** (backend) - 기존 globals.css 에 이미
  `@tailwind base` 가 있을 때 sym-ui template 전체를 prepend 하면 지시문이 중복.
  수정: `extractTokenLayer()` 로 `@layer base { ... }` 블록만 추출, 지시문 존재 시
  토큰 layer 만 주입. (packages/cli/src/commands/init.ts)

- **CLI init: presets 가 여러 군데일 때 자동 패치 보류** (backend) - 단일 regex 가 첫
  매치만 잡아 중첩 객체 안의 `presets:` 까지 잘못 패치할 위험. 수정: 매치 카운트가
  2 이상이면 `manual-needed-multiple-presets` 로 폴백, 명확한 안내 메시지 출력.
  (packages/cli/src/commands/init.ts)

- **CLI init: .js 파일이 ESM (type:module) 일 때 require 삽입 회피** (backend) -
  package.json 의 `"type": "module"` 인 프로젝트에서 `tailwind.config.js` 가 ESM 인데
  CommonJS `require()` 를 자동 삽입하면 런타임 폭발. 수정: `detectPackageType()` 로
  package type 감지 후 `.js + module` 조합은 `manual-needed-esm-js` 로 폴백.
  (packages/cli/src/commands/init.ts)

- **Stepper: Fragment / 조건부 children flatten** (frontend) - 이전 React.Children.map
  + cloneElement 가 Fragment 안의 StepperItem 에는 index 를 부여하지 못했음. 수정:
  `flattenChildren()` 으로 Fragment 를 재귀적으로 펼친 뒤 displayName 기반으로
  StepperItem 만 필터해 인덱스 부여. (packages/ui/src/components/stepper.tsx)

- **FileUpload: button-in-button 중첩 제거** (frontend) - 외곽 div role="button" 안에
  실제 native Button 이 있어 키보드 진입점이 두 개 + a11y 충돌 가능. 수정: 내부 어포던스를
  `span` + `buttonVariants` 클래스로 변경, `aria-hidden + pointer-events-none` 으로 시각용
  표시만 유지. (packages/ui/src/components/file-upload.tsx)

- **Slider: thumbAriaLabels prop 추가** (frontend) - 다중 thumb 모드에서 thumb 별
  라벨을 부여할 API 부재였음. 수정: `thumbAriaLabels?: string[]` 노출, Thumb 렌더 시
  `aria-label={thumbAriaLabels?.[i]}`. (packages/ui/src/components/slider.tsx)

- **Alert: AlertDescription ref 타입 정정** (frontend) - 실제 렌더는 `<div>` 인데 ref
  타입은 `HTMLParagraphElement` 였음. 수정: `HTMLDivElement` 로 일관. 사용처에서 ref
  를 사용 시 발생하던 타입 미스매치 해소. (packages/ui/src/components/alert.tsx)

- **Card / Badge asChild caveat 명시** (frontend) - `asChild` 사용 시 자식 요소 (a,
  button, NavLink 등) 와 ref 타입 (HTMLDivElement / HTMLSpanElement 고정) 의 미스매치
  가능성을 JSDoc 에 명시. shadcn/ui 와 동일한 약속. (packages/ui/src/components/card.tsx,
  badge.tsx)

- **add.ts 알고리즘 코멘트 정정 + missing 중복 제거** (backend) - "BFS" 표기를
  "DFS post-order" 로 정정, missing 을 Set 으로 모아 중복 출력 방지.
  (packages/cli/src/commands/add.ts)

### Minor (6건)

- **Pagination Ellipsis: 부모 aria-hidden 분리** (frontend) - 이전엔 wrapper 자체에
  aria-hidden 이 걸려 sr-only 텍스트가 함께 숨겨졌음. 수정: 시각용 글리프만 aria-hidden,
  sr-only "More pages" 는 그대로 노출. (packages/ui/src/components/pagination.tsx)

- **Breadcrumb 현재 페이지 role 정정** (frontend) - 이전엔 `role="link" aria-disabled="true"`
  로 비활성 링크처럼 노출. 수정: span + `aria-current="page"` 만으로 의미 전달.
  (packages/ui/src/components/breadcrumb.tsx)

- **NumberInput onChange 타입 일관화: null → undefined** (frontend) - 이전엔 onChange
  가 number | null 을 내보내지만 value 는 number | undefined 만 받아 controlled 사용 시
  타입 변환 필요했음. 수정: 양쪽 모두 number | undefined 로 통일.
  (packages/ui/src/components/number-input.tsx, apps/docs/stories/components/number-input.stories.tsx)

- **a11y test-runner: WCAG 2.2 AA 추가** (etc) - axe 의 runOnly 태그에 `wcag22aa`
  포함. best-practice 는 noise 가 많아 우선 제외 (필요 시 단계적 도입).
  (apps/docs/.storybook/test-runner.ts)

- **motion 토큰 의도 주석 보강** (frontend) - easing 곡선이 Material 2 + Tailwind
  호환 의도임을 명시. M3 standard 는 본 토큰의 emphasized 와 매핑됨을 안내. 사용자가
  M3 가 필요하면 preset override 로 가능. (packages/ui/src/tokens/motion.ts)

- **CLI 패치 결과 메시지 세분화** (backend) - `manual-needed` 를 esm-js / multiple-presets
  / 일반 으로 분리해 사용자가 원인을 즉시 파악할 수 있도록.
  (packages/cli/src/commands/init.ts)

### 검증 결과

- **로컬**: typecheck (@sym/ui, @sym/ui-cli, docs) ✅, lint (3종) ✅,
  test 37 files / 79 tests ✅, @sym/ui-cli build ✅, registry:build (36 + globalsCss) ✅
- **Codex 동기 교차 검증 (v0.2.0 검토 결과 대상)**: 7개 영역 (internalDeps / globals.css
  주입 / preset patch / 모션 토큰 / a11y test-runner / 신규 컴포넌트 a11y / 타입 안전성)
  에서 17건 도출 → 본 v0.2.1 에서 전부 해소

### 호환성

- 기능적으로 v0.2.0 과 호환. NumberInput onChange 시그니처가 `(number | null) => void`
  → `(number | undefined) => void` 로 변경되었으나 v0.2.0 신규 컴포넌트라 외부 영향 없음.
- Slider 에 `thumbAriaLabels` 옵션 추가 (없으면 기존 동작 그대로).
- CLI 의 manual-needed 메시지가 세분화되었으나 동작은 동일.

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
