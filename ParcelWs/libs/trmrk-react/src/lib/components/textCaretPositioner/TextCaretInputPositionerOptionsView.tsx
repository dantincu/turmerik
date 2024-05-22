import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export interface TextCaretInputPositionerOptionsViewProps {
  pinnedToBottom: boolean;
  minimizeClicked: () => void;
  pinnedToBottomToggled: ((pinnedToBottom: boolean) => void);
}

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const [ pinnedToBottom, setPinnedToBottom ] = React.useState(props.pinnedToBottom);

  const minimizeClicked = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.minimizeClicked();
    }
  }, []);

  const pinnedToBottomToggled = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (((e as React.MouseEvent).button ?? 0) === 0) {
      props.pinnedToBottomToggled(!props.pinnedToBottom);
    }
  }, [pinnedToBottom]);

  React.useEffect(() => {
    if (props.pinnedToBottom !== pinnedToBottom) {
      setPinnedToBottom(props.pinnedToBottom);
    }
  }, [
    props.pinnedToBottom,
    pinnedToBottom]);

  return (<div className="trmrk-view trmrk-anchor-right trmrk-options-view">
    <IconButton disableRipple className="trmrk-icon-btn"
        onMouseDown={minimizeClicked}
        onTouchEnd={minimizeClicked}>
      <KeyboardDoubleArrowRightIcon />
    </IconButton>
    <IconButton disableRipple
      className="trmrk-icon-btn trmrk-toggle-pin-to-bottom-btn"
      onMouseDown={pinnedToBottomToggled}
      onTouchEnd={pinnedToBottomToggled}>
      { props.pinnedToBottom ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>
  </div>);
}
