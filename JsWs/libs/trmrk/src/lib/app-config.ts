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
  blobChunkDefaultSize: number;
  listChunkDefaultSize: number;
}

export const normalizeAppConfigCore = <TConfig extends AppConfigCore = AppConfigCore>(
  appConfig: TConfig
) => {
  appConfig.isWebApp ??= true;
  appConfig.routeBasePath ??= '/app';
  appConfig.requiresSetup ??= false;
  appConfig.maxSimultaneousRequestsCount ??= 4;
  appConfig.cacheValidIntervalMillis ??= 24 * 3600 * 1000;
  appConfig.inactiveDataCleanupIntervalMillis ??= 30 * 24 * 3600 * 1000;
  appConfig.storageCleanupIntervalRatio ??= 0.1;
  appConfig.blobChunkDefaultSize ??= 1024 * 1024;
  appConfig.listChunkDefaultSize ??= 25;
  return appConfig;
};
