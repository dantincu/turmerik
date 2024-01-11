import { createTheme, Theme } from "@mui/material/styles";

import { MtblRefValue } from "trmrk/src/core";

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

const createAppTheme = (mode: "light" | "dark") => {
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

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

export const appThemesMap = {
  light: createAppTheme("light"),
  dark: createAppTheme("dark"),
};

export const getAppTheme = (mode: AppThemeMode) =>
  appThemesMap[mode.isDarkMode ? "dark" : "light"];

export const currentAppTheme = {
  value: null,
} as any as MtblRefValue<AppTheme>;
