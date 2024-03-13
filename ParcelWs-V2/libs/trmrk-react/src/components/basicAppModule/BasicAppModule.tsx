import React from "react";
import { Link } from "react-router-dom";

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";

import AppModule from "../appModule/AppModule";

import ToggleAppBarBtn from "../appBar/ToggleAppBarBtn";
import SettingsMenu from "../settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../settingsMenu/AppearenceSettingsMenu";
import { UseAppBarResult } from "../../hooks/useAppBar/useAppBar";

export interface BasicAppModuleProps {
  appBar: UseAppBarResult,
  className: string;
  headerClassName?: string | null | undefined;
  appBarClassName?: string | null | undefined;
  bodyClassName?: string | null | undefined;
  bodyScrollableY?: boolean | null | undefined;
  bodyScrollableX?: boolean | null | undefined;
  basePath: string;
  settingsMenuClassName?: string | null | undefined;
  settingsMenuListClassName?: string | null | undefined;
  appearenceMenuClassName?: string | null | undefined;
  appearenceMenuListClassName?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appBarChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  settingsMenuChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appearenceMenuChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
}

export default function BasicAppModule(
  props: BasicAppModuleProps
) {
  React.useEffect(() => {
  }, [
    props.appBar.appBarRowsCount,
    props.appBar.setAppBarRowsCount,
    props.appBar.appHeaderHeight,
    props.appBar.setAppHeaderHeight,
    props.appBar.appBarRowHeightPx,
    props.appBar.headerRef,
    props.appBar.bodyRef,
    props.appBar.isCompactMode,
    props.appBar.isDarkMode,
    props.appBar.showAppBar,
    props.appBar.showAppBarToggleBtn,
    props.appBar.appSettingsMenuIsOpen,
    props.appBar.appearenceMenuIsOpen,
    props.appBar.settingsMenuIconBtnEl,
    props.appBar.setSettingsMenuIconBtnEl,
    props.appBar.appearenceMenuIconBtnEl,
    props.appBar.setAppearenceMenuIconBtnEl,
    props.appBar.lastRefreshTmStmp,
    props.appBar.setLastRefreshTmStmp,
    props.appBar.appTheme,
    props.appBar.currentAppTheme,
    props.appBar.appThemeClassName,
    props.appBar.handleSettingsClick,
    props.appBar.appModeCssClass,
    props.appBar.appearenceMenuBtnRefAvailable,
    props.appBar.handleSettingsMenuClosed,
    props.appBar.handleAppearenceMenuClosed,
    props.appBar.appearenceMenuOpen,
    props.appBar.handleCompactModeToggled,
    props.appBar.handleDarkModeToggled,
    props.appBar.appBarToggled,
    props.appBar.appHeaderScrolling,
    props.className,
    props.headerClassName,
    props.appBarClassName,
    props.bodyClassName,
    props.bodyScrollableX,
    props.bodyScrollableY,
    props.basePath,
    props.settingsMenuClassName,
    props.settingsMenuListClassName,
    props.appearenceMenuClassName,
    props.settingsMenuListClassName,
    props.children,
    props.appBarChildren,
    props.settingsMenuChildren,
    props.appearenceMenuChildren ]);

  return (<AppModule
      className={props.className}
      headerClassName={props.headerClassName}
      headerContent={<AppBar className={["trmrk-app-module-bar", props.appBarClassName ?? ""].join(" ")}>
        <IconButton onClick={props.appBar.handleSettingsClick} className="trmrk-icon-btn"><MenuIcon /></IconButton>
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn"><HomeIcon /></IconButton></Link>
        { props.appBarChildren }
        <SettingsMenu
          className={props.settingsMenuClassName}
          menuListClassName={props.settingsMenuListClassName}
          appTheme={props.appBar.appTheme}
          appearenceMenuBtnRefAvailable={props.appBar.appearenceMenuBtnRefAvailable}
          showMenu={props.appBar.appSettingsMenuIsOpen}
          menuAnchorEl={props.appBar.settingsMenuIconBtnEl!}
          menuClosed={props.appBar.handleSettingsMenuClosed}
          appearenceMenuOpen={props.appBar.appearenceMenuOpen}>
            { props.settingsMenuChildren }
        </SettingsMenu>
        <AppearenceSettingsMenu
          className={props.appearenceMenuClassName}
          menuListClassName={props.appearenceMenuListClassName}
          appTheme={props.appBar.appTheme}
          showMenu={props.appBar.appearenceMenuIsOpen}
          isCompactMode={props.appBar.isCompactMode}
          isDarkMode={props.appBar.isDarkMode}
          compactModeToggled={props.appBar.handleCompactModeToggled}
          darkModeToggled={props.appBar.handleDarkModeToggled}
          menuClosed={props.appBar.handleSettingsMenuClosed}
          appearenceMenuClosed={props.appBar.handleAppearenceMenuClosed}
          menuAnchorEl={props.appBar.appearenceMenuIconBtnEl!}>
            { props.appearenceMenuChildren }
        </AppearenceSettingsMenu>
      </AppBar>}
      afterHeaderClassName="trmrk-app-module-header-toggle trmrk-icon-btn"
      afterHeaderContent={ props.appBar.showAppBarToggleBtn ? <ToggleAppBarBtn showAppBar={props.appBar.showAppBar} appBarToggled={props.appBar.appBarToggled} /> : null }
      bodyClassName={props.bodyClassName}
      showHeader={props.appBar.showAppBar}
      headerHeight={props.appBar.appHeaderHeight}
      pinHeader={!props.appBar.isCompactMode}
      isDarkMode={props.appBar.isDarkMode}
      isCompactMode={props.appBar.isCompactMode}
      lastRefreshTmStmp={props.appBar.lastRefreshTmStmp}
      scrollableX={props.bodyScrollableX ?? props.appBar.isCompactMode}
      scrollableY={props.bodyScrollableY ?? props.appBar.isCompactMode}
      scrolling={props.appBar.appHeaderScrolling}
      bodyContent={props.children} />);
}
