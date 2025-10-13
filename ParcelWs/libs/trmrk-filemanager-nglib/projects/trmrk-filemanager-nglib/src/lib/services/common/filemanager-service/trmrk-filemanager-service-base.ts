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
} from '../driveitems-manager-service/driveitems-manager-core';

export interface ITrmrkFileManagerServiceCore
  extends DriveItemsManagerCore<DriveEntryCore, DriveEntry<string>> {}

export interface TrmrkFileManagerServiceSetupArgs<TRootFolder>
  extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder> {}

@Injectable()
export abstract class TrmrkFileManagerServiceBase<TRootFolder>
  implements OnDestroy, Disposable, TrmrkDisaposable, ITrmrkFileManagerServiceCore
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
