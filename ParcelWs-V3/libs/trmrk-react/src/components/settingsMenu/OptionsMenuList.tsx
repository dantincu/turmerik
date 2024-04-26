import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

export interface SettingsMenuListProps {
  className?: string | null | undefined,
  children: React.ReactNode | Iterable<React.ReactNode>
  refreshBtnIsVisible?: boolean | null | undefined;
  refreshBtnClicked: (() => void);
}

export default function SettingsMenuList(
  props: SettingsMenuListProps
) {
  React.useEffect(() => {
  }, [ props.refreshBtnIsVisible ]);

  return (
    <MenuList className={[ "trmrk-menu-list", props.className ?? ""].join(" ")}>
      { props.refreshBtnIsVisible !== false ? <MenuItem onClick={props.refreshBtnClicked}>
        Refresh
        <IconButton className="trmrk-icon-btn">
          <RefreshIcon />
        </IconButton>
      </MenuItem> : null }
      { props.children }
    </MenuList>
  );
}
