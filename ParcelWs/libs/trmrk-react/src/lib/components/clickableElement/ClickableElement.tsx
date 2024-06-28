import React, { JSXElementConstructor, } from "react";

import { getSingleTouchOrClick, TouchOrMouseCoords, MouseButton } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

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
  onMouseDownOrTouchStart?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onMouseUpOrTouchEnd?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSinglePress?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSingleClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onDoublePress?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onLongPress?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSingleMiddleClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onSingleRightClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onLongPressOrSingleRightClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  allowBothSingleAndDoublePress?: boolean | null | undefined;
}

export const LONG_PRESS_INTERVAL_MS = 400;
export const DBL_PRESS_INTERVAL_MS = 200;

export const isTouchOrLeftMouseBtnClick = (coords: TouchOrMouseCoords) => [MouseButton.Left, null].indexOf(coords.mouseButton ?? null) >= MouseButton.Left;

export default function ClickableElement(
  props: ClickableElementProps) {
  const RetElem = props.component;
  const retElemRef = React.useRef<HTMLElement | null>(null);

  const lastMouseDownCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastTouchStartCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);

  const lastMouseUpCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  const lastTouchEndCoordsRef = React.useRef<TouchOrMouseCoords | null>(null);
  
  const lastMouseDownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTouchStartTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const lastMouseUpTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTouchEndTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const tryPreventContextMenu = React.useRef(false);

  const longPressIntervalMs = React.useMemo(
    () => props.longPressIntervalMs ?? LONG_PRESS_INTERVAL_MS, [props.longPressIntervalMs]);

  const dblPressIntervalMs = React.useMemo(
    () => props.dblPressIntervalMs ?? DBL_PRESS_INTERVAL_MS, [props.dblPressIntervalMs]);

  const allowBothSingleAndDoublePress = React.useMemo(
    () => props.allowBothSingleAndDoublePress ?? true,
    [props.allowBothSingleAndDoublePress]
  );

  const clearAll = () => {
    clearTimeoutIfReq(lastMouseDownTimeoutRef);
    clearTimeoutIfReq(lastTouchStartTimeoutRef);
    
    clearTimeoutIfReq(lastMouseDownTimeoutRef);
    clearTimeoutIfReq(lastTouchEndTimeoutRef);
    
    lastMouseDownCoordsRef.current = null;
    lastTouchStartCoordsRef.current = null;
    
    lastMouseUpCoordsRef.current = null;
    lastTouchEndCoordsRef.current = null;
  }
  
  const onContextMenu = (ev: MouseEvent) => {
    const retElem = retElemRef.current;
    
    if (retElem) {
      if (tryPreventContextMenu.current || retElem.contains(ev.target as Node | null) || (
        lastMouseDownCoordsRef.current || lastTouchStartCoordsRef.current || lastMouseUpCoordsRef.current || lastTouchEndCoordsRef.current)) {
        if (props.onSingleRightClick || props.onLongPressOrSingleRightClick) {
          ev.preventDefault();
        }
        
        tryPreventContextMenu.current = false;
      }
    }
  }

  const onMouseDownOrTouchStart = (ev: MouseEvent | TouchEvent) => {
    const retElem = retElemRef.current;
    
    if (retElem) {
      const coords = getSingleTouchOrClick(ev);

      if (coords) {
        const lastMouseUpOrTouchEndCoords = (coords.isMouseEvt ? lastMouseUpCoordsRef : lastTouchEndCoordsRef).current;
        const isTouchOrLeftMouseBtnClickValue = isTouchOrLeftMouseBtnClick(coords);

        if (lastMouseUpOrTouchEndCoords) {
          clearAll();

          if (isTouchOrLeftMouseBtnClickValue) {
            if (props.onDoublePress) {
              props.onDoublePress(ev, lastMouseUpOrTouchEndCoords);
            }
          }
        } else {
          const timeoutCallback = () => {
            clearAll();
              
            if (isTouchOrLeftMouseBtnClickValue) {
              if (props.onLongPress) {
                props.onLongPress(ev, coords);
              }

              if (props.onLongPressOrSingleRightClick) {
                props.onLongPressOrSingleRightClick(ev, coords);
              }
            }
          };

          if (coords.isMouseEvt) {
            lastMouseDownCoordsRef.current = coords;
            lastMouseDownTimeoutRef.current = setTimeout(timeoutCallback, longPressIntervalMs);
          } else {
            lastTouchStartCoordsRef.current = coords;
            lastTouchStartTimeoutRef.current = setTimeout(timeoutCallback, longPressIntervalMs);
          }
        

          if (props.onMouseDownOrTouchStart) {
            props.onMouseDownOrTouchStart(ev, coords);
          }
        }
      }
    }
  }

  const onMouseUpOrTouchEnd = (ev: MouseEvent | TouchEvent) => {
    const retElem = retElemRef.current;
    
    if (retElem) {
      const coords = getSingleTouchOrClick(ev);

      if (coords) {
        const lastMouseDownOrTouchStartCoords = (coords.isMouseEvt ? lastMouseDownCoordsRef : lastTouchStartCoordsRef).current;
        const isTouchOrLeftMouseBtnClickValue = isTouchOrLeftMouseBtnClick(coords);

        if (lastMouseDownOrTouchStartCoords) {
          clearTimeoutIfReq(coords.isMouseEvt ? lastMouseDownTimeoutRef : lastTouchStartTimeoutRef);

          if (coords.isMouseEvt) {
            if (props.onSingleClick) {
              props.onSingleClick(ev, lastMouseDownOrTouchStartCoords);
            }
          }

          if (isTouchOrLeftMouseBtnClickValue) {
            let timeoutCallback: () => void;

            if (allowBothSingleAndDoublePress) {
              if (props.onSinglePress) {
                props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
              }
              
              timeoutCallback = () => {
                clearAll();
              };

            } else {
              timeoutCallback = () => {
                clearAll();

                if (props.onSinglePress) {
                  props.onSinglePress(ev, lastMouseDownOrTouchStartCoords);
                }
              };
            }

            if (coords.isMouseEvt) {
              lastMouseUpCoordsRef.current = coords;
              lastMouseUpTimeoutRef.current = setTimeout(timeoutCallback, dblPressIntervalMs);
            } else {
              lastTouchEndCoordsRef.current = coords;
              lastTouchEndTimeoutRef.current = setTimeout(timeoutCallback, dblPressIntervalMs);
            }
          } else {
            clearAll();

            switch (coords.mouseButton) {
              case MouseButton.Middle:
                if (props.onSingleMiddleClick) {
                  props.onSingleMiddleClick(ev, coords);
                }

                break;
              case MouseButton.Right:
                if (props.onSingleRightClick || props.onLongPressOrSingleRightClick) {
                  tryPreventContextMenu.current = true;
                }
                
                if (props.onSingleRightClick) {
                  props.onSingleRightClick(ev, coords);
                }
                
                if (props.onLongPressOrSingleRightClick) {
                  props.onLongPressOrSingleRightClick(ev, coords);
                }

                break;
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
    const retElem = retElemRef.current;
      
    if (retElem) {
      document.addEventListener("contextmenu", onContextMenu, {
        capture: true
      });
      
      retElem.addEventListener("mousedown", onMouseDownOrTouchStart, {
        capture: true
      });
      
      retElem.addEventListener("touchstart", onMouseDownOrTouchStart, {
        capture: true
      });
      
      retElem.addEventListener("mouseup", onMouseUpOrTouchEnd, {
        capture: true
      });
      
      retElem.addEventListener("touchend", onMouseUpOrTouchEnd, {
        capture: true
      });
    }

    if (retElem) {
      return () => {
        document.removeEventListener("contextmenu", onContextMenu, {
          capture: true
        });
      
        retElem.removeEventListener("mousedown", onMouseDownOrTouchStart, {
          capture: true
        });
        
        retElem.removeEventListener("touchstart", onMouseDownOrTouchStart, {
          capture: true
        });
        
        retElem.removeEventListener("mouseup", onMouseUpOrTouchEnd, {
          capture: true
        });
        
        retElem.removeEventListener("touchend", onMouseUpOrTouchEnd, {
          capture: true
        });
      }
    }
  }, [
    retElemRef,
    lastMouseDownCoordsRef,
    lastTouchStartCoordsRef,
    lastMouseUpCoordsRef,
    lastTouchEndCoordsRef,
    lastMouseDownTimeoutRef,
    lastTouchStartTimeoutRef,
    lastMouseUpTimeoutRef,
    lastTouchEndTimeoutRef,
    tryPreventContextMenu,
  ]);

  return (<RetElem {...props.componentProps}
    ref={(el: HTMLElement) => retElemRef.current = el}>
      { props.children }
    </RetElem>);
} 
