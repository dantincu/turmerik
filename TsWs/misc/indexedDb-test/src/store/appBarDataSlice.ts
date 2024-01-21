import { createSlice } from "@reduxjs/toolkit";

import { AppBarData, AppOptionsMenuOpts } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppBarData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppBarDataReducer {
  setAppOptionsMenuOpts: DispatcherType<AppOptionsMenuOpts>;
  setAppOptionsMenuIsOpen: DispatcherType<boolean>;
}

const reducer = {
  setAppOptionsMenuOpts: (state, action) => {
    state.appOptionsMenuOpts = action.payload;
  },
  setAppOptionsMenuIsOpen: (state, action) => {
    state.appOptionsMenuOpts.isOpen = action.payload;
  },
} as AppBarDataReducer;

const appBarDataSlice = createSlice({
  name: "appBar",
  initialState: {
    appOptionsMenuOpts: {
      isOpen: false,
    },
  } as AppBarData,
  reducers: {
    ...reducer,
  },
});

export const { setAppOptionsMenuIsOpen, setAppOptionsMenuOpts } =
  appBarDataSlice.actions;

export default appBarDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
