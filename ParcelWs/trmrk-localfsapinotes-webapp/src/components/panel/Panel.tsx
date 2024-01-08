import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

import { RESIZABLE_BORDER_SIZE } from "../../services/resizablePanelOffsetUpdater";

export default function Panel({
    children,
    isScrollable,
    leftIsResizable,
    className,
    style,
    onResize,
    setPanelEl: setPanelEl
  }: {
    children: React.ReactNode,
    isScrollable: boolean,
    leftIsResizable: boolean,
    className?: string | null | undefined
    style?: SxProps<Theme> | null | undefined,
    onResize?: ((dx: number) => void) | null | undefined,
    setPanelEl?: ((el: HTMLDivElement) => void) | null | undefined
  }) {
    const panelElRef = useRef<HTMLDivElement>();
    
    const mousePos = useRef<number>();

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
      document.removeEventListener("mousemove", resize, false);
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

    return (<Box className={[
          isScrollable ? "trmrk-scrollable" : null, className ?? null,
          leftIsResizable ? "trmrk-left-resizable" : null, className ?? null ].join(" ")} sx={style ?? {}} ref={panelElRef}>
        { children }
      </Box>);
}
