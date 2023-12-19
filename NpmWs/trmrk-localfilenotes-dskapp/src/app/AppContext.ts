import React, { useEffect, useState } from "react";

import { reducer, actions, AppData } from "./app-data";
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
  };
};

export const updateAppTitle = (
  appData: AppData,
  idnf: string | null | undefined
) => {
  let appTitle = "Turmerik Local file Notes";
  let htmlDocTitle = appTitle;

  if (idnf) {
    const name = idnf.split(appData.appConfig.pathSep).splice(-1, 1)[0];
    htmlDocTitle = name + " - " + htmlDocTitle;
    appTitle += " - " + name;
  }

  if (appTitle !== appData.appTitle) {
    appData.setAppTitle(appTitle);
  }

  appData.setHtmlDocTitle(htmlDocTitle);
};
