import { createSlice } from "@reduxjs/toolkit";

import { ReducerAction } from "../../trmrk-react/redux/core";
import {
  AppBarData,
  AppSettingsMenuOpts,
  AppearenceMenuOpts,
  OptionsMenuOpts,
  AppBarReducers,
  AppBarSelectors,
  TextCaretPositionerMenuOpts,
} from "../../trmrk-react/redux/appBarData";

const appBarDataSlice = createSlice({
  name: "appBar",
  initialState: {
    appSettingsMenuOpts: {
      isOpen: false,
      textCaretPositionerMenuOpts: {
        isOpen: false,
      },
      appearenceMenuOpts: {
        isOpen: false,
      },
    },
    showOptionsMenuBtn: true,
    optionsMenuOpts: {
      isOpen: false,
    },
    showAppHeader: true,
    showAppHeaderToggleBtn: true,
    showAppFooter: true,
    showAppFooterToggleBtn: true,
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
      state.appSettingsMenuOpts.textCaretPositionerMenuOpts.isOpen = false;
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
    setTextCaretPositionerMenuOpts: (
      state,
      action: ReducerAction<TextCaretPositionerMenuOpts>
    ) => {
      state.appSettingsMenuOpts.textCaretPositionerMenuOpts = action.payload;
    },
    setTextCaretPositionerMenuIsOpen: (
      state,
      action: ReducerAction<boolean>
    ) => {
      state.appSettingsMenuOpts.textCaretPositionerMenuOpts.isOpen =
        action.payload;
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
    setShowAppHeaderToggleBtn: (state, action: ReducerAction<boolean>) => {
      state.showAppHeaderToggleBtn = action.payload;
    },
    setShowAppFooter: (state, action: ReducerAction<boolean>) => {
      state.showAppFooter = action.payload;
    },
    setShowAppFooterToggleBtn: (state, action: ReducerAction<boolean>) => {
      state.showAppFooterToggleBtn = action.payload;
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
    getTextCaretPositionerMenuOpts: (state) =>
      state.appSettingsMenuOpts.textCaretPositionerMenuOpts,
    getTextCaretPositionerMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.textCaretPositionerMenuOpts.isOpen,
    getShowOptionsMenuBtn: (state) => state.showOptionsMenuBtn,
    getOptionsMenuOpts: (state) => state.optionsMenuOpts,
    getOptionsMenuIsOpen: (state) => state.optionsMenuOpts.isOpen,
    getShowAppHeader: (state) => state.showAppHeader,
    getShowAppHeaderToggleBtn: (state) => state.showAppHeaderToggleBtn,
    getShowAppFooter: (state) => state.showAppFooter,
    getShowAppFooterToggleBtn: (state) => state.showAppFooterToggleBtn,
  },
});

const {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuOpts,
  setAppearenceMenuIsOpen,
  setTextCaretPositionerMenuOpts,
  setTextCaretPositionerMenuIsOpen,
  setShowOptionsMenuBtn,
  setOptionsMenuOpts,
  setOptionsMenuIsOpen,
  setShowAppHeader,
  setShowAppHeaderToggleBtn,
  setShowAppFooter,
  setShowAppFooterToggleBtn,
} = appBarDataSlice.actions;

const {
  isAnyMenuOpen,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getTextCaretPositionerMenuOpts,
  getTextCaretPositionerMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
  getShowAppHeader,
  getShowAppHeaderToggleBtn,
  getShowAppFooter,
  getShowAppFooterToggleBtn,
} = appBarDataSlice.selectors;

export const appBarReducers: AppBarReducers = {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuOpts,
  setAppearenceMenuIsOpen,
  setTextCaretPositionerMenuOpts,
  setTextCaretPositionerMenuIsOpen,
  setShowOptionsMenuBtn,
  setOptionsMenuOpts,
  setOptionsMenuIsOpen,
  setShowAppHeader,
  setShowAppHeaderToggleBtn,
  setShowAppFooter,
  setShowAppFooterToggleBtn,
};

export const appBarSelectors: AppBarSelectors = {
  isAnyMenuOpen,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuOpts,
  getAppearenceMenuIsOpen,
  getTextCaretPositionerMenuOpts,
  getTextCaretPositionerMenuIsOpen,
  getShowOptionsMenuBtn,
  getOptionsMenuOpts,
  getOptionsMenuIsOpen,
  getShowAppHeader,
  getShowAppHeaderToggleBtn,
  getShowAppFooter,
  getShowAppFooterToggleBtn,
};

export default appBarDataSlice.reducer;
