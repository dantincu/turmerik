import { NullOrUndef } from '../../../../trmrk/core';
import { DriveEntryCore } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

export enum DriveItemTypeCore {
  None = 0,
  Folder,
  File,
}

export interface FileTextContentsDataCore {
  content: string;
}

export interface DriveItemCore<
  TDriveItem extends DriveItemCore<TDriveItem, TDriveItemType>,
  TDriveItemType = DriveItemTypeCore
> extends DriveEntryCore {
  itemType: TDriveItemType;
  childItems?: TDriveItem[] | NullOrUndef;
}

export interface DriveItem<TDriveItemType = DriveItemTypeCore, TData = any>
  extends DriveItemCore<DriveItem<TDriveItemType>, TDriveItemType> {
  data: TData;
}
