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
