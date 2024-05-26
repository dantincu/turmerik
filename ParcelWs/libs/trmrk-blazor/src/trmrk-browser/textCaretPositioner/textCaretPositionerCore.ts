import { findKvp, withVal } from "../../trmrk/core";

import { HtmlElementBounds } from "../domUtils/getDomElemBounds";

export enum CaretCharJustify {
  Closest = 0,
  Left,
  Right,
}

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
  caretCharJustify: CaretCharJustify | null | undefined;
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
}

export interface CursorPositionOptsCore<
  TText,
  TTextNode extends TextNodeCore<TText>
> {
  caretCharJustify: CaretCharJustify | null | undefined;
  offsetLeft: number;
  offsetTop: number;
  lineHeight: number;
  textNodesArr: TTextNode[];
  caretPositioner: (textNode: TTextNode) => void;
  textEndCoordsFactory: (
    currentNode: TTextNode,
    nextNode: TTextNode | null,
    currentIdx: number,
    textNodesArr: TTextNode[]
  ) => TextEndCoords;
  textSplitter: (
    textNode: TTextNode,
    charIdx: number
  ) => [TTextNode, TTextNode];
  textRetriever: (textNode: TTextNode) => string;
}

export interface TextNodeTuple<TText, TTextNode extends TextNodeCore<TText>> {
  currentIdx: number;
  current: TTextNode | null;
  nextArr: TTextNode[];
}

export interface CursorPositionResult {
  charIdx: number;
  offsetTop: number;
  offsetLeft: number;
}

export const getCursorPosition = <TText, TTextNode extends TextNodeCore<TText>>(
  opts: CursorPositionOptsCore<TText, TTextNode>
): CursorPositionResult | null => {
  const [result, { currentIdx, current, nextArr }] =
    getCursorPositionCore(opts);

  let retResult = result;
  let retIdx = currentIdx;

  const nextNode = nextArr[0] ?? null;

  if (current && nextNode) {
    const leftDiff = opts.offsetLeft - current.offsetLeft!;
    const rightDiff = nextNode.offsetLeft! - opts.offsetLeft;

    if (
      opts.caretCharJustify !== CaretCharJustify.Left &&
      leftDiff > 0 &&
      rightDiff >= 0 &&
      (opts.caretCharJustify === CaretCharJustify.Right || leftDiff > rightDiff)
    ) {
      opts.caretPositioner(nextNode);
      retIdx++;

      retResult = {
        offsetLeft: nextNode.offsetLeft!,
        offsetTop: nextNode.offsetTop!,
      } as CursorPositionResult;
    }
  }

  if (retResult) {
    retResult.charIdx = getCharIdx(opts, retIdx, 0);
  }

  return retResult;
};

export const getCursorPositionCore = <
  TText,
  TTextNode extends TextNodeCore<TText>
>(
  opts: CursorPositionOptsCore<TText, TTextNode>
): [CursorPositionResult | null, TextNodeTuple<TText, TTextNode>] => {
  const nextNodeTuple = getTrgTextNode(opts);
  let { current, currentIdx } = nextNodeTuple;

  let retResult: CursorPositionResult | null = null;
  let retTuple = nextNodeTuple;

  if (current) {
    const nodeText = opts.textRetriever(current);

    if (nodeText.length > 1) {
      const charIdx = Math.max(1, Math.floor(nodeText.length / 2));
      const splitArr = opts.textSplitter(current, charIdx);
      current.textEndCoords = null;
      opts.textNodesArr.splice(currentIdx + 1, 0, splitArr[1]);

      const [_, tuple] = getCursorPositionCore({
        caretCharJustify: opts.caretCharJustify,
        offsetLeft: opts.offsetLeft,
        offsetTop: opts.offsetTop,
        lineHeight: opts.lineHeight,
        textNodesArr: splitArr,
        caretPositioner: opts.caretPositioner,
        textEndCoordsFactory: opts.textEndCoordsFactory,
        textSplitter: opts.textSplitter,
        textRetriever: opts.textRetriever,
      });

      current = tuple.current!;
      retTuple.current = current;
      retTuple.currentIdx += tuple.currentIdx;

      if (tuple.nextArr) {
        retTuple.nextArr = tuple.nextArr;
      }
    }

    retResult = {
      offsetLeft: current.offsetLeft!,
      offsetTop: current.offsetTop!,
    } as CursorPositionResult;
  }

  return [retResult, retTuple];
};

export const getCharIdx = <TText, TTextNode extends TextNodeCore<TText>>(
  opts: CursorPositionOptsCore<TText, TTextNode>,
  lastIdx: number,
  charIdx: number
) =>
  charIdx +
  opts.textNodesArr
    .filter((_, idx) => idx < lastIdx)
    .map((node) => opts.textRetriever(node).length)
    .reduce((a, b) => a + b, 0);

export const getTrgTextNode = <TText, TTextNode extends TextNodeCore<TText>>(
  opts: CursorPositionOptsCore<TText, TTextNode>
) => {
  const kvp =
    findKvp(opts.textNodesArr, (currentTextNode, idx) => {
      opts.caretPositioner(currentTextNode);
      let nextTextNode = opts.textNodesArr[idx + 1] ?? null;

      if (nextTextNode) {
        opts.caretPositioner(nextTextNode);
      }

      const textEndCoords = (currentTextNode.textEndCoords ??=
        opts.textEndCoordsFactory(
          currentTextNode,
          nextTextNode,
          idx,
          opts.textNodesArr
        ));

      const offsetTopDiff = opts.offsetTop - currentTextNode.offsetTop!;
      const offsetLeftDiff = opts.offsetLeft - currentTextNode.offsetLeft!;

      const offsetBottomDiff = textEndCoords.nextOffsetTop - opts.offsetTop;
      const offsetRightDiff = textEndCoords.nextOffsetLeft - opts.offsetLeft;

      let matches =
        offsetTopDiff >= opts.lineHeight ||
        (offsetTopDiff >= 0 && offsetLeftDiff >= 0);

      if (matches) {
        matches =
          offsetBottomDiff > 0 ||
          (offsetBottomDiff > -opts.lineHeight && offsetRightDiff >= 0);
      }

      return matches;
    }) ?? null;

  const retObj: TextNodeTuple<TText, TTextNode> = {
    currentIdx: kvp.key,
    current: kvp.value,
    nextArr: [],
  };

  if (kvp.value) {
    retObj.nextArr = opts.textNodesArr.slice(kvp.key + 1, kvp.key + 3);
  }

  return retObj;
};