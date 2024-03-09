import React from "react";

import Menu from "@mui/material/Menu";

import AppearenceSettingsMenuList from "./AppearenceSettingsMenuList";

export interface AppearenceSettingsMenuProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showAppearenceMenu: boolean;
  isCompactMode: boolean;
  isDarkMode: boolean;
  menuToggled?: ((showMenu: boolean) => void) | null | undefined;
  compactModeToggled: (isCompactMode: boolean) => void;
  darkModeToggled: (isdarkMode: boolean) => void;
}

export default function AppearenceSettingsMenu(
  props: AppearenceSettingsMenuProps
) {
  const menuToggled = () => {
    if (props.menuToggled) {
      props.menuToggled(false);
    }
  }

  React.useEffect(() => {
  }, [ props.isCompactMode, props.isDarkMode, props.showAppearenceMenu, props.menuAnchorEl ]);

  return (<Menu className={[ props.className ?? "" ].join(" ")}
    open={props.showAppearenceMenu}
    onClose={menuToggled}
    anchorEl={props.menuAnchorEl}>
      <AppearenceSettingsMenuList
        className={props.menuListClassName}
        isCompactMode={props.isCompactMode}
        isDarkMode={props.isDarkMode}
        compactModeToggled={props.compactModeToggled}
        darkModeToggled={props.darkModeToggled}>
          { props.children }
        </AppearenceSettingsMenuList>
    </Menu>);
}
