# sym-ui 디자인시스템 설계 스펙

- 작성일: 2026-04-24
- 작성자: ymseo (sym804@naver.com)
- 상태: Draft (브레인스토밍 단계 확정본)

## 1. 개요

`sym-ui` 는 앞으로 만들 여러 사이드 프로젝트에 공용으로 쓸 **개인 범용 디자인시스템**이다. UI 컴포넌트 라이브러리가 본체이고, 일관된 브랜드 톤을 유지하기 위한 **디자인 토큰(컬러, 타이포그래피, 간격, 반경)** 을 함께 제공한다.

배포 방식은 shadcn/ui 스타일을 따른다. npm 패키지로 import 하는 대신 CLI 로 소비 프로젝트의 `components/ui/` 디렉토리에 컴포넌트 소스를 복사하고, 프로젝트 특성에 맞춰 자유롭게 수정할 수 있게 한다.

## 2. 목표와 비목표

### 목표

- **탄탄한 토큰 시스템**: 컬러 11단계 스케일, Pretendard 기반 타이포 스케일, 4px 기반 간격, 6단계 반경 토큰을 제공
- **핵심 컴포넌트 8종**: Button, Input, Label, Card, Badge, Avatar, Tooltip, Toast
- **CLI 기반 복사 배포**: `npx @sym/ui-cli add button` 형태로 소비
- **다크 모드 내장**: CSS 변수 기반 Tailwind 다크 모드
- **Storybook 문서 사이트**: 컴포넌트 프리뷰 + 브랜드 가이드 페이지
- **접근성 기본기**: Radix UI 프리미티브 + `axe-core` 자동 점검 (WCAG AA 수준)

### 비목표

- 복잡한 폼 빌더, 데이터 테이블, 차트, 리치 에디터 (Tier 2/3, 필요 시 추후 확장)
- 여러 브랜드 테마 지원 (현재는 단일 브랜드만, 필요 시 확장)
- React 외 프레임워크 지원 (Vue/Svelte/Web Components 대응 없음)
- 사내/팀 협업 기능 (버전 거버넌스, Figma 연동 등)

## 3. 기술 스택

| 분류 | 선택 | 비고 |
|---|---|---|
| 언어 | TypeScript 5.x (strict) | |
| 프레임워크 | React 18+ | |
| 스타일링 | Tailwind CSS v3 | preset 형태로 소비 |
| 유틸 | `clsx` + `tailwind-merge` → `cn()` | |
| Variants | `class-variance-authority` (CVA) | |
| UI 프리미티브 | Radix UI (tooltip, toast, avatar) | |
| 모노레포 | pnpm workspace + Turborepo | |
| 빌드 (docs) | Vite + Storybook 8 | |
| 빌드 (cli) | tsup | |
| 테스트 | Vitest + Testing Library + axe | |
| 시각 회귀 | Chromatic (무료 플랜) | |
| 문서 배포 | GitHub Pages | |
| CLI 배포 | npm (`@sym/ui-cli`) | changesets 로 버저닝 |

## 4. 프로젝트 구조

