import { createSlice } from "@reduxjs/toolkit";
import { ReducerAction } from "../../trmrk-react/redux/core";

import trmrk from "../../trmrk";

import trmrk_browser from "../../trmrk-browser";

import {
  AppData,
  AppDataSelectors,
  AppDataReducers,
  TextCaretPositionerOpts,
  getInitialState,
} from "../../trmrk-react/redux/appData";

const trmrk_dom_utils = trmrk_browser.domUtils.default;

const appDataSlice = createSlice({
  name: "appData",
  initialState: getInitialState(),
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
    incTextCaretPositionerCurrentInputElLastSetOpIdx: (state) => {
      state.textCaretPositionerOpts.currentInputElLastSetOpIdx++;
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
    getTextCaretPositionerCurrentInputElLastSetOpIdx: (appData) =>
      appData.textCaretPositionerOpts.currentInputElLastSetOpIdx,
  },
});

const {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerKeepOpen,
  setTextCaretPositionerEnabled,
  setTextCaretPositionerOpts,
  incTextCaretPositionerCurrentInputElLastSetOpIdx,
} = appDataSlice.actions;

const {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerEnabled,
  getTextCaretPositionerKeepOpen,
  getTextCaretPositionerCurrentInputElLastSetOpIdx,
} = appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerKeepOpen,
  setTextCaretPositionerEnabled,
  setTextCaretPositionerOpts,
  incTextCaretPositionerCurrentInputElLastSetOpIdx,
};

export const appDataSelectors: AppDataSelectors = {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerEnabled,
  getTextCaretPositionerKeepOpen,
  getTextCaretPositionerCurrentInputElLastSetOpIdx,
};

export default appDataSlice.reducer;
