import {
  isDarkMode,
  setIsDarkModeToLocalStorage,
  setIsCompactModeToLocalStorage,
  appModeCssClass,
  appThemeCssClass,
  getAppModeCssClassName,
  getAppThemeCssClassName,
  customEvent,
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

export const eventNames = Object.freeze({
  rootElemAvaillable: "rootelemavaillable",
  rootElemUnavaillable: "rootelemunavaillable",
});

export interface RootElemAvaillableEventData<THTMLElement extends HTMLElement> {
  rootElem: THTMLElement;
}

export const rootElemAvaillableEvent = <THTMLElement extends HTMLElement>(
  rootElem: THTMLElement
) =>
  customEvent<RootElemAvaillableEventData<THTMLElement>>(
    eventNames.rootElemAvaillable,
    {
      rootElem,
    }
  );

export const rootElemUnavaillableEvent = () =>
  customEvent(eventNames.rootElemUnavaillable, {});
