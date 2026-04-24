# sym-ui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** shadcn/ui 스타일로 배포되는 개인 범용 React 디자인시스템 sym-ui (토큰 + 8개 컴포넌트 + CLI + Storybook 문서) 를 모노레포로 구축한다.

**Architecture:** pnpm workspace + Turborepo 모노레포. `packages/ui` 가 컴포넌트 소스 본체이고 `packages/cli` 의 `@sym/ui-cli` 가 소비 프로젝트에 파일을 복사한다. `apps/docs` 는 Storybook 8 문서 사이트. 각 컴포넌트는 Tailwind + CVA 조합으로 스타일링하고 Radix UI 를 프리미티브로 래핑한다. TDD: 컴포넌트마다 Vitest + Testing Library 로 테스트를 먼저 쓰고 구현한다.

**Tech Stack:** TypeScript 5 / React 18 / Tailwind CSS 3 / class-variance-authority / clsx + tailwind-merge / Radix UI / Vitest + Testing Library / Storybook 8 + Vite / tsup / changesets / Turborepo / pnpm

---

## File Structure

```
sym-ui/
├── .changeset/config.json
├── .github/workflows/
│   ├── ci.yml
│   ├── release.yml
│   └── deploy-docs.yml
├── .gitignore
├── .prettierrc.json
├── eslint.config.mjs
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── turbo.json
├── README.md
├── apps/docs/
│   ├── .storybook/{main.ts,preview.tsx}
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── src/globals.css
│   └── stories/
│       ├── brand/{Identity,ColorPalette,Typography}.mdx
│       └── components/{button,input,label,card,badge,avatar,tooltip,toast}.stories.tsx
└── packages/
    ├── ui/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   ├── tailwind.preset.js
    │   ├── templates/globals.css
    │   └── src/
    │       ├── index.ts
    │       ├── test-setup.ts
    │       ├── lib/utils.ts
    │       ├── tokens/{colors,typography,radius,spacing,shadow,index}.ts
    │       └── components/
    │           ├── {button,input,label,card,badge,avatar,tooltip,toast}.tsx
    │           └── {button,input,label,card,badge,avatar,tooltip,toast}.test.tsx
    └── cli/
        ├── package.json
        ├── tsconfig.json
        ├── tsup.config.ts
        └── src/
            ├── index.ts
            ├── commands/{init,add}.ts
            ├── utils/{fs,registry,prompts,runner}.ts
            └── scripts/build-registry.ts
```

---

## Phase 1. Monorepo Foundation

### Task 1: pnpm workspace 초기화

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `.gitignore`, `.nvmrc`, `.npmrc`

- [ ] **Step 1: 루트 `package.json` 작성**

```json
{
  "name": "sym-ui",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,md,json,js,mjs,cjs}\""
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "turbo": "^2.1.3",
    "typescript": "^5.6.2"
  }
}
```

- [ ] **Step 2: `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: `.gitignore`**

```
node_modules
dist
.turbo
.next
storybook-static
*.tsbuildinfo
.DS_Store
coverage
.env*
!.env.example
.superpowers/
packages/cli/registry.json
```

- [ ] **Step 4: `.nvmrc` 와 `.npmrc`**

```
# .nvmrc
20
```

```
# .npmrc
engine-strict=true
```

- [ ] **Step 5: 의존성 설치 + 커밋**

```bash
pnpm install
git add package.json pnpm-workspace.yaml pnpm-lock.yaml .gitignore .nvmrc .npmrc
git commit -m "chore: bootstrap pnpm workspace"
```

---

### Task 2: Turborepo 파이프라인

**Files:**
- Create: `turbo.json`

- [ ] **Step 1: `turbo.json` 작성**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "storybook-static/**", "registry.json"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "registry:build": {
      "inputs": ["packages/ui/src/components/**"],
      "outputs": ["packages/cli/registry.json"]
    }
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add turbo.json
git commit -m "chore: add turborepo pipeline"
```

---

### Task 3: TypeScript 기본 설정

**Files:**
- Create: `tsconfig.base.json`

- [ ] **Step 1: 루트 베이스 tsconfig**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add tsconfig.base.json
git commit -m "chore: add shared tsconfig"
```

---

### Task 4: ESLint + Prettier

**Files:**
- Create: `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add -Dw eslint @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  prettier-plugin-tailwindcss
```

- [ ] **Step 2: `eslint.config.mjs`**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/storybook-static/**", "**/.turbo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": hooks, "jsx-a11y": a11y },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  }
);
```

- [ ] **Step 3: `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 4: `.prettierignore`**

```
dist
.turbo
storybook-static
pnpm-lock.yaml
coverage
```

- [ ] **Step 5: 루트 scripts 에 lint 추가 + 커밋**

루트 `package.json` scripts 에 `"lint:eslint": "eslint ."` 추가.

```bash
git add eslint.config.mjs .prettierrc.json .prettierignore package.json pnpm-lock.yaml
git commit -m "chore: add eslint + prettier config"
```

---

## Phase 2. UI Package: Tokens + Tailwind Preset

### Task 5: `packages/ui` 스캐폴드

**Files:**
- Create: `packages/ui/package.json`, `tsconfig.json`, `vitest.config.ts`, `src/test-setup.ts`

- [ ] **Step 1: `packages/ui/package.json`**

```json
{
  "name": "@sym/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./tokens": "./src/tokens/index.ts",
    "./lib/utils": "./src/lib/utils.ts",
    "./tailwind.preset": "./tailwind.preset.js",
    "./templates/globals.css": "./templates/globals.css"
  },
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "jsdom": "^25.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.13",
    "vitest": "^2.1.1"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  }
}
```

- [ ] **Step 2: `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "noEmit": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tailwind.preset.js"]
}
```

- [ ] **Step 3: Vitest 설정 `packages/ui/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: `packages/ui/src/test-setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: 설치 + 커밋**

```bash
pnpm install
git add packages/ui/package.json packages/ui/tsconfig.json packages/ui/vitest.config.ts packages/ui/src/test-setup.ts pnpm-lock.yaml
git commit -m "feat(ui): scaffold @sym/ui package"
```

---

### Task 6: Color tokens

**Files:**
- Create: `packages/ui/src/tokens/colors.ts`

- [ ] **Step 1: color 토큰 정의**

```ts
// packages/ui/src/tokens/colors.ts
export const primary = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
  950: "#172554",
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

