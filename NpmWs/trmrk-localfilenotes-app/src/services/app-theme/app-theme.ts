import { createTheme } from "@mui/material/styles";

export interface AppThemeMode {
  isDarkMode: boolean;
}

export const appThemesMap = {
  light: createTheme({
    palette: {
      mode: "light",
    },
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
};

export const getAppTheme = (mode: AppThemeMode) =>
  appThemesMap[mode.isDarkMode ? "dark" : "light"];
