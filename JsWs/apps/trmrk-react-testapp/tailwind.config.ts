// tailwind.config.ts
import type { Config } from "tailwindcss";

import { tailwindClassesCore } from "./src/tailwind-classes-core.ts";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: "selector", // or 'class' for Tailwind v3
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // This covers everything inside src
  ],
  safelist: tailwindClassesCore,
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