export const colors = { primary, neutral, semantic } as const;
export type ColorScale = typeof primary;
export type SemanticColor = keyof typeof semantic;
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/src/tokens/colors.ts
git commit -m "feat(ui): add color tokens"
```

---

### Task 7: Typography / Radius / Spacing / Shadow tokens

**Files:**
- Create: `packages/ui/src/tokens/{typography,radius,spacing,shadow,index}.ts`

- [ ] **Step 1: `typography.ts`**

```ts
export const fontFamily = {
  sans: [
    "Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont",
    "system-ui", "Roboto", "sans-serif",
  ],
  mono: ["IBM Plex Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
} as const;

export const fontSize = {
  caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.4px", fontWeight: "600" }],
  small: ["14px", { lineHeight: "1.5" }],
  body: ["16px", { lineHeight: "1.5" }],
  h3: ["18px", { lineHeight: "1.35", fontWeight: "600" }],
  h2: ["22px", { lineHeight: "1.25", fontWeight: "700" }],
  h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
  display: ["36px", { lineHeight: "1.15", fontWeight: "800" }],
} as const;
```

- [ ] **Step 2: `radius.ts`**

```ts
export const radius = {
  none: "0px",
  sm: "4px",
  base: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;
```

- [ ] **Step 3: `spacing.ts`**

```ts
export const spacing = Object.freeze({
  0: "0px", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px",
  6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px", 20: "80px", 24: "96px",
});
```

- [ ] **Step 4: `shadow.ts`**

```ts
export const shadow = {
  sm: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
  md: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 12px 24px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06)",
  xl: "0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)",
} as const;
```

- [ ] **Step 5: `tokens/index.ts`**

```ts
export * from "./colors";
export * from "./typography";
export * from "./radius";
export * from "./spacing";
export * from "./shadow";
```

- [ ] **Step 6: 커밋**

```bash
git add packages/ui/src/tokens/
git commit -m "feat(ui): add typography, radius, spacing, shadow tokens"
```

---

### Task 8: Tailwind preset

**Files:**
- Create: `packages/ui/tailwind.preset.js`

- [ ] **Step 1: preset 작성**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",  100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
          800: "#1e40af", 900: "#1e3a8a", 950: "#172554",
          DEFAULT: "#3b82f6",
        },
        neutral: {
          50: "#fafaf9",  100: "#f5f4f2", 200: "#e7e5e1", 300: "#d3d0ca",
          400: "#a8a49c", 500: "#78746c", 600: "#57544e", 700: "#433f3b",
          800: "#2a2724", 900: "#1a1815", 950: "#0f0e0c",
        },
        success: "#12b76a",
        warning: "#f2a900",
        danger: "#f04438",
        info: "#3d7eff",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "4px", DEFAULT: "8px", md: "12px", lg: "16px", xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
        DEFAULT: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
        md: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
        lg: "0 12px 24px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06)",
        xl: "0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)",
      },
    },
  },
};
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/tailwind.preset.js
git commit -m "feat(ui): add tailwind preset"
```

---

### Task 9: globals.css 템플릿

**Files:**
- Create: `packages/ui/templates/globals.css`

- [ ] **Step 1: 템플릿 작성**

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css");
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 24 12% 10%;
    --muted: 30 10% 96%;
    --muted-foreground: 30 4% 45%;
    --ring: 217 91% 60%;
  }
  .dark {
    --background: 24 12% 6%;
    --foreground: 30 10% 96%;
    --muted: 30 5% 16%;
    --muted-foreground: 30 4% 62%;
    --ring: 213 93% 72%;
  }
  html { font-family: theme("fontFamily.sans"); }
  body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
  code, kbd, pre, samp { font-family: theme("fontFamily.mono"); }
}
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/templates/globals.css
git commit -m "feat(ui): add globals.css template"
```

---

### Task 10: `cn()` 유틸 (TDD)

**Files:**
- Create: `packages/ui/src/lib/utils.ts`, `utils.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

```ts
// packages/ui/src/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
  it("handles conditional classes", () => {
    const show = false as boolean;
    expect(cn("a", show && "b", "c")).toBe("a c");
  });
  it("handles undefined/null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});
```

- [ ] **Step 2: 실패 확인**

```
pnpm --filter @sym/ui test -- utils
```
Expected: FAIL (`cn is not defined`)

- [ ] **Step 3: `utils.ts` 구현**

```ts
// packages/ui/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: 통과 확인**

```
pnpm --filter @sym/ui test -- utils
```
Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/lib/
git commit -m "feat(ui): add cn() utility"
```

---

## Phase 3. Primitive Components (TDD)

### Task 11: Button 컴포넌트

**Files:**
- Create: `packages/ui/src/components/button.tsx`, `button.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

```tsx
// packages/ui/src/components/button.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders text", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button").className).toMatch(/bg-danger/);
  });
  it("applies size classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toMatch(/h-8/);
  });
  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>X</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

- [ ] **Step 2: 실패 확인**

```
pnpm --filter @sym/ui test -- button
```
Expected: FAIL

- [ ] **Step 3: `button.tsx` 구현**

```tsx
// packages/ui/src/components/button.tsx
/**
 * @registry-meta
 * name: button
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
        outline: "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
        ghost: "text-neutral-700 hover:bg-neutral-100",
        destructive: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[8px]",
        default: "h-10 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
```

