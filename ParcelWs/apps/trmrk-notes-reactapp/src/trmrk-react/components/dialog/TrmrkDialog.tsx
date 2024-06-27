import React from "react";

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export interface TrmrkDialogProps {
  isCompactMode: boolean;
  appThemeCssClass: string;
  dialogTitleCssClass?: string | null | undefined;
  dialogContentCssClass?: string | null | undefined;
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
    props.isCompactMode,
    props.appThemeCssClass,
    props.dialogTitleCssClass,
    props.dialogContentCssClass,
    props.onClose,
    props.title,
    props.open,
    props.children
  ]);

  return (<Dialog onClose={handleClose} open={props.open} fullWidth maxWidth={false} fullScreen={props.isCompactMode}>
    <DialogTitle component={"div"}
      className={["trmrk-dialog-title",
        props.appThemeCssClass,
        props.dialogTitleCssClass ?? ""].join(" ")}>
        <span className="trmrk-title">{props.title}</span>
        <IconButton onClick={handleUserClose} className="trmrk-icon-btn trmrk-close-icon-btn"><CloseIcon /></IconButton></DialogTitle>
    <DialogContent
      className={["trmrk-dialog-content trmrk-current-tabs-dialog-content trmrk-scrollable trmrk-scrollableY",
      props.appThemeCssClass,
      props.dialogContentCssClass ?? ""].join(" ")}>
      { props.children }
    </DialogContent>
  </Dialog>);
}
