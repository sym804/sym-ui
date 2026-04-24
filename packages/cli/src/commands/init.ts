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
