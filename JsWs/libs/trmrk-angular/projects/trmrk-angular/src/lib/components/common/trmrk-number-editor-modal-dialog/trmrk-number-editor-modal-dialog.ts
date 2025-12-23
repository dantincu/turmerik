import { Component, Inject, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { VoidOrAny, ValidationResult } from '../../../../trmrk/core';
import { getVarName } from '../../../../trmrk/Reflection/core';

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
  TrmrkNumberEditor,
  TrmrkNumberInputValue,
  TrmrkNumberEditorOpts,
} from '../trmrk-number-editor/trmrk-number-editor';

export interface TrmrkNumberEditorModalDialogData
  extends TrmrkDialogComponentDataCore,
    TrmrkNumberEditorOpts {
  valueSubmitted: (value: TrmrkNumberInputValue) => VoidOrAny;
}

@Component({
  selector: 'trmrk-number-editor-modal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkHorizStrip,
    TrmrkNumberEditor,
  ],
  templateUrl: './trmrk-number-editor-modal-dialog.html',
  styleUrls: ['./trmrk-number-editor-modal-dialog.scss'],
})
export class TrmrkNumberEditorModalDialog implements OnDestroy {
  mergeDialogData = mergeDialogData;
  modalId: number;
  dialogData: TrmrkNumberEditorModalDialogData;

  validationResult: ValidationResult = {};

  @ViewChild('numberEditor', { read: TrmrkNumberEditor }) numberEditor!: TrmrkNumberEditor;

  focusInput = 0;

  private modalService: ModalService;
  private modalOpenedSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkNumberEditorModalDialogData>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private appService: AppServiceBase,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef
  ) {
    this.dialogData = data.data;

    this.modalOpenedSubscription = dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.focusInput++;
      });
    });

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
    this.modalOpenedSubscription.unsubscribe();
    this.modalService.dispose();
  }

  doneClick() {
    this.numberEditor.updateValidation();

    if (!this.validationResult.hasError) {
      this.data.data.valueSubmitted({
        text: this.numberEditor.value.text!.replace(' ', ''),
        number: this.numberEditor.value.number,
      });

      this.appService.closeModal(this.modalId);
    }
  }

  validationResultChanged(result: ValidationResult) {
    setTimeout(() => {
      this.validationResult = result;
    });
  }
}
