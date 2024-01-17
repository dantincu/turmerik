import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

import { RESIZABLE_BORDER_SIZE } from "../../services/htmlDoc/resizablePanelOffsetUpdater";

export default function Panel({
    children,
    isScrollable,
    leftIsResizable,
    className,
    style,
    onResize,
    setPanelEl: setPanelEl,
    onResized,
  }: {
    children: React.ReactNode,
    isScrollable: boolean,
    leftIsResizable: boolean,
    className?: string | null | undefined
    style?: SxProps<Theme> | null | undefined,
    onResize?: ((dx: number) => void) | null | undefined,
    setPanelEl?: ((el: HTMLDivElement) => void) | null | undefined,
    onResized: () => void,
  }) {
    const panelElRef = useRef<HTMLDivElement>();
    const mousePos = useRef<number | null>(null);

    const resize = (e: MouseEvent) => {
      const panelEl = panelElRef.current;
      const prevMousePosVal = mousePos.current;

      if (panelEl && typeof prevMousePosVal === "number") {
        const currentMousePosVal = e.x;
        const dx = currentMousePosVal - prevMousePosVal;
        mousePos.current = currentMousePosVal;

        if (onResize) {
          onResize(dx);
        }
      }
    }

    const mousedown = (e: MouseEvent) => {
      if (e.offsetX < RESIZABLE_BORDER_SIZE) {
        mousePos.current = e.x;
        document.addEventListener("mousemove", resize, false);
      }
    }

    const mouseup = (e: MouseEvent) => {
      if (mousePos.current ?? false) {
        mousePos.current = null;
        document.removeEventListener("mousemove", resize, false);

        if (onResized) {
          onResized();
        }
      }
    }

    useEffect(() => {
      if (setPanelEl) {
        setPanelEl(panelElRef.current!);
      }
      
      const panelEl = panelElRef.current;
      
      if (panelEl && leftIsResizable) {
        panelElRef.current?.addEventListener("mousedown", mousedown, false);
        document.addEventListener("mouseup", mouseup, false);
        
        return () => {
          panelElRef.current?.removeEventListener("mousedown", mousedown, false);
          document.removeEventListener("mouseup", mouseup, false);
        };
      }
      
    }, [ leftIsResizable, panelElRef, mousePos ]);

    style ??= {};
    className ??= null;

    const classNamesArr = [
      isScrollable ? "trmrk-scrollable" : null,
      leftIsResizable ? "trmrk-left-resizable" : null,
      className
    ]; 

    const classNamesStr = classNamesArr.join(" ");

    if (leftIsResizable) {
      return (<Box className={classNamesStr} sx={style} ref={panelElRef}>
        <Box className="trmrk-left-resizable-content">{ children }</Box>
      </Box>);
    } else {
      return (<Box className={classNamesStr} sx={style} ref={panelElRef}>
        { children }
      </Box>);
    }
}
