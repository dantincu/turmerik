import { createSlice } from "@reduxjs/toolkit";

import { AppTab, AppTabsData } from "../services/appData";

declare type DispatcherType<TPropVal> = (
  state: AppTabsData,
  action: {
    type: string;
    payload: TPropVal;
  }
) => void;

declare type SelectorType<TPropVal> = ({
  appTabs,
}: {
  appTabs: AppTabsData;
}) => TPropVal;

export interface AppTabsReducer {
  setCurrentTab: DispatcherType<string>;
  closeTab: DispatcherType<string>;
  addTab: DispatcherType<AppTab>;
  setTabsOrder: DispatcherType<string[]>;
}

export interface AppTabsSelector {
  getOpenTabs: SelectorType<AppTab[]>;
}

const selector = {
  getOpenTabs: ({ appTabs }) => appTabs.openTabs,
} as AppTabsSelector;

const reducer = {
  setCurrentTab: (state, action) => {
    for (let tab of state.openTabs) {
      tab.isCurrent = tab.tabUuid === action.payload;
    }
  },
  closeTab: (state, action) => {
    const tabUuid = action.payload;
    const idx = state.openTabs.findIndex((tab) => tab.tabUuid === tabUuid);

    if (idx >= 0) {
      state.openTabs.splice(idx, 1);
    } else {
      throw new Error(`Found no tab matching uuid ${tabUuid}`);
    }
  },
  addTab: (state, action) => {
    const newTab = action.payload;

    if (newTab.isCurrent) {
      for (let tab of state.openTabs) {
        tab.isCurrent = false;
      }
    }

    state.openTabs.push(newTab);
  },
  setTabsOrder: (state, action) => {
    const newTabsArr = action.payload.map((uuid) => {
      const matchingTab = state.openTabs.find((tab) => tab.tabUuid === uuid);

      if (!matchingTab) {
        throw new Error(`Found no tab matching uuid ${uuid}`);
      }

      return matchingTab;
    });

    state.openTabs = newTabsArr;
  },
} as AppTabsReducer;

const appTabsSlice = createSlice({
  name: "appTabs",
  initialState: {
    openTabs: [],
  } as AppTabsData,
  reducers: {
    ...reducer,
  },
});

export const { addTab, closeTab, setCurrentTab, setTabsOrder } =
  appTabsSlice.actions;

export const { getOpenTabs } = selector;

export default appTabsSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
