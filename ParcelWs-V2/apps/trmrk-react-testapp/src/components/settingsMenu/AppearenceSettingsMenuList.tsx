import React from "react";

import MenuList from "@mui/material/MenuList";

export interface AppearenceSettingsMenuListProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  isCompactMode: boolean;
  isDarkMode: boolean;
  compactModeToggled: (isCompactMode: boolean) => void;
  darkModeToggled: (isdarkMode: boolean) => void;
}

import ToggleAppModeBtn from "./ToggleAppModeBtn";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";

export default function AppearenceSettingsMenuList(
  props: AppearenceSettingsMenuListProps
) {
  React.useEffect(() => {
  }, [ props.isCompactMode, props.isDarkMode ]);

  return (<MenuList className={[props.className ?? ""].join(" ")}>
    { props.className }
    <ToggleAppModeBtn isCompactMode={props.isCompactMode} compactModeToggled={props.compactModeToggled} />
    <ToggleDarkModeBtn isDarkMode={props.isDarkMode} darkModeToggled={props.darkModeToggled} />
  </MenuList>);
}
