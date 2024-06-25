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
  textCaretPositionerMenuOpen: () => void;
  textCaretPositionerOptsMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
}

export default function SettingsMenuList(
  props: SettingsMenuListProps
) {
  const appearenceAnchorEl = React.createRef<HTMLButtonElement>();
  const textCaretPositionerAnchorEl = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    props.appearenceMenuBtnRefAvailable(appearenceAnchorEl.current);
    props.textCaretPositionerOptsMenuBtnRefAvailable(textCaretPositionerAnchorEl.current);
  }, [ appearenceAnchorEl, textCaretPositionerAnchorEl ]);

  return (
    <MenuList className={[ "trmrk-menu-list", props.className ?? ""].join(" ")}>
      { props.children }
      <MenuItem onClick={props.textCaretPositionerMenuOpen}>
        Text Caret Positioner
        <IconButton ref={textCaretPositionerAnchorEl} className="trmrk-icon-btn">
          <ArrowRightIcon />
        </IconButton>
      </MenuItem>
      <MenuItem onClick={props.appearenceMenuOpen}>
        Appearence
        <IconButton ref={appearenceAnchorEl} className="trmrk-icon-btn">
          <ArrowRightIcon />
        </IconButton>
      </MenuItem>
    </MenuList>
  );
}
