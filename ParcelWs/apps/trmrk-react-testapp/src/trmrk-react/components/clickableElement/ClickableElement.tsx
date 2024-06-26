import React from "react";

import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import {
  getSingleTouchOrClick,
} from "../../services/domUtils/touchAndMouseEvents";

import {
  clearTimeoutIfReq,
} from "../../../trmrk-browser/domUtils/core";

import { normInnerBoundsRatio, touchIsOutOfBounds } from "../../hooks/useLongPress";

export interface ClickableElementProps {
  children: React.ReactNode;
  component: React.ElementType;
  componentProps?: React.ComponentProps<any>;
  longPressIntervalMs?: number | null | undefined;
  dblPressIntervalMs?: number | null | undefined;
  pressedCssClass?: string | null | undefined;
  onMouseDownOrTouchStart?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onMouseUpOrTouchEnd?: ((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSinglePress: (ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
  onDoublePress: (ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
  onLongPress: (ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => void;
}

export const LONG_PRESS_INTERVAL_MS = 400;
export const DBL_PRESS_INTERVAL_MS = 200;

export const isTouchOrLeftMouseBtnClick = (coords: TouchOrMouseCoords) => [0, null].indexOf(coords.mouseButton ?? null) >= 0;

export default function ClickableElement(props: ClickableElementProps) {
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
            props.onDoublePress(ev, lastMouseUpOrTouchEndCoords);
          }
        } else {
          lastMouseDownOrTouchStartCoordsRef.current = coords;
          
          if (isTouchOrLeftMouseBtnClickValue) {
            lastMouseDownOrTouchStartTimeoutRef.current = setTimeout(() => {
              clearAll();
              props.onLongPress(ev, coords);
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

            lastMouseUpOrTouchEndTimeoutRef.current = setTimeout(() => {
              clearAll();
              props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
            }, dblPressIntervalMs);
          } else {
            clearAll();
            props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
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
    onTouchStart={onMouseDownOrTouchStart}
    onMouseUp={onMouseUpOrTouchEnd}
    onTouchEnd={onMouseUpOrTouchEnd}>{ props.children }</RetElem>);
} 
