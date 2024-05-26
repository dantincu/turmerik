import React from "react";

import IconButton from "@mui/material/IconButton";

import trmrk from "../../../trmrk";
import { isMobile } from "../../../trmrk-browser/domUtils/constants";
import {
  getTouchOrMouseCoords,
  toSingleTouchOrClick,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { isMultilineInput } from "../../../trmrk-browser/domUtils/textInput";
import { clearElemVertInset } from "../../../trmrk-browser/domUtils/getDomElemBounds";
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
  pinnedToBottom?: boolean | null | undefined;
  state?: TextCaretInputPositionerState | null | undefined;
  showOptions?: boolean | null | undefined;
  symbolsJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  linesJumpSpeedsArr?: number[] | readonly number[] | null | undefined;
  stateChanged?: ((prevState: TextCaretInputPositionerState, currentState: TextCaretInputPositionerState) => void) | null | undefined;
  minimizedToggled?: ((minimized: boolean) => void) | null | undefined;
  pinnedToBottomToggled?: ((pinnedToBottom: boolean) => void) | null | undefined;
  showOptionsToggled?: ((showOptions: boolean) => void) | null | undefined;
}

export const defaultJumpSpeedsArr = Object.freeze([3, 10, 30]);
export const defaultSymbolsJumpSpeedsArr = defaultJumpSpeedsArr;
export const defaultLinesJumpSpeedsArr = defaultJumpSpeedsArr;

export const INPUT_CARET_POSITIONERS_CSS_CLASS = "trmrk-text-input-caret-positioner-popover";

export const retrieveTextInputCaretPositioner = () => document.querySelector<HTMLElement>(`.${INPUT_CARET_POSITIONERS_CSS_CLASS}`);

export const bringTextInputCaretPositionerIntoViewCore = (
  textCaretElem: HTMLElement,
  ev: MouseEvent | TouchEvent | null = null,
  // pinToBottom = false,
  maxTopOffset: number | null = null
): boolean | null => {
  const bodyRect = document.body.getBoundingClientRect();
  const textCaretElemStyle = textCaretElem.style;
  let shouldPinToBottom: boolean | null = null;

 /*  if (bodyRect.top < 0) {
    if (pinToBottom) {
      textCaretElemStyle.bottom = `0px`;
    } else {
      textCaretElemStyle.top = `${-bodyRect.top}px`;
    }
  } else */
  
   if (bodyRect.top < 0) {
      textCaretElemStyle.top = `${-bodyRect.top}px`;
   } else if (ev && isMobile) {
    const coords = toSingleTouchOrClick(getTouchOrMouseCoords(ev));

    if (coords) {
      const textCaretElemHeight = textCaretElem.clientHeight;
      maxTopOffset ??= 4 * textCaretElemHeight;

      if (coords.pageY <= textCaretElemHeight) {
        const trgElem = ev.target as HTMLElement;
        const trgElemRect = trgElem.getBoundingClientRect();

        let topOffset = Math.max(
          trgElemRect.top + trgElemRect.height,
          maxTopOffset
        );

        textCaretElemStyle.top = `${topOffset}px`;
      } else {
        shouldPinToBottom = true;
        clearElemVertInset(textCaretElemStyle);
      }
    }
  } else {
    clearElemVertInset(textCaretElemStyle);
  }

  return shouldPinToBottom;
};

export const bringTextInputCaretPositionerIntoView = (
  textCaretElem: HTMLElement | null | undefined = null,
  ev: MouseEvent | TouchEvent | null = null) => trmrk.withValIf(
  textCaretElem ?? retrieveTextInputCaretPositioner(),
  val => bringTextInputCaretPositionerIntoViewCore(val!, ev/* , val?.classList.contains("trmrk-pinned-to-bottom") */),
  () => null
);

export const clearTextInputCaretPositionerVertInset = (
  textCaretElem: HTMLElement | null | undefined = null
) => trmrk.actWithValIf(
  textCaretElem ?? retrieveTextInputCaretPositioner(),
  val => clearElemVertInset(val!.style)
)

/* export const bringAllTextInputCaretPositionersIntoView = () => bringAllVertFixedElemsIntoView(
  `.${INPUT_CARET_POSITIONERS_CSS_CLASS}`); */

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

export default function TextInputCaretPositionerPopover(
  props: TextInputCaretPositionerPopoverProps
) {
  const mainElRef = React.createRef<HTMLDivElement>();

  const [ inputEl, setInputEl ] = React.useState(props.inputEl);
  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(isMultilineInput(inputEl));
  const [ minimized, setMinimized ] = React.useState(props.minimized ?? false);
  const [ initialPinnedToBottom, setInitialPinnedToBottom ] = React.useState(props.pinnedToBottom ?? false);
  const [ pinnedToBottom, setPinnedToBottom ] = React.useState(initialPinnedToBottom);
  const [ stateType, setStateType ] = React.useState(props.state ?? TextCaretInputPositionerState.Default);
  const [ showOptions, setShowOptions ] = React.useState(props.showOptions ?? false);

  const [ symbolsJumpSpeedsArr, setSymbolsJumpSpeedsArr ] = React.useState(
    normalizeSymbolsJumpSpeedsArr(props.symbolsJumpSpeedsArr));

  const [ linesJumpSpeedsArr, setLinesJumpSpeedsArr ] = React.useState(
    normalizeLinesJumpSpeedsArr(props.linesJumpSpeedsArr));

  const appThemeClassName = getAppTheme({
    isDarkMode: props.isDarkMode,
  }).cssClassName;

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

  const pinnedToBottomToggled = React.useCallback(() => {
    const newPinnedToBottomVal = !pinnedToBottom;
    const newShowOptionsVal = false;
    
    setPinnedToBottom(newPinnedToBottomVal);
    setShowOptions(newShowOptionsVal);

    if (props.pinnedToBottomToggled) {
      props.pinnedToBottomToggled(
        newPinnedToBottomVal
      );
    }

    if (props.showOptionsToggled) {
      props.showOptionsToggled(
        newShowOptionsVal
      );
    }
  }, [pinnedToBottom]);

  React.useEffect(() => {
    const mainEl = mainElRef.current;

    const propsPinnedToBottom = props.pinnedToBottom ?? false;
    if (initialPinnedToBottom !== propsPinnedToBottom) {
      setInitialPinnedToBottom(propsPinnedToBottom);
      setPinnedToBottom(propsPinnedToBottom);
    }

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
    pinnedToBottom,
    showOptions,
    stateType
  ]);

  const viewRetriever = React.useCallback(() => {
    if (minimized) {
      return null;
    }

    if (showOptions) {
      return <TextCaretInputPositionerOptionsView
          pinnedToBottom={pinnedToBottom}
          minimizeClicked={minimizeBtnClicked}
          pinnedToBottomToggled={pinnedToBottomToggled} />;
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
  }, [inputIsMultiline, stateType, minimized, showOptions, pinnedToBottom]);

  return (<div className={[INPUT_CARET_POSITIONERS_CSS_CLASS, appThemeClassName,
    minimized ? "trmrk-minimized" : "",
    pinnedToBottom ? "trmrk-pinned-to-bottom" : "trmrk-pinned-to-top" ].join(" ")} ref={mainElRef}>

    { viewRetriever() }

    <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
      onMouseDown={mainBtnClicked}
      onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
  </div>);
}