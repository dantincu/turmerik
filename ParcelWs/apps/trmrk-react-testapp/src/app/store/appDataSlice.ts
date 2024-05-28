import { createSlice } from "@reduxjs/toolkit";

import trmrk from "../../trmrk";

import trmrk_browser from "../../trmrk-browser";

import { ReducerAction } from "../../trmrk-react/redux/core";

import {
  AppData,
  AppDataSelectors,
  AppDataReducers,
  TextCaretPositionerOpts,
} from "../../trmrk-react/redux/appData";

const trmrk_dom_utils = trmrk_browser.domUtils.default;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    currentUrlPath: "/",
    isDarkMode: trmrk_dom_utils.isDarkMode(),
    isCompactMode: trmrk_dom_utils.isCompactMode(),
    textCaretPositionerOpts: {
      enabled: trmrk_dom_utils.getTextCaretPositionerEnabledFromLocalStorage(),
      keepOpen:
        trmrk_dom_utils.getTextCaretPositionerKeepOpenFromLocalStorage(),
    },
  } as AppData,
  reducers: {
    setCurrentUrlPath: (state, action: ReducerAction<string>) => {
      state.currentUrlPath = action.payload;
    },
    setIsDarkMode: (state, action: ReducerAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsCompactMode: (state, action: ReducerAction<boolean>) => {
      state.isCompactMode = action.payload;
    },
    setTextCaretPositionerOpts: (
      state,
      action: ReducerAction<TextCaretPositionerOpts>
    ) => {
      state.textCaretPositionerOpts = action.payload;
    },
    setTextCaretPositionerEnabled: (state, action: ReducerAction<boolean>) => {
      state.textCaretPositionerOpts.enabled = action.payload;
    },
    setTextCaretPositionerKeepOpen: (state, action: ReducerAction<boolean>) => {
      state.textCaretPositionerOpts.keepOpen = action.payload;
    },
  },
  selectors: {
    getBaseLocation: (appData) => appData.baseLocation,
    getCurrentUrlPath: (appData) => appData.currentUrlPath,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
    getTextCaretPositionerOpts: (appData) => appData.textCaretPositionerOpts,
    getTextCaretPositionerEnabled: (appData) =>
      appData.textCaretPositionerOpts.enabled,
    getTextCaretPositionerKeepOpen: (appData) =>
      appData.textCaretPositionerOpts.keepOpen,
  },
});

const {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerKeepOpen,
  setTextCaretPositionerEnabled,
  setTextCaretPositionerOpts,
} = appDataSlice.actions;

const {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerEnabled,
  getTextCaretPositionerKeepOpen,
} = appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerKeepOpen,
  setTextCaretPositionerEnabled,
  setTextCaretPositionerOpts,
};

export const appDataSelectors: AppDataSelectors = {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerEnabled,
  getTextCaretPositionerKeepOpen,
};

export default appDataSlice.reducer;
