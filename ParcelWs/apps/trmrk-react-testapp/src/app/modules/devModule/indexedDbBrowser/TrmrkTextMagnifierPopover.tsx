import React from "react";

import Popover, { PopoverOrigin } from '@mui/material/Popover';
import IconButton from "@mui/material/IconButton";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import TrmrkEditableTextLineMagnifier from "./TrmrkEditableTextLineMagnifier";
import TrmrkEditableMultilineTextMagnifier from "./TrmrkEditableMultilineTextMagnifier";
import TrmrkReadonlyTextLineMagnifier from "./TrmrkReadonlyTextLineMagnifier";
import TrmrkReadonlyMultilineTextMagnifier from "./TrmrkReadonlyMultilineTextMagnifier";

import { getAppTheme } from "../../../../trmrk-react/app-theme/core";

export interface TrmrkBoxMagnifierPopoverProps {
  popoverClassName?: string | null | undefined;
  textIsReadonly?: boolean | null | undefined;
  textIsMultiline?: boolean | null | undefined;
  isFullViewPort?: boolean | null | undefined;
  isDarkMode: boolean;
  text: string;
  isOpen: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement;
  anchorOrigin?: PopoverOrigin | null | undefined;
}

export default function TrmrkTextMagnifierPopover(
  props: TrmrkBoxMagnifierPopoverProps
) {
  const [ isFullViewPort, setIsFullViewPort ] = React.useState(
    props.isFullViewPort ?? props.textIsMultiline ?? false);

  const appThemeClassName = getAppTheme({
    isDarkMode: props.isDarkMode,
  }).cssClassName;

  const toggleFullViewPort = React.useCallback(() => {
    setIsFullViewPort(!isFullViewPort);
  }, [ isFullViewPort ]);

  React.useEffect(() => {
  }, [
    props.isDarkMode,
    props.text,
    props.isOpen,
    props.anchorEl,
    props.textIsReadonly,
    props.textIsMultiline,
    props.isFullViewPort,
    isFullViewPort
   ]);

  return (<Popover
      className={[
        "trmrk-text-magnifier-popover",
        props.textIsReadonly ? "trmrk-text-is-readonly" : "",
        props.textIsMultiline ? "trmrk-text-is-multiline" : "",
        appThemeClassName,
        props.popoverClassName ?? ""].join(" ")}
      open={props.isOpen}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={props.anchorOrigin ?? undefined}>
    <IconButton className="trmrk-toggle-full-view-port-btn" onClick={toggleFullViewPort}>{ isFullViewPort ? <CloseFullscreenIcon /> : <OpenInFullIcon /> }</IconButton>
    { props.textIsReadonly ? props.textIsMultiline ? <TrmrkReadonlyMultilineTextMagnifier
      text={props.text} /> : <TrmrkReadonlyTextLineMagnifier
      text={props.text} /> : props.textIsMultiline ? <TrmrkEditableMultilineTextMagnifier
      text={props.text} /> : <TrmrkEditableTextLineMagnifier
      text={props.text} /> }
  </Popover>);
}
