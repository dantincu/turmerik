import React, { useRef } from "react";
import { useSelector } from 'react-redux'

import Box from "@mui/material/Box";

import PagePanel from "../panel/PagePanel";
import { AppData } from "../../services/appData";
import { updateResizablePanelOffset, RESIZABLE_BORDER_SIZE } from "../../services/htmlDoc/resizablePanelOffsetUpdater";
import { localStorageKeys } from "../../services/utils";

export default function PageContainer({
    children,
    leftPanelComponent,
    leftPanelWidth,
    onResized,
    className,
    saveLeftPanelWidthToLocalStorage
  }: {
    children: React.ReactNode,
    leftPanelComponent: () => React.ReactNode,
    leftPanelWidth?: string | null | undefined,
    onResized?: ((width: number) => void) | null | undefined,
    className?: string | null | undefined,
    saveLeftPanelWidthToLocalStorage?: ((mainEl: HTMLDivElement, mainPanelWidth: number) => void) | null | undefined;
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  leftPanelWidth ??= localStorage.getItem(localStorageKeys.pgContnrLeftPnlDfWidth) ?? "25%";

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

  return (<Box className={[ "trmrk-app-page", className ?? null ].join(" ")} ref={mainElRef}>
    { appData.isCompactMode ? null : <PagePanel
          leftIsResizable={false} isScrollable={true}
          setPanelEl={onSetLeftPanelEl}
          style={{ width: leftPanelWidth, left: "0px" }}>
        { leftPanelComponent() }
      </PagePanel> }
    { appData.isCompactMode ? children : (
      <PagePanel
          leftIsResizable={true} isScrollable={true}
          setPanelEl={onSetRightPanelEl}
          onResize={onResize} onResized={resized}
          style={{ right: "0px", left: leftPanelWidth }}>
        { children }
      </PagePanel>) }
  </Box>);
};