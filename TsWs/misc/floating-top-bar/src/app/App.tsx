import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled';

import CssBaseline from "@mui/material/CssBaseline";
import Checkbox  from "@mui/material/Checkbox";
import FormControlLabel  from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { AppData, AppBarData } from "../services/appData";
import { setShowAppBar } from "../store/appDataSlice";
import TrmrkAppBar from "./TrmrkAppBar";

interface FloatingBarTopOffset {
  showHeader: boolean | null;
  headerIsHidden: boolean;
  appBarHeight: number | null;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

let debugChkShowAllEl: HTMLInputElement | null = null
let mainDebugEl: HTMLDivElement | null = null
let mainDebugAllEl: HTMLDivElement | null = null
let debugShowAll = false;

const createElem = <TElement extends HTMLElement = HTMLDivElement>(
  elemName: string, className?: string | null | undefined, innerText?: string | null | undefined) => {
  const elem = document.createElement(elemName) as TElement;

  if (className) {
    elem.className = className;
  }

  if (typeof innerText === "string") {
    elem.innerText = innerText;
  }

  return elem;
}

const createValueLiteralElem = (value: any | null | undefined) => {
  let retElemClassNameSuffix: string;
  let valueStr = value?.toString();
  const typeOfValue = typeof value;

  switch (typeOfValue) {
    case "string":
      retElemClassNameSuffix = "string";
      break;
    case "number":
      retElemClassNameSuffix = "number";
      break;
    case "boolean":
      retElemClassNameSuffix = "boolean";
      break;
    case "object":
      if (value !== null) {
        retElemClassNameSuffix = "object";
      } else {
        retElemClassNameSuffix = "null";
        valueStr = "null";
      }
      break;
    case "undefined":
      retElemClassNameSuffix = "undefined";
      valueStr = "undefined";
      break;
    default:
      retElemClassNameSuffix = "other";
      break;
  }

  const retElemClassName = "trmrk-literal-" + retElemClassNameSuffix;
  const retElem = createElem("div", retElemClassName, valueStr);

  return retElem;
}

const createDebugLogEntryGridRow = (name: string, value: any | null | undefined) => {
  const rowEl = createElem<HTMLTableRowElement>("tr");

  const nameCellEl = createElem<HTMLTableCellElement>("td", "trmrk-grid-name-cell", name);
  const valueCellEl = createElem<HTMLTableCellElement>("td", "trmrk-grid-value-cell");

  const valueLiteralElem = createValueLiteralElem(value);
  valueCellEl.appendChild(valueLiteralElem);

  rowEl.appendChild(nameCellEl);
  rowEl.appendChild(valueCellEl);

  return rowEl;
}

const appendDebugLogEntryGridRow = (gridElem: HTMLTableElement, name: string, value: any | null | undefined) => {
  const rowEl = createDebugLogEntryGridRow(name, value);
  gridElem.appendChild(rowEl);
}

const getTimeStamp = () => {
  let timeStamp = new Date().toISOString();
  timeStamp = timeStamp.substring(11, timeStamp.length - 1);

  return timeStamp;
}

const createDebugLogElem = (
  offset: FloatingBarTopOffset,
  appBarEl: Element | null,
  appMainEl: Element | null,
  debugEl?: Element | null | undefined,
  timeStamp?: string | null | undefined
) => {
  const parentElem = createElem("div", "trmrk-debug-log-entry");

  const headerElem = createElem(
    "div", "trmrk-debug-log-entry-header");

  const nameLabelEl = createElem<HTMLLabelElement>("label", null, timeStamp);
  const nameCheckBox = createElem<HTMLInputElement>("input");
  nameCheckBox.type = "checkbox";
  nameLabelEl.appendChild(nameCheckBox);
  headerElem.appendChild(nameLabelEl);

  const gridElem = createElem<HTMLTableElement>("table", "trmrk-debug-log-entry-content-grid");

  appendDebugLogEntryGridRow(gridElem, "showHeader", offset.showHeader);
  appendDebugLogEntryGridRow(gridElem, "headerIsHidden", offset.headerIsHidden);
  appendDebugLogEntryGridRow(gridElem, "appBarHeight", offset.appBarHeight);
  appendDebugLogEntryGridRow(gridElem, "lastHeaderTopOffset", offset.lastHeaderTopOffset);
  appendDebugLogEntryGridRow(gridElem, "lastBodyScrollTop", offset.lastBodyScrollTop);
  appendDebugLogEntryGridRow(gridElem, "appBarEl.clientTop", appBarEl?.clientTop);
  appendDebugLogEntryGridRow(gridElem, "appMainEl.scrollTop", appMainEl?.scrollTop);
  
  parentElem.appendChild(headerElem);
  parentElem.appendChild(gridElem);

  return parentElem;
}

const updateFloatingBarTopOffset = <Element extends HTMLElement>(
  offset: FloatingBarTopOffset,
  appBarEl: Element | null,
  appMainEl: Element | null,
  debugEl?: Element | null | undefined
) => {
  if (debugEl) {
    const timeStamp = getTimeStamp();
    const logEntryEl1 = createDebugLogElem(offset, appBarEl, appMainEl, debugEl, timeStamp);
    const logEntryEl2 = createDebugLogElem(offset, appBarEl, appMainEl, debugEl, timeStamp);

    mainDebugEl!.childNodes[0]?.remove();
    mainDebugEl!.appendChild(logEntryEl1);
    mainDebugAllEl?.appendChild(logEntryEl2);
  }

  let bodyScrollTop: number | null = null;
  let bodyScrollTopDiff: number | null = null;
  
  if (appMainEl) {
    offset.appBarHeight ??= (appBarEl?.clientHeight) ?? null;

    bodyScrollTop = appMainEl.scrollTop;
    bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
    offset.lastBodyScrollTop = bodyScrollTop;

    let headerTopOffset = Math.max(
          offset.lastHeaderTopOffset - bodyScrollTopDiff,
          -1 * (offset.appBarHeight ?? 0)
        );

    offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);
  }

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
    if (appMainEl) {
      if (offset.headerIsHidden) {
        appMainEl.style.top = "0px";
      } else {
        if ((bodyScrollTop ?? 0) > 0) { // on iOs this property can be negative when dragging by the top of the page
          if (appBarEl) {
            appBarEl.style.top = offset.lastHeaderTopOffset + "px";

            appMainEl.style.top =
              offset.lastHeaderTopOffset + (offset.appBarHeight ?? 0) + "px";
          }
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
  const debugEl = useRef<HTMLDivElement | null>(null);

  const onUpdateFloatingBarTopOffset = () => {
      updateFloatingBarTopOffset(
        offset, appHeaderEl?.current, appBodyEl?.current, debugEl?.current);
  }

  const onOnAppBarToggled = () => {
    const showAppBar = !appData.showAppBar;
    dispatch(setShowAppBar(showAppBar));

    offset.showHeader = showAppBar;
    onUpdateFloatingBarTopOffset();
  }

  const debugChkShowAllElChanged = (e: Event) => {
    debugShowAll = debugChkShowAllEl!.checked;

    if (debugShowAll) {
      mainDebugAllEl!.style.display = "block";
      mainDebugEl!.style.display = "none";
    } else {
      mainDebugAllEl!.style.display = "none";
      mainDebugEl!.style.display = "block";
    }
  }

  useEffect(() => {
    offset.showHeader = true;

    appBodyEl.current!.addEventListener("scroll", onUpdateFloatingBarTopOffset);
    window.addEventListener("resize", onUpdateFloatingBarTopOffset);

    const debugElem = debugEl.current!;
    debugChkShowAllEl = debugElem.querySelector<HTMLInputElement>(".trmrk-check-box-show-all input[type=checkbox]");
    mainDebugEl = debugElem.querySelector(".trmrk-debug-main");
    mainDebugAllEl = debugElem.querySelector(".trmrk-debug-main-all");

    debugChkShowAllEl!.addEventListener("change", debugChkShowAllElChanged);

    onUpdateFloatingBarTopOffset();
    setIsCompactModeVal(appData.isCompactMode);

    return () => {
      debugChkShowAllEl!.removeEventListener("change", debugChkShowAllElChanged);
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
        <Box className="trmrk-debug" ref={debugEl} sx={{
            position: "fixed", display: "block", top: "6.5em", height: "75%", width: "75%", backgroundColor: "#FFF0D0" }}>
          <Box sx={{ position: "absolute", display: "block", top: "0px", width: "100%", height: "2.5em", backgroundColor: "white" }}>
            <FormControlLabel control={<Checkbox />} label="Show All" sx={{ marginLeft: "1em" }} className="trmrk-check-box-show-all" />
          </Box>
          <Box sx={{ position: "absolute", display: "block", top: "2.5em", bottom: "0px", width: "100%", overflow: "scroll" }}
              className="trmrk-debug-main">
          </Box>
          <Box sx={{ position: "absolute", display: "none", top: "2.5em", bottom: "0px", width: "100%", overflow: "scroll" }}
              className="trmrk-debug-main-all">
          </Box>
        </Box>
    </BrowserRouter>
  );
}
