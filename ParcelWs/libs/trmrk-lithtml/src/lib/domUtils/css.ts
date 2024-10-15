import { unsafeCSS, CSSResult } from "lit";

import { MtblRefValue } from "../../trmrk/core";

import { getGlobalSheetCssStrings } from "../../trmrk-browser/domUtils/css";

export const getGlobalStyleStrArr = (
  styleSheetsArr?: CSSStyleSheet[] | null | undefined,
  predicate?:
    | ((styleSheet: CSSStyleSheet, idx?: number) => boolean | any | void)
    | null
    | undefined
) => [
  ...getGlobalSheetCssStrings(
    styleSheetsArr,
    predicate ??
      ((styleSheet) =>
        (styleSheet.ownerNode as Element).getAttributeNode(
          "data-trmrk-lit.dev"
        ))
  ),
];

export const getGlobalStylesArr = (
  styleSheetsArr?: CSSStyleSheet[] | null | undefined,
  predicate?:
    | ((styleSheet: CSSStyleSheet, idx?: number) => boolean | any | void)
    | null
    | undefined
) => [
  ...getGlobalStyleStrArr(styleSheetsArr, predicate).map((str) => {
    return unsafeCSS(str);
  }),
];

export const globalStyles = {} as MtblRefValue<CSSResult[]>;
