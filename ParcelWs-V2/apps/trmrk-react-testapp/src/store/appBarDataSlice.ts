import { createSlice } from "@reduxjs/toolkit";

import { ReducerAction } from "trmrk-react/src/redux/core";
import { AppBarData, AppSettingsMenuOpts } from "../services/appBarData";

const appBarDataSlice = createSlice({
  name: "appData",
  initialState: {
    appSettingsMenuOpts: {
      isOpen: false,
      appearenceMenuOpts: {
        isOpen: false,
      },
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
    setAppearenceMenuIsOpen: (state, action: ReducerAction<boolean>) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = action.payload;
    },
  },
  selectors: {
    getAppSettingsMenuOpts: (state) => state.appSettingsMenuOpts,
    getAppSettingsMenuIsOpen: (state) => state.appSettingsMenuOpts.isOpen,
    getAppearenceMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
  },
});

const {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuIsOpen,
} = appBarDataSlice.actions;

const {
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuIsOpen,
} = appBarDataSlice.selectors;

export const appBarReducers = {
  setAppSettingsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppearenceMenuIsOpen,
};

export const appBarSelectors = {
  getAppSettingsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppearenceMenuIsOpen,
};

export default appBarDataSlice.reducer;
