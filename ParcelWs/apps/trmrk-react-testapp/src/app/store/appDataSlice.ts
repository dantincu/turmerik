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

import { TextCaretPositionerOptsCore } from "../../trmrk-browser/textCaretPositioner/core";

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
    incTextCaretPositionerCurrentInputElLastSetOpIdx: (state) => {
      state.textCaretPositionerOpts.currentInputElLastSetOpIdx++;
    },
    setFullViewPortTextCaretPositionerOpts: (
      state,
      action: ReducerAction<TextCaretPositionerOpts>
    ) => {
      state.fullViewPortTextCaretPositionerOpts = action.payload;
    },
  },
  selectors: {
    getBaseLocation: (appData) => appData.baseLocation,
    getCurrentUrlPath: (appData) => appData.currentUrlPath,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
    getTextCaretPositionerOpts: (appData) => appData.textCaretPositionerOpts,
    getTextCaretPositionerCurrentInputElLastSetOpIdx: (appData) =>
      appData.textCaretPositionerOpts.currentInputElLastSetOpIdx,
    getFullViewPortTextCaretPositionerOpts: (appData) =>
      appData.fullViewPortTextCaretPositionerOpts,
  },
});

const {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerOpts,
  incTextCaretPositionerCurrentInputElLastSetOpIdx,
  setFullViewPortTextCaretPositionerOpts,
} = appDataSlice.actions;

const {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerCurrentInputElLastSetOpIdx,
  getFullViewPortTextCaretPositionerOpts,
} = appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerOpts,
  incTextCaretPositionerCurrentInputElLastSetOpIdx,
  setFullViewPortTextCaretPositionerOpts,
};

export const appDataSelectors: AppDataSelectors = {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
  getTextCaretPositionerOpts,
  getTextCaretPositionerCurrentInputElLastSetOpIdx,
  getFullViewPortTextCaretPositionerOpts,
};

export default appDataSlice.reducer;
