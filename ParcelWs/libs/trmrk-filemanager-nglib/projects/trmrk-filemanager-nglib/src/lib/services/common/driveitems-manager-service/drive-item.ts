import { NullOrUndef } from '../../../../trmrk/core';
import { DriveEntryCore } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { NamedItemCore } from '../indexedDb/core';

export enum DriveItemTypeCore {
  None = 0,
  Folder,
  File,
}

export interface ContentItemCore<TContent> extends NamedItemCore {
  Content: TContent;
}

export interface DriveItemCore<
  TDriveItem extends DriveItemCore<TDriveItem, TDriveItemType>,
  TDriveItemType = DriveItemTypeCore
> extends NamedItemCore,
    DriveEntryCore {
  itemType: TDriveItemType;
  childItems?: TDriveItem[] | NullOrUndef;
}

export interface DriveItem<TDriveItemType = DriveItemTypeCore, TData = any>
  extends DriveItemCore<DriveItem<TDriveItemType>, TDriveItemType> {
  data: TData;
}
