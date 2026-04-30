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
const UI_TEMPLATES = path.resolve(process.cwd(), "../ui/templates");
const OUT = path.resolve(process.cwd(), "registry.json");

function parseMeta(src: string) {
  const match = src.match(/@registry-meta([\s\S]*?)\*\//);
  const meta: { name?: string; dependencies?: string[]; internalDeps?: string[] } = {};
  if (!match) return meta;
  const block = match[1];
  if (!block) return meta;
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
  const globalsCss = fs.readFileSync(path.join(UI_TEMPLATES, "globals.css"), "utf8");
  fs.writeFileSync(
    OUT,
    JSON.stringify({ components: entries, globalsCss }, null, 2),
  );
  console.log(`registry.json written with ${entries.length} components + globals.css`);
}

main();
