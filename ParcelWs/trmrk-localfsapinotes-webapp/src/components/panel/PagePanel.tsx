import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

import { core as trmrk } from "trmrk";

import { AppPage, AppTabsData, AppData } from "../../services/appData";
import Panel from "../../components/panel/Panel";

export default function PagePanel({
    children,
    isScrollable,
    leftIsResizable,
    className,
    style,
    onResize,
    setPanelEl: setPanelEl
  }: {
    children: React.ReactNode,
    isScrollable?: boolean | null | undefined,
    leftIsResizable?: boolean | null | undefined,
    className?: string | null | undefined
    style?: SxProps<Theme> | null | undefined,
    onResize?: ((dx: number) => void) | null | undefined,
    setPanelEl?: ((el: HTMLDivElement) => void) | null | undefined
  }) {
  const dfStyle = {
    top: "0px",
    bottom: "0px"
  }

  const appData = useSelector((state: { appData: AppData }) => state.appData);
  style ??= {};
  style = trmrk.merge(style, [ dfStyle ]);

  return (<Panel onResize={onResize} setPanelEl={setPanelEl}
        isScrollable={isScrollable ?? !appData.isCompactMode}
        leftIsResizable={leftIsResizable ?? !appData.isCompactMode}
        className={["trmrk-page-panel", className ?? null].join(" ")}
        style={style}>
      { children }
    </Panel>);
}
