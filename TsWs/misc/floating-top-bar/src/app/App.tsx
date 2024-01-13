import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled';

import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AppData, AppBarData } from "../services/appData";
import { setShowAppBar, setIsCompactMode } from "../store/appDataSlice";
import { setAppOptionsMenuIsOpen } from "../store/appBarDataSlice";
import TrmrkAppBar from "./TrmrkAppBar";

interface FloatingBarTopOffset {
  showHeader: boolean | null;
  headerIsHidden: boolean;
  appBarHeight: number | null;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

const updateFloatingBarTopOffset = <Element extends HTMLElement>(
  offset: FloatingBarTopOffset,
  appBarEl: Element | null,
  appMainEl: Element | null
) => {
  if (typeof offset.showHeader === "boolean") {
    offset.lastHeaderTopOffset = 0;

    if (offset.showHeader === true) {
      if (appBarEl) {
        offset.appBarHeight ??= appBarEl.clientHeight;
        appBarEl.style.top = "0px";

        offset.headerIsHidden = false;
        offset.showHeader = null;

        if (appMainEl) {
          appMainEl.style.top =
            offset.lastHeaderTopOffset + offset.appBarHeight + "px";
        } else {
        }
      }
    } else if (offset.showHeader === false) {
      if (appMainEl) {
        offset.appBarHeight ??= appBarEl?.clientHeight ?? 0;
        appMainEl.style.top = "0px";

        offset.headerIsHidden = true;
        offset.showHeader = null;
      }
    }
  } else {
    if (appBarEl && appMainEl) {
      offset.appBarHeight ??= appBarEl.clientHeight;

      if (offset.headerIsHidden) {
        appMainEl.style.top = "0px";
      } else {
        const bodyScrollTop = appMainEl.scrollTop; // on iOs this property can be negative when dragging by the top of the page
        const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;

        if (bodyScrollTop > 0) {
          appBarEl.innerText = `bodyScrollTop: ${bodyScrollTop}`;

          const headerTopOffset = Math.max(
            offset.lastHeaderTopOffset - bodyScrollTopDiff,
            -1 * offset.appBarHeight
          );

          offset.lastBodyScrollTop = bodyScrollTop;
          offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);

          appBarEl.style.top = offset.lastHeaderTopOffset + "px";
          appMainEl.style.top =
            offset.lastHeaderTopOffset + offset.appBarHeight + "px";
        }
      }
    }
  }
};

const offset: FloatingBarTopOffset = {
  showHeader: null,
  headerIsHidden: false,
  appBarHeight: null,
  lastBodyScrollTop: 0,
  lastHeaderTopOffset: 0
}

export default function App() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const dispatch = useDispatch();

  const [ isCompactModeVal, setIsCompactModeVal ] = useState(appData.isCompactMode);

  const appHeaderEl = useRef<HTMLDivElement | null>(null);
  const appBodyEl = useRef<HTMLDivElement | null>(null);

  const onSetAppHeaderEl = (appHeaderElem: HTMLDivElement) => {
    appHeaderEl.current = appHeaderElem;
  }

  const onSetAppBodyEl = (appBodyElem: HTMLDivElement) => {
    appBodyEl.current = appBodyElem;
  }

  const onUpdateFloatingBarTopOffset = () => {
      updateFloatingBarTopOffset(
        offset, appHeaderEl?.current, appBodyEl?.current);
  }

  const onOnAppBarToggled = () => {
    const showAppBar = !appData.showAppBar;
    dispatch(setShowAppBar(showAppBar));

    offset.showHeader = showAppBar;
    onUpdateFloatingBarTopOffset();
  }

  useEffect(() => {
    offset.showHeader = true;

    appBodyEl.current!.addEventListener("scroll", onUpdateFloatingBarTopOffset);
    window.addEventListener("resize", onUpdateFloatingBarTopOffset);

    onUpdateFloatingBarTopOffset();
    setIsCompactModeVal(appData.isCompactMode);

    return () => {
      appBodyEl.current!.removeEventListener("scroll", onUpdateFloatingBarTopOffset);
      window.removeEventListener("resize", onUpdateFloatingBarTopOffset);
    }
  }, [ appHeaderEl, appBodyEl, appData, isCompactModeVal ]);

  return (
    <BrowserRouter>
      <CssBaseline />
        <IconButton onClick={onOnAppBarToggled} sx={{
          position: "fixed", top: "0px", right: "0px", zIndex: 1101, color: "white" }}
          className={ [ "trmrk-icon-btn-main trmrk-app-bar-toggle-icon",
            appData.showAppBar ? "trmrk-app-bar-toggle-hide-icon" : "trmrk-app-bar-toggle-show-icon" ].join(" ") }>
          { appData.showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
        </IconButton>
        { appData.showAppBar ? <TrmrkAppBar appHeaderEl={appHeaderEl}></TrmrkAppBar> : null }
        <Box className="trmrk-app" ref={appBodyEl} sx={{
          overflowY: appData.isCompactMode ? "scroll" : "visible",
          position: "absolute", display: "block", width: "100%", top: "5em", bottom: "0em" }}>
          <Box className="trmrk-app-main" sx={{ height: appData.isCompactMode ? "400vh" : "100%", display: "block", width: "100%" }}>
            { appData.isCompactMode ? "Compact Mode" : "Full Mode" }
          </Box>
        </Box>
    </BrowserRouter>
  );
}
