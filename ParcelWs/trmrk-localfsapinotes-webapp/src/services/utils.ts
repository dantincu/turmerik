import { v4 as uuidv4 } from "uuid";

import { AppData } from "./appData";

export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const queryKeys = Object.freeze({});

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
  appIsCompactMode: "appIsCompactMode",
});

export const localForageKeys = Object.freeze({
  openAppTabs: "openAppTabs",
});

export const newUUid = () => uuidv4().replaceAll("-", "");

export const getLocalForageDbNameNewPfx = (
  uuidStr?: string | null | undefined
) => {
  uuidStr ??= newUUid();
  const newPfx = `localFsApiNotes/${uuidStr}/`;

  return newPfx;
};

export const defaultAppTitle = "Turmerik Notes";

export const getAppTitle = (name: string | null = null) => {
  let title = defaultAppTitle;

  if (typeof name === "string") {
    title = [name, defaultAppTitle].join(" - ");
  }

  return title;
};

export const getAppThemeCssClassName = (appData: AppData) => {
  const appThemeClassName = appData.isDarkMode
    ? "trmrk-theme-dark"
    : "trmrk-theme-light";

  return appThemeClassName;
};

export const getAppModeCssClassName = (appData: AppData) => {
  const appModeClassName = appData.isCompactMode
    ? "trmrk-mode-compact"
    : "trmrk-mode-full";

  return appModeClassName;
};

export const getRoute = (routeBase: string, idnf: string) => {
  const encodedIdnf = encodeURIComponent(idnf);
  const route = [routeBase, encodedIdnf].join("/");
  return route;
};
