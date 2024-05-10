export interface HtmlElement {
  offsetLeft: number;
  offsetTop: number;
  totalOffsetLeft: number;
  totalOffsetTop: number;
  totalRenderedOffsetLeft: number;
  totalRenderedOffsetTop: number;
  width: number;
  height: number;
  scrollLeft: number;
  scrollTop: number;
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
    scrollLeft: elem.scrollLeft,
    scrollTop: elem.scrollTop,
  } as unknown as HtmlElement;

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
  let elem = getDomElemBounds(trgElem, true);
  const retArr: HtmlElement[] = [elem];

  while (trgElem !== rootElem) {
    const prElem = trgElem.parentElement;

    if (prElem) {
      trgElem = prElem;
      elem = getDomElemBounds(trgElem);
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
  }

  return retArr;
};
