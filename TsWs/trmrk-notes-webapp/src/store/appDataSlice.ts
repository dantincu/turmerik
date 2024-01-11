import { createSlice } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import { localStorageKeys, jsonBool } from "../services/utils";
import { AppData } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppDataReducer {
  setAppBarHeight: DispatcherType<number | null>;
  setShowAppBar: DispatcherType<boolean>;
  setIsDarkMode: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
  setHasFilesRootLocation: DispatcherType<boolean>;
  setHasNotesRootLocation: DispatcherType<boolean>;
  setUseIndexedDbForStorage: DispatcherType<boolean>;
}

const reducer = {
  setAppBarHeight: (state, action) => {
    state.appBarHeight = action.payload;
  },
  setShowAppBar: (state, action) => {
    state.showAppBar = action.payload;
  },
  setIsDarkMode: (state, action) => {
    state.isDarkMode = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.isCompactMode = action.payload;
  },
  setHasFilesRootLocation: (state, action) => {
    state.hasFilesRootLocation = action.payload;
  },
  setHasNotesRootLocation: (state, action) => {
    state.hasNotesRootLocation = action.payload;
  },
  setUseIndexedDbForStorage: (state, action) => {
    state.useIndexedDbForStorage = action.payload;
  },
} as AppDataReducer;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    appBarHeight: null,
    showAppBar: true,
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      jsonBool.false,
    hasFilesRootLocation: false,
    hasNotesRootLocation: false,
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const {
  setAppBarHeight,
  setShowAppBar,
  setIsDarkMode,
  setIsCompactMode,
  setHasFilesRootLocation,
  setHasNotesRootLocation,
  setUseIndexedDbForStorage,
} = appDataSlice.actions;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
