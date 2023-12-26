import React, { useEffect, useState } from "react";

import { reducer, actions, AppData, AppBarOpts, AppPage } from "./appData";
import { AppConfigData } from "trmrk/src/notes-app-config";
import { localStorageKeys, jsonBool, getJsonBool } from "./utils";
import { updateHtmlDocTitle } from "../services/htmlDoc/htmlDocTitle";

export const AppDataContext = React.createContext({} as AppData);

export const createAppContext = (
  state: AppData,
  dispatch: React.Dispatch<{
    type: string;
    payload: any;
  }>
) => {
  return {
    ...state,
    setIsDarkMode: (isDarkMode: boolean) => {
      localStorage.setItem(
        localStorageKeys.appThemeIsDarkMode,
        getJsonBool(isDarkMode)
      );
      dispatch({ type: actions.SET_IS_DARK_MODE, payload: isDarkMode });
    },
    setIsCompactMode: (isCompactMode: boolean) => {
      localStorage.setItem(
        localStorageKeys.appIsCompactMode,
        getJsonBool(isCompactMode)
      );
      dispatch({ type: actions.SET_IS_COMPACT_MODE, payload: isCompactMode });
    },
    setAppConfig: (appConfig: AppConfigData) => {
      dispatch({ type: actions.SET_APP_CONFIG, payload: appConfig });
    },
    setHtmlDocTitle: (newHtmlDocTitle: string) => {
      updateHtmlDocTitle(newHtmlDocTitle);
      dispatch({ type: actions.SET_HTML_DOC_TITLE, payload: newHtmlDocTitle });
    },
    setAppBarOpts: (appBar: AppBarOpts) => {
      dispatch({ type: actions.SET_APP_BAR_OPTS, payload: appBar });
    },
    setFloatingBarTopHeightEm: (floatingBarTopHeightEm: number) => {
      dispatch({
        type: actions.SET_FLOATING_BAR_TOP_HEIGHT_EM,
        payload: floatingBarTopHeightEm,
      });
    },
    setUpdateFloatingBarTopOffset: (updateFloatingBarTopOffset: boolean) => {
      dispatch({
        type: actions.SET_UPDATE_FLOATING_BAR_TOP_OFFSET,
        payload: updateFloatingBarTopOffset,
      });
    },
  };
};

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

  appData.setHtmlDocTitle(htmlDocTitle);
};

export const getAppThemeCssClassName = (appData: AppData) =>
  appData.isDarkMode ? "trmrk-theme-dark" : "trmrk-theme-light";

export const isDocEditMode = (appData: AppData) => {
  const appPage = appData.appBarOpts.appPage;
  let retVal = false;

  switch (appPage) {
    case AppPage.EditNoteItem:
    case AppPage.EditTextFile:
      retVal = true;
      break;
  }

  return retVal;
};
