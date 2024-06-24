import { withVal } from "../../trmrk/core";

import {
  HtmlElementBounds,
  getHcyElemBounds,
  isScrolledIntoView,
} from "../domUtils/getDomElemBounds";

import { getChildNodesUpTo } from "../domUtils/getDomElemBounds";

import {
  TextCaretPositionerBase,
  TextCaretPositionerOptsCore,
  TextEndCoords,
  TextNodeCoordsCore,
  TextNodeCore,
} from "./textCaretPositionerCore";

export interface TextCaretPositionerOpts
  extends TextCaretPositionerOptsCore<HTMLElement> {}

export interface TextNode extends TextNodeCore<Text> {}

export const positionTextCaret = (opts: TextCaretPositionerOpts) => {
  const component = new TextCaretPositioner(opts);
  const caretCharIdx = component.positionCaret();
  return caretCharIdx;
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

export const getTextNodeEndCoords = (
  textNode: TextNode,
  nextTextNode: TextNodeCoordsCore,
  opts: TextCaretPositionerOpts
) => {
  const linesSpan = Math.round(
    (nextTextNode.offsetTop! - textNode.offsetTop!) / opts.caretHeight
  );

  const renderedTextLength =
    (linesSpan - 1) * opts.maxLineLength +
    nextTextNode.offsetLeft! -
    textNode.offsetLeft!;

  const textEndCoords = {
    nextOffsetLeft: nextTextNode.offsetLeft!,
    nextOffsetTop: nextTextNode.offsetTop!,
    linesSpan: linesSpan,
    renderedTextLength: renderedTextLength,
  };

  return textEndCoords;
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

export const getTextPartsArrUpTo = (
  prElem: HTMLElement,
  refElem: HTMLElement
) => getChildNodesUpTo<Text>(prElem, refElem).map((text) => text.data);

export const getTextUpTo = (prElem: HTMLElement, refElem: HTMLElement) =>
  getTextPartsArrUpTo(prElem, refElem).join("");

export const getTextCharsCountUpTo = (
  prElem: HTMLElement,
  refElem: HTMLElement
) =>
  getTextPartsArrUpTo(prElem, refElem)
    .map((text) => text.length)
    .reduce((a, b) => a + b);

export class TextCaretPositioner extends TextCaretPositionerBase<
  Text,
  TextNode,
  HTMLElement,
  TextCaretPositionerOpts
> {
  constructor(opts: TextCaretPositionerOpts) {
    super(opts);
  }

  protected getHcyElemBounds(
    rootElem: HTMLElement,
    trgElem: HTMLElement
  ): HtmlElementBounds[] {
    const bounds = getHcyElemBounds(rootElem, trgElem);
    return bounds;
  }

  protected getMaxLineLength(opts: TextCaretPositionerOpts): number {
    const maxLineLength = opts.trgElem.scrollWidth;
    return maxLineLength;
  }

  protected getCaretHeight(opts: TextCaretPositionerOpts): number {
    const caretHeight = getCaretHeight(opts);
    return caretHeight;
  }

  protected getAllTextNodes(trgElem: HTMLElement): TextNode[] {
    const allTextNodes = getAllTextNodes(trgElem);
    return allTextNodes;
  }

  protected getOffsetLeft(elem: HTMLElement): number {
    const offsetLeft = elem.offsetLeft;
    return offsetLeft;
  }

  protected getOffsetTop(elem: HTMLElement): number {
    const offsetTop = elem.offsetTop;
    return offsetTop;
  }

  protected normTextNodeOffset(textNode: TextNode): void {
    normTextNodeOffset(textNode, this.opts);
  }

  protected getTextNodeEndCoords(
    currentTextNode: TextNode,
    nextTextNode: TextNode
  ): TextEndCoords {
    const coords = getTextNodeEndCoords(
      currentTextNode,
      nextTextNode,
      this.opts
    );

    return coords;
  }

  protected htmlGetText(node: Text): string {
    const text = node.data;
    return text;
  }

  protected htmlInsertBefore(
    prElem: HTMLElement,
    newChild: HTMLElement,
    existingSibbling: Text | HTMLElement | null
  ): void {
    prElem.insertBefore(newChild, existingSibbling);
  }

  protected htmlGetNthChild(
    prElem: HTMLElement,
    idx: number
  ): HTMLElement | Text {
    const nthChild = prElem.childNodes.item(idx);
    return nthChild as HTMLElement | Text;
  }

  protected splitText(textNode: TextNode, splitOffset: number): TextNode {
    const idx = this.textNodeArr.indexOf(textNode);
    const newText = textNode.node.splitText(splitOffset);
    textNode.textEndCoords = null;

    const newTextNode: TextNode = {
      node: newText,
    };

    this.textNodeArr.splice(idx + 1, 0, newTextNode);
    this.lastIdx++;

    return newTextNode;
  }

  protected insertBefore(textNode: TextNode | null = null) {
    const opts = this.opts;
    const { trgElem, invisibleCaretElem } = opts;
    textNode ??= this.currentTextNode;

    trgElem.insertBefore(invisibleCaretElem, textNode.node);
    normTextNodeOffset(textNode, opts);
  }

  protected insertAfter(textNode: TextNode | null = null) {
    const opts = this.opts;
    const { trgElem, invisibleCaretElem } = opts;
    textNode ??= this.currentTextNode;

    trgElem.insertBefore(invisibleCaretElem, textNode.node.nextSibling);
    normTextNodeOffset(textNode, opts);
  }

  override positionCaret() {
    const opts = this.opts;
    const { visibleCaretElem, invisibleCaretElem, rootElem } = opts;
    opts.invisibleCaretElem.parentElement?.removeChild(opts.invisibleCaretElem);

    super.positionCaret();

    visibleCaretElem!.style.top = invisibleCaretElem!.offsetTop + "px";
    visibleCaretElem!.style.left = invisibleCaretElem!.offsetLeft + "px";

    const scrollToCarret =
      opts.scrollToCarret ?? !isScrolledIntoView(rootElem, visibleCaretElem);

    if (scrollToCarret) {
      visibleCaretElem.scrollIntoView();
    }

    return this.caretCharIdx;
  }
}
