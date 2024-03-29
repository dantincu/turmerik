import React from "react";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Route, Routes } from "react-router-dom";

import trmrk from "trmrk";

import MatUIIcon from "trmrk-react/src/components/icons/MatUIIcon";

import DevModuleHomePage from "./DevModuleHomePage";
import IndexedDbBrowser from "./pages/indexedDbBrowser/IndexedDbBrowserPage";
import IndexedDbBrowserCreateDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserCreateDbPage";
import IndexedDbBrowserEditDbPage from "./pages/indexedDbBrowser/IndexedDbBrowserEditDbPage";
import IndexedDbBrowserAppBarContent from "./indexedDbBrowser/IndexedDbBrowserAppBarContent";
import IndexedDbCreateDbAppBarContent from "./indexedDbBrowser/IndexedDbCreateDbAppBarContent";
import IndexedDbEditDbAppBarContent from "./indexedDbBrowser/IndexedDbEditDbAppBarContent";

import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";
import FloatingTopBarAppModule from "trmrk-react/src/components/floatingTopBarAppModule/FloatingTopBarAppModule";
import NotFound from "../../pages/notFound/NotFound";;

import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../../store/appBarDataSlice";

export interface DevModuleProps {
  className?: string | null | undefined;
  basePath: string;
  rootPath: string;
}

const getAppBarContents = (
  basePath: string,
  urlPath: string,
  baseUrlPath: string): React.ReactNode | Iterable<React.ReactNode > => {
  const retNodes: React.ReactNode[] = [];

  if (baseUrlPath.length > 1) {
    retNodes.push(<Link key={0} to={`${basePath}${baseUrlPath}`}><IconButton className="trmrk-icon-btn"><ArrowBackIcon /></IconButton></Link>);
  }

  switch (urlPath) {
    case "/indexeddb-browser":
      retNodes.push(<Link key={1} to={`${basePath}/indexeddb-browser/create-db`}>
        <IconButton className="trmrk-icon-btn"><MatUIIcon iconName="database" /></IconButton></Link>);
      retNodes.push(<IndexedDbBrowserAppBarContent key={2} basePath={basePath} />);
      break;
    case "/indexeddb-browser/create-db":
      retNodes.push(<IndexedDbCreateDbAppBarContent key={1} />);
      break;
    case "/indexeddb-browser/edit-db":
      retNodes.push(<IndexedDbEditDbAppBarContent key={1} />);
      break;
  }

  return retNodes;
}

const getRelUrlPath = (urlPath: string) => {
  const relUrlPathParts = trmrk.trimStr(urlPath.trim(), {
    trimStr: "/",
    trimEnd: true
  }).split("/");

  relUrlPathParts.splice(relUrlPathParts.length - 1, 1);
  let relUrlPath = relUrlPathParts.join("/");

  if (!relUrlPath.length) {
    relUrlPath = "/";
  }

  return relUrlPath;
}

export default function DevModule(
  props: DevModuleProps
) {
  const dispatch = useDispatch();

  const appBar = useAppBar({
    appBarReducers: appBarReducers,
    appBarSelectors: appBarSelectors,
    appDataReducers: appDataReducers,
    appDataSelectors: appDataSelectors,
  });

  const appBarRowsCount = useSelector(appBarSelectors.getAppBarRowsCount);
  
  const urlPath = useSelector(
    appDataSelectors.getCurrentUrlPath).substring(
      props.basePath.length);

  const [ baseUrlPath, setBaseUrlPath ] = React.useState('');

  React.useEffect(() => {
    const relUrlPathVal = getRelUrlPath(urlPath);

    if (relUrlPathVal !== baseUrlPath) {
      setBaseUrlPath(relUrlPathVal);
      dispatch(appBarReducers.setShowOptionsMenuBtn(true));
    }

    dispatch(appBarReducers.setAppBarRowsCount(2));
    // appBar.updateHeaderHeight(2);
  }, [
    appBarRowsCount,
    appBar.appTheme,
    appBar.appBarRowsCount,
    appBar.lastRefreshTmStmp,
    appBar.appHeaderHeight,
    appBar.showAppBar,
    appBar.appSettingsMenuIsOpen,
    appBar.appearenceMenuIsOpen,
    appBar.appearenceMenuIconBtnEl,
    appBar.appBarRowHeightPx,
    props.basePath,
    props.rootPath,
    urlPath,
    baseUrlPath ]);

  return (<FloatingTopBarAppModule
      className="trmrk-dev"
      appBar={appBar}
      basePath={props.basePath}
      headerClassName="trmrk-dev-header"
      bodyClassName="trmrk-dev-body"
      appBarChildren={getAppBarContents(props.basePath, urlPath, baseUrlPath)}
      refreshBtnClicked={() => {}}>
        <Routes>
          <Route path={"/indexeddb-browser"} element={<IndexedDbBrowser urlPath={`${props.basePath}/indexeddb-browser`} />} />
          <Route path={"/indexeddb-browser/create-db"} element={<IndexedDbBrowserCreateDbPage urlPath={`${props.basePath}/indexeddb-browser/create-db`} />} />
          <Route path={"/indexeddb-browser/edit-db"} element={<IndexedDbBrowserEditDbPage urlPath={`${props.basePath}/indexeddb-browser/edit-db`} />} />
          <Route path="/" element={<DevModuleHomePage exitPath={props.rootPath} urlPath={props.basePath} />} />
          <Route path="*" element={ <NotFound /> } />
        </Routes>
      </FloatingTopBarAppModule>);
}
