# sym-ui

개인 범용 React 디자인시스템. Tailwind + Radix 기반, shadcn/ui 스타일로 배포.

## 설치

```bash
cd my-app
npx @sym/ui-cli@latest init
npx @sym/ui-cli@latest add button input tooltip
```

## 컴포넌트

- **Tier 1** (Core): Button / Input / Label / Card / Badge / Avatar / Tooltip / Toast
- **Tier 2** (Forms & Modals): Dialog / DropdownMenu / Select / Checkbox / Switch / Tabs / Skeleton
- **Tier 3** (Full Suite): Popover / Accordion / Progress / RadioGroup / Sheet / Command / Combobox / DataTable / Calendar / DatePicker / Form

총 26개 컴포넌트. 다크모드 전체 지원.

## 문서

https://ymseo.github.io/sym-ui

## 로컬 개발

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## 스택

React 18, TypeScript 5, Tailwind v3 (+ tailwindcss-animate), Radix UI, CVA, cmdk, TanStack Table, react-day-picker, react-hook-form + zod, Storybook 8, Vitest, Turborepo
