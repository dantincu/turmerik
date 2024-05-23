import { extractNestedElement } from "./core";

export const isMultilineInput = (inputEl: HTMLElement) =>
  inputEl.tagName !== "INPUT";

export const hasContentEditable = (elem: HTMLElement) =>
  (elem.getAttribute("contenteditable") ?? "false") !== "false";

export const isTextInput = (elem: HTMLElement) => {
  switch (elem.tagName) {
    case "INPUT":
      return true;
    case "TEXTAREA":
      const isNotHidden = !elem.getAttribute("aria-hidden");
      return isNotHidden;
    default:
      const hasContentEditableVal = hasContentEditable(elem);
      return hasContentEditableVal;
  }
};

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
  filterPredicate ??= isTextInput;

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
