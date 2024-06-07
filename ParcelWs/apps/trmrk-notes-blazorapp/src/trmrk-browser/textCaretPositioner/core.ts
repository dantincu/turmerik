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
  size: TextCaretPositionerSize;
  viewPortOffset: TextCaretPositionerViewPortOffset;
}

export interface TrmrkTextCaretPositionerOpts
  extends TextCaretPositionerOptsCore {}

export const deserializeTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: string | null | undefined = null,
  parseErrorRef: MtblRefValue<unknown | any | null | undefined> | null = null
) => {
  const textCaretPositionerOptsJson = localStorage.getItem(
    textCaretPositionerOptsKey ?? localStorageKeys.textCaretPositionerOpts
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
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  textCaretPositionerOptsKey ??= localStorageKeys.textCaretPositionerOpts;

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
