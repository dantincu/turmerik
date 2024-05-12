import { withVal } from "../../trmrk/core";

import {
  HtmlElementBounds,
  getHcyElemBounds,
} from "../domUtils/getDomElemBounds";

import { isScrolledIntoView } from "../../trmrk-browser/domUtils/getDomElemBounds";

export interface TextCaretPositionerOpts {
  rootElem: HTMLElement;
  trgElem: HTMLElement;
  trgElemHcyBounds: HtmlElementBounds[];
  trgElemBounds: HtmlElementBounds;
  trgElemOffsetX: number;
  trgElemOffsetY: number;
  invisibleCaretElem: HTMLElement;
  visibleCaretElem: HTMLElement;
  caretHeight: number;
  maxLineLength: number;
  scrollToCarret?: boolean | null | undefined;
}

export interface TextNode {
  node: Text;
  offsetTop?: number | null | undefined;
  offsetSecondLine?: number | null | undefined;
  offsetLeft?: number | null | undefined;
}

export const positionTextCaret = (opts: TextCaretPositionerOpts) => {
  const component = new TextCaretPositioner(opts);
  component.positionCaret();
};

export const getCaretHeight = (opts: TextCaretPositionerOpts) => {
  const { visibleCaretElem } = opts;
  visibleCaretElem.parentNode?.removeChild(visibleCaretElem);
  opts.trgElem.appendChild(visibleCaretElem);
  const caretHeight = visibleCaretElem.clientHeight;
  opts.trgElem.removeChild(visibleCaretElem);
  return caretHeight;
};

export const getMaxLineLength = (opts: TextCaretPositionerOpts) =>
  opts.trgElem.scrollWidth;

