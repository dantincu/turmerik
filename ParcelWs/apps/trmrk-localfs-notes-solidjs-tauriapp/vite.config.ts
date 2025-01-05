import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
  // Access mode to adjust settings
  const isDev = mode === "development";

  const envDirName = isDev ? "dev" : "prod";

  const sslCertDirPath = path.resolve(__dirname, "sslCert", envDirName);

  return {
    root: "src/app/targets/any",
    plugins: [solidPlugin()],
    resolve: {
      alias: {
        bootstrap: path.resolve(__dirname, "node_modules/bootstrap"),
        "bootstrap-icons": path.resolve(
          __dirname,
          "node_modules/bootstrap-icons"
        ),
      },
    },
    css: {
      modules: {
        // Automatically enable CSS modules for files ending in .module.css
        scopeBehaviour: "local", // Default is local, you can specify 'global' here too
        globalModulePaths: [/styles\/global\//], // Define a pattern for global CSS files
      },
      preprocessorOptions: {
        scss: {
          includePaths: [
            path.resolve(__dirname, "src/trmrk-solidjs/styles/global"), // Add paths to your external SCSS files
          ],
        },
      },
    },
    publicDir: ["env", envDirName, "public"].join("/"),
    build: {
      target: "esnext",
      outDir: ["..", "..", "..", "..", "dist", envDirName].join("/"),
    },
    server: {
      /* https: {
        key: fs.readFileSync(path.resolve(sslCertDirPath, "key.pem")),
        cert: fs.readFileSync(path.resolve(sslCertDirPath, "cert.pem")),
      }, */
      host: "0.0.0.0",
      port: 9102,
      strictPort: true,
      cors: true,
    },
  };
});
