import { cast, withVal } from '../../../../../trmrk/core';

import {
  DbAdapterBase,
  DbStoreAdapter,
} from '../../../../../trmrk-browser/indexedDB/DbAdapterBase';

import {
  createDbStoreIfNotExists,
  createIndexIfNotExists,
} from '../../../../../trmrk-browser/indexedDB/core';

import { mapObjProps } from '../../../../../trmrk/obj';
import { namesOf } from '../../../../../trmrk/Reflection/core';

import {
  IntIdnfItemCore,
  IntIdnfItem,
  IntIdnfItemFileSize,
  IntIdnfItemTimeStamps,
  IntIdnfTextFileContent,
  IntIdnfDirChildrenIdnfs,
  IntIdnfFileContent,
  IntIdnfFileContentRef,
} from '../core';

export interface IntIdnfDirHandleItem extends IntIdnfItemCore {
  dirHandle: FileSystemDirectoryHandle;
}

export interface IntIdnfFileHandleItem extends IntIdnfItemCore {
  fileHandle: FileSystemFileHandle;
}

export class FsApiDriveItemsDbStores {
  public readonly folderChildrenIdnfs = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.FolderChildrenIdnfs.name
  );

  public readonly items = new DbStoreAdapter(FsApiDriveItemsDbAdapter.DB_STORES.Items.name);

  public readonly itemFileSizes = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.ItemFileSizes.name
  );

  public readonly itemTimeStamps = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.ItemTimeStamps.name
  );

  public readonly textFileContents = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.TextFileContents.name
  );

  public readonly dirHandles = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.DirHandles.name
  );

  public readonly fileHandles = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.FileHandles.name
  );

  public readonly fileContentRefs = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.FileContentRefs.name
  );

  public readonly fileContents = new DbStoreAdapter(
    FsApiDriveItemsDbAdapter.DB_STORES.FileContents.name
  );
}

export class FsApiDriveItemsDbAdapter extends DbAdapterBase {
  public static readonly DB_NAME = 'FsApiDriveItems';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze(
    mapObjProps(
      {
        FolderChildrenIdnfs: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfDirChildrenIdnfs>(), [(v) => v.Idnf])),
        },
        Items: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfItem>(), [(v) => v.Idnf])),
          indexes: Object.freeze(
            mapObjProps(
              {
                nameAndPrIdnf: {
                  name: '',
                  keyPath: Object.freeze(
                    namesOf(() => cast<IntIdnfItem>(), [(v) => v.Name, (v) => v.PrIdnf])
                  ),
                },
              },
              (propVal, propName) => Object.freeze({ ...propVal, name: propName })
            )
          ),
        },
        ItemFileSizes: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfItemFileSize>(), [(v) => v.Idnf])),
        },
        ItemTimeStamps: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfItemTimeStamps>(), [(v) => v.Idnf])),
        },
        TextFileContents: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfTextFileContent>(), [(v) => v.Idnf])),
        },
        DirHandles: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfDirHandleItem>(), [(v) => v.Idnf])),
        },
        FileHandles: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfFileHandleItem>(), [(v) => v.Idnf])),
        },
        FileContentRefs: {
          name: '',
          keyPath: Object.freeze(
            namesOf(() => cast<IntIdnfFileContentRef>(), [(v) => v.ContentIdnf])
          ),
          indexes: Object.freeze(
            mapObjProps(
              {
                idnf: {
                  name: '',
                  keyPath: Object.freeze(
                    namesOf(() => cast<IntIdnfFileContentRef>(), [(v) => v.Idnf])
                  ),
                },
              },
              (propVal, propName) => Object.freeze({ ...propVal, name: propName })
            )
          ),
        },
        FileContents: {
          name: '',
          keyPath: Object.freeze(namesOf(() => cast<IntIdnfFileContent>(), [(v) => v.ContentIdnf])),
        },
      },
      (propVal, propName) => Object.freeze({ ...propVal, name: propName })
    )
  );

  public readonly stores = new FsApiDriveItemsDbStores();

  constructor(appName: string, version: number = FsApiDriveItemsDbAdapter.DB_VERSION) {
    super({
      appName,
      version,
      dbName: FsApiDriveItemsDbAdapter.DB_NAME,
      isCacheDb: true,
    });
  }

  override onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void {
    const dbStores = FsApiDriveItemsDbAdapter.DB_STORES;

    createDbStoreIfNotExists(db, dbStores.FolderChildrenIdnfs.name, () => ({
      keyPath: [...dbStores.FolderChildrenIdnfs.keyPath],
    }));

    createDbStoreIfNotExists(
      db,
      dbStores.Items.name,
      () => ({
        keyPath: [...dbStores.Items.keyPath],
        autoIncrement: true,
      }),
      (dbStore) => {
        withVal(dbStores.Items.indexes.nameAndPrIdnf, (nameAndPrIdnfIdx) => {
          createIndexIfNotExists(dbStore, nameAndPrIdnfIdx.name, [...nameAndPrIdnfIdx.keyPath], () => ({
            unique: true,
          }));
        });
      }
    );

    createDbStoreIfNotExists(db, dbStores.ItemFileSizes.name, () => ({
      keyPath: [...dbStores.ItemFileSizes.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.ItemTimeStamps.name, () => ({
      keyPath: [...dbStores.ItemTimeStamps.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.TextFileContents.name, () => ({
      keyPath: [...dbStores.TextFileContents.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.DirHandles.name, () => ({
      keyPath: [...dbStores.DirHandles.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.FileHandles.name, () => ({
      keyPath: [...dbStores.FileHandles.keyPath],
    }));

    createDbStoreIfNotExists(
      db,
      dbStores.FileContentRefs.name,
      () => ({
        keyPath: [...dbStores.FileContentRefs.keyPath],
        autoIncrement: true,
      }),
      (dbStore) => {
        withVal(dbStores.FileContentRefs.indexes.idnf, (nameIdx) => {
          createIndexIfNotExists(dbStore, nameIdx.name, [...nameIdx.keyPath], () => ({
            unique: true,
          }));
        });
      }
    );

    createDbStoreIfNotExists(db, dbStores.FileContents.name, () => ({
      keyPath: [...dbStores.FileContents.keyPath],
    }));
  }
}
