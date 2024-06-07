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

import {
  TextCaretPositionerSize,
  TextCaretPositionerViewPortOffset,
} from "../../trmrk-browser/textCaretPositioner/core";

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
    setTextCaretPositionerSize: (
      state,
      action: ReducerAction<TextCaretPositionerSize>
    ) => {
      state.textCaretPositionerOpts.size = action.payload;
    },
    setTextCaretPositionerWidth: (
      state,
      action: ReducerAction<number | null | undefined>
    ) => {
      state.textCaretPositionerOpts.size.width = action.payload;
    },
    setTextCaretPositionerHeight: (
      state,
      action: ReducerAction<number | null | undefined>
    ) => {
      state.textCaretPositionerOpts.size.height = action.payload;
    },
    setTextCaretPositionerViewPortOffset: (
      state,
      action: ReducerAction<TextCaretPositionerViewPortOffset>
    ) => {
      state.textCaretPositionerOpts.viewPortOffset = action.payload;
    },
    setTextCaretPositionerViewPortOffsetTop: (
      state,
      action: ReducerAction<number | null | undefined>
    ) => {
      state.textCaretPositionerOpts.viewPortOffset.top = action.payload;
    },
    setTextCaretPositionerViewPortOffsetLeft: (
      state,
      action: ReducerAction<number | null | undefined>
    ) => {
      state.textCaretPositionerOpts.viewPortOffset.left = action.payload;
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
    getTextCaretPositionerSize: (appData) =>
      appData.textCaretPositionerOpts.size,
    getTextCaretPositionerWidth: (appData) =>
      appData.textCaretPositionerOpts.size.width,
    getTextCaretPositionerHeight: (appData) =>
      appData.textCaretPositionerOpts.size.height,
    getTextCaretPositionerViewPortOffset: (appData) =>
      appData.textCaretPositionerOpts.viewPortOffset,
    getTextCaretPositionerViewPortOffsetTop: (appData) =>
      appData.textCaretPositionerOpts.viewPortOffset.top,
    getTextCaretPositionerViewPortOffsetLeft: (appData) =>
      appData.textCaretPositionerOpts.viewPortOffset.left,
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
  setTextCaretPositionerSize,
  setTextCaretPositionerWidth,
  setTextCaretPositionerHeight,
  setTextCaretPositionerViewPortOffset,
  setTextCaretPositionerViewPortOffsetTop,
  setTextCaretPositionerViewPortOffsetLeft,
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
  getTextCaretPositionerSize,
  getTextCaretPositionerWidth,
  getTextCaretPositionerHeight,
  getTextCaretPositionerViewPortOffset,
  getTextCaretPositionerViewPortOffsetTop,
  getTextCaretPositionerViewPortOffsetLeft,
} = appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
  setTextCaretPositionerKeepOpen,
  setTextCaretPositionerEnabled,
  setTextCaretPositionerOpts,
  incTextCaretPositionerCurrentInputElLastSetOpIdx,
  setTextCaretPositionerSize,
  setTextCaretPositionerWidth,
  setTextCaretPositionerHeight,
  setTextCaretPositionerViewPortOffset,
  setTextCaretPositionerViewPortOffsetTop,
  setTextCaretPositionerViewPortOffsetLeft,
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
  getTextCaretPositionerSize,
  getTextCaretPositionerWidth,
  getTextCaretPositionerHeight,
  getTextCaretPositionerViewPortOffset,
  getTextCaretPositionerViewPortOffsetTop,
  getTextCaretPositionerViewPortOffsetLeft,
};

export default appDataSlice.reducer;
