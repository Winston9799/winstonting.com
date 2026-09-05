import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-noto-serif-sc)', 'Georgia', 'serif'],
        sans: ['var(--font-open-sans)', 'var(--font-noto-sans-sc)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: "#1a1a1a",
        paper: "#faf9f7",
        gold: {
          DEFAULT: "#d4a017",
          300: "#f7d088",
          400: "#f5c065",
          500: "#e5a93c",
          600: "#d49a37",
        },
        muted: "#888",
        border: "#e8e5e0",
        midnight: "#0a0b0e",
        deepslate: "#121318",
        surface: "#181920",
        surfaceHover: "#20222a",
      },
    },
  },
  plugins: [],
};

export default config;
