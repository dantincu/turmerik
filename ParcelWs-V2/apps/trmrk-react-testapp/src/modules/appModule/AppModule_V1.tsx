import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";
import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice_V1";

import HomePage from "./pages/home/HomePage";
import ResizablesDemo from "./pages/resizablesDemo/ResizablesDemo_V1";

import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";
import FloatingTopBarAppModule from "trmrk-react/src/components/floatingTopBarAppModule/FloatingTopBarAppModule_V1";
import NotFound from "../../pages/notFound/NotFound";

import { FloatingTopBarPanelHeaderData, FloatingTopBarPanelHeaderOffset } from "trmrk-react/src/components/floatingTopBarPanel/FloatingTopBarPanel_V1";

export interface AppModuleProps {
  basePath: string;
  rootPath: string;
}

export default function AppModule(props: AppModuleProps) {
  const appHeaderBeforeScrolling = React.useRef<((
    data: FloatingTopBarPanelHeaderData
  ) => boolean | null | undefined | void) | null>(null);

  const appHeaderScrolling = React.useRef<((
    data: FloatingTopBarPanelHeaderData,
    offset: FloatingTopBarPanelHeaderOffset
  ) => void) | null>(null);

  const appHeaderBeforeScrollingHandler = React.useCallback((data: FloatingTopBarPanelHeaderData) => {
    if (appHeaderBeforeScrolling.current)  {
      return appHeaderBeforeScrolling.current(data);
    }
  }, [appHeaderBeforeScrolling]);

  const appHeaderScrollingHandler = React.useCallback((data: FloatingTopBarPanelHeaderData,
    offset: FloatingTopBarPanelHeaderOffset) => {
    if (appHeaderScrolling.current)  {
      appHeaderScrolling.current(data, offset);
    }
  }, [appHeaderBeforeScrolling]);

  const appBar = useAppBar({
    appBarReducers: appBarReducers,
    appBarSelectors: appBarSelectors,
    appDataReducers: appDataReducers,
    appDataSelectors: appDataSelectors,
    appHeaderBeforeScrolling: appHeaderBeforeScrollingHandler,
    appHeaderScrolling: appHeaderScrollingHandler
  });

  const [ isFirstRender, setIsFirstRender ] = React.useState(true);
  const appBarRowsCount = useSelector(appBarSelectors.getAppBarRowsCount);

  const refreshBtnRef = React.createRef<HTMLButtonElement>();
  const dispatch = useDispatch();

  const increaseHeaderHeightBtnClicked = () => {
    dispatch(appBarReducers.setAppBarRowsCount(appBar.appBarRowsCount + 1));
  }

  const decreaseHeaderHeightBtnClicked = () => {
    if (appBar.appBarRowsCount > 1) {
      dispatch(appBarReducers.setAppBarRowsCount(appBar.appBarRowsCount - 1));
    }
  }

  const onRefreshClick = () => {
    dispatch(appBarReducers.incAppBarHeightRefreshReqsCount());
    dispatch(appBarReducers.incAppBarScrollRefreshReqsCount());
  }

  useEffect(() => {
    const refreshBtnEl = refreshBtnRef.current;

    if (refreshBtnEl) {
      refreshBtnEl.addEventListener("click", onRefreshClick);
    }

    if (isFirstRender) {
      setIsFirstRender(false);
      dispatch(appBarReducers.setAppBarRowsCount(1));
    }

    // console.log("appHeaderBeforeScrolling1", appHeaderBeforeScrolling.current, appHeaderScrolling.current);

    return () => {      
      if (refreshBtnEl) {
        refreshBtnEl.removeEventListener("click", onRefreshClick);
      }
    }
  }, [
    isFirstRender,
    props.basePath,
    props.rootPath,
    appBar.appTheme,
    refreshBtnRef,
    appBarRowsCount,
    appBar.appBarRowsCount,
    appBar.appBarHeightRefreshReqsCount,
    appBar.appHeaderHeight,
    appBar.showAppBar,
    appBar.appSettingsMenuIsOpen,
    appBar.appearenceMenuIsOpen,
    appBar.appearenceMenuIconBtnEl,
    appBar.appBarRowHeightPx,
    appHeaderBeforeScrolling,
    appHeaderScrolling ]);

  const basePaths = {
    basePath: props.basePath,
    rootPath: props.rootPath
  }

  return (
    <FloatingTopBarAppModule
      className="trmrk-app"
      headerClassName="trmrk-app-header"
      appBar={appBar}
      basePath={props.basePath}
      appBarClassName="trmrk-app-module-bar"
      appBarChildren={[
        <IconButton key={0} className="trmrk-icon-btn" onClick={increaseHeaderHeightBtnClicked}><KeyboardArrowDownIcon /></IconButton>,
        <IconButton key={1} className="trmrk-icon-btn" onClick={decreaseHeaderHeightBtnClicked}><KeyboardArrowUpIcon /></IconButton>]}
      bodyClassName="trmrk-app-body"
      bodyScrollableY={true}
      refreshBtnClicked={() => {}}>
        <Routes>
          <Route path="resizables-demo" element={
            <ResizablesDemo
              refreshBtnRef={refreshBtnRef}
              urlPath={`${props.basePath}resizables-demo`}
              {...basePaths}
              appHeaderScrolling={appHeaderScrolling}
              appHeaderBeforeScrolling={appHeaderBeforeScrolling} />}></Route>
          <Route path="" element={<HomePage
              urlPath={props.basePath}
              {...basePaths} />}></Route>
          <Route path="*" element={ <NotFound /> } />
        </Routes>
    </FloatingTopBarAppModule>
  );
}
