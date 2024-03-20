import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  appearenceMenuOpts: AppearenceMenuOpts;
}

export interface AppBarData {
  appBarRowsCount: number;
  appSettingsMenuOpts: AppSettingsMenuOpts;
}

export interface AppBarSelectors {
  getAppBarRowsCount: Selector<
    {
      appBar: AppBarData;
    },
    number,
    []
  > & {
    unwrapped: (appData: AppBarData) => number;
  };
  getAppSettingsMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    AppSettingsMenuOpts,
    []
  > & {
    unwrapped: (appData: AppBarData) => AppSettingsMenuOpts;
  };
  getAppSettingsMenuIsOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppBarData) => boolean;
  };
  getAppearenceMenuIsOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppBarData) => boolean;
  };
}

export interface AppBarReducers {
  setAppBarRowsCount: ActionCreatorWithPayload<
    number,
    "appBar/setAppBarRowsCount"
  >;
  setAppSettingsMenuOpts: ActionCreatorWithPayload<
    AppSettingsMenuOpts,
    "appBar/setAppSettingsMenuOpts"
  >;
  setAppSettingsMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setAppSettingsMenuIsOpen"
  >;
  setAppearenceMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setAppearenceMenuIsOpen"
  >;
}
