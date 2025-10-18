import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  FilesAndFoldersTuple,
  DriveEntryCore,
  DriveEntry,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { DriveItem, DriveItemTypeCore, ContentItemCore } from './drive-item';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  DriveItemsManagerCore,
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from './trmrk-driveitems-manager-core';

import { ContentFileCallback, FileContentFactory } from '../indexedDb/core';

import { TrmrkDriveItemsManagerServiceBase } from './trmrk-driveitems-manager-service-base';
import { TrmrkFileManagerServiceBase } from '../filemanager-service/trmrk-filemanager-service-base';

@Injectable()
export class DefaultDriveItemsManagerService<
  TSetupArgs extends TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>,
  TWorkArgs extends TrmrkDriveItemsManagerWorkArgsCore,
  TRootFolder
> extends TrmrkDriveItemsManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder> {
  constructor(
    private fileManagerService: TrmrkFileManagerServiceBase<TSetupArgs, TWorkArgs, TRootFolder>
  ) {
    super();
  }

  setup(args: TSetupArgs) {
    this.fileManagerService.setup(args);
  }

  normalizeWorkItems(wka: TWorkArgs): Promise<TWorkArgs> {
    return this.fileManagerService.normalizeWorkItems(wka);
  }

  async readPathIdnfs(
    wka: TWorkArgs,
    itemsMx: DriveItem<DriveItemTypeCore>[][] | string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[][]> {
    const fsEntriesMx = await this.fileManagerService.readPathIdnfs(wka, itemsMx, forceRefresh);

    const driveItemsMx = fsEntriesMx.map((fsEntriesArr) =>
      fsEntriesArr.map((entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>))
    );

    return driveItemsMx;
  }

  async readSubFolderIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[][]> {
    const fsEntriesMx = await this.fileManagerService.readSubFolderIdnfs(
      wka,
      pathsArr,
      forceRefresh
    );

    const driveItemsMx = fsEntriesMx.map((arr) =>
      arr.map((entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>))
    );

    return driveItemsMx;
  }

  async readFolderFileIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[][]> {
    const fsEntriesMx = await this.fileManagerService.readFolderFileIdnfs(
      wka,
      pathsArr,
      forceRefresh
    );

    const driveItemsMx = fsEntriesMx.map((arr) =>
      arr.map((entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>))
    );

    return driveItemsMx;
  }

  async readFolderChildIdnfs(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[][][]> {
    const fsEntriesMx = await this.fileManagerService.readFolderChildIdnfs(
      wka,
      pathsArr,
      forceRefresh
    );

    const driveItemsMx = fsEntriesMx.map((mx) =>
      mx.map((arr) => arr.map((entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)))
    );

    return driveItemsMx;
  }

  async readNames(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean = false
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readNames(
      wka,
      pathsArr,
      areFilesArr,
      forceRefresh
    );

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readFileSizes(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean = false
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readFileSizes(wka, pathsArr, forceRefresh);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async readTimeStamps(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean = false
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readTimeStamps(
      wka,
      pathsArr,
      areFilesArr,
      forceRefresh
    );

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  override async readFolderDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readFolderDetails(
      wka,
      pathsArr,
      forceRefresh
    );

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  override async readFileDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fsEntriesArr = await this.fileManagerService.readFileDetails(wka, pathsArr, forceRefresh);

    const driveItemsArr = fsEntriesArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  override async readItemDetails(
    wka: TWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[][]> {
    const fsEntriesMx = await this.fileManagerService.readItemDetails(
      wka,
      pathsArr,
      areFilesArr,
      forceRefresh
    );

    const driveItemsMx = fsEntriesMx.map((arr) =>
      arr.map((entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>))
    );

    return driveItemsMx;
  }

  async readFileTextContents(
    wka: TWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean = false
  ): Promise<ContentItemCore<string>[]> {
    const fileTextContentsArr = await this.fileManagerService.readFileTextContents(
      wka,
      pathsArr,
      forceRefresh
    );

    return fileTextContentsArr;
  }

  async readFileContents(
    wka: TWorkArgs,
    pathsArr: string[],
    callback: ContentFileCallback,
    forceRefresh: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fileTextContentsArr = await this.fileManagerService.readFileContents(
      wka,
      pathsArr,
      callback,
      forceRefresh
    );

    const driveItemsArr = fileTextContentsArr.map(
      (entry) => ({ ...entry } as DriveItem<DriveItemTypeCore>)
    );

    return driveItemsArr;
  }

  async copyEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));

    const tuple = await this.fileManagerService.copyEntries(
      wka,
      folderEntriesArr,
      fileEntriesArr,
      overwrite
    );

    return tuple;
  }

  async renameOrMoveEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[],
    overwrite: boolean
  ): Promise<void> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));
    await this.fileManagerService.renameOrMoveEntries(
      wka,
      folderEntriesArr,
      fileEntriesArr,
      overwrite
    );
  }

  async deleteEntries(
    wka: TWorkArgs,
    foldersArr: DriveItem<DriveItemTypeCore, any>[],
    filesArr: DriveItem<DriveItemTypeCore, any>[]
  ): Promise<void> {
    const folderEntriesArr = foldersArr.map(
      (folder) => ({ ...folder } as unknown as DriveEntryCore)
    );

    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntryCore));
    await this.fileManagerService.deleteEntries(wka, folderEntriesArr, fileEntriesArr);
  }

  async writeFileTextContents(
    wka: TWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const fileEntriesArr = filesArr.map((file) => ({ ...file } as unknown as DriveEntry<string>));

    for (let entry of fileEntriesArr) {
      entry.Content = (
        entry as unknown as DriveItem<DriveItemTypeCore, ContentItemCore<string>>
      ).data.Content;
    }

    const retEntriesArr = await this.fileManagerService.writeFileTextContents(
      wka,
      fileEntriesArr,
      overwrite
    );

    const retArr = retEntriesArr.map(
      (entry) => ({ ...entry } as unknown as DriveItem<DriveItemTypeCore>)
    );

    return retArr;
  }

  async writeFileContents(
    wka: TWorkArgs,
    filesArr: DriveItem<DriveItemTypeCore>[],
    callback: FileContentFactory,
    overwrite: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const retEntriesArr = await this.fileManagerService.writeFileContents(
      wka,
      filesArr,
      callback,
      overwrite
    );

    const retArr = retEntriesArr.map(
      (entry) => ({ ...entry } as unknown as DriveItem<DriveItemTypeCore>)
    );

    return retArr;
  }

  async createFolders(
    wka: TWorkArgs,
    foldersArr: DriveItem<DriveItemTypeCore>[],
    overwrite: boolean
  ): Promise<DriveItem<DriveItemTypeCore>[]> {
    const retEntriesArr = await this.fileManagerService.createFolders(wka, foldersArr, overwrite);

    const retArr = retEntriesArr.map(
      (entry) => ({ ...entry } as unknown as DriveItem<DriveItemTypeCore>)
    );

    return retArr;
  }
}
