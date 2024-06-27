import React, { JSXElementConstructor, } from "react";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import {
  getSingleTouchOrClick,
} from "../../services/domUtils/touchAndMouseEvents";

import {
  clearTimeoutIfReq,
} from "../../../trmrk-browser/domUtils/core";

export interface ClickableElementProps {
  children: React.ReactNode;
  component: React.ElementType;
  componentProps?: React.ComponentProps<keyof JSX.IntrinsicElements | JSXElementConstructor<any>> | null | undefined;
  longPressIntervalMs?: number | null | undefined;
  dblPressIntervalMs?: number | null | undefined;
  pressedCssClass?: string | null | undefined;
  onMouseDownOrTouchStart?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onMouseUpOrTouchEnd?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSinglePress?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSingleClick?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onDoublePress?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onLongPress?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  allowBothSingleAndDoublePress?: boolean | null | undefined;
}

export const LONG_PRESS_INTERVAL_MS = 400;
export const DBL_PRESS_INTERVAL_MS = 200;

export const isTouchOrLeftMouseBtnClick = (coords: TouchOrMouseCoords) => [0, null].indexOf(coords.mouseButton ?? null) >= 0;

export default function ClickableElement(
  props: ClickableElementProps) {
  const RetElem = props.component;
  const retElemRef = React.useRef<HTMLElement | null>(null);

  const lastMouseDownOrTouchStartCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastMouseUpOrTouchEndCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastMouseDownOrTouchStartTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastMouseUpOrTouchEndTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const longPressIntervalMs = React.useMemo(
    () => props.longPressIntervalMs ?? LONG_PRESS_INTERVAL_MS, [props.longPressIntervalMs]);

  const dblPressIntervalMs = React.useMemo(
    () => props.dblPressIntervalMs ?? DBL_PRESS_INTERVAL_MS, [props.dblPressIntervalMs]);

  const allowBothSingleAndDoublePress = React.useMemo(
    () => props.allowBothSingleAndDoublePress ?? true,
    [props.allowBothSingleAndDoublePress]
  );

  const clearAll = () => {
    clearTimeoutIfReq(lastMouseDownOrTouchStartTimeoutRef);
    clearTimeoutIfReq(lastMouseUpOrTouchEndTimeoutRef);
    
    lastMouseDownOrTouchStartCoordsRef.current = null;
    lastMouseUpOrTouchEndCoordsRef.current = null;
  }
  
  const onMouseDownOrTouchStart = (ev: React.MouseEvent | React.TouchEvent) => {
    const retElem = retElemRef.current;
    
    if (retElem) {
      const coords = getSingleTouchOrClick(ev);
      const lastMouseUpOrTouchEndCoords = lastMouseUpOrTouchEndCoordsRef.current;

      if (coords) {
        const isTouchOrLeftMouseBtnClickValue = isTouchOrLeftMouseBtnClick(coords);

        if (lastMouseUpOrTouchEndCoords) {
          clearAll();

          if (isTouchOrLeftMouseBtnClickValue) {
            if (props.onDoublePress) {
              props.onDoublePress(ev, lastMouseUpOrTouchEndCoords);
            }
          }
        } else {
          lastMouseDownOrTouchStartCoordsRef.current = coords;
          
          if (isTouchOrLeftMouseBtnClickValue) {
            lastMouseDownOrTouchStartTimeoutRef.current = setTimeout(() => {
              clearAll();

              if (props.onLongPress) {
                props.onLongPress(ev, coords);
              }
            }, longPressIntervalMs);
          }

          if (props.onMouseDownOrTouchStart) {
            props.onMouseDownOrTouchStart(ev, coords);
          }
        }
      }
    }
  }

  const onMouseUpOrTouchEnd = (ev: React.MouseEvent | React.TouchEvent) => {
    const retElem = retElemRef.current;
    
    if (retElem) {
      const coords = getSingleTouchOrClick(ev);
      const lastMouseDownOrTouchStartCoords = lastMouseDownOrTouchStartCoordsRef.current;

      if (coords) {
        const isTouchOrLeftMouseBtnClickValue = isTouchOrLeftMouseBtnClick(coords);

        if (lastMouseDownOrTouchStartCoords) {
          clearTimeoutIfReq(lastMouseDownOrTouchStartTimeoutRef);

          if (isTouchOrLeftMouseBtnClickValue) {
            lastMouseUpOrTouchEndCoordsRef.current = coords;

            if (allowBothSingleAndDoublePress) {
              if (props.onSinglePress) {
                props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
              }
              
              lastMouseUpOrTouchEndTimeoutRef.current = setTimeout(() => {
                clearAll();
              }, dblPressIntervalMs);
            } else {
              lastMouseUpOrTouchEndTimeoutRef.current = setTimeout(() => {
                clearAll();

                if (props.onSinglePress) {
                  props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
                }
              }, dblPressIntervalMs);
            }
          } else {
            clearAll();

            if (props.onSingleClick) {
              props.onSingleClick(ev, lastMouseDownOrTouchStartCoords);
            }
          }

          if (props.onMouseUpOrTouchEnd) {
            props.onMouseUpOrTouchEnd(ev, coords);
          }
        }
      }
    }
  }

  React.useEffect(() => {
  }, [
    retElemRef,
    lastMouseDownOrTouchStartCoordsRef,
    lastMouseUpOrTouchEndCoordsRef,
    lastMouseDownOrTouchStartTimeoutRef,
    lastMouseUpOrTouchEndTimeoutRef,
  ]);

  return (<RetElem {...props.componentProps}
    ref={(el: HTMLElement) => retElemRef.current = el}
    onMouseDown={onMouseDownOrTouchStart}
    onMouseUp={onMouseUpOrTouchEnd}>
      { props.children }
    </RetElem>);
} 
