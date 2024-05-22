import { filterChildNodes } from "./core";

export interface HtmlElementBounds {
  offsetLeft: number;
  offsetTop: number;
  totalOffsetLeft: number;
  totalOffsetTop: number;
  totalRenderedOffsetLeft: number;
  totalRenderedOffsetTop: number;
  width: number;
  height: number;
  scrollWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

export interface DomRectDiff {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const getDomElemBounds = (
  elem: HTMLElement,
  setOffsetToZero: boolean = false
) => {
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

export const getHcyElemBounds = (
  rootElem: HTMLElement,
  trgElem: HTMLElement
) => {
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

    elem.totalRenderedOffsetTop =
      prElem.totalRenderedOffsetTop + elem.offsetTop - prElem.scrollTop;

    prElem = elem;
  }

  return retArr;
};

export const isScrolledIntoView = (
  rootElem: HTMLElement,
  trgElem: HTMLElement
) => {
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

export const getDomRectDiff = (
  rect: DOMRect,
  prRect: DOMRect | null | undefined = null
) => {
  prRect ??= {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  } as DOMRect;
  const domRectDiff = {
    left: rect.left - prRect.left,
    top: rect.top - prRect.top,
  } as DomRectDiff;

  if ((prRect.right ?? -1) >= 0) {
    domRectDiff.right = prRect.right - rect.right;
  } else {
    domRectDiff.right =
      prRect.left + prRect.width - domRectDiff.left - rect.width;
  }

  if ((prRect.bottom ?? -1) >= 0) {
    domRectDiff.bottom = prRect.bottom - rect.bottom;
  } else {
    domRectDiff.bottom =
      prRect.top + prRect.height - domRectDiff.top - rect.height;
  }

  return domRectDiff;
};
