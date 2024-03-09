import React from "react";

import Menu from "@mui/material/Menu";

import SettingsMenuList from "./SettingsMenuList";

export interface SettingsMenuProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showMenu: boolean;
  showAppearenceMenu: boolean;
  menuToggled?: ((showMenu: boolean) => void) | null | undefined;
  appearenceMenuToggled: (showAppearenceMenu: boolean) => void;
  appearenceMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
}

export default function SettingsMenu(
  props: SettingsMenuProps
) {
  const menuToggled = () => {
    if (props.menuToggled) {
      props.menuToggled(false);
    }
  }

  React.useEffect(() => {
  }, [ props.showMenu, props.showAppearenceMenu, props.menuAnchorEl ]);

  return (<Menu className={[ props.className ?? "" ].join(" ")}
    open={props.showMenu}
    onClose={menuToggled}
    anchorEl={props.menuAnchorEl}>
      <SettingsMenuList
        className={props.menuListClassName}
        showAppearenceMenu={props.showAppearenceMenu}
        appearenceMenuToggled={props.appearenceMenuToggled}
        appearenceMenuBtnRefAvailable={props.appearenceMenuBtnRefAvailable}>
          { props.children }
        </SettingsMenuList>
    </Menu>);
}