- [ ] **Step 4: 통과 확인 → PASS (6 tests)**

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/components/button.tsx packages/ui/src/components/button.test.tsx
git commit -m "feat(ui): add Button component"
```

---

### Task 12: Badge 컴포넌트

**Files:**
- Create: `packages/ui/src/components/badge.tsx`, `badge.test.tsx`

- [ ] **Step 1: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders text", () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });
  it("applies variant classes", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK").className).toMatch(/success/);
  });
  it("renders outline variant with border", () => {
    render(<Badge variant="outline">X</Badge>);
    expect(screen.getByText("X").className).toMatch(/border/);
  });
});
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: `badge.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: badge
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-[0.2px]",
  {
    variants: {
      variant: {
        primary: "bg-primary-50 text-primary-700",
        neutral: "bg-neutral-100 text-neutral-700",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger",
        outline: "border border-neutral-200 text-neutral-700",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
```

- [ ] **Step 4: 통과 확인** → PASS

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/components/badge.tsx packages/ui/src/components/badge.test.tsx
git commit -m "feat(ui): add Badge component"
```

---

### Task 13: Input 컴포넌트

**Files:**
- Create: `packages/ui/src/components/input.tsx`, `input.test.tsx`

- [ ] **Step 1: 실패 테스트**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
  it("calls onChange when typed", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="x" />);
    await userEvent.type(screen.getByPlaceholderText("x"), "a");
    expect(onChange).toHaveBeenCalled();
  });
  it("applies error styling when data-error is set", () => {
    render(<Input data-error placeholder="x" />);
    expect(screen.getByPlaceholderText("x").className).toMatch(/border-danger/);
  });
  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toBeDisabled();
  });
  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="x" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: `input.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: input
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type ?? "text"}
      className={cn(
        "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm",
        "placeholder:text-neutral-400",
        "focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-100",
        "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
        "data-[error=true]:border-danger data-[error=true]:focus-visible:ring-danger/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
```

- [ ] **Step 4: 통과 확인** → PASS

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/components/input.tsx packages/ui/src/components/input.test.tsx
git commit -m "feat(ui): add Input component"
```

---

### Task 14: Label 컴포넌트

**Files:**
- Create: `packages/ui/src/components/label.tsx`, `label.test.tsx`

- [ ] **Step 1: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
  it("shows required indicator when required prop is true", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("Name").parentElement).toHaveTextContent(/\*/);
  });
  it("associates with input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "email");
  });
});
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: `label.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: label
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-semibold text-neutral-700 mb-1.5", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  ),
);
Label.displayName = "Label";
```

- [ ] **Step 4: 통과 확인** → PASS

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/components/label.tsx packages/ui/src/components/label.test.tsx
git commit -m "feat(ui): add Label component"
```

---

## Phase 4. Compound & Radix Components

### Task 15: Card (compound)

**Files:**
- Create: `packages/ui/src/components/card.tsx`, `card.test.tsx`

- [ ] **Step 1: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

