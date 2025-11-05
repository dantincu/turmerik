import { Component, Inject, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../../trmrk/core';
import { getVarName } from '../../../../../trmrk/Reflection/core';
import { TrmrkDialog } from '../../../../../trmrk-angular/components/common/trmrk-dialog/trmrk-dialog';
import { ModalService } from '../../../../../trmrk-angular/services/common/modal-service';
import { ModalServiceFactory } from '../../../../../trmrk-angular/services/common/modal-service-factory';
import { TrmrkObservable } from '../../../../../trmrk-angular/services/common/TrmrkObservable';
import { TimeStampGeneratorBase } from '../../../../../trmrk-angular/services/common/timestamp-generator-base';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../../../trmrk-angular/services/common/trmrk-dialog';

export interface TrmrkInfiniteHeightPanelTestPageParams {
  startIdx: number;
  itemCount: number;
  totalItemCount: number;
}

export interface TrmrkParamsSetupModalComponentData extends TrmrkDialogComponentDataCore {
  newParams: (params: TrmrkInfiniteHeightPanelTestPageParams) => void;
}

@Component({
  selector: 'trmrk-params-setup-modal',
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, TrmrkDialog],
  templateUrl: './trmrk-params-setup-modal.html',
  styleUrl: './trmrk-params-setup-modal.scss',
})
export class TrmrkParamsSetupModal {
  mergeDialogData = mergeDialogData;
  modalService: ModalService;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkParamsSetupModalComponentData>,
    public dialogRef: MatDialogRef<any>,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef,
    private timeStampGenerator: TimeStampGeneratorBase
  ) {
    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkParamsSetupModal),
      data: this.data.data,
      dialogRef,
    });
  }
}
