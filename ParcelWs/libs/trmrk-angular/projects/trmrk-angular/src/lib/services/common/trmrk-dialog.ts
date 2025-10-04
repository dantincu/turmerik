import { TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { getAnchestor } from '../../../trmrk-browser/domUtils/core';

import { NullOrUndef } from '../../../trmrk/core';

export interface TrmrkDialogComponentDataCore {
  modalIdAvailable?: ((modalId: number) => void) | NullOrUndef;
}

export interface TrmrkDialogDataCore {
  disableClose?: boolean | NullOrUndef;
  dialogRef?: MatDialogRef<any> | NullOrUndef;
  contentTemplate?: TemplateRef<any> | NullOrUndef;
  actionsTemplate?: TemplateRef<any> | NullOrUndef;
  useMatDialogComponents?: boolean | NullOrUndef;
  showOptionsBtn?: boolean | NullOrUndef;
  showOptionsMenuTopStrip?: boolean | NullOrUndef;
  optionsMenuTopStripTemplate?: TemplateRef<any> | NullOrUndef;
  showManageTabsOptionsMenuBtn?: boolean | NullOrUndef;
  optionsMenuTemplate?: TemplateRef<any> | NullOrUndef;
}

export interface TrmrkDialogData<TData extends TrmrkDialogComponentDataCore>
  extends TrmrkDialogDataCore {
  title?: string | NullOrUndef;
  data: TData;
}

export enum DialogPanelSize {
  Default = 0,
  Large,
  Stretch,
}

export interface OpenDialogArgs<TData extends TrmrkDialogComponentDataCore> {
  matDialog: MatDialog;
  dialogComponent: any;
  data: TrmrkDialogData<TData>;
  clickEvent?: Event | NullOrUndef;
  dialogPanelSize?: DialogPanelSize | NullOrUndef;
}

export const mergeDialogData = <TData extends TrmrkDialogComponentDataCore>(
  data: TrmrkDialogData<TData>,
  newData: TrmrkDialogData<TData> | TrmrkDialogDataCore
) => ({
  ...data,
  ...newData,
});

export const getDialogPanelSizeCssClass = (dialogPanelSize: DialogPanelSize | NullOrUndef) => {
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

export const openDialog = <TData extends TrmrkDialogComponentDataCore>(
  args: OpenDialogArgs<TData>
) => {
  if (args.clickEvent) {
    const target = (args.clickEvent.target as HTMLElement)!;
    target.blur();
    target.parentElement!.blur();
  }

  args.matDialog.open(args.dialogComponent, {
    panelClass: ['trmrk-mat-dialog-panel', getDialogPanelSizeCssClass(args.dialogPanelSize)],
    disableClose: true,
    data: args.data,
  });
};

export const updateModalVisibility = (modalHostEl: HTMLElement, show: boolean) => {
  const modalBackDrop = getAnchestor(modalHostEl, (prElem) =>
    prElem.classList.contains('cdk-overlay-container')
  );

  if (modalBackDrop) {
    if (show) {
      modalBackDrop.classList.remove('trmrk-hidden');
    } else {
      modalBackDrop.classList.add('trmrk-hidden');
    }
  }
};
