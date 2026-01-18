// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector", // or 'class' for Tailwind v3
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