describe("Card", () => {
  it("renders a full compound card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
  it("Card root has rounded border", () => {
    const { container } = render(<Card data-testid="c">x</Card>);
    expect(container.querySelector('[data-testid="c"]')?.className).toMatch(/rounded-md/);
  });
});
```

- [ ] **Step 2: 실패 확인** → FAIL

- [ ] **Step 3: `card.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: card
 * dependencies: []
 * internalDeps: ["utils"]
 */
import * as React from "react";
import { cn } from "../lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-md border border-neutral-100 bg-white p-5 shadow-sm", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 mb-3", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("text-base font-bold text-neutral-900", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-neutral-500", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm", className)} {...props} />,
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-2 pt-3 mt-3 border-t border-neutral-100", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";
```

- [ ] **Step 4: 통과 확인** → PASS

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/components/card.tsx packages/ui/src/components/card.test.tsx
git commit -m "feat(ui): add Card compound component"
```

---

### Task 16: Avatar (Radix)

**Files:**
- Modify: `packages/ui/package.json` (add `@radix-ui/react-avatar`)
- Create: `packages/ui/src/components/avatar.tsx`, `avatar.test.tsx`

- [ ] **Step 1: Radix Avatar 설치**

```bash
pnpm --filter @sym/ui add @radix-ui/react-avatar
```

- [ ] **Step 2: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar", () => {
  it("renders fallback when no image", () => {
    render(
      <Avatar>
        <AvatarFallback>SY</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("SY")).toBeInTheDocument();
  });
  it("renders fallback text when image provided (jsdom does not load images)", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/a.png" alt="user" />
        <AvatarFallback>X</AvatarFallback>
      </Avatar>,
    );
    expect(container.textContent).toContain("X");
  });
});
```

- [ ] **Step 3: 실패 확인** → FAIL

- [ ] **Step 4: `avatar.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: avatar
 * dependencies: ["@radix-ui/react-avatar"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
```

- [ ] **Step 5: 통과 확인** → PASS

- [ ] **Step 6: 커밋**

```bash
git add packages/ui/src/components/avatar.tsx packages/ui/src/components/avatar.test.tsx packages/ui/package.json pnpm-lock.yaml
git commit -m "feat(ui): add Avatar component (Radix)"
```

---

### Task 17: Tooltip (Radix)

**Files:**
- Modify: `packages/ui/package.json` (add `@radix-ui/react-tooltip`)
- Create: `packages/ui/src/components/tooltip.tsx`, `tooltip.test.tsx`

- [ ] **Step 1: Radix Tooltip 설치**

```bash
pnpm --filter @sym/ui add @radix-ui/react-tooltip
```

- [ ] **Step 2: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

describe("Tooltip", () => {
  it("shows content on hover", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await userEvent.hover(screen.getByText("Hover me"));
    // Radix Tooltip renders the content twice: once visible, once as an
    // sr-only role="tooltip" sibling for screen readers. Assert via role
    // so we target the authoritative accessibility node.
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful hint");
  });
});
```

- [ ] **Step 3: 실패 확인** → FAIL

- [ ] **Step 4: `tooltip.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: tooltip
 * dependencies: ["@radix-ui/react-tooltip"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
```

- [ ] **Step 5: 통과 확인** → PASS

- [ ] **Step 6: 커밋**

```bash
git add packages/ui/src/components/tooltip.tsx packages/ui/src/components/tooltip.test.tsx packages/ui/package.json pnpm-lock.yaml
git commit -m "feat(ui): add Tooltip component (Radix)"
```

---

### Task 18: Toast (Radix) + barrel export

**Files:**
- Modify: `packages/ui/package.json` (add `@radix-ui/react-toast`)
- Create: `packages/ui/src/components/toast.tsx`, `toast.test.tsx`, `packages/ui/src/index.ts`

- [ ] **Step 1: Radix Toast 설치**

```bash
pnpm --filter @sym/ui add @radix-ui/react-toast
```

- [ ] **Step 2: 실패 테스트**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from "./toast";

describe("Toast", () => {
  it("renders toast content inside provider", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Changes stored</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Changes stored")).toBeInTheDocument();
  });
  it("applies variant styling", () => {
    render(
      <ToastProvider>
        <Toast open variant="danger">
          <ToastTitle>Err</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    const el = screen.getByText("Err").closest("[data-variant]");
    expect(el?.getAttribute("data-variant")).toBe("danger");
  });
});
```

- [ ] **Step 3: 실패 확인** → FAIL

- [ ] **Step 4: `toast.tsx` 구현**

```tsx
/**
 * @registry-meta
 * name: toast
 * dependencies: ["@radix-ui/react-toast"]
 * internalDeps: ["utils"]
 */
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn("fixed bottom-4 right-4 z-[100] flex max-h-screen w-96 flex-col gap-2", className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 rounded-md border p-4 shadow-lg",
  {
    variants: {
      variant: {
        success: "border-success/30 bg-white",
        danger: "border-danger/30 bg-white",
        info: "border-info/30 bg-white",
        warning: "border-warning/30 bg-white",
      },
    },
    defaultVariants: { variant: "success" },
  },
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      data-variant={variant ?? "success"}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  ),
);
Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("text-sm font-bold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-xs text-neutral-500", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export { toastVariants };
```

- [ ] **Step 5: 통과 확인** → PASS

- [ ] **Step 6: 패키지 barrel `packages/ui/src/index.ts`**

```ts
export * from "./components/button";
export * from "./components/badge";
export * from "./components/input";
export * from "./components/label";
export * from "./components/card";
export * from "./components/avatar";
export * from "./components/tooltip";
export * from "./components/toast";
export * from "./lib/utils";
export * as tokens from "./tokens";
```

- [ ] **Step 7: 커밋**

```bash
git add packages/ui/src/components/toast.tsx packages/ui/src/components/toast.test.tsx packages/ui/src/index.ts packages/ui/package.json pnpm-lock.yaml
git commit -m "feat(ui): add Toast component and barrel export"
```

---

## Phase 5. Docs App (Storybook 8)

### Task 19: `apps/docs` 스캐폴드

**Files:**
- Create: `apps/docs/package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `src/globals.css`

- [ ] **Step 1: `apps/docs/package.json`**

```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build -o storybook-static",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@sym/ui": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^8.3.0",
    "@storybook/addon-essentials": "^8.3.0",
    "@storybook/blocks": "^8.3.0",
    "@storybook/react": "^8.3.0",
    "@storybook/react-vite": "^8.3.0",
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "storybook": "^8.3.0",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}
```

- [ ] **Step 2: `apps/docs/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "noEmit": true, "rootDir": "." },
  "include": ["src", "stories", ".storybook"]
}
```

- [ ] **Step 3: `apps/docs/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@sym/ui/tailwind.preset")],
  content: [
    "./stories/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
```

- [ ] **Step 4: `apps/docs/postcss.config.js`**

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 5: `apps/docs/src/globals.css`**

```css
@import "@sym/ui/templates/globals.css";
```

- [ ] **Step 6: 설치 + 커밋**

```bash
pnpm install
git add apps/docs/ pnpm-lock.yaml
git commit -m "chore(docs): scaffold storybook app"
```

---

### Task 20: Storybook 설정

**Files:**
- Create: `apps/docs/.storybook/main.ts`, `preview.tsx`

- [ ] **Step 1: `main.ts`**

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: "tag" },
};
export default config;
```

- [ ] **Step 2: `preview.tsx`**

```tsx
import type { Preview } from "@storybook/react";
import "../src/globals.css";
import { TooltipProvider } from "@sym/ui";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0f0e0c" },
      ],
    },
    a11y: { config: { rules: [] } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default preview;
```

- [ ] **Step 3: Storybook 실행 확인**

```
pnpm --filter docs dev
```
Expected: `http://localhost:6006` 에서 Storybook 로드

- [ ] **Step 4: 커밋**

```bash
git add apps/docs/.storybook/
git commit -m "chore(docs): add storybook config"
```

---

### Task 21: 컴포넌트 스토리 작성

**Files:**
- Create: `apps/docs/stories/components/{button,input,label,card,badge,avatar,tooltip,toast}.stories.tsx`

- [ ] **Step 1: `button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sym/ui";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
};
export default meta;
type Story = StoryObj<typeof Button>;
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Small: Story = { args: { size: "sm", children: "Small" } };
export const Large: Story = { args: { size: "lg", children: "Large" } };
export const Icon: Story = { args: { size: "icon", children: "+" } };
export const Disabled: Story = { args: { disabled: true } };
```

- [ ] **Step 2: `input.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@sym/ui";

const meta: Meta<typeof Input> = {
  title: "Components/Input", component: Input, tags: ["autodocs"],
  args: { placeholder: "이메일 입력" },
};
export default meta;
type Story = StoryObj<typeof Input>;
export const Default: Story = {};
export const Error: Story = { args: { "data-error": true, defaultValue: "invalid@" } };
export const Disabled: Story = { args: { disabled: true, placeholder: "입력 불가" } };
```

- [ ] **Step 3: `label.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Label, Input } from "@sym/ui";

const meta: Meta<typeof Label> = { title: "Components/Label", component: Label, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Label>;
export const Default: Story = {
  render: () => (
    <div>
      <Label htmlFor="email">이메일</Label>
      <Input id="email" placeholder="name@company.com" />
    </div>
  ),
};
export const Required: Story = {
  render: () => (
    <div>
      <Label htmlFor="name" required>닉네임</Label>
      <Input id="name" placeholder="2~12자" />
    </div>
  ),
};
```

- [ ] **Step 4: `card.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from "@sym/ui";

const meta: Meta<typeof Card> = { title: "Components/Card", component: Card, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Card>;
export const Full: Story = {
  render: () => (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>이번 달 매출</CardTitle>
        <CardDescription>지난달 대비 +12% 상승</CardDescription>
      </CardHeader>
      <CardContent><div className="text-2xl font-extrabold">₩ 4,280,000</div></CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">닫기</Button>
        <Button size="sm">열기</Button>
      </CardFooter>
    </Card>
  ),
};
export const WithBadge: Story = {
  render: () => (
    <Card className="w-[320px]">
      <Badge className="mb-2">NEW</Badge>
      <CardTitle>시스템 공지</CardTitle>
      <CardDescription>새 기능이 추가되었습니다.</CardDescription>
    </Card>
  ),
};
```

- [ ] **Step 5: `badge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@sym/ui";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge", component: Badge, tags: ["autodocs"],
  args: { children: "NEW" },
};
export default meta;
type Story = StoryObj<typeof Badge>;
export const Primary: Story = { args: { variant: "primary" } };
export const Neutral: Story = { args: { variant: "neutral", children: "Draft" } };
export const Success: Story = { args: { variant: "success", children: "Active" } };
export const Warning: Story = { args: { variant: "warning", children: "Pending" } };
export const Danger: Story = { args: { variant: "danger", children: "Failed" } };
export const Outline: Story = { args: { variant: "outline", children: "Archived" } };
```

- [ ] **Step 6: `avatar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "@sym/ui";

const meta: Meta<typeof Avatar> = { title: "Components/Avatar", component: Avatar, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Avatar>;
export const Initials: Story = {
  render: () => <Avatar><AvatarFallback>SY</AvatarFallback></Avatar>,
};
export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="user" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
};
export const Stack: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="ring-2 ring-white"><AvatarFallback>SY</AvatarFallback></Avatar>
      <Avatar className="ring-2 ring-white"><AvatarFallback>KH</AvatarFallback></Avatar>
      <Avatar className="ring-2 ring-white bg-neutral-200">
        <AvatarFallback className="bg-neutral-200 from-neutral-200 to-neutral-200 text-neutral-600">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};
```

- [ ] **Step 7: `tooltip.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "@sym/ui";

const meta: Meta = { title: "Components/Tooltip", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="secondary">Hover me</Button></TooltipTrigger>
      <TooltipContent>이메일로 로그인</TooltipContent>
    </Tooltip>
  ),
};
```

- [ ] **Step 8: `toast.stories.tsx`**

```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport, Button } from "@sym/ui";

const meta: Meta = { title: "Components/Toast", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <ToastProvider swipeDirection="right">
        <Button onClick={() => { setOpen(false); setOpen(true); }}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen} variant="success">
          <ToastTitle>저장되었습니다</ToastTitle>
          <ToastDescription>변경 사항이 자동 동기화됩니다.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};
```

- [ ] **Step 9: 확인 + 커밋**

```
pnpm --filter docs dev   # 모든 스토리 수동 확인
git add apps/docs/stories/components/
git commit -m "docs(storybook): add stories for 8 components"
```

---

### Task 22: Brand MDX 페이지

**Files:**
- Create: `apps/docs/stories/brand/{Identity,ColorPalette,Typography}.mdx`

- [ ] **Step 1: `Identity.mdx`**

```mdx
import { Meta } from "@storybook/blocks";

<Meta title="Brand/Identity" />

# sym-ui Brand

개인 사이드 프로젝트 전용 디자인시스템. 따뜻하고 둥글며 블루 중심의 톤.

## 브랜드 보이스
- 간결: 불필요한 장식 없음
- 친근: 부드러운 반경, 웜 그레이
- 신뢰: 블루 프라이머리, 명확한 상태 컬러

## 사용 규칙
- 프라이머리 블루는 CTA 요소에만 사용 (primary button, active state, link)
- 뉴트럴 컬러는 surface / border / text 계층 구분 용도
- 시맨틱 컬러는 상태 전달 목적 외 사용 금지
```

- [ ] **Step 2: `ColorPalette.mdx`**

```mdx
import { Meta, ColorPalette, ColorItem } from "@storybook/blocks";
import { colors } from "@sym/ui/tokens";

<Meta title="Brand/Color Palette" />

# Color Tokens

<ColorPalette>
  <ColorItem title="primary" subtitle="Brand" colors={colors.primary} />
  <ColorItem title="neutral" subtitle="Warm Gray" colors={colors.neutral} />
  <ColorItem title="semantic" subtitle="Status" colors={{
    success: colors.semantic.success,
    warning: colors.semantic.warning,
    danger: colors.semantic.danger,
    info: colors.semantic.info,
  }} />
</ColorPalette>
```

- [ ] **Step 3: `Typography.mdx`**

```mdx
import { Meta, Typeset } from "@storybook/blocks";

<Meta title="Brand/Typography" />

# Typography

Sans: **Pretendard Variable** (한글/영문 공용)
Mono: **IBM Plex Mono**

<Typeset
  fontSizes={[12, 14, 16, 18, 22, 28, 36]}
  fontWeight={600}
  sampleText="디자인시스템은 선택이 아닌 일관성이다."
  fontFamily='"Pretendard Variable", -apple-system, sans-serif'
/>
```

- [ ] **Step 4: 커밋**

```bash
git add apps/docs/stories/brand/
git commit -m "docs(storybook): add brand MDX pages"
```

---

## Phase 6. CLI (`@sym/ui-cli`)

CLI 가 외부 패키지 매니저를 호출해야 하므로, 모든 서브프로세스 호출은 안전한 래퍼를 통해 수행한다. 인자 배열을 받는 `spawn`/`execFile` 계열 API만 사용하고, 셸 문자열 조립은 금지한다.

### Task 23: CLI 패키지 스캐폴드 + 안전 Runner

**Files:**
- Create: `packages/cli/package.json`, `tsconfig.json`, `tsup.config.ts`, `src/index.ts`, `src/utils/runner.ts`

- [ ] **Step 1: `packages/cli/package.json`**

```json
{
  "name": "@sym/ui-cli",
  "version": "0.0.0",
  "type": "module",
  "bin": { "sym-ui": "./dist/index.js" },
  "main": "./dist/index.js",
  "files": ["dist", "registry.json"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "registry:build": "tsx src/scripts/build-registry.ts"
  },
  "dependencies": {
    "commander": "^12.1.0",
    "prompts": "^2.4.2",
    "kleur": "^4.1.5",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.4",
    "@types/prompts": "^2.4.9",
    "@types/node": "^22.7.4",
    "tsup": "^8.3.0",
    "tsx": "^4.19.1"
  }
}
```

- [ ] **Step 2: `packages/cli/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "noEmit": false,
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: `packages/cli/tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  shims: true,
});
```

- [ ] **Step 4: 안전 서브프로세스 Runner `src/utils/runner.ts`**

셸 주입을 방지하기 위해 `spawn` 을 쓰고 `shell: false` (기본값). 인자는 반드시 배열로 전달.

```ts
// packages/cli/src/utils/runner.ts
import { spawn } from "node:child_process";

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export function run(command: string, args: string[], cwd: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, shell: false, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
      process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

/** pnpm 이 있으면 pnpm, 없으면 npm 을 사용해 패키지 설치 */
export async function installPackages(packages: string[], cwd: string): Promise<void> {
  if (packages.length === 0) return;
  const pnpm = await run("pnpm", ["--version"], cwd);
  if (pnpm.code === 0) {
    await run("pnpm", ["add", ...packages], cwd);
  } else {
    await run("npm", ["install", ...packages], cwd);
  }
}
```

- [ ] **Step 5: CLI 엔트리 `src/index.ts`**

```ts
#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";

const program = new Command();
program.name("sym-ui").description("sym-ui CLI").version("0.0.0");
program.command("init").description("Initialize sym-ui in the current project").action(initCommand);
program
  .command("add [components...]")
  .description("Add one or more sym-ui components")
  .option("-y, --yes", "Overwrite existing files without prompt", false)
  .action(addCommand);

program.parseAsync(process.argv);
```

- [ ] **Step 6: 설치 + 커밋**

```bash
pnpm install
git add packages/cli/ pnpm-lock.yaml
git commit -m "chore(cli): scaffold @sym/ui-cli with safe subprocess runner"
```

---

### Task 24: Registry 빌드 스크립트

**Files:**
- Create: `packages/cli/src/scripts/build-registry.ts`

- [ ] **Step 1: 빌드 스크립트 작성**

```ts
// packages/cli/src/scripts/build-registry.ts
import fs from "node:fs";
import path from "node:path";

interface Entry {
  name: string;
  files: string[];
  dependencies: string[];
  internalDeps: string[];
  sourceContent: string;
}

const UI_ROOT = path.resolve(process.cwd(), "../ui/src/components");
const OUT = path.resolve(process.cwd(), "registry.json");

function parseMeta(src: string) {
  const match = src.match(/@registry-meta([\s\S]*?)\*\//);
  const meta: { name?: string; dependencies?: string[]; internalDeps?: string[] } = {};
  if (!match) return meta;
  const block = match[1];
  const name = /name:\s*([\w-]+)/.exec(block)?.[1];
  const deps = /dependencies:\s*(\[[^\]]*\])/.exec(block)?.[1];
  const intDeps = /internalDeps:\s*(\[[^\]]*\])/.exec(block)?.[1];
  if (name) meta.name = name;
  if (deps) meta.dependencies = JSON.parse(deps);
  if (intDeps) meta.internalDeps = JSON.parse(intDeps);
  return meta;
}

