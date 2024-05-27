import React from "react";

import IconButton from "@mui/material/IconButton";

import trmrk from "../../../trmrk";

import {
  TouchOrMouseCoords,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import { extractElCssStyleTopPx } from "../../../trmrk-browser/domUtils/css";
import { isMultilineInput } from "../../../trmrk-browser/domUtils/textInput";
import MatUIIcon from "../icons/MatUIIcon";
import { getAppTheme } from "../../app-theme/core";

import TextCaretInputPositionerDefaultView from "./TextCaretInputPositionerDefaultView";
import TextCaretInputPositionerOptionsView from "./TextCaretInputPositionerOptionsView";
import FullScrollModeView from "./FullScrollModeView";
import TextCaretInputPositionerJumpSymbolsView from "./TextCaretInputPositionerJumpSymbolsView";
import TextCaretInputPositionerJumpLinesView from "./TextCaretInputPositionerJumpLinesView";

export enum TextCaretInputPositionerState {
  Default = 0,
  JumpSymbols,
  JumpLines
}

export interface TextInputCaretPositionerPopoverProps {
  inputEl: HTMLElement;
  inFrontOfAll?: boolean | null | undefined;
  minimized?: boolean | null | undefined;
  state?: TextCaretInputPositionerState | null | undefined;
  showOptions?: boolean | null | undefined;
  isFullViewScrollMode?: boolean | null | undefined;
  selectionIsEnabled?: boolean | null | undefined;
  symbolsJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  linesJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  stateChanged?: ((prevState: TextCaretInputPositionerState, currentState: TextCaretInputPositionerState) => void) | null | undefined;
  minimizedToggled?: ((minimized: boolean) => void) | null | undefined;
  showOptionsToggled?: ((showOptions: boolean) => void) | null | undefined;
  isFullViewScrollModeToggled?: ((isFullViewScrollMode: boolean) => void) | null | undefined;
  selectionIsEnabledToggled?: ((selectionIsEnabled: boolean) => void) | null | undefined;
}

export const defaultJumpSpeedsArr = Object.freeze([5, 25, 125]);
export const defaultSymbolsJumpSpeedsArr = defaultJumpSpeedsArr;
export const defaultLinesJumpSpeedsArr = defaultJumpSpeedsArr;

export const INPUT_CARET_POSITIONER_CSS_CLASS = "trmrk-text-input-caret-positioner-popover";
export const INPUT_CARET_POSITIONER_QUERY_SELECTOR = `.${INPUT_CARET_POSITIONER_CSS_CLASS}`;

export const retrieveTextInputCaretPositioner = () => document.querySelector<HTMLElement>(INPUT_CARET_POSITIONER_QUERY_SELECTOR);

export const cssClasses = Object.freeze({
  anchor: (left: boolean) => left ? "trmrk-anchor-left" : "trmrk-anchor-right",
  slideOnce: (speed: number) => `trmrk-slide-once-speed-x${speed}`,
  slide: (speed: number) => `trmrk-slide-speed-x${speed}`
});

export const longPressIntervalMs = 500;

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

  const [ inputEl, setInputEl ] = React.useState(props.inputEl);
  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(isMultilineInput(inputEl));
  const [ inFrontOfAll, setInFrontOfAll ] = React.useState(normalizeInFrontOfAll(props.inFrontOfAll));
  const [ minimized, setMinimized ] = React.useState(props.minimized ?? false);
  const [ stateType, setStateType ] = React.useState(props.state ?? TextCaretInputPositionerState.Default);
  const [ showOptions, setShowOptions ] = React.useState(props.showOptions ?? false);
  const [ isFullViewScrollMode, setIsFullViewScrollMode ] = React.useState(props.isFullViewScrollMode ?? false);
  const [ selectionIsEnabled, setSelectionIsEnabled ] = React.useState(props.selectionIsEnabled ?? false);

  const [ symbolsJumpSpeedsArr, setSymbolsJumpSpeedsArr ] = React.useState(
    normalizeSymbolsJumpSpeedsArr(props.symbolsJumpSpeedsArr));

  const [ linesJumpSpeedsArr, setLinesJumpSpeedsArr ] = React.useState(
    normalizeLinesJumpSpeedsArr(props.linesJumpSpeedsArr));

  const moveUpOrDown = React.useCallback((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords, moveDirIsUp: boolean) => {
    const mainEl = mainElRef.current;

    if (mainEl) {
      const topOffsetPxNum = extractElCssStyleTopPx(mainEl);

      if ((topOffsetPxNum ?? null) !== null) {
        const sign = moveDirIsUp ? -1 : 1;
        let nextTopOffsetPxNum = topOffsetPxNum! + sign * mainEl.clientHeight;

        nextTopOffsetPxNum = Math.max(0, nextTopOffsetPxNum);
        nextTopOffsetPxNum = Math.min(nextTopOffsetPxNum, window.innerHeight - mainEl.clientHeight);

        mainEl.style.top = `${nextTopOffsetPxNum}px`;
      }
    }
  }, [mainElRef]);

  const moveUp = React.useCallback((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => {
    moveUpOrDown(ev, coords, true);
  }, [mainElRef]);

  const moveDown = React.useCallback((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => {
    moveUpOrDown(ev, coords, false);
  }, [mainElRef]);

  const minimizeBtnClicked = React.useCallback(() => {
    const newMinimizedVal = true;
    const newShowOptionsVal = false;

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
  }, [minimized]);

  const mainBtnClicked = React.useCallback(() => {
    if (minimized) {
      const newMinimizedVal = false;

      if (props.minimizedToggled) {
        props.minimizedToggled(newMinimizedVal);
      }
      
      setMinimized(newMinimizedVal);
    } else if (isFullViewScrollMode) {
      const newIsFullViewScrollModeVal = false;

      if (props.isFullViewScrollModeToggled) {
        props.isFullViewScrollModeToggled(newIsFullViewScrollModeVal);
      }

      setIsFullViewScrollMode(newIsFullViewScrollModeVal); 
    } else {
      const newShowOptionsVal = !showOptions;

      if (props.showOptionsToggled) {
        props.showOptionsToggled(
          newShowOptionsVal
        );
      }
      
      setShowOptions(newShowOptionsVal);
    }
  }, [minimized, isFullViewScrollMode, showOptions]);

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

  const isFullViewScrollModeActivated = React.useCallback(() => {
    const newIsFullViewScrollModeVal = true;
    const newShowOptionsVal = false;

    if (props.isFullViewScrollModeToggled) {
      props.isFullViewScrollModeToggled(newIsFullViewScrollModeVal);
    }

    if (props.showOptionsToggled) {
      props.showOptionsToggled(
        newShowOptionsVal
      );
    }

    setIsFullViewScrollMode(newIsFullViewScrollModeVal);
    setShowOptions(newShowOptionsVal);
  }, [isFullViewScrollMode]);

  const selectionIsEnabledToggled = React.useCallback((selectionIsEnabled: boolean) => {
    if (props.selectionIsEnabledToggled) {
      props.selectionIsEnabledToggled(selectionIsEnabled);
    }

    setSelectionIsEnabled(selectionIsEnabled);
  }, [selectionIsEnabled]);

  const withTopAndBorderAnimatorElems = React.useCallback((
    callback: (topBorderAnimatorEl: HTMLElement, bottomBorderAnimatorEl: HTMLElement) => void
  ) => {
    const topBorderAnimatorEl = topBorderAnimatorElRef.current;
    const bottomBorderAnimatorEl = bottomBorderAnimatorElRef.current;

    if (topBorderAnimatorEl && bottomBorderAnimatorEl) {
      callback(topBorderAnimatorEl, bottomBorderAnimatorEl);
    }
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const viewBtnTouchStartOrMouseDown = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withTopAndBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.add(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.add(cssClasses.slideOnce(speed));
      bottomBorderAnimatorEl.classList.add(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.add(cssClasses.slideOnce(speed));
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const viewBtnShortPressed = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withTopAndBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.remove(cssClasses.slideOnce(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slideOnce(speed));
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const viewBtnLongPressStarted = React.useCallback((speed: number) => {
    withTopAndBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.slideOnce(speed));
      topBorderAnimatorEl.classList.add(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slideOnce(speed));
      bottomBorderAnimatorEl.classList.add(cssClasses.slide(speed));
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const viewBtnLongPressEnded = React.useCallback((topBorderAnchorLeft: boolean, bottomBorderAnchorLeft: boolean, speed: number) => {
    withTopAndBorderAnimatorElems((topBorderAnimatorEl, bottomBorderAnimatorEl) => {
      topBorderAnimatorEl.classList.remove(cssClasses.anchor(topBorderAnchorLeft));
      topBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
      bottomBorderAnimatorEl.classList.remove(cssClasses.anchor(bottomBorderAnchorLeft));
      bottomBorderAnimatorEl.classList.remove(cssClasses.slide(speed));
    });
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const defaultViewJumpPrevLineTouchStartOrMouseDown = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    viewBtnTouchStartOrMouseDown(false, true, 1);
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

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
  }, [topBorderAnimatorElRef, bottomBorderAnimatorElRef]);

  const symbolsViewJumpNextCharX3ShortPressed = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
    viewBtnShortPressed(false, false, 3);
  }, []);

  const symbolsViewJumpNextCharX3LongPressStarted = React.useCallback(() => {
    viewBtnLongPressStarted(3);
  }, []);

  const symbolsViewJumpNextCharX3LongPressEnded = React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
    viewBtnLongPressEnded(false, false, 3);
  }, []);

  React.useEffect(() => {
    const inFrontOfAllNewVal = normalizeInFrontOfAll(props.inFrontOfAll);
    const mainEl = mainElRef.current;

    if (inFrontOfAllNewVal !== inFrontOfAll) {
      setInFrontOfAll(inFrontOfAllNewVal);
    }

    if (inputEl !== props.inputEl) {
      const inputIsMultilineNewVal = isMultilineInput(props.inputEl);

      if (!inputIsMultilineNewVal) {
        if (stateType === TextCaretInputPositionerState.JumpLines) {
          setStateType(TextCaretInputPositionerState.Default);
        }
      }

      setInputEl(props.inputEl);

      if (inputIsMultilineNewVal !== inputIsMultiline) {
        setInputIsMultiline(inputIsMultilineNewVal);
      }
    }

    const onMainElTouchEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
    }

    if (mainEl) {
      mainEl.addEventListener("touchend", onMainElTouchEnd, {
        capture: true
      });

      mainEl.addEventListener("mousedown", onMainElTouchEnd, {
        capture: true
      });
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener("touchend", onMainElTouchEnd, {
          capture: true
        });

        mainEl.removeEventListener("mousedown", onMainElTouchEnd, {
          capture: true
        });
      }
    };
  }, [
    props.inputEl,
    props.state,
    props.inFrontOfAll,
    props.minimized,
    props.showOptions,
    props.isFullViewScrollMode,
    props.selectionIsEnabled,
    props.symbolsJumpSpeedsArr,
    props.linesJumpSpeedsArr,
    inputEl,
    mainElRef,
    inFrontOfAll,
    minimized,
    stateType,
    showOptions,
    inputIsMultiline,
    isFullViewScrollMode,
    selectionIsEnabled,
  ]);

  const viewRetriever = React.useCallback(() => {
    if (minimized) {
      return null;
    }

    if (showOptions) {
      return <TextCaretInputPositionerOptionsView
          minimizeClicked={minimizeBtnClicked}
          moveUp={moveUp}
          moveDown={moveDown}
          isFullViewScrollModeActivated={isFullViewScrollModeActivated} />;
    } else if (isFullViewScrollMode) {
      return <FullScrollModeView />;
    } else {
      switch (stateType) {
        case TextCaretInputPositionerState.JumpSymbols:
          return <TextCaretInputPositionerJumpSymbolsView
            nextViewClicked={onJumpSymbolsNextViewClick}
            selectionIsEnabled={selectionIsEnabled}
            selectionIsEnabledToggled={selectionIsEnabledToggled}
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
              selectionIsEnabled={selectionIsEnabled}
              selectionIsEnabledToggled={selectionIsEnabledToggled} />;
          }
          
          return null;
        default:
          return <TextCaretInputPositionerDefaultView
            inputIsMultiline={inputIsMultiline}
            selectionIsEnabled={selectionIsEnabled}
            selectionIsEnabledToggled={selectionIsEnabledToggled}
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
  }, [inFrontOfAll, inputIsMultiline, isFullViewScrollMode, selectionIsEnabled, stateType, minimized, showOptions]);

  return (<div className={[INPUT_CARET_POSITIONER_CSS_CLASS,
    minimized ? "trmrk-minimized" : "",
    inFrontOfAll ? "trmrk-in-front-of-all" : "" ].join(" ")} ref={el => mainElRef.current = el}>
      <div className="trmrk-popover-top-border">
        <div className="trmrk-animator" ref={el => topBorderAnimatorElRef.current = el}></div>
      </div>
      <div className="trmrk-text-input-caret-positioner">
        { viewRetriever() }

        <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
          onMouseDown={mainBtnClicked}
          onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
      </div>
      <div className="trmrk-popover-bottom-border">
        <div className="trmrk-animator" ref={el => bottomBorderAnimatorElRef.current = el}></div>
      </div>
  </div>);
}
