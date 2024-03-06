import { v4 as uuidv4 } from "uuid";

import trmrk from "trmrk";
import { MtblRefValue } from "trmrk/src/core";

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
  appIsCompactMode: "appIsCompactMode",
});

export const newUUid = () => uuidv4().replaceAll("-", "");

export const appModeCssClasses = {
  compactMode: "trmrk-mode-compact",
  fullMode: "trmrk-mode-full",
};

export const getAppModeCssClassName = (isCompactMode: boolean) => {
  const appModeClassName = isCompactMode
    ? appModeCssClasses.compactMode
    : appModeCssClasses.fullMode;

  return appModeClassName;
};

export const getRoute = (
  routeBase: string,
  path: string | null | undefined = null,
  relPath: string | null | undefined = null
) => {
  const partsArr = [path, relPath]
    .filter((value) => value)
    .map((value) => encodeURIComponent(value!));

  partsArr.splice(0, 0, routeBase);
  const route = partsArr.join("/");

  return route;
};

export const appModeCssClass = {} as MtblRefValue<string>;

export const prefersDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const isDarkMode = (
  localStorageIsDarkModeKey: string | null | undefined = null
) => {
  const localStorageIsDarkMode = localStorage.getItem(
    localStorageIsDarkModeKey ?? localStorageKeys.appThemeIsDarkMode
  );

  let isDarkMode: boolean;

  if (localStorageIsDarkMode) {
    if (trmrk.jsonBool.true === localStorageIsDarkMode) {
      isDarkMode = true;
    } else if (trmrk.jsonBool.false === localStorageIsDarkMode) {
      isDarkMode = false;
    } else {
      isDarkMode = prefersDarkMode();
    }
  } else {
    isDarkMode = prefersDarkMode();
  }

  return isDarkMode;
};
