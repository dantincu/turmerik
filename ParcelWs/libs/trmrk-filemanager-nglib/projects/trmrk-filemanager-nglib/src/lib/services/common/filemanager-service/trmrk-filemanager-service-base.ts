import { Injectable, OnDestroy } from '@angular/core';

import { TrmrkDisaposable } from '../../../../trmrk-angular/services/common/types';

import {
  DriveEntryCore,
  DriveEntry,
  DriveEntryX,
  FilesAndFoldersTuple,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { NullOrUndef } from '../../../../trmrk/core';

import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from '../driveitems-manager-service/trmrk-driveitems-manager-core';

import { ContentItemCore } from '../driveitems-manager-service/drive-item';
import { ContentFileCallback, FileContentFactory } from '../indexedDb/core';

export interface TrmrkFileManagerServiceCore<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder
> extends DriveItemsManagerCore<TSetupArgs, TWorkArgs, TRootFolder, DriveEntryCore> {}

@Injectable()
export abstract class TrmrkFileManagerServiceBase<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder
> implements
    OnDestroy,
    Disposable,
    TrmrkDisaposable,
    TrmrkFileManagerServiceCore<TSetupArgs, TWorkArgs, TRootFolder>
{
  public currentStorageOption!: AppDriveStorageOption<TRootFolder>;
  public currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;

  ngOnDestroy(): void {
    this.dispose();
  }

  [Symbol.dispose]() {
    this.dispose();
  }

  dispose() {
    this.currentStorageOption = null!;
    this.currentStorageUserIdnf = null!;
  }

  setup(args: TSetupArgs) {
    this.currentStorageOption = args.currentStorageOption;
    this.currentStorageUserIdnf = args.currentStorageUserIdnf;
  }

  abstract normalizeWorkItems(wka: TWorkArgs): Promise<TWorkArgs>;

  abstract readPathIdnfs(
    wka: TWorkArgs,
    itemsMx: DriveEntryCore[][] | string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]>;

  abstract readNames(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract readSubFolderIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]>;

  abstract readFolderFileIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]>;

  abstract readFolderChildIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][][]>;

  abstract readFileSizes(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract readTimeStamps(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract readFolderDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract readFileDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract readItemDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]>;

  abstract readFileTextContents(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntry<string>[]>;

  abstract readFileContents(
    wka: TWorkArgs,
    pathsArr: string[],
    callback: ContentFileCallback,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]>;

  abstract copyEntries(
    wka: TWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract renameOrMoveEntries(
    wka: TWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<void>;

  abstract deleteEntries(
    wka: TWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[]
  ): Promise<void>;

  abstract writeFileTextContents(
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]>;

  abstract writeFileContents(
    wka: TWorkArgs,
    filesArr: DriveEntryCore[],
    callback: FileContentFactory,
    overwrite: boolean
  ): Promise<DriveEntryCore[]>;

  abstract createFolders(
    wka: TWorkArgs,
    foldersArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]>;
}
