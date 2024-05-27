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
import TextCaretInputPositionerJumpSymbolsView from "./TextCaretInputPositionerJumpSymbolsView";
import TextCaretInputPositionerJumpLinesView from "./TextCaretInputPositionerJumpLinesView";

export enum TextCaretInputPositionerState {
  Default = 0,
  JumpSymbols,
  JumpLines
}

export interface TextInputCaretPositionerPopoverProps {
  isDarkMode: boolean;
  inputEl: HTMLElement;
  minimized?: boolean | null | undefined;
  state?: TextCaretInputPositionerState | null | undefined;
  showOptions?: boolean | null | undefined;
  symbolsJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  linesJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  stateChanged?: ((prevState: TextCaretInputPositionerState, currentState: TextCaretInputPositionerState) => void) | null | undefined;
  minimizedToggled?: ((minimized: boolean) => void) | null | undefined;
  showOptionsToggled?: ((showOptions: boolean) => void) | null | undefined;
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
  const [ minimized, setMinimized ] = React.useState(props.minimized ?? false);
  const [ stateType, setStateType ] = React.useState(props.state ?? TextCaretInputPositionerState.Default);
  const [ showOptions, setShowOptions ] = React.useState(props.showOptions ?? false);

  const [ symbolsJumpSpeedsArr, setSymbolsJumpSpeedsArr ] = React.useState(
    normalizeSymbolsJumpSpeedsArr(props.symbolsJumpSpeedsArr));

  const [ linesJumpSpeedsArr, setLinesJumpSpeedsArr ] = React.useState(
    normalizeLinesJumpSpeedsArr(props.linesJumpSpeedsArr));

  const appThemeClassName = getAppTheme({
    isDarkMode: props.isDarkMode,
  }).cssClassName;

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

    setMinimized(newMinimizedVal);
    setShowOptions(newShowOptionsVal);

    if (props.minimizedToggled) {
      props.minimizedToggled(newMinimizedVal);
    }

    if (props.showOptionsToggled) {
      props.showOptionsToggled(
        newShowOptionsVal
      );
    }
  }, [minimized]);

  const mainBtnClicked = React.useCallback(() => {
    if (minimized) {
      const newMinimizedVal = false;
      setMinimized(newMinimizedVal);

      if (props.minimizedToggled) {
        props.minimizedToggled(newMinimizedVal);
      }
    } else {
      const newShowOptionsVal = !showOptions;
      setShowOptions(newShowOptionsVal);

      if (props.showOptionsToggled) {
        props.showOptionsToggled(
          newShowOptionsVal
        );
      }
    }
  }, [minimized, showOptions]);

  const onDefaultNextViewClick = React.useCallback(() => {
    setStateType(TextCaretInputPositionerState.JumpSymbols);
  }, [stateType]);

  const onJumpSymbolsNextViewClick = React.useCallback(() => {
    if (inputIsMultiline) {
      setStateType(TextCaretInputPositionerState.JumpLines);
    } else {
      setStateType(TextCaretInputPositionerState.Default);
    }
  }, [stateType]);

  const onJumpLinesNextViewClick = React.useCallback(() => {
    setStateType(TextCaretInputPositionerState.Default);
  }, [stateType]);

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

  React.useEffect(() => {
    const mainEl = mainElRef.current;

    if (inputEl !== props.inputEl) {
      const inputIsMultilineNewVal = isMultilineInput(props.inputEl);

      if (!inputIsMultilineNewVal) {
        if (stateType === TextCaretInputPositionerState.JumpLines) {
          setStateType(TextCaretInputPositionerState.Default);
        }
      }

      setInputEl(props.inputEl);
      setInputIsMultiline(inputIsMultilineNewVal);
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
  }, [props.isDarkMode,
    props.inputEl,
    props.state,
    props.minimized,
    props.showOptions,
    props.symbolsJumpSpeedsArr,
    props.linesJumpSpeedsArr,
    inputEl,
    mainElRef,
    inputIsMultiline,
    minimized,
    showOptions,
    stateType,
  ]);

  const viewRetriever = React.useCallback(() => {
    if (minimized) {
      return null;
    }

    if (showOptions) {
      return <TextCaretInputPositionerOptionsView
          minimizeClicked={minimizeBtnClicked}
          moveUp={moveUp}
          moveDown={moveDown} />;
    } else {
      switch (stateType) {
        case TextCaretInputPositionerState.JumpSymbols:
          return <TextCaretInputPositionerJumpSymbolsView
            nextViewClicked={onJumpSymbolsNextViewClick} />;
        case TextCaretInputPositionerState.JumpLines:
          if (inputIsMultiline) {
            return <TextCaretInputPositionerJumpLinesView
              nextViewClicked={onJumpLinesNextViewClick} />;
          }
          
          return null;
        default:
          return <TextCaretInputPositionerDefaultView
            inputIsMultiline={inputIsMultiline}
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
  }, [inputIsMultiline, stateType, minimized, showOptions]);

  return (<div className={[INPUT_CARET_POSITIONER_CSS_CLASS, appThemeClassName,
    minimized ? "trmrk-minimized" : "" ].join(" ")} ref={el => mainElRef.current = el}>
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
