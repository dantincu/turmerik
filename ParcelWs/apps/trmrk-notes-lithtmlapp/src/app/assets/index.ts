import { unsafeCSS } from "lit";

import * as bootstrapObj from "bootstrap";

import { getGlobalSheetCssStrings } from "../../trmrk-browser/domUtils/css";

export const isBootstrapIconsStyleSheet = (styleSheet: CSSStyleSheet) =>
  styleSheet.cssRules[0].cssText.indexOf("bootstrap-icons") >= 0;

export const globalStyles = [
  ...getGlobalSheetCssStrings(
    null,
    (styleSheet) =>
      ["bootstrap-css", "bootstrap-icons-css", "trmrk-css"].indexOf(
        styleSheet.title ?? ""
      ) >= 0 || isBootstrapIconsStyleSheet(styleSheet)
  ).map((str) => {
    console.log("str", str);
    return unsafeCSS(str);
  }),
];

export const bootstrap = bootstrapObj;
