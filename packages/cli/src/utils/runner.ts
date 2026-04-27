// packages/cli/src/utils/runner.ts
import { spawn } from "node:child_process";

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export class InstallError extends Error {
  constructor(
    message: string,
    public readonly tool: string,
    public readonly code: number,
  ) {
    super(message);
    this.name = "InstallError";
  }
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
    child.on("error", (err) => resolve({ code: 127, stdout, stderr: stderr + String(err) }));
  });
}

/**
 * pnpm 이 있으면 pnpm, 없으면 npm 을 사용해 패키지 설치.
 * 설치 실패 시 InstallError 를 throw 한다 (이전에는 조용히 무시했음).
 */
export async function installPackages(packages: string[], cwd: string): Promise<void> {
  if (packages.length === 0) return;
  const pnpmProbe = await run("pnpm", ["--version"], cwd);
  const tool = pnpmProbe.code === 0 ? "pnpm" : "npm";
  const args = tool === "pnpm" ? ["add", ...packages] : ["install", ...packages];
  const result = await run(tool, args, cwd);
  if (result.code !== 0) {
    throw new InstallError(
      `${tool} ${args.join(" ")} 실패 (exit code ${result.code})`,
      tool,
      result.code,
    );
  }
}
