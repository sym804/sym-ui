// apps/docs/playwright.config.ts
// 시각 회귀 (screenshot smoke) 게이트. storybook-static 을 http-server 로 띄운 채로
// 핵심 stories 의 스크린샷을 베이스라인과 비교한다.
//
// 베이스라인 OS 의존성:
//   font rendering 차이로 Windows / macOS / Ubuntu 베이스라인이 픽셀 단위로 다를 수
//   있다. 베이스라인은 CI 환경 (ubuntu-latest) 에서 생성하는 것을 표준으로 한다.
//   로컬에서 새 baseline 을 만들려면 docker 사용 권장:
//     docker run --rm -v %CD%:/work -w /work mcr.microsoft.com/playwright:v1.59.1-jammy \
//       pnpm --filter docs visual:update
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  outputDir: "./test-results/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      // 미세한 폰트 anti-aliasing 차이는 무시 (1% threshold)
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: "pnpm exec http-server ./storybook-static -p 6006 -s",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
