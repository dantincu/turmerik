export interface AppConfigCore {
  isProdEnv: boolean;
  isWebApp: boolean;
  appName: string;
  routeBasePath: string;
  requiresSetup: boolean;
  maxSimultaneousRequestsCount: number;
  cacheValidIntervalMillis: number;
  listDefaultPageSize: number;
}
