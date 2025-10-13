import { DriveItem, DriveItemTypeCore, FileTextContentsDataCore } from './drive-item';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
} from './driveitems-manager-core';

export interface ITrmrkDriveItemsManagerServiceCore<
  TDriveItemType extends DriveItemTypeCore = DriveItemTypeCore
> extends DriveItemsManagerCore<
    DriveItem<TDriveItemType>,
    DriveItem<TDriveItemType, FileTextContentsDataCore>
  > {}

export interface TrmrkDriveItemsServiceSetupArgs<TRootFolder>
  extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder> {}
