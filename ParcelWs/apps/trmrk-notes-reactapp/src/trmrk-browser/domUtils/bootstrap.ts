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
        ["bootstrap-css", "trmrk-css"].indexOf(styleSheet.title ?? "") >= 0 ||
        isBootstrapIconsStyleSheet(styleSheet))
  ),
];
