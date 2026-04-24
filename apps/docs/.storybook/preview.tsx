import type { Preview } from "@storybook/react";
import "../src/globals.css";
import { TooltipProvider } from "@sym/ui";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0f0e0c" },
      ],
    },
    a11y: { config: { rules: [] } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default preview;
