import { createSlice } from "@reduxjs/toolkit";
import { ReducerAction } from "../../trmrk-react/redux/core";

import {
  AppDataSelectors,
  AppDataReducers,
  getInitialState,
} from "../../trmrk-react/redux/appData";

const appDataSlice = createSlice({
  name: "appData",
  initialState: getInitialState(),
  reducers: {
    setCurrentUrlPath: (state, action: ReducerAction<string>) => {
      state.currentUrlPath = action.payload;
    },
    setIsDarkMode: (state, action: ReducerAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsCompactMode: (state, action: ReducerAction<boolean>) => {
      state.isCompactMode = action.payload;
    },
  },
  selectors: {
    getBaseLocation: (appData) => appData.baseLocation,
    getCurrentUrlPath: (appData) => appData.currentUrlPath,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
  },
});

const { setCurrentUrlPath, setIsCompactMode, setIsDarkMode } =
  appDataSlice.actions;

const { getBaseLocation, getCurrentUrlPath, getIsCompactMode, getIsDarkMode } =
  appDataSlice.selectors;

export const appDataReducers: AppDataReducers = {
  setCurrentUrlPath,
  setIsCompactMode,
  setIsDarkMode,
};

export const appDataSelectors: AppDataSelectors = {
  getBaseLocation,
  getCurrentUrlPath,
  getIsCompactMode,
  getIsDarkMode,
};

export default appDataSlice.reducer;
