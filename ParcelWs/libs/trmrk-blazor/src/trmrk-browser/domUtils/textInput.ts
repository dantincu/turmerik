import { extractNestedElement } from "./core";

export const hasContentEditable = (elem: HTMLElement) =>
  (elem.getAttribute("contenteditable") ?? "false") !== "false";

export const extractTextInput = (
  prElem: HTMLElement,
  filterPredicate:
    | ((
        elem: HTMLElement,
        idx: number,
        collctn: NodeListOf<ChildNode> | null
      ) => boolean)
    | null
    | undefined = null
) => {
  filterPredicate ??= (elem) =>
    elem instanceof HTMLInputElement ||
    (elem instanceof HTMLTextAreaElement &&
      !elem.getAttribute("aria-hidden")) ||
    (elem instanceof HTMLDivElement && hasContentEditable(elem));

  let retElem: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement | null =
    null;

  if (filterPredicate(prElem, -1, null)) {
    retElem = prElem as HTMLInputElement | HTMLTextAreaElement | HTMLDivElement;
  } else {
    retElem = extractNestedElement<
      HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
    >(prElem, filterPredicate);
  }

  return retElem;
};
