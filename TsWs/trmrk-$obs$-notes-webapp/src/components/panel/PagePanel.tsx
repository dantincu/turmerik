import React, { useRef } from "react";

import { SxProps, Theme } from "@mui/material";

import trmrk from "trmrk";

import Panel from "../../components/panel/Panel";

export default function PagePanel({
    children,
    isScrollable,
    leftIsResizable,
    className,
    style,
    onResize,
    setPanelEl,
    onResized
  }: {
    children: React.ReactNode,
    isScrollable: boolean,
    leftIsResizable: boolean,
    className?: string | null | undefined
    style?: SxProps<Theme> | null | undefined,
    onResize?: ((dx: number) => void) | null | undefined,
    setPanelEl?: ((el: HTMLDivElement) => void) | null | undefined,
    onResized?: (width: number) => void
  }) {
  const dfStyle = {
    top: "0px",
    bottom: "0px"
  }

  const refEl = useRef<HTMLDivElement>();

  const onSetPanel = (el: HTMLDivElement) => {
    refEl.current = el;

    if (setPanelEl) {
      setPanelEl(el);
    }
  }

  const onMouseUp = () => {
    const el = refEl.current;

    if (el && onResized) {
      onResized(parseInt(getComputedStyle(el, "").width));
    }
  }

  style ??= {};
  style = trmrk.merge(style, [ dfStyle ]);

  return (<Panel onResize={onResize} setPanelEl={onSetPanel} onResized={onMouseUp}
        isScrollable={isScrollable}
        leftIsResizable={leftIsResizable}
        className={["trmrk-page-panel", className ?? null].join(" ")}
        style={style}>
      { children }
    </Panel>);
}
