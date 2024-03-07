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
  className?: string | null | undefined;
  draggableBorderSize?: ResizablePanelBorderSize | null | undefined;
  draggableBorderOpacity?: ResizablePanelBorderOpacity | null | undefined;
  resizableFromTop?: boolean | null | undefined;
  resizableFromBottom?: boolean | null | undefined;
  resizableFromLeft?: boolean | null | undefined;
  resizableFromRight?: boolean | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
  lastRefreshTmStmp?: Date | number | null | undefined
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
  const parentRef = React.createRef<HTMLDivElement>();

  const resizableFromLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopLeftRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRef = React.createRef<HTMLDivElement>();
  const resizableFromTopRightRef = React.createRef<HTMLDivElement>();
  const resizableFromRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRightRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomRef = React.createRef<HTMLDivElement>();
  const resizableFromBottomLeftRef = React.createRef<HTMLDivElement>();

  const mousePosX = React.useRef(0);
  const mousePosY = React.useRef(0);

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

    const updateMousePos = (e: MouseEvent) => {
      mousePosX.current = e.clientX;
      mousePosY.current = e.clientY;
    }

    const removeResizeHandler = () => {
      console.log("removeResizeHandler");
      mousePosX.current = 0;
      mousePosY.current = 0;

      const parentEl = parentRef.current!;
      const handler = onResizeHandler.current;
      
      if (handler){
        parentEl.removeEventListener("mouseup", removeResizeHandler);
        parentEl.removeEventListener("mouseout", removeResizeHandler);
        parentEl.removeEventListener("mousemove", handler);
        onResizeHandler.current = null;
      }
    }

    const draggableFromLeftMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromLeft);
    }

    const draggableFromTopLeftMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromTopLeft);
    }

    const draggableFromTopMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromTop);
    }

    const draggableFromTopRightMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromTopRight);
    }

    const draggableFromRightMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromRight);
    }

    const draggableFromBottomRightMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromBottomRight);
    }

    const draggableFromBottomMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromBottom);
    }

    const draggableFromBottomLeftMouseDown = (e: MouseEvent) => {
      addResizeHandler(e, ResizeDirection.FromBottomLeft);
    }

    const addResizeHandler = (e: MouseEvent, rszDir: ResizeDirection) => {
      const handler: (e: MouseEvent) => void = (e: MouseEvent) => {
        console.log("rszDir", rszDir);
        switch (rszDir) {
          case ResizeDirection.FromLeft:
            const diffX = e.clientX - mousePosX.current;
            break;
          case ResizeDirection.FromTopLeft:
            
            break;
          case ResizeDirection.FromTop:
            
            break;
          case ResizeDirection.FromTopRight:
            
            break;
          case ResizeDirection.FromRight:
            
            break;
          case ResizeDirection.FromBottomRight:
            
            break;
          case ResizeDirection.FromBottom:
            
            break;
          case ResizeDirection.FromBottomLeft:
            
            break;
          default:
            throw new Error(`Invalid resize direction: ${rszDir}`);
        }
        
        updateMousePos(e);
      }

      onResizeHandler.current = handler;
      const parentEl = parentRef.current!;

      parentEl.addEventListener("mouseout", removeResizeHandler);
      parentEl.addEventListener("mouseup", removeResizeHandler);
      parentEl.addEventListener("mousemove", handler);
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
      removeResizeHandler();

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
    props.resizableFromRight ? "trmrk-resizable-from-right" : ""].join(" ")} ref={parentRef}>
      <div className="trmrk-resizable-content">
        {props.children}
      </div>

      { props.resizableFromLeft ? <div className="trmrk-draggable-margin trmrk-draggable-from-left" ref={resizableFromLeftRef}></div> : null }
      { props.resizableFromTop ? <div className="trmrk-draggable-margin trmrk-draggable-from-top" ref={resizableFromTopRef}></div> : null }
      { props.resizableFromRight ? <div className="trmrk-draggable-margin trmrk-draggable-from-right" ref={resizableFromRightRef}></div> : null }
      { props.resizableFromBottom ? <div className="trmrk-draggable-margin trmrk-draggable-from-bottom" ref={resizableFromBottomRef}></div> : null }

      { (props.resizableFromTop && props.resizableFromLeft) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-top-left" ref={resizableFromTopLeftRef}></div> : null }
      { (props.resizableFromTop && props.resizableFromRight) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-top-right" ref={resizableFromTopRightRef}></div> : null }
      { (props.resizableFromBottom && props.resizableFromRight) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-bottom-right" ref={resizableFromBottomRightRef}></div> : null }
      { (props.resizableFromBottom && props.resizableFromLeft) ? <div
        className="trmrk-draggable-corner trmrk-draggable-from-bottom-left" ref={resizableFromBottomLeftRef}></div> : null }
    </div>);
}
