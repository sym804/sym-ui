// apps/docs/.storybook/test-runner.ts
// Storybook test-runner 가 각 story 를 헤드리스 브라우저에서 렌더링한 뒤 axe-core 를
// 주입해 접근성(WCAG) 위반을 감지한다. CI 에서 storybook-static 을 띄운 채로 실행.
import type { TestRunnerConfig } from "@storybook/test-runner";
import { injectAxe, checkA11y, configureAxe } from "axe-playwright";

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await configureAxe(page, {
      rules: [
        // landmark 등 stories 단위에서는 의미 없는 룰은 비활성
        { id: "region", enabled: false },
      ],
    });
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
    });
  },
};

export default config;
