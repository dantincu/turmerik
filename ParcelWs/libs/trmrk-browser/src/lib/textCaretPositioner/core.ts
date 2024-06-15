import trmrk from "../../trmrk";
import { MtblRefValue } from "../../trmrk/core";
import { localStorageKeys } from "../domUtils/core";
import { ScreenOrientationType } from "../domUtils/deviceOrientation";

export interface TextCaretPositionerSize {
  width: number | null | undefined;
  height: number | null | undefined;
}

export interface TextCaretPositionerViewPortOffset {
  top: number | null | undefined;
  left: number | null | undefined;
}

export interface TextCaretPositionerOptsItemCore {
  enabled: boolean;
  keepOpen: boolean;
  minimized: boolean;
  size: TextCaretPositionerSize;
  viewPortOffset: TextCaretPositionerViewPortOffset;
}

export type TextCaretPositionerOptsItemType = "Default" | "FullViewPort";
export type TextCaretPositionerOptsItemScope = "Default" | "App";

export type TextCaretPositionerOptsItemsTypeMap = Record<
  TextCaretPositionerOptsItemType,
  TextCaretPositionerOptsItemCore
>;

export type TextCaretPositionerOptsItemsScreenOrientationTypeMap = Record<
  ScreenOrientationType,
  TextCaretPositionerOptsItemsTypeMap
>;

export type TextCaretPositionerOptsItemsScopeMap = Record<
  TextCaretPositionerOptsItemScope,
  TextCaretPositionerOptsItemsScreenOrientationTypeMap
>;

export interface TextCaretPositionerOptsCore {
  map: TextCaretPositionerOptsItemsScopeMap;
}

export const deserializeTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: string | null | undefined = null,
  parseErrorRef: MtblRefValue<unknown | any | null | undefined> | null = null
) => {
  const textCaretPositionerOptsJson = localStorage.getItem(
    textCaretPositionerOptsKey ?? localStorageKeys.textCaretPositionerOpts
  );

  let textCaretPositionerOpts: TextCaretPositionerOptsCore | null = null;

  if (textCaretPositionerOptsJson) {
    if (parseErrorRef) {
      try {
        textCaretPositionerOpts = JSON.parse(textCaretPositionerOptsJson);
      } catch (err: unknown) {
        parseErrorRef.value = err;
      }
    } else {
      textCaretPositionerOpts = JSON.parse(textCaretPositionerOptsJson);
    }
  }

  return textCaretPositionerOpts;
};

export const serializeTextCaretPositionerOptsToLocalStorage = (
  textCaretPositionerOpts: TextCaretPositionerOptsCore | null,
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  if (textCaretPositionerOpts) {
    const textCaretPositionerOptsJson = JSON.stringify(
      textCaretPositionerOpts,
      null,
      "  "
    );

    localStorage.setItem(
      textCaretPositionerOptsKey ?? localStorageKeys.textCaretPositionerOpts,
      textCaretPositionerOptsJson
    );
  } else {
    localStorage.removeItem(
      textCaretPositionerOptsKey ?? localStorageKeys.textCaretPositionerOpts
    );
  }
};
