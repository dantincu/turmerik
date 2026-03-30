// src/lib/getConfig.ts
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react"; // 1. Import React's cache

import { NullOrUndef } from "@/src/trmrk/core";
import { mergeShallow } from "@/src/trmrk/obj";

export const defaultConfigFilePathFactory = (env: string) =>
  path.join(
    process.cwd(),
    "src",
    "config",
    "env",
    "app-config" + (env.length > 0 ? `.${env}` : "") + ".json",
  );

export const defaultConfigNormalizer = <TAppConfig extends Object>(
  configsArr: TAppConfig[],
) => {
  return mergeShallow({} as TAppConfig, configsArr);
};

// 2. Wrap the function in cache()
export const loadAppConfigCore = cache(
  async <TAppConfig extends Object>(
    configFilePathFactory?: (env: string) => string | string[],
    configNormalizer?: ((configsArr: TAppConfig[]) => TAppConfig) | NullOrUndef,
  ) => {
    configFilePathFactory ??= defaultConfigFilePathFactory;
    configNormalizer ??= defaultConfigNormalizer;
    const env = process.env.APP_ENV ?? "dev";
    let filePath = configFilePathFactory(env);

    if ("string" === typeof filePath) {
      filePath = [filePath];
    }

    console.log("Reading config file(s) from disk..."); // This will only log ONCE per request!

    const configsArr = (await Promise.all(
      filePath.map((fp) =>
        fs
          .readFile(fp, "utf8")
          .then(JSON.parse)
          .catch((error) => {
            console.error(`Failed to read config file at ${fp}`, error);
            return null;
          }),
      ),
    )) as TAppConfig[];

    const appConfig = configNormalizer(configsArr);
    return appConfig;
  },
);
