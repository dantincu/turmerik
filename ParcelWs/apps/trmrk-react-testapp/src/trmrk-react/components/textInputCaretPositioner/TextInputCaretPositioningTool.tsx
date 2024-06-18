import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { MtblRefValue, getFromMap } from "../../../trmrk/core";
import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import { HtmlElementRectangle, HtmlElementStyleRectangleCore, applyRectnglProps } from "../../../trmrk-browser/domUtils/getDomElemBounds";
import { ScreenOrientationType } from "../../../trmrk-browser/domUtils/deviceOrientation";
import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers, setTextCaretPositionerOptsToLocalStorage } from "../../redux/appData";

import { deserializeTextCaretPositionerOptsFromLocalStorage,
  TextCaretPositionerViewPortOffset,
  TextCaretPositionerSize,
  TextCaretPositionerOptsItemScope,
  TextCaretPositionerOptsItemType,
  TextCaretPositionerOptsItemCore,
  TextCaretPositionerOptsItemsScopeMap,
  TextCaretPositionerOptsItemsScreenOrientationTypeMap,
  TextCaretPositionerOptsItemsTypeMap,
  TextCaretPositionerOpts } from "../../../trmrk-browser/textCaretPositioner/core";

import TextInputCaretPositionerPopover from "./TextInputCaretPositionerPopover";
import { TextInputCaretPositionerMoveAndResizeState } from "./TextInputCaretPositionerMoveAndResizeView";
import TrmrkBackDrop from "../backDrop/TrmrkBackDrop";

import { ICON_BUTTONS_COUNT } from "./TextInputCaretPositionerMoveAndResizeView";

export interface TextInputCaretPositioningToolProps {
  localStorageSerializedOptsKey?: string | null | undefined;
  textCaretPositionerOptsItemScope?: TextCaretPositionerOptsItemScope;
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

export const getTextCaretPositionerOptsItem = (
  textCaretPositionerOpts: TextCaretPositionerOpts,
  textCaretPositionerOptsItemScope: TextCaretPositionerOptsItemScope,
  currentOrientation: ScreenOrientationType,
  textCaretPositionerOptsItemType: TextCaretPositionerOptsItemType) => getFromMap(
    textCaretPositionerOpts.map,
    textCaretPositionerOptsItemScope,
    map => getFromMap(map, currentOrientation, map1 => map1[textCaretPositionerOptsItemType])) ?? {
      enabled: true
    } as |TextCaretPositionerOptsItemCore;

export const getTextCaretPositionerOptsItemType = (
  isFullViewPortMode: boolean
): TextCaretPositionerOptsItemType => isFullViewPortMode ? "FullViewPort" : "Default";

export const updateTextCaretPositionerOpts = (
  newTextCaretPositionerOpts: TextCaretPositionerOpts,
  textCaretPositionerOptsItemScope: TextCaretPositionerOptsItemScope,
  currentOrientation: ScreenOrientationType,
  textCaretPositionerOptsItemType: TextCaretPositionerOptsItemType,
  newTextCaretPositionerOptsItem: TextCaretPositionerOptsItemCore,
  setToCurrent: boolean = true) => {
    newTextCaretPositionerOpts.map = {...newTextCaretPositionerOpts.map};

    const newTextCaretPositionerOptsMapLvl1 = ({ ...(newTextCaretPositionerOpts.map[textCaretPositionerOptsItemScope] ?? {
    })} as TextCaretPositionerOptsItemsScreenOrientationTypeMap);

    const newTextCaretPositionerOptsMapLvl2 = ({ ...(newTextCaretPositionerOptsMapLvl1[currentOrientation] ?? {
    })} as TextCaretPositionerOptsItemsTypeMap);

    newTextCaretPositionerOptsMapLvl2[textCaretPositionerOptsItemType] = newTextCaretPositionerOptsItem;
    newTextCaretPositionerOptsMapLvl1[currentOrientation] = newTextCaretPositionerOptsMapLvl2;
    newTextCaretPositionerOpts.map[textCaretPositionerOptsItemScope] = newTextCaretPositionerOptsMapLvl1;

    if (setToCurrent) {
      newTextCaretPositionerOpts.current = newTextCaretPositionerOptsItem;
    }
    
    return newTextCaretPositionerOpts;
}

export const updateTextCaretPositionerSizeAndOffset = (
  textCaretPositionerOpts: TextCaretPositionerOptsItemCore,
  currentMainElCoords: HtmlElementRectangle | null) => ({
      ...textCaretPositionerOpts,
      size: {
        width: currentMainElCoords?.width,
        height: currentMainElCoords?.height
      },
      viewPortOffset: {
        top: currentMainElCoords?.offsetTop,
        left: currentMainElCoords?.offsetLeft
      }
    })

export default function TextInputCaretPositioningTool(props: TextInputCaretPositioningToolProps) {
  const mainElRef = React.useRef<HTMLElement | null>(null);

  const [ currentOrientation, setCurrentOrientation ] = React.useState<ScreenOrientationType>(screen.orientation.type);
  const [ isMoveAndResizeMode, setIsMoveAndResizeMode ] = React.useState(false);
  const [ moveAndResizeModeState, setMoveAndResizeModeState ] = React.useState<TextInputCaretPositionerMoveAndResizeState | null>(null);
  const [ showBackDrop, setShowBackDrop ] = React.useState(false);

  const textCaretPositionerOptsItemScope = props.textCaretPositionerOptsItemScope ?? "App";
  const textCaretPositionerOpts = useSelector(props.appDataSelectors.getTextCaretPositionerOpts);
  // const [ textCaretPositionerOptsVal, setTextCaretPositionerOptsVal ] = React.useState(textCaretPositionerOpts);

  const isAnyMenuOpen = useSelector(props.appBarSelectors.isAnyMenuOpen);

  const currentInputElLastSetOpIdx = useSelector(
    props.appDataSelectors.getTextCaretPositionerCurrentInputElLastSetOpIdx);

  const lastMoveOrResizeTouchStartOrMouseDownCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef = React.useRef<HtmlElementRectangle | null>(null);
  const currentMainElCoordsRef = React.useRef<HtmlElementRectangle | null>(null);

  const dispatch = useDispatch();

  const onMainEl = React.useCallback((el: HTMLElement | null) => {
    mainElRef.current = el;
  }, [mainElRef]);

  const minimizedToggled = React.useCallback((minimized: boolean) => {
    let newTextCaretPositionerOpts = { ...textCaretPositionerOpts };
    const textCaretPositionerOptsItemType = getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode);

    newTextCaretPositionerOpts = updateTextCaretPositionerOpts(
      newTextCaretPositionerOpts,
      textCaretPositionerOptsItemScope,
      currentOrientation,
      textCaretPositionerOptsItemType,
      { ...textCaretPositionerOpts.current, minimized });

    dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
    setTextCaretPositionerOptsToLocalStorage(newTextCaretPositionerOpts, props.localStorageSerializedOptsKey);
  }, [
    currentOrientation,
    textCaretPositionerOpts,
    /* textCaretPositionerOptsVal */]);

