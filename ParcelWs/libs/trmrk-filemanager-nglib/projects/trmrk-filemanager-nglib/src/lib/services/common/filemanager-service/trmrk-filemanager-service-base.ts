import { Injectable, OnDestroy } from '@angular/core';

import { TrmrkDisaposable } from '../../../../trmrk-angular/services/common/types';

import {
  DriveEntryCore,
  DriveEntry,
  DriveEntryX,
  FilesAndFoldersTuple,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';
import { NullOrUndef } from '../../../../trmrk/core';

export interface ITrmrkFileManagerServiceCore {
  readPrIdnfs: (idnfsArr: string[]) => Promise<DriveEntryCore[]>;
  readNames: (idnfsArr: string[]) => Promise<DriveEntryCore[]>;
  readFileSizes: (idnfsArr: string[]) => Promise<DriveEntryCore[]>;
  readTimeStamps: (idnfsArr: string[]) => Promise<DriveEntryCore[]>;
  readFileTextContents: (idnfsArr: string[]) => Promise<DriveEntry<string>[]>;
  copyEntries: (
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ) => Promise<FilesAndFoldersTuple<string>>;
  renameOrMoveEntries: (
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ) => Promise<void>;
  deleteEntries: (foldersArr: DriveEntryCore[], filesArr: DriveEntryCore[]) => Promise<void>;
  writeFileTextContents: (
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ) => Promise<DriveEntryCore[]>;
}

export interface TrmrkFileManagerServiceSetupArgs<TRootFolder> {
  currentStorageOption: AppDriveStorageOption<TRootFolder>;
  currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;
}

@Injectable()
export abstract class TrmrkFileManagerServiceBase<TRootFolder>
  implements OnDestroy, Disposable, TrmrkDisaposable, ITrmrkFileManagerServiceCore
{
  protected currentStorageOption!: AppDriveStorageOption<TRootFolder>;
  protected currentStorageUserIdnf: StorageUserIdnf | NullOrUndef;

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

  async setup(args: TrmrkFileManagerServiceSetupArgs<TRootFolder>) {
    this.currentStorageOption = args.currentStorageOption;
    this.currentStorageUserIdnf = args.currentStorageUserIdnf;
    await this.setupCore();
  }

  abstract setupCore(): Promise<void>;

  abstract readPrIdnfs(idnfsArr: string[]): Promise<DriveEntryCore[]>;

  abstract readNames(idnfsArr: string[]): Promise<DriveEntryCore[]>;

  abstract readFileSizes(idnfsArr: string[]): Promise<DriveEntryCore[]>;

  abstract readTimeStamps(idnfsArr: string[]): Promise<DriveEntryCore[]>;

  abstract readFileTextContents(idnfsArr: string[]): Promise<DriveEntry<string>[]>;

  abstract copyEntries(
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>>;

  abstract renameOrMoveEntries(
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<void>;

  abstract deleteEntries(foldersArr: DriveEntryCore[], filesArr: DriveEntryCore[]): Promise<void>;

  abstract writeFileTextContents(
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]>;
}
