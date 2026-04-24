export const fontFamily = {
  sans: [
    "Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont",
    "system-ui", "Roboto", "sans-serif",
  ],
  mono: ["IBM Plex Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
} as const;

export const fontSize = {
  caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.4px", fontWeight: "600" }],
  small: ["14px", { lineHeight: "1.5" }],
  body: ["16px", { lineHeight: "1.5" }],
  h3: ["18px", { lineHeight: "1.35", fontWeight: "600" }],
  h2: ["22px", { lineHeight: "1.25", fontWeight: "700" }],
  h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
  display: ["36px", { lineHeight: "1.15", fontWeight: "800" }],
} as const;
