import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export interface SettingsMenuListProps {
  className?: string | null | undefined,
  children: React.ReactNode | Iterable<React.ReactNode>
  showAppearenceMenu: boolean,
  appearenceMenuToggled: (showAppearenceMenu: boolean) => void;
  appearenceMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
}

export default function SettingsMenuList(
  props: SettingsMenuListProps
) {
  const appearenceAnchorEl = React.createRef<HTMLButtonElement>();

  const handleClick = () => {
    props.appearenceMenuToggled(!props.showAppearenceMenu);
  }

  React.useEffect(() => {
    props.appearenceMenuBtnRefAvailable(appearenceAnchorEl.current);
  }, [ props.showAppearenceMenu, appearenceAnchorEl ]);

  return (<MenuList className={[props.className ?? ""].join(" ")}>
    { props.children }
    <MenuItem onClick={handleClick}>
      Appearence
      <IconButton ref={appearenceAnchorEl}>
        <ArrowRightIcon />
      </IconButton>
    </MenuItem>
  </MenuList>);
}
