import { Component, Inject, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../../trmrk/core';
import { getIDbRequestOpenErrorMsg } from '../../../../../trmrk-browser/indexedDB/core';

import { ModalService } from '../../../../services/common/modal-service';
import { ModalServiceFactory } from '../../../../services/common/modal-service-factory';
import { AppStateServiceBase } from '../../../../services/common/app-state-service-base';
import { TrmrkDialog } from '../../../common/trmrk-dialog/trmrk-dialog';
import { TrmrkDialogData, mergeDialogData } from '../../../../services/common/trmrk-dialog';
import { ResetAppService } from '../../../../services/pages/reset-app-service/reset-app-service';
import { TrmrkLoading } from '../../../common/trmrk-loading/trmrk-loading';

@Component({
  selector: 'trmrk-reset-app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkLoading,
  ],
  templateUrl: './trmrk-reset-app-dialog.html',
  styleUrl: './trmrk-reset-app-dialog.scss',
})
export class TrmrkResetAppDialog implements AfterViewInit, OnDestroy {
  mergeDialogData = mergeDialogData;

  isResetting: boolean | null = null;
  showSuccessMessage = 0;
  showErrorMessage = 0;
  errorMessage: string | NullOrUndef;
  resetFinished: boolean | null = null;

  private modalService: ModalService;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<any>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private resetAppService: ResetAppService,
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
      this.isResetting = true;

      try {
        await this.resetAppService.resetApp(this.appStateService.dbObjNamePrefix);
        this.showSuccessMessage++;
      } catch (err) {
        this.showErrorMessage++;
        this.errorMessage = getIDbRequestOpenErrorMsg(err as DOMException);
      }

      this.isResetting = false;
      this.resetFinished = true;
    });
  }

  ngOnDestroy(): void {
    this.modalService.destroy();
  }

  okClick() {
    this.dialogRef.close();
  }
}
