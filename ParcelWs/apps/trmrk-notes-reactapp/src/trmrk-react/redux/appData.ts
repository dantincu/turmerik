import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

import trmrk from "../../trmrk";
import trmrk_dom_utils from "../../trmrk-browser/domUtils";

export interface AppData {
  baseLocation: string;
  currentUrlPath: string;
  isDarkMode: boolean;
  isCompactMode: boolean;
}

export interface AppDataSelectors {
  getBaseLocation: Selector<
    {
      appData: AppData;
    },
    string,
    []
  > & {
    unwrapped: (appData: AppData) => string;
  };
  getCurrentUrlPath: Selector<
    {
      appData: AppData;
    },
    string,
    []
  > & {
    unwrapped: (appData: AppData) => string;
  };
  getIsCompactMode: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getIsDarkMode: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
}

export interface AppDataReducers {
  setCurrentUrlPath: ActionCreatorWithPayload<
    string,
    "appData/setCurrentUrlPath"
  >;
  setIsCompactMode: ActionCreatorWithPayload<
    boolean,
    "appData/setIsCompactMode"
  >;
  setIsDarkMode: ActionCreatorWithPayload<boolean, "appData/setIsDarkMode">;
}

export const getInitialState = (): AppData => ({
  baseLocation: trmrk.url.getBaseLocation(),
  currentUrlPath: "/",
  isDarkMode: trmrk_dom_utils.isDarkMode(),
  isCompactMode: trmrk_dom_utils.isCompactMode(),
});
