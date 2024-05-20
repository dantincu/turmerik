import {
  isScrolledIntoView,
  getChildTextNodes,
  getHcyElemBounds,
} from "../domUtils/getDomElemBounds";

import {
  CursorPositionOptsCore,
  TextCaretPositionerOptsCore,
  TextEndCoords,
  TextNodeCore,
  getCursorPosition,
  CaretCharJustify,
} from "./textCaretPositionerCore";

export interface TextNode extends TextNodeCore<Text> {}

export interface CursorPositionOpts
  extends CursorPositionOptsCore<Text, TextNode> {}

export interface TextCaretPositionerOpts
  extends TextCaretPositionerOptsCore<HTMLElement> {
  scrollToCarret?: boolean | null | undefined;
}

export const getCaretHeight = (opts: TextCaretPositionerOpts) => {
  const { visibleCaretElem } = opts;

  opts.trgElem.appendChild(visibleCaretElem);
  const caretHeight = visibleCaretElem.clientHeight;

  return caretHeight;
};

export const positionCaret = (
  textNode: TextNode,
  opts: TextCaretPositionerOpts
) => {
  const { invisibleCaretElem, trgElem } = opts;
  trgElem.insertBefore(invisibleCaretElem, textNode.node);

  textNode.offsetTop ??= invisibleCaretElem.offsetTop;
  textNode.offsetLeft ??= invisibleCaretElem.offsetLeft;
};

export const getAllTextNodes = (trgElem: HTMLElement): TextNode[] => {
  const textNodeArr: TextNode[] = [];
  const childNodesCollctn = trgElem.childNodes;
  const childNodesCount = childNodesCollctn.length;

  for (let i = 0; i < childNodesCount; i++) {
    const childNode = childNodesCollctn.item(i);

    if (childNode instanceof Text) {
      textNodeArr.push({
        node: childNode,
      });
    }
  }

  return textNodeArr;
};

export const getTextCaretPositionerOpts = (
  positioningTextEl: HTMLElement,
  trgEl: HTMLElement,
  textCaretEl: HTMLElement,
  invisibleTextCaretEl: HTMLElement,
  ev: MouseEvent | { offsetX: number; offsetY: number },
  caretCharJustify: CaretCharJustify = CaretCharJustify.Closest
) => {
  const trgElemHcyBounds = getHcyElemBounds(positioningTextEl!, trgEl);
  const trgElemBounds = trgElemHcyBounds.slice(-1)[0];

  const opts = {
    rootElem: positioningTextEl,
    trgElem: trgEl,
    invisibleCaretElem: invisibleTextCaretEl,
    visibleCaretElem: textCaretEl,
    trgElemHcyBounds,
    trgElemBounds,
    trgElemOffsetX:
      ev.offsetX + trgElemBounds.totalOffsetLeft + trgElemBounds.scrollLeft,
    trgElemOffsetY:
      ev.offsetY + trgElemBounds.totalOffsetTop + trgElemBounds.scrollTop,
    caretCharJustify: caretCharJustify,
  } as unknown as TextCaretPositionerOpts;

  return opts;
};

export const normTextCaretPositionerOpts = (opts: TextCaretPositionerOpts) => {
  opts.caretHeight ??= getCaretHeight(opts);
};

export const positionTextCaret = (opts: TextCaretPositionerOpts) => {
  normTextCaretPositionerOpts(opts);
  const { visibleCaretElem, invisibleCaretElem, rootElem, trgElem } = opts;
  trgElem.appendChild(invisibleCaretElem);

  const endCoord: TextEndCoords = {
    nextOffsetLeft: opts.invisibleCaretElem.offsetLeft,
    nextOffsetTop: opts.invisibleCaretElem.offsetTop,
  };

  const posOpts: CursorPositionOpts = {
    caretCharJustify: opts.caretCharJustify,
    lineHeight: opts.caretHeight,
    offsetLeft: opts.trgElemOffsetX,
    offsetTop: opts.trgElemOffsetY,
    caretPositioner: (textNode) => positionCaret(textNode, opts),
    textNodesArr: getAllTextNodes(opts.trgElem),
    textRetriever: (textNode) => textNode.node.data,
    textSplitter: (textNode, charIdx) => {
      const nextText = textNode.node.splitText(charIdx);

      const nextTextNode: TextNode = {
        node: nextText,
      };

      return [textNode, nextTextNode];
    },
    textEndCoordsFactory: (_, nextTextNode) => {
      let coord: TextEndCoords;

      if (nextTextNode) {
        coord = {
          nextOffsetLeft: nextTextNode.offsetLeft!,
          nextOffsetTop: nextTextNode.offsetTop!,
        };
      } else {
        coord = endCoord;
      }

      return coord;
    },
  };

  let result = getCursorPosition(posOpts);

  if (!result) {
    const bounds = opts.trgElemBounds;
    trgElem.insertBefore(invisibleCaretElem, trgElem.firstChild);

    result = {
      charIdx: 0,
      offsetTop: invisibleCaretElem.offsetTop + bounds.totalRenderedOffsetTop,
      offsetLeft:
        invisibleCaretElem.offsetLeft + bounds.totalRenderedOffsetLeft,
    };

    const topOffsetDiff = opts.trgElemOffsetY - result.offsetTop;
    const leftOffsetDiff = opts.trgElemOffsetX - result.offsetLeft;

    if (
      topOffsetDiff >= opts.caretHeight ||
      (topOffsetDiff >= 0 && leftOffsetDiff >= 0)
    ) {
      trgElem.appendChild(invisibleCaretElem);

      result = {
        charIdx: getChildTextNodes(trgElem)
          .map((text) => text.data.length)
          .reduce((a, b) => a + b, 0),
        offsetTop: invisibleCaretElem.offsetTop + bounds.totalRenderedOffsetTop,
        offsetLeft:
          invisibleCaretElem.offsetLeft + bounds.totalRenderedOffsetLeft,
      };
    }
  }

  if (result) {
    trgElem.appendChild(visibleCaretElem);
    visibleCaretElem!.style.top = result.offsetTop + "px";
    visibleCaretElem!.style.left = result.offsetLeft + "px";

    const scrollToCarret =
      opts.scrollToCarret ?? !isScrolledIntoView(rootElem, visibleCaretElem);

    if (scrollToCarret) {
      visibleCaretElem.scrollIntoView();
    }
  } else {
    visibleCaretElem.parentElement?.removeChild(visibleCaretElem);
  }

  return result;
};
