/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@sym/ui/tailwind.preset")],
  content: [
    "./stories/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
