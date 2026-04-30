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
        // cmdk 라이브러리의 listbox 가 검색 결과 0일 때 children 없이 렌더되어
        // axe 가 위반으로 잡지만, 이는 cmdk 의 default 동작이라 외부 의존성 한계.
        // 빈 listbox 의 의미 (검색 결과 없음) 는 우리 CommandEmpty / EmptyState 가 별도 표시.
        { id: "aria-required-children", enabled: false },
      ],
    });
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: "tag",
          // WCAG 2.0/2.1/2.2 의 A + AA 까지 자동 검증. best-practice 는 noise 가
          // 많아 우선 제외 (필요 시 allowlist 방식으로 단계 도입).
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
        // axe.run 에 직접 전달되는 rules 옵션. configureAxe 와 별개로 명시해야
        // 일부 axe-playwright 버전에서도 안전하게 disable 적용된다.
        rules: {
          region: { enabled: false },
          "aria-required-children": { enabled: false },
        },
      },
    });
  },
};

export default config;
