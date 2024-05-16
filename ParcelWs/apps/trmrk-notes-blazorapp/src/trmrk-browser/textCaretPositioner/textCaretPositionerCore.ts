import { HtmlElementBounds } from "../domUtils/getDomElemBounds";

export interface TextCaretPositionerOptsCore<THTMLElement> {
  rootElem: THTMLElement;
  trgElem: THTMLElement;
  trgElemHcyBounds: HtmlElementBounds[];
  trgElemBounds: HtmlElementBounds;
  trgElemOffsetX: number;
  trgElemOffsetY: number;
  invisibleCaretElem: THTMLElement;
  visibleCaretElem: THTMLElement;
  caretHeight: number;
  maxLineLength: number;
  scrollToCarret?: boolean | null | undefined;
}

export interface TextNodeCoordsCore {
  offsetTop?: number | null | undefined;
  offsetLeft?: number | null | undefined;
}

export interface TextNodeCore<TText> extends TextNodeCoordsCore {
  node: TText;
  offsetSecondLine?: number | null | undefined;
  textEndCoords?: TextEndCoords | null | undefined;
}

export interface TextEndCoords {
  nextOffsetLeft: number;
  nextOffsetTop: number;
  linesSpan: number;
  renderedTextLength: number;
}

export abstract class TextCaretPositionerBase<
  TText,
  TTextNode extends TextNodeCore<TText>,
  THTMLElement,
  TOpts extends TextCaretPositionerOptsCore<THTMLElement>
