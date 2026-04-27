"""sym-ui 의 22개 이슈를 GitHub Issues 로 등록하고 즉시 close.

- 본문: 글로벌 CLAUDE.md 의 bug 7항목 / enhancement 4+1항목 템플릿
- 라벨: 유형(bug/enhancement) + 심각도(block/critical/major/minor/trivial) + 영역(frontend/backend/etc)

이미 등록된 동일 제목 이슈가 있으면 skip.
"""
from __future__ import annotations
import json
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

REPO = "sym804/sym-ui"

# (number, type, severity, area, title, fix_version, body_payload)
# bug body_payload: dict with keys: prereq, repro, cause_fix, scope, found_version
# enhancement body_payload: dict with keys: change, reason, scope (선택)
ISSUES = [
    # ===== Critical 4 =====
    (1, "bug", "critical", "frontend",
     "다크 토큰 시스템 부재로 26개 컴포넌트가 dark:[#hex] 하드코딩 우회",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드 사용",
      "repro": "1. 컴포넌트 그렙 시 dark:[#1e222d], dark:[#2a2d3e] 등 하드 hex 가 곳곳에 산재\n2. 시맨틱 토큰 부재로 토큰 변경 시 26개 파일 모두 수정 필요",
      "cause_fix": "원인: tokens/colors.ts 와 tailwind.preset.cjs 에 다크 전용 시맨틱 토큰이 없어 우회 패턴 발생.\n수정: shadcn 스타일 CSS 변수 18종 (background, surface, muted, border, primary 등) 을 :root / .dark 양쪽에 정의하고 26개 컴포넌트를 모두 마이그레이션.",
      "scope": "26개 UI 컴포넌트 + globals.css + tailwind.preset.cjs",
      "found_version": "@sym/ui 0.0.0"}),

    (2, "bug", "critical", "frontend",
     "다크 배경 절대 밝기 L<15% 위반 (글로벌 다크 팔레트 규칙)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드 사용",
      "repro": "1. globals.css 의 --background L=6%\n2. 컴포넌트의 #131722 L=10.4%, #1e222d L=14.7% 모두 L<15%\n3. 결과적으로 순수 검정처럼 보임",
      "cause_fix": "원인: 초기 팔레트 설계 시 절대 밝기 규칙 미반영.\n수정: 다크 --background L=15%, --surface L=18%, --surface-elevated L=22%, --border L=28% 로 전면 재구성. 모두 L>=15 보장.",
      "scope": "전 컴포넌트 다크모드 외관",
      "found_version": "@sym/ui 0.0.0"}),

    (3, "bug", "critical", "frontend",
     "Dialog 기본 사용 시 aria-describedby 누락으로 Radix 경고 + a11y 위반",
     "@sym/ui 0.1.0",
     {"prereq": "DialogContent 를 DialogDescription 없이 사용",
      "repro": "1. DialogContent 안에 DialogDescription 없이 렌더\n2. 콘솔에 Missing Description or aria-describedby={undefined} 경고\n3. 화면 낭독기에 Dialog 컨텍스트 누락",
      "cause_fix": "원인: DialogContent 가 aria-describedby 를 명시 전달하지 않아 Radix 가 false positive 경고.\n수정: aria-describedby prop 을 명시 전달, JSDoc 에 DialogDescription 권장 명시, 테스트도 DialogDescription 포함.",
      "scope": "Dialog 사용 모든 페이지의 a11y",
      "found_version": "@sym/ui 0.0.0"}),

    (4, "bug", "critical", "frontend",
     "Sheet 기본 사용 시 aria-describedby 누락 (Dialog 와 동일)",
     "@sym/ui 0.1.0",
     {"prereq": "SheetContent 를 SheetDescription 없이 사용",
      "repro": "1. SheetContent 안에 SheetDescription 없이 렌더\n2. Radix 동일 경고 + 화면낭독기 컨텍스트 누락",
      "cause_fix": "원인: SheetContent 도 같은 패턴.\n수정: Dialog 와 동일 패턴 적용 + sheet.test.tsx 업데이트.",
      "scope": "Sheet 사용 모든 페이지의 a11y",
      "found_version": "@sym/ui 0.0.0"}),

    # ===== Major 14 =====
    (5, "bug", "major", "frontend",
     "Progress: max=0 일 때 NaN% 렌더링",
     "@sym/ui 0.1.0",
     {"prereq": "Progress 컴포넌트에 max={0} 전달",
      "repro": "1. <Progress value={0} max={0} /> 렌더\n2. (value/max)*100 = NaN\n3. style transform: translateX(-NaN%) 적용",
      "cause_fix": "원인: max 가 0/음수일 때 가드 누락.\n수정: safeMax 변수 도입, max>0 인지 검사 후 100 으로 보정. value 검증도 safeMax 기준.",
      "scope": "Progress 컴포넌트",
      "found_version": "@sym/ui 0.0.0"}),

    (6, "bug", "major", "backend",
     "CLI add: prompts 취소 시 selected=undefined 로 런타임 크래시",
     "@sym/ui-cli 0.1.0",
     {"prereq": "sym-ui add 무인자 실행 후 ESC 또는 Ctrl+C",
      "repro": "1. sym-ui add 실행\n2. 다중선택 프롬프트에서 ESC\n3. selected=undefined 가 components 에 대입\n4. for...of 에서 TypeError",
      "cause_fix": "원인: prompts 결과 undefined 가드 부재.\n수정: Array.isArray(selected) 검사 후 빈 배열이면 친절 메시지 후 return.",
      "scope": "@sym/ui-cli add 명령",
      "found_version": "@sym/ui-cli 0.0.0"}),

    (7, "bug", "major", "backend",
     "CLI init: prompts 취소 시 componentsDir=undefined 로 크래시",
     "@sym/ui-cli 0.1.0",
     {"prereq": "sym-ui init 실행 후 ESC",
      "repro": "1. sym-ui init 실행\n2. 컴포넌트 경로 입력 프롬프트에서 ESC\n3. componentsDir=undefined 로 path.join 호출\n4. TypeError",
      "cause_fix": "원인: text 프롬프트 결과 undefined 가드 부재.\n수정: typeof string 이고 trim 결과 비어있지 않은지 검사 후 그렇지 않으면 친절 메시지 후 return.",
      "scope": "@sym/ui-cli init 명령",
      "found_version": "@sym/ui-cli 0.0.0"}),

    (8, "bug", "major", "backend",
     "CLI runner: pnpm add/npm install 실패 코드 무시 → 설치 실패해도 성공 처리",
     "@sym/ui-cli 0.1.0",
     {"prereq": "오프라인 또는 권한 문제로 의존성 설치 실패",
      "repro": "1. 네트워크 단절 상태에서 sym-ui add button\n2. pnpm add 가 exit code != 0 반환\n3. CLI 는 ✓ 표시 후 종료\n4. 실제로는 의존성 누락",
      "cause_fix": "원인: installPackages 의 결과 code 검사 누락.\n수정: InstallError 클래스 도입, code != 0 시 throw, add/init 에서 catch 후 사용자 친화 메시지로 process.exit. child error 핸들러도 추가.",
      "scope": "@sym/ui-cli init/add 명령",
      "found_version": "@sym/ui-cli 0.0.0"}),

    (9, "bug", "major", "frontend",
     "비핵심 hex 색 혼입 (#a3a6af, #3a3e4c, #ff6b6b)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드 사용",
      "repro": "1. accordion.tsx 에 dark:text-[#a3a6af]\n2. radio-group.tsx 에 dark:border-[#3a3e4c]\n3. form.tsx 에 dark:text-[#ff6b6b]",
      "cause_fix": "원인: 핵심 팔레트 외 일회성 hex 가 일관성 없이 추가됨.\n수정: 모두 시맨틱 토큰 (muted-foreground, border-input, text-destructive) 으로 치환.",
      "scope": "Accordion, RadioGroup, Form",
      "found_version": "@sym/ui 0.0.0"}),

    (10, "bug", "major", "frontend",
     "Calendar day_disabled / day_range_middle 다크 변형 누락",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 날짜 비활성화 또는 범위 선택",
      "repro": "1. 다크모드에서 비활성 날짜는 light text-neutral-400 그대로 적용\n2. day_range_middle 도 light bg-neutral-100 그대로",
      "cause_fix": "원인: dark: 변형 누락.\n수정: muted-foreground / muted 토큰으로 통일하여 자동 대응.",
      "scope": "Calendar, DatePicker",
      "found_version": "@sym/ui 0.0.0"}),

    (11, "bug", "major", "frontend",
     "Input/Select 다크 포커스 링 색이 primary-900/40 (요구 사양은 ring 토큰)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 Input/Select 포커스",
      "repro": "1. 다크모드 Input 포커스 시 ring 색이 너무 어두움 (primary-900/40)\n2. 식별이 어려움",
      "cause_fix": "원인: light 포커스 ring (primary-100) 의 단순 dark 대응으로 primary-900/40 채택.\n수정: ring 시맨틱 토큰 (HSL 213 93% 62%) 으로 통일.",
      "scope": "Input, Select",
      "found_version": "@sym/ui 0.0.0"}),

    (12, "bug", "major", "frontend",
     "Card/Input/Select 보더-배경 분리도 부족 (ΔL=5.7)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 카드/입력 보더 식별",
      "repro": "1. card 보더 #2a2d3e (L=20.4) on 배경 #1e222d (L=14.7) → ΔL=5.7\n2. 보더가 거의 안 보임",
      "cause_fix": "원인: 보더와 배경 L 차이 부족.\n수정: 새 토큰 border (L=28) on surface (L=18) → ΔL=10 으로 확보.",
      "scope": "Card, Input, Select, DataTable, Sheet, Dialog 등",
      "found_version": "@sym/ui 0.0.0"}),

    (13, "bug", "major", "frontend",
     "Tooltip 다크모드 색 반전 (bg-neutral-50 + text-neutral-900)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 Tooltip 표시",
      "repro": "1. 다크모드에서 Tooltip 이 흰 배경 검은 글자로 반전 표시\n2. 다크 팔레트 정면 충돌",
      "cause_fix": "원인: 라이트와 동일한 정반대 색을 다크에 그대로 적용.\n수정: bg-foreground text-background 로 양 모드 자동 반전.",
      "scope": "Tooltip",
      "found_version": "@sym/ui 0.0.0"}),

    (14, "bug", "major", "frontend",
     "Accent 색 혼용 (blue-500 ↔ #3d7eff)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 선택 표시",
      "repro": "1. RadioGroup 은 blue-500 (#3b82f6) + dark #3d7eff\n2. Progress 도 같은 혼용\n3. Calendar day_selected 도 같은 혼용",
      "cause_fix": "원인: primary 토큰 미정의로 컴포넌트마다 직접 color 지정.\n수정: primary 시맨틱 토큰으로 통일 (light 217 91% 60%, dark 213 93% 62%).",
      "scope": "RadioGroup, Progress, Calendar",
      "found_version": "@sym/ui 0.0.0"}),

    (15, "bug", "major", "frontend",
     "DataTable 정렬 헤더가 click-only <th> (포커스 불가, 키보드 활성 불가, aria-sort 없음)",
     "@sym/ui 0.1.0",
     {"prereq": "DataTable enableSorting 사용",
      "repro": "1. <th onClick=...> 만 있고 button 없음\n2. Tab 으로 포커스 못 잡음, Enter/Space 동작 안 함\n3. aria-sort 미설정으로 화면낭독기 정렬 상태 인지 불가",
      "cause_fix": "원인: 시각 전용 정렬 UI 만 구현.\n수정: th 안에 button 으로 감싸고 aria-sort 동기화, Enter/Space 핸들링, focus-visible:ring-ring 추가.",
      "scope": "DataTable",
      "found_version": "@sym/ui 0.0.0"}),

    (16, "bug", "major", "frontend",
     "AccordionTrigger 포커스 링 없음 (키보드 사용자 식별 불가)",
     "@sym/ui 0.1.0",
     {"prereq": "키보드만 사용해서 Accordion 조작",
      "repro": "1. Tab 으로 AccordionTrigger 에 포커스\n2. 시각적 피드백 없음 (오로지 hover:underline 만)",
      "cause_fix": "원인: focus-visible 스타일 누락.\n수정: focus-visible:ring-2 ring-ring + offset 추가.",
      "scope": "Accordion",
      "found_version": "@sym/ui 0.0.0"}),

    (17, "bug", "major", "frontend",
     "Calendar nav/day 버튼 키보드 포커스 시각화 없음",
     "@sym/ui 0.1.0",
     {"prereq": "키보드로 Calendar 네비게이션",
      "repro": "1. Tab/화살표로 nav 또는 day 에 포커스\n2. hover 만 정의되어 있어 포커스 식별 불가",
      "cause_fix": "원인: focus-visible 스타일 누락.\n수정: nav_button, day 모두에 focus-visible:ring-ring + offset-1 추가.",
      "scope": "Calendar, DatePicker",
      "found_version": "@sym/ui 0.0.0"}),

    (18, "bug", "major", "frontend",
     "Combobox CommandInput 이 placeholder 만 있고 프로그래매틱 라벨 없음",
     "@sym/ui 0.1.0",
     {"prereq": "Combobox 사용",
      "repro": "1. <Combobox /> 렌더\n2. 검색 인풋이 placeholder 만 있음\n3. 화면낭독기 사용자가 인풋 목적 인지 불가 (placeholder 는 라벨이 아님)",
      "cause_fix": "원인: aria-label 미설정.\n수정: searchAriaLabel?: string prop 노출, CommandInput 에 aria-label={searchAriaLabel ?? searchPlaceholder} 자동 연결.",
      "scope": "Combobox",
      "found_version": "@sym/ui 0.0.0"}),

    # ===== Minor 4 =====
    (19, "enhancement", "minor", "frontend",
     "Button 에 asChild + Slot 패턴 추가 (shadcn 표준)",
     "@sym/ui 0.1.0",
     {"change": "Button 에 asChild?: boolean prop 추가. true 면 @radix-ui/react-slot 의 Slot 으로 래핑하여 자식 컴포넌트(Link 등)에 스타일 위임.",
      "reason": "shadcn 호환성. Link 안에 Button 스타일을 적용하려면 button 안에 a 태그를 중첩할 수 없으므로 Slot 으로 외부 컴포넌트에 위임해야 함.",
      "scope": "Button (다른 컴포넌트는 영향 없음)",
      "found_version": "@sym/ui 0.0.0"}),

    (20, "bug", "minor", "frontend",
     "Disabled 색이 #787b86 / #4a4d55 로 분산되어 의미 불분명",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 disabled 상태 표시",
      "repro": "1. Input disabled 는 #787b86\n2. Calendar day_disabled 는 #4a4d55\n3. 같은 의미인데 색이 다름",
      "cause_fix": "원인: 일관 규칙 부재.\n수정: 모두 muted-foreground 토큰 + opacity-40 패턴으로 통일.",
      "scope": "Input, Calendar 등 disabled 상태가 있는 모든 컴포넌트",
      "found_version": "@sym/ui 0.0.0"}),

    (21, "bug", "minor", "frontend",
     "보조 텍스트 #787b86 on 다크 배경 대비 4.24:1 (AA 4.5:1 미달)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 본문보다 흐린 보조 텍스트 표시",
      "repro": "1. #787b86 (L=49.8) on 다크 배경\n2. 대비 비율 4.24:1\n3. WCAG AA 4.5:1 미달",
      "cause_fix": "원인: 다크 보조 텍스트의 절대 밝기 부족.\n수정: muted-foreground 토큰 L=70 으로 상향 (대비 7~8:1, AAA 통과).",
      "scope": "Dialog/Sheet description, Calendar head, Tabs, 모든 muted-foreground 사용처",
      "found_version": "@sym/ui 0.0.0"}),

    (22, "bug", "minor", "etc",
     "docs lint 9건 (Storybook stories rules-of-hooks 4건 + tailwind.config.cjs no-undef 5건)",
     "전 패키지 0.1.0",
     {"prereq": "pnpm lint 실행",
      "repro": "1. pnpm lint 시 docs 패키지에서 9 errors\n2. calendar/combobox/date-picker/toast stories 가 render: () => { React.useState(...) } 패턴\n3. tailwind.config.cjs 가 module/require no-undef",
      "cause_fix": "원인: stories 의 render inline hook 호출 + eslint config 가 .cjs 를 처리하지 않음.\n수정: render inline 을 별도 컴포넌트로 추출, eslint.config.mjs ignores 에 **/*.cjs 추가.",
      "scope": "apps/docs (라이브러리에는 영향 없음)",
      "found_version": "@sym/ui-cli 0.0.0 (도구 측면)"}),

    # === Codex 2차 재검증에서 발견된 회귀 2건 (수정 도중 발생) ===
    (23, "bug", "major", "frontend",
     "DataTable 정렬 button 의 onKeyDown 핸들러가 native Enter/Space 와 이중 토글 위험",
     "@sym/ui 0.1.0",
     {"prereq": "DataTable enableSorting 사용 + 키보드 Enter/Space 로 정렬",
      "repro": "1. 1차 수정에서 정렬 헤더를 button 으로 감싸면서 onKeyDown 도 추가\n2. button 은 native 로 Enter/Space 활성화\n3. onKeyDown 에서 sortHandler 를 한 번 더 호출\n4. 결과: Enter 1회 입력에 정렬 상태가 두 번 바뀔 수 있음",
      "cause_fix": "원인: native button 동작에 익숙하지 않은 채 방어적으로 onKeyDown 추가.\n수정: onKeyDown 핸들러 제거, native onClick 만 유지 (Enter/Space 시 button 이 자동으로 onClick 트리거).",
      "scope": "DataTable",
      "found_version": "@sym/ui 0.1.0 (수정 도중)"}),

    (24, "bug", "minor", "frontend",
     "Calendar day_range_middle 가 text-foreground 사용 (토큰 통일 누락)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 날짜 범위 선택, 중간 날짜 표시",
      "repro": "1. 1차 수정에서 day_range_middle 을 aria-selected:bg-muted aria-selected:text-foreground 로 변경\n2. 의도는 muted-foreground 로 통일이었으나 text-foreground 로 잘못 적용",
      "cause_fix": "원인: 마이그레이션 시 토큰 일관성 룰 적용 누락.\n수정: aria-selected:text-foreground → aria-selected:text-muted-foreground 로 일관화.",
      "scope": "Calendar, DatePicker (range mode)",
      "found_version": "@sym/ui 0.1.0 (수정 도중)"}),

    # === Codex 3차 재검증에서 발견된 토큰 잔존 3건 ===
    (25, "bug", "minor", "frontend",
     "Avatar fallback 이 primary-500/700 + text-white 직접 사용 (토큰 우회)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 Avatar fallback 표시",
      "repro": "1. avatar.tsx 의 AvatarFallback 이 bg-gradient-to-br from-primary-500 to-primary-700 text-white 사용\n2. 라이트/다크 자동 전환 안 됨 + 새 primary 토큰 우회",
      "cause_fix": "원인: 마이그레이션 누락.\n수정: bg-primary text-primary-foreground 로 통일 (그라디언트 제거).",
      "scope": "Avatar",
      "found_version": "@sym/ui 0.1.0 (수정 도중)"}),

    (26, "bug", "minor", "frontend",
     "Badge primary/danger variant 가 primary-50/700/950 등 직접 사용 (토큰 우회)",
     "@sym/ui 0.1.0",
     {"prereq": "다크모드에서 Badge primary/danger variant 표시",
      "repro": "1. badge.tsx primary variant: bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300\n2. danger variant: palette-coupled",
      "cause_fix": "원인: 토큰 마이그레이션 시 색조형 variant 누락.\n수정: primary → bg-primary/15 text-primary, danger → bg-destructive/10 text-destructive.",
      "scope": "Badge",
      "found_version": "@sym/ui 0.1.0 (수정 도중)"}),

    (27, "bug", "minor", "frontend",
     "Dialog/Sheet overlay 가 bg-black/50 하드코딩 (오버레이 토큰 부재)",
     "@sym/ui 0.1.0",
     {"prereq": "Dialog/Sheet 열기",
      "repro": "1. dialog.tsx, sheet.tsx 의 overlay 가 bg-black/50 하드코딩\n2. 라이트/다크에서 overlay 색조 분리 불가",
      "cause_fix": "원인: --overlay 토큰 미정의.\n수정: globals.css 에 --overlay 정의, tailwind.preset.cjs 에 overlay 토큰 추가, bg-overlay/50 으로 통일.",
      "scope": "Dialog, Sheet, globals.css, tailwind.preset.cjs",
      "found_version": "@sym/ui 0.1.0 (수정 도중)"}),

    # === Gemini 외부 평가 후 발견 ===
    (28, "bug", "minor", "etc",
     "Storybook preview.tsx wrapper decorator 가 dark:[#131722]/[#d1d4dc] 하드코딩 (토큰 마이그레이션 누락)",
     "docs 0.0.0 (post-v0.1.0)",
     {"prereq": "Storybook 다크모드 전환",
      "repro": "1. apps/docs/.storybook/preview.tsx 의 Story wrapper 가 dark:bg-[#131722] dark:text-[#d1d4dc] 사용\n2. v0.1.0 토큰 마이그레이션 시 컴포넌트만 grep 해서 docs preview decorator 누락\n3. 다크 토큰 시스템 일관성 깨짐",
      "cause_fix": "원인: Codex 가 packages/ui/src/components/ 만 검사하고 apps/docs 는 범위 외였음.\n수정: bg-background text-foreground 토큰으로 교체, 주석도 갱신.",
      "scope": "apps/docs/.storybook (라이브러리 출판물에는 영향 없음)",
      "found_version": "@sym/ui 0.1.0 (docs decorator 잔존)"}),
]


