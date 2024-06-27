import { createSlice } from "@reduxjs/toolkit";

import { ReducerAction } from "../../trmrk-react/redux/core";
import {
  AppBarData,
  AppSettingsMenuOpts,
  AppearenceMenuOpts,
  OptionsMenuOpts,
  AppBarReducers,
  AppBarSelectors,
} from "../../trmrk-react/redux/appBarData";

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
    showAppHeader: true,
    showAppHeaderOverride: null,
    showAppHeaderToggleBtn: true,
    showAppFooter: true,
    showAppFooterOverride: null,
    showAppFooterToggleBtn: true,
    appFooterRowsCount: 1,
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
    setShowAppHeader: (state, action: ReducerAction<boolean>) => {
      state.showAppHeader = action.payload;
    },
    setShowAppHeaderOverride: (
      state,
      action: ReducerAction<boolean | null>
    ) => {
      state.showAppHeaderOverride = action.payload;
    },
    setShowAppHeaderToggleBtn: (state, action: ReducerAction<boolean>) => {
      state.showAppHeaderToggleBtn = action.payload;
    },
    setShowAppFooter: (state, action: ReducerAction<boolean>) => {
      state.showAppFooter = action.payload;
    },
    setShowAppFooterOverride: (
      state,
      action: ReducerAction<boolean | null>
    ) => {
      state.showAppFooterOverride = action.payload;
    },
    setShowAppFooterToggleBtn: (state, action: ReducerAction<boolean>) => {
      state.showAppFooterToggleBtn = action.payload;
    },
    setAppFooterRowsCount: (state, action: ReducerAction<number>) => {
      state.appFooterRowsCount = action.payload;
    },
  },
  selectors: {
    isAnyMenuOpen: (state) =>
      state.appSettingsMenuOpts.isOpen || state.optionsMenuOpts.isOpen,
    getAppSettingsMenuOpts: (state) => state.appSettingsMenuOpts,
    getAppSettingsMenuIsOpen: (state) => state.appSettingsMenuOpts.isOpen,
    getAppearenceMenuOpts: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts,
    getAppearenceMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
    getShowOptionsMenuBtn: (state) => state.showOptionsMenuBtn,
    getOptionsMenuOpts: (state) => state.optionsMenuOpts,
    getOptionsMenuIsOpen: (state) => state.optionsMenuOpts.isOpen,
    getShowAppHeader: (state) => state.showAppHeader,
    getShowAppHeaderOverride: (state) => state.showAppHeaderOverride,
    getShowAppHeaderToggleBtn: (state) => state.showAppHeaderToggleBtn,
    getShowAppFooter: (state) => state.showAppFooter,
    getShowAppFooterOverride: (state) => state.showAppFooterOverride,
    getShowAppFooterToggleBtn: (state) => state.showAppFooterToggleBtn,
    getAppFooterRowsCount: (state) => state.appFooterRowsCount,
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
  setShowAppHeader,
  setShowAppHeaderOverride,
  setShowAppHeaderToggleBtn,
  setShowAppFooter,
  setShowAppFooterOverride,
  setShowAppFooterToggleBtn,
  setAppFooterRowsCount,
} = appBarDataSlice.actions;

const {
  isAnyMenuOpen,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
  getShowAppHeader,
  getShowAppHeaderOverride,
  getShowAppHeaderToggleBtn,
  getShowAppFooter,
  getShowAppFooterOverride,
  getShowAppFooterToggleBtn,
  getAppFooterRowsCount,
} = appBarDataSlice.selectors;

export const appBarReducers: AppBarReducers = {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuOpts,
  setAppearenceMenuIsOpen,
  setShowOptionsMenuBtn,
  setOptionsMenuOpts,
  setOptionsMenuIsOpen,
  setShowAppHeader,
  setShowAppHeaderOverride,
  setShowAppHeaderToggleBtn,
  setShowAppFooter,
  setShowAppFooterOverride,
  setShowAppFooterToggleBtn,
  setAppFooterRowsCount,
};

export const appBarSelectors: AppBarSelectors = {
  isAnyMenuOpen,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
  getShowAppHeader,
  getShowAppHeaderOverride,
  getShowAppHeaderToggleBtn,
  getShowAppFooter,
  getShowAppFooterOverride,
  getShowAppFooterToggleBtn,
  getAppFooterRowsCount,
};

export default appBarDataSlice.reducer;
