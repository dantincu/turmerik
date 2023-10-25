import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";

import {
  AppSettings,
  AppSettingsData,
} from "../services/settings/app-settings";

const initialState = {
  loaded: false,
} as AppSettings;

export const setAppSettings = createAction<AppSettingsData>(
  "appSettings/setData"
);

export const appSettingsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAppSettings, (state, action) => {
    state.data = action.payload;
    state.loaded = true;
  });
});

const selectSelf = (state: AppSettings) => state;
export const getAppSettings = createSelector(selectSelf, (state) => state);