```
sym-ui/
├── apps/
│   └── docs/                       Storybook 문서 사이트
│       ├── .storybook/
│       ├── stories/
│       │   ├── components/         컴포넌트별 *.stories.tsx
│       │   └── brand/              MDX 페이지 (Brand / Palette / Typography)
│       └── package.json
│
├── packages/
│   ├── ui/                         컴포넌트 소스 (registry 본체)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── lib/
│   │   │   │   └── utils.ts        cn() 유틸
│   │   │   └── tokens/
│   │   │       ├── colors.ts
│   │   │       ├── typography.ts
│   │   │       ├── radius.ts
│   │   │       └── index.ts
│   │   ├── tailwind.preset.js      소비 프로젝트용 preset
│   │   └── package.json
│   │
│   └── cli/                        `@sym/ui-cli`
│       ├── src/
│       │   ├── commands/
│       │   │   ├── init.ts         preset 설치, globals.css 주입
│       │   │   └── add.ts          컴포넌트 파일 복사 + 의존성 설치
│       │   └── index.ts
│       ├── registry.json           컴포넌트 매니페스트 (빌드 산출물)
│       └── package.json
│
├── .changeset/
├── .github/workflows/
│   ├── ci.yml                      lint, typecheck, test, build
│   └── release.yml                 changesets 자동 릴리즈
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

## 5. 디자인 토큰

### 5.1 Color

**Primary (Classic Blue, Tailwind 표준)**

| 단계 | Hex |
|---|---|
| 50 | #eff6ff |
| 100 | #dbeafe |
| 200 | #bfdbfe |
| 300 | #93c5fd |
| 400 | #60a5fa |
| 500 | #3b82f6 (brand) |
| 600 | #2563eb |
| 700 | #1d4ed8 |
| 800 | #1e40af |
| 900 | #1e3a8a |
| 950 | #172554 |

**Neutral (Warm Gray)**: 순수 회색 대신 살짝 따뜻한 톤.

| 단계 | Hex |
|---|---|
| 50 | #fafaf9 |
| 100 | #f5f4f2 |
| 200 | #e7e5e1 |
| 300 | #d3d0ca |
| 400 | #a8a49c |
| 500 | #78746c |
| 600 | #57544e |
| 700 | #433f3b |
| 800 | #2a2724 |
| 900 | #1a1815 |
| 950 | #0f0e0c |

**Semantic**

| 이름 | Hex |
|---|---|
| success | #12b76a |
| warning | #f2a900 |
| danger | #f04438 |
| info | #3d7eff |

모든 토큰은 CSS 변수(`--color-primary-500`)로 내보내고, Tailwind preset 에서 `theme.extend.colors` 로 연결한다. 다크 모드는 neutral 반전 + primary 한 단계 밝게 조정.

### 5.2 Typography

- **Sans (본문/UI)**: Pretendard Variable (한글/영문 공용)
- **Mono (코드)**: IBM Plex Mono
- 공급: Google Fonts + Pretendard CDN (jsdelivr) 로 docs 에 로드, 소비 프로젝트는 `npx @sym/ui-cli init` 실행 시 `globals.css` 에 import 문 자동 삽입

**Type Scale**

| 토큰 | Size / Weight / Line-height | 용도 |
|---|---|---|
| display | 36 / 800 / 1.15 | 히어로 |
| h1 | 28 / 700 / 1.2 | 페이지 제목 |
| h2 | 22 / 700 / 1.25 | 섹션 제목 |
| h3 | 18 / 600 / 1.35 | 서브 섹션 |
| body | 16 / 400 / 1.5 | 본문 |
| small | 14 / 400 / 1.5 | 보조 |
| caption | 12 / 600 / 1.4 / uppercase / tracking 0.4 | 라벨 |
| code | 13 / 400 mono | 인라인 코드 |

### 5.3 Spacing, Radius, Shadow

- **Spacing**: Tailwind 표준 4px 베이스 (1 = 4px, 2 = 8px, ... 20 = 80px)
- **Radius**: sm 4 / base 8 / md 12 (기본) / lg 16 / xl 24 / full 999
- **Shadow (soft, 4단계)**:
  - sm: `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)`
  - md: `0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)`
  - lg: `0 12px 24px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06)`
  - xl: `0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)`

## 6. 컴포넌트 명세

공통 규칙:
- 모두 `forwardRef` 로 ref 노출
- CVA 로 variants/sizes 타입 유도 (`VariantProps<typeof buttonVariants>`)
- `className` props 로 사용자 오버라이드 허용 (`cn()` 으로 병합)
- Radix 래핑 컴포넌트는 기본 prop 전달 (`...props`) 투명하게 지원
- 접근성: 키보드 포커스 표시, aria 속성, axe 기본 통과

| # | 컴포넌트 | variants | sizes | 추가 상태 | 프리미티브 |
|---|---|---|---|---|---|
| 1 | Button | primary / secondary / outline / ghost / destructive | sm / default / lg / icon | disabled, loading | 없음 |
| 2 | Input | (variant 없음) | default | focus, error, disabled | 없음 |
| 3 | Label | default / required | | (hint 보조 텍스트) | 없음 |
| 4 | Card | default | | (Header/Content/Footer 컴파운드) | 없음 |
| 5 | Badge | primary / neutral / success / warning / danger / outline | default | | 없음 |
| 6 | Avatar | | sm / default / lg | image / initial / stack | Radix Avatar |
| 7 | Tooltip | | | side/align prop | Radix Tooltip |
| 8 | Toast | success / danger / info / warning | | 자동 닫힘 (기본 4s) | Radix Toast |

각 컴포넌트는 동일 폴더에 `*.test.tsx` 와 `*.stories.tsx` 를 co-locate 한다.

## 7. 개발 워크플로우

```bash
pnpm install
pnpm dev                        # docs + ui 병렬 watch
pnpm typecheck
pnpm lint
pnpm test                       # Vitest
pnpm registry:build             # packages/ui/src/components/* → packages/cli/registry.json
pnpm build                      # 모든 패키지 빌드
```

- Turborepo 파이프라인: `dev` (persistent), `build` (cache), `test` (cache), `lint` (cache)
- Pre-commit: Husky + lint-staged (변경된 파일만 prettier + eslint + typecheck)
- CI: `.github/workflows/ci.yml` 에서 lint → typecheck → test → build 순차 실행. Turborepo 원격 캐시는 사용하지 않음 (개인 프로젝트).

## 8. CLI 동작

### `init`

1. 소비 프로젝트의 `tailwind.config.{js,ts}` 에 `presets: [require('@sym/ui/tailwind.preset')]` 추가
2. `app/globals.css` 또는 `src/index.css` 에 Pretendard/IBM Plex Mono import + CSS 변수 블록 주입
3. `components/ui/` 디렉토리 생성
4. `lib/utils.ts` 생성 (`cn()` 유틸). 모든 컴포넌트가 참조하므로 init 단계에서 한 번만 만든다
5. 기본 의존성만 설치: `clsx`, `tailwind-merge`, `class-variance-authority`. Radix 패키지는 각 컴포넌트 `add` 시점에 개별 설치

### `add <component>`

1. `registry.json` 에서 해당 컴포넌트의 파일 목록과 의존성(npm 패키지, 내부 유틸) 조회
2. 의존하는 다른 컴포넌트(예: Toast → Button)가 있으면 함께 복사 여부 프롬프트
3. `components/ui/<name>.tsx` 생성. 기존 파일이 있으면 `--overwrite` 플래그 요구
4. 필요한 Radix 패키지 자동 설치 (`pnpm add @radix-ui/react-tooltip` 등)

`registry.json` 은 빌드 타임에 `packages/ui/src/components/*` 를 스캔하여 생성한다. 각 파일 상단의 JSDoc `@registry-meta` 주석에서 메타데이터를 읽는다.

## 9. 문서 사이트

- `apps/docs` 가 Storybook 8 (Vite builder) 호스팅
- 컴포넌트마다 `*.stories.tsx`: 각 variant/size/state 별 스토리
- MDX 페이지:
  - `Getting Started`: CLI 사용 흐름
  - `Tokens`: 토큰 표 + 시각화
  - `Theming`: 다크 모드, 커스터마이즈 방법
  - `Brand / Palette / Typography`: 브랜드 아이덴티티 섹션
- `@storybook/addon-a11y` 활성화
- GitHub Pages 로 배포 (`.github/workflows/release.yml` 에서 `main` 푸시 시 빌드)

## 10. 테스트 전략

- **유닛 (Vitest)**: 컴포넌트별 최소 1~3개 테스트. 렌더링, 이벤트 핸들러, variant 적용, disabled 상태
- **접근성 (axe)**: Storybook addon-a11y 로 각 스토리 자동 점검
- **시각 회귀 (Chromatic)**: Storybook 스토리 기반 스냅샷. `main` 머지 시 실행
- 커버리지 숫자 목표 없음. 회귀 방지에 충분한 수준까지만.

## 11. 배포 / 버전 관리

- **컴포넌트**: npm publish 하지 않음. GitHub 저장소 `main` 브랜치가 곧 최신 registry
- **CLI** (`@sym/ui-cli`): changesets 로 버저닝. PR 에 `changeset` 파일 포함 시 머지 후 자동 릴리즈 PR 생성 → 머지되면 npm publish
- 소비자는 `npx @sym/ui-cli@latest add ...` 형태로 항상 최신 버전 사용 (로컬 설치 불필요)

## 12. 마일스톤 (구현 계획 수립 시 참고)

1. **Foundation**: 모노레포 세팅, Tailwind preset, 토큰 파일, `cn()` 유틸, 글로벌 CSS
2. **Primitives**: Button, Input, Label, Badge (의존성 없는 정적 컴포넌트 먼저)
3. **Layout**: Card (컴파운드 컴포넌트 패턴 확립)
4. **Radix-wrapped**: Avatar, Tooltip, Toast
5. **Docs 사이트**: Storybook 세팅, 모든 컴포넌트 스토리, Brand MDX 페이지
6. **CLI**: `init` 명령, registry 빌드, `add` 명령
7. **Testing**: Vitest 세팅, 주요 컴포넌트 테스트 작성
8. **CI/Release**: GitHub Actions (ci, release), Chromatic, GitHub Pages 배포
9. **README + Getting Started**: 소비 프로젝트에서 한 번 사용해보며 튜닝

각 마일스톤의 세부 태스크, 순서, 의존성은 writing-plans 스킬에서 구체화한다.

## 13. 리스크와 완화

| 리스크 | 완화 |
|---|---|
| shadcn/ui 와 차별점 부족 | 브랜드 토큰(Coral 대신 Blue, Warm Gray) + Pretendard 한글 우선 지원으로 개인 정체성 확보 |
| 혼자 유지보수하기 벅참 | Tier 1 만 범위 고정. Tier 2 이상은 실제 프로젝트 수요가 생길 때 개별 추가 |
| Radix 업데이트 시 breaking change | CLI 복사 방식이라 소비 프로젝트가 자유롭게 버전 고정 가능. registry 는 peer 지정만 |
| 문서 사이트 방치 | 컴포넌트 추가 PR 에 스토리 필수 (CI 체크). 스토리 없는 컴포넌트는 머지 금지 |

## 14. 열린 질문

현 단계에서 모두 브레인스토밍으로 확정했으나, 구현 중 재검토 가능:

- 아이콘 전략: `lucide-react` 기본 의존으로 넣을지, 소비 프로젝트 선택에 맡길지
- Toast 구현: Radix Toast 로 충분한지, `sonner` 같은 고수준 라이브러리를 쓸지
- npm 스코프 `@sym` 선점 여부 확인 필요. 이미 사용 중이면 `@sym-ui`(하이픈) 또는 개인 스코프 변경 고려

위 항목은 writing-plans 단계에서 결정한다.
