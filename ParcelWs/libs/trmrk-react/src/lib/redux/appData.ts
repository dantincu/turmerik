import { Selector, ActionCreatorWithPayload } from "@reduxjs/toolkit";

import trmrk from "../../trmrk";
import trmrk_dom_utils from "../../trmrk-browser/domUtils";

import {
  TextCaretPositionerOptsCore,
  TextCaretPositionerOptsItemCore,
  deserializeTextCaretPositionerOptsFromLocalStorage,
  serializeTextCaretPositionerOptsToLocalStorage,
} from "../../trmrk-browser/textCaretPositioner/core";

export interface TextCaretPositionerOpts extends TextCaretPositionerOptsCore {
  isFullViewPortMode: boolean;
  currentInputElLastSetOpIdx: number;
  current: TextCaretPositionerOptsItemCore;
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
  getTextCaretPositionerCurrentInputElLastSetOpIdx: Selector<
    {
      appData: AppData;
    },
    number,
    []
  > & {
    unwrapped: (appData: AppData) => number;
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
}

export const getDefaultTextCaretPositionerOpts = () =>
  ({
    map: {},
  } as TextCaretPositionerOpts);

export const getTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: string | null | undefined = null,
  defaultValue: TextCaretPositionerOpts | null = null,
  currentInputElLastSetOpIdx: number | null = 0
) => {
  const textCaretPositionerOptsSrlzbl =
    deserializeTextCaretPositionerOptsFromLocalStorage(
      textCaretPositionerOptsKey,
      { value: null }
    ) ??
    defaultValue ??
    getDefaultTextCaretPositionerOpts();

  const textCaretPositionerOpts: TextCaretPositionerOpts = {
    ...textCaretPositionerOptsSrlzbl,
  } as TextCaretPositionerOpts;

  if ((currentInputElLastSetOpIdx ?? null) !== null) {
    textCaretPositionerOpts.currentInputElLastSetOpIdx = 0;
    textCaretPositionerOpts.isFullViewPortMode = false;
  }

  return textCaretPositionerOpts;
};

export const setTextCaretPositionerOptsToLocalStorage = (
  textCaretPositionerOpts: TextCaretPositionerOpts | null,
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  let textCaretPositionerOptsSrlzbl: TextCaretPositionerOptsCore | null = null;

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
