import React from "react";

import "./ResizablePanel.scss";

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
  panelRef: React.RefObject<HTMLDivElement>,
  className?: string | null | undefined;
  draggableBorderSize?: ResizablePanelBorderSize | null | undefined;
  draggableBorderOpacity?: ResizablePanelBorderOpacity | null | undefined;
  resizableFromTop?: boolean | null | undefined;
  resizableFromBottom?: boolean | null | undefined;
  resizableFromLeft?: boolean | null | undefined;
  resizableFromRight?: boolean | null | undefined;
  resizeStarted?: ((e: MouseEvent, rszDir: ResizeDirection) => void) | null | undefined;
  resizing: (e: MouseEvent, mouseMovement: MouseMovement, rszDir: ResizeDirection) => void;
  resizeEnded?: ((e: MouseEvent | null, rszDir: ResizeDirection) => void) | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
  lastRefreshTmStmp?: Date | number | null | undefined
}

export interface MouseMovement {
  movementX: number;
  movementY: number;
}

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

export default function ResizablePanel(props: ResizablePanelOpts) {
  const resizableFromLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRightRef = React.createRef<HTMLDivElement>();
  const resizableFromRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomLeftRef = React.createRef<HTMLDivElement>();

  const resizeDirection = React.useRef<ResizeDirection | null>(null);
  const onResizeHandler = React.useRef<((e: MouseEvent) => void) | null>(null);

  const draggableBorderSizeClassName = getDraggableBorderSizeClassName(
    props.draggableBorderSize
  );

  const draggableBorderOpacityClassName = getDraggableBorderOpacityClassName(
    props.draggableBorderOpacity
  );

  React.useEffect(() => {
    const resizableFromLeftEl = resizableFromLeftRef.current;
    const resizableFromTopLeftEl = resizableFromTopLeftRef.current;
    const resizableFromTopEl = resizableFromTopRef.current;
    const resizableFromTopRightEl = resizableFromTopRightRef.current;
    const resizableFromRightEl = resizableFromRightRef.current;
    const resizableFromBottomRightEl = resizableFromBottomRightRef.current;
    const resizableFromBottomEl = resizableFromBottomRef.current;
    const resizableFromBottomLeftEl = resizableFromBottomLeftRef.current;

    const removeResizeHandlerOnMouseUpIfReq = (e: MouseEvent | null | undefined = null) => {
      removeResizeHandlerIfReq(e, true);
    }

    const removeResizeHandlerOnMouseOutIfReq = (e: MouseEvent | null | undefined = null) => {
      removeResizeHandlerIfReq(e, null);
    }

    const removeResizeHandlerIfReq = (e: MouseEvent | null | undefined, remove: boolean | null) => {
      const handler = onResizeHandler.current;
      const parentEl = props.parentRef.current!;
      // console.log("e.target", e?.target);
      
      if (handler && (!e || remove || e.target === parentEl)){
        // console.log("removeResizeHandler");

        parentEl.removeEventListener("mouseup", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.removeEventListener("mouseleave", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.removeEventListener("mousemove", handler, {
          capture: true
        });

        onResizeHandler.current = null;
        
        const rszDir = resizeDirection.current!;
        resizeDirection.current = null;

        if (props.resizeEnded) {
          props.resizeEnded(e ?? null, rszDir);
        }
      }
    }

    const draggableFromLeftMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromLeft);
    }

    const draggableFromTopLeftMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromTopLeft);
    }

    const draggableFromTopMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromTop);
    }

    const draggableFromTopRightMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromTopRight);
    }

    const draggableFromRightMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromRight);
    }

    const draggableFromBottomRightMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromBottomRight);
    }

    const draggableFromBottomMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromBottom);
    }

    const draggableFromBottomLeftMouseDown = (e: MouseEvent) => {
      addResizeHandlerIfReq(e, ResizeDirection.FromBottomLeft);
    }

    const addResizeHandlerIfReq = (e: MouseEvent, rszDir: ResizeDirection) => {
      resizeDirection.current = rszDir;

      if (props.resizeStarted) {
        props.resizeStarted(e, rszDir);
      }

      if (!onResizeHandler.current) {
        const handler: (e: MouseEvent) => void = (e: MouseEvent) => {
          // console.log("rszDir", rszDir, e);

          props.resizing(e, {
            movementX: e.movementX,
            movementY: e.movementY
          }, rszDir);
        }

        onResizeHandler.current = handler;
        const parentEl = props.parentRef.current!;

        parentEl.addEventListener("mouseleave", removeResizeHandlerOnMouseOutIfReq, {
          capture: true
        });

        parentEl.addEventListener("mouseup", removeResizeHandlerOnMouseUpIfReq, {
          capture: true
        });

        parentEl.addEventListener("mousemove", handler, {
          capture: true
        });
      }
    }

    if (resizableFromLeftEl) {
      resizableFromLeftEl.addEventListener("mousedown", draggableFromLeftMouseDown);
    }

    if (resizableFromTopLeftEl) {
      resizableFromTopLeftEl.addEventListener("mousedown", draggableFromTopLeftMouseDown);
    }

    if (resizableFromTopEl) {
      resizableFromTopEl.addEventListener("mousedown", draggableFromTopMouseDown);
    }

    if (resizableFromTopRightEl) {
      resizableFromTopRightEl.addEventListener("mousedown", draggableFromTopRightMouseDown);
    }

    if (resizableFromRightEl) {
      resizableFromRightEl.addEventListener("mousedown", draggableFromRightMouseDown);
    }

    if (resizableFromBottomRightEl) {
      resizableFromBottomRightEl.addEventListener("mousedown", draggableFromBottomRightMouseDown);
    }

    if (resizableFromBottomEl) {
      resizableFromBottomEl.addEventListener("mousedown", draggableFromBottomMouseDown);
    }

    if (resizableFromBottomLeftEl) {
      resizableFromBottomLeftEl.addEventListener("mousedown", draggableFromBottomLeftMouseDown);
    }

    return () => {
      removeResizeHandlerIfReq(null, null);

      if (resizableFromLeftEl) {
        resizableFromLeftEl.removeEventListener("mousedown", draggableFromLeftMouseDown);
      }

      if (resizableFromTopLeftEl) {
        resizableFromTopLeftEl.removeEventListener("mousedown", draggableFromTopLeftMouseDown);
      }

      if (resizableFromTopEl) {
        resizableFromTopEl.removeEventListener("mousedown", draggableFromTopMouseDown);
      }

      if (resizableFromTopRightEl) {
        resizableFromTopRightEl.removeEventListener("mousedown", draggableFromTopRightMouseDown);
      }

      if (resizableFromRightEl) {
        resizableFromRightEl.removeEventListener("mousedown", draggableFromRightMouseDown);
      }

      if (resizableFromBottomRightEl) {
        resizableFromBottomRightEl.removeEventListener("mousedown", draggableFromBottomRightMouseDown);
      }

      if (resizableFromBottomEl) {
        resizableFromBottomEl.removeEventListener("mousedown", draggableFromBottomMouseDown);
      }

      if (resizableFromBottomLeftEl) {
        resizableFromBottomLeftEl.removeEventListener("mousedown", draggableFromBottomLeftMouseDown);
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
    props.resizableFromRight ? "trmrk-resizable-from-right" : ""].join(" ")} ref={props.panelRef}>
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
