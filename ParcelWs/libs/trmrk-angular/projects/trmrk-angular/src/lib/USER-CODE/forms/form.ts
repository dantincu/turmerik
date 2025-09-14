import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NullOrUndef } from '../../../trmrk/core';

import {
  NodeHtml,
  NodeHtmlInfo,
  TrmrkNodeCore,
  TrmrkFormNodeCategory,
  TrmrkFormRowCategory,
  TrmrkTextLevel,
  TrmrkTextStyle,
  TrmrkDOMNodeAttrs,
} from '../../../trmrk/USER-CODE/forms/types';

export const DEFAULT_ROW_HEIGHT_FACTOR = 4;

export const SKIP_DEFAULT_CSS_CLASS_PFX = '!';
export const ALT_CONTROL_ATTR_PFX = '=';

export const formNodeCategoriesMap: [TrmrkFormNodeCategory, string[]][] = [
  [TrmrkFormNodeCategory.Text, ['trmrk-form-node-text']],
  [TrmrkFormNodeCategory.Heading, ['trmrk-form-node-heading']],
  [TrmrkFormNodeCategory.Input, ['trmrk-form-node-input']],
  [TrmrkFormNodeCategory.Combobox, ['trmrk-form-node-combobox']],
  [TrmrkFormNodeCategory.Button, ['trmrk-form-node-button']],
  [TrmrkFormNodeCategory.HorizStrip, ['trmrk-form-node-horiz-strip']],
  [TrmrkFormNodeCategory.ThinHorizStrip, ['trmrk-form-node-thin-horiz-strip']],
  [TrmrkFormNodeCategory.Group, ['trmrk-form-node-group']],
  [TrmrkFormNodeCategory.Loading, ['trmrk-form-node-loading']],
  [TrmrkFormNodeCategory.HorizRule, ['trmrk-form-node-horiz-rule']],
];

export const formRowCategoriesMap: [TrmrkFormRowCategory, string[]][] = [
  [TrmrkFormRowCategory.Content, ['trmrk-form-row']],
  [TrmrkFormRowCategory.Section, ['trmrk-form-section']],
  [TrmrkFormRowCategory.Blank, ['trmrk-form-row', 'trmrk-form-row-blank']],
];

export const textLevelsMap: [TrmrkTextLevel, string[]][] = [
  [TrmrkTextLevel.Default, ['trmrk-text-level-default']],
  [TrmrkTextLevel.Info, ['trmrk-text-level-info']],
  [TrmrkTextLevel.Warning, ['trmrk-text-level-warning']],
  [TrmrkTextLevel.Error, ['trmrk-text-level-error']],
];

export const textStylesMap: [TrmrkTextStyle, string][] = [
  [TrmrkTextStyle.Code, 'trmrk-text-style-code'],
  [TrmrkTextStyle.Strike, 'trmrk-text-style-strike'],
  [TrmrkTextStyle.Underline, 'trmrk-text-style-underline'],
  [TrmrkTextStyle.Bold, 'trmrk-text-style-bold'],
  [TrmrkTextStyle.Italic, 'trmrk-text-style-italic'],
];

export const hasRawHtml = (htmlInfo: NodeHtml | NullOrUndef) =>
  (htmlInfo ?? null) !== null &&
  ('string' === typeof htmlInfo || (htmlInfo!.raw ?? null) !== null);

export const hasHtmlTemplate = (htmlInfo: NodeHtml | NullOrUndef) =>
  ((htmlInfo as NodeHtmlInfo)?.idnf ?? null) !== null;

export const getHtmlTemplateName = (htmlInfo: NodeHtml | NullOrUndef) =>
  (htmlInfo as NodeHtmlInfo)?.idnf ?? null;

export const getRawHtml = (htmlInfo: NodeHtml | NullOrUndef) => {
  let htmlStr: string | null = null;

  if ((htmlInfo ?? null) !== null) {
    if ('string' === typeof htmlInfo) {
      htmlStr = htmlInfo;
    } else {
      htmlStr = htmlInfo!.raw ?? null;
    }
  }

  return htmlStr;
};

export const getSafeHtml = (
  htmlInfo: NodeHtml | NullOrUndef,
  sanitizer: DomSanitizer
) => {
  const rawHtml = getRawHtml(htmlInfo);
  let safeHtml: SafeHtml | null = null;

  if (rawHtml !== null) {
    safeHtml = sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  return safeHtml;
};

export const getCssClassFromMap = <TEnum>(
  map: [TEnum, string[]][],
  value: TEnum | NullOrUndef
) => {
  let cssClass: string[];

  if ((value ?? null) !== null) {
    const kvp = map.find((kvp) => kvp[0] === value);

    if (kvp) {
      cssClass = kvp[1];
    } else {
      cssClass = [];
    }
  } else {
    cssClass = [];
  }

  return cssClass;
};

export interface NormalizedCssClasses {
  classes: string[];
  useNativeControl?: boolean | NullOrUndef;
  skipDefaultCssClass?: boolean | NullOrUndef;
}

export interface NormalizedCssClassesAgg {
  main: NormalizedCssClasses;
  alt: NormalizedCssClasses;
}

export const normalizeCssClass = (
  cssClass: string | string[] | NullOrUndef
) => {
  const retObj: NormalizedCssClassesAgg = {
    main: { classes: [] },
    alt: { classes: [] },
  };

  if ((cssClass ?? null) !== null) {
    if ('string' === typeof cssClass) {
      cssClass = [cssClass];
    } else {
      cssClass = [...cssClass!];
    }

    for (let cls of cssClass) {
      let skipDefaultCssClass = cls.startsWith(SKIP_DEFAULT_CSS_CLASS_PFX);

      if (skipDefaultCssClass) {
        cls = cls.substring(1);
      }

      if (cls.startsWith(ALT_CONTROL_ATTR_PFX)) {
        cls = cls.substring(1);
        retObj.alt.classes.push(cls);

        if (skipDefaultCssClass) {
          retObj.alt.skipDefaultCssClass = true;
        }
      } else {
        retObj.main.classes.push(cls);

        if (skipDefaultCssClass) {
          retObj.main.skipDefaultCssClass = true;
        }
      }
    }
  }

  return retObj;
};

export interface NormalizedAttrs {
  main: TrmrkDOMNodeAttrs;
  alt: TrmrkDOMNodeAttrs;
}

export const normalizeAttrs = (attrs: TrmrkDOMNodeAttrs | NullOrUndef) => {
  const retObj: NormalizedAttrs = {
    main: {},
    alt: {},
  };

  if ((attrs ?? null) !== null) {
    for (let key of Object.keys(attrs!)) {
      if (key.startsWith(ALT_CONTROL_ATTR_PFX)) {
        retObj.alt[key.substring(1)] = attrs![key];
      } else {
        retObj.main[key] = attrs![key];
      }
    }
  }

  return retObj;
};
