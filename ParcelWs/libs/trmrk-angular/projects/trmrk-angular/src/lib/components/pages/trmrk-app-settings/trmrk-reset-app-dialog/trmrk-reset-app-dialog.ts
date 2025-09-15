import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../../trmrk/core';
import { getIDbRequestOpenErrorMsg } from '../../../../../trmrk-browser/indexedDB/core';

import { AppStateServiceBase } from '../../../../services/app-state-service-base';
import { TrmrkDialog } from '../../../common/trmrk-dialog/trmrk-dialog';
import { TrmrkDialogData, mergeDialogData } from '../../../../services/trmrk-dialog';
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
export class TrmrkResetAppDialog implements AfterViewInit {
  mergeDialogData = mergeDialogData;
  isResetting: boolean | null = null;
  showSuccessMessage = 0;
  showErrorMessage = 0;
  errorMessage: string | NullOrUndef;
  resetFinished: boolean | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<any>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private resetAppService: ResetAppService
  ) {}

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

  okClick() {
    this.dialogRef.close();
  }
}
