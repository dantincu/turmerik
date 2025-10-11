export interface AppConfigCore {
  isProdEnv: boolean;
  isWebApp: boolean;
  appName: string;
  routeBasePath: string;
  requiresSetup: boolean;
  maxSimultaneousRequestsCount: number;
  cacheValidIntervalMillis: number;
  inactiveDataCleanupIntervalMillis: number;
  storageCleanupIntervalRatio: number;
  listDefaultPageSize: number;
}

export const normalizeAppConfigCore = <TConfig extends AppConfigCore = AppConfigCore>(
  appConfig: TConfig
) => {
  appConfig.isWebApp ??= true;
  appConfig.routeBasePath ??= '/app';
  appConfig.requiresSetup ??= false;
  appConfig.listDefaultPageSize ??= 50;
  appConfig.maxSimultaneousRequestsCount ??= 4;
  appConfig.cacheValidIntervalMillis ??= 24 * 3600 * 1000;
  appConfig.inactiveDataCleanupIntervalMillis ??= 30 * 24 * 3600 * 1000;
  appConfig.storageCleanupIntervalRatio ??= 0.1;
  return appConfig;
};
