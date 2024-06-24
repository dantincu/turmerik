import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface TextCaretPositionerMenuOpts {
  isOpen: boolean;
}

export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  textCaretPositionerMenuOpts: TextCaretPositionerMenuOpts;
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
  showAppHeaderToggleBtn: boolean;
  showAppFooter: boolean;
  showAppFooterToggleBtn: boolean;
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
  getTextCaretPositionerMenuOpts: Selector<
    {
      appBar: AppBarData;
    },
    TextCaretPositionerMenuOpts,
    []
  > & {
    unwrapped: (appBar: AppBarData) => TextCaretPositionerMenuOpts;
  };
  getTextCaretPositionerMenuIsOpen: Selector<
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
  setTextCaretPositionerMenuOpts: ActionCreatorWithPayload<
    TextCaretPositionerMenuOpts,
    "appBar/setTextCaretPositionerMenuOpts"
  >;
  setTextCaretPositionerMenuIsOpen: ActionCreatorWithPayload<
    boolean,
    "appBar/setTextCaretPositionerMenuIsOpen"
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
  setShowAppHeaderToggleBtn: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppHeaderToggleBtn"
  >;
  setShowAppFooter: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppFooter"
  >;
  setShowAppFooterToggleBtn: ActionCreatorWithPayload<
    boolean,
    "appBar/setShowAppFooterToggleBtn"
  >;
}
