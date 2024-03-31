import { createSlice } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import trmrk_browser from "trmrk-browser";

import { ReducerAction } from "trmrk-react/src/redux/core";

import {
  AppData,
  AppDataSelectors,
  AppDataReducers,
} from "trmrk-react/src/redux/appData";

const trmrk_react_utils = trmrk_browser.domUtils.default;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    currentUrlPath: "/",
    isDarkMode: trmrk_react_utils.isDarkMode(),
    isCompactMode: trmrk_react_utils.isCompactMode(),
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
  },
  selectors: {
    getCurrentUrlPath: (appData) => appData.currentUrlPath,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
  },
});

const { setCurrentUrlPath, setIsCompactMode, setIsDarkMode } =
  appDataSlice.actions;

const { getCurrentUrlPath, getIsCompactMode, getIsDarkMode } =
  appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
};

export const appDataSelectors: AppDataSelectors = {
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
};

export default appDataSlice.reducer;
