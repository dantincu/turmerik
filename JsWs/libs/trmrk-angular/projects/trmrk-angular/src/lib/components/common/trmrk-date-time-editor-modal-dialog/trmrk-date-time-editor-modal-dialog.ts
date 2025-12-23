import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { getVarName } from '../../../../trmrk/Reflection/core';
import { VoidOrAny, ValidationResult } from '../../../../trmrk/core';

import { ModalService } from '../../../services/common/modal-service';
import { ModalServiceFactory } from '../../../services/common/modal-service-factory';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { AppServiceBase } from '../../../services/common/app-service-base';
import { TrmrkDialog } from '../trmrk-dialog/trmrk-dialog';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../services/common/trmrk-dialog';

import {
  TrmrkDateTimeEditor,
  TrmrkDateTimeEditorOpts,
  TrmrkDateTimeInputValue,
  defaultValues,
} from '../trmrk-date-time-editor/trmrk-date-time-editor';

export interface TrmrkDateTimeEditorModalDialogData
  extends TrmrkDialogComponentDataCore,
    TrmrkDateTimeEditorOpts {
  valueSubmitted: (value: TrmrkDateTimeInputValue) => VoidOrAny;
}

@Component({
  selector: 'trmrk-date-time-editor-modal-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkHorizStrip,
    TrmrkDateTimeEditor,
  ],
  templateUrl: './trmrk-date-time-editor-modal-dialog.html',
  styleUrl: './trmrk-date-time-editor-modal-dialog.scss',
})
export class TrmrkDateTimeEditorModalDialog {
  mergeDialogData = mergeDialogData;
  modalId: number;
  dialogData: TrmrkDateTimeEditorModalDialogData;

  validationResult: ValidationResult = {};

  @ViewChild('dateTimeEditor', { read: TrmrkDateTimeEditor }) dateTimeEditor!: TrmrkDateTimeEditor;

  private modalService: ModalService;
  private modalOpenedSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkDateTimeEditorModalDialogData>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private appService: AppServiceBase,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef
  ) {
    this.dialogData = data.data;

    this.modalOpenedSubscription = dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.dateTimeEditor.focusInput++;
      });
    });

    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkDateTimeEditorModalDialog),
      data: this.data.data,
      dialogRef,
    });

    this.modalId = this.modalService.modalId;
  }

  ngOnDestroy(): void {
    this.modalOpenedSubscription.unsubscribe();
    this.modalService.dispose();
  }

  doneClick() {
    this.dateTimeEditor.updateValidation();

    if (!this.validationResult.hasError) {
      this.data.data.valueSubmitted(this.dateTimeEditor.value);
      this.appService.closeModal(this.modalId);
    }
  }

  validationResultChanged(result: ValidationResult) {
    setTimeout(() => {
      this.validationResult = result;
    });
  }
}
