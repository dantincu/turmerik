import React from "react";

import IconButton from "@mui/material/IconButton";

import trmrk from "../../../trmrk";
import { ValueOrAnyOrVoid } from "../../../trmrk/core";

import {
  TouchOrMouseCoords, getSingleTouchOrClick
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import { extractElCssStyleTopPx } from "../../../trmrk-browser/domUtils/css";
import { isMultilineInput } from "../../../trmrk-browser/domUtils/textInput";
import MatUIIcon from "../icons/MatUIIcon";

import TextInputCaretPositionerDefaultView from "./TextInputCaretPositionerDefaultView";
import TextInputCaretPositionerOptionsView from "./TextInputCaretPositionerOptionsView";
import TextInputCaretPositionerJumpSymbolsView from "./TextInputCaretPositionerJumpSymbolsView";
import TextInputCaretPositionerJumpLinesView from "./TextInputCaretPositionerJumpLinesView";
import TextInputCaretPositionerMoveAndResizeView, { TextInputCaretPositionerMoveAndResizeState } from "./TextInputCaretPositionerMoveAndResizeView";

export const wordSepChars = trmrk.freezeMx([['<', '>'], ['-', ';', ',', '.']]);

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
  isForFullViewPortMode: boolean;
  isMoveAndResizeMode: boolean;
  moveAndResizeState?: TextInputCaretPositionerMoveAndResizeState | null | undefined;
  symbolsJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  linesJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  onMainEl: (el: HTMLElement | null) => void;
  minimizedToggled?: ((minimized: boolean) => void) | null | undefined;
  stateChanged?: ((prevState: TextCaretInputPositionerState, currentState: TextCaretInputPositionerState) => void) | null | undefined;
  keepOpenToggled?: ((keepOpen: boolean) => void) | null | undefined;
  showOptionsToggled?: ((showOptions: boolean) => void) | null | undefined;
  selectionIsActivatedToggled?: ((selectionIsActivated: boolean) => void) | null | undefined;
  showMoreOptionsToggled?: ((showMoreOptions: boolean) => void) | null | undefined;
  isFullViewPortModeToggled: (isFullViewPortMode: boolean) => void;
  isMoveAndResizeModeToggled: (isMoveAndResizeMode: boolean) => void;
  moveAndResizeStateChanged: (
    moveAndResizeState: TextInputCaretPositionerMoveAndResizeState,
    ev: React.TouchEvent | React.MouseEvent,
    coords: TouchOrMouseCoords) => void;
  onMainElTouchStartOrMouseDown?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onMainElTouchOrMouseMove?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onMainElTouchEndOrMouseUp?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  closeClicked?: (() => void) | null | undefined;
}

export const defaultJumpSpeedsArr = Object.freeze([5, 25, 125]);
export const defaultSymbolsJumpSpeedsArr = defaultJumpSpeedsArr;
export const defaultLinesJumpSpeedsArr = defaultJumpSpeedsArr;

export const INPUT_CARET_POSITIONER_CSS_CLASS = "trmrk-text-input-caret-positioner-popover";
export const INPUT_CARET_POSITIONER_QUERY_SELECTOR = `.${INPUT_CARET_POSITIONER_CSS_CLASS}`;

export const retrieveTextInputCaretPositioner = () => document.querySelector<HTMLElement>(INPUT_CARET_POSITIONER_QUERY_SELECTOR);

