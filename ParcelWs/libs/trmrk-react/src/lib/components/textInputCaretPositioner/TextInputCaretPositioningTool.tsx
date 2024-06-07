import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { MtblRefValue, ValueOrAnyOrVoid } from "../../../trmrk/core";
import { extractTextInput } from "../../../trmrk-browser/domUtils/textInput";
import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { HtmlElementRectangle, HtmlElementStyleRectangleCore, applyRectnglProps } from "../../../trmrk-browser/domUtils/getDomElemBounds";
import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers, TextCaretPositionerOpts } from "../../redux/appData";

import { serializeTextCaretPositionerOptsToLocalStorage } from "../../../trmrk-browser/textCaretPositioner/core";

import TextInputCaretPositionerPopover from "./TextInputCaretPositionerPopover";
import { TextInputCaretPositionerMoveAndResizeState } from "./TextInputCaretPositionerMoveAndResizeView";
import TrmrkBackDrop from "../backDrop/TrmrkBackDrop";

import { ICON_BUTTONS_COUNT } from "./TextInputCaretPositionerMoveAndResizeView";
import { appDataReducers } from "../../../app/store/appDataSlice";

export interface TextInputCaretPositioningToolProps {
  sessionStorageSerializedOptsKey?: string | null | undefined;
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
export const BORDER_WIDTH_PX = 3;
export const MIN_TOTAL_SIZE_PX = ICON_BTN_SIZE_PX + BORDER_WIDTH_PX * 2;
export const MAX_TOTAL_SIZE_PX = ICON_BTN_SIZE_PX * ICON_BUTTONS_COUNT + BORDER_WIDTH_PX * 2;

export const disableTextCaretPositioner = (
  textCaretPositionerOpts: TextCaretPositionerOpts,
  sessionStorageSerializedOptsKey: string | null | undefined
) => updateTextCaretPositionerSizeAndOffset({
  ...textCaretPositionerOpts,
  enabled: false
}, sessionStorageSerializedOptsKey, null);

export const enableTextCaretPositioner = (
  textCaretPositionerOpts: TextCaretPositionerOpts,
  sessionStorageSerializedOptsKey: string | null | undefined
) => updateTextCaretPositionerOpts(() => ({
    ...textCaretPositionerOpts,
    enabled: true
  }), sessionStorageSerializedOptsKey);

export const toggleTextCaretPositioner = (
    textCaretPositionerOpts: TextCaretPositionerOpts,
    sessionStorageSerializedOptsKey: string | null | undefined,
    textCaretPositionerEnabled: boolean) => {
  let newTextCaretPositionerOpts: TextCaretPositionerOpts;
  if (!textCaretPositionerEnabled) {
    newTextCaretPositionerOpts = disableTextCaretPositioner(textCaretPositionerOpts, sessionStorageSerializedOptsKey);
  } else {
    newTextCaretPositionerOpts = enableTextCaretPositioner(textCaretPositionerOpts, sessionStorageSerializedOptsKey);
  }

  return newTextCaretPositionerOpts;
}

export const updateTextCaretPositionerSizeAndOffset = (
  textCaretPositionerOpts: TextCaretPositionerOpts,
  sessionStorageSerializedOptsKey: string | null | undefined,
  currentMainElCoords: HtmlElementRectangle | null) => updateTextCaretPositionerOpts(
    () => ({
      ...textCaretPositionerOpts,
      size: {
        width: currentMainElCoords?.width,
        height: currentMainElCoords?.height
      },
      viewPortOffset: {
        top: currentMainElCoords?.offsetTop,
        left: currentMainElCoords?.offsetLeft
      }
    }),
    sessionStorageSerializedOptsKey,
  );

export const updateTextCaretPositionerOpts = (
  newOptsFactory: () => TextCaretPositionerOpts,
  sessionStorageSerializedOptsKey: string | null | undefined,) => {

  const newTextCaretPositionerOpts = newOptsFactory();

  if (sessionStorageSerializedOptsKey !== "") {
    serializeTextCaretPositionerOptsToLocalStorage(
      newTextCaretPositionerOpts,
      sessionStorageSerializedOptsKey);
  }

  return newTextCaretPositionerOpts;
}

export default function TextInputCaretPositioningTool(props: TextInputCaretPositioningToolProps) {
  const mainElRef = React.useRef<HTMLElement | null>(null);

  const [ isFullViewPortMode, setIsFullViewPortMode ] = React.useState(false);
  const [ isMoveAndResizeMode, setIsMoveAndResizeMode ] = React.useState(false);
  const [ moveAndResizeModeState, setMoveAndResizeModeState ] = React.useState<TextInputCaretPositionerMoveAndResizeState | null>(null);
  const [ showBackDrop, setShowBackDrop ] = React.useState(false);

  const textCaretPositionerOpts = useSelector(props.appDataSelectors.getTextCaretPositionerOpts);
  const isEnabled = useSelector(props.appDataSelectors.getTextCaretPositionerEnabled);
  const isMinimized = useSelector(props.appDataSelectors.getTextCaretPositionerMinimized);
  const keepOpen = useSelector(props.appDataSelectors.getTextCaretPositionerKeepOpen);
  const isAnyMenuOpen = useSelector(props.appBarSelectors.isAnyMenuOpen);

  const currentInputElLastSetOpIdx = useSelector(
    props.appDataSelectors.getTextCaretPositionerCurrentInputElLastSetOpIdx);

  const lastMoveOrResizeTouchStartOrMouseDownCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef = React.useRef<HtmlElementRectangle | null>(null);
  const currentMainElCoordsRef = React.useRef<HtmlElementRectangle | null>(null);

  const rowsCountRef = React.useRef(0);
  const colsCountRef = React.useRef(0);

  const dispatch = useDispatch();

  const onMainEl = React.useCallback((el: HTMLElement | null) => {
    mainElRef.current = el;
  }, [mainElRef]);

  const minimizedToggled = React.useCallback((minimized: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerMinimized(minimized));

    updateTextCaretPositionerOpts(() => ({
      ...textCaretPositionerOpts,
        minimized: minimized
      }),
      props.sessionStorageSerializedOptsKey);
  }, [isMinimized]);

