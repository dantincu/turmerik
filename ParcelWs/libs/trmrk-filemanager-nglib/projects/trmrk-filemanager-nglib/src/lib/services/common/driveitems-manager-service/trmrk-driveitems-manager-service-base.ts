import { NullOrUndef } from '../../../../trmrk/core';
import { FilesAndFoldersTuple } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { DriveItem, DriveItemTypeCore, ContentItemCore } from './drive-item';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from './trmrk-driveitems-manager-core';

import { ContentFileCallback, FileContentFactory } from '../indexedDb/core';

export interface TrmrkDriveItemsManagerServiceCore<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder,
  TDriveItemType = DriveItemTypeCore
> extends DriveItemsManagerCore<TSetupArgs, TWorkArgs, TRootFolder, DriveItem<TDriveItemType>> {}

export abstract class TrmrkDriveItemsManagerServiceBase<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder,
  TDriveItemType = DriveItemTypeCore
> implements TrmrkDriveItemsManagerServiceCore<TSetupArgs, TWorkArgs, TRootFolder, TDriveItemType>
{
  public currentStorageOption!: AppDriveStorageOption<TRootFolder>;
  public currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;

  abstract setup(args: TSetupArgs): void;

  abstract normalizeWorkItems(wka: TWorkArgs): Promise<TWorkArgs>;

  abstract readPathIdnfs(
    wka: TWorkArgs,
    itemsMx: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readSubFolderIdnfs(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFolderFileIdnfs(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFolderChildIdnfs(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][][]>;

  abstract readNames(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileSizes(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readTimeStamps(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFolderDetails(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileDetails(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readItemDetails(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFileTextContents(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[] | string,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ): Promise<ContentItemCore<string>[]>;

  abstract readFileContents(
    wka: TWorkArgs,
    pathsArr: (DriveItem<TDriveItemType>[] | string)[],
    callback: ContentFileCallback,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract copyEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean,
    forceRefresh: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract renameOrMoveEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean,
    forceRefresh: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract deleteEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    forceRefresh: boolean
  ): Promise<void>;

  abstract writeFileTextContents(
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract writeFileContents(
    wka: TWorkArgs,
    filesArr: DriveItem<TDriveItemType>[],
    callback: FileContentFactory,
    overwrite: boolean,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract createFolders(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType>[],
    overwrite: boolean,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;
}
