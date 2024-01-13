import { createSlice } from "@reduxjs/toolkit";

import { AppData } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

export interface AppDataReducer {
  setShowAppBar: DispatcherType<boolean>;
  setIsCompactMode: DispatcherType<boolean>;
}

const reducer = {
  setShowAppBar: (state, action) => {
    state.showAppBar = action.payload;
  },
  setIsCompactMode: (state, action) => {
    state.isCompactMode = action.payload;
  },
} as AppDataReducer;

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    showAppBar: true,
    isCompactMode: true,
  } as AppData,
  reducers: {
    ...reducer,
  },
});

export const {
  setShowAppBar,
  setIsCompactMode,
} = appDataSlice.actions;

export default appDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
