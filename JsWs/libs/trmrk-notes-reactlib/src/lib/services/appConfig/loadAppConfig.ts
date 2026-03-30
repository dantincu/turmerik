import { Singleton } from "@/src/trmrk/core";
import { normalizeAppConfigCore } from "@/src/trmrk/app-config";
import { flatten } from "@/src/trmrk/arr";

import {
  loadAppConfigCore,
  defaultConfigFilePathFactory,
  defaultConfigNormalizer,
} from "@/src/trmrk-react/services/appConfig/loadAppConfigCore";

import { AppConfig, appConfig } from "./AppConfig";

export const loadAppConfig = async () => {
  const appConfigObj = await loadAppConfigCore<AppConfig>(
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

      if (appConfig.dbObjAppName === "") {
        appConfig.dbObjAppName = appConfig.appName;
      }

      return appConfig;
    },
  );

  try {
    appConfig.register(appConfigObj);
  } catch (err) {}

  return appConfigObj;
};
