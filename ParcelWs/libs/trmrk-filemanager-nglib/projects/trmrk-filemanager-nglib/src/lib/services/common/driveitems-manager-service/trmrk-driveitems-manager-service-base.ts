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
    itemsMx: DriveItem<TDriveItemType>[][] | string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readSubFolderIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFolderFileIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFolderChildIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][][]>;

  abstract readNames(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileSizes(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readTimeStamps(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFolderDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readFileDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract readItemDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[][]>;

  abstract readFileTextContents(
    wka: TWorkArgs,
    pathsArr: string[] | string,
    forceRefresh: boolean
  ): Promise<ContentItemCore<string>[]>;

  abstract readFileContents(
    wka: TWorkArgs,
    pathsArr: string[],
    callback: ContentFileCallback,
    forceRefresh: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract copyEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract renameOrMoveEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[],
    overwrite: boolean
  ): Promise<void>;

  abstract deleteEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType, any>[],
    filesArr: DriveItem<TDriveItemType, any>[]
  ): Promise<void>;

  abstract writeFileTextContents(
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract writeFileContents(
    wka: TWorkArgs,
    filesArr: DriveItem<TDriveItemType>[],
    callback: FileContentFactory,
    overwrite: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;

  abstract createFolders(
    wka: TWorkArgs,
    foldersArr: DriveItem<TDriveItemType>[],
    overwrite: boolean
  ): Promise<DriveItem<TDriveItemType>[]>;
}
