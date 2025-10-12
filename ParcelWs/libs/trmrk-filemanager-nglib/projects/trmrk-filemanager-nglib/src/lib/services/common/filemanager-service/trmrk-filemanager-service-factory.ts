import { Injectable, OnDestroy } from '@angular/core';

import { DriveStorageType } from '../../../../trmrk/driveStorage/appConfig';

import { TrmrkFileManagerServiceBase } from './trmrk-filemanager-service-base';
import { TrmrkFileSystemApiFileManagerService } from './trmrk-file-system-api-filemanager-service';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

@Injectable()
export abstract class TrmrkFileManagerServiceFactoryBase {
  abstract create<TRootFolder>(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkFileManagerServiceBase<TRootFolder>;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkFileManagerServiceFactory
  extends TrmrkFileManagerServiceFactoryBase
  implements OnDestroy
{
  override create<TRootFolder>(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkFileManagerServiceBase<TRootFolder> {
    let service: TrmrkFileManagerServiceBase<TRootFolder>;

    switch (currentStorageOption.storageType) {
      case DriveStorageType.FileSystemApi:
        service =
          new TrmrkFileSystemApiFileManagerService() as TrmrkFileManagerServiceBase<TRootFolder>;
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
