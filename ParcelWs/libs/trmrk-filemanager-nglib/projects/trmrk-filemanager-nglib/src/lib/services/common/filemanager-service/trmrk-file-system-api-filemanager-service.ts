import { Injectable, Inject } from '@angular/core';

import {
  AnyOrUnknown,
  NullOrUndef,
  RefLazyValue,
  MtblRefValue,
  actWithVal,
} from '../../../../trmrk/core';

import { getTextFromUint8ArrayChunks } from '../../../../trmrk/text';
import { sortCachedItems } from '../../../../trmrk-browser/indexedDB/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';
import { TimeStampGeneratorBase } from '../../../../trmrk-angular/services/common/timestamp-generator-base';

import {
  dbRequestToPromise,
  openDbRequestToPromise,
  CachedItemCore,
} from '../../../../trmrk-browser/indexedDB/core';

import {
  DriveEntryCore,
  DriveEntry,
  FilesAndFoldersTuple,
} from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';

import { NgAppConfigCore } from '../../../../trmrk-angular/services/common/app-config';
import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';

import {
  TrmrkDriveItemsManagerSetupArgsCore,
  TrmrkDriveItemsManagerWorkArgsCore,
} from '../driveitems-manager-service/trmrk-driveitems-manager-core';

import { TrmrkFileManagerServiceBase } from './trmrk-filemanager-service-base';
import { AppDriveStorageOption, StorageUserIdnf } from '../driveStorageOption';

import {
  IntIdnfItem,
  IntIdnfItemCore,
  IntIdnfItemFileSize,
  IntIdnfItemTimeStamps,
  IntIdnfDirChildrenIdnfs,
  IntIdnfFileContentRef,
  IntIdnfFileContent,
  ContentFileCallback,
  FileContentFactory,
  writeFileContentToIndexDb,
} from '../indexedDb/core';

import {
  IntIdnfDirHandleItem,
  IntIdnfFileHandleItem,
  FsApiDriveItemsDbAdapter,
} from '../indexedDb/databases/FsApiDriveItems';

import { FileManagerIndexedDbDatabasesService } from '../indexedDb/filemanager-indexed-db-databases-service';
import { ContentItemCore } from '../driveitems-manager-service/drive-item';

export interface TrmrkFileSystemApiFileManagerServiceWorkArgs
  extends TrmrkDriveItemsManagerWorkArgsCore {
  useFolderChildrenIdnfs?: boolean | NullOrUndef;
  useItems?: boolean | NullOrUndef;
  useItemFileSizes?: boolean | NullOrUndef;
  useItemTimeStamps?: boolean | NullOrUndef;
  useTextFileContents?: boolean | NullOrUndef;
  useDirHandles?: boolean | NullOrUndef;
  useFileHandles?: boolean | NullOrUndef;
  useFileContents?: boolean | NullOrUndef;
  useFileContentRefs?: boolean | NullOrUndef;

  folderChildrenIdnfs?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  items?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  itemFileSizes?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  itemTimeStamps?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  textFileContents?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  dirHandles?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  fileHandles?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  fileContents?: RefLazyValue<IDBObjectStore> | NullOrUndef;
  fileContentRefs?: RefLazyValue<IDBObjectStore> | NullOrUndef;
}

interface ReadItemDetailsOpts {
  readNames?: boolean | NullOrUndef;
  readFileSizes?: boolean | NullOrUndef;
  readTimeStamps?: boolean | NullOrUndef;
}

interface GetItemDetailsOptsCore {
  wka: TrmrkFileSystemApiFileManagerServiceWorkArgs;
  areFilesArr: (boolean | NullOrUndef)[];
  forceRefresh: boolean;
  condition: boolean | NullOrUndef;
  canBeFolder?: boolean | NullOrUndef;
  pathItemsArr: DriveEntryCore[];
  intIdnf: number;
  dbStore: RefLazyValue<IDBObjectStore>;
  isFile: MtblRefValue<boolean | NullOrUndef>;
  timeStamp: number;
  handleItem: MtblRefValue<IntIdnfDirHandleItem | IntIdnfFileHandleItem | null>;
}

interface GetItemDetailsOpts<TDbItem extends IntIdnfItemCore> extends GetItemDetailsOptsCore {
  dbItemIsNotStaleCallback: (
    opts: GetItemDetailsOpts<TDbItem>,
    dbItem: TDbItem
  ) => Promise<AnyOrUnknown> | AnyOrUnknown;
  fileHandleCallback?:
    | ((
        opts: GetItemDetailsOpts<TDbItem>,
        fileHandle: FileSystemFileHandle
      ) => Promise<TDbItem | NullOrUndef> | TDbItem | NullOrUndef)
    | NullOrUndef;
  dirHandleCallback?:
    | ((
        opts: GetItemDetailsOpts<TDbItem>,
        fileHandle: FileSystemDirectoryHandle
      ) => Promise<TDbItem | NullOrUndef> | TDbItem | NullOrUndef)
    | NullOrUndef;
}

