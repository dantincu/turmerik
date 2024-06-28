import React from "react";

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Breakpoint } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export interface TrmrkDialogProps {
  appThemeCssClass: string;
  dialogCssClass?: string | null | undefined;
  dialogTitleCssClass?: string | null | undefined;
  dialogContentCssClass?: string | null | undefined;
  fullScreen?: boolean | null | undefined;
  fullWidth?: boolean | null | undefined;
  maxWidth?: false | Breakpoint | null | undefined;
  onClose: (event: {} | React.MouseEvent, reason: "backdropClick" | "escapeKeyDown" | "closedByUser") => void;
  title: string;
  open: boolean;
  children: React.ReactNode;
}

export default function TrmrkDialog(props: TrmrkDialogProps) {
  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    props.onClose(event, reason);
  };

  const handleUserClose = (ev: React.MouseEvent) => {
    props.onClose(ev, "closedByUser");
  }

  React.useEffect(() => {
  }, [
    props.fullScreen,
    props.appThemeCssClass,
    props.dialogTitleCssClass,
    props.dialogContentCssClass,
    props.onClose,
    props.title,
    props.open,
    props.children
  ]);

  return (<Dialog onClose={handleClose} open={props.open}
      fullWidth={props.fullWidth ?? undefined}
      maxWidth={props.maxWidth ?? undefined}
      fullScreen={props.fullScreen ?? undefined}
      className={["trmrk-dialog",
        props.appThemeCssClass,
        props.dialogCssClass ?? ""].join(" ")}>
    <DialogTitle component={"div"}
      className={["trmrk-dialog-title",
        props.dialogTitleCssClass ?? ""].join(" ")}>
        <span className="trmrk-title">{props.title}</span>
        <IconButton onClick={handleUserClose} className="trmrk-icon-btn trmrk-close-icon-btn"><CloseIcon /></IconButton></DialogTitle>
    <DialogContent
      className={["trmrk-dialog-content trmrk-current-tabs-dialog-content trmrk-scrollable trmrk-scrollableY",
      props.dialogContentCssClass ?? ""].join(" ")}>
      { props.children }
    </DialogContent>
  </Dialog>);
}
