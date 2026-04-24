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
