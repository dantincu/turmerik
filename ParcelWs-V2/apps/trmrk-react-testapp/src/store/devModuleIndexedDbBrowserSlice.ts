import {
  createSlice,
  Selector,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";

import { ReducerAction } from "trmrk-react/src/redux/core";

export interface DevModuleIndexedDbBrowserData {
  createDbAddDatastoreReqsCount: number;
}

export interface DevModuleIndexedDbBrowserDataSelectors {
  getCreateDbAddDatastoreReqsCount: Selector<
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
  incCreateDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/incCreateDbAddDatastoreReqsCount"
  >;
  decCreateDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/decCreateDbAddDatastoreReqsCount"
  >;
  resetCreateDbAddDatastoreReqsCount: ActionCreatorWithPayload<
    void,
    "devModuleIndexedDbBrowser/resetCreateDbAddDatastoreReqsCount"
  >;
}

const devModuleIndexedDbBrowserSlice = createSlice({
  name: "devModuleIndexedDbBrowser",
  initialState: {
    createDbAddDatastoreReqsCount: 0,
  } as DevModuleIndexedDbBrowserData,
  reducers: {
    incCreateDbAddDatastoreReqsCount: (state, action: ReducerAction<void>) => {
      state.createDbAddDatastoreReqsCount++;
    },
    decCreateDbAddDatastoreReqsCount: (state, action: ReducerAction<void>) => {
      state.createDbAddDatastoreReqsCount--;
    },
    resetCreateDbAddDatastoreReqsCount: (
      state,
      action: ReducerAction<void>
    ) => {
      state.createDbAddDatastoreReqsCount = 0;
    },
  },
  selectors: {
    getCreateDbAddDatastoreReqsCount: (appData) =>
      appData.createDbAddDatastoreReqsCount,
  },
});

const {
  incCreateDbAddDatastoreReqsCount,
  decCreateDbAddDatastoreReqsCount,
  resetCreateDbAddDatastoreReqsCount,
} = devModuleIndexedDbBrowserSlice.actions;

const { getCreateDbAddDatastoreReqsCount } =
  devModuleIndexedDbBrowserSlice.selectors;

export const devModuleIndexedDbBrowserReducers: DevModuleIndexedDbBrowserDataReducers =
  {
    incCreateDbAddDatastoreReqsCount,
    decCreateDbAddDatastoreReqsCount,
    resetCreateDbAddDatastoreReqsCount,
  };

export const devModuleIndexedDbBrowserSelectors: DevModuleIndexedDbBrowserDataSelectors =
  {
    getCreateDbAddDatastoreReqsCount,
  };

export default devModuleIndexedDbBrowserSlice.reducer;
