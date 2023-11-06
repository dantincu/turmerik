import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";

import { AppConfig, AppConfigData } from "../services/settings/app-config";

const initialState = {
  loaded: false,
} as AppConfig;

export const setAppConfig = createAction<AppConfigData>("appConfig/setData");

export const appConfigReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAppConfig, (state, action) => {
    state.data = action.payload;
    state.loaded = true;
  });
});

const selectSelf = (state: AppConfig) => state;
export const getAppConfig = createSelector(selectSelf, (state) => state);
