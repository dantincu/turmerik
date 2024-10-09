import trmrk from "../../trmrk";

export const extractNum = (cssPropVal: string, unitStr: string = "px") => {
  let num: number | null = null;

  cssPropVal = cssPropVal.trim().toLocaleLowerCase();

  if (cssPropVal.length) {
    unitStr = unitStr.toLocaleLowerCase();

    if (cssPropVal.endsWith(unitStr)) {
      cssPropVal = cssPropVal.substring(0, cssPropVal.length - unitStr.length);
    }

    if (trmrk.isNumStr(cssPropVal)) {
      num = parseInt(cssPropVal);
    }
  } else {
    num = 0;
  }

  return num;
};

export const extractElCssStyleTopPx = (
  elem: HTMLDivElement | null | undefined
) => extractNum(elem?.style.top ?? "");

export const getGlobalSheetCssStrings = (
  styleSheetsArr?: CSSStyleSheet[] | null | undefined,
  predicate?:
    | ((styleSheet: CSSStyleSheet, idx?: number) => boolean | any | void)
    | null
    | undefined
) =>
  (styleSheetsArr ?? Array.from(document.styleSheets))
    .filter(predicate ?? (() => true))
    .map((x) => {
      const css = Array.from(x.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");

      return css;
    });