function main() {
  const files = fs.readdirSync(UI_ROOT).filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"));
  const entries: Entry[] = files.map((file) => {
    const full = path.join(UI_ROOT, file);
    const src = fs.readFileSync(full, "utf8");
    const meta = parseMeta(src);
    const name = meta.name ?? file.replace(/\.tsx$/, "");
    return {
      name,
      files: [`components/${name}.tsx`],
      dependencies: meta.dependencies ?? [],
      internalDeps: meta.internalDeps ?? ["utils"],
      sourceContent: src,
    };
  });
  fs.writeFileSync(OUT, JSON.stringify({ components: entries }, null, 2));
  console.log(`registry.json written with ${entries.length} components`);
}

main();
```

- [ ] **Step 2: 빌드 실행 확인**

```
pnpm --filter @sym/ui-cli registry:build
```
Expected: `packages/cli/registry.json` 생성, 8 components

- [ ] **Step 3: 커밋**

```bash
git add packages/cli/src/scripts/build-registry.ts
git commit -m "feat(cli): add registry build script"
```

---

### Task 25: `init` 명령

**Files:**
- Create: `packages/cli/src/commands/init.ts`, `src/utils/fs.ts`

- [ ] **Step 1: `utils/fs.ts`**

```ts
// packages/cli/src/utils/fs.ts
import fs from "fs-extra";
import path from "node:path";

