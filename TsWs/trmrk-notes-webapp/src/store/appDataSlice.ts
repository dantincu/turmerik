import { createSlice } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import { localStorageKeys } from "../services/utils";
import { AppData } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

declare type SelectorType<TPropVal> = ({
  appData,
}: {
  appData: AppData;
}) => TPropVal;

export interface AppDataReducer {
  setAppBarHeight: DispatcherType<number | null>;
  setShowAppBar: DispatcherType<boolean>;
  setShowAppBarToggleBtn: DispatcherType<boolean>;
  setIsDarkMode: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
}

export interface AppDataSelector {
  getAppBarHeight: SelectorType<number | null>;
  getShowAppBar: SelectorType<boolean>;
  getShowAppBarToggleBtn: SelectorType<boolean>;
  getIsDarkMode: SelectorType<boolean>;
  getIsCompactMode: SelectorType<boolean>;
}

const reducer = {
  setAppBarHeight: (state, action) => {
    state.appBarHeight = action.payload;
  },
  setShowAppBar: (state, action) => {
    state.showAppBar = action.payload;
  },
  setShowAppBarToggleBtn: (state, action) => {
    state.showAppBarToggleBtn = action.payload;
  },
  setIsDarkMode: (state, action) => {
    state.isDarkMode = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.isCompactMode = action.payload;
  },
} as AppDataReducer;

const selector = {
  getAppBarHeight: ({ appData }) => appData.appBarHeight,
  getShowAppBar: ({ appData }) => appData.showAppBar,
  getShowAppBarToggleBtn: ({ appData }) => appData.showAppBarToggleBtn,
  getIsDarkMode: ({ appData }) => appData.isDarkMode,
  getIsCompactMode: ({ appData }) => appData.isCompactMode,
} as AppDataSelector;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
    appBarHeight: null,
    showAppBar: true,
    showAppBarToggleBtn: true,
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      trmrk.jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      trmrk.jsonBool.false,
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const {
  setAppBarHeight,
  setShowAppBar,
  setShowAppBarToggleBtn,
  setIsDarkMode,
  setIsCompactMode,
} = appDataSlice.actions;

export const {
  getAppBarHeight,
  getIsCompactMode,
  getIsDarkMode,
  getShowAppBar,
  getShowAppBarToggleBtn,
} = selector;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
