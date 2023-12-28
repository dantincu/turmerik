import { AppData, AppBarData, AppPage } from "./appData";
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
  appData: AppData,
  idnf: string | null | undefined,
  idnfIsPath: boolean = true
) => {
  if (idnf && idnfIsPath) {
    idnf = idnf
      .split(appData.appConfig.pathSep)
      .filter((seg) => seg.trim())
      .splice(-1, 1)[0];
  }

  let htmlDocTitle = defaultAppTitle;

  if (idnf) {
    htmlDocTitle = idnf + " - " + htmlDocTitle;
  }

  updateHtmlDocTitle(htmlDocTitle);
};

export const getAppThemeCssClassName = (appData: AppData) => {
  const appThemeClassName = appData.appPages.isDarkMode
    ? "trmrk-theme-dark"
    : "trmrk-theme-light";

  return appThemeClassName;
};

export const isDocEditMode = (appBarData: AppBarData) => {
  const appPage = appBarData.appBarOpts.appPage;
  let retVal = false;

  switch (appPage) {
    case AppPage.EditNoteItem:
    case AppPage.EditTextFile:
      retVal = true;
      break;
  }

  return retVal;
};
