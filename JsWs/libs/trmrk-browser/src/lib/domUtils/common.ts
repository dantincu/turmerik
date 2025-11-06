import { NullOrUndef } from '../../trmrk/core';

export const toggleEventListener = <K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  add: boolean,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) => {
  if (add) {
    el.addEventListener(type, listener, options);
  } else {
    el.removeEventListener(type, listener, options);
  }
};

export const htmlCollectionToArr = <TNode extends Element = HTMLElement>(coll: HTMLCollection) => {
  const retArr: TNode[] = new Array(coll.length);
  const collLen = coll.length;

  for (let i = 0; i < collLen; i++) {
    retArr[i] = coll[i] as TNode;
  }

  return retArr;
};

export interface HighlightBlinkElemArgs {
  elem: () => HTMLElement;
  cssClass?: string | NullOrUndef;
  timeoutMillis?: number | NullOrUndef;
  removeCssClassFirst?: boolean | NullOrUndef;
}

const highlightBlinkElemCore = (args: HighlightBlinkElemArgs) => {
  const elem = args.elem();

  if (elem) {
    elem.classList.add(args.cssClass!);

    setTimeout(() => {
      const elem = args.elem();

      if (elem) {
        elem.classList.remove(args.cssClass!);
      }
    }, args.timeoutMillis!);
  }
};

export const highlightBlinkElem = (args: HighlightBlinkElemArgs) => {
  args.cssClass ??= 'trmrk-highlight-blink';
  args.timeoutMillis ??= 500;
  args.removeCssClassFirst ??= false;

  if (args.removeCssClassFirst) {
    const elem = args.elem();

    if (elem) {
      elem.classList.remove(args.cssClass!);
      setTimeout(() => highlightBlinkElemCore(args));
    }
  } else {
    highlightBlinkElemCore(args);
  }
};
