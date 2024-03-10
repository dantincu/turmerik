import React from "react";

import Menu from "@mui/material/Menu";

import SettingsMenuList from "./SettingsMenuList";

export interface SettingsMenuProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showMenu: boolean;
  menuClosed: () => void;
  appearenceMenuOpen: () => void;
  appearenceMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
}

export default function SettingsMenu(
  props: SettingsMenuProps
) {
  React.useEffect(() => {
  }, [ props.showMenu, props.menuAnchorEl ]);

  return (<Menu className={[ props.className ?? "" ].join(" ")}
    open={props.showMenu}
    onClose={props.menuClosed}
    anchorEl={props.menuAnchorEl}>
      <SettingsMenuList
        className={props.menuListClassName}
        appearenceMenuOpen={props.appearenceMenuOpen}
        appearenceMenuBtnRefAvailable={props.appearenceMenuBtnRefAvailable}>
          { props.children }
        </SettingsMenuList>
    </Menu>);
}
