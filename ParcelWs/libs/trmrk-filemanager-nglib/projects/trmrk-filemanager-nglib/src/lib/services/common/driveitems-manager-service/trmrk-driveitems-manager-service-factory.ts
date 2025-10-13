import { Injectable, OnDestroy } from '@angular/core';

import { DriveStorageType } from '../../../../trmrk/driveStorage/appConfig';

import { TrmrkDriveItemsManagerServiceBase } from './trmrk-driveitems-manager-service-base';
import { DefaultDriveItemsManagerService } from './trmrk-default-driveitems-manager-service';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';
import { TrmrkFileManagerServiceFactoryBase } from '../filemanager-service/trmrk-filemanager-service-factory';

@Injectable()
export abstract class TrmrkDriveItemsManagerServiceFactoryBase {
  abstract create<TRootFolder>(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkDriveItemsManagerServiceBase<TRootFolder>;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkDriveItemsManagerServiceFactory
  extends TrmrkDriveItemsManagerServiceFactoryBase
  implements OnDestroy
{
  constructor(private fileManagerServiceFactory: TrmrkFileManagerServiceFactoryBase) {
    super();
  }

  override create<TRootFolder>(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkDriveItemsManagerServiceBase<TRootFolder> {
    let service: TrmrkDriveItemsManagerServiceBase<TRootFolder>;

    switch (currentStorageOption.storageType) {
      case DriveStorageType.FileSystemApi:
        service = this.getDefaultDriveItemsManagerService(currentStorageOption);
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

  getDefaultDriveItemsManagerService<TRootFolder>(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ) {
    const fileManagerService = this.fileManagerServiceFactory.create(currentStorageOption);
    const driveItemsService = new DefaultDriveItemsManagerService(fileManagerService);
    return driveItemsService;
  }
}
