import React from "react";
import { useDispatch } from "react-redux";

import Button  from "@mui/material/Button";
import Paper  from "@mui/material/Paper";

import trmrk from "trmrk";

import ResizablePanel, { 
  ResizablePanelBorderSize,
  ResizablePanelBorderOpacity,
  TouchOrMousePosition,
  ResizeDirection,
  normalizeOrtoResizeHandler,
  combineOrtoResizeHandlers,
  ResizeHandlersMap,
  getTouchOrMousePosition } from "trmrk-react/src/components/resizablePanel/ResizablePanel";

import { appDataReducers } from "../../store/appDataSlice";

export interface ResizablesDemoProps {
  urlPath: string;
  refreshBtnRef: React.RefObject<HTMLButtonElement>
}

export default function ResizablesDemo(
  props: ResizablesDemoProps) {
  const dispatch = useDispatch();
  const [ lastRefreshTmStmp, setLastRefreshTmStmp ] = React.useState(new Date());

  const parentRef = React.createRef<HTMLDivElement>();
  const topPanelRef = React.useRef<HTMLDivElement | null>(null);
  const bottomPanelRef = React.useRef<HTMLDivElement | null>(null);

  const topPanelX = React.useRef(0);
  const topPanelY = React.useRef(0);
  
  const topPanelW = React.useRef(0);
  const topPanelH = React.useRef(0);

  const bottomPanelX = React.useRef(0);
  const bottomPanelY = React.useRef(0);

  const bottomPanelW = React.useRef(0);
  const bottomPanelH = React.useRef(0);

  const prevTouchOrMousePos = React.useRef<TouchOrMousePosition>({
    screenX: 0,
    screenY: 0,
    touch: null
  });

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
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
    // console.log("lastRefreshTmStmp", lastRefreshTmStmp);
  }, [ lastRefreshTmStmp, parentRef, topPanelRef, bottomPanelRef, prevTouchOrMousePos ]);

  const topPanelResizeStarted = (e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => {
    prevTouchOrMousePos.current = getTouchOrMousePosition(e);
    const topPanelEl = topPanelRef.current!;
    updatePanelX(topPanelEl, topPanelX, topPanelEl.offsetLeft);
    updatePanelY(topPanelEl, topPanelY, topPanelEl.offsetTop);
    updatePanelW(topPanelEl, topPanelW, topPanelEl.clientWidth);
    updatePanelH(topPanelEl, topPanelH, topPanelEl.clientHeight);
    topPanelEl.style.marginTop = "0px";
    topPanelEl.style.marginLeft = "0px";
    // console.log("top panel resize started", topPanelEl.offsetLeft, topPanelEl.offsetTop, new Date());
  }

  const topPanelResizeEnded = (e: MouseEvent | TouchEvent | null, touchOrMousePos: TouchOrMousePosition | null, rszDir: ResizeDirection) => {
    prevTouchOrMousePos.current = {
      screenX: 0,
      screenY: 0,
      touch: null
    };
    // console.log("top panel resize ended", new Date());
  }

  const bottomPanelResizeStarted = (e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => {
    prevTouchOrMousePos.current = getTouchOrMousePosition(e);
    const bottomPanelEl = bottomPanelRef.current!;
    updatePanelX(bottomPanelEl, bottomPanelX, bottomPanelEl.offsetLeft);
    updatePanelY(bottomPanelEl, bottomPanelY, bottomPanelEl.offsetTop);
    updatePanelW(bottomPanelEl, bottomPanelW, bottomPanelEl.clientWidth);
    updatePanelH(bottomPanelEl, bottomPanelH, bottomPanelEl.clientHeight);
    bottomPanelEl.style.marginTop = "0px";
    bottomPanelEl.style.marginLeft = "0px";
    // console.log("bottom panel resize started", bottomPanelEl, bottomPanelEl.offsetTop, new Date());
  }

  const bottomPanelResizeEnded = (e: MouseEvent | TouchEvent | null, touchOrMousePos: TouchOrMousePosition | null, rszDir: ResizeDirection) => {
    prevTouchOrMousePos.current = {
      screenX: 0,
      screenY: 0,
      touch: null
    };
    // console.log("bottom panel resize ended", new Date());
  }

  const panelResizing = (
    e: MouseEvent,
    touchOrMousePos: TouchOrMousePosition,
    rszDir: ResizeDirection,
    panelRef: React.MutableRefObject<HTMLDivElement | null>,
    panelX: React.MutableRefObject<number>,
    panelY: React.MutableRefObject<number>,
    panelW: React.MutableRefObject<number>,
    panelH: React.MutableRefObject<number>) => normalizeOrtoResizeHandler(
      (e, touchOrMousePos, rszDir) => {
        switch (rszDir) {
          case ResizeDirection.FromLeft:
            updatePanelX(panelRef.current!, panelX, panelX.current + (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
            updatePanelW(panelRef.current!, panelW, panelW.current - (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
            break;
          case ResizeDirection.FromTop:
            updatePanelY(panelRef.current!, panelY, panelY.current + (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
            updatePanelH(panelRef.current!, panelH, panelH.current - (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
            break;
          case ResizeDirection.FromRight:
            updatePanelW(panelRef.current!, panelW, panelW.current + (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
            break;
          case ResizeDirection.FromBottom:
            updatePanelH(panelRef.current!, panelH, panelH.current + (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
            break;
          default:
            throw new Error(`Invalid resize direction: ${rszDir}`);
        }
    })(e, touchOrMousePos, rszDir);

  const panelResizing1 = (
    e: MouseEvent | TouchEvent,
    touchOrMousePos: TouchOrMousePosition,
    rszDir: ResizeDirection,
    panelRef: React.RefObject<HTMLDivElement>,
    panelX: React.MutableRefObject<number>,
    panelY: React.MutableRefObject<number>,
    panelW: React.MutableRefObject<number>,
    panelH: React.MutableRefObject<number>) => combineOrtoResizeHandlers(
      trmrk.actWithVal({} as ResizeHandlersMap, (handlersMap: ResizeHandlersMap) => {
        handlersMap[ResizeDirection.FromLeft] = (e, touchOrMousePos, rszDir) => {
          updatePanelX(panelRef.current!, panelX, panelX.current + (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
          updatePanelW(panelRef.current!, panelW, panelW.current - (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
        }

        handlersMap[ResizeDirection.FromTop] = (e, touchOrMousePos, rszDir) => {
          updatePanelY(panelRef.current!, panelY, panelY.current + (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
          updatePanelH(panelRef.current!, panelH, panelH.current - (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
        }

        handlersMap[ResizeDirection.FromRight] = (e, touchOrMousePos, rszDir) => {
          updatePanelW(panelRef.current!, panelW, panelW.current + (touchOrMousePos.screenX - prevTouchOrMousePos.current.screenX));
        }

        handlersMap[ResizeDirection.FromBottom] = (e, touchOrMousePos, rszDir) => {
          updatePanelH(panelRef.current!, panelH, panelH.current + (touchOrMousePos.screenY - prevTouchOrMousePos.current.screenY));
        }
      }))(e, touchOrMousePos, rszDir);

  const topPanelResizing = (e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => {
    panelResizing(e, touchOrMousePos, rszDir, topPanelRef, topPanelX, topPanelY, topPanelW, topPanelH);
    prevTouchOrMousePos.current = getTouchOrMousePosition(e);
  }

  const bottomPanelResizing = (e: MouseEvent | TouchEvent, touchOrMousePos: TouchOrMousePosition, rszDir: ResizeDirection) => {
    panelResizing1(e, touchOrMousePos, rszDir, bottomPanelRef, bottomPanelX, bottomPanelY, bottomPanelW, bottomPanelH);
    prevTouchOrMousePos.current = getTouchOrMousePosition(e);
  }

  const topPanelElAvailable = (topPanelEl: HTMLDivElement) => {
    topPanelRef.current = topPanelEl;
  }

  const bottomPanelElAvailable = (bottomPanelEl: HTMLDivElement) => {
    bottomPanelRef.current = bottomPanelEl;
  }

  return (
    <Paper className="trmrk-app-main-content" ref={parentRef}>
      <Button sx={{ position: "fixed" }} onClick={handleRefreshClick} ref={props.refreshBtnRef}>Refresh</Button>

      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

      <ResizablePanel
        resizableFromTop={true}
        resizableFromBottom={true}
        resizableFromRight={true}
        resizableFromLeft={true}
        parentRef={domBodyEl}
        panelElAvailable={topPanelElAvailable}
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
        panelElAvailable={bottomPanelElAvailable}
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
