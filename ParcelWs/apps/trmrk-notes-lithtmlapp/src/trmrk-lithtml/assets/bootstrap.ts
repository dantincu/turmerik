import { unsafeCSS } from "lit";

import { getGlobalStyleStrArr } from "../../trmrk-browser/domUtils/bootstrap";

export const isBootstrapIconsStyleSheet = (styleSheet: CSSStyleSheet) =>
  styleSheet.cssRules[0].cssText.indexOf("bootstrap-icons") >= 0;

export const getGlobalStylesArr = (
  styleSheetsArr?: CSSStyleSheet[] | null | undefined,
  predicate?:
    | ((styleSheet: CSSStyleSheet, idx?: number) => boolean | any | void)
    | null
    | undefined
) => [
  ...getGlobalStyleStrArr(styleSheetsArr, predicate).map((str) => {
    // console.log("str", str);
    return unsafeCSS(str);
  }),
];
