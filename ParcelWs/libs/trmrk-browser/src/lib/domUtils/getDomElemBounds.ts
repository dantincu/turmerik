import trmrk from '../../trmrk';
import { NullOrUndef } from '../../trmrk/core';

import { filterChildNodes } from './core';

import { Coords } from './types';

export const pxRegex = () => /px/i;
export const emRegex = () => /px/i;
export const remRegex = () => /px/i;

export interface HtmlElementStyleRectangleCore {
  left: number | NullOrUndef;
  top: number | NullOrUndef;
  width: number | NullOrUndef;
  height: number | NullOrUndef;
}

export interface HtmlElementRectangleCore {
  offsetLeft: number;
  offsetTop: number;
  width: number;
  height: number;
}

export interface HtmlElementRectangle extends HtmlElementRectangleCore {}

export interface HtmlElementBounds extends HtmlElementRectangleCore {
  totalOffsetLeft: number;
  totalOffsetTop: number;
  totalRenderedOffsetLeft: number;
  totalRenderedOffsetTop: number;
  scrollWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

export const getDomElemBounds = (elem: HTMLElement, setOffsetToZero: boolean = false) => {
  const retElem = {
    offsetLeft: setOffsetToZero ? 0 : elem.offsetLeft,
    offsetTop: setOffsetToZero ? 0 : elem.offsetTop,
    width: elem.clientWidth,
    height: elem.clientHeight,
    scrollWidth: elem.scrollWidth,
    scrollHeight: elem.scrollHeight,
    scrollLeft: elem.scrollLeft,
    scrollTop: elem.scrollTop,
  } as unknown as HtmlElementBounds;

  if (setOffsetToZero) {
    retElem.totalOffsetLeft = 0;
    retElem.totalOffsetTop = 0;
    retElem.totalRenderedOffsetLeft = 0;
    retElem.totalRenderedOffsetTop = 0;
  } else {
    retElem.totalOffsetLeft = retElem.offsetLeft;
    retElem.totalOffsetTop = retElem.offsetTop;
    retElem.totalRenderedOffsetLeft = retElem.offsetLeft;
    retElem.totalRenderedOffsetTop = retElem.offsetTop;
  }

  return retElem;
};

export const getHcyElemBounds = (rootElem: HTMLElement, trgElem: HTMLElement) => {
  let elem = getDomElemBounds(trgElem);
  const retArr: HtmlElementBounds[] = [elem];
  let reachedRoot = trgElem === rootElem;

  while (!reachedRoot) {
    const prElem = trgElem.parentElement;

    if (prElem) {
      trgElem = prElem;
      reachedRoot = trgElem === rootElem;
      elem = getDomElemBounds(trgElem, reachedRoot);
      retArr.splice(0, 0, elem);
    } else {
      break;
    }
  }

  let prElem = retArr[0];

  for (let i = 1; i < retArr.length; i++) {
    elem = retArr[i];

    elem.totalOffsetLeft = prElem.totalOffsetLeft + elem.offsetLeft;
    elem.totalOffsetTop = prElem.totalOffsetTop + elem.offsetTop;

    elem.totalRenderedOffsetLeft =
      prElem.totalRenderedOffsetLeft + elem.offsetLeft - prElem.scrollLeft;

    elem.totalRenderedOffsetTop = prElem.totalRenderedOffsetTop + elem.offsetTop - prElem.scrollTop;

    prElem = elem;
  }

  return retArr;
};

export const isScrolledIntoView = (rootElem: HTMLElement, trgElem: HTMLElement) => {
  const hcyElemBounds = getHcyElemBounds(rootElem, trgElem);

  const trgElemBounds = hcyElemBounds.slice(-1)[0];

  const totalRenderedOffsetLeft = trgElemBounds.totalRenderedOffsetLeft;
  const totalRenderedOffsetTop = trgElemBounds.totalRenderedOffsetTop;

  const isIntoView =
    totalRenderedOffsetLeft < rootElem.offsetWidth &&
    totalRenderedOffsetTop < rootElem.offsetHeight;
  return isIntoView;
};

export const getChildTextNodes = (
  prElem: HTMLElement,
  upToElem: HTMLElement | null = null,
  reverseOrder: boolean = false
) => {
  const retArr = filterChildNodes<Text>(
    prElem,
    (prElemChildNode) => {
      let keep: boolean | null = null;

      if (prElemChildNode instanceof Text) {
        keep = true;
      } else if (upToElem !== null && prElemChildNode === upToElem) {
        keep = false;
      }

      return keep;
    },
    reverseOrder
  );

  if (reverseOrder) {
    retArr.reverse();
  }

  return retArr;
};

export const clearStyleTopAndBottom = (style: CSSStyleDeclaration) => {
  style.top = '';
  style.bottom = '';
};

export const clearElemVertInset = (elemStyle: CSSStyleDeclaration) => {
  elemStyle.top = '';
  elemStyle.bottom = '';
};

export const extractNumberFromCssPropVal = (
  cssPropVal: string,
  suffix: string | NullOrUndef = null
) => {
  let pxCount: number | null = null;
  suffix ??= 'px';
  const sffxLen = suffix.length;

  if (sffxLen === 0 || cssPropVal.toLowerCase().endsWith(suffix)) {
    if (sffxLen !== 0) {
      cssPropVal = cssPropVal.substring(0, cssPropVal.length - sffxLen);
    }

    if (cssPropVal.length > 0) {
      try {
        pxCount = parseFloat(cssPropVal);
      } catch (err) {}
    }
  }

  return pxCount;
};

export const applyCssPropValIfReq = <TPropVal>(
  elemStyle: CSSStyleDeclaration,
  cssPropVal: TPropVal,
  cssPropValAssigner: (elemStyle: CSSStyleDeclaration, propVal: string) => void,
  cssPropValSerializer: ((propVal: TPropVal) => string) | NullOrUndef = null,
  defaultCssPropValSerializer:
    | ((propVal: TPropVal | NullOrUndef) => string | null)
    | NullOrUndef = null
) => {
  cssPropValSerializer ??= (propVal) => `${propVal}`;
  defaultCssPropValSerializer ??= () => null;

  trmrk.actWithValIf(
    cssPropVal,
    (val) => cssPropValAssigner(elemStyle, cssPropValSerializer(val)),
    (val) => {
      const dfVal = defaultCssPropValSerializer(val);
      if ((dfVal ?? null) !== null) {
        cssPropValAssigner(elemStyle, '');
      }
    }
  );
};

export const applyRectnglProps = (
  elemStyle: CSSStyleDeclaration,
  rectnglCssProps: HtmlElementStyleRectangleCore,
  clearPropsWhereNullOrUndef = false
) => {
  const cssPropValSerializer = (val: number | NullOrUndef) => `${val}px`;

  let defaultCssPropValSerializer: (val: number | NullOrUndef) => string | null;

  defaultCssPropValSerializer = clearPropsWhereNullOrUndef ? () => '' : () => null;

  applyCssPropValIfReq(
    elemStyle,
    rectnglCssProps.top,
    (style, val) => (style.top = val),
    cssPropValSerializer,
    defaultCssPropValSerializer
  );

  applyCssPropValIfReq(
    elemStyle,
    rectnglCssProps.left,
    (style, val) => (style.left = val),
    cssPropValSerializer,
    defaultCssPropValSerializer
  );

  applyCssPropValIfReq(
    elemStyle,
    rectnglCssProps.width,
    (style, val) => (style.width = val),
    cssPropValSerializer,
    defaultCssPropValSerializer
  );

  applyCssPropValIfReq(
    elemStyle,
    rectnglCssProps.height,
    (style, val) => (style.height = val),
    cssPropValSerializer,
    defaultCssPropValSerializer
  );
};

export const getElemIdx = (elems: HTMLElement[], coords: Coords) =>
  elems.findIndex((elem) =>
    trmrk.withVal(elem.getBoundingClientRect(), (rect) => {
      let retVal = coords.clientX >= rect.left && coords.clientX <= rect.right;
      retVal = retVal && coords.clientY >= rect.top && coords.clientY <= rect.bottom;

      return retVal;
    })
  );
