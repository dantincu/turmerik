import { createSlice } from "@reduxjs/toolkit";

import { core as trmrk } from "trmrk";

import { localStorageKeys, jsonBool } from "../services/utils";

import {
  AppBarData,
  AppBarOpts,
  AppData,
  AppOptionsMenuOpts,
  AppPage,
  AppSettingsMenuOpts,
} from "../services/appData";

import { AppConfigData } from "trmrk/src/notes-app-config";

declare type DispatcherType<TPropVal> = (
  state: AppBarData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppBarDataReducer {
  setAppBarOpts: DispatcherType<AppBarOpts>;
  setFloatingBarTopHeightEm: DispatcherType<number>;
  setUpdateFloatingBarTopOffset: DispatcherType<boolean>;
  setAppSettingsMenuOpts: DispatcherType<AppSettingsMenuOpts>;
  setAppOptionsMenuOpts: DispatcherType<AppOptionsMenuOpts>;
  setAppSettingsMenuIsOpen: DispatcherType<boolean>;
  setAppThemeMenuIsOpen: DispatcherType<boolean>;
  setAppOptionsMenuIsOpen: DispatcherType<boolean>;
}

const reducer = {
  setAppBarOpts: (state, action) => {
    state.appBarOpts = action.payload;
  },
  setFloatingBarTopHeightEm: (state, action) => {
    state.floatingAppBarHeightEm = action.payload;
  },
  setUpdateFloatingBarTopOffset: (state, action) => {
    state.updateFloatingBarTopOffset = action.payload;
  },
  setAppSettingsMenuOpts: (state, action) => {
    state.appSettingsMenuOpts = action.payload;
  },
  setAppOptionsMenuOpts: (state, action) => {
    state.appOptionsMenuOpts = action.payload;
  },
  setAppSettingsMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appThemeMenuOpts.isOpen = false;
    state.appSettingsMenuOpts.isOpen = action.payload;
  },
  setAppThemeMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appThemeMenuOpts.isOpen = action.payload;
  },
  setAppOptionsMenuIsOpen: (state, action) => {
    state.appOptionsMenuOpts.isOpen = action.payload;
  },
} as AppBarDataReducer;

const appBarDataSlice = createSlice({
  name: "appBarData",
  initialState: {
    appBarOpts: {},
    floatingAppBarHeightEm: 2,
    updateFloatingBarTopOffset: true,
    appSettingsMenuOpts: {
      isOpen: false,
      appThemeMenuOpts: {
        isOpen: false,
      },
    },
    appOptionsMenuOpts: {
      isOpen: false,
    },
  } as AppBarData,
  reducers: {
    ...reducer,
  },
});

export const {
  setAppBarOpts,
  setAppOptionsMenuIsOpen,
  setAppOptionsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppSettingsMenuOpts,
  setAppThemeMenuIsOpen,
  setFloatingBarTopHeightEm,
  setUpdateFloatingBarTopOffset,
} = appBarDataSlice.actions;

export default appBarDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
