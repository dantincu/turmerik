// tailwind.config.ts
import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: "selector", // or 'class' for Tailwind v3
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["border-[1px]", "border-[2px]"],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
