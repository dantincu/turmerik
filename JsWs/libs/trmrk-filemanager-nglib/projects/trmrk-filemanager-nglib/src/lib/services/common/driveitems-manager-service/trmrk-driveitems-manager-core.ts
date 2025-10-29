import { FilesAndFoldersTuple } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';
import { MtblRefValue, NullOrUndef } from '../../../../trmrk/core';

import { NamedItemCore } from '../indexedDb/core';
import { ContentFileCallback, FileContentFactory } from '../indexedDb/files';
import { ContentItemCore } from './drive-item';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

export interface DriveItemsManagerCore<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder,
  TDriveItem extends NamedItemCore
> {
  setup: (args: TSetupArgs) => void;

  normalizeWorkItems: (wka: TWorkArgs) => Promise<TWorkArgs>;

  readPathIdnfs: (
    wka: TWorkArgs,
    itemsMx: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readSubFolderIdnfs: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFolderFileIdnfs: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFolderChildIdnfs: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][][]>;

  readNames: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFileSizes: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readTimeStamps: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFolderDetails: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFileDetails: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readItemDetails: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFileTextContents: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ) => Promise<ContentItemCore<string>[]>;

  readFileContents: (
    wka: TWorkArgs,
    pathsArr: (TDriveItem[] | string)[],
    callback: ContentFileCallback,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ) => Promise<NamedItemCore[]>;

  copyEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean,
    forceRefresh: boolean
  ) => Promise<FilesAndFoldersTuple<string>>;

  renameOrMoveEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean,
    forceRefresh: boolean
  ) => Promise<FilesAndFoldersTuple<string>>;

  deleteEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    forceRefresh: boolean
  ) => Promise<void>;

  writeFileTextContents: (
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ) => Promise<TDriveItem[]>;

  writeFileContents: (
    wka: TWorkArgs,
    filesArr: TDriveItem[],
    callback: FileContentFactory,
    overwrite: boolean,
    forceRefresh: boolean,
    cacheContent: boolean | NullOrUndef
  ) => Promise<TDriveItem[]>;

  createFolders: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    overwrite: boolean,
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;
}

export interface TrmrkDriveItemsManagerWorkArgsCore {
  db?: IDBDatabase | NullOrUndef;
  wkIdx?: MtblRefValue<number> | NullOrUndef;
  wkItemPrIdx?: MtblRefValue<number> | NullOrUndef;
  wkItemScIdx?: MtblRefValue<number> | NullOrUndef;
}

export interface TrmrkDriveItemsManagerSetupArgsCore<TRootFolder> {
  currentStorageOption: AppDriveStorageOption<TRootFolder>;
  currentStorageUserIdnf?: StorageUserIdnf | NullOrUndef;
}
