// packages/cli/src/commands/add.ts
import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import kleur from "kleur";
import { loadRegistry, type RegistryEntry } from "../utils/registry.js";
import { installPackages, InstallError } from "../utils/runner.js";

const SKIP_INTERNAL_DEPS = new Set(["utils"]);

/**
 * 요청한 컴포넌트 이름들의 internalDeps 그래프를 DFS post-order 로 펼쳐 ordered list 반환.
 * dep-first 순서라 부모보다 자식이 먼저 ordered 에 들어가 설치 순서가 안전하다.
 * registry 에 없는 이름은 missing 으로 모인다 (호출 측에서 abort 결정).
 */
export function resolveDependencyClosure(
  requested: string[],
  byName: Map<string, RegistryEntry>,
): { ordered: RegistryEntry[]; missing: string[] } {
  const seen = new Set<string>();
  const ordered: RegistryEntry[] = [];
  const missing = new Set<string>();
  function visit(name: string) {
    if (SKIP_INTERNAL_DEPS.has(name)) return;
    if (seen.has(name)) return;
    seen.add(name);
    const entry = byName.get(name);
    if (!entry) {
      missing.add(name);
      return;
    }
    for (const dep of entry.internalDeps ?? []) visit(dep);
    ordered.push(entry);
  }
  for (const name of requested) visit(name);
  return { ordered, missing: Array.from(missing) };
}

export async function addCommand(components: string[], opts: { yes?: boolean }) {
  const cwd = process.cwd();
  const cfgPath = path.join(cwd, "sym-ui.json");
  if (!(await fs.pathExists(cfgPath))) {
    console.log(kleur.red("sym-ui.json 이 없습니다. 먼저 `sym-ui init` 을 실행하세요."));
    process.exit(1);
  }
  const config = (await fs.readJson(cfgPath)) as { componentsDir: string };
  const { components: entries } = await loadRegistry();
  const byName = new Map(entries.map((e) => [e.name, e]));

  if (components.length === 0) {
    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "추가할 컴포넌트 선택",
      choices: entries.map((r) => ({ title: r.name, value: r.name })),
      min: 1,
    });
    if (!Array.isArray(selected) || selected.length === 0) {
      console.log(kleur.yellow("취소되었습니다."));
      return;
    }
    components = selected as string[];
  }

  const { ordered, missing } = resolveDependencyClosure(components, byName);
  if (missing.length > 0) {
    for (const m of missing) {
      console.log(kleur.red(`✗ ${m}: registry 에 없음`));
    }
    console.log(kleur.red("의존 컴포넌트 누락으로 설치를 중단합니다 (registry 동기화 또는 컴포넌트 이름을 확인하세요)."));
    process.exit(1);
  }
  if (ordered.length === 0) {
    console.log(kleur.yellow("설치할 컴포넌트가 없습니다."));
    return;
  }

  const requestedSet = new Set(components);
  const allNpmDeps = new Set<string>();

  for (const entry of ordered) {
    const target = path.join(cwd, config.componentsDir, `${entry.name}.tsx`);
    const isExtra = !requestedSet.has(entry.name);
    if ((await fs.pathExists(target)) && !opts.yes) {
      const { ok } = await prompts({
        type: "confirm",
        name: "ok",
        message: `${entry.name}.tsx 덮어쓰기?${isExtra ? " (의존 컴포넌트)" : ""}`,
        initial: false,
      });
      if (!ok) {
        console.log(kleur.gray(`· ${entry.name} 건너뜀`));
        continue;
      }
    }
    await fs.ensureDir(path.dirname(target));
    const content = entry.sourceContent.replace(
      /from "\.\.\/lib\/utils"/g,
      `from "@/lib/utils"`,
    );
    await fs.writeFile(target, content);
    const tag = isExtra ? kleur.cyan(`+ ${entry.name} (의존)`) : kleur.green(`✓ ${entry.name}`);
    console.log(`${tag} → ${path.relative(cwd, target)}`);
    for (const d of entry.dependencies) allNpmDeps.add(d);
  }

  if (allNpmDeps.size > 0) {
    try {
      await installPackages(Array.from(allNpmDeps), cwd);
    } catch (err) {
      if (err instanceof InstallError) {
        console.log(kleur.red(`✗ 의존성 설치 실패: ${err.message}`));
        process.exit(err.code === 0 ? 1 : err.code);
      }
      throw err;
    }
  }
  console.log(kleur.bold().green("\n완료"));
}