  const onKeepOpenToggled = React.useCallback((keepOpen: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerKeepOpen(keepOpen));

    updateTextCaretPositionerOpts(() => ({
      ...textCaretPositionerOpts,
        keepOpen: keepOpen
      }),
      props.sessionStorageSerializedOptsKey);
  }, [props.sessionStorageSerializedOptsKey, textCaretPositionerOpts]);

  const onDisabled = React.useCallback(() => {
    dispatch(props.appDataReducers.setTextCaretPositionerEnabled(false));

    const newTextCaretPositionerOpts = disableTextCaretPositioner(
      textCaretPositionerOpts, props.sessionStorageSerializedOptsKey
    );

    dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
  }, [props.sessionStorageSerializedOptsKey, textCaretPositionerOpts]);

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

      const currentMainElCoords = {
        offsetLeft: mainElRectngl.left,
        offsetTop: mainElRectngl.top,
        width: mainElRectngl.width,
        height: mainElRectngl.height
      };

      currentMainElCoordsRef.current = currentMainElCoords;
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = currentMainElCoords;

      setMoveAndResizeModeState(moveAndResizeState);
    }
  }, [
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef]);

  const onToggleBackDrop = React.useCallback((showBackDrop: boolean) => {
    setShowBackDrop(showBackDrop);
    
    if (!showBackDrop) {
      const currentMainElCoords = currentMainElCoordsRef.current;

      if (currentMainElCoords) {
        updateTextCaretPositionerSizeAndOffset(
          textCaretPositionerOpts,
          props.sessionStorageSerializedOptsKey,
          currentMainElCoords);
          
        currentMainElCoordsRef.current = null;
      }

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
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
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
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onBackDropTouchOrMouseMove = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    if (isMoveAndResizeMode) {

      const mainEl = mainElRef.current;
      const baseEvtCoords = lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current;
      const baseMainElCoords = lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current;
      const currentMainElCoords = currentMainElCoordsRef.current;

      if (mainEl && baseEvtCoords && baseMainElCoords && currentMainElCoords && (moveAndResizeModeState ?? null) !== null) {
        const viewPortWidth = window.innerWidth;
        const viewPortHeight = window.innerHeight;
        const mainElStyle = mainEl.style;
        const diffX = coords.pageX - baseEvtCoords.pageX;
        const diffY = coords.pageY - baseEvtCoords.pageY;

        if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.Moving) {
          let newOffsetLeft = baseMainElCoords.offsetLeft + diffX;
          let newOffsetTop = baseMainElCoords.offsetTop + diffY;

          newOffsetLeft = Math.max(0, Math.min(newOffsetLeft, viewPortWidth - baseMainElCoords.width));
          newOffsetTop = Math.max(0, Math.min(newOffsetTop, viewPortHeight - baseMainElCoords.height));

          currentMainElCoordsRef.current = {
            ...currentMainElCoords,
            offsetTop: newOffsetTop,
            offsetLeft: newOffsetLeft
          };

          mainElStyle.top = `${newOffsetTop}px`;
          mainElStyle.left = `${newOffsetLeft}px`;
        }
        else if (moveAndResizeModeState! > 0) {
          const mainElRectngl = mainEl.getBoundingClientRect();

          let newWidth: number;
          let newHeight: number;
          let newOffsetLeft: number;
          let newOffsetTop: number;
          let newRowsCount: number;
          let newColsCount: number;

          const isVertResize = [
            TextInputCaretPositionerMoveAndResizeState.ResizingFromTop,
            TextInputCaretPositionerMoveAndResizeState.ResizingFromBottom
          ].indexOf(moveAndResizeModeState!) >= 0;

          if (isVertResize) {
            if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.ResizingFromTop) {
              newHeight = baseMainElCoords.height - diffY;
            } else {
              newHeight = baseMainElCoords.height + diffY;
            }

            const diffToMinHeight = newHeight - MIN_TOTAL_SIZE_PX;
            const diffToMaxHeight = MAX_TOTAL_SIZE_PX - newHeight;

            if (diffToMinHeight < 0) {
              newHeight = MIN_TOTAL_SIZE_PX;
            } else if (diffToMaxHeight < 0) {
              newHeight = MAX_TOTAL_SIZE_PX;
            }

            newColsCount = Math.floor((newHeight - 2 * BORDER_WIDTH_PX) / ICON_BTN_SIZE_PX);
            newRowsCount = Math.ceil(ICON_BUTTONS_COUNT / newColsCount);
            newWidth = newRowsCount * ICON_BTN_SIZE_PX + 2 * BORDER_WIDTH_PX;
            
            if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.ResizingFromTop) {
              const newHeightDiff = newHeight - baseMainElCoords.height;
              newOffsetTop = baseMainElCoords.offsetTop - newHeightDiff;
            } else {
              newOffsetTop = baseMainElCoords.offsetTop;
            }
            
            if (coords.pageX < mainElRectngl.left) {
              newOffsetLeft = coords.pageX;
            } else if (coords.pageX > mainElRectngl.left + newWidth) {
              newOffsetLeft = coords.pageX - newWidth;
            } else {
              newOffsetLeft = mainElRectngl.left;
            }
          } else {
            if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft) {
              newWidth = baseMainElCoords.width - diffX;
            } else {
              newWidth = baseMainElCoords.width + diffX;
            }

            const diffToMinWidth = newWidth - MIN_TOTAL_SIZE_PX;
            const diffToMaxWidth = MAX_TOTAL_SIZE_PX - newWidth;

            if (diffToMinWidth < 0) {
              newWidth = MIN_TOTAL_SIZE_PX;
            } else if (diffToMaxWidth < 0) {
              newWidth = MAX_TOTAL_SIZE_PX;
            }

            newRowsCount = Math.floor((newWidth - 2 * BORDER_WIDTH_PX) / ICON_BTN_SIZE_PX);
            newColsCount = Math.ceil(ICON_BUTTONS_COUNT / newRowsCount);
            newHeight = newColsCount * ICON_BTN_SIZE_PX + 2 * BORDER_WIDTH_PX;
            
            if (moveAndResizeModeState === TextInputCaretPositionerMoveAndResizeState.ResizingFromLeft) {
              const newWidthDiff = newWidth - baseMainElCoords.width;
              newOffsetLeft = baseMainElCoords.offsetLeft - newWidthDiff;
            } else {
              newOffsetLeft = baseMainElCoords.offsetLeft;
            }

            if (coords.pageY < mainElRectngl.top) {
              newOffsetTop = coords.pageY;
            } else if (coords.pageY > mainElRectngl.top + newHeight) {
              newOffsetTop = coords.pageY - newHeight;
            } else {
              newOffsetTop = mainElRectngl.top;
            }
          }

          newOffsetLeft = Math.max(0, Math.min(newOffsetLeft, viewPortWidth));
          newOffsetTop = Math.max(0, Math.min(newOffsetTop, viewPortHeight));

          currentMainElCoordsRef.current = {
            offsetTop: newOffsetTop,
            offsetLeft: newOffsetLeft,
            width: newWidth,
            height: newHeight
          }

          mainElStyle.top = `${newOffsetTop}px`;
          mainElStyle.left = `${newOffsetLeft}px`;
          mainElStyle.width = `${newWidth}px`;
          mainElStyle.height = `${newHeight}px`;
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
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef,
      rowsCountRef,
      colsCountRef,
  ]);

  const onBackDropTouchEndOrMouseUp = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    if (isMoveAndResizeMode) {
      onBackDropTouchOrMouseMove(ev, coords);
      const currentMainElCoords = currentMainElCoordsRef.current;

      if (currentMainElCoords) {
        const newTextCaretPositionerOpts = updateTextCaretPositionerSizeAndOffset(
          textCaretPositionerOpts,
          props.sessionStorageSerializedOptsKey,
          currentMainElCoords);
        
        currentMainElCoordsRef.current = null;
        dispatch(appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
      }

      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = null;
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = null;
      setMoveAndResizeModeState(TextInputCaretPositionerMoveAndResizeState.Pending);
    }
  }, [
      props.sessionStorageSerializedOptsKey,
      mainElRef,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  React.useEffect(() => {
    const mainEl = mainElRef.current;

    if (mainEl) {
      const viewPortOffset = textCaretPositionerOpts.viewPortOffset;
      const size = textCaretPositionerOpts.size;

      const rectngl: HtmlElementStyleRectangleCore = {
        top: viewPortOffset.top,
        left: viewPortOffset.left
      } as HtmlElementStyleRectangleCore;

      if (!isMinimized) {
        rectngl.width = size.width;
        rectngl.height = size.height;
      }

      applyRectnglProps(mainEl.style, rectngl, true);
    }
    }, [
      props.sessionStorageSerializedOptsKey,
      mainElRef,
      currentInputElMtblRef.value,
      isFullViewPortMode,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      textCaretPositionerOpts,
      isMinimized,
      isEnabled,
      keepOpen,
      isAnyMenuOpen,
      currentInputElLastSetOpIdx,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
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
      minimized={isMinimized}
      keepOpen={keepOpen}
      isFullViewPortMode={isFullViewPortMode}
      isMoveAndResizeMode={isMoveAndResizeMode}
      moveAndResizeState={moveAndResizeModeState}
      minimizedToggled={minimizedToggled}
      isFullViewPortModeToggled={isFullViewPortModeToggled}
      isMoveAndResizeModeToggled={isMoveAndResizeModeToggled}
      moveAndResizeStateChanged={moveAndResizeStatusChanged}
      keepOpenToggled={onKeepOpenToggled}
      onMainElTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onMainElTouchEndOrMouseUp={onBackDropTouchEndOrMouseUp}
      closeClicked={onDisabled} /></React.Fragment> : null }
  </React.Fragment>);
}
