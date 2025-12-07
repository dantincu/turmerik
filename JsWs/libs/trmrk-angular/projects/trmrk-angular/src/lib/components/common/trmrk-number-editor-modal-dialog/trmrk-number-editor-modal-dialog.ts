import { Component, Inject, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';

import { getVarName } from '../../../../trmrk/Reflection/core';
import { TrmrkNumberEditor } from '../trmrk-number-editor/trmrk-number-editor';
import { ModalService } from '../../../services/common/modal-service';
import { ModalServiceFactory } from '../../../services/common/modal-service-factory';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { AppServiceBase } from '../../../services/common/app-service-base';
import { TrmrkDialog } from '../trmrk-dialog/trmrk-dialog';
import { TrmrkNumberInputValue } from '../trmrk-number-editor/trmrk-number-editor';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../services/common/trmrk-dialog';

export interface TrmrkNumberEditorModalDialogData extends TrmrkDialogComponentDataCore {
  value: TrmrkNumberInputValue;
  valueSubmitted: (value: TrmrkNumberInputValue) => VoidOrAny;
  min?: number | NullOrUndef;
  max?: number | NullOrUndef;
  step?: number | NullOrUndef;
  required?: boolean | NullOrUndef;
}

@Component({
  selector: 'trmrk-number-editor-modal-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkNumberEditor,
  ],
  templateUrl: './trmrk-number-editor-modal-dialog.html',
  styleUrl: './trmrk-number-editor-modal-dialog.scss',
})
export class TrmrkNumberEditorModalDialog implements OnDestroy {
  mergeDialogData = mergeDialogData;
  modalId: number;

  hasError = false;
  errorMessage = '';

  private modalService: ModalService;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkNumberEditorModalDialogData>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private appService: AppServiceBase,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef
  ) {
    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkNumberEditorModalDialog),
      data: this.data.data,
      dialogRef,
    });

    this.modalId = this.modalService.modalId;
  }

  ngOnDestroy(): void {
    this.modalService.dispose();
  }

  okClick() {
    this.data.data.valueSubmitted(this.data.data.value);
    this.appService.closeModal(this.modalId);
  }

  cancelClick() {
    this.appService.closeModal(this.modalId);
  }
}
