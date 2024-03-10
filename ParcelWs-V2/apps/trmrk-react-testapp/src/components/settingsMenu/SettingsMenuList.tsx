import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export interface SettingsMenuListProps {
  className?: string | null | undefined,
  children: React.ReactNode | Iterable<React.ReactNode>
  appearenceMenuOpen: () => void;
  appearenceMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
}

export default function SettingsMenuList(
  props: SettingsMenuListProps
) {
  const appearenceAnchorEl = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    props.appearenceMenuBtnRefAvailable(appearenceAnchorEl.current);
  }, [ appearenceAnchorEl ]);

  return (<MenuList className={[props.className ?? ""].join(" ")}>
    { props.children }
    <MenuItem dense onClick={props.appearenceMenuOpen}>
      Appearence
      <IconButton ref={appearenceAnchorEl}>
        <ArrowRightIcon />
      </IconButton>
    </MenuItem>
  </MenuList>);
}
