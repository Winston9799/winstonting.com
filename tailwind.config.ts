import type { Config } from "tailwindcss";

// App Router project — no src/pages directory, so only components/ and app/
// need to be scanned for class names.
const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // CJK-capable stack: Lato for Latin glyphs, Noto Sans SC fills
        // in the Chinese characters (see src/app/layout.tsx for font loading).
        sans: ['var(--font-lato)', 'var(--font-noto-sans-sc)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // "Obsidian & Gilded Journey" dark/gold palette — see /design.md.
        // Only the shades actually referenced in components are defined here.
        gold: {
          300: "#f7d088",
          400: "#f5c065",
          500: "#e5a93c",
        },
        midnight: "#0a0b0e",
        deepslate: "#121318",
        surface: "#181920",
      },
    },
  },
  plugins: [],
};

export default config;
