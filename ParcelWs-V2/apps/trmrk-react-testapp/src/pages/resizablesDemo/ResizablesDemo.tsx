import React from "react";

import Button  from "@mui/material/Button";
import Paper  from "@mui/material/Paper";

import trmrk from "trmrk";

import ResizablePanel, { 
  ResizablePanelBorderSize,
  ResizablePanelBorderOpacity,
  MouseMovement,
  ResizeDirection,
  normalizeOrtoResizeHandler,
  combineOrtoResizeHandlers,
  ResizeHandlersMap } from "trmrk-react/src/components/resizablePanel/ResizablePanel";

export default function ResizablesDemo() {
  const [ lastRefreshTmStmp, setLastRefreshTmStmp ] = React.useState(new Date());

  const parentRef = React.createRef<HTMLDivElement>();
  const topPanelRef = React.createRef<HTMLDivElement>();
  const bottomPanelRef = React.createRef<HTMLDivElement>();

  const topPanelX = React.useRef(0);
  const topPanelY = React.useRef(0);
  
  const topPanelW = React.useRef(0);
  const topPanelH = React.useRef(0);

  const bottomPanelX = React.useRef(0);
  const bottomPanelY = React.useRef(0);

  const bottomPanelW = React.useRef(0);
  const bottomPanelH = React.useRef(0);

  const updatePanelX = (
      panelEl: HTMLDivElement,
      panelX: React.MutableRefObject<number>,
      newValue: number) => {
    newValue = Math.max(0, newValue);
    panelX.current = newValue;
    panelEl.style.left = `${newValue}px`;
  }

  const updatePanelY = (
      panelEl: HTMLDivElement,
      panelY: React.MutableRefObject<number>,
      newValue: number) => {
    newValue = Math.max(0, newValue);
    panelY.current = newValue;
    panelEl.style.top = `${newValue}px`;
  }

  const updatePanelW = (
      panelEl: HTMLDivElement,
      panelW: React.MutableRefObject<number>,
      newValue: number) => {
    newValue = Math.max(0, newValue);
    panelW.current = newValue;
    panelEl.style.width = `${newValue}px`;
  }

  const updatePanelH = (
      panelEl: HTMLDivElement,
      panelH: React.MutableRefObject<number>,
      newValue: number) => {
    newValue = Math.max(0, newValue);
    panelH.current = newValue;
    panelEl.style.height = `${newValue}px`;
  }

  const domBodyEl = {
    current: document.body
  } as React.RefObject<HTMLElement>;

  const handleRefreshClick = () => {
    setLastRefreshTmStmp(new Date());
  }

  React.useEffect(() => {
    console.log("lastRefreshTmStmp", lastRefreshTmStmp);
  }, [ lastRefreshTmStmp, parentRef, topPanelRef, bottomPanelRef ]);

  const topPanelResizeStarted = (e: MouseEvent, rszDir: ResizeDirection) => {
    const topPanelEl = topPanelRef.current!;
    updatePanelX(topPanelEl, topPanelX, topPanelEl.offsetLeft);
    updatePanelY(topPanelEl, topPanelY, topPanelEl.offsetTop);
    updatePanelW(topPanelEl, topPanelW, topPanelEl.clientWidth);
    updatePanelH(topPanelEl, topPanelH, topPanelEl.clientHeight);
    topPanelEl.style.marginTop = "0px";
    topPanelEl.style.marginLeft = "0px";
    console.log("top panel resize started", topPanelEl.offsetLeft, topPanelEl.offsetTop, new Date());
  }

  const topPanelResizeEnded = (e: MouseEvent | null, rszDir: ResizeDirection) => {
    console.log("top panel resize ended", new Date());
  }

  const bottomPanelResizeStarted = (e: MouseEvent, rszDir: ResizeDirection) => {
    const bottomPanelEl = bottomPanelRef.current!;
    updatePanelX(bottomPanelEl, bottomPanelX, bottomPanelEl.offsetLeft);
    updatePanelY(bottomPanelEl, bottomPanelY, bottomPanelEl.offsetTop);
    updatePanelW(bottomPanelEl, bottomPanelW, bottomPanelEl.clientWidth);
    updatePanelH(bottomPanelEl, bottomPanelH, bottomPanelEl.clientHeight);
    bottomPanelEl.style.marginTop = "0px";
    bottomPanelEl.style.marginLeft = "0px";
    console.log("bottom panel resize started", bottomPanelEl, bottomPanelEl.offsetTop, new Date());
  }

  const bottomPanelResizeEnded = (e: MouseEvent | null, rszDir: ResizeDirection) => {
    console.log("bottom panel resize ended", new Date());
  }

  const panelResizing = (
    e: MouseEvent,
    mouseMovement: MouseMovement,
    rszDir: ResizeDirection,
    panelRef: React.RefObject<HTMLDivElement>,
    panelX: React.MutableRefObject<number>,
    panelY: React.MutableRefObject<number>,
    panelW: React.MutableRefObject<number>,
    panelH: React.MutableRefObject<number>) => normalizeOrtoResizeHandler(
      (e, mouseMovement, rszDir) => {
        switch (rszDir) {
          case ResizeDirection.FromLeft:
            updatePanelX(panelRef.current!, panelX, panelX.current + mouseMovement.movementX);
            updatePanelW(panelRef.current!, panelW, panelW.current - mouseMovement.movementX);
            break;
          case ResizeDirection.FromTop:
            updatePanelY(panelRef.current!, panelY, panelY.current + mouseMovement.movementY);
            updatePanelH(panelRef.current!, panelH, panelH.current - mouseMovement.movementY);
            break;
          case ResizeDirection.FromRight:
            updatePanelW(panelRef.current!, panelW, panelW.current + mouseMovement.movementX);
            break;
          case ResizeDirection.FromBottom:
            updatePanelH(panelRef.current!, panelH, panelH.current + mouseMovement.movementY);
            break;
          default:
            throw new Error(`Invalid resize direction: ${rszDir}`);
        }
    })(e, mouseMovement, rszDir);

  const panelResizing1 = (
    e: MouseEvent,
    mouseMovement: MouseMovement,
    rszDir: ResizeDirection,
    panelRef: React.RefObject<HTMLDivElement>,
    panelX: React.MutableRefObject<number>,
    panelY: React.MutableRefObject<number>,
    panelW: React.MutableRefObject<number>,
    panelH: React.MutableRefObject<number>) => combineOrtoResizeHandlers(
      trmrk.actWithVal({} as ResizeHandlersMap, (handlersMap: ResizeHandlersMap) => {
        handlersMap[ResizeDirection.FromLeft] = (e, mouseMovement, rszDir) => {
          updatePanelX(panelRef.current!, panelX, panelX.current + mouseMovement.movementX);
          updatePanelW(panelRef.current!, panelW, panelW.current - mouseMovement.movementX);
        }

        handlersMap[ResizeDirection.FromTop] = (e, mouseMovement, rszDir) => {
          updatePanelY(panelRef.current!, panelY, panelY.current + mouseMovement.movementY);
          updatePanelH(panelRef.current!, panelH, panelH.current - mouseMovement.movementY);
        }

        handlersMap[ResizeDirection.FromRight] = (e, mouseMovement, rszDir) => {
          updatePanelW(panelRef.current!, panelW, panelW.current + mouseMovement.movementX);
        }

        handlersMap[ResizeDirection.FromBottom] = (e, mouseMovement, rszDir) => {
          updatePanelH(panelRef.current!, panelH, panelH.current + mouseMovement.movementY);
        }
      }))(e, mouseMovement, rszDir);

  const topPanelResizing = (e: MouseEvent, mouseMovement: MouseMovement, rszDir: ResizeDirection) => {
    panelResizing(e, mouseMovement, rszDir, topPanelRef, topPanelX, topPanelY, topPanelW, topPanelH);
  }

  const bottomPanelResizing = (e: MouseEvent, mouseMovement: MouseMovement, rszDir: ResizeDirection) => {
    panelResizing1(e, mouseMovement, rszDir, bottomPanelRef, bottomPanelX, bottomPanelY, bottomPanelW, bottomPanelH);
  }

  return (
    <Paper className="trmrk-app-main-content" ref={parentRef}>
      <Button sx={{ position: "fixed" }} onClick={handleRefreshClick}>Refresh</Button>

      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

      <ResizablePanel
        resizableFromTop={true}
        resizableFromBottom={true}
        resizableFromRight={true}
        resizableFromLeft={true}
        parentRef={domBodyEl}
        panelRef={topPanelRef}
        className="my-resizable-panel"
        draggableBorderSize={ResizablePanelBorderSize.Regular}
        draggableBorderOpacity={ResizablePanelBorderOpacity.Opc50}
        resizeStarted={topPanelResizeStarted}
        resizeEnded={topPanelResizeEnded}
        resizing={topPanelResizing}>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </ResizablePanel>

      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

      <ResizablePanel
        resizableFromTop={true}
        resizableFromBottom={true}
        resizableFromRight={true}
        resizableFromLeft={true}
        parentRef={domBodyEl}
        panelRef={bottomPanelRef}
        className="my-resizable-panel1"
        draggableBorderSize={ResizablePanelBorderSize.Thick}
        draggableBorderOpacity={ResizablePanelBorderOpacity.Opc25}
        resizeStarted={bottomPanelResizeStarted}
        resizeEnded={bottomPanelResizeEnded}
        resizing={bottomPanelResizing}>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </ResizablePanel>

      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

    </Paper>);
}
