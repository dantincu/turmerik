import { Component, Inject, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkDialog } from '../../../../trmrk-angular/components/common/trmrk-dialog/trmrk-dialog';
import { ModalService } from '../../../../trmrk-angular/services/common/modal-service';
import { ModalServiceFactory } from '../../../../trmrk-angular/services/common/modal-service-factory';

import {
  TrmrkDialogData,
  mergeDialogData,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { TrmrkLoading } from '../../../../trmrk-angular/components/common/trmrk-loading/trmrk-loading';
import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';

import { AppStateService } from '../../../services/app-state-service';
import { AppConfig } from '../../../services/app-config';

import {
  AppConfig as AppConfigCore,
  DriveStorageOption,
  DriveStorageType,
} from '../../../../trmrk/driveStorage/appConfig';

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

  cloudStorageOptions: DriveStorageOption[];
  otherStorageOptions: DriveStorageOption[];
  hasCloudStorageOptions: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<any>,
    public dialogRef: MatDialogRef<any>,
    @Inject(AppStateServiceBase) private appStateService: AppStateService,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef,
    @Inject(injectionTokens.appConfig.token) appConfig: AppConfig
  ) {
    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      onCloseModal: () => this.dialogRef.close(),
      data: this.data.data,
    });

    const driveStorageOptions = appConfig.driveStorageOptions.filter(
      (option) => option.isEnabled ?? true
    );

    this.cloudStorageOptions = driveStorageOptions.filter(
      (option) => option.storageType === DriveStorageType.RestApi
    );

    this.hasCloudStorageOptions = !!this.cloudStorageOptions.length;

    this.otherStorageOptions = appConfig.driveStorageOptions.filter(
      (option) => option.storageType !== DriveStorageType.RestApi
    );
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
