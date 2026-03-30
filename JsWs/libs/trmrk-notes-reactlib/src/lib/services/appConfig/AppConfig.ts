import { Singleton } from "@/src/trmrk/core";
import { AppConfig as AppConfigCore } from "@/src/trmrk/driveStorage/appConfig";

export interface AppConfig extends AppConfigCore {}

// 1. We define what our custom global space looks like to TypeScript
declare global {
  // This prevents TS errors when attaching custom objects to globalThis
  var __appConfigSingleton: Singleton<AppConfig> | undefined;
}

// 2. We use the existing global instance if it exists, OR create the brand new one.
// This ensures that even if Next.js reloads the file, it grabs the exact same class instance.
export const appConfig =
  globalThis.__appConfigSingleton ?? new Singleton<AppConfig>();

// 3. In development mode, save it to globalThis so it survives hot-reloads.
if (process.env.NODE_ENV !== "production") {
  globalThis.__appConfigSingleton = appConfig;
}
