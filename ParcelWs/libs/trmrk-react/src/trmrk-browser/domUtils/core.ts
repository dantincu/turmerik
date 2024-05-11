import { v4 as uuidv4 } from "uuid";

import trmrk from "../../trmrk";
import { MtblRefValue, jsonBool } from "../../trmrk/core";

export const deviceConstants = {};

export const supportedFeatures = {
  fileSystemApi: !!(window as any).showDirectoryPicker,
};

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

export const appModeCssClass = {
  value: "",
} as MtblRefValue<string>;

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

export const isCompactMode = (
  localStorageIsCompactModeKey: string | null | undefined = null
) => {
  const localStorageIsCompactMode = localStorage.getItem(
    localStorageIsCompactModeKey ?? localStorageKeys.appIsCompactMode
  );

  let isCompactMode = trmrk.jsonBool.false !== localStorageIsCompactMode;
  return isCompactMode;
};

export const setIsDarkModeToLocalStorage = (
  isDarkMode: boolean,
  localStorageIsDarkModeKey: string | null | undefined = null
) =>
  localStorage.setItem(
    localStorageIsDarkModeKey ?? localStorageKeys.appThemeIsDarkMode,
    isDarkMode ? jsonBool.true : jsonBool.false
  );

export const setIsCompactModeToLocalStorage = (
  isCompactMode: boolean,
  localStorageIsCompactModeKey: string | null | undefined = null
) =>
  localStorage.setItem(
    localStorageIsCompactModeKey ?? localStorageKeys.appIsCompactMode,
    isCompactMode ? jsonBool.true : jsonBool.false
  );

export const isIPadFunc = () => /iPad/.test(navigator.userAgent);
export const isIPhoneFunc = () => /iPhone/.test(navigator.userAgent);
export const isIPadOrIphoneFunc = () => /iPad|iPhone/.test(navigator.userAgent);
export const isAndroidFunc = () => /Android/.test(navigator.userAgent);

export const extractDigits = (str: string) =>
  trmrk.transformStr(str, (chr) => (/\d/g.test(chr) ? chr : null));

export const extractDigitsAndDot = (str: string) =>
  trmrk.transformStr(str, (chr) => (/[\d\.]/g.test(chr) ? chr : null));

export const extractIntNumber = (str: string) => parseInt(extractDigits(str));

export const extractFloatNumber = (str: string) =>
  parseInt(extractDigitsAndDot(str));

export interface OverflowType {
  visible?: boolean | null | undefined;
  hidden?: boolean | null | undefined;
  clip?: boolean | null | undefined;
  scroll?: boolean | null | undefined;
  auto?: boolean | null | undefined;
  isHidden: boolean;
}

export const getOverflowType = (overflowCssPropVal: string) => {
  const retObj = {} as OverflowType;

  switch (overflowCssPropVal) {
    case "visible":
      retObj.visible = true;
      break;
    case "hidden":
      retObj.hidden = true;
      break;
    case "clip":
      retObj.clip = true;
      break;
    case "scroll":
      retObj.scroll = true;
      break;
    case "auto":
      retObj.auto = true;
      break;
    default:
      break;
  }

  retObj.isHidden = !!retObj.hidden || !!retObj.clip;
  return retObj;
};
