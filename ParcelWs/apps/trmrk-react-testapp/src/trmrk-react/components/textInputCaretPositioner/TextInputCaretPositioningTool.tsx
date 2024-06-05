import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { MtblRefValue } from "../../../trmrk/core";
import { extractTextInput } from "../../../trmrk-browser/domUtils/textInput";
import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { HtmlElementRectangle, extractNumberFromCssPropVal } from "../../../trmrk-browser/domUtils/getDomElemBounds";
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

export const ICON_BTN_SIZE_PX = 40;
export const ICON_BTN_PADD_PX = 3;
export const ICON_BTN_MIN_TOTAL_SIZE_PX = ICON_BTN_SIZE_PX + ICON_BTN_PADD_PX * 2;

export default function TextInputCaretPositioningTool(props: TextInputCaretPositioningToolProps) {
  const mainElRef = React.useRef<HTMLElement | null>(null);

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
  const lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef = React.useRef<HtmlElementRectangle | null>(null);

  const dispatch = useDispatch();

  const onMainEl = React.useCallback((el: HTMLElement | null) => {
    mainElRef.current = el;
  }, [mainElRef]);

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
    const mainEl = mainElRef.current;

    if (mainEl) {
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = coords;
      const mainElRectngl = mainEl.getBoundingClientRect();

      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = {
        offsetTop: mainElRectngl.top,
        offsetLeft: mainElRectngl.left,
        width: mainElRectngl.width,
        height: mainElRectngl.height
      };

      setMoveAndResizeModeState(moveAndResizeState);
    }
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef]);

  const onToggleBackDrop = React.useCallback((showBackDrop: boolean) => {
    setShowBackDrop(showBackDrop);

    if (!showBackDrop) {
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = null;
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = null;
      
      if (isMoveAndResizeMode) {
        setIsMoveAndResizeMode(false);
        setMoveAndResizeModeState(null);
      }
    }
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef
  ]);

  const onBackDropTouchOrClick = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onToggleBackDrop(false);
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef
  ]);

  const onBackDropTouchOrMouseMove = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    if (isMoveAndResizeMode) {

      const mainEl = mainElRef.current;
      const lastMoveOrResizeTouchStartOrMouseDownCoords = lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current;
      const lastMoveOrResizeTouchStartOrMouseDownMainElCoords = lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current;

      if (mainEl && lastMoveOrResizeTouchStartOrMouseDownCoords && lastMoveOrResizeTouchStartOrMouseDownMainElCoords && (moveAndResizeModeState ?? null) !== null) {
        const mainElStyle = mainEl.style;
        const diffX = coords.pageX - lastMoveOrResizeTouchStartOrMouseDownCoords.pageX;
        const diffY = coords.pageY - lastMoveOrResizeTouchStartOrMouseDownCoords.pageY;

        if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.Moving) {
          const newOffsetLeft = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.offsetLeft + diffX;
          const newOffsetTop = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.offsetTop + diffY;

          mainElStyle.top = `${newOffsetTop}px`;
          mainElStyle.left = `${newOffsetLeft}px`;
        }
        else {
          let newOffsetLeft: number;
          let newOffsetTop: number;
          let newWidth: number;
          let newHeight: number;
          let newHeightIncr: number;
          let newWidthIncr: number;

          switch (moveAndResizeModeState) {
            case TextInputCaretPositionerMoveAndResizeState.ResizingFromTop:
              newOffsetTop = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.offsetTop + diffY;
              newHeight = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.height - diffY;

              newHeightIncr = ICON_BTN_MIN_TOTAL_SIZE_PX - newHeight;

              if (newHeightIncr > 0) {
                newHeight += newHeightIncr;
                newOffsetTop -= newHeightIncr;
              }

              mainElStyle.top = `${newOffsetTop}px`;
              mainElStyle.height = `${newHeight}px`;
              break;
            case TextInputCaretPositionerMoveAndResizeState.ResizingFromBottom:
              newHeight = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.height + diffY;

              newHeightIncr = ICON_BTN_MIN_TOTAL_SIZE_PX - newHeight;

              if (newHeightIncr > 0) {
                newHeight += newHeightIncr;
              }

              mainElStyle.height = `${newHeight}px`;
              break;
            case TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft:
              newOffsetLeft = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.offsetLeft + diffX;
              newWidth = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.width - diffX;

              newWidthIncr = ICON_BTN_MIN_TOTAL_SIZE_PX - newWidth;

              if (newWidthIncr > 0) {
                newWidth += newWidthIncr;
                newOffsetLeft = newWidthIncr;
              }

              mainElStyle.left = `${newOffsetLeft}px`;
              mainElStyle.width = `${newWidth}px`;
              break;
            case TextInputCaretPositionerMoveAndResizeState.ResizingFromRight:
              newWidth = lastMoveOrResizeTouchStartOrMouseDownMainElCoords.width + diffX;

              newWidthIncr = ICON_BTN_MIN_TOTAL_SIZE_PX - newWidth;

              if (newWidthIncr > 0) {
                newWidth += newWidthIncr;
              }

              mainElStyle.width = `${newWidth}px`;
              break;
          }
        }
      }
    }
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef
  ]);

  const onBackDropTouchEndOrMouseUp = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    if (isMoveAndResizeMode) {
      onBackDropTouchOrMouseMove(ev, coords);
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = null;
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = null;
      setMoveAndResizeModeState(null);
    }
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef
  ]);

  React.useEffect(() => {
    }, [
      mainElRef,
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
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef
    ]);
  return (<React.Fragment>
    { ((currentInputElMtblRef.value || keepOpen) && isEnabled) ? <React.Fragment>
    { showBackDrop ? <TrmrkBackDrop
      className="trmrk-text-input-caret-positioner-popover-backdrop"
      preventDefaultOnTouchOrMouseEvts={true}
      onTouchOrClick={onBackDropTouchOrClick}
      onTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onTouchEndOrMouseUp={onBackDropTouchEndOrMouseUp} /> : null }
    <TextInputCaretPositionerPopover
      onMainEl={onMainEl}
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
      onMainElTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onMainElTouchStartOrMouseUp={onBackDropTouchEndOrMouseUp}
      closeClicked={onDisabled} /></React.Fragment> : null }
  </React.Fragment>);
}