export const normTextNodeOffset = (
  textNode: TextNode,
  opts: TextCaretPositionerOpts
) => {
  const { invisibleCaretElem, caretHeight } = opts;

  textNode.offsetTop ??= invisibleCaretElem.offsetTop;
  textNode.offsetLeft ??= invisibleCaretElem.offsetLeft;
  textNode.offsetSecondLine ??= textNode.offsetTop + caretHeight;
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

export class TextCaretPositioner {
  private readonly opts: Readonly<TextCaretPositionerOpts>;
  private readonly textNodeArr: TextNode[];
  private readonly lineHeightX0p5: number;
  private readonly lineHeightX1p5: number;
  private lastIdx: number;
  private insertAtTheEnd: boolean;
  private matchingTextNode: TextNode | null;
  private currentTextNode!: TextNode;
  private currentIdx: number;
  private startX: number;
  private startY: number;
  private endX: number;
  private endY: number;
  private maxY: number;

  constructor(opts: TextCaretPositionerOpts) {
    opts.trgElemHcyBounds ??= getHcyElemBounds(opts.rootElem, opts.trgElem);
    opts.trgElemBounds ??= opts.trgElemHcyBounds.slice(-1)[0];

    opts.maxLineLength ??= getMaxLineLength(opts);
    opts.caretHeight ??= getCaretHeight(opts);

    this.opts = Object.freeze(opts);
    this.textNodeArr = getAllTextNodes(opts.trgElem);
    this.lineHeightX0p5 = opts.caretHeight / 2;
    this.lineHeightX1p5 = this.lineHeightX0p5 + opts.caretHeight;

    this.lastIdx = this.textNodeArr.length - 1;
    this.matchingTextNode = null;
    this.insertAtTheEnd = false;

    this.currentIdx = -1;
    this.startX = -1;
    this.startY = -1;
    this.endX = -1;
    this.endY = -1;
    this.maxY = -1;
  }

  positionCaret() {
    const opts = this.opts;
    const { trgElem, visibleCaretElem, invisibleCaretElem, rootElem } = opts;
    opts.invisibleCaretElem.parentElement?.removeChild(opts.invisibleCaretElem);

    if (this.lastIdx >= 0) {
      this.setCurrentIdx(0);
      this.insertBefore();

      this.startX = invisibleCaretElem.offsetLeft;
      this.startY = invisibleCaretElem.offsetTop;

      this.setCurrentIdx(this.lastIdx);
      this.insertAfter();

      this.endX = invisibleCaretElem.offsetLeft;
      this.endY = invisibleCaretElem.offsetTop;
      this.maxY = this.endY + opts.caretHeight;

      if (opts.trgElemOffsetY <= this.maxY) {
        if (opts.trgElemOffsetY >= this.startY) {
          if (this.lastIdx >= 1) {
            this.matchingTextNode = this.getMatchingTextNode(0, this.lastIdx);
          } else {
            this.matchingTextNode = this.textNodeArr[0];
          }
        }
      } else {
        this.insertAtTheEnd = true;
      }

      if (this.matchingTextNode) {
        this.setCurrentIdx(this.textNodeArr.indexOf(this.matchingTextNode));
        this.positionCaretCore();
      } else {
        if (this.insertAtTheEnd) {
          trgElem.insertBefore(invisibleCaretElem, null);
        } else {
          trgElem.insertBefore(invisibleCaretElem, this.textNodeArr[0].node);
        }
      }
    } else {
      trgElem.insertBefore(invisibleCaretElem, trgElem.childNodes.item(0));
    }

    visibleCaretElem!.style.top = invisibleCaretElem!.offsetTop + "px";
    visibleCaretElem!.style.left = invisibleCaretElem!.offsetLeft + "px";

    if (opts.scrollToCarret ?? true) {
      if (!isScrolledIntoView(rootElem, visibleCaretElem)) {
        visibleCaretElem.scrollIntoView();
      }
    }
  }

  getMatchingTextNode(stIdx: number, endIdx: number): TextNode {
    this.insertBefore();
    let matchingTextNode: TextNode;

    let avgIdx = Math.floor((stIdx + endIdx) / 2);
    let avgNode = this.textNodeArr[avgIdx];

    if (avgIdx == stIdx || avgIdx == endIdx) {
      matchingTextNode = avgNode;
    } else {
      if (this.canGoUp(avgNode)) {
        this.setCurrentIdx(avgIdx);
        matchingTextNode = this.getMatchingTextNode(stIdx, avgIdx);
      } else if (this.canGoDown(avgNode)) {
        this.setCurrentIdx(avgIdx);
        matchingTextNode = this.getMatchingTextNode(avgIdx, endIdx);
      } else {
        this.setCurrentIdx(avgIdx);
        this.insertBefore();
        matchingTextNode = avgNode;
      }
    }

    return matchingTextNode;
  }

  canGoUp(textNode: TextNode) {
    const opts = this.opts;

    let canGoUp =
      textNode.offsetTop! > opts.trgElemOffsetY ||
      (textNode.offsetTop! <= opts.trgElemOffsetY &&
        textNode.offsetSecondLine! > opts.trgElemOffsetY &&
        textNode.offsetLeft! > opts.trgElemOffsetX);

    return canGoUp;
  }

  canGoDown(textNode: TextNode) {
    const opts = this.opts;

    let canGoDown =
      textNode.offsetSecondLine! < opts.trgElemOffsetY ||
      (textNode.offsetSecondLine! >= opts.trgElemOffsetY &&
        textNode.offsetTop! < opts.trgElemOffsetY &&
        opts.trgElemOffsetX > textNode!.offsetLeft!);

    return canGoDown;
  }

  positionCaretCore() {
    let [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();

    while (splitPos > 0) {
      this.splitText(this.currentTextNode, splitPos);
      this.addToCurrentIdx(1);
      this.insertBefore();

      [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();

      if (splitPos < 0) {
        this.addToCurrentIdx(-1);
        this.insertBefore();
        [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();
      }
    }
  }

  getCurrentTextSplitPos(): [number, number, number] {
    const opts = this.opts;
    const diffX = opts.trgElemOffsetX - this.currentTextNode.offsetLeft!;
    const diffY = opts.trgElemOffsetY - this.currentTextNode.offsetTop!;

    const allowsSplit = diffY > opts.caretHeight || (diffY >= 0 && diffX >= 0);
    let ratio: number;

    if (allowsSplit) {
      if (diffY > opts.caretHeight) {
        ratio = 1 / Math.ceil(diffY / opts.caretHeight);
      } else {
        ratio = diffX / (opts.maxLineLength - this.currentTextNode.offsetLeft!);
      }
    } else {
      ratio = -1;
    }

    const splitPos =
      ratio >= 0
        ? Math.round(ratio * this.currentTextNode.node.data.length)
        : -1;

    return [diffX, diffY, splitPos];
  }

  setCurrentIdx(newCurrentIdx: number) {
    this.currentIdx = newCurrentIdx;
    this.currentTextNode = this.textNodeArr[newCurrentIdx];

    return this.currentTextNode;
  }

  addToCurrentIdx(toAdd: number) {
    const currentTextNode = this.setCurrentIdx(this.currentIdx + toAdd);
    return currentTextNode;
  }

  splitText(textNode: TextNode, splitOffset: number): TextNode {
    const idx = this.textNodeArr.indexOf(textNode);
    const newText = textNode.node.splitText(splitOffset);

    const newTextNode: TextNode = {
      node: newText,
    };

    this.textNodeArr.splice(idx + 1, 0, newTextNode);
    this.lastIdx++;

    return newTextNode;
  }

  insertBefore(textNode: TextNode | null = null) {
    const opts = this.opts;
    const { trgElem, invisibleCaretElem } = opts;
    textNode ??= this.currentTextNode;

    trgElem.insertBefore(invisibleCaretElem, textNode.node);
    normTextNodeOffset(textNode, opts);
  }

  insertAfter(textNode: TextNode | null = null) {
    const opts = this.opts;
    const { trgElem, invisibleCaretElem } = opts;
    textNode ??= this.currentTextNode;

    trgElem.insertBefore(invisibleCaretElem, textNode.node.nextSibling);
    normTextNodeOffset(textNode, opts);
  }
}
