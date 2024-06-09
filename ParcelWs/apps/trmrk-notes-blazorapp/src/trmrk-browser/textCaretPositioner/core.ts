import trmrk from "../../trmrk";
import { MtblRefValue } from "../../trmrk/core";
import { localStorageKeys } from "../domUtils/core";

export interface TextCaretPositionerSize {
  width: number | null | undefined;
  height: number | null | undefined;
}

export interface TextCaretPositionerViewPortOffset {
  top: number | null | undefined;
  left: number | null | undefined;
}

export interface TextCaretPositionerOptsCore {
  enabled: boolean;
  keepOpen: boolean;
  minimized: boolean;
  size: TextCaretPositionerSize;
  viewPortOffset: TextCaretPositionerViewPortOffset;
}

export interface TrmrkTextCaretPositionerOpts
  extends TextCaretPositionerOptsCore {}

export const normalizeTextCaretPositionerOptsKey = (
  textCaretPositionerOptsKey: boolean | string | null | undefined
) => {
  if (textCaretPositionerOptsKey === true) {
    textCaretPositionerOptsKey =
      localStorageKeys.fullViewPortTextCaretPositionerOpts;
  } else if (textCaretPositionerOptsKey === false) {
    textCaretPositionerOptsKey = localStorageKeys.textCaretPositionerOpts;
  } else {
    textCaretPositionerOptsKey ??= localStorageKeys.textCaretPositionerOpts;
  }

  return textCaretPositionerOptsKey;
};

export const deserializeTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: boolean | string | null | undefined = null,
  parseErrorRef: MtblRefValue<unknown | any | null | undefined> | null = null
) => {
  textCaretPositionerOptsKey = normalizeTextCaretPositionerOptsKey(
    textCaretPositionerOptsKey
  );

  const textCaretPositionerOptsJson = localStorage.getItem(
    textCaretPositionerOptsKey
  );

  let textCaretPositionerOpts: TrmrkTextCaretPositionerOpts | null = null;

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
  textCaretPositionerOpts: TrmrkTextCaretPositionerOpts | null,
  textCaretPositionerOptsKey: boolean | string | null | undefined = null
) => {
  textCaretPositionerOptsKey = normalizeTextCaretPositionerOptsKey(
    textCaretPositionerOptsKey
  );

  if (textCaretPositionerOpts) {
    const textCaretPositionerOptsJson = JSON.stringify(
      textCaretPositionerOpts,
      null,
      "  "
    );

    localStorage.setItem(
      textCaretPositionerOptsKey,
      textCaretPositionerOptsJson
    );
  } else {
    localStorage.removeItem(textCaretPositionerOptsKey);
  }
};
