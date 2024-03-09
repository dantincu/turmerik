import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export interface SettingsMenuListProps {
  className?: string | null | undefined
}

export default function SettingsMenuList(
  props: SettingsMenuListProps
) {
  return (<MenuList className={[props.className ?? ""].join(" ")}>
    <MenuItem>
      Appearence
      <IconButton>
        <ArrowRightIcon />
      </IconButton>
    </MenuItem>
  </MenuList>);
}
