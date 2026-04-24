import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/globals.css";
import { TooltipProvider } from "@sym/ui";

const preview: Preview = {
  parameters: {
    // backgrounds addon is intentionally disabled so the themed wrapper
    // (bg-white / dark:bg-neutral-950) controls the canvas background.
    backgrounds: { disable: true },
    a11y: { config: { rules: [] } },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <TooltipProvider>
        <div className="min-h-screen bg-white text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-200 p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default preview;
