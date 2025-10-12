import { Injectable } from '@angular/core';

import { TrmrkFileManagerServiceBase } from './trmrk-filemanager-service-base';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveEntryCore,
  DriveEntry,
  FilesAndFoldersTuple,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

@Injectable()
export class TrmrkFileSystemApiFileManagerService extends TrmrkFileManagerServiceBase<FileSystemDirectoryHandle> {
  async setupCore() {}

  override readPrIdnfs(idnfsArr: string[]): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override readNames(idnfsArr: string[]): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override readFileSizes(idnfsArr: string[]): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override readTimeStamps(idnfsArr: string[]): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override readFileTextContents(idnfsArr: string[]): Promise<DriveEntry<string>[]> {
    throw new Error('Method not implemented.');
  }

  override copyEntries(
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>> {
    throw new Error('Method not implemented.');
  }

  override renameOrMoveEntries(
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override deleteEntries(foldersArr: DriveEntryCore[], filesArr: DriveEntryCore[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override writeFileTextContents(
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }
}
