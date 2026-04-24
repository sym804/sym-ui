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
