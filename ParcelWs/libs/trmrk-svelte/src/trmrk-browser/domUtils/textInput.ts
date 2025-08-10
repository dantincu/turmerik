import { NullOrUndef } from '../../trmrk/core';
import { extractNestedElement } from './core';

export const isMultilineInput = (inputEl: HTMLElement) =>
  inputEl.tagName !== 'INPUT';

export const hasContentEditable = (elem: HTMLElement) =>
  (elem.getAttribute('contenteditable') ?? 'false') !== 'false';

export const isReadOnly = (elem: HTMLElement) =>
  !!elem.getAttribute('readonly');

export const isTextInput = (elem: HTMLElement) => {
  switch (elem.tagName) {
    case 'INPUT':
      return true;
    case 'TEXTAREA':
      const isNotHidden = !elem.getAttribute('aria-hidden');
      return isNotHidden;
    default:
      const hasContentEditableVal = hasContentEditable(elem);
      return hasContentEditableVal;
  }
};

export const extractTextInput = (
  prElem: HTMLElement,
  filterPredicateOrAllowReadonly:
    | ((
        elem: HTMLElement,
        idx: number,
        collctn: NodeListOf<ChildNode> | null
      ) => boolean)
    | boolean
    | NullOrUndef = null
) => {
  if (typeof filterPredicateOrAllowReadonly !== 'function') {
    const allowReadonly = !!filterPredicateOrAllowReadonly;

    filterPredicateOrAllowReadonly = (elem) =>
      isTextInput(elem) && (allowReadonly || !isReadOnly(elem));
  }

  let retElem: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement | null =
    null;

  if (filterPredicateOrAllowReadonly(prElem, -1, null)) {
    retElem = prElem as HTMLInputElement | HTMLTextAreaElement | HTMLDivElement;
  } else {
    retElem = extractNestedElement<
      HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
    >(prElem, filterPredicateOrAllowReadonly);
  }

  return retElem;
};
