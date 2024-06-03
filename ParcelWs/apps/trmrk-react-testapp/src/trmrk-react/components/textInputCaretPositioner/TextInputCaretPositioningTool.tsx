import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { MtblRefValue } from "../../../trmrk/core";
import { extractTextInput } from "../../../trmrk-browser/domUtils/textInput";
import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import { serializeTextCaretPositionerOptsToLocalStorage } from "../../../trmrk-browser/textCaretPositioner/core";

import TextInputCaretPositionerPopover from "./TextInputCaretPositionerPopover";
import { TextInputCaretPositionerMoveAndResizeState } from "./TextInputCaretPositionerMoveAndResizeView";
import TrmrkBackDrop from "../backDrop/TrmrkBackDrop";

export interface TextInputCaretPositioningToolProps {
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export const currentInputElMtblRef: MtblRefValue<HTMLElement | null> = {
  value: null
};

export const updateCurrentInputEl = (appDataReducers: AppDataReducers, dispatch: Dispatch, inputEl: HTMLElement | null) => {
  currentInputElMtblRef.value = inputEl;
  dispatch(appDataReducers.incTextCaretPositionerCurrentInputElLastSetOpIdx());
}

export default function TextInputCaretPositioningTool(props: TextInputCaretPositioningToolProps) {
  const [ isFullViewPortMode, setIsFullViewPortMode ] = React.useState(false);
  const [ isMoveAndResizeMode, setIsMoveAndResizeMode ] = React.useState(false);
  const [ moveAndResizeModeState, setMoveAndResizeModeState ] = React.useState<TextInputCaretPositionerMoveAndResizeState | null>(null);
  const [ showBackDrop, setShowBackDrop ] = React.useState(false);

  const textCaretPositionerOpts = useSelector(props.appDataSelectors.getTextCaretPositionerOpts);
  const isEnabled = useSelector(props.appDataSelectors.getTextCaretPositionerEnabled);
  const keepOpen = useSelector(props.appDataSelectors.getTextCaretPositionerKeepOpen);
  const isAnyMenuOpen = useSelector(props.appBarSelectors.isAnyMenuOpen);

  const currentInputElLastSetOpIdx = useSelector(
    props.appDataSelectors.getTextCaretPositionerCurrentInputElLastSetOpIdx);

  const lastMoveOrResizeTouchStartOrMouseDownCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);

  const dispatch = useDispatch();

  const onKeepOpenToggled = React.useCallback((keepOpen: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerKeepOpen(keepOpen));

    serializeTextCaretPositionerOptsToLocalStorage({
      ...textCaretPositionerOpts,
      keepOpen: keepOpen
    });
  }, []);

  const onDisabled = React.useCallback(() => {
    dispatch(props.appDataReducers.setTextCaretPositionerEnabled(false));
    
    serializeTextCaretPositionerOptsToLocalStorage({
      ...textCaretPositionerOpts,
      enabled: false
    });
  }, []);

  const isFullViewPortModeToggled = React.useCallback((isFullViewPortMode: boolean) => {
    setIsFullViewPortMode(isFullViewPortMode);
  }, [isFullViewPortMode]);

  const isMoveAndResizeModeToggled = React.useCallback((isMoveMode: boolean) => {
    if (isMoveMode) {
      setIsMoveAndResizeMode(isMoveMode);
      setMoveAndResizeModeState(TextInputCaretPositionerMoveAndResizeState.Pending);
    }
    
    onToggleBackDrop(isMoveMode);
  }, [isMoveAndResizeMode]);

  const moveAndResizeStatusChanged = React.useCallback((
    moveAndResizeState: TextInputCaretPositionerMoveAndResizeState,
    ev: React.TouchEvent | React.MouseEvent,
    coords: TouchOrMouseCoords) => {
    setMoveAndResizeModeState(moveAndResizeState);
  }, [moveAndResizeModeState]);

  const onToggleBackDrop = React.useCallback((showBackDrop: boolean) => {
    setShowBackDrop(showBackDrop);

    if (!showBackDrop) {
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = null;

      if (isMoveAndResizeMode) {
        setIsMoveAndResizeMode(false);
      }
      
      if (isMoveAndResizeMode) {
        setIsMoveAndResizeMode(false);
        setMoveAndResizeModeState(null);
      }
    }
  }, [
      isFullViewPortMode,
      isMoveAndResizeMode,
      isMoveAndResizeMode,
      showBackDrop
  ]);

  const onBackDropTouchOrClick = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onToggleBackDrop(false);
  }, [
      isFullViewPortMode,
      isMoveAndResizeMode,
      isMoveAndResizeMode,
      showBackDrop
  ]);

  React.useEffect(() => {
    }, [
      currentInputElMtblRef.value,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      textCaretPositionerOpts,
      isEnabled,
      keepOpen,
      isAnyMenuOpen,
      currentInputElLastSetOpIdx,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
    ]);
  return (<React.Fragment>
    { ((currentInputElMtblRef.value || keepOpen) && isEnabled) ? <React.Fragment>
    { showBackDrop ? <TrmrkBackDrop
      onTouchOrClick={onBackDropTouchOrClick}
      preventDefaultOnTouchOrMouseEvts={true}
      className="trmrk-text-input-caret-positioner-popover-backdrop" /> : null }
    <TextInputCaretPositionerPopover
        inputEl={currentInputElMtblRef.value}
        inFrontOfAll={!isAnyMenuOpen}
        keepOpen={keepOpen}
        isFullViewPortMode={isFullViewPortMode}
        isMoveAndResizeMode={isMoveAndResizeMode}
        moveAndResizeState={moveAndResizeModeState}
        isFullViewPortModeToggled={isFullViewPortModeToggled}
        isMoveAndResizeModeToggled={isMoveAndResizeModeToggled}
        moveAndResizeStateChanged={moveAndResizeStatusChanged}
        keepOpenToggled={onKeepOpenToggled}
        closeClicked={onDisabled} /></React.Fragment> : null }
  </React.Fragment>);
}
