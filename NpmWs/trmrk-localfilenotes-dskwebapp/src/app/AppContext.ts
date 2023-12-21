import React, { useEffect, useState } from "react";

import { reducer, actions, AppData, AppBarOpts } from "./appData";
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
    setAppConfig: (appConfig: AppConfigData) => {
      dispatch({ type: actions.SET_APP_CONFIG, payload: appConfig });
    },
    setHtmlDocTitle: (newHtmlDocTitle: string) => {
      updateHtmlDocTitle(newHtmlDocTitle);
      dispatch({ type: actions.SET_HTML_DOC_TITLE, payload: newHtmlDocTitle });
    },
    setAppTitle: (newAppTitle: string) => {
      dispatch({ type: actions.SET_APP_TITLE, payload: newAppTitle });
    },
    setAppBarOpts: (appBar: AppBarOpts) => {
      dispatch({ type: actions.SET_APP_BAR_OPTS, payload: appBar });
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

  const appTitle = idnf ?? defaultAppTitle;
  let htmlDocTitle = defaultAppTitle;

  if (idnf) {
    htmlDocTitle = idnf + " - " + htmlDocTitle;
  }

  if (appTitle !== appData.appTitle) {
    appData.setAppTitle(appTitle);
  }

  appData.setHtmlDocTitle(htmlDocTitle);
};
