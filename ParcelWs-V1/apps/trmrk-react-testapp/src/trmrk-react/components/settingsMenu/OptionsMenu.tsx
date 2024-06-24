import React from "react";

import Menu from "@mui/material/Menu";

import OptionsMenuList from "./OptionsMenuList";

import { AppTheme } from "../../app-theme/core";

export interface SettingsMenuProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appTheme: AppTheme;
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showMenu: boolean;
  refreshBtnClicked: (() => void);
  menuClosed: () => void;
}

export default function OptionsMenu(
  props: SettingsMenuProps
) {
  React.useEffect(() => {
  }, [ props.showMenu, props.menuAnchorEl ]);

  return (
      <Menu className={[ "trmrk-menu", props.appTheme.cssClassName, props.className ?? "" ].join(" ")}
        open={props.showMenu}
        onClose={props.menuClosed}
        anchorEl={props.menuAnchorEl}>
          <OptionsMenuList
            className={props.menuListClassName}
            refreshBtnClicked={props.refreshBtnClicked}>
              { props.children }
            </OptionsMenuList>
      </Menu>
    );
}