> {
  protected readonly opts: Readonly<TOpts>;
  protected readonly textNodeArr: TTextNode[];
  protected readonly lineHeightX0p5: number;
  protected readonly lineHeightX1p5: number;
  protected lastIdx: number;
  protected insertAtTheEnd: boolean;
  protected matchingTextNode: TTextNode | null;
  protected currentTextNode!: TTextNode;
  protected currentIdx: number;
  protected startX: number;
  protected startY: number;
  protected endX: number;
  protected endY: number;
  protected maxY: number;
  protected caretCharIdx: number;

  constructor(opts: TOpts) {
    opts.trgElemHcyBounds ??= this.getHcyElemBounds(
      opts.rootElem,
      opts.trgElem
    );
    opts.trgElemBounds ??= opts.trgElemHcyBounds.slice(-1)[0];

    opts.maxLineLength ??= this.getMaxLineLength(opts);
    opts.caretHeight ??= this.getCaretHeight(opts);

    this.opts = Object.freeze(opts);
    this.textNodeArr = this.getAllTextNodes(opts.trgElem);
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
    this.caretCharIdx = -1;
  }

  positionCaret() {
    const opts = this.opts;
    const { trgElem, visibleCaretElem, invisibleCaretElem } = opts;

    if (this.lastIdx >= 0) {
      this.setCurrentIdx(0);
      this.insertBefore(null);

      this.startX = this.getOffsetLeft(invisibleCaretElem);
      this.startY = this.getOffsetTop(invisibleCaretElem);

      this.setCurrentIdx(this.lastIdx);
      this.insertAfter(null);

      this.endX = this.getOffsetLeft(invisibleCaretElem);
      this.endY = this.getOffsetTop(invisibleCaretElem);
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
          this.htmlInsertBefore(trgElem, invisibleCaretElem, null);
          this.currentIdx = this.lastIdx + 1;
        } else {
          this.htmlInsertBefore(
            trgElem,
            invisibleCaretElem,
            this.textNodeArr[0].node
          );
          this.currentIdx = 0;
        }
      }
    } else {
      this.htmlInsertBefore(
        trgElem,
        invisibleCaretElem,
        this.htmlGetNthChild(trgElem, 0)
      );
      this.currentIdx = 0;
    }

    this.caretCharIdx = this.getCaretCharIdx();
    this.htmlInsertBefore(trgElem, visibleCaretElem, null);

    return this.caretCharIdx;
  }

  getCaretCharIdx() {
    const caretCharIdx = this.textNodeArr
      .slice(0, this.currentIdx)
      .map((text) => this.htmlGetText(text.node).length)
      .reduce((a, b) => a + b);

    return caretCharIdx;
  }

  getMatchingTextNode(stIdx: number, endIdx: number): TTextNode {
    this.insertBefore(null);
    let matchingTextNode: TTextNode;

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
        this.insertBefore(null);
        matchingTextNode = avgNode;
      }
    }

    return matchingTextNode;
  }

  canGoUp(textNode: TTextNode) {
    const opts = this.opts;

    let canGoUp =
      textNode.offsetTop! > opts.trgElemOffsetY ||
      (textNode.offsetTop! <= opts.trgElemOffsetY &&
        textNode.offsetSecondLine! > opts.trgElemOffsetY &&
        textNode.offsetLeft! > opts.trgElemOffsetX);

    return canGoUp;
  }

  canGoDown(textNode: TTextNode) {
    const opts = this.opts;

    let canGoDown =
      textNode.offsetSecondLine! < opts.trgElemOffsetY ||
      (textNode.offsetSecondLine! >= opts.trgElemOffsetY &&
        textNode.offsetTop! < opts.trgElemOffsetY &&
        opts.trgElemOffsetX > textNode!.offsetLeft!);

    return canGoDown;
  }

  positionCaretCore() {
    const opts = this.opts;
    let [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();

    while (splitPos > 0) {
      this.splitText(this.currentTextNode, splitPos);
      this.addToCurrentIdx(1);
      this.insertBefore(null);

      [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();

      if (splitPos < 0) {
        this.addToCurrentIdx(-1);
        this.insertBefore(null);

        [diffX, diffY, splitPos] = this.getCurrentTextSplitPos();
      }
    }
  }

  getCurrentTextSplitPos(): [number, number, number] {
    const opts = this.opts;
    const diffX = opts.trgElemOffsetX - this.currentTextNode.offsetLeft!;
    const diffY = opts.trgElemOffsetY - this.currentTextNode.offsetTop!;

    const textEndCoords = this.getCurrentTextEndCoords();

    const allowsSplit = diffY > opts.caretHeight || (diffY >= 0 && diffX >= 0);
    let ratio: number;

    if (allowsSplit) {
      if (diffY > opts.caretHeight) {
        ratio = 1 / Math.ceil(diffY / opts.caretHeight);
      } else {
        ratio =
          diffX /
          (textEndCoords.renderedTextLength - this.currentTextNode.offsetLeft!);
      }
    } else {
      ratio = -1;
    }

    const splitPos =
      ratio >= 0
        ? Math.floor(ratio * this.htmlGetText(this.currentTextNode.node).length)
        : -1;

    return [diffX, diffY, splitPos];
  }

  getCurrentTextEndCoords() {
    const opts = this.opts;
    let textEndCoords: TextEndCoords | null =
      this.currentTextNode.textEndCoords ?? null;

    if (!textEndCoords) {
      if (this.currentIdx < this.lastIdx) {
        const nextTextNode = this.textNodeArr[this.lastIdx];
        this.normTextNodeOffset(nextTextNode);

        this.currentTextNode.textEndCoords = textEndCoords =
          this.getTextNodeEndCoords(this.currentTextNode, nextTextNode);
      } else {
        this.currentTextNode.textEndCoords = textEndCoords =
          this.getTextNodeEndCoords(this.currentTextNode, {
            offsetLeft: this.endX,
            offsetTop: this.endY,
          } as TTextNode);
      }
    }

    return textEndCoords;
  }

  protected abstract getHcyElemBounds(
    rootElem: THTMLElement,
    trgElem: THTMLElement
  ): HtmlElementBounds[];

  protected abstract getMaxLineLength(opts: TOpts): number;
  protected abstract getCaretHeight(opts: TOpts): number;
  protected abstract getAllTextNodes(trgElem: THTMLElement): TTextNode[];

  protected abstract getOffsetLeft(elem: THTMLElement): number;
  protected abstract getOffsetTop(elem: THTMLElement): number;

  protected abstract normTextNodeOffset(textNode: TTextNode): void;

  protected abstract getTextNodeEndCoords(
    currentTextNode: TTextNode,
    nextTextNode: TTextNode
  ): TextEndCoords;

  protected abstract htmlGetText(node: TText): string;

  protected abstract htmlInsertBefore(
    prElem: THTMLElement,
    newChild: THTMLElement,
    existingSibbling: THTMLElement | TText | null
  ): void;

  protected abstract htmlGetNthChild(
    prElem: THTMLElement,
    idx: number
  ): THTMLElement | TText;

  setCurrentIdx(newCurrentIdx: number) {
    this.currentIdx = newCurrentIdx;
    this.currentTextNode = this.textNodeArr[newCurrentIdx];

    return this.currentTextNode;
  }

  addToCurrentIdx(toAdd: number) {
    const currentTextNode = this.setCurrentIdx(this.currentIdx + toAdd);
    return currentTextNode;
  }

  protected abstract splitText(
    textNode: TTextNode,
    splitOffset: number
  ): TTextNode;

  protected abstract insertBefore(textNode: TTextNode | null): void;
  protected abstract insertAfter(textNode: TTextNode | null): void;
}
