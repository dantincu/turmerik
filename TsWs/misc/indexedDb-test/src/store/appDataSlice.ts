import { createSlice } from "@reduxjs/toolkit";

import { AppRouteInfo, AppData } from "../services/appData";

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
  setCurrentRoute: DispatcherType<AppRouteInfo>;
  setCurrentRoutePathName: DispatcherType<string>;
}

export interface AppDataSelector {
  getCurrentRoute: SelectorType<AppRouteInfo>;
  getCurrentRoutePathName: SelectorType<string>;
}

const reducer = {
  setCurrentRoute: (state, action) => {
    state.currentRoute = action.payload;
  },
  setCurrentRoutePathName: (state, action) => {
    state.currentRoute.pathname = action.payload;
  },
} as AppDataReducer;

const selector = {
  getCurrentRoute: ({ appData }) => appData.currentRoute,
  getCurrentRoutePathName: ({ appData }) => appData.currentRoute.pathname,
} as AppDataSelector;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    currentRoute: {
      pathname: "/",
    },
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const { setCurrentRoute, setCurrentRoutePathName } =
  appDataSlice.actions;

export const { getCurrentRoute, getCurrentRoutePathName } = selector;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
