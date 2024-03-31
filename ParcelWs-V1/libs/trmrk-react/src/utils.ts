import { v4 as uuidv4 } from "uuid";

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
