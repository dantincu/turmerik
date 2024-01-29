export interface AppData {
  baseLocation: string;
  showAppBar: boolean;
  showAppBarToggleBtn: boolean;
  isDarkMode: boolean;
  isCompactMode: boolean;
}

export interface AppSettingsMenuOpts<
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts
> {
  isOpen: boolean;
  appearenceMenuOpts: TAppearenceMenuOpts;
}

export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppBarData<
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>
> {
  appSettingsMenuOpts: TAppSettingsMenuOpts;
}
