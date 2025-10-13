import { NullOrUndef } from '../../../../trmrk/core';
import { FilesAndFoldersTuple } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { DriveItem, DriveItemTypeCore, FileTextContentsDataCore } from './drive-item';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
} from './trmrk-driveitems-manager-core';

export interface TrmrkDriveItemsManagerServiceCore<TRootFolder, TDriveItemType = DriveItemTypeCore>
  extends DriveItemsManagerCore<
    TRootFolder,
    DriveItem<TDriveItemType>,
    DriveItem<TDriveItemType, FileTextContentsDataCore>
  > {}

export abstract class TrmrkDriveItemsManagerServiceBase<
  TRootFolder,
  TDriveItemType = DriveItemTypeCore
> implements TrmrkDriveItemsManagerServiceCore<TRootFolder, TDriveItemType>
{
  public currentStorageOption!: AppDriveStorageOption<TRootFolder>;
  public currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;

  abstract setup(args: TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>): Promise<void>;

  abstract readPrIdnfs(idnfsArr: string[]): Promise<DriveItem<TDriveItemType>[]>;

  abstract readNames(idnfsArr: string[]): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileSizes(idnfsArr: string[]): Promise<DriveItem<TDriveItemType>[]>;

  abstract readTimeStamps(idnfsArr: string[]): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileTextContents(
    idnfsArr: string[]
  ): Promise<DriveItem<TDriveItemType, FileTextContentsDataCore>[]>;

  abstract copyEntries(
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract renameOrMoveEntries(
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean
  ): Promise<void>;

  abstract deleteEntries(
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[]
  ): Promise<void>;

  abstract writeFileTextContents(
    filesArr: DriveItem<TDriveItemType, FileTextContentsDataCore>[],
    overwrite: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;
}
