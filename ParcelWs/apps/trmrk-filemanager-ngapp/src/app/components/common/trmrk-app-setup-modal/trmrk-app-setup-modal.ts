import { Component, Inject, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NullOrUndef } from '../../../../trmrk/core';
import { getVarName } from '../../../../trmrk/Reflection/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';
import {
  AppServiceBase,
  AppObjectKeyDelims,
} from '../../../../trmrk-angular/services/common/app-service-base';
import { TrmrkDialog } from '../../../../trmrk-angular/components/common/trmrk-dialog/trmrk-dialog';
import { ModalService } from '../../../../trmrk-angular/services/common/modal-service';
import { ModalServiceFactory } from '../../../../trmrk-angular/services/common/modal-service-factory';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';
import { DriveStorageOption, DriveStorageType } from '../../../../trmrk/driveStorage/appConfig';

import { AppStateService } from '../../../services/common/app-state-service';
import { AppService } from '../../../services/common/app-service';
import { AppConfig } from '../../../services/common/app-config';
import { AppDriveStorageOption } from '../../../services/common/driveStorageOption';

export interface TrmrkAppSetupDialogComponentData extends TrmrkDialogComponentDataCore {
  optionChosen: (option: AppDriveStorageOption) => void;
}

@Component({
  selector: 'trmrk-app-setup-modal',
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, TrmrkDialog],
  templateUrl: './trmrk-app-setup-modal.html',
  styleUrl: './trmrk-app-setup-modal.scss',
})
export class TrmrkAppSetupModal implements OnDestroy {
  DriveStorageType = DriveStorageType;
  mergeDialogData = mergeDialogData;
  fileSystemApiFolderPickerId: string;
  modalService: ModalService;

  /* isLoading: boolean | null = null;
  showSuccessMessage = 0;
  showErrorMessage = 0;
  errorMessage: string | NullOrUndef;
  loadingFinished: boolean | null = null; */

  cloudStorageOptions: DriveStorageOption[];
  otherStorageOptions: DriveStorageOption[];
  hasCloudStorageOptions: boolean;

  selectedStorageOption: DriveStorageOption | null = null;
  fileSystemApiDirHandle: FileSystemDirectoryHandle | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkAppSetupDialogComponentData>,
    public dialogRef: MatDialogRef<any>,
    @Inject(AppServiceBase) private appService: AppService,
    @Inject(AppStateServiceBase) private appStateService: AppStateService,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef,
    @Inject(injectionTokens.appConfig.token) appConfig: AppConfig
  ) {
    this.fileSystemApiFolderPickerId = appService.getAppObjectKey(
      [getVarName(() => TrmrkAppSetupModal)],
      {
        delims: AppObjectKeyDelims.windowShowDirectoryPicker,
        includeAppName: false,
      }
    );

    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkAppSetupModal),
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

    this.otherStorageOptions = driveStorageOptions.filter(
      (option) => option.storageType !== DriveStorageType.RestApi
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.modalService.destroy();
  }

  chooseStorageOption(option: DriveStorageOption) {
    this.selectedStorageOption = option;
  }

  async chooseFileSystemApiRootFolder() {
    this.fileSystemApiDirHandle = (await (window as any).showDirectoryPicker({
      id: this.fileSystemApiFolderPickerId,
    })) as FileSystemDirectoryHandle;

    this.data.data.optionChosen({
      ...this.selectedStorageOption!,
      rootFolder: this.fileSystemApiDirHandle,
    });

    this.modalService.closeModal();
  }
}
