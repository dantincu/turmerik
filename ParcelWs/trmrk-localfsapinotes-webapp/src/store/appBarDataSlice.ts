import { createSlice } from "@reduxjs/toolkit";

import {
  AppBarData,
  AppOptionsMenuOpts,
  AppSettingsMenuOpts,
} from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppBarData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppBarDataReducer {
  setAppSettingsMenuOpts: DispatcherType<AppSettingsMenuOpts>;
  setAppOptionsMenuOpts: DispatcherType<AppOptionsMenuOpts>;
  setAppSettingsMenuIsOpen: DispatcherType<boolean>;
  setAppThemeMenuIsOpen: DispatcherType<boolean>;
  setAppOptionsMenuIsOpen: DispatcherType<boolean>;
}

const reducer = {
  setAppSettingsMenuOpts: (state, action) => {
    state.appSettingsMenuOpts = action.payload;
  },
  setAppOptionsMenuOpts: (state, action) => {
    state.appOptionsMenuOpts = action.payload;
  },
  setAppSettingsMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appThemeMenuOpts.isOpen = false;
    state.appSettingsMenuOpts.isOpen = action.payload;
  },
  setAppThemeMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appThemeMenuOpts.isOpen = action.payload;
  },
  setAppOptionsMenuIsOpen: (state, action) => {
    state.appOptionsMenuOpts.isOpen = action.payload;
  },
} as AppBarDataReducer;

const appBarDataSlice = createSlice({
  name: "appBarData",
  initialState: {
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
  reducers: {
    ...reducer,
  },
});

export const {
  setAppOptionsMenuIsOpen,
  setAppOptionsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppSettingsMenuOpts,
  setAppThemeMenuIsOpen,
} = appBarDataSlice.actions;

export default appBarDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
