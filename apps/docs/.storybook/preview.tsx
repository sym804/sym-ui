import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/globals.css";
import { TooltipProvider } from "@sym/ui";

const preview: Preview = {
  parameters: {
    // backgrounds addon is intentionally disabled so the themed wrapper
    // (bg-background) controls the canvas background via semantic tokens.
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
        <div className="min-h-screen bg-background text-foreground transition-colors p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default preview;
