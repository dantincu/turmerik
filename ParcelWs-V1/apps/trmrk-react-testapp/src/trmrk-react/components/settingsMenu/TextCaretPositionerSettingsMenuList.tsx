import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import MatUIIcon from "../icons/MatUIIcon";

export interface TextCaretPositionerSettingsMenuListProps {
  className?: string | null | undefined;
  children?: (React.ReactNode | Iterable<React.ReactNode>) | null | undefined;
  enabled: boolean;
  keepOpen: boolean;
  enabledToggled: (enabled: boolean) => void;
  keepOpenToggled: (keepOpen: boolean) => void;
  textCaretPositionerMenuClosed: () => void;
}

export default function TextCaretPositionerSettingsMenuList(
  props: TextCaretPositionerSettingsMenuListProps
) {
  React.useEffect(() => {
  }, [ props.enabled, props.keepOpen ]);

  return (<MenuList className={[ "trmrk-menu-list", props.className ?? ""].join(" ")}>
    <MenuItem onClick={props.textCaretPositionerMenuClosed}>
      <IconButton className="trmrk-icon-btn">
        <ArrowLeftIcon />
      </IconButton>
    </MenuItem>
    { props.children }
    <MenuItem onClick={() => props.enabledToggled(!props.enabled)}>
      <ListItemIcon className="trmrk-icon-btn">{ props.enabled ? <ToggleOnIcon /> : <ToggleOffIcon /> }</ListItemIcon>
      <ListItemText>{ props.enabled ? "Enabled" : "Disabled" }</ListItemText>
    </MenuItem>
    <MenuItem onClick={() => props.keepOpenToggled(!props.keepOpen)}>
      <ListItemIcon className="trmrk-icon-btn">{ props.keepOpen ? <MatUIIcon iconName="keep" /> : <MatUIIcon iconName="keep_off" /> }</ListItemIcon>
      <ListItemText>{ props.keepOpen ? "Keep Open" : "Auto Closing" }</ListItemText>
    </MenuItem>
  </MenuList>);
}
