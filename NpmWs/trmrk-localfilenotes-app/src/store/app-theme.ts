import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";

import { AppThemeMode, appThemesMap } from "../services/app-theme/app-theme";

const initialState = {
  isDarkMode: false,
} as AppThemeMode;

export const setDarkMode = createAction<boolean>("appTheme/setDarkMode");

export const appThemeReducer = createReducer(initialState, (builder) => {
  builder.addCase(setDarkMode, (state, action) => {
    state.isDarkMode = action.payload;
  });
});

const selectSelf = (state: AppThemeMode) => state;
export const getDarkMode = createSelector(selectSelf, (state) => state);
