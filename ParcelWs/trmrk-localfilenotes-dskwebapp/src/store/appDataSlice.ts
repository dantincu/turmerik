import { createSlice } from "@reduxjs/toolkit";

import { core as trmrk } from "trmrk";

import { AppData } from "../services/appData";
import { AppConfigData } from "trmrk/src/notes-app-config";

declare type DispatcherType<TPropVal> = (
  state: AppData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppDataReducer {
  setAppConfig: DispatcherType<AppConfigData>;
}

const reducer = {
  setAppConfig: (state, action) => {
    state.appConfig = action.payload;
  },
} as AppDataReducer;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    baseLocation: trmrk.url.getBaseLocation(),
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const { setAppConfig } = appDataSlice.actions;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
