import { AppConfigData } from "trmrk/src/notes-app-config";
import { AppData, AppBarData, AppPage, AppPagesData } from "./appData";
import { updateHtmlDocTitle } from "./htmlDoc/htmlDocTitle";

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

export const defaultAppTitle = "Turmerik Local File Notes";

export const updateAppTitle = (
  appConfig: AppConfigData,
  idnf: string | null | undefined,
  idnfIsPath: boolean = true
) => {
  if (idnf && idnfIsPath) {
    idnf = idnf
      .split(appConfig.pathSep)
      .filter((seg) => seg.trim())
      .splice(-1, 1)[0];
  }

  let htmlDocTitle = defaultAppTitle;

  if (idnf) {
    htmlDocTitle = idnf + " - " + htmlDocTitle;
  }

  updateHtmlDocTitle(htmlDocTitle);
};

export const getAppThemeCssClassName = (appPages: AppPagesData) => {
  const appThemeClassName = appPages.isDarkMode
    ? "trmrk-theme-dark"
    : "trmrk-theme-light";

  return appThemeClassName;
};

export const isDocEditMode = (appPagesData: AppPagesData) => {
  const appPage = appPagesData.currentAppPage;
  let retVal = false;

  switch (appPage) {
    case AppPage.EditNoteItem:
    case AppPage.EditTextFile:
      retVal = true;
      break;
  }

  return retVal;
};
