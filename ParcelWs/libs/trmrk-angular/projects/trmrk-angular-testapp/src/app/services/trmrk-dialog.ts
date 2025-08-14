import { TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { NullOrUndef } from '../../trmrk/core';

export interface TrmrkDialogData<TData> {
  title: string;
  disableClose?: boolean | NullOrUndef;
  data: TData;
  dialogRef?: MatDialogRef<any> | NullOrUndef;
  contentTemplate?: TemplateRef<any> | NullOrUndef;
  actionsTemplate?: TemplateRef<any> | NullOrUndef;
  useMatDialogComponents?: boolean | NullOrUndef;
}

export enum DialogPanelSize {
  Default = 0,
  Large,
  Stretch,
}

export interface OpenDialogArgs<TData> {
  matDialog: MatDialog;
  dialogComponent: any;
  data: TrmrkDialogData<TData>;
  clickEvent?: Event | NullOrUndef;
  dialogPanelSize?: DialogPanelSize | NullOrUndef;
}

export const getDialogPanelSizeCssClass = (
  dialogPanelSize: DialogPanelSize | NullOrUndef
) => {
  if ((dialogPanelSize ?? null) !== null) {
    switch (dialogPanelSize) {
      case DialogPanelSize.Large:
        return 'trmrk-width-lg';
      case DialogPanelSize.Stretch:
        return 'trmrk-width-stretch';
      default:
        return '';
    }
  } else {
    return '';
  }
};

export const openDialog = <TData>(args: OpenDialogArgs<TData>) => {
  if (args.clickEvent) {
    const target = (args.clickEvent.target as HTMLElement)!;
    target.blur();
    target.parentElement!.blur();
  }

  args.matDialog.open(args.dialogComponent, {
    panelClass: [
      'trmrk-mat-dialog-panel',
      getDialogPanelSizeCssClass(args.dialogPanelSize),
    ],
    disableClose: args.data.disableClose ?? undefined,
    data: args.data,
  });
};
