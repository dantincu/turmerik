export interface AppConfigData {
  trmrkPfx: string;
  isDevEnv: string;
  requiredClientVersion: string;
}

export interface AppConfig {
  loaded: boolean;
  data: AppConfigData;
}
