import React from "react";

import Modal from '@mui/material/Modal';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "../../../trmrk";
import { getAppTheme } from "../../app-theme/core";

import TrmrkTextCaretPositioner, { TrmrkTextCaretPositionerProps } from "./TrmrkTextCaretPositioner";

export interface TrmrkTextCaretPositionerModalProps {
  positioner: TrmrkTextCaretPositionerProps;
  popoverClassName?: string | null | undefined;
  isDarkMode: boolean;
  isOpen: boolean;
  handleClose: () => void;
}

export default function TrmrkTextCaretPositionerModal(
  props: TrmrkTextCaretPositionerModalProps
) {
  const appThemeClassName = getAppTheme({
    isDarkMode: props.isDarkMode,
  }).cssClassName;

  React.useEffect(() => {
  }, [
    props.positioner,
    props.popoverClassName,
    props.isDarkMode,
    props.isOpen,
   ]);

  return (<Modal
      className={[
        "trmrk-text-caret-positioner-modal",
        props.positioner.textIsReadonly ? "trmrk-text-is-readonly" : "",
        props.positioner.textIsMultiline ? "trmrk-text-is-multiline" : "",
        appThemeClassName,
        props.popoverClassName ?? ""].join(" ")}
      open={props.isOpen}
      onClose={props.handleClose}>
    <DialogContent className="trmrk-dialog-content">
      <TrmrkTextCaretPositioner {...props.positioner} />
    </DialogContent>
  </Modal>);
}
