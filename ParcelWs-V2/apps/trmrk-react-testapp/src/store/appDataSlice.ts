import { createSlice } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import { trmrk_react } from "trmrk-react";
import { ReducerAction } from "trmrk-react/src/redux/core";
import { AppData } from "../services/appData";

const trmrk_react_utils = trmrk_react.utils;
const { localStorageKeys } = trmrk_react_utils;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    showAppBar: true,
    showAppBarToggleBtn: true,
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      trmrk.jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      trmrk.jsonBool.false,
  } as AppData,
  reducers: {
    setShowAppBar: (state, action: ReducerAction<boolean>) => {
      state.showAppBar = action.payload;
    },
    setShowAppBarToggleBtn: (state, action: ReducerAction<boolean>) => {
      state.showAppBarToggleBtn = action.payload;
    },
    setIsDarkMode: (state, action: ReducerAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsCompactMode: (state, action: ReducerAction<boolean>) => {
      state.isCompactMode = action.payload;
    },
  },
  selectors: {
    getShowAppBar: (appData) => appData.showAppBar,
    getShowAppBarToggleBtn: (appData) => appData.showAppBarToggleBtn,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
  },
});

const {
  setIsCompactMode,
  setIsDarkMode,
  setShowAppBar,
  setShowAppBarToggleBtn,
} = appDataSlice.actions;

const {
  getIsCompactMode,
  getIsDarkMode,
  getShowAppBar,
  getShowAppBarToggleBtn,
} = appDataSlice.selectors;

export const appDataReducers = {
  setIsCompactMode,
  setIsDarkMode,
  setShowAppBar,
  setShowAppBarToggleBtn,
};

export const appDataSelectors = {
  getIsCompactMode,
  getIsDarkMode,
  getShowAppBar,
  getShowAppBarToggleBtn,
};

export default appDataSlice.reducer;
