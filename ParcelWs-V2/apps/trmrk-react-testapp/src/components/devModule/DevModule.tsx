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
import SettingsMenu from "../settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../settingsMenu/AppearenceSettingsMenu";
import { useAppBar } from "trmrk-react/src/hooks/useAppBar/useAppBar";

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

  return (<AppModule
      className={["trmrk-dev"].join(" ")}
      headerClassName="trmrk-dev-header"
      headerContent={<AppBar className="trmrk-dev-module-bar trmrk-app-module-bar">
        <IconButton onClick={appBar.handleSettingsClick} className="trmrk-icon-btn"><MenuIcon /></IconButton>
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
        <SettingsMenu
          appTheme={appBar.appTheme}
          appearenceMenuBtnRefAvailable={appBar.appearenceMenuBtnRefAvailable}
          showMenu={appBar.appSettingsMenuIsOpen}
          menuAnchorEl={appBar.settingsMenuIconBtnEl!}
          menuClosed={appBar.handleSettingsMenuClosed}
          appearenceMenuOpen={appBar.appearenceMenuOpen}>
        </SettingsMenu>
        <AppearenceSettingsMenu
          appTheme={appBar.appTheme}
          showMenu={appBar.appearenceMenuIsOpen}
          isCompactMode={appBar.isCompactMode}
          isDarkMode={appBar.isDarkMode}
          compactModeToggled={appBar.handleCompactModeToggled}
          darkModeToggled={appBar.handleDarkModeToggled}
          menuClosed={appBar.handleSettingsMenuClosed}
          appearenceMenuClosed={appBar.handleAppearenceMenuClosed}
          menuAnchorEl={appBar.appearenceMenuIconBtnEl!}>
        </AppearenceSettingsMenu>
      </AppBar>}
      afterHeaderClassName="trmrk-app-module-header-toggle trmrk-icon-btn"
      afterHeaderContent={ appBar.showAppBarToggleBtn ? <ToggleAppBarBtn showAppBar={appBar.showAppBar} appBarToggled={appBar.appBarToggled} /> : null }
      bodyClassName="trmrk-app-body"
      showHeader={appBar.showAppBar}
      headerHeight={appBar.appHeaderHeight}
      pinHeader={!appBar.isCompactMode}
      isDarkMode={appBar.isDarkMode}
      isCompactMode={appBar.isCompactMode}
      lastRefreshTmStmp={appBar.lastRefreshTmStmp}
      scrollableX={true}
      scrollableY={appBar.isCompactMode}
      scrolling={appBar.appHeaderScrolling}
      bodyContent={
    <Routes>
      <Route path={`indexeddb-browser`} element={<IndexedDbBrowser />} />
      <Route path="/" element={<DevModuleHomePage />} />
    </Routes>} />);
}
