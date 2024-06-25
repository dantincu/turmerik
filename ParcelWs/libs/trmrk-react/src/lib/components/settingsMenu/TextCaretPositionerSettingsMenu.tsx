import React from "react";

import Menu from "@mui/material/Menu";

import TextCaretPositionerSettingsMenuList from "./TextCaretPositionerSettingsMenuList";

import { AppTheme } from "../../app-theme/core";

export interface TextCaretPositionerSettingsMenuListProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  appTheme: AppTheme;
  menuAnchorEl: HTMLElement;
  menuListClassName?: string | null | undefined;
  showMenu: boolean;
  enabled: boolean;
  keepOpen: boolean;
  menuClosed: () => void;
  textCaretPositionerMenuClosed: () => void;
  enabledToggled: (isCompactMode: boolean) => void;
  keepOpenToggled: (isdarkMode: boolean) => void;
}

export default function AppearenceSettingsMenu(
  props: TextCaretPositionerSettingsMenuListProps
) {
  React.useEffect(() => {
  }, [ props.enabled, props.keepOpen, props.showMenu, props.menuAnchorEl ]);

  return (<Menu className={[ "trmrk-menu", props.appTheme.cssClassName, props.className ?? "" ].join(" ")}
    open={props.showMenu}
    onClose={props.menuClosed}
    anchorEl={props.menuAnchorEl}>
      <TextCaretPositionerSettingsMenuList
        className={props.menuListClassName}
        enabled={props.enabled}
        keepOpen={props.keepOpen}
        textCaretPositionerMenuClosed={props.textCaretPositionerMenuClosed}
        enabledToggled={props.enabledToggled}
        keepOpenToggled={props.keepOpenToggled}>
          { props.children }
        </TextCaretPositionerSettingsMenuList>
    </Menu>);
}
