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
  appSettingsMenuOpts: AppSettingsMenuOpts;
  showOptionsMenuBtn: boolean;
  optionsMenuOpts: OptionsMenuOpts;
  showAppHeader: boolean;
  showAppHeaderOverride: boolean | null;
  showAppHeaderToggleBtn: boolean;
  showAppFooter: boolean;
  showAppFooterToggleBtn: boolean;
  showAppFooterOverride: boolean | null;
}

export interface AppBarSelectors {
  isAnyMenuOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getAppSettingsMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    AppSettingsMenuOpts,
    []
  > & {
    unwrapped: (appBar: AppBarData) => AppSettingsMenuOpts;
  };
  getAppSettingsMenuIsOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getAppearenceMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    AppearenceMenuOpts,
    []
  > & {
    unwrapped: (appBar: AppBarData) => AppearenceMenuOpts;
  };
  getAppearenceMenuIsOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getShowOptionsMenuBtn: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getOptionsMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    OptionsMenuOpts,
    []
  > & {
    unwrapped: (appBar: AppBarData) => OptionsMenuOpts;
  };
  getOptionsMenuIsOpen: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getShowAppHeader: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getShowAppHeaderOverride: Selector<
    {
      appBar: AppBarData;
    },
    boolean | null,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean | null;
  };
  getShowAppHeaderToggleBtn: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getShowAppFooter: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
  getShowAppFooterOverride: Selector<
    {
      appBar: AppBarData;
    },
    boolean | null,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean | null;
  };
  getShowAppFooterToggleBtn: Selector<
    {
      appBar: AppBarData;
    },
    boolean,
    []
  > & {
    unwrapped: (appBar: AppBarData) => boolean;
  };
}

export interface AppBarReducers {
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
  setShowAppHeader: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppHeader"
  >;
  setShowAppHeaderOverride: ActionCreatorWithPayload<
    boolean | null,
    "appBar/setShowAppHeaderOverride"
  >;
  setShowAppHeaderToggleBtn: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppHeaderToggleBtn"
  >;
  setShowAppFooter: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppFooter"
  >;
  setShowAppFooterOverride: ActionCreatorWithPayload<
    boolean | null,
    "appBar/setShowAppFooterOverride"
  >;
  setShowAppFooterToggleBtn: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppFooterToggleBtn"
  >;
}
