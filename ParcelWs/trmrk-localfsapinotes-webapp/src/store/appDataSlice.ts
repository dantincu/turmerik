import { createSlice } from "@reduxjs/toolkit";

import { core as trmrk } from "trmrk";

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
  setIsDarkMode: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
  setHasFsApiRootDirHandle: DispatcherType<boolean>;
}

const reducer = {
  setIsDarkMode: (state, action) => {
    state.isDarkMode = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.isCompactMode = action.payload;
  },
  setHasFsApiRootDirHandle: (state, action) => {
    state.hasFsApiRootDirHandle = action.payload;
  },
} as AppDataReducer;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      jsonBool.false,
    hasFsApiRootDirHandle: false,
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const { setIsDarkMode, setIsCompactMode, setHasFsApiRootDirHandle } =
  appDataSlice.actions;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
