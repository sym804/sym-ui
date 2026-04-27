# sym-ui Release Notes

## 버전 테이블

| 패키지 | 현재 버전 | 직전 버전 | 릴리즈 일자 |
|--------|-----------|-----------|-------------|
| @sym/ui | 0.1.0 | 0.0.0 | 2026-04-27 |
| @sym/ui-cli | 0.1.0 | 0.0.0 | 2026-04-27 |

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
