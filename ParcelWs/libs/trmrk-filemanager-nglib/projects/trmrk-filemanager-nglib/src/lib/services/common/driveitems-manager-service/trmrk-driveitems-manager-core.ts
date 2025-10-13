import { FilesAndFoldersTuple } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';
import { NullOrUndef } from '../../../../trmrk/core';

import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

export interface DriveItemsManagerCore<TRootFolder, TDriveItem, TTextFile> {
  setup: (args: TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>) => Promise<void>;
  readPrIdnfs: (idnfsArr: string[]) => Promise<TDriveItem[]>;
  readNames: (idnfsArr: string[]) => Promise<TDriveItem[]>;
  readFileSizes: (idnfsArr: string[]) => Promise<TDriveItem[]>;
  readTimeStamps: (idnfsArr: string[]) => Promise<TDriveItem[]>;
  readFileTextContents: (idnfsArr: string[]) => Promise<TTextFile[]>;
  copyEntries: (
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean
  ) => Promise<FilesAndFoldersTuple<string>>;
  renameOrMoveEntries: (
    foldersArr: TDriveItem[],
    filesArr: TDriveItem[],
    overwrite: boolean
  ) => Promise<void>;
  deleteEntries: (foldersArr: TDriveItem[], filesArr: TDriveItem[]) => Promise<void>;
  writeFileTextContents: (filesArr: TTextFile[], overwrite: boolean) => Promise<TDriveItem[]>;
}

export interface TrmrkDriveItemsManagerSetupArgsCore<TRootFolder> {
  currentStorageOption: AppDriveStorageOption<TRootFolder>;
  currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;
}
