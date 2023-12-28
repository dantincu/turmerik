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
  AppPagesData,
} from "../services/appData";

import { AppConfigData } from "trmrk/src/notes-app-config";

declare type DispatcherType<TPropVal> = (
  state: AppPagesData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppPagesReducer {
  setIsDarkMode: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
  setAppPage: DispatcherType<AppPage>;
  setCurrentIdnf: DispatcherType<string | null>;
}

const reducer = {
  setIsDarkMode: (state, action) => {
    state.isDarkMode = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.isCompactMode = action.payload;
  },
  setAppPage: (state, action) => {
    state.currentAppPage = action.payload;
  },
  setCurrentIdnf: (state, action) => {
    state.currentIdnf = action.payload;
  },
} as AppPagesReducer;

const appPagesSlice = createSlice({
  name: "appPages",
  initialState: {
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      jsonBool.false,
  } as AppPagesData,
  reducers: {
    ...reducer,
  },
});

export const { setIsDarkMode, setAppPage, setCurrentIdnf, setIsCompactMode } =
  appPagesSlice.actions;

export default appPagesSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
