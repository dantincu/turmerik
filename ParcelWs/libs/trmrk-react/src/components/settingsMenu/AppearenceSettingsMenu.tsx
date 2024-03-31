import React from "react";

import Menu from "@mui/material/Menu";

import AppearenceSettingsMenuList from "../settingsMenu/AppearenceSettingsMenuList";

import { AppTheme } from "../../app-theme/core";

export interface AppearenceSettingsMenuProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appTheme: AppTheme;
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showMenu: boolean;
  isCompactMode: boolean;
  isDarkMode: boolean;
  menuClosed: () => void;
  appearenceMenuClosed: () => void;
  compactModeToggled: (isCompactMode: boolean) => void;
  darkModeToggled: (isdarkMode: boolean) => void;
}

export default function AppearenceSettingsMenu(
  props: AppearenceSettingsMenuProps
) {
  React.useEffect(() => {
  }, [ props.isCompactMode, props.isDarkMode, props.showMenu, props.menuAnchorEl ]);

  return (<Menu className={[ "trmrk-menu", props.appTheme.cssClassName, props.className ?? "" ].join(" ")}
    open={props.showMenu}
    onClose={props.menuClosed}
    anchorEl={props.menuAnchorEl}>
      <AppearenceSettingsMenuList
        className={props.menuListClassName}
        isCompactMode={props.isCompactMode}
        isDarkMode={props.isDarkMode}
        appearenceMenuClosed={props.appearenceMenuClosed}
        compactModeToggled={props.compactModeToggled}
        darkModeToggled={props.darkModeToggled}>
          { props.children }
        </AppearenceSettingsMenuList>
    </Menu>);
}
