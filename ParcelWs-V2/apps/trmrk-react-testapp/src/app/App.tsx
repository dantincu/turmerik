import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { withErrorBoundary, useErrorBoundary } from "react-use-error-boundary";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Button  from "@mui/material/Button";
import Paper  from "@mui/material/Paper";
import AppBar  from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import { appDataReducers, appDataSelectors } from "../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../store/appBarDataSlice";
import { appBarDataSliceOps } from "../../../../../ParcelWs/apps/trmrk-devtools-webapp/src/store/appBarDataSlice";

import AppModule from "trmrk-react/src/components/appModule/AppModule";
import ResizablePanel, { 
  ResizablePanelBorderSize,
  ResizablePanelBorderOpacity,
  MouseMovement,
  ResizeDirection,
  combineOrtoResizeHandlers } from "trmrk-react/src/components/resizablePanel/ResizablePanel";

import "./App.scss";

const App = withErrorBoundary(() => {
  const [error, resetError] = useErrorBoundary(
    // You can optionally log the error to an error reporting service
    // (error, errorInfo) => logErrorToMyService(error, errorInfo)
  );

  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);
  const showAppBar = useSelector(appDataSelectors.getShowAppBar);
  const showAppBarToggleBtn = useSelector(appDataSelectors.getShowAppBarToggleBtn);

  const dispatch = useDispatch();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [ lastRefreshTmStmp, setLastRefreshTmStmp ] = React.useState(new Date());

  const parentRef = React.createRef<HTMLDivElement>();
  const topPanelRef = React.createRef<HTMLDivElement>();
  const bottomPanelRef = React.createRef<HTMLDivElement>();

  const topPanelX = React.useRef(0);
  const topPanelY = React.useRef(0);
  
  const topPanelW = React.useRef(0);
  const topPanelH = React.useRef(0);

  const bottomPanelX = React.useRef(0);
  const bottomPanelY = React.useRef(0);

  const bottomPanelW = React.useRef(0);
  const bottomPanelH = React.useRef(0);

  const updatePanelX = (
    panelEl: HTMLDivElement,
    panelX: React.MutableRefObject<number>,
    newValue: number) => {
    newValue = Math.max(0, newValue);
    panelX.current = newValue;
    panelEl.style.left = `${newValue}px`;
  }

  const updatePanelY = (
    panelEl: HTMLDivElement,
    panelY: React.MutableRefObject<number>,
    newValue: number) => {
    newValue = Math.max(0, newValue);
    panelY.current = newValue;
    panelEl.style.top = `${newValue}px`;
  }

  const updatePanelW = (
    panelEl: HTMLDivElement,
    panelW: React.MutableRefObject<number>,
    newValue: number) => {
      newValue = Math.max(0, newValue);
      panelW.current = newValue;
      panelEl.style.width = `${newValue}px`;
    }

  const updatePanelH = (
    panelEl: HTMLDivElement,
    panelH: React.MutableRefObject<number>,
    newValue: number) => {
      newValue = Math.max(0, newValue);
      panelH.current = newValue;
      panelEl.style.height = `${newValue}px`;
    }

  const domBodyEl = {
    current: document.body
  } as React.RefObject<HTMLElement>;

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(appBarReducers.setAppSettingsMenuIsOpen(true));
  };

  const handleRefreshClick = () => {
    setLastRefreshTmStmp(new Date());
  }

  useEffect(() => {
  }, [ parentRef, topPanelRef, bottomPanelRef ]);

  if (error) {
    return (
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />

        <Paper className={["trmrk-app-error", appThemeClassName].join(" ")}>
          <h2>Something went wrong:</h2>
          <pre>{((error as Error).message ?? error).toString()}</pre>
          { /* <Button onClick={resetError}>Try again</Button> */ }
        </Paper>
      </ThemeProvider>
    );
  }

  const topPanelResizeStarted = (e: MouseEvent, rszDir: ResizeDirection) => {
    const topPanelEl = topPanelRef.current!;
    updatePanelX(topPanelEl, topPanelX, topPanelEl.offsetLeft);
    updatePanelY(topPanelEl, topPanelY, topPanelEl.offsetTop);
    updatePanelW(topPanelEl, topPanelW, topPanelEl.clientWidth);
    updatePanelH(topPanelEl, topPanelH, topPanelEl.clientHeight);
    topPanelEl.style.marginLeft = "0px";
    console.log("top panel resize started", topPanelEl.offsetLeft, topPanelEl.offsetTop, new Date());
  }

  const topPanelResizeEnded = (e: MouseEvent | null, rszDir: ResizeDirection) => {
    console.log("top panel resize ended", new Date());
  }

  const bottomPanelResizeStarted = (e: MouseEvent, rszDir: ResizeDirection) => {
    const bottomPanelEl = bottomPanelRef.current!;
    updatePanelX(bottomPanelEl, bottomPanelX, bottomPanelEl.offsetLeft);
    updatePanelY(bottomPanelEl, bottomPanelY, bottomPanelEl.offsetTop);
    updatePanelW(bottomPanelEl, bottomPanelW, bottomPanelEl.clientWidth);
    updatePanelH(bottomPanelEl, bottomPanelH, bottomPanelEl.clientHeight);
    bottomPanelEl.style.marginLeft = "0px";
    console.log("bottom panel resize started", bottomPanelEl, bottomPanelEl.offsetTop, new Date());
  }

  const bottomPanelResizeEnded = (e: MouseEvent | null, rszDir: ResizeDirection) => {
    console.log("bottom panel resize ended", new Date());
  }

  const panelResizing = (
    e: MouseEvent,
    mouseMovement: MouseMovement,
    rszDir: ResizeDirection,
    panelRef: React.RefObject<HTMLDivElement>,
    panelX: React.MutableRefObject<number>,
    panelY: React.MutableRefObject<number>,
    panelW: React.MutableRefObject<number>,
    panelH: React.MutableRefObject<number>) => {
      combineOrtoResizeHandlers(
        (e: MouseEvent,
        mouseMovement: MouseMovement,
        rszDir: ResizeDirection) => {
          switch (rszDir) {
            case ResizeDirection.FromLeft:
              updatePanelX(panelRef.current!, panelX, panelX.current + mouseMovement.movementX);
              updatePanelW(panelRef.current!, panelW, panelW.current - mouseMovement.movementX);
              break;
            case ResizeDirection.FromTop:
              updatePanelY(panelRef.current!, panelY, panelY.current + mouseMovement.movementY);
              updatePanelH(panelRef.current!, panelH, panelH.current - mouseMovement.movementY);
              break;
            case ResizeDirection.FromRight:
              updatePanelW(panelRef.current!, panelW, panelW.current + mouseMovement.movementX);
              break;
            case ResizeDirection.FromBottom:
              updatePanelH(panelRef.current!, panelH, panelH.current + mouseMovement.movementY);
              break;
            default:
              throw new Error(`Invalid resize direction: ${rszDir}`);
          }
      })(e, mouseMovement, rszDir);
  }

  const topPanelResizing = (e: MouseEvent, mouseMovement: MouseMovement, rszDir: ResizeDirection) => {
    panelResizing(e, mouseMovement, rszDir, topPanelRef, topPanelX, topPanelY, topPanelW, topPanelH);
  }

  const bottomPanelResizing = (e: MouseEvent, mouseMovement: MouseMovement, rszDir: ResizeDirection) => {
    panelResizing(e, mouseMovement, rszDir, bottomPanelRef, bottomPanelX, bottomPanelY, bottomPanelW, bottomPanelH);
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={appTheme.theme}>
        <CssBaseline />

        <AppModule
          className={["trmrk-app"].join(" ")}
          headerClassName="trmrk-app-header"
          headerContent={<AppBar className="trmrk-app-bar"></AppBar>}
          afterHeaderClassName="trmrk-app-header-toggle"
          afterHeaderContent={ showAppBarToggleBtn ? <IconButton>
            { showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }</IconButton> : null }
          bodyClassName="trmrk-app-body"
          bodyContent={
            <Paper className="trmrk-app-main-content" ref={parentRef}>
              <Button sx={{ position: "fixed" }} onClick={handleRefreshClick}>Refresh</Button>

              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

              <ResizablePanel
                resizableFromTop={true}
                resizableFromBottom={true}
                resizableFromRight={true}
                resizableFromLeft={true}
                parentRef={domBodyEl}
                panelRef={topPanelRef}
                className="my-resizable-panel"
                draggableBorderSize={ResizablePanelBorderSize.Regular}
                draggableBorderOpacity={ResizablePanelBorderOpacity.Opc50}
                resizeStarted={topPanelResizeStarted}
                resizeEnded={topPanelResizeEnded}
                resizing={topPanelResizing}>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              </ResizablePanel>

              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

              <ResizablePanel
                resizableFromTop={true}
                resizableFromBottom={true}
                resizableFromRight={true}
                resizableFromLeft={true}
                parentRef={domBodyEl}
                panelRef={bottomPanelRef}
                className="my-resizable-panel"
                draggableBorderSize={ResizablePanelBorderSize.Thick}
                draggableBorderOpacity={ResizablePanelBorderOpacity.Opc25}
                resizeStarted={bottomPanelResizeStarted}
                resizeEnded={bottomPanelResizeEnded}
                resizing={bottomPanelResizing}>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              </ResizablePanel>

              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

            </Paper> }
          showHeader={showAppBar}
          pinHeader={!isCompactMode}
          isDarkMode={isDarkMode}
          isCompactMode={isCompactMode}
          lastRefreshTmStmp={lastRefreshTmStmp}
          scrollableX={true}
          scrollableY={isCompactMode} />
      </ThemeProvider>
    </BrowserRouter>
  );
});
  
export default App;
