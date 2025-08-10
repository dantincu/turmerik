import trmrk from '../../trmrk';
import { NullOrUndef, VoidOrAny } from '../../trmrk/core';

export const extractNum = (cssPropVal: string, unitStr: string = 'px') => {
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

export const extractElCssStyleTopPx = (elem: HTMLDivElement | NullOrUndef) =>
  extractNum(elem?.style.top ?? '');

export const getGlobalSheetCssStrings = (
  styleSheetsArr?: CSSStyleSheet[] | NullOrUndef,
  predicate?:
    | ((styleSheet: CSSStyleSheet, idx?: number) => boolean | any | VoidOrAny)
    | NullOrUndef
) =>
  (styleSheetsArr ?? Array.from(document.styleSheets))
    .filter(predicate ?? (() => true))
    .map((x) => {
      const css = Array.from(x.cssRules)
        .map((rule) => rule.cssText)
        .join('\n');

      return css;
    });
