import { createSlice } from "@reduxjs/toolkit";

import { ReducerAction } from "trmrk-react/src/redux/core";
import {
  AppBarData,
  AppSettingsMenuOpts,
  AppearenceMenuOpts,
  OptionsMenuOpts,
  AppBarReducers,
  AppBarSelectors,
} from "trmrk-react/src/redux/appBarData";

const appBarDataSlice = createSlice({
  name: "appBar",
  initialState: {
    appSettingsMenuOpts: {
      isOpen: false,
      appearenceMenuOpts: {
        isOpen: false,
      },
    },
    showOptionsMenuBtn: false,
    optionsMenuOpts: {
      isOpen: false,
    },
  } as AppBarData,
  reducers: {
    setAppSettingsMenuOpts: (
      state,
      action: ReducerAction<AppSettingsMenuOpts>
    ) => {
      state.appSettingsMenuOpts = action.payload;
    },
    setAppSettingsMenuIsOpen: (state, action: ReducerAction<boolean>) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = false;
      state.appSettingsMenuOpts.isOpen = action.payload;
    },
    setAppearenceMenuOpts: (
      state,
      action: ReducerAction<AppearenceMenuOpts>
    ) => {
      state.appSettingsMenuOpts.appearenceMenuOpts = action.payload;
    },
    setAppearenceMenuIsOpen: (state, action: ReducerAction<boolean>) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = action.payload;
    },
    setShowOptionsMenuBtn: (state, action: ReducerAction<boolean>) => {
      state.showOptionsMenuBtn = action.payload;
    },
    setOptionsMenuOpts: (state, action: ReducerAction<OptionsMenuOpts>) => {
      state.optionsMenuOpts = action.payload;
    },
    setOptionsMenuIsOpen: (state, action: ReducerAction<boolean>) => {
      state.optionsMenuOpts.isOpen = action.payload;
    },
  },
  selectors: {
    getAppSettingsMenuOpts: (state) => state.appSettingsMenuOpts,
    getAppSettingsMenuIsOpen: (state) => state.appSettingsMenuOpts.isOpen,
    getAppearenceMenuOpts: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts,
    getAppearenceMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
    getShowOptionsMenuBtn: (state) => state.showOptionsMenuBtn,
    getOptionsMenuOpts: (state) => state.optionsMenuOpts,
    getOptionsMenuIsOpen: (state) => state.optionsMenuOpts.isOpen,
  },
});

const {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuOpts,
  setAppearenceMenuIsOpen,
  setShowOptionsMenuBtn,
  setOptionsMenuOpts,
  setOptionsMenuIsOpen,
} = appBarDataSlice.actions;

const {
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
} = appBarDataSlice.selectors;

export const appBarReducers: AppBarReducers = {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuOpts,
  setAppearenceMenuIsOpen,
  setShowOptionsMenuBtn,
  setOptionsMenuOpts,
  setOptionsMenuIsOpen,
};

export const appBarSelectors: AppBarSelectors = {
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
};

export default appBarDataSlice.reducer;
