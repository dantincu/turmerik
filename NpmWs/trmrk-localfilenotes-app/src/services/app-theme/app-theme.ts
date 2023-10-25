import { createTheme, Theme } from "@mui/material/styles";

export interface AppThemeMode {
  isDarkMode: boolean;
}

export interface AppTheme {
  theme: Theme;
  isDark: boolean;
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

const createAppTheme = (mode: "light" | "dark") => {
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const appTheme = {
    theme: theme,
    isDark: mode === "dark",
  } as AppTheme;

  appTheme.txtPrimaryColor = theme.palette.text.primary;
  appTheme.txtSecondaryColor = theme.palette.text.secondary;
  appTheme.txtDisabledColor = theme.palette.text.disabled;

  appTheme.dfBgColor = theme.palette.background.default;

  appTheme.dfPrimaryColor = theme.palette.primary.main;
  appTheme.dfSecondaryColor = theme.palette.secondary.main;
  appTheme.dfErrorColor = theme.palette.error.main;
  appTheme.dfWarningColor = theme.palette.warning.main;
  appTheme.dfInfoColor = theme.palette.info.main;
  appTheme.dfSuccessColor = theme.palette.success.main;

  return appTheme;
};

export const appThemesMap = {
  light: createAppTheme("light"),
  dark: createAppTheme("dark"),
};

export const getAppTheme = (mode: AppThemeMode) =>
  appThemesMap[mode.isDarkMode ? "dark" : "light"];
