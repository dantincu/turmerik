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
} from '../driveitems-manager-service/trmrk-driveitems-manager-core';

export interface TrmrkFileManagerServiceCore<TRootFolder>
  extends DriveItemsManagerCore<TRootFolder, DriveEntryCore, DriveEntry<string>> {}

@Injectable()
export abstract class TrmrkFileManagerServiceBase<TRootFolder>
  implements OnDestroy, Disposable, TrmrkDisaposable, TrmrkFileManagerServiceCore<TRootFolder>
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

  async setup(args: TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>) {
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
    filesArr: DriveEntry<string>[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]>;
}
