import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import MenuIcon from "@mui/icons-material/Menu";

import { Route, Routes } from "react-router-dom";

import trmrk from "trmrk";

import AppModule from "trmrk-react/src/components/appModule/AppModule";

import DevModuleHomePage from "./DevModuleHomePage";
import IndexedDbDemo from "../../pages/dev/indexedDbDemo/IndexedDbDemo";

import ToggleAppBarBtn from "trmrk-react/src/components/appBar/ToggleAppBarBtn";
import SettingsMenu from "trmrk-react/src/components/settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "trmrk-react/src/components/settingsMenu/AppearenceSettingsMenu";
import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";
import BasicAppModule from "trmrk-react/src/components/basicAppModule/BasicAppModule"

import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../../store/appBarDataSlice";

export interface DevModuleProps {
  className?: string | null | undefined;
  basePath: string
}

const getAppBarContents = (basePath: string, urlPath: string): React.ReactNode | Iterable<React.ReactNode > => {
  const retNodes: React.ReactNode[] = [];

  switch (urlPath) {
    case "/indexeddb-browser":
      retNodes.push(<Link key={0} to={`${basePath}/indexeddb-browser/create-db`}>
        <IconButton className="trmrk-icon-btn"><span className="material-symbols-outlined">database</span></IconButton></Link>);
      break;
    case "/indexeddb-browser/create-db":
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
  const appBar = useAppBar({
    appBarReducers: appBarReducers,
    appBarSelectors: appBarSelectors,
    appDataReducers: appDataReducers,
    appDataSelectors: appDataSelectors,
    appBarRowsCount: 2
  });
  
  const urlPath = useSelector(
    appDataSelectors.getCurrentUrlPath).substring(
      props.basePath.length);

  const [ baseUrlPath, setBaseUrlPath ] = React.useState('');
  
  React.useEffect(() => {
    const relUrlPathVal = getRelUrlPath(urlPath);

    if (relUrlPathVal !== baseUrlPath) {
      setBaseUrlPath(relUrlPathVal);
    }
  }, [
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
    urlPath,
    baseUrlPath ]);

  return (<BasicAppModule
      className="trmrk-dev"
      appBar={appBar}
      basePath={`${props.basePath}${baseUrlPath}`}
      headerClassName="trmrk-dev-header"
      bodyClassName="trmrk-app-body"
      appBarChildren={getAppBarContents(props.basePath, urlPath)}>
        <Routes>
          <Route path={"/indexeddb-browser"} element={<IndexedDbDemo urlPath={`${props.basePath}/indexeddb-browser`} />} />
          <Route path={"/indexeddb-browser/create-db"} element={<IndexedDbDemo urlPath={`${props.basePath}/indexeddb-browser/create-db`} />} />
          <Route path="/" element={<DevModuleHomePage urlPath={props.basePath} />} />
        </Routes>
      </BasicAppModule>);
}
