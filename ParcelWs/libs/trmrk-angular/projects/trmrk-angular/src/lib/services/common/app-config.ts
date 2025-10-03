export interface AppConfigCore {
  isProdEnv: boolean;
  isWebApp: boolean;
  routeBasePath: string;
  requiresSetup: boolean;
  maxSimultaneousRequestsCount: number;
  cacheValidIntervalMillis: number;
  listDefaultPageSize: number;
}