export function findConfigFile(cwd: string, candidates: string[]): string | null {
  for (const name of candidates) {
    const p = path.join(cwd, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function ensureDir(dir: string) {
  await fs.ensureDir(dir);
}
```

- [ ] **Step 2: `commands/init.ts`**

```ts
// packages/cli/src/commands/init.ts
import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import kleur from "kleur";
import { findConfigFile, ensureDir } from "../utils/fs.js";
import { installPackages } from "../utils/runner.js";

const GLOBALS_CSS = `@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css");
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const CN_UTIL = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`;

export async function initCommand() {
  const cwd = process.cwd();
  console.log(kleur.bold("sym-ui init"));

  // 1. tailwind.config 체크
  const tw = findConfigFile(cwd, ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]);
  if (!tw) {
    console.log(kleur.red("tailwind.config 가 없습니다. Tailwind 먼저 설치해주세요."));
    process.exit(1);
  }
  const twSrc = await fs.readFile(tw, "utf8");
  if (!twSrc.includes("@sym/ui/tailwind.preset")) {
    console.log(kleur.yellow(`! 수동으로 ${path.basename(tw)} presets 배열에 require("@sym/ui/tailwind.preset") 추가 필요.`));
  }

  // 2. components/ui + lib/utils.ts 생성
  const { componentsDir } = await prompts({
    type: "text",
    name: "componentsDir",
    message: "컴포넌트를 저장할 경로?",
    initial: "src/components/ui",
  });
  const libDir = path.join(cwd, "src/lib");
  await ensureDir(path.join(cwd, componentsDir));
  await ensureDir(libDir);
  await fs.writeFile(path.join(libDir, "utils.ts"), CN_UTIL);

  // 3. globals.css 주입
  const globals = findConfigFile(cwd, [
    "src/app/globals.css", "app/globals.css",
    "src/styles/globals.css", "src/index.css",
  ]);
  if (globals) {
    const existing = await fs.readFile(globals, "utf8");
    if (!existing.includes("pretendardvariable.css")) {
      await fs.writeFile(globals, GLOBALS_CSS + "\n" + existing);
    }
  } else {
    console.log(kleur.yellow("! globals.css 를 찾지 못했습니다. 프로젝트 글로벌 CSS 상단에 다음을 수동 추가해주세요:"));
    console.log(GLOBALS_CSS);
  }

  // 4. 기본 의존성 설치
  await installPackages(["clsx", "tailwind-merge", "class-variance-authority"], cwd);

  // 5. 설정 파일 저장
  await fs.writeJson(
    path.join(cwd, "sym-ui.json"),
    { componentsDir, utilsPath: "src/lib/utils" },
    { spaces: 2 },
  );

  console.log(kleur.green("✓ sym-ui init 완료"));
}
```

- [ ] **Step 3: 빌드 + 테스트 프로젝트에서 수동 확인**

```bash
pnpm --filter @sym/ui-cli build
mkdir -p /tmp/sym-test && cd /tmp/sym-test
npm init -y
npx tailwindcss init
node /path/to/sym-ui/packages/cli/dist/index.js init
```
Expected: `src/components/ui/`, `src/lib/utils.ts`, `sym-ui.json` 생성 + clsx/tailwind-merge/cva 설치

- [ ] **Step 4: 커밋**

```bash
git add packages/cli/src/
git commit -m "feat(cli): add init command"
```

---

### Task 26: `add` 명령

**Files:**
- Create: `packages/cli/src/commands/add.ts`, `src/utils/registry.ts`

- [ ] **Step 1: `utils/registry.ts`**

```ts
// packages/cli/src/utils/registry.ts
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface RegistryEntry {
  name: string;
  files: string[];
  dependencies: string[];
  internalDeps: string[];
  sourceContent: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.resolve(here, "..", "registry.json");

export async function loadRegistry(): Promise<RegistryEntry[]> {
  const json = await fs.readJson(REGISTRY_PATH);
  return json.components as RegistryEntry[];
}
```

- [ ] **Step 2: `commands/add.ts`**

```ts
// packages/cli/src/commands/add.ts
import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import kleur from "kleur";
import { loadRegistry } from "../utils/registry.js";
import { installPackages } from "../utils/runner.js";

export async function addCommand(components: string[], opts: { yes?: boolean }) {
  const cwd = process.cwd();
  const cfgPath = path.join(cwd, "sym-ui.json");
  if (!(await fs.pathExists(cfgPath))) {
    console.log(kleur.red("sym-ui.json 이 없습니다. 먼저 `sym-ui init` 을 실행하세요."));
    process.exit(1);
  }
  const config = (await fs.readJson(cfgPath)) as { componentsDir: string };
  const registry = await loadRegistry();

  if (components.length === 0) {
    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "추가할 컴포넌트 선택",
      choices: registry.map((r) => ({ title: r.name, value: r.name })),
      min: 1,
    });
    components = selected as string[];
  }

  for (const name of components) {
    const entry = registry.find((e) => e.name === name);
    if (!entry) {
      console.log(kleur.red(`✗ ${name}: registry 에 없음`));
      continue;
    }
    const target = path.join(cwd, config.componentsDir, `${name}.tsx`);
    if ((await fs.pathExists(target)) && !opts.yes) {
      const { ok } = await prompts({
        type: "confirm",
        name: "ok",
        message: `${name}.tsx 덮어쓰기?`,
        initial: false,
      });
      if (!ok) continue;
    }
    await fs.ensureDir(path.dirname(target));
    // cn import 경로 치환: "../lib/utils" → 소비 프로젝트 기본 경로
    const content = entry.sourceContent.replace(/from "\.\.\/lib\/utils"/g, `from "@/lib/utils"`);
    await fs.writeFile(target, content);
    console.log(kleur.green(`✓ ${name} → ${path.relative(cwd, target)}`));

    if (entry.dependencies.length > 0) {
      await installPackages(entry.dependencies, cwd);
    }
  }
  console.log(kleur.bold().green("\n완료"));
}
```

- [ ] **Step 3: 빌드 + 샘플 프로젝트에서 확인**

```bash
pnpm --filter @sym/ui-cli build
cd /tmp/sym-test
node /path/to/sym-ui/packages/cli/dist/index.js add button tooltip
```
Expected: `src/components/ui/{button,tooltip}.tsx` 생성 + `@radix-ui/react-tooltip` 설치

- [ ] **Step 4: 커밋**

```bash
git add packages/cli/src/
git commit -m "feat(cli): add add command"
```

---

## Phase 7. CI / Release

### Task 27: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: `ci.yml`**

```yaml
name: CI

on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

- [ ] **Step 2: 커밋**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add github actions pipeline"
```

---

### Task 28: Changesets + Release 워크플로우

**Files:**
- Create: `.changeset/config.json`, `.github/workflows/release.yml`

- [ ] **Step 1: changesets 설치 + 초기화**

```bash
pnpm add -Dw @changesets/cli
pnpm exec changeset init
```

- [ ] **Step 2: `.changeset/config.json` 수정 (cli 만 publish)**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@sym/ui", "docs"]
}
```

- [ ] **Step 3: `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push: { branches: [main] }

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: "https://registry.npmjs.org"
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @sym/ui-cli registry:build
      - run: pnpm build
      - uses: changesets/action@v1
        with:
          publish: pnpm exec changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 4: 커밋**

```bash
git add .changeset/ .github/workflows/release.yml package.json pnpm-lock.yaml
git commit -m "ci: add changesets and release workflow"
```

---

### Task 29: GitHub Pages 문서 배포

**Files:**
- Create: `.github/workflows/deploy-docs.yml`

- [ ] **Step 1: `deploy-docs.yml`**

```yaml
name: Deploy Docs

on:
  push: { branches: [main] }

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter docs build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: apps/docs/storybook-static }
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: GitHub 저장소 Pages 활성화 (수동)**

