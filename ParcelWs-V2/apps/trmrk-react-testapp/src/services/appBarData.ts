export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  appearenceMenuOpts: AppearenceMenuOpts;
}

export interface AppBarData {
  appSettingsMenuOpts: AppSettingsMenuOpts;
}
