import trmrk from "../../trmrk";
import { localStorageKeys } from "../domUtils/core";

const jsonBool = trmrk.jsonBool;

export interface TextCaretPositionerOptsCore {
  enabled: boolean;
  keepOpen: boolean;
}

export interface TrmrkTextCaretPositionerOpts
  extends TextCaretPositionerOptsCore {}

export const deserializeTextCaretPositionerOptsFromLocalStorage = (
  textCaretPositionerOptsKey: string | null | undefined = null
) => {
  const textCaretPositionerOptsJson = localStorage.getItem(
    textCaretPositionerOptsKey ?? localStorageKeys.textCaretPositionerOpts
  );

  let textCaretPositionerOpts: TrmrkTextCaretPositionerOpts | null = null;

  if (textCaretPositionerOptsJson) {
    textCaretPositionerOpts = JSON.parse(textCaretPositionerOptsJson);
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
