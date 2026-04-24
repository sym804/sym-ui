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
