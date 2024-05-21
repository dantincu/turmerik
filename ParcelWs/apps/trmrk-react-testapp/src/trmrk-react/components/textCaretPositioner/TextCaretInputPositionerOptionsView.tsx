import React from "react";

import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export interface TextCaretInputPositionerOptionsViewProps {
  pinnedToBottomToggled: ((pinnedToBottom: boolean) => void);
  pinnedToBottom: boolean;
}

export default function TextCaretInputPositionerOptionsView(
  props: TextCaretInputPositionerOptionsViewProps
) {
  const [ pinnedToBottom, setPinnedToBottom ] = React.useState(props.pinnedToBottom);

  const pinnedToBottomToggled = React.useCallback(() => {
    props.pinnedToBottomToggled(!props.pinnedToBottom);
  }, [pinnedToBottom]);

  React.useEffect(() => {
    if (props.pinnedToBottom !== pinnedToBottom) {
      setPinnedToBottom(props.pinnedToBottom);
    }
  }, [
    props.pinnedToBottom,
    props.pinnedToBottomToggled,
    pinnedToBottom]);

  return (<div className="trmrk-view trmrk-options-view">
    <IconButton className="trmrk-icon-btn trmrk-toggle-pin-to-bottom-btn"
      onMouseDown={pinnedToBottomToggled}
      onTouchEnd={pinnedToBottomToggled}>
      { props.pinnedToBottom ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon /> }
    </IconButton>
  </div>);
}
