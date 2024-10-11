import trmrk from "../../trmrk";

import { getGlobalSheetCssStrings } from "./css";

export const isBootstrapIconsStyleSheet = (styleSheet: CSSStyleSheet) =>
  styleSheet.cssRules[0].cssText.indexOf("bootstrap-icons") >= 0;

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
        trmrk.withVal(
          ["bootstrap-css", "bootstrap-icons-css", "trmrk-css"],
          (arr) =>
            arr.indexOf(styleSheet.title ?? "") >= 0 ||
            arr.indexOf(
              (styleSheet.ownerNode as Element)?.getAttribute("data-title") ??
                ""
            ) >= 0
        ))
  ),
];