def severity_label(sev: str) -> str:
    return sev.lower()  # already lowercase


def make_bug_body(p: dict) -> str:
    return f"""## 심각도
{p.get("severity", "")}

## 발생 버전
{p["found_version"]}

## 사전 조건
{p["prereq"] or "없음"}

## 재현 방법
{p["repro"]}

## 발생 원인 및 수정사항
{p["cause_fix"]}

## 영향 범위
{p["scope"]}

## 수정 버전
{p["fix_version"]}
"""


def make_enhancement_body(p: dict) -> str:
    body = f"""## 심각도
{p.get("severity", "")}

## 발생 버전
{p["found_version"]}

## 개선 사항
{p["change"]}

## 개선 사유
{p["reason"]}
"""
    if p.get("scope"):
        body += f"\n## 영향 범위\n{p['scope']}\n"
    body += f"\n## 수정 버전\n{p['fix_version']}\n"
    return body


TOTAL = len(ISSUES)


def list_existing_titles() -> set[str]:
    out = subprocess.run(
        ["gh", "issue", "list", "--repo", REPO, "--state", "all", "--limit", "200",
         "--json", "title"],
        capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout
    items = json.loads(out)
    return {it["title"] for it in items}


def create_issue(num: int, kind: str, severity: str, area: str, title: str,
                 fix_version: str, payload: dict) -> int:
    payload_full = dict(payload)
    payload_full["severity"] = severity.capitalize()
    payload_full["fix_version"] = fix_version
    body = make_bug_body(payload_full) if kind == "bug" else make_enhancement_body(payload_full)
    labels = f"{kind},{severity_label(severity)},{area}"
    print(f"[{num}/{TOTAL}] CREATE {kind}/{severity}/{area} :: {title[:60]}")
    proc = subprocess.run(
        ["gh", "issue", "create",
         "--repo", REPO,
         "--title", title,
         "--label", labels,
         "--body", body],
        capture_output=True, text=True, encoding="utf-8",
    )
    if proc.returncode != 0:
        print(f"  ! create failed: {proc.stderr}")
        return -1
    url = proc.stdout.strip()
    issue_num = int(url.rsplit("/", 1)[-1])
    print(f"  -> #{issue_num} {url}")
    return issue_num


def close_issue(issue_num: int) -> None:
    proc = subprocess.run(
        ["gh", "issue", "close", str(issue_num), "--repo", REPO,
         "--comment", "수정 완료. v0.1.0 에 반영됨."],
        capture_output=True, text=True, encoding="utf-8",
    )
    if proc.returncode != 0:
        print(f"  ! close failed: {proc.stderr}")
    else:
        print(f"  -> closed #{issue_num}")


def main():
    existing = list_existing_titles()
    print(f"existing titles in repo: {len(existing)}")
    created = 0
    skipped = 0
    for row in ISSUES:
        num, kind, severity, area, title, fix_version, payload = row
        if title in existing:
            print(f"[{num}/{TOTAL}] SKIP (already exists) :: {title[:60]}")
            skipped += 1
            continue
        issue_num = create_issue(num, kind, severity, area, title, fix_version, payload)
        if issue_num > 0:
            close_issue(issue_num)
            created += 1
    print(f"\nDone. created={created}, skipped={skipped}, total={len(ISSUES)}")


if __name__ == "__main__":
    main()