@Injectable()
export class TrmrkFileSystemApiFileManagerService extends TrmrkFileManagerServiceBase<
  TrmrkDriveItemsManagerSetupArgsCore<FileSystemDirectoryHandle>,
  TrmrkFileSystemApiFileManagerServiceWorkArgs,
  FileSystemDirectoryHandle
> {
  private clientFetchTmStmpMillis: number;

  constructor(
    private fileManagerIndexedDbDatabasesService: FileManagerIndexedDbDatabasesService,
    private appStateService: AppStateServiceBase,
    private timeStampGenerator: TimeStampGeneratorBase,
    @Inject(injectionTokens.appConfig.token) private appConfig: NgAppConfigCore
  ) {
    super();
    this.clientFetchTmStmpMillis = appStateService.clientFetchTmStmpMillis.value;
  }

  override async normalizeWorkItems(wka: TrmrkFileSystemApiFileManagerServiceWorkArgs) {
    wka.wkIdx ??= {
      value: -2,
    };

    wka.wkItemPrIdx ??= {
      value: 0,
    };

    wka.wkItemScIdx ??= {
      value: 0,
    };

    const fsApiDriveItemsDb =
      this.fileManagerIndexedDbDatabasesService.fsApiDriveItemsDbAdapter.value;

    wka.db ??= (await openDbRequestToPromise(fsApiDriveItemsDb.open())).value;
    const dbStores = fsApiDriveItemsDb.stores;
    const dbStoreNames: string[] = [];

    actWithVal<
      [boolean | NullOrUndef, string, (storeFactory: () => RefLazyValue<IDBObjectStore>) => void][]
    >(
      [
        [
          wka.useFolderChildrenIdnfs,
          dbStores.folderChildrenIdnfs.dbStoreName,
          (factory) => (wka.folderChildrenIdnfs ??= factory()),
        ],
        [wka.useItems, dbStores.items.dbStoreName, (factory) => (wka.items ??= factory())],
        [
          wka.useItemFileSizes,
          dbStores.itemFileSizes.dbStoreName,
          (factory) => (wka.itemFileSizes ??= factory()),
        ],
        [
          wka.useItemTimeStamps,
          dbStores.itemTimeStamps.dbStoreName,
          (factory) => (wka.itemTimeStamps ??= factory()),
        ],
        [
          wka.useTextFileContents,
          dbStores.textFileContents.dbStoreName,
          (factory) => (wka.textFileContents ??= factory()),
        ],
        [
          wka.useDirHandles,
          dbStores.dirHandles.dbStoreName,
          (factory) => (wka.dirHandles ??= factory()),
        ],
        [
          wka.useFileHandles,
          dbStores.fileHandles.dbStoreName,
          (factory) => (wka.fileHandles ??= factory()),
        ],
        [
          wka.useFileContents,
          dbStores.fileContents.dbStoreName,
          (factory) => (wka.fileContents ??= factory()),
        ],
        [
          wka.useFileContentRefs,
          dbStores.fileContentRefs.dbStoreName,
          (factory) => (wka.fileContentRefs ??= factory()),
        ],
      ],
      (argsArr) => {
        for (let arg of argsArr) {
          const [addStore, storeName, assignStoreFunc] = arg;

          if (addStore) {
            dbStoreNames.push(storeName);

            assignStoreFunc(
              () => new RefLazyValue<IDBObjectStore>(() => wka.tran!.objectStore(storeName))
            );
          }
        }
      }
    );

    wka.tran ??= await wka.db.transaction(dbStoreNames, 'readwrite');
    wka.wkIdx.value++;
    return wka;
  }

  override async readPathIdnfs(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    itemsMx: DriveEntryCore[][] | string[],
    forceRefresh: boolean = false
  ): Promise<DriveEntryCore[][]> {
    wka.useItems = true;
    wka = await this.normalizeWorkItems(wka);
    const timeStamp = this.timeStampGenerator.millis();
    const resolvedItemsArr: IntIdnfItem[] = [];

    const getResolved = (name: string, prIntIdnf: number) => {
      let resolvedItem = resolvedItemsArr.find(
        (item) => item.PrIdnf === prIntIdnf && item.Name === name
      );

      if (!resolvedItem) {
        resolvedItem = {
          Name: name,
          PrIdnf: prIntIdnf,
          clientFetchTmStmpMillis: timeStamp,
        } as IntIdnfItem;

        resolvedItemsArr.push(resolvedItem);
      }

      return resolvedItem;
    };

    let prIntIdnf: number = 0;

    itemsMx = itemsMx.map((itemsArr) =>
      'string' === typeof itemsArr
        ? itemsArr.split('/').map(
            (name) =>
              ({
                Name: name,
              } as DriveEntryCore)
          )
        : itemsArr
    );

    for (let i = 0; i < itemsMx.length; i++) {
      wka.wkItemPrIdx!.value = i;
      wka.wkItemScIdx!.value = 0;
      const itemsArr = itemsMx[i];

      for (let j = 0; j < itemsArr.length; j++) {
        wka.wkItemScIdx!.value = j;
        const item = itemsArr[j];
        let intIdnf: number;

        if ((item.Idnf ?? null) === null) {
          const resolvedItem = getResolved(item.Name!, prIntIdnf);
          let dbItem = resolvedItem;

          if ((dbItem.Idnf ?? null) === null) {
            dbItem = (
              await wka
                .items!.value.index(
                  FsApiDriveItemsDbAdapter.DB_STORES.Items.indexes.nameAndPrIdnf.name
                )
                .get([item.Name!, prIntIdnf])
            ).result as IntIdnfItem;

            if (dbItem) {
              intIdnf = dbItem.Idnf;
            } else {
              intIdnf = (await wka.items!.value.put(resolvedItem)).result as number;
            }
          } else {
            intIdnf = dbItem.Idnf;
          }

          resolvedItem.Idnf = intIdnf;
          item.Idnf = intIdnf.toString();
        } else {
          intIdnf = parseInt(item.Idnf!);
        }

        prIntIdnf = intIdnf;
      }
    }

    wka.wkIdx!.value++;
    return itemsMx;
  }

  override async readSubFolderIdnfs(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]> {
    const folderFileIdnfs = (await this.readFolderChildIdnfs(wka, pathsArr, forceRefresh))[0];
    return folderFileIdnfs;
  }

  override async readFolderFileIdnfs(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]> {
    const folderFileIdnfs = (await this.readFolderChildIdnfs(wka, pathsArr, forceRefresh))[1];
    return folderFileIdnfs;
  }

  override async readFolderChildIdnfs(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][][]> {
    wka.useItems = true;
    wka.useFolderChildrenIdnfs = true;
    wka.useDirHandles = true;
    wka = await this.normalizeWorkItems(wka);
    const timeStamp = this.timeStampGenerator.millis();
    const pathItemsMx: DriveEntryCore[][] = await this.readPathIdnfs(wka, pathsArr);
    const retMx: DriveEntryCore[][][] = [];

    for (let i = 0; i < pathItemsMx.length; i++) {
      wka.wkItemPrIdx!.value = i;
      wka.wkItemScIdx!.value = 0;
      const path = pathItemsMx[i];
      const folder = path[path.length - 1];
      const idnf = folder.Idnf!;
      const intIdnf = parseInt(idnf);

      const dbFolder = (await wka.folderChildrenIdnfs!.value.get([intIdnf]))
        .result as IntIdnfDirChildrenIdnfs;

      wka.wkItemScIdx!.value++;

      if (!this.dbItemIsStale(dbFolder, forceRefresh)) {
        retMx[i] = [
          dbFolder.subFolderIdnfs.map(
            (subFolderIdnf) =>
              ({
                Idnf: subFolderIdnf.toString(),
              } as DriveEntryCore)
          ),
          dbFolder.folderFileIdnfs.map(
            (subFolderIdnf) =>
              ({
                Idnf: subFolderIdnf.toString(),
              } as DriveEntryCore)
          ),
        ];
      } else {
        retMx[i] = await this.getFolderChildrenArr(wka, timeStamp, path, intIdnf, forceRefresh);
      }
    }

    return retMx;
  }

  override async readNames(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | NullOrUndef,
    forceRefresh: boolean = false
  ): Promise<DriveEntryCore[]> {
    wka.useItems = true;
    wka = await this.normalizeWorkItems(wka);
    const timeStamp = this.timeStampGenerator.millis();
    const pathItemsMx: DriveEntryCore[][] = await this.readPathIdnfs(wka, pathsArr);

    const retArr = await this.readNamesCore(wka, pathItemsMx, areFilesArr, forceRefresh, timeStamp);
    return retArr;
  }

  override async readFileSizes(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean = false
  ): Promise<DriveEntryCore[]> {
    const itemsMx = await this.readItemDetailsCore(wka, pathsArr, null, true, forceRefresh, {
      readFileSizes: true,
    });

    const retArr = itemsMx[1];
    return retArr;
  }

  override async readTimeStamps(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | NullOrUndef,
    forceRefresh: boolean = false
  ): Promise<DriveEntryCore[]> {
    const itemsMx = await this.readItemDetailsCore(wka, pathsArr, null, areFilesArr, forceRefresh, {
      readTimeStamps: true,
    });

    const retArr = [...itemsMx[0], ...itemsMx[1]];
    return retArr;
  }

  override async readFolderDetails(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]> {
    const itemsMx = await this.readItemDetailsCore(wka, pathsArr, null, false, forceRefresh);
    const retArr = itemsMx[0];
    return retArr;
  }

  override async readFileDetails(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]> {
    const itemsMx = await this.readItemDetailsCore(wka, pathsArr, null, true, forceRefresh);
    const retArr = itemsMx[1];
    return retArr;
  }

  override async readItemDetails(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[][]> {
    const itemsMx = await this.readItemDetailsCore(wka, pathsArr, null, areFilesArr, forceRefresh);
    return itemsMx;
  }

  override async readFileTextContents(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    forceRefresh: boolean = false
  ): Promise<DriveEntry<string>[]> {
    const retArr: DriveEntry<string>[] = [];
    const retContentArr: Uint8Array<ArrayBuffer>[][] = [];
    let currentContent: Uint8Array<ArrayBuffer>[] | null = null;

    await this.readFileContents(
      wka,
      pathsArr,
      async (item, result) => {
        if (result) {
          if (result.value) {
            currentContent!.push(result.value);
          }
        } else {
          retArr.push({
            Idnf: item.Idnf,
            Name: item.Name,
          } as DriveEntry<string>);

          retContentArr.push((currentContent = []));
        }
      },
      forceRefresh
    );

    wka.wkIdx!.value++;

    for (let i = 0; i < retArr.length; i++) {
      wka.wkItemPrIdx!.value = i;
      retArr[i].Content = getTextFromUint8ArrayChunks(retContentArr[i]);
    }

    return retArr;
  }

  override async readFileContents(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[],
    callback: ContentFileCallback,
    forceRefresh: boolean
  ): Promise<DriveEntryCore[]> {
    wka.useItems = true;
    wka.useFileHandles = true;
    wka.useFileContentRefs = true;
    wka.useFileContents = true;
    wka = await this.normalizeWorkItems(wka);
    const timeStamp = this.timeStampGenerator.millis();
    const pathItemsMx: DriveEntryCore[][] = await this.readPathIdnfs(wka, pathsArr);

    const retArr: DriveEntryCore[] = [];

    for (let i = 0; i < pathItemsMx.length; i++) {
      wka.wkItemPrIdx!.value = i;
      wka.wkItemScIdx!.value = 0;
      const path = pathItemsMx[i];
      const item = path[path.length - 1];
      const intIdnf = parseInt(item.Idnf!);
      retArr[i] = item;

      await this.getFileHandle(
        wka,
        path.slice(0, path.length - 1),
        item,
        timeStamp,
        forceRefresh,
        (fileHandle) => this.writeFileContentToIndexDb(wka, fileHandle, callback, item, intIdnf)
      );
    }

    return retArr;
  }

  override copyEntries(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<FilesAndFoldersTuple<string>> {
    throw new Error('Method not implemented.');
  }

  override renameOrMoveEntries(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override deleteEntries(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    foldersArr: DriveEntryCore[],
    filesArr: DriveEntryCore[]
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override writeFileTextContents(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    filesArr: ContentItemCore<string>[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override writeFileContents(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    filesArr: DriveEntryCore[],
    callback: FileContentFactory,
    overwrite: boolean
  ): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  override createFolders(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    foldersArr: DriveEntryCore[],
    overwrite: boolean
  ): Promise<DriveEntryCore[]> {
    throw new Error('Method not implemented.');
  }

  private async readNamesCore(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathItemsMx: DriveEntryCore[][],
    areFilesArr: (boolean | NullOrUndef)[] | NullOrUndef,
    forceRefresh: boolean,
    timeStamp: number
  ) {
    const retArr: DriveEntryCore[] = [];

    for (let i = 0; i < pathItemsMx.length; i++) {
      const path = pathItemsMx[i];
      const item = path[path.length - 1];
      const idnf = item.Idnf!;
      const intIdnf = parseInt(idnf);

      const dbItem = (await wka.items!.value.get([intIdnf])).result as IntIdnfItem;

      retArr[i] = {
        Idnf: idnf,
        Name: dbItem.Name,
      } as DriveEntryCore;
    }

    return retArr;
  }

  private async writeFileContentToIndexDb(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    fileHandle: FileSystemFileHandle,
    callback: ContentFileCallback,
    item: DriveEntryCore,
    intIdnf: number
  ) {
    wka.wkItemScIdx!.value++;
    const file = await fileHandle.getFile();
    const stream = file.stream();
    const reader = stream.getReader();

    await writeFileContentToIndexDb({
      wkItemScIdx: wka.wkItemScIdx!,
      appConfig: this.appConfig,
      callback,
      fileContentRefs: wka.fileContentRefs!,
      fileContents: wka.fileContents!,
      fileContentRefsIdxName: FsApiDriveItemsDbAdapter.DB_STORES.FileContentRefs.indexes.idnf.name,
      idnf: intIdnf,
      item,
      readBytes: () => reader.read(),
    });
  }

  private async readItemDetailsCore(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathsArr: string[] | null,
    pathItemsMx: DriveEntryCore[][] | null,
    areFilesArr: (boolean | NullOrUndef)[] | boolean | NullOrUndef,
    forceRefresh: boolean,
    opts?: ReadItemDetailsOpts | NullOrUndef
  ) {
    opts ??= {
      readNames: true,
      readFileSizes: true,
      readTimeStamps: true,
    };

    wka.useItems = true;
    wka.useItemFileSizes = true;
    wka.useItemTimeStamps = true;
    wka.useDirHandles = true;
    wka.useFileHandles = true;
    wka = await this.normalizeWorkItems(wka);
    const timeStamp = this.timeStampGenerator.millis();
    pathItemsMx ??= await this.readPathIdnfs(wka, pathsArr!);

    if ((areFilesArr ?? null) === null || 'object' !== typeof areFilesArr) {
      areFilesArr = pathItemsMx.map(() => areFilesArr as boolean | NullOrUndef);
    }

    const retEntriesArr = opts.readNames
      ? await this.readNamesCore(wka, pathItemsMx, areFilesArr, forceRefresh, timeStamp)
      : pathItemsMx.map(
          (path) =>
            ({
              Idnf: path[path.length - 1].Idnf!,
            } as DriveEntryCore)
        );

    wka.wkItemPrIdx!.value = 0;
    wka.wkItemScIdx!.value = 0;

    for (let i = 0; i < retEntriesArr.length; i++) {
      wka.wkItemPrIdx!.value++;

      let isFile = areFilesArr![i];
      const pathItemsArr = pathItemsMx[i];
      const item = pathItemsArr[pathItemsArr.length - 1];
      const intIdnf = parseInt(item.Idnf!);

      const optsCore: GetItemDetailsOptsCore = {
        wka,
        areFilesArr: areFilesArr as (boolean | NullOrUndef)[],
        forceRefresh,
        condition: opts.readFileSizes,
        pathItemsArr,
        intIdnf,
        dbStore: wka.itemFileSizes!,
        isFile: {
          value: isFile,
        },
        timeStamp,
        handleItem: {
          value: null,
        },
      };

      await this.getItemDetailsCore<IntIdnfItemFileSize>({
        ...optsCore,
        canBeFolder: false,
        dbItemIsNotStaleCallback: (opts, dbItem) => {
          wka.wkItemScIdx!.value++;

          opts.isFile.value = true;
          retEntriesArr[i].FileSizeBytes = dbItem.FileSizeBytes;
        },
        fileHandleCallback: async (opts, fileHandle) => {
          wka.wkItemScIdx!.value++;

          opts.isFile.value = true;
          const file = await fileHandle.getFile();
          const fileSizeBytes = file.size;
          retEntriesArr[i].FileSizeBytes = fileSizeBytes;

          return {
            Idnf: intIdnf,
            clientFetchTmStmpMillis: timeStamp,
            FileSizeBytes: fileSizeBytes,
          };
        },
      });

      wka.wkItemScIdx!.value++;

      await this.getItemDetailsCore<IntIdnfItemTimeStamps>({
        ...optsCore,
        dbItemIsNotStaleCallback: async (opts, dbItem) => {
          wka.wkItemScIdx!.value++;

          retEntriesArr[i].CreationTimeUtcMillis = dbItem.CreationTimeUtcMillis;
          retEntriesArr[i].LastWriteTimeUtcMillis = dbItem.LastWriteTimeUtcMillis;
          retEntriesArr[i].LastAccessTimeUtcMillis = dbItem.LastAccessTimeUtcMillis;

          if ((opts.isFile.value ?? null) === null) {
            await this.getItemHandle(
              wka,
              pathItemsArr.slice(0, pathItemsArr.length - 1),
              pathItemsArr[pathItemsArr.length - 1],
              timeStamp,
              isFile,
              opts.forceRefresh,
              async (handleItemVal) => {
                wka.wkItemScIdx!.value++;

                opts.handleItem.value = handleItemVal;
                opts.isFile.value = !!(handleItemVal as IntIdnfFileHandleItem).fileHandle;
              }
            );
          }
        },
        fileHandleCallback: async (opts, fileHandle) => {
          wka.wkItemScIdx!.value++;
          opts.isFile.value = true;

          opts.handleItem.value = {
            fileHandle,
          } as IntIdnfFileHandleItem;

          const file = await fileHandle.getFile();
          const lastModified = file.lastModified;

          const dbItem = {
            Idnf: intIdnf,
            clientFetchTmStmpMillis: timeStamp,
            LastAccessTimeUtcMillis: lastModified,
          } as IntIdnfItemTimeStamps;

          return dbItem;
        },
        dirHandleCallback: async (opts, dirHandle) => {
          wka.wkItemScIdx!.value++;
          opts.isFile.value = false;

          opts.handleItem.value = {
            dirHandle,
          } as IntIdnfDirHandleItem;

          return null;
        },
      });

      areFilesArr![i] = isFile;
    }

    const retMx = [
      retEntriesArr.filter((_, i) => areFilesArr![i] === false),
      retEntriesArr.filter((_, i) => areFilesArr![i] === true),
    ];

    if (retMx.map((arr) => arr.length).reduce((l1, l2) => l1 + l2) !== retEntriesArr.length) {
      throw new Error('Something wrong happend and we could not return meaningful data');
    }

    return retMx;
  }

  private async getItemDetailsCore<TDbItem extends IntIdnfItemCore>(
    opts: GetItemDetailsOpts<TDbItem>
  ) {
    let dbItem: TDbItem | NullOrUndef = null;

    if (opts.condition) {
      const isFile = opts.isFile;

      if (opts.canBeFolder !== false || isFile.value !== false) {
        dbItem = (await opts.dbStore.value.get([opts.intIdnf])).result as TDbItem;

        if (!this.dbItemIsStale(dbItem, opts.forceRefresh)) {
          await opts.dbItemIsNotStaleCallback(opts, dbItem);
        } else {
          const handleItemCallback = async () => {
            const fileHandle = (opts.handleItem.value as IntIdnfFileHandleItem).fileHandle;
            const dirHandle = (opts.handleItem.value as IntIdnfDirHandleItem).dirHandle;

            if (fileHandle && isFile.value !== false) {
              isFile.value = true;

              if (opts.fileHandleCallback) {
                dbItem = await opts.fileHandleCallback(opts, fileHandle);
              }
            } else if (dirHandle && isFile.value !== true) {
              isFile.value = false;

              if (opts.dirHandleCallback) {
                dbItem = await opts.dirHandleCallback(opts, dirHandle);
              }
            }
          };

          if (opts.handleItem) {
            await handleItemCallback();
          } else {
            const pathItemsArr = opts.pathItemsArr;
            const pathItemsArrMaxIdx = pathItemsArr.length - 1;

            await this.getItemHandle(
              opts.wka,
              pathItemsArr.slice(0, pathItemsArrMaxIdx),
              pathItemsArr[pathItemsArrMaxIdx],
              opts.timeStamp,
              isFile.value,
              opts.forceRefresh,
              async (handleItemVal) => {
                opts.handleItem.value = handleItemVal;
                await handleItemCallback();
              }
            );
          }
        }
      }
    }

    return dbItem;
  }

  private async getFolderChildrenArr(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    timeStamp: number,
    path: DriveEntryCore[],
    intIdnf: number,
    forceRefresh: boolean
  ) {
    const subFolderIdnfs: number[] = [];
    const folderFileIdnfs: number[] = [];
    const subFoldersArr: DriveEntryCore[] = [];
    const folderFilesArr: DriveEntryCore[] = [];

    await this.getDirHandle(
      wka,
      path,
      timeStamp,
      async (dirHandle) => {
        for await (const [key, value] of dirHandle.entries()) {
          wka.wkItemScIdx!.value = 0;

          let dbItem = (
            await wka
              .items!.value.index(
                FsApiDriveItemsDbAdapter.DB_STORES.Items.indexes.nameAndPrIdnf.name
              )
              .get([key, intIdnf])
          ).result as IntIdnfItem;

          wka.wkItemScIdx!.value++;

          if (this.dbItemIsStale(dbItem, forceRefresh)) {
            dbItem = {
              Name: key,
              PrIdnf: intIdnf,
              clientFetchTmStmpMillis: timeStamp,
            } as IntIdnfItem;

            dbItem.Idnf = (await wka.items!.value.put(dbItem)).result as number;
          }

          wka.wkItemScIdx!.value++;

          const entry = {
            Idnf: dbItem.Idnf.toString(),
          } as DriveEntryCore;

          wka.wkItemScIdx!.value++;

          if (value.kind === 'file') {
            subFoldersArr.push(entry);
          } else {
            folderFilesArr.push(entry);
          }
        }

        await wka.folderChildrenIdnfs!.value.put({
          Idnf: intIdnf,
          subFolderIdnfs,
          folderFileIdnfs,
          clientFetchTmStmpMillis: timeStamp,
        } as IntIdnfDirChildrenIdnfs);

        wka.wkItemScIdx!.value++;
      },
      forceRefresh
    );

    const retMx = [subFoldersArr, folderFilesArr];
    return retMx;
  }

  private async getItemHandle<T = AnyOrUnknown>(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathFoldersArr: DriveEntryCore[],
    itemEntry: DriveEntryCore,
    timeStamp: number,
    isFile: boolean | NullOrUndef,
    forceRefresh: boolean,
    callback:
      | ((itemHandle: IntIdnfDirHandleItem | IntIdnfFileHandleItem) => Promise<T>)
      | null = null
  ) {
    let retVal: T = undefined as T;
    callback ??= async (h) => h as T;
    const itemIntIdnf = parseInt(itemEntry.Idnf!);

    if (isFile === false) {
      return await this.getDirHandle(
        wka,
        [...pathFoldersArr, itemEntry],
        timeStamp,
        async (dirHandle) => {
          return await callback({
            dirHandle,
          } as IntIdnfDirHandleItem);
        },
        forceRefresh
      );
    } else if (isFile === true) {
      const fileHandleRef: MtblRefValue<FileSystemFileHandle | null> = {
        value: null,
      };

      retVal = (await this.whenFileHandleAvailable(
        wka,
        fileHandleRef,
        itemIntIdnf,
        forceRefresh,
        async (handle) => {
          await callback({
            Idnf: itemIntIdnf,
            fileHandle: handle,
            clientFetchTmStmpMillis: timeStamp,
          } as IntIdnfDirHandleItem | IntIdnfFileHandleItem);
        }
      ))!;

      if (!fileHandleRef.value) {
        retVal = await this.getDirHandle(
          wka,
          pathFoldersArr,
          timeStamp,
          async (prDirHandle) => {
            const fileHandle = await prDirHandle.getFileHandle(itemEntry.Name!);

            await wka.fileHandles!.value.put({
              Idnf: itemIntIdnf,
              fileHandle: fileHandle,
              clientFetchTmStmpMillis: timeStamp,
            } as IntIdnfFileHandleItem);

            retVal = await callback({ fileHandle } as IntIdnfFileHandleItem);
            return retVal;
          },
          forceRefresh
        );
      }
    } else {
      retVal = await this.getDirHandle(
        wka,
        pathFoldersArr,
        timeStamp,
        async (prDirHandle) => {
          const isFileRef: MtblRefValue<boolean | NullOrUndef> = {
            value: isFile,
          };

          const itemHandleRef: MtblRefValue<
            FileSystemFileHandle | FileSystemDirectoryHandle | null
          > = {
            value: null,
          };

          retVal = (await this.whenItemHandleAvailable(
            wka,
            isFileRef,
            itemHandleRef,
            itemIntIdnf,
            forceRefresh,
            callback
          ))!;

          if (!itemHandleRef.value) {
            const handleItem = await this.getItemHandleCore(prDirHandle, itemEntry.Name!, isFile);
            const dirHandle = (handleItem as IntIdnfDirHandleItem).dirHandle;
            const fileHandle = (handleItem as IntIdnfFileHandleItem).fileHandle;

            if (dirHandle) {
              const retObj = {
                Idnf: itemIntIdnf,
                dirHandle,
                clientFetchTmStmpMillis: timeStamp,
              } as IntIdnfDirHandleItem;

              await wka.dirHandles!.value.put(retObj);
              retVal = await callback(retObj);
            } else if (fileHandle) {
              const retObj = {
                Idnf: itemIntIdnf,
                fileHandle,
                clientFetchTmStmpMillis: timeStamp,
              } as IntIdnfFileHandleItem;

              await wka.fileHandles!.value.put(retObj);
              retVal = await callback(retObj);
            } else {
              throw new Error('Neither a file nor a folder handle was returned');
            }
          }

          return retVal;
        },
        forceRefresh
      );
    }

    return retVal;
  }

  private async getItemHandleCore(
    prDirHandle: FileSystemDirectoryHandle,
    entryName: string,
    isFile: boolean | NullOrUndef
  ) {
    if (isFile === false) {
      return (await this.getDirHandleItem(prDirHandle, entryName))!;
    } else if (isFile === true) {
      return await this.getFileHandleItem(prDirHandle, entryName);
    }

    const handleItem = await this.getHandleItem(prDirHandle, entryName);
    return handleItem;
  }

  private async getHandleItem(prDirHandle: FileSystemDirectoryHandle, entryName: string) {
    try {
      return this.getDirHandleItem(prDirHandle, entryName);
    } catch (err) {
      this.throwErrIfNotTypeMismatch(err);
    }

    return await this.getFileHandleItem(prDirHandle, entryName);
  }

  private async getDirHandleItem(prDirHandle: FileSystemDirectoryHandle, entryName: string) {
    const dirHandleItem = {
      dirHandle: await prDirHandle.getDirectoryHandle(entryName),
    } as IntIdnfDirHandleItem;

    return dirHandleItem;
  }

  private async getFileHandleItem(prDirHandle: FileSystemDirectoryHandle, entryName: string) {
    const fileHandleItem = {
      fileHandle: await prDirHandle.getFileHandle(entryName),
    } as IntIdnfFileHandleItem;

    return fileHandleItem;
  }

  private async getDirHandle<T = AnyOrUnknown>(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathFoldersArr: DriveEntryCore[],
    timeStamp: number,
    callback: ((dirHandle: FileSystemDirectoryHandle) => Promise<T>) | null = null,
    forceRefresh: boolean,
    offset = 0
  ) {
    let retVal: T = undefined as T;
    callback ??= async (h) => h as T;
    const dirHandleRef: MtblRefValue<FileSystemDirectoryHandle | null> = {
      value: null,
    };

    if (offset == pathFoldersArr.length) {
      dirHandleRef.value = this.currentStorageOption.rootFolder;
      retVal = await callback(dirHandleRef.value);
    } else {
      const folder = pathFoldersArr[pathFoldersArr.length - 1 - offset];
      const intIdnf = parseInt(folder.Idnf!);

      retVal = (await this.whenDirHandleAvailable(
        wka,
        dirHandleRef,
        intIdnf,
        forceRefresh,
        callback
      ))!;

      if (!dirHandleRef.value) {
        await this.getDirHandle(
          wka,
          pathFoldersArr,
          timeStamp,
          async (prDirHandle) => {
            dirHandleRef.value = await prDirHandle.getDirectoryHandle(folder.Name!);

            await wka.dirHandles!.value.put({
              Idnf: intIdnf,
              dirHandle: dirHandleRef.value,
              clientFetchTmStmpMillis: timeStamp,
            } as IntIdnfDirHandleItem);

            retVal = await callback(dirHandleRef.value);
          },
          forceRefresh,
          offset + 1
        );
      }
    }

    return retVal;
  }

  private async getFileHandle<T = AnyOrUnknown>(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    pathFoldersArr: DriveEntryCore[],
    fileEntry: DriveEntryCore,
    timeStamp: number,
    forceRefresh: boolean,
    callback: ((dirHandle: FileSystemFileHandle) => Promise<T>) | null = null
  ) {
    callback ??= async (h) => h as T;

    const retVal = await this.getItemHandle(
      wka,
      pathFoldersArr,
      fileEntry,
      timeStamp,
      true,
      forceRefresh,
      async (handleItem) => {
        return await callback((handleItem as IntIdnfFileHandleItem).fileHandle);
      }
    );

    return retVal;
  }

  private async whenDirHandleAvailable<T>(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    handleMtblRef: MtblRefValue<FileSystemDirectoryHandle | null>,
    intIdnf: number,
    forceRefresh: boolean,
    callback: (handle: FileSystemDirectoryHandle) => Promise<T>
  ) {
    return this.whenItemHandleAvailable<T, FileSystemDirectoryHandle>(
      wka,
      { value: true },
      handleMtblRef,
      intIdnf,
      forceRefresh,
      callback
    );
  }

  private async whenFileHandleAvailable<T>(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    handleMtblRef: MtblRefValue<FileSystemFileHandle | null>,
    intIdnf: number,
    forceRefresh: boolean,
    callback: (handle: FileSystemFileHandle) => Promise<T>
  ) {
    return this.whenItemHandleAvailable<T, FileSystemFileHandle>(
      wka,
      { value: false },
      handleMtblRef,
      intIdnf,
      forceRefresh,
      callback
    );
  }

  private async whenItemHandleAvailable<
    T,
    THandle = FileSystemDirectoryHandle | FileSystemFileHandle
  >(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    isFile: MtblRefValue<boolean | NullOrUndef>,
    handleMtblRef: MtblRefValue<FileSystemDirectoryHandle | FileSystemFileHandle | null>,
    intIdnf: number,
    forceRefresh: boolean,
    callback: (handle: THandle) => Promise<T>
  ) {
    const handleItem = await this.getDbItemHandleCore(wka, isFile, intIdnf);

    if (!this.dbItemIsStale(handleItem, forceRefresh)) {
      handleMtblRef.value = isFile.value
        ? (handleItem as IntIdnfFileHandleItem).fileHandle
        : (handleItem as IntIdnfDirHandleItem).dirHandle;
    }

    let retVal: T | null = null;
    let error: any | null = null;

    if (handleMtblRef.value) {
      try {
        retVal = await callback(handleMtblRef.value as THandle);
      } catch (err) {
        error = err;
        handleMtblRef.value = null;
      }

      if (error) {
        this.throwIfErrNotTipeMismatchOrStale(error);
        await (isFile.value ? wka.fileHandles : wka.dirHandles)!.value.delete([intIdnf]);
      }
    }

    return retVal;
  }

  private async getDbItemHandleCore(
    wka: TrmrkFileSystemApiFileManagerServiceWorkArgs,
    isFile: MtblRefValue<boolean | NullOrUndef>,
    intIdnf: number
  ) {
    let dbItem: IntIdnfDirHandleItem | IntIdnfFileHandleItem | null;

    if (isFile.value === false) {
      dbItem = (await wka.dirHandles!.value.get([intIdnf])).result;
    } else if (isFile.value === true) {
      dbItem = (await wka.fileHandles!.value.get([intIdnf])).result;
    } else {
      dbItem =
        (await wka.dirHandles!.value.get([intIdnf])).result ??
        (await wka.fileHandles!.value.get([intIdnf])).result;

      if (dbItem) {
        isFile.value = !!(dbItem as IntIdnfFileHandleItem).fileHandle;
      }
    }

    return dbItem;
  }

  private dbItemIsStale(dbItem: CachedItemCore | null, forceRefresh: boolean) {
    const isStale =
      !dbItem || (forceRefresh && dbItem.clientFetchTmStmpMillis < this.clientFetchTmStmpMillis);

    return isStale;
  }

  private throwErrIfNotTypeMismatch(err: any, additionalCondition?: boolean | NullOrUndef) {
    if ((err as DOMException).name !== 'TypeMismatchError' && !additionalCondition) {
      throw err;
    }
  }

  private throwIfErrNotTipeMismatchOrStale(err: any) {
    let additionalCondition: boolean | null = null;
    this.throwErrIfNotTypeMismatch(err, additionalCondition);
  }
}
