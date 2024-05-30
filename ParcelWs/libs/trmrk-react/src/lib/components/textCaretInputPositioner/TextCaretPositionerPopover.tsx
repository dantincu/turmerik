import React from "react";

import IconButton from "@mui/material/IconButton";

import { ValueOrAnyOrVoid } from "../../../trmrk/core";

import {
  TouchOrMouseCoords,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import { extractElCssStyleTopPx } from "../../../trmrk-browser/domUtils/css";
import { isMultilineInput } from "../../../trmrk-browser/domUtils/textInput";
import MatUIIcon from "../icons/MatUIIcon";

import TextCaretInputPositionerDefaultView from "./TextCaretInputPositionerDefaultView";
import TextCaretInputPositionerOptionsView from "./TextCaretInputPositionerOptionsView";
import TextCaretInputPositionerJumpSymbolsView from "./TextCaretInputPositionerJumpSymbolsView";
import TextCaretInputPositionerJumpLinesView from "./TextCaretInputPositionerJumpLinesView";

export enum TextCaretInputPositionerState {
  Default = 0,
  JumpSymbols,
  JumpLines
}

export interface TextInputCaretPositionerPopoverProps {
  inputEl: HTMLElement | null;
  inFrontOfAll?: boolean | null | undefined;
  minimized?: boolean | null | undefined;
  state?: TextCaretInputPositionerState | null | undefined;
  keepOpen?: boolean | null | undefined;
  showOptions?: boolean | null | undefined;
  showMoreOptions?: boolean | null | undefined;
  selectionIsActivated?: boolean | null | undefined;
  symbolsJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  linesJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  moving?: ((e: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords, rowsCount: number) => ValueOrAnyOrVoid<boolean>) | null | undefined;
  minimizedToggled?: ((minimized: boolean) => void) | null | undefined;
  stateChanged?: ((prevState: TextCaretInputPositionerState, currentState: TextCaretInputPositionerState) => void) | null | undefined;
  keepOpenToggled?: ((keepOpen: boolean) => void) | null | undefined;
  showOptionsToggled?: ((showOptions: boolean) => void) | null | undefined;
  showMoreOptionsToggled?: ((showMoreOptions: boolean) => void) | null | undefined;
  isFullViewScrollModeToggled?: ((isFullViewScrollMode: boolean) => void) | null | undefined;
  selectionIsActivatedToggled?: ((selectionIsActivated: boolean) => void) | null | undefined;
  closeClicked?: (() => void) | null | undefined;
}

export const defaultJumpSpeedsArr = Object.freeze([5, 25, 125]);
export const defaultSymbolsJumpSpeedsArr = defaultJumpSpeedsArr;
export const defaultLinesJumpSpeedsArr = defaultJumpSpeedsArr;

export const INPUT_CARET_POSITIONER_CSS_CLASS = "trmrk-text-input-caret-positioner-popover";
export const INPUT_CARET_POSITIONER_QUERY_SELECTOR = `.${INPUT_CARET_POSITIONER_CSS_CLASS}`;

export const retrieveTextInputCaretPositioner = () => document.querySelector<HTMLElement>(INPUT_CARET_POSITIONER_QUERY_SELECTOR);

export const cssClasses = Object.freeze({
  anchor: (left: boolean) => left ? "trmrk-anchor-left" : "trmrk-anchor-right",
  slide: (speed: number) => `trmrk-slide-speed-x${speed}`
});

export const longPressIntervalMs = 500;
export const startIntervalMs = 200;

export const normalizeJumpSpeedsArr = (
  jumpSpeedsArr: number[] | readonly number[] | null | undefined,
  dfJumpSpeedsArr: number[])  => {
  let retJumpSpeedsArr: number[];

  if (jumpSpeedsArr) {
    retJumpSpeedsArr = [...jumpSpeedsArr];

    dfJumpSpeedsArr.forEach((val, i) => {
      retJumpSpeedsArr[i] = Math.round(retJumpSpeedsArr[i] ?? val);
    });
  } else {
    retJumpSpeedsArr = dfJumpSpeedsArr;
  }

  return retJumpSpeedsArr;
}

export const normalizeSymbolsJumpSpeedsArr = (
  jumpSpeedsArr: number[] | readonly number[] | null | undefined) => normalizeJumpSpeedsArr(
    jumpSpeedsArr, [...defaultSymbolsJumpSpeedsArr]
  );

export const normalizeLinesJumpSpeedsArr = (
  jumpSpeedsArr: number[] | readonly number[] | null | undefined) => normalizeJumpSpeedsArr(
    jumpSpeedsArr, [...defaultLinesJumpSpeedsArr]
  );

export const normalizeInFrontOfAll = (
  inFrontOfAll: boolean | null | undefined
) => inFrontOfAll ?? true;

export const normalizeInputIsMultiline = (inputEl: HTMLElement | null) => inputEl ? isMultilineInput(inputEl) : null;
export const normalizeMininized = (minimized: boolean | null | undefined) => minimized ?? false;
export const normalizeState = (state: TextCaretInputPositionerState | null | undefined) => state ?? TextCaretInputPositionerState.Default;
export const normalizeKeepOpen = (keepOpen: boolean | null | undefined) => keepOpen ?? false;
export const normalizeShowOptions = (showOptions: boolean | null | undefined) => showOptions ?? false;
export const normalizeShowMoreOptions = (showMoreOptions: boolean | null | undefined) => showMoreOptions ?? false;

export const normalizeSelectionIsActivated = (
  inputEl: HTMLElement | null,
  selectionIsActivated: boolean | null | undefined) => !!inputEl && (selectionIsActivated ?? document.getSelection()?.containsNode(inputEl) ?? false);

export const getNextTopPx = (coords: TouchOrMouseCoords, moveStartCoords: TouchOrMouseCoords, bfMoveStartTopOffsetPx: number) => {
  const diffTop = coords.clientY - moveStartCoords.clientY;
  const topOffsetPxNum = bfMoveStartTopOffsetPx + diffTop;

  return topOffsetPxNum;
}

export default function TextInputCaretPositionerPopover(
  props: TextInputCaretPositionerPopoverProps
) {
  const mainElRef = React.useRef<HTMLDivElement | null>(null);
  const topBorderElRef = React.useRef<HTMLDivElement | null>(null);
  const bottomBorderElRef = React.useRef<HTMLDivElement | null>(null);

  const [ inputEl, setInputEl ] = React.useState(props.inputEl);
  
  const [ inputIsMultilinePropsVal, setInputIsMultilinePropsVal ] = React.useState(normalizeInputIsMultiline(props.inputEl));
  const [ inFrontOfAllPropsVal, setInFrontOfAllPropsVal ] = React.useState(normalizeInFrontOfAll(props.inFrontOfAll));
  const [ minimizedPropsVal, setMinimizedPropsVal ] = React.useState(normalizeMininized(props.minimized));
  const [ stateTypePropsVal, setStateTypePropsVal ] = React.useState(normalizeState(props.state));
  const [ keepOpenPropsVal, setKeepOpenPropsVal ] = React.useState(normalizeKeepOpen(props.keepOpen));
  const [ showOptionsPropsVal, setShowOptionsPropsVal ] = React.useState(normalizeShowOptions(props.showOptions));
  const [ showMoreOptionsPropsVal, setShowMoreOptionsPropsVal ] = React.useState(normalizeShowMoreOptions(props.showMoreOptions));

  const [ selectionIsActivatedPropsVal, setSelectionIsActivatedPropsVal ] = React.useState(normalizeSelectionIsActivated(
    props.inputEl, props.selectionIsActivated));

  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(inputIsMultilinePropsVal);
  const [ inFrontOfAll, setInFrontOfAll ] = React.useState(inFrontOfAllPropsVal);
  const [ minimized, setMinimized ] = React.useState(minimizedPropsVal);
  const [ stateType, setStateType ] = React.useState(stateTypePropsVal);
  const [ keepOpen, setKeepOpen ] = React.useState(keepOpenPropsVal);
  const [ showOptions, setShowOptions ] = React.useState(showOptionsPropsVal);
  const [ showMoreOptions, setShowMoreOptions ] = React.useState(showMoreOptionsPropsVal);
  const [ selectionIsActivated, setSelectionIsActivated ] = React.useState(selectionIsActivatedPropsVal);

  const [ symbolsJumpSpeedsArr, setSymbolsJumpSpeedsArr ] = React.useState(
    normalizeSymbolsJumpSpeedsArr(props.symbolsJumpSpeedsArr));

  const [ linesJumpSpeedsArr, setLinesJumpSpeedsArr ] = React.useState(
    normalizeLinesJumpSpeedsArr(props.linesJumpSpeedsArr));

  const withBorderElems = React.useCallback((
    callback: (topBorderAnimatorEl: HTMLElement, bottomBorderAnimatorEl: HTMLElement) => void
  ) => {
    const topBorderAnimatorEl = topBorderElRef.current;
    const bottomBorderAnimatorEl = bottomBorderElRef.current;

    if (topBorderAnimatorEl && bottomBorderAnimatorEl) {
      callback(topBorderAnimatorEl, bottomBorderAnimatorEl);
    }
  }, [topBorderElRef, bottomBorderElRef]);

  const moving = React.useCallback((rowsCount: number) => {
    const mainEl = mainElRef.current;

    if (mainEl) {
      const topOffsetPxNum = extractElCssStyleTopPx(mainEl);

      if ((topOffsetPxNum ?? null) !== null) {
        let nextTopOffsetPxNum = topOffsetPxNum! + rowsCount * mainEl.clientHeight;

        nextTopOffsetPxNum = Math.max(0, nextTopOffsetPxNum);
        nextTopOffsetPxNum = Math.min(nextTopOffsetPxNum, window.innerHeight - mainEl.clientHeight);

        mainEl.style.top = `${nextTopOffsetPxNum}px`;
      }
    }
  }, [mainElRef]);

  const moveBtnLongPressStarted = React.useCallback(() => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.add("trmrk-long-pressed");
      bottomBorderAnimatorEl.classList.add("trmrk-long-pressed");
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const moveBtnAfterLongPressStarted = React.useCallback(() => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove("trmrk-long-pressed");
      bottomBorderAnimatorEl.classList.remove("trmrk-long-pressed");
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const minimizeBtnClicked = React.useCallback(() => {
    const newMinimizedVal = true;
    const newShowOptionsVal = false;
    const newShowMoreOptionsVal = false;

    if (props.minimizedToggled) {
      props.minimizedToggled(newMinimizedVal);
    }

    if (props.showOptionsToggled) {
      props.showOptionsToggled(
        newShowOptionsVal
      );
    }

    setMinimized(newMinimizedVal);
    setShowOptions(newShowOptionsVal);
    setShowMoreOptions(newShowMoreOptionsVal);
  }, [minimized]);

  const mainBtnClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      if (minimized) {
        const newMinimizedVal = false;

        if (props.minimizedToggled) {
          props.minimizedToggled(newMinimizedVal);
        }
        
        setMinimized(newMinimizedVal);
      } else if (inputEl && inputIsMultiline !== null) {
        const newShowOptionsVal = !showOptions;
        const newShowMoreOptionsVal = newShowOptionsVal && showMoreOptions;

        if (props.showOptionsToggled) {
          props.showOptionsToggled(
            newShowOptionsVal
          );
        }
        
        setShowOptions(newShowOptionsVal);
        setShowMoreOptions(newShowMoreOptionsVal);
      }
    }
  }, [minimized, showOptions, showMoreOptions, inputEl, inputIsMultiline]);

  const showMoreOptionsBtnClicked = React.useCallback((showMoreOptions: boolean) => {
    const newShowMoreOptionsVal = showMoreOptions;

    if (props.showMoreOptionsToggled) {
      props.showMoreOptionsToggled(newShowMoreOptionsVal);
    }

    setShowMoreOptions(newShowMoreOptionsVal);
  }, []);

  const keepOpenToggled = React.useCallback((keepOpen: boolean) => {
    const newKeepOpenVal = keepOpen;

    if (props.keepOpenToggled) {
      props.keepOpenToggled(newKeepOpenVal);
    }

    setKeepOpen(newKeepOpenVal);
  }, []);

  const closeClicked = React.useCallback(() => {
    if (props.closeClicked) {
      props.closeClicked();
    }
  }, []);

  const onDefaultNextViewClick = React.useCallback(() => {
    const newStateType = TextCaretInputPositionerState.JumpSymbols;

    if (props.stateChanged) {
      props.stateChanged(stateType, newStateType);
    }

    setStateType(newStateType);
  }, [stateType]);

  const onJumpSymbolsNextViewClick = React.useCallback(() => {
    let newStateType: TextCaretInputPositionerState;

    if (inputIsMultiline) {
      newStateType = TextCaretInputPositionerState.JumpLines;
    } else {
      newStateType = TextCaretInputPositionerState.Default;
    }

    if (props.stateChanged) {
      props.stateChanged(stateType, newStateType);
    }
    
    setStateType(newStateType);
  }, [stateType, inputIsMultiline]);

  const onJumpLinesNextViewClick = React.useCallback(() => {
    const newStateType = TextCaretInputPositionerState.Default;

    if (props.stateChanged) {
      props.stateChanged(stateType, newStateType);
    }

    setStateType(newStateType);
  }, [stateType]);

  const selectionIsActivatedToggled = React.useCallback((selectionIsActivated: boolean) => {
    if (props.selectionIsActivatedToggled) {
      props.selectionIsActivatedToggled(selectionIsActivated);
    }

    setSelectionIsActivated(selectionIsActivated);
  }, [selectionIsActivated]);

  const viewBtnTouchStartOrMouseDown = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.add(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.add(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.add(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.add(cssClasses.slide(speed));
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const viewBtnShortPressed = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const viewBtnLongPressStarted = React.useCallback((speed: number) => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
      topBorderAnimatorEl.classList.add(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.add(cssClasses.slide(speed));
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const viewBtnLongPressEnded = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withBorderElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
    });
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpPrevLineTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpPrevLineShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, 1);
  }, []);

  const defaultViewJumpPrevLineLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const defaultViewJumpPrevLineLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, 1);
  }, []);

  const defaultViewJumpPrevWordTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpPrevWordShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, 2);
  }, []);

  const defaultViewJumpPrevWordLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const defaultViewJumpPrevWordLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, 2);
  }, []);

  const defaultViewJumpPrevCharTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpPrevCharShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, 1);
  }, []);

  const defaultViewJumpPrevCharLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const defaultViewJumpPrevCharLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, 1);
  }, []);

  const defaultViewJumpNextCharTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpNextCharShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 1);
  }, []);

  const defaultViewJumpNextCharLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const defaultViewJumpNextCharLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 1);
  }, []);

  const defaultViewJumpNextWordTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpNextWordShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 2);
  }, []);

  const defaultViewJumpNextWordLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const defaultViewJumpNextWordLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 2);
  }, []);

  const defaultViewJumpNextLineTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const defaultViewJumpNextLineShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, 1);
  }, []);

  const defaultViewJumpNextLineLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const defaultViewJumpNextLineLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, 1);
  }, []);

  const symbolsViewJumpPrevCharX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, 3);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpPrevCharX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, 3);
  }, []);

  const symbolsViewJumpPrevCharX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(3);
  }, []);

  const symbolsViewJumpPrevCharX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, 3);
  }, []);

  const symbolsViewJumpPrevCharX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpPrevCharX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, 2);
  }, []);

  const symbolsViewJumpPrevCharX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const symbolsViewJumpPrevCharX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, 2);
  }, []);

  const symbolsViewJumpPrevCharX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpPrevCharX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, 1);
  }, []);

  const symbolsViewJumpPrevCharX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const symbolsViewJumpPrevCharX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, 1);
  }, []);

  const symbolsViewJumpNextCharX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpNextCharX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 1);
  }, []);

  const symbolsViewJumpNextCharX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const symbolsViewJumpNextCharX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 1);
  }, []);

  const symbolsViewJumpNextCharX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpNextCharX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 2);
  }, []);

  const symbolsViewJumpNextCharX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const symbolsViewJumpNextCharX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 2);
  }, []);

  const symbolsViewJumpNextCharX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, 3);
  }, [topBorderElRef, bottomBorderElRef]);

  const symbolsViewJumpNextCharX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 3);
  }, []);

  const symbolsViewJumpNextCharX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(3);
  }, []);

  const symbolsViewJumpNextCharX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 3);
  }, []);

  const linesViewJumpPrevLineX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, 3);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpPrevLineX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, 3);
  }, []);

  const linesViewJumpPrevLineX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(3);
  }, []);

  const linesViewJumpPrevLineX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, 3);
  }, []);

  const linesViewJumpPrevLineX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpPrevLineX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, 2);
  }, []);

  const linesViewJumpPrevLineX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const linesViewJumpPrevLineX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, 2);
  }, []);

  const linesViewJumpPrevLineX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpPrevLineX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, 1);
  }, []);

  const linesViewJumpPrevLineX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const linesViewJumpPrevLineX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, 1);
  }, []);

  const linesViewJumpNextLineX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, 1);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpNextLineX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, 1);
  }, []);

  const linesViewJumpNextLineX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(1);
  }, []);

  const linesViewJumpNextLineX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, 1);
  }, []);

  const linesViewJumpNextLineX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, 2);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpNextLineX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, 2);
  }, []);

  const linesViewJumpNextLineX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(2);
  }, []);

  const linesViewJumpNextLineX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, 2);
  }, []);

  const linesViewJumpNextLineX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, 3);
  }, [topBorderElRef, bottomBorderElRef]);

  const linesViewJumpNextLineX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, 3);
  }, []);

  const linesViewJumpNextLineX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(3);
  }, []);

  const linesViewJumpNextLineX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, 3);
  }, []);

  React.useEffect(() => {
    const mainEl = mainElRef.current;
    const inFrontOfAllNewVal = normalizeInFrontOfAll(props.inFrontOfAll);
    const minimizedNewVal = normalizeMininized(props.minimized);
    const stateNewVal = normalizeState(props.state);
    const keepOpenNewVal = normalizeKeepOpen(props.keepOpen);
    const showOptionsNewVal = normalizeShowOptions(props.showOptions);
    const showMoreOptionsNewVal = normalizeShowMoreOptions(props.showMoreOptions);
    const selectionIsActivatedNewVal = normalizeSelectionIsActivated(props.inputEl, props.selectionIsActivated);

    if (inputEl !== props.inputEl) {
      const inputIsMultilineNewVal = normalizeInputIsMultiline(props.inputEl);

      if (!inputIsMultilineNewVal) {
        if (stateType === TextCaretInputPositionerState.JumpLines) {
          setStateType(TextCaretInputPositionerState.Default);
        }
      }

      setInputEl(props.inputEl);

      if (inputIsMultilineNewVal !== inputIsMultilinePropsVal) {
        setInputIsMultilinePropsVal(inputIsMultilineNewVal);
        setInputIsMultiline(inputIsMultilineNewVal);
      }
    }

    if (inFrontOfAllNewVal !== inFrontOfAllPropsVal) {
      setInFrontOfAllPropsVal(inFrontOfAllNewVal);
      setInFrontOfAll(inFrontOfAllNewVal);
    }

    if (minimizedNewVal !== minimizedPropsVal) {
      setMinimizedPropsVal(minimizedNewVal);
      setMinimized(minimizedNewVal);
    }

    if (stateNewVal !== stateTypePropsVal) {
      setStateTypePropsVal(stateNewVal);
      setStateType(stateNewVal);
    }

    if (keepOpenNewVal !== keepOpenPropsVal) {
      setKeepOpenPropsVal(keepOpenNewVal);
      setKeepOpen(keepOpenNewVal);
    }

    if (showOptionsNewVal !== showOptionsPropsVal) {
      setShowOptionsPropsVal(showOptionsNewVal);
      setShowOptions(showOptionsNewVal);
    }

    if (showMoreOptionsNewVal !== showMoreOptionsPropsVal) {
      setShowMoreOptionsPropsVal(showMoreOptionsNewVal);
      setShowMoreOptions(showMoreOptionsNewVal);
    }

    if (selectionIsActivatedNewVal !== selectionIsActivatedPropsVal) {
      setSelectionIsActivatedPropsVal(selectionIsActivatedNewVal);
      setSelectionIsActivated(selectionIsActivatedNewVal);
    }

    const onMainElMouseDownOrTouchEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
    }

    if (mainEl) {
      mainEl.addEventListener("touchend", onMainElMouseDownOrTouchEnd, {
        capture: true
      });

      mainEl.addEventListener("mousedown", onMainElMouseDownOrTouchEnd, {
        capture: true
      });
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener("touchend", onMainElMouseDownOrTouchEnd, {
          capture: true
        });

        mainEl.removeEventListener("mousedown", onMainElMouseDownOrTouchEnd, {
          capture: true
        });
      }
    };
  }, [
    props.inputEl,
    props.state,
    props.keepOpen,
    props.inFrontOfAll,
    props.minimized,
    props.showOptions,
    props.showMoreOptions,
    props.selectionIsActivated,
    props.symbolsJumpSpeedsArr,
    props.linesJumpSpeedsArr,
    inputEl,
    inFrontOfAllPropsVal,
    minimizedPropsVal,
    stateTypePropsVal,
    showOptionsPropsVal,
    showMoreOptionsPropsVal,
    inputIsMultilinePropsVal,
    selectionIsActivatedPropsVal,
    inFrontOfAll,
    minimized,
    stateType,
    keepOpen,
    showOptions,
    showMoreOptions,
    inputIsMultiline,
    selectionIsActivated,
    mainElRef,
  ]);

  const viewRetriever = React.useCallback(() => {
    if (minimized) {
      return null;
    }

    if (showOptions/*  || !inputEl || inputIsMultiline === null */) {
      return <TextCaretInputPositionerOptionsView
          minimizeClicked={minimizeBtnClicked}
          moving={moving}
          moveBtnLongPressStarted={moveBtnLongPressStarted}
          moveBtnAfterLongPressStarted={moveBtnAfterLongPressStarted}
          showMoreOptions={showMoreOptions}
          keepOpen={keepOpen}
          showMoreOptionsBtnClicked={showMoreOptionsBtnClicked}
          keepOpenToggled={keepOpenToggled}
          closeClicked={closeClicked} />;
    } else {
      switch (stateType) {
        case TextCaretInputPositionerState.JumpSymbols:
          return <TextCaretInputPositionerJumpSymbolsView
            nextViewClicked={onJumpSymbolsNextViewClick}
            selectionIsActivated={selectionIsActivated}
            selectionIsActivatedToggled={selectionIsActivatedToggled}
            jumpPrevCharX3TouchStartOrMouseDown={symbolsViewJumpPrevCharX3TouchStartOrMouseDown}
            jumpPrevCharX3ShortPressed={symbolsViewJumpPrevCharX3ShortPressed}
            jumpPrevCharX3LongPressStarted={symbolsViewJumpPrevCharX3LongPressStarted}
            jumpPrevCharX3LongPressEnded={symbolsViewJumpPrevCharX3LongPressEnded}
            jumpPrevCharX2TouchStartOrMouseDown={symbolsViewJumpPrevCharX2TouchStartOrMouseDown}
            jumpPrevCharX2ShortPressed={symbolsViewJumpPrevCharX2ShortPressed}
            jumpPrevCharX2LongPressStarted={symbolsViewJumpPrevCharX2LongPressStarted}
            jumpPrevCharX2LongPressEnded={symbolsViewJumpPrevCharX2LongPressEnded}
            jumpPrevCharX1TouchStartOrMouseDown={symbolsViewJumpPrevCharX1TouchStartOrMouseDown}
            jumpPrevCharX1ShortPressed={symbolsViewJumpPrevCharX1ShortPressed}
            jumpPrevCharX1LongPressStarted={symbolsViewJumpPrevCharX1LongPressStarted}
            jumpPrevCharX1LongPressEnded={symbolsViewJumpPrevCharX1LongPressEnded}
            jumpNextCharX1TouchStartOrMouseDown={symbolsViewJumpNextCharX1TouchStartOrMouseDown}
            jumpNextCharX1ShortPressed={symbolsViewJumpNextCharX1ShortPressed}
            jumpNextCharX1LongPressStarted={symbolsViewJumpNextCharX1LongPressStarted}
            jumpNextCharX1LongPressEnded={symbolsViewJumpNextCharX1LongPressEnded}
            jumpNextCharX2TouchStartOrMouseDown={symbolsViewJumpNextCharX2TouchStartOrMouseDown}
            jumpNextCharX2ShortPressed={symbolsViewJumpNextCharX2ShortPressed}
            jumpNextCharX2LongPressStarted={symbolsViewJumpNextCharX2LongPressStarted}
            jumpNextCharX2LongPressEnded={symbolsViewJumpNextCharX2LongPressEnded}
            jumpNextCharX3TouchStartOrMouseDown={symbolsViewJumpNextCharX3TouchStartOrMouseDown}
            jumpNextCharX3ShortPressed={symbolsViewJumpNextCharX3ShortPressed}
            jumpNextCharX3LongPressStarted={symbolsViewJumpNextCharX3LongPressStarted}
            jumpNextCharX3LongPressEnded={symbolsViewJumpNextCharX3LongPressEnded} />;

        case TextCaretInputPositionerState.JumpLines:
          if (inputIsMultiline) {
            return <TextCaretInputPositionerJumpLinesView
              nextViewClicked={onJumpLinesNextViewClick}
              selectionIsActivated={selectionIsActivated}
              selectionIsActivatedToggled={selectionIsActivatedToggled}
              jumpPrevLineX3TouchStartOrMouseDown={linesViewJumpPrevLineX3TouchStartOrMouseDown}
              jumpPrevLineX3ShortPressed={linesViewJumpPrevLineX3ShortPressed}
              jumpPrevLineX3LongPressStarted={linesViewJumpPrevLineX3LongPressStarted}
              jumpPrevLineX3LongPressEnded={linesViewJumpPrevLineX3LongPressEnded}
              jumpPrevLineX2TouchStartOrMouseDown={linesViewJumpPrevLineX2TouchStartOrMouseDown}
              jumpPrevLineX2ShortPressed={linesViewJumpPrevLineX2ShortPressed}
              jumpPrevLineX2LongPressStarted={linesViewJumpPrevLineX2LongPressStarted}
              jumpPrevLineX2LongPressEnded={linesViewJumpPrevLineX2LongPressEnded}
              jumpPrevLineX1TouchStartOrMouseDown={linesViewJumpPrevLineX1TouchStartOrMouseDown}
              jumpPrevLineX1ShortPressed={linesViewJumpPrevLineX1ShortPressed}
              jumpPrevLineX1LongPressStarted={linesViewJumpPrevLineX1LongPressStarted}
              jumpPrevLineX1LongPressEnded={linesViewJumpPrevLineX1LongPressEnded}
              jumpNextLineX1TouchStartOrMouseDown={linesViewJumpNextLineX1TouchStartOrMouseDown}
              jumpNextLineX1ShortPressed={linesViewJumpNextLineX1ShortPressed}
              jumpNextLineX1LongPressStarted={linesViewJumpNextLineX1LongPressStarted}
              jumpNextLineX1LongPressEnded={linesViewJumpNextLineX1LongPressEnded}
              jumpNextLineX2TouchStartOrMouseDown={linesViewJumpNextLineX2TouchStartOrMouseDown}
              jumpNextLineX2ShortPressed={linesViewJumpNextLineX2ShortPressed}
              jumpNextLineX2LongPressStarted={linesViewJumpNextLineX2LongPressStarted}
              jumpNextLineX2LongPressEnded={linesViewJumpNextLineX2LongPressEnded}
              jumpNextLineX3TouchStartOrMouseDown={linesViewJumpNextLineX3TouchStartOrMouseDown}
              jumpNextLineX3ShortPressed={linesViewJumpNextLineX3ShortPressed}
              jumpNextLineX3LongPressStarted={linesViewJumpNextLineX3LongPressStarted}
              jumpNextLineX3LongPressEnded={linesViewJumpNextLineX3LongPressEnded} />;
          }
          
          return null;
        default:
          return <TextCaretInputPositionerDefaultView
            inputIsMultiline={inputIsMultiline ?? false}
            selectionIsActivated={selectionIsActivated}
            selectionIsActivatedToggled={selectionIsActivatedToggled}
            nextViewClicked={onDefaultNextViewClick}
            jumpPrevLineTouchStartOrMouseDown={defaultViewJumpPrevLineTouchStartOrMouseDown}
            jumpPrevLineShortPressed={defaultViewJumpPrevLineShortPressed}
            jumpPrevLineLongPressStarted={defaultViewJumpPrevLineLongPressStarted}
            jumpPrevLineLongPressEnded={defaultViewJumpPrevLineLongPressEnded}
            jumpPrevWordTouchStartOrMouseDown={defaultViewJumpPrevWordTouchStartOrMouseDown}
            jumpPrevWordShortPressed={defaultViewJumpPrevWordShortPressed}
            jumpPrevWordLongPressStarted={defaultViewJumpPrevWordLongPressStarted}
            jumpPrevWordLongPressEnded={defaultViewJumpPrevWordLongPressEnded}
            jumpPrevCharTouchStartOrMouseDown={defaultViewJumpPrevCharTouchStartOrMouseDown}
            jumpPrevCharShortPressed={defaultViewJumpPrevCharShortPressed}
            jumpPrevCharLongPressStarted={defaultViewJumpPrevCharLongPressStarted}
            jumpPrevCharLongPressEnded={defaultViewJumpPrevCharLongPressEnded}
            jumpNextCharTouchStartOrMouseDown={defaultViewJumpNextCharTouchStartOrMouseDown}
            jumpNextCharShortPressed={defaultViewJumpNextCharShortPressed}
            jumpNextCharLongPressStarted={defaultViewJumpNextCharLongPressStarted}
            jumpNextCharLongPressEnded={defaultViewJumpNextCharLongPressEnded}
            jumpNextWordTouchStartOrMouseDown={defaultViewJumpNextWordTouchStartOrMouseDown}
            jumpNextWordShortPressed={defaultViewJumpNextWordShortPressed}
            jumpNextWordLongPressStarted={defaultViewJumpNextWordLongPressStarted}
            jumpNextWordLongPressEnded={defaultViewJumpNextWordLongPressEnded}
            jumpNextLineTouchStartOrMouseDown={defaultViewJumpNextLineTouchStartOrMouseDown}
            jumpNextLineShortPressed={defaultViewJumpNextLineShortPressed}
            jumpNextLineLongPressStarted={defaultViewJumpNextLineLongPressStarted}
            jumpNextLineLongPressEnded={defaultViewJumpNextLineLongPressEnded} />;
      }
    }
  }, [inputEl, inFrontOfAll, inputIsMultiline, selectionIsActivated, stateType, minimized, keepOpen, showOptions, showMoreOptions]);

  return (<div className={[INPUT_CARET_POSITIONER_CSS_CLASS,
    minimized ? "trmrk-minimized" : "",
    inFrontOfAll ? "trmrk-in-front-of-all" : "" ].join(" ")} ref={el => mainElRef.current = el}>
      <div className="trmrk-popover-top-border" ref={el => topBorderElRef.current = el}>
        &nbsp;
      </div>
      <div className="trmrk-popover-bottom-border" ref={el => bottomBorderElRef.current = el}>
        &nbsp;
      </div>
      <div className="trmrk-text-input-caret-positioner">
        <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
          onMouseDown={mainBtnClicked}
          onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
        { viewRetriever() }
      </div>
  </div>);
}
