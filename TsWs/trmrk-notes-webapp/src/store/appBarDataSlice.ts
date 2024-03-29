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

declare type SelectorType<TPropVal> = ({
  appBar,
}: {
  appBar: AppBarData;
}) => TPropVal;

export interface AppBarDataReducer {
  setShowTabsNavArrows: DispatcherType<boolean>;
  setAppSettingsMenuOpts: DispatcherType<AppSettingsMenuOpts>;
  setAppOptionsMenuOpts: DispatcherType<AppOptionsMenuOpts>;
  setAppSettingsMenuIsOpen: DispatcherType<boolean>;
  setAppearenceMenuIsOpen: DispatcherType<boolean>;
  setAppOptionsMenuIsOpen: DispatcherType<boolean>;
}

export interface AppBarDataSelector {
  getShowTabsNavArrows: SelectorType<boolean>;
  getAppSettingsMenuOpts: SelectorType<AppSettingsMenuOpts>;
  getAppOptionsMenuOpts: SelectorType<AppOptionsMenuOpts>;
  getAppSettingsMenuIsOpen: SelectorType<boolean>;
  getAppearenceMenuIsOpen: SelectorType<boolean>;
  getAppOptionsMenuIsOpen: SelectorType<boolean>;
}

const reducer = {
  setShowTabsNavArrows: (state, action) => {
    state.showTabsNavArrows = action.payload;
  },
  setAppSettingsMenuOpts: (state, action) => {
    state.appSettingsMenuOpts = action.payload;
  },
  setAppOptionsMenuOpts: (state, action) => {
    state.appOptionsMenuOpts = action.payload;
  },
  setAppSettingsMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = false;
    state.appSettingsMenuOpts.isOpen = action.payload;
  },
  setAppearenceMenuIsOpen: (state, action) => {
    state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = action.payload;
  },
  setAppOptionsMenuIsOpen: (state, action) => {
    state.appOptionsMenuOpts.isOpen = action.payload;
  },
} as AppBarDataReducer;

const selector = {
  getShowTabsNavArrows: ({ appBar }) => appBar.showTabsNavArrows,
  getAppSettingsMenuOpts: ({ appBar }) => appBar.appSettingsMenuOpts,
  getAppOptionsMenuOpts: ({ appBar }) => appBar.appOptionsMenuOpts,
  getAppSettingsMenuIsOpen: ({ appBar }) => appBar.appSettingsMenuOpts.isOpen,
  getAppearenceMenuIsOpen: ({ appBar }) =>
    appBar.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
  getAppOptionsMenuIsOpen: ({ appBar }) => appBar.appOptionsMenuOpts.isOpen,
} as AppBarDataSelector;

const appBarDataSlice = createSlice({
  name: "appBar",
  initialState: {
    showTabsNavArrows: false,
    appSettingsMenuOpts: {
      isOpen: false,
      appearenceMenuOpts: {
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
  setShowTabsNavArrows,
  setAppOptionsMenuIsOpen,
  setAppOptionsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppSettingsMenuOpts,
  setAppearenceMenuIsOpen,
} = appBarDataSlice.actions;

export const {
  getShowTabsNavArrows,
  getAppOptionsMenuIsOpen,
  getAppOptionsMenuOpts,
  getAppSettingsMenuIsOpen,
  getAppSettingsMenuOpts,
  getAppearenceMenuIsOpen,
} = selector;

export default appBarDataSlice.reducer;

export type Dispatcher<TPropVal> = DispatcherType<TPropVal>;
