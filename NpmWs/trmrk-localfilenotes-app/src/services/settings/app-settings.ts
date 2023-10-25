export interface AppSettingsData {
  trmrkPfx: string;
}

export interface AppSettings {
  loaded: boolean;
  data: AppSettingsData;
}
