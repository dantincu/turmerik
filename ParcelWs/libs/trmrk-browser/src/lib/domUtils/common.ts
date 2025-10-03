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
