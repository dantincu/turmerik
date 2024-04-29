import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface AppData {
  baseLocation: string;
  currentUrlPath: string;
  isDarkMode: boolean;
  isCompactMode: boolean;
}

export interface AppDataSelectors {
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
