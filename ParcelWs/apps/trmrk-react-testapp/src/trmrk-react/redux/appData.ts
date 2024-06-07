import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

import trmrk from "../../trmrk";
import trmrk_dom_utils from "../../trmrk-browser/domUtils";

import {
  TextCaretPositionerOptsCore,
  TextCaretPositionerSize,
  TextCaretPositionerViewPortOffset,
  TrmrkTextCaretPositionerOpts,
  deserializeTextCaretPositionerOptsFromLocalStorage,
  serializeTextCaretPositionerOptsToLocalStorage,
} from "../../trmrk-browser/textCaretPositioner/core";

export interface TextCaretPositionerOpts extends TextCaretPositionerOptsCore {
  currentInputElLastSetOpIdx: number;
}

export interface AppData {
  baseLocation: string;
  currentUrlPath: string;
  isDarkMode: boolean;
  isCompactMode: boolean;
  textCaretPositionerOpts: TextCaretPositionerOpts;
}

export interface AppDataSelectors {
  getBaseLocation: Selector<
    {
      appData: AppData;
    },
    string,
    []
  > & {
    unwrapped: (appData: AppData) => string;
  };
  getCurrentUrlPath: Selector<
    {
      appData: AppData;
    },
    string,
    []
  > & {
    unwrapped: (appData: AppData) => string;
  };
  getIsCompactMode: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getIsDarkMode: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getTextCaretPositionerOpts: Selector<
    {
      appData: AppData;
    },
    TextCaretPositionerOpts,
    []
  > & {
    unwrapped: (appData: AppData) => TextCaretPositionerOpts;
  };
  getTextCaretPositionerEnabled: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getTextCaretPositionerKeepOpen: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getTextCaretPositionerMinimized: Selector<
    {
      appData: AppData;
    },
    boolean,
    []
  > & {
    unwrapped: (appData: AppData) => boolean;
  };
  getTextCaretPositionerCurrentInputElLastSetOpIdx: Selector<
    {
      appData: AppData;
    },
    number,
    []
  > & {
    unwrapped: (appData: AppData) => number;
  };
  getTextCaretPositionerSize: Selector<
    {
      appData: AppData;
    },
    TextCaretPositionerSize,
    []
  > & {
    unwrapped: (appData: AppData) => TextCaretPositionerSize;
  };
  getTextCaretPositionerWidth: Selector<
    {
      appData: AppData;
    },
    number | null | undefined,
    []
  > & {
    unwrapped: (appData: AppData) => number | null | undefined;
  };
  getTextCaretPositionerHeight: Selector<
    {
      appData: AppData;
    },
    number | null | undefined,
    []
  > & {
    unwrapped: (appData: AppData) => number | null | undefined;
  };
  getTextCaretPositionerViewPortOffset: Selector<
    {
      appData: AppData;
    },
    TextCaretPositionerViewPortOffset,
    []
  > & {
    unwrapped: (appData: AppData) => TextCaretPositionerViewPortOffset;
  };
  getTextCaretPositionerViewPortOffsetTop: Selector<
    {
      appData: AppData;
    },
    number | null | undefined,
    []
  > & {
    unwrapped: (appData: AppData) => number | null | undefined;
  };
  getTextCaretPositionerViewPortOffsetLeft: Selector<
    {
      appData: AppData;
    },
    number | null | undefined,
    []
  > & {
    unwrapped: (appData: AppData) => number | null | undefined;
  };
}

export interface AppDataReducers {
  setCurrentUrlPath: ActionCreatorWithPayload<
    string,
    "appData/setCurrentUrlPath"
  >;
  setIsCompactMode: ActionCreatorWithPayload<
    boolean,
    "appData/setIsCompactMode"
  >;
  setIsDarkMode: ActionCreatorWithPayload<boolean, "appData/setIsDarkMode">;
  setTextCaretPositionerEnabled: ActionCreatorWithPayload<
    boolean,
    "appData/setTextCaretPositionerEnabled"
  >;
  setTextCaretPositionerKeepOpen: ActionCreatorWithPayload<
    boolean,
    "appData/setTextCaretPositionerKeepOpen"
  >;
  setTextCaretPositionerMinimized: ActionCreatorWithPayload<
    boolean,
    "appData/setTextCaretPositionerMinimized"
  >;
  setTextCaretPositionerOpts: ActionCreatorWithPayload<
    TextCaretPositionerOpts,
    "appData/setTextCaretPositionerOpts"
  >;
  incTextCaretPositionerCurrentInputElLastSetOpIdx: ActionCreatorWithPayload<
    void,
    "appData/incTextCaretPositionerCurrentInputElLastSetOpIdx"
  >;
  setTextCaretPositionerSize: ActionCreatorWithPayload<
    TextCaretPositionerSize,
    "appData/setTextCaretPositionerSize"
  >;
  setTextCaretPositionerWidth: ActionCreatorWithPayload<
    number | null | undefined,
    "appData/setTextCaretPositionerWidth"
  >;
  setTextCaretPositionerHeight: ActionCreatorWithPayload<
    number | null | undefined,
    "appData/setTextCaretPositionerHeight"
  >;
  setTextCaretPositionerViewPortOffset: ActionCreatorWithPayload<
    TextCaretPositionerViewPortOffset,
    "appData/setTextCaretPositionerViewPortOffset"
  >;
  setTextCaretPositionerViewPortOffsetTop: ActionCreatorWithPayload<
    number | null | undefined,
    "appData/setTextCaretPositionerViewPortOffsetTop"
  >;
  setTextCaretPositionerViewPortOffsetLeft: ActionCreatorWithPayload<
    number | null | undefined,
    "appData/setTextCaretPositionerViewPortOffsetLeft"
  >;
}

export const getTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  const textCaretPositionerOptsSrlzbl =
    deserializeTextCaretPositionerOptsFromLocalStorage(
      textCaretPositionerOptsKey,
      { value: null }
    ) ?? {
      enabled: false,
      keepOpen: false,
      minimized: false,
      viewPortOffset: {
        top: null,
        left: null,
      },
      size: {
        width: null,
        height: null,
      },
    };

  const textCaretPositionerOpts: TextCaretPositionerOpts = {
    ...textCaretPositionerOptsSrlzbl,
    currentInputElLastSetOpIdx: 0,
  };

  return textCaretPositionerOpts;
};

export const setTextCaretPositionerOptsToLocalStorage = (
  textCaretPositionerOpts: TextCaretPositionerOpts | null,
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  let textCaretPositionerOptsSrlzbl: TrmrkTextCaretPositionerOpts | null = null;

  if (textCaretPositionerOpts) {
    textCaretPositionerOptsSrlzbl = {
      ...textCaretPositionerOpts,
    };
  }

  serializeTextCaretPositionerOptsToLocalStorage(
    textCaretPositionerOptsSrlzbl,
    textCaretPositionerOptsKey
  );
};

export const getInitialState = (): AppData => ({
  baseLocation: trmrk.url.getBaseLocation(),
  currentUrlPath: "/",
  isDarkMode: trmrk_dom_utils.isDarkMode(),
  isCompactMode: trmrk_dom_utils.isCompactMode(),
  textCaretPositionerOpts: getTextCaretPositionerOptsFromLocalStorage(),
});
