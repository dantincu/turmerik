import React, { useEffect, useState } from "react";

import {
  appCtxReducer,
  appBarCtxReducer,
  appCtxActions,
  appBarCtxActions,
  AppData,
  AppBarData,
  AppBarOpts,
  AppPage,
  AppSettingsMenuOpts,
  AppOptionsMenuOpts,
} from "./appData";
import { AppConfigData } from "trmrk/src/notes-app-config";
import { localStorageKeys, jsonBool, getJsonBool } from "./utils";
import { updateHtmlDocTitle } from "../services/htmlDoc/htmlDocTitle";

export const AppDataContext = React.createContext({} as AppData);
export const AppBarDataContext = React.createContext({} as AppBarData);

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
      dispatch({ type: appCtxActions.SET_IS_DARK_MODE, payload: isDarkMode });
    },
    setIsCompactMode: (isCompactMode: boolean) => {
      localStorage.setItem(
        localStorageKeys.appIsCompactMode,
        getJsonBool(isCompactMode)
      );
      dispatch({
        type: appCtxActions.SET_IS_COMPACT_MODE,
        payload: isCompactMode,
      });
    },
    setAppConfig: (appConfig: AppConfigData) => {
      dispatch({ type: appCtxActions.SET_APP_CONFIG, payload: appConfig });
    },
    setHtmlDocTitle: (newHtmlDocTitle: string) => {
      updateHtmlDocTitle(newHtmlDocTitle);
      dispatch({
        type: appCtxActions.SET_HTML_DOC_TITLE,
        payload: newHtmlDocTitle,
      });
    },
  };
};

export const createAppBarContext = (
  state: AppBarData,
  dispatch: React.Dispatch<{
    type: string;
    payload: any;
  }>
) => {
  return {
    ...state,
    setAppBarOpts: (appBar: AppBarOpts) => {
      dispatch({ type: appBarCtxActions.SET_APP_BAR_OPTS, payload: appBar });
    },
    setAppPage: (appPage: AppPage) => {
      dispatch({ type: appBarCtxActions.SET_APP_PAGE, payload: appPage });
    },
    setFloatingBarTopHeightEm: (floatingBarTopHeightEm: number) => {
      dispatch({
        type: appBarCtxActions.SET_FLOATING_BAR_TOP_HEIGHT_EM,
        payload: floatingBarTopHeightEm,
      });
    },
    setUpdateFloatingBarTopOffset: (updateFloatingBarTopOffset: boolean) => {
      dispatch({
        type: appBarCtxActions.SET_UPDATE_FLOATING_BAR_TOP_OFFSET,
        payload: updateFloatingBarTopOffset,
      });
    },
    setAppSettingsMenuOpts: (appSettingsMenuOpts: AppSettingsMenuOpts) => {
      dispatch({
        type: appBarCtxActions.SET_APP_SETTINGS_MENU_OPTS,
        payload: appSettingsMenuOpts,
      });
    },
    setAppOptionsMenuOpts: (appOptionsMenuOpts: AppOptionsMenuOpts) => {
      dispatch({
        type: appBarCtxActions.SET_APP_OPTIONS_MENU_OPTS,
        payload: appOptionsMenuOpts,
      });
    },
    setAppSettingsMenuIsOpen: (appSettingsMenuIsOpen: boolean) => {
      dispatch({
        type: appBarCtxActions.SET_APP_SETTINGS_MENU_IS_OPEN,
        payload: appSettingsMenuIsOpen,
      });
    },
    setAppThemeMenuIsOpen: (appThemeMenuIsOpen: boolean) => {
      dispatch({
        type: appBarCtxActions.SET_APP_THEME_MENU_IS_OPEN,
        payload: appThemeMenuIsOpen,
      });
    },
    setAppOptionsMenuIsOpen: (appOptionsMenuIsOpen: boolean) => {
      dispatch({
        type: appBarCtxActions.SET_APP_OPTIONS_MENU_IS_OPEN,
        payload: appOptionsMenuIsOpen,
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