Settings → Pages → Source: "GitHub Actions"

- [ ] **Step 3: 커밋**

```bash
git add .github/workflows/deploy-docs.yml
git commit -m "ci: deploy storybook to github pages"
```

---

## Phase 8. Documentation & Dogfooding

### Task 30: README 작성

**Files:**
- Create: `README.md`

- [ ] **Step 1: `README.md`**

````markdown
# sym-ui

개인 범용 React 디자인시스템. Tailwind + Radix 기반, shadcn/ui 스타일로 배포.

## 설치

```bash
cd my-app
npx @sym/ui-cli@latest init
npx @sym/ui-cli@latest add button input tooltip
```

## 컴포넌트 (Tier 1)

Button / Input / Label / Card / Badge / Avatar / Tooltip / Toast

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

React 18, TypeScript 5, Tailwind v3, Radix UI, CVA, Storybook 8, Vitest, Turborepo
````

- [ ] **Step 2: 커밋**

```bash
git add README.md
git commit -m "docs: add README"
```

---

### Task 31: 샘플 프로젝트에서 도그푸딩

**Files:**
- 로컬 검증 전용 (커밋 대상 아님)

- [ ] **Step 1: 샘플 Next.js 앱 생성**

```bash
cd /tmp
pnpm create next-app@latest sym-ui-sample --typescript --tailwind --eslint --app --use-pnpm
cd sym-ui-sample
```

