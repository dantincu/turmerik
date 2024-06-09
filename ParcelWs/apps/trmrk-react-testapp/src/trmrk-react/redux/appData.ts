import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

import trmrk from "../../trmrk";
import trmrk_dom_utils from "../../trmrk-browser/domUtils";

import {
  TextCaretPositionerOptsCore,
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
  fullViewPortTextCaretPositionerOpts: TextCaretPositionerOpts;
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
  getTextCaretPositionerCurrentInputElLastSetOpIdx: Selector<
    {
      appData: AppData;
    },
    number,
    []
  > & {
    unwrapped: (appData: AppData) => number;
  };
  getFullViewPortTextCaretPositionerOpts: Selector<
    {
      appData: AppData;
    },
    TextCaretPositionerOpts,
    []
  > & {
    unwrapped: (appData: AppData) => TextCaretPositionerOpts;
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
  setTextCaretPositionerOpts: ActionCreatorWithPayload<
    TextCaretPositionerOpts,
    "appData/setTextCaretPositionerOpts"
  >;
  incTextCaretPositionerCurrentInputElLastSetOpIdx: ActionCreatorWithPayload<
    void,
    "appData/incTextCaretPositionerCurrentInputElLastSetOpIdx"
  >;
  setFullViewPortTextCaretPositionerOpts: ActionCreatorWithPayload<
    TextCaretPositionerOpts,
    "appData/setFullViewPortTextCaretPositionerOpts"
  >;
}

export const getTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: boolean | string | null | undefined = null
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
  textCaretPositionerOptsKey: boolean | string | null | undefined = null
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
  fullViewPortTextCaretPositionerOpts:
    getTextCaretPositionerOptsFromLocalStorage(true),
});
