import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import {
  isDarkMode,
  isCompactMode,
  setIsDarkModeToLocalStorage,
  setIsCompactModeToLocalStorage,
  appModeCssClass,
  appThemeCssClass,
  getAppModeCssClassName,
  getAppThemeCssClassName,
} from "../../trmrk-browser/domUtils/core";

export const setDomBsAppTheme = (isDarkModeValue: boolean) => {
  const domAppThemeName = isDarkModeValue ? "dark" : "light";

  document
    .getElementsByTagName("html")[0]
    .setAttribute("data-bs-theme", domAppThemeName);
};

export const setAppTheme = (
  isDarkModeValue: boolean,
  localStorageIsDarkModeKey: string | null | undefined = null,
  useBootstrapLib: boolean | null | undefined = null
) => {
  setIsDarkModeToLocalStorage(isDarkModeValue, localStorageIsDarkModeKey);
  appThemeCssClass.value = getAppThemeCssClassName(isDarkModeValue);

  if (useBootstrapLib ?? true) {
    setDomBsAppTheme(isDarkModeValue);
  }
};

export const initDomAppTheme = () => {
  const isDarkModeValue = isDarkMode();
  setDomBsAppTheme(isDarkModeValue);

  return isDarkModeValue;
};

export const setAppMode = (
  isCompactModeValue: boolean,
  localStorageIsCompactModeKey: string | null | undefined = null
) => {
  setIsCompactModeToLocalStorage(
    isCompactModeValue,
    localStorageIsCompactModeKey
  );

  appModeCssClass.value = getAppModeCssClassName(isCompactModeValue);
};

export const isDarkModePropFactory =
  new ObservableValueSingletonControllerFactory(null, initDomAppTheme());

export const isCompactModePropFactory =
  new ObservableValueSingletonControllerFactory(null, isCompactMode());
