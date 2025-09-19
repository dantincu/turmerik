import { Component, Inject, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../trmrk/core';

import { TrmrkDialog } from '../../../../trmrk-angular/components/common/trmrk-dialog/trmrk-dialog';
import { ModalService } from '../../../../trmrk-angular/services/common/modal-service';
import { ModalServiceFactory } from '../../../../trmrk-angular/services/common/modal-service-factory';

import {
  TrmrkDialogData,
  mergeDialogData,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { TrmrkLoading } from '../../../../trmrk-angular/components/common/trmrk-loading/trmrk-loading';

import { AppStateService } from '../../../services/app-state-service';

@Component({
  selector: 'trmrk-app-setup-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkLoading,
  ],
  templateUrl: './trmrk-app-setup-modal.html',
  styleUrl: './trmrk-app-setup-modal.scss',
})
export class TrmrkAppSetupModal implements OnDestroy {
  mergeDialogData = mergeDialogData;
  modalService: ModalService;

  isLoading: boolean | null = null;
  showSuccessMessage = 0;
  showErrorMessage = 0;
  errorMessage: string | NullOrUndef;
  loadingFinished: boolean | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<any>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateService,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef
  ) {
    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
    });
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      this.isLoading = true;
    });
  }

  ngOnDestroy(): void {
    this.modalService.destroy();
  }
}
