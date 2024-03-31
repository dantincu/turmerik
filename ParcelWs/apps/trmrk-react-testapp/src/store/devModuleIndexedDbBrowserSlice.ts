import {
  createSlice,
  Selector,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";

import { ReducerAction } from "trmrk-react/src/redux/core";

export interface DevModuleIndexedDbBrowserData {
  editDbAddDatastoreReqsCount: number;
}

export interface DevModuleIndexedDbBrowserDataSelectors {
  getEditDbAddDatastoreReqsCount: Selector<
    {
      devModuleIndexedDbBrowser: DevModuleIndexedDbBrowserData;
    },
    number,
    []
  > & {
    unwrapped: (
      devModuleIndexedDbBrowser: DevModuleIndexedDbBrowserData
    ) => number;
  };
}

export interface DevModuleIndexedDbBrowserDataReducers {
  incEditDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/incEditDbAddDatastoreReqsCount"
  >;
  decEditDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/decEditDbAddDatastoreReqsCount"
  >;
  resetEditDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/resetEditDbAddDatastoreReqsCount"
  >;
}

const devModuleIndexedDbBrowserSlice = createSlice({
  name: "devModuleIndexedDbBrowser",
  initialState: {
    editDbAddDatastoreReqsCount: 0,
  } as DevModuleIndexedDbBrowserData,
  reducers: {
    incEditDbAddDatastoreReqsCount: (state, action: ReducerAction<void>) => {
      state.editDbAddDatastoreReqsCount++;
    },
    decEditDbAddDatastoreReqsCount: (state, action: ReducerAction<void>) => {
      state.editDbAddDatastoreReqsCount--;
    },
    resetEditDbAddDatastoreReqsCount: (state, action: ReducerAction<void>) => {
      state.editDbAddDatastoreReqsCount = 0;
    },
  },
  selectors: {
    getEditDbAddDatastoreReqsCount: (appData) =>
      appData.editDbAddDatastoreReqsCount,
  },
});

const {
  incEditDbAddDatastoreReqsCount,
  decEditDbAddDatastoreReqsCount,
  resetEditDbAddDatastoreReqsCount,
} = devModuleIndexedDbBrowserSlice.actions;

const { getEditDbAddDatastoreReqsCount } =
  devModuleIndexedDbBrowserSlice.selectors;

export const devModuleIndexedDbBrowserReducers: DevModuleIndexedDbBrowserDataReducers =
  {
    incEditDbAddDatastoreReqsCount,
    decEditDbAddDatastoreReqsCount,
    resetEditDbAddDatastoreReqsCount,
  };

export const devModuleIndexedDbBrowserSelectors: DevModuleIndexedDbBrowserDataSelectors =
  {
    getEditDbAddDatastoreReqsCount,
  };

export default devModuleIndexedDbBrowserSlice.reducer;
