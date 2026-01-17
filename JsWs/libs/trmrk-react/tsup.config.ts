import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Support both CommonJS and ES Modules
  dts: true, // Generate declaration files (.d.ts)
  minify: true,
  clean: true,
  external: ["react", "next"], // Don't bundle React or Next.js
});
