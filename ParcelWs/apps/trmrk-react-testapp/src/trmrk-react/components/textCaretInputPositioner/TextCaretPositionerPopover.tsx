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

export const defaultJumpSpeedsArr = Object.freeze([3, 10, 30]);
export const defaultSymbolsJumpSpeedsArr = defaultJumpSpeedsArr;
export const defaultLinesJumpSpeedsArr = defaultJumpSpeedsArr;

export const INPUT_CARET_POSITIONER_CSS_CLASS = "trmrk-text-input-caret-positioner-popover";
export const INPUT_CARET_POSITIONER_QUERY_SELECTOR = `.${INPUT_CARET_POSITIONER_CSS_CLASS}`;

export const retrieveTextInputCaretPositioner = () => document.querySelector<HTMLElement>(INPUT_CARET_POSITIONER_QUERY_SELECTOR);

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
            nextViewClicked={onDefaultNextViewClick} />;
      }
    }
  }, [inputIsMultiline, stateType, minimized, showOptions]);

  return (<div className={[INPUT_CARET_POSITIONER_CSS_CLASS, appThemeClassName,
    minimized ? "trmrk-minimized" : "" ].join(" ")} ref={el => mainElRef.current = el}>
    { viewRetriever() }

    <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
      onMouseDown={mainBtnClicked}
      onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
  </div>);
}
