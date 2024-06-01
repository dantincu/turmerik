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

import { setTextCaretPositionerEnabledToLocalStorage,
  setTextCaretPositionerKeepOpenToLocalStorage } from "../../../trmrk-browser/domUtils/core";

import TextInputCaretPositionerPopover from "../../../trmrk-react/components/textCaretInputPositioner/TextCaretPositionerPopover";
import TrmrkBackDrop from "../../../trmrk-react/components/backDrop/TrmrkBackDrop";

export interface TextCaretPositioningToolProps {
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

export default function TextCaretPositioningTool(props: TextCaretPositioningToolProps) {
  const [ isFullViewPortMode, setIsFullViewPortMode ] = React.useState(false);
  const [ isMoveMode, setIsMoveMode ] = React.useState(false);
  const [ isResizeMode, setIsResizeMode ] = React.useState(false);
  const [ showBackDrop, setShowBackDrop ] = React.useState(false);

  const isEnabled = useSelector(props.appDataSelectors.getTextCaretPositionerEnabled);
  const keepOpen = useSelector(props.appDataSelectors.getTextCaretPositionerKeepOpen);
  const isAnyMenuOpen = useSelector(props.appBarSelectors.isAnyMenuOpen);

  const currentInputElLastSetOpIdx = useSelector(
    props.appDataSelectors.getTextCaretPositionerCurrentInputElLastSetOpIdx);

  const dispatch = useDispatch();

  const onKeepOpenToggled = React.useCallback((keepOpen: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerKeepOpen(keepOpen));
    setTextCaretPositionerKeepOpenToLocalStorage(keepOpen);
  }, []);

  const onDisabled = React.useCallback(() => {
    dispatch(props.appDataReducers.setTextCaretPositionerEnabled(false));
    setTextCaretPositionerEnabledToLocalStorage(false);
  }, []);

  const isFullViewPortModeToggled = React.useCallback((isFullViewPortMode: boolean) => {
    setIsFullViewPortMode(isFullViewPortMode);
  }, [isFullViewPortMode]);

  const isMoveModeToggled = React.useCallback((isMoveMode: boolean) => {
    if (isMoveMode) {
      setIsMoveMode(isMoveMode);
    }
    
    onToggleBackDrop(isMoveMode);
  }, [isMoveMode]);

  const isResizeModeToggled = React.useCallback((isResizeMode: boolean) => {

    if (isResizeMode) {
      setIsResizeMode(isResizeMode);
    }
    
    onToggleBackDrop(isResizeMode);
  }, [isResizeMode]);

  const onToggleBackDrop = React.useCallback((showBackDrop: boolean) => {
    setShowBackDrop(showBackDrop);

    if (!showBackDrop) {
      if (isMoveMode) {
        setIsMoveMode(false);
      }
      
      if (isResizeMode) {
        setIsResizeMode(false);
      }
    }
  }, [
      isFullViewPortMode,
      isMoveMode,
      isResizeMode,
      showBackDrop
  ]);

  const onBackDropTouchOrClick = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onToggleBackDrop(false);
  }, [
      isFullViewPortMode,
      isMoveMode,
      isResizeMode,
      showBackDrop
  ]);

  React.useEffect(() => {
    }, [
      currentInputElMtblRef.value,
      isFullViewPortMode,
      isMoveMode,
      isResizeMode,
      showBackDrop,
      isEnabled,
      keepOpen,
      isAnyMenuOpen,
      currentInputElLastSetOpIdx,
    ]);
  return (<React.Fragment>
    { ((currentInputElMtblRef.value || keepOpen) && isEnabled) ? <React.Fragment>
    { showBackDrop ? <TrmrkBackDrop onTouchOrClick={onBackDropTouchOrClick} /> : null }
    <TextInputCaretPositionerPopover
        inputEl={currentInputElMtblRef.value}
        inFrontOfAll={!isAnyMenuOpen}
        keepOpen={keepOpen}
        isFullViewPortMode={isFullViewPortMode}
        isMoveMode={isMoveMode}
        isResizeMode={isResizeMode}
        isFullViewPortModeToggled={isFullViewPortModeToggled}
        isMoveModeToggled={isMoveModeToggled}
        isResizeModeToggled={isResizeModeToggled}
        keepOpenToggled={onKeepOpenToggled}
        closeClicked={onDisabled} /></React.Fragment> : null }
  </React.Fragment>);
}