export const cssClasses = Object.freeze({
  slide: "trmrk-slide",
  slideSpeed: (speed: number) => `trmrk-slide-speed-x${speed}`,
  reversed: "trmrk-animation-reversed"
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

export const normalizeIsForFullViewPortMode = (isForFullViewPortMode: boolean | null | undefined) => isForFullViewPortMode ?? false;
export const normalizeIsMoveAndResizeMode = (isMoveAndResizeMode: boolean | null | undefined) => isMoveAndResizeMode ?? false;

export const getBackDropIsShown = (isMoveModePropsVal: boolean, isResizeModePropsVal: boolean) => isMoveModePropsVal || isResizeModePropsVal;

export const getNextTopPx = (coords: TouchOrMouseCoords, moveStartCoords: TouchOrMouseCoords, bfMoveStartTopOffsetPx: number) => {
  const diffTop = coords.clientY - moveStartCoords.clientY;
  const topOffsetPxNum = bfMoveStartTopOffsetPx + diffTop;

  return topOffsetPxNum;
}

export default function TextInputCaretPositionerPopover(
  props: TextInputCaretPositionerPopoverProps
) {
  const mainElRef = React.useRef<HTMLDivElement | null>(null);
  const topBorderAnimatorElRef = React.useRef<HTMLDivElement | null>(null);
  const bottomBorderAnimatorElRef = React.useRef<HTMLDivElement | null>(null);
  const leftBorderAnimatorElRef = React.useRef<HTMLDivElement | null>(null);
  const rightBorderAnimatorElRef = React.useRef<HTMLDivElement | null>(null);

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

  const [ isForFullViewPortModePropsVal, setIsForFullViewPortModePropsVal ] = React.useState(props.isForFullViewPortMode);
  const [ isMoveAndResizeModePropsVal, setIsMoveAndResizeModePropsVal ] = React.useState(props.isMoveAndResizeMode);
  const [ moveAndResizeStatePropsVal, setMoveAndResizeStatePropsVal ] = React.useState(props.moveAndResizeState);

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

  const withBorderAnimatorElems = React.useCallback((
    callback: (
      topBorderAnimatorEl: HTMLElement,
      bottomBorderAnimatorEl: HTMLElement,
      leftBorderAnimatorEl: HTMLElement,
      rightBorderAnimatorEl: HTMLElement) => void
  ) => {
    const topBorderAnimatorEl = topBorderAnimatorElRef.current;
    const bottomBorderAnimatorEl = bottomBorderAnimatorElRef.current;

    const leftBorderAnimatorEl = leftBorderAnimatorElRef.current;
    const rightBorderAnimatorEl = rightBorderAnimatorElRef.current;

    if (topBorderAnimatorEl && bottomBorderAnimatorEl && leftBorderAnimatorEl && rightBorderAnimatorEl) {
      callback(topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl);
    }
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

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

  const isFullViewPortModeToggled = React.useCallback((isFullViewPortMode: boolean) => {
    props.isFullViewPortModeToggled(isFullViewPortMode);
  }, [isForFullViewPortModePropsVal]);

  const isMoveAndResizeModeToggled = React.useCallback((isMoveAndResizeMode: boolean) => {
    props.isMoveAndResizeModeToggled(isMoveAndResizeMode);
  }, [isMoveAndResizeModePropsVal]);

  const moveAndResizeStateChanged = React.useCallback((
    moveAndResizeState: TextInputCaretPositionerMoveAndResizeState,
    ev: React.TouchEvent | React.MouseEvent,
    coords: TouchOrMouseCoords) => {
    props.moveAndResizeStateChanged(moveAndResizeState, ev, coords);
  }, [moveAndResizeStatePropsVal]);

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

  const clearAnimatorsClasses = React.useCallback((
    topBorderAnimatorEl: HTMLElement, bottomBorderAnimatorEl: HTMLElement,
    leftBorderAnimatorEl: HTMLElement, rightBorderAnimatorEl: HTMLElement) => {
    topBorderAnimatorEl.setAttribute("class", "trmrk-animator");
    bottomBorderAnimatorEl.setAttribute("class", "trmrk-animator");
    leftBorderAnimatorEl.setAttribute("class", "trmrk-animator");
    rightBorderAnimatorEl.setAttribute("class", "trmrk-animator");
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const viewBtnTouchStartOrMouseDown = React.useCallback((
    topBorderDfDir: boolean, bottomBorderDfDir: boolean, leftBorderDfDir: boolean, rightBorderDfDir: boolean, speed: number) => {
    withBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.add(cssClasses.slide);
      topBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!topBorderDfDir) {
        topBorderAnimatorEl.classList.add(cssClasses.reversed);
      }

      bottomBorderAnimatorEl.classList.add(cssClasses.slide);
      bottomBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!bottomBorderDfDir) {
        bottomBorderAnimatorEl.classList.add(cssClasses.reversed);
      }
      
      leftBorderAnimatorEl.classList.add(cssClasses.slide);
      leftBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!leftBorderDfDir) {
        leftBorderAnimatorEl.classList.add(cssClasses.reversed);
      }

      rightBorderAnimatorEl.classList.add(cssClasses.slide);
      rightBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!rightBorderDfDir) {
        rightBorderAnimatorEl.classList.add(cssClasses.reversed);
      }
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const viewBtnTouchStartOrMouseDownDelayed = React.useCallback((
    topBorderDfDir: boolean, bottomBorderDfDir: boolean, leftBorderDfDir: boolean, rightBorderDfDir: boolean, speed: number) => {
    withBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl) => {
      clearAnimatorsClasses(topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl);
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const viewBtnShortPressed = React.useCallback((
    topBorderDfDir: boolean, bottomBorderDfDir: boolean, leftBorderDfDir: boolean, rightBorderDfDir: boolean, speed: number) => {
    withBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl) => {
      clearAnimatorsClasses(topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl);
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const viewBtnLongPressStarted = React.useCallback((
    topBorderDfDir: boolean, bottomBorderDfDir: boolean, leftBorderDfDir: boolean, rightBorderDfDir: boolean, speed: number) => {
    withBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));
      topBorderAnimatorEl.classList.add(cssClasses.slide);

      if (!topBorderDfDir) {
        topBorderAnimatorEl.classList.add(cssClasses.reversed);
      }

      bottomBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));
      bottomBorderAnimatorEl.classList.add(cssClasses.slide);
      
      if (!bottomBorderDfDir) {
        bottomBorderAnimatorEl.classList.add(cssClasses.reversed);
      }
      
      leftBorderAnimatorEl.classList.add(cssClasses.slide);
      leftBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!leftBorderDfDir) {
        leftBorderAnimatorEl.classList.add(cssClasses.reversed);
      }

      rightBorderAnimatorEl.classList.add(cssClasses.slide);
      rightBorderAnimatorEl.classList.add(cssClasses.slideSpeed(speed));

      if (!rightBorderDfDir) {
        rightBorderAnimatorEl.classList.add(cssClasses.reversed);
      }
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const viewBtnLongPressEnded = React.useCallback((
    topBorderDfDir: boolean, bottomBorderDfDir: boolean, leftBorderDfDir: boolean, rightBorderDfDir: boolean, speed: number) => {
    withBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl) => {
      clearAnimatorsClasses(topBorderAnimatorEl, bottomBorderAnimatorEl, leftBorderAnimatorEl, rightBorderAnimatorEl);
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevLineTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevLineTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevLineShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevLineLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevLineLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevWordTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevWordTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevWordShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevWordLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevWordLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, true, false,  2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevCharTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevCharTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevCharShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevCharLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpPrevCharLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextCharTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextCharTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextCharShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextCharLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextCharLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextWordTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextWordTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextWordShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextWordLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextWordLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextLineTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextLineTouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextLineShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextLineLongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const defaultViewJumpNextLineLongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, true, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX3TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, true, true, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, true, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, true, true, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, true, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX2TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, true, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX1TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpPrevCharX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, true, true, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX1TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX2TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, false, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, false, false, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, false, false, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, false, false, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, false, false, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, false, false, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, true, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX3TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, true, true, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, true, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, true, true, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, true, true, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, true, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX2TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, true, true, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, true, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, true, true, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, true, true, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX1TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpPrevLineX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(true, true, true, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX1TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX1TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX1ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX1LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX1LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, false, false, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX2TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, false, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX2TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, false, false, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX2ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, false, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX2LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, false, false, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX2LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, false, false, 2);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX3TouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, false, false, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX3TouchStartOrMouseDownDelayed = React.useCallback(() => {
    viewBtnTouchStartOrMouseDownDelayed(false, false, false, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, false, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(false, false, false, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  const linesViewJumpNextLineX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, false, false, 3);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef, leftBorderAnimatorElRef, rightBorderAnimatorElRef]);

  React.useEffect(() => {
    const mainEl = mainElRef.current;
    const inFrontOfAllNewVal = normalizeInFrontOfAll(props.inFrontOfAll);
    const minimizedNewVal = normalizeMininized(props.minimized);
    const stateNewVal = normalizeState(props.state);
    const keepOpenNewVal = normalizeKeepOpen(props.keepOpen);
    const showOptionsNewVal = normalizeShowOptions(props.showOptions);
    const showMoreOptionsNewVal = normalizeShowMoreOptions(props.showMoreOptions);
    const selectionIsActivatedNewVal = normalizeSelectionIsActivated(props.inputEl, props.selectionIsActivated);
    const isFullViewPortModeNewVal = props.isForFullViewPortMode;
    const isMoveAndResizeModeNewVal = props.isMoveAndResizeMode;
    const moveAndResizeStateNewVal = props.moveAndResizeState;

    props.onMainEl(mainEl);

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

    if (isFullViewPortModeNewVal !== isForFullViewPortModePropsVal) {
      setIsForFullViewPortModePropsVal(isForFullViewPortModePropsVal);
    }

    if (isMoveAndResizeModeNewVal !== isMoveAndResizeModePropsVal) {
      setIsMoveAndResizeModePropsVal(isMoveAndResizeModeNewVal);
    }

    if (moveAndResizeStateNewVal !== moveAndResizeStatePropsVal) {
      setMoveAndResizeStatePropsVal(moveAndResizeStateNewVal);
    }

    const onMainElTouchStartOrMouseDown = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();

      if (props.onMainElTouchStartOrMouseDown) {
        const coords = getSingleTouchOrClick(e);

        if (coords) {
          props.onMainElTouchStartOrMouseDown(e, coords);
        }
      }
    }

    const onMainElTouchOrMouseMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();

      if (props.onMainElTouchOrMouseMove) {
        const coords = getSingleTouchOrClick(e);

        if (coords) {
          props.onMainElTouchOrMouseMove(e, coords);
        }
      }
    }

    const onMainElTouchEndOrMouseUp = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();

      if (props.onMainElTouchEndOrMouseUp) {
        const coords = getSingleTouchOrClick(e);

        if (coords) {
          props.onMainElTouchEndOrMouseUp(e, coords);
        }
      }
    }

    if (mainEl) {
      mainEl.addEventListener("touchstart", onMainElTouchStartOrMouseDown, {
        capture: true
      });

      mainEl.addEventListener("mousedown", onMainElTouchStartOrMouseDown, {
        capture: true
      });

      mainEl.addEventListener("touchmove", onMainElTouchOrMouseMove, {
        capture: true
      });

      mainEl.addEventListener("mousemove", onMainElTouchOrMouseMove, {
        capture: true
      });

      mainEl.addEventListener("touchend", onMainElTouchEndOrMouseUp, {
        capture: true
      });

      mainEl.addEventListener("mouseup", onMainElTouchEndOrMouseUp, {
        capture: true
      });
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener("touchstart", onMainElTouchStartOrMouseDown, {
          capture: true
        });

        mainEl.removeEventListener("mousedown", onMainElTouchStartOrMouseDown, {
          capture: true
        });

        mainEl.removeEventListener("touchmove", onMainElTouchOrMouseMove, {
          capture: true
        });

        mainEl.removeEventListener("mousemove", onMainElTouchOrMouseMove, {
          capture: true
        });

        mainEl.removeEventListener("touchend", onMainElTouchEndOrMouseUp, {
          capture: true
        });

        mainEl.removeEventListener("mouseup", onMainElTouchEndOrMouseUp, {
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
    props.isForFullViewPortMode,
    props.isMoveAndResizeMode,
    props.moveAndResizeState,
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
    isForFullViewPortModePropsVal,
    isMoveAndResizeModePropsVal,
    moveAndResizeStatePropsVal,
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

    if (isMoveAndResizeModePropsVal) {
      return <TextInputCaretPositionerMoveAndResizeView
        state={moveAndResizeStatePropsVal!}
        moveAndResizeStateChanged={moveAndResizeStateChanged} />;
    } else if (showOptions || !inputEl || inputIsMultiline === null) {
      return <TextInputCaretPositionerOptionsView
        minimizeClicked={minimizeBtnClicked}
        showMoreOptions={showMoreOptions || isForFullViewPortModePropsVal}
        keepOpen={keepOpen}
        isForFullViewPortMode={isForFullViewPortModePropsVal}
        isMoveAndResizeMode={isMoveAndResizeModePropsVal}
        showMoreOptionsBtnClicked={showMoreOptionsBtnClicked}
        keepOpenToggled={keepOpenToggled}
        isFullViewPortModeToggled={isFullViewPortModeToggled}
        isMoveAndResizeModeToggled={isMoveAndResizeModeToggled}
        closeClicked={closeClicked} />;
    } else {
      switch (stateType) {
        case TextCaretInputPositionerState.JumpSymbols:
          return <TextInputCaretPositionerJumpSymbolsView
            nextViewClicked={onJumpSymbolsNextViewClick}
            selectionIsActivated={selectionIsActivated}
            selectionIsActivatedToggled={selectionIsActivatedToggled}
            jumpPrevCharX3TouchStartOrMouseDown={symbolsViewJumpPrevCharX3TouchStartOrMouseDown}
            jumpPrevCharX3TouchStartOrMouseDownDelayed={symbolsViewJumpPrevCharX3TouchStartOrMouseDownDelayed}
            jumpPrevCharX3ShortPressed={symbolsViewJumpPrevCharX3ShortPressed}
            jumpPrevCharX3LongPressStarted={symbolsViewJumpPrevCharX3LongPressStarted}
            jumpPrevCharX3LongPressEnded={symbolsViewJumpPrevCharX3LongPressEnded}
            jumpPrevCharX2TouchStartOrMouseDown={symbolsViewJumpPrevCharX2TouchStartOrMouseDown}
            jumpPrevCharX2TouchStartOrMouseDownDelayed={symbolsViewJumpPrevCharX2TouchStartOrMouseDownDelayed}
            jumpPrevCharX2ShortPressed={symbolsViewJumpPrevCharX2ShortPressed}
            jumpPrevCharX2LongPressStarted={symbolsViewJumpPrevCharX2LongPressStarted}
            jumpPrevCharX2LongPressEnded={symbolsViewJumpPrevCharX2LongPressEnded}
            jumpPrevCharX1TouchStartOrMouseDown={symbolsViewJumpPrevCharX1TouchStartOrMouseDown}
            jumpPrevCharX1TouchStartOrMouseDownDelayed={symbolsViewJumpPrevCharX1TouchStartOrMouseDownDelayed}
            jumpPrevCharX1ShortPressed={symbolsViewJumpPrevCharX1ShortPressed}
            jumpPrevCharX1LongPressStarted={symbolsViewJumpPrevCharX1LongPressStarted}
            jumpPrevCharX1LongPressEnded={symbolsViewJumpPrevCharX1LongPressEnded}
            jumpNextCharX1TouchStartOrMouseDown={symbolsViewJumpNextCharX1TouchStartOrMouseDown}
            jumpNextCharX1TouchStartOrMouseDownDelayed={symbolsViewJumpNextCharX1TouchStartOrMouseDownDelayed}
            jumpNextCharX1ShortPressed={symbolsViewJumpNextCharX1ShortPressed}
            jumpNextCharX1LongPressStarted={symbolsViewJumpNextCharX1LongPressStarted}
            jumpNextCharX1LongPressEnded={symbolsViewJumpNextCharX1LongPressEnded}
            jumpNextCharX2TouchStartOrMouseDown={symbolsViewJumpNextCharX2TouchStartOrMouseDown}
            jumpNextCharX2TouchStartOrMouseDownDelayed={symbolsViewJumpNextCharX2TouchStartOrMouseDownDelayed}
            jumpNextCharX2ShortPressed={symbolsViewJumpNextCharX2ShortPressed}
            jumpNextCharX2LongPressStarted={symbolsViewJumpNextCharX2LongPressStarted}
            jumpNextCharX2LongPressEnded={symbolsViewJumpNextCharX2LongPressEnded}
            jumpNextCharX3TouchStartOrMouseDown={symbolsViewJumpNextCharX3TouchStartOrMouseDown}
            jumpNextCharX3TouchStartOrMouseDownDelayed={symbolsViewJumpNextCharX3TouchStartOrMouseDownDelayed}
            jumpNextCharX3ShortPressed={symbolsViewJumpNextCharX3ShortPressed}
            jumpNextCharX3LongPressStarted={symbolsViewJumpNextCharX3LongPressStarted}
            jumpNextCharX3LongPressEnded={symbolsViewJumpNextCharX3LongPressEnded} />;

        case TextCaretInputPositionerState.JumpLines:
          if (inputIsMultiline) {
            return <TextInputCaretPositionerJumpLinesView
              nextViewClicked={onJumpLinesNextViewClick}
              selectionIsActivated={selectionIsActivated}
              selectionIsActivatedToggled={selectionIsActivatedToggled}
              jumpPrevLineX3TouchStartOrMouseDown={linesViewJumpPrevLineX3TouchStartOrMouseDown}
              jumpPrevLineX3TouchStartOrMouseDownDelayed={linesViewJumpPrevLineX3TouchStartOrMouseDownDelayed}
              jumpPrevLineX3ShortPressed={linesViewJumpPrevLineX3ShortPressed}
              jumpPrevLineX3LongPressStarted={linesViewJumpPrevLineX3LongPressStarted}
              jumpPrevLineX3LongPressEnded={linesViewJumpPrevLineX3LongPressEnded}
              jumpPrevLineX2TouchStartOrMouseDown={linesViewJumpPrevLineX2TouchStartOrMouseDown}
              jumpPrevLineX2TouchStartOrMouseDownDelayed={linesViewJumpPrevLineX2TouchStartOrMouseDownDelayed}
              jumpPrevLineX2ShortPressed={linesViewJumpPrevLineX2ShortPressed}
              jumpPrevLineX2LongPressStarted={linesViewJumpPrevLineX2LongPressStarted}
              jumpPrevLineX2LongPressEnded={linesViewJumpPrevLineX2LongPressEnded}
              jumpPrevLineX1TouchStartOrMouseDown={linesViewJumpPrevLineX1TouchStartOrMouseDown}
              jumpPrevLineX1TouchStartOrMouseDownDelayed={linesViewJumpPrevLineX1TouchStartOrMouseDownDelayed}
              jumpPrevLineX1ShortPressed={linesViewJumpPrevLineX1ShortPressed}
              jumpPrevLineX1LongPressStarted={linesViewJumpPrevLineX1LongPressStarted}
              jumpPrevLineX1LongPressEnded={linesViewJumpPrevLineX1LongPressEnded}
              jumpNextLineX1TouchStartOrMouseDown={linesViewJumpNextLineX1TouchStartOrMouseDown}
              jumpNextLineX1TouchStartOrMouseDownDelayed={linesViewJumpNextLineX1TouchStartOrMouseDownDelayed}
              jumpNextLineX1ShortPressed={linesViewJumpNextLineX1ShortPressed}
              jumpNextLineX1LongPressStarted={linesViewJumpNextLineX1LongPressStarted}
              jumpNextLineX1LongPressEnded={linesViewJumpNextLineX1LongPressEnded}
              jumpNextLineX2TouchStartOrMouseDown={linesViewJumpNextLineX2TouchStartOrMouseDown}
              jumpNextLineX2TouchStartOrMouseDownDelayed={linesViewJumpNextLineX2TouchStartOrMouseDownDelayed}
              jumpNextLineX2ShortPressed={linesViewJumpNextLineX2ShortPressed}
              jumpNextLineX2LongPressStarted={linesViewJumpNextLineX2LongPressStarted}
              jumpNextLineX2LongPressEnded={linesViewJumpNextLineX2LongPressEnded}
              jumpNextLineX3TouchStartOrMouseDown={linesViewJumpNextLineX3TouchStartOrMouseDown}
              jumpNextLineX3TouchStartOrMouseDownDelayed={linesViewJumpNextLineX3TouchStartOrMouseDownDelayed}
              jumpNextLineX3ShortPressed={linesViewJumpNextLineX3ShortPressed}
              jumpNextLineX3LongPressStarted={linesViewJumpNextLineX3LongPressStarted}
              jumpNextLineX3LongPressEnded={linesViewJumpNextLineX3LongPressEnded} />;
          }
          
          return null;
        default:
          return <TextInputCaretPositionerDefaultView
            inputIsMultiline={inputIsMultiline ?? false}
            selectionIsActivated={selectionIsActivated}
            selectionIsActivatedToggled={selectionIsActivatedToggled}
            nextViewClicked={onDefaultNextViewClick}
            jumpPrevLineTouchStartOrMouseDown={defaultViewJumpPrevLineTouchStartOrMouseDown}
            jumpPrevLineTouchStartOrMouseDownDelayed={defaultViewJumpPrevLineTouchStartOrMouseDownDelayed}
            jumpPrevLineShortPressed={defaultViewJumpPrevLineShortPressed}
            jumpPrevLineLongPressStarted={defaultViewJumpPrevLineLongPressStarted}
            jumpPrevLineLongPressEnded={defaultViewJumpPrevLineLongPressEnded}
            jumpPrevWordTouchStartOrMouseDown={defaultViewJumpPrevWordTouchStartOrMouseDown}
            jumpPrevWordTouchStartOrMouseDownDelayed={defaultViewJumpPrevWordTouchStartOrMouseDownDelayed}
            jumpPrevWordShortPressed={defaultViewJumpPrevWordShortPressed}
            jumpPrevWordLongPressStarted={defaultViewJumpPrevWordLongPressStarted}
            jumpPrevWordLongPressEnded={defaultViewJumpPrevWordLongPressEnded}
            jumpPrevCharTouchStartOrMouseDown={defaultViewJumpPrevCharTouchStartOrMouseDown}
            jumpPrevCharTouchStartOrMouseDownDelayed={defaultViewJumpPrevCharTouchStartOrMouseDownDelayed}
            jumpPrevCharShortPressed={defaultViewJumpPrevCharShortPressed}
            jumpPrevCharLongPressStarted={defaultViewJumpPrevCharLongPressStarted}
            jumpPrevCharLongPressEnded={defaultViewJumpPrevCharLongPressEnded}
            jumpNextCharTouchStartOrMouseDown={defaultViewJumpNextCharTouchStartOrMouseDown}
            jumpNextCharTouchStartOrMouseDownDelayed={defaultViewJumpNextCharTouchStartOrMouseDownDelayed}
            jumpNextCharShortPressed={defaultViewJumpNextCharShortPressed}
            jumpNextCharLongPressStarted={defaultViewJumpNextCharLongPressStarted}
            jumpNextCharLongPressEnded={defaultViewJumpNextCharLongPressEnded}
            jumpNextWordTouchStartOrMouseDown={defaultViewJumpNextWordTouchStartOrMouseDown}
            jumpNextWordTouchStartOrMouseDownDelayed={defaultViewJumpNextWordTouchStartOrMouseDownDelayed}
            jumpNextWordShortPressed={defaultViewJumpNextWordShortPressed}
            jumpNextWordLongPressStarted={defaultViewJumpNextWordLongPressStarted}
            jumpNextWordLongPressEnded={defaultViewJumpNextWordLongPressEnded}
            jumpNextLineTouchStartOrMouseDown={defaultViewJumpNextLineTouchStartOrMouseDown}
            jumpNextLineTouchStartOrMouseDownDelayed={defaultViewJumpNextLineTouchStartOrMouseDownDelayed}
            jumpNextLineShortPressed={defaultViewJumpNextLineShortPressed}
            jumpNextLineLongPressStarted={defaultViewJumpNextLineLongPressStarted}
            jumpNextLineLongPressEnded={defaultViewJumpNextLineLongPressEnded} />;
      }
    }
  }, [
    inputEl,
    inFrontOfAll,
    inputIsMultiline,
    selectionIsActivated,
    isMoveAndResizeModePropsVal,
    moveAndResizeStatePropsVal,
    stateType,
    minimized,
    keepOpen,
    showOptions,
    showMoreOptions]);

  return (<div className={[INPUT_CARET_POSITIONER_CSS_CLASS,
    minimized ? "trmrk-minimized" : "",
    inFrontOfAll ? "trmrk-in-front-of-all" : "",
    isMoveAndResizeModePropsVal ? "trmrk-is-move-and-resize-mode" : "" ].join(" ")} ref={el => mainElRef.current = el}>
      <div className="trmrk-text-input-caret-positioner">
        { viewRetriever() }
        { isMoveAndResizeModePropsVal ? null : <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
          onMouseDown={mainBtnClicked}
          onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton> }
      </div>
      <div className="trmrk-popover-top-border">
        <div className="trmrk-animator" ref={el => topBorderAnimatorElRef.current = el}>&nbsp;</div>
      </div>
      <div className="trmrk-popover-bottom-border">
        <div className="trmrk-animator" ref={el => bottomBorderAnimatorElRef.current = el}>&nbsp;</div>
      </div>
      <div className="trmrk-popover-left-border">
        <div className="trmrk-animator" ref={el => leftBorderAnimatorElRef.current = el}>&nbsp;</div>
      </div>
      <div className="trmrk-popover-right-border">
        <div className="trmrk-animator" ref={el => rightBorderAnimatorElRef.current = el}>&nbsp;</div>
      </div>
  </div>);
}
