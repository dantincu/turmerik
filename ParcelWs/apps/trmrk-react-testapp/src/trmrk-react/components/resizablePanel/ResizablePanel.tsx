import React from "react";

import "./ResizablePanel.scss";

import { Kvp } from "../../trmrk/core";

export enum ResizablePanelBorderSize {
  Regular,
  Thick
}

export enum ResizablePanelBorderOpacity {
  Opc25,
  Opc50
}

export enum ResizeDirection {
  FromLeft,
  FromTopLeft,
  FromTop,
  FromTopRight,
  FromRight,
  FromBottomRight,
  FromBottom,
  FromBottomLeft
}

export interface ResizablePanelOpts {
  parentRef: React.RefObject<HTMLElement>,
  panelElAvailable: (panelRef: HTMLDivElement) => void,
  className?: string | null | undefined;
  draggableBorderSize?: ResizablePanelBorderSize | null | undefined;
  draggableBorderOpacity?: ResizablePanelBorderOpacity | null | undefined;
  resizableFromTop?: boolean | null | undefined;
  resizableFromBottom?: boolean | null | undefined;
  resizableFromLeft?: boolean | null | undefined;
  resizableFromRight?: boolean | null | undefined;
  resizeStarted?: ((e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => void) | null | undefined;
  resizing: (e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => void;
  resizeEnded?: ((e: MouseEvent | TouchEvent | null, touchOrMousePos: TouchOrMousePosition | null, rszDir: ResizeDirection) => void) | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
  lastRefreshTmStmp?: Date | number | null | undefined
}

export interface TouchOrMousePosition {
  screenX: number;
  screenY: number;
  touch: Touch | null;
}

export const getTouch = (e: MouseEvent | TouchEvent) => {
  const touches = (e as TouchEvent).touches;
  const touch = touches ? touches[0] : null;

  return touch;
}

export const getTouchOrMousePosition = (e: MouseEvent | TouchEvent): TouchOrMousePosition => {
  const touch = getTouch(e);

  const retObj = {
    touch
  } as TouchOrMousePosition;

  if (touch) {
    retObj.screenX = touch.screenX;
    retObj.screenY = touch.screenY;
  } else {
    retObj.screenX = (e as MouseEvent).screenX;
    retObj.screenY = (e as MouseEvent).screenY;
  }

  return retObj;
};

export const getDraggableBorderSizeClassName = (draggableBorderSize?: ResizablePanelBorderSize | null | undefined) => {
  let draggableBorderSizeClassName = "";
  
  switch (draggableBorderSize) {
    case ResizablePanelBorderSize.Regular:
      draggableBorderSizeClassName = "trmrk-regular-border";
      break;
    case ResizablePanelBorderSize.Thick:
      draggableBorderSizeClassName = "trmrk-thick-border";
      break;
  }

  return draggableBorderSizeClassName;
}

export const getDraggableBorderOpacityClassName = (draggableBorderOpacity?: ResizablePanelBorderOpacity | null | undefined) => {
  let draggableBorderOpacityClassName = "";
  
  switch (draggableBorderOpacity) {
    case ResizablePanelBorderOpacity.Opc25:
      draggableBorderOpacityClassName = "trmrk-border-alpha-25";
      break;
    case ResizablePanelBorderOpacity.Opc50:
      draggableBorderOpacityClassName = "trmrk-border-alpha-50";
      break;
  }

  return draggableBorderOpacityClassName;
}

export type ResizeHandlersMap = { [ key in ResizeDirection ]: (e: MouseEvent | TouchEvent, mouseMovement: TouchOrMousePosition, rszDir: ResizeDirection) => void };

export const normalizeOrtoResizeHandler = (ortoHandler: (
  e: MouseEvent | TouchEvent, mouseMovement: TouchOrMousePosition, rszDir: ResizeDirection) => void) => (
  e: MouseEvent | TouchEvent, mouseMovement: TouchOrMousePosition, rszDir: ResizeDirection) => normalizeOrtoResizeHandlerCore(
    (dir) => ortoHandler(e, mouseMovement, dir), rszDir);

export const combineOrtoResizeHandlers = (handlersMap: ResizeHandlersMap) => (
  e: MouseEvent | TouchEvent, mouseMovement: TouchOrMousePosition, rszDir: ResizeDirection) => normalizeOrtoResizeHandlerCore(
  (dir) => handlersMap[dir](e, mouseMovement, dir), rszDir);

export const normalizeOrtoResizeHandlerCore = (
  handler: (dir: ResizeDirection) => void,
  rszDir: ResizeDirection
) => {
    switch (rszDir) {
      case ResizeDirection.FromTopLeft:
        handler(ResizeDirection.FromTop);
        handler(ResizeDirection.FromLeft);
        break;
      case ResizeDirection.FromTopRight:
        handler(ResizeDirection.FromTop);
        handler(ResizeDirection.FromRight);
        break;
      case ResizeDirection.FromBottomRight:
        handler(ResizeDirection.FromBottom);
        handler(ResizeDirection.FromRight);
        break;
      case ResizeDirection.FromBottomLeft:
        handler(ResizeDirection.FromBottom);
        handler(ResizeDirection.FromLeft);
        break;
      default:
        handler(rszDir);
        break;
    }
}

export default function ResizablePanel(props: ResizablePanelOpts) {
  const panelRef = React.createRef<HTMLDivElement>();
  
  const resizableFromLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRightRef = React.createRef<HTMLDivElement>();
  const resizableFromRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomLeftRef = React.createRef<HTMLDivElement>();

  const resizeDirection = React.useRef<ResizeDirection | null>(null);
  const onResizeHandler = React.useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);

  const draggableBorderSizeClassName = getDraggableBorderSizeClassName(
    props.draggableBorderSize
  );

  const draggableBorderOpacityClassName = getDraggableBorderOpacityClassName(
    props.draggableBorderOpacity
  );

  React.useEffect(() => {
    if (panelRef.current) {
      props.panelElAvailable(panelRef.current);
    }

    const resizableFromLeftEl = resizableFromLeftRef.current;
    const resizableFromTopLeftEl = resizableFromTopLeftRef.current;
    const resizableFromTopEl = resizableFromTopRef.current;
    const resizableFromTopRightEl = resizableFromTopRightRef.current;
    const resizableFromRightEl = resizableFromRightRef.current;
    const resizableFromBottomRightEl = resizableFromBottomRightRef.current;
    const resizableFromBottomEl = resizableFromBottomRef.current;
    const resizableFromBottomLeftEl = resizableFromBottomLeftRef.current;

    const removeResizeHandlerOnMouseUpIfReq = (e: MouseEvent | TouchEvent | null | undefined = null) => {
      removeResizeHandlerIfReq(e, true);
    }

    const removeResizeHandlerOnMouseOutIfReq = (e: MouseEvent | TouchEvent | null | undefined = null) => {
      removeResizeHandlerIfReq(e, null);
    }

    const removeResizeHandlerIfReq = (e: MouseEvent | TouchEvent | null | undefined, remove: boolean | null) => {
      const handler = onResizeHandler.current;
      const parentEl = props.parentRef.current!;
      // console.log("e.target", e?.target);
      
      if (handler && (!e || remove || e.target === parentEl)){
        // console.log("removeResizeHandler");

        parentEl.removeEventListener("mouseup", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.removeEventListener("touchend", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.removeEventListener("mouseleave", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.removeEventListener("touchcancel", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.removeEventListener("mousemove", handler, {
          capture: true
        });

        parentEl.removeEventListener("touchmove", handler, {
          capture: true
        });

        onResizeHandler.current = null;
        
        const rszDir = resizeDirection.current!;
        resizeDirection.current = null;

        if (props.resizeEnded) {
          props.resizeEnded(e ?? null, e ? getTouchOrMousePosition(e) : null, rszDir);
        }
      }
    }

    const draggableFromLeftMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromLeft);
    }

    const draggableFromTopLeftMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromTopLeft);
    }

    const draggableFromTopMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromTop);
    }

    const draggableFromTopRightMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromTopRight);
    }

    const draggableFromRightMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromRight);
    }

    const draggableFromBottomRightMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromBottomRight);
    }

    const draggableFromBottomMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromBottom);
    }

    const draggableFromBottomLeftMouseDown = (e: MouseEvent | TouchEvent) => {
      return addResizeHandlerIfReq(e, ResizeDirection.FromBottomLeft);
    }

    const addResizeHandlerIfReq = (e: MouseEvent | TouchEvent, rszDir: ResizeDirection) => {
      resizeDirection.current = rszDir;

      if (props.resizeStarted) {
        props.resizeStarted(e, getTouchOrMousePosition(e), rszDir);
      }

      if (!onResizeHandler.current) {
        const handler: (e: MouseEvent | TouchEvent) => void = (e: MouseEvent | TouchEvent) => {
          // console.log("rszDir", rszDir, e);

          props.resizing(e, getTouchOrMousePosition(e), rszDir);
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        onResizeHandler.current = handler;
        const parentEl = props.parentRef.current!;

        parentEl.addEventListener("mouseup", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.addEventListener("touchend", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.addEventListener("mouseleave", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.addEventListener("touchcancel", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.addEventListener("mousemove", handler, {
          capture: true
        });

        parentEl.addEventListener("touchmove", handler, {
          capture: true
        });
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const resizableHandlersMap: Kvp<HTMLDivElement | null, (e: MouseEvent | TouchEvent) => void>[] = [
      {
        key: resizableFromLeftEl,
        value: draggableFromLeftMouseDown
      },
      {
        key: resizableFromTopLeftEl,
        value: draggableFromTopLeftMouseDown
      },
      {
        key: resizableFromTopEl,
        value: draggableFromTopMouseDown
      },
      {
        key: resizableFromTopRightEl,
        value: draggableFromTopRightMouseDown
      },
      {
        key: resizableFromRightEl,
        value: draggableFromRightMouseDown
      },
      {
        key: resizableFromBottomRightEl,
        value: draggableFromBottomRightMouseDown
      },
      {
        key: resizableFromBottomEl,
        value: draggableFromBottomMouseDown
      },
      {
        key: resizableFromBottomLeftEl,
        value: draggableFromBottomLeftMouseDown
      }];

    for (let kvp of resizableHandlersMap) {
      if (kvp.key) {
        kvp.key.addEventListener("mousedown", kvp.value);
        kvp.key.addEventListener("touchstart", kvp.value);
      }
    }

    return () => {
      removeResizeHandlerIfReq(null, null);

      for (let kvp of resizableHandlersMap) {
        if (kvp.key) {
          kvp.key.removeEventListener("mousedown", kvp.value);
          kvp.key.removeEventListener("touchstart", kvp.value);
        }
      }
    };
  }, [ props.lastRefreshTmStmp, props.draggableBorderSize, props.resizableFromTop, props.resizableFromBottom, props.resizableFromLeft, props.resizableFromRight ]);

  return (<div className={["trmrk-resizable-panel",
    draggableBorderSizeClassName,
    draggableBorderOpacityClassName,
    props.className ?? "",
    props.resizableFromTop ? "trmrk-resizable-from-top" : "",
    props.resizableFromBottom ? "trmrk-resizable-from-bottom" : "",
    props.resizableFromLeft ? "trmrk-resizable-from-left" : "",
    props.resizableFromRight ? "trmrk-resizable-from-right" : ""].join(" ")} ref={panelRef}>
      <div className="trmrk-resizable-content">
        {props.children}
      </div>

      { (props.resizableFromTop && props.resizableFromLeft) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-top-left" ref={resizableFromTopLeftRef}></div> : null }
      { (props.resizableFromTop && props.resizableFromRight) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-top-right" ref={resizableFromTopRightRef}></div> : null }
      { (props.resizableFromBottom && props.resizableFromRight) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-bottom-right" ref={resizableFromBottomRightRef}></div> : null }
      { (props.resizableFromBottom && props.resizableFromLeft) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-bottom-left" ref={resizableFromBottomLeftRef}></div> : null }
        
      { props.resizableFromLeft ? <div className="trmrk-draggable-margin trmrk-draggable-from-left" ref={resizableFromLeftRef}></div> : null }
      { props.resizableFromTop ? <div className="trmrk-draggable-margin trmrk-draggable-from-top" ref={resizableFromTopRef}></div> : null }
      { props.resizableFromRight ? <div className="trmrk-draggable-margin trmrk-draggable-from-right" ref={resizableFromRightRef}></div> : null }
      { props.resizableFromBottom ? <div className="trmrk-draggable-margin trmrk-draggable-from-bottom" ref={resizableFromBottomRef}></div> : null }

    </div>);
}
