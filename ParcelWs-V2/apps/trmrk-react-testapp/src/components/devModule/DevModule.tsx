import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import { Route, Routes } from "react-router-dom";

import { appDataSelectors } from "../../store/appDataSlice";

import AppModule from "trmrk-react/src/components/appModule/AppModule";

import DevModuleHomePage from "./DevModuleHomePage";
import IndexedDbBrowser from "../indexedDbBrowser/IndexedDbBrowser";

export interface DevModuleProps {
  className?: string | null | undefined;
  basePath: string
}

export default function DevModule(
  props: DevModuleProps
) {
  const isCompactMode = useSelector(appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);
  const showAppBar = useSelector(appDataSelectors.getShowAppBar);
  const showAppBarToggleBtn = useSelector(appDataSelectors.getShowAppBarToggleBtn);
  const [ lastRefreshTmStmp, setLastRefreshTmStmp ] = React.useState(new Date());

  console.log("props.basePath", props.basePath);

  return (<AppModule
      className={["trmrk-dev"].join(" ")}
      headerClassName="trmrk-dev-header"
      headerContent={<AppBar className="trmrk-dev-module-bar trmrk-app-module-bar">
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
      </AppBar>}
      afterHeaderClassName="trmrk-app-module-header-toggle trmrk-icon-btn"
      afterHeaderContent={ showAppBarToggleBtn ? <IconButton>
        { showAppBar ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }</IconButton> : null }
      bodyClassName="trmrk-app-body"
      showHeader={showAppBar}
      pinHeader={!isCompactMode}
      isDarkMode={isDarkMode}
      isCompactMode={isCompactMode}
      lastRefreshTmStmp={lastRefreshTmStmp}
      scrollableX={true}
      scrollableY={isCompactMode}
      bodyContent={
    <Routes>
      <Route path={`indexeddb-browser`} element={<IndexedDbBrowser />} />
      <Route path="/" element={<DevModuleHomePage />} />
    </Routes>} />);
}
