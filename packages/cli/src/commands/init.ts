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

// 토큰 변수가 실제로 정의되어 있는지 (주석이나 --background-color 같은 다른 이름이 아닌)
// 검사하는 정규식. CSS custom property 선언은 `;` 또는 `{` 뒤에 오거나 라인 시작.
const TOKEN_BG_RE = /(^|[;{]\s*)--background\s*:/m;
const TOKEN_PRIMARY_RE = /(^|[;{]\s*)--primary\s*:/m;

interface PresetPatchResult {
  reason:
    | "already-present"
    | "patched-array"
    | "patched-object"
    | "manual-needed"
    | "manual-needed-esm-js"
    | "manual-needed-multiple-presets";
}

async function detectPackageType(cwd: string): Promise<"module" | "commonjs"> {
  try {
    const pkg = await fs.readJson(path.join(cwd, "package.json"));
    return pkg?.type === "module" ? "module" : "commonjs";
  } catch {
    return "commonjs";
  }
}

async function patchTailwindPreset(
  twPath: string,
  pkgType: "module" | "commonjs",
): Promise<PresetPatchResult> {
  const src = await fs.readFile(twPath, "utf8");
  if (src.includes("@sym/ui/tailwind.preset")) {
    return { reason: "already-present" };
  }
  const ext = path.extname(twPath);

  // .js 가 ESM 패키지면 require 삽입은 위험 → 수동 안내
  if (ext === ".js" && pkgType === "module") {
    return { reason: "manual-needed-esm-js" };
  }
  const isCjsLike = ext === ".cjs" || (ext === ".js" && pkgType === "commonjs");

  // 다중 presets 발견 시 잘못된 위치를 패치할 수 있어 수동 안내로 폴백
  const allPresetMatches = src.match(/presets\s*:\s*\[/g);
  if (allPresetMatches && allPresetMatches.length > 1) {
    return { reason: "manual-needed-multiple-presets" };
  }

  // Strategy 1: 단일 presets 배열에 삽입 (cjs/js-as-cjs 한정)
  const arrRe = /presets\s*:\s*\[([\s\S]*?)\]/;
  const arrMatch = src.match(arrRe);
  if (arrMatch && isCjsLike) {
    const inner = (arrMatch[1] ?? "").trim();
    const newInner = inner ? `${PRESET_REQUIRE}, ${inner}` : PRESET_REQUIRE;
    const replaced = src.replace(arrRe, `presets: [${newInner}]`);
    await fs.writeFile(twPath, replaced);
    return { reason: "patched-array" };
  }

  // Strategy 2: cjs/js-as-cjs 의 module.exports = { 직후에 presets 삽입
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

  return { reason: "manual-needed" };
}

function extractTokenLayer(globalsCss: string): string | null {
  // `@layer base { :root {...} .dark {...} html { ... } body { ... } code,kbd,... { ... } }`
  // 형태에서 base layer 블록만 추출. 단순 균형 매처.
  const layerStart = globalsCss.indexOf("@layer base {");
  if (layerStart === -1) return null;
  let depth = 0;
  let i = layerStart;
  while (i < globalsCss.length) {
    const ch = globalsCss[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return globalsCss.slice(layerStart, i + 1);
      }
    }
    i++;
  }
  return null;
}

export async function initCommand() {
  const cwd = process.cwd();
  console.log(kleur.bold("sym-ui init"));

  const registry = await loadRegistry();
  const pkgType = await detectPackageType(cwd);

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
  const presetResult = await patchTailwindPreset(tw, pkgType);
  switch (presetResult.reason) {
    case "already-present":
      console.log(kleur.gray(`· ${path.basename(tw)} 에 이미 @sym/ui preset 적용됨`));
      break;
    case "patched-array":
    case "patched-object":
      console.log(kleur.green(`✓ ${path.basename(tw)} 에 @sym/ui preset 자동 적용`));
      break;
    case "manual-needed-esm-js":
      console.log(
        kleur.yellow(
          `! ${path.basename(tw)} 가 ESM (package.json type:module) 모드라 require() 자동 삽입을 보류합니다. 수동 추가:\n${PRESET_MANUAL_HINT}`,
        ),
      );
      break;
    case "manual-needed-multiple-presets":
      console.log(
        kleur.yellow(
          `! ${path.basename(tw)} 에서 'presets:' 배열이 여러 군데 발견되어 자동 패치를 보류합니다 (오삽입 위험). 수동 추가:\n${PRESET_MANUAL_HINT}`,
        ),
      );
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
    const hasTokens = TOKEN_BG_RE.test(existing) && TOKEN_PRIMARY_RE.test(existing);
    if (hasTokens) {
      console.log(kleur.gray(`· ${path.relative(cwd, globals)} 에 토큰이 이미 존재 (스킵)`));
    } else {
      // 기존에 @tailwind 지시문이 있으면 토큰 layer 만 주입 (지시문 중복 회피)
      const hasTailwindDirective = /@tailwind\s+(base|components|utilities)/i.test(existing);
      const tokenLayer = extractTokenLayer(registry.globalsCss);
      const cssToInject = hasTailwindDirective && tokenLayer ? tokenLayer + "\n" : registry.globalsCss;
      await fs.writeFile(globals, `${cssToInject}\n${existing}`);
      const what = hasTailwindDirective && tokenLayer
        ? "토큰 layer 만"
        : "tailwind 지시문 + 토큰";
      console.log(kleur.green(`✓ ${path.relative(cwd, globals)} 에 sym-ui ${what} 주입`));
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