  const onKeepOpenToggled = React.useCallback((keepOpen: boolean) => {
    let newTextCaretPositionerOpts = { ...textCaretPositionerOpts };
    const textCaretPositionerOptsItemType = getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode);

    newTextCaretPositionerOpts = updateTextCaretPositionerOpts(
      newTextCaretPositionerOpts,
      textCaretPositionerOptsItemScope,
      currentOrientation,
      textCaretPositionerOptsItemType,
      { ...textCaretPositionerOpts.current, keepOpen });

    dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
    setTextCaretPositionerOptsToLocalStorage(newTextCaretPositionerOpts, props.localStorageSerializedOptsKey);
  }, [
    currentOrientation,
    textCaretPositionerOpts,
    /* textCaretPositionerOptsVal */]);

  const onDisabled = React.useCallback(() => {
    let newTextCaretPositionerOpts = { ...textCaretPositionerOpts };
    const textCaretPositionerOptsItemType = getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode);

    newTextCaretPositionerOpts = updateTextCaretPositionerOpts(
      newTextCaretPositionerOpts,
      textCaretPositionerOptsItemScope,
      currentOrientation,
      textCaretPositionerOptsItemType,
      { ...textCaretPositionerOpts.current, enabled: false });

    dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
    setTextCaretPositionerOptsToLocalStorage(newTextCaretPositionerOpts, props.localStorageSerializedOptsKey);
  }, [
    textCaretPositionerOpts,
    /* textCaretPositionerOptsVal */]);

  const isFullViewPortModeToggled = React.useCallback((isFullViewPortMode: boolean) => {
    let newTextCaretPositionerOpts = { ...textCaretPositionerOpts, isFullViewPortMode };

    dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
    setTextCaretPositionerOptsToLocalStorage(newTextCaretPositionerOpts, props.localStorageSerializedOptsKey);
  }, [
    currentOrientation,
    textCaretPositionerOpts,
    /* textCaretPositionerOptsVal */]);

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
      isMoveAndResizeMode,
      moveAndResizeModeState,
      showBackDrop,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef]);

  const onToggleBackDrop = React.useCallback((showBackDrop: boolean) => {
    onToggleBackDropCore(showBackDrop);
  }, [
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onToggleFullViewPortBackDrop = React.useCallback((showBackDrop: boolean) => {
    onToggleBackDropCore(showBackDrop);
  }, [
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onToggleBackDropCore = React.useCallback((
    showBackDrop: boolean) => {
    setShowBackDrop(showBackDrop);
    
    if (!showBackDrop) {
      const currentMainElCoords = currentMainElCoordsRef.current;

      if (currentMainElCoords) {
        const newCurrentTextCaretPositionerOpts = updateTextCaretPositionerSizeAndOffset(
          textCaretPositionerOpts.current,
          currentMainElCoords);

        const newTextCaretPositionerOpts = updateTextCaretPositionerOpts(
          {...textCaretPositionerOpts},
          textCaretPositionerOptsItemScope,
          currentOrientation,
          getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode),
          newCurrentTextCaretPositionerOpts);

        dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
        setTextCaretPositionerOptsToLocalStorage(newTextCaretPositionerOpts, props.localStorageSerializedOptsKey);
          
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
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onBackDropTouchOrClick = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onToggleBackDrop(false);
  }, [
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onFullViewPortBackDropTouchOrClick = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onToggleFullViewPortBackDrop(false);
  }, [
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
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
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef,
  ]);

  const onBackDropTouchEndOrMouseUp = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onBackDropTouchEndOrMouseUpCore(ev, coords);
  }, [
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onFullViewPortBackDropTouchEndOrMouseUp = React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    onBackDropTouchEndOrMouseUpCore(ev, coords);
  }, [
      props.localStorageSerializedOptsKey,
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  const onBackDropTouchEndOrMouseUpCore = React.useCallback((
    ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
    if (isMoveAndResizeMode) {
      onBackDropTouchOrMouseMove(ev, coords);
      const currentMainElCoords = currentMainElCoordsRef.current;

      if (currentMainElCoords) {
      const newTextCaretPositionerOpts = updateTextCaretPositionerOpts(
        { ...textCaretPositionerOpts },
        textCaretPositionerOptsItemScope,
        currentOrientation,
        getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode),
        updateTextCaretPositionerSizeAndOffset(
            textCaretPositionerOpts.current,
            currentMainElCoords));

        dispatch(props.appDataReducers.setTextCaretPositionerOpts(newTextCaretPositionerOpts));
        currentMainElCoordsRef.current = null;
      }

      lastMoveOrResizeTouchStartOrMouseDownCoordsRef.current = null;
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef.current = null;
      setMoveAndResizeModeState(TextInputCaretPositionerMoveAndResizeState.Pending);
    }
  }, [
      props.localStorageSerializedOptsKey,
      mainElRef,
      isMoveAndResizeMode,
      moveAndResizeModeState,
      currentOrientation,
      textCaretPositionerOpts,
      /* textCaretPositionerOptsVal */,
      showBackDrop,
      lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
      lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
      currentMainElCoordsRef
  ]);

  React.useEffect(() => {
    const mainEl = mainElRef.current;

    if (mainEl) {
      let viewPortOffset: TextCaretPositionerViewPortOffset;
      let size: TextCaretPositionerSize;
      let minimized: boolean;

      viewPortOffset = textCaretPositionerOpts.current.viewPortOffset ?? {};
      size = textCaretPositionerOpts.current.size ?? {};
      minimized = textCaretPositionerOpts.current.minimized;

      const rectngl: HtmlElementStyleRectangleCore = {
        top: viewPortOffset.top,
        left: viewPortOffset.left
      } as HtmlElementStyleRectangleCore;

      if (!minimized) {
        rectngl.width = size.width;
        rectngl.height = size.height;
      }

      applyRectnglProps(mainEl.style, rectngl, true);
    }

    console.log("textCaretPositionerOpts.current", textCaretPositionerOpts.current);

    if (!textCaretPositionerOpts.current) {
      dispatch(props.appDataReducers.setTextCaretPositionerOpts({
        ...textCaretPositionerOpts,
        current: getTextCaretPositionerOptsItem(
          textCaretPositionerOpts,
          textCaretPositionerOptsItemScope,
          currentOrientation,
          getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode)
        ) ?? {}
      }));
    }

    const handleOrientation = (ev: DeviceOrientationEvent) => {
      const newOrientationTypeValue = screen.orientation.type;
      setCurrentOrientation(newOrientationTypeValue);

      dispatch(props.appDataReducers.setTextCaretPositionerOpts({
        ...textCaretPositionerOpts,
        current: getTextCaretPositionerOptsItem(
          textCaretPositionerOpts,
          textCaretPositionerOptsItemScope,
          newOrientationTypeValue,
          getTextCaretPositionerOptsItemType(textCaretPositionerOpts.isFullViewPortMode)
        ) ?? {}
      }));
    };

    /* if (textCaretPositionerOpts !== textCaretPositionerOptsVal) {
      setTextCaretPositionerOptsVal(textCaretPositionerOpts);
    } */

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [
    currentOrientation,
    currentOrientation,
    textCaretPositionerOpts,
    /* textCaretPositionerOptsVal */,
    mainElRef,
    currentInputElMtblRef.value,
    isMoveAndResizeMode,
    moveAndResizeModeState,
    showBackDrop,
    isAnyMenuOpen,
    currentInputElLastSetOpIdx,
    lastMoveOrResizeTouchStartOrMouseDownCoordsRef,
    lastMoveOrResizeTouchStartOrMouseDownMainElCoordsRef,
    currentMainElCoordsRef
  ]);

  return (<React.Fragment>
    { (textCaretPositionerOpts.current?.enabled && (
      currentInputElMtblRef.value || textCaretPositionerOpts.current.keepOpen || textCaretPositionerOpts.isFullViewPortMode)) ? <React.Fragment>
    { showBackDrop ? textCaretPositionerOpts.isFullViewPortMode ? <TrmrkBackDrop
      className="trmrk-text-input-caret-positioner-popover-backdrop"
      preventDefaultOnTouchOrMouseEvts={true}
      onTouchOrClick={onFullViewPortBackDropTouchOrClick}
      onTouchOrMouseMove={onFullViewPortBackDropTouchEndOrMouseUp}
      onTouchEndOrMouseUp={onFullViewPortBackDropTouchEndOrMouseUp} /> : <TrmrkBackDrop
      className="trmrk-text-input-caret-positioner-popover-backdrop"
      preventDefaultOnTouchOrMouseEvts={true}
      onTouchOrClick={onBackDropTouchOrClick}
      onTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onTouchEndOrMouseUp={onBackDropTouchEndOrMouseUp} /> : null }
    { textCaretPositionerOpts.isFullViewPortMode ? <TextInputCaretPositionerPopover
      onMainEl={onMainEl}
      inputEl={currentInputElMtblRef.value}
      inFrontOfAll={!isAnyMenuOpen}
      minimized={false}
      keepOpen={true}
      isForFullViewPortMode={true}
      isMoveAndResizeMode={isMoveAndResizeMode}
      moveAndResizeState={moveAndResizeModeState}
      isMoveAndResizeModeToggled={isMoveAndResizeModeToggled}
      moveAndResizeStateChanged={moveAndResizeStatusChanged}
      onMainElTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onMainElTouchEndOrMouseUp={onFullViewPortBackDropTouchEndOrMouseUp} /> : <TextInputCaretPositionerPopover
      onMainEl={onMainEl}
      inputEl={currentInputElMtblRef.value}
      inFrontOfAll={!isAnyMenuOpen}
      minimized={textCaretPositionerOpts.current.minimized}
      keepOpen={textCaretPositionerOpts.current.keepOpen}
      isForFullViewPortMode={false}
      isMoveAndResizeMode={isMoveAndResizeMode}
      moveAndResizeState={moveAndResizeModeState}
      minimizedToggled={minimizedToggled}
      isFullViewPortModeToggled={isFullViewPortModeToggled}
      isMoveAndResizeModeToggled={isMoveAndResizeModeToggled}
      moveAndResizeStateChanged={moveAndResizeStatusChanged}
      keepOpenToggled={onKeepOpenToggled}
      onMainElTouchOrMouseMove={onBackDropTouchOrMouseMove}
      onMainElTouchEndOrMouseUp={onBackDropTouchEndOrMouseUp}
      closeClicked={onDisabled} /> }</React.Fragment> : null }
  </React.Fragment>);
}
