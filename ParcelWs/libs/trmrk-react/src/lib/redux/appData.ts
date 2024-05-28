import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface TextCaretPositionerOpts {
  enabled: boolean;
  keepOpen: boolean;
}

export interface AppData {
  baseLocation: string;
  currentUrlPath: string;
  isDarkMode: boolean;
  isCompactMode: boolean;
  textCaretPositionerOpts: TextCaretPositionerOpts;
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
  getTextCaretPositionerOpts: Selector<
    {
      appData: AppData;
    },
    TextCaretPositionerOpts,
    []
  > & {
    unwrapped: (appData: AppData) => TextCaretPositionerOpts;
  };
  getTextCaretPositionerEnabled: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getTextCaretPositionerKeepOpen: Selector<
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
  setTextCaretPositionerEnabled: ActionCreatorWithPayload<
    boolean,
    "appData/setTextCaretPositionerEnabled"
  >;
  setTextCaretPositionerKeepOpen: ActionCreatorWithPayload<
    boolean,
    "appData/setTextCaretPositionerKeepOpen"
  >;
  setTextCaretPositionerOpts: ActionCreatorWithPayload<
    TextCaretPositionerOpts,
    "appData/setTextCaretPositionerOpts"
  >;
}
