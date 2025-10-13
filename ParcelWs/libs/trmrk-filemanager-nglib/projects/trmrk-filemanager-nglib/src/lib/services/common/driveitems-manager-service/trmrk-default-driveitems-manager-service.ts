import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  FilesAndFoldersTuple,
  DriveEntryCore,
  DriveEntry,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { DriveItem, DriveItemTypeCore, FileTextContentsDataCore } from './drive-item';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
} from './trmrk-driveitems-manager-core';

import { TrmrkDriveItemsManagerServiceBase } from './trmrk-driveitems-manager-service-base';
import { TrmrkFileManagerServiceBase } from '../filemanager-service/trmrk-filemanager-service-base';

@Injectable()
export class DefaultDriveItemsManagerService<
  TRootFolder
> extends TrmrkDriveItemsManagerServiceBase<TRootFolder> {
  constructor(private fileManagerService: TrmrkFileManagerServiceBase<TRootFolder>) {
    super();
  }

  setup(args: TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>): Promise<void> {
    return this.fileManagerService.setup(args);
  }

  async readPrIdnfs(idnfsArr: string[]): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readPrIdnfs(idnfsArr);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readNames(idnfsArr: string[]): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readNames(idnfsArr);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readFileSizes(idnfsArr: string[]): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readFileSizes(idnfsArr);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readTimeStamps(idnfsArr: string[]): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readTimeStamps(idnfsArr);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readFileTextContents(
    idnfsArr: string[]
  ): Promise<DriveItem<DriveItemTypeCore, FileTextContentsDataCore>[]> {
    const fileTextContentsArr = await this.fileManagerService.readFileTextContents(idnfsArr);

    const driveItemsArr = fileTextContentsArr.map(
      (entry) => ({ ...entry } as unknown as DriveItem<DriveItemTypeCore, FileTextContentsDataCore>)
    );

    for (let item of driveItemsArr) {
      item.data = {
        content: (item as unknown as DriveEntry<string>).Content,
      };
    }

    return driveItemsArr;
  }

  async copyEntries(
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));

    const tuple = await this.fileManagerService.copyEntries(
      folderEntriesArr,
      fileEntriesArr,
      overwrite
    );

    return tuple;
  }

  async renameOrMoveEntries(
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[],
    overwrite: boolean
  ): Promise<void> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));
    await this.fileManagerService.renameOrMoveEntries(folderEntriesArr, fileEntriesArr, overwrite);
  }

  async deleteEntries(
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[]
  ): Promise<void> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));
    await this.fileManagerService.deleteEntries(folderEntriesArr, fileEntriesArr);
  }

  async writeFileTextContents(
    filesArr: DriveItem<DriveItemTypeCore, FileTextContentsDataCore>[],
    overwrite: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntry<string>));

    for (let entry of fileEntriesArr) {
      entry.Content = (
        entry as unknown as DriveItem<DriveItemTypeCore, FileTextContentsDataCore>
      ).data.content;
    }

    const retEntriesArr = await this.fileManagerService.writeFileTextContents(
      fileEntriesArr,
      overwrite
    );

    const retArr = retEntriesArr.map(
      (entry) => ({ ...entry } as unknown as DriveItem<DriveItemTypeCore>)
    );

    return retArr;
  }
}
