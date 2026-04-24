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
