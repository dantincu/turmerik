import React, { useRef } from "react";
import { useSelector } from 'react-redux'

import Box from "@mui/material/Box";

import PagePanel from "../panel/PagePanel";
import { AppData } from "../../services/appData";
import { updateResizablePanelOffset } from "../../services/resizablePanelOffsetUpdater";

export default function PageContainer({
    children,
    leftPanelComponent,
    leftPanelWidth,
    onResized,
    className,
  }: {
    children: React.ReactNode,
    leftPanelComponent: () => React.ReactNode,
    leftPanelWidth: string,
    onResized: (width: number) => void,
    className?: string | null | undefined,
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);

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

  const resized = (width: number) => {
    if (onResized) {
      onResized(width);
    }
  }

  return (<Box className={[ "trmrk-app-page", className ?? null ].join(" ")}>
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
