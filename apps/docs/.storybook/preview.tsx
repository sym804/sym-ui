import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/globals.css";
import { TooltipProvider } from "@sym/ui";

const preview: Preview = {
  parameters: {
    // backgrounds addon is intentionally disabled so the themed wrapper
    // (bg-background) controls the canvas background via semantic tokens.
    backgrounds: { disable: true },
    // v0.8.0: addon-a11y 의 자동 axe 실행을 manual 로 전환. CI 의 test-runner +
    // axe-playwright 와 race condition ("Axe is already running") 회피. dev 에서는
    // 사용자가 panel 의 Run 버튼으로 검사.
    a11y: { config: { rules: [] }, manual: true },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default preview;
