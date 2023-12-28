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
  state: AppData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppDataReducer {
  setIsDarkMode: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
  setAppConfig: DispatcherType<AppConfigData>;
  setAppPage: DispatcherType<AppPage>;
  setCurrentIdnf: DispatcherType<string | null>;
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
  setIsDarkMode: (state, action) => {
    state.appPages.isDarkMode = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.appPages.isCompactMode = action.payload;
  },
  setAppConfig: (state, action) => {
    state.appConfig = action.payload;
  },
  setAppPage: (state, action) => {
    state.appPages.currentAppPage = action.payload;
  },
  setCurrentIdnf: (state, action) => {
    state.appPages.currentIdnf = action.payload;
  },
  setAppBarOpts: (state, action) => {
    state.appBarData.appBarOpts = action.payload;
  },
  setFloatingBarTopHeightEm: (state, action) => {
    state.appBarData.floatingAppBarHeightEm = action.payload;
  },
  setUpdateFloatingBarTopOffset: (state, action) => {
    state.appBarData.updateFloatingBarTopOffset = action.payload;
  },
  setAppSettingsMenuOpts: (state, action) => {
    state.appBarData.appSettingsMenuOpts = action.payload;
  },
  setAppOptionsMenuOpts: (state, action) => {
    state.appBarData.appOptionsMenuOpts = action.payload;
  },
  setAppSettingsMenuIsOpen: (state, action) => {
    state.appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen = false;
    state.appBarData.appSettingsMenuOpts.isOpen = action.payload;
  },
  setAppThemeMenuIsOpen: (state, action) => {
    state.appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen =
      action.payload;
  },
  setAppOptionsMenuIsOpen: (state, action) => {
    state.appBarData.appOptionsMenuOpts.isOpen = action.payload;
  },
} as AppDataReducer;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    appPages: {
      isDarkMode:
        localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
        jsonBool.true,
      isCompactMode:
        localStorage.getItem(localStorageKeys.appIsCompactMode) !==
        jsonBool.false,
    },
    appBarData: {
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
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const {
  setIsDarkMode,
  setIsCompactMode,
  setAppConfig,
  setCurrentIdnf,
  setAppBarOpts,
  setAppPage,
  setFloatingBarTopHeightEm,
  setUpdateFloatingBarTopOffset,
  setAppSettingsMenuOpts,
  setAppOptionsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppThemeMenuIsOpen,
  setAppOptionsMenuIsOpen,
} = appDataSlice.actions;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
