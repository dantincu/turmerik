import { FilesAndFoldersTuple } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';
import { AnyOrUnknown, MtblRefValue, NullOrUndef } from '../../../../trmrk/core';

import { NamedItemCore, ContentFileCallback, FileContentFactory } from '../indexedDb/core';
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
    itemsMx: TDriveItem[][] | string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readSubFolderIdnfs: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFolderFileIdnfs: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFolderChildIdnfs: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[][][]>;

  readNames: (
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFileSizes: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readTimeStamps: (
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFolderDetails: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readFileDetails: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<TDriveItem[]>;

  readItemDetails: (
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ) => Promise<TDriveItem[][]>;

  readFileTextContents: (
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ) => Promise<ContentItemCore<string>[]>;

  readFileContents: (
    wka: TWorkArgs,
    pathsArr: string[],
    callback: ContentFileCallback,
    forceRefresh: boolean
  ) => Promise<NamedItemCore[]>;

  copyEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean
  ) => Promise<FilesAndFoldersTuple<string>>;

  renameOrMoveEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean
  ) => Promise<void>;

  deleteEntries: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[]
  ) => Promise<void>;

  writeFileTextContents: (
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean
  ) => Promise<TDriveItem[]>;

  writeFileContents: (
    wka: TWorkArgs,
    filesArr: TDriveItem[],
    callback: FileContentFactory,
    overwrite: boolean
  ) => Promise<TDriveItem[]>;

  createFolders: (
    wka: TWorkArgs,
    foldersArr: TDriveItem[],
    overwrite: boolean
  ) => Promise<TDriveItem[]>;
}

export interface TrmrkDriveItemsManagerWorkArgsCore {
  db?: IDBDatabase | NullOrUndef;
  tran?: IDBTransaction | NullOrUndef;
  wkIdx?: MtblRefValue<number> | NullOrUndef;
  wkItemPrIdx?: MtblRefValue<number> | NullOrUndef;
  wkItemScIdx?: MtblRefValue<number> | NullOrUndef;
}

export interface TrmrkDriveItemsManagerSetupArgsCore<TRootFolder> {
  currentStorageOption: AppDriveStorageOption<TRootFolder>;
  currentStorageUserIdnf?: StorageUserIdnf | NullOrUndef;
}
