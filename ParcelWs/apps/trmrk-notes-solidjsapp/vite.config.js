import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Access mode to adjust settings
  const isDev = mode === 'development';

  const envDirName = isDev ? "dev" : "prod";

  const sslCertDirPath = path.resolve(
    __dirname,
    "sslCert",
    envDirName);

  return {
    root: 'src/app/targets/any',
    plugins: [solidPlugin()],
    publicDir: ["env", envDirName, "public"].join("/"),
    build: { outDir: ["..", "..", "..", "..", "dist", envDirName].join("/") },
    server: {
      https: {
        key: fs.readFileSync(path.resolve(sslCertDirPath, 'key.pem')),
        cert: fs.readFileSync(path.resolve(sslCertDirPath, 'cert.pem'))
      }
      ,host: '0.0.0.0', // Bind to all network interfaces
      port: 9102
    }
  };
});
