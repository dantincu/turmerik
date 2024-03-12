import React from "react";
import { Link } from "react-router-dom";

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";

import { Route, Routes } from "react-router-dom";

import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../../store/appBarDataSlice";

import AppModule from "trmrk-react/src/components/appModule/AppModule";

import DevModuleHomePage from "./DevModuleHomePage";
import IndexedDbBrowser from "../indexedDbBrowser/IndexedDbBrowser";

import ToggleAppBarBtn from "trmrk-react/src/components/appBar/ToggleAppBarBtn";
import SettingsMenu from "trmrk-react/src/components/settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "trmrk-react/src/components/settingsMenu/AppearenceSettingsMenu";
import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";
import BasicAppModule from "trmrk-react/src/components/basicAppModule/BasicAppModule"

export interface DevModuleProps {
  className?: string | null | undefined;
  basePath: string
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
  
  React.useEffect(() => {
  }, [
    appBar.appTheme,
    appBar.appBarRowsCount,
    appBar.lastRefreshTmStmp,
    appBar.appHeaderHeight,
    appBar.showAppBar,
    appBar.appSettingsMenuIsOpen,
    appBar.appearenceMenuIsOpen,
    appBar.appearenceMenuIconBtnEl,
    appBar.appBarRowHeightPx ]);

  return (<BasicAppModule
      className="trmrk-dev"
      appBar={appBar}
      basePath={props.basePath}
      headerClassName="trmrk-dev-header"
      bodyClassName="trmrk-app-body">
        <Routes>
          <Route path={"indexeddb-browser"} element={<IndexedDbBrowser />} />
          <Route path="/" element={<DevModuleHomePage />} />
        </Routes>
      </BasicAppModule>);
}
