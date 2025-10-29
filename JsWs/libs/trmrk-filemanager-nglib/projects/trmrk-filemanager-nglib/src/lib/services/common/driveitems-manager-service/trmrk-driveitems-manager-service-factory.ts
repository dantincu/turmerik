import { Injectable, OnDestroy } from '@angular/core';

import { DriveStorageType } from '../../../../trmrk/driveStorage/appConfig';

import {
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from './trmrk-driveitems-manager-core';
import { TrmrkDriveItemsManagerServiceBase } from './trmrk-driveitems-manager-service-base';
import { DefaultDriveItemsManagerService } from './trmrk-default-driveitems-manager-service';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';
import { TrmrkFileManagerServiceFactoryBase } from '../filemanager-service/trmrk-filemanager-service-factory';

@Injectable()
export abstract class TrmrkDriveItemsManagerServiceFactoryBase {
  abstract create<
    TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
    TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
    TRootFolder
  >(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkDriveItemsManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder>;
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

  override create<
    TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
    TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
    TRootFolder
  >(
    currentStorageOption: AppDriveStorageOption<TRootFolder>
  ): TrmrkDriveItemsManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder> {
    let service: TrmrkDriveItemsManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder> = null!;

    switch (currentStorageOption.storageType) {
      case DriveStorageType.PostMessage:
        break;
    }

    service ??= this.getDefaultDriveItemsManagerService(currentStorageOption);
    return service;
  }

  ngOnDestroy(): void {}

  getDefaultDriveItemsManagerService<
    TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
    TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
    TRootFolder
  >(currentStorageOption: AppDriveStorageOption<TRootFolder>) {
    const fileManagerService = this.fileManagerServiceFactory.create<
      TSetupArgs,
      TWorkArgs,
      TRootFolder
    >(currentStorageOption);

    const driveItemsService = new DefaultDriveItemsManagerService<
      TSetupArgs,
      TWorkArgs,
      TRootFolder
    >(fileManagerService);

    return driveItemsService;
  }
}
