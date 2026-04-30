/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          elevated: "hsl(var(--surface-elevated) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        overlay: "hsl(var(--overlay) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          50: "#eff6ff",  100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
          800: "#1e40af", 900: "#1e3a8a", 950: "#172554",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        neutral: {
          50: "#fafaf9",  100: "#f5f4f2", 200: "#e7e5e1", 300: "#d3d0ca",
          400: "#a8a49c", 500: "#78746c", 600: "#57544e", 700: "#433f3b",
          800: "#2a2724", 900: "#1a1815", 950: "#0f0e0c",
        },
        success: "#12b76a",
        warning: "#f2a900",
        danger: "#f04438",
        info: "#3d7eff",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "4px", DEFAULT: "8px", md: "12px", lg: "16px", xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
        DEFAULT: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
        md: "0 4px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
        lg: "0 12px 24px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06)",
        xl: "0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)",
      },
      transitionDuration: {
        instant: "0ms",
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0, 0, 0.2, 1)",
        accelerate: "cubic-bezier(0.4, 0, 1, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
