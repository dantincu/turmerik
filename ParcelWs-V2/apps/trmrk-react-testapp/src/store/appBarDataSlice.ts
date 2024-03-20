import { createSlice } from "@reduxjs/toolkit";

import { ReducerAction } from "trmrk-react/src/redux/core";
import {
  AppBarData,
  AppSettingsMenuOpts,
  AppBarReducers,
  AppBarSelectors,
} from "trmrk-react/src/redux/appBarData";

const appBarDataSlice = createSlice({
  name: "appBar",
  initialState: {
    appBarRowsCount: 1,
    appSettingsMenuOpts: {
      isOpen: false,
      appearenceMenuOpts: {
        isOpen: false,
      },
    },
  } as AppBarData,
  reducers: {
    setAppBarRowsCount: (state, action: ReducerAction<number>) => {
      state.appBarRowsCount = action.payload;
    },
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
    setAppearenceMenuIsOpen: (state, action: ReducerAction<boolean>) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = action.payload;
    },
  },
  selectors: {
    getAppBarRowsCount: (state) => state.appBarRowsCount,
    getAppSettingsMenuOpts: (state) => state.appSettingsMenuOpts,
    getAppSettingsMenuIsOpen: (state) => state.appSettingsMenuOpts.isOpen,
    getAppearenceMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
  },
});

const {
  setAppBarRowsCount,
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuIsOpen,
} = appBarDataSlice.actions;

const {
  getAppBarRowsCount,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuIsOpen,
} = appBarDataSlice.selectors;

export const appBarReducers: AppBarReducers = {
  setAppBarRowsCount,
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuIsOpen,
};

export const appBarSelectors: AppBarSelectors = {
  getAppBarRowsCount,
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuIsOpen,
};

export default appBarDataSlice.reducer;
