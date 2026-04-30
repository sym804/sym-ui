// packages/cli/src/commands/init.ts
import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import kleur from "kleur";
import { findConfigFile, ensureDir } from "../utils/fs.js";
import { installPackages, InstallError } from "../utils/runner.js";
import { loadRegistry } from "../utils/registry.js";

const CN_UTIL = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`;

const PRESET_REQUIRE = `require("@sym/ui/tailwind.preset")`;
const PRESET_MANUAL_HINT = [
  `// CommonJS:`,
  `// presets: [require("@sym/ui/tailwind.preset")],`,
  `//`,
  `// ESM/TS:`,
  `// import preset from "@sym/ui/tailwind.preset";`,
  `// export default { presets: [preset], ... }`,
].join("\n");

interface PresetPatchResult {
  reason: "already-present" | "patched-array" | "patched-object" | "manual-needed";
}

async function patchTailwindPreset(twPath: string): Promise<PresetPatchResult> {
  const src = await fs.readFile(twPath, "utf8");
  if (src.includes("@sym/ui/tailwind.preset")) {
    return { reason: "already-present" };
  }
  const ext = path.extname(twPath);
  const isCjsLike = ext === ".cjs" || ext === ".js";

  // Strategy 1: 기존 presets 배열에 삽입
  const arrRe = /presets\s*:\s*\[([\s\S]*?)\]/;
  const arrMatch = src.match(arrRe);
  if (arrMatch && isCjsLike) {
    const inner = (arrMatch[1] ?? "").trim();
    const newInner = inner ? `${PRESET_REQUIRE}, ${inner}` : PRESET_REQUIRE;
    const replaced = src.replace(arrRe, `presets: [${newInner}]`);
    await fs.writeFile(twPath, replaced);
    return { reason: "patched-array" };
  }

  // Strategy 2: cjs/js module.exports = { 직후에 presets 삽입
  if (isCjsLike) {
    const objRe = /(module\.exports\s*=\s*\{)/;
    const objMatch = src.match(objRe);
    if (objMatch) {
      const replaced = src.replace(
        objRe,
        `${objMatch[0]}\n  presets: [${PRESET_REQUIRE}],`,
      );
      await fs.writeFile(twPath, replaced);
      return { reason: "patched-object" };
    }
  }

  // ts/mjs 또는 패치 실패: 수동 안내
  return { reason: "manual-needed" };
}

export async function initCommand() {
  const cwd = process.cwd();
  console.log(kleur.bold("sym-ui init"));

  const registry = await loadRegistry();

  // 1. tailwind.config 체크 + 자동 패치
  const tw = findConfigFile(cwd, [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ]);
  if (!tw) {
    console.log(kleur.red("tailwind.config 가 없습니다. Tailwind 먼저 설치해주세요."));
    process.exit(1);
  }
  const presetResult = await patchTailwindPreset(tw);
  switch (presetResult.reason) {
    case "already-present":
      console.log(kleur.gray(`· ${path.basename(tw)} 에 이미 @sym/ui preset 적용됨`));
      break;
    case "patched-array":
    case "patched-object":
      console.log(kleur.green(`✓ ${path.basename(tw)} 에 @sym/ui preset 자동 적용`));
      break;
    case "manual-needed":
      console.log(
        kleur.yellow(
          `! ${path.basename(tw)} 자동 패치 실패. presets 배열에 다음을 수동 추가해주세요:\n${PRESET_MANUAL_HINT}`,
        ),
      );
      break;
  }

  // 2. components/ui + lib/utils.ts 생성
  const { componentsDir } = await prompts({
    type: "text",
    name: "componentsDir",
    message: "컴포넌트를 저장할 경로?",
    initial: "src/components/ui",
  });
  if (typeof componentsDir !== "string" || componentsDir.trim() === "") {
    console.log(kleur.yellow("취소되었습니다."));
    return;
  }
  const safeComponentsDir = componentsDir.trim();
  const libDir = path.join(cwd, "src/lib");
  await ensureDir(path.join(cwd, safeComponentsDir));
  await ensureDir(libDir);
  await fs.writeFile(path.join(libDir, "utils.ts"), CN_UTIL);

  // 3. globals.css 주입 (토큰 변수 + tailwind 지시문 포함)
  const globals = findConfigFile(cwd, [
    "src/app/globals.css", "app/globals.css",
    "src/styles/globals.css", "src/index.css",
  ]);
  if (globals) {
    const existing = await fs.readFile(globals, "utf8");
    const hasTokens = existing.includes("--background") && existing.includes("--primary");
    if (!hasTokens) {
      await fs.writeFile(globals, `${registry.globalsCss}\n${existing}`);
      console.log(kleur.green(`✓ ${path.relative(cwd, globals)} 에 sym-ui 토큰 + tailwind 지시문 주입`));
    } else {
      console.log(kleur.gray(`· ${path.relative(cwd, globals)} 에 토큰이 이미 존재 (스킵)`));
    }
  } else {
    console.log(kleur.yellow("! globals.css 를 찾지 못했습니다. 프로젝트 글로벌 CSS 상단에 다음을 수동 추가해주세요:"));
    console.log(registry.globalsCss);
  }

  // 4. 기본 의존성 설치
  try {
    await installPackages(["clsx", "tailwind-merge", "class-variance-authority"], cwd);
  } catch (err) {
    if (err instanceof InstallError) {
      console.log(kleur.red(`✗ 기본 의존성 설치 실패: ${err.message}`));
      process.exit(err.code === 0 ? 1 : err.code);
    }
    throw err;
  }

  // 5. 설정 파일 저장
  await fs.writeJson(
    path.join(cwd, "sym-ui.json"),
    { componentsDir: safeComponentsDir, utilsPath: "src/lib/utils" },
    { spaces: 2 },
  );

  console.log(kleur.green("✓ sym-ui init 완료"));
}
