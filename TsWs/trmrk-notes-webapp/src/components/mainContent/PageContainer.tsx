import React, { useEffect, useRef } from "react";
import { useSelector } from 'react-redux'

import Box from "@mui/material/Box";

import PagePanel from "../panel/PagePanel";
import { AppData } from "../../services/appData";
import { updateResizablePanelOffset, RESIZABLE_BORDER_SIZE } from "../../services/htmlDoc/resizablePanelOffsetUpdater";
import { localStorageKeys } from "../../services/utils";
import { getIsCompactMode } from "../../store/appDataSlice";

export default function PageContainer({
    children,
    leftPanelComponent,
    leftPanelWidth,
    onResized,
    className,
    saveLeftPanelWidthToLocalStorage,
    setRefEl,
    useCompactMode
  }: {
    children: React.ReactNode,
    leftPanelComponent: () => React.ReactNode,
    leftPanelWidth?: string | null | undefined,
    onResized?: ((width: number) => void) | null | undefined,
    className?: string | null | undefined,
    saveLeftPanelWidthToLocalStorage?: ((mainEl: HTMLDivElement, mainPanelWidth: number) => void) | null | undefined,
    setRefEl: (el: HTMLDivElement) => void,
    useCompactMode?: boolean | null | undefined
  }) {
  const isCompactMode = useSelector(getIsCompactMode);
  leftPanelWidth ??= localStorage.getItem(localStorageKeys.pgContnrLeftPnlDfWidth) ?? "25%";
  useCompactMode ??= isCompactMode;

  saveLeftPanelWidthToLocalStorage ??= (mainEl: HTMLDivElement, mainPanelWidth: number) =>
  {
      const totalWidth = parseInt(getComputedStyle(mainEl, "").width);
      const percentage = Math.round(100 * (totalWidth - mainPanelWidth) / totalWidth);
      const cssPropVal = percentage + "%";

      localStorage.setItem(localStorageKeys.pgContnrLeftPnlDfWidth, cssPropVal);
  };

  const mainElRef = useRef<HTMLDivElement | null>(null);
  const leftPanelElRef = useRef<HTMLDivElement | null>(null);
  const rightPanelElRef = useRef<HTMLDivElement | null>(null);

  const onSetLeftPanelEl = (refEl: HTMLDivElement) => {
    leftPanelElRef.current = refEl;
  }

  const onSetRightPanelEl = (refEl: HTMLDivElement) => {
    rightPanelElRef.current = refEl;
  }

  const onResize = (dx: number) => {
    updateResizablePanelOffset(
      leftPanelElRef.current,
      rightPanelElRef.current,
      dx,
      null
    );
  };

  const resized = (mainPanelWidth: number) => {
    const mainEl = mainElRef.current;

    if (mainEl) {
      saveLeftPanelWidthToLocalStorage!(mainEl, mainPanelWidth);
    }

    if (onResized) {
      onResized(mainPanelWidth);
    }
  }

  useEffect(() => {
    setRefEl(mainElRef.current!);
  }, [ mainElRef.current ] );

  return (<Box className={[ "trmrk-app-page", className ?? null ].join(" ")} ref={mainElRef}>
    { useCompactMode ? null : <PagePanel
          leftIsResizable={false} isScrollable={true}
          setPanelEl={onSetLeftPanelEl}
          style={{ width: leftPanelWidth, left: "0px" }}>
        { leftPanelComponent() }
      </PagePanel> }
    { useCompactMode ? children : (
      <PagePanel
          leftIsResizable={true} isScrollable={true}
          setPanelEl={onSetRightPanelEl}
          onResize={onResize} onResized={resized}
          style={{ right: "0px", left: leftPanelWidth }}>
        { children }
      </PagePanel>) }
  </Box>);
};
