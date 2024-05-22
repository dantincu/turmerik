import React from "react";

import IconButton from "@mui/material/IconButton";

import { filterChildNodes } from "../../../trmrk-browser/domUtils/core";
import MatUIIcon from "../../../trmrk-react/components/icons/MatUIIcon";
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
  querySelector: string | null;
  inputIsMultiline?: boolean | null | undefined;
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

  const [ inputIsMultiline, setInputIsMultiline ] = React.useState(props.inputIsMultiline ?? props.inputEl instanceof HTMLInputElement);
  const [ minimized, setMinimized ] = React.useState(props.minimized ?? false);
  const [ pinnedToBottom, setPinnedToBottom ] = React.useState(props.pinnedToBottom ?? false);
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
    setMinimized(newMinimizedVal);

    if (props.minimizedToggled) {
      props.minimizedToggled(newMinimizedVal);
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
    setStateType(TextCaretInputPositionerState.JumpLines);
  }, [stateType]);

  const onJumpLinesNextViewClick = React.useCallback(() => {
    setStateType(TextCaretInputPositionerState.Default);
  }, [stateType]);

  const pinnedToBottomToggled = React.useCallback(() => {
    const newPinnedToBottomVal = !pinnedToBottom;

    if (props.pinnedToBottomToggled) {
      props.pinnedToBottomToggled(
        newPinnedToBottomVal
      );
    }

    setPinnedToBottom(newPinnedToBottomVal);
  }, [pinnedToBottom]);

  React.useEffect(() => {
    const mainEl = mainElRef.current;

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
    mainElRef,
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
          return <TextCaretInputPositionerJumpLinesView
            nextViewClicked={onJumpLinesNextViewClick} />;
        default:
          return <TextCaretInputPositionerDefaultView
            nextViewClicked={onDefaultNextViewClick} />;
      }
    }
  }, [stateType, minimized, showOptions, pinnedToBottom]);

  return (<div className={["trmrk-text-input-caret-positioner-popover", appThemeClassName,
    minimized ? "trmrk-minimized" : "",
    pinnedToBottom ? "trmrk-pinned-to-bottom" : "trmrk-pinned-to-top" ].join(" ")} ref={mainElRef}>

    { viewRetriever() }

    <IconButton className="trmrk-icon-btn trmrk-main-icon-btn"
      onMouseDown={mainBtnClicked}
      onTouchEnd={mainBtnClicked}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
  </div>);
}
