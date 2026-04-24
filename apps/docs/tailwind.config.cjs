/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@sym/ui/tailwind.preset")],
  content: [
    "./.storybook/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  safelist: ["dark"],
};
