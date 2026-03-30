import { Singleton } from "@/src/trmrk/core";
import { normalizeAppConfigCore } from "@/src/trmrk/app-config";
import { flatten } from "@/src/trmrk/arr";

import {
  loadAppConfigCore,
  defaultConfigFilePathFactory,
  defaultConfigNormalizer,
} from "@/src/trmrk-react/services/appConfig/loadAppConfigCore";

import { AppConfig } from "./AppConfig";

export const appConfig = new Singleton<AppConfig>();

export const loadAppConfig = async () => {
  const appConfigCore = await loadAppConfigCore<AppConfig>(
    (env) => [
      defaultConfigFilePathFactory(""),
      defaultConfigFilePathFactory(env),
    ],
    (configsArr) => {
      let appConfig = defaultConfigNormalizer(configsArr);

      appConfig.driveStorageOptions = flatten(
        configsArr.map((c) => c.driveStorageOptions ?? []),
      );

      appConfig = normalizeAppConfigCore(appConfig);
      appConfig.appName ??= "trmrk-notes-reactapp";
      appConfig.dbObjAppName ??= appConfig.appName;
      return appConfig;
    },
  );

  appConfig.register(appConfigCore);
  return appConfigCore;
};
