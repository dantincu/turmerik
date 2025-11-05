import { Component, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { NullOrUndef } from '../../../../../trmrk/core';
import { getVarName } from '../../../../../trmrk/Reflection/core';
import { TrmrkDialog } from '../../../../../trmrk-angular/components/common/trmrk-dialog/trmrk-dialog';
import { ModalService } from '../../../../../trmrk-angular/services/common/modal-service';
import { AppServiceBase } from '../../../../../trmrk-angular/services/common/app-service-base';
import { ModalServiceFactory } from '../../../../../trmrk-angular/services/common/modal-service-factory';
import { TrmrkObservable } from '../../../../../trmrk-angular/services/common/TrmrkObservable';
import { TimeStampGeneratorBase } from '../../../../../trmrk-angular/services/common/timestamp-generator-base';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../../../trmrk-angular/services/common/trmrk-dialog';

import { AppService } from '../../../../services/common/app-service';

export interface TrmrkInfiniteHeightPanelTestPageParams {
  startIdx: number;
  itemsCount: number;
  totalItemsCount: number;
}

export interface TrmrkParamsSetupModalComponentData extends TrmrkDialogComponentDataCore {
  params: TrmrkInfiniteHeightPanelTestPageParams;
  newParams: (params: TrmrkInfiniteHeightPanelTestPageParams) => void;
}

@Component({
  selector: 'trmrk-params-setup-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TrmrkDialog,
  ],
  templateUrl: './trmrk-params-setup-modal.html',
  styleUrl: './trmrk-params-setup-modal.scss',
})
export class TrmrkParamsSetupModal {
  mergeDialogData = mergeDialogData;
  modalService: ModalService;
  modalId: number;
  params: TrmrkInfiniteHeightPanelTestPageParams;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkParamsSetupModalComponentData>,
    public dialogRef: MatDialogRef<any>,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef,
    private timeStampGenerator: TimeStampGeneratorBase,
    @Inject(AppServiceBase) private appService: AppService
  ) {
    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkParamsSetupModal),
      data: this.data.data,
      dialogRef,
    });

    this.modalId = this.modalService.modalId;
    this.params = { ...this.data.data.params };
  }

  closeModal(applyChanges: boolean = false) {
    if (applyChanges) {
      this.data.data.newParams(this.params);
    }

    this.appService.closeModal(this.modalId);
  }

  startIndexChanged(newValue: string) {
    const parsedValue = parseInt(newValue, 10);
    this.params.startIdx = isNaN(parsedValue) ? 0 : parsedValue;
  }

  itemsCountChanged(newValue: string) {
    const parsedValue = parseInt(newValue, 10);
    this.params.itemsCount = isNaN(parsedValue) ? 0 : parsedValue;
  }

  totalItemsCountChanged(newValue: string) {
    const parsedValue = parseInt(newValue, 10);
    this.params.totalItemsCount = isNaN(parsedValue) ? 0 : parsedValue;
  }
}
