import React from "react";
import { Link } from "react-router-dom";

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import FloatingTopBarModule from "../floatingTopBarModule/FloatingTopBarModule";

import ToggleAppBarBtn from "../appBar/ToggleAppBarBtn";
import SettingsMenu from "../settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../settingsMenu/AppearenceSettingsMenu";
import OptionsMenu from "../settingsMenu/OptionsMenu";
import { UseAppBarResult } from "../../hooks/useAppBar/useAppBar";

export interface FloatingTopBarAppModuleProps {
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
  optionsMenuClassName?: string | null | undefined;
  optionsMenuListClassName?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appBarChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  settingsMenuChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appearenceMenuChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  optionsMenuChildren?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  refreshBtnClicked?: (() => boolean | null | undefined | void);
}

export default function FloatingTopBarAppModule(
  props: FloatingTopBarAppModuleProps
) {
  const refreshBtnClicked = () => {
    if (props.refreshBtnClicked) {
      if (!props.refreshBtnClicked()) {
        props.appBar.handleOptionsMenuClosed();
      }
    } else {
      props.appBar.handleOptionsMenuClosed();
    }
  }

  return (<FloatingTopBarModule
      className={props.className}
      headerClassName={props.headerClassName}
      headerContent={<AppBar className={["trmrk-ftb-module-bar", props.appBarClassName ?? ""].join(" ")}>
        <IconButton onClick={props.appBar.handleSettingsClick} className="trmrk-icon-btn trmrk-settings-btn"><MenuIcon /></IconButton>
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn trmrk-home-btn"><HomeIcon /></IconButton></Link>
        { props.appBar.showOptionsMenuBtn ? <IconButton
          onClick={props.appBar.handleOptionsClick}
          className="trmrk-icon-btn trmrk-options-btn">
            <MoreHorizIcon /></IconButton> : null }
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
        <OptionsMenu
          className={props.optionsMenuClassName}
          menuListClassName={props.optionsMenuListClassName}
          appTheme={props.appBar.appTheme}
          showMenu={props.appBar.optionsMenuIsOpen}
          menuClosed={props.appBar.handleOptionsMenuClosed}
          menuAnchorEl={props.appBar.optionsMenuIconBtnEl!}
          refreshBtnClicked={refreshBtnClicked} />
      </AppBar>}
      afterHeaderClassName="trmrk-ftb-module-header-toggle trmrk-icon-btn"
      afterHeaderContent={ props.appBar.showAppBarToggleBtn ? <ToggleAppBarBtn
        showAppBar={props.appBar.showAppBar}
        appBarToggled={props.appBar.appBarToggled} /> : null }
      bodyClassName={props.bodyClassName}
      showHeader={props.appBar.showAppBar}
      headerHeight={props.appBar.appHeaderHeight}
      pinHeader={!props.appBar.isCompactMode}
      isDarkMode={props.appBar.isDarkMode}
      isCompactMode={props.appBar.isCompactMode}
      topBarRefreshReqsCount={props.appBar.appBarRefreshReqsCount}
      scrollableX={props.bodyScrollableX ?? props.appBar.isCompactMode}
      scrollableY={props.bodyScrollableY ?? props.appBar.isCompactMode}
      scrolling={props.appBar.appHeaderScrolling}
      bodyContent={props.children} />);
}
