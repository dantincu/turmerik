import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  appearenceMenuOpts: AppearenceMenuOpts;
}

export interface OptionsMenuOpts {
  isOpen: boolean;
}

export interface AppBarData {
  appBarRowsCount: number;
  appBarHeightRefreshReqsCount: number;
  appBarScrollRefreshReqsCount: number;
  appSettingsMenuOpts: AppSettingsMenuOpts;
  showOptionsMenuBtn: boolean;
  optionsMenuOpts: OptionsMenuOpts;
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
  getAppBarHeightRefreshReqsCount: Selector<
    {
      appBar: AppBarData;
    },
    number,
    []
  > & {
    unwrapped: (appData: AppBarData) => number;
  };
  getAppBarScrollRefreshReqsCount: Selector<
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
  getAppearenceMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    AppearenceMenuOpts,
    []
  > & {
    unwrapped: (appData: AppBarData) => AppearenceMenuOpts;
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
  getShowOptionsMenuBtn: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppBarData) => boolean;
  };
  getOptionsMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    OptionsMenuOpts,
    []
  > & {
    unwrapped: (appData: AppBarData) => OptionsMenuOpts;
  };
  getOptionsMenuIsOpen: Selector<
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
  setAppBarHeightRefreshReqsCount: ActionCreatorWithPayload<
    number,
    "appBar/setAppBarHeightRefreshReqsCount"
  >;
  incAppBarHeightRefreshReqsCount: ActionCreatorWithPayload<
    void,
    "appBar/incAppBarHeightRefreshReqsCount"
  >;
  setAppBarScrollRefreshReqsCount: ActionCreatorWithPayload<
    number,
    "appBar/setAppBarScrollRefreshReqsCount"
  >;
  incAppBarScrollRefreshReqsCount: ActionCreatorWithPayload<
    void,
    "appBar/incAppBarScrollRefreshReqsCount"
  >;
  setAppSettingsMenuOpts: ActionCreatorWithPayload<
    AppSettingsMenuOpts,
    "appBar/setAppSettingsMenuOpts"
  >;
  setAppSettingsMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setAppSettingsMenuIsOpen"
  >;
  setAppearenceMenuOpts: ActionCreatorWithPayload<
    AppearenceMenuOpts,
    "appBar/setAppearenceMenuOpts"
  >;
  setAppearenceMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setAppearenceMenuIsOpen"
  >;
  setShowOptionsMenuBtn: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowOptionsMenuBtn"
  >;
  setOptionsMenuOpts: ActionCreatorWithPayload<
    OptionsMenuOpts,
    "appBar/setOptionsMenuOpts"
  >;
  setOptionsMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setOptionsMenuIsOpen"
  >;
}
