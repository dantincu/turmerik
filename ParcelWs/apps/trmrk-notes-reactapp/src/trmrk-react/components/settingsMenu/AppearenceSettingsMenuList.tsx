import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

export interface AppearenceSettingsMenuListProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  isCompactMode: boolean;
  isDarkMode: boolean;
  compactModeToggled: (isCompactMode: boolean) => void;
  darkModeToggled: (isdarkMode: boolean) => void;
  appearenceMenuClosed: () => void;
}

import ToggleAppModeBtn from "./ToggleAppModeBtn";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";

export default function AppearenceSettingsMenuList(
  props: AppearenceSettingsMenuListProps
) {
  React.useEffect(() => {
  }, [ props.isCompactMode, props.isDarkMode ]);

  return (<MenuList className={[ "trmrk-menu-list", props.className ?? ""].join(" ")}>
    <MenuItem onClick={props.appearenceMenuClosed}>
      <IconButton className="trmrk-icon-btn">
        <ArrowLeftIcon />
      </IconButton>
    </MenuItem>
    { props.children }
    <ToggleAppModeBtn isCompactMode={props.isCompactMode} compactModeToggled={props.compactModeToggled} />
    <ToggleDarkModeBtn isDarkMode={props.isDarkMode} darkModeToggled={props.darkModeToggled} />
  </MenuList>);
}
