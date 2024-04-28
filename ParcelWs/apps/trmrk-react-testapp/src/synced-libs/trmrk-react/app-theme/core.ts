import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";

import { MtblRefValue } from "../../synced-libs/trmrk/core";

export interface AppThemeMode {
  isDarkMode: boolean;
}

export interface AppThemeMainColors {
  txtPrimaryColor: string;
  txtSecondaryColor: string;
  txtDisabledColor: string;
  dfBgColor: string;
  dfPrimaryColor: string;
  dfSecondaryColor: string;
  dfErrorColor: string;
  dfWarningColor: string;
  dfInfoColor: string;
  dfSuccessColor: string;
}

export interface AppThemeColors {
  main: AppThemeMainColors;
}

export interface AppTheme {
  theme: Theme;
  cssClassName: string;
  isDark: boolean;
  colors: AppThemeColors;
}

export const createAppTheme = (opts: ThemeOptions) => {
  const theme = createTheme(opts);
  const mode = opts.palette!.mode;

  const isDarkMode = mode === "dark";
  const palette = theme.palette;

  const appTheme = {
    theme: theme,
    cssClassName: ["trmrk-theme", mode].join("-"),
    isDark: isDarkMode,
    colors: {
      main: {
        txtPrimaryColor: palette.text.primary,
        txtSecondaryColor: palette.text.secondary,
        txtDisabledColor: palette.text.disabled,
        dfBgColor: palette.background.default,
        dfPrimaryColor: palette.primary.main,
        dfSecondaryColor: palette.secondary.main,
        dfErrorColor: palette.error.main,
        dfWarningColor: palette.warning.main,
        dfInfoColor: palette.info.main,
        dfSuccessColor: palette.success.main,
      },
    },
  } as AppTheme;

  if (isDarkMode) {
  } else {
  }

  return appTheme;
};

export const createAppThemesMap = (
  lightThemeOpts: ThemeOptions,
  darkThemeOpts: ThemeOptions
) => {
  lightThemeOpts.palette ??= {};
  lightThemeOpts.palette.mode = "light";

  darkThemeOpts.palette ??= {};
  darkThemeOpts.palette.mode = "dark";

  appThemesMap.value.light = createAppTheme(lightThemeOpts);
  appThemesMap.value.dark = createAppTheme(darkThemeOpts);
};

export interface IAppThemesMap {
  light: AppTheme;
  dark: AppTheme;
}

export const appThemesMap = {
  value: {},
} as MtblRefValue<IAppThemesMap>;

export const getAppTheme = (mode: AppThemeMode) =>
  mode.isDarkMode ? appThemesMap.value.dark : appThemesMap.value.light;

export const currentAppTheme = {
  value: null,
} as any as MtblRefValue<AppTheme>;