- [ ] **Step 2: CLI 로컬 실행으로 init + add**

```bash
# 모노레포 루트에서 CLI 빌드
cd /path/to/sym-ui && pnpm --filter @sym/ui-cli build
# 샘플 프로젝트에서 실행
cd /tmp/sym-ui-sample
node /path/to/sym-ui/packages/cli/dist/index.js init
node /path/to/sym-ui/packages/cli/dist/index.js add button input
```

- [ ] **Step 3: 샘플 앱에서 실제 사용**

`app/page.tsx` 를 열어 Button, Input 을 import 해서 렌더 → `pnpm dev` → 브라우저 확인 (Pretendard/IBM Plex Mono 폰트 로드, 블루 primary 색 반영, 포커스 링 동작 확인)

- [ ] **Step 4: 발견되는 이슈는 패키지별 개별 커밋으로 반영**

예: `cn()` import 경로 치환 실수, globals.css 누락, Radix 버전 호환성 등. 수정 후 기능별 커밋 남기고 이 태스크 자체는 커밋 없음.

---

## Self-Review

### Spec coverage

| 스펙 섹션 | 대응 태스크 |
|---|---|
| 3. 기술 스택 | Task 1~4 |
| 4. 프로젝트 구조 | Task 1, 5, 19, 23 |
| 5.1 Color | Task 6 |
| 5.2 Typography | Task 7, 9 |
| 5.3 Spacing/Radius/Shadow | Task 7 |
| 6. Button | Task 11 |
| 6. Badge | Task 12 |
| 6. Input | Task 13 |
| 6. Label | Task 14 |
| 6. Card | Task 15 |
| 6. Avatar | Task 16 |
| 6. Tooltip | Task 17 |
| 6. Toast | Task 18 |
| 7. 개발 워크플로우 | Task 2, 4 |
| 8. CLI | Task 23~26 |
| 9. 문서 사이트 | Task 19~22 |
| 10. 테스트 | 각 컴포넌트 태스크의 TDD Steps |
| 11. 배포/버전 | Task 28, 29 |
| 12. 마일스톤 | Phase 1~8 |

### 플레이스홀더 스캔
- "TBD/TODO/fill in" 없음
- 각 단계에 실제 코드 또는 실행 명령 포함

### 타입 일관성
- `Button` variants: primary, secondary, outline, ghost, destructive (스펙 6절 일치)
- `Badge` variants: primary, neutral, success, warning, danger, outline (스펙 6절 일치)
- `Toast` variants: success, danger, info, warning (스펙 6절 일치)
- 패키지명 `@sym/ui`, `@sym/ui-cli` 일관
- `cn()` import 경로: 개발 시 `../lib/utils`, CLI `add` 복사 시 `@/lib/utils` 로 일괄 치환 (Task 26)

### 알려진 제약
- `registry.json` 은 빌드 산출물이라 `.gitignore` 에 포함 (Task 1) 되지만 npm 배포 시엔 `packages/cli/package.json` 의 `files` 배열에 명시되어 패키지에 포함됨. 릴리즈 워크플로우가 `registry:build` 를 `publish` 전에 실행하므로 최신 상태로 배포됨 (Task 28)
- CLI 의 `cn` import 경로 (`@/lib/utils`) 하드코딩. 다른 alias 선호 시 향후 `sym-ui.json` 에 `utilsImport` 필드 추가 필요 (열린 질문)
