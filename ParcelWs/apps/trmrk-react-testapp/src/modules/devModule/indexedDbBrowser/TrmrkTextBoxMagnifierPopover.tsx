import React from "react";

import Popover, { PopoverOrigin } from '@mui/material/Popover';

import TrmrkEditableTextBoxMagnifier from "./TrmrkEditableTextBoxMagnifier";
import TrmrkReadonlyTextBoxMagnifier from "./TrmrkReadonlyTextBoxMagnifier";
import { getAppTheme } from "trmrk-react/src/app-theme/core";

export interface TrmrkTextBoxMagnifierPopoverProps {
  popoverClassName?: string | null | undefined;
  textBoxIsReadonly?: boolean | null | undefined;
  isDarkMode: boolean;
  text: string;
  isOpen: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement;
  anchorOrigin?: PopoverOrigin | null | undefined;
}

export default function TrmrkTextBoxMagnifierPopover(
  props: TrmrkTextBoxMagnifierPopoverProps
) {
  const appThemeClassName = getAppTheme({
    isDarkMode: props.isDarkMode,
  }).cssClassName;

  React.useEffect(() => {
  }, [
    props.isDarkMode,
    props.text,
    props.isOpen,
    props.anchorEl
   ]);

  return (<Popover
      className={[
        "trmrk-textbox-magnifier-popover",
        props.textBoxIsReadonly ? "trmrk-textbox-is-readonly" : "",
        appThemeClassName,
        props.popoverClassName ?? ""].join(" ")}
      open={props.isOpen}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={props.anchorOrigin ?? undefined}>
    { props.textBoxIsReadonly ? <TrmrkReadonlyTextBoxMagnifier
      text={props.text} /> : <TrmrkEditableTextBoxMagnifier
      text={props.text} /> }
  </Popover>);
}
