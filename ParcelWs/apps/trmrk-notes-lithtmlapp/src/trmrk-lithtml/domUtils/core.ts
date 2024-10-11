import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import {
  isDarkMode,
  isCompactMode,
  setIsDarkModeToLocalStorage,
} from "../../trmrk-browser/domUtils/core";

export const setDomBsAppTheme = (isDarkModeValue: boolean) => {
  const domAppThemeName = isDarkModeValue ? "dark" : "light";

  document
    .getElementsByTagName("html")[0]
    .setAttribute("data-bs-theme", domAppThemeName);
};

export const setBsAppTheme = (
  isDarkModeValue: boolean,
  localStorageIsDarkModeKey: string | null | undefined = null
) => {
  setIsDarkModeToLocalStorage(isDarkModeValue, localStorageIsDarkModeKey);
  setDomBsAppTheme(isDarkModeValue);
};

export const initDomAppTheme = () => {
  const isDarkModeValue = isDarkMode();
  setDomBsAppTheme(isDarkModeValue);

  return isDarkModeValue;
};

export const isDarkModePropFactory =
  new ObservableValueSingletonControllerFactory(null, initDomAppTheme());

export const isCompactModePropFactory =
  new ObservableValueSingletonControllerFactory(null, isCompactMode());
