import { Injectable, OnDestroy, Inject } from '@angular/core';

import { DriveStorageType } from '../../../../trmrk/driveStorage/appConfig';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';
import { NgAppConfigCore } from '../../../../trmrk-angular/services/common/app-config';
import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';
import { TimeStampGeneratorBase } from '../../../../trmrk-angular/services/common/timestamp-generator-base';

import {
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from '../driveitems-manager-service/trmrk-driveitems-manager-core';

import { FileManagerIndexedDbDatabasesService } from '../indexedDb/filemanager-indexed-db-databases-service';
import { TrmrkFileManagerServiceBase } from './trmrk-filemanager-service-base';
import { TrmrkFileSystemApiFileManagerService } from './trmrk-file-system-api-filemanager-service';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

@Injectable()
export abstract class TrmrkFileManagerServiceFactoryBase {
  abstract create<
    TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
    TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
    TRootFolder
  >(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkFileManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder>;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkFileManagerServiceFactory
  extends TrmrkFileManagerServiceFactoryBase
  implements OnDestroy
{
  constructor(
    private fileManagerIndexedDbDatabasesService: FileManagerIndexedDbDatabasesService,
    private appStateService: AppStateServiceBase,
    private timeStampGenerator: TimeStampGeneratorBase,
    @Inject(injectionTokens.appConfig.token) private appConfig: NgAppConfigCore
  ) {
    super();
  }

  override create<
    TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
    TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
    TRootFolder
  >(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkFileManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder> {
    let service: TrmrkFileManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder>;

    switch (currentStorageOption.storageType) {
      case DriveStorageType.FileSystemApi:
        service = new TrmrkFileSystemApiFileManagerService(
          this.fileManagerIndexedDbDatabasesService,
          this.appStateService,
          this.timeStampGenerator,
          this.appConfig
        ) as TrmrkFileManagerServiceBase<
          TrmrkDriveItemsManagerSetupArgsCore<FileSystemDirectoryHandle>,
          TrmrkDriveItemsManagerWorkArgsCore,
          FileSystemDirectoryHandle
        > as TrmrkFileManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder>;
        break;
      default:
        throw new Error(
          `File manager service type not supported: ${
            DriveStorageType[currentStorageOption.storageType]
          }: ${currentStorageOption.key}`
        );
    }

    return service;
  }

  ngOnDestroy(): void {}
}
