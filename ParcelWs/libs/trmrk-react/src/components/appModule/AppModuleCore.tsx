import React, { useEffect, useState, useRef, ErrorInfo } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { AppDataSliceOps } from "../../store/appDataSlice";

import AppBarCore from "../appBar/AppBarCore";
import AppMainContentCore from "./AppMainContentCore";
import ToggleAppBarButton from "../appBar/ToggleAppBarButton";

export interface FloatingBarTopOffset {
  headerIsHidden: boolean;
  appBarHeight: number;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

export default function AppModuleCore({
    appDataSliceOps,
    className,
    headerChildren,
    headerClassName,
    headerStyle,
    headerHeight,
    bodyChildren,
    bodyClassName,
    bodyStyle,
  }: {
    appDataSliceOps: AppDataSliceOps,
    className: string,
    headerChildren: React.ReactNode
    headerClassName: string,
    headerStyle?: Object | null | undefined,
    headerHeight?: string | null | undefined,
    bodyChildren: React.ReactNode,
    bodyClassName: string,
    bodyStyle?: Object | null | undefined,
  }) {
  const showAppBarValue = useSelector(appDataSliceOps.selectors.getShowAppBar);
  const showAppBarToggleBtnValue = useSelector(appDataSliceOps.selectors.getShowAppBarToggleBtn);

  const offsetRef = useRef<FloatingBarTopOffset>({
    headerIsHidden: false,
    appBarHeight: 0,
    lastBodyScrollTop: 0,
    lastHeaderTopOffset: 0
  });

  const appHeaderEl = useRef<HTMLDivElement>(null);
  const appBodyEl = useRef<HTMLDivElement>(null);

  const onUpdateFloatingBarTopOffset = () => {
    const appBarEl = appHeaderEl.current;
    const appMainEl = appBodyEl.current;
    const offset = { ...offsetRef.current };

    if (appBarEl && offset.appBarHeight === 0) {
      offset.appBarHeight = appBarEl.clientHeight;
    }
    
    if (appMainEl) {
      const bodyScrollTop = appMainEl.scrollTop;
      const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
      offset.lastBodyScrollTop = bodyScrollTop;

      if (appBarEl) {
        if ((bodyScrollTop ?? 0) >= 0) {
          // on iOs this property can be negative when dragging by the top of the page

          if (offset.headerIsHidden) {
            offset.headerIsHidden = false;
            offset.lastHeaderTopOffset = 0;
            appMainEl.style.top = offset.appBarHeight + "px";
          } else {
            offset.lastHeaderTopOffset = Math.max(
              -1 * offset.appBarHeight,
                Math.min(0, offset.lastHeaderTopOffset - bodyScrollTopDiff));

            appBarEl.style.top = offset.lastHeaderTopOffset + "px";

            appMainEl.style.top =
              offset.lastHeaderTopOffset + (offset.appBarHeight ?? 0) + "px";
          }
        }
      } else {
        offset.lastHeaderTopOffset = 0;
        appMainEl.style.top = "0px";
        offset.headerIsHidden = true;
      }
    }

    offsetRef.current = offset;
  }

  useEffect(() => {
    onUpdateFloatingBarTopOffset();

    const bodyEl = appBodyEl.current!;
    bodyEl!.addEventListener("scroll", onUpdateFloatingBarTopOffset);
    bodyEl!.addEventListener("resize", onUpdateFloatingBarTopOffset);

    return () => {
      bodyEl!.removeEventListener("scroll", onUpdateFloatingBarTopOffset);
      bodyEl!.removeEventListener("resize", onUpdateFloatingBarTopOffset);
    };
  }, [ showAppBarValue, showAppBarToggleBtnValue, appHeaderEl, appBodyEl ]);

  return (<Box className={className}>
      { showAppBarValue ? <AppBarCore
          className={headerClassName}
          elemRef={appHeaderEl}
          style={headerStyle}
          height={headerHeight}>
            { headerChildren }
        </AppBarCore> : null }
      { showAppBarToggleBtnValue ? <ToggleAppBarButton appDataSliceOps={appDataSliceOps} onToggled={onUpdateFloatingBarTopOffset} /> : null }
      <AppMainContentCore
        className={bodyClassName}
        elemRef={appBodyEl}
        style={bodyStyle}>
          { bodyChildren }
      </AppMainContentCore>
    </Box>);
}
